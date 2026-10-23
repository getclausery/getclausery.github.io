// Builds .well-known/attestation.json: a manifest of every deployed file's
// SHA-256 hash, the version, the canonical origin and the Git commit at build
// time. Published alongside the site so third parties (and our own DMCA
// workflow) can compare a suspected clone's files against hashes from the
// canonical origin — a clone that modifies or strips files will have hashes
// that diverge from this list, which is the proof we attach to takedown
// notices. The attestation file is itself included in the manifest and is
// regenerated from the files on disk on every build so it can never drift.
import { readFileSync, writeFileSync, globSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const ORIGIN = 'https://getclausery.github.io/';
const version = pkg.version;

let commit = 'unknown';
try { commit = execSync('git rev-parse --verify HEAD', { encoding: 'utf8' }).trim(); } catch { /* built without a git checkout */ }

const patterns = [
  'index.html', 'offline.html', '404.html', 'humans.txt', 'ads.txt', 'robots.txt',
  'feed.xml', 'llms.txt', 'opensearch.xml', 'sitemap.xml', 'sitemap_index.xml',
  'app/**/*.html', 'app/**/*.js', 'app/**/*.css', 'app/**/*.webmanifest',
  'vendor/*.js', 'site.css', 'site.js', 'sw.js',
  'assets/**/*.svg', 'assets/**/*.png',
  'legal/*.html', 'about/**/*.html', 'changelog.html', 'contact/**/*.html',
  'pricing/**/*.html', 'press/**/*.html', 'docs/**/*.html', 'templates/**/*.html',
  'invoice-templates/**/*.html', 'clauses/**/*.html', 'guides/**/*.html',
  'free-tools/**/*.html', 'business-document-kit/**/*.html', 'compare/**/*.html',
  'for/**/*.html', 'nda-templates/**/*.html', 'why-clausery/**/*.html', 'go/**/*.html',
  'made-with/**/*.html',
  '.well-known/security.txt',
];
const seen = new Set();
const files = {};
for (const p of patterns) {
  for (const f of globSync(p)) {
    const rel = f.split('\\').join('/');
    if (seen.has(rel)) continue;
    seen.add(rel);
    const bytes = readFileSync(rel);
    files['/' + rel] = 'sha256-' + createHash('sha256').update(bytes).digest('base64');
  }
}

const attest = {
  origin: ORIGIN,
  version,
  commit,
  generatedAt: new Date().toISOString(),
  license: 'AGPL-3.0-or-later WITH Clausery-Trademark-Exception',
  files,
};
// Include the attestation file's own hash by computing it on the unsigned
// payload then re-serialising.
writeFileSync('.well-known/attestation.json', JSON.stringify(attest, null, 1) + '\n');
const attestBytes = readFileSync('.well-known/attestation.json');
attest.files['/.well-known/attestation.json'] = 'sha256-' + createHash('sha256').update(attestBytes).digest('base64');
writeFileSync('.well-known/attestation.json', JSON.stringify(attest, null, 1) + '\n');
console.log(`attestation: ${Object.keys(files).length} files hashed at ${ORIGIN} (v${version}, commit ${commit.slice(0, 9)})`);
