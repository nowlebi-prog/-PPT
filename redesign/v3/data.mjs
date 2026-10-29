// Monetary values are integer KRW. Only approved prices are stored here: this file is public on GitHub Pages.
export const site = {
  brand: '유별난PPT',
  url: 'https://nowlebi-prog.github.io/-PPT/redesign/v3/', // 공개 주소. 링크 미리보기(og:url·og:image)에 씁니다.
  email: 'contact@youstarppt.com',
  phone: '010-8186-8553',
  fax: '0504-410-8553',
  kakao: 'https://pf.kakao.com/_XgRWxj/chat',
  hours: '09:00 – 17:00',
  taxPolicy: 'pending',
  // 문의 접수 연동. Formspree: inquiryProvider 'formspree' + inquiryEndpoint 'https://formspree.io/f/폼ID'.
  // 자체 서버: inquiryProvider 'api' + inquiryEndpoint '/api/inquiries' (OPERATIONS.md 참고).
  // 비어 있으면 폼은 '이메일 작성하기'로 동작하고, 접수 완료 화면을 띄우지 않습니다.
  // Web3Forms: inquiryProvider 'web3forms' + inquiryEndpoint 'https://api.web3forms.com/submit' + inquiryKey(액세스 키).
  // 구글 시트: inquiryProvider 'google' + inquiryEndpoint(Apps Script 웹 앱 주소). 설정 순서는 FORM_SETUP.md.
  inquiryProvider: 'google',
  inquiryEndpoint: 'https://script.google.com/macros/s/AKfycbwEreT8ghxoNvqLF29rkVfG0LER2f59lMeu4hormVmcDwMROb0-kFbU4swtab4VHRVM/exec',
  inquiryKey: null,
  inquiryFiles: false, // 접수 서비스가 파일 첨부를 받을 때만 true (Formspree 유료 플랜 등)
  inquiryMaxFileMB: null, // 접수 서비스의 첨부 한도(MB)
  privacyApproved: true, // 2026-10-28 구글 시트 접수 연결과 함께 게시. false로 바꾸면 전송이 꺼지고 '이메일 작성하기'로 돌아갑니다.
  privacyPolicy: [ // 구글 시트 접수 기준 안내문 (PRIVACY_DRAFT.md). 책임자 이름 등은 확정 시 고칩니다.
    { heading: '수집하는 항목', body: '견적 문의 시 이름, 회사·기관명, 이메일, 전화번호, 첨부 자료(공유 링크)와 문의 내용(자료 용도, 자료 상태, 필요한 날짜, 분량, 예산 등)을 받습니다. 이름과 회신 연락처(이메일 또는 전화 중 하나)는 견적을 안내하는 데 필요한 항목입니다.' },
    { heading: '이용 목적', body: '견적 상담과 회신, 작업 범위와 일정 안내에만 사용합니다. 광고나 마케팅 목적으로 쓰지 않습니다.' },
    { heading: '보유 기간', body: '상담 종료 후 1년 동안 보관한 뒤 파기합니다. 계약을 맺은 경우에는 관련 법령에서 정한 기간 동안 보관합니다.' },
    { heading: '처리 위탁', body: '문의 접수와 보관에 Google LLC의 Google 스프레드시트와 Apps Script를 사용하며, 접수 알림은 Gmail로 받습니다. 접수 내용은 Google이 운영하는 해외(미국 등) 서버에 저장될 수 있습니다. 위탁받은 곳은 접수·보관·알림 외의 목적으로 개인정보를 처리하지 않습니다.' },
    { heading: '제3자 제공', body: '법령에 따른 경우를 제외하고, 동의 없이 제3자에게 제공하지 않습니다.' },
    { heading: '첨부 자료와 작업 사례', body: '보내 주신 자료는 견적 확인에만 사용하며 공개하지 않습니다. 포트폴리오 활용 협의 동의는 선택 사항이며, 동의하신 경우에도 별도로 공개 승인을 받은 뒤에만 작업 사례로 사용합니다.' },
    { heading: '정보주체의 권리', body: '언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다. 아래 문의처로 알려 주시면 지체 없이 처리합니다.' },
    { heading: '개인정보 보호책임자와 문의처', body: '유별난PPT 대표 · contact@youstarppt.com · 010-8186-8553 · 사업자등록번호 202-13-66345' },
    { heading: '시행일', body: '이 안내는 홈페이지에 게시한 날부터 적용합니다.' },
  ],
  reviewSourceUrl: null, // 후기 원문 링크. 확인된 출처일 때만 '후기 원문 보기' 버튼이 나옵니다.
};

