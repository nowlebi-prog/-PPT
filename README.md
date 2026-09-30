# 유별난PPT 홈페이지

빌드 도구 없이 쓰는 정적 사이트입니다. 폴더를 그대로 Netlify, Vercel, GitHub Pages, Cafe24 같은 호스팅에 올리면 됩니다.

```
index.html        메인 (히어로 · 문제 · 해결 · AI&보안 · 서비스 · 후기 · 고객사 · 문의)
about.html        회사소개 (인트로 · 연혁 · 프로세스 · FAQ)
portfolio.html    포트폴리오 (IR / 제안서 / 소개서 구분 + 상세 팝업)
assets/css/style.css
assets/js/main.js            공통 기능 + 문의 폼 설정
assets/js/portfolio-data.js  포트폴리오 목록 (여기만 고치면 됨)
assets/js/portfolio.js
assets/img/logo.svg
assets/img/slides/           사이트 장식용 샘플 슬라이드 (tools/make_slides.py 로 생성)
assets/img/gen/              GPT로 만든 이미지를 넣는 곳 (ASSET_PROMPTS.md 참고)
assets/video/                첫 화면 배경 영상 (선택)
assets/img/og.png            카카오톡 · SNS 공유 미리보기 이미지
```

## 자주 고칠 부분

- **포트폴리오 추가**: `assets/js/portfolio-data.js`에 항목을 추가합니다. 개수 제한은 없습니다.
  이미지는 `assets/img/portfolio/<id>/`에 넣고 `thumb`, `cover`, `slides` 경로를 적어주세요. 16:9 비율을 권장합니다.
- **문의 폼 받는 곳**: `assets/js/main.js` 맨 위 `FORM_ENDPOINT`에 Formspree 같은 서비스의 주소를 넣습니다.
  비워두면 방문자의 메일 앱이 열리고 `youstar_ppt@naver.com` 앞으로 메일이 작성됩니다.
- **고객사 로고**: 지금은 이름만 텍스트로 넣어 뒀습니다. `index.html`의 `.logo-chip` 안에 `<img>`를 넣으면 로고로 바뀝니다.
- **특정 프로젝트 공유 링크**: `portfolio.html?p=gears` 형식으로 주소를 보내면 해당 프로젝트 팝업이 바로 열립니다.
- **GPT 이미지 넣기**: `ASSET_PROMPTS.md`의 프롬프트로 만든 파일을 같은 이름으로 `assets/img/gen/`에 넣으면 자동으로 적용됩니다.
- **도메인 연결 시**: `index.html`의 `og:image` 주소를 새 도메인으로 바꿔주세요.
