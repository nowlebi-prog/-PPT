# 유별난PPT v3 운영 연결 안내

확인일: 2026-10-24. 현재는 로컬 정적 제작본이며, 이번 작업에서 공개 배포와 운영 문의 API 활성화는 진행하지 않았다. `site.inquiryEndpoint`는 `null`, `site.privacyApproved`는 `false`, `site.privacyPolicy`는 `null`이다.

## 수정할 원본

| 파일 | 관리 내용 |
| --- | --- |
| `src/data.mjs` | 브랜드·연락처, 가격과 승인 상태, 옵션, FAQ, 제공사항, GIF 슬롯, 실적 공개 상태, 개인정보 안내 |
| `src/copy.mjs` | 섹션 제목과 본문 |
| `src/portfolio.mjs` | 기존 작업 목록·공개 상태·이미지 경로 |
| `src/domain.mjs` | 가격 계산, URL 선택값, 문의 검증과 전송 계약 |
| `src/render.mjs` | 가격 표시, 문의 양식, 개인정보 안내, 미디어 HTML |
| `public/app.mjs` | 문의 활성화·제출 상태, 미디어 재생과 오류 처리 |
| `ASSETS.md`, `public/assets/inventory.json` | 기존 이미지 출처·크기·사용 상태 |

`dist/`는 생성 결과다. 원본을 고친 뒤 `redesign-v3`에서 `npm run build`로 다시 만든다. `npm start`는 로컬 확인용이며 배포 명령이 아니다. `SITE_MODE=production`은 시안용 슬롯 안내 표시를 바꾸는 빌드 설정으로, 가격 승인이나 문의 연결을 대신하지 않는다.

## 가격과 공개 승인

금액은 원 단위 정수로 저장한다. 아래 일반 상품과 홈페이지 가격은 내부 검토용 제안값이며 모두 `status: 'draft'`다.

| 구분 | 기준 | 현재 공개 처리 |
| --- | --- | --- |
| 디자인 유지와 편집화 | 장당 20,000원 제안, 최소 조건 미확정 | 자료 확인 후 안내 |
| 맞춤 디자인 | 최초 세팅 100,000원 + 납품 장당 20,000원 제안, 5장 이상 | 자료 확인 후 안내 |
| 기획과 디자인 | 장당 30,000원 검토, 최소 조건 미확정 | 자료 확인 후 안내 |
| 행사 안내형 / 참가 신청형 / 행사 아카이브형 | 각각 400,000원 / 700,000원 / 1,000,000원 제안 | 기능 확인 후 견적 |
| 데모데이 기본 제작 | 팀당 500,000원, 20장 이내, 초과 장당 25,000원 | 확정된 기본 기준 표시, 별도 협의 가능 |

일반 상품은 범위·단가·최소 조건을 승인받은 후 해당 항목의 `status`를 `approved`로 바꾼다. `calculatePpt`는 승인된 상품과 양의 정수 장수에만 총액을 반환한다. B 5장은 200,000원이며, B 4장은 최소 5장 안내와 `amount: null`을 반환한다. `minPages: null`은 조건 미확정을 뜻하므로 무제한 최소 조건으로 광고하지 않는다.

데모데이는 팀별로 `500000 + max(0, 장수 - 20) × 25000`을 더한다. `[18, 24]`는 1,100,000원이다. 장수 미정은 `null`로 보존하고 해당 팀 기본비만 더하며 `estimated: true`를 반환한다. 남는 장수는 다른 팀과 합치지 않는다. 화면의 금액은 기본 제작비 기준이며 최종 계약 견적과 구분한다.

홈페이지 세 상품 중 하나만 선택하며 누적 합산하지 않는다. 옵션 할인 10%·15%는 적용하지 않는다. `taxPolicy: 'pending'`이므로 부가세는 “부가세 처리 기준은 견적서에서 안내”를 유지한다. 수정 횟수·납기·세팅 재사용 면제 등 미확정 조건은 자동 약속하지 않는다.

## 빈 GIF 슬롯 교체

`src/data.mjs`의 `media`에는 `demo-day`, `peumoa`, `company-v2`, `hero-concept` 네 슬롯이 있다. 현재 모두 `src: null`, `poster: null`, `status: 'empty'`, `externalHref: null`, 1600×900이다. 빈 슬롯에는 외부 링크나 재생 버튼을 넣지 않는다.

승인된 GIF와 정적 poster가 준비되면 `public/assets/` 아래에 저장하고 해당 슬롯의 앱 기준 상대 경로(`assets/...`), 실제 `width`·`height`, 설명용 `alt`를 입력한 뒤 `status: 'ready'`로 바꾼다. 출처·공개 승인·버전·수정일은 자산 기록에도 남긴다. `externalHref`는 계속 `null`로 유지한다.