// Draft prices were removed before publishing. Approve a tier by adding unitPrice (and setupFee/minPages) and status 'approved'.
export const pricing = [
  {
    id: 'ppt-a', name: 'BASIC', status: 'draft', unitPrice: null, setupFee: null, minPages: null,
    tagline: '디자인은 그대로, 편집 가능한 PPT로.',
    when: '디자인이 완성된 이미지·PDF를 수정 가능한 PPT로 바꾸고 싶을 때.',
    scope: '기존 디자인을 바탕으로 텍스트와 기본 도형을 다시 구성하고, 어긋난 부분을 다듬습니다.',
  },
  {
    id: 'ppt-b', name: 'PRO', status: 'draft', unitPrice: null, setupFee: null, minPages: null,
    tagline: '정리된 내용에, 새로운 디자인을.',
    when: '페이지별 내용은 정해졌고, 브랜드에 맞는 디자인이 필요할 때.',
    scope: 'BASIC 제공 범위에 브랜드 맞춤 표지·목차·내지와 차트·인포그래픽 디자인을 더합니다.',
  },
  {
    id: 'ppt-c', name: 'PREMIUM', status: 'draft', unitPrice: null, setupFee: null, minPages: null,
    tagline: '내용의 시작부터, 디자인의 완성까지.',
    when: '줄글·메모·참고 자료부터 발표자료를 만들어야 할 때.',
    scope: 'PRO 제공 범위에 발표 흐름, 페이지 구성, 장표별 핵심 문장 정리를 더합니다.',
  },
];

export const pricingNotes = [
  '제작비는 분량과 작업 범위에 따라 달라집니다. 수정 횟수, 제공 파일, 부가세 기준과 최종 금액은 견적서로 안내합니다.',
  '시장조사, 재무 모델, 투자 전략, 번역, 법률 검토는 기본 범위에 포함되지 않으며 필요 시 별도로 협의합니다.',
];

// Pricing table rows: what each tier includes (from the tiers' scope sentences above). [label, [BASIC, PRO, PREMIUM]]
export const pricingRows = [
  ['편집 가능한 PPTX · PDF 납품', [1, 1, 1]],
  ['텍스트 · 기본 도형 재구성과 다듬기', [1, 1, 1]],
  ['브랜드 맞춤 표지 · 목차 · 내지 디자인', [0, 1, 1]],
  ['차트 · 인포그래픽 디자인', [0, 1, 1]],
  ['발표 흐름 · 페이지 구성', [0, 0, 1]],
  ['장표별 핵심 문장 정리', [0, 0, 1]],
];

// Institution (demoday) base price. Shown on screen and in the team calculator only when status is 'approved'.
export const demodayPrice = { status: 'pending', // 2026-10-29 owner: show '가격은 별도 협의' only. 'approved' shows the per-team price and calculator.
   perTeam: 500000, pagesIncluded: 20, extraPerPage: 25000 };

