// Monetary values are integer KRW. Draft prices are never public quotations.
export const site = {
  brand: '유별난PPT',
  email: 'contact@youstarppt.com',
  phone: '010-8186-8553',
  fax: '0504-410-8553',
  kakao: 'https://pf.kakao.com/_XgRWxj/chat',
  taxPolicy: 'pending',
  inquiryEndpoint: null,
  privacyApproved: false,
  privacyPolicy: null, // Approved [{heading, body}] required before activation.
};

export const pricing = [
  {
    id: 'ppt-a', name: 'BASIC', desc: '디자인 유지 + 편집화', prepared: '디자인 확정 초안',
    summary: '편집화 간단 리터치', unitPrice: 20000, setupFee: 0, minPages: null, status: 'draft',
    included: ['원본 디자인 방향 유지', '편집 가능한 텍스트·기본 도형과 이미지로 유지되는 요소를 파일별로 확인'],
    excluded: ['새 디자인 시안', '복잡한 차트·인포그래픽 재제작은 자료 확인 후 안내'],
  },
  {
    id: 'ppt-b', name: 'PRO', desc: '브랜드 맞춤 디자인', prepared: '페이지별 내용 확정 초안',
    summary: '브랜드 시안 전체 디자인', unitPrice: 20000, setupFee: 100000, minPages: 5, status: 'draft',
    included: ['표지·목차·내지의 대표 방향과 기본 스타일', '전체 디자인'],
    excluded: ['재의뢰 시 세팅비 면제 조건은 미확정'],
  },
  {
    id: 'ppt-c', name: 'PREMIUM', desc: '기획부터 디자인까지', prepared: '줄글과 참고 자료',
    summary: '발표 흐름 페이지 기획 전체 디자인', unitPrice: 30000, setupFee: 0, minPages: null, status: 'draft',
    included: ['전달 순서·페이지 분할·핵심 문구 정리', '전체 디자인'],
    excluded: ['시장 조사', '재무 모델', '투자 전략', '번역', '법률 검토'],
  },
];

const websiteCommon = ['메인 7개 섹션 이내', '최대 10팀 소개', 'PC·모바일 대응', '제공 원고·사진 기준 제작'];
const websiteExcluded = [
  '10팀 초과', '별도 다국어', '독립 페이지 대량 추가', '유료 이미지 구매',
  '회원가입', '결제', '투자자 미팅 매칭', '좌석 배정', 'QR 체크인',
  '이메일·문자 자동 발송', '독립 관리자 대시보드',
  '도메인·호스팅·유료 서비스 이용료', '유지보수 기간과 행사 후 운영 주체는 별도 협의',
];

export const websiteOptions = [
  {
    id: 'web-info', name: '행사 안내형', status: 'draft', price: 400000,
    features: [...websiteCommon, '행사 소개 프로그램 팀 연사 장소', '외부 신청 링크 연결', '별도 명단 기능 없음', '팀별 상세는 메인 소개 범위', '자료와 영상은 메인 제공 범위 협의', '행사 후 변경은 별도 협의'],
    excluded: [...websiteExcluded],
  },
  {
    id: 'web-register', name: '참가 신청형', status: 'draft', price: 700000,
    features: [...websiteCommon, '안내형 전체', '자체 신청폼 완료 화면 신청 마감', '승인된 연동 경로로 명단 저장', '팀별 상세는 메인 소개 범위', '자료와 영상은 메인 제공 범위 협의', '제출·중복·마감·오류·완료 화면', '행사 후 변경은 별도 협의'],
    excluded: [...websiteExcluded],
  },
  {
    id: 'web-archive', name: '행사 아카이브형', status: 'draft', price: 1000000,
    features: [...websiteCommon, '신청형 전체', '자체 신청폼 포함', '승인된 연동 경로로 명단 저장', '팀별 상세 소개', '제공 IR 자료 영상 연결', '제공 사진과 영상 업데이트 1회 제안'],
    excluded: [...websiteExcluded, '행사 측에서 제공·공개 승인하지 않은 IR 자료'],
  },
];

