import { AppLoadContext, json, redirect } from "@remix-run/node";
import { Argon2id } from "oslo/password";
import { z } from "zod";
import { lucia } from "~/auth/lucia.server";
import { prisma } from "~/lib/prisma.server";

export async function login(request: Request, context: AppLoadContext) {
  const { t } = context;

  const schema = z.object({
    email: z
      .string()
      .min(1, t.validation.email.required)
      .email(t.validation.email.invalid),
    password: z
      .string()
      .min(1, t.validation.password.required)
      .min(8, t.validation.password.too_short),
  });

  try {
    const formData = await request.formData();

    const { email, password } = schema.parse(
      Object.fromEntries(formData.entries())
    );

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error(t.validation.invalid_credentials);
    }

    const isPasswordValid = await new Argon2id().verify(
      user.password,
      password
    );

    if (!isPasswordValid) {
      throw new Error(t.validation.invalid_credentials);
    }

    const session = await lucia.createSession(user.id, {});

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
