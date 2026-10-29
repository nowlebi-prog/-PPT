import { homePage, webPricing, webStrip, ddSteps, dm, manwon } from './home.mjs';
import { closingBand, contactSection } from './contact.mjs';
import { site, included, demodayFlow, demodayPrice, demodayHistory, irConsulting, media, webShowcase } from './data.mjs';
import { portfolio, assetDimensions } from './portfolio.mjs';
import { esc, title, arrow as arr } from './ui.mjs';
export { esc };
const arrow = '<span aria-hidden="true">↗</span>';
const label = s => `<p class="eyebrow">${esc(s)}</p>`;
function button(text, url, secondary = false) { return `<a class="button ${secondary ? 'button--text' : ''}" href="${url}">${esc(text)}${arrow}</a>`; }
export function slot(m, base = '', extra = '') { const valid = m?.src && m.status === 'ready' && (m.kind !== 'gif' || m.poster); return `<div class="media-slot ${extra}" data-media="${esc(m?.id || 'empty')}" data-status="${valid ? 'ready' : 'empty'}" ${!valid ? 'role="img" aria-label="' + esc(m?.title || '미디어') + ' 이미지 준비 중"' : ''} style="--ratio:${m?.width || 1600}/${m?.height || 900}">${valid ? `<img src="${base + (m.kind === 'gif' ? m.poster : m.src)}" ${m.poster ? `data-gif="${base + m.src}" data-poster="${base + m.poster}"` : ''} alt="${esc(m.alt || m.title)}" width="${m.width}" height="${m.height}" loading="lazy">` : ''}<span class="slot-note">${esc(m?.kind === 'gif' ? 'GIF 삽입 예정' : m?.title || '이미지 준비 중')}</span>${valid && m.kind === 'gif' && m.poster ? '<button type="button" class="media-toggle">미리보기 재생</button>' : ''}</div>`; }
const ready = m => m?.src && m.status === 'ready';
function image(src, base, alt = '', cls = '', eager = false) { const size = assetDimensions[src] || { width: 1600, height: 900 }; return `<img class="${cls}" src="${base + src}" alt="${esc(alt)}" width="${size.width}" height="${size.height}" sizes="(max-width: 767px) calc(100vw - 40px), 60vw" loading="${eager ? 'eager' : 'lazy'}" ${eager ? 'fetchpriority="high"' : ''}>`; }
const typeNames = { ir: 'IR과 발표자료', company: '회사소개와 제안서', print: '인쇄와 편집' };
function card(p, base, large = false) { return `<article class="project ${large ? 'project--large' : ''}" data-type="${p.type}"><a class="project-image" href="${base}portfolio/${p.slug}/">${image(p.thumbnail, base, p.title)}</a><div class="project-meta"><div>${label(typeNames[p.type] || p.type)}<h3><a href="${base}portfolio/${p.slug}/">${esc(p.title)}</a></h3></div><a class="icon-link" href="${base}portfolio/${p.slug}/" aria-label="${esc(p.title)} 자세히 보기">↗</a></div></article>`; }
function webCards(base) { const list = media.filter(ready); return list.length ? `<div class="web-grid portfolio-web" data-type="web">${list.map(m => `<article class="web-project">${slot(m, base)}${label('웹과 디지털 제작')}<h3>${esc(m.title)}</h3></article>`).join('')}</div>` : ''; }
const won = n => n.toLocaleString('ko-KR') + '원';
export function home(base = '') { return homePage(base); }

