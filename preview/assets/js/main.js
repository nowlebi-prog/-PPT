/* ==========================================================
   유별난PPT - 공통 스크립트
   ========================================================== */

// 문의 폼 전송 주소 (Formspree, Getform, 자체 API 등)
// 비워두면 방문자의 메일 앱으로 youstar_ppt@naver.com 앞 메일이 작성됩니다.
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "youstar_ppt@naver.com";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 사이트 장식용 샘플 슬라이드 (assets/img/slides/*.svg)
const SLIDES = [
  "ir-cover", "prop-cover", "prof-cover", "ir-traction", "prop-process", "prof-vision",
  "ir-market", "demo-day", "prop-schedule", "prof-history", "ir-bm", "edu-guide",
  "prop-org", "prof-clients", "ir-team", "annual-report",
];
const slideSrc = (name) => `assets/img/slides/${name}.svg`;
const slideImg = (name, lazy = true) =>
  `<img src="${slideSrc(name)}" alt="" ${lazy ? 'loading="lazy"' : ""} decoding="async">`;
const pickSlides = (offset, count) => Array.from({ length: count }, (_, i) => SLIDES[(offset + i) % SLIDES.length]);

/* ---------- Hero 슬라이드 벽 ---------- */
document.querySelectorAll("[data-wall]").forEach((wall) => {
  const cols = +wall.dataset.wall || 6;
  wall.innerHTML = Array.from({ length: cols }, (_, c) => {
    const list = pickSlides(c * 3, 6);
    return `<div class="wall__col">${[...list, ...list].map((n) => slideImg(n, false)).join("")}</div>`;
  }).join("");
});

/* ---------- 가로로 흐르는 슬라이드 릴 ---------- */
document.querySelectorAll("[data-reel]").forEach((row) => {
  const list = pickSlides(+row.dataset.reel || 0, 8);
  row.innerHTML = [...list, ...list].map((n) => slideImg(n)).join("");
  row.querySelectorAll("img").forEach((img, i) => i >= list.length && img.setAttribute("aria-hidden", "true"));
});

/* ---------- 고객사 마퀴 (끊김 없는 반복을 위해 복제) ---------- */
document.querySelectorAll(".marquee__row").forEach((row) => {
  const n = row.children.length;
  row.innerHTML += row.innerHTML;
  [...row.children].forEach((c, i) => i >= n && c.setAttribute("aria-hidden", "true"));
});

/* ---------- 메인 페이지 포트폴리오 미리보기 ---------- */
(() => {
  const box = document.querySelector("[data-pf-preview]");
  if (!box || !window.PORTFOLIO) return;
  const esc = window.pfEsc;
  // 카테고리별로 2개씩 골라 섞어서 보여줌
  const byCat = window.PORTFOLIO_CATEGORIES.map((c) => window.PORTFOLIO.filter((p) => p.category === c.id).slice(0, 2));
  const picks = [0, 1].flatMap((i) => byCat.map((list) => list[i])).filter(Boolean);
  box.innerHTML = picks
    .map(
      (p, i) => `
    <a class="card reveal" data-delay="${i % 3}" href="portfolio.html?p=${encodeURIComponent(p.id)}">
      <div class="card__thumb">${window.pfThumb(p)}</div>
      <div class="card__meta"><b>${esc(p.name)}</b><span>${esc(window.pfCategory(p).en)} · ${esc(p.year)}</span></div>
    </a>`
    )
    .join("");
})();

/* ---------- Header ---------- */
(() => {
  const header = document.querySelector(".header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = header.querySelector(".nav-toggle");
  const setOpen = (open) => {
    header.classList.toggle("is-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    toggle?.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  };
  toggle?.addEventListener("click", () => setOpen(!header.classList.contains("is-open")));
  header.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
})();

/* ---------- Reveal on scroll ---------- */
const revealIO =
  "IntersectionObserver" in window && !reduceMotion
    ? new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              revealIO.unobserve(e.target);
            }
          }),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      )
    : null;
window.observeReveal = (root = document) =>
  root.querySelectorAll(".reveal:not(.is-in)").forEach((el) => (revealIO ? revealIO.observe(el) : el.classList.add("is-in")));
