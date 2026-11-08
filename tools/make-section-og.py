#!/usr/bin/env python3
"""Generate section-level Open Graph cards (1200x630 PNG) with Pillow.

Visual style matches the existing per-template og/*.png cards (dark navy,
teal accents, white title). Re-run to regenerate all section cards.
"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
BG = (0x1b, 0x2a, 0x41)
WHITE = (0xff, 0xff, 0xff)
GREY = (0xb9, 0xc3, 0xd4)
TEAL = (0x0f, 0x76, 0x6e)
TEAL_TEXT = (0x8f, 0xe3, 0xd9)

FONT_DIR = '/usr/share/fonts/truetype/dejavu'
FONT_REG = os.path.join(FONT_DIR, 'DejaVuSans.ttf')
FONT_BOLD = os.path.join(FONT_DIR, 'DejaVuSans-Bold.ttf')


def font(path, size):
    return ImageFont.truetype(path, size)


def draw_logo(draw, x, y, size=56):
    r = 14
    draw.rounded_rectangle([x, y, x + size, y + size], radius=r, fill=(0x0f, 0x3b, 0x5c))
    lw = 3
    paper_x = x + size * 0.28
    paper_w = size * 0.38
    paper_y = y + size * 0.22
    line_gap = size * 0.13
    for i in range(3):
        ly = paper_y + i * line_gap
        w = paper_w * (1.0 if i < 2 else 0.6)
        draw.rounded_rectangle([paper_x, ly, paper_x + w, ly + lw], radius=1, fill=WHITE)
    cx = x + size * 0.66
    cy = y + size * 0.62
    cs = size * 0.22
    draw.line([cx - cs, cy, cx - cs * 0.2, cy + cs * 0.7, cx + cs, cy - cs * 0.7],
              fill=TEAL_TEXT, width=max(3, int(size * 0.08)), joint='curve')


def wrap_text(text, fnt, max_w, draw):
    words = text.split()
    lines, cur = [], ''
    for w in words:
        test = (cur + ' ' + w).strip()
        bbox = draw.textbbox((0, 0), test, font=fnt)
        if bbox[2] - bbox[0] <= max_w:
            cur = test
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines


def make_card(slug, eyebrow, title, tagline, category, out_path):
    img = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(img)
    margin = 72
    logo_size = 56
    x, y = margin, margin

    draw_logo(d, x, y, logo_size)

    wm_font = font(FONT_BOLD, 34)
    d.text((x + logo_size + 18, y + 8), 'Clausery', fill=WHITE, font=wm_font)

    cat_font = font(FONT_BOLD, 22)
    cat_bbox = d.textbbox((0, 0), category, font=cat_font)
    cat_w = cat_bbox[2] - cat_bbox[0]
    cat_h = cat_bbox[3] - cat_bbox[1]
    px, py = 18, 10
    pill_x = x + logo_size + 18 + int(d.textlength('Clausery', font=wm_font)) + 16
    pill_y = y + 8
    d.rounded_rectangle([pill_x, pill_y, pill_x + cat_w + px * 2, pill_y + cat_h + py * 2], radius=10, fill=TEAL)
    d.text((pill_x + px, pill_y + py - 2), category, fill=WHITE, font=cat_font)

    eb_font = font(FONT_BOLD, 30)
    eb_y = y + logo_size + 36
    d.text((x, eb_y), eyebrow, fill=TEAL_TEXT, font=eb_font)

    title_font = font(FONT_BOLD, 68)
    max_w = W - margin * 2
    lines = wrap_text(title, title_font, max_w, d)
    ty = eb_y + 58
    line_h = 76
    for line in lines[:3]:
        d.text((x, ty), line, fill=WHITE, font=title_font)
        ty += line_h

    tag_font = font(FONT_REG, 28)
    tag_y = ty + 14
    tag_lines = wrap_text(tagline, tag_font, max_w - 80, d)
    for line in tag_lines[:2]:
        d.text((x, tag_y), line, fill=GREY, font=tag_font)
        tag_y += 40

    img.save(out_path, 'PNG', optimize=True)
    print(f'  wrote {out_path} ({os.path.getsize(out_path)} bytes)')


# (slug, eyebrow, title, tagline, category)
CARDS = [
    ('clauses',       'Reference',   'Contract clauses explained',       'What each clause does, when it is enforceable, and wording to avoid. Plain English for small businesses.',   'Clauses'),
    ('compare',       'Comparison',  'Clausery vs alternatives',         'How Clausery compares to Bonsai, PandaDoc, Rocket Lawyer, Documate and other document tools.',               'Compare'),
    ('guides',        'Guides',      'Free small-business guides',       'Practical how-to writing on invoices, contracts, NDAs, HR letters and landlord forms.',                      'Guides'),
    ('free-tools',    'Free tools',  'Free small-business calculators',  'Deadlines, late-payment interest, freelance rates, loan repayments and more. All run in your browser.',      'Calculators'),
    ('legal',         'Legal',       'Privacy, terms and licenses',      'How Clausery handles your data, what you can do with the templates, and how to report a problem.',            'Legal'),
    ('docs',          'Docs',        'Template syntax and features',     'How to write Clausery templates, use expressions, loops and conditions, and customize Word output.',          'Docs'),
    ('company',       'About',       'About Clausery',                   'Built for small businesses and freelancers who need paperwork without signing up for anything.',              'Company'),
    ('marketing',     'Marketing',   'Why Clausery',                     'Free Word templates, no sign-up, document contents stay on your device, editable .docx.',                     'Templates'),
    ('pricing',       'Pricing',     'Simple, honest pricing',           'Start free. Upgrade when you need reusable templates and team sharing.',                                      'Pricing'),
    ('changelog',     'Release notes', 'What is new in Clausery',        'New templates, calculators, guides and app features, newest first.',                                          'Changelog'),
    ('for',           'For',         'For every small business',         'Audiences using Clausery: freelancers, consultants, HR teams, law firms, landlords.',                         'Audiences'),
]

if __name__ == '__main__':
    out_dir = 'assets/og'
    os.makedirs(out_dir, exist_ok=True)
    for args in CARDS:
        make_card(*args, os.path.join(out_dir, f'{args[0]}.png'))
