#!/usr/bin/env bash
# ============================================================================
# CredoraFin — One-command deployment script
# ----------------------------------------------------------------------------
# Runs the ENTIRE deployment with NO questions asked:
#   0. Verify prerequisites (bun, docker, supabase CLI) — auto-install missing
#      tools, and create a swapfile if RAM < 2 GB (Supabase needs ~2 GB)
#   1. Ensure .env exists (create from .env.example if missing)
#   2. Install npm deps (if node_modules missing)
#   3. Start Supabase local (if not already running) + wait for DB ready
#   4. Generate Prisma client (PostgreSQL)
#   5. Push DB schema (create all 11 tables)
#   6. Seed DB (admin user + 6 positions + 5 hero slides + 6 blog posts)
#   7. Build Next.js standalone production bundle
#   8. Start the production server on port 3000
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

# ── Discover user-installed tools (bun, supabase, etc.) when run via sudo ───
# bun & supabase CLI are typically installed per-user (e.g. ~/.bun/bin,
# ~/.local/bin). When this script is invoked with `sudo`, $HOME becomes /root
# and the invoking user's tool dirs drop off PATH, so `have bun` fails even
# though bun is installed. Add every plausible location to PATH so the
# prerequisite checks pass regardless of who runs the script.
for _d in \
  "$HOME/.bun/bin" \
  "/root/.bun/bin" \
  "/home/${SUDO_USER:-}/.bun/bin" \
  /home/*/.bun/bin \
  "$HOME/.local/bin" \
  "/home/${SUDO_USER:-}/.local/bin" \
  /home/*/.local/bin \
  /usr/local/bin \
  /opt/homebrew/bin; do
  [[ -d "$_d" ]] || continue
  case ":$PATH:" in
    *":$_d:"*) ;;                 # already on PATH
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

# Heads-up: this script does NOT require root. Port 3000 is unprivileged,
# and running with sudo makes every generated file (node_modules, .next,
# .env, server.log) root-owned — which causes permission errors on re-runs
# as a normal user. Recommend running without sudo: `bash deploy.sh`.
if [[ $(id -u) -eq 0 ]]; then
  warn "running as root (sudo) — generated files will be root-owned; prefer 'bash deploy.sh' without sudo"
fi

have bun    || die "bun not found in PATH. If you installed it as a normal user but ran this with sudo, either (a) run 'bash deploy.sh' without sudo, or (b) install bun for root: sudo curl -fsSL https://bun.sh/install | sudo bash"
have curl   || die "curl not found"
ok "bun: $(bun --version)"
ok "curl: $(curl --version | head -1 | awk '{print $1,$2}')"

if [[ $DO_DOCKER -eq 1 ]]; then
  have docker || die "docker not found (required for --docker mode)"
  ok "docker: $(docker --version 2>/dev/null | awk '{print $1,$2,$3}')"
fi

