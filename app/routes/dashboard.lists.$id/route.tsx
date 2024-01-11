import { Link, useParams } from "@remix-run/react";
import { Gift } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/cn";

export default function DashboardListsIdRoute() {
  const { id } = useParams<{ id: string }>();

  const list = { name: "New list", id: id };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-4">
          <Link
            to="/dashboard/lists"
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
    </div>
  );
}
