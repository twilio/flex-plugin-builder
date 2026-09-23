#!/usr/bin/env node
/* eslint-disable no-console */
// TEMPORARY (FLEXY-6498): report which package versions JFrog curation lets
// through the Artifactory registry configured in ~/.npmrc by the
// artifactory-oidc action. Remove once the dependency versions are settled.
//
//  1. Scans every tarball in package-lock.json and lists the blocked ones.
//  2. Probes candidate versions for packages we override.
//
// A 403 means curation blocked the tarball; 200/3xx means it is allowed.
// Redirects are not followed, so allowed tarballs are not downloaded.

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
console.log(`Registry: ${base}`);

const tarballUrl = (name, version) => `${base}${name}/-/${name.split('/').pop()}-${version}.tgz`;

const check = async (url) => {
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, redirect: 'manual' });
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

const candidates = {
  axios: ['0.26.1', '0.27.2', '0.28.1', '0.29.0', '0.30.3', '0.31.0', '0.31.1', '0.32.0', '0.33.0', '0.34.0', '1.15.1', '1.20.0'],
  flatted: ['3.2.2', '3.3.4', '3.4.2', '3.4.4'],
  'form-data': ['3.0.1', '3.0.4', '3.0.5', '4.0.6'],
  handlebars: ['4.7.7', '4.7.8', '4.7.9'],
  immutable: ['4.2.4', '4.3.8', '4.3.9', '5.1.5', '5.1.9'],
  ip: ['1.1.9', '2.0.0', '2.0.1'],
  'lodash-es': ['4.17.21', '4.17.23', '4.18.0', '4.18.1'],
  'lodash.template': ['4.5.0', '4.18.0', '4.18.1'],
  'proxy-addr': ['2.0.7', '2.0.8'],
  ejs: ['6.0.1'],
  rfc6902: ['5.0.0', '5.3.0'],
};

(async () => {
  // 1. Candidate versions
  console.log('\n=== Candidate versions ===');
  const probes = Object.entries(candidates).flatMap(([name, versions]) => versions.map((v) => [name, v]));
  const probeStatus = await pool(probes, 8, ([name, v]) => check(tarballUrl(name, v)));
  probes.forEach(([name, v], idx) => {
    const s = probeStatus[idx];
    const verdict = s === 403 ? 'BLOCKED' : typeof s === 'number' && s < 400 ? 'ALLOWED' : `?? (${s})`;
    console.log(`${verdict.padEnd(8)} ${name}@${v}`);
  });

  // 2. Every tarball in the lockfile
  console.log('\n=== Lockfile scan ===');
  const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
  const urls = new Map();
  for (const [key, pkg] of Object.entries(lock.packages || {})) {
    if (!pkg.resolved || !pkg.resolved.startsWith('https://registry.npmjs.org/')) continue;
    const name = key.slice(key.lastIndexOf('node_modules/') + 'node_modules/'.length);
    urls.set(pkg.resolved.replace('https://registry.npmjs.org/', base), `${name}@${pkg.version}`);
  }
  const entries = [...urls.entries()];
  const statuses = await pool(entries, 24, ([url]) => check(url));
  const results = entries.map(([, id], idx) => [id, statuses[idx]]);
  const blocked = results.filter(([, s]) => s === 403).map(([id]) => id);
  const odd = results.filter(([, s]) => s !== 403 && !(s < 400)).map(([id, s]) => `${id} (${s})`);
  console.log(`Scanned ${entries.length} tarballs: ${blocked.length} blocked, ${odd.length} other errors`);
  blocked.sort().forEach((id) => console.log(`BLOCKED  ${id}`));
  odd.forEach((id) => console.log(`??       ${id}`));
})();
