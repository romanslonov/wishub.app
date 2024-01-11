import { Link, useParams } from "@remix-run/react";
import { AddlistItemsForm } from "./form";

export default function DashboardListsIdAddRoute() {
  const params = useParams<{ id: string }>();
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link
        to={`/dashboard/lists/${params.id}`}
        className="text-muted-foreground hover:text-foreground text-sm"
      >
        Back to all Lists
      </Link>
      <h1 className="font-bold tracking-tight text-2xl">Add wishes</h1>
      <AddlistItemsForm listId="123" />
    </div>
  );
}
