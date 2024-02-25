import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "~/lib/prisma.server";
import { Lucia } from "lucia";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

const isProduction = process.env.NODE_ENV === "production";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      domain: isProduction ? process.env.DOMAIN : "localhost",
      secure: isProduction,
    },
  },
  getUserAttributes(attributes) {
    return {
      email: attributes.email,
      emailVerified: attributes.emailVerified,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: string;
      email: string;
      emailVerified: boolean;
    };
  }
}
