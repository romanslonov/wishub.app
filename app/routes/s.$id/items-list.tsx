import { Button } from "~/components/ui/button";
import { type Item } from "@prisma/client";
import { BookmarkCheck, Bookmark, Link2 } from "lucide-react";
import { HTMLAttributes, useEffect } from "react";
import { toast } from "sonner";
import { useFetcher } from "@remix-run/react";
import { cn } from "~/lib/cn";

interface ItemsListProps extends HTMLAttributes<HTMLUListElement> {
  items: Item[];
  listId: string;
  isAuthenticated: boolean;
  isMyself: boolean;
}

function ItemActions({ item, isMyself }: { item: Item; isMyself: boolean }) {
  const fetcher = useFetcher<{ message?: string; error?: string }>();

  useEffect(() => {
    if (fetcher.data?.message) {
      toast.success(fetcher.data.message);
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  return isMyself ? null : (
    <fetcher.Form method="post" className="flex items-center gap-2">
      <input type="hidden" value={item.id} name="itemId" />
      <Button
        type="submit"
        variant="outline"
        size="icon"
        className="w-8 h-8"
        disabled={!!item.reserverId}
      >
        {item.reserverId ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      </Button>
    </fetcher.Form>
  );
}

export function ItemsList({ items, isMyself, ...props }: ItemsListProps) {
  return (
    <ul {...props}>
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-4 shadow-sm lg:gap-8 relative justify-between border p-6 rounded-xl"
        >
          {item.reserverId ? (
            <div className="absolute top-0 left-[50%] translate-x-[-50%] border border-t-0 font-mono font-medium py-1 text-xs rounded-b-md px-4 bg-muted">
              Reserved
            </div>
          ) : null}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-muted-foreground">
                {new Date(item.createdAt).toDateString()}
              </div>
              <a
                href={item.url}
                target="_blank"
                className={cn([
                  "text-lg line-clamp-2 font-medium tracking-tight underline",
                  item.reserverId ? "text-muted-foreground" : "text-foreground",
                ])}
                rel="noreferrer"
              >
                <Link2 size={16} className="inline-block align-middle mr-1.5" />
                {item.name}
              </a>
            </div>
          </div>

          <ItemActions item={item} isMyself={isMyself} />
        </li>
      ))}
    </ul>
  );
}