// Website pricing (owner copy, 2026-10-29). price: integer KRW start price, shown with priceNote ('부터').
export const websiteOptions = [
  {
    id: 'web-intro', name: '소개형', status: 'approved', price: 400000, priceNote: '부터',
    tagline: '회사·서비스·행사 정보를 한 페이지에.',
    include: ['원페이지 구성 · 최대 7개 섹션', '기존 디자인 구성을 활용한 브랜드 색상·이미지 적용', '제공된 원고·로고·이미지 배치', 'PC·모바일 반응형 제작', '이메일·카카오톡·외부 신청 링크 연결', '최초 사이트 공개 및 링크 작동 확인', '확정된 구성 내 문구·이미지 수정 2회'],
    useFor: '스타트업·기업 소개 / 제품·서비스 소개 / 행사 안내',
  },
  {
    id: 'web-form', name: '폼 연동형', status: 'approved', price: 700000, priceNote: '부터',
    tagline: '소개부터 문의·신청 접수까지.',
    include: ['소개형 제공 범위 전체 포함', '문의 또는 신청폼 1종 · 입력 항목 최대 10개', '기존 폼 서비스 또는 구글폼·시트 연동', '접수 내용 저장·확인 및 내보내기 설정', '폼 제출·저장 작동 테스트', '접수 내역 확인 방법 안내', '행사 신청 시 접수 마감 설정'],
    useFor: '상담·도입 문의 / 행사 참가 신청 / 프로그램 신청',
  },
];
export const websiteExtra = {
  name: '추가 제작', price: '별도 견적',
  include: ['페이지·섹션 추가 및 맞춤 디자인', '원고 작성·콘텐츠 기획·번역', '행사 후 사진·자료·영상 링크 업데이트', '이미지 제작·촬영·영상 편집', '맞춤 관리자·회원·결제 등 별도 기능', '정기 콘텐츠 수정 및 운영 관리'],
};
export const websitePricing = {
  title: [['기업 소개부터', '행사 안내까지,'], ['필요한 웹사이트를', '합리적으로.']],
  lead: '준비된 콘텐츠를 바탕으로 PC와 모바일에 맞는 웹사이트를 제작합니다.',
  notes: [
    ['가격 안내', '표기 금액은 부가세 별도 시작가입니다. 최종 비용은 콘텐츠 분량과 기능 범위를 확인한 뒤 안내합니다.'],
    ['제작 기준', '고객이 제공한 원고와 이미지, 기존 디자인 구성을 기준으로 제작합니다. 수정 1회는 취합된 요청 1건을 기준으로 하며, 확정 후 구성 변경과 신규 기능 추가는 별도 견적입니다.'],
    ['운영 비용', '도메인·호스팅·유료 폼 서비스 등 외부 서비스 이용료는 별도입니다. 운영 기간과 연장 비용은 계약 시 안내합니다. 신청자 응대·명단 관리·상시 운영 대행은 포함되지 않습니다.'],
  ],
  footnote: '폼 연동형은 외부 서비스의 지원 범위 내에서 제공하며, 별도 관리자 시스템 개발은 포함되지 않습니다.',
};

export const included = [
  { title: '자료 분석', description: '제공 자료를 바탕으로 내용의 우선순위를 정리합니다.', output: '우선순위 메모' },
  { title: '발표 흐름과 페이지 구성', description: '전달 순서·페이지 분할·핵심 문구를 정리합니다.', output: '장표 흐름' },
  { title: '팀별 맞춤 디자인', description: '각 팀의 브랜드와 사업에 맞는 발표자료를 제작합니다.', output: '대표 방향' },
  { title: '전체 장표 제작', description: '흐름과 대표 시안 확인 후 전체 장표를 제작합니다.', output: '최종 장표' },
  { title: '팀별 일정과 피드백 정리', description: '행사 일정에 맞춰 팀별 상태와 피드백을 정리합니다.', output: '팀별 상태와 피드백 정리' },
  { title: 'PPTX와 PDF 납품', description: '직접 수정 가능한 요소와 이미지로 제공되는 요소를 납품 시 안내합니다.', output: 'PPTX·PDF' },
];

