import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  type ActionFunctionArgs,
  type MetaFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { login } from "./login.server";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Message } from "~/components/ui/message";
import { Label } from "~/components/ui/label";
import { Logo } from "~/components/logo";
import { onlyAnonymous } from "~/auth/guards/only-anonymous.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.t.auth.login.meta.title }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  onlyAnonymous(context);

  const { t } = context;

  return { t };
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  return await login(request, context);
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
    <>
      <div className="space-y-1 mb-8 text-center">
        <Logo sizes={48} className="mx-auto mb-4" />
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
    </>
  );
}
