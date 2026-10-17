# SEO audit and implementation notes

Date: 2026-10-17. Scope: the generated static site (244 indexable pages) and the build/check pipeline that produces it.
This was an offline audit: no Search Console, CrUX or Lighthouse data was available in the build environment, so
Core Web Vitals work is based on the HTML, CSS, JavaScript and image bytes that ship. Run PageSpeed Insights against
the deployed site for field and lab confirmation.

## What the audit found

The site already had a strong base: unique titles and descriptions, one canonical per page, a segmented sitemap, a
reachability check, no orphan pages, a maximum click depth of two, and structured data on every indexable page.
The gaps were in the things that are easy to let drift:

- **Search intent was implicit.** Nothing recorded which query each page was written to win, so two pages could
  quietly target the same phrase or a new page could ship without deciding what it was for.
- **Template pages stopped at the download.** 15 of 87 templates had no companion guide; several more pointed at a
  guide that covered only one clause of the document.
- **Six high-intent topics had no guide at all:** salary increase letters, reference letters, cease and desist
  letters, meeting minutes, sales commission agreements and expense reimbursement forms.
- **The thinnest guides were thin.** The shortest guide had 191 words of visible content, and several were under 400.
- **The home page had no `WebPage` node.** It had `WebSite`, `Organization` and `SoftwareApplication`, but nothing
  tying the page itself into the graph.
- **Schema was only checked for parsing.** No check verified required properties, date agreement, breadcrumb order or
  whether a FAQ answer was actually visible on the page.
- **Core Web Vitals had no guardrails.** The home hero was a 158 KB PNG loaded without `fetchpriority`, template
  previews were lazy-loaded even when they were the likely LCP image, and every page made a blocking request for the
  260-byte theme script.
- **Sitemap sections had no images.** The 87 template previews were invisible to image search.
- **Programmatic pages had no quality gate.** A generated page could ship with a duplicate intro, no FAQ, no CTA or
  wording copied from a sibling set.

## What changed

### Search-intent mapping (`site/data/search-intent.mjs`, `tools/check-intent.mjs`)

Every indexable page now has an entry: primary query, intent (`transactional`, `commercial`, `informational` or
`navigational`) and topic cluster. There are 244 entries in 11 clusters. The checker enforces coverage in both
directions (no unmapped page, no stale entry), unique queries and token sets, known intents and clusters, and that
each query appears in the page's title, H1 or description. It also checks the funnel: transactional and commercial
pages must link to the app, pricing or a download in the main content; informational pages must offer a template,
tool or app next step; and every cluster hub must link every member. The new `for/` hub supplies the missing hub for
the audience cluster.

### Internal-link architecture

- Added a `for/` hub (“Who Clausery is for”) with `CollectionPage` data, and a back-link on every audience page.
- Added a “browse by team” block to the templates index, one click from the most-linked page.
- Completed `GUIDE_FOR`: all 87 templates now link to a relevant guide, and five weak mappings were replaced (for
  example `employee-nda` → “What to include in an NDA”, `move-in-checklist` → the lease guide, and
  `board-resolution` → the new meeting minutes guide).
- Added calls to action to the clauses, comparisons, free-tools, invoice-template, audience and docs hubs, plus a
  guide link on each template page.
- Linked the new guides from the relevant audience pages and from the templates that use them.
- Click depth from Home remains two, with no orphans; the checker now fails if any page needs more than three clicks
  or is unreachable.

### Structured data (`tools/check-schema.mjs`)

Added a validator that checks every page in the sitemap, not just JSON parseability:

- one page-level node per page, with `url` matching the canonical;
- unique `@id`s sitewide, and every `isPartOf` reference resolving to a defined node;
- `WebPage`/`Article`/`CollectionPage` required properties;
- Article headline length, `datePublished <= dateModified`, and `dateModified` equal to the page's date in
  `site/data/page-dates.json`;
- breadcrumb order, names, resolving URLs, home as first item and the canonical page as last;
- FAQ questions and answers actually visible on the page (whitespace and entity tolerant);
- `DigitalDocument` encoding, free-access flag, resolving content URL and images;
- resolving absolute internal URLs anywhere in the graph.

On the page side, the home page gained a `WebPage` node, guide Articles gained an `@id` and an `isPartOf` link to
their WebPage node, and publisher logos gained explicit dimensions.

### Core Web Vitals (`tools/check-cwv.mjs`)

- Home hero: WebP at 1200w (32 KB) and 800w (18 KB) with the original PNG as fallback, a matching `<link rel=preload
  as=image>` with `imagesrcset`, `fetchpriority="high"`, eager loading, explicit dimensions and `decoding="async"`.
