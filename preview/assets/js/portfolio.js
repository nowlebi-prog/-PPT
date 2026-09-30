/* 포트폴리오 페이지: 카테고리별 그리드 + 스크롤 연동 사이드 내비 + 상세 팝업 */
(() => {
  const cats = window.PORTFOLIO_CATEGORIES;
  const items = window.PORTFOLIO;
  const esc = window.pfEsc;
  const nav = document.querySelector(".pf__nav ol");
  const main = document.querySelector(".pf__main");
  const modal = document.querySelector("#pf-modal");
  if (!nav || !main || !modal) return;

  nav.innerHTML = cats
    .map((c) => `<li><a href="#${c.id}" data-cat="${c.id}">${esc(c.label)}<small>${esc(c.en)}</small></a></li>`)
    .join("");

  main.innerHTML = cats
    .map((c) => {
      const list = items.filter((i) => i.category === c.id);
      const cards = list
        .map(
          (i, n) => `
        <button class="card reveal" data-delay="${n % 2}" type="button" data-id="${esc(i.id)}" aria-haspopup="dialog">
          <div class="card__thumb">${window.pfThumb(i)}</div>
          <div class="card__meta"><b>${esc(i.name)}</b><span>${esc(i.summary)} · ${esc(i.year)}</span></div>
        </button>`
        )
        .join("");
      return `
      <section class="pf__group" id="${c.id}">
        <h2>${esc(c.en)} <span class="tag">${list.length}</span></h2>
        <p>${esc(c.desc)}</p>
        <div class="pf__grid">${cards}</div>
      </section>`;
    })
    .join("");
  window.observeReveal?.(main);

  // 스크롤 위치에 따라 내비 활성화
  const links = [...nav.querySelectorAll("a")];
  const setActive = (id) => links.forEach((a) => a.classList.toggle("is-active", a.dataset.cat === id));
  setActive(cats[0].id);
  const spy = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), {
    rootMargin: "-40% 0px -55% 0px",
  });
  main.querySelectorAll(".pf__group").forEach((g) => spy.observe(g));

  // 상세 팝업
  const content = modal.querySelector(".modal__content");
  let lastFocus = null;

  const open = (id, push = true) => {
    const i = items.find((x) => x.id === id);
    if (!i) return;
    const cat = window.pfCategory(i);
    const slides = i.slides.length
      ? `<div class="modal__slides">${i.slides.map((s, n) => `<img src="${esc(s)}" alt="${esc(i.name)} 슬라이드 ${n + 1}" loading="lazy">`).join("")}</div>`
      : `<div class="modal__cta"><p>이 프로젝트와 비슷한 작업이 필요하신가요?</p><div class="modal__acts"><button class="btn btn--ghost btn--sm" type="button" data-share="${esc(i.id)}">링크 공유</button><a class="btn btn--primary btn--sm" href="index.html?ref=${encodeURIComponent(i.id)}#contact">이 작업처럼 문의하기</a></div></div>`;
    content.innerHTML = `
      <div class="modal__hero">${window.pfThumb(i, true)}</div>
      <div class="modal__body">
        <span class="tag">${esc(cat.en)}</span>
        <h2 id="pf-modal-title">${esc(i.name)}</h2>
        <p>${esc(i.summary)}</p>
        <dl class="modal__facts">
          <div><dt>Client</dt><dd>${esc(i.name)}</dd></div>
          <div><dt>Category</dt><dd>${esc(cat.label)}</dd></div>
          <div><dt>Year</dt><dd>${esc(i.year)}</dd></div>
        </dl>
        ${slides}
        ${i.slides.length ? `<div class="modal__cta" style="margin-top:24px"><p>이 프로젝트와 비슷한 작업이 필요하신가요?</p><div class="modal__acts"><button class="btn btn--ghost btn--sm" type="button" data-share="${esc(i.id)}">링크 공유</button><a class="btn btn--primary btn--sm" href="index.html?ref=${encodeURIComponent(i.id)}#contact">이 작업처럼 문의하기</a></div></div>` : ""}
      </div>`;
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
    content.scrollTop = 0;
    modal.querySelector(".modal__close").focus();
    if (push) history.pushState({ pf: id }, "", `?p=${encodeURIComponent(id)}${location.hash}`);
  };

  const close = (push = true) => {
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    lastFocus?.focus();
    if (push) history.pushState({}, "", location.pathname + location.hash);
  };

  main.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) open(card.dataset.id);
  });
  modal.addEventListener("click", (e) => e.target.closest("[data-close]") && close());
  document.addEventListener("keydown", (e) => e.key === "Escape" && close());
  window.addEventListener("popstate", () => {
    const id = new URLSearchParams(location.search).get("p");
    id ? open(id, false) : close(false);
  });

  const initial = new URLSearchParams(location.search).get("p");
  if (initial) open(initial, false);
  if (location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
})();
