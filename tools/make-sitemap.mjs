// Writes the sitemaps for the public pages and robots.txt (the site is served from the origin root).
//
// - sitemap.xml: every public page in one file (kept for IndexNow and for anything already pointed at it).
// - sitemaps/<section>.xml + sitemap_index.xml: the same pages split by section. Submit sitemap_index.xml in Search
//   Console: its Pages report can then be filtered per sitemap, which shows which sections Google is and is not indexing.
//
// lastmod is each page's last-modified date from site/data/page-dates.json, written by tools/build-site.mjs: the day its
// content last changed (or, for guides and clauses first published before dates were tracked, the publication date).
// Never the build date, which would claim every page changed on every build and teach crawlers to ignore lastmod.
import { readFileSync, writeFileSync, mkdirSync, existsSync, globSync } from 'node:fs';
import { SITE } from './partials.mjs';

const base = SITE;
const skip = (f) => /^(node_modules|app|test-results|playwright-report|free-tools\/embed)\//.test(f) || f === '404.html' || f === 'offline.html' || /^google[0-9a-f]+\.html$/.test(f);   // search-console verification files; embed pages are noindex
const pages = globSync('**/*.html').map((f) => f.split('\\').join('/')).filter((f) => !skip(f)).sort();
const dates = existsSync('site/data/page-dates.json') ? JSON.parse(readFileSync('site/data/page-dates.json', 'utf8')) : {};
const lastmod = Object.fromEntries(Object.entries(dates).map(([path, { date }]) => [`${base}${path}`, date]));

const SECTIONS = ['templates', 'guides', 'clauses', 'free-tools', 'compare', 'docs'];   // everything else goes in "pages"
const sectionOf = (p) => SECTIONS.find((s) => p.startsWith(s + '/')) || 'pages';
const entry = (f) => {
  const p = f.replace(/index\.html$/, '');
  const loc = `${base}${p}`;
  return `  <url><loc>${loc}</loc>${lastmod[loc] ? `<lastmod>${lastmod[loc]}</lastmod>` : ''}<priority>${p === '' ? '1.0' : p.startsWith('docs') ? '0.6' : '0.8'}</priority></url>`;
};
const urlset = (files) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files.map(entry).join('\n')}\n</urlset>\n`;

writeFileSync('sitemap.xml', urlset(pages));
mkdirSync('sitemaps', { recursive: true });
const names = ['pages', ...SECTIONS];
for (const name of names) writeFileSync(`sitemaps/${name}.xml`, urlset(pages.filter((f) => sectionOf(f.replace(/index\.html$/, '')) === name)));
// Each section sitemap's lastmod is its newest page, so crawlers can skip sections where nothing changed.
const newest = (name) => pages.filter((f) => sectionOf(f.replace(/index\.html$/, '')) === name).map((f) => lastmod[`${base}${f.replace(/index\.html$/, '')}`]).filter(Boolean).sort().at(-1);
writeFileSync('sitemap_index.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${names.map((n) => `  <sitemap><loc>${base}sitemaps/${n}.xml</loc>${newest(n) ? `<lastmod>${newest(n)}</lastmod>` : ''}</sitemap>`).join('\n')}\n</sitemapindex>\n`);
writeFileSync('robots.txt', `User-agent: *\nAllow: /\nDisallow: /app/\nSitemap: ${base}sitemap_index.xml\nSitemap: ${base}sitemap.xml\n`);
console.log(`sitemap: ${pages.length} pages in sitemap.xml and ${names.length} section sitemaps (${pages.filter((f) => lastmod[`${base}${f.replace(/index\.html$/, '')}`]).length} with lastmod); robots.txt written`);
