// Builds the static marketing/docs/legal pages from site/*.mjs page modules into the deploy tree.
// Run with `npm run build:site`. Outputs are committed so GitHub Pages needs no build step.
import { writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { head, footer, embedPage, SITE } from './partials.mjs';

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
};
for (const k of Object.keys(SEO_TITLES)) if (!pages.some((p) => p.path === k)) throw new Error('SEO_TITLES: no page ' + k);
for (const p of pages) {
  // GitHub Pages serves 404.html for a miss at any depth, so its links must be root-relative, not relative to its file.
  const rel = p.path === '404.html' ? '/' : p.path.split('/').filter(Boolean).length - (p.path.endsWith('/') || p.path === '' ? 0 : 1) > 0 ? '../'.repeat(p.path.split('/').filter(Boolean).length - (p.path.endsWith('/') || p.path === '' ? 0 : 1)) : './';
  const out = p.path === '' ? 'index.html' : p.path.endsWith('/') ? p.path + 'index.html' : p.path;
  const html = p.layout === 'embed' ? embedPage({ title: p.title, description: p.description, extraHead: p.extraHead, rel, body: p.body(rel) })
    : (head({ title: SEO_TITLES[p.path] || p.title, description: p.description, path: p.path, extraHead: p.extraHead || '', ogImage: p.ogImage, rel }) + p.body(rel) + footer(rel)).replace(/<pre>/g, '<pre tabindex="0">');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log('wrote', out);
}

// Atom feed of guides and clause pages (pages marked `feed: true`), for feed readers and aggregators. Dates come from
// each page's `published` field, never the build time, so rebuilding does not make every entry look new.
const BASE = SITE;
const xmlEsc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const feed = pages.filter((p) => p.feed).sort((a, b) => (b.published + b.path).localeCompare(a.published + a.path));
const updated = feed.map((p) => p.published).sort().at(-1);
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
    <updated>${p.published}T00:00:00Z</updated>
    <summary>${xmlEsc(p.description)}</summary>
  </entry>`).join('\n')}
</feed>
`);
console.log(`wrote feed.xml (${feed.length} entries)`);

// llms.txt (llmstxt.org): a plain summary and link map for AI assistants and answer engines.
const section = (prefix) => pages.filter((p) => p.path.startsWith(prefix) && !p.path.endsWith('/') && !p.noindex).map((p) => `- [${p.title}](${BASE}${p.path}): ${p.description}`).join('\n');
writeFileSync('llms.txt', `# Clausery

> Clausery is browser-based document automation. It turns ordinary Word (.docx) templates with {tags} into guided questionnaires and generates finished documents entirely on the user's device: no upload, no account, works offline. Free for up to three templates with unlimited documents; the Pro plan adds unlimited templates, calculations, an encrypted workspace and client intake forms.

Key facts:
- Documents are assembled in the browser; template files, answers and generated documents are never sent to a server.
- Templates are normal Word files. Tags: {name} for a value, {#condition}...{/condition} for optional text, {^condition}...{/condition} for the opposite, and {#list}...{/list} for repeating paragraphs or table rows.
- Pro plan: optional passphrase encryption of everything stored in the browser (AES-256-GCM) with auto-lock.
- Free Word templates, a contract clause library and free drafting tools are available without sign-up.
- Clausery is software, not a law firm, and does not give legal advice.

## Product
- [Home](${BASE}): what Clausery does and who it is for
- [Open the app](${BASE}app/): runs in the browser, no sign-up
- [Pricing](${BASE}pricing/): Free, Pro, Team and Enterprise plans
- [Security](${BASE}docs/security.html): how data stays on the device
- [Documentation](${BASE}docs/): getting started, template syntax, logic, client intake

## Free Word templates
${section('templates/')}

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
