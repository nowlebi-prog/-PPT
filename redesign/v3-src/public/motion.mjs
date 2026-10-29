// Scroll and interaction layer. Native scrolling only; everything degrades to a readable static page.
window.__motion=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const ease=t=>1-Math.pow(1-t,3);
const header=$('.site-header');
let vh=innerHeight,vw=innerWidth,lastY=scrollY,frame=0;
const motionOn=()=>!reduce.matches;
root.classList.toggle('has-motion',motionOn());

/* fit giant wordmarks to their box */
function fit(){for(const el of $$('[data-fit]')){el.style.fontSize='';const box=el.parentElement;const cs=getComputedStyle(box);const avail=box.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);el.style.display='inline-block';const w=el.scrollWidth;el.style.display='';if(!w)continue;const base=parseFloat(getComputedStyle(el).fontSize);el.style.fontSize=(base*avail/w*.995)+'px'}}

/* reveal */
const reveals=$$('[data-reveal]');
if('IntersectionObserver'in window&&motionOn()){const io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}},{threshold:.15,rootMargin:'0px 0px -6% 0px'});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add('is-in'));

/* count up */
const counters=$$('[data-count]');
if('IntersectionObserver'in window&&motionOn()){const io=new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting)continue;io.unobserve(e.target);const el=e.target,to=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length,t0=performance.now(),dur=1400;const step=t=>{const k=ease(clamp((t-t0)/dur));el.textContent=(to*k).toFixed(dec);if(k<1)requestAnimationFrame(step)};el.textContent=(0).toFixed(dec);requestAnimationFrame(step)}},{threshold:.6});counters.forEach(el=>io.observe(el))}

/* home scenes */
const hero=$('.h-hero');
const collage=$('.h-collage');
const works=$('.h-works');
const themed=$$('[data-header]');

function progress(el){const r=el.getBoundingClientRect();return clamp((vh-r.top)/(r.height+vh))}

function render(){frame=0;const y=scrollY;
 // header
 if(header){header.classList.toggle('is-solid',y>8);const down=y>lastY;if(Math.abs(y-lastY)>4){header.classList.toggle('is-hidden',down&&y>160&&!document.body.classList.contains('modal-open'))}
  let dark=false;for(const s of themed){const r=s.getBoundingClientRect();if(r.top<=40&&r.bottom>40)dark=s.dataset.header==='dark'}header.classList.toggle('on-dark',dark)}
 lastY=y;
 if(!motionOn())return;
 if(hero){const p=clamp(y/vh);hero.style.setProperty('--p',p.toFixed(4));hero.style.setProperty('--mx',mx.toFixed(3));hero.style.setProperty('--my',my.toFixed(3))}
 if(collage){const p=progress(collage);for(const o of $$('[data-speed]',collage)){const s=parseFloat(o.dataset.speed);o.style.transform=`translate3d(0,${(.5-p)*s*520}px,0) rotate(calc(var(--r) + ${(p-.5)*s*24}deg))`}}
 if(works){const p=progress(works);$$('[data-row]',works).forEach((row,i)=>{const dir=i%2?1:-1;row.style.transform=`translate3d(${(-25+dir*(p-.5)*22)}%,0,0)`})}
}
function request(){if(!frame)frame=requestAnimationFrame(render)}

/* hero: rotating first phrase + pointer drift */
let mx=0,my=0;
const rotEl=$('[data-rot]');
if(rotEl&&motionOn()){const items=$$('b',rotEl);let r=0;setInterval(()=>{if(document.hidden||scrollY>vh)return;const prev=items[r];r=(r+1)%items.length;prev.classList.remove('is-on');prev.classList.add('is-out');const next=items[r];next.classList.remove('is-out');next.style.transition='none';next.style.transform='';void next.offsetWidth;next.style.transition='';next.classList.add('is-on');setTimeout(()=>prev.classList.remove('is-out'),950)},2600)}
if(hero)hero.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;mx=e.clientX/vw-.5;my=e.clientY/vh-.5;request()});

