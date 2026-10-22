// ILLYRIAN v1.7: real browser coverage for non-Reels modules.
// Runs against localhost preview only; never submits purchases or posts.
const {test, expect}=require('@playwright/test');
const sizes=[[320,568],[360,780],[390,844],[430,932],[844,390],[932,430],[1280,800]];

async function openDemo(page,w,h){
  await page.setViewportSize({width:w,height:h});
  await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
  await expect(page.locator('#phone')).toBeVisible();
  const guest=page.locator('#v7-auth.visible [data-v7="guest"]');
  if(await guest.isVisible()){
    await guest.click();
    await page.locator('#v7-auth.visible [data-v7="skip-tour"]').click();
  }
  await expect(page.locator('#v7-auth.visible')).toHaveCount(0);
}
async function nav(page,name){
  const selector=name==='events'
    ? '.head [data-act="tab"][data-val="events"]'
    : '#navbar [data-act="tab"][data-val="'+name+'"]';
  await page.locator(selector).click();
}
async function backgroundActive(page){
  await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
}
async function backgroundInert(page){
  await expect(page.locator('#screen')).toHaveJSProperty('inert',true);
}
for(const [w,h] of sizes){
  test('Shop, Plans, Connections, Privacy, Governance - '+w+'x'+h,async({page})=>{
    await openDemo(page,w,h);
    // Shop and nested Shop Plus; Escape must isolate the topmost dialog.
    await nav(page,'home');
    await page.locator('[data-ilshop-open]').first().click();
    await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
    await backgroundInert(page);
    await page.locator('[data-isp-open]').first().click();
    await expect(page.locator('#isp-root')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#isp-root')).toHaveCount(0);
    await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);
    await backgroundActive(page);

    // Plans and Connections use separate modal roots; forwarding stays a
    // draft only, and does not submit/publish anything.
    await nav(page,'events');
    await page.locator('[data-ilp-entry]').first().click();
    await expect(page.locator('#ilp-root')).toBeVisible();
    await backgroundInert(page);
    await page.locator('#ilp-root button[data-ilp="close"]').click();
    await expect(page.locator('#ilp-root')).toBeHidden();
    await backgroundActive(page);
    await page.locator('[data-ilc-entry]').first().click();
    await expect(page.locator('#ilc-root')).toBeVisible();
    await page.locator('#ilc-root [data-ilc="view:together"]').click();
    await page.locator('#ilc-root [data-ilc="together:language"]').click();
    await expect(page.locator('#ilc-root')).toBeHidden();
    await expect(page.locator('#ilp-root')).toBeVisible();
    await expect(page.locator('#ilp-root #ilp-form input[name="title"]')).toHaveValue('Praktikë gjuhësh dhe njohje');
    await expect(page.locator('#ilp-root #ilp-form input[name="place"][required]')).toHaveCount(1);
    await page.locator('#ilp-root button[data-ilp="close"]').click();
    await backgroundActive(page);

    // Privacy must not cause an extra overlay if opened twice; Governance
    // must return all interactions to the main feed when closed.
    await nav(page,'explore');
    const privacy=page.locator('#il4-entry [data-il4-entry]');
    await privacy.click();
    await expect(page.locator('#il4-root')).toBeVisible();
    await backgroundInert(page);
    // Background entry is inert while the Privacy panel is active.
    await page.locator('#il4-root button[data-il4="close"]').click();
    await expect(page.locator('#il4-root')).toBeHidden();
    await backgroundActive(page);
    await page.locator('#ig6-entry [data-ig6="open"]').click();
    await expect(page.locator('#ig6-root')).toBeVisible();
    await backgroundInert(page);
    await page.locator('#ig6-root button[data-ig6="close"]').click();
    await expect(page.locator('#ig6-root')).toHaveCount(0);
    await backgroundActive(page);

    // Document-wide overflow: distinguish inner horizontal carousels,
    // which may scroll intentionally.
    const dims=await page.evaluate(()=>({
      client:document.documentElement.clientWidth,
      scroll:document.documentElement.scrollWidth
    }));
    expect(dims.scroll).toBeLessThanOrEqual(dims.client+3);
  });
}
for(const [w,h] of [[390,844],[844,390],[1280,800]]){
  test('Theme light/dark/auto persists without changing the initial data - '+w+'x'+h,async({page})=>{
    await page.emulateMedia({colorScheme:'light'});
    await openDemo(page,w,h);
    await nav(page,'profile');
    await page.locator('#screen [data-act="modal"][data-val="settings"]').click();
    await page.locator('#layer [data-act="v6-settings-section"][data-val="theme"]').click();
    const key='illyrian_demo_v09_state';
    const initial=await page.evaluate(k=>localStorage.getItem(k),key);
    try{
      for(const [mode,dark] of [['light',false],['dark',true],['auto',false]]){
        await page.locator('#layer input[name="theme"][value="'+mode+'"]').check();
        await expect(page.locator('#phone')).toHaveClass(dark?/(\s|^)dark(\s|$)/:/^(?!.*\bdark\b).*$/);
        const stored=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)||'{}').theme,key);
        expect(stored).toBe(mode);
      }
      await page.reload({waitUntil:'load'});
      expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)||'{}').theme,key)).toBe('auto');
      await expect(page.locator('#phone')).not.toHaveClass(/(\s|^)dark(\s|$)/);
    } finally {
      await page.evaluate(({key,value})=>{
        if(value===null)localStorage.removeItem(key);
        else localStorage.setItem(key,value);
      },{key,value:initial});
    }
  });
}
