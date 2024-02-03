import { ActionFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
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
import { getLocaleData } from "~/locales";

export const meta: MetaFunction = () => {
  return [{ title: "Recover password" }];
};

const schema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter valid email."),
});

export async function loader() {
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const t = await getLocaleData(request);

  try {
    const { email } = schema.parse(Object.fromEntries(formData.entries()));

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.emailVerified) {
      return json({ error: t.validation.invalid_credentials }, { status: 400 });
    }

    const verificationToken = await createPasswordResetToken(user.id);
    const verificationLink =
      `${process.env.BASE_URL}/reset-password/` + verificationToken;

    await sendPasswordResetToken({ email, link: verificationLink, t });

    return json(
      { message: "Reset link was sent to you email. Check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.formErrors }, { status: 400 });
    }
    return json({ error: t.validation.invalid_credentials }, { status: 400 });
  }
}

export default function RecoverPasswordRoute() {
  const data = useActionData<typeof action>();
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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md bg-card rounded-2xl shadow-sm border w-full p-8">
        <div className="text-center space-y-1 mb-8">
          <Unlock className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="font-bold text-2xl">Reset your password</h1>
          <p className="text-muted-foreground">
            You get an email with a link to reset your password.
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
            {isSubmitting ? "Sending an email..." : "Send"}
          </Button>
        </Form>
        <div className="text-center mt-4 text-sm">
          <Link
            className="text-primary underline-offset-4 hover:underline"
            to="/login"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
