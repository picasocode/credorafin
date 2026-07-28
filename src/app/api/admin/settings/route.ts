/**
 * Admin settings API (read-only).
 *
 *   GET /api/admin/settings → { smtp, backupEmails, notifyEmails }
 *
 * Returns the SMTP connection status WITHOUT the password. SMTP creds are
 * intentionally not editable from the web UI — admins must edit .env.
 *
 * Any authenticated admin (any role) may view.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getSmtpInfo, getBackupEmails, getNotifyEmails } from "@/lib/mail";

export async function GET(request: NextRequest) {
  const session = verifyAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const smtp = getSmtpInfo();
  // Strip the password-bearing field — only show host/port/from/configured.
  const { host, port, from, configured } = smtp;

  return NextResponse.json({
    smtp: { host, port, from, configured },
    backupEmails: getBackupEmails(),
    notifyEmails: getNotifyEmails(),
  });
}
