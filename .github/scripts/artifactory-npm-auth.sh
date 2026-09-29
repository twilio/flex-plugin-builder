#!/usr/bin/env bash
#
# Exchanges the workflow's GitHub OIDC token for a short-lived Artifactory
# access token and writes an npm auth line for the curated npm repository.
#
# This deliberately does not set `registry=`. The default registry stays on
# public npm so that `npm publish` can authenticate through npm's own trusted
# publishing; only the install step opts into Artifactory, by passing
# --registry explicitly. Setting a registry here would send the publish to
# Artifactory as well.
#
# Artifactory's access token is valid for roughly ten minutes, so this is meant
# to be re-run before each install attempt. It replaces the auth line for this
# registry rather than appending, so repeated runs do not grow the file.

set -euo pipefail

: "${ARTIFACTORY_URL:?ARTIFACTORY_URL is not set}"
: "${ARTIFACTORY_NPM_REGISTRY:?ARTIFACTORY_NPM_REGISTRY is not set}"
: "${ACTIONS_ID_TOKEN_REQUEST_TOKEN:?the job needs permissions: id-token: write}"
: "${ACTIONS_ID_TOKEN_REQUEST_URL:?the job needs permissions: id-token: write}"

# npm's auth keys are the registry URL without a scheme, with a trailing slash.
registry_key="${ARTIFACTORY_NPM_REGISTRY#*://}"
registry_key="//${registry_key%/}/"

# actions/setup-node points npm at its own user config, so honour that if set;
# writing to ~/.npmrc while NPM_CONFIG_USERCONFIG is exported has no effect.
npmrc="${NPM_CONFIG_USERCONFIG:-${HOME}/.npmrc}"

github_jwt=$(curl -sS \
  -H "Authorization: bearer ${ACTIONS_ID_TOKEN_REQUEST_TOKEN}" \
  "${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=${ARTIFACTORY_URL}" | jq -r '.value')

if [ -z "${github_jwt}" ] || [ "${github_jwt}" = "null" ]; then
  echo "::error::could not obtain a GitHub OIDC token"
  exit 1
fi

# provider_name is required. Without it JFrog cannot tell which OIDC
# configuration to match and returns a success response carrying no token.
response=$(curl -sS "${ARTIFACTORY_URL}/access/api/v1/oidc/token" \
  -H 'Content-Type: application/json' \
  -d "{\"grant_type\":\"urn:ietf:params:oauth:grant-type:token-exchange\",
       \"subject_token_type\":\"urn:ietf:params:oauth:token-type:id_token\",
       \"subject_token\":\"${github_jwt}\",
       \"provider_name\":\"github-actions\"}")

artifactory_token=$(echo "${response}" | jq -r '.access_token // empty')

if [ -z "${artifactory_token}" ]; then
  echo "::error::Artifactory OIDC token exchange failed. Response:"
  echo "${response}" | jq 'if .access_token then .access_token = "<redacted>" else . end' 2>/dev/null \
    || echo "${response}"
  exit 1
fi

echo "::add-mask::${artifactory_token}"

touch "${npmrc}"
grep -v -F "${registry_key}:_authToken=" "${npmrc}" > "${npmrc}.next" || true
mv "${npmrc}.next" "${npmrc}"
printf '%s:_authToken=%s\n' "${registry_key}" "${artifactory_token}" >> "${npmrc}"
chmod 600 "${npmrc}"

echo "npm auth configured for ${registry_key}"
