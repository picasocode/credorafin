#!/usr/bin/env bash
# ============================================================================
# CredoraFin — One-command deployment script (SQLite + Nginx + PRODUCTION edition)
# ----------------------------------------------------------------------------
# SQLite needs NO server process, NO Docker, and NO external services — the
# database is just a file on disk (db/app.db). Nginx is auto-installed and
# configured as a reverse proxy. The Next.js app is built as a standalone
# production bundle and served with bun (fast startup, low memory).
#
# Steps:
#   0. Verify prerequisites (bun, curl, nginx — auto-install missing)
#   1. Ensure .env exists (create from .env.example, force correct values)
#   2. Install npm deps (ALWAYS — clean wipe + fresh install)
#   3. Generate Prisma client
#   4. Push DB schema (creates the SQLite file + all tables)
#   5. Seed DB (admin user + 6 positions + 5 hero slides + 6 blog posts)
#   6. Build Next.js standalone production bundle
#   7. Clear port 3000 + start production server with bun
#   8. Configure Nginx reverse proxy for the domain + reload
#
# Usage:
#   ./deploy.sh                       # full deploy (domain: credorafin.com)
#   ./deploy.sh --domain=example.com  # use a custom domain
#   ./deploy.sh --no-seed             # skip DB seed (keep existing data)
#   ./deploy.sh --no-nginx            # skip nginx configuration
#   ./deploy.sh --no-build            # skip the build step (reuse existing .next)
#   ./deploy.sh --help
#
# The port is always cleared before starting (re-runs replace the old server).
# Idempotent: safe to re-run. Exit code 0 = success.
# ============================================================================

set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────────────
APP_NAME="credorafin"
APP_PORT="3000"
HEALTH_URL="http://127.0.0.1:${APP_PORT}/api/health"
MAX_WAIT_SECS=90          # max time to wait for the prod server to come up
DB_FILE="db/app.db"       # relative to project root
DOMAIN="credorafin.com"   # production domain (override with --domain=)

# Flags from argv
DO_SEED=1
DO_NGINX=1
DO_BUILD=1

# ── Pretty logging ──────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
  C_RESET='\033[0m'; C_BOLD='\033[1m'; C_GREEN='\033[32m'; C_YELLOW='\033[33m'
  C_RED='\033[31m'; C_BLUE='\033[34m'; C_GRAY='\033[90m'
else
  C_RESET=''; C_BOLD=''; C_GREEN=''; C_YELLOW=''; C_RED=''; C_BLUE=''; C_GRAY=''
fi

log()  { echo -e "${C_BLUE}▸${C_RESET} $*"; }
ok()   { echo -e "  ${C_GREEN}✓${C_RESET} $*"; }
warn() { echo -e "  ${C_YELLOW}!${C_RESET} $*"; }
err()  { echo -e "  ${C_RED}✗${C_RESET} $*" >&2; }
step() { echo -e "\n${C_BOLD}${C_BLUE}[$(date +%H:%M:%S)]${C_RESET} ${C_BOLD}$*${C_RESET}"; }
die()  { err "$*"; exit 1; }

# ── Parse args ──────────────────────────────────────────────────────────────
for arg in "$@"; do
  case "$arg" in
    --no-seed)  DO_SEED=0 ;;
    --no-nginx) DO_NGINX=0 ;;
    --no-build) DO_BUILD=0 ;;
    --domain=*) DOMAIN="${arg#*=}" ;;
    --restart)  ;;  # accepted for backwards compat (now the default behavior)
    --help|-h)
      sed -n '2,30p' "$0"
      exit 0
      ;;
    *) die "Unknown flag: $arg (try --help)" ;;
  esac
done

