/**
 * Admin backup API.
 *
 *   GET  /api/admin/backup            → download the DB file as an attachment
 *   GET  /api/admin/backup?email=1    → download + send a copy to BACKUP_EMAILS
 *   POST /api/admin/backup            → email-only: create + send, no download
 *
 * Auth: requires a valid admin session, and (for downloads/emails) the
 * super_admin | admin role. Viewers get 403.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, requireRole } from "@/lib/admin-auth";
import { createDbBackup } from "@/lib/backup";
import { sendBackupEmail, isSmtpConfigured, getBackupEmails } from "@/lib/mail";

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!requireRole(session, ["super_admin", "admin"])) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const url = new URL(request.url);
  const alsoEmail = url.searchParams.get("email") === "1";

  let backup;
  try {
    backup = await createDbBackup();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[backup GET] createDbBackup failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  let emailResult: { ok: boolean; error?: string; recipients?: string[] } | null = null;
  if (alsoEmail) {
    if (!isSmtpConfigured()) {
      emailResult = { ok: false, error: "SMTP not configured", recipients: [] };
    } else {
      const res = await sendBackupEmail(backup.buffer, backup.filename);
      emailResult = { ok: res.ok, error: res.error, recipients: getBackupEmails() };
    }
  }

  // Stream the buffer back as a download.
  const sizeKb = Math.max(1, Math.round(backup.size / 1024));
  const headers: Record<string, string> = {
    "Content-Type": "application/vnd.sqlite3",
    "Content-Disposition": `attachment; filename="${backup.filename}"`,
    "Content-Length": String(backup.size),
    "X-Backup-Filename": backup.filename,
    "X-Backup-Size-Kb": String(sizeKb),
  };
  if (emailResult) {
    headers["X-Backup-Emailed"] = emailResult.ok ? "1" : "0";
    if (emailResult.error) headers["X-Backup-Email-Error"] = encodeURIComponent(emailResult.error);
    if (emailResult.recipients?.length)
      headers["X-Backup-Email-Recipients"] = String(emailResult.recipients.length);
  }

  return new NextResponse(backup.buffer as unknown as BodyInit, { status: 200, headers });
}

export async function POST(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!requireRole(session, ["super_admin", "admin"])) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  let backup;
  try {
    backup = await createDbBackup();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[backup POST] createDbBackup failed:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }

  if (!isSmtpConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        emailed: false,
        filename: backup.filename,
        size: backup.size,
        error: "SMTP not configured",
      },
      { status: 200 } // 200 so the UI can show a clean toast, not a red error
    );
  }

  const res = await sendBackupEmail(backup.buffer, backup.filename);
  return NextResponse.json(
    {
      ok: res.ok,
      emailed: res.ok,
      filename: backup.filename,
      size: backup.size,
      recipients: getBackupEmails(),
      error: res.error,
    },
    { status: res.ok ? 200 : 500 }
  );
}
