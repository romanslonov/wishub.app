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
import { Sharing } from "./sharing";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import {
  getListWithItems,
  removeItem,
  removeList,
  updateItem,
  updateList,
} from "./actions.server";
import { requireUserSession } from "~/auth/require-user-session.server";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RemoveListAlert } from "./remove-list-alert";
import { UpdateListDialog } from "./update-list-dialog";
import { z } from "zod";
import { getLocaleData } from "~/locales";
import { ErrorState } from "~/components/error-state";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.t.dashboard.list.meta.title} - ${data?.list?.name}` },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);

  const t = await getLocaleData(request);

  const list = await getListWithItems({
    listId: params.id!,
    ownerId: session.user.id,
  });

  return { list, t };
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireUserSession(request);

  const t = await getLocaleData(request);

  const formData = await request.formData();

  if (formData.get("intent") === "update-list-public") {
    try {
      const data = z
        .object({
          public: z.preprocess(
            (value) => value === "on",
            z.boolean().optional()
          ),
        })
        .parse(Object.fromEntries(formData));

      const response = await updateList(params.id!, data);

      return json(
        {
          status: 200,
          message: response.public
            ? t.toasts.list_was_changed_to_public
            : t.toasts.list_was_changed_to_private,
          action: "update-list-public",
        },
        { status: 200 }
      );
    } catch (error) {
      return json(
        {
          status: 500,
          message: t.validation.unexpected_error,
        },
        { status: 500 }
      );
    }
  }

  if (formData.get("intent") === "update-list") {
    try {
      const data = z
        .object({
          name: z.string().min(1, t.validation.name.required),
          description: z.string().optional(),
        })
        .parse(Object.fromEntries(formData));

      await updateList(params.id!, data);

      return json(
        {
          status: 200,
          message: t.toasts.list_was_updated,
          action: "update-list",
        },
        { status: 200 }
      );
    } catch (error) {
      return json(
        {
          status: 500,
          message: t.validation.unexpected_error,
        },
        { status: 500 }
      );
    }
  }

  if (formData.get("intent") === "update-list-item") {
    try {
      const data = z
        .object({
          itemId: z.string(),
          url: z
            .string()
            .min(1, t.validation.url.required)
            .url(t.validation.url.invalid),
          name: z
            .string()
            .min(1, t.validation.wish_name.required)
            .max(255, t.validation.wish_name.too_long),
        })
        .parse(Object.fromEntries(formData));

      const { itemId, ...payload } = data;

      await updateItem({ itemId, data: payload });

      return json(
        {
          status: 200,
          message: t.toasts.wish_was_updated,
          action: "update-list-item",
        },
        { status: 200 }
      );
    } catch (error) {
      return json(
        {
          status: 500,
          message: t.validation.unexpected_error,
        },
        { status: 500 }
      );
    }
  }

  if (formData.get("intent") === "delete-list-item") {
    try {
      const data = z
        .object({
          itemId: z.string().min(1, "Item ID is required."),
        })
        .parse(Object.fromEntries(formData));

      await removeItem(data.itemId);

      return json(
        {
          status: 200,
          message: t.toasts.wish_was_removed,
          action: "delete-list-item",
        },
        { status: 200 }
      );
    } catch (error) {
      return json(
        {
          status: 500,
          message: t.validation.unexpected_error,
        },
        { status: 500 }
      );
    }
  }

  if (formData.get("intent") === "delete-list") {
    try {
      await removeList(params.id!);

      return json(
        {
          status: 200,
          message: t.toasts.list_was_removed,
          redirectTo: "/dashboard",
          action: "delete-list",
        },
        { status: 200 }
      );
    } catch (error) {
      return json(
        {
          status: 500,
          message: t.validation.unexpected_error,
        },
        { status: 500 }
      );
    }
  }

  return null;
}

export default function DashboardListsIdRoute() {
  const [isUpdateListDialogOpen, setIsUpdateListDialogOpen] = useState(false);
  const { list, t } = useLoaderData<typeof loader>();
  const routeData = useRouteLoaderData<{ ENV: Record<string, string> }>("root");
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.status === 200) {
      toast.success(actionData.message);
    } else if (actionData?.status === 500 || actionData?.status === 400) {
      toast.error(actionData.message);
    }

    if (
      actionData?.status === 200 &&
      "action" in actionData &&
      actionData.action === "update-list"
    ) {
      setIsUpdateListDialogOpen(false);
    }

    if (
      actionData &&
      "redirectTo" in actionData &&
      typeof actionData.redirectTo === "string"
    ) {
      navigate(actionData.redirectTo);
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
            {t.dashboard.list.back_to_lists}
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
            {t.dashboard.list.actions.add_wish}
          </Link>
          {list?.id ? (
            <>
              <UpdateListDialog
                list={list}
                isOpen={isUpdateListDialogOpen}
                setIsOpen={setIsUpdateListDialogOpen}
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
            <div className="font-bold text-lg tracking-tight">
              {t.dashboard.list.settings.description.label}
            </div>
            <p className="text-sm text-muted-foreground">
              {list?.description || t.dashboard.list.settings.description.empty}
            </p>
          </div>
          <TogglePublic list={list} defaultValue={list?.public} />
          {list?.public ? (
            <Sharing text={`${routeData?.ENV.ORIGIN}/s/${list.id}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorState />;
}
