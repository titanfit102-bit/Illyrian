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
    await attempted.click(); // rejected writes intentionally restore the prior radio state
    expect(await other.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(saved);
    await expect(other.locator('#layer input[name="theme"][value="'+oldMode+'"]')).toBeChecked();
    await expect(attempted).toBeFocused();
    await expect(other.locator('#toast-area')).not.toBeEmpty();
    await other.reload({waitUntil:'load'}); // fresh snapshot enables an explicit retry
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
    await choice.click(); // rejected writes intentionally restore the prior radio state
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


async function audit02OpenCreator(page,kind){
 await nav(page,'home');
 if(kind==='story'){
  // Reuse the existing delegated v15-open action in this storage regression.
  // The Home Story shortcut intentionally becomes a viewer after publishing;
  // never call v15Creator as a page-global (it is scoped to the app script).
  const trigger=page.locator('#screen .ily-compose-reel[data-act="v15-open"]');
  await trigger.evaluate(el=>{el.dataset.val='story';});
  await trigger.click();
 }else await page.locator('#screen .ily-compose-reel[data-act="v15-open"][data-val="reel"]').click();
 await expect(page.locator('#v15-caption')).toBeVisible();
}
for(const kind of ['story','reel']){
 test('AUD-02 stale '+kind+' publish keeps first publication and second draft',async({page,context})=>{
  const key='illyrian_demo_v15_creator',field=kind==='story'?'stories':'reels';
  await openDemo(page,390,844);
  const other=await context.newPage();
  try{
   await openDemo(other,390,844);
   for(const tab of [page,other])await audit02OpenCreator(tab,kind);
   await page.locator('#v15-caption').fill('AUD-02 first '+kind);
   await other.locator('#v15-caption').fill('AUD-02 second '+kind);
   await page.locator('#layer [data-act="v15-publish"]').click();
   const first=await page.evaluate(k=>localStorage.getItem(k),key);
   expect(JSON.parse(first)[field].map(x=>x.caption)).toContain('AUD-02 first '+kind);
   await other.locator('#layer [data-act="v15-publish"]').click();
   expect(await other.evaluate(k=>localStorage.getItem(k),key)).toBe(first);
   await expect(other.locator('#v15-caption')).toHaveValue('AUD-02 second '+kind);
   await expect(other.locator('#v15-caption')).toBeFocused();
   await expect(other.locator('#toast-area')).not.toBeEmpty();
   await other.reload({waitUntil:'load'});
   await audit02OpenCreator(other,kind);
   await other.locator('#v15-caption').fill('AUD-02 second '+kind);
   await other.locator('#layer [data-act="v15-publish"]').click();
   const saved=await other.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
   expect(saved[field].map(x=>x.caption)).toEqual(['AUD-02 second '+kind,'AUD-02 first '+kind]);
   await other.reload({waitUntil:'load'});
   expect((await other.evaluate(k=>JSON.parse(localStorage.getItem(k)),key))[field].length).toBe(2);
  }finally{await other.close()}
 });
}
test('AUD-02 quota failure keeps unsent Reel draft and retries once',async({page})=>{
 const key='illyrian_demo_v15_creator';
 await openDemo(page,390,844);
 await audit02OpenCreator(page,'reel');
 await page.locator('#v15-caption').fill('AUD-02 unsent draft');
 const original=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(k=>{
  const original=Storage.prototype.setItem;
  window.__restoreCreatorQuota=()=>{Storage.prototype.setItem=original};
  Storage.prototype.setItem=function(name,value){
   if(name===k)throw new DOMException('Synthetic quota','QuotaExceededError');
   return original.call(this,name,value);
  };
 },key);
 try{
  await page.locator('#layer [data-act="v15-publish"]').click();
  await expect(page.locator('#v15-caption')).toHaveValue('AUD-02 unsent draft');
  await expect(page.locator('#v15-caption')).toBeFocused();
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(original);
  await expect(page.locator('#toast-area')).not.toBeEmpty();
 }finally{await page.evaluate(()=>window.__restoreCreatorQuota?.())}
 await page.locator('#layer [data-act="v15-publish"]').click();
 const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 expect(saved.reels.map(x=>x.caption)).toEqual(['AUD-02 unsent draft']);
 await page.reload({waitUntil:'load'});
 expect((await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key)).reels.length).toBe(1);
});


