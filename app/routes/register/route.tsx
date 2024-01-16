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
import { createUser } from "./create-user.server";
import { allowAnonymous } from "~/auth/allow-anonymous";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Ghost } from "lucide-react";
import { Message } from "~/components/ui/message";
import { generateEmailVerificationCode } from "~/auth/generate-email-verification-code";
import { sendVerificationEmail } from "~/lib/email";

export const meta: MetaFunction = () => {
  return [
    { title: "Create your account" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  try {
    const { email, password } = schema.parse(Object.fromEntries(formData));

    const { userId, cookie } = await createUser(email, password);

    const code = await generateEmailVerificationCode(userId, email);

    await sendVerificationEmail(email, code);

    return redirect("/welcome", {
      headers: {
        "Set-Cookie": cookie.serialize(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.formErrors }, { status: 400 });
    }
    return json({ error: "Something goes wrong." }, { status: 500 });
  }
};

export async function loader({ request }: LoaderFunctionArgs) {
  await allowAnonymous(request);
  return null;
}

export default function RegisterRoute() {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const isSubmitting = navigation.state !== "idle";

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
        <div className="text-center space-y-1 mb-8">
          <Ghost className="w-12 h-12 mx-auto text-primary mb-4" />
          <h1 className="font-bold text-2xl mb-4">Create your account</h1>
          <p className="text-muted-foreground">
            Join today ahd start to share wish lists.
          </p>
        </div>
        <Form method="post" className="space-y-4 mb-4">
          <div className="space-y-2">
            <Input
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
          <div>
            <Input
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
          <Button className="w-full" type="submit">
            {isSubmitting ? "Creating..." : "Create an account"}
          </Button>
        </Form>
        <p className="text-muted-foreground text-sm text-center">
          Already have an account?{" "}
          <Link
            className="text-primary underline-offset-4 hover:underline"
            to="/login"
          >
            Login to your account
          </Link>
        </p>
      </div>
    </div>
  );
}
