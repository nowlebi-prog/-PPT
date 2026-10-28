// One inquiry form shared by the home (section 9), /contact and the quick quote. Behaviour: public/inquiry.mjs.
import { site, inquiryOptions, websiteOptions } from './data.mjs';
import { esc, arrow, ext, title, eyebrow } from './ui.mjs';

export const inquiryLive = () => Boolean(site.inquiryProvider && site.inquiryEndpoint && site.privacyApproved && Array.isArray(site.privacyPolicy) && site.privacyPolicy.length);

const req = '<span class="iq-tag iq-tag--req">필수</span>';
const opt = '<span class="iq-tag">선택</span>';
const err = name => `<p class="iq-err" id="err-${name}" data-err="${name}"></p>`;
const card = (name, [value, label, hint], type = 'radio') => `<label class="iq-card"><input type="${type}" name="${name}" value="${esc(value)}"><span class="iq-card__t">${esc(label)}</span>${hint ? `<span class="iq-card__h">${esc(hint)}</span>` : ''}</label>`;
const chip = (name, value, label, type = 'radio') => `<label class="iq-chip"><input type="${type}" name="${name}" value="${esc(value)}"><span>${esc(label)}</span></label>`;
const group = (name, legend, body, { required = false, cls = '', hint = '' } = {}) => `<fieldset class="iq-f${cls ? ' ' + cls : ''}" data-f="${name}"><legend>${legend} ${required ? req : opt}</legend>${hint ? `<p class="iq-hint">${hint}</p>` : ''}${body}${err(name)}</fieldset>`;
const field = (name, label, input, { required = false, hint = '', tag = '' } = {}) => `<div class="iq-f" data-f="${name}"><label class="iq-label" for="iq-${name}">${label} ${tag || (required ? req : opt)}</label>${input}${hint ? `<p class="iq-hint">${hint}</p>` : ''}${err(name)}</div>`;

