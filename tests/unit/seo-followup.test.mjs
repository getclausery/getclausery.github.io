import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRobotsPolicy } from '../../tools/robots.mjs';
import { COMPETITORS } from '../../site/compare.mjs';
import { COMPARISON_WORKFLOWS } from '../../site/data/comparison-workflows.mjs';
import { PRICES, TRIAL_DAYS } from '../../app/config.js';
import { PLANS } from '../../app/lib/license.js';

const html = (file) => readFileSync(file, 'utf8');
const textOf = (value) => value.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ').replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[e])).replace(/\s+/g, ' ').trim();

test('robots follows the longest matching rule and Allow wins an equal-length tie', () => {
  const allows = createRobotsPolicy('User-agent: *\nDisallow: /private/\nAllow: /private/public/\nDisallow: /same\nAllow: /same\n');
  assert.equal(allows('/'), true);
  assert.equal(allows('/private/client.html'), false);
  assert.equal(allows('/private/public/help.html'), true);
  assert.equal(allows('/same'), true);
  assert.equal(createRobotsPolicy('User-agent: *\nAllow: /same\nDisallow: /same\n')('/same'), true);
});

test('robots wildcards, end anchors and literal URL punctuation do not widen app exceptions', () => {
  const allows = createRobotsPolicy('User-agent: *\nDisallow: /\nAllow: /app/$\nAllow: /app/?*\nAllow: /file.json?ok=1$\n');
  assert.equal(allows('/app/'), true);
  assert.equal(allows('/app/?from=site&step=one'), true);
  assert.equal(allows('/app/main.js'), false);
  assert.equal(allows('/app/activate.html?key=not-a-real-credential'), false);
  assert.equal(allows('/file.json?ok=1'), true);
  assert.equal(allows('/fileXjson?ok=1'), false);
  assert.equal(allows('/file.jsonXok=1'), false);
  assert.equal(allows('/file.json?ok=12'), false);
});

test('generic crawler rules do not absorb another agent group, including empty Disallow groups', () => {
  assert.equal(createRobotsPolicy('User-agent: *\nDisallow:\nUser-agent: OtherBot\nDisallow: /\n')('/help'), true);
  const allows = createRobotsPolicy('User-agent: OtherBot\nDisallow: /public/\nUser-agent: *\nDisallow: /private/ # staff area\n');
  assert.equal(allows('/public/'), true);
  assert.equal(allows('/private/'), false);
  const combined = createRobotsPolicy('User-agent: *\nDisallow: /one/\nUser-agent: AnotherBot\nDisallow: /three/\nUser-agent: *\nDisallow: /two/\n');
  assert.equal(combined('/one/'), false);
  assert.equal(combined('/two/'), false);
  assert.equal(combined('/three/'), true);
});

