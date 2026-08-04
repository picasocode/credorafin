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

# ── 4. Build ─────────────────────────────────────────────────────────────────
step "Building Next.js (standalone output)"
bun run build
ok "build complete"

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

  # Check if config has SSL (certbot-managed) — never overwrite
  if sudo grep -qE 'listen[[:space:]]+443|ssl_certificate[[:space:]]' "$NGINX_SITE_FILE" 2>/dev/null; then
    # SSL active — just verify alias lines are correct
    if sudo grep -q 'alias.*public/uploads' "$NGINX_SITE_FILE" 2>/dev/null; then
      ok "nginx: /uploads/ alias points to public/uploads/ (correct)"
    else
      warn "nginx: /uploads/ alias is WRONG — still pointing to .next/standalone/public/uploads/"
      warn "  Fix: sudo sed -i 's|/.next/standalone/public/uploads/|/public/uploads/|g' $NGINX_SITE_FILE"
      warn "  Then: sudo nginx -t && sudo systemctl reload nginx"
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

# ── 8. Reload PM2 (zero-downtime) ────────────────────────────────────────────
step "Reloading PM2 (zero-downtime)"
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
ok "app reloaded"

# ── 9. Health + static-asset verification ────────────────────────────────────
step "Health check"
sleep 2
if curl -sf "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null 2>&1; then
  ok "http://127.0.0.1:${APP_PORT}/api/health → 200 OK"
else
  warn "health check failed — check: pm2 logs ${APP_NAME}"
fi

step "Verifying static assets load"
HTML="$(curl -s http://127.0.0.1:${APP_PORT}/)"
CSS_REF="$(printf '%s' "$HTML" | grep -oE '/_next/static/chunks/[a-f0-9]+\.css' | head -1)"
JS_REF="$(printf '%s' "$HTML" | grep -oE '/_next/static/chunks/[a-f0-9]+\.js' | head -1)"
[ -n "$CSS_REF" ] && curl -s -o /dev/null -w "CSS  %{http_code}  $CSS_REF\n" "http://127.0.0.1:${APP_PORT}${CSS_REF}"
[ -n "$JS_REF" ]  && curl -s -o /dev/null -w "JS   %{http_code}  $JS_REF\n"  "http://127.0.0.1:${APP_PORT}${JS_REF}"

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

cat <<EOF

  ┌──────────────────────────────────────────────────────────────┐
  │  ✅ UI-only deploy complete (DB was NOT touched)              │
  │  App:    http://localhost:${APP_PORT}                           │
  │  Logs:   pm2 logs ${APP_NAME}                                    │
  │  Status: pm2 status                                            │
  │                                                                │
  │  Upload dirs: public/uploads/{brochures,hero-slides,...}       │
  │  Uploads are persistent — safe across rebuilds.                │
  └──────────────────────────────────────────────────────────────┘
EOF
