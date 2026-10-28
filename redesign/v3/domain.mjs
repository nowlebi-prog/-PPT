import { pricing, websiteOptions, inquiryOptions, demodayPrice } from './data.mjs';

const codes = list => new Set(list.map(item => Array.isArray(item) ? item[0] : item));
const KIND = codes(inquiryOptions.kind);
const PURPOSE = codes(inquiryOptions.purpose);
const STATE = codes(inquiryOptions.state);
const PAGES = { company: new Set(inquiryOptions.pagesCompany), institution: new Set(inquiryOptions.pagesInstitution) };
const EXTRAS = codes(inquiryOptions.extras);
const EXCHANGE = codes(inquiryOptions.exchange);
const REFERRAL = new Set(inquiryOptions.referral);
const WEB_TIERS = new Set(websiteOptions.map(item => item.id));
const QUERY_OPTIONS = new Set([...EXTRAS, ...WEB_TIERS].filter(id => id !== 'none' && id !== 'web-event'));
const SERVICE_QUERY = new Set([...pricing.map(item => item.id), 'unsure']);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inFlight = new Map();

const isPositiveInteger = value => Number.isSafeInteger(value) && value > 0;
const isMoney = value => Number.isSafeInteger(value) && value >= 0;
const text = value => typeof value === 'string' ? value.trim() : (typeof value === 'number' && Number.isFinite(value) ? String(value) : '');
const labelOf = (list, value) => {
  const found = list.find(item => (Array.isArray(item) ? item[0] : item) === value);
  if (!found) return value ?? '';
  return Array.isArray(found) ? (found[2] ? `${found[1]} (${found[2]})` : found[1]) : found;
};

function optionalInteger(value) {
  if (isPositiveInteger(value)) return value;
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value.trim())) return null;
  const integer = Number(value.trim());
  return isPositiveInteger(integer) ? integer : null;
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

