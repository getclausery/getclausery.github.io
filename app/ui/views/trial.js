/* Clausery <https://getclausery.github.io> — (C) 2026 Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of copyright management information under 17 U.S.C. 1202. Source: https://github.com/getclausery/getclausery.github.io */
/* The free Pro trial screen (#/trial, linked from the website). It starts this browser's trial if it has not had one,
   then says what is unlocked and until when. No card, no account, no email: the trial is a record in this browser. */
import { h, icon, setChildren } from '../dom.js';
import { FEATURE_LABELS } from '../../lib/plan.js';
import { daysLeftText } from '../../lib/trial.js';
import { TRIAL_DAYS } from '../../config.js';
import { priceLine, checkoutButtons } from '../offer.js';

export async function render(ctx) {
  const day = (iso) => new Date(iso).toLocaleDateString(ctx.settings.locale || undefined, { day: 'numeric', month: 'long', year: 'numeric' });
  const licensed = ctx.plan.isPaid && !ctx.plan.isTrial;
  const before = ctx.trial.state();
  if (!licensed && before.status === 'unused') await ctx.trial.start();
  const st = ctx.trial.state();
  const unlocked = licensed || st.status === 'active';
  const features = h('ul.feature-list', Object.values(FEATURE_LABELS).map((f) => h('li', icon(unlocked ? 'check' : 'lock', 16), f)));

  let title, intro, actions, note = null;
  if (licensed) {
    title = `You already have ${ctx.plan.name}`;
    intro = h('p', 'Every Pro feature is unlocked in this browser by your plan, so there is no trial to start.');
    actions = [h('a.btn.btn-primary', { href: '#/templates' }, 'Go to templates'), h('a.btn', { href: '#/settings' }, 'Plan and billing')];
  } else if (st.status === 'active') {
    title = before.status === 'unused' ? `Your ${TRIAL_DAYS}-day Pro trial has started` : `Your Pro trial: ${daysLeftText(st.daysLeft)}`;
    intro = h('p', 'Every Pro feature is unlocked in this browser until ', h('strong', day(st.endsAt)), '. No card and no account: when the trial ends you are back on the Free plan with everything you made, and nothing renews.');
    actions = [h('a.btn.btn-primary', { href: '#/templates' }, 'Start making documents'), h('a.btn', { href: '#/settings' }, 'Plan and billing')];
    note = h('p.small.muted', 'To keep Pro afterwards: ', priceLine());
  } else {
    title = 'Your free Pro trial has ended';
    intro = h('p', `This browser has already had its free Pro trial${st.endsAt ? `, which ended on ${day(st.endsAt)}` : ''}. Everything you made is still here and keeps working. Pro turns these back on:`);
    actions = checkoutButtons(ctx, { team: false });
    if (!actions.length) actions = [h('a.btn.btn-primary', { href: '../pricing/' }, 'See plans')];
    note = h('p.small.muted', priceLine());
  }

  setChildren(ctx.main, h('div.narrow.stack',
    h('div.page-head', h('div', h('h1', title))),
    h('section.card.stack', { 'aria-label': 'Pro trial' }, intro, features, h('div.row', actions), note)));
}
