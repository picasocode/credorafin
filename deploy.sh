#!/usr/bin/env bash
# ============================================================================
# CredoraFin — all-in-one deploy script (PM2 + Bun + Nginx + Certbot)
# ----------------------------------------------------------------------------
# Subcommands:
#   ./deploy.sh              # default: full update — pull → install → build →
#                            #   fix permissions → sync nginx config (if stale) →
#                            #   reload PM2 → verify CSS/JS/fonts load → 200 check
#   ./deploy.sh --no-pull    # skip git pull (build + reload only)
#   ./deploy.sh --setup      # first-time server bootstrap:
#                            #   • installs nginx + certbot
#                            #   • syncs nginx site config (with __APP_ROOT__ substitution)
#                            #   • creates /var/www/html for ACME challenges
#                            #   • enables site, disables default, reloads nginx
#                            #   • fixes filesystem permissions (chmod o+x ~, o+rX standalone/public)
#   ./deploy.sh --nginx      # just re-sync nginx config + fix permissions + reload
#   ./deploy.sh --ssl        # run certbot to issue/renew HTTPS cert (+ DNS check)
#   ./deploy.sh --health     # just run health check against local app
#   ./deploy.sh --logs       # tail PM2 logs (Ctrl-C to exit)
#   ./deploy.sh --help       # show this help
#
# Idempotent: ./deploy.sh only reloads nginx if the config actually changed.
# Safe on dev machines: if nginx isn't installed, the nginx steps are skipped.
#
# Pinned versions (see .nvmrc, .bun-version, DEPLOY.md):
#   Node 22.11.0 LTS · Bun 1.3.14 · PM2 5.4.2
# ============================================================================
set -euo pipefail

cd "$(dirname "$0")"

# ── Color helpers ────────────────────────────────────────────────────────────
step()  { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
ok()    { printf "\033[1;32m  ✓ %s\033[0m\n" "$1"; }
warn()  { printf "\033[1;33m  ⚠ %s\033[0m\n" "$1"; }
err()   { printf "\033[1;31m  ✖ %s\033[0m\n" "$1"; }
die()   { err "$1"; exit 1; }

# ── Load nvm so `node`, `bun`, `pm2` are on PATH on fresh SSH sessions ───────
load_nvm() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  [ -s "$NVM_DIR/nvm.sh" ] || return 0
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  nvm use --silent 2>/dev/null || true
}
load_nvm

# ── Load bun into PATH (bun installer adds ~/.bun/bin) ───────────────────────
export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
[ -d "$BUN_INSTALL/bin" ] && export PATH="$BUN_INSTALL/bin:$PATH"

# ── Constants ────────────────────────────────────────────────────────────────
DOMAIN="credorafin.com"
APP_PORT=3000
APP_NAME="credorafin"
NGINX_SITE_FILE="/etc/nginx/sites-available/${DOMAIN}"
NGINX_SITE_LINK="/etc/nginx/sites-enabled/${DOMAIN}"
ACME_ROOT="/var/www/html"
LOG_DIR="./logs"

# ── Parse subcommand ─────────────────────────────────────────────────────────
SUBCMD="${1:-deploy}"
case "$SUBCMD" in
  --help|-h) SUBCMD="help" ;;
  --no-pull) SUBCMD="deploy" ; NO_PULL=1 ;;
  --setup)   SUBCMD="setup" ;;
  --nginx)   SUBCMD="nginx" ;;
  --ssl)     SUBCMD="ssl" ;;
  --health)  SUBCMD="health" ;;
  --logs)    SUBCMD="logs" ;;
  *)         SUBCMD="deploy" ;;
esac

show_help() {
  sed -n '2,28p' "$0"
  exit 0
}

# ── Shared helper: ensure apt package installed ──────────────────────────────
ensure_apt() {
  local pkg="$1"
  if dpkg -s "$pkg" >/dev/null 2>&1; then
    ok "$pkg already installed"
  else
    step "Installing $pkg via apt"
    sudo DEBIAN_FRONTEND=noninteractive apt-get update -qq
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq "$pkg"
    ok "$pkg installed"
  fi
}

