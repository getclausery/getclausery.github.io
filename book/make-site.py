#!/usr/bin/env python3
"""Assemble the book's own website as a standalone, deployable folder.

    python3 book/make-site.py                    # -> book/site-dist/
    python3 book/make-site.py --base-url https://example.org/

The book is not part of the Clausery product site, and it should not be published as a subdirectory of it:
it needs its own address. This builds the complete bundle to push to that address — landing page, PDF,
EPUB, reading edition, cover, social cards, triage card, 404, robots and sitemap — from the files the
book build already produces. Nothing is duplicated in git: `book/site-dist/` is ignored, and this script
is the source of truth for the site.
"""
import argparse
import os
import shutil
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'site-dist')
DEFAULT_BASE = 'https://ykidus053-create.github.io/'

LINK_MAP = [
    # the landing page in the book folder points at its siblings; the site keeps them at the root
    ('../The-Hidden-and-the-Manifest.pdf?download', './the-hidden-and-the-manifest.pdf?download'),
    ('../The-Hidden-and-the-Manifest.epub?download', './the-hidden-and-the-manifest.epub?download'),
    ('href="../editions/index.html"', 'href="./read/"'),
    ('src="../cover.jpg"', 'src="./cover.jpg"'),
    ('content="../social/og-card.png"', 'content="./social/og-card.png"'),
]

NOT_FOUND = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Not found — The Hidden and the Manifest</title><meta name="robots" content="noindex">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#141210;color:#efe6d6;
font:18px/1.6 Georgia,serif;text-align:center;padding:2rem}a{color:#b08d57}</style></head>
<body><div><p style="letter-spacing:.18em;text-transform:uppercase;font-size:.72rem;color:#b08d57">The Hidden and the Manifest</p>
<h1 style="font-size:2rem;margin:.4rem 0 1rem">There is no page here</h1>
<p><a href="/">Return to the book</a></p></div></body></html>
"""

LICENSE = """The Hidden and the Manifest
A Catholic Theology of Manifestation, and How the Church May Baptize an Age
(C) 2026 Kidus Yared. First edition, MMXXVI.

Free to read, copy and distribute, in whole or in part, provided this notice travels with
it and any changes are marked as changes.

This is a theological research project, not an authoritative text. No imprimatur has been
sought or granted, and none is claimed. It was written with the help of the Holy Spirit and
is submitted to the Church for correction.

Corrections: getclausery@gmail.com
"""

README = """# The Hidden and the Manifest

The website for *The Hidden and the Manifest: A Catholic Theology of Manifestation, and How the Church May
Baptize an Age*, by Kidus Yared. First edition, MMXXVI.

Published at {base} — the book's own address, separate from the Clausery product site.

Contents: the landing page (`index.html`), the typeset PDF and EPUB, the reading edition under `read/`, the
cover, the shareable cards under `social/`, and the printable triage card.

A theological research project. Not authoritative; no imprimatur sought or granted. Written with the help of
the Holy Spirit and submitted to the Church for correction.

Built by `book/make-site.py` in the book's repository — do not hand-edit; change the book and rebuild.

To point a domain at it: add a `CNAME` file here with the domain, set the DNS record GitHub gives you, and
rerun the builder with `--base-url https://your.domain/`.
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base-url', default=DEFAULT_BASE)
    args = ap.parse_args()
    base = args.base_url.rstrip('/') + '/'

    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(os.path.join(OUT, 'read'))
    os.makedirs(os.path.join(OUT, 'social'))

    # landing page
    page = open(os.path.join(ROOT, 'landing', 'index.html'), encoding='utf-8').read()
    for a, b in LINK_MAP:
        page = page.replace(a, b)
    page = page.replace('<meta property="og:type" content="book">',
                        '<meta property="og:type" content="book">\n'
                        f'<link rel="canonical" href="{base}">\n'
                        f'<meta property="og:url" content="{base}">')
    page = page.replace('<a href="https://getclausery.github.io">getclausery.github.io</a>',
                        f'<a href="{base}">{base.split("//")[1].rstrip("/")}</a>')
    page = page.replace(
        '  <p class="free">314 pages · free to read, copy and distribute · no account, no email, no card</p>',
        '  <p class="free">314 pages · free to read, copy and distribute · no account, no email, no card<br>\n'
        '  <a href="./triage-card.pdf">The one-page triage card (PDF)</a> · '
        '<a href="./the-hidden-and-the-manifest.pdf" target="_blank" rel="noopener">open the PDF in this tab</a></p>')
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(page)

    # the book itself
    pdf = os.path.join(ROOT, 'The-Hidden-and-the-Manifest.pdf')
    epub = os.path.join(ROOT, 'The-Hidden-and-the-Manifest.epub')
    for src, dst in [(pdf, 'the-hidden-and-the-manifest.pdf'),
                     (epub, 'the-hidden-and-the-manifest.epub'),
                     (os.path.join(ROOT, 'cover.jpg'), 'cover.jpg'),
                     (os.path.join(ROOT, 'editions', 'triage-card.pdf'), 'triage-card.pdf'),
                     (os.path.join(ROOT, 'editions', 'index.html'), os.path.join('read', 'index.html'))]:
        if not os.path.exists(src):
            raise SystemExit(f'missing {src} — run sh book/publish.sh first')
        shutil.copy2(src, os.path.join(OUT, dst))

    for f in sorted(os.listdir(os.path.join(ROOT, 'social'))):
        if f.endswith('.png'):
            shutil.copy2(os.path.join(ROOT, 'social', f), os.path.join(OUT, 'social', f))

    open(os.path.join(OUT, '404.html'), 'w', encoding='utf-8').write(NOT_FOUND)
    open(os.path.join(OUT, 'LICENSE-BOOK.txt'), 'w', encoding='utf-8').write(LICENSE)
    open(os.path.join(OUT, 'README.md'), 'w', encoding='utf-8').write(README.format(base=base))
    open(os.path.join(OUT, '.nojekyll'), 'w').write('')
    open(os.path.join(OUT, 'robots.txt'), 'w').write(
        f'User-agent: *\nAllow: /\nSitemap: {base}sitemap.xml\n')
    open(os.path.join(OUT, 'sitemap.xml'), 'w', encoding='utf-8').write(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'  <url><loc>{base}</loc><priority>1.0</priority></url>\n'
        f'  <url><loc>{base}read/</loc><priority>0.8</priority></url>\n'
        '</urlset>\n')

    total = sum(os.path.getsize(os.path.join(dp, f)) for dp, _dn, fn in os.walk(OUT) for f in fn)
    print(f'wrote {OUT} — {len(os.listdir(OUT))} entries at the root, {total / 1048576:.1f} MB')
    print(f'base url: {base}')


if __name__ == '__main__':
    main()