- Template previews: 87 WebP variants (4.6 MB total versus 5.7 MB of JPEG), served through `<picture>` with the JPEG
  fallback, eager and high priority instead of lazy.
- The 260-byte theme script is now inlined in the head of every site page, removing one render-blocking request; the
  separate `app/theme.js` stays for the app.
- The audit ships as a static budget check: one stylesheet, no synchronous scripts, dimensions on every image,
  `decoding="async"` on raster images, no lazy-loaded image in the first screen, WebP sources for `<picture>`,
  LCP preload, CSS under 25 KB, site JS under 8 KB, HTML under 100 KB, and template preview WebP under 120 KB.

### Content gaps

Six new guides (each with visible FAQs and `FAQPage` data):

- How to write a salary increase letter
- How to write a reference letter (with examples)
- How to write a cease and desist letter
- How to write meeting minutes (with a template)
- What is a sales commission agreement?
- How to write an expense reimbursement form

Ten thin guides were expanded with worked examples, troubleshooting, FAQ sections or a worked table: client intake,
conditional clauses, repeating lists, confidentiality checklist, automating Word templates, mail merge vs automation,
NDA vs confidentiality agreement, Australian tax invoices, kill fees and statements of work. Visible guide content
now ranges from 443 to 2,101 words (median 721), up from a minimum of 191.

### Canonical, indexability and sitemap (`tools/check-seo.mjs`, `tools/make-sitemap.mjs`, `tools/check-sitemap.mjs`)

- `check-seo` now also verifies the robots meta allows indexing and following, `og:url` equals the canonical,
  `lastmod` equals the page date, paths are lowercase and unspaced, and every page is at most three clicks from Home.
- The sitemap gained `for/` and `company/` sections (10 section files plus the index) and image entries for all 87
  template previews, with title and caption, in `sitemaps/templates.xml` and the main `sitemap.xml`.
- `check-sitemap` proves the index and section files partition the main sitemap exactly, with no URL lost or
  duplicated, valid and non-future lastmods matching `page-dates.json`, valid priorities, real WebP files behind every
  image entry, and robots.txt pointing at both sitemap files.

### Programmatic landing-page quality (`tools/check-pages.mjs`)

Seven generated sets now have explicit quality gates: templates, invoice templates, clauses, comparisons, audience
pages, guides and free tools. Depending on the set, the gate requires a minimum amount of visible unique content,
H1/H2 structure, FAQ answers, the expected schema, a working CTA, the full template or sample wording, question tables,
comparison tables, related reading, a guide link and a back-link to the hub. Five-word shingle similarity within a set
fails above 55%. Current worst pair: 49% (two comparison pages); templates peak at 21%.

## Verification

All of the following pass in the working tree:

```
npm run lint
npm run check:html        # 257 HTML files, 0 problems
npm run check:seo         # 244 canonical pages, depth 2, lastmod/robots/og:url consistent
npm run check:intent      # 244 pages, 11 clusters, 244 unique queries, hubs link all members
npm run check:schema      # 244 pages, 302 unique @ids, required properties, dates, breadcrumbs, visible FAQs
npm run check:sitemap     # 244 URLs, 10 sections partition exactly, 87 image entries
npm run check:cwv         # max HTML 62,757 bytes, 1 stylesheet, no blocking scripts
npm run check:pages       # 7 sets, min 382 words in guides, worst sibling similarity 49%
npm test                  # 136/136
```

`npm run build` is reproducible: a second build produces byte-identical generated files.

## Remaining opportunities (not done here)

1. **Field Core Web Vitals.** Run PageSpeed Insights and CrUX after deploy. The static budgets cannot measure INP or
   real-world LCP; the search box and calculator pages are the interactions to watch.
2. **Comparison differentiation.** The comparison set still shares up to 49% of its wording. The highest-value next
   step is competitor-specific pricing history and feature detail, not more boilerplate.
3. **Published dates.** Twenty guides still use the launch date as a fallback `datePublished`. Backfill from editorial
   records when available; do not invent dates.
4. **Product docs depth.** `docs/` pages range from 297 to 907 words. They are navigational documentation, but the
   three shortest could take a worked example each.
5. **More image entries.** Only template previews are in the image sitemap. The Open Graph cards and screenshots could
   be added if they are ever used as landing images.
6. **Anchor diversity.** The new cross-links are descriptive, but a periodic crawl of exact-match anchor share is worth
   adding to the checker once there is a backlink dataset.
