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
  expect(ringSize.width).toBeGreaterThanOrEqual(73);
  expect(ringSize.width).toBeLessThanOrEqual(83);
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
   await expect(btn.locator('.v12-nav-label')).toBeHidden();
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
 test('Home header Calendar Opportunities Notifications - '+width+'x'+height,async({page})=>{
  await openDemo(page,width,height);
  const head=page.locator('#phone > .head');
  const buttons=head.locator(':scope > .top-actions > button:visible');
  const labels=await buttons.evaluateAll(items=>items.map(el=>el.getAttribute('aria-label')));
  const expected=await page.evaluate(()=>['common:homeCalendar','common:homeOpportunities'].map(k=>window.IllyrianI18n.t(k)));
  expect(labels.slice(0,2)).toEqual(expected);
  // The existing i18n layer localizes Notifications on load.
  expect(labels[2]).toMatch(/^(Njoftime|Notifications|Notifiche)$/);
  await expect(head.locator('.ily-create-trigger')).toBeHidden();
  await expect(page.locator('#screen > .stories .story-btn').first()).toBeVisible();
  const b=await buttons.all();
  for(const el of b){
   const box=await el.boundingBox();
   expect(box.width).toBeGreaterThanOrEqual(44);
   expect(box.height).toBeGreaterThanOrEqual(44);
  }
  const brandBox=await head.locator('.brand').boundingBox();
  const calendarBox=await b[0].boundingBox();
  expect(brandBox.x+brandBox.width).toBeLessThanOrEqual(calendarBox.x+1);
  const toggle=head.locator('[data-ily-op-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  const panel=head.locator('#ily-opportunities-panel');
  await expect(panel).toBeVisible();
  await expect(panel.locator('button')).toHaveCount(4);
  expect(await panel.locator('button').evaluateAll(items=>items.map(x=>x.dataset.ilyOpCategory))).toEqual(['Biznese','Tregu','Punë','Shërbime']);
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
 const keys=['homeBusinesses','homeMarketplace','homeJobs','homeServices'];
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


test('P1-A11Y-01 Reels Home Light label meets AA 4.5 contrast, Dark keeps theme',async({page})=>{
 await openDemo(page,390,844);
 const button=page.locator('.v4-reels-head button[data-act="open-reels"][data-id="0"]');
 await expect(button).toBeVisible();
 const c=await button.evaluate(el=>{
  const fg=getComputedStyle(el).color,bg=getComputedStyle(document.querySelector('#phone')).backgroundColor;
  const lum=s=>{
   const rgb=s.match(/\d+(?:\.\d+)?/g).slice(0,3).map(n=>Number(n)/255);
   return [0.2126,0.7152,0.0722].reduce((v,w,i)=>v+w*(rgb[i]<=0.04045?rgb[i]/12.92:Math.pow((rgb[i]+0.055)/1.055,2.4)),0);
  };
  const a=lum(fg),b=lum(bg);
  return {fg,bg,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
 });
 expect(c.ratio,'small text needs WCAG AA contrast in Light').toBeGreaterThanOrEqual(4.5);
 expect(c.fg).toBe('rgb(220, 12, 53)');
 await page.evaluate(()=>document.querySelector('#phone').classList.add('dark'));
 await expect(button).toHaveCSS('color','rgb(229, 12, 55)');
});
