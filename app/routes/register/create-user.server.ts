import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { lucia } from "~/auth/lucia";
import { prisma } from "~/lib/prisma.server";

export async function createUser(email: string, password: string) {
  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  await prisma.user.create({
    data: {
      id: userId,
      email,
      password: hashedPassword,
    },
  });

  const session = await lucia.createSession(userId, {});

  return lucia.createSessionCookie(session.id);
}
