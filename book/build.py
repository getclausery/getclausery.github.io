#!/usr/bin/env python3
"""Build The Hidden and the Manifest: EPUB 3, a single-file HTML edition,
and a print-ready HTML edition (print to PDF from any browser).

No third-party dependencies. Run: python3 book/build.py
"""
import os, re, sys, html, json, zipfile, hashlib, unicodedata, base64
from datetime import date

ROOT = os.path.dirname(os.path.abspath(__file__))
MS = os.path.join(ROOT, 'manuscript')
DIST = os.path.join(ROOT, 'dist')
COVER_JPG = os.path.join(ROOT, 'cover.jpg')
COVER_PNG = os.path.join(ROOT, 'cover.png')
COVER = COVER_JPG if os.path.exists(COVER_JPG) else COVER_PNG
COVER_EXT = 'jpg' if COVER == COVER_JPG else 'png'
COVER_MIME = 'image/jpeg' if COVER == COVER_JPG else 'image/png'
APPARATUS = os.path.join(ROOT, 'apparatus.json')
FONT_DIR = os.path.join(ROOT, 'fonts')
FACES = [('normal', '400', 'CrimsonText-Regular.woff2'),
         ('italic', '400', 'CrimsonText-Italic.woff2'),
         ('normal', '700', 'CrimsonText-Bold.woff2'),
         ('italic', '700', 'CrimsonText-BoldItalic.woff2')]
FONTS_OK = all(os.path.exists(os.path.join(FONT_DIR, f)) for _s, _w, f in FACES)


def font_css(embed=False):
    """@font-face for Crimson Text, either inlined as data URIs or by relative path."""
    if not FONTS_OK:
        return ''
    out = []
    for style, weight, name in FACES:
        if embed:
            with open(os.path.join(FONT_DIR, name), 'rb') as fh:
                src = 'url(data:font/woff2;base64,' + base64.b64encode(fh.read()).decode() + ')'
        else:
            src = "url('fonts/" + name + "')"
        out.append("@font-face{font-family:'Crimson Text';font-style:%s;font-weight:%s;"
                   "font-display:swap;src:%s format('woff2')}" % (style, weight, src))
    return ''.join(out)

META = {
    'title': 'The Hidden and the Manifest',
    'subtitle': 'A Catholic Theology of Manifestation, and How the Church May Baptize an Age',
    'author': 'The Clausery Authors',
    'imprint': 'Clausery',
    'url': 'https://getclausery.github.io',
    'edition': 'First edition, MMXXVI',
    'year': 2026,
    'language': 'en-US',
    'identifier': 'urn:uuid:8f3c1a52-6b64-5d1e-9a77-2f4e0c9b7d31',
    'rights': 'Free to read, copy and distribute. Not an official publication of any ecclesiastical authority.',
    'keywords': ('manifestation, Law of Assumption, Neville Goddard, New Thought, Catholic theology, '
                 'Thomas Aquinas, imagination, presumption, discernment of spirits, spiritual narcissism, '
                 'New Age, the Secret, pastoral theology'),
    'description': ('The manifestation movement is not a set of false beliefs but a set of true observations attached to a false engine. '
                    'A Catholic theology of manifestation, modeled on Aquinas\u2019s integration of Aristotle \u2014 with an audit of fourteen claims, '
                    'a nine-day novena, and a one-page triage card for the priest in the car park.'),
}

# The copyright page is written once and rendered into every edition, so the
# web, EPUB, and print books cannot drift apart. Rows are (label, text); *text*
# marks italics and is understood by both B.inline() and the PDF's pdf_inline().
COPYRIGHT_ROWS = [
    ('Edition', 'First edition, MMXXVI'),
    ('Copyright', '\u00a9 2026 the Clausery authors. Free to read, copy, and distribute, in whole '
                  'or in part, provided this notice travels with it and any changes are marked as '
                  'changes.'),
    ('Imprint', 'Clausery \u00b7 getclausery.github.io'),
    ('Identifier', META['identifier']),
    ('Typeface', 'Crimson Text, by Sebastian Kosch, set at 11 on 15 and justified with '
                 'hyphenation. Used under the SIL Open Font License 1.1; embedded and subset '
                 'in the PDF, and carried as four web subsets in the HTML and EPUB editions.'),
    ('Typesetting', 'On a 5\u00bd \u00d7 8\u00bd inch page, from the same Markdown manuscript '
                    'that produces the HTML, EPUB, and PDF editions.'),
    ('Citations', 'Scripture is quoted in the author\u2019s working translation unless otherwise '
                  'noted; magisterial documents are cited by paragraph; Aquinas by part, question, '
                  'and article.'),
    ('Authority', 'Not an official publication of any ecclesiastical authority: no *imprimatur* has '
                  'been sought or granted, and the book is submitted for correction.'),
    ('Corrections', 'See Appendix F, *Note on the Text*.'),
    ('How to cite', 'Clausery Authors. *The Hidden and the Manifest: A Catholic Theology of '
                    'Manifestation, and How the Church May Baptize an Age*. First edition. '
                    'Clausery, 2026. getclausery.github.io.'),
]

# The colophon closes every edition with the same account of how the book was made.
COLOPHON = [
    'Set in Crimson Text, 11 on 15, justified with hyphenation, on a 5\u00bd \u00d7 8\u00bd inch '
    'page. Crimson Text is by Sebastian Kosch and is used under the SIL Open Font License 1.1; '
    'the two regular and two italic weights are embedded and subset in the PDF.',
    'Composed from a single Markdown manuscript by a Python typesetter: no page-layout '
    'program, no design file, no typesetting software to license. The same source produces '
    'the web, EPUB, and print editions, so a correction made once appears in all three.',
    'The text runs to {words:,} words in forty chapters, six parts, and eight appendices, '
    'with an index of citations and an index of names and terms generated from the '
    'typeset pages themselves rather than typed by hand.',
    'First edition, MMXXVI. Free to read, copy, and distribute.',
]

