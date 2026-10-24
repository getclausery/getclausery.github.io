import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SERVICE_GUIDES } from '../../site/data/service-guides.mjs';
import { GUIDES, GUIDE_TOPICS } from '../../site/audience.mjs';
import { LIB } from '../../site/library.mjs';
import { SEARCH_INTENT } from '../../site/data/search-intent.mjs';
import { SITE } from '../../tools/partials.mjs';
import { editorialLinkGraph } from '../../tools/editorial-links.mjs';
import { PRICES } from '../../app/config.js';
import { PLANS } from '../../app/lib/license.js';

const html = (file) => readFileSync(file, 'utf8');
const ld = (value) => [...value.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, json]) => JSON.parse(json));
const main = (value) => value.match(/<main\b[\s\S]*?<\/main>/)[0].replace(/<!--nav-->[\s\S]*?<!--\/nav-->/g, '').replace(/<nav\b[\s\S]*?<\/nav>/g, '');
const text = (value) => value.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

test('trade-specific guides have worked examples, honest scope, three FAQs and a reciprocal template link', () => {
  assert.equal(new Set(SERVICE_GUIDES.map((g) => g.slug)).size, SERVICE_GUIDES.length);
  assert.equal(new Set(SERVICE_GUIDES.map((g) => g.template)).size, SERVICE_GUIDES.length);
  for (const g of SERVICE_GUIDES) {
    assert.ok(LIB.some((t) => t.slug === g.template), g.template);
    assert.ok(GUIDES.includes(g), g.slug);
    const page = html(`guides/${g.slug}.html`);
    const article = main(page);
    const words = text(article).split(/\s+/).length;
    assert.ok(words >= 950 && words <= 1400, `${g.slug}: ${words} editorial words`);
    assert.match(article, /<pre\b[^>]*><code>/, g.slug);
    assert.match(article, /<th scope="row">/, g.slug);
    assert.match(article, /General drafting information, not legal/, g.slug);
    assert.ok(article.includes(`../templates/${g.template}.html`), g.slug);
    assert.ok(html(`templates/${g.template}.html`).includes(`../guides/${g.slug}.html`), g.template);
    const nodes = ld(page);
    const schema = nodes.find((node) => node['@type'] === 'Article');
    assert.equal(schema.datePublished, g.published, g.slug);
    assert.ok(schema.dateModified >= schema.datePublished, g.slug);
    assert.deepEqual(schema.citation, g.sources.map(([, url]) => url), g.slug);
    assert.equal(nodes.find((node) => node['@type'] === 'FAQPage').mainEntity.length, 3, g.slug);
    assert.equal([...article.matchAll(/<details\b/g)].length, 3, g.slug);
    for (const [, url] of g.sources) assert.ok(article.includes(url), g.slug);
  }
});

test('new guide intents and topics are explicit, and feed/llms artifacts include every guide exactly once', () => {
  const feed = html('feed.xml');
  const llms = html('llms.txt');
  for (const g of SERVICE_GUIDES) {
    const path = `guides/${g.slug}.html`;
    const entry = SEARCH_INTENT[path];
    assert.deepEqual(entry.slice(1), ['informational', 'guides'], g.slug);
    assert.equal(GUIDE_TOPICS.flatMap(([, slugs]) => slugs).filter((slug) => slug === g.slug).length, 1, g.slug);
    assert.equal(feed.split(`<id>${SITE}${path}</id>`).length - 1, 1, g.slug);
    assert.equal(llms.split(`](${SITE}${path})`).length - 1, 1, g.slug);
  }
});

test('new guides have contextual endorsements from their template, hub and an existing article', () => {
  const documents = new Map([...html('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => {
    const path = new URL(url).pathname.slice(1);
    return [url, html(!path || path.endsWith('/') ? path + 'index.html' : path)];
  }));
  const graph = editorialLinkGraph(documents);
  for (const g of SERVICE_GUIDES) {
    const incoming = graph.incoming.get(`${SITE}guides/${g.slug}.html`);
    assert.ok(incoming?.has(`${SITE}templates/${g.template}.html`), `${g.slug}: primary template`);
    assert.ok(incoming.has(`${SITE}guides/`), `${g.slug}: hub`);
    const existingGuide = g.template === 'equipment-rental-agreement' ? 'what-is-a-hold-harmless-agreement' : 'how-to-write-a-freelance-contract';
    assert.ok(incoming.has(`${SITE}guides/${existingGuide}.html`), `${g.slug}: existing article, not repeated footer navigation`);
  }
});

test('audience prices and limits follow configuration without blanket legal-deadline or vendor-paywall claims', () => {
  for (const slug of ['law-firms', 'hr-teams', 'consultants', 'freelancers', 'landlords']) {
    const body = text(main(html(`for/${slug}.html`)));
    assert.ok(body.includes(`$${PRICES.pro} per user per month`), slug);
    assert.ok(body.includes(`${PLANS.free.maxTemplates} of your own`), slug);
  }
  const landlords = text(main(html('for/landlords.html')));
  assert.match(landlords, /the app does not decide legal deadlines/);
  assert.doesNotMatch(landlords, /21 days after|14 days in New York|90 days for an increase|free trial that becomes a paid subscription before you can download/);
  const law = text(main(html('for/law-firms.html')));
  assert.doesNotMatch(law, /Those products run on a vendor/);
  assert.match(law, /workspace encryption does not encrypt those exports/);
  assert.match(text(main(html('for/hr-teams.html'))), /With Pro, export a template pack/);
  assert.match(text(main(html('for/consultants.html'))), /Pro computed fields add your own calculations/);
});
