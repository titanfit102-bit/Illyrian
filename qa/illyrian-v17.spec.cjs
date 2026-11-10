// ILLYRIAN v1.7 - self-contained browser regression tests.
// Run against localhost only. No credentials, posting, purchases or external writes.
// Existing manual QA is intentionally NOT replaced by these targeted smoke tests.
const { test, expect } = require('@playwright/test');

const sizes = [
  [320,568], [360,780], [390,844], [430,932],
  [844,390], [932,430], [1280,800],
];

async function openDemo(page, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto('/ILLYRIAN_DEMO_v1.7.html', { waitUntil: 'load' });
  await expect(page.locator('#phone')).toBeVisible();
  await expect(page.locator('#navbar [data-act="open-reels"]')).toBeAttached();

  // On a fresh browser, the local-only welcome and tour must be completed
  // by user-facing controls before testing app interactions.
  const guest = page.locator('#v7-auth.visible [data-v7="guest"]');
  if (await guest.isVisible()) {
    await guest.click();
    await page.locator('#v7-auth.visible [data-v7="skip-tour"]').click();
  }
  await expect(page.locator('#v7-auth.visible')).toHaveCount(0);
}

async function openReels(page) {
  await page.locator('#navbar [data-act="open-reels"]').click();
  const overlay=page.locator('#layer .v4-reel-overlay');
  await expect(overlay).toBeVisible();
  return overlay;
}

for (const [width,height] of sizes) {
  test('Reels X and Create action do not overlap - '+width+'x'+height, async ({page}) => {
    await openDemo(page,width,height);
    const overlay=await openReels(page);
    const close=overlay.locator('[data-act="reel-close"]');
    const create=overlay.locator('.v15-reel-create');
    await expect(close).toBeVisible();
    await expect(create).toBeVisible();
    const a=await close.boundingBox(), b=await create.boundingBox();
    expect(a).toBeTruthy();expect(b).toBeTruthy();
    expect(a.width).toBeGreaterThanOrEqual(43);
    expect(a.height).toBeGreaterThanOrEqual(43);
    const overlapW=Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x));
    const overlapH=Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
    expect(overlapW*overlapH,'Reels X overlaps Create Reel').toBe(0);
    // Real Playwright click: catches covered and offscreen targets.
    await close.click();
    await expect(page.locator('#layer .v4-reel-overlay')).toHaveCount(0);
  });
}

for (const [width,height] of [[844,390],[932,430]]) {
  test('Landscape fullscreen shell and reachable Messages close - '+width+'x'+height,async({page})=>{
    await openDemo(page,width,height);
    const geometry=await page.evaluate(()=>{
      const phone=document.getElementById('phone').getBoundingClientRect();
      const side=document.querySelector('.desktop>.side');
      return { side: getComputedStyle(side).display, phoneWidth:phone.width,
        phoneHeight:phone.height,innerWidth:innerWidth,innerHeight:innerHeight };
    });
    expect(geometry.side).toBe('none');
    expect(Math.abs(geometry.phoneWidth-geometry.innerWidth)).toBeLessThanOrEqual(4);
    expect(Math.abs(geometry.phoneHeight-geometry.innerHeight)).toBeLessThanOrEqual(4);
    await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();
    const modal=page.locator('#layer .modal');
    await expect(modal).toBeVisible();
    const close=modal.locator('.modalhead [data-act="close"]');
    await expect(close).toBeVisible();
    await modal.evaluate(el => { el.scrollTop=el.scrollHeight; });
    await expect(close).toBeInViewport();
    await close.click();
    await expect(page.locator('#layer .modal')).toHaveCount(0);
  });
}

test('Desktop keeps side panel and phone frame',async ({page})=>{
  await openDemo(page,1280,800);
  const geometry=await page.evaluate(()=>{
    const p=document.getElementById('phone').getBoundingClientRect();
    return {width:p.width,side:getComputedStyle(document.querySelector('.desktop>.side')).display};
  });
  expect(geometry.side).toBe('flex');
  expect(geometry.width).toBeGreaterThan(300);
  expect(geometry.width).toBeLessThan(430);
});


test('F05 branch-local Preview entrypoint resolves to DEMO v1.7 in Vercel config',async()=>{
 const fs=require('node:fs'),path=require('node:path');
 const cfg=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../demo/vercel.json'),'utf8'));
 const roots=cfg.rewrites?.filter(x=>x.source==='/')||[];
 expect(roots).toHaveLength(1);
 expect(roots[0].destination).toBe('/ILLYRIAN_DEMO_v1.7.html');
 expect(fs.existsSync(path.resolve(__dirname,'../demo/ILLYRIAN_DEMO_v1.7.html'))).toBe(true);
});


test('F06 staged integration PR workflow guard remains read-only and never path-skipped',async()=>{
 const fs=require('node:fs'),path=require('node:path');
 const yaml=fs.readFileSync(path.resolve(__dirname,'../.github/workflows/illyrian-v17-browser-qa.yml'),'utf8');
 // This is an explicit policy regression, not a YAML parser or a live PR check.
 const prBlock=yaml.match(/^  pull_request:\s*\n((?:^[ \t]{4,}.*\n|^\s*\n)*)/m);
 expect(prBlock,'pull_request event must be configured').toBeTruthy();
 expect(prBlock[1]).toMatch(/^    branches:\s*\n      - demo\/v1\.7-illyrian-shop\s*$/m);
 expect(prBlock[1]).not.toMatch(/^    paths(?:-ignore)?:/m);
 // An open feature PR already triggers Chromium + WebKit checks. Feature push
 // duplicates those Chromium minutes; integration-branch pushes remain covered.
 const pushBlock=yaml.match(/^  push:\s*\n((?:^[ \\t]{4,}.*\n|^\s*\n)*)/m);
 expect(pushBlock,'integration push QA must remain configured').toBeTruthy();
 expect(pushBlock[1]).toMatch(/^    branches:\s*\n      - demo\/v1\.7-illyrian-shop\s*$/m);
 expect(pushBlock[1]).not.toContain('feat/i18n-');
 expect(yaml).toMatch(/^permissions:\s*\n  contents: read\s*$/m);
 expect(yaml).toMatch(/^\s+persist-credentials: false\b/m);
 expect(yaml).toMatch(/^  workflow_dispatch:\s*$/m);
 expect(yaml).not.toMatch(/^  pull_request_target:\s*$/m);
});


// Required-check candidates must be distinct for PR and push even when
// both events produce checks for the same SHA. GitHub counts skipped as a
// successful conclusion, so a push-side skipped WebKit check must not have
// the same name as the actual PR WebKit job.
test('F06 PR status check names are unambiguous across events',async()=>{
 const fs=require('node:fs'),path=require('node:path');
 const yaml=fs.readFileSync(path.resolve(__dirname,'../.github/workflows/illyrian-v17-browser-qa.yml'),'utf8');
 const eventNameExpression='$'+'{{ github.event_name }}';
 for(const name of ['browser-smoke','webkit-smoke']){
  expect(yaml).toContain('  '+name+':\n    name: '+name+'-'+eventNameExpression);
 }
 expect(yaml).toMatch(/^  webkit-smoke:\s*\n(?:.*\n){0,4}    if: .*github\.event_name == 'pull_request'/m);
});


// Mobile precision: verify the actual DOM/geometry, not just screenshot capture.
// Desktop retains its simulated device status bars; mobile relies on OS chrome.
// Visual PNG/JPEG evidence is captured by the existing visual-review suite.
for(const [width,height] of [[320,568],[390,844],[844,390]]){
 test('Mobile feed/story/nav geometry and accessible five actions - '+width+'x'+height,async({page})=>{
  await openDemo(page,width,height);
  const nav=page.locator('#navbar .v12-tab');
  await expect(nav).toHaveCount(5);
  const ids=await nav.evaluateAll(items=>items.map(el=>el.dataset.act==='open-reels'?'reels':el.dataset.val));
  expect(ids).toEqual(['home','reels','inbox','explore','profile']);
  const rail=page.locator('#screen > .stories');
  await expect(rail).toBeVisible();
  expect(await rail.evaluate(el=>el===el.parentElement.firstElementChild)).toBe(true);
  const firstRing=rail.locator('.ring').first(),navBar=page.locator('#navbar');
  const ringSize=await firstRing.boundingBox();
  expect(ringSize.width).toBeGreaterThanOrEqual(55);
  expect(ringSize.width).toBeLessThanOrEqual(65);
  await expect(page.locator('#phone > .statusbar')).toBeHidden();
  await expect(page.locator('#phone > .homebar')).toBeHidden();
  const header=await page.locator('#phone > .head').boundingBox();
  const stories=await rail.boundingBox();
  expect(stories.y).toBeGreaterThanOrEqual(header.y+header.height-1);
  for(const btn of await nav.all()){
   const box=await btn.boundingBox();
   expect(box.width).toBeGreaterThanOrEqual(44);
   expect(box.height).toBeGreaterThanOrEqual(44);
   expect(await btn.getAttribute('aria-label')).toBeTruthy();
   await expect(btn.locator('.v12-nav-label')).toBeVisible();
  }
  const bottom=await navBar.boundingBox();
  expect(bottom.y+bottom.height).toBeLessThanOrEqual(height+1);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  expect(overflow).toBe(false);
  await nav.nth(2).click();
  await expect(page.locator('#layer')).toContainText(/Mesazhe|Messages|Messaggi/i);
  // The inbox is modal: dismiss it before exercising the next navigation tab.
  await page.keyboard.press('Escape');
  await page.locator('#navbar [data-val="explore"]').click();
  await expect(page.locator('#navbar [data-val="explore"]')).toHaveAttribute('aria-current','page');
  await page.locator('#navbar [data-val="home"]').click();
  await expect(page.locator('#screen > .stories')).toBeVisible();
 });
}
test('Desktop phone mockup preserves explicit demo chrome and visible nav labels',async({page})=>{
 await openDemo(page,1280,800);
 await expect(page.locator('#phone > .statusbar')).toBeVisible();
 await expect(page.locator('#phone > .homebar')).toBeVisible();
 await expect(page.locator('#navbar .v12-nav-label').first()).toBeVisible();
 await expect(page.locator('#screen > .stories')).toBeVisible();
});