CSS = r"""
:root { --ink:#1b1917; --muted:#6b625a; --rule:#d8cfc4; --accent:#7a2e1e; }
* { box-sizing: border-box; }
html { font-size: 100%; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body {
  font-family: "Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif;
  color: var(--ink); line-height: 1.55; margin: 0; background: #fbf9f5;
  -webkit-font-smoothing: antialiased;
}
.wrap { max-width: 34rem; margin: 0 auto; padding: 2.5rem 1.25rem 6rem; }
h1, h2, h3, h4 { font-weight: 600; line-height: 1.2; text-wrap: balance; }
h1 { font-size: 1.9rem; margin: 0 0 .4rem; letter-spacing: -.01em; }
h2 { font-size: 1.35rem; margin: 2.4rem 0 .6rem; }
h3 { font-size: 1.08rem; margin: 2rem 0 .4rem; font-style: italic; font-weight: 600; }
p { margin: 0 0 1rem; text-align: justify; hyphens: auto; text-wrap: pretty; }
p.first, h2 + p, h3 + p, blockquote + p, ul + p, ol + p, table + p, .scene + p { text-indent: 0; }
a { color: var(--accent); text-decoration-thickness: 1px; text-underline-offset: 2px; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }
a:focus-visible, .topbar a:focus-visible, .chapnav a:focus-visible { outline-offset: 4px; }
::selection { background: #f0d9c9; color: #1b1917; }
em { font-style: italic; }
blockquote { margin: 1.5rem 0 1.5rem 0; padding-left: 1.1rem; border-left: 2px solid var(--rule); color: #3a332d; font-style: italic; }
blockquote p { text-align: left; }
ul, ol { margin: 0 0 1.1rem 1.15rem; padding: 0; }
li { margin: .3rem 0; }
hr { border: 0; border-top: 1px solid var(--rule); margin: 2.2rem 0; }
hr.sec { width: 4rem; margin: 2.2rem auto; border-top: 2px solid var(--rule); }
table { width: 100%; border-collapse: collapse; margin: 1.4rem 0; font-size: .9rem; }
th, td { text-align: left; vertical-align: top; padding: .45rem .5rem; border-bottom: 1px solid var(--rule); }
th { font-variant: small-caps; letter-spacing: .03em; font-weight: 600; }
code, pre { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: .85rem; }
pre { background: #f1ece4; padding: .9rem; overflow-x: auto; }
/* Title page */
.coverpage { margin: 0; padding: 0; text-align: center; }
.coverpage img { max-width: 100%; height: auto; }
.titlepage { text-align: center; padding: 4rem 0 3rem; }
.titlepage .title { font-size: 2.5rem; line-height: 1.05; letter-spacing: -.02em; margin: 0; }
.titlepage .subtitle { font-size: 1.02rem; color: var(--muted); margin: 1.1rem auto 0; max-width: 26rem; font-style: italic; }
.titlepage .rule { width: 3rem; border-top: 2px solid var(--accent); margin: 2rem auto; }
.titlepage .byline { font-variant: small-caps; letter-spacing: .12em; color: var(--muted); font-size: .8rem; }
.epigraphs { margin: 3rem 0; }
.epigraph { margin: 2rem 0; font-style: italic; color: #3a332d; }
.epigraph .src { display: block; font-style: normal; font-variant: small-caps; letter-spacing: .08em; font-size: .78rem; color: var(--muted); margin-top: .4rem; }
/* Parts */
.part { page-break-before: always; break-before: page; padding-top: 5rem; text-align: center; }
.part .label { font-variant: small-caps; letter-spacing: .2em; color: var(--accent); font-size: .8rem; }
.part h1 { font-size: 2.1rem; margin: 1rem 0 1.4rem; }
.part-epigraph { text-align: center; border: 0; padding: 0; margin: 0 auto 2.2rem; max-width: 26rem; font-style: italic; color: #4a423b; font-size: 1.02rem; }
.part-epigraph p { text-align: center; }
.part-epigraph cite { display: block; margin-top: .5rem; font-style: normal; font-variant: small-caps; letter-spacing: .12em; font-size: .72rem; color: var(--accent); }
.part .intro { color: #4a423b; font-style: italic; text-align: left; max-width: 28rem; margin: 0 auto; }
.chapter { page-break-before: always; break-before: page; }
.chapter .num { font-variant: small-caps; letter-spacing: .2em; color: var(--muted); font-size: .78rem; }
.chapter h1 { margin-top: .3rem; }
.chapter .lede { font-size: 1.02rem; color: #3a332d; font-style: italic; margin: 1.2rem 0 2rem; text-align: left; }
.dropcap::first-letter { float: left; font-size: 3.6rem; line-height: .84; padding: .1rem .5rem 0 0; color: var(--accent); }
.thesis { margin: 1.9rem 0; padding: 1.15rem 1.35rem; border-left: 3px solid var(--accent); background: #f4efe6; page-break-inside: avoid; }
.thesis p { text-align: left; font-size: 1.12rem; line-height: 1.42; font-weight: 600; margin: 0; }
a.xref { color: inherit; text-decoration: underline; text-decoration-color: #cfc5b8; text-decoration-thickness: 1px; text-underline-offset: 2px; }
.chapnav { display: flex; justify-content: space-between; gap: 1rem; margin: 3rem 0 0; padding-top: 1rem; border-top: 1px solid var(--rule); font-size: .78rem; font-variant: small-caps; letter-spacing: .1em; }
.chapnav a { color: var(--muted); text-decoration: none; }
.chapnav a:hover { color: var(--accent); }
/* Reading chrome */
section, nav.toc-page { scroll-margin-top: 3.2rem; }
#progress { position: fixed; top: 0; left: 0; height: 2px; width: 0; background: var(--accent); z-index: 30; transition: width .1s linear; }
.topbar { position: fixed; top: 0; left: 0; right: 0; z-index: 29; display: flex; align-items: center; gap: .8rem;
  padding: .42rem .9rem; font-size: .7rem; font-variant: small-caps; letter-spacing: .09em; color: var(--muted);
  background: rgba(251,249,245,.94); border-bottom: 1px solid var(--rule);
  transform: translateY(-110%); transition: transform .18s ease; }
.topbar.show { transform: none; }
.topbar .cur { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink); }
.topbar a { color: var(--muted); text-decoration: none; white-space: nowrap; }
.topbar button { font: inherit; background: none; border: 1px solid var(--rule); color: var(--muted);
  padding: .05rem .4rem; border-radius: 3px; cursor: pointer; letter-spacing: .04em; }
.topbar button:hover, .topbar a:hover { color: var(--accent); border-color: var(--accent); }
.scene { text-align: center; margin: 1.6rem 0; color: var(--muted); letter-spacing: .6em; }
.note { font-size: .9rem; color: var(--muted); border-top: 1px solid var(--rule); padding-top: .8rem; margin-top: 2.5rem; }

/* Chapter apparatus */
.apparatus { margin: 2.4rem 0 0; padding: 1.1rem 0 0; border-top: 2px solid var(--rule); page-break-inside: avoid; }
.ap-block { margin: 0 0 .9rem; }
.ap-label { font-variant: small-caps; letter-spacing: .14em; font-size: .7rem; color: var(--accent); margin-bottom: .1rem; }
.ap-block p { text-align: left; margin: 0; }
.ap-point p { font-weight: 600; }
.ap-next p { color: var(--muted); font-style: italic; }
.tp-cover { display: block; width: 74%; max-width: 22rem; margin: 0 auto 3rem; box-shadow: 0 14px 40px rgba(0,0,0,.28); }
.tp-kicker { font-variant: small-caps; letter-spacing: .2em; font-size: .72rem; color: var(--accent); margin-bottom: 1.8rem; }
.tp-edition { font-variant: small-caps; letter-spacing: .1em; font-size: .72rem; color: var(--muted); margin-top: 2.4rem; }
/* the half-title is a print convention; on screen the cover does that work */
body:not(.print) .halftitle { display: none; }
.halftitle { text-align: center; padding: 3.2rem 0 2rem; }
.halftitle .ht-title { font-variant: small-caps; letter-spacing: .18em; font-size: .95rem; color: var(--muted); }
.halftitle .ht-rule { width: 2rem; border-top: 1px solid var(--rule); margin: 1.4rem auto 0; }
.copyrightpage { font-size: .82rem; line-height: 1.55; color: var(--muted); text-align: left;
  border-top: 1px solid var(--rule); margin: 2.6rem 0 0; padding: 1.6rem 0 0; }
.copyrightpage dl { margin: 0; }
.copyrightpage dt { font-variant: small-caps; letter-spacing: .1em; font-size: .68rem;
  color: var(--accent); margin-top: .9rem; }
.copyrightpage dd { margin: .1rem 0 0; }
.copyrightpage em { font-style: italic; }
.colophon { border-top: 1px solid var(--rule); margin: 3.2rem 0 0; padding: 1.5rem 0 0;
  font-size: .82rem; line-height: 1.55; color: var(--muted); }
.colophon h1 { font-size: .8rem; font-variant: small-caps; letter-spacing: .14em;
  color: var(--accent); margin: 0 0 .8rem; }
.colophon p { text-align: left; text-indent: 0; margin: 0 0 .6rem; }
.colophon .formats { margin-top: 1rem; padding-top: .8rem; border-top: 1px solid var(--rule); }
.colophon a { color: var(--accent); }
.pull { margin: 1.6rem 0; padding: .2rem 0 .2rem 0; font-size: 1.12rem; line-height: 1.4; font-style: italic; color: #3a332d; text-align: left; }
/* Toc */
ol.toc { list-style: none; margin: 0; padding: 0; }
ol.toc li { margin: .35rem 0; }
ol.toc .partline { font-variant: small-caps; letter-spacing: .1em; margin-top: 1.7rem; font-size: .86rem; }
ol.toc .partline a { color: var(--accent); }
ol.toc .frontline a, ol.toc .appline a { color: var(--ink); }
ol.toc .frontline { font-style: italic; }
ol.toc .chap { padding-left: .9rem; }
ol.toc .rt { color: var(--muted); font-size: .7rem; font-variant: normal; letter-spacing: 0; opacity: .8; margin-left: .35rem; }
ol.toc .appline { font-size: .94rem; margin-top: .5rem; }
ol.toc a { text-decoration: none; }
/* Print edition */
@page { size: 5.5in 8.5in; margin: 0.75in 0.7in; }
/* Print edition: applied on screen too, so the file looks like the book it prints */
body.print { background: #fff; font-size: 10.5pt; line-height: 1.42; }
body.print .wrap { max-width: 5.5in; padding: .75in .7in 1.2in; }
body.print .chapter, body.print .part { page-break-before: always; break-before: page; }
body.print a { color: inherit; text-decoration: none; }
body.print .halftitle { padding-top: 2.6in; page-break-after: always; }
body.print .copyrightpage { page-break-before: always; page-break-after: always; margin-top: 2in; font-size: .78rem; }
body.print .titlepage { padding-top: 1.6in; }
body.print .tp-cover { width: 58%; box-shadow: none; page-break-after: always; }
body.print table { font-size: .82rem; }
body.print #progress, body.print .topbar { display: none; }
@media (prefers-color-scheme: dark) {
  :root { --ink: #e9e2d6; --muted: #a2978a; --rule: #3a342c; --accent: #d08a6a; }
  body { background: #141210; }
  .topbar { background: rgba(20,18,16,.94); }
  blockquote, .chapter .lede, .part .intro, .epigraph, .part-epigraph { color: #d6ccbd; }
  .thesis { background: #1e1a16; }
  .thesis p { color: #f2ebdf; }
  .ap-point p { color: #f2ebdf; }
  .dropcap::first-letter { color: var(--accent); }
  .tp-cover { box-shadow: 0 14px 40px rgba(0,0,0,.6); }
  .titlepage .title, .part h1 { color: #f2ebdf; }
  pre { background: #1e1a16; }
  ::selection { background: #4a342a; color: #f6efe4; }
  blockquote { color: #cdc3b4; }
}
@media (max-width: 560px) {
  .wrap { padding: 1.6rem 1rem 4rem; }
  h1 { font-size: 1.6rem; }
  table { font-size: .78rem; }
  th, td { padding: .35rem .3rem; }
  .tp-cover { width: 82%; }
  .chapnav { font-size: .72rem; }
}
@media print {
  body { background: #fff; font-size: 10.5pt; line-height: 1.42; }
  .wrap { max-width: none; padding: 0; }
  .chapter, .part { page-break-before: always; }
  h1 { font-size: 20pt; }
  h2 { page-break-after: avoid; }
  table, pre, blockquote { page-break-inside: avoid; }
  p { widows: 2; orphans: 2; }
  .tp-cover { width: 58%; box-shadow: none; page-break-after: always; }
  a { color: inherit; text-decoration: none; }
  a.xref { text-decoration: none; }
  .chapnav { display: none; }
  body.print .chapnav { display: none; }
  #progress, .topbar { display: none; }
  .titlepage { padding-top: 3in; }
  .halftitle { padding-top: 3in; }
  .copyrightpage { page-break-before: always; page-break-after: always; margin-top: 2in; }
}
"""


