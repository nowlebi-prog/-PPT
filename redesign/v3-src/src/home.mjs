// Home: 9 sections. Hero, statement band, clients and the demo day card follow the original v3 (owner request 2026-10-28); other copy follows 문구 교체안. Concept objects are decorative, not client evidence.
import { site, pricing, pricingNotes, pricingRows, faq, proofStats, demodayHistory, demodayTeamsApproved, demodayPrice, irConsulting, partnerLogos, reviews, websiteOptions, eventPageCommon, beyondItems, featuredWork } from './data.mjs';
import { portfolio } from './portfolio.mjs';
import { esc, arrow, ext, ck, title, eyebrow } from './ui.mjs';
import { contactSection } from './contact.mjs';

const obj = (name, base, cls = '', eager = false) => `<img class="obj ${cls}" src="${base}assets/concepts/${name}.webp" alt="" width="1200" height="800" decoding="async" loading="${eager ? 'eager' : 'lazy'}"${eager ? ' fetchpriority="high"' : ''}>`;
const typeNames = { ir: 'IR과 발표자료', company: '회사소개와 제안서', print: '인쇄와 편집' };
const won = n => n.toLocaleString('ko-KR') + '원';

/* 1 — hero: restored to the earlier v3 hero on request (2026-10-28) — rotating first line, giant wordmark, deck object */
const rot = ['같은 초안도,', '급한 IR도,', '줄글 메모도,', 'AI로 뽑은 장표도,'];
function hero(base) {
  return `<section id="hero" class="h-hero" data-header="dark">
 <div class="h-hero__grid">
  <div class="h-hero__left">
   <h1 class="h-title" aria-label="같은 초안도, 유별나게.">
    <span class="h-title__rot" aria-hidden="true"><span class="h-rot" data-rot>${rot.map((t, i) => `<b${i === 0 ? ' class="is-on"' : ''}>${t}</b>`).join('')}</span></span>
    <span class="h-title__big" aria-hidden="true">${[...'유별나게'].map((c, i) => `<b style="--i:${i}">${c}</b>`).join('')}<b class="dot" style="--i:4">.</b></span>
   </h1>
   <p class="h-hero__sub" data-intro>기획자의 시선과 디자이너의 손으로,<br>발표에 필요한 흐름과 디자인을 완성합니다.</p>
  </div>
  <div class="h-hero__right">
   <div class="h-hero__obj">${obj('deck', base, '', true)}</div>
   <div class="h-hero__cta" data-intro><a class="h-pill h-pill--blue" href="#contact">내 자료로 견적 상담 ${arrow}</a><a class="h-link h-link--light" href="#portfolio">작업 먼저 보기 ${arrow}</a></div>
  </div>
 </div>
</section>`;
}

/* 2 — statement band (original v3): one sentence with the print object woven in; slides up over the hero */
function statement(base) {
  return `<section id="collage" class="h-collage" data-header="light">
 <div class="h-collage__copy">
  <h2 class="h-sent" aria-label="좋은 아이템이, 자료 때문에 작아 보이지 않게." data-reveal>
   <span class="ln" aria-hidden="true"><span class="w em">좋은</span> <span class="w em">아이템이,</span></span>
   <span class="ln" aria-hidden="true"><span class="w">자료</span> <span class="h-sent__obj">${obj('print', base)}</span> <span class="w">때문에</span></span>
   <span class="ln" aria-hidden="true"><span class="w em">작아 보이지</span> <span class="w em">않게.</span></span>
  </h2>
  <p data-reveal>디자인을 시작하기 전,<br>전달할 내용과 읽히는 순서부터 살핍니다.</p>
 </div>
</section>`;
}

