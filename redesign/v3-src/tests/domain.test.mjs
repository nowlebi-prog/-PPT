import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import * as domain from '../src/domain.mjs';

const validInquiry = {
  name: '홍길동', contactMethod: 'email', contactValue: 'hello@example.com',
  message: '발표자료 제작 범위와 일정을 상담하고 싶습니다.',
  serviceId: 'ppt-b', optionIds: [], organization: '', eventDate: null,
  teamCount: null, pageCount: 5, privacyConsent: true, portfolioConsent: false,
  sourcePath: '/contact',
};

test('approved B charges setup and all five delivered slides', () => {
  const result = domain.calculatePpt({ id: 'ppt-b', status: 'approved', unitPrice: 20000, setupFee: 100000, minPages: 5 }, 5);
  assert.equal(result.amount, 200000);
  assert.equal(result.reason, '');
});

test('B below five slides is refused rather than charging a minimum', () => {
  const result = domain.calculatePpt({ id: 'ppt-b', status: 'approved', unitPrice: 20000, setupFee: 100000, minPages: 5 }, 4);
  assert.equal(result.amount, null);
  assert.match(result.reason, /5장/);
});

test('draft pricing and unknown page counts never become a published total', () => {
  const approved = { id: 'ppt-a', status: 'approved', unitPrice: 20000, setupFee: 0, minPages: null };
  assert.equal(domain.calculatePpt(approved, 8).amount, 160000);
  assert.equal(domain.calculatePpt({ ...approved, id: 'ppt-c', status: 'draft', unitPrice: 30000 }, 10).amount, null);
  for (const pages of [null, undefined, 0, -1, 1.2, '5', Infinity, NaN]) {
    assert.equal(domain.calculatePpt(approved, pages).amount, null);
  }
  assert.equal(domain.calculatePpt({ ...approved, unitPrice: -1 }, 8).amount, null);
});

test('demoday calculates each team separately without pooling unused pages', () => {
  assert.deepEqual(domain.calculateDemoday([18, 24]), { amount: 1100000, estimated: false });
  assert.deepEqual(domain.calculateDemoday([null, 24]), { amount: 1100000, estimated: true });
  assert.deepEqual(domain.calculateDemoday([null, null]), { amount: 1000000, estimated: true });
});

test('demoday rejects missing teams and invalid integer page counts', () => {
  for (const pages of [null, [], [0], [-1], [1.2], ['20'], [undefined], [NaN], [Infinity]]) {
    assert.throws(() => domain.calculateDemoday(pages), RangeError);
  }
});

test('query selection carries allowed scope only and preserves unknown counts', () => {
  assert.deepEqual(domain.parseSelection('?service=demoday&option=web-register&option=interview&teamCount=3&pageCount=24&name=Private&contactValue=private@example.com&message=secret'), {
    service: 'demoday', optionIds: ['web-register', 'interview'], teamCount: 3, pageCount: 24,
  });
  assert.deepEqual(domain.parseSelection('?service=javascript:alert(1)&option=unknown&teamCount=0&pageCount=1.2'), {
    service: null, optionIds: [], teamCount: null, pageCount: null,
  });
  assert.deepEqual(domain.parseSelection(''), { service: null, optionIds: [], teamCount: null, pageCount: null });
});

test('query rejects numeric tricks and keeps only one website tier', () => {
  const selection = domain.parseSelection('?service=ppt-b&option=web-info,web-archive,interview,interview&teamCount=1e2&pageCount=9007199254740992');
  assert.deepEqual(selection, { service: 'ppt-b', optionIds: ['web-info', 'interview'], teamCount: null, pageCount: null });
});

test('extended production can be selected and submitted without extra query fields', () => {
  assert.deepEqual(domain.parseSelection('?service=extended&option=interview&communication=private&filmingPlace=private&videoCount=3&filmingNotes=private'), {
    service: 'extended', optionIds: ['interview'], teamCount: null, pageCount: null,
  });
  assert.deepEqual(domain.validateInquiry({ ...validInquiry, serviceId: 'extended' }), {});
});

