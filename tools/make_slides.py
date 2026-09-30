#!/usr/bin/env python3
"""홈페이지 장식용 샘플 슬라이드(SVG) 생성기.

실행: python3 tools/make_slides.py  ->  assets/img/slides/*.svg
실제 고객사 작업물이 아니라, 사이트 분위기를 위한 가상의 샘플 디자인입니다.
"""
import os
import random

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "img", "slides")
F = "Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
W, H = 1600, 900


def doc(body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
            f"<defs>{defs}</defs>{body}</svg>")


def rect(x, y, w, h, fill, rx=0, op=1, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" opacity="{op}" {extra}/>'


def circle(cx, cy, r, fill="none", op=1, extra=""):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" opacity="{op}" {extra}/>'


def text(x, y, s, size, fill, weight=700, anchor="start", ls=0, op=1, fam=F):
    return (f'<text x="{x}" y="{y}" font-family="{fam}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}" letter-spacing="{ls}" opacity="{op}">{s}</text>')


def bars(x, y, widths, fill, h=12, gap=26, op=1):
    return "".join(rect(x, y + i * gap, w, h, fill, rx=h / 2, op=op) for i, w in enumerate(widths))


def lin(id_, stops, x2=1, y2=1):
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{id_}" x1="0" y1="0" x2="{x2}" y2="{y2}">{s}</linearGradient>'


def rad(id_, c, op=1):
    return (f'<radialGradient id="{id_}"><stop offset="0" stop-color="{c}" stop-opacity="{op}"/>'
            f'<stop offset="1" stop-color="{c}" stop-opacity="0"/></radialGradient>')


def header(label, title, lc, tc, x=120):
    return text(x, 150, label, 22, lc, 700, ls=6) + text(x, 225, title, 60, tc, 800, ls=-1)


SLIDES = {}


def slide(name):
    def deco(fn):
        SLIDES[name] = fn
        return fn
    return deco


# ---------------- IR ----------------
@slide("ir-cover")
def _():
    defs = lin("bg", [(0, "#0B1B33"), (1, "#12306A")]) + rad("glow", "#3D7BFF", .9)
    b = rect(0, 0, W, H, "url(#bg)")
    b += circle(1220, 450, 420, "url(#glow)", .55)
    b += circle(1220, 450, 280, "none", .5, 'stroke="#6FA0FF" stroke-width="2"')
    b += circle(1220, 450, 200, "none", .35, 'stroke="#6FA0FF" stroke-width="2" stroke-dasharray="6 10"')
    b += circle(1220, 450, 120, "#3D7BFF")
    b += circle(1500, 450, 12, "#fff") + circle(1079, 309, 8, "#6FA0FF")
    b += text(120, 190, "INVESTOR DECK 2026", 22, "#6FA0FF", 700, ls=6)
    b += text(120, 380, "Moving Mobility", 92, "#fff", 800, ls=-2)
    b += text(120, 485, "Forward.", 92, "#fff", 800, ls=-2)
    b += bars(120, 560, [520, 420], "#fff", h=14, gap=32, op=.3)
    b += rect(120, 740, 1360, 1, "#fff", op=.15)
    b += text(120, 800, "ORBIT MOBILITY", 24, "#fff", 700, ls=4)
    b += text(1480, 800, "01", 24, "#fff", 600, "end", op=.5)
    return doc(b, defs)


@slide("ir-market")
def _():
    b = rect(0, 0, W, H, "#0A1426")
    b += header("MARKET", "Market Opportunity", "#6FA0FF", "#fff")
    b += circle(520, 590, 270, "#3D7BFF", .14, 'stroke="#3D7BFF" stroke-width="2"')
    b += circle(520, 670, 190, "#3D7BFF", .3)
    b += circle(520, 760, 100, "#3D7BFF")
    b += text(520, 380, "TAM", 26, "#6FA0FF", 700, "middle", ls=3)
    b += text(520, 540, "SAM", 26, "#fff", 700, "middle", ls=3, op=.85)
    b += text(520, 772, "SOM", 30, "#fff", 800, "middle", ls=3)
    for i, (num, lab) in enumerate([("$4.2B", "Total Addressable Market"), ("$820M", "Serviceable Available"), ("$96M", "Serviceable Obtainable")]):
        y = 360 + i * 170
        b += text(980, y, num, 64, "#6FA0FF" if i == 0 else "#fff", 800, ls=-1)
        b += text(980, y + 44, lab, 24, "#fff", 500, op=.55)
        b += rect(980, y + 76, 500, 1, "#fff", op=.12)
    return doc(b)


@slide("ir-traction")
def _():
    b = rect(0, 0, W, H, "#FFFFFF")
    b += header("TRACTION", "Proven Growth", "#1F4FE0", "#0E1624")
    base = 800
    for i in range(5):
        b += rect(120, base - i * 110, 900, 1, "#E3E8F0")
    hs = [60, 95, 135, 180, 235, 295, 370, 450]
    pts = []
    for i, h in enumerate(hs):
        x = 140 + i * 110
        b += rect(x, base - h, 64, h, "#1F4FE0" if i == len(hs) - 1 else "#D6E0F7", rx=10)
        pts.append((x + 32, base - h - 40))
    b += ('<polyline points="' + " ".join(f"{x},{y}" for x, y in pts) +
          '" fill="none" stroke="#0E1624" stroke-width="4" stroke-linejoin="round"/>')
    for x, y in pts:
        b += circle(x, y, 8, "#fff", 1, 'stroke="#0E1624" stroke-width="4"')
    b += rect(1110, 300, 370, 500, "#0E1624", rx=28)
    b += text(1150, 430, "+312%", 92, "#fff", 800, ls=-2)
    b += text(1150, 480, "YoY Revenue Growth", 24, "#fff", 500, op=.6)
    b += bars(1150, 560, [290, 250, 270], "#fff", h=12, gap=30, op=.22)
    b += rect(1150, 700, 150, 48, "#1F4FE0", rx=24) + text(1225, 732, "Series A", 20, "#fff", 700, "middle")
    return doc(b)


@slide("ir-bm")
def _():
    defs = lin("bg", [(0, "#140F33"), (1, "#3A1C78")])
    b = rect(0, 0, W, H, "url(#bg)")
    b += header("HOW WE MAKE MONEY", "Business Model", "#B79BFF", "#fff")
    for i, lab in enumerate(["Acquire", "Engage", "Monetize"]):
        x = 120 + i * 480
        b += rect(x, 310, 400, 380, "#fff", rx=28, op=.07)
        b += rect(x, 310, 400, 380, "none", rx=28, extra='stroke="#fff" stroke-opacity=".16" stroke-width="2"')
        b += circle(x + 80, 390, 40, "#B79BFF") + text(x + 80, 402, f"0{i + 1}", 28, "#140F33", 800, "middle")
        b += text(x + 40, 500, lab, 40, "#fff", 800)
        b += bars(x + 40, 540, [300, 260, 220], "#fff", h=12, gap=28, op=.28)
        if i < 2:
            ax = x + 410
            b += (f'<path d="M{ax} 500 h50 m-14 -14 l14 14 l-14 14" fill="none" stroke="#B79BFF" '
                  'stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>')
    b += rect(120, 750, 1360, 76, "#B79BFF", rx=38, op=.18)
    b += text(800, 798, "Subscription  +  Transaction Fee", 28, "#fff", 700, "middle", ls=1)
    return doc(b, defs)


@slide("ir-team")
def _():
    defs = lin("av", [(0, "#3A3F48"), (1, "#16181C")]) + rad("glow", "#FF6B3D", .5)
    b = rect(0, 0, W, H, "#0A0A0B") + circle(800, 900, 600, "url(#glow)", .5)
    b += header("LEADERSHIP", "Meet the Team", "#FF6B3D", "#fff")
    for i, role in enumerate(["CEO", "CTO", "COO", "CMO"]):
        cx = 260 + i * 360
        b += circle(cx, 470, 120, "url(#av)")
        b += circle(cx, 430, 42, "#fff", .14)
        b += f'<path d="M{cx - 78} 560 a78 70 0 0 1 156 0" fill="#fff" opacity=".14"/>'
        b += (f'<circle cx="{cx}" cy="470" r="136" fill="none" stroke="#FF6B3D" stroke-width="4" '
              f'stroke-dasharray="210 700" transform="rotate({-90 + i * 40} {cx} 470)"/>')
        b += text(cx, 680, role, 36, "#fff", 800, "middle", ls=2)
        b += rect(cx - 90, 712, 180, 12, "#fff", rx=6, op=.3) + rect(cx - 65, 738, 130, 12, "#fff", rx=6, op=.18)
    return doc(b, defs)


@slide("demo-day")
def _():
    defs = rad("glow", "#FF6B3D", .9)
    b = rect(0, 0, W, H, "#0A0A0B") + circle(800, 760, 700, "url(#glow)", .45)
    for i in range(-8, 9):
        b += f'<line x1="800" y1="560" x2="{800 + i * 260}" y2="900" stroke="#FF6B3D" stroke-opacity=".35" stroke-width="2"/>'
    for j, yv in enumerate([600, 650, 720, 810]):
        b += f'<line x1="0" y1="{yv}" x2="1600" y2="{yv}" stroke="#FF6B3D" stroke-opacity="{.15 + j * .07:.2f}" stroke-width="2"/>'
    b += text(800, 230, "DEMO DAY 2026", 24, "#FF6B3D", 700, "middle", ls=8)
    b += text(800, 390, "Pitch the Future", 110, "#fff", 800, "middle", ls=-3)
    b += bars(560, 440, [480], "#fff", h=14, op=.3)
    b += rect(700, 490, 200, 50, "#FF6B3D", rx=25) + text(800, 523, "TEAM 07", 20, "#0A0A0B", 800, "middle", ls=2)
    return doc(b, defs)


# ---------------- 제안서 ----------------
@slide("prop-cover")
def _():
    b = rect(0, 0, W, H, "#FFFFFF") + rect(0, 0, W, 14, "#1F4FE0")
    b += rect(120, 250, 8, 300, "#1F4FE0")
    b += text(160, 290, "TECHNICAL PROPOSAL", 22, "#1F4FE0", 700, ls=6)
    b += text(160, 395, "Smart Farm", 84, "#0E1624", 800, ls=-2)
    b += text(160, 495, "Platform Proposal", 84, "#0E1624", 800, ls=-2)
    b += bars(160, 560, [520, 400], "#C9D1DE", h=14, gap=32)
    b += rect(1000, 190, 480, 520, "#EEF2FA", rx=40)
    random.seed(3)
    for r in range(4):
        for c in range(4):
            b += rect(1060 + c * 95, 250 + r * 105, 70, 70, "#1F4FE0", rx=16, op=random.choice([.15, .3, .5, .8, 1]))
    b += rect(120, 770, 1360, 1, "#E3E8F0")
    b += text(120, 830, "2026. 09", 22, "#6B7383", 600, ls=2)
    b += rect(1200, 796, 120, 44, "#EEF2FA", rx=8) + rect(1360, 796, 120, 44, "#EEF2FA", rx=8)
    return doc(b)


@slide("prop-process")
def _():
    b = rect(0, 0, W, H, "#FFFFFF")
    b += header("PROCESS", "Implementation Process", "#1F4FE0", "#0E1624")
    cols = ["#E6ECFB", "#C8D6F8", "#98B2F1", "#5A84E8", "#1F4FE0"]
    w, h, y, tip = 262, 150, 330, 36
    for i in range(5):
        x = 120 + i * (w + 12)
        d = f"M{x} {y} h{w - tip} l{tip} {h / 2} l{-tip} {h / 2} h{-(w - tip)} " + ("z" if i == 0 else f"l{tip} {-h / 2} z")
        b += f'<path d="{d}" fill="{cols[i]}"/>'
        b += text(x + w / 2 + (0 if i == 0 else 14), y + h / 2 + 16, f"0{i + 1}", 44, "#fff" if i >= 3 else "#1F4FE0", 800, "middle")
        b += rect(x + 10, 540, 170, 16, "#0E1624", rx=8)
        b += bars(x + 10, 580, [220, 190, 200], "#C9D1DE", h=11, gap=26)
    b += rect(120, 740, 1360, 90, "#F4F6FA", rx=18)
    b += bars(160, 779, [700], "#C9D1DE", h=12) + rect(1260, 767, 180, 36, "#1F4FE0", rx=18)
    return doc(b)


@slide("prop-org")
def _():
    b = rect(0, 0, W, H, "#F7F8FB")
    b += header("ORGANIZATION", "Project Organization", "#1F4FE0", "#0E1624")
    st = 'stroke="#B9C3D6" stroke-width="3" fill="none"'
    b += rect(650, 290, 300, 90, "#1F4FE0", rx=18) + text(800, 348, "PM", 34, "#fff", 800, "middle", ls=2)
    b += f'<path d="M800 380 v40 M360 420 H1240 M360 420 v40 M800 420 v40 M1240 420 v40" {st}/>'
    for cx, lab in [(360, "Planning"), (800, "Design"), (1240, "Development")]:
        b += rect(cx - 150, 460, 300, 90, "#fff", rx=18, extra='stroke="#D5DBE6" stroke-width="2"')
        b += text(cx, 518, lab, 30, "#0E1624", 800, "middle")
        b += f'<path d="M{cx} 550 v40 M{cx - 80} 590 H{cx + 80} M{cx - 80} 590 v40 M{cx + 80} 590 v40" {st}/>'
        for dx in (-80, 80):
            b += rect(cx + dx - 70, 630, 140, 70, "#E6ECFB", rx=14)
            b += rect(cx + dx - 40, 660, 80, 10, "#1F4FE0", rx=5, op=.5)
    b += bars(120, 790, [600], "#C9D1DE", h=12)
    return doc(b)


@slide("prop-schedule")
def _():
    b = rect(0, 0, W, H, "#FFFFFF")
    b += header("SCHEDULE", "Project Timeline", "#1F4FE0", "#0E1624")
    x0, cw = 440, 86
    for m in range(12):
        b += text(x0 + m * cw + cw / 2, 300, f"M{m + 1}", 18, "#8A93A3", 700, "middle")
    tasks = [(0, 3, "#98B2F1"), (2, 5, "#5A84E8"), (4, 9, "#1F4FE0"), (6, 10, "#5A84E8"), (9, 12, "#98B2F1"), (11, 12, "#0E1624")]
    widths = [210, 170, 230, 190, 160, 200]
    for i, (s, e, c) in enumerate(tasks):
        y = 330 + i * 78
        if i % 2 == 0:
            b += rect(120, y, 1360, 78, "#F6F8FB")
        b += rect(150, y + 32, widths[i], 14, "#0E1624", rx=7, op=.75)
        b += rect(x0 + s * cw + 6, y + 22, (e - s) * cw - 12, 34, c, rx=17)
    for m in range(13):
        b += rect(x0 + m * cw, 320, 1, 480, "#EDF0F5")
    return doc(b)


# ---------------- 회사소개서 ----------------
@slide("prof-cover")
def _():
    b = rect(0, 0, W, H, "#EFE9DC")
    b += rect(960, 170, 270, 780, "#0A3A5C", rx=135)
    b += rect(1190, 330, 270, 620, "#C9A96E", rx=135)
    b += circle(1330, 250, 70, "#D9825B")
    b += rect(0, 810, W, 90, "#E5DDCB")
    b += text(120, 250, "COMPANY PROFILE", 22, "#0A3A5C", 700, ls=6)
    b += text(120, 385, "Crafting", 100, "#1B2430", 800, ls=-3)
    b += text(120, 495, "Better Days.", 100, "#1B2430", 800, ls=-3)
    b += bars(120, 565, [480, 380], "#1B2430", h=14, gap=32, op=.2)
    b += text(120, 868, "HAVEN STUDIO  ·  2026", 22, "#6E6A60", 700, ls=3)
    return doc(b)


@slide("prof-vision")
def _():
    defs = (lin("ph", [(0, "#1E6B55"), (1, "#0B3B4A")]) +
            '<filter id="blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>'
            '<clipPath id="cp"><rect x="900" y="110" width="580" height="680" rx="36"/></clipPath>')
    b = rect(0, 0, W, H, "#0F2A22")
    b += text(120, 190, "OUR VISION", 22, "#3DDC97", 700, ls=6)
    b += text(110, 380, "“", 220, "#3DDC97", 800, op=.35)
    b += text(120, 450, "We design", 84, "#fff", 800, ls=-2)
    b += text(120, 550, "what’s next.", 84, "#fff", 800, ls=-2)
    b += bars(120, 620, [520, 460, 360], "#fff", h=13, gap=30, op=.25)
    b += ('<g clip-path="url(#cp)">' + rect(900, 110, 580, 680, "url(#ph)") +
          circle(1050, 300, 160, "#3DDC97", .55, 'filter="url(#blur)"') +
          circle(1350, 620, 200, "#7FE7FF", .35, 'filter="url(#blur)"') +
          circle(1260, 380, 90, "#fff", .25, 'filter="url(#blur)"') + "</g>")
    b += rect(940, 700, 220, 50, "#0F2A22", rx=25, op=.7) + text(1050, 733, "Since 2019", 20, "#fff", 700, "middle")
    return doc(b, defs)


@slide("prof-history")
def _():
    b = rect(0, 0, W, H, "#F5F1E8")
    b += header("HISTORY", "Our Journey", "#0A3A5C", "#1B2430")
    b += rect(160, 520, 1280, 4, "#0A3A5C", rx=2, op=.25) + rect(200, 520, 1200, 4, "#0A3A5C", rx=2)
    years = ["2021", "2022", "2023", "2024", "2025", "2026"]
    for i, yv in enumerate(years):
        x = 200 + i * 240
        last = i == len(years) - 1
        if last:
            b += circle(x, 522, 38, "#D9825B", .2)
        b += circle(x, 522, 22 if last else 14, "#D9825B" if last else "#0A3A5C")
        b += text(x, 460, yv, 40, "#1B2430", 800, "middle", op=1 if last else .8)
        b += rect(x - 80, 580, 160, 12, "#1B2430", rx=6, op=.25) + rect(x - 60, 606, 120, 12, "#1B2430", rx=6, op=.15)
    b += rect(120, 720, 1360, 110, "#0A3A5C", rx=22)
    b += bars(170, 769, [620], "#fff", h=13, op=.35) + text(1430, 790, "800+ Projects", 34, "#fff", 800, "end")
    return doc(b)


@slide("prof-clients")
def _():
    b = rect(0, 0, W, H, "#FFFFFF")
    b += header("CLIENTS", "Trusted Partners", "#1F4FE0", "#0E1624")
    random.seed(7)
    for r in range(3):
        for c in range(5):
            x, y = 120 + c * 281, 300 + r * 170
            b += rect(x, y, 236, 130, "#F4F6FA", rx=18)
            cx, cy = x + 70, y + 65
            col = random.choice(["#1F4FE0", "#0E1624", "#FF6B3D", "#14A3A3", "#8A93A3"])
            k = (r * 5 + c) % 4
            if k == 0:
                b += circle(cx, cy, 22, col)
            elif k == 1:
                b += rect(cx - 20, cy - 20, 40, 40, col, rx=8)
            elif k == 2:
                b += f'<path d="M{cx} {cy - 24} l24 42 h-48z" fill="{col}"/>'
            else:
                b += circle(cx, cy, 22, "none", 1, f'stroke="{col}" stroke-width="8"')
            b += rect(x + 106, y + 52, 100, 14, "#0E1624", rx=7, op=.7) + rect(x + 106, y + 76, 70, 10, "#8A93A3", rx=5, op=.5)
    return doc(b)


# ---------------- 기타 ----------------
@slide("edu-guide")
def _():
    b = rect(0, 0, W, H, "#FFFFFF")
    b += header("EDUCATION", "Training Guide", "#14A3A3", "#0E1624")
    for r in range(2):
        for c in range(3):
            x, y = 120 + c * 460, 300 + r * 260
            b += rect(x, y, 420, 220, "#F1F7F7", rx=24)
            b += circle(x + 70, y + 75, 38, "#14A3A3") + text(x + 70, y + 88, str(r * 3 + c + 1), 32, "#fff", 800, "middle")
            b += rect(x + 130, y + 58, 200, 18, "#0E1624", rx=9, op=.8)
            b += bars(x + 40, y + 140, [330, 280], "#9BB7B7", h=11, gap=26, op=.7)
    return doc(b)


@slide("annual-report")
def _():
    b = rect(0, 0, W, H, "#FFFFFF") + rect(0, 0, 620, H, "#0B1B33")
    b += text(100, 190, "ANNUAL REPORT", 22, "#6FA0FF", 700, ls=6)
    b += text(90, 420, "2026", 170, "#fff", 800, ls=-6)
    b += bars(100, 500, [400, 340, 370], "#fff", h=13, gap=30, op=.3)
    b += text(100, 820, "IMPACT &amp; PERFORMANCE", 20, "#fff", 700, ls=3, op=.6)
    cx, cy, r = 960, 430, 160
    circ = 2 * 3.14159 * r
    segs = [(.46, "#1F4FE0"), (.28, "#6FA0FF"), (.16, "#0E1624"), (.10, "#D6E0F7")]
    off = 0
    for p, c in segs:
        b += (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{c}" stroke-width="64" '
              f'stroke-dasharray="{p * circ:.1f} {circ:.1f}" stroke-dashoffset="{-off * circ:.1f}" transform="rotate(-90 {cx} {cy})"/>')
        off += p
    b += text(cx, cy + 18, "46%", 56, "#0E1624", 800, "middle")
    for i, (p, c) in enumerate(segs):
        y = 330 + i * 62
        b += rect(1220, y, 26, 26, c, rx=6) + rect(1266, y + 7, 160, 12, "#0E1624", rx=6, op=.6)
    for i, n in enumerate(["120+", "98%", "4.9"]):
        x = 720 + i * 260
        b += text(x, 760, n, 52, "#0E1624", 800) + rect(x, 786, 140, 11, "#8A93A3", rx=5, op=.5)
    return doc(b)


# ---------------- Before / After ----------------
@slide("before")
def _():
    fam = "Calibri, 'Malgun Gothic', Arial, sans-serif"
    b = rect(0, 0, W, H, "#FFFFFF")
    b += text(80, 120, "Business Overview and Strategy", 56, "#1F3864", 400, fam=fam)
    b += rect(80, 150, 1440, 3, "#4472C4")
    random.seed(11)
    y = 210
    for _blk in range(3):
        b += circle(96, y + 6, 6, "#333") + rect(120, y, random.randint(700, 1100), 16, "#444", rx=2, op=.8)
        y += 34
        for _k in range(random.randint(3, 4)):
            b += circle(136, y + 6, 4, "#666") + rect(156, y, random.randint(900, 1340), 13, "#777", rx=2, op=.7)
            y += 28
        y += 16
    b += rect(1080, 700, 440, 160, "none", extra='stroke="#999" stroke-width="2"')
    for i in range(1, 4):
        b += rect(1080, 700 + i * 40, 440, 1, "#999")
    for i in range(1, 3):
        b += rect(1080 + i * 147, 700, 1, 160, "#999")
    b += text(1540, 885, "3", 20, "#999", 400, "end", fam=fam)
    return doc(b)


@slide("after")
def _():
    defs = lin("bg", [(0, "#0B1B33"), (1, "#12306A")])
    b = rect(0, 0, W, H, "url(#bg)")
    b += text(120, 150, "BUSINESS OVERVIEW", 22, "#6FA0FF", 700, ls=6)
    b += text(120, 230, "Three Numbers That Matter", 60, "#fff", 800, ls=-1)
    for i, (n, lab) in enumerate([("3.2M", "Active Users"), ("₩12B", "Annual Revenue"), ("98%", "Retention Rate")]):
        x = 120 + i * 460
        b += rect(x, 300, 420, 250, "#fff", rx=28, op=.07) + rect(x, 300, 6, 250, "#3D7BFF", rx=3)
        b += text(x + 50, 420, n, 84, "#fff", 800, ls=-2) + text(x + 50, 475, lab, 26, "#fff", 500, op=.6)
    for i, lab in enumerate(["Problem", "Solution", "Growth"]):
        x = 120 + i * 460
        b += rect(x, 620, 420, 190, "none", rx=28, extra='stroke="#fff" stroke-opacity=".14" stroke-width="2"')
        b += circle(x + 60, 680, 22, "#3D7BFF") + text(x + 100, 691, lab, 30, "#fff", 800)
        b += bars(x + 40, 740, [320, 260], "#fff", h=11, gap=26, op=.25)
    return doc(b, defs)


@slide("tech-before")
def _():
    """텍스트로만 된 기술 설명 초안 (사례 2 입력 자료 예시)"""
    fam = "Calibri, 'Malgun Gothic', Arial, sans-serif"
    b = rect(0, 0, W, H, "#FFFFFF")
    b += text(80, 110, "System Architecture (Draft)", 52, "#222222", 400, fam=fam)
    random.seed(21)
    y = 170
    for _p in range(4):
        for _k in range(random.randint(4, 5)):
            b += rect(80, y, random.randint(1100, 1440), 13, "#8a8a8a", rx=2, op=.75)
            y += 26
        y += 26
    b += text(1540, 885, "7", 20, "#999", 400, "end", fam=fam)
    return doc(b)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, fn in SLIDES.items():
        with open(os.path.join(OUT, f"{name}.svg"), "w", encoding="utf-8") as f:
            f.write(fn())
    print(f"{len(SLIDES)} slides -> {os.path.normpath(OUT)}")
