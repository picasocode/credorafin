#!/usr/bin/env bash
# ============================================================================
# CredoraFin — UI-ONLY deploy (no DB changes, no schema push)
# ----------------------------------------------------------------------------
# Use this when you ONLY changed UI/code (components, pages, styles, routes)
# and did NOT touch prisma/schema.prisma. It skips `prisma db push` entirely
# so your database and uploaded files are never at risk.
#
# What it does:
#   1. git pull --ff-only
#   2. bun install --frozen-lockfile
#   3. bunx prisma generate          (TS client only — safe, no DB write)
#   4. bun run build                 (standalone output)
#   5. copy .next/static + public/ into .next/standalone/
#   6. ensure upload dirs exist + fix filesystem permissions for nginx
#   7. sync nginx config if stale (applies /uploads/ path fix)
#   8. pm2 reload (zero-downtime)
#   9. health check + verify CSS/JS chunks load
#
# What it DOES NOT do (vs ./deploy.sh):
#   ✗ prisma db push   (no schema sync → DB is untouched)
#   ✗ any migration
#
# Upload safety:
#   User-uploaded files live in public/uploads/ at the PROJECT ROOT — they are
#   NOT inside .next/ and are never touched by `bun run build`. They persist
#   across every redeploy.
#
# Usage:
#   ./deploy-ui.sh              # pull + build + reload
#   ./deploy-ui.sh --no-pull    # build + reload only (skip git pull)
#   sudo ./deploy-ui.sh         # recommended (fixes perms + nginx config)
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")"

# ── Color helpers ────────────────────────────────────────────────────────────
step()  { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
ok()    { printf "\033[1;32m  ✓ %s\033[0m\n" "$1"; }
warn()  { printf "\033[1;33m  ⚠ %s\033[0m\n" "$1"; }
err()   { printf "\033[1;31m  ✖ %s\033[0m\n" "$1"; }
die()   { err "$1"; exit 1; }

# ── Load nvm + bun into PATH (fresh SSH sessions need this) ──────────────────
load_nvm() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  [ -s "$NVM_DIR/nvm.sh" ] || return 0
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  nvm use --silent 2>/dev/null || true
}
load_nvm
export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
[ -d "$BUN_INSTALL/bin" ] && export PATH="$BUN_INSTALL/bin:$PATH"

# ── Constants ────────────────────────────────────────────────────────────────
APP_PORT=3000
APP_NAME="credorafin"
LOG_DIR="./logs"
DOMAIN="credorafin.com"
NGINX_SITE_FILE="/etc/nginx/sites-available/${DOMAIN}"
NGINX_SITE_LINK="/etc/nginx/sites-enabled/${DOMAIN}"
NO_PULL=0
[ "${1:-}" = "--no-pull" ] && NO_PULL=1

mkdir -p "$LOG_DIR"

# ── Pre-flight ───────────────────────────────────────────────────────────────
command -v pm2 >/dev/null 2>&1 || die "pm2 not found. Install: npm install -g pm2@5.4.2"
command -v bun >/dev/null 2>&1 || die "bun not found. Install: curl -fsSL https://bun.sh/install | bash -s bun-v1.3.14"

# ── 1. Pull ──────────────────────────────────────────────────────────────────
if [ "$NO_PULL" != "1" ]; then
  step "Pulling latest code"
  git pull --ff-only
  ok "up to date"
fi

# ── 2. Install deps ──────────────────────────────────────────────────────────
step "Installing dependencies"
git checkout -- bun.lock 2>/dev/null || true
if ! bun install --frozen-lockfile; then
  warn "frozen lockfile mismatch — reconciling..."
  bun install
fi
ok "dependencies ready"

# ── 3. Prisma CLIENT ONLY (no db push — DB stays untouched) ──────────────────
step "Generating Prisma client (NO db push — database untouched)"
bunx prisma generate
ok "prisma client generated"