export function portfolioPage(base) { return `<section class="page-intro wrap" data-header="dark">${label('SELECTED WORK')}<h1>결과물로 보여드립니다.</h1><p class="lead">내용의 흐름, 정보의 배치, 브랜드의 인상까지.<br class="br-d"> 실제 작업에서 그 차이를 확인하세요.</p><p class="fineprint">공개에 동의한 자료만 소개합니다.</p></section><section class="wrap portfolio-section" data-header="dark"><div class="filter-row" role="group" aria-label="작업 유형">${[['all', '전체'], ['ir', 'IR과 발표자료'], ['company', '회사소개와 제안서'], ['print', '인쇄와 편집']].map(([id, name], i) => `<button data-filter="${id}" aria-pressed="${i === 0}">${name}</button>`).join('')}</div><div class="portfolio-grid">${portfolio.filter(p => p.publishApproved).map(p => card(p, base)).join('')}</div>${webCards(base)}<div class="filter-empty" hidden><p>등록된 작업이 없습니다.</p><button data-filter="all" class="button">전체 보기</button></div></section>${closingBand(base)}`; }
export function detailPage(p, base) { const list = portfolio.filter(x => x.publishApproved), i = list.indexOf(p); return `<section class="page-intro wrap" data-header="dark"><a class="text-link" href="${base}portfolio/?type=${p.type}">← ${typeNames[p.type]}</a><h1>${esc(p.title)}</h1><div class="detail-meta"><p>자료 종류 <strong>${typeNames[p.type]}</strong></p></div></section><section class="wrap detail-gallery" data-header="dark">${p.images.map((src, i) => `<button class="zoom-image" data-gallery="${p.id}" data-index="${i}" aria-label="${esc(p.title)} 이미지 ${i + 1} 확대">${image(src, base, p.title + ' 이미지 ' + (i + 1))}<span>전체 이미지 확대 ↗</span></button>`).join('')}<div class="detail-nav">${i > 0 ? button('이전 작업', base + 'portfolio/' + list[i - 1].slug + '/', true) : '<span></span>'}${i < list.length - 1 ? button('다음 작업', base + 'portfolio/' + list[i + 1].slug + '/', true) : ''}</div>${button('견적 문의', base + 'contact/')}</section>`; }
function estimate(base) { return `<section class="section wrap" id="estimate">${label('예상 제작 범위')}<h2>${title(['팀 수와 행사 일정을', '알려주세요.'])}</h2><div class="estimate-layout"><form id="demo-calculator"><label for="team-count">제작 팀 수</label><input id="team-count" name="teamCount" type="number" min="1" max="100" step="1" value="2" inputmode="numeric"><div id="team-pages"></div><p class="field-error" id="calculator-error" role="status"></p></form><div class="estimate-summary"><p>기본 제작비 기준</p><output id="demo-total" aria-live="polite">${won(demodayPrice.perTeam * 2)}</output><p id="demo-note">팀별 장수 미정 · 팀당 기본 제작비 기준</p><small>부가세 처리 기준은 견적서에서 안내합니다.<br>홈페이지·촬영 옵션은 별도입니다.</small>${button('이 범위로 기관 문의', base + 'contact/?kind=institution', false).replace('<a ', '<a id="demo-inquiry" ')}</div></div></section>`; }
// /demoday — rebuilt 2026-10-29 (owner: drop the video block, raise the page design). Same copy sources as the home card.
export function demodayPage(base) {
  const approved = demodayPrice.status === 'approved';
  const contact = base + 'contact/?kind=institution';
  const hosts = new Set(demodayHistory.flatMap(h => h.host.split(' · ')));
  const fig = (n, unit, label, short) => `<div><dt>${dm(label, short)}</dt><dd><b aria-label="${n}${unit}"><span data-count="${n}" aria-hidden="true">${n}</span></b><span aria-hidden="true">${unit}</span></dd></div>`;
  const ev = (h, hidden) => `<li${hidden ? ' aria-hidden="true"' : ''}><b>${h.year}</b><span>${esc(h.title.replace(/^20\d\d\s/, ''))}</span><small>${esc(h.host.replaceAll(' · ', ', '))}</small></li>`;
  return `<section class="dp-hero" data-header="dark">
 <div class="wrap dp-hero__grid">
  <div class="dp-hero__copy" data-reveal>
   ${label('DEMODAY & IR')}
   <h1>각 팀의 가능성을,<br>한 무대에서 선명하게.</h1>
   <p class="lead">${dm('팀마다 다른 사업과 브랜드를 이해하고, 행사 일정에 맞춰 IR 자료를 완성합니다.', '팀별 IR을 행사 일정에 맞춰 완성합니다.')}</p>
   <ul class="dp-chips"><li>팀별 PPT 제작</li><li>기관 취합 · 팀별 직접 소통</li><li>행사 홈페이지 별도</li></ul>
   <div class="dp-cta"><a class="dp-pill" href="${contact}">기관 견적 문의 ${arr}</a><a class="dp-link" href="#flow">진행 방식 보기 ${arr}</a></div>
  </div>
  <dl class="dp-figs" data-reveal>${fig(demodayHistory.length, '회', '함께 준비한 데모데이', '데모데이')}${fig(hosts.size, '곳', '함께한 기관', '함께한 기관')}${irConsulting.length ? fig(irConsulting.length, '개', 'IR 컨설팅 프로그램', 'IR 컨설팅') : ''}</dl>
 </div>
 <div class="dp-hist" role="group" aria-label="함께 준비한 데모데이">
  <div class="dp-hist__row"><ul class="dp-hist__track">${demodayHistory.map(h => ev(h, false)).join('')}${demodayHistory.map(h => ev(h, true)).join('')}</ul></div>
 </div>
</section>
<section class="dp-sec dp-steps" data-header="light">
 <div class="wrap">
  <div class="dp-head" data-reveal>${label('WHY 유별난PPT')}<h2>한 번 맡기면,<br>여기까지 진행합니다.</h2></div>
  <ol class="dp-steps__list">${ddSteps.map(([t, d, m], i) => `<li data-reveal style="--i:${i}"><span class="no">0${i + 1}</span><h3>${esc(t)}</h3><p>${dm(d, m)}</p></li>`).join('')}</ol>
 </div>
</section>
<section class="dp-sec dp-inc" data-header="light">
 <div class="wrap">
  <div class="dp-head" data-reveal>${label('기본 제공')}<h2>팀별 기획부터<br>일정과 납품까지.</h2><p class="lead">${dm('팀별 PPT 제작에 기본으로 포함되는 범위입니다.', '팀별 PPT 제작에 기본 포함됩니다.')}</p></div>
  <ol class="dp-inc__grid">${included.map((x, i) => `<li data-reveal style="--i:${i % 3}"><span class="no">0${i + 1}</span><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p><span class="out"><i>결과물</i>${esc(x.output)}</span></li>`).join('')}</ol>
 </div>
</section>
<section id="flow" class="dp-sec dp-flow" data-header="dark">
 <div class="wrap">
  <div class="dp-head" data-reveal>${label('진행 방식')}<h2>팀은 달라도,<br>진행은 한눈에.</h2></div>
  <ol class="dp-flow__line">${demodayFlow.map((x, i) => `<li data-reveal style="--i:${i}"><span class="no">0${i + 1}</span><b>${esc(x)}</b></li>`).join('')}</ol>
  <div class="dp-modes">
   <article data-reveal><p class="k">A</p><h3>기관이 한 번에 취합</h3><p>${dm('기관 담당자가 팀별 자료를 모아 전달하면, 일정과 피드백을 한 창구로 정리합니다.', '자료를 모아 주시면 한 창구로 정리합니다.')}</p></article>
   <article data-reveal style="--i:1"><p class="k">B</p><h3>팀별로 직접 소통</h3><p>${dm('각 팀과 직접 연락해 자료를 받고 피드백을 반영합니다. 기관에는 팀별 진행 상태를 정리해 공유합니다.', '팀과 직접 소통하고, 기관에 진행 상태를 공유합니다.')}</p></article>
  </div>
  <p class="dp-note">운영 방식에 맞춰 협의합니다.</p>
 </div>
</section>
<section class="dp-sec dp-price" data-header="light">
 <div class="wrap">
  <div class="dp-price__box" data-reveal>
   <div><p class="dp-price__k">PRICE</p><h2>${approved ? `팀당 ${manwon(demodayPrice.perTeam)}부터` : '가격은 별도 협의합니다.'}</h2><p>${dm('팀 수와 행사 일정, 팀별 장수를 알려 주시면 범위에 맞춰 견적을 안내합니다.', '팀 수·일정을 알려 주시면 견적을 안내합니다.')}</p></div>
   <a class="dp-pill" href="${contact}">기관 견적 문의 ${arr}</a>
  </div>
  ${webStrip(base, { heading: 'h2' })}
 </div>
</section>${approved ? estimate(base) : ''}${closingBand(base)}`;
}
export function webPage(base) {
  const cases = webShowcase.map(w => {
    const shot = `<picture><source media="(prefers-reduced-motion: reduce)" srcset="${base + w.poster}"><img src="${base + w.src}" alt="${esc(w.title)} 화면 미리보기" width="800" height="500" loading="lazy" decoding="async"></picture>`;
    return `<article class="web-case"><div class="web-case__frame"><span class="web-case__bar" aria-hidden="true"><i></i><i></i><i></i></span>${w.href ? `<a href="${esc(w.href)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">${shot}</a>` : shot}</div><div class="web-case__meta"><h3>${esc(w.title)}</h3><p>${esc(w.sub)}</p>${w.href ? `<a class="web-case__go" href="${esc(w.href)}" target="_blank" rel="noopener">사이트 바로가기 <span aria-hidden="true">↗</span><span class="sr-only"> (새 창)</span></a>` : ''}</div></article>`;
  }).join('');
  return `<section class="page-intro wrap">${label('WEB')}<h1>${title(['온라인으로 이어지는', '홈페이지.'])}</h1><p class="lead">회사·서비스 소개 페이지부터 행사 페이지까지. PC와 모바일에서 브랜드가 일관되게 보이도록 제작합니다.</p></section><section class="wrap web-cases">${cases}</section><section class="wrap web-notes"><ul><li>‘샘플’로 표시한 화면은 실제 고객 사이트가 아닌 제작 예시입니다.</li><li>PPT 제작과 구분해 작업 범위와 비용을 안내합니다.</li></ul></section><section class="wrap web-price" id="price">${webPricing(base, { heading: 'h2', tier: 'h3' })}</section>${closingBand(base)}`;
}
export function contactPage(base) { return contactSection(base, { page: true }); }
export function privacyPage() {
  if (site.privacyApproved && Array.isArray(site.privacyPolicy) && site.privacyPolicy.length) return '<section class="page-intro wrap"><h1>개인정보 처리 안내</h1></section><section class="wrap privacy-body">' + site.privacyPolicy.map(p => '<h2>' + esc(p.heading) + '</h2><p>' + esc(p.body) + '</p>').join('') + '</section>';
  return `<section class="page-intro wrap"><p class="eyebrow">개인정보 안내</p><h1>개인정보 처리 안내</h1><p class="lead">문의 접수 경로와 개인정보 처리 정책을 확정하고 있습니다.</p></section><section class="wrap privacy-body"><h2>현재 문의 화면의 처리 방식</h2><p>지금 문의 양식은 입력하신 내용을 이메일 앱에 채워 드리는 방식입니다. 홈페이지는 입력 내용을 서버로 보내거나 브라우저에 저장하지 않으며, 메일은 방문자의 이메일 앱에서 ${esc(site.email)}로 직접 보내집니다.</p><h2>문의 시 받는 항목</h2><p>이름, 회사·기관명, 이메일, 전화번호, 첨부 자료(링크)와 문의 내용입니다. 견적 상담과 회신에만 사용하며, 상담 종료 후 1년이 지나면 파기합니다.</p><h2>접수 연동 전 확정할 사항</h2><p>접수 서비스(처리 위탁), 이용 목적, 보관 기간, 처리 주체, 문의처를 확정한 뒤 이 페이지에 안내합니다. 포트폴리오 활용 동의는 필수 동의와 분리하며, 작업물은 별도의 공개 승인 후 사용합니다.</p></section>`;
}

