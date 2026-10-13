/* 포트폴리오 데이터 (v3 · 2026-10-11)
   - category: "ir" | "proposal" | "profile" | "editorial"
   - orient: "landscape" | "portrait"  (세로형은 썸네일에 여백, 팝업은 contain)
   - featured: 메인(index) 미리보기 6개
   - hidden: true면 어디에도 보이지 않음 (이미지가 없는 항목)
   - year가 빈 문자열이면 카드에서 연도 생략 */
window.PORTFOLIO_CATEGORIES = [
  { id: "ir",        label: "IR",        en: "IR Pitch Deck",     desc: "투자 유치 · 데모데이 발표 자료" },
  { id: "proposal",  label: "제안서",     en: "Business Proposal", desc: "제안서 · 사업계획서 · 정부지원사업 발표" },
  { id: "profile",   label: "소개서",     en: "Company Profile",   desc: "회사소개서 · 제품 소개서 · 브랜드 소개서" },
  { id: "editorial", label: "편집 디자인", en: "Editorial Design",  desc: "교육 안내책자 · 다이어리" },
];
const pf = (id, n) => ({
  thumb: `assets/img/portfolio/${id}/thumb.jpg`,
  cover: `assets/img/portfolio/${id}/cover.jpg`,
  slides: Array.from({ length: n }, (_, i) => `assets/img/portfolio/${id}/s${i + 1}.jpg`),
});
window.PORTFOLIO = [
  // IR
  { id: "refilly",     name: "리필리",          category: "ir", year: "",     summary: "친환경 종이팩 리필 솔루션 IR",          orient: "landscape", featured: true,  ...pf("refilly", 2) },
  { id: "mindsground", name: "마인즈그라운드",   category: "ir", year: "",     summary: "B2B 세일즈 플랫폼 IR",                  orient: "landscape", featured: true,  ...pf("mindsground", 2) },
  { id: "drbelab",     name: "닥터비랩",        category: "ir", year: "2025", summary: "기능성 식품 · 의약품 개발 IR",           orient: "landscape", featured: true,  ...pf("drbelab", 1) },
  { id: "gears",       name: "기어스컴퍼니",     category: "ir", year: "",     summary: "지역 특산물 건강 간식 브랜드 IR",        orient: "landscape", ...pf("gears", 2) },
  { id: "farmkit",     name: "팜킷",            category: "ir", year: "2025", summary: "푸드커머스 개인화 마케팅 SaaS IR",        orient: "landscape", ...pf("farmkit", 2) },
  { id: "springsoft",  name: "스프링소프트",     category: "ir", year: "2024", summary: "시니어 인지 · 여가 케어 솔루션 IR",      orient: "landscape", ...pf("springsoft", 1) },
  { id: "langplant",   name: "언어발전소",       category: "ir", year: "2023", summary: "화상 언어재활 플랫폼 IR",               orient: "landscape", ...pf("langplant", 2) },
  { id: "ezpax",       name: "이지팍스",         category: "ir", year: "",     summary: "게임 데모데이 IR",                      orient: "landscape", ...pf("ezpax", 2) },
  { id: "invigo",      name: "인비고웍스",       category: "ir", year: "",     summary: "제조 생산공정 최적화 솔루션 IR",         orient: "landscape", ...pf("invigo", 0) },
  { id: "tofmobility", name: "토프모빌리티",     category: "ir", year: "",     summary: "항공 모빌리티 IR",                      orient: "landscape", ...pf("tofmobility", 0) },
  // 제안서 · 사업계획서
  { id: "spne",        name: "에스피앤이",       category: "proposal", year: "", summary: "소방 연기 제거 스프링클러 기술 사업계획", orient: "landscape", ...pf("spne", 2) },
  { id: "geogrid",     name: "지오그리드",       category: "proposal", year: "", summary: "수질 진단 R&D 사업계획 발표",          orient: "landscape", ...pf("geogrid", 0) },
  // 회사 · 제품 소개서
  { id: "unity",       name: "어니티",          category: "profile", year: "",     summary: "비건 세정용품 회사소개서 (국문 · 영문)", orient: "landscape", featured: true, ...pf("unity", 4) },
  { id: "sakura",      name: "사쿠라테이엔",     category: "profile", year: "",     summary: "이자카야 브랜드 소개서",               orient: "landscape", featured: true, ...pf("sakura", 2) },
  { id: "geogrid-blos", name: "지오그리드 BLOS", category: "profile", year: "2026", summary: "수돗물 수질관리 시스템 제품 소개서",     orient: "landscape", featured: true, ...pf("geogrid-blos", 1) },
  { id: "mfference",   name: "메이퍼런스",       category: "profile", year: "",     summary: "퍼포먼스 마케팅 회사소개서",            orient: "landscape", ...pf("mfference", 2) },
  { id: "sawol",       name: "노무법인 사월",    category: "profile", year: "2025", summary: "노무법인 법인소개서",                  orient: "landscape", ...pf("sawol", 2) },
  { id: "seongam",     name: "특허법인 성암",    category: "profile", year: "2025", summary: "상표부 소개서",                        orient: "landscape", ...pf("seongam", 2) },
  { id: "disaster",    name: "재난안전구호함",   category: "profile", year: "",     summary: "재난안전구호함 제품 소개서",            orient: "portrait",  ...pf("disaster", 1) },
  { id: "swinggirls",  name: "스윙걸즈",        category: "profile", year: "",     summary: "회사소개서 (유별난PPT 회사소개서)",      orient: "landscape", ...pf("swinggirls", 1) },
  // 편집 디자인
  { id: "jahwal",      name: "한국자활연수원",   category: "editorial", year: "2024–2026", summary: "교육프로그램 안내책자",            orient: "portrait", ...pf("jahwal", 5) },
  { id: "diary",       name: "잘될거야 다이어리", category: "editorial", year: "",          summary: "다이어리 편집 디자인",              orient: "portrait", ...pf("diary", 2) },
  // 이미지 없음 → 숨김 (데이터만 보관)
  { id: "farm360",     name: "팜360",     category: "ir", year: "",          summary: "IR Pitch Deck",                  hidden: true, thumb: "", cover: "", slides: [] },
  { id: "sopoong",     name: "소풍",      category: "ir", year: "2024–2025", summary: "데모데이 참가팀 IR Deck 제작",     hidden: true, thumb: "", cover: "", slides: [] },
  { id: "khu",         name: "경희대학교", category: "ir", year: "2024–2025", summary: "캠퍼스타운 데모데이 IR Deck 제작", hidden: true, thumb: "", cover: "", slides: [] },
];
window.pfVisible = () => window.PORTFOLIO.filter((p) => !p.hidden && p.thumb);