# ── Shared helper: fix filesystem permissions so nginx (www-data) can serve ─
# nginx runs as www-data and serves /_next/static/ + /public/ directly from
# disk via `alias`. On Ubuntu, /home/<user>/ is mode 750 by default, so
# www-data gets permission denied (403/404) trying to traverse into it.
# Fix: grant traversal (o+x) on the home dir + read on standalone/public.
# o+x = traverse only, NOT list — safe, standard for web serving from $HOME.
fix_permissions_for_nginx() {
  local app_root="$1"
  step "Fixing filesystem permissions for nginx (www-data)"

  local home_dir
  home_dir="$(eval echo ~"${USER:-$(whoami)}")"
  if [ -d "$home_dir" ]; then
    sudo chmod o+x "$home_dir" 2>/dev/null && ok "traversal granted on ${home_dir}" || warn "could not chmod ${home_dir}"
  fi
  chmod -R o+rX .next/standalone 2>/dev/null && ok "standalone readable by all" || warn "chmod standalone failed"
  chmod -R o+rX public 2>/dev/null && ok "public readable by all" || warn "chmod public failed"

  # Verify www-data can actually read a chunk (catches edge cases)
  local test_chunk
  test_chunk="${app_root}/.next/standalone/.next/static/chunks/$(ls "${app_root}/.next/standalone/.next/static/chunks" 2>/dev/null | head -1)"
  if [ -n "$test_chunk" ] && [ -f "$test_chunk" ]; then
    if sudo -u www-data test -r "$test_chunk" 2>/dev/null; then
      ok "www-data can read: $(basename "$test_chunk")"
    else
      warn "www-data CANNOT read ${test_chunk} — nginx will return 403/404"
      warn "  fix manually: sudo chmod o+x ~ && chmod -R o+rX .next/standalone public"
    fi
  fi
}

# ── Shared helper: install nginx site config (HTTP-only, certbot upgrades it) ─
# Substitutes __APP_ROOT__ with the absolute project path so the
# /_next/static/ and /fonts/ location blocks point to the right place.
# Also fixes filesystem permissions (calls fix_permissions_for_nginx).
install_nginx_site() {
  step "Syncing nginx site config for ${DOMAIN}"

  # Use the HTTP-only config as the base. certbot --nginx will rewrite it
  # to add the 443 block + 80→443 redirect when --ssl runs.
  local src="nginx/${DOMAIN}.http.conf"
  [ -f "$src" ] || die "nginx config not found: $src"

  # Absolute project path — nginx `alias` directives need absolute paths.
  local app_root
  app_root="$(pwd)"
  ok "app root: ${app_root}"

  # Ensure sites-{available,enabled} dirs exist (older nginx may lack them)
  sudo mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

  # Substitute __APP_ROOT__ → absolute path, install to sites-available
  sed "s|__APP_ROOT__|${app_root}|g" "$src" | sudo tee "$NGINX_SITE_FILE" >/dev/null
  sudo ln -sf "$NGINX_SITE_FILE" "$NGINX_SITE_LINK"

  # Disable the default site if present (avoids stealing port 80)
  if [ -L /etc/nginx/sites-enabled/default ]; then
    sudo rm -f /etc/nginx/sites-enabled/default
    ok "removed default site symlink"
  fi

  # ACME challenge webroot
  sudo mkdir -p "$ACME_ROOT"
  sudo chown -R www-data:www-data "$ACME_ROOT" 2>/dev/null || true

  # Test config
  if ! sudo nginx -t; then
    die "nginx config test failed — fix errors above before continuing"
  fi
  ok "nginx config valid"

  sudo systemctl reload nginx
  ok "nginx reloaded"

  # Verify the static dir nginx will serve from actually exists
  local static_dir="${app_root}/.next/standalone/.next/static"
  if [ -d "$static_dir" ]; then
    ok "static dir exists: ${static_dir} ($(ls "$static_dir"/chunks 2>/dev/null | wc -l) chunks)"
  else
    warn "static dir NOT found: ${static_dir}"
    warn "run ./deploy.sh first to build, then ./deploy.sh --nginx to re-sync config"
  fi

  # Fix filesystem permissions so nginx can actually read the files
  fix_permissions_for_nginx "$app_root"
}