# ── Discover user-installed bun when run via sudo ───────────────────────────
# bun installs to ~/.bun/bin by default. Under sudo, $HOME becomes /root and
# the invoking user's tool dir drops off PATH. Add common locations so 'have
# bun' passes regardless of who runs the script.
for _d in \
  "$HOME/.bun/bin" \
  "/root/.bun/bin" \
  "/home/${SUDO_USER:-}/.bun/bin" \
  /home/*/.bun/bin \
  "$HOME/.local/bin" \
  "/home/${SUDO_USER:-}/.local/bin" \
  /home/*/.local/bin \
  /usr/local/bin; do
  [[ -d "$_d" ]] || continue
  case ":$PATH:" in
    *":$_d:"*) ;;
    *) PATH="$_d:$PATH" ;;
  esac
done
export PATH
unset _d

# ── Helpers ─────────────────────────────────────────────────────────────────
have() { command -v "$1" >/dev/null 2>&1; }

# Check if a TCP port is accepting connections (lsof → ss → /dev/tcp fallback)
port_open() {     # port_open <port>
  local port="$1"
  if have lsof; then
    lsof -i tcp:"$port" >/dev/null 2>&1 && return 0
  elif have ss; then
    ss -ltn "sport = :$port" 2>/dev/null | grep -q ":$port" && return 0
  else
    (echo > "/dev/tcp/127.0.0.1/$port") >/dev/null 2>&1 && return 0
  fi
  return 1
}

wait_for() {        # wait_for <url> <label>
  local url="$1" label="$2" elapsed=0
  while ! curl -sf "$url" >/dev/null 2>&1; do
    sleep 2; elapsed=$((elapsed + 2))
    [[ $elapsed -ge $MAX_WAIT_SECS ]] && die "$label did not come up within ${MAX_WAIT_SECS}s"
  done
}

kill_port() {       # kill_port <port>
  local port="$1" pids=""
  if have lsof; then
    pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  elif have ss; then
    pids=$(ss -ltnp "sport = :$port" 2>/dev/null | grep -oP 'pid=\K[0-9]+' | sort -u || true)
  fi
  [[ -n "$pids" ]] && kill -9 $pids 2>/dev/null || true
}

# Run a command as root (use sudo when not already root)
as_root() {
  if [[ $(id -u) -eq 0 ]]; then "$@"; else sudo "$@"; fi
}

# ============================================================================
# STEP 0 — Prerequisites (bun, curl, nginx — auto-install missing)
# ============================================================================
step "Step 0/8 — Checking prerequisites"

# Heads-up: nginx + apt installs need root. The app itself (port 3000) does
# not. Running with sudo is recommended so nginx can be installed/configured.
if [[ $(id -u) -ne 0 ]]; then
  warn "not running as root — nginx install/config steps will use sudo"
fi

have bun    || die "bun not found in PATH. Install: curl -fsSL https://bun.sh/install | bash"
have curl   || die "curl not found"
ok "bun: $(bun --version)"
ok "curl: $(curl --version | head -1 | awk '{print $1,$2}')"

# ── Swap (auto-create if RAM < 2GB — prevents OOM during next build/start) ──
# Next.js standalone + Prisma + React 19 can use 1-2GB RAM. On a 1GB EC2
# instance, the OOM killer will fire during page rendering. A 2GB swapfile
# is a cheap safety net. Skip if swap is already configured or RAM ≥ 2GB.
TOTAL_RAM_KB="$(grep MemTotal /proc/meminfo | awk '{print $2}')"
CURRENT_SWAP_KB="$(grep SwapTotal /proc/meminfo | awk '{print $2}')"
if [[ ${CURRENT_SWAP_KB:-0} -lt 1048576 ]] && [[ ${TOTAL_RAM_KB:-0} -lt 2097152 ]]; then
  warn "low RAM (${TOTAL_RAM_KB} kB) and minimal swap (${CURRENT_SWAP_KB} kB) — creating 2GB swapfile"
  if [[ ! -f /swapfile ]]; then
    as_root fallocate -l 2G /swapfile 2>/dev/null || as_root dd if=/dev/zero of=/swapfile bs=1M count=2048
    as_root chmod 600 /swapfile
    as_root mkswap /swapfile >/dev/null 2>&1
  fi
  as_root swapon /swapfile 2>/dev/null || true
  # Persist in fstab so it survives reboot
  if ! grep -q "^/swapfile" /etc/fstab 2>/dev/null; then
    echo "/swapfile none swap sw 0 0" | as_root tee -a /etc/fstab >/dev/null
  fi
  ok "2GB swapfile enabled (persists across reboots)"
