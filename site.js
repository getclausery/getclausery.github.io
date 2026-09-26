/* Clausery site script: the mobile menu and the copy buttons. External so the pages work under a strict script-src 'self' policy. */
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
