/* ==========================================================
   유별난PPT - 모바일 전용 보조 스크립트
   (옆으로 넘기는 목록의 탭·점 표시 · 질문 더 보기 · 문의서 추가 정보 접기 · 헤더 자동 숨김)
   ========================================================== */
(() => {
  const mq = matchMedia("(max-width: 760px)");
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- 1. 옆으로 넘기는 목록: 탭 또는 점 표시 ---------- */
  const rail = (el, labels = null) => {
    if (!el) return;
    const items = [...el.children].filter((c) => c.nodeType === 1);
    if (items.length < 2) return;
    const nav = document.createElement("div");
    nav.className = `m-nav ${labels ? "m-nav--tabs" : "m-nav--dots"}`;
    nav.innerHTML = items
      .map((_, i) => `<button type="button" aria-label="${labels ? labels[i] : `${i + 1}번째 항목 보기`}">${labels ? labels[i] : ""}</button>`)
      .join("");
    labels ? el.before(nav) : el.after(nav);
    const btns = [...nav.children];
    const pad = () => parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const index = () => {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 4) return items.length - 1;
      let best = 0, dist = Infinity;
      items.forEach((it, i) => {
        const d = Math.abs(it.offsetLeft - pad() - el.scrollLeft);
        if (d < dist) { dist = d; best = i; }
      });
      return best;
    };
    const mark = () => {
      const i = index();
      btns.forEach((b, n) => {
        b.classList.toggle("is-active", n === i);
        b.setAttribute("aria-current", n === i ? "true" : "false");
      });
    };
    nav.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      const it = items[btns.indexOf(b)];
      el.scrollTo({ left: it.offsetLeft - pad(), behavior: rm ? "auto" : "smooth" });
    });
    let raf = 0;
    el.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(mark); }, { passive: true });
    addEventListener("resize", mark);
    mark();
  };

  rail($(".why__items"));
  const svc = $(".svc-rail");
  if (svc) rail(svc, [...svc.children].map((a) => a.dataset.tab || a.querySelector("h3")?.textContent.trim() || ""));
  rail($("[data-pf-preview]"));
  rail($(".process"));

  /* ---------- 2. 자주 묻는 질문: 모바일에서는 4개만 먼저 ---------- */
  $$(".faq").forEach((f) => {
    const list = $$("details", f);
    if (list.length <= 4) return;
    f.classList.add("m-fold");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "m-more";
    const label = () => (b.textContent = f.classList.contains("is-open") ? "접기" : `질문 ${list.length - 4}개 더 보기`);
    b.addEventListener("click", () => { f.classList.toggle("is-open"); label(); });
    label();
    f.after(b);
  });

  /* ---------- 3. 문의서: 추가 정보(선택)는 접어 두고, 값이 있으면 펼침 ---------- */
  const fold = $("[data-fold]");
  if (fold) {
    const btn = $(".form__more-btn", fold);
    const set = (open) => { fold.classList.toggle("is-open", open); btn?.setAttribute("aria-expanded", String(open)); };
    btn?.addEventListener("click", () => set(!fold.classList.contains("is-open")));
    const filled = () => $$("input, select, textarea", fold).some((el) => (el.type === "checkbox" || el.type === "radio" ? el.checked : el.value.trim()));
    const form = fold.closest("form");
    ["input", "change"].forEach((ev) => form?.addEventListener(ev, () => filled() && set(true)));
    if (filled()) set(true);
  }

  /* ---------- 3-1. 작업 과정 타임라인: 화면에 들어오면 단계가 차례로 켜짐 ---------- */
  const steps = $$(".pv-text");
  if (steps.length) {
    if (rm || !("IntersectionObserver" in window)) steps.forEach((el) => el.classList.add("is-lit"));
    else {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-lit"); io.unobserve(e.target); } }), { threshold: 0.5 });
      steps.forEach((el) => io.observe(el));
    }
  }

  /* ---------- 4. 헤더: 아래로 스크롤하면 숨기고, 위로 올리면 다시 보임 ---------- */
  const header = $(".header");
  if (header && !$(".pf__nav")) {
    let last = scrollY, acc = 0;
    addEventListener("scroll", () => {
      const y = scrollY, dy = y - last;
      last = y;
      if (!mq.matches || header.classList.contains("is-open") || y < 200) {
        header.classList.remove("m-hide");
        acc = 0;
        return;
      }
      acc = Math.sign(dy) === Math.sign(acc) ? acc + dy : dy;
      if (acc > 24) header.classList.add("m-hide");
      else if (acc < -24) header.classList.remove("m-hide");
    }, { passive: true });
  }
})();
