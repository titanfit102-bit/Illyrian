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


for(const [lang,tag] of [['sq','sq'],['en','en'],['it','it']]){
 test('i18n marketplace EUR formats adapt to '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  const expected=await page.evaluate(l=>new Intl.NumberFormat(l,{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2}).format(12.5),lang);
  const formatted=await page.evaluate(()=>window.IllyrianI18n.currency(12.5,'EUR'));
  expect(formatted).toBe(expected);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
  const currencySample=await page.locator('#illyrian-shop-layer').innerText();
  expect(currencySample).toContain('€');
 });
}


for(const [lang,expected] of Object.entries({
 sq:{shop:'Kërko nga të gjitha dyqanet',plans:'Aktivitetet dhe organizatori',privacy:'Privatësia dhe harta',governance:'Besimi dhe menaxhimi'},
 en:{shop:'Search across all shops',plans:'Activities and organizer',privacy:'Privacy and map',governance:'Trust and management'},
 it:{shop:'Cerca in tutti i negozi',plans:'Attività e organizzatore',privacy:'Privacy e mappa',governance:'Fiducia e gestione'}
})){
 test('i18n translated modal headings for '+lang,async({page})=>{
   await ready(page);
   await languageSettings(page);
   await page.locator('#layer [data-illyrian-language="'+lang+'"]').click();
   await page.locator('#layer [data-act="close"]').click();
   await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
   await page.locator('[data-ilshop-open]').first().click();
   await expect(page.locator('#illyrian-shop-layer .ils-top small')).toHaveText(expected.shop);
   await page.keyboard.press('Escape');
   await page.locator('.head [data-act="tab"][data-val="events"]').click();
   await page.locator('[data-ilp-entry]').first().click();
   await expect(page.locator('#ilp-root .ilp-panel h2').first()).toHaveText(expected.plans);
   await page.locator('#ilp-root button[data-ilp="close"]').click();
   await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
   await page.locator('#il4-entry [data-il4-entry]').click();
   await expect(page.locator('#il4-root .il4-panel h2').first()).toHaveText(expected.privacy);
   await page.locator('#il4-root button[data-il4="close"]').click();
   await page.locator('#ig6-entry [data-ig6="open"]').click();
   await expect(page.locator('#ig6-root .ig6-panel h2').first()).toHaveText(expected.governance);
   await page.locator('#ig6-root button[data-ig6="close"]').click();
 });
}

for(const [language,expected] of Object.entries({
 sq:{added:'Produkti u shtua në shportën demonstrative.',invalid:'Kontrollo kategorinë, emrin, dyqanin, qytetin dhe çmimin.',saved:'Listimi u ruajt vetëm në këtë shfletues.'},
 en:{added:'The product was added to the demo cart.',invalid:'Check the category, item name, shop, city and price.',saved:'The listing was saved only in this browser.'},
 it:{added:'Il prodotto è stato aggiunto al carrello dimostrativo.',invalid:"Controlla categoria, nome dell'articolo, negozio, città e prezzo.",saved:"L'annuncio è stato salvato solo in questo browser."}
})){
 test('i18n Shop runtime notifications and invalid form in '+language,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),language);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-ils="detail"][data-id="p1"]').click();
  await page.locator('#illyrian-shop-layer [data-ils="add"]').click();
  await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText(expected.added);
  await page.locator('#illyrian-shop-layer [data-ils="back"]').click();
  await page.locator('#illyrian-shop-layer [data-ils="sell"]').click();
  // UI labels may translate; persisted values must stay stable across languages.
  const codes=await page.locator('#ils-sell-form').evaluate(form=>({
   categories:[...form.elements.kind.options].map(o=>o.value),
   cities:[...form.elements.city.options].map(o=>o.value),
   visibleCategory:form.elements.kind.options[0].textContent
  }));
  expect(codes.categories).toEqual(['Produkte','Makina','Banesa me qira','Shërbime']);
  expect(codes.cities).toEqual(['Tiranë','Durrës','Shkodër','Vlorë','Elbasan','Prishtinë']);
  expect(codes.visibleCategory).toBe({sq:'Produkte',en:'Products',it:'Prodotti'}[language]);
  await page.locator('#ils-sell-form').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText(expected.invalid);
  await page.locator('#ils-sell-form input[name="name"]').fill('Coffee test item');
  await page.locator('#ils-sell-form input[name="store"]').fill('Test Seller');
  await page.locator('#ils-sell-form input[name="price"]').fill('12.50');
  await page.locator('#ils-sell-form button[type="submit"]').click();
  await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText(expected.saved);
  await expect(page.locator('#illyrian-shop-layer .ils-card h3')).toContainText('Coffee test item');
 });
}

test('Shop user listing title, seller and description remain unchanged across languages',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-ils="sell"]').click();
 await page.locator('#ils-sell-form input[name="name"]').fill('Mbyll');
 await page.locator('#ils-sell-form input[name="store"]').fill('Mbyll');
 await page.locator('#ils-sell-form textarea[name="description"]').fill('Mbyll');
 await page.locator('#ils-sell-form input[name="price"]').fill('10');
 await page.locator('#ils-sell-form button[type="submit"]').click();
 await page.locator('#illyrian-shop-layer .ils-card').filter({hasText:'Mbyll'}).first().locator('[data-ils="detail"]').click();
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#illyrian-shop-layer .ils-product-cover + .ils-kind + h2')).toHaveText('Mbyll');
  await expect(page.locator('#illyrian-shop-layer .ils-seller strong')).toHaveText('Mbyll');
  await expect(page.locator('#illyrian-shop-layer p.ils-description')).toHaveText('Mbyll');
 }
});