test('inquiry validates mandatory fields, consent, and field-specific formats', () => {
  assert.deepEqual(domain.validateInquiry(validInquiry), {});
  const errors = domain.validateInquiry({ ...validInquiry, name: ' ', contactValue: 'invalid', message: '짧음', privacyConsent: false, organization: 'a'.repeat(101), teamCount: 0, pageCount: 1.5, eventDate: '2026-02-30' });
  for (const field of ['name', 'contactValue', 'message', 'privacyConsent', 'organization', 'teamCount', 'pageCount', 'eventDate']) assert.ok(errors[field], field);
  assert.deepEqual(domain.validateInquiry({ ...validInquiry, contactMethod: 'phone', contactValue: '010-1234-5678', eventDate: '', pageCount: null }), {});
  assert.ok(domain.validateInquiry({ ...validInquiry, contactMethod: 'sms' }).contactMethod);
  assert.ok(domain.validateInquiry({ ...validInquiry, contactMethod: 'phone', contactValue: 'call me 01012345678' }).contactValue);
  assert.ok(domain.validateInquiry({ ...validInquiry, optionIds: ['web-info', 'web-register'] }).optionIds);
});

test('no endpoint returns unavailable and makes no transport request', async () => {
  const result = await domain.submitInquiry(validInquiry, { endpoint: null, fetchImpl: () => { throw new Error('Must not request'); }, idempotencyKey: 'test-unconnected' });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'unavailable');
});

test('local field errors stop transport without losing the submitted values', async () => {
  const payload = { ...validInquiry, name: '' };
  const result = await domain.submitInquiry(payload, { endpoint: '/api/inquiries', fetchImpl: () => { throw new Error('Must not request'); }, idempotencyKey: 'test-validation' });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'validation');
  assert.ok(result.fieldErrors.name);
  assert.equal(payload.message, validInquiry.message);
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
  const result = await domain.submitInquiry({ ...validInquiry, name: ' 홍길동 ', sourcePath: '/contact?name=Private', unexpectedSecret: 'must not send' }, { endpoint, fetchImpl: fetch, idempotencyKey: 'test-201' });
  assert.equal(result.ok, true, JSON.stringify(result));
  assert.equal(result.status, 201);
  assert.equal(result.inquiryId, 'INQ-2026-001');
  assert.equal(result.idempotencyKey, 'test-201');
  assert.equal(received[0].method, 'POST');
  assert.equal(received[0].headers['idempotency-key'], 'test-201');
  assert.equal(received[0].body.idempotencyKey, 'test-201');
  assert.equal(received[0].body.name, '홍길동');
  assert.equal(received[0].body.sourcePath, '/contact');
  assert.equal(received[0].body.portfolioConsent, false);
  assert.equal(Object.hasOwn(received[0].body, 'unexpectedSecret'), false);
});

test('server field, rate-limit, and failure responses are distinct and never succeed', async () => {
  for (const [status, data, code] of [
    [422, { fieldErrors: { contactValue: '연락처를 확인해 주세요.' } }, 'validation'],
    [400, { errors: { name: '이름을 확인해 주세요.' } }, 'validation'],
    [429, { message: 'rate limited' }, 'rate_limit'],
    [500, { message: 'server failed' }, 'server'],
    [200, { inquiryId: 'not-confirmed' }, 'unconfirmed'],
    [201, {}, 'unconfirmed'],
  ]) {
    const result = await domain.submitInquiry(validInquiry, { endpoint: '/api/inquiries', fetchImpl: async () => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }), idempotencyKey: `test-status-${status}` });
    assert.equal(result.ok, false, String(status));
    assert.equal(result.status, status);
    assert.equal(result.code, code);
    if (status === 422) assert.equal(result.fieldErrors.contactValue, '연락처를 확인해 주세요.');
    if (status === 400) assert.equal(result.fieldErrors.name, '이름을 확인해 주세요.');
  }
});

test('network failure keeps an explicit unknown receipt state and reusable key', async () => {
  const result = await domain.submitInquiry(validInquiry, { endpoint: '/api/inquiries', fetchImpl: async () => { throw new TypeError('Failed to fetch'); }, idempotencyKey: 'retry-same-key' });
  assert.equal(result.ok, false);
  assert.equal(result.code, 'network');
  assert.match(result.message, /접수 여부를 확인하지 못했습니다/);
  assert.equal(result.idempotencyKey, 'retry-same-key');
});

test('concurrent submission with the same key has one transport attempt', async () => {
  let release;
  let requests = 0;
  const response = new Promise(resolve => { release = resolve; });
  const options = { endpoint: '/api/inquiries', idempotencyKey: 'duplicate-key', fetchImpl: () => { requests++; return response; } };
  const first = domain.submitInquiry(validInquiry, options);
  const second = domain.submitInquiry(validInquiry, options);
  release(new Response(JSON.stringify({ inquiryId: 'ONE-RECEIPT' }), { status: 201 }));
  const results = await Promise.all([first, second]);
  assert.equal(requests, 1);
  assert.equal(results[0].inquiryId, 'ONE-RECEIPT');
  assert.equal(results[1].inquiryId, 'ONE-RECEIPT');
});
