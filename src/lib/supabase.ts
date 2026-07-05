/**
 * Supabase client for server-side usage (API routes, Server Components).
 *
 * Uses Credora's env var naming convention:
 *   SUPABASE_URL
 *   SUPABASE_SECRET_KEY  (service-role key)
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || "";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseSecretKey);

if (!isSupabaseConfigured && typeof window === "undefined") {
  console.warn(
    "[Supabase] SUPABASE_URL or SUPABASE_SECRET_KEY is not set. " +
    "API routes will fall back to console logging. Add them to .env.local"
  );
}

/**
 * Lazy-initialised Supabase client (service-role).
 * Only instantiated when actually called — avoids build-time crashes when
 * env vars are absent (e.g. `next build` without .env.local).
 */
let _client: SupabaseClient | null = null;

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    if (!_client) {
      _client = createClient(supabaseUrl, supabaseSecretKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
    }
    const value = Reflect.get(_client, prop, receiver);
    if (typeof value === "function") return value.bind(_client);
    return value;
  },
});