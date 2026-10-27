// Diagnostic only: no device budget or CI timing gate. See blueprint §23.
// NODE_PATH=$PWD/security/node_modules node qa/measure-v17.cjs
const {chromium}=require('@playwright/test');
const fs=require('node:fs');
const os=require('node:os');
const {spawn}=require('node:child_process');
const path=require('node:path');
const url=process.env.PERF_URL||'http://127.0.0.1:4173/ILLYRIAN_DEMO_v1.7.html';
const samples=Number(process.env.PERF_SAMPLES||7);
if(!Number.isInteger(samples)||samples<3||samples>30)throw new Error('Use 3–30 samples');
const variants=process.env.PERF_COMPARE_DIR?[{label:'baseline',source:process.env.PERF_COMPARE_DIR},{label:'candidate',source:null}]:[{label:process.env.PERF_LABEL||'working tree',source:process.env.PERF_SOURCE_DIR}];
const results=Object.fromEntries(variants.map(v=>[v.label,{}]));let active;
function record(name,value){(results[active][name]??=[]).push(value)}
async function action(page,name,selector,input){
 const result=await page.evaluate(async({selector,input})=>{
  const el=document.querySelector(selector);if(!el)throw new Error('Missing '+selector);
  const start=performance.now();
  if(input!==undefined){el.value=input;el.dispatchEvent(new Event('input',{bubbles:true}))}else el.click();
  document.body.getBoundingClientRect();const handler=performance.now()-start;
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  return {handler,frame:performance.now()-start};
 },{selector,input});
 record(name+'.handler_ms',result.handler);record(name+'.two_raf_ms',result.frame);
}
async function scroll(page,name,selector){
 const gaps=await page.evaluate(selector=>new Promise(resolve=>{
  const el=document.querySelector(selector);if(!el)throw new Error('Missing '+selector);
  const original=el.scrollTop,gaps=[];let last;
  function step(now){if(last!==undefined)gaps.push(now-last);last=now;el.scrollTop=(el.scrollHeight-el.clientHeight)*(gaps.length%20)/19;
   if(gaps.length<40)requestAnimationFrame(step);else{el.scrollTop=original;resolve(gaps)}}
  requestAnimationFrame(step);
 }),selector);
 record(name+'.max_frame_gap_ms',Math.max(...gaps));record(name+'.gaps_over_50_ms',gaps.filter(g=>g>50).length);
}
(async()=>{
 const server=process.env.PERF_URL?null:spawn('python3',['-m','http.server','4173','--bind','127.0.0.1','--directory',path.join(__dirname,'../demo')],{stdio:'ignore'});
 const browser=await chromium.launch();
 try{
  for(let i=0;;i++){try{const response=await fetch(url);if(response.ok)break;throw new Error('HTTP '+response.status)}catch(error){if(i>=30)throw error;await new Promise(r=>setTimeout(r,100))}}
  for(let run=0;run<samples;run++){
   // Alternate AB/BA to reduce order/host-load bias; never benchmark concurrently.
   for(const variant of (run%2?[...variants].reverse():variants)){
   active=variant.label;
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
   await context.addInitScript(()=>{localStorage.setItem('illyrian_demo_v07_session','entered');localStorage.setItem('illyrian_demo_v08_welcome_seen','1')});
   const page=await context.newPage(),cdp=await context.newCDPSession(page);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
   // Optional baseline overlay: original changed assets; unchanged assets use the same server.
   // Both variants install the route (same browser-cache policy).
   await page.route('**/*',route=>{
    const requested=new URL(route.request().url());
    if(!variant.source||requested.origin!==new URL(url).origin)return route.continue();
    const relative=decodeURIComponent(requested.pathname).replace(/^\/+/,''),root=path.resolve(variant.source),file=path.resolve(root,relative);
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.continue();
    return route.fulfill({contentType:file.endsWith('.html')?'text/html':'application/javascript',body:fs.readFileSync(file)});
   });
   await page.goto(url,{waitUntil:'load'});await page.waitForFunction(()=>window.IllyrianI18n?.t);
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const nav=await page.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0];return {load:n.loadEventEnd,dom:n.domContentLoadedEventEnd,bytes:n.transferSize}});
   record('startup.load_ms',nav.load);record('startup.dom_ms',nav.dom);record('startup.document_bytes',nav.bytes);
   const home='#navbar [data-act="tab"][data-val="home"]',explore='#navbar [data-act="tab"][data-val="explore"]';
   await action(page,'profile','#navbar [data-act="tab"][data-val="profile"]');
   await action(page,'feed',home);
   await scroll(page,'feed.scroll','#screen');
   await action(page,'story','#screen [data-act="story"]');await page.keyboard.press('Escape');
   await action(page,'reel','#navbar [data-act="open-reels"]');await page.keyboard.press('Escape');
   await action(page,'search.open',explore);await action(page,'search.query','#finder','Arta');
   await page.locator(explore).click();await page.locator('#finder').fill('');
   await page.locator('[data-act="go-category"][data-val="Komunitete"], [data-act="category"][data-val="Komunitete"]').first().click();
   await action(page,'community','#screen [data-act="v11-community-open"]');await page.keyboard.press('Escape');
   await page.locator('.head [data-act="tab"][data-val="events"]').click();
   await action(page,'plans','[data-ilp-entry]');await page.keyboard.press('Escape');
   await page.locator(home).click();await action(page,'shop','[data-ilshop-open]');
   await action(page,'shop.plus','#illyrian-shop-layer [data-isp-open]');await page.keyboard.press('Escape');await page.keyboard.press('Escape');
   await action(page,'inbox','#navbar [data-act="modal"][data-val="inbox"]');
   await action(page,'chat.stock','#v6-inbox-list [data-act="v6-openchat"][data-id="leon"]');
   await action(page,'chat.stock.input','#v6-msg-input','Diagnostic message');
   await action(page,'chat.stock.send','#v6-chat-form button[type="submit"]');
   await page.evaluate(()=>{const k='illyrian_demo_v09_state',data=JSON.parse(localStorage.getItem(k));data.messages.leon=Array.from({length:5000},(_,i)=>'Message '+String(i).padStart(4,'0')+' '+('fictional content '.repeat(8)));localStorage.setItem(k,JSON.stringify(data))});
   await page.reload({waitUntil:'load'});await page.waitForFunction(()=>window.IllyrianI18n?.t);
   await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();
   await action(page,'chat.5000.open','#v6-inbox-list [data-act="v6-openchat"][data-id="leon"]');
   record('chat.5000.bubbles',await page.locator('#v6-chat-scroll .v6-bubble').count());
   await scroll(page,'chat.5000.scroll','#v6-chat-scroll');
   await page.locator('#v6-msg-input').fill('Diagnostic final message');
   await action(page,'chat.5000.send','#v6-chat-form button[type="submit"]');
   await context.close();
   }
  }
  const summary=Object.fromEntries(Object.entries(results).map(([label,metrics])=>[label,Object.fromEntries(Object.entries(metrics).map(([name,values])=>{const sorted=[...values].sort((a,b)=>a-b);return [name,{median:sorted[Math.floor(sorted.length/2)],max:sorted.at(-1),samples:values}]}))]));
  console.log(JSON.stringify({label:process.env.PERF_LABEL||'working tree',browser:browser.version(),platform:os.platform(),arch:os.arch(),cpus:os.cpus().length,cpu:os.cpus()[0]?.model,viewport:'390x844',cpuThrottle:4,network:'localhost/unthrottled; no real network evidence',reducedMotion:'reduce',samples,summary},null,2));
 }finally{await browser.close();server?.kill()}
})().catch(error=>{console.error(error);process.exitCode=1});
