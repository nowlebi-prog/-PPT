import { pricing, websiteOptions } from './data.mjs';

const serviceIds = new Set([...pricing.map(item => item.id), 'demoday', 'extended']);
const websiteIds = new Set(websiteOptions.map(item => item.id));
const optionIds = new Set([...websiteIds, 'interview']);
const inquiryFields = new Set(['name', 'contactMethod', 'contactValue', 'message', 'serviceId', 'optionIds', 'organization', 'eventDate', 'teamCount', 'pageCount', 'privacyConsent', 'portfolioConsent']);
const inFlight = new Map();
const isPositiveInteger = value => Number.isSafeInteger(value) && value > 0;
const isMoney = value => Number.isSafeInteger(value) && value >= 0;
const text = value => typeof value === 'string' ? value.trim() : '';
const isUnknown = value => value === null || value === undefined || value === '';

function optionalInteger(value) {
  if (isPositiveInteger(value)) return value;
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;
  const integer = Number(value);
  return isPositiveInteger(integer) ? integer : null;
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
export function calculateDemoday(pagesArray) {
  if (!Array.isArray(pagesArray) || !pagesArray.length) throw new RangeError('팀 수는 1 이상의 정수여야 합니다.');
  let amount = 0;
  let estimated = false;
  for (const pages of pagesArray) {
    if (pages !== null && !isPositiveInteger(pages)) throw new RangeError('팀별 장수는 양의 정수 또는 null이어야 합니다.');
    estimated ||= pages === null;
    amount += 500000 + (pages === null ? 0 : Math.max(0, pages - 20) * 25000);
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
    if (!optionIds.has(id) || selected.includes(id)) continue;
    if (websiteIds.has(id)) {
      if (hasWebsite) continue;
      hasWebsite = true;
    }
    selected.push(id);
  }
  return {
    service: serviceIds.has(service) ? service : null,
    optionIds: selected,
    teamCount: optionalInteger(query.get('teamCount')),
    pageCount: optionalInteger(query.get('pageCount')),
  };
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

/** Client validation is repeated by the receiving server before storage. */
export function validateInquiry(payload = {}) {
  const input = payload && typeof payload === 'object' ? payload : {};
  const errors = {};
  const name = text(input.name);
  const contact = text(input.contactValue);
  const message = text(input.message);
  if (!name || name.length > 50) errors.name = '이름을 1~50자로 입력해 주세요.';
  if (!['email', 'phone'].includes(input.contactMethod)) errors.contactMethod = '이메일 또는 전화를 선택해 주세요.';
  if (input.contactMethod === 'email') {
    if (contact.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) errors.contactValue = '이메일 주소를 확인해 주세요.';
  } else if (input.contactMethod === 'phone') {
    const digits = contact.replace(/\D/g, '');
    if (!/^\+?[\d\s()-]+$/.test(contact) || digits.length < 7 || digits.length > 15 || contact.length > 30) errors.contactValue = '전화번호를 확인해 주세요.';
  } else if (!contact) errors.contactValue = '연락처를 입력해 주세요.';
  if (message.length < 10 || message.length > 5000) errors.message = '문의 내용을 10~5000자로 입력해 주세요.';
  if (input.privacyConsent !== true) errors.privacyConsent = '개인정보 수집·이용에 동의해 주세요.';
  if (!isUnknown(input.organization) && (typeof input.organization !== 'string' || text(input.organization).length > 100)) errors.organization = '회사·기관명을 100자 이내로 입력해 주세요.';
  if (!isUnknown(input.eventDate) && (typeof input.eventDate !== 'string' || !validDate(input.eventDate))) errors.eventDate = '날짜를 확인하거나 미정으로 남겨 주세요.';
  for (const field of ['teamCount', 'pageCount']) {
    if (!isUnknown(input[field]) && optionalInteger(input[field]) === null) errors[field] = `${field === 'teamCount' ? '팀 수' : '장수'}는 양의 정수로 입력하거나 미정으로 남겨 주세요.`;
  }
  if (!isUnknown(input.serviceId) && !serviceIds.has(input.serviceId)) errors.serviceId = '서비스를 다시 선택해 주세요.';
  if (input.optionIds !== undefined && (!Array.isArray(input.optionIds) || input.optionIds.some(id => !optionIds.has(id)) || new Set(input.optionIds.filter(id => websiteIds.has(id))).size > 1)) errors.optionIds = '홈페이지 상품은 하나만 선택하고 옵션을 확인해 주세요.';
  if (input.portfolioConsent !== undefined && typeof input.portfolioConsent !== 'boolean') errors.portfolioConsent = '포트폴리오 활용 동의 여부를 확인해 주세요.';
  return errors;
}

function outcome(code, message, { status = 0, fieldErrors = {}, inquiryId = null, idempotencyKey = null } = {}) {
  return { ok: code === 'success', code, message, status, fieldErrors, inquiryId, idempotencyKey };
}

function safeSourcePath(value) {
  const path = text(value).split(/[?#]/, 1)[0];
  return /^\/(?!\/)/.test(path) && path.length <= 500 ? path : '/contact';
}

function requestBody(input, idempotencyKey) {
  // Optional institution/filming details are merged into message by ContactForm.
  // Keep the transport contract restricted to the API's agreed fields.
  return {
    name: text(input.name), contactMethod: input.contactMethod, contactValue: text(input.contactValue),
    message: text(input.message), serviceId: serviceIds.has(input.serviceId) ? input.serviceId : null,
    optionIds: [...new Set(input.optionIds ?? [])], organization: text(input.organization),
    eventDate: input.eventDate || null, teamCount: optionalInteger(input.teamCount), pageCount: optionalInteger(input.pageCount),
    privacyConsent: input.privacyConsent === true, portfolioConsent: input.portfolioConsent === true,
    sourcePath: safeSourcePath(input.sourcePath), idempotencyKey,
  };
}

function responseErrors(data) {
  const raw = data?.fieldErrors ?? data?.errors;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return Object.fromEntries(Object.entries(raw).filter(([field, message]) => inquiryFields.has(field) && typeof message === 'string').map(([field, message]) => [field, message.slice(0, 500)]));
}

/**
 * All outcomes are normalized; a 201 response must include inquiryId (or id).
 * The caller retains the returned idempotencyKey for retries of the same inquiry.
 * No endpoint means no request and no successful receipt.
 */
export async function submitInquiry(payload, { endpoint, fetchImpl = globalThis.fetch, idempotencyKey } = {}) {
  if (!text(endpoint)) return outcome('unavailable', '문의 접수 연동 준비 중', { idempotencyKey: idempotencyKey ?? null });
  const fieldErrors = validateInquiry(payload);
  if (Object.keys(fieldErrors).length) return outcome('validation', '입력 내용을 확인해 주세요.', { fieldErrors, idempotencyKey: idempotencyKey ?? null });
  const key = idempotencyKey ?? globalThis.crypto?.randomUUID?.();
  if (typeof fetchImpl !== 'function' || typeof key !== 'string' || !/^[A-Za-z0-9._:-]{1,200}$/.test(key)) return outcome('configuration', '문의 전송 설정을 확인해 주세요.', { idempotencyKey: key ?? null });
  const requestId = `${endpoint}\n${key}`;
  if (inFlight.has(requestId)) return inFlight.get(requestId);
  const submission = (async () => {
    let response;
    try {
      response = await fetchImpl(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key }, body: JSON.stringify(requestBody(payload, key)) });
    } catch {
      return outcome('network', '접수 여부를 확인하지 못했습니다. 잠시 후 다시 확인해 주세요.', { idempotencyKey: key });
    }
    const status = response.status;
    let data = null;
    try { data = await response.json(); } catch { /* A malformed response never confirms a receipt. */ }
    const shared = { status, idempotencyKey: key };
    if (status === 201) {
      const receipt = data?.inquiryId ?? data?.id;
      if ((typeof receipt === 'string' && receipt.trim()) || (typeof receipt === 'number' && Number.isSafeInteger(receipt) && receipt > 0)) return outcome('success', '문의가 접수되었습니다.', { ...shared, inquiryId: String(receipt) });
    }
    if (status === 400 || status === 422) return outcome('validation', '입력 내용을 확인해 주세요.', { ...shared, fieldErrors: responseErrors(data) });
    if (status === 429) return outcome('rate_limit', '요청이 많습니다. 잠시 뒤 다시 시도해 주세요.', shared);
    if (status >= 500) return outcome('server', '접수 처리에 문제가 발생했습니다. 입력 내용을 유지한 채 잠시 뒤 다시 시도해 주세요.', shared);
    return outcome('unconfirmed', '접수 여부를 확인하지 못했습니다. 잠시 후 다시 확인해 주세요.', shared);
  })();
  inFlight.set(requestId, submission);
  try { return await submission; } finally { inFlight.delete(requestId); }
}
