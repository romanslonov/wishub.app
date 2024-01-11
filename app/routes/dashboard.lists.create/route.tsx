import { CreateListForm } from "./form";

export default function DashboardListsCreate() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="font-bold tracking-tight text-2xl">Create list</h1>
      <CreateListForm />
    </div>
  );
}
