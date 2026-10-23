import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, globSync } from 'node:fs';
import { COMPETITORS } from '../../site/compare.mjs';
import { PLANS } from '../../app/lib/license.js';
import { PRICES, TRIAL_DAYS, REFUND_DAYS } from '../../app/config.js';
import { FREE_BULK_ROWS } from '../../app/lib/bulk.js';
import { REPO_URL } from '../../app/config.js';

const html = (file) => readFileSync(file, 'utf8');
const ld = (value) => [...value.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, json]) => JSON.parse(json));
const visible = (value) => value.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
const main = (value) => (value.match(/<main\b[\s\S]*?<\/main>/) || [value])[0];
// Pages link with a relative prefix that depends on their depth, so match the path rather than the exact href.
const linksTo = (body, path) => new RegExp(`href="(?:\\.\\.?/)?${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`).test(body);

test('the Why Clausery page compares, links every comparison and offers a next step', () => {
  const page = html('why-clausery/index.html');
  const body = main(page);
  assert.match(page, /<h1[^>]*>Why Clausery<\/h1>/);
  assert.ok(linksTo(body, 'pricing/'), 'needs a pricing link as the next step');
  assert.ok(linksTo(body, 'app/#/start/invoice'), 'needs an app link as the next step');
  for (const c of COMPETITORS) {
    assert.ok(linksTo(body, `compare/${c.slug}.html`), `missing comparison link: ${c.slug}`);
  }
  assert.ok(linksTo(body, 'compare/'), 'needs a link to the comparison index');
  // Every comparison page is named in the decision table, not just linked from the footer.
  for (const c of COMPETITORS) assert.ok(body.includes(c.name), `comparison not named: ${c.name}`);
});

test('the Why Clausery page has visible questions that match its structured data', () => {
  const page = html('why-clausery/index.html');
  const faq = ld(page).find((node) => node['@type'] === 'FAQPage');
  assert.ok(faq, 'FAQPage data is missing');
  assert.ok(faq.mainEntity.length >= 4, 'needs a useful number of questions');
  const text = visible(main(page)).toLowerCase();
  for (const q of faq.mainEntity) {
    assert.ok(text.includes(q.name.toLowerCase()), `question not visible: ${q.name}`);
    assert.ok(text.includes(q.acceptedAnswer.text.toLowerCase().slice(0, 90)), `answer not visible: ${q.name}`);
  }
});

test('the Why Clausery page states differences it can evidence and no social proof it cannot', () => {
  const body = main(html('why-clausery/index.html'));
  assert.ok(body.includes(REPO_URL), 'must link the public source');
  assert.ok(body.includes('changelog.html'), 'must link the changelog');
  assert.ok(body.includes('docs/security.html'), 'must link the security overview');
  assert.ok(body.includes('docs/self-hosting.html'), 'must link the self-hosting guide');
  assert.ok(body.includes('legal/privacy.html'), 'must link the privacy policy');
  // The limits are part of the pitch: a page that hides them is not honest positioning.
  assert.match(body, /does not:/i);
  assert.match(body, /collect payments/i);
  assert.match(body, /legal advice/i);
  // No invented proof: the page must not claim reviews, users or customers it cannot show.
  for (const phrase of ['testimonial', 'trusted by', 'customer stor', 'our team of', 'our customers say']) {
    assert.ok(!body.toLowerCase().includes(phrase), `unverifiable social-proof phrase on the page: ${phrase}`);
  }
});

test('the home page surfaces the proof and the comparisons in its content', () => {
  const body = main(html('index.html'));
  assert.match(body, /Proof, not adjectives/);
  assert.ok(linksTo(body, 'why-clausery/'), 'the home page must link the Why Clausery page');
  assert.ok(linksTo(body, 'changelog.html'), 'the home page must link the changelog');
  assert.ok(linksTo(body, 'docs/security.html'), 'the home page must link the security overview');
  assert.ok(linksTo(body, 'docs/self-hosting.html'), 'the home page must link the self-hosting guide');
  for (const c of COMPETITORS) {
    assert.ok(linksTo(body, `compare/${c.slug}.html`), `home page must link the comparison: ${c.slug}`);
  }
});

test('the about page says who maintains Clausery and how to check a claim', () => {
  const body = main(html('about/index.html'));
  assert.match(body, /Who you are talking to/);
  assert.match(body, /How to check any claim on this site/);
  assert.ok(body.includes(REPO_URL), 'must link the public repository');
  assert.ok(body.includes('changelog.html'), 'must link the changelog');
  assert.ok(body.includes('legal/privacy.html'), 'must link the privacy policy');
  assert.ok(body.includes('why-clausery/'), 'must link the Why Clausery page');
  // A support promise has to be the one the contact page makes: a person, not a queue.
  assert.match(body, /read by a person|no ticket queue/i);
});

test('the pricing matrix is generated from the plan configuration, not typed by hand', () => {
  const body = main(html('pricing/index.html'));
  assert.match(body, /Compare the plans side by side/);
  const row = (label) => {
    const found = body.match(new RegExp(`<th scope="row">${label}</th>([\\s\\S]*?)</tr>`));
    assert.ok(found, `missing matrix row: ${label}`);
    return found[1];
  };
  const own = row('Your own Word templates');
  assert.ok(own.includes(`Up to ${PLANS.free.maxTemplates}`), 'free own-template allowance must match PLANS');
  assert.ok(own.includes('Unlimited'), 'paid own-template allowance must match PLANS');
  const vault = row('Encrypted workspace \\(AES-256-GCM\\)');
  assert.ok(vault.includes('—'), 'free must not promise an encrypted workspace');
  assert.ok(vault.includes('Yes'), 'pro must offer an encrypted workspace');
  const intake = row('Client intake forms');
  assert.ok(intake.includes('—'), 'free must not promise client intake forms');
  const price = row('Price');
  assert.ok(price.includes(`$${PRICES.pro} per user per month`), 'price must match the configuration');
  assert.ok(price.includes(`$${PRICES.team} per month`), 'team price must match the configuration');
  const bulk = row('Documents from a spreadsheet');
  assert.ok(bulk.includes(`Up to ${FREE_BULK_ROWS}`), 'free spreadsheet limit must match the app');
});

test('the pricing page states the trial and the guarantee in plain words', () => {
  const body = visible(main(html('pricing/index.html')));
  assert.ok(body.includes(`${TRIAL_DAYS}-day free Pro trial`), 'trial length must match the configuration');
  assert.ok(body.includes(`${REFUND_DAYS}-day money-back guarantee`), 'guarantee length must match the configuration');
  assert.match(body, /no card/i);
  assert.match(body, /per user per month/i);
});

test('no page claims reviews, users or customers that the site cannot show', () => {
  // Social proof is only worth having if it is real. Until there are real, attributable quotes, the site must not
  // imply any. This fails loudly rather than letting an invented claim reach production.
  // The /customers/ page describes named use-case segments; that is descriptive, not a story.
  const files = globSync('**/*.html', { exclude: (p) => /^(node_modules|app\/|vendor\/|customers\/)/.test(p) });
  for (const file of files) {
    const text = html(file).toLowerCase();
    for (const phrase of ['testimonial', 'trusted by', 'customer stor', 'our team of', 'our customers say', 'what our users say']) {
      assert.ok(!text.includes(phrase), `${file}: unverifiable social-proof phrase "${phrase}"`);
    }
  }
});
