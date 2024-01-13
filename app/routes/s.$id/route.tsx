import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getUser } from "~/auth/get-user.server";
import { Navigation } from "~/components/navigation";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);

  return json({ user });
};

export default function SharedListRoute() {
  const params = useParams<{ id: string }>();
  const { user } = useLoaderData<typeof loader>();

  const list = { name: "My List", owner: { name: "Me" } };

  return (
    <>
      <Navigation user={user} />
      <div className="max-w-4xl w-full flex-1 mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-2xl tracking-tight font-bold">{list.name}</h1>
          <p className="text-muted-foreground text-sm">
            Created by {list.owner.name}
          </p>
        </header>

        {/* <ItemsList
      items={items}
      listId={list.id}
      isAuthenticated={!!session}
      isMyself={session?.user?.id === list.ownerId}
      className="space-y-4"
    /> */}

        {/* <LoginDrawer open={!session} /> */}
      </div>
    </>
  );
}
