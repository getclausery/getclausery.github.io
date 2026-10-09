/* Interview: answer a template's questionnaire section by section, then preview and generate the document. */
import { h, icon, toast, modal, confirmDialog, pickFile, readFile, setTitle, announce, setChildren } from '../dom.js';
import { renderForm, scrollBehavior } from '../../lib/form.js';
import { evaluateForm, buildRenderData, buildPreviewData, summarize } from '../../lib/logic.js';
import { renderDocx, renderDocxBytes, zipFiles, previewDocx, describeTemplateError, isDocxError } from '../../lib/render.js';
import { recordHistory, KIND_LABELS } from '../../lib/history.js';
import { parseCsv, mapHeaders, rowsToAnswers, templateCsv, uniqueNames, FREE_BULK_ROWS, MAX_BULK_ROWS } from '../../lib/bulk.js';
import { requestPersistence } from '../../lib/store.js';
import { downloadBlob, safeFilename } from '../../lib/backup.js';
import { nowISO } from '../../lib/schema.js';
import { buildIntakeHtml, parseAnswersFile, sanitizeAnswers } from '../../lib/intake.js';
import { countEvent } from '../../lib/usage.js';

const SAVE_DELAY = 400;
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
let askedPersist = false;
/** The first time someone makes a document, ask the browser to protect this site's storage from automatic clean-up
    (Chrome and Edge grant it silently for sites people use; Firefox may ask). Drafts already survive reloads and restarts. */
function keepStorage() { if (askedPersist) return; askedPersist = true; requestPersistence().catch(() => {}); }
/** Whether this browser can hand a file to the system share sheet (Mail, Slack, Teams, Drive...). */
function canShareFiles() {
  try { return !!(navigator.canShare && navigator.share && navigator.canShare({ files: [new File([new Blob(['x'])], 'x.docx', { type: DOCX_MIME })] })); } catch { return false; }
}
const PREVIEW_DELAY = 600;
const PREVIEW_KEY = 'clausery.livePreview';
/** The live preview is on by default where there is room for it beside the questions; the choice is remembered. */
function livePreviewWanted() {
  try { const v = localStorage.getItem(PREVIEW_KEY); if (v === '1' || v === '0') return v === '1'; } catch { /* storage blocked */ }
  return !!(globalThis.matchMedia && globalThis.matchMedia('(min-width: 1280px)').matches);
}

