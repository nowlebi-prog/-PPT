import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import * as domain from '../src/domain.mjs';

const today = '2026-10-28';
const validInquiry = {
  kind: 'company', purpose: 'ir', service: 'ppt-b', dueDate: '2026-11-20', dueUndecided: false,
  name: '홍길동', organization: '', contactMethod: 'email', email: 'hello@example.com', phone: '',
  pages: '11–20장', attachmentLink: '', extras: [], webTier: '', budget: '', message: '발표자료 제작 범위와 일정을 상담하고 싶습니다.',
  privacyConsent: true, portfolioConsent: false,
};
// Fixture prices are arbitrary test values, not the studio's price list.
const fixture = { id: 'ppt-b', status: 'approved', unitPrice: 11000, setupFee: 7000, minPages: 5 };

test('approved tier charges setup and every delivered slide', () => {
  const result = domain.calculatePpt(fixture, 5);
  assert.equal(result.amount, 62000);
  assert.equal(result.reason, '');
});

test('below the minimum is refused rather than charging a minimum', () => {
  const result = domain.calculatePpt(fixture, 4);
  assert.equal(result.amount, null);
  assert.match(result.reason, /5장/);
});

test('draft pricing and unknown page counts never become a published total', () => {
  const approved = { id: 'ppt-a', status: 'approved', unitPrice: 9000, setupFee: 0, minPages: null };
  assert.equal(domain.calculatePpt(approved, 8).amount, 72000);
  assert.equal(domain.calculatePpt({ ...approved, id: 'ppt-c', status: 'draft' }, 10).amount, null);
  for (const pages of [null, undefined, 0, -1, 1.2, '5', Infinity, NaN]) {
    assert.equal(domain.calculatePpt(approved, pages).amount, null);
  }
  assert.equal(domain.calculatePpt({ ...approved, unitPrice: -1 }, 8).amount, null);
});

test('demoday calculates each team separately without pooling unused pages', () => {
  const price = { perTeam: 100, pagesIncluded: 20, extraPerPage: 10 };
  assert.deepEqual(domain.calculateDemoday([18, 24], price), { amount: 240, estimated: false });
  assert.deepEqual(domain.calculateDemoday([null, 24], price), { amount: 240, estimated: true });
  assert.deepEqual(domain.calculateDemoday([null, null], price), { amount: 200, estimated: true });
});

test('demoday rejects missing teams and invalid integer page counts', () => {
  for (const pages of [null, [], [0], [-1], [1.2], ['20'], [undefined], [NaN], [Infinity]]) {
    assert.throws(() => domain.calculateDemoday(pages), RangeError);
  }
});

test('query selection carries allowed scope only and preserves unknown counts', () => {
  assert.deepEqual(domain.parseSelection('?service=demoday&option=web-register&option=interview&teamCount=3&pageCount=24&name=Private&email=private@example.com&message=secret'), {
    service: null, kind: 'institution', purpose: null, due: null, optionIds: ['web-register', 'interview'], teamCount: 3, pageCount: 24,
  });
  assert.deepEqual(domain.parseSelection('?service=javascript:alert(1)&option=unknown&teamCount=0&pageCount=1.2&due=2026-02-30&kind=x&purpose=y'), {
    service: null, kind: null, purpose: null, due: null, optionIds: [], teamCount: null, pageCount: null,
  });
  assert.deepEqual(domain.parseSelection('?service=ppt-a&kind=company&purpose=gov&due=undecided'), {
    service: 'ppt-a', kind: 'company', purpose: 'gov', due: 'undecided', optionIds: [], teamCount: null, pageCount: null,
  });
});

test('query rejects numeric tricks and keeps only one website tier', () => {
  const selection = domain.parseSelection('?service=ppt-b&option=web-info,web-archive,interview,interview,none,web-event&teamCount=1e2&pageCount=9007199254740992');
  assert.deepEqual(selection.optionIds, ['web-info', 'interview']);
  assert.equal(selection.teamCount, null);
  assert.equal(selection.pageCount, null);
});

test('institution inquiries need an organisation and a team count (or 미정)', () => {
  const inst = { ...validInquiry, kind: 'institution', pages: '팀당 20장 이내' };
  const errors = domain.validateInquiry(inst, { today });
  assert.ok(errors.organization);
  assert.ok(errors.teamCount);
  assert.deepEqual(domain.validateInquiry({ ...inst, organization: '창업지원센터', teamCountUndecided: true, exchange: 'collect' }, { today }), {});
  assert.ok(domain.validateInquiry({ ...inst, organization: '창업지원센터', teamCount: '6', pages: '11–20장' }, { today }).pages);
});