// Home header order and options must be real, keyboard-accessible destinations.
// Exercise portrait, narrow viewport and landscape without navigating away from
// the established Discover and Events implementations.
for(const [width,height] of [[320,568],[390,844],[844,390]]){
 test('Home header centered brand Camera Calendar Opportunities Notifications - '+width+'x'+height,async({page})=>{
  await openDemo(page,width,height);
  const head=page.locator('#phone > .head');
  const buttons=head.locator(':scope > .top-actions > button:visible');
  const labels=await buttons.evaluateAll(items=>items.map(el=>el.getAttribute('aria-label')));
  const expected=await page.evaluate(()=>['home:openCamera','common:homeCalendar','common:homeOpportunities'].map(k=>window.IllyrianI18n.t(k)));
  expect(labels.slice(0,3)).toEqual(expected);
  // The existing i18n layer localizes Notifications on load.
  expect(labels[3]).toMatch(/^(Njoftime|Notifications|Notifiche)$/);
  expect(labels).toHaveLength(4);
  await expect(head.locator('.ily-create-trigger')).toBeHidden();
  await expect(page.locator('#screen > .stories .story-btn').first()).toBeVisible();
  const b=await buttons.all();
  for(const el of b){
   const box=await el.boundingBox();
   expect(box.width).toBeGreaterThanOrEqual(44);
   expect(box.height).toBeGreaterThanOrEqual(44);
  }
  const brandBox=await head.locator('.brand').boundingBox();
  const calendarBox=await b[1].boundingBox(),optionsBox=await b[2].boundingBox(),headBox=await head.boundingBox();
  expect(calendarBox.x+calendarBox.width).toBeLessThanOrEqual(brandBox.x+1);
  expect(brandBox.x+brandBox.width).toBeLessThanOrEqual(optionsBox.x+1);
  expect(Math.abs(brandBox.x+brandBox.width/2-(headBox.x+headBox.width/2))).toBeLessThanOrEqual(1);
  const toggle=head.locator('[data-ily-op-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  const panel=head.locator('#ily-opportunities-panel');
  await expect(panel).toBeVisible();
  await expect(panel.locator('button')).toHaveCount(7);
  expect(await panel.locator('button').evaluateAll(items=>items.map(x=>x.dataset.ilyOpCategory))).toEqual(['Biznese','Tregu','Punë','Shërbime','Interesi','Plane','Komunitete']);
  await expect(panel.locator('[data-ily-op-category="Biznese"]')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await panel.locator('[data-ily-op-category="Biznese"]').click();
  await expect(page.locator('#navbar [data-val="explore"]')).toHaveAttribute('aria-current','page');
  await expect(page.locator('#finder')).toBeFocused();
  await expect(page.locator('#screen [data-act="category"][data-val="Biznese"]')).toHaveClass(/active/);
  await expect(panel).toBeHidden();
  await expect(head.locator('.ily-create-trigger')).toBeVisible();
  await page.locator('#navbar [data-val="home"]').click();
  await expect(head.locator('.ily-create-trigger')).toBeHidden();
  await head.locator('[data-val="events"]').click();
  // Use the stable Events view selector; its title is localized at runtime.
  await expect(page.locator('#screen .v10-event-tabs')).toBeVisible();
  await expect(head.locator('.ily-create-trigger')).toBeVisible();
  await page.locator('#navbar [data-val="home"]').click();
  await head.locator('[data-val="notifications"]').click();
  await expect(page.locator('#layer')).toContainText(/Njoftim|Notification/i);
  await page.keyboard.press('Escape');
 });
}


// Closing a Home action menu before opening Notifications avoids leaving
// aria-expanded=true and a stale popover behind the modal (browser QA only).
test('Home opportunities dismiss when Notifications opens - 390x844',async({page})=>{
 await openDemo(page,390,844);
 const head=page.locator('#phone > .head');
 const toggle=head.locator('[data-ily-op-toggle]');
 const panel=head.locator('#ily-opportunities-panel');
 await toggle.click();
 await expect(panel).toBeVisible();
 await expect(toggle).toHaveAttribute('aria-expanded','true');
 await head.locator('[data-val="notifications"]').click();
 await expect(page.locator('#layer')).toContainText(/Njoftim|Notification/i);
 await expect(panel).toBeHidden();
 await expect(toggle).toHaveAttribute('aria-expanded','false');
 await page.keyboard.press('Escape');
 await expect(panel).toBeHidden();
 await expect(toggle).toHaveAttribute('aria-expanded','false');
});


// User-approved menu reuses the existing Shop and Explore; no second backend.
test('Home Opportunities links Tregu and Shërbime to Shop - 390x844',async({page})=>{
 await openDemo(page,390,844);
 const panel=page.locator('#ily-opportunities-panel');
 const toggle=page.locator('#phone > .head [data-ily-op-toggle]');
 await toggle.click();
 await panel.locator('[data-ily-op-category="Tregu"]').click();
 const shop=page.locator('#illyrian-shop-layer');
 await expect(shop).toBeVisible();
 await expect(shop.locator('[data-ils="category"][data-value="Të gjitha"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#phone > .head')).toHaveJSProperty('inert',true);
 await shop.locator('[data-ils="back"]').click();
 await expect(shop).toHaveCount(0);
 await expect(toggle).toBeFocused();
 await toggle.click();
 await panel.locator('[data-ily-op-category="Shërbime"]').click();
 await expect(shop).toBeVisible();
 await expect(shop.locator('[data-ils="category"][data-value="Shërbime"]')).toHaveAttribute('aria-pressed','true');
 await expect(shop.locator('#ils-search')).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(shop).toHaveCount(0);
});

test('Mundësi Shop-unavailable notices stay localized and do not claim success',async({page})=>{
 await openDemo(page,390,844);
 const toggle=page.locator('#phone > .head [data-ily-op-toggle]'),panel=page.locator('#ily-opportunities-panel');
 const original=await page.evaluate(()=>{const api=window.IllyrianShopUI;window.IllyrianShopUI=undefined;return !!api});
 expect(original).toBe(true);
 for(const [lang,label] of [
  ['sq','Tregu nuk u hap. Provo përsëri.'],
  ['en','Marketplace could not be opened. Try again.'],
  ['it','Impossibile aprire il mercato. Riprova.']
 ]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  for(const category of ['Tregu','Shërbime']){
   await toggle.click();
   await panel.locator('[data-ily-op-category="'+category+'"]').click();
   await expect(page.locator('#toast-area .toast')).toHaveText(label);
   await expect(panel).toBeHidden();
   await expect(toggle).toHaveAttribute('aria-expanded','false');
   await expect(toggle).toBeFocused();
   await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);
   expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
  }
 }
 await page.reload();
 await toggle.click();
 await panel.locator('[data-ily-op-category="Tregu"]').click();
 await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(toggle).toBeFocused();
});

test('Home header uses semantic sq en it labels - 390x844',async({page})=>{
 await openDemo(page,390,844);
 const head=page.locator('#phone > .head'),panel=head.locator('#ily-opportunities-panel');
 const keys=['homeBusinesses','homeMarketplace','homeJobs','homeServices','homeIntent','homePlans','homeCommunities'];
 for(const lang of ['sq','en','it']){
  await page.evaluate(code=>window.IllyrianI18n.changeLanguage(code),lang);
  const expected=await page.evaluate(keys=>({
   calendar:window.IllyrianI18n.t('common:homeCalendar'),
   opportunities:window.IllyrianI18n.t('common:homeOpportunities'),
   choices:keys.map(key=>window.IllyrianI18n.t('common:'+key))
  }),keys);
  await expect(head.locator('[data-val="events"]')).toHaveAttribute('aria-label',expected.calendar);
  await expect(head.locator('[data-ily-op-toggle]')).toHaveAttribute('aria-label',expected.opportunities);
  await head.locator('[data-ily-op-toggle]').click();
  expect(await panel.locator('button').allTextContents()).toEqual(expected.choices);
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
 }
});


for(const theme of ['light','dark'])test('Friend Reels live as compact Story previews and open the matching Reel - '+theme,async({page})=>{
 await page.emulateMedia({colorScheme:theme});
 await openDemo(page,390,844);
 const reelPreviews=page.locator('#screen > .stories .story-reel-preview');
 await expect(reelPreviews).toHaveCount(3);
 await expect(page.locator('#screen > .stories [data-act="story"]')).toHaveCount(4);
 await expect(page.locator('#screen > .v4-reels-head,#screen > .v4-reels-list')).toHaveCount(0);
 const indicator=reelPreviews.first().locator('.story-reel-indicator');
 await expect(indicator).toHaveCSS('color','rgb(255, 255, 255)');
 await expect(indicator).toHaveCSS('background-color','rgb(16, 21, 28)');
 await reelPreviews.nth(1).click();
 await expect(page.locator('#layer .v4-reel-overlay')).toBeVisible();
 await expect(page.locator('#layer .v4-reel-counter')).toHaveText('2 / 3');
 await page.locator('#layer [data-act="reel-close"]').click();
 await expect(page.locator('#layer .v4-reel-overlay')).toHaveCount(0);
 await page.locator('#navbar [data-act="open-reels"]').click();
 await expect(page.locator('#layer .v4-reel-overlay')).toBeVisible();
});

// Home quick links moved into Mundësi; reuse existing controls and persistence.
test('Home has one composer and no duplicate Shop, Jobs, Businesses, Reels rail or studio',async({page})=>{
 await openDemo(page,390,844);
 const home=page.locator('#screen');
 for(const selector of ['.intent-strip','.v10-plan-summary','.v3-shortcuts','.v3-note','.v15-studio','.v4-reels-head','.v4-reels-list','.ils-entry']){
  await expect(home.locator(selector)).toHaveCount(0);
 }
 await expect(home.locator(':scope > .stories + .compose')).toHaveCount(1);
 await expect(home.locator(':scope > .compose + .filters')).toHaveCount(1);
 await expect(home.locator('.stories .story-reel-preview')).toHaveCount(3);
 await expect(page.locator('#ily-opportunities-panel [data-ily-op-category]')).toHaveCount(7);
});
test('Mundësi opens Shop and Services directly; Businesses and Jobs retain Explore routes',async({page})=>{
 await openDemo(page,390,844);
 const toggle=page.locator('#phone > .head [data-ily-op-toggle]'),panel=page.locator('#ily-opportunities-panel');
 await toggle.click();
 await panel.locator('[data-ily-op-category="Tregu"]').click();
 await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
 await expect(page.locator('#screen > .ils-entry')).toHaveCount(0);
 await page.keyboard.press('Escape');
 await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);
 await toggle.click();
 await panel.locator('[data-ily-op-category="Shërbime"]').click();
 await expect(page.locator('#illyrian-shop-layer [data-ils="category"][data-value="Shërbime"]')).toHaveClass(/selected/);
 await page.keyboard.press('Escape');
 for(const category of ['Biznese','Punë']){
  await toggle.click();
  await panel.locator('[data-ily-op-category="'+category+'"]').click();
  await expect(page.locator('#screen [data-act="category"][data-val="'+category+'"]')).toHaveClass(/active/);
  await page.locator('#navbar [data-val="home"]').click();
 }
});
test('Mundësi routes intent, my activities, plans and communities via original screens - 390x844',async({page})=>{
 await openDemo(page,390,844);
 const toggle=page.locator('#phone > .head [data-ily-op-toggle]'),panel=page.locator('#ily-opportunities-panel');
 await toggle.click();
 await panel.locator('[data-ily-op-category="Interesi"]').click();
 await expect(panel).toBeHidden();
 await expect(page.locator('#layer #intent-choice')).toBeVisible();
 await expect(page.locator('#layer #intent-choice')).toBeFocused();
 await page.locator('#layer #intent-choice').selectOption({label:'Sport dhe aktivitete'});
 await page.locator('#layer [data-act="save-intent"]').click();
 await expect(page.locator('#layer #intent-choice')).toHaveCount(0);
 await toggle.click();
 await panel.locator('[data-ily-op-category="Interesi"]').click();
 await expect(page.locator('#layer #intent-choice')).toHaveValue('Sport dhe aktivitete');
 await page.locator('#layer [data-act="close"]').click();

 await toggle.click();
 await expect(panel.locator('[data-ily-op-category="Aktivitetet"]')).toHaveCount(0);
 const unifiedLabel=await page.evaluate(()=>window.IllyrianI18n.t('common:homePlans'));
 await expect(panel.locator('[data-ily-op-category="Plane"]')).toHaveText(unifiedLabel);
 await panel.locator('[data-ily-op-category="Plane"]').click();
 await expect(page.locator('#screen .v10-event-tabs button.selected')).toBeFocused();
 for(const view of ['all','mine','accepted']){
  const button=page.locator('#screen [data-act="v10-plans-view"][data-val="'+view+'"]');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed','true');
 }
 await page.locator('#navbar [data-val="home"]').click();

 await toggle.click();
 await panel.locator('[data-ily-op-category="Komunitete"]').click();
 await expect(page.locator('#screen [data-act="category"][data-val="Komunitete"]')).toHaveClass(/active/);
 await expect(page.locator('#finder')).toBeFocused();
 await expect(page.locator('#screen .directory-card')).not.toHaveCount(0);
});
test('Mundësi seven options stay reachable and localized in compact mobile viewport',async({page})=>{
 await openDemo(page,320,568);
 const panel=page.locator('#ily-opportunities-panel');
 for(const lang of ['sq','en','it']){
  await page.evaluate(code=>window.IllyrianI18n.changeLanguage(code),lang);
  await page.locator('#phone > .head [data-ily-op-toggle]').click();
  await expect(panel.locator('button')).toHaveCount(7);
  const report=await panel.evaluate(el=>{
   const style=getComputedStyle(el),r=el.getBoundingClientRect(),phone=document.getElementById('phone').getBoundingClientRect();
   return {scrollable:style.overflowY,within:r.bottom<=phone.bottom+1,buttons:[...el.querySelectorAll('button')].every(b=>b.offsetHeight>=44)};
  });
  expect(report.scrollable).toBe('auto');
  expect(report.within).toBe(true);
  expect(report.buttons).toBe(true);
  await panel.locator('[data-ily-op-category="Komunitete"]').scrollIntoViewIfNeeded();
  await expect(panel.locator('[data-ily-op-category="Komunitete"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
 }
});

for(const theme of ['light','dark'])test('Reference Home preserves all actions and three primary filters - '+theme,async({page})=>{
 await page.emulateMedia({colorScheme:theme});
 await openDemo(page,390,844);

 await expect(page.locator('#phone')).toHaveClass(/home-reference/);
 await expect(page.locator('.head .ily-header-avatar')).toHaveCount(0);
 await expect(page.locator('.head [data-ily-camera]')).toBeVisible();
 await expect(page.locator('#screen > .filters [data-act="feed"]:not([data-val="Më të rejat"])')).toHaveCount(3);
 await expect(page.locator('#screen > .compose .ily-compose-reel')).toBeVisible();
 for(const [locale,labels,cityLabel] of [['sq',['Për ty','Duke ndjekur','Afër teje'],'Qyteti manual'],['it',['Per te','Seguiti','Vicino a te'],'Scegli la città manualmente'],['en',['For you','Following','Near you'],'Choose city manually']]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await expect(page.locator('#screen > .filters .ily-feed-label:not(.sr-only)')).toHaveText(labels);
  await expect(page.locator('#screen > .compose .ily-compose-city')).toHaveAttribute('aria-label',cityLabel);
 }
 await page.locator('#screen > .compose .ily-compose-city').click();
 await expect(page.locator('#v9-near-city')).toBeVisible();
 for(const city of ['Milano','Romë','Tiranë','Prishtinë']){
  await page.locator('#v9-near-city').selectOption(city);
  await expect(page.locator('#screen > .compose + .filters')).toHaveCount(1);
  await expect(page.locator('#screen > .ils-entry')).toHaveCount(0);
 }
 await page.locator('#screen [data-act="feed"][data-val="Më të rejat"]').click();
 await expect(page.locator('#screen [data-val="Më të rejat"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('#navbar [data-val="profile"]').click();
 await expect(page.locator('#phone')).not.toHaveClass(/home-reference/);
 await expect(page.locator('.head [data-ily-camera]')).toBeHidden();
 await page.locator('#navbar [data-val="home"]').click();
 await expect(page.locator('#phone')).toHaveClass(/home-reference/);
 await page.locator('#screen > .filters [data-val="Për ty"]').click();
 await expect(page.locator('#toast-area .toast')).toHaveCount(0);
 await page.screenshot({animations:'disabled',path:'qa-results/visual/home-reference-'+theme+'.png'});
});

// Browser chooser events exercise wiring only, not a physical phone camera.
for(const [locale,label] of [['sq','Hap kamerën'],['en','Open camera'],['it','Apri la fotocamera']])test('Home camera chooser preserves draft without automatic publication - '+locale,async({page})=>{
 await openDemo(page,390,844);
 await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
 const camera=page.locator('.head [data-ily-camera]');
 await expect(camera).toHaveAttribute('aria-label',label);
 await page.locator('#screen .compose-prompt').click();
 await page.locator('#v5-text').fill('Camera draft '+locale);
 await page.keyboard.press('Escape');
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 const chooserPromise=page.waitForEvent('filechooser');await camera.click();const chooser=await chooserPromise;
 await expect(page.locator('#v5-file')).toHaveAttribute('capture','environment');
 await expect(page.locator('#v5-text')).toHaveValue('Camera draft '+locale);
 await chooser.setFiles([]);await page.locator('#v5-file').dispatchEvent('cancel');
 await expect(page.locator('#v5-file')).not.toHaveAttribute('capture');
 await expect(page.locator('#v5-text')).toHaveValue('Camera draft '+locale);
 await page.keyboard.press('Escape');
 const nextPromise=page.waitForEvent('filechooser');await camera.click();const next=await nextPromise;
 const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=20;c.getContext('2d').fillRect(0,0,20,20);return c.toDataURL('image/png').split(',')[1]});
 await next.setFiles({name:'camera-fixture.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});
 await expect(page.locator('.v5-compose-preview img')).toBeVisible();
 await expect(page.locator('#v5-text')).toHaveValue('Camera draft '+locale);
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await expect(page.locator('#v5-file')).not.toHaveAttribute('capture');
});

test('Feed omits redundant content/why footer and preserves post actions',async({page})=>{
 await openDemo(page,390,844);
 for(const lang of ['sq','en','it']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  for(const feed of ['Për ty','Të ndjekur','Afër teje','Më të rejat']){
   await page.locator('#screen > .filters [data-act="feed"][data-val="'+feed+'"]').click();
   await expect(page.locator('#screen .v10-why-line,#screen [data-act="v10-why"]')).toHaveCount(0);
  }
 }
 await page.locator('#screen > .filters [data-act="feed"][data-val="Për ty"]').click();
 await expect(page.locator('#screen .post').first()).toBeVisible();
 await expect(page.locator('#screen .post .post-bottom').first()).toBeVisible();
 await page.locator('#screen .post [data-act="postmore"]').first().click();
 await expect(page.locator('#layer [data-act="hide-post"]')).toBeVisible();
 await expect(page.locator('#layer [data-act="report-post"]')).toBeVisible();
});

test('Story im: no Story opens camera chooser, saved Story opens its viewer',async({page})=>{
 await openDemo(page,390,844);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 const mine=page.locator('#screen > .stories .story-btn').first();
 await expect(mine).toHaveAttribute('data-act','v15-my-story');
 await expect(mine).toHaveAttribute('aria-label','Hap kamerën');
 await expect(mine.locator('.story-plus')).toHaveCount(1);
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v15_creator'));
 const choosing=page.waitForEvent('filechooser');
 await mine.click();
 const chooser=await choosing;
 await expect(page.locator('#layer .v15-editor')).toBeVisible();
 await expect(page.locator('#v15-file')).toHaveAttribute('capture','environment');
 await chooser.setFiles([]);
 await page.locator('#v15-file').dispatchEvent('cancel');
 await expect(page.locator('#v15-file')).not.toHaveAttribute('capture');
 await expect(page.locator('#layer .v15-editor')).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v15_creator'))).toBe(before);
 const photo=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=30;c.getContext('2d').fillRect(0,0,30,30);return c.toDataURL('image/png').split(',')[1]});
 await page.locator('#v15-file').setInputFiles({name:'story-camera.png',mimeType:'image/png',buffer:Buffer.from(photo,'base64')});
 await expect.poll(()=>page.locator('#layer .v15-preview img').getAttribute('src')).toMatch(/^data:image\/jpeg;base64,/);
 await page.locator('[data-act="v15-publish"]').click();
 await expect(page.locator('#layer .v16-viewer')).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v15_creator')).stories[0].id);
 await page.keyboard.press('Escape');
 await expect(mine).toHaveAttribute('aria-label','Story im');
 await expect(mine.locator('.story-plus')).toHaveCount(0);
 await mine.click();
 await expect(page.locator('#layer .v16-viewer')).toBeVisible();
 expect(await page.evaluate(()=>document.querySelector('#layer .v16-viewer')?.getAttribute('data-v16-id')||JSON.parse(localStorage.getItem('illyrian_demo_v15_creator')).stories[0].id)).toBe(saved);
 await page.keyboard.press('Escape');
 await page.reload({waitUntil:'load'});
 await expect(mine).toHaveAttribute('aria-label','Story im');
 await mine.click();
 await expect(page.locator('#layer .v16-viewer')).toBeVisible();
});

test('Photorealistic seeded profiles use distinct bundled portraits across Stories, Reels and profile',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await openDemo(page,390,844);
 const expected=['owner','arta','leon','besa','dion'];
 const home=page.locator('#screen > .stories');
 for(let n=0;n<expected.length;n++){
  const src='./assets/profiles/'+expected[n]+'.webp';
  const img=home.locator('.story-btn').nth(n).locator('img').first();
  await expect(img).toHaveAttribute('src',src);
  await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
 }
 const previews=home.locator('.story-reel-preview');
 for(const [index,name] of ['arta','leon','besa'].entries()){
  const img=previews.nth(index).locator('img');
  await expect(img).toHaveAttribute('src','./assets/profiles/'+name+'.webp');
  await expect.poll(()=>img.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
 }
 const images=await page.evaluate(async names=>Promise.all(names.map(async name=>{
  const r=await fetch('./assets/profiles/'+name+'.webp');
  const blob=await r.blob();return {status:r.status,type:blob.type,size:blob.size};
 })),expected);
 for(const item of images){expect(item.status).toBe(200);expect(item.type).toContain('webp');expect(item.size).toBeGreaterThan(1000)}
 await previews.nth(2).click();
 await expect(page.locator('#layer .v4-reel-cover')).toHaveAttribute('src','./assets/profiles/besa.webp');
 await expect(page.locator('#layer .v4-reel-counter')).toHaveText('3 / 3');
 await page.locator('#layer [data-act="reel-close"]').click();
 await page.locator('#navbar [data-val="profile"]').click();
 await expect(page.locator('#screen .p17-avatar')).toHaveAttribute('src','./assets/profiles/owner.webp');
 await expect(page.locator('#screen .p17-avatar')).toBeVisible();
});

test('Person profile tabs retain keyboard focus and active state without writing core storage',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="explore"]').click();
 await page.locator('#screen [data-act="user-profile"][data-id="arta"]').first().click();
 const posts=page.locator('#layer [data-act="v11-person-tab"][data-val="posts"]');
 const about=page.locator('#layer [data-act="v11-person-tab"][data-val="about"]');
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await expect(posts).toHaveAttribute('aria-pressed','true');
 await expect(about).toHaveAttribute('aria-pressed','false');
 await about.focus();await page.keyboard.press('Enter');
 await expect(about).toBeFocused();await expect(about).toHaveAttribute('aria-pressed','true');
 await expect(posts).toHaveAttribute('aria-pressed','false');
 await posts.focus();await page.keyboard.press('Space');
 await expect(posts).toBeFocused();await expect(posts).toHaveAttribute('aria-pressed','true');
 await expect(about).toHaveAttribute('aria-pressed','false');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
});
test('Person follow keeps focus and correctly announces persisted on-off state',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="explore"]').click();
 await page.locator('#screen [data-act="user-profile"][data-id="arta"]').first().click();
 const follow=page.locator('#layer [data-act="v11-person-follow"][data-id="arta"]');
 await expect(follow).toHaveAttribute('aria-pressed','true');
 await follow.focus();await page.keyboard.press('Enter');
 await expect(follow).toBeFocused();await expect(follow).toHaveAttribute('aria-pressed','false');
 await page.keyboard.press('Enter');
 await expect(follow).toBeFocused();await expect(follow).toHaveAttribute('aria-pressed','true');
 await page.reload({waitUntil:'load'});
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).follows);
 expect(stored).toContain('arta');
});
test('Friend profile portraits, photo covers and biographies are consistent',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="explore"]').click();
 for(const name of ['arta','leon','besa','dion']){
  await page.locator('#screen [data-act="user-profile"][data-id="'+name+'"]').first().click();
  const detail=page.locator('#layer .v11-person-hero');
  await expect(detail).toBeVisible();
  const photo=detail.locator('.v11-person-avatar');
  await expect(photo).toHaveAttribute('src','./assets/profiles/'+name+'.webp');
  await expect.poll(()=>photo.evaluate(el=>el.complete&&el.naturalWidth>0)).toBe(true);
  await expect(detail.locator('.v11-person-cover')).toHaveCSS('background-image',/assets\/profiles\//);
  await expect(detail).not.toContainText(/demo|shembull/i);
  await page.locator('#layer [data-act="close"]').first().click();
 }
});

test('Custom owner photo or preset never changes another person portrait',async({page})=>{
 await openDemo(page,390,844);
 const newPortrait='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jQWQAAAAASUVORK5CYII=';
 await page.evaluate(data=>{
  const key='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(key)||'{}');
  s.v5AvatarChoice='a2';s.profile={...(s.profile||{}),photoData:data};
  localStorage.setItem(key,JSON.stringify(s));
 },newPortrait);
 await page.reload({waitUntil:'load'});
 await expect(page.locator('#screen > .stories .story-btn').first().locator('img')).toHaveAttribute('src',newPortrait);
 for(const [idx,name] of [[1,'arta'],[2,'leon'],[3,'besa'],[4,'dion']]){
  await expect(page.locator('#screen > .stories .story-btn').nth(idx).locator('img')).toHaveAttribute('src','./assets/profiles/'+name+'.webp');
 }
 await page.locator('#navbar [data-val="explore"]').click();
 await page.locator('#screen [data-act="user-profile"][data-id="arta"]').first().click();
 await expect(page.locator('#layer .v11-person-avatar')).toHaveAttribute('src','./assets/profiles/arta.webp');
 await expect(page.locator('#layer .v11-person-avatar')).not.toHaveAttribute('src',newPortrait);
});

for(const width of [320,390,430])test('Premium profile keeps five global nav destinations and adapts to '+width+'px',async({page})=>{
 await openDemo(page,width,844);
 const original=await page.locator('#navbar button').evaluateAll(items=>items.map(b=>[b.dataset.act,b.dataset.val||b.dataset.id||'']));
 await page.locator('#navbar [data-val="profile"]').click();
 const profile=page.locator('#screen > .p17-profile');
 await expect(profile).toBeVisible();
 await expect(profile.locator('.p17-cover')).toBeVisible();
 await expect(profile.locator('.p17-avatar')).toHaveAttribute('src','./assets/profiles/owner.webp');
 await expect(profile.locator('.p17-stats b')).toHaveCount(3);
 await expect(profile.locator('.p17-tabs [role="tab"]')).toHaveCount(5);
 await expect(profile).not.toContainText(/\bdemo\b/i);
 const actual=await page.locator('#navbar button').evaluateAll(items=>items.map(b=>[b.dataset.act,b.dataset.val||b.dataset.id||'']));
 expect(actual).toEqual(original);
 expect(await profile.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
 for(const name of ['posts','reels','saved','liked','opportunities']){
  await profile.locator('.p17-tabs [data-id="'+name+'"]').click();
  await expect(profile.locator('.p17-tabs [data-id="'+name+'"]')).toHaveAttribute('aria-selected','true');
 }
});

test('Premium profile edit persists name, username, city and interests after reload',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="profile"]').click();
 await page.locator('#screen .p17-edit').click();
 await page.locator('#edit-name').fill('Lira S.');
 await page.locator('#edit-bio').fill('Udhëtime, kafe dhe ide të reja.');
 await page.locator('#p17-handle').fill('lira.social');
 await page.locator('#p17-city').fill('Prishtinë');
 await page.locator('#p17-tags').fill('Udhëtime, Kafe, Art');
 await page.locator('#layer [data-p17-action="profile-save"]').click();
 await expect(page.locator('#screen .p17-person-name')).toContainText('Lira S.');
 await expect(page.locator('#screen .p17-location')).toContainText('@lira.social');
 await expect(page.locator('#screen .p17-location')).toContainText('Prishtinë');
 const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile);
 expect(data).toMatchObject({name:'Lira S.',p17Handle:'lira.social',p17City:'Prishtinë',p17Tags:['Udhëtime','Kafe','Art']});
 await page.reload({waitUntil:'load'});
 await expect(page.locator('#navbar [data-val="profile"]')).toBeVisible();
 await page.locator('#navbar [data-val="profile"]').click();
 await expect(page.locator('#screen .p17-bio')).toContainText('Udhëtime, kafe');
 await expect(page.locator('#screen .p17-tags span')).toHaveCount(3);
});

test('Premium profile validates cover photos and retains prior image after invalid upload',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="profile"]').click();
 const image=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=72;c.height=40;const ctx=c.getContext('2d');ctx.fillStyle='#ea5b7d';ctx.fillRect(0,0,72,40);return c.toDataURL('image/png').split(',')[1]});
 await page.locator('#p17-cover-file').setInputFiles({name:'cover.png',mimeType:'image/png',buffer:Buffer.from(image,'base64')});
 await page.locator('[data-p17-action="photo-save"]').click();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile.p17Cover?.startsWith('data:image/jpeg;base64,'))).toBe(true);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile.p17Cover);
 await expect(page.locator('#screen .p17-cover')).toHaveAttribute('style',/data:image\/jpeg;base64/);
 await page.locator('#p17-cover-file').setInputFiles({name:'invalid.png',mimeType:'image/png',buffer:Buffer.from('not a photograph')});
 await expect(page.locator('#toast-area')).toContainText(/JPG|JPEG|fotografi|foto|WebP/i);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile.p17Cover)).toBe(saved);
});

test('Premium Highlights create, view, edit and persist a Story snapshot',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v15_creator',JSON.stringify({stories:[{id:'my-highlight-source',caption:'Shëtitje në qytet',sample:'arta',created:1730000000000}],reels:[]})));
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="profile"]').click();
 await page.locator('#screen [data-p17-action="highlight-editor"]').click();
 await page.locator('#p17-title').fill('Udhëtime');
 await page.locator('#p17-source').selectOption('my-highlight-source');
 await page.locator('#layer [data-p17-action="highlight-save"]').click();
 await expect(page.locator('#screen [data-p17-action="highlight-view"]')).toContainText('Udhëtime');
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile.p17Highlights);
 expect(before).toHaveLength(1);expect(before[0].items).toHaveLength(1);
 await page.locator('#screen [data-p17-action="highlight-view"]').click();
 await expect(page.locator('#layer .v16-media')).toBeVisible();
 await page.locator('#layer [data-p17-action="highlight-editor"]').click();
 await page.locator('#p17-title').fill('Tirana');
 await page.locator('#layer [data-p17-action="highlight-save"]').click();
 await expect(page.locator('#screen [data-p17-action="highlight-view"]')).toContainText('Tirana');
 await page.reload({waitUntil:'load'});
 await page.locator('#navbar [data-val="profile"]').click();
 await expect(page.locator('#screen [data-p17-action="highlight-view"]')).toContainText('Tirana');
});

test('Premium saved and liked tabs show only matching content, and owner posts open existing actions',async({page})=>{
 await page.addInitScript(()=>{
  const key='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(key)||'{}');
  s.posts=[{id:'my-premium',name:'Profili yt',ava:'a1',city:'Tiranë',when:'Tani',text:'Postimi im me fotografi',img:'arta',likes:0,comments:0,share:0,verified:false}];
  s.likes=['my-premium'];s.bookmarks=['my-premium'];
  localStorage.setItem(key,JSON.stringify(s));
 });
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="profile"]').click();
 const panel=page.locator('#screen .p17-profile');
 for(const id of ['posts','saved','liked']){
  await panel.locator('[data-p17-action="section"][data-id="'+id+'"]').click();
  await expect(panel.locator('.p17-tile')).toHaveCount(1);
 }
 await panel.locator('[data-p17-action="section"][data-id="posts"]').click();
 await panel.locator('[data-p17-action="open-media"]').click();
 await expect(page.locator('#layer .post')).toContainText('Postimi im me fotografi');
 await expect(page.locator('#layer [data-act="postmore"]')).toBeVisible();
 await expect(page.locator('#layer [data-act="save"]')).toBeVisible();
});

