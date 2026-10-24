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
