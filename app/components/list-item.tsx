import { type Item } from "@prisma/client";
import { Link2 } from "lucide-react";

export function ListItem({
  item,
  actions,
}: {
  item: Item;
  actions: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-4 shadow-sm bg-card lg:gap-8 relative justify-between border p-6 rounded-xl">
      {item.reserverId ? (
        <div className="absolute top-0 left-[50%] translate-x-[-50%] border border-t-0 font-mono py-1 text-xs rounded-b-md px-4 bg-muted">
          Reserved
        </div>
      ) : null}
      <div className="flex items-center gap-4">
        <div>
          <div className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
          <a
            href={item.url}
            target="_blank"
            className="text-lg line-clamp-2 font-medium tracking-tight underline"
            rel="noreferrer"
          >
            <Link2 size={16} className="inline-block align-middle mr-1.5" />
            {item.name}
          </a>
        </div>
      </div>

      {actions}
    </li>
  );
}
