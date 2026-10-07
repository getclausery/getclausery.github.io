import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countEvent, eventName, USAGE_ON } from '../../app/lib/usage.js';
import { USAGE_COUNTER } from '../../app/config.js';

const site = { hostname: 'getclausery.github.io' };
const person = { webdriver: false };
const endpoint = 'https://example.goatcounter.com/count';

test('an event names what happened and which library template, never anything typed or your own template', () => {
  assert.equal(eventName('app-opened'), 'app-opened');
  assert.equal(eventName('document-download', { sample: 'invoice', name: 'Invoice', fields: [] }), 'document-download/invoice');
  assert.equal(eventName('document-download', { name: 'Smith & Co retainer', fields: [] }), 'document-download/own');
});

test('counting is off without an endpoint, off the public site and in automated browsers', () => {
  assert.equal(countEvent('app-opened', null, { endpoint: '', loc: site, nav: person }), null);
  assert.equal(countEvent('app-opened', null, { endpoint, host: 'getclausery.github.io', loc: { hostname: 'localhost' }, nav: person }), null);
  assert.equal(countEvent('app-opened', null, { endpoint, host: 'getclausery.github.io', loc: site, nav: { webdriver: true } }), null);
  const url = new URL(countEvent('document-print', { sample: 'quote' }, { endpoint, host: 'getclausery.github.io', loc: site, nav: person }));
  assert.equal(url.origin + url.pathname, endpoint);
  assert.equal(url.searchParams.get('p'), 'document-print/quote');
  assert.equal(url.searchParams.get('e'), 'true');
  assert.deepEqual([...url.searchParams.keys()].sort(), ['e', 'p', 'rnd']);
});

test('the shipped configuration matches the privacy wording switch', () => {
  assert.equal(USAGE_ON, Boolean(USAGE_COUNTER.endpoint));
  if (USAGE_ON) assert.match(USAGE_COUNTER.since, /^\d{4}-\d{2}-\d{2}$/, 'set USAGE_COUNTER.since when counting goes live');
});

test('when counting is on, the app\'s content security policy lets the count request through', async () => {
  const { readFileSync } = await import('node:fs');
  const csp = /http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(readFileSync('app/index.html', 'utf8'))[1];
  const imgSrc = csp.split(';').map((d) => d.trim()).find((d) => d.startsWith('img-src'));
  if (USAGE_ON) assert.ok(imgSrc.split(/\s+/).includes(new URL(USAGE_COUNTER.endpoint).origin), 'add the counter origin to img-src in app/index.html');
  else assert.doesNotMatch(imgSrc, /goatcounter/);
});