test('Premium profile blocks invalid usernames without overwriting saved data',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="profile"]').click();
 await page.locator('#screen .p17-edit').click();
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await page.locator('#p17-handle').fill('<script>alert(1)</script>');
 await page.locator('#layer [data-p17-action="profile-save"]').click();
 await expect(page.locator('#p17-handle')).toBeFocused();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await expect(page.locator('#layer #edit-name')).toBeVisible();
});

test('Profile language switch while editing preserves unsaved input and camera choice',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="profile"]').click();
 await page.locator('#screen .p17-edit').click();
 await page.locator('#edit-name').fill('Lira Draft');
 await page.locator('#edit-bio').fill('My own words stay intact');
 await page.locator('#p17-city').fill('Elbasan draft');
 await page.locator('#p17-tags').fill('Ruaj, DEMO Studio');
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(page.locator('#edit-name')).toHaveValue('Lira Draft');
 await expect(page.locator('#edit-bio')).toHaveValue('My own words stay intact');
 await expect(page.locator('#p17-city')).toHaveValue('Elbasan draft');
 await expect(page.locator('#p17-tags')).toHaveValue('Ruaj, DEMO Studio');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await page.locator('#layer [data-p17-action="profile-save"]').click();
 await expect(page.locator('#screen .p17-person-name')).toContainText('Lira Draft');
 await expect(page.locator('#screen .p17-tags span')).toHaveText(['Ruaj','DEMO Studio']);
 await expect(page.locator('#screen .p17-location')).toContainText('Elbasan draft');
});

for(const [width,height] of [[320,568],[360,780],[390,844],[430,932],[844,390],[932,430],[1280,800]])for(const theme of ['light','dark'])test('Profile phase 1 layout, keyboard and navigation '+width+'x'+height+' '+theme,async({page})=>{
 await page.emulateMedia({colorScheme:theme,reducedMotion:'reduce'});
 await openDemo(page,width,height);
 await page.locator('#navbar [data-val="profile"]').click();
 const nav=await page.locator('#navbar').evaluate(el=>({html:el.innerHTML,rect:JSON.stringify(el.getBoundingClientRect())}));
 const profile=page.locator('#screen > .p17-profile');
 const dataBefore=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 for(const lang of ['sq','en','it']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(profile).toBeVisible();
  expect(await profile.locator('.p17-cover').evaluate(el=>el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(110);
  for(const selector of ['.p17-cover-change','.p17-avatar-camera','.p17-edit','#phone > .head [data-ily-profile-settings]','.p17-person-name [data-ily-identity-badge]']){
   const r=await (selector.startsWith("#phone")?page.locator(selector):profile.locator(selector)).boundingBox();expect(r.width).toBeGreaterThanOrEqual(44);expect(r.height).toBeGreaterThanOrEqual(44);
  }
  const geometry=await profile.evaluate(el=>({left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,children:[...el.querySelectorAll('.p17-person-top,.p17-identity,.p17-tabs')].map(x=>({left:x.getBoundingClientRect().left,right:x.getBoundingClientRect().right,overflow:x.scrollWidth>x.clientWidth+1}))}));
  for(const child of geometry.children){expect(child.left).toBeGreaterThanOrEqual(geometry.left);expect(child.right).toBeLessThanOrEqual(geometry.right+1);expect(child.overflow).toBe(false)}
 }
 const posts=profile.locator('[role="tab"][data-id="posts"]');await posts.focus();await page.keyboard.press('ArrowRight');
 await expect(profile.locator('[role="tab"][data-id="reels"]')).toBeFocused();
 await expect(profile.locator('[role="tab"][data-id="reels"]')).toHaveAttribute('aria-selected','true');
 await page.keyboard.press('Home');await expect(posts).toBeFocused();
 const panel=profile.locator('[role="tabpanel"]');await expect(panel).toHaveAttribute('aria-labelledby',await posts.getAttribute('id'));
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(dataBefore);
 expect(await page.locator('#navbar').evaluate(el=>JSON.stringify(el.getBoundingClientRect()))).toBe(nav.rect);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.screenshot({animations:'disabled',path:'qa-results/visual/profile-phase1-'+width+'x'+height+'-'+theme+'.png'});
});

test('Avatar change preserves unsaved premium profile fields',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="profile"]').click();
 await page.locator('#screen .p17-edit').click();
 await page.locator('#edit-name').fill('Test Avatar');
 await page.locator('#p17-handle').fill('test.avatar');
 await page.locator('#p17-city').fill('Elbasan');
 await page.locator('#p17-tags').fill('Muzikë, Sport');
 const raw=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=40;const x=c.getContext('2d');x.fillStyle='blue';x.fillRect(0,0,40,40);return c.toDataURL('image/png').split(',')[1]});
 await page.locator('#v12-photo-file').setInputFiles({name:'portrait.png',mimeType:'image/png',buffer:Buffer.from(raw,'base64')});
 await page.locator('[data-p17-action="photo-save"]').click();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile.photoData?.startsWith('data:image/jpeg;base64,'))).toBe(true);
 await expect(page.locator('#edit-name')).toHaveValue('Test Avatar');
 await expect(page.locator('#p17-handle')).toHaveValue('test.avatar');
 await expect(page.locator('#p17-city')).toHaveValue('Elbasan');
 await expect(page.locator('#p17-tags')).toHaveValue('Muzikë, Sport');
 await page.locator('#layer [data-p17-action="profile-save"]').click();
 const profile=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile);
 expect(profile).toMatchObject({name:'Test Avatar',p17City:'Elbasan',p17Handle:'test.avatar'});
 expect(profile.photoData).toMatch(/^data:image\/jpeg;base64,/);
});

test('Saved Reels remain accessible from premium Saved tab after profile redesign',async({page})=>{
 await page.addInitScript(()=>{
  const key='illyrian_demo_v09_state',state=JSON.parse(localStorage.getItem(key)||'{}');
  state.reelSaved=['r2'];localStorage.setItem(key,JSON.stringify(state));
 });
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="profile"]').click();
 await page.locator('#screen .p17-tabs [data-id="saved"]').click();
 const reel=page.locator('#screen .p17-tile[data-kind="friendReel"]');
 await expect(reel).toHaveCount(1);
 await reel.click();
 await expect(page.locator('#layer .v4-reel-overlay')).toBeVisible();
 await expect(page.locator('#layer .v4-reel-counter')).toHaveText('2 / 3');
});

test('Profile photo examples fill an empty profile without writing personal data',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="profile"]').click();
 const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await expect(page.locator('.p17-cover')).toHaveAttribute('style',/sample-cover.webp/);
 await expect(page.locator('.p17-gallery .p17-tile[data-kind="sample"]')).toHaveCount(6);
 await expect(page.locator('.p17-sample-highlight')).toHaveCount(6);
 for(const lang of ['sq','en','it']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  for(const image of await page.locator('.p17-gallery img,.p17-highlights img').all())await expect.poll(()=>image.evaluate(x=>x.complete&&x.naturalWidth>0)).toBe(true);
 }
 await page.locator('.p17-gallery .p17-tile').first().click();
 await expect(page.locator('#layer .p17-viewer-photo')).toHaveAttribute('src',/owner.webp/);
 await page.keyboard.press('Escape');
 await page.locator('.p17-sample-highlight[data-id="coffee"]').click();
 await expect(page.locator('#layer .p17-viewer-photo')).toHaveAttribute('src',/sample-coffee.webp/);
 await page.keyboard.press('Escape');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('.p17-profile').screenshot({path:'qa-results/visual/profile-filled-photos.png'});
});

for(const mode of ['light','dark'])test('Reference profile positions actions beside identity and renders compact photo layout '+mode,async({page})=>{
 await page.emulateMedia({colorScheme:mode,reducedMotion:'reduce'});await openDemo(page,390,844);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-val="profile"]').click();
 await expect(page.locator('.p17-person-name')).toContainText('Arta K.');
 const name=await page.locator('.p17-person-name').boundingBox(),actions=await page.locator('.p17-actions').boundingBox();
 expect(Math.abs(name.y-actions.y)).toBeLessThan(5);expect(actions.x).toBeGreaterThan(name.x+name.width-1);
 const cover=await page.locator('.p17-cover').boundingBox();expect(cover.height).toBeLessThan(125);
 await expect(page.locator('.p17-gallery')).toHaveCSS('grid-template-columns',/px.*px.*px/);
 if(mode==='dark')await expect(page.locator('.p17-profile')).toHaveCSS('background-color','rgb(7, 9, 11)');
 await page.locator('#screen').evaluate(x=>x.scrollTop=0);
 await page.screenshot({path:'qa-results/visual/profile-reference-'+mode+'.png',animations:'disabled'});
});

for(const [lang,label] of [['sq','Cilësimet'],['en','Settings'],['it','Impostazioni']])test('Profile header moves Settings and retains Home notifications '+lang,async({page})=>{
 await openDemo(page,390,844);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
 const notices=page.locator('#phone > .head [data-val="notifications"]');
 await expect(notices).toBeVisible();
 const state=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await page.locator('#navbar [data-val="profile"]').click();
 const gear=page.locator('#phone > .head [data-ily-profile-settings]');
 await expect(gear).toBeVisible();await expect(gear).toHaveAttribute('aria-label',label);await expect(notices).toBeHidden();
 await expect(page.locator('#screen .p17-settings,#screen [data-val="settings"]')).toHaveCount(0);
 await gear.click();await expect(page.locator('#layer .modal')).toBeVisible();
 await page.keyboard.press('Escape');await expect(gear).toBeFocused();
 await page.locator('#navbar [data-val="home"]').click();await expect(notices).toBeVisible();await expect(gear).toHaveCount(0);
 await notices.click();await expect(page.locator('#layer .modal')).toBeVisible();await page.keyboard.press('Escape');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(state);
});

for(const lang of ['sq','en','it'])test('Profile omits management and privacy blocks while Explore retains their panels '+lang,async({page})=>{
 await openDemo(page,390,844);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await page.locator('#navbar [data-val="profile"]').click();
 await expect(page.locator('#screen .p17-profile')).toBeVisible();
 await expect(page.locator('#screen #ig6-entry,#screen #il4-entry')).toHaveCount(0);
 await page.locator('#navbar [data-val="explore"]').click();
 await page.locator('#ig6-entry [data-ig6="open"]').click();await expect(page.locator('#ig6-root')).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('#il4-entry [data-il4-entry]').click();await expect(page.locator('#il4-root')).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('#navbar [data-val="profile"]').click();await expect(page.locator('#screen #ig6-entry,#screen #il4-entry')).toHaveCount(0);
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
});

for(const [lang,support,reports,appeals] of [
 ['sq','Ndihma dhe mbështetja','Raportimet e mia','Apelimet e mia'],
 ['en','Help and support','My reports','My appeals'],
 ['it','Aiuto e assistenza','Le mie segnalazioni','I miei ricorsi']
])for(const mode of ['light','dark'])test('Profile Settings routes to existing reports and appeals '+lang+' '+mode,async({page})=>{
 await page.emulateMedia({colorScheme:mode});await openDemo(page,320,568);
 await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
 const before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
 await page.locator('#navbar [data-val="profile"]').click();
 const gear=page.locator('[data-ily-profile-settings]');await gear.click();
 // Existing privacy preferences stay at the same Settings destination.
 await page.locator('#layer [data-val="privacy"]').click();
 await expect(page.locator('#layer [data-v6-pref="privateProfile"]')).toBeVisible();
 await page.locator('#layer [data-act="v6-settings-home"]').click();
 const entry=page.locator('#layer [data-val="support"]');await expect(entry).toContainText(support);await entry.click();
 for(const [tab,label] of [['reports',reports],['appeals',appeals]]){
  const opener=page.locator('#layer [data-ily-support-tab="'+tab+'"]');await expect(opener).toHaveText(label+'›');await opener.click();
  await expect(page.locator('#ig6-root [data-ig6="tab:'+tab+'"]').first()).toHaveAttribute('aria-current','page');
  await expect(page.locator('#layer')).toHaveJSProperty('inert',true);
  const controls=page.locator('#ig6-root button:visible');await controls.last().focus();await page.keyboard.press('Tab');await expect(controls.first()).toBeFocused();
  await page.keyboard.press('Escape');await expect(page.locator('#ig6-root')).toHaveCount(0);await expect(opener).toBeFocused();
  await expect(page.locator('#layer .modal')).toBeVisible();await expect(page.locator('#layer')).toHaveJSProperty('inert',false);
 }
 const nextLang=lang==='sq'?'en':'sq';await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),nextLang);
 await expect(page.locator('#layer [data-ily-support-tab="reports"]')).toContainText(nextLang==='sq'?'Raportimet e mia':'My reports');
 await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
 await page.keyboard.press('Escape');await expect(gear).toBeFocused();
 await expect(page.locator('#screen #ig6-entry,#screen #il4-entry')).toHaveCount(0);
 expect(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)))).toEqual(before);
});

for(const lang of ['sq','en','it'])test('Profile Opportunities shows only owned Shop listings and opens the original catalog '+lang,async({page})=>{
 await openDemo(page,390,844);
 await page.evaluate(()=>localStorage.setItem('illyrian_demo_v17_shop',JSON.stringify({listings:[
  {id:'own-profile-link',name:'My <b>offer</b>',kind:'Produkte',store:'My store',city:'Tiranë',price:5,owned:true},
  {id:'other-profile-link',name:'Another owner offer',kind:'Produkte',store:'Another store',city:'Tiranë',price:8}
 ]})));
 await page.reload();await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
 const before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
 await page.locator('#navbar [data-val="profile"]').click();await page.locator('#p17-tab-opportunities').click();
 const link=page.locator('[data-p17-action="open-listing"]');await expect(link).toHaveCount(1);await expect(link).toContainText('My <b>offer</b>');await expect(link.locator('strong b')).toHaveCount(0);
 await link.click();await expect(page.locator('#illyrian-shop-layer [data-ils="edit"]')).toBeVisible();
 await page.keyboard.press('Escape');await expect(link).toBeFocused();
 expect(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)))).toEqual(before);
 await page.evaluate(()=>localStorage.setItem('illyrian_demo_v17_shop',JSON.stringify({listings:[]})));
 await link.click();await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);await expect(page.locator('#toast-area')).toContainText(/Përmbajtja nuk gjendet|Content not found|Contenuto non trovato/);
 await page.reload();
 await page.locator('#navbar [data-val="profile"]').click();await page.locator('#p17-tab-opportunities').click();
 await expect(page.locator('[data-p17-action="open-listing"]')).toHaveCount(0);
});

test('Profile completion: following opens stored people and communities open from Settings',async({page})=>{
 await page.addInitScript(()=>{const k='illyrian_demo_v09_state';if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify({follows:['arta','leon'],blocked:['leon'],joinedCommunities:['c4']}))});
 await openDemo(page,390,844);await page.locator('#navbar [data-val="profile"]').click();
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await expect(page.locator('[data-p17-action="following"]')).toHaveCount(1);
 await page.locator('[data-p17-action="following"]').click();await expect(page.locator('[data-p17-action="network-person"]')).toHaveCount(1);
 await page.locator('[data-p17-action="network-person"]').click();await expect(page.locator('#layer .v11-person-hero')).toContainText('Arta');
 await page.keyboard.press('Escape');await page.locator('[data-ily-profile-settings]').click();await page.locator('#layer [data-val="communities"]').click();
 await expect(page.locator('#layer [data-act="v11-community-open"][data-id="c4"]')).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
});

test('Profile completion: Plans created locally open from Opportunities without copying records',async({page})=>{
 await page.addInitScript(()=>{const k='illyrian_demo_v17_plans';if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify({events:[{id:'personal-plan',title:'My personal plan',date:'2099-05-20',time:'17:00',city:'Tiranë',kind:'Sport',capacity:8,privacy:'private',place:'Park',price:0}],requests:[],messages:[],attendance:[]}))});
 await openDemo(page,390,844);await page.locator('#navbar [data-val="profile"]').click();await page.locator('#p17-tab-opportunities').click();
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
 await expect(page.locator('[data-p17-action="open-plan"]')).toHaveCount(1);await page.locator('[data-p17-action="open-plan"]').click();await expect(page.locator('#ilp-root')).toContainText('My personal plan');
 await page.keyboard.press('Escape');await expect(page.locator('[data-p17-action="open-plan"]')).toBeFocused();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(before);
 await page.locator('[data-p17-action="open-plan"]').click();await page.locator('#ilp-root [data-ilp="edit"]').click();await page.locator('#ilp-form [name="title"]').fill('Updated personal plan');await page.locator('#ilp-form button[type="submit"]').click();await page.keyboard.press('Escape');await expect(page.locator('[data-p17-action="open-plan"]')).toContainText('Updated personal plan');await expect(page.locator('[data-p17-action="open-plan"]')).toBeFocused();
});

test('Profile completion: cover preview can cancel without saving and crop saves explicitly',async({page})=>{
 await openDemo(page,390,844);await page.locator('#navbar [data-val="profile"]').click();
 const photo=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=200;c.height=100;const x=c.getContext('2d');x.fillStyle='red';x.fillRect(0,0,100,100);x.fillStyle='blue';x.fillRect(100,0,100,100);return c.toDataURL('image/png').split(',')[1]});
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 const choose=()=>page.locator('#p17-cover-file').setInputFiles({name:'cover.png',mimeType:'image/png',buffer:Buffer.from(photo,'base64')});
 await choose();await expect(page.locator('#p17-crop-preview')).toHaveCount(1);expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await page.locator('[data-p17-action="photo-cancel"]').click();expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await choose();await page.locator('#p17-crop-zoom').fill('2');await page.locator('#p17-crop-x').fill('100');await page.locator('[data-p17-action="photo-save"]').click();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile.p17Cover?.startsWith('data:image/jpeg;base64,'))).toBe(true);
});

for(const lang of ['sq','en','it'])test('Profile completion: avatar crop keeps drafts, supports quota retry, Escape and live locale '+lang,async({page})=>{
 await page.emulateMedia({colorScheme:lang==='sq'?'dark':'light'});await openDemo(page,320,568);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);await page.locator('#navbar [data-val="profile"]').click();await page.locator('.p17-edit').click();await page.locator('#edit-name').fill('Unsaved name');await page.locator('#p17-city').fill('Draft city');
 const original=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 const data=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=300;c.height=100;const x=c.getContext('2d');x.fillStyle='red';x.fillRect(0,0,150,100);x.fillStyle='blue';x.fillRect(150,0,150,100);return c.toDataURL('image/png').split(',')[1]});
 const choose=()=>page.locator('#v12-photo-file').setInputFiles({name:'avatar.png',mimeType:'image/png',buffer:Buffer.from(data,'base64')});
 await choose();await expect(page.locator('#p17-crop-preview')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#edit-name')).toHaveValue('Unsaved name');expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(original);
 await choose();await page.locator('#p17-crop-x').fill('100');await page.locator('#p17-crop-zoom').fill('2');await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(page.locator('#p17-crop-x')).toHaveValue('100');await expect(page.locator('#p17-crop-zoom')).toHaveValue('2');
 if(lang==='sq')await page.screenshot({path:'qa-results/visual/profile-crop-dark-320.png',animations:'disabled'});
 await page.evaluate(()=>{window.cropSet=Storage.prototype.setItem;window.cropFail=true;Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state'&&window.cropFail)throw new DOMException('synthetic quota','QuotaExceededError');return window.cropSet.call(this,k,v)}});
 await page.locator('[data-p17-action="photo-save"]').click();await expect(page.locator('#p17-crop-preview')).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(original);
 await page.evaluate(()=>window.cropFail=false);await page.locator('[data-p17-action="photo-save"]').click();await expect(page.locator('#edit-name')).toHaveValue('Unsaved name');await expect(page.locator('#p17-city')).toHaveValue('Draft city');
 await expect.poll(()=>page.locator('.v12-avatar-large').evaluate(img=>{if(!img.complete)return false;const c=document.createElement('canvas');c.width=c.height=1;const x=c.getContext('2d');x.drawImage(img,0,0,1,1);const v=x.getImageData(0,0,1,1).data;return img.naturalWidth===160&&v[2]>200&&v[0]<30})).toBe(true);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile.name)).not.toBe('Unsaved name');
});

