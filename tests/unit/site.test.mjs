/* The generated site: last-modified dates, contact links and structured data on the pages search engines index. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, globSync } from 'node:fs';
import { LIB } from '../../site/library.mjs';

const dates = JSON.parse(readFileSync('site/data/page-dates.json', 'utf8'));
const html = (f) => readFileSync(f, 'utf8');
const ld = (page) => [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, j]) => JSON.parse(j));

test('sitemap and syndication dates agree, and malformed feed entries or llms links are rejected', async () => {
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

  const { checkFeeds } = await import('../../tools/check-feeds.mjs');
  const feedXml = html('feed.xml');
  const llmsText = html('llms.txt');
  const result = checkFeeds();
  assert.deepEqual(result.failures, []);
  assert.equal(result.entries, result.guides + result.clauses);
  const first = feedXml.match(/<entry>[\s\S]*?<\/entry>/)[0];
  const rejectedFeed = (entry) => checkFeeds({ feedXml: feedXml.replace(first, entry) }).failures.join('\n');
  assert.match(rejectedFeed(''), /missing from feed/);
  assert.match(rejectedFeed(first + first), /duplicate entry/);
  assert.match(rejectedFeed(first.replace(/<title>[^<]*<\/title>/, '<title>Not the page title</title>')), /title must match/);
  assert.match(rejectedFeed(first.replace(/<published>[^<]*<\/published>/, '<published>2000-01-01T00:00:00Z</published>')), /published must match/);
  assert.match(rejectedFeed(first.replace(/<updated>[^<]*<\/updated>/, '<updated>2000-01-01T00:00:00Z</updated>')), /updated must match/);
  assert.match(rejectedFeed(first.replaceAll(first.match(/<id>([^<]+)<\/id>/)[1], 'https://getclausery.github.io/templates/invoice.html')), /not a guide or clause page/);
  assert.match(checkFeeds({ feedXml: feedXml.replace(/<updated>[^<]*<\/updated>/, '<updated>2000-01-01T00:00:00Z</updated>') }).failures.join('\n'), /feed updated must be the latest/);
  for (const [url, problem] of [
    ['https://getclausery.github.io/app/', /noindex page/],
    ['https://getclausery.github.io/made-with/', /noindex page/],
    ['https://getclausery.github.io/not-a-real-page.html', /no generated file/],
    ['https://example.org/', /absolute same-site URL/],
    ['https://getclausery.github.io/', /duplicate link/],
  ]) assert.match(checkFeeds({ llmsText: llmsText + `\n- [Bad link](${url})\n` }).failures.join('\n'), problem, url);
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

test('guides have consistent dates and the four template-gap guides provide substantial, linked advice', async () => {
  for (const f of globSync('guides/*.html').filter((x) => !x.endsWith('index.html'))) {
    const page = html(f);
    const a = ld(page).find((x) => x['@type'] === 'Article');
    assert.ok(a.dateModified >= a.datePublished, f);
    assert.equal(/· Updated <time/.test(page), a.dateModified !== a.datePublished, f);
  }
  const { HIGH_INTENT_GUIDES } = await import('../../site/data/high-intent-guides.mjs');
  const templates = ['independent-contractor-agreement', 'promissory-note', 'sublease-agreement', 'purchase-order'];
  for (const [i, g] of HIGH_INTENT_GUIDES.entries()) {
    const page = html(`guides/${g.slug}.html`);
    const main = page.match(/<main[\s\S]*?<\/main>/)[0].replace(/<!--nav-->[\s\S]*?<!--\/nav-->/g, '').replace(/<nav[\s\S]*?<\/nav>/g, '');
    const words = main.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
    assert.ok(words >= 1000 && words <= 1250, `${g.slug}: ${words} editorial words`);
    assert.ok(g.faq.length >= 3, g.slug);
    assert.match(page, /<pre/, g.slug);
    assert.equal(ld(page).find((x) => x['@type'] === 'Article').datePublished, g.published, g.slug);
    assert.ok(page.includes(`../templates/${templates[i]}.html`), g.slug);
    assert.ok(html(`templates/${templates[i]}.html`).includes(`../guides/${g.slug}.html`), g.slug);
  }
});

test('pricing buttons are built for the checkout configuration', async () => {
  const { CHECKOUT_URLS, keyRequestUrl } = await import('../../app/config.js');
  const page = html('pricing/index.html');
  for (const plan of ['pro', 'proYearly', 'team']) {
    const a = page.match(new RegExp(`<a [^>]*data-checkout="${plan}"[^>]*>`))[0];
    assert.ok(a.includes(CHECKOUT_URLS[plan] || keyRequestUrl(plan === 'pro' ? 'Pro' : 'Team').replace(/&/g, '&amp;')), a);
  }
});

test('guides that cite sources list them on the page and in the Article data', async () => {
  const { GUIDES } = await import('../../site/audience.mjs');
  const cited = GUIDES.filter((g) => g.sources);
  assert.ok(cited.length >= 4);
  for (const g of cited) {
    const page = html(`guides/${g.slug}.html`);
    assert.match(page, /<h2[^>]*>Sources<\/h2>/, g.slug);
    const a = ld(page).find((x) => x['@type'] === 'Article');
    assert.deepEqual(a.citation, g.sources.map(([, u]) => u), g.slug);
    for (const [, u] of g.sources) assert.match(u, /^https:\/\//, g.slug);
  }
});

test('the page counter lives in site.js, which the app and embedded calculators never load', async () => {
  const { ANALYTICS_ON, ANALYTICS_SRC, ANALYTICS_SINCE } = await import('../../tools/partials.mjs');
  assert.ok(html('site.js').includes(ANALYTICS_SRC));
  const pages = globSync('**/*.html', { exclude: (x) => /^(node_modules|test-results|playwright-report)/.test(x) });
  for (const f of pages) {
    assert.ok(!html(f).includes(ANALYTICS_SRC), `${f} must not load the counter directly`);
    if (f.startsWith('app/') || f.startsWith('free-tools/embed/')) assert.doesNotMatch(html(f), /site\.js/, f);
  }
  if (ANALYTICS_ON) {
    assert.match(ANALYTICS_SINCE, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(html('legal/privacy.html'), /Cloudflare Web Analytics/);
  } else {
    assert.equal(ANALYTICS_SINCE, '');
    assert.match(html('legal/privacy.html'), /We do not add cookies, analytics or tracking of any kind/);
  }
});