# ── Shared helper: sync nginx config ONLY if nginx is installed and config is stale ─
# Called by do_deploy() — idempotent: if nginx isn't installed (dev machine)
# or the config is already correct, this is a no-op. Avoids unnecessary
# nginx reloads on every deploy.
sync_nginx_if_needed() {
  # Skip entirely if nginx isn't installed (e.g. local dev, CI)
  if ! command -v nginx >/dev/null 2>&1; then
    return 0
  fi
  # Skip if the site config isn't installed yet (first deploy — user should run --setup first)
  if [ ! -L "$NGINX_SITE_LINK" ]; then
    warn "nginx site not installed yet — run: ./deploy.sh --setup"
    return 0
  fi

  local app_root
  app_root="$(pwd)"
  local src="nginx/${DOMAIN}.http.conf"
  [ -f "$src" ] || return 0

  # Build what the config SHOULD look like (with __APP_ROOT__ substituted)
  local expected
  expected="$(sed "s|__APP_ROOT__|${app_root}|g" "$src")"

  # Compare against what's currently installed
  local current
  current="$(sudo cat "$NGINX_SITE_FILE" 2>/dev/null || echo "")"

  if [ "$expected" = "$current" ]; then
    ok "nginx config already in sync (path: ${app_root})"
    # Still fix permissions — they can drift if build recreated .next/standalone
    fix_permissions_for_nginx "$app_root"
    return 0
  fi

  # Config is stale (path changed, or source config was updated) — re-sync
  step "nginx config is stale — re-syncing"
  install_nginx_site
}

# ============================================================================
# SUBCOMMAND: setup — first-time server bootstrap
# ============================================================================
do_setup() {
  step "Server bootstrap: nginx + certbot + acme webroot"

  # nginx
  ensure_apt nginx
  # certbot + the nginx plugin (so `certbot --nginx` can auto-edit configs)
  ensure_apt certbot
  ensure_apt python3-certbot-nginx

  install_nginx_site

  cat <<EOF

  ┌──────────────────────────────────────────────────────────────┐
  │  ✅ Nginx + Certbot installed & site is live on HTTP          │
  │                                                               │
  │  Next steps:                                                  │
  │   1. Point DNS A record for ${DOMAIN} → this server's public IP  │
  │   2. Wait for DNS to propagate (dig +short ${DOMAIN})           │
  │   3. Run:  ./deploy.sh --ssl                                  │
  │      ↑ issues Let's Encrypt cert + enables HTTPS + redirect    │
  │   4. Run:  ./deploy.sh          ← deploy the app                │
  └──────────────────────────────────────────────────────────────┘
EOF
}

# ============================================================================
# SUBCOMMAND: nginx — re-sync nginx config + reload (no app build)
# ============================================================================
do_nginx() {
  ensure_apt nginx
  install_nginx_site
  ok "nginx config synced & reloaded"
}

# ============================================================================
# SUBCOMMAND: ssl — run certbot to issue/renew HTTPS cert
# ============================================================================
do_ssl() {
  step "Issuing/renewing Let's Encrypt cert for ${DOMAIN}"

  command -v certbot >/dev/null 2>&1 || ensure_apt certbot
  command -v certbot >/dev/null 2>&1 || die "certbot still not installed"
  dpkg -s python3-certbot-nginx >/dev/null 2>&1 || ensure_apt python3-certbot-nginx

  # The site config must already be live on port 80 for the HTTP-01 challenge
  [ -L "$NGINX_SITE_LINK" ] || install_nginx_site

  # DNS check — fail fast with a helpful message if DNS isn't pointed here
  step "Verifying DNS for ${DOMAIN}"
  LOCAL_IP="$(curl -s4 ifconfig.me 2>/dev/null || curl -s4 icanhazip.com 2>/dev/null || echo "")"
  DNS_IP="$(dig +short "$DOMAIN" A 2>/dev/null | head -1 || echo "")"
  if [ -n "$LOCAL_IP" ] && [ -n "$DNS_IP" ]; then
    if [ "$LOCAL_IP" = "$DNS_IP" ]; then
      ok "DNS OK: ${DOMAIN} → ${DNS_IP} (matches this server)"
    else
      warn "DNS mismatch: ${DOMAIN} → ${DNS_IP}, this server → ${LOCAL_IP}"
      warn "certbot will likely fail. Fix DNS first."
    fi
  else
    warn "could not verify DNS automatically — continuing anyway"
  fi

  # Get the email from .env if present, else prompt
  CERT_EMAIL="${CERTBOT_EMAIL:-}"
  if [ -z "$CERT_EMAIL" ] && [ -f .env ]; then
    CERT_EMAIL="$(grep -E '^SMTP_USER=' .env 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"' || true)"
  fi

  step "Running certbot"
  if [ -n "$CERT_EMAIL" ]; then
    sudo certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" \
      --agree-tos --no-eff-email -m "$CERT_EMAIL" --redirect --non-interactive
  else
    sudo certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" \
      --agree-tos --no-eff-email --redirect
  fi

  ok "certbot finished"

  # Set up auto-renewal timer (certbot installs this, but make sure)
  sudo systemctl enable --now certbot.timer 2>/dev/null || true

  # Final reload
  sudo nginx -t && sudo systemctl reload nginx
  ok "nginx reloaded with TLS"

  cat <<EOF

  ┌──────────────────────────────────────────────────────────────┐
  │  ✅ HTTPS is live for ${DOMAIN}                                 │
  │  Auto-renewal: certbot.timer (checked twice daily)            │
  │  Test renewal:  sudo certbot renew --dry-run                  │
  └──────────────────────────────────────────────────────────────┘
EOF
}