test('Profile completion: Highlights retain legacy snapshots, choose covers, order and share an archive through the Story viewer',async({page})=>{
 await page.addInitScript(()=>{const k='illyrian_demo_v09_state';if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify({profile:{name:'My profile',p17Highlights:[{id:'old-collection',title:'Historical',items:[{id:'old-story',caption:'Legacy caption',sample:'cafe'}]}]}}));const m='illyrian_demo_v15_creator';if(!localStorage.getItem(m))localStorage.setItem(m,JSON.stringify({stories:[{id:'archive-a',caption:'First <b>Story</b>',sample:'arta'},{id:'archive-b',caption:'Second Story',sample:'cafe'}],reels:[]}))});
 await openDemo(page,390,844);await page.locator('#navbar [data-val="profile"]').click();
 await page.locator('[data-p17-action="highlight-view"][data-id="old-collection"]').click();await expect(page.locator('#layer .v16-media')).toBeVisible();await expect(page.locator('.v16-content')).toContainText('Legacy caption');await page.keyboard.press('Escape');
 await page.locator('.p17-hl-add').click();await page.locator('#p17-title').fill('New collection');await page.locator('#p17-source').selectOption('archive-a');await page.locator('[data-p17-action="highlight-save"]').click();
 const id=await page.locator('[data-p17-action="highlight-view"]').first().getAttribute('data-id');
 await page.locator('[data-p17-action="highlight-view"]').first().click();await expect(page.locator('.v16-content')).toContainText('First <b>Story</b>');await expect(page.locator('.v16-content p b')).toHaveCount(0);
 await page.locator('#layer [data-p17-action="highlight-editor"]').click();await page.locator('#p17-source').selectOption('archive-b');await page.locator('[data-p17-action="highlight-save"]').click();
 await page.locator('[data-p17-action="highlight-view"]').first().click();await page.locator('#layer [data-p17-action="highlight-editor"]').click();await page.locator('#p17-highlight-cover').selectOption('archive-b');await page.locator('[data-p17-action="highlight-item-up"][data-id="1"]').click();await page.locator('[data-p17-action="highlight-save"]').click();
 const image=page.locator('[data-p17-action="highlight-view"][data-id="'+id+'"] img');await expect.poll(()=>image.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
 await page.locator('.p17-hl-add').click();await page.locator('#p17-title').fill('Shared archive');await page.locator('#p17-source').selectOption('archive-a');await page.locator('[data-p17-action="highlight-save"]').click();
 let data=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile);
 expect(Object.keys(data.p17StoryArchive).sort()).toEqual(['archive-a','archive-b']);expect(data.p17Highlights.find(h=>h.id===id).items.map(x=>x.ref)).toEqual(['archive-b','archive-a']);expect(data.p17Highlights.find(h=>h.id==='old-collection').items[0]).toMatchObject({id:'old-story',caption:'Legacy caption',sample:'cafe'});
 await page.locator('[data-p17-action="highlight-view"]').first().click();await page.locator('#layer [data-p17-action="highlight-editor"]').click();await page.locator('[data-p17-action="highlight-move-down"]').click();await page.keyboard.press('Escape');
 await page.evaluate(()=>localStorage.setItem('illyrian_demo_v15_creator',JSON.stringify({stories:[],reels:[]})));await page.reload();await page.locator('#navbar [data-val="profile"]').click();
 await page.locator('[data-p17-action="highlight-view"][data-id="'+id+'"]').click();await expect(page.locator('.v16-content')).toContainText('Second Story');await expect(page.locator('[data-act="v16-delete"],[data-act="v16-send"]')).toHaveCount(0);
 await page.locator('[data-act="v16-next"]').click();await expect(page.locator('.v16-content')).toContainText('First <b>Story</b>');await page.keyboard.press('Escape');await expect(page.locator('.p17-profile')).toBeVisible();await expect(page.locator('[data-p17-action="highlight-view"][data-id="'+id+'"]')).toBeFocused();
});

test('Profile completion: Highlights quota retry creates one archive reference and deletion preserves legacy data',async({page})=>{
 await page.addInitScript(()=>{const k='illyrian_demo_v09_state';if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify({profile:{name:'Owner',p17Highlights:[{id:'legacy',title:'Old',items:[{id:'old',caption:'Original',sample:'cafe'}]}]}}))});
 await openDemo(page,390,844);await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=40;const x=c.getContext('2d');x.fillStyle='blue';x.fillRect(0,0,40,40);localStorage.setItem('illyrian_demo_v15_creator',JSON.stringify({stories:[{id:'photo-archive',caption:'Keep my image',photo:c.toDataURL('image/jpeg'),sample:'arta'}],reels:[]}))});await page.reload();await page.locator('#navbar [data-val="profile"]').click();
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));await page.locator('.p17-hl-add').click();await page.locator('#p17-title').fill('Archive');await page.locator('#p17-source').selectOption('photo-archive');
 await page.evaluate(()=>{window.hlSet=Storage.prototype.setItem;window.hlFail=true;Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state'&&window.hlFail)throw new DOMException('synthetic quota','QuotaExceededError');return window.hlSet.call(this,k,v)}});
 await page.locator('[data-p17-action="highlight-save"]').click();await expect(page.locator('.toast')).toBeVisible();await expect(page.locator('#p17-title')).toHaveValue('Archive');await expect(page.locator('#p17-source')).toHaveValue('photo-archive');expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await page.evaluate(()=>window.hlFail=false);await page.locator('[data-p17-action="highlight-save"]').click();await expect(page.locator('#p17-title')).toHaveCount(0);let data=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile);expect(data.p17Highlights).toHaveLength(2);expect(Object.keys(data.p17StoryArchive)).toEqual(['photo-archive']);expect(data.p17StoryArchive['photo-archive'].photo).toMatch(/^data:image\/jpeg;base64,/);
 await page.locator('[data-p17-action="highlight-view"]').first().click();await page.locator('#layer [data-p17-action="highlight-editor"]').click();page.once('dialog',d=>d.accept());await page.locator('[data-p17-action="highlight-delete"]').click();
 data=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile);expect(data.p17Highlights).toHaveLength(1);expect(data.p17Highlights[0].items).toEqual([{id:'old',caption:'Original',sample:'cafe'}]);expect(data.p17StoryArchive).toEqual({});
});

test('Profile completion: delayed or stale avatar cannot overwrite a new profile state',async({page})=>{
 await page.addInitScript(()=>{const k='illyrian_demo_v09_state';if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify({profile:{name:'Original owner'}}))});
 await openDemo(page,390,844);await page.locator('#navbar [data-val="profile"]').click();await page.locator('.p17-edit').click();
 const raw=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=40;return c.toDataURL('image/png').split(',')[1]});
 await page.evaluate(()=>{const ImageClass=window.Image,set=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src').set;window.Image=function(...args){const img=new ImageClass(...args);Object.defineProperty(img,'src',{set(value){if(!window.releaseCrop&&value.startsWith('blob:'))window.releaseCrop=()=>new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});set.call(img,value)});else set.call(img,value)}});return img}});
 await page.locator('#v12-photo-file').setInputFiles({name:'old.png',mimeType:'image/png',buffer:Buffer.from(raw,'base64')});await expect.poll(()=>page.evaluate(()=>typeof window.releaseCrop)).toBe('function');await page.keyboard.press('Escape');await page.evaluate(()=>window.releaseCrop());await expect(page.locator('#p17-crop-preview')).toHaveCount(0);
 await page.locator('.p17-edit').click();await page.locator('#v12-photo-file').setInputFiles({name:'new.png',mimeType:'image/png',buffer:Buffer.from(raw,'base64')});await expect(page.locator('#p17-crop-preview')).toBeVisible();
 const changed=await page.evaluate(()=>{const k='illyrian_demo_v09_state',data=JSON.parse(localStorage.getItem(k));data.profile.name='Changed in another tab';const raw=JSON.stringify(data);localStorage.setItem(k,raw);return raw});await page.locator('[data-p17-action="photo-save"]').click();await expect(page.locator('#p17-crop-preview')).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(changed);
});

async function correctionFixture(page,entries){
 await page.addInitScript(entries=>{for(const [key,value]of Object.entries(entries))if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(value))},entries);
 await openDemo(page,390,844);await page.locator('#navbar [data-val="profile"]').click();
}
const correctionHighlights=[{id:'h-a',title:'First collection',items:[{id:'s-a',caption:'Kryefaqja',sample:'arta'},{id:'s-b',caption:'Second saved Story',sample:'cafe'}]},{id:'h-b',title:'Second collection',items:[{id:'s-c',caption:'Another saved Story',sample:'cafe'}]}];
async function correctionEditor(page){await page.locator('[data-p17-action="highlight-view"][data-id="h-a"]').click();await page.locator('#layer [data-p17-action="highlight-editor"]').click()}

test('Profile corrections: saved personal Reel appears once, survives reload and can be removed',async({page})=>{
 await correctionFixture(page,{'illyrian_demo_v09_state':{profile:{name:'Audit owner',p17Handle:'audit.owner'},posts:[],bookmarks:[],reelSaved:[]},'illyrian_demo_v15_creator':{stories:[],reels:[{id:'saved-personal',caption:'My saved personal Reel',sample:'cafe'}]}});
 await page.locator('#p17-tab-reels').click();await page.locator('[data-kind="myreel"]').click();await page.locator('[data-act="v16-save"]').click();await expect(page.locator('[data-act="v16-save"]')).toHaveAttribute('aria-pressed','true');await page.keyboard.press('Escape');await page.locator('#p17-tab-saved').click();await expect(page.locator('[data-kind="myreel"]')).toHaveCount(1);
 await page.reload();await page.locator('#navbar [data-val="profile"]').click();await page.locator('#p17-tab-saved').click();await expect(page.locator('[data-kind="myreel"]')).toHaveCount(1);await page.locator('[data-kind="myreel"]').click();await page.locator('[data-act="v16-save"]').click();await page.keyboard.press('Escape');await expect(page.locator('[data-kind="myreel"]')).toHaveCount(0);
});

for(const lang of ['sq','en','it'])test('Profile corrections: initial form matches presentation and unchanged save is read-only '+lang,async({page})=>{
 await openDemo(page,390,844);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);await page.locator('#navbar [data-val="profile"]').click();const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));const bio=await page.locator('.p17-bio').innerText();
 await page.locator('.p17-edit').click();await expect(page.locator('#edit-name')).toHaveValue('Arta K.');await expect(page.locator('#edit-bio')).toHaveValue(bio);await expect(page.locator('#p17-handle')).toHaveValue('arta.k');await expect(page.locator('#p17-city')).toHaveValue('Prishtinë, Kosovë');await expect(page.locator('#p17-tags')).toHaveValue('Udhëtime, Kafe & Food, Lifestyle');
 await page.locator('[data-p17-action="profile-save"]').click();await expect(page.locator('.p17-person-name')).toContainText('Arta K.');await expect(page.locator('.p17-stats > div b')).toHaveText('62');expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
});

test('Profile corrections: personalized empty profile counts zero while examples remain available',async({page})=>{
 await correctionFixture(page,{'illyrian_demo_v09_state':{profile:{name:'Personal owner',p17Handle:'personal.owner'},posts:[]}});await expect(page.locator('.p17-stats > div b')).toHaveText('0');await expect(page.locator('.p17-tile[data-kind="sample"]')).toHaveCount(6);
});

test('Profile corrections: cover reset keeps edit draft, cancels cleanly and commits with quota retry',async({page})=>{
 await correctionFixture(page,{'illyrian_demo_v09_state':{profile:{name:'Audit owner',p17Handle:'audit.owner',bio:'Original bio',p17Cover:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='}}});
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));await page.locator('.p17-edit').click();await page.locator('#edit-name').fill('Changed owner');await page.locator('[data-p17-action="cover-reset"]').click();await expect(page.locator('#edit-name')).toHaveValue('Changed owner');expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);await page.keyboard.press('Escape');expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await page.locator('.p17-edit').click();await expect(page.locator('[data-p17-action="cover-reset"]')).toBeEnabled();await page.locator('#edit-name').fill('Changed owner');await page.locator('[data-p17-action="cover-reset"]').click();
 await page.evaluate(()=>{window.resetSet=Storage.prototype.setItem;window.resetFail=true;Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state'&&window.resetFail)throw new DOMException('synthetic quota','QuotaExceededError');return window.resetSet.call(this,k,v)}});await page.locator('[data-p17-action="profile-save"]').click();await expect(page.locator('#edit-name')).toHaveValue('Changed owner');expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await page.evaluate(()=>window.resetFail=false);await page.locator('[data-p17-action="profile-save"]').click();expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile)).toMatchObject({name:'Changed owner',p17Cover:'',bio:'Original bio'});
});

for(const lang of ['sq','en','it'])test('Profile corrections: Highlight source survives reorder and authored captions stay literal '+lang,async({page})=>{
 await correctionFixture(page,{'illyrian_demo_v09_state':{profile:{name:'Owner',p17Highlights:correctionHighlights}},'illyrian_demo_v15_creator':{stories:[{id:'new-s',caption:'Kryefaqja',sample:'arta'}],reels:[]}});await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);await correctionEditor(page);await page.locator('#p17-title').fill('Edited collection');await page.locator('#p17-source').selectOption('new-s');await page.locator('[data-p17-action="highlight-item-up"][data-id="1"]').click();await expect(page.locator('#p17-source')).toHaveValue('new-s');await expect(page.locator('#p17-title')).toHaveValue('Edited collection');
 for(const next of ['en','it','sq']){await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),next);await expect(page.locator('#p17-source option[value="new-s"]')).toHaveText('Kryefaqja');await expect(page.locator('#p17-highlight-cover option[value="s-a"]')).toHaveText('Kryefaqja');await expect(page.locator('#p17-source')).toHaveValue('new-s')}
 await page.locator('[data-p17-action="highlight-save"]').click();await expect(page.locator('#p17-title')).toHaveCount(0);const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile);expect(stored.p17Highlights[0].items.map(x=>x.id)).toEqual(['s-b','s-a','new-s']);expect(stored.p17StoryArchive['new-s'].caption).toBe('Kryefaqja');
});

test('Profile corrections: collection ordering is staged with title and retries once without losing data',async({page})=>{
 await correctionFixture(page,{'illyrian_demo_v09_state':{profile:{name:'Owner',p17Highlights:correctionHighlights}}});const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await correctionEditor(page);await page.locator('#p17-title').fill('New title');await page.locator('[data-p17-action="highlight-move-down"]').click();expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);await page.keyboard.press('Escape');expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await correctionEditor(page);await page.locator('#p17-title').fill('New title');await page.locator('[data-p17-action="highlight-move-down"]').click();await page.evaluate(()=>{window.orderSet=Storage.prototype.setItem;window.orderFail=true;Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state'&&window.orderFail)throw new DOMException('synthetic quota','QuotaExceededError');return window.orderSet.call(this,k,v)}});await page.locator('[data-p17-action="highlight-save"]').click();await expect(page.locator('#p17-title')).toHaveValue('New title');expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await page.evaluate(()=>window.orderFail=false);await page.locator('[data-p17-action="highlight-save"]').click();await expect(page.locator('#p17-title')).toHaveCount(0);const rows=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile.p17Highlights);expect(rows.map(x=>x.id)).toEqual(['h-b','h-a']);expect(rows[1].title).toBe('New title');expect(rows[1].items).toEqual(correctionHighlights[0].items);
});

test('Profile corrections: avatar Save keeps displayed identity and pending cover reset through locale changes',async({page})=>{
 await openDemo(page,320,568);await page.locator('#navbar [data-val="profile"]').click();await page.locator('.p17-edit').click();await page.locator('#edit-name').fill('Unsaved chosen name');await page.locator('[data-p17-action="cover-reset"]').click();
 const image=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=50;const x=c.getContext('2d');x.fillStyle='blue';x.fillRect(0,0,50,50);return c.toDataURL('image/png').split(',')[1]});await page.locator('#v12-photo-file').setInputFiles({name:'avatar.png',mimeType:'image/png',buffer:Buffer.from(image,'base64')});await page.locator('[data-p17-action="photo-save"]').click();await expect(page.locator('#edit-name')).toHaveValue('Unsaved chosen name');await expect(page.locator('[data-p17-action="cover-reset"]')).toBeDisabled();
 let stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile);expect(stored.name).toBe('Arta K.');expect(stored.p17Handle).toBe('arta.k');expect(stored.p17Cover).toBeUndefined();
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));await expect(page.locator('#edit-name')).toHaveValue('Unsaved chosen name');await expect(page.locator('#p17-cover-reset-note')).toContainText('Salva');await page.locator('[data-p17-action="profile-save"]').click();stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile);expect(stored).toMatchObject({name:'Unsaved chosen name',p17Cover:''});expect(stored.photoData).toMatch(/^data:image\/jpeg;base64,/);
});

test('Profile corrections: a followed business is counted, listed and opens its existing business page',async({page})=>{
 await correctionFixture(page,{'illyrian_demo_v09_state':{profile:{name:'Owner',p17Handle:'audit.owner'},follows:[]}});await page.locator('#navbar [data-val="explore"]').click();await page.locator('#screen [data-act="business-detail"][data-id="b1"]').click();await page.locator('#layer [data-act="follow"][data-id="b1"]').click();await page.keyboard.press('Escape');await page.locator('#navbar [data-val="profile"]').click();
 await expect(page.locator('[data-p17-action="following"] b')).toHaveText('1');await page.locator('[data-p17-action="following"]').click();await expect(page.locator('[data-p17-action="network-person"][data-id="b1"]')).toHaveCount(1);await page.locator('[data-p17-action="network-person"][data-id="b1"]').click();await expect(page.locator('#layer .modalhead')).toContainText('Alba Coffee');await expect(page.locator('#layer [data-act="business-contact"][data-id="b1"]')).toBeVisible();
});

test('Profile corrections: complete profile keeps authored markup-like text, locale and historical data unchanged',async({page})=>{
 const profile={name:'Owner " & <b>',bio:'Home </textarea><img data-audit-injected src=x>',p17Handle:'audit.owner',p17City:'DEMO City',p17Tags:['Home','DEMO café'],historicalField:{keep:'unchanged'}};
 await correctionFixture(page,{'illyrian_demo_v09_state':{profile,follows:['arta','historical-unknown'],posts:[]}});const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));await expect(page.locator('.p17-person-name h2')).toHaveText(profile.name);await expect(page.locator('.p17-bio')).toHaveText(profile.bio);await expect(page.locator('[data-p17-action="following"] b')).toHaveText('1');
 await page.locator('.p17-edit').click();for(const lang of ['sq','it','en']){await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);await expect(page.locator('#edit-name')).toHaveValue(profile.name);await expect(page.locator('#edit-bio')).toHaveValue(profile.bio);await expect(page.locator('#p17-city')).toHaveValue('DEMO City');await expect(page.locator('[data-audit-injected]')).toHaveCount(0)}await page.locator('[data-p17-action="profile-save"]').click();expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await page.locator('[data-ily-profile-settings]').click();await page.locator('#layer [data-val="communities"]').click();await expect(page.locator('#layer .modal')).toBeVisible();await page.keyboard.press('Escape');
 for(const tab of ['posts','reels','saved','liked','opportunities']){await page.locator('#p17-tab-'+tab).click();await expect(page.locator('#p17-tab-'+tab)).toHaveAttribute('aria-selected','true')}expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
});

