import {
  Form,
  json,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

import { requireUserSession } from "~/auth/require-user-session.server";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@vercel/remix";
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

const schema = z.object({
  name: z.string().min(1, "Name is required."),
});

type FormData = z.infer<typeof schema>;

export const meta: MetaFunction = () => {
  return [{ title: "Your Profile" }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await requireUserSession(request);

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { email: true, name: true },
  });

  return json({ user });
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await requireUserSession(request);
  const data = await request.json();

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: data,
    });

    return json({ message: "Profile updated successfully." });
  } catch (error) {
    return json({ error: "Something goes wrong." });
  }
}

export default function DashboardProfile() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const submit = useSubmit();

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
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <div className="border rounded-2xl p-6 shadow-sm">
        <Form
          method="post"
          className="space-y-4"
          onSubmit={handleSubmit(onsubmit)}
        >
          <div className="flex items-center justify-center">
            {/* <Avatar className="h-16 w-16">
          <AvatarImage
            src={user.image as string | undefined}
            alt={user.email as string | undefined}
          />
          <AvatarFallback>
            <div className="animate-pulse bg-muted"></div>
          </AvatarFallback>
        </Avatar> */}
          </div>

          <div className="space-y-1">
            <Label id="email">Email</Label>
            <Input id="email" readOnly defaultValue={user.email} />
          </div>

          <div className="space-y-1">
            <Label id="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name?.message ? (
              <Message>{errors.name.message}</Message>
            ) : (
              <Description id="name">
                The name usually used in public lists.
              </Description>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update profile"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