window.observeReveal();

/* ---------- 숫자 카운트업 ---------- */
(() => {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;
  const run = (el) => {
    const end = parseFloat(el.dataset.count);
    const dec = +(el.dataset.decimals || 0);
    if (reduceMotion) return (el.textContent = end.toFixed(dec));
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1800);
      el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (run(e.target), io.unobserve(e.target))),
    { threshold: 0.4 }
  );
  els.forEach((el) => io.observe(el));
})();

/* ---------- Hero 영상 (파일이 있을 때만) ---------- */
(() => {
  const video = document.querySelector(".hero__video");
  if (!video) return;
  if (reduceMotion) return video.remove();
  const sources = [...video.querySelectorAll("source")];
  let failed = 0;
  // 영상 파일이 아직 없으면 조용히 제거하고 배경 이미지 + 애니메이션만 사용
  sources.forEach((s) => s.addEventListener("error", () => ++failed === sources.length && video.remove()));
  video.addEventListener("error", () => video.remove());
})();

/* ---------- Starfield ---------- */
(() => {
  const canvas = document.querySelector("#stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, stars = [], shooting = null, raf;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round((w * h) / 5200) }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + 0.2, a: Math.random() * 0.6 + 0.25,
      tw: Math.random() * 0.02 + 0.004, ph: Math.random() * Math.PI * 2, vy: Math.random() * 0.05 + 0.01, blue: Math.random() < 0.2,
    }));
  };

  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.y -= s.vy;
      if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
      const alpha = s.a * (0.6 + 0.4 * Math.sin(t * s.tw + s.ph));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.blue ? `rgba(140,175,255,${alpha})` : `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }
    if (!shooting && Math.random() < 0.004) shooting = { x: Math.random() * w * 0.7 + w * 0.3, y: Math.random() * h * 0.4, life: 0 };
    if (shooting) {
      shooting.life += 1;
      const len = Math.min(140, shooting.life * 6);
      const sx = shooting.x - shooting.life * 7, sy = shooting.y + shooting.life * 3.5;
      const fade = Math.max(0, 1 - shooting.life / 50);
      const grad = ctx.createLinearGradient(sx, sy, sx + len, sy - len / 2);
      grad.addColorStop(0, `rgba(255,255,255,${0.85 * fade})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + len, sy - len / 2);
      ctx.stroke();
      if (shooting.life > 50) shooting = null;
    }
    raf = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize);
  if (reduceMotion) {
    draw(0);
    cancelAnimationFrame(raf);
    return;
  }
  raf = requestAnimationFrame(draw);
  new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) raf = requestAnimationFrame(draw);
  }).observe(canvas);
})();

