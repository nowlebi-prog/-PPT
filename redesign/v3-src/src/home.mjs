// Home page markup. Concept objects are decorative studio graphics, not client evidence.
import {site,pricing,faq,processSteps,proof,demodayHistory,partnerLogos,partnerNames,stats,reviews,irConsulting,webShowcase} from './data.mjs';
import {portfolio} from './portfolio.mjs';

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const obj=(name,base,cls='',eager=false)=>`<img class="obj ${cls}" src="${base}assets/concepts/${name}.webp" alt="" width="1200" height="800" decoding="async" loading="${eager?'eager':'lazy'}"${eager?' fetchpriority="high"':''}>`;
const arrow='<svg class="arr" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5"/></svg>';
const published=portfolio.filter(p=>p.publishApproved);
const ck='<svg class="ck" viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.6 3.5 7.4-8"/></svg>';

/* 1 — hero: dark stage, one loud line on the left, the deck asset on the right. */
const rot=['같은 초안도,','급한 IR도,','줄글 메모도,','AI로 뽑은 장표도,'];
function hero(base){
return `<section id="hero" class="h-hero" data-header="dark">
 <div class="h-hero__grid">
  <div class="h-hero__left">
   <h1 class="h-title" aria-label="같은 초안도, 유별나게.">
    <span class="h-title__rot" aria-hidden="true"><span class="h-rot" data-rot>${rot.map((t,i)=>`<b${i===0?' class="is-on"':''}>${t}</b>`).join('')}</span></span>
    <span class="h-title__big" aria-hidden="true">${[...'유별나게'].map((c,i)=>`<b style="--i:${i}">${c}</b>`).join('')}<b class="dot" style="--i:4">.</b></span>
   </h1>
   <p class="h-hero__sub" data-intro>기획자의 시선과 디자이너의 손으로,<br>발표에 필요한 흐름과 디자인을 완성합니다.</p>
  </div>
  <div class="h-hero__right">
   <div class="h-hero__obj">${obj('deck',base,'',true)}</div>
   <div class="h-hero__cta" data-intro><a class="h-pill h-pill--blue" href="${base}contact/">내 자료로 견적 상담 ${arrow}</a><a class="h-link h-link--light" href="#portfolio">작업 먼저 보기 ${arrow}</a></div>
  </div>
 </div>
</section>`}

/* 2 — statement band (coreplatform-style): one sentence, an object and two English tags woven into the lines */
const tag=t=>`<span class="h-tag" aria-hidden="true">${t}</span>`;
function collage(base){
return `<section id="collage" class="h-collage" data-header="dark">
 <div class="h-collage__copy">
  <h2 class="h-sent" aria-label="좋은 아이템이, 자료 때문에 작아 보이지 않게." data-reveal>
   <span class="ln" aria-hidden="true"><span class="w em">좋은</span> <span class="w em">아이템이,</span></span>
   <span class="ln" aria-hidden="true"><span class="w">자료</span> <span class="h-sent__obj">${obj('print',base)}</span> <span class="w">때문에</span></span>
   <span class="ln" aria-hidden="true"><span class="w em">작아 보이지</span> <span class="w em">않게.</span></span>
  </h2>
  <p data-reveal>디자인보다 먼저,<br>무엇을 말하고 무엇을 크게 보여줄지 정리합니다.</p>
 </div>
</section>`}

