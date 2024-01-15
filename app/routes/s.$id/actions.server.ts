import { prisma } from "~/lib/prisma.server";

export async function reserve(userId: string, itemId: string) {
  return prisma.item.update({
    where: { id: itemId },
    data: { reserverId: userId },
  });
}
