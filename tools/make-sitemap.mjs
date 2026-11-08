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
// Exclude pages the page module marks noindex (social landing pages, iframes, internal flows).
// Detect by meta robots tag containing "noindex" in the built HTML.
const NOINDEX = new Set(pages.filter((f) => {
  try { return readFileSync(f, 'utf8').includes('name="robots" content="noindex'); }
  catch { return false; }
}));
const indexable = pages.filter((f) => !NOINDEX.has(f));
const dates = existsSync('site/data/page-dates.json') ? JSON.parse(readFileSync('site/data/page-dates.json', 'utf8')) : {};
const lastmod = Object.fromEntries(Object.entries(dates).map(([path, { date }]) => [`${base}${path}`, date]));

const SECTIONS = ['templates', 'invoice-templates', 'guides', 'clauses', 'free-tools', 'compare', 'docs', 'for', 'company'];   // everything else goes in "pages"
const COMPANY = (p) => p.startsWith('about/') || p.startsWith('contact/') || p.startsWith('press/') || p.startsWith('legal/') || p.startsWith('why-clausery/') || p === 'changelog.html';
const sectionOf = (p) => COMPANY(p) ? 'company' : SECTIONS.find((s) => p.startsWith(s + '/')) || 'pages';
// Template pages carry their preview image in an image sitemap entry: image search can then send people to the page
// with the download, the questions and the full wording, not to a bare JPEG. Additionally every page whose OG image
// is non-generic (i.e. not the shared og.png) gets that OG image listed in the image sitemap so share previews and
// Google image search can discover it.
const TEMPLATE_BY_PATH = Object.fromEntries(LIB.map((t) => [`templates/${t.slug}.html`, t]));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const ogImageByPath = {};
for (const f of indexable) {
  try {
    const html = readFileSync(f, 'utf8');
    const m = html.match(/<meta property="og:image" content="https:\/\/getclausery\.github\.io\/([^"]+)"/);
    if (m && m[1] !== 'assets/og.png') ogImageByPath[f.replace(/index\.html$/, '')] = m[1];
  } catch { /* ignore read errors */ }
}
const imageTag = (loc, title, caption) => `<image:image><image:loc>${base}${loc}</image:loc>${title ? `<image:title>${esc(title)}</image:title>` : ''}${caption ? `<image:caption>${esc(caption)}</image:caption>` : ''}</image:image>`;
const imageEntry = (path) => {
  const parts = [];
  const t = TEMPLATE_BY_PATH[path];
  if (t) parts.push(imageTag(`assets/previews/${t.slug}.webp`, `${t.name} template for Word`, t.description || t.intro));
  const og = ogImageByPath[path];
  if (og && !(t && og === `assets/og/${t.slug}.png`)) {
    const title = path.replace(/\/$/, '').split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    parts.push(imageTag(og, title));
  }
  return parts.join('');
};
const entry = (f) => {
  const p = f.replace(/index\.html$/, '');
  const loc = `${base}${p}`;
  const priority = p === '' ? '1.0' : p.startsWith('docs') ? '0.6' : p.startsWith('legal') || p === 'about/' || p.startsWith('contact/') ? '0.5' : '0.8';
  return `  <url><loc>${loc}</loc>${lastmod[loc] ? `<lastmod>${lastmod[loc]}</lastmod>` : ''}<priority>${priority}</priority>${imageEntry(p)}</url>`;
};
const urlset = (files, images = false) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${images ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ''}>\n${files.map(entry).join('\n')}\n</urlset>\n`;

writeFileSync('sitemap.xml', urlset(indexable, true));
mkdirSync('sitemaps', { recursive: true });
const names = ['pages', ...SECTIONS];
const anyImage = (files) => files.some((f) => imageEntry(f.replace(/index\.html$/, '')));
for (const name of names) {
  const sectionFiles = indexable.filter((f) => sectionOf(f.replace(/index\.html$/, '')) === name);
  writeFileSync(`sitemaps/${name}.xml`, urlset(sectionFiles, anyImage(sectionFiles)));
}
// Each section sitemap's lastmod is its newest page, so crawlers can skip sections where nothing changed.
const newest = (name) => indexable.filter((f) => sectionOf(f.replace(/index\.html$/, '')) === name).map((f) => lastmod[`${base}${f.replace(/index\.html$/, '')}`]).filter(Boolean).sort().at(-1);
writeFileSync('sitemap_index.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${names.map((n) => `  <sitemap><loc>${base}sitemaps/${n}.xml</loc>${newest(n) ? `<lastmod>${newest(n)}</lastmod>` : ''}</sitemap>`).join('\n')}\n</sitemapindex>\n`);
// Allow the public app entry URLs to be fetched so crawlers can read their noindex meta. This does not add them to
// the sitemap. Keep activation, other app paths, samples and marketing excluded. The theme and manifest remain
// crawlable for the public site. Robots directives are crawl hints, never access controls for confidential data.
writeFileSync('robots.txt', `User-agent: *\nAllow: /\nAllow: /app/$\nAllow: /app/?*\nAllow: /app/index.html$\nAllow: /app/index.html?*\nAllow: /app/theme.js\nAllow: /app/manifest.webmanifest\nDisallow: /app/\nDisallow: /samples/\nDisallow: /marketing/\nCrawl-delay: 1\n# Known offline site-mirror tools (HTTrack, SiteSucker, WebCopier etc.) — these\n# do not obey robots.txt in practice so this is a hint, not enforcement. The\n# actual anti-clone protections are in the running page (app/lib/copyguard.js,\n# site.js frame-bust, CMI banners) and legal (legal/dmca.html).\nUser-agent: HTTrack\nUser-agent: SiteSucker\nUser-agent: WebCopier\nUser-agent: Offline Explorer\nDisallow: /\nSitemap: ${base}sitemap_index.xml\nSitemap: ${base}sitemap.xml\nHost: ${base.replace(/\/$/,'')}\n`);
console.log(`sitemap: ${indexable.length} pages in sitemap.xml and ${names.length} section sitemaps (${indexable.filter((f) => lastmod[`${base}${f.replace(/index\.html$/, '')}`]).length} with lastmod); robots.txt written`);
