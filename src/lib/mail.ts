/**
 * Mail library — nodemailer-based SMTP sender.
 *
 * All SMTP config is read from environment variables (SMTP_HOST, SMTP_PORT,
 * SMTP_USER, SMTP_PASS, SMTP_FROM). If SMTP_HOST is not set, every public
 * function silently returns `{ ok:false, error:"SMTP not configured" }` so
 * the app keeps working without a mail server (e.g. local dev, CI).
 *
 * Public API:
 *   - sendMail({ to, subject, html, text, attachments? })
 *   - sendBackupEmail(backupBuffer, filename)
 *   - sendLeadNotification(type, data)
 *
 * SECURITY: nodemailer is imported lazily inside the singleton getter so a
 * missing peer dep / misconfigured env can never break the request path that
 * imports this module for type-only reasons.
 */

import type { Transporter } from "nodemailer";

/* ─── Config (read once at module load; env is frozen at boot) ─── */

const SMTP_HOST = process.env.SMTP_HOST?.trim() || "";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER?.trim() || "";
const SMTP_PASS = process.env.SMTP_PASS?.trim() || "";
const SMTP_FROM = process.env.SMTP_FROM?.trim() || "CredoraFin <noreply@credorafin.com>";

const BACKUP_EMAILS = (process.env.BACKUP_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const NOTIFY_EMAILS = (process.env.NOTIFY_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const isSmtpConfigured = (): boolean => SMTP_HOST.length > 0;

export function getBackupEmails(): string[] {
  return [...BACKUP_EMAILS];
}

export function getNotifyEmails(): string[] {
  return [...NOTIFY_EMAILS];
}

export function getSmtpInfo() {
  return {
    host: SMTP_HOST,
    port: SMTP_PORT,
    from: SMTP_FROM,
    user: SMTP_USER,
    configured: isSmtpConfigured(),
  };
}

/* ─── Transporter singleton (lazy) ─── */

let transporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter | null> {
  if (!isSmtpConfigured()) return null;
  if (transporter) return transporter;
  // Lazy require so this module can be imported in environments where
  // nodemailer isn't actually needed (and to keep the import cost out of the
  // hot path when SMTP is unconfigured).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createTransport } = require("nodemailer") as typeof import("nodemailer");
  transporter = createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false (STARTTLS) for 587/25
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return transporter;
}

/* ─── Types ─── */

export interface MailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

export interface SendMailInput {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: MailAttachment[];
}

export interface SendMailResult {
  ok: boolean;
  error?: string;
  messageId?: string;
}

/* ─── Public API ─── */

export async function sendMail(input: SendMailInput): Promise<SendMailResult> {
  if (!isSmtpConfigured()) {
    return { ok: false, error: "SMTP not configured" };
  }
  try {
    const tr = await getTransporter();
    if (!tr) return { ok: false, error: "SMTP not configured" };
    const to = Array.isArray(input.to) ? input.to.join(", ") : input.to;
    const info = await tr.sendMail({
      from: SMTP_FROM,
      to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      attachments: input.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    });
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[mail] sendMail failed:", msg);
    return { ok: false, error: msg };
  }
}

/**
 * Send the SQLite DB backup to all configured BACKUP_EMAILS recipients.
 * Returns aggregated ok=true only if every recipient succeeded; otherwise
 * the result carries the concatenated error message.
 */
export async function sendBackupEmail(
  backupBuffer: Buffer,
  filename: string
): Promise<SendMailResult> {
  if (!isSmtpConfigured()) {
    return { ok: false, error: "SMTP not configured" };
  }
  if (BACKUP_EMAILS.length === 0) {
    return { ok: false, error: "No BACKUP_EMAILS configured" };
  }

  const sizeKb = Math.max(1, Math.round(backupBuffer.length / 1024));
  const ts = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
      <div style="background:#1C1D62;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
        <h1 style="margin:0;font-size:18px;font-weight:700;letter-spacing:-0.01em">CredoraFin — Database Backup</h1>
        <p style="margin:4px 0 0;font-size:12px;color:#cbd5e1">${ts}</p>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:0;padding:20px 24px;border-radius:0 0 12px 12px">
        <p style="margin:0 0 12px;font-size:14px">A scheduled database backup is attached to this email.</p>
        <table style="width:100%;font-size:13px;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#64748b">File</td><td style="padding:6px 0;font-weight:600;font-family:monospace">${filename}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Size</td><td style="padding:6px 0;font-weight:600">${sizeKb} KB</td></tr>
          <tr><td style="padding:6px 0;color:#64748b">Recipients</td><td style="padding:6px 0;font-weight:600">${BACKUP_EMAILS.length}</td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:12px">
          This is an automated message from CredoraFin. Store the backup securely and rotate old copies regularly.
        </p>
      </div>
    </div>
  `;

  const text = `CredoraFin Database Backup\n\nFile: ${filename}\nSize: ${sizeKb} KB\nGenerated: ${ts}\n\nPlease find the SQLite database backup attached.`;

  return sendMail({
    to: BACKUP_EMAILS,
    subject: `[CredoraFin Backup] ${filename}`,
    html,
    text,
    attachments: [
      {
        filename,
        content: backupBuffer,
        contentType: "application/vnd.sqlite3",
      },
    ],
  });
}

/**
 * Send a formatted lead-notification email to all NOTIFY_EMAILS recipients.
 *
 * `type` is one of: "contact" | "referral-partner" | "career" | "brochure"
 * `data` is the raw submitted payload (already-saved DB row).
 *
 * Failures are logged but never thrown — the caller (public POST route)
 * treats email as best-effort.
 */
export async function sendLeadNotification(
  type: string,
  data: Record<string, unknown>
): Promise<SendMailResult> {
  if (!isSmtpConfigured()) {
    return { ok: false, error: "SMTP not configured" };
  }
  if (NOTIFY_EMAILS.length === 0) {
    return { ok: false, error: "No NOTIFY_EMAILS configured" };
  }

  const typeLabels: Record<string, string> = {
    contact: "New Contact Inquiry",
    "referral-partner": "New Referral Partner Application",
    career: "New Job Application",
    brochure: "New Brochure Download",
  };
  const label = typeLabels[type] ?? `New Lead: ${type}`;
  const ts = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

  // Render the lead payload as a clean key/value table. Skip noisy fields.
  const skipKeys = new Set(["id", "ipAddress", "ip_address", "userAgent", "user_agent", "passwordHash", "password_hash"]);
  const rows = Object.entries(data)
    .filter(([k]) => !skipKeys.has(k))
    .map(([k, v]) => {
      const val = v == null || v === "" ? "—" : String(v);
      return `<tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top;white-space:nowrap">${escapeHtml(humanizeKey(k))}</td><td style="padding:6px 0;font-weight:500;word-break:break-word">${escapeHtml(val)}</td></tr>`;
    })
    .join("");

  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0f172a">
      <div style="background:#1C1D62;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0">
        <h1 style="margin:0;font-size:18px;font-weight:700;letter-spacing:-0.01em">${escapeHtml(label)}</h1>
        <p style="margin:4px 0 0;font-size:12px;color:#cbd5e1">${ts}</p>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:0;padding:20px 24px;border-radius:0 0 12px 12px">
        <table style="width:100%;font-size:13px;border-collapse:collapse">${rows || '<tr><td style="padding:6px 0;color:#94a3b8">No details captured.</td></tr>'}</table>
        <p style="margin:16px 0 0;font-size:12px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:12px">
          Review and act on this lead in the CredoraFin admin dashboard.
        </p>
      </div>
    </div>
  `;

  const textLines = Object.entries(data)
    .filter(([k]) => !skipKeys.has(k))
    .map(([k, v]) => `${humanizeKey(k)}: ${v == null || v === "" ? "—" : String(v)}`)
    .join("\n");
  const text = `${label}\n${ts}\n\n${textLines}\n\n— CredoraFin`;

  return sendMail({
    to: NOTIFY_EMAILS,
    subject: `[CredoraFin Lead] ${label}`,
    html,
    text,
  });
}

/* ─── Internal helpers ─── */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function humanizeKey(k: string): string {
  return k
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}
