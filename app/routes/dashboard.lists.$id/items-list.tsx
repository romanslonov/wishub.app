import { type Item } from "@prisma/client";
import { useRouteLoaderData } from "@remix-run/react";
import { ListItem } from "~/components/list-item";
import { LocaleData } from "~/locales";
import { RemoveItemAlert } from "./remove-item-alert";
import { UpdateItemDialog } from "./update-item-dialog";

function ItemActions({ item }: { item: Item }) {
  return (
    <div className="flex items-center gap-2">
      <UpdateItemDialog item={item} />
      <RemoveItemAlert itemId={item.id} />
    </div>
  );
}

export function ItemsList({ items }: { items: Item[] }) {
  const data = useRouteLoaderData<{ t: LocaleData }>(
    "routes/dashboard.lists.$id"
  );

  if (items?.length === 0) {
    return (
      <div className="border border-dashed bg-card rounded-2xl py-16 text-center">
        <div className="relative mb-8 h-48">
          <div className="absolute shadow-md top-0 left-[58%] sm:left-[53%] translate-x-[-53%] border w-32 h-48 rounded-xl bg-background transform rotate-12 mx-auto p-4 space-y-2">
            <div className="bg-gradient-to-b from-muted to-muted/50 h-16 rounded-md w-full"></div>
            <div className="bg-gradient-to-b from-muted to-muted/50 h-16 rounded-md w-full"></div>
          </div>
          <div className="absolute shadow-sm top-0 left-[37%] sm:left-[45%] translate-x-[-45%] border w-24 h-40 rounded-xl bg-background transform -rotate-12 -z-10 mx-auto p-4 space-y-2">
            <div className="bg-gradient-to-b from-muted to-muted/50 h-12 rounded-md w-full"></div>
            <div className="bg-gradient-to-b from-muted to-muted/50 h-12 rounded-md w-full"></div>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2 tracking-tight">
          {data?.t.dashboard.list.empty.title}
        </h2>
        <p className="text-center text-muted-foreground">
          {data?.t.dashboard.list.empty.subtitle}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4 rounded-2xl">
      {items.map((item) => (
        <ListItem
          item={item}
          key={item.id}
          actions={<ItemActions item={item} />}
        />
      ))}
    </ul>
  );
}