test('inquiry validates mandatory fields, consent, and field-specific formats', () => {
  assert.deepEqual(domain.validateInquiry(validInquiry, { today }), {});
  assert.deepEqual(domain.validateInquiry({ ...validInquiry, dueDate: '', dueUndecided: true, message: '', pages: '' }, { today }), {});
  const errors = domain.validateInquiry({ ...validInquiry, kind: '', purpose: 'other', service: 'x', name: ' ', email: 'invalid', privacyConsent: false, organization: 'a'.repeat(101), dueDate: '2026-02-30', attachmentLink: 'drive.google.com/x' }, { today });
  for (const field of ['kind', 'purposeOther', 'service', 'name', 'email', 'privacyConsent', 'organization', 'dueDate', 'attachmentLink']) assert.ok(errors[field], field);
  assert.ok(domain.validateInquiry({ ...validInquiry, dueDate: '2026-10-01' }, { today }).dueDate);
  assert.deepEqual(domain.validateInquiry({ ...validInquiry, contactMethod: 'phone', email: '', phone: '010-1234-5678' }, { today }), {});
  assert.ok(domain.validateInquiry({ ...validInquiry, contactMethod: 'phone', phone: '' }, { today }).phone);
  assert.ok(domain.validateInquiry({ ...validInquiry, contactMethod: 'sms' }, { today }).contactMethod);
  assert.ok(domain.validateInquiry({ ...validInquiry, extras: ['none', 'print'] }, { today }).extras);
  assert.ok(domain.validateInquiry({ ...validInquiry, extras: ['web-event'] }, { today }).webTier);
  assert.deepEqual(domain.validateInquiry({ ...validInquiry, extras: ['web-event', 'interview'], webTier: 'web-archive', videoCount: '2' }, { today }), {});
});

test('summary and mail fallback list readable labels, never a receipt', () => {
  const text = domain.inquiryText({ ...validInquiry, extras: ['web-event'], webTier: 'web-register' });
  assert.match(text, /의뢰 구분: 우리 회사 자료/);
  assert.match(text, /자료 상태: 내용은 정해졌고 디자인이 필요해요/);
  assert.match(text, /함께 필요한 것: 행사 홈페이지 \(참가 신청 페이지\)/);
  const href = domain.mailtoHref(validInquiry, 'contact@example.com');
  assert.ok(href.startsWith('mailto:contact@example.com?subject='));
  assert.match(decodeURIComponent(href), /\[유별난PPT 견적 문의\] 홍길동/);
});

test('no endpoint returns unavailable and makes no transport request', async () => {
  const result = await domain.submitInquiry(validInquiry, { endpoint: null, fetchImpl: () => { throw new Error('Must not request'); }, idempotencyKey: 'test-unconnected', today });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'unavailable');
});

test('real local transport sends an allowlisted body and idempotency key; only 201 confirms storage', async (t) => {
  const received = [];
  const server = createServer(async (request, response) => {
    let body = '';
    for await (const chunk of request) body += chunk;
    received.push({ method: request.method, headers: request.headers, body: JSON.parse(body) });
    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ inquiryId: 'INQ-2026-001' }));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  const endpoint = `http://127.0.0.1:${server.address().port}/api/inquiries`;
  const result = await domain.submitInquiry({ ...validInquiry, name: ' 홍길동 ', unexpectedSecret: 'must not send', eventName: 'not for company' }, { provider: 'api', endpoint, fetchImpl: fetch, idempotencyKey: 'test-201', today, sourcePath: '/contact?name=Private' });
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.status, 201);
  assert.equal(result.inquiryId, 'INQ-2026-001');
  assert.equal(received[0].method, 'POST');
  assert.equal(received[0].headers['idempotency-key'], 'test-201');
  assert.equal(received[0].body.idempotencyKey, 'test-201');
  assert.equal(received[0].body.name, '홍길동');
  assert.equal(received[0].body.sourcePath, '/contact');
  assert.equal(received[0].body.eventName, '');
  assert.equal(Object.hasOwn(received[0].body, 'unexpectedSecret'), false);
});