async function denyShopStorage(page){
 await page.evaluate(()=>{
  const previous=Storage.prototype.setItem;
  window.__restoreShopSetItem=()=>{Storage.prototype.setItem=previous};
  Storage.prototype.setItem=function(key,value){
   if(key==='illyrian_demo_v17_shop')throw new DOMException('Demo storage quota exceeded','QuotaExceededError');
   return previous.call(this,key,value);
  };
 });
}
async function restoreShopStorage(page){
 await page.evaluate(()=>{window.__restoreShopSetItem?.();delete window.__restoreShopSetItem});
}
async function openShopForStorage(page){
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
}
test('Shop rolls back failed add and listing creation, then recovers after storage is restored',async({page})=>{
 await openShopForStorage(page);
 const baseline=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'));
 await page.locator('#illyrian-shop-layer [data-ils="detail"][data-id="p1"]').click();
 await denyShopStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="add"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#illyrian-shop-layer .ils-cart b')).toHaveText('0');
 await page.locator('#illyrian-shop-layer [data-ils="back"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="sell"]').click();
 await page.locator('#ils-sell-form input[name="name"]').fill('Example local item');
 await page.locator('#ils-sell-form input[name="store"]').fill('Sample seller');
 await page.locator('#ils-sell-form input[name="price"]').fill('15');
 await page.locator('#ils-sell-form button[type="submit"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#ils-sell-form')).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(baseline);
 await restoreShopStorage(page);
 await page.locator('#ils-sell-form button[type="submit"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('The listing was saved only in this browser.');
 await expect(page.locator('#illyrian-shop-layer .ils-card').filter({hasText:'Example local item'})).toHaveCount(1);
});
test('Shop failed checkout, remove and contact never show false success',async({page})=>{
 await openShopForStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="detail"][data-id="p1"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="add"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="cart"]').click();
 const baseline=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'));
 await denyShopStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="checkout"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#illyrian-shop-layer .ils-cart-row')).toHaveCount(1);
 await expect(page.locator('#illyrian-shop-layer .ils-success')).toHaveCount(0);
 await page.locator('#illyrian-shop-layer [data-ils="remove-cart"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-cart-row')).toHaveCount(1);
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(baseline);
 await page.locator('#illyrian-shop-layer [data-ils="browse"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="detail"][data-id="c1"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="contact"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#illyrian-shop-layer .ils-success')).toHaveCount(0);
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(baseline);
 await restoreShopStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="contact"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-success')).toBeVisible();
});
test('Shop failed edits and deletes preserve original local listing',async({page})=>{
 await openShopForStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="sell"]').click();
 await page.locator('#ils-sell-form input[name="name"]').fill('Original listing');
 await page.locator('#ils-sell-form input[name="store"]').fill('Original seller');
 await page.locator('#ils-sell-form input[name="price"]').fill('10');
 await page.locator('#ils-sell-form button[type="submit"]').click();
 await page.locator('#illyrian-shop-layer .ils-card').filter({hasText:'Original listing'}).locator('[data-ils="detail"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="edit"]').click();
 const baseline=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'));
 await denyShopStorage(page);
 await page.locator('#ils-sell-form input[name="name"]').fill('Changed listing');
 await page.locator('#ils-sell-form button[type="submit"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#ils-sell-form')).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(baseline);
 await page.locator('#illyrian-shop-layer [data-ils="browse"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="my"]').click();
 await page.locator('#illyrian-shop-layer .ils-card').filter({hasText:'Original listing'}).locator('[data-ils="detail"]').click();
 page.on('dialog',dialog=>dialog.accept());
 await page.locator('#illyrian-shop-layer [data-ils="delete"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#illyrian-shop-layer h2[data-user-content]')).toHaveText('Original listing');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(baseline);
 await restoreShopStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="delete"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-card').filter({hasText:'Original listing'})).toHaveCount(0);
});

for(const locale of ['en','it']){
 test('i18n domain form codes remain unchanged in Shop Plus, Connections and Governance - '+locale,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
  const plus=await page.locator('#isp-need').evaluate(form=>({
   types:[...form.elements.type.options].map(o=>o.value),
   cities:[...form.elements.city.options].map(o=>o.value)
  }));
  expect(plus.types).toEqual(['Produkte','Makina','Banesa me qira','Shërbime']);
  expect(plus.cities).toEqual(['Tiranë','Durrës','Shkodër','Vlorë','Elbasan','Prishtinë']);
  await page.locator('#isp-root header button[data-isp="close"]').click();
  await page.keyboard.press('Escape');
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('#ilc-entry [data-ilc-entry]').click();
  await page.locator('#ilc-root [data-ilc="view:interest"]').click();
  const initial=await page.locator('#ilc-interest select[name="slot"]').evaluate(el=>[...el.options].map(o=>[o.getAttribute('value'),o.textContent]));
  expect(initial.length).toBeGreaterThan(0);
  expect(initial.every(([value])=>Boolean(value))).toBe(true);
  await page.locator('#ilc-root [data-ilc="overview"]').click();
  await page.locator('#ilc-root .ilc-sheet header button[data-ilc="close"]').click();
  await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
  await page.locator('#ig6-entry [data-ig6="open"]').click();
  await page.locator('#ig6-root [data-ig6="tab:reports"]').click();
  const reasons=await page.locator('#ig6-report select[name="reason"]').evaluate(el=>[...el.options].map(o=>o.value));
  expect(reasons).toContain('Mashtrim i dyshuar');
  expect(reasons).toContain('Shkelje privatësie');
 });
}

