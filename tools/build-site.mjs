// Builds the static marketing/docs/legal pages from site/*.mjs page modules into the deploy tree.
// Run with `npm run build:site`. Outputs are committed so GitHub Pages needs no build step.
import { writeFileSync, mkdirSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { head, footer, embedPage, crumbsLd, SITE, LASTMOD, LASTMOD_LONG, longDate } from './partials.mjs';

const pages = [];
for (const f of readdirSync('site').filter((f) => f.endsWith('.mjs'))) {
  const mod = await import('../site/' + f);
  for (const p of mod.pages) pages.push(p);
}
// Shorter <title>s for pages whose headline is too long for search results (about 60 characters).
const SEO_TITLES = {
  'compare/clio-draft-alternative.html': 'Clio Draft alternative that never uploads client files',
  'compare/hotdocs-alternative.html': 'HotDocs alternative: document automation in the browser',
  'for/consultants.html': 'Proposal, SOW and contractor agreement automation',
  'for/hr-teams.html': 'Free HR letter templates: offer, warning, promotion (Word)',
  'for/law-firms.html': 'Document automation for small law firms, with no uploads',
  'guides/automate-word-templates.html': 'How to automate a Word template without uploading it',
  'guides/client-intake-without-a-portal.html': 'Client intake without a portal: collect answers privately',
  'guides/conditional-clauses-in-word.html': 'Conditional clauses in Word: include or remove paragraphs',
  'guides/confidentiality-checklist-document-software.html': 'Confidentiality checklist for choosing document software',
  'guides/how-to-write-a-freelance-contract.html': 'How to write a freelance contract: 10 key clauses',
  'pricing/': 'Clausery pricing: free plan, Pro from $19 per user',
  'guides/how-to-write-a-job-description.html': 'How to write a job description (with a free template)',
  'guides/how-to-write-an-invoice.html': 'How to write an invoice: what to include, how to number it',
  'guides/what-is-a-hold-harmless-agreement.html': 'What is a hold harmless agreement? Types and examples',
};
for (const k of Object.keys(SEO_TITLES)) if (!pages.some((p) => p.path === k)) throw new Error('SEO_TITLES: no page ' + k);
// Pages without their own breadcrumb data get one from their path (Home › section › page), so every indexable page has
// structured data. Sections listed here have an index page; anything else links straight from Home.
const SECTIONS = { docs: 'Docs', compare: 'Compare', 'free-tools': 'Free tools', guides: 'Guides', clauses: 'Clauses', templates: 'Templates', 'invoice-templates': 'Invoice templates' };
for (const p of pages) {
  if (p.layout === 'embed' || p.path === '' || p.path === '404.html' || /BreadcrumbList/.test(p.extraHead || '')) continue;
  const section = p.path.includes('/') ? p.path.split('/')[0] : null;
  const items = [['Home', '']];
  if (section && SECTIONS[section] && p.path !== section + '/') items.push([SECTIONS[section], section + '/']);
  items.push([p.title, p.path]);
  p.extraHead = (p.extraHead || '') + crumbsLd(items);
}
// Last-modified dates (sitemap lastmod, dateModified, "Updated" lines) come from site/data/page-dates.json: each page's
// date and a hash of its content. A page whose content hash changes gets today's date; an unchanged page keeps its
// date, so rebuilding never makes old pages look new and CI's "generated files are up to date" check stays stable.
// The hash covers the title, description, structured data and body, minus blocks wrapped in <!--nav-->…<!--/nav-->
// (lists of related or all pages, and repeated calls to action), so adding a template elsewhere or rewording a sitewide
// call to action does not mark every page as changed.
const DATES_FILE = 'site/data/page-dates.json';
const dates = existsSync(DATES_FILE) ? JSON.parse(readFileSync(DATES_FILE, 'utf8')) : {};
const today = process.env.CLAUSERY_BUILD_DATE || new Date().toISOString().slice(0, 10);
const contentHash = (p, rel) => createHash('sha256').update([p.title, p.description, p.extraHead || '', p.body(rel)].join('\n').replace(/<!--nav-->[\s\S]*?<!--\/nav-->/g, '')).digest('hex').slice(0, 16);
const pageDate = (p, rel) => {
  const hash = contentHash(p, rel);
  const known = dates[p.path];
  if (!known || known.hash !== hash) dates[p.path] = { date: known ? today : p.published || today, hash };
  return dates[p.path].date;
};
for (const p of pages) {
  // GitHub Pages serves 404.html for a miss at any depth, so its links must be root-relative, not relative to its file.
  const rel = p.path === '404.html' ? '/' : p.path.split('/').filter(Boolean).length - (p.path.endsWith('/') || p.path === '' ? 0 : 1) > 0 ? '../'.repeat(p.path.split('/').filter(Boolean).length - (p.path.endsWith('/') || p.path === '' ? 0 : 1)) : './';
  const out = p.path === '' ? 'index.html' : p.path.endsWith('/') ? p.path + 'index.html' : p.path;
  const html = p.layout === 'embed' ? embedPage({ title: p.title, description: p.description, extraHead: p.extraHead, rel, body: p.body(rel) })
    : (head({ title: SEO_TITLES[p.path] || p.title, description: p.description, path: p.path, extraHead: p.extraHead || '', ogImage: p.ogImage, rel }) + p.body(rel) + footer(rel)).replace(/<pre>/g, '<pre tabindex="0">');
  const modified = p.layout === 'embed' ? null : pageDate(p, rel);
  p.modified = modified;
  mkdirSync(dirname(out), { recursive: true });
  let final = modified ? html.split(LASTMOD_LONG).join(longDate(modified)).split(LASTMOD).join(modified) : html;
  // "Updated …" only appears once a page has changed since it was published.
  final = final.replace(/<!--upd-->([\s\S]*?)<!--\/upd-->/g, (m, inner) => (p.published && p.published === modified ? '' : inner));
  writeFileSync(out, final);
  console.log('wrote', out);
}
// Keep only pages that still exist, in a stable order, so the file diffs cleanly.
const live = new Set(pages.filter((p) => p.layout !== 'embed').map((p) => p.path));
writeFileSync(DATES_FILE, JSON.stringify(Object.fromEntries(Object.keys(dates).filter((k) => live.has(k)).sort().map((k) => [k, dates[k]])), null, 1) + '\n');
console.log(`wrote ${DATES_FILE}`);

// Atom feed of guides and clause pages (pages marked `feed: true`), for feed readers and aggregators. Entries are ordered
// by their `published` date; <updated> is the page's last-modified date from page-dates.json, never the build time.
const BASE = SITE;
const xmlEsc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const feed = pages.filter((p) => p.feed).sort((a, b) => (b.published + b.path).localeCompare(a.published + a.path));
const updated = feed.map((p) => p.modified).sort().at(-1);
writeFileSync('feed.xml', `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Clausery: guides and clause library</title>
  <subtitle>Practical guides to drafting and automating documents, and plain-English explanations of contract clauses.</subtitle>
  <link rel="self" href="${BASE}feed.xml"/>
  <link rel="alternate" href="${BASE}"/>
  <id>${BASE}</id>
  <updated>${updated}T00:00:00Z</updated>
  <author><name>Clausery</name></author>
${feed.map((p) => `  <entry>
    <title>${xmlEsc(p.title)}</title>
    <link href="${BASE}${p.path}"/>
    <id>${BASE}${p.path}</id>
    <published>${p.published}T00:00:00Z</published>
    <updated>${p.modified}T00:00:00Z</updated>
    <summary>${xmlEsc(p.description)}</summary>
  </entry>`).join('\n')}
</feed>
`);
console.log(`wrote feed.xml (${feed.length} entries)`);

// llms.txt (llmstxt.org): a plain summary and link map for AI assistants and answer engines.
const section = (prefix) => pages.filter((p) => p.path.startsWith(prefix) && !p.path.endsWith('/') && !p.noindex).map((p) => `- [${p.title}](${BASE}${p.path}): ${p.description}`).join('\n');
writeFileSync('llms.txt', `# Clausery

> Clausery is browser-based document automation. It turns ordinary Word (.docx) templates with {tags} into guided questionnaires and generates finished documents entirely on the user's device: no upload, no account, works offline. Every template in its free library can be downloaded or filled in at no cost, with no limit; up to three of the user's own templates are also free. The Pro plan adds unlimited own templates, calculations in the user's own templates, unlimited documents from a spreadsheet, an encrypted workspace and client intake forms.

Key facts:
- Documents are assembled in the browser; template files, answers and generated documents are never sent to a server.
- Templates are normal Word files. Tags: {name} for a value, {#condition}...{/condition} for optional text, {^condition}...{/condition} for the opposite, and {#list}...{/list} for repeating paragraphs or table rows.
- Pro plan: optional passphrase encryption of everything stored in the browser (AES-256-GCM) with auto-lock.
- Free Word templates, a contract clause library and free drafting tools are available without sign-up.
- Drafts save automatically, as the user types, to the browser's IndexedDB database. They survive reloads, restarts and closed tabs, stay until deleted, and move between devices with a backup file.
- The output is an editable Word .docx (printing to PDF is optional). A draft can be reopened, changed and downloaded again; each draft keeps a history of every document made from it, with the time and a SHA-256 fingerprint of the answers, and can restore earlier answers.
- Logic: conditional sections, show-when rules with expressions such as contract_value > 5000, and calculations. The free invoice, quote, purchase order, credit note and expense templates add up line items and tax.
- Repeat documents: a new invoice, quote, receipt, purchase order or credit note starts with the user's own details from the last one, the next number in their sequence and today's date; the client, items and amounts are never copied.
- Invoice templates by trade (contractor, cleaning, photography, consulting and more) open an invoice with that trade's usual lines; prices are always the user's own.
- Invoice templates by country (UK VAT, Ireland VAT, Australia GST, New Zealand GST, Canada GST/HST, South Africa VAT) open an invoice with that country's tax name, standard rate, tax number label and currency set up; each page lists what the tax authority requires and links to it.
- Bulk generation: one document per row of a CSV spreadsheet (Free plan: 5 per spreadsheet; Pro: unlimited), assembled in the browser.
- Not included, by design: e-signatures (users sign with their own e-signature service), live co-editing and server integrations. Documents can be handed to Mail, Slack or Teams with the system share sheet where supported.
- Library templates are general samples written mainly for the US, Canada and the UK; guides cite official sources. The only official site is getclausery.github.io, released regularly (see the changelog).
- Clausery is software, not a law firm, and does not give legal advice.

## Product
- [Home](${BASE}): what Clausery does and who it is for
- [Open the app](${BASE}app/): runs in the browser, no sign-up
- [Pricing](${BASE}pricing/): Free, Pro, Team and Enterprise plans
- [Security](${BASE}docs/security.html): how data stays on the device
- [Documentation](${BASE}docs/): getting started, template syntax, logic, client intake

## Free Word templates
${section('templates/')}

## Invoice templates by trade and country
${section('invoice-templates/')}

## Contract clause library
${section('clauses/')}

## Guides
${section('guides/')}

## Free tools
${section('free-tools/')}

## Comparisons
${section('compare/')}
`);
console.log('wrote llms.txt');