/* 4 — process: sticky horizontal track, white turns black */
function draftSlide(){return `<div class="mini mini--draft"><p class="t">회사소개 및 사업계획</p><ul><li>재고 관리 솔루션 개발</li><li>창고 데이터 실시간 연동 기능</li><li>기존 방식 대비 편리함, 비용 절감 등</li><li>향후 해외 진출 계획 있음</li><li>팀 구성: 대표 외 4명</li></ul><span class="sticky">핵심이 뭐지?</span></div>`}
function flowSlide(){return `<div class="mini mini--flow"><div class="key"><span class="lbl">핵심 메시지</span><p class="msg">창고 재고를<br>실시간으로, 한눈에.</p><i class="k3"></i></div><ol>${['문제','해결','시장','제품','팀','계획'].map((x,i)=>`<li style="--d:${i}"><span>${String(i+1).padStart(2,'0')}</span>${x}</li>`).join('')}</ol></div>`}
function finalSlide(){return `<div class="mini mini--final"><div class="fs-top"><b>STOCKLINE</b><span>02 해결</span></div><p class="fs-h">창고의 재고를,<br><em>한눈에.</em></p><div class="fs-bars"><i style="--h:.38"></i><i style="--h:.55"></i><i style="--h:.7"></i><i style="--h:.92"></i></div><span class="pin p1">1</span><span class="pin p2">2</span><span class="bubble">제목 한 줄로 줄여주세요</span></div>`}
function deliverSlide(){return `<div class="mini mini--deliver"><div class="file pptx"><b>PPTX</b><span>편집용 원본</span></div><div class="file pdf"><b>PDF</b><span>배포·인쇄용</span></div><ul><li>직접 수정 가능한 요소 안내</li><li>이미지로 제공되는 요소 안내</li></ul></div>`}
function process(){const visuals=[draftSlide(),flowSlide(),finalSlide(),deliverSlide()];
return `<section id="ai-finish" class="h-process" data-header="light">
 <div class="h-process__head">
  <h2 data-reveal aria-label="AI로 뽑은 초안도, 발표하는 완성본으로."><span aria-hidden="true">AI로 뽑은 초안도,<br><span class="em">발표하는 완성본으로.</span></span></h2>
  <p data-reveal>초안이 있든 없든 괜찮습니다.<br>네 단계로 한 장씩 완성합니다.</p>
 </div>
 <div class="h-process__body">
  <div class="h-steps" role="tablist" aria-label="진행 과정" aria-orientation="vertical">${processSteps.map((s,i)=>`<button type="button" role="tab" id="step-tab-${i}" aria-controls="step-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-step="${i}"><span class="no" aria-hidden="true">0${i+1}</span><span class="tx"><span class="t">${esc(s.title)}</span><span class="d">${esc(s.description)}</span><span class="bar" aria-hidden="true"><i></i></span></span></button>`).join('')}</div>
  <div class="h-process__stage" aria-live="polite">${visuals.map((v,i)=>`<div class="h-stage${i===0?' is-on':''}" role="tabpanel" id="step-${i}" aria-labelledby="step-tab-${i}" data-step-panel="${i}">${v}</div>`).join('')}</div>
 </div>
 <p class="h-process__note">※ 이해를 돕기 위한 예시 화면입니다.</p>
</section>`}

/* 4b — AI retouch: three gaps AI drafts leave, each with its fix, then real work */
const gaps=[
 ['뻔한 디자인, 읽히지 않는 내용.','핵심부터 다시 짜고, 브랜드 톤으로 디자인합니다.'],
 ['그럴듯한 숫자, 불분명한 근거.','원자료와 대조해 수치와 근거를 바로잡습니다.'],
 ['제품은 있는데 보이지 않는 강점.','강점이 보이도록 이미지와 영상 소재를 더합니다.'],
];
const retouchWork=[['x02','extra-02b','기업 소개서'],['x14','extra-14b','IT 기업 소개서'],['x18','extra-18b','서비스 소개서']];
function retouch(base){
return `<section id="ai-retouch" class="h-fix" data-header="dark">
 <h2 data-reveal>AI 초안의 빈틈,<br><span>사람의 손으로 메웁니다.</span></h2>
 <p class="h-fix__lead" data-reveal>보기 좋은 초안에서 멈추지 않습니다.<br>내용과 표현을 발표 목적에 맞게 다시 다듬습니다.</p>
 <ul class="h-fix__rows">${gaps.map(([p,f])=>`<li data-reveal><s class="was">${p.replace(/\.$/,'')}</s><span class="to" aria-hidden="true">${arrow}</span><b class="now">${f}</b></li>`).join('')}</ul>
 <div class="h-fix__work">
  <p class="h-fix__wh" data-reveal>이렇게 바뀐 실제 작업물 <a href="${base}portfolio/">전체 보기 ${arrow}</a></p>
  <div class="h-fix__grid">${retouchWork.map(([id,img,t],i)=>`<a class="h-fix__tile" href="${base}portfolio/case-${id}/" data-reveal style="--i:${i}"><img src="${base}assets/pf/${img}.webp" alt="${t} 작업 이미지" width="1400" height="1400" loading="lazy" decoding="async"><span>${t} <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5"/></svg></span></a>`).join('')}</div>
 </div>
</section>`}

/* 5 — capabilities: what we make on the left, the English word with its object on the right */
const cats=[
 ['DECK','deck','발표자료','IR · 회사소개서 · 제안서 · 교육자료',['내용 구조와 페이지 흐름 정리','브랜드에 맞춘 표지 · 목차 · 내지 디자인','차트 · 인포그래픽 디자인','편집 가능한 PPTX · PDF 납품'],'내용 정리부터 편집 가능한 원본까지, 한 번에.'],
 ['PRINT','print','인쇄와 편집','브로슈어 · 카탈로그 · 리플렛 · 교육안내책자',['장표의 메시지를 판형에 맞게 재편집','표지와 내지 디자인','인쇄용 PDF 납품'],'발표자료와 같은 톤으로 인쇄물까지 이어갑니다.'],
 ['WEB','digital','웹과 콘텐츠','기업 · 행사 랜딩페이지 · SNS · 블로그',['행사 · 브랜드 소개 랜딩페이지','발표자료와 같은 톤의 페이지 디자인','SNS · 블로그용 콘텐츠 이미지'],'행사와 브랜드를 소개하는 페이지를 함께 만듭니다.'],
 ['VISUAL','image-video','이미지와 영상','제품 목업 · AI 이미지 · 소개 영상',['제품 목업 이미지','자료에 들어갈 AI 이미지','짧은 소개 영상'],'자료에 필요한 이미지와 영상을 함께 준비합니다.'],
 ['TOOLS','tools','업무 도구','자동화 · 대시보드 · 제작 가이드',['반복되는 제작 업무 자동화','내부 대시보드','제작 가이드 정리'],'반복되는 제작 업무를 줄이는 도구를 만듭니다.'],
];
function capabilities(base){
const word=c=>`<p class="h-cap__word" aria-hidden="true">${c[0]}</p><p class="h-cap__word h-cap__word--front" aria-hidden="true">${[...c[0]].map((ch,k,a)=>`<span${k===0||k===a.length-1?'':' class="in"'}>${ch}</span>`).join('')}</p>`;
return `<section id="capabilities" class="h-cap2" data-header="light">
 <div class="h-cap2__head">
  <h2 data-reveal>유별난 퀄리티로,<br><span>여기까지.</span></h2>
  <p data-reveal>PPT 하나로 끝나지 않으니까.<br>인쇄물, 웹, 이미지까지 같은 톤으로 이어갑니다.</p>
 </div>
 <div class="h-cap2__row" role="tablist" aria-label="제작 분야">${cats.map((c,i)=>`<div class="h-col${i===0?' is-on':''}" data-cap-panel="${i}" data-keep style="--n:${c[0].length}">
  <button class="h-col__tab" type="button" role="tab" id="cap-tab-${i}" aria-controls="cap-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-cap="${i}"><span class="ic">${obj(c[1],base,'thumb')}</span><span class="k">${c[2]}</span><span class="plus" aria-hidden="true">+</span></button>
  <div class="h-col__body" role="tabpanel" id="cap-panel-${i}" aria-labelledby="cap-tab-${i}">
   <div class="h-col__vis" aria-hidden="true">${word(c)}<div class="h-cap__obj">${obj(c[1],base)}</div></div>
   <div class="h-col__info">
    <h3>${c[2]}</h3>
    <ul class="kinds">${c[3].split(' · ').map(k=>`<li>${k}</li>`).join('')}</ul>
    <ul class="scope">${c[4].map(t=>`<li>${ck}<b>${t}</b></li>`).join('')}</ul>
    <p class="note">${c[5]}</p>
   </div>
  </div>
 </div>`).join('')}</div>
 <div class="h-cap2__foot"><div class="h-cap__pager"><button type="button" data-cap-prev aria-label="이전 분야">${arrow}</button><span class="sr-only"><b data-cap-now>01</b> / 0${cats.length}</span><button type="button" data-cap-next aria-label="다음 분야">${arrow}</button></div><p class="h-cap__fine">발표자료 외 제작은 범위에 따라 별도 견적입니다.</p></div>
</section>`}

/* 6 — works "on stage" (restored from v2): 3D auditorium, camera walks to the screen as you scroll */
function works(base){
return `<section id="portfolio" class="show" data-header="dark">
 <div class="show__stage">
  <canvas id="room" aria-hidden="true"></canvas>
  <div class="show__fallback" aria-hidden="true"><img src="${base}assets/slides/sakura.webp" alt="" width="1600" height="900" loading="lazy" decoding="async"></div>
  <div class="show__copy">
   <h2><b>유별난 완성도를</b><br><span>살펴보세요.</span></h2>
   <a class="show__btn" href="${base}portfolio/">작업 사례 보기 ${arrow}</a>
  </div>
  <div class="show__cap" aria-live="polite"><span class="show__bar"><i data-show-bar></i></span><b data-show-name>실제 작업 장표</b><a class="show__all" href="${base}portfolio/">전체 작업 보기 ${arrow}</a></div>
 </div>
</section>`}

/* 7 — demoday: track record first, then everything that is handled */
const svc=[
 ['자료 분석','팀별 제출 자료를 읽고 우선순위 정리','M3 4h10v12H3zM7 8h6M7 11h6M7 14h3'],
 ['발표 흐름 구성','문제 · 해결 · 시장 · 팀 순서와 페이지 분할','M3 5h6v4H3zM11 11h6v4h-6zM9 7h4v6'],
 ['팀별 맞춤 디자인','팀마다 브랜드 컬러와 톤에 맞춘 디자인','M10 3l7 7-7 7-7-7z'],
 ['전체 장표 제작','대표 시안 확인 후 전체 IR Deck 완성','M2 5h16v10H2zM5 18h10'],
 ['일정 · 피드백 관리','기관 취합 · 팀별 소통을 한곳에서 관리','M4 4h12v13H4zM4 8h12M8 2v4M12 2v4'],
 ['PPTX · PDF 납품','편집 가능한 원본과 배포용 PDF','M5 2h7l4 4v12H5zM12 2v4h4'],
];
function demoday(base){
const years=[...new Set(demodayHistory.map(h=>h.year))];
const steps=[['투자자가 묻는 순서로 기획합니다.','심사 흐름에 맞춰 장표 순서부터 다시 잡습니다.'],['산업도 팀도 달라도, 각자에 맞게.','팀마다 사업을 이해하고 기획과 디자인을 따로 잡아 드립니다.'],['광고비 0원, 모두 소개로 이어졌습니다.','결과물이 다음 의뢰를 데려옵니다.']];
return `<section id="demoday" class="h-dd" data-header="light">
 <div class="h-dd__l">
  <div class="h-dd__head" data-reveal><h2>데모데이도<br><span>유별나게.</span></h2><p>액셀러레이터, 대학, 지자체 데모데이에서<br>행사 대표 디자인과 참가팀 IR Deck을 맡았습니다.</p></div>
  <div class="h-dd__hist" data-reveal>
   ${(()=>{let n=0;return years.map(y=>`<div class="h-dd__yr"><b>${y}</b><ul>${demodayHistory.filter(h=>h.year===y).map(h=>`<li style="--i:${n++}"><h4>${esc(h.title.replace(/^20\d\d\s/,''))}</h4><p>${esc(h.host.replaceAll(' · ',', '))}</p></li>`).join('')}</ul></div>`).join('')})()}
   ${irConsulting.length?`<p class="h-dd__ir"><b>IR 컨설팅</b>${irConsulting.map(x=>esc(x.title)).join(' · ')} <em>(세부 내용 비공개)</em></p>`:''}
  </div>
 </div>
 <div class="h-dd__card" data-reveal>
  <svg class="h-dd__wave" viewBox="0 0 400 400" aria-hidden="true" preserveAspectRatio="none"><defs><linearGradient id="ddw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7f9bff" stop-opacity=".0"/><stop offset=".45" stop-color="#3d63ff" stop-opacity=".55"/><stop offset="1" stop-color="#1f4bff"/></linearGradient><linearGradient id="ddl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9c8ff" stop-opacity="0"/><stop offset=".6" stop-color="#cdd8ff"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient></defs><path d="M150 0C215 95 300 170 400 215V0z" fill="url(#ddw)"/><path d="M215 0C270 110 330 190 400 250V215C310 175 240 105 190 0z" fill="#1f4bff" opacity=".35"/><path d="M150 0C215 95 300 170 400 215" fill="none" stroke="url(#ddl)" stroke-width="1.6"/></svg>
  <h3>한 번 맡기면,<br>여기까지 진행합니다.</h3>
  <ol class="h-dd__steps">${steps.map(([t,d],i)=>`<li style="--i:${i}"><span class="no">0${i+1}</span><h4>${t}</h4><p>${d}</p></li>`).join('')}</ol>
  <div class="h-dd__foot"><p><b>팀당 50만원</b> (20장 이내)<br>초과 시 장당 2만 5천원, 규모에 따라 협의합니다.</p><div class="h-dd__cta"><a class="h-pill" href="${base}contact/?service=demoday">IR · 데모데이 상담하기 ${arrow}</a><a class="h-link" href="${base}demoday/">팀 수로 예상 비용 계산 ${arrow}</a></div></div>
 </div>
</section>`}

function logoRows(base){const half=Math.ceil(partnerLogos.length/2);const names=partnerNames.map(n=>`<span class="nm">${esc(n)}</span>`);
const rows=[[...partnerLogos.slice(0,half).map(l=>`<img src="${base+l.src}" alt="${esc(l.name)}" loading="lazy">`),...names.slice(0,5)],[...partnerLogos.slice(half).map(l=>`<img src="${base+l.src}" alt="${esc(l.name)}" loading="lazy">`),...names.slice(5)]];
return rows.map((r,i)=>{const t=r.join('');return `<div class="h-lrow${i?' is-rev':''}"><div class="h-lrow__track">${t}${t.replaceAll('alt="','aria-hidden="true" alt="').replaceAll('<span class="nm">','<span class="nm" aria-hidden="true">')}</div></div>`}).join('')}
/* numbers — said as one sentence (Channel Talk / Locomotive): figures inline, real work and logos as chips, then a logo wall */
function numbers(base){
const [work,client,score,rev]=stats;
const n=(st,suf)=>`<b class="n"><span data-count="${st.value}">${st.value}</span>${suf}</b>`;
const chipLogos=[11,8,13].map(i=>partnerLogos[i]).filter(Boolean).map((l,k)=>`<img src="${base+l.src}" alt="" loading="lazy" style="--k:${k}">`).join('');
const chipWork=['assets/pf/02a.webp','assets/pf/12a.webp','assets/pf/book-23.webp'].map((f,i)=>`<img src="${base+f}" alt="" loading="lazy" style="--k:${i}">`).join('');
const label=`${client.value}곳 넘는 고객사가 ${work.value}건 넘는 장표를 맡겼습니다. 평균 만족도 ${score.value}점, 공식 후기 ${rev.value}건 이상.`;
return `<section id="numbers" class="h-nums" data-header="light">
 <h2 class="h-nums__sent" aria-label="${label}" data-reveal>
  <span class="ln" aria-hidden="true">${n(client,'곳')} 넘는 고객사가</span>
  <span class="ln" aria-hidden="true">${n(work,'건')} 넘는 <span class="h-chip h-chip--work">${chipWork}</span> 장표를 맡겼습니다.</span>
  <span class="ln ln--sub" aria-hidden="true">평균 만족도 ${n(score,'점')}, 공식 후기 ${n(rev,'건+')}</span>
 </h2>
 <a class="h-link h-nums__more" href="#reviews" data-reveal>실제 후기 보기 ${arrow}</a>
 <div class="h-logorows" data-reveal aria-label="함께한 기업과 기관">${logoRows(base)}</div>
</section>`}

/* website showcase — renders only once real captures are supplied in data.webShowcase */
function webSection(base){if(!webShowcase.length)return '';
const perks=['발표자료와 같은 톤으로 디자인','PC와 모바일 모두 대응'];
return `<section id="web" class="h-web" data-header="dark">
 <div class="h-web__copy">
  <p class="h-new" data-reveal><span>유별난PPT 고객 ONLY</span></p>
  <h2 data-reveal>PPT를 맡기셨다면,<br>홈페이지는<br><span>40% 이상 저렴하게.</span></h2>
  <ul class="h-web__perks" data-reveal>${perks.map(t=>`<li>${ck}${t}</li>`).join('')}</ul>
  <a class="h-pill h-pill--blue" href="${base}contact/?option=web-info" data-reveal>홈페이지 상담하기 ${arrow}</a>
  <p class="h-web__fine">일반 제작 견적 대비 기준이며, 최종 금액은 견적서로 안내합니다.</p>
 </div>
 <div class="h-pc" data-pc data-reveal>
  <div class="h-pc__screen"><div class="h-pc__track">${webShowcase.map((w,i)=>`<figure class="h-pc__slide"${i?' aria-hidden="true"':''}><img src="${base+w.src}" alt="${esc(w.title)} 화면이 위아래로 넘어가는 미리보기" width="800" height="500" loading="lazy" decoding="async"></figure>`).join('')}</div></div>
  <div class="h-pc__stand" aria-hidden="true"></div>
  <div class="h-pc__cap"><p aria-live="polite"><b data-pc-title>${esc(webShowcase[0].title)}</b><span data-pc-sub>${esc(webShowcase[0].sub)}</span></p><div class="h-pc__dots">${webShowcase.map((w,i)=>`<button type="button" data-pc-go="${i}" data-t="${esc(w.title)}" data-s="${esc(w.sub)}" aria-label="${esc(w.title)} 보기"${i===0?' aria-current="true"':''}></button>`).join('')}</div></div>
 </div>
</section>`}

/* reviews — card slider (Naver expert style): blue header band, quote, swipe or arrows */
function reviewsSection(){
return `<section id="reviews" class="h-rev" data-header="light">
 <div class="h-rev__head">
  <div><h2 data-reveal>실제 후기가 증명하는 브랜드</h2><p class="h-rev__sub" data-reveal>공식 후기 <b>458건+</b> · 평균 만족도 <b>★ 4.9</b></p></div>
  <div class="h-rev__pager"><button type="button" data-rev-prev aria-label="이전 후기">${arrow}</button><span class="sr-only"><b data-rev-now>01</b> / ${String(reviews.length).padStart(2,'0')}</span><button type="button" data-rev-next aria-label="다음 후기">${arrow}</button></div>
 </div>
 <div class="h-rev__track" data-rev-track tabindex="0" aria-label="고객 후기, 좌우로 넘기기">${[0,1].map(k=>reviews.map((r,i)=>`<article class="h-rcard"${k?' aria-hidden="true" data-clone':''}>
  <header><p class="stars" aria-label="별점 5점">★★★★★ <span>5.0</span></p><h3>${esc(r.title)}</h3></header>
  <div class="h-rcard__body"><p>${esc(r.body)}</p></div>
 </article>`).join('')).join('')}</div>
 <p class="h-rev__note">외부 판매 페이지에서 확인할 수 있는 실제 후기입니다.</p>
</section>`}

/* 8 — pricing table: plans across, included / not included down */
const no='<span class="no" aria-label="미포함">—</span>';
const rows=[
 ['편집 가능한 PPTX · PDF 납품',[1,1,1]],
 ['텍스트 · 도형 편집화와 간단 리터치',[1,1,1]],
 ['브랜드 맞춤 새 디자인 (표지 · 목차 · 내지)',[0,1,1]],
 ['차트 · 인포그래픽 디자인',[0,1,1]],
 ['발표 흐름 · 페이지 분할 기획',[0,0,1]],
 ['핵심 문구 정리',[0,0,1]],
];
const josa=w=>{const c=w.charCodeAt(w.length-1)-0xAC00;return c>=0&&c%28?'이라면':'라면'};
function pricingSection(base){const price=p=>p.status==='approved'?`<b>${p.setupFee?`세팅 ${p.setupFee/10000}만원 + `:''}장당 ${p.unitPrice/10000}만원</b>${p.minPages?`<small>${p.minPages}장 이상</small>`:''}`:`<b>자료 확인 후 견적</b><small>장수 · 범위 기준</small>`;
const up=['','BASIC 전부 +','PRO 전부 +'];
return `<section id="pricing" class="h-price" data-header="light">
 <div class="h-price__head" data-reveal><h2><span>정직한 가격,</span><br>타협하지 않는 퀄리티.</h2><p>필요한 범위만큼만 고르시면 됩니다.</p></div>
 <div class="h-table-wrap" data-reveal><table class="h-table">
  <thead><tr><th scope="col"><span class="sr-only">항목</span></th>${pricing.map((p,i)=>`<th scope="col" class="tier-${i}"><span class="up">${up[i]||'&nbsp;'}${i===1?'<em class="pop">인기</em>':''}</span><span class="name">${esc(p.name)}</span><span class="desc">${esc(p.desc)}</span><span class="for">${esc(p.prepared)}${josa(p.prepared)}</span><span class="price">${price(p)}</span><a class="h-pill h-pill--sm" href="${base}contact/?service=${p.id}">상담하기 ${arrow}</a></th>`).join('')}</tr></thead>
  <tbody>
   <tr class="grp"><th scope="rowgroup" colspan="4">포함 범위</th></tr>
   ${rows.map(([t,v])=>`<tr><th scope="row">${t}</th>${v.map((x,i)=>`<td class="tier-${i}${x?'':' off'}">${x?ck:no}</td>`).join('')}</tr>`).join('')}
  </tbody>
 </table></div>
 <div class="h-plans-m">${pricing.map((p,i)=>`<article class="h-pm tier-${i}"><span class="up">${up[i]||''}${i===1?'<em class="pop">인기</em>':''}</span><h3>${esc(p.name)}</h3><p class="desc">${esc(p.desc)} · ${esc(p.prepared)}${josa(p.prepared)}</p><p class="price">${price(p)}</p><ul>${rows.map(([t,v])=>`<li class="${v[i]?'':'off'}">${v[i]?ck:no}${t}</li>`).join('')}</ul><a class="h-pill h-pill--sm" href="${base}contact/?service=${p.id}">상담하기 ${arrow}</a></article>`).join('')}</div>
 <div class="h-price__notes"><h3>기타 안내</h3><ul><li><b>수정 범위와 횟수</b>는 자료를 확인한 뒤 견적서에 명시합니다.</li><li><b>시장 조사 · 재무 모델 · 투자 전략, 번역 · 법률 검토</b>는 세 단계 모두 기본 범위에 포함되지 않으며, 필요하면 별도로 협의합니다.</li><li>부가세 처리 기준과 최종 금액은 자료와 제작 범위를 확인한 뒤 견적서로 안내합니다.</li></ul></div>
</section>`}

/* 9 — faq */
function faqSection(){return `<section id="process-faq" class="h-faq" data-header="light">
 <h2 data-reveal>자주 묻는 질문.</h2>
 <div class="faq-list">${faq.map((x,i)=>`<div class="faq-item"><h3><button aria-expanded="false" aria-controls="answer-${i}" id="question-${i}">${esc(x.question.replace(/\??$/,'?'))}<span aria-hidden="true">+</span></button></h3><div class="faq-answer" id="answer-${i}" role="region" aria-labelledby="question-${i}" hidden><p>${esc(x.answer)}</p></div></div>`).join('')}</div>
</section>`}

/* closing: CTA band (all pages) + contact block with a mail form (home only) */
export function closing(base,{form=false}={}){const tel=site.phone.replaceAll('-','');
const band=`<section id="contact" class="h-close" data-header="dark">
 <div class="h-close__inner">
  <h2 data-reveal><b>다음 발표,</b><br>유별나게 준비하세요.</h2>
  <p data-reveal>지금 상담을 남기시면 일정과 견적을 빠르게 안내해 드립니다.</p>
  <div class="h-close__cta" data-reveal><a class="h-close__kakao" href="${site.kakao}" target="_blank" rel="noopener">카카오톡 상담하기 <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5"/></svg></a><button class="h-close__quote" type="button" data-quote>빠른 견적 문의하기 ${arrow}</button></div>
 </div>
</section>`;
if(!form)return band;
return band+`<section id="inquiry" class="h-inq" data-header="dark">
 <div class="h-inq__info">
  <h2><b>지금 가진 자료로,</b><br>어디까지 가능한지 물어보세요.</h2>
  <p class="h-inq__lead">필요한 작업과 지금 상황만 알려 주세요.<br>목적과 일정에 맞춰 방향과 견적을 안내합니다.</p>
  <dl class="h-inq__list">
   <div><dt>전화</dt><dd><a href="tel:${tel}">${site.phone}</a></dd></div>
   <div><dt>이메일</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div>
   <div><dt>팩스</dt><dd>${site.fax}</dd></div>
   <div><dt>카카오톡</dt><dd><a href="${site.kakao}" target="_blank" rel="noopener">채널에서 상담하기 ↗</a></dd></div>
   <div><dt>상담 시간</dt><dd>09:00 – 17:00</dd></div>
  </dl>
  <a class="h-inq__more" href="${base}contact/">기관 · 데모데이 상세 견적 문의 ${arrow}</a>
 </div>
 <form class="h-inq__form" id="home-inquiry" novalidate data-mail="${site.email}">
  <p class="h-inq__draft" data-draft hidden>작성하던 내용을 불러왔어요. <button type="button" data-draft-clear>지우기</button></p>
  <div class="h-inq__row"><label><span>성함 <i>*</i></span><input name="name" required maxlength="40" placeholder="이름을 입력하세요" autocomplete="name"></label><label><span>회사명 <i>*</i></span><input name="org" required maxlength="80" placeholder="회사 또는 브랜드명" autocomplete="organization"></label></div>
  <div class="h-inq__row"><label><span>이메일 <i>*</i></span><input name="email" type="email" required placeholder="example@company.co.kr" autocomplete="email"></label><label><span>회신 받을 연락처 <i>*</i></span><input name="phone" type="tel" required placeholder="연락 받으실 번호" autocomplete="tel"></label></div>
  <label><span>문의 내용 <i>*</i></span><textarea name="message" id="home-message" rows="4" required minlength="5" maxlength="3000" placeholder="자료 상태와 필요한 작업, 희망 일정을 적어 주세요."></textarea></label>
  <details class="h-inq__extra"><summary>추가 정보 입력 <small>선택 · 의뢰 목적 · 분량 · 납기 · 예산</small></summary>
   <div class="h-inq__row"><label><span>의뢰 목적</span><select name="goal"><option value="">선택</option><option>투자 유치 (IR)</option><option>데모데이</option><option>정부지원사업 발표</option><option>입찰 · 제안</option><option>회사 · 브랜드 · 제품 소개</option><option>기타</option></select></label><label><span>분량</span><select name="pages"><option value="">선택</option><option>10장 이하</option><option>10 – 20장</option><option>20 – 40장</option><option>40장 이상</option><option>잘 모르겠어요</option></select></label></div>
   <div class="h-inq__row"><label><span>희망 납기</span><select name="due"><option value="">선택</option><option>1주 이내</option><option>2주 이내</option><option>한 달 이내</option><option>아직 미정</option></select></label><label><span>예산</span><input name="budget" maxlength="40" placeholder="예: 50만원 내외"></label></div>
  </details>
  <label class="h-inq__agree"><input type="checkbox" name="agree" required> 개인정보 수집 · 이용에 동의합니다. (필수) 수집 항목: 성함, 회사명, 이메일, 연락처 / 보유 기간: 상담 종료 후 1년</label>
  <p class="h-inq__err" data-err role="alert"></p>
  <button class="h-inq__submit" type="submit">상담 요청 보내기 ${arrow}</button>
  <p class="h-inq__note">버튼을 누르면 메일 앱이 열립니다. 메일 앱에서 보내기를 눌러야 접수됩니다.</p>
 </form>
</section>`}

export function homePage(base=''){return `<div class="h-intro">${hero(base)}${collage(base)}</div>`+retouch(base)+numbers(base)+works(base)+capabilities(base)+demoday(base)+webSection(base)+reviewsSection()+pricingSection(base)+faqSection()+closing(base,{form:true})}
