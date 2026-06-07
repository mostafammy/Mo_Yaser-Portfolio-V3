#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# mostafayaser.earth — Release Ceremony Script
# Usage: bash scripts/release.sh <version> "<codename>"
#
# Example:
#   bash scripts/release.sh 1.0.0 "Polished Glass"
#
# What this does (in order):
#   1. Validates inputs and working tree
#   2. Bumps version in package.json
#   3. Reminds you to update CHANGELOG.md (opens it in $EDITOR)
#   4. Commits with a conventional message
#   5. Creates an annotated git tag
#   6. Pushes the tag to origin
#   7. Creates a GitHub release via `gh` (optional — skipped if gh not found)
#   8. Prints a social post template to stdout
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

# ── Args ─────────────────────────────────────────────────────────────────────
VERSION="${1:-}"
CODENAME="${2:-}"

if [[ -z "$VERSION" || -z "$CODENAME" ]]; then
  echo "Usage: bash scripts/release.sh <version> \"<codename>\""
  echo "  e.g. bash scripts/release.sh 1.0.0 \"Polished Glass\""
  exit 1
fi

TAG="v${VERSION}"

# ── Helpers ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RESET='\033[0m'
step()  { echo -e "\n${CYAN}▸ $*${RESET}"; }
ok()    { echo -e "  ${GREEN}✓ $*${RESET}"; }
warn()  { echo -e "  ${YELLOW}⚠ $*${RESET}"; }
abort() { echo -e "\n${RED}✗ $*${RESET}"; exit 1; }

echo -e "\n${CYAN}━━━ Release Ceremony — ${TAG} \"${CODENAME}\" ━━━${RESET}"

# ── 1. Pre-flight checks ──────────────────────────────────────────────────────
step "Pre-flight checks"

# Must be on main (or master)
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$BRANCH" != "main" && "$BRANCH" != "master" ]]; then
  abort "Must be on main/master to release. Current branch: $BRANCH"
fi
ok "On branch: $BRANCH"

# Working tree must be clean
if ! git diff --quiet || ! git diff --cached --quiet; then
  abort "Working tree is dirty. Commit or stash changes first."
fi
ok "Working tree is clean"

# Tag must not already exist
if git rev-parse "$TAG" &>/dev/null; then
  abort "Tag $TAG already exists. Did you mean a different version?"
fi
ok "Tag $TAG is free"

# ── 2. Bump version in package.json ──────────────────────────────────────────
step "Bumping version in package.json → $VERSION"

# Use node to avoid sed cross-platform issues
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.version = '${VERSION}';
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"
ok "package.json version = $VERSION"

# ── 3. CHANGELOG prompt ───────────────────────────────────────────────────────
step "CHANGELOG.md"
echo ""
echo "  Open CHANGELOG.md now and:"
echo "  • Move the [Unreleased] content into a new ## [$VERSION] — $(date +%Y-%m-%d) block"
echo "  • Clear the [Unreleased] section"
echo "  • Update the comparison link footer"
echo ""
read -rp "  Press ENTER when CHANGELOG.md is ready, or Ctrl-C to abort… "
ok "CHANGELOG acknowledged"

# ── 4. Stage and commit ───────────────────────────────────────────────────────
step "Creating release commit"
git add package.json CHANGELOG.md
git commit -m "chore: release ${TAG} — ${CODENAME}"
ok "Committed: chore: release ${TAG} — ${CODENAME}"

# ── 5. Annotated tag ─────────────────────────────────────────────────────────
step "Tagging $TAG"
git tag -a "$TAG" -m "${TAG} — ${CODENAME}"
ok "Tagged: $TAG"

# ── 6. Push tag ───────────────────────────────────────────────────────────────
step "Pushing tag to origin"
git push origin "$TAG"
ok "Pushed: origin/$TAG"

# ── 7. GitHub Release (optional) ─────────────────────────────────────────────
step "GitHub Release"
if command -v gh &>/dev/null; then
  echo "  Creating release via gh CLI…"
  gh release create "$TAG" \
    --title "${TAG} — ${CODENAME}" \
    --notes-file CHANGELOG.md
  ok "GitHub release created: https://github.com/mostafammy/Mo_Yaser-Portfolio-V3/releases/tag/${TAG}"
else
  warn "gh CLI not found — skipping GitHub release."
  warn "Install: https://cli.github.com  then run:"
  warn "  gh release create ${TAG} --title \"${TAG} — ${CODENAME}\" --notes-file CHANGELOG.md"
fi

# ── 8. Social post template ──────────────────────────────────────────────────
echo ""
echo -e "${CYAN}━━━ Social Post Template ━━━${RESET}"
cat <<EOF

Shipped ${TAG} of mostafayaser.earth — "${CODENAME}".

Here's what I built and what I learned:
→ [pick 1–2 specific things from the CHANGELOG that have a real story]

Live: https://mostafayaser.earth
Repo: https://github.com/mostafammy/Mo_Yaser-Portfolio-V3

(Not "check out my portfolio" — tell the story of what you built.)

EOF

echo -e "${GREEN}━━━ Release ${TAG} complete. ━━━${RESET}\n"
