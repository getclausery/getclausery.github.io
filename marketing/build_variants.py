#!/usr/bin/env python3
"""
Build three additional short-ad variants (B/C/D) for Clausery.
  Variant B -- "I tested 7 free invoice tools..." (list-hook, crossed-out competitors)
  Variant C -- "Why does every invoice app force you to sign up?" (rhetorical question)
  Variant D -- "The invoice hack that saves me 10 minutes per client" (hack/blank-Word open)
All are 9:16 vertical, 1080x1920 @ 30fps, silent (caption-driven UGC), faststart MP4.

Each variant uses the same 3-act structure (hook -> demo -> payoff) but swaps the first ~4 seconds.
Output: marketing/short-ad/clausery-short-ad-v{B,C,D}.mp4
Run: python3 marketing/build_variants.py
"""
import math, os, pathlib, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).parent
OUT_DIR = ROOT
W, H = 1080, 1920
FPS = 30

FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_B = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def fr(path, size): return ImageFont.truetype(path, size)

DARK   = (15, 29, 46)
NAVY   = (11, 21, 34)
ACCENT = (41, 151, 255)
ACCENT_DK = (31, 126, 219)
GREEN  = (34, 197, 94)
RED    = (239, 68, 68)
GOLD   = (245, 158, 11)
CREAM  = (255, 247, 237)
WHITE  = (255, 255, 255)
GREY   = (203, 213, 225)
GREY_D = (148, 163, 184)
INK    = (15, 23, 42)
BLACK_A = (0, 0, 0)

def gradient(draw, top=(15,29,46), bot=(8,15,24)):
    for y in range(H):
        t = y / H
        c = tuple(int(top[i]*(1-t) + bot[i]*t) for i in range(3))
        draw.line([(0,y),(W,y)], fill=c)

