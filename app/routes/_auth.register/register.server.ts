import { AppLoadContext, json, redirect } from "@remix-run/node";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { z } from "zod";
import { generateEmailVerificationCode } from "~/auth/generate-email-verification-code";
import { lucia } from "~/auth/lucia.server";
import { sendVerificationEmail } from "~/lib/email";
import { prisma } from "~/lib/prisma.server";

export async function register(request: Request, context: AppLoadContext) {
  const { t } = context;

  const schema = z.object({
    name: z.string().min(1, t.validation.name.required),
    email: z
      .string()
      .min(1, t.validation.email.required)
      .email(t.validation.email.invalid),
    password: z.string().min(8, t.validation.password.too_short),
  });

  try {
    const formData = await request.formData();

    const { name, email, password } = schema.parse(
      Object.fromEntries(formData)
    );

    const hashedPassword = await new Argon2id().hash(password);
    const userId = generateId(15);

    await prisma.user.create({
      data: {
        id: userId,
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
      },
    });

    const session = await lucia.createSession(userId, {});

    const cookie = lucia.createSessionCookie(session.id);

    const code = await generateEmailVerificationCode(userId, email);

    await sendVerificationEmail({ email, code, t });

    return redirect("/welcome", {
      headers: {
        "Set-Cookie": cookie.serialize(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.formErrors }, { status: 400 });
    }
    return json({ error: t.validation.unexpected_error }, { status: 500 });
  }
}