async function rejectModuleWrites(page,key){
 await page.evaluate(key=>{
  const previous=Storage.prototype.setItem;
  window.__restoreModuleWrites=()=>{Storage.prototype.setItem=previous};
  Storage.prototype.setItem=function(k,value){
   if(k===key)throw new DOMException('No local space','QuotaExceededError');
   return previous.call(this,k,value);
  };
 },key);
}
async function allowModuleWrites(page){
 await page.evaluate(()=>{window.__restoreModuleWrites?.();delete window.__restoreModuleWrites});
}
test('Shop Plus reverts failed buyer request instead of displaying unsaved request',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').click();
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 const key='illyrian_demo_v17_shop_plus';
 const before=await page.evaluate(key=>localStorage.getItem(key),key);
 await rejectModuleWrites(page,key);
 await page.locator('#isp-need input[name="title"]').fill('Electric bicycle request');
 await page.locator('#isp-need input[name="budget"]').fill('450');
 await page.locator('#isp-need button[type="submit"]').click();
 await expect(page.locator('#isp-root .isp-notice')).toContainText('Nuk u ruajt në këtë pajisje');
 await expect(page.locator('#isp-root .isp-card').filter({hasText:'Electric bicycle request'})).toHaveCount(0);
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#isp-need input[name="title"]').fill('Electric bicycle request');
 await page.locator('#isp-need input[name="budget"]').fill('450');
 await page.locator('#isp-need button[type="submit"]').click();
 await expect(page.locator('#isp-root .isp-card').filter({hasText:'Electric bicycle request'})).toHaveCount(1);
});
test('Connections reverts an unsaved interest and does not announce success',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('#ilc-entry [data-ilc-entry]').click();
 await page.locator('#ilc-root [data-ilc="view:interest"]').click();
 const key='illyrian_demo_v17_connections';
 const before=await page.evaluate(key=>localStorage.getItem(key),key);
 await rejectModuleWrites(page,key);
 await page.locator('#ilc-interest button[type="submit"]').click();
 await expect(page.locator('#ilc-root .ilc-note[role="status"]')).toContainText('ndryshimi nuk u ruajt');
 await expect(page.locator('#ilc-root .ilc-chosen')).toHaveCount(0);
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#ilc-interest button[type="submit"]').click();
 await expect(page.locator('#ilc-root .ilc-chosen')).toHaveCount(1);
});
test('Governance does not retain an unsaved report in simulated moderation',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#ig6-entry [data-ig6="open"]').click();
 await page.locator('#ig6-root [data-ig6="tab:reports"]').click();
 const key='illyrian_demo_v17_governance';
 const before=await page.evaluate(key=>localStorage.getItem(key),key);
 await rejectModuleWrites(page,key);
 await page.locator('#ig6-report input[name="target"]').fill('Unsaved example report');
 await page.locator('#ig6-report button[type="submit"]').click();
 await expect(page.locator('#ig6-root .ig6-note[role="status"]')).toContainText('Kufiri i të dhënave lokale');
 await expect(page.locator('#ig6-root .ig6-card').filter({hasText:'Unsaved example report'})).toHaveCount(0);
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#ig6-report input[name="target"]').fill('Unsaved example report');
 await page.locator('#ig6-report button[type="submit"]').click();
 await expect(page.locator('#ig6-root .ig6-card').filter({hasText:'Unsaved example report'})).toHaveCount(1);
});

for(const [lang,expected] of Object.entries({
 sq:{citiesInvalid:'Zgjidh dy qytete të ndryshme për këtë shembull.',citiesSaved:'Dy qytetet u ruajtën në pajisje.',reportSaved:'Raportimi u ruajt. Nuk iu dërgua askujt.',reportInvalid:'Kontrollo formularin ose kufirin e raporteve.'},
 en:{citiesInvalid:'Choose two different cities for this example.',citiesSaved:'Both cities were saved on this device.',reportSaved:'The report was saved locally. It was not sent to anyone.',reportInvalid:'Check the report form or the report limit.'},
 it:{citiesInvalid:'Scegli due città diverse per questo esempio.',citiesSaved:'Entrambe le città sono state salvate su questo dispositivo.',reportSaved:'La segnalazione è stata salvata localmente. Non è stata inviata a nessuno.',reportInvalid:'Controlla il modulo di segnalazione o il limite di segnalazioni.'}
})){
 test('Connections uses semantic '+lang+' notices and stable city values',async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('#ilc-entry [data-ilc-entry]').click();
  await page.locator('#ilc-root [data-ilc="view:cities"]').click();
  await page.locator('#ilc-cities select[name="origin"]').selectOption('Tiranë');
  await page.locator('#ilc-cities button[type="submit"]').click();
  await expect(page.locator('#ilc-root .ilc-note[role="status"]')).toHaveText(expected.citiesInvalid);
  await page.locator('#ilc-cities select[name="origin"]').selectOption('Milano');
  await page.locator('#ilc-cities button[type="submit"]').click();
  await expect(page.locator('#ilc-root .ilc-note[role="status"]')).toHaveText(expected.citiesSaved);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_connections')));
  expect(saved.home).toBe('Tiranë');
  expect(saved.origin).toBe('Milano');
 });
 test('Governance uses semantic '+lang+' notices and keeps user report text',async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
  await page.locator('#ig6-entry [data-ig6="open"]').click();
  await page.locator('#ig6-root [data-ig6="tab:reports"]').click();
  await page.locator('#ig6-report').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await expect(page.locator('#ig6-root .ig6-note[role="status"]')).toHaveText(expected.reportInvalid);
  await page.locator('#ig6-report input[name="target"]').fill('Mbyll');
  await page.locator('#ig6-report button[type="submit"]').click();
  await expect(page.locator('#ig6-root .ig6-note[role="status"]')).toHaveText(expected.reportSaved);
  const report=page.locator('#ig6-root .ig6-card h4[data-user-content]').filter({hasText:'Mbyll'});
  await expect(report).toHaveText('Mbyll');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_governance')).cases);
  expect(saved[0].target).toBe('Mbyll');
  expect(saved[0].reason).toBe('Informacion i pasaktë');
  for(const next of ['sq','en','it']){
   await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),next);
   await expect(report).toHaveText('Mbyll');
  }
 });
}

