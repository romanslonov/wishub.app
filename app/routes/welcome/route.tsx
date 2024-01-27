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
import { getUser } from "~/auth/get-user.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { prisma } from "~/lib/prisma.server";
import { sendVerificationEmail } from "~/lib/email";
import { lucia } from "~/auth/lucia";
import { Navigation } from "~/components/navigation";
import { MailOpen } from "lucide-react";
import { getLocaleData } from "~/locales";

export const meta: MetaFunction = () => [
  {
    title: "Confirm your account",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);

  const t = await getLocaleData(request);

  if (user && user.emailVerified) {
    throw redirect("/dashboard");
  }

  return { user, t };
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === "POST") {
    const user = await getUser(request);
    const formData = await request.formData();

    try {
      const { code } = z
        .object({
          code: z.string().min(6, "Verification code should be 6 characters."),
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
          { error: "Code is invalid. Try to request a new one." },
          { status: 400 }
        );
      }

      if (!isWithinExpirationDate(databaseCode.expiresAt)) {
        return json(
          { error: "Code is expired. Try to request a new one." },
          { status: 400 }
        );
      }

      if (!user || user.email !== databaseCode.email) {
        return json(
          { error: "Code is invalid. Try to request a new one." },
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
      return json({ error: "Something goes wrong." }, { status: 400 });
    }
  }

  if (request.method === "PUT") {
    const user = await getUser(request);

    if (!user?.id) {
      throw redirect("/login");
    }

    const code = await generateEmailVerificationCode(user.id, user.email);

    await sendVerificationEmail(user.email, code);

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
            <h1 className="font-bold text-2xl">Please confirm your email</h1>
            <p className="text-muted-foreground">
              We&apos;ve sent you confirmation code on your email.
            </p>
          </div>
          <Form method="post" className="space-y-4">
            <input type="hidden" value="confirmation" name="intent" />
            <div className="space-y-2">
              <Label htmlFor="code" hidden>
                Code
              </Label>
              <Input
                id="code"
                required
                name="code"
                type="text"
                minLength={6}
                autoComplete="off"
                placeholder="Enter your code from email"
              />
            </div>
            <Button className="w-full" disabled={isConfirming}>
              {isConfirming ? "Confirming..." : "Confirm email"}
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
                {isResending ? "Sending..." : "Resend verification code"}
              </Button>
            </fetcher.Form>
          </div>
        </div>
      </div>
    </div>
  );
}
