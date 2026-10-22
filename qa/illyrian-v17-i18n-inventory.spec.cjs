// Inventory of legacy UI strings not yet represented in semantic source locale.
// This generates evidence for translation work; it does NOT pass the localization release gate.
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
test.use({locale:'sq-AL'});
test('List untranslated visible UI labels across main views',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
 const guest=page.locator('#v7-auth.visible [data-v7="guest"]');
 if(await guest.isVisible()){
   await guest.click();await page.locator('#v7-auth.visible [data-v7="skip-tour"]').click();
 }
 await expect(page.locator('html')).toHaveAttribute('lang','sq');
 const snapshots=[];
 async function capture(route){
  const strings=await page.evaluate(()=>{
   const root=document.querySelector('#phone'),res=[];
   const selectors='button,h1,h2,h3,h4,label,input[placeholder],textarea[placeholder],select[aria-label],[role="status"],.v6-nav-copy strong,.v6-nav-copy span';
   const all=root.querySelectorAll(selectors);
   for(const el of all){
    if(el.closest('.post-copy,.post-name,.bubble,.v6-bubble,.ilp-chat,.v16-comment-list,.v4-inbox-content,.v6-inbox-item,.v10-share-preview'))continue;
    if(el.getClientRects().length===0)continue;
    const texts=[];
    if(el.hasAttribute('placeholder'))texts.push(el.getAttribute('placeholder'));
    if(el.hasAttribute('aria-label'))texts.push(el.getAttribute('aria-label'));
    if(['BUTTON','H1','H2','H3','H4','LABEL'].includes(el.tagName)||el.matches('.v6-nav-copy strong,.v6-nav-copy span'))
      texts.push(el.innerText);
    for(let t of texts){t=String(t||'').replace(/\s+/g,' ').trim();if(t&&t.length>=2&&t.length<=210)res.push(t)}
   }
   return [...new Set(res)];
  });
  snapshots.push({route,strings});
 }
 await capture('home');
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();await capture('discover');
 const privacy=page.locator('#il4-entry [data-il4-entry]');
 if(await privacy.isVisible()){
   await privacy.click();await capture('privacy');await page.locator('#il4-root button[data-il4="close"]').click();
 }
 await page.locator('.head [data-act="tab"][data-val="events"]').click();await capture('events');
 const plans=page.locator('[data-ilp-entry]').first();
 if(await plans.isVisible()){
   await plans.click();await capture('plans');await page.locator('#ilp-root button[data-ilp="close"]').click();
 }
 const connects=page.locator('#ilc-entry [data-ilc-entry]');
 if(await connects.isVisible()){
   await connects.click();await capture('connections');
   await page.locator('#ilc-root button[data-ilc="close"]').click();
 }
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 const shop=page.locator('[data-ilshop-open]').first();
 if(await shop.isVisible()){
   await shop.click();await capture('shop');
   const plus=page.locator('[data-isp-open]').first();
   if(await plus.isVisible()){
     await plus.click();await capture('shopPlus');await page.keyboard.press('Escape');
   }
   await page.keyboard.press('Escape');
 }
 await page.locator('#navbar [data-act="open-reels"]').click();await capture('reels');
 await page.locator('#layer [data-act="reel-close"]').click();
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();await capture('profile');
 const setup=page.locator('#screen [data-act="modal"][data-val="settings"]');
 if(await setup.isVisible()){
   await setup.click();await capture('settings');
   await page.locator('#layer [data-act="v6-settings-section"][data-val="language"]').click();
   await capture('language');
   await page.locator('#layer [data-act="close"]').click();
 }
 const lookup=await page.evaluate(()=>{
   const o=window.ILLYRIAN_LOCALES.sq;
   return [...new Set(Object.values(o).flatMap(x=>Object.values(x).filter(v=>typeof v==='string'&&!v.includes('{{'))))];
 });
 const covered=new Set(lookup);
 const unique=[...new Set(snapshots.flatMap(s=>s.strings))];
 const missing=unique.filter(s=>!covered.has(s)&&!/^(\d+|[✦✕⬅→✓✉️🌍]|ILLYRIAN|Home|Reels|Story)/i.test(s));
 const report={date:'2026-10-22',scope:'visible sampled UI only; not all conditional paths',catalogKeys:lookup.length,observedLabels:unique.length,unmatchedLabels:missing.length,routes:snapshots.map(s=>({route:s.route,labels:s.strings.length})),unmatched:missing};
 fs.mkdirSync('qa-results/i18n-inventory',{recursive:true});
 fs.writeFileSync('qa-results/i18n-inventory/visible-ui-sq.json',JSON.stringify(report,null,2));
 console.log('I18N_INVENTORY '+JSON.stringify({catalog:lookup.length,observed:unique.length,unmatched:missing.length,samples:missing.slice(0,85)}));
 expect(snapshots.length).toBeGreaterThanOrEqual(9);
});
