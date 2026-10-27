# v3 자산 출처와 사용 상태

정리일: 2026-10-24. 소스: `tmp/site-package-verify-20261024-v2/redesign/v2/`의 현재 게시 사이트 추출본. 이 작업은 기존 공개 이미지의 복사 및 데이터 정리이며 이미지 생성·재디자인·자르기·재압축을 하지 않았다.

## 사용 기준

- 현재 `portfolio.html`에 실제 카드로 존재하는 36건만 포함했다. 디렉터리에 파일이 남아 있어도 제거된 `x03`, `x04`, `x08`, `x10`, `x12`, `x13`, `x15`, `x20`, `x21`은 복원하지 않았다.
- `publishApproved: true`는 기존 게시 목록의 노출 상태를 승계한다. 새 고객 동의나 별도의 원본 파일 공개 승인을 확보했다는 의미가 아니다. 원본 PPTX·전체 PDF 다운로드는 제공하지 않는다.
- 프로젝트 제목과 `scope`는 기존 카드의 제목·분류 그대로다. 기획·디자인·편집화 등 수행 범위를 추정해 추가하지 않았다. 고객명·연도·성과·납품 범위도 새로 추정하지 않았다.
- `type`은 새 탐색용 대분류다. 기존 IR과 발표자료는 `ir`, 기존 소개서는 `company`, 기존 책자·다이어리 4건은 `print`다. 개인 포트폴리오 등 슬라이드 예시는 발표자료 탐색에 포함하되 기존 제목·분류를 보존한다.
- 모든 이미지 경로는 앱 base 기준 상대 경로다. 화면에서는 `object-fit: contain`과 실제 비율을 사용한다. `cover`, 배경 확대, 강제 정방형 자르기를 적용하지 않는다. 16:9 슬롯이 필요한 경우 여백을 남기고 전체 이미지를 표시한다.
- 기존 `a` 이미지는 목록 썸네일, `b` 이미지는 호버·상세에 쓰였던 자료다. 여러 장표가 이미 배치된 콜라주를 새 개별 장표로 분리하지 않았다. 상세 갤러리에는 확인 가능한 두 파일을 연결한다.
- 콘퍼런스 발표자료 `x05`에만 기존 상세 화면에서 사용하던 개별 장표 PNG 6개를 추가했다. 원본 1920×1080 파일을 그대로 유지했다.

## 코드와 파일

- `src/portfolio.mjs`: `portfolio` / 기본 내보내기, `assetDimensions`, `representativeMedia`.
- `public/assets/inventory.json`: 복사한 94개 이미지 각각의 원본 출처, 공개 상태, 실제 크기, 파일 바이트, SHA-256, 버전, 복사일.
- `public/assets/pf/`: 기존 공개 포트폴리오 이미지. 파일명을 보존했다.
- `public/assets/slides/`: 기존 홈 히어로 deck 13장 및 서비스 목업 3장. 홈에서 참조하지 않는 잔여 파일은 추가하지 않았다.
- `public/assets/logo.svg`: 기존 `index.html` 헤더의 `<svg viewBox="0 0 200 230">`를 그대로 추출했다. 단독 SVG 파일에 필요한 `xmlns`만 넣고 `aria-hidden`을 제거했다. 기존 U형 마크와 그라데이션, 패스는 보존했다. 워드마크는 기존처럼 HTML 텍스트로 조합할 수 있다.

## 대표 미디어

| 용도 | 경로 | 실제 크기 |
| --- | --- | --- |
| 히어로 주 장표 | `assets/slides/toff.webp` | 1600×900 |
| 히어로 보조 | `assets/slides/spne.webp`, `assets/slides/sakura.webp` | 각 1600×900 |
| IR 서비스 | `assets/slides/svc-ir.webp` | 1100×825 |
| 회사소개·제안 서비스 | `assets/slides/svc-prop.webp` | 1100×825 |
| 브랜드 서비스 | `assets/slides/svc-intro.webp` | 1100×825 |
| 교육안내책자 | `assets/pf/book-23.webp` | 1400×933 |
| 리플렛 | `assets/pf/leaflet-19.webp` | 1586×991 |

`svc-*`는 4:3 목업이다. 이를 16:9 사진으로 잘라 쓰지 않는다. 세로·책자 이미지도 원본 비율을 유지한다. 프로젝트 썸네일의 크기는 아래 표와 코드 데이터에 있으며, 상세 이미지별 크기는 `assetDimensions`와 inventory에 있다.

## 기존 공개 목록