for(const [locale,notices] of Object.entries({
 sq:{invalid:'Kontrollo kërkesën, qytetin, buxhetin dhe afatin.',saved:'Kërkesa u regjistrua vetëm në këtë pajisje.',listingInvalid:'Plotëso saktë emrin, dyqanin, qytetin dhe çmimin.'},
 en:{invalid:'Check the request, city, budget and deadline.',saved:'The request was saved only on this device.',listingInvalid:'Check the item name, shop, city and price.'},
 it:{invalid:'Controlla la richiesta, la città, il budget e la scadenza.',saved:'La richiesta è stata salvata solo su questo dispositivo.',listingInvalid:"Controlla il nome dell'articolo, il negozio, la città e il prezzo."}
})){
 test('Shop Plus '+locale+' request validation and saved canonical codes',async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
  await page.locator('#isp-need').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await expect(page.locator('#isp-root .isp-notice')).toHaveText(notices.invalid);
  await page.locator('#isp-need input[name="title"]').fill('Mbyll');
  await page.locator('#isp-need input[name="budget"]').fill('300');
  await page.locator('#isp-need button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-notice')).toHaveText(notices.saved);
  const needs=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).needs);
  expect(needs[0].title).toBe('Mbyll');
  expect(needs[0].type).toBe('Produkte');
  expect(needs[0].city).toBe('Tiranë');
 });
 test('Shop Plus '+locale+' listing validation shows semantic feedback',async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="create"]').click();
  await page.locator('#isp-create').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await expect(page.locator('#isp-root .isp-notice')).toHaveText(notices.listingInvalid);
 });
}
test('Shop Plus preserves unsaved request input on storage rejection, then succeeds without retyping',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 await page.locator('#isp-need input[name="title"]').fill('Mbyll');
 await page.locator('#isp-need input[name="budget"]').fill('425');
 await page.locator('#isp-need textarea[name="details"]').fill('Custom description Mbyll');
 const storageKey='illyrian_demo_v17_shop_plus';
 const before=await page.evaluate(key=>localStorage.getItem(key),storageKey);
 await rejectModuleWrites(page,storageKey);
 await page.locator('#isp-need button[type="submit"]').click();
 await expect(page.locator('#isp-root .isp-notice')).toHaveText('Could not save on this device. Try removing old listings.');
 await expect(page.locator('#isp-need input[name="title"]')).toHaveValue('Mbyll');
 await expect(page.locator('#isp-need input[name="budget"]')).toHaveValue('425');
 await expect(page.locator('#isp-need textarea[name="details"]')).toHaveValue('Custom description Mbyll');
 expect(await page.evaluate(key=>localStorage.getItem(key),storageKey)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#isp-need button[type="submit"]').click();
 await expect(page.locator('#isp-root .isp-notice')).toHaveText('The request was saved only on this device.');
 const need=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).needs[0]);
 expect(need.title).toBe('Mbyll');
 expect(need.details).toBe('Custom description Mbyll');
});

test('Shop Plus preserves user listing title, seller and description across locale changes',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="create"]').click();
 await page.locator('#isp-create input[name="name"]').fill('Mbyll');
 await page.locator('#isp-create input[name="store"]').fill('Mbyll');
 await page.locator('#isp-create input[name="price"]').fill('10');
 await page.locator('#isp-create textarea[name="details"]').fill('Mbyll');
 await page.locator('#isp-create button[type="submit"]').click();
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#isp-root .isp-focus h3[data-user-content]')).toHaveText('Mbyll');
  await expect(page.locator('#isp-root .isp-focus p[data-user-content]')).toHaveText('Mbyll');
  await expect(page.locator('#isp-root .isp-focus p span[data-user-content]')).toHaveText('Mbyll');
 }
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
 expect(saved.name).toBe('Mbyll');
 expect(saved.store).toBe('Mbyll');
 expect(saved.details).toBe('Mbyll');
});
test('Shop Plus protects user request name and details on language switch',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 await page.locator('#isp-need input[name="title"]').fill('Mbyll');
 await page.locator('#isp-need input[name="budget"]').fill('550');
 await page.locator('#isp-need textarea[name="details"]').fill('Mbyll');
 await page.locator('#isp-need button[type="submit"]').click();
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#isp-root .isp-card h4[data-user-content]').filter({hasText:'Mbyll'})).toHaveText('Mbyll');
  await expect(page.locator('#isp-root .isp-card p[data-user-content]').filter({hasText:'Mbyll'})).toHaveText('Mbyll');
 }
});