export function inquiryForm(base = '') {
  const live = inquiryLive();
  const o = inquiryOptions;
  return `<form class="iq" id="inquiry-form" method="post" action="#" novalidate data-mail="${esc(site.email)}" data-live="${live}">
 <div class="iq__done" data-done hidden tabindex="-1">
  <p class="iq__mark" aria-hidden="true">✓</p>
  <h3>문의가 접수되었습니다.</h3>
  <p>남겨주신 내용을 확인한 뒤, 선택하신 연락처로 안내드리겠습니다.</p>
  <p class="iq-hint" data-done-id hidden></p>
  <p class="iq__done-note">추가로 전달할 내용이 있다면 카카오톡에서 접수하신 이름과 함께 알려주세요.</p>
  <a class="iq-btn iq-btn--kakao" href="${site.kakao}" target="_blank" rel="noopener">카카오톡으로 문의하기 ${ext}</a>
 </div>
 <div class="iq__main" data-main>
  <p class="iq__lead">필수 항목만 채워도 보낼 수 있습니다.</p>
  ${group('kind', '어떤 의뢰인가요?', `<div class="iq-cards iq-cards--2">${o.kind.map(x => card('kind', x)).join('')}</div>`, { required: true })}
  ${group('purpose', '어디에 쓸 자료인가요?', `<div class="iq-chips">${o.purpose.map(([v, l]) => chip('purpose', v, l)).join('')}</div><div class="iq-sub" data-show="purpose-other" hidden><label class="sr-only" for="iq-purposeOther">어떤 자료인지</label><input id="iq-purposeOther" name="purposeOther" maxlength="100" placeholder="어떤 자료인지 적어 주세요">${err('purposeOther')}</div>`, { required: true })}
  ${group('service', '지금 자료는 어떤 상태인가요?', `<div class="iq-cards iq-cards--2">${o.state.map(x => card('service', x)).join('')}</div>`, { required: true })}
  ${group('dueDate', '필요한 날짜', `<div class="iq-due"><input type="date" id="iq-dueDate" name="dueDate" aria-label="필요한 날짜"><label class="iq-check"><input type="checkbox" name="dueUndecided"><span>아직 미정</span></label></div><p class="iq-urgent" data-show="urgent" hidden>급한 일정은 카카오톡이 가장 빨라요. <a href="${site.kakao}" target="_blank" rel="noopener">카카오톡으로 문의하기 ${ext}</a></p>`, { required: true, hint: '미정이어도 괜찮습니다.' })}
  <div class="iq-inst" data-show="institution" hidden>
   ${group('teamCount', '참가팀 수', `<div class="iq-due"><input type="number" id="iq-teamCount" name="teamCount" min="1" max="100" step="1" inputmode="numeric" placeholder="예: 6" aria-label="참가팀 수"><label class="iq-check"><input type="checkbox" name="teamCountUndecided"><span>미정</span></label></div>`, { required: true })}
   ${field('eventName', '행사명', '<input id="iq-eventName" name="eventName" maxlength="100" placeholder="예: 2026 데모데이">')}
   ${group('exchange', '자료 주고받는 방식', `<div class="iq-cards iq-cards--3">${o.exchange.map(x => card('exchange', x)).join('')}</div>`)}
  </div>
  <div class="iq-row">
   ${field('name', '이름', '<input id="iq-name" name="name" maxlength="50" autocomplete="name" placeholder="이름">', { required: true })}
   ${field('organization', '회사·기관명', '<input id="iq-organization" name="organization" maxlength="100" autocomplete="organization" placeholder="개인·예비창업자는 비워 두셔도 됩니다">', { tag: `<span class="iq-tag" data-org-tag>선택</span>` })}
  </div>
  ${group('contactMethod', '회신 받을 연락처', `<div class="iq-chips iq-chips--tight">${chip('contactMethod', 'email', '이메일로 받기')}${chip('contactMethod', 'phone', '전화로 받기')}</div>
   <div class="iq-row iq-row--contact">
    <div class="iq-sub"><label class="iq-label" for="iq-email">이메일 <span class="iq-tag" data-contact-tag="email">선택</span></label><input id="iq-email" name="email" type="email" maxlength="254" autocomplete="email" placeholder="example@company.co.kr">${err('email')}</div>
    <div class="iq-sub"><label class="iq-label" for="iq-phone">전화 <span class="iq-tag" data-contact-tag="phone">선택</span></label><input id="iq-phone" name="phone" type="tel" maxlength="30" autocomplete="tel" inputmode="tel" placeholder="010-0000-0000">${err('phone')}</div>
   </div>`, { required: true, hint: '고른 쪽만 적으면 됩니다.' })}
  <details class="iq-more" data-more open>
   <summary><span>더 알려 주기</span><small>선택 · 분량, 자료, 함께 필요한 것, 예산</small></summary>
   <div class="iq-more__body">
    ${group('pages', '예상 분량', `<div class="iq-chips" data-show="pages-company">${o.pagesCompany.map(v => chip('pagesCompany', v, v)).join('')}</div><div class="iq-chips" data-show="pages-institution" hidden>${o.pagesInstitution.map(v => chip('pagesInstitution', v, v)).join('')}</div>`)}
    ${field('attachmentLink', '자료 링크', `<input id="iq-attachmentLink" name="attachmentLink" type="url" maxlength="500" inputmode="url" placeholder="구글 드라이브·드롭박스 등 공유 링크">${site.inquiryFiles ? `<input class="iq-file" id="iq-files" name="files" type="file" multiple accept=".ppt,.pptx,.pdf,.hwp,.hwpx,.doc,.docx,.key,.png,.jpg,.jpeg,.zip"${site.inquiryMaxFileMB ? ` data-max-mb="${site.inquiryMaxFileMB}"` : ''}>` : ''}`, { hint: `견적 확인에만 쓰고 공개하지 않습니다.${site.inquiryFiles ? (site.inquiryMaxFileMB ? ` 파일은 PPT·PDF·한글·워드·이미지, 최대 ${site.inquiryMaxFileMB}MB.` : ' 파일은 PPT·PDF·한글·워드·이미지.') : ' 파일은 회신 메일로 받아도 됩니다.'}` })}
    ${group('extras', 'PPT 말고 함께 필요한 것', `<div class="iq-chips">${o.extras.map(([v, l, h]) => chip('extras', v, h ? `${l}(${h})` : l, 'checkbox')).join('')}</div>
     <div class="iq-sub" data-show="web-tier" hidden><p class="iq-label">행사 홈페이지 종류 <span class="iq-tag iq-tag--req">하나 선택</span></p><div class="iq-cards iq-cards--3">${websiteOptions.map(w => card('webTier', [w.id, w.name, w.summary])).join('')}</div>${err('webTier')}</div>
     <div class="iq-sub iq-interview" data-show="interview" hidden><p class="iq-label">촬영 정보 <span class="iq-tag">선택</span></p><div class="iq-row"><div><label class="sr-only" for="iq-filmingPlace">촬영 장소</label><input id="iq-filmingPlace" name="filmingPlace" maxlength="200" placeholder="촬영 장소"></div><div><label class="sr-only" for="iq-videoCount">영상 편수</label><input id="iq-videoCount" name="videoCount" type="number" min="1" max="100" step="1" inputmode="numeric" placeholder="영상 편수"></div></div><label class="sr-only" for="iq-filmingNotes">촬영 희망 조건</label><textarea id="iq-filmingNotes" name="filmingNotes" rows="2" maxlength="1000" placeholder="촬영일, 팀별 인원, 희망 길이 등 (미정 가능)"></textarea>${err('filmingPlace')}${err('videoCount')}${err('filmingNotes')}</div>`)}
    <div class="iq-row">
     ${field('budget', '예산', '<input id="iq-budget" name="budget" maxlength="100" placeholder="예: 총 200만원 이내">')}
     ${field('referral', '어떻게 알고 오셨나요?', `<select id="iq-referral" name="referral"><option value="">선택 안 함</option>${o.referral.map(v => `<option>${esc(v)}</option>`).join('')}</select>`)}
    </div>
    ${field('message', '더 알려 주실 내용', '<textarea id="iq-message" name="message" rows="4" maxlength="5000" placeholder="발표 상황, 참고할 자료, 궁금한 점 등"></textarea>')}
   </div>
  </details>
  <div class="iq-consent">
   <label class="iq-check iq-check--block"><input type="checkbox" name="privacyConsent"><span><b>${req} 개인정보 수집·이용에 동의합니다.</b><small>수집 항목: 이름, 회사·기관명, 이메일, 전화번호, 첨부 자료 · 이용 목적: 견적 상담과 회신 · 보유 기간: 상담 종료 후 1년 · <a href="${base}privacy/">개인정보 안내</a></small></span></label>
   ${err('privacyConsent')}
   <label class="iq-check iq-check--block"><input type="checkbox" name="portfolioConsent"><span><b>${opt} 포트폴리오 활용 협의에 동의합니다.</b><small>별도로 공개 승인을 받은 뒤에만 작업 사례로 사용합니다.</small></span></label>
  </div>
  <div class="iq-hp" aria-hidden="true"><label>웹사이트<input name="website" tabindex="-1" autocomplete="off"></label></div>
  <p class="iq-status" data-status role="status" aria-live="polite"></p>
  <div class="iq-actions">
   <button class="iq-btn iq-btn--primary" type="submit" data-submit disabled><span data-label>${live ? '견적 문의 보내기' : '이메일 작성하기'}</span> ${arrow}</button>
   <a class="iq-btn iq-btn--kakao" href="${site.kakao}" target="_blank" rel="noopener">카카오톡으로 문의하기 ${ext}</a>
  </div>
  <noscript><p class="iq-status">자바스크립트가 꺼져 있어 양식을 보낼 수 없습니다. ${esc(site.email)} 또는 카카오톡으로 문의해 주세요.</p></noscript>
  <button class="iq-copy" type="button" data-copy hidden>문의 내용 복사하기</button>
  <p class="iq-note">${live ? '보내 주신 내용은 견적 상담과 회신에만 사용합니다.' : `버튼을 누르면 메일 앱에 내용이 채워집니다. 메일 앱에서 보내기를 눌러야 접수됩니다. 받는 곳: ${esc(site.email)}`}</p>
 </div>
</form>`;
}

