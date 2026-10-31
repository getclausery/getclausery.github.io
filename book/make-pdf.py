#!/usr/bin/env python3
"""Typeset The Hidden and the Manifest as a print-ready PDF.

    python3 book/make-pdf.py

Reads the same manuscript as build.py and produces
book/dist/the-hidden-and-the-manifest.pdf: 5.5 x 8.5 in, Times, justified with
hyphenation, running heads, page numbers, PDF bookmarks, and a contents page with
real page numbers.

Requires reportlab and pyphen:
    pip install --break-system-packages reportlab pyphen
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build as B  # noqa: E402  (manuscript parsing, apparatus, metadata)

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (BaseDocTemplate, CondPageBreak, Frame, Image, KeepTogether,
                                NextPageTemplate, PageBreak, PageTemplate, Paragraph, Spacer,
                                Table, TableStyle)
from reportlab.platypus.tableofcontents import TableOfContents

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, 'dist')
COVER = os.path.join(ROOT, 'cover.jpg')
OUT = os.path.join(DIST, 'the-hidden-and-the-manifest.pdf')
INTERIOR = os.path.join(DIST, 'the-hidden-and-the-manifest-interior.pdf')

PAGE_W, PAGE_H = 5.5 * inch, 8.5 * inch
# A perfect-bound book is not symmetric: the spine eats the inside margin. The text
# block is set once (CW wide) and the frames are mirrored, so rectos carry the extra
# margin on the left and versos on the right.
INNER, OUTER = 0.78 * inch, 0.55 * inch
MT, MB = 0.78 * inch, 0.72 * inch
CW = PAGE_W - INNER - OUTER

INK = colors.HexColor('#1b1917')
MUTED = colors.HexColor('#6b625a')
ACCENT = colors.HexColor('#7a2e1e')
RULE = colors.HexColor('#cfc5b8')
PAPER = colors.HexColor('#f6f1e8')

FONT_DIR = os.path.join(ROOT, 'fonts')
FONT_FILES = {
    'CrimsonText': 'CrimsonText-Regular.ttf',
    'CrimsonText-Italic': 'CrimsonText-Italic.ttf',
    'CrimsonText-Bold': 'CrimsonText-Bold.ttf',
    'CrimsonText-BoldItalic': 'CrimsonText-BoldItalic.ttf',
}
FONTS_OK = all(os.path.exists(os.path.join(FONT_DIR, f)) for f in FONT_FILES.values())

if FONTS_OK:
    # The text face is embedded, subset, and licensed for exactly this use: SIL OFL 1.1.
    # A printer will refuse an interior whose fonts are not embedded, and Times is not a
    # book face. Fall back to the base fourteen if the files are absent.
    from reportlab.pdfbase.ttfonts import TTFont
    for _name, _file in FONT_FILES.items():
        pdfmetrics.registerFont(TTFont(_name, os.path.join(FONT_DIR, _file)))
    pdfmetrics.registerFontFamily('CrimsonText', normal='CrimsonText',
                                  bold='CrimsonText-Bold', italic='CrimsonText-Italic',
                                  boldItalic='CrimsonText-BoldItalic')
    BODY, BODY_I, BOLD = 'CrimsonText', 'CrimsonText-Italic', 'CrimsonText-Bold'
else:
    BODY, BODY_I, BOLD = 'Times-Roman', 'Times-Italic', 'Times-Bold'

S = {}

# A paragraph that reports where it landed. The composer breaks lines greedily and
# hyphenates on request, so a bad break has to be found after the fact and fixed by
# re-setting that one paragraph: this records enough to find it again.
_REC = []            # (pid, page, y_bottom, y_top) for every paragraph part drawn
_NEXT_PID = [0]
_DRY = set()         # paragraphs to set without hyphenation
_DRY_STYLES = {}
_COND_BREAK = [0.95 * inch]   # how much air a heading needs under it; 0 disables the break


class TrackedParagraph(Paragraph):
    pid = None

    def __init__(self, text, style, pid=None, **kw):
        self.pid = pid
        Paragraph.__init__(self, text, style, **kw)

    def split(self, availWidth, availHeight):
        parts = Paragraph.split(self, availWidth, availHeight)
        for part in parts:
            part.pid = self.pid
        return parts

    def draw(self):
        if self.pid is not None:
            try:
                _x, y = self.canv.absolutePosition(0, 0)
                _REC.append((self.pid, self.canv.getPageNumber(), y, y + self.height))
            except Exception:
                pass
        Paragraph.draw(self)


def dry_style(style):
    """The same style with hyphenation switched off, cached per base style."""
    key = id(style)
    if key not in _DRY_STYLES:
        _DRY_STYLES[key] = ParagraphStyle(style.name + '-dry', parent=style,
                                          hyphenationLang='')
    return _DRY_STYLES[key]


def par(text, style, **kw):
    """A tracked paragraph, set without hyphenation if an earlier pass asked for it."""
    pid = _NEXT_PID[0]
    _NEXT_PID[0] += 1
    if pid in _DRY:
        style = dry_style(style)
    return TrackedParagraph(text, style, pid=pid, **kw)


def _roman(n):
    """1 -> 'i', 14 -> 'xiv'."""
    vals = [(1000, 'm'), (900, 'cm'), (500, 'd'), (400, 'cd'), (100, 'c'), (90, 'xc'),
            (50, 'l'), (40, 'xl'), (10, 'x'), (9, 'ix'), (5, 'v'), (4, 'iv'), (1, 'i')]
    out = ''
    for v, sym in vals:
        while n >= v:
            out += sym
            n -= v
    return out or 'i'


def styles():
    base = dict(fontName=BODY, fontSize=11.0, leading=15.0, textColor=INK,
                alignment=TA_JUSTIFY, hyphenationLang='en_US', embeddedHyphenation=1,
                spaceBefore=0, spaceAfter=0)
    S['body'] = ParagraphStyle('body', firstLineIndent=14, **base)
    S['first'] = ParagraphStyle('first', firstLineIndent=0, **base)
    S['quote'] = ParagraphStyle('quote', fontName=BODY_I, fontSize=10.4, leading=14.2,
                                leftIndent=22, rightIndent=12, spaceBefore=7, spaceAfter=7,
                                textColor=colors.HexColor('#3a332d'))
    S['cite'] = ParagraphStyle('cite', fontName=BODY, fontSize=8.8, leading=11.6, leftIndent=22,
                               spaceAfter=9, textColor=MUTED)
    S['h2'] = ParagraphStyle('h2', fontName=BOLD, fontSize=13.2, leading=16.4, spaceBefore=16,
                             spaceAfter=5, textColor=INK)
    S['h3'] = ParagraphStyle('h3', fontName=BODY_I, fontSize=11.6, leading=14.8, spaceAfter=2,
                             spaceBefore=13, textColor=INK)
    # a bold line on its own: a subhead inside a chapter, lighter than an h3
    S['h4'] = ParagraphStyle('h4', fontName=BOLD, fontSize=11.0, leading=14.6, spaceBefore=11,
                             spaceAfter=3.4, textColor=INK)
    S['bullet'] = ParagraphStyle('bullet', parent=S['body'], firstLineIndent=0, leftIndent=15,
                                 bulletIndent=4, spaceAfter=3)
    S['scene'] = ParagraphStyle('scene', fontName=BODY, fontSize=10, alignment=TA_CENTER,
                                textColor=MUTED, spaceBefore=11, spaceAfter=11)
    S['label'] = ParagraphStyle('label', fontName=BOLD, fontSize=7.6, leading=9.5,
                                textColor=ACCENT, spaceAfter=6)
    S['chaptitle'] = ParagraphStyle('chaptitle', fontName=BOLD, fontSize=21.5, leading=24.5,
                                    spaceBefore=2, spaceAfter=8, textColor=INK)
    S['lede'] = ParagraphStyle('lede', fontName=BODY_I, fontSize=11.2, leading=15.6,
                               textColor=colors.HexColor('#3a332d'), spaceAfter=14,
                               alignment=TA_LEFT)
    S['partlabel'] = ParagraphStyle('partlabel', fontName=BOLD, fontSize=8.4, leading=11,
                                    alignment=TA_CENTER, textColor=ACCENT, spaceAfter=14)
    S['parttitle'] = ParagraphStyle('parttitle', fontName=BOLD, fontSize=24.5, leading=27.5,
                                    alignment=TA_CENTER, textColor=INK, spaceAfter=18)
    S['partepi'] = ParagraphStyle('partepi', fontName=BODY_I, fontSize=11.2, leading=15.6,
                                  alignment=TA_CENTER, textColor=colors.HexColor('#3a332d'))
    S['partcite'] = ParagraphStyle('partcite', fontName=BODY, fontSize=8.2, leading=11,
                                   alignment=TA_CENTER, textColor=ACCENT, spaceBefore=4)
    S['partintro'] = ParagraphStyle('partintro', fontName=BODY_I, fontSize=11.2, leading=15.8,
                                    alignment=TA_LEFT, textColor=colors.HexColor('#4a423b'))
    # entries are set in the text face, not in bold: the numbers and the parts carry
    # the emphasis, and sixty bold lines in a row read as a price list
    S['toc1'] = ParagraphStyle('toc1', fontName=BODY, fontSize=10.2, leading=14.6, textColor=INK,
                               spaceBefore=5.4)
    S['toc2'] = ParagraphStyle('toc2', fontName=BODY, fontSize=10.1, leading=13.6, leftIndent=12,
                               textColor=INK)
    S['toc0'] = ParagraphStyle('toc0', fontName=BOLD, fontSize=8.5, leading=12.4, textColor=ACCENT,
                               spaceBefore=8)
    S['apstyle'] = ParagraphStyle('apstyle', fontName=BODY, fontSize=9.9, leading=13.2)
    S['aplabel'] = ParagraphStyle('aplabel', fontName=BOLD, fontSize=7.2, leading=9, textColor=ACCENT)
    S['tablehead'] = ParagraphStyle('tablehead', fontName=BOLD, fontSize=8, leading=10)
    S['tablecell'] = ParagraphStyle('tablecell', fontName=BODY, fontSize=8, leading=10.2)
    S['c_body'] = ParagraphStyle('c_body', firstLineIndent=10, fontName=BODY, fontSize=7.9,
                                 leading=9.9, textColor=INK, alignment=TA_JUSTIFY,
                                 hyphenationLang='en_US', embeddedHyphenation=1)
    S['c_first'] = ParagraphStyle('c_first', firstLineIndent=0, fontName=BODY, fontSize=7.9,
                                  leading=9.9, textColor=INK, alignment=TA_JUSTIFY,
                                  hyphenationLang='en_US', embeddedHyphenation=1)
    S['c_bullet'] = ParagraphStyle('c_bullet', fontName=BODY, fontSize=7.9, leading=9.9,
                                   leftIndent=12, bulletIndent=2, spaceAfter=1.2,
                                   alignment=TA_JUSTIFY, hyphenationLang='en_US')
    S['c_quote'] = ParagraphStyle('c_quote', fontName=BODY_I, fontSize=7.9, leading=9.8,
                                  leftIndent=14, spaceBefore=3, spaceAfter=3, textColor=colors.HexColor('#3a332d'))
    S['c_h2'] = ParagraphStyle('c_h2', fontName=BOLD, fontSize=8.8, leading=10.4,
                               spaceBefore=5, spaceAfter=1, textColor=INK)
    S['c_h3'] = ParagraphStyle('c_h3', fontName=BODY_I, fontSize=9, leading=11,
                               spaceBefore=6, spaceAfter=1, textColor=INK)
    S['c_scene'] = ParagraphStyle('c_scene', fontName=BODY, fontSize=8.4, alignment=TA_CENTER,
                                  textColor=MUTED, spaceBefore=4, spaceAfter=4)
    S['small'] = ParagraphStyle('small', fontName=BODY, fontSize=9.0, leading=12.0,
                                textColor=MUTED, alignment=TA_CENTER)
    S['cover_t'] = ParagraphStyle('cover_t', fontName=BOLD, fontSize=26, leading=29,
                                  alignment=TA_CENTER, textColor=colors.HexColor('#f0e7d6'))
    S['cover_s'] = ParagraphStyle('cover_s', fontName=BODY_I, fontSize=11, leading=14,
                                  alignment=TA_CENTER, textColor=colors.HexColor('#c4b7a0'))    # reportlab's default bullet face is Helvetica; keep every glyph in the book face
    for _st in S.values():
        if isinstance(_st, ParagraphStyle):
            _st.bulletFontName = BODY


class TocMark(Paragraph):
    """A paragraph that registers itself in the table of contents and the PDF outline."""

    def __init__(self, text, style, level=0, toc_text=None, key=None, outline_level=None):
        super().__init__(text, style)
        self.level, self.toc_text, self.key = level, toc_text or text, key
        self.outline_level = level if outline_level is None else outline_level


class FixedTOC(TableOfContents):
    """A contents page whose entries are supplied, not collected.

    reportlab's Contents always renders one pass behind: the numbers it prints come
    from the previous layout. Here the page numbers are already known (the document
    was laid out once with identical geometry), so the contents are laid out first
    time with the right folios and never re-collected.
    """

    def __init__(self, entries):
        super().__init__()
        self._notifyKind = '__precomputed__'
        self.addEntries(list(entries))
        self._fixed = list(self._entries)

    def beforeBuild(self):
        self._lastEntries = list(self._fixed)
        self._entries = list(self._fixed)

    def isSatisfied(self):
        return True


class BookDoc(BaseDocTemplate):
    """DocTemplate that turns TocMark paragraphs into contents entries and bookmarks."""

    folio = staticmethod(str)
    starts = None
    entries = None

    def afterFlowable(self, flowable):
        if isinstance(flowable, TocMark):
            page = self.page
            key = flowable.key or flowable.toc_text
            self.canv.bookmarkPage(key)
            try:
                self.canv.addOutlineEntry(re.sub(r'<[^>]+>', '', flowable.toc_text),
                                          key, level=flowable.outline_level, closed=False)
            except Exception:
                pass
            if self.starts is not None:
                self.starts[flowable.key] = page          # last pass wins
            if self.entries is not None:
                self.entries[(flowable.level, flowable.toc_text)] = (
                    flowable.level, flowable.toc_text, page, flowable.key)
            self.notify('TOCEntry', (flowable.level, flowable.toc_text, page))


def pdf_inline(t):
    """Markdown inline -> reportlab mini-HTML."""
    h = B.inline(t)
    h = h.replace('<strong>', '<b>').replace('</strong>', '</b>')
    h = h.replace('<em>', '<i>').replace('</em>', '</i>')
    h = re.sub(r'<code>(.*?)</code>', r'<font face="Courier">\1</font>', h)
    # an index page number is written as {{p163|163}} so that it survives escaping and
    # becomes a real internal link; any other anchor keeps its words and loses its target
    h = re.sub(r'<a [^>]*>(.*?)</a>', r'\1', h)   # a web link keeps its words, not its target
    return h


def cells(row):
    return [c.strip() for c in row.strip().strip('|').split('|')]


def make_table(rows):
    head, data = rows[0], rows[1:]
    tdata = [[Paragraph(pdf_inline(c), S['tablehead']) for c in head]]
    for r in data:
        tdata.append([Paragraph(pdf_inline(c), S['tablecell']) for c in r])
    widths = [CW * w for w in _widths(len(head))]
    t = Table(tdata, colWidths=widths, repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 3),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('LINEBELOW', (0, 0), (-1, 0), 0.6, INK),
        ('LINEBELOW', (0, 1), (-1, -1), 0.25, RULE),
        ('LINEBELOW', (0, -1), (-1, -1), 0.6, INK),
    ]))
    return t


def _widths(n):
    if n == 2:
        return [0.3, 0.7]
    if n == 3:
        return [0.22, 0.4, 0.38]
    if n == 4:
        return [0.16, 0.28, 0.28, 0.28]
    return [1.0 / n] * n


def apparatus(doc_slug):
    ap = B.APPARATUS_DATA.get(doc_slug)
    if not ap:
        return []
    data = [[Paragraph('THE POINT', S['aplabel']), Paragraph(pdf_inline(ap['point']), S['apstyle'])],
            [Paragraph('DO THIS', S['aplabel']), Paragraph(pdf_inline(ap['do']), S['apstyle'])],
            [Paragraph('WHAT THIS SETS UP', S['aplabel']), Paragraph(pdf_inline(ap['next']), S['apstyle'])]]
    t = Table(data, colWidths=[0.9 * inch, CW - 0.9 * inch], hAlign='LEFT')
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BACKGROUND', (0, 0), (-1, -1), PAPER),
        ('LINEABOVE', (0, 0), (-1, 0), 0.8, INK),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('LINEBELOW', (0, -1), (-1, -1), 0.6, INK),
    ]))
    return [Spacer(1, 16), t]


def story_for(body):
    """Convert a markdown body into flowables."""
    out, i = [], 0
    lines = body.split('\n')
    prev_open = True   # previous paragraph was a heading/quote/scene: no indent
    while i < len(lines):
        s = lines[i].strip()
        if not s:
            i += 1
            continue
        if s == '::scene':
            out.append(Paragraph('· · ·', S['scene']))
            prev_open = True
            i += 1
            continue
        m = re.match(r'^(#{2,4})\s+(.*)$', s)
        if m:
            style = S['h2'] if len(m.group(1)) <= 2 else S['h3']
            # a heading may not sit at the foot of a page with nothing under it: four
            # lines of air before it, or it starts the next page
            out.append(CondPageBreak(_COND_BREAK[0]))
            out.append(Paragraph(pdf_inline(m.group(2)), style))
            prev_open = True
            i += 1
            continue
        bold_head = re.fullmatch(r'\*\*([^*]{2,140})\*\*', s)
        if bold_head:
            # ninety-two lines in this book are a bold sentence standing alone: a subhead
            out.append(CondPageBreak(_COND_BREAK[0]))
            out.append(Paragraph(pdf_inline('**' + bold_head.group(1) + '**'), S['h4']))
            prev_open = True
            i += 1
            continue
        if s.startswith('<div class="thesis">'):
            buf = []
            i += 1
            while i < len(lines) and '</div>' not in lines[i]:
                buf.append(lines[i].strip())
                i += 1
            i += 1
            txt = re.sub(r'</?p>', '', ' '.join(buf)).strip()
            t = Table([[Paragraph(pdf_inline(txt), ParagraphStyle(
                'thesis', parent=S['body'], fontName=BOLD, fontSize=11.8, leading=15.2,
                firstLineIndent=0, alignment=TA_LEFT))]],
                colWidths=[CW], hAlign='LEFT')
            t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), PAPER),
                                   ('LINEBEFORE', (0, 0), (0, -1), 2.4, ACCENT),
                                   ('LEFTPADDING', (0, 0), (-1, -1), 10),
                                   ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                                   ('TOPPADDING', (0, 0), (-1, -1), 9),
                                   ('BOTTOMPADDING', (0, 0), (-1, -1), 9)]))
            out += [Spacer(1, 6), t, Spacer(1, 6)]
            prev_open = True
            continue
        if s.startswith('<'):
            # raw HTML (cite lines, images) — keep the text, drop the tags
            buf = []
            while i < len(lines) and lines[i].strip():
                buf.append(lines[i])
                i += 1
            txt = ' '.join(buf)
            txt = re.sub(r'<cite[^>]*>', '', txt).replace('</cite>', '')
            txt = re.sub(r'<[^>]+>', '', txt).strip()
            if txt:
                out.append(par(pdf_inline(txt), S['cite']))
            prev_open = True
            continue
        if s.startswith('>'):
            buf = []
            while i < len(lines) and lines[i].strip().startswith('>'):
                buf.append(re.sub(r'^\s*>\s?', '', lines[i]))
                i += 1
            out.append(par(pdf_inline(' '.join(buf)), S['quote']))
            prev_open = True
            continue
        if re.match(r'^([-*+])\s+', s):
            while i < len(lines) and re.match(r'^\s*([-*+])\s+', lines[i]):
                item = re.sub(r'^\s*([-*+])\s+', '', lines[i])
                out.append(par(pdf_inline(item), S['bullet'], bulletText='•'))
                i += 1
            prev_open = True
            continue
        if re.match(r'^\d+[.)]\s+', s):
            n = 1
            while i < len(lines) and re.match(r'^\s*\d+[.)]\s+', lines[i]):
                item = re.sub(r'^\s*\d+[.)]\s+', '', lines[i])
                out.append(par(pdf_inline(item), S['bullet'], bulletText=f'{n}.'))
                n += 1
                i += 1
            prev_open = True
            continue
        if s.startswith('|') and i + 1 < len(lines) and re.match(r'^\|[\s:|-]+\|$', lines[i + 1].strip()):
            rows = [cells(s)]
            i += 2
            while i < len(lines) and lines[i].strip().startswith('|'):
                rows.append(cells(lines[i]))
                i += 1
            out.append(Spacer(1, 5))
            out.append(make_table(rows))
            out.append(Spacer(1, 7))
            prev_open = True
            continue
        # paragraph
        buf = []
        while i < len(lines) and lines[i].strip() and not re.match(
                r'^(#{2,4}\s|>|\||::scene|<|\s*([-*+]|\d+[.)])\s+)', lines[i].strip()):
            buf.append(lines[i].strip())
            i += 1
        style = S['first'] if prev_open else S['body']
        out.append(par(pdf_inline(' '.join(buf)), style))
        prev_open = False
    return out


def build_pdf(out_path=OUT, index_override=None, headmap=None, offset=0, recto=(),
              toc_entries=None, starts=None, colophon_page=None, dry=()):
    os.makedirs(DIST, exist_ok=True)
    styles()
    _REC.clear()
    _NEXT_PID[0] = 0
    _DRY.clear()
    _DRY.update(dry)

    def folio(page):
        """The number printed on the page: roman in the front matter, arabic from chapter one."""
        if offset and page <= offset:
            return _roman(page)
        return str(page - offset)
    docs = B.collect()
    if index_override is None:
        idx = B.build_index_doc(docs)
        if idx:
            docs.append(idx)
        tidx = B.build_terms_index(docs)
        if tidx:
            docs.append(tidx)
    else:
        idx, tidx = index_override
        if idx:
            docs.append(idx)
        if tidx:
            docs.append(tidx)

    doc = BookDoc(out_path, pagesize=(PAGE_W, PAGE_H), leftMargin=INNER, rightMargin=OUTER,
                          topMargin=MT, bottomMargin=MB, title=B.META['title'],
                          author=B.META['author'], subject=B.META['description'],
                          keywords=B.META['keywords'], creator='book/make-pdf.py')
    doc.folio = folio
    doc.starts = {}
    doc.entries = {}
    recto = set(recto)

    def parity_of(slug, default=1):
        """Which side of the spread a section opens on, taken from the previous layout."""
        return 'r' if (starts or {}).get(slug, default) % 2 else 'v'

    def opening(slug, kind='opening'):
        """Open a section, mirrored: a blank verso is inserted when the part needs one."""
        template = kind + '_' + parity_of(slug)
        if slug in recto:
            return [NextPageTemplate('blank'), PageBreak(), Spacer(1, 1),
                    NextPageTemplate(template), PageBreak()]
        return [NextPageTemplate(template), PageBreak()]
    def text_center(d):
        """Running heads and folios sit on the text block, not the page."""
        return (INNER if d.pageTemplate.id.endswith('_r') else OUTER) + CW / 2

    def head_footer(canv, d):
        canv.saveState()
        page = canv.getPageNumber()
        front = offset and page <= offset
        cx = text_center(d)
        canv.setFont(BODY, 7.4)
        canv.setFillColor(MUTED)
        if not front:                         # no running head in the front matter
            left = ' '.join(B.META['title'].upper())
            right = ''
            if headmap and page in headmap:
                clean = re.sub(r'^\d+\.\s*', '', re.sub(r'<[^>]+>', '', headmap[page]))
                right = ' '.join(clean.upper())
            if right and page % 2 == 1:       # recto: the chapter
                canv.drawCentredString(cx, PAGE_H - 0.5 * inch, right)
            else:                             # verso: the book
                canv.drawCentredString(cx, PAGE_H - 0.5 * inch, left)
        canv.setFont(BODY, 8.8)
        canv.drawCentredString(cx, 0.45 * inch, folio(page))
        canv.restoreState()
        anchor(canv)

    def anchor(canv):
        """Name the page by the number it prints, so an index entry can point at it."""
        canv.bookmarkPage('p' + folio(canv.getPageNumber()))

    def blank(canv, d):
        # name the book face on every page, so no page carries a base-14 font
        canv.setFont(BODY, 8)
        anchor(canv)

    def number_only(canv, d):
        canv.saveState()
        canv.setFont(BODY, 8.8)
        canv.setFillColor(MUTED)
        canv.drawCentredString(text_center(d), 0.45 * inch, folio(canv.getPageNumber()))
        canv.restoreState()
        anchor(canv)

    frame_r = Frame(INNER, MB, CW, PAGE_H - MT - MB, id='fr', leftPadding=0, rightPadding=0,
                    topPadding=0, bottomPadding=0)
    # the half-title, title page and copyright page are centred on the *page*, as they are
    # in a printed book: the gutter matters for reading columns, not for a display page
    page_x = (PAGE_W - CW) / 2.0
    frame_c = Frame(page_x, MB, CW, PAGE_H - MT - MB, id='fc', leftPadding=0, rightPadding=0,
                    topPadding=0, bottomPadding=0)
    frame_v = Frame(OUTER, MB, CW, PAGE_H - MT - MB, id='fv', leftPadding=0, rightPadding=0,
                    topPadding=0, bottomPadding=0)
    cover_frame = Frame(0, 0, PAGE_W, PAGE_H, id='cframe', leftPadding=0, rightPadding=0,
                        topPadding=0, bottomPadding=0)
    doc.addPageTemplates([
        # cover -> half-title (verso), then the front matter alternates by itself
        PageTemplate(id='cover', frames=[cover_frame], onPage=blank,
                     autoNextPageTemplate='front_v'),
        PageTemplate(id='front_r', frames=[frame_c], onPage=blank,
                     autoNextPageTemplate='front_v'),
        PageTemplate(id='front_v', frames=[frame_c], onPage=blank,
                     autoNextPageTemplate='front_r'),
        PageTemplate(id='plain_r', frames=[frame_r], onPage=blank,
                     autoNextPageTemplate='plain_v'),
        PageTemplate(id='plain_v', frames=[frame_v], onPage=blank,
                     autoNextPageTemplate='plain_r'),
        PageTemplate(id='opening_r', frames=[frame_r], onPage=number_only,
                     autoNextPageTemplate='body_v'),
        PageTemplate(id='opening_v', frames=[frame_v], onPage=number_only,
                     autoNextPageTemplate='body_r'),
        PageTemplate(id='body_r', frames=[frame_r], onPage=head_footer,
                     autoNextPageTemplate='body_v'),
        PageTemplate(id='body_v', frames=[frame_v], onPage=head_footer,
                     autoNextPageTemplate='body_r'),
        PageTemplate(id='blank', frames=[frame_r], onPage=blank,
                     autoNextPageTemplate='body_v'),
    ])

    story = []

    # ---- cover (full bleed page) ----
    if os.path.exists(COVER):
        story += [Image(COVER, width=PAGE_W, height=PAGE_H), PageBreak()]

    # ---- half-title (recto) ----
    story += [
        Spacer(1, 2.7 * inch),
        Paragraph(' '.join('THE HIDDEN AND THE MANIFEST'),
                  ParagraphStyle('ht', fontName=BODY, fontSize=9.4, leading=13,
                                 alignment=TA_CENTER, textColor=MUTED)),
        Spacer(1, 14),
        Paragraph('<font color="#7a2e1e">\u2014\u2014\u2014</font>',
                  ParagraphStyle('htr', fontName=BODY, alignment=TA_CENTER, fontSize=8)),
        PageBreak(),
    ]

    # ---- title page ----
    story += [
        Spacer(1, 1.05 * inch),
        Paragraph('A THEOLOGICAL RESEARCH PROJECT',
                  ParagraphStyle('k', fontName=BODY, fontSize=8.4, alignment=TA_CENTER,
                                 textColor=ACCENT, leading=12)),
        Spacer(1, 22),
        Paragraph('THE HIDDEN<br/>AND THE MANIFEST',
                  ParagraphStyle('t2', fontName=BOLD, fontSize=26.5, leading=31,
                                 alignment=TA_CENTER, textColor=INK)),
        Spacer(1, 16),
        Paragraph('<font color="#7a2e1e">———</font>',
                  ParagraphStyle('r', fontName=BODY, alignment=TA_CENTER, fontSize=8)),
        Spacer(1, 16),
        Paragraph(B.META['subtitle'],
                  ParagraphStyle('sub', fontName=BODY_I, fontSize=11.6, leading=15.6,
                                 alignment=TA_CENTER, textColor=colors.HexColor('#3a332d'))),
        Spacer(1, 46),
        Paragraph(B.META['author'].upper(),
                  ParagraphStyle('by', fontName=BODY, fontSize=8.6, alignment=TA_CENTER,
                                 textColor=MUTED)),
        Spacer(1, 7),
        Paragraph(B.META['edition'].upper(),
                  ParagraphStyle('yr', fontName=BODY, fontSize=8.4, alignment=TA_CENTER,
                                 textColor=MUTED)),
        PageBreak(),
    ]

    # ---- copyright page (verso of the title page) ----
    imp_label = ParagraphStyle('impl', fontName=BOLD, fontSize=6.6, leading=9.8, textColor=ACCENT,
                               spaceBefore=0, spaceAfter=0)
    imp_text = ParagraphStyle('impt', fontName=BODY, fontSize=7.5, leading=10.2, textColor=MUTED,
                              spaceBefore=0, spaceAfter=0)
    rows = [[Paragraph(k.upper(), imp_label), Paragraph(pdf_inline(v), imp_text)]
            for k, v in B.COPYRIGHT_ROWS]
    copy_tbl = Table(rows, colWidths=[0.92 * inch, CW - 0.92 * inch], hAlign='LEFT')
    copy_tbl.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (0, -1), 8),
        ('RIGHTPADDING', (1, 0), (1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LINEABOVE', (0, 0), (-1, 0), 0.6, RULE),
        ('LEFTPADDING', (0, 0), (-1, 0), 0),
        ('TOPPADDING', (0, 0), (-1, 0), 7),
    ]))
    story += [Spacer(1, 2.35 * inch), copy_tbl, PageBreak()]

    # ---- contents ----
    toc = FixedTOC(toc_entries) if toc_entries else TableOfContents()
    toc.levelStyles = [S['toc0'], S['toc1'], S['toc2']]
    toc.dotsMinLevel = 0
    toc.formatter = folio          # roman in the front matter, arabic in the body
    story += [Paragraph('CONTENTS',
                        ParagraphStyle('ct', fontName=BOLD, fontSize=8.6, textColor=ACCENT,
                                       alignment=TA_CENTER, spaceAfter=16)),
              toc]

    chnum = 0
    for d in docs:
        kind, title, slug = d['kind'], d['title'], d['slug']

        if kind == 'part':
            story += opening(slug, 'plain')
            story.append(Spacer(1, 1.4 * inch))
            story.append(Paragraph(d['meta'].get('label', 'Part').upper(), S['partlabel']))
            story.append(TocMark(title, S['parttitle'], level=0, key=slug,
                                 toc_text=f"{d['meta'].get('label', 'Part')} \u00b7 {title}"))
            epi = d['meta'].get('epigraph', '')
            if epi:
                text, _, src = epi.partition('|')
                story.append(Spacer(1, 10))
                story.append(Paragraph(f'\u201c{pdf_inline(text.strip())}\u201d', S['partepi']))
                story.append(Paragraph(src.strip().upper(), S['partcite']))
                story.append(Spacer(1, 26))
            story.append(Paragraph(pdf_inline(d['body']), S['partintro']))
            continue

        if kind == 'front':
            story += opening(slug)
            if slug == '00-epigraphs':
                story.append(Spacer(1, 1.1 * inch))
                story += stories_epigraphs(d['body'])
                continue
            story.append(TocMark(title, S['chaptitle'], level=1, key=slug, outline_level=0))
            story += story_for(d['body'])
            continue

        if kind == 'appendix':
            story += opening(slug)
            m = re.match(r'apx([A-Z])', slug)
            story.append(Paragraph(f'APPENDIX {m.group(1)}' if m else 'APPENDIX', S['label']))
            appx = f'Appendix {m.group(1)}' if m else 'Appendix'
            story.append(TocMark(title, S['chaptitle'], level=1, key=slug,
                                 toc_text=f'{appx} \u00b7 {title}'))
            if d['lede']:
                story.append(Paragraph(pdf_inline(d['lede']), S['lede']))
            if slug == 'apxB':
                keep = {k: S[k] for k in ('body', 'first', 'bullet', 'quote', 'h2', 'h3', 'scene')}
                S['body'], S['first'], S['bullet'] = S['c_body'], S['c_first'], S['c_bullet']
                S['quote'], S['h2'], S['h3'], S['scene'] = S['c_quote'], S['c_h2'], S['c_h3'], S['c_scene']
                story += story_for(d['body'])
                S.update(keep)
            elif slug in ('apxG', 'apxH'):
                # the note at the head of an index is ordinary prose; the entries hang,
                # the first line outdenting and the run-over lines aligning under the entry
                head, _sep, body = d['body'].partition('\n\n')
                story += story_for(head)
                keep = {k: S[k] for k in ('body', 'first')}
                for k in ('body', 'first'):
                    S[k] = ParagraphStyle('idx_' + k, parent=S[k], leftIndent=13,
                                          firstLineIndent=-13, spaceAfter=2.2)
                story += story_for(body)
                S.update(keep)
            else:
                story += story_for(d['body'])
            continue

        # chapter
        chnum += 1
        story += opening(slug)
        story.append(Paragraph(f'CHAPTER {chnum}', S['label']))
        story.append(TocMark(title, S['chaptitle'], level=1, key=slug,
                             toc_text=f'{chnum}. {title}'))
        if d['lede']:
            story.append(Paragraph(pdf_inline(d['lede']), S['lede']))
        story += story_for(d['body'])
        story += apparatus(slug)

    # ---- colophon ----
    story += [
        NextPageTemplate('plain_' + ('r' if (colophon_page or 1) % 2 else 'v')),
        PageBreak(), Spacer(1, 3.1 * inch),
        Paragraph('COLOPHON', ParagraphStyle('col', fontName=BOLD, fontSize=7.4,
                                             alignment=TA_CENTER, textColor=ACCENT, spaceAfter=12)),
    ]
    for line in B.COLOPHON:
        story.append(Paragraph(pdf_inline(line.replace('{words:,}', f'{B.wordcount(B.collect()):,}')),
                               S['small']))

    doc.multiBuild(story)
    build_pdf.last_page = doc.page
    build_pdf.last_starts = list(doc.starts.items())
    build_pdf.last_entries = list(doc.entries.values())
    print('wrote', out_path, '\u2014', doc.page, 'pages')
    return out_path


def print_interior(src, dst, offset):
    """The file an offset printer wants: the pages between the boards, no cover.

    The reading edition opens on the cover, which is right for a reader and wrong for a
    printer — a cover is printed on a different stock, as a different sheet, from a
    different file. This takes the pages after the cover, keeps every bookmark and
    internal link, carries the same roman-then-arabic page labels, and pads to an even
    count so the last leaf is not a recto on its own.
    """
    import pymupdf
    d = pymupdf.open(src)
    out = pymupdf.open()
    out.insert_pdf(d, from_page=1, to_page=d.page_count - 1)
    if out.page_count % 2:
        out.new_page(-1, width=d[0].rect.width, height=d[0].rect.height)

    out.set_metadata(d.metadata)
    try:
        xmp = d.get_xml_metadata()
        if xmp:
            out.set_xml_metadata(xmp)
    except Exception as exc:
        print('print xmp:', exc)
    try:
        toc = [[lvl, title, page - 1] for lvl, title, page in d.get_toc() if page > 1]
        out.set_toc(toc)
    except Exception as exc:
        print('print outline:', exc)
    try:
        out.set_page_labels([
            {'startpage': 0, 'prefix': '', 'style': 'r', 'firstpagenum': 1},
            {'startpage': offset - 1, 'prefix': '', 'style': 'D', 'firstpagenum': 1},
        ])
    except Exception as exc:
        print('print page labels:', exc)
    out.save(dst, garbage=4, deflate=True)
    out.close()
    d.close()
    return pymupdf.open(dst).page_count


def fold_report(out_path):
    import json
    rep_path = os.path.join(DIST, 'build-report.json')
    try:
        rep = json.load(open(rep_path))
    except Exception:
        rep = {}
    try:
        import pymupdf
        rep['pdf_pages'] = pymupdf.open(out_path).page_count
        rep['interior_pages'] = pymupdf.open(INTERIOR).page_count
    except Exception:
        pass
    rep['pdf'] = 'dist/the-hidden-and-the-manifest.pdf'
    rep['pdf_size_kb'] = round(os.path.getsize(out_path) / 1024)
    json.dump(rep, open(rep_path, 'w'), indent=2)
    print(json.dumps(rep, indent=2))


def _md_bold_to_html(t):
    return ' '.join(t.split())


def stories_epigraphs(body):
    out = []
    for part in body.split('\n\n'):
        p = part.strip()
        if not p or p == '::scene':
            continue
        if p.startswith('>'):
            txt = re.sub(r"^>\s?", "", p)
            out.append(Paragraph('\u201c' + pdf_inline(txt) + '\u201d', S['partepi']))
        elif p.startswith('<cite>'):
            txt = re.sub(r'</?cite>', '', p)
            out.append(Paragraph(pdf_inline(txt).upper(),
                                 ParagraphStyle('ec', parent=S['partcite'], spaceAfter=18)))
        else:
            out.append(Paragraph(pdf_inline(p), ParagraphStyle('ei', fontName=BODY_I, fontSize=9.6,
                                                               leading=13, alignment=TA_CENTER,
                                                               textColor=colors.HexColor('#4a423b'))))
    return out


def _compress(pages):
    """[96,97,98,110] -> '96-98, 110'"""
    out, i = [], 0
    pages = sorted(set(pages))
    while i < len(pages):
        j = i
        while j + 1 < len(pages) and pages[j + 1] == pages[j] + 1:
            j += 1
        out.append(str(pages[i]) if j == i else f'{pages[i]}\u2013{pages[j]}')
        i = j + 1
    return ', '.join(out)


def first_chapter_page(pdf_path):
    """First page of the body: the opening part page, or chapter one if there is none.

    Everything before it is front matter and takes roman numerals; everything from
    it onwards takes arabic folios starting at 1.
    """
    import pymupdf
    d = pymupdf.open(pdf_path)
    pages = [page for _lvl, title, page in d.get_toc()
             if re.match(r'^\d+\. ', title) or title.startswith('Part ')]
    return min(pages) if pages else 1


def page_indexed_docs(pdf_path, offset=0):
    """Recompute appendices G and H with page numbers taken from a built PDF."""
    # numbers written into the text are the *printed* folios, so subtract the
    # front-matter offset that the second pass will apply.
    def shown(p):
        return max(1, p - offset)
    import pymupdf
    d = pymupdf.open(pdf_path)
    toc = d.get_toc()

    def page_of(prefix):
        for _lvl, title, page in toc:
            if title.startswith(prefix):
                return page
        return None

    first_ch = page_of('1. ')
    first_apx = page_of('Appendix A')
    if first_ch is None or first_apx is None:
        return None
    pages = []
    for i in range(first_ch - 1, first_apx - 1):
        t = d[i].get_text()
        t = re.sub(r'-\s*\n\s*', '', t)
        t = re.sub(r'\s+', ' ', t)
        pages.append((i + 1, t))

    # scripture
    names = sorted(B.ALIASES.keys(), key=len, reverse=True)
    pat = re.compile(r'(?<![A-Za-z0-9])(' + '|'.join(re.escape(n) for n in names) +
                     r')\.?\s+(\d{1,3})(?::(\d{1,3})(?:[\u2013-](\d{1,3}))?)?')
    ref_pages = {}
    for pno, text in pages:
        for m in pat.finditer(text):
            ab = B.ALIASES[m.group(1)]
            ref = m.group(2)
            if m.group(3):
                ref += ':' + m.group(3)
                if m.group(4):
                    ref += '\u2013' + m.group(4)
            ref_pages.setdefault((ab, ref), set()).add(pno)

    lines = ['The references are given as they appear in the text; the numbers are **pages of this edition**.', '']
    for ab, full in B.CANON:
        items = sorted(((r, p) for (b, r), p in ref_pages.items() if b == ab),
                       key=lambda kv: B._refkey(kv[0]))
        if not items:
            continue
        body = '; '.join(f'{r} ({_compress(sorted(shown(x) for x in p))})' for r, p in items)
        lines += [f'**{full}** \u2014 {body}', '']
    g = {
        'file': 'apxG.md', 'slug': 'apxG', 'kind': 'appendix',
        'title': 'Index of Citations',
        'lede': 'Every scriptural reference in the book, by book and page.',
        'part': '', 'meta': {'title': 'Index of Citations'}, 'body': '\n'.join(lines),
    }

    # terms
    tlines = ['The numbers are pages of this edition. A term that recurs on more than twenty pages is marked *passim*.', '']
    for label, pats in sorted(B.TERMS, key=lambda t: t[0]):
        hits = []
        for pno, text in pages:
            low = text.lower()
            for pat in pats:
                if re.search(r'(?<![A-Za-z])' + re.escape(pat.lower()) + r'(?![A-Za-z])', low):
                    hits.append(pno)
                    break
        if not hits:
            continue
        hits = sorted(set(shown(h) for h in hits))
        span = _compress(hits[:14]) + (', passim' if len(hits) > 14 else '')
        tlines += [f'**{label}** \u2014 {span}', '']
    h = {
        'file': 'apxH.md', 'slug': 'apxH', 'kind': 'appendix',
        'title': 'Index of Names and Terms',
        'lede': 'Where the book treats each of the figures and ideas it argues with, by page.',
        'part': '', 'meta': {'title': 'Index of Names and Terms'}, 'body': '\n'.join(tlines),
    }
    return g, h




# ---------------------------------------------------------------- triage card

def build_triage_card():
    """A standalone, letter-size photocopy master of Appendix B."""
    from reportlab.lib.pagesizes import letter
    styles()
    body = next(d for d in B.collect() if d['slug'] == 'apxB')

    W, H = letter
    ml = mr = 0.8 * inch
    mt, mb = 0.7 * inch, 0.6 * inch
    frame = Frame(ml, mb, W - ml - mr, H - mt - mb, id='card',
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)

    def chrome(canv, d):
        canv.saveState()
        canv.setFont(BODY, 7.4)
        canv.setFillColor(MUTED)
        canv.drawString(ml, H - 0.45 * inch, 'THE HIDDEN AND THE MANIFEST  \u00b7  PASTORAL TRIAGE CARD')
        canv.drawRightString(W - mr, H - 0.45 * inch, 'FREE TO COPY')
        canv.setStrokeColor(RULE)
        canv.setLineWidth(0.5)
        canv.line(ml, H - 0.52 * inch, W - mr, H - 0.52 * inch)
        canv.line(ml, mb - 0.14 * inch, W - mr, mb - 0.14 * inch)
        canv.setFont(BODY, 7.2)
        canv.setFillColor(MUTED)
        canv.drawString(ml, mb - 0.32 * inch,
                        'From The Hidden and the Manifest \u2014 not a substitute for a trained director, a confessor, or a clinician.')
        canv.drawRightString(W - mr, mb - 0.32 * inch, 'MMXXVI')
        canv.restoreState()

    doc = BaseDocTemplate(os.path.join(DIST, 'triage-card.pdf'), pagesize=letter,
                          leftMargin=ml, rightMargin=mr, topMargin=mt, bottomMargin=mb,
                          title='Pastoral Triage Card', author=B.META['author'],
                          subject='A one-page triage card from The Hidden and the Manifest')
    doc.addPageTemplates([PageTemplate(id='card', frames=[frame], onPage=chrome)])

    # generous size for photocopying, but on one page
    keep = {k: S[k] for k in ('body', 'first', 'bullet', 'quote', 'h2', 'h3', 'h4', 'scene',
                              'chaptitle', 'lede', 'label')}
    S['body'] = ParagraphStyle('tb', fontName=BODY, fontSize=10.9, leading=13.9, textColor=INK,
                               alignment=TA_JUSTIFY, hyphenationLang='en_US', firstLineIndent=11)
    S['first'] = ParagraphStyle('tf', parent=S['body'], firstLineIndent=0)
    S['bullet'] = ParagraphStyle('tbu', parent=S['body'], firstLineIndent=0, leftIndent=13,
                                 bulletIndent=2, spaceAfter=2)
    S['quote'] = ParagraphStyle('tq', parent=S['body'], fontName=BODY_I, leftIndent=16, spaceBefore=3, spaceAfter=3)
    S['h2'] = ParagraphStyle('th2', fontName=BOLD, fontSize=12.2, leading=14.6, spaceBefore=10,
                             spaceAfter=2, textColor=INK)
    S['chaptitle'] = ParagraphStyle('tt', fontName=BOLD, fontSize=22, leading=25, spaceAfter=6)
    S['lede'] = ParagraphStyle('tl', fontName=BODY_I, fontSize=11, leading=14, spaceAfter=10,
                               textColor=colors.HexColor('#3a332d'))
    S['h4'] = ParagraphStyle('th4', fontName=BOLD, fontSize=11.3, leading=13.4, spaceBefore=6.5,
                             spaceAfter=1.4, textColor=INK)
    # a card cannot run to two pages, so no heading here is allowed to push the frame
    _COND_BREAK[0] = 0

    story = [Paragraph('THE TRIAGE CARD', S['label']),
             Paragraph('Pastoral Triage Card', S['chaptitle']),
             Paragraph(pdf_inline(body['lede']), S['lede'])]
    story += story_for(body['body'].split('\n', 1)[1] if body['body'].startswith('**Two questions') else body['body'])
    doc.build(story)
    S.update(keep)
    _COND_BREAK[0] = 0.95 * inch
    print('wrote', os.path.join(DIST, 'triage-card.pdf'))
    return os.path.join(DIST, 'triage-card.pdf')

def head_map(pdf_path):
    """page -> chapter title, taken from a laid-out PDF."""
    import pymupdf
    d = pymupdf.open(pdf_path)
    marks = []
    for lvl, title, page in d.get_toc():
        if re.match(r'^\d+\. ', title) or title.startswith('Appendix '):
            marks.append((page, title))
    if not marks:
        return {}
    marks.sort()
    out = {}
    for i, (page, title) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else d.page_count
        if title.startswith('Appendix ') and 'Index of Citations' in title:
            end = min(end, d.page_count)
        for p in range(page, end + 1):
            out[p] = title
    return out


def ladder_pages(path, start=30):
    """Pages that carry three or more hyphenated line-ends in a row, with the y of the
    middle line. Three in a row is a ladder: the eye follows the hyphens down the page
    instead of the sentence, and a compositor is expected to break the run."""
    import pymupdf
    d = pymupdf.open(path)
    H = d[0].rect.height
    found = []
    for i in range(start, d.page_count):
        lines = []
        for b in d[i].get_text('dict')['blocks']:
            for ln in b.get('lines', []):
                text = ''.join(sp['text'] for sp in ln['spans']).strip()
                if len(text) > 30:
                    lines.append((ln['bbox'], text))
        run = []
        for (x0, y0, x1, y1), text in lines:
            if re.search(r'[a-z]-\s*$', text):
                run.append((y0, y1))
            else:
                if len(run) >= 3:
                    mid = run[len(run) // 2]
                    found.append((i + 1, H - (mid[0] + mid[1]) / 2.0))
                run = []
        if len(run) >= 3:
            mid = run[len(run) // 2]
            found.append((i + 1, H - (mid[0] + mid[1]) / 2.0))
    d.close()
    return found


def ladder_fixes(path):
    """Which paragraphs to set without hyphenation, given where the ladders landed."""
    fixes = set()
    for page, y in ladder_pages(path):
        best, span = None, 0.0
        for pid, pno, y0, y1 in _REC:
            if pno != page or not (y0 - 1 <= y <= y1 + 1):
                continue
            overlap = min(y1, y + 2) - max(y0, y - 2)
            if overlap > span:
                best, span = pid, overlap
        if best is not None:
            fixes.add(best)
    return fixes


def link_index(path, offset=0):
    """Turn the page numbers an index prints into doors to the pages they name.

    An index in a digital edition is only as good as its jumps, so the numbers are
    linked after the pages are laid out, when every folio is known: a citation index
    links what stands inside its parentheses, a names index links what follows the
    dash that ends each entry, and both are given, one by one, the page they cite.
    """
    import pymupdf
    d = pymupdf.open(path)
    H, W = d[0].rect.height, d[0].rect.width
    g = h = None
    for _lvl, title, page in d.get_toc():
        if title.startswith('Appendix G'):
            g = page
        elif title.startswith('Appendix H'):
            h = page
    if not g or not h:
        d.close()
        return 0

    def plain(word):
        digits = re.match(r'^(\d{1,3})', word.strip('(,;:)'))
        return int(digits.group(1)) if digits else None

    added = 0
    for pno in range(g - 1, d.page_count):
        page = d[pno]
        citations = pno < h - 1                 # appendix G: the numbers in brackets
        words = [w for w in page.get_text('words')
                 if w[1] > 60 and w[3] < H - 55 and w[0] > 40]
        words.sort(key=lambda w: (round(w[1], 1), w[0]))
        depth = 0
        after_dash = False
        for x0, y0, x1, y1, text, *_ in words:
            if not citations and not after_dash and x0 < INNER + 8:
                after_dash = False               # a new entry starts at the margin
            if citations:
                n = plain(text)
                inside = depth > 0 or text.startswith('(')
                depth += text.count('(') - text.count(')')
                if n is None or not inside:
                    continue
            else:
                if text.strip() in ('\u2014', '\u2013'):
                    after_dash = True
                    continue
                if not after_dash:
                    continue
                n = plain(text)
                if n is None:
                    continue
            target = min(n + offset, d.page_count - 1)
            if target <= 0:
                continue
            page.insert_link({'kind': 1, 'from': pymupdf.Rect(x0 - 0.6, y0 - 1.2, x1 + 0.6, y1 + 1.2),
                              'page': target - 1, 'to': pymupdf.Point(0, 0)})
            added += 1
    tmp = path + '.links'
    d.save(tmp, garbage=3, deflate=True)
    d.close()
    os.replace(tmp, path)
    return added


def stamp_metadata(path, offset=30):
    """Write real PDF metadata: document info, XMP, catalogue language, viewer prefs."""
    import pymupdf
    d = pymupdf.open(path)
    d.set_metadata({
        'title': B.META['title'] + ': ' + B.META['subtitle'],
        'author': B.META['author'],
        'subject': B.META['description'],
        'keywords': B.META['keywords'],
        'creator': 'The Hidden and the Manifest \u2014 book/make-pdf.py',
        'producer': 'ReportLab + PyMuPDF',
    })
    try:
        d.xref_set_key(d.pdf_catalog(), 'Lang', '(en-US)')
        d.xref_set_key(d.pdf_catalog(), 'ViewerPreferences', '<< /DisplayDocTitle true >>')
    except Exception as exc:
        print('catalog keys:', exc)
    year = str(B.META['year'])
    xmp = f'''<?xpacket begin="\ufeff" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">{_xml(B.META['title'])}: {_xml(B.META['subtitle'])}</rdf:li></rdf:Alt></dc:title>
   <dc:creator><rdf:Seq><rdf:li>{_xml(B.META['author'])}</rdf:li></rdf:Seq></dc:creator>
   <dc:publisher><rdf:Seq><rdf:li>{_xml(B.META['imprint'])}</rdf:li></rdf:Seq></dc:publisher>
   <dc:description><rdf:Alt><rdf:li xml:lang="x-default">{_xml(B.META['description'])}</rdf:li></rdf:Alt></dc:description>
   <dc:identifier>{B.META['identifier']}</dc:identifier>
   <dc:language><rdf:Bag><rdf:li>en-US</rdf:li></rdf:Bag></dc:language>
   <dc:subject><rdf:Bag><rdf:li>Theology</rdf:li><rdf:li>Manifestation</rdf:li><rdf:li>Thomas Aquinas</rdf:li></rdf:Bag></dc:subject>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">{_xml(B.META['rights'])}</rdf:li></rdf:Alt></dc:rights>
   <dc:date><rdf:Seq><rdf:li>{year}</rdf:li></rdf:Seq></dc:date>
  </rdf:Description>
  <rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
   <pdf:Producer>ReportLab + PyMuPDF</pdf:Producer>
   <pdf:Keywords>{_xml(B.META['keywords'])}</pdf:Keywords>
  </rdf:Description>
  <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">
   <xmp:CreatorTool>The Hidden and the Manifest \u2014 book/make-pdf.py</xmp:CreatorTool>
   <xmp:CreateDate>{year}-01-01T00:00:00Z</xmp:CreateDate>
   <xmp:ModifyDate>{year}-01-01T00:00:00Z</xmp:ModifyDate>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>'''
    try:
        d.set_xml_metadata(xmp)
    except Exception as exc:
        print('xmp:', exc)

    # page labels: a viewer's own counter should read the folio, not the sheet number
    try:
        d.set_page_labels([
            {'startpage': 0, 'prefix': '', 'style': 'r', 'firstpagenum': 1},
            {'startpage': offset, 'prefix': '', 'style': 'D', 'firstpagenum': 1},
        ])
    except Exception as exc:
        print('page labels:', exc)

    # outline: front matter first, then the appendices gathered under one heading
    try:
        toc = d.get_toc()
        front = [[1, 'Cover', 1], [1, 'Half-title', 2], [1, 'Title Page', 3],
                 [1, 'Copyright', 4], [1, 'Contents', 5]]
        out, added = [], False
        for lvl, title, page in toc:
            if not added and title.startswith('Appendix A'):
                out.append([1, 'Appendices', page])
                added = True
            out.append([lvl, title, page])
        d.set_toc(front + out)
    except Exception as exc:
        print('outline:', exc)
    # a printed book has an even number of pages: the last leaf cannot be a recto on its own
    if d.page_count % 2:
        d.new_page(-1, width=d[0].rect.width, height=d[0].rect.height)

    tmp = path + '.tmp'
    d.save(tmp, garbage=4, deflate=True, clean=True)
    d.close()
    os.replace(tmp, path)
    print('stamped metadata \u2192', path)


def _xml(t):
    return (t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))


if __name__ == '__main__':
    import tempfile

    work = os.path.join(tempfile.gettempdir(), 'him-work.pdf')

    # Parts open on a recto, with a blank verso where the previous part ends on one.
    # Chapters and appendices open on the next page, as in trade nonfiction.
    order = [d['slug'] for d in B.collect() if d['kind'] == 'part']
    recto, entries, starts = set(), None, None
    offset, override, heads, colophon_page = 0, None, None, None
    dry = set()

    # Four things have to agree before the book can be printed: which parts need a blank
    # verso, the page numbers the contents will print, the page numbers the two indexes
    # cite, and where the arabic numbering starts. The mirrored frames also need to know
    # which side of the spread each section opens on. Nothing here can be computed in
    # advance, so lay the book out, read the result back, and repeat until it stops
    # moving. The blank set is recomputed from scratch each pass, with the effect of the
    # blanks already in place subtracted out, so a blank can be removed as well as added.
    for attempt in range(16):
        build_pdf(work, recto=recto, offset=offset, index_override=override,
                  headmap=heads, toc_entries=entries, starts=starts,
                  colophon_page=colophon_page, dry=dry)
        # a ladder of hyphens is fixed by re-setting the one paragraph that carries it
        fixes = ladder_fixes(work) - dry
        if fixes:
            dry |= fixes
            print(f'  pass {attempt + 1}: {len(fixes)} paragraph(s) re-set without hyphenation')
        found = dict(build_pdf.last_starts)
        fresh = list(build_pdf.last_entries)

        inserted, base = 0, {}
        for slug in order:
            page = found.get(slug)
            if page is None:
                continue
            if slug in recto:                 # a part's own blank precedes it
                inserted += 1
            base[slug] = page - inserted
        wanted, extra = set(), 0
        for slug in order:
            if slug in base and (base[slug] + extra) % 2 == 0:
                wanted.add(slug)
                extra += 1

        settled = (not fixes and wanted == recto and entries is not None
                   and [e[2] for e in entries] == [e[2] for e in fresh]
                   and starts is not None and starts == found)
        if settled:
            print(f'  layout settled after {attempt + 1} pass(es); '
                  f'{len(dry)} paragraph(s) set without hyphenation')
            break
        recto = wanted
        entries = fresh
        starts = found
        colophon_page = build_pdf.last_page
        offset = max(0, first_chapter_page(work) - 1)
        override = page_indexed_docs(work, offset)
        heads = head_map(work)
    else:
        print('  warning: layout did not settle; using the last pass')
        offset = max(0, first_chapter_page(work) - 1)
        override = page_indexed_docs(work, offset)
        heads = head_map(work)
        entries = list(build_pdf.last_entries)
        starts = dict(build_pdf.last_starts)
        colophon_page = build_pdf.last_page

    print(f'front matter: {offset} pages (roman); body starts at printed page 1')
    print(f'  blank versos before parts: {len(recto)}')
    print(f'  contents: {len(entries)} entries, last at printed page '
          f'{entries[-1][2] - offset if entries else "?"}')

    build_pdf(OUT, index_override=override, headmap=heads, offset=offset,
              recto=recto, toc_entries=entries, starts=starts, colophon_page=colophon_page,
              dry=dry)
    os.remove(work)
    jumps = link_index(OUT, offset)
    print(f'  index: {jumps} page numbers made clickable')
    stamp_metadata(OUT, offset)
    n = print_interior(OUT, INTERIOR, offset)
    print(f'wrote {INTERIOR} \u2014 {n} pages, no cover page')
    fold_report(OUT)
    build_triage_card()