async function audit03OpenPrivacy(page,section='profiles'){
 await nav(page,'explore');
 await page.locator('#il4-entry [data-il4-entry]').click();
 const root=page.locator('#il4-root');
 await expect(root).toBeVisible();
 // Explore enters the schematic map by default, not the profile controls.
 await root.locator('[data-il4="tab:'+(section==='groups'?'groups':'profiles')+'"]').click();
 return root;
}
test('AUD-03 stale follow in second tab cannot erase another tab blocked profile',async({page,context})=>{
 const key='illyrian_demo_v17_privacy_map';
 await openDemo(page,390,844);
 const other=await context.newPage();
 try{
  await openDemo(other,390,844);
  const first=await audit03OpenPrivacy(page),second=await audit03OpenPrivacy(other);
  await second.locator('[data-il4="profile:arta"]').click();
  await first.locator('[data-il4="block"]').click();
  const protectedRaw=await page.evaluate(k=>localStorage.getItem(k),key);
  expect(JSON.parse(protectedRaw).follow.leon).toBe('blocked');
  await second.locator('[data-il4="follow-request"]').click();
  expect(await other.evaluate(k=>localStorage.getItem(k),key)).toBe(protectedRaw);
  await expect(second.locator('.il4-notice')).toBeVisible();
  await expect(second.locator('[data-il4="follow-request"]')).toBeFocused();
  await other.reload({waitUntil:'load'});
  const current=await audit03OpenPrivacy(other);
  await current.locator('[data-il4="profile:arta"]').click();
  await current.locator('[data-il4="follow-request"]').click();
  const saved=await other.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  expect(saved.follow.leon).toBe('blocked');
  expect(saved.follow.arta).toBe('accepted');
  await other.reload({waitUntil:'load'});
  expect((await other.evaluate(k=>JSON.parse(localStorage.getItem(k)),key)).follow.leon).toBe('blocked');
 }finally{await other.close();}
});
test('AUD-03 stale group membership write cannot erase newer membership',async({page,context})=>{
 const key='illyrian_demo_v17_privacy_map';
 await openDemo(page,390,844);
 const other=await context.newPage();
 try{
  await openDemo(other,390,844);
  const a=await audit03OpenPrivacy(page,'groups'),b=await audit03OpenPrivacy(other,'groups');
  await b.locator('[data-il4="group:tirana-makers"]').click();
  await a.locator('[data-il4="group-request"]').click();
  const protectedRaw=await page.evaluate(k=>localStorage.getItem(k),key);
  expect(JSON.parse(protectedRaw).membership['albania-milan']).toBe('pending');
  await b.locator('[data-il4="group-request"]').click();
  expect(await other.evaluate(k=>localStorage.getItem(k),key)).toBe(protectedRaw);
  await expect(b.locator('.il4-notice')).toBeVisible();
  await expect(b.locator('[data-il4="group-request"]')).toBeFocused();
  await other.reload({waitUntil:'load'});
  const fresh=await audit03OpenPrivacy(other,'groups');
  await fresh.locator('[data-il4="group:tirana-makers"]').click();
  await fresh.locator('[data-il4="group-request"]').click();
  const persisted=await other.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  expect(persisted.membership['albania-milan']).toBe('pending');
  expect(persisted.membership['tirana-makers']).toBe('accepted');
 }finally{await other.close()}
});
test('AUD-03 same-person stale follow is rejected after a block',async({page,context})=>{
 const key='illyrian_demo_v17_privacy_map';
 await openDemo(page,390,844);
 const other=await context.newPage();
 try{
  await openDemo(other,390,844);
  const a=await audit03OpenPrivacy(page),b=await audit03OpenPrivacy(other);
  await a.locator('[data-il4="block"]').click();
  const raw=await page.evaluate(k=>localStorage.getItem(k),key);
  await b.locator('[data-il4="follow-request"]').click();
  expect(await other.evaluate(k=>localStorage.getItem(k),key)).toBe(raw);
  await expect(b.locator('[data-il4="follow-request"]')).toBeFocused();
  await expect(b.locator('.il4-notice')).toBeVisible();
 }finally{await other.close()}
});
test('AUD-03 quota failure restores privacy block and permits retry',async({page})=>{
 const key='illyrian_demo_v17_privacy_map';
 await openDemo(page,390,844);
 const root=await audit03OpenPrivacy(page);
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.evaluate(k=>{
  const native=Storage.prototype.setItem;
  window.__audit03Restore=()=>{Storage.prototype.setItem=native};
  Storage.prototype.setItem=function(name,value){
   if(name===k)throw new DOMException('Synthetic privacy quota','QuotaExceededError');
   return native.call(this,name,value);
  };
 },key);
 try{
  await root.locator('[data-il4="block"]').click();
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
  await expect(root.locator('[data-il4="block"]')).toBeFocused();
  await expect(root.locator('.il4-notice')).toBeVisible();
 }finally{await page.evaluate(()=>window.__audit03Restore?.())}
 await root.locator('[data-il4="block"]').click();
 expect((await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key)).follow.leon).toBe('blocked');
 await page.reload({waitUntil:'load'});
 expect((await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key)).follow.leon).toBe('blocked');
});


