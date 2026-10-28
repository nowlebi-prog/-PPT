// Inquiry form behaviour for the home (section 9) and /contact. Markup: src/contact.mjs.
// Before a receiving service is connected the form opens the visitor's mail app and never shows a receipt.
import { site } from './data.mjs';
import { validateInquiry, submitInquiry, mailtoHref, inquiryText, parseSelection, localToday, daysUntil } from './domain.mjs';

export const inquiry = { present: false, prefill() {}, focus() {} };
const form = document.getElementById('inquiry-form');

if (form) {
  inquiry.present = true;
  const $ = (s, r = form) => r.querySelector(s), $$ = (s, r = form) => [...r.querySelectorAll(s)];
  const el = name => form.elements.namedItem(name);
  const live = form.dataset.live === 'true';
  const status = $('[data-status]'), submit = $('[data-submit]'), copyBtn = $('[data-copy]'), more = $('[data-more]');
  const main = $('[data-main]'), done = $('[data-done]');
  const today = localToday();
  const radio = name => $(`input[name="${name}"]:checked`)?.value || '';
  const setRadio = (name, value) => { const input = $$(`input[name="${name}"]`).find(x => x.value === value); if (input) input.checked = true; };
  const setCheck = (name, value, on = true) => { const input = $$(`input[name="${name}"]`).find(x => x.value === value); if (input) input.checked = on; };
  const show = (key, on) => $$(`[data-show="${key}"]`).forEach(x => { x.hidden = !on; });
  const label = text => { $('[data-label]', submit).textContent = text; };
  el('dueDate').min = today;
  submit.disabled = false; // rendered disabled so the form cannot be sent without this script

  function sync() {
    const kind = radio('kind'), inst = kind === 'institution';
    show('institution', inst);
    show('pages-company', !inst);
    show('pages-institution', inst);
    show('purpose-other', radio('purpose') === 'other');
    const extras = $$('input[name=extras]:checked').map(x => x.value);
    show('web-tier', extras.includes('web-event'));
    show('interview', extras.includes('interview'));
    const orgTag = $('[data-org-tag]');
    orgTag.textContent = inst ? '필수' : '선택';
    orgTag.classList.toggle('iq-tag--req', inst);
    el('organization').placeholder = inst ? '기관명' : '개인·예비창업자는 비워 두셔도 됩니다';
    const method = radio('contactMethod');
    for (const m of ['email', 'phone']) {
      const tag = $(`[data-contact-tag="${m}"]`);
      tag.textContent = method === m ? '필수' : '선택';
      tag.classList.toggle('iq-tag--req', method === m);
    }
    const undecided = el('dueUndecided').checked;
    el('dueDate').disabled = undecided;
    const days = daysUntil(el('dueDate').value, today);
    show('urgent', !undecided && days !== null && days >= 0 && days <= 7);
    el('teamCount').disabled = el('teamCountUndecided').checked;
  }

  function payload() {
    const kind = radio('kind');
    return {
      kind, purpose: radio('purpose'), purposeOther: el('purposeOther').value, service: radio('service'),
      dueDate: el('dueDate').value, dueUndecided: el('dueUndecided').checked,
      eventName: el('eventName').value, teamCount: el('teamCount').value, teamCountUndecided: el('teamCountUndecided').checked, exchange: radio('exchange'),
      name: el('name').value, organization: el('organization').value,
      contactMethod: radio('contactMethod'), email: el('email').value, phone: el('phone').value,
      pages: radio(kind === 'institution' ? 'pagesInstitution' : 'pagesCompany'), attachmentLink: el('attachmentLink').value,
      extras: $$('input[name=extras]:checked').map(x => x.value), webTier: radio('webTier'),
      filmingPlace: el('filmingPlace').value, videoCount: el('videoCount').value, filmingNotes: el('filmingNotes').value,
      budget: el('budget').value, message: el('message').value, referral: el('referral').value,
      privacyConsent: el('privacyConsent').checked, portfolioConsent: el('portfolioConsent').checked,
    };
  }

  const order = ['kind', 'purpose', 'purposeOther', 'service', 'dueDate', 'teamCount', 'eventName', 'exchange', 'name', 'organization', 'contactMethod', 'email', 'phone', 'pages', 'attachmentLink', 'files', 'extras', 'webTier', 'filmingPlace', 'videoCount', 'filmingNotes', 'budget', 'referral', 'message', 'privacyConsent'];
  const inputsFor = name => name === 'pages' ? $$('input[name=pagesCompany],input[name=pagesInstitution]') : $$(`[name="${name}"]`);
  function clearError(name) {
    const p = $(`[data-err="${name}"]`);
    if (p) p.textContent = '';
    inputsFor(name).forEach(x => { x.removeAttribute('aria-invalid'); });
  }
  function clearErrors() { order.forEach(clearError); }
  function showErrors(errors) {
    clearErrors();
    let first = null;
    for (const name of order) {
      const message = errors[name];
      if (!message) continue;
      const p = $(`[data-err="${name}"]`);
      if (p) p.textContent = message;
      for (const input of inputsFor(name)) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', `err-${name}`); }
      first ||= inputsFor(name).find(x => !x.disabled && !x.closest('[hidden]')) || p;
    }
    const count = Object.keys(errors).length;
    status.textContent = `입력 항목을 확인해 주세요. (${count}곳)`;
    if (first) {
      if (more.contains(first)) more.open = true;
      first.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      first.focus?.({ preventScroll: true });
    }
  }

  form.addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'extras') {
      if (t.value === 'none' && t.checked) $$('input[name=extras]').forEach(x => { if (x !== t) x.checked = false; });
      else if (t.checked) setCheck('extras', 'none', false);
    }
    if (t.name === 'kind') $$(`input[name=${t.value === 'institution' ? 'pagesCompany' : 'pagesInstitution'}]`).forEach(x => { x.checked = false; });
    if (t.name === 'dueUndecided' || t.name === 'dueDate') clearError('dueDate');
    if (t.name === 'teamCountUndecided') clearError('teamCount');
    if (t.name === 'pagesCompany' || t.name === 'pagesInstitution') clearError('pages');
    if (t.name) clearError(t.name);
    sync();
  });
  form.addEventListener('input', e => { if (e.target.name === 'dueDate') sync(); if (e.target.name) clearError(e.target.name); });

  function prefill(sel = {}) {
    if (sel.kind) setRadio('kind', sel.kind);
    if (sel.purpose) setRadio('purpose', sel.purpose);
    if (sel.service) setRadio('service', sel.service);
    if (sel.due === 'undecided') el('dueUndecided').checked = true;
    else if (sel.due) { el('dueDate').value = sel.due; el('dueUndecided').checked = false; }
    for (const id of sel.optionIds || []) {
      if (id.startsWith('web-') && id !== 'web-company') { setCheck('extras', 'web-event'); setRadio('webTier', id); }
      else setCheck('extras', id);
      setCheck('extras', 'none', false);
      more.open = true;
    }
    if (sel.teamCount) { setRadio('kind', 'institution'); el('teamCount').value = sel.teamCount; }
    if (sel.more) more.open = true;
    sync();
  }
  inquiry.prefill = prefill;
  inquiry.focus = () => { const target = $$('input[name=kind]').find(x => x.checked) ? el('name') : $('input[name=kind]'); target?.focus({ preventScroll: true }); };

  const initial = parseSelection(location.search);
  if (matchMedia('(max-width: 767px)').matches) more.open = false;
  prefill(initial);
  try { if (sessionStorage.getItem('youstar:estimate')) sessionStorage.removeItem('youstar:estimate'); } catch { /* storage may be unavailable */ }

  // Same-page links (pricing, demoday, beyond) carry their selection in data-prefill and keep the #contact jump.
  document.addEventListener('click', e => {
    const a = e.target.closest?.('a[data-prefill]');
    if (!a) return;
    const query = new URLSearchParams(a.dataset.prefill);
    prefill({ ...parseSelection('?' + query), more: query.has('more') });
  });

  // The floating button hides while the form is on screen or being filled in.
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => document.body.classList.toggle('fab-off', entry.isIntersecting), { threshold: 0 }).observe(form);
  form.addEventListener('focusin', () => document.body.classList.add('fab-focus'));
  form.addEventListener('focusout', () => document.body.classList.remove('fab-focus'));

  const newKey = () => globalThis.crypto?.randomUUID?.() || `k-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let busy = false, completed = false, key = newKey(), last = '';

  copyBtn.addEventListener('click', async () => {
    const text = `받는 곳: ${site.email}\n\n${inquiryText(payload())}`;
    try { await navigator.clipboard.writeText(text); status.textContent = `문의 내용을 복사했습니다. ${site.email}로 붙여넣어 보내 주세요.`; }
    catch { status.textContent = `복사하지 못했습니다. ${site.email}로 직접 보내 주시거나 카카오톡으로 문의해 주세요.`; }
  });

  function showDone(id) {
    main.hidden = true;
    done.hidden = false;
    const idLine = $('[data-done-id]', done);
    if (id) { idLine.textContent = `접수 번호: ${id}`; idLine.hidden = false; }
    done.scrollIntoView({ block: 'center', behavior: 'smooth' });
    done.focus({ preventScroll: true });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (busy || completed) return;
    if (el('website').value) return; // honeypot
    const data = payload();
    const fileInput = el('files');
    const files = site.inquiryFiles && fileInput ? [...fileInput.files] : [];
    const errors = validateInquiry(data, { today });
    const maxMB = Number(fileInput?.dataset.maxMb || 0);
    if (maxMB && files.reduce((sum, f) => sum + f.size, 0) > maxMB * 1048576) errors.files = `첨부 파일은 합계 ${maxMB}MB 이하로 올려 주세요.`;
    if (Object.keys(errors).length) { showErrors(errors); return; }
    clearErrors();
    if (!live) {
      status.textContent = `메일 앱을 열었습니다. 메일 앱에서 보내기를 눌러야 접수됩니다. 메일 앱이 열리지 않으면 아래 ‘문의 내용 복사하기’를 눌러 ${site.email}로 보내 주세요.`;
      copyBtn.hidden = false;
      location.href = mailtoHref(data, site.email);
      return;
    }
    const encoded = JSON.stringify(data);
    if (last && encoded !== last) key = newKey();
    last = encoded;
    busy = true;
    submit.disabled = true;
    label('보내는 중…');
    status.textContent = '문의를 보내고 있습니다.';
    try {
      const result = await submitInquiry(data, { provider: site.inquiryProvider, endpoint: site.inquiryEndpoint, accessKey: site.inquiryKey, fetchImpl: (...args) => fetch(...args), idempotencyKey: key, today, files, sourcePath: location.pathname });
      if (result.ok) { completed = true; status.textContent = ''; showDone(result.inquiryId); }
      else {
        status.textContent = result.message + ' 급하시면 카카오톡으로 문의해 주세요.';
        if (Object.keys(result.fieldErrors || {}).length) showErrors(result.fieldErrors);
      }
    } catch {
      status.textContent = '접수 여부를 확인하지 못했습니다. 잠시 후 다시 확인해 주세요.';
    } finally {
      busy = false;
      if (!completed) { submit.disabled = false; label('견적 문의 보내기'); }
    }
  });

  sync();
}
