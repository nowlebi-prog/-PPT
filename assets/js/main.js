/* ==========================================================
   유별난PPT - 공통 스크립트
   ========================================================== */

// 문의 폼 전송 주소 (Formspree, Getform, 자체 API 등)
// 비워두면 메일 앱(youstar_ppt@naver.com)으로 내용을 작성해 보냅니다.
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "youstar_ppt@naver.com";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Header ---------- */
(() => {
  const header = document.querySelector(".header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = header.querySelector(".nav-toggle");
  toggle?.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  header.querySelectorAll(".nav a").forEach((a) =>
    a.addEventListener("click", () => {
      header.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    })
  );
})();

/* ---------- Reveal on scroll ---------- */
(() => {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduceMotion) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
})();

/* ---------- Starfield (hero background) ---------- */
(() => {
  const canvas = document.querySelector("#stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, dpr, stars = [], shooting = null, raf;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round((w * h) / 4200);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.6 + 0.2,
      tw: Math.random() * 0.02 + 0.004,
      ph: Math.random() * Math.PI * 2,
      vy: Math.random() * 0.05 + 0.01,
      blue: Math.random() < 0.18,
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
    // 가끔 지나가는 별똥별
    if (!shooting && Math.random() < 0.003) {
      shooting = { x: Math.random() * w * 0.7 + w * 0.3, y: Math.random() * h * 0.4, len: 0, life: 0 };
    }
    if (shooting) {
      shooting.life += 1;
      shooting.len = Math.min(120, shooting.len + 6);
      const sx = shooting.x - shooting.life * 7;
      const sy = shooting.y + shooting.life * 3.5;
      const grad = ctx.createLinearGradient(sx, sy, sx + shooting.len, sy - shooting.len / 2);
      const fade = Math.max(0, 1 - shooting.life / 50);
      grad.addColorStop(0, `rgba(255,255,255,${0.8 * fade})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + shooting.len, sy - shooting.len / 2);
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
  } else {
    raf = requestAnimationFrame(draw);
    // 화면 밖이면 애니메이션 정지 (배터리 절약)
    new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(draw);
    }).observe(canvas);
  }
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

/* ---------- Client marquee (끊김 없는 반복을 위해 복제) ---------- */
document.querySelectorAll(".marquee__row").forEach((row) => {
  row.innerHTML += row.innerHTML;
  row.querySelectorAll(".logo-chip").forEach((c, i, all) => {
    if (i >= all.length / 2) c.setAttribute("aria-hidden", "true");
  });
});

/* ---------- Contact form ---------- */
(() => {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const status = form.querySelector(".form__status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form__status";

    const types = [...form.querySelectorAll('input[name="type"]:checked')].map((i) => i.value);
    if (!types.length) {
      status.textContent = "문의 유형을 하나 이상 선택해 주세요.";
      status.classList.add("err");
      return;
    }
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));
    data.type = types.join(", ");

    if (FORM_ENDPOINT) {
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.textContent = "문의가 접수되었습니다. 영업일 기준 24시간 안에 연락드릴게요.";
        status.classList.add("ok");
      } catch {
        status.textContent = `전송에 실패했습니다. ${CONTACT_EMAIL} 로 직접 보내주세요.`;
        status.classList.add("err");
      } finally {
        btn.disabled = false;
      }
      return;
    }

    // 전송 주소가 없으면 메일 앱으로 작성
    const body = [
      `성함: ${data.name}`,
      `회사명: ${data.company}`,
      `이메일: ${data.email}`,
      `연락처: ${data.phone}`,
      `예산 범위: ${data.budget || "-"}`,
      `문의 유형: ${data.type}`,
      `자료 공유 링크: ${data.link || "-"}`,
      "",
      "[문의 내용]",
      data.message,
    ].join("\n");
    const subject = `[홈페이지 견적 문의] ${data.company} / ${data.type}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = "메일 앱이 열리면 내용을 확인하고 전송해 주세요.";
    status.classList.add("ok");
  });
})();

/* ---------- Footer year ---------- */
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