for(const [lang,labels] of Object.entries({
 sq:{category:'Kategoria',inventory:'Inventari produkt (copë)',period:'Periudha e qirasë',month:'Për muaj',week:'Për javë',request:'Buxheti maksimal €',reason:'Arsyeja',fraud:'Mashtrim i dyshuar',days:'7 ditë',save:'Ruaj raportimin (demo)'},
 en:{category:'Category',inventory:'Product stock (units)',period:'Rental period',month:'Per month',week:'Per week',request:'Maximum budget €',reason:'Reason',fraud:'Suspected fraud',days:'7 days',save:'Save report (demo)'},
 it:{category:'Categoria',inventory:'Giacenza prodotto (unità)',period:'Periodo di affitto',month:'Al mese',week:'A settimana',request:'Budget massimo €',reason:'Motivo',fraud:'Sospetta frode',days:'7 giorni',save:'Salva segnalazione (demo)'}
})){
 test('Shop Plus static listing form is localized with immutable values: '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="create"]').click();
  const f=page.locator('#isp-create');
  await expect(f.locator('label:has(select[name="type"])')).toContainText(labels.category);
  await expect(f.locator('label:has(input[name="quantity"])')).toContainText(labels.inventory);
  await expect(f.locator('label:has(select[name="period"])')).toContainText(labels.period);
  const options=await f.locator('select[name="period"]').evaluate(el=>[...el.options].map(o=>({value:o.value,label:o.textContent.trim()})));
  expect(options).toEqual([{value:'muaj',label:labels.month},{value:'javë',label:labels.week}]);
  expect(await f.locator('select[name="type"] option').evaluateAll(nodes=>nodes.map(n=>n.value))).toEqual(['Produkte','Makina','Banesa me qira','Shërbime']);
  await f.locator('input[name="name"]').fill('Mbyll');
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang==='it'?'en':'it');
  await expect(f.locator('input[name="name"]')).toHaveValue('Mbyll');
  expect(await f.locator('select[name="type"] option').evaluateAll(nodes=>nodes.map(n=>n.value))).toEqual(['Produkte','Makina','Banesa me qira','Shërbime']);
 });
 test('Shop Plus static request form labels translate and keep deadline values: '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
  const f=page.locator('#isp-need');
  await expect(f.locator('label:has(input[name="budget"])')).toContainText(labels.request);
  const dates=await f.locator('select[name="days"]').evaluate(el=>[...el.options].map(o=>({code:o.value,label:o.textContent.trim()})));
  expect(dates.map(x=>x.code)).toEqual(['7','14','30']);
  expect(dates[0].label).toBe(labels.days);
  await f.locator('input[name="title"]').fill('Local buyer request');
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang==='en'?'sq':'en');
  await expect(f.locator('input[name="title"]')).toHaveValue('Local buyer request');
 });
 test('Shop Plus report reason labels localize without changing reason codes: '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="item:k1"]').click();
  await page.locator('#isp-root [data-isp="report:k1"]').click();
  const f=page.locator('#isp-report');
  await expect(f.locator('label:has(select[name="reason"])')).toContainText(labels.reason);
  const options=await f.locator('select[name="reason"]').evaluate(el=>[...el.options].map(o=>({code:o.value,label:o.textContent.trim()})));
  expect(options.map(x=>x.code)).toEqual(['Informacion i pasaktë','Mashtrim i dyshuar','Listim i dyfishuar','Përmbajtje e papërshtatshme']);
  expect(options[1].label).toBe(labels.fraud);
  await expect(f.locator('button[type="submit"]')).toHaveText(labels.save);
  await f.locator('select[name="reason"]').selectOption('Mashtrim i dyshuar');
  await f.locator('textarea[name="detail"]').fill('Mbyll');
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang==='it'?'sq':'it');
  await expect(f.locator('select[name="reason"]')).toHaveValue('Mashtrim i dyshuar');
  await expect(f.locator('textarea[name="detail"]')).toHaveValue('Mbyll');
 });
}

test('Plans rejects unsaved event creation without losing form input or stored data',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 await page.locator('#ilp-root [data-ilp="new"]').click();
 const form=page.locator('#ilp-form');
 await form.locator('input[name="title"]').fill('Weekend plan Mbyll');
 await form.locator('input[name="place"]').fill('Public meeting location');
 const key='illyrian_demo_v17_plans';
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await rejectModuleWrites(page,key);
 await form.locator('button[type="submit"]').click();
 await expect(form).toBeVisible();
 await expect(form.locator('#ilp-error')).toHaveText('Nuk mund të ruhej ndryshimi në pajisje.');
 await expect(form.locator('input[name="title"]')).toHaveValue('Weekend plan Mbyll');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await allowModuleWrites(page);
 await form.locator('button[type="submit"]').click();
 await expect(page.locator('#ilp-root .ilp-card h3[data-user-content]')).toHaveCount(0);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_plans')).events);
 expect(saved.some(x=>x.title==='Weekend plan Mbyll')).toBe(true);
 await expect(page.locator('#ilp-root h3[data-user-content]')).toHaveText('Weekend plan Mbyll');
});
test('Plans failed cancel restores stored event and never claims success',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 await page.locator('#ilp-root [data-ilp="detail:demo-football"]').click();
 const key='illyrian_demo_v17_plans';
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await rejectModuleWrites(page,key);
 page.on('dialog',dlg=>dlg.accept());
 await page.locator('#ilp-root [data-ilp="cancel"]').click();
 await expect(page.locator('#ilp-root .ilp-notice')).toHaveText('Nuk mund të ruhej ndryshimi në pajisje.');
 await expect(page.locator('#ilp-root [data-ilp="cancel"]')).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#ilp-root [data-ilp="cancel"]').click();
 await expect(page.locator('#ilp-root .ilp-notice')).toHaveText('Aktiviteti u anulua.');
});