export async function render(ctx, { id }) {
  const draft = await ctx.drafts.get(id);
  if (!draft) { setChildren(ctx.main, h('div.empty', h('h2', 'Draft not found'), h('a.btn', { href: '#/drafts' }, 'Back to drafts'))); return; }
  const template = await ctx.templates.get(draft.templateId);
  if (!template) { setChildren(ctx.main, h('div.empty', h('h2', 'The template for this draft was deleted'), h('p', 'The answers are still stored. Re-import the template pack or delete the draft.'), h('a.btn', { href: '#/drafts' }, 'Back to drafts'))); return; }
  const bytes = await ctx.templates.getFile(template.id);
  setTitle(draft.title || template.name);

  const steps = [...template.sections.map((s) => ({ id: s.id, title: s.title, description: s.description })), { id: '__review', title: 'Review & generate' }];
  let stepIndex = Math.max(0, Math.min(steps.length - 1, Number(sessionStorage.getItem('clausery.step.' + id)) || 0));
  let form = null;
  let evaluation = evaluateForm(template, draft.answers, ctx.settings);

  // Autosave: typing schedules a save; the save runs at once when the page hides, the workspace locks or the view goes.
  let saveTimer = null, pendingSave = false, stopped = false;
  async function flush() {
    clearTimeout(saveTimer); saveTimer = null;
    if (!pendingSave || stopped) return;
    pendingSave = false;
    try { await ctx.drafts.save(draft); }
    catch (e) { pendingSave = true; console.error(e); toast('The draft could not be saved: ' + (e.message || e), { type: 'danger', timeout: 6000 }); }
  }
  function persist() { if (stopped) return; pendingSave = true; clearTimeout(saveTimer); saveTimer = setTimeout(flush, SAVE_DELAY); }
  const onChange = (answers, path, ev) => { evaluation = ev; draft.status = 'draft'; renderStepper(); persist(); schedulePreview(); };

  const heading = h('h1.sr-only', draft.title || template.name);
  const titleInput = h('input.input', { value: draft.title || '', placeholder: 'Draft name (optional)', 'aria-label': 'Draft name', oninput: (e) => { draft.title = e.target.value; setTitle(draft.title || template.name); heading.textContent = draft.title || template.name; persist(); } });
  const stepperEl = h('nav.stepper', { 'aria-label': 'Sections' });
  const bodyEl = h('div');
  const noticeEl = h('div');
  const mounted = () => stepperEl.isConnected;

  // Live preview: the document as it stands, with unanswered questions shown as [labels]. Rendered off-screen and swapped
  // in, so a slow render never overwrites a newer one.
  let live = livePreviewWanted();
  let previewTimer = null, previewSeq = 0;
  const livePages = h('div.live-preview-pages');
  const liveStatus = h('span.small.muted', 'Updates as you answer');
  const livePanel = h('aside.live-preview', { 'aria-label': 'Live preview of the document', hidden: !live }, h('div.live-preview-head', h('strong', 'Live preview'), liveStatus), livePages);
  const liveBtn = h('button.btn.btn-sm', { type: 'button', 'aria-pressed': String(live), title: 'Show the document beside the questions', onclick: () => setLive(!live) }, icon('eye', 14), 'Live preview');
  const layout = h('div.interview', { class: live ? 'interview with-preview' : 'interview' });
  const page = h('div.container', { class: live ? 'container container-wide' : 'container' });
  function setLive(on) {
    live = on; liveBtn.setAttribute('aria-pressed', String(on)); livePanel.hidden = !on;
    layout.classList.toggle('with-preview', on); page.classList.toggle('container-wide', on);
    try { localStorage.setItem(PREVIEW_KEY, on ? '1' : '0'); } catch { /* storage blocked */ }
    if (on) refreshPreview(); else { previewSeq++; livePages.replaceChildren(); }
  }
  function schedulePreview() { if (!live) return; clearTimeout(previewTimer); previewTimer = setTimeout(refreshPreview, PREVIEW_DELAY); }
  async function refreshPreview() {
    clearTimeout(previewTimer);
    if (!live || !mounted()) return;
    const seq = ++previewSeq;
    try {
      const { data } = buildPreviewData(template, draft.answers, ctx.settings);
      const staging = h('div');
      await previewDocx(renderDocx(bytes, data), staging);
      if (seq !== previewSeq || !mounted()) return;
      livePages.replaceChildren(...staging.childNodes);
      liveStatus.textContent = 'Updates as you answer';
      fitPreview();
    } catch (e) {
      if (seq !== previewSeq) return;
      if (!isDocxError(e)) console.error(e);
      liveStatus.textContent = isDocxError(e) ? 'This template has an error, so it cannot be previewed.' : 'The preview could not be drawn.';
    }
  }
  // scale the pages down to the panel's width
  function fitPreview() {
    const sheet = livePages.querySelector('section.docx'); const wrap = livePages.querySelector('.docx-wrapper');
    if (!sheet || !wrap) return;
    wrap.style.zoom = '';
    const width = sheet.offsetWidth; if (!width) return;
    wrap.style.zoom = String(Math.max(0.3, Math.min(1, (livePages.clientWidth - 8) / width)));
  }
  const resizer = globalThis.ResizeObserver ? new ResizeObserver(() => { if (!mounted()) { resizer.disconnect(); return; } fitPreview(); }) : null;
  if (resizer) resizer.observe(livePanel);

  ctx.lockHooks.add(flush);
  const onPageHide = () => { if (mounted()) flush(); else window.removeEventListener('pagehide', onPageHide); };
  const onVisibility = () => { if (!mounted()) document.removeEventListener('visibilitychange', onVisibility); else if (document.visibilityState === 'hidden') flush(); };
  window.addEventListener('pagehide', onPageHide);
  document.addEventListener('visibilitychange', onVisibility);
  // another tab deleted this draft or its template: stop writing, or the next keystroke would bring the draft back
  const offChange = ctx.store.onChange(async (s, sid, info) => {
    if (!mounted()) { offChange(); return; }
    if (!info || !info.remote) return;
    if (!((s === 'drafts' && sid === draft.id) || (s === 'templates' && sid === template.id) || s === '*')) return;
    let gone;
    try { gone = !(await ctx.drafts.get(draft.id)) || !(await ctx.templates.get(template.id)); } catch { return; }   // locked: the lock screen takes over
    if (!gone || stopped) return;
    stopped = true; pendingSave = false; clearTimeout(saveTimer);
    setChildren(noticeEl, h('div.notice.notice-warn', { role: 'alert' }, icon('warn'), h('div', h('strong', 'This draft was deleted in another tab. '), 'Changes made here are no longer saved. Export the answers if you want to keep them.')));
    noticeEl.scrollIntoView({ block: 'nearest' });
  });

  function sectionErrors(sid) { return Object.keys(evaluation.errors).filter((p) => { const key = p.split(/[[.]/)[0]; const f = template.fields.find((x) => x.key === key); return f && f.sectionId === sid && evaluation.visible[key] !== false; }).length; }
  function sectionAnswered(sid) { return template.fields.filter((f) => f.sectionId === sid && f.type !== 'computed' && evaluation.visible[f.key] !== false).every((f) => { const v = draft.answers[f.key]; return f.type === 'checkbox' || f.type === 'repeat' || (v !== '' && v != null); }); }

  // a section's missing answers read as "left" until the person has tried to move past it; only then are they "to fix"
  const checked = new Set();
  function renderStepper() {
    const total = Object.keys(evaluation.errors).length;
    setChildren(stepperEl, 
      h('div.progress', { 'aria-hidden': 'true' }, h('div', { style: { width: Math.round(100 * (stepIndex) / (steps.length - 1)) + '%' } })),
      h('ol', { style: { marginTop: '.75rem' } }, steps.map((s, i) => { const errs = s.id === '__review' ? 0 : sectionErrors(s.id); const flagged = errs && checked.has(s.id); const done = s.id !== '__review' && !errs && sectionAnswered(s.id); const word = flagged ? 'to fix' : 'left'; const name = `${s.title}${errs ? `, ${errs} answer${errs === 1 ? '' : 's'} ${word}` : done ? ', complete' : ''}`; return h('li', { class: [flagged ? 'errors' : '', done ? 'done' : ''].join(' ') }, h('button.step', { type: 'button', 'aria-current': i === stepIndex ? 'step' : null, 'aria-label': name, onclick: () => go(i, true) }, h('span.num', done ? icon('check', 13) : String(i + 1)), h('span', s.title), errs ? h('span.cnt', { 'aria-hidden': 'true' }, `${errs} ${word}`) : null)); })),
      total ? h('p.small.muted', { style: { marginTop: '.75rem' } }, `${total} answer${total === 1 ? '' : 's'} still needed.`) : h('p.small', { style: { marginTop: '.75rem', color: 'var(--ok)' } }, 'All required answers are in.'),
    );
  }

  function go(i, force = false) {
    if (i < 0 || i >= steps.length) return;
    if (i > stepIndex && form && !force) { checked.add(steps[stepIndex].id); form.setShowErrors(true); if (sectionErrors(steps[stepIndex].id) && form.focusFirstError()) { renderStepper(); toast('Complete the highlighted answers, or use the section list to skip ahead.', { type: 'warn' }); return; } }
    // Next and Back count as trying to move on; jumping ahead from the section list is a deliberate skip and flags nothing
    if (!force && stepIndex < steps.length - 1 && i !== stepIndex) checked.add(steps[stepIndex].id);
    stepIndex = i; sessionStorage.setItem('clausery.step.' + id, String(i)); renderStep(); window.scrollTo({ top: 0, behavior: scrollBehavior() });
  }

  function renderStep() {
    renderStepper();
    const step = steps[stepIndex];
    if (step.id === '__review') { form = null; renderReview(); return; }
    form = renderForm({ template, answers: draft.answers, settings: ctx.settings, sectionId: step.id, onChange });
    setChildren(bodyEl, h('div.card', h('h2', step.title), step.description ? h('p.muted', step.description) : null, form.element,
      h('div.interview-nav', h('button.btn', { type: 'button', disabled: stepIndex === 0, onclick: () => go(stepIndex - 1) }, icon('back', 16), 'Back'), h('button.btn.btn-primary', { type: 'button', onclick: () => go(stepIndex + 1) }, stepIndex === steps.length - 2 ? 'Review' : 'Next', icon('chevron', 16)))));
    const first = form.element.querySelector('input, select, textarea'); if (first && stepIndex > 0) first.focus({ preventScroll: true });
    announce(`Section ${stepIndex + 1} of ${steps.length}: ${step.title}`);
  }

  function renderReview() {
    const { data, evaluation: ev } = buildRenderData(template, draft.answers, ctx.settings);
    evaluation = ev;
    const errs = Object.entries(ev.errors).filter(([p]) => ev.visible[p.split(/[[.]/)[0]] !== false);
    const previewWrap = h('div.preview-wrap.print-area', { hidden: true, tabindex: 0, role: 'region', 'aria-label': 'Document preview' });
    let previewReady = false, previewJob = null;
    const preparePreview = () => {
      if (previewReady) return Promise.resolve();
      if (previewJob) return previewJob;
      previewBtn.disabled = true;
      previewJob = (async () => {
        const blob = renderDocx(bytes, data);
        previewWrap.hidden = false;
        await previewDocx(blob, previewWrap);
        previewReady = true;
      })().catch((e) => { previewWrap.hidden = true; throw e; }).finally(() => { previewBtn.disabled = false; previewJob = null; });
      return previewJob;
    };
    const previewBtn = h('button.btn', { type: 'button', onclick: async () => { try { await preparePreview(); previewWrap.focus({ preventScroll: true }); previewWrap.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }); } catch (e) { fail(e); } } }, icon('eye', 16), 'Preview');
    const fail = (e) => { if (isDocxError(e)) modal({ title: 'The document could not be generated', body: h('ul', describeTemplateError(e).map((m) => h('li', m))), actions: [{ label: 'OK', primary: true }] }); else { console.error(e); toast('Generation failed: ' + (e.message || e), { type: 'danger', timeout: 8000 }); } };
    const fileName = docxName();
    const record = (kind, extra = {}) => recordMade(kind, { file: fileName, ...extra });
    const printBtn = h('button.btn', { type: 'button', onclick: async () => {
      printBtn.disabled = true;
      try {
        await preparePreview();
        await document.fonts.ready;
        await Promise.all([...previewWrap.querySelectorAll('img')].map((img) => img.decode().catch(() => {})));
        if (!previewWrap.isConnected) return;
        window.print();
        await record('print');
      } catch (e) { fail(e); } finally { printBtn.disabled = false; }
    } }, icon('print', 16), 'Print / Save as PDF');
    const generate = async () => {
      try {
        const blob = renderDocx(bytes, data);
        downloadBlob(blob, fileName);
        await record('download'); keepStorage();
        toast('Document downloaded. It was generated entirely in this browser, and this version is recorded in the history below.', { type: 'ok', timeout: 6000 });
      } catch (e) { fail(e); }
    };
    const share = async () => {
      try {
        const file = new File([renderDocx(bytes, data)], fileName, { type: DOCX_MIME });
        await navigator.share({ files: [file], title: fileName });
        await record('share'); keepStorage();
      } catch (e) { if (e && e.name === 'AbortError') return; fail(e); }
    };
    const answered = template.fields.filter((f) => f.type !== 'computed' && f.type !== 'repeat' && ev.visible[f.key] !== false && draft.answers[f.key] !== '' && draft.answers[f.key] != null).length;
    const totalQ = template.fields.filter((f) => f.type !== 'computed' && f.type !== 'repeat' && ev.visible[f.key] !== false).length;
    setChildren(bodyEl, h('div.stack',
      h('div.card',
        h('h2', 'Review & generate'),
        errs.length ? h('div.notice.notice-warn', icon('warn'), h('div', h('strong', `${errs.length} answer${errs.length === 1 ? '' : 's'} still needed. `), 'You can generate anyway; missing answers render blank.', h('ul', { style: { margin: '.5rem 0 0' } }, errs.slice(0, 8).map(([p, m]) => { const key = p.split(/[[.]/)[0]; const f = template.fields.find((x) => x.key === key); const si = steps.findIndex((s) => s.id === (f && f.sectionId)); return h('li', h('a', { href: '#', onclick: (e) => { e.preventDefault(); go(si); } }, f ? f.label : p), ': ', m); }), errs.length > 8 ? h('li', `…and ${errs.length - 8} more`) : null)))
          : h('div.notice.notice-ok', icon('check'), h('div', h('strong', 'Everything is answered. '), `${answered} of ${totalQ} questions.`)),
        h('div.row', { style: { marginTop: '1rem' } }, h('button.btn.btn-primary.btn-lg', { type: 'button', onclick: generate }, icon('download', 18), 'Download .docx'), previewBtn, printBtn,
          canShareFiles() ? h('button.btn', { type: 'button', onclick: share }, icon('share', 16), 'Share…') : null,
          h('button.btn', { type: 'button', onclick: openBulk }, icon('table', 16), 'From a spreadsheet')),
        h('p.small.muted', { style: { marginTop: '1rem', marginBottom: 0 } }, 'The Word file is assembled in your browser from the template and these answers. Nothing is uploaded. This draft stays saved here, so you can change any answer and download it again later.')),
      h('div.card',
        h('h3', 'Answers'),
        h('dl.kv', template.fields.filter((f) => ev.visible[f.key] !== false).flatMap((f) => { const v = data[f.key]; const shown = f.type === 'repeat' ? (v.length ? v.map((r) => (f.children || []).filter((c) => c.type !== 'checkbox').map((c) => r[c.key]).filter(Boolean).join(', ')).join('; ') : '—') : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : (v === '' ? '—' : String(v)); return [h('dt', f.label), h('dd', { style: { color: shown === '—' ? 'var(--muted)' : '' } }, shown)]; })),
        h('div.row', { style: { marginTop: '1rem' } },
          h('button.btn.btn-sm', { type: 'button', onclick: importAnswers }, icon('upload', 14), 'Import answers (.json)'),
          h('button.btn.btn-sm', { type: 'button', onclick: exportAnswers }, icon('download', 14), 'Export answers (.json)'),
          h('button.btn.btn-sm', { type: 'button', onclick: exportIntake }, icon('share', 14), 'Create client intake form'))),
      historyBox,
      previewWrap,
    ));
    refreshHistory();
  }

  // ---------------------------------------------------------------- history of generated documents
  const historyBox = h('div');
  function docxName() { return safeFilename((draft.title || summarize(template, draft.answers, 1) || template.name) + ' - ' + template.name, 'docx'); }
  async function recordMade(kind, extra = {}) {
    await recordHistory(draft, { kind, template: template.name, app: ctx.version, ...extra });
    if (kind !== 'restore') { draft.status = 'generated'; draft.generatedAt = nowISO(); countEvent('document-' + kind, template); }
    pendingSave = true; await flush(); refreshHistory(); renderStepper();
  }
  function refreshHistory() {
    const list = Array.isArray(draft.history) ? draft.history : [];
    setChildren(historyBox, h('div.card',
      h('h3', icon('clock', 18), ' History'),
      list.length
        ? [h('p.small.muted', 'Each document made from this draft, with the time and a SHA-256 fingerprint of the exact answers used. Restore puts those answers back, so you can make the same document again or start a change from it.'),
          h('ol.history-list', list.map((e) => h('li',
            h('div', h('strong', KIND_LABELS[e.kind] || e.kind), e.count > 1 ? ` (${e.count} documents)` : '', h('span.muted', ' · ' + new Date(e.at).toLocaleString())),
            h('div.small.muted', e.file ? e.file + ' · ' : '', 'answers ', h('code', { title: e.fingerprint }, String(e.fingerprint || '').slice(0, 12))),
            e.answers ? h('button.btn.btn-sm', { type: 'button', onclick: () => restore(e) }, 'Restore these answers') : null)))]
        : h('p.small.muted', 'Nothing made yet. Every document you download, print, share or make from a spreadsheet is recorded here with the time and a fingerprint of its answers.')));
  }
  async function restore(e) {
    if (!await confirmDialog({ title: 'Restore these answers?', message: `The answers used on ${new Date(e.at).toLocaleString()} replace the current ones. The current answers are kept in the history first.`, confirmLabel: 'Restore' })) return;
    await recordHistory(draft, { kind: 'restore', template: template.name, app: ctx.version });
    draft.answers = structuredClone(e.answers); draft.status = 'draft';
    pendingSave = true; await flush(); evaluation = evaluateForm(template, draft.answers, ctx.settings);
    toast('Answers restored.', { type: 'ok' }); renderStepper(); renderStep();
  }

  // ---------------------------------------------------------------- many documents from a spreadsheet
  function openBulk() {
    const limit = ctx.plan.can('bulk') ? MAX_BULK_ROWS : FREE_BULK_ROWS;
    const status = h('div.stack-sm', { role: 'status', 'aria-live': 'polite' });
    let batch = null;
    const goBtn = h('button.btn.btn-primary', { type: 'button', disabled: true, onclick: () => makeBatch() }, icon('download', 16), 'Generate');
    const downloadCsv = () => downloadBlob(new Blob(['\uFEFF' + templateCsv(template, draft.answers)], { type: 'text/csv' }), safeFilename(template.name + ' spreadsheet', 'csv'));
    const chooseCsv = async () => {
      const file = await pickFile('.csv,text/csv'); if (!file) return;
      batch = null; goBtn.disabled = true;
      const rows = parseCsv(await readFile(file, 'text'));
      if (rows.length < 2) { setChildren(status, h('div.notice.notice-warn', icon('warn'), h('div', 'No rows found. The first row should hold the column headings and each row after it one document.'))); return; }
      const { map, unknown, matched } = mapHeaders(rows[0], template);
      if (!matched.length) { setChildren(status, h('div.notice.notice-warn', icon('warn'), h('div', 'None of the column headings match this template\'s questions. Download the spreadsheet template to see the headings it expects.'))); return; }
      const all = rowsToAnswers(template, draft.answers, rows.slice(1), map);
      const items = all.items.slice(0, limit);
      // name each file after the first column whose values differ between rows (a client, an invoice number...)
      const varying = map.findIndex((k, c) => k && new Set(rows.slice(1).map((r) => (r[c] || '').trim())).size > 1);
      const names = uniqueNames(items.map((it, i) => (varying >= 0 && (rows[i + 1][varying] || '').trim()) || `Row ${it.row}`)).map((n) => n + ' - ' + template.name + '.docx');
      batch = { items, names, file: file.name };
      setChildren(status,
        h('div.notice.notice-ok', icon('check'), h('div', h('strong', `${items.length} document${items.length === 1 ? '' : 's'} ready. `), `${matched.length} column${matched.length === 1 ? '' : 's'} matched questions.`)),
        all.items.length > limit ? h('div.notice.notice-warn', icon('warn'), h('div', `The spreadsheet has ${all.items.length} rows; ${limit === FREE_BULK_ROWS ? `the Free plan makes the first ${limit}. ` : `the first ${limit} are made. `}`, limit === FREE_BULK_ROWS ? h('a', { href: '#', onclick: (e) => { e.preventDefault(); ctx.requirePlan('bulk'); } }, 'Pro has no limit.') : null)) : null,
        unknown.length ? h('p.small.muted', 'Ignored columns (no matching question): ' + unknown.join(', ')) : null,
        all.problems.length ? h('div.notice.notice-warn', icon('warn'), h('div', h('strong', 'Some cells were skipped; the draft\'s answer is used instead:'), h('ul', all.problems.slice(0, 6).map((p) => h('li', p)), all.problems.length > 6 ? h('li', `…and ${all.problems.length - 6} more`) : null))) : null);
      goBtn.disabled = false;
      setChildren(goBtn, icon('download', 16), `Generate ${items.length} document${items.length === 1 ? '' : 's'} (.zip)`);
    };
    const makeBatch = async () => {
      if (!batch) return;
      goBtn.disabled = true;
      try {
        const files = batch.items.map((it, i) => ({ name: batch.names[i], bytes: renderDocxBytes(bytes, buildRenderData(template, it.answers, ctx.settings).data) }));
        const zipName = safeFilename(`${template.name} - ${files.length} documents`, 'zip');
        downloadBlob(zipFiles(files), zipName);
        await recordMade('bulk', { file: zipName, count: files.length }); keepStorage();
        m.close();
        toast(`${files.length} documents made from ${batch.file} and downloaded as one .zip. Nothing was uploaded.`, { type: 'ok', timeout: 7000 });
      } catch (e) { goBtn.disabled = false; fail(e); }
    };
    const fail = (e) => { if (isDocxError(e)) modal({ title: 'The documents could not be generated', body: h('ul', describeTemplateError(e).map((x) => h('li', x))), actions: [{ label: 'OK', primary: true }] }); else { console.error(e); toast('Generation failed: ' + (e.message || e), { type: 'danger', timeout: 8000 }); } };
    const m = modal({ title: 'Documents from a spreadsheet', body: h('div.stack',
      h('p', 'Make one document per row of a spreadsheet, such as an invoice for each client. Each row fills in or replaces this draft\'s answers, and empty cells keep them, so set what stays the same here first.'),
      h('ol.stack-sm',
        h('li', h('button.btn.btn-sm', { type: 'button', onclick: downloadCsv }, icon('download', 14), 'Download the spreadsheet template (.csv)'), h('div.small.muted', 'One column per question, with this draft\'s answers as the first row.')),
        h('li', 'Add a row for each document in Excel, Google Sheets or Numbers, and save it as CSV.'),
        h('li', h('button.btn.btn-sm', { type: 'button', onclick: chooseCsv }, icon('upload', 14), 'Choose the .csv file'))),
      status,
      h('div.row', goBtn),
      h('p.small.muted', (ctx.plan.can('bulk') ? `Up to ${MAX_BULK_ROWS} documents at a time. ` : `The Free plan makes up to ${FREE_BULK_ROWS} documents per spreadsheet; Pro has no limit. `) + 'The spreadsheet is read in this browser and never uploaded. Repeating lists, such as line items, come from this draft.')),
      actions: [{ label: 'Close' }] });
  }

  async function importAnswers() {
    const file = await pickFile('.json,application/json'); if (!file) return;
    try {
      const { answers, templateName } = parseAnswersFile(await readFile(file, 'text'));
      if (templateName && templateName !== template.name && !await confirmDialog({ title: 'Different template', message: `These answers were collected for "${templateName}". Import them into this ${template.name} draft anyway?`, confirmLabel: 'Import' })) return;
      const { answers: clean, count: n } = sanitizeAnswers(template, answers);
      Object.assign(draft.answers, clean);
      draft.status = 'draft'; pendingSave = true; await flush(); evaluation = evaluateForm(template, draft.answers, ctx.settings);
      toast(`${n} answer${n === 1 ? '' : 's'} imported.`, { type: 'ok' }); renderStep();
    } catch (e) { toast(e.message, { type: 'danger', timeout: 7000 }); }
  }
  function exportAnswers() {
    const payload = { format: 'clausery.answers', version: 1, templateName: template.name, templateId: template.id, exportedAt: nowISO(), answers: draft.answers };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), safeFilename((draft.title || template.name) + ' answers', 'json'));
  }
  async function exportIntake() {
    if (!ctx.requirePlan('intake')) return;
    let intro;
    const m = modal({ title: 'Client intake form', size: 'lg', body: h('div.stack',
      h('p', 'Creates a single HTML file with this questionnaire (no document, no answers). Send it to the client; they open it on their computer, fill it in offline, and send back the answers file, which you import here.'),
      h('label.field', h('span.field-label', 'Message to the client'), intro = h('textarea.textarea', { rows: 3 }, `Please complete the questions below for your ${template.name}. When you are done, choose "Save answers" and email us the file.`)),
      h('p.small.muted', 'The form works from a file on their computer or any web host, with no account and no data sent anywhere.')),
      actions: [{ label: 'Cancel' }, { label: 'Download intake form', primary: true, onClick: async () => { const html = await buildIntakeHtml({ template, settings: ctx.settings, intro: intro.value, siteUrl: ctx.siteUrl, version: ctx.version }); downloadBlob(new Blob([html], { type: 'text/html' }), safeFilename(template.name + ' intake', 'html')); toast('Intake form downloaded.', { type: 'ok' }); } }] });
    await m.closed;
  }

  setChildren(layout, stepperEl, bodyEl, livePanel);
  setChildren(page, heading,
    h('div.row.row-between', { style: { marginBottom: '1rem' } }, h('div.row', h('a.btn.btn-ghost.btn-sm', { href: '#/drafts' }, icon('back', 16), 'Drafts'), h('span.badge', template.name)), h('div.row', liveBtn, h('div', { style: { minWidth: '240px' } }, titleInput))),
    noticeEl,
    layout,
  );
  setChildren(ctx.main, page);
  renderStep();
  refreshPreview();
}
