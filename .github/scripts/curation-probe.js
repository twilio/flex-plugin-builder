#!/usr/bin/env node
/* eslint-disable no-console */
//
// Answers the question a curation 403 leaves open: which versions does curation
// actually allow, so what should the dependency be moved to?
//
// It has to run in CI. Curation is enforced against the Artifactory registry
// under the workflow's OIDC identity, and reads from a laptop are anonymous and
// ungated, so locally every version looks allowed.
//
// Modes:
//   --scan-lockfile [path]   check every tarball in the lockfile and report all
//                            blocked ones at once. npm aborts on the first
//                            forbidden tarball, so an install only ever reveals
//                            one per run; this reveals the whole set.
//   <npm-ci-log>             report only what the failed install already hit.
//   --package <name@version> check one package.

const fs = require('fs');
const os = require('os');
const path = require('path');

const CANDIDATES_PER_PACKAGE = 8;
const CONCURRENCY = 24;

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

// A tarball URL is <root>/<name>/-/<basename>-<version>.tgz, where name may be
// scoped and so contain its own slash. Handles both the Artifactory URLs that
// appear in install logs and the registry.npmjs.org URLs the lockfile records.
const tarballInfo = (url) => {
  let rest;
  if (url.startsWith(base)) {
    rest = url.slice(base.length);
  } else {
    try {
      rest = new URL(url).pathname.replace(/^\//, '');
    } catch {
      return null;
    }
  }
  const at = rest.lastIndexOf('/-/');
  if (at === -1) {
    return null;
  }
  const name = decodeURIComponent(rest.slice(0, at));
  const version = rest
    .slice(at + 3)
    .replace(/^.*?-(?=\d)/, '')
    .replace(/\.tgz$/, '');
  return /^\d+\.\d+\.\d+/.test(version) ? { name, version } : null;
};

const tarballUrl = ({ name, version }) => `${base}${name}/-/${name.split('/').pop()}-${version}.tgz`;

const dedupe = (hits) => [...new Map(hits.map((h) => [`${h.name}@${h.version}`, h])).values()];

const blockedFromLog = (file) => {
  const log = fs.readFileSync(file, 'utf8');
  const urls = log.match(/403 Forbidden - \w+ (\S+\.tgz)/g) || [];
  return dedupe(urls.map((line) => tarballInfo(line.split(' ').pop())).filter(Boolean));
};

const fromLockfile = (file) => {
  const lock = JSON.parse(fs.readFileSync(file, 'utf8'));
  const urls = new Set();
  for (const entry of Object.values(lock.packages || {})) {
    if (entry.resolved && entry.resolved.endsWith('.tgz')) {
      urls.add(entry.resolved);
    }
  }
  return dedupe([...urls].map(tarballInfo).filter(Boolean));
};

const status = async (url) => {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, { method, headers, redirect: 'manual' });
      if (res.body) {
        await res.body.cancel();
      }
      // Some registries refuse HEAD on tarballs; retry those with GET.
      if (method === 'HEAD' && (res.status === 405 || res.status === 501)) {
        continue;
      }
      return res.status;
    } catch (e) {
      if (method === 'GET') {
        return `ERR ${e.message}`;
      }
    }
  }
  return 'ERR unreachable';
};

const verdictOf = (code) => (code === 403 ? 'BLOCKED' : typeof code === 'number' && code < 400 ? 'ALLOWED' : `?? (${code})`);

