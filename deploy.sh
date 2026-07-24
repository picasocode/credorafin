#!/usr/bin/env bash
# ============================================================================
# CredoraFin — One-command deployment script
# ----------------------------------------------------------------------------
# Runs the ENTIRE deployment with NO questions asked:
#   1. Verify prerequisites (bun, docker, supabase CLI)
#   2. Ensure .env exists (create from .env.example if missing)
#   3. Install npm deps (if node_modules missing)
#   4. Start Supabase local (if not already running) + wait for DB ready
#   5. Generate Prisma client (PostgreSQL)
#   6. Push DB schema (create all 11 tables)
#   7. Seed DB (admin user + 6 positions + 5 hero slides + 6 blog posts)
#   8. Build Next.js standalone production bundle
#   9. Start the production server on port 3000
#
# Usage:
#   ./deploy.sh              # full local deploy (Supabase local + standalone)
#   ./deploy.sh --docker     # build + run via Docker instead of bare standalone
#   ./deploy.sh --no-build   # skip the build step (reuse existing .next)
#   ./deploy.sh --no-seed    # skip DB seed (keep existing data)
#   ./deploy.sh --help
#
# The port is always cleared before starting (re-runs replace the old server).
#
# The script is idempotent: safe to re-run. Exit code 0 = success.
# ============================================================================

set -euo pipefail

# ── Config ──────────────────────────────────────────────────────────────────
APP_NAME="credorafin"
APP_PORT="3000"
DB_PORT="54322"           # Supabase local Postgres port
DB_HOST="127.0.0.1"
DB_URL_DEFAULT="postgresql://postgres:postgres@${DB_HOST}:${DB_PORT}/postgres?schema=public"
HEALTH_URL="http://127.0.0.1:${APP_PORT}/api/health"
MAX_WAIT_SECS=120         # max time to wait for DB / app to come up

# Flags from argv
DO_DOCKER=0
DO_BUILD=1
DO_SEED=1

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
    --docker)   DO_DOCKER=1 ;;
    --no-build) DO_BUILD=0 ;;
    --no-seed)  DO_SEED=0 ;;
    --restart)  ;;  # accepted for backwards compat (now the default behavior)
    --help|-h)
      sed -n '2,30p' "$0"
      exit 0
      ;;
    *) die "Unknown flag: $arg (try --help)" ;;
  esac
done

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

