import { TimeSpan, generateId } from "lucia";
import { createDate } from "oslo";
import { prisma } from "~/lib/prisma.server";

export async function createPasswordResetToken(userId: string) {
  await prisma.passwordResetToken.deleteMany({ where: { userId } });

  const tokenId = generateId(40);

  await prisma.passwordResetToken.create({
    data: {
      id: tokenId,
      userId,
      expiresAt: createDate(new TimeSpan(2, "h")),
    },
  });

  return tokenId;
}
