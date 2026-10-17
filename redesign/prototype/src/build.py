"""시안 페이지 빌드: 실제 저장소의 고객사 로고·슬라이드를 data URI로, Pretendard를 사용 글자만 잘라 넣는다."""
import base64, re, io, mimetypes, sys
from pathlib import Path
from fontTools import subset
from PIL import Image
from fontTools.ttLib import TTFont

HERE = Path(__file__).parent
REPO = Path(__file__).resolve().parents[3]   # 저장소 루트 (redesign/prototype/src → 3단계 위)
# Pretendard 가변 폰트 TTF 경로 (npm pack pretendard@1.3.9 → package/dist/public/variable/PretendardVariable.ttf)
import os
FONT = Path(os.environ.get("PRETENDARD_TTF", str(Path(__file__).parent / "PretendardVariable.ttf")))

def data_uri(rel):
    p = REPO / "assets/img" / rel
    mt = mimetypes.guess_type(p.name)[0] or "image/png"
    if p.suffix == ".svg": mt = "image/svg+xml"
    return f"data:{mt};base64," + base64.b64encode(p.read_bytes()).decode()

src = (HERE / "template.html").read_text()

# 고객사 띠: index.html의 두 줄을 그대로 읽어 칩으로 변환 (로고·이름·순서 유지)
idx = (REPO / "index.html").read_text()
rows = re.findall(r'<div class="marquee(?: marquee--rev)?"><div class="marquee__row">(.*?)</div></div>', idx, re.S)
def logo_cls(rel):
    p = REPO / "assets/img" / rel
    if any(k in rel for k in ("samsungcnt", "woori", "lh.", "nh.")): return "gray"
    if p.suffix == ".svg": return "sil"
    im = Image.open(p)
    if im.mode in ("RGBA", "LA") or "transparency" in im.info:
        a = im.convert("RGBA").getchannel("A")
        if a.getextrema()[0] < 200: return "sil"
    return "inv"
def chips(row):
    out = []
    for m in re.finditer(r'<span class="logo-chip([^"]*)">(.*?)</span>(?=<span class="logo-chip|\s*$)', row.strip(), re.S):
        cls, inner = m.group(1), m.group(2)
        img = re.search(r'src="assets/img/([^"]+)"[^>]*alt="([^"]*)"', inner)
        name = re.sub(r"<[^>]+>", "", inner).strip()
        dark = " chip--dark" if "logo-chip--dark" in cls else ""
        if img and (REPO / "assets/img" / img.group(1)).exists():
            alt = img.group(2) or name
            label = f'<span>{name}</span>' if name else ""
            out.append(f'<span class="chip{dark}"><img class="{logo_cls(img.group(1))}" src="{data_uri(img.group(1))}" alt="{alt}" loading="lazy">{label}</span>')
        else:
            out.append(f'<span class="chip{dark}">{name}</span>')
    return "".join(out)
r1, r2 = chips(rows[0]), chips(rows[1])
src = src.replace("{{ROW1}}{{ROW1}}", r1 + r1.replace('alt="', 'aria-hidden="true" alt="'))
src = src.replace("{{ROW2}}{{ROW2}}", r2 + r2.replace('alt="', 'aria-hidden="true" alt="'))
src = re.sub(r"\{\{ASSET:([^}]+)\}\}", lambda m: data_uri(m.group(1)), src)
src = re.sub(r"\{\{IMGW:([^}]+)\}\}", lambda m: "data:image/webp;base64," + base64.b64encode((HERE / m.group(1)).read_bytes()).decode(), src)
src = re.sub(r"\{\{IMG:([^}]+)\}\}", lambda m: "data:image/jpeg;base64," + base64.b64encode((HERE / m.group(1)).read_bytes()).decode(), src)

# 폰트: 페이지에 쓰인 글자 + 기본 라틴만 남긴다
text = re.sub(r"data:[^\"')]+", "", src)
chars = set(text) | set(map(chr, range(0x20, 0x7f))) | set("·—→←↗※★")
opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = ["*"]
f = TTFont(FONT)
sub = subset.Subsetter(opts); sub.populate(unicodes=[ord(c) for c in chars]); sub.subset(f)
buf = io.BytesIO(); f.flavor = "woff2"; f.save(buf)
src = src.replace("{{FONT}}", base64.b64encode(buf.getvalue()).decode())

out = HERE.parent / "index.html"
out.write_text(src)
print(out, round(len(src) / 1024), "KB", "font", round(len(buf.getvalue()) / 1024), "KB", "chips", r1.count("chip"), r2.count("chip"))
