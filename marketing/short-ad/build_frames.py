#!/usr/bin/env python3
"""
Build a 9:16 vertical short ad for Clausery.
Concept: "Stop scrolling if you send invoices" — 3-act screen demo.
  Act 1 (0-3.5s):  Hook over red "wall" (the signup-gate pattern-interrupt)
  Act 2 (3.5-18.5s): Product demo — filling a Word invoice in the browser
  Act 3 (18.5-25.5s): Payoff — NO signup / NO card / 87 FREE / logo + link
Output: 1080x1920 PNG frames at 30fps for ~25.5s.
"""
import os, subprocess, math, pathlib, sys

ROOT = pathlib.Path(__file__).parent
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
W, H = 1080, 1920
FPS = 30
TOTAL_S = 25.5
N = int(TOTAL_S * FPS)

FRAMES = ROOT / "frames"
FRAMES.mkdir(exist_ok=True)

BRAND_DARK   = "#0f1d2e"
BRAND_ACCENT = "#2997ff"
BRAND_GREEN  = "#22c55e"
BRAND_RED    = "#ef4444"
BRAND_GOLD   = "#f59e0b"
BRAND_CREAM  = "#fff7ed"
WHITE        = "#ffffff"
GREY_TEXT    = "#cbd5e1"

BEATS = [
    (0.0, 1.6, "STOP SCROLLING",       "if you send invoices", "hook"),
    (1.6, 3.5, "Every invoice app",    "forces you to sign up","pain"),
    (3.5, 6.2, "This one doesn\u2019t.", None,                   "reveal"),
    (6.2, 10.0, "It makes a normal Word file", "right in your browser", "demo1"),
    (10.0, 14.5,"Fill in the fields\u2026", None,                  "typing"),
    (14.5, 17.5,"Click Download Word.", None,                      "click"),
    (17.5, 20.0,"NO signup.  NO card.", None,                      "nocheck"),
    (20.0, 22.5,"87 templates",        "all free.",              "free"),
    (22.5, 25.5,"Clausery",            "getclausery.github.io",  "cta"),
]

def beat_at(t):
    for b in BEATS:
        if b[0] <= t < b[1]:
            return b
    return BEATS[-1]

def esc(s):
    """Escape a string for use inside a single-quoted ImageMagick -draw argument."""
    if s is None:
        return ""
    return (str(s)
            .replace("\\", "\\\\")
            .replace("'",  "\u2019")    # right single quote (apostrophe-safe)
            .replace(":",  "\\:")
            .replace("%",  "%%"))

def txt(draw_list, x, y, text, font=FONT, size=48, fill=WHITE, gravity="NorthWest"):
    """Add a text draw primitive.

    With NorthWest gravity, (x,y) is the top-left origin pixel.
    With Center   gravity, (x,y) is the absolute CENTER pixel of the canvas for that
                    baseline. We translate to IM's offset-from-center coordinates.
    """
    g = gravity
    if g == "Center":
        x = x - W//2
        y = y - H//2
    draw_list += ["-fill", fill, "-font", font, "-pointsize", str(size),
                  "-gravity", g,
                  "-draw", f"text {x},{y} '{esc(text)}'"]

