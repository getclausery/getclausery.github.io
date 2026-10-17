// Verifies the sitemap system end to end: the index lists every section file exactly once, the section files partition
// sitemap.xml with no URL lost or duplicated, every lastmod matches page-dates.json, priorities are valid, and each
// template carries a real WebP preview in the image sitemap. Search Console reports per submitted sitemap; a section
// that silently drops a URL looks like an indexing problem, so this check runs in verify.
import { readFileSync, existsSync, globSync } from 'node:fs';
import { SITE } from './partials.mjs';
import { LIB } from '../site/library.mjs';

const failures = [];
const fail = (file, message) => failures.push(`${file}: ${message}`);
const read = (file) => { try { return readFileSync(file, 'utf8'); } catch { fail(file, 'file is missing'); return ''; } };
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const today = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
const dates = JSON.parse(readFileSync('site/data/page-dates.json', 'utf8'));
const main = read('sitemap.xml');
const mainUrls = [...main.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
  loc: body.match(/<loc>([^<]+)<\/loc>/)?.[1],
  lastmod: body.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
  priority: body.match(/<priority>([^<]+)<\/priority>/)?.[1],
  images: [...body.matchAll(/<image:image>([\s\S]*?)<\/image:image>/g)].map(([, img]) => ({
    loc: img.match(/<image:loc>([^<]+)<\/image:loc>/)?.[1],
    title: img.match(/<image:title>([^<]+)<\/image:title>/)?.[1],
    caption: img.match(/<image:caption>([^<]+)<\/image:caption>/)?.[1],
  })),
}));
const urls = mainUrls.map((u) => u.loc);
const set = new Set(urls);
if (set.size !== urls.length) fail('sitemap.xml', 'contains duplicate URLs');
if (urls.length > 50000) fail('sitemap.xml', 'has more than 50,000 URLs');
for (const entry of mainUrls) {
  if (!entry.loc?.startsWith(SITE)) fail('sitemap.xml', `unexpected origin: ${entry.loc}`);
  const path = new URL(entry.loc).pathname.slice(1);
  if (!isDate(entry.lastmod)) fail('sitemap.xml', `${entry.loc} has no valid lastmod`);
  else {
    if (entry.lastmod > today) fail('sitemap.xml', `${entry.loc} lastmod is in the future`);
    const known = dates[path]?.date;
    if (known && entry.lastmod !== known) fail('sitemap.xml', `${entry.loc} lastmod ${entry.lastmod} does not match page-dates ${known}`);
  }
  if (!/^[01](?:\.\d)?$/.test(entry.priority || '')) fail('sitemap.xml', `${entry.loc} has an invalid priority`);
}
// Image entries belong to template pages only, and the referenced file must be a real WebP.
const imageUrls = new Set();
for (const entry of mainUrls) {
  const path = new URL(entry.loc).pathname.slice(1);
  if (entry.images.length && !/^templates\/[^/]+\.html$/.test(path)) fail('sitemap.xml', `${entry.loc} carries an image but is not a template page`);
  for (const image of entry.images) {
    if (!image.loc?.startsWith(SITE) || !image.loc.endsWith('.webp')) fail('sitemap.xml', `${entry.loc} image is not a site WebP URL`);
    if (!image.title || !image.caption) fail('sitemap.xml', `${entry.loc} image needs a title and caption`);
    if (imageUrls.has(image.loc)) fail('sitemap.xml', `image is listed twice: ${image.loc}`);
    imageUrls.add(image.loc);
    if (!image.loc?.startsWith(SITE)) continue;
    const file = new URL(image.loc).pathname.slice(1);
    if (!existsSync(file)) { fail('sitemap.xml', `image file is missing: ${file}`); continue; }
    const bytes = readFileSync(file);
    if (bytes.subarray(0, 4).toString() !== 'RIFF' || bytes.subarray(8, 12).toString() !== 'WEBP') fail(file, 'is not a WebP image');
    if (bytes.length < 1024) fail(file, 'is suspiciously small');
  }
}
const templateEntries = mainUrls.filter((u) => /\/templates\/[^/]+\.html$/.test(u.loc) && !u.loc.endsWith('/templates/'));
if (templateEntries.length !== LIB.length) fail('sitemap.xml', `${templateEntries.length} template pages for ${LIB.length} library templates`);
for (const t of LIB) if (!imageUrls.has(`${SITE}assets/previews/${t.slug}.webp`)) fail('sitemap.xml', `template ${t.slug} has no image entry`);

