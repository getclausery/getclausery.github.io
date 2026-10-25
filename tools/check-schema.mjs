// Validates the structured data on every indexable page, not just that it parses. Search engines silently drop rich
// results when a required property is missing, a date disagrees with the visible page, a breadcrumb points at the wrong
// URL, or an FAQ answer is not actually on the page. Those failures never show up in HTML validation, so they get a
// dedicated check here.
import { readFileSync, existsSync } from 'node:fs';
import { SITE } from './partials.mjs';

const failures = [];
const fail = (file, message) => failures.push(`${file}: ${message}`);
const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ', ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…' };
const decodeOnce = (s) => String(s).replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? Number.parseInt(e.slice(2), 16) : Number(e.slice(1))) : entities[e.toLowerCase()] ?? m);
const decode = (s) => decodeOnce(decodeOnce(s));
const visible = (html) => decode((html.match(/<main[\s\S]*?<\/main>/i)?.[0] || html).replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim().toLowerCase();
const fileFor = (url) => { const path = new URL(url).pathname.slice(1); return !path || path.endsWith('/') ? path + 'index.html' : path; };
const local = (url) => typeof url === 'string' && url.startsWith(SITE);
const exists = (url) => local(url) && existsSync(fileFor(url));
const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
const today = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
const dates = JSON.parse(readFileSync('site/data/page-dates.json', 'utf8'));
const urls = [...readFileSync('sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
const ids = new Map();
const referencedIds = new Map();

for (const url of urls) {
  const file = fileFor(url);
  const html = readFileSync(file, 'utf8');
  const path = new URL(url).pathname.slice(1);
  const canonical = url;
  const modified = dates[path]?.date;
  const text = visible(html);
  const compact = text.replace(/[^a-z0-9]+/g, '');
  const nodes = [];
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let value;
    try { value = JSON.parse(json); } catch { fail(file, 'structured data is not valid JSON'); continue; }
    if (value['@graph']) nodes.push(...value['@graph'].map((n) => ({ ...n, '@context': value['@context'] })));
    else nodes.push(value);
  }
  if (!nodes.length) fail(file, 'no structured data');
  const localTypes = new Set();
  const localIds = new Set();
  for (const node of nodes) {
    const type = node['@type'];
    if (!type) { fail(file, 'structured data without @type'); continue; }
    localTypes.add(type);
    if (!node['@context'] || node['@context'] !== 'https://schema.org') fail(file, `${type} has no https://schema.org @context`);
    if (node['@id']) {
      if (localIds.has(node['@id'])) fail(file, `${type} repeats @id ${node['@id']} on one page`);
      localIds.add(node['@id']);
      if (ids.has(node['@id']) && !node['@id'].endsWith('#website') && !node['@id'].endsWith('#organization') && !node['@id'].endsWith('#logo') && !node['@id'].endsWith('#editors') && !node['@id'].endsWith('#sitenav')) fail(file, `${type} @id ${node['@id']} is also used on ${ids.get(node['@id'])}`);
      else ids.set(node['@id'], file);
    }
    const ref = (id, where) => { if (typeof id === 'string' && id.startsWith(SITE)) referencedIds.set(id, `${file} (${where})`); };
    ref(node.isPartOf?.['@id'], `${type}.isPartOf`);

    if (type === 'WebSite') {
      if (!node.name) fail(file, 'WebSite has no name');
      if (node.url !== SITE) fail(file, 'WebSite url must be the site root');
      if (!String(node['@id'] || '').endsWith('#website')) fail(file, 'WebSite @id should end with #website');
    }
    if (type === 'Organization') {
      if (!node.name || node.url !== SITE) fail(file, 'Organization needs name and site url');
      const logoUrl = typeof node.logo === 'string' ? node.logo : node.logo?.url || node.logo?.contentUrl;
      if (!exists(logoUrl)) fail(file, 'Organization logo does not resolve to a file');
      if (node.logo && typeof node.logo === 'object' && node.logo['@type'] === 'ImageObject') {
        if (!node.logo.width || !node.logo.height) fail(file, 'Organization logo ImageObject must include width and height');
      }
      if (!String(node['@id'] || '').endsWith('#organization')) fail(file, 'Organization @id should end with #organization');
    }
    if (type === 'SoftwareApplication' || type === 'WebApplication') {
      if (!node.name || !node.applicationCategory || !node.operatingSystem) fail(file, `${type} needs name, applicationCategory and operatingSystem`);
      const offers = Array.isArray(node.offers) ? node.offers : node.offers ? [node.offers] : [];
      if (!offers.length) fail(file, `${type} has no offer`);
      for (const offer of offers) {
        if (offer['@type'] !== 'Offer') fail(file, `${type} offer is not an Offer`);
        if (typeof offer.price !== 'string' || !/^\d+(?:\.\d+)?$/.test(offer.price)) fail(file, `${type} offer price must be a decimal string`);
        if (!offer.priceCurrency) fail(file, `${type} offer has no priceCurrency`);
      }
    }
    if (type === 'Article') {
      for (const key of ['headline', 'description', 'datePublished', 'dateModified', 'author', 'publisher', 'image', 'mainEntityOfPage']) if (!node[key]) fail(file, `Article is missing ${key}`);
      if (node.headline && node.headline.length > 110) fail(file, `Article headline is ${node.headline.length} characters (Google recommends at most 110)`);
      if (!isDate(node.datePublished) || !isDate(node.dateModified)) fail(file, 'Article dates must be YYYY-MM-DD');
      else if (node.datePublished > node.dateModified) fail(file, 'Article datePublished is after dateModified');
      if (isDate(node.dateModified) && node.dateModified > today) fail(file, 'Article dateModified is in the future');
      if (modified && node.dateModified !== modified) fail(file, `Article dateModified ${node.dateModified} does not match page-dates ${modified}`);
      const meop = typeof node.mainEntityOfPage === 'string' ? node.mainEntityOfPage : node.mainEntityOfPage?.['@id'] || node.mainEntityOfPage?.url;
      if (meop !== canonical) fail(file, `Article mainEntityOfPage must be its canonical URL (got ${JSON.stringify(node.mainEntityOfPage)?.slice(0,100)})`);
      const imgOk = Array.isArray(node.image)
        ? node.image.every((i) => local(typeof i === 'string' ? i : i?.url))
        : local(typeof node.image === 'string' ? node.image : node.image?.url);
      if (!imgOk) fail(file, 'Article image must be an absolute URL on this site (or ImageObject/array)');
      if (!node.author?.name || !node.publisher?.name) fail(file, 'Article needs named author and publisher');
      if (node.publisher?.logo && !local(node.publisher.logo.url)) fail(file, 'Article publisher logo must be on this site');
    }
    if (type === 'FAQPage') {
      const questions = Array.isArray(node.mainEntity) ? node.mainEntity : [];
      if (!questions.length) fail(file, 'FAQPage has no questions');
      const seen = new Set();
      for (const q of questions) {
        if (q['@type'] !== 'Question') fail(file, 'FAQPage mainEntity must be Question nodes');
        if (!q.name || !q.acceptedAnswer?.text) { fail(file, 'FAQ question or answer is empty'); continue; }
        if (seen.has(q.name)) fail(file, `FAQ question repeated: ${q.name.slice(0, 60)}`);
        seen.add(q.name);
        if (!compact.includes(decode(q.name).toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 40))) fail(file, `FAQ question is not visible on the page: ${q.name.slice(0, 60)}`);
        if (!compact.includes(decode(q.acceptedAnswer.text).toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 80))) fail(file, `FAQ answer is not visible on the page: ${q.name.slice(0, 60)}`);
      }
    }
    if (type === 'BreadcrumbList') {
      const items = Array.isArray(node.itemListElement) ? node.itemListElement : [];
      if (items.length < 2) fail(file, 'BreadcrumbList needs at least two items');
      items.forEach((item, index) => {
        if (item['@type'] !== 'ListItem') fail(file, 'BreadcrumbList contains a non-ListItem');
        if (item.position !== index + 1) fail(file, `breadcrumb position ${item.position} is out of order`);
        if (!item.name) fail(file, 'breadcrumb item has no name');
        if (!local(item.item) || !exists(item.item)) fail(file, `breadcrumb item does not resolve: ${item.item}`);
      });
      if (items.at(-1)?.item !== canonical) fail(file, 'the last breadcrumb must be the canonical page');
      if (items[0]?.item !== SITE) fail(file, 'the first breadcrumb must be the home page');
    }
    if (type === 'DigitalDocument') {
      for (const key of ['name', 'description', 'url', 'encodingFormat', 'contentUrl', 'isAccessibleForFree', 'dateModified', 'publisher']) if (node[key] === undefined) fail(file, `DigitalDocument is missing ${key}`);
      if (node.url !== canonical) fail(file, 'DigitalDocument url must be its canonical URL');
      if (node.encodingFormat !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') fail(file, 'DigitalDocument encodingFormat is not .docx');
      if (!exists(node.contentUrl)) fail(file, 'DigitalDocument contentUrl does not resolve to a file');
      if (node.isAccessibleForFree !== true) fail(file, 'DigitalDocument should be isAccessibleForFree: true');
      if (modified && node.dateModified !== modified) fail(file, `DigitalDocument dateModified ${node.dateModified} does not match page-dates ${modified}`);
      if (!Array.isArray(node.image) && !node.image) fail(file, 'DigitalDocument has no image');
      for (const image of Array.isArray(node.image) ? node.image : [node.image]) if (image && !exists(image)) fail(file, `DigitalDocument image does not resolve: ${image}`);
      if (node.thumbnailUrl && !exists(node.thumbnailUrl)) fail(file, 'DigitalDocument thumbnailUrl does not resolve');
    }
    if (type === 'CollectionPage') {
      if (node.url !== canonical) fail(file, 'CollectionPage url must be its canonical URL');
      if (!node.name || !node.description) fail(file, 'CollectionPage needs name and description');
      const list = node.mainEntity;
      const items = Array.isArray(list?.itemListElement) ? list.itemListElement : [];
      if (!items.length) fail(file, 'CollectionPage has no ItemList items');
      if (list?.numberOfItems !== items.length) fail(file, 'CollectionPage numberOfItems does not match the list');
      items.forEach((item, index) => {
        if (item.position !== index + 1) fail(file, 'CollectionPage ItemList positions are out of order');
        if (!exists(item.url)) fail(file, `CollectionPage item does not resolve: ${item.url}`);
      });
    }
    if (['WebPage', 'AboutPage', 'ContactPage', 'ItemPage', 'SearchResultsPage'].includes(type)) {
      if (node.url !== canonical) fail(file, `${type} url must be its canonical URL`);
      if (!node.name) fail(file, `${type} has no name`);
      if (type === 'WebPage' && !node.description) fail(file, 'WebPage has no description');
      if (node.isPartOf && (typeof node.isPartOf !== 'object' || Array.isArray(node.isPartOf))) fail(file, `${type} isPartOf must be an object reference`);
    }
    // Absolute internal URLs in any property must point at a page that exists.
    const walk = (value) => {
      if (typeof value === 'string') {
        if (local(value) && !exists(value) && !value.includes('#')) fail(file, `structured data points at a missing file: ${value}`);
      } else if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') Object.values(value).forEach(walk);
    };
    walk(node);
  }
  const pageTypes = ['WebPage', 'Article', 'CollectionPage', 'AboutPage', 'ContactPage', 'ItemPage', 'SearchResultsPage', 'WebSite'];
  if (![...localTypes].some((t) => pageTypes.includes(t))) fail(file, 'page has no WebPage-level structured data');
  if (localTypes.has('FAQPage') && ![...localTypes].some((t) => ['WebPage', 'Article', 'CollectionPage', 'AboutPage', 'ContactPage', 'ItemPage', 'SearchResultsPage'].includes(t))) fail(file, 'FAQPage page has no page-level node');
}

for (const [id, where] of referencedIds) if (!ids.has(id)) fail(where.split(' ')[0], `structured data references an @id that no page defines: ${id}`);

if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`\nSchema checks failed: ${failures.length} problem${failures.length === 1 ? '' : 's'}.`);
  process.exitCode = 1;
} else {
  console.log(`Schema checks passed: ${urls.length} pages, ${ids.size} unique @ids, every required property, date, breadcrumb and visible FAQ verified.`);
}