def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def draw_frame(idx):
    t = idx / FPS
    out = FRAMES / f"f{idx:05d}.png"
    beat = beat_at(t)
    kind = beat[4]

    if kind in ("hook", "pain"):
        bg_bot, bg_top = "#7f1d1d", BRAND_RED
    elif kind == "reveal":
        bg_bot, bg_top = "#050a12", BRAND_DARK
    else:
        bg_bot, bg_top = "#11263d", BRAND_DARK

    bp = max(0.0, min(1.0, (t - beat[0]) / 0.35))

    cmd = ["convert", "-size", f"{W}x{H}",
           f"gradient:{bg_bot}-{bg_top}",
           "-rotate", "180", "-quality", "95"]

    # ---------------- Act 1: hook + signup wall ----------------
    if kind in ("hook", "pain"):
        oy = int(-60 * (1 - bp))
        mx, my, mw, mh = int(W*0.12), int(H*0.22)+oy, int(W*0.76), int(H*0.45)
        cmd += ["-fill", BRAND_CREAM,
                "-draw", f"roundrectangle {mx},{my} {mx+mw},{my+mh} 36,36"]
        txt(cmd, mx+48, my+76, "Invoice App", size=46, fill="#1f2937")
        f_y = my + 140
        for i, label in enumerate(["Email", "Password"]):
            fy = f_y + i*110
            cmd += ["-fill", "#e5e7eb",
                    "-draw", f"roundrectangle {mx+40},{fy} {mx+mw-40},{fy+70} 12,12"]
            txt(cmd, mx+60, fy+46, label, font=FONT_REG, size=28, fill="#9ca3af")
        by = f_y + 230
        cmd += ["-fill", BRAND_RED,
                "-draw", f"roundrectangle {mx+40},{by} {mx+mw-40},{by+80} 14,14"]
        txt(cmd, mx+120, by+52, "Sign up to download", size=30, fill=WHITE)


    # ---------------- Reveal: browser with 3 checks ----------------
    elif kind == "reveal":
        bx, by, bw, bh = int(W*0.06), int(H*0.18), int(W*0.88), int(H*0.62)
        cmd += ["-fill", "#1e293b",
                "-draw", f"roundrectangle {bx},{by} {bx+bw},{by+bh} 24,24"]
        for i, c in enumerate(["#ef4444","#f59e0b","#22c55e"]):
            cmd += ["-fill", c,
                    "-draw", f"circle {bx+50+i*44},{by+60} {bx+64+i*44},{by+60}"]
        cmd += ["-fill", "#0f172a",
                "-draw", f"roundrectangle {bx+200},{by+36} {bx+bw-40},{by+86} 18,18"]
        txt(cmd, bx+230, by+74, "getclausery.github.io  \u2713  open source",
            size=28, fill=BRAND_GREEN)
        lines = ["\u2713  No account", "\u2713  No card", "\u2713  Works in your browser"]
        for i, line in enumerate(lines):
            appear = t - 4.2 - i*0.45
            if appear > 0:
                ly = by + 220 + i*130
                txt(cmd, bx+120, ly, line, size=54, fill=BRAND_GREEN)

    # ---------------- Demo: browser with invoice form ----------------
    elif kind in ("demo1", "typing", "click"):
        # Smaller, higher browser so the pill below it fits without overlap.
        bx, by, bw, bh = int(W*0.04), int(H*0.10), int(W*0.92), int(H*0.60)
        cmd += ["-fill", "#ffffff",
                "-draw", f"roundrectangle {bx},{by} {bx+bw},{by+bh} 24,24"]
        for i, c in enumerate(["#ef4444","#f59e0b","#22c55e"]):
            cmd += ["-fill", c,
                    "-draw", f"circle {bx+50+i*44},{by+60} {bx+64+i*44},{by+60}"]
        cmd += ["-fill", "#f1f5f9",
                "-draw", f"roundrectangle {bx+200},{by+36} {bx+bw-40},{by+86} 16,16"]
        txt(cmd, bx+230, by+72, "getclausery.github.io/app/",
            font=FONT_REG, size=26, fill="#334155")
        cy = by + 140
        txt(cmd, bx+50, cy, "New invoice", size=44, fill="#0f172a")
        fields = [
            ("From",       "Alex Design Studio"),
            ("To",         "Acme Coffee Co."),
            ("Invoice #",  "INV-0042"),
            ("Item",       "Logo design + 3 revisions"),
            ("Amount",     "$1,250.00"),
        ]
        base_t = 10.0
        field_gap = 92   # vertical spacing between field rows (fits 5 rows)
        label_offset = 20  # label baseline above box top
        box_h = 64
        for i,(label,val) in enumerate(fields):
            appear = t - base_t - i*0.75
            fy = cy + 70 + i*field_gap           # top of the input box
            # Placeholder (or typed value) inside the box; labels are omitted in this
            # phone-sized compact view to keep the layout looking like a real app.
            typed = val
            if appear < 0:
                # empty box (no placeholder for not-yet-active fields)
                cmd += ["-fill", "#ffffff", "-stroke", "#cbd5e1", "-strokewidth", "2",
                        "-draw", f"roundrectangle {bx+50},{fy} {bx+bw-50},{fy+box_h} 10,10",
                        "-stroke", "none"]
                continue
            is_typing_this = is_typing = (kind == "typing")
            ph_color = "#94a3b8"
            if is_typing and appear < 0.8:
                n = int(len(val) * max(0.0, appear/0.8))
                if n == 0:
                    typed = label + "|"
                    text_color = ph_color
                else:
                    typed = val[:max(1, n)] + "|"
                    text_color = "#0f172a"
            else:
                text_color = "#0f172a"
            cmd += ["-fill", "#ffffff", "-stroke", "#cbd5e1", "-strokewidth", "2",
                    "-draw", f"roundrectangle {bx+50},{fy} {bx+bw-50},{fy+box_h} 10,10",
                    "-stroke", "none"]
            txt(cmd, bx+78, fy+box_h-16, typed, font=FONT_REG, size=28, fill=text_color)
        but_h = 78
        but_y = by + bh - but_h - 30  # button top, with 30px padding above browser bottom
        button_label = "Download Word (.docx)"
        if kind == "click":
            pulse = 1.0 + 0.06*math.sin((t-14.5)*14)
            bw2 = int((bw-100)*pulse)
            bx2 = bx + 50 + ((bw-100)-bw2)//2
            cmd += ["-fill", BRAND_ACCENT,
                    "-draw", f"roundrectangle {bx2},{but_y} {bx2+bw2},{but_y+but_h} 14,14"]
            txt(cmd, bx+bw//2, but_y+but_h//2+10, button_label,
                size=32, fill=WHITE, gravity="Center")
            if t > 15.8:
                tx, ty, tw, th = bx+bw-330, by+110, 280, 52
                cmd += ["-fill", BRAND_GREEN,
                        "-draw", f"roundrectangle {tx},{ty} {tx+tw},{ty+th} 14,14"]
                txt(cmd, tx+tw//2, ty+th//2+8, "Saved to device",
                    size=24, fill=WHITE, gravity="Center")
        else:
            cmd += ["-fill", BRAND_ACCENT,
                    "-draw", f"roundrectangle {bx+50},{but_y} {bx+bw-50},{but_y+but_h} 14,14"]
            txt(cmd, bx+bw//2, but_y+but_h//2+10, button_label,
                size=32, fill=WHITE, gravity="Center")

    # ---------------- Payoff: NO signup / NO card ----------------
    elif kind == "nocheck":
        rows = [("NO signup", BRAND_GREEN, "\u2713"),
                ("NO card",   BRAND_GREEN, "\u2713")]
        for i,(lab,c,ic) in enumerate(rows):
            appear = t - beat[0] - i*0.45
            s = min(1.0, max(0.0, appear)/0.35)
            fsize = int(110 * (0.7 + 0.3*s))
            txt(cmd, W//2, int(H*0.36) + i*240 + fsize//3,
                f"{ic}  {lab}", size=fsize, fill=c, gravity="Center")

    elif kind == "free":
        appear = (t - beat[0]) / (beat[1] - beat[0])
        fs = int(170 * (0.6 + 0.4*min(1.0, appear/0.5)))
        txt(cmd, W//2, int(H*0.42), "87 templates", size=fs, fill=BRAND_GOLD, gravity="Center")
        txt(cmd, W//2, int(H*0.52), "ALL FREE.", size=90, fill=BRAND_GREEN, gravity="Center")
        txt(cmd, W//2, int(H*0.62), "(and they open in Word)",
            font=FONT_REG, size=36, fill=GREY_TEXT, gravity="Center")

    elif kind == "cta":
        appear = (t - beat[0]) / (beat[1] - beat[0])
        fs = int(140 * (0.8 + 0.2*min(1.0, appear/0.4)))
        txt(cmd, W//2, int(H*0.38), "Clausery", size=fs, fill=WHITE, gravity="Center")
        txt(cmd, W//2, int(H*0.48), "getclausery.github.io",
            font=FONT_REG, size=46, fill=BRAND_ACCENT, gravity="Center")
        pulse = 0.85 + 0.15*math.sin((t-22.5)*6)
        pf = int(56 * pulse)
        txt(cmd, W//2, int(H*0.68), "LINK IN BIO",
            size=pf, fill=BRAND_GOLD, gravity="Center")

    # ---------------- Caption pill ----------------
    # Place the pill in the lower-third safe area, well above the iOS home indicator
    # and TikTok/Reels action rail (which sits ~1740+). Keep top of pill at ~1440.
    caption = beat[2]
    sub = beat[3]
    cap_y = 1560                # baseline of the main caption line
    cfs = 88 if len(caption) < 18 else 74
    if len(caption) >= 26: cfs = 62
    pill_w = int(len(caption) * cfs * 0.55 + 140)
    pill_h = cfs + 80           # top+bottom padding around main line
    if sub:
        pill_h += 110
        pill_w = max(pill_w, int(len(sub) * 48 * 0.55 + 140))
    pill_x = (W - pill_w)//2
    pill_y = cap_y - cfs - 20
    cmd += ["-fill", "rgba(0,0,0,0.75)",
            "-draw", f"roundrectangle {pill_x},{pill_y} {pill_x+pill_w},{pill_y+pill_h} 28,28"]
    # When using gravity=Center in ImageMagick, (0,0) is the canvas center.
    # Compute pixel y as distance from the canvas midline, where positive = down.
    canvas_mid_y = H // 2
    def y_from_center(abs_y):
        return abs_y - canvas_mid_y
    main_abs_y = pill_y + 28 + int(cfs * 0.75)
    my = y_from_center(main_abs_y)
    # Shadow + main caption
    cmd += ["-fill", "rgba(0,0,0,0.6)", "-font", FONT, "-pointsize", str(cfs),
            "-gravity", "Center",
            "-draw", f"text 2,{my+2} '{esc(caption)}'"]
    cmd += ["-fill", WHITE, "-font", FONT, "-pointsize", str(cfs),
            "-gravity", "Center",
            "-draw", f"text 0,{my} '{esc(caption)}'"]
    if sub:
        sub_abs_y = main_abs_y + cfs//2 + 55
        sy = y_from_center(sub_abs_y)
        sub_color = BRAND_GOLD if kind in ("hook","nocheck","free","cta") else WHITE
        cmd += ["-fill", "rgba(0,0,0,0.5)", "-font", FONT, "-pointsize", "46",
                "-gravity", "Center",
                "-draw", f"text 1,{sy+1} '{esc(sub)}'"]
        cmd += ["-fill", sub_color, "-font", FONT, "-pointsize", "46",
                "-gravity", "Center",
                "-draw", f"text 0,{sy} '{esc(sub)}'"]

    # Watermark (top-left safe area)
    txt(cmd, 60, 60, "C", size=36, fill="rgba(255,255,255,0.4)")

    cmd += [str(out)]
    run(cmd)

if __name__ == "__main__":
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    end   = int(sys.argv[2]) if len(sys.argv) > 2 else N
    print(f"Rendering frames {start}..{end-1} of {N}", flush=True)
    for i in range(start, end):
        draw_frame(i)
        if i % 60 == 0:
            print(f"  frame {i}/{N} ({i/FPS:.1f}s)", flush=True)
    print("Done.")