| ID / slug | 기존 제목 | 새 type | 기존 scope | 썸네일 크기 |
| --- | --- | --- | --- | --- |
| 01 / case-01 | 종이팩 리필 솔루션 IR | ir | IR | 960×600 |
| 02 / case-02 | B2B 세일즈 플랫폼 IR | ir | IR | 960×600 |
| 03 / case-03 | 한의학 빅데이터 IR | ir | IR | 960×600 |
| x01 / case-x01 | 프레젠테이션 디자인 | ir | 편집 · 교육 | 1400×1400 |
| x02 / case-x02 | 기업 소개서 | company | 소개서 | 1400×1400 |
| x05 / case-x05 | 콘퍼런스 발표자료 | ir | 편집 · 교육 | 1400×1400 |
| x06 / case-x06 | 개인 포트폴리오 | ir | 편집 · 교육 | 1400×1400 |
| x07 / case-x07 | 공간 브랜드 소개서 | company | 소개서 | 1400×1400 |
| x09 / case-x09 | 스튜디오 회사소개서 | company | 소개서 | 1400×1400 |
| x11 / case-x11 | 신사업 발표자료 | ir | 편집 · 교육 | 1400×1400 |
| x14 / case-x14 | IT 기업 회사소개서 | company | 소개서 | 1400×1400 |
| x16 / case-x16 | 영문 회사소개서 | company | 소개서 | 1400×1400 |
| x17 / case-x17 | 세로형 회사소개서 | company | 소개서 | 1586×991 |
| x18 / case-x18 | 반려동물 서비스 소개서 | company | 소개서 | 1400×1400 |
| x19 / case-x19 | 영문 펫 서비스 회사소개서 | company | 소개서 | 1400×1400 |
| 04 / case-04 | 제품 · 회사 소개서 | company | 소개서 | 960×600 |
| 05 / case-05 | 스마트팜 IR | ir | IR | 960×600 |
| 06 / case-06 | 기술 사업 IR | ir | IR | 960×600 |
| 07 / case-07 | 언어 학습 서비스 IR | ir | IR | 960×600 |
| 08 / case-08 | 사업 소개 IR | ir | IR | 960×600 |
| 09 / case-09 | 모빌리티 사업계획 발표 | ir | IR | 960×600 |
| 10 / case-10 | 스프링클러 기술 IR | ir | IR | 960×600 |
| 11 / case-11 | 수질진단 R&D IR | ir | IR | 960×600 |
| 12 / case-12 | 기업 소개서 · 국문 | company | 소개서 | 960×600 |
| 13 / case-13 | 기업 소개서 · 영문 | company | 소개서 | 960×600 |
| 14 / case-14 | 브랜드 소개서 | company | 소개서 | 960×600 |
| 15 / case-15 | 수질 관리 제품 소개서 | company | 소개서 | 960×600 |
| 16 / case-16 | 사업 소개 IR | ir | IR | 960×600 |
| 17 / case-17 | 전문 서비스 회사소개서 | company | 소개서 | 960×600 |
| 18 / case-18 | 상표 서비스 소개서 | company | 소개서 | 960×600 |
| 19 / case-19 | 재난안전 제품 소개서 | company | 소개서 | 1586×991 |
| 20 / case-20 | 라이프스타일 회사소개서 | company | 소개서 | 960×600 |
| 21 / case-21 | 2024 교육안내책자 | print | 편집 · 교육 | 1400×933 |
| 22 / case-22 | 2025 교육안내책자 | print | 편집 · 교육 | 1400×933 |
| 23 / case-23 | 2026 교육안내책자 | print | 편집 · 교육 | 1400×933 |
| 24 / case-24 | 다이어리 · 굿즈 | print | 편집 · 교육 | 1586×991 |

## Pretendard

확인된 로컬 배포본: `C:/Users/leeeb/.codex/visualizations/2026/10/14/01a138a3-b40d-72b0-b6ae-673276284c2b/wsbuild-084/src/assets/fonts/`.

| 파일 | weight | 바이트 |
| --- | --- | --- |
| `assets/fonts/Pretendard-Regular.woff2` | 400 | 765892 |
| `assets/fonts/Pretendard-Medium.woff2` | 500 | 778432 |
| `assets/fonts/Pretendard-SemiBold.woff2` | 600 | 785856 |
| `assets/fonts/Pretendard-Bold.woff2` | 700 | 791156 |

원본과 함께 있던 `PRETENDARD-LICENSE.txt`도 `public/assets/fonts/`에 복사했다. Copyright (c) 2021 Kil Hyung-jin, Reserved Font Name Pretendard, SIL Open Font License 1.1이다. 폰트 파일을 수정하거나 이름을 바꾸지 않았으며 외부 CDN이 없어도 사용 가능하다. 실제 확보한 굵기는 400·500·600·700이다. CSS에는 각 파일의 해당 weight와 `font-display: swap`을 지정한다. 모든 굵기를 사전 로딩하지 않는다.

## 확보되지 않은 자료

| 슬롯 ID | 노출 제목 | src | poster | 비고 |
| --- | --- | --- | --- | --- |
| demo-day | 데모데이 홈페이지 | null | null | 16:9, 외부 링크 없음 |
| peumoa | 프모아 | null | null | 16:9, 외부 링크 없음 |
| company-v2 | 기업 홈페이지 | null | null | 16:9, 외부 링크 없음 |
| hero-concept | 히어로 시안 | null | null | 16:9, 외부 링크 없음 |

GIF는 제작 보류 상태이며 이 작업에서 생성·캡처·다운로드하지 않았다. 파일을 받기 전에는 재생 버튼, 새 탭, 카드 전체 링크를 만들지 않는다.

동일 내용의 실제 before / intermediate / after 자료는 확인되지 않았다. 비교 장면과 AI 초안 완성 장면에 기존 서로 다른 프로젝트 이미지를 끼워 넣지 않는다. 해당 단계 미디어는 null로 두고 설명 및 비율이 유지되는 빈 슬롯을 사용한다. 임의의 AI 초안이나 개선 수치도 만들지 않았다.

## 검증

포트폴리오 36건의 ID·slug 중복, 허용 type, 필수 필드, 원본 카드와의 일치, 94개 이미지 존재·실제 크기·바이트 동일성을 검사했다. 폰트 4개는 WOFF2 헤더와 원본 바이트 동일성을 검사했다. `logo.svg`는 XML로 읽히며 원본 마크 형상을 유지한다. 웹 페이지의 레이아웃·상호작용·브라우저 렌더링 검수는 사이트 본체 검수에서 별도로 수행한다.

## 후속 추가: 생성 장식 오브젝트 3종

2026-10-24 후속 요청에서 사용자는 홈페이지의 스크롤 장면을 위한 제작 유형 오브젝트 생성을 허용했다. 앞 절의 “이미지 생성하지 않음” 기록은 초기 공개 포트폴리오 이관 단계에 대한 설명이다. 이번 추가분은 별도의 장식 자산이며 기존 공개 사례 목록에 섞지 않는다.

생성 도구는 내장 imagegen이다. 3D 코발트·아이보리 프레젠테이션 시트, 열린 책자·접지 리플렛, 브라우저·영상 유리 프레임을 각각 상징하는 일러스트레이션이다. 실제 고객·납품 결과·성과·before/after 증거가 아니다.

| 유형 | 경로 | 실제 크기 | 바이트 | 알파 |
| --- | --- | --- | --- | --- |
| deck | `assets/concepts/deck.webp` | 1200×800 | 102,040 | 유지 |
| print | `assets/concepts/print.webp` | 1200×800 | 67,336 | 유지 |
| digital | `assets/concepts/digital.webp` | 1200×800 | 67,942 | 유지 |

원본은 `reference-assets/concepts/*.png`에 보존하여 public 배포 자산과 분리했다. 웹용으로 가로 1200px, WebP quality 88, alphaQuality 100으로만 변환했다. 원본 비율 및 알파를 유지했고 시각 내용 편집·자르기는 하지 않았다.

생성 자산 manifest는 `public/assets/concepts/manifest.json`, 상세 출처·프롬프트 요약·변환 기록은 `GENERATION.md`에 있다. 기존 `public/assets/inventory.json`은 실제 게시 자산 94개의 출처 목록으로 유지한다. 미확보 비교 단계와 GIF 슬롯 4개의 상태는 이 생성 작업으로 바뀌지 않는다.

## 추가 장식 자산: 이미지·영상 및 업무 도구

동일한 내장 imagegen 생성 흐름으로 장식용 제작 유형 이미지 2종을 추가했다. 기존 범주에 반복되던 digital/deck 오브젝트를 구분하기 위한 상징 자산이며, 실제 포트폴리오·고객 사례·성과·before/after 증거에 추가하지 않는다.

| 유형 | 경로 | 실제 크기 | 바이트 | 알파 |
| --- | --- | --- | --- | --- |
| image-video | `assets/concepts/image-video.webp` | 1200×800 | 86,844 | 유지 |
| tools | `assets/concepts/tools.webp` | 1200×800 | 92,370 | 유지 |

두 PNG 원본은 `reference-assets/concepts/image-video.png`, `reference-assets/concepts/tools.png`에 보존했다. 최신 생성 자산 manifest(version 2)는 총 5종, WebP 합계 416,532바이트다. 모두 1200×800이며 원본 복사 해시와 리사이즈 원본 대비 알파 일치 검증을 통과했다. 상세 프롬프트 요약·출처는 `GENERATION.md`의 추가 생성 절에 기록했다.
