/* 포트폴리오 페이지: 카테고리별 그리드 + 스크롤 연동 사이드 내비 + 상세 팝업 */
(() => {
  const cats = window.PORTFOLIO_CATEGORIES;
  const items = window.PORTFOLIO;
  const nav = document.querySelector(".pf__nav ol");
  const main = document.querySelector(".pf__main");
  const modal = document.querySelector("#pf-modal");
  if (!nav || !main || !modal) return;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // 이미지가 없을 때 쓰는 임시 그래픽 (프로젝트마다 색이 조금씩 다름)
  const hue = (str) => [...str].reduce((a, c) => a + c.charCodeAt(0), 0) % 40;
  const placeholder = (item, label = item.name) => {
    const h = 205 + hue(item.id);
    return `<div class="ph" style="background:linear-gradient(135deg,hsl(${h} 60% 22%),hsl(${h + 15} 45% 9%) 70%)">${esc(label)}</div>`;
  };
  const img = (src, alt) => `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;

  // 사이드 내비 + 그룹 렌더
  nav.innerHTML = cats
    .map((c) => `<li><a href="#${c.id}" data-cat="${c.id}">${esc(c.label)}<small>${esc(c.en)}</small></a></li>`)
    .join("");

  main.innerHTML = cats
    .map((c) => {
      const list = items.filter((i) => i.category === c.id);
      const cards = list
        .map(
          (i) => `
        <button class="card reveal" type="button" data-id="${esc(i.id)}" aria-haspopup="dialog">
          <div class="card__thumb">${i.thumb ? img(i.thumb, i.name) : placeholder(i)}</div>
          <div class="card__meta"><b>${esc(i.name)}</b><span>${esc(i.summary)} · ${esc(i.year)}</span></div>
        </button>`
        )
        .join("");
      return `
      <section class="pf__group" id="${c.id}">
        <h2>${esc(c.en)} <span class="tag">${list.length}</span></h2>
        <p>${esc(c.desc)}</p>
        ${list.length ? `<div class="pf__grid">${cards}</div>` : `<div class="pf__empty">곧 업데이트됩니다.</div>`}
      </section>`;
    })
    .join("");

  // 새로 생긴 .reveal 요소 표시
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("is-in"), io.unobserve(e.target))),
    { threshold: 0.1 }
  );
  main.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // 스크롤 위치에 따라 내비 활성화
  const links = [...nav.querySelectorAll("a")];
  const setActive = (id) => links.forEach((a) => a.classList.toggle("is-active", a.dataset.cat === id));
  setActive(cats[0].id);
  const spy = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
    { rootMargin: "-40% 0px -55% 0px" }
  );
  main.querySelectorAll(".pf__group").forEach((g) => spy.observe(g));

  // 상세 팝업
  const panel = modal.querySelector(".modal__content");
  let lastFocus = null;

  const open = (id, push = true) => {
    const i = items.find((x) => x.id === id);
    if (!i) return;
    const cat = cats.find((c) => c.id === i.category);
    const cover = i.cover || i.thumb;
    const slides = i.slides.length ? i.slides : [1, 2, 3, 4];
    panel.innerHTML = `
      <div class="modal__hero">${cover ? img(cover, i.name) : placeholder(i)}</div>
      <div class="modal__body">
        <span class="tag">${esc(cat.en)}</span>
        <h2 id="pf-modal-title">${esc(i.name)}</h2>
        <p>${esc(i.summary)}</p>
        <dl class="modal__facts">
          <div><dt>Client</dt><dd>${esc(i.name)}</dd></div>
          <div><dt>Category</dt><dd>${esc(cat.label)}</dd></div>
          <div><dt>Year</dt><dd>${esc(i.year)}</dd></div>
        </dl>
        <div class="modal__slides">
          ${slides.map((s, n) => (typeof s === "string" ? img(s, `${i.name} 슬라이드 ${n + 1}`) : placeholder(i, `슬라이드 ${s}`))).join("")}
        </div>
      </div>`;
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
    panel.scrollTop = 0;
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
  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  window.addEventListener("popstate", () => {
    const id = new URLSearchParams(location.search).get("p");
    id ? open(id, false) : close(false);
  });

  // ?p=프로젝트id 로 바로 열기 (공유용 링크)
  const initial = new URLSearchParams(location.search).get("p");
  if (initial) open(initial, false);
  // #ir / #proposal / #profile 로 들어오면 해당 영역으로 이동
  if (location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
})();
