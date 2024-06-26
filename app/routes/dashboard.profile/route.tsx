import {
  Form,
  json,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Description } from "~/components/ui/description";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Message } from "~/components/ui/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { prisma } from "~/lib/prisma.server";
import { useEffect } from "react";
import { ErrorState } from "~/components/error-state";
import { protectedRoute } from "~/auth/guards/protected-route.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.t.dashboard.profile.title }];
};

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const { session } = protectedRoute(context, request);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.userId },
    select: { email: true, name: true },
  });

  return json({ user, t: context.t });
};

export async function action({ request, context }: ActionFunctionArgs) {
  const { session } = protectedRoute(context, request);
  const { t } = context;
  const data = await request.json();

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: data,
    });

    return json({ message: t.toasts.profile_was_updated });
  } catch (error) {
    return json({ error: t.validation.unexpected_error });
  }
}

export default function DashboardProfile() {
  const { user, t } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit();

  const schema = z.object({
    name: z.string().min(1, t.validation.name.required),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: user.name || "",
    },
    resolver: zodResolver(schema),
  });

  async function onsubmit(data: FormData) {
    submit(data, { method: "POST", encType: "application/json" });
  }

  useEffect(() => {
    if (actionData && "message" in actionData) {
      toast.success(actionData.message);
    } else if (actionData && "error" in actionData) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {t.dashboard.profile.title}
        </h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          {t.dashboard.profile.subtitle}
        </p>
      </div>
      <div className="border rounded-2xl bg-card p-6 shadow-sm">
        <Form
          method="post"
          className="space-y-4"
          onSubmit={handleSubmit(onsubmit)}
        >
          <div className="flex items-center justify-center">
            <div className="bg-primary rounded-full text-2xl font-medium uppercase text-primary-foreground flex items-center justify-center w-20 h-20">
              {user.email[0]}
            </div>
          </div>

          <div className="space-y-1">
            <Label id="email">Email</Label>
            <Input id="email" readOnly defaultValue={user.email} />
          </div>

          <div className="space-y-1">
            <Label id="name">
              {t.dashboard.profile.form.inputs.name.label}
            </Label>
            <Input id="name" {...register("name")} />
            {errors.name?.message ? (
              <Message>{errors.name.message}</Message>
            ) : (
              <Description id="name">
                {t.dashboard.profile.form.inputs.name.description}
              </Description>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? t.dashboard.profile.form.submitting
              : t.dashboard.profile.form.submit}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return <ErrorState />;
}