export const faq = [
  { question: '정리된 초안이 없어도 시작할 수 있나요?', answer: '네. 줄글이나 메모, 참고 자료부터 시작할 수 있습니다. 내용 구성까지 필요하다면 PREMIUM 서비스를 기준으로 범위를 안내합니다.' },
  { question: 'IR 자료의 내용도 함께 정리하나요?', answer: '발표 순서, 페이지 구성, 핵심 문장을 정리합니다. 시장조사와 재무 모델 작성은 기본 범위에 포함되지 않습니다.' },
  { question: '이미지나 PDF도 수정 가능한 PPT로 받을 수 있나요?', answer: '자료를 확인해 편집 가능한 범위를 먼저 안내합니다. 텍스트와 기본 도형은 다시 구성할 수 있지만, 복잡한 그래픽은 이미지로 유지되거나 별도 재제작이 필요할 수 있습니다.' },
  { question: '수정은 어디까지 가능한가요?', answer: '수정 횟수와 범위는 견적서에 안내합니다. 확정한 방향 안에서의 수정과 내용·디자인 방향을 새로 바꾸는 작업은 구분해 협의합니다.' },
  { question: '회사 자료를 비공개로 진행할 수 있나요?', answer: '네. 의뢰 단계에서 공개 범위를 먼저 확인합니다. 공개를 허락받지 않은 자료는 작업 사례에 사용하지 않습니다.' },
  { question: '일정이 촉박한데 제작할 수 있나요?', answer: '자료의 양과 제작 범위, 현재 일정을 확인해 가능 여부를 안내합니다. 1주 이내에 필요하다면 카카오톡으로 희망 일정과 자료 상태를 먼저 알려주세요.' },
  { question: '여러 팀의 자료를 한 번에 맡길 수 있나요?', answer: '네. 기관이 자료를 취합하거나 팀별로 직접 소통하는 방식 모두 협의할 수 있습니다. 팀마다 진행 상태와 피드백을 정리해 행사 일정에 맞춰 제작합니다.' },
  { question: '홈페이지나 영상도 함께 의뢰할 수 있나요?', answer: '네. 필요한 제작물과 일정을 알려주시면 PPT 제작과 구분해 범위와 비용을 안내합니다.' },
];

// 작업 방식: what gets fixed, then how it proceeds.
export const workPoints = [
  { title: '많은 내용은, 핵심이 보이는 구조로.', body: '한 장에 몰린 내용을 나누고, 먼저 읽혀야 할 문장을 정리합니다. 브랜드에 맞는 색과 서체로 정보의 우선순위를 보여줍니다.' },
  { title: '숫자는, 제공된 근거와 함께.', body: '보내주신 원자료와 장표의 수치를 대조합니다. 일치하지 않거나 확인이 필요한 부분은 표시해 함께 확인합니다.' },
  { title: '제품의 강점은, 눈에 보이게.', body: '제품 사진이 전달해야 할 특징을 살려 배치합니다. 필요한 목업 이미지와 영상은 별도 범위로 협의합니다.' },
];

export const processSteps = [
  { title: '자료와 일정 확인', description: '준비된 자료와 발표 일정을 살펴 제작 범위와 견적을 안내합니다.' },
  { title: '구성과 디자인 방향 설정', description: '선택한 서비스에 맞춰 자료의 흐름 또는 대표 시안을 먼저 확인합니다.' },
  { title: '전체 제작과 피드백', description: '확인한 방향으로 전체 자료를 제작하고, 협의한 범위의 피드백을 반영합니다.' },
  { title: '최종 파일 전달', description: 'PPTX와 PDF를 전달하며, 직접 수정할 수 있는 요소와 이미지로 제공되는 요소를 안내합니다.' },
];

export const demodayFlow = ['기관 일정 확인', '팀별 자료 취합', '구성·대표 시안 확인', '전체 제작', '최종 검수·납품'];

