// Offline checks for the generated pages we ask search engines to index. Does not claim live Google index coverage.
import { readFileSync, existsSync, globSync } from 'node:fs';
import { SITE } from './partials.mjs';

const failures = [];
const fail = (file, message) => failures.push(`${file}: ${message}`);
const xml = readFileSync('sitemap.xml', 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, u]) => u);
const indexed = new Set(urls);
const documents = new Map();
const titles = new Map();
const fileFor = (url) => { const path = new URL(url).pathname.slice(1); return !path || path.endsWith('/') ? path + 'index.html' : path; };
if (urls.length !== indexed.size) fail('sitemap.xml', 'duplicate URLs');

for (const loc of urls) {
  if (!loc.startsWith(SITE)) { fail('sitemap.xml', `unexpected origin: ${loc}`); continue; }
  const file = fileFor(loc);
  if (!existsSync(file)) { fail(file, 'sitemap URL has no generated file'); continue; }
  const html = readFileSync(file, 'utf8');
  documents.set(loc, html);
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(([, u]) => u);
  if (canonicals.length !== 1 || canonicals[0] !== loc) fail(file, 'canonical must match its sitemap URL exactly');
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html)) fail(file, 'noindex page is included in sitemap');
  if ((html.match(/<h1\b/g) || []).length !== 1) fail(file, 'expected one main heading');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (!title) fail(file, 'missing title');
  else if (titles.has(title)) fail(file, `same title as ${titles.get(title)}`);
  else titles.set(title, file);
  if (!/<meta name="description" content="[^"]+"/.test(html)) fail(file, 'missing description');
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(json); } catch { fail(file, 'invalid structured data'); }
  }
}

// Crawl real HTML anchor links from Home. A sitemap entry alone is not a navigation path for people or crawlers.
const seen = new Set();
const queue = [SITE];
while (queue.length) {
  const loc = queue.shift();
  if (seen.has(loc) || !documents.has(loc)) continue;
  seen.add(loc);
  for (const [, href] of documents.get(loc).matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    let link;
    try { link = new URL(href.replace(/&amp;/g, '&'), loc); } catch { continue; }
    link.hash = ''; link.search = '';
    if (indexed.has(link.href) && !seen.has(link.href)) queue.push(link.href);
  }
}
for (const loc of indexed) if (!seen.has(loc)) fail(fileFor(loc), 'not reachable through HTML links from Home');

// Catch newly generated public pages left out of the sitemap. Noindex embeds and app/private files are excluded.
for (const file of globSync('**/*.html', { exclude: (p) => /^(node_modules|app|test-results|playwright-report)\//.test(p) })) {
  if (file === '404.html' || file === 'offline.html' || /^google[0-9a-f]+\.html$/.test(file)) continue;
  const html = readFileSync(file, 'utf8');
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html)) continue;
  const loc = SITE + file.replace(/index\.html$/, '');
  if (!indexed.has(loc)) fail(file, 'public page is missing from the sitemap');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log(`SEO checks passed: ${urls.length} canonical pages, unique titles, valid structured data, all reachable from Home.`);
