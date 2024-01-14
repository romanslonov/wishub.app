import { Link, useLoaderData } from "@remix-run/react";
import { Gift } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/cn";
import { ItemsList } from "./items-list";
import { TogglePublic } from "./toggle-public";
import { CopyToClipboard } from "./copy-to-clipboard";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getListWithItems } from "./actions.server";
import { requireUserSession } from "~/auth/require-user-session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);

  const list = await getListWithItems({
    listId: params.id!,
    ownerId: session.user.id,
  });

  return { list };
}

export default function DashboardListsIdRoute() {
  const { list } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            Back to all Lists
          </Link>
          <h1 className="text-3xl line-clamp-2 font-bold tracking-tight">
            {list?.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className={cn("flex-1 md:flex-auto", buttonVariants())}
            to={`./add`}
          >
            <Gift size={16} className="mr-1" />
            Add a wish
          </Link>
          {list?.id ? (
            <>
              {/* <UpdateListDialog list={list} />
              <RemoveListAlert listId={list.id} /> */}
            </>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
        <div className="lg:col-span-8 order-2 lg:order-1">
          <ItemsList items={list?.items} />
        </div>

        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
          <div>
            <div className="font-bold text-lg tracking-tight">Description</div>
            <p className="text-sm text-muted-foreground">
              {list?.description || "No description"}
            </p>
          </div>
          <TogglePublic listId={list?.id} defaultValue={list?.public} />
          {list?.public ? (
            <CopyToClipboard text={`http://localhost:3000/s/${list.id}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div>
      <h1>Error</h1>
    </div>
  );
}