else
  ok "RAM: $((TOTAL_RAM_KB / 1024))MB, Swap: $((CURRENT_SWAP_KB / 1024))MB — sufficient"
fi

# ── Nginx (auto-install if missing) ─────────────────────────────────────────
if have nginx; then
  ok "nginx: $(nginx -v 2>&1 | sed 's|nginx version: ||')"
else
  warn "nginx not found — installing automatically"
  install_nginx() {
    if have apt-get; then
      as_root apt-get update -y >/dev/null 2>&1 || true
      as_root apt-get install -y nginx >/dev/null 2>&1 || return 1
    elif have yum; then
      as_root yum install -y nginx >/dev/null 2>&1 || return 1
    elif have dnf; then
      as_root dnf install -y nginx >/dev/null 2>&1 || return 1
    else
      return 1
    fi
    have nginx
  }
  if install_nginx; then
    ok "nginx installed: $(nginx -v 2>&1 | sed 's|nginx version: ||')"
    # Start + enable on boot
    as_root systemctl start nginx 2>/dev/null || as_root service nginx start 2>/dev/null || true
    as_root systemctl enable nginx 2>/dev/null || true
  else
    die "nginx auto-install failed. Install manually: sudo apt-get install -y nginx"
  fi
fi

# Ensure nginx is running
if ! as_root systemctl is-active --quiet nginx 2>/dev/null; then
  log "starting nginx daemon..."
  as_root systemctl start nginx 2>/dev/null || as_root service nginx start 2>/dev/null || true
fi
ok "nginx daemon is running"

cd "$(dirname "$0")"
ok "working dir: $(pwd)"
ok "domain: ${DOMAIN}"
ok "mode: PRODUCTION (standalone build + bun)"

# ============================================================================
# STEP 1 — Environment file
# ============================================================================
step "Step 1/8 — Ensuring .env exists"

if [[ ! -f .env ]]; then
  if [[ -f .env.example ]]; then
    cp .env.example .env
    ok "created .env from .env.example"
  else
    : > .env
    ok "created empty .env (no .env.example found)"
  fi
  [[ -f .env ]] || die "failed to create .env"
else
  ok ".env already exists"
fi

# Force DATABASE_URL to the SQLite file (overwrites stale postgresql URLs from
# the old Supabase setup, and ensures it's always set on a fresh box).
force_env_var() {   # force_env_var <key> <value>
  local key="$1" value="$2"
  if grep -q "^${key}=" .env; then
    sed -i.bak "s|^${key}=.*|${key}=\"${value}\"|" .env && rm -f .env.bak
  else
    echo "${key}=\"${value}\"" >> .env
  fi
}

force_env_var "DATABASE_URL" "file:./${DB_FILE}"
force_env_var "NEXTAUTH_URL" "http://${DOMAIN}"
ok "DATABASE_URL = file:./${DB_FILE}"
ok "NEXTAUTH_URL = http://${DOMAIN}"

# Ensure the db/ directory exists (SQLite needs the dir to exist before write)
mkdir -p "$(dirname "$DB_FILE")"