EPUB_CSS = """
@charset "utf-8";
body { font-family: "Crimson Text", serif; line-height: 1.5; color: #111; margin: 0 5%; }
h1 { font-size: 1.65em; line-height: 1.2; margin: 0 0 .35em; font-weight: bold; page-break-after: avoid; }
h2 { font-size: 1.3em; margin: 1.8em 0 .4em; page-break-after: avoid; }
h3 { font-size: 1.08em; font-style: italic; margin: 1.5em 0 .3em; page-break-after: avoid; }
p { margin: 0; text-indent: 1.2em; text-align: justify; -webkit-hyphens: auto; hyphens: auto; }
p.first, h1 + p, h2 + p, h3 + p, blockquote + p, ul + p, ol + p, table + p, .scene + p,
.lede + p, .ap-block p, .thesis p, .part-epigraph p { text-indent: 0; }
em, i { font-style: italic; }
.num, .label { font-size: .76em; letter-spacing: .14em; text-transform: uppercase; color: #7a2e1e; }
.lede { font-style: italic; color: #333; margin: .7em 0 1.6em; text-align: left; }
.chapter, .part { page-break-before: always; }
blockquote { margin: 1.2em 0 1.2em 1em; padding-left: .8em; border-left: 2px solid #d8cfc4;
             font-style: italic; page-break-inside: avoid; }
blockquote p { text-indent: 0; text-align: left; }
blockquote cite { display: block; font-style: normal; font-size: .8em; color: #6b625a; margin-top: .3em; }
.scene { text-align: center; margin: 1.3em 0; color: #6b625a; letter-spacing: .4em; }
ul, ol { margin: .6em 0 1em 1.1em; padding: 0; }
li { margin: .25em 0; text-align: left; }
table { width: 100%; border-collapse: collapse; font-size: .85em; margin: 1em 0; }
th, td { text-align: left; vertical-align: top; padding: .3em .4em; border-bottom: 1px solid #d8cfc4; }
th { font-variant: small-caps; font-weight: bold; }
.apparatus { margin: 1.8em 0 0; padding-top: .9em; border-top: 2px solid #d8cfc4; page-break-inside: avoid; }
.ap-label { font-size: .72em; letter-spacing: .12em; text-transform: uppercase; color: #7a2e1e; }
.ap-block { margin-bottom: .8em; }
.ap-block p { margin: .1em 0 .7em; text-align: left; }
.ap-point p { font-weight: bold; }
.ap-next p { font-style: italic; color: #555; }
.thesis { border-left: 3px solid #7a2e1e; padding: .1em 0 .1em .9em; margin: 1.5em 0; page-break-inside: avoid; }
.thesis p { text-align: left; font-weight: bold; }
.part-epigraph { border: 0; padding: 0; margin: 0 auto 2em; max-width: 24em; text-align: center; font-style: italic; color: #444; }
.part-epigraph cite { color: #7a2e1e; }
.part .intro { font-style: italic; color: #444; }
.chapnav, .topbar { display: none; }
.sample-end { margin: 3rem 0 0; padding-top: 1.4rem; border-top: 2px solid var(--rule); }
.sample-end h2 { margin: .3rem 0 .8rem; font-size: 1.3rem; }
.sample-links { margin: 1.1rem 0 1.4rem; text-align: left; text-indent: 0; }
.sample-links a { text-decoration-thickness: 1px; }
.coverpage { margin: 0; padding: 0; text-align: center; }
.coverpage img { max-width: 100%; height: auto; }
.titlepage { text-align: center; margin-top: 18%; }
.titlepage .title { font-size: 2em; line-height: 1.1; }
.titlepage .subtitle { font-style: italic; color: #444; margin-top: 1em; }
.titlepage .byline, .titlepage .tp-edition { font-size: .85em; letter-spacing: .1em; text-transform: uppercase; color: #666; margin-top: 2em; }
.titlepage .edition { font-size: .85em; letter-spacing: .1em; text-transform: uppercase; color: #666; margin-top: .6em; }
.copyrightpage { margin-top: 18%; font-size: .82em; line-height: 1.5; color: #444; }
.copyrightpage h1 { font-size: 1em; letter-spacing: .12em; text-transform: uppercase; color: #666; }
.copyrightpage dl { margin: 0; }
.copyrightpage dt { font-weight: bold; font-size: .9em; margin-top: .9em; color: #555; }
.copyrightpage dd { margin: .1em 0 0; }
.colophon { margin-top: 15%; border-top: 1px solid #bbb; padding-top: .8em; font-size: .85em; color: #444; }
.colophon h1 { font-size: 1em; letter-spacing: .12em; text-transform: uppercase; color: #666; }
.colophon p { text-align: left; text-indent: 0; margin: 0 0 .6em; }
.titlepage .tp-cover { display: none; }
.toc { list-style: none; padding-left: 0; }
.toc li { margin: .35em 0; text-align: left; }
.toc a { color: inherit; text-decoration: none; }
.toc .partline { margin-top: 1.1em; font-variant: small-caps; letter-spacing: .08em; color: #7a2e1e; }
.toc .chap { padding-left: .9em; }
.toc ol.chaps { list-style: none; margin: .25em 0 .7em; padding-left: 1.1em; }
.toc ol.chaps li { margin: .2em 0; font-size: .95em; }
p { widows: 2; orphans: 2; hyphenate-limit-chars: 6 3 3; -webkit-hyphenate-limit-chars: 6 3 3; }
h1, h2, h3 { break-after: avoid; }
.chapter, .part { break-before: page; }
.toc .frontline { font-style: italic; }
.note { font-size: .85em; color: #666; border-top: 1px solid #d8cfc4; padding-top: .8em; margin-top: 2.5em; }
"""

