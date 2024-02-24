import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { protectedRoute } from "~/auth/protected-route";
import { Navigation } from "~/components/navigation";
import { getLocaleData } from "~/locales";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  protectedRoute(context);
  const t = await getLocaleData(request);

  const { user } = context;

  return json({ user, t });
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