// 함께 맡길 수 있는 제작. obj = decorative concept object in assets/concepts (not client work).
export const beyondItems = [
  { id: 'print', obj: 'print', title: '손에 남는 인쇄물', body: '브로슈어, 카탈로그, 리플렛, 교육 안내 책자. 발표자료의 내용을 판형에 맞게 재편집하고 인쇄용 PDF로 전달합니다.' },
  { id: 'web', obj: 'digital', title: '온라인으로 이어지는 홈페이지', body: '회사·서비스 소개 페이지. PC와 모바일에서 브랜드가 일관되게 보이도록 제작합니다.' },
  { id: 'visual', obj: 'image-video', title: '설명을 돕는 이미지와 영상', body: '제품 목업, 자료에 필요한 이미지, 짧은 소개 영상과 인터뷰 촬영. 전달할 내용에 맞춰 필요한 제작물을 함께 준비합니다.' },
];

// About page (업무 도구 lives here, not on the home).
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

// Public figures (고객사 수, 작업 건수, 후기 수, 평점 등). Shown only when approved with asOf and source.
// items: [{ value: 0, unit: '곳', label: '고객사' }]
export const proofStats = {
  approved: true, // owner restored the v2 track record section with these figures (2026-10-29)
  asOf: null, // 집계 기준일을 넣으면 숫자 아래에 'YYYY.MM 기준'으로 표시됩니다.
  items: [
    { value: 800, unit: '건+', label: '누적 작업', note: 'IR · 제안서 · 회사소개서' },
    { value: 4.9, unit: '/5', label: '고객 평점', note: '외부 판매 페이지 기준' },
    { value: 458, unit: '건+', label: '공식 고객후기', note: '실제 의뢰 고객 작성' },
    { value: 300, unit: '곳+', label: '고객사', note: '기업 · 기관 · 대학' },
  ],
};

// Logo wall for the track record section (v2 rows, logos prepared for a dark background). h = logo height in px.
export const trackWall = [
[
{
file: "msit.webp",
name: "과학기술정보통신부",
h: 27,
label: null
},
{
file: "compa.webp",
name: "과학기술사업화진흥원",
h: 26,
label: null
},
{
file: "samsungcnt.webp",
name: "삼성물산",
h: 27,
label: null
},
{
file: "nh.webp",
name: "NH농협",
h: 46,
label: "NH농협"
},
{
file: "kaist.webp",
name: "KAIST",
h: 30,
label: null
},
{
file: "kyunghee.webp",
name: "경희대 산학협력단",
h: 46,
label: "경희대 산학협력단"
},
{
file: "forest.webp",
name: "산림청",
h: 39,
label: null
},
{
file: "fsec.webp",
name: "금융보안원",
h: 34,
label: null
},
{
file: "iwssm.webp",
name: "유네스코 I-WSSM",
h: 42,
label: null
},
{
file: "jahwal.webp",
name: "한국자활연수원",
h: 28,
label: null
},
{
file: "sopoong.webp",
name: "소풍커넥트",
h: 22,
label: null
},
{
file: "woorihrd.webp",
name: "우리들HRD",
h: 46,
label: null
},
{
file: "langdev.webp",
name: "언어발전소",
h: 46,
label: "언어발전소"
}
],
[
{
file: "mois.webp",
name: "행정안전부",
h: 33,
label: null
},
{
file: "nipa.webp",
name: "정보통신산업진흥원",
h: 25,
label: null
},
{
file: "woori.webp",
name: "우리은행",
h: 46,
label: "우리은행"
},
{
file: "lh.webp",
name: "LH",
h: 46,
label: null
},
{
file: "korea-univ.webp",
name: "고려대 산학협력단",
h: 46,
label: "고려대 산학협력단"
},
{
file: "pknu.webp",
name: "국립부경대학교",
h: 30,
label: null
},
{
file: "jeonbuk.webp",
name: "전북특별자치도",
h: 46,
label: null
},
{
file: "gcon.webp",
name: "경기콘텐츠진흥원",
h: 33,
label: null
},
{
file: "koef.webp",
name: "한국청년기업가정신재단",
h: 22,
label: null
},
{
file: "likelion.webp",
name: "멋쟁이사자처럼",
h: 45,
label: "멋쟁이사자처럼"
},
{
file: "abyplus.webp",
name: "A by Plus",
h: 37,
label: null
},
{
file: "creacube.webp",
name: "크레아큐브",
h: 30,
label: null
},
{
file: "sungam.webp",
name: "특허법인 성암",
h: 28,
label: null
}
]
];

