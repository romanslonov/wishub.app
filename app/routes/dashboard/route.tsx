import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/auth/require-user-session.server";
import { Navigation } from "~/components/navigation";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUserSession(request);

  return json({ user });
};

export default function DashboardLayout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      <Navigation user={user} />
      <div className="max-w-7xl mx-auto p-8">
        <Outlet />
      </div>
    </div>
  );
}
