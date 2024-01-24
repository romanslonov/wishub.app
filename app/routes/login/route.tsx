import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
  redirect,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { z } from "zod";
import { login } from "./login.server";
import { allowAnonymous } from "~/auth/allow-anonymous";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Message } from "~/components/ui/message";
import { Ghost } from "lucide-react";
import { Label } from "~/components/ui/label";
import { getLocaleData } from "~/locales";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.t.auth.login.meta.title }];
};

const schema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter valid email."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
});

export async function loader({ request }: LoaderFunctionArgs) {
  await allowAnonymous(request);

  const t = await getLocaleData(request);

  return { t };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  try {
    const { email, password } = schema.parse(
      Object.fromEntries(formData.entries())
    );

    const cookies = await login(email, password);

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
};

export default function Login() {
  const data = useActionData<typeof action>();
  const { t } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data && "errors" in data) {
      if (data.errors.fieldErrors["email"]?.length) {
        emailRef.current?.focus();
      } else if (data.errors.fieldErrors["password"]?.length) {
        passwordRef.current?.focus();
      }
    }
  }, [data]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full p-8">
        <div className="space-y-1 mb-8 text-center">
          <Ghost className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="font-bold text-2xl">{t.auth.login.title}</h1>
          <p className="text-muted-foreground">{t.auth.login.subtitle}</p>
        </div>
        <Form method="post" className="space-y-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.login.email.label}*</Label>
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t.auth.login.password.label}*</Label>
              <Link
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                to="/reset-password"
              >
                {t.auth.login.forgot_password}
              </Link>
            </div>
            <Input
              id="password"
              ref={passwordRef}
              required
              name="password"
              type="password"
              placeholder="********"
            />
            {data &&
              "errors" in data &&
              data.errors.fieldErrors["password"]?.map((error) => (
                <Message key={error}>{error}</Message>
              ))}
          </div>
          {data && "error" in data && <Message>{data.error}</Message>}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Loging in..." : t.auth.login.submit}
          </Button>
        </Form>
        <p className="text-muted-foreground text-sm text-center">
          {t.auth.login.register.label}{" "}
          <Link
            className="text-primary underline-offset-4 hover:underline"
            to="/register"
          >
            {t.auth.login.register.link}
          </Link>
        </p>
      </div>
    </div>
  );
}
