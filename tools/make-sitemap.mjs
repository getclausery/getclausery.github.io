// Writes the sitemaps for the public pages and robots.txt (the site is served from the origin root).
//
// - sitemap.xml: every public page in one file (kept for IndexNow and for anything already pointed at it).
// - sitemaps/<section>.xml + sitemap_index.xml: the same pages split by section. Submit sitemap_index.xml in Search
//   Console: its Pages report can then be filtered per sitemap, which shows which sections Google is and is not indexing.
//
// lastmod is only written where a real date is known: guide and clause pages carry the `published` date that also
// feeds feed.xml. Other pages get none, because a build-time date would claim every page changed on every build.
import { writeFileSync, readFileSync, mkdirSync, existsSync, globSync } from 'node:fs';
import { SITE } from './partials.mjs';

const base = SITE;
const skip = (f) => /^(node_modules|app|test-results|playwright-report|free-tools\/embed)\//.test(f) || f === '404.html' || f === 'offline.html' || /^google[0-9a-f]+\.html$/.test(f);   // search-console verification files; embed pages are noindex
const pages = globSync('**/*.html').map((f) => f.split('\\').join('/')).filter((f) => !skip(f)).sort();

// Dates from the Atom feed written by build-site (each entry's <updated> is the page's `published` date, never build time).
const lastmod = {};
if (existsSync('feed.xml')) {
  for (const [, entry] of readFileSync('feed.xml', 'utf8').matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const href = entry.match(/<link href="([^"]+)"/)?.[1];
    const day = entry.match(/<updated>(\d{4}-\d{2}-\d{2})/)?.[1];
    if (href && day) lastmod[href] = day;
  }
}

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
writeFileSync('sitemap_index.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${names.map((n) => `  <sitemap><loc>${base}sitemaps/${n}.xml</loc></sitemap>`).join('\n')}\n</sitemapindex>\n`);
writeFileSync('robots.txt', `User-agent: *\nAllow: /\nDisallow: /app/\nSitemap: ${base}sitemap_index.xml\nSitemap: ${base}sitemap.xml\n`);
console.log(`sitemap: ${pages.length} pages in sitemap.xml and ${names.length} section sitemaps (${Object.keys(lastmod).length} with lastmod); robots.txt written`);