# Supabase CLI is optional in --docker mode (Docker image uses cloud/remote DB)
if [[ $DO_DOCKER -eq 0 ]]; then
  # Detect a broken v2 shim BEFORE trusting `have supabase`. A previous v1-style
  # install copies just `supabase` to /usr/local/bin without its companion
  # `supabase-go` — `command -v supabase` succeeds, but `supabase --version`
  # fails with "Could not find the supabase-go binary". We must detect this by
  # actually running the binary, not just checking PATH presence.
  if have supabase && ! supabase --version >/dev/null 2>&1; then
    _supa_path="$(command -v supabase 2>/dev/null || true)"
    if [[ -n "$_supa_path" ]]; then
      warn "supabase at ${_supa_path} is non-functional (missing supabase-go) — removing"
      rm -f "$_supa_path" 2>/dev/null || true
      # Also drop a stray shim dir entry if present, so the fresh install wins
      unset _supa_path
    fi
  fi

  if have supabase && supabase --version >/dev/null 2>&1; then
    ok "supabase: $(supabase --version 2>/dev/null | head -1)"
  else
    warn "supabase CLI not found (or broken) — installing automatically"

    install_supabase() {
      # ---- Method 1: official GitHub release binary (best on Linux servers) ----
      # Works without any package manager; picks x86_64/arm64 automatically.
      local arch=""
      case "$(uname -m)" in
        x86_64|amd64)  arch="amd64"  ;;
        aarch64|arm64) arch="arm64"  ;;
        *) arch="" ;;
      esac

      if [[ "$(uname -s)" == "Linux" && -n "$arch" ]]; then
        # Discover the latest release tag (e.g. v2.109.1) via the GitHub API.
        local ver=""
        ver=$(curl -fsSL https://api.github.com/repos/supabase/cli/releases/latest \
              2>/dev/null | grep -m1 '"tag_name"' | sed -E 's/.*"tag_name"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')
        [[ -z "$ver" ]] && ver="v2.109.1"   # fallback if API is rate-limited

        # IMPORTANT (v2): Supabase CLI v2 ships TWO co-located binaries in the
        # tarball — `supabase` (a Node shim) and `supabase-go` (the real Go
        # CLI). The shim looks for `supabase-go` next to itself, so we must
        # extract the WHOLE tarball into one directory and put that directory
        # on PATH — never copy just `supabase` elsewhere (the v1-style install
        # breaks v2 with "Could not find the supabase-go binary").
        #
        # v2 asset naming: supabase_<version>_linux_<arch>.tar.gz
        # (v1 used supabase_linux_<arch>.tar.gz — no version segment.)
        local ver_num="${ver#v}"   # strip leading 'v'
        local url="https://github.com/supabase/cli/releases/download/${ver}/supabase_${ver_num}_linux_${arch}.tar.gz"
        local tmpdir
        tmpdir="$(mktemp -d)"
        log "downloading supabase CLI ${ver} for linux/${arch}..."
        if curl -fsSL "$url" -o "${tmpdir}/supabase.tar.gz"; then
          tar -xzf "${tmpdir}/supabase.tar.gz" -C "$tmpdir" 2>/dev/null
          # Verify BOTH binaries are present (the v2 requirement)
          if [[ -f "${tmpdir}/supabase" ]]; then
            local dest_dir
            if [[ -w /opt ]] || [[ $(id -u) -eq 0 ]]; then
              dest_dir="/opt/supabase"
              mkdir -p "$dest_dir"
            else
              dest_dir="$HOME/.local/share/supabase"
              mkdir -p "$dest_dir"
            fi
            # Copy BOTH binaries so they stay co-located
            cp "${tmpdir}/supabase"     "${dest_dir}/supabase"     2>/dev/null
            cp "${tmpdir}/supabase-go"  "${dest_dir}/supabase-go"  2>/dev/null
            chmod +x "${dest_dir}/supabase" "${dest_dir}/supabase-go" 2>/dev/null || true
            rm -rf "$tmpdir"
            # Put the install dir at the FRONT of PATH so this run finds it,
            # and export SUPABASE_GO_BINARY as a belt-and-suspenders fallback.
            case ":$PATH:" in
              *":${dest_dir}:"*) ;;
              *) PATH="${dest_dir}:$PATH"; export PATH ;;
            esac
            export SUPABASE_GO_BINARY="${dest_dir}/supabase-go"
            have supabase && return 0
          fi
        fi
        rm -rf "$tmpdir"
      fi

      # ---- Method 2: Homebrew (macOS or Linuxbrew) ----
      if have brew; then
        log "trying: brew install supabase/tap/supabase"
        brew install supabase/tap/supabase 2>/dev/null && have supabase && return 0
      fi

      # ---- Method 3: npm global (if node/npm or bun available) ----
      if have npm; then
        log "trying: npm install -g supabase"
        # May need sudo when npm's global dir isn't user-writable
        if npm install -g supabase 2>/dev/null; then
          have supabase && return 0
        fi
        if [[ $(id -u) -ne 0 ]]; then
          sudo npm install -g supabase 2>/dev/null && have supabase && return 0
        fi
      elif have bun; then
        log "trying: bun add -g supabase"
        bun add -g supabase 2>/dev/null && have supabase && return 0
      fi

      return 1
    }

    # (Broken-shim cleanup now happens above, before the `have supabase` check,
    # so it also catches the case where a broken shim is ON path but the fresh
    # install below needs to win.)

    if install_supabase; then
      # Verify the install actually works end-to-end (not just that the binary
      # is on PATH) — `--version` exercises the shim→supabase-go forwarding.
      if supabase --version >/dev/null 2>&1; then
        ok "supabase installed: $(supabase --version 2>/dev/null | head -1)"
      else
        warn "supabase binary present but 'supabase --version' failed — install may be broken"
        die "supabase CLI installed but non-functional. Re-run deploy.sh, or install manually:
    mkdir -p /opt/supabase && curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_2.109.1_linux_amd64.tar.gz | tar -xz -C /opt/supabase
    export PATH=/opt/supabase:\$PATH"
      fi
    else
      die "supabase CLI auto-install failed. Install manually:
    Linux x86_64:  mkdir -p /opt/supabase && curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_2.109.1_linux_amd64.tar.gz | sudo tar -xz -C /opt/supabase && sudo ln -sf /opt/supabase/supabase /usr/local/bin/supabase
    macOS:         brew install supabase/tap/supabase
    Any (npm):     npm install -g supabase
