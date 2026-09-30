/* ==========================================================
   유별난PPT - 추가 인터랙션
   ========================================================== */
(() => {
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const KAKAO = "http://pf.kakao.com/_XgRWxj/chat";

  /* ---------- 공통: 알림 · 복사 ---------- */
  let toastEl, toastT;
  const toast = (msg) => {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-on"), 2400);
  };
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy"); ta.remove(); return ok;
    }
  };

  /* ---------- 1. 후기: 한 칸씩 자동으로 옆으로 넘어감 ---------- */
  (() => {
    const track = $(".reviews__track");
    if (!track) return;
    const section = track.closest("section");
    const cards = $$(".review", track);
    if (!cards.length) return;
    const DUR = 4200, GAP = 20;
    track.classList.add("is-js");
    const dots = document.createElement("div");
    dots.className = "rv-dots";
    dots.setAttribute("aria-label", "후기 넘기기");
    track.after(dots);

    let pages = 1, timer = null, paused = false, visible = false, idleT = null, scrollT = null;
    const step = () => cards[0].offsetWidth + GAP;
    const idx = () => clamp(Math.round(track.scrollLeft / step()), 0, pages - 1);
    const go = (i) => track.scrollTo({ left: i * step(), behavior: rm ? "auto" : "smooth" });
    const mark = () => {
      const i = idx();
      $$("button", dots).forEach((b, n) => b.classList.toggle("is-active", n === i));
      const tr = track.getBoundingClientRect();
      cards.forEach((c) => {
        const r = c.getBoundingClientRect();
        c.classList.toggle("is-vis", r.left >= tr.left - 10 && r.right <= tr.right + 10);
      });
    };
    const build = () => {
      const per = Math.max(1, Math.round(track.clientWidth / step()));
      pages = Math.max(1, cards.length - per + 1);
      dots.innerHTML = Array.from({ length: pages }, (_, i) => `<button type="button" aria-label="${i + 1}번째 후기로 이동" style="--dur:${DUR}ms"></button>`).join("");
      mark();
    };
    const restart = () => {
      clearTimeout(timer);
      const a = $("button.is-active", dots);
      if (a) { a.classList.remove("is-active"); void a.offsetWidth; a.classList.add("is-active"); }
      if (paused || !visible || rm || document.hidden) return;
      timer = setTimeout(() => { const i = idx(); go(i >= pages - 1 ? 0 : i + 1); }, DUR);
    };
    const pause = () => { paused = true; section?.classList.add("is-paused"); clearTimeout(timer); };
    const resume = () => { paused = false; section?.classList.remove("is-paused"); restart(); };

    track.addEventListener("scroll", () => { mark(); clearTimeout(scrollT); scrollT = setTimeout(restart, 140); }, { passive: true });
    dots.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) go([...dots.children].indexOf(b)); });
    if (fine) { track.addEventListener("pointerenter", pause); track.addEventListener("pointerleave", resume); }
    track.addEventListener("touchstart", () => { pause(); clearTimeout(idleT); }, { passive: true });
    track.addEventListener("touchend", () => { clearTimeout(idleT); idleT = setTimeout(resume, 5000); }, { passive: true });
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(Math.min(idx() + 1, pages - 1)); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(Math.max(idx() - 1, 0)); }
    });
    document.addEventListener("visibilitychange", restart);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; restart(); }, { threshold: 0.3 }).observe(track);
    addEventListener("resize", build);
    build();
  })();

  /* ---------- 2. 첫 화면 문구 회전: 발표는 → IR은 → 제안서는 … ---------- */
  (() => {
    const h = $(".hero__ko");
    if (!h || !h.innerHTML.includes("발표는")) return;
    const words = ["발표는", "IR은", "제안서는", "소개서는", "데모데이는"];
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
    h.innerHTML = h.innerHTML.replace("발표는", `<span class="rot" aria-hidden="true">${words.map((w, i) => `<b${i ? "" : ' class="is-cur"'}>${w}</b>`).join("")}</span>`);
    if (rm) return;
    const rot = $(".rot", h), bs = $$("b", rot);
    let i = 0;
    const fit = () => (rot.style.width = `${bs[i].offsetWidth}px`);
    fit();
    document.fonts?.ready.then(fit);
    addEventListener("resize", fit);
    setInterval(() => {
      if (document.hidden) return;
      const cur = bs[i];
      i = (i + 1) % bs.length;
      cur.classList.remove("is-cur"); cur.classList.add("is-out");
      bs[i].classList.remove("is-out"); bs[i].classList.add("is-cur");
      fit();
      setTimeout(() => cur.classList.remove("is-out"), 700);
    }, 2300);
  })();

  /* ---------- 3. 한 문장이 스크롤에 맞춰 단어별로 채워짐: 읽고, 설계하고, 만듭니다. ---------- */
  (() => {
    const sec = $("[data-impact]");
    if (!sec) return;
    const words = $$(".imp__w", sec), caps = $$(".imp__caps p", sec), num = $(".imp__count b", sec), bar = $(".imp__count i", sec);
    const N = words.length;
    let cur = -2;
    const set = (i) => {
      if (i === cur) return;
      cur = i;
      words.forEach((w, n) => { w.classList.toggle("is-on", n <= i); w.classList.toggle("is-cur", n === i); });
      caps.forEach((c, n) => c.classList.toggle("is-cur", n === Math.max(i, 0)));
      if (num) num.textContent = String(Math.max(i, 0) + 1).padStart(2, "0");
    };
    if (rm) { sec.classList.add("is-static"); return; }
    const tick = () => {
      const r = sec.getBoundingClientRect(), total = sec.offsetHeight - innerHeight;
      const p = clamp(-r.top / (total || 1), 0, 1);
      bar?.style.setProperty("--p", p.toFixed(3));
      // 고정되기 전(화면에 들어오는 중)에는 아직 비어 있다가, 고정되면 첫 단어부터 채워짐
      set(r.top > innerHeight * 0.15 ? -1 : Math.min(N - 1, Math.floor(p * N * 0.999)));
    };
    addEventListener("scroll", tick, { passive: true });
    addEventListener("resize", tick);
    tick();
  })();

  /* ---------- 3-1. 작업 과정: 스크롤하면 단계가 진행되고 화면이 바뀜 ---------- */
  (() => {
    const sec = $("[data-process]");
    if (!sec) return;
    const texts = $$(".pv-text", sec), layers = $$(".pv__layer", sec), rail = $$(".pv-rail li", sec), line = $(".pv-rail__line", sec);
    const N = texts.length;
    let cur = -1, playing = null;
    const set = (i, play) => {
      if (i !== cur) {
        cur = i;
        texts.forEach((el, n) => el.classList.toggle("is-cur", n === i));
        rail.forEach((el, n) => { el.classList.toggle("is-cur", n === i); el.classList.toggle("is-done", n < i); });
      }
      // 화면에 들어왔을 때만 장면 애니메이션 재생
      const want = play ? i : -1;
      if (want !== playing) { playing = want; layers.forEach((el, n) => el.classList.toggle("is-active", n === want)); }
    };
    if (rm) { sec.classList.add("is-static"); texts.forEach((t) => t.classList.add("is-cur")); return; }
    const tick = () => {
      const r = sec.getBoundingClientRect(), total = sec.offsetHeight - innerHeight;
      const p = clamp(-r.top / (total || 1), 0, 1);
      line?.style.setProperty("--p", p.toFixed(3));
      set(Math.min(N - 1, Math.floor(p * N * 0.999)), r.top < innerHeight * 0.35 && r.bottom > innerHeight * 0.5);
    };
    rail.forEach((li, n) => li.addEventListener("click", () => {
      const top = sec.getBoundingClientRect().top + scrollY, total = sec.offsetHeight - innerHeight;
      scrollTo({ top: top + total * ((n + 0.5) / N), behavior: "smooth" });
    }));
    addEventListener("scroll", tick, { passive: true });
    addEventListener("resize", tick);
    tick();
  })();

  /* ---------- 3-2. 모바일: 제작 역량 화면은 장면을 자동으로 넘기고, 글은 그대로 읽히게 ---------- */
  (() => {
    const why = $(".why");
    if (!why) return;
    const mq = matchMedia("(max-width: 900px)");
    const scenes = $$(".scene", why), dots = $$(".why__dots button", why), stage = $(".why__screen", why);
    if (!scenes.length || !stage) return;
    let i = 0, t = null, seen = false;
    const show = (n) => {
      i = (n + scenes.length) % scenes.length;
      scenes.forEach((el, k) => el.classList.toggle("is-active", k === i));
      dots.forEach((el, k) => el.classList.toggle("is-active", k === i));
    };
    const run = () => { clearInterval(t); if (mq.matches && seen && !rm) t = setInterval(() => show(i + 1), 8000); };
    // 모바일에서는 점을 누르면 글로 스크롤하지 않고 장면만 바꿈
    $(".why__dots", why)?.addEventListener("click", (e) => {
      if (!mq.matches) return;
      const b = e.target.closest("button");
      if (!b) return;
      e.stopPropagation();
      show(dots.indexOf(b));
      run();
    }, true);
    new IntersectionObserver(([e]) => { seen = e.isIntersecting; run(); }, { threshold: 0.4 }).observe(stage);
    mq.addEventListener?.("change", run);
  })();

  /* ---------- 4. 페이지 이동할 때 로고 막대로 화면 전환 ---------- */
  (() => {
    if (rm) return;
    const pt = document.createElement("div");
    pt.className = "pt";
    pt.setAttribute("aria-hidden", "true");
    pt.innerHTML = "<i></i>".repeat(7) + '<svg class="pt__logo" viewBox="0 0 200 230" fill="currentColor"><defs><clipPath id="ptc"><path d="M0 0H200V130A100 100 0 0 1 0 130Z"/></clipPath></defs><g clip-path="url(#ptc)"><polygon points="0,14 20,0 20,230 0,230"/><polygon points="30,30 50,16 50,230 30,230"/><polygon points="60,96 80,82 80,230 60,230"/><polygon points="90,110 110,96 110,230 90,230"/><polygon points="120,96 140,82 140,230 120,230"/><polygon points="150,30 170,16 170,230 150,230"/><polygon points="180,14 200,0 200,230 180,230"/></g></svg>';
    document.body.appendChild(pt);
    const KEY = "yb-pt";
    if (sessionStorage.getItem(KEY)) {
      sessionStorage.removeItem(KEY);
      pt.classList.add("is-cover");
      requestAnimationFrame(() => requestAnimationFrame(() => {
        pt.classList.remove("is-cover"); pt.classList.add("is-out");
        setTimeout(() => pt.classList.remove("is-out"), 900);
      }));
    }
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/(\.html|\/)$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // 같은 페이지 안 이동
      e.preventDefault();
      try { sessionStorage.setItem(KEY, "1"); } catch {}
      pt.classList.remove("is-out"); pt.classList.add("is-in");
      setTimeout(() => (location.href = url.href), 620);
    });
    addEventListener("pageshow", (e) => e.persisted && pt.classList.remove("is-in", "is-cover", "is-out"));
  })();

  /* ---------- 5. 빠른 견적 도우미 (4번 클릭이면 문의서 자동 작성) ---------- */
  (() => {
    const form = $("#contact-form");
    if (!form) return;
    const steps = [
      { key: "goal", q: "어떤 발표자료가 필요하세요?", opts: ["투자 유치 (IR)", "데모데이", "정부지원사업 발표", "입찰 · 제안", "회사 · 브랜드 · 제품 소개", "기타"] },
      { key: "pages", q: "분량은 어느 정도인가요?", opts: ["10장 이하", "10 – 20장", "20 – 40장", "40장 이상", "잘 모르겠어요"] },
      { key: "due", q: "언제까지 필요하세요?", opts: ["1주 이내 (급해요)", "2주 이내", "한 달 이내", "아직 미정"] },
      { key: "ready", q: "지금 준비된 자료는 무엇인가요?", opts: ["PPT 초안", "텍스트 자료", "제품 사진", "아직 준비 중"] },
    ];
    const qz = document.createElement("div");
    qz.className = "qz";
    qz.setAttribute("role", "dialog");
    qz.setAttribute("aria-modal", "true");
    qz.setAttribute("aria-label", "빠른 견적 문의");
    qz.innerHTML = '<div class="qz__bg" data-qz-close></div><div class="qz__panel"><button class="qz__close" type="button" data-qz-close aria-label="닫기">×</button><div class="qz__prog"><span></span></div><div class="qz__body"></div></div>';
    document.body.appendChild(qz);
    const body = $(".qz__body", qz), prog = $(".qz__prog span", qz);
    let n = 0, ans = {}, last = null;

    const render = () => {
      prog.style.setProperty("--p", `${((n + 1) / (steps.length + 1)) * 100}%`);
      if (n < steps.length) {
        const s = steps[n];
        body.innerHTML = `<div class="qz__step"><small>${n + 1} / ${steps.length}</small><h3>${s.q}</h3><div class="qz__opts">${s.opts.map((o) => `<button type="button" data-v="${esc(o)}">${esc(o)}</button>`).join("")}</div>${n ? '<button class="qz__back" type="button" data-back>← 이전</button>' : ""}</div>`;
      } else {
        body.innerHTML = `<div class="qz__step"><small>완료</small><h3>이렇게 정리됐어요</h3><ul class="qz__sum">${steps.map((s) => `<li>${esc(ans[s.key])}</li>`).join("")}</ul><div class="qz__acts"><button class="btn btn--primary" type="button" data-fill>이 내용으로 상담 요청서 작성하기</button><button class="btn btn--kakao" type="button" data-kakao>카카오톡으로 바로 상담하기</button></div><p class="qz__hint">카카오톡을 누르면 정리된 내용이 복사돼요. 대화창에 붙여넣기만 하세요.</p><button class="qz__back" type="button" data-back>← 이전</button></div>`;
      }
      $("button:not(.qz__back)", body)?.focus({ preventScroll: true });
    };
    const open = (e) => {
      e?.preventDefault();
      n = 0; ans = {}; last = document.activeElement;
      qz.classList.add("is-open");
      document.body.style.overflow = "hidden";
      render();
    };
    const close = () => { qz.classList.remove("is-open"); document.body.style.overflow = ""; last?.focus?.({ preventScroll: true }); };
    $$('.fab--quote, .nav .btn[href="#contact"], [data-quote]').forEach((t) => t.addEventListener("click", open));

    qz.addEventListener("click", (e) => {
      if (e.target.closest("[data-qz-close]")) return close();
      const opt = e.target.closest("[data-v]");
      if (opt) { ans[steps[n].key] = opt.dataset.v; n++; return render(); }
      if (e.target.closest("[data-back]")) { n = Math.max(0, n - 1); return render(); }
      if (e.target.closest("[data-fill]")) {
        const goal = form.querySelector('[name="goal"]');
        if (goal && [...goal.options].some((o) => o.value === ans.goal || o.text === ans.goal)) goal.value = ans.goal;
        const pages = form.querySelector('[name="pages"]'); if (pages) pages.value = ans.pages;
        const due = form.querySelector('[name="due"]'); if (due) due.value = ans.due;
        form.querySelectorAll('input[name="ready"]').forEach((c) => (c.checked = c.value === ans.ready));
        form.dispatchEvent(new Event("input", { bubbles: true }));
        close();
        $("#contact")?.scrollIntoView({ behavior: rm ? "auto" : "smooth" });
        setTimeout(() => form.querySelector('[name="name"]')?.focus({ preventScroll: true }), 800);
        toast("선택하신 내용을 문의서에 채워 두었어요.");
        return;
      }
      if (e.target.closest("[data-kakao]")) {
        const text = `[유별난PPT 견적 문의]\n발표 목적: ${ans.goal}\n분량: ${ans.pages}\n희망 납기: ${ans.due}\n준비된 자료: ${ans.ready}`;
        copy(text).then((ok) => ok && toast("문의 내용을 복사했어요. 카카오톡 대화창에 붙여넣어 주세요."));
        window.open(KAKAO, "_blank", "noopener");
      }
    });
    document.addEventListener("keydown", (e) => e.key === "Escape" && qz.classList.contains("is-open") && close());
  })();

  /* ---------- 6. 지금 상담 가능한지 표시 + 이메일 복사 버튼 ---------- */
  (() => {
    const hours = $$(".contact__info dd").find((d) => /09:00/.test(d.textContent));
    if (hours) {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
      const day = now.getDay(), hm = now.getHours() + now.getMinutes() / 60;
      const on = day >= 1 && day <= 5 && hm >= 9 && hm < 17;
      hours.insertAdjacentHTML("beforeend", on
        ? ' <span class="status status--on"><i></i>지금 상담 가능</span>'
        : ' <span class="status status--off"><i></i>상담 시간 외 · 남겨주시면 다음 영업일에 답변드려요</span>');
    }
    const mail = $('.contact__info a[href^="mailto:"]');
    if (mail) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "copy-btn"; b.textContent = "복사";
      b.setAttribute("aria-label", "이메일 주소 복사");
      b.addEventListener("click", async () => { await copy(mail.textContent.trim()); toast("이메일 주소를 복사했어요."); });
      mail.after(b);
    }
  })();

  /* ---------- 7. 문의 작성 중 내용 자동 저장 (새로고침해도 유지) ---------- */
  (() => {
    const form = $("#contact-form");
    if (!form) return;
    const KEY = "yb-form-draft";
    const fields = () => [...form.elements].filter((el) => el.name && el.name !== "agree" && el.type !== "submit");
    const save = () => {
      const d = {};
      fields().forEach((el) => {
        if (el.type === "checkbox") { d[el.name] = d[el.name] || []; if (el.checked) d[el.name].push(el.value); }
        else d[el.name] = el.value;
      });
      try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
    };
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || "null");
      if (d && Object.values(d).some((v) => (Array.isArray(v) ? v.length : v))) {
        fields().forEach((el) => {
          const v = d[el.name];
          if (v == null) return;
          if (el.type === "checkbox") el.checked = v.includes(el.value);
          else el.value = v;
        });
        const note = document.createElement("p");
        note.className = "draft-note";
        note.innerHTML = "<span>작성하던 내용을 불러왔어요.</span><button type=\"button\">지우기</button>";
        note.querySelector("button").addEventListener("click", () => { localStorage.removeItem(KEY); form.reset(); note.remove(); });
        form.prepend(note);
      }
    } catch {}
    let t;
    form.addEventListener("input", () => { clearTimeout(t); t = setTimeout(save, 300); });
    form.addEventListener("change", save);
    form.addEventListener("submit", () => setTimeout(() => { if ($(".form__status.ok", form)) localStorage.removeItem(KEY); }, 60));
  })();

  /* ---------- 8. 맨 위로 버튼 (스크롤 진행 링) ---------- */
  (() => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "totop"; b.setAttribute("aria-label", "맨 위로");
    b.innerHTML = '<svg class="ring" viewBox="0 0 52 52" aria-hidden="true"><circle class="bg" cx="26" cy="26" r="24"/><circle class="fg" cx="26" cy="26" r="24"/></svg><svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(b);
    const fg = $(".fg", b);
    b.addEventListener("click", () => scrollTo({ top: 0, behavior: rm ? "auto" : "smooth" }));
    const on = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      fg.style.strokeDashoffset = (150.8 * (1 - (max > 0 ? scrollY / max : 0))).toFixed(1);
      b.classList.toggle("is-on", scrollY > innerHeight * 0.8);
    };
    addEventListener("scroll", on, { passive: true });
    on();
  })();

  /* ---------- 9. 고객사 로고: 스크롤이 빠를수록 빨리 흐름 ---------- */
  (() => {
    const rows = $$(".marquee__row");
    if (rm || !rows.length || !rows[0].getAnimations) return;
    let anims = null, lastY = scrollY, v = 0, rate = 1;
    const loop = () => {
      if (!anims || !anims.length) anims = rows.flatMap((r) => r.getAnimations());
      const dy = Math.abs(scrollY - lastY);
      lastY = scrollY;
      v += (Math.min(dy, 80) - v) * 0.1;
      rate += (1 + v / 9 - rate) * 0.12;
      anims.forEach((a) => (a.playbackRate = rate));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  })();

  /* ---------- 10. 포트폴리오 카드 위에서 '보기' 커서 ---------- */
  (() => {
    if (!fine || rm) return;
    const c = document.createElement("div");
    c.className = "view-cursor"; c.textContent = "보기"; c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c);
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, on = false;
    document.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      const hit = !!e.target.closest?.(".card");
      if (hit !== on) { on = hit; c.classList.toggle("is-on", on); document.body.classList.toggle("has-view-cursor", on); }
    }, { passive: true });
    const loop = () => {
      x += (tx - x) * 0.22; y += (ty - y) * 0.22;
      c.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  })();
})();
