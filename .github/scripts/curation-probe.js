#!/usr/bin/env node
/* eslint-disable no-console */
// FLEXY-6498 — which parent-package versions does JFrog curation actually allow?
//
// Curation is only enforced against the Artifactory registry the artifactory-oidc
// action configures, under the workflow's OIDC identity. Reads from a laptop are
// anonymous and ungated, so they always report "allowed" — this has to run in CI.
//
// For each parent below: print the newest release in each of its last few majors,
// whether curation allows that tarball, and what it declares for the deps we care
// about (the ones we currently pin with overrides).

const fs = require('fs');
const os = require('os');
const path = require('path');

const PARENTS = [
  { name: '@twilio/flex-ui', watch: ['axios', 'twilio-chat', 'twilio-taskrouter'] },
  { name: '@twilio/cli-core', watch: ['@oclif/core', 'twilio', 'axios'] },
  { name: '@oclif/core', watch: ['ejs'] },
  { name: 'twilio-chat', watch: ['rfc6902'] },
  { name: 'twilio-taskrouter', watch: ['axios'] },
  { name: 'lerna', watch: ['@nx/devkit', '@nrwl/devkit'] },
  { name: '@nx/devkit', watch: ['ejs'] },
];

// The versions each parent resolves to on its own, i.e. exactly what a customer
// gets with no overrides in play. If these are allowed, the overrides can go.
const DEPS = ['ejs@3.1.10', 'ejs@5.0.1', 'ejs@6.0.1', 'rfc6902@3.1.1', 'axios@0.21.4'];

const npmrc = fs.readFileSync(path.join(os.homedir(), '.npmrc'), 'utf8');
const registry = (npmrc.match(/^registry=(.+)$/m) || [])[1];
const token = (npmrc.match(/:_authToken=(.+)$/m) || [])[1];
if (!registry || !token) {
  console.error('::error::No registry/token in ~/.npmrc; did the artifactory-oidc step run?');
  process.exit(1);
}
const base = registry.endsWith('/') ? registry : `${registry}/`;
const headers = { Authorization: `Bearer ${token}` };

const cmp = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

const status = async (url) => {
  try {
    const res = await fetch(url, { headers, redirect: 'manual' });
    if (res.body) await res.body.cancel();
    return res.status;
  } catch (e) {
    return `ERR ${e.message}`;
  }
};

(async () => {
  const lines = [`Registry: ${base}`];
  for (const { name, watch } of PARENTS) {
    const res = await fetch(`${base}${name.replace('/', '%2f')}`, { headers });
    if (!res.ok) {
      lines.push(`\n${name}: packument ${res.status}`);
      continue;
    }
    const pack = (await res.json()).versions || {};
    const stable = Object.keys(pack).filter((v) => /^\d+\.\d+\.\d+$/.test(v)).sort(cmp);
    const newestPerMajor = [...new Map(stable.map((v) => [v.split('.')[0], v])).values()].slice(-4);

    lines.push(`\n${name}`);
    for (const v of newestPerMajor) {
      const s = await status(`${base}${name}/-/${name.split('/').pop()}-${v}.tgz`);
      const verdict = s === 403 ? 'BLOCKED' : typeof s === 'number' && s < 400 ? 'ALLOWED' : `?? (${s})`;
      const deps = (pack[v] || {}).dependencies || {};
      const declared = watch.filter((w) => deps[w]).map((w) => `${w}@${deps[w]}`).join(', ');
      lines.push(`  ${verdict.padEnd(8)} ${`${name}@${v}`.padEnd(30)} ${declared || '—'}`);
    }
  }
  lines.push('\nUn-overridden dependency versions');
  for (const spec of DEPS) {
    const at = spec.lastIndexOf('@');
    const [name, v] = [spec.slice(0, at), spec.slice(at + 1)];
    const st = await status(`${base}${name}/-/${name.split('/').pop()}-${v}.tgz`);
    const verdict = st === 403 ? 'BLOCKED' : typeof st === 'number' && st < 400 ? 'ALLOWED' : `?? (${st})`;
    lines.push(`  ${verdict.padEnd(8)} ${spec}`);
  }

  const report = lines.join('\n');
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Curated-repo parent versions\n\n\`\`\`\n${report}\n\`\`\`\n`);
  }
})().catch((e) => {
  console.error(`::error::probe failed: ${e.stack || e.message}`);
  process.exit(1);
});
