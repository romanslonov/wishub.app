import {
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "@remix-run/react";
import { Gift } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/cn";
import { ItemsList } from "./items-list";
import { TogglePublic } from "./toggle-public";
import { CopyToClipboard } from "./copy-to-clipboard";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { getListWithItems, removeList, updateList } from "./actions.server";
import { requireUserSession } from "~/auth/require-user-session.server";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RemoveListAlert } from "./remove-list-alert";
import { UpdateListDialog } from "./update-list-dialog";
import { z } from "zod";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `Your ${data?.list?.name} Wish List` },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);

  const list = await getListWithItems({
    listId: params.id!,
    ownerId: session.user.id,
  });

  return { list };
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireUserSession(request);

  if (request.method === "PUT") {
    const formData = await request.formData();

    console.log(Object.fromEntries(formData));

    try {
      const data = z
        .object({
          name: z.string().min(1, "Name is required."),
          description: z.string().optional(),
          public: z.preprocess(
            (value) => value === "on",
            z.boolean().optional()
          ),
        })
        .parse(Object.fromEntries(formData));

      await updateList(params.id!, data);

      return json(
        {
          status: 200,
          message: "List was updated.",
          action: "put",
        },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return json(
        {
          status: 500,
          message: "Something goes wrong.",
          action: "put",
        },
        { status: 500 }
      );
    }
  }

  if (request.method === "DELETE") {
    await removeList(params.id!);

    return json(
      {
        status: 200,
        message: "List was removed.",
        action: "delete",
      },
      { status: 200 }
    );
  }

  return null;
}

export default function DashboardListsIdRoute() {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const { list } = useLoaderData<typeof loader>();
  const routeData = useRouteLoaderData<{ ENV: Record<string, string> }>("root");
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.action === "delete" && actionData?.status === 200) {
      toast.success(actionData.message);
      navigate("/dashboard");
    } else if (actionData?.action === "put" && actionData?.status === 200) {
      toast.success(actionData.message);
      setIsUpdateDialogOpen(false);
    } else if (actionData?.status === 500 || actionData?.status === 400) {
      toast.error(actionData.message);
    }
  }, [actionData, navigate]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
          >
            Back to lists
          </Link>
          <h1 className="text-3xl line-clamp-2 font-bold tracking-tight">
            {list?.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className={cn("flex-1 md:flex-auto", buttonVariants())}
            to={`./add`}
          >
            <Gift size={16} className="mr-1" />
            Add a wish
          </Link>
          {list?.id ? (
            <>
              <UpdateListDialog
                list={list}
                isOpen={isUpdateDialogOpen}
                setIsOpen={setIsUpdateDialogOpen}
              />
              <RemoveListAlert />
            </>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
        <div className="lg:col-span-8 order-2 lg:order-1">
          <ItemsList items={list?.items} />
        </div>

        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
          <div>
            <div className="font-bold text-lg tracking-tight">Description</div>
            <p className="text-sm text-muted-foreground">
              {list?.description || "No description"}
            </p>
          </div>
          <TogglePublic list={list} defaultValue={list?.public} />
          {list?.public ? (
            <CopyToClipboard text={`${routeData?.ENV.ORIGIN}/s/${list.id}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div>
      <h1>Error</h1>
    </div>
  );
}