test('license wording matches the checkout state, and the app CSP allows only the license service and analytics besides itself', async () => {
  const { ONLINE_KEYS, CHECKOUT_SINCE, USAGE_ON } = await import('../../tools/partials.mjs');
  const { LICENSE_SERVICE, USAGE_COUNTER } = await import('../../app/config.js');
  const csp = html('app/index.html').match(/connect-src ([^;]+);/)[1].trim().split(/\s+/);
  const expected = ["'self'"];
  if (LICENSE_SERVICE.api) expected.push(new URL(LICENSE_SERVICE.api).origin);
  if (USAGE_ON && USAGE_COUNTER.endpoint) expected.push(new URL(USAGE_COUNTER.endpoint).origin);
  assert.deepEqual(csp, expected);
  const privacy = html('legal/privacy.html'), pricing = html('pricing/index.html');
  if (ONLINE_KEYS) {
    assert.match(CHECKOUT_SINCE, /^\d{4}-\d{2}-\d{2}$/, 'set CHECKOUT_SINCE in app/config.js when checkout goes live');
    assert.match(privacy, /Lemon Squeezy/);
    assert.doesNotMatch(pricing, /never contacts a license server|never checks in with a server/);
  } else {
    assert.doesNotMatch(privacy, /Lemon Squeezy/);
    assert.match(pricing, /never checks in with a server/);
  }
});

test('every template page shows a first-page preview that is up to date with its sample', async () => {
  const { PREVIEW_DIR, PREVIEW_HASHES, previewHash } = await import('../../tools/preview.mjs');
  const hashes = JSON.parse(readFileSync(PREVIEW_HASHES, 'utf8'));
  for (const t of LIB) {
    assert.equal(hashes[t.slug], previewHash(t), `${t.slug}: preview is stale, run npm run previews`);
    assert.ok(readFileSync(`${PREVIEW_DIR}/${t.slug}.jpg`).length > 5000, t.slug);
    const page = html(`templates/${t.slug}.html`);
    assert.ok(page.includes(`<source type="image/webp" srcset="../assets/previews/${t.slug}.webp"`), t.slug);
    assert.ok(page.includes(`<img src="../assets/previews/${t.slug}.jpg" width="680" height="880"`), t.slug);
    assert.match(page, /loading="(?:eager|lazy)" decoding="async"/, t.slug);
    const doc = ld(page).find((x) => x['@type'] === 'DigitalDocument');
    assert.equal(doc.thumbnailUrl, `https://getclausery.github.io/assets/previews/${t.slug}.jpg`, t.slug);
  }
  assert.deepEqual(Object.keys(hashes).sort(), LIB.map((t) => t.slug).sort());
});