/** Visitor's local calendar date as YYYY-MM-DD. */
export function localToday(now = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Whole days from today to date (both YYYY-MM-DD); null when either is invalid. */
export function daysUntil(date, today = localToday()) {
  if (!validDate(date) || !validDate(today)) return null;
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
}

/** Draft prices and unknown/invalid page counts intentionally have no total. */
export function calculatePpt(product, pages) {
  if (!product || product.status !== 'approved') return { amount: null, reason: '자료 확인 후 안내' };
  if (!isPositiveInteger(pages)) return { amount: null, reason: '장수가 정해지면 양의 정수로 입력해 주세요.' };
  if (isPositiveInteger(product.minPages) && pages < product.minPages) return { amount: null, reason: `최소 ${product.minPages}장부터 상담할 수 있습니다.` };
  if (!isMoney(product.unitPrice) || !isMoney(product.setupFee ?? 0)) return { amount: null, reason: '가격 기준 확인이 필요합니다.' };
  const amount = (product.setupFee ?? 0) + pages * product.unitPrice;
  return Number.isSafeInteger(amount) ? { amount, reason: '' } : { amount: null, reason: '제작 분량을 다시 확인해 주세요.' };
}

/** Each array item is one team's page count; null means that team's count is unknown. */
export function calculateDemoday(pagesArray, price = demodayPrice) {
  if (!Array.isArray(pagesArray) || !pagesArray.length) throw new RangeError('팀 수는 1 이상의 정수여야 합니다.');
  let amount = 0;
  let estimated = false;
  for (const pages of pagesArray) {
    if (pages !== null && !isPositiveInteger(pages)) throw new RangeError('팀별 장수는 양의 정수 또는 null이어야 합니다.');
    estimated ||= pages === null;
    amount += price.perTeam + (pages === null ? 0 : Math.max(0, pages - price.pagesIncluded) * price.extraPerPage);
    if (!Number.isSafeInteger(amount)) throw new RangeError('계산 가능한 제작 분량을 초과했습니다.');
  }
  return { amount, estimated };
}

/** Only non-personal selection fields are read from a query string. */
export function parseSelection(search = '') {
  const query = new URLSearchParams(typeof search === 'string' || search instanceof URLSearchParams ? search : '');
  const service = query.get('service');
  const selected = [];
  let hasWebsite = false;
  for (const id of query.getAll('option').flatMap(value => value.split(','))) {
    if (!QUERY_OPTIONS.has(id) || selected.includes(id)) continue;
    if (WEB_TIERS.has(id)) {
      if (hasWebsite) continue;
      hasWebsite = true;
    }
    selected.push(id);
  }
  const kind = service === 'demoday' ? 'institution' : (KIND.has(query.get('kind')) ? query.get('kind') : null);
  const due = query.get('due');
  return {
    service: SERVICE_QUERY.has(service) ? service : null,
    kind,
    purpose: PURPOSE.has(query.get('purpose')) ? query.get('purpose') : null,
    due: due === 'undecided' || validDate(due) ? due : null,
    optionIds: selected,
    teamCount: optionalInteger(query.get('teamCount')),
    pageCount: optionalInteger(query.get('pageCount')),
  };
}

/** Keeps only the fields that apply to the chosen kind and options, trimmed and in canonical form. */
export function normalizeInquiry(input = {}) {
  const p = input && typeof input === 'object' ? input : {};
  const kind = KIND.has(p.kind) ? p.kind : null;
  const institution = kind === 'institution';
  const extras = [...new Set(Array.isArray(p.extras) ? p.extras.filter(id => EXTRAS.has(id)) : [])];
  const interview = extras.includes('interview');
  const pages = text(p.pages);
  return {
    kind,
    purpose: PURPOSE.has(p.purpose) ? p.purpose : null,
    purposeOther: p.purpose === 'other' ? text(p.purposeOther) : '',
    service: STATE.has(p.service) ? p.service : null,
    dueDate: p.dueUndecided === true || !validDate(text(p.dueDate)) ? null : text(p.dueDate),
    dueUndecided: p.dueUndecided === true,
    eventName: institution ? text(p.eventName) : '',
    teamCount: institution && p.teamCountUndecided !== true ? optionalInteger(p.teamCount) : null,
    teamCountUndecided: institution && p.teamCountUndecided === true,
    exchange: institution && EXCHANGE.has(p.exchange) ? p.exchange : null,
    pages: kind && PAGES[kind].has(pages) ? pages : null,
    attachmentLink: text(p.attachmentLink),
    extras,
    webTier: extras.includes('web-event') && WEB_TIERS.has(p.webTier) ? p.webTier : null,
    filmingPlace: interview ? text(p.filmingPlace) : '',
    videoCount: interview ? optionalInteger(p.videoCount) : null,
    filmingNotes: interview ? text(p.filmingNotes) : '',
    name: text(p.name),
    organization: text(p.organization),
    contactMethod: p.contactMethod === 'email' || p.contactMethod === 'phone' ? p.contactMethod : null,
    email: text(p.email),
    phone: text(p.phone),
    budget: text(p.budget),
    message: text(p.message),
    referral: REFERRAL.has(p.referral) ? p.referral : null,
    privacyConsent: p.privacyConsent === true,
    portfolioConsent: p.portfolioConsent === true,
  };
}

/** Client validation; a receiving server must repeat it. Returns { field: message }. */
export function validateInquiry(input = {}, { today = localToday() } = {}) {
  const p = input && typeof input === 'object' ? input : {};
  const s = field => text(p[field]);
  const e = {};
  if (!KIND.has(p.kind)) e.kind = '어떤 의뢰인지 선택해 주세요.';
  if (!PURPOSE.has(p.purpose)) e.purpose = '어디에 쓸 자료인지 선택해 주세요.';
  else if (p.purpose === 'other' && !s('purposeOther')) e.purposeOther = '어떤 자료인지 적어 주세요.';
  if (s('purposeOther').length > 100) e.purposeOther = '100자 이내로 적어 주세요.';
  if (!STATE.has(p.service)) e.service = '지금 자료 상태를 선택해 주세요.';
  if (p.dueUndecided !== true) {
    const due = s('dueDate');
    if (!validDate(due)) e.dueDate = '필요한 날짜를 고르거나 ‘아직 미정’을 선택해 주세요.';
    else if (due < today) e.dueDate = '오늘 이후 날짜를 골라 주세요.';
  }
  if (p.kind === 'institution') {
    if (p.teamCountUndecided !== true) {
      const teams = optionalInteger(p.teamCount);
      if (teams === null || teams > 100) e.teamCount = '참가팀 수를 1~100 사이로 입력하거나 ‘미정’을 선택해 주세요.';
    }
    if (!s('organization')) e.organization = '기관명을 입력해 주세요.';
    if (s('eventName').length > 100) e.eventName = '행사명은 100자 이내로 입력해 주세요.';
    if (s('exchange') && !EXCHANGE.has(p.exchange)) e.exchange = '자료 주고받는 방식을 다시 선택해 주세요.';
  }
  if (!s('name') || s('name').length > 50) e.name = '이름을 1~50자로 입력해 주세요.';
  if (!e.organization && s('organization').length > 100) e.organization = '회사·기관명은 100자 이내로 입력해 주세요.';
  if (p.contactMethod !== 'email' && p.contactMethod !== 'phone') e.contactMethod = '회신 받을 방법을 선택해 주세요.';
  const email = s('email');
  if (email) { if (email.length > 254 || !EMAIL.test(email)) e.email = '이메일 주소를 확인해 주세요.'; }
  else if (p.contactMethod === 'email') e.email = '회신 받을 이메일을 입력해 주세요.';
  const phone = s('phone');
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    if (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 7 || digits.length > 15 || phone.length > 30) e.phone = '전화번호를 확인해 주세요.';
  } else if (p.contactMethod === 'phone') e.phone = '회신 받을 전화번호를 입력해 주세요.';
  if (s('pages') && !(KIND.has(p.kind) && PAGES[p.kind].has(s('pages')))) e.pages = '예상 분량을 다시 선택해 주세요.';
  const link = s('attachmentLink');
  if (link && (link.length > 500 || !/^https?:\/\/\S+$/i.test(link))) e.attachmentLink = '공유 링크는 http:// 또는 https://로 시작하는 주소로 입력해 주세요.';
  if (p.extras !== undefined) {
    if (!Array.isArray(p.extras) || p.extras.some(id => !EXTRAS.has(id))) e.extras = '함께 필요한 것을 다시 선택해 주세요.';
    else if (p.extras.includes('none') && p.extras.length > 1) e.extras = '‘없어요’는 다른 항목과 함께 고를 수 없습니다.';
    else if (p.extras.includes('web-event') && !WEB_TIERS.has(p.webTier)) e.webTier = '행사 홈페이지 종류를 하나 골라 주세요.';
    if (Array.isArray(p.extras) && p.extras.includes('interview')) {
      if (s('filmingPlace').length > 200) e.filmingPlace = '촬영 장소는 200자 이내로 입력해 주세요.';
      if (s('videoCount') && (optionalInteger(p.videoCount) === null || optionalInteger(p.videoCount) > 100)) e.videoCount = '영상 편수는 1~100 사이의 숫자로 입력해 주세요.';
      if (s('filmingNotes').length > 1000) e.filmingNotes = '촬영 희망 조건은 1000자 이내로 입력해 주세요.';
    }
  }
  if (s('budget').length > 100) e.budget = '예산은 100자 이내로 입력해 주세요.';
  if (s('message').length > 5000) e.message = '5000자 이내로 입력해 주세요.';
  if (s('referral') && !REFERRAL.has(p.referral)) e.referral = '알게 된 경로를 다시 선택해 주세요.';
  if (p.privacyConsent !== true) e.privacyConsent = '개인정보 수집·이용에 동의해 주세요.';
  if (p.portfolioConsent !== undefined && typeof p.portfolioConsent !== 'boolean') e.portfolioConsent = '포트폴리오 활용 동의 여부를 확인해 주세요.';
  return e;
}

