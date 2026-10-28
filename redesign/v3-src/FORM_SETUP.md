# 문의 폼 실제 접수 연결하기

지금 폼은 접수 서비스가 연결되지 않아 **‘이메일 작성하기’** 버튼으로 동작합니다. 방문자의 메일 앱에 내용이 채워지고, 방문자가 직접 보내야 접수됩니다. 이 상태에서는 접수 완료 화면을 띄우지 않습니다.

아래 세 서비스 중 하나를 고르고, 받은 주소나 키를 `src/data.mjs`의 `site`에 넣으면 버튼이 **‘견적 문의 보내기’**로 바뀌고 실제로 전송됩니다. 단, 개인정보 안내문(`PRIVACY_DRAFT.md`)을 확정해 `privacyApproved: true`와 `privacyPolicy`를 함께 채워야 전송이 켜집니다.

| 서비스 | 한국어 화면 | 문의가 쌓이는 곳 | 첨부 파일 |
| --- | --- | --- | --- |
| ① 구글 시트 + Apps Script | ○ | 구글 시트 + 알림 메일 | ✕ |
| ② Web3Forms | ✕ (화면이 단순함) | 알림 메일 | 유료 |
| ③ Formspree | ✕ | 대시보드 + 알림 메일 | 유료 |

무료 범위와 가격은 각 서비스 사이트에서 확인해 주세요.

## ① 구글 시트 + Apps Script

1. 구글 드라이브에서 새 스프레드시트를 만듭니다. 예: `유별난PPT 견적 문의`
2. 메뉴 **확장 프로그램 → Apps Script**를 엽니다.
3. 기존 코드를 지우고 아래 코드를 붙여 넣은 뒤 저장합니다.
4. 오른쪽 위 **배포 → 새 배포**를 누르고, 유형은 **웹 앱**을 고릅니다.
   - 실행 계정: **나**
   - 액세스 권한: **모든 사용자**
5. **배포**를 누르고 권한을 승인합니다. ‘확인되지 않은 앱’이 나오면 **고급 → (프로젝트 이름)으로 이동**을 누르면 됩니다.
6. 나오는 **웹 앱 URL**(`https://script.google.com/macros/s/…/exec`)을 복사해 전달합니다.

```js
// 유별난PPT 홈페이지 견적 문의 → 시트 저장 + 알림 메일
const NOTIFY = 'contact@youstarppt.com';
const SHEET = '문의';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const rows = Array.isArray(body.rows) ? body.rows.slice(0, 40) : [];
    const key = String(body.key || '').slice(0, 200);
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET) || book.insertSheet(SHEET);
    let header = sheet.getLastRow() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
    if (header[0] !== '접수 시각') header = ['접수 시각', '접수 번호', '요청 키'];
    if (key && sheet.getLastRow() > 1) {
      const keys = sheet.getRange(2, 3, sheet.getLastRow() - 1, 1).getValues().flat();
      const found = keys.indexOf(key);
      if (found >= 0) return json({ ok: true, id: sheet.getRange(found + 2, 2).getValue() }); // 같은 문의 재전송
    }
    for (const [label] of rows) if (!header.includes(label)) header.push(label);
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
    const id = 'Y' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyMMdd') + '-' + Math.max(1, sheet.getLastRow());
    const map = Object.fromEntries(rows.map(([k, v]) => [k, safe(v)]));
    sheet.appendRow(header.map(h => h === '접수 시각' ? new Date() : h === '접수 번호' ? id : h === '요청 키' ? key : (map[h] ?? '')));
    const mail = { to: NOTIFY, subject: String(body.subject || '[유별난PPT 견적 문의]').slice(0, 200), body: rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\n접수 번호: ${id}` };
    if (map['이메일']) mail.replyTo = map['이메일'];
    MailApp.sendEmail(mail);
    return json({ ok: true, id });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// 시트가 수식으로 읽지 않도록 =, +, -, @로 시작하는 값 앞에 ' 를 붙입니다.
function safe(v) { const s = String(v ?? '').slice(0, 5000); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
```

설정값:

```js
inquiryProvider: 'google',
inquiryEndpoint: 'https://script.google.com/macros/s/…/exec',
```

코드를 고친 뒤에는 **배포 → 배포 관리 → 수정 → 새 버전**으로 다시 배포해야 반영됩니다.

## ② Web3Forms

1. web3forms.com에서 `contact@youstarppt.com`을 입력하고 액세스 키를 만듭니다. 회원가입은 필요 없습니다.
2. 메일로 받은 **Access Key**를 전달합니다. 이 키는 공개돼도 되는 값입니다(받는 메일 주소만 정합니다).

```js
inquiryProvider: 'web3forms',
inquiryEndpoint: 'https://api.web3forms.com/submit',
inquiryKey: '받은 액세스 키',
```

## ③ Formspree

1. formspree.io에 가입하고 **New form**에서 받는 메일을 `contact@youstarppt.com`으로 정합니다.
2. 폼 주소(`https://formspree.io/f/xxxxxxx`)를 전달합니다.

```js
inquiryProvider: 'formspree',
inquiryEndpoint: 'https://formspree.io/f/xxxxxxx',
// 유료 플랜에서 파일 첨부를 켤 때만:
// inquiryFiles: true, inquiryMaxFileMB: 25,
```

## 연결 후 확인

1. `npm test`를 실행하고, `SITE_MODE=production npm run build`로 다시 빌드합니다.
2. 배포한 뒤 테스트 문의를 1건 보내고, 다음 세 가지를 확인합니다.
   - 시트나 메일함에 문의가 도착하는지
   - 화면에 ‘문의가 접수되었습니다.’가 뜨는지
   - 알림 메일의 ‘답장’이 문의자 이메일로 가는지
3. 접수 서비스 이름을 개인정보 안내문의 처리 위탁 항목에 적습니다.
