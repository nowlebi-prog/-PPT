/* ==========================================================
   유별난PPT - 공통 스크립트
   ========================================================== */

// 문의 폼 전송 주소 (Formspree 등). 비워두면 방문자의 메일 앱으로 작성됩니다.
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "youstar_ppt@naver.com";
// 후기 원문 페이지 주소 (크몽 · 숨고 등). 넣으면 후기 아래에 '원문 보기' 링크가 생깁니다.
const REVIEW_SOURCE_URL = "";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const loadable = (src) =>
  new Promise((ok) => {
    const img = new Image();
    img.onload = () => ok(true);
    img.onerror = () => ok(false);
    img.src = src;
  });

/* ---------- 마퀴(로고 · 후기): 끊김 없게 복제 ---------- */
document.querySelectorAll(".marquee__row, .rv-row").forEach((row) => {
  const n = row.children.length;
  row.innerHTML += row.innerHTML;
  [...row.children].forEach((c, i) => i >= n && c.setAttribute("aria-hidden", "true"));
});

/* ---------- 메인 포트폴리오 가로 갤러리 ---------- */
(() => {
  const box = document.querySelector("[data-pf-preview]");
  if (!box || !window.PORTFOLIO) return;
  const esc = window.pfEsc;
  const byCat = window.PORTFOLIO_CATEGORIES.map((c) => window.PORTFOLIO.filter((p) => p.category === c.id));
  const picks = [0, 1, 2].flatMap((i) => byCat.map((l) => l[i])).filter(Boolean).slice(0, 8);
  box.innerHTML = picks
    .map(
      (p) => `
    <a class="card" href="portfolio.html?p=${encodeURIComponent(p.id)}">
      <div class="card__thumb">${window.pfThumb(p)}</div>
      <div class="card__meta"><b>${esc(p.name)}</b><span>${esc(window.pfCategory(p).label)} · ${esc(p.year)}</span></div>
    </a>`
    )
    .join("");
})();

/* ---------- 후기 원문 링크 ---------- */
(() => {
  const note = document.querySelector("[data-review-note]");
  if (note && REVIEW_SOURCE_URL) note.insertAdjacentHTML("beforeend", ` <a href="${REVIEW_SOURCE_URL}" target="_blank" rel="noopener">후기 원문 보기 ↗</a>`);
})();

/* ---------- Header: 스크롤 내리면 숨고, 올리면 나타남 ---------- */
(() => {
  const header = document.querySelector(".header");
  if (!header) return;
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle("is-scrolled", y > 20);
    if (!header.classList.contains("is-open")) header.classList.toggle("is-hidden", y > lastY && y > 400);
    lastY = y;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  const toggle = header.querySelector(".nav-toggle");
  const setOpen = (open) => {
    header.classList.toggle("is-open", open);
    header.classList.remove("is-hidden");
    toggle?.setAttribute("aria-expanded", String(open));
    toggle?.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  };
  toggle?.addEventListener("click", () => setOpen(!header.classList.contains("is-open")));
  header.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false));
})();

/* ---------- Reveal ---------- */
const revealIO =
  "IntersectionObserver" in window && !reduceMotion
    ? new IntersectionObserver(
        (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("is-in"), revealIO.unobserve(e.target))),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      )
    : null;
window.observeReveal = (root = document) =>
  root.querySelectorAll(".reveal:not(.is-in)").forEach((el) => (revealIO ? revealIO.observe(el) : el.classList.add("is-in")));

/* ---------- 숫자 카운트업 (최종 숫자는 HTML에 그대로 있음) ---------- */
(() => {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length || reduceMotion || !("IntersectionObserver" in window)) return;
  const run = (el) => {
    const end = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0), t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 1600);
      el.textContent = (end * (1 - Math.pow(1 - p, 4))).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = end.toFixed(dec);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (run(e.target), io.unobserve(e.target))), { threshold: 0.5 });
  els.forEach((el) => io.observe(el));
})();

/* ---------- 별 (첫 화면) ---------- */
(() => {
  const canvas = document.querySelector("#stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, stars = [], raf;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round((w * h) / 9000) }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.1 + 0.2, a: Math.random() * 0.55 + 0.2,
      tw: Math.random() * 0.02 + 0.004, ph: Math.random() * 6.28, vy: Math.random() * 0.04 + 0.01,
    }));
  };
  const draw = (t) => {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.y -= s.vy;
      if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
      ctx.globalAlpha = s.a * (0.6 + 0.4 * Math.sin(t * s.tw + s.ph));
      ctx.fillStyle = "#fff";
      ctx.fillRect(s.x, s.y, s.r * 1.6, s.r * 1.6);
    }
    raf = requestAnimationFrame(draw);
  };
  resize();
  addEventListener("resize", resize);
  if (reduceMotion) return draw(0), cancelAnimationFrame(raf);
  raf = requestAnimationFrame(draw);
  new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting) raf = requestAnimationFrame(draw); }).observe(canvas);
})();

/* ---------- 비교 슬라이더 ---------- */
const initBA = (ba) => {
  const range = ba.querySelector(".ba__range");
  const set = (v) => ba.style.setProperty("--pos", `${v}%`);
  range.addEventListener("input", () => set(range.value));
  ba.setPos = (v) => { set(v); range.value = v; };
  let touched = false;
  ["pointerdown", "keydown", "touchstart"].forEach((ev) => range.addEventListener(ev, () => { touched = true; ba.dispatchEvent(new Event("ba:touch")); }, { passive: true }));
  // 처음 보일 때 좌우로 한 번 움직여 드래그할 수 있다는 걸 보여줌
  ba.hint = async () => {
    if (reduceMotion || touched) return;
    const anim = (a, b, d) => new Promise((done) => {
      const t0 = performance.now();
      const step = (t) => {
        if (touched) return done();
        const p = Math.min(1, (t - t0) / d), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        ba.setPos(a + (b - a) * e);
        p < 1 ? requestAnimationFrame(step) : done();
      };
      requestAnimationFrame(step);
    });
    await anim(50, 18, 700); await anim(18, 82, 1100); await anim(82, 50, 700);
  };
};
document.querySelectorAll(".ba").forEach(initBA);

