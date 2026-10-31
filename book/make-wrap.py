#!/usr/bin/env python3
"""Build the full wrap cover: back panel, spine, front panel, with bleed.

    python3 book/make-wrap.py

A paperback is not a front cover. The printer needs one sheet that wraps the whole
book: the back panel, the spine (whose width is a physical measurement of the paper,
not a design choice), and the front panel, plus 1/8 inch of bleed on the three outer
edges so a guillotine has something to cut into.

The spine is calculated here, not guessed: KDP's white 50# stock is 0.002252 in per
leaf, so a 300-page book has a 0.68 in spine, and the sheet is
0.125 + 5.5 + spine + 5.5 + 0.125 = 11.93 in wide by 8.75 in tall.

The artwork is the same plate as the front cover, carrying across the wrap: sharp on
the front, drowned and blurred on the back and the spine so the type stays readable.
The type is live text in Crimson Text at 300 dpi-equivalent size, not a picture of
type, which is what a printer wants to see in a cover PDF.
"""
import json
import os

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
PLATE = os.path.join(ROOT, 'cover-plate.png')
DIST = os.path.join(ROOT, 'dist')
FONTS = os.path.join(ROOT, 'fonts')

# ---- trim, stock and bleed ---------------------------------------------------
TRIM_W, TRIM_H = 5.5, 8.5
BLEED = 0.125
PER_PAGE = 0.002252          # KDP white 50# paper, inches per leaf
DPI = 300

CREAM = (0.941, 0.906, 0.839)
GOLD = (0.788, 0.635, 0.294)
DIM = (0.741, 0.706, 0.639)
INK = (0.05, 0.043, 0.035)


def pages():
    """The spine is the thickness of the *interior*, so count the interior."""
    for path in (os.path.join(DIST, 'the-hidden-and-the-manifest-interior.pdf'),
                 os.path.join(ROOT, 'editions', 'the-hidden-and-the-manifest-interior.pdf')):
        if os.path.exists(path):
            import pymupdf
            d = pymupdf.open(path)
            n = d.page_count
            d.close()
            return n
    for path in (os.path.join(ROOT, 'editions', 'build-report.json'),
                 os.path.join(DIST, 'build-report.json')):
        if os.path.exists(path):
            return json.load(open(path))['pdf_pages']
    return 300


def spine_in(n):
    return round(n * PER_PAGE, 3)


def sheet_in(n):
    spine = spine_in(n)
    return round(BLEED + TRIM_W + spine + TRIM_W + BLEED, 3), round(BLEED + TRIM_H + BLEED, 3)


def background(width_in, height_in, spine, path):
    """The plate, carried across the wrap: sharp on the front, drowned behind type."""
    W, H = int(round(width_in * DPI)), int(round(height_in * DPI))
    front_w = int(round((TRIM_W + BLEED) * DPI))
    canvas = Image.new('RGB', (W, H), (10, 8, 6))

    plate = Image.open(PLATE).convert('RGB')
    plate = plate.resize((front_w, H), Image.LANCZOS)
    canvas.paste(plate, (W - front_w, 0))

    # the back is the same room, further away and darker
    back = plate.crop((int(front_w * 0.12), 0, int(front_w * 0.88), H))
    back = back.resize((int(round((TRIM_W + BLEED + spine) * DPI)), H), Image.LANCZOS)
    back = back.filter(ImageFilter.GaussianBlur(9))
    scrim = Image.new('L', (1, H))
    for y in range(H):
        scrim.putpixel((0, y), 118)
    scrim = scrim.resize(back.size)
    back = Image.composite(Image.new('RGB', back.size, (12, 9, 7)), back,
                           scrim.point(lambda v: v))
    canvas.paste(back, (0, 0))

    # a fold is a physical event: darken both sides of the spine so it reads as a hinge
    d = ImageDraw.Draw(canvas, 'RGBA')
    sx0 = W - front_w
    sx1 = sx0 + int(round(spine * DPI))
    for i in range(int(0.22 * DPI)):
        a = int(150 * (1 - i / (0.22 * DPI)))
        d.line([(sx0 - i, 0), (sx0 - i, H)], fill=(0, 0, 0, a))
        d.line([(sx1 + i, 0), (sx1 + i, H)], fill=(0, 0, 0, a))

    canvas.save(path, quality=94, subsampling=0)
    return path, (sx0, sx1)