export const included = [
  { title: '자료 분석', description: '제공 자료를 바탕으로 내용의 우선순위를 정리합니다.', output: '우선순위 메모' },
  { title: '발표 흐름과 페이지 구성', description: '전달 순서·페이지 분할·핵심 문구를 정리합니다.', output: '장표 흐름' },
  { title: '팀별 맞춤 디자인', description: '각 팀의 브랜드와 사업에 맞는 발표자료를 제작합니다.', output: '대표 방향' },
  { title: '전체 장표 제작', description: '흐름과 대표 시안 확인 후 전체 장표를 제작합니다.', output: '최종 장표' },
  { title: '팀별 일정과 피드백 정리', description: '행사 일정에 맞춰 팀별 상태와 피드백을 정리합니다.', output: '팀별 상태와 피드백 정리' },
  { title: 'PPTX와 PDF 납품', description: '직접 수정 가능한 요소와 이미지로 제공되는 요소를 납품 시 안내합니다.', output: 'PPTX·PDF' },
];

export const faq = [
  { question: '정리된 초안이 없어도 되나요', answer: '네. 한 페이지에 담고 싶은 내용이나 줄글, 참고 자료를 보내주시면 필요한 구성 범위를 함께 정리합니다. 내용 기획이 필요한 경우 기획과 디자인 상품으로 안내합니다.' },
  { question: 'AI로 만든 이미지나 PDF도 수정 가능한 PPT로 받을 수 있나요', answer: '자료를 확인한 뒤 편집화 가능한 범위를 안내합니다. 텍스트·기본 도형은 재구성할 수 있지만 복잡한 이미지와 특수 그래픽은 이미지로 유지되거나 별도 재제작이 필요할 수 있습니다.' },
  { question: '직접 수정할 수 있는 파일을 주나요', answer: '계약한 범위에 따라 PPTX와 PDF를 전달합니다. 직접 수정 가능한 요소와 이미지로 제공되는 요소를 납품 시 안내합니다.' },
  { question: '수정은 몇 번 가능한가요', answer: '수정 범위와 횟수는 견적서에서 안내합니다. 확정한 디자인 방향 안의 수정과 내용·방향을 새로 바꾸는 작업을 구분해 협의합니다.' },
  { question: '기업 자료를 비공개로 진행할 수 있나요', answer: '공개 가능 범위를 사전에 확인합니다. 비밀유지와 포트폴리오 공개 여부는 의뢰 단계에서 협의하며, 승인되지 않은 자료는 공개 사례에 사용하지 않습니다.' },
  { question: '영상이나 홈페이지도 함께 의뢰할 수 있나요', answer: '가능합니다. 필요한 결과물과 일정을 알려주시면 PPT 기본 제작과 구분해 범위와 비용을 안내합니다.' },
];

export const processSteps = [
  { title: '자료와 일정 확인', description: '지금 가진 자료와 발표 일정을 알려주세요. 필요한 작업 범위와 견적을 안내합니다.' },
  { title: '흐름과 대표 시안 확인', description: '핵심 메시지와 발표 흐름을 정리하고 브랜드에 맞는 디자인 방향을 확인합니다.' },
  { title: '전체 제작과 피드백', description: '확정한 디자인 방향 안의 수정과 내용·방향을 새로 바꾸는 작업을 구분해 협의합니다.' },
  { title: '검수와 납품', description: '계약한 범위에 따라 PPTX와 PDF를 전달합니다. 직접 수정 가능한 요소와 이미지로 제공되는 요소를 납품 시 안내합니다.' },
];

export const aiSteps = [
  { title: '핵심과 순서 정리', description: '핵심 메시지와 발표 흐름을 정리합니다.' },
  { title: '브랜드 기준으로 디자인', description: '브랜드에 맞는 디자인으로 완성합니다.' },
  { title: '발표와 수정을 위한 완성', description: '편집 가능한 원본으로 완성합니다. 직접 수정 가능한 요소와 이미지로 제공되는 요소를 납품 시 안내합니다.' },
];

export const capabilities = [
  { id: 'presentation-print', title: '발표와 인쇄', description: 'PPT·브로슈어·카탈로그' },
  { id: 'image-video', title: '이미지와 영상', description: '제품 목업·AI 이미지·소개 영상' },
  { id: 'web-content', title: '웹과 콘텐츠', description: '기업·행사 랜딩페이지·SNS·블로그' },
  { id: 'work-tools', title: '업무 도구', description: '자동화·대시보드·개발 및 디자인 가이드' },
];

export const media = [
  { id: 'demo-day', title: '데모데이 홈페이지', kind: 'gif', src: null, poster: null, width: 1600, height: 900, status: 'empty', externalHref: null },
  { id: 'peumoa', title: '프모아', kind: 'gif', src: null, poster: null, width: 1600, height: 900, status: 'empty', externalHref: null },
  { id: 'company-v2', title: '기업 홈페이지', kind: 'gif', src: null, poster: null, width: 1600, height: 900, status: 'empty', externalHref: null },
  { id: 'hero-concept', title: '히어로 시안', kind: 'gif', src: null, poster: null, width: 1600, height: 900, status: 'empty', externalHref: null },
];

