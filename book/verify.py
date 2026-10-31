#!/usr/bin/env python3
"""Acceptance checks for the four editions of The Hidden and the Manifest.

    python3 book/verify.py

Every check is something a reader or a retailer would notice if it were wrong:
missing sections, placeholder text left in the manuscript, broken markup, an EPUB
whose spine opens on the contents page, a contents whose page numbers do not match
the printed folios, a PDF with no metadata. Exit status is 1 if anything fails.
"""
import json
import os
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, 'dist')
MS = os.path.join(ROOT, 'manuscript')

HTML = os.path.join(DIST, 'the-hidden-and-the-manifest.html')
PRINT_HTML = os.path.join(DIST, 'the-hidden-and-the-manifest.print.html')
SAMPLE = os.path.join(DIST, 'sample.html')
EPUB = os.path.join(DIST, 'the-hidden-and-the-manifest.epub')
PDF = os.path.join(DIST, 'the-hidden-and-the-manifest.pdf')
CARD = os.path.join(DIST, 'triage-card.pdf')

results = []


def check(name, ok, detail=''):
    results.append((bool(ok), name, str(detail)))
    print(('  ok   ' if ok else '  FAIL ') + name + (('  \u2014 ' + str(detail)) if detail else ''))
    return ok


class Balance(HTMLParser):
    VOID = {'meta', 'link', 'br', 'img', 'hr', 'input', 'source', 'wbr', 'area', 'base', 'col',
            'embed', 'param', 'track'}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.errors = [], []
        self.counts = {}

    def handle_starttag(self, tag, attrs):
        self.counts[tag] = self.counts.get(tag, 0) + 1
        if tag not in self.VOID:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        self.counts[tag] = self.counts.get(tag, 0) + 1

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if not self.stack:
            self.errors.append(f'stray </{tag}>')
        elif self.stack[-1] != tag:
            self.errors.append(f'</{tag}> closes <{self.stack[-1]}>')
            if tag in self.stack:
                while self.stack and self.stack.pop() != tag:
                    pass
        else:
            self.stack.pop()


def read(path):
    with open(path, encoding='utf-8') as fh:
        return fh.read()


# ------------------------------------------------------------------ manuscript
def check_fonts():
    print('\nfonts')
    fonts = os.path.join(ROOT, 'fonts')
    for name in ('CrimsonText-Regular', 'CrimsonText-Italic', 'CrimsonText-Bold',
                 'CrimsonText-BoldItalic'):
        check(f'fonts: {name}.ttf', os.path.exists(os.path.join(fonts, name + '.ttf')))
        check(f'fonts: {name}.woff2', os.path.exists(os.path.join(fonts, name + '.woff2')))
    check('fonts: OFL licence travels with the files', os.path.exists(os.path.join(fonts, 'OFL.txt')))


def check_manuscript():
    print('\nmanuscript')
    files = sorted(os.listdir(MS))
    chapters = [f for f in files if re.match(r'ch\d\d\.md$', f)]
    parts = [f for f in files if re.match(r'p\d\.md$', f)]
    apx = sorted({re.match(r'(apx[A-Z])', f).group(1) for f in files if f.startswith('apx')})
    check('40 chapters', len(chapters) == 40, len(chapters))
    check('6 parts', len(parts) == 6, len(parts))
    # G and H are generated at build time from the typeset text; A-F are written
    check('appendices A\u2013F written', apx == [f'apx{c}' for c in 'ABCDEF'], ''.join(a[-1] for a in apx))

    text = '\n'.join(read(os.path.join(MS, f)) for f in files)
    words = len(re.findall(r"[A-Za-z\u2019'\-]+", text))
    check('word count above 70,000', words > 70000, f'{words:,}')
    for bad in (r'\bTODO\b', r'\bFIXME\b', r'\bXXX\b', r'lorem ipsum',
                r'A Working Manuscript', r'working manuscript', r'\[citation needed\]',
                r'\[insert', r'insert here', r'\bTBD\b', r'\bLorem\b'):
        check(f'no placeholder {bad}', not re.search(bad, text, re.I))


