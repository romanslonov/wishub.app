import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "~/lib/prisma.server";
import { Lucia } from "lucia";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(attributes) {
    return {
      email: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: { id: string; email: string };
  }
}
