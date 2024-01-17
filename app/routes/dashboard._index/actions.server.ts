import { prisma } from "~/lib/prisma.server";

const slowdown = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getLists(ownerId: string) {
  await slowdown(1000);
  return prisma.list.findMany({
    where: { ownerId: ownerId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });
}

export async function getReserves(ownerId: string) {
  return prisma.item.findMany({
    where: {
      reserverId: ownerId,
    },
  });
}