/* 3 — clients (original v3 layout): two logo rows drifting in opposite directions; figures only once approved */
function logoRows(base) {
  const half = Math.ceil(partnerLogos.length / 2);
  return [partnerLogos.slice(0, half), partnerLogos.slice(half)].map((list, i) => {
    const imgs = hidden => list.map(l => `<img src="${base + l.src}" ${hidden ? 'aria-hidden="true" alt=""' : `alt="${esc(l.name)}"`} loading="lazy" decoding="async">`).join('');
    return `<div class="h-lrow${i ? ' is-rev' : ''}"><div class="h-lrow__track">${imgs(false)}${imgs(true)}</div></div>`;
  }).join('');
}
function clients(base) {
  const stats = proofStats.approved && proofStats.asOf && proofStats.source && proofStats.items.length
    ? `<div class="h-cl__stats"><ul>${proofStats.items.map(s => `<li><b>${esc(s.value)}${esc(s.unit || '')}</b><span>${esc(s.label)}</span></li>`).join('')}</ul><p>${esc(proofStats.asOf)} 기준 · ${esc(proofStats.source)}</p></div>` : '';
  return `<section id="clients" class="h-nums h-cl2" data-header="light">
 <div class="h-cl__head" data-reveal>
  ${eyebrow('OUR CLIENTS')}
  <h2>${title(['중요한 순간을', '함께한 이름들.'])}</h2>
  <p class="h-cl__sub">기업의 발표부터 공공기관과 창업지원 현장까지, 서로 다른 목적의 자료를 함께 만들었습니다.</p>
 </div>
 ${stats}
 <div class="h-logorows" data-reveal role="group" aria-label="함께한 기업과 기관">${logoRows(base)}</div>
 <p class="h-note">함께 작업한 기관과 기업 중 일부입니다.</p>
</section>`;
}

/* 3 — work: the on-stage slide show (v3), then real published tiles and one button */
function work(base) {
  const tiles = featuredWork.map(f => ({ ...f, p: portfolio.find(p => p.id === f.id && p.publishApproved) })).filter(t => t.p);
  return `<section id="portfolio" class="show h-work" data-header="dark">
 <div class="show__track">
  <div class="show__stage">
   <canvas id="room" aria-hidden="true"></canvas>
   <div class="show__fallback" aria-hidden="true"><img src="${base}assets/slides/sakura.webp" alt="" width="1600" height="900" loading="lazy" decoding="async"></div>
   <div class="show__copy">
    ${eyebrow('SELECTED WORK', 'h-eye--dark')}
    <h2>결과물로 보여드립니다.</h2>
    <p>내용의 흐름, 정보의 배치, 브랜드의 인상까지.<br class="br-d"> 실제 작업에서 그 차이를 확인하세요.</p>
   </div>
   <div class="show__cap" aria-live="polite"><span class="show__bar"><i data-show-bar></i></span><b data-show-name>실제 작업 장표</b></div>
  </div>
 </div>
 <div class="h-work__body">
  <ul class="h-work__grid">${tiles.map(({ p, image }, i) => `<li data-reveal style="--i:${i % 3}"><a class="h-work__tile" href="${base}portfolio/${p.slug}/"><span class="h-work__img"><img src="${base + image}" alt="${esc(p.title)} 작업 이미지" loading="lazy" decoding="async"></span><span class="h-work__cap"><small>${esc(typeNames[p.type] || '')}</small><b>${esc(p.title)}</b></span></a></li>`).join('')}</ul>
  <div class="h-work__foot"><a class="h-pill h-pill--blue" href="${base}portfolio/">작업 사례 전체 보기 ${arrow}</a><p class="h-note h-note--dark">공개에 동의한 자료만 소개합니다.</p></div>
 </div>
</section>`;
}