async function audit04SeedReels(page){
 await page.addInitScript(()=>{
  const key='illyrian_demo_v15_creator';
  if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({
   stories:[],reels:[
    {id:'audit04-reel-a',caption:'Fixture Reel A',sample:'arta',created:1730000000001},
    {id:'audit04-reel-b',caption:'Fixture Reel B',sample:'cafe',created:1730000000002}
   ]
  }));
 });
}
async function audit04OpenReel(page,id){
 await nav(page,'profile');
 await page.locator('#p17-tab-reels').click();
 await page.locator('#screen [data-kind="myreel"][data-id="'+id+'"]').click();
 await expect(page.locator('#layer .v16-viewer')).toBeVisible();
 await expect(page.locator('#v16-comment')).toBeVisible();
}
for(const separateReels of [false,true]){
 test('AUD-04 stale comments keep the first write on '+(separateReels?'different':'same')+' Reel and draft for retry',async({page,context})=>{
  const key='illyrian_demo_v16_comments',firstId='audit04-reel-a';
  const secondId=separateReels?'audit04-reel-b':firstId;
  await audit04SeedReels(page);
  await openDemo(page,390,844);
  const other=await context.newPage();
  try{
   await openDemo(other,390,844);
   await audit04OpenReel(page,firstId);
   await audit04OpenReel(other,secondId);
   await page.locator('#v16-comment').fill('First AUD-04 comment');
   await other.locator('#v16-comment').fill('Second AUD-04 comment');
   await page.locator('#layer [data-act="v16-send"]').click();
   const firstRaw=await page.evaluate(k=>localStorage.getItem(k),key);
   expect(JSON.parse(firstRaw)['reel:'+firstId]).toEqual(['First AUD-04 comment']);
   await other.locator('#layer [data-act="v16-send"]').click();
   expect(await other.evaluate(k=>localStorage.getItem(k),key)).toBe(firstRaw);
   await expect(other.locator('#v16-comment')).toHaveValue('Second AUD-04 comment');
   await expect(other.locator('#v16-comment')).toBeFocused();
   await expect(other.locator('#toast-area')).not.toBeEmpty();
   await other.reload({waitUntil:'load'});
   await audit04OpenReel(other,secondId);
   await other.locator('#v16-comment').fill('Second AUD-04 comment');
   await other.locator('#layer [data-act="v16-send"]').click();
   const saved=await other.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
   if(separateReels){
    expect(saved['reel:'+firstId]).toEqual(['First AUD-04 comment']);
    expect(saved['reel:'+secondId]).toEqual(['Second AUD-04 comment']);
   }else expect(saved['reel:'+firstId]).toEqual(['First AUD-04 comment','Second AUD-04 comment']);
   await other.reload({waitUntil:'load'});
   const afterReload=await other.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
   expect(afterReload).toEqual(saved);
  }finally{await other.close()}
 });
}
for(const action of ['like','delete']){
 test('AUD-02 stale own Reel '+action+' refuses to erase another tab media update',async({page,context})=>{
  const key='illyrian_demo_v15_creator';
  await audit04SeedReels(page);
  await openDemo(page,390,844);
  const other=await context.newPage();
  try{
   await openDemo(other,390,844);
   await audit04OpenReel(page,'audit04-reel-b');
   await audit04OpenReel(other,'audit04-reel-a');
   await page.locator('#layer [data-act="v16-like"]').click();
   const first=await page.evaluate(k=>localStorage.getItem(k),key);
   expect(JSON.parse(first).reels.find(x=>x.id==='audit04-reel-b').liked).toBe(true);
   const act=other.locator('#layer [data-act="v16-'+action+'"]');
   await act.click();
   expect(await other.evaluate(k=>localStorage.getItem(k),key)).toBe(first);
   await expect(other.locator('#layer .v16-viewer')).toBeVisible();
   await expect(act).toBeFocused();
   await expect(other.locator('#toast-area')).not.toBeEmpty();
   await other.reload({waitUntil:'load'});
   await audit04OpenReel(other,'audit04-reel-a');
   await other.locator('#layer [data-act="v16-'+action+'"]').click();
   const after=await other.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
   expect(after.reels.find(x=>x.id==='audit04-reel-b').liked).toBe(true);
   if(action==='delete')expect(after.reels.some(x=>x.id==='audit04-reel-a')).toBe(false);
   else expect(after.reels.find(x=>x.id==='audit04-reel-a').liked).toBe(true);
   await other.reload({waitUntil:'load'});
   expect((await other.evaluate(k=>JSON.parse(localStorage.getItem(k)),key)).reels).toEqual(after.reels);
  }finally{await other.close();}
 });
}