SMART = [('---', '\u2014'), ('--', '\u2013'), ('...', '\u2026')]

try:
    APPARATUS_DATA = json.load(open(APPARATUS, encoding='utf-8'))
except Exception:
    APPARATUS_DATA = {}


def esc(t):
    return html.escape(t, quote=True)


def inline(t):
    # escape first (but keep quotes, which we typograph), then smart punctuation,
    # then inline markdown. Attributes added afterwards use literal double quotes.
    t = t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    for a, b in SMART:
        t = t.replace(a, b)
    t = re.sub(r'"([^"]+)"', lambda m: '\u201c' + m.group(1) + '\u201d', t)
    t = t.replace("'", '\u2019')
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<!\*)\*([^*\n]+)\*(?!\*)', r'<em>\1</em>', t)
    t = re.sub(r'\[([^\]]+)\]\(([^) ]+)\)', r'<a href="\2">\1</a>', t)
    return t


def blocks(md):
    lines = md.split('\n')
    out, i = [], 0
    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if not s:
            i += 1; continue
        if s.startswith('```'):
            i += 1; buf = []
            while i < len(lines) and not lines[i].strip().startswith('```'):
                buf.append(esc(lines[i])); i += 1
            i += 1
            out.append('<pre><code>' + '\n'.join(buf) + '</code></pre>'); continue
        if s.startswith('<'):
            buf = []
            while i < len(lines) and lines[i].strip():
                buf.append(lines[i]); i += 1
            out.append('\n'.join(buf)); continue
        m = re.match(r'^(#{1,6})\s+(.*)$', s)
        if m:
            n = len(m.group(1)); out.append(f'<h{n}>{inline(m.group(2))}</h{n}>'); i += 1; continue
        if re.match(r'^(-{3,}|\*{3,}|_{3,})$', s):
            out.append('<hr class="sec" />'); i += 1; continue
        if s.startswith('>'):
            buf = []
            while i < len(lines) and lines[i].strip().startswith('>'):
                buf.append(re.sub(r'^\s*>\s?', '', lines[i])); i += 1
            out.append('<blockquote>' + blocks('\n'.join(buf)) + '</blockquote>'); continue
        if re.match(r'^([-*+])\s+', s):
            items = []
            while i < len(lines) and re.match(r'^\s*([-*+])\s+', lines[i]):
                items.append(re.sub(r'^\s*([-*+])\s+', '', lines[i])); i += 1
            out.append('<ul>' + ''.join(f'<li>{inline(x)}</li>' for x in items) + '</ul>'); continue
        if re.match(r'^\d+[.)]\s+', s):
            items = []
            while i < len(lines) and re.match(r'^\s*\d+[.)]\s+', lines[i]):
                items.append(re.sub(r'^\s*\d+[.)]\s+', '', lines[i])); i += 1
            out.append('<ol>' + ''.join(f'<li>{inline(x)}</li>' for x in items) + '</ol>'); continue
        if s.startswith('|') and i + 1 < len(lines) and re.match(r'^\|[\s:|-]+\|$', lines[i + 1].strip()):
            def cells(row):
                return [c.strip() for c in row.strip().strip('|').split('|')]
            head = cells(s); i += 2; rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                rows.append(cells(lines[i])); i += 1
            th = ''.join(f'<th>{inline(c)}</th>' for c in head)
            body = ''.join('<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in r) + '</tr>' for r in rows)
            out.append(f'<table><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table>'); continue
        if s == '::scene':
            out.append('<div class="scene">\u00b7 \u00b7 \u00b7</div>'); i += 1; continue
        buf = []
        while i < len(lines) and lines[i].strip() and not re.match(r'^(#{1,6}\s|>|\||```|::scene|\s*([-*+]|\d+[.)])\s+)', lines[i].strip()) and not re.match(r'^(-{3,}|\*{3,})$', lines[i].strip()):
            buf.append(lines[i].strip()); i += 1
        out.append('<p>' + inline(' '.join(buf)) + '</p>')
    return '\n'.join(out)


def parse(path):
    raw = open(path, encoding='utf-8').read()
    meta, body = {}, raw
    if raw.startswith('---\n'):
        end = raw.find('\n---\n', 3)
        if end != -1:
            for ln in raw[4:end].split('\n'):
                if ':' in ln:
                    k, v = ln.split(':', 1)
                    meta[k.strip()] = v.strip()
            body = raw[end + 5:]
    return meta, body


def files():
    return sorted(f for f in os.listdir(MS) if f.endswith('.md'))


def collect():
    docs = []
    for f in files():
        meta, body = parse(os.path.join(MS, f))
        docs.append({'file': f, 'meta': meta, 'body': body,
                     'kind': meta.get('kind', 'chapter'),
                     'title': meta.get('title', f),
                     'part': meta.get('part', ''),
                     'lede': meta.get('lede', ''),
                     'slug': re.sub(r'\.md$', '', f)})
    def key(d):
        k, slug = d['kind'], d['slug']
        if k == 'front':
            return (0, slug)
        if k == 'part':
            first = d['meta'].get('starts', '')
            num = int(re.sub(r'\D', '', first) or 0)
            return (1, num, -1)
        if k == 'chapter':
            num = int(re.sub(r'\D', '', slug) or 0)
            return (1, num, 0)
        return (2, slug)
    docs.sort(key=key)
    return docs


def apparatus_html(d):
    """The point / Do this / What this sets up, for one chapter."""
    ap = APPARATUS_DATA.get(d['slug'])
    if not ap:
        return ''
    return ('<aside class="apparatus">'
            f'<div class="ap-block ap-point"><div class="ap-label">The point</div><p>{inline(ap["point"])}</p></div>'
            f'<div class="ap-block ap-do"><div class="ap-label">Do this</div><p>{inline(ap["do"])}</p></div>'
            f'<div class="ap-block ap-next"><div class="ap-label">What this sets up</div><p>{inline(ap["next"])}</p></div>'
            '</aside>')


def linkify(html_text, epub=False):
    """Turn 'chapter 22' into an internal link, outside tags and existing anchors."""
    parts = re.split(r'(<[^>]+>)', html_text)
    out, depth = [], 0
    for part in parts:
        if part.startswith('<'):
            if re.match(r'<a[\s>]', part):
                depth += 1
            elif part.startswith('</a'):
                depth = max(0, depth - 1)
            out.append(part)
            continue
        if depth == 0:
            def rep(m):
                n = int(m.group(2))
                if not 1 <= n <= 40:
                    return m.group(0)
                if epub:
                    return f'<a class="xref" href="ch{n:02d}.xhtml">{m.group(0)}</a>'
                return f'<a class="xref" href="#ch{n:02d}">{m.group(0)}</a>'
            part = re.sub(r'\b(Chapter|chapter)\s+(\d{1,2})\b(?!\s*[\u2013-]\s*\d)', rep, part)
        out.append(part)
    return ''.join(out)


def render(docs, mode='web'):
    """Return (html_body, toc_html, spine) for the collected docs."""
    spine, toc, out = [], [], []
    part_seen = None
    chnum = 0
    order = [d['slug'] for d in docs]
    def chapnav(hid, show=True):
        if not show:
            return ''
        i = order.index(hid)
        prev_slug = order[i - 1] if i > 0 else None
        next_slug = order[i + 1] if i + 1 < len(order) else None
        bits = []
        bits.append(f'<a href="#{prev_slug}">&larr; Previous</a>' if prev_slug else '<span></span>')
        bits.append('<a href="#contents">Contents</a>')
        bits.append(f'<a href="#{next_slug}">Next &rarr;</a>' if next_slug else '<span></span>')
        return '<nav class="chapnav">' + ''.join(bits) + '</nav>'
    for d in docs:
        k, title = d['kind'], d['title']
        hid = d['slug']
        if k == 'part':
            epi = d['meta'].get('epigraph', '')
            epi_html = ''
            if epi:
                text, _, src = epi.partition('|')
                epi_html = (f'<blockquote class="part-epigraph"><p>{inline(text.strip())}</p>'
                            f'<cite>{inline(src.strip())}</cite></blockquote>')
            out.append(f'<section class="part" id="{hid}"><div class="label">{esc(d["meta"].get("label","Part"))}</div>'
                       f'<h1>{inline(title)}</h1>' + epi_html
                       + (f'<div class="intro">{blocks(d["body"])}</div>' if d['body'].strip() else '') + '</section>')
            toc.append(f'<li class="partline"><a href="#{hid}">{esc(d["meta"].get("label","Part"))} &middot; {inline(title)}</a></li>')
            spine.append((hid, title, 'part'))
            part_seen = title
            continue
        if k == 'front':
            out.append(f'<section class="chapter front" id="{hid}"><h1>{inline(title)}</h1>{blocks(d["body"])}{chapnav(hid)}</section>')
            if hid != '00-epigraphs':
                toc.append(f'<li class="frontline"><a href="#{hid}">{inline(title)}</a></li>')
            spine.append((hid, title, 'front'))
            continue
        if k == 'appendix':
            out.append(f'<section class="chapter appendix" id="{hid}"><div class="num">Appendix</div><h1>{inline(title)}</h1>'
                       + (f'<div class="lede">{inline(d["lede"])}</div>' if d['lede'] else '') + blocks(d['body']) + chapnav(hid) + '</section>')
            m = re.match(r'apx([A-Z])', hid)
            lab = f'Appendix {m.group(1)} &middot; ' if m else 'Appendix &middot; '
            toc.append(f'<li class="appline"><a href="#{hid}">{lab}{inline(title)}</a></li>')
            spine.append((hid, title, 'appendix'))
            continue
        chnum += 1
        d['chnum'] = chnum
        cls = 'chapter'
        head = (f'<div class="num">Chapter {chnum}</div><h1>{inline(title)}</h1>'
                + (f'<div class="lede">{inline(d["lede"])}</div>' if d['lede'] else ''))
        body = blocks(d['body'])
        body = linkify(body)
        # drop cap on the first paragraph of a chapter
        body = body.replace('<p>', '<p class="dropcap">', 1)
        body += apparatus_html(d)
        out.append(f'<section class="{cls}" id="{hid}" data-ch="{chnum}">{head}{body}{chapnav(hid)}</section>')
        mins = max(3, round(len(d['body'].split()) / 238))
        toc.append(f'<li class="chap"><a href="#{hid}">{chnum}. {inline(title)}</a>'
                   f'<span class="rt">\u00b7 {mins} min</span></li>')
        spine.append((hid, f'{chnum}. {title}', 'chapter'))
    return '\n'.join(out), '<ol class="toc">' + ''.join(toc) + '</ol>', spine



CANON = [("Gen", "Genesis"), ("Ex", "Exodus"), ("Job", "Job"), ("Ps", "Psalms"), ("Prov", "Proverbs"),
         ("Isa", "Isaiah"), ("Jer", "Jeremiah"), ("Mal", "Malachi"), ("Matt", "Matthew"), ("Mark", "Mark"),
         ("Luke", "Luke"), ("John", "John"), ("Acts", "Acts"), ("Rom", "Romans"), ("1 Cor", "1 Corinthians"),
         ("2 Cor", "2 Corinthians"), ("Gal", "Galatians"), ("Eph", "Ephesians"), ("Phil", "Philippians"),
         ("Col", "Colossians"), ("1 Tim", "1 Timothy"), ("2 Tim", "2 Timothy"), ("Heb", "Hebrews"),
         ("James", "James"), ("1 Pet", "1 Peter"), ("1 John", "1 John"), ("Rev", "Revelation")]

ALIASES = {}
for ab, full in CANON:
    ALIASES[ab] = ab
    ALIASES[full] = ab
ALIASES.update({'Mt': 'Matt', 'Mk': 'Mark', 'Lk': 'Luke', 'Jn': 'John', 'Rm': 'Rom'})


def _canon_rank(ab):
    for i, (a, _f) in enumerate(CANON):
        if a == ab:
            return i
    return 99


def _refkey(ref):
    core = ref.replace('\u2013', '-').split('-')[0]
    parts = core.split(':')
    return (int(parts[0]), int(parts[1]) if len(parts) > 1 else 0)


def build_index_doc(docs):
    """Scan the manuscript for scripture and catechism citations and return a synthetic doc."""
    names = sorted(ALIASES.keys(), key=len, reverse=True)
    pat = re.compile(r'(?<![A-Za-z0-9])(' + '|'.join(re.escape(n) for n in names) + r')\.?\s+(\d{1,3})(?::(\d{1,3})(?:[\u2013-](\d{1,3}))?)?')
    ccc = re.compile(r'CCC\s*(\d{2,4})')
    found = []   # (book_abbr, ref, chnum)
    cats = []    # (num, chnum)
    chnum = 0
    for d in docs:
        if d['kind'] == 'chapter':
            chnum += 1
        else:
            continue
        text = re.sub(r'\s+', ' ', d['body'])
        for m in pat.finditer(text):
            ab = ALIASES[m.group(1)]
            ref = m.group(2)
            if m.group(3):
                ref += ':' + m.group(3)
                if m.group(4):
                    ref += '\u2013' + m.group(4)
            found.append((ab, ref, chnum))
        for m in ccc.finditer(text):
            cats.append((m.group(1), chnum))
    if not found and not cats:
        return None
    by_book = {}
    for ab, ref, ch in found:
        by_book.setdefault(ab, {}).setdefault(ref, set()).add(ch)
    lines = ['The references are given as they appear in the text; the numbers in parentheses are chapters of this book.', '']
    for ab, full in CANON:
        refs = by_book.get(ab)
        if not refs:
            continue
        items = sorted(refs.items(), key=lambda kv: _refkey(kv[0]))
        body = '; '.join(f'{r} ({", ".join(str(c) for c in sorted(chs))})' for r, chs in items)
        lines.append(f'**{full}** \u2014 {body}')
        lines.append('')
    if cats:
        by_num = {}
        for n, ch in cats:
            by_num.setdefault(n, set()).add(ch)
        items = sorted(by_num.items(), key=lambda kv: int(kv[0]))
        body = '; '.join(f'{n} ({", ".join(str(c) for c in sorted(chs))})' for n, chs in items)
        lines.append('::scene')
        lines.append('')
        lines.append('## Catechism of the Catholic Church')
        lines.append('')
        lines.append(body)
        lines.append('')
    return {
        'file': 'apxG.md', 'slug': 'apxG', 'kind': 'appendix',
        'title': 'Index of Citations',
        'lede': 'Every scriptural and catechetical reference in the book, by book and paragraph.',
        'part': '', 'meta': {'title': 'Index of Citations'},
        'body': '\n'.join(lines),
    }



TERMS = [
    ("Aquinas, Thomas", ["Aquinas", "Thomas Aquinas", "the Angelic Doctor", "St. Thomas", "Saint Thomas"]),
    ("analogy", ["analogy", "analogical"]),
    ("Aristotle", ["Aristotle", "the Philosopher", "Aristotelian"]),
    ("Augustine", ["Augustine", "Augustinian"]),
    ("Byrne, Rhonda", ["Rhonda Byrne", "Byrne"]),
    ("Christian Science", ["Christian Science"]),
    ("common good", ["common good"]),
    ("concupiscence", ["concupiscence"]),
    ("desire", ["desire", "desires"]),
    ("discernment of spirits", ["discernment of spirits", "discernment"]),
    ("divination", ["divination", "divining"]),
    ("divine providence", ["providence"]),
    ("Goddard, Neville", ["Neville Goddard", "Goddard", "Neville"]),
    ("habitus", ["habitus", "habits"]),
    ("Hicks, Esther", ["Esther Hicks", "Hicks", "Abraham-Hicks"]),
    ("Hill, Napoleon", ["Napoleon Hill"]),
    ("Ignatius of Loyola", ["Ignatius", "Ignatian"]),
    ("imago Dei", ["image of God", "imago Dei"]),
    ("quantum physics", ["quantum"]),
    ("specific person (SP)", ["specific person", "SP journeys"]),
    ("Law of Assumption", ["Law of Assumption", "law of assumption"]),
    ("manifestation", ["manifestation", "manifesting", "manifest"]),
    ("monism", ["monism", "monist"]),
    ("New Thought", ["New Thought"]),
    ("novena", ["novena", "Novena"]),
    ("Pelagianism", ["Pelagian", "Pelagianism"]),
    ("presumption", ["presumption", "presumptuous"]),
    ("Quimby, Phineas", ["Quimby"]),
    ("sacrament", ["sacrament", "sacramental"]),
    ("saints", ["the saints", "communion of saints"]),
    ("secondary causes", ["secondary cause", "secondary causes", "second causes"]),
    ("spiritual narcissism", ["spiritual narcissism", "narcissism"]),
    ("superstition", ["superstition", "superstitious"]),
    ("tempting God", ["tempting God", "tempt God", "tentare Deum"]),
    ("theodicy", ["theodicy"]),
    ("univocity", ["univocity", "univocal"]),
    ("The Secret", ["The Secret"]),
    ("artificial intelligence", ["artificial intelligence", "chatbot", "chatbots", "AI-generated"]),
    ("Blake, William", ["Blake"]),
    ("Benedict XVI", ["Benedict XVI", "Ratzinger"]),
    ("John Paul II", ["John Paul II", "Wojty\u0142a", "Wojtyla"]),
    ("Francis, Pope", ["Pope Francis", "Bergoglio"]),
    ("Balthasar, Hans Urs von", ["Balthasar"]),
    ("Rahner, Karl", ["Rahner"]),
    ("Lonergan, Bernard", ["Lonergan"]),
    ("MacIntyre, Alasdair", ["MacIntyre"]),
    ("Taylor, Charles", ["Charles Taylor"]),
    ("Weil, Simone", ["Weil"]),
    ("Murphy, Joseph", ["Joseph Murphy"]),
    ("Peale, Norman Vincent", ["Peale"]),
    ("Fox, Emmet", ["Emmet Fox"]),
    ("Wattles, Wallace", ["Wattles"]),
    ("Haanel, Charles", ["Haanel"]),
    ("New Age", ["New Age"]),
    ("cosmic Christ", ["cosmic Christ"]),
    ("consciousness", ["consciousness"]),
    ("1277 condemnation", ["1277"]),
    ("Tempier, Stephen", ["Tempier"]),
    ("satisfaction", ["satisfaction"]),
    ("consolation and desolation", ["consolation", "desolation"]),
    ("examen", ["examen"]),
    ("lectio divina", ["lectio divina", "lectio"]),
    ("intercession", ["intercession", "intercede"]),
    ("resurrection", ["resurrection"]),
    ("eschatology", ["eschatolog"]),
    ("mystical body", ["mystical body", "Body of Christ"]),
    ("kenosis", ["kenosis", "self-emptying"]),
    ("gratia non tollit naturam", ["gratia non tollit"]),
    ("ordo amoris", ["ordo amoris", "order of loves", "rightly ordered love"]),
    ("affirmation", ["affirmation", "affirmations"]),
    ("SATS", ["SATS", "state akin to sleep"]),
    ("everyone is you pushed out", ["pushed out"]),
]


def build_terms_index(docs):
    hits = []
    chnum = 0
    for d in docs:
        if d['kind'] != 'chapter':
            continue
        chnum += 1
        low = re.sub(r'\s+', ' ', d['body'])
        low_l = low.lower()
        for label, pats in TERMS:
            n = 0
            for pat in pats:
                n += len(re.findall(r'(?<![A-Za-z])' + re.escape(pat.lower()) + r'(?![A-Za-z])', low_l))
            if n:
                hits.append((label, chnum, n))
    if not hits:
        return None
    by_term = {}
    for label, ch, n in hits:
        by_term.setdefault(label, {})[ch] = n
    lines = ['The numbers are chapters of this book, not pages; a name that recurs throughout is marked as such.', '']
    for label, _pats in sorted(TERMS, key=lambda t: t[0]):
        chs = by_term.get(label)
        if not chs:
            continue
        ordered = sorted(chs)
        shown = ', '.join(str(c) for c in ordered[:14])
        if len(ordered) > 14:
            shown += ', and throughout'
        lines.append(f'**{label}** \u2014 {shown}')
        lines.append('')
    return {
        'file': 'apxH.md', 'slug': 'apxH', 'kind': 'appendix',
        'title': 'Index of Names and Terms',
        'lede': 'Where the book treats each of the figures and ideas it argues with.',
        'part': '', 'meta': {'title': 'Index of Names and Terms'},
        'body': '\n'.join(lines),
    }


def wordcount(docs):
    return sum(len(re.findall(r"[A-Za-z0-9\u2019'-]+", d['body'])) for d in docs)


READER_JS = r'''<script>
(function () {
  var bar = document.getElementById('progress');
  var top = document.getElementById('topbar');
  var label = document.getElementById('curchap');
  var secs = [].slice.call(document.querySelectorAll('section.chapter, section.part'));
  var root = document.documentElement;

  function current() {
    var y = window.scrollY + 96, cur = null;
    for (var i = 0; i < secs.length; i++) {
      if (secs[i].offsetTop <= y) { cur = secs[i]; } else { break; }
    }
    return cur;
  }

  function frame() {
    var h = root, max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    bar.style.width = (p * 100).toFixed(2) + '%';
    top.classList.toggle('show', h.scrollTop > 420);
    var cur = current();
    if (cur) {
      var h1 = cur.querySelector('h1');
      if (h1 && label.textContent !== h1.textContent) { label.textContent = h1.textContent; }
    }
    try { localStorage.setItem('him:pos', String(h.scrollTop)); } catch (e) {}
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { frame(); ticking = false; }); }
  }, { passive: true });

  window.addEventListener('load', function () {
    frame();
    try {
      var saved = localStorage.getItem('him:pos');
      if (!location.hash && saved && +saved > 200 && +saved < root.scrollHeight - root.clientHeight - 200) {
        root.scrollTop = +saved;
      }
    } catch (e) {}
  });

  var size = 100;
  try { size = parseInt(localStorage.getItem('him:size') || '100', 10) || 100; } catch (e) {}
  root.style.fontSize = size + '%';
  var topBtn = document.getElementById('topbtn');
  if (topBtn) {
    topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  var btn = document.getElementById('fontbtn');
  if (btn) {
    btn.addEventListener('click', function () {
      size = size >= 118 ? 94 : size + 8;
      root.style.fontSize = size + '%';
      try { localStorage.setItem('him:size', String(size)); } catch (e) {}
      frame();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) { return; }
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') { return; }
    var cur = current();
    if (!cur) { return; }
    if (e.key === 'ArrowRight' && cur.nextElementSibling) { cur.nextElementSibling.scrollIntoView(); }
    if (e.key === 'ArrowLeft' && cur.previousElementSibling) { cur.previousElementSibling.scrollIntoView(); }
  });
})();
</script>
'''


def build():
    os.makedirs(DIST, exist_ok=True)
    docs = collect()
    words = wordcount(docs)          # the manuscript only, not the generated indexes
    idx = build_index_doc(docs)
    if idx:
        docs.append(idx)
    tidx = build_terms_index(docs)
    if tidx:
        docs.append(tidx)
    if not docs:
        print('no manuscript files'); sys.exit(1)
    body, toc, spine = render(docs)
    pages = round(words / 244)      # measured against the typeset PDF, not guessed
    pages += pages % 2              # the printed book has an even number of pages

    # --- single-file HTML ---
    cover_uri = ''
    if os.path.exists(COVER):
        with open(COVER, 'rb') as fh:
            cover_uri = 'data:' + COVER_MIME + ';base64,' + base64.b64encode(fh.read()).decode()
    cover_tag = f'<img class="tp-cover" alt="Cover" src="{cover_uri}">' if cover_uri else ''
    minutes = round(words / 238)
    css_web = font_css(embed=True) + CSS.replace(
        'font-family: "Iowan Old Style"', 'font-family: "Crimson Text", "Iowan Old Style"')
    copy_html = ''.join(f'<dt>{esc(k)}</dt><dd>{inline(v)}</dd>' for k, v in COPYRIGHT_ROWS)
    colophon_html = ('<section class="colophon" id="colophon"><h1>Colophon</h1>'
                     + ''.join(f'<p>{inline(c.format(words=words) if "{words" in c else c)}</p>'
                               for c in COLOPHON)
                     + f'<p class="formats">Also as <a href="the-hidden-and-the-manifest.pdf">PDF</a> '
                       f'({pages} pages, 5&frac12; &times; 8&frac12; in, fonts embedded, mirrored margins) and '
                       '<a href="the-hidden-and-the-manifest.epub">EPUB 3</a>; '
                       '<a href="sample.html">a free sample</a>; and '
                       '<a href="triage-card.pdf">the triage card</a> on one page.</p>'
                     + '</section>')
    title_html = f"""
<section class="halftitle" id="halftitle">
  <div class="ht-title">{esc(META['title'])}</div>
  <div class="ht-rule"></div>
</section>
<section class="titlepage">
  {cover_tag}
  <div class="tp-kicker">A theological research project</div>
  <h1 class="title">{esc(META['title'])}</h1>
  <div class="rule"></div>
  <p class="subtitle">{esc(META['subtitle'])}</p>
  <p class="byline">{esc(META['author'])}</p>
  <p class="tp-edition">{esc(META['edition'])}</p>
</section>
<section class="copyrightpage" id="copyrightpage">
  <dl>{copy_html}</dl>
</section>"""
    book_ld = json.dumps({
        '@context': 'https://schema.org',
        '@type': 'Book',
        'name': META['title'],
        'alternateName': META['subtitle'],
        'author': {'@type': 'Organization', 'name': META['author']},
        'publisher': {'@type': 'Organization', 'name': META['imprint'], 'url': META['url']},
        'inLanguage': META['language'],
        'bookEdition': META['edition'],
        'datePublished': str(META['year']),
        'numberOfPages': pages,
        'identifier': META['identifier'],
        'url': META['url'],
        'abstract': META['description'],
        'keywords': META['keywords'],
        'genre': 'Theology',
    }, ensure_ascii=False, indent=1)
    html_doc = f"""<!doctype html>
<html lang="{META['language']}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(META['title'])}</title><meta name="description" content="{esc(META['description'])}">
<meta property="og:type" content="book"><meta property="og:title" content="{esc(META['title'])}">
<meta property="og:description" content="{esc(META['description'])}">
<meta name="author" content="{esc(META['author'])}">
<meta name="keywords" content="{esc(META['keywords'])}">
<meta name="dcterms.identifier" content="{META['identifier']}">
<meta name="book:edition" content="{esc(META['edition'])}">
<meta property="og:site_name" content="{esc(META['imprint'])}">
<script type="application/ld+json">{book_ld}</script>
<style>{css_web}</style></head>
<body><div id="progress" aria-hidden="true"></div>
<header class="topbar" id="topbar">
  <a href="#contents" aria-label="Go to the contents">Contents</a>
  <span class="cur" id="curchap" aria-live="polite"></span>
  <button id="fontbtn" type="button" title="Change type size" aria-label="Change type size">Aa</button>
  <button id="topbtn" type="button" title="Back to the top" aria-label="Back to the top">&uarr;</button>
</header>
<div class="wrap">{title_html}
<nav class="toc-page" id="contents" aria-label="Contents"><h1>Contents</h1>{toc}</nav>
<main id="main">
{body}
{colophon_html}
<p class="note">Web edition generated {date.today().isoformat()} &middot; {words:,} words &middot; approx. {pages} printed pages (5.5 &times; 8.5 in) &middot; {minutes} min at reading speed.<br>{esc(META['rights'])}</p>
</main>
</div>@@READER@@</body></html>"""
    html_doc = html_doc.replace('@@READER@@', READER_JS)
    open(os.path.join(DIST, 'the-hidden-and-the-manifest.html'), 'w', encoding='utf-8').write(html_doc)

    # --- sample edition: cover, preface, argument, chapter one ---
    def _section(hid):
        m = re.search(rf'<section[^>]*id="{hid}"[^>]*>.*?</section>', html_doc, re.S)
        return m.group(0) if m else ''
    banner = ('<section class="chapter front"><div class="num">Free sample</div><h1>About This Sample</h1>'
              '<p>This is the opening of the book: the preface, the argument on one page, and the first chapter. '
              'The complete edition runs to forty chapters in six parts and eight appendices, including a one-page '
              'triage card, a nine-day novena, forty disputed questions, and a thirty-day pilot protocol for a parish.</p>'
              '<p>If the sample does what it claims, the rest is the working-out.</p></section>')
    sample_doc = (html_doc.split('<body>')[0] + '<body><div class="wrap">' + title_html + banner
                  + ''.join(re.sub(r'<nav class="chapnav">.*?</nav>', '', _section(x), flags=re.S)
                            for x in ('01-preface', '01b-argument', 'ch01'))
                  + f'''<section class="sample-end" id="read-on">
<div class="ap-label">The rest of the book</div>
<h2>Read on</h2>
<p>The complete edition is {words:,} words in forty chapters and six parts, with eight
appendices: the audit of fourteen claims, the forty disputed questions, the nine-day novena,
the thirty-day pilot, the one-page triage card, and two indexes.</p>
<p class="sample-links"><a href="index.html">Read it in the browser</a> &middot;
<a href="the-hidden-and-the-manifest.pdf">PDF, {pages} pages</a> &middot;
<a href="the-hidden-and-the-manifest.epub">EPUB</a> &middot;
<a href="triage-card.pdf">The triage card, one page</a></p>
<p class="note">Sample edition &middot; {words:,} words in the complete book &middot;
approx. {pages} printed pages.<br>{esc(META["rights"])}</p>
</section></div></body></html>''')
    open(os.path.join(DIST, 'sample.html'), 'w', encoding='utf-8').write(sample_doc)

    # --- print edition: same text, laid out as a book on screen as well as on paper ---
    print_doc = html_doc.replace('<body>', '<body class="print">', 1)
    open(os.path.join(DIST, 'the-hidden-and-the-manifest.print.html'), 'w', encoding='utf-8').write(print_doc)

    # --- EPUB 3 ---
    epub = os.path.join(DIST, 'the-hidden-and-the-manifest.epub')
    uid = META['identifier']

    def xhtml(t, content, extra=''):
        return ('<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
                '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" '
                f'lang="{META["language"]}" xml:lang="{META["language"]}"><head><meta charset="utf-8"/>'
                f'<title>{esc(t)}</title><link rel="stylesheet" type="text/css" href="style.css"/>{extra}</head>'
                f'<body>{content}</body></html>')

    chapters_epub = []
    if os.path.exists(COVER):
        chapters_epub.append(('cover', 'Cover', xhtml('Cover',
            f'<div class="coverpage"><img src="cover.{COVER_EXT}" alt="Cover"/></div>')))
    chapters_epub.append(('title', 'Title Page', xhtml(META['title'],
        '<div class="titlepage" epub:type="titlepage"><h1 class="title">' + esc(META['title']) + '</h1>'
        '<div class="rule"></div><p class="subtitle">' + esc(META['subtitle']) + '</p>'
        '<p class="byline">' + esc(META['author']) + '</p>'
        '<p class="edition">' + esc(META['edition']) + '</p></div>')))
    chapters_epub.append(('copyright', 'Copyright', xhtml('Copyright',
        '<section class="copyrightpage" epub:type="copyright-page"><h1>Copyright</h1><dl>'
        + ''.join(f'<dt>{esc(k)}</dt><dd>{inline(v)}</dd>' for k, v in COPYRIGHT_ROWS)
        + '</dl></section>')))
    for hid, t, kind in spine:
        d = next(x for x in docs if x['slug'] == hid)
        if kind == 'part':
            epi = d['meta'].get('epigraph', '')
            epi_html = ''
            if epi:
                text, _, src = epi.partition('|')
                epi_html = (f'<blockquote class="part-epigraph"><p>{inline(text.strip())}</p>'
                            f'<cite>{inline(src.strip())}</cite></blockquote>')
            c = (f'<section class="part" epub:type="part"><div class="label">{esc(d["meta"].get("label","Part"))}</div>'
                 f'<h1>{inline(d["title"])}</h1>' + epi_html
                 + (f'<div class="intro">{blocks(d["body"])}</div>' if d['body'].strip() else '') + '</section>')
        elif kind == 'chapter':
            c = (f'<section class="chapter" epub:type="chapter"><div class="num">Chapter {d.get("chnum","")}</div>'
                 f'<h1>{inline(d["title"])}</h1>' + (f'<div class="lede">{inline(d["lede"])}</div>' if d['lede'] else '') + linkify(blocks(d['body']), epub=True) + apparatus_html(d) + '</section>')
        else:
            c = (f'<section class="chapter" epub:type="appendix"><h1>{inline(d["title"])}</h1>' + (f'<div class="lede">{inline(d["lede"])}</div>' if d['lede'] else '') + blocks(d['body']) + '</section>')
        chapters_epub.append((hid, d['title'], xhtml(d['title'], c)))

    colophon_epub = ''.join('<p>' + inline(c.replace('{words:,}', f'{words:,}')) + '</p>'
                            for c in COLOPHON)
    chapters_epub.append(('colophon', 'Colophon', xhtml('Colophon',
        '<section class="colophon" epub:type="colophon"><h1>Colophon</h1>'
        + colophon_epub + '</section>')))

    # EPUB navigation, built from the real filenames
    nav_items = []
    open_part = False
    for hid, t, kind in spine:
        d = next(x for x in docs if x['slug'] == hid)
        if kind == 'part':
            if open_part:
                nav_items.append('</ol></li>')      # close the part that just ended
            lab = d['meta'].get('label', 'Part')
            nav_items.append(f'<li><a href="{hid}.xhtml">{esc(lab)} &#183; {esc(t)}</a>'
                             '<ol class="chaps">')
            open_part = True
        elif kind == 'chapter':
            nav_items.append(f'<li><a href="{hid}.xhtml">Chapter {d.get("chnum","")}. {esc(d["title"])}</a></li>')
        else:
            if open_part and kind == 'appendix':
                nav_items.append('</ol></li>')      # the appendices sit outside the parts
                open_part = False
            if kind == 'appendix':
                m = re.match(r'apx([A-Z])', hid)
                lab = f'Appendix {m.group(1)} &middot; ' if m else ''
                nav_items.append(f'<li><a href="{hid}.xhtml">{lab.replace("&middot;", "&#183;")}{esc(t)}</a></li>')
            else:
                nav_items.append(f'<li><a href="{hid}.xhtml">{esc(t)}</a></li>')
    if open_part:
        nav_items.append('</ol></li>')
    landmarks = ('<nav epub:type="landmarks" id="landmarks" hidden="hidden"><h2>Guide</h2><ol>'
                 '<li><a epub:type="titlepage" href="title.xhtml">Title page</a></li>'
                 '<li><a epub:type="copyright-page" href="copyright.xhtml">Copyright</a></li>'
                 '<li><a epub:type="toc" href="contents.xhtml">Contents</a></li>'
                 '<li><a epub:type="bodymatter" href="01-preface.xhtml">Begin reading</a></li>'
                 '</ol></nav>')
    # cover, title page, copyright page, then the contents, then the text
    front_count = 2 + (1 if os.path.exists(COVER) else 0)
    chapters_epub.insert(front_count, ('contents', 'Contents', xhtml('Contents',
        '<nav epub:type="toc" id="toc"><h1>Contents</h1><ol class="toc">' + ''.join(nav_items) + '</ol></nav>'
        + landmarks)))

    # --- write the EPUB container ---
    if os.path.exists(epub):
        os.remove(epub)
    now = date.today().strftime('%Y-%m-%dT%H:%M:%SZ')
    cover_exists = os.path.exists(COVER)
    with zipfile.ZipFile(epub, 'w') as z:
        zi = zipfile.ZipInfo('mimetype')
        zi.compress_type = zipfile.ZIP_STORED
        z.writestr(zi, 'application/epub+zip')
        z.writestr('META-INF/container.xml',
            '<?xml version="1.0" encoding="UTF-8"?>\n<container version="1.0" '
            'xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles>'
            '<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>'
            '</rootfiles></container>', compress_type=zipfile.ZIP_DEFLATED)
        z.writestr('OEBPS/style.css', font_css() + EPUB_CSS, compress_type=zipfile.ZIP_DEFLATED)
        if FONTS_OK:
            for _style, _weight, _name in FACES:
                z.write(os.path.join(FONT_DIR, _name), 'OEBPS/fonts/' + _name,
                        compress_type=zipfile.ZIP_STORED)
            # the licence has to travel with the files it covers
            z.write(os.path.join(FONT_DIR, 'OFL.txt'), 'OEBPS/fonts/OFL.txt',
                    compress_type=zipfile.ZIP_DEFLATED)
        for hid, t, content in chapters_epub:
            z.writestr(f'OEBPS/{hid}.xhtml', content, compress_type=zipfile.ZIP_DEFLATED)
        if cover_exists:
            z.write(COVER, f'OEBPS/cover.{COVER_EXT}', compress_type=zipfile.ZIP_DEFLATED)
        cover_item = f'<item id="coverimg" href="cover.{COVER_EXT}" media-type="{COVER_MIME}" properties="cover-image"/>' if cover_exists else ''
        cover_meta = '<meta name="cover" content="coverimg"/>' if cover_exists else ''
        a11y_meta = ('<meta property="schema:accessMode">textual</meta>'
                     '<meta property="schema:accessModeSufficient">textual</meta>'
                     '<meta property="schema:accessibilityFeature">structuralNavigation</meta>'
                     '<meta property="schema:accessibilityFeature">tableOfContents</meta>'
                     '<meta property="schema:accessibilityHazard">none</meta>'
                     '<meta property="schema:accessibilitySummary">Reflowable text with a linked table of contents, '
                     'headings, and tables. No audio, video, or images other than the cover.</meta>')
        nav_id = next(i for i, (h, t, c) in enumerate(chapters_epub, 1) if h == 'contents')
        font_items = ''.join(
            '<item id="font%d" href="fonts/%s" media-type="font/woff2"/>' % (i, name)
            for i, (_s, _w, name) in enumerate(FACES, 1)) if FONTS_OK else ''
        if FONTS_OK:
            font_items += '<item id="ofl" href="fonts/OFL.txt" media-type="text/plain"/>'
        items = []
        for idx, (hid, t, content) in enumerate(chapters_epub, 1):
            props = ' properties="nav"' if hid == 'contents' else ''
            items.append(f'<item id="c{idx}" href="{hid}.xhtml" media-type="application/xhtml+xml"{props}/>')
        spine_refs = '\n'.join(f'<itemref idref="c{i}"/>' for i in range(1, len(chapters_epub) + 1))
        z.writestr('OEBPS/content.opf', f"""<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="{META['language']}">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="bookid">{uid}</dc:identifier>
<dc:title>{esc(META['title'])}: {esc(META['subtitle'])}</dc:title>
<dc:creator id="creator">{esc(META['author'])}</dc:creator>
<meta refines="#creator" property="role" scheme="marc:relators">aut</meta>
<meta refines="#creator" property="file-as">Clausery Authors, The</meta>
<dc:language>{META['language']}</dc:language>
<dc:description>{esc(META['description'])}</dc:description>
<dc:rights>{esc(META['rights'])}</dc:rights>
<dc:publisher>{esc(META['imprint'])}</dc:publisher>
<dc:source>{esc(META['url'])}</dc:source>
<dc:subject>Religion / Christian Theology / General</dc:subject>
<dc:subject>Religion / Christian Living / Spiritual Growth</dc:subject>
<dc:subject>Body, Mind &amp; Spirit / New Thought</dc:subject>
<dc:date>{date.today().isoformat()}</dc:date>
<meta property="dcterms:modified">{now}</meta>
{cover_meta}
{a11y_meta}
</metadata>
<manifest>
<item id="css" href="style.css" media-type="text/css"/>
{font_items}
{cover_item}
{chr(10).join(items)}
</manifest>
<spine>
{spine_refs}
</spine>
</package>""", compress_type=zipfile.ZIP_DEFLATED)

    rep_path = os.path.join(DIST, 'build-report.json')
    try:
        report = json.load(open(rep_path))
    except Exception:
        report = {}
    report.update({
        'title': META['title'],
        'author': META['author'],
        'edition': META['edition'],
        'words': words,
        'reading_time_min': round(words / 238),
        'pages_estimate': pages,
        'chapters': sum(1 for s in spine if s[2] == 'chapter'),
        'parts': sum(1 for s in spine if s[2] == 'part'),
        'appendices': len({re.match(r'apx([A-Z])', s[0]).group(1) for s in spine if s[2] == 'appendix'}),
        'documents': len(docs),
        'epub': os.path.relpath(epub, ROOT),
        'built': date.today().isoformat(),
    })
    open(rep_path, 'w').write(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    build()
