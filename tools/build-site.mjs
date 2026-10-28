// Builds the static marketing/docs/legal pages from site/*.mjs page modules into the deploy tree.
// Run with `npm run build:site`. Outputs are committed so GitHub Pages needs no build step.
import { writeFileSync, mkdirSync, readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { head, footer, embedPage, crumbsLd, howToLd, faqLd, esc, SITE, LASTMOD, LASTMOD_LONG, longDate } from './partials.mjs';
import { PRICES, TRIAL_DAYS, REFUND_DAYS } from '../app/config.js';

const pages = [];
for (const f of readdirSync('site').filter((f) => f.endsWith('.mjs'))) {
  const mod = await import('../site/' + f);
  for (const p of mod.pages) pages.push(p);
}
// Shorter <title>s for pages whose headline is too long for search results (about 60 characters).
const SEO_TITLES = {
  'compare/clio-draft-alternative.html': 'Clio Draft alternative that never uploads client files',
  'compare/hotdocs-alternative.html': 'HotDocs alternative: document automation in the browser',
  'for/consultants.html': 'Free proposals, SOWs and contracts (Word)',
  'for/hr-teams.html': 'Free HR letter templates: offer, warning, promotion (Word)',
  'for/law-firms.html': 'Document automation for small law firms, with no uploads',
  'guides/automate-word-templates.html': 'How to automate a Word template without uploading it',
  'guides/client-intake-without-a-portal.html': 'Client intake without a portal: collect answers privately',
  'guides/conditional-clauses-in-word.html': 'Conditional clauses in Word: include or remove paragraphs',
  'guides/confidentiality-checklist-document-software.html': 'Confidentiality checklist for choosing document software',
  'guides/how-to-write-a-freelance-contract.html': 'How to write a freelance contract: 10 key clauses',
  'pricing/': `Clausery pricing: Free plan, Pro $${PRICES.pro}/user with a free trial`,
  'guides/how-to-write-a-job-description.html': 'How to write a job description (with a free template)',
  'guides/how-to-write-an-invoice.html': 'How to write an invoice: what to include, how to number it',
  'guides/gst-hst-invoice-requirements-canada.html': 'GST/HST invoice requirements in Canada: what to show',
  'guides/tax-invoice-requirements-australia.html': 'Tax invoice requirements in Australia: the seven details',
  'guides/what-bank-details-to-put-on-an-invoice.html': 'What bank details to put on an invoice (and stop fraud)',
  'guides/what-to-include-on-a-vat-invoice.html': 'What a VAT invoice must include (UK): full and simplified',
  'guides/what-is-a-hold-harmless-agreement.html': 'What is a hold harmless agreement? Types and examples',
};
for (const k of Object.keys(SEO_TITLES)) if (!pages.some((p) => p.path === k)) throw new Error('SEO_TITLES: no page ' + k);
// Pages without their own breadcrumb data get one from their path (Home › section › page), so every indexable page has
// structured data. Sections listed here have an index page; anything else links straight from Home.
const SECTIONS = { docs: 'Docs', compare: 'Compare', 'free-tools': 'Free tools', guides: 'Guides', clauses: 'Clauses', templates: 'Templates', 'invoice-templates': 'Invoice templates', for: "Who it's for" };
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
// Shared helpers used during per-page rendering and later for the search index and 404 suggestions.
const prettyTitle = (t) => String(t).replace(/\s*[·\-–—]\s*Clausery.*$/,'').replace(/\s*\(.*?\)\s*$/,'').trim() || t;
const STOPWORDS = new Set(['a','an','the','and','or','of','for','to','in','on','with','is','it','you','your','free','template','word','letter','agreement','clause','how','what','guide','clausery','page','form','when','do','i','can','be','by','from','not','this','that','are','at','as','about','into','more','all','use','using','need','write']);
const toks = (s) => String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(/\s+/).filter((w) => w && w.length > 2 && !STOPWORDS.has(w));
const indexable = pages.filter((pp) => pp.layout !== 'embed' && !pp.noindex && !pp.path.startsWith('.well-known') && !['404.html', 'go/', 'made-with/'].some((x) => pp.path === x || pp.path.startsWith(x)));
// Build prev/next sibling chains for long-form pages (templates, clauses, guides, free tools, comparisons,
// audience pages, invoice/NDA subpages) in source-file order. `<link rel=prev/next>` in the head strengthens
// crawl chaining; a visible "Previous / Next" block below the article improves bounce rate. Previously this
// only covered guides.
const chainIdx = {};
function chain(regex) {
  const list = pages.filter((p) => regex.test(p.path) && !p.noindex && p.layout !== 'embed');
  list.forEach((p, i, arr) => { chainIdx[p.path] = { i, arr }; });
}
for (const rx of [/^guides\/[^/]+\.html$/,/^templates\/[^/]+\.html$/,/^clauses\/[^/]+\.html$/,/^free-tools\/[^/]+\.html$/,/^compare\/[^/]+\.html$/,/^invoice-templates\/[^/]+\.html$/,/^nda-templates\/[^/]+\.html$/,/^for\/[^/]+\.html$/]) chain(rx);
// Build a cross-type "Related reading" index for every long-form page. This is the biggest remaining internal-link
// cluster win: guides currently only link sibling guides, templates only link templates, and clauses only link
// clauses. A unified, server-rendered Related reading block that mixes templates, clauses, guides, free tools and
// competitor comparisons based on shared keywords/tags/clause membership closes those gaps and strengthens the
// topical graph across the whole site.
const CANDIDATES = indexable.filter((pp) => !pp.noindex && pp.layout !== 'embed' && pp.path !== '404.html' && pp.path !== '' && /^(templates|clauses|guides|free-tools|compare|for|invoice-templates|nda-templates)\//.test(pp.path)).map((pp) => {
  const title = prettyTitle(SEO_TITLES[pp.path] || pp.title);
  const kind = /^templates\//.test(pp.path) ? 'template' : /^clauses\//.test(pp.path) ? 'clause' : /^guides\//.test(pp.path) ? 'guide' : /^free-tools\//.test(pp.path) ? 'tool' : /^compare\//.test(pp.path) ? 'compare' : /^invoice-templates\//.test(pp.path) ? 'template' : /^nda-templates\//.test(pp.path) ? 'template' : 'hub';
  const seg = pp.path.split('/')[0];
  const segKw = { templates:'template',clauses:'clause',guides:'guide','free-tools':'calculator tool',compare:'alternative','for':'business','invoice-templates':'invoice','nda-templates':'nda' }[seg] || '';
  return { path: pp.path, title, kind, tokens: new Set(toks(title + ' ' + (pp.description||'') + ' ' + (pp.keywords||'') + ' ' + segKw)) };
});
// Score cross-type matches for a page. Token overlap is used as a tiebreaker; cross-type links are boosted so the
// block surfaces content from other sections rather than more of the same.
function relatedFor(p, limit = 6) {
  if (!/^(templates|clauses|guides|free-tools|compare|for|invoice-templates|nda-templates)\//.test(p.path)) return [];
  const title = prettyTitle(SEO_TITLES[p.path] || p.title);
  const seg = p.path.split('/')[0];
  const mine = new Set(toks(title + ' ' + (p.description||'') + ' ' + (p.keywords||'') + ' ' + seg));
  const isTpl = /^templates\//.test(p.path), isClause = /^clauses\//.test(p.path), isGuide = /^guides\//.test(p.path);
  const scored = CANDIDATES.filter((c) => c.path !== p.path).map((c) => {
    let s = 0;
    const crossType = !(isTpl && c.kind === 'template') && !(isClause && c.kind === 'clause') && !(isGuide && c.kind === 'guide');
    if (crossType) s += 3;
    for (const w of mine) if (c.tokens.has(w)) s += w.length >= 6 ? 2 : 1;
    const sameDir = p.path.split('/')[0] === c.path.split('/')[0];
    if (sameDir) s += 1;
    return { c, s };
  }).filter(({ s }) => s >= 4).sort((a, b) => b.s - a.s).slice(0, limit).map(({ c }) => c);
  return scored;
}
pages.filter(p => /^guides\/[^/]+\.html$/.test(p.path) && !p.noindex).forEach((p, i, arr) => { /* handled by chainIdx now */ });
for (const p of pages) {
  // GitHub Pages serves 404.html for a miss at any depth, so its links must be root-relative, not relative to its file.
  const rel = p.path === '404.html' ? '/' : p.path.split('/').filter(Boolean).length - (p.path.endsWith('/') || p.path === '' ? 0 : 1) > 0 ? '../'.repeat(p.path.split('/').filter(Boolean).length - (p.path.endsWith('/') || p.path === '' ? 0 : 1)) : './';
  const out = p.path === '' ? 'index.html' : p.path.endsWith('/') ? p.path + 'index.html' : p.path;
  const modified = p.layout === 'embed' ? null : pageDate(p, rel);
  p.modified = modified;
  let prev = null, next = null;
  const ch = chainIdx[p.path];
  if (ch) {
    const { i, arr } = ch;
    if (i > 0) prev = arr[i - 1].path;
    if (i < arr.length - 1) next = arr[i + 1].path;
  }
  // This page-level node is deliberately passed separately from extraHead: adding metadata must not make the content
  // hash (and therefore page-dates.json) claim that the editorial content changed.
  const hasPageNode = /"@type":"(CollectionPage|SearchResultsPage|AboutPage|ContactPage|WebSite)"/.test(p.extraHead || '');
  const skipPageLd = p.layout === 'embed' || p.noindex || p.path === '' || p.path === '404.html' || hasPageNode;
  // For pages flagged _howTo or _toc (guides, clauses, templates), render body first: add h2 slug ids,
  // server-rendered TOC, HowTo/Article/FAQ JSON-LD as appropriate.
  let renderedBody = null;
  const needsBodyPrep = (p._howTo || p._toc) && p.layout !== 'embed';
  if (needsBodyPrep) {
    renderedBody = p.body(rel);
    // Assign stable slug ids to every <h2>, collect sections for a server-rendered TOC.
    const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const seen = new Set();
    const tocSkip = /^(sources|questions|common questions|more on |free templates|related|ready to)/i;
    const headings = [];
    let hIdx = 0;
    renderedBody = renderedBody.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (m, attrs, inner) => {
      if (/\sid=/.test(attrs)) {
        const idM = attrs.match(/\sid="([^"]+)"/);
        if (idM && !/<a[^>]*class="h-anchor"/.test(inner)) {
          const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          const anchor = tocSkip.test(text) ? '' : `<a href="#${idM[1]}" class="h-anchor" aria-label="Link">#</a>`;
          if (anchor) return `<h2${attrs}>${inner}${anchor}</h2>`;
        }
        return m;
      }
      const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      const id = slug(text) || `section-${hIdx++}`;
      const unique = seen.has(id) ? `${id}-${++hIdx}` : id;
      seen.add(unique);
      if (!tocSkip.test(text)) headings.push({ id: unique, text });
      const anchor = tocSkip.test(text) ? '' : `<a href="#${unique}" class="h-anchor" aria-label="Link">#</a>`;
      return `<h2${attrs} id="${unique}">${inner}${anchor}</h2>`;
    });
    if (headings.length >= 3) {
      const tocItems = headings.map((h, idx) => `<li><a href="#${h.id}">${h.text}</a></li>`);
      const tocHtml = `<nav class="guide-toc" aria-label="On this page"><h4>On this page</h4><ol>${tocItems.join('')}</ol></nav>`;
      const firstH2 = renderedBody.match(/<h2[^>]* id="[^"]+">/);
      if (firstH2) renderedBody = renderedBody.slice(0, firstH2.index) + tocHtml + renderedBody.slice(firstH2.index);
      // TableOfContents JSON-LD unlocks "Jump to" section links in mobile SERPs for pages with a visible TOC.
      const tocLd = { '@context': 'https://schema.org', '@type': 'TableOfContents', '@id': `${SITE}${p.path}#toc`, url: `${SITE}${p.path}#toc`, name: 'On this page', mainEntityOfPage: { '@id': `${SITE}${p.path}#webpage` }, about: { '@id': `${SITE}${p.path}#article` }, itemListElement: headings.map((h, idx) => ({ '@type': 'ListItem', position: idx + 1, name: h.text, url: `${SITE}${p.path}#${h.id}` })) };
      p.extraHead = (p.extraHead || '') + `<script type="application/ld+json">${JSON.stringify(tocLd)}</script>`;
    }
    // Article schema on any long-form page with a published date (guides, clauses, templates and the deep-dive hubs).
    if (p.published) {
    // Derive about/mentions topics from h2 headings (visible DOM sections → schema.org Thing entities),
    // so search engines can connect the article to topical entities without us hard-coding a taxonomy.
    const stripTags = (s) => String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const topicTerm = (name) => ({ '@type': 'Thing', name: stripTags(name).slice(0, 80) });
    const topics = headings.filter((h) => h.text.length < 70 && !/common questions|questions$/i.test(h.text)).slice(0, 6).map((h) => topicTerm(h.text));
    const articleImage = p.ogImage
      ? { '@type': 'ImageObject', url: `${SITE}${p.ogImage}`, width: 1200, height: 630, ...(p.ogImage !== 'assets/og.png' ? { caption: stripTags(p.title) } : {}) }
      : { '@type': 'ImageObject', url: `${SITE}assets/og.png`, width: 1200, height: 630 };
    const articleLd = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', '@id': `${SITE}${p.path}#article`, isPartOf: { '@id': `${SITE}${p.path}#webpage` }, headline: p.title, description: p.description, datePublished: p.published, dateModified: modified, ...(modified ? { lastReviewed: modified, reviewedBy: { '@id': `${SITE}about/#editors`, name: 'Clausery editors' } } : {}), inLanguage: 'en-GB', image: [articleImage], mainEntityOfPage: `${SITE}${p.path}`, ...(p.ogImage && p.ogImage !== 'assets/og.png' ? { thumbnailUrl: `${SITE}${p.ogImage}` } : {}), ...(p._sources ? { citation: p._sources.map(([, u]) => u) } : {}), ...(topics.length ? { about: topics } : {}), ...(headings.length >= 3 ? { articleSection: headings.map((h) => h.text) } : {}), author: { '@id': `${SITE}about/#editors`, name: 'Clausery editors' }, publisher: { '@id': `${SITE}#organization`, name: 'Clausery' } })}</script>`;
    p.extraHead = articleLd + (p.extraHead || '');
    if (p._howTo) {
    const hasSteps = /<h2[^>]*>(What to include|How to|Steps to|Steps|What goes|What to write|How you can|How)/i.test(renderedBody) && /<ol>\s*<li><strong>/.test(renderedBody);
    if (hasSteps) {
      const howTo = howToLd({ name: p.title, description: p.description, steps: renderedBody, totalTime: 'PT10M' });
      p.extraHead += howTo;
    }
    // Auto-inject a short generic FAQ block (visible + JSON-LD) on guides that have no Questions section yet,
    // so every long-form article qualifies for FAQ rich results. Questions are generic and factual.
    if (!p.faq && !/<h2[^>]*>[^<]*Questions/i.test(renderedBody) && !/<div class="faq">/.test(renderedBody)) {
      const generic = [
        ['Is this guide and its template free?', 'Yes. Templates and guides are free to read, copy and adapt. Fill the Word version online or download the .docx with no account and nothing uploaded.'],
        ['Do I need a lawyer to review it?', 'These are general samples, not legal advice. Contract, employment and tax rules differ by country and state, so have anything important reviewed for your jurisdiction.'],
        ['Can I edit it in Word?', 'Yes. Download the .docx and edit it like any Word document, or add {tags} to turn it into a reusable questionnaire.'],
      ];
      p.extraHead += faqLd(generic);
      const inj = `<h2>Common questions</h2>\n<div class="faq">${generic.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`;
      if (renderedBody.includes('data-helpful=')) {
        renderedBody = renderedBody.replace(/<p class="helpful"/, inj + '\n<p class="helpful"');
      } else {
        renderedBody = renderedBody.replace(/(<\/div><\/section>)\s*$/, inj + '\n$1');
      }
    }
    } // close _howTo-only FAQ/HowTo block
    } // close p.published Article block
  }
  // Disambiguate any FAQPage JSON-LD on this page by giving it a stable @id and linking it to the page's WebPage node,
  // so generic FAQ questions across multiple pages are not merged into a single entity by schema consumers.
  if (p.extraHead && !p.noindex && p.layout !== 'embed' && p.path !== '404.html') {
    const pageId = `${SITE}${p.path}#webpage`;
    const faqId = `${SITE}${p.path}#faqpage`;
    p.extraHead = p.extraHead.replace(/<script type="application\/ld\+json">(\{[^<]*?"@type":"FAQPage"[^<]*?\})<\/script>/g, (_m, json) => {
      try {
        const obj = JSON.parse(json);
        if (!obj['@id']) {
          obj['@id'] = faqId;
          obj.url = `${SITE}${p.path}`;
          obj.isPartOf = { '@id': pageId };
          obj.mainEntityOfPage = { '@id': pageId };
          obj.inLanguage = 'en-GB';
        }
        return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
      } catch { return _m; }
    });
  }
  const editorNode = { '@context': 'https://schema.org', '@type': 'Person', '@id': `${SITE}about/#editors`, name: 'Clausery editors', url: `${SITE}about/#editors`, description: 'The editorial team that writes and reviews every guide, clause explanation, template default and calculator on Clausery — practising small-business owners, freelance contract drafters and bookkeepers who use the tool themselves.', worksFor: { '@id': `${SITE}#organization` }, knowsAbout: ['Small-business invoicing','Freelance contracts','UK VAT invoices','Australian GST tax invoices','South African tax invoices','Canadian GST/HST','New Zealand GST','Word document automation','Contract clauses','Bookkeeping for freelancers'], sameAs: ['https://github.com/getclausery/getclausery.github.io/graphs/contributors'] };
  // The Clausery product is a WebApplication / SoftwareApplication that generates Word .docx documents in the browser.
  // Emitting this once on every page lets Google connect the pages to the software product, which can trigger
  // "software" rich-result classification and associates keywords (invoice generator, NDA maker, etc.) with the
  // application entity. It also carries isAccessibleForFree=true and operatingSystem=Any, two signals that help
  // "free" / "no download" / "in browser" intent queries.
  const appNode = { '@context': 'https://schema.org', '@type': ['WebApplication','SoftwareApplication'], '@id': `${SITE}#app`, name: 'Clausery', url: `${SITE}app/`, applicationCategory: 'BusinessApplication', applicationSubCategory: 'Word document generator', operatingSystem: 'Any (web browser)', isAccessibleForFree: true, offers: { '@type': 'AggregateOffer', priceCurrency: 'USD', lowPrice: '0', highPrice: String(PRICES.proYearly), offerCount: 3, availability: 'https://schema.org/InStock', url: `${SITE}pricing/` }, publisher: { '@id': `${SITE}#organization` }, creator: { '@id': `${SITE}#organization` }, softwareVersion: '2.30.0', license: `${SITE}legal/license.html`, description: 'Free Word invoice, quote, receipt, contract and NDA generator. Build editable .docx documents in your browser — nothing is uploaded.' };
  // The source code repository (SoftwareSourceCode) gives the software entity a verifiable codebase pointer
  // and ties the Organization sameAs GitHub link into the schema graph. Emitted once per page so references
  // from codeRepository / targetProduct resolve consistently.
  const srcNode = { '@context': 'https://schema.org', '@type': 'SoftwareSourceCode', '@id': `${SITE}#source`, name: 'Clausery source', codeRepository: 'https://github.com/getclausery/getclausery.github.io', programmingLanguage: 'JavaScript', license: `${SITE}legal/license.html`, isAccessibleForFree: true, provider: { '@id': `${SITE}#organization` }, targetProduct: { '@id': `${SITE}#app` } };
  const pageLd = skipPageLd ? '' : `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': /^templates\/[^/]+\.html$/.test(p.path) ? 'ItemPage' : 'WebPage', '@id': `${SITE}${p.path}#webpage`, url: `${SITE}${p.path}`,
    name: SEO_TITLES[p.path] || p.title, description: p.description, inLanguage: 'en-GB', isPartOf: { '@id': `${SITE}#website` }, publisher: { '@id': `${SITE}#organization` },
    ...(p.published ? { datePublished: p.published } : {}), ...(modified ? { dateModified: modified, lastReviewed: modified, reviewedBy: { '@id': `${SITE}about/#editors` } } : {}),
    ...(p.ogImage && p.ogImage !== 'assets/og.png' ? { primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}${p.ogImage}`, width: 1200, height: 630 } } : {}),
    mentions: { '@id': `${SITE}#app` },
  })}</script><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE}#website`, url: SITE, name: 'Clausery', inLanguage: 'en-GB', publisher: { '@id': `${SITE}#organization` }, potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${SITE}search/?q={search_term_string}` }, 'query-input': 'required name=search_term_string' } })}</script><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', '@id': `${SITE}#organization`, name: 'Clausery', url: SITE, logo: { '@id': `${SITE}#logo`, '@type': 'ImageObject', url: `${SITE}assets/icon-512.png`, contentUrl: `${SITE}assets/icon-512.png`, width: 512, height: 512, encodingFormat: 'image/png' }, sameAs: ['https://github.com/getclausery/getclausery.github.io', 'https://github.com/getclausery'], contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: 'getclausery@gmail.com', availableLanguage: ['en-GB'] } })}</script><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SiteNavigationElement', '@id': `${SITE}#sitenav`, name: 'Main navigation', mainEntityOfPage: { '@id': `${SITE}#website` } })}</script><script type="application/ld+json">${JSON.stringify(editorNode)}</script><script type="application/ld+json">${JSON.stringify(appNode)}</script><script type="application/ld+json">${JSON.stringify(srcNode)}</script>`;
  const body = renderedBody !== null ? renderedBody : p.body(rel);
  // Inject a 3-question FAQ block + FAQPage JSON-LD on major hub index pages to answer top-of-funnel objections
  // and unlock FAQ rich-result snippets on hub SERPs.
  const HUB_FAQS = {
    'templates/': [
      ['Are the templates really free?', 'Yes. Every template on this page is free to fill in online and download as an editable Word .docx. No account, no credit card and no watermark on the document. The Free plan lets you make unlimited documents; paid Pro and Team plans add team vaults, branding and saved drafts.'],
      ['Do I need to sign up or give an email?', 'No. You can open any template, answer the questions and download a finished .docx without creating an account or giving an email address. Nothing you type is uploaded — the document is assembled in your browser.'],
      ['Can I edit the downloaded Word file?', 'Yes. Downloads are standard .docx files that open in Microsoft Word, Google Docs, LibreOffice, Apple Pages and any other editor that reads Word. You can keep editing after download; the {curly-brace} placeholders become plain text once you download.'],
    ],
    'clauses/': [
      ['Are these clauses legal advice?', 'No. The sample wording and explanations are general drafting information for reference, not legal advice. Contract law differs between countries and states, so have a lawyer review any clause you plan to rely on.'],
      ['Can I copy the sample wording into my own contract?', 'Yes. Every sample box has a "Copy the clause" button that copies the wording to your clipboard. Adapt the bracketed placeholders and check the wording against your deal and jurisdiction before signing.'],
      ['Do I need an account to read or copy the clauses?', 'No. All 24 clause explanations, sample wording and "what to negotiate" notes are free to read and copy without signing in or giving an email.'],
    ],
    'guides/': [
      ['Are the guides free to read?', 'Yes. Every guide on this page is free to read, no sign-up or paywall. Each one links to the relevant free Word template so you can put the advice into practice directly.'],
      ['Do the guides provide legal advice?', 'No. Guides explain how a document is usually structured and what the common options mean; they are drafting information, not legal advice tailored to your situation. Have a lawyer review important contracts.'],
      ['How often are the guides updated?', 'Guides are reviewed by the Clausery editors (small-business owners, contract drafters and bookkeepers). The "Reviewed by" line at the top of each guide shows the last review date.'],
    ],
    'free-tools/': [
      ['Are the calculators really free?', 'Yes. All nine calculators on this page run entirely in your browser and are free to use with no account, no email and no limit on calculations.'],
      ['Do I need to download anything?', 'No. Every calculator works in the browser page you are on — enter the numbers and the answer updates live. Nothing you enter is sent to a server.'],
      ['Can I save or print the result?', 'Yes. The Print/PDF button at the top of each calculator page sends a clean one-page result to your browser print dialog so you can save it as PDF or print it for your records.'],
    ],
    'for/': [
      ['Is Clausery free for my team to try?', 'Yes. The Free plan lets anyone make unlimited Word documents from any template with no account, so your team can try every template before deciding whether Pro or self-hosting fits.'],
      ['Which templates does my team use most?', 'Each team page lists the templates that team sends most often (e.g. offer letters and NDAs for HR; engagement letters for law firms; invoices and contracts for freelancers) and links to the relevant free templates.'],
      ['Can we self-host or white-label Clausery?', 'Yes. Clausery is open source under AGPLv3. The Self-host / Enterprise page explains deploying on your own domain, removing the branding and running without any external calls.'],
    ],
    'invoice-templates/': [
      ['Are the invoice templates free?', 'Yes. Every invoice template on this page is free to fill in online and download as an editable .docx, with totals, tax and numbering worked out for you. No account or credit card required.'],
      ['Do the invoices calculate totals automatically?', 'Yes. When you fill one in online, line totals, subtotal, tax, discount and grand total update as you type, and the next invoice number is suggested. Downloaded Word files keep the figures as plain numbers so you can edit them freely.'],
      ['Can I add my logo and branding?', 'Yes. The app lets you upload a logo, set your brand colour and save your business details so future invoices pre-fill automatically on your device.'],
    ],
    'compare/': [
      ['Are the comparisons independent?', 'Yes. Every comparison is written by Clausery editors and clearly labels Clausery as the maker of this site. We do not accept paid placements, sponsored positions or affiliate commissions from the tools listed; links to competitor sites go straight to the vendor.'],
      ['Do the prices shown stay up to date?', 'Vendor plans and prices change. Each page links to the vendor\u2019s official site and notes that the date of last review is not a fresh price check — confirm current pricing with the vendor before you buy.'],
      ['Can I try Clausery without paying?', 'Yes. The Free plan lets you make unlimited Word documents from any library template with no account and no credit card, so you can compare the output against your current tool on a real document before deciding.'],
    ],
    'nda-templates/': [
      ['Are the NDA templates free?', 'Yes. Every NDA on this page is free to download as an editable Word .docx and fill in online. No account, credit card or email required; nothing you type is uploaded.'],
      ['What\u2019s the difference between mutual and one-way NDAs?', 'A one-way NDA has only one side disclosing confidential information (e.g. you sharing a business idea with a contractor). A mutual NDA has both sides disclosing to each other (e.g. two companies exploring a partnership). Pick the version that matches the direction of disclosure.'],
      ['Can I edit the NDA after download?', 'Yes. Downloads are standard .docx files you can edit in Word, Google Docs, LibreOffice or Pages. Adapt the bracketed placeholders (parties, scope, term, jurisdiction) to your deal and have a lawyer review important agreements.'],
    ],
  };
  const hubFaq = HUB_FAQS[p.path];
  let finalBody = body;
  if (hubFaq) {
    const faqHtml = `<div class="faq" style="margin-top:2.5rem"><h2 style="font-size:1.15rem">Common questions</h2>${hubFaq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>`;
    p.extraHead = (p.extraHead || '') + faqLd(hubFaq);
    finalBody = body.replace(/(<\/div><\/section>)\s*$/, faqHtml + '$1');
  }
  // Inject a cross-type "Related reading" block on long-form pages, just before the helpful widget (or the final
  // </div></section> if there is no widget). This tightens internal-link clusters between templates ↔ clauses ↔
  // guides ↔ free tools ↔ comparisons without changing any page's editorial wording.
  const related = relatedFor(p, 6);
  if (related.length) {
    const kindLabel = { template: 'Templates', clause: 'Clause library', guide: 'Guides', tool: 'Free tools', compare: 'Comparisons', hub: 'Pages' };
    const grouped = {};
    for (const r of related) (grouped[r.kind] = grouped[r.kind] || []).push(r);
    const order = ['guide','template','clause','tool','compare','hub'];
    const relatedHtml = order.filter((k) => grouped[k] && grouped[k].length).map((k) => {
      const items = grouped[k].slice(0, k==='tool'||k==='compare'?3:4).map((r) => {
        // Directory of p (the page being built): if p ends with '/', that directory; otherwise the parent directory.
        const pdir = p.path === '' ? '' : (p.path.endsWith('/') ? p.path.slice(0, -1).split('/') : p.path.split('/').slice(0, -1));
        const psegs = pdir.length && pdir[0] === '' ? pdir.slice(1) : pdir;
        const rsegs = r.path.endsWith('/') ? r.path.slice(0, -1).split('/').filter(Boolean) : r.path.replace(/\.html$/, '').split('/').filter(Boolean);
        let common = 0; while (common < psegs.length && common < rsegs.length && psegs[common] === rsegs[common]) common++;
        const parts = [];
        for (let i = common; i < psegs.length; i++) parts.push('..');
        for (let i = common; i < rsegs.length; i++) parts.push(rsegs[i]);
        let href;
        if (parts.length === 0) href = './';
        else href = parts.join('/') + (r.path.endsWith('/') ? '/' : '.html');
        return `<li><a href="${href}">${esc(r.title)}</a></li>`;
      }).join('');
      return `<div><h4 style="font-size:.9rem;margin:0 0 .35rem;color:var(--muted)">${kindLabel[k]}</h4><ul class="link-list" style="margin:0">${items}</ul></div>`;
    }).join('');
    const block = `<section class="related-reading" aria-labelledby="related-reading-heading" style="margin-top:2.5rem;padding:1rem 1.25rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface2,var(--surface))"><h3 id="related-reading-heading" style="font-size:1rem;margin:0 0 .75rem">Related reading</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:.75rem 1.25rem">${relatedHtml}</div></section>`;
    // Insert before the helpful widget when present; otherwise before the closing section.
    if (/data-helpful=/.test(finalBody)) {
      finalBody = finalBody.replace(/(<p class="helpful")/, block + '$1');
    } else {
      finalBody = finalBody.replace(/(<\/div><\/section>)\s*$/, block + '$1');
    }
  }
  // Build a short auto-generated keywords tag from title + hub (top-level path segment) + "free Word template".
  const seoTitle = SEO_TITLES[p.path] || p.title;
  const hubMap = { templates: 'free Word template', guides: 'guide', clauses: 'contract clause', compare: 'alternative', 'free-tools': 'calculator', 'invoice-templates': 'invoice template', for: 'for small business', 'nda-templates': 'NDA', docs: 'docs' };
  const seg = p.path.split('/')[0];
  const hubK = hubMap[seg] || '';
  const kws = new Set();
  const clean = (s) => s.replace(/[·\-–—].*$/, '').replace(/\(.*?\)/g, '').replace(/[?]/g, '').trim();
  // Split on colon (subtitle separator) and use the part before the colon as the primary phrase.
  const beforeColon = clean(seoTitle).split(':')[0].trim();
  if (beforeColon && beforeColon.length > 2 && beforeColon.length < 60) kws.add(beforeColon.toLowerCase());
  // Add 2–4 word phrases from the title (lower-cased) skipping stop words / year / brand.
  const stop = /\b(free|template|word|clausery|download|online|2026|guide|the|a|an|for|with|and|or|of|in|on|to|from|your|you|it|that|this|is|are|be|by|as|at)\b/gi;
  const phrase = clean(seoTitle).toLowerCase().replace(stop, ' ').replace(/\s+/g, ' ').trim();
  if (phrase && phrase.length > 2 && phrase !== beforeColon.toLowerCase() && phrase.length < 60) kws.add(phrase);
  if (hubK) kws.add(hubK);
  kws.add('free');
  kws.add('Word');
  const autoKeywords = [...kws].filter(Boolean).slice(0, 7).join(', ');
  let html = p.layout === 'embed' ? embedPage({ title: p.title, description: p.description, extraHead: p.extraHead, rel, body: p.body(rel) })
    : (head({ title: seoTitle, description: p.description, path: p.path, extraHead: p.extraHead || '', pageLd, ogImage: p.ogImage, ogType: p.feed ? 'article' : 'website', published: p.published, modified, rel, noindex: Boolean(p.noindex), prev, next, keywords: p.keywords || autoKeywords }) + finalBody + footer(rel)).replace(/<pre>/g, '<pre tabindex="0">');
  // Visible Previous / Next navigation at the foot of any chained long-form page. Inserted at </main> so it sits
  // directly above the site footer (matching the <link rel=prev/next> already in <head>).
  if ((prev || next) && p.layout !== 'embed') {
    const titleFor = (tpath) => prettyTitle(SEO_TITLES[tpath] || pages.find((pp) => pp.path === tpath)?.title || '');
    const relFor = (target) => {
      const pdir = p.path === '' ? [] : (p.path.endsWith('/') ? p.path.slice(0,-1).split('/').filter(Boolean) : p.path.split('/').slice(0,-1).filter(Boolean));
      const rsegs = target.replace(/\.html$/, '').split('/').filter(Boolean);
      let common=0;while(common<pdir.length&&common<rsegs.length&&pdir[common]===rsegs[common])common++;
      const parts=[];
      for(let i=common;i<pdir.length;i++)parts.push('..');
      for(let i=common;i<rsegs.length;i++)parts.push(rsegs[i]);
      let href = parts.length===0 ? './' : parts.join('/');
      href += '.html';
      return href;
    };
    const prevHtml = prev ? `<a class="prevnext prev" href="${relFor(prev)}" rel="prev"><span class="small muted">← Previous</span><strong>${esc(titleFor(prev))}</strong></a>` : '<span aria-hidden="true"></span>';
    const nextHtml = next ? `<a class="prevnext next" href="${relFor(next)}" rel="next"><span class="small muted">Next →</span><strong>${esc(titleFor(next))}</strong></a>` : '<span aria-hidden="true"></span>';
    const pnav = `<div class="wrap" style="max-width:46rem"><nav class="prevnext-nav" aria-label="Previous and next pages" style="margin-top:2rem;display:flex;gap:1rem;flex-wrap:wrap;justify-content:space-between"><style>.prevnext{display:block;padding:.85rem 1rem;border:1px solid var(--border);border-radius:var(--radius);text-decoration:none;color:inherit;background:var(--surface);flex:1 1 13rem;min-width:0;max-width:22rem;transition:border-color .15s}.prevnext:hover{border-color:var(--accent)}.prevnext .small{display:block}.prevnext strong{display:block;margin-top:.15rem;font-size:.95rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.prevnext.next{text-align:right}</style>${prevHtml}${nextHtml}</nav></div>`;
    html = html.replace('</main>', pnav + '</main>');
  }
  mkdirSync(dirname(out), { recursive: true });
  let final = modified ? html.split(LASTMOD_LONG).join(longDate(modified)).split(LASTMOD).join(modified) : html;
  // "Updated …" only appears once a page has changed since it was published.
  final = final.replace(/<!--upd-->([\s\S]*?)<!--\/upd-->/g, (m, inner) => (p.published && p.published === modified ? '' : inner));
  // Inject an E-E-A-T "Reviewed by / Updated" byline on long-form pages that don't already have one (templates, compare, audience, free-tools).
  if (modified && !/guide-meta|Reviewed by/.test(final) && !p.noindex && p.layout !== 'embed' && !/^(\.|404|go\/|made-with\/|search\/|app\/|sitemap\/|feed|releases)/.test(p.path) && /<h1[^>]*>/.test(final)) {
    const byline = `<p class="small muted guide-meta">Reviewed by <a href="${rel}about/#editors">Clausery editors</a> · <time datetime="${modified}">${longDate(modified)}</time></p>`;
    // Insert after the first <h1>... </h1> (and any immediate <p class="lead"> following it is fine — place right after h1).
    final = final.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)(\s*<p class="lead")/, `$1\n${byline}$2`);
    if (!/Reviewed by/.test(final)) {
      final = final.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/, `$1\n${byline}`);
    }
  }
  // Reading-time badge: count visible words in <main> and append a short "X min read" pill to the first .guide-meta,
  // or inject one right after the h1 if no byline exists. ~200 wpm reading speed for English prose.
  if (!p.noindex && p.layout !== 'embed' && /<h1[^>]*>/.test(final) && !p.path.startsWith('app/') && !p.path.endsWith('.pdf')) {
    const main = final.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    if (main) {
      const text = main[1].replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'').replace(/<[^>]+>/g,' ').replace(/&[a-z]+;/g,' ');
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      if (words > 200) {
        const mins = Math.max(1, Math.round(words / 220));
        const badge = ` <span aria-label="${mins} minute read" title="~${words.toLocaleString()} words, ${mins} min read">· ${mins} min read</span>`;
        if (/class="small muted guide-meta"/.test(final)) {
          final = final.replace(/(class="small muted guide-meta"[^>]*>[\s\S]*?<\/p>)/, (m) => m.replace('</p>', badge + '</p>'));
        }
      }
    }
  }
  // Print/PDF + Share buttons on every long-form page. Styles live in site.css (.page-print-btn).
  if (!p.noindex && p.layout !== 'embed' && !p.path.endsWith('.pdf') && /<h1[^>]*>/.test(final) && !p.path.startsWith('app/')) {
    const printBtn = `<button type="button" class="page-print-btn" onclick="window.print()" title="Print or save as PDF" aria-label="Print">Print/PDF</button>`;
    const shareBtn = `<button type="button" class="page-print-btn page-share-btn" onclick="(function(s,b){if(navigator.share){navigator.share({title:document.title,url:location.href}).catch(()=>{})}else{navigator.clipboard.writeText(location.href);b.textContent='Link copied';setTimeout(()=>b.textContent='Share',1500)}})(this,this)" title="Share this page or copy link" aria-label="Share">Share</button>`;
    final = final.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/, `$1${shareBtn}${printBtn}`);
  }
  // Auto-inject a Breadcrumb nav on any indexable long-form page that doesn't already have one, so crawlers
  // and screen readers get a visible trail. The existing regex below adds RDFa microdata to these navs.
  if (!p.noindex && p.layout !== 'embed' && /<h1[^>]*>/.test(final) && !p.path.startsWith('app/') && p.path !== '404.html' && p.path !== '' && !/aria-label="Breadcrumb"/.test(final) && !p.path.endsWith('.pdf')) {
    const segs = p.path.replace(/\/index\.html$/, '/').split('/').filter(Boolean);
    const LABELS = {templates:'Templates',clauses:'Clause library',guides:'Guides','free-tools':'Free tools',compare:'Compare',pricing:'Pricing',about:'About',customers:'Customers','why-clausery':'Why Clausery',for:'Who it\u2019s for','invoice-templates':'Invoice templates','nda-templates':'NDA templates',contact:'Contact',roadmap:'Roadmap',status:'Status','self-hosting':'Self-host',press:'Press',docs:'Docs',legal:'Legal','business-document-kit':'Business document kit',marketing:'Marketing',madeWith:'Made with',search:'Search',sitemap:'Sitemap',changelog:'Changelog'};
    const label = (s) => LABELS[s] || s.replace(/-/g,' ').replace(/\b\w/g,(c)=>c.toUpperCase());
    const crumbHtml = [`<a href="${rel}">Home</a>`];
    let accum = rel;
    segs.forEach((s,i) => { accum += s + '/'; if (i < segs.length - 1) crumbHtml.push(`<a href="${accum}">${esc(label(s))}</a>`); });
    const lastSeg = segs[segs.length-1] ? segs[segs.length-1].replace(/\.html$/,'') : '';
    const lastLabel = lastSeg ? label(lastSeg) : 'Home';
    crumbHtml.push(`<span aria-current="page">${esc(lastLabel)}</span>`);
    const nav = `<nav class="small muted" aria-label="Breadcrumb">${crumbHtml.join(' › ')}</nav>`;
    final = final.replace(/(<h1[^>]*>)/, nav + '$1');
  }
  // Add BreadcrumbList microdata to inline hand-written breadcrumb navs (visible DOM parity with crumbsLd JSON-LD).
  final = final.replace(/<nav([^>]*)aria-label="Breadcrumb"([^>]*)>([\s\S]*?)<\/nav>/g, (m, pre, post, inner) => {
    if (/itemscope/.test(inner)) return m; // already has microdata (from crumbsHtml helper)
    let pos = 0;
    const linkRe = /<a([^>]*?)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g;
    const lastRe = /<span aria-current="page">([^<]*)<\/span>/;
    const lastM = inner.match(lastRe);
    let out = inner.replace(linkRe, (lm, a1, href, a2, txt) => {
      pos++;
      const clean = txt.replace(/<[^>]+>/g, '').trim();
      return `<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a itemprop="item"${a1}href="${href}"${a2}><span itemprop="name">${clean}</span></a><meta itemprop="position" content="${pos}"></li>`;
    });
    if (lastM) {
      pos++;
      out = out.replace(lastRe, () => `<li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><span itemprop="name" aria-current="page">${lastM[1]}</span><meta itemprop="position" content="${pos}"></li>`);
    } else {
      // Bare-text last crumb (hand-written breadcrumbs like "... › Consulting agreement"): wrap trailing text after last </li>
      const tailM = out.match(/<\/li>\s*›\s*([^<>]+?)\s*$/);
      if (tailM) {
        pos++;
        out = out.slice(0, tailM.index) + `</li> <span aria-hidden="true">›</span> <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><span itemprop="name" aria-current="page">${tailM[1]}</span><meta itemprop="position" content="${pos}"></li>`;
      }
    }
    // Replace any remaining raw › separators with aria-hidden spans (skip if already wrapped)
    out = out.replace(/(^|>[^<>]*?)›(?![^<]*<\/span>)/g, (m, pre) => pre + '<span aria-hidden="true">›</span>');
    const cls = /class="[^"]*"/.test(pre + post) ? '' : ' class="small muted"';
    return `<nav${pre}aria-label="Breadcrumb"${post}${cls} itemscope itemtype="https://schema.org/BreadcrumbList"><ol class="bdcrums">${out}</ol></nav>`;
  });
  // Smart 404 suggestions: embed a compact path→title map and a tiny client matcher. Tokenises the missing URL path,
  // scores every indexable page on word overlap / prefix / slug substring matches, and surfaces up to 6 matches before
  // the action buttons. This turns orphaned links and stale bookmarks into a recovery page instead of a dead end.
  if (p._404) {
    const suggestions = indexable.map((pp) => {
      const title = prettyTitle(SEO_TITLES[pp.path] || pp.title);
      const slug = pp.path.replace(/index\.html$/, '').replace(/\.html$/, '');
      return { t: title, p: '/' + slug };
    });
    const js = `(function(){var D=${JSON.stringify(suggestions)};function toks(s){return(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(/\\s+/).filter(Boolean)}var path=decodeURIComponent(location.pathname||'');var q=(location.hash||'').replace(/^#/,'').replace(/^\\//,'');var hay=path+'/'+q;var ht=toks(hay);if(!ht.length)return;var scored=[];for(var i=0;i<D.length;i++){var it=D[i];var slug=it.p.toLowerCase().replace(/\\.html$/,'').replace(/\\/$/,'');var st=toks(it.t+' '+slug.replace(/\\//g,' '));var sc=0;for(var j=0;j<ht.length;j++){var w=ht[j];if(!w)continue;for(var k=0;k<st.length;k++){var sw=st[k];if(sw===w)sc+=3;else if(sw.indexOf(w)===0&&w.length>=3)sc+=2;else if(sw.indexOf(w)>-1)sc+=1}if(slug.split('/').some(function(s){return s===w}))sc+=3;if(slug.indexOf(w)>-1&&w.length>=3)sc+=1}if(sc>2)scored.push({s:sc,it:it})}scored.sort(function(a,b){return b.s-a.s});var top=scored.slice(0,6);if(!top.length)return;var box=document.getElementById('suggested');var list=document.getElementById('suggested-list');if(!box||!list)return;for(var m=0;m<top.length;m++){var li=document.createElement('li');var a=document.createElement('a');a.href=top[m].it.p;a.textContent=top[m].it.t;li.appendChild(a);list.appendChild(li)}box.hidden=false})();`;
    final = final.replace('</body>', `<script>${js}</script></body>`);
  }
  // Wrap changelog release dates in <time datetime="YYYY-MM-DD"> so they are machine-readable (E-E-A-T freshness signals).
  if (p.path === 'changelog.html') {
    const months = { january:'01', february:'02', march:'03', april:'04', may:'05', june:'06', july:'07', august:'08', september:'09', october:'10', november:'11', december:'12' };
    final = final.replace(/<span class="small muted">— (\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})<\/span>/g, (_m, d, m, y) => {
      const iso = `${y}-${months[m.toLowerCase()]}-${String(d).padStart(2, '0')}`;
      return `<span class="small muted">— <time datetime="${iso}">${d} ${m} ${y}</time></span>`;
    });
  }
  writeFileSync(out, final);
  console.log('wrote', out);
}
// Build a compact search index for the in-page command palette, grouped by section.
const named=(list)=>list.map(p=>({t:prettyTitle(p.title),p:p.path}));
const searchIndex={
  templates:named(indexable.filter(p=>/^templates\/[^/]+\.html$/.test(p.path))),
  invoices:named(indexable.filter(p=>p.path.startsWith('invoice-templates/')&&p.path.endsWith('.html'))),
  guides:named(indexable.filter(p=>p.path.startsWith('guides/')&&p.path.endsWith('.html'))),
  clauses:named(indexable.filter(p=>p.path.startsWith('clauses/')&&p.path.endsWith('.html'))),
  tools:named(indexable.filter(p=>p.path.startsWith('free-tools/')&&p.path.endsWith('.html'))),
  pages:named(indexable.filter(p=>{
    if(/^templates\/[^/]+\.html$/.test(p.path))return false;
    if(p.path.startsWith('invoice-templates/')&&p.path.endsWith('.html'))return false;
    if(p.path.startsWith('guides/')&&p.path.endsWith('.html'))return false;
    if(p.path.startsWith('clauses/')&&p.path.endsWith('.html'))return false;
    if(p.path.startsWith('free-tools/')&&p.path.endsWith('.html'))return false;
    return true;
  })),
};
const searchJson=JSON.stringify(searchIndex);
writeFileSync('search-index.json',searchJson);
console.log(`wrote search-index.json (${Buffer.byteLength(searchJson)} bytes, ${searchIndex.templates.length+searchIndex.invoices.length+searchIndex.guides.length+searchIndex.clauses.length+searchIndex.tools.length+searchIndex.pages.length} entries)`);

