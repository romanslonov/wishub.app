import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Sparkles } from "lucide-react";
import { isWithinExpirationDate } from "oslo";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { lucia } from "~/auth/lucia";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Message } from "~/components/ui/message";
import { prisma } from "~/lib/prisma.server";
import { hashPassword } from "./hash-password.server";
import { getLocaleData } from "~/locales";
import { Label } from "~/components/ui/label";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.t.auth.set_password.meta.title }];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const t = await getLocaleData(request);

  return {
    token: params.token,
    t,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const t = await getLocaleData(request);

  const schema = z.object({
    token: z.string().min(1, t.validation.token.required),
    password: z
      .string()
      .min(1, t.validation.password.required)
      .min(8, t.validation.password.too_short),
  });

  try {
    const { password, token } = schema.parse(
      Object.fromEntries(formData.entries())
    );

    const databaseToken = await prisma.passwordResetToken.findUnique({
      where: { id: token },
    });

    if (databaseToken) {
      await prisma.passwordResetToken.delete({ where: { id: token } });
    } else {
      return json({ error: t.validation.token.invalid }, { status: 400 });
    }

    if (!isWithinExpirationDate(databaseToken.expiresAt)) {
      return json({ error: t.validation.token.expired }, { status: 400 });
    }

    await lucia.invalidateUserSessions(databaseToken.userId);

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: databaseToken.userId },
      data: { password: hashedPassword },
    });

    const session = await lucia.createSession(databaseToken.userId, {});

    const cookies = lucia.createSessionCookie(session.id);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": cookies.serialize(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.formErrors }, { status: 400 });
    }
    return json({ error: t.validation.invalid_credentials }, { status: 400 });
  }
}

export default function RecoverPasswordTokenRoute() {
  const { token, t } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const passwordRef = useRef<HTMLInputElement>(null);
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data && "errors" in data) {
      if (data.errors.fieldErrors["password"]?.length) {
        passwordRef.current?.focus();
      }
    }
  }, [data]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md bg-card rounded-2xl shadow-sm border w-full p-8">
        <div className="text-center space-y-1 mb-8">
          <Sparkles className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="font-bold text-2xl">{t.auth.set_password.title}</h1>
          <p className="text-muted-foreground">
            {t.auth.set_password.subtitle}
          </p>
        </div>
        <Form method="post" className="space-y-4 mb-4">
          <div className="space-y-2">
            <input type="hidden" name="token" value={token} />
            <div className="space-y-1">
              <Label htmlFor="password">
                {t.auth.set_password.password.label}*
              </Label>
              <Input
                id="password"
                ref={passwordRef}
                required
                name="password"
                type="password"
                placeholder="********"
              />
            </div>
            {data &&
              "errors" in data &&
              data.errors.fieldErrors["email"]?.map((error) => (
                <Message key={error}>{error}</Message>
              ))}
          </div>
          {data && "error" in data && <Message>{data.error}</Message>}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t.auth.set_password.submitting
              : t.auth.set_password.submit}
          </Button>
        </Form>
      </div>
    </div>
  );
}
