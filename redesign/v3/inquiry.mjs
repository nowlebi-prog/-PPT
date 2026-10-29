// Step-by-step inquiry form for the home (section 9) and /contact. Markup: src/contact.mjs.
// One question per step; the last step asks for contact details and holds the optional extras.
// Without a connected receiving service the form opens the visitor's mail app and never shows a receipt.
import { site, inquiryOptions } from './data.mjs?v=200f3d5b69';
import { validateInquiry, submitInquiry, mailtoHref, inquiryText, summaryLines, parseSelection, localToday, daysUntil } from './domain.mjs?v=200f3d5b69';

const form = document.getElementById('inquiry-form');

if (form) {
  const $ = (s, r = form) => r.querySelector(s), $$ = (s, r = form) => [...r.querySelectorAll(s)];
  const el = name => form.elements.namedItem(name);
  const live = form.dataset.live === 'true';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const status = $('[data-status]'), submit = $('[data-submit]'), copyBtn = $('[data-copy]'), more = $('[data-more]');
  const main = $('[data-main]'), done = $('[data-done]');
  const steps = $$('[data-step]'), last = steps.length - 1;
  const prog = $('[data-prog]'), progText = $('[data-prog-text]'), progBar = $('[data-prog-bar]');
  const nav = $('[data-nav]'), prevBtn = $('[data-prev]'), nextBtn = $('[data-next]'), alt = $('[data-alt]'), recap = $('[data-recap]');
  const today = localToday();
  const radio = name => $(`input[name="${name}"]:checked`)?.value || '';
  const setRadio = (name, value) => { const input = $$(`input[name="${name}"]`).find(x => x.value === value); if (input) input.checked = true; };
  const setCheck = (name, value, on = true) => { const input = $$(`input[name="${name}"]`).find(x => x.value === value); if (input) input.checked = on; };
  const show = (key, on) => $$(`[data-show="${key}"]`).forEach(x => { x.hidden = !on; });
  const label = text => { $('[data-label]', submit).textContent = text; };
  el('dueDate').min = today;
  submit.disabled = false; // rendered disabled so the form cannot be sent without this script

  // Which step holds each field (errors jump to that step).
  // Steps with data-when only appear when that item is chosen in step 1.
  const STEP_FIELDS = [
    ['items'],
    ['kind'],
    ['purpose', 'purposeOther'],
    ['service'],
    ['webType'],
    ['printType'],
    ['visualTypes', 'filmingPlace', 'videoCount', 'filmingNotes'],
    ['dueDate', 'teamCount', 'eventName', 'exchange'],
    ['name', 'organization', 'contactMethod', 'email', 'phone', 'pages', 'attachmentLink', 'files', 'budget', 'referral', 'message', 'privacyConsent'],
  ];
  const WEB_TYPES = new Set(inquiryOptions.webType.map(x => x[0]));
  const items = () => $$('input[name=items]:checked').map(x => x.value);
  const isActive = i => { const when = steps[i].dataset.when; return !when || items().includes(when); };
  const activeSteps = () => steps.map((_, i) => i).filter(isActive);
  const stepOf = name => { const i = STEP_FIELDS.findIndex(list => list.includes(name)); return i < 0 ? last : i; };
  const order = STEP_FIELDS.flat();

  const MORE_FIELDS = ['pages', 'attachmentLink', 'files', 'budget', 'referral', 'message'];

  function sync() {
    const ppt = items().includes('ppt');
    const inst = ppt && radio('kind') === 'institution';
    show('institution', inst);
    show('pages', ppt);
    show('pages-company', !inst);
    show('pages-institution', inst);
    show('purpose-other', radio('purpose') === 'other');
    show('interview', $$('input[name=visualTypes]:checked').some(x => x.value === 'interview'));
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
      items: items(), webType: radio('webType'), printType: radio('printType'), visualTypes: $$('input[name=visualTypes]:checked').map(x => x.value),
      kind, purpose: radio('purpose'), purposeOther: el('purposeOther').value, service: radio('service'),
      dueDate: el('dueDate').value, dueUndecided: el('dueUndecided').checked,
      eventName: el('eventName').value, teamCount: el('teamCount').value, teamCountUndecided: el('teamCountUndecided').checked, exchange: radio('exchange'),
      name: el('name').value, organization: el('organization').value,
      contactMethod: radio('contactMethod'), email: el('email').value, phone: el('phone').value,
      pages: radio(kind === 'institution' ? 'pagesInstitution' : 'pagesCompany'), attachmentLink: el('attachmentLink').value,
      filmingPlace: el('filmingPlace').value, videoCount: el('videoCount').value, filmingNotes: el('filmingNotes').value,
      budget: el('budget').value, message: el('message').value, referral: el('referral').value,
      privacyConsent: el('privacyConsent').checked, portfolioConsent: el('portfolioConsent').checked,
    };
  }

  const inputsFor = name => name === 'pages' ? $$('input[name=pagesCompany],input[name=pagesInstitution]') : $$(`[name="${name}"]`);
  function clearError(name) {
    const p = $(`[data-err="${name}"]`);
    if (p) p.textContent = '';
    inputsFor(name).forEach(x => x.removeAttribute('aria-invalid'));
  }
  const clearErrors = (names = order) => names.forEach(clearError);
  // Shows messages and returns the first element to focus.
  function markErrors(errors) {
    let first = null;
    for (const name of order) {
      const message = errors[name];
      if (!message) continue;
      const p = $(`[data-err="${name}"]`);
      if (p) p.textContent = message;
      for (const input of inputsFor(name)) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', `err-${name}`); }
      if (MORE_FIELDS.includes(name)) more.open = true;
      first ||= inputsFor(name).find(x => !x.disabled && !x.closest('[hidden]')) || p;
    }
    return first;
  }
  const errorsFor = i => Object.fromEntries(Object.entries(validateInquiry(payload(), { today })).filter(([name]) => STEP_FIELDS[i].includes(name)));
  const firstOpenStep = () => { for (const i of activeSteps()) if (i < last && Object.keys(errorsFor(i)).length) return i; return last; };

  function renderRecap() {
    const want = { '만들 것': 0, '의뢰 구분': 1, '자료 용도': 2, '자료 상태': 3, '홈페이지 종류': 4, '인쇄물 종류': 5, '이미지·영상': 6, '필요한 날짜': 7, '참가팀 수': 7 };
    const items = summaryLines(payload()).filter(([name]) => name in want);
    recap.replaceChildren();
    if (items.length) {
      const head = document.createElement('span');
      head.textContent = '고른 내용';
      recap.append(head);
    }
    for (const [name, value] of items) {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.goto = String(want[name]);
      b.textContent = String(value).replace(/ \(.*\)$/, '');
      b.setAttribute('aria-label', `${name}: ${b.textContent}. 눌러서 고치기`);
      recap.append(b);
    }
    recap.hidden = !items.length;
  }

  let cur = 0;
  function go(i, { focus = true, scroll = true } = {}) {
    const list = activeSteps();
    cur = list.find(k => k >= Math.max(0, Math.min(last, i))) ?? last;
    steps.forEach((s, k) => s.classList.toggle('is-on', k === cur));
    const pos = list.indexOf(cur) + 1;
    progText.textContent = `질문 ${pos} / ${list.length}`;
    progBar.style.width = `${(pos / list.length) * 100}%`;
    prevBtn.hidden = cur === 0;
    nextBtn.hidden = cur === last;
    alt.hidden = cur === last;
    if (cur === last) renderRecap();
    if (scroll) {
      const top = form.getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * 0.5) form.scrollIntoView({ block: 'start', behavior: reduce.matches ? 'auto' : 'smooth' });
    }
    if (focus) steps[cur].focus({ preventScroll: true });
  }
  function next() {
    const errors = errorsFor(cur);
    clearErrors(STEP_FIELDS[cur]);
    if (Object.keys(errors).length) { markErrors(errors)?.focus?.({ preventScroll: true }); return; }
    go(activeSteps().find(k => k > cur) ?? last);
  }
  const back = () => { const list = activeSteps().filter(k => k < cur); go(list.length ? list[list.length - 1] : 0); };

  form.classList.add('is-wizard');
  prog.hidden = false;
  nav.hidden = false;
  prevBtn.addEventListener('click', back);
  nextBtn.addEventListener('click', next);
  recap.addEventListener('click', e => { const b = e.target.closest('[data-goto]'); if (b) go(Number(b.dataset.goto)); });

  // A tap on a choice moves on by itself; keyboard users move with the 다음 button.
  let pointerAt = 0;
  form.addEventListener('pointerdown', () => { pointerAt = performance.now(); });
  form.addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'kind') $$(`input[name=${t.value === 'institution' ? 'pagesCompany' : 'pagesInstitution'}]`).forEach(x => { x.checked = false; });
    if (t.name === 'dueUndecided' || t.name === 'dueDate') clearError('dueDate');
    if (t.name === 'teamCountUndecided') clearError('teamCount');
    if (t.name === 'pagesCompany' || t.name === 'pagesInstitution') clearError('pages');
    if (t.name) clearError(t.name);
    sync();
    if (t.name === 'purpose' && t.value === 'other') { setTimeout(() => el('purposeOther').focus(), 0); return; }
    const auto = ['kind', 'purpose', 'service', 'webType', 'printType'].includes(t.name) && t.type === 'radio' && performance.now() - pointerAt < 800;
    if (auto) setTimeout(() => { if (steps[cur].contains(t) && t.checked) next(); }, 220);
  });
  form.addEventListener('input', e => { if (e.target.name === 'dueDate') sync(); if (e.target.name) clearError(e.target.name); });
  // Enter in a text field moves to the next step instead of submitting early.
  form.addEventListener('keydown', e => {
    if (e.key !== 'Enter' || cur === last || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
    e.preventDefault();
    next();
  });

  function prefill(sel = {}) {
    const chosen = new Set(sel.items || []);
    if (sel.kind || sel.purpose || sel.service || sel.teamCount) chosen.add('ppt');
    for (const id of sel.optionIds || []) {
      if (WEB_TYPES.has(id)) { chosen.add('web'); setRadio('webType', id); }
      else if (id === 'print') chosen.add('print');
      else if (id === 'interview') { chosen.add('visual'); setCheck('visualTypes', 'interview'); }
      else if (id === 'visual') chosen.add('visual');
    }
    chosen.forEach(id => setCheck('items', id));
    if (sel.kind) setRadio('kind', sel.kind);
    if (sel.purpose) setRadio('purpose', sel.purpose);
    if (sel.service) setRadio('service', sel.service);
    if (sel.due === 'undecided') el('dueUndecided').checked = true;
    else if (sel.due) { el('dueDate').value = sel.due; el('dueUndecided').checked = false; }
    if (sel.teamCount) { setRadio('kind', 'institution'); el('teamCount').value = sel.teamCount; }
    if (sel.more) more.open = true;
    sync();
  }

  const initial = parseSelection(location.search);
  prefill(initial);
  go([initial.items.length, initial.optionIds.length, initial.kind, initial.purpose, initial.service, initial.due].some(Boolean) ? firstOpenStep() : 0, { focus: false, scroll: false });
  try { sessionStorage.removeItem('youstar:estimate'); } catch { /* storage may be unavailable */ }

  // Same-page links (pricing, demoday, beyond) carry their selection in data-prefill and keep the #contact jump.
  document.addEventListener('click', e => {
    const a = e.target.closest?.('a[data-prefill]');
    if (!a) return;
    const query = new URLSearchParams(a.dataset.prefill);
    prefill({ ...parseSelection('?' + query), more: query.has('more') });
    go(firstOpenStep(), { focus: false, scroll: false });
  });

  // The floating button hides while the form is on screen or being filled in.
  if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => document.body.classList.toggle('fab-off', entry.isIntersecting), { threshold: 0 }).observe(form);
  form.addEventListener('focusin', () => document.body.classList.add('fab-focus'));
  form.addEventListener('focusout', () => document.body.classList.remove('fab-focus'));

  const newKey = () => globalThis.crypto?.randomUUID?.() || `k-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let busy = false, completed = false, key = newKey(), lastSent = '';

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
    done.scrollIntoView({ block: 'center', behavior: reduce.matches ? 'auto' : 'smooth' });
    done.focus({ preventScroll: true });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (cur < last) { next(); return; }
    if (busy || completed) return;
    if (el('website').value) return; // honeypot
    const data = payload();
    const fileInput = el('files');
    const files = site.inquiryFiles && fileInput ? [...fileInput.files] : [];
    const errors = validateInquiry(data, { today });
    const maxMB = Number(fileInput?.dataset.maxMb || 0);
    if (maxMB && files.reduce((sum, f) => sum + f.size, 0) > maxMB * 1048576) errors.files = `첨부 파일은 합계 ${maxMB}MB 이하로 올려 주세요.`;
    clearErrors();
    if (Object.keys(errors).length) {
      const target = Math.min(...Object.keys(errors).map(stepOf));
      go(target, { focus: false });
      const first = markErrors(Object.fromEntries(Object.entries(errors).filter(([name]) => stepOf(name) === target)));
      if (target === last) status.textContent = '입력 항목을 확인해 주세요.';
      first?.focus?.({ preventScroll: true });
      return;
    }
    if (!live) {
      status.textContent = `메일 앱을 열었습니다. 메일 앱에서 보내기를 눌러야 접수됩니다. 메일 앱이 열리지 않으면 아래 ‘문의 내용 복사하기’를 눌러 ${site.email}로 보내 주세요.`;
      copyBtn.hidden = false;
      location.href = mailtoHref(data, site.email);
      return;
    }
    const encoded = JSON.stringify(data);
    if (lastSent && encoded !== lastSent) key = newKey();
    lastSent = encoded;
    busy = true;
    submit.disabled = true;
    label('보내는 중…');
    status.textContent = '문의를 보내고 있습니다.';
    try {
      const result = await submitInquiry(data, { provider: site.inquiryProvider, endpoint: site.inquiryEndpoint, accessKey: site.inquiryKey, fetchImpl: (...args) => fetch(...args), idempotencyKey: key, today, files, sourcePath: location.pathname });
      if (result.ok) { completed = true; status.textContent = ''; showDone(result.inquiryId); }
      else {
        status.textContent = result.message + ' 급하시면 카카오톡으로 문의해 주세요.';
        const fieldErrors = result.fieldErrors || {};
        if (Object.keys(fieldErrors).length) {
          const target = Math.min(...Object.keys(fieldErrors).map(stepOf));
          go(target, { focus: false });
          markErrors(fieldErrors)?.focus?.({ preventScroll: true });
        }
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
