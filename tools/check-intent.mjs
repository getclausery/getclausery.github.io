// Checks the search-intent map against the pages we actually index. Every sitemap page must name the query it is
// written to win, the intent behind that query and its topic cluster; queries must be unique and appear in the page's
// title, H1 or description; each cluster hub must link every member; and every page must offer the next step its
// intent implies (a download or app link, or a link to a page that has one).
//
// This is the guard against the usual programmatic-SEO failure: two pages quietly chasing the same query, a landing
// page with no call to action, or a new page that ships without deciding what it is for.
import { readFileSync } from 'node:fs';
import { SITE } from './partials.mjs';
import { SEARCH_INTENT, CLUSTERS, INTENTS } from '../site/data/search-intent.mjs';

const failures = [];
const fail = (path, message) => failures.push(`${path || '/'}: ${message}`);
const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…' };
const decode = (s) => String(s).replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? Number.parseInt(e.slice(2), 16) : Number(e.slice(1))) : entities[e.toLowerCase()] ?? m);
const strip = (s) => decode(String(s).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const words = (s) => strip(s).toLowerCase().replace(/&/g, ' and ').replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
const singular = (w) => w.length > 4 ? w.replace(/ies$/, 'y').replace(/(ses|xes|ches|shes)$/, (m) => m.slice(0, -2)).replace(/s$/, '') : w;
const queryKey = (q) => words(q).sort().join(' ');
const fileFor = (path) => !path || path.endsWith('/') ? path + 'index.html' : path;
const pageHtml = new Map();
const sitemap = readFileSync('sitemap.xml', 'utf8');
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname.slice(1));
const pageSet = new Set(pages);
for (const path of pages) {
  const file = fileFor(path);
  try { pageHtml.set(path, readFileSync(file, 'utf8')); } catch { fail(path, 'sitemap page has no generated file'); }
}

// Coverage both ways: no unmapped page, no stale map entry.
for (const path of pages) if (!SEARCH_INTENT[path]) fail(path, 'has no search-intent entry');
for (const path of Object.keys(SEARCH_INTENT)) if (!pageSet.has(path)) fail(path, 'is in the search-intent map but not in the sitemap');

// Each entry must be well formed, aligned with the page and unique.
const byQuery = new Map();
const byTokenSet = new Map();
for (const [path, entry] of Object.entries(SEARCH_INTENT)) {
  if (!Array.isArray(entry) || entry.length !== 3) { fail(path, 'entry must be [query, intent, cluster]'); continue; }
  const [query, intent, cluster] = entry;
  if (typeof query !== 'string' || !query.trim()) { fail(path, 'empty query'); continue; }
  const q = query.trim().toLowerCase();
  const qWords = words(q);
  if (qWords.length < 2 || qWords.length > 9) fail(path, `query "${query}" has ${qWords.length} words (expected 2 to 9)`);
  if (!qWords.some((w) => w.length > 3)) fail(path, `query "${query}" has no distinctive word`);
  if (!INTENTS.includes(intent)) fail(path, `unknown intent "${intent}"`);
  if (!CLUSTERS[cluster]) fail(path, `unknown cluster "${cluster}"`);
  const seen = byQuery.get(q);
  if (seen) fail(path, `query "${query}" is already used by ${seen}`);
  else byQuery.set(q, path);
  const key = queryKey(q);
  const same = byTokenSet.get(key);
  if (same && same !== q) fail(path, `query "${query}" uses the same words as ${SEARCH_INTENT[same]?.[0] || same} on ${same}`);
  else byTokenSet.set(key, path);

  const html = pageHtml.get(path);
  if (!html) continue;
  const title = strip(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '');
  const h1 = strip(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '');
  const description = decode(html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '');
  const corpus = new Set([...words(`${title} ${h1} ${description}`)].flatMap((w) => [w, singular(w)]));
  const missing = qWords.filter((w) => !corpus.has(w) && !corpus.has(singular(w)));
  if (missing.length) fail(path, `query "${query}" is not reflected in the title, H1 or description (missing: ${missing.join(', ')})`);

  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
  const links = new Set([...main.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(([, href]) => {
    try { const u = new URL(decode(href), SITE + path); u.hash = ''; u.search = ''; return u.href; } catch { return ''; }
  }));
  const hasNextStep = ['app/', 'pricing/', 'samples/'].some((p) => [...links].some((u) => u.startsWith(SITE + p)));
  if (intent === 'transactional' || intent === 'commercial') {
    if (!hasNextStep) fail(path, `a ${intent} page needs a link to the app, pricing or a download in its main content`);
  }
  if (intent === 'informational' && !hasNextStep && ![...links].some((u) => /\/templates\/|\/invoice-templates\/|\/free-tools\//.test(u))) {
    fail(path, 'an informational page needs a next step: the app, pricing, a template or a tool');
  }
}

// The hub is the page that makes a cluster crawlable. Every member must be one link from it.
for (const [slug, cluster] of Object.entries(CLUSTERS)) {
  if (!cluster.hub) continue;
  const hub = cluster.hub;
  if (!pageSet.has(hub)) { fail(hub, `hub for the "${slug}" cluster is not in the sitemap`); continue; }
  if (SEARCH_INTENT[hub]?.[2] !== slug) fail(hub, `hub for the "${slug}" cluster must be mapped to that cluster`);
  const html = pageHtml.get(hub) || '';
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
  const links = new Set([...main.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(([, href]) => {
    try { const u = new URL(decode(href), SITE + hub); u.hash = ''; u.search = ''; return u.pathname.slice(1); } catch { return ''; }
  }));
  for (const [path, entry] of Object.entries(SEARCH_INTENT)) {
    if (entry[2] !== slug || path === hub) continue;
    if (!links.has(path)) fail(path, `is in the "${slug}" cluster but its hub ${hub} does not link to it`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`\nSearch-intent checks failed: ${failures.length} problem${failures.length === 1 ? '' : 's'}.`);
  process.exitCode = 1;
} else {
  console.log(`Search-intent checks passed: ${pages.length} pages, ${Object.keys(CLUSTERS).length} clusters, ${byQuery.size} unique queries, every hub links its members and every page has a next step.`);
}