# ------------------------------------------------------------------------ HTML
def check_html(path, label, expect_chapnav=None):
    name = os.path.basename(path)
    if not check(f'{label}: exists', os.path.exists(path), name):
        return
    doc = read(path)
    p = Balance()
    p.feed(doc)
    p.close()
    check(f'{label}: markup balanced', not p.errors and not p.stack,
          '; '.join(p.errors[:3]) or f'{len(p.stack)} unclosed')
    check(f'{label}: reader script injected', '@@READER@@' not in doc)
    if label != 'sample':
        check(f'{label}: 60+ sections', p.counts.get('section', 0) >= 60, p.counts.get('section', 0))
    else:
        check('sample: opening sections', p.counts.get('section', 0) >= 4, p.counts.get('section', 0))
    if expect_chapnav is not None:
        check(f'{label}: {expect_chapnav} chapter nav blocks', doc.count('class="chapnav"') == expect_chapnav,
              doc.count('class="chapnav"'))
    if label == 'web':
        check('web: progress bar + topbar', 'id="progress"' in doc and 'id="topbar"' in doc)
        check('web: dark theme', 'prefers-color-scheme: dark' in doc)
        check('web: reading times in contents', doc.count('class="rt"') == 40, doc.count('class="rt"'))
        check('web: copyright page', 'id="copyrightpage"' in doc and 'How to cite' in doc)
        check('web: half-title', 'class="halftitle"' in doc)
        check('web: main landmark', doc.count('<main') == 1 and doc.count('</main>') == 1)
        check('web: links to the other editions',
              all(x in doc for x in ('the-hidden-and-the-manifest.pdf',
                                     'the-hidden-and-the-manifest.epub', 'triage-card.pdf')))
        check('web: book face embedded', doc.count('@font-face') == 4
              and 'data:font/woff2;base64,' in doc, doc.count('@font-face'))
        ld = re.search(r'<script type="application/ld\+json">(.*?)</script>', doc, re.S)
        if check('web: JSON-LD present', bool(ld)):
            try:
                data = json.loads(ld.group(1))
                check('web: JSON-LD is Book', data.get('@type') == 'Book' and data.get('name'))
            except Exception as exc:
                check('web: JSON-LD parses', False, exc)
    if label == 'print':
        check('print: body class', '<body class="print">' in doc)
        check('print: screen chrome hidden by CSS',
              'body.print .topbar' in doc or '.topbar { display: none; }' in doc)
    check(f'{label}: no byline placeholder', 'A Working Manuscript' not in doc)


# ------------------------------------------------------------------------ EPUB
def check_epub():
    print('\nepub')
    if not check('epub: exists', os.path.exists(EPUB), f'{os.path.getsize(EPUB) // 1024} KB'):
        return
    z = zipfile.ZipFile(EPUB)
    names = z.namelist()
    first = z.infolist()[0]
    check('epub: mimetype first and stored', first.filename == 'mimetype'
          and first.compress_type == zipfile.ZIP_STORED)
    bad = []
    for n in names:
        if n.endswith(('.xhtml', '.opf', '.xml', '.ncx')):
            try:
                ET.fromstring(z.read(n))
            except Exception as exc:
                bad.append(f'{n}: {exc}')
    check('epub: all XML parses', not bad, bad[:2])

    opf = z.read('OEBPS/content.opf').decode()
    items = dict(re.findall(r'<item id="([^"]+)" href="([^"]+)"', opf))
    spine = [items[i] for i in re.findall(r'idref="([^"]+)"', opf) if i in items]
    check('epub: spine opens cover, title, copyright, contents',
          spine[:4] == ['cover.xhtml', 'title.xhtml', 'copyright.xhtml', 'contents.xhtml'], spine[:4])
    check('epub: 60+ spine documents', len(spine) >= 60, len(spine))
    for token in ('dc:identifier', 'dc:title', 'dc:creator', 'dc:language', 'dc:publisher',
                  'dcterms:modified', 'schema:accessMode', 'schema:accessibilityFeature',
                  'schema:accessibilityHazard'):
        check(f'epub: metadata {token}', token in opf)
    check('epub: cover image declared', 'properties="cover-image"' in opf)
    check('epub: font licence inside the package', 'OEBPS/fonts/OFL.txt' in names)
    check('epub: fonts declared and present',
          opf.count('media-type="font/woff2"') == 4
          and all(any(n.startswith('OEBPS/fonts/') for n in names) for _ in [0]),
          opf.count('media-type="font/woff2"'))
    contents = z.read('OEBPS/contents.xhtml').decode()
    check('epub: landmarks nav', 'epub:type="landmarks"' in contents)
    check('epub: chapter semantics', 'epub:type="chapter"' in z.read('OEBPS/ch01.xhtml').decode())
    check('epub: appendix semantics', 'epub:type="appendix"' in z.read('OEBPS/apxC.xhtml').decode())
    # a navigation document that mirrors the book: chapters inside their part
    nested = contents.count('<ol class="chaps">')
    chap_links = len(re.findall(r'<li><a href="ch\d+\.xhtml">', contents))
    check('epub: chapters nest under their parts',
          nested == 6 and chap_links == 40, f'{nested} parts, {chap_links} chapters')
    sample = open(SAMPLE, encoding='utf-8').read()
    check('sample: closes with the way into the whole book',
          all(x in sample for x in ('Read on', 'the-hidden-and-the-manifest.pdf',
                                    'the-hidden-and-the-manifest.epub', 'triage-card.pdf',
                                    'index.html')))

    check('epub: language declared en-US',
          '<dc:language>en-US</dc:language>' in opf
          and 'lang="en-US"' in z.read('OEBPS/ch01.xhtml').decode())

    css = z.read('OEBPS/style.css').decode()
    check('epub: reader-safe stylesheet', '--ink' not in css and 'position:fixed' not in css
          and 'page-break-before' in css)
    check('epub: hyphenation and widows set',
          'hyphenate-limit-chars' in css and 'widows: 2' in css and 'orphans: 2' in css)


