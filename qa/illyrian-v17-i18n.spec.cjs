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
