// Visual review evidence only — screenshots are not a visual-pass certificate.
// Local demo, fictional data, seven viewport sizes, six user-facing screens.
const {test,expect}=require('@playwright/test');
const sizes=[[320,568],[360,780],[390,844],[430,932],[844,390],[932,430],[1280,800]];
async function open(page,w,h) {
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
async function capture(page,w,h,label){
  await page.screenshot({
    path:'qa-results/visual/'+w+'x'+h+'-'+label+'.jpg',
    type:'jpeg',quality:78,animations:'disabled',caret:'hide',
    fullPage:false
  });
}
for(const [w,h] of sizes){
  test('Visual evidence, six screens - '+w+'x'+h,async({page})=>{
    await open(page,w,h);
    await capture(page,w,h,'01-home');
    await page.locator('[data-ilshop-open]').first().click();
    await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
    await capture(page,w,h,'02-shop');
    await page.keyboard.press('Escape');
    await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);

    await page.locator('.head [data-act="tab"][data-val="events"]').click();
    await expect(page.locator('[data-ilp-entry]').first()).toBeVisible();
    await capture(page,w,h,'03-events');
    await page.locator('[data-ilp-entry]').first().click();
    await expect(page.locator('#ilp-root')).toBeVisible();
    await capture(page,w,h,'04-plans');
    await page.locator('#ilp-root button[data-ilp="close"]').click();
    await expect(page.locator('#ilp-root')).toBeHidden();

    await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
    await capture(page,w,h,'05-profile');
    await page.locator('#navbar [data-act="open-reels"]').click();
    await expect(page.locator('#layer .v4-reel-overlay')).toBeVisible();
    await capture(page,w,h,'06-reels');
    await page.locator('#layer .v4-reel-overlay [data-act="reel-close"]').click();
    await expect(page.locator('#layer .v4-reel-overlay')).toHaveCount(0);
  });
}
