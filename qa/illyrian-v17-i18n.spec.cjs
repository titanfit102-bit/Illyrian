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

for(const [lang,label] of Object.entries({
 sq:{create:'Publiko ofertë në demo',category:'Kategoria',seller:'Dyqani / shitësi',period:'Periudha e qirasë',month:'Për muaj',week:'Për javë',product:'Produkte',request:'Kërkoj',budget:'Buxheti maksimal €',deadline:'7 ditë',report:'Arsyeja',fraud:'Mashtrim i dyshuar',submit:'Ruaj raportimin (demo)',search:'Kërko',apply:'Apliko filtrat',sort:'Renditja',title:'Shop i avancuar'},
 en:{create:'Publish offer in demo',category:'Category',seller:'Shop / seller',period:'Rental period',month:'Per month',week:'Per week',product:'Products',request:'Looking for',budget:'Maximum budget €',deadline:'7 days',report:'Reason',fraud:'Suspected fraud',submit:'Save report (demo)',search:'Search',apply:'Apply filters',sort:'Sort',title:'Advanced Shop'},
 it:{create:'Pubblica offerta nella demo',category:'Categoria',seller:'Negozio / venditore',period:'Periodo di affitto',month:'Al mese',week:'A settimana',product:'Prodotti',request:'Cerco',budget:'Budget massimo €',deadline:'7 giorni',report:'Motivo',fraud:'Sospetta frode',submit:'Salva segnalazione (demo)',search:'Cerca',apply:'Applica filtri',sort:'Ordina',title:'Shop avanzato'}
})){
 test('Shop Plus direct catalog and listing labels retain domain codes: '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await expect(page.locator('#isp-root header h2[data-i18n-direct]')).toHaveText(label.title);
  const filters=page.locator('#isp-filters');
  await expect(filters.locator('label:has(input[name="q"])')).toContainText(label.search);
  await expect(filters.locator('label:has(select[name="sort"])')).toContainText(label.sort);
  await expect(filters.locator('button[type="submit"]')).toHaveText(label.apply);
  expect(await filters.locator('select[name="sort"] option').evaluateAll(a=>a.map(e=>e.value))).toEqual(['relevance','lowest','highest','name']);
  await page.locator('#isp-root [data-isp="create"]').click();
  const form=page.locator('#isp-create');
  await expect(page.locator('#isp-root h3[data-i18n-direct]')).toHaveText(label.create);
  await expect(form.locator('label:has(select[name="type"])')).toContainText(label.category);
  await expect(form.locator('label:has(input[name="store"])')).toContainText(label.seller);
  await expect(form.locator('label:has(select[name="period"])')).toContainText(label.period);
  const types=await form.locator('select[name="type"] option').evaluateAll(a=>a.map(e=>({value:e.value,text:e.textContent.trim()})));
  expect(types[0]).toEqual({value:'Produkte',text:label.product});
  expect(types.map(x=>x.value)).toEqual(['Produkte','Makina','Banesa me qira','Shërbime']);
  const period=await form.locator('select[name="period"] option').evaluateAll(a=>a.map(e=>({value:e.value,text:e.textContent.trim()})));
  expect(period).toEqual([{value:'muaj',text:label.month},{value:'javë',text:label.week}]);
  await expect(form.locator('button[type="submit"]')).toHaveText({sq:'Publiko në demo',en:'Publish in demo',it:'Pubblica nella demo'}[lang]);
 });
 test('Shop Plus direct buyer request and report preserve canonical codes: '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
  const need=page.locator('#isp-need');
  await expect(need.locator('label:has(input[name="title"])')).toContainText(label.request);
  await expect(need.locator('label:has(input[name="budget"])')).toContainText(label.budget);
  const days=await need.locator('select[name="days"] option').evaluateAll(a=>a.map(e=>({value:e.value,text:e.textContent.trim()})));
  expect(days[0]).toEqual({value:'7',text:label.deadline});
  expect(days.map(x=>x.value)).toEqual(['7','14','30']);
  await page.locator('#isp-root [data-isp="tab:catalog"]').click();
  await page.locator('#isp-root [data-isp="item:k1"]').click();
  await page.locator('#isp-root [data-isp="report:k1"]').click();
  const form=page.locator('#isp-report');
  await expect(form.locator('label:has(select[name="reason"])')).toContainText(label.report);
  const reasons=await form.locator('select[name="reason"] option').evaluateAll(a=>a.map(e=>({value:e.value,text:e.textContent.trim()})));
  expect(reasons[1]).toEqual({value:'Mashtrim i dyshuar',text:label.fraud});
  await expect(form.locator('button[type="submit"]')).toHaveText(label.submit);
 });
}
test('Shop Plus language changes retain unsent listing and buyer request fields and focus',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="create"]').click();
 const listing=page.locator('#isp-create');
 await listing.locator('select[name="type"]').selectOption('Banesa me qira');
 await listing.locator('input[name="name"]').fill('Mbyll banesë');
 await listing.locator('input[name="store"]').fill('Mbyll seller');
 await listing.locator('select[name="city"]').selectOption('Durrës');
 await listing.locator('input[name="price"]').fill('440.5');
 await listing.locator('select[name="period"]').selectOption('javë');
 await listing.locator('textarea[name="details"]').fill('Mbyll, untranslated user description');
 await listing.locator('textarea[name="details"]').focus();
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(listing.locator('select[name="type"]')).toHaveValue('Banesa me qira');
  await expect(listing.locator('input[name="name"]')).toHaveValue('Mbyll banesë');
  await expect(listing.locator('input[name="store"]')).toHaveValue('Mbyll seller');
  await expect(listing.locator('select[name="city"]')).toHaveValue('Durrës');
  await expect(listing.locator('input[name="price"]')).toHaveValue('440.5');
  await expect(listing.locator('select[name="period"]')).toHaveValue('javë');
  await expect(listing.locator('textarea[name="details"]')).toHaveValue('Mbyll, untranslated user description');
  expect(await page.evaluate(()=>document.activeElement?.getAttribute('name'))).toBe('details');
 }
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(before);
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 const request=page.locator('#isp-need');
 await request.locator('input[name="title"]').fill('Mbyll request');
 await request.locator('select[name="type"]').selectOption('Makina');
 await request.locator('input[name="budget"]').fill('330');
 await request.locator('textarea[name="details"]').fill('Mbyll custom details');
 await request.locator('textarea[name="details"]').focus();
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(request.locator('input[name="title"]')).toHaveValue('Mbyll request');
 await expect(request.locator('select[name="type"]')).toHaveValue('Makina');
 await expect(request.locator('input[name="budget"]')).toHaveValue('330');
 await expect(request.locator('textarea[name="details"]')).toHaveValue('Mbyll custom details');
 expect(await page.evaluate(()=>document.activeElement?.getAttribute('name'))).toBe('details');
});
test('Shop Plus report form keeps unsent reason and text on locale switch',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="item:k1"]').click();
 await page.locator('#isp-root [data-isp="report:k1"]').click();
 const report=page.locator('#isp-report');
 await report.locator('select[name="reason"]').selectOption('Mashtrim i dyshuar');
 await report.locator('textarea[name="detail"]').fill('Mbyll');
 await report.locator('textarea[name="detail"]').focus();
 for(const lang of ['it','en','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(report.locator('select[name="reason"]')).toHaveValue('Mashtrim i dyshuar');
  await expect(report.locator('textarea[name="detail"]')).toHaveValue('Mbyll');
  expect(await page.evaluate(()=>document.activeElement?.getAttribute('name'))).toBe('detail');
 }
});

