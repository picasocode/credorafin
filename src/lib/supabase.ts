/**
 * Supabase server client — for use in API routes / server components.
 * Uses the service-role key to bypass RLS (the Next.js backend is trusted).
 *
 * Use this for Storage uploads, Auth admin actions, and Realtime — NOT for
 * regular DB queries, which should go through Prisma (`@/lib/db`) so the
 * schema stays single-source-of-truth.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // In dev this is usually a misconfiguration; in build it's fine (no runtime call).
  // We log once instead of throwing so `next build` doesn't hard-fail on CI.
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — " +
        "server client will be null. Run `supabase start` and copy keys to .env"
    );
  }
}

export const supabaseAdmin =
  url && serviceKey
    ? createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

/** Browser-side anon client (safe to expose). Returns null if env unset. */
export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon);
}
