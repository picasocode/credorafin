#!/usr/bin/env bash
# ============================================================================
# CredoraFin — one-command deploy / update (PM2 + Bun, no Docker)
# ----------------------------------------------------------------------------
# Usage:
#   ./deploy.sh            # full update: pull → install → build → reload
#   ./deploy.sh --no-pull  # skip git pull (build + reload only)
#
# Pinned versions (see .nvmrc, .bun-version, DEPLOY.md):
#   Node 22.11.0 LTS · Bun 1.3.14 · PM2 5.4.2
# ============================================================================
set -euo pipefail

cd "$(dirname "$0")"

# ── Ensure we are on the Node version pinned in .nvmrc ──────────────────────
if command -v nvm >/dev/null 2>&1; then
  nvm use --silent 2>/dev/null || true
elif [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
  nvm use --silent 2>/dev/null || true
fi

LOG_DIR="./logs"
mkdir -p "$LOG_DIR"

step() { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
ok()   { printf "\033[1;32m  ✓ %s\033[0m\n" "$1"; }

PULL=1
[[ "${1:-}" == "--no-pull" ]] && PULL=0

# Pre-flight: PM2 must be installed
if ! command -v pm2 >/dev/null 2>&1; then
  echo "✖ pm2 not found. Install it once with:"
  echo "    npm install -g pm2@5.4.2"
  exit 1
fi

if [[ "$PULL" == "1" ]]; then
  step "Pulling latest code"
  git pull --ff-only
  ok "up to date"
fi

step "Installing dependencies"
# Reset any local lockfile drift so we install exactly what's committed.
# A prior non-frozen `bun install` on the server can leave bun.lock modified
# in the working tree, which `git pull --ff-only` preserves — causing
# `--frozen-lockfile` to fail. `git checkout -- bun.lock` restores the
# committed version so the frozen check passes deterministically.
# Falls back to a regular install only if the committed lockfile itself
# needs reconciliation (e.g. package.json was updated but lockfile wasn't).
git checkout -- bun.lock 2>/dev/null || true
if ! bun install --frozen-lockfile; then
  echo "  ⚠ frozen lockfile mismatch — reconciling with regular install..."
  bun install
fi
ok "dependencies ready"

step "Generating Prisma client"
bunx prisma generate
ok "prisma client generated"

step "Syncing database schema (db push)"
bunx prisma db push --skip-generate
ok "schema in sync"

step "Building Next.js (standalone output)"
bun run build
ok "build complete"

step "Reloading PM2 app (zero-downtime)"
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
ok "app reloaded & process list saved"

step "Health check"
sleep 3
if curl -sf http://127.0.0.1:3000/api/health >/dev/null 2>&1; then
  ok "http://127.0.0.1:3000/api/health → 200 OK"
else
  echo "  ⚠ health check did not return 200 yet — check: pm2 logs credorafin"
fi

cat <<EOF

  ┌──────────────────────────────────────────────┐
  │  ✅ Deploy complete                           │
  │  App:   http://localhost:3000                 │
  │  Logs:  pm2 logs credorafin                   │
  │  Stats: pm2 status                            │
  │  Monit: pm2 monit                             │
  └──────────────────────────────────────────────┘
EOF