# Fix ownership: a prior 'sudo ./deploy.sh' run may have created db/ and
# db/app.db as root. When now running as a regular user, SQLite can read the
# file but can't create its -journal/-wal sidecar files in the root-owned
# directory → "attempt to write a readonly database" (SQLITE_READONLY) on the
# first real write. Ensure the real user owns the db dir + file. This is a
# no-op if ownership is already correct.
REAL_USER="${SUDO_USER:-$(whoami)}"
REAL_GROUP="$(id -gn "$REAL_USER" 2>/dev/null || id -gn)"
DB_DIR="$(dirname "$DB_FILE")"
if [[ "$REAL_USER" != "root" ]]; then
  _cur_owner="$(stat -c %U "$DB_DIR" 2>/dev/null || echo "")"
  if [[ -n "$_cur_owner" && "$_cur_owner" != "$REAL_USER" ]]; then
    warn "db/ owned by '$_cur_owner' (leftover from a prior sudo run) — reclaiming ownership for '$REAL_USER'"
    if [[ $(id -u) -eq 0 ]]; then
      chown -R "$REAL_USER:$REAL_GROUP" "$DB_DIR" 2>/dev/null || true
    else
      sudo chown -R "$REAL_USER:$REAL_GROUP" "$DB_DIR" 2>/dev/null || true
    fi
    ok "db/ ownership transferred to '$REAL_USER'"
  fi
  # Also fix the db file itself if it exists and is root-owned
  if [[ -f "$DB_FILE" ]]; then
    _file_owner="$(stat -c %U "$DB_FILE" 2>/dev/null || echo "")"
    if [[ -n "$_file_owner" && "$_file_owner" != "$REAL_USER" ]]; then
      if [[ $(id -u) -eq 0 ]]; then
        chown "$REAL_USER:$REAL_GROUP" "$DB_FILE" 2>/dev/null || true
      else
        sudo chown "$REAL_USER:$REAL_GROUP" "$DB_FILE" 2>/dev/null || true
      fi
      ok "db file ownership transferred to '$REAL_USER'"
    fi
  fi
fi
unset _cur_owner _file_owner

# Verify the db dir is actually writable (catches edge cases the chown above
# might miss, e.g. ACLs or read-only filesystems) and fail fast with a clear
# message instead of letting Prisma hit "readonly database" deep in the seed.
if ! (touch "$DB_DIR/.write_test" 2>/dev/null && rm -f "$DB_DIR/.write_test" 2>/dev/null); then
  die "db directory '$DB_DIR' is not writable by '$REAL_USER'. Fix with: sudo chown -R \$USER:\$USER $DB_DIR"
fi
ok "db directory ready: $DB_DIR/ (owner: $(stat -c %U "$DB_DIR" 2>/dev/null || echo '?'))"

# Re-source so the rest of this script sees the values
# shellcheck disable=SC1091
set -a; source .env 2>/dev/null || true; set +a

# ============================================================================
# STEP 2 — Install dependencies (clean install — refresh stale Prisma client)
# ============================================================================
step "Step 2/8 — Installing dependencies"

# Wipe node_modules BEFORE installing. A stale/corrupted node_modules (from the
# old postgresql setup, a partial install, or root-owned files left by a prior
# `sudo ./deploy.sh` run) causes `bun install` to fail with EEXIST link errors
# and AccessDenied on nested folders. A clean slate fixes all of that. bun
# caches downloaded tarballs globally (~/.bun/install/cache) so re-installing
# from scratch is still fast — only the linking step runs.
if [[ -d node_modules ]]; then
  log "removing stale node_modules (avoids EEXIST / AccessDenied link errors)..."
  if ! rm -rf node_modules 2>/dev/null; then
    # Some files may be owned by root (from a prior sudo run). Fall back to sudo.
    warn "regular rm failed (likely root-owned files) — retrying with sudo"
    as_root rm -rf node_modules
  fi
  ok "node_modules cleared"
fi

# Also clear bun's lockfile-internal cache marker so it doesn't reuse a
# half-written state. (We keep bun.lock/bun.lockb — they're the source of truth.)
rm -rf .bun-cache 2>/dev/null || true