/* process steps */
const proc=$('.h-process');
if(proc){const tabs=$$('[data-step]',proc),panels=$$('[data-step-panel]',proc);let cur=0,timer=0,inView=false,hold=false;
 const show=(i,focus)=>{cur=(i+tabs.length)%tabs.length;tabs.forEach((t,k)=>{t.setAttribute('aria-selected',String(k===cur));t.tabIndex=k===cur?0:-1;t.classList.toggle('is-done',k<cur)});proc.style.setProperty('--done',cur);panels.forEach((p,k)=>{p.classList.toggle('is-on',k===cur);p.setAttribute('aria-hidden',String(k!==cur))});if(focus)tabs[cur].focus()};
 const loop=()=>{clearTimeout(timer);const run=motionOn()&&inView&&!hold;proc.classList.toggle('is-run',run);if(run)timer=setTimeout(()=>{show(cur+1);loop()},2800)};
 tabs.forEach((t,i)=>{t.addEventListener('click',()=>{show(i);hold=true;proc.classList.add('is-hold');loop()});t.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();show(cur+(e.key==='ArrowDown'||e.key==='ArrowRight'?1:-1),true);hold=true;loop()}})});
 if('IntersectionObserver'in window)new IntersectionObserver(([e])=>{inView=e.isIntersecting;loop()},{threshold:.5}).observe(proc);
 show(0)}

/* reviews: slow continuous drift to the right (cards move left), loops through a cloned set; arrows step one card */
const revTrack=$('[data-rev-track]');
if(revTrack){const cards=$$('.h-rcard:not([data-clone])',revTrack),clones=$$('[data-clone]',revTrack),now=$('[data-rev-now]');
 clones.forEach(c=>c.inert=true);
 let inView=false,hold=false,pause=0,x=0,last=0,raf=0;const speed=.032; // px per ms
 const loopW=()=>clones.length?clones[0].offsetLeft-cards[0].offsetLeft:revTrack.scrollWidth;
 const step=t=>{raf=0;const dt=last?Math.min(48,t-last):16;last=t;
  if(!hold&&t>pause){x+=speed*dt;const w=loopW();if(x>=w)x-=w;revTrack.scrollLeft=x}
  if(inView&&motionOn())raf=requestAnimationFrame(step);else last=0};
 const run=()=>{if(!raf&&inView&&motionOn())raf=requestAnimationFrame(step)};
 const cardW=()=>cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(revTrack).columnGap||20);
 const jump=d=>{pause=performance.now()+3500;let to=revTrack.scrollLeft+d*cardW();const w=loopW();if(to<0)to+=w;if(to>=w){revTrack.scrollLeft-=w;to-=w}x=to;revTrack.scrollTo({left:to,behavior:motionOn()?'smooth':'auto'})};
 $('[data-rev-prev]')?.addEventListener('click',()=>jump(-1));$('[data-rev-next]')?.addEventListener('click',()=>jump(1));
 revTrack.addEventListener('scroll',()=>{if(hold||performance.now()<pause)x=revTrack.scrollLeft;if(now){const i=Math.round(revTrack.scrollLeft/cardW())%cards.length;now.textContent=String(i+1).padStart(2,'0')}},{passive:true});
 revTrack.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();jump(1)}if(e.key==='ArrowLeft'){e.preventDefault();jump(-1)}});
 revTrack.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hold=true});revTrack.addEventListener('pointerleave',()=>{hold=false;x=revTrack.scrollLeft});
 revTrack.addEventListener('touchstart',()=>{pause=performance.now()+4000},{passive:true});
 revTrack.addEventListener('focusin',()=>{hold=true});revTrack.addEventListener('focusout',()=>{hold=false});
 revTrack.classList.toggle('is-drift',motionOn());
 if('IntersectionObserver'in window)new IntersectionObserver(([e])=>{inView=e.isIntersecting;run()},{threshold:.1}).observe(revTrack)}

/* track record: one review line at a time */
const quoteBox=$('[data-quotes]');
if(quoteBox&&motionOn()){const ps=$$('p',quoteBox);let k=0;if(ps.length>1)setInterval(()=>{if(document.hidden)return;ps[k].classList.remove('is-on');ps[k].setAttribute('aria-hidden','true');k=(k+1)%ps.length;ps[k].classList.add('is-on');ps[k].removeAttribute('aria-hidden')},4200)}

