// Offline checks for the generated pages we ask search engines to index. Does not claim live Google index coverage.
import { readFileSync, existsSync, globSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { SITE } from './partials.mjs';
import { socialCardProblems } from './social-card.mjs';
import { editorialLinkGraph } from './editorial-links.mjs';
import { createRobotsPolicy } from './robots.mjs';

const failures = [];
const fail = (file, message) => failures.push(`${file}: ${message}`);
const xml = readFileSync('sitemap.xml', 'utf8');
const crawlerMayFetch = createRobotsPolicy(readFileSync('robots.txt', 'utf8'));
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, u]) => u);
const dates = JSON.parse(readFileSync('site/data/page-dates.json', 'utf8'));
const lastmod = Object.fromEntries([...xml.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)].map(([, loc, date]) => [loc, date]));
const indexed = new Set(urls);
const documents = new Map();
const titles = new Map();
const descriptions = new Map();
const shareImages = new Map();
const templateImages = new Map();
const templateImageHashes = new Map();
const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…' };
const decode = (s) => String(s).replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? Number.parseInt(e.slice(2), 16) : Number(e.slice(1))) : entities[e.toLowerCase()] ?? m);
const fileFor = (url) => { const path = new URL(url).pathname.slice(1); return !path || path.endsWith('/') ? path + 'index.html' : path; };
const checkStructuredUrls = (value, file) => {
  if (typeof value === 'string' && value.startsWith(SITE)) {
    const target = fileFor(value);
    if (!existsSync(target)) fail(file, `structured-data URL has no file: ${value}`);
  } else if (Array.isArray(value)) for (const item of value) checkStructuredUrls(item, file);
  else if (value && typeof value === 'object') for (const item of Object.values(value)) checkStructuredUrls(item, file);
};
// All indexed pages need a real, absolute same-site share card. Template cards must be distinct by URL and bytes,
// so accidentally pointing several templates at the generic card (or copying it to new filenames) cannot pass.
const checkShareImage = (file, html) => {
  const images = [...html.matchAll(/<meta property="og:image" content="([^"]+)"/g)].map(([, u]) => decode(u));
  if (images.length !== 1) { fail(file, 'expected exactly one og:image'); return; }
  const image = images[0];
  let url;
  try { url = new URL(image); } catch { fail(file, 'og:image must be an absolute same-site URL'); return; }
  if (!image.startsWith(SITE) || url.origin !== new URL(SITE).origin || url.username || url.password || url.search || url.hash) {
    fail(file, 'og:image must be an absolute same-site URL without query or fragment');
    return;
  }
  const target = fileFor(image);
  if (!existsSync(target)) { fail(file, `og:image has no file: ${image}`); return; }
  if (!shareImages.has(image)) {
    const png = readFileSync(target);
    shareImages.set(image, { problems: socialCardProblems(png), hash: createHash('sha256').update(png).digest('hex') });
  }
  const card = shareImages.get(image);
  for (const problem of card.problems) fail(file, `${target}: ${problem}`);
  if (!/<meta property="og:image:width" content="1200"/.test(html) || !/<meta property="og:image:height" content="630"/.test(html)) fail(file, 'og:image dimensions must declare 1200x630');
  const twitterImage = html.match(/<meta name="twitter:image" content="([^"]+)"/)?.[1];
  if (!twitterImage || decode(twitterImage) !== image) fail(file, 'twitter:image must match og:image');
  if (!/<meta name="twitter:card" content="summary_large_image"/.test(html)) fail(file, 'twitter:card must be summary_large_image');
  if (/^templates\/[^/]+\.html$/.test(file) && file !== 'templates/index.html') {
    if (image === SITE + 'assets/og.png') fail(file, 'template needs its own share card, not the generic site image');
    if (templateImages.has(image)) fail(file, `shares its og:image with ${templateImages.get(image)}`);
    else templateImages.set(image, file);
    if (templateImageHashes.has(card.hash)) fail(file, `share card has identical bytes to ${templateImageHashes.get(card.hash)}`);
    else templateImageHashes.set(card.hash, file);
  }
};
if (urls.length !== indexed.size) fail('sitemap.xml', 'duplicate URLs');