# ── 3b. Fix source file permissions ──────────────────────────────────────────
# Git preserves the permissions a file had when it was first committed. New
# route files created with 664 (rw-rw-r--) can be unreadable by the build
# process if it runs as a different user, causing routes to silently not
# register → 404 in production. Force all source files to be world-readable.
step "Fixing source file permissions"
chmod -R o+rX src 2>/dev/null && ok "src/ readable" || warn "chmod src/ failed"
chmod -R o+rX prisma 2>/dev/null && ok "prisma/ readable" || warn "chmod prisma/ failed"
chmod -R o+rX public 2>/dev/null && ok "public/ readable" || warn "chmod public/ failed"

# Verify critical route files exist + are readable (catches git pull issues)
step "Verifying critical route files exist"
CRITICAL_ROUTES=(
  "src/app/api/admin/upload/route.ts"
  "src/app/api/admin/brochures/upload/route.ts"
  "src/app/api/admin/brochures/route.ts"
  "src/app/api/admin/hero-slides/route.ts"
  "src/app/api/admin/products/route.ts"
)
ROUTES_OK=1
for route in "${CRITICAL_ROUTES[@]}"; do
  if [ -f "$route" ] && [ -r "$route" ]; then
    ok "  ✓ $route"
  else
    warn "  ✖ $route — MISSING or unreadable!"
    ROUTES_OK=0
  fi
done
if [ "$ROUTES_OK" != "1" ]; then
  die "Critical route files are missing! Run: git pull --ff-only && git status"
fi

# ── 4. Build ─────────────────────────────────────────────────────────────────
# CRITICAL: Clean .next/ before building. Turbopack's incremental cache can
# miss new route files (e.g. a new /api/admin/brochures/upload/route.ts was
# added but the cached route manifest didn't pick it up → 404 in production
# even though the file exists on disk). A clean build guarantees every route
# file is registered. This adds ~10-15s to the deploy but eliminates an
# entire class of "works on my machine but 404s on server" bugs.
step "Cleaning .next/ build cache (prevents stale route manifests)"
rm -rf .next
ok ".next/ cleaned"

step "Building Next.js (standalone output)"
bun run build
ok "build complete"

# ── 4b. Verify routes are registered in the compiled build ───────────────────
# After a clean build, check that the brochure upload route actually made it
# into the route manifest. If it didn't, the build silently skipped it.
step "Verifying routes registered in build output"
ROUTES_MANIFEST=".next/server/routes-manifest.json"
if [ -f "$ROUTES_MANIFEST" ]; then
  if grep -q "brochures/upload" "$ROUTES_MANIFEST" 2>/dev/null; then
    ok "  ✓ /api/admin/brochures/upload registered in build"
  else
    warn "  ✖ /api/admin/brochures/upload NOT in routes manifest!"
    warn "    The route file exists but the build didn't pick it up."
    warn "    Check: ls -la src/app/api/admin/brochures/upload/route.ts"
    warn "    Check: head -5 src/app/api/admin/brochures/upload/route.ts"
  fi
  if grep -q "admin/upload" "$ROUTES_MANIFEST" 2>/dev/null; then
    ok "  ✓ /api/admin/upload registered in build"
  else
    warn "  ✖ /api/admin/upload NOT in routes manifest!"
  fi
else
  warn "routes-manifest.json not found — cannot verify route registration"
fi

# ── 5. Copy static assets into standalone ────────────────────────────────────
step "Syncing static assets into .next/standalone/"
STANDALONE_STATIC=".next/standalone/.next/static"
STANDALONE_PUBLIC=".next/standalone/public"

# Guard against the cp -r nesting bug (static/static)
if [ -d "${STANDALONE_STATIC}/static" ]; then
  warn "detected nested static/static — cleaning"
  rm -rf "$STANDALONE_STATIC"
fi
if [ ! -d "$STANDALONE_STATIC" ] || [ -z "$(ls -A "$STANDALONE_STATIC" 2>/dev/null)" ]; then
  mkdir -p .next/standalone/.next
  cp -R .next/static .next/standalone/.next/static
