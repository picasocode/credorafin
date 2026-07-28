/**
 * Rate limiting — in-memory sliding-window per identifier.
 *
 * Designed for single-instance deployments (Next.js standalone on one box).
 * For multi-instance, swap the Map for Redis. The API is intentionally
 * framework-agnostic: callers pass their own identifier (typically the
 * client IP from x-forwarded-for).
 *
 *   const { allowed, remaining } = rateLimit(ip, 5, 60_000);
 *   if (!allowed) return new Response("Too Many Requests", { status: 429, headers: { "Retry-After": "60" }});
 */

const buckets = new Map<string, number[]>();

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the oldest request in the current window expires — useful
   *  for the Retry-After header. */
  retryAfter: number;
}

/**
 * Sliding-window rate limit. Returns `allowed=false` once `maxRequests`
 * have been recorded inside the last `windowMs` for the given identifier.
 *
 * Memory is unbounded in theory; in practice the eviction sweep below
 * keeps it bounded by the number of distinct identifiers per window. For
 * extra safety, the Map is also pruned every PRUNE_INTERVAL ms.
 */
export function rateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  // Lazy prune — keeps the Map from growing without bound under attack.
  if ((pruneCounter = (pruneCounter + 1) % PRUNE_INTERVAL) === 0) {
    for (const [key, ts] of buckets) {
      const last = ts[ts.length - 1] ?? 0;
      if (last < cutoff) buckets.delete(key);
    }
  }

  const key = identifier || "anonymous";
  const arr = buckets.get(key) ?? [];
  // Drop timestamps outside the window.
  const fresh = arr.filter((t) => t > cutoff);

  if (fresh.length >= maxRequests) {
    const oldest = fresh[0] ?? now;
    const retryAfter = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, fresh);
    return { allowed: false, remaining: 0, retryAfter };
  }

  fresh.push(now);
  buckets.set(key, fresh);
  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - fresh.length),
    retryAfter: 0,
  };
}

let pruneCounter = 0;
const PRUNE_INTERVAL = 256; // sweep the Map every N calls

/* ─── Convenience: extract IP from a Request ─── */

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
