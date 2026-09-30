/* ==========================================================
   유별난PPT - 모션 (스크롤 · 마우스 인터랙션)
   ========================================================== */
(() => {
  const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- 1. 헤드라인 줄 단위 마스크 등장 ---------- */
  const replay = new Set();
  $$("[data-split]").forEach((el) => {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines
      .map((l, i) => `<span class="ln"><span class="ln__in" style="transition-delay:${(i * 0.12).toFixed(2)}s">${l.trim()}</span></span>`)
      .join("");
    const host = el.closest(".reveal");
    if (host && host.classList.contains("is-in")) replay.add(host);
  });
  // 이미 화면에 들어와 있던 영역은 한 번 더 재생
  replay.forEach((host) => {
    host.classList.remove("is-in");
    void host.offsetWidth;
    requestAnimationFrame(() => host.classList.add("is-in"));
  });

  /* ---------- 2. 작업 종류 목록: 한 줄씩 좌우에서 등장 ---------- */
  $$(".works__list li").forEach((li, i) => {
    li.classList.add("reveal");
    li.dataset.reveal = Math.floor(i / 3) % 2 ? "right" : "left";
    li.style.transitionDelay = `${(i % 3) * 0.09}s`;
  });
  window.observeReveal?.();

  /* ---------- 3. 왜 유별난PPT: 스크롤 위치에 맞춰 장면 전환 ---------- */
  const why = $(".why");
  if (why) {
    const items = $$(".why__item", why);
    const scenes = $$(".scene", why);
    const dots = $$(".why__dots button", why);
    let cur = -1;
    const set = (i) => {
      if (i === cur) return;
      cur = i;
      items.forEach((el, n) => el.classList.toggle("is-active", n === i));
      scenes.forEach((el, n) => el.classList.toggle("is-active", n === i));
      dots.forEach((el, n) => el.classList.toggle("is-active", n === i));
    };
    set(0);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && set(+e.target.dataset.step)), {
      rootMargin: "-45% 0px -45% 0px",
    });
    items.forEach((el) => io.observe(el));
    dots.forEach((d, n) =>
      d.addEventListener("click", () => {
        const r = items[n].getBoundingClientRect();
        window.scrollTo({ top: scrollY + r.top + r.height / 2 - innerHeight / 2, behavior: rm ? "auto" : "smooth" });
      })
    );
  }

  if (rm) return; // 모션 줄이기 설정이면 여기까지만

  /* ---------- 4. 스크롤 · 마우스 루프 ---------- */
  const progress = document.createElement("div");
  progress.className = "progress";
  document.body.appendChild(progress);

  const hero = $(".hero");
  const heroInner = $(".hero__inner");
  const wall = $(".wall");
  const drifts = $$("[data-drift]");
  const pars = $$("[data-parallax]");
  const tilts = $$("[data-tilt-in]");

  // 큰 글자 밴드: 복제해서 끊김 없이, 스크롤 속도에 따라 빨라지고 방향도 바뀜
  const rows = $$(".kinetic__row").map((row) => {
    row.innerHTML += row.innerHTML;
    return { row, x: 0, half: 0, sp: +row.dataset.speed || 1 };
  });
  const measure = () => rows.forEach((k) => (k.half = k.row.scrollWidth / 2));
  measure();
  window.addEventListener("resize", measure);
  document.fonts?.ready.then(measure);

  // 마우스
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  let gx = innerWidth / 2, gy = innerHeight / 2, tgx = gx, tgy = gy;
  let glow = null;
  if (fine) {
    glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    window.addEventListener("pointermove", (e) => {
      tgx = e.clientX;
      tgy = e.clientY;
      glow.classList.add("is-on");
      if (hero) {
        const r = hero.getBoundingClientRect();
        if (e.clientY < r.bottom) {
          tmx = (e.clientX / innerWidth - 0.5) * -46;
          tmy = (e.clientY / innerHeight - 0.5) * -32;
        }
      }
    }, { passive: true });
    document.addEventListener("pointerleave", () => glow.classList.remove("is-on"));
  }

  let lastY = -1, vel = 0, dir = 1;
  const frame = () => {
    const y = scrollY, h = innerHeight;
    const dy = lastY < 0 ? 0 : y - lastY;
    const scrolled = y !== lastY;
    lastY = y;
    if (dy) dir = dy > 0 ? 1 : -1;
    vel = lerp(vel, Math.min(Math.abs(dy), 80), 0.12);

    if (scrolled) {
      const max = document.documentElement.scrollHeight - h;
      progress.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;

      // 고민 목록: 스크롤할수록 오른쪽으로 흘러감
      for (const el of drifts) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -150 || r.top > h + 150) continue;
        const p = clamp((h - r.top) / (h + r.height), 0, 1);
        el.style.translate = `${((p - 0.35) * +el.dataset.drift).toFixed(1)}px 0`;
      }
      // 세로 패럴랙스
      for (const el of pars) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > h + 200) continue;
        const c = r.top + r.height / 2 - h / 2;
        el.style.translate = `0 ${(-c * +el.dataset.parallax).toFixed(1)}px`;
      }
      // 노트북: 누워 있다가 스크롤하면 일어섬
      for (const el of tilts) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > h + 100) continue;
        const p = clamp((h - r.top) / (h * 0.7), 0, 1);
        el.style.setProperty("--tin", (1 - p).toFixed(3));
      }
      // 첫 화면: 글자는 위로 빠지고, 슬라이드 벽은 살짝 확대
      if (hero && y < h * 1.3) {
        const k = y / h;
        if (heroInner) {
          heroInner.style.translate = `0 ${(y * 0.35).toFixed(1)}px`;
          heroInner.style.opacity = clamp(1 - k * 1.15, 0, 1).toFixed(3);
        }
        hero.style.setProperty("--zoom", (1 + k * 0.18).toFixed(3));
      }
    }

    // 큰 글자 밴드
    for (const k of rows) {
      if (!k.half) continue;
      k.x -= (0.7 + vel * 0.45) * k.sp * dir;
      if (k.x <= -k.half) k.x += k.half;
      if (k.x > 0) k.x -= k.half;
      k.row.style.transform = `translate3d(${k.x.toFixed(1)}px,0,0)`;
    }

    // 마우스 따라 움직이는 효과
    if (fine) {
      mx = lerp(mx, tmx, 0.06);
      my = lerp(my, tmy, 0.06);
      wall?.style.setProperty("--mx", `${mx.toFixed(2)}px`);
      wall?.style.setProperty("--my", `${my.toFixed(2)}px`);
      gx = lerp(gx, tgx, 0.12);
      gy = lerp(gy, tgy, 0.12);
      glow.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(1)}px, 0)`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  if (!fine) return;

  /* ---------- 5. 자석 버튼 ---------- */
  $$(".btn--primary, .btn--kakao, .btn--ghost").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.translate = `${(dx * 0.22).toFixed(1)}px ${(dy * 0.32).toFixed(1)}px`;
    });
    btn.addEventListener("pointerleave", () => (btn.style.translate = ""));
  });

  /* ---------- 6. 포트폴리오 카드 3D 틸트 (동적으로 생긴 카드 포함) ---------- */
  let tiltEl = null;
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest?.(".card");
    const thumb = card?.querySelector(".card__thumb");
    if (tiltEl && tiltEl !== thumb) {
      tiltEl.style.transform = "";
      tiltEl = null;
    }
    if (!thumb) return;
    tiltEl = thumb;
    const r = thumb.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    thumb.style.transform = `perspective(900px) rotateX(${((0.5 - py) * 9).toFixed(2)}deg) rotateY(${((px - 0.5) * 11).toFixed(2)}deg) translateZ(0)`;
    thumb.style.setProperty("--px", `${(px * 100).toFixed(1)}%`);
    thumb.style.setProperty("--py", `${(py * 100).toFixed(1)}%`);
  }, { passive: true });

  /* ---------- 7. 노트북 목업: 마우스 따라 기울기 ---------- */
  $$(".svc__media").forEach((media) => {
    const dev = $(".device", media);
    if (!dev) return;
    media.addEventListener("pointermove", (e) => {
      const r = media.getBoundingClientRect();
      dev.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(2)}deg`);
      dev.style.setProperty("--my", `${((0.5 - (e.clientY - r.top) / r.height) * 10).toFixed(2)}deg`);
    });
    media.addEventListener("pointerleave", () => {
      dev.style.setProperty("--mx", "0deg");
      dev.style.setProperty("--my", "0deg");
    });
  });

  /* ---------- 8. 후기 자동 넘김 ---------- */
  const track = $(".reviews__track");
  if (track) {
    let hold = false;
    ["pointerenter", "focusin", "touchstart"].forEach((ev) => track.addEventListener(ev, () => (hold = true), { passive: true }));
    ["pointerleave", "focusout"].forEach((ev) => track.addEventListener(ev, () => (hold = false)));
    setInterval(() => {
      if (hold || document.hidden) return;
      const r = track.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + track.querySelector(".review").offsetWidth + 20 });
    }, 4500);
  }
})();
