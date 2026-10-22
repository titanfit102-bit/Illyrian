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
  await expect(page.locator('#navbar [data-act="tab"][data-val="home"] .v12-nav-label').first()).toHaveText(nav[lang]);
  expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(lang);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(original);
  await page.reload({waitUntil:'load'});
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(page.locator('#navbar [data-act="tab"][data-val="home"] .v12-nav-label').first()).toHaveText(nav[lang]);
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


// Cross-module regression after switching the interface language in place.
// Keep technical data-act / data-val controls stable in all three locales.
for(const lang of ['sq','en','it']){
 test('i18n module navigation survives live switch to '+lang,async({page})=>{
  await ready(page);
  await languageSettings(page);
  await page.locator('#layer [data-illyrian-language="'+lang+'"]').click();
  await page.locator('#layer [data-act="close"]').click();
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);

  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await expect(page.locator('[data-ilp-entry]').first()).toBeVisible();
  await page.locator('[data-ilp-entry]').first().click();
  await expect(page.locator('#ilp-root')).toBeVisible();
  await page.locator('#ilp-root button[data-ilp="close"]').click();

  await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
  await expect(page.locator('#il4-entry [data-il4-entry]')).toBeVisible();
  await page.locator('#il4-entry [data-il4-entry]').click();
  await expect(page.locator('#il4-root')).toBeVisible();
  await page.locator('#il4-root button[data-il4="close"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
 });
}
test('i18n preserves user-authored messages and comments resembling UI labels',async({page})=>{
 await ready(page);
 const result=await page.evaluate(async()=>{
  const parent=document.querySelector('#phone');
  const classes=['bubble me','v6-bubble me','v16-comment-list','ilp-chat','v10-share-preview'];
  const testNodes=classes.map(cls=>{
    const e=document.createElement('div');e.className=cls;e.textContent='Mbyll';parent.appendChild(e);return e;
  });
  window.IllyrianI18n.changeLanguage('it');
  await new Promise(r=>setTimeout(r,25));
  const texts=testNodes.map(e=>e.textContent);testNodes.forEach(e=>e.remove());
  return texts;
 });
 expect(result).toEqual(Array(5).fill('Mbyll'));
});
test('i18n locale catalogs remain complete and identical by semantic keys',async({page})=>{
 await ready(page);
 const parity=await page.evaluate(()=>{
  const resources=window.ILLYRIAN_LOCALES;
  const keys=l=>Object.entries(resources[l]).flatMap(([ns,o])=>Object.keys(o).map(k=>ns+':'+k)).sort();
  const base=keys('en');
  return {en:base.length,sq:keys('sq').length,it:keys('it').length,
    sameSq:JSON.stringify(base)===JSON.stringify(keys('sq')),
    sameIt:JSON.stringify(base)===JSON.stringify(keys('it'))};
 });
 expect(parity.en).toBeGreaterThanOrEqual(200);
 expect(parity.sameSq).toBe(true);expect(parity.sameIt).toBe(true);
});
