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

export const meta: MetaFunction = () => {
  return [{ title: "Recover password" }];
};

const schema = z.object({
  token: z.string().min(1, "Token is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function loader({ params }: LoaderFunctionArgs) {
  return {
    token: params.token,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

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
      return json(
        { error: "Invalid token. Try to request new one." },
        { status: 400 }
      );
    }

    if (!isWithinExpirationDate(databaseToken.expiresAt)) {
      return json(
        { error: "Token is expired, please request a new one." },
        { status: 400 }
      );
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
    return json({ error: "Invalid credentials." }, { status: 400 });
  }
}

export default function RecoverPasswordTokenRoute() {
  const { token } = useLoaderData<typeof loader>();
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
      <div className="max-w-md w-full p-8">
        <div className="text-center space-y-1 mb-8">
          <Sparkles className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="font-bold text-2xl">Set new password</h1>
          <p className="text-muted-foreground">
            Set new secure password for your account.
          </p>
        </div>
        <Form method="post" className="space-y-4 mb-4">
          <div className="space-y-2">
            <input type="hidden" name="token" value={token} />
            <Input
              ref={passwordRef}
              required
              name="password"
              type="password"
              placeholder="********"
            />
            {data &&
              "errors" in data &&
              data.errors.fieldErrors["email"]?.map((error) => (
                <Message key={error}>{error}</Message>
              ))}
          </div>
          {data && "error" in data && <Message>{data.error}</Message>}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Changing password..." : "Change password"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
