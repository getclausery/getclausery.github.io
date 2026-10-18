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
import { LIB } from '../site/library.mjs';

const base = SITE;
const skip = (f) => /^(node_modules|app|test-results|playwright-report|free-tools\/embed)\//.test(f) || f === '404.html' || f === 'offline.html' || f === 'made-with/index.html' || /^google[0-9a-f]+\.html$/.test(f);   // search-console verification files; embed pages are noindex
const pages = globSync('**/*.html').map((f) => f.split('\\').join('/')).filter((f) => !skip(f)).sort();
const dates = existsSync('site/data/page-dates.json') ? JSON.parse(readFileSync('site/data/page-dates.json', 'utf8')) : {};
const lastmod = Object.fromEntries(Object.entries(dates).map(([path, { date }]) => [`${base}${path}`, date]));

const SECTIONS = ['templates', 'invoice-templates', 'guides', 'clauses', 'free-tools', 'compare', 'docs', 'for', 'company'];   // everything else goes in "pages"
const COMPANY = (p) => p.startsWith('about/') || p.startsWith('contact/') || p.startsWith('press/') || p.startsWith('legal/') || p === 'changelog.html';
const sectionOf = (p) => COMPANY(p) ? 'company' : SECTIONS.find((s) => p.startsWith(s + '/')) || 'pages';
// Template pages carry their preview image in an image sitemap entry: image search can then send people to the page
// with the download, the questions and the full wording, not to a bare JPEG.
const TEMPLATE_BY_PATH = Object.fromEntries(LIB.map((t) => [`templates/${t.slug}.html`, t]));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const imageEntry = (path) => {
  const t = TEMPLATE_BY_PATH[path];
  if (!t) return '';
  const loc = `${base}assets/previews/${t.slug}.webp`;
  return `<image:image><image:loc>${loc}</image:loc><image:title>${esc(`${t.name} template for Word`)}</image:title><image:caption>${esc(t.description || t.intro)}</image:caption></image:image>`;
};
const entry = (f) => {
  const p = f.replace(/index\.html$/, '');
  const loc = `${base}${p}`;
  const priority = p === '' ? '1.0' : p.startsWith('docs') ? '0.6' : p.startsWith('legal') || p === 'about/' || p.startsWith('contact/') ? '0.5' : '0.8';
  return `  <url><loc>${loc}</loc>${lastmod[loc] ? `<lastmod>${lastmod[loc]}</lastmod>` : ''}<priority>${priority}</priority>${imageEntry(p)}</url>`;
};
const urlset = (files, images = false) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${images ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ''}>\n${files.map(entry).join('\n')}\n</urlset>\n`;

writeFileSync('sitemap.xml', urlset(pages, true));
mkdirSync('sitemaps', { recursive: true });
const names = ['pages', ...SECTIONS];
for (const name of names) writeFileSync(`sitemaps/${name}.xml`, urlset(pages.filter((f) => sectionOf(f.replace(/index\.html$/, '')) === name), name === 'templates'));
// Each section sitemap's lastmod is its newest page, so crawlers can skip sections where nothing changed.
const newest = (name) => pages.filter((f) => sectionOf(f.replace(/index\.html$/, '')) === name).map((f) => lastmod[`${base}${f.replace(/index\.html$/, '')}`]).filter(Boolean).sort().at(-1);
writeFileSync('sitemap_index.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${names.map((n) => `  <sitemap><loc>${base}sitemaps/${n}.xml</loc>${newest(n) ? `<lastmod>${newest(n)}</lastmod>` : ''}</sitemap>`).join('\n')}\n</sitemapindex>\n`);
// Allow the public app entry URLs to be fetched so crawlers can read their noindex meta. This does not add them to
// the sitemap. Keep activation, other app paths, samples and marketing excluded. The theme and manifest remain
// crawlable for the public site. Robots directives are crawl hints, never access controls for confidential data.
writeFileSync('robots.txt', `User-agent: *\nAllow: /\nAllow: /app/$\nAllow: /app/?*\nAllow: /app/index.html$\nAllow: /app/index.html?*\nAllow: /app/theme.js\nAllow: /app/manifest.webmanifest\nDisallow: /app/\nDisallow: /samples/\nDisallow: /marketing/\nSitemap: ${base}sitemap_index.xml\nSitemap: ${base}sitemap.xml\n`);
console.log(`sitemap: ${pages.length} pages in sitemap.xml and ${names.length} section sitemaps (${pages.filter((f) => lastmod[`${base}${f.replace(/index\.html$/, '')}`]).length} with lastmod); robots.txt written`);