/* 5 — service and pricing: comparison table (desktop: full header; mobile: names + checks, "이럴 때" list above) */
const no = '<span class="no" aria-label="미포함">—</span>';
function pricingSection(base) {
  const up = ['', 'BASIC 전부 +', 'PRO 전부 +'];
  const approved = p => p.status === 'approved' && Number.isSafeInteger(p.unitPrice);
  const price = p => approved(p)
    ? `<b>${p.setupFee ? `세팅 ${won(p.setupFee)} + ` : ''}장당 ${won(p.unitPrice)}</b>${p.minPages ? `<small>${p.minPages}장 이상</small>` : ''}`
    : '';
  const pre = p => `href="#contact" data-prefill="service=${p.id}&kind=company"`;
  return `<section id="pricing" class="h-price" data-header="light">
 <div class="h-price__head" data-reveal>
  ${eyebrow('SERVICE')}
  <h2>${title(['디자인만 필요할 때도,', '처음부터 함께할 때도.'])}</h2>
  <p>지금 준비된 자료를 바탕으로, 필요한 작업 범위부터 제안합니다.${pricing.some(approved) ? '' : '<span class="h-price__q">(자료 확인 후 견적 안내 예정 / 해당 견적은 장수, 범위 기준)</span>'}</p>
 </div>
 <ul class="h-price__for-m">${pricing.map((p, i) => `<li><b class="tier-${i}">${esc(p.name)}</b><span>${esc(p.when)}</span></li>`).join('')}</ul>
 <div class="h-table-wrap" data-reveal><table class="h-table">
  <caption class="sr-only">서비스별 제공 범위</caption>
  <thead><tr><th scope="col"><span class="sr-only">제공 범위</span></th>${pricing.map((p, i) => `<th scope="col" class="tier-${i}"><span class="up">${up[i] || '&nbsp;'}</span><span class="name">${esc(p.name)}</span><span class="desc">${esc(p.tagline)}</span><span class="for"><b>이럴 때</b> ${esc(p.when)}</span>${approved(p) ? `<span class="price">${price(p)}</span>` : ''}<a class="h-pill h-pill--sm" ${pre(p)}>${esc(p.name)} 견적 문의 ${arrow}</a></th>`).join('')}</tr></thead>
  <tbody>${pricingRows.map(([t, v]) => `<tr><th scope="row">${esc(t)}</th>${v.map((x, i) => `<td class="tier-${i}${x ? '' : ' off'}">${x ? ck : no}</td>`).join('')}</tr>`).join('')}</tbody>
  <tfoot class="h-table__m"><tr><th scope="row"><span class="sr-only">견적 문의</span></th>${pricing.map(p => `<td><a class="h-tq" ${pre(p)} aria-label="${esc(p.name)} 견적 문의">문의 ${arrow}</a></td>`).join('')}</tr></tfoot>
 </table></div>
 ${pricing.some(approved) ? `<p class="h-price__m-price">${pricing.map(p => `${esc(p.name)} ${approved(p) ? `장당 ${won(p.unitPrice)}` : '자료 확인 후 견적'}`).join(' · ')}</p>` : ''}
 <p class="h-price__help" data-reveal>어떤 서비스가 맞을지 몰라도 괜찮습니다. 자료를 살펴보고 필요한 범위부터 안내합니다.</p>
 <ul class="h-price__notes">${pricingNotes.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
</section>`;
}

