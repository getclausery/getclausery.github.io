# The Hidden and the Manifest

A book-length theological research project: *The Hidden and the Manifest — A Catholic
Theology of Manifestation, and How the Church May Baptize an Age*.

The companion research brief is in `../research/harmonizing-the-manifestation-space.md`.

## What is here

| Path | What it is |
|---|---|
| `manuscript/` | One Markdown file per section; filename order (with `starts:`) sets the order |
| `apparatus.json` | Per-chapter **The point / Do this / What this sets up** blocks, keyed by chapter slug |
| `build.py` | Zero-dependency builder: web edition, print edition, EPUB 3, indexes, report |
| `make-cover.py` | Composites the typographic cover over `cover-plate.png` → `cover.jpg` |
| `make-wrap.py` | Builds the full wrap (back, spine, front) at the spine width the page count asks for |
| `make-pdf.py` | Typesets the PDF edition (reportlab + pyphen): 5.5 × 8.5, running heads, page numbers, bookmarks, contents page with real page numbers |
| `PITCH.md` | Pitch kit: back cover, comps, pitches, metadata, interview questions |
| `cover.jpg` | 1600 × 2400 cover, embedded in the EPUB and page 1 of the PDF |
| `fonts/` | Crimson Text (SIL OFL 1.1): four TTFs for the PDF, four woff2 subsets for the web and EPUB |
| `verify.py` | 157 acceptance checks across the editions, the interior, and the cover |
| `publish.sh` | one command: build everything, copy the hand-out set, run the checks |
| `dist/` | Build output (git-ignored) |

## Source conventions

Each manuscript file starts with a small front-matter block:

```
---
kind: front | part | chapter | appendix   (default: chapter)
title: ...
lede: ...            (chapters and appendices, optional)
label: Part One      (parts only)
starts: ch33         (parts only: the chapter this part opener precedes)
---
```

`::scene` on its own line becomes a section break. Pipe tables, blockquotes, lists,
headings, bold/italic, inline links, and raw HTML blocks (used for `.thesis` panels)
are supported. A line beginning `<` is passed through as HTML.

Order of the book is computed, not alphabetical: front matter by filename, then parts
and chapters interleaved using each part's `starts:`, then appendices A–H.

## Apparatus

`apparatus.json` holds three short fields per chapter:

```json
"ch26": { "point": "...", "do": "...", "next": "..." }
```

The builder renders them as a bordered block at the end of the chapter — **The point**
(what the chapter established), **Do this** (something to do, usually in ten minutes),
and **What this sets up** (the bridge to the next chapter). Editing the book's argument
means editing these three lines too; they are the reader's summary of record.

## Generated material

- **Appendix G, Index of Citations** — every scriptural and catechetical reference,
  extracted from the text at build time, listed in canonical order with chapter numbers.
- **Appendix H, Index of Names and Terms** — 130 curated headwords and 8 sub-entries, resolved
  page by page against the typeset book; a headword that matches nothing is dropped rather than
  guessed, and `verify.py` fails the build if any headword stops matching the text (the failure
  mode is silent: the entry simply disappears from the index). Entries carry page references,
  not chapter numbers, and both indexes are set with hanging indents, the run-over lines
  aligned under the entry rather than the margin.
- **Contents** — front matter, part openers (linked), chapters, and appendices, in
  reading order.
- **Cross-references** — "chapter 22" in the running text becomes a link to that
  chapter (`#ch22` in the HTML edition, `ch22.xhtml` in the EPUB).
- **Chapter navigation** — every section ends with previous / contents / next links
  (suppressed in print and in the sample).
- **Reading chrome (web edition)** — a hairline progress bar, a sticky bar showing the
  current chapter, type-size control, back-to-top, arrow-key chapter navigation, a
  remembered scroll position, and a dark theme via `prefers-color-scheme`; all of it
  inline, none of it in print.
- **Reading times** in the contents (words ÷ 238, rounded).
- **Part epigraphs** — each part opener carries a scriptural or classical epigraph,
  set from the `epigraph:` field in the part file.
- **Half-title, title page, and copyright page** — written once as `COPYRIGHT_ROWS`
  in `build.py` and rendered into all three editions, so the imprint, the edition
  statement, the identifier, and the suggested citation cannot drift apart. Change the
  byline, imprint, or citation in one place: `META` at the top of `build.py`.
