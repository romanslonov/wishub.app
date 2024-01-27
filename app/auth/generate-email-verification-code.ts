import { TimeSpan, createDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { prisma } from "~/lib/prisma.server";

export async function generateEmailVerificationCode(
  userId: string,
  email: string
) {
  await prisma.emailVerificationCode.deleteMany({ where: { userId } });

  const code = generateRandomString(6, alphabet("0-9"));

  await prisma.emailVerificationCode.create({
    data: {
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(5, "m")), // 5 minutes
    },
  });

  return code;
}