wait_for_port() {   # wait_for_port <port> <label>
  local port="$1" label="$2" elapsed=0
  while ! port_open "$port"; do
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

# ============================================================================
# STEP 0 — Prerequisites
# ============================================================================
step "Step 0/9 — Checking prerequisites"

have bun    || die "bun not found. Install: curl -fsSL https://bun.sh/install | bash"
have curl   || die "curl not found"
ok "bun: $(bun --version)"
ok "curl: $(curl --version | head -1 | awk '{print $1,$2}')"

if [[ $DO_DOCKER -eq 1 ]]; then
  have docker || die "docker not found (required for --docker mode)"
  ok "docker: $(docker --version 2>/dev/null | awk '{print $1,$2,$3}')"
fi

# Supabase CLI is optional in --docker mode (Docker image uses cloud/remote DB)
if [[ $DO_DOCKER -eq 0 ]]; then
  if have supabase; then
    ok "supabase: $(supabase --version 2>/dev/null | head -1)"
  else
    warn "supabase CLI not found — will try to install it"
    if have brew; then
      brew install supabase/tap/supabase || die "brew install supabase failed"
    elif have npm; then
      npm install -g supabase || die "npm install -g supabase failed"
    else
      die "supabase CLI required for local mode. Install: https://supabase.com/docs/guides/local-development"
    fi
    ok "supabase installed: $(supabase --version 2>/dev/null | head -1)"
  fi
fi

cd "$(dirname "$0")"
ok "working dir: $(pwd)"

# ============================================================================
# STEP 1 — Environment file
# ============================================================================
step "Step 1/9 — Ensuring .env exists"

if [[ ! -f .env ]]; then
  [[ -f .env.example ]] && cp .env.example .env
  ok "created .env from .env.example"
else
  ok ".env already exists"
fi

# Make sure DATABASE_URL points at local Supabase for local (non-docker) mode
if [[ $DO_DOCKER -eq 0 ]]; then
  # shellcheck disable=SC1091
  set -a; source .env 2>/dev/null || true; set +a
  if [[ -z "${DATABASE_URL:-}" || "${DATABASE_URL}" != *"${DB_PORT}"* ]]; then
    # Force the local Supabase URL into .env (idempotent)
    if grep -q '^DATABASE_URL=' .env; then
      sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=\"${DB_URL_DEFAULT}\"|" .env && rm -f .env.bak
    else
      echo "DATABASE_URL=\"${DB_URL_DEFAULT}\"" >> .env
    fi
    ok "DATABASE_URL updated to local Supabase (port ${DB_PORT})"
  else
    ok "DATABASE_URL already points at local Supabase"
  fi
fi

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
# STEP 3 — Start Supabase local (local mode only)
# ============================================================================
if [[ $DO_DOCKER -eq 0 ]]; then
  step "Step 3/9 — Starting Supabase local"

  # Is Supabase already running? Check DB port.
  if port_open "$DB_PORT"; then
    ok "Supabase local already running"
  else
    log "running: supabase start (first run downloads images, ~5 min)"
    supabase start >/dev/null 2>&1 || die "supabase start failed (is Docker daemon running?)"
    ok "supabase started"
  fi

  # Wait for Postgres to accept connections on DB_PORT
  log "waiting for Postgres on ${DB_HOST}:${DB_PORT}..."
  wait_for_port "$DB_PORT" "Supabase Postgres"
  ok "Supabase Postgres is up"
else
  step "Step 3/9 — (skipped: --docker mode uses a remote/cloud DB)"
fi

# ============================================================================
# STEP 4 — Generate Prisma client
# ============================================================================
step "Step 4/9 — Generating Prisma client"

bunx prisma generate >/dev/null 2>&1 || die "prisma generate failed"
ok "Prisma client generated"

# ============================================================================
# STEP 5 — Push schema to database
# ============================================================================
step "Step 5/9 — Pushing DB schema (creating all 11 tables)"

# shellcheck disable=SC1091
set -a; source .env 2>/dev/null || true; set +a
export DATABASE_URL

if [[ $DO_DOCKER -eq 0 ]]; then
  bunx prisma db push --accept-data-loss >/dev/null 2>&1 || die "prisma db push failed (is Supabase running?)"
  ok "schema pushed to local Supabase"
else
  # In docker mode we still want to push schema to the configured remote DB
  bunx prisma db push --accept-data-loss >/dev/null 2>&1 || warn "prisma db push failed (will be retried inside the container on startup)"
  ok "schema push attempted against configured DATABASE_URL"
fi

# ============================================================================
# STEP 6 — Seed the database
# ============================================================================
if [[ $DO_SEED -eq 1 ]]; then
  step "Step 6/9 — Seeding database (admin + positions + hero slides + blog posts)"
  bun run scripts/seed.ts >/dev/null 2>&1 || die "db seed failed"
  ok "seed complete (idempotent — existing data preserved)"
  ok "admin login: admin@credora.in / credora@admin123"
else
  step "Step 6/9 — (skipped: --no-seed)"
fi

# ============================================================================
# STEP 7 — Build Next.js production bundle
# ============================================================================
if [[ $DO_BUILD -eq 1 ]]; then
  step "Step 7/9 — Building Next.js standalone production bundle"
  if [[ $DO_DOCKER -eq 1 ]]; then
    log "docker mode: build happens inside the image (step 8)"
  else
    bun run build >/dev/null 2>&1 || die "next build failed"
    ok "standalone build ready at .next/standalone/"
  fi
else
  step "Step 7/9 — (skipped: --no-build)"
fi

# ============================================================================
# STEP 8 — Stop any existing server (always — so re-runs don't serve stale builds)
# ============================================================================
step "Step 8/9 — Clearing port ${APP_PORT}"

# Always free the port so the new server binds cleanly. This is non-interactive
# by design: if something is on 3000, it gets killed. Use --no-build + a
# surviving external server manually if you really want to keep something running.
kill_port "$APP_PORT"
sleep 1
if port_open "$APP_PORT"; then
  warn "port ${APP_PORT} still in use after kill — the new server may fail to bind"
else
  ok "port ${APP_PORT} is free"
fi

# ============================================================================
# STEP 9 — Start the production server
# ============================================================================
step "Step 9/9 — Starting production server"

if [[ $DO_DOCKER -eq 1 ]]; then
  log "building docker image..."
  docker build -t "${APP_NAME}:latest" . || die "docker build failed"
  ok "image built: ${APP_NAME}:latest"

  log "running container on port ${APP_PORT}..."
  # Stop any existing container with the same name
  docker rm -f "${APP_NAME}" >/dev/null 2>&1 || true
  docker run -d --name "${APP_NAME}" \
    -p "${APP_PORT}:3000" \
    --env-file .env \
    --restart unless-stopped \
    "${APP_NAME}:latest" >/dev/null || die "docker run failed"
  ok "container started: ${APP_NAME}"
else
  log "starting standalone server (background, logs → server.log)..."
  NODE_ENV=production nohup node .next/standalone/server.js > server.log 2>&1 &
  echo $! > .server.pid
  ok "server PID: $(cat .server.pid)"
fi

# Wait for the app health endpoint to respond
log "waiting for app to respond at ${HEALTH_URL}..."
wait_for "$HEALTH_URL" "Production server"
ok "production server is healthy"

# ============================================================================
# Done
# ============================================================================
echo ""
echo -e "${C_BOLD}${C_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"
echo -e "${C_BOLD}${C_GREEN}  ✓ CredoraFin deployed successfully${C_RESET}"
echo -e "${C_BOLD}${C_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C_RESET}"
echo ""
echo -e "  App URL:        ${C_BOLD}http://localhost:${APP_PORT}${C_RESET}"
if [[ $DO_DOCKER -eq 0 ]]; then
  echo -e "  Supabase Studio:${C_BOLD} http://127.0.0.1:54323${C_RESET}"
fi
echo -e "  Admin login:    ${C_BOLD}admin@credora.in / credora@admin123${C_RESET}"
echo -e "  Health:         ${C_BOLD}${HEALTH_URL}${C_RESET}"
echo -e "  Logs:           ${C_BOLD}server.log${C_RESET}"
if [[ $DO_DOCKER -eq 1 ]]; then
  echo -e "  Container:      ${C_BOLD}docker logs ${APP_NAME}${C_RESET}"
fi
echo ""
exit 0
