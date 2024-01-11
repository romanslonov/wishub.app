import { Argon2id } from "oslo/password";
import { lucia } from "~/auth/lucia";
import { prisma } from "~/lib/prisma.server";

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await new Argon2id().verify(user.password, password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const session = await lucia.createSession(user.id, {});

  return lucia.createSessionCookie(session.id);
}