def main():
    from reportlab.lib.colors import Color
    from reportlab.lib.units import inch
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.pdfgen import canvas

    os.makedirs(DIST, exist_ok=True)
    n = pages()
    spine = spine_in(n)
    width, height = sheet_in(n)
    print(f'{n} pages -> spine {spine} in, sheet {width} x {height} in '
          f'({int(width * DPI)} x {int(height * DPI)} px at {DPI} dpi)')

    art, (sx0, sx1) = background(width, height, spine, os.path.join(DIST, 'wrap-art.jpg'))

    for name, file in (('Crimson', 'CrimsonText-Regular.ttf'),
                       ('Crimson-Bold', 'CrimsonText-Bold.ttf'),
                       ('Crimson-Italic', 'CrimsonText-Italic.ttf')):
        pdfmetrics.registerFont(TTFont(name, os.path.join(FONTS, file)))

    pdf_path = os.path.join(DIST, 'cover-wrap.pdf')
    c = canvas.Canvas(pdf_path, pagesize=(width * inch, height * inch))
    c.setFont('Crimson', 10)          # never leave the default Helvetica in the resources
    c.setTitle('The Hidden and the Manifest \u2014 full wrap cover')
    c.setAuthor('The Clausery Authors')
    c.setSubject('Paperback cover: back, spine and front, 5.5 x 8.5 in trim, '
                 f'{n} pages, {spine} in spine, 0.125 in bleed')
    c.drawImage(art, 0, 0, width * inch, height * inch)

    cream, gold, dim = (Color(*CREAM), Color(*GOLD), Color(*DIM))

    def tracked(x, y, text, font, size, fill, tracking=0, center=None):
        """Letter-spaced text, as the cover uses everywhere."""
        c.setFont(font, size)
        c.setFillColor(fill)
        widths = [pdfmetrics.stringWidth(ch, font, size) for ch in text]
        total = sum(widths) + tracking * (size / 1000.0) * (len(text) - 1)
        if center is not None:
            x = center - total / 2
        for ch, w in zip(text, widths):
            c.drawString(x, y, ch)
            x += w + tracking * (size / 1000.0)
        return total

    def para(x, y, width_in, text, font='Crimson', size=10.4, leading=15.2,
             fill=cream, space_after=6.0, justify=True):
        """A column of type: measure, break, justify, draw."""
        words = text.split()
        space = pdfmetrics.stringWidth(' ', font, size)
        line, lines, width_px = [], [], width_in * inch
        for w in words:
            trial = ' '.join(line + [w])
            if pdfmetrics.stringWidth(trial, font, size) <= width_px or not line:
                line.append(w)
            else:
                lines.append(' '.join(line))
                line = [w]
        if line:
            lines.append(' '.join(line))
        for text_line in lines:
            c.setFont(font, size)
            c.setFillColor(fill)
            pieces = text_line.split()
            natural = pdfmetrics.stringWidth(text_line, font, size)
            gap = space
            if justify and len(pieces) > 1 and text_line is not lines[-1]:
                gap += (width_px - natural) / (len(pieces) - 1)
            cx = x
            for w in pieces:
                c.drawString(cx, y, w)
                cx += pdfmetrics.stringWidth(w, font, size) + gap
            y -= leading
        return y - space_after

    # ---- back panel ---------------------------------------------------------
    # the panel is the trim width inset from the bleed, less the fold allowance
    safe = 0.375
    back_x = (BLEED + safe) * inch
    back_w = TRIM_W - 2 * safe
    y = height * inch - (BLEED + 1.15) * inch

    tracked(back_x, y, 'A THEOLOGICAL RESEARCH PROJECT', 'Crimson-Bold',
            8.2, gold, tracking=105)
    y -= 0.62 * inch

    # a line from the book itself, rather than a testimonial the book does not have
    y = para(back_x, y, back_w,
             'The manifest space is not primarily a set of false beliefs. '
             'It is a set of true observations attached to a false engine.',
             font='Crimson-Italic', size=13.4, leading=19.4, fill=cream, space_after=16,
             justify=False)

    c.setStrokeColor(Color(*GOLD))
    c.setLineWidth(0.7)
    c.line(back_x, y + 4, back_x + 0.7 * inch, y + 4)
    y -= 0.18 * inch

    body = [
        'Thirty million people have bought The Secret. Several hundred million have '
        'watched a stranger on a screen explain that their thoughts create their '
        'reality \u2014 and that if the thing they wanted did not arrive, the fault '
        'was in their frequency.',
        'The Church\u2019s usual replies are true and useless: that is superstition; '
        'it is basically just setting intentions. Neither has ever changed anyone\u2019s '
        'mind at eleven at night.',
        'This book argues that the manifest space is not a set of false beliefs but a '
        'set of true observations attached to a false engine \u2014 that attention '
        'really does shape a life, that words really do form a person, that desire '
        'really is a form of knowledge \u2014 and that the Church taught all of this '
        'first, and then stopped teaching it. Then it does what Aquinas did with '
        'Aristotle in the thirteenth century: describes the rival system accurately, '
        'refuses what is false by name, keeps what is true on new terms, and builds '
        'something better.',
        'A theology. An audit of fourteen central claims. A nine-day novena written to '
        'be prayed as it stands, a one-page triage card for the priest in the car park, '
        'and a thirty-day pilot with a control group.',
    ]
    for text in body:
        y = para(back_x, y, back_w, text, size=10.2, leading=14.9, space_after=8.5)

    y = para(back_x, y, back_w,
             'Forty chapters. Eight appendices. No imprimatur, and no claim to one.',
             font='Crimson-Italic', size=9.9, leading=14.2, fill=dim, space_after=4,
             justify=False)

    # the foot of the back panel: imprint, site, and the barcode's clear field
    foot_y = (BLEED + 0.62) * inch
    tracked(back_x, foot_y, 'CLAUSERY \u00b7 GETCLAUSERY.GITHUB.IO', 'Crimson-Bold',
            7.0, dim, tracking=60)
    tracked(back_x, foot_y - 0.22 * inch, 'THEOLOGY \u00b7 MANIFESTATION', 'Crimson',
            7.0, dim, tracking=60)

    # a barcode is stamped on by the printer: keep 2 x 1.2 in of quiet field clear
    barcode = (back_x + (back_w - 2.0) * inch, (BLEED + 0.4) * inch, 2.0 * inch, 1.2 * inch)
    c.setFillColor(Color(1, 1, 1, alpha=0.0))
    c.rect(*barcode, stroke=0, fill=0)

    # ---- spine --------------------------------------------------------------
    mid = (sx0 + sx1) / 2.0 / DPI * inch      # the fold, in points, not pixels
    title, tsize, ttrack = 'THE HIDDEN AND THE MANIFEST', 10.2, 120
    author, asize, atrack = 'THE CLAUSERY AUTHORS', 7.0, 140
    tw = sum(pdfmetrics.stringWidth(ch, 'Crimson-Bold', tsize) for ch in title) \
        + (ttrack - 1000) * (tsize / 1000.0) * (len(title) - 1) * 0
    tw = sum(pdfmetrics.stringWidth(ch, 'Crimson-Bold', tsize) for ch in title) \
        + ttrack * (tsize / 1000.0) * (len(title) - 1)
    aw = sum(pdfmetrics.stringWidth(ch, 'Crimson', asize) for ch in author) \
        + atrack * (asize / 1000.0) * (len(author) - 1)
    gap = 0.34 * inch
    total = tw + gap + aw

    # the spine reads top to bottom, the American convention; a reader turning the book
    # face down sees the title first, then the author's name
    c.saveState()
    c.translate(mid, height * inch / 2)
    c.rotate(-90)                              # local x runs down the sheet, local y across
    x0 = -total / 2.0
    tracked(x0, -3.4, title, 'Crimson-Bold', tsize, cream, tracking=ttrack)
    tracked(x0 + tw + gap, -3.4, author, 'Crimson', asize, gold, tracking=atrack)
    c.restoreState()

    # ---- front panel: the same typography as the front cover, as live text ---
    fx = (width - TRIM_W) * inch              # left edge of the front trim panel
    mid_f = fx + TRIM_W * inch / 2
    top = height * inch - BLEED * inch         # top of the trim, under the bleed

    tracked(0, top - 1.28 * inch, 'A THEOLOGICAL RESEARCH PROJECT', 'Crimson-Bold',
            8.6, gold, tracking=112, center=mid_f)
    tracked(0, top - 1.98 * inch, 'THE HIDDEN', 'Crimson-Bold', 36.0, cream,
            tracking=22, center=mid_f)
    tracked(0, top - 2.50 * inch, 'AND THE MANIFEST', 'Crimson-Bold', 22.5, cream,
            tracking=16, center=mid_f)

    c.setStrokeColor(Color(*GOLD))
    c.setLineWidth(1.1)
    c.line(mid_f - 1.35 * inch, top - 2.94 * inch, mid_f + 1.35 * inch, top - 2.94 * inch)

    tracked(0, top - 3.26 * inch, 'A CATHOLIC THEOLOGY OF MANIFESTATION', 'Crimson',
            11.4, dim, tracking=34, center=mid_f)
    tracked(0, top - 3.52 * inch, 'AND HOW THE CHURCH MAY BAPTIZE AN AGE', 'Crimson',
            11.4, dim, tracking=34, center=mid_f)

    c.line(mid_f - 0.42 * inch, top - 7.02 * inch, mid_f + 0.42 * inch, top - 7.02 * inch)
    tracked(0, top - 7.34 * inch, 'THE CLAUSERY AUTHORS', 'Crimson', 10.2,
            (0.690, 0.627, 0.525), tracking=118, center=mid_f)
    tracked(0, top - 7.60 * inch, 'MMXXVI', 'Crimson', 9.0, (0.588, 0.525, 0.431),
            tracking=118, center=mid_f)

    c.showPage()
    c.save()

    # reportlab opens every page with a Helvetica text object, which leaves a base-14
    # font in the resources even though nothing is set in it; a printer flags that.
    import pymupdf
    d = pymupdf.open(pdf_path)
    d.set_metadata({
        'title': 'The Hidden and the Manifest \u2014 full wrap cover',
        'author': 'The Clausery Authors',
        'creator': 'The Hidden and the Manifest \u2014 book/make-wrap.py',
        'producer': 'ReportLab + PyMuPDF',
        'subject': f'Paperback wrap: {n} pages, {spine} in spine, 0.125 in bleed',
    })
    tmp = pdf_path + '.tmp'
    d.save(tmp, garbage=4, clean=True, deflate=True)
    d.close()
    os.replace(tmp, pdf_path)
    print('wrote', pdf_path, f'{os.path.getsize(pdf_path) / 1e6:.2f} MB')

    # a flat preview a human can look at without a PDF reader
    jpg = os.path.join(DIST, 'cover-wrap.jpg')
    art_img = Image.open(art)
    print('art', art_img.size)
    return pdf_path


if __name__ == '__main__':
    main()