// Notifications reference: UI-only fixtures reuse the core read/follow stores.
async function openNotifications(page){
 await openDemo(page,390,844);
 await page.locator('#phone > .head [data-val="notifications"]').click();
 return page.locator('#layer .n17-modal');
}
test('Notifications reference: filters, read counters and reload preserve historical IDs',async({page})=>{
 const modal=await openNotifications(page);
 await expect(modal).toBeVisible();
 await expect(modal.locator('[data-act="n17-filter"]')).toHaveCount(5);
 const total=await modal.locator('.n17-row').count();expect(total).toBeGreaterThan(4);
 await modal.locator('[data-act="n17-filter"][data-val="jobs"]').click();
 await expect(modal.locator('.n17-row')).toHaveCount(1);
 await expect(modal.locator('[data-act="v6-open-alert"]')).toHaveAttribute('data-id','job');
 await modal.locator('[data-act="v6-read-all"]').click();
 await expect(modal.locator('[data-act="v6-read-all"]')).toBeDisabled();
 await page.keyboard.press('Escape');await page.reload();
 await page.locator('#phone > .head [data-val="notifications"]').click();
 await expect(modal.locator('.n17-row.new')).toHaveCount(0);
 await expect(page.locator('#phone > .head [data-val="notifications"] .dot')).toBeHidden();
});
test('Notifications reference: follow back, content and settings return to the selected filter',async({page})=>{
 const modal=await openNotifications(page);
 await modal.locator('[data-act="n17-filter"][data-val="people"]').click();
 await modal.locator('[data-act="n17-follow"]').click();
 await expect(modal.locator('[data-act="n17-follow"]')).toBeDisabled();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).follows.filter(x=>x==='leon').length)).toBe(1);
 await modal.locator('[data-act="v6-open-alert"][data-id="profile"]').click();
 await expect(page.locator('#comment-input')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(modal.locator('[data-act="n17-filter"][data-val="people"]')).toHaveAttribute('aria-pressed','true');
 await expect(modal.locator('[data-act="v6-open-alert"][data-id="profile"]')).toBeFocused();
 await modal.locator('[data-act="n17-settings"]').click();
 await expect(page.locator('[data-v6-pref="alertMessages"]')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(modal.locator('[data-act="n17-settings"]')).toBeFocused();
});
test('Notifications reference: quota and stale writes do not mark read or follow',async({page})=>{
 const modal=await openNotifications(page);
 await page.evaluate(()=>{window.ntSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('full','QuotaExceededError');return window.ntSet.call(this,k,v)}});
 const before=await modal.locator('.n17-row.new').count();
 await modal.locator('[data-act="v6-read-all"]').click();
 await expect(modal.locator('.n17-row.new')).toHaveCount(before);
 await modal.locator('[data-act="n17-follow"]').click();
 await expect(modal.locator('[data-act="n17-follow"]')).toBeEnabled();
 await page.evaluate(()=>{Storage.prototype.setItem=window.ntSet;localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({...JSON.parse(localStorage.getItem('illyrian_demo_v09_state')||'{}'),comments:{p1:['OTHER TAB']}}))});
 await modal.locator('[data-act="v6-read-all"]').click();
 await expect(modal.locator('.n17-row.new')).toHaveCount(before);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).comments.p1)).toEqual(['OTHER TAB']);
});
for(const [lang,title,peopleLabel] of [['sq','Njoftimet','Njerëz'],['en','Notifications','People'],['it','Notifiche','Persone']])test('Notifications reference: localized filters, empty state and literal activity '+lang,async({page})=>{
 await page.addInitScript(lang=>{localStorage.setItem('illyrian_demo_ui_language_v1',lang);localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({activityLog:[{id:'literal',text:'Kryefaqja DEMO <img onerror=alert(1)>',time:'Tani'}]}))},lang);
 const modal=await openNotifications(page);
 await expect(modal.locator('h2')).toHaveText(title);
 await expect(modal.locator('[data-act="n17-filter"][data-val="people"]')).toContainText(peopleLabel);
 await modal.locator('[data-act="n17-filter"][data-val="system"]').click();
 await expect(modal).toContainText('Kryefaqja DEMO <img onerror=alert(1)>');
 await expect(modal.locator('[data-user-content] img')).toHaveCount(0);
 await modal.locator('[data-act="n17-filter"][data-val="all"]').click();
 await expect(modal.locator('img')).not.toHaveCount(0);
 expect(await modal.locator('img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
});
for(const [width,height] of sizes)for(const theme of ['light','dark'])test('Notifications reference: responsive '+width+'x'+height+' '+theme,async({page},testInfo)=>{
 await page.addInitScript(theme=>{localStorage.setItem('illyrian_demo_ui_language_v1','sq');localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({theme,v6ReadAlerts:['legacy-notice']}))},theme);
 await openDemo(page,width,height);
 await page.locator('#phone > .head [data-val="notifications"]').click();
 const modal=page.locator('.n17-modal');await expect(modal).toBeVisible();
 const bounds=await modal.boundingBox();expect(bounds.width).toBeGreaterThan(300);expect(bounds.height).toBeLessThanOrEqual(height);
 expect(await modal.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
 const list=modal.locator('.n17-list');
 if(width===390)await modal.screenshot({path:testInfo.outputPath('notifications-'+theme+'.png')});
 await list.evaluate(el=>{el.scrollTop=el.scrollHeight});
 await expect(modal.locator('[data-act="v6-read-all"]')).toBeInViewport();
 await modal.locator('[data-act="v6-read-all"]').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).v6ReadAlerts.includes('legacy-notice'))).toBe(true);
 for(const el of await modal.locator('button:visible').all()){const r=await el.boundingBox();expect(r.height).toBeGreaterThanOrEqual(43);}
 await list.evaluate(el=>{el.scrollTop=0});
 await page.keyboard.press('Escape');await expect(modal).toHaveCount(0);
 await expect(page.locator('#phone > .head [data-val="notifications"]')).toBeFocused();
});
test('Notifications reference: destinations and buttons return without losing filter or scrolling',async({page})=>{
 const modal=await openNotifications(page);
 for(const id of ['meet','job','n17-community','n17-change','n17-comment']){
  await modal.locator('[data-act="v6-open-alert"][data-id="'+id+'"]').click();
  await expect(page.locator('#layer [data-act="n17-back"]')).toBeVisible();
  await page.locator('#layer [data-act="n17-back"]').click();
  await expect(modal.locator('[data-act="v6-open-alert"][data-id="'+id+'"]')).toBeFocused();
 }
 await modal.locator('[data-act="n17-settings"]').click();
 const pref=page.locator('[data-v6-pref="alertActivities"]');await pref.uncheck();
 await page.locator('#layer .modalhead [data-act="close"]').click();
 await expect(modal).toBeVisible();
 await page.keyboard.press('Escape');await page.reload();
 await page.locator('#phone > .head [data-val="notifications"]').click();
 await modal.locator('[data-act="n17-settings"]').click();await expect(pref).not.toBeChecked();
});
test('Notifications reference: blocked actors are hidden and people category is honestly empty',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({blocked:['arta','leon','besa','dion']})));
 const modal=await openNotifications(page);await modal.locator('[data-act="n17-filter"][data-val="people"]').click();
 await expect(modal.locator('.n17-row')).toHaveCount(0);await expect(modal.locator('.n17-empty')).toBeVisible();await expect(modal.locator('[data-act="n17-follow"]')).toHaveCount(0);
});
test('Notifications reference: live language preserves filter, focus and core storage',async({page})=>{
 const modal=await openNotifications(page);await modal.locator('[data-act="n17-filter"][data-val="jobs"]').click();
 const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 for(const [lang,title] of [['en','Notifications'],['it','Notifiche'],['sq','Njoftimet']]){
  await page.evaluate(async lang=>{await window.IllyrianI18n.changeLanguage(lang)},lang);
  await expect(modal.locator('h2')).toHaveText(title);
  await expect(modal.locator('[data-act="n17-filter"][data-val="jobs"]')).toBeFocused();
  await expect(modal.locator('[data-act="n17-filter"][data-val="jobs"]')).toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
 }
});
test('Notifications reference: accurate unread counts and AA text on accent buttons',async({page})=>{
 const modal=await openNotifications(page);
 const unread=await modal.locator('.n17-row.new').count();
 await expect(modal.locator('[data-act="n17-filter"][data-val="all"] b')).toHaveText(String(unread));
 await modal.locator('[data-act="n17-follow"]').click();
 await expect(modal.locator('[data-act="n17-filter"][data-val="all"] b')).toHaveText(String(unread-1));
 for(const theme of ['light','dark']){
  await page.evaluate(theme=>document.querySelector('#phone').classList.toggle('dark',theme==='dark'),theme);
  const ratio=await modal.locator('[data-act="n17-filter"][data-val="all"]').evaluate(el=>{
   const css=getComputedStyle(el),rgb=s=>(s.match(/[\d.]+/g)||[]).slice(0,3).map(Number),lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((v,c,i)=>v+c*[.2126,.7152,.0722][i],0),a=lum(rgb(css.color)),b=lum(rgb(css.backgroundColor));return(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  });expect(ratio).toBeGreaterThanOrEqual(4.5);
 }
});
test('Notifications reference: nested report Escape returns to content before the notification list',async({page})=>{
 const modal=await openNotifications(page);
 await modal.locator('[data-act="v6-open-alert"][data-id="profile"]').click();
 await page.locator('#layer [data-ily-report]').click();
 await expect(page.locator('#ig6-root')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('#ig6-root')).toHaveCount(0);
 await expect(page.locator('#comment-input')).toBeVisible();
 await page.keyboard.press('Escape');await expect(modal).toBeVisible();
});
test('Notifications reference: live locale keeps the exact focused notification row',async({page})=>{
 const modal=await openNotifications(page);const row=modal.locator('[data-act="v6-open-alert"][data-id="n17-mention"]');
 await row.focus();await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(row).toBeFocused();
});


test('Notifications preferences: sq/en/it labels and live focus preserve core state',async({page})=>{
 const modal=await openNotifications(page);
 await modal.locator('[data-act="n17-settings"]').click();
 const pref=page.locator('#layer [data-v6-pref="alertActivities"]');
 await pref.focus();
 const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 const cases=[
  ['en','Notifications','Notification preferences','Messages','Activities and groups','Local preference only.','No push notifications are sent.'],
  ['it','Notifiche','Preferenze di notifica','Messaggi','Attività e gruppi','Solo preferenza locale.','Non vengono inviate notifiche push.'],
  ['sq','Njoftimet','Preferencat për njoftimet','Mesazhe','Aktivitete dhe grupe','Vetëm cilësim lokal.','Nuk dërgohen njoftime push.']
 ];
 for(const [lang,title,heading,messages,activities,note,push] of cases){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#layer .modalhead h2')).toHaveText(title);
  await expect(page.locator('#layer .v6-setting-card h3')).toHaveText(heading);
  await expect(page.locator('#layer .v6-pref-row').nth(0)).toContainText(messages);
  await expect(page.locator('#layer .v6-pref-row').nth(1)).toContainText(activities);
  await expect(page.locator('#layer .v6-pref-row small').first()).toHaveText(note);
  await expect(page.locator('#layer .v6-alert-banner')).toContainText(push);
  await expect(pref).toBeChecked();
  await expect(pref).toBeFocused();
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
 }
 await page.keyboard.press('Escape');
 await expect(modal).toBeVisible();
 await expect(modal.locator('[data-act="n17-settings"]')).toBeFocused();
});

// Three confirmed notification audit defects: snapshot overwrite, count cap and dates.
test('Notifications corrections: preferences reject a stale tab and retry after reload',async({browser})=>{
 const ctx=await browser.newContext();const a=await ctx.newPage(),b=await ctx.newPage();
 try{
  await openNotifications(a);await a.locator('[data-act="n17-settings"]').click();
  await openDemo(b,390,844);await b.locator('#screen [data-act="comments"]').first().click();
  await b.locator('#comment-input').fill('Keep this other-tab comment');await b.locator('#layer [data-act="send-comment"]').click();
  const raw=await b.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await a.locator('[data-v6-pref="alertActivities"]').click();
  expect(await a.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
  await expect(a.locator('[data-v6-pref="alertActivities"]')).toBeChecked();
  await expect(a.locator('[data-v6-pref="alertActivities"]')).toBeFocused();
  await a.reload();await a.locator('#phone > .head [data-val="notifications"]').click();await a.locator('[data-act="n17-settings"]').click();
  await a.locator('[data-v6-pref="alertActivities"]').uncheck();
  const saved=await a.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')));
  expect(saved.comments.p1).toEqual(['Keep this other-tab comment']);expect(saved.v6Prefs.alertActivities).toBe(false);
 }finally{await ctx.close()}
});
test('Notifications corrections: bell shows the exact count above nine and clears at zero',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({activityLog:[{id:'count',text:'Count fixture',time:'Tani'}]})));
 const modal=await openNotifications(page);
 await expect(modal.locator('[data-act="n17-filter"][data-val="all"] b')).toHaveText('10');
 await expect(page.locator('#phone > .head [data-val="notifications"] .dot')).toHaveText('10');
 expect(await page.locator('#phone > .head [data-val="notifications"] .dot').evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
 await modal.locator('[data-act="v6-read-all"]').click();await page.keyboard.press('Escape');
 await expect(page.locator('#phone > .head [data-val="notifications"] .dot')).toBeHidden();
});
for(const [lang,earlier,undated] of [['sq','Më herët','Pa datë'],['en','Earlier','Undated'],['it','In precedenza','Senza data']])test('Notifications corrections: historical and missing dates remain honest '+lang,async({page})=>{
 await page.clock.install({time:new Date('2026-11-01T12:00:00Z')});
 await page.clock.setFixedTime(new Date('2026-11-01T12:00:00Z'));
 await page.addInitScript(lang=>{localStorage.setItem('illyrian_demo_ui_language_v1',lang);localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({activityLog:[{id:'old',text:'Old event',time:'2026-10-01 12:30'},{id:'unknown',text:'Undated event',time:'Tani'}]}))},lang);
 const modal=await openNotifications(page);const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 const old=modal.locator('[data-act="v6-open-alert"][data-id="act_old"]');
 await expect(old.locator('xpath=ancestor::section/h3')).toHaveText(earlier);
 await expect(old.locator('small')).toContainText('2026');
 await expect(modal.locator('[data-act="v6-open-alert"][data-id="act_unknown"]').locator('xpath=ancestor::section/h3')).toHaveText(undated);
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
});
test('Notifications corrections: new activity timestamps survive reload and advance to yesterday',async({page})=>{
 await page.clock.install({time:new Date('2026-11-01T12:00:00Z')});
 await page.clock.setFixedTime(new Date('2026-11-01T12:00:00Z'));
 await page.addInitScript(()=>localStorage.setItem('illyrian_demo_ui_language_v1','sq'));
 const modal=await openNotifications(page);await modal.locator('[data-act="v6-open-alert"][data-id="job"]').click();
 await page.locator('#layer [data-act="apply-job"]').click();
 const entry=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).activityLog[0]);
 expect(entry.createdAt).toBe('2026-11-01T12:00:00.000Z');
 await page.keyboard.press('Escape');const row=modal.locator('[data-act="v6-open-alert"][data-id="act_'+entry.id+'"]');
 await expect(row.locator('xpath=ancestor::section/h3')).toHaveText('Sot');
 await page.clock.setFixedTime(new Date('2026-11-02T12:00:00Z'));await page.reload();await page.locator('#phone > .head [data-val="notifications"]').click();
 await expect(row.locator('xpath=ancestor::section/h3')).toHaveText('Dje');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).activityLog[0].createdAt)).toBe(entry.createdAt);
});
for(const [locale,joined,left] of [
 ['sq','Komuniteti u shtua te Profili yt','U largove nga komuniteti'],
 ['en','Community added to your profile','You left the community'],
 ['it','Comunità aggiunta al tuo profilo','Hai lasciato la comunità']
])test('Community membership saved feedback uses current locale - '+locale,async({page})=>{
 await page.addInitScript(lang=>localStorage.setItem('illyrian_demo_ui_language_v1',lang),locale);
 const alerts=await openNotifications(page);
 await alerts.locator('[data-act="v6-open-alert"][data-id="n17-community"]').click();
 const toggle=page.locator('#layer [data-act="v11-community-toggle"]');
 await toggle.click();
 await expect(page.locator('#toast-area')).toHaveText(joined);
 await expect(toggle).toBeFocused();
 await toggle.click();
 await expect(page.locator('#toast-area')).toHaveText(left);
 await expect(toggle).toBeFocused();
});
test('Community discussion posts keep seeded fixtures visible before block or mute',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="explore"]').click();
 await page.locator('#screen [data-act="v11-community-open"][data-id="c2"]').first().click();
 await page.locator('#layer [data-act="v11-community-tab"][data-val="posts"]').click();
 await expect(page.locator('#layer .post [data-act="postmore"][data-id="p1"]')).toHaveCount(1);
 await page.locator('#layer [data-act="close"]').click();
 await page.locator('#screen [data-act="v11-community-open"][data-id="c1"]').first().click();
 await page.locator('#layer [data-act="v11-community-tab"][data-val="posts"]').click();
 await expect(page.locator('#layer .post [data-act="postmore"][data-id="p2"]')).toHaveCount(1);
});
test('Community discussion posts hide blocked and muted actors but keep own same-name post',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({
   blocked:['arta'],muted:['leon'],posts:[{id:'my1792929600000',name:'Arta K.',ava:'a1',city:'Tiranë',when:'Tani',text:'Own community post',img:null,communityId:'c2',likes:0,comments:0,share:0}]
 })));
 await openDemo(page,390,844);
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await page.locator('#navbar [data-val="explore"]').click();
 await page.locator('#screen [data-act="v11-community-open"][data-id="c2"]').first().click();
 await page.locator('#layer [data-act="v11-community-tab"][data-val="posts"]').click();
 await expect(page.locator('#layer .post [data-act="postmore"][data-id="p1"]')).toHaveCount(0);
 await expect(page.locator('#layer .post [data-act="postmore"][data-id="my1792929600000"]')).toHaveCount(1);
 await page.locator('#layer [data-act="close"]').click();
 await page.locator('#screen [data-act="v11-community-open"][data-id="c1"]').first().click();
 await page.locator('#layer [data-act="v11-community-tab"][data-val="posts"]').click();
 await expect(page.locator('#layer .post [data-act="postmore"][data-id="p2"]')).toHaveCount(0);
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
});
test('Community modal tabs retain keyboard focus and announce active state after rerender',async({page})=>{
 const alerts=await openNotifications(page);
 await alerts.locator('[data-act="v6-open-alert"][data-id="n17-community"]').click();
 const overview=page.locator('#layer [data-act="v11-community-tab"][data-val="overview"]');
 const posts=page.locator('#layer [data-act="v11-community-tab"][data-val="posts"]');
 await expect(overview).toHaveAttribute('aria-pressed','true');
 await expect(posts).toHaveAttribute('aria-pressed','false');
 await posts.focus();await page.keyboard.press('Enter');
 await expect(posts).toBeFocused();
 await expect(posts).toHaveAttribute('aria-pressed','true');
 await expect(overview).toHaveAttribute('aria-pressed','false');
 await overview.focus();await page.keyboard.press('Space');
 await expect(overview).toBeFocused();
 await expect(overview).toHaveAttribute('aria-pressed','true');
 await expect(posts).toHaveAttribute('aria-pressed','false');
});
test('Community join and leave retain keyboard focus after the modal rerenders',async({page})=>{
  const notifications=await openNotifications(page);
  await notifications.locator('[data-act="v6-open-alert"][data-id="n17-community"]').click();
  const toggle=page.locator('#layer [data-act="v11-community-toggle"]');
  const id=await toggle.getAttribute('data-id');
  expect(id).toBeTruthy();
  const saved=()=>page.evaluate(communityId=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).joinedCommunities.includes(communityId),id);
  await toggle.focus();await page.keyboard.press('Enter');
  await expect(toggle).toBeFocused();expect(await saved()).toBe(true);
  await page.keyboard.press('Enter');
  await expect(toggle).toBeFocused();expect(await saved()).toBe(false);
  await page.reload({waitUntil:'load'});expect(await saved()).toBe(false);
 });
 test('Notifications corrections: community membership uses the same timestamp contract',async({page})=>{
 await page.clock.install({time:new Date('2026-11-01T12:00:00Z')});
 await page.clock.setFixedTime(new Date('2026-11-01T12:00:00Z'));
 const modal=await openNotifications(page);await modal.locator('[data-act="v6-open-alert"][data-id="n17-community"]').click();
 await page.locator('#layer [data-act="v11-community-toggle"]').click();
 const entry=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).activityLog[0]);
 expect(entry.createdAt).toBe('2026-11-01T12:00:00.000Z');
});
for(const zone of ['Europe/Rome','America/New_York'])test('Notifications corrections: local calendar groups respect timezone and DST '+zone,async({browser})=>{
 const ctx=await browser.newContext({timezoneId:zone});const page=await ctx.newPage();
 try{
  await page.clock.install({time:new Date('2026-10-25T23:30:00Z')});
  await page.addInitScript(()=>{localStorage.setItem('illyrian_demo_ui_language_v1','sq');localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({activityLog:[{id:'timezone',text:'TIMEZONE FIXTURE',createdAt:'2026-10-25T22:30:00Z'},{id:'future',text:'FUTURE FIXTURE',createdAt:'2026-12-01T12:00:00Z'},{id:'bad',text:'INVALID FIXTURE',createdAt:'2026-02-30T12:00:00Z',time:'Tani'}]}))});
  const modal=await openNotifications(page);
  await expect(modal.locator('[data-id="act_timezone"]').locator('xpath=ancestor::section/h3')).toHaveText(zone==='Europe/Rome'?'Dje':'Sot');
  await expect(modal.locator('[data-id="act_future"]').locator('xpath=ancestor::section/h3')).toHaveText('Data të tjera');
  await expect(modal.locator('[data-id="act_bad"]').locator('xpath=ancestor::section/h3')).toHaveText('Pa datë');
 }finally{await ctx.close()}
});
test('Notifications corrections: a date without a time never invents midnight',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('illyrian_demo_ui_language_v1','sq');localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({activityLog:[{id:'date-only',text:'DATE ONLY FIXTURE',time:'2026-10-01'}]}))});
 const modal=await openNotifications(page);
 await expect(modal.locator('[data-id="act_date-only"] small')).not.toContainText(':');
 await expect(modal.locator('[data-id="act_date-only"] small')).toContainText('2026');
});

