import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: 'file:./dev.db',
})

// In dev, we normally cache the PrismaClient instance on globalThis to avoid 
// connection limit exhaustion. But to clear the stale broken client without 
// requiring a server restart, we will temporarily overwrite the cache.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Force a new instance to clear the stale cache
globalForPrisma.prisma = new PrismaClient({ adapter })
export const prisma = globalForPrisma.prisma
