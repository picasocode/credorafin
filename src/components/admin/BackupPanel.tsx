"use client";

/**
 * BackupPanel — admin panel for downloading + emailing SQLite DB backups.
 *
 * Pattern follows HeroSlidesPanel.tsx / BlogPostsPanel.tsx:
 *   - self-contained, only depends on react, lucide-react, @/lib/admin-client
 *   - styled to match the dashboard aesthetic (B palette)
 *   - reads SMTP status from /api/admin/settings, triggers backup via
 *     /api/admin/backup (GET = download, POST = email)
 */

import { useCallback, useEffect, useState } from "react";
import {
  Download,
  Mail,
  RefreshCw,
  Check,
  AlertTriangle,
  Database,
  HardDrive,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { apiFetch, canEdit, type AdminUser } from "@/lib/admin-client";

/* ─── Brand colours ─── */
const B = { navy: "#1C1D62", blue: "#304AC0", green: "#87B73C" };

interface SettingsResponse {
  smtp: { host: string; port: number; from: string; configured: boolean };
  backupEmails: string[];
  notifyEmails: string[];
}

interface BackupInfo {
  lastFilename: string | null;
  lastSizeKb: number | null;
  lastAt: number | null;
}

function formatBytes(kb: number | null): string {
  if (kb == null) return "—";
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function formatTime(ts: number | null): string {
  if (!ts) return "Never";
  try {
    return new Date(ts).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function BackupPanel({ user }: { user: AdminUser }) {
  const editable = canEdit(user);
  const [settings, setSettings] = useState<SettingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [toast, setToast] = useState("");
  const [errToast, setErrToast] = useState("");
  const [info, setInfo] = useState<BackupInfo>({
    lastFilename: null,
    lastSizeKb: null,
    lastAt: null,
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiFetch<SettingsResponse>("/api/admin/settings");
      setSettings(d);
    } catch {
      setSettings(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function showToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 3500);
  }
  function showErr(m: string) {
    setErrToast(m);
    setTimeout(() => setErrToast(""), 4500);
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/admin/backup", { credentials: "include" });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error((e as { error?: string }).error || `HTTP ${res.status}`);
      }
      const filename =
        res.headers.get("X-Backup-Filename") || `credorafin-backup-${Date.now()}.db`;
      const sizeKb = Number(res.headers.get("X-Backup-Size-Kb") || 0);
      const buf = await res.arrayBuffer();
      const blob = new Blob([buf], { type: "application/vnd.sqlite3" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
      setInfo({
        lastFilename: filename,
        lastSizeKb: sizeKb || null,
        lastAt: Date.now(),
      });
      showToast(`Downloaded ${filename}`);
    } catch (e: unknown) {
      showErr((e as Error).message || "Download failed");
    }
    setDownloading(false);
  }

  async function handleEmail() {
    setEmailing(true);
    try {
      const d = await apiFetch<{
        ok: boolean;
        emailed: boolean;
        filename: string;
        size: number;
        recipients?: string[];
        error?: string;
      }>("/api/admin/backup", { method: "POST" });
      if (!d.ok) {
        showErr(d.error || "Email send failed (SMTP not configured?)");
      } else {
        setInfo({
          lastFilename: d.filename,
          lastSizeKb: Math.round((d.size || 0) / 1024),
          lastAt: Date.now(),
        });
        const n = d.recipients?.length ?? 0;
        showToast(`Backup emailed to ${n} recipient${n === 1 ? "" : "s"}`);
      }
    } catch (e: unknown) {
      showErr((e as Error).message || "Email failed");
    }
    setEmailing(false);
  }

  if (loading) {
    return (
      <div className="p-6 space-y-3 animate-pulse">
        {[72, 56, 88, 48].map((w, i) => (
          <div key={i} className="h-3 rounded-md bg-gray-100" style={{ width: `${w}%` }} />
        ))}
      </div>
    );
  }

  const smtpConfigured = settings?.smtp.configured ?? false;
  const backupEmails = settings?.backupEmails ?? [];
  const notifyEmails = settings?.notifyEmails ?? [];

  return (
    <div className="space-y-4">
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-xl"
          style={{ background: B.navy, boxShadow: "0 8px 32px rgba(28,29,98,0.25)" }}
        >
          <Check size={15} className="shrink-0" />
          {toast}
        </div>
      )}
      {errToast && (
        <div className="flex items-center gap-2 text-red-600 text-[12px] bg-red-50 px-3 py-2.5 rounded-lg border border-red-100">
          <AlertTriangle size={13} />
          {errToast}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Backup &amp; Data</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Download or email a snapshot of the SQLite database
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Action cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Download */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
            style={{ background: `${B.blue}10`, color: B.blue }}
          >
            <Download size={18} />
          </div>
          <p className="text-[13px] font-bold text-gray-900">Download backup</p>
          <p className="text-[11px] text-gray-400 mt-1 flex-1 leading-relaxed">
            Stream the current SQLite DB file to your browser as a
            <code className="mx-1 px-1 py-0.5 rounded bg-gray-50 text-[10px] font-mono">.db</code>
            attachment.
          </p>
          <button
            onClick={handleDownload}
            disabled={!editable || downloading}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ background: B.navy }}
          >
            {downloading ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Preparing…
              </>
            ) : (
              <>
                <Download size={13} />
                Download database
              </>
            )}
          </button>
          {!editable && (
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Viewers can&apos;t create backups.
            </p>
          )}
        </div>

        {/* Email */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
            style={{ background: `${B.green}10`, color: B.green }}
          >
            <Mail size={18} />
          </div>
          <p className="text-[13px] font-bold text-gray-900">Email backup</p>
          <p className="text-[11px] text-gray-400 mt-1 flex-1 leading-relaxed">
            Send a fresh snapshot to all configured backup recipients.
            {!smtpConfigured && (
              <span className="block mt-1 font-semibold text-amber-600">
                SMTP not configured — set SMTP_HOST in .env.
              </span>
            )}
          </p>
          <button
            onClick={handleEmail}
            disabled={!editable || emailing || !smtpConfigured || backupEmails.length === 0}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ background: B.green }}
          >
            {emailing ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Mail size={13} />
                Email to {backupEmails.length} recipient{backupEmails.length === 1 ? "" : "s"}
              </>
            )}
          </button>
          {backupEmails.length === 0 && smtpConfigured && (
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              No BACKUP_EMAILS configured.
            </p>
          )}
        </div>
      </div>

      {/* Status grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SMTP status */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck
              size={14}
              style={{ color: smtpConfigured ? B.green : "#F59E0B" }}
            />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              SMTP
            </p>
          </div>
          <p className="text-[13px] font-semibold text-gray-900">
            {smtpConfigured ? "Connected" : "Not configured"}
          </p>
          <p className="text-[10px] text-gray-400 mt-1 font-mono break-all">
            {settings?.smtp.host
              ? `${settings.smtp.host}:${settings.smtp.port}`
              : "—"}
          </p>
        </div>

        {/* Backup recipients count */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={14} style={{ color: B.blue }} />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Backup emails
            </p>
          </div>
          <p className="text-[13px] font-semibold text-gray-900">
            {backupEmails.length}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            recipient{backupEmails.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Last backup size */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive size={14} style={{ color: B.navy }} />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Last size
            </p>
          </div>
          <p className="text-[13px] font-semibold text-gray-900">
            {formatBytes(info.lastSizeKb)}
          </p>
          <p className="text-[10px] text-gray-400 mt-1 truncate" title={info.lastFilename ?? ""}>
            {info.lastFilename ?? "No backup yet"}
          </p>
        </div>

        {/* Last backup time */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} style={{ color: B.green }} />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Last action
            </p>
          </div>
          <p className="text-[13px] font-semibold text-gray-900">
            {formatTime(info.lastAt)}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            download or email
          </p>
        </div>
      </div>

      {/* Recipient lists */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Mail size={12} />
              Backup recipients
            </p>
            <span className="text-[10px] text-gray-400 font-mono">BACKUP_EMAILS</span>
          </div>
          {backupEmails.length === 0 ? (
            <p className="text-[12px] text-gray-400 italic">
              None configured. Add comma-separated emails to BACKUP_EMAILS in .env.
            </p>
          ) : (
            <ul className="space-y-1.5 max-h-40 overflow-y-auto">
              {backupEmails.map((e) => (
                <li
                  key={e}
                  className="text-[12px] text-gray-700 font-mono px-2.5 py-1.5 rounded-md bg-gray-50"
                >
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Mail size={12} />
              Lead-notification recipients
            </p>
            <span className="text-[10px] text-gray-400 font-mono">NOTIFY_EMAILS</span>
          </div>
          {notifyEmails.length === 0 ? (
            <p className="text-[12px] text-gray-400 italic">
              None configured. Add comma-separated emails to NOTIFY_EMAILS in .env.
            </p>
          ) : (
            <ul className="space-y-1.5 max-h-40 overflow-y-auto">
              {notifyEmails.map((e) => (
                <li
                  key={e}
                  className="text-[12px] text-gray-700 font-mono px-2.5 py-1.5 rounded-md bg-gray-50"
                >
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${B.navy}10`, color: B.navy }}
          >
            <Database size={16} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-900">
              About these backups
            </p>
            <p className="text-[12px] text-gray-500 leading-relaxed mt-1">
              Backups are point-in-time snapshots of the SQLite file. They capture
              every contact inquiry, referral, application, brochure download,
              admin user (with hashed passwords), hero slide, and blog post. For
              automated daily backups, schedule a cron job:
            </p>
            <pre className="mt-2 px-3 py-2 rounded-md bg-gray-50 text-[11px] font-mono text-gray-700 overflow-x-auto">
              <code>0 2 * * *  cd /home/ubuntu/credorafin && bun run db:backup</code>
            </pre>
            <p className="text-[11px] text-gray-400 mt-2">
              SMTP credentials are read from environment variables and cannot be
              edited from this UI (a security decision — keep secrets out of the
              database).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
