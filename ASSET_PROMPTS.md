# GPT 에셋 요청문

아래 프롬프트를 GPT 이미지 모델에 그대로 복사해서 넣으세요.
만든 파일은 **파일명을 그대로 지켜서** 채팅에 첨부해 주시면 제가 넣을게요. 저장소의 `assets/img/gen/` 폴더에 직접 올리셔도 됩니다.
사이트는 파일이 없어도 대체 디자인으로 정상 동작하고, 파일을 넣는 순간 자동으로 교체됩니다.

## 공통 규칙

- **모든 프롬프트 끝에 아래 "공통 스타일"을 붙여 주세요.** 색감과 톤이 통일됩니다.
- **글자는 넣지 마세요.** AI 이미지는 한글과 숫자가 깨지기 쉽습니다. 글자는 사이트에서 코드로 올립니다.
- 사진은 JPG(가능하면 500KB 이하), 아이콘은 투명 배경 PNG로 저장합니다.
- 비율이 정확히 안 맞아도 괜찮습니다. 사이트에서 알아서 잘라 씁니다. 가로형은 모델이 지원하는 가장 큰 가로 크기(예: 1536×1024)로 뽑아 주세요.

```
공통 스타일:
Style: premium, minimal, cinematic. Color palette: near-black (#0B0D10), charcoal and cool gray,
with electric blue (#3D7BFF) and deep navy (#0A3A5C) accents. Soft low-key lighting, subtle film
grain, high detail, clean composition with generous negative space.
Absolutely no text, letters, numbers, logos, or watermarks.
```

---

## 1. `hero-bg.jpg` · 메인 첫 화면 배경 ⭐ 우선순위 높음
**쓰는 곳:** 첫 화면 맨 뒤 배경 (위에 슬라이드 벽과 헤드라인이 올라감) · **비율:** 가로 16:9

```
Ultra-wide cinematic view of deep space. A soft, faint blue nebula glows along the bottom of the
frame and fades into near-black toward the top. Sparse, tiny, crisp stars scattered across the frame.
The center of the image stays dark and calm so a white headline can sit on top.
Elegant and quiet, not busy. No planets, no galaxy in the center.
```

## 2. `pitch.jpg` · "중요한 발표를 앞두고" 섹션 ⭐ 우선순위 높음
**쓰는 곳:** 고민 제시 섹션 왼쪽 사진 · **비율:** 가로 3:2

```
A startup founder seen from behind, standing alone in a dark, modern presentation hall right before
an important investor pitch, facing a large glowing blank screen that casts cool blue light.
Rows of empty seats, dramatic rim lighting, a feeling of tension and anticipation.
Photorealistic, 35mm lens, shallow depth of field. The screen is completely blank. Face not visible.
```

## 3. `stage.jpg` · 하단 "다음 발표, 유별나게 준비하세요." 배경
**쓰는 곳:** 큰 상담 버튼 영역 배경 (어둡게 깔림) · **비율:** 가로 16:9

```
Wide shot of a large conference stage seen from the back of the audience. A speaker's silhouette at a
podium, a huge screen behind them glowing with a soft blue gradient, audience heads silhouetted in the
foreground, volumetric light beams through light haze. Mostly deep shadows with blue highlights.
The screen shows only a soft gradient: no text, no charts.
```

## 4~6. 3D 아이콘 3종 · "왜 유별난PPT" 3가지 이유
**쓰는 곳:** 이유 01·02·03 옆 아이콘 · **비율:** 1:1 · **투명 배경 PNG**
**세 개를 같은 대화에서 연달아 생성해야 스타일이 맞습니다.** 먼저 아래 공통 문장을 넣고, 오브젝트 문장만 바꿔 가며 생성하세요.

```
A single 3D icon object made of frosted glass and glossy electric-blue material with soft navy
gradients, floating at a slight 3/4 angle. Soft studio lighting with a gentle blue rim light and subtle
reflections. Transparent background, object centered with padding around it. Consistent icon-set style.
```

| 파일명 | 오브젝트 문장 |
|---|---|
| `sol-strategy.png` | `Object: a glass chess knight next to a small rising bar chart, representing business strategy.` |
| `sol-file.png` | `Object: an open glass folder with a floating slide document and a small pencil, representing a fully editable original file.` |
| `sol-chat.png` | `Object: two overlapping glass speech bubbles with a small spark, representing direct one-to-one communication.` |

## 7. `about-studio.jpg` · 회사소개 페이지 상단
**쓰는 곳:** 회사소개 첫 화면 오른쪽 사진 · **비율:** 가로 4:3 또는 3:2

```
A premium presentation design studio at night. A clean desk with a large monitor and a laptop, both
showing abstract slide layouts made only of colored blocks, shapes and simple charts in navy and blue
(no readable text). A notebook with hand-drawn wireframe sketches, a cup of coffee, a warm desk lamp
mixed with cool blue monitor glow. Minimal, tidy, high-end, photorealistic, shallow depth of field.
No people.
```

## 8. `ai-visual.png` · Workflow 섹션 (선택)
**쓰는 곳:** AI 워크플로우 섹션 작은 이미지 · **비율:** 3:2 또는 1:1

```
Abstract editorial illustration: a designer's hand arranging translucent glass slide cards in mid-air,
while a faint stream of blue light particles lines them up into a neat grid. Dark background, calm and
elegant, blue and navy tones, minimal. Only the hand is visible, no face.
```

---

## 영상 (선택) · `hero-loop.mp4`
GPT 이미지 모델은 영상을 만들지 못합니다. 영상 생성 모델(예: Sora)이 있을 때만 쓰세요.
GIF는 용량이 크고 화질이 나빠서 웹에는 MP4를 권장합니다. **영상이 없어도 첫 화면의 별과 슬라이드가 이미 움직입니다.**

- 규격: 1920×1080, 8~10초, 소리 없음, 처음과 끝이 이어지는 반복 영상, 6MB 이하, MP4(H.264)
- 넣는 곳: `assets/video/hero-loop.mp4`

```
Seamless looping 10-second video. A slow forward drift through a dark, elegant starfield with a faint
blue nebula glow along the bottom. Stars twinkle gently; a single subtle shooting star crosses the upper
right once. Very slow, calm camera motion, no cuts, no text. The center of the frame stays dark for
overlay text. The first and last frames match for a perfect loop.
```

---

## 생성하면 안 되는 것 (실제 자료가 필요)

| 항목 | 이유 | 넣는 곳 |
|---|---|---|
| **포트폴리오 이미지** | 실제 작업물이어야 합니다. AI로 만들면 허위 포트폴리오가 됩니다 | `assets/img/portfolio/<프로젝트>/` |
| **고객사 로고** | 각 회사의 공식 로고 파일을 써야 합니다 | 채팅으로 전달 |
| **슬라이드 속 글자** | AI가 만들면 글자가 깨집니다. 지금 사이트의 슬라이드 샘플은 코드로 그린 것이라 선명합니다 | — |