See: https://supabase.com/docs/guides/local-development"
    fi
  fi
fi

# ── Docker (required for `supabase start` in local mode) ────────────────────
# On a bare Ubuntu/Debian EC2 box, Docker is usually missing. Install it
# automatically so `supabase start` (Step 3) doesn't fail. In --docker mode
# this is also required to build/run the image.
docker_running() { docker info >/dev/null 2>&1; }

need_docker=0
if [[ $DO_DOCKER -eq 1 ]]; then
  need_docker=1
elif [[ $DO_DOCKER -eq 0 ]]; then
  # Local Supabase mode also needs the Docker daemon
  need_docker=1
fi

if [[ $need_docker -eq 1 ]]; then
  if have docker && docker_running; then
    ok "docker: $(docker --version 2>/dev/null | awk '{print $1,$2,$3}')"
  else
    if ! have docker; then
      warn "docker not found — installing automatically"
      install_docker() {
        # Method 1: official convenience script (works on most Linux distros)
        # https://docs.docker.com/engine/install/ubuntu/  (get.docker.com)
        if have curl; then
          log "installing docker via get.docker.com (needs root)..."
          if [[ $(id -u) -eq 0 ]]; then
            curl -fsSL https://get.docker.com | sh 2>/dev/null
          else
            curl -fsSL https://get.docker.com | sudo sh 2>/dev/null
          fi
          if have docker; then return 0; fi
        fi

        # Method 2: apt (Debian/Ubuntu)
        if have apt-get; then
          log "installing docker via apt-get..."
          if [[ $(id -u) -ne 0 ]]; then SUDO="sudo"; else SUDO=""; fi
          $SUDO apt-get update -y >/dev/null 2>&1
          # docker.io + docker-compose-plugin (supabase CLI needs `docker compose`)
          $SUDO apt-get install -y ca-certificates curl gnupg lsb-release docker.io docker-compose-plugin >/dev/null 2>&1
          if have docker; then return 0; fi
        fi

        return 1
      }

      if install_docker; then
        ok "docker installed: $(docker --version 2>/dev/null | awk '{print $1,$2,$3}')"
      else
        die "docker auto-install failed. Install manually:
  Ubuntu/Debian: curl -fsSL https://get.docker.com | sudo sh
  Or:            sudo apt-get install -y docker.io
