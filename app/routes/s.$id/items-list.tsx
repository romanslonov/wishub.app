import { ListItem } from "~/components/list-item";
import { Button } from "~/components/ui/button";
import { type Item } from "@prisma/client";
import { BookmarkCheck } from "lucide-react";
import { HTMLAttributes, useEffect } from "react";
import { toast } from "sonner";
import { useFetcher } from "@remix-run/react";

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
        <BookmarkCheck size={16} />
      </Button>
    </fetcher.Form>
  );
}

export function ItemsList({
  items,
  listId,
  isAuthenticated,
  isMyself,
  ...props
}: ItemsListProps) {
  return (
    <ul {...props}>
      {items.map((item) => (
        <ListItem
          item={item}
          key={item.id}
          actions={<ItemActions item={item} isMyself={isMyself} />}
        />
      ))}
    </ul>
  );
}