log "running bun install (fresh install for SQLite Prisma client)..."
# Don't use --frozen-lockfile here: if the lockfile is slightly out of sync
# with package.json (e.g. after a git pull that touched deps), we want bun to
# reconcile it rather than fail. A plain `bun install` is idempotent.
if bun install; then
  ok "dependencies installed"
else
  err "bun install failed. Re-running with verbose output:"
  bun install 2>&1 | tail -n 40 >&2 || true
  die "bun install failed — see output above. Try manually: rm -rf node_modules && bun install"
fi

# ============================================================================
# STEP 3 — Generate Prisma client
# ============================================================================
step "Step 3/8 — Generating Prisma client"

# Try generate; if it fails, show the real error and retry with a fresh install
# (a stale node_modules/.prisma from the old postgresql setup can cause this).
if bunx prisma generate >/dev/null 2>&1; then
  ok "Prisma client generated"
else
  warn "prisma generate failed — showing real error and retrying with fresh deps"
  err "first attempt output:"
  bunx prisma generate 2>&1 | tail -n 30 >&2 || true
  log "reinstalling dependencies (clearing stale prisma client cache)..."
  rm -rf node_modules/.prisma node_modules/@prisma/client 2>/dev/null || true
  bun install 2>/dev/null || true
  if bunx prisma generate 2>&1 | tail -n 30; then
    ok "Prisma client generated (after fresh install)"
  else
    die "prisma generate failed — see output above. Try: rm -rf node_modules && bun install && bunx prisma generate"
  fi
fi

# ============================================================================
# STEP 4 — Push schema to database (creates the SQLite file + tables)
# ============================================================================
step "Step 4/8 — Pushing DB schema (creating all tables)"

# shellcheck disable=SC1091
set -a; source .env 2>/dev/null || true; set +a
export DATABASE_URL

if bunx prisma db push --accept-data-loss >/dev/null 2>&1; then
  ok "schema pushed to SQLite (${DB_FILE})"
else
  err "prisma db push failed. Re-running with output:"
  bunx prisma db push --accept-data-loss 2>&1 | tail -n 30 >&2 || true
  die "prisma db push failed — see output above"
fi

# ============================================================================
# STEP 5 — Seed the database
# ============================================================================
if [[ $DO_SEED -eq 1 ]]; then
  step "Step 5/8 — Seeding database (admin + positions + hero slides + blog posts)"
  if bun run scripts/seed.ts >/dev/null 2>&1; then
    ok "seed complete (idempotent — existing data preserved)"
    ok "admin login: admin@credora.in / credora@admin123"
  else
    err "db seed failed. Re-running with output:"
    seed_out="$(bun run scripts/seed.ts 2>&1 || true)"
    echo "$seed_out" | tail -n 30 >&2
    # Detect the classic "readonly database" ownership issue and give an
    # actionable hint (the chown in Step 1 should normally prevent this, but
    # be defensive in case of ACLs or a manually-created db file).
    if echo "$seed_out" | grep -qi "readonly database"; then
      die "db seed failed: SQLite database is readonly. The db file/dir is likely owned by root. Fix with: sudo chown -R \$USER:\$USER $(dirname "$DB_FILE") && ./deploy.sh"
    fi
    die "db seed failed — see output above"
  fi
else
  step "Step 5/8 — (skipped: --no-seed)"
fi

# ============================================================================
# STEP 6 — Build Next.js standalone production bundle
# ============================================================================
if [[ $DO_BUILD -eq 1 ]]; then
  step "Step 6/8 — Building Next.js standalone production bundle"
  # Build with bun. next.config.ts has output: "standalone" which produces a
  # self-contained server at .next/standalone/server.js. The build script in
  # package.json also copies .next/static and public/ into the standalone dir.
  log "running bun run build (this can take 1-3 min on a small EC2 instance)..."
  if bun run build > /tmp/build.log 2>&1; then
    ok "standalone build ready at .next/standalone/"
  else
    err "next build failed. Last 50 lines of build output:"
    tail -n 50 /tmp/build.log >&2 || true
    die "next build failed — see /tmp/build.log for full output. Tip: try --no-build to reuse an existing .next/"
  fi
