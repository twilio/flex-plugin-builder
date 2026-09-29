#!/usr/bin/env bash
#
# Reports which packages have an npm trusted publisher configured, for all of
# them in one run, without publishing anything.
#
# The token exchange npm performs is per package: it POSTs to
# /-/npm/v1/oidc/token/exchange/package/<name>, and a package with no trusted
# publisher record comes back 404 "OIDC token exchange error - package not
# found". A real publish therefore only ever reveals the first unregistered
# package before aborting, which costs a run per package.
#
# This drives `npm publish --dry-run`, so the exchange is done by npm itself
# rather than reverse-engineered here, and nothing is ever uploaded.

set -uo pipefail

registered=()
missing=()
unclear=()

for dir in packages/*/; do
  [ -f "${dir}package.json" ] || continue

  name=$(node -p "require('./${dir}package.json').name")
  if [ "$(node -p "require('./${dir}package.json').private === true")" = "true" ]; then
    echo "skipping ${name}: private"
    continue
  fi

  out=$(
    cd "$dir" || exit 1
    npm publish \
      --dry-run \
      --registry https://registry.npmjs.org \
      --access public \
      --ignore-scripts \
      --provenance \
      --loglevel verbose 2>&1
  )

  oidc=$(grep -m1 'npm verbose oidc' <<<"$out" || true)

  if grep -q 'package not found' <<<"$out"; then
    missing+=("$name")
    echo "NOT REGISTERED  ${name}"
  elif [ -n "$oidc" ] && ! grep -q 'Failed token exchange' <<<"$out"; then
    registered+=("$name")
    echo "registered      ${name}"
  else
    # Either npm never attempted an exchange, or it failed for some other
    # reason. Keep the line so the cause is visible rather than guessed at.
    detail=$(grep -m1 'npm error code\|Failed token exchange' <<<"$out" || echo 'no oidc line in output')
    unclear+=("${name} :: ${detail}")
    echo "INCONCLUSIVE    ${name} :: ${detail}"
  fi
done

summary=$(
  printf 'Trusted publisher preflight (no packages were published)\n\n'
  printf '  registered:    %s\n' "${#registered[@]}"
  printf '  NOT registered: %s\n' "${#missing[@]}"
  printf '  inconclusive:  %s\n' "${#unclear[@]}"
  if [ "${#missing[@]}" -gt 0 ]; then
    printf '\nPackages needing a trusted publisher on npmjs.com:\n'
    printf '  %s\n' "${missing[@]}"
  fi
  if [ "${#unclear[@]}" -gt 0 ]; then
    printf '\nInconclusive:\n'
    printf '  %s\n' "${unclear[@]}"
  fi
)

echo
echo "$summary"
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  {
    printf '## npm trusted publishing preflight\n\n```\n'
    printf '%s\n' "$summary"
    printf '```\n'
  } >> "$GITHUB_STEP_SUMMARY"
fi

if [ "${#missing[@]}" -gt 0 ]; then
  echo "::error::${#missing[@]} package(s) have no npm trusted publisher configured"
  exit 1
fi
