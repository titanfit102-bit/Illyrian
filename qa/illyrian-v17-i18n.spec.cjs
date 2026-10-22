const {test,expect}=require('@playwright/test');
const KEY='illyrian_demo_ui_language_v1';
async function ready(page){
 await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
 await expect.poll(()=>page.evaluate(()=>Boolean(window.IllyrianI18n?.t))).toBe(true);
 const guest=page.locator('#v7-auth.visible [data-v7="guest"]');
 if(await guest.isVisible()){await guest.click();await page.locator('#v7-auth.visible [data-v7="skip-tour"]').click()}
 await expect(page.locator('#v7-auth.visible')).toHaveCount(0);
}
async function languageSettings(page){
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#screen [data-act="modal"][data-val="settings"]').click();
 await page.locator('#layer [data-act="v6-settings-section"][data-val="language"]').click();
 await expect(page.locator('#layer [data-illyrian-language]')).toHaveCount(3);
}
for(const lang of ['sq','en','it']){
 test('i18n: switching and reloading '+lang+' leaves account state unchanged',async({page})=>{
  await ready(page);
  const original=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await languageSettings(page);
  await page.locator('#layer [data-illyrian-language="'+lang+'"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(page.locator('#layer [data-illyrian-language="'+lang+'"]')).toHaveAttribute('aria-pressed','true');
  const nav={sq:'Kryefaqja',en:'Home',it:'Home'};
  await expect(page.locator('#navbar [data-act="tab"][data-val="home"] span').first()).toHaveText(nav[lang]);
  expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(lang);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(original);
  await page.reload({waitUntil:'load'});
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(page.locator('#navbar [data-act="tab"][data-val="home"] span').first()).toHaveText(nav[lang]);
 });
}
for(const [device,expected] of [['sq-AL','sq'],['en-US','en'],['it-IT','it'],['de-DE','en']]){
 test('i18n: new-device language '+device+' -> '+expected,async({browser})=>{
  const ctx=await browser.newContext({locale:device}),page=await ctx.newPage();
  await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
  await expect(page.locator('html')).toHaveAttribute('lang',expected);
  await ctx.close();
 });
}
test('i18next fallback, plural, Intl formatting and no user-post translation',async({page})=>{
 await ready(page);
 const result=await page.evaluate(()=>{
  const i=window.IllyrianI18n,post=document.querySelector('.post-copy');
  const original=post?.textContent||'';
  i.changeLanguage('it');
  const r={
    fallback:i.t('navigation:home',{lng:'fr'}),
    missing:i.t('nonexistent:missing'),
    singular:i.t('common:count',{count:1}),
    plural:i.t('common:count',{count:2}),
    currency:i.currency(12.5,'EUR'),
    number:i.number(1234.5),
    date:i.date(new Date('2026-10-22T12:00:00Z')),
    original,after:post?.textContent||'',
    stateBefore:localStorage.getItem('illyrian_demo_v09_state')
  };
  i.changeLanguage('sq');r.stateAfter=localStorage.getItem('illyrian_demo_v09_state');
  return r;
 });
 expect(result.fallback).toBe('Home');
 expect(result.missing).toContain('missing');
 expect(result.singular).toContain('1');
 expect(result.plural).toContain('2');
 expect(result.currency).toContain('€');
 expect(result.original).toBe(result.after);
 expect(result.stateBefore).toBe(result.stateAfter);
});
test('Italian major screens and Settings labels update after navigation',async({page})=>{
 await ready(page);
 await languageSettings(page);
 await page.locator('#layer [data-illyrian-language="it"]').click();
 await expect(page.locator('#layer .modalhead h2')).toHaveText("Lingua dell'app");
 await page.locator('#layer [data-act="v6-settings-home"]').click();
 await expect(page.locator('#layer .modalhead h2')).toHaveText('Impostazioni');
 await page.locator('#layer [data-act="close"]').click();
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await expect(page.locator('#screen .section-header h2')).toHaveText('Scopri la comunità');
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await expect(page.locator('#screen .compose-prompt')).toHaveText('Cosa succede oggi?');
});