/** Human-readable [label, value] rows used for e-mail, form services and the KakaoTalk copy. */
export function summaryLines(input) {
  const n = normalizeInquiry(input);
  const tierNames = websiteOptions.map(item => [item.id, item.name]);
  const rows = [
    ['의뢰 구분', n.kind && labelOf(inquiryOptions.kind, n.kind)],
    ['자료 용도', n.purpose === 'other' ? `기타${n.purposeOther ? ` (${n.purposeOther})` : ''}` : n.purpose && labelOf(inquiryOptions.purpose, n.purpose)],
    ['자료 상태', n.service && labelOf(inquiryOptions.state, n.service)],
    ['필요한 날짜', n.dueUndecided ? '아직 미정' : n.dueDate],
    ['행사명', n.eventName],
    ['참가팀 수', n.teamCountUndecided ? '미정' : n.teamCount && `${n.teamCount}팀`],
    ['자료 주고받는 방식', n.exchange && labelOf(inquiryOptions.exchange, n.exchange).replace(/ \(.*\)$/, '')],
    ['예상 분량', n.pages],
    ['자료 링크', n.attachmentLink],
    ['함께 필요한 것', n.extras.map(id => id === 'web-event' && n.webTier ? `행사 홈페이지 (${labelOf(tierNames, n.webTier)})` : labelOf(inquiryOptions.extras, id)).join(', ')],
    ['촬영 장소', n.filmingPlace],
    ['영상 편수', n.videoCount && `${n.videoCount}편`],
    ['촬영 희망 조건', n.filmingNotes],
    ['이름', n.name],
    ['회사·기관명', n.organization],
    ['회신 방법', n.contactMethod === 'phone' ? '전화' : n.contactMethod === 'email' ? '이메일' : ''],
    ['이메일', n.email],
    ['전화', n.phone],
    ['예산', n.budget],
    ['더 알려 주실 내용', n.message],
    ['알게 된 경로', n.referral],
    ['포트폴리오 활용 협의', n.portfolioConsent ? '동의' : '동의하지 않음'],
  ];
  return rows.filter(([, value]) => value !== null && value !== undefined && value !== '');
}