else
  step "Step 6/8 — (skipped: --no-build)"
fi

# ============================================================================
# STEP 7 — Stop any existing server + start production server with bun
# ============================================================================
step "Step 7/8 — Clearing port ${APP_PORT} + starting production server"

kill_port "$APP_PORT"
sleep 1
if port_open "$APP_PORT"; then
  warn "port ${APP_PORT} still in use after kill — the new server may fail to bind"
else
  ok "port ${APP_PORT} is free"
fi

# Start the standalone production server with bun (faster startup + lower
# memory than node). The standalone server.js is self-contained — it bundles
# all Node modules needed to run, so we don't need node_modules in production.
log "starting production server with bun (logs → server.log)..."
NODE_ENV=production nohup bun .next/standalone/server.js > server.log 2>&1 &
echo $! > .server.pid
ok "production server PID: $(cat .server.pid)"

# Wait for the app health endpoint to respond. The production server boots
# fast (no on-demand compilation) — typically under 5 seconds.
log "waiting for app to respond at ${HEALTH_URL}..."
wait_for "$HEALTH_URL" "Production server"
ok "production server is healthy"

# ============================================================================
# STEP 8 — Configure Nginx reverse proxy for the domain
# ============================================================================
if [[ $DO_NGINX -eq 1 ]]; then
  step "Step 8/8 — Configuring Nginx for ${DOMAIN}"

  NGINX_SITE_FILE="/etc/nginx/sites-available/${DOMAIN}"
  NGINX_ENABLED_LINK="/etc/nginx/sites-enabled/${DOMAIN}"

  as_root mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled /var/www/html

  # Use the version-controlled HTTP-only config from the repo as the base.
  # This is the PRE-certbot config: it serves ACME challenges on /.well-known/
  # and proxies everything else to the dev server. After deploy.sh finishes,
  # the user runs `certbot --nginx` which rewrites this file to add the 443
  # block + HTTP→HTTPS redirect automatically.
  NGINX_REPO_CONF="nginx/credorafin.com.http.conf"
  if [[ -f "$NGINX_REPO_CONF" ]]; then
    # Inject the configured domain (the repo version hardcodes credorafin.com,
    # but --domain= may override it). Use sed on a temp copy so the repo file
    # stays pristine.
    cp "$NGINX_REPO_CONF" "/tmp/${DOMAIN}.conf"
    sed -i "s|credorafin.com|${DOMAIN}|g" "/tmp/${DOMAIN}.conf"
    as_root cp "/tmp/${DOMAIN}.conf" "$NGINX_SITE_FILE"
    rm -f "/tmp/${DOMAIN}.conf"
    ok "nginx site config copied from ${NGINX_REPO_CONF}"
  else
    # Fallback: generate inline (for clones that don't have the nginx/ dir)
    warn "nginx/credorafin.com.http.conf not found in repo — generating inline"
    cat > "/tmp/${DOMAIN}.conf" <<'NGINX_CONF'
