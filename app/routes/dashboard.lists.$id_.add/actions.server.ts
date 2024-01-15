import { prisma } from "~/lib/prisma.server";

export async function addListItems(
  listId: string,
  items: { name: string; url: string }[]
) {
  const data = items.map((item) => ({ ...item, listId }));

  return prisma.item.createMany({ data });
}