for(const [lang,labels] of Object.entries({
 sq:{tag:'ILLYRIAN SHOP · KËRKIM I AVANCUAR',intro:'Krahaso dyqanet dhe shiko karakteristikat e ofertave. Çdo listim është demonstrues.',stock:'Inventari:',sold:'Pa stok (demo)',promoted:'PROMOVUAR · DEMO',compare:'I njëjti produkt, disa dyqane',shops:'Dyqanet e vogla',demoListings:'listime demonstrative',open:'Hap katalogun',fee:'Komision ilustrues 5%:',flow:'Rrjedhë ilustruese',simulate:'Simulo porosinë (pa pagesë)',created:'E krijuar në demo',return:'Kërkesë anulimi/kthimi (demo)'},
 en:{tag:'ILLYRIAN SHOP · ADVANCED SEARCH',intro:'Compare shops and inspect offer details. Every listing is fictional.',stock:'Stock:',sold:'Out of stock (demo)',promoted:'SPONSORED · DEMO',compare:'Same product, multiple shops',shops:'Small shops',demoListings:'demo listings',open:'Open catalog',fee:'Illustrative 5% fee:',flow:'Illustrative flow',simulate:'Simulate order (no payment)',created:'Created in demo',return:'Cancellation/return requested (demo)'},
 it:{tag:'ILLYRIAN SHOP · RICERCA AVANZATA',intro:'Confronta i negozi e consulta i dettagli delle offerte. Ogni annuncio è dimostrativo.',stock:'Disponibilità:',sold:'Esaurito (demo)',promoted:'SPONSORIZZATO · DEMO',compare:'Stesso prodotto, più negozi',shops:'Piccoli negozi',demoListings:'annunci demo',open:'Apri catalogo',fee:'Commissione illustrativa del 5%:',flow:'Flusso illustrativo',simulate:'Simula ordine (nessun pagamento)',created:'Creato nella demo',return:'Annullamento/reso richiesto (demo)'}
})){
 test('Shop Plus catalog cards, comparison and sponsored disclaimers in '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(x=>window.IllyrianI18n.changeLanguage(x),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await expect(page.locator('#isp-root .isp-hero b[data-i18n-direct]')).toHaveText(labels.tag);
  await expect(page.locator('#isp-root .isp-hero p[data-i18n-direct]')).toHaveText(labels.intro);
  await expect(page.locator('#isp-root .isp-compare h3[data-i18n-direct]')).toHaveText(labels.compare);
  await expect(page.locator('#isp-root .isp-sponsored').first()).toHaveText(labels.promoted);
  const sold=page.locator('#isp-root .isp-card').filter({hasText:'Market Bora'});
  await expect(sold.locator('p').last()).toContainText(labels.sold);
  const seeded=page.locator('#isp-root .isp-card').filter({hasText:'Market Arbër'});
  await expect(seeded.locator('p').last()).toContainText(labels.stock);
  await expect(seeded.locator('h4[data-user-content]')).toHaveText('Kafe espresso 250 g');
  await expect(seeded.locator('span[data-user-content]')).toHaveText('Market Arbër');
  const codes=await page.locator('#isp-root .isp-kinds [data-isp^="type:"]').evaluateAll(nodes=>nodes.map(x=>x.dataset.isp));
  expect(codes).toEqual(['type:Të gjitha','type:Produkte','type:Makina','type:Banesa me qira','type:Shërbime']);
 });
 test('Shop Plus seller directory and simulated fee labels translate in '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(x=>window.IllyrianI18n.changeLanguage(x),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:stores"]').click();
  await expect(page.locator('#isp-root h3[data-i18n-direct]')).toHaveText(labels.shops);
  const row=page.locator('#isp-root .isp-card').filter({hasText:'Market Arbër'});
  await expect(row.locator('h4[data-user-content]')).toHaveText('Market Arbër');
  await expect(row).toContainText(labels.demoListings);
  await expect(row.locator('[data-isp^="store:"]')).toHaveText(labels.open);
  await page.locator('#isp-root [data-isp="tab:checkout"]').click();
  await expect(page.locator('#isp-root h4[data-i18n-direct]')).toHaveText(labels.flow);
  await expect(page.locator('#isp-root b[data-i18n-direct]').filter({hasText:'5%'})).toHaveText(labels.fee);
  await expect(page.locator('#isp-root [data-isp="sample-order"]')).toHaveText(labels.simulate);
  await expect(page.locator('#isp-root .isp-muted')).toContainText('5%');
  await expect(page.locator('#isp-root .isp-muted')).toContainText(lang==='en'?'not an approved fee':lang==='it'?'non è una commissione approvata':'nuk është tarifë e miratuar');
 });
}
test('Shop Plus order state retains original persisted enum while display localizes',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:checkout"]').click();
 await page.locator('#isp-root [data-isp="sample-order"]').click();
 const key='illyrian_demo_v17_shop_plus';
 let rows=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).sampleOrders,key);
 expect(rows.length).toBe(1);
 expect(rows[0].status).toBe('E krijuar në demo');
 const id=rows[0].id;
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await expect(page.locator('#isp-root .isp-card').filter({hasText:id})).toContainText('Created in demo');
 await page.locator('#isp-root [data-isp="sample-cancel:'+id+'"]').click();
 rows=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).sampleOrders,key);
 expect(rows[0].status).toBe('Kërkesë anulimi/kthimi (demo)');
 await expect(page.locator('#isp-root .isp-card').filter({hasText:id})).toContainText('Cancellation/return requested (demo)');
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(page.locator('#isp-root .isp-card').filter({hasText:id})).toContainText('Annullamento/reso richiesto (demo)');
});

