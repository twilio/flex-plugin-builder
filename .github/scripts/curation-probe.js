#!/usr/bin/env node
/* eslint-disable no-console */
// TEMPORARY (FLEXY-6498): report which packages JFrog curation blocks for the
// installs the e2e tests do outside this repo's lockfile:
//   - `twilio plugins:install @twilio-labs/plugin-flex@7.1.2` (yarn, CLI data dir)
//   - `npm i` in the plugins created by `twilio flex:plugins:create` (JS + TS)
// curation-targets.json holds every name@version those installs resolve to
// (generated locally). For each blocked package, the newest versions in the same
// and higher majors are probed too, so replacements can be picked in one pass.
// A 403 means curation blocked the tarball; 200/3xx means allowed.
// Remove together with curation-targets.json once the e2e installs pass.

const fs = require('fs');
const os = require('os');
const path = require('path');

const npmrc = fs.readFileSync(path.join(os.homedir(), '.npmrc'), 'utf8');
const registry = (npmrc.match(/^registry=(.+)$/m) || [])[1];
const token = (npmrc.match(/:_authToken=(.+)$/m) || [])[1];
if (!registry || !token) {
  console.error('No registry/token in ~/.npmrc; did the artifactory-oidc step run?');
  process.exit(0);
}
const base = registry.endsWith('/') ? registry : `${registry}/`;
const headers = { Authorization: `Bearer ${token}` };
console.log(`Registry: ${base}`);

const splitId = (id) => {
  const at = id.lastIndexOf('@');
  return [id.slice(0, at), id.slice(at + 1)];
};
const tarballUrl = (name, version) => `${base}${name}/-/${name.split('/').pop()}-${version}.tgz`;

const check = async (url) => {
  try {
    const res = await fetch(url, { headers, redirect: 'manual' });
    if (res.body) await res.body.cancel();
    return res.status;
  } catch (e) {
    return `ERR ${e.message}`;
  }
};

const pool = async (items, size, fn) => {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
};

const verdict = (s) => (s === 403 ? 'BLOCKED' : typeof s === 'number' && s < 400 ? 'ALLOWED' : `?? (${s})`);
const major = (v) => parseInt(v.split('.')[0], 10);
const isStable = (v) => /^\d+\.\d+\.\d+$/.test(v);

// Newest stable versions: up to 4 in the blocked version's major, plus the newest of each higher major
const alternatives = async (name, blockedVersion) => {
  try {
    const res = await fetch(`${base}${name.replace('/', '%2f')}`, { headers });
    if (!res.ok) return { error: `packument ${res.status}` };
    const versions = Object.keys((await res.json()).versions || {}).filter(isStable);
    const cmp = (a, b) => a.localeCompare(b, undefined, { numeric: true });
    versions.sort(cmp);
    const m = major(blockedVersion);
    const sameMajor = versions.filter((v) => major(v) === m && cmp(v, blockedVersion) > 0).slice(-4);
    const higher = [...new Set(versions.filter((v) => major(v) > m).map(major))].map(
      (hm) => versions.filter((v) => major(v) === hm).pop(),
    );
    return { versions: [...sameMajor, ...higher] };
  } catch (e) {
    return { error: e.message };
  }
};

(async () => {
  const targets = JSON.parse(fs.readFileSync(path.join(__dirname, 'curation-targets.json'), 'utf8'));
  console.log(`\n=== Scanning ${targets.length} package versions ===`);
  const statuses = await pool(targets, 24, ({ id }) => check(tarballUrl(...splitId(id))));
  const results = targets.map((t, idx) => ({ ...t, status: statuses[idx] }));
  const blocked = results.filter((r) => r.status === 403);
  const odd = results.filter((r) => r.status !== 403 && !(r.status < 400));
  console.log(`${blocked.length} blocked, ${odd.length} other errors`);
  odd.forEach((r) => console.log(`??       ${r.id} (${r.status}) [${r.src}]`));

  console.log('\n=== Blocked packages and alternatives ===');
  for (const r of blocked) {
    const [name, version] = splitId(r.id);
    console.log(`BLOCKED  ${r.id} [${r.src}]`);
    const alt = await alternatives(name, version);
    if (alt.error) {
      console.log(`           alternatives: ${alt.error}`);
      continue;
    }
    const altStatus = await pool(alt.versions, 8, (v) => check(tarballUrl(name, v)));
    alt.versions.forEach((v, idx) => console.log(`           ${verdict(altStatus[idx]).padEnd(8)} ${name}@${v}`));
    if (!alt.versions.length) console.log('           (no newer stable versions)');
  }
})();