test('pricing states the free trial, the guarantee and the Free plan credit line, with no invented popularity', async () => {
  const { CHECKOUT_URLS, PRICES, TRIAL_DAYS, REFUND_DAYS } = await import('../../app/config.js');
  const pricing = html('pricing/index.html');
  assert.match(pricing, /href="\.\.\/app\/#\/trial"/);
  assert.match(pricing, new RegExp(`${TRIAL_DAYS}-day free Pro trial: no card, nothing renews`));
  assert.match(pricing, new RegExp(`${REFUND_DAYS}-day money-back guarantee`));
  assert.match(pricing, /<li class="no">Remove the “Made with Clausery” line from library documents<\/li>/);
  assert.doesNotMatch(pricing, /Most popular/i);
  assert.match(pricing, new RegExp(`class="price-mo">\\$${PRICES.pro}<`));
  // billing toggle is present
  assert.match(pricing, /data-billing="monthly"/);
  assert.match(pricing, /data-billing="yearly"/);
  // the one-time purchase appears only once its checkout link exists
  assert.equal(/data-checkout="lifetime"|Lifetime Pro/.test(pricing), Boolean(CHECKOUT_URLS.lifetime));
  const offers = ld(pricing).find((x) => x['@type'] === 'SoftwareApplication').offers.map((o) => o.price);
  assert.deepEqual(offers, ['0', String(PRICES.pro), String(PRICES.proYearly), ...(CHECKOUT_URLS.lifetime ? [String(PRICES.lifetime)] : []), String(PRICES.team)]);
});

test('the terms carry the money-back guarantee and the trial, and do not forbid editing generated documents', async () => {
  const { REFUND_DAYS, TRIAL_DAYS } = await import('../../app/config.js');
  const terms = html('legal/terms.html');
  assert.match(terms, new RegExp(`<strong>${REFUND_DAYS}-day money-back guarantee\\.</strong>`));
  assert.match(terms, new RegExp(`lasts ${TRIAL_DAYS} days, needs no payment details and ends by itself`));
  assert.match(terms, /This does not cover your generated documents, which are yours/);
  assert.match(html('legal/privacy.html'), /“Made with Clausery” line that links to our website/);
});

test('the page the credit line links to exists, is noindex and stays out of the sitemap', async () => {
  const { CREDIT_URL } = await import('../../app/lib/credit.js');
  const { SITE } = await import('../../tools/partials.mjs');
  const path = CREDIT_URL.replace(SITE, '');
  const page = html(`${path}index.html`);
  assert.match(page, /<meta name="robots" content="noindex, follow">/);
  assert.match(page, /contact them\. Clausery never sees the documents people make/);
  assert.ok(!html('sitemap.xml').includes(CREDIT_URL));
  assert.ok(!html('llms.txt').includes(CREDIT_URL));
});

test('the press kit describes the live checkout', async () => {
  const { ONLINE_KEYS } = await import('../../tools/partials.mjs');
  const press = html('press/index.html');
  assert.equal(/hosted checkout is not yet linked/.test(press), !ONLINE_KEYS);
});

