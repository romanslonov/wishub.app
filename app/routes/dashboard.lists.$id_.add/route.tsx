import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Button, buttonVariants } from "~/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { requireUserSession } from "~/auth/require-user-session.server";
import { addListItems } from "./actions.server";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { toast } from "sonner";
import { cn } from "~/lib/cn";
import { getLocaleData } from "~/locales";
import { ErrorState } from "~/components/error-state";
import { FormItems } from "~/components/form-items";
import { getItemSchema } from "~/lib/schemas";

const defaultItemValue = { url: "", name: "" };

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.t.dashboard.add_wishes.meta.title}` }];
};

export async function loader({ request, params: { id } }: LoaderFunctionArgs) {
  await requireUserSession(request);

  const t = await getLocaleData(request);

  return { listId: id, t };
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireUserSession(request);

  const t = await getLocaleData(request);

  const formData = await request.json();

  const itemSchema = getItemSchema(t.validation);
  const schema = z.object({
    items: z.array(itemSchema).min(1, t.validation.wishes.required),
  });

  try {
    const data = schema.parse(formData);

    await addListItems(params.id!, data.items);

    return json({
      listId: params.id!,
      message: t.toasts.wishes_were_added,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.formErrors });
    }
    return json({ error: t.validation.unexpected_error }, { status: 500 });
  }
};

export default function DashboardListsIdAddRoute() {
  const { listId, t } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit();

  const itemSchema = getItemSchema(t.validation);
  const schema = z.object({
    items: z.array(itemSchema).min(1, t.validation.wishes.required),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      items: [defaultItemValue],
    },
    mode: "onChange",
  });

  async function onsubmit(data: FormData) {
    submit(data, { method: "POST", encType: "application/json" });
  }

  useEffect(() => {
    if (actionData && "error" in actionData) {
      toast.error(actionData.error);
    } else if (actionData && "message" in actionData) {
      toast.success(actionData.message);
      navigate(`/dashboard/lists/${actionData.listId}`);
    }
  }, [actionData, navigate]);

  return (
    <div className="max-w-2xl space-y-4 p-4 mx-auto">
      <div className="space-y-4">
        <Link
          to={`/dashboard/lists/${listId}`}
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
        >
          {t.dashboard.add_wishes.back}
        </Link>
        <h1 className="text-3xl line-clamp-2 font-bold tracking-tight">
          {t.dashboard.add_wishes.title}
        </h1>
      </div>
      <div className="bg-card shadow-sm border rounded-2xl p-6">
        <FormProvider {...form}>
          <Form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
            <FormItems />
            <Button className="w-full" type="submit">
              {isSubmitting
                ? t.dashboard.add_wishes.form.submitting
                : t.dashboard.add_wishes.form.submit}
            </Button>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorState />;
}