# ============================================================================
# SUBCOMMAND: health — curl local app health endpoint
# ============================================================================
do_health() {
  step "Health check (local app on :${APP_PORT})"
  sleep 2
  if curl -sf "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null 2>&1; then
    ok "http://127.0.0.1:${APP_PORT}/api/health → 200 OK"
    return 0
  else
    warn "health check did not return 200 — check: pm2 logs ${APP_NAME}"
    return 1
  fi
}

# ============================================================================
# SUBCOMMAND: logs — tail PM2 logs
# ============================================================================
do_logs() {
  command -v pm2 >/dev/null 2>&1 || die "pm2 not installed"
  exec pm2 logs "$APP_NAME"
}

# ============================================================================
# SUBCOMMAND: deploy — full update (pull → install → build → reload)
# ============================================================================
do_deploy() {
  mkdir -p "$LOG_DIR"

  # Pre-flight: PM2 must be installed
  if ! command -v pm2 >/dev/null 2>&1; then
    die "pm2 not found. Install once with: npm install -g pm2@5.4.2"
  fi
  # Pre-flight: bun must be installed
  if ! command -v bun >/dev/null 2>&1; then
    die "bun not found. Install once with: curl -fsSL https://bun.sh/install | bash -s bun-v1.3.14"
  fi

  # ── 1. Pull ───────────────────────────────────────────────────────────────
  if [ "${NO_PULL:-0}" != "1" ]; then
    step "Pulling latest code"
    git pull --ff-only
    ok "up to date"
  fi

  # ── 2. Install deps (deterministic) ───────────────────────────────────────
  step "Installing dependencies"
  # Reset any local lockfile drift so we install exactly what's committed.
  # A prior non-frozen `bun install` on the server can leave bun.lock modified
  # in the working tree, which `git pull --ff-only` preserves — causing
  # `--frozen-lockfile` to fail. `git checkout -- bun.lock` restores the
  # committed version so the frozen check passes deterministically.
  git checkout -- bun.lock 2>/dev/null || true
  if ! bun install --frozen-lockfile; then
    warn "frozen lockfile mismatch — reconciling with regular install..."
    bun install
  fi
  ok "dependencies ready"

  # ── 3. Prisma ─────────────────────────────────────────────────────────────
  step "Generating Prisma client"
  bunx prisma generate
  ok "prisma client generated"

  step "Syncing database schema (db push)"
  bunx prisma db push --skip-generate
  ok "schema in sync"

  # ── 4. Build (standalone output) ──────────────────────────────────────────
  step "Building Next.js (standalone output)"
  bun run build
  ok "build complete"

  # ── 5. CRITICAL — verify static assets landed in standalone dir ───────────
  # This is the #1 cause of 500s on /_next/static/chunks/*.js and *.css.
  # Next.js standalone produces .next/standalone/server.js but does NOT copy
  # .next/static or public/ into it. The build script (package.json "build")
  # copies them, but `cp -r` into an existing target dir can nest incorrectly
  # (static/static). We verify here and fix if needed.
  step "Verifying standalone static assets"
  local standalone_static=".next/standalone/.next/static"
  local standalone_public=".next/standalone/public"

  # Detect the nesting bug: if .next/standalone/.next/static/static exists,
  # the previous cp -r nested. Wipe and re-copy cleanly.
  if [ -d "${standalone_static}/static" ]; then
    warn "detected nested static/static (cp -r nesting bug) — fixing"
    rm -rf "$standalone_static"
  fi
  if [ ! -d "$standalone_static" ] || [ -z "$(ls -A "$standalone_static" 2>/dev/null)" ]; then
    warn "standalone static missing — copying fresh"
    mkdir -p .next/standalone/.next
    cp -R .next/static .next/standalone/.next/static
  fi
  if [ ! -d "$standalone_public" ] || [ -z "$(ls -A "$standalone_public" 2>/dev/null)" ]; then
    warn "standalone public missing — copying fresh"
    cp -R public .next/standalone/public
  fi

  # Final existence checks
  if [ ! -f "${standalone_static}/css" ] && [ ! -d "${standalone_static}/css" ]; then
    # css may not exist if no CSS — but chunks must
    :
  fi
  if [ ! -d "${standalone_static}/chunks" ]; then
    die "verification failed: ${standalone_static}/chunks not found — the app will serve 500s on CSS/JS"
  fi
  ok "standalone static chunks present ($(ls "${standalone_static}/chunks" 2>/dev/null | wc -l) files)"
  ok "standalone public present ($(ls "$standalone_public" 2>/dev/null | wc -l) entries)"

  # ── 5b. CRITICAL — filesystem permissions + nginx config sync ───────────
  # nginx runs as www-data and serves /_next/static/ + /public/ directly from
  # disk via `alias`. Two things must be true:
  #   1. Filesystem permissions allow www-data to traverse /home/<user>/ and
  #      read .next/standalone/ + public/. (Ubuntu default mode 750 blocks this.)
  #   2. nginx site config must point at the correct absolute app path.
  # sync_nginx_if_needed() handles both — it re-syncs the config if stale AND
  # always fixes permissions. If nginx isn't installed (dev machine), it's a no-op.
  sync_nginx_if_needed

  # ── 6. Reload PM2 (zero-downtime) ─────────────────────────────────────────
  step "Reloading PM2 app (zero-downtime)"
  pm2 startOrReload ecosystem.config.cjs --update-env
  pm2 save
  ok "app reloaded & process list saved"

  # ── 7. Health check + static-asset verification ──────────────────────────
  step "Health check (local app on :${APP_PORT})"
  sleep 2
  if curl -sf "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null 2>&1; then
    ok "http://127.0.0.1:${APP_PORT}/api/health → 200 OK"
  else
    warn "health check did not return 200 — check: pm2 logs ${APP_NAME}"
  fi

  # Verify CSS/JS chunks actually load through the server.
  # This catches the "standalone static missing" 500 issue BEFORE the deploy
  # is declared done.
  step "Verifying static assets load through server"
  local html css_ref js_ref font_ref
  html="$(curl -s http://127.0.0.1:${APP_PORT}/)"
  css_ref="$(printf '%s' "$html" | grep -oE '/_next/static/chunks/[a-f0-9]+\.css' | head -1)"
  js_ref="$(printf '%s' "$html" | grep -oE '/_next/static/chunks/[a-f0-9]+\.js' | head -1)"
  font_ref="$(printf '%s' "$html" | grep -oE '/_next/static/media/[a-f0-9_-]+\.woff2' | head -1)"

  if [ -n "$css_ref" ]; then
    code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${APP_PORT}${css_ref}")"
    if [ "$code" = "200" ]; then
      ok "CSS chunk ${css_ref} → 200"
    else
      warn "CSS chunk ${css_ref} → ${code} (expected 200)"
      warn "  the standalone server can't find its static files — the page will be unstyled"
    fi
  else
    warn "no CSS chunk reference found in homepage HTML (may be inlined)"
  fi

  if [ -n "$js_ref" ]; then
    code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${APP_PORT}${js_ref}")"
    if [ "$code" = "200" ]; then
      ok "JS chunk ${js_ref} → 200"
    else
      warn "JS chunk ${js_ref} → ${code} (expected 200)"
    fi
  fi

  if [ -n "$font_ref" ]; then
    code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${APP_PORT}${font_ref}")"
    if [ "$code" = "200" ]; then
      ok "font ${font_ref} → 200"
    else
      warn "font ${font_ref} → ${code} (expected 200)"
    fi
  fi

  cat <<EOF

  ┌──────────────────────────────────────────────────────────────┐
  │  ✅ Deploy complete                                           │
  │  App:    http://localhost:${APP_PORT}                           │
  │  Public: https://${DOMAIN}                                       │
  │  Logs:   pm2 logs ${APP_NAME}                                    │
  │  Status: pm2 status                                            │
  │  Monit:  pm2 monit                                             │
  └──────────────────────────────────────────────────────────────┘
EOF
}

# ── Dispatch ─────────────────────────────────────────────────────────────────
case "$SUBCMD" in
  help)    show_help ;;
  setup)   do_setup ;;
  nginx)   do_nginx ;;
  ssl)     do_ssl ;;
  health)  do_health ;;
  logs)    do_logs ;;
  deploy)  do_deploy ;;
  *)       die "unknown subcommand: $SUBCMD (try --help)" ;;
esac