// Nearby: optional foreground browser location with local, city-based fixtures.
test('Nearby GPS: asks only on click and filters posts Stories and Reel previews',async({browser})=>{
 const ctx=await browser.newContext({geolocation:{latitude:45.4642,longitude:9.19},permissions:['geolocation']});const page=await ctx.newPage();
 try{
  await page.addInitScript(()=>{localStorage.setItem('illyrian_demo_ui_language_v1','sq');window.nearCalls=0;const original=navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);navigator.geolocation.getCurrentPosition=(...args)=>{window.nearCalls++;return original(...args)}});
  await openDemo(page,390,844);expect(await page.evaluate(()=>window.nearCalls)).toBe(0);
  await page.locator('#screen > .filters [data-act="feed"][data-val="Afër teje"]').click();
  await expect(page.locator('#near-status')).toHaveAttribute('data-status','ready');
  expect(await page.evaluate(()=>window.nearCalls)).toBe(1);
  await expect(page.locator('#screen > .post')).toHaveCount(1);await expect(page.locator('#screen > .post')).toContainText('Leon M.');
  await expect(page.locator('#screen .stories [data-act="story"]')).toHaveCount(1);await expect(page.locator('#screen .stories [data-act="story"]')).toHaveAttribute('data-val','2');
  await expect(page.locator('#screen .stories [data-act="near-open-reel"]')).toHaveCount(1);
  await page.locator('#screen .stories [data-act="story"]').click();await page.locator('[data-act="nextStory"]').click();await expect(page.locator('.story-overlay')).toHaveCount(0);
  await page.locator('#screen .stories [data-act="near-open-reel"]').click();await page.locator('[data-act="reel-next"]').click();await expect(page.locator('.v4-reel-counter')).toHaveText('1 / 1');
  await page.keyboard.press('Escape');
  const storage=await page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)])));expect(JSON.stringify(storage)).not.toContain('45.4642');expect(JSON.stringify(storage)).not.toContain('9.19');
 }finally{await ctx.close()}
});
test('Nearby GPS: a pending response cannot override a manual city',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('illyrian_demo_ui_language_v1','sq');Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok){window.nearSuccess=ok}}})});
 await openDemo(page,390,844);await page.locator('#screen > .filters [data-act="feed"][data-val="Afër teje"]').click();
 await expect(page.locator('#near-status')).toHaveAttribute('data-status','loading');
 await page.locator('#v9-near-city').selectOption('Romë');await page.evaluate(()=>window.nearSuccess({coords:{latitude:45.4642,longitude:9.19,accuracy:10}}));
 await expect(page.locator('#near-status')).toHaveAttribute('data-status','manual');await expect(page.locator('#screen > .post')).toHaveCount(1);await expect(page.locator('#screen > .post')).toContainText('Besa H.');
});
test('Nearby GPS: blocked or muted city content does not leave a blank feed',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('illyrian_demo_ui_language_v1','sq');localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({blocked:['leon']}))});
 await openDemo(page,390,844);await page.locator('.ily-compose-city').click();await page.locator('#v9-near-city').selectOption('Milano');
 await expect(page.locator('#screen > .post')).toHaveCount(0);await expect(page.locator('#screen > .empty')).toBeVisible();await expect(page.locator('#screen .stories [data-act="story"]')).toHaveCount(0);
});
for(const [code,status] of [[1,'denied'],[2,'unavailable'],[3,'timeout']])test('Nearby GPS: permission or acquisition failure keeps manual city usable '+status,async({page})=>{
 await page.addInitScript(code=>{localStorage.setItem('illyrian_demo_ui_language_v1','sq');window.geoAttempts=0;Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok,fail){window.geoAttempts++;fail({code})}}})},code);
 await openDemo(page,390,844);expect(await page.evaluate(()=>window.geoAttempts)).toBe(0);
 await page.locator('#screen > .filters [data-act="feed"][data-val="Afër teje"]').click();await expect(page.locator('#near-status')).toHaveAttribute('data-status',status);
 await page.locator('#v9-near-city').selectOption('Romë');await expect(page.locator('#screen > .post')).toContainText('Besa H.');expect(await page.evaluate(()=>window.geoAttempts)).toBe(1);
});
test('Nearby GPS: outside sample cities stays empty and global Reels stay global',async({browser})=>{
 const ctx=await browser.newContext({geolocation:{latitude:42.6589,longitude:13.7044},permissions:['geolocation']});const page=await ctx.newPage();
 try{
  await openDemo(page,390,844);await page.locator('#screen > .filters [data-val="Afër teje"]').click();await expect(page.locator('#near-status')).toHaveAttribute('data-status','ready');
  await expect(page.locator('#screen > .post')).toHaveCount(0);await expect(page.locator('#screen .stories [data-act="story"]')).toHaveCount(0);await expect(page.locator('#screen .stories .story-reel-preview')).toHaveCount(0);await expect(page.locator('#screen > .empty')).toBeVisible();
  await page.locator('#navbar [data-act="open-reels"]').click();await expect(page.locator('.v4-reel-counter')).toHaveText('1 / 3');await page.keyboard.press('Escape');
 }finally{await ctx.close()}
});
test('Nearby GPS: manual discovery and reload never ask for location',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('illyrian_demo_ui_language_v1','sq');window.geoAttempts=0;Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(){window.geoAttempts++;throw Error('No automatic GPS')}}})});
 await openDemo(page,390,844);await page.locator('.ily-compose-city').click();
 for(const [city,story] of [['Milano','2'],['Romë','3'],['Tiranë','1'],['Berlin','4'],['Prishtinë',null]]){
  await page.locator('#v9-near-city').selectOption(city);
  const stories=page.locator('#screen .stories [data-act="story"]');await expect(stories).toHaveCount(story?1:0);if(story)await expect(stories).toHaveAttribute('data-val',story);
 }
 await page.reload();await expect(page.locator('#v9-near-city')).toHaveValue('Prishtinë');expect(await page.evaluate(()=>window.geoAttempts)).toBe(0);
 await page.locator('#screen > .filters [data-val="Për ty"]').click();await expect(page.locator('#screen .stories [data-act="story"]')).toHaveCount(4);
});
test('Nearby GPS: revocation clears GPS city and late callbacks after leaving are ignored',async({page})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('illyrian_demo_ui_language_v1','sq');localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({v9NearCity:'Romë'}));window.geoAttempts=0;
  Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok){window.geoAttempts++;window.nearSuccess=ok;ok({coords:{latitude:45.4642,longitude:9.19,accuracy:20}})}}});
  Object.defineProperty(navigator,'permissions',{configurable:true,value:{query:async()=>({state:'granted',addEventListener(type,fn){window.revokeNear=()=>{this.state='denied';fn()}},removeEventListener(){}})}});
 });
 await openDemo(page,390,844);await page.locator('#screen > .filters [data-val="Afër teje"]').click();await expect(page.locator('#near-status')).toHaveAttribute('data-status','ready');
 await expect.poll(()=>page.evaluate(()=>typeof window.revokeNear)).toBe('function');await page.evaluate(()=>window.revokeNear());
 await expect(page.locator('#near-status')).toHaveAttribute('data-status','denied');await expect(page.locator('#screen > .post')).toContainText('Besa H.');
 await page.locator('#screen > .filters [data-val="Për ty"]').click();await page.evaluate(()=>window.nearSuccess({coords:{latitude:45.4642,longitude:9.19,accuracy:20}}));
 await expect(page.locator('#near-status')).toHaveCount(0);expect(await page.evaluate(()=>window.IllyrianNearby.state())).toEqual({status:'manual',city:null});
});
for(const [lang,title] of [['sq','Afër teje'],['en','Near you'],['it','Vicino a te']])test('Nearby GPS: localized panel and transient city do not alter profile '+lang,async({page})=>{
 await page.addInitScript(lang=>{localStorage.setItem('illyrian_demo_ui_language_v1',lang);localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({profile:{name:'LOCAL OWNER',bio:'literal DEMO'},v9NearCity:'Romë'}));Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok){ok({coords:{latitude:45.4642,longitude:9.19,accuracy:20}})}}})},lang);
 await openDemo(page,390,844);const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await page.locator('#screen > .filters [data-val="Afër teje"]').click();await expect(page.locator('.near-panel')).toHaveAttribute('aria-label',title);await expect(page.locator('#near-status')).toContainText('Milano');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
 await page.reload();expect(await page.evaluate(()=>window.IllyrianNearby.state())).toEqual({status:'manual',city:null});
});
test('Nearby GPS: permission revoked before observation never leaves a GPS city active',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('illyrian_demo_ui_language_v1','sq');Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok){ok({coords:{latitude:45.4642,longitude:9.19,accuracy:10}})}}});Object.defineProperty(navigator,'permissions',{configurable:true,value:{query:async()=>({state:'denied',addEventListener(){},removeEventListener(){}})}})});
 await openDemo(page,390,844);await page.locator('#screen > .filters [data-val="Afër teje"]').click();await expect(page.locator('#near-status')).toHaveAttribute('data-status','denied');
 expect(await page.evaluate(()=>window.IllyrianNearby.state().city)).toBeNull();
});
for(const [coords,status] of [[{latitude:NaN,longitude:9.19,accuracy:10},'unavailable'],[{latitude:45.4642,longitude:9.19,accuracy:100000},'imprecise']])test('Nearby GPS: unusable coordinates have honest fallback '+status,async({page})=>{
 await page.addInitScript(({coords})=>{Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok){ok({coords})}}})},{coords});
 await openDemo(page,390,844);await page.locator('#screen > .filters [data-val="Afër teje"]').click();await expect(page.locator('#near-status')).toHaveAttribute('data-status',status);await expect(page.locator('#v9-near-city')).toBeEnabled();
});
test('Nearby GPS: unavailable API and bfcache restore never start automatic acquisition',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'geolocation',{configurable:true,value:undefined})});
 await openDemo(page,390,844);await page.locator('#screen > .filters [data-val="Afër teje"]').click();await expect(page.locator('#near-status')).toHaveAttribute('data-status','unsupported');
 await page.locator('#v9-near-city').selectOption('Romë');await page.evaluate(()=>{dispatchEvent(new Event('pagehide'));dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))});
 await expect(page.locator('#near-status')).toHaveAttribute('data-status','manual');await expect(page.locator('#screen > .post')).toContainText('Besa H.');
});
test('Nearby GPS: resolving while a composer is open preserves the draft',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok){window.nearSuccess=ok}}})});
 await openDemo(page,390,844);await page.locator('#screen > .filters [data-val="Afër teje"]').click();await page.locator('.compose-prompt').click();
 await page.locator('#v5-text').fill('UNCHANGED DRAFT');await page.evaluate(()=>window.nearSuccess({coords:{latitude:45.4642,longitude:9.19,accuracy:10}}));
 await expect(page.locator('#v5-text')).toHaveValue('UNCHANGED DRAFT');await page.keyboard.press('Escape');await expect(page.locator('#near-status')).toHaveAttribute('data-status','ready');
});
for(const [width,height] of [[320,568],[390,844],[844,390]])for(const theme of ['light','dark'])test('Nearby GPS: responsive panel '+width+'x'+height+' '+theme,async({page},testInfo)=>{
 await page.addInitScript(theme=>{localStorage.setItem('illyrian_demo_ui_language_v1','sq');localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({theme}));Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok){ok({coords:{latitude:45.4642,longitude:9.19,accuracy:10}})}}})},theme);
 await openDemo(page,width,height);await page.locator('#screen > .filters [data-val="Afër teje"]').click();const panel=page.locator('.near-panel');
 expect(await panel.evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);await expect(panel.locator('[data-act="near-gps"]')).toBeVisible();await expect(panel.locator('#v9-near-city')).toBeVisible();
 if(width===390)await page.locator('#phone').screenshot({path:testInfo.outputPath('nearby-'+theme+'.png')});
 await page.locator('#v9-near-city').focus();await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement!==document.body)).toBe(true);
});
test('Nearby GPS: Story autoplay exits the filtered sequence and hidden pages clear the city',async({page})=>{
 await page.clock.install();await page.addInitScript(()=>{Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(ok){ok({coords:{latitude:45.4642,longitude:9.19,accuracy:10}})}}})});
 await openDemo(page,390,844);await page.locator('#screen > .filters [data-val="Afër teje"]').click();await page.locator('#screen .stories [data-act="story"]').click();
 await page.clock.fastForward(8100);await expect(page.locator('.story-overlay')).toHaveCount(0);
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'))});
 expect(await page.evaluate(()=>window.IllyrianNearby.state())).toEqual({status:'manual',city:null});
 await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});document.dispatchEvent(new Event('visibilitychange'))});await expect(page.locator('#near-status')).toHaveAttribute('data-status','manual');
});
test('Nearby GPS: requesting from the GPS button preserves keyboard context while loading',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(){}}})});
 await openDemo(page,390,844);await page.locator('.ily-compose-city').click();await page.locator('[data-act="near-gps"]').click();
 await expect(page.locator('#screen > .filters [data-val="Afër teje"]')).toBeFocused();
});

// Owner-authorized Home audit corrections: real local-state and UI behavior.
async function openHomeAudit(page){await page.addInitScript(()=>{if(!localStorage.getItem('illyrian_demo_ui_language_v1'))localStorage.setItem('illyrian_demo_ui_language_v1','sq')});await openDemo(page,390,844)}

for(const action of ['like','save','hide-post'])test('Home audit: stale '+action+' preserves another window comment',async({page,context})=>{
 await openHomeAudit(page);
 if(action==='hide-post')await page.locator('#screen [data-act="postmore"][data-id="p1"]').click();
 const other=await context.newPage();await openDemo(other,390,844);
 await other.locator('#screen [data-act="comments"][data-id="p1"]').click();await other.locator('#comment-input').fill('Komenti i dritares tjetër');await other.locator('[data-act="send-comment"]').click();
 const before=await other.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await page.locator('[data-act="'+action+'"][data-id="p1"]').click();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await expect(page.locator('#toast-area')).toContainText(/ndrysh|changed|cambiat/i);
});

for(const action of ['like','save','hide-post'])test('Home audit: quota failure rolls back '+action+' and permits retry',async({page})=>{
 await openHomeAudit(page);
 await page.evaluate(()=>{const original=Storage.prototype.setItem;window.auditRestoreStorage=()=>Storage.prototype.setItem=original;Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Full','QuotaExceededError');return original.call(this,k,v)}});
 if(action==='hide-post')await page.locator('#screen [data-act="postmore"][data-id="p1"]').click();
 const button=page.locator('[data-act="'+action+'"][data-id="p1"]');await button.click();
 await expect(page.locator('#toast-area')).toContainText(/nuk u ruajt/i);
 if(action==='hide-post')await expect(page.locator('#layer [data-act="hide-post"]')).toBeVisible();
 else await expect(button).toHaveAttribute('aria-pressed','false');
 await page.evaluate(()=>window.auditRestoreStorage());await button.click();
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')));
 expect(stored[action==='like'?'likes':action==='save'?'bookmarks':'hiddenPosts']).toContain('p1');
 await page.reload();if(action==='hide-post')await expect(page.locator('#screen [data-act="postmore"][data-id="p1"]')).toHaveCount(0);else await expect(button).toHaveAttribute('aria-pressed','true');
});

for(const [action,detail,id,message] of [
 ['market-contact','market-detail','m1','Kërkesë për një shërbim'],
 ['business-contact','business-detail','b1','Kontakti me biznesin u simulua']
])test('Mundësi simulated '+action+' keeps the log intact on quota and stale writes',async({page})=>{
 await openDemo(page,390,844);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-val="explore"]').click();
 const open=async()=>{
  await page.locator('#screen [data-act="'+detail+'"][data-id="'+id+'"]').click();
  await expect(page.locator('#layer [data-act="'+action+'"][data-id="'+id+'"]')).toBeVisible();
 };
 await open();
 const button=page.locator('#layer [data-act="'+action+'"][data-id="'+id+'"]'),key='illyrian_demo_v09_state';
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(()=>{
  window.__contactSet=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){
   if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');
   return window.__contactSet.call(this,k,v);
  };
 });
 await button.click();
 await expect(page.locator('#toast-area')).toContainText(/nuk u ruajt/i);
 await expect(button).toBeVisible();
 await expect(button).toBeFocused();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__contactSet;delete window.__contactSet});
 const updated=await page.evaluate(k=>{
  const saved=JSON.parse(localStorage.getItem(k)||'{}');
  saved.comments={...saved.comments,p1:['Simulated contact from other tab']};
  const raw=JSON.stringify(saved);
  localStorage.setItem(k,raw);
  return raw;
 },key);
 await button.click();
 await expect(button).toBeVisible();
 await expect(button).toBeFocused();
 await expect(page.locator('#toast-area')).toContainText(/ndrysh|changed|cambiat/i);
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(updated);
 await page.reload({waitUntil:'load'});
 await page.locator('#navbar [data-val="explore"]').click();
 await open();
 await button.click();
 const stored=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(stored.comments.p1).toEqual(['Simulated contact from other tab']);
 expect(stored.activityLog.filter(x=>x.text===message)).toHaveLength(1);
 await expect(button).toBeVisible();
 await page.reload({waitUntil:'load'});
 const restored=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(restored.activityLog.filter(x=>x.text===message)).toHaveLength(1);
});

test('Story pause and resume keep an unsent reply without writing core storage',async({page})=>{
 await openHomeAudit(page);
 await page.locator('#screen .stories [data-act="story"][data-val="1"]').click();
 const reply=page.locator('#v6-story-message'),toggle=page.locator('#layer [data-act="v6-story-pause"]');
 const progress=page.locator('#layer .v6-story-progress');
 await expect(toggle).toBeVisible();
 await reply.fill('Ky tekst nuk duhet të humbasë');
 // Typing automatically pauses the timer before the user clicks the control.
 await expect(toggle).toContainText('Vazhdo');
 await expect(progress.locator('span.current > i')).toHaveCSS('animation-play-state','paused');
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await toggle.click();
 await expect(toggle).toContainText('Ndalo');
 await expect(toggle).toBeFocused();
 await expect(reply).toHaveValue('Ky tekst nuk duhet të humbasë');
 await expect(progress).not.toHaveClass(/paused/);
 await toggle.click();
 await expect(toggle).toContainText('Vazhdo');
 await expect(toggle).toBeFocused();
 await expect(reply).toHaveValue('Ky tekst nuk duhet të humbasë');
 await expect(progress).toHaveClass(/paused/);
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
});

test('Story controls localize live in sq/en/it with preserved reply and core state',async({page})=>{
 await openHomeAudit(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#screen .stories [data-act="story"][data-val="1"]').click();
 const reply=page.locator('#v6-story-message'),like=page.locator('#layer [data-act="v6-story-like"][data-id="arta"]'),toggle=page.locator('#layer [data-act="v6-story-pause"]');
 await reply.fill('Draft që nuk përkthehet');
 await expect(toggle).toContainText('Vazhdo');
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 const cases=[
  ['sq','Përgjigju Story','Përgjigju Story...','Dërgo përgjigjen','Pëlqe Story','Vazhdo'],
  ['en','Reply to Story','Reply to Story...','Send reply','Like Story','Resume'],
  ['it','Rispondi alla storia','Rispondi alla storia...','Invia risposta','Metti Mi piace alla storia','Riprendi']
 ];
 for(const [lang,label,placeholder,send,liked,resume] of cases){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(reply).toHaveAttribute('aria-label',label);
  await expect(reply).toHaveAttribute('placeholder',placeholder);
  await expect(page.locator('#layer [data-act="v6-story-send"]')).toHaveAttribute('aria-label',send);
  await expect(like).toHaveAttribute('aria-label',liked);
  await expect(like).toHaveAttribute('aria-pressed','false');
  await expect(toggle).toContainText(resume);
  await expect(reply).toHaveValue('Draft që nuk përkthehet');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 }
 await toggle.click();
 await expect(toggle).toContainText('Pausa');
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await expect(toggle).toContainText('Pause');
 await toggle.click();
 await expect(toggle).toContainText('Resume');
 await expect(reply).toHaveValue('Draft që nuk përkthehet');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
});

test('Story reply feedback localizes in sq/en/it without a false send or core mutation',async({page})=>{
 await openHomeAudit(page);
 await page.locator('#screen .stories [data-act="story"][data-val="1"]').click();
 const reply=page.locator('#v6-story-message'),send=page.locator('#layer [data-act="v6-story-send"]'),toast=page.locator('#toast-area');
 await expect(toast).toHaveAttribute('role','status');
 await expect(toast).toHaveAttribute('aria-live','polite');
 await expect(toast).toHaveAttribute('aria-atomic','true');
 const key='illyrian_demo_v09_state';
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 for(const [lang,empty] of [['sq','Shkruaj përgjigjen'],['en','Write a reply'],['it','Scrivi una risposta']]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await send.click();
  await expect(toast).toContainText(empty);
  await expect(reply).toBeVisible();
  await expect(reply).toHaveValue('');
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 }
 await reply.fill('Përgjigjja ime e ruajtur lokalisht');
 await send.click();
 await expect(toast).toContainText('Risposta salvata solo nella conversazione su questo dispositivo');
 await expect(page.locator('#layer #v6-chat-scroll')).toBeVisible();
 const saved=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(saved.messages.arta).toContain('↪ Story: Përgjigjja ime e ruajtur lokalisht');
});

test('Story send keeps unsent reply and another tab data intact on quota and stale writes',async({page})=>{
 await openHomeAudit(page);
 const key='illyrian_demo_v09_state',draft='Përgjigje e papërfunduar nga Story';
 const openStory=async()=>{
  await page.locator('#screen .stories [data-act="story"][data-val="1"]').click();
  await expect(page.locator('#v6-story-message')).toBeVisible();
 };
 await openStory();
 const reply=page.locator('#v6-story-message'),send=page.locator('#layer [data-act="v6-story-send"]');
 await reply.fill(draft);
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(()=>{
  window.__storySendOriginal=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){
   if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');
   return window.__storySendOriginal.call(this,k,v);
  };
 });
 await send.click();
 await expect(page.locator('#toast-area')).toContainText(/nuk u ruajt/i);
 await expect(reply).toHaveValue(draft);
 await expect(reply).toBeFocused();
 await expect(send).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__storySendOriginal;delete window.__storySendOriginal});
 const newer=await page.evaluate(k=>{
  const data=JSON.parse(localStorage.getItem(k)||'{}');
  data.comments={...data.comments,p1:['other tab story send check']};
  const raw=JSON.stringify(data);localStorage.setItem(k,raw);return raw;
 },key);
 await send.click();
 await expect(page.locator('#toast-area')).toContainText(/ndrysh|changed|cambiat/i);
 await expect(reply).toHaveValue(draft);
 await expect(reply).toBeFocused();
 await expect(send).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(newer);
 await page.reload({waitUntil:'load'});
 await openStory();
 await reply.fill(draft);
 await send.click();
 await expect(page.locator('#layer #v6-chat-scroll')).toBeVisible();
 await expect(page.locator('#toast-area')).toContainText('Përgjigjja u ruajt vetëm në bisedë në këtë pajisje');
 const saved=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(saved.comments.p1).toEqual(['other tab story send check']);
 expect(saved.messages.arta.filter(text=>text==='↪ Story: '+draft)).toHaveLength(1);
});

