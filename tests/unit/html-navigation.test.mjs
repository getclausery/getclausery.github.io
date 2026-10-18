import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { checkHtmlNavigation } from '../../tools/html-navigation.mjs';
import { SITE } from '../../tools/partials.mjs';

const inspect = (pages, files = [], site = 'https://example.test/') => checkHtmlNavigation({
  documents: new Map(Object.entries(pages)), site, fileExists: (file) => files.includes(file),
});
const messages = (result) => result.failures.map(({ file, message }) => `${file}: ${message}`).join('\n');

test('navigation resolves relative, directory-index, query and absolute same-origin links', () => {
  const result = inspect({
    'index.html': '<main id=main><a href="docs/#intro">Docs</a><a href="https://example.test/docs/index.html?from=home#intro">Absolute</a><a href="//example.test/docs?from=home#intro">Directory alias</a></main>',
    'docs/index.html': '<h1 id=intro>Introduction</h1><a href=../#main>Home</a>',
  });
  assert.deepEqual(result.failures, []);
  assert.equal(result.links, 4);
  assert.equal(result.fragments, 4);
});

test('navigation uses decoded attributes and fragments, including Unicode and legacy named anchors', () => {
  const result = inspect({
    'index.html': '<h1 id="billing&amp;tax">Billing</h1><h2 id="Résumé">Summary</h2><a name=legacy></a><a href="#billing%26tax">Tax</a><a href=\'#R%C3%A9sum%C3%A9\'>Résumé</a><a href=#legacy>Legacy</a><map name=m><area href="#billing&amp;tax" alt="Tax"></map>',
  });
  assert.deepEqual(result.failures, []);
  assert.equal(result.fragments, 4);
});

test('comments, raw script/style text, escaped examples and inert template content are not navigation', () => {
  const result = inspect({
    'index.html': '<main id=main><a href=#main>Real</a><!-- <a href="missing.html#gone"> --><script>const example = \'<a href="missing.html#gone">\';</script><style>/* <a href="missing.html#gone"> */</style><pre>&lt;a href="missing.html#gone"&gt;</pre><template id=example><a href="missing.html#gone">Inert</a><div id=main></div></template></main>',
  });
  assert.deepEqual(result.failures, []);
  assert.equal(result.links, 1);
  assert.equal(result.fragments, 1);
});

test('missing files, missing fragments and wrong-case fragments are rejected, including absolute URLs', () => {
  const result = inspect({
    'index.html': '<h1 id=Title>Title</h1><a href="https://example.test/missing.html">Missing absolute</a><a href=#gone>Missing anchor</a><a href=#title>Wrong case</a>',
  });
  assert.equal(result.failures.length, 3);
  assert.match(messages(result), /broken internal link.*missing\.html/);
  assert.match(messages(result), /missing fragment target: #gone/);
  assert.match(messages(result), /missing fragment target: #title/);
});

test('only the real app entry hash router is exempt; other app and document anchors are checked', () => {
  const result = inspect({
    'index.html': '<a href="app/#/templates">App route</a><a href="app/index.html?from=site#/start/invoice">Start</a><a href="app/#main">App main</a><a href="app/#missing">Bad app anchor</a><a href="docs/#/not-a-route">Bad docs anchor</a><a href="app/activate.html#/not-a-route">Bad activation anchor</a><a href="report%20final.pdf#page=2">PDF</a>',
    'app/index.html': '<main id=main></main>',
    'app/activate.html': '<main id=activate></main>',
    'docs/index.html': '<main id=guide></main>',
  }, ['report final.pdf']);
  assert.equal(result.failures.length, 3);
  assert.match(messages(result), /app\/#missing/);
  assert.match(messages(result), /docs\/#\/not-a-route/);
  assert.match(messages(result), /activate\.html#\/not-a-route/);
});

test('empty, top and scroll-to-text fragments are valid without invented element ids', () => {
  const result = inspect({
    'index.html': '<h1 id=intro>Intro</h1><h2 id="intro:~:literal">Literal punctuation</h2><a href="#">Top</a><a href="#top">Top</a><a href="#TOP">Top</a><a href="#:~:text=Intro">Text</a><a href="#intro:~:text=Intro">Anchor plus text</a><a href="#intro%3A~%3Aliteral">Literal id</a>',
  });
  assert.deepEqual(result.failures, []);
});

test('duplicate active ids are rejected without counting inert template ids or legacy names as duplicates', () => {
  const result = inspect({
    'index.html': '<h1 id=same>One</h1><h2 id=same>Two</h2><a name=same></a><template><h3 id=same>Inert</h3></template><div id=""></div>',
  });
  assert.equal(result.failures.length, 1);
  assert.match(messages(result), /duplicate id "same"/);
});

test('external links need no network and do not hide bad same-site absolute targets', () => {
  const result = inspect({
    'index.html': '<a href="https://other.test/missing.html#not-ours">External</a><a href="mailto:person@example.test">Mail</a><a href="tel:+1234">Phone</a><a href="https://example.test/absent/#part">Our broken page</a>',
  });
  assert.equal(result.links, 1);
  assert.equal(result.failures.length, 1);
  assert.match(messages(result), /absent\/index\.html/);
});

test('deployment subpaths and base href are respected, and unsafe or malformed URLs are rejected', () => {
  const result = inspect({
    'index.html': '<base href="docs/"><a href="#intro">Base-relative anchor</a><a href="/project-other/#intro">Outside deployment</a><a href="/project/%2f../secret.html">Encoded traversal</a><a href="http://[bad">Malformed</a>',
    'docs/index.html': '<h1 id=intro>Intro</h1>',
  }, [], 'https://example.test/project/');
  assert.equal(result.failures.length, 3);
  assert.match(messages(result), /outside the deployment base/);
  assert.match(messages(result), /invalid local navigation path/);
  assert.match(messages(result), /invalid navigation URL/);
  const invalidBase = inspect({ 'index.html': '<base href="http://[bad"><main id=main><a href=#main>Fallback document</a></main>' });
  assert.equal(invalidBase.failures.length, 1);
  assert.match(messages(invalidBase), /invalid base href/);
  const unicodeBase = inspect({ 'index.html': '<h1 id=intro>Intro</h1><a href="#intro">Section</a>' }, [], 'https://example.test/d%C3%A9mo/');
  assert.deepEqual(unicodeBase.failures, []);
});


test('the actual HTML-check command rejects fragment, absolute-link and duplicate-id regressions', () => {
  const dir = mkdtempSync(join(tmpdir(), 'clausery-navigation-'));
  const checker = resolve('tools/check-html.mjs');
  const fixture = (body) => `<!doctype html><html lang="en"><head><title>Navigation fixture</title><meta name="description" content="Offline checker fixture"><meta name="viewport" content="width=device-width"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script></head><body><main id="main"><h1 id="heading">Fixture</h1>${body}</main></body></html>`;
  const run = (body) => {
    writeFileSync(join(dir, 'index.html'), fixture(body));
    return spawnSync(process.execPath, [checker], { cwd: dir, encoding: 'utf8' });
  };
  try {
    const valid = run('<a href="#heading">Working section</a>');
    assert.equal(valid.status, 0, valid.stdout + valid.stderr);
    for (const [body, expected] of [
      ['<a href="#missing">Missing section</a>', /missing fragment target/],
      [`<a href="${SITE}absent.html">Missing absolute page</a>`, /broken internal link/],
      ['<div id="heading">Duplicate</div>', /duplicate id/],
    ]) {
      const invalid = run(body);
      assert.equal(invalid.status, 1, invalid.stdout + invalid.stderr);
      assert.match(invalid.stdout, expected);
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
