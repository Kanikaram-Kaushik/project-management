import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
const tursoUrl = process.env.TURSO_DATABASE_URL || 'file:./dev.db';
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

const adapter = new PrismaLibSql({
  url: tursoUrl,
  authToken: tursoAuthToken,
})

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = globalForPrisma.prisma || new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })
