# 유별난PPT 홈페이지 v3

2026-10-24 개발 버전. 기존 공개 홈페이지와 분리한 새 방향입니다. ANCORS의 화면 리듬을 참고해 유별난PPT의 장표·인쇄물·디지털 제작 오브젝트로 구성했습니다.

## 실행

Node.js 22 이상에서 이 폴더를 열고 실행합니다. 사이트 실행용 외부 패키지는 없습니다.

```sh
npm run build
npm start
```

브라우저에서 `http://127.0.0.1:4185/`를 엽니다. HTML 파일을 직접 더블클릭하는 방식은 ES module 실행을 지원하지 않습니다.

## 구성 (v3.1, 2026-10-28 문구·구성 개편)

최종 기획안(실장안 + PPT팀안 통합)의 9개 섹션 구성에 문구 교체안 문구를 적용했습니다. 시각 언어(블루 + 블랙, 3D 발표장, 장표 오브젝트)는 v3 그대로입니다.

- `src/home.mjs`: 홈 9개 섹션 마크업
- `src/contact.mjs`: 문의 폼(홈·/contact·빠른 견적 공용)과 문의 섹션
- `src/ui.mjs`: 제목 줄바꿈 도우미 (PC 줄 / 모바일 줄)
- `src/render.mjs`: 하위 페이지와 헤더·푸터
- `src/data.mjs`: 연락처·가격·승인 스위치·FAQ·진행 단계·폼 선택지 (공개 파일이므로 승인된 값만)
- `src/portfolio.mjs`: 공개 작업 36건과 원본 비율
- `public/home.css`, `public/styles.css`: 개편분은 각 파일 끝 `v3.1` 블록
- `public/inquiry.mjs`, `public/quote.mjs`: 문의 폼, 빠른 견적 창
- `public/assets/concepts/`: 장식용 생성 오브젝트 (실제 고객 사례 아님)

## 홈 섹션 순서

1. **히어로** `#hero` — 중요한 발표에는, 유별난 자료가 필요합니다. 기관 담당자용 진입 줄
2. **함께한 곳** `#clients` — 로고 세 묶음(공공·기관 / 창업지원·대학 / 기업). 실적 수치는 승인 후에만
3. **작업 사례** `#portfolio` — 3D 발표장 + 실제 작업 6건, 버튼 1개
4. **작업 방식** `#process` — 고치는 것 3가지 + 진행 4단계(예시 장표)
5. **서비스와 가격** `#pricing` — BASIC / PRO / PREMIUM, ‘자료 확인 후 견적’
6. **기관·데모데이** `#demoday` — 진행 5단계, 함께 준비한 데모데이, 행사 페이지 3종
7. **함께 맡길 수 있는 제작** `#beyond` — 인쇄물·홈페이지·이미지와 영상, 샘플 사이트 슬라이드
8. **후기 + FAQ** `#reviews`, `#faq` — 원문 발췌 카드 5개, 질문 8개
9. **견적 문의** `#contact` — 폼 하나

이전 주소의 앵커(`#services`, `#work`, `#ir`, `#inquiry` 등)는 새 섹션으로 연결됩니다. 승인 스위치와 문의 연결은 `OPERATIONS.md`, `FORM_SETUP.md`를 봅니다.

## 배포

검토 후 정적 호스팅에는 `dist/`의 **내용**을 배포합니다. ZIP 파일 자체를 올려서는 홈페이지가 실행되지 않습니다. 모든 로컬 경로는 상대 경로이므로 GitHub Pages의 저장소 하위 폴더에서도 사용할 수 있습니다. 공개 모드에서는 `SITE_MODE=production`으로 빌드하여 빈 GIF의 편집 안내를 숨길 수 있습니다.

Windows PowerShell 공개용 빌드:

```powershell
$env:SITE_MODE='production'
npm run build
Remove-Item Env:SITE_MODE
```

## 운영 전 남은 연결

문의 접수 서비스와 개인정보 안내가 확정되지 않아, 폼은 지금 ‘이메일 작성하기’(메일 앱 열기)로 동작합니다. 카카오톡 문의는 연결돼 있습니다. 가격과 실적 수치는 승인 전이라 공개하지 않습니다.

## 검증

```sh
npm test
node scripts/check-build.mjs
```

`scripts/qa.mjs`는 브라우저 QA 스크립트입니다. `npm i -D playwright` 후 `node scripts/qa.mjs`로 실행합니다(설치된 Chrome을 쓰려면 `CHROME_PATH` 지정). 사이트 자체에는 필요 없습니다. 결과 화면은 `qa/`에 저장됩니다.
