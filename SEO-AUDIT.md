# SEO audit and implementation notes

Baseline audit: 2026-10-17. Latest local follow-up: **2026-10-18** (not deployed; see the final section).
Baseline scope: the generated static site (248 indexable pages) and the build/check pipeline that produces it.
This includes the follow-up to the audit delivered in merged PR #51: four more guides, syndication and social-card
validation, and a contextual link graph. The build/check tools require Node 22+ for `fs.globSync`.
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
`navigational`) and topic cluster. There are 248 entries in 11 clusters. The checker enforces coverage in both
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
- A separate editorial graph excludes headers, footers, breadcrumbs, docs navigation, self-links and repeated
  `<!--nav-->` related-page blocks. Every non-home indexable page needs an inbound link from another page’s content.
  The 1,869 distinct source/target links have no content orphans; About is now linked from Home, and Teams & template
  packs from Getting started, rather than relying only on repeated navigation.

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

Four further high-intent guides close the gaps for independent contractor agreements, promissory notes, sublease
agreements and purchase orders. Each has 1,056–1,157 editorial words, sample wording, three visible FAQs with matching
structured data, an explicit publication date and source links. They have unique search-intent entries, a place in
the guide topics, contextual cross-links from existing guides and audience pages, and reciprocal `GUIDE_FOR` links
from the corresponding templates. The guide collection now has 63 articles.

### Syndication (`tools/check-feeds.mjs`)

