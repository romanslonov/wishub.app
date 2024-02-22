import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button, buttonVariants } from "~/components/ui/button";
import { z } from "zod";
import { useEffect } from "react";
import { toast } from "sonner";
import { createList } from "./actions.server";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Message } from "~/components/ui/message";
import { Textarea } from "~/components/ui/textarea";
import { Description } from "~/components/ui/description";
import { Switch } from "~/components/ui/switch";
import { requireUserSession } from "~/auth/require-user-session.server";
import { getLocaleData } from "~/locales";
import { ErrorState } from "~/components/error-state";
import { FormItems } from "~/components/form-items";
import { getItemSchema } from "~/lib/schemas";
import { cn } from "~/lib/cn";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: data?.t.dashboard.create_list.meta.title },
];

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);

  const t = await getLocaleData(request);

  return { t };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { user } = await requireUserSession(request);

  const t = await getLocaleData(request);

  const formData = await request.json();

  const itemSchema = getItemSchema(t.validation);
  const schema = z.object({
    name: z.string().min(1, t.validation.list_name.required),
    description: z.string().optional(),
    public: z.boolean().default(false),
    items: z.array(itemSchema).default([]),
  });

  try {
    const data = schema.parse(formData);

    const list = await createList(user.id, data);

    return json({
      list,
      message: t.toasts.list_was_created,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.formErrors });
    }
    return json({ error: t.validation.unexpected_error }, { status: 500 });
  }
};

export default function DashboardListsCreate() {
  const { t } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit();

  const itemSchema = getItemSchema(t.validation);
  const schema = z.object({
    name: z.string().min(1, t.validation.list_name.required),
    description: z.string().optional(),
    public: z.boolean().default(false),
    items: z.array(itemSchema).default([]),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      items: [],
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
      navigate(`/dashboard/lists/${actionData.list.id}`);
    }
  }, [actionData, navigate]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <Link
          to="/dashboard/"
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
        >
          {t.dashboard.add_wishes.back}
        </Link>
      </div>

      <div className="bg-card space-y-8 border p-6 rounded-2xl">
        <h1 className="font-bold tracking-tight text-2xl">
          {t.dashboard.create_list.title}
        </h1>

        <FormProvider {...form}>
          <Form
            method="post"
            onSubmit={form.handleSubmit(onsubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">
                {t.dashboard.create_list.form.name.label}
              </Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder={t.dashboard.create_list.form.name.placeholder}
              />
              {form.formState.errors.name && (
                <Message>{form.formState.errors.name?.message}</Message>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">
                {t.dashboard.create_list.form.description.label}
              </Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder={
                  t.dashboard.create_list.form.description.placeholder
                }
              />
              {form.formState.errors.name ? (
                <Message>{form.formState.errors.description?.message}</Message>
              ) : (
                <Description>
                  {t.dashboard.create_list.form.description.description}
                </Description>
              )}
            </div>
            <div className="space-y-2">
              <Controller
                name="public"
                control={form.control}
                render={({ field }) => (
                  <>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        name="public"
                        id="list-public-switch"
                      />
                      <Label htmlFor="list-public-switch">
                        {t.dashboard.create_list.form.toggle.label}
                      </Label>
                    </div>
                    <Description>
                      {t.dashboard.create_list.form.toggle.description}
                    </Description>
                  </>
                )}
              />
            </div>
            <hr />
            <div>
              <div className="font-bold text-sm mb-4">
                {t.dashboard.create_list.wishes}
              </div>
              <FormItems />
            </div>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t.dashboard.create_list.form.submitting
                : t.dashboard.create_list.form.submit}
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