/* 6 — institutions and demo days. Right card = original v3 card (restored on request 2026-10-28). */
const ddSteps = [
  ['투자자가 묻는 순서로 기획합니다.', '심사 흐름에 맞춰 장표 순서부터 다시 잡습니다.'],
  ['산업도 팀도 달라도, 각자에 맞게.', '팀마다 사업을 이해하고 기획과 디자인을 따로 잡아 드립니다.'],
  ['광고비 0원, 모두 소개로 이어졌습니다.', '결과물이 다음 의뢰를 데려옵니다.'],
];
const manwon = n => n % 10000 === 0 ? `${n / 10000}만원` : `${Math.floor(n / 10000)}만 ${(n % 10000) / 1000}천원`;
function demoday(base) {
  const years = [...new Set(demodayHistory.map(h => h.year))];
  const approved = demodayPrice.status === 'approved';
  let n = 0;
  return `<section id="demoday" class="h-dd" data-header="light">
 <div class="h-dd__l">
  <div class="h-dd__head" data-reveal>
   ${eyebrow('DEMODAY & IR')}
   <h2>${title(['각 팀의 가능성을,', '한 무대에서 선명하게.'])}</h2>
   <p class="h-dd__sub">팀마다 다른 사업과 브랜드를 이해하고, 행사 일정에 맞춰 IR 자료를 완성합니다.</p>
   <p>기관이 자료를 모아 전달하거나, 각 팀과 직접 소통하는 방식 모두 협의할 수 있습니다.</p>
  </div>
  <div class="h-dd__hist" data-reveal>
   <h3 class="h-dd__ht">함께 준비한 데모데이</h3>
   ${years.map(y => `<div class="h-dd__yr"><b>${y}</b><ul>${demodayHistory.filter(h => h.year === y).map(h => `<li style="--i:${n++}"><h4>${esc(h.title.replace(/^20\d\d\s/, ''))}${demodayTeamsApproved && h.teams ? ` <em>${h.teams}팀</em>` : ''}</h4><p>${esc(h.host.replaceAll(' · ', ', '))}</p></li>`).join('')}</ul></div>`).join('')}
   ${irConsulting.length ? `<p class="h-dd__ir"><b>IR 컨설팅</b>${irConsulting.map(x => esc(x.title)).join(' · ')} <em>(세부 내용 비공개)</em></p>` : ''}
  </div>
 </div>
 <div class="h-dd__card" data-reveal>
  <svg class="h-dd__wave" viewBox="0 0 400 400" aria-hidden="true" preserveAspectRatio="none"><defs><linearGradient id="ddw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7f9bff" stop-opacity=".0"/><stop offset=".45" stop-color="#3d63ff" stop-opacity=".55"/><stop offset="1" stop-color="#1f4bff"/></linearGradient><linearGradient id="ddl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9c8ff" stop-opacity="0"/><stop offset=".6" stop-color="#cdd8ff"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient></defs><path d="M150 0C215 95 300 170 400 215V0z" fill="url(#ddw)"/><path d="M215 0C270 110 330 190 400 250V215C310 175 240 105 190 0z" fill="#1f4bff" opacity=".35"/><path d="M150 0C215 95 300 170 400 215" fill="none" stroke="url(#ddl)" stroke-width="1.6"/></svg>
  <h3>한 번 맡기면,<br>여기까지 진행합니다.</h3>
  <ol class="h-dd__steps">${ddSteps.map(([t, d], i) => `<li style="--i:${i}"><span class="no">0${i + 1}</span><h4>${t}</h4><p>${d}</p></li>`).join('')}</ol>
  <div class="h-dd__foot">
   <p>${approved ? `<b>팀당 ${manwon(demodayPrice.perTeam)}</b> (${demodayPrice.pagesIncluded}장 이내)<br>초과 시 장당 ${manwon(demodayPrice.extraPerPage)}, 규모에 따라 협의합니다.` : '팀 수와 제작 범위에 맞춰 견적을 안내합니다.'}</p>
   <div class="h-dd__cta"><a class="h-pill" href="#contact" data-prefill="kind=institution">IR · 데모데이 상담하기 ${arrow}</a>${approved ? `<a class="h-link" href="${base}demoday/#estimate">팀 수로 예상 비용 계산 ${arrow}</a>` : ''}</div>
  </div>
 </div>
 <div class="h-ev" data-reveal>
  <div class="h-ev__head"><h3>행사의 시작부터 기록까지, 웹페이지로.</h3><p>IR 자료와 어울리는 디자인으로 행사 페이지를 제작합니다. 필요한 기능에 따라 범위와 비용을 별도로 안내합니다.</p></div>
  <ol class="h-ev__list">${websiteOptions.map((o, i) => `<li><span class="no">0${i + 1}</span><h4>${esc(o.name)}</h4><p>${esc(o.summary)}</p></li>`).join('')}</ol>
  <ul class="h-ev__notes"><li>${esc(eventPageCommon)}</li><li>참가팀 인터뷰 영상 촬영도 별도로 문의할 수 있습니다.</li></ul>
  <a class="h-link h-ev__more" href="${base}demoday/#website-options">행사 페이지 자세히 보기 ${arrow}</a>
 </div>
</section>`;
}

