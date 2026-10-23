// Direct Chromium keyboard navigation: no iframe, no synthetic key dispatch.
const {test,expect}=require('@playwright/test');
for(const [w,h] of [[390,844],[844,390],[1280,800]]){
  test('Plans real keyboard focus trap and Escape - '+w+'x'+h,async({page})=>{
    await page.setViewportSize({width:w,height:h});
    await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
    const guest=page.locator('#v7-auth.visible [data-v7="guest"]');
    if(await guest.isVisible()){
      await guest.click();
      await page.locator('#v7-auth.visible [data-v7="skip-tour"]').click();
    }
    await page.locator('.head [data-act="tab"][data-val="events"]').click();
    const opener=page.locator('[data-ilp-entry]').first();
    await opener.focus();
    await expect(opener).toBeFocused();
    await opener.click();
    const root=page.locator('#ilp-root');
    await expect(root).toBeVisible();
    const selector='button:not([disabled]):visible,input:not([disabled]):visible,select:not([disabled]):visible,textarea:not([disabled]):visible';
    const focusable=root.locator(selector);
    const first=focusable.first(),last=focusable.last();
    await expect(first).toBeFocused();
    await last.focus();
    await expect(last).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(first).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(last).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(root).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
  });
}


// Shop Plus has an independent modal stack and keyboard trap; test real key
// events in narrow portrait, landscape and desktop-sized preview.
for(const [width,height] of [[320,568],[390,844],[844,390],[1280,800]]){
 test('Shop Plus actual Tab wrapping and layered Escape - '+width+'x'+height,async({page})=>{
  await page.setViewportSize({width,height});
  await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
  const guest=page.locator('#v7-auth.visible [data-v7="guest"]');
  if(await guest.isVisible()){
   await guest.click();
   await page.locator('#v7-auth.visible [data-v7="skip-tour"]').click();
  }
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  const opener=page.locator('#illyrian-shop-layer [data-isp-open]').first();
  await opener.focus();
  await expect(opener).toBeFocused();
  await opener.click();
  const root=page.locator('#isp-root');
  await expect(root).toBeVisible();
  const dialog=root.locator('[role="dialog"][aria-modal="true"]');
  await expect(dialog).toHaveCount(1);
  await expect(page.locator('#screen')).toHaveJSProperty('inert',true);
  const focusable=root.locator('button:not([disabled]):visible,input:not([disabled]):visible,select:not([disabled]):visible,textarea:not([disabled]):visible');
  const first=focusable.first(),last=focusable.last();
  await expect(first).toBeFocused();
  await last.focus();
  await page.keyboard.press('Tab');
  await expect(first).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(last).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(root).toHaveCount(0);
  await expect(opener).toBeFocused();
  await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);
  await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
 });
}


