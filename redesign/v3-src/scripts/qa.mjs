// Browser QA for the v4 home. Needs the `playwright` package (npm i -D playwright) or PLAYWRIGHT_MODULE pointing at one.
// Optional: CHROME_PATH=<chrome.exe> to use an installed Chrome instead of Playwright's bundled browser.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');process.env.PORT='4190';
const {server}=await import('./serve.mjs');
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const out=path.join(root,'qa');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
const url='http://127.0.0.1:4190/';const report={sizes:[],checks:{}};const errors=[];
const sections=['hero','collage','ai-retouch','numbers','portfolio','capabilities','demoday','web','reviews','pricing','process-faq','contact','inquiry'];
try{
 for(const [width,height] of [[390,844],[768,1024],[1280,720],[1440,900],[1920,1080]]){
  const page=await browser.newPage({viewport:{width,height}});page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(url,{waitUntil:'networkidle'});await page.waitForTimeout(1500);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  report.sizes.push({width,height,overflow});
  assert.equal(overflow,false,`horizontal overflow at ${width}`);
  for(const id of sections){await page.evaluate(id=>scrollTo(0,document.getElementById(id).getBoundingClientRect().top+scrollY),id);await page.waitForTimeout(900);await page.screenshot({path:path.join(out,`${id}-${width}.png`)})}
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto(url,{waitUntil:'networkidle'});
 report.checks.pricePlans=await page.locator('.h-table thead th').count()-1;assert.equal(report.checks.pricePlans,3);
 await page.click('#question-0');report.checks.faq=await page.locator('#answer-0').isVisible();assert.ok(report.checks.faq);
 await page.click('[data-cap-next]');report.checks.capability=await page.locator('[data-cap-now]').textContent();assert.equal(report.checks.capability,'02');
 const mobile=await browser.newPage({viewport:{width:390,height:844}});await mobile.goto(url,{waitUntil:'networkidle'});await mobile.click('.menu-toggle');report.checks.menu=await mobile.locator('#mobile-menu').evaluate(d=>d.open);assert.ok(report.checks.menu);
 // process section removed from home
 const reduced=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});await reduced.goto(url,{waitUntil:'networkidle'});report.checks.reducedMotionClass=await reduced.evaluate(()=>document.documentElement.classList.contains('has-motion'));assert.equal(report.checks.reducedMotionClass,false);
 const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:900}});const nojs=await ctx.newPage();await nojs.goto(url);report.checks.noJsTable=await nojs.locator('.h-table').isVisible();assert.ok(report.checks.noJsTable);
 report.errors=errors;assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();server.close()}