// Demo day history, copied from the published about page (주요 연혁). teams is shown only when teamsApproved.
export const demodayTeamsApproved = false;
export const demodayHistory = [
  { year: 2025, title: '기후테크 데모데이 SWITCH : Growth Stage 성과공유회', host: '소풍커넥트 · 전북특별자치도 · 전북테크노파크', teams: 7 },
  { year: 2025, title: 'Nharvest X 데모데이', host: '소풍커넥트 · 농협', teams: 3 },
  { year: 2025, title: '2025 FutureScape 데모데이', host: '소풍커넥트 · 삼성물산', teams: 6 },
  { year: 2025, title: '2025 경희대학교 캠퍼스타운 데모데이', host: '경희대학교 산학협력단', teams: 6 },
  { year: 2024, title: '2024 타이푼 데모데이', host: '소풍벤처스', teams: 9 },
  { year: 2024, title: '2024 SWITCH 데모데이', host: '소풍벤처스 · 전북특별자치도 · 전북테크노파크', teams: 3 },
  { year: 2024, title: '2024 경희대학교 캠퍼스타운 데모데이', host: '경희대학교 산학협력단', teams: 10 },
];

export const partnerGroups = [
  { id: 'public', label: '공공·기관' },
  { id: 'startup', label: '창업지원·대학' },
  { id: 'company', label: '기업' },
];
export const partnerLogos = [
  { src: 'assets/clients/msit.svg', name: '과학기술정보통신부', group: 'public' },
  { src: 'assets/clients/mois.svg', name: '행정안전부', group: 'public' },
  { src: 'assets/clients/forest-service.svg', name: '산림청', group: 'public' },
  { src: 'assets/clients/lh.png', name: 'LH', group: 'public' },
  { src: 'assets/clients/nipa.png', name: 'NIPA', group: 'public' },
  { src: 'assets/clients/fsec.png', name: '금융보안원', group: 'public' },
  { src: 'assets/clients/compa.webp', name: '과학기술사업화진흥원', group: 'public' },
  { src: 'assets/clients/gcon.webp', name: '경기콘텐츠진흥원', group: 'public' },
  { src: 'assets/clients/koef.png', name: '한국청년기업가정신재단', group: 'public' },
  { src: 'assets/clients/jeonbuk.svg', name: '전북특별자치도', group: 'public' },
  { src: 'assets/clients/iwssm.webp', name: '유네스코 I-WSSM', group: 'public' },
  { src: 'assets/clients/jahwal.webp', name: '한국자활연수원', group: 'public' },
  { src: 'assets/clients/sopoong-connect.svg', name: '소풍커넥트', group: 'startup' },
  { src: 'assets/clients/likelion.svg', name: '멋쟁이사자처럼', group: 'startup' },
  { src: 'assets/clients/kaist.svg', name: 'KAIST', group: 'startup' },
  { src: 'assets/clients/kyunghee.svg', name: '경희대학교 산학협력단', group: 'startup' },
  { src: 'assets/clients/korea-univ.svg', name: '고려대학교 산학협력단', group: 'startup' },
  { src: 'assets/clients/pknu.png', name: '국립부경대학교', group: 'startup' },
  { src: 'assets/clients/samsungcnt.svg', name: '삼성물산', group: 'company' },
  { src: 'assets/clients/nh.svg', name: 'NH농협', group: 'company' },
  { src: 'assets/clients/woori.svg', name: '우리은행', group: 'company' },
  { src: 'assets/clients/mindsground.png', name: '마인즈그라운드', group: 'company' },
  { src: 'assets/clients/language-development.png', name: '언어발전소', group: 'company' },
  { src: 'assets/clients/sakura-teien.png', name: '사쿠라테이엔', group: 'company' },
  { src: 'assets/clients/sawol.png', name: '노무법인 사월', group: 'company' },
  { src: 'assets/clients/woorihrd.webp', name: '우리들HRD', group: 'company' },
  { src: 'assets/clients/abyplus.webp', name: 'A by Plus', group: 'company' },
  { src: 'assets/clients/creacube.webp', name: '크레아큐브', group: 'company' },
  { src: 'assets/clients/sungam.webp', name: '특허법인 성암', group: 'company' },
];