/* ---------- Before / After 비교 슬라이더 ---------- */
document.querySelectorAll(".ba").forEach((ba) => {
  const range = ba.querySelector(".ba__range");
  const set = (v) => ba.style.setProperty("--pos", `${v}%`);
  range.addEventListener("input", () => set(range.value));
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  // 처음 보일 때 한 번 좌우로 움직여서 드래그할 수 있다는 걸 알려줌
  let touched = false;
  ["pointerdown", "keydown", "touchstart"].forEach((ev) => range.addEventListener(ev, () => (touched = true), { passive: true }));
  const anim = (from, to, dur) =>
    new Promise((done) => {
      const t0 = performance.now();
      const step = (t) => {
        if (touched) return done();
        const p = Math.min(1, (t - t0) / dur);
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const v = from + (to - from) * e;
        set(v);
        range.value = v;
        p < 1 ? requestAnimationFrame(step) : done();
      };
      requestAnimationFrame(step);
    });
  const io = new IntersectionObserver(
    async ([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      await anim(50, 22, 800);
      await anim(22, 78, 1200);
      await anim(78, 50, 800);
    },
    { threshold: 0.6 }
  );
  io.observe(ba);
});

/* ---------- 작업 종류 목록: 마우스를 올리면 미리보기 ---------- */
(() => {
  const list = document.querySelector(".works__list");
  const pv = document.querySelector(".works__preview");
  if (!list || !pv) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return pv.remove();
  list.addEventListener("pointermove", (e) => {
    pv.style.left = `${e.clientX}px`;
    pv.style.top = `${e.clientY}px`;
    pv.classList.toggle("is-left", e.clientX + 400 > window.innerWidth);
  });
  list.querySelectorAll("li[data-img]").forEach((li) => {
    li.addEventListener("pointerenter", () => {
      pv.src = slideSrc(li.dataset.img);
      pv.classList.add("is-on");
    });
    li.addEventListener("pointerleave", () => pv.classList.remove("is-on"));
  });
})();

/* ---------- Review slider ---------- */
(() => {
  const track = document.querySelector(".reviews__track");
  if (!track) return;
  const prev = document.querySelector("[data-review-prev]");
  const next = document.querySelector("[data-review-next]");
  const step = () => track.querySelector(".review").offsetWidth + 20;
  const update = () => {
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
  next.addEventListener("click", () => track.scrollBy({ left: step() }));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();

/* ---------- Contact form ---------- */
(() => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const status = form.querySelector(".form__status");
  const picked = (name) => [...form.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => i.value).join(", ") || "-";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form__status";
    status.textContent = "";
    if (!form.reportValidity()) return;
    const d = Object.fromEntries(new FormData(form));
    d.ready = picked("ready");
    d.need = picked("need");
    d.nda = d.nda ? "예" : "아니요";

    if (FORM_ENDPOINT) {
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.textContent = "상담 요청이 접수되었습니다. 빠르게 연락드릴게요.";
        status.classList.add("ok");
      } catch {
        status.textContent = `전송에 실패했습니다. ${CONTACT_EMAIL} 로 직접 보내주세요.`;
        status.classList.add("err");
      } finally {
        btn.disabled = false;
      }
      return;
    }

    const body = [
      `성함: ${d.name}`, `회사명: ${d.company}`, `이메일: ${d.email}`, `연락처: ${d.phone}`,
      `발표 목적: ${d.goal || "-"}`, `희망 납기: ${d.due || "-"}`, `예상 페이지 수: ${d.pages || "-"}`, `예산 범위: ${d.budget || "-"}`,
      `준비된 자료: ${d.ready}`, `필요한 작업: ${d.need}`, `NDA 사전 체결 요청: ${d.nda}`, `자료 공유 링크: ${d.link || "-"}`,
      "", "[문의 내용]", d.message,
    ].join("\n");
    const subject = `[홈페이지 상담 요청] ${d.company}${d.goal ? " / " + d.goal : ""}`;
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "메일 앱이 열리면 내용을 확인하고 전송해 주세요.";
    status.classList.add("ok");
  });
})();

document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

/* ---------- 첫 화면 큰 발표 화면: 받은 초안 → 막대 전환 → 완성본 반복 ---------- */
(() => {
  const sc = document.querySelector("[data-showcase]");
  if (!sc) return;
  const before = sc.querySelector(".s-before"), after = sc.querySelector(".s-after");
  const bars = sc.querySelector(".bars"), tag = sc.querySelector("[data-sc-tag]"), label = sc.querySelector("[data-sc-label]");
  const pairs = [
    ["assets/img/slides/before.svg", "assets/img/slides/after.svg"],
    ["assets/img/slides/tech-before.svg", "assets/img/slides/prop-process.svg"],
  ];
  const state = (isAfter) => {
    sc.classList.toggle("is-after", isAfter);
    tag.textContent = isAfter ? "AFTER · 유별난PPT 완성본" : "BEFORE · 받은 초안";
    label.textContent = isAfter ? "완성본" : "받은 초안";
  };
  if (reduceMotion) return state(true);
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const sweep = async (fn) => {
    bars.classList.remove("is-out"); bars.classList.add("is-in");
    await pause(600); fn();
    bars.classList.remove("is-in"); bars.classList.add("is-out");
    await pause(560); bars.classList.remove("is-out");
  };
  let i = 0;
  (async function loop() {
    await pause(2400);
    await sweep(() => state(true));
    await pause(3600);
    i = (i + 1) % pairs.length;
    await sweep(() => { before.src = pairs[i][0]; after.src = pairs[i][1]; state(false); });
    loop();
  })();
})();
