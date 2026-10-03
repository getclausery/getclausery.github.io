/* The generated site: last-modified dates, contact links and structured data on the pages search engines index. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, globSync } from 'node:fs';
import { LIB } from '../../site/library.mjs';

const dates = JSON.parse(readFileSync('site/data/page-dates.json', 'utf8'));
const html = (f) => readFileSync(f, 'utf8');
const ld = (page) => [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, j]) => JSON.parse(j));

test('every sitemap URL has a real last-modified date from page-dates.json, none in the future', () => {
  // A page dated in the author's time zone can be a day ahead of UTC, where CI runs.
  const today = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  for (const [path, { date, hash }] of Object.entries(dates)) {
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/, path);
    assert.ok(date >= '2026-09-24' && date <= today, `${path}: ${date}`);
    assert.match(hash, /^[0-9a-f]{16}$/, path);
  }
  const urls = [...html('sitemap.xml').matchAll(/<url><loc>([^<]+)<\/loc>(<lastmod>[^<]+<\/lastmod>)?/g)];
  assert.ok(urls.length > 150);
  for (const [, loc, lastmod] of urls) assert.ok(lastmod, `no lastmod for ${loc}`);
});

test('no page is left with a date placeholder or a link to the unregistered clausery.app domain', () => {
  for (const f of globSync('**/*.html', { exclude: (x) => /^(node_modules|test-results|playwright-report)/.test(x) })) {
    const page = html(f);
    assert.doesNotMatch(page, /@@LASTMOD/, f);
    assert.doesNotMatch(page, /@clausery\.app/, f);
  }
});

test('template pages describe the template as a free Word document with a modified date', () => {
  for (const t of LIB) {
    const page = html(`templates/${t.slug}.html`);
    const doc = ld(page).find((x) => x['@type'] === 'DigitalDocument');
    assert.ok(doc, t.slug);
    assert.equal(doc.isAccessibleForFree, true);
    assert.equal(doc.dateModified, dates[`templates/${t.slug}.html`].date, t.slug);
    assert.match(doc.contentUrl, new RegExp(`/samples/${t.file}$`));
    assert.match(page, new RegExp(`Updated <time datetime="${doc.dateModified}">`), t.slug);
  }
});

test('guides are modified on or after they were published, and say "Updated" only when they changed', () => {
  for (const f of globSync('guides/*.html').filter((x) => !x.endsWith('index.html'))) {
    const page = html(f);
    const a = ld(page).find((x) => x['@type'] === 'Article');
    assert.ok(a.dateModified >= a.datePublished, f);
    assert.equal(/· Updated <time/.test(page), a.dateModified !== a.datePublished, f);
  }
});

test('pricing buttons are built for the checkout configuration', async () => {
  const { CHECKOUT_URLS, KEY_REQUEST_URL } = await import('../../app/config.js');
  const page = html('pricing/index.html');
  for (const plan of ['pro', 'team']) {
    const a = page.match(new RegExp(`<a [^>]*data-checkout="${plan}"[^>]*>`))[0];
    assert.ok(a.includes(CHECKOUT_URLS[plan] || KEY_REQUEST_URL.replace(/&/g, '&amp;')), a);
  }
});

test('guides that cite sources list them on the page and in the Article data', async () => {
  const { GUIDES } = await import('../../site/audience.mjs');
  const cited = GUIDES.filter((g) => g.sources);
  assert.ok(cited.length >= 4);
  for (const g of cited) {
    const page = html(`guides/${g.slug}.html`);
    assert.match(page, /<h2>Sources<\/h2>/, g.slug);
    const a = ld(page).find((x) => x['@type'] === 'Article');
    assert.deepEqual(a.citation, g.sources.map(([, u]) => u), g.slug);
    for (const [, u] of g.sources) assert.match(u, /^https:\/\//, g.slug);
  }
});

test('the page counter, when enabled, is only on website pages and never in the app or embeds', async () => {
  const { ANALYTICS_ON, ANALYTICS_SRC, ANALYTICS_SINCE } = await import('../../tools/partials.mjs');
  const pages = globSync('**/*.html', { exclude: (x) => /^(node_modules|test-results|playwright-report)/.test(x) });
  for (const f of pages) {
    const has = html(f).includes(ANALYTICS_SRC);
    if (!ANALYTICS_ON || f.startsWith('app/') || f.startsWith('free-tools/embed/')) assert.equal(has, false, f);
  }
  if (ANALYTICS_ON) {
    assert.match(ANALYTICS_SINCE, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(html('index.html').includes(ANALYTICS_SRC));
    assert.match(html('legal/privacy.html'), /Cloudflare Web Analytics/);
  } else {
    assert.match(html('legal/privacy.html'), /We do not add cookies, analytics or tracking of any kind/);
  }
});
