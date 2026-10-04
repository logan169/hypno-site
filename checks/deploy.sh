#!/usr/bin/env bash
# deploy.sh — build → gate (local) → push → gate (live).
# Refuses to push if the local gate is RED. Refuses to declare success
# if the live gate is RED after push.
set -euo pipefail

cd "$(dirname "$0")/.."
REPO_URL="${REPO_URL:-https://github.com/logan169/hypno-site}"
LIVE_URL="${LIVE_URL:-https://logan169.github.io/hypno-site}"
IMAGE="${JEKYLL_IMAGE:-jekyll/jekyll:latest}"
POLL_SECS="${POLL_SECS:-120}"

log(){ printf '▸ %s\n' "$*" >&2; }
err(){ printf '✚ %s\n' "$*" >&2; }
die(){ err "$@"; exit 1; }

[ -d ".git" ] || die "not a git repo here (cd to the repo root or set WORKDIR?)"

# ── 1. Build ──────────────────────────────────────────────────
log "jekyll build (docker)"
rm -rf _site .jekyll-cache
docker run --rm -v "$PWD":/srv -w /srv "$IMAGE" jekyll build \
  | grep -E "Generating|done|Error|Liquid" \
  || true
[ -d "_site" ] || die "build produced no _site/"
[ -f "_site/index.html" ] || die "build produced no _site/index.html"

# ── 2. Local gate ─────────────────────────────────────────────
log "local gate"
if ! python3 checks/pagegate.py local _site; then
  die "local gate is RED — refusing to push. Fix the issues above, then re-run."
fi

# ── 3. Diff check ────────────────────────────────────────────
git add -A assets/ _includes/ _layouts/ . *.md 2>/dev/null || true
if git diff --cached --quiet; then
  log "no changes to commit — local gate already passes. Pushing to trigger re-deploy if needed."
fi

if [ "${1:-}" = "--no-push" ]; then
  log "--no-push flag set — stopping before push."
  exit 0
fi

# ── 4. Commit + push (only if there are changes) ────────────
if ! git diff --cached --quiet; then
  TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  SUBJ="${COMMIT_SUBJECT:-deploy: site changes gated ${TS}}"
  git commit -q -m "$SUBJ"
  log "committed $(git rev-parse --short HEAD) — pushing"
  git push origin HEAD:main
else
  log "nothing to commit — no push"
fi

# ── 5. Poll + live gate ─────────────────────────────────────
log "polling live build up to ${POLL_SECS}s"
deadline=$(( $(date +%s) + POLL_SECS ))
ready=0
while [ "$(date +%s)" -lt "$deadline" ]; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$LIVE_URL" 2>/dev/null || echo 000)
  if [ "$code" = "200" ]; then
    # Also verify the CSS file has our new rules (proxy for "fresh build")
    if curl -s "$LIVE_URL/assets/css/marion.css" 2>/dev/null | grep -q 'ec-hero\|revue-close-intro\|footer-brand'; then
      ready=1
      break
    fi
  fi
  sleep 8
done
[ "$ready" = "1" ] || err "live not ready in ${POLL_SECS}s — running live gate anyway (may be a stale build)"

log "LIVE gate"
python3 checks/pagegate.py live "$LIVE_URL" || die "LIVE gate is RED — the deployed site still has issues. Check manually."

echo
echo "✓ deploy.sh: GREEN pre-push + GREEN live"
