// Emulated mobile pointer/touch smoke on the WebKit engine, NOT physical
// Safari, iPhone, Android, or VoiceOver/TalkBack validation.
// This spec is selected ONLY by playwright.webkit.config.cjs (PR job).
const {test,expect}=require('@playwright/test');
test.use({isMobile:true,hasTouch:true,deviceScaleFactor:2});

async function enterDemo(page,width,height){
 await page.setViewportSize({width,height});
 await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
 await expect(page.locator('#phone')).toBeVisible();
 const guest=page.locator('#v7-auth.visible [data-v7="guest"]');
 if(await guest.isVisible()){
  await guest.tap();
  await page.locator('#v7-auth.visible [data-v7="skip-tour"]').tap();
 }
 await expect(page.locator('#v7-auth.visible')).toHaveCount(0);
 expect(await page.evaluate(()=>navigator.maxTouchPoints)).toBeGreaterThan(0);
}

for(const [width,height] of [[390,844],[844,390]]){
 test('Mobile touch emulation - Reels open and close - '+width+'x'+height,async({page})=>{
  await enterDemo(page,width,height);
  const opener=page.locator('#navbar [data-act="open-reels"]');
  await opener.tap();
  const overlay=page.locator('#layer .v4-reel-overlay');
  await expect(overlay).toBeVisible();
  await expect(page.locator('#screen')).toHaveJSProperty('inert',true);
  await overlay.locator('[data-act="reel-close"]').tap();
  await expect(overlay).toHaveCount(0);
  await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
  await expect(opener).toBeFocused();
 });
 test('Mobile touch emulation - Shop Plus needs and create controls - '+width+'x'+height,async({page})=>{
  await enterDemo(page,width,height);
  await page.locator('[data-ilshop-open]').first().tap();
  await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().tap();
  const root=page.locator('#isp-root');
  await expect(root.locator('[role="dialog"][aria-modal="true"]')).toBeVisible();
  await root.locator('[data-isp="tab:needs"]').tap();
  await expect(root.locator('#isp-need')).toBeVisible();
  await root.locator('[data-isp="tab:catalog"]').tap();
  await root.locator('[data-isp="create"]').tap();
  const form=root.locator('#isp-create');
  await expect(form).toBeVisible();
  await form.locator('select[name="type"]').selectOption('Makina');
  await expect(form.locator('[name="year"]')).toBeVisible();
  await expect(form.locator('[name="quantity"]')).toBeHidden();
  // Leave the fictional listing unsent; exit nested and parent overlays.
  await root.locator('header button[data-isp="close"]').tap();
  await expect(root).toHaveCount(0);
  await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
  await page.locator('#illyrian-shop-layer [data-ils="back"]').tap();
  await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);
  await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
 });
}