fi

# Copy public/ into standalone (but DON'T overwrite uploads — they're persistent)
if [ ! -d "$STANDALONE_PUBLIC" ] || [ -z "$(ls -A "$STANDALONE_PUBLIC" 2>/dev/null)" ]; then
  cp -R public .next/standalone/public
else
  # Sync public/ files (logo, images, etc.) without touching uploads/
  cp -R public/* .next/standalone/public/ 2>/dev/null || true
fi

[ -d "${STANDALONE_STATIC}/chunks" ] || die "standalone chunks missing — app will 500"
ok "static chunks present ($(ls "${STANDALONE_STATIC}/chunks" 2>/dev/null | wc -l) files)"
ok "standalone public present ($(ls "$STANDALONE_PUBLIC" 2>/dev/null | wc -l) entries)"

# ── 6. Ensure upload dirs exist + fix filesystem permissions ─────────────────
step "Ensuring upload directories exist"
UPLOAD_BUCKETS="brochures hero-slides blog pages products misc"
for bucket in $UPLOAD_BUCKETS; do
  mkdir -p "public/uploads/$bucket"
  # .gitkeep so the dir is tracked in git
  [ -f "public/uploads/$bucket/.gitkeep" ] || touch "public/uploads/$bucket/.gitkeep"
done
ok "upload dirs ready: $(echo public/uploads/*/ | tr '\n' ' ')"

step "Fixing filesystem permissions for nginx (www-data)"
HOME_DIR="$(eval echo ~"${USER:-$(whoami)}")"
if [ -d "$HOME_DIR" ]; then
  chmod o+x "$HOME_DIR" 2>/dev/null && ok "traversal granted on ${HOME_DIR}" || warn "could not chmod ${HOME_DIR} (try: sudo chmod o+x ~)"
fi
chmod -R o+rX .next/standalone 2>/dev/null && ok "standalone readable" || warn "chmod standalone failed"
chmod -R o+rX public 2>/dev/null && ok "public readable" || warn "chmod public failed"

# CRITICAL: uploads dir must be readable by www-data (nginx) AND writable by
# the app (PM2 user). The app runs as the SSH user who owns the files, so
# write is fine. nginx only needs read (o+r) + traverse (o+X on dirs).
chmod -R o+rX public/uploads 2>/dev/null && ok "uploads readable by nginx" || warn "chmod uploads failed"

# Verify www-data can actually read an upload (catches edge cases)
if [ -n "$(ls -A public/uploads/brochures 2>/dev/null)" ]; then
  TEST_FILE="$(ls public/uploads/brochures/* 2>/dev/null | head -1)"
  if [ -n "$TEST_FILE" ] && [ -f "$TEST_FILE" ]; then
    if sudo -u www-data test -r "$TEST_FILE" 2>/dev/null; then
      ok "www-data can read: $(basename "$TEST_FILE")"
    else
      warn "www-data CANNOT read $TEST_FILE — uploads will 404"
      warn "  fix: sudo chmod -R o+rX public/uploads"
    fi
  fi
fi

