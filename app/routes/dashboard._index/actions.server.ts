import { prisma } from "~/lib/prisma.server";

export async function getLists(ownerId: string) {
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
    include: {
      list: {
        include: { owner: true },
      },
    },
  });
}
