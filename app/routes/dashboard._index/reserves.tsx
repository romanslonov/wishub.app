import { Item } from "@prisma/client";
import { Link, useRouteLoaderData } from "@remix-run/react";
import { Link2 } from "lucide-react";
import { LocaleData } from "~/locales";

export function Reserves({ reserves }: { reserves: Item[] }) {
  const data = useRouteLoaderData<{ t: LocaleData }>("routes/dashboard._index");

  if (reserves === null || reserves.length === 0) {
    return (
      <div className="border border-dashed rounded-2xl py-16 px-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="space-y-2">
            <div className="border shadow-sm rounded-xl h-16 w-32 p-2">
              <div className="rounded bg-gradient-to-b from-muted to-muted/40 w-full h-full"></div>
            </div>
            <div className="border shadow-sm rounded-xl h-32 w-32 p-2">
              <div className="rounded bg-gradient-to-b from-muted to-muted/40 w-full h-full"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="border shadow-sm rounded-xl h-32 w-32"></div>
            <div className="border shadow-sm rounded-xl h-16 w-32"></div>
          </div>
        </div>
        {/* <Gift size={48} className="text-muted-foreground mx-auto mb-4" /> */}
        <h2 className="text-xl font-bold mb-2 tracking-tight">
          {data?.t.dashboard.lists.sections.reserves.empty.title}
        </h2>
        <p className="text-muted-foreground">
          {data?.t.dashboard.lists.sections.reserves.empty.subtitle}
        </p>
      </div>
    );
  }

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reserves.map((item) => (
        <li
          key={item.id}
          className="flex items-center gap-4 shadow-sm bg-card lg:gap-8 relative justify-between border p-6 rounded-xl"
        >
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm text-muted-foreground">
                {new Date(item.createdAt).toDateString()}
              </div>
              <a
                href={item.url}
                target="_blank"
                className="text-lg line-clamp-2 font-medium tracking-tight"
                rel="noreferrer"
              >
                <Link2 size={16} className="inline-block align-middle mr-1.5" />
                {item.name}
              </a>
              <div className="mt-4 text-muted-foreground text-sm">
                <span>
                  {data?.t.dashboard.lists.sections.reserves.card.list}{" "}
                  <Link
                    className="text-foreground font-medium underline underline-offset-4"
                    to={`/s/${item.list.id}`}
                  >
                    {item.list.name}
                  </Link>{" "}
                  {data?.t.dashboard.lists.sections.reserves.card.by}{" "}
                  {item.list.owner.name}
                </span>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ReservesSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
    </div>
  );
}
