import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
  redirect,
} from "@remix-run/node";
import { z } from "zod";
import { createUser } from "./create-user.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Create your account" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const schema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(8),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return json({ errors: "Invalid credentials." }, { status: 400 });
  }

  const { email, password } = parsed.data;

  console.log({ email, password });
  try {
    const cookies = await createUser(email, password);

    return redirect("/", {
      headers: {
        "Set-Cookie": cookies.serialize(),
      },
    });
  } catch (error) {
    console.log(error);
    return json({ errors: "Something goes wrong." }, { status: 500 });
  }
};

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full p-8">
        <h1 className="font-bold text-2xl mb-4 text-center">
          Create your account
        </h1>
        <form method="post" className="space-y-4">
          <Input
            required
            name="email"
            defaultValue={"test@gmail.com"}
            type="email"
            placeholder="example@domain.com"
          />
          <Input
            required
            name="password"
            type="password"
            defaultValue={"12345678"}
            placeholder="********"
          />
          <Button className="w-full" type="submit">
            Create an account
          </Button>
        </form>
      </div>
    </div>
  );
}
