# 유별난PPT v3 운영 안내

갱신: 2026-10-28 (9개 섹션 개편). 이 폴더는 GitHub Pages에 그대로 공개되므로 **승인되지 않은 가격·수치는 문서와 소스 어디에도 적지 않습니다.**

## 수정할 원본

| 파일 | 관리 내용 |
| --- | --- |
| `src/data.mjs` | 연락처·상담 시간, 접수 연동 설정, 가격과 승인 상태, 실적 수치, 데모데이 이력, 로고, 후기, FAQ, 진행 단계, 문의 폼 선택지 |
| `src/home.mjs` | 홈 9개 섹션 마크업 |
| `src/contact.mjs` | 문의 폼(홈·/contact 공용), 문의 섹션, 하위 페이지 마무리 띠 |
| `src/ui.mjs` | 제목 줄바꿈 도우미 `title()` |
| `src/render.mjs` | 하위 페이지, 헤더·푸터 |
| `src/domain.mjs` | 가격 계산, URL 선택값, 문의 검증·요약·전송 |
| `public/inquiry.mjs` | 단계형 문의 폼 (1 의뢰 구분 · 2 용도 · 3 자료 상태 · 4 날짜(기관이면 팀 수) · 5 연락처·동의, 선택 항목은 5단계의 ‘더 알려 주기’) |
| `public/home.css` · `public/styles.css` | 홈 전용 · 공통 스타일 (개편분은 각 파일 끝 `v3.1` 블록) |

`dist/`는 빌드 결과입니다. 원본을 고친 뒤 `SITE_MODE=production npm run build`로 다시 만들고, `dist/`의 내용을 `redesign/v3/`에 올립니다.

## 제목 줄바꿈

섹션 제목은 `title([...])`로 씁니다. 배열의 각 항목이 PC의 한 줄입니다. 항목이 다시 배열이면 모바일(767px 이하)에서 그 자리에서 한 번 더 줄을 나눕니다. 문구 교체안의 ‘모바일 대제목 /’ 위치가 여기에 해당합니다.

```js
title(['중요한 발표에는,', ['유별난 자료가', '필요합니다.']])
// PC: 중요한 발표에는, / 유별난 자료가 필요합니다.
// 모바일: 중요한 발표에는, / 유별난 자료가 / 필요합니다.
```

## 공개 승인 스위치

| 항목 | 위치 | 지금 상태 | 승인되면 |
| --- | --- | --- | --- |
| BASIC·PRO·PREMIUM 가격 | `pricing[].status`, `unitPrice`, `setupFee`, `minPages` | 초안 금액 삭제, ‘자료 확인 후 견적’ | 금액을 넣고 `status: 'approved'` |
| 웹사이트 가격 (소개형 · 폼 연동형) | `websiteOptions[].price`, `priceNote` | 2026-10-29 대표 확정: 40만원부터 · 70만원부터 (부가세 별도 시작가). 추가 제작은 `websiteExtra` ‘별도 견적’ | 금액을 바꾸면 홈 · /web/ · /demoday에 함께 반영 |
| 데모데이 팀당 가격·계산기 | `demodayPrice.status` | `pending` (2026-10-29 ‘가격은 별도 협의’만 표기) | `approved`로 바꾸면 팀당 가격과 계산기가 나옴 |
| 고객사·작업·후기 수, 평점 | `proofStats` | 2026-10-29 대표 요청으로 TRACK RECORD 섹션에 표시 (800건+ · 4.9/5 · 458건+ · 300곳+) | `asOf`에 집계 기준일을 넣으면 숫자 아래 표시, `approved: false`면 숫자 줄이 사라짐 |
| 데모데이 행사별 팀 수 | `demodayTeamsApproved` | `false`: 표시 안 함 | `true` |
| 후기 원문 링크 | `site.reviewSourceUrl` | 없음: 버튼 숨김 | 확인된 주소를 넣으면 ‘후기 원문 보기 ↗’ 표시 |
| 개인정보 안내 | `site.privacyApproved`, `site.privacyPolicy` | 미확정 | `PRIVACY_DRAFT.md`를 확정해 옮김 |

후기 카드는 `reviews[].excerpt`가 있는 후기만 보여 줍니다. 발췌문은 본문에 있는 문장 그대로여야 합니다.

## 문의 접수

연결 방법은 `FORM_SETUP.md`를 따릅니다. 전송은 다음 세 조건이 모두 맞을 때만 켜집니다. 그 전에는 ‘이메일 작성하기’로 동작하고 접수 완료 화면을 띄우지 않습니다.

- `site.inquiryProvider`: `'google'`, `'web3forms'`, `'formspree'`, `'api'` 중 하나
- `site.inquiryEndpoint`(Web3Forms는 `inquiryKey`도)
- `site.privacyApproved: true`와 비어 있지 않은 `site.privacyPolicy`

완료 화면은 서비스가 성공을 확인했을 때만 나옵니다.

| 서비스 | 성공으로 보는 응답 |
| --- | --- |
| 구글 시트(Apps Script) | 2xx + `{ ok: true }` |
| Web3Forms | 2xx + `{ success: true }` |
| Formspree | 2xx이고 `errors`가 없음 |
| 자체 서버(`api`) | `201` + `inquiryId` |

나머지 응답은 입력 오류(400·422), 요청 과다(429), 서버 오류(5xx), 확인 불가로 나눠 안내하고, 입력 내용은 그대로 둡니다. 같은 문의를 다시 보내면 같은 요청 키를 씁니다(구글 시트 스크립트는 이 키로 중복 저장을 막습니다).

자체 서버로 받을 때의 요청 본문은 `normalizeInquiry()`가 만드는 필드에 `sourcePath`, `idempotencyKey`를 더한 JSON입니다. 서버도 `validateInquiry()`와 같은 규칙으로 다시 검증해야 합니다.

URL에는 개인 정보가 아닌 선택값만 담습니다: `service`, `kind`, `purpose`, `due`, `option`, `teamCount`, `pageCount`. 이름·연락처·문의 내용은 URL과 브라우저 저장소에 남기지 않습니다(작성 중 자동 저장 기능은 껐습니다).

## 검증

```sh
npm test                      # 15개
SITE_MODE=production npm run build
node scripts/check-build.mjs  # 42개 페이지, 내부 링크·이미지·앵커
node scripts/qa.mjs           # 브라우저 점검 (playwright 필요)
```