export const proof = {
  approved: false,
  title: '자료 전체를 이해하고,\n청중에게 닿는 흐름으로 완성합니다.',
  approvedTitle: '광고 없이,\n소개와 재의뢰로 이어온 6년.',
  description: '자료 전체를 이해하고,\n청중에게 닿는 흐름으로 완성해 왔습니다.',
  source: '사용자 제공 정보 — 집계 확인 및 공개 승인 대기',
  asOf: null,
  metrics: [
    { value: 800, label: '건 이상', approved: false },
    { value: 6, label: '년차', approved: false },
  ],
  testimonials: [],
  logos: [],
};

// Demo day history, copied from the published about page (homepage-live/about.html, 주요 연혁).
export const demodayHistory = [
  { year: 2025, title: '기후테크 데모데이 SWITCH : Growth Stage 성과공유회', host: '소풍커넥트 · 전북특별자치도 · 전북테크노파크', teams: 7 },
  { year: 2025, title: 'Nharvest X 데모데이', host: '소풍커넥트 · 농협', teams: 3 },
  { year: 2025, title: '2025 FutureScape 데모데이', host: '소풍커넥트 · 삼성물산', teams: 6 },
  { year: 2025, title: '2025 경희대학교 캠퍼스타운 데모데이', host: '경희대학교 산학협력단', teams: 6 },
  { year: 2024, title: '2024 타이푼 데모데이', host: '소풍벤처스', teams: 9 },
  { year: 2024, title: '2024 SWITCH 데모데이', host: '소풍벤처스 · 전북특별자치도 · 전북테크노파크', teams: 3 },
  { year: 2024, title: '2024 경희대학교 캠퍼스타운 데모데이', host: '경희대학교 산학협력단', teams: 10 },
];

// Restored from the earlier published home (homepage-live/preview/index.html).
export const stats = [
  { value: 800, unit: '+', label: '누적 작업 건수', image: 'assets/pf/01a.webp' },
  { value: 300, unit: '+', label: '누적 클라이언트', image: 'assets/pf/extra-07a.webp' },
  { value: 4.9, unit: '/5', label: '평균 만족도', image: 'assets/pf/book-23.webp' },
  { value: 458, unit: '+', label: '공식 후기', image: 'assets/pf/12a.webp' },
];

export const partnerLogos = [
  { src: 'assets/clients/msit.svg', name: '과학기술정보통신부' },
  { src: 'assets/clients/mois.svg', name: '행정안전부' },
  { src: 'assets/clients/samsungcnt.svg', name: '삼성물산' },
  { src: 'assets/clients/jeonbuk.svg', name: '전북특별자치도' },
  { src: 'assets/clients/lh.png', name: 'LH' },
  { src: 'assets/clients/nipa.png', name: 'NIPA' },
  { src: 'assets/clients/forest-service.svg', name: '산림청' },
  { src: 'assets/clients/fsec.png', name: '금융보안원' },
  { src: 'assets/clients/kaist.svg', name: 'KAIST' },
  { src: 'assets/clients/sopoong-connect.svg', name: '소풍커넥트' },
  { src: 'assets/clients/koef.png', name: '한국청년기업가정신재단' },
  { src: 'assets/clients/nh.svg', name: 'NH농협' },
  { src: 'assets/clients/woori.svg', name: '우리은행' },
  { src: 'assets/clients/kyunghee.svg', name: '경희대학교 산학협력단' },
  { src: 'assets/clients/korea-univ.svg', name: '고려대학교 산학협력단' },
  { src: 'assets/clients/likelion.svg', name: '멋쟁이사자처럼' },
  { src: 'assets/clients/mindsground.png', name: '마인즈그라운드' },
  { src: 'assets/clients/language-development.png', name: '언어발전소' },
  { src: 'assets/clients/sakura-teien.png', name: '사쿠라테이엔' },
  { src: 'assets/clients/sawol.png', name: '노무법인 사월' },
  { src: 'assets/clients/pknu.png', name: '국립부경대학교' },
  { src: 'assets/clients/compa.webp', name: '과학기술사업화진흥원' },
  { src: 'assets/clients/iwssm.webp', name: '유네스코 I-WSSM' },
  { src: 'assets/clients/gcon.webp', name: '경기콘텐츠진흥원' },
  { src: 'assets/clients/jahwal.webp', name: '한국자활연수원' },
  { src: 'assets/clients/woorihrd.webp', name: '우리들HRD' },
  { src: 'assets/clients/abyplus.webp', name: 'A by Plus' },
  { src: 'assets/clients/creacube.webp', name: '크레아큐브' },
  { src: 'assets/clients/sungam.webp', name: '특허법인 성암' },
];
export const partnerNames = [];

