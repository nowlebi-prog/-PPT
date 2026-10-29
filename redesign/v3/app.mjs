import {calculateDemoday,parseSelection} from './domain.mjs';
import './motion.mjs';
import './inquiry.mjs';
import './stage.mjs';
document.documentElement.classList.add('js-ready');
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const base=document.body.dataset.base||'';
// Anchors from earlier versions of the home, mapped to the 9-section layout.
const oldAnchors={services:'pricing',visual:'collage','ai-finish':'collage','ai-retouch':'collage',process:'collage',work:'portfolio',ir:'demoday',top:'hero',numbers:'clients',capabilities:'beyond',web:'beyond','process-faq':'faq',inquiry:'contact'};
if(document.body.classList.contains('is-home')&&oldAnchors[location.hash.slice(1)]){const id=oldAnchors[location.hash.slice(1)];history.replaceState(null,'',location.pathname+location.search+'#'+id);requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView())}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const header=$('.site-header');
const menu=$('#mobile-menu'), menuButton=$('.menu-toggle');
let dialogOpener=null;
function openDialog(dialog,opener){dialogOpener=opener;dialog.showModal();document.body.classList.add('modal-open')}
function closeDialog(dialog){dialog.close()}
for(const dialog of $$('dialog')){dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(dialog===menu)menuButton.setAttribute('aria-expanded','false');dialogOpener?.focus({preventScroll:true});dialogOpener=null});dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog)})}
menuButton?.addEventListener('click',()=>{openDialog(menu,menuButton);menuButton.setAttribute('aria-expanded','true')});
$('[data-close-menu]')?.addEventListener('click',()=>closeDialog(menu));
// In-page links: release the scroll lock before jumping, otherwise the page cannot move while the menu closes.
$$('#mobile-menu a').forEach(a=>a.addEventListener('click',e=>{const h=a.getAttribute('href');const target=h.startsWith('#')&&document.getElementById(h.slice(1));if(!target){closeDialog(menu);return}e.preventDefault();dialogOpener=null;closeDialog(menu);document.body.classList.remove('modal-open');menuButton.setAttribute('aria-expanded','false');requestAnimationFrame(()=>{target.scrollIntoView({behavior:reduced.matches?'auto':'smooth'});history.pushState(null,'',h)})}));
$$('[data-faq-more]').forEach(b=>b.addEventListener('click',()=>{b.previousElementSibling?.classList.add('is-all');b.hidden=true;b.previousElementSibling?.querySelectorAll('.faq-item')[5]?.querySelector('button')?.focus()}));
$$('.faq-item button').forEach(button=>button.addEventListener('click',()=>{const expanded=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!expanded));$('#'+button.getAttribute('aria-controls')).hidden=expanded;button.lastElementChild.textContent=expanded?'+':'−'}));
function selectGroup(buttons,panels,attr,panelAttr,value){buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[attr]===value)));panels.forEach(p=>p.classList.toggle('is-selected',p.dataset[panelAttr]===value))}
const priceButtons=$$('[data-price-tab]');
function priceSelection(id,save=true){if(!priceButtons.some(b=>b.dataset.priceTab===id))return;selectGroup(priceButtons,$$('[data-price]'),'priceTab','price',id);if(save){const url=new URL(location.href);url.searchParams.set('service',id);history.replaceState(null,'',url)}}
priceButtons.forEach(b=>b.addEventListener('click',()=>priceSelection(b.dataset.priceTab)));
priceSelection(parseSelection(location.search).service,false);
const optionButtons=$$('[data-option-tab]');
function optionSelection(id,save=true){if(!optionButtons.some(b=>b.dataset.optionTab===id))return;selectGroup(optionButtons,$$('[data-option-panel]'),'optionTab','optionPanel',id);if(save){const u=new URL(location.href);u.searchParams.set('option',id);history.replaceState(null,'',u);dispatchEvent(new Event('selectionchange'))}}
optionButtons.forEach(b=>b.addEventListener('click',()=>optionSelection(b.dataset.optionTab)));
optionSelection(parseSelection(location.search).optionIds[0],false);
const filterButtons=$$('[data-filter]');
function filter(type,save=true){if(!filterButtons.length)return;filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===type)));let visible=0;$$('.portfolio-grid .project').forEach(p=>{p.hidden=type!=='all'&&p.dataset.type!==type;if(!p.hidden)visible++});const web=$('.portfolio-web');if(web)web.hidden=type!=='all';$('.filter-empty').hidden=visible>0;if(save){const u=new URL(location.href);u.searchParams.set('type',type);history.replaceState(null,'',u)}}
filterButtons.forEach(b=>b.addEventListener('click',()=>filter(b.dataset.filter)));
filter(new URLSearchParams(location.search).get('type')||'all',false);
addEventListener('popstate',()=>{filter(new URLSearchParams(location.search).get('type')||'all',false);priceSelection(parseSelection(location.search).service,false);optionSelection(parseSelection(location.search).optionIds[0],false)});

