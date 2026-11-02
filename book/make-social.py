#!/usr/bin/env python3
"""Build the shareable cards for The Hidden and the Manifest.

    python3 book/make-social.py

Writes to book/social/: one link preview (1200x630), three square quote cards
(1080x1080), and one vertical story card (1080x1920). Everything is drawn from the
book's own typeface and palette, so a card is recognisably the book and not a generic
quote graphic. No third-party services, no template, no stock photography.
"""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(ROOT, 'fonts', 'CrimsonText-Regular.ttf')
BOLD = os.path.join(ROOT, 'fonts', 'CrimsonText-Bold.ttf')
ITAL = os.path.join(ROOT, 'fonts', 'CrimsonText-Italic.ttf')
COVER = os.path.join(ROOT, 'cover.jpg')
OUT = os.path.join(ROOT, 'social')

INK = (27, 25, 23)
DEEP = (20, 18, 16)
CREAM = (239, 230, 214)
GOLD = (176, 141, 87)
ACCENT = (122, 46, 30)
PAPER = (250, 247, 242)
MUTED = (150, 140, 126)


def tracked(d, x, y, text, font, fill, tracking=0.0, anchor_left=False):
    """Draw letter-spaced text; PIL has no tracking, so each glyph is placed."""
    widths = [d.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * max(0, len(text) - 1)
    cx = x if anchor_left else x - total / 2
    for ch, w in zip(text, widths):
        d.text((cx, y), ch, font=font, fill=fill)
        cx += w + tracking
    return total


def wrap(d, text, font, max_w):
    words, lines, line = text.split(), [], ''
    for w in words:
        trial = (line + ' ' + w).strip()
        if d.textlength(trial, font=font) <= max_w or not line:
            line = trial
        else:
            lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


def draw_par(d, text, font, fill, box, leading=1.16, align='center'):
    x0, y0, x1, y1 = box
    lines = wrap(d, text, font, x1 - x0)
    h = font.size * leading
    y = y0 + ((y1 - y0) - h * len(lines)) / 2
    for ln in lines:
        if align == 'center':
            d.text(((x0 + x1) / 2, y), ln, font=font, fill=fill, anchor='ma')
        else:
            d.text((x0, y), ln, font=font, fill=fill)
        y += h
    return y


def paper(size, colour=PAPER):
    img = Image.new('RGB', size, colour)
    return img, ImageDraw.Draw(img)


def cover_thumb(h):
    im = Image.open(COVER).convert('RGB')
    w = int(im.width * h / im.height)
    return im.resize((w, h), Image.LANCZOS)


def shadowed(base, thumb, x, y):
    """A soft drop shadow under the cover plate, so it sits on the page."""
    from PIL import ImageFilter
    pad = 40
    sh = Image.new('RGBA', (thumb.width + pad * 2, thumb.height + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(sh)
    d.rectangle([pad, pad, pad + thumb.width, pad + thumb.height], fill=(40, 20, 10, 170))
    sh = sh.filter(ImageFilter.GaussianBlur(18))
    base.paste(sh, (x - pad, y - pad + 8), sh)
    base.paste(thumb, (x, y))


# ---------------------------------------------------------------- link preview

def og_card():
    W, H = 1200, 630
    img, d = paper((W, H), DEEP)
    # The cover carries its own title, so pasting the whole plate here fights with the card's type. Crop the
    # photographic band below the cover's typography instead, and let it run off the right edge.
    art = Image.open(COVER).convert('RGB')
    band = art.crop((int(art.width * 0.18), int(art.height * 0.40), art.width, int(art.height * 0.90)))
    art = band.resize((int(band.width * H / band.height), H), Image.LANCZOS)
    if art.width > int(W * 0.46):                       # keep it a panel, not half the card
        keep = int(W * 0.46)
        art = art.crop((art.width - keep, 0, art.width, H))
    img.paste(art, (W - art.width, 0))
    # a warm scrim, so type never fights the photograph and the join is invisible
    scrim = Image.new('RGB', (W, H), DEEP)
    mask = Image.linear_gradient('L').rotate(90).resize((W, H))
    img.paste(scrim, (0, 0), mask.point(lambda v: int(v * 0.94)))
    d = ImageDraw.Draw(img)

    f_kick = ImageFont.truetype(FONT, 20)
    f_title = ImageFont.truetype(BOLD, 74)
    f_sub = ImageFont.truetype(ITAL, 30)
    f_by = ImageFont.truetype(FONT, 22)
    f_small = ImageFont.truetype(FONT, 18)

    x = 76
    tracked(d, x, 86, 'A THEOLOGICAL RESEARCH PROJECT', f_kick, GOLD, tracking=5, anchor_left=True)
    d.text((x, 132), 'THE HIDDEN', font=f_title, fill=CREAM)
    d.text((x, 212), 'AND THE', font=f_title, fill=CREAM)
    d.text((x, 292), 'MANIFEST', font=f_title, fill=CREAM)
    d.line([(x, 396), (x + 120, 396)], fill=GOLD, width=3)
    draw_par(d, 'Manifestation is not a set of false beliefs. It is a set of true '
                'observations attached to a false engine.', f_sub, (206, 194, 176),
             (x, 418, W - 430, 540), leading=1.22, align='left')
    w = tracked(d, x, 566, 'KIDUS YARED', f_by, GOLD, tracking=6, anchor_left=True)
    tracked(d, x + w + 34, 568, '314 PP  ·  FREE TO READ', f_small, MUTED, tracking=4, anchor_left=True)
    img.save(os.path.join(OUT, 'og-card.png'))
    print('og-card.png', img.size)


# ---------------------------------------------------------------- quote cards

def quote_card(name, quote, source, dark=False):
    W = H = 1080
    bg = DEEP if dark else PAPER
    fg = CREAM if dark else INK
    quiet = MUTED if dark else (110, 100, 90)
    img, d = paper((W, H), bg)

    f_q = ImageFont.truetype(FONT, 62)
    f_src = ImageFont.truetype(ITAL, 27)
    f_by = ImageFont.truetype(FONT, 21)
    f_kick = ImageFont.truetype(FONT, 17)

    rule = GOLD
    d.line([(90, 96), (150, 96)], fill=rule, width=3)
    tracked(d, 90, 120, 'THE HIDDEN AND THE MANIFEST', f_kick, quiet, tracking=4, anchor_left=True)

    draw_par(d, quote, f_q, fg, (90, 220, W - 90, H - 300), leading=1.22)

    d.line([(90, H - 268), (150, H - 268)], fill=rule, width=2)
    d.text((90, H - 244), source, font=f_src, fill=quiet)
    tracked(d, 90, H - 190, 'KIDUS YARED', f_by, GOLD, tracking=6, anchor_left=True)
    tracked(d, 90, H - 62, '314 PAGES  ·  FREE TO READ', f_kick, quiet, tracking=3, anchor_left=True)
    img.save(os.path.join(OUT, name))
    print(name, img.size)


# ---------------------------------------------------------------- story card

def story_card():
    W, H = 1080, 1920
    img, d = paper((W, H), DEEP)
    thumb = cover_thumb(int(H * 0.52))
    img.paste(thumb, (int((W - thumb.width) / 2), 150))

    f_kick = ImageFont.truetype(FONT, 22)
    f_title = ImageFont.truetype(BOLD, 82)
    f_sub = ImageFont.truetype(ITAL, 34)
    f_small = ImageFont.truetype(FONT, 22)
    d = ImageDraw.Draw(img)
    y = 150 + thumb.height + 96
    tracked(d, W / 2, y, 'A THEOLOGICAL RESEARCH PROJECT', f_kick, GOLD, tracking=5)
    d.text((W / 2, y + 44), 'THE HIDDEN', font=f_title, fill=CREAM, anchor='ma')
    d.text((W / 2, y + 134), 'AND THE MANIFEST', font=f_title, fill=CREAM, anchor='ma')
    draw_par(d, 'A Catholic theology of manifestation, and how the Church may baptize an age.',
             f_sub, (208, 196, 178), (110, y + 270, W - 110, y + 430), leading=1.3)
    tracked(d, W / 2, H - 150, '314 PAGES  ·  FREE TO READ  ·  NO IMPRIMATUR CLAIMED', f_small, MUTED, tracking=3)
    img.save(os.path.join(OUT, 'story.png'))
    print('story.png', img.size)


def main():
    os.makedirs(OUT, exist_ok=True)
    og_card()
    quote_card('quote-engine.png',
               'It is not a set of false beliefs. It is a set of true observations attached to a false engine.',
               'The Argument on One Page')
    quote_card('quote-desire.png',
               'In the manifest space, desire is the compass and the credential.',
               'Chapter 2 · The Grammar of Manifestation')
    quote_card('quote-agency.png',
               'The manifest space has an intense sense of agency and no doctrine of providence.',
               'Chapter 3 · Why It Works', dark=True)
    quote_card('quote-building.png',
               'The manifest space is hard to see because it has no building.',
               'Chapter 1 · A Girl, a Journal, and a Universe')
    story_card()


if __name__ == '__main__':
    main()
