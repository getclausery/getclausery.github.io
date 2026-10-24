// Quality gate for the programmatic landing pages (templates, invoice starters, clauses, comparisons, audience pages
// and free tools). These pages are generated from data, so the risk is not a typo but a page that ships with too little
// unique content, no worked example, no FAQ, no call to action, or wording copied from a sibling. The gate checks the
// structure each set promises and refuses near-duplicate pages inside a set.
import { readFileSync, globSync } from 'node:fs';

const failures = [];
const fail = (file, message) => failures.push(`${file}: ${message}`);
const decode = (s) => String(s).replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? Number.parseInt(e.slice(2), 16) : Number(e.slice(1))) : ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' }[e.toLowerCase()] ?? m));
const textOf = (html) => decode(html.replace(/<!--nav-->[\s\S]*?<!--\/nav-->/g, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<nav[\s\S]*?<\/nav>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const mainOf = (html) => html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html;
const counts = (html, rx) => (html.match(rx) || []).length;
const linkHrefs = (html) => [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(([, href]) => decode(href));
const linksTo = (html, page) => linkHrefs(html).some((href) => href.includes(page));
const types = (html) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(([, json]) => { try { const node = JSON.parse(json); return [node['@type'], ...(node['@graph'] || []).map((n) => n['@type'])]; } catch { return []; } });
const shingles = (text, size = 5) => {
  const words = text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/);
  const set = new Set();
  for (let i = 0; i + size <= words.length; i++) set.add(words.slice(i, i + size).join(' '));
  return set;
};
const jaccard = (a, b) => { let hit = 0; for (const x of a) if (b.has(x)) hit++; return hit / (a.size + b.size - hit); };

const sets = {
  templates: {
    files: globSync('templates/*.html').filter((f) => f !== 'templates/index.html'),
    minWords: 380, minH2: 4, minFaq: 2,
    schema: ['DigitalDocument', 'FAQPage', 'BreadcrumbList'],
    require: [
      ['app link', (h) => linksTo(h, 'app/#/start/')],
      ['Word download', (h) => linksTo(h, 'samples/')],
      ['preview picture', (h) => /<a[^>]+class="[^"]*tpl-thumb[^"]*"[^>]*>\s*<picture>\s*<source[^>]+type="image\/webp"/.test(h)],
      ['full template text', (h) => /class="tpl-doc"/.test(h)],
      ['question table', (h) => /The questions you answer/.test(h)],
      ['guide link', (h) => /<strong>Guide:<\/strong>/.test(h)],
    ],
  },
  'invoice-templates': {
    files: globSync('invoice-templates/*.html').filter((f) => f !== 'invoice-templates/index.html'),
    minWords: 380, minH2: 3, minFaq: 3,
    schema: ['FAQPage', 'BreadcrumbList'],
    require: [
      ['app starter', (h) => linksTo(h, 'app/#/start/invoice')],
      ['worked example', (h) => /<table/.test(h) && /(?:example|\$|£|€|R\$|A\$)/i.test(h)],
      ['invoice template link', (h) => linksTo(h, 'templates/invoice.html') || linksTo(h, '../app/#/start/invoice')],
    ],
  },
  clauses: {
    files: globSync('clauses/*.html').filter((f) => f !== 'clauses/index.html'),
    minWords: 340, minH2: 3, minFaq: 3,
    schema: ['FAQPage', 'BreadcrumbList'],
    require: [
      ['sample wording', (h) => /id="clause-text"/.test(h) && /copy-btn/.test(h)],
      ['what to check', (h) => /What to check/.test(h)],
      ['two template links', (h) => counts(h, /href="[^"]*templates\//g) >= 2],
    ],
  },
  compare: {
    files: globSync('compare/*.html').filter((f) => f !== 'compare/index.html'),
    minWords: 480, minH2: 4, minFaq: 3, maxSimilarity: 0.35,
    schema: ['FAQPage', 'BreadcrumbList'],
    require: [
      ['comparison table', (h) => counts(h, /<tr>/g) >= 8],
      ['price', (h) => /\$|price|pricing/i.test(h)],
      ['app link', (h) => linksTo(h, 'app/')],
      ['honest choice sections', (h) => /When .* makes sense|choose them|choose Clausery|Where .* wins/i.test(h)],
      ['product-specific evaluation', (h) => textOf(h.match(/<section class="comparison-workflow"[\s\S]*?<\/section>/)?.[0] || '').split(/\s+/).filter(Boolean).length >= 180],
      ['official vendor link', (h) => /<a class="vendor-source" href="https:\/\//.test(h)],
    ],
  },
  for: {
    files: globSync('for/*.html').filter((f) => f !== 'for/index.html'),
    minWords: 340, minH2: 3, minFaq: 4,
    schema: ['FAQPage', 'BreadcrumbList'],
    require: [
      ['app link', (h) => linksTo(h, 'app/')],
      ['five template links', (h) => counts(h, /href="[^"]*templates\/[^"]+\.html"/g) >= 5],
      ['related reading', (h) => /Further reading/.test(h) && counts(h, /href="[^"]*(?:guides|clauses|compare|free-tools)\//g) >= 2],
      ['back to the audience hub', (h) => /Compare all the teams Clausery is built for|href="[^"]*for\/#?[^"]*"[^>]*>Who it/.test(h)],
    ],
  },
  guides: {
    files: globSync('guides/*.html').filter((f) => f !== 'guides/index.html'),
    minWords: 380, minH2: 3, minFaq: 0,
    schema: ['Article', 'BreadcrumbList'],
    require: [
      ['published date', (h) => /<time datetime="\d{4}-\d{2}-\d{2}">/.test(h)],
      ['template or tool', (h) => /href="[^"]*(?:templates|invoice-templates|free-tools)\//.test(h)],
      ['link back to the guide hub', (h) => /href="[^"]*guides\/"/.test(h)],
    ],
  },
  docs: {
    files: globSync('docs/*.html'),
    minWords: 380, minH2: 2, minFaq: 0,
    schema: ['WebPage', 'BreadcrumbList'],
    require: [
      ['instructions article', (h) => /<article class="docs-body">/.test(h)],
      ['app next step', (h) => linksTo(h, 'app/')],
    ],
  },
  'free-tools': {
    files: globSync('free-tools/*.html').filter((f) => f !== 'free-tools/index.html'),
    minWords: 190, minH2: 2, minFaq: 3,
    schema: ['WebApplication', 'BreadcrumbList'],
    require: [
      ['working control', (h) => counts(h, /<(?:input|select|textarea)\b/g) >= 1 || /id="drop"/.test(h)],
      ['next step', (h) => linksTo(h, 'app/') || linksTo(h, 'templates/')],
    ],
  },
};

for (const [name, spec] of Object.entries(sets)) {
  const pages = [];
  for (const file of spec.files) {
    const html = readFileSync(file, 'utf8');
    const main = mainOf(html);
    const text = textOf(main);
    const words = text.split(/\s+/).filter(Boolean).length;
    pages.push({ file, text, shingles: shingles(text) });
    if (words < spec.minWords) fail(file, `${words} words of unique content (the ${name} set needs ${spec.minWords})`);
    if (counts(html, /<h1\b/g) !== 1) fail(file, 'needs exactly one H1');
    if (counts(main, /<h2\b/g) < spec.minH2) fail(file, `has ${counts(main, /<h2\b/g)} H2 sections (needs ${spec.minH2})`);
    const faqCount = counts(main, /<details\b/g);
    if (faqCount < spec.minFaq) fail(file, `has ${faqCount} FAQ answers (needs ${spec.minFaq})`);
    const found = types(html);
    for (const type of spec.schema) if (!found.includes(type)) fail(file, `is missing ${type} structured data`);
    for (const [label, test] of spec.require) if (!test(html)) fail(file, `is missing its ${label}`);
    if (!/<link rel="canonical"/.test(html)) fail(file, 'has no canonical');
    if (!/<meta name="description"/.test(html)) fail(file, 'has no meta description');
  }
  // No two pages in a programmatic set may be near-copies of each other.
  let worst = 0;
  for (let i = 0; i < pages.length; i++) {
    for (let j = i + 1; j < pages.length; j++) {
      const score = jaccard(pages[i].shingles, pages[j].shingles);
      worst = Math.max(worst, score);
      const limit = spec.maxSimilarity ?? 0.55;
      if (score > limit) fail(pages[j].file, `${(score * 100).toFixed(0)}% of its wording is shared with ${pages[i].file} (maximum ${(limit * 100).toFixed(0)}%)`);
    }
  }
  console.log(`${name}: ${pages.length} pages, minimum ${Math.min(...pages.map((p) => p.text.split(/\s+/).filter(Boolean).length))} words, highest sibling similarity ${(worst * 100).toFixed(0)}%`);
}

if (failures.length) {
  console.error(`\n${failures.join('\n')}`);
  console.error(`\nProgrammatic page checks failed: ${failures.length} problem${failures.length === 1 ? '' : 's'}.`);
  process.exitCode = 1;
} else {
  console.log('\nProgrammatic page checks passed: unique content, sections, FAQs, schema, calls to action and no near-duplicate pages in any generated set.');
}