/* homepage section: one PC mockup, sites slide through */
const pc=$('[data-pc]');
if(pc){const track=$('.h-pc__track',pc),slides=$$('.h-pc__slide',pc),dots=$$('[data-pc-go]',pc),tt=$('[data-pc-title]',pc),st=$('[data-pc-sub]',pc);
 let cur=0,timer=0,inView=false,hold=false;
 const show=i=>{cur=(i+slides.length)%slides.length;track.style.transform=`translateX(${-cur*100}%)`;slides.forEach((s,k)=>s.setAttribute('aria-hidden',String(k!==cur)));dots.forEach((d,k)=>k===cur?d.setAttribute('aria-current','true'):d.removeAttribute('aria-current'));tt.textContent=dots[cur].dataset.t;st.textContent=dots[cur].dataset.s};
 const loop=()=>{clearTimeout(timer);if(motionOn()&&inView&&!hold)timer=setTimeout(()=>{show(cur+1);loop()},5600)};
 dots.forEach((d,k)=>d.addEventListener('click',()=>{show(k);loop()}));
 pc.addEventListener('pointerenter',()=>{hold=true;loop()});pc.addEventListener('pointerleave',()=>{hold=false;loop()});
 if('IntersectionObserver'in window)new IntersectionObserver(([e])=>{inView=e.isIntersecting;loop()},{threshold:.35}).observe(pc)}

/* capabilities tabs */
const cap=$('.h-cap,.h-cap2');
if(cap){const tabs=$$('[data-cap]',cap),panels=$$('[data-cap-panel]',cap),now=$('[data-cap-now]',cap);let cur=0,timer=0,inView=false,hold=false;
 panels.forEach(p=>{if(p.hidden){p.hidden=false;p.setAttribute('aria-hidden','true');p.inert=true}});
 const show=(i,focus=false)=>{cur=(i+tabs.length)%tabs.length;tabs.forEach((t,k)=>{t.setAttribute('aria-selected',String(k===cur));t.tabIndex=k===cur?0:-1});panels.forEach(p=>{const on=Number(p.dataset.capPanel)===cur;if('keep' in p.dataset){p.classList.toggle('is-on',on);const bd=p.querySelector('[role=tabpanel]');if(bd){bd.setAttribute('aria-hidden',String(!on));bd.inert=!on}return}p.classList.toggle('is-on',on);p.setAttribute('aria-hidden',String(!on));p.inert=!on});if(now)now.textContent=String(cur+1).padStart(2,'0');if(focus)tabs[cur].focus()};
 const loop=()=>{clearTimeout(timer);if(motionOn()&&inView&&!hold)timer=setTimeout(()=>{show(cur+1);loop()},4800)};
 tabs.forEach((t,i)=>{t.addEventListener('click',()=>{show(i);hold=true;loop()});let hv=0;t.addEventListener('pointerenter',e=>{if(e.pointerType!=='mouse'||!matchMedia('(hover:hover) and (min-width:768px)').matches)return;clearTimeout(hv);hv=setTimeout(()=>{if(i!==cur){show(i);hold=true;loop()}},140)});t.addEventListener('pointerleave',()=>clearTimeout(hv));t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(cur+(e.key==='ArrowRight'?1:-1),true);hold=true;loop()}})});
 $('[data-cap-prev]',cap)?.addEventListener('click',()=>{show(cur-1);hold=true;loop()});
 $('[data-cap-next]',cap)?.addEventListener('click',()=>{show(cur+1);hold=true;loop()});
 cap.addEventListener('pointerenter',()=>{hold=true;loop()});cap.addEventListener('pointerleave',()=>{hold=false;loop()});
 if('IntersectionObserver'in window)new IntersectionObserver(([e])=>{inView=e.isIntersecting;loop()},{threshold:.5}).observe(cap);
 show(0)}

/* magnetic orb */
for(const orb of $$('.h-orb')){const area=orb.closest('section');area?.addEventListener('pointermove',e=>{if(!motionOn()||e.pointerType!=='mouse')return;const r=orb.getBoundingClientRect();const dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const d=Math.hypot(dx,dy);const k=d<r.width*1.6?.22:0;orb.style.transform=`translate(${dx*k}px,${dy*k}px)`});area?.addEventListener('pointerleave',()=>{orb.style.transform=''})}

function setup(){vh=innerHeight;vw=innerWidth;root.classList.toggle('has-motion',motionOn());fit();if(!motionOn()){for(const el of $$('[data-speed],.h-title,.h-hero__foot,[data-row]'))el.style.transform=el.style.opacity='';hero?.style.setProperty('--p',0);}request()}
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(setup,120)});
addEventListener('scroll',request,{passive:true});
reduce.addEventListener?.('change',setup);
document.fonts?.ready.then(setup);
addEventListener('load',setup);
setup();