- `feed.xml` must contain exactly the 63 guide and 24 clause pages, once each, with no hub or unrelated page.
- Entry IDs and links must agree with the canonical page. Titles must match its H1 or HTML title.
- Published dates must match `Article.datePublished` (or the clause's `WebPage.datePublished`), and updated dates must
  match `page-dates.json` and the guide's `Article.dateModified`. The feed-level update is the newest article date,
  not the build timestamp.
- All 221 `llms.txt` links must be unique, absolute same-site links to resolving, canonical, indexable pages. The
  noindex app launch link was replaced with About; no exception is made for noindex pages.
- `check:feeds` runs in `verify` and CI. Regression cases exercise missing, duplicate and unrelated entries, wrong
  titles/dates, dead links, foreign origins and noindex targets without modifying the generated files.

### Canonical, indexability and sitemap (`tools/check-seo.mjs`, `tools/make-sitemap.mjs`, `tools/check-sitemap.mjs`)

- `check-seo` now also verifies the robots meta allows indexing and following, `og:url` equals the canonical,
  `lastmod` equals the page date, paths are lowercase and unspaced, and every page is at most three clicks from Home.
- Every indexed page must use an absolute same-site Open Graph image. Its PNG signature and IHDR are inspected for
  real 1200×630 dimensions and a size below 300,000 bytes; HTML dimensions and the Twitter image must agree. The
  87 template cards must be distinct by URL and content hash, not copies of the generic image. There are 89 valid
  share cards in total. Invalid signatures, chunks, truncated headers, sizes and dimensions have regression coverage.
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

## Verification (17 October baseline)

All of the following passed for the 17 October release:

```
npm run lint
npm run check:html        # 261 HTML files, 0 problems
npm run check:seo         # 248 canonical pages, depth 2, 89 share cards, 1,869 editorial links, no content orphans
npm run check:feeds       # 87 Atom entries (63 guides + 24 clauses), 221 indexable llms.txt links
npm run check:intent      # 248 pages, 11 clusters, 248 unique queries, hubs link all members
npm run check:schema      # 248 pages, 310 unique @ids, required properties, dates, breadcrumbs, visible FAQs
npm run check:sitemap     # 248 URLs, 10 sections partition exactly, 87 image entries
npm run check:cwv         # max HTML 62,757 bytes, 1 stylesheet, no blocking scripts
npm run check:pages       # 7 sets, min 382 words in guides, worst sibling similarity 49%
npm test                  # 136/136
```

`npm run build` is reproducible: a second build produces byte-identical generated files.

## Remaining opportunities after the 17 October pass

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


## First local follow-up — 18 October 2026

**Status:** implemented and verified locally, not published. The previous coding session was closed when PR #52
merged. A new coding session and CI run are required before these changes can be pushed or deployed. No remote
GitHub operations, live vendor-price checks, local browser runs or traffic/ranking measurements were performed in
this follow-up.

### Comparison accuracy and decision support

- Kept all 11 established alternative-page URLs and their search-intent entries. Reworked `site/compare.mjs` and
  added `site/data/comparison-workflows.mjs`, with a distinct evaluation scenario and two bespoke FAQs per vendor.
  Examples include HotDocs branch testing, Clio matter-data handoffs, LawDepot jurisdiction checks, HoneyBook
  booking deposits, Bonsai time-to-invoice records and PandaDoc approval/signature boundaries.
- Corrected the product description: Clausery creates Word invoices, quotes and receipts, but does not collect
  payments, provide e-signatures or supply a hosted CRM/client portal. Pro is per user. Own pricing, trial length
  and the Free own-template allowance are read from `PRICES`, `TRIAL_DAYS` and `PLANS`, not duplicate literals.
- Removed unverified competitor price snapshots, trial terms and dated corporate-news claims. Each page links to
  its official vendor site and explains what to check. A content modification date does not imply that a vendor's
  current commercial terms were independently verified.
- Added migration checks, explicit limits, contextual documentation links and semantic row/column table headers.
  Worst sibling five-word-shingle similarity fell from **49% to 27%**, with a new comparison-set failure threshold
  of **35%**. This is an internal repeated-wording metric, not a Google ranking score or a promise of traffic gains.

### Worked documentation and deployment guidance

Expanded four existing pages, without adding thin new URLs:

- `docs/backups.html`: a recovery rehearsal, Merge versus Replace behavior, same-ID overwrites, plaintext backup
  handling and the distinction between workspace recovery and retaining signed/downloaded output files.
- `docs/teams.html`: a reviewed Word-template rollout, stable-ID pack updates, Pro pack export, Free own-template
  limits, answers handoffs and the absence of shared drafts or automatic synchronisation.
- `docs/intake.html`: an engagement-letter round trip, Save progress / Load saved answers / Save answers,
  same-template import, fresh drafts to avoid retained old answers and unencrypted file-transfer precautions.
- `docs/self-hosting.html`: an HTTPS deployment test, origin-specific workspace migration, private-host access
  controls, app `SITE_URL` versus marketing `SITE`, and offline-key versus online-license CSP boundaries.

The instructions follow the existing backup, pack, intake, draft-import and configuration implementations. All ten
`docs/` pages now participate in the programmatic content/schema/CTA checks; the shortest has 425 editorial words,
with a 380-word regression floor rather than a claim that word count itself improves rankings.

### Crawl/noindex consistency

The app entry already had `noindex` but `/app/` was disallowed, preventing a compliant crawler from reading it.
`tools/make-sitemap.mjs` now emits narrow exceptions for `/app/`, `/app/index.html` and their query variants. The
app remains absent from all sitemaps and retains its noindex metadata. Activation and other app paths, samples and
marketing remain excluded; the theme and manifest stay fetchable for public-page rendering.

`tools/robots.mjs` and `check:seo` check generic crawler rule precedence, wildcard/end-anchor matching, public
indexed-page crawlability, the app-entry exception and retained exclusions. Robots rules are crawl instructions,
not authentication or a guarantee that an excluded URL can never appear in search results.

### Local verification

`npm run build` and `npm run verify` pass:

| Check | Result |
| --- | --- |
| HTML and internal links | 261 checked, 0 problems |
| Canonical/indexable pages | 248; all fetchable under robots; maximum Home depth 2 |
| Editorial link graph | 1,926 links, no content orphans |
| Social images | 89 valid 1200×630 PNGs; 87 distinct template cards |
| Syndication | 87 Atom entries; 221 unique indexable `llms.txt` links |
| Schema | 310 unique IDs; visible FAQs and editorial dates agree |
| Sitemaps | 248 URLs; 10 section files partition exactly; 87 template images |
| Generated-page quality | 8 sets, including docs; comparison maximum similarity 27% |
| Static performance budgets | max HTML 62,757 B; CSS 17,182 B; site JS 3,938 B |
| Unit tests | **143/143 passed**, including seven new regressions |

Seven controlled negative mutations were also rejected: blocked app entry, removed app noindex, blocked indexable
section, missing comparison evaluation, missing official vendor source, cloned comparison content and a thin docs
page. Every mutated file was restored byte-for-byte. A separate fragment audit found **694 static links and zero
missing targets**. Only the 16 changed content-page date records advanced to 2026-10-18; the other dates and the
article-only feed remain unchanged.

A second full build is byte-identical. Generated HTML, sitemap surfaces, robots, `llms.txt` and page dates are saved
alongside their sources; `feed.xml` was rebuilt and remains unchanged because no feed article changed. Browser
coverage was extended to all 11 comparison pages and the four expanded docs, plus narrow-screen comparison checks;
**E2E remains CI-only and has not been executed for this local follow-up**.

### Next priorities

1. Publish from a new coding session and require its CI/Chromium checks before merging.
2. Use real Search Console query/page impressions, clicks and CTR to select the next content changes. This pass
   cannot infer ranking or conversion improvements from static checks.
3. Verify vendor-specific commercial details on official sources before quoting them again; record a verification
   date only after that review actually happens.
4. Measure deployed field Core Web Vitals and investigate the remaining launch-date article fallbacks using real
   editorial records. Neither task is replaced by a successful local build.


## Additional local pass — 18 October 2026

**Status:** saved locally for the user's publication workflow; not pushed or deployed. This pass builds on the
143-test working tree above and preserves the prior comparison, docs and robots changes. Browser/E2E remains
CI-only. No remote GitHub operation, Search Console query-volume analysis or live external-source review was done.

### Four trade-specific guides, not another set of generic alternatives

The photography, equipment rental, cleaning and tutoring templates previously linked to a general freelance or
hold-harmless article. `site/data/service-guides.mjs` now supplies a tailored companion for each:

| Guide | Editorial words, excluding repeated navigation | Concrete example |
| --- | ---: | --- |
| `guides/how-to-write-a-photography-contract.html` | 1,084 | Shoot coverage, edited-image delivery, booking balance and a defined image licence |
| `guides/what-to-include-in-an-equipment-rental-agreement.html` | 1,061 | Asset/accessory handover and separate rental-price/deposit accounting |
| `guides/how-to-write-a-cleaning-services-contract.html` | 1,096 | Task schedule, worker-hours, access and approval of extra work |
| `guides/what-to-include-in-a-tutoring-agreement.html` | 1,124 | Session plan, attendance billing, safeguarding and recording boundaries |

Each guide has a distinct primary informational query, one topic assignment, a sample paragraph, a worked table,
three visible FAQs matching FAQPage data, Article dates/citations and a direct free Word-template link. New HTML
titles are 46–59 characters. External source links are reading references, not a claim of fresh verification or
jurisdiction-wide legal compliance. Example rates and quantities are explicitly illustrative, not market data.

The primary template-to-guide links are derived from the same guide data. Contextual links were added to the
freelance-contract, model-release and hold-harmless guides, the freelancer audience page and the HoneyBook workflow.
Tests require each new guide to receive an editorial link from its own template, the guide hub and an existing
article; repeated footer navigation cannot satisfy that requirement. The guide set's maximum sibling shingle
similarity remains 3% (an internal wording check, not a search-engine ranking metric).

### More reliable commercial and legal copy

All five audience pages now read the Pro price and Free own-template allowance from `PRICES` and `PLANS`. Copy
explicitly identifies Pro intake, pack export and own-template calculations, and explains that encryption of a
workspace does not encrypt downloaded backups or answers files. Privacy wording distinguishes local document
assembly from the user's deliberate file sharing.

Removed the audience FAQ's blanket competitor-architecture/paywall claims and fixed state-specific landlord
examples that could be mistaken for universal notice or deposit rules. The landlord page now states that the app
does not determine legal deadlines. The existing freelance guide no longer asserts that every unsigned document
provides no protection or that a contractor label settles worker classification.

### Navigation integrity is now a permanent check

`tools/html-navigation.mjs`, called by the existing `check:html` command in `verify` and CI, uses the build-only
`parse5` dependency to inspect actual HTML elements. It checks relative and absolute same-origin navigation,
directory indexes, section fragments and duplicate active IDs. Quoted/unquoted attributes, entity/Unicode decoding,
legacy anchors and deployment bases have fixtures. Comments, escaped examples, script/style text and inert template
contents are not mistaken for real links.

The checker recognises empty/top/text fragments and exempts hash routes only on the real app entry. It does not
exempt ordinary app anchors, activation-page anchors or slash-prefixed fragments on documentation pages. Non-HTML
files such as PDFs can use their own fragment syntax. No browser or external requests are used by this checker.

Ten navigation tests include a real CLI integration test: missing sections, an absolute same-site missing page and
duplicate IDs must make `check:html` exit nonzero. Four further tests verify guide content, reciprocal/contextual
links, feed/llms inclusion, explicit intent/topic mapping and audience configuration/accuracy.

### Verification for this pass

A clean `npm ci` succeeds with zero reported vulnerabilities. `npm run build` and `npm run verify` pass:

| Check | Current result |
| --- | --- |
| HTML | **265 files, 0 problems** |
| Navigation | **14,999 same-site links; 706 static fragment links; 0 failures** |
| Canonical/indexable pages | **252**, all reachable from Home within 2 clicks |
| Editorial graph | 1,958 edges, no content orphans |
| Guides / feed / llms | **67 guides**, 91 Atom entries, 225 unique indexable llms links |
| Schema / sitemaps | 318 unique IDs; 252 URLs in 10 section sitemaps; 87 template images |
| Social cards | 89 valid cards, including 87 distinct template cards |
| Static budgets | max HTML 62,757 B; CSS 17,182 B; site JS 3,938 B (unchanged) |
| Unit/integration tests | **157/157 passed**, including 14 new regressions |

Only 19 content-date records changed or were added; their current date is 2026-10-18. Unchanged editorial records
retain their dates, even when a repeated related-guides footer gains links. Generated HTML, Atom feed, llms,
sitemaps and page dates are rebuilt alongside the sources. A second full build is byte-identical. The new parser
is development tooling and does not add JavaScript or assets to the browser payload.

CI browser coverage now includes the four new guide pages and the consultant audience page, plus narrow-screen
checks of each new guide's template link and FAQ disclosure. Those browser checks have been written and
syntax-checked, **not executed locally**. Before publication, require the existing CI verify and Chromium jobs to
pass. After deployment, use real search/traffic and field-performance data to assess impact; these local checks do
not demonstrate ranking gains.