// 예전 공유 링크(?p=dr-oregonin)를 새 id로 연결
window.PORTFOLIO_ALIAS = { "dr-oregonin": "drbelab" };

/* 공통 렌더링 도우미 (메인 · 포트폴리오 페이지에서 같이 사용) */
window.pfEsc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

window.pfCategory = (item) => window.PORTFOLIO_CATEGORIES.find((c) => c.id === item.category) || { en: "", label: "" };

// 이미지가 없거나 불러오지 못하면 보여 줄 브랜드 표지 카드
window.pfCoverCard = (item) => {
  const esc = window.pfEsc;
  return `<div class="cover cover--${esc(item.category)}">
      <span class="cover__brand">YOUSTAR PPT</span>
      <span class="cover__cat">${esc(window.pfCategory(item).en)}</span>
      <b class="cover__name">${esc(item.name)}</b>
    </div>`;
};
window.pfImgFail = (img) => {
  const item = window.PORTFOLIO.find((p) => p.id === img.dataset.pf);
  if (item) img.outerHTML = window.pfCoverCard(item);
  else img.remove();
};

// 이미지가 있으면 이미지, 없으면 브랜드 표지 카드
window.pfThumb = (item, big = false) => {
  const esc = window.pfEsc;
  const src = big ? item.cover || item.thumb : item.thumb;
  if (!src) return window.pfCoverCard(item);
  // 썸네일은 800x450(세로형도 여백을 넣은 16:9), 큰 표지는 가로 1600x900 · 세로는 실제 비율
  const size = !big ? 'width="800" height="450"' : item.orient === "portrait" ? "" : 'width="1600" height="900"';
  return `<img src="${esc(src)}" alt="${esc(`${item.name} ${item.summary} 표지`)}" ${size} loading="lazy" decoding="async" data-pf="${esc(item.id)}" onerror="pfImgFail(this)">`;
};
