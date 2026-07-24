#!/usr/bin/env bash
# ============================================================================
# CredoraFin — One-command deployment script (SQLite + Nginx edition)
# ----------------------------------------------------------------------------
# SQLite needs NO server process, NO Docker, and NO external services — the
# database is just a file on disk (db/app.db). Nginx is auto-installed and
# configured as a reverse proxy for the production domain.
#   0. Verify prerequisites (bun, curl, nginx — auto-install missing)
#   1. Ensure .env exists (create from .env.example, force correct values)
#   2. Install npm deps (if node_modules missing)
#   3. Generate Prisma client
#   4. Push DB schema (creates the SQLite file + all tables)
#   5. Seed DB (admin user + 6 positions + 5 hero slides + 6 blog posts)
#   6. Build Next.js standalone production bundle
#   7. Clear port 3000
#   8. Start the production server on port 3000
#   9. Configure Nginx reverse proxy for the domain + reload
#
# Usage:
#   ./deploy.sh                       # full deploy (domain: credorafin.com)
#   ./deploy.sh --domain=example.com  # use a custom domain
#   ./deploy.sh --no-build            # skip the build step (reuse existing .next)
#   ./deploy.sh --no-seed             # skip DB seed (keep existing data)
#   ./deploy.sh --no-nginx            # skip nginx configuration
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
MAX_WAIT_SECS=120         # max time to wait for the app to come up
DB_FILE="db/app.db"       # relative to project root
DOMAIN="credorafin.com"   # production domain (override with --domain=)

# Flags from argv
DO_BUILD=1
DO_SEED=1
DO_NGINX=1

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
    --no-build) DO_BUILD=0 ;;
    --no-seed)  DO_SEED=0 ;;
    --no-nginx) DO_NGINX=0 ;;
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
step "Step 0/9 — Checking prerequisites"

# Heads-up: nginx + apt installs need root. The app itself (port 3000) does
# not. Running with sudo is recommended so nginx can be installed/configured.
if [[ $(id -u) -ne 0 ]]; then
  warn "not running as root — nginx install/config steps will use sudo"
fi

have bun    || die "bun not found in PATH. Install: curl -fsSL https://bun.sh/install | bash"
have curl   || die "curl not found"
ok "bun: $(bun --version)"
ok "curl: $(curl --version | head -1 | awk '{print $1,$2}')"

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

# ============================================================================
# STEP 1 — Environment file
# ============================================================================
step "Step 1/9 — Ensuring .env exists"

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
ok "db directory ready: $(dirname "$DB_FILE")/"

# Re-source so the rest of this script sees the values
# shellcheck disable=SC1091
set -a; source .env 2>/dev/null || true; set +a

# ============================================================================
# STEP 2 — Install dependencies
# ============================================================================
step "Step 2/9 — Installing dependencies"

if [[ ! -d node_modules ]]; then
  bun install --frozen-lockfile 2>/dev/null || bun install
  ok "dependencies installed"
else
  ok "node_modules present (skipping install)"
fi

# ============================================================================
# STEP 3 — Generate Prisma client
# ============================================================================
step "Step 3/9 — Generating Prisma client"

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
step "Step 4/9 — Pushing DB schema (creating all tables)"

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
  step "Step 5/9 — Seeding database (admin + positions + hero slides + blog posts)"
  if bun run scripts/seed.ts >/dev/null 2>&1; then
    ok "seed complete (idempotent — existing data preserved)"
    ok "admin login: admin@credora.in / credora@admin123"
  else
    err "db seed failed. Re-running with output:"
    bun run scripts/seed.ts 2>&1 | tail -n 30 >&2 || true
    die "db seed failed — see output above"
  fi
else
  step "Step 5/9 — (skipped: --no-seed)"
fi

# ============================================================================
# STEP 6 — Build Next.js production bundle
# ============================================================================
if [[ $DO_BUILD -eq 1 ]]; then
  step "Step 6/9 — Building Next.js standalone production bundle"
  if bun run build >/dev/null 2>&1; then
    ok "standalone build ready at .next/standalone/"
  else
    err "next build failed. Re-running with output:"
    bun run build 2>&1 | tail -n 40 >&2 || true
    die "next build failed — see output above"
  fi
else
  step "Step 6/9 — (skipped: --no-build)"
fi

# ============================================================================
# STEP 7 — Stop any existing server (so re-runs don't serve stale builds)
# ============================================================================
step "Step 7/9 — Clearing port ${APP_PORT}"