def rrect(draw, box, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def text_centered(draw, y, text, fnt, fill=WHITE, shadow=True):
    bbox = draw.textbbox((0,0), text, font=fnt)
    tw = bbox[2]-bbox[0]
    th = bbox[3]-bbox[1]
    x = (W-tw)//2
    if shadow:
        draw.text((x+2, y+2), text, font=fnt, fill=(0,0,0,180))
    draw.text((x, y), text, font=fnt, fill=fill)
    return th

def text_wrap(draw, text, fnt, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur+" "+w).strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def pill_caption(draw, caption, sub=None, y=1560, kind=None):
    # Determine font sizes
    cfs = 88 if len(caption) < 18 else 70
    if len(caption) >= 28: cfs = 58
    pill_w = int(draw.textlength(caption, font=fr(FONT_B, cfs))) + 120
    pill_h = cfs + 80
    if sub:
        sf = 42
        sw = int(draw.textlength(sub, font=fr(FONT_B, sf))) + 120
        pill_w = max(pill_w, sw)
        pill_h += 100
    pill_x = (W-pill_w)//2
    pill_y = y - cfs - 20
    rrect(draw, (pill_x, pill_y, pill_x+pill_w, pill_y+pill_h), 28, fill=(0,0,0,200))
    # main line
    f_c = fr(FONT_B, cfs)
    cw = draw.textlength(caption, font=f_c)
    draw.text(((W-cw)//2+2, pill_y+30+2), caption, font=f_c, fill=(0,0,0,180))
    draw.text(((W-cw)//2, pill_y+30), caption, font=f_c, fill=WHITE)
    if sub:
        f_s = fr(FONT_B, sf)
        sc = GOLD if kind in ("hook","reveal","nocheck","free","cta") else WHITE
        sw_ = draw.textlength(sub, font=f_s)
        draw.text(((W-sw_)//2+1, pill_y+30+cfs+20+1), sub, font=f_s, fill=(0,0,0,160))
        draw.text(((W-sw_)//2, pill_y+30+cfs+20), sub, font=f_s, fill=sc)

def browser_window(draw, t):
    """Draw a phone-frame safari window with fake URL bar and white document canvas."""
    bx, by = 54, 320
    bw, bh = W-108, 980
    # Phone-like rounded chrome
    rrect(draw, (bx-14, by-14, bx+bw+14, by+bh+14), 44, fill=(28,38,55))
    rrect(draw, (bx, by, bx+bw, by+bh), 24, fill=WHITE)
    # URL bar
    rrect(draw, (bx+20, by+18, bx+bw-20, by+70), 12, fill=(241,243,247))
    draw.text((bx+50, by+30), "getclausery.github.io/app", font=fr(FONT_R, 26), fill=GREY_D)
    # Document body area
    doc_y = by + 90
    draw.rectangle((bx+30, doc_y, bx+bw-30, by+bh-30), fill=WHITE)
    return bx, by, bw, bh, doc_y

def type_animation(draw, t, fields, start_t, bx, by, bw, doc_y):
    """Animate typing fields in the invoice preview."""
    elapsed = t - start_t
    # Title
    draw.rectangle((bx+70, doc_y+20, bx+380, doc_y+60), fill=INK)
    draw.text((bx+70, doc_y+70), "INVOICE", font=fr(FONT_B, 28), fill=GREY_D)
    # Fields
    field_defs = [
        ("From:", "Alex Design Studio"),
        ("To:",   "Acme Coffee Co."),
        ("Invoice #:", "1042"),
        ("Date:", "23 Oct 2026"),
        ("Item:", "Website redesign"),
        ("Amount:", "$2,400.00"),
        ("Tax:",   "$0.00"),
        ("Total:", "$2,400.00"),
    ]
    fy = doc_y + 120
    for i, (label, val) in enumerate(field_defs):
        field_appear = i * 0.45
        if elapsed < field_appear:
            break
        n = min(len(val), max(1, int((elapsed - field_appear) / 0.04)))
        typed = val[:n] + ("|" if elapsed - field_appear < len(val)*0.04 + 0.15 else "")
        # label
        draw.text((bx+70, fy+8), label, font=fr(FONT_B, 22), fill=GREY_D)
        # input box
        box_h = 56
        rrect(draw, (bx+200, fy, bx+bw-70, fy+box_h), 10, outline=(203,213,225), width=2)
        draw.text((bx+220, fy+18), typed, font=fr(FONT_R, 24), fill=INK)
        fy += box_h + 14
    return fy

def download_button(draw, t, bx, by, bw, bh, click_start, label="Download Word (.docx)"):
    but_h = 78
    but_y = by + bh - but_h - 30
    pulse = 1.0 + (0.06*math.sin((t-click_start)*14) if t >= click_start else 0)
    btn_w = int((bw-100)*pulse)
    btn_x = bx + 50 + ((bw-100)-btn_w)//2
    rrect(draw, (btn_x, but_y, btn_x+btn_w, but_y+but_h), 14, fill=ACCENT)
    bw_l = draw.textlength(label, font=fr(FONT_B, 30))
    draw.text((bx+bw//2 - bw_l//2, but_y+22), label, font=fr(FONT_B, 30), fill=WHITE)
    if t > click_start + 1.3:
        tx, ty, tw_, th_ = bx+bw-320, by+110, 270, 52
        rrect(draw, (tx, ty, tx+tw_, ty+th_), 14, fill=GREEN)
        label2 = "Saved to device"
        lw = draw.textlength(label2, font=fr(FONT_B, 22))
        draw.text((tx+tw_//2 - lw//2, ty+14), label2, font=fr(FONT_B, 22), fill=WHITE)

# ---------------------------------------------------------------
# Scene drawers for each beat kind
# ---------------------------------------------------------------

def draw_lock(draw, cx, cy, size=80, color=RED):
    """Draw a simple padlock with primitives (no emoji — DejaVu doesn't cover U+1F512)."""
    # shackle (open top arc)
    sw = max(4, size//12)
    draw.arc((cx-size//2, cy-size, cx+size//2, cy+size//2), 180, 0, fill=color, width=sw+4)
    # body
    rrect(draw, (cx-size*0.7, cy-size*0.1, cx+size*0.7, cy+size*0.9), size//6, fill=color)
    # keyhole
    kh_w, kh_h = size//8, size//6
    draw.ellipse((cx-kh_w, cy+size*0.25-kh_h, cx+kh_w, cy+size*0.25+kh_h), fill=WHITE)
    draw.rectangle((cx-2, cy+size*0.25, cx+2, cy+size*0.55), fill=WHITE)

def scene_hook_wall(draw, t, beat):
    """Act 1: red/agitated signup wall behind the hook caption. Used by variant C."""
    # Wall
    shake = int(6*math.sin(t*16)) if t < beat[1]-0.5 else 0
    rrect(draw, (120+shake, 420, W-120+shake, 1100), 30, fill=(50,18,18), outline=RED, width=4)
    # Lock icon (drawn, not emoji)
    draw_lock(draw, W//2+shake, 640, size=110, color=RED)
    rrect(draw, (200+shake, 820, W-200+shake, 900), 14, fill=(200,200,200))
    txt1 = "Create account to download"
    tw1 = draw.textlength(txt1, font=fr(FONT_B, 28))
    draw.text(((W-tw1)//2+shake, 848), txt1, font=fr(FONT_B, 28), fill=INK)
    # Big X + text
    txt2 = "EMAIL REQUIRED"
    tw2 = draw.textlength(txt2, font=fr(FONT_B, 40))
    # Draw X to the left of text
    x_x = (W-tw2)//2 - 60 + shake
    draw.line([(x_x, 960),(x_x+40, 1000)], fill=RED, width=7)
    draw.line([(x_x+40, 960),(x_x, 1000)], fill=RED, width=7)
    draw.text((x_x+60, 960), txt2, font=fr(FONT_B, 40), fill=RED)

def scene_hook_list(draw, t, beat, count=7, reveal_idx=6):
    """Variant B: stacked app icons, all but the last crossed out."""
    # 7 rows
    labels = ["Invoice app 1","Invoice app 2","Invoice app 3","Invoice app 4","Invoice app 5","Invoice app 6","Clausery"]
    total = count
    row_h = 80
    top_y = 420
    pad = 22
    for i in range(total):
        appear = i * 0.22
        if t - beat[0] < appear: break
        ry = top_y + i*(row_h+pad)
        rx = 120
        rw = W-240
        # Card
        is_winner = (i == reveal_idx)
        c_fill = (30, 50, 80) if is_winner else (30,35,45)
        c_out = GREEN if is_winner else (60,70,85)
        rrect(draw, (rx, ry, rx+rw, ry+row_h), 16, fill=c_fill, outline=c_out, width=3 if is_winner else 2)
        # App icon dot
        draw.ellipse((rx+20, ry+18, rx+20+44, ry+18+44), fill=ACCENT if is_winner else (100,110,130))
        draw.text((rx+42, ry+40), labels[i][0], font=fr(FONT_B, 28), fill=WHITE, anchor="mm")
        # Label
        draw.text((rx+84, ry+24), labels[i], font=fr(FONT_B, 28), fill=WHITE)
        # Cross out non-winners
        if i < reveal_idx:
            # Red X
            draw.line([(rx+rw-80, ry+18),(rx+rw-30, ry+row_h-18)], fill=RED, width=6)
            draw.line([(rx+rw-30, ry+18),(rx+rw-80, ry+row_h-18)], fill=RED, width=6)
        if is_winner:
            draw.text((rx+rw-60, ry+40), "✓", font=fr(FONT_B, 40), fill=GREEN, anchor="mm")

def scene_hook_blank(draw, t, beat):
    """Variant D: blank Word doc with blinking cursor."""
    # White Word canvas
    cx, cy, cw, ch = 100, 380, W-200, 880
    rrect(draw, (cx-10, cy-10, cx+cw+10, cy+ch+10), 12, fill=(180,180,180))
    rrect(draw, (cx, cy, cx+cw, cy+ch), 6, fill=WHITE)
    # Word ribbon
    rrect(draw, (cx, cy, cx+cw, cy+70), 6, fill=(243,244,246))
    for i, label in enumerate(["File","Home","Insert","Layout"]):
        draw.text((cx+30+i*90, cy+22), label, font=fr(FONT_R, 22), fill=GREY_D)
    # Fake typed starting line
    draw.text((cx+100, cy+220), "INVOICE", font=fr(FONT_B, 48), fill=INK)
    # Blinking cursor on a blank-ish line
    cursor_on = int((t*2)) % 2 == 0
    if cursor_on:
        draw.rectangle((cx+100, cy+330, cx+104, cy+380), fill=INK)
    # Question marks floating around
    draw.text((W-220, 500), "?", font=fr(FONT_B, 160), fill=(200,210,225))
    draw.text((180, 1100), "???", font=fr(FONT_B, 100), fill=(200,210,225))
    # "Saves 10 min per client" gold pill (shown after the first beat)
    if t > beat[0] + 0.3:
        scene_hack_badge(draw, t, beat)

def scene_demo(draw, t, beat):
    bx, by, bw, bh, doc_y = browser_window(draw, t)
    fy = type_animation(draw, t, None, beat[0], bx, by, bw, doc_y)
    # Button not yet pulsing
    but_h = 78
    but_y = by + bh - but_h - 30
    rrect(draw, (bx+50, but_y, bx+bw-50, but_y+but_h), 14, fill=ACCENT)
    label = "Download Word (.docx)"
    lw = draw.textlength(label, font=fr(FONT_B, 30))
    draw.text((bx+bw//2 - lw//2, but_y+22), label, font=fr(FONT_B, 30), fill=WHITE)

def scene_click(draw, t, beat):
    bx, by, bw, bh, doc_y = browser_window(draw, t)
    type_animation(draw, t, None, beat[0]-3.0, bx, by, bw, doc_y)  # show fields filled
    download_button(draw, t, bx, by, bw, bh, beat[0]+0.3)

def scene_nocheck(draw, t, beat):
    rows = [("NO signup", GREEN, "✓"), ("NO card", GREEN, "✓")]
    for i,(lab,c,ic) in enumerate(rows):
        appear = t - beat[0] - i*0.5
        if appear < 0: continue
        s = min(1.0, appear/0.4)
        fsize = int(110 * (0.7 + 0.3*s))
        f = fr(FONT_B, fsize)
        txt = f"{ic}  {lab}"
        tw = draw.textlength(txt, font=f)
        y = int(H*0.36) + i*240
        draw.text(((W-tw)//2+2, y+2), txt, font=f, fill=(0,0,0,180))
        draw.text(((W-tw)//2, y), txt, font=f, fill=c)

def scene_free(draw, t, beat):
    appear = (t - beat[0]) / (beat[1]-beat[0])
    fs = int(170 * (0.6 + 0.4*min(1.0, appear/0.5)))
    f = fr(FONT_B, fs)
    txt1 = "87 templates"
    tw = draw.textlength(txt1, font=f)
    draw.text(((W-tw)//2+2, int(H*0.36)+2), txt1, font=f, fill=(0,0,0,180))
    draw.text(((W-tw)//2, int(H*0.36)), txt1, font=f, fill=GOLD)
    f2 = fr(FONT_B, 88)
    txt2 = "ALL FREE."
    tw2 = draw.textlength(txt2, font=f2)
    draw.text(((W-tw2)//2, int(H*0.48)), txt2, font=f2, fill=GREEN)
    f3 = fr(FONT_R, 36)
    txt3 = "(and they open in Word)"
    tw3 = draw.textlength(txt3, font=f3)
    draw.text(((W-tw3)//2, int(H*0.58)), txt3, font=f3, fill=GREY)

def scene_cta(draw, t, beat):
    appear = (t - beat[0]) / (beat[1]-beat[0])
    fs = int(140 * (0.8 + 0.2*min(1.0, appear/0.4)))
    f = fr(FONT_B, fs)
    txt = "Clausery"
    tw = draw.textlength(txt, font=f)
    draw.text(((W-tw)//2+2, int(H*0.36)+2), txt, font=f, fill=(0,0,0,200))
    draw.text(((W-tw)//2, int(H*0.36)), txt, font=f, fill=WHITE)
    f2 = fr(FONT_R, 44)
    u = "getclausery.github.io/go/"
    tw2 = draw.textlength(u, font=f2)
    draw.text(((W-tw2)//2, int(H*0.46)), u, font=f2, fill=ACCENT)
    pulse = 0.85 + 0.15*math.sin((t-beat[0])*6)
    pf = int(56*pulse)
    f3 = fr(FONT_B, pf)
    lb = "LINK IN BIO"
    tw3 = draw.textlength(lb, font=f3)
    draw.text(((W-tw3)//2, int(H*0.66)), lb, font=f3, fill=GOLD)

def scene_reveal(draw, t, beat):
    # Simple reveal line
    appear = (t - beat[0]) / (beat[1]-beat[0])
    fs = int(130 * (0.5 + 0.5*min(1.0, appear/0.4)))
    f = fr(FONT_B, fs)
    txt = beat[2] if beat[2] else ""
    tw = draw.textlength(txt, font=f)
    draw.text(((W-tw)//2+2, int(H*0.40)+2), txt, font=f, fill=(0,0,0,200))
    draw.text(((W-tw)//2, int(H*0.40)), txt, font=f, fill=GREEN)

def scene_pain(draw, t, beat):
    # Small lock wall fragment
    rrect(draw, (200, 480, W-200, 900), 26, fill=(40,20,20), outline=RED, width=4)
    draw_lock(draw, W//2, 680, size=90, color=RED)
    txt = "SIGN UP WALL"
    tw = draw.textlength(txt, font=fr(FONT_B, 44))
    draw.text(((W-tw)//2, 830), txt, font=fr(FONT_B, 44), fill=RED)

def draw_bolt(draw, cx, cy, size=36, color=INK):
    """Lightning bolt drawn from triangles (no U+26A1)."""
    pts = [(cx-size*0.3, cy-size), (cx+size*0.2, cy-size*0.1),
           (cx-size*0.1, cy-size*0.1), (cx+size*0.3, cy+size),
           (cx-size*0.15, cy+size*0.1), (cx+size*0.05, cy+size*0.1)]
    draw.polygon(pts, fill=color)

def scene_hack_badge(draw, t, beat):
    # "HACK" pill + stopwatch
    rrect(draw, (180, 520, W-180, 660), 30, fill=GOLD)
    label = "INVOICE HACK"
    f_bolt_label = fr(FONT_B, 48)
    tw = draw.textlength(label, font=f_bolt_label)
    bolt_x = (W-tw)//2 - 50
    draw_bolt(draw, bolt_x, 558+24, size=28, color=INK)
    draw.text((bolt_x+36, 558), label, font=f_bolt_label, fill=INK)
    # Timer
    draw.ellipse((W//2-130, 720, W//2+130, 980), outline=WHITE, width=8)
    draw.line([(W//2, 850),(W//2, 780)], fill=WHITE, width=8)
    draw.line([(W//2, 850),(W//2+80, 870)], fill=WHITE, width=6)
    txt = "60 seconds"
    tw2 = draw.textlength(txt, font=fr(FONT_B, 54))
    draw.text(((W-tw2)//2, 1020), txt, font=fr(FONT_B, 54), fill=WHITE)

# ---------------------------------------------------------------
# Variant BEATS -- each entry: (start, end, main_caption, sub, scene_name)
# ---------------------------------------------------------------
VARIANTS = {
    "B": {
        "file": "clausery-short-ad-vB.mp4",
        "duration": 23.5,
        "beats": [
            (0.0,  0.8,  "I tested 7", "free invoice tools",   "hook_list"),
            (0.8,  3.2,  "Six forced signup.", "One didn't.",     "hook_list"),
            (3.2,  5.0,  "This is the one.",   None,              "reveal"),
            (5.0,  9.5,  "Makes a normal Word file", "in your browser", "demo"),
            (9.5,  14.5, "Fill in the fields\u2026", None,        "demo"),
            (14.5, 17.5, "Click Download Word.", None,            "click"),
            (17.5, 20.0, "NO signup.  NO card.", None,            "nocheck"),
            (20.0, 23.5, "87 templates", "all free. LINK IN BIO", "cta"),
        ],
        "kind_for_caption": {
            "hook_list": "hook", "reveal": "reveal", "demo": "demo1",
            "click": "click", "nocheck": "nocheck",
        },
    },
    "C": {
        "file": "clausery-short-ad-vC.mp4",
        "duration": 22.0,
        "beats": [
            (0.0,  3.0,  "Why does every", "invoice app do this?", "hook_wall"),
            (3.0,  5.0,  "This one doesn't.", None,                 "reveal"),
            (5.0,  9.0,  "Just a normal Word file", "in your browser", "demo"),
            (9.0,  13.5, "Fill it in\u2026", None,                     "demo"),
            (13.5, 16.5, "Click Download Word.", None,                "click"),
            (16.5, 18.8, "NO signup.  NO card.", None,                "nocheck"),
            (18.8, 22.0, "Clausery", "getclausery.github.io/go/",     "cta"),
        ],
        "kind_for_caption": {
            "hook_wall": "hook", "reveal": "reveal", "demo": "demo1",
            "click": "click", "nocheck": "nocheck",
        },
    },
    "D": {
        "file": "clausery-short-ad-vD.mp4",
        "duration": 20.0,
        "beats": [
            (0.0,  2.0,  "The invoice hack", "saves 10 min/client",  "hook_blank"),
            (2.0,  3.5,  "Stop starting from scratch.", None,         "hook_blank"),
            (3.5,  5.2,  "This does it for you.", None,               "reveal"),
            (5.2,  8.5,  "Editable Word file", "right in your browser", "demo"),
            (8.5,  12.5, "Fill it in\u2026", None,                      "demo"),
            (12.5, 15.0, "Click Download Word.", None,                 "click"),
            (15.0, 17.0, "NO signup.  NO card.", None,                 "nocheck"),
            (17.0, 20.0, "Clausery", "LINK IN BIO",                    "cta"),
        ],
        "kind_for_caption": {
            "hook_blank": "hook", "reveal": "reveal", "demo": "demo1",
            "click": "click", "nocheck": "nocheck",
        },
    },
}

SCENES = {
    "hook_wall": scene_hook_wall,
    "hook_list": scene_hook_list,
    "hook_blank": scene_hook_blank,
    "reveal": scene_reveal,
    "pain": scene_pain,
    "demo": scene_demo,
    "click": scene_click,
    "nocheck": scene_nocheck,
    "free": scene_free,
    "cta": scene_cta,
    "hack_badge": scene_hack_badge,
}

def beat_for(beats, t):
    for b in beats:
        if b[0] <= t < b[1]:
            return b
    return beats[-1]

def render_variant(key):
    v = VARIANTS[key]
    beats = v["beats"]
    duration = v["duration"]
    n_frames = int(duration * FPS)
    out_mp4 = OUT_DIR / v["file"]
    print(f"\n=== Variant {key}: {duration}s, {n_frames} frames -> {out_mp4.name} ===", flush=True)

    # Spawn ffmpeg to read raw RGB frames from stdin and encode h264+aac faststart MP4.
    ffmpeg = ROOT.parent / "node_modules/@ffmpeg-installer/linux-x64/ffmpeg"
    cmd = [
        str(ffmpeg), "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24",
        "-s", f"{W}x{H}", "-r", str(FPS),
        "-i", "-",
        "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",  # silent stereo track
        "-shortest",
        "-c:v", "libx264", "-preset", "medium", "-crf", "23",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        "-c:a", "aac", "-b:a", "96k",
        str(out_mp4),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        for i in range(n_frames):
            t = i / FPS
            img = Image.new("RGB", (W, H), NAVY)
            d = ImageDraw.Draw(img)
            gradient(d)
            beat = beat_for(beats, t)
            kind = beat[4]
            # Logo watermark top-left
            d.text((60, 60), "C", font=fr(FONT_B, 32), fill=(255,255,255,120) or (255,255,255))
            # Draw scene
            scene_fn = SCENES[kind]
            if kind in ("hook_list",):
                scene_fn(d, t, beat, count=7, reveal_idx=6)
            else:
                scene_fn(d, t, beat)
            # Caption pill
            cap_kind = v["kind_for_caption"].get(kind, kind)
            pill_caption(d, beat[2], beat[3], y=1560, kind=cap_kind)
            proc.stdin.write(img.tobytes())
            if i % 90 == 0:
                print(f"  frame {i}/{n_frames} ({t:.1f}s)", flush=True)
        proc.stdin.close()
        proc.wait()
        if proc.returncode != 0:
            raise RuntimeError(f"ffmpeg exited {proc.returncode}")
        size_kb = out_mp4.stat().st_size / 1024
        print(f"  wrote {out_mp4} ({size_kb:.0f} KB)", flush=True)
    finally:
        if proc.poll() is None:
            proc.kill()

if __name__ == "__main__":
    for key in VARIANTS:
        render_variant(key)
    print("\nAll variants done.")
