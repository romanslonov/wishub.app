import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { protectedRoute } from "~/auth/guards/protected-route.server";
import { Navigation } from "~/components/navigation";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { user } = protectedRoute(context);

  return json({ user, t: context.t });
};

export default function DashboardLayout() {
  const { user, t } = useLoaderData<typeof loader>();

  return (
    <div>
      <Navigation user={user} t={t} />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </div>
    </div>
  );
}
