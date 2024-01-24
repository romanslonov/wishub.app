import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/auth/require-user-session.server";
import { Navigation } from "~/components/navigation";
import { getLocaleData } from "~/locales";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await requireUserSession(request);

  const t = await getLocaleData(request);

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