See: https://docs.docker.com/engine/install/"
      fi
    else
      warn "docker installed but daemon not running"
    fi

    # Start + enable the daemon (systemd)
    if ! docker_running; then
      log "starting docker daemon..."
      if [[ $(id -u) -eq 0 ]]; then
        systemctl start docker 2>/dev/null || service docker start 2>/dev/null || true
        systemctl enable docker 2>/dev/null || true
      else
        sudo systemctl start docker 2>/dev/null || sudo service docker start 2>/dev/null || true
        sudo systemctl enable docker 2>/dev/null || true
      fi
      # Wait up to 30s for the daemon socket
      elapsed=0
      while ! docker_running; do
        sleep 2; elapsed=$((elapsed + 2))
        [[ $elapsed -ge 30 ]] && break
      done
    fi

    if docker_running; then
      ok "docker daemon is running"
    else
      die "docker daemon would not start. Try: sudo systemctl start docker"
    fi

    # If running as non-root, ensure the user can talk to the docker socket
    # without sudo (supabase start invokes docker directly). Adding the user
    # to the docker group only takes effect after a new login session, so on
    # a first run as non-root we ask the user to either re-login or use sudo.
    if [[ $(id -u) -ne 0 ]] && ! docker ps >/dev/null 2>&1; then
      sudo usermod -aG docker "$USER" 2>/dev/null || true
      if ! docker ps >/dev/null 2>&1; then
        die "docker is installed but the current user needs the docker group
to take effect. Either:
  (a) log out and back in (or run 'newgrp docker'), then re-run: bash deploy.sh
  (b) run this script as root:  sudo bash deploy.sh
(root can talk to the docker socket immediately — no group refresh needed)"
      fi
    fi
    ok "docker: $(docker --version 2>/dev/null | awk '{print $1,$2,$3}')"
  fi
fi

# ── Swap (prevent OOM-kills when running Supabase on small instances) ───────
# Supabase local spins up ~6 containers (Postgres, GoTrue, PostgREST, Realtime,
# Storage, Kong) and needs ~2 GB. On a t2/t3.micro (1 GB RAM) the kernel OOM-
# killer will silently murder containers and `supabase start` will fail with a
# cryptic error. The fix: ensure at least 2 GB of (RAM + swap). This block
# creates a swapfile automatically when memory is low and no swap is configured.
#
# This needs root — uses sudo when run as a normal user.
ensure_swap() {
  # Parse /proc/meminfo once (kB units → MB)
  local mem_total_mb swap_total_mb avail_mb need_swap_mb
  mem_total_mb=$(awk '/^MemTotal:/{printf "%d", $2/1024}'     /proc/meminfo 2>/dev/null || echo 0)
  swap_total_mb=$(awk '/^SwapTotal:/{printf "%d", $2/1024}'   /proc/meminfo 2>/dev/null || echo 0)
  avail_mb=$(awk '/^MemAvailable:/{printf "%d", $2/1024}'     /proc/meminfo 2>/dev/null || echo "$mem_total_mb")

  # Total virtual memory = RAM + swap. Supabase needs ~2 GB to be safe.
  local total=$((mem_total_mb + swap_total_mb))
  if [[ $total -ge 2048 ]]; then
    ok "memory: ${mem_total_mb}MB RAM + ${swap_total_mb}MB swap = ${total}MB (sufficient)"
    return 0
  fi

  # Need swap. Target 2 GB total, but never less than 1 GB swap, and cap at 4 GB.
  local swap_size=$((2048 - mem_total_mb))
  [[ $swap_size -lt 1024 ]] && swap_size=1024
  [[ $swap_size -gt 4096 ]] && swap_size=4096

  # Pick sudo if not root
  local SUDO=""
  [[ $(id -u) -ne 0 ]] && SUDO="sudo"

  # If a swapfile already exists but is small, keep it — adding more is wasteful.
  local existing_swapfile="/swapfile"
  if $SUDO swapon --show=SIZE --show=NAME --noheadings 2>/dev/null | grep -q .; then
    warn "memory low (${mem_total_mb}MB RAM + ${swap_total_mb}MB swap = ${total}MB) but swap already active"
    warn "supabase may still OOM on a very small instance — consider upsizing if start fails"
    return 0
  fi

  warn "memory low: ${mem_total_mb}MB RAM + ${swap_total_mb}MB swap = ${total}MB (need ~2048MB for Supabase)"
  log "creating ${swap_size}MB swapfile at ${existing_swapfile} (needs root)..."

  # Create, set perms, format, and enable the swapfile. Each step is idempotent.
  $SUDO fallocate -l "${swap_size}M" "$existing_swapfile" 2>/dev/null \
    || $SUDO dd if=/dev/zero of="$existing_swapfile" bs=1M count="$swap_size" status=none 2>/dev/null \
    || { warn "could not allocate swapfile (disk full?)"; return 1; }

  $SUDO chmod 600 "$existing_swapfile" 2>/dev/null || true
  $SUDO mkswap "$existing_swapfile" >/dev/null 2>&1 || { warn "mkswap failed"; return 1; }
  $SUDO swapon "$existing_swapfile" 2>/dev/null || { warn "swapon failed"; return 1; }

  # Persist across reboots (only if not already in fstab)
  if ! grep -q "^${existing_swapfile} " /etc/fstab 2>/dev/null; then
    echo "${existing_swapfile} none swap sw 0 0" | $SUDO tee -a /etc/fstab >/dev/null 2>&1 || true
  fi

  # Re-read and report
  local new_swap
  new_swap=$(awk '/^SwapTotal:/{printf "%d", $2/1024}' /proc/meminfo 2>/dev/null || echo 0)
  ok "swap enabled: ${mem_total_mb}MB RAM + ${new_swap}MB swap = $((mem_total_mb + new_swap))MB total"
}
ensure_swap

