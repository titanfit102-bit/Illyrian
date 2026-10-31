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
 await expect(page.locator('#navbar [data-val="home"]')).toBeFocused();
 await toggle.click();
 await panel.locator('[data-ily-op-category="Shërbime"]').click();
 await expect(shop).toBeVisible();
 await expect(shop.locator('[data-ils="category"][data-value="Shërbime"]')).toHaveAttribute('aria-pressed','true');
 await expect(shop.locator('#ils-search')).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(shop).toHaveCount(0);
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
 await expect(page.locator('#layer .p17-viewer-photo')).toBeVisible();
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
  expect(await profile.locator('.p17-cover').evaluate(el=>el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(142);
  for(const selector of ['.p17-cover-change','.p17-avatar-camera','.p17-edit','.p17-settings','.p17-person-name [data-ily-identity-badge]']){
   const r=await profile.locator(selector).boundingBox();expect(r.width).toBeGreaterThanOrEqual(44);expect(r.height).toBeGreaterThanOrEqual(44);
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