const contactList = () => {
  const tel = site.phone.replaceAll('-', '');
  return `<dl class="h-ct__list">
   <div><dt>전화</dt><dd><a href="tel:${tel}">${site.phone}</a></dd></div>
   <div><dt>이메일</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div>
   <div><dt>카카오톡</dt><dd><a href="${site.kakao}" target="_blank" rel="noopener">카카오톡 채널 ${ext}</a></dd></div>
   <div><dt>상담 시간</dt><dd>${site.hours}</dd></div>
  </dl>`;
};

/** Section 9 of the home; on /contact the same block is the page body with an h1. */
export function contactSection(base = '', { page = false } = {}) {
  const H = page ? 'h1' : 'h2';
  return `<section id="contact" class="h-ct${page ? ' h-ct--page' : ''}" data-header="dark">
 <div class="h-ct__info">
  ${eyebrow('LET’S TALK', 'h-eye--dark')}
  <${H} class="h-ct__title">${title(['다음 발표,', '함께 준비할까요?'])}</${H}>
  <p class="h-ct__sub">완성된 초안이 아니어도 괜찮습니다. 지금 가진 자료와 필요한 일정을 알려주세요.</p>
  <p class="h-ct__body">자료를 살펴보고, 목적에 맞는 제작 범위와 견적을 안내하겠습니다.</p>
  ${contactList()}
 </div>
 <div class="h-ct__form">${inquiryForm(base)}</div>
</section>`;
}

/** Closing band for sub pages. */
export function closingBand(base = '') {
  return `<section class="h-close" data-header="dark">
 <div class="h-close__inner">
  ${eyebrow('LET’S TALK', 'h-eye--dark')}
  <h2>${title(['다음 발표,', '함께 준비할까요?'])}</h2>
  <p>완성된 초안이 아니어도 괜찮습니다. 지금 가진 자료와 필요한 일정을 알려주세요.</p>
  <div class="h-close__cta"><a class="h-close__quote" href="${base}contact/">견적 문의 ${arrow}</a><a class="h-close__kakao" href="${site.kakao}" target="_blank" rel="noopener">카카오톡으로 문의하기 ${ext}</a></div>
 </div>
</section>`;
}