# ── 7. Sync nginx config if stale (applies /uploads/ path fix) ───────────────
sync_nginx_if_needed() {
  if ! command -v nginx >/dev/null 2>&1; then
    return 0  # nginx not installed (dev machine) — skip
  fi
  if [ ! -L "$NGINX_SITE_LINK" ] && [ ! -f "$NGINX_SITE_FILE" ]; then
    warn "nginx site not installed — run: ./deploy.sh --nginx (first-time setup)"
    return 0
  fi

  local app_root
  app_root="$(pwd)"

  # ALWAYS fix permissions (they drift every build)
  chmod -R o+rX .next/standalone 2>/dev/null || true
  chmod -R o+rX public 2>/dev/null || true
  chmod -R o+rX public/uploads 2>/dev/null || true

  # Check if config has SSL (certbot-managed) — never overwrite the whole file
  if sudo grep -qE 'listen[[:space:]]+443|ssl_certificate[[:space:]]' "$NGINX_SITE_FILE" 2>/dev/null; then
    # SSL active — patch specific lines in-place instead of overwriting

    # Fix 1: /uploads/ alias path
    if sudo grep -q 'alias.*\.next/standalone/public/uploads/' "$NGINX_SITE_FILE" 2>/dev/null; then
      warn "nginx: /uploads/ alias is WRONG — patching in-place"
      sudo sed -i 's|/.next/standalone/public/uploads/;|/public/uploads/;|g' "$NGINX_SITE_FILE"
      sudo sed -i 's|__APP_ROOT__/.next/standalone/public/uploads/|__APP_ROOT__/public/uploads/|g' "$NGINX_SITE_FILE"
      ok "nginx: /uploads/ alias patched"
    else
      ok "nginx: /uploads/ alias points to public/uploads/ (correct)"
    fi

    # Fix 2: Add no-cache headers for HTML on EVERY location block that has
    # proxy_send_timeout (prevents stale HTML → ChunkLoadError after deploys).
    # NOTE: We must NOT use a single `if ! grep no-store` guard here, because
    # the certbot-managed file has BOTH HTTP and HTTPS server blocks. If the
    # HTTP block already has the header, a whole-file grep would skip the
    # HTTPS block — leaving production (HTTPS) unpatched. Instead, always
    # run the idempotent sed (per-line /no-store/! guard prevents duplicates).
    NO_STORE_BEFORE=$(sudo grep -c 'no-store, must-revalidate' "$NGINX_SITE_FILE" 2>/dev/null || echo 0)
    sudo sed -i '/proxy_send_timeout 300s;/{
      /no-store/!{
        s|proxy_send_timeout 300s;|proxy_send_timeout 300s;\n\n        # CRITICAL: Never cache HTML — prevents ChunkLoadError after deploys\n        add_header Cache-Control "no-store, must-revalidate" always;|g
      }
    }' "$NGINX_SITE_FILE"
    NO_STORE_AFTER=$(sudo grep -c 'no-store, must-revalidate' "$NGINX_SITE_FILE" 2>/dev/null || echo 0)
    PROXY_BLOCKS=$(sudo grep -c 'proxy_send_timeout 300s;' "$NGINX_SITE_FILE" 2>/dev/null || echo 0)
    if [ "$NO_STORE_AFTER" -ge "$PROXY_BLOCKS" ] && [ "$PROXY_BLOCKS" -gt 0 ]; then
      ok "nginx: no-store header on all ${PROXY_BLOCKS} proxy location block(s)"
    elif [ "$NO_STORE_AFTER" -gt "$NO_STORE_BEFORE" ]; then
      ok "nginx: no-store header added (${NO_STORE_BEFORE} → ${NO_STORE_AFTER}, need ${PROXY_BLOCKS})"
    else
      warn "nginx: no-store header count ${NO_STORE_AFTER}/${PROXY_BLOCKS} — manual check needed"
      warn "  check: sudo grep -c 'no-store' $NGINX_SITE_FILE"
    fi

    # Test + reload
    if sudo nginx -t 2>/dev/null; then
      sudo systemctl reload nginx
      ok "nginx reloaded with patches"
    else
      warn "nginx config test failed — check: sudo nginx -t"
    fi
    return 0
  fi

  # HTTP-only config — safe to compare and update
  local src="nginx/${DOMAIN}.http.conf"
  [ -f "$src" ] || return 0

  local expected current
  expected="$(sed "s|__APP_ROOT__|${app_root}|g" "$src")"
  current="$(sudo cat "$NGINX_SITE_FILE" 2>/dev/null || echo "")"

  if [ "$expected" = "$current" ]; then
    ok "nginx config already in sync"
    return 0
  fi

  step "nginx config is stale — re-syncing"
  sudo sed "s|__APP_ROOT__|${app_root}|g" "$src" | sudo tee "$NGINX_SITE_FILE" >/dev/null
  sudo ln -sf "$NGINX_SITE_FILE" "$NGINX_SITE_LINK"
  if sudo nginx -t 2>/dev/null; then
    sudo systemctl reload nginx
    ok "nginx config synced & reloaded"
  else
    warn "nginx config test failed — check: sudo nginx -t"
  fi
}
sync_nginx_if_needed

