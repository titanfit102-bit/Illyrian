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