// Real reviews from the external sales page. Bodies are verbatim; excerpt is a verbatim phrase used as the card title.
// Reviews without an excerpt are kept but not shown.
export const reviews = [
  { excerpt: '정리가 완벽히 안 된 PPT 초안을 드렸는데도', body: "정리가 완벽히 안 된 PPT 초안을 드렸는데도, 찰떡같이 알아들어주시고 정말 '알잘딱깔센'으로 작업해 주셨습니다! 책임감 있게 끝까지 빠른 작업해 주셔서 너무 감사합니다." },
  { excerpt: '벌써 8번째 작업 의뢰네요', body: '벌써 8번째 작업 의뢰네요. 이번에도 역시 작업 결과물이 기대 이상이었습니다~! 시각적으로도 뛰어나고, 자료의 톤앤매너를 정확하게 반영해 주셔서 만족도가 매우 높았습니다.' },
  { excerpt: null, body: '매번 디자이너님께만 작업을 맡기게 되네요~! 요청 사항을 정확히 이해하고 감각적으로 완성해 주셔서 늘 다시 찾게 됩니다. 다음 작업도 계속 부탁드릴 예정입니다.' },
  { excerpt: '적극적인 의견 개진 또한 너무나 감사합니다', body: '의뢰자가 원하는 걸 완벽하게 적용시켜 주는 건 물론이고 적극적인 의견 개진 또한 너무나 감사합니다. 갑작스러운 의뢰에도 최선을 다해 최고의 결과물을 보여주셨습니다.' },
  { excerpt: '촉박한 일정 때문에 걱정했는데', body: '촉박한 일정 때문에 걱정했는데 최대한 편의를 봐주셔서 너무 감사해요. 결과물도 너무 만족스럽고요. 약속 정확하고 센스 있으시고 정말 잘 이용했습니다.' },
  { excerpt: '적은 텍스트도, 많은 텍스트도 가독성 좋게', body: '항상 만족하며 이용하고 있습니다. 그 어떤 곳보다도 디자인이 세련되고 깔끔해요. 적은 텍스트도, 많은 텍스트도 가독성 좋게 정리해 주십니다.' },
  { excerpt: null, body: '작업물이 완벽 그 자체네요. 너무 좋고 친절하시고 다음에도 무조건 이용할 것 같습니다. 성심성의껏 해주셔서 정말 감사합니다!' },
];

// IR consulting record ({ title, host }); the home hides the line while empty.
export const irConsulting = [
  { title: '액셀러레이터 연계 프로그램 참여 기업 IR 컨설팅', host: '세부 내용 비공개' },
  { title: '정부 창업 지원사업 참여 기업 IR 컨설팅', host: '세부 내용 비공개' },
];

// Home section 3 tiles: real published work (portfolio ids) and the image to show.
export const featuredWork = [
  { id: 'x02', image: 'assets/pf/extra-02b.webp' },
  { id: 'x14', image: 'assets/pf/extra-14b.webp' },
  { id: 'x18', image: 'assets/pf/extra-18b.webp' },
  { id: '01', image: 'assets/pf/01a.webp' },
  { id: '12', image: 'assets/pf/12a.webp' },
  { id: '23', image: 'assets/pf/book-23.webp' },
];