test('Story like preserves unsent reply and does not claim a failed local save',async({page})=>{
 await openHomeAudit(page);
 const key='illyrian_demo_v09_state';
 const openStory=async()=>{
  await page.locator('#screen .stories [data-act="story"][data-val="1"]').click();
  await expect(page.locator('#layer [data-act="v6-story-like"][data-id="arta"]')).toBeVisible();
 };
 await openStory();
 const like=page.locator('#layer [data-act="v6-story-like"][data-id="arta"]');
 await expect(like).toHaveAttribute('aria-pressed','false');
 const reply=page.locator('#v6-story-message');
 await reply.fill('Përgjigjja ime pa dërguar');
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(()=>{
  window.__storyLikeSet=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){
   if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');
   return window.__storyLikeSet.call(this,k,v);
  };
 });
 await like.click();
 await expect(page.locator('#toast-area')).toContainText(/nuk u ruajt/i);
 await expect(like).toBeVisible();
 await expect(like).toBeFocused();
 await expect(like).not.toHaveClass(/liked/);
 await expect(like).toHaveAttribute('aria-pressed','false');
 await expect(reply).toHaveValue('Përgjigjja ime pa dërguar');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__storyLikeSet;delete window.__storyLikeSet});
 const newer=await page.evaluate(k=>{
  const s=JSON.parse(localStorage.getItem(k)||'{}');
  s.comments={...s.comments,p1:['other tab story check']};
  const raw=JSON.stringify(s);
  localStorage.setItem(k,raw);
  return raw;
 },key);
 await like.click();
 await expect(like).toHaveAttribute('aria-pressed','false');
 await expect(page.locator('#toast-area')).toContainText(/ndrysh|changed|cambiat/i);
 await expect(reply).toHaveValue('Përgjigjja ime pa dërguar');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(newer);
 await page.reload({waitUntil:'load'});
 await openStory();
 await reply.fill('Përgjigjja ime pa dërguar');
 await like.click();
 await expect(like).toHaveClass(/liked/);
 await expect(like).toHaveAttribute('aria-pressed','true');
 await expect(like).toBeFocused();
 await expect(reply).toHaveValue('Përgjigjja ime pa dërguar');
 const saved=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(saved.v6StoryLikes).toContain('arta');
 expect(saved.comments.p1).toEqual(['other tab story check']);
 await page.reload({waitUntil:'load'});
 await openStory();
 await expect(like).toHaveClass(/liked/);
 await expect(like).toHaveAttribute('aria-pressed','true');
 await like.click();
 await expect(like).toHaveAttribute('aria-pressed','false');
 await expect(like).toBeFocused();
});

test('Feed post report preserves modal on quota and stale storage, then saves locally',async({page})=>{
 await openHomeAudit(page);
 const key='illyrian_demo_v09_state';
 const openReport=async()=>{
  await page.locator('#screen [data-act="postmore"][data-id="p1"]').click();
  await expect(page.locator('#layer [data-act="report-post"][data-id="p1"]')).toBeVisible();
 };
 await openReport();
 const report=page.locator('#layer [data-act="report-post"][data-id="p1"]');
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(()=>{
  window.__reportSet=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){
   if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');
   return window.__reportSet.call(this,k,v);
  };
 });
 await report.click();
 await expect(page.locator('#toast-area')).toContainText('Ndryshimi nuk u ruajt');
 await expect(report).toBeVisible();
 await expect(report).toBeFocused();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__reportSet;delete window.__reportSet});
 const newer=await page.evaluate(k=>{
  const data=JSON.parse(localStorage.getItem(k)||'{}');
  data.comments={...data.comments,p1:['other tab report check']};
  const raw=JSON.stringify(data);
  localStorage.setItem(k,raw);
  return raw;
 },key);
 await report.click();
 await expect(report).toBeVisible();
 await expect(report).toBeFocused();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(newer);
 await page.reload({waitUntil:'load'});
 await openReport();
 await report.click();
 await expect(report).toHaveCount(0);
 await expect(page.locator('#toast-area')).toContainText('Raportim, jo real');
 const saved=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(saved.reports).toContain('p1');
 expect(saved.activityLog.filter(x=>x.text==='Raportim lokal — nuk është dërguar')).toHaveLength(1);
 expect(saved.comments.p1).toEqual(['other tab report check']);
 await page.reload({waitUntil:'load'});
 const reloaded=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(reloaded.reports).toContain('p1');
});

test('Home audit: blocked and muted actors disappear from Stories and Reel navigation',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({blocked:['arta'],muted:['leon']})));
 await openHomeAudit(page);
 await expect(page.locator('#screen .stories [data-act="story"]')).toHaveText(['Besa','Dion']);
 await expect(page.locator('#screen .story-reel-preview')).toHaveCount(1);
 await page.locator('#screen .stories [data-act="story"][data-val="3"]').click();
 await page.locator('[data-act="prevStory"]').click();await expect(page.locator('.story-user')).toContainText('Besa');
 await page.locator('[data-act="nextStory"]').click();await expect(page.locator('.story-user')).toContainText('Dion');
 await page.keyboard.press('Escape');await page.locator('#navbar [data-act="open-reels"]').click();
 await expect(page.locator('.v4-reel-footer')).toContainText('Besa');await page.locator('[data-act="reel-next"]').click();await expect(page.locator('.v4-reel-footer')).toContainText('Besa');
});

test('Home audit: all hidden posts show empty state in For you and Following',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({hiddenPosts:['p1','p2','p3'],follows:['arta','leon','besa']})));
 await openHomeAudit(page);await expect(page.locator('#screen > .empty')).toBeVisible();
 await page.locator('[data-feed-key="feedFollowing"]').click();await expect(page.locator('#screen > .empty')).toBeVisible();
});

for(const action of ['like','save'])test('Home audit: '+action+' retains keyboard focus and announces toggled state',async({page})=>{
 await openHomeAudit(page);const button=page.locator('#screen [data-act="'+action+'"][data-id="p1"]');
 await button.focus();await page.keyboard.press('Enter');await expect(button).toBeFocused();await expect(button).toHaveAttribute('aria-pressed','true');
 await page.keyboard.press('Enter');await expect(button).toBeFocused();await expect(button).toHaveAttribute('aria-pressed','false');
});

for(const lang of ['sq','en','it'])test('Home audit: historical personal date ages without rewriting storage '+lang,async({page})=>{
 await page.clock.install({time:new Date('2026-11-01T12:00:00Z')});
 await page.addInitScript(lang=>{localStorage.setItem('illyrian_demo_ui_language_v1',lang);localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({posts:[{id:'my1792929600000',name:'Owner',ava:'a1',city:'Tiranë',when:'Tani',text:'One week ago',img:null,likes:0,comments:0,share:0}],historicalUnknown:'keep'}))},lang);
 await openHomeAudit(page);const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 const label=page.locator('#screen > .post').first().locator('.post-h .small');await expect(label).not.toContainText(/Tani|Now|Adesso|Ora ·/);
 await expect(label).toContainText(/25|10|2026/);expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
});

test('Home audit: live language change refreshes personal dates without touching draft',async({page})=>{
 await page.clock.install({time:new Date('2026-11-01T12:00:00Z')});
 await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({posts:[{id:'my1793529000000',name:'Owner',ava:'a1',city:'Tiranë',when:'Tani',text:'An hour ago',img:null,likes:0,comments:0,share:0}]})));
 await openHomeAudit(page);const label=page.locator('#screen > .post .post-time').first();await expect(label).toContainText('orë');
 await page.locator('.compose-prompt').click();await page.locator('#v5-text').fill('Draft i papërfunduar');
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));await expect(label).toHaveText('1 hour ago');await expect(page.locator('#v5-text')).toHaveValue('Draft i papërfunduar');
});

test('Home audit: own post is not attributed to a blocked fixture with the same name',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({blocked:['arta','leon','besa','dion'],posts:[{id:'my1792929600000',name:'Arta K.',ava:'a1',city:'Tiranë',when:'Tani',text:'My own content',img:null,likes:0,comments:0,share:0}]})));
 await openHomeAudit(page);await expect(page.locator('#screen > .post')).toHaveCount(1);await expect(page.locator('#screen > .post')).toContainText('My own content');await expect(page.locator('#screen > .post .post-name[data-act="user-profile"]')).toHaveCount(0);
});

for(const lang of ['sq','en','it'])test('Home audit: all unavailable Reels have a closable localized empty state '+lang,async({page})=>{
 await page.addInitScript(lang=>{localStorage.setItem('illyrian_demo_ui_language_v1',lang);localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({blocked:['arta','leon','besa'],muted:['dion']}))},lang);
 await openHomeAudit(page);await page.locator('#navbar [data-act="open-reels"]').click();
 await expect(page.locator('#layer .empty')).toHaveText({sq:'Nuk ka Reels të disponueshme.',en:'No Reels are available.',it:'Nessun Reel disponibile.'}[lang]);
 await page.keyboard.press('Escape');await expect(page.locator('#layer .modal')).toHaveCount(0);await expect(page.locator('#navbar [data-act="open-reels"]')).toBeFocused();
});


test('Messages: a stale inbox read does not overwrite another tab or show a false read',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();
 const row=page.locator('#v6-inbox-list [data-act="v6-openchat"][data-id="leon"]');
 await expect(row).toHaveAttribute('data-v6-unread','1');
 const updated=await page.evaluate(()=>{
  const key='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(key)||'{}');
  s.v6ReadChats=['dion'];s.v9RecentQueries=['other-tab-update'];
  const raw=JSON.stringify(s);localStorage.setItem(key,raw);return raw;
 });
 await row.click();
 await expect(row).toBeVisible();
 await expect(row).toHaveAttribute('data-v6-unread','1');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(updated);
});

test('Messages: failed read persistence keeps unread state, then retry survives reload',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();
 const row=page.locator('#v6-inbox-list [data-act="v6-openchat"][data-id="leon"]');
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await page.evaluate(()=>{
  window.__messageOriginalSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota exceeded','QuotaExceededError');return window.__messageOriginalSetItem.call(this,k,v)};
 });
 await row.click();
 await expect(row).toHaveAttribute('data-v6-unread','1');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__messageOriginalSetItem;delete window.__messageOriginalSetItem});
 await row.click();
 await expect(page.locator('#v6-chat-scroll')).toBeVisible();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).v6ReadChats)).toContain('leon');
 await page.locator('#layer [data-act="v6-back-inbox"]').click();
 await expect(page.locator('#v6-inbox-list [data-id="leon"]')).toHaveAttribute('data-v6-unread','0');
 await openDemo(page,390,844);
 await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();
 await expect(page.locator('#v6-inbox-list [data-id="leon"]')).toHaveAttribute('data-v6-unread','0');
});

test('Messages: group chat rejects stale local data and retains its draft',async({page})=>{
 await page.addInitScript(()=>{
  const key='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(key)||'{}');
  s.acceptedPlans=['e1'];localStorage.setItem(key,JSON.stringify(s));
 });
 await openDemo(page,390,844);
 await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();
 await page.locator('[data-act="v6-inbox-filter"][data-val="groups"]').click();
 await page.locator('#v6-inbox-list [data-act="group-chat"][data-id="e1"]').click();
 const draft=page.locator('#group-input');
 await draft.fill('Draft that must not overwrite new data');
 const updated=await page.evaluate(()=>{
  const key='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(key)||'{}');
  s.groupMessages={e1:['Changed in another tab']};
  const raw=JSON.stringify(s);localStorage.setItem(key,raw);return raw;
 });
 await page.locator('#layer [data-act="group-send"][data-id="e1"]').click();
 await expect(draft).toHaveValue('Draft that must not overwrite new data');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(updated);
});

test('Messages: group chat quota error rolls back and retries without duplicate send',async({page})=>{
 await page.addInitScript(()=>{
  const key='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(key)||'{}');
  s.acceptedPlans=['e1'];localStorage.setItem(key,JSON.stringify(s));
 });
 await openDemo(page,390,844);
 await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();
 await page.locator('[data-act="v6-inbox-filter"][data-val="groups"]').click();
 await page.locator('#v6-inbox-list [data-act="group-chat"][data-id="e1"]').click();
 const draft=page.locator('#group-input');
 await draft.fill('One local message after retry');
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await page.evaluate(()=>{
  window.__messageOriginalSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota exceeded','QuotaExceededError');return window.__messageOriginalSetItem.call(this,k,v)};
 });
 await page.locator('#layer [data-act="group-send"][data-id="e1"]').click();
 await expect(draft).toHaveValue('One local message after retry');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__messageOriginalSetItem;delete window.__messageOriginalSetItem});
 await page.locator('#layer [data-act="group-send"][data-id="e1"]').click();
 await expect(page.locator('#groupchat')).toContainText('One local message after retry');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).groupMessages.e1)).toEqual(['One local message after retry']);
});


for(const action of ['reel-like','reel-save']){
 const field=action==='reel-like'?'reelLikes':'reelSaved';
 test('Reels audit: '+action+' announces state, retains focus and persists across reload',async({page})=>{
  await openDemo(page,390,844);await openReels(page);
  let button=page.locator('#layer .v4-reel-overlay [data-act="'+action+'"]');
  await expect(button).toHaveAttribute('aria-pressed','false');
  await button.focus();await page.keyboard.press('Enter');
  await expect(button).toBeFocused();await expect(button).toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(field=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state'))[field],field)).toContain('r1');
  await page.reload({waitUntil:'load'});await openReels(page);
  button=page.locator('#layer .v4-reel-overlay [data-act="'+action+'"]');
  await expect(button).toHaveAttribute('aria-pressed','true');
  await button.focus();await page.keyboard.press('Enter');
  await expect(button).toBeFocused();await expect(button).toHaveAttribute('aria-pressed','false');
 });
 test('Reels audit: '+action+' quota rollback is honest and Retry saves only once',async({page})=>{
  await openDemo(page,390,844);await openReels(page);
  const button=page.locator('#layer .v4-reel-overlay [data-act="'+action+'"]');
  const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await page.evaluate(()=>{
   window.__reelsOriginalSetItem=Storage.prototype.setItem;
   Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota exceeded','QuotaExceededError');return window.__reelsOriginalSetItem.call(this,k,v)};
  });
  await button.click();await expect(button).toHaveAttribute('aria-pressed','false');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
  await page.evaluate(()=>{Storage.prototype.setItem=window.__reelsOriginalSetItem;delete window.__reelsOriginalSetItem});
  await button.click();await expect(button).toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(field=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state'))[field],field)).toEqual(['r1']);
 });
 test('Reels audit: '+action+' rejects stale writes without overwriting newer local data',async({page})=>{
  await openDemo(page,390,844);await openReels(page);
  const button=page.locator('#layer .v4-reel-overlay [data-act="'+action+'"]');
  const raw=await page.evaluate(()=>{
   const key='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(key)||'{}');
   s.v9RecentQueries=['newer-tab-data'];const updated=JSON.stringify(s);
   localStorage.setItem(key,updated);return updated;
  });
  await button.click();await expect(button).toHaveAttribute('aria-pressed','false');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
 });
}


test('Explore audit: composing text does not detach the input before compositionend',async({page})=>{
 await openDemo(page,390,844);await page.locator('#navbar [data-val="explore"]').click();
 await page.evaluate(()=>{
  const input=document.querySelector('#finder');input.focus();
  window.__finderComposer=input;
  input.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));
  input.value='Besa';
  input.dispatchEvent(new InputEvent('input',{bubbles:true,isComposing:true,data:'Besa'}));
 });
 expect(await page.evaluate(()=>document.querySelector('#finder')===window.__finderComposer)).toBe(true);
 await page.evaluate(()=>window.__finderComposer.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true})));
 await expect(page.locator('#finder')).toHaveValue('Besa');
 await expect(page.locator('#screen [data-act="user-profile"][data-id="besa"]').first()).toBeVisible();
 await expect(page.locator('#finder')).toBeFocused();
});

test('Explore audit: search rerender preserves both selection endpoints and keyboard focus',async({page})=>{
 await openDemo(page,390,844);await page.locator('#navbar [data-val="explore"]').click();
 const finder=page.locator('#finder');
 await expect(finder).toHaveAttribute('aria-label','Kërko në ILLYRIAN');
 await finder.fill('Leon');
 await finder.evaluate(el=>{el.focus();el.setSelectionRange(1,3,'backward');el.dispatchEvent(new InputEvent('input',{bubbles:true}));});
 await expect(finder).toBeFocused();
 expect(await finder.evaluate(el=>({start:el.selectionStart,end:el.selectionEnd,direction:el.selectionDirection}))).toEqual({start:1,end:3,direction:'backward'});
 await expect(page.locator('#screen [data-act="user-profile"][data-id="leon"]').first()).toBeVisible();
});


test('Explore audit: recent query quota failure preserves input and retries once',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="explore"]').click();
 const finder=page.locator('#finder');await finder.fill('Leon');
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await page.evaluate(()=>{
  window.__recentOriginalSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){if(key==='illyrian_demo_v09_state')throw new DOMException('Quota exceeded','QuotaExceededError');return window.__recentOriginalSetItem.call(this,key,value)};
 });
 await finder.press('Enter');
 await expect(finder).toHaveValue('Leon');
 await expect(finder).toBeFocused();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__recentOriginalSetItem;delete window.__recentOriginalSetItem});
 await finder.press('Enter');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).v9RecentQueries)).toEqual(['Leon']);
 await page.reload({waitUntil:'load'});await page.locator('#navbar [data-val="explore"]').click();
 await expect(page.locator('#screen [data-act="v9-query"][data-val="Leon"]')).toBeVisible();
});

test('Explore audit: stale recent search never overwrites another tab',async({page})=>{
 await openDemo(page,390,844);await page.locator('#navbar [data-val="explore"]').click();
 const finder=page.locator('#finder');await finder.fill('Besa');
 const newer=await page.evaluate(()=>{
  const key='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(key)||'{}');
  s.v9RecentQueries=['Another tab'];s.bookmarks=['p2'];
  const raw=JSON.stringify(s);localStorage.setItem(key,raw);return raw;
 });
 await finder.press('Enter');
 await expect(finder).toHaveValue('Besa');await expect(finder).toBeFocused();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(newer);
});

test('Explore audit: Enter confirming IME does not store a recent query',async({page})=>{
 await openDemo(page,390,844);await page.locator('#navbar [data-val="explore"]').click();
 const finder=page.locator('#finder');await finder.fill('Arta');
 const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await finder.evaluate(el=>{
  el.dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));
  el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',isComposing:true,bubbles:true,cancelable:true}));
 });
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
 await finder.evaluate(el=>el.dispatchEvent(new CompositionEvent('compositionend',{bubbles:true})));
 await expect(finder).toHaveValue('Arta');
});


test('Reels audit: saved and liked galleries hide blocked/muted creators without erasing local choices',async({page})=>{
 await page.addInitScript(()=>{
  // Seed only on first load; do not undo the unblock operation during reload.
  if(!localStorage.getItem('illyrian_demo_v09_state'))localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({
   blocked:['arta'],muted:['leon'],reelSaved:['r1','r2','r3'],reelLikes:['r1','r2','r3']
  }));
 });
 await openDemo(page,390,844);
 await page.locator('#navbar [data-val="profile"]').click();
 for(const tab of ['saved','liked']){
  await page.locator('#screen .p17-tabs [data-id="'+tab+'"]').click();
  const items=page.locator('#screen .p17-tile[data-kind="friendReel"]');
  await expect(items).toHaveCount(1);
  await items.first().click();
  await expect(page.locator('#layer .v4-reel-footer')).toContainText('Besa');
  await expect(page.locator('#layer .v4-reel-counter')).toHaveText('1 / 1');
  await page.keyboard.press('Escape');
 }
 const values=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')));
 expect(values.reelSaved).toEqual(['r1','r2','r3']);
 expect(values.reelLikes).toEqual(['r1','r2','r3']);
 await page.evaluate(()=>{
  const key='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(key));
  s.blocked=[];s.muted=[];localStorage.setItem(key,JSON.stringify(s));
 });
 await page.reload({waitUntil:'load'});
 await page.locator('#navbar [data-val="profile"]').click();
 for(const tab of ['saved','liked']){
  await page.locator('#screen .p17-tabs [data-id="'+tab+'"]').click();
  await expect(page.locator('#screen .p17-tile[data-kind="friendReel"]')).toHaveCount(3);
 }
});


test('Reels audit: simulated media disclosure appears once for every built-in Reel',async({page})=>{
 await openDemo(page,390,844);
 await openReels(page);
 for(let i=0;i<3;i++){
  const footer=page.locator('#layer .v4-reel-footer');
  await expect(footer.locator('small').filter({hasText:'Pamje e animuar · jo video reale'})).toHaveCount(1);
  if(i<2)await page.locator('#layer [data-act="reel-next"]').click();
 }
});