test('Shop Plus does not mislabel unrecognized persisted order statuses as return requests',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  const key='illyrian_demo_v17_shop_plus';
  localStorage.setItem(key,JSON.stringify({items:[],needs:[],answers:[],flags:[],sampleOrders:[{id:'unknown-test',status:'Mbyll'}]}));
 });
 await page.reload({waitUntil:'load'});
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:checkout"]').click();
 const order=page.locator('#isp-root .isp-card').filter({hasText:'unknown-test'});
 await expect(order).toContainText('Mbyll');
 await expect(order).not.toContainText('Cancellation/return requested');
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(order).toContainText('Mbyll');
});


for(const [language,labels] of Object.entries({
 sq:{back:'← Kthehu te rezultatet',stock:'Gjendja:',fuel:'Karburanti:',diesel:'Naftë',area:'Sipërfaqe:',rental:'Qira për muaj',unit:'copë',report:'Raporto listimin'},
 en:{back:'← Back to results',stock:'Availability:',fuel:'Fuel:',diesel:'Diesel',area:'Area:',rental:'Rental per month',unit:'units',report:'Report listing'},
 it:{back:'← Torna ai risultati',stock:'Disponibilità:',fuel:'Carburante:',diesel:'Diesel',area:'Superficie:',rental:'Affitto per mese',unit:'unità',report:'Segnala annuncio'}
})){
 test('Shop Plus localized product vehicle and rental detail with stable seed content in '+language,async({page})=>{
  await ready(page);
  await page.evaluate(lang=>window.IllyrianI18n.changeLanguage(lang),language);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="item:k1"]').click();
  const detail=page.locator('#isp-root .isp-focus');
  await expect(page.locator('#isp-root [data-isp="catalog"]')).toHaveText(labels.back);
  await expect(detail).toContainText(labels.stock);
  await expect(detail).toContainText(labels.unit);
  await expect(detail).toContainText(labels.report);
  await expect(detail.locator('h3[data-user-content]')).toHaveText('Kafe espresso 250 g');
  await page.locator('#isp-root [data-isp="catalog"]').click();
  await page.locator('#isp-root [data-isp="item:v1"]').click();
  await expect(detail).toContainText(labels.fuel);
  await expect(detail).toContainText(labels.diesel);
  await expect(detail.locator('h3[data-user-content]')).toHaveText('Volkswagen Golf 7');
  await page.locator('#isp-root [data-isp="catalog"]').click();
  await page.locator('#isp-root [data-isp="item:h1"]').click();
  await expect(detail).toContainText(labels.area);
  await expect(detail).toContainText(labels.rental);
  await expect(detail.locator('strong [data-i18n-direct]')).toHaveText('/'+({sq:'muaj',en:'month',it:'mese'}[language]));
  await expect(detail.locator('h3[data-user-content]')).toHaveText('Apartament 2+1');
 });
}


for(const [language,labels] of Object.entries({
 sq:{heading:'“Kërkoj…” — kërkesat e komunitetit',empty:'Ende pa kërkesa lokale.',expires:'Skadon:',reply:'Përgjigju si dyqan (demo)',form:'Mesazhi demonstrues',moderation:'Raportime dhe etiketa të promovimit',pending:'Në shqyrtim (simulim, jo moderator real)',reason:'Mashtrim i dyshuar',close:'✕ Mbyll'},
 en:{heading:'“Looking for…” — community requests',empty:'No local requests yet.',expires:'Expires:',reply:'Reply as a shop (demo)',form:'Demo message',moderation:'Reports and sponsored labels',pending:'Under review (simulation, no real moderator)',reason:'Suspected fraud',close:'✕ Close'},
 it:{heading:'“Cerco…” — richieste della comunità',empty:'Nessuna richiesta locale.',expires:'Scade:',reply:'Rispondi come negozio (demo)',form:'Messaggio dimostrativo',moderation:'Segnalazioni e annunci sponsorizzati',pending:'In esame (simulazione, senza moderatore reale)',reason:'Sospetta frode',close:'✕ Chiudi'}
})){
 test('Shop Plus requests replies moderation and accessible labels in '+language,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),language);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await expect(page.locator('#illyrian-shop-layer [data-isp-open]')).toContainText({sq:'Kërkim i avancuar',en:'Advanced search',it:'Ricerca avanzata'}[language]);
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await expect(page.locator('#isp-root header [data-isp="close"]')).toHaveText(labels.close);
  await expect(page.locator('#isp-root .isp-panel')).toHaveAttribute('aria-label',{sq:'ILLYRIAN Shop i avancuar',en:'ILLYRIAN advanced shop',it:'Negozio avanzato ILLYRIAN'}[language]);
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
  await expect(page.locator('#isp-root h3[data-i18n-direct]')).toHaveText(labels.heading);
  await expect(page.locator('#isp-root .isp-empty')).toContainText(labels.empty);
  const form=page.locator('#isp-need');
  await form.locator('input[name="title"]').fill('Mbyll community request');
  await form.locator('input[name="budget"]').fill('250');
  await form.locator('select[name="days"]').selectOption('14');
  await form.locator('textarea[name="details"]').fill('Mbyll user description');
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-card').first()).toContainText(labels.expires);
  const needs=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).needs);
  expect(needs[0].title).toBe('Mbyll community request');
  expect(needs[0].details).toBe('Mbyll user description');
  await expect(page.locator('#isp-root .isp-card [data-isp^="respond:"]')).toHaveText(labels.reply);
  await page.locator('#isp-root .isp-card [data-isp^="respond:"]').click();
  await expect(page.locator('#isp-answer label')).toContainText(labels.form);
  await page.locator('#isp-answer textarea[name="text"]').fill('Mbyll response content');
  await page.locator('#isp-answer button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-reply [data-user-content]')).toHaveText('Mbyll response content');
  await page.locator('#isp-root [data-isp="tab:catalog"]').click();
  await page.locator('#isp-root [data-isp="item:k1"]').click();
  await page.locator('#isp-root [data-isp="report:k1"]').click();
  await page.locator('#isp-report select[name="reason"]').selectOption('Mashtrim i dyshuar');
  await page.locator('#isp-report button[type="submit"]').click();
  await expect(page.locator('#isp-root h3[data-i18n-direct]')).toHaveText(labels.moderation);
  await expect(page.locator('#isp-root .isp-card').first()).toContainText(labels.reason);
  await expect(page.locator('#isp-root .isp-card small')).toHaveText(labels.pending);
  const persisted=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
  expect(JSON.parse(persisted).flags[0].reason).toBe('Mashtrim i dyshuar');
  await page.evaluate(lang=>window.IllyrianI18n.changeLanguage(lang),language==='it'?'en':'it');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(persisted);
  await expect(page.locator('#isp-root .isp-card [data-user-content]').first()).toHaveText('Kafe espresso 250 g');
 });
}