test('robots match the sitemap and editorial links cannot be replaced by sitewide navigation', async () => {
  const indexed = new Set([...html('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname));
  const files = globSync('**/*.html', { exclude: (x) => /^(node_modules|test-results|playwright-report)/.test(x) });
  for (const f of files) {
    if (/^google[0-9a-f]+\.html$/.test(f)) continue; // Search Console's verification token is not a document page.
    const page = html(f);
    const robots = [...page.matchAll(/<meta\s+[^>]*name="robots"[^>]*content="([^"]+)"[^>]*>/gi)];
    assert.equal(robots.length, 1, `${f}: expected exactly one robots tag`);
    const path = '/' + f.replace(/index\.html$/, '');
    assert.equal(!/\bnoindex\b/i.test(robots[0][1]), indexed.has(path), `${f}: robots and sitemap disagree`);
  }
  const { editorialLinkGraph } = await import('../../tools/editorial-links.mjs');
  const base = 'https://getclausery.github.io/';
  const documents = new Map([...indexed].map((path) => [new URL(path, base).href, html(path === '/' || path.endsWith('/') ? path.slice(1) + 'index.html' : path.slice(1))]));
  const graph = editorialLinkGraph(documents);
  for (const [url, sources] of graph.incoming) if (url !== base) assert.ok(sources.size > 0, `${url}: editorial orphan`);
  const home = 'https://example.test/';
  const fixtures = new Map([
    [home, `<header><a href="orphan.html">Header</a></header><main>
      <nav><a href="orphan.html">Breadcrumb or docs nav</a></nav>
      <!--nav--><p><a href="orphan.html">Automatic related list</a></p><!--/nav-->
      <!-- <a href="orphan.html">Commented out</a> -->
      <script>const example = '<a href="orphan.html">Not content</a>';</script>
      <template><a href="orphan.html">Inert template</a></template>
      <p><a href="one.html">Useful content link</a><a href="one.html#again">Same source</a></p>
      <a href="#self">Self</a><a href="https://other.example/">External</a>
    </main><footer><a href="orphan.html">Footer</a></footer>`],
    [home + 'one.html', '<main><p><a href="two.html?view=full&amp;lang=en#section">Next page</a></p></main>'],
    [home + 'two.html', "<main><a href='one.html'>Back</a></main>"],
    [home + 'orphan.html', '<main><a href="#self">Not an inbound link</a></main>'],
  ]);
  const fixtureGraph = editorialLinkGraph(fixtures);
  assert.deepEqual([...fixtureGraph.outgoing.get(home)], [home + 'one.html']);
  assert.deepEqual([...fixtureGraph.incoming.get(home + 'one.html')], [home, home + 'two.html']);
  assert.deepEqual([...fixtureGraph.incoming.get(home + 'two.html')], [home + 'one.html']);
  assert.equal(fixtureGraph.incoming.get(home + 'orphan.html').size, 0);
});

test('share cards are small 1200 by 630 PNGs, unique per template, and invalid headers are rejected', async () => {
  const { socialCardProblems, SOCIAL_CARD_MAX_BYTES } = await import('../../tools/social-card.mjs');
  const images = new Set();
  const templateImages = new Set();
  for (const f of globSync('**/*.html', { exclude: (x) => /^(node_modules|app|free-tools\/embed|test-results|playwright-report)/.test(x) })) {
    const src = html(f).match(/<meta property="og:image" content="https:\/\/getclausery\.github\.io\/([^"]+)"/)?.[1];
    if (src) images.add(src);
    if (/^templates\/[^/]+\.html$/.test(f) && f !== 'templates/index.html') {
      assert.ok(src && src !== 'assets/og.png', f);
      assert.ok(!templateImages.has(src), `${f}: shared template card`);
      templateImages.add(src);
    }
  }
  assert.ok(images.size > 1);
  for (const image of images) {
    const png = readFileSync(image);
    assert.equal(png.subarray(1, 4).toString(), 'PNG', image);
    assert.equal(png.readUInt32BE(16), 1200, `${image}: width`);
    assert.equal(png.readUInt32BE(20), 630, `${image}: height`);
    assert.deepEqual(socialCardProblems(png), [], image);
  }
  assert.equal(templateImages.size, LIB.length);
  const valid = readFileSync('assets/og.png');
  const badWidth = Buffer.from(valid);
  badWidth.writeUInt32BE(1199, 16);
  assert.match(socialCardProblems(badWidth).join(' '), /must be 1200x630/);
  const badHeight = Buffer.from(valid);
  badHeight.writeUInt32BE(631, 20);
  assert.match(socialCardProblems(badHeight).join(' '), /must be 1200x630/);
  const badSignature = Buffer.from(valid);
  badSignature[0] = 0;
  assert.match(socialCardProblems(badSignature).join(' '), /must be a PNG/);
  const badChunk = Buffer.from(valid);
  badChunk.write('JUNK', 12, 'ascii');
  assert.match(socialCardProblems(badChunk).join(' '), /IHDR/);
  assert.match(socialCardProblems(valid.subarray(0, 24)).join(' '), /complete IHDR/);
  const oversized = Buffer.alloc(SOCIAL_CARD_MAX_BYTES);
  valid.copy(oversized);
  assert.match(socialCardProblems(oversized).join(' '), /must be under 300000/);
});
