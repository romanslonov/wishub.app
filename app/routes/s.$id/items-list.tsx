import { Button } from "~/components/ui/button";
import { X, Link2, Gift } from "lucide-react";
import { HTMLAttributes, useEffect } from "react";
import { toast } from "sonner";
import { useFetcher, useRouteLoaderData } from "@remix-run/react";
import { cn } from "~/lib/cn";
import { User } from "lucia";
import { LocaleData } from "~/locales";

interface ItemsListProps extends HTMLAttributes<HTMLUListElement> {
  items: {
    id: string;
    reserverId: string | null;
    createdAt: string;
    url: string;
    name: string;
  }[];
  user: User | null;
  isMyself: boolean;
}

export function ItemsList({ items, isMyself, user, ...props }: ItemsListProps) {
  const data = useRouteLoaderData<{ t: LocaleData }>("routes/s.$id");

  if (items.length === 0) {
    return (
      <div className="border border-dashed bg-card rounded-2xl py-16 text-center">
        <div className="relative mb-8 h-48">
          <div className="absolute shadow-sm z-[2] top-0 left-[58%] sm:left-[53%] translate-x-[-53%] border w-32 h-48 rounded-xl bg-background transform rotate-12 mx-auto p-4 space-y-2">
            <div className="bg-gradient-to-b from-muted to-muted/50 h-16 rounded-md w-full"></div>
            <div className="bg-gradient-to-b from-muted to-muted/50 h-16 rounded-md w-full"></div>
          </div>
          <div className="absolute shadow-sm top-0 left-[37%] sm:left-[45%] translate-x-[-45%] border w-24 h-40 rounded-xl bg-background transform -rotate-12 z-[1] mx-auto p-4 space-y-2">
            <div className="bg-gradient-to-b from-muted to-muted/50 h-12 rounded-md w-full"></div>
            <div className="bg-gradient-to-b from-muted to-muted/50 h-12 rounded-md w-full"></div>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2 tracking-tight">
          {data?.t.shared.list.empty.title}
        </h2>
        <p className="text-center text-muted-foreground">
          {data?.t.shared.list.empty.subtitle}
        </p>
      </div>
    );
  }

  return (
    <ul className={props.className}>
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-4 shadow-sm lg:gap-8 relative justify-between border p-6 rounded-xl"
        >
          {item.reserverId ? (
            <div className="absolute top-0 left-[50%] translate-x-[-50%] border border-t-0 font-mono font-medium py-1 text-xs rounded-b-md px-4 bg-muted">
              {data?.t.common.reserved}{" "}
              {item.reserverId === user?.id && (
                <span>({data?.t.common.by_you})</span>
              )}
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

interface ItemActionsProps {
  item: { id: string; reserverId: string | null };
  isMyself: boolean;
}

function ItemActions({ item, isMyself }: ItemActionsProps) {
  const data = useRouteLoaderData<{ t: LocaleData }>("routes/s.$id");
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
      <input
        type="hidden"
        value={item.reserverId ? "unreserve" : "reserve"}
        name="action"
      />
      <Button
        type="submit"
        size="sm"
        variant={item.reserverId ? "outline" : "default"}
        className="gap-1.5"
      >
        {item.reserverId ? (
          <>
            <X size={16} />
            <span>{data?.t.shared.list.actions.unreserve}</span>
          </>
        ) : (
          <>
            <Gift size={16} />
            <span>{data?.t.shared.list.actions.reserve}</span>
          </>
        )}
      </Button>
    </fetcher.Form>
  );
}
