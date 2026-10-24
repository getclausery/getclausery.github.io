/* Clausery <https://getclausery.github.io> — (C) 2026 Clausery. AGPL-3.0-or-later WITH Clausery-Trademark-Exception. Removing this notice is removal of copyright management information under 17 U.S.C. 1202. Source: https://github.com/getclausery/getclausery.github.io */
import { h, icon, toast, modal, confirmDialog, relativeTime, setChildren } from '../dom.js';
import { uid } from '../../lib/schema.js';
import { summarize } from '../../lib/logic.js';

const STATUS_LABEL = { draft: 'In progress', generated: 'Ready to send', sent: 'Sent', paid: 'Paid' };
function statusBadge(d, t) {
  const isInv = t && (/invoice|bill|receipt|deposit|final inv|hourly inv/i.test((t.name || '').toLowerCase()) || t.kind === 'invoice');
  let cls = '';
  if (d.status === 'paid') cls = 'badge-ok';
  else if (d.status === 'sent') {
    if (isInv) {
      const due = d.answers && d.answers.due_date ? new Date(d.answers.due_date + 'T00:00:00') : null;
      if (due && !isNaN(due) && due.getTime() < Date.now()) cls = 'badge-danger';
      else cls = 'badge-warn';
    } else {
      cls = 'badge-warn';
    }
  } else if (d.status === 'generated') {
    cls = isInv ? '' : 'badge-ok';
  }
  return h('span.badge', { class: cls }, STATUS_LABEL[d.status] || 'In progress');
}
function subMeta(d, t) {
  const parts = [];
  const isInv = t && (/invoice|bill|deposit|final inv|hourly inv/i.test((t.name || '').toLowerCase()) || t.kind === 'invoice');
  if (isInv) {
    if (d.status === 'sent' && d.sentAt) {
      const days = Math.floor((Date.now() - new Date(d.sentAt).getTime()) / 86400000);
      parts.push(`sent ${days}d ago`);
    }
    if (d.answers && d.answers.due_date) parts.push('due ' + d.answers.due_date);
    if (d.status === 'paid' && d.paidAt) parts.push('paid ' + new Date(d.paidAt).toLocaleDateString());
  }
  return parts.length ? h('div.small.muted', parts.join(' · ')) : null;
}

export async function render(ctx) {
  const [drafts, templates] = await Promise.all([ctx.drafts.list(), ctx.templates.list()]);
  const tmap = new Map(templates.map((t) => [t.id, t]));

  async function create() {
    if (!templates.length) { toast('Add a template first.', { type: 'warn' }); ctx.navigate('/templates'); return; }
    let sel;
    const m = modal({ title: 'New draft', body: h('div.stack', h('label.field', h('span.field-label', 'Template'), sel = h('select.select', { autofocus: true }, templates.map((t) => h('option', { value: t.id }, t.name))))),
      actions: [{ label: 'Cancel' }, { label: 'Start', primary: true, onClick: () => ctx.startDraft(tmap.get(sel.value)) }] });
    await m.closed;
  }

  // Sort: overdue first, then sent, then ready/generated, then in progress, each by updatedAt desc.
  function rank(d) {
    if (d.status === 'sent') {
      const due = d.answers && d.answers.due_date ? new Date(d.answers.due_date + 'T00:00:00') : null;
      if (due && !isNaN(due) && due.getTime() < Date.now()) return 0; // overdue
      return 1;
    }
    if (d.status === 'generated') return 2;
    if (d.status === 'paid') return 3;
    return 4; // draft
  }
  const ordered = [...drafts].sort((a, b) => {
    const ra = rank(a), rb = rank(b);
    if (ra !== rb) return ra - rb;
    return (b.updatedAt || '').localeCompare(a.updatedAt || '');
  });

  const overdueCount = drafts.filter((d) => d.status === 'sent' && (() => {
    const due = d.answers && d.answers.due_date ? new Date(d.answers.due_date + 'T00:00:00') : null;
    return due && !isNaN(due) && due.getTime() < Date.now();
  })()).length;

  const rowEl = (d) => {
    const t = tmap.get(d.templateId);
    return h('tr', { dataset: { draftId: d.id } },
      h('td', h('a', { href: '#/drafts/' + d.id, style: { fontWeight: 600 } }, d.title || (t ? summarize(t, d.answers) : '') || 'Untitled draft'), h('div.small.muted', t ? t.name : 'Template deleted'), subMeta(d, t)),
      h('td', statusBadge(d, t)),
      h('td.small.muted', relativeTime(d.updatedAt)),
      h('td.actions',
        h('a.btn.btn-sm', { href: '#/drafts/' + d.id }, t ? 'Open' : 'View'),
        h('button.btn.btn-ghost.btn-icon.btn-sm', { type: 'button', 'aria-label': 'Duplicate draft', onclick: async () => { const copy = { ...structuredClone(d), id: uid('d_'), title: (d.title || 'Draft') + ' (copy)', status: 'draft', generatedAt: null, sentAt: null, paidAt: null }; await ctx.drafts.save(copy); toast('Draft duplicated.'); ctx.router.resolve(); } }, icon('copy', 15)),
        h('button.btn.btn-ghost.btn-icon.btn-sm', { type: 'button', 'aria-label': 'Delete draft', onclick: async () => { if (!await confirmDialog({ title: 'Delete draft?', message: 'The answers in this draft will be removed from this device.', confirmLabel: 'Delete', danger: true })) return; await ctx.drafts.remove(d.id); ctx.router.resolve(); } }, icon('trash', 15))));
  };

  setChildren(ctx.main, h('div.container',
    h('div.page-head',
      h('div', h('h1', 'Drafts'),
        h('p.sub', overdueCount > 0
          ? h('span', { style: { color: 'var(--danger)' } }, overdueCount, ' overdue invoice', overdueCount === 1 ? '' : 's', ' · ')
          : null,
          'Every answered questionnaire, ready to generate again. Invoices track sent and paid status locally on this device.'),
      ),
      h('button.btn.btn-primary', { type: 'button', onclick: create }, icon('plus', 16), 'New draft')),
    ordered.length ? h('div.card', { style: { padding: 0, overflow: 'auto' } }, h('table.table', h('thead', h('tr', h('th', 'Draft'), h('th', 'Status'), h('th', 'Updated'), h('th', { class: 'actions' }, h('span.sr-only', 'Actions')))), h('tbody', ordered.map(rowEl))))
      : h('div.empty', h('h2', 'No drafts yet'), h('p', 'Start a draft from any template and answer the questions. Drafts save automatically as you type.'), h('button.btn.btn-primary', { type: 'button', onclick: create }, 'New draft')),
  ));
}
