import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@vercel/remix";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/auth/get-user.server";
import { Navigation } from "~/components/navigation";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);

  return json({ user });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <>
      {" "}
      <Navigation user={user} />
      <div className="mx-auto max-w-7xl p-8">
        <h1 className="text-center py-20 text-5xl font-bold">
          Welcome to Remix
        </h1>
      </div>
    </>
  );
}