test('the public noindex app entry is fetchable without opening other app or download paths to crawlers', () => {
  const robots = html('robots.txt');
  const allows = createRobotsPolicy(robots);
  for (const path of ['/app/', '/app/?source=site', '/app/index.html', '/app/index.html?source=site', '/app/theme.js', '/app/manifest.webmanifest']) assert.equal(allows(path), true, path);
  for (const path of ['/app/main.js', '/app/index.html/other', '/app/index.html-other', '/app/activate.html', '/app/activate.html?key=not-a-real-credential', '/samples/invoice.docx', '/marketing/README.md']) assert.equal(allows(path), false, path);
  assert.match(html('app/index.html'), /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(html('sitemap.xml'), /<loc>https:\/\/getclausery\.github\.io\/app\//);
  for (const [, url] of html('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)) assert.equal(allows(new URL(url).pathname), true, url);
  let oldRobots = robots;
  for (const pattern of ['/app/$', '/app/?*', '/app/index.html$', '/app/index.html?*']) oldRobots = oldRobots.replace(`Allow: ${pattern}\n`, '');
  assert.equal(createRobotsPolicy(oldRobots)('/app/'), false, 'reproduces the old blocked-noindex regression');
});

test('comparison pages describe actual free billing documents and optional per-user pricing', () => {
  for (const c of COMPETITORS) {
    const page = html(`compare/${c.slug}.html`);
    assert.ok(page.includes(`Pro $${PRICES.pro} per user per month`), c.slug);
    assert.ok(page.includes(`${PLANS.free.maxTemplates} of your own`), c.slug);
    const faq = [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(([, json]) => JSON.parse(json)).find((node) => node['@type'] === 'FAQPage');
    const answers = faq.mainEntity.map((q) => q.acceptedAnswer.text).join(' ');
    assert.ok(answers.includes(`$${PRICES.pro} per user per month`), c.slug);
    assert.ok(answers.includes(`${TRIAL_DAYS}-day trial`), c.slug);
    assert.match(answers, /Free library output includes a small Made with Clausery line/, c.slug);
    assert.doesNotMatch(textOf(page), /has no invoicing|with no seats|no per-seat pricing|You do not want to pay per user|Zoom agreed to buy|prices checked in September/i, c.slug);
    if (c.group === 'freelance') {
      const row = page.match(/<tr><th scope="row">Invoicing and payments<\/th><td>([\s\S]*?)<\/td>/)?.[1];
      assert.match(row || '', /Word invoices, quotes and receipts; no payment collection/, c.slug);
    }
  }
});

test('each comparison has its own workflow test, migration limits, visible FAQ and official vendor link', () => {
  assert.deepEqual(Object.keys(COMPARISON_WORKFLOWS).sort(), COMPETITORS.map((c) => c.slug).sort());
  const headings = new Set();
  for (const c of COMPETITORS) {
    const page = html(`compare/${c.slug}.html`);
    const workflow = COMPARISON_WORKFLOWS[c.slug];
    assert.ok(!headings.has(workflow.heading), c.slug);
    headings.add(workflow.heading);
    const words = textOf(workflow.body('../')).split(/\s+/).length;
    assert.ok(words >= 180, `${c.slug}: ${words} workflow words`);
    assert.match(page, /<section class="comparison-workflow" aria-labelledby="workflow-fit">/, c.slug);
    assert.ok(page.includes(`<a class="vendor-source" href="${c.vendorUrl}" rel="noopener">`), c.slug);
    assert.equal(new URL(c.vendorUrl).protocol, 'https:', c.slug);
    assert.match(page, /id="migration-checklist"/, c.slug);
    assert.match(page, /What stays outside Clausery/, c.slug);
    for (const [question, answer] of workflow.faq) {
      assert.ok(page.includes(question.replace(/&/g, '&amp;')), c.slug);
      assert.ok(textOf(page).includes(answer), c.slug);
    }
  }
});

test('worked docs explain restore conflicts, pack identity, intake progress and deployment boundaries', () => {
  const backups = textOf(html('docs/backups.html'));
  assert.match(backups, /Backups are not encrypted, even when the workspace is/);
  assert.match(backups, /updates records with matching IDs/);
  assert.match(backups, /Clears current templates, source files and drafts/);
  assert.match(html('docs/backups.html'), /id="restore-checklist"/);
  const teams = textOf(html('docs/teams.html'));
  assert.match(teams, /same template ID updates that template/);
  assert.match(teams, /Exporting a pack is a Pro feature/);
  assert.match(teams, /Imported templates count as your own templates/);
  const intake = textOf(html('docs/intake.html'));
  assert.match(intake, /Load saved answers/);
  assert.match(intake, /it does not automatically clear every existing value/);
  assert.match(intake, /Use a new draft for a new client/);
  const hosting = textOf(html('docs/self-hosting.html'));
  assert.match(hosting, /robots.txt is not access control/);
  assert.match(hosting, /SITE_URL changes app links in exported files, not the marketing canonicals/);
  assert.match(hosting, /tools\/partials.mjs/);
});