/* ---------- 변환 사례 (탭 + 비교 슬라이더) + 첫 화면 변환 비주얼 ---------- */
(async () => {
  const all = window.CASES || [];
  const ok = await Promise.all(all.map((c) => (c.optional ? Promise.all([loadable(c.before), loadable(c.after)]).then((r) => r.every(Boolean)) : true)));
  const cases = all.filter((_, i) => ok[i]);
  if (!cases.length) return;

  // 첫 화면: 받은 자료 → (막대 전환) → 완성본 반복
  const tf = document.querySelector("[data-tf]");
  if (tf) {
    const before = tf.querySelector(".tf__before"), after = tf.querySelector(".tf__after");
    const bars = tf.querySelector(".bars"), note = tf.querySelector("[data-tf-note]");
    const sweep = async (swap) => {
      bars.classList.remove("is-out"); bars.classList.add("is-in");
      await wait(620); swap();
      bars.classList.remove("is-in"); bars.classList.add("is-out");
      await wait(560); bars.classList.remove("is-out");
    };
    const show = (c) => { before.src = c.before; after.src = c.after; note.textContent = c.example ? "제작 예시" : "실제 작업 사례"; };
    show(cases[0]);
    if (!reduceMotion) {
      let i = 0;
      (async function loop() {
        await wait(2200);
        await sweep(() => tf.classList.add("is-after"));
        await wait(3400);
        i = (i + 1) % cases.length;
        await sweep(() => { tf.classList.remove("is-after"); show(cases[i]); });
        loop();
      })();
    } else tf.classList.add("is-after");
  }

  // 변환 사례 섹션
  const section = document.querySelector("#cases");
  const tabs = document.querySelector("[data-case-tabs]");
  const ba = document.querySelector("[data-case-ba]");
  if (!section || !tabs || !ba) return;
  const f = (k) => section.querySelector(`[data-f="${k}"]`);
  const bars = ba.querySelector(".bars");
  const DUR = 7000;
  tabs.style.setProperty("--n", cases.length);
  tabs.innerHTML = cases
    .map((c, i) => `<button class="case-tab" role="tab" type="button" data-i="${i}" style="--dur:${DUR}ms"><b>0${i + 1}</b><span>${c.tab} <em>→</em> ${c.tabTo}</span></button>`)
    .join("");
  const btns = [...tabs.children];
  let cur = -1, timer = null, paused = false, visible = false;

  const fill = (c) => {
    f("before").src = c.before;
    f("after").src = c.after;
    f("input").textContent = c.input;
    f("output").textContent = c.output;
    f("work").innerHTML = c.work.map((w) => `<li>${w}</li>`).join("");
    f("ex").hidden = !c.example;
    ba.setPos(50);
  };
  const go = async (i, animate = true) => {
    if (i === cur) return;
    cur = i;
    btns.forEach((b, n) => { b.classList.toggle("is-active", n === i); b.setAttribute("aria-selected", n === i); });
    // 진행 막대 애니메이션 다시 시작
    btns[i].style.animation = "none"; void btns[i].offsetWidth; btns[i].style.animation = "";
    if (animate && !reduceMotion) {
      bars.classList.remove("is-out"); bars.classList.add("is-in");
      await wait(560); fill(cases[i]);
      bars.classList.remove("is-in"); bars.classList.add("is-out");
      await wait(520); bars.classList.remove("is-out");
    } else fill(cases[i]);
    schedule();
  };
  const schedule = () => {
    clearTimeout(timer);
    if (paused || !visible || cases.length < 2) return;
    timer = setTimeout(() => go((cur + 1) % cases.length), DUR);
  };
  btns.forEach((b) => b.addEventListener("click", () => { paused = false; section.classList.remove("is-paused"); go(+b.dataset.i); }));
  const pause = () => { paused = true; section.classList.add("is-paused"); clearTimeout(timer); };
  ba.addEventListener("ba:touch", pause);
  ba.addEventListener("pointerenter", pause);
  ba.addEventListener("pointerleave", () => { paused = false; section.classList.remove("is-paused"); schedule(); });
  go(0, false);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !ba.dataset.hinted) { ba.dataset.hinted = 1; ba.hint(); }
    schedule();
  }, { threshold: 0.35 }).observe(ba);
})();

/* ---------- 보안 흐름: 단계가 순서대로 켜짐 ---------- */
(() => {
  const flow = document.querySelector("[data-flow]");
  if (!flow) return;
  const items = [...flow.children];
  if (reduceMotion) return items.forEach((li) => li.classList.add("is-on"));
  let t = null;
  const play = () => {
    let i = 0;
    items.forEach((li) => li.classList.remove("is-on"));
    clearInterval(t);
    t = setInterval(() => {
      if (i < items.length) items[i++].classList.add("is-on");
      else if (i++ > items.length + 3) { items.forEach((li) => li.classList.remove("is-on")); i = 0; }
    }, 550);
  };
  new IntersectionObserver(([e]) => (e.isIntersecting ? play() : clearInterval(t)), { threshold: 0.4 }).observe(flow);
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
      } finally { btn.disabled = false; }
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
