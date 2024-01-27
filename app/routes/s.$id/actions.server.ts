import { prisma } from "~/lib/prisma.server";

export async function reserve(userId: string, itemId: string) {
  return prisma.item.update({
    where: { id: itemId },
    data: { reserverId: userId },
  });
}

export async function unreserve(itemId: string) {
  return prisma.item.update({
    where: { id: itemId },
    data: { reserverId: null },
  });
}
