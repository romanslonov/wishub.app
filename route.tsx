import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/auth/require-user-session.server";
import { Navigation } from "~/components/navigation";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUserSession(request);

  return json({ message: "Hello World", user });
};

export default function DashboardIndex() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      {" "}
      <Navigation />
      <div className="mx-auto max-w-7xl p-8">
        <div className="text-2xl font-bold">
          Hello User {data.message} - {data?.user?.email}
        </div>
      </div>
    </>
  );
}
