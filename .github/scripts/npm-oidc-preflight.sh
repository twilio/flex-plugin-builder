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

  # Always print the evidence, whatever the verdict. Reporting a conclusion
  # without the registry's own words made an earlier run useless: twelve
  # identical verdicts with no oidc line anywhere, and no way afterwards to
  # tell a real answer from a misclassification.
  oidc=$(grep -m1 'oidc' <<<"$out" || true)
  exchange=$(grep -m1 'oidc/token/exchange' <<<"$out" || true)
  errcode=$(grep -m1 'npm error code' <<<"$out" || true)
  echo "--- ${name}"
  echo "    exchange : ${exchange:-<none attempted>}"
  echo "    oidc     : ${oidc:-<no oidc line>}"
  echo "    error    : ${errcode:-<none>}"

  if [ -z "$oidc" ] && [ -z "$exchange" ]; then
    # No exchange attempted, so this says nothing about registration. Dump the
    # tail of npm's own output once, so the reason is visible instead of
    # inferred: --dry-run may simply short-circuit before authenticating.
    unclear+=("${name} :: npm attempted no OIDC exchange")
    echo "    verdict  : INCONCLUSIVE (no exchange attempted)"
    if [ "${dumped:-0}" = "0" ]; then
      dumped=1
      echo "    --- last 40 lines of npm output for ${name} ---"
      tail -40 <<<"$out" | sed 's/^/    | /'
      echo "    --- end ---"
    fi
  elif grep -q 'package not found' <<<"$out"; then
    missing+=("$name")
    echo "    verdict  : NOT REGISTERED"
  elif grep -q 'Failed token exchange' <<<"$out"; then
    unclear+=("${name} :: ${oidc}")
    echo "    verdict  : INCONCLUSIVE (exchange failed for another reason)"
  else
    registered+=("$name")
    echo "    verdict  : registered"
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

# An inconclusive preflight cannot protect the publish that follows, so treat it
# as a failure rather than waving a possibly-unregistered package through.
if [ "${#unclear[@]}" -gt 0 ]; then
  echo "::error::${#unclear[@]} package(s) could not be checked; not proceeding to publish"
  exit 1
fi
