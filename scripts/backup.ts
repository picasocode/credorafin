/**
 * Standalone DB backup script.
 *
 *   bun run scripts/backup.ts
 *
 * Creates a snapshot of the SQLite DB file, saves it to ./backups/, and (if
 * SMTP is configured) emails a copy to BACKUP_EMAILS. Exits non-zero on
 * failure. Safe to run via cron.
 *
 *   # daily 2am backup
 *   0 2 * * *  cd /home/ubuntu/credorafin && bun run scripts/backup.ts >> backups/backup.log 2>&1
 */

import fs from "node:fs";
import path from "node:path";

// Allow running this file directly with bun — we don't want to boot the
// Next.js module alias system, so import via relative paths.
import { createDbBackup, resolveDbPath } from "../src/lib/backup";
import { sendBackupEmail, isSmtpConfigured, getBackupEmails } from "../src/lib/mail";

async function main() {
  const startedAt = Date.now();
  console.log(`▶  CredoraFin DB backup starting at ${new Date().toISOString()}`);

  const dbPath = resolveDbPath();
  console.log(`   DB path: ${dbPath}`);

  const backup = await createDbBackup();
  console.log(`   Read ${backup.size.toLocaleString()} bytes from disk`);

  const backupsDir = path.resolve(process.cwd(), "backups");
  fs.mkdirSync(backupsDir, { recursive: true });
  const outPath = path.join(backupsDir, backup.filename);
  fs.writeFileSync(outPath, backup.buffer);
  console.log(`   Saved → ${outPath}`);

  if (isSmtpConfigured()) {
    const recipients = getBackupEmails();
    if (recipients.length === 0) {
      console.log("   SMTP configured but no BACKUP_EMAILS set — skipping email");
    } else {
      console.log(`   Emailing to ${recipients.length} recipient(s): ${recipients.join(", ")}`);
      const res = await sendBackupEmail(backup.buffer, backup.filename);
      if (res.ok) {
        console.log(`   ✓ Email sent (messageId=${res.messageId ?? "n/a"})`);
      } else {
        // Email failure is non-fatal — the local backup still succeeded.
        console.warn(`   ! Email failed (non-fatal): ${res.error}`);
      }
    }
  } else {
    console.log("   SMTP not configured — skipping email");
  }

  // Best-effort cleanup: keep only the latest 30 backups.
  try {
    const files = fs
      .readdirSync(backupsDir)
      .filter((f) => f.startsWith("credorafin-backup-") && f.endsWith(".db"))
      .map((f) => ({ f, mtime: fs.statSync(path.join(backupsDir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);
    const stale = files.slice(30);
    for (const { f } of stale) {
      fs.unlinkSync(path.join(backupsDir, f));
    }
    if (stale.length > 0) console.log(`   Pruned ${stale.length} old backup(s) (kept latest 30)`);
  } catch (e) {
    console.warn("   ! Old backup prune failed (non-fatal):", e);
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(2);
  console.log(`✓  Done in ${elapsed}s — ${backup.filename} (${Math.round(backup.size / 1024)} KB)`);
}

main().catch((e) => {
  console.error("✗  Backup failed:", e);
  process.exit(1);
});
