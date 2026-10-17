// Offline checks for the syndication surfaces. The Atom feed must contain exactly the generated guide and clause
// articles, with real page titles and editorial dates. llms.txt is a link map to indexable local pages, not to embeds,
// the noindex app, missing files or a second copy of the site. No network requests or build-time dates are used.
import { readFileSync, existsSync, globSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE } from './partials.mjs';

const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…' };
const decode = (s) => String(s).replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e[0] !== '#') return entities[e.toLowerCase()] ?? m;
  const code = e[1].toLowerCase() === 'x' ? Number.parseInt(e.slice(2), 16) : Number(e.slice(1));
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : m;
});
const textOf = (s) => decode(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(([, key, a, b]) => [key.toLowerCase(), decode(a ?? b)]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) => attributes(tag));
const fileFor = (url) => { const path = new URL(url).pathname.slice(1); return !path || path.endsWith('/') ? path + 'index.html' : path; };
const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
const flatten = (node) => Array.isArray(node) ? node.flatMap(flatten) : node && typeof node === 'object' ? [node, ...(node['@graph'] || []).flatMap(flatten)] : [];
const hasType = (node, type) => [node['@type']].flat().includes(type);

// Inputs can be replaced in unit tests, allowing malformed/missing entries and bad llms links to be exercised without
// ever modifying the committed generated files. The expected page set still comes from the real deploy tree.
export function checkFeeds({ feedXml = readFileSync('feed.xml', 'utf8'), llmsText = readFileSync('llms.txt', 'utf8') } = {}) {
  const failures = [];
  const fail = (file, message) => failures.push(`${file}: ${message}`);
  const files = ['guides', 'clauses'].flatMap((section) => globSync(`${section}/*.html`).filter((f) => f !== `${section}/index.html`)).sort();
  const expected = new Map(files.map((file) => [SITE + file, file]));
  const dates = JSON.parse(readFileSync('site/data/page-dates.json', 'utf8'));
  const indexed = new Set([...readFileSync('sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => decode(url)));
  const cache = new Map();
  const today = new Date(Date.now() + 864e5).toISOString().slice(0, 10); // tolerate the author's local day being ahead of CI
  const localUrl = (value, where) => {
    let url;
    try { url = new URL(value); } catch { fail(where, `link must be an absolute same-site URL: ${value}`); return null; }
    if (!value.startsWith(SITE) || url.origin !== new URL(SITE).origin || url.username || url.password || url.search || url.hash) {
      fail(where, `link must be an absolute same-site URL without query or fragment: ${value}`);
      return null;
    }
    return url.href;
  };
  const pageFor = (url, where) => {
    const file = fileFor(url);
    if (!existsSync(file)) { fail(where, `link has no generated file: ${url}`); return null; }
    if (!cache.has(file)) {
      const html = readFileSync(file, 'utf8');
      const nodes = [];
      for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try { nodes.push(...flatten(JSON.parse(json))); } catch { fail(file, 'invalid structured data'); }
      }
      cache.set(file, { html, nodes });
    }
    const page = cache.get(file);
    if (tags(page.html, 'meta').some((m) => m.name?.toLowerCase() === 'robots' && /\bnoindex\b/i.test(m.content || ''))) fail(where, `link points to a noindex page: ${url}`);
    if (!indexed.has(url)) fail(where, `link is not an indexable sitemap page: ${url}`);
    const canonicals = tags(page.html, 'link').filter((l) => l.rel === 'canonical');
    if (canonicals.length !== 1 || canonicals[0].href !== url) fail(where, `link must match the page's canonical URL: ${url}`);
    return page;
  };
  const field = (block, name, where) => {
    const matches = [...block.matchAll(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'g'))];
    if (matches.length !== 1) { fail(where, `expected exactly one ${name}`); return ''; }
    const raw = matches[0][1].trim();
    if (/<|&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/i.test(raw)) fail(where, `${name} must be XML-escaped text`);
    return decode(raw);
  };

  if (!/^<\?xml[^>]*>\s*<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom">/.test(feedXml) || !/<\/feed>\s*$/.test(feedXml)) fail('feed.xml', 'missing Atom feed root or namespace');
  const entries = [...feedXml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/g)].map(([, entry]) => entry);
  if (entries.length !== (feedXml.match(/<entry\b/g) || []).length) fail('feed.xml', 'malformed entry markup');
  if (entries.length !== expected.size) fail('feed.xml', `has ${entries.length} entries; expected exactly ${expected.size} guide and clause pages`);
  const header = feedXml.split(/<entry\b/)[0];
  if (field(header, 'id', 'feed.xml') !== SITE) fail('feed.xml', 'feed id must be the site URL');
  if (tags(header, 'link').filter((l) => l.rel === 'self' && l.href === SITE + 'feed.xml').length !== 1) fail('feed.xml', 'missing canonical self link');
  const newest = files.map((file) => dates[file]?.date).filter(Boolean).sort().at(-1);
  if (field(header, 'updated', 'feed.xml') !== `${newest}T00:00:00Z`) fail('feed.xml', 'feed updated must be the latest page-dates date among guides and clauses');

  const seen = new Set();
  for (const [i, entry] of entries.entries()) {
    const where = `feed.xml entry ${i + 1}`;
    const links = tags(entry, 'link').filter((l) => !l.rel || l.rel === 'alternate');
    if (links.length !== 1 || !links[0].href) { fail(where, 'expected one alternate page link'); continue; }
    const url = localUrl(links[0].href, where);
    if (!url) continue;
    if (seen.has(url)) fail(where, `duplicate entry: ${url}`);
    seen.add(url);
    if (field(entry, 'id', where) !== url) fail(where, 'entry id must equal its page link');
    if (!expected.has(url)) { fail(where, `not a guide or clause page: ${url}`); continue; }
    const page = pageFor(url, where);
    if (!page) continue;
    const { html, nodes } = page;
    const title = field(entry, 'title', where).replace(/\s+/g, ' ').trim();
    const h1 = textOf(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
    const pageTitle = textOf(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
    if (!title || (title !== h1 && title !== pageTitle)) fail(where, `title must match the page H1 or title: ${url}`);
    const article = nodes.find((n) => hasType(n, 'Article'));
    if (expected.get(url).startsWith('guides/') && !article) fail(where, 'guide has no Article publication date');
    const published = article?.datePublished || nodes.find((n) => hasType(n, 'WebPage') && n.url === url)?.datePublished;
    const modified = dates[expected.get(url)]?.date;
    if (!isDate(published) || published > today) fail(where, 'page has no valid, non-future publication date');
    if (!isDate(modified) || modified > today || modified < published) fail(where, 'page-dates must contain a valid modified date on or after publication');
    if (field(entry, 'published', where) !== `${published}T00:00:00Z`) fail(where, 'published must match the page Article.datePublished (or clause WebPage.datePublished)');
    if (field(entry, 'updated', where) !== `${modified}T00:00:00Z`) fail(where, 'updated must match page-dates.json');
    if (article && article.dateModified !== modified) fail(where, 'Article.dateModified must match page-dates.json');
    const publishedMeta = tags(html, 'meta').find((m) => m.property === 'article:published_time')?.content;
    if (publishedMeta !== published) fail(where, 'article:published_time must match the publication date');
  }
  for (const url of expected.keys()) if (!seen.has(url)) fail('feed.xml', `missing from feed: ${url}`);

  const llmsLinks = [...llmsText.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)];
  if (!llmsLinks.length) fail('llms.txt', 'has no Markdown links');
  const llmsSeen = new Set();
  for (const [, label, value] of llmsLinks) {
    if (!label.trim()) fail('llms.txt', `empty link label: ${value}`);
    const url = localUrl(value, 'llms.txt');
    if (!url) continue;
    if (llmsSeen.has(url)) fail('llms.txt', `duplicate link: ${url}`);
    llmsSeen.add(url);
    pageFor(url, 'llms.txt');
  }
  return { failures, entries: entries.length, guides: files.filter((f) => f.startsWith('guides/')).length, clauses: files.filter((f) => f.startsWith('clauses/')).length, llmsLinks: llmsLinks.length };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const result = checkFeeds();
  if (result.failures.length) {
    console.error(result.failures.join('\n'));
    process.exitCode = 1;
  } else console.log(`Feed checks passed: exactly ${result.entries} Atom entries (${result.guides} guides + ${result.clauses} clauses), page titles and editorial dates agree; ${result.llmsLinks} unique llms.txt links resolve to indexable same-site pages.`);
}
