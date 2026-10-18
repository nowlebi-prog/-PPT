/* A light deterrent for portfolio previews. Browser/OS screenshots cannot be reliably blocked. */
(() => {
  const portfolio = !!document.getElementById("grid");
  const protectedArea = portfolio
    ? "#grid .pc__img, #lb img"
    : "#services .card__img img, #work #room";
  if (!document.querySelector(protectedArea)) return;

  const style = document.createElement("style");
  style.textContent = `
    ${protectedArea}{-webkit-user-select:none;user-select:none;-webkit-user-drag:none;-webkit-touch-callout:none}
    .asset-guard-note{position:fixed;z-index:120;right:clamp(16px,3vw,44px);bottom:clamp(18px,4vh,42px);max-width:min(390px,calc(100vw - 32px));padding:17px 20px;border:1px solid rgba(87,185,229,.55);border-radius:12px;background:rgba(5,14,29,.96);color:#f5fbff;box-shadow:0 18px 48px rgba(0,0,0,.55),0 0 28px rgba(25,112,190,.18);font:600 13px/1.6 "Pretendard Variable",Pretendard,sans-serif;letter-spacing:-.015em;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
    .asset-guard-note[hidden]{display:none!important}
    .asset-guard-note strong{display:block;margin-bottom:2px;color:#83d9f0;font-size:11px;letter-spacing:.08em}
    @media(max-width:600px){.asset-guard-note{left:16px;right:16px;bottom:calc(18px + env(safe-area-inset-bottom,0px))}}
  `;
  document.head.append(style);

  const note = document.createElement("div");
  note.className = "asset-guard-note";
  note.setAttribute("role", "status");
  note.setAttribute("aria-live", "polite");
  note.hidden = true;
  document.body.append(note);

  const key = "yb-image-guard-attempts";
  const windowMs = 60_000;
  let attempts = [];
  let hideTimer;
  try { attempts = JSON.parse(sessionStorage.getItem(key) || "[]"); } catch (_) {}
  if (!Array.isArray(attempts)) attempts = [];

  const record = () => {
    const now = Date.now();
    attempts = attempts.filter(t => typeof t === "number" && now - t < windowMs);
    attempts.push(now);
    try { sessionStorage.setItem(key, JSON.stringify(attempts)); } catch (_) {}
    note.innerHTML = attempts.length >= 3
      ? "<strong>저작권 안내</strong>유별난PPT의 디자인 작업물입니다. 무단 복제·재사용을 금지합니다."
      : "<strong>작업 이미지 안내</strong>포트폴리오 이미지의 저장은 제한됩니다.";
    note.hidden = false;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { note.hidden = true; }, attempts.length >= 3 ? 6500 : 3200);
  };

  document.addEventListener("contextmenu", e => {
    if (!e.target.closest(protectedArea)) return;
    e.preventDefault();
    record();
  });
  document.addEventListener("dragstart", e => {
    if (!e.target.closest(protectedArea)) return;
    e.preventDefault();
    record();
  });
  document.addEventListener("keydown", e => {
    if (!document.querySelector("#lb.open")) return;
    const savePage = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";
    const printScreen = e.key === "PrintScreen" || e.code === "PrintScreen";
    if (!savePage && !printScreen) return;
    if (savePage) e.preventDefault();
    record();
  });
})();