for (const loc of urls) {
  if (!loc.startsWith(SITE)) { fail('sitemap.xml', `unexpected origin: ${loc}`); continue; }
  const file = fileFor(loc);
  if (!crawlerMayFetch(new URL(loc).pathname)) fail(file, 'indexable page is blocked by robots.txt');
  if (!existsSync(file)) { fail(file, 'sitemap URL has no generated file'); continue; }
  const html = readFileSync(file, 'utf8');
  documents.set(loc, html);
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(([, u]) => u);
  if (canonicals.length !== 1 || canonicals[0] !== loc) fail(file, 'canonical must match its sitemap URL exactly');
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html)) fail(file, 'noindex page is included in sitemap');
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  if (!robots) fail(file, 'missing robots meta');
  else if (!/\bindex\b/.test(robots) || /\bnofollow\b/.test(robots)) fail(file, `robots meta does not allow indexing and following: ${robots}`);
  const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  if (ogUrl !== loc) fail(file, 'og:url must match the canonical URL');
  const key = new URL(loc).pathname.slice(1);
  const known = dates[key]?.date;
  if (!known) fail(file, 'page has no entry in page-dates.json');
  else if (lastmod[loc] !== known) fail(file, `sitemap lastmod ${lastmod[loc] || '(missing)'} does not match page-dates ${known}`);
  if (/\s|[A-Z]/.test(key)) fail(file, 'sitemap path should be lowercase with no spaces');
  if ((html.match(/<h1\b/g) || []).length !== 1) fail(file, 'expected one main heading');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const decodedTitle = title && decode(title);
  if (!title) fail(file, 'missing title');
  else if (decodedTitle.length > 60) fail(file, `title is ${decodedTitle.length} characters (maximum 60)`);
  else if (titles.has(decodedTitle)) fail(file, `same title as ${titles.get(decodedTitle)}`);
  else titles.set(decodedTitle, file);
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  const decodedDescription = description && decode(description);
  if (!description) fail(file, 'missing description');
  else if (decodedDescription.length > 160) fail(file, `description is ${decodedDescription.length} characters (maximum 160)`);
  else if (descriptions.has(decodedDescription)) fail(file, `same description as ${descriptions.get(decodedDescription)}`);
  else descriptions.set(decodedDescription, file);
  if (!/<meta property="og:image:alt" content="[^"]+"/.test(html)) fail(file, 'missing og:image:alt');
  checkShareImage(file, html);
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { checkStructuredUrls(JSON.parse(json), file); } catch { fail(file, 'invalid structured data'); }
  }
}

// Noindex works only if the crawler can fetch the document. Allow the public app entry (and query variants) while
// preserving the exclusions for activation, implementation files and download directories.
for (const path of ['/app/', '/app/?source=site', '/app/index.html', '/app/index.html?source=site']) {
  if (!crawlerMayFetch(path)) fail('robots.txt', `must allow ${path} so its noindex directive can be read`);
}
if (!/<meta\s+name="robots"\s+content="[^"]*\bnoindex\b/.test(readFileSync('app/index.html', 'utf8'))) fail('app/index.html', 'public app entry must remain noindex');
for (const path of ['/app/activate.html', '/app/main.js', '/samples/invoice.docx', '/marketing/README.md']) {
  if (crawlerMayFetch(path)) fail('robots.txt', `must preserve the crawl exclusion for ${path}`);
}
for (const path of ['/site.css', '/site.js', '/app/theme.js', '/app/manifest.webmanifest']) {
  if (!crawlerMayFetch(path)) fail('robots.txt', `blocks a public-site rendering resource: ${path}`);
}

// Crawl real HTML anchor links from Home. A sitemap entry alone is not a navigation path for people or crawlers.
// Depth is measured in clicks, so a page buried four levels down is flagged even though it is technically reachable.
const depth = new Map([[SITE, 0]]);
const queue = [SITE];
let deepest = 0;
while (queue.length) {
  const loc = queue.shift();
  for (const [, href] of (documents.get(loc) || '').matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    let link;
    try { link = new URL(href.replace(/&amp;/g, '&'), loc); } catch { continue; }
    link.hash = ''; link.search = '';
    if (!indexed.has(link.href) || depth.has(link.href)) continue;
    depth.set(link.href, depth.get(loc) + 1);
    deepest = Math.max(deepest, depth.get(link.href));
    queue.push(link.href);
  }
}
for (const loc of indexed) {
  if (!depth.has(loc)) fail(fileFor(loc), 'not reachable through HTML links from Home');
  else if (depth.get(loc) > 3) fail(fileFor(loc), `is ${depth.get(loc)} clicks from Home (maximum 3)`);
}
if (deepest > 3) fail('site', `deepest page is ${deepest} clicks from Home`);

// Global navigation makes pages reachable, but it is not a substitute for a useful link in another page's content.
// Count distinct referring pages, not repeated anchors, and ignore self-links, breadcrumbs and automatic nav blocks.
const editorial = editorialLinkGraph(documents);
for (const loc of indexed) if (loc !== SITE && !editorial.incoming.get(loc)?.size) fail(fileFor(loc), 'no editorial inbound link (header, footer, nav and repeated related-page blocks do not count)');
const editorialEdges = [...editorial.outgoing.values()].reduce((sum, targets) => sum + targets.size, 0);

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
} else console.log(`SEO checks passed: ${urls.length} canonical pages, unique titles and descriptions, lastmod matches page-dates, robots allow all indexed pages and the noindex app entry, og:url consistent, ${shareImages.size} valid 1200x630 PNG share cards under 300 KB (${templateImages.size} distinct template cards), ${editorialEdges} editorial links with no content orphans, all reachable from Home within ${deepest} clicks.`);
