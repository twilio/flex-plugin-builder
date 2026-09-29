#!/usr/bin/env node
/* eslint-disable no-console */
//
// When an install fails because JFrog curation forbids a version, this answers
// the only question that matters next: which nearby versions does curation
// allow, so what should the dependency be moved to?
//
// It reads the failed `npm ci` output, picks out every tarball that came back
// 403, and for each one probes the versions just above it plus the newest of
// each later major. A probe is the only way to know: curation is enforced
// against the Artifactory registry under the workflow's OIDC identity, and
// reads from a laptop are anonymous and ungated, so they always look allowed.
//
// Usage: node .github/scripts/curation-probe.js <npm-ci-log>
//        node .github/scripts/curation-probe.js --package axios@0.24.0

const fs = require('fs');
const os = require('os');
const path = require('path');

const CANDIDATES_PER_PACKAGE = 8;

const registry = process.env.ARTIFACTORY_NPM_REGISTRY;
if (!registry) {
  console.error('::error::ARTIFACTORY_NPM_REGISTRY is not set');
  process.exit(1);
}
const base = registry.endsWith('/') ? registry : `${registry}/`;

// artifactory-npm-auth.sh writes the auth line but deliberately leaves the
// default registry alone, so the token is all we read back out.
const npmrc = process.env.NPM_CONFIG_USERCONFIG || path.join(os.homedir(), '.npmrc');
const token = ((fs.existsSync(npmrc) ? fs.readFileSync(npmrc, 'utf8') : '').match(/:_authToken=(.+)$/m) || [])[1];
if (!token) {
  console.error(`::error::no _authToken in ${npmrc}; did artifactory-npm-auth.sh run?`);
  process.exit(1);
}
const headers = { Authorization: `Bearer ${token}` };

const cmp = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

// A tarball URL is <base><name>/-/<basename>-<version>.tgz, where name may be
// scoped and so contain its own slash.
const parseTarball = (url) => {
  const rest = url.slice(base.length);
  const at = rest.lastIndexOf('/-/');
  if (at === -1) {
    return null;
  }
  const name = decodeURIComponent(rest.slice(0, at));
  const file = rest.slice(at + 3);
  const version = file.replace(/^.*?-(?=\d)/, '').replace(/\.tgz$/, '');
  return /^\d+\.\d+\.\d+/.test(version) ? { name, version } : null;
};

const blockedFromLog = (file) => {
  const log = fs.readFileSync(file, 'utf8');
  const urls = log.match(/403 Forbidden - \w+ (\S+\.tgz)/g) || [];
  const seen = new Map();
  for (const line of urls) {
    const hit = parseTarball(line.split(' ').pop());
    if (hit) {
      seen.set(`${hit.name}@${hit.version}`, hit);
    }
  }
  return [...seen.values()];
};

const status = async (url) => {
  try {
    const res = await fetch(url, { headers, redirect: 'manual' });
    if (res.body) {
      await res.body.cancel();
    }
    return res.status;
  } catch (e) {
    return `ERR ${e.message}`;
  }
};

// The versions worth suggesting: the next few above the blocked one within its
// own major (the smallest upgrade that might clear curation), then the newest
// of every later major (the option that is actually maintained).
const candidatesFor = (stable, blocked) => {
  const above = stable.filter((v) => cmp(v, blocked) > 0);
  const major = blocked.split('.')[0];
  const sameMajor = above.filter((v) => v.split('.')[0] === major).slice(0, 4);
  const laterMajors = [
    ...new Map(above.filter((v) => v.split('.')[0] !== major).map((v) => [v.split('.')[0], v])).values(),
  ];
  return [...new Set([...sameMajor, ...laterMajors])].slice(0, CANDIDATES_PER_PACKAGE);
};

(async () => {
  const arg = process.argv[2];
  if (!arg) {
    console.error('::error::usage: curation-probe.js <npm-ci-log> | --package <name@version>');
    process.exit(1);
  }

  let targets;
  if (arg === '--package') {
    const at = process.argv[3].lastIndexOf('@');
    targets = [{ name: process.argv[3].slice(0, at), version: process.argv[3].slice(at + 1) }];
  } else {
    targets = blockedFromLog(arg);
  }

  if (!targets.length) {
    console.log('No curation 403s found in the install log; nothing to probe.');
    return;
  }

  const lines = [`Registry: ${base}`];
  for (const { name, version } of targets) {
    lines.push(`\n${name}@${version} is BLOCKED by curation. Nearby versions:`);

    const res = await fetch(`${base}${name.replace('/', '%2f')}`, { headers });
    if (!res.ok) {
      lines.push(`  could not read packument (${res.status})`);
      continue;
    }
    const stable = Object.keys((await res.json()).versions || {})
      .filter((v) => /^\d+\.\d+\.\d+$/.test(v))
      .sort(cmp);

    const candidates = candidatesFor(stable, version);
    if (!candidates.length) {
      lines.push('  no newer release exists — this needs the parent dependency upgraded instead');
      continue;
    }

    for (const v of candidates) {
      const code = await status(`${base}${name}/-/${name.split('/').pop()}-${v}.tgz`);
      const verdict = code === 403 ? 'BLOCKED' : typeof code === 'number' && code < 400 ? 'ALLOWED' : `?? (${code})`;
      lines.push(`  ${verdict.padEnd(8)} ${name}@${v}`);
    }
  }

  const report = lines.join('\n');
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Curation: which versions are allowed?\n\n\`\`\`\n${report}\n\`\`\`\n`,
    );
  }
})().catch((e) => {
  console.error(`::error::probe failed: ${e.stack || e.message}`);
  process.exit(1);
});
