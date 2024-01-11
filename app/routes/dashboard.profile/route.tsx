import { json, useLoaderData } from "@remix-run/react";
import { ProfileForm } from "./form";
import { requireUserSession } from "~/auth/require-user-session.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUserSession(request);

  return json({ user });
};

export default function DashboardProfile() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <div className="border rounded-2xl p-4 shadow-sm">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