- **Book metadata** — `<meta>` keywords, a schema.org `Book` JSON-LD block in the web
  edition, EPUB 3 accessibility metadata and a landmarks nav, and PDF XMP plus
  catalogue language and `DisplayDocTitle`.

## Build

```
sh book/publish.sh
```

That is the whole pipeline: cover, web edition, EPUB, typeset PDF, a copy of the
hand-out set in `book/editions/`, and the acceptance checks. The individual steps:

```
python3 book/build.py
cp book/dist/the-hidden-and-the-manifest.html book/dist/index.html
cp book/dist/the-hidden-and-the-manifest.print.html book/dist/print.html
python3 book/make-pdf.py
python3 book/verify.py
```

Writes, in `book/dist/` (git-ignored):

- `the-hidden-and-the-manifest.epub` — EPUB 3, with nav, cover, subject metadata (~0.8 MB)
- `the-hidden-and-the-manifest.html` — single-file reading edition (`index.html` alias)
- `the-hidden-and-the-manifest.print.html` — print edition (5.5 × 8.5 in page CSS;
  open in a browser and print to PDF) (`print.html` alias)
- `the-hidden-and-the-manifest.pdf` — reading edition, 312 pages: cover, front matter, the
  book, contents with real page numbers, page-numbered indexes
- `the-hidden-and-the-manifest-interior.pdf` — the same book **without the cover page**, for a
  printer, 312 pages, page labels intact, 65 bookmarks, contents and index links intact
- `cover-wrap.pdf` — the full wrap a printer prints: back, spine, front, 1/8 in bleed
- `cover.jpg` — the front cover at 2:3, for the EPUB and the web edition
- `triage-card.pdf` — Appendix B as a standalone letter-size photocopy master
- `sample.html` — free sample: cover, preface, the argument on one page, chapter one
- `build-report.json` — word count, chapter count, parts, appendices, PDF pages, edition
- `book/editions/` — the same files copied out of the build directory as the published
  set (`dist/` is a scratch directory and is ignored by git)

The page estimate is not a constant: it divides the word count by the words-per-page ratio the last
typeset book actually produced (75,663 words / 312 pages), and rounds to an even page. Change the book
and the ratio moves with it, instead of drifting one page further out on every build.
The PDF's page count is exact, because it is the typeset book.

The text may state its own length: `{{words}}` and `{{pages}}` in the manuscript are filled
in by the build in every edition (the note on method uses both), so a claim about how long
the book is cannot drift out of date, and `verify.py` fails if the printed figure and the
build report ever disagree.

## PDF build

```
pip install --break-system-packages reportlab pyphen pymupdf pillow
python3 book/make-pdf.py
```

(`reportlab` typesets, `pyphen` hyphenates, `pymupdf` reads the laid-out pages back for the
running heads, the contents, and the two page-referenced indexes, and for the final
metadata pass. `fonttools` and `brotli` are needed only to cut new font subsets.)

Uses the same manuscript and the same `apparatus.json`; the cover is page 1, the
contents page carries real page numbers, and every part, chapter and appendix gets a
PDF bookmark. Appendix B is set at 7.9 pt so that the triage card really is one page.

The build runs twice. The first pass produces the book; the script then reads the laid-out
PDF and rebuilds appendices G and H with **page numbers instead of chapter numbers**, so the
print edition has a genuine index. Because the indexes sit at the end, the body pagination is
identical in both passes.

## Page geometry

| | |
|---|---|
| Trim | 5½ × 8½ in (a KDP, IngramSpark, and Lightning Source standard) |
| Inside margin | 0.78 in — clears the spine of a perfect binding at this extent |
| Outside margin | 0.55 in |
| Text block | 4.17 × 7.0 in, about 60 characters to the line at 11/15 |
| Head and folio | 0.5 in above the block, 0.45 in up from the trim |

The margins are **mirrored**, not symmetric: rectos carry the wide margin on the left and
versos on the right, so the gutter is always at the spine. Running heads and folios are
centred on the text block rather than the page, which is why they step sideways by 0.23 in
as you turn the leaf. The templates alternate by themselves (`autoNextPageTemplate`), and
only the first page of each section needs to know which side it opens on — that comes from
the previous layout, since the frames differ in position but not in width.

