import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line
  var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ log: ["info", "error", "query", "warn"] });

  prisma.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();

    global.__db.$connect();
  }

  prisma = global.__db;
}

export { prisma };
