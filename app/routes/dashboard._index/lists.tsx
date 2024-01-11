import { cn } from "~/lib/cn";
import { buttonVariants } from "~/components/ui/button";
import { ListPlus } from "lucide-react";
import { Link, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { requireUserSession } from "~/auth/require-user-session.server";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   await requireUserSession(request);

//   return json({ lists: [] });
// };
export function Lists() {
  // const { lists } = useLoaderData<typeof loader>();

  const lists: unknown[] = [];

  if (lists.length === 0) {
    return (
      <div className="border border-dashed rounded-2xl py-16 text-center">
        {/* <div className="relative mb-8 h-48">
          <div className="absolute shadow-md top-0 left-[58%] sm:left-[53%] translate-x-[-53%] border w-32 h-48 rounded-xl bg-background transform rotate-12 mx-auto p-4 space-y-2">
            <div className="bg-gradient-to-b from-muted to-muted/50 h-16 rounded-md w-full"></div>
            <div className="bg-gradient-to-b from-muted to-muted/50 h-16 rounded-md w-full"></div>
          </div>
          <div className="absolute shadow-sm top-0 left-[37%] sm:left-[45%] translate-x-[-45%] border w-24 h-40 rounded-xl bg-background transform -rotate-12 -z-10 mx-auto p-4 space-y-2">
            <div className="bg-gradient-to-b from-muted to-muted/50 h-12 rounded-md w-full"></div>
            <div className="bg-gradient-to-b from-muted to-muted/50 h-12 rounded-md w-full"></div>
          </div>
        </div> */}
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
          You don&apos;t have any lists yet
        </h2>
        <p className="text-center text-muted-foreground mb-4">
          Create your first wish list.
        </p>
        <Link to="./lists/create" className={cn(buttonVariants())}>
          <ListPlus size={20} className="mr-1.5" />
          Create new list
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {lists.map((item) => (
        <li key={item.id}>
          <Link
            href={`/dashboard/lists/${item.id}`}
            className="border p-6 rounded-xl shadow-sm block"
          >
            <div className="flex items-center justify-between">
              <time className="text-xs text-muted-foreground">
                {item.createdAt.toDateString()}
              </time>
              <div className="text-xs font-medium">
                {item._count.items} wishes
              </div>
            </div>
            <h2 className="font-medium text-lg mb-4">{item.name}</h2>
          </Link>
        </li>
      ))}
    </ul>
  );
}
