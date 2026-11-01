#!/usr/bin/env python3
"""Generate the cover of The Hidden and the Manifest.

Composites a typographic title over the still-life plate (cover-plate.png) and
writes cover.jpg at 1600x2400 (2:3), which is what the EPUB builder embeds.

    python3 book/make-cover.py

Requires Pillow. The plate is kept separate so the typography can be redone
without regenerating the image.
"""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
PLATE = os.path.join(ROOT, 'cover-plate.png')
OUT = os.path.join(ROOT, 'cover.jpg')

W, H = 1600, 2400
CREAM = (240, 231, 214)
GOLD = (201, 162, 75)
DIM = (196, 183, 160)

# the cover is set in the face the book is printed in, so the two agree
FONTS = os.path.join(ROOT, 'fonts')
SERIF_BOLD = os.path.join(FONTS, 'CrimsonText-Bold.ttf')
SERIF = os.path.join(FONTS, 'CrimsonText-Regular.ttf')
if not (os.path.exists(SERIF_BOLD) and os.path.exists(SERIF)):
    SERIF_BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
    SERIF = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'


def tracked(draw, y, text, font, fill, tracking=0, center=True):
    """Draw letter-spaced text centred on the canvas."""
    widths = [draw.textlength(ch, font=font) for ch in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = (W - total) / 2 if center else (W - total) / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=font, fill=fill)
        x += w + tracking
    return total


def main():
    plate = Image.open(PLATE).convert('RGB')
    # cover the 2:3 frame without distortion
    target = W / H
    pw, ph = plate.size
    if pw / ph > target:
        nw = int(ph * target)
        plate = plate.crop(((pw - nw) // 2, 0, (pw + nw) // 2, ph))
    else:
        nh = int(pw / target)
        plate = plate.crop((0, (ph - nh) // 2, pw, (ph + nh) // 2))
    img = plate.resize((W, H), Image.LANCZOS)

    # a soft scrim in the upper third, where the title sits
    scrim = Image.new('L', (1, H), 0)
    for y in range(H):
        if y < H * 0.62:
            v = int(90 * (1 - y / (H * 0.62)))
            scrim.putpixel((0, y), max(0, v))
    scrim = scrim.resize((W, H))
    img = Image.composite(Image.new('RGB', (W, H), (8, 6, 5)), img, scrim.point(lambda v: int(v * 0.85)))

    d = ImageDraw.Draw(img)

    f_kick = ImageFont.truetype(SERIF, 38)
    f_title = ImageFont.truetype(SERIF_BOLD, 168)
    f_title2 = ImageFont.truetype(SERIF_BOLD, 104)
    f_sub = ImageFont.truetype(SERIF, 44)
    f_small = ImageFont.truetype(SERIF, 34)

    tracked(d, 296, 'A THEOLOGICAL RESEARCH PROJECT', f_kick, GOLD, tracking=11)

    tracked(d, 392, 'THE HIDDEN', f_title, CREAM, tracking=8)
    tracked(d, 592, 'AND THE MANIFEST', f_title2, CREAM, tracking=6)

    # rule
    d.line([(W / 2 - 190, 720), (W / 2 + 190, 720)], fill=GOLD, width=2)

    tracked(d, 782, 'A CATHOLIC THEOLOGY OF MANIFESTATION', f_sub, DIM, tracking=4)
    tracked(d, 838, 'AND HOW THE CHURCH MAY BAPTIZE AN AGE', f_sub, DIM, tracking=4)

    # foot
    d.line([(W / 2 - 60, H - 250), (W / 2 + 60, H - 250)], fill=(120, 96, 55), width=1)
    tracked(d, H - 208, 'KIDUS YARED', f_small, (176, 160, 134), tracking=10)
    tracked(d, H - 162, 'MMXXVI', f_small, (150, 134, 110), tracking=10)

    img.save(OUT, quality=90, optimize=True, progressive=True)
    print('wrote', OUT, img.size)


if __name__ == '__main__':
    main()
