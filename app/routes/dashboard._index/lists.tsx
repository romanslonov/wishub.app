import { cn } from "~/lib/cn";
import { buttonVariants } from "~/components/ui/button";
import { ListPlus, Lock, Unlock } from "lucide-react";
import { Link, useRouteLoaderData } from "@remix-run/react";
import { type LocaleData } from "~/locales";

interface Props {
  lists: {
    id: string;
    createdAt: string;
    name: string;
    _count: { items: number };
    public: boolean;
  }[];
}

export function Lists({ lists }: Props) {
  const data = useRouteLoaderData<{ t: LocaleData }>("routes/dashboard._index");

  if (lists.length === 0) {
    return (
      <div className="border border-dashed bg-card rounded-2xl py-16 text-center">
        <div className="flex pt-8 items-center justify-center mb-8">
          <div className="relative">
            <div className="bg-background absolute -z-10 -top-8 w-40 left-[50%] translate-x-[-50%] h-32 border p-2 rounded-xl"></div>
            <div className="bg-background absolute -z-10 -top-4 w-48 left-[50%] translate-x-[-50%] h-32 border p-2 rounded-xl"></div>
            <div className="bg-background w-56 h-32 border p-2 rounded-xl">
              <div className="rounded bg-gradient-to-b from-muted to-muted/40 w-full h-full"></div>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2 tracking-tight">
          {data?.t.dashboard.lists.sections.lists.empty.title}
        </h2>
        <p className="text-center text-muted-foreground mb-4">
          {data?.t.dashboard.lists.sections.lists.empty.subtitle}
        </p>
        <Link to="./lists/create" className={cn(buttonVariants())}>
          <ListPlus size={20} className="mr-1.5" />
          {data?.t.dashboard.lists.sections.lists.empty.cta}
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {lists.map((item) => (
        <li key={item.id}>
          <Link
            to={`./lists/${item.id}`}
            className="border p-6 rounded-xl shadow-sm block bg-card hover:border-foreground transition-colors"
          >
            <time className="text-sm text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString()}
            </time>
            <h2 className="font-medium text-lg mb-4">{item.name}</h2>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span>{item._count.items}</span>{" "}
                <span className="text-muted-foreground">
                  {data?.t.dashboard.lists.sections.lists.card.wishes_count}
                </span>
              </div>
              <div
                className={cn([
                  item.public ? "" : "text-muted-foreground",
                  "flex items-center gap-1 text-sm",
                ])}
              >
                {item.public ? <Unlock size={16} /> : <Lock size={16} />}
                <span>
                  {item.public
                    ? data?.t.dashboard.lists.sections.lists.card.public
                    : data?.t.dashboard.lists.sections.lists.card.private}
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ListsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
      <div className="animate-pulse h-[110px] bg-muted rounded-xl"></div>
    </div>
  );
}