/* 7 — beyond PPT: print, web and visuals. Sample sites live on the separate /web/ page. */
function beyond(base) {
  return `<section id="beyond" class="h-bp" data-header="dark">
 <div class="h-bp__head" data-reveal>
  ${eyebrow('BEYOND PPT', 'h-eye--dark')}
  <h2>${title(['PPT 밖에서도,', '같은 브랜드로 보이도록.'])}</h2>
  <p>홈페이지부터 인쇄물과 영상까지. 필요한 접점마다 디자인의 흐름을 이어갑니다.</p>
 </div>
 <div class="h-bp__body">
  <ul class="h-bp__list">${beyondItems.map((it, i) => `<li data-reveal style="--i:${i}"><span class="ic">${obj(it.obj, base)}</span><div><h3>${esc(it.title)}</h3><p>${esc(it.body)}</p>${it.id === 'web' ? `<a class="h-link h-bp__more" href="${base}web/">웹 제작 사례 보기 ${arrow}</a>` : ''}</div></li>`).join('')}</ul>
 </div>
 <div class="h-bp__foot" data-reveal>
  <a class="h-pill h-pill--blue" href="#contact" data-prefill="more=1">PPT와 함께 견적 문의 ${arrow}</a>
  <div class="h-bp__notes"><p>PPT 제작과 구분해 작업 범위와 비용을 안내합니다.</p></div>
 </div>
</section>`;
}

/* 8 — reviews and FAQ */
function voice() {
  const shown = reviews.filter(r => r.excerpt);
  return `<section id="reviews" class="h-rev" data-header="light">
 <div class="h-rev__head">
  <div data-reveal>
   ${eyebrow('CLIENT VOICE')}
   <h2>${title(['다시 맡기는 이유,', '고객의 말에 있습니다.'])}</h2>
   <p class="h-rev__sub">자료를 이해하는 과정부터 디자인과 소통까지. 함께 작업한 고객의 후기를 확인하세요.</p>
  </div>
  <div class="h-rev__pager"><button type="button" data-rev-prev aria-label="이전 후기">${arrow}</button><span class="sr-only"><b data-rev-now>01</b> / ${String(shown.length).padStart(2, '0')}</span><button type="button" data-rev-next aria-label="다음 후기">${arrow}</button></div>
 </div>
 <div class="h-rev__track" data-rev-track tabindex="0" aria-label="고객 후기, 좌우로 넘기기">${[0, 1].map(k => shown.map(r => `<article class="h-rcard"${k ? ' aria-hidden="true" data-clone' : ''}>
  <header><h3>“${esc(r.excerpt)}”</h3></header>
  <div class="h-rcard__body"><p>${esc(r.body)}</p></div>
 </article>`).join('')).join('')}</div>
 <div class="h-rev__foot"><p class="h-rev__note">외부 판매 페이지에 올라온 후기 원문입니다.</p>${site.reviewSourceUrl ? `<a class="h-link" href="${esc(site.reviewSourceUrl)}" target="_blank" rel="noopener">후기 원문 보기 ${ext}</a>` : ''}</div>
 <div class="h-faq" id="faq">
  <h3 class="h-faq__t" data-reveal>맡기기 전, 궁금한 것들.</h3>
  <div class="faq-list">${faq.map((x, i) => `<div class="faq-item"><h4><button type="button" aria-expanded="false" aria-controls="answer-${i}" id="question-${i}"><span class="q">${esc(x.question)}</span><span class="pm" aria-hidden="true">+</span></button></h4><div class="faq-answer" id="answer-${i}" role="region" aria-labelledby="question-${i}" hidden><p>${esc(x.answer)}</p></div></div>`).join('')}</div><button class="faq-more" type="button" data-faq-more>질문 더 보기 +</button>
 </div>
</section>`;
}

export function homePage(base = '') {
  return `<div class="h-intro">${hero(base)}${statement(base)}</div>${clients(base)}${work(base)}${pricingSection(base)}${demoday(base)}${beyond(base)}${voice()}${contactSection(base)}`;
}
