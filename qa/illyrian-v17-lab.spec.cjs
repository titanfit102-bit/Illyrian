// ILLYRIAN v1.7 - run the established QA Lab suites in real Chromium.
// This is a wrapper: it does not rewrite the validated QA Lab assertions.
const {test,expect}=require('@playwright/test');
const QA='/ILLYRIAN_QA_v1.7.html';

async function openLab(page){
  await page.goto(QA,{waitUntil:'load'});
  await expect(page.locator('#demo')).toBeVisible();
  const inner=page.frameLocator('#demo');
  await expect(inner.locator('#phone')).toBeVisible();
  // A fresh browser starts at the v0.7 welcome/tour overlay. Earlier manual
  // QA was run after onboarding, while CI reached underlying panels through
  // programmatic .click() with the welcome overlay still active. Close it using
  // real guest controls BEFORE any synthetic focus assertions.
  const guest=inner.locator('#v7-auth.visible [data-v7="guest"]');
  if(await guest.isVisible()){
    await guest.click();
    await inner.locator('#v7-auth.visible [data-v7="skip-tour"]').click();
  }
  await expect(inner.locator('#v7-auth.visible')).toHaveCount(0);
  // Subsequent iframe reloads must stay in the entered local-only demo state.
  const session=await inner.locator('body').evaluate(()=>localStorage.getItem('illyrian_demo_v07_session'));
  expect(session).toBe('entered');
}
async function runSuite(page,buttonId,expectedPass){
  const button=page.locator(buttonId);
  await expect(button).toBeEnabled();
  await button.click();
  // Every suite works through all 7 viewports before it enables controls.
  await expect(button).toBeDisabled();
  await expect(button).toBeEnabled({timeout:150000});
  const pass=await page.locator('#results li strong.pass').count();
  const fail=await page.locator('#results li strong.fail').count();
  // The QA Lab styles INFO rows with class=skip too; count only literal SKIP records.
  const labels=await page.locator('#results li strong').allTextContents();
  const skip=labels.filter(t=>t.trim().startsWith('SKIP')).length;
  const summary=await page.locator('#summary').innerText();
  expect(pass,'QA Lab PASS count: '+summary).toBe(expectedPass);
  expect(fail,'QA Lab FAIL count: '+summary).toBe(0);
  expect(skip,'QA Lab SKIP count: '+summary).toBe(0);
  expect(summary).toContain(expectedPass+' PASS');
  expect(summary).toContain('0 FAIL');
}

test('Baseline integration QA Lab: 126/126 across 7 viewports',async({page})=>{
  test.setTimeout(180000);
  await openLab(page);
  await runSuite(page,'#all-sizes',126);
});

test('Advanced QA Lab: 147/147 and original theme storage restored',async({page})=>{
  test.setTimeout(180000);
  await openLab(page);
  const key='illyrian_demo_v09_state';
  const snapshot=await page.locator('#demo').evaluate((frame,k)=>
    frame.contentWindow.localStorage.getItem(k),key);
  await runSuite(page,'#advanced-all',147);
  const after=await page.locator('#demo').evaluate((frame,k)=>
    frame.contentWindow.localStorage.getItem(k),key);
  expect(after,'QA must restore the original theme state').toBe(snapshot);
});
