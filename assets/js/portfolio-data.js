/* ==========================================================
   포트폴리오 데이터
   ----------------------------------------------------------
   - 프로젝트 추가: 아래 배열에 객체를 하나 더 넣으면 끝 (개수 제한 없음)
   - category: "ir" | "proposal" | "profile"
   - thumb: 목록 썸네일 (16:9 권장, 예: "assets/img/portfolio/gears/thumb.jpg")
   - cover: 팝업 상단 대표 이미지 (비우면 thumb 사용)
   - slides: 팝업 안 슬라이드 이미지 (4장 권장, 개수 자유)
   이미지가 비어 있으면 브랜드 표지 카드가 자동으로 표시됩니다.
   ※ category / summary 는 임시 값입니다. 실제 내용으로 바꿔주세요.
   ========================================================== */

window.PORTFOLIO_CATEGORIES = [
  { id: "ir", label: "IR", en: "IR Pitch Deck", desc: "투자유치 · 데모데이 피칭덱" },
  { id: "proposal", label: "제안서", en: "Business Proposal", desc: "B2B 제안서 · 공공기관 입찰" },
  { id: "profile", label: "소개서", en: "Company Profile", desc: "회사소개서 · 브랜드 소개서" },
];

window.PORTFOLIO = [
  { id: "gears", name: "기어스컴퍼니", category: "ir", year: "2025", summary: "IR Pitch Deck", thumb: "", cover: "", slides: [] },
  { id: "refilly", name: "리필리", category: "ir", year: "2025", summary: "IR Pitch Deck", thumb: "", cover: "", slides: [] },
  { id: "mindsground", name: "마인즈그라운드", category: "ir", year: "2025", summary: "IR Pitch Deck", thumb: "", cover: "", slides: [] },
  { id: "geogrid", name: "지오그리드", category: "ir", year: "2025", summary: "IR Pitch Deck", thumb: "", cover: "", slides: [] },
  { id: "dr-oregonin", name: "닥터오레고닌", category: "ir", year: "2025", summary: "IR Pitch Deck", thumb: "", cover: "", slides: [] },
  { id: "farmkit", name: "팜킷", category: "ir", year: "2025", summary: "IR Pitch Deck", thumb: "", cover: "", slides: [] },
  { id: "farm360", name: "팜360", category: "ir", year: "2025", summary: "IR Pitch Deck", thumb: "", cover: "", slides: [] },
  { id: "invigo", name: "인비고웍스", category: "ir", year: "2025", summary: "IR Pitch Deck", thumb: "", cover: "", slides: [] },
  { id: "tofmobility", name: "토프모빌리티", category: "ir", year: "2025", summary: "IR Pitch Deck", thumb: "", cover: "", slides: [] },
  { id: "sopoong", name: "소풍", category: "ir", year: "2024–2025", summary: "데모데이 참가팀 IR Deck 제작", thumb: "", cover: "", slides: [] },
  { id: "khu", name: "경희대학교", category: "ir", year: "2024–2025", summary: "캠퍼스타운 데모데이 IR Deck 제작", thumb: "", cover: "", slides: [] },

  { id: "springsoft", name: "스프링소프트", category: "proposal", year: "2025", summary: "Business Proposal", thumb: "", cover: "", slides: [] },
  { id: "spne", name: "에스피앤이", category: "proposal", year: "2025", summary: "Business Proposal", thumb: "", cover: "", slides: [] },
  { id: "unity", name: "어니티", category: "proposal", year: "2025", summary: "Business Proposal", thumb: "", cover: "", slides: [] },

  { id: "langplant", name: "언어발전소", category: "profile", year: "2025", summary: "Company Profile", thumb: "", cover: "", slides: [] },
  { id: "mfference", name: "메이퍼런스", category: "profile", year: "2025", summary: "Company Profile", thumb: "", cover: "", slides: [] },
];

/* 공통 렌더링 도우미 (메인 · 포트폴리오 페이지에서 같이 사용) */
window.pfEsc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

window.pfCategory = (item) => window.PORTFOLIO_CATEGORIES.find((c) => c.id === item.category) || { en: "", label: "" };

// 이미지가 있으면 이미지, 없으면 브랜드 표지 카드
window.pfThumb = (item, big = false) => {
  const esc = window.pfEsc;
  const src = big ? item.cover || item.thumb : item.thumb;
  if (src) return `<img src="${esc(src)}" alt="${esc(item.name)}" loading="lazy" decoding="async">`;
  return `<div class="cover cover--${esc(item.category)}">
      <span class="cover__brand">YOUSTAR PPT</span>
      <span class="cover__cat">${esc(window.pfCategory(item).en)}</span>
      <b class="cover__name">${esc(item.name)}</b>
    </div>`;
};
