// Visual review evidence only — screenshots are not a visual-pass certificate.
// Local demo, fictional data, seven viewport sizes, nine user-facing states including Shop Plus.
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
  test('Visual evidence, nine states - '+w+'x'+h,async({page})=>{
    await open(page,w,h);
    await capture(page,w,h,'01-home');
    await page.locator('#navbar [data-val="explore"]').click();
    await page.locator('[data-ilshop-open]').first().click();
    await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
    await capture(page,w,h,'02-shop');
    // Shop Plus evidence: exact rendered overlay, buyer needs and seller form.
    await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
    const plus=page.locator('#isp-root [role="dialog"][aria-modal="true"]');
    await expect(plus).toBeVisible();
    await capture(page,w,h,'02a-shop-plus-catalog');
    await page.locator('#isp-root [data-isp="tab:needs"]').click();
    await expect(page.locator('#isp-need')).toBeVisible();
    await capture(page,w,h,'02b-shop-plus-needs');
    await page.locator('#isp-root [data-isp="tab:catalog"]').click();
    await page.locator('#isp-root [data-isp="create"]').click();
    await expect(page.locator('#isp-create')).toBeVisible();
    await capture(page,w,h,'02c-shop-plus-create');
    await page.keyboard.press('Escape');
    await expect(page.locator('#isp-root')).toHaveCount(0);
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


// Cross-locale visual evidence at representative portrait/landscape sizes.
// These images aid human language/overflow review; screenshots alone do not
// certify complete localization, physical devices, or screenreader behavior.
for(const [w,h] of [[390,844],[844,390]]){
 for(const lang of ['sq','en','it']){
  test('i18n visual evidence - '+lang+' '+w+'x'+h,async({page})=>{
   await open(page,w,h);
   await expect.poll(()=>page.evaluate(()=>Boolean(window.IllyrianI18n?.changeLanguage))).toBe(true);
   await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
   await expect(page.locator('html')).toHaveAttribute('lang',lang);
   const nav={sq:'Kryefaqja',en:'Home',it:'Home'};
   await expect(page.locator('#navbar [data-act="tab"][data-val="home"] .v12-nav-label').first()).toHaveText(nav[lang]);
   const prefix='i18n-'+lang+'-'+w+'x'+h+'-';
   const screenshot=async(label)=>page.screenshot({
    path:'qa-results/visual/'+prefix+label+'.jpg',
    type:'jpeg',quality:78,animations:'disabled',caret:'hide',fullPage:false
   });

   await page.locator('#navbar [data-val="explore"]').click();
    await page.locator('[data-ilshop-open]').first().click();
   await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
   const shopPlus=page.locator('#isp-root');
   await expect(shopPlus.locator('[role="dialog"][aria-modal="true"]')).toBeVisible();
   await screenshot('shop-plus-catalog');
   await shopPlus.locator('[data-isp="create"]').click();
   const form=shopPlus.locator('#isp-create');
   await expect(form).toBeVisible();
   await screenshot('shop-plus-form');
   await shopPlus.locator('header button[data-isp="close"]').click();
   await expect(shopPlus).toHaveCount(0);
   await page.locator('#illyrian-shop-layer [data-ils="back"]').click();

   await page.locator('.head [data-act="tab"][data-val="events"]').click();
   await page.locator('[data-ilp-entry]').first().click();
   const plans=page.locator('#ilp-root');
   await expect(plans).toBeVisible();
   await screenshot('plans-dialog');
   await plans.locator('button[data-ilp="close"]').click();

   await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
   await page.locator('#il4-entry [data-il4-entry]').click();
   const privacy=page.locator('#il4-root');
   await expect(privacy).toBeVisible();
   await screenshot('privacy-dialog');
   await privacy.locator('button[data-il4="close"]').click();
   await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
  });
 }
}