## Front matter and folios

The print edition is arranged the way a manufactured book is:

| Page | Content | Folio |
|---|---|---|
| 1 | Cover (full bleed) | — |
| 2 | Half-title | — |
| 3 | Title page (recto) | — |
| 4 | Copyright page (verso) | — |
| 5–9 | Contents | roman |
| 10–28 | Epigraphs, preface, the argument on one page, promises, method, how to read | roman |
| 29 | Part One (recto) | 1, unprinted |
| 30 | Chapter 1 | arabic from 2 |

Front matter takes **lower-case roman** folios, and the body restarts at arabic 1 on the
part page so that every printed number in the contents, the running heads, and the two
page-referenced indexes agrees with the folio under your thumb. Running heads are
suppressed in the front matter (folio only), on part pages, and on blank versos.

**Parts open on a recto.** When the preceding chapter ends on an odd page, a blank verso
is inserted. The build lays the book out, works out from the part pages which blanks are
needed (subtracting the effect of the blanks already there, so a blank can be removed as
well as added), rebuilds, and repeats until the set stops moving — three passes, about
sixteen seconds, with the ladder fix folded into the same loop. Chapters and appendices open on the next page, as in trade nonfiction,
which avoids half a book of blank pages. A final blank leaves the book with an even number
of pages, because the last leaf cannot be a recto on its own.

The contents page is the hard part: reportlab's `TableOfContents` always prints the page
numbers from the *previous* layout, so after a front matter change every number in the
book can be one pass stale. This build lays the book out, reads the real section pages
back, and repeats until the numbers stop moving, then emits the contents with `FixedTOC`
so the printed numbers are the ones it was typeset with.

## Reading on screen

The HTML edition is one file with the fonts inlined, so it reads the same offline. It has
a progress bar, saved position, a chapter drawer, and two colour schemes that are checked
rather than assumed: `verify.py` computes the WCAG ratio of ink, muted text, and accent
against the paper in **both** schemes (16.7:1, 5.7:1, 8.9:1 light; 14.5:1, 6.5:1, 6.7:1
dark) and fails if any drops below 4.5:1. Keyboard focus is visible, headings balance, and
paragraphs are set with `text-wrap: pretty` so the last line of a paragraph is not left
with one word where a line can be re-broken.

The sample ends with the way into the rest: browser, PDF, EPUB, and the one-page triage
card, all relative links that work from `editions/` or from any host.

## Composition

reportlab breaks lines greedily and hyphenates on request; it has no notion of a bad
page. Two things a compositor is paid to prevent are therefore found after the fact and
broken by re-setting the offending paragraph:

- **Ladders.** Three or more consecutive lines ending on a hyphen make the eye run down
  the hyphens instead of across the sentence. `ladder_pages()` reads the laid-out PDF,
  `ladder_fixes()` maps each ladder back to the paragraph that carries it (every
  paragraph is drawn by a `TrackedParagraph` that records its page and its height), and
  the next pass sets that paragraph with hyphenation off. Two extra passes clear all of
  them: **0 ladders, maximum run 2.**
- **Stranded heads.** Ninety-two lines in this book are a bold sentence standing alone —
  the forty disputed questions, the six marks, the transpositions. Set as ordinary
  paragraphs they ran on, and any of them could land at the foot of a page with nothing
  under it. They are now subheads with their own spacing, and each heading (bold or
  italic) asks `CondPageBreak` for four lines of air; if the page cannot give them, the
  heading starts the next page. **0 stranded heads.**
- **Widows.** A paragraph's last line carried alone to the top of the next page is the
  defect readers notice without knowing its name. `allowWidows`/`allowOrphans` are both
  off, so the composer pulls a second line over instead: **15 widows → 1**, at a cost of
  four pages.
- **Hyphens belong to justification.** Quotes, chapter ledes, part introductions, section
  heads and the apparatus are set ragged, and ragged text is not hyphenated: a hyphen at
  the end of a line that already ends where the words ended is a hyphen nobody needed.
  Only the justified text — body paragraphs, the card — hyphenates.
- **The price of that.** Thirty-eight paragraphs out of about a thousand are set unhyphenated,
  which loosens their justification slightly: lines stretched past twice the natural word
  space go from 21 to 26 across 6,500 prose lines. That is the trade a compositor makes —
  a ladder is visible, one loose line in one paragraph usually is not.

