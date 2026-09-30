/* ==========================================================
   유별난PPT - 고객 편의 기능 (PC · 모바일 공통)
   1. 상담 전 준비 가이드 (발표 유형별 기본 구성 + 준비 자료 체크리스트)
   2. 포트폴리오 '이 작업처럼 문의하기' → 문의서 자동 작성
   3. 포트폴리오 링크 공유
   4. 포트폴리오 검색
   5. 자주 묻는 질문 검색
   6. 메일 앱이 안 열릴 때 다른 방법으로 보내기
   7. PC 섹션 바로가기
   8. 후기 별점 애니메이션
   ========================================================== */
(() => {
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const norm = (s) => String(s).toLowerCase().replace(/\s+/g, "");
  const KAKAO = "http://pf.kakao.com/_XgRWxj/chat";
  const MAIL = "youstar_ppt@naver.com";
  const form = $("#contact-form");
  const SEARCH_ICO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';

  let toastT;
  const toast = (msg) => {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove("is-on"), 2600);
  };
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    }
  };

  /* 문의서 채우기 (가이드 · 포트폴리오에서 넘어올 때 공통) */
  const applyFill = ({ goal, ready = [], note = "" }, msgText) => {
    if (!form) return false;
    const g = form.querySelector('[name="goal"]');
    if (g && goal && [...g.options].some((o) => o.value === goal || o.text === goal)) g.value = goal;
    const kind = (s) => (/초안|기존 (IR|제안서|소개서)/.test(s) ? "PPT 초안" : /사진/.test(s) ? "제품 사진" : "텍스트 자료");
    ready.forEach((s) => {
      const c = form.querySelector(`input[name="ready"][value="${kind(s)}"]`);
      if (c) c.checked = true;
    });
    const m = form.querySelector('[name="message"]');
    const add = [note, ready.length ? `[준비된 자료] ${ready.join(", ")}` : ""].filter(Boolean).join("\n");
    if (m && add && !m.value.includes(add)) m.value = (m.value.trim() ? m.value.trim() + "\n\n" : "") + add;
    form.dispatchEvent(new Event("input", { bubbles: true }));
    $("#contact")?.scrollIntoView({ behavior: rm ? "auto" : "smooth" });
    setTimeout(() => form.querySelector('[name="name"]')?.focus({ preventScroll: true }), 700);
    if (msgText) toast(msgText);
    return true;
  };

  /* ---------- 1. 상담 전 준비 가이드 ---------- */
  (() => {
    const GUIDE = {
      ir: {
        label: "IR · 데모데이", goal: "투자 유치 (IR)",
        flow: ["문제 정의", "해결책 · 제품", "시장 규모", "비즈니스 모델", "트랙션 · 성과", "경쟁 우위", "팀 소개", "재무 · 투자 요청"],
        items: ["기존 IR · 사업계획서 초안", "회사 · 제품 소개 자료", "주요 지표 (매출 · 사용자 · 성장률)", "팀 구성 · 주요 이력", "로고 · 브랜드 가이드", "발표 시간과 형식 (예: 데모데이 5분)", "참고하고 싶은 레퍼런스"],
      },
      proposal: {
        label: "제안서 · 입찰", goal: "입찰 · 제안",
        flow: ["제안 개요", "사업 이해 · 과업 분석", "추진 전략", "세부 수행 방안", "추진 일정", "투입 인력 · 조직", "유사 수행 실적", "기대 효과"],
        items: ["제안요청서(RFP) · 과업지시서", "평가 기준표 · 배점표", "기존 제안서 · 수행 실적 자료", "회사 소개 · 인증 자료", "분량 · 양식 제한 사항", "제출 마감일 · 발표 일정", "로고 · CI"],
      },
      profile: {
        label: "회사 · 브랜드 소개", goal: "회사 · 브랜드 · 제품 소개",
        flow: ["회사 소개 · 비전", "연혁", "사업 영역", "제품 · 서비스", "주요 실적 · 고객사", "경쟁력", "조직 · 파트너", "연락처"],
        items: ["기존 소개서 · 홈페이지 문구", "로고 · 브랜드 가이드", "제품 · 현장 사진", "주요 실적 · 고객사 목록", "회사 연혁", "사용 목적 (영업 · 채용 · 투자 등)", "참고하고 싶은 레퍼런스"],
      },
    };
    const keys = Object.keys(GUIDE);
    const checked = Object.fromEntries(keys.map((k) => [k, new Set()]));
    let type = "ir", last = null;

    const gd = document.createElement("div");
    gd.className = "gd";
    gd.setAttribute("role", "dialog");
    gd.setAttribute("aria-modal", "true");
    gd.setAttribute("aria-labelledby", "gd-title");
    gd.innerHTML = `
      <div class="gd__bg" data-gd-close></div>
      <aside class="gd__panel">
        <button class="gd__close" type="button" data-gd-close aria-label="닫기">×</button>
        <div class="gd__scroll">
          <p class="gd__eyebrow">READY GUIDE</p>
          <h3 id="gd-title">상담 전 준비 가이드</h3>
          <p class="gd__lead">발표 유형을 고르면 기본 구성과 준비하면 좋은 자료를 알려드려요. 없는 자료가 있어도 괜찮아요.</p>
          <div class="gd__tabs" role="tablist">${keys.map((k) => `<button type="button" role="tab" data-t="${k}">${GUIDE[k].label}</button>`).join("")}</div>
          <div class="gd__body"></div>
        </div>
        <div class="gd__foot">
          <button class="btn btn--primary" type="button" data-gd-fill></button>
          <button class="btn btn--kakao" type="button" data-gd-kakao>카카오톡으로 보내기</button>
        </div>
      </aside>`;
    document.body.appendChild(gd);
    const body = $(".gd__body", gd), fillBtn = $("[data-gd-fill]", gd);

    const label = () => {
      const n = checked[type].size;
      fillBtn.textContent = n ? `체크한 ${n}개로 상담 요청하기` : "이 유형으로 상담 요청하기";
    };
    const render = () => {
      const G = GUIDE[type];
      $$(".gd__tabs button", gd).forEach((b) => {
        const on = b.dataset.t === type;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });
      body.innerHTML = `
        <h4>일반적인 기본 구성</h4>
        <ol class="gd__flow">${G.flow.map((f, i) => `<li style="--i:${i}">${esc(f)}</li>`).join("")}</ol>
        <h4>준비하면 좋은 자료 <span>있는 것만 체크하세요</span></h4>
        <ul class="gd__list">${G.items.map((it) => `<li><label><input type="checkbox" value="${esc(it)}"${checked[type].has(it) ? " checked" : ""}><span>${esc(it)}</span></label></li>`).join("")}</ul>
        <p class="gd__note">※ 일반적인 구성 예시예요. 발표 목적에 맞게 상담 때 조정해 드려요.</p>`;
      label();
    };
    const open = (t) => {
      if (GUIDE[t]) type = t;
      last = document.activeElement;
      render();
      gd.classList.add("is-open");
      document.body.style.overflow = "hidden";
      $(".gd__scroll", gd).scrollTop = 0;
      $(".gd__tabs .is-active", gd)?.focus({ preventScroll: true });
    };
    const close = () => {
      gd.classList.remove("is-open");
      document.body.style.overflow = "";
      last?.focus?.({ preventScroll: true });
    };

    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-guide]");
      if (t) { e.preventDefault(); open(t.dataset.guide); }
    });
    document.addEventListener("yb:guide", (e) => open(e.detail?.type));
    document.addEventListener("keydown", (e) => e.key === "Escape" && gd.classList.contains("is-open") && close());

    gd.addEventListener("change", (e) => {
      const c = e.target.closest('input[type="checkbox"]');
      if (!c) return;
      c.checked ? checked[type].add(c.value) : checked[type].delete(c.value);
      label();
    });
    gd.addEventListener("click", async (e) => {
      if (e.target.closest("[data-gd-close]")) return close();
      const tab = e.target.closest("[data-t]");
      if (tab) { type = tab.dataset.t; return render(); }
      const G = GUIDE[type], ready = [...checked[type]];
      if (e.target.closest("[data-gd-fill]")) {
        const payload = { goal: G.goal, ready };
        close();
        if (!applyFill(payload, "가이드에서 고른 내용을 문의서에 채워 두었어요.")) {
          try { sessionStorage.setItem("yb-fill", JSON.stringify(payload)); } catch {}
          location.href = "index.html#contact";
        }
        return;
      }
      if (e.target.closest("[data-gd-kakao]")) {
        const text = `[유별난PPT 상담 문의]\n발표 유형: ${G.label}\n준비된 자료: ${ready.length ? ready.join(", ") : "아직 준비 중"}`;
        if (await copy(text)) toast("정리한 내용을 복사했어요. 카카오톡 대화창에 붙여넣어 주세요.");
        window.open(KAKAO, "_blank", "noopener");
      }
    });
  })();

  /* ---------- 2. 다른 페이지 · 포트폴리오에서 넘어온 내용으로 문의서 채우기 ---------- */
  if (form) {
    try {
      const saved = JSON.parse(sessionStorage.getItem("yb-fill") || "null");
      if (saved) {
        sessionStorage.removeItem("yb-fill");
        setTimeout(() => applyFill(saved, "가이드에서 고른 내용을 문의서에 채워 두었어요."), 450);
      }
    } catch {}
    const ref = new URLSearchParams(location.search).get("ref");
    const item = ref && window.PORTFOLIO?.find((p) => p.id === ref);
    if (item) {
      const cat = window.pfCategory ? window.pfCategory(item) : { label: "" };
      const goalMap = { ir: "투자 유치 (IR)", proposal: "입찰 · 제안", profile: "회사 · 브랜드 · 제품 소개" };
      setTimeout(() => applyFill(
        { goal: goalMap[item.category], note: `포트폴리오의 '${item.name}'(${cat.label}) 작업과 비슷한 방향으로 문의드립니다.` },
        `‘${item.name}’ 작업을 참고로 문의서를 채웠어요.`
      ), 450);
      history.replaceState(null, "", location.pathname + location.hash);
    }
  }

  /* ---------- 3. 포트폴리오 링크 공유 ---------- */
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-share]");
    if (!b) return;
    const id = b.dataset.share;
    const url = new URL(`portfolio.html?p=${encodeURIComponent(id)}`, location.href).href;
    const item = window.PORTFOLIO?.find((p) => p.id === id);
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      try { await navigator.share({ title: `${item ? item.name + " | " : ""}유별난PPT 포트폴리오`, url }); return; } catch (err) { if (err?.name === "AbortError") return; }
    }
    if (await copy(url)) toast("링크를 복사했어요. 원하는 곳에 붙여넣어 공유하세요.");
  });

  /* ---------- 4. 포트폴리오 검색 ---------- */
  (() => {
    const main = $(".pf__main");
    if (!main) return;
    const box = document.createElement("div");
    box.className = "sbox";
    box.innerHTML = `${SEARCH_ICO}<input type="search" placeholder="회사명이나 작업 종류로 찾기 (예: 팜, IR)" aria-label="포트폴리오 검색"><span class="sbox__count" aria-live="polite"></span>`;
    const empty = document.createElement("p");
    empty.className = "sbox__empty";
    empty.hidden = true;
    empty.innerHTML = `찾는 작업이 없나요? 비슷한 작업을 했는지 <a href="${KAKAO}" target="_blank" rel="noopener">카카오톡으로 물어보세요 ↗</a>`;
    main.prepend(box, empty);
    const input = $("input", box), count = $(".sbox__count", box);
    input.addEventListener("input", () => {
      const q = norm(input.value);
      let n = 0;
      $$(".pf__group", main).forEach((g) => {
        const cat = g.querySelector("h2")?.textContent || "";
        let vis = 0;
        $$(".card", g).forEach((c) => {
          const hit = !q || norm(c.textContent + cat).includes(q);
          c.classList.toggle("is-miss", !hit);
          if (hit) vis++;
        });
        g.classList.toggle("is-empty", !!q && !vis);
        n += vis;
      });
      count.textContent = q ? `${n}개` : "";
      empty.hidden = !(q && !n);
    });
  })();

  /* ---------- 5. 자주 묻는 질문 검색 ---------- */
  $$(".faq").forEach((faq) => {
    const items = $$("details", faq);
    if (items.length < 4) return;
    const box = document.createElement("div");
    box.className = "sbox sbox--faq";
    box.innerHTML = `${SEARCH_ICO}<input type="search" placeholder="궁금한 내용을 검색해 보세요 (예: 수정, NDA, 세금계산서)" aria-label="자주 묻는 질문 검색"><span class="sbox__count" aria-live="polite"></span>`;
    const empty = document.createElement("p");
    empty.className = "sbox__empty sbox__empty--faq";
    empty.hidden = true;
    empty.innerHTML = `찾는 답이 없나요? <a href="${KAKAO}" target="_blank" rel="noopener">카카오톡으로 바로 물어보세요 ↗</a>`;
    faq.before(box);
    faq.after(empty);
    const input = $("input", box), count = $(".sbox__count", box);
    input.addEventListener("input", () => {
      const q = norm(input.value);
      faq.classList.toggle("is-searching", !!q);
      let n = 0, first = null;
      items.forEach((d) => {
        const hit = !q || norm(d.textContent).includes(q);
        d.classList.toggle("is-miss", !hit);
        if (q && hit) { n++; first = first || d; }
        if (d.dataset.auto && d !== first) { d.open = false; delete d.dataset.auto; }
      });
      if (first && !first.open) { first.open = true; first.dataset.auto = "1"; }
      count.textContent = q ? `${n}개` : "";
      empty.hidden = !(q && !n);
    });
  });

  /* ---------- 6. 메일 앱이 안 열릴 때 다른 방법으로 보내기 ---------- */
  if (form) {
    const LABELS = [["name", "성함"], ["company", "회사명"], ["email", "이메일"], ["phone", "연락처"], ["contact_pref", "선호 연락 방법"], ["contact_time", "연락 가능 시간"], ["goal", "발표 목적"], ["due", "희망 납기"], ["pages", "예상 페이지 수"], ["budget", "예산 범위"], ["ready", "준비된 자료"], ["need", "필요한 작업"], ["link", "자료 공유 링크"], ["nda", "NDA 사전 체결 요청"]];
    const text = () => {
      const fd = new FormData(form);
      const lines = LABELS.map(([k, l]) => {
        let v = fd.getAll(k).filter(Boolean).join(", ");
        if (k === "nda") v = v ? "예" : "아니요";
        return `${l}: ${v || "-"}`;
      });
      return ["[유별난PPT 상담 요청]", ...lines, "", "[문의 내용]", String(fd.get("message") || "")].join("\n");
    };
    const alt = document.createElement("div");
    alt.className = "send-alt";
    alt.hidden = true;
    alt.innerHTML = `<p><b>메일 앱이 열리지 않았나요?</b> 아래 방법으로도 바로 보낼 수 있어요.</p>
      <div class="send-alt__acts">
        <button type="button" class="btn btn--kakao btn--sm" data-alt="kakao">카카오톡으로 보내기</button>
        <button type="button" class="btn btn--ghost btn--sm" data-alt="copy">문의 내용 복사</button>
        <button type="button" class="btn btn--ghost btn--sm" data-alt="mail">이메일 주소 복사</button>
      </div>`;
    (form.querySelector(".form__status") || form.lastElementChild).after(alt);
    form.addEventListener("submit", () => {
      const endpoint = typeof FORM_ENDPOINT !== "undefined" ? FORM_ENDPOINT : "";
      if (!endpoint && form.checkValidity()) alt.hidden = false;
    });
    alt.addEventListener("click", async (e) => {
      const b = e.target.closest("[data-alt]");
      if (!b) return;
      if (b.dataset.alt === "kakao") {
        if (await copy(text())) toast("문의 내용을 복사했어요. 카카오톡 대화창에 붙여넣어 주세요.");
        window.open(KAKAO, "_blank", "noopener");
      } else if (b.dataset.alt === "copy") {
        if (await copy(text())) toast("문의 내용을 복사했어요. 메일이나 메신저에 붙여넣어 보내주세요.");
      } else if (await copy(MAIL)) toast("이메일 주소를 복사했어요.");
    });
  }

  /* ---------- 7. PC 섹션 바로가기 (오른쪽 점 표시) ---------- */
  (() => {
    if (!form) return;
    const secs = [["#cases", "제작 사례"], ["#why", "왜 유별난PPT"], ["#services", "서비스"], ["#portfolio", "포트폴리오"], ["#process", "작업 과정"], ["#security", "자료 보안"], ["#reviews", "고객 후기"], ["#faq", "자주 묻는 질문"], ["#contact", "상담 문의"]]
      .map(([s, l]) => [$(s), s, l]).filter(([el]) => el);
    if (!secs.length) return;
    const nav = document.createElement("nav");
    nav.className = "dotnav";
    nav.setAttribute("aria-label", "섹션 바로가기");
    nav.innerHTML = secs.map(([, s, l]) => `<a href="${s}" aria-label="${l}"><span>${l}</span></a>`).join("");
    document.body.appendChild(nav);
    const links = $$("a", nav);
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const i = secs.findIndex(([el]) => el === e.target);
      links.forEach((a, n) => a.classList.toggle("is-active", n === i));
    }), { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(([el]) => io.observe(el));
    const hero = $(".hero");
    const onScroll = () => nav.classList.toggle("is-on", scrollY > (hero?.offsetHeight || 600) * 0.6);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- 8. 후기: 카드가 보일 때 별점이 하나씩 켜짐 ---------- */
  $$(".review__stars").forEach((s) => {
    const t = s.textContent.trim();
    if (/^★+$/.test(t)) s.innerHTML = [...t].map((c, i) => `<span style="--i:${i}">${c}</span>`).join("");
  });
})();
