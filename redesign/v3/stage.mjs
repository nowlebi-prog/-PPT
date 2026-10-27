// "On stage" works section, ported from the v2 design: a dark auditorium where scrolling walks the camera
// from the back row up to the big screen, which cycles through real slides. three.js (r128, self-hosted)
// is loaded only when this section exists and WebGL works; otherwise a still slide is shown instead.
const sec=document.getElementById('portfolio'),stage=sec?.querySelector('.show__stage'),cv=document.getElementById('room');
if(sec&&stage&&cv){
 const base=document.body.dataset.base||'';
 const load=()=>new Promise((ok,no)=>{if(window.THREE)return ok();const s=document.createElement('script');s.src=base+'assets/vendor/three.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)});
 let started=false;
 new IntersectionObserver(([e],io)=>{if(!e.isIntersecting||started)return;started=true;io.disconnect();load().then(run,()=>stage.classList.add('no3d'))},{rootMargin:'600px'}).observe(sec);
 function run(){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T=window.THREE;if(!T){stage.classList.add('no3d');return}
  let R;try{R=new T.WebGLRenderer({canvas:cv,antialias:true})}catch{stage.classList.add('no3d');return}
  stage.classList.add('is-3d');
  R.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<=860?1.5:1.75));
  R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=1.05;R.setClearColor(0x000000);
  const S=new T.Scene();S.fog=new T.Fog(0x000000,18,46);
  const cam=new T.PerspectiveCamera(40,1,.1,120);
  const SL=base+'assets/slides/';
  const ss=x=>x*x*(3-2*x);
  const deck=[['spne','에스피앤이 IR'],['toff','토프모빌리티 사업계획서'],['sakura','사쿠라테이엔 브랜드 소개서'],['refilly','리필리 IR'],['seongam','특허법인 성암 회사소개서'],['blos-2','지오그리드 BLOS 제품 소개서'],['sawol','노무법인 사월 회사소개서']];
  S.add(new T.HemisphereLight(0x6f8fff,0x020309,.28));
  const key=new T.SpotLight(0xcfe0ff,2.2,40,.42,.6,1.2);key.position.set(0,13,4);key.target.position.set(0,0,-4);S.add(key,key.target);
  const mat=(c,r=.6,m=.1)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m});
  const glowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');const g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(140,190,255,.6)');g.addColorStop(.45,'rgba(60,110,255,.2)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return new T.CanvasTexture(c)})();
  const addGlow=(w,h,pos,rx=0,ry=0,op=1)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:glowTex,transparent:true,opacity:op,blending:T.AdditiveBlending,depthWrite:false}));m.position.copy(pos);m.rotation.set(rx,ry,0);S.add(m);return m};
  const floor=new T.Mesh(new T.PlaneGeometry(80,80),mat(0x060a1c,.38,.35));floor.rotation.x=-Math.PI/2;S.add(floor);
  const grid=new T.GridHelper(80,80,0x16357a,0x16357a);grid.material.transparent=true;grid.material.opacity=.28;grid.position.y=.002;S.add(grid);
  const st=new T.Mesh(new T.BoxGeometry(18,.7,6),mat(0x0d1330,.45,.2));st.position.set(0,.35,-6);S.add(st);
  const strip=new T.Mesh(new T.BoxGeometry(18,.05,.05),new T.MeshBasicMaterial({color:0x2fa8ff}));strip.position.set(0,.68,-2.98);S.add(strip);
  addGlow(22,2.2,new T.Vector3(0,.02,-1.6),-Math.PI/2,0,.55);
  const back=new T.Mesh(new T.PlaneGeometry(40,16),mat(0x070b1e,.9));back.position.set(0,8,-9.2);S.add(back);
  const cvs=document.createElement('canvas');cvs.width=1600;cvs.height=900;const cx=cvs.getContext('2d');
  const scTex=new T.CanvasTexture(cvs);scTex.encoding=T.sRGBEncoding;scTex.anisotropy=R.capabilities.getMaxAnisotropy();
  const imgs=deck.map(([n])=>{const im=new Image();im.src=SL+n+'.webp';return im});
  const W=11.2,Hh=W*9/16;
  const frame=new T.Mesh(new T.BoxGeometry(W+.3,Hh+.3,.2),mat(0x03050b,.3,.7));frame.position.set(0,4.6,-8.6);S.add(frame);
  const scr=new T.Mesh(new T.PlaneGeometry(W,Hh),new T.MeshBasicMaterial({map:scTex,toneMapped:false,fog:false}));scr.position.set(0,4.6,-8.48);scr.renderOrder=10;S.add(scr);
  addGlow(W*2.2,Hh*2.2,new T.Vector3(0,4.6,-8.72),0,0,.9);
  const spill=addGlow(16,14,new T.Vector3(0,.03,0),-Math.PI/2,0,.35);
  const side=(name,x,ry)=>{const t=new T.TextureLoader().load(SL+name+'.webp');t.encoding=T.sRGBEncoding;const g=new T.Group();g.position.set(x,4.2,-6.6);g.rotation.y=ry;S.add(g);g.add(new T.Mesh(new T.BoxGeometry(4.5,2.65,.15),mat(0x03050b,.3,.7)));const s=new T.Mesh(new T.PlaneGeometry(4.3,2.42),new T.MeshBasicMaterial({map:t,toneMapped:false,fog:false}));s.position.z=.08;g.add(s)};
  const pod=new T.Group();pod.position.set(-5.2,.7,-4.4);pod.rotation.y=.25;S.add(pod);
  const pb=new T.Mesh(new T.BoxGeometry(1,1.2,.62),mat(0x111a42,.4,.3));pb.position.y=.6;pod.add(pb);
  const pt=new T.Mesh(new T.BoxGeometry(1.15,.06,.75),mat(0xc9d3f2,.35));pt.position.y=1.23;pod.add(pt);
  const plogo=new T.Mesh(new T.PlaneGeometry(.5,.5),new T.MeshBasicMaterial({map:(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,256,256);g.addColorStop(0,'#3fd0f0');g.addColorStop(1,'#1f4bff');x.fillStyle=g;x.beginPath();x.save();x.rect(0,0,256,150);x.arc(128,150,128,0,Math.PI);x.clip();[[0,14],[33,30],[66,96],[99,110],[132,96],[165,30],[198,14]].forEach(([bx,by])=>{x.fillRect(bx+18,by*.9+10,22,260)});x.restore();const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t})(),transparent:true,toneMapped:false}));
  plogo.position.set(0,.7,.32);pod.add(plogo);
  const mic=new T.Mesh(new T.CylinderGeometry(.015,.015,.45,8),mat(0x888fa0,.3,.8));mic.position.set(.2,1.45,.05);mic.rotation.z=-.4;pod.add(mic);
  const truss=new T.Mesh(new T.BoxGeometry(20,.22,.22),mat(0x1a2244,.5,.6));truss.position.set(0,9.4,1.2);S.add(truss);
  const coneMat=c=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:.045,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide});
  const beams=[];
  [[-7.6,0x3fd0f0],[7.6,0x3fd0f0]].forEach(([x,c],i)=>{const head=new T.Mesh(new T.CylinderGeometry(.16,.22,.4,16),mat(0x0b0f20,.4,.7));head.position.set(x,9.1,1.2);S.add(head);const cone=new T.Mesh(new T.ConeGeometry(1.5,8.6,32,1,true),coneMat(c));cone.geometry.translate(0,-4.3,0);cone.position.set(x,9.1,1.2);cone.rotation.x=.3;S.add(cone);beams.push({cone,ph:i*1.3});addGlow(2.6,2.6,new T.Vector3(x*.95,.72,-2.0),-Math.PI/2,0,.3)});
  const seatG=new T.BoxGeometry(.56,.1,.5),backG=new T.BoxGeometry(.56,.7,.08),headG=new T.SphereGeometry(.15,12,10),bodyG=new T.CylinderGeometry(.17,.22,.55,10);
  const seats=[],heads=[];
  for(let r=0;r<8;r++)for(let c=0;c<16;c++){if(c===7||c===8)continue;const x=(c-7.5)*.78,z=2.2+r*1.15,y=r*.12;seats.push([x,y,z]);if((r*7+c*3)%5!==0&&r<7)heads.push([x,y,z])}
  const inst=(g,m,list,f)=>{const im=new T.InstancedMesh(g,m,list.length),o=new T.Object3D();list.forEach((p,i)=>{f(o,p);o.updateMatrix();im.setMatrixAt(i,o.matrix)});S.add(im)};
  const chairM=mat(0x121a3e,.55,.2),personM=mat(0x05070f,.8,0);
  inst(seatG,chairM,seats,(o,[x,y,z])=>o.position.set(x,y+.45,z));
  inst(backG,chairM,seats,(o,[x,y,z])=>o.position.set(x,y+.85,z+.25));
  inst(bodyG,personM,heads,(o,[x,y,z])=>o.position.set(x,y+.78,z+.02));
  inst(headG,personM,heads,(o,[x,y,z])=>o.position.set(x,y+1.2,z));
  for(let r=1;r<8;r++){const p=new T.Mesh(new T.BoxGeometry(13.5,.12,1.15),mat(0x080d22,.6));p.position.set(0,r*.12-.06+.12,2.2+r*1.15);S.add(p)}
  const P=[[0,5.6,17,0,4.2,-8.5],[0,5,10.5,0,4.5,-8.5],[0,4.6,2.6,0,4.6,-8.5]];
  const bar=sec.querySelector('[data-show-bar]'),nm=sec.querySelector('[data-show-name]'),copy=sec.querySelector('.show__copy');
  let kk=0,mx=0,my=0,tx=0,ty=0,on=true,cur=0,nxt=0,fade=1,lastSwap=0,hold=0,prevT=0;
  const HOLD=3600,FADE=700;let running=false;
  if(matchMedia('(pointer: fine)').matches)addEventListener('pointermove',e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
  const size=()=>{const w=stage.clientWidth,h=stage.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.fov=cam.aspect<1?62:40;cam.updateProjectionMatrix();const k=2*Math.tan(cam.fov*Math.PI/360);const d=Math.max(Hh/k,W/(k*cam.aspect))*1.16;P[2][2]=Math.min(-8.48+d,9)};
  const offset=k=>{const w=stage.clientWidth,h=stage.clientHeight;if(w>860)cam.setViewOffset(w,h,-w*.12*(1-ss(Math.min(1,k/.6))),0,w,h);else cam.clearViewOffset()};
  size();addEventListener('resize',size);
  const prog=()=>{const r=sec.getBoundingClientRect();return Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)))};
  new IntersectionObserver(([e])=>{on=e.isIntersecting;if(on&&!running){running=true;prevT=0;requestAnimationFrame(loop)}},{rootMargin:'200px'}).observe(sec);
  const drawScreen=()=>{cx.fillStyle='#050814';cx.fillRect(0,0,1600,900);const a=imgs[cur],b=imgs[nxt];if(a.complete&&a.naturalWidth){cx.globalAlpha=1;cx.drawImage(a,0,0,1600,900)}if(fade<1&&b.complete&&b.naturalWidth){cx.globalAlpha=ss(fade);cx.drawImage(b,0,0,1600,900)}cx.globalAlpha=1;scTex.needsUpdate=true};
  imgs.forEach(im=>im.addEventListener('load',drawScreen));
  const v=new T.Vector3(),L=new T.Vector3();
  function loop(t){
   if(!on){running=false;return}
   kk+=(prog()-kk)*(reduce?1:.06);mx+=(tx-mx)*.05;my+=(ty-my)*.05;
   const seg=kk<.5?0:1,f=ss(Math.min(1,(kk-seg*.5)/.5)),a=P[seg],b=P[seg+1];
   v.set(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f);
   L.set(a[3]+(b[3]-a[3])*f,a[4]+(b[4]-a[4])*f,a[5]+(b[5]-a[5])*f);
   const s=reduce?0:t/1000;
   v.x+=Math.sin(s*.22)*.12+mx*.5;v.y+=-my*.25;
   offset(kk);cam.position.copy(v);cam.lookAt(L);
   const dt=Math.min(50,t-(prevT||t));prevT=t;
   if(fade>=1)hold+=dt;
   if(!reduce&&fade>=1&&hold>HOLD){nxt=(cur+1)%deck.length;fade=0;lastSwap=0;hold=0}
   if(fade<1){lastSwap+=dt;fade=Math.min(1,lastSwap/FADE);drawScreen();if(fade>.5&&nm)nm.textContent=deck[nxt][1];if(fade>=1)cur=nxt}
   beams.forEach(bm=>{bm.cone.material.opacity=.03+.022*Math.sin(s*.8+bm.ph);bm.cone.rotation.z=Math.sin(s*.3+bm.ph)*.12});
   spill.material.opacity=.3+.08*Math.sin(s*1.3);
   bar?.style.setProperty('--k',kk.toFixed(3));
   if(copy){const o=1-ss(Math.min(1,Math.max(0,(kk-.42)/.28)));copy.style.opacity=o.toFixed(3);copy.style.visibility=o<.02?'hidden':''}
   R.render(S,cam);requestAnimationFrame(loop);
  }
  if(nm)nm.textContent=deck[0][1];
  running=true;requestAnimationFrame(loop);
 }
}