test('Shop Plus preserves unknown report codes and escapes persisted user text across languages',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  localStorage.setItem('illyrian_demo_v17_shop_plus',JSON.stringify({items:[],needs:[],answers:[],sampleOrders:[],flags:[{target:'<img src=x onerror=alert(1)>',reason:'Unrecognized reason',detail:'Mbyll'}]}));
 });
 await page.reload({waitUntil:'load'});
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:moderation"]').click();
 const report=page.locator('#isp-root .isp-card').first();
 await expect(report.locator('[data-user-content]')).toHaveText('<img src=x onerror=alert(1)>');
 await expect(report).toContainText('Unrecognized reason');
 expect(await page.locator('#isp-root img[src="x"]').count()).toBe(0);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(report).toContainText('Unrecognized reason');
 await expect(report.locator('[data-user-content]')).toHaveText('<img src=x onerror=alert(1)>');
 const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')));
 expect(persisted.flags[0].reason).toBe('Unrecognized reason');
});

test('Shop Plus entry label switches languages before opening and close restores focus',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 const entry=page.locator('#illyrian-shop-layer [data-isp-open]').first();
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await expect(entry).toContainText('Advanced search');
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(entry).toContainText('Ricerca avanzata');
 await entry.focus();await entry.click();
 await expect(page.locator('#isp-root .isp-panel')).toHaveAttribute('aria-label','Negozio avanzato ILLYRIAN');
 await page.keyboard.press('Escape');
 await expect(page.locator('#isp-root')).toHaveCount(0);
 await expect(entry).toBeFocused();
});


test('Shop Plus draft seller response survives sq/en/it locale changes with focus and storage intact',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  const expires=new Date(Date.now()+86400000).toISOString();
  const state={
   items:[],needs:[{id:'audit-need',owned:true,type:'Produkte',city:'Tiranë',
    title:'Mbyll community inquiry',details:'Mbyll original request details',
    budget:220,expires}],answers:[],flags:[],sampleOrders:[]
  };
  localStorage.setItem('illyrian_demo_v17_shop_plus',JSON.stringify(state));
 });
 await page.reload({waitUntil:'load'});
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 await expect(page.locator('#isp-root h4[data-user-content]')).toHaveText('Mbyll community inquiry');
 await page.locator('#isp-root [data-isp="respond:audit-need"]').click();
 const response=page.locator('#isp-answer textarea[name="text"]');
 const draft='Mbyll custom message and details';
 await response.fill(draft);
 await response.focus();
 const saved=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
 const labels={sq:'Mesazhi demonstrues',en:'Demo message',it:'Messaggio dimostrativo'};
 for(const lang of ['en','it','sq']){
  await page.evaluate(x=>window.IllyrianI18n.changeLanguage(x),lang);
  await expect(page.locator('#isp-answer label')).toContainText(labels[lang]);
  await expect(response).toHaveValue(draft);
  await expect(response).toBeFocused();
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(saved);
  await expect(page.locator('#isp-root h3 [data-user-content]')).toHaveText('Mbyll community inquiry');
 }
 await page.locator('#isp-answer button[type="submit"]').click();
 const final=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')));
 expect(final.needs[0].title).toBe('Mbyll community inquiry');
 expect(final.answers).toEqual([{needId:'audit-need',text:draft}]);
 await expect(page.locator('#isp-root .isp-reply [data-user-content]')).toHaveText(draft);
});


for(const lang of ['sq','en','it']){
 test('Shop Plus audit F01 F07 preserve vehicle draft and zero mileage in '+lang,async({page})=>{
  await ready(page);await page.evaluate(x=>window.IllyrianI18n.changeLanguage(x),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="create"]').click();
  const f=page.locator('#isp-create');
  await f.locator('select[name="type"]').selectOption('Makina');
  await f.locator('input[name="name"]').fill('Mbyll vehicle draft');
  await f.locator('input[name="store"]').fill('Mbyll seller');
  await f.locator('input[name="price"]').fill('9999');
  await f.locator('textarea[name="details"]').fill('Mbyll retained text');
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
  await f.locator('button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-notice[role="status"]')).toBeVisible();
  await expect(f.locator('select[name="type"]')).toHaveValue('Makina');
  await expect(f.locator('input[name="name"]')).toHaveValue('Mbyll vehicle draft');
  await expect(f.locator('textarea[name="details"]')).toHaveValue('Mbyll retained text');
  await expect(f.locator('input[name="year"]')).toBeFocused();
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(before);
  await f.locator('input[name="year"]').fill('2026');
  await f.locator('button[type="submit"]').click();
  await expect(f.locator('input[name="mileage"]')).toBeFocused();
  await f.locator('input[name="mileage"]').fill('0');
  await f.locator('button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-focus')).toContainText('Mbyll vehicle draft');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
  expect(saved).toMatchObject({type:'Makina',year:2026,mileage:0,details:'Mbyll retained text'});
  await page.locator('#isp-root [data-isp^="edit:"]').click();
  await expect(page.locator('#isp-create input[name="mileage"]')).toHaveValue('0');
  await page.locator('#isp-create button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-focus')).not.toContainText('Mileage: –');
  await expect(page.locator('#isp-root .isp-focus')).not.toContainText('Kilometra: –');
  await page.reload({waitUntil:'load'});
  const latest=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
  expect(latest.mileage).toBe(0);
 });
 test('Shop Plus audit F01 preserves rental form after invalid area in '+lang,async({page})=>{
  await ready(page);await page.evaluate(x=>window.IllyrianI18n.changeLanguage(x),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="create"]').click();
  const f=page.locator('#isp-create');
  await f.locator('select[name="type"]').selectOption('Banesa me qira');
  await f.locator('input[name="name"]').fill('Mbyll rental draft');
  await f.locator('input[name="store"]').fill('Mbyll seller');
  await f.locator('input[name="price"]').fill('440');
  await f.locator('select[name="period"]').selectOption('javë');
  await f.locator('textarea[name="details"]').fill('Mbyll rental details');
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
  await f.locator('button[type="submit"]').click();
  await expect(f.locator('input[name="area"]')).toBeFocused();
  await expect(f.locator('select[name="type"]')).toHaveValue('Banesa me qira');
  await expect(f.locator('select[name="period"]')).toHaveValue('javë');
  await expect(f.locator('textarea[name="details"]')).toHaveValue('Mbyll rental details');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(before);
  await f.locator('input[name="area"]').fill('82');
  await f.locator('button[type="submit"]').click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
  expect(saved).toMatchObject({type:'Banesa me qira',area:82,period:'javë',details:'Mbyll rental details'});
 });
}
test('Shop Plus audit F01 edit retry leaves original saved until valid',async({page})=>{
 await ready(page);await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="create"]').click();
 let f=page.locator('#isp-create');
 await f.locator('input[name="name"]').fill('Mbyll original');
 await f.locator('input[name="store"]').fill('Demo seller');
 await f.locator('input[name="price"]').fill('30');
 await f.locator('button[type="submit"]').click();
 await page.locator('#isp-root [data-isp^="edit:"]').click();f=page.locator('#isp-create');
 await f.locator('select[name="type"]').selectOption('Makina');
 await f.locator('input[name="name"]').fill('Mbyll edited vehicle');
 await f.locator('input[name="price"]').fill('5000');
 await f.locator('textarea[name="details"]').fill('Mbyll pending change');
 const old=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
 await f.locator('button[type="submit"]').click();
 await expect(f.locator('input[name="year"]')).toBeFocused();
 await expect(f.locator('input[name="name"]')).toHaveValue('Mbyll edited vehicle');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(old);
 await f.locator('input[name="year"]').fill('2025');
 await f.locator('input[name="mileage"]').fill('0');
 await f.locator('button[type="submit"]').click();
 const updated=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
 expect(updated).toMatchObject({type:'Makina',name:'Mbyll edited vehicle',mileage:0,details:'Mbyll pending change'});
});
test('i18n audit F10 root and demo mirror files stay byte-identical',()=>{
 const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
 for(const file of ['illyrian-i18n.js','locales/sq.js','locales/en.js','locales/it.js']){
  const canonical=fs.readFileSync(path.join(root,'i18n',file));
  const served=fs.readFileSync(path.join(root,'demo','i18n',file));
  expect(canonical.equals(served),file+' mirror drift').toBe(true);
  const altered=Buffer.from(served);altered[0]^=1;
  expect(canonical.equals(altered),'negative parity check '+file).toBe(false);
 }
});