export function inquirySubject(input) {
  const n = normalizeInquiry(input);
  return ['[유별난PPT 견적 문의]', n.organization, n.name].filter(Boolean).join(' ');
}

export function inquiryText(input) {
  return summaryLines(input).map(([label, value]) => String(value).includes('\n') ? `${label}:\n${value}` : `${label}: ${value}`).join('\n');
}

/** Fallback before a receiving service is connected: the visitor's own mail app sends it. Never a receipt. */
export function mailtoHref(input, to) {
  return `mailto:${to}?subject=${encodeURIComponent(inquirySubject(input))}&body=${encodeURIComponent(inquiryText(input))}`;
}

function outcome(code, message, { status = 0, fieldErrors = {}, inquiryId = null, idempotencyKey = null } = {}) {
  return { ok: code === 'success', code, message, status, fieldErrors, inquiryId, idempotencyKey };
}

function safeSourcePath(value) {
  const path = text(value).split(/[?#]/, 1)[0];
  return /^\/(?!\/)/.test(path) && path.length <= 500 ? path : '/contact';
}

const API_FIELDS = Object.keys(normalizeInquiry({}));
function responseErrors(data) {
  const raw = data?.fieldErrors ?? data?.errors;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return Object.fromEntries(Object.entries(raw).filter(([field, message]) => API_FIELDS.includes(field) && typeof message === 'string').map(([field, message]) => [field, message.slice(0, 500)]));
}
function serviceMessage(data) {
  const list = Array.isArray(data?.errors) ? data.errors.map(item => item?.message).filter(m => typeof m === 'string') : [];
  return (list.join(' ') || (typeof data?.message === 'string' ? data.message : '')).slice(0, 300);
}

/** Builds the HTTP request for each supported receiving service. */
function buildRequest(provider, payload, key, { files = [], accessKey = null, sourcePath } = {}) {
  const n = normalizeInquiry(payload);
  const lines = summaryLines(payload);
  const subject = inquirySubject(payload);
  if (provider === 'api') {
    return { init: { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify({ ...n, sourcePath: safeSourcePath(sourcePath), idempotencyKey: key }) } };
  }
  if (provider === 'formspree') {
    const body = new FormData();
    body.append('_subject', subject);
    if (n.email) body.append('email', n.email);
    for (const [label, value] of lines) body.append(label, String(value));
    for (const file of files) body.append('첨부 파일', file);
    return { init: { method: 'POST', headers: { Accept: 'application/json' }, body } };
  }
  if (provider === 'web3forms') {
    const body = { access_key: accessKey, subject, from_name: '유별난PPT 홈페이지', ...(n.email ? { replyto: n.email } : {}), ...Object.fromEntries(lines.map(([label, value]) => [label, String(value)])) };
    return { init: { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) } };
  }
  if (provider === 'google') {
    // Apps Script web app. A form-encoded body is a "simple" request (no CORS preflight) and works with
    // FORM_SETUP.md's script (reads `payload`) as well as common sheet templates that read e.parameter[label].
    const body = new URLSearchParams();
    body.set('payload', JSON.stringify({ subject, rows: lines, data: n, key }));
    body.set('subject', subject);
    body.set('key', key);
    for (const [label, value] of lines) body.set(label, String(value));
    // Code-named copies for sheet templates whose header row uses English names (name, email, message …).
    for (const [field, value] of Object.entries(n)) {
      if (value === null || value === '' || value === false || (Array.isArray(value) && !value.length) || body.has(field)) continue;
      body.set(field, Array.isArray(value) ? value.join(', ') : String(value));
    }
    return { init: { method: 'POST', body } };
  }
  return null;
}

function confirmed(provider, status, data, raw = '') {
  if (provider === 'api') {
    const receipt = data?.inquiryId ?? data?.id;
    if (status !== 201) return null;
    if ((typeof receipt === 'string' && receipt.trim()) || (typeof receipt === 'number' && Number.isSafeInteger(receipt) && receipt > 0)) return String(receipt);
    return null;
  }
  if (status < 200 || status > 299) return null;
  if (provider === 'formspree') return data && data.ok !== false && !data.errors ? '' : null;
  if (provider === 'web3forms') return data?.success === true ? '' : null;
  if (provider === 'google') {
    // Only a ContentService reply from doPost is readable cross-origin, so a 2xx body here comes from the script itself.
    if (data && typeof data === 'object') {
      if (data.ok === false || data.success === false || data.result === 'error' || data.status === 'error' || data.error) return null;
      if (data.ok === true || data.success === true || data.result === 'success' || data.status === 'success') return String(data.id ?? data.row ?? '');
      return null;
    }
    return /^\s*(ok|success|성공|완료|접수)/i.test(raw) ? '' : null;
  }
  return null;
}

/**
 * Sends one inquiry. Only a response the receiving service confirms counts as success.
 * provider: 'api' (own server, 201 + inquiryId), 'formspree', 'web3forms' or 'google' (Apps Script).
 * The caller keeps the returned idempotencyKey for retries of the same inquiry.
 */
export async function submitInquiry(payload, { provider = 'api', endpoint, fetchImpl = globalThis.fetch, idempotencyKey, today, files = [], accessKey = null, sourcePath } = {}) {
  if (!text(endpoint)) return outcome('unavailable', '문의 접수 연동 준비 중', { idempotencyKey: idempotencyKey ?? null });
  const fieldErrors = validateInquiry(payload, today ? { today } : {});
  if (Object.keys(fieldErrors).length) return outcome('validation', '입력 내용을 확인해 주세요.', { fieldErrors, idempotencyKey: idempotencyKey ?? null });
  const key = idempotencyKey ?? globalThis.crypto?.randomUUID?.();
  const request = typeof key === 'string' && /^[A-Za-z0-9._:-]{1,200}$/.test(key) ? buildRequest(provider, payload, key, { files, accessKey, sourcePath }) : null;
  if (typeof fetchImpl !== 'function' || !request || (provider === 'web3forms' && !text(accessKey))) return outcome('configuration', '문의 전송 설정을 확인해 주세요.', { idempotencyKey: key ?? null });
  const requestId = `${provider}\n${endpoint}\n${key}`;
  if (inFlight.has(requestId)) return inFlight.get(requestId);
  const submission = (async () => {
    let response;
    try {
      response = await fetchImpl(endpoint, request.init);
    } catch {
      return outcome('network', '접수 여부를 확인하지 못했습니다. 잠시 후 다시 확인해 주세요.', { idempotencyKey: key });
    }
    const status = response.status;
    let raw = '', data = null;
    try { raw = await response.text(); } catch { /* unreadable body */ }
    try { data = JSON.parse(raw); } catch { /* A malformed response never confirms a receipt (except a plain 'ok' from Apps Script). */ }
    const shared = { status, idempotencyKey: key };
    const receipt = confirmed(provider, status, data, raw.slice(0, 200));
    if (receipt !== null) return outcome('success', '문의가 접수되었습니다.', { ...shared, inquiryId: receipt || null });
    if (status === 400 || status === 422) {
      const errors = responseErrors(data);
      const note = serviceMessage(data);
      return outcome('validation', note ? `입력 내용을 확인해 주세요. (${note})` : '입력 내용을 확인해 주세요.', { ...shared, fieldErrors: errors });
    }
    if (status === 429) return outcome('rate_limit', '요청이 많습니다. 잠시 뒤 다시 시도해 주세요.', shared);
    if (status >= 500) return outcome('server', '접수 처리에 문제가 발생했습니다. 입력 내용을 유지한 채 잠시 뒤 다시 시도해 주세요.', shared);
    return outcome('unconfirmed', '접수 여부를 확인하지 못했습니다. 잠시 후 다시 확인해 주세요.', shared);
  })();
  inFlight.set(requestId, submission);
  try { return await submission; } finally { inFlight.delete(requestId); }
}
