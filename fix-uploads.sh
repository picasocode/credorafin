#!/usr/bin/env bash
# ============================================================================
# CredoraFin — One-shot upload fix script
# ----------------------------------------------------------------------------
# Run this ONCE on the server to fix all upload-related issues:
#   1. Creates upload directories with correct permissions
#   2. Fixes the nginx /uploads/ alias (points to public/uploads/ instead of
#      .next/standalone/public/uploads/)
#   3. Reloads nginx
#
# This does NOT rebuild the app. It only fixes the filesystem + nginx config
# so that uploads work immediately. Run after pulling the latest code.
#
# Usage:  sudo ./fix-uploads.sh
# ============================================================================
set -euo pipefail
cd "$(dirname "$0")"

step()  { printf "\n\033[1;36m▶ %s\033[0m\n" "$1"; }
ok()    { printf "\033[1;32m  ✓ %s\033[0m\n" "$1"; }
warn()  { printf "\033[1;33m  ⚠ %s\033[0m\n" "$1"; }
err()   { printf "\033[1;31m  ✖ %s\033[0m\n" "$1"; }

DOMAIN="credorafin.com"
NGINX_SITE_FILE="/etc/nginx/sites-available/${DOMAIN}"
APP_ROOT="$(pwd)"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  CredoraFin — Upload Fix Script"
echo "  App root: $APP_ROOT"
echo "═══════════════════════════════════════════════════════════════"

# ── 1. Create upload directories ─────────────────────────────────────────────
step "Creating upload directories"
UPLOAD_BUCKETS="brochures hero-slides blog pages products misc"
for bucket in $UPLOAD_BUCKETS; do
  mkdir -p "public/uploads/$bucket"
  [ -f "public/uploads/$bucket/.gitkeep" ] || touch "public/uploads/$bucket/.gitkeep"
done
ok "dirs ready: $(echo public/uploads/*/ | tr '\n' ' ')"

# ── 2. Fix filesystem permissions ────────────────────────────────────────────
step "Fixing filesystem permissions"
HOME_DIR="$(eval echo ~"${SUDO_USER:-${USER:-$(whoami)}}")"

# Home dir traversal (nginx needs to reach the project)
if [ -d "$HOME_DIR" ]; then
  chmod o+x "$HOME_DIR" && ok "traversal on ${HOME_DIR}" || warn "could not chmod ${HOME_DIR}"
fi

# Project dir traversal
chmod o+x "$APP_ROOT" && ok "traversal on project root"

# Read permissions on all served dirs
chmod -R o+rX .next/standalone 2>/dev/null && ok ".next/standalone readable" || warn "chmod standalone failed"
chmod -R o+rX public 2>/dev/null && ok "public readable" || warn "chmod public failed"
chmod -R o+rX public/uploads 2>/dev/null && ok "public/uploads readable" || warn "chmod uploads failed"

# Verify www-data can read uploads
if [ -n "$(ls -A public/uploads/brochures 2>/dev/null)" ]; then
  TEST_FILE="$(ls public/uploads/brochures/* 2>/dev/null | head -1)"
  if [ -f "$TEST_FILE" ] && sudo -u www-data test -r "$TEST_FILE" 2>/dev/null; then
    ok "www-data can read: $(basename "$TEST_FILE")"
  else
    warn "www-data cannot read $TEST_FILE"
    warn "  manual fix: sudo chmod -R o+rX public/uploads"
  fi
fi

# ── 3. Fix nginx /uploads/ alias ─────────────────────────────────────────────
step "Fixing nginx /uploads/ alias"

if ! command -v nginx >/dev/null 2>&1; then
  warn "nginx not installed — skipping nginx config fix"
elif [ ! -f "$NGINX_SITE_FILE" ]; then
  warn "nginx site config not found: $NGINX_SITE_FILE"
  warn "  run: ./deploy.sh --nginx  (first-time nginx setup)"
else
  # Check if the /uploads/ alias is pointing to the wrong place
  if sudo grep -q 'alias.*\.next/standalone/public/uploads/' "$NGINX_SITE_FILE" 2>/dev/null; then
    warn "nginx /uploads/ alias is WRONG (points to .next/standalone/public/uploads/)"
    echo "  Fixing to point to public/uploads/ (where the app writes files)..."

    # Replace the standalone path with the source path
    sudo sed -i \
      "s|alias ${APP_ROOT}/.next/standalone/public/uploads/;|alias ${APP_ROOT}/public/uploads/;|g" \
      "$NGINX_SITE_FILE"

    # Also handle the case where __APP_ROOT__ wasn't substituted
    sudo sed -i \
      's|alias __APP_ROOT__/.next/standalone/public/uploads/;|alias __APP_ROOT__/public/uploads/;|g' \
      "$NGINX_SITE_FILE"

    ok "nginx /uploads/ alias updated"

    # Test config
    if sudo nginx -t 2>/dev/null; then
      sudo systemctl reload nginx
      ok "nginx reloaded"
    else
      err "nginx config test FAILED — check: sudo nginx -t"
      err "  the config was modified but not reloaded. Fix manually."
      exit 1
    fi
  elif sudo grep -q 'alias.*public/uploads/;' "$NGINX_SITE_FILE" 2>/dev/null; then
    ok "nginx /uploads/ alias already correct (points to public/uploads/)"
  else
    warn "could not find /uploads/ alias in nginx config — check manually:"
    warn "  sudo grep uploads $NGINX_SITE_FILE"
  fi
fi

# ── 4. Summary ───────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ Upload fix complete"
echo ""
echo "  Upload directories:"
for bucket in $UPLOAD_BUCKETS; do
  COUNT=$(ls -1 "public/uploads/$bucket" 2>/dev/null | grep -v '.gitkeep' | wc -l)
  echo "    public/uploads/$bucket/ ($COUNT file(s))"
done
echo ""
echo "  Next steps:"
echo "    1. Pull latest code:  git pull --ff-only"
echo "    2. Deploy:            sudo ./deploy-ui.sh"
echo "    3. Test uploads in the admin panel"
echo "═══════════════════════════════════════════════════════════════"
echo ""
