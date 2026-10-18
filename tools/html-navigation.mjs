// Offline HTML navigation checks. parse5 distinguishes real elements from comments, raw script/style text and
// escaped examples; it also decodes attribute entities and supports single-quoted or unquoted href/id values.
// No browser or remote requests are involved. Documents use repository-relative paths, including index.html.
import { parse } from 'parse5';

const decode = (value) => { try { return decodeURIComponent(value); } catch { return value; } };

export function checkHtmlNavigation({ documents, site, fileExists = (file) => documents.has(file) }) {
  const failures = [];
  const fail = (file, message) => failures.push({ file, message });
  const root = new URL(site);
  if (!root.pathname.endsWith('/')) root.pathname += '/';
  const rootPath = decode(root.pathname);
  const parsed = new Map();
  let links = 0;
  let fragments = 0;

  for (const [file, html] of documents) {
    const ids = new Set();
    const namedAnchors = new Set();
    const references = [];
    let baseHref;
    const walk = (node) => {
      const attr = (name) => node.attrs?.find((a) => a.name === name)?.value;
      const id = attr('id');
      if (id) {
        if (ids.has(id)) fail(file, `duplicate id "${id}" makes section links ambiguous`);
        ids.add(id);
      }
      if (node.tagName === 'a' && attr('name')) namedAnchors.add(attr('name'));
      if (node.tagName === 'a' || node.tagName === 'area') {
        const href = attr('href');
        if (href !== undefined) references.push(href);
      }
      if (node.tagName === 'base' && baseHref === undefined && attr('href') !== undefined) baseHref = attr('href');
      // A template element itself may have an id, but its inert .content is not a target in the current document.
      for (const child of node.childNodes || []) walk(child);
    };
    walk(parse(html, { scriptingEnabled: false }));
    const documentUrl = new URL(file, root);
    let baseUrl = documentUrl;
    if (baseHref !== undefined) {
      try { baseUrl = new URL(baseHref, documentUrl); } catch { fail(file, `invalid base href: ${baseHref}`); }
    }
    parsed.set(file, { ids, namedAnchors, references, baseUrl });
  }

  const exists = (file) => parsed.has(file) || fileExists(file);
  for (const [file, doc] of parsed) {
    for (const href of doc.references) {
      let target;
      try { target = new URL(href, doc.baseUrl); } catch { fail(file, `invalid navigation URL: ${href}`); continue; }
      if (!['https:', 'http:'].includes(target.protocol) || target.origin !== root.origin) continue;
      links++;
      const pathname = decode(target.pathname);
      if (!pathname.startsWith(rootPath)) {
        fail(file, `same-site link is outside the deployment base: ${href}`);
        continue;
      }
      let targetFile = pathname.slice(rootPath.length);
      if (targetFile.includes('\0') || targetFile.split('/').some((part) => part === '..')) {
        fail(file, `invalid local navigation path: ${href}`);
        continue;
      }
      if (!targetFile || targetFile.endsWith('/')) targetFile += 'index.html';
      else if (!exists(targetFile) && exists(`${targetFile}/index.html`)) targetFile += '/index.html';
      if (!exists(targetFile)) {
        fail(file, `broken internal link: ${href} (missing ${targetFile})`);
        continue;
      }
      const destination = parsed.get(targetFile);
      if (!destination) continue; // A PDF fragment, for example #page=2, is not an HTML element id.
      const rawFragment = target.hash.slice(1).split(':~:')[0];
      const fragment = decode(rawFragment);
      if (!fragment) continue; // Empty fragments and text-only scroll directives have no element id to check.
      if (targetFile === 'app/index.html' && fragment.startsWith('/')) continue; // Clausery's real hash router only.
      fragments++;
      if (!destination.ids.has(fragment) && !destination.namedAnchors.has(fragment) && fragment.toLowerCase() !== 'top') {
        fail(file, `missing fragment target: ${href} (${targetFile} has no id "${fragment}")`);
      }
    }
  }
  return { failures, links, fragments };
}
