import type { NextRequest } from "next/server";

const COOKIE_NAME = "credora_admin_session";

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

/**
 * Reads and validates the admin session from the request cookie.
 * Returns null if the session is missing, malformed, or expired.
 */
export function verifyAdminSession(request: NextRequest): AdminSession | null {
  try {
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
    if (!cookie) return null;
    const decoded = JSON.parse(Buffer.from(cookie, "base64").toString("utf-8")) as AdminSession;
    if (!decoded.exp || decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Returns true if the session's role is in the allowed list.
 */
export function requireRole(session: AdminSession, roles: string[]): boolean {
  return roles.includes(session.role);
}
