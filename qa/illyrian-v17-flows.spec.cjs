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
    await page.locator('#navbar [data-val="explore"]').click();
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
    await page.locator('#phone > .head [data-ily-profile-settings]').click();
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


test('AUD-01 theme rejects a stale second tab without overwriting newer core likes',async({page,context})=>{
  await page.emulateMedia({colorScheme:'light'});
  await openDemo(page,390,844);
  const other=await context.newPage();
  try{
    await other.emulateMedia({colorScheme:'light'});
    await openDemo(other,390,844);
    await nav(other,'profile');
    await other.locator('#phone > .head [data-ily-profile-settings]').click();
    await other.locator('#layer [data-act="v6-settings-section"][data-val="theme"]').click();
    const oldMode=await other.locator('#layer input[name="theme"]:checked').inputValue();
    await page.locator('#screen [data-act="like"][data-id="p1"]').click();
    const saved=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
    expect(JSON.parse(saved).likes).toContain('p1');
    const requested=oldMode==='dark'?'light':'dark';
    const attempted=other.locator('#layer input[name="theme"][value="'+requested+'"]');
    await attempted.check();
    expect(await other.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(saved);
    await expect(other.locator('#layer input[name="theme"][value="'+oldMode+'"]')).toBeChecked();
    await expect(attempted).toBeFocused();
    await expect(other.locator('#toast-area')).not.toBeEmpty();
    await openDemo(other,390,844); // fresh snapshot enables an explicit retry
    await nav(other,'profile');
    await other.locator('#phone > .head [data-ily-profile-settings]').click();
    await other.locator('#layer [data-act="v6-settings-section"][data-val="theme"]').click();
    await other.locator('#layer input[name="theme"][value="'+requested+'"]').check();
    const result=await other.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')));
    expect(result.likes).toContain('p1');
    expect(result.theme).toBe(requested);
    await other.reload({waitUntil:'load'});
    expect(await other.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).theme)).toBe(requested);
  }finally{await other.close();}
});

test('AUD-01 theme rolls back a quota failure and preserves focus for retry',async({page})=>{
  await page.emulateMedia({colorScheme:'light'});
  await openDemo(page,390,844);
  await nav(page,'profile');
  await page.locator('#phone > .head [data-ily-profile-settings]').click();
  await page.locator('#layer [data-act="v6-settings-section"][data-val="theme"]').click();
  const key='illyrian_demo_v09_state',before=await page.evaluate(k=>localStorage.getItem(k),key);
  const previous=await page.locator('#layer input[name="theme"]:checked').inputValue();
  await page.evaluate(k=>{
    const set=Storage.prototype.setItem;
    window.__restoreAudit01Theme=()=>{Storage.prototype.setItem=set};
    Storage.prototype.setItem=function(name,value){
      if(name===k)throw new DOMException('Audit synthetic quota','QuotaExceededError');
      return set.call(this,name,value);
    };
  },key);
  const requested=previous==='dark'?'light':'dark';
  const choice=page.locator('#layer input[name="theme"][value="'+requested+'"]');
  try{
    await choice.check();
    expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
    await expect(page.locator('#layer input[name="theme"][value="'+previous+'"]')).toBeChecked();
    await expect(choice).toBeFocused();
    await expect(page.locator('#toast-area')).not.toBeEmpty();
    await expect(page.locator('#phone')).not.toHaveClass(/\bdark\b/);
  }finally{await page.evaluate(()=>window.__restoreAudit01Theme?.())}
  await choice.check();
  expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).theme,key)).toBe(requested);
  await page.reload({waitUntil:'load'});
  expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).theme,key)).toBe(requested);
});

test('Plans local entry and local activity labels follow live sq/en/it without data writes',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({
    events:[{id:'qa-localized',title:'Original user plan',kind:'Sport',city:'Romë',place:'Original venue',date:'2099-06-12',time:'13:00',capacity:5,price:0,privacy:'public',conditions:'',cancelled:false}],
    requests:[],messages:[],attendance:[]
  })));
  await openDemo(page,390,844);await nav(page,'events');
  const entry=page.locator('#screen .ilp-entry');
  const cards=page.locator('#screen #ilp-created-list');
  await expect(entry).toBeVisible();await expect(cards).toBeVisible();
  const original=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
  const opener=entry.locator('[data-ilp-entry]');await opener.focus();
  for(const [lang,title,description,created,open,view] of [
    ['sq','Krijo dhe menaxho aktivitete','Plan, kërkesa, kapacitet dhe biseda në grup','Aktivitete të krijuara lokalisht','Hap panelin →','Shiko planin →'],
    ['en','Create and manage activities','Plans, requests, capacity and group chat','Locally created activities','Open panel →','View plan →'],
    ['it','Crea e gestisci attività','Piani, richieste, capienza e chat di gruppo','Attività create localmente','Apri il pannello →','Vedi il piano →']
  ]){
    await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
    await expect(entry.locator('strong')).toHaveText(title);
    await expect(entry.locator('p')).toHaveText(description);
    await expect(opener).toHaveText(open);
    await expect(cards.locator('h3')).toHaveText(created);
    await expect(cards.locator('[data-ilp-open="qa-localized"]')).toHaveText(view);
    await expect(opener).toBeFocused();
    await expect(cards.locator('[data-user-content]')).toHaveText('Original user plan');
    expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(original);
  }
});
