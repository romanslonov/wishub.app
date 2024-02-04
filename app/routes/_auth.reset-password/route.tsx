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
  useNavigation,
} from "@remix-run/react";
import { Unlock } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { createPasswordResetToken } from "~/auth/generate-password-reset-token";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Message } from "~/components/ui/message";
import { sendPasswordResetToken } from "~/lib/email";
import { prisma } from "~/lib/prisma.server";
import { getLocaleData, getLocaleFromRequest } from "~/locales";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.t.auth.reset_password.meta.title }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await getLocaleData(request);

  return { t };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const t = await getLocaleData(request);

  const locale = getLocaleFromRequest(request);

  const schema = z.object({
    email: z
      .string()
      .min(1, t.validation.email.required)
      .email(t.validation.email.invalid),
  });

  try {
    const { email } = schema.parse(Object.fromEntries(formData.entries()));

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.emailVerified) {
      return json({ error: t.validation.invalid_credentials }, { status: 400 });
    }

    const verificationToken = await createPasswordResetToken(user.id);
    const verificationLink =
      `https://${locale === "en" ? "" : `${locale}.`}${
        process.env.DOMAIN
      }/reset-password/` + verificationToken;

    await sendPasswordResetToken({ email, link: verificationLink, t });

    return json({ message: t.toasts.reset_link_was_sent }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.formErrors }, { status: 400 });
    }
    return json({ error: t.validation.invalid_credentials }, { status: 400 });
  }
}

export default function RecoverPasswordRoute() {
  const data = useActionData<typeof action>();
  const { t } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const emailRef = useRef<HTMLInputElement>(null);
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data && "errors" in data) {
      if (data.errors.fieldErrors["email"]?.length) {
        emailRef.current?.focus();
      }
    }
    if (data && "message" in data) {
      toast.success(data.message);
    }
  }, [data]);

  return (
    <>
      <div className="text-center space-y-1 mb-8">
        <Unlock className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="font-bold text-2xl">{t.auth.reset_password.title}</h1>
        <p className="text-muted-foreground">
          {t.auth.reset_password.subtitle}
        </p>
      </div>
      <Form method="post" className="space-y-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            ref={emailRef}
            required
            name="email"
            type="email"
            placeholder="example@domain.com"
          />
          {data &&
            "errors" in data &&
            data.errors.fieldErrors["email"]?.map((error) => (
              <Message key={error}>{error}</Message>
            ))}
        </div>
        {data && "error" in data && <Message>{data.error}</Message>}
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? t.auth.reset_password.submitting
            : t.auth.reset_password.submit}
        </Button>
      </Form>
      <div className="text-center mt-4 text-sm">
        <Link
          className="text-primary underline-offset-4 hover:underline"
          to="/login"
        >
          {t.auth.reset_password.login.link}
        </Link>
      </div>
    </>
  );
}