for(const [locale,messages] of Object.entries({
 en:{bad:'Title or location is too short.',saved:'Activity saved in the demo.',quota:'Could not save the change on this device.'},
 it:{bad:'Il titolo o il luogo è troppo breve.',saved:'Attività salvata nella demo.',quota:'Impossibile salvare la modifica sul dispositivo.'}
})){
 test('Plans semantic validation and success feedback in '+locale,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('[data-ilp-entry]').first().click();
  await page.locator('#ilp-root [data-ilp="new"]').click();
  const form=page.locator('#ilp-form');
  await form.evaluate(el=>el.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await expect(form.locator('#ilp-error')).toHaveText(messages.bad);
  await form.locator('input[name="title"]').fill('Mbyll plan');
  await form.locator('input[name="place"]').fill('Public meeting square');
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('#ilp-root .ilp-notice')).toHaveText(messages.saved);
  await expect(page.locator('#ilp-root h3[data-user-content]')).toHaveText('Mbyll plan');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_plans')).events[0]);
  expect(saved.title).toBe('Mbyll plan');
  expect(saved.kind).toBe('Sport');
  expect(saved.city).toBe('Tiranë');
 });
 test('Plans localized storage rejection in '+locale+' preserves editable input',async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('[data-ilp-entry]').first().click();
  await page.locator('#ilp-root [data-ilp="new"]').click();
  const form=page.locator('#ilp-form');
  await form.locator('input[name="title"]').fill('Original Mbyll activity');
  await form.locator('input[name="place"]').fill('Public location');
  const key='illyrian_demo_v17_plans',before=await page.evaluate(k=>localStorage.getItem(k),key);
  await rejectModuleWrites(page,key);
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('#ilp-error')).toHaveText(messages.quota);
  await expect(form.locator('input[name="title"]')).toHaveValue('Original Mbyll activity');
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
  await allowModuleWrites(page);
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('#ilp-root .ilp-notice')).toHaveText(messages.saved);
 });
}

test('Privacy rolls back unsaved private follow request and retries successfully',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 const key='illyrian_demo_v17_privacy_map',before=await page.evaluate(k=>localStorage.getItem(k),key);
 await rejectModuleWrites(page,key);
 await page.locator('#il4-root [data-il4="follow-request"]').click();
 await expect(page.locator('#il4-root .il4-notice')).toHaveText('Change not saved; local storage is full.');
 await expect(page.locator('#il4-root [data-il4="follow-request"]')).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#il4-root [data-il4="follow-request"]').click();
 await expect(page.locator('#il4-root .il4-notice')).toHaveText('Action saved in the demo.');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_privacy_map')));
 expect(saved.follow.leon).toBe('pending');
});
test('Privacy quota failure restores group membership status',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 await page.locator('#il4-root [data-il4="tab:groups"]').click();
 const key='illyrian_demo_v17_privacy_map',before=await page.evaluate(k=>localStorage.getItem(k),key);
 await rejectModuleWrites(page,key);
 await page.locator('#il4-root [data-il4="group-request"]').click();
 await expect(page.locator('#il4-root .il4-notice')).toHaveText('Modifica non salvata: lo spazio locale è esaurito.');
 await expect(page.locator('#il4-root [data-il4="group-request"]')).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#il4-root [data-il4="group-request"]').click();
 await expect(page.locator('#il4-root .il4-notice')).toHaveText('Adesione/richiesta salvata nella demo.');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_privacy_map')));
 expect(saved.membership['albania-milan']).toBe('pending');
});
for(const [locale,labels] of Object.entries({
 sq:{all:'Të gjitha',activities:'Aktivitete',business:'Biznese',available:'Mund të kërkosh pjesëmarrje nga aktiviteti origjinal.',accepted:'I pranuar'},
 en:{all:'All',activities:'Activities',business:'Businesses',available:'You can request to join from the original activity.',accepted:'Accepted'},
 it:{all:'Tutte',activities:'Attività',business:'Attività commerciali',available:"Puoi richiedere di partecipare dall'attività originale.",accepted:'Accettato'}
})){
 test('Privacy stable map filter values and translated labels in '+locale,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
  await page.locator('#il4-entry [data-il4-entry]').click();
  await page.locator('#il4-root [data-il4="tab:map"]').click();
  const opts=await page.locator('#il4-mapform select[name="kind"]').evaluate(el=>[...el.options].map(x=>({value:x.value,label:x.textContent.trim()})));
  expect(opts).toEqual([{value:'all',label:labels.all},{value:'activity',label:labels.activities},{value:'business',label:labels.business}]);
  await page.locator('#il4-mapform select[name="kind"]').selectOption('business');
  await page.locator('#il4-mapform button[type="submit"]').click();
  await expect(page.locator('#il4-mapform select[name="kind"]')).toHaveValue('business');
  await page.locator('#il4-root [data-il4="tab:states"]').click();
  await page.locator('#il4-root [data-il4="state:available"]').first().click();
  await expect(page.locator('#il4-root .il4-notice')).toContainText(labels.available);
 });
}
test('Privacy does not translate user-entered activity title on map',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  const day=new Date(Date.now()+14*24*60*60*1000).toISOString().slice(0,10);
  localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({events:[{id:'custom-map',title:'Mbyll',privacy:'public',cancelled:false,date:day,time:'17:00',city:'Tiranë'}],requests:[]}));
 });
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 await page.locator('#il4-root [data-il4="tab:map"]').click();
 await page.locator('#il4-root .il4-results [data-il4="pin:plan-0"]').click();
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#il4-root .il4-card h4[data-user-content]')).toHaveText('Mbyll');
 }
});

