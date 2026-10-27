import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'../dist');
const files=fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html'));
let links=0,images=0;
for(const file of files){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 if(file.endsWith('index.html'))assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${file}: H1`);
 const base=new URL(file.replaceAll('\\','/'),'https://local.test/new-site/');
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const value=m[1].replaceAll('&amp;','&');
  if(/^(?:https?:|mailto:|tel:|data:)/.test(value))continue;
  const url=new URL(value,base);assert.ok(url.pathname.startsWith('/new-site/'),`${file}: escapes subpath ${value}`);
  let target=path.join(root,decodeURIComponent(url.pathname.slice('/new-site/'.length)));
  if(url.pathname.endsWith('/'))target=path.join(target,'index.html');
  assert.ok(fs.existsSync(target),`${file}: missing ${value}`);links++;
  if(url.hash&&target.endsWith('.html'))assert.ok(fs.readFileSync(target,'utf8').includes(`id="${url.hash.slice(1)}"`),`${file}: missing anchor ${value}`);
 }
 images+=(html.match(/<img /g)||[]).length;
}
const summary={pages:files.filter(f=>f.endsWith('index.html')).length,legacyRedirects:files.filter(f=>!f.endsWith('index.html')).length,checkedLocalReferences:links,imageElements:images};
assert.equal(summary.pages,42);fs.writeFileSync(path.resolve(root,'../qa/build-check.json'),JSON.stringify(summary,null,2));console.log(summary);