server {
    listen 80;
    listen [::]:80;
    server_name __DOMAIN__ www.__DOMAIN__;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
        try_files $uri =404;
    }

    client_max_body_size 20M;

    location /_next/webpack-hmr {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_bypass $http_upgrade;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONF
    sed -i "s|__DOMAIN__|${DOMAIN}|g" "/tmp/${DOMAIN}.conf"
    as_root cp "/tmp/${DOMAIN}.conf" "$NGINX_SITE_FILE"
    rm -f "/tmp/${DOMAIN}.conf"
    ok "nginx site config generated inline: ${NGINX_SITE_FILE}"
  fi

  # Enable the site (symlink) and disable the default site to avoid conflicts
  as_root ln -sf "$NGINX_SITE_FILE" "$NGINX_ENABLED_LINK"
  as_root rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
  ok "site enabled: ${DOMAIN}"

  # Test the nginx config before reloading
  if as_root nginx -t 2>/dev/null; then
    ok "nginx config test passed"
  else
    err "nginx config test failed. Output:"
    as_root nginx -t 2>&1 | tail -n 20 >&2 || true
    die "nginx config test failed — site not activated (app is still running on port ${APP_PORT})"
  fi

  # Reload nginx to pick up the new config
  if as_root systemctl reload nginx 2>/dev/null || as_root service nginx reload 2>/dev/null; then
    ok "nginx reloaded"
  else
    warn "nginx reload failed — trying restart"
    as_root systemctl restart nginx 2>/dev/null || as_root service nginx restart 2>/dev/null || true
  fi
  ok "nginx is proxying ${DOMAIN} → 127.0.0.1:${APP_PORT}"
else
  step "Step 8/8 — (skipped: --no-nginx)"
fi

# ============================================================================
# Done
# ============================================================================
echo ""
echo -e "${C_BOLD}${C_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"
echo -e "${C_BOLD}${C_GREEN}  ✓ CredoraFin dev server is running${C_RESET}"
echo -e "${C_BOLD}${C_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"
echo ""
if [[ $DO_NGINX -eq 1 ]]; then
  echo -e "  Public URL:     ${C_BOLD}http://${DOMAIN}${C_RESET}"
  echo -e "  Nginx proxy:    ${C_BOLD}${DOMAIN}:80 → 127.0.0.1:${APP_PORT}${C_RESET}"
else
  echo -e "  App URL:        ${C_BOLD}http://localhost:${APP_PORT}${C_RESET}"
fi
echo -e "  Mode:           ${C_BOLD}PRODUCTION (standalone build + bun)${C_RESET}"
echo -e "  Database:       ${C_BOLD}SQLite at ${DB_FILE}${C_RESET}"
echo -e "  Admin login:    ${C_BOLD}admin@credora.in / credora@admin123${C_RESET}"
echo -e "  Health:         ${C_BOLD}${HEALTH_URL}${C_RESET}"
echo -e "  Logs:           ${C_BOLD}server.log${C_RESET}"
echo -e "  PID file:       ${C_BOLD}.server.pid${C_RESET}"
if [[ $DO_NGINX -eq 1 ]]; then
  echo -e "  Nginx logs:     ${C_BOLD}/var/log/nginx/access.log & /var/log/nginx/error.log${C_RESET}"
  echo ""
  echo -e "  ${C_YELLOW}Next steps:${C_RESET}"
  echo -e "    1. Point DNS: create an A record for ${C_BOLD}${DOMAIN}${C_RESET} → this server's public IP"
  echo -e "    2. Open firewall: sudo ufw allow 80/tcp && sudo ufw allow 443/tcp"
  echo -e "    3. Add HTTPS (apex only — most reliable):"
  echo -e "         ${C_BOLD}sudo certbot --nginx -d ${DOMAIN} --agree-tos --no-eff-email -m you@example.com${C_RESET}"
  echo -e "       Only add www AFTER you've created a separate A record for www.${DOMAIN}:"
  echo -e "         ${C_BOLD}sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}${C_RESET}"
  echo -e "       (if www DNS points elsewhere, the www challenge will 404 and block the cert)"
  echo ""
  echo -e "  ${C_YELLOW}Manage the dev server:${C_RESET}"
  echo -e "    Stop:   ${C_BOLD}kill \$(cat .server.pid)${C_RESET}"
  echo -e "    Logs:   ${C_BOLD}tail -f server.log${C_RESET}"
  echo -e "    Restart:${C_BOLD} ./deploy.sh${C_RESET}"
fi
echo ""
exit 0
