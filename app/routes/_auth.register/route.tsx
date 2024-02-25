import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  type ActionFunctionArgs,
  type MetaFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
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
import { register } from "./register.server";
import { Logo } from "~/components/logo";
import { onlyAnonymous } from "~/auth/guards/only-anonymous.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.t.auth.register.meta.title }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  onlyAnonymous(context);

  const { t } = context;

  return {
    t,
  };
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  return await register(request, context);
};

export default function RegisterRoute() {
  const data = useActionData<typeof action>();
  const { t } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (data && "errors" in data) {
      if (data.errors.fieldErrors["name"]?.length) {
        nameRef.current?.focus();
      } else if (data.errors.fieldErrors["email"]?.length) {
        emailRef.current?.focus();
      } else if (data.errors.fieldErrors["password"]?.length) {
        passwordRef.current?.focus();
      }
    }
  }, [data]);

  return (
    <>
      <div className="text-center space-y-1 mb-8">
        <Logo sizes={48} className="mx-auto mb-4" />
        <h1 className="font-bold text-2xl mb-4">{t.auth.register.title}</h1>
        <p className="text-muted-foreground">{t.auth.register.subtitle}</p>
      </div>
      <Form method="post" className="space-y-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t.auth.register.name.label}*</Label>
          <Input
            id="name"
            required
            name="name"
            type="text"
            placeholder="Frank Lampard"
          />
          {data &&
            "errors" in data &&
            data.errors.fieldErrors["name"]?.map((error) => (
              <Message key={error}>{error}</Message>
            ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t.auth.register.email.label}*</Label>
          <Input
            id="email"
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
          <Label htmlFor="password">{t.auth.register.password.label}*</Label>
          <Input
            id="password"
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
          {isSubmitting ? "Creating..." : t.auth.register.submit}
        </Button>
      </Form>
      <p className="text-muted-foreground text-sm text-center">
        {t.auth.register.login.label}{" "}
        <Link
          className="text-primary underline-offset-4 hover:underline"
          to="/login"
        >
          {t?.auth.register.login.link}
        </Link>
      </p>
    </>
  );
}