for(const [lang,expected] of Object.entries({
 sq:{title:'Privatësia dhe harta',profiles:'Profilet',groups:'Komunitetet',visitor:'Shiko si vizitor',footer:'Vetëm demonstrim lokal · Nuk ka përdorues, hartë, mesazhe apo kërkesa reale.'},
 en:{title:'Privacy and map',profiles:'Profiles',groups:'Communities',visitor:'View as visitor',footer:'Local demo only · No real users, map, messages or requests.'},
 it:{title:'Privacy e mappa',profiles:'Profili',groups:'Comunità',visitor:'Visualizza come visitatore',footer:'Solo demo locale · Nessun utente, mappa, messaggio o richiesta reale.'}
})){
 test('Privacy direct semantic labels render in '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
  await page.locator('#il4-entry [data-il4-entry]').click();
  await expect(page.locator('#il4-root .il4-head h2')).toHaveText(expected.title);
  await expect(page.locator('#il4-root [data-il4="tab:profiles"]')).toHaveText(expected.profiles);
  await expect(page.locator('#il4-root [data-il4="tab:groups"]')).toHaveText(expected.groups);
  await expect(page.locator('#il4-root [data-il4="role:visitor"]')).toHaveText(expected.visitor);
  await expect(page.locator('#il4-root footer')).toHaveText(expected.footer);
 });
}
test('Privacy open map keeps unsubmitted filters and focus on live language switch',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 await page.locator('#il4-root [data-il4="tab:map"]').click();
 const form=page.locator('#il4-mapform');
 await form.locator('select[name="city"]').selectOption('Milano');
 await form.locator('select[name="kind"]').selectOption('business');
 await form.locator('input[name="q"]').fill('Mbyll kërkim');
 await form.locator('input[name="q"]').focus();
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await expect(page.locator('#il4-root .il4-head h2')).toHaveText('Privacy and map');
 await expect(page.locator('#il4-mapform select[name="city"]')).toHaveValue('Milano');
 await expect(page.locator('#il4-mapform select[name="kind"]')).toHaveValue('business');
 await expect(page.locator('#il4-mapform input[name="q"]')).toHaveValue('Mbyll kërkim');
 expect(await page.evaluate(()=>document.activeElement?.getAttribute('name'))).toBe('q');
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(page.locator('#il4-root .il4-head h2')).toHaveText('Privacy e mappa');
 await expect(page.locator('#il4-mapform input[name="q"]')).toHaveValue('Mbyll kërkim');
});
test('Privacy profile and group user-origin fields remain unchanged through locale switches',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 await page.locator('#il4-root [data-il4="role:owner"]').click();
 const profile=page.locator('#il4-root .il4-card h4[data-user-content]');
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(profile).toHaveText('Leon M.');
  await expect(page.locator('#il4-root .il4-card p[data-user-content]')).toHaveText('Përshkrim privat që nuk duhet shfaqur pa miratim.');
 }
 await page.locator('#il4-root [data-il4="tab:groups"]').click();
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#il4-root .il4-card h4[data-user-content]')).toHaveText('Shqiptarët në Milano');
 }
});

for(const [lang,expectations] of Object.entries({
 sq:{groups:'Komunitete me rregulla dhe role',map:'Zbulo aktivitetet dhe bizneset sipas qytetit',city:'Qyteti',kind:'Lloji',button:'Filtro',placeholder:'P.sh. kafe, futboll, dyqan',states:'Gjendjet e aktiviteteve dhe kthimi i sigurt'},
 en:{groups:'Communities with rules and roles',map:'Discover activities and businesses by city',city:'City',kind:'Type',button:'Filter',placeholder:'E.g. café, football, shop',states:'Activity statuses and safe navigation'},
 it:{groups:'Comunità con regole e ruoli',map:'Scopri attività e aziende per città',city:'Città',kind:'Tipo',button:'Filtra',placeholder:'Es. bar, calcio, negozio',states:'Stati delle attività e navigazione sicura'}
})){
 test('Privacy direct map, group and plan-state headings in '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
  await page.locator('#il4-entry [data-il4-entry]').click();
  await page.locator('#il4-root [data-il4="tab:groups"]').click();
  await expect(page.locator('#il4-root h3').first()).toHaveText(expectations.groups);
  await page.locator('#il4-root [data-il4="tab:map"]').click();
  await expect(page.locator('#il4-root h3').first()).toHaveText(expectations.map);
  const form=page.locator('#il4-mapform');
  await expect(form.locator('label:has(select[name="city"])')).toContainText(expectations.city);
  await expect(form.locator('label:has(select[name="kind"])')).toContainText(expectations.kind);
  await expect(form.locator('input[name="q"]')).toHaveAttribute('placeholder',expectations.placeholder);
  await expect(form.locator('button[type="submit"]')).toHaveText(expectations.button);
  const kinds=await form.locator('select[name="kind"] option').evaluateAll(nodes=>nodes.map(x=>x.value));
  expect(kinds).toEqual(['all','activity','business']);
  const cityCodes=await form.locator('select[name="city"] option').evaluateAll(nodes=>nodes.map(x=>x.value));
  expect(cityCodes).toContain('Tiranë');
  await page.locator('#il4-root [data-il4="tab:states"]').click();
  await expect(page.locator('#il4-root h3').first()).toHaveText(expectations.states);
 });
}

