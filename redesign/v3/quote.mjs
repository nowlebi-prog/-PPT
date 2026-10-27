// Quick quote: four taps, then a summary that prefills the inquiry form or goes to KakaoTalk.
const qz=document.getElementById('qz');
if(qz){
 const body=qz.querySelector('[data-qz-body]'),bar=qz.querySelector('.qz__prog i'),toastEl=document.querySelector('[data-qz-toast]');
 const steps=[
  {key:'goal',label:'발표 목적',q:'어떤 발표자료가 필요하세요?',opts:['투자 유치 (IR)','데모데이','정부지원사업 발표','입찰 · 제안','회사 · 브랜드 · 제품 소개','기타']},
  {key:'pages',label:'분량',q:'분량은 어느 정도인가요?',opts:['10장 이하','10 – 20장','20 – 40장','40장 이상','잘 모르겠어요']},
  {key:'due',label:'희망 납기',q:'언제까지 필요하세요?',opts:['1주 이내 (급해요)','2주 이내','한 달 이내','아직 미정']},
  {key:'ready',label:'준비된 자료',q:'지금 준비된 자료는 무엇인가요?',opts:['PPT 초안','텍스트 자료','제품 사진','아직 준비 중']},
 ];
 const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 let n=0,ans={},last=null,tt;
 const toast=m=>{if(!toastEl)return;toastEl.textContent=m;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('on'),2800)};
 const summary=()=>'[빠른 견적] '+steps.map(s=>`${s.label}: ${ans[s.key]}`).join(' / ');
 const render=()=>{
  bar.style.width=((n+1)/(steps.length+1))*100+'%';
  if(n<steps.length){const st=steps[n];
   body.innerHTML=`<div class="qz__step"><small>${n+1} / ${steps.length}</small><h3>${st.q}</h3><div class="qz__opts">${st.opts.map(o=>`<button type="button" data-v="${esc(o)}"${ans[st.key]===o?' class="is-on"':''}>${esc(o)}</button>`).join('')}</div>${n?'<button class="qz__back" type="button" data-back>← 이전</button>':''}</div>`;
  }else{const urgent=/^1주/.test(ans.due||'');
   const fill='<button class="qz__btn qz__btn--fill" type="button" data-fill>이 내용으로 문의서 작성하기</button>',kakao='<button class="qz__btn qz__btn--kakao" type="button" data-kakao>카카오톡으로 바로 상담하기 ↗</button>';
   body.innerHTML=`<div class="qz__step"><small>완료</small><h3>이렇게 정리됐어요.</h3><ul class="qz__sum">${steps.map(st=>`<li><span>${st.label}</span><b>${esc(ans[st.key])}</b></li>`).join('')}</ul>${urgent?'<p class="qz__tip">급한 일정이라면 카카오톡 상담이 가장 빨라요.</p>':''}<div class="qz__acts">${urgent?kakao+fill:fill+kakao}</div><p class="qz__hint">카카오톡을 누르면 정리된 내용이 복사돼요. 대화창에 붙여넣기만 하세요.</p><button class="qz__back" type="button" data-back>← 이전</button></div>`;
  }
  body.querySelector('button:not(.qz__back)')?.focus({preventScroll:true});
 };
 const open=e=>{e?.preventDefault();n=0;ans={};last=document.activeElement;qz.hidden=false;requestAnimationFrame(()=>qz.classList.add('open'));document.body.style.overflow='hidden';render()};
 const close=()=>{qz.classList.remove('open');document.body.style.overflow='';setTimeout(()=>{qz.hidden=true},300);last?.focus?.({preventScroll:true})};
 document.querySelectorAll('[data-quote]').forEach(t=>t.addEventListener('click',open));
 addEventListener('keydown',e=>{if(e.key==='Escape'&&!qz.hidden)close()});
 qz.addEventListener('click',async e=>{
  if(e.target.closest('[data-close]'))return close();
  const o=e.target.closest('[data-v]');if(o){ans[steps[n].key]=o.dataset.v;n++;return render()}
  if(e.target.closest('[data-back]')){n=Math.max(0,n-1);return render()}
  if(e.target.closest('[data-fill]')){const hf=document.getElementById('home-inquiry');if(hf){const m=hf.elements.message;m.value=summary()+(m.value?'\n\n'+m.value:'\n\n');const map={goal:ans.goal,pages:ans.pages,due:ans.due&&ans.due.replace(' (급해요)','')};for(const [k,v] of Object.entries(map)){const el=hf.elements[k];if(el&&v&&[...el.options].some(o=>o.text===v))el.value=v}hf.querySelector('details')?.setAttribute('open','');close();document.getElementById('inquiry')?.scrollIntoView({behavior:'smooth'});setTimeout(()=>hf.elements.name.focus({preventScroll:true}),700);return}const q=new URLSearchParams();if(ans.goal==='데모데이')q.set('service','demoday');q.set('quick',summary());location.href=qz.dataset.contact+'?'+q;return}
  if(e.target.closest('[data-kakao]')){try{await navigator.clipboard.writeText(summary());toast('정리된 내용을 복사했어요. 카카오톡 대화창에 붙여넣어 주세요.')}catch{toast('카카오톡 상담창을 열었어요.')}window.open(qz.dataset.kakao,'_blank','noopener');return}
 });
}
// Inquiry form: fill the message with a quick-quote summary passed in the URL.
const quick=new URLSearchParams(location.search).get('quick');
if(quick){const m=document.getElementById('message');if(m&&!m.value)m.value=quick+'\n\n'}