test('Five-tab integration: Home, Reels, Messages, Explore and Profile preserve local choices',async({page})=>{
 await openDemo(page,390,844);
 const nav=page.locator('#navbar .v12-tab');
 expect(await nav.evaluateAll(items=>items.map(el=>el.dataset.act==='open-reels'?'reels':el.dataset.val))).toEqual(['home','reels','inbox','explore','profile']);
 const postLike=page.locator('#screen [data-act="like"][data-id="p1"]');
 await postLike.click();await expect(postLike).toHaveAttribute('aria-pressed','true');

 const reels=await openReels(page);
 await reels.locator('[data-act="reel-like"]').click();
 await expect(reels.locator('[data-act="reel-like"]')).toHaveAttribute('aria-pressed','true');
 await reels.locator('[data-act="reel-save"]').click();
 await expect(reels.locator('[data-act="reel-save"]')).toHaveAttribute('aria-pressed','true');
 await reels.locator('[data-act="reel-close"]').click();
 await expect(reels).toHaveCount(0);

 await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();
 const leon=page.locator('#v6-inbox-list [data-act="v6-openchat"][data-id="leon"]');
 await leon.click();await expect(page.locator('#v6-chat-scroll')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('#layer .modal')).toHaveCount(0);

 await page.locator('#navbar [data-val="explore"]').click();
 await expect(page.locator('#navbar [data-val="explore"]')).toHaveAttribute('aria-current','page');
 await page.locator('#finder').fill('Besa');
 await expect(page.locator('#screen [data-act="user-profile"][data-id="besa"]').first()).toBeVisible();

 await page.locator('#navbar [data-val="profile"]').click();
 await expect(page.locator('#screen > .p17-profile')).toBeVisible();
 await page.locator('#screen .p17-tabs [data-id="saved"]').click();
 const saved=page.locator('#screen .p17-tile[data-kind="friendReel"]');
 await expect(saved).toHaveCount(1);
 await saved.click();await expect(page.locator('#layer .v4-reel-footer')).toContainText('Arta');
 await page.keyboard.press('Escape');
 await page.locator('#navbar [data-val="home"]').click();
 await expect(page.locator('#screen [data-act="like"][data-id="p1"]')).toHaveAttribute('aria-pressed','true');

 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')));
 expect(stored.likes).toContain('p1');
 expect(stored.reelLikes).toContain('r1');
 expect(stored.reelSaved).toContain('r1');
 expect(stored.v6ReadChats).toContain('leon');
 await page.reload({waitUntil:'load'});
 await expect(page.locator('#screen [data-act="like"][data-id="p1"]')).toHaveAttribute('aria-pressed','true');
 await page.locator('#navbar [data-val="profile"]').click();
 await page.locator('#screen .p17-tabs [data-id="saved"]').click();
 await expect(page.locator('#screen .p17-tile[data-kind="friendReel"]')).toHaveCount(1);
});


test('Calendar request and cancellation rollback on core quota then retry',async({page})=>{
 await openDemo(page,390,844);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#phone > .head [data-val="events"]').click();
 await page.locator('#screen [data-act="event"][data-id="e1"]').click();
 const key='illyrian_demo_v09_state';
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(()=>{
  window.__calendarWrite=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');return window.__calendarWrite.call(this,k,v)};
 });
 const request=page.locator('#layer [data-act="request"][data-id="e1"]');
 await request.click();
 await expect(page.locator('#toast-area')).toContainText('Ndryshimi nuk u ruajt');
 await expect(request).toBeVisible();
 await expect(request).toBeFocused();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__calendarWrite;delete window.__calendarWrite});
 await request.click();
 await expect(page.locator('#layer [data-act="approve-sim"][data-id="e1"]')).toBeVisible();
 const pending=await page.evaluate(k=>localStorage.getItem(k),key);
 expect(JSON.parse(pending).requests).toContain('e1');
 await page.evaluate(()=>{
  window.__calendarWrite=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');return window.__calendarWrite.call(this,k,v)};
 });
 const cancel=page.locator('#layer [data-act="request"][data-id="e1"]');
 await cancel.click();
 await expect(cancel).toBeVisible();
 await expect(cancel).toBeFocused();
 await expect(page.locator('#layer [data-act="approve-sim"][data-id="e1"]')).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(pending);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__calendarWrite;delete window.__calendarWrite});
 await cancel.click();
 await expect(page.locator('#layer [data-act="approve-sim"][data-id="e1"]')).toHaveCount(0);
 expect(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key)).requests).not.toContain('e1');
 await page.reload({waitUntil:'load'});
 await page.locator('#phone > .head [data-val="events"]').click();
 await page.locator('#screen [data-act="event"][data-id="e1"]').click();
 await expect(page.locator('#layer [data-act="request"][data-id="e1"]')).toBeVisible();
});

test('Calendar simulated approval rejects quota and stale writes, then accepts on retry',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#phone > .head [data-val="events"]').click();
 await page.locator('#screen [data-act="event"][data-id="e2"]').click();
 await page.locator('#layer [data-act="request"][data-id="e2"]').click();
 const key='illyrian_demo_v09_state';
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(()=>{
  window.__calendarWrite=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');return window.__calendarWrite.call(this,k,v)};
 });
 const approve=page.locator('#layer [data-act="approve-sim"][data-id="e2"]');
 await approve.click();
 await expect(approve).toBeVisible();
 await expect(approve).toBeFocused();
 await expect(page.locator('#layer [data-act="group-chat"][data-id="e2"]')).toHaveCount(0);
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__calendarWrite;delete window.__calendarWrite});
 const newer=await page.evaluate(k=>{
  const data=JSON.parse(localStorage.getItem(k));data.comments={...data.comments,p1:['another window']};
  const raw=JSON.stringify(data);localStorage.setItem(k,raw);return raw;
 },key);
 await approve.click();
 await expect(approve).toBeVisible();
 await expect(approve).toBeFocused();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(newer);
 await page.reload({waitUntil:'load'});
 await page.locator('#phone > .head [data-val="events"]').click();
 await page.locator('#screen [data-act="event"][data-id="e2"]').click();
 await page.locator('#layer [data-act="approve-sim"][data-id="e2"]').click();
 await expect(page.locator('#layer [data-act="group-chat"][data-id="e2"]')).toBeVisible();
 const saved=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(saved.acceptedPlans).toContain('e2');
 expect(saved.comments.p1).toEqual(['another window']);
});

test('Calendar scenario lab rolls back quota and stale writes without false status',async({page})=>{
 await openDemo(page,390,844);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 const key='illyrian_demo_v09_state';
 const openLab=async()=>{
  await page.locator('#navbar [data-val="profile"]').click();
  await page.locator('#phone > .head [data-ily-profile-settings]').click();
  await page.locator('#layer [data-act="v8-lab"]').click();
  await expect(page.locator('#layer [data-act="v8-event-scenario"]')).toHaveCount(2);
 };
 await openLab();
 const scenario=page.locator('#layer [data-act="v8-event-scenario"][data-val="e1:full"]');
 const original=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(()=>{
  window.__calendarLabSet=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');return window.__calendarLabSet.call(this,k,v)};
 });
 await scenario.click();
 await expect(scenario).toBeVisible();
 await expect(scenario).toBeFocused();
 await expect(page.locator('#toast-area')).toContainText('Ndryshimi nuk u ruajt');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(original);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__calendarLabSet;delete window.__calendarLabSet});
 await scenario.click();
 await expect(page.locator('#toast-area')).toContainText('Statusi u vendos');
 const full=await page.evaluate(k=>localStorage.getItem(k),key);
 expect(JSON.parse(full).v8EventStatuses.e1).toBe('full');
 const reset=page.locator('#layer [data-act="v8-event-reset"]');
 await page.evaluate(()=>{
  window.__calendarLabSet=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');return window.__calendarLabSet.call(this,k,v)};
 });
 await reset.click();
 await expect(reset).toBeVisible();
 await expect(reset).toBeFocused();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(full);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__calendarLabSet;delete window.__calendarLabSet});
 const newer=await page.evaluate(k=>{
  const saved=JSON.parse(localStorage.getItem(k));
  saved.comments={...saved.comments,p1:['saved by another tab']};
  const raw=JSON.stringify(saved);
  localStorage.setItem(k,raw);
  return raw;
 },key);
 await reset.click();
 await expect(reset).toBeFocused();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(newer);
 await page.reload({waitUntil:'load'});
 await openLab();
 await page.locator('#layer [data-act="v8-event-reset"]').click();
 await expect(page.locator('#toast-area')).toContainText('Statuset u rivendosën');
 const after=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(after.v8EventStatuses).toEqual({});
 expect(after.comments.p1).toEqual(['saved by another tab']);
});

test('Opportunities job application rolls back quota and stale writes, then retries',async({page})=>{
 await openDemo(page,390,844);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-val="explore"]').click();
 await page.locator('#screen [data-act="job-detail"][data-id="j1"]').click();
 const key='illyrian_demo_v09_state';
 const apply=page.locator('#layer [data-act="apply-job"][data-id="j1"]');
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(()=>{
  window.__jobWrite=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');return window.__jobWrite.call(this,k,v)};
 });
 await apply.click();
 await expect(page.locator('#toast-area')).toContainText('Ndryshimi nuk u ruajt');
 await expect(apply).toBeVisible();
 await expect(apply).toBeFocused();
 await expect(apply).toContainText('Provo aplikimin');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__jobWrite;delete window.__jobWrite});
 await apply.click();
 await expect(page.locator('#layer [data-act="apply-job"][data-id="j1"]')).toContainText('Aplikimi u krye');
 let applied=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(applied.applications).toContain('j1');
 expect(applied.activityLog[0].text).toBe('Aplikove për një punë');
 await page.keyboard.press('Escape');
 await page.locator('#screen [data-act="job-detail"][data-id="j2"]').click();
 const stale=await page.evaluate(k=>{
  const record=JSON.parse(localStorage.getItem(k));
  record.comments={...record.comments,p1:['other tab keeps this']};
  const raw=JSON.stringify(record);
  localStorage.setItem(k,raw);
  return raw;
 },key);
 const second=page.locator('#layer [data-act="apply-job"][data-id="j2"]');
 await second.click();
 await expect(second).toBeVisible();
 await expect(second).toBeFocused();
 await expect(second).toContainText('Provo aplikimin');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(stale);
 await page.reload({waitUntil:'load'});
 await page.locator('#navbar [data-val="explore"]').click();
 await page.locator('#screen [data-act="job-detail"][data-id="j2"]').click();
 await page.locator('#layer [data-act="apply-job"][data-id="j2"]').click();
 await expect(page.locator('#layer [data-act="apply-job"][data-id="j2"]')).toContainText('Aplikimi u krye');
 applied=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(applied.applications).toEqual(['j1','j2']);
 expect(applied.comments.p1).toEqual(['other tab keeps this']);
});

test('Opportunities sample market save rolls back quota and stale writes with retry',async({page})=>{
 await openDemo(page,390,844);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-val="explore"]').click();
 await page.locator('#screen [data-act="market-detail"][data-id="m1"]').click();
 const key='illyrian_demo_v09_state',save=page.locator('#layer [data-act="market-save"][data-id="m1"]');
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(()=>{
  window.__marketSet=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');return window.__marketSet.call(this,k,v)};
 });
 await save.click();
 await expect(save).toBeVisible();
 await expect(save).toBeFocused();
 await expect(save).toHaveText('Ruaje ofertën');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__marketSet;delete window.__marketSet});
 await save.click();
 await expect(page.locator('#layer [data-act="market-save"][data-id="m1"]')).toContainText('Ruajtur');
 const saved=await page.evaluate(k=>localStorage.getItem(k),key);
 expect(JSON.parse(saved).marketSaved).toContain('m1');
 const newer=await page.evaluate(k=>{
  const data=JSON.parse(localStorage.getItem(k));data.comments={...data.comments,p1:['independent edit']};
  const raw=JSON.stringify(data);localStorage.setItem(k,raw);return raw;
 },key);
 const remove=page.locator('#layer [data-act="market-save"][data-id="m1"]');
 await remove.click();
 await expect(remove).toBeVisible();
 await expect(remove).toBeFocused();
 await expect(remove).toContainText('Ruajtur');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(newer);
 await page.reload({waitUntil:'load'});
 await page.locator('#navbar [data-val="explore"]').click();
 await page.locator('#screen [data-act="market-detail"][data-id="m1"]').click();
 await page.locator('#layer [data-act="market-save"][data-id="m1"]').click();
 await expect(page.locator('#layer [data-act="market-save"][data-id="m1"]')).toHaveText('Ruaje ofertën');
 const after=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(after.marketSaved).not.toContain('m1');
 expect(after.comments.p1).toEqual(['independent edit']);
});

test('Opportunities interest preference keeps draft on quota and stale writes then retries',async({page})=>{
 await openDemo(page,390,844);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 const openIntent=async()=>{
  await page.locator('#phone > .head [data-ily-op-toggle]').click();
  await page.locator('#ily-opportunities-panel [data-ily-op-category="Interesi"]').click();
  await expect(page.locator('#layer #intent-choice')).toBeVisible();
 };
 await openIntent();
 const key='illyrian_demo_v09_state';
 const choice=page.locator('#layer #intent-choice');
 const duration=page.locator('#layer #intent-duration');
 const save=page.locator('#layer [data-act="save-intent"]');
 await choice.selectOption({label:'Punë dhe bashkëpunim'});
 await duration.selectOption('3');
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(()=>{
  window.__intentSet=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');return window.__intentSet.call(this,k,v)};
 });
 await save.click();
 await expect(page.locator('#toast-area')).toContainText('Ndryshimi nuk u ruajt');
 await expect(save).toBeVisible();
 await expect(save).toBeFocused();
 await expect(choice).toHaveValue('Punë dhe bashkëpunim');
 await expect(duration).toHaveValue('3');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__intentSet;delete window.__intentSet});
 const newer=await page.evaluate(k=>{
  const data=JSON.parse(localStorage.getItem(k)||'{}');
  data.comments={...data.comments,p1:['other-tab intent check']};
  const raw=JSON.stringify(data);
  localStorage.setItem(k,raw);
  return raw;
 },key);
 await save.click();
 await expect(save).toBeVisible();
 await expect(save).toBeFocused();
 await expect(choice).toHaveValue('Punë dhe bashkëpunim');
 await expect(duration).toHaveValue('3');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(newer);
 await page.reload({waitUntil:'load'});
 await openIntent();
 await page.locator('#layer #intent-choice').selectOption({label:'Punë dhe bashkëpunim'});
 await page.locator('#layer #intent-duration').selectOption('3');
 const beforeSave=Date.now();
 await page.locator('#layer [data-act="save-intent"]').click();
 await expect(page.locator('#layer #intent-choice')).toHaveCount(0);
 const saved=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(saved.intent).toBe('Punë dhe bashkëpunim');
 expect(new Date(saved.intentExpiry).getTime()).toBeGreaterThanOrEqual(beforeSave+3*86400000-5000);
 expect(new Date(saved.intentExpiry).getTime()).toBeLessThanOrEqual(Date.now()+3*86400000+5000);
 expect(saved.activityLog.filter(x=>x.text==='Preferenca u përditësua')).toHaveLength(1);
 expect(saved.comments.p1).toEqual(['other-tab intent check']);
 await openIntent();
 await expect(page.locator('#layer #intent-choice')).toHaveValue('Punë dhe bashkëpunim');
});

test('Alumni preference keeps the checkbox and draft on quota or stale writes, then retries',async({page})=>{
 await openDemo(page,390,844);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 const openAlumni=async()=>{
  await page.locator('#navbar [data-val="explore"]').click();
  await page.locator('#screen [data-act="alumni-info"]').first().click();
  await expect(page.locator('#layer #alumni-flag')).toBeVisible();
 };
 await openAlumni();
 const key='illyrian_demo_v09_state';
 const flag=page.locator('#layer #alumni-flag');
 const save=page.locator('#layer [data-act="save-alumni"]');
 await flag.check();
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(()=>{
  window.__alumniSet=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){
   if(k==='illyrian_demo_v09_state')throw new DOMException('Quota','QuotaExceededError');
   return window.__alumniSet.call(this,k,v);
  };
 });
 await save.click();
 await expect(page.locator('#toast-area')).toContainText('Ndryshimi nuk u ruajt');
 await expect(save).toBeVisible();
 await expect(save).toBeFocused();
 await expect(flag).toBeChecked();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__alumniSet;delete window.__alumniSet});
 const newer=await page.evaluate(k=>{
  const data=JSON.parse(localStorage.getItem(k)||'{}');
  data.comments={...data.comments,p1:['other tab alumni preference']};
  const raw=JSON.stringify(data);
  localStorage.setItem(k,raw);
  return raw;
 },key);
 await save.click();
 await expect(save).toBeVisible();
 await expect(save).toBeFocused();
 await expect(flag).toBeChecked();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(newer);
 await page.reload({waitUntil:'load'});
 await openAlumni();
 await expect(flag).not.toBeChecked();
 await flag.check();
 await save.click();
 await expect(flag).toHaveCount(0);
 const saved=JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key));
 expect(saved.alumniOptIn).toBe(true);
 expect(saved.activityLog.filter(x=>x.text==='Preferenca Alumni u përditësua')).toHaveLength(1);
 expect(saved.comments.p1).toEqual(['other tab alumni preference']);
 await openAlumni();
 await expect(flag).toBeChecked();
});

test('Plans integration: switching tabs cannot overwrite another window local data',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#phone > .head [data-ily-op-toggle]').click();
 await page.locator('#ily-opportunities-panel [data-ily-op-category="Plane"]').click();
 await expect(page.locator('#screen [data-act="v10-plans-view"][data-val="all"]')).toHaveAttribute('aria-pressed','true');
 const newer=await page.evaluate(()=>{
  const key='illyrian_demo_v09_state',saved=JSON.parse(localStorage.getItem(key)||'{}');
  saved.v9RecentQueries=['another-tab-update'];saved.comments={...saved.comments,p1:['Other tab comment']};
  const raw=JSON.stringify(saved);localStorage.setItem(key,raw);return raw;
 });
 await page.locator('#screen [data-act="v10-plans-view"][data-val="mine"]').click();
 await expect(page.locator('#screen [data-act="v10-plans-view"][data-val="all"]')).toHaveAttribute('aria-pressed','true');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(newer);
 await page.reload({waitUntil:'load'});
 await page.locator('#phone > .head [data-ily-op-toggle]').click();
 await page.locator('#ily-opportunities-panel [data-ily-op-category="Plane"]').click();
 await page.locator('#screen [data-act="v10-plans-view"][data-val="mine"]').click();
 await expect(page.locator('#screen [data-act="v10-plans-view"][data-val="mine"]')).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#screen [data-act="v10-plans-view"][data-val="mine"]')).toBeFocused();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).v9RecentQueries)).toEqual(['another-tab-update']);
});

test('Plans integration: quota failure keeps current tab and retries without a false save',async({page})=>{
 await openDemo(page,390,844);
 await page.locator('#phone > .head [data-ily-op-toggle]').click();
 await page.locator('#ily-opportunities-panel [data-ily-op-category="Plane"]').click();
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await page.evaluate(()=>{
  window.__plansPreviousWrite=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state')throw new DOMException('Quota exceeded','QuotaExceededError');return window.__plansPreviousWrite.call(this,k,v)};
 });
 const mine=page.locator('#screen [data-act="v10-plans-view"][data-val="mine"]');
 await mine.click();
 await expect(mine).toHaveAttribute('aria-pressed','false');
 await expect(page.locator('#screen [data-act="v10-plans-view"][data-val="all"]')).toHaveAttribute('aria-pressed','true');
 await expect(mine).toBeFocused();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await page.evaluate(()=>{Storage.prototype.setItem=window.__plansPreviousWrite;delete window.__plansPreviousWrite});
 await mine.click();
 await expect(mine).toHaveAttribute('aria-pressed','true');
 await expect(mine).toBeFocused();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).v10PlansView)).toBe('mine');
 await page.reload({waitUntil:'load'});
 await page.locator('#phone > .head [data-ily-op-toggle]').click();
 await page.locator('#ily-opportunities-panel [data-ily-op-category="Plane"]').click();
 await expect(page.locator('#screen [data-act="v10-plans-view"][data-val="mine"]')).toHaveAttribute('aria-pressed','true');
});


test('Plans i18n: counted tabs update in sq/en/it without losing filter, focus or core data',async({page})=>{
 await page.addInitScript(()=>{
  const key='illyrian_demo_v09_state';
  localStorage.setItem(key,JSON.stringify({requests:['e2'],acceptedPlans:['e2']}));
 });
 await openDemo(page,390,844);
 await page.locator('#phone > .head [data-ily-op-toggle]').click();
 await page.locator('#ily-opportunities-panel [data-ily-op-category="Plane"]').click();
 const selected=page.locator('#screen [data-act="v10-plans-view"][data-val="mine"]');
 await selected.click();
 await expect(selected).toHaveAttribute('aria-pressed','true');
 await expect(selected).toBeFocused();
 const original=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 const labels=[
  ['sq','Të gjitha','Kërkesat e mia · 1','Të pranuara · 1'],
  ['en','All','My requests · 1','Accepted · 1'],
  ['it','Tutte','Le mie richieste · 1','Accettate · 1']
 ];
 for(const [lang,all,mine,accepted] of labels){
  await page.evaluate(code=>window.IllyrianI18n.changeLanguage(code),lang);
  await expect(page.locator('#screen [data-act="v10-plans-view"][data-val="all"]')).toHaveText(all);
  await expect(selected).toHaveText(mine);
  await expect(page.locator('#screen [data-act="v10-plans-view"][data-val="accepted"]')).toHaveText(accepted);
  await expect(selected).toHaveAttribute('aria-pressed','true');
  await expect(selected).toBeFocused();
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(original);
 }
});
