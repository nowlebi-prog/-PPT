/* ==========================================================
   변환 사례 (첫 화면 + "지금 가진 자료로, 여기까지" 섹션)
   ----------------------------------------------------------
   - before: 고객이 준 자료 이미지 / after: 완성 슬라이드 이미지 (16:9 권장)
   - example: true  → 화면에 "제작 예시" 표시 (자체 제작 예시일 때)
     실제 고객 사례로 바꾸면 false 로 바꾸고, 공개 동의받은 자료만 넣어주세요.
   - optional: true → 이미지 파일이 없으면 자동으로 숨김
   ========================================================== */
window.CASES = [
  {
    id: "draft",
    tab: "정리 안 된 초안",
    tabTo: "완성 슬라이드",
    input: "글자만 가득한 PPT 초안",
    work: ["핵심 메시지 추출", "정보 구조 재설계", "수치 시각화"],
    output: "한눈에 읽히는 요약 슬라이드",
    before: "assets/img/slides/before.svg",
    after: "assets/img/slides/after.svg",
    example: true,
  },
  {
    id: "tech",
    tab: "텍스트뿐인 기술 설명",
    tabTo: "한눈에 보이는 도해",
    input: "문단으로 된 기술 · 사업 설명",
    work: ["흐름 정리", "단계별 도해 설계", "용어 단순화"],
    output: "평가자가 바로 이해하는 프로세스 도해",
    before: "assets/img/slides/tech-before.svg",
    after: "assets/img/slides/prop-process.svg",
    example: true,
  },
  {
    id: "product",
    tab: "제품 사진 한 장",
    tabTo: "발표용 비주얼",
    input: "고객이 보내준 제품 사진",
    work: ["연출 방향 기획", "AI 비주얼 제작 · 검수", "슬라이드 편집"],
    output: "제품이 돋보이는 소개 슬라이드",
    // 파일을 넣으면 자동으로 나타납니다
    before: "assets/img/cases/product-before.jpg",
    after: "assets/img/cases/product-after.jpg",
    example: false,
    optional: true,
  },
];
