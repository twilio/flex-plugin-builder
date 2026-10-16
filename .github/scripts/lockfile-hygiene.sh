#!/usr/bin/env bash
# Lockfile & resolver-config hygiene gate (ADR 1634 Rule 3b).
#
# Public repos MUST stay resolvable by external consumers: a committed
# lockfile / resolver config that names a Twilio Artifactory host breaks any
# external `npm ci`. Twilio resolution is redirected at build time by config
# (the OIDC action writes ~/.npmrc), never in the repo — so the committed files
# must always point at the public registry.
#
# This script DETECTS violations and fails closed. It does not rewrite files;
# remediation is to regenerate the lockfile against the public registry.
set -euo pipefail

# Known Twilio Artifactory hosts / aliases. Extend as new hosts appear.
PATTERNS='twilio\.jfrog\.io|artifactory\.twilio|artifacts\.twilio|\.artifactory\.twilioinfra|jfrog\.twilio'

# Closed, enumerated detection surface (ADR Rule 3b). npmrc files and every
# committed lockfile / shrinkwrap.
# Portable (no mapfile): newline-delimited, iterated with a while-read loop.
FILES="$(git ls-files | grep -E '(^|/)(package-lock\.json|npm-shrinkwrap\.json|\.npmrc)$' || true)"

if [ -z "$FILES" ]; then
  echo "hygiene: no lockfiles or resolver configs tracked — nothing to check."
  exit 0
fi

count="$(printf '%s\n' "$FILES" | grep -c .)"
echo "hygiene: scanning ${count} file(s) for Twilio Artifactory hosts..."
violations=0
while IFS= read -r f; do
  [ -n "$f" ] || continue
  if hits=$(grep -nEi "$PATTERNS" "$f" 2>/dev/null); then
    violations=1
    echo "::error file=$f::Artifactory host found in $f — public consumers cannot resolve this. Regenerate against the public registry."
    echo "  ── $f"
    echo "$hits" | sed 's/^/     /' | head -8
  fi
  # npm-shrinkwrap.json ships inside the published tarball — extra-loud.
  case "$f" in
    *npm-shrinkwrap.json)
      echo "::warning file=$f::npm-shrinkwrap.json is published in the tarball; any Artifactory host here reaches consumers." ;;
  esac
done <<EOF
$FILES
EOF

if [ "$violations" -ne 0 ]; then
  cat <<'EOF'

✗ Lockfile hygiene FAILED.
  A committed lockfile / resolver config points at a Twilio Artifactory host.
  External consumers cannot resolve against it.

  Fix: regenerate the lockfile against the PUBLIC registry, e.g.
    rm -f ~/.npmrc && npm_config_registry=https://registry.npmjs.org \
      npm install --package-lock-only
  then commit the cleaned lockfile.
EOF
  exit 1
fi

echo "✓ Lockfile hygiene passed — all tracked files resolve against the public registry."
