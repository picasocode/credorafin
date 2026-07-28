/**
 * SQLite backup helper.
 *
 * Reads the SQLite database file into a Buffer and produces a timestamped
 * filename. The DB file path is derived from DATABASE_URL (which is the
 * Prisma `file:./db/app.db` form, relative to the prisma/ dir).
 *
 * Public:
 *   - createDbBackup(): Promise<{ buffer, filename, size, path }>
 *   - resolveDbPath(): string   (exported for the standalone script)
 */

import fs from "node:fs";
import path from "node:path";

export interface DbBackupResult {
  buffer: Buffer;
  filename: string;
  size: number;
  path: string;
}

/**
 * Resolve the on-disk path of the SQLite DB file from DATABASE_URL.
 *
 * Handles:
 *   - "file:./db/app.db"            → <cwd>/db/app.db   (relative to project root)
 *   - "file:db/app.db"              → <cwd>/db/app.db
 *   - "file:/abs/path/app.db"       → /abs/path/app.db
 *   - "file:./db/custom.db"         → <cwd>/db/custom.db
 *
 * The Prisma datasource comment says the path is "relative to the prisma/"
 * directory; in practice `bun run dev` is invoked from the project root and
 * Prisma resolves the file relative to the schema location, so the file ends
 * up at <projectRoot>/db/app.db. We mirror that by resolving against cwd.
 */
export function resolveDbPath(): string {
  const url = process.env.DATABASE_URL ?? "file:./db/app.db";
  let raw = url.trim();
  if (raw.startsWith("file:")) raw = raw.slice("file:".length);
  raw = raw.trim();

  if (path.isAbsolute(raw)) return raw;

  // Project root = cwd (Next.js + bun are launched from repo root).
  // Allow falling back through `db/custom.db` if the user is on the old name.
  return path.resolve(process.cwd(), raw);
}

/**
 * Read the SQLite DB file into memory and return a Buffer + timestamped
 * filename + size. Throws if the file does not exist or is unreadable.
 *
 * Note: SQLite is safe to copy while the server is running as long as WAL
 * mode is enabled — the file copy may miss in-flight writes to the WAL, but
 * for backup purposes the next checkpoint will reconcile. For a fully
 * consistent snapshot, run `PRAGMA wal_checkpoint(TRUNCATE)` before reading.
 */
export async function createDbBackup(): Promise<DbBackupResult> {
  const dbPath = resolveDbPath();

  // Try to checkpoint the WAL so the main file has the latest data.
  // Best-effort: if Prisma isn't ready or DB is unreachable, skip.
  try {
    // Import lazily so the standalone backup script can run without booting
    // the full Next.js/Prisma singleton.
    const { db } = await import("@/lib/db");
    await db.$executeRawUnsafe("PRAGMA wal_checkpoint(TRUNCATE);").catch(() => {});
  } catch {
    // ignore — checkpoint is best-effort
  }

  if (!fs.existsSync(dbPath)) {
    throw new Error(`Database file not found at ${dbPath}`);
  }

  const buffer = fs.readFileSync(dbPath);
  const ts = new Date()
    .toISOString()
    .replace(/[:.]/g, "-") // colons are illegal in Windows filenames
    .slice(0, 19); // YYYY-MM-DDTHH-MM-SS
  const filename = `credorafin-backup-${ts}.db`;

  return {
    buffer,
    filename,
    size: buffer.length,
    path: dbPath,
  };
}