// Runs fn over items with a bounded number in flight, so a full lockfile scan
// does not open thousands of sockets at once.
const mapLimit = async (items, limit, fn) => {
  const out = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next;
      next += 1;
      out[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return out;
};

// Picks which versions above the blocked one to probe. Sampling only the next
// few is not enough: for axios@1.3.4 the next four are all blocked too, so the
// report came back with no allowed version even though 1.20.0 is fine.
//
// So: always include the newest release of every major, which is where a
// maintained version lives, plus the nearest couple for the smallest possible
// bump, plus a spread across the rest to catch a mid-range cutoff.
const candidatesFor = (stable, blocked) => {
  const above = stable.filter((v) => cmp(v, blocked) > 0);
  if (above.length <= CANDIDATES_PER_PACKAGE) {
    return above;
  }

  const picks = new Set();
  // Last entry per major wins, so this is the newest of each.
  for (const newest of new Map(above.map((v) => [v.split('.')[0], v])).values()) {
    picks.add(newest);
  }
  above.slice(0, 2).forEach((v) => picks.add(v));

  const step = Math.ceil(above.length / CANDIDATES_PER_PACKAGE);
  for (let i = 0; i < above.length && picks.size < CANDIDATES_PER_PACKAGE; i += step) {
    picks.add(above[i]);
  }

  return [...picks].sort(cmp).slice(0, CANDIDATES_PER_PACKAGE);
};

const suggestFor = async ({ name, version }) => {
  const lines = [`\n${name}@${version} is BLOCKED by curation. Nearby versions:`];
  const res = await fetch(`${base}${name.replace('/', '%2f')}`, { headers });
  if (!res.ok) {
    lines.push(`  could not read packument (${res.status})`);
    return lines;
  }
  const stable = Object.keys((await res.json()).versions || {})
    .filter((v) => /^\d+\.\d+\.\d+$/.test(v))
    .sort(cmp);

  const candidates = candidatesFor(stable, version);
  if (!candidates.length) {
    lines.push('  no newer release exists — this needs the parent dependency upgraded instead');
    return lines;
  }
  const codes = await mapLimit(candidates, CONCURRENCY, (v) => status(tarballUrl({ name, version: v })));
  candidates.forEach((v, i) => lines.push(`  ${verdictOf(codes[i]).padEnd(8)} ${name}@${v}`));
  return lines;
};

const report = (lines) => {
  const text = lines.join('\n');
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Curation report\n\n\`\`\`\n${text}\n\`\`\`\n`);
  }
};

(async () => {
  const arg = process.argv[2];
  if (!arg) {
    console.error(
      '::error::usage: curation-probe.js --scan-lockfile [path] | <npm-ci-log> | --package <name@version>',
    );
    process.exit(1);
  }

  const lines = [`Registry: ${base}`];
  let blocked;

  if (arg === '--scan-lockfile') {
    const file = process.argv[3] || 'package-lock.json';
    const all = fromLockfile(file);
    lines.push(`Scanning ${all.length} unique tarballs from ${file}`);
    const codes = await mapLimit(all, CONCURRENCY, (t) => status(tarballUrl(t)));

    blocked = all.filter((_, i) => codes[i] === 403);
    const odd = all.map((t, i) => [t, codes[i]]).filter(([, c]) => c !== 403 && !(typeof c === 'number' && c < 400));

    lines.push(`  allowed: ${all.length - blocked.length - odd.length}`);
    lines.push(`  blocked: ${blocked.length}`);
    if (odd.length) {
      lines.push(`  inconclusive: ${odd.length}`);
      odd.slice(0, 10).forEach(([t, c]) => lines.push(`    ${verdictOf(c)} ${t.name}@${t.version}`));
    }
    if (blocked.length) {
      lines.push('\nAll blocked packages:');
      blocked.forEach((t) => lines.push(`  ${t.name}@${t.version}`));
    }
  } else if (arg === '--package') {
    const spec = process.argv[3];
    const at = spec.lastIndexOf('@');
    blocked = [{ name: spec.slice(0, at), version: spec.slice(at + 1) }];
  } else {
    blocked = blockedFromLog(arg);
  }

  if (!blocked.length) {
    lines.push('\nNothing blocked by curation.');
    report(lines);
    return;
  }

  for (const target of blocked) {
    lines.push(...(await suggestFor(target)));
  }
  report(lines);
})().catch((e) => {
  console.error(`::error::probe failed: ${e.stack || e.message}`);
  process.exit(1);
});
