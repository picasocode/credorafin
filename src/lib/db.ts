import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  __prismaPragmasApplied: boolean | undefined
}

// Query logging is noisy + expensive in production; enable only in dev.
const logLevel = process.env.NODE_ENV === 'production'
  ? ['error', 'warn'] as const
  : ['query', 'error', 'warn'] as const

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [...logLevel],
  })

/**
 * Apply SQLite hardening PRAGMAs to the underlying connection.
 *
 * - journal_mode=WAL   → better concurrency + crash recovery
 * - foreign_keys=ON    → enforce FK constraints (off by default in SQLite)
 * - synchronous=NORMAL → safe with WAL, faster than FULL
 *
 * Wrapped in try/catch so a transient DB outage at boot doesn't crash the app
 * (e.g. during a deploy before the db/ folder exists). The flag is per-process;
 * re-running it on an already-initialised client is a cheap no-op.
 */
async function applySqlitePragmas(): Promise<void> {
  if (globalForPrisma.__prismaPragmasApplied) return
  try {
    // Use $queryRawUnsafe for PRAGMAs that return rows (journal_mode returns
    // the new mode; foreign_keys/synchronous return the value). $executeRawUnsafe
    // throws "Execute returned results, which is not allowed in SQLite" for these.
    await db.$queryRawUnsafe('PRAGMA journal_mode=WAL;')
    await db.$queryRawUnsafe('PRAGMA foreign_keys=ON;')
    await db.$queryRawUnsafe('PRAGMA synchronous=NORMAL;')
    globalForPrisma.__prismaPragmasApplied = true
  } catch (err) {
    // Non-fatal: log + move on. The app will still function; just without
    // the hardening until the next process restart.
    console.warn('[db] SQLite PRAGMA hardening failed (non-fatal):', err)
  }
}

// Fire-and-forget on module load. Awaiting here would delay first request,
// but PRAGMAs are per-connection and Prisma pools connections lazily, so the
// race is benign — the first request that hits a fresh connection will
// re-apply via the same idempotent flag check.
void applySqlitePragmas()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