// Website showcase on /web/. Items marked (샘플) are studio examples, not client sites. href: live site (null = 링크 준비 중, 버튼 없음).
export const webShowcase = [
  { title: '데모데이 행사 페이지', sub: '참가팀, 일정, 심사위원, 사전 등록까지 한 페이지로 (샘플)', src: 'assets/web/forge-demo.webp', poster: 'assets/web/forge-demo-poster.webp', href: null },
  { title: '반응형 웹 서비스 · 프모아', sub: 'PC와 모바일에 맞춰 바뀌는 서비스 홈페이지', src: 'assets/web/peumoa.webp', poster: 'assets/web/peumoa-poster.webp', href: 'https://peumoa.com/' },
];

// One inquiry form for the home, /contact and the quick quote. Values are stable codes; labels are shown.
export const inquiryOptions = {
  // First question: what to make (several allowed). Later questions depend on these.
  items: [
    ['ppt', 'PPT · 발표자료', 'IR · 회사소개서 · 제안서 · 교육자료'],
    ['web', '홈페이지', '회사 · 서비스 · 행사 페이지'],
    ['print', '인쇄물', '브로슈어 · 카탈로그 · 리플렛 · 책자'],
    ['visual', '이미지 · 영상', '제품 목업 · 소개 영상 · 인터뷰 촬영'],
  ],
  webType: [
    ['web-intro', '소개형', '회사·서비스·행사 정보를 한 페이지에'],
    ['web-form', '폼 연동형', '소개부터 문의·신청 접수까지'],
    ['web-unsure', '아직 모르겠어요', '상담하며 정합니다'],
  ],
  printType: ['브로슈어', '카탈로그', '리플렛', '교육 안내 책자', '기타'],
  visualType: [
    ['mockup', '제품 목업 이미지'],
    ['video', '짧은 소개 영상'],
    ['interview', '인터뷰 영상 촬영'],
  ],
  kind: [
    ['company', '우리 회사 자료', 'IR·회사소개서·제안서 등'],
    ['institution', '여러 팀 자료', '기관·데모데이'],
  ],
  purpose: [
    ['ir', '투자 유치 IR'], ['demoday', '데모데이 발표'], ['gov', '정부지원사업 발표·평가'], ['bid', '입찰·제안서'],
    ['intro', '회사·서비스·제품 소개서'], ['edu', '교육 자료'], ['other', '기타(직접 입력)'],
  ],
  state: [
    ['ppt-a', '디자인까지 된 초안', '글자만 못 고쳐요'],
    ['ppt-b', '내용은 정해졌고 디자인이 필요해요', ''],
    ['ppt-c', '줄글·메모·참고 자료만 있어요', ''],
    ['unsure', '아직 없어요·모르겠어요', ''],
  ],
  pagesCompany: ['10장 이하', '11–20장', '21–40장', '41장 이상', '모르겠어요'],
  pagesInstitution: ['팀당 20장 이내', '20장 넘음', '팀마다 다름', '모르겠어요'],
  extras: [
    ['print', '인쇄물', '브로슈어·카탈로그·리플렛'],
    ['web-company', '회사·서비스 홈페이지', ''],
    ['web-event', '행사 홈페이지', ''],
    ['interview', '인터뷰 영상 촬영', ''],
    ['visual', '제품 목업·짧은 소개 영상', ''],
    ['none', '없어요', ''],
  ],
  exchange: [
    ['collect', '기관에서 모아서 전달', '담당자께서 팀별 자료를 모아 한 번에 보내 주세요.'],
    ['direct', '팀별 직접 소통', '각 팀과 직접 자료와 피드백을 주고받습니다.'],
    ['later', '상담 후 결정', '진행 방식은 상담하며 정합니다.'],
  ],
  referral: ['아는 분 소개', '검색', '외부 판매 페이지', '예전에 맡겨 봄', '기타'],
};
