import { useRouteLoaderData } from "@remix-run/react";
import { ArrowUpRight } from "lucide-react";
import { LocaleData } from "~/locales";

interface Props {
  reserves: {
    id: string;
    url: string;
    name: string;
    list: { id: string; name: string; owner: { id: string; name: string } };
  }[];
}

export function Reserves({ reserves }: Props) {
  const data = useRouteLoaderData<{ t: LocaleData }>("routes/dashboard._index");

  if (reserves === null || reserves.length === 0) {
    return (
      <div className="border border-dashed bg-card rounded-2xl py-16 px-8 text-center">
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
    <div className="space-y-1.5">
      <div className="hidden md:grid bg-card border p-2 rounded-lg grid-cols-12 font-medium text-xs text-muted-foreground gap-4 pl-6 pr-6">
        <div className="col-span-6 lg:col-span-8">
          {data?.t.dashboard.lists.sections.reserves.table.headings.name}
        </div>
        <div className="col-span-3 lg:col-span-2">
          {data?.t.dashboard.lists.sections.reserves.table.headings.author}
        </div>
        <div className="col-span-3 lg:col-span-2 pr-3 text-end">
          {data?.t.dashboard.lists.sections.reserves.table.headings.list}
        </div>
        {/* <div className="col-span-2 text-end">
          {data?.t.dashboard.lists.sections.reserves.table.headings.start_in}
        </div> */}
      </div>
      <ul className="space-y-2">
        {reserves.map((item) => (
          <li
            key={item.id}
            className="shadow-sm bg-card relative border px-3 md:px-6 py-3 rounded-xl"
          >
            <div className="grid grid-cols-6 md:grid-cols-12 items-center gap-4">
              <div className="col-span-6 lg:col-span-8">
                <a
                  href={item.url}
                  target="_blank"
                  className="font-medium inline-flex max-w-full items-center gap-1"
                  rel="noreferrer"
                >
                  <span className="truncate">{item.name}</span>
                  <ArrowUpRight className="inline w-4 h-4" />
                </a>
              </div>
              <div className="col-span-3 flex lg:col-span-2">
                {/* <span className="text-muted-foreground">List</span>{" "} */}
                <div className="font-medium min-w-0 inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border text-xs">
                  <div className="bg-foreground shrink-0 text-background w-5 h-5 rounded-full font-bold inline-flex items-center justify-center">
                    {item.list.owner.name[0]}
                  </div>
                  <div className="truncate min-w-0">{item.list.owner.name}</div>
                </div>
              </div>
              <div className="col-span-3 lg:col-span-2 flex items-center justify-end">
                <a
                  href={`/s/${item.list.id}`}
                  target="_blank"
                  className="font-medium min-w-0 inline-flex hover:bg-muted transition-colors items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border text-xs"
                  rel="noreferrer"
                >
                  <div className="bg-foreground shrink-0 text-background w-5 h-5 rounded-full font-bold inline-flex items-center justify-center">
                    {item.list.owner.name[0]}
                  </div>
                  <div className="inline-flex min-w-0 whitespace-nowrap items-center gap-0.5">
                    <div className="truncate">{item.list.name}</div>
                    <ArrowUpRight className="inline shrink-0 w-4 h-4 align-middle" />
                  </div>
                </a>
              </div>
              {/* <div className="flex col-span-2 items-center justify-end">
                <div className="justify-end inline-flex items-center gap-1 text-xs rounded-full px-3 py-1.5 border-yellow-700 border bg-yellow-300/20 text-yellow-700">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="inline w-4 h-4" />1 day
                  </span>
                </div>
              </div> */}
            </div>
          </li>
        ))}
      </ul>
    </div>
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
