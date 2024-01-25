import { prisma } from "~/lib/prisma.server";
import { ItemsList } from "./items-list";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { getUser } from "~/auth/get-user.server";
import { useLoaderData } from "@remix-run/react";
import { Navigation } from "~/components/navigation";
import { requireUserSession } from "~/auth/require-user-session.server";
import { reserve } from "./actions.server";
import { z } from "zod";
import { getLocaleData } from "~/locales";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await getUser(request);

  const t = await getLocaleData(request);

  const list = await prisma.list.findFirst({
    where: { id: params.id, public: true },
    include: { owner: true },
  });

  if (!list) {
    throw redirect("/404");
  }

  const items = await prisma.item.findMany({
    where: { listId: list.id },
    orderBy: { createdAt: "asc" },
  });

  return { items, list, user, t };
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await requireUserSession(request);

  if (request.method === "POST") {
    const formData = await request.formData();
    try {
      const { itemId } = z
        .object({ itemId: z.string().min(1, "Item is required") })
        .parse(Object.fromEntries(formData));

      await reserve(session.user.id, itemId);

      return json({ message: "Reserved!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return json(
          { error: "Request to reserve this item is not valid." },
          { status: 400 }
        );
      }
      return json({ error: "Something goes wrong." }, { status: 500 });
    }
  }
}

export default function PublicListRoute() {
  const { items, list, user, t } = useLoaderData<typeof loader>();
  return (
    <>
      <Navigation user={user} t={t} />
      <div className="max-w-4xl w-full flex-1 mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-2xl tracking-tight font-bold">{list.name}</h1>
          <p className="text-muted-foreground text-sm">
            Created by {list.owner.name ?? "Unknown"}
          </p>
        </header>

        <ItemsList
          items={items}
          listId={list.id}
          isAuthenticated={!!user}
          isMyself={user?.id === list.ownerId}
          className="space-y-4"
        />
      </div>
    </>
  );
}
