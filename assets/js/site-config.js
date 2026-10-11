/* ==========================================================
   유별난PPT - 사이트 공통 값 (다른 스크립트보다 먼저 로드)
   연락처 · 플랫폼 주소 · 실적 숫자는 여기서만 고칩니다.
   ========================================================== */
window.SITE = {
  kakao: "https://pf.kakao.com/_XgRWxj/chat",
  email: "youstar_ppt@naver.com",
  hours: "09:00 – 17:00",
  kmong: { ir: "https://kmong.com/gig/334236", profile: "https://kmong.com/gig/404096" },
  soomgo: "", // 숨고 프로필 주소. 비어 있으면 숨고 배지를 숨김
  stats: { deals: 442, rating: 4.9, reviews: 359, asOf: "2026.10", demodayTeams: 44, demodayYears: "2024–2025" },
};

/* data-site-link="kmong.ir" 처럼 SITE 값으로 링크를 채우고, 값이 비면 그 요소를 숨김 */
(() => {
  const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), window.SITE);
  const apply = () =>
    document.querySelectorAll("[data-site-link]").forEach((el) => {
      const url = get(el.dataset.siteLink);
      if (url) el.setAttribute("href", url);
      el.hidden = !url;
    });
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", apply) : apply();
})();
