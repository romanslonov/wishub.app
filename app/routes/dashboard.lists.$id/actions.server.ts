import { prisma } from "~/lib/prisma.server";

export async function getListWithItems({
  listId,
  ownerId,
}: {
  listId: string;
  ownerId: string;
}) {
  return prisma.list.findFirst({
    where: { id: listId, ownerId },
    include: { items: true },
  });
}

export async function updateList(
  listId: string,
  data: { name?: string; description?: string; public?: boolean }
) {
  return prisma.list.update({ where: { id: listId }, data });
}

export async function updateItem({
  itemId,
  data,
}: {
  itemId: string;
  data: { name: string; url: string };
}) {
  return prisma.item.update({ where: { id: itemId }, data });
}

export async function removeList(listId: string) {
  return prisma.list.delete({ where: { id: listId } });
}

export async function removeItem(itemId: string) {
  return prisma.item.delete({ where: { id: itemId } });
}
