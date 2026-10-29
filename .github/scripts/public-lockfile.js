#!/usr/bin/env node
/* eslint-disable no-console */
// Pre-commit counterpart to lockfile-hygiene.sh (ADR 1634 Rule 3b).
//
// Twilio resolution is redirected at build time by config (the OIDC action writes
// ~/.npmrc), never in the repo — so a lockfile generated on a machine pointed at
// Artifactory carries Artifactory URLs and breaks `npm ci` for external consumers.
// The CI gate only detects that and fails; this rewrites it at the source, so the
// committed lockfile always names the public registry.
//
// Rewrites the host+repo prefix only. The path after it (`/<pkg>/-/<file>.tgz`) is
// identical on both, and `integrity` is left alone because Artifactory proxies
// byte-identical tarballs. A package published ONLY to Artifactory cannot be
// rewritten safely — it would 404 publicly — and this cannot detect that offline;
// the clean-room install in CI is what catches it.

const { execFileSync } = require('child_process');
const fs = require('fs');

const ARTIFACTORY =
  /https:\/\/[^/"]*(?:twilio\.jfrog\.io|jfrog\.twilio|artifacts\.twilio|artifactory\.twilio)[^/"]*\/artifactory\/api\/npm\/[^/"]+\//g;
const PUBLIC = 'https://registry.npmjs.org/';

const staged = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACM'], { encoding: 'utf8' })
  .split('\n')
  .filter((f) => /(^|\/)(package-lock\.json|npm-shrinkwrap\.json)$/.test(f));

if (!staged.length) process.exit(0);

let rewrote = false;
for (const file of staged) {
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(ARTIFACTORY, PUBLIC);
  if (before === after) continue;
  const count = (before.match(ARTIFACTORY) || []).length;
  fs.writeFileSync(file, after);
  execFileSync('git', ['add', file]);
  console.log(`lockfile: rewrote ${count} Artifactory URL(s) to the public registry in ${file}`);
  rewrote = true;
}

if (rewrote) {
  console.log('lockfile: re-staged. CI still runs a clean-room public install to verify it resolves.');
}