test('AUD-04 comment quota rejects without clearing draft or duplicating on retry',async({page})=>{
 const key='illyrian_demo_v16_comments';
 await audit04SeedReels(page);
 await openDemo(page,390,844);
 await audit04OpenReel(page,'audit04-reel-a');
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.locator('#v16-comment').fill('Quota AUD-04 comment');
 await page.evaluate(k=>{
  const native=Storage.prototype.setItem;
  window.__restoreAudit04=()=>{Storage.prototype.setItem=native};
  Storage.prototype.setItem=function(name,value){
   if(name===k)throw new DOMException('AUD-04 synthetic quota','QuotaExceededError');
   return native.call(this,name,value);
  };
 },key);
 try{
  await page.locator('#layer [data-act="v16-send"]').click();
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
  await expect(page.locator('#v16-comment')).toHaveValue('Quota AUD-04 comment');
  await expect(page.locator('#v16-comment')).toBeFocused();
  await expect(page.locator('#toast-area')).not.toBeEmpty();
 }finally{await page.evaluate(()=>window.__restoreAudit04?.())}
 await page.locator('#layer [data-act="v16-send"]').click();
 const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 expect(saved['reel:audit04-reel-a']).toEqual(['Quota AUD-04 comment']);
 await page.reload({waitUntil:'load'});
 expect((await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key))['reel:audit04-reel-a']).toEqual(['Quota AUD-04 comment']);
});


test('AUD-07 post counters render corrupted local values as inert text without storage writes',async({page})=>{
 const key='illyrian_demo_v09_state';
 await page.addInitScript(k=>{
  if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify({
   posts:[{id:'audit07-post',name:'Local QA',ava:'a1',city:'Tiranë',when:'Tani',
    text:'AUD-07 counter fixture',img:null,
    likes:'<em data-aud07="likes">invalid</em>',
    comments:'<em data-aud07="comments">invalid</em>',
    share:'<em data-aud07="share">invalid</em>',verified:false}]
  }));
 },key);
 await openDemo(page,390,844);
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 const card=page.locator('#screen article.post').filter({hasText:'AUD-07 counter fixture'});
 await expect(card).toBeVisible();
 await expect(card.locator('[data-aud07]')).toHaveCount(0);
 const counts=card.locator('.post-bottom .post-action');
 await expect(counts.nth(0)).toContainText('0');
 await expect(counts.nth(1)).toContainText('0');
 await expect(counts.nth(2)).toContainText('0');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await page.reload({waitUntil:'load'});
 await expect(page.locator('#screen article.post [data-aud07]')).toHaveCount(0);
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
});

test('AUD-07 numeric strings and malformed counter shapes stay bounded without mutation',async({page})=>{
 const key='illyrian_demo_v09_state';
 await page.addInitScript(k=>{
  if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify({
   posts:[{id:'audit07-counters',name:'Local QA',ava:'a1',city:'Romë',when:'Tani',
    text:'AUD-07 shape fixture',likes:{value:8},comments:['4'],share:'12',verified:false}]
  }));
 },key);
 await openDemo(page,390,844);
 const original=await page.evaluate(k=>localStorage.getItem(k),key);
 const card=page.locator('#screen article.post').filter({hasText:'AUD-07 shape fixture'});
 const counts=card.locator('.post-bottom .post-action');
 await expect(counts.nth(0)).toContainText('0');
 await expect(counts.nth(1)).toContainText('0');
 await expect(counts.nth(2)).toContainText('12');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(original);
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