test('audit F04 failed feed save preserves draft and never reports success',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#screen .v5-profile-hero [data-act="modal"][data-val="compose"]').click();
 const field=page.locator('#layer #v5-text');
 const draft='Mbyll personal post survives rejection';
 await field.fill(draft);
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await rejectModuleWrites(page,'illyrian_demo_v09_state');
 await page.locator('#layer [data-act="v5-publish"]').click();
 await expect(field).toHaveValue(draft);
 await expect(page.locator('#toast-area')).toContainText('nuk u ruajt');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#layer [data-act="v5-publish"]').click();
 await expect(page.locator('#layer [data-act="v5-publish"]')).toHaveCount(0);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).posts);
 expect(saved.filter(p=>p.text===draft)).toHaveLength(1);
});

test('audit F03 corrupted local creator and Plans records do not crash on reopen',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  localStorage.setItem('illyrian_demo_v15_creator',JSON.stringify({
    stories:[null,42,{id:'s1',caption:'Mbyll',sample:'arta'}],
    reels:[{},false,{id:'r1',caption:'Mbyll',sample:'cafe'}]
  }));
  localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({
    events:[null,{},[],{id:'valid',title:'Mbyll demo plan',kind:'Sport',city:'Tiranë',place:'Park',date:'2027-10-23',time:'17:30',capacity:6,price:0,privacy:'public'}],
    requests:[null,{id:'r1',eventId:'valid',name:'Visitor',status:'pending'}],
    messages:[null,42,{eventId:'valid',name:'Visitor',text:'Mbyll'}],
    attendance:[null,42,'r1']
  }));
 });
 const before=await page.evaluate(()=>({
  media:localStorage.getItem('illyrian_demo_v15_creator'),
  plans:localStorage.getItem('illyrian_demo_v17_plans')
 }));
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.reload({waitUntil:'load'});
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await expect(page.locator('#screen [data-act="v15-view"][data-val="reel"]')).toHaveCount(1);
 await expect(page.locator('#screen [data-act="v15-view"][data-val="story"]')).toHaveCount(1);
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 await expect(page.locator('#ilp-root h3[data-user-content]')).toContainText('Mbyll demo plan');
 expect(errors).toEqual([]);
 const after=await page.evaluate(()=>({
  media:localStorage.getItem('illyrian_demo_v15_creator'),
  plans:localStorage.getItem('illyrian_demo_v17_plans')
 }));
 expect(after).toEqual(before);
});

test('audit F02 Reel and Story author caption remains unchanged on locale switch',async({page})=>{
 await ready(page);
 await page.evaluate(()=>localStorage.setItem('illyrian_demo_v15_creator',JSON.stringify({
  stories:[{id:'s1',caption:'Mbyll',sample:'arta'}],
  reels:[{id:'r1',caption:'Mbyll',sample:'cafe'}]
 })));
 await page.reload({waitUntil:'load'});
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#screen [data-act="v15-view"][data-val="reel"]').first().click();
 for(const lang of ['sq','en','it']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#layer .v16-viewer .v16-content > p[data-user-content]')).toHaveText('Mbyll');
 }
 await page.keyboard.press('Escape');
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#screen [data-act="v15-view"][data-val="story"]').first().click();
 for(const lang of ['it','en','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#layer .v16-viewer .v16-content > p[data-user-content]')).toHaveText('Mbyll');
 }
});


