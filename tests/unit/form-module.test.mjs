import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderForm, scrollBehavior } from '../../app/lib/form.js';

test('the interview form module exports its renderer and reduced-motion helper', () => {
  assert.equal(typeof renderForm, 'function');
  assert.equal(typeof scrollBehavior, 'function');
});
