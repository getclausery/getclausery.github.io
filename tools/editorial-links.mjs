// Contextual links only: breadcrumbs, docs navigation, header/footer links and repeated <!--nav--> blocks must not
// hide an orphan. The documents map is restricted to canonical indexable pages by the caller. Hubs' content lists
// count, but a page's own fragment links and several links from the same source count as no additional endorsement.
export function editorialLinkGraph(documents) {
  const incoming = new Map([...documents.keys()].map((url) => [url, new Set()]));
  const outgoing = new Map([...documents.keys()].map((url) => [url, new Set()]));
  const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#(x[\da-f]+|\d+);/gi, (m, n) => {
    const code = n[0].toLowerCase() === 'x' ? Number.parseInt(n.slice(1), 16) : Number(n);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : m;
  });
  for (const [from, html] of documents) {
    const main = (html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] || '')
      .replace(/<!--nav-->[\s\S]*?<!--\/nav-->/g, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(nav|script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
    for (const [, a, b] of main.matchAll(/<a\b[^>]*\bhref=(?:"([^"]+)"|'([^']+)')/gi)) {
      let target;
      try { target = new URL(decode(a ?? b), from); } catch { continue; }
      target.hash = ''; target.search = '';
      if (target.href === from || !documents.has(target.href)) continue;
      outgoing.get(from).add(target.href);
      incoming.get(target.href).add(from);
    }
  }
  return { incoming, outgoing };
}