test('audit F08 rejects stale request in second tab and succeeds after reload',async({browser})=>{
 const context=await browser.newContext(),first=await context.newPage(),second=await context.newPage();
 async function prepare(page){
  await ready(page);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
 }
 await prepare(first);await prepare(second);
 await second.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await second.locator('#isp-need input[name="title"]').fill('Second tab draft Mbyll');
 await second.locator('#isp-need input[name="budget"]').fill('750');
 await second.locator('#isp-need textarea[name="details"]').fill('Mbyll unsaved description');
 await first.locator('#isp-need input[name="title"]').fill('First tab confirmed request');
 await first.locator('#isp-need input[name="budget"]').fill('300');
 await first.locator('#isp-need button[type="submit"]').click();
 await expect(second.locator('#isp-root .isp-notice')).toContainText('skedë tjetër');
 const original=await first.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
 await second.locator('#isp-need button[type="submit"]').click();
 await expect(second.locator('#isp-root .isp-notice')).toContainText('skedë tjetër');
 await expect(second.locator('#isp-need input[name="title"]')).toHaveValue('Second tab draft Mbyll');
 await expect(second.locator('#isp-need textarea[name="details"]')).toHaveValue('Mbyll unsaved description');
 expect(await second.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(original);
 await second.reload({waitUntil:'load'});
 await second.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await second.locator('[data-ilshop-open]').first().click();
 await second.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await second.locator('#isp-root [data-isp="tab:needs"]').click();
 await second.locator('#isp-need input[name="title"]').fill('Second tab after reload');
 await second.locator('#isp-need input[name="budget"]').fill('750');
 await second.locator('#isp-need button[type="submit"]').click();
 expect(await first.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).needs.map(x=>x.title))).toEqual(['First tab confirmed request','Second tab after reload']);
 await context.close();
});
test('audit F08 stale form warning follows locale without rewriting values',async({browser})=>{
 const context=await browser.newContext(),writer=await context.newPage(),other=await context.newPage();
 for(const page of [writer,other]){
  await ready(page);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
 }
 await other.locator('#isp-need input[name="title"]').fill('Original typed content Mbyll');
 await writer.locator('#isp-need input[name="title"]').fill('Other writer');
 await writer.locator('#isp-need input[name="budget"]').fill('100');
 await writer.locator('#isp-need button[type="submit"]').click();
 for(const [locale,word] of [['en','another tab'],['it','un’altra scheda'],['sq','skedë tjetër']]){
  await other.evaluate(lang=>window.IllyrianI18n.changeLanguage(lang),locale);
  await other.locator('#isp-need input[name="budget"]').fill('400');
  await other.locator('#isp-need button[type="submit"]').click();
  await expect(other.locator('#isp-root .isp-notice')).toContainText(word);
  await expect(other.locator('#isp-need input[name="title"]')).toHaveValue('Original typed content Mbyll');
 }
 expect(await writer.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).needs.map(n=>n.title))).toEqual(['Other writer']);
 await context.close();
});



test('Shop Plus rejects seller reply after request expires during an open draft, then allows retry',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  const saved={items:[],needs:[{
   id:'expiry-check',owned:true,type:'Produkte',city:'Tiranë',
   title:'Mbyll request awaiting reply',details:'User-provided text',
   budget:150,expires:new Date(Date.now()+86400000).toISOString()
  }],answers:[],flags:[],sampleOrders:[]};
  localStorage.setItem('illyrian_demo_v17_shop_plus',JSON.stringify(saved));
 });
 await page.reload({waitUntil:'load'});
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 await page.locator('#isp-root [data-isp="respond:expiry-check"]').click();
 const reply=page.locator('#isp-answer textarea[name="text"]');
 await reply.fill('Mbyll seller draft should survive expiry');
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
 await page.evaluate(()=>{
  window.__illyrianRealNow=Date.now;
  Date.now=()=>window.__illyrianRealNow()+2*86400000;
 });
 await page.locator('#isp-answer button[type="submit"]').click();
 await expect(page.locator('#isp-root .isp-notice')).toContainText('Kërkesa ose mesazhi');
 await expect(reply).toHaveValue('Mbyll seller draft should survive expiry');
 await expect(reply).toBeFocused();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(before);
 await page.evaluate(()=>{Date.now=window.__illyrianRealNow;delete window.__illyrianRealNow});
 await page.locator('#isp-answer button[type="submit"]').click();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')));
 expect(state.answers).toEqual([{needId:'expiry-check',text:'Mbyll seller draft should survive expiry'}]);
 await expect(page.locator('#isp-root .isp-reply [data-user-content]')).toHaveText('Mbyll seller draft should survive expiry');
});



for(const lang of ['sq','en','it']){
 test('Shop Plus category fields preserve drafts through switches '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="create"]').click();
  const f=page.locator('#isp-create');
  const product=f.locator('[data-isp-category="Produkte"]'),car=f.locator('[data-isp-category="Makina"]'),rental=f.locator('[data-isp-category="Banesa me qira"]');
  await expect(product.first()).toBeVisible();
  await expect(car.first()).toBeHidden();
  await expect(rental.first()).toBeHidden();
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
  await f.locator('input[name="quantity"]').fill('7');
  await f.locator('select[name="type"]').selectOption('Makina');
  await expect(product.first()).toBeHidden();
  await expect(car.first()).toBeVisible();
  await f.locator('input[name="year"]').fill('2020');
  await f.locator('input[name="mileage"]').fill('0');
  await f.locator('select[name="type"]').selectOption('Banesa me qira');
  await expect(car.first()).toBeHidden();
  await expect(rental.first()).toBeVisible();
  await f.locator('input[name="area"]').fill('80');
  await f.locator('input[name="rooms"]').fill('2+1');
  await f.locator('select[name="period"]').selectOption('javë');
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang==='sq'?'it':'sq');
  await expect(rental.first()).toBeVisible();
  await expect(car.first()).toBeHidden();
  await f.locator('select[name="type"]').selectOption('Makina');
  await expect(f.locator('input[name="year"]')).toHaveValue('2020');
  await expect(f.locator('input[name="mileage"]')).toHaveValue('0');
  await f.locator('select[name="type"]').selectOption('Produkte');
  await expect(f.locator('input[name="quantity"]')).toHaveValue('7');
  await f.locator('select[name="type"]').selectOption('Banesa me qira');
  await expect(f.locator('input[name="area"]')).toHaveValue('80');
  await expect(f.locator('input[name="rooms"]')).toHaveValue('2+1');
  await expect(f.locator('select[name="period"]')).toHaveValue('javë');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(before);
 });
}

test('Shop Plus category-specific save and edit strip irrelevant metadata',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="create"]').click();
 const f=page.locator('#isp-create');
 await f.locator('input[name="name"]').fill('Mbyll vehicle listing');
 await f.locator('input[name="store"]').fill('Mbyll shop');
 await f.locator('input[name="price"]').fill('9000');
 await f.locator('select[name="type"]').selectOption('Banesa me qira');
 await f.locator('input[name="area"]').fill('78');
 await f.locator('input[name="rooms"]').fill('1+1');
 await f.locator('select[name="period"]').selectOption('javë');
 await f.locator('select[name="type"]').selectOption('Makina');
 await f.locator('input[name="year"]').fill('2020');
 await f.locator('input[name="mileage"]').fill('0');
 await f.locator('button[type="submit"]').click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
 expect(saved).toMatchObject({type:'Makina',year:2020,mileage:0,area:null,rooms:'',period:'muaj'});
 await page.locator('#isp-root [data-isp^="edit:"]').click();
 const edit=page.locator('#isp-create');
 await expect(edit.locator('[data-isp-category="Makina"]').first()).toBeVisible();
 await expect(edit.locator('[data-isp-category="Banesa me qira"]').first()).toBeHidden();
 await expect(edit.locator('input[name="mileage"]')).toHaveValue('0');
 await edit.locator('select[name="type"]').selectOption('Banesa me qira');
 await expect(edit.locator('[data-isp-category="Banesa me qira"]').first()).toBeVisible();
 await edit.locator('input[name="area"]').fill('88');
 await edit.locator('select[name="period"]').selectOption('javë');
 await edit.locator('button[type="submit"]').click();
 const revised=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
 expect(revised).toMatchObject({type:'Banesa me qira',year:null,mileage:null,area:88,period:'javë'});
});