현재 컴포넌트는 GIF와 poster가 모두 있어야 재생 버튼을 표시한다. 기본은 poster이며 사용자가 재생을 선택하면 GIF, 정지를 선택하면 poster로 돌아간다. 파일 로딩 실패 시 같은 비율을 유지하고 오류 상태를 표시한다. 경로만 추정해 빈 파일을 연결하거나 GIF 대신 다른 형식만 제공하지 않는다.

## 실제 문의 연결

현재 서버 수신기는 포함되어 있지 않다. 운영자가 승인한 수신 목적지와 서버 API를 준비한 다음 `site.inquiryEndpoint`를 설정한다. 권장 경로는 `POST /api/inquiries`이며, 서버 비밀키는 프런트 코드나 저장소에 넣지 않는다.

문의 버튼과 제출 핸들러는 다음 조건을 모두 만족해야 활성화된다.

- `site.inquiryEndpoint`가 설정되어 있음
- `site.privacyApproved`가 `true`
- `site.privacyPolicy`가 비어 있지 않은 배열

`privacyPolicy`는 운영자가 승인한 `{ heading, body }` 객체의 배열이다. 수집 항목·이용 목적·보관기간·처리 주체·연락 경로 등 실제 정책을 각 항목의 일반 텍스트로 채운다. 개인정보 페이지는 같은 배열을 표시한다. 보관기간이나 업체 정보를 임의로 만들지 않으며, 배열 존재 여부만으로 내용 승인이 이루어지는 것은 아니다.

요청은 `Content-Type: application/json`, `Idempotency-Key` 헤더를 사용하며 다음 필드만 전송한다.

```text
name, contactMethod, contactValue, message, serviceId, optionIds,
organization, eventDate, teamCount, pageCount, privacyConsent,
portfolioConsent, sourcePath, idempotencyKey
```

`contactMethod`는 `email` 또는 `phone`이다. `serviceId`는 `ppt-a`, `ppt-b`, `ppt-c`, `demoday`, `extended` 또는 `null`이며, 홈페이지 옵션은 최대 하나다. 장수·팀 수 미정은 `null`로 전송한다. 소통 방식과 촬영 장소·편수·희망 조건은 UI에서 `message`에 합친 후 전체 10~5000자 제한을 검증한다. 서버는 같은 필드와 길이·동의를 다시 검증해야 한다.

| 수신 결과 | 클라이언트 결과와 화면 처리 |
| --- | --- |
| `201` + `{ "inquiryId": "접수번호" }` | `success`, 실제 접수번호 표시. `id` 필드도 지원 |
| `400` 또는 `422` + `{ "fieldErrors": { "필드명": "오류 안내" } }` | `validation`, 입력 유지·필드 오류 표시. `errors` 별칭도 지원 |
| `429` | `rate_limit`, 잠시 뒤 재시도 안내 |
| `500` 이상 | `server`, 실패 안내·입력 유지 |
| 통신 실패 | `network`, 접수 여부 미확인 안내·입력 유지 |
| `200`, 접수번호 없는 `201`, 성공 확인이 안 되는 응답 | `unconfirmed`, 완료 처리하지 않음 |
| 수신 경로 없음 | `unavailable`, 요청 없이 연동 준비 상태 |

`submitInquiry`는 `{ ok, code, message, status, fieldErrors, inquiryId, idempotencyKey }`를 반환한다. 동일 문의의 재시도는 같은 키를 유지한다. 클라이언트는 진행 중인 같은 키 요청을 합치며, 서버도 같은 키에 같은 저장 결과를 반환해 중복 생성을 막아야 한다. 검증 오류와 전송량 제한도 서버에 구현한다.

URL에는 `service`, `option`, `teamCount`, `pageCount`만 전달한다. 이름·연락처·문의 본문을 URL·분석 이벤트·영구 브라우저 저장소에 넣지 않는다. 포트폴리오 동의는 필수 개인정보 동의와 분리해 기록하고, 별도 실제 공개 승인 없이 사례를 자동 공개하지 않는다.

## 검증 기록

2026-10-24 현재 소스에서 `node --test redesign-v3/tests/domain.test.mjs`를 실행하여 **15개 통과, 실패 0, 생략 0**을 확인했다. 실제 `127.0.0.1` 임시 HTTP 수신 서버로 `201` 요청 본문·헤더·접수번호를 확인했고, 오류 응답·통신 실패·동시 중복 키·미승인 가격·팀별 합산도 검증했다. 테스트 서버는 테스트 종료 시 닫힌다.

이 결과는 통제된 로컬 수신 환경의 검증이다. 실제 운영 수신 목적지·저장·개인정보 정책 승인·공개 배포는 아직 활성화하지 않았다. 운영 연결 시 같은 성공·검증 오류·중복·실패 시나리오를 해당 수신 환경에서 확인한다.
