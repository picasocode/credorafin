#!/usr/bin/env bash
# ============================================================================
# CredoraFin — One-command deployment script (SQLite edition)
# ----------------------------------------------------------------------------
# SQLite needs NO server process, NO Docker, and NO external services — the
# database is just a file on disk (db/app.db). This makes deployment trivial:
#   0. Verify prerequisites (bun only — no Docker/Supabase needed)
#   1. Ensure .env exists (create from .env.example if missing)
#   2. Install npm deps (if node_modules missing)
#   3. Generate Prisma client
#   4. Push DB schema (creates the SQLite file + all tables)
#   5. Seed DB (admin user + 6 positions + 5 hero slides + 6 blog posts)
#   6. Build Next.js standalone production bundle
#   7. Clear port 3000
#   8. Start the production server on port 3000
#
# Usage:
#   ./deploy.sh              # full deploy
#   ./deploy.sh --no-build   # skip the build step (reuse existing .next)
#   ./deploy.sh --no-seed    # skip DB seed (keep existing data)
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

# Flags from argv
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

# ============================================================================
# STEP 0 — Prerequisites
# ============================================================================
step "Step 0/8 — Checking prerequisites"

# Heads-up: this script does NOT require root. Port 3000 is unprivileged.
if [[ $(id -u) -eq 0 ]]; then
  warn "running as root (sudo) — generated files will be root-owned; prefer 'bash deploy.sh' without sudo"
fi

have bun    || die "bun not found in PATH. Install: curl -fsSL https://bun.sh/install | bash"
have curl   || die "curl not found"
ok "bun: $(bun --version)"
ok "curl: $(curl --version | head -1 | awk '{print $1,$2}')"

cd "$(dirname "$0")"
ok "working dir: $(pwd)"

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

# Make sure DATABASE_URL is set to the SQLite file. If it's missing or still
# points at a postgresql URL (legacy), force it to the SQLite path.
# shellcheck disable=SC1091
set -a; source .env 2>/dev/null || true; set +a
if [[ -z "${DATABASE_URL:-}" || "${DATABASE_URL:-}" == postgresql* ]]; then
  if grep -q '^DATABASE_URL=' .env; then
    sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=\"file:./${DB_FILE}\"|" .env && rm -f .env.bak
  else
    echo "DATABASE_URL=\"file:./${DB_FILE}\"" >> .env
  fi
  ok "DATABASE_URL set to SQLite (${DB_FILE})"
  # Re-source so the rest of this script sees the new value
  set -a; source .env 2>/dev/null || true; set +a
else
  ok "DATABASE_URL already configured: ${DATABASE_URL}"
fi

# Ensure the db/ directory exists (SQLite needs the dir to exist before write)
mkdir -p "$(dirname "$DB_FILE")"
ok "db directory ready: $(dirname "$DB_FILE")/"

# ============================================================================
# STEP 2 — Install dependencies
# ============================================================================
step "Step 2/8 — Installing dependencies"

if [[ ! -d node_modules ]]; then
  bun install --frozen-lockfile 2>/dev/null || bun install
  ok "dependencies installed"
else
  ok "node_modules present (skipping install)"
fi

# ============================================================================
# STEP 3 — Generate Prisma client
# ============================================================================
step "Step 3/8 — Generating Prisma client"

bunx prisma generate >/dev/null 2>&1 || die "prisma generate failed"
ok "Prisma client generated"

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
    bun run scripts/seed.ts 2>&1 | tail -n 30 >&2 || true
    die "db seed failed — see output above"
  fi
else
  step "Step 5/8 — (skipped: --no-seed)"
fi

# ============================================================================
# STEP 6 — Build Next.js production bundle
# ============================================================================
if [[ $DO_BUILD -eq 1 ]]; then
  step "Step 6/8 — Building Next.js standalone production bundle"
  if bun run build >/dev/null 2>&1; then
    ok "standalone build ready at .next/standalone/"
  else
    err "next build failed. Re-running with output:"
    bun run build 2>&1 | tail -n 40 >&2 || true
    die "next build failed — see output above"
  fi
else
  step "Step 6/8 — (skipped: --no-build)"
fi

# ============================================================================
# STEP 7 — Stop any existing server (so re-runs don't serve stale builds)
# ============================================================================
step "Step 7/8 — Clearing port ${APP_PORT}"

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
step "Step 8/8 — Starting production server"

log "starting standalone server (background, logs → server.log)..."
NODE_ENV=production nohup node .next/standalone/server.js > server.log 2>&1 &
echo $! > .server.pid
ok "server PID: $(cat .server.pid)"

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
echo -e "  Database:       ${C_BOLD}SQLite at ${DB_FILE}${C_RESET}"
echo -e "  Admin login:    ${C_BOLD}admin@credora.in / credora@admin123${C_RESET}"
echo -e "  Health:         ${C_BOLD}${HEALTH_URL}${C_RESET}"
echo -e "  Logs:           ${C_BOLD}server.log${C_RESET}"
echo ""
exit 0