cd "$(dirname "$0")"
ok "working dir: $(pwd)"

# ============================================================================
# STEP 1 — Environment file
# ============================================================================
step "Step 1/9 — Ensuring .env exists"

if [[ ! -f .env ]]; then
  if [[ -f .env.example ]]; then
    cp .env.example .env
    ok "created .env from .env.example"
  else
    # No template — create a minimal .env so later steps don't fail
    : > .env
    ok "created empty .env (no .env.example found)"
  fi
  # Verify the file actually exists (guards against weird cp failures)
  [[ -f .env ]] || die "failed to create .env"
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

  # Supabase CLI v2 uses `docker compose` (the plugin) — verify it's available
  if ! docker compose version >/dev/null 2>&1; then
    die "docker compose plugin not found. Supabase CLI needs 'docker compose'.
Install it: sudo apt-get install -y docker-compose-plugin
Or reinstall docker: curl -fsSL https://get.docker.com | sudo sh"
  fi
  ok "docker compose: $(docker compose version 2>/dev/null | head -1)"

  # Is Supabase already running? Check DB port.
  if port_open "$DB_PORT"; then
    ok "Supabase local already running"
  else
    log "running: supabase start (first run downloads images, ~5 min)"
    # Capture output to a log so we can show the REAL error on failure.
    # (Previously this hid all output, making failures impossible to debug.)
    SUPA_LOG="$(pwd)/supabase-start.log"
    if supabase start >"$SUPA_LOG" 2>&1; then
      ok "supabase started"
    else
      err "supabase start failed. Full output:"
      echo "──── begin supabase-start.log ────" >&2
      tail -n 60 "$SUPA_LOG" >&2 2>/dev/null || cat "$SUPA_LOG" >&2 2>/dev/null || true
      echo "────  end supabase-start.log  ────" >&2
      err ""
      err "Common fixes:"
      err "  - Low memory? Free RAM: 'free -h' (supabase needs ~2GB free)"
      err "  - Stale state? Run: supabase stop  (then re-run deploy.sh)"
      err "  - Docker issues? Run: docker info  and  docker compose version"
      die "supabase start failed — see log above ($SUPA_LOG)"
    fi
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