// Real reviews shown on the earlier published home; source: external sales page.
export const reviews = [
  { title: '정리가 덜 된 자료도 찰떡같이 이해하는 알잘딱깔센!', body: "정리가 완벽히 안 된 PPT 초안을 드렸는데도, 찰떡같이 알아들어주시고 정말 '알잘딱깔센'으로 작업해 주셨습니다! 책임감 있게 끝까지 빠른 작업해 주셔서 너무 감사합니다." },
  { title: '벌써 8번째 의뢰, 자료의 톤앤매너를 완벽하게 캐치합니다.', body: '벌써 8번째 작업 의뢰네요. 이번에도 역시 작업 결과물이 기대 이상이었습니다~! 시각적으로도 뛰어나고, 자료의 톤앤매너를 정확하게 반영해 주셔서 만족도가 매우 높았습니다.' },
  { title: '디자인 퀄리티, 피드백 속도, 소통 모두 완벽합니다.', body: '매번 디자이너님께만 작업을 맡기게 되네요~! 요청 사항을 정확히 이해하고 감각적으로 완성해 주셔서 늘 다시 찾게 됩니다. 다음 작업도 계속 부탁드릴 예정입니다.' },
  { title: '단순 의뢰를 넘어, 전문가의 적극적인 의견 개진까지!', body: '의뢰자가 원하는 걸 완벽하게 적용시켜 주는 건 물론이고 적극적인 의견 개진 또한 너무나 감사합니다. 갑작스러운 의뢰에도 최선을 다해 최고의 결과물을 보여주셨습니다.' },
  { title: '촉박한 일정에도 빛을 발하는 정확한 납기일', body: '촉박한 일정 때문에 걱정했는데 최대한 편의를 봐주셔서 너무 감사해요. 결과물도 너무 만족스럽고요. 약속 정확하고 센스 있으시고 정말 잘 이용했습니다.' },
  { title: '세대 불문 취향 저격, 세련되고 깔끔한 디자인', body: '항상 만족하며 이용하고 있습니다. 그 어떤 곳보다도 디자인이 세련되고 깔끔해요. 적은 텍스트도, 많은 텍스트도 가독성 좋게 정리해 주십니다.' },
  { title: '작업물이 완벽 그 자체네요!', body: '작업물이 완벽 그 자체네요. 너무 좋고 친절하시고 다음에도 무조건 이용할 것 같습니다. 성심성의껏 해주셔서 정말 감사합니다!' },
];

// IR consulting record. Empty until the owner supplies entries ({ year, title, host }); the home hides the block while empty.
export const irConsulting = [
  { title: '액셀러레이터 연계 프로그램 참여 기업 IR 컨설팅', host: '세부 내용 비공개' },
  { title: '정부 창업 지원사업 참여 기업 IR 컨설팅', host: '세부 내용 비공개' },
];
// Website showcase. Empty until real GIF/video captures are supplied ({ title, src, poster }); the home hides the section while empty.
export const webShowcase = [
  { title: '데모데이 행사 페이지', sub: '참가팀, 일정, 심사위원, 사전 등록까지 한 페이지로 (샘플)', src: 'assets/web/forge-demo.webp', poster: 'assets/web/forge-demo-poster.webp' },
  { title: '기업 홈페이지 시안 A', sub: '작업 사례와 서비스, 가격을 한 흐름으로 (샘플)', src: 'assets/web/company-a.webp', poster: 'assets/web/company-a-poster.webp' },
  { title: '기업 홈페이지 시안 B', sub: '3D 히어로와 포트폴리오 쇼케이스 (샘플)', src: 'assets/web/company-b.webp', poster: 'assets/web/company-b-poster.webp' },
  { title: '반응형 웹 서비스 · 프모아', sub: 'PC와 모바일에 맞춰 바뀌는 서비스 홈페이지', src: 'assets/web/peumoa.webp', poster: 'assets/web/peumoa-poster.webp' },
];
