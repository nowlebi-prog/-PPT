import {createRequire} from 'node:module';import fs from 'node:fs';import path from 'node:path';
const require=createRequire('C:/Users/leeeb/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/');const {chromium}=require('playwright');
const root=path.resolve(import.meta.dirname,'../qa/reference');fs.mkdirSync(root,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('https://www.ancors.co.kr/',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(5000);
const info=await page.evaluate(()=>({height:document.documentElement.scrollHeight,sections:[...document.querySelectorAll('section')].map(e=>({class:e.className,id:e.id,top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight,text:e.innerText.slice(0,160)})),scripts:[...document.scripts].map(s=>s.src).filter(Boolean)}));fs.writeFileSync(path.join(root,'structure.json'),JSON.stringify(info,null,2));console.log(JSON.stringify(info));
for(let y=0,i=0;y<Math.min(info.height,16000);y+=650,i++){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(900);await page.screenshot({path:path.join(root,`reference-${String(i).padStart(2,'0')}.png`)});}
await browser.close();