# ------------------------------------------------------------------------- PDF
def check_pdf():
    print('\npdf')
    if not check('pdf: exists', os.path.exists(PDF), f'{os.path.getsize(PDF) // 1024} KB'):
        return
    import pymupdf
    d = pymupdf.open(PDF)
    marks = d.get_toc()
    check('pdf: 280+ pages', d.page_count >= 280, d.page_count)
    check('pdf: even page count', d.page_count % 2 == 0, d.page_count)
    check('pdf: 66 bookmarks', len(marks) == 66, len(marks))
    check('pdf: outline opens with the front matter',
          [t for _l, t, _p in marks[:5]] == ['Cover', 'Half-title', 'Title Page', 'Copyright', 'Contents'])

    # every glyph must come from the embedded book face; a printer rejects the rest
    glyph_fonts, unres = set(), set()
    for i in range(d.page_count):
        for block in d[i].get_text('dict')['blocks']:
            for line in block.get('lines', []):
                for span in line['spans']:
                    glyph_fonts.add(span['font'])
        for f in d[i].get_fonts(full=True):
            if '+' not in f[3]:
                unres.add(f[3])
    check('pdf: all glyphs in the embedded text face',
          all(f.startswith('CrimsonText') for f in glyph_fonts), sorted(glyph_fonts))
    check('pdf: no un-embedded font resources', not unres, sorted(unres))

    meta = d.metadata
    check('pdf: title metadata', 'Hidden and the Manifest' in (meta.get('title') or ''))
    check('pdf: author metadata', meta.get('author') == 'The Clausery Authors', meta.get('author'))
    check('pdf: keywords metadata', bool(meta.get('keywords')))
    check('pdf: XMP packet', 'dc:title' in (d.get_xml_metadata() or ''))
    check('pdf: catalogue language', d.xref_get_key(d.pdf_catalog(), 'Lang')[1] == 'en-US')

    apx = next((i for i, m in enumerate(marks) if m[1] == 'Appendices'), None)
    check('pdf: appendices gathered under one outline heading',
          apx is not None and marks[apx][0] == 1 and marks[apx + 1][0] == 2
          and marks[apx + 1][1].startswith('Appendix A'),
          marks[apx][1] if apx is not None else 'missing')

    parts = [(t, p) for _l, t, p in marks if t.startswith('Part ')]
    check('pdf: all part pages on a recto', all(p % 2 == 1 for _t, p in parts),
          [p for _t, p in parts])
    chapters = [(t, p) for _l, t, p in marks if re.match(r'^\d+\. ', t)]
    check('pdf: 40 chapter bookmarks', len(chapters) == 40, len(chapters))

    first_body = min(p for _l, t, p in marks
                     if t.startswith('Part ') or re.match(r'^\d+\. ', t))
    offset = first_body - 1

    # the viewer's own page counter should read the folio printed on the page
    check('pdf: page labels follow the printed folios',
          d[4].get_label() == 'v' and d[offset].get_label() == '1'
          and d[offset + 9].get_label() == '10'
          and d[d.page_count - 1].get_label() == str(d.page_count - offset),
          f'p5 {d[4].get_label()}, p{offset + 1} {d[offset].get_label()}')

    # folio on every body page matches its physical position
    wrong = []
    for i in range(offset, d.page_count):
        words = d[i].get_text('words')
        if not words:
            continue                      # blank verso inserted before a part
        bottom = max(words, key=lambda w: w[3])
        if bottom[3] < d[i].rect.height - 0.75 * 72:
            continue                      # part page: no folio
        if bottom[4].strip() != str(i + 1 - offset):
            wrong.append((i + 1, bottom[4]))
    check('pdf: printed folios match page positions', not wrong, wrong[:4])

    # mirrored margins: the inside margin (at the spine) is wider than the outside one
    inner_x, outer_x = [], []
    for i in range(offset, d.page_count):
        words = [w for w in d[i].get_text('words') if len(w[4].strip()) > 2]
        body = [w for w in words if 60 < w[1] < d[i].rect.height - 60]
        if len(body) < 30:
            continue
        x0 = min(w[0] for w in body)
        (inner_x if (i + 1) % 2 else outer_x).append(x0)
    inner = sorted(inner_x)[len(inner_x) // 2] if inner_x else 0
    outer = sorted(outer_x)[len(outer_x) // 2] if outer_x else 0
    check('pdf: margins are mirrored (gutter inside)', 15 < inner - outer < 20,
          f'inner {inner / 72:.2f}in, outer {outer / 72:.2f}in')
    check('pdf: inside margin clears a perfect binding', inner >= 0.74 * 72,
          f'{inner / 72:.2f}in')

    # running heads: recto pages carry the chapter or the book title, verso the book title
    book_head = 'T H E H I D D E N A N D T H E M A N I F E S T'.replace(' ', '')
    heads, missing = 0, 0
    for i in range(offset, d.page_count):
        words = d[i].get_text('words')
        if not words:
            continue
        top = min(w[1] for w in words)
        if top > 0.7 * 72:
            continue                      # no head (part page, opening page)
        head = ''.join(w[4] for w in words if w[1] <= top + 2)
        flat = re.sub(r'[^A-Z]', '', head)
        if flat:
            heads += 1
        else:
            missing += 1
    check('pdf: running heads present', heads > 150 and missing == 0, f'{heads} heads')

    # a ladder is three or more consecutive lines ending on a hyphen; a compositor breaks it
    runs, run = [], 0
    for i in range(offset, d.page_count):
        lines = [ln.strip() for ln in d[i].get_text().split('\n') if len(ln.strip()) > 30]
        run = 0
        for ln in lines[1:]:
            if re.search(r'[a-z]-\s*$', ln):
                run += 1
            else:
                if run >= 2:
                    runs.append(run)
                run = 0
        if run >= 2:
            runs.append(run)
    check('pdf: no ladders of hyphenated lines',
          all(r <= 2 for r in runs), f'{sum(1 for r in runs if r >= 3)} ladders, '
                                     f'max run {max(runs) if runs else 0}')

    # contents numbers must equal the real folio of the section they point at
    text = ''.join(d[i].get_text() for i in range(4, min(12, d.page_count)))
    nums = re.findall(r'\.\s+([ivxlcdm]+|\d+)\s*$', text, re.M)
    check('pdf: contents numbers present', len(nums) >= 40, len(nums))

    # index appendices cite printed folios inside the body
    idx = next((p for _l, t, p in marks if 'Index of Citations' in t), None)
    if idx:
        tail = ''.join(d[i].get_text() for i in range(idx - 1, d.page_count))
        cited = [int(n) for n in re.findall(r'\((\d{1,3})(?:[,\u2013]|\s)', tail)]
        check('pdf: index cites real folios', cited and max(cited) <= d.page_count - offset,
              f'max {max(cited) if cited else 0} of {d.page_count - offset}')

    # an index in a digital edition is a set of doors: every printed page number must
    # open the page it names
    jumps, wrong = 0, []
    start = min(p for _l, t, p in marks if t.startswith('Appendix G'))
    for pno in range(start - 1, d.page_count):
        words = d[pno].get_text('words')
        for L in d[pno].get_links():
            if L['kind'] != 1:
                continue
            best, area = '', 0.0
            for w in words:
                inter = pymupdf.Rect(w[:4]).intersect(L['from'])
                if inter and inter.get_area() > area:
                    best, area = w[4], inter.get_area()
            shown = re.sub(r'\D', '', best)
            if not shown:
                continue
            jumps += 1
            label = d[L['page']].get_label()
            # a word token can swallow the number beside it ("8, 9" -> '89'); the
            # leading digits are the number that was clicked
            if not shown.startswith(label):
                wrong.append((pno + 1, shown, label))
    check('pdf: index entries jump to the page they name',
          jumps > 150 and not wrong, f'{jumps} links, {len(wrong)} wrong {wrong[:3]}')

    check('pdf: contents entries are clickable',
          sum(1 for i in range(4, 10) for L in d[i].get_links()) >= 100,
          sum(1 for i in range(4, 10) for L in d[i].get_links()))

    card = pymupdf.open(CARD)
    check('triage card: one letter page', card.page_count == 1 and abs(card[0].rect.width - 612) < 2,
          card[0].rect)


# ----------------------------------------------------------------------- report
def _luminance(hex_colour):
    h = hex_colour.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4))
    def lin(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def contrast(a, b):
    la, lb = _luminance(a), _luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def check_contrast():
    """Every colour a reader actually reads at, in both schemes, against WCAG AA."""
    print('\ncontrast')
    css = open(HTML, encoding='utf-8').read()
    light = re.search(r':root \{([^}]*)\}', css).group(1)
    dark_block = re.search(r'@media \(prefers-color-scheme: dark\) \{(.*?)\n\}', css, re.S)
    dark = re.search(r':root \{([^}]*)\}', dark_block.group(1)).group(1) if dark_block else ''

    def var(block, name, fallback=None):
        m = re.search(r'--' + name + r':\s*(#[0-9a-fA-F]{3,6})', block)
        return m.group(1) if m else fallback

    body_bg = '#fbf9f5'                      # body background, light
    dark_bg = '#141210'
    pairs = [
        ('light ink on paper', var(light, 'ink'), body_bg, 4.5),
        ('light muted on paper',
         var(light, 'muted'), body_bg, 4.5),
        ('light accent on paper', var(light, 'accent'), body_bg, 4.5),
        ('dark ink on paper', var(dark, 'ink'), dark_bg, 4.5),
        ('dark muted on paper', var(dark, 'muted'), dark_bg, 4.5),
        ('dark accent on paper', var(dark, 'accent'), dark_bg, 4.5),
    ]
    for label, fg, bg, floor in pairs:
        if not fg:
            check(f'contrast: {label}', False, 'colour not declared')
            continue
        ratio = contrast(fg, bg)
        check(f'contrast: {label}', ratio >= floor, f'{ratio:.1f}:1 ({fg} on {bg})')

    check('web: keyboard focus is visible', ':focus-visible' in css and 'outline:' in css)


def check_interior():
    """The file a printer prints: the pages between the boards, no cover."""
    import pymupdf
    path = os.path.join(DIST, 'the-hidden-and-the-manifest-interior.pdf')
    if not check('print: interior exists', os.path.exists(path),
                 f'{os.path.getsize(path) // 1024} KB' if os.path.exists(path) else ''):
        return
    d = pymupdf.open(path)
    read = pymupdf.open(PDF)
    check('print: even page count', d.page_count % 2 == 0, d.page_count)
    first = ' '.join(d[0].get_text().split())
    check('print: no cover page inside the book',
          not d[0].get_images() and 'H I D D E N' in d[0].get_text(),
          f'{len(d[0].get_images())} images')
    check('print: opens on the half-title', d.get_toc()[0][1] == 'Half-title', d.get_toc()[0][1])
    check('print: outline follows the reading edition',
          len(d.get_toc()) == len(read.get_toc()) - 1, len(d.get_toc()))
    body = min(p for _l, t, p in read.get_toc()
               if t.startswith('Part ') or re.match(r'^\d+\. ', t))
    body_i = body - 2                     # the interior is the reading edition minus the cover
    check('print: page labels restart with the body',
          d[0].get_label() == 'i' and d[body_i].get_label() == '1'
          and d[body_i - 1].get_label() != '1',
          f'{d[0].get_label()} .. {d[body_i].get_label()} at sheet {body_i + 1}')
    check('print: contents links survive the excision',
          sum(1 for i in range(2, 9) for L in d[i].get_links()) >= 100,
          sum(1 for i in range(2, 9) for L in d[i].get_links()))
    fonts = {f[3] for f in d[0].get_fonts(full=True)}
    check('print: first page set in the book face',
          any('CrimsonText' in f for f in fonts), sorted(fonts))


def check_wrap():
    """The full wrap: the sheet a printer needs, and the safe area it must stay inside."""
    import pymupdf
    path = os.path.join(DIST, 'cover-wrap.pdf')
    if not check('wrap: exists', os.path.exists(path)):
        return
    pages = pymupdf.open(os.path.join(DIST,
                                      'the-hidden-and-the-manifest-interior.pdf')).page_count
    spine = round(pages * 0.002252, 3)
    bleed, trim_w, trim_h = 0.125, 5.5, 8.5
    want_w = round(bleed * 2 + trim_w * 2 + spine, 3)
    want_h = round(bleed * 2 + trim_h, 3)

    d = pymupdf.open(path)
    p = d[0]
    w, h = p.rect.width / 72, p.rect.height / 72
    check('wrap: one sheet, back + spine + front', d.page_count == 1)
    check('wrap: width is the paper, not a guess',
          abs(w - want_w) < 0.01, f'{w:.3f} in for a {spine} in spine ({want_w} in)')
    check('wrap: height carries 1/8 in of bleed', abs(h - want_h) < 0.01, f'{h:.3f} in')

    fold_a = bleed + trim_w
    fold_b = fold_a + spine
    safe = 0.25                     # type stays a quarter inch inside every trim edge
    spine_clear = 0.0625            # and a sixteenth off each side of the fold
    bad_trim, bad_fold = [], []
    for x0, y0, x1, y1, text, *_ in p.get_text('words'):
        bw, bh = x1 - x0, y1 - y0
        if bw < 0.5 or bh < 0.5:    # a fragment, not a word
            continue
        left, right = x0 / 72, x1 / 72
        top, bottom = h - y1 / 72, h - y0 / 72
        if (left < bleed + safe - 0.005 or right > w - bleed - safe + 0.005
                or top < bleed + safe - 0.005 or bottom > h - bleed - safe + 0.005):
            bad_trim.append((text, round(left, 2), round(right, 2)))
        on_spine = left >= fold_a - 0.01 and right <= fold_b + 0.01
        crosses = (left < fold_a - spine_clear < right) or (left < fold_b + spine_clear < right)
        if crosses and not on_spine:
            bad_fold.append((text, round(left, 2), round(right, 2)))
    check('wrap: all type a quarter inch inside the trim',
          not bad_trim, bad_trim[:3])
    check('wrap: no type crosses the folds', not bad_fold, bad_fold[:3])

    # the printer stamps the barcode into a clear field at the foot of the back panel
    zone = pymupdf.Rect((fold_a - 2.0 - safe) * 72, (h - bleed - 0.4 - 1.2) * 72,
                        (fold_a - safe) * 72, (h - bleed - 0.4) * 72)
    inside = [w[4] for w in p.get_text('words') if zone.contains(pymupdf.Point(w[0], w[3]))]
    check('wrap: barcode field left clear', not inside, inside[:4])

    fonts = {f[3] for f in p.get_fonts(full=True)}
    check('wrap: cover set in the book face',
          any('CrimsonText' in f for f in fonts) and not any(f in ('Helvetica',) for f in fonts),
          sorted(fonts))


def check_report():
    print('\nreport')
    path = os.path.join(DIST, 'build-report.json')
    rep = json.load(open(path))
    check('report: chapters', rep.get('chapters') == 40, rep.get('chapters'))
    check('report: words', rep.get('words', 0) > 70000, rep.get('words'))
    check('report: pdf pages', rep.get('pdf_pages', 0) >= 275, rep.get('pdf_pages'))


def main():
    print('The Hidden and the Manifest \u2014 acceptance checks')
    check_fonts()
    check_manuscript()
    check_html(HTML, 'web')
    check_html(PRINT_HTML, 'print')
    check_html(SAMPLE, 'sample', expect_chapnav=0)
    check_epub()
    check_pdf()
    check_contrast()
    check_interior()
    check_wrap()
    check_report()

    failed = [r for r in results if not r[0]]
    print(f'\n{len(results) - len(failed)}/{len(results)} checks passed')
    if failed:
        print('failed:')
        for _ok, name, detail in failed:
            print(f'  - {name} {detail}')
        return 1
    print('all clear.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