test('Direct i18n binding is never overwritten by phrase translation collisions',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 await expect(page.locator('#il4-root [data-il4="tab:profiles"]')).toHaveText('Profili');
 await page.evaluate(()=>{
  const marker=document.createElement('span');
  marker.id='i18n-direct-probe';marker.dataset.i18nDirect='1';
  marker.textContent='Profili';document.querySelector('#phone').append(marker);
 });
 await expect(page.locator('#i18n-direct-probe')).toHaveText('Profili');
 for(const lang of ['en','sq','it']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#i18n-direct-probe')).toHaveText('Profili');
 }
});

for(const [lang,expected] of Object.entries({
 sq:{create:'Krijo aktivitetin',type:'Lloji',city:'Qyteti',place:'Vendi',kind:'Miqësi dhe komunitet',privacy:'Dukshmëria',private:'Privat',submit:'Publiko aktivitetin (demo)'},
 en:{create:'Create activity',type:'Type',city:'City',place:'Location',kind:'Friendship and community',privacy:'Visibility',private:'Private',submit:'Publish activity (demo)'},
 it:{create:'Crea attività',type:'Tipo',city:'Città',place:'Luogo',kind:'Amicizia e comunità',privacy:'Visibilità',private:'Privato',submit:'Pubblica attività (demo)'}
})){
 test('Plans direct semantic form labels and unchanged option codes in '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('[data-ilp-entry]').first().click();
  await page.locator('#ilp-root [data-ilp="new"]').click();
  const form=page.locator('#ilp-form');
  await expect(page.locator('#ilp-root h3[data-i18n-direct]')).toHaveText(expected.create);
  await expect(form.locator('label:has(select[name="kind"])')).toContainText(expected.type);
  await expect(form.locator('label:has(select[name="city"])')).toContainText(expected.city);
  await expect(form.locator('label:has(input[name="place"])')).toContainText(expected.place);
  await expect(form.locator('label:has(select[name="privacy"])')).toContainText(expected.privacy);
  const types=await form.locator('select[name="kind"] option').evaluateAll(x=>x.map(z=>({value:z.value,label:z.textContent.trim()})));
  expect(types.map(x=>x.value)).toEqual(['Sport','Miqësi dhe komunitet','Kulturë','Alumni','Bashkëpunim']);
  expect(types[1].label).toBe(expected.kind);
  const vis=await form.locator('select[name="privacy"] option').evaluateAll(x=>x.map(z=>({value:z.value,label:z.textContent.trim()})));
  expect(vis.map(x=>x.value)).toEqual(['public','private']);
  expect(vis[1].label).toBe(expected.private);
  await expect(form.locator('button[type="submit"]')).toHaveText(expected.submit);
 });
}
test('Plans live language switching keeps every unsaved field, canonical selections and focus',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 await page.locator('#ilp-root [data-ilp="new"]').click();
 const form=page.locator('#ilp-form');
 await form.locator('input[name="title"]').fill('Mbyll takim komuniteti');
 await form.locator('select[name="kind"]').selectOption('Miqësi dhe komunitet');
 await form.locator('select[name="city"]').selectOption('Milano');
 await form.locator('input[name="place"]').fill('Mbyll public square');
 await form.locator('input[name="capacity"]').fill('15');
 await form.locator('input[name="price"]').fill('12.5');
 await form.locator('select[name="privacy"]').selectOption('private');
 await form.locator('textarea[name="conditions"]').fill('Mbyll - participant supplied conditions');
 await form.locator('textarea[name="conditions"]').focus();
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(form.locator('input[name="title"]')).toHaveValue('Mbyll takim komuniteti');
  await expect(form.locator('select[name="kind"]')).toHaveValue('Miqësi dhe komunitet');
  await expect(form.locator('select[name="city"]')).toHaveValue('Milano');
  await expect(form.locator('input[name="place"]')).toHaveValue('Mbyll public square');
  await expect(form.locator('input[name="capacity"]')).toHaveValue('15');
  await expect(form.locator('input[name="price"]')).toHaveValue('12.5');
  await expect(form.locator('select[name="privacy"]')).toHaveValue('private');
  await expect(form.locator('textarea[name="conditions"]')).toHaveValue('Mbyll - participant supplied conditions');
  expect(await page.evaluate(()=>document.activeElement?.name)).toBe('conditions');
 }
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(before);
});
test('Plans user-authored place, event title and conditions are stable when locale switches',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 await page.locator('#ilp-root [data-ilp="new"]').click();
 const form=page.locator('#ilp-form');
 await form.locator('input[name="title"]').fill('Mbyll gathering');
 await form.locator('input[name="place"]').fill('Mbyll');
 await form.locator('textarea[name="conditions"]').fill('Mbyll');
 await form.locator('button[type="submit"]').click();
 const node=page.locator('#ilp-root');
 for(const lang of ['en','sq','it']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(node.locator('h3[data-user-content]')).toHaveText('Mbyll gathering');
  await expect(node.locator('span[data-user-content]')).toHaveText('Mbyll');
  await expect(node.locator('p[data-user-content]')).toHaveText('Mbyll');
 }
 const actual=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_plans')).events[0]);
 expect(actual.title).toBe('Mbyll gathering');
 expect(actual.place).toBe('Mbyll');
 expect(actual.conditions).toBe('Mbyll');
});
