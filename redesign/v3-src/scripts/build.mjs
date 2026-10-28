import fs from 'node:fs';
import path from 'node:path';
import {layout,home,portfolioPage,detailPage,demodayPage,aboutPage,contactPage,privacyPage} from '../src/render.mjs';
import {portfolio} from '../src/portfolio.mjs';
const root=path.resolve(import.meta.dirname,'..'),dist=path.join(root,'dist');
if(fs.existsSync(dist)){if(fs.realpathSync(dist)!==path.join(fs.realpathSync(root),'dist')||fs.lstatSync(dist).isSymbolicLink())throw new Error('Unsafe build directory');fs.rmSync(dist,{recursive:true,force:true})}
fs.mkdirSync(dist,{recursive:true});fs.cpSync(path.join(root,'public'),dist,{recursive:true});
for(const file of ['data.mjs','domain.mjs'])fs.copyFileSync(path.join(root,'src',file),path.join(dist,file));
const routes=[['',home(''),'유별난PPT | IR · 회사소개서 · 발표자료 기획과 디자인',''],['portfolio',portfolioPage('../'),'작업 사례 | 유별난PPT','../'],['demoday',demodayPage('../'),'기관·데모데이 제작 | 유별난PPT','../'],['about',aboutPage('../'),'회사소개 | 유별난PPT','../'],['contact',contactPage('../'),'견적 문의 | 유별난PPT','../'],['privacy',privacyPage(),'개인정보 안내 | 유별난PPT','../'],...portfolio.filter(p=>p.publishApproved).map(p=>['portfolio/'+p.slug,detailPage(p,'../../'),p.title+' | 유별난PPT','../../'])];
for(const [route,content,title,base] of routes){const folder=path.join(dist,route);fs.mkdirSync(folder,{recursive:true});let html=layout(content,{title,base,homePage:route==='',contactPage:route==='contact'});if(process.env.SITE_MODE==='production')html=html.replace('data-preview="true"','data-preview="false"');fs.writeFileSync(path.join(folder,'index.html'),html)}
const legacyItems=Object.fromEntries(portfolio.filter(p=>p.publishApproved).map(p=>[p.id,p.slug]));
for(const route of ['portfolio','about','contact','demoday']){
const redirect=route==='portfolio'?`const routes=${JSON.stringify(legacyItems)};const q=new URLSearchParams(location.search);const slug=routes[q.get('item')];if(slug)q.delete('item');location.replace('./portfolio/'+(slug?slug+'/':'')+(q.size?'?'+q:'')+location.hash)`:`location.replace('./${route}/'+location.search+location.hash)`;
fs.writeFileSync(path.join(dist,route+'.html'),`<!doctype html><html lang="ko"><meta charset="utf-8"><title>유별난PPT</title><script>${redirect}</script><noscript><meta http-equiv="refresh" content="0;url=./${route}/"></noscript><a href="./${route}/">페이지로 이동</a></html>`);
}
fs.writeFileSync(path.join(dist,'.nojekyll'),'');
console.log(`Built ${routes.length} pages in ${dist}`);
