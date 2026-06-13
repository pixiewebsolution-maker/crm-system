import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// SAAS PRODUCTION NOTE:
// To prevent Serverless function connection exhaustion, you MUST use connection pooling.
// If using Prisma Accelerate, install `@prisma/extension-accelerate` and uncomment the extension below.
// If using PgBouncer (e.g., Supabase), ensure your DATABASE_URL appends `?pgbouncer=true&connection_limit=1`.
// See: https://www.prisma.io/docs/guides/performance-and-optimization/connection-management

const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db