// Screen review follow-up: actionable controls below the fold and outside the
// initial horizontal-nav viewport must remain reachable in narrow screens.
for(const [width,height] of [[320,568],[844,390]]){
 test('Shop Plus offscreen submit and Reports remain reachable - '+width+'x'+height,async({page})=>{
  await page.setViewportSize({width,height});
  await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
  const guest=page.locator('#v7-auth.visible [data-v7="guest"]');
  if(await guest.isVisible()){
   await guest.click();
   await page.locator('#v7-auth.visible [data-v7="skip-tour"]').click();
  }
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  const root=page.locator('#isp-root');
  await expect(root).toBeVisible();

  // Horizontal tabs should be accessible even when the final tab is clipped.
  const reportTab=root.locator('[data-isp="tab:moderation"]');
  await reportTab.scrollIntoViewIfNeeded();
  await expect(reportTab).toBeInViewport();
  await reportTab.click();
  await expect(root.locator('[data-isp="tab:moderation"]')).toHaveAttribute('aria-current','page');

  // Returning to the catalog allows navigating to the listing form.
  await root.locator('[data-isp="tab:catalog"]').click();
  await root.locator('[data-isp="create"]').click();
  const form=root.locator('#isp-create');
  await expect(form).toBeVisible();
  const submit=form.locator('button[type="submit"]');
  await submit.scrollIntoViewIfNeeded();
  await expect(submit).toBeInViewport();
  await submit.focus();
  await expect(submit).toBeFocused();
  const panel=root.locator('.isp-panel');
  expect(await panel.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(root).toHaveCount(0);
  await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
 });
}


// Shop Plus category-specific fields follow accessible keyboard order; fields
// from other categories stay in the DOM to preserve drafts but must not enter
// the tab sequence. Actual browser Tab events (no synthetic focus movement).
for(const [width,height] of [[320,568],[844,390]]){
 test('Shop Plus category-specific fields follow accessible keyboard order - '+width+'x'+height,async({page})=>{
  await page.setViewportSize({width,height});
  await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
  const guest=page.locator('#v7-auth.visible [data-v7="guest"]');
  if(await guest.isVisible()){
   await guest.click();
   await page.locator('#v7-auth.visible [data-v7="skip-tour"]').click();
  }
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  const root=page.locator('#isp-root');
  await root.locator('[data-isp="create"]').click();
  const form=root.locator('#isp-create');
  await expect(form).toBeVisible();
  const options=[
   {type:'Produkte',next:'quantity'},
   {type:'Makina',next:'year'},
   {type:'Banesa me qira',next:'area'},
   {type:'Shërbime',next:'details'}
  ];
  const specific=['quantity','year','mileage','area','rooms','period'];
  for(const {type,next} of options){
   await form.locator('select[name="type"]').selectOption(type);
   await expect(form.locator('[name="'+next+'"]')).toBeVisible();
   for(const name of specific.filter(n=>n!==next)){
    const visible=type==='Makina'&&name==='mileage'
      ||type==='Banesa me qira'&&(name==='rooms'||name==='period');
    if(!visible)await expect(form.locator('[name="'+name+'"]')).toBeHidden();
   }
   await form.locator('[name="price"]').focus();
   await expect(form.locator('[name="price"]')).toBeFocused();
   await page.keyboard.press('Tab');
   await expect(form.locator('[name="'+next+'"]')).toBeFocused();
  }
  // Opening and closing this modal must restore the underlying Shop layer.
  await page.keyboard.press('Escape');
  await expect(root).toHaveCount(0);
  await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
 });
}


// Non-Shop Plus modal actual keyboard trap across compact layouts.
// This guards module boundaries that have independent focus implementations:
// Connections, Privacy/Map and Governance. No data is published or persisted.
for(const [width,height] of [[320,568],[844,390]]){
 for(const config of [
  {name:'Connections',screen:'events',open:'[data-ilc-entry]',root:'#ilc-root',dialog:'.ilc-sheet',closed:'hidden'},
  {name:'Privacy/Map',screen:'explore',open:'#il4-entry [data-il4-entry]',root:'#il4-root',dialog:'.il4-panel',closed:'hidden'},
  {name:'Governance',screen:'explore',open:'#ig6-entry [data-ig6="open"]',root:'#ig6-root',dialog:'.ig6-panel',closed:'detached'}
 ]){
  test('Non-Shop Plus modal actual keyboard trap across compact layouts - '+config.name+' '+width+'x'+height,async({page})=>{
   await page.setViewportSize({width,height});
   await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
   const guest=page.locator('#v7-auth.visible [data-v7="guest"]');
   if(await guest.isVisible()){
    await guest.click();
    await page.locator('#v7-auth.visible [data-v7="skip-tour"]').click();
   }
   if(config.screen==='events')await page.locator('.head [data-act="tab"][data-val="events"]').click();
   else await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
   const opener=page.locator(config.open).first();
   await opener.focus();
   await expect(opener).toBeFocused();
   await opener.click();
   const root=page.locator(config.root);
   await expect(root).toBeVisible();
   await expect(root.locator(config.dialog)).toHaveAttribute('role','dialog');
   await expect(root.locator(config.dialog)).toHaveAttribute('aria-modal','true');
   await expect(page.locator('#screen')).toHaveJSProperty('inert',true);
   const controls=root.locator('button:not([disabled]):visible,input:not([disabled]):visible,select:not([disabled]):visible,textarea:not([disabled]):visible');
   const first=controls.first(),last=controls.last();
   await expect(first).toBeFocused();
   await last.focus();
   await expect(last).toBeFocused();
   await page.keyboard.press('Tab');
   await expect(first).toBeFocused();
   await page.keyboard.press('Shift+Tab');
   await expect(last).toBeFocused();
   await page.keyboard.press('Escape');
   if(config.closed==='detached')await expect(root).toHaveCount(0);
   else await expect(root).toBeHidden();
   await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
   await expect(opener).toBeFocused();
  });
 }
}


// Accessible modal names follow sq/en/it without re-rendering unsent state.
// Language is UI-only. Assert exact semantic catalog keys, focus, inert status,
// and module localStorage, not a phrase-adapter's incidental text replacement.
for(const config of [
 {name:'Connections',tab:'events',opener:'[data-ilc-entry]',dialog:'#ilc-root .ilc-sheet',key:'connections:activities',storage:'illyrian_demo_v17_connections'},
 {name:'Plans',tab:'events',opener:'[data-ilp-entry]',dialog:'#ilp-root .ilp-panel',key:'plans:title',storage:'illyrian_demo_v17_plans'},
 {name:'Governance',tab:'explore',opener:'#ig6-entry [data-ig6="open"]',dialog:'#ig6-root .ig6-panel',key:'governance:title',storage:'illyrian_demo_v17_governance'}
]){
 test('Accessible modal names follow sq/en/it without re-rendering unsent state - '+config.name,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
  const guest=page.locator('#v7-auth.visible [data-v7="guest"]');
  if(await guest.isVisible()){
   await guest.click();
   await page.locator('#v7-auth.visible [data-v7="skip-tour"]').click();
  }
  await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
  if(config.tab==='events')await page.locator('.head [data-act="tab"][data-val="events"]').click();
  else await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
  const opener=page.locator(config.opener).first();
  await opener.click();
  const dialog=page.locator(config.dialog);
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('role','dialog');
  await expect(dialog).toHaveAttribute('aria-modal','true');
  // Initial focus follows the close control; after language updates any
  // focusable control inside the dialog is valid, but background focus is not.
  await expect(dialog.locator('header button')).toBeFocused();
  const before=await page.evaluate(key=>localStorage.getItem(key),config.storage);
  for(const lang of ['sq','en','it','sq']){
   await page.evaluate(language=>window.IllyrianI18n.changeLanguage(language),lang);
   const label=await page.evaluate(key=>window.IllyrianI18n.t(key),config.key);
   await expect(dialog).toHaveAttribute('aria-label',label);
   if(config.name==='Plans'){
    const roleLabel=await page.evaluate(()=>window.IllyrianI18n.t('plans:role'));
    await expect(dialog.locator('nav').first()).toHaveAttribute('aria-label',roleLabel);
   }
   await expect(page.locator('#screen')).toHaveJSProperty('inert',true);
   // Focus repair is scheduled before the next paint, not during input events.
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>resolve())));
   const focus=await dialog.evaluate(node=>{
    const active=document.activeElement;
    return {inside:node.contains(active),tag:active?.tagName||'none',id:active?.id||'',action:active?.getAttribute('data-ilp')||''};
   });
   expect(focus.inside,config.name+' dialog focus must remain inside on '+lang+': '+JSON.stringify(focus)).toBe(true);
   expect(await page.evaluate(key=>localStorage.getItem(key),config.storage)).toBe(before);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
  await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
 });
}
