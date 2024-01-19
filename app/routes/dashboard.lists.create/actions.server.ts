import { prisma } from "~/lib/prisma.server";

export async function createList(
  userId: string,
  {
    items,
    ...data
  }: {
    name: string;
    description?: string;
    public: boolean;
    items: { name: string; url: string }[];
  }
) {
  return await prisma.list.create({
    data: {
      ...data,
      owner: { connect: { id: userId } },
      items: { createMany: { data: items } },
    },
  });
}
