/* The free Pro trial: one per browser, a fixed number of days, and a record that never grants more than it should. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newTrial, trialState, trialPayload, daysLeftText } from '../../app/lib/trial.js';
import { TRIAL_DAYS } from '../../app/config.js';
import { Plan } from '../../app/lib/plan.js';

const DAY = 86400000;
const t0 = new Date('2026-10-15T09:30:00Z');

test('a new trial lasts TRIAL_DAYS from now', () => {
  const rec = newTrial(t0);
  assert.equal(rec.startedAt, t0.toISOString());
  assert.equal(new Date(rec.endsAt).getTime() - t0.getTime(), TRIAL_DAYS * DAY);
  assert.equal(newTrial(t0, 3).endsAt, new Date(t0.getTime() + 3 * DAY).toISOString());
});

test('a trial is unused, then active with whole days left (rounded up), then ended', () => {
  assert.deepEqual(trialState(null, t0), { status: 'unused' });
  assert.deepEqual(trialState(undefined, t0), { status: 'unused' });
  const rec = newTrial(t0);
  assert.equal(trialState(rec, t0).status, 'active');
  assert.equal(trialState(rec, t0).daysLeft, TRIAL_DAYS);
  assert.equal(trialState(rec, new Date(t0.getTime() + DAY / 2)).daysLeft, TRIAL_DAYS);   // half a day in: still 14
  assert.equal(trialState(rec, new Date(t0.getTime() + DAY)).daysLeft, TRIAL_DAYS - 1);
  assert.equal(trialState(rec, new Date(t0.getTime() + TRIAL_DAYS * DAY - 1000)).daysLeft, 1);   // the last second
  const end = trialState(rec, new Date(t0.getTime() + TRIAL_DAYS * DAY));
  assert.deepEqual(end, { status: 'ended', endsAt: rec.endsAt, seen: false });
  assert.equal(trialState({ ...rec, endSeen: true }, new Date(t0.getTime() + 30 * DAY)).seen, true);
});

test('a damaged trial record counts as ended, so it never grants a fresh trial', () => {
  for (const rec of [{}, { endsAt: 'soon' }, { endsAt: null }, { startedAt: t0.toISOString() }]) {
    assert.equal(trialState(rec, t0).status, 'ended', JSON.stringify(rec));
  }
});

test('an active trial unlocks Pro as a trial, and a plan knows the difference', () => {
  const rec = newTrial(t0);
  const p = trialPayload(rec);
  assert.deepEqual(p, { plan: 'pro', trial: true, expires: rec.endsAt.slice(0, 10), endsAt: rec.endsAt, source: 'trial' });
  const plan = new Plan();
  assert.equal(plan.isTrial, false);
  assert.equal(plan.can('unbranded'), false);
  plan.set('pro', p);
  assert.equal(plan.isPaid, true);
  assert.equal(plan.isTrial, true);
  assert.equal(plan.can('unbranded'), true);
  assert.equal(plan.can('bulk'), true);
  plan.set('pro', { plan: 'pro', source: 'online' });
  assert.equal(plan.isTrial, false);
});

test('days left reads naturally', () => {
  assert.equal(daysLeftText(1), '1 day left');
  assert.equal(daysLeftText(14), '14 days left');
});
