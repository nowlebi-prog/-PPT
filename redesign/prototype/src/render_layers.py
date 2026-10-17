"""사진처럼 보이는 우주 배경을 물리적인 방식(HDR 누적 → 톤매핑)으로 렌더링한다.
행성 가장자리 너머로 빛이 막 떠오르는 순간 + 실제 망원경 별상(PSF) + 먼지 성운 + 필름 그레인."""
import sys, numpy as np
from PIL import Image

def fbm(h, w, rng, octaves=6, base=4, persist=0.55):
    out = np.zeros((h, w), np.float32); amp = 1.0; tot = 0
    for o in range(octaves):
        n = base * 2 ** o
        g = rng.random((max(2, int(n * h / w)) + 1, n + 1)).astype(np.float32)
        im = Image.fromarray(g).resize((w, h), Image.BICUBIC)
        out += np.asarray(im) * amp; tot += amp; amp *= persist
    out /= tot
    return (out - out.min()) / (out.max() - out.min())

def render(W, H, planet, glint_ang, seed, out, nebula_band, layered=False):
    rng = np.random.default_rng(seed)
    img = np.zeros((H, W, 3), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

    # 1) 먼지 성운 — 아주 옅게, 차가운 은회색
    n1 = fbm(H // 2, W // 2, rng, 7, 3); n2 = fbm(H // 2, W // 2, rng, 6, 5)
    neb = np.asarray(Image.fromarray(n1 * 0.7 + n2 * 0.3).resize((W, H), Image.BICUBIC))
    a, b, c, width = nebula_band     # 대각선 띠: a*x + b*y + c = 0
    d = (a * xx / W + b * yy / H + c) / np.hypot(a, b)
    band = np.exp(-(d / width) ** 2)
    dust = np.clip(neb - 0.48, 0, 1) ** 1.6 * band
    dark = np.clip(0.55 - fbm(H // 2, W // 2, rng, 6, 6), 0, 1)
    dark = np.asarray(Image.fromarray(dark).resize((W, H), Image.BICUBIC))
    dust *= (1 - dark * 1.4).clip(0, 1)
    img += dust[..., None] * np.array([0.050, 0.054, 0.062], np.float32) * 1.6

    # 2) 별 — 밝기 분포는 거듭제곱, 색은 온도에 따라
    N = int(W * H / 420)
    sx = rng.random(N) * W; sy = rng.random(N) * H
    mag = rng.pareto(2.1, N) * 0.05
    dens = 0.55 + 0.9 * band[sy.astype(int), sx.astype(int)]          # 성운 띠에 별이 더 많다
    keep = rng.random(N) < dens / 1.45
    sx, sy, mag = sx[keep], sy[keep], mag[keep]
    temp = rng.choice(3, len(sx), p=[0.22, 0.6, 0.18])
    cols = np.array([[0.80, 0.88, 1.0], [1.0, 1.0, 1.0], [1.0, 0.92, 0.82]], np.float32)[temp]
    for x, y, m, col in zip(sx, sy, mag, cols):
        m = min(m, 6.0)
        sig = 0.55 + 0.35 * min(m, 2.5)
        r = int(4 + sig * 4 + 26 * m)
        x0, x1 = max(0, int(x) - r), min(W, int(x) + r + 1)
        y0, y1 = max(0, int(y) - r), min(H, int(y) + r + 1)
        px = xx[y0:y1, x0:x1] - x; py = yy[y0:y1, x0:x1] - y
        r2 = px * px + py * py
        core = np.exp(-r2 / (2 * sig * sig)) * m
        halo = (np.exp(-np.sqrt(r2) / (2.2 + m)) * 0.05 * m) if m > 0.4 else 0
        img[y0:y1, x0:x1] += (core + halo)[..., None] * col
        if m > 2.2:   # 밝은 별만 가는 회절 빛줄기
            L = 10 + m * 9
            for ang in (0.0, np.pi / 2):
                ux, uy = np.cos(ang), np.sin(ang)
                along = px * ux + py * uy; across = -px * uy + py * ux
                y0b, y1b = max(0, int(y - L)), min(H, int(y + L) + 1)
                x0b, x1b = max(0, int(x - L)), min(W, int(x + L) + 1)
                pxb = xx[y0b:y1b, x0b:x1b] - x; pyb = yy[y0b:y1b, x0b:x1b] - y
                al = pxb * ux + pyb * uy; ac = -pxb * uy + pyb * ux
                sp = np.exp(-(ac ** 2) / 0.35) * np.exp(-np.abs(al) / (L * 0.32)) * m * 0.09
                img[y0b:y1b, x0b:x1b] += sp[..., None] * col

    cx, cy, R = planet
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    inside = dist < R
    theta = np.arctan2(yy - cy, xx - cx)
    toward = np.cos(theta - glint_ang)
    lit = np.clip((toward - 0.15) / 0.85, 0, 1) ** 2.2
    if layered:
        # 하늘만 따로 저장 (행성·빛 없이)
        sky = img.copy()
        vig = 1 - 0.38 * (((xx / W - 0.5) * 1.3) ** 2 + ((yy / H - 0.5) * 1.1) ** 2)
        sky *= vig[..., None]; sky = sky / (1 + sky); sky = np.power(np.clip(sky, 0, 1), 1 / 2.2)
        base = np.array([4, 5, 7], np.float32) / 255; sky = base + sky * (1 - base)
        sky += rng.normal(0, 0.008, (H, W, 1)).astype(np.float32)
        Image.fromarray((np.clip(sky, 0, 1) * 255).astype(np.uint8)).save(out.replace(".jpg", "-sky.jpg"), quality=84, optimize=True, progressive=True)
        # 행성 층: 몸체는 불투명, 대기는 빛의 세기만큼 투명도
        surf = fbm(H // 3, W // 3, rng, 7, 8); surf = np.asarray(Image.fromarray(surf).resize((W, H), Image.BICUBIC))
        edge_in = np.clip(1 - (R - dist) / (R * 0.06), 0, 1)
        body = (0.004 + 0.012 * surf * edge_in ** 3 * (0.3 + lit))
        h_out = np.clip(dist - R, 0, None)
        thin = np.exp(-h_out / (R * 0.0040)) * (0.06 + 2.2 * lit ** 1.3)
        wide = np.exp(-h_out / (R * 0.028)) * (0.10 * lit ** 1.6)
        rim_in = np.exp(-np.clip(R - dist, 0, None) / (R * 0.0016)) * (0.05 + 1.6 * lit)
        col = np.array([0.78, 0.86, 1.0], np.float32)
        lum_out = (thin + wide)
        lum_out = lum_out / (1 + lum_out)
        rgba = np.zeros((H, W, 4), np.float32)
        tint = col / col.max()
        rgba[..., :3] = np.power(tint, 1 / 2.2)[None, None, :]
        rgba[..., 3] = np.power(np.clip(lum_out, 0, 1), 1 / 2.2)
        lin_in = body[..., None] * 0.08 * np.array([0.92, 0.96, 1.0]) + rim_in[..., None] * col
        lin_in = lin_in / (1 + lin_in)
        base = np.array([4, 5, 7], np.float32) / 255
        rgba[inside, :3] = base + np.power(np.clip(lin_in[inside], 0, 1), 1 / 2.2) * (1 - base)
        rgba[inside, 3] = 1
        # 가장자리 계단 현상 방지: 경계 1.5px 부드럽게
        aa = np.clip((R - dist) / 1.5 + 0.5, 0, 1)
        edge = (aa > 0) & (aa < 1)
        rgba[edge, 3] = np.maximum(rgba[edge, 3], aa[edge])
        Image.fromarray((np.clip(rgba, 0, 1) * 255).astype(np.uint8), "RGBA").save(out.replace(".jpg", "-planet.webp"), quality=88, method=6)
        gx, gy = cx + np.cos(glint_ang) * R * 1.0015, cy + np.sin(glint_ang) * R * 1.0015
        print(out, gx, gy)
        return
    # 3) 행성 — 밤 쪽이 거의 검고, 대기층 가장자리만 은빛으로 빛난다
    cx, cy, R = planet
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    inside = dist < R
    theta = np.arctan2(yy - cy, xx - cx)
    toward = np.cos(theta - glint_ang)                   # 빛이 오는 쪽일수록 1
    lit = np.clip((toward - 0.15) / 0.85, 0, 1) ** 2.2
    surf = fbm(H // 3, W // 3, rng, 7, 8); surf = np.asarray(Image.fromarray(surf).resize((W, H), Image.BICUBIC))
    edge_in = np.clip(1 - (R - dist) / (R * 0.06), 0, 1)           # 가장자리 안쪽 약한 반사
    planet_col = (0.004 + 0.012 * surf * edge_in ** 3 * (0.3 + lit)) [..., None] * np.array([0.92, 0.96, 1.0])
    img[inside] = planet_col[inside]
    # 대기 산란: 바깥쪽으로 빠르게 사라지는 얇은 층 + 넓은 안개
    h_out = np.clip(dist - R, 0, None)
    thin = np.exp(-h_out / (R * 0.0040)) * (0.06 + 2.2 * lit ** 1.3)
    wide = np.exp(-h_out / (R * 0.028)) * (0.10 * lit ** 1.6)
    rim_in = np.exp(-np.clip(R - dist, 0, None) / (R * 0.0016)) * (0.05 + 1.6 * lit)
    atm = np.where(inside, rim_in, thin + wide)
    img += atm[..., None] * np.array([0.78, 0.86, 1.0], np.float32)
    # 행성 뒤의 별은 가린다
    img[inside] = np.minimum(img[inside], planet_col[inside] + atm[inside][..., None] * np.array([0.78, 0.86, 1.0]))

    # 4) 가장자리 너머로 떠오르는 빛 (브랜드의 '유별 별')
    gx, gy = cx + np.cos(glint_ang) * R * 1.0015, cy + np.sin(glint_ang) * R * 1.0015
    rr = np.sqrt((xx - gx) ** 2 + (yy - gy) ** 2)
    bloom = 9.0 * np.exp(-rr ** 2 / (2 * 3.2 ** 2)) + 0.85 * np.exp(-rr / 14) + 0.2 * np.exp(-rr / 60) + 0.025 * np.exp(-rr / 220)
    img += bloom[..., None] * np.array([1.0, 0.99, 0.97], np.float32)
    for ang, length, k in ((0.0, 260, 0.30), (np.pi / 2, 150, 0.20), (np.pi / 4, 60, 0.06), (-np.pi / 4, 60, 0.06)):
        ux, uy = np.cos(ang), np.sin(ang)
        al = (xx - gx) * ux + (yy - gy) * uy; ac = -(xx - gx) * uy + (yy - gy) * ux
        img += (np.exp(-ac ** 2 / 0.8) * np.exp(-np.abs(al) / (length * 0.18)) * k * 2.2)[..., None] * np.array([0.92, 0.95, 1.0])
    # 가로로 퍼지는 아주 옅은 렌즈 띠
    # 행성 안쪽은 가장자리만 남기고 다시 어둡게 (빛은 행성 뒤에 있다)
    occl = np.clip((R - dist) / (R * 0.012), 0, 1) * inside
    img *= (1 - 0.9 * occl)[..., None]

    # 5) 톤매핑 · 비네팅 · 그레인
    vig = 1 - 0.38 * (((xx / W - 0.5) * 1.3) ** 2 + ((yy / H - 0.5) * 1.1) ** 2)
    img *= vig[..., None]
    img = img / (1 + img)                                # Reinhard
    img = np.power(np.clip(img, 0, 1), 1 / 2.2)
    base = np.array([4, 5, 7], np.float32) / 255
    img = base + img * (1 - base)
    img += (rng.normal(0, 0.009, (H, W, 1))).astype(np.float32)
    Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(out, quality=86, optimize=True, progressive=True)
    print(out, gx, gy)

if __name__ == "__main__":
    d = sys.argv[1]
    import math
    def from_glint(G, phi_deg, R):
        ph = math.radians(phi_deg)
        return (G[0] - R * math.cos(ph), G[1] - R * math.sin(ph), R), ph
    # 데스크톱: 화면 오른쪽 아래, 행성 가장자리 위로 빛이 떠오른다 (왼쪽 글자 영역은 비워 둔다)
    W, H = 2400, 1350
    pl, ph = from_glint((W * 0.76, H * 0.64), -100, H * 1.25)
    render(W, H, pl, ph, 7, f"{d}/space-desk.jpg", (-0.55, 1.0, -0.15, 0.22), True)
    # 모바일: 세로 화면 위쪽. 행성 가장자리가 왼쪽 위 모서리에서 오른쪽으로 내려오고 빛은 오른쪽 위
    W, H = 1170, 2100
    pl, ph = from_glint((W * 0.80, H * 0.15), 118, W * 1.6)
    render(W, H, pl, ph, 11, f"{d}/space-mob.jpg", (0.9, 1.0, -0.6, 0.25), True)
