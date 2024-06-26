import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { generateEmailVerificationCode } from "~/auth/generate-email-verification-code";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { isWithinExpirationDate } from "oslo";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { prisma } from "~/lib/prisma.server";
import { sendVerificationEmail } from "~/lib/email";
import { lucia } from "~/auth/lucia.server";
import { Navigation } from "~/components/navigation";
import { MailOpen } from "lucide-react";
import { protectedRoute } from "~/auth/guards/protected-route.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.t.welcome.meta.title,
  },
];

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { user } = protectedRoute(context, request);

  const { t } = context;

  if (user && user.emailVerified) {
    throw redirect("/dashboard");
  }

  return { user, t };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { t } = context;

  if (request.method === "POST") {
    const { user } = protectedRoute(context, request);
    const formData = await request.formData();

    try {
      const { code } = z
        .object({
          code: z.string().min(6, t.validation.verification_code.too_short),
        })
        .parse(Object.fromEntries(formData));

      const databaseCode = await prisma.emailVerificationCode.findFirst({
        where: { userId: user?.id },
      });

      if (databaseCode) {
        await prisma.emailVerificationCode.delete({
          where: { id: databaseCode.id },
        });
      }

      if (!databaseCode || databaseCode.code !== code) {
        return json(
          { error: t.validation.verification_code.invalid },
          { status: 400 }
        );
      }

      if (!isWithinExpirationDate(databaseCode.expiresAt)) {
        return json(
          { error: t.validation.verification_code.expired },
          { status: 400 }
        );
      }

      if (!user || user.email !== databaseCode.email) {
        return json(
          { error: t.validation.verification_code.invalid },
          { status: 400 }
        );
      }

      await lucia.invalidateUserSessions(user.id);

      await prisma.user.update({
        where: { id: user?.id },
        data: { emailVerified: true },
      });

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      return redirect("/dashboard", {
        headers: {
          "Set-Cookie": sessionCookie.serialize(),
        },
      });
    } catch (error) {
      return json({ error: t.validation.unexpected_error }, { status: 400 });
    }
  }

  if (request.method === "PUT") {
    const { user } = protectedRoute(context, request);

    if (!user?.id) {
      throw redirect("/login");
    }

    const code = await generateEmailVerificationCode(user.id, user.email);

    await sendVerificationEmail({ email: user.email, code, t });

    return json({ message: "New code was sent." }, { status: 200 });
  }
}

export default function ConfirmationRoute() {
  const { user, t } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isConfirming = navigation.formData?.get("intent") === "confirmation";
  const fetcher = useFetcher<{ message: string }>({
    key: "resend-varification-code",
  });
  const isResending = fetcher.formData?.get("intent") === "resending";

  useEffect(() => {
    if (fetcher.data?.message) {
      toast.success(fetcher.data.message);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (actionData && "error" in actionData) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation user={user} t={t} />
      <div className="flex-1 items-center justify-center flex p-4 md:p-8">
        <div className="shadow-sm border rounded-2xl p-6 max-w-lg w-full space-y-4">
          <div className="text-center space-y-1">
            <MailOpen className="w-12 h-12 mx-auto text-primary mb-4" />
            <h1 className="font-bold text-2xl">{t.welcome.title}</h1>
            <p className="text-muted-foreground">{t.welcome.subtitle}</p>
          </div>
          <Form method="post" className="space-y-4">
            <input type="hidden" value="confirmation" name="intent" />
            <div className="space-y-2">
              <Label htmlFor="code" hidden>
                {t.welcome.form.inputs.code.label}
              </Label>
              <Input
                id="code"
                required
                name="code"
                type="text"
                minLength={6}
                autoComplete="off"
                placeholder={t.welcome.form.inputs.code.placeholder}
              />
            </div>
            <Button className="w-full" disabled={isConfirming}>
              {isConfirming ? t.welcome.form.submitting : t.welcome.form.submit}
            </Button>
          </Form>
          <div className="text-center">
            <fetcher.Form method="put">
              <input type="hidden" name="intent" value="resending" />
              <Button
                variant="link"
                type="submit"
                disabled={isResending}
                className="p-0 h-auto mx-auto"
              >
                {isResending
                  ? t.welcome.resend.submitting
                  : t.welcome.resend.submit}
              </Button>
            </fetcher.Form>
          </div>
        </div>
      </div>
    </div>
  );
}
