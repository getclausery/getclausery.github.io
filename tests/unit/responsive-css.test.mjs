import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';

test('site media query width breakpoints have units and fit the stylesheet budget', () => {
  const css = readFileSync('site.css', 'utf8');
  assert.doesNotMatch(css, /@media\s*\(\s*(?:min|max)-width\s*:\s*[1-9]\d*\s*\)/);
  assert.ok(statSync('site.css').size <= 45_000);
});