test('form services confirm only on their own success signal', async () => {
  const reply = (status, data) => async () => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
  let sent;
  const formspree = await domain.submitInquiry(validInquiry, { provider: 'formspree', endpoint: 'https://formspree.io/f/test', fetchImpl: async (url, init) => { sent = init; return new Response(JSON.stringify({ ok: true }), { status: 200 }); }, idempotencyKey: 'fs-ok', today });
  assert.equal(formspree.ok, true);
  assert.equal(sent.headers.Accept, 'application/json');
  assert.equal(sent.body.get('email'), 'hello@example.com');
  assert.match(sent.body.get('_subject'), /견적 문의/);
  assert.equal((await domain.submitInquiry(validInquiry, { provider: 'formspree', endpoint: 'https://formspree.io/f/test', fetchImpl: reply(422, { errors: [{ message: 'bad email' }] }), idempotencyKey: 'fs-422', today })).code, 'validation');
  assert.equal((await domain.submitInquiry(validInquiry, { provider: 'web3forms', endpoint: 'https://api.web3forms.com/submit', accessKey: 'k', fetchImpl: reply(200, { success: true }), idempotencyKey: 'w3-ok', today })).ok, true);
  assert.equal((await domain.submitInquiry(validInquiry, { provider: 'web3forms', endpoint: 'https://api.web3forms.com/submit', accessKey: 'k', fetchImpl: reply(200, { success: false }), idempotencyKey: 'w3-no', today })).ok, false);
  assert.equal((await domain.submitInquiry(validInquiry, { provider: 'web3forms', endpoint: 'https://api.web3forms.com/submit', fetchImpl: reply(200, { success: true }), idempotencyKey: 'w3-key', today })).code, 'configuration');
  assert.equal((await domain.submitInquiry(validInquiry, { provider: 'google', endpoint: 'https://script.google.com/macros/s/x/exec', fetchImpl: reply(200, { ok: true, id: 12 }), idempotencyKey: 'gs-ok', today })).inquiryId, '12');
  assert.equal((await domain.submitInquiry(validInquiry, { provider: 'google', endpoint: 'https://script.google.com/macros/s/x/exec', fetchImpl: reply(200, { ok: false }), idempotencyKey: 'gs-no', today })).ok, false);
});

test('server field, rate-limit, and failure responses are distinct and never succeed', async () => {
  for (const [status, data, code] of [
    [422, { fieldErrors: { email: '연락처를 확인해 주세요.' } }, 'validation'],
    [400, { errors: { name: '이름을 확인해 주세요.' } }, 'validation'],
    [429, { message: 'rate limited' }, 'rate_limit'],
    [500, { message: 'server failed' }, 'server'],
    [200, { inquiryId: 'not-confirmed' }, 'unconfirmed'],
    [201, {}, 'unconfirmed'],
  ]) {
    const result = await domain.submitInquiry(validInquiry, { provider: 'api', endpoint: '/api/inquiries', fetchImpl: async () => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }), idempotencyKey: `test-status-${status}`, today });
    assert.equal(result.ok, false, String(status));
    assert.equal(result.status, status);
    assert.equal(result.code, code);
    if (status === 422) assert.equal(result.fieldErrors.email, '연락처를 확인해 주세요.');
    if (status === 400) assert.equal(result.fieldErrors.name, '이름을 확인해 주세요.');
  }
});

test('network failure keeps an explicit unknown receipt state; same-key submissions share one request', async () => {
  const result = await domain.submitInquiry(validInquiry, { endpoint: '/api/inquiries', fetchImpl: async () => { throw new TypeError('Failed to fetch'); }, idempotencyKey: 'retry-same-key', today });
  assert.equal(result.code, 'network');
  assert.match(result.message, /접수 여부를 확인하지 못했습니다/);
  assert.equal(result.idempotencyKey, 'retry-same-key');
  let release, requests = 0;
  const response = new Promise(resolve => { release = resolve; });
  const options = { endpoint: '/api/inquiries', idempotencyKey: 'duplicate-key', today, fetchImpl: () => { requests++; return response; } };
  const first = domain.submitInquiry(validInquiry, options);
  const second = domain.submitInquiry(validInquiry, options);
  release(new Response(JSON.stringify({ inquiryId: 'ONE-RECEIPT' }), { status: 201 }));
  const results = await Promise.all([first, second]);
  assert.equal(requests, 1);
  assert.equal(results[1].inquiryId, 'ONE-RECEIPT');
});
