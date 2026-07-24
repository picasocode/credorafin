/**
 * Shared client-side helpers for admin panel components.
 *
 * Kept in /lib so the standalone admin panel files
 * (src/components/admin/*.tsx) can reuse the same fetch helper and
 * AdminUser shape that the main dashboard uses inline.
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

/** fetch() wrapper that sends credentials and throws on non-2xx. */
export async function apiFetch<T = unknown>(
  path: string,
  opts?: RequestInit
): Promise<T> {
  const res = await fetch(path, { credentials: "include", ...opts });
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error((e as { error?: string }).error || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

/** Role gate helper mirroring the server-side requireRole(). */
export function canEdit(user: AdminUser | null | undefined): boolean {
  return !!user && (user.role === "super_admin" || user.role === "admin");
}