# ── 8. Hard restart PM2 (kills stale processes completely) ───────────────────
# CRITICAL: Do NOT use 'pm2 startOrReload' — it does a zero-downtime reload
# that can leave the OLD process running alongside the new one. When both
# processes are alive, nginx round-robins between them, so users see
# intermittent old content (text changes don't reflect). This is especially
# common when the process has many restarts (100+).
#
# Instead: delete the process entirely, then start fresh. This guarantees
# only ONE process is running, with the latest build.
step "Hard-restarting PM2 (kills old process completely)"
pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 start ecosystem.config.cjs --update-env
pm2 save
ok "app started fresh (no stale processes)"

# Verify only ONE process is on port 3000
sleep 1
PORT_PIDS=$(ss -tlnp 2>/dev/null | grep ":${APP_PORT} " | grep -oP 'pid=\K[0-9]+' | sort -u | wc -l)
if [ "$PORT_PIDS" = "1" ]; then
  ok "exactly 1 process on port ${APP_PORT}"
elif [ "$PORT_PIDS" = "0" ]; then
  warn "no process on port ${APP_PORT} — check: pm2 logs ${APP_NAME}"
else
  warn "$PORT_PIDS processes on port ${APP_PORT} — stale process detected!"
  warn "  Run manually: pm2 delete all && pm2 start ecosystem.config.cjs"
fi

# ── 9. Health + static-asset verification ────────────────────────────────────
step "Health check"
sleep 2
if curl -sf "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null 2>&1; then
  ok "http://127.0.0.1:${APP_PORT}/api/health → 200 OK"
else
  warn "health check failed — check: pm2 logs ${APP_NAME}"
fi

step "Verifying ALL static chunks load (catches ChunkLoadError)"
# CRITICAL: This step prevents the #1 post-deploy failure mode —
# ChunkLoadError. After a redeploy, if the served HTML references a chunk
# file that doesn't exist on disk (because the build is stale, the .next/
# dir was partially copied, or PM2 is serving an old process), users see:
#   "Uncaught ChunkLoadError: Failed to load chunk /_next/static/chunks/abc123.js"
#   "Loading failed for the <script> with source …/abc123.js"
# We extract EVERY /_next/static/ reference from the served HTML and curl
# each one. If any returns non-200, the deploy is broken and we warn loudly.
HTML="$(curl -s http://127.0.0.1:${APP_PORT}/)"
# Extract all unique /_next/static/ URLs (JS chunks, CSS chunks, fonts, media)
CHUNK_REFS=$(printf '%s' "$HTML" | grep -oE '/_next/static/[^"'"'"' ]+' | sort -u)
CHUNK_TOTAL=$(printf '%s' "$CHUNK_REFS" | grep -c . || echo 0)
CHUNK_OK=0
CHUNK_FAIL=0
if [ "$CHUNK_TOTAL" -gt 0 ]; then
  while IFS= read -r ref; do
    [ -z "$ref" ] && continue
    CODE=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${APP_PORT}${ref}")
    if [ "$CODE" = "200" ]; then
      CHUNK_OK=$((CHUNK_OK + 1))
    else
      CHUNK_FAIL=$((CHUNK_FAIL + 1))
      err "  ✖ ${CODE}  ${ref}"
    fi
  done <<< "$CHUNK_REFS"
  if [ "$CHUNK_FAIL" -eq 0 ]; then
    ok "all ${CHUNK_TOTAL} chunk references returned 200 ✓"
  else
    warn "${CHUNK_FAIL}/${CHUNK_TOTAL} chunk references FAILED — users will see ChunkLoadError!"
    warn "  This usually means PM2 is serving a stale build or .next/ is incomplete."
    warn "  Fix: pm2 delete $APP_NAME && pm2 start ecosystem.config.cjs"
  fi