// Native dialogs keep keyboard focus inside and restore it to the opening image.
const lightbox=$('#lightbox'), viewport=$('.lightbox-viewport'), zoomImage=$('.lightbox-viewport img');
let gallery=[],imageIndex=0;
function showImage(){const item=gallery[imageIndex];zoomImage.src=item.src;zoomImage.alt=item.alt;$('[data-image-count]').textContent=`${imageIndex+1} / ${gallery.length}`;viewport.classList.remove('original');$('[data-zoom-mode]').textContent='원본 크기 보기';$('[data-image-prev]').disabled=gallery.length<2;$('[data-image-next]').disabled=gallery.length<2}
$$('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{gallery=$$(`[data-gallery="${b.dataset.gallery}"] img`).map(i=>({src:i.src,alt:i.alt}));imageIndex=Number(b.dataset.index);showImage();openDialog(lightbox,b)}));
$('[data-close-lightbox]')?.addEventListener('click',()=>closeDialog(lightbox));
$('[data-image-prev]')?.addEventListener('click',()=>{imageIndex=(imageIndex-1+gallery.length)%gallery.length;showImage()});
$('[data-image-next]')?.addEventListener('click',()=>{imageIndex=(imageIndex+1)%gallery.length;showImage()});
$('[data-zoom-mode]')?.addEventListener('click',e=>{const original=viewport.classList.toggle('original');e.currentTarget.textContent=original?'화면에 맞춰 보기':'원본 크기 보기'});
lightbox?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')$('[data-image-prev]').click();if(e.key==='ArrowRight')$('[data-image-next]').click()});

for(const img of $$('img[src]')){const fallback=()=>{const parent=img.closest('.media-slot');if(parent){parent.dataset.status='error';img.hidden=true;$('.slot-note',parent).textContent='이미지를 불러오지 못했습니다.';$('.media-toggle',parent)?.remove()}else{img.style.visibility='hidden';const holder=img.parentElement;const text=document.createElement('span');text.className='slot-note';text.textContent='이미지를 불러오지 못했습니다.';holder.append(text)}};img.addEventListener('error',fallback,{once:true});if(img.complete&&!img.naturalWidth)fallback()}
function stopMedia(){for(const img of $$('img[data-poster]')){img.src=img.dataset.poster;const btn=$('.media-toggle',img.parentElement);if(btn)btn.textContent='미리보기 재생'}}
$$('.media-toggle').forEach(b=>b.addEventListener('click',()=>{const img=$('img',b.parentElement);const playing=b.textContent==='미리보기 정지';stopMedia();if(!playing){img.src=img.dataset.gif;b.textContent='미리보기 정지'}}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMedia()});
if('IntersectionObserver'in window){const mediaObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting){const img=$('img[data-poster]',e.target);if(img){img.src=img.dataset.poster;const btn=$('.media-toggle',e.target);if(btn)btn.textContent='미리보기 재생'}}}));$$('.media-slot').forEach(m=>mediaObserver.observe(m))}

const calculator=$('#demo-calculator');
if(calculator){let pages=[null,null];const count=$('#team-count');const pageWrap=$('#team-pages');
 const update=()=>{try{const result=calculateDemoday(pages);$('#demo-total').textContent=result.amount.toLocaleString('ko-KR')+'원';$('#demo-note').textContent=result.estimated?'장수 미정인 팀은 기본 제작비 기준입니다.':'팀별 초과 장수를 각각 반영한 기본 제작비 기준입니다.';$('#calculator-error').textContent='';const q=new URLSearchParams({service:'demoday',teamCount:String(pages.length)});for(const id of parseSelection(location.search).optionIds)q.append('option',id);if(pages.every(n=>n!==null&&n===pages[0]))q.set('pageCount',String(pages[0]));$('#demo-inquiry').href=base+'contact/?'+q}catch{$('#calculator-error').textContent='팀별 장수는 1 이상의 정수로 입력하거나 미정으로 비워 주세요.';$('#demo-total').textContent='분량 확인 필요'}};
 const rows=()=>{pageWrap.replaceChildren();pages.forEach((value,i)=>{const row=document.createElement('div');row.className='team-page-row';const label=document.createElement('label');label.htmlFor='team-'+i;label.textContent=`${i+1}팀 예상 장수`;const input=document.createElement('input');Object.assign(input,{type:'number',min:'1',step:'1',id:'team-'+i,placeholder:'미정',value:value??''});input.inputMode='numeric';input.addEventListener('input',()=>{pages[i]=input.value===''?null:Number(input.value);update()});row.append(label,input);pageWrap.append(row)})};
 count.addEventListener('input',()=>{const n=Number(count.value);if(!Number.isInteger(n)||n<1||n>100){$('#calculator-error').textContent='팀 수는 1~100 사이의 정수로 입력해 주세요.';$('#demo-total').textContent='팀 수 확인 필요';return}pages=Array.from({length:n},(_,i)=>pages[i]??null);rows();update()});rows();update();addEventListener('selectionchange',update);$('#demo-inquiry').addEventListener('click',e=>{try{calculateDemoday(pages);if(!Number.isInteger(Number(count.value))||Number(count.value)<1||Number(count.value)>100)throw Error();sessionStorage.setItem('youstar:estimate',JSON.stringify({service:'demoday',teamCount:pages.length,pageCount:pages,optionIds:parseSelection(location.search).optionIds}))}catch{e.preventDefault();count.focus()}});calculator.addEventListener('submit',e=>e.preventDefault())}