// The index and the section files must partition the main sitemap exactly.
const index = read('sitemap_index.xml');
const submitted = [...index.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g)].map(([, body]) => ({
  loc: body.match(/<loc>([^<]+)<\/loc>/)?.[1],
  lastmod: body.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
}));
const files = globSync('sitemaps/*.xml').sort();
const expected = submitted.map((s) => new URL(s.loc).pathname.replace(/^\//, '')).sort();
if (JSON.stringify(files) !== JSON.stringify(expected)) fail('sitemap_index.xml', `lists ${expected.join(', ')} but sitemaps/ holds ${files.join(', ')}`);
const sectionUrls = [];
for (const entry of submitted) {
  const file = new URL(entry.loc).pathname.replace(/^\//, '');
  const xml = read(file);
  if (!isDate(entry.lastmod)) fail('sitemap_index.xml', `${entry.loc} has no lastmod`);
  const section = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, body]) => ({
    loc: body.match(/<loc>([^<]+)<\/loc>/)?.[1],
    lastmod: body.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
  }));
  if (!section.length && file !== 'sitemaps/pages.xml') fail(file, 'section is empty');
  for (const url of section) {
    if (!set.has(url.loc)) fail(file, `${url.loc} is not in sitemap.xml`);
    if (!isDate(url.lastmod)) fail(file, `${url.loc} has no valid lastmod`);
    sectionUrls.push(url.loc);
  }
  const newest = section.map((u) => u.lastmod).sort().at(-1);
  if (newest && entry.lastmod !== newest) fail('sitemap_index.xml', `${entry.loc} lastmod ${entry.lastmod} is not its newest page ${newest}`);
  // Image entries stay in the template section and the main sitemap, not in every section.
  if (/<image:image>/.test(xml) && !['sitemaps/templates.xml'].includes(file)) fail(file, 'should not carry image entries');
}
if (sectionUrls.length !== urls.length) fail('sitemaps/', `${sectionUrls.length} URLs across sections for ${urls.length} in sitemap.xml`);
const sectionSet = new Set(sectionUrls);
if (sectionSet.size !== sectionUrls.length) fail('sitemaps/', 'a URL appears in more than one section');
for (const url of urls) if (!sectionSet.has(url)) fail('sitemaps/', `${url} is missing from every section`);
// pages.xml is the only section allowed to be empty after the split; it still holds home, pricing and the kit.
if (!locs(read('sitemaps/pages.xml')).length) fail('sitemaps/pages.xml', 'must contain the home page at least');

const robots = read('robots.txt');
for (const sitemap of ['sitemap_index.xml', 'sitemap.xml']) if (!robots.includes(`Sitemap: ${SITE}${sitemap}`)) fail('robots.txt', `does not point at ${sitemap}`);
if (/<image:image>/.test(read('sitemaps/templates.xml')) === false) fail('sitemaps/templates.xml', 'has no image entries');

if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`\nSitemap checks failed: ${failures.length} problem${failures.length === 1 ? '' : 's'}.`);
  process.exitCode = 1;
} else {
  console.log(`Sitemap checks passed: ${urls.length} URLs in sitemap.xml, ${submitted.length} section sitemaps partitioning it exactly, ${imageUrls.size} template images, lastmods match page-dates.`);
}
