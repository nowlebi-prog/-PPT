/* ==========================================================
   유별난PPT - 모션 (스크롤 연동)
   ========================================================== */
(() => {
  const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const mobile = () => innerWidth <= 760;

  /* 1. 헤드라인 줄 단위 등장 (<br> 기준. <br class="pc"> 같은 반응형 줄바꿈은 유지) */
  $$("[data-split]").forEach((el) => {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map((l, i) => `<span class="ln"><span class="ln__in" style="transition-delay:${(i * 0.1).toFixed(2)}s">${l.trim()}</span></span>`).join("");
  });
  window.observeReveal?.();

  /* 2. 제작 역량: 스크롤 위치에 맞춰 장면 전환 */
  const why = $(".why");
  if (why) {
    const items = $$(".why__item", why), scenes = $$(".scene", why), dots = $$(".why__dots button", why);
    let cur = -1;
    const set = (i) => {
      if (i === cur) return;
      cur = i;
      [items, scenes, dots].forEach((list) => list.forEach((el, n) => el.classList.toggle("is-active", n === i)));
    };
    set(0);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && set(+e.target.dataset.step)), { rootMargin: "-45% 0px -45% 0px" });
    items.forEach((el) => io.observe(el));
    dots.forEach((d, n) => d.addEventListener("click", () => {
      const r = items[n].getBoundingClientRect();
      scrollTo({ top: scrollY + r.top + r.height / 2 - innerHeight / 2, behavior: rm ? "auto" : "smooth" });
    }));
  }

  if (rm) return;

  /* 3. 스크롤 루프 */
  const progress = document.createElement("div");
  progress.className = "progress";
  document.body.appendChild(progress);

  const heroText = $("[data-hero-text]");
  const heroVis = $("[data-tf]");
  const drifts = $$("[data-drift]");
  const pars = $$("[data-parallax]");
  const cards = $$("[data-stack] .svc-card");
  const steps = $("[data-steps]");
  const stepEls = steps ? $$(".step", steps) : [];
  const gallery = $("[data-gallery]");
  const track = gallery && $(".gallery__track", gallery);

  // 가로 스크롤 갤러리: 섹션 높이를 트랙 길이만큼 늘림
  let galDist = 0;
  const sizeGallery = () => {
    if (!gallery || !track) return;
    if (mobile()) { gallery.style.height = ""; galDist = 0; return; }
    galDist = Math.max(0, track.scrollWidth - innerWidth);
    gallery.style.height = `${innerHeight + galDist}px`;
  };

  // 큰 글자 밴드
  const rows = $$(".kinetic__row").map((row) => { row.innerHTML += row.innerHTML; return { row, x: 0, half: 0, sp: +row.dataset.speed || 1 }; });
  const measure = () => { rows.forEach((k) => (k.half = k.row.scrollWidth / 2)); sizeGallery(); };
  measure();
  addEventListener("resize", measure);
  addEventListener("load", measure);
  document.fonts?.ready.then(measure);

  let lastY = -1, vel = 0, dir = 1;
  const frame = () => {
    const y = scrollY, h = innerHeight;
    const dy = lastY < 0 ? 0 : y - lastY;
    const moved = y !== lastY;
    lastY = y;
    if (dy) dir = dy > 0 ? 1 : -1;
    vel = lerp(vel, Math.min(Math.abs(dy), 90), 0.12);

    if (moved) {
      const max = document.documentElement.scrollHeight - h;
      progress.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;

      // 첫 화면: 글자는 위로 빠지고, 비주얼은 천천히
      if (y < h * 1.2) {
        if (heroText) { heroText.style.translate = `0 ${(y * 0.3).toFixed(1)}px`; heroText.style.opacity = clamp(1 - y / (h * 0.8), 0, 1).toFixed(3); }
        if (heroVis) heroVis.style.translate = `0 ${(y * 0.12).toFixed(1)}px`;
      }
      // 고민 목록: 스크롤할수록 오른쪽으로 흐름
      for (const el of drifts) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -150 || r.top > h + 150) continue;
        const p = clamp((h - r.top) / (h + r.height), 0, 1);
        el.style.translate = `${((p - 0.35) * +el.dataset.drift * (mobile() ? 0.35 : 1)).toFixed(1)}px 0`;
      }
      for (const el of pars) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > h + 200) continue;
        el.style.translate = `0 ${(-(r.top + r.height / 2 - h / 2) * +el.dataset.parallax).toFixed(1)}px`;
      }
      // 서비스 카드: 다음 카드가 덮으면 뒤 카드는 작아지고 어두워짐
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const r = next.getBoundingClientRect(), top = c.getBoundingClientRect().top;
        const p = clamp(1 - (r.top - top) / (c.offsetHeight || 1), 0, 1);
        c.style.transform = `scale(${(1 - p * 0.06).toFixed(4)})`;
        c.style.filter = `brightness(${(1 - p * 0.35).toFixed(3)})`;
      });
      // 작업 과정: 선이 채워지고 단계가 켜짐
      if (steps) {
        const r = steps.getBoundingClientRect();
        const p = clamp((h * 0.75 - r.top) / (r.height + h * 0.2), 0, 1);
        steps.style.setProperty("--p", p.toFixed(3));
        stepEls.forEach((s, i) => s.classList.toggle("is-on", p >= (i / stepEls.length) * 0.92));
      }
      // 포트폴리오: 세로 스크롤 → 가로 이동
      if (gallery && galDist) {
        const r = gallery.getBoundingClientRect();
        const p = clamp(-r.top / (gallery.offsetHeight - h), 0, 1);
        track.style.transform = `translate3d(${(-p * galDist).toFixed(1)}px,0,0)`;
      }
    }

    for (const k of rows) {
      if (!k.half) continue;
      k.x -= (0.8 + vel * 0.5) * k.sp * dir;
      if (k.x <= -k.half) k.x += k.half;
      if (k.x > 0) k.x -= k.half;
      k.row.style.transform = `translate3d(${k.x.toFixed(1)}px,0,0)`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