test('visual regression: Plans intro and prototype note follow sq/en/it without losing focus',async({page})=>{
 await ready(page);
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 const root=page.locator('#ilp-root');
 const close=root.locator('header button[data-ilp="close"]');
 await expect(close).toBeFocused();
 for(const [lang,intro,foot] of [
  ['sq','Kalo midis organizatorit','PROTOTIP'],
  ['en','Switch between organizer and participant','PROTOTYPE'],
  ['it','Passa dal ruolo di organizzatore','PROTOTIPO']
 ]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(root.locator('.ilp-intro')).toContainText(intro);
  await expect(root.locator('.ilp-foot')).toContainText(foot);
  await expect(close).toBeFocused();
 }
 await close.click();
 await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
});

test('visual regression: Privacy city All caption localizes, canonical filter value and focus remain stable',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 const root=page.locator('#il4-root');
 await root.locator('[data-il4="tab:map"]').click();
 const city=root.locator('#il4-mapform select[name="city"]');
 await city.focus();
 for(const [lang,label] of [['sq','Të gjitha'],['en','All'],['it','Tutte']]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(city).toHaveValue('Të gjitha');
  await expect(city.locator('option').first()).toHaveText(label);
  await expect(root.locator('.il4-map-label')).toContainText('ILLYRIAN · DEMO · '+label);
  await expect(city).toBeFocused();
 }
 await root.locator('button[data-il4="close"]').click();
 await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
});


test('Privacy map pin ARIA localization preserves focus and user-origin names across sq/en/it',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 const root=page.locator('#il4-root');
 await root.locator('[data-il4="tab:map"]').click();
 const pin=root.locator('.il4-pin[data-il4="pin:m1"]');
 await expect(pin).toBeVisible();
 await pin.focus();
 for(const [lang,region,tabs,label] of [
  ['sq','Skemë orientuese e rezultateve','Fushat e Fazës 4','Shfaq Takim i komunitetit në Tiranë'],
  ['en','Illustrative results map','Phase 4 sections','Show Takim i komunitetit in Tiranë'],
  ['it','Mappa illustrativa dei risultati','Sezioni della fase 4','Mostra Takim i komunitetit a Tiranë']
 ]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(root.locator('.il4-map')).toHaveAttribute('aria-label',region);
  await expect(root.locator('nav.il4-tabs').first()).toHaveAttribute('aria-label',tabs);
  await expect(pin).toHaveAttribute('aria-label',label);
  await expect(pin).toBeFocused();
  await expect(pin).toHaveAttribute('data-il4','pin:m1');
 }
 await root.locator('button[data-il4="close"]').click();
 await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
});


// Audit A1-01: corrupted/legacy core storage must not crash, auto-erase,
// or hide an otherwise valid saved post. This remains browser-local DEMO state.
for(const [label,fixture] of [
 ['posts object',{posts:{unexpected:true}}],
 ['posts null with broken maps',{posts:null,likes:{oops:true},comments:'broken',messages:[],profile:'invalid'}],
 ['posts mixed entries',{posts:[null,42,{},'broken',{id:'ok',name:'Fixture',text:'Legitimate draft',city:'Tiranë'}],comments:{ok:[null,'Valid reply']}}],
 ['root non-object',['not','a','record']]
]){
 test('audit A1-01 corrupted core state recovers without deleting raw data - '+label,async({page})=>{
  await ready(page);
  const original=JSON.stringify(fixture);
  await page.evaluate(raw=>localStorage.setItem('illyrian_demo_v09_state',raw),original);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.reload({waitUntil:'load'});
  await expect(page.locator('#screen')).not.toBeEmpty();
  await expect(page.locator('#navbar')).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(original);
  if(label==='posts mixed entries'){
   await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
   await expect(page.locator('#screen')).toContainText('Legitimate draft');
  }
 });
}


async function denyCoreStorage(page){
 await page.evaluate(()=>{
  const old=Storage.prototype.setItem;
  window.__restoreCoreSetItem=()=>{Storage.prototype.setItem=old};
  Storage.prototype.setItem=function(k,v){
   if(k==='illyrian_demo_v09_state')throw new DOMException('Simulated quota','QuotaExceededError');
   return old.call(this,k,v);
  };
 });
}
async function restoreCoreStorage(page){
 await page.evaluate(()=>{window.__restoreCoreSetItem?.();delete window.__restoreCoreSetItem});
}
for(const [lang,error] of [
 ['sq','Ndryshimi nuk u ruajt në këtë pajisje. Provo përsëri.'],
 ['en','The change was not saved on this device. Try again.'],
 ['it','La modifica non è stata salvata su questo dispositivo. Riprova.']
]){
 test('audit A1-02 Settings quota rollback and retry - '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
  await page.locator('#screen [data-act="modal"][data-val="settings"]').click();
  await page.locator('#layer [data-act="v6-settings-section"][data-val="privacy"]').click();
  const check=page.locator('#layer [data-v6-pref="privateProfile"]');
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await expect(check).not.toBeChecked();
  await denyCoreStorage(page);
  // Click rather than Playwright check(): a failed save intentionally restores unchecked.
  await check.click();
  await expect(check).not.toBeChecked();
  await expect(page.locator('#toast-area')).toContainText(error);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
  await restoreCoreStorage(page);
  await check.check();
  await expect(check).toBeChecked();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).v6Prefs.privateProfile)).toBe(true);
 });

 test('audit A1-02 Profile quota preserves draft then retries - '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
  await page.locator('#screen [data-act="modal"][data-val="edit"]').click();
  const name=page.locator('#edit-name'),bio=page.locator('#edit-bio');
  await name.fill('Test Profile '+lang);
  await bio.fill('Unsent biography draft '+lang);
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await denyCoreStorage(page);
  await page.locator('#layer [data-act="edit-save"]').click();
  await expect(name).toHaveValue('Test Profile '+lang);
  await expect(bio).toHaveValue('Unsent biography draft '+lang);
  await expect(name).toBeFocused();
  await expect(page.locator('#toast-area')).toContainText(error);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
  await restoreCoreStorage(page);
  await page.locator('#layer [data-act="edit-save"]').click();
  const profile=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile);
  expect(profile).toMatchObject({name:'Test Profile '+lang,bio:'Unsent biography draft '+lang});
 });

 test('audit A1-02 Messages quota preserves text then retries once - '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();
  await page.locator('#v6-inbox-list [data-act="v6-openchat"][data-id="leon"]').click();
  const form=page.locator('#v6-chat-form'),input=form.locator('#v6-msg-input');
  await input.fill('Unsent hello '+lang);
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await denyCoreStorage(page);
  await form.locator('button[type="submit"]').click();
  await expect(input).toHaveValue('Unsent hello '+lang);
  await expect(input).toBeFocused();
  await expect(page.locator('#toast-area')).toContainText(error);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
  await restoreCoreStorage(page);
  await form.locator('button[type="submit"]').click();
  const messages=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).messages.leon);
  expect(messages.filter(x=>x==='Unsent hello '+lang)).toHaveLength(1);
 });
}