kill_port "$APP_PORT"
sleep 1
if port_open "$APP_PORT"; then
  warn "port ${APP_PORT} still in use after kill — the new server may fail to bind"
else
  ok "port ${APP_PORT} is free"
fi

# ============================================================================
# STEP 8 — Start the production server
# ============================================================================
step "Step 8/9 — Starting production server"

log "starting standalone server (background, logs → server.log)..."
NODE_ENV=production nohup node .next/standalone/server.js > server.log 2>&1 &
echo $! > .server.pid
ok "server PID: $(cat .server.pid)"

# Wait for the app health endpoint to respond
log "waiting for app to respond at ${HEALTH_URL}..."
wait_for "$HEALTH_URL" "Production server"
ok "production server is healthy"

# ============================================================================
# STEP 9 — Configure Nginx reverse proxy for the domain
# ============================================================================
if [[ $DO_NGINX -eq 1 ]]; then
  step "Step 9/9 — Configuring Nginx for ${DOMAIN}"

  NGINX_SITE_FILE="/etc/nginx/sites-available/${DOMAIN}"
  NGINX_ENABLED_LINK="/etc/nginx/sites-enabled/${DOMAIN}"

  # Write the server block. Heredoc is QUOTED ('NGINX_CONF') so nginx variables
  # ($host, $remote_addr, $http_upgrade, etc.) are NOT expanded by bash — they
  # must reach nginx literally. The domain is injected via sed placeholder.
  as_root mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

  cat > "/tmp/${DOMAIN}.conf" <<'NGINX_CONF'
server {
    listen 80;
    listen [::]:80;
    server_name __DOMAIN__ www.__DOMAIN__;

    # Client body size for file uploads (brochures, resumes)
    client_max_body_size 20M;

    # Reverse proxy to the Next.js standalone server (port 3000)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket support (required for Next.js HMR / realtime features)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Forward original request info so the app sees real client data
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts for long-running requests
        proxy_read_timeout 90s;
        proxy_send_timeout 90s;
    }

    # Cache static assets aggressively (Next.js /_next/static is immutable)
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_bypass $http_upgrade;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONF

  # Inject the domain into the placeholder
  sed -i "s|__DOMAIN__|${DOMAIN}|g" "/tmp/${DOMAIN}.conf"
  as_root cp "/tmp/${DOMAIN}.conf" "$NGINX_SITE_FILE"
  rm -f "/tmp/${DOMAIN}.conf"
  ok "nginx site config written: ${NGINX_SITE_FILE}"

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
  step "Step 9/9 — (skipped: --no-nginx)"
fi

# ============================================================================
# Done
# ============================================================================
echo ""
echo -e "${C_BOLD}${C_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"
echo -e "${C_BOLD}${C_GREEN}  ✓ CredoraFin deployed successfully${C_RESET}"
echo -e "${C_BOLD}${C_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"
echo ""
if [[ $DO_NGINX -eq 1 ]]; then
  echo -e "  Public URL:     ${C_BOLD}http://${DOMAIN}${C_RESET}"
  echo -e "  Nginx proxy:    ${C_BOLD}${DOMAIN}:80 → 127.0.0.1:${APP_PORT}${C_RESET}"
else
  echo -e "  App URL:        ${C_BOLD}http://localhost:${APP_PORT}${C_RESET}"
fi
echo -e "  Database:       ${C_BOLD}SQLite at ${DB_FILE}${C_RESET}"
echo -e "  Admin login:    ${C_BOLD}admin@credora.in / credora@admin123${C_RESET}"
echo -e "  Health:         ${C_BOLD}${HEALTH_URL}${C_RESET}"
echo -e "  Logs:           ${C_BOLD}server.log${C_RESET}"
if [[ $DO_NGINX -eq 1 ]]; then
  echo -e "  Nginx logs:     ${C_BOLD}/var/log/nginx/access.log & /var/log/nginx/error.log${C_RESET}"
  echo ""
  echo -e "  ${C_YELLOW}Next steps:${C_RESET}"
  echo -e "    1. Point DNS: create an A record for ${C_BOLD}${DOMAIN}${C_RESET} → this server's public IP"
  echo -e "    2. Open firewall: sudo ufw allow 80/tcp  (and 443 for HTTPS)"
  echo -e "    3. Add HTTPS:    sudo apt-get install -y certbot python3-certbot-nginx && sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
fi
echo ""
exit 0