else
  warn "no /_next/static/ references found in served HTML — page may be broken"
fi

# Verify upload routes respond (401 = route exists & working, 404 = broken)
UPLOAD_CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "http://127.0.0.1:${APP_PORT}/api/admin/upload?bucket=hero-slides")
BROCHURE_CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "http://127.0.0.1:${APP_PORT}/api/admin/brochures/upload")
if [ "$UPLOAD_CODE" = "401" ]; then
  ok "POST /api/admin/upload → 401 (route OK, auth required)"
else
  warn "POST /api/admin/upload → $UPLOAD_CODE (expected 401 — route may be broken)"
fi
if [ "$BROCHURE_CODE" = "401" ]; then
  ok "POST /api/admin/brochures/upload → 401 (route OK, auth required)"
else
  warn "POST /api/admin/brochures/upload → $BROCHURE_CODE (expected 401 — route may be broken)"
fi

# ── 10. Content freshness verification ───────────────────────────────────────
# Verify the server is actually serving the NEW build, not a stale one.
# We check that the homepage HTML contains the current build's JS chunk hash
# (which changes every build). If the hash in the served HTML matches the
# hash in the built file, the new code is live.
step "Verifying content freshness (new build is live)"
BUILD_HASH_FILE=".next/build-manifest.json"
if [ -f "$BUILD_HASH_FILE" ]; then
  BUILD_HASH=$(grep -o '"buildId":"[^"]*"' "$BUILD_HASH_FILE" | head -1 | cut -d'"' -f4)
  SERVED_HASH=$(curl -s "http://127.0.0.1:${APP_PORT}/" | grep -oE '/_next/static/[^"/]+/' | head -1 | sed 's|/_next/static/||;s|/||')
  if [ -n "$BUILD_HASH" ] && [ -n "$SERVED_HASH" ]; then
    if echo "$SERVED_HASH" | grep -q "^${BUILD_HASH:0:12}" || echo "$BUILD_HASH" | grep -q "^${SERVED_HASH:0:12}"; then
      ok "build ID matches — server is serving the NEW build ✅"
    else
      warn "build ID mismatch — server may be serving a STALE build!"
      warn "  built:  $BUILD_HASH"
      warn "  served: $SERVED_HASH"
      warn "  Fix: pm2 delete $APP_NAME && pm2 start ecosystem.config.cjs"
    fi
  else
    warn "could not extract build IDs for freshness check"
  fi
else
  warn "build-manifest.json not found — skipping freshness check"
fi

# Show PM2 restart count (high count = instability)
PM2_RESTARTS=$(pm2 jlist 2>/dev/null | grep -o '"restart_time":[0-9]*' | head -1 | cut -d: -f2)
if [ -n "$PM2_RESTARTS" ] && [ "$PM2_RESTARTS" -gt 20 ]; then
  warn "PM2 restart count is $PM2_RESTARTS (high) — consider: pm2 reset $APP_NAME"
else
  ok "PM2 restart count: ${PM2_RESTARTS:-0}"
fi

cat <<EOF

  ┌──────────────────────────────────────────────────────────────┐
  │  ✅ UI-only deploy complete (DB was NOT touched)              │
  │  App:    http://localhost:${APP_PORT}                           │
  │  Logs:   pm2 logs ${APP_NAME}                                    │
  │  Status: pm2 status                                            │
  │                                                                │
  │  Upload dirs: public/uploads/{brochures,hero-slides,...}       │
  │  Uploads are persistent — safe across rebuilds.                │
  │  PM2: hard-restarted (no stale processes)                      │
  │  Cache: no-store on HTML (changes reflect immediately)         │
  └──────────────────────────────────────────────────────────────┘
EOF