test('audit A1-03 rejects Plans stale writes across two browser tabs and permits retry after reload',async({browser})=>{
 const ctx=await browser.newContext(),first=await ctx.newPage(),second=await ctx.newPage();
 async function openDetail(page){
  await ready(page);
  await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('[data-ilp-entry]').first().click();
  await page.locator('#ilp-root [data-ilp="detail:demo-football"]').click();
 }
 await openDetail(first);await openDetail(second);
 await first.locator('#ilp-root [data-ilp="accept:arta"]').click();
 const afterFirst=await first.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
 expect(JSON.parse(afterFirst).requests.find(x=>x.id==='arta').status).toBe('accepted');
 await second.locator('#ilp-root [data-ilp="decline:leon"]').click();
 await expect(second.locator('#ilp-root .ilp-notice')).toContainText('changed in another tab');
 expect(await second.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(afterFirst);
 await openDetail(second);
 await second.locator('#ilp-root [data-ilp="decline:leon"]').click();
 const stored=await second.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_plans')));
 expect(stored.requests.find(x=>x.id==='arta').status).toBe('accepted');
 expect(stored.requests.find(x=>x.id==='leon').status).toBe('declined');
 await ctx.close();
});


test('audit A1-04 Connections preserves authored title and notes across sq/en/it',async({page})=>{
 await ready(page);
 await page.evaluate(()=>localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({
  events:[{id:'user-mbyll',title:'Mbyll',kind:'Sport',city:'Tiranë',place:'Mbyll',conditions:'Mbyll',date:'2027-10-23',time:'17:00',capacity:8,privacy:'public',cancelled:false}],
  requests:[],messages:[],attendance:[]
 })));
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilc-entry]').first().click();
 const root=page.locator('#ilc-root');
 for(const [view,selector] of [
  ['cities','.ilc-results strong[data-user-content]'],
  ['welcome','.ilc-first strong[data-user-content]'],
  ['repeat','.ilc-repeat strong[data-user-content]']
 ]){
  await root.locator('[data-ilc="view:'+view+'"]').click();
  for(const lang of ['sq','en','it']){
   await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
   await expect(root.locator(selector).filter({hasText:'Mbyll'})).toHaveText('Mbyll');
   if(view==='welcome'){
    await expect(root.locator('.ilc-first [data-user-content]').filter({hasText:'Mbyll'})).toHaveCount(3);
   }
  }
  await root.locator('[data-ilc="overview"]').first().click();
 }
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(before);
});

test('audit A1-06 map pin ARIA decodes special characters exactly once in all locales',async({page})=>{
 await ready(page);
 const title='A & "B" <C>';
 await page.evaluate(t=>localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({
  events:[{id:'special-pin',title:t,city:'Tiranë',kind:'Sport',date:'2027-10-23',time:'17:00',privacy:'public',cancelled:false}],
  requests:[],messages:[],attendance:[]
 })),title);
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 const root=page.locator('#il4-root');
 await root.locator('[data-il4="tab:map"]').click();
 const pin=root.locator('.il4-pin[data-il4="pin:plan-0"]');
 await expect(pin).toBeVisible();
 for(const [lang,label] of [
  ['sq','Shfaq A & "B" <C> në Tiranë'],
  ['en','Show A & "B" <C> in Tiranë'],
  ['it','Mostra A & "B" <C> a Tiranë']
 ]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(pin).toHaveAttribute('aria-label',label);
  await expect(root.locator('.il4-pin[data-il4="pin:plan-0"]')).toHaveCount(1);
 }
});


test('audit A1-05 Plans detail uses semantic labels for organizer and participant across sq/en/it',async({page})=>{
 await ready(page);
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 const root=page.locator('#ilp-root');
 await root.locator('[data-ilp="detail:demo-football"]').click();
 for(const lang of [
  {code:'sq',heading:'Aktivitetet dhe organizatori',active:'Aktiv',seats:'vende',manage:'Menaxho kërkesat',accept:'Prano',pending:'në pritje',chat:'Biseda e grupit — demo',empty:'Ende pa mesazhe.',participant:'Si pjesëmarrës',status:'Statusi yt: Pa kërkesë'},
  {code:'en',heading:'Activities and organizer',active:'Active',seats:'seats',manage:'Manage requests',accept:'Accept',pending:'pending',chat:'Group chat — demo',empty:'No messages yet.',participant:'As participant',status:'Your status: No request'},
  {code:'it',heading:'Attività e organizzatore',active:'Attivo',seats:'posti',manage:'Gestisci le richieste',accept:'Accetta',pending:'in attesa',chat:'Chat di gruppo — demo',empty:'Nessun messaggio.',participant:'Come partecipante',status:'Il tuo stato: Nessuna richiesta'}
 ]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang.code);
  await expect(root.locator('.ilp-panel header h2')).toHaveText(lang.heading);
  await expect(root.locator('.ilp-panel > .ilp-muted').first()).toContainText(lang.active);
  await expect(root.locator('.ilp-panel > p').filter({hasText:'3'}).first()).toContainText(lang.seats);
  await expect(root.locator('.ilp-panel h4').first()).toHaveText(lang.manage);
  await expect(root.locator('[data-ilp="accept:arta"]')).toHaveText(lang.accept);
  await expect(root.locator('.ilp-request').first()).toContainText(lang.pending);
  await expect(root.locator('.ilp-panel h4').last()).toHaveText(lang.chat);
  await expect(root.locator('.ilp-chat')).toContainText(lang.empty);
  await expect(root.locator('h3[data-user-content]')).toHaveText('Futboll dhe njohje të reja');
  await root.locator('[data-ilp="role:participant"]').click();
  await expect(root.locator('[data-ilp="role:participant"]')).toHaveText(lang.participant);
  await root.locator('[data-ilp="detail:demo-football"]').click();
  await expect(root.locator('.ilp-panel')).toContainText(lang.status);
  await root.locator('[data-ilp="role:organizer"]').click();
  await root.locator('[data-ilp="detail:demo-football"]').click();
 }
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(before);
});
