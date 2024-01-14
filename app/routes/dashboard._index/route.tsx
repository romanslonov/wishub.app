import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Lists } from "./lists";
import { Reserves } from "./reserves";
import { requireUserSession } from "~/auth/require-user-session.server";
import { getLists, getReserves } from "./actions.server";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Your Wish Lists" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);

  const lists = await getLists(session.user.id);

  const reserves = await getReserves(session.user.id);

  return { lists, reserves };
}

export default function DashboardIndex() {
  const { lists, reserves } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-16">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Your lists</h2>
          <div className="flex items-center gap-2"></div>
        </div>

        <Lists lists={lists} />
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Reserved gifts</h2>
          <div className="flex items-center gap-2"></div>
        </div>

        <Reserves reserves={reserves} />
      </div>
    </div>
  );
}