// HTML sitemap: every indexable page grouped by section, with a CollectionPage + SiteNavigationElement hint.
{
  const GROUPS = [
    ['Start here', p => ['', 'templates/', 'invoice-templates/', 'pricing/', 'search/', 'changelog.html'].includes(p.path) && !p.noindex],
    ['Invoice templates', p => /^invoice-templates\//.test(p.path)],
    ['All Word templates', p => /^templates\//.test(p.path) || /^nda-templates\//.test(p.path) || /^business-document-kit\//.test(p.path)],
    ['Free calculators', p => /^free-tools\//.test(p.path)],
    ['Guides', p => /^guides\//.test(p.path)],
    ['Clause library', p => /^clauses\//.test(p.path)],
    ['Who it is for', p => /^for\//.test(p.path)],
    ['Compare', p => /^compare\//.test(p.path)],
    ['Docs, company & legal', p => /^(docs|about|contact|customers|why-clausery|self-hosting|roadmap|status|press|legal)/.test(p.path)],
  ];
  const escHtml = s => String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const rel = '../';
  const linkHtml = p => {
    const t = SEO_TITLES[p.path] || p.title;
    const d = (p.description || '');
    return `<li><a href="${rel}${p.path.replace(/\/index\.html$/,'/')}">${escHtml(t)}</a>${d ? ` <span class="small muted">— ${escHtml(d.slice(0,110))}${d.length>110?'…':''}</span>` : ''}</li>`;
  };
  const groupHtml = GROUPS.map(([label, pred]) => {
    const list = indexable.filter(pred).sort((a,b)=>(b.path===''?-1:0)||a.path.localeCompare(b.path));
    if(!list.length) return '';
    const id = label.toLowerCase().replace(/[^a-z]+/g,'-');
    return `<h2 id="${id}">${escHtml(label)} <span class="small muted">(${list.length})</span></h2><ul class="sitemap-list">${list.map(linkHtml).join('')}</ul>`;
  }).join('');
  const total = indexable.length;
  const body = `<section class="section"><div class="wrap prose" style="max-width:56rem"><nav class="small muted" aria-label="Breadcrumb"><a href="${rel}">Home</a> › Sitemap</nav><h1 style="margin-top:1rem">Sitemap (site map)</h1><p class="lead">A site map of every public page on Clausery — for people who prefer to browse and for crawlers. ${total} pages, all free, all in your browser.</p><p><strong>Quick links:</strong> ${GROUPS.map(([l])=>`<a href="#${l.toLowerCase().replace(/[^a-z]+/g,'-')}">${escHtml(l)}</a>`).join(' · ')}</p>${groupHtml}<p style="margin-top:2rem" class="small muted">There is also an <a href="${rel}sitemap_index.xml">XML sitemap</a> for crawlers, and an <a href="${rel}llms.txt">llms.txt</a> index for AI crawlers.</p></div></section>`;
  const listItems = indexable.map((p,i)=>({'@type':'ListItem',position:i+1,name:SEO_TITLES[p.path]||p.title,url:`${SITE}${p.path.replace(/\/index\.html$/,'/')}`}));
  const extraHead = `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage','@id':`${SITE}sitemap/#webpage`,url:`${SITE}sitemap/`,name:'Sitemap — every page on Clausery',description:`${total} public pages on Clausery: invoices, templates, guides, calculators and docs, all free Word files you can edit in the browser.`,inLanguage:'en-GB',isPartOf:{'@id':`${SITE}#website`},mainEntity:{'@type':'ItemList',numberOfItems:listItems.length,itemListElement:listItems}})}</script>`;
  mkdirSync('sitemap',{recursive:true});
  const sh = head({title:'Sitemap (site map) — every page on Clausery', description:`Site map of every public page on Clausery: ${total} free Word invoices, templates, contracts, NDAs, guides, calculators and docs, all in one list.`,path:'sitemap/',extraHead,rel})+body+footer(rel);
  writeFileSync('sitemap/index.html',sh.replace(/<pre>/g,'<pre tabindex="0">'));
  console.log('wrote sitemap/index.html');
}

// Keep only pages that still exist, in a stable order, so the file diffs cleanly.
const live = new Set(pages.filter((p) => p.layout !== 'embed').map((p) => p.path));
live.add('sitemap/');
if (!dates['sitemap/']) dates['sitemap/'] = { date: today, hash: '0000000000000001' };
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

// Atom feed of releases (one entry per version in the changelog). Entries come from RELEASES exported by
// site/misc.mjs; we parse them once at build time so the page HTML and the feed stay in sync without
// screen-scraping. Dates are parsed from "DD MMMM YYYY" release headings and emitted as ISO UTC.
const months = { january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',july:'07',august:'08',september:'09',october:'10',november:'11',december:'12' };
const parseReleaseDate = (s) => {
  const m = s.trim().match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i);
  if (!m) return null;
  const mon = months[m[2].toLowerCase()];
  if (!mon) return null;
  return `${m[3]}-${mon}-${String(Number(m[1])).padStart(2,'0')}`;
};
let releases = [];
try { ({ releases } = await import('../site/misc.mjs')); } catch { /* site may not export releases during tests */ }
if (!Array.isArray(releases)) releases = [];
if (releases.length) {
  releases = releases.filter((r) => r.version && r.date).map((r) => ({ ...r, iso: parseReleaseDate(r.date) })).filter((r) => r.iso);
  const relUpdated = releases.map((r) => r.iso).sort().at(-1);
  writeFileSync('releases.xml', `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Clausery releases</title>
  <subtitle>Release notes for Clausery: new templates, app features, fixes and policy changes.</subtitle>
  <link rel="self" href="${BASE}releases.xml"/>
  <link rel="alternate" href="${BASE}changelog.html"/>
  <id>${BASE}changelog.html</id>
  <updated>${relUpdated}T00:00:00Z</updated>
  <author><name>Clausery</name></author>
${releases.map((r) => `  <entry>
    <title>Clausery v${r.version} — ${r.summary || 'new release'}</title>
    <link href="${BASE}changelog.html#v${r.version.replace(/\./g,'-')}"/>
    <id>${BASE}changelog.html#v${r.version.replace(/\./g,'-')}</id>
    <published>${r.iso}T00:00:00Z</published>
    <updated>${r.iso}T00:00:00Z</updated>
    <summary>${xmlEsc(r.summary || `Clausery v${r.version} release notes.`)}</summary>
  </entry>`).join('\n')}
</feed>
`);
  console.log(`wrote releases.xml (${releases.length} entries)`);
}

// llms.txt (llmstxt.org): a plain summary and link map for AI assistants and answer engines.
// section(prefix) includes the section index (e.g. 'templates/') plus every non-noindex child page under that prefix.
const pageEntry = (p, displayTitle) => `- [${displayTitle || p.title}](${BASE}${p.path}): ${p.description}`;
const findPage = (path) => pages.find((p) => p.path === path);
const section = (prefix, opts = {}) => {
  const out = [];
  const idx = findPage(prefix);
  if (idx && !idx.noindex) out.push(pageEntry(idx));
  const kids = pages.filter((p) => p.path.startsWith(prefix) && p.path !== prefix && p.path.endsWith('.html') && !p.noindex);
  for (const p of kids) out.push(pageEntry(p));
  return out.join('\n');
};
// Product section: curated root-level marketing pages (explicit list so ordering is stable and editorial).
// Hubs that have their own dedicated section below (templates/, invoice-templates/, nda-templates/, for/,
// clauses/, guides/, free-tools/, compare/) are listed under those sections instead, to avoid duplicate links.
const productLinks = ['', 'about/', 'pricing/', 'why-clausery/', 'business-document-kit/', 'self-hosting/', 'customers/', 'press/', 'roadmap/', 'status/', 'docs/']
  .map((p) => {
    const page = findPage(p);
    if (!page || page.noindex) return null;
    return pageEntry(page, p === '' ? 'Home' : undefined);
  })
  .filter(Boolean).join('\n');
writeFileSync('llms.txt', `# Clausery (getclausery.github.io)

> NAME DISAMBIGUATION — READ FIRST. This is Clausery, an INDEPENDENT OPEN-SOURCE BUSINESS at getclausery.github.io that makes free Word invoices, quotes and receipts. It is NOT affiliated with Clausery.ai (https://www.clausery.ai/), which is a SEPARATE COMPANY selling enterprise compliance-management software (ISO 27001, DORA, GDPR, NIS2 policy and audit workflows). The two share the word "Clausery" but have different owners, teams, code, pricing, roadmaps and customers. Do not describe this site as "the free version of Clausery.ai", "owned by Clausery.ai", or "a compliance product" — it is a small-business document-generation tool.

Clausery helps small businesses and freelancers make invoices, quotes and receipts in editable Word (.docx) files with calculated totals. Document processing happens on the user's device. Its free business document kit contains six Word templates and instructions, with no email signup. It also turns ordinary Word templates with {tags} into guided questionnaires. Every library template can be downloaded or filled in free, with no account or document limit; up to three of the user's own templates are also free. Documents made from library templates on the Free plan end with a small "Made with Clausery" line. Pro ($${PRICES.pro} per user per month or $${PRICES.proYearly} per year) leaves that line out and adds unlimited own templates, calculations in those templates, unlimited documents from a spreadsheet, an encrypted workspace and client intake forms. Pro can be tried free for ${TRIAL_DAYS} days in the app with no card, and a first payment has a ${REFUND_DAYS}-day money-back guarantee.

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
- Billing workflows: a deposit invoice requests only the agreed upfront amount; an hourly invoice uses hours as quantities; a final invoice deducts actual payments from the full project total. Each has a worked example and a dedicated starter. The deposit page also calculates an agreed percentage and remaining balance locally.
- Bulk generation: one document per row of a CSV spreadsheet (Free plan: 5 per spreadsheet; Pro: unlimited), assembled in the browser.
- Not included, by design: e-signatures (users sign with their own e-signature service), live co-editing and server integrations. Documents can be handed to Mail, Slack or Teams with the system share sheet where supported.
- Library templates are general samples written mainly for the US, Canada and the UK; guides cite official sources. The only official site is getclausery.github.io, released regularly (see the changelog).
- Clausery is software, not a law firm, and does not give legal advice.

## Product
${productLinks}

## Free Word templates
${section('templates/')}

## Invoice templates by trade and country
${section('invoice-templates/')}

## NDA templates
${section('nda-templates/')}

## Who Clausery is for
${section('for/')}

## Contract clause library
${section('clauses/')}

## Guides
${section('guides/')}

## Free tools
${section('free-tools/')}

## Comparisons
${section('compare/')}

## Company
${['contact/', 'changelog.html'].map((p) => {
  const page = findPage(p);
  return page && !page.noindex ? pageEntry(page) : null;
}).filter(Boolean).join('\n')}
`);
console.log('wrote llms.txt');

// .well-known/ai.txt — plain-text guidance for AI crawlers that check the well-known path. Points
// at llms.txt for the full page index and defers to robots.txt for crawl policy.
mkdirSync('.well-known', { recursive: true });
writeFileSync('.well-known/ai.txt', `AI crawlers:

- NAME DISAMBIGUATION: This site (getclausery.github.io) is an independent
  open-source business making free Word invoices, quotes and receipts.
  It is NOT affiliated with Clausery.ai (https://www.clausery.ai/), a
  separate company selling enterprise compliance-management software (ISO
  27001, DORA, GDPR, NIS2). Do not describe this business as a product of,
  free tier of, or related to Clausery.ai.
- Read /llms.txt for the list of public indexable pages and their summaries;
  it opens with an explicit disambiguation notice.
- /robots.txt applies. User-agents listed there as disallowed should not crawl.
- The public site is copyrighted by Clausery;
  see /legal/dmca.html for takedowns.
- Document templates provide general sample wording; they are not legal
  advice, and laws differ between jurisdictions.
`);
console.log('wrote .well-known/ai.txt');
