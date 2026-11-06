import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {layout,home,portfolioPage,detailPage,demodayPage,contactPage,privacyPage,webPage,irPage,caseDescription} from '../src/render.mjs';
import {portfolio} from '../src/portfolio.mjs';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist');
if(fs.existsSync(dist)){if(fs.realpathSync(dist)!==path.join(fs.realpathSync(root),'dist')||fs.lstatSync(dist).isSymbolicLink())throw new Error('Unsafe build directory');fs.rmSync(dist,{recursive:true,force:true})}
fs.mkdirSync(dist,{recursive:true});fs.cpSync(path.join(root,'public'),dist,{recursive:true});
for(const file of ['data.mjs','domain.mjs'])fs.copyFileSync(path.join(root,'src',file),path.join(dist,file));
// Cache busting: every CSS/JS URL carries a hash of the current files, so a browser never pairs new HTML with old styles or scripts.
const codeFiles=fs.readdirSync(dist).filter(f=>/\.(css|mjs)$/.test(f)).sort();
const version=crypto.createHash('sha256').update(codeFiles.map(f=>f+'\n'+fs.readFileSync(path.join(dist,f),'utf8')).join('\n')).digest('hex').slice(0,10);
for(const f of codeFiles.filter(f=>f.endsWith('.mjs'))){const file=path.join(dist,f);fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace(/((?:from|import)\s*['"])(\.\/[\w-]+\.mjs)(['"])/g,`$1$2?v=${version}$3`))}
const versioned=html=>html.replace(/((?:href|src)="[^"?]*?)((?:styles|home)\.css|app\.mjs)"/g,`$1$2?v=${version}"`);
// [route, content, title, base, description] — titles and descriptions per page (SEO spec 2026-11-04, PPT team copy).
const routes=[
['',home(''),'유별난PPT | IR·회사소개서·발표자료 PPT 디자인 제작','','유별난PPT는 IR, 투자제안서, 회사소개서, 제안서, 데모데이·정부지원사업 발표자료를 기획부터 디자인까지 맡습니다. 리플렛·브로슈어 같은 인쇄물도 함께 만들고, 직접 고칠 수 있는 PPTX와 PDF로 드립니다.'],
['ir',irPage('../'),'IR 디자인·투자제안서 PPT 제작 | 유별난PPT','../','초기 스타트업의 IR, 투자제안서, 피치덱을 맡습니다. 내용 흐름부터 정하고, 직접 고칠 수 있는 PPTX와 PDF로 드립니다.'],
['portfolio',portfolioPage('../'),'포트폴리오 | 유별난PPT','../','유별난PPT가 만든 IR, 회사소개서, 제품·서비스 소개서, 발표자료, 교육 안내책자 작업 사례입니다. 고객이 공개를 허락한 자료만 올립니다.'],
['demoday',demodayPage('../'),'데모데이 IR 제작·액셀러레이터 발표자료 | 유별난PPT','../','액셀러레이터, 대학 창업지원단, 지자체, 공공·창업지원기관의 데모데이 참가팀 IR 자료를 행사 일정에 맞춰 한 번에 제작합니다.'],
['web',webPage('../'),'웹·홈페이지 제작 | 유별난PPT','../','회사·서비스 소개 홈페이지와 행사 홈페이지를 PC와 모바일에 맞춰 만듭니다. PPT와 같은 디자인으로 이어서 제작할 수 있습니다.'],
['contact',contactPage('../'),'견적 문의 | 유별난PPT','../','자료 상태와 발표 일정을 남겨 주시면 작업 범위와 견적을 이메일로 보내 드립니다. 카카오톡 문의도 받습니다.'],
['privacy',privacyPage(),'개인정보 안내 | 유별난PPT','../','유별난PPT 견적 문의 시 받는 개인정보 항목과 보관 기간 안내입니다.'],
...portfolio.filter(p=>p.publishApproved).map(p=>['portfolio/'+p.slug,detailPage(p,'../../'),p.title+' | 유별난PPT','../../',caseDescription(p)])];
for(const [route,content,title,base,description] of routes){const folder=path.join(dist,route);fs.mkdirSync(folder,{recursive:true});let html=layout(content,{title,description,base,homePage:route==='',contactPage:route==='contact',path:route});if(process.env.SITE_MODE==='production')html=html.replace('data-preview="true"','data-preview="false"');fs.writeFileSync(path.join(folder,'index.html'),versioned(html))}
const legacyItems=Object.fromEntries(portfolio.filter(p=>p.publishApproved).map(p=>[p.id,p.slug]));
for(const route of ['portfolio','contact','demoday']){
const redirect=route==='portfolio'?`const routes=${JSON.stringify(legacyItems)};const q=new URLSearchParams(location.search);const slug=routes[q.get('item')];if(slug)q.delete('item');location.replace('./portfolio/'+(slug?slug+'/':'')+(q.size?'?'+q:'')+location.hash)`:`location.replace('./${route}/'+location.search+location.hash)`;
fs.writeFileSync(path.join(dist,route+'.html'),`<!doctype html><html lang="ko"><meta charset="utf-8"><title>유별난PPT</title><script>${redirect}</script><noscript><meta http-equiv="refresh" content="0;url=./${route}/"></noscript><a href="./${route}/">페이지로 이동</a></html>`);
}
// 회사소개 page removed (owner request 2026-10-29): old /about/ and about.html links land on the home.
fs.mkdirSync(path.join(dist,'about'),{recursive:true});
fs.writeFileSync(path.join(dist,'about','index.html'),'<!doctype html><html lang="ko"><meta charset="utf-8"><title>유별난PPT</title><meta name="robots" content="noindex"><script>location.replace("../"+location.search+location.hash)</script><noscript><meta http-equiv="refresh" content="0;url=../"></noscript><a href="../">홈으로 이동</a></html>');
fs.writeFileSync(path.join(dist,'about.html'),'<!doctype html><html lang="ko"><meta charset="utf-8"><title>유별난PPT</title><script>location.replace("./"+location.search+location.hash)</script><noscript><meta http-equiv="refresh" content="0;url=./"></noscript><a href="./">홈으로 이동</a></html>');
fs.writeFileSync(path.join(dist,'.nojekyll'),'');
console.log(`Built ${routes.length} pages in ${dist} (assets v=${version})`);