// Link previews (KakaoTalk, Slack, Facebook): without these tags the scraper picked the first logo on the page (LH).
const shareDesc = 'IR · 회사소개서 · 발표자료 기획과 디자인. 줄글 메모부터 IR 초안까지, 전할 내용의 흐름을 잡고 목적에 맞는 디자인으로 완성합니다.';
export const ogImage = () => site.url + 'assets/og.png?v=2';
export function shareMeta(pageTitle, path = '') {
  const url = site.url + (path ? path.replace(/\/?$/, '/') : '');
  return `<link rel="canonical" href="${esc(url)}"><meta property="og:type" content="website"><meta property="og:site_name" content="유별난PPT"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="${esc(pageTitle)}"><meta property="og:description" content="${esc(shareDesc)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${esc(ogImage())}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="유별난PPT — IR · 회사소개서 · 제안서도, 유별나게."><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(pageTitle)}"><meta name="twitter:description" content="${esc(shareDesc)}"><meta name="twitter:image" content="${esc(ogImage())}">`;
}
const navItems = (base, homePage) => [['portfolio/', '작업 사례'], ['#pricing', '서비스와 가격'], ['demoday/', '기관·데모데이'], ['web/', '웹 제작']].map(([h, t]) => [h.startsWith('#') ? (homePage ? h : base + h) : base + h, t]);
export function layout(content, { title: pageTitle = '유별난PPT', base = '', homePage = false, contactPage = false, path = '' } = {}) {
  const contactHref = homePage || contactPage ? '#contact' : base + 'contact/';
  const nav = navItems(base, homePage);
  const tel = site.phone.replaceAll('-', '');
  const pageDesc = shareDesc;
  const darkPage = /^portfolio(\/|$)/.test(path); // 작업 사례 pages use the dark theme (owner request 2026-10-29)
  const noindex = process.env.NOINDEX === '1' ? '<meta name="robots" content="noindex">' : '';
  return `<!doctype html><html lang="ko" data-preview="true"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${esc(pageTitle)}</title><meta name="description" content="${esc(pageDesc)}">${shareMeta(pageTitle, path)}<link rel="icon" href="${base}assets/logo.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="${base}assets/icon-180.png">${noindex}<meta name="theme-color" content="#0b0c0f"><link rel="preload" href="${base}assets/fonts/Pretendard-Bold.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="${base}styles.css">${homePage ? `<link rel="stylesheet" href="${base}home.css">` : ''}<script>(function(d){if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('has-motion');setTimeout(function(){if(!window.__motion)d.classList.remove('has-motion')},2500)}})(document.documentElement)</script><script type="module" src="${base}app.mjs"></script></head><body data-base="${base}" class="${homePage ? 'is-home' : 'is-sub'}${contactPage ? ' is-contact' : ''}${darkPage ? ' is-dark' : ''}"><a class="skip-link" href="#main">본문으로 건너뛰기</a><header class="site-header"><div class="header-inner"><a class="brand" href="${base || './'}" aria-label="유별난PPT 홈"><img src="${base}assets/logo.svg" width="20" height="23" alt=""><span>유별난PPT</span></a><nav class="desktop-nav" aria-label="주 메뉴">${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav><a class="header-cta" href="${contactHref}">견적 문의</a><button class="menu-toggle" type="button" aria-controls="mobile-menu" aria-expanded="false"><span class="sr-only">메뉴 열기</span><i aria-hidden="true"></i><i aria-hidden="true"></i></button></div></header><dialog id="mobile-menu"><div class="mobile-menu-top"><strong>유별난PPT</strong><button data-close-menu aria-label="메뉴 닫기">닫기</button></div><nav aria-label="모바일 메뉴">${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="${contactHref}">견적 문의</a></nav><p class="mobile-menu-foot"><a href="tel:${tel}">${site.phone}</a><a href="${site.kakao}" target="_blank" rel="noopener">카카오톡 문의</a><a href="mailto:${site.email}">${site.email}</a></p></dialog><main id="main">${content}</main><footer class="site-footer"><div class="footer-inner"><div class="footer-top"><p class="footer-slogan">기획자의 시선과,<br>디자이너의 손으로.</p><div class="footer-info"><p>유별난PPT · 사업자등록번호 202-13-66345</p><p>전화 <a href="tel:${tel}">${site.phone}</a> · 팩스 ${site.fax}</p><p><a href="mailto:${site.email}">${site.email}</a></p><p><a href="${site.kakao}" target="_blank" rel="noopener">카카오톡 문의</a> · <a href="${base}privacy/">개인정보 안내</a></p></div><nav class="footer-nav" aria-label="하단 메뉴">${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="${contactHref}">견적 문의</a></nav></div><p class="footer-copy">© 2026 유별난PPT. </p></div></footer><dialog id="lightbox" aria-label="작업 이미지 확대"><div class="lightbox-toolbar"><span data-image-count></span><button data-zoom-mode>원본 크기 보기</button><button data-close-lightbox aria-label="이미지 닫기">닫기 ×</button></div><div class="lightbox-viewport"><img alt=""></div><div class="lightbox-nav"><button data-image-prev aria-label="이전 이미지">←</button><button data-image-next aria-label="다음 이미지">→</button></div></dialog>${contactPage ? '' : `<a class="qq-fab" href="${contactHref}">견적 문의</a>`}</body></html>`;
}
