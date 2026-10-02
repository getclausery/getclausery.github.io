/* Clausery site script: the mobile menu, the copy buttons and the template finder. External so the pages work under a strict script-src 'self' policy. */
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest('.menu-btn');
  if (!btn) return;
  const nav = document.getElementById(btn.getAttribute('aria-controls'));
  if (!nav) return;
  btn.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
});
// Copy buttons: the clause library's sample wording as plain text, one paragraph per line, or a code box (textarea) as is.
document.addEventListener('click', async (e) => {
  const btn = e.target.closest && e.target.closest('.copy-btn');
  if (!btn) return;
  const src = document.getElementById(btn.dataset.copy);
  const status = btn.parentElement.querySelector('.copy-status');
  if (!src) return;
  const box = src.tagName === 'TEXTAREA';
  const text = box ? src.value : [...src.querySelectorAll('p')].map((p) => p.textContent.trim()).join('\n\n');
  try {
    await navigator.clipboard.writeText(text);
    if (status) status.textContent = 'Copied to the clipboard.';
  } catch {
    if (box) { src.focus(); src.select(); if (status) status.textContent = 'Press Ctrl+C (or Cmd+C) to copy the selected code.'; return; }
    const range = document.createRange();
    range.selectNodeContents(src);
    const sel = window.getSelection();
    sel.removeAllRanges(); sel.addRange(range);
    if (status) status.textContent = 'Press Ctrl+C (or Cmd+C) to copy the selected text.';
  }
});
// Template finder on list pages: filters the cards as you type. The box is hidden in the HTML and only shown here, so
// readers without JavaScript never see a control that does nothing. ?q= pre-fills it (the home page search form uses it).
for (const box of document.querySelectorAll('[data-filter-for]')) {
  const root = document.getElementById(box.dataset.filterFor);
  const input = box.querySelector('input');
  if (!root || !input) continue;
  const count = box.querySelector('[data-filter-count]');
  const empty = document.querySelector('[data-filter-empty]');
  // Match the start of words, so "nda" finds NDAs but not "standard" or "calendar".
  const items = [...root.querySelectorAll('.feature')].map((el) => [el, [...el.childNodes].map((n) => n.textContent).join(' ').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)]);
  const groups = [...root.querySelectorAll('.filter-group')];
  const run = () => {
    const words = input.value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    let shown = 0;
    for (const [el, tokens] of items) { const hit = words.every((w) => tokens.some((t) => t.startsWith(w))); el.hidden = !hit; if (hit) shown += 1; }
    for (const g of groups) g.hidden = !g.querySelector('.feature:not([hidden])');
    if (count) count.textContent = words.length ? `${shown} of ${items.length} templates match` : '';
    if (empty) empty.hidden = shown > 0;
  };
  input.addEventListener('input', run);
  box.hidden = false;
  const q = new URL(location.href).searchParams.get('q');
  if (q) { input.value = q; run(); }
}