// Home inquiry form: keeps a local draft, then opens the visitor's mail app with everything filled in.
const hf=document.getElementById('home-inquiry');
if(hf){
 const KEY='youstar:home-inquiry',fields=['name','org','email','phone','message','goal','pages','due','budget'];
 const draftNote=hf.querySelector('[data-draft]'),err=hf.querySelector('[data-err]');
 try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d&&fields.some(f=>d[f])){for(const f of fields)if(d[f]&&hf.elements[f]&&!hf.elements[f].value)hf.elements[f].value=d[f];draftNote.hidden=false}}catch{}
 let t;hf.addEventListener('input',()=>{clearTimeout(t);t=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(Object.fromEntries(fields.map(f=>[f,hf.elements[f]?.value||'']))))}catch{}},300)});
 hf.querySelector('[data-draft-clear]')?.addEventListener('click',()=>{for(const f of fields)if(hf.elements[f])hf.elements[f].value='';try{localStorage.removeItem(KEY)}catch{}draftNote.hidden=true});
 hf.addEventListener('submit',e=>{e.preventDefault();err.textContent='';hf.querySelectorAll('[aria-invalid]').forEach(x=>x.removeAttribute('aria-invalid'));
  const bad=[...hf.querySelectorAll('[required]')].find(el=>!el.checkValidity());
  if(bad){bad.setAttribute('aria-invalid','true');bad.focus();err.textContent=bad.type==='checkbox'?'개인정보 수집 · 이용에 동의해 주세요.':bad.type==='email'?'이메일 주소를 확인해 주세요.':'필수 항목을 모두 입력해 주세요.';return}
  const v=f=>hf.elements[f]?.value.trim()||'';
  const lines=[`성함: ${v('name')}`,`회사명: ${v('org')}`,`이메일: ${v('email')}`,`연락처: ${v('phone')}`];
  for(const [f,l] of [['goal','의뢰 목적'],['pages','분량'],['due','희망 납기'],['budget','예산']])if(v(f))lines.push(`${l}: ${v(f)}`);
  lines.push('','[문의 내용]',v('message'));
  location.href=`mailto:${hf.dataset.mail}?subject=${encodeURIComponent(`[유별난PPT 상담] ${v('org')} ${v('name')}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
 });
}
