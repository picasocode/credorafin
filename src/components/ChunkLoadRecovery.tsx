"use client";

/**
 * ChunkLoadRecovery — silent auto-recovery from stale-build ChunkLoadError.
 *
 * THE PROBLEM THIS SOLVES
 * ------------------------
 * After a redeploy, the server's `.next/static/chunks/` directory contains
 * NEW chunk files with new content-hashed names (e.g. `b3f2a1c.js`).
 * But a user who had a tab open DURING the deploy still has the OLD page
 * HTML / route manifest in memory, which references OLD chunk names (e.g.
 * `aca3ef4.js`) that no longer exist on disk → the browser gets a 404 →
 * `Uncaught ChunkLoadError: Failed to load chunk …` → broken white page.
 *
 * The same thing happens to font preloads (old HTML preloads a `.woff2`
 * hash that's gone → "resource preloaded was not used within a few seconds").
 *
 * nginx already sets `Cache-Control: no-store` on HTML so fresh visitors
 * always get the new manifest. But that does NOT help users who already
 * have a tab open from before the deploy — their in-memory references are
 * stale and no HTTP header can fix that.
 *
 * THE FIX
 * -------
 * Listen for the three signals that indicate a stale-chunk failure:
 *   1. `window.error` (runtime)            — webpack throws ChunkLoadError
 *   2. `window.unhandledrejection`         — dynamic `import()` rejects
 *   3. `window.error` (capture phase)      — <script>/<link> resource 404
 *
 * When any of these match a chunk-error pattern, force a single
 * `location.replace()` with a cache-busting query param. The browser
 * re-fetches fresh HTML (which references the new chunks) and the page
 * heals itself. The user sees a brief flash, not a broken page.
 *
 * GUARD RAILS
 * -----------
 * - `sessionStorage` flag prevents infinite reload loops (only retries
 *   once per tab session).
 * - `location.replace()` (not `href=`) keeps the broken page out of
 *   browser history — back button goes to the previous real page.
 * - Only matches `/_next/static/` URLs so it never interferes with
 *   legitimate errors (API failures, third-party scripts, etc.).
 */
import { useEffect } from "react";

const CHUNK_ERROR_PATTERNS = [
  "Loading chunk",
  "Loading failed",
  "Failed to fetch dynamically imported module",
  "ChunkLoadError",
  "Importing a module script failed",
  "error loading dynamically imported module",
];

function isChunkError(text: string): boolean {
  const lower = text.toLowerCase();
  return CHUNK_ERROR_PATTERNS.some((p) => lower.includes(p.toLowerCase()));
}

export default function ChunkLoadRecovery() {
  useEffect(() => {
    // Only attempt recovery once per tab session — prevents loops.
    if (sessionStorage.getItem("__chunk_recovered") === "1") return;

    const recover = (reason: string) => {
      console.warn("[ChunkLoadRecovery] Stale chunk detected — reloading for fresh build:", reason);
      sessionStorage.setItem("__chunk_recovered", "1");
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("_rd", String(Date.now()));
        window.location.replace(url.toString());
      } catch {
        // Fallback: plain reload if URL construction fails
        window.location.reload();
      }
    };

    // 1. Runtime JS errors — webpack throws ChunkLoadError objects
    const onError = (e: ErrorEvent) => {
      const text = `${e.message || ""} ${e.filename || ""} ${e.error?.name || ""}`;
      if (isChunkError(text)) recover(text);
    };

    // 2. Unhandled promise rejections — dynamic import() failures
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      let text: string;
      if (typeof reason === "string") {
        text = reason;
      } else if (reason && typeof reason === "object") {
        text = `${reason.message || ""} ${reason.name || ""} ${reason.stack || ""}`;
      } else {
        text = String(reason);
      }
      if (isChunkError(text)) recover(text);
    };

    // 3. Resource load failures on <script> and <link> tags.
    //    Capture phase is REQUIRED — resource errors do not bubble to
    //    window in the target/bubble phase.
    const onResourceError = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t instanceof HTMLScriptElement || t instanceof HTMLLinkElement) {
        const src = t.getAttribute("src") || t.getAttribute("href") || "";
        // Only react to Next.js static asset failures — never third-party.
        if (src.includes("/_next/static/")) {
          recover(`resource 404: ${src}`);
        }
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onResourceError, true);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onResourceError, true);
    };
  }, []);

  return null;
}