## The cover

`cover.jpg` is the front cover at 2:3 for the EPUB and the web edition, set in the same
Crimson Text as the interior, so a reader who sees the thumbnail and then opens the file
is not looking at two different books. `cover-wrap.pdf` is
the whole sheet a printer prints: back panel, spine, front panel, and 1/8 inch of bleed on
the three outer edges.

The spine is a measurement, not a design choice — a paperback's spine width is the thickness
of its paper times its page count. On KDP's white 50# stock that is 0.002252 in a leaf, so
the 312-page book has a **0.703 in spine** and the sheet is

    0.125 + 5.5 + 0.703 + 5.5 + 0.125 = 11.953 in  ×  8.75 in

`make-wrap.py` reads the page count out of `build-report.json`, so the spine cannot drift
out of date when a chapter is added; the wrap is rebuilt from the same count the interior
was typeset at. The art is the same plate carried across the sheet — sharp on the front,
blurred and drowned on the back and the spine so the type stays readable — and the type is
live Crimson Text, not a picture of type, with every word a quarter inch inside the trim
and a sixteenth off each side of the fold. The foot of the back panel is left clear for the
barcode the printer stamps on.

The checks measure all of that: sheet size against the page count, type inside the safe
area, nothing crossing a fold, the barcode field empty, and no base-14 font in the file.

## Navigation

The PDF is a book that also happens to be a file, so every printed pointer is a live one:

- **Contents** — all 60 entries carry a link to the page they name (reportlab's own
  `TOC` marks only the line, so `FixedTOC` draws the links as well).
- **Indexes** — 299 page numbers in Appendices G and H jump to the page they cite. They
  are linked *after* the pages are laid out (`link_index`), when every folio is known: the
  citation index links what stands inside its parentheses, the names index links what
  follows each entry's dash. Linking them inside the paragraph markup gave boxes offset
  by a line, so this pass works on the finished text instead.
- **Outline** — the front matter, the six parts with their chapters, and the appendices
  gathered under a single *Appendices* heading, 66 bookmarks in all.
- **Page labels** — the viewer's own counter reads `v`, then `1`, not sheet 5 and sheet 31,
  because the PDF carries `/PageLabels` for the roman front matter and the arabic body.

## Typography

The book is set in **Crimson Text** (Sebastian Kosch, SIL Open Font License 1.1), an
old-style text face designed for long-form reading, at 11 on 15 on a 5½ × 8½ inch page —
about sixty characters to the line.

- **PDF:** the four TTFs in `fonts/` are embedded and subset by reportlab. Every glyph in
  the file comes from the book face; there is no un-embedded font resource anywhere in it,
  which is the first thing a printer checks.
- **Web and EPUB:** four woff2 subsets of the same faces, inlined as base64 in the
  single-file HTML and declared as manifest items in the EPUB, so a reader on any device
  sees the type the book was designed in.
- **Colophon and copyright page** name the face, the designer, and the licence, as a
  printed book does.
- If `fonts/` is missing, the PDF falls back to base-14 Times and still builds — the
  colophon then says so, because it reads the same `COLOPHON` constant as the PDF.

## Checks

```
python3 book/verify.py
```

131 assertions across the four editions, the print interior, the wrap, and the font files: manuscript completeness and placeholder text,
markup balance and reader-script injection in each HTML file, the EPUB spine order
(cover → title → copyright → contents → text), its XML, metadata, and accessibility
statements, the PDF's page count, outline (starting with cover, half-title, title, copyright, contents), metadata, XMP, language tag, part-page
parity, **every printed folio against its physical page**, running heads, and the index's
cited page numbers. Exit status 1 on failure. Run it after any rebuild.

## Publishing note

The three files in `dist/` are the complete book and are self-contained: no external
fonts, scripts, or images, so they can be emailed, hosted on any static server, or
opened offline. The EPUB passes as a standard reflowable book and can be side-loaded to
Kindle, Apple Books, or Calibre; the print edition prints to a 5.5 × 8.5 PDF with
page breaks at every chapter and part.

Nothing here has an imprimatur. The text is submitted for correction, and the
front matter says so in three places.
