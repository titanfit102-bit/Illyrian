const {test,expect}=require('@playwright/test');
const KEY='illyrian_demo_ui_language_v1';
const TEAM_KEY='illyrian_demo_v17_governance';
async function identityCatalog(page,plus=false){
 await page.locator('[data-ilshop-open]').first().click();
 if(plus){await page.locator('#illyrian-shop-layer [data-isp-open]').click();await page.locator('#isp-root [data-isp="tab:stores"]').click();await page.locator('#isp-root [data-isp="store:Market Arbër"]').click()}
 else{await page.locator('#illyrian-shop-layer [data-ils="businesses"]').click();await page.locator('#illyrian-shop-layer [data-ils="business"][data-value="Market Arbër"]').click()}
}
async function identityStorage(page){return page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([key])=>key.startsWith('illyrian_')&&key!=='illyrian_demo_ui_language_v1')))}
for(const [lang,ordinary,declared,example] of [
 ['sq','Profil i zakonshëm',"Biznes i deklaruar","Biznes i verifikuar · shembull"],
 ['en','Ordinary profile',"Declared business","Verified business · example"],
 ['it','Profilo ordinario',"Attività dichiarata","Attività verificata · esempio"]
]){
 test('Identity phase 4: truthful social badges and Shop/Plus guide - '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  const badge=page.locator('#screen [data-ily-identity-badge]').first();await expect(badge).toHaveText("ⓘ");await expect(badge).toHaveAttribute('aria-expanded','false');
  const before=await identityStorage(page);await badge.focus();await page.keyboard.press('Enter');await expect(badge).toHaveAttribute('aria-expanded','true');await expect(badge.locator('..').locator('[data-ily-identity-note]')).toBeVisible();await expect(badge).toBeFocused();await page.keyboard.press('Space');await expect(badge).toHaveAttribute('aria-expanded','false');expect(await identityStorage(page)).toEqual(before);
  await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();await expect(page.locator('.profile-info [data-ily-identity-badge]')).toHaveText("ⓘ");
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  for(const plus of [false,true]){
   await identityCatalog(page,plus);const host=page.locator(plus?'#isp-root':'#illyrian-shop-layer');await expect(host.locator('[data-ily-business-status]')).toHaveText(declared);
   const opener=host.locator('[data-ily-identity-guide]'),stored=await identityStorage(page);await opener.click();const guide=page.locator('#ig6-identity-guide');await expect(guide).toBeVisible();
   await expect(guide.locator('[data-identity-state="ordinary"] h4')).toHaveText(ordinary);await expect(guide.locator('[data-identity-state="declared"] h4')).toHaveText(declared);await expect(guide.locator('[data-identity-state="verified-example"] h4')).toHaveText(example);
   await expect(guide.locator('input,select,textarea')).toHaveCount(0);await expect(page.locator('#ig6-root input[type="file"]')).toHaveCount(0);expect(await identityStorage(page)).toEqual(stored);
   await page.keyboard.press('Escape');await expect(opener).toBeFocused();await expect(host).toBeVisible();
   if(plus)await page.locator('#isp-root header [data-isp="close"]').click();await page.keyboard.press('Escape');
  }
 });
}
test('Identity phase 4: live locale keeps badge disclosure focus and nested guide return',async({page})=>{
 await ready(page);await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 const badge=page.locator('.profile-info [data-ily-identity-badge]');await badge.click();await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));await expect(badge).toBeFocused();await expect(badge).toHaveAttribute('aria-expanded','true');await expect(badge.locator('..').locator('[data-ily-identity-note]')).toContainText('Nessuna identità');
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 for(const plus of [false,true]){
  await identityCatalog(page,plus);const host=page.locator(plus?'#isp-root':'#illyrian-shop-layer'),opener=host.locator('[data-ily-identity-guide]');await opener.click();
  const language=plus?'en':'sq';await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),language);await expect(page.locator('#ig6-identity-guide [data-identity-state="verified-example"] h4')).toHaveText(plus?"Verified business · example":"Biznes i verifikuar · shembull");
  await page.keyboard.press('Escape');await expect(opener).toBeFocused();await expect(host).toBeVisible();
  if(plus)await page.locator('#isp-root header [data-isp="close"]').click();await page.keyboard.press('Escape');
 }
});
test('Identity phase 4: historical verified flag keeps its information disclosure and stored user text stays literal',async({page})=>{
 await ready(page);const raw=await page.evaluate(()=>{const k='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(k)||'{}');s.posts=Array.isArray(s.posts)?s.posts:[];s.posts.unshift({id:'identity-ugc',name:'<img src=x onerror="window.__identityInjected=1">',text:'Paid does not mean verified <svg onload="window.__identityInjected=1">',verified:true,ava:'a1',likes:0,comments:0,share:0,city:'Tiranë',when:'Tani'});const raw=JSON.stringify(s);localStorage.setItem(k,raw);return raw});await page.reload();
 const post=page.locator('#screen .post').filter({hasText:'Paid does not mean verified'});await expect(post.locator('[data-ily-identity-badge]')).toHaveText("ⓘ");await post.locator('[data-ily-identity-badge]').click();await expect(post.locator('[data-ily-identity-note]')).toBeVisible();await expect(post.locator('.post-name')).toContainText('<img');await expect(post.locator('.post-name img,.post-copy svg')).toHaveCount(0);expect(await page.evaluate(()=>window.__identityInjected)).toBeUndefined();expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
});
test('Identity phase 4: narrow mobile disclosures fit and sponsorship never grants a real badge',async({page})=>{
 await page.setViewportSize({width:320,height:568});await ready(page);
 const badge=page.locator('#screen [data-ily-identity-badge]').first();await badge.click();const dimensions=await badge.locator('..').locator('[data-ily-identity-note]').evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right}});expect(dimensions.left).toBeGreaterThanOrEqual(0);expect(dimensions.right).toBeLessThanOrEqual(320);
 const sponsored=await commercePost(page,{sponsored:true});await expect(sponsored.locator('[data-ily-commerce-sponsored]')).toBeVisible();await expect(sponsored.locator('[data-ily-identity-badge]')).toHaveCount(0);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).posts[0].verified)).toBe(false);
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();await page.locator('#ig6-entry [data-ig6="open"]').click();await expect(page.locator('#ig6-identity-guide')).toContainText(await page.evaluate(()=>window.IllyrianI18n.t('identity:paidSeparate')));await expect(page.locator('#ig6-identity-guide button,input,select')).toHaveCount(0);
});
test('Identity phase 4: guide activation without pointer focus restores its source after locale repaint',async({page})=>{
 await page.setViewportSize({width:320,height:568});await ready(page);
 for(const plus of [false,true]){
  await identityCatalog(page,plus);const host=page.locator(plus?'#isp-root':'#illyrian-shop-layer');const guide=host.locator('[data-ily-identity-guide]');await guide.scrollIntoViewIfNeeded();
  await host.locator('header button').first().focus();await guide.evaluate(el=>el.click());await expect(page.locator('#ig6-identity-guide')).toBeVisible();
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),plus?'it':'en');await page.keyboard.press('Escape');await expect(guide).toBeFocused();
  if(plus)await page.locator('#isp-root header [data-isp="close"]').click();await page.keyboard.press('Escape');
 }
});
async function businessPanel(page,lang='sq'){
 await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#ig6-entry [data-ig6="open"]').click();
 await page.locator('#ig6-root [data-ig6="tab:work"]').click();
 await expect(page.locator('#ig6-business')).toBeVisible();
}
async function teamData(page){return page.evaluate(k=>JSON.parse(localStorage.getItem(k)||'{}'),TEAM_KEY)}
for(const lang of ['sq','en','it']){
 test('Business phase 3: Shop and Plus reuse administration and return focus - '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-ils="businesses"]').click();
  await page.locator('#illyrian-shop-layer [data-ils="business"][data-value="Market Arbër"]').first().click();
  const launch=page.locator('#illyrian-shop-layer [data-business-manage]');await launch.click();
  await expect(page.locator('#ig6-business-shop')).toHaveValue('shop|Market%20Arb%C3%ABr');
  await expect(page.locator('#ig6-business-actor')).toHaveValue('owner');
  await page.keyboard.press('Escape');await expect(launch).toBeFocused();
  await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
  await page.locator('#illyrian-shop-layer [data-ils="browse"]').click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:stores"]').click();
  await page.locator('#isp-root [data-isp="store:Market Arbër"]').click();
  const plus=page.locator('#isp-root [data-business-manage]');await plus.click();
  await expect(page.locator('#ig6-business-shop')).toHaveValue('shopPlus|Market%20Arb%C3%ABr');
  await page.keyboard.press('Tab');await expect(page.locator('#ig6-root')).toContainText(await page.evaluate(()=>window.IllyrianI18n.t('businessTeam:demo')));
  await page.keyboard.press('Escape');await expect(plus).toBeFocused();await expect(page.locator('#isp-root')).toBeVisible();
 });
}
test('Business phase 3: personal invitation acceptance, role changes and revoke deny access',async({page})=>{
 await businessPanel(page);
 await expect(page.locator('[data-biz-permission="ordersRead"]')).toHaveAttribute('data-allowed','true');
 await page.locator('#ig6-team-invite [name="user"]').selectOption('guest');
 await page.locator('#ig6-team-invite [name="role"]').selectOption('support');
 await page.locator('#ig6-team-invite button').click();
 expect((await teamData(page)).businessTeams[0].members.find(m=>m.userId==='guest').status).toBe('pending');
 await page.locator('#ig6-business-actor').selectOption('guest');
 await expect(page.locator('#ig6-team-reply')).toHaveCount(0);
 await page.locator('[data-ig6="biz-accept"]').click();
 await expect(page.locator('[data-biz-permission="staff"]')).toHaveAttribute('data-allowed','false');
 await expect(page.locator('#ig6-team-invite')).toHaveCount(0);
 await page.locator('#ig6-business-actor').selectOption('owner');
 await page.locator('#ig6-team-role-guest [name="role"]').selectOption('catalog');
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));await expect(page.locator('#ig6-team-role-guest [name="role"]')).toHaveValue('catalog');
 await page.locator('#ig6-team-role-guest button').click();
 await page.locator('#ig6-business-actor').selectOption('guest');
 await expect(page.locator('#ig6-team-reply')).toHaveCount(0);
 await expect(page.locator('[data-biz-permission="prices"]')).toHaveAttribute('data-allowed','true');
 await page.locator('#ig6-business-actor').selectOption('owner');
 await page.locator('[data-ig6="biz-revoke:guest"]').click();
 await page.locator('#ig6-business-actor').selectOption('guest');
 await expect(page.locator('[data-biz-denied]')).toBeVisible();
 await expect(page.locator('[data-biz-threads]')).toHaveCount(0);
});
test('Business phase 3: assignment, single reply, business sender and private actor audit',async({page})=>{
 await businessPanel(page);
 await page.locator('#ig6-team-assignment [name="assignee"]').selectOption('support');await page.locator('#ig6-team-assignment button').click();
 await page.locator('#ig6-business-actor').selectOption('support');
 await page.locator('#ig6-team-reply [name="body"]').fill('Përgjigje vetëm nga biznesi');await page.locator('#ig6-team-reply button').click();
 const preview=page.locator('[data-biz-customer-preview]');await expect(preview).toContainText('Market Arbër');await expect(preview).toContainText('Përgjigje vetëm nga biznesi');await expect(preview).not.toContainText("Drita");
 await expect(page.locator('#ig6-team-reply button')).toBeDisabled();
 const team=(await teamData(page)).businessTeams[0];expect(team.threads[0].messages.filter(m=>m.sender==='business')).toHaveLength(1);expect(team.threads[0].messages.at(-1).actorId).toBe('support');
 await expect(page.locator('[data-biz-audit]')).toHaveCount(0);
 await page.locator('#ig6-business-actor').selectOption('owner');await expect(page.locator('[data-biz-audit]')).toContainText("Drita");
 await page.reload();await businessPanel(page);await expect(page.locator('[data-biz-customer-preview]')).toContainText('Përgjigje vetëm nga biznesi');
});
test('Business phase 3: public staff consent is self-only, source-scoped and excludes inbox',async({page})=>{
 await businessPanel(page);await page.locator('#ig6-business-actor').selectOption('support');
 await page.locator('#ig6-team-public [name="public"]').check();await page.locator('#ig6-team-public button').click();
 await page.keyboard.press('Escape');
 await page.evaluate(()=>window.IllyrianShopTargets.shop.open('business','Market Arbër'));
 const staff=page.locator('#illyrian-shop-layer [data-business-staff]');await expect(staff).toContainText("Drita");await expect(staff).not.toContainText("Arta");await expect(staff).not.toContainText('Klient');
 await page.locator('#illyrian-shop-layer [data-business-manage]').click();await page.locator('#ig6-business-actor').selectOption('support');
 await page.locator('#ig6-team-public [name="public"]').uncheck();await page.locator('#ig6-team-public button').click();await page.keyboard.press('Escape');
 await expect(staff).not.toContainText("Drita");
 await page.locator('#illyrian-shop-layer [data-ils="browse"]').click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').click();await page.locator('#isp-root [data-isp="tab:stores"]').click();await page.locator('#isp-root [data-isp="store:Market Arbër"]').click();
 await expect(page.locator('#isp-root [data-business-staff]')).not.toContainText("Drita");
 await page.locator('#isp-root [data-business-manage]').click();await page.locator('#ig6-business-actor').selectOption('support');
 await expect(page.locator('#ig6-team-public [name="public"]')).not.toBeChecked();
});
test('Business phase 3: quota retains invitation/reply drafts and retries once',async({page})=>{
 await businessPanel(page);await rejectModuleWrites(page,TEAM_KEY);
 await page.locator('#ig6-team-invite [name="user"]').selectOption('guest');await page.locator('#ig6-team-invite [name="role"]').selectOption('catalog');await page.locator('#ig6-team-invite button').click();
 await expect(page.locator('#ig6-team-invite [name="user"]')).toHaveValue('guest');expect(await teamData(page)).not.toHaveProperty('businessTeams');
 await allowModuleWrites(page);await page.locator('#ig6-team-invite button').click();expect((await teamData(page)).businessTeams[0].members.filter(m=>m.userId==='guest')).toHaveLength(1);
 await page.locator('#ig6-team-assignment [name="assignee"]').selectOption('owner');await page.locator('#ig6-team-assignment button').click();
 const body=page.locator('#ig6-team-reply [name="body"]');await body.fill('Draft për Retry');await body.focus();
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));await expect(body).toHaveValue('Draft për Retry');await expect(body).toBeFocused();
 await rejectModuleWrites(page,TEAM_KEY);await page.locator('#ig6-team-reply button').click();await expect(body).toHaveValue('Draft për Retry');await expect(page.locator('[data-biz-customer-preview]')).not.toContainText('Draft për Retry');
 await allowModuleWrites(page);await page.locator('#ig6-team-reply button').click();expect((await teamData(page)).businessTeams[0].threads[0].messages.filter(m=>m.text==='Draft për Retry')).toHaveLength(1);
});
test('Business phase 3: observed cross-tab revocation closes inbox and stale send cannot overwrite',async({page,context})=>{
 await businessPanel(page);await page.locator('#ig6-team-assignment [name="assignee"]').selectOption('support');await page.locator('#ig6-team-assignment button').click();await page.locator('#ig6-business-actor').selectOption('support');await page.locator('#ig6-team-reply [name="body"]').fill('Must not send');
 const other=await context.newPage();await businessPanel(other);await other.locator('[data-ig6="biz-revoke:support"]').click();
 await expect(page.locator('[data-biz-conflict]')).toBeVisible();await expect(page.locator('#ig6-team-reply')).toHaveCount(0);await expect(page.locator('[data-biz-customer-preview]')).toHaveCount(0);
 expect((await teamData(other)).businessTeams[0].threads[0].messages.some(m=>m.text==='Must not send')).toBe(false);
 await page.reload();await businessPanel(page);await page.locator('#ig6-business-actor').selectOption('support');await expect(page.locator('[data-biz-denied]')).toBeVisible();
});
test('Business phase 3: forged actions and malformed stored rows do not grant staff access or rewrite raw',async({page})=>{
 await businessPanel(page);await page.locator('#ig6-business-actor').selectOption('catalog');
 await page.evaluate(()=>{const b=document.createElement('button');b.dataset.ig6='biz-revoke:owner';document.querySelector('#ig6-business').append(b);b.click()});expect(await teamData(page)).not.toHaveProperty('businessTeams');
 const raw=JSON.stringify({cases:[],appeals:[],audits:[{action:'replied',businessSource:'shop',businessStore:'Shije Shqiptare',actorId:{toString:'bad',valueOf:'bad'},id:{toString:'bad',valueOf:'bad'},at:null}],drafts:[],businessTeams:[{source:'shop',store:'Shije Shqiptare',members:[{userId:'owner',role:'owner',status:'active'}],threads:[]},null,{source:'bad',store:'X',members:{}},{source:'shop',store:'Market Arbër',members:[{userId:'support',role:'owner',status:'garbage',public:true},{userId:{toString:'bad',valueOf:'bad'},role:'admin',status:'active'}],threads:[{id:3,messages:'bad'}]}]});
 await page.evaluate(({k,raw})=>localStorage.setItem(k,raw),{k:TEAM_KEY,raw});await page.reload();await businessPanel(page);await page.locator('#ig6-business-shop').selectOption('shop|Shije%20Shqiptare');await expect(page.locator('[data-biz-audit]')).toBeVisible();await page.locator('#ig6-business-shop').selectOption('shop|Market%20Arb%C3%ABr');await page.locator('#ig6-business-actor').selectOption('support');await expect(page.locator('[data-biz-denied]')).toBeVisible();expect(await page.evaluate(k=>localStorage.getItem(k),TEAM_KEY)).toBe(raw);
});
test('Business phase 3: stale reply without a storage event is rejected before mutation',async({page})=>{
 await businessPanel(page);await page.locator('#ig6-team-assignment [name="assignee"]').selectOption('owner');await page.locator('#ig6-team-assignment button').click();
 await page.locator('#ig6-team-reply [name="body"]').fill('Stale reply must not persist');
 const raw=await page.evaluate(k=>{const x=JSON.parse(localStorage.getItem(k));x.businessTeams[0].threads[0].assignedTo='support';const raw=JSON.stringify(x);localStorage.setItem(k,raw);return raw},TEAM_KEY);
 await page.locator('#ig6-team-reply button').click();await expect(page.locator('[data-biz-conflict]')).toBeVisible();expect(await page.evaluate(k=>localStorage.getItem(k),TEAM_KEY)).toBe(raw);
});
test('Business phase 3: inbox text stays literal across locale changes and public projection has no messages',async({page})=>{
 await ready(page);
 const markup='<img src=x onerror="window.__teamInjected=1">';
 const raw=JSON.stringify({cases:[],appeals:[],audits:[],drafts:[],businessTeams:[{source:'shop',store:'Market Arbër',members:[{userId:'owner',role:'owner',status:'active',public:false},{userId:'support',role:'support',status:'active',public:true}],threads:[{id:'t1',subject:markup,customer:'Private Customer Demo',assignedTo:'owner',status:'open',messages:[{id:'m1',sender:'customer',actorId:'',text:markup,at:'2026-10-26'}]}]}]});
 await page.evaluate(({k,raw})=>localStorage.setItem(k,raw),{k:TEAM_KEY,raw});await page.reload();await businessPanel(page);
 await expect(page.locator('[data-biz-customer-preview]')).toContainText(markup);await expect(page.locator('#ig6-business img')).toHaveCount(0);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));await expect(page.locator('[data-biz-customer-preview]')).toContainText(markup);expect(await page.evaluate(()=>window.__teamInjected)).toBeUndefined();
 expect(await page.evaluate(k=>localStorage.getItem(k),TEAM_KEY)).toBe(raw);
 await page.keyboard.press('Escape');await page.evaluate(()=>window.IllyrianShopTargets.shop.open('business','Market Arbër'));
 const staff=page.locator('[data-business-staff]');await expect(staff).toContainText("Drita");await expect(staff).not.toContainText('Private Customer Demo');await expect(staff).not.toContainText(markup);
});
test('Business phase 3: removed business cannot redirect a staff mutation to another shop',async({page})=>{
 await ready(page);await page.evaluate(()=>localStorage.setItem('illyrian_demo_v17_shop',JSON.stringify({listings:[{id:'temp-team',kind:'Produkte',name:'Temporary fixture',store:'Temporary Business',city:'Tiranë',price:2}]})));
 await page.reload();await page.evaluate(()=>window.IllyrianGovernance.openBusiness('shop','Temporary Business'));await expect(page.locator('#ig6-business')).toContainText('Temporary Business');
 await page.evaluate(()=>localStorage.setItem('illyrian_demo_v17_shop',JSON.stringify({listings:[]})));
 await page.locator('#ig6-team-invite button').click();await expect(page.locator('[data-biz-denied]')).toBeVisible();expect(await teamData(page)).not.toHaveProperty('businessTeams');
});
test('Business phase 3: old Governance report reports conflict honestly and retains its draft',async({page,context})=>{
 await ready(page);await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();await page.locator('#ig6-entry [data-ig6="open"]').click();await page.locator('[data-ig6="tab:reports"]').click();
 await page.locator('#ig6-report [name="target"]').fill('Unsent report after team update');
 const other=await context.newPage();await businessPanel(other);await other.locator('#ig6-team-public [name="public"]').check();await other.locator('#ig6-team-public button').click();
 const saved=await other.evaluate(k=>localStorage.getItem(k),TEAM_KEY);await page.locator('#ig6-report button').click();
 await expect(page.locator('#ig6-root .ig6-note[role="status"]')).toContainText(await page.evaluate(()=>window.IllyrianI18n.t('businessTeam:conflict')));
 await expect(page.locator('#ig6-report [name="target"]')).toHaveValue('Unsent report after team update');expect(await page.evaluate(k=>localStorage.getItem(k),TEAM_KEY)).toBe(saved);
});
async function ready(page){
 await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
 await expect.poll(()=>page.evaluate(()=>Boolean(window.IllyrianI18n?.t))).toBe(true);
 const guest=page.locator('#v7-auth.visible [data-v7="guest"]');
 if(await guest.isVisible()){await guest.click();await page.locator('#v7-auth.visible [data-v7="skip-tour"]').click()}
 await expect(page.locator('#v7-auth.visible')).toHaveCount(0);
}
async function languageSettings(page){
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#screen [data-act="modal"][data-val="settings"]').click();
 await page.locator('#layer [data-act="v6-settings-section"][data-val="language"]').click();
 await expect(page.locator('#layer [data-illyrian-language]')).toHaveCount(3);
}
for(const lang of ['sq','en','it']){
 test('i18n: switching and reloading '+lang+' leaves account state unchanged',async({page})=>{
  await ready(page);
  const original=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await languageSettings(page);
  await page.locator('#layer [data-illyrian-language="'+lang+'"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(page.locator('#layer [data-illyrian-language="'+lang+'"]')).toHaveAttribute('aria-pressed','true');
  const nav={sq:'Kryefaqja',en:'Home',it:'Home'};
  await expect(page.locator('#navbar [data-act="tab"][data-val="home"] .v12-nav-label').first()).toHaveText(nav[lang]);
  expect(await page.evaluate(k=>localStorage.getItem(k),KEY)).toBe(lang);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(original);
  await page.reload({waitUntil:'load'});
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(page.locator('#navbar [data-act="tab"][data-val="home"] .v12-nav-label').first()).toHaveText(nav[lang]);
 });
}
for(const [device,expected] of [['sq-AL','sq'],['en-US','en'],['it-IT','it'],['de-DE','en']]){
 test('i18n: new-device language '+device+' -> '+expected,async({browser})=>{
  const ctx=await browser.newContext({locale:device}),page=await ctx.newPage();
  await page.goto('/ILLYRIAN_DEMO_v1.7.html',{waitUntil:'load'});
  await expect(page.locator('html')).toHaveAttribute('lang',expected);
  await ctx.close();
 });
}
test('i18next fallback, plural, Intl formatting and no user-post translation',async({page})=>{
 await ready(page);
 const result=await page.evaluate(()=>{
  const i=window.IllyrianI18n,post=document.querySelector('.post-copy');
  const original=post?.textContent||'';
  i.changeLanguage('it');
  const r={
    fallback:i.t('navigation:home',{lng:'fr'}),
    missing:i.t('nonexistent:missing'),
    singular:i.t('common:count',{count:1}),
    plural:i.t('common:count',{count:2}),
    currency:i.currency(12.5,'EUR'),
    number:i.number(1234.5),
    date:i.date(new Date('2026-10-22T12:00:00Z')),
    original,after:post?.textContent||'',
    stateBefore:localStorage.getItem('illyrian_demo_v09_state')
  };
  i.changeLanguage('sq');r.stateAfter=localStorage.getItem('illyrian_demo_v09_state');
  return r;
 });
 expect(result.fallback).toBe('Home');
 expect(result.missing).toContain('missing');
 expect(result.singular).toContain('1');
 expect(result.plural).toContain('2');
 expect(result.currency).toContain('€');
 expect(result.original).toBe(result.after);
 expect(result.stateBefore).toBe(result.stateAfter);
});
test('Italian major screens and Settings labels update after navigation',async({page})=>{
 await ready(page);
 await languageSettings(page);
 await page.locator('#layer [data-illyrian-language="it"]').click();
 await expect(page.locator('#layer .modalhead h2')).toHaveText("Lingua dell'app");
 await page.locator('#layer [data-act="v6-settings-home"]').click();
 await expect(page.locator('#layer .modalhead h2')).toHaveText('Impostazioni');
 await page.locator('#layer [data-act="close"]').click();
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await expect(page.locator('#screen .section-header h2')).toHaveText('Scopri la comunità');
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await expect(page.locator('#screen .compose-prompt')).toHaveText('A cosa stai pensando?');
});


// Cross-module regression after switching the interface language in place.
// Keep technical data-act / data-val controls stable in all three locales.
for(const lang of ['sq','en','it']){
 test('i18n module navigation survives live switch to '+lang,async({page})=>{
  await ready(page);
  await languageSettings(page);
  await page.locator('#layer [data-illyrian-language="'+lang+'"]').click();
  await page.locator('#layer [data-act="close"]').click();
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);

  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await expect(page.locator('[data-ilp-entry]').first()).toBeVisible();
  await page.locator('[data-ilp-entry]').first().click();
  await expect(page.locator('#ilp-root')).toBeVisible();
  await page.locator('#ilp-root button[data-ilp="close"]').click();

  await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
  await expect(page.locator('#il4-entry [data-il4-entry]')).toBeVisible();
  await page.locator('#il4-entry [data-il4-entry]').click();
  await expect(page.locator('#il4-root')).toBeVisible();
  await page.locator('#il4-root button[data-il4="close"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
 });
}
test('i18n preserves user-authored messages and comments resembling UI labels',async({page})=>{
 await ready(page);
 const result=await page.evaluate(async()=>{
  const parent=document.querySelector('#phone');
  const classes=['bubble me','v6-bubble me','v16-comment-list','ilp-chat','v10-share-preview'];
  const testNodes=classes.map(cls=>{
    const e=document.createElement('div');e.className=cls;e.textContent='Mbyll';parent.appendChild(e);return e;
  });
  window.IllyrianI18n.changeLanguage('it');
  await new Promise(r=>setTimeout(r,25));
  const texts=testNodes.map(e=>e.textContent);testNodes.forEach(e=>e.remove());
  return texts;
 });
 expect(result).toEqual(Array(5).fill('Mbyll'));
});
test('i18n locale catalogs remain complete and identical by semantic keys',async({page})=>{
 await ready(page);
 const parity=await page.evaluate(()=>{
  const resources=window.ILLYRIAN_LOCALES;
  const keys=l=>Object.entries(resources[l]).flatMap(([ns,o])=>Object.keys(o).map(k=>ns+':'+k)).sort();
  const base=keys('en');
  return {en:base.length,sq:keys('sq').length,it:keys('it').length,
    sameSq:JSON.stringify(base)===JSON.stringify(keys('sq')),
    sameIt:JSON.stringify(base)===JSON.stringify(keys('it'))};
 });
 expect(parity.en).toBeGreaterThanOrEqual(200);
 expect(parity.sameSq).toBe(true);expect(parity.sameIt).toBe(true);
});


for(const [lang,tag] of [['sq','sq'],['en','en'],['it','it']]){
 test('i18n marketplace EUR formats adapt to '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  const expected=await page.evaluate(l=>new Intl.NumberFormat(l,{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2}).format(12.5),lang);
  const formatted=await page.evaluate(()=>window.IllyrianI18n.currency(12.5,'EUR'));
  expect(formatted).toBe(expected);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
  const currencySample=await page.locator('#illyrian-shop-layer').innerText();
  expect(currencySample).toContain('€');
 });
}


for(const [lang,expected] of Object.entries({
 sq:{shop:'Kërko nga të gjitha dyqanet',plans:'Aktivitetet dhe organizatori',privacy:'Privatësia dhe harta',governance:'Besimi dhe menaxhimi'},
 en:{shop:'Search across all shops',plans:'Activities and organizer',privacy:'Privacy and map',governance:'Trust and management'},
 it:{shop:'Cerca in tutti i negozi',plans:'Attività e organizzatore',privacy:'Privacy e mappa',governance:'Fiducia e gestione'}
})){
 test('i18n translated modal headings for '+lang,async({page})=>{
   await ready(page);
   await languageSettings(page);
   await page.locator('#layer [data-illyrian-language="'+lang+'"]').click();
   await page.locator('#layer [data-act="close"]').click();
   await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
   await page.locator('[data-ilshop-open]').first().click();
   await expect(page.locator('#illyrian-shop-layer .ils-top small')).toHaveText(expected.shop);
   await page.keyboard.press('Escape');
   await page.locator('.head [data-act="tab"][data-val="events"]').click();
   await page.locator('[data-ilp-entry]').first().click();
   await expect(page.locator('#ilp-root .ilp-panel h2').first()).toHaveText(expected.plans);
   await page.locator('#ilp-root button[data-ilp="close"]').click();
   await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
   await page.locator('#il4-entry [data-il4-entry]').click();
   await expect(page.locator('#il4-root .il4-panel h2').first()).toHaveText(expected.privacy);
   await page.locator('#il4-root button[data-il4="close"]').click();
   await page.locator('#ig6-entry [data-ig6="open"]').click();
   await expect(page.locator('#ig6-root .ig6-panel h2').first()).toHaveText(expected.governance);
   await page.locator('#ig6-root button[data-ig6="close"]').click();
 });
}

for(const [language,expected] of Object.entries({
 sq:{added:"Produkti u shtua në shportën.",invalid:'Kontrollo kategorinë, emrin, dyqanin, qytetin dhe çmimin.',saved:'Listimi u ruajt vetëm në këtë shfletues.'},
 en:{added:"The product was added to this app cart.",invalid:'Check the category, item name, shop, city and price.',saved:'The listing was saved only in this browser.'},
 it:{added:"Il prodotto è stato aggiunto al carrello.",invalid:"Controlla categoria, nome dell'articolo, negozio, città e prezzo.",saved:"L'annuncio è stato salvato solo in questo browser."}
})){
 test('i18n Shop runtime notifications and invalid form in '+language,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),language);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-ils="detail"][data-id="p1"]').click();
  await page.locator('#illyrian-shop-layer [data-ils="add"]').click();
  await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText(expected.added);
  await page.locator('#illyrian-shop-layer [data-ils="back"]').click();
  await page.locator('#illyrian-shop-layer [data-ils="sell"]').click();
  // UI labels may translate; persisted values must stay stable across languages.
  const codes=await page.locator('#ils-sell-form').evaluate(form=>({
   categories:[...form.elements.kind.options].map(o=>o.value),
   cities:[...form.elements.city.options].map(o=>o.value),
   visibleCategory:form.elements.kind.options[0].textContent
  }));
  expect(codes.categories).toEqual(['Produkte','Makina','Prona','Banesa me qira','Shërbime','Punë']);
  expect(codes.cities).toEqual(['Tiranë','Durrës','Shkodër','Vlorë','Elbasan','Prishtinë']);
  expect(codes.visibleCategory).toBe({sq:'Produkte',en:'Products',it:'Prodotti'}[language]);
  await page.locator('#ils-sell-form').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText(expected.invalid);
  await page.locator('#ils-sell-form input[name="name"]').fill('Coffee test item');
  await page.locator('#ils-sell-form input[name="store"]').fill('Test Seller');
  await page.locator('#ils-sell-form input[name="price"]').fill('12.50');
  await page.locator('#ils-sell-form button[type="submit"]').click();
  await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText(expected.saved);
  await expect(page.locator('#illyrian-shop-layer .ils-card h3')).toContainText('Coffee test item');
 });
}

test('Shop user listing title, seller and description remain unchanged across languages',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-ils="sell"]').click();
 await page.locator('#ils-sell-form input[name="name"]').fill('Mbyll');
 await page.locator('#ils-sell-form input[name="store"]').fill('Mbyll');
 await page.locator('#ils-sell-form textarea[name="description"]').fill('Mbyll');
 await page.locator('#ils-sell-form input[name="price"]').fill('10');
 await page.locator('#ils-sell-form button[type="submit"]').click();
 await page.locator('#illyrian-shop-layer .ils-card').filter({hasText:'Mbyll'}).first().locator('[data-ils="detail"]').click();
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#illyrian-shop-layer .ils-product-cover + .ils-kind + h2')).toHaveText('Mbyll');
  await expect(page.locator('#illyrian-shop-layer .ils-seller strong')).toHaveText('Mbyll');
  await expect(page.locator('#illyrian-shop-layer p.ils-description')).toHaveText('Mbyll');
 }
});

async function denyShopStorage(page){
 await page.evaluate(()=>{
  const previous=Storage.prototype.setItem;
  window.__restoreShopSetItem=()=>{Storage.prototype.setItem=previous};
  Storage.prototype.setItem=function(key,value){
   if(key==='illyrian_demo_v17_shop')throw new DOMException('Demo storage quota exceeded','QuotaExceededError');
   return previous.call(this,key,value);
  };
 });
}
async function restoreShopStorage(page){
 await page.evaluate(()=>{window.__restoreShopSetItem?.();delete window.__restoreShopSetItem});
}
async function openShopForStorage(page){
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
}
test('Shop rolls back failed add and listing creation, then recovers after storage is restored',async({page})=>{
 await openShopForStorage(page);
 const baseline=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'));
 await page.locator('#illyrian-shop-layer [data-ils="detail"][data-id="p1"]').click();
 await denyShopStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="add"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#illyrian-shop-layer .ils-cart b')).toHaveText('0');
 await page.locator('#illyrian-shop-layer [data-ils="back"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="sell"]').click();
 await page.locator('#ils-sell-form input[name="name"]').fill('Example local item');
 await page.locator('#ils-sell-form input[name="store"]').fill('Sample seller');
 await page.locator('#ils-sell-form input[name="price"]').fill('15');
 await page.locator('#ils-sell-form button[type="submit"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#ils-sell-form')).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(baseline);
 await restoreShopStorage(page);
 await page.locator('#ils-sell-form button[type="submit"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('The listing was saved only in this browser.');
 await expect(page.locator('#illyrian-shop-layer .ils-card').filter({hasText:'Example local item'})).toHaveCount(1);
});
test('Shop failed checkout, remove and contact never show false success',async({page})=>{
 await openShopForStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="detail"][data-id="p1"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="add"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="cart"]').click();
 const baseline=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'));
 await denyShopStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="checkout"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#illyrian-shop-layer .ils-cart-row')).toHaveCount(1);
 await expect(page.locator('#illyrian-shop-layer .ils-success')).toHaveCount(0);
 await page.locator('#illyrian-shop-layer [data-ils="remove-cart"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-cart-row')).toHaveCount(1);
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(baseline);
 await page.locator('#illyrian-shop-layer [data-ils="browse"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="detail"][data-id="c1"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="contact"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#illyrian-shop-layer .ils-success')).toHaveCount(0);
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(baseline);
 await restoreShopStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="contact"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-success')).toBeVisible();
});
test('Shop failed edits and deletes preserve original local listing',async({page})=>{
 await openShopForStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="sell"]').click();
 await page.locator('#ils-sell-form input[name="name"]').fill('Original listing');
 await page.locator('#ils-sell-form input[name="store"]').fill('Original seller');
 await page.locator('#ils-sell-form input[name="price"]').fill('10');
 await page.locator('#ils-sell-form button[type="submit"]').click();
 await page.locator('#illyrian-shop-layer .ils-card').filter({hasText:'Original listing'}).locator('[data-ils="detail"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="edit"]').click();
 const baseline=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'));
 await denyShopStorage(page);
 await page.locator('#ils-sell-form input[name="name"]').fill('Changed listing');
 await page.locator('#ils-sell-form button[type="submit"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#ils-sell-form')).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(baseline);
 await page.locator('#illyrian-shop-layer [data-ils="browse"]').click();
 await page.locator('#illyrian-shop-layer [data-ils="my"]').click();
 await page.locator('#illyrian-shop-layer .ils-card').filter({hasText:'Original listing'}).locator('[data-ils="detail"]').click();
 page.on('dialog',dialog=>dialog.accept());
 await page.locator('#illyrian-shop-layer [data-ils="delete"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-toast')).toHaveText('Could not save: local storage is full.');
 await expect(page.locator('#illyrian-shop-layer h2[data-user-content]')).toHaveText('Original listing');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(baseline);
 await restoreShopStorage(page);
 await page.locator('#illyrian-shop-layer [data-ils="delete"]').click();
 await expect(page.locator('#illyrian-shop-layer .ils-card').filter({hasText:'Original listing'})).toHaveCount(0);
});

for(const locale of ['en','it']){
 test('i18n domain form codes remain unchanged in Shop Plus, Connections and Governance - '+locale,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
  const plus=await page.locator('#isp-need').evaluate(form=>({
   types:[...form.elements.type.options].map(o=>o.value),
   cities:[...form.elements.city.options].map(o=>o.value)
  }));
  expect(plus.types).toEqual(['Produkte','Makina','Prona','Banesa me qira','Shërbime','Punë']);
  expect(plus.cities).toEqual(['Tiranë','Durrës','Shkodër','Vlorë','Elbasan','Prishtinë']);
  await page.locator('#isp-root header button[data-isp="close"]').click();
  await page.keyboard.press('Escape');
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('#ilc-entry [data-ilc-entry]').click();
  await page.locator('#ilc-root [data-ilc="view:interest"]').click();
  const initial=await page.locator('#ilc-interest select[name="slot"]').evaluate(el=>[...el.options].map(o=>[o.getAttribute('value'),o.textContent]));
  expect(initial.length).toBeGreaterThan(0);
  expect(initial.every(([value])=>Boolean(value))).toBe(true);
  await page.locator('#ilc-root [data-ilc="overview"]').click();
  await page.locator('#ilc-root .ilc-sheet header button[data-ilc="close"]').click();
  await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
  await page.locator('#ig6-entry [data-ig6="open"]').click();
  await page.locator('#ig6-root [data-ig6="tab:reports"]').click();
  const reasons=await page.locator('#ig6-report select[name="reason"]').evaluate(el=>[...el.options].map(o=>o.value));
  expect(reasons).toContain('Mashtrim i dyshuar');
  expect(reasons).toContain('Shkelje privatësie');
 });
}

async function rejectModuleWrites(page,key){
 await page.evaluate(key=>{
  const previous=Storage.prototype.setItem;
  window.__restoreModuleWrites=()=>{Storage.prototype.setItem=previous};
  Storage.prototype.setItem=function(k,value){
   if(k===key)throw new DOMException('No local space','QuotaExceededError');
   return previous.call(this,k,value);
  };
 },key);
}
async function allowModuleWrites(page){
 await page.evaluate(()=>{window.__restoreModuleWrites?.();delete window.__restoreModuleWrites});
}
test('Shop Plus reverts failed buyer request instead of displaying unsaved request',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').click();
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 const key='illyrian_demo_v17_shop_plus';
 const before=await page.evaluate(key=>localStorage.getItem(key),key);
 await rejectModuleWrites(page,key);
 await page.locator('#isp-need input[name="title"]').fill('Electric bicycle request');
 await page.locator('#isp-need input[name="budget"]').fill('450');
 await page.locator('#isp-need button[type="submit"]').click();
 await expect(page.locator('#isp-root .isp-notice')).toContainText('Nuk u ruajt në këtë pajisje');
 await expect(page.locator('#isp-root .isp-card').filter({hasText:'Electric bicycle request'})).toHaveCount(0);
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#isp-need input[name="title"]').fill('Electric bicycle request');
 await page.locator('#isp-need input[name="budget"]').fill('450');
 await page.locator('#isp-need button[type="submit"]').click();
 await expect(page.locator('#isp-root .isp-card').filter({hasText:'Electric bicycle request'})).toHaveCount(1);
});
test('Connections reverts an unsaved interest and does not announce success',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('#ilc-entry [data-ilc-entry]').click();
 await page.locator('#ilc-root [data-ilc="view:interest"]').click();
 const key='illyrian_demo_v17_connections';
 const before=await page.evaluate(key=>localStorage.getItem(key),key);
 await rejectModuleWrites(page,key);
 await page.locator('#ilc-interest button[type="submit"]').click();
 await expect(page.locator('#ilc-root .ilc-note[role="status"]')).toContainText('ndryshimi nuk u ruajt');
 await expect(page.locator('#ilc-root .ilc-chosen')).toHaveCount(0);
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#ilc-interest button[type="submit"]').click();
 await expect(page.locator('#ilc-root .ilc-chosen')).toHaveCount(1);
});
test('Governance does not retain an unsaved report in simulated moderation',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#ig6-entry [data-ig6="open"]').click();
 await page.locator('#ig6-root [data-ig6="tab:reports"]').click();
 const key='illyrian_demo_v17_governance';
 const before=await page.evaluate(key=>localStorage.getItem(key),key);
 await rejectModuleWrites(page,key);
 await page.locator('#ig6-report input[name="target"]').fill('Unsaved example report');
 await page.locator('#ig6-report button[type="submit"]').click();
 await expect(page.locator('#ig6-root .ig6-note[role="status"]')).toContainText('Kufiri i të dhënave lokale');
 await expect(page.locator('#ig6-root .ig6-card').filter({hasText:'Unsaved example report'})).toHaveCount(0);
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#ig6-report input[name="target"]').fill('Unsaved example report');
 await page.locator('#ig6-report button[type="submit"]').click();
 await expect(page.locator('#ig6-root .ig6-card').filter({hasText:'Unsaved example report'})).toHaveCount(1);
});

for(const [lang,expected] of Object.entries({
 sq:{citiesInvalid:'Zgjidh dy qytete të ndryshme për këtë shembull.',citiesSaved:'Dy qytetet u ruajtën në pajisje.',reportSaved:'Raportimi u ruajt. Nuk iu dërgua askujt.',reportInvalid:'Kontrollo formularin ose kufirin e raporteve.'},
 en:{citiesInvalid:'Choose two different cities for this example.',citiesSaved:'Both cities were saved on this device.',reportSaved:'The report was saved locally. It was not sent to anyone.',reportInvalid:'Check the report form or the report limit.'},
 it:{citiesInvalid:'Scegli due città diverse per questo esempio.',citiesSaved:'Entrambe le città sono state salvate su questo dispositivo.',reportSaved:'La segnalazione è stata salvata localmente. Non è stata inviata a nessuno.',reportInvalid:'Controlla il modulo di segnalazione o il limite di segnalazioni.'}
})){
 test('Connections uses semantic '+lang+' notices and stable city values',async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('#ilc-entry [data-ilc-entry]').click();
  await page.locator('#ilc-root [data-ilc="view:cities"]').click();
  await page.locator('#ilc-cities select[name="origin"]').selectOption('Tiranë');
  await page.locator('#ilc-cities button[type="submit"]').click();
  await expect(page.locator('#ilc-root .ilc-note[role="status"]')).toHaveText(expected.citiesInvalid);
  await page.locator('#ilc-cities select[name="origin"]').selectOption('Milano');
  await page.locator('#ilc-cities button[type="submit"]').click();
  await expect(page.locator('#ilc-root .ilc-note[role="status"]')).toHaveText(expected.citiesSaved);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_connections')));
  expect(saved.home).toBe('Tiranë');
  expect(saved.origin).toBe('Milano');
 });
 test('Governance uses semantic '+lang+' notices and keeps user report text',async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
  await page.locator('#ig6-entry [data-ig6="open"]').click();
  await page.locator('#ig6-root [data-ig6="tab:reports"]').click();
  await page.locator('#ig6-report').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await expect(page.locator('#ig6-root .ig6-note[role="status"]')).toHaveText(expected.reportInvalid);
  await page.locator('#ig6-report input[name="target"]').fill('Mbyll');
  await page.locator('#ig6-report button[type="submit"]').click();
  await expect(page.locator('#ig6-root .ig6-note[role="status"]')).toHaveText(expected.reportSaved);
  const report=page.locator('#ig6-root .ig6-card h4[data-user-content]').filter({hasText:'Mbyll'});
  await expect(report).toHaveText('Mbyll');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_governance')).cases);
  expect(saved[0].target).toBe('Mbyll');
  expect(saved[0].reason).toBe('Informacion i pasaktë');
  for(const next of ['sq','en','it']){
   await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),next);
   await expect(report).toHaveText('Mbyll');
  }
 });
}

for(const [locale,notices] of Object.entries({
 sq:{invalid:'Kontrollo kërkesën, qytetin, buxhetin dhe afatin.',saved:'Kërkesa u regjistrua vetëm në këtë pajisje.',listingInvalid:'Plotëso saktë emrin, dyqanin, qytetin dhe çmimin.'},
 en:{invalid:'Check the request, city, budget and deadline.',saved:'The request was saved only on this device.',listingInvalid:'Check the item name, shop, city and price.'},
 it:{invalid:'Controlla la richiesta, la città, il budget e la scadenza.',saved:'La richiesta è stata salvata solo su questo dispositivo.',listingInvalid:"Controlla il nome dell'articolo, il negozio, la città e il prezzo."}
})){
 test('Shop Plus '+locale+' request validation and saved canonical codes',async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
  await page.locator('#isp-need').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await expect(page.locator('#isp-root .isp-notice')).toHaveText(notices.invalid);
  await page.locator('#isp-need input[name="title"]').fill('Mbyll');
  await page.locator('#isp-need input[name="budget"]').fill('300');
  await page.locator('#isp-need button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-notice')).toHaveText(notices.saved);
  const needs=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).needs);
  expect(needs[0].title).toBe('Mbyll');
  expect(needs[0].type).toBe('Produkte');
  expect(needs[0].city).toBe('Tiranë');
 });
 test('Shop Plus '+locale+' listing validation shows semantic feedback',async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="create"]').click();
  await page.locator('#isp-create').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await expect(page.locator('#isp-root .isp-notice')).toHaveText(notices.listingInvalid);
 });
}
test('Shop Plus preserves unsaved request input on storage rejection, then succeeds without retyping',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 await page.locator('#isp-need input[name="title"]').fill('Mbyll');
 await page.locator('#isp-need input[name="budget"]').fill('425');
 await page.locator('#isp-need textarea[name="details"]').fill('Custom description Mbyll');
 const storageKey='illyrian_demo_v17_shop_plus';
 const before=await page.evaluate(key=>localStorage.getItem(key),storageKey);
 await rejectModuleWrites(page,storageKey);
 await page.locator('#isp-need button[type="submit"]').click();
 await expect(page.locator('#isp-root .isp-notice')).toHaveText('Could not save on this device. Try removing old listings.');
 await expect(page.locator('#isp-need input[name="title"]')).toHaveValue('Mbyll');
 await expect(page.locator('#isp-need input[name="budget"]')).toHaveValue('425');
 await expect(page.locator('#isp-need textarea[name="details"]')).toHaveValue('Custom description Mbyll');
 expect(await page.evaluate(key=>localStorage.getItem(key),storageKey)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#isp-need button[type="submit"]').click();
 await expect(page.locator('#isp-root .isp-notice')).toHaveText('The request was saved only on this device.');
 const need=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).needs[0]);
 expect(need.title).toBe('Mbyll');
 expect(need.details).toBe('Custom description Mbyll');
});

test('Shop Plus preserves user listing title, seller and description across locale changes',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="create"]').click();
 await page.locator('#isp-create input[name="name"]').fill('Mbyll');
 await page.locator('#isp-create input[name="store"]').fill('Mbyll');
 await page.locator('#isp-create input[name="price"]').fill('10');
 await page.locator('#isp-create textarea[name="details"]').fill('Mbyll');
 await page.locator('#isp-create button[type="submit"]').click();
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#isp-root .isp-focus h3[data-user-content]')).toHaveText('Mbyll');
  await expect(page.locator('#isp-root .isp-focus p[data-user-content]')).toHaveText('Mbyll');
  await expect(page.locator('#isp-root .isp-focus p span[data-user-content]')).toHaveText('Mbyll');
 }
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
 expect(saved.name).toBe('Mbyll');
 expect(saved.store).toBe('Mbyll');
 expect(saved.details).toBe('Mbyll');
});
test('Shop Plus protects user request name and details on language switch',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 await page.locator('#isp-need input[name="title"]').fill('Mbyll');
 await page.locator('#isp-need input[name="budget"]').fill('550');
 await page.locator('#isp-need textarea[name="details"]').fill('Mbyll');
 await page.locator('#isp-need button[type="submit"]').click();
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#isp-root .isp-card h4[data-user-content]').filter({hasText:'Mbyll'})).toHaveText('Mbyll');
  await expect(page.locator('#isp-root .isp-card p[data-user-content]').filter({hasText:'Mbyll'})).toHaveText('Mbyll');
 }
});

for(const [lang,labels] of Object.entries({
 sq:{category:'Kategoria',inventory:'Inventari produkt (copë)',period:'Periudha e qirasë',month:'Për muaj',week:'Për javë',request:'Buxheti maksimal €',reason:'Arsyeja',fraud:'Mashtrim i dyshuar',days:'7 ditë',save:"Ruaj raportimin"},
 en:{category:'Category',inventory:'Product stock (units)',period:'Rental period',month:'Per month',week:'Per week',request:'Maximum budget €',reason:'Reason',fraud:'Suspected fraud',days:'7 days',save:"Save report"},
 it:{category:'Categoria',inventory:'Giacenza prodotto (unità)',period:'Periodo di affitto',month:'Al mese',week:'A settimana',request:'Budget massimo €',reason:'Motivo',fraud:'Sospetta frode',days:'7 giorni',save:"Salva segnalazione"}
})){
 test('Shop Plus static listing form is localized with immutable values: '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="create"]').click();
  const f=page.locator('#isp-create');
  await expect(f.locator('label:has(select[name="type"])')).toContainText(labels.category);
  await expect(f.locator('label:has(input[name="quantity"])')).toContainText(labels.inventory);
  await expect(f.locator('label:has(select[name="period"])')).toContainText(labels.period);
  const options=await f.locator('select[name="period"]').evaluate(el=>[...el.options].map(o=>({value:o.value,label:o.textContent.trim()})));
  expect(options).toEqual([{value:'muaj',label:labels.month},{value:'javë',label:labels.week}]);
  expect(await f.locator('select[name="type"] option').evaluateAll(nodes=>nodes.map(n=>n.value))).toEqual(['Produkte','Makina','Prona','Banesa me qira','Shërbime','Punë']);
  await f.locator('input[name="name"]').fill('Mbyll');
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang==='it'?'en':'it');
  await expect(f.locator('input[name="name"]')).toHaveValue('Mbyll');
  expect(await f.locator('select[name="type"] option').evaluateAll(nodes=>nodes.map(n=>n.value))).toEqual(['Produkte','Makina','Prona','Banesa me qira','Shërbime','Punë']);
 });
 test('Shop Plus static request form labels translate and keep deadline values: '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
  const f=page.locator('#isp-need');
  await expect(f.locator('label:has(input[name="budget"])')).toContainText(labels.request);
  const dates=await f.locator('select[name="days"]').evaluate(el=>[...el.options].map(o=>({code:o.value,label:o.textContent.trim()})));
  expect(dates.map(x=>x.code)).toEqual(['7','14','30']);
  expect(dates[0].label).toBe(labels.days);
  await f.locator('input[name="title"]').fill('Local buyer request');
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang==='en'?'sq':'en');
  await expect(f.locator('input[name="title"]')).toHaveValue('Local buyer request');
 });
 test('Shop Plus report reason labels localize without changing reason codes: '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="item:k1"]').click();
  await page.locator('#isp-root [data-isp="report:k1"]').click();
  const f=page.locator('#isp-report');
  await expect(f.locator('label:has(select[name="reason"])')).toContainText(labels.reason);
  const options=await f.locator('select[name="reason"]').evaluate(el=>[...el.options].map(o=>({code:o.value,label:o.textContent.trim()})));
  expect(options.map(x=>x.code)).toEqual(['Informacion i pasaktë','Mashtrim i dyshuar','Listim i dyfishuar','Përmbajtje e papërshtatshme']);
  expect(options[1].label).toBe(labels.fraud);
  await expect(f.locator('button[type="submit"]')).toHaveText(labels.save);
  await f.locator('select[name="reason"]').selectOption('Mashtrim i dyshuar');
  await f.locator('textarea[name="detail"]').fill('Mbyll');
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang==='it'?'sq':'it');
  await expect(f.locator('select[name="reason"]')).toHaveValue('Mashtrim i dyshuar');
  await expect(f.locator('textarea[name="detail"]')).toHaveValue('Mbyll');
 });
}

test('Plans rejects unsaved event creation without losing form input or stored data',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 await page.locator('#ilp-root [data-ilp="new"]').click();
 const form=page.locator('#ilp-form');
 await form.locator('input[name="title"]').fill('Weekend plan Mbyll');
 await form.locator('input[name="place"]').fill('Public meeting location');
 const key='illyrian_demo_v17_plans';
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await rejectModuleWrites(page,key);
 await form.locator('button[type="submit"]').click();
 await expect(form).toBeVisible();
 await expect(form.locator('#ilp-error')).toHaveText('Nuk mund të ruhej ndryshimi në pajisje.');
 await expect(form.locator('input[name="title"]')).toHaveValue('Weekend plan Mbyll');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await allowModuleWrites(page);
 await form.locator('button[type="submit"]').click();
 await expect(page.locator('#ilp-root .ilp-card h3[data-user-content]')).toHaveCount(0);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_plans')).events);
 expect(saved.some(x=>x.title==='Weekend plan Mbyll')).toBe(true);
 await expect(page.locator('#ilp-root h3[data-user-content]')).toHaveText('Weekend plan Mbyll');
});
test('Plans failed cancel restores stored event and never claims success',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 await page.locator('#ilp-root [data-ilp="detail:demo-football"]').click();
 const key='illyrian_demo_v17_plans';
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await rejectModuleWrites(page,key);
 page.on('dialog',dlg=>dlg.accept());
 await page.locator('#ilp-root [data-ilp="cancel"]').click();
 await expect(page.locator('#ilp-root .ilp-notice')).toHaveText('Nuk mund të ruhej ndryshimi në pajisje.');
 await expect(page.locator('#ilp-root [data-ilp="cancel"]')).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#ilp-root [data-ilp="cancel"]').click();
 await expect(page.locator('#ilp-root .ilp-notice')).toHaveText('Aktiviteti u anulua.');
});

for(const [locale,messages] of Object.entries({
 en:{bad:'Title or location is too short.',saved:"Activity saved on this device.",quota:'Could not save the change on this device.'},
 it:{bad:'Il titolo o il luogo è troppo breve.',saved:"Attività salvata in locale.",quota:'Impossibile salvare la modifica sul dispositivo.'}
})){
 test('Plans semantic validation and success feedback in '+locale,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('[data-ilp-entry]').first().click();
  await page.locator('#ilp-root [data-ilp="new"]').click();
  const form=page.locator('#ilp-form');
  await form.evaluate(el=>el.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await expect(form.locator('#ilp-error')).toHaveText(messages.bad);
  await form.locator('input[name="title"]').fill('Mbyll plan');
  await form.locator('input[name="place"]').fill('Public meeting square');
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('#ilp-root .ilp-notice')).toHaveText(messages.saved);
  await expect(page.locator('#ilp-root h3[data-user-content]')).toHaveText('Mbyll plan');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_plans')).events[0]);
  expect(saved.title).toBe('Mbyll plan');
  expect(saved.kind).toBe('Sport');
  expect(saved.city).toBe('Tiranë');
 });
 test('Plans localized storage rejection in '+locale+' preserves editable input',async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('[data-ilp-entry]').first().click();
  await page.locator('#ilp-root [data-ilp="new"]').click();
  const form=page.locator('#ilp-form');
  await form.locator('input[name="title"]').fill('Original Mbyll activity');
  await form.locator('input[name="place"]').fill('Public location');
  const key='illyrian_demo_v17_plans',before=await page.evaluate(k=>localStorage.getItem(k),key);
  await rejectModuleWrites(page,key);
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('#ilp-error')).toHaveText(messages.quota);
  await expect(form.locator('input[name="title"]')).toHaveValue('Original Mbyll activity');
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
  await allowModuleWrites(page);
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('#ilp-root .ilp-notice')).toHaveText(messages.saved);
 });
}

test('Privacy rolls back unsaved private follow request and retries successfully',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 const key='illyrian_demo_v17_privacy_map',before=await page.evaluate(k=>localStorage.getItem(k),key);
 await rejectModuleWrites(page,key);
 await page.locator('#il4-root [data-il4="follow-request"]').click();
 await expect(page.locator('#il4-root .il4-notice')).toHaveText('Change not saved; local storage is full.');
 await expect(page.locator('#il4-root [data-il4="follow-request"]')).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#il4-root [data-il4="follow-request"]').click();
 await expect(page.locator('#il4-root .il4-notice')).toHaveText("Action saved on this device.");
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_privacy_map')));
 expect(saved.follow.leon).toBe('pending');
});
test('Privacy quota failure restores group membership status',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 await page.locator('#il4-root [data-il4="tab:groups"]').click();
 const key='illyrian_demo_v17_privacy_map',before=await page.evaluate(k=>localStorage.getItem(k),key);
 await rejectModuleWrites(page,key);
 await page.locator('#il4-root [data-il4="group-request"]').click();
 await expect(page.locator('#il4-root .il4-notice')).toHaveText('Modifica non salvata: lo spazio locale è esaurito.');
 await expect(page.locator('#il4-root [data-il4="group-request"]')).toBeVisible();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#il4-root [data-il4="group-request"]').click();
 await expect(page.locator('#il4-root .il4-notice')).toHaveText("Adesione/richiesta salvata in locale.");
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_privacy_map')));
 expect(saved.membership['albania-milan']).toBe('pending');
});
for(const [locale,labels] of Object.entries({
 sq:{all:'Të gjitha',activities:'Aktivitete',business:'Biznese',available:'Mund të kërkosh pjesëmarrje nga aktiviteti origjinal.',accepted:'I pranuar'},
 en:{all:'All',activities:'Activities',business:'Businesses',available:'You can request to join from the original activity.',accepted:'Accepted'},
 it:{all:'Tutte',activities:'Attività',business:'Attività commerciali',available:"Puoi richiedere di partecipare dall'attività originale.",accepted:'Accettato'}
})){
 test('Privacy stable map filter values and translated labels in '+locale,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),locale);
  await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
  await page.locator('#il4-entry [data-il4-entry]').click();
  await page.locator('#il4-root [data-il4="tab:map"]').click();
  const opts=await page.locator('#il4-mapform select[name="kind"]').evaluate(el=>[...el.options].map(x=>({value:x.value,label:x.textContent.trim()})));
  expect(opts).toEqual([{value:'all',label:labels.all},{value:'activity',label:labels.activities},{value:'business',label:labels.business}]);
  await page.locator('#il4-mapform select[name="kind"]').selectOption('business');
  await page.locator('#il4-mapform button[type="submit"]').click();
  await expect(page.locator('#il4-mapform select[name="kind"]')).toHaveValue('business');
  await page.locator('#il4-root [data-il4="tab:states"]').click();
  await page.locator('#il4-root [data-il4="state:available"]').first().click();
  await expect(page.locator('#il4-root .il4-notice')).toContainText(labels.available);
 });
}
test('Privacy does not translate user-entered activity title on map',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  const day=new Date(Date.now()+14*24*60*60*1000).toISOString().slice(0,10);
  localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({events:[{id:'custom-map',title:'Mbyll',privacy:'public',cancelled:false,date:day,time:'17:00',city:'Tiranë'}],requests:[]}));
 });
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 await page.locator('#il4-root [data-il4="tab:map"]').click();
 await page.locator('#il4-root .il4-results [data-il4="pin:plan-0"]').click();
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#il4-root .il4-card h4[data-user-content]')).toHaveText('Mbyll');
 }
});

for(const [lang,expected] of Object.entries({
 sq:{title:'Privatësia dhe harta',profiles:'Profilet',groups:'Komunitetet',visitor:'Shiko si vizitor',footer:'Vetëm demonstrim lokal · Nuk ka përdorues, hartë, mesazhe apo kërkesa reale.'},
 en:{title:'Privacy and map',profiles:'Profiles',groups:'Communities',visitor:'View as visitor',footer:"Local Local only · No real users, map, messages or requests."},
 it:{title:'Privacy e mappa',profiles:'Profili',groups:'Comunità',visitor:'Visualizza come visitatore',footer:"Solo locale · Nessun utente, mappa, messaggio o richiesta reale."}
})){
 test('Privacy direct semantic labels render in '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
  await page.locator('#il4-entry [data-il4-entry]').click();
  await expect(page.locator('#il4-root .il4-head h2')).toHaveText(expected.title);
  await expect(page.locator('#il4-root [data-il4="tab:profiles"]')).toHaveText(expected.profiles);
  await expect(page.locator('#il4-root [data-il4="tab:groups"]')).toHaveText(expected.groups);
  await expect(page.locator('#il4-root [data-il4="role:visitor"]')).toHaveText(expected.visitor);
  await expect(page.locator('#il4-root footer')).toHaveText(expected.footer);
 });
}
test('Privacy open map keeps unsubmitted filters and focus on live language switch',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 await page.locator('#il4-root [data-il4="tab:map"]').click();
 const form=page.locator('#il4-mapform');
 await form.locator('select[name="city"]').selectOption('Milano');
 await form.locator('select[name="kind"]').selectOption('business');
 await form.locator('input[name="q"]').fill('Mbyll kërkim');
 await form.locator('input[name="q"]').focus();
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await expect(page.locator('#il4-root .il4-head h2')).toHaveText('Privacy and map');
 await expect(page.locator('#il4-mapform select[name="city"]')).toHaveValue('Milano');
 await expect(page.locator('#il4-mapform select[name="kind"]')).toHaveValue('business');
 await expect(page.locator('#il4-mapform input[name="q"]')).toHaveValue('Mbyll kërkim');
 expect(await page.evaluate(()=>document.activeElement?.getAttribute('name'))).toBe('q');
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(page.locator('#il4-root .il4-head h2')).toHaveText('Privacy e mappa');
 await expect(page.locator('#il4-mapform input[name="q"]')).toHaveValue('Mbyll kërkim');
});
test('Privacy profile and group user-origin fields remain unchanged through locale switches',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 await page.locator('#il4-root [data-il4="role:owner"]').click();
 const profile=page.locator('#il4-root .il4-card h4[data-user-content]');
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(profile).toHaveText('Leon M.');
  await expect(page.locator('#il4-root .il4-card p[data-user-content]')).toHaveText('Përshkrim privat që nuk duhet shfaqur pa miratim.');
 }
 await page.locator('#il4-root [data-il4="tab:groups"]').click();
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#il4-root .il4-card h4[data-user-content]')).toHaveText('Shqiptarët në Milano');
 }
});

for(const [lang,expectations] of Object.entries({
 sq:{groups:'Komunitete me rregulla dhe role',map:'Zbulo aktivitetet dhe bizneset sipas qytetit',city:'Qyteti',kind:'Lloji',button:'Filtro',placeholder:'P.sh. kafe, futboll, dyqan',states:'Gjendjet e aktiviteteve dhe kthimi i sigurt'},
 en:{groups:'Communities with rules and roles',map:'Discover activities and businesses by city',city:'City',kind:'Type',button:'Filter',placeholder:'E.g. café, football, shop',states:'Activity statuses and safe navigation'},
 it:{groups:'Comunità con regole e ruoli',map:'Scopri attività e aziende per città',city:'Città',kind:'Tipo',button:'Filtra',placeholder:'Es. bar, calcio, negozio',states:'Stati delle attività e navigazione sicura'}
})){
 test('Privacy direct map, group and plan-state headings in '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
  await page.locator('#il4-entry [data-il4-entry]').click();
  await page.locator('#il4-root [data-il4="tab:groups"]').click();
  await expect(page.locator('#il4-root h3').first()).toHaveText(expectations.groups);
  await page.locator('#il4-root [data-il4="tab:map"]').click();
  await expect(page.locator('#il4-root h3').first()).toHaveText(expectations.map);
  const form=page.locator('#il4-mapform');
  await expect(form.locator('label:has(select[name="city"])')).toContainText(expectations.city);
  await expect(form.locator('label:has(select[name="kind"])')).toContainText(expectations.kind);
  await expect(form.locator('input[name="q"]')).toHaveAttribute('placeholder',expectations.placeholder);
  await expect(form.locator('button[type="submit"]')).toHaveText(expectations.button);
  const kinds=await form.locator('select[name="kind"] option').evaluateAll(nodes=>nodes.map(x=>x.value));
  expect(kinds).toEqual(['all','activity','business']);
  const cityCodes=await form.locator('select[name="city"] option').evaluateAll(nodes=>nodes.map(x=>x.value));
  expect(cityCodes).toContain('Tiranë');
  await page.locator('#il4-root [data-il4="tab:states"]').click();
  await expect(page.locator('#il4-root h3').first()).toHaveText(expectations.states);
 });
}

test('Direct i18n binding is never overwritten by phrase translation collisions',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 await expect(page.locator('#il4-root [data-il4="tab:profiles"]')).toHaveText('Profili');
 await page.evaluate(()=>{
  const marker=document.createElement('span');
  marker.id='i18n-direct-probe';marker.dataset.i18nDirect='1';
  marker.textContent='Profili';document.querySelector('#phone').append(marker);
 });
 await expect(page.locator('#i18n-direct-probe')).toHaveText('Profili');
 for(const lang of ['en','sq','it']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#i18n-direct-probe')).toHaveText('Profili');
 }
});

for(const [lang,expected] of Object.entries({
 sq:{create:'Krijo aktivitetin',type:'Lloji',city:'Qyteti',place:'Vendi',kind:'Miqësi dhe komunitet',privacy:'Dukshmëria',private:'Privat',submit:"Publiko aktivitetin"},
 en:{create:'Create activity',type:'Type',city:'City',place:'Location',kind:'Friendship and community',privacy:'Visibility',private:'Private',submit:"Publish activity"},
 it:{create:'Crea attività',type:'Tipo',city:'Città',place:'Luogo',kind:'Amicizia e comunità',privacy:'Visibilità',private:'Privato',submit:"Pubblica attività"}
})){
 test('Plans direct semantic form labels and unchanged option codes in '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('[data-ilp-entry]').first().click();
  await page.locator('#ilp-root [data-ilp="new"]').click();
  const form=page.locator('#ilp-form');
  await expect(page.locator('#ilp-root h3[data-i18n-direct]')).toHaveText(expected.create);
  await expect(form.locator('label:has(select[name="kind"])')).toContainText(expected.type);
  await expect(form.locator('label:has(select[name="city"])')).toContainText(expected.city);
  await expect(form.locator('label:has(input[name="place"])')).toContainText(expected.place);
  await expect(form.locator('label:has(select[name="privacy"])')).toContainText(expected.privacy);
  const types=await form.locator('select[name="kind"] option').evaluateAll(x=>x.map(z=>({value:z.value,label:z.textContent.trim()})));
  expect(types.map(x=>x.value)).toEqual(['Sport','Miqësi dhe komunitet','Kulturë','Alumni','Bashkëpunim']);
  expect(types[1].label).toBe(expected.kind);
  const vis=await form.locator('select[name="privacy"] option').evaluateAll(x=>x.map(z=>({value:z.value,label:z.textContent.trim()})));
  expect(vis.map(x=>x.value)).toEqual(['public','private']);
  expect(vis[1].label).toBe(expected.private);
  await expect(form.locator('button[type="submit"]')).toHaveText(expected.submit);
 });
}
test('Plans live language switching keeps every unsaved field, canonical selections and focus',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 await page.locator('#ilp-root [data-ilp="new"]').click();
 const form=page.locator('#ilp-form');
 await form.locator('input[name="title"]').fill('Mbyll takim komuniteti');
 await form.locator('select[name="kind"]').selectOption('Miqësi dhe komunitet');
 await form.locator('select[name="city"]').selectOption('Milano');
 await form.locator('input[name="place"]').fill('Mbyll public square');
 await form.locator('input[name="capacity"]').fill('15');
 await form.locator('input[name="price"]').fill('12.5');
 await form.locator('select[name="privacy"]').selectOption('private');
 await form.locator('textarea[name="conditions"]').fill('Mbyll - participant supplied conditions');
 await form.locator('textarea[name="conditions"]').focus();
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(form.locator('input[name="title"]')).toHaveValue('Mbyll takim komuniteti');
  await expect(form.locator('select[name="kind"]')).toHaveValue('Miqësi dhe komunitet');
  await expect(form.locator('select[name="city"]')).toHaveValue('Milano');
  await expect(form.locator('input[name="place"]')).toHaveValue('Mbyll public square');
  await expect(form.locator('input[name="capacity"]')).toHaveValue('15');
  await expect(form.locator('input[name="price"]')).toHaveValue('12.5');
  await expect(form.locator('select[name="privacy"]')).toHaveValue('private');
  await expect(form.locator('textarea[name="conditions"]')).toHaveValue('Mbyll - participant supplied conditions');
  expect(await page.evaluate(()=>document.activeElement?.name)).toBe('conditions');
 }
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(before);
});
test('Plans user-authored place, event title and conditions are stable when locale switches',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 await page.locator('#ilp-root [data-ilp="new"]').click();
 const form=page.locator('#ilp-form');
 await form.locator('input[name="title"]').fill('Mbyll gathering');
 await form.locator('input[name="place"]').fill('Mbyll');
 await form.locator('textarea[name="conditions"]').fill('Mbyll');
 await form.locator('button[type="submit"]').click();
 const node=page.locator('#ilp-root');
 for(const lang of ['en','sq','it']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(node.locator('h3[data-user-content]')).toHaveText('Mbyll gathering');
  await expect(node.locator('span[data-user-content]')).toHaveText('Mbyll');
  await expect(node.locator('p[data-user-content]')).toHaveText('Mbyll');
 }
 const actual=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_plans')).events[0]);
 expect(actual.title).toBe('Mbyll gathering');
 expect(actual.place).toBe('Mbyll');
 expect(actual.conditions).toBe('Mbyll');
});

for(const [lang,label] of Object.entries({
 sq:{create:"Publiko ofertë lokalisht",category:'Kategoria',seller:'Dyqani / shitësi',period:'Periudha e qirasë',month:'Për muaj',week:'Për javë',product:'Produkte',request:'Kërkoj',budget:'Buxheti maksimal €',deadline:'7 ditë',report:'Arsyeja',fraud:'Mashtrim i dyshuar',submit:"Ruaj raportimin",search:'Kërko',apply:'Apliko filtrat',sort:'Renditja',title:'Shop i avancuar'},
 en:{create:"Publish offer on this device",category:'Category',seller:'Shop / seller',period:'Rental period',month:'Per month',week:'Per week',product:'Products',request:'Looking for',budget:'Maximum budget €',deadline:'7 days',report:'Reason',fraud:'Suspected fraud',submit:"Save report",search:'Search',apply:'Apply filters',sort:'Sort',title:'Advanced Shop'},
 it:{create:"Pubblica offerta in locale",category:'Categoria',seller:'Negozio / venditore',period:'Periodo di affitto',month:'Al mese',week:'A settimana',product:'Prodotti',request:'Cerco',budget:'Budget massimo €',deadline:'7 giorni',report:'Motivo',fraud:'Sospetta frode',submit:"Salva segnalazione",search:'Cerca',apply:'Applica filtri',sort:'Ordina',title:'Shop avanzato'}
})){
 test('Shop Plus direct catalog and listing labels retain domain codes: '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await expect(page.locator('#isp-root header h2[data-i18n-direct]')).toHaveText(label.title);
  const filters=page.locator('#isp-filters');
  await expect(filters.locator('label:has(input[name="q"])')).toContainText(label.search);
  await expect(filters.locator('label:has(select[name="sort"])')).toContainText(label.sort);
  await expect(filters.locator('button[type="submit"]')).toHaveText(label.apply);
  expect(await filters.locator('select[name="sort"] option').evaluateAll(a=>a.map(e=>e.value))).toEqual(['relevance','lowest','highest','name']);
  await page.locator('#isp-root [data-isp="create"]').click();
  const form=page.locator('#isp-create');
  await expect(page.locator('#isp-root h3[data-i18n-direct]')).toHaveText(label.create);
  await expect(form.locator('label:has(select[name="type"])')).toContainText(label.category);
  await expect(form.locator('label:has(input[name="store"])')).toContainText(label.seller);
  await expect(form.locator('label:has(select[name="period"])')).toContainText(label.period);
  const types=await form.locator('select[name="type"] option').evaluateAll(a=>a.map(e=>({value:e.value,text:e.textContent.trim()})));
  expect(types[0]).toEqual({value:'Produkte',text:label.product});
  expect(types.map(x=>x.value)).toEqual(['Produkte','Makina','Prona','Banesa me qira','Shërbime','Punë']);
  const period=await form.locator('select[name="period"] option').evaluateAll(a=>a.map(e=>({value:e.value,text:e.textContent.trim()})));
  expect(period).toEqual([{value:'muaj',text:label.month},{value:'javë',text:label.week}]);
  await expect(form.locator('button[type="submit"]')).toHaveText({sq:"Publiko lokalisht",en:"Publish on this device",it:"Pubblica in locale"}[lang]);
 });
 test('Shop Plus direct buyer request and report preserve canonical codes: '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
  const need=page.locator('#isp-need');
  await expect(need.locator('label:has(input[name="title"])')).toContainText(label.request);
  await expect(need.locator('label:has(input[name="budget"])')).toContainText(label.budget);
  const days=await need.locator('select[name="days"] option').evaluateAll(a=>a.map(e=>({value:e.value,text:e.textContent.trim()})));
  expect(days[0]).toEqual({value:'7',text:label.deadline});
  expect(days.map(x=>x.value)).toEqual(['7','14','30']);
  await page.locator('#isp-root [data-isp="tab:catalog"]').click();
  await page.locator('#isp-root [data-isp="item:k1"]').click();
  await page.locator('#isp-root [data-isp="report:k1"]').click();
  const form=page.locator('#isp-report');
  await expect(form.locator('label:has(select[name="reason"])')).toContainText(label.report);
  const reasons=await form.locator('select[name="reason"] option').evaluateAll(a=>a.map(e=>({value:e.value,text:e.textContent.trim()})));
  expect(reasons[1]).toEqual({value:'Mashtrim i dyshuar',text:label.fraud});
  await expect(form.locator('button[type="submit"]')).toHaveText(label.submit);
 });
}
test('Shop Plus language changes retain unsent listing and buyer request fields and focus',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="create"]').click();
 const listing=page.locator('#isp-create');
 await listing.locator('select[name="type"]').selectOption('Banesa me qira');
 await listing.locator('input[name="name"]').fill('Mbyll banesë');
 await listing.locator('input[name="store"]').fill('Mbyll seller');
 await listing.locator('select[name="city"]').selectOption('Durrës');
 await listing.locator('input[name="price"]').fill('440.5');
 await listing.locator('select[name="period"]').selectOption('javë');
 await listing.locator('textarea[name="details"]').fill('Mbyll, untranslated user description');
 await listing.locator('textarea[name="details"]').focus();
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
 for(const lang of ['en','it','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(listing.locator('select[name="type"]')).toHaveValue('Banesa me qira');
  await expect(listing.locator('input[name="name"]')).toHaveValue('Mbyll banesë');
  await expect(listing.locator('input[name="store"]')).toHaveValue('Mbyll seller');
  await expect(listing.locator('select[name="city"]')).toHaveValue('Durrës');
  await expect(listing.locator('input[name="price"]')).toHaveValue('440.5');
  await expect(listing.locator('select[name="period"]')).toHaveValue('javë');
  await expect(listing.locator('textarea[name="details"]')).toHaveValue('Mbyll, untranslated user description');
  expect(await page.evaluate(()=>document.activeElement?.getAttribute('name'))).toBe('details');
 }
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(before);
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 const request=page.locator('#isp-need');
 await request.locator('input[name="title"]').fill('Mbyll request');
 await request.locator('select[name="type"]').selectOption('Makina');
 await request.locator('input[name="budget"]').fill('330');
 await request.locator('textarea[name="details"]').fill('Mbyll custom details');
 await request.locator('textarea[name="details"]').focus();
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(request.locator('input[name="title"]')).toHaveValue('Mbyll request');
 await expect(request.locator('select[name="type"]')).toHaveValue('Makina');
 await expect(request.locator('input[name="budget"]')).toHaveValue('330');
 await expect(request.locator('textarea[name="details"]')).toHaveValue('Mbyll custom details');
 expect(await page.evaluate(()=>document.activeElement?.getAttribute('name'))).toBe('details');
});
test('Shop Plus report form keeps unsent reason and text on locale switch',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="item:k1"]').click();
 await page.locator('#isp-root [data-isp="report:k1"]').click();
 const report=page.locator('#isp-report');
 await report.locator('select[name="reason"]').selectOption('Mashtrim i dyshuar');
 await report.locator('textarea[name="detail"]').fill('Mbyll');
 await report.locator('textarea[name="detail"]').focus();
 for(const lang of ['it','en','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(report.locator('select[name="reason"]')).toHaveValue('Mashtrim i dyshuar');
  await expect(report.locator('textarea[name="detail"]')).toHaveValue('Mbyll');
  expect(await page.evaluate(()=>document.activeElement?.getAttribute('name'))).toBe('detail');
 }
});

for(const [lang,labels] of Object.entries({
 sq:{tag:'ILLYRIAN SHOP · KËRKIM I AVANCUAR',intro:"Krahaso dyqanet dhe shiko karakteristikat e ofertave. Çdo listim është.",stock:'Inventari:',sold:"Pa stok",promoted:"PROMOVUAR",compare:'I njëjti produkt, disa dyqane',shops:'Dyqanet e vogla',demoListings:"listime",open:'Hap katalogun',fee:'Komision ilustrues 5%:',flow:'Rrjedhë ilustruese',simulate:'Simulo porosinë (pa pagesë)',created:"E krijuar lokalisht",return:"Kërkesë anulimi/kthimi"},
 en:{tag:'ILLYRIAN SHOP · ADVANCED SEARCH',intro:"Compare shops and browse offer details.",stock:'Stock:',sold:"Out of stock",promoted:"SPONSORED",compare:'Same product, multiple shops',shops:'Small shops',demoListings:"listings",open:'Open catalog',fee:'Illustrative 5% fee:',flow:'Illustrative flow',simulate:'Simulate order (no payment)',created:"Created on this device",return:"Cancellation/return requested"},
 it:{tag:'ILLYRIAN SHOP · RICERCA AVANZATA',intro:"Confronta i negozi e consulta le caratteristiche delle offerte.",stock:'Disponibilità:',sold:"Esaurito",promoted:"SPONSORIZZATO",compare:'Stesso prodotto, più negozi',shops:'Piccoli negozi',demoListings:"annunci",open:'Apri catalogo',fee:'Commissione illustrativa del 5%:',flow:'Flusso illustrativo',simulate:'Simula ordine (nessun pagamento)',created:"Creato in locale",return:"Annullamento/reso richiesto"}
})){
 test('Shop Plus catalog cards, comparison and sponsored disclaimers in '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(x=>window.IllyrianI18n.changeLanguage(x),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await expect(page.locator('#isp-root .isp-hero b[data-i18n-direct]')).toHaveText(labels.tag);
  await expect(page.locator('#isp-root .isp-hero p[data-i18n-direct]')).toHaveText(labels.intro);
  await expect(page.locator('#isp-root .isp-compare h3[data-i18n-direct]')).toHaveText(labels.compare);
  await expect(page.locator('#isp-root .isp-sponsored').first()).toHaveText(labels.promoted);
  const sold=page.locator('#isp-root .isp-card').filter({hasText:'Market Bora'});
  await expect(sold.locator('p').last()).toContainText(labels.sold);
  const seeded=page.locator('#isp-root .isp-card').filter({hasText:'Market Arbër'});
  await expect(seeded.locator('p').last()).toContainText(labels.stock);
  await expect(seeded.locator('h4[data-user-content]')).toHaveText('Kafe espresso 250 g');
  await expect(seeded.locator('span[data-user-content]')).toHaveText('Market Arbër');
  const codes=await page.locator('#isp-root .isp-kinds [data-isp^="type:"]').evaluateAll(nodes=>nodes.map(x=>x.dataset.isp));
  expect(codes).toEqual(['type:Të gjitha','type:Produkte','type:Makina','type:Prona','type:Banesa me qira','type:Shërbime','type:Punë']);
 });
 test('Shop Plus seller directory and simulated fee labels translate in '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(x=>window.IllyrianI18n.changeLanguage(x),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:stores"]').click();
  await expect(page.locator('#isp-root h3[data-i18n-direct]')).toHaveText(labels.shops);
  const row=page.locator('#isp-root .isp-card').filter({hasText:'Market Arbër'});
  await expect(row.locator('h4[data-user-content]')).toHaveText('Market Arbër');
  await expect(row).toContainText(labels.demoListings);
  await expect(row.locator('[data-isp^="store:"]')).toHaveText(labels.open);
  await page.locator('#isp-root [data-isp="tab:checkout"]').click();
  await expect(page.locator('#isp-root h4[data-i18n-direct]')).toHaveText(labels.flow);
  await expect(page.locator('#isp-root b[data-i18n-direct]').filter({hasText:'5%'})).toHaveText(labels.fee);
  await expect(page.locator('#isp-root [data-isp="sample-order"]')).toHaveText(labels.simulate);
  await expect(page.locator('#isp-root .isp-muted')).toContainText('5%');
  await expect(page.locator('#isp-root .isp-muted')).toContainText(lang==='en'?'not an approved fee':lang==='it'?'non è una commissione approvata':'nuk është tarifë e miratuar');
 });
}
test('Shop Plus order state retains original persisted enum while display localizes',async({page})=>{
 await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:checkout"]').click();
 await page.locator('#isp-root [data-isp="sample-order"]').click();
 const key='illyrian_demo_v17_shop_plus';
 let rows=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).sampleOrders,key);
 expect(rows.length).toBe(1);
 expect(rows[0].status).toBe('E krijuar në demo');
 const id=rows[0].id;
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await expect(page.locator('#isp-root .isp-card').filter({hasText:id})).toContainText("Created on this device");
 await page.locator('#isp-root [data-isp="sample-cancel:'+id+'"]').click();
 rows=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).sampleOrders,key);
 expect(rows[0].status).toBe('Kërkesë anulimi/kthimi (demo)');
 await expect(page.locator('#isp-root .isp-card').filter({hasText:id})).toContainText("Cancellation/return requested");
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(page.locator('#isp-root .isp-card').filter({hasText:id})).toContainText("Annullamento/reso richiesto");
});

test('Shop Plus does not mislabel unrecognized persisted order statuses as return requests',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  const key='illyrian_demo_v17_shop_plus';
  localStorage.setItem(key,JSON.stringify({items:[],needs:[],answers:[],flags:[],sampleOrders:[{id:'unknown-test',status:'Mbyll'}]}));
 });
 await page.reload({waitUntil:'load'});
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:checkout"]').click();
 const order=page.locator('#isp-root .isp-card').filter({hasText:'unknown-test'});
 await expect(order).toContainText('Mbyll');
 await expect(order).not.toContainText('Cancellation/return requested');
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(order).toContainText('Mbyll');
});


for(const [language,labels] of Object.entries({
 sq:{back:'← Kthehu te rezultatet',stock:'Gjendja:',fuel:'Karburanti:',diesel:'Naftë',area:'Sipërfaqe:',rental:'Qira për muaj',unit:'copë',report:'Raporto listimin'},
 en:{back:'← Back to results',stock:'Availability:',fuel:'Fuel:',diesel:'Diesel',area:'Area:',rental:'Rental per month',unit:'units',report:'Report listing'},
 it:{back:'← Torna ai risultati',stock:'Disponibilità:',fuel:'Carburante:',diesel:'Diesel',area:'Superficie:',rental:'Affitto per mese',unit:'unità',report:'Segnala annuncio'}
})){
 test('Shop Plus localized product vehicle and rental detail with stable seed content in '+language,async({page})=>{
  await ready(page);
  await page.evaluate(lang=>window.IllyrianI18n.changeLanguage(lang),language);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="item:k1"]').click();
  const detail=page.locator('#isp-root .isp-focus');
  await expect(page.locator('#isp-root [data-isp="catalog"]')).toHaveText(labels.back);
  await expect(detail).toContainText(labels.stock);
  await expect(detail).toContainText(labels.unit);
  await expect(detail).toContainText(labels.report);
  await expect(detail.locator('h3[data-user-content]')).toHaveText('Kafe espresso 250 g');
  await page.locator('#isp-root [data-isp="catalog"]').click();
  await page.locator('#isp-root [data-isp="item:v1"]').click();
  await expect(detail).toContainText(labels.fuel);
  await expect(detail).toContainText(labels.diesel);
  await expect(detail.locator('h3[data-user-content]')).toHaveText('Volkswagen Golf 7');
  await page.locator('#isp-root [data-isp="catalog"]').click();
  await page.locator('#isp-root [data-isp="item:h1"]').click();
  await expect(detail).toContainText(labels.area);
  await expect(detail).toContainText(labels.rental);
  await expect(detail.locator('strong [data-i18n-direct]')).toHaveText('/'+({sq:'muaj',en:'month',it:'mese'}[language]));
  await expect(detail.locator('h3[data-user-content]')).toHaveText('Apartament 2+1');
 });
}


for(const [language,labels] of Object.entries({
 sq:{heading:'“Kërkoj…” — kërkesat e komunitetit',empty:'Ende pa kërkesa lokale.',expires:'Skadon:',reply:"Përgjigju si dyqan",form:"Mesazhi",moderation:'Raportime dhe etiketa të promovimit',pending:'Në shqyrtim (simulim, jo moderator real)',reason:'Mashtrim i dyshuar',close:'✕ Mbyll'},
 en:{heading:'“Looking for…” — community requests',empty:'No local requests yet.',expires:'Expires:',reply:"Reply as a shop",form:"message",moderation:'Reports and sponsored labels',pending:'Under review (simulation, no real moderator)',reason:'Suspected fraud',close:'✕ Close'},
 it:{heading:'“Cerco…” — richieste della comunità',empty:'Nessuna richiesta locale.',expires:'Scade:',reply:"Rispondi come negozio",form:"Messaggio",moderation:'Segnalazioni e annunci sponsorizzati',pending:'In esame (simulazione, senza moderatore reale)',reason:'Sospetta frode',close:'✕ Chiudi'}
})){
 test('Shop Plus requests replies moderation and accessible labels in '+language,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),language);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await expect(page.locator('#illyrian-shop-layer [data-isp-open]')).toContainText({sq:'Kërkim i avancuar',en:'Advanced search',it:'Ricerca avanzata'}[language]);
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await expect(page.locator('#isp-root header [data-isp="close"]')).toHaveText(labels.close);
  await expect(page.locator('#isp-root .isp-panel')).toHaveAttribute('aria-label',{sq:'ILLYRIAN Shop i avancuar',en:'ILLYRIAN advanced shop',it:'Negozio avanzato ILLYRIAN'}[language]);
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
  await expect(page.locator('#isp-root h3[data-i18n-direct]')).toHaveText(labels.heading);
  await expect(page.locator('#isp-root .isp-empty')).toContainText(labels.empty);
  const form=page.locator('#isp-need');
  await form.locator('input[name="title"]').fill('Mbyll community request');
  await form.locator('input[name="budget"]').fill('250');
  await form.locator('select[name="days"]').selectOption('14');
  await form.locator('textarea[name="details"]').fill('Mbyll user description');
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-card').first()).toContainText(labels.expires);
  const needs=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).needs);
  expect(needs[0].title).toBe('Mbyll community request');
  expect(needs[0].details).toBe('Mbyll user description');
  await expect(page.locator('#isp-root .isp-card [data-isp^="respond:"]')).toHaveText(labels.reply);
  await page.locator('#isp-root .isp-card [data-isp^="respond:"]').click();
  await expect(page.locator('#isp-answer label')).toContainText(labels.form);
  await page.locator('#isp-answer textarea[name="text"]').fill('Mbyll response content');
  await page.locator('#isp-answer button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-reply [data-user-content]')).toHaveText('Mbyll response content');
  await page.locator('#isp-root [data-isp="tab:catalog"]').click();
  await page.locator('#isp-root [data-isp="item:k1"]').click();
  await page.locator('#isp-root [data-isp="report:k1"]').click();
  await page.locator('#isp-report select[name="reason"]').selectOption('Mashtrim i dyshuar');
  await page.locator('#isp-report button[type="submit"]').click();
  await expect(page.locator('#isp-root h3[data-i18n-direct]')).toHaveText(labels.moderation);
  await expect(page.locator('#isp-root .isp-card').first()).toContainText(labels.reason);
  await expect(page.locator('#isp-root .isp-card small')).toHaveText(labels.pending);
  const persisted=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
  expect(JSON.parse(persisted).flags[0].reason).toBe('Mashtrim i dyshuar');
  await page.evaluate(lang=>window.IllyrianI18n.changeLanguage(lang),language==='it'?'en':'it');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(persisted);
  await expect(page.locator('#isp-root .isp-card [data-user-content]').first()).toHaveText('Kafe espresso 250 g');
 });
}


test('Shop Plus preserves unknown report codes and escapes persisted user text across languages',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  localStorage.setItem('illyrian_demo_v17_shop_plus',JSON.stringify({items:[],needs:[],answers:[],sampleOrders:[],flags:[{target:'<img src=x onerror=alert(1)>',reason:'Unrecognized reason',detail:'Mbyll'}]}));
 });
 await page.reload({waitUntil:'load'});
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:moderation"]').click();
 const report=page.locator('#isp-root .isp-card').first();
 await expect(report.locator('[data-user-content]')).toHaveText('<img src=x onerror=alert(1)>');
 await expect(report).toContainText('Unrecognized reason');
 expect(await page.locator('#isp-root img[src="x"]').count()).toBe(0);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(report).toContainText('Unrecognized reason');
 await expect(report.locator('[data-user-content]')).toHaveText('<img src=x onerror=alert(1)>');
 const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')));
 expect(persisted.flags[0].reason).toBe('Unrecognized reason');
});

test('Shop Plus entry label switches languages before opening and close restores focus',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 const entry=page.locator('#illyrian-shop-layer [data-isp-open]').first();
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await expect(entry).toContainText('Advanced search');
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(entry).toContainText('Ricerca avanzata');
 await entry.focus();await entry.click();
 await expect(page.locator('#isp-root .isp-panel')).toHaveAttribute('aria-label','Negozio avanzato ILLYRIAN');
 await page.keyboard.press('Escape');
 await expect(page.locator('#isp-root')).toHaveCount(0);
 await expect(entry).toBeFocused();
});


test('Shop Plus draft seller response survives sq/en/it locale changes with focus and storage intact',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  const expires=new Date(Date.now()+86400000).toISOString();
  const state={
   items:[],needs:[{id:'audit-need',owned:true,type:'Produkte',city:'Tiranë',
    title:'Mbyll community inquiry',details:'Mbyll original request details',
    budget:220,expires}],answers:[],flags:[],sampleOrders:[]
  };
  localStorage.setItem('illyrian_demo_v17_shop_plus',JSON.stringify(state));
 });
 await page.reload({waitUntil:'load'});
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 await expect(page.locator('#isp-root h4[data-user-content]')).toHaveText('Mbyll community inquiry');
 await page.locator('#isp-root [data-isp="respond:audit-need"]').click();
 const response=page.locator('#isp-answer textarea[name="text"]');
 const draft='Mbyll custom message and details';
 await response.fill(draft);
 await response.focus();
 const saved=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
 const labels={sq:"Mesazhi",en:"message",it:"Messaggio"};
 for(const lang of ['en','it','sq']){
  await page.evaluate(x=>window.IllyrianI18n.changeLanguage(x),lang);
  await expect(page.locator('#isp-answer label')).toContainText(labels[lang]);
  await expect(response).toHaveValue(draft);
  await expect(response).toBeFocused();
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(saved);
  await expect(page.locator('#isp-root h3 [data-user-content]')).toHaveText('Mbyll community inquiry');
 }
 await page.locator('#isp-answer button[type="submit"]').click();
 const final=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')));
 expect(final.needs[0].title).toBe('Mbyll community inquiry');
 expect(final.answers).toEqual([{needId:'audit-need',text:draft}]);
 await expect(page.locator('#isp-root .isp-reply [data-user-content]')).toHaveText(draft);
});


for(const lang of ['sq','en','it']){
 test('Shop Plus audit F01 F07 preserve vehicle draft and zero mileage in '+lang,async({page})=>{
  await ready(page);await page.evaluate(x=>window.IllyrianI18n.changeLanguage(x),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="create"]').click();
  const f=page.locator('#isp-create');
  await f.locator('select[name="type"]').selectOption('Makina');
  await f.locator('input[name="name"]').fill('Mbyll vehicle draft');
  await f.locator('input[name="store"]').fill('Mbyll seller');
  await f.locator('input[name="price"]').fill('9999');
  await f.locator('textarea[name="details"]').fill('Mbyll retained text');
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
  await f.locator('button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-notice[role="alert"]')).toBeVisible();
  await expect(f.locator('select[name="type"]')).toHaveValue('Makina');
  await expect(f.locator('input[name="name"]')).toHaveValue('Mbyll vehicle draft');
  await expect(f.locator('textarea[name="details"]')).toHaveValue('Mbyll retained text');
  await expect(f.locator('input[name="year"]')).toBeFocused();
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(before);
  await f.locator('input[name="year"]').fill('2026');
  await f.locator('button[type="submit"]').click();
  await expect(f.locator('input[name="mileage"]')).toBeFocused();
  await f.locator('input[name="mileage"]').fill('0');
  await f.locator('button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-focus')).toContainText('Mbyll vehicle draft');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
  expect(saved).toMatchObject({type:'Makina',year:2026,mileage:0,details:'Mbyll retained text'});
  await page.locator('#isp-root [data-isp^="edit:"]').click();
  await expect(page.locator('#isp-create input[name="mileage"]')).toHaveValue('0');
  await page.locator('#isp-create button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-focus')).not.toContainText('Mileage: –');
  await expect(page.locator('#isp-root .isp-focus')).not.toContainText('Kilometra: –');
  await page.reload({waitUntil:'load'});
  const latest=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
  expect(latest.mileage).toBe(0);
 });
 test('Shop Plus audit F01 preserves rental form after invalid area in '+lang,async({page})=>{
  await ready(page);await page.evaluate(x=>window.IllyrianI18n.changeLanguage(x),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="create"]').click();
  const f=page.locator('#isp-create');
  await f.locator('select[name="type"]').selectOption('Banesa me qira');
  await f.locator('input[name="name"]').fill('Mbyll rental draft');
  await f.locator('input[name="store"]').fill('Mbyll seller');
  await f.locator('input[name="price"]').fill('440');
  await f.locator('select[name="period"]').selectOption('javë');
  await f.locator('textarea[name="details"]').fill('Mbyll rental details');
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
  await f.locator('button[type="submit"]').click();
  await expect(f.locator('input[name="area"]')).toBeFocused();
  await expect(f.locator('select[name="type"]')).toHaveValue('Banesa me qira');
  await expect(f.locator('select[name="period"]')).toHaveValue('javë');
  await expect(f.locator('textarea[name="details"]')).toHaveValue('Mbyll rental details');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(before);
  await f.locator('input[name="area"]').fill('82');
  await f.locator('button[type="submit"]').click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
  expect(saved).toMatchObject({type:'Banesa me qira',area:82,period:'javë',details:'Mbyll rental details'});
 });
}
test('Shop Plus audit F01 edit retry leaves original saved until valid',async({page})=>{
 await ready(page);await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="create"]').click();
 let f=page.locator('#isp-create');
 await f.locator('input[name="name"]').fill('Mbyll original');
 await f.locator('input[name="store"]').fill('Demo seller');
 await f.locator('input[name="price"]').fill('30');
 await f.locator('button[type="submit"]').click();
 await page.locator('#isp-root [data-isp^="edit:"]').click();f=page.locator('#isp-create');
 await f.locator('select[name="type"]').selectOption('Makina');
 await f.locator('input[name="name"]').fill('Mbyll edited vehicle');
 await f.locator('input[name="price"]').fill('5000');
 await f.locator('textarea[name="details"]').fill('Mbyll pending change');
 const old=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
 await f.locator('button[type="submit"]').click();
 await expect(f.locator('input[name="year"]')).toBeFocused();
 await expect(f.locator('input[name="name"]')).toHaveValue('Mbyll edited vehicle');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(old);
 await f.locator('input[name="year"]').fill('2025');
 await f.locator('input[name="mileage"]').fill('0');
 await f.locator('button[type="submit"]').click();
 const updated=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
 expect(updated).toMatchObject({type:'Makina',name:'Mbyll edited vehicle',mileage:0,details:'Mbyll pending change'});
});
test('i18n audit F10 root and demo mirror files stay byte-identical',()=>{
 const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
 for(const file of ['illyrian-i18n.js','locales/sq.js','locales/en.js','locales/it.js']){
  const canonical=fs.readFileSync(path.join(root,'i18n',file));
  const served=fs.readFileSync(path.join(root,'demo','i18n',file));
  expect(canonical.equals(served),file+' mirror drift').toBe(true);
  const altered=Buffer.from(served);altered[0]^=1;
  expect(canonical.equals(altered),'negative parity check '+file).toBe(false);
 }
});



test('audit F04 failed feed save preserves draft and never reports success',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#screen .v5-profile-hero [data-act="modal"][data-val="compose"]').click();
 const field=page.locator('#layer #v5-text');
 const draft='Mbyll personal post survives rejection';
 await field.fill(draft);
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await rejectModuleWrites(page,'illyrian_demo_v09_state');
 await page.locator('#layer [data-act="v5-publish"]').click();
 await expect(field).toHaveValue(draft);
 await expect(page.locator('#toast-area')).toContainText('nuk u ruajt');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
 await allowModuleWrites(page);
 await page.locator('#layer [data-act="v5-publish"]').click();
 await expect(page.locator('#layer [data-act="v5-publish"]')).toHaveCount(0);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).posts);
 expect(saved.filter(p=>p.text===draft)).toHaveLength(1);
});

test('audit F03 corrupted local creator and Plans records do not crash on reopen',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  localStorage.setItem('illyrian_demo_v15_creator',JSON.stringify({
    stories:[null,42,{id:'s1',caption:'Mbyll',sample:'arta'}],
    reels:[{},false,{id:'r1',caption:'Mbyll',sample:'cafe'}]
  }));
  localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({
    events:[null,{},[],{id:'valid',title:'Mbyll demo plan',kind:'Sport',city:'Tiranë',place:'Park',date:'2027-10-23',time:'17:30',capacity:6,price:0,privacy:'public'}],
    requests:[null,{id:'r1',eventId:'valid',name:'Visitor',status:'pending'}],
    messages:[null,42,{eventId:'valid',name:'Visitor',text:'Mbyll'}],
    attendance:[null,42,'r1']
  }));
 });
 const before=await page.evaluate(()=>({
  media:localStorage.getItem('illyrian_demo_v15_creator'),
  plans:localStorage.getItem('illyrian_demo_v17_plans')
 }));
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.reload({waitUntil:'load'});
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await expect(page.locator('#screen [data-act="v15-view"][data-val="reel"]')).toHaveCount(1);
 await expect(page.locator('#screen [data-act="v15-view"][data-val="story"]')).toHaveCount(1);
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 await expect(page.locator('#ilp-root h3[data-user-content]')).toContainText('Mbyll demo plan');
 expect(errors).toEqual([]);
 const after=await page.evaluate(()=>({
  media:localStorage.getItem('illyrian_demo_v15_creator'),
  plans:localStorage.getItem('illyrian_demo_v17_plans')
 }));
 expect(after).toEqual(before);
});

test('audit F02 Reel and Story author caption remains unchanged on locale switch',async({page})=>{
 await ready(page);
 await page.evaluate(()=>localStorage.setItem('illyrian_demo_v15_creator',JSON.stringify({
  stories:[{id:'s1',caption:'Mbyll',sample:'arta'}],
  reels:[{id:'r1',caption:'Mbyll',sample:'cafe'}]
 })));
 await page.reload({waitUntil:'load'});
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#screen [data-act="v15-view"][data-val="reel"]').first().click();
 for(const lang of ['sq','en','it']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#layer .v16-viewer .v16-content > p[data-user-content]')).toHaveText('Mbyll');
 }
 await page.keyboard.press('Escape');
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#screen [data-act="v15-view"][data-val="story"]').first().click();
 for(const lang of ['it','en','sq']){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('#layer .v16-viewer .v16-content > p[data-user-content]')).toHaveText('Mbyll');
 }
});


test('audit F08 rejects stale request in second tab and succeeds after reload',async({browser})=>{
 const context=await browser.newContext(),first=await context.newPage(),second=await context.newPage();
 async function prepare(page){
  await ready(page);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
 }
 await prepare(first);await prepare(second);
 await second.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await second.locator('#isp-need input[name="title"]').fill('Second tab draft Mbyll');
 await second.locator('#isp-need input[name="budget"]').fill('750');
 await second.locator('#isp-need textarea[name="details"]').fill('Mbyll unsaved description');
 await first.locator('#isp-need input[name="title"]').fill('First tab confirmed request');
 await first.locator('#isp-need input[name="budget"]').fill('300');
 await first.locator('#isp-need button[type="submit"]').click();
 await expect(second.locator('#isp-root .isp-notice')).toContainText('skedë tjetër');
 const original=await first.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
 await second.locator('#isp-need button[type="submit"]').click();
 await expect(second.locator('#isp-root .isp-notice')).toContainText('skedë tjetër');
 await expect(second.locator('#isp-need input[name="title"]')).toHaveValue('Second tab draft Mbyll');
 await expect(second.locator('#isp-need textarea[name="details"]')).toHaveValue('Mbyll unsaved description');
 expect(await second.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(original);
 await second.reload({waitUntil:'load'});
 await second.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await second.locator('[data-ilshop-open]').first().click();
 await second.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await second.locator('#isp-root [data-isp="tab:needs"]').click();
 await second.locator('#isp-need input[name="title"]').fill('Second tab after reload');
 await second.locator('#isp-need input[name="budget"]').fill('750');
 await second.locator('#isp-need button[type="submit"]').click();
 expect(await first.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).needs.map(x=>x.title))).toEqual(['First tab confirmed request','Second tab after reload']);
 await context.close();
});
test('audit F08 stale form warning follows locale without rewriting values',async({browser})=>{
 const context=await browser.newContext(),writer=await context.newPage(),other=await context.newPage();
 for(const page of [writer,other]){
  await ready(page);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="tab:needs"]').click();
 }
 await other.locator('#isp-need input[name="title"]').fill('Original typed content Mbyll');
 await writer.locator('#isp-need input[name="title"]').fill('Other writer');
 await writer.locator('#isp-need input[name="budget"]').fill('100');
 await writer.locator('#isp-need button[type="submit"]').click();
 for(const [locale,word] of [['en','another tab'],['it','un’altra scheda'],['sq','skedë tjetër']]){
  await other.evaluate(lang=>window.IllyrianI18n.changeLanguage(lang),locale);
  await other.locator('#isp-need input[name="budget"]').fill('400');
  await other.locator('#isp-need button[type="submit"]').click();
  await expect(other.locator('#isp-root .isp-notice')).toContainText(word);
  await expect(other.locator('#isp-need input[name="title"]')).toHaveValue('Original typed content Mbyll');
 }
 expect(await writer.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).needs.map(n=>n.title))).toEqual(['Other writer']);
 await context.close();
});



test('Shop Plus rejects seller reply after request expires during an open draft, then allows retry',async({page})=>{
 await ready(page);
 await page.evaluate(()=>{
  const saved={items:[],needs:[{
   id:'expiry-check',owned:true,type:'Produkte',city:'Tiranë',
   title:'Mbyll request awaiting reply',details:'User-provided text',
   budget:150,expires:new Date(Date.now()+86400000).toISOString()
  }],answers:[],flags:[],sampleOrders:[]};
  localStorage.setItem('illyrian_demo_v17_shop_plus',JSON.stringify(saved));
 });
 await page.reload({waitUntil:'load'});
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="tab:needs"]').click();
 await page.locator('#isp-root [data-isp="respond:expiry-check"]').click();
 const reply=page.locator('#isp-answer textarea[name="text"]');
 await reply.fill('Mbyll seller draft should survive expiry');
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
 await page.evaluate(()=>{
  window.__illyrianRealNow=Date.now;
  Date.now=()=>window.__illyrianRealNow()+2*86400000;
 });
 await page.locator('#isp-answer button[type="submit"]').click();
 await expect(page.locator('#isp-root .isp-notice')).toContainText('Kërkesa ose mesazhi');
 await expect(reply).toHaveValue('Mbyll seller draft should survive expiry');
 await expect(reply).toBeFocused();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(before);
 await page.evaluate(()=>{Date.now=window.__illyrianRealNow;delete window.__illyrianRealNow});
 await page.locator('#isp-answer button[type="submit"]').click();
 const state=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')));
 expect(state.answers).toEqual([{needId:'expiry-check',text:'Mbyll seller draft should survive expiry'}]);
 await expect(page.locator('#isp-root .isp-reply [data-user-content]')).toHaveText('Mbyll seller draft should survive expiry');
});



for(const lang of ['sq','en','it']){
 test('Shop Plus category fields preserve drafts through switches '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="create"]').click();
  const f=page.locator('#isp-create');
  const product=f.locator('[data-isp-category="Produkte"]'),car=f.locator('[data-isp-category="Makina"]'),rental=f.locator('[data-isp-category="Banesa me qira"]');
  await expect(product.first()).toBeVisible();
  await expect(car.first()).toBeHidden();
  await expect(rental.first()).toBeHidden();
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
  await f.locator('input[name="quantity"]').fill('7');
  await f.locator('select[name="type"]').selectOption('Makina');
  await expect(product.first()).toBeHidden();
  await expect(car.first()).toBeVisible();
  await f.locator('input[name="year"]').fill('2020');
  await f.locator('input[name="mileage"]').fill('0');
  await f.locator('select[name="type"]').selectOption('Banesa me qira');
  await expect(car.first()).toBeHidden();
  await expect(rental.first()).toBeVisible();
  await f.locator('input[name="area"]').fill('80');
  await f.locator('input[name="rooms"]').fill('2+1');
  await f.locator('select[name="period"]').selectOption('javë');
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang==='sq'?'it':'sq');
  await expect(rental.first()).toBeVisible();
  await expect(car.first()).toBeHidden();
  await f.locator('select[name="type"]').selectOption('Makina');
  await expect(f.locator('input[name="year"]')).toHaveValue('2020');
  await expect(f.locator('input[name="mileage"]')).toHaveValue('0');
  await f.locator('select[name="type"]').selectOption('Produkte');
  await expect(f.locator('input[name="quantity"]')).toHaveValue('7');
  await f.locator('select[name="type"]').selectOption('Banesa me qira');
  await expect(f.locator('input[name="area"]')).toHaveValue('80');
  await expect(f.locator('input[name="rooms"]')).toHaveValue('2+1');
  await expect(f.locator('select[name="period"]')).toHaveValue('javë');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(before);
 });
}

test('Shop Plus category-specific save and edit strip irrelevant metadata',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
 await page.locator('#isp-root [data-isp="create"]').click();
 const f=page.locator('#isp-create');
 await f.locator('input[name="name"]').fill('Mbyll vehicle listing');
 await f.locator('input[name="store"]').fill('Mbyll shop');
 await f.locator('input[name="price"]').fill('9000');
 await f.locator('select[name="type"]').selectOption('Banesa me qira');
 await f.locator('input[name="area"]').fill('78');
 await f.locator('input[name="rooms"]').fill('1+1');
 await f.locator('select[name="period"]').selectOption('javë');
 await f.locator('select[name="type"]').selectOption('Makina');
 await f.locator('input[name="year"]').fill('2020');
 await f.locator('input[name="mileage"]').fill('0');
 await f.locator('button[type="submit"]').click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
 expect(saved).toMatchObject({type:'Makina',year:2020,mileage:0,area:null,rooms:'',period:'muaj'});
 await page.locator('#isp-root [data-isp^="edit:"]').click();
 const edit=page.locator('#isp-create');
 await expect(edit.locator('[data-isp-category="Makina"]').first()).toBeVisible();
 await expect(edit.locator('[data-isp-category="Banesa me qira"]').first()).toBeHidden();
 await expect(edit.locator('input[name="mileage"]')).toHaveValue('0');
 await edit.locator('select[name="type"]').selectOption('Banesa me qira');
 await expect(edit.locator('[data-isp-category="Banesa me qira"]').first()).toBeVisible();
 await edit.locator('input[name="area"]').fill('88');
 await edit.locator('select[name="period"]').selectOption('javë');
 await edit.locator('button[type="submit"]').click();
 const revised=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
 expect(revised).toMatchObject({type:'Banesa me qira',year:null,mileage:null,area:88,period:'javë'});
});

test('visual regression: Plans intro and prototype note follow sq/en/it without losing focus',async({page})=>{
 await ready(page);
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 const root=page.locator('#ilp-root');
 const close=root.locator('header button[data-ilp="close"]');
 await expect(close).toBeFocused();
 for(const [lang,intro,foot] of [
  ['sq','Kalo midis organizatorit','PROTOTIP'],
  ['en','Switch between organizer and participant','PROTOTYPE'],
  ['it','Passa dal ruolo di organizzatore','PROTOTIPO']
 ]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(root.locator('.ilp-intro')).toContainText(intro);
  await expect(root.locator('.ilp-foot')).toContainText(foot);
  await expect(close).toBeFocused();
 }
 await close.click();
 await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
});

test('visual regression: Privacy city All caption localizes, canonical filter value and focus remain stable',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 const root=page.locator('#il4-root');
 await root.locator('[data-il4="tab:map"]').click();
 const city=root.locator('#il4-mapform select[name="city"]');
 await city.focus();
 for(const [lang,label] of [['sq','Të gjitha'],['en','All'],['it','Tutte']]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(city).toHaveValue('Të gjitha');
  await expect(city.locator('option').first()).toHaveText(label);
  await expect(root.locator('.il4-map-label')).toContainText("ILLYRIAN · "+label);
  await expect(city).toBeFocused();
 }
 await root.locator('button[data-il4="close"]').click();
 await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
});


test('Privacy map pin ARIA localization preserves focus and user-origin names across sq/en/it',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 const root=page.locator('#il4-root');
 await root.locator('[data-il4="tab:map"]').click();
 const pin=root.locator('.il4-pin[data-il4="pin:m1"]');
 await expect(pin).toBeVisible();
 await pin.focus();
 for(const [lang,region,tabs,label] of [
  ['sq','Skemë orientuese e rezultateve','Fushat e Fazës 4','Shfaq Takim i komunitetit në Tiranë'],
  ['en','Illustrative results map','Phase 4 sections','Show Takim i komunitetit in Tiranë'],
  ['it','Mappa illustrativa dei risultati','Sezioni della fase 4','Mostra Takim i komunitetit a Tiranë']
 ]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await expect(root.locator('.il4-map')).toHaveAttribute('aria-label',region);
  await expect(root.locator('nav.il4-tabs').first()).toHaveAttribute('aria-label',tabs);
  await expect(pin).toHaveAttribute('aria-label',label);
  await expect(pin).toBeFocused();
  await expect(pin).toHaveAttribute('data-il4','pin:m1');
 }
 await root.locator('button[data-il4="close"]').click();
 await expect(page.locator('#screen')).toHaveJSProperty('inert',false);
});


// Audit A1-01: corrupted/legacy core storage must not crash, auto-erase,
// or hide an otherwise valid saved post. This remains browser-local DEMO state.
for(const [label,fixture] of [
 ['posts object',{posts:{unexpected:true}}],
 ['posts null with broken maps',{posts:null,likes:{oops:true},comments:'broken',messages:[],profile:'invalid'}],
 ['posts mixed entries',{posts:[null,42,{},'broken',{id:'ok',name:'Fixture',text:'Legitimate draft',city:'Tiranë'}],comments:{ok:[null,'Valid reply']}}],
 ['root non-object',['not','a','record']]
]){
 test('audit A1-01 corrupted core state recovers without deleting raw data - '+label,async({page})=>{
  await ready(page);
  const original=JSON.stringify(fixture);
  await page.evaluate(raw=>localStorage.setItem('illyrian_demo_v09_state',raw),original);
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.reload({waitUntil:'load'});
  await expect(page.locator('#screen')).not.toBeEmpty();
  await expect(page.locator('#navbar')).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(original);
  if(label==='posts mixed entries'){
   await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
   await expect(page.locator('#screen')).toContainText('Legitimate draft');
  }
 });
}


async function denyCoreStorage(page){
 await page.evaluate(()=>{
  const old=Storage.prototype.setItem;
  window.__restoreCoreSetItem=()=>{Storage.prototype.setItem=old};
  Storage.prototype.setItem=function(k,v){
   if(k==='illyrian_demo_v09_state')throw new DOMException('Simulated quota','QuotaExceededError');
   return old.call(this,k,v);
  };
 });
}
async function restoreCoreStorage(page){
 await page.evaluate(()=>{window.__restoreCoreSetItem?.();delete window.__restoreCoreSetItem});
}
for(const [lang,error] of [
 ['sq','Ndryshimi nuk u ruajt në këtë pajisje. Provo përsëri.'],
 ['en','The change was not saved on this device. Try again.'],
 ['it','La modifica non è stata salvata su questo dispositivo. Riprova.']
]){
 test('audit A1-02 Settings quota rollback and retry - '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
  await page.locator('#screen [data-act="modal"][data-val="settings"]').click();
  await page.locator('#layer [data-act="v6-settings-section"][data-val="privacy"]').click();
  const check=page.locator('#layer [data-v6-pref="privateProfile"]');
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await expect(check).not.toBeChecked();
  await denyCoreStorage(page);
  // Click rather than Playwright check(): a failed save intentionally restores unchecked.
  await check.click();
  await expect(check).not.toBeChecked();
  await expect(page.locator('#toast-area')).toContainText(error);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
  await restoreCoreStorage(page);
  await check.check();
  await expect(check).toBeChecked();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).v6Prefs.privateProfile)).toBe(true);
 });

 test('audit A1-02 Profile quota preserves draft then retries - '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
  await page.locator('#screen [data-act="modal"][data-val="edit"]').click();
  const name=page.locator('#edit-name'),bio=page.locator('#edit-bio');
  await name.fill('Test Profile '+lang);
  await bio.fill('Unsent biography draft '+lang);
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await denyCoreStorage(page);
  await page.locator('#layer [data-act="edit-save"]').click();
  await expect(name).toHaveValue('Test Profile '+lang);
  await expect(bio).toHaveValue('Unsent biography draft '+lang);
  await expect(name).toBeFocused();
  await expect(page.locator('#toast-area')).toContainText(error);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
  await restoreCoreStorage(page);
  await page.locator('#layer [data-act="edit-save"]').click();
  const profile=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile);
  expect(profile).toMatchObject({name:'Test Profile '+lang,bio:'Unsent biography draft '+lang});
 });

 test('audit A1-02 Messages quota preserves text then retries once - '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();
  await page.locator('#v6-inbox-list [data-act="v6-openchat"][data-id="leon"]').click();
  const form=page.locator('#v6-chat-form'),input=form.locator('#v6-msg-input');
  await input.fill('Unsent hello '+lang);
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await denyCoreStorage(page);
  await form.locator('button[type="submit"]').click();
  await expect(input).toHaveValue('Unsent hello '+lang);
  await expect(input).toBeFocused();
  await expect(page.locator('#toast-area')).toContainText(error);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
  await restoreCoreStorage(page);
  await form.locator('button[type="submit"]').click();
  const messages=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).messages.leon);
  expect(messages.filter(x=>x==='Unsent hello '+lang)).toHaveLength(1);
 });
}


test('audit A1-03 rejects Plans stale writes across two browser tabs and permits retry after reload',async({browser})=>{
 const ctx=await browser.newContext(),first=await ctx.newPage(),second=await ctx.newPage();
 async function openDetail(page){
  await ready(page);
  await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('[data-ilp-entry]').first().click();
  await page.locator('#ilp-root [data-ilp="detail:demo-football"]').click();
 }
 await openDetail(first);await openDetail(second);
 await first.locator('#ilp-root [data-ilp="accept:arta"]').click();
 const afterFirst=await first.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
 expect(JSON.parse(afterFirst).requests.find(x=>x.id==='arta').status).toBe('accepted');
 await second.locator('#ilp-root [data-ilp="decline:leon"]').click();
 await expect(second.locator('#ilp-root .ilp-notice')).toContainText('changed in another tab');
 expect(await second.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(afterFirst);
 await openDetail(second);
 await second.locator('#ilp-root [data-ilp="decline:leon"]').click();
 const stored=await second.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_plans')));
 expect(stored.requests.find(x=>x.id==='arta').status).toBe('accepted');
 expect(stored.requests.find(x=>x.id==='leon').status).toBe('declined');
 await ctx.close();
});


test('audit A1-04 Connections preserves authored title and notes across sq/en/it',async({page})=>{
 await ready(page);
 await page.evaluate(()=>localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({
  events:[{id:'user-mbyll',title:'Mbyll',kind:'Sport',city:'Tiranë',place:'Mbyll',conditions:'Mbyll',date:'2027-10-23',time:'17:00',capacity:8,privacy:'public',cancelled:false}],
  requests:[],messages:[],attendance:[]
 })));
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilc-entry]').first().click();
 const root=page.locator('#ilc-root');
 for(const [view,selector] of [
  ['cities','.ilc-results strong[data-user-content]'],
  ['welcome','.ilc-first strong[data-user-content]'],
  ['repeat','.ilc-repeat strong[data-user-content]']
 ]){
  await root.locator('[data-ilc="view:'+view+'"]').click();
  for(const lang of ['sq','en','it']){
   await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
   await expect(root.locator(selector).filter({hasText:'Mbyll'})).toHaveText('Mbyll');
   if(view==='welcome'){
    await expect(root.locator('.ilc-first [data-user-content]').filter({hasText:'Mbyll'})).toHaveCount(3);
   }
  }
  await root.locator('[data-ilc="overview"]').first().click();
 }
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(before);
});

test('audit A1-06 map pin ARIA decodes special characters exactly once in all locales',async({page})=>{
 await ready(page);
 const title='A & "B" <C>';
 await page.evaluate(t=>localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({
  events:[{id:'special-pin',title:t,city:'Tiranë',kind:'Sport',date:'2027-10-23',time:'17:00',privacy:'public',cancelled:false}],
  requests:[],messages:[],attendance:[]
 })),title);
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#il4-entry [data-il4-entry]').click();
 const root=page.locator('#il4-root');
 await root.locator('[data-il4="tab:map"]').click();
 const pin=root.locator('.il4-pin[data-il4="pin:plan-0"]');
 await expect(pin).toBeVisible();
 for(const [lang,label] of [
  ['sq','Shfaq A & "B" <C> në Tiranë'],
  ['en','Show A & "B" <C> in Tiranë'],
  ['it','Mostra A & "B" <C> a Tiranë']
 ]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await expect(pin).toHaveAttribute('aria-label',label);
  await expect(root.locator('.il4-pin[data-il4="pin:plan-0"]')).toHaveCount(1);
 }
});


test('audit A1-05 Plans detail uses semantic labels for organizer and participant across sq/en/it',async({page})=>{
 await ready(page);
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('[data-ilp-entry]').first().click();
 const root=page.locator('#ilp-root');
 await root.locator('[data-ilp="detail:demo-football"]').click();
 for(const lang of [
  {code:'sq',heading:'Aktivitetet dhe organizatori',active:'Aktiv',seats:'vende',manage:'Menaxho kërkesat',accept:'Prano',pending:'në pritje',chat:"Biseda e grupit",empty:'Ende pa mesazhe.',participant:'Si pjesëmarrës',status:'Statusi yt: Pa kërkesë'},
  {code:'en',heading:'Activities and organizer',active:'Active',seats:'seats',manage:'Manage requests',accept:'Accept',pending:'pending',chat:"Group chat",empty:'No messages yet.',participant:'As participant',status:'Your status: No request'},
  {code:'it',heading:'Attività e organizzatore',active:'Attivo',seats:'posti',manage:'Gestisci le richieste',accept:'Accetta',pending:'in attesa',chat:"Chat di gruppo",empty:'Nessun messaggio.',participant:'Come partecipante',status:'Il tuo stato: Nessuna richiesta'}
 ]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang.code);
  await expect(root.locator('.ilp-panel header h2')).toHaveText(lang.heading);
  await expect(root.locator('.ilp-panel > .ilp-muted').first()).toContainText(lang.active);
  await expect(root.locator('.ilp-panel > p:has(> b)').first()).toContainText(lang.seats);
  await expect(root.locator('.ilp-panel h4').first()).toHaveText(lang.manage);
  await expect(root.locator('[data-ilp="accept:arta"]')).toHaveText(lang.accept);
  await expect(root.locator('.ilp-request').first()).toContainText(lang.pending);
  await expect(root.locator('.ilp-panel h4').last()).toHaveText(lang.chat);
  await expect(root.locator('.ilp-chat')).toContainText(lang.empty);
  await expect(root.locator('h3[data-user-content]')).toHaveText('Futboll dhe njohje të reja');
  await root.locator('[data-ilp="role:participant"]').click();
  await expect(root.locator('[data-ilp="role:participant"]')).toHaveText(lang.participant);
  await root.locator('[data-ilp="detail:demo-football"]').click();
  await expect(root.locator('.ilp-panel')).toContainText(lang.status);
  await root.locator('[data-ilp="role:organizer"]').click();
  await root.locator('[data-ilp="detail:demo-football"]').click();
 }
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(before);
});


for(const [lang,warning,confirm] of [
 ['sq','Nuk fshin Shop, Shop Plus, Plans, Connections','Po, rivendos pjesën sociale'],
 ['en','Shop, Shop Plus, Plans, Connections','Yes, reset social data'],
 ['it','Shop, Shop Plus, Plans, Connections','Sì, reimposta i dati social']
]){
 test('audit A1-07 scoped social reset preserves module stores and handles quota - '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  const keys={core:'illyrian_demo_v09_state',shop:'illyrian_demo_v17_shop',plans:'illyrian_demo_v17_plans',connections:'illyrian_demo_v17_connections'};
  const raw=await page.evaluate(keys=>{
   const data={
    [keys.core]:JSON.stringify({profile:{name:'Social fixture',bio:'Saved'},posts:[{id:'myfixture',name:'Social fixture',text:'Social text',city:'Tiranë'}]}),
    [keys.shop]:'{"fixture":"shop"}',
    [keys.plans]:'{"fixture":"plans"}',
    [keys.connections]:'{"fixture":"connections"}'
   };
   for(const [k,v] of Object.entries(data))localStorage.setItem(k,v);
   return data;
  },keys);
  await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
  await page.locator('#screen [data-act="modal"][data-val="settings"]').click();
  await page.locator('#layer [data-act="v6-settings-section"][data-val="about"]').click();
  await expect(page.locator('#layer')).toContainText("ILLYRIAN · DEMO v1.7");
  await page.locator('#layer [data-act="v6-reset-confirm"]').click();
  await expect(page.locator('#layer .v6-alert-banner')).toContainText(warning);
  await expect(page.locator('#layer [data-act="v6-reset-now"]')).toHaveText(confirm);
  await denyCoreStorage(page);
  await page.locator('#layer [data-act="v6-reset-now"]').click();
  await expect(page.locator('#toast-area')).not.toBeEmpty();
  expect(await page.evaluate(k=>localStorage.getItem(k),keys.core)).toBe(raw[keys.core]);
  await expect(page.locator('#layer [data-act="v6-reset-now"]')).toBeVisible();
  await restoreCoreStorage(page);
  await Promise.all([page.waitForEvent('load'),page.locator('#layer [data-act="v6-reset-now"]').click()]);
  await expect.poll(()=>page.evaluate(k=>localStorage.getItem(k),keys.core)).toBe('{}');
  for(const key of [keys.shop,keys.plans,keys.connections]){
   expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(raw[key]);
  }
  await expect(page.locator('html')).toHaveAttribute('lang',lang);
 });
}

test('Shop Plus malformed persisted listing does not crash catalog/stores or rewrite raw data',async({page})=>{
 const errors=[];
 page.on('pageerror',err=>errors.push(err.message));
 await ready(page);
 const raw=JSON.stringify({items:[
  {},
  {id:'bad-store',type:'Produkte',name:'Broken missing seller',city:'Tiranë',price:2},
  {id:'bad-name',type:'Produkte',name:42,store:'Bad Seller',city:'Tiranë',price:2},
  {id:'bad-price',type:'Produkte',name:'Broken price',store:'Bad Seller',city:'Tiranë',price:{value:3}},
  {id:'fixture-good',type:'Produkte',name:'Fixture valid coffee',store:'Fixture Seller',city:'Tiranë',price:10,quantity:4,owned:true}
 ],needs:[],answers:[],flags:[],sampleOrders:[]});
 await page.evaluate(raw=>localStorage.setItem('illyrian_demo_v17_shop_plus',raw),raw);
 await page.reload({waitUntil:'load'});
 await expect(page.locator('#phone')).toBeVisible();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('[data-isp-open]').first().click();
 const root=page.locator('#isp-root');
 await expect(root.locator('.isp-card:has-text("Fixture valid coffee")')).toHaveCount(1);
 await expect(root.locator('.isp-card:has-text("Broken missing seller")')).toHaveCount(0);
 await root.locator('[data-isp="tab:stores"]').click();
 await expect(root).toContainText('Fixture Seller');
 await root.locator('[data-isp="tab:catalog"]').click();
 await root.locator('#isp-filters select[name="sort"]').selectOption('name');
 await root.locator('#isp-filters button[type="submit"]').click();
 await expect(root.locator('.isp-card:has-text("Fixture valid coffee")')).toHaveCount(1);
 expect(errors).toEqual([]);
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(raw);
});


// M16 pre-device accessibility probe: invalid fields must expose a live error
// association, preserve unsaved values, recover cleanly and never write invalid
// drafts. This is browser semantics only, NOT a screenreader/device certification.
for(const lang of ['sq','en','it']){
 test('M16 Shop Plus validation announces and associates vehicle errors - '+lang,async({page})=>{
  await ready(page);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#illyrian-shop-layer [data-isp-open]').first().click();
  await page.locator('#isp-root [data-isp="create"]').click();
  const form=page.locator('#isp-create');
  await form.locator('select[name="type"]').selectOption('Makina');
  await form.locator('input[name="name"]').fill('Mbyll accessible vehicle');
  await form.locator('input[name="store"]').fill('Mbyll test seller');
  await form.locator('input[name="price"]').fill('8000');
  const original=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
  await form.locator('button[type="submit"]').click();
  const notice=page.locator('#isp-root #isp-validation-feedback[role="alert"]');
  await expect(notice).toHaveText(await page.evaluate(()=>window.IllyrianI18n.t('shopPlus:vehicleInvalid')));
  const year=form.locator('input[name="year"]'),mileage=form.locator('input[name="mileage"]');
  await expect(year).toBeFocused();
  await expect(year).toHaveAttribute('aria-invalid','true');
  await expect(year).toHaveAttribute('aria-describedby','isp-validation-feedback');
  await expect(mileage).not.toHaveAttribute('aria-invalid','true');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(original);
  // Correcting the field clears its stale invalid flag without losing the draft.
  await year.fill('2026');
  await expect(year).not.toHaveAttribute('aria-invalid','true');
  await form.locator('button[type="submit"]').click();
  await expect(mileage).toBeFocused();
  await expect(mileage).toHaveAttribute('aria-invalid','true');
  await expect(mileage).toHaveAttribute('aria-describedby','isp-validation-feedback');
  await expect(year).not.toHaveAttribute('aria-invalid','true');
  await expect(form.locator('input[name="name"]')).toHaveValue('Mbyll accessible vehicle');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(original);
  // Locale rerender must retain the validation relation and the pending values.
  const other=lang==='it'?'en':'it';
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),other);
  await expect(mileage).toBeFocused();
  await expect(mileage).toHaveAttribute('aria-invalid','true');
  await expect(mileage).toHaveAttribute('aria-describedby','isp-validation-feedback');
  await expect(page.locator('#isp-validation-feedback')).toHaveAttribute('role','alert');
  await expect(form.locator('input[name="name"]')).toHaveValue('Mbyll accessible vehicle');
  await mileage.fill('0');
  await form.locator('button[type="submit"]').click();
  await expect(page.locator('#isp-root .isp-focus')).toContainText('Mbyll accessible vehicle');
  await expect(page.locator('#isp-validation-feedback')).toHaveCount(0);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
  expect(saved).toMatchObject({type:'Makina',name:'Mbyll accessible vehicle',year:2026,mileage:0});
 });
}

for(const lang of ['sq','en','it']){
 test('Story reply quota retry preserves draft and stores once '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#screen [data-act="story"]').first().click();
  const input=page.locator('#v6-story-message');await input.fill('Story reply '+lang);
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await denyCoreStorage(page);
  await page.locator('[data-act="v6-story-send"]').click();
  await expect(input).toHaveValue('Story reply '+lang);await expect(input).toBeFocused();
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
  await restoreCoreStorage(page);await page.locator('[data-act="v6-story-send"]').click();
  const messages=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).messages);
  expect(Object.values(messages).flat().filter(x=>x==='↪ Story: Story reply '+lang)).toHaveLength(1);
  await page.reload();expect(await page.evaluate(l=>Object.values(JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).messages).flat().filter(x=>x==='↪ Story: Story reply '+l).length,lang)).toBe(1);
 });
}
test('Story timer preserves an unsent reply while writing',async({page})=>{
 await page.clock.install();await ready(page);
 await page.locator('#screen [data-act="story"]').first().click();
 await page.locator('#v6-story-message').fill('Keep this draft');
 await page.clock.fastForward(9000);
 await expect(page.locator('#v6-story-message')).toHaveValue('Keep this draft');
});

test('Messages reject an observed stale tab without losing its draft or another message',async({browser})=>{
 const ctx=await browser.newContext();const a=await ctx.newPage(),b=await ctx.newPage();
 for(const p of [a,b]){await ready(p);await p.locator('[data-act="modal"][data-val="inbox"]').first().click();await p.locator('[data-act="v6-openchat"][data-id="leon"]').first().click()}
 await a.locator('#v6-msg-input').fill('Confirmed A');await a.locator('#v6-chat-form button[type="submit"]').click();
 const raw=await a.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await b.locator('#v6-msg-input').fill('Unsent B');await b.locator('#v6-chat-form button[type="submit"]').click();
 await expect(b.locator('#v6-msg-input')).toHaveValue('Unsent B');
 expect(await b.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
 await ctx.close();
});

for(const locale of ['sq','en','it']){
 test('Governance preserves unknown historical status without claiming pending '+locale,async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v17_governance',JSON.stringify({cases:[{id:'unknown-phase1',target:'Historical status fixture',reason:'Test reason',status:'Mbyll'}],appeals:[],audits:[],drafts:[]})));
  await ready(page);await page.evaluate(l=>IllyrianI18n.changeLanguage(l),locale);
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_governance'));
  await page.locator('#navbar [data-val="profile"]').click();await page.locator('#ig6-entry [data-ig6="open"]').click();
  await page.locator('#ig6-root [data-ig6="tab:reports"]').click();
  const card=page.locator('#ig6-root article').filter({has:page.getByText('Historical status fixture',{exact:true})});
  await expect(card).toContainText('Mbyll');
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_governance'))).toBe(before);
 });
}

// Phase 3: shared social state must never claim success after a failed write.
async function p3FailCoreWrites(page,fail=true){await page.evaluate(fail=>{
 window.p3OriginalSet ||= Storage.prototype.setItem;
 Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state'&&fail)throw new DOMException('Synthetic quota','QuotaExceededError');return window.p3OriginalSet.call(this,k,v)};
},fail)}
async function p3Community(page,id='c1'){
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#screen [data-act="category"][data-val="Komunitete"]').click();
 await page.locator('#screen [data-act="v11-community-open"][data-id="'+id+'"]').first().click();
}
for(const lang of ['sq','en','it']){
 test('Phase3 membership quota rollback and single retry '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);await p3Community(page);
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  const caption=await page.locator('#layer [data-act="v11-community-toggle"]').textContent();
  await p3FailCoreWrites(page);
  await page.locator('#layer [data-act="v11-community-toggle"]').click();
  await expect(page.locator('#layer [data-act="v11-community-toggle"]')).toHaveText(caption);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
  await expect(page.locator('#toast-area')).toContainText(await page.evaluate(()=>window.IllyrianI18n.t('common:storageSaveFailed')));
  await p3FailCoreWrites(page,false);await page.locator('#layer [data-act="v11-community-toggle"]').click();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).joinedCommunities.filter(x=>x==='c1').length)).toBe(1);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).activityLog.filter(x=>x.text.includes('Shqiptarët në Milano')).length)).toBe(1);
 });
 test('Phase3 comment quota preserves text and retries once '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#screen [data-act="comments"][data-id="p1"]').first().click();
  const text='Mbyll <b> & sq/en/it '+lang;await page.locator('#comment-input').fill(text);
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await p3FailCoreWrites(page);await page.locator('#layer [data-act="send-comment"]').click();
  await expect(page.locator('#comment-input')).toHaveValue(text);
  await expect(page.locator('#layer .bubble.me')).toHaveCount(0);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(before);
  await p3FailCoreWrites(page,false);await page.locator('#layer [data-act="send-comment"]').click();
  expect(await page.evaluate(t=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).comments.p1.filter(x=>x===t).length,text)).toBe(1);
  await page.reload();expect(await page.evaluate(t=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).comments.p1.filter(x=>x===t).length,text)).toBe(1);
 });
}
test('Phase3 manual city failed save restores previous city',async({page})=>{
 await ready(page);await page.locator('#screen > .filters [data-act="feed"][data-val="Afër teje"]').click();
 const select=page.locator('#v9-near-city'),before=await select.inputValue();
 await p3FailCoreWrites(page);await select.selectOption(before==='Romë'?'Milano':'Romë');
 await expect(select).toHaveValue(before);
});

test('Phase3 Plans status uses event city time rather than viewer timezone',async({browser})=>{
 for(const timezoneId of ['America/New_York','Asia/Tokyo']){
  const context=await browser.newContext({timezoneId}),page=await context.newPage();
  await page.clock.install({time:new Date('2026-12-01T18:00:00Z')});
  await page.addInitScript(()=>{localStorage.setItem('illyrian_demo_ui_language_v1','en');localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({events:[{id:'berlin-evening',title:'Berlin event',city:'Berlin',kind:'Sport',date:'2026-12-01',time:'18:00',place:'Public hall',capacity:8,privacy:'public'}],requests:[]}))});
  await ready(page);await page.locator('.head [data-act="tab"][data-val="events"]').click();await page.locator('[data-ilp-entry]').click();
  await expect(page.locator('#ilp-root .ilp-card .ilp-muted')).toContainText(await page.evaluate(()=>window.IllyrianI18n.t('plans:statusClosed')));
  await context.close();
 }
});
for(const date of ['2027-03-28','2027-10-31']){
 test('Phase3 Plans rejects nonexistent or ambiguous Berlin time '+date,async({page})=>{
  await ready(page);await page.locator('.head [data-act="tab"][data-val="events"]').click();await page.locator('[data-ilp-entry]').click();await page.locator('[data-ilp="new"]').click();
  await page.locator('#ilp-form [name="title"]').fill('DST boundary activity');await page.locator('#ilp-form [name="place"]').fill('Public library');
  await page.locator('#ilp-form [name="city"]').selectOption('Berlin');await page.locator('#ilp-form [name="date"]').fill(date);await page.locator('#ilp-form [name="time"]').fill('02:30');
  const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
  await page.locator('#ilp-form [type="submit"]').click();await expect(page.locator('#ilp-form')).toBeVisible();
  await expect(page.locator('#ilp-error')).toContainText(await page.evaluate(()=>window.IllyrianI18n.t('plans:timeZoneError')));
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(raw);
 });
}
for(const lang of ['sq','en','it']){
 test('Phase3 education community reuses Feed/Profile comments and moderation '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await p3Community(page,'c4');
  await expect(page.locator('#layer .modalhead h2')).toHaveText({sq:'Shkolla & Universiteti',en:'School & University',it:'Scuola e Università'}[lang]);
  await expect(page.locator('#layer [data-act="v11-community-tab"][data-val="posts"]')).toHaveText({sq:'Postime dhe diskutime',en:'Posts and discussions',it:'Post e discussioni'}[lang]);
  await expect(page.locator('#layer [data-act="v11-community-toggle"]')).toHaveText({sq:'＋ Bashkohu në komunitet',en:'＋ Join community',it:'＋ Unisciti alla comunità'}[lang]);
  await page.locator('#layer [data-act="v11-community-toggle"]').click();
  await page.locator('#layer [data-act="v11-community-tab"][data-val="posts"]').click();
  await page.locator('#layer [data-act="community-compose"]').click();
  const text='Mbyll <script>window.p3Xss=1</script> diskutim '+lang;
  await page.locator('#v5-text').fill(text);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l==='it'?'en':'it'),lang);await expect(page.locator('#v5-text')).toHaveValue(text);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await p3FailCoreWrites(page);await page.locator('#layer [data-act="v5-publish"]').click();await expect(page.locator('#v5-text')).toHaveValue(text);
  await p3FailCoreWrites(page,false);await page.locator('#layer [data-act="v5-publish"]').click();
  await expect(page.locator('#layer .post-copy')).toContainText(text);
  const postId=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).posts[0].id);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).posts[0].communityId)).toBe('c4');expect(await page.evaluate(()=>window.p3Xss)).toBeUndefined();
  await page.locator('#layer [data-act="community-search"]').fill('no matching result');
  await expect(page.locator('#layer .post')).toHaveCount(0);
  await page.locator('#layer [data-act="community-search"]').fill('diskutim');await expect(page.locator('#layer .post')).toHaveCount(1);
  await page.locator('#layer .post [data-act="comments"]').click();await page.locator('#comment-input').fill('Përgjigje '+lang);await page.locator('#layer [data-act="send-comment"]').click();
  await expect(page.locator('#layer .bubble.me')).toHaveText('Përgjigje '+lang);
  await page.locator('#layer [data-act="v11-community-open"]').click();await expect(page.locator('#layer .modal')).toBeVisible();
  await page.keyboard.press('Escape');await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
  await expect(page.locator('#screen .post-copy').filter({hasText:text})).toHaveCount(1);
  await page.locator('#screen .post [data-act="v11-community-open"][data-id="c4"]').click();await expect(page.locator('#layer .modalhead h2')).toHaveText({sq:'Shkolla & Universiteti',en:'School & University',it:'Scuola e Università'}[lang]);await page.keyboard.press('Escape');
  await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();await expect(page.locator('#screen .post-copy').filter({hasText:text})).toHaveCount(1);
  await page.locator('#screen [data-act="postmore"][data-id="'+postId+'"]').click();await page.locator('#layer [data-act="report-post"]').click();expect(await page.evaluate(id=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).reports.includes(id),postId)).toBe(true);
  await page.reload();expect(await page.evaluate(id=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).posts.find(p=>p.id===id).communityId,postId)).toBe('c4');
 });
}
test('Phase3 GPS denied unavailable and revoked leaves manual social flows usable',async({page})=>{
 await page.addInitScript(()=>{window.p3GeoCalls=0;Object.defineProperty(navigator,'geolocation',{configurable:true,value:{getCurrentPosition(){window.p3GeoCalls++;throw Error('GPS denied')},watchPosition(){window.p3GeoCalls++;throw Error('GPS denied')}}})});
 await ready(page);await page.locator('#screen > .filters [data-act="feed"][data-val="Afër teje"]').click();await page.locator('#v9-near-city').selectOption('Milano');
 await page.reload();await expect(page.locator('#v9-near-city')).toHaveValue('Milano');
 await page.evaluate(()=>Object.defineProperty(navigator,'geolocation',{configurable:true,value:undefined}));
 await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();await expect(page.locator('#layer .modal')).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('[data-ilshop-open]').first().click();await expect(page.locator('#illyrian-shop-layer')).toBeVisible();await page.keyboard.press('Escape');
 await page.locator('.head [data-act="tab"][data-val="events"]').click();await page.locator('[data-ilc-entry]').click();await page.locator('[data-ilc="view:cities"]').click();
 await page.locator('#ilc-cities [name="home"]').selectOption('Berlin');await page.locator('#ilc-cities [type="submit"]').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_connections')).home)).toBe('Berlin');expect(await page.evaluate(()=>window.p3GeoCalls)).toBe(0);
});
test('Phase3 community activity draft uses canonical Plans without auto publish',async({page})=>{
 await ready(page);await p3Community(page,'c1');
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
 await page.locator('#layer [data-act="community-plan-draft"]').click();
 await expect(page.locator('#layer .modal')).toHaveCount(0);await expect(page.locator('#ilp-form')).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(before);
 await expect(page.locator('#ilp-form [name="date"]')).toHaveValue('');
 await page.locator('#ilp-form [name="title"]').fill('Komuniteti plan test');await page.locator('#ilp-form [name="place"]').fill('Public library');
 await page.locator('#ilp-form [name="date"]').fill('2027-06-01');await page.locator('#ilp-form [name="time"]').fill('17:30');await page.locator('#ilp-form [type="submit"]').click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_plans')).events[0]);expect(saved.communityId).toBe('c1');expect(saved.timeZone).toBe('Europe/Rome');
 await page.keyboard.press('Escape');await p3Community(page,'c1');await page.locator('#layer [data-act="community-plan-open"][data-id="'+saved.id+'"]').click();
 await expect(page.locator('#ilp-root h3')).toContainText('Komuniteti plan test');await expect(page.locator('#layer .modal')).toHaveCount(0);
});
test('Phase3 activity calendar and midnight remain independent of viewer zone',async({page})=>{
 await ready(page);
 const result=await page.evaluate(()=>{const r=(date,time,city='Berlin')=>window.IllyrianActivityTime.resolve({date,time,city});return {midnight:r('2027-01-01','00:15'),leap:r('2028-02-29','12:00'),invalid:r('2027-02-29','12:00'),unknown:r('2027-01-01','12:00','Unknown')}});
 expect(new Date(result.midnight).toISOString()).toBe('2026-12-31T23:15:00.000Z');expect(new Date(result.leap).toISOString()).toBe('2028-02-29T11:00:00.000Z');expect(result.invalid).toBeNull();expect(result.unknown).toBeNull();
});
test('Phase3 leaving a community composer does not redirect a later Feed post',async({page})=>{
 await ready(page);await p3Community(page,'c4');await page.locator('#layer [data-act="v11-community-toggle"]').click();await page.locator('#layer [data-act="v11-community-tab"][data-val="posts"]').click();await page.locator('#layer [data-act="community-compose"]').click();await page.keyboard.press('Escape');
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();await page.locator('#screen [data-act="modal"][data-val="compose"]').first().click();await page.locator('#v5-text').fill('A normal Feed post');await page.locator('#layer [data-act="v5-publish"]').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).posts[0].communityId)).toBeUndefined();await expect(page.locator('#layer .modal')).toHaveCount(0);
});
test('Phase3 education search matches the displayed en and it name',async({page})=>{
 await ready(page);await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();await page.locator('#screen [data-act="category"][data-val="Komunitete"]').click();
 for(const [lang,query] of [['en','School'],['it','Scuola']]){
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);await page.locator('#finder').fill(query);await expect(page.locator('#screen [data-act="v11-community-open"][data-id="c4"]').first()).toBeVisible();
 }
});
test('Phase3 a stale comment draft cannot overwrite another tab membership',async({page,context})=>{
 await ready(page);const second=await context.newPage();await ready(second);await second.locator('#screen [data-act="comments"][data-id="p1"]').first().click();
 await p3Community(page,'c1');await page.locator('#layer [data-act="v11-community-toggle"]').click();
 const confirmed=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 await second.locator('#comment-input').fill('Keep this unsent draft');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(confirmed);
 await second.locator('#layer [data-act="send-comment"]').click();await expect(second.locator('#comment-input')).toHaveValue('Keep this unsent draft');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(confirmed);
 await second.close();
});
for(const expires of ['2026-11-01T12:00:00.000Z','not-a-date']){
 test('Phase3 expired or invalid interest never exposes a matched draft '+expires,async({page})=>{
  await page.clock.setFixedTime(new Date('2026-11-01T12:00:00Z'));
  await page.addInitScript(expires=>localStorage.setItem('illyrian_demo_v17_connections',JSON.stringify({home:'Tiranë',origin:'Milano',choice:{topic:'football',city:'Tiranë',slot:'Të shtunën 17:00',expires}})),expires);
  await ready(page);await page.locator('.head [data-act="tab"][data-val="events"]').click();await page.locator('[data-ilc-entry]').click();await page.locator('[data-ilc="view:interest"]').click();
  await expect(page.locator('#ilc-root [data-ilc^="draft-topic:"]')).toHaveCount(0);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBeNull();
 });
}
test('Phase3 repeat activity only prepares a blank-date draft with no invitations',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({events:[{id:'old-meet',title:'Old Berlin meeting',city:'Berlin',kind:'Sport',date:'2026-01-01',time:'17:00',place:'Old private venue',capacity:2,privacy:'public',conditions:'Mbyll original'}],requests:[{id:'old-person',eventId:'old-meet',status:'accepted',name:'Old guest'}]})));
 await ready(page);await page.locator('.head [data-act="tab"][data-val="events"]').click();await page.locator('[data-ilc-entry]').click();await page.locator('[data-ilc="view:repeat"]').click();const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
 await page.locator('[data-ilc="repeat:old-meet"]').click();await expect(page.locator('#ilp-form [name="date"]')).toHaveValue('');await expect(page.locator('#ilp-form [name="place"]')).toHaveValue('');await expect(page.locator('#ilp-form [name="title"]')).toHaveValue('Old Berlin meeting');await expect(page.locator('#ilp-form [name="capacity"]')).toHaveValue('8');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(before);
});


for(const [lang,copy] of Object.entries({
 sq:{saved:'Shënimi privat u ruajt në pajisje. Organizatori nuk u njoftua.',removed:'Shënimi privat u hoq.',failed:'Hapësira lokale është plot; ndryshimi nuk u ruajt.'},
 en:{saved:'Private note saved on this device. The organizer was not notified.',removed:'Private note removed.',failed:'Local storage is full; the change was not saved.'},
 it:{saved:"Nota privata salvata sul dispositivo. L'organizzatore non è stato avvisato.",removed:'Nota privata rimossa.',failed:'Lo spazio di archiviazione locale è esaurito; la modifica non è stata salvata.'}
})){
 for(const refused of [false,true]){
  test('Phase3 followup first-attendee feedback '+(refused?'quota and retry ':'save and remove ')+lang,async({page})=>{
   await ready(page);
   await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
   await page.locator('.head [data-act="tab"][data-val="events"]').click();
   await page.locator('[data-ilc-entry]').click();
   await page.locator('[data-ilc="view:welcome"]').click();
   const checkbox=page.locator('[data-ilc-first="city-1"]');
   const status=page.locator('#ilc-root [role="status"]');
   const key='illyrian_demo_v17_connections';
   if(refused){
    const before=await page.evaluate(k=>localStorage.getItem(k),key);
    await rejectModuleWrites(page,key);
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
    expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
    await expect(status).toBeVisible();
    await expect(status).toHaveText(copy.failed);
    await expect(checkbox).toBeFocused();
    await allowModuleWrites(page);
   }
   await checkbox.check();
   expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).welcome['city-1'],key)).toBe(true);
   await expect(status).toBeVisible();
   await expect(status).toHaveText(copy.saved);
   await expect(checkbox).toBeFocused();
   await checkbox.uncheck();
   await expect(status).toHaveText(copy.removed);
   expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).welcome['city-1'],key)).toBe(false);
   await checkbox.check();
   await page.reload();
   await page.locator('.head [data-act="tab"][data-val="events"]').click();
   await page.locator('[data-ilc-entry]').click();
   await page.locator('[data-ilc="view:welcome"]').click();
   await expect(page.locator('[data-ilc-first="city-1"]')).toBeChecked();
  });
 }
}


test('IA-01: malformed stored Plans capacity is inert and raw data is preserved',async({page})=>{
 const key='illyrian_demo_v17_plans';
 await page.addInitScript(k=>localStorage.setItem(k,JSON.stringify({events:[{
  id:'audit-capacity',title:'Capacity record',kind:'Sport',city:'Tiranë',place:'Public park',
  date:'2099-10-12',time:'17:00',capacity:'<b data-capacity-probe="1">text</b>',price:0,privacy:'public'
 }],requests:[],messages:[],attendance:[]})),key);
 await ready(page);
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('#screen [data-ilp-entry]').first().click();
 await expect(page.locator('#ilp-root .ilp-card')).toContainText('0/—');
 await expect(page.locator('#ilp-root [data-capacity-probe]')).toHaveCount(0);
 await page.locator('#ilp-root [data-ilp="detail:audit-capacity"]').click();
 await expect(page.locator('#ilp-root .ilp-panel')).toContainText('0/—');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
});
test('IA-04: sorting historical Shop listings without seller never errors',async({page})=>{
 const key='illyrian_demo_v17_shop';
 await page.addInitScript(k=>localStorage.setItem(k,JSON.stringify({listings:[
  {id:'legacy-1',name:'Legacy one',kind:'Produkte',city:'Milano',price:2},
  {id:'legacy-2',name:'Legacy two',kind:'Produkte',city:'Romë',price:4,store:null}
 ]})),key);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await ready(page);
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#illyrian-shop-layer #ils-sort').selectOption('store');
 for(const name of ['Legacy one','Legacy two'])
  await expect(page.locator('#illyrian-shop-layer .ils-card').filter({hasText:name})).toHaveCount(1);
 expect(errors).toEqual([]);
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
});


test('IA-02 Connections rejects stale tab writes and preserves committed cities',async({browser})=>{
 const ctx=await browser.newContext(),a=await ctx.newPage(),b=await ctx.newPage();
 try{
  await ready(a);await ready(b);
  await a.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
  await b.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
  for(const p of [a,b])await p.locator('.head [data-act="tab"][data-val="events"]').click();
  for(const p of [a,b])await p.locator('#ilc-entry [data-ilc-entry]').click();
  await a.locator('#ilc-root [data-ilc="view:cities"]').click();
  await b.locator('#ilc-root [data-ilc="view:welcome"]').click();
  await a.locator('#ilc-cities select[name="home"]').selectOption('Berlin');
  await a.locator('#ilc-cities button[type="submit"]').click();
  const key='illyrian_demo_v17_connections',afterA=await a.evaluate(k=>localStorage.getItem(k),key);
  const check=b.locator('#ilc-root [data-ilc-first="city-1"]');
  // The stale write must immediately revert the checkbox; Playwright check() expects it to stay checked.
  await check.click();
  await expect(check).not.toBeChecked();
  await expect(b.locator('#ilc-root .ilc-note[role="status"]')).toContainText('skedë tjetër');
  expect(await a.evaluate(k=>localStorage.getItem(k),key)).toBe(afterA);
  await b.reload({waitUntil:'load'});
  await b.locator('.head [data-act="tab"][data-val="events"]').click();
  await b.locator('#ilc-entry [data-ilc-entry]').click();
  await b.locator('#ilc-root [data-ilc="view:welcome"]').click();
  await b.locator('#ilc-root [data-ilc-first="city-1"]').check();
  const afterB=await a.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  expect(afterB.home).toBe('Berlin');expect(afterB.welcome['city-1']).toBe(true);
  await a.locator('#ilc-cities select[name="home"]').selectOption('Romë');
  await a.locator('#ilc-cities button[type="submit"]').click();
  await expect(a.locator('#ilc-cities select[name="home"]')).toHaveValue('Romë');
  const saved=await a.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  expect(saved.home).toBe('Berlin');expect(saved.welcome['city-1']).toBe(true);
 }finally{await ctx.close()}
});

test('IA-03 Connections retains unsent nondefault interest after storage quota failure',async({page})=>{
 await ready(page);
 await page.locator('.head [data-act="tab"][data-val="events"]').click();
 await page.locator('#ilc-entry [data-ilc-entry]').click();
 await page.locator('#ilc-root [data-ilc="view:interest"]').click();
 const f=page.locator('#ilc-interest');
 await f.locator('[name="topic"]').selectOption('language');
 await f.locator('[name="city"]').selectOption('Milano');
 await f.locator('[name="slot"]').selectOption('Të shtunën 11:00');
 await f.locator('[name="days"]').selectOption('7');
 const key='illyrian_demo_v17_connections',raw=await page.evaluate(k=>localStorage.getItem(k),key);
 await rejectModuleWrites(page,key);
 await f.locator('button[type="submit"]').click();
 for(const [field,v] of [['topic','language'],['city','Milano'],['slot','Të shtunën 11:00'],['days','7']])
  await expect(f.locator('[name="'+field+'"]')).toHaveValue(v);
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(raw);
 await allowModuleWrites(page);
 await f.locator('button[type="submit"]').click();
 await expect(page.locator('#ilc-root .ilc-chosen')).toHaveCount(1);
});

test('IA-03 Governance preserves unsent report fields and retries once after storage failure',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#ig6-entry [data-ig6="open"]').click();
 await page.locator('#ig6-root [data-ig6="tab:reports"]').click();
 const f=page.locator('#ig6-report'),key='illyrian_demo_v17_governance';
 await f.locator('[name="target"]').fill('Unique unsent report text');
 await f.locator('[name="reason"]').selectOption('Spam');
 await f.locator('[name="detail"]').fill('Unique details of the pending report');
 const raw=await page.evaluate(k=>localStorage.getItem(k),key);
 await rejectModuleWrites(page,key);
 await f.locator('button[type="submit"]').click();
 await expect(page.locator('#ig6-root .ig6-note[role="status"]')).toBeVisible();
 await expect(f.locator('[name="target"]')).toHaveValue('Unique unsent report text');
 await expect(f.locator('[name="reason"]')).toHaveValue('Spam');
 await expect(f.locator('[name="detail"]')).toHaveValue('Unique details of the pending report');
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(raw);
 await allowModuleWrites(page);
 await f.locator('button[type="submit"]').click();
 const data=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 expect(data.cases.filter(x=>x.target==='Unique unsent report text')).toHaveLength(1);
});


// Follow-up audit probes: stored-data schema variants, reverse tab order and form focus.
for(const [label,invalid] of [
 ['null',null],['object',{unexpected:'capacity'}],['negative',-1],
 ['zero',0],['oversized',101],['fractional',1.5],['numeric-string','8']
]){
 test('IA-01 schema variants capacity '+label+' remains inert and raw storage untouched',async({page})=>{
  const key='illyrian_demo_v17_plans';
  await page.addInitScript(({key,invalid})=>localStorage.setItem(key,JSON.stringify({
   events:[{id:'capacity-legacy',title:'Legacy capacity',kind:'Sport',city:'Tiranë',place:'Public park',date:'2099-10-12',time:'17:00',capacity:invalid,price:0,privacy:'public',conditions:''}],
   requests:[],messages:[],attendance:[]
  })),{key,invalid});
  await ready(page);
  const before=await page.evaluate(k=>localStorage.getItem(k),key);
  await page.locator('.head [data-act="tab"][data-val="events"]').click();
  await page.locator('#screen [data-ilp-entry]').first().click();
  await expect(page.locator('#ilp-root .ilp-card')).toContainText('0/—');
  await page.locator('#ilp-root [data-ilp="detail:capacity-legacy"]').click();
  await expect(page.locator('#ilp-root .ilp-panel')).toContainText('0/—');
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 });
}
test('IA-04 Shop sorting all modes tolerates mixed missing, null, numeric and valid sellers',async({page})=>{
 const key='illyrian_demo_v17_shop';
 await page.addInitScript(k=>localStorage.setItem(k,JSON.stringify({listings:[
  {id:'hist-1',name:'Historical empty seller',kind:'Produkte',city:'Milano',price:1},
  {id:'hist-2',name:'Historical null seller',kind:'Produkte',city:'Romë',price:2,store:null},
  {id:'hist-3',name:'Historical numeric seller',kind:'Produkte',city:'Tiranë',price:3,store:42},
  {id:'hist-4',name:'Current named seller',kind:'Produkte',city:'Tiranë',price:4,store:'Shop Albania'}
 ]})),key);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await ready(page);
 const raw=await page.evaluate(k=>localStorage.getItem(k),key);
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await page.locator('[data-ilshop-open]').first().click();
 const sort=page.locator('#illyrian-shop-layer #ils-sort');
 for(const mode of ['store','price-low','price-high','relevance','store']){
  await sort.selectOption(mode);
  for(const name of ['Historical empty seller','Historical null seller','Historical numeric seller','Current named seller'])
   await expect(page.locator('#illyrian-shop-layer .ils-card').filter({hasText:name})).toHaveCount(1);
 }
 expect(errors).toEqual([]);
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(raw);
});
for(const [lang,notice] of Object.entries({
 sq:'Të dhënat u ndryshuan në një skedë tjetër.',
 en:'Data changed in another tab.',
 it:"I dati sono cambiati in un'altra scheda."
})){
 test('IA-02 Connections reverse tab order and '+lang+' conflict notice preserve welcome',async({browser})=>{
  const ctx=await browser.newContext(),a=await ctx.newPage(),b=await ctx.newPage(),key='illyrian_demo_v17_connections';
  try{
   await ready(a);await ready(b);
   for(const p of [a,b]){
    await p.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
    await p.locator('.head [data-act="tab"][data-val="events"]').click();
    await p.locator('#ilc-entry [data-ilc-entry]').click();
   }
   await a.locator('#ilc-root [data-ilc="view:welcome"]').click();
   await b.locator('#ilc-root [data-ilc="view:cities"]').click();
   await a.locator('#ilc-root [data-ilc-first="city-1"]').check();
   const committed=await a.evaluate(k=>localStorage.getItem(k),key);
   await b.locator('#ilc-cities select[name="home"]').selectOption('Berlin');
   await b.locator('#ilc-cities button[type="submit"]').click();
   await expect(b.locator('#ilc-cities select[name="home"]')).toHaveValue('Berlin');
   await expect(b.locator('#ilc-root .ilc-note[role="status"]')).toContainText(notice);
   expect(await a.evaluate(k=>localStorage.getItem(k),key)).toBe(committed);
   await b.reload({waitUntil:'load'});
   await b.locator('.head [data-act="tab"][data-val="events"]').click();
   await b.locator('#ilc-entry [data-ilc-entry]').click();
   await b.locator('#ilc-root [data-ilc="view:cities"]').click();
   await b.locator('#ilc-cities select[name="home"]').selectOption('Berlin');
   await b.locator('#ilc-cities button[type="submit"]').click();
   const data=await a.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
   expect(data.home).toBe('Berlin');
   expect(data.welcome['city-1']).toBe(true);
  }finally{await ctx.close()}
 });
}
test('IA-03 Governance quota failure retains keyboard focus and exact report on retry',async({page})=>{
 await ready(page);
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await page.locator('#ig6-entry [data-ig6="open"]').click();
 await page.locator('#ig6-root [data-ig6="tab:reports"]').click();
 const form=page.locator('#ig6-report'),key='illyrian_demo_v17_governance';
 await form.locator('[name="target"]').fill('Distinct focused draft');
 await form.locator('[name="reason"]').selectOption('Spam');
 await form.locator('[name="detail"]').fill('This text must remain after a write failure');
 await rejectModuleWrites(page,key);
 const btn=form.locator('button[type="submit"]');await btn.click();
 await expect(btn).toBeFocused();
 await expect(form.locator('[name="target"]')).toHaveValue('Distinct focused draft');
 await allowModuleWrites(page);
 await btn.click();
 const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 expect(saved.cases.filter(x=>x.target==='Distinct focused draft')).toHaveLength(1);
});


// Owner reference: ONE composer after Stories, filters next; Shop entry retained after feed.
async function assertHomeComposerOrder(page){
 await expect(page.locator('#screen > .stories + .compose')).toHaveCount(1);
 await expect(page.locator('#screen > .compose + .filters')).toHaveCount(1);
 await expect(page.locator('#screen > .ils-entry')).toHaveCount(1);
 await expect(page.locator('#screen > .v15-studio')).toHaveCount(1);
 await expect(page.locator('#screen > .compose')).toHaveCount(1);
 await expect(page.locator('#screen > .compose > .avatar')).toHaveCount(1);
 await expect(page.locator('#screen > .compose .compose-prompt')).toBeVisible();
 await expect(page.locator('#screen > .compose [data-act="modal"][data-val="compose"].red-icon')).toHaveCount(1);
 await expect(page.locator('#screen > .ils-entry [data-ilshop-open]')).toBeVisible();
}
test('Home composer directly follows Stories before Shop on mobile; post and media handlers unchanged',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await ready(page);
 await assertHomeComposerOrder(page);
 await page.locator('#screen > .compose .compose-prompt').click();
 await expect(page.locator('#layer #v5-text')).toBeVisible();
 await page.locator('#layer [data-act="close"]').click();
 await assertHomeComposerOrder(page);
 await page.locator('#screen > .compose .red-icon').click();
 await expect(page.locator('#layer .v5-photo-label')).toBeVisible();
 await expect(page.locator('#layer #v5-file')).toHaveCount(1);
 await page.locator('#layer [data-act="close"]').click();
 await assertHomeComposerOrder(page);
 await page.locator('#screen > .ils-entry [data-ilshop-open]').click();
 await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);
 await assertHomeComposerOrder(page);
});
test('Home composer remains directly below Stories after navigation, filter and locale change on desktop',async({page})=>{
 await page.setViewportSize({width:1100,height:850});
 await ready(page);
 await assertHomeComposerOrder(page);
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();
 await expect(page.locator('#screen #finder')).toBeVisible();
 await expect(page.locator('#screen [data-ilshop-open]')).toBeVisible();
 await page.locator('#navbar [data-act="tab"][data-val="home"]').click();
 await assertHomeComposerOrder(page);
 await page.locator('#screen .filters [data-act="feed"]').nth(1).click();
 await assertHomeComposerOrder(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(page.locator('#screen > .compose .compose-prompt')).toHaveText('A cosa stai pensando?');
 await assertHomeComposerOrder(page);
});

// Marketplace programme, phase 1 only: existing Shop and Shop Plus stay independent.
for(const lang of ['sq','en','it']){
 test('Shop phase 1 business discovery and profile without GPS '+lang,async({page})=>{
  await page.addInitScript(()=>{
   window.__shopGpsCalls=0;
   navigator.geolocation.getCurrentPosition=()=>{window.__shopGpsCalls++;throw Error('GPS must be optional')};
  });
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('#ils-search').fill('kafe tirane');
  await expect(page.locator('#illyrian-shop-layer .ils-card')).toHaveCount(2);
  await page.locator('[data-ils="businesses"]').click();
  await expect(page.locator('#ils-businesses article')).toHaveCount(2);
  await page.locator('[data-ils="business"][data-value="Market Arbër"]').click();
  const profile=page.locator('.ils-business-profile');
  await expect(profile.locator('h2')).toHaveText('Market Arbër');
  await expect(profile).toContainText('Tiranë');
  await expect(profile.locator('[data-hours]')).not.toBeEmpty();
  await expect(profile.locator('[data-contact]')).toContainText(await page.evaluate(()=>window.IllyrianI18n.t('shop:contactDemo')));
  await page.locator('[data-ils="business-catalog"]').click();
  await expect(page.locator('#illyrian-shop-layer .ils-card')).toHaveCount(1);
  expect(await page.evaluate(()=>window.__shopGpsCalls)).toBe(0);
 });
 test('Shop phase 1 category filters show only relevant fields '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('[data-isp-open]').click();
  const root=page.locator('#isp-root'),form=root.locator('#isp-filters');
  await root.locator('[data-isp="type:Produkte"]').click();
  await expect(form.locator('[name="year"]')).toHaveCount(0);
  await expect(form.locator('[name="area"]')).toHaveCount(0);
  await expect(form.locator('[name="stock"]')).toBeVisible();
  await root.locator('[data-isp="type:Makina"]').click();
  await form.locator('[name="year"]').fill('2019');
  await form.locator('button[type="submit"]').click();
  await expect(root.locator('.isp-cards .isp-card')).toHaveCount(1);
  await root.locator('[data-isp="type:Produkte"]').click();
  await form.locator('button[type="submit"]').click();
  await expect(root.locator('.isp-cards .isp-card')).toHaveCount(5);
  await root.locator('[data-isp="type:Prona"]').click();
  await expect(form.locator('[name="area"]')).toBeVisible();
  await expect(form.locator('[name="year"]')).toHaveCount(0);
  await root.locator('[data-isp="type:Punë"]').click();
  await expect(form.locator('[name="area"]')).toHaveCount(0);
  await expect(form.locator('[name="stock"]')).toHaveCount(0);
  await expect(root.locator('.isp-cards .isp-card')).toHaveCount(1);
 });
 test('Shop phase 1 Jobs save with undisclosed salary and preserve Plus '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
  await page.locator('[data-ilshop-open]').first().click();
  await page.locator('[data-ils="sell"]').click();
  const f=page.locator('#ils-sell-form');
  await f.locator('[name="kind"]').selectOption('Punë');
  await f.locator('[name="name"]').fill('Mbyll job opportunity');
  await f.locator('[name="store"]').fill('Mbyll employer');
  await f.locator('button[type="submit"]').click();
  await page.locator('.ils-card').filter({hasText:'Mbyll job opportunity'}).locator('[data-ils="detail"]').click();
  await expect(page.locator('.ils-price')).toHaveText(await page.evaluate(()=>window.IllyrianI18n.t('shop:salaryUnknown')));
  await expect(page.locator('[data-ils="add"]')).toHaveCount(0);
  await page.locator('[data-ils="contact"]').click();
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop')));
  expect(stored.listings[0]).toMatchObject({kind:'Punë',name:'Mbyll job opportunity',price:0});
  expect(stored.requests).toHaveLength(1);
  expect(stored.orders).toHaveLength(0);
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(before);
 });
}

test('Shop phase 1 Plus property and job forms persist only category data',async({page})=>{
 await ready(page);await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'));
 await page.locator('[data-ilshop-open]').first().click();await page.locator('[data-isp-open]').click();
 await page.locator('#isp-root [data-isp="create"]').click();
 const f=page.locator('#isp-create');
 await f.locator('[name="type"]').selectOption('Prona');
 await f.locator('[name="name"]').fill('Mbyll property');await f.locator('[name="store"]').fill('Mbyll agency');
 await f.locator('[name="price"]').fill('90000');await f.locator('[name="area"]').fill('80');
 await expect(f.locator('[name="period"]')).toBeHidden();
 await expect(f.locator('[name="year"]')).toBeDisabled();
 await f.locator('button[type="submit"]').click();
 let saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
 expect(saved).toMatchObject({type:'Prona',area:80,year:null,quantity:null});
 await page.locator('#isp-root [data-isp^="edit:"]').click();
 await f.locator('[name="type"]').selectOption('Punë');await f.locator('[name="price"]').fill('');
 await expect(f.locator('[name="area"]')).toBeDisabled();
 await f.locator('button[type="submit"]').click();
 saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).items[0]);
 expect(saved).toMatchObject({type:'Punë',price:0,area:null,year:null,quantity:null});
 await expect(page.locator('#isp-root .isp-focus strong')).toHaveText('Salary not disclosed');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(before);
 await page.reload();await page.locator('[data-ilshop-open]').first().click();await page.locator('[data-isp-open]').click();
 await page.locator('#isp-root [data-isp="type:Punë"]').click();
 await expect(page.locator('#isp-root .isp-cards .isp-card').filter({hasText:'Mbyll property'})).toHaveCount(1);
});

test('Shop phase 1 business profile escapes historical data and never invents hours',async({page})=>{
 const seller='<img src=x onerror="window.__sellerInjected=1">';
 await page.addInitScript(s=>localStorage.setItem('illyrian_demo_v17_shop',JSON.stringify({listings:[{id:'legacy-profile',kind:'Produkte',name:'Historical offer',store:s,city:'Tiranë',price:5}]})),seller);
 await ready(page);await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'));
 await page.locator('[data-ilshop-open]').first().click();await page.locator('[data-ils="businesses"]').click();
 await page.locator('[data-ils="business"]').filter({hasText:'View business'}).first().click();
 const profile=page.locator('.ils-business-profile');
 await expect(profile.locator('h2')).toHaveText(seller);
 await expect(profile.locator('img')).toHaveCount(0);
 await expect(profile.locator('[data-hours]')).toHaveText('Hours not provided');
 expect(await page.evaluate(()=>window.__sellerInjected)).toBeUndefined();
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop'))).toBe(raw);
});

test('Shop phase 1 Plus business profile and mobile return preserve nested dialog',async({page})=>{
 await page.setViewportSize({width:320,height:568});await ready(page);
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('[data-ilshop-open]').first().click();await page.locator('[data-isp-open]').click();
 await page.locator('#isp-root [data-isp="tab:stores"]').click();
 await page.locator('#isp-root [data-isp="store:Market Arbër"]').click();
 await expect(page.locator('#isp-root .ils-business-profile h2')).toHaveText('Market Arbër');
 await expect(page.locator('#isp-root .ils-business-profile')).toContainText('No real contact');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.keyboard.press('Escape');await expect(page.locator('#isp-root')).toHaveCount(0);
 await expect(page.locator('#illyrian-shop-layer')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);
});

test('Shop phase 1 locale repaint retains job draft, category label and focus',async({page})=>{
 await ready(page);await page.evaluate(()=>window.IllyrianI18n.changeLanguage('sq'));
 await page.locator('[data-ilshop-open]').first().click();await page.locator('[data-ils="sell"]').click();
 const f=page.locator('#ils-sell-form');await f.locator('[name="kind"]').selectOption('Punë');
 await f.locator('[name="name"]').fill('Mbyll user job');await f.locator('[name="store"]').fill('Mbyll user business');
 await f.locator('[name="description"]').fill('Custom job draft');await f.locator('[name="description"]').focus();
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(f.locator('[name="description"]')).toBeFocused();
 await expect(f.locator('[name="name"]')).toHaveValue('Mbyll user job');
 await expect(f.locator('[name="description"]')).toHaveValue('Custom job draft');
 await expect(f.locator('[name="kind"] option:checked')).toHaveText('Lavoro');
 await expect(f.locator('[data-price-label]')).toContainText('facoltativa');
 await expect(f.locator('[name="price"]')).not.toHaveAttribute('required');
});

test('Shop phase 1 query covers localized category, need description and manual city',async({page})=>{
 await ready(page);await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('[data-ilshop-open]').first().click();
 await page.locator('#ils-search').fill('properties');
 await expect(page.locator('.ils-card')).toHaveCount(1);
 await page.locator('#ils-search').fill('pastrim');await page.locator('#ils-city').selectOption('Elbasan');
 await expect(page.locator('.ils-card')).toHaveCount(1);
 await page.locator('#ils-city').selectOption('Tiranë');await expect(page.locator('.ils-card')).toHaveCount(0);
 await page.locator('#ils-search').fill('');await page.locator('#ils-city').selectOption('Të gjitha');
 await page.locator('[data-isp-open]').click();
 await page.locator('#isp-filters [name="q"]').fill('lavoro');await page.locator('#isp-filters button[type="submit"]').click();
 await expect(page.locator('#isp-root .isp-cards .isp-card')).toHaveCount(1);
 await page.locator('#isp-root [data-isp="tab:needs"]').click();await expect(page.locator('#isp-need')).toBeVisible();
 await page.locator('#isp-need [name="type"]').selectOption('Punë');await page.locator('#isp-need [name="title"]').fill('Kërkoj punonjës demo');
 await page.locator('#isp-need [name="budget"]').fill('800');await page.locator('#isp-need button[type="submit"]').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v17_shop_plus')).needs[0].type)).toBe('Punë');
});

// Marketplace programme phase 2: references point at existing catalogs, never copied offers.
async function commercePost(page,{business='',listing='shop|listing|p1',sponsored=false}={}){
 await page.locator('#screen .compose-prompt').click();
 await page.locator('#v5-text').fill('Mbyll tagged social post');
 await page.locator('#ily-commerce-post-business').selectOption(business);
 await page.locator('#ily-commerce-post-listing').selectOption(listing);
 await page.locator('#ily-commerce-post-sponsored').setChecked(sponsored);
 await page.locator('[data-act="v5-publish"]').click();
 return page.locator('#screen article.post').filter({hasText:'Mbyll tagged social post'}).first();
}
for(const lang of ['sq','en','it']){
 test('Commerce phase 2 photo post tags open exact business and listing '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  await page.locator('#screen .compose-prompt').click();await page.locator('#v5-text').fill('Mbyll photo commerce');
  await page.locator('[data-act="v5-sample"][data-id="cafe"]').click();
  await page.locator('#ily-commerce-post-business').selectOption('shop|business|Market%20Arb%C3%ABr');
  await page.locator('#ily-commerce-post-listing').selectOption('shop|listing|p1');
  await page.locator('[data-act="v5-publish"]').click();
  const post=page.locator('#screen article.post').filter({hasText:'Mbyll photo commerce'});
  await expect(post.locator('img.post-photo,img.v5-media')).toBeVisible();
  await expect(post.locator('[data-ily-commerce-open]')).toHaveCount(2);
  await post.locator('[data-ily-commerce-open="shop|business|Market%20Arb%C3%ABr"]').click();
  await expect(page.locator('.ils-business-profile h2')).toHaveText('Market Arbër');
  await page.keyboard.press('Escape');await expect(page.locator('#illyrian-shop-layer')).toHaveCount(0);
  await post.locator('[data-ily-commerce-open="shop|listing|p1"]').click();
  await expect(page.locator('#illyrian-shop-layer h2')).toHaveText('Kafe espresso 250 g');
  await page.keyboard.press('Escape');
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).posts[0].commerceRefs)).toEqual([
   {source:'shop',type:'business',id:'Market Arbër'},{source:'shop',type:'listing',id:'p1'}]);
 });
 test('Commerce phase 2 sponsorship stays explicit in Feed and Profile '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  const post=await commercePost(page,{sponsored:true});
  const label=await page.evaluate(()=>window.IllyrianI18n.t('commerce:sponsored'));
  await expect(post.locator('[data-ily-commerce-sponsored]')).toHaveText(label);
  await expect(post.locator('[data-ily-commerce-disclosure]')).toContainText(await page.evaluate(()=>window.IllyrianI18n.t('commerce:notVerified')));
  await page.locator('#navbar [data-val="profile"]').click();
  await expect(page.locator('#screen [data-ily-commerce-sponsored]').first()).toHaveText(label);
  await page.reload();await expect(page.locator('#screen [data-ily-commerce-sponsored]').first()).toHaveText(label);
  await expect(page.locator('#screen article.post').filter({hasText:'Një tjetër ditë e bukur'}).locator('[data-ily-commerce-sponsored]')).toHaveCount(0);
 });
}
for(const kind of ['story','reel']){
 test('Commerce phase 2 '+kind+' links product and returns with reply draft',async({page})=>{
  await ready(page);await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
  await commercePost(page,{listing:'shopPlus|listing|k1'});
  await page.locator('[data-act="v15-open"][data-val="'+kind+'"]').first().click();
  await page.locator('#v15-caption').fill('Mbyll commerce '+kind);
  await page.locator('#v15-plan').selectOption('e2');
  await page.locator('#ily-commerce-media-listing').selectOption('shopPlus|listing|k1');
  await page.locator('[data-act="v15-preview"]').click();
  await expect(page.locator('#ily-commerce-media-listing')).toHaveValue('shopPlus|listing|k1');
  await page.locator('[data-act="v15-publish"]').click();
  await page.locator('#v16-comment').fill('Mbyll reply draft');
  await page.locator('.v16-viewer [data-ily-commerce-open="shopPlus|listing|k1"]').click();
  await expect(page.locator('#isp-root .isp-focus h3')).toHaveText('Kafe espresso 250 g');
  await page.keyboard.press('Escape');
  await expect(page.locator('.v16-viewer')).toBeVisible();
  await expect(page.locator('.v16-viewer [data-ily-commerce-open="shopPlus|listing|k1"]')).toBeFocused();
  await expect(page.locator('#v16-comment')).toHaveValue('Mbyll reply draft');
  await expect(page.locator('[data-act="v16-plan"][data-id="e2"]')).toBeVisible();
  await page.locator('[data-act="v16-plan"]').click();await expect(page.locator('[data-act="v16-back"]')).toBeVisible();
  await page.locator('[data-act="v16-back"]').click();await expect(page.locator('.v16-viewer')).toBeVisible();
  const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem('illyrian_demo_v15_creator'))[k==='story'?'stories':'reels'][0],kind);
  expect(saved.commerceRefs).toEqual([{source:'shopPlus',type:'listing',id:'k1'}]);expect(saved.plan).toBe('e2');
 });
}

test('Commerce phase 2 missing expired unavailable refs stay bounded and literal',async({page})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('illyrian_demo_v17_shop_plus',JSON.stringify({items:[{id:'expired-ref',name:'Expired example',store:'Demo',city:'Tiranë',type:'Shërbime',price:3,expires:'2020-01-01T00:00:00Z'}]}));
  const base={name:'Mbyll',ava:'a1',city:'Tiranë',when:'Tani',text:'Historical commerce',likes:0,comments:0,share:0};
  localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({posts:[
   {...base,id:'missing-commerce',commerceRefs:[{source:'shop',type:'listing',id:'gone'}]},
   {...base,id:'expired-commerce',commerceRefs:[{source:'shopPlus',type:'listing',id:'expired-ref'}]},
   {...base,id:'stock-commerce',commerceRefs:[{source:'shopPlus',type:'listing',id:'k3'}]},
   {...base,id:'unsafe-commerce',commerceRefs:[{source:'javascript:alert(1)',type:'listing',id:'<img src=x onerror=alert(1)>'}]}
  ]}));
 });
 await ready(page);await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await expect(page.locator('#screen [data-ily-commerce-open][disabled]')).toHaveCount(3);
 await expect(page.locator('#screen [data-ily-commerce-refs]')).toContainText(['Listing unavailable','Expired','Out of stock']);
 expect(await page.locator('[href^="javascript:"]').count()).toBe(0);
});

test('Commerce phase 2 quota retry preserves selections and creates once',async({page})=>{
 await ready(page);await page.locator('#screen .compose-prompt').click();await page.locator('#v5-text').fill('Mbyll retry commerce');
 await page.locator('#ily-commerce-post-listing').selectOption('shopPlus|listing|s1');
 await page.locator('#ily-commerce-post-sponsored').check();
 await rejectModuleWrites(page,'illyrian_demo_v09_state');await page.locator('[data-act="v5-publish"]').click();
 await expect(page.locator('#v5-text')).toHaveValue('Mbyll retry commerce');
 await expect(page.locator('#ily-commerce-post-listing')).toHaveValue('shopPlus|listing|s1');
 await expect(page.locator('#ily-commerce-post-sponsored')).toBeChecked();
 await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));
 await expect(page.locator('#ily-commerce-post-listing')).toHaveValue('shopPlus|listing|s1');
 await allowModuleWrites(page);await page.locator('[data-act="v5-publish"]').click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).posts.filter(p=>p.text==='Mbyll retry commerce').length)).toBe(1);
});

test('Commerce phase 2 deleted during composing rejects tag without dropping draft',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('illyrian_demo_v17_shop',JSON.stringify({listings:[{id:'own-ref',name:'Own referenced item',kind:'Produkte',store:'Own store',city:'Tiranë',price:3,owned:true}]})));
 await ready(page);await page.locator('#screen .compose-prompt').click();await page.locator('#v5-text').fill('Keep commerce draft');
 await page.locator('#ily-commerce-post-listing').selectOption('shop|listing|own-ref');
 await page.evaluate(()=>localStorage.setItem('illyrian_demo_v17_shop',JSON.stringify({listings:[]})));
 await page.locator('[data-act="v5-publish"]').click();await expect(page.locator('#v5-text')).toHaveValue('Keep commerce draft');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')||'{}').posts||[])).toHaveLength(0);
 await page.locator('#ily-commerce-post-listing').selectOption('');await page.locator('[data-act="v5-publish"]').click();
 await expect(page.locator('#screen article.post').filter({hasText:'Keep commerce draft'})).toHaveCount(1);
});

test('Commerce phase 2 Search promotion is labelled and opens existing offer',async({page})=>{
 await ready(page);await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));
 await page.locator('#navbar [data-val="explore"]').click();await page.locator('#screen [data-act="category"][data-val="Biznese"]').click();
 const promo=page.locator('#screen .ily-commerce-promotion');await expect(promo.locator('[data-ily-commerce-sponsored]')).toHaveText("Sponsored");
 await promo.locator('[data-ily-commerce-open="shopPlus|listing|k2"]').click();
 await expect(page.locator('#isp-root .isp-focus h3')).toHaveText('Kafe espresso 250 g');
 await page.keyboard.press('Escape');await expect(page.locator('#screen .ily-commerce-promotion')).toBeVisible();
});

// Phase 5: one visible decision across local source projections; no real moderation.
async function safetyPanel(page){
 await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();await page.locator('#ig6-entry [data-ig6="open"]').click();await page.locator('[data-ig6="tab:reports"]').click();
}
async function safetyDecision(page,card,status='restricted'){
 await page.locator('[data-ig6="role:moderator"]').click();await card.locator('[data-ig6^="review:"]').click();await page.locator('#ig6-decision [name="decision"]').selectOption(status);await page.locator('#ig6-decision [name="note"]').fill('Written local decision for this example');await page.locator('#ig6-decision button').click();
}
for(const [lang,title] of [['sq',"Raportim lokal"],['en',"Local report"],['it',"Segnalazione locale"]]){
 test('Safety phase 5: contextual activity and Shop report retain source and locale - '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);await page.evaluate(()=>window.dispatchEvent(new CustomEvent('illyrian:plans:open',{detail:{id:'demo-football'}})));
  const source=page.locator('#ilp-root [data-ily-report]');await source.click();await expect(page.locator('#ig6-report-heading')).toHaveText(title);await expect(page.locator('#ilp-root')).toHaveAttribute('inert','');
  const form=page.locator('#ig6-report');await form.locator('[name="reason"]').selectOption('threat');await form.locator('[name="detail"]').fill('Literal personal draft <img src=x>');await form.locator('[name="detail"]').focus();
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang==='it'?'en':'it');await expect(form.locator('[name="detail"]')).toHaveValue('Literal personal draft <img src=x>');await expect(form.locator('[name="detail"]')).toBeFocused();
  await form.locator('button').click();const data=await teamData(page);expect(data.cases.at(-1).targetRef).toEqual({source:'plans',kind:'activity',id:'demo-football'});expect(data.cases.at(-1).reason).toBe('threat');
  await page.keyboard.press('Escape');await expect(source).toBeFocused();await expect(page.locator('#ilp-root')).not.toHaveAttribute('inert','');await page.keyboard.press('Escape');await page.locator('#navbar [data-val="home"]').click();await page.locator('[data-ilshop-open]').first().click();await page.locator('[data-ils="detail"]').first().click();
  const shop=page.locator('#illyrian-shop-layer [data-ily-report]');await shop.click();await expect(page.locator('#ig6-report [name="target"]')).not.toHaveValue('');await page.locator('#ig6-report button').click();expect((await teamData(page)).cases.at(-1).targetRef.source).toBe('shop');await page.keyboard.press('Escape');await expect(shop).toBeFocused();
 });
}
test('Safety phase 5: Shop Plus uses one stable decision, local notice and accepted appeal',async({page})=>{
 await ready(page);await page.evaluate(()=>window.IllyrianI18n.changeLanguage('en'));await page.locator('[data-ilshop-open]').first().click();await page.locator('[data-isp-open]').click();await page.locator('[data-isp="item:k1"]').click();await page.locator('[data-isp="report:k1"]').click();await page.locator('#isp-report button').click();
 const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus')),flag=JSON.parse(raw).flags[0];expect(flag.id).toEqual(expect.any(String));expect(flag.listingId).toBe('k1');
 await page.locator('#isp-root [data-ily-report-center]').click();const card=page.locator('[data-case-id]').filter({hasText:'Kafe espresso 250 g'});await safetyDecision(page,card);await expect(card.locator('[data-case-status]')).toContainText('Restricted');await expect(page.locator('#ig6-local-updates')).toContainText('Written local decision');
 await page.locator('[data-ig6="role:visitor"]').click();await card.locator('[data-ig6^="appeal:"]').click();await page.locator('#ig6-appeal textarea').fill('Please reconsider this local decision');await page.locator('#ig6-appeal button').click();await page.locator('[data-ig6="role:moderator"]').click();await page.locator('[data-ig6^="appeal-review:"]').click();await page.locator('#ig6-appeal-review textarea').fill('Accepted after local review of the example');await page.locator('#ig6-appeal-review button').click();
 await page.keyboard.press('Escape');await expect(page.locator('#isp-root .isp-card small')).toContainText('Restriction removed');expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(raw);
});
test('Safety phase 5: legacy flag identity survives insertion and does not rewrite raw storage',async({page})=>{
 await ready(page);const flags=[{target:'Unique old flag',reason:'Spam',detail:'Original evidence'},{target:'Another flag',reason:'Spam',detail:'Different evidence'}];await page.evaluate(flags=>localStorage.setItem('illyrian_demo_v17_shop_plus',JSON.stringify({flags})),flags);await page.reload();await safetyPanel(page);
 const card=page.locator('[data-case-id]').filter({hasText:'Unique old flag'});await expect(card).toHaveCount(1);const id=await card.getAttribute('data-case-id');await safetyDecision(page,card);const before=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));
 await page.evaluate(()=>{const key='illyrian_demo_v17_shop_plus',s=JSON.parse(localStorage.getItem(key));s.flags.unshift({target:'Prepended flag',reason:'Spam',detail:'No decision'});localStorage.setItem(key,JSON.stringify(s))});await page.reload();await safetyPanel(page);await expect(page.locator('[data-case-id="'+id+'"] [data-case-status]')).toContainText(/Kufizuar|Restricted|Limitato/);await expect(page.locator('[data-case-id]').filter({hasText:'Prepended flag'}).locator('[data-case-status]')).toContainText(/pritje|Pending|attesa/);expect(JSON.parse(before).flags).toEqual(flags);
 const after=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'));await page.keyboard.press('Escape');await safetyPanel(page);expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_shop_plus'))).toBe(after);
});
test('Safety phase 5: legacy social reports and accepted sample appeal share canonical status',async({page})=>{
 await ready(page);await page.evaluate(()=>{const k='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(k)||'{}');s.reports=['p1'];localStorage.setItem(k,JSON.stringify(s))});await page.reload();await safetyPanel(page);await expect(page.locator('[data-case-id="social:post:p1"]')).toHaveCount(1);await expect(page.locator('[data-case-id="social:post:p1"]')).toContainText(/Arsyeja nuk është regjistruar|No reason recorded|Motivo non registrato/);
 const sample=page.locator('[data-case-id="sample-2"]');await sample.locator('[data-ig6^="appeal:"]').click();await page.locator('#ig6-appeal textarea').fill('Please review this illustrative restriction');await page.locator('#ig6-appeal button').click();await page.locator('[data-ig6="role:moderator"]').click();await page.locator('[data-ig6^="appeal-review:"]').click();await page.locator('#ig6-appeal-review textarea').fill('Restriction lifted in this local demonstration');await page.locator('#ig6-appeal-review button').click();await page.locator('[data-ig6="tab:reports"]').click();await expect(sample.locator('[data-case-status]')).toContainText(/u hoq|removed|rimossa/);
});
test('Safety phase 5: failed decision keeps its exact form focus and retries once',async({page})=>{
 await ready(page);await safetyPanel(page);await page.locator('[data-ig6="role:moderator"]').click();await page.locator('[data-case-id="sample-1"] [data-ig6^="review:"]').click();const f=page.locator('#ig6-decision');await f.locator('[name="decision"]').selectOption('restricted');await f.locator('[name="note"]').fill('Unsent decision must survive this failed save');const raw=await page.evaluate(k=>localStorage.getItem(k),TEAM_KEY);await rejectModuleWrites(page,TEAM_KEY);await f.locator('button').click();await expect(f).toBeVisible();await expect(f.locator('[name="note"]')).toHaveValue('Unsent decision must survive this failed save');await page.evaluate(()=>window.IllyrianI18n.changeLanguage('it'));await expect(f.locator('[name="note"]')).toHaveValue('Unsent decision must survive this failed save');expect(await page.evaluate(k=>localStorage.getItem(k),TEAM_KEY)).toBe(raw);await allowModuleWrites(page);await f.locator('button').click();expect((await teamData(page)).cases.filter(x=>x.id==='sample-1')).toHaveLength(1);expect((await teamData(page)).audits.filter(x=>x.id==='sample-1')).toHaveLength(1);
});
test('Safety phase 5: contextual community profile and comment-thread reports preserve nested chat drafts',async({page})=>{
 await ready(page);await page.locator('#screen [data-act="user-profile"]').first().click();const profile=page.locator('#layer [data-ily-report]');await expect(profile).toHaveAttribute('data-report-kind','profile');await profile.click();await page.locator('#ig6-report button').click();await page.keyboard.press('Escape');await expect(profile).toBeFocused();await page.locator('#layer [data-act="v6-openchat"]').click();await page.locator('#v6-msg-input').fill('Keep this private local draft');const chat=page.locator('#layer [data-ily-report]');await chat.click();await page.keyboard.press('Tab');await expect(page.locator('#ig6-root')).not.toContainText('DEMO');await page.keyboard.press('Escape');await expect(page.locator('#v6-msg-input')).toHaveValue('Keep this private local draft');await expect(chat).toBeFocused();await page.keyboard.press('Escape');
 await page.locator('#navbar [data-val="explore"]').click();await page.locator('[data-act="v11-community-open"][data-id="c1"]').first().click();await page.locator('#layer [data-ily-report]').click();await page.locator('#ig6-report button').click();expect((await teamData(page)).cases.at(-1).targetRef).toEqual({source:'communities',kind:'community',id:'c1'});await page.keyboard.press('Escape');await page.keyboard.press('Escape');await page.locator('#navbar [data-val="home"]').click();await page.locator('#screen [data-act="comments"]').first().click();await page.locator('#layer [data-ily-report]').click();await expect(page.locator('#ig6-report [name="target"]')).not.toHaveValue('');await page.locator('#ig6-report button').click();expect((await teamData(page)).cases.at(-1).targetRef.kind).toBe('commentThread');
});
test('Safety phase 5: pending appeal blocks contradictory second decision and visitor cannot decide',async({page})=>{
 await ready(page);await safetyPanel(page);const card=page.locator('[data-case-id="sample-2"]');await expect(card.locator('[data-ig6^="review:"]')).toHaveCount(0);await card.locator('[data-ig6^="appeal:"]').click();await page.locator('#ig6-appeal textarea').fill('One pending appeal for this local example');await page.locator('#ig6-appeal button').click();await page.locator('[data-ig6="tab:reports"]').click();await expect(card.locator('[data-ig6^="appeal:"]')).toBeDisabled();await page.locator('[data-ig6="role:moderator"]').click();await expect(card.locator('[data-ig6^="review:"]')).toBeDisabled();
});
test('Safety phase 5: local mute hides feed without blocking chat and failed block rolls back',async({page})=>{
 await ready(page);await page.locator('#screen [data-act="user-profile"][data-id="arta"]').first().click();const mute=page.locator('[data-act="v8-toggle-mute"]');await mute.click();expect((await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')))).muted).toContain('arta');await page.locator('#layer [data-act="v6-openchat"]').click();await expect(page.locator('#v6-chat-form')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('#screen .post [data-act="user-profile"][data-id="arta"]')).toHaveCount(0);
 await page.evaluate(()=>{const b=document.createElement('button');b.dataset.act='user-profile';b.dataset.id='arta';document.querySelector('#screen').appendChild(b);b.click()});await rejectModuleWrites(page,'illyrian_demo_v09_state');await page.locator('[data-act="v8-toggle-block"]').click();await expect(page.locator('[data-act="v8-toggle-block"]')).not.toContainText('Zhblloko');expect((await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')))).blocked).not.toContain('arta');
});

test('Safety phase 5: malformed target domains fail closed and pending refs ignore property order',async({page})=>{
 await ready(page);expect(await page.evaluate(()=>window.IllyrianGovernance.reportButton('__proto__','post','p1','Bad domain'))).toBe('');
 await page.evaluate(()=>localStorage.setItem('illyrian_demo_v17_governance',JSON.stringify({cases:[{id:'existing-context',target:'Original local activity report',reason:'Spam',status:'pending',targetRef:{id:'demo-football',kind:'activity',source:'plans'}}]})));await page.reload();await page.evaluate(()=>window.dispatchEvent(new CustomEvent('illyrian:plans:open',{detail:{id:'demo-football'}})));await page.locator('#ilp-root [data-ily-report]').click();await page.locator('#ig6-report [name="detail"]').fill('No duplicate should be saved');await page.locator('#ig6-report button').click();expect((await teamData(page)).cases).toHaveLength(1);await expect(page.locator('#ig6-report [name="detail"]')).toHaveValue('No duplicate should be saved');
});
test('Safety phase 5: source collisions, escaped evidence and unknown statuses preserve raw records',async({page})=>{
 await ready(page);const stored={cases:[{id:'ugc-case',target:'<img src=x onerror=alert(1)>',reason:'Custom reason',detail:'<script>bad</script>',status:'Unknown <b>status</b>',targetRef:{source:'shop',kind:'listing',id:'demo-football'}}],appeals:[],audits:[],drafts:[]};await page.evaluate(s=>localStorage.setItem('illyrian_demo_v17_governance',JSON.stringify(s)),stored);await page.reload();const raw=await page.evaluate(k=>localStorage.getItem(k),TEAM_KEY);await safetyPanel(page);await expect(page.locator('[data-case-id="ugc-case"] [data-case-status]')).toHaveText('Unknown <b>status</b>');await expect(page.locator('#ig6-root img[src=x],#ig6-root script')).toHaveCount(0);expect(await page.evaluate(k=>localStorage.getItem(k),TEAM_KEY)).toBe(raw);await page.keyboard.press('Escape');await page.evaluate(()=>window.dispatchEvent(new CustomEvent('illyrian:plans:open',{detail:{id:'demo-football'}})));await page.locator('#ilp-root [data-ily-report]').click();await page.locator('#ig6-report button').click();const data=await teamData(page);expect(data.cases).toHaveLength(2);expect(data.cases[0]).toEqual(stored.cases[0]);expect(data.cases[1].targetRef.source).toBe('plans');
});

test('Safety phase 5 review: Reel arrows cannot change the inert report source',async({page})=>{
 await ready(page);await page.locator('#navbar [data-act="open-reels"]').click();const counter=page.locator('.v4-reel-counter'),before=await counter.textContent(),source=page.locator('#layer [data-ily-report]');await source.click();await page.locator('#ig6-root header button').focus();await page.keyboard.press('ArrowDown');await expect(counter).toHaveText(before);await page.keyboard.press('Escape');await expect(source).toBeFocused();await expect(page.locator('.v4-reel-overlay')).toBeVisible();
});
test('Safety phase 5 review: malformed stored targetRef cannot interrupt unrelated reporting',async({page})=>{
 await ready(page);await page.evaluate(()=>localStorage.setItem('illyrian_demo_v17_governance',JSON.stringify({cases:[{id:'malformed-ref',target:'Old malformed reference',reason:'Spam',status:'pending',targetRef:{source:{toString:null,valueOf:null},kind:'post',id:'p1'}}]})));await page.reload();await page.evaluate(()=>window.dispatchEvent(new CustomEvent('illyrian:plans:open',{detail:{id:'demo-football'}})));await page.locator('#ilp-root [data-ily-report]').click();await page.locator('#ig6-report button').click();expect((await teamData(page)).cases).toHaveLength(2);expect(await page.evaluate(()=>window.IllyrianGovernance.reportButton(['social'],'post','p1','Array source'))).toBe('');
});
test('Safety phase 5 review: Unicode legacy case keeps its complete audit reference',async({page})=>{
 await ready(page);await page.evaluate(()=>localStorage.setItem('illyrian_demo_v17_shop_plus',JSON.stringify({flags:[{target:'Unique flag',reason:'Spam',detail:'ë'.repeat(180)}]})));await page.reload();await safetyPanel(page);const card=page.locator('[data-case-id]').filter({hasText:'Unique flag'});await safetyDecision(page,card);const data=await teamData(page),saved=data.cases.find(c=>c.target==='Unique flag');expect(data.audits.find(a=>a.action.includes('moderator')).id).toBe(saved.id);
});

for(const timezoneId of ['America/New_York','Asia/Tokyo']){
 test('Smart Social 5.2 Privacy plan expiry agrees with Plans in '+timezoneId,async({browser})=>{
  const context=await browser.newContext({timezoneId}),page=await context.newPage();
  await page.clock.install({time:new Date('2026-12-01T16:30:00Z')});
  await page.addInitScript(()=>{localStorage.setItem('illyrian_demo_ui_language_v1','en');localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({events:[{id:'shared-berlin',title:'Shared Milan plan',city:'Milano',kind:'Sport',date:'2026-12-01',time:'18:00',place:'Public hall',capacity:8,privacy:'public'}],requests:[]}))});
  for(const [at,want,closed] of [['2026-12-01T16:30:00Z','available',false],['2026-12-01T17:00:00Z','expired',true]]){
   await page.clock.setFixedTime(new Date(at));await ready(page);
   const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
   await page.locator('.head [data-act="tab"][data-val="events"]').click();await page.locator('[data-ilp-entry]').click();
   await expect(page.locator('#ilp-root .ilp-card .ilp-muted')).toContainText(await page.evaluate(c=>window.IllyrianI18n.t(c?'plans:statusClosed':'plans:statusActive'),closed));
   await page.keyboard.press('Escape');await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();await page.locator('[data-il4-entry]').click();await page.locator('[data-il4="tab:states"]').click();
   await expect(page.locator('#il4-root .il4-card').filter({hasText:'Shared Milan plan'}).locator('[data-il4="state:'+want+'"]')).toBeVisible();
   await page.locator('[data-il4="tab:map"]').click();
   await expect(page.locator('#il4-root .il4-results button').filter({hasText:'Shared Milan plan'})).toHaveCount(closed?0:1);
   expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(raw);
  }
  await context.close();
 });
}
for(const lang of ['sq','en','it']){
 test('Smart Social 5.2 invalid plan time stays unknown with private and cancellation precedence '+lang,async({page})=>{
  await page.addInitScript(l=>{localStorage.setItem('illyrian_demo_ui_language_v1',l);const base={city:'Berlin',kind:'Sport',date:'2027-03-28',time:'02:30',place:'Private hall',capacity:2,privacy:'public'};localStorage.setItem('illyrian_demo_v17_plans',JSON.stringify({events:[{...base,id:'gap',title:'DST gap'},{...base,id:'secret',title:'SECRET PLAN',privacy:'private'},{...base,id:'cancelled',title:'Cancelled gap',cancelled:true}],requests:[]}))},lang);
  await ready(page);const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'));
  await page.locator('#navbar [data-act="tab"][data-val="explore"]').click();await page.locator('[data-il4-entry]').click();await page.locator('[data-il4="tab:states"]').click();
  const card=page.locator('#il4-root .il4-card').filter({hasText:'DST gap'}),unknown=await page.evaluate(()=>window.IllyrianI18n.t('privacy:stateUnknown'));
  await expect(card.locator('[data-il4="state:unknown"]')).toBeVisible();await expect(card).toContainText(unknown);
  await card.locator('button').click();await expect(page.locator('#il4-root .il4-notice')).toHaveText(unknown);
  await expect(page.locator('#il4-root')).not.toContainText('SECRET PLAN');
  await expect(page.locator('#il4-root .il4-card').filter({hasText:'Cancelled gap'}).locator('[data-il4="state:canceled"]')).toBeVisible();
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v17_plans'))).toBe(raw);
 });
}

async function s53Photo(page,color='blue',width=80,height=40){
 const data=await page.evaluate(({color,width,height})=>{const c=document.createElement('canvas');c.width=width;c.height=height;const x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,width,height);return c.toDataURL('image/png').split(',')[1]},{color,width,height});
 return {name:color+'.png',mimeType:'image/png',buffer:Buffer.from(data,'base64')};
}
async function s53Open(page,kind){
 if(kind==='post'){await page.locator('#screen .compose-prompt').click();return ['#v5-file','.v5-compose-preview img']}
 if(kind==='avatar'){await page.locator('#navbar [data-val="profile"]').click();await page.locator('[data-act="modal"][data-val="edit"]').first().click();return ['#v12-photo-file','.v12-avatar-large']}
 await page.locator('[data-act="v15-open"][data-val="'+kind+'"]').first().click();return ['#v15-file','.v15-preview img'];
}
async function s53Blue(page,selector){return page.locator(selector).evaluate(img=>{if(!img.complete||!img.naturalWidth)return false;const c=document.createElement('canvas');c.width=c.height=1;const x=c.getContext('2d');x.drawImage(img,0,0,1,1);const p=x.getImageData(0,0,1,1).data;return p[2]>200&&p[0]<30})}
async function s53HoldFirst(page){await page.evaluate(()=>{
 const NativeImage=window.Image,set=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src').set;
 window.Image=function(...args){const img=new NativeImage(...args);Object.defineProperty(img,'src',{set(value){if(!window.s53Release&&/^(blob:|data:)/.test(value)){window.s53Release=()=>new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});set.call(img,value)});}else set.call(img,value)}});return img};
})}
for(const kind of ['post','story','reel']){
 test('Media 5.3 latest photo wins over delayed decode '+kind,async({page})=>{
  await ready(page);const [input,preview]=await s53Open(page,kind);await s53HoldFirst(page);
  await page.locator(input).setInputFiles(await s53Photo(page,'red'));await expect.poll(()=>page.evaluate(()=>typeof window.s53Release)).toBe('function');
  await page.locator(input).setInputFiles(await s53Photo(page,'blue'));await expect.poll(()=>s53Blue(page,preview)).toBe(true);
  await page.evaluate(()=>window.s53Release());await expect.poll(()=>s53Blue(page,preview)).toBe(true);
 });
}
test('Media 5.3 corrupt post image releases URL and permits retry without losing text',async({page})=>{
 await ready(page);const [input,preview]=await s53Open(page,'post');await page.locator('#v5-text').fill('Photo retry draft');
 await page.evaluate(()=>{window.s53URLs=[];window.s53Revoked=[];const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=f=>{const u=create(f);window.s53URLs.push(u);return u};URL.revokeObjectURL=u=>{window.s53Revoked.push(u);revoke(u)}});
 await page.locator(input).setInputFiles({name:'bad.png',mimeType:'image/png',buffer:Buffer.from('not an image')});
 await expect.poll(()=>page.evaluate(()=>window.s53URLs.length===1&&window.s53Revoked.includes(window.s53URLs[0]))).toBe(true);
 await expect(page.locator('#v5-text')).toHaveValue('Photo retry draft');
 await page.locator(input).setInputFiles(await s53Photo(page));await expect.poll(()=>s53Blue(page,preview)).toBe(true);
 await expect.poll(()=>page.evaluate(()=>window.s53URLs.every(u=>window.s53Revoked.includes(u)))).toBe(true);
});
test('Media 5.3 closed composer cannot receive a delayed photo in a new draft',async({page})=>{
 await ready(page);const [input]=await s53Open(page,'post');await s53HoldFirst(page);
 await page.locator(input).setInputFiles(await s53Photo(page));await expect.poll(()=>page.evaluate(()=>typeof window.s53Release)).toBe('function');
 await page.keyboard.press('Escape');await s53Open(page,'post');await page.locator('#v5-text').fill('New composer');
 await page.evaluate(()=>window.s53Release());await expect(page.locator('.v5-compose-preview img')).toHaveCount(0);await expect(page.locator('#v5-text')).toHaveValue('New composer');
});
for(const lang of ['sq','en','it']){
 test('Media 5.3 avatar quota rolls back and retry preserves profile text '+lang,async({page})=>{
  await ready(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);const [input,preview]=await s53Open(page,'avatar');
  await page.locator('#edit-name').fill('Unsaved profile name');const before=await page.locator(preview).getAttribute('src');
  await page.evaluate(()=>{window.s53Set=Storage.prototype.setItem;window.s53Fail=true;Storage.prototype.setItem=function(k,v){if(k==='illyrian_demo_v09_state'&&window.s53Fail)throw new DOMException('Synthetic quota','QuotaExceededError');return window.s53Set.call(this,k,v)}});
  await page.locator(input).setInputFiles(await s53Photo(page));
  await expect(page.locator('.toast')).toContainText(await page.evaluate(()=>window.IllyrianI18n.t('common:storageSaveFailed')));
  await expect(page.locator(preview)).toHaveAttribute('src',before);await expect(page.locator('#edit-name')).toHaveValue('Unsaved profile name');
  await page.evaluate(()=>window.s53Fail=false);await page.locator(input).setInputFiles(await s53Photo(page));await expect.poll(()=>s53Blue(page,preview)).toBe(true);
  await expect(page.locator('#edit-name')).toHaveValue('Unsaved profile name');
  const dims=await page.locator(preview).evaluate(img=>[img.naturalWidth,img.naturalHeight]);expect(dims).toEqual([160,160]);
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).profile.name)).not.toBe('Unsaved profile name');
 });
}
test('Media 5.3 Story canvas error retains caption and permits retry',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await ready(page);const [input,preview]=await s53Open(page,'story');await page.locator('#v15-caption').fill('Canvas retry draft');
 await page.evaluate(()=>{window.s53Context=HTMLCanvasElement.prototype.getContext;window.s53FailCanvas=true;HTMLCanvasElement.prototype.getContext=function(...args){return window.s53FailCanvas?null:window.s53Context.apply(this,args)}});
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
 await page.locator(input).setInputFiles({name:'white.png',mimeType:'image/png',buffer:png});
 await expect(page.locator('.toast')).toBeVisible();expect(errors).toEqual([]);await expect(page.locator('#v15-caption')).toHaveValue('Canvas retry draft');
 await page.evaluate(()=>window.s53FailCanvas=false);await page.locator(input).setInputFiles(await s53Photo(page));await expect.poll(()=>s53Blue(page,preview)).toBe(true);
 await expect(page.locator('#v15-caption')).toHaveValue('Canvas retry draft');expect(errors).toEqual([]);
});
test('Media 5.3 post reencode keeps existing dimensions and rejects oversized input without discarding photo',async({page})=>{
 await ready(page);const [input,preview]=await s53Open(page,'post');await page.locator('#v5-text').fill('Bounded photo');
 await page.locator(input).setInputFiles(await s53Photo(page,'blue',3000,2000));await expect.poll(()=>s53Blue(page,preview)).toBe(true);
 const encoded=await page.locator(preview).evaluate(img=>({width:img.naturalWidth,height:img.naturalHeight,src:img.src}));
 expect([encoded.width,encoded.height]).toEqual([1240,827]);expect(encoded.src.startsWith('data:image/jpeg;base64,')).toBe(true);expect(encoded.src.length).toBeLessThanOrEqual(720000);
 await page.locator(input).setInputFiles({name:'too-big.png',mimeType:'image/png',buffer:Buffer.alloc(8*1024*1024+1)});
 await expect(page.locator('.toast')).toContainText('8 MB');await expect(page.locator(preview)).toHaveAttribute('src',encoded.src);await expect(page.locator('#v5-text')).toHaveValue('Bounded photo');
});

// Performance 5.4: rendering history must not truncate persisted messages or replace the live composer.
async function longChat(page,count=123){
 await page.addInitScript(count=>{
  localStorage.setItem('illyrian_demo_v07_session','entered');
  if(!localStorage.getItem('illyrian_demo_v09_state'))localStorage.setItem('illyrian_demo_v09_state',JSON.stringify({messages:{leon:Array.from({length:count},(_,i)=>'History '+i+' <img src=x onerror=alert(1)>'),arta:['Arta only']}}));
 },count);
 await ready(page);
 await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();
 await page.locator('#v6-inbox-list [data-act="v6-openchat"][data-id="leon"]').click();
}
for(const [lang,label] of [['sq','Ngarko mesazhet më të vjetra'],['en','Load older messages'],['it','Carica messaggi precedenti']]){
 test('Performance 5.4: ordered history preserves live draft, focus, scroll and raw data - '+lang,async({page})=>{
  await longChat(page);await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
  const box=page.locator('#v6-chat-scroll'),older=box.locator('[data-act="v54-chat-older"]'),bubbles=box.locator('.v6-bubble.me'),input=page.locator('#v6-msg-input');
  await expect(bubbles).toHaveCount(50);await expect(bubbles.first()).toContainText('History 73 <img');await expect(bubbles.last()).toContainText('History 122 <img');
  await expect(older).toHaveText(label);expect(await box.locator('.v6-bubble img').count()).toBe(0);
  await input.fill('Unsent history draft');await input.evaluate(el=>{el.setSelectionRange(3,8);window.__historyInput=el});
  const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
  await box.evaluate(el=>{el.scrollTop=0;window.__historyAnchor=el.querySelector('.v6-bubble.me');window.__historyTop=window.__historyAnchor.getBoundingClientRect().top});
  await older.focus();await page.keyboard.press('Enter');await expect(bubbles).toHaveCount(100);await expect(older).toBeFocused();
  await expect(bubbles.first()).toContainText('History 23 <img');
  expect(await page.evaluate(()=>Math.abs(window.__historyAnchor.getBoundingClientRect().top-window.__historyTop))).toBeLessThan(3);
  expect(await input.evaluate(el=>({same:el===window.__historyInput,start:el.selectionStart,end:el.selectionEnd}))).toEqual({same:true,start:3,end:8});
  await expect(input).toHaveValue('Unsent history draft');
  await older.click();await expect(bubbles).toHaveCount(123);await expect(older).toBeHidden();
  await expect(bubbles.first()).toBeFocused();
  const texts=await bubbles.evaluateAll(els=>els.map(el=>el.firstChild.textContent));
  expect(texts).toEqual(Array.from({length:123},(_,i)=>'History '+i+' <img src=x onerror=alert(1)>'));
  expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
  await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang==='en'?'it':'en');
  await expect(bubbles).toHaveCount(123);await expect(input).toHaveValue('Unsent history draft');
  await page.locator('#v6-chat-form button[type="submit"]').click();
  await expect(bubbles).toHaveCount(50);await expect(bubbles.last()).toContainText('Unsent history draft');
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).messages);
  expect(saved.leon).toEqual([...texts,'Unsent history draft']);expect(saved.arta).toEqual(['Arta only']);
 });
}
test('Performance 5.4: older history is scoped to the current thread and resets on reopen',async({page})=>{
 await longChat(page,51);const box=page.locator('#v6-chat-scroll');
 await expect(box.locator('.v6-bubble.me')).toHaveCount(50);
 await box.locator('[data-act="v54-chat-older"]').click();await expect(box.locator('.v6-bubble.me')).toHaveCount(51);
 await page.locator('[data-act="v6-back-inbox"]').click();await page.locator('[data-act="v6-openchat"][data-id="arta"]').click();
 await expect(box.locator('.v6-bubble.me')).toHaveCount(1);await expect(box).toContainText('Arta only');await expect(box.locator('[data-act="v54-chat-older"]')).toHaveCount(0);
 await page.locator('[data-act="v6-back-inbox"]').click();await page.locator('[data-act="v6-openchat"][data-id="leon"]').click();
 await expect(box.locator('.v6-bubble.me')).toHaveCount(50);await expect(box.locator('[data-act="v54-chat-older"]')).toBeVisible();
});
test('Performance 5.4: a 5000-message thread keeps the rendered tail bounded after send',async({page})=>{
 await longChat(page,5000);const bubbles=page.locator('#v6-chat-scroll .v6-bubble.me');await expect(bubbles).toHaveCount(50);
 await page.locator('#v6-msg-input').fill('Newest');await page.locator('#v6-chat-form button[type="submit"]').click();await expect(bubbles).toHaveCount(50);await expect(bubbles.last()).toContainText('Newest');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).messages.leon);expect(saved).toHaveLength(5001);expect(saved[0]).toBe('History 0 <img src=x onerror=alert(1)>');expect(saved.at(-1)).toBe('Newest');
 await page.reload({waitUntil:'load'});await page.locator('#navbar [data-act="modal"][data-val="inbox"]').click();await page.locator('[data-act="v6-openchat"][data-id="leon"]').click();await expect(bubbles).toHaveCount(50);await expect(bubbles.last()).toContainText('Newest');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('illyrian_demo_v09_state')).messages.leon.length)).toBe(5001);
});

for(const count of [0,50])test('Performance 5.4: complete short history needs no older control - '+count,async({page})=>{
 await longChat(page,count);const box=page.locator('#v6-chat-scroll');await expect(box.locator('.v6-bubble.me')).toHaveCount(count);await expect(box.locator('.v6-bubble:not(.me)')).toHaveCount(1);await expect(box.locator('[data-act="v54-chat-older"]')).toHaveCount(0);
});

for(const lang of ['sq','en','it'])test('Presentation copy has one About disclosure and preserves literal user DEMO text - '+lang,async({page})=>{
 await ready(page);
 await page.evaluate(()=>{const k='illyrian_demo_v09_state',s=JSON.parse(localStorage.getItem(k)||'{}');s.posts=Array.isArray(s.posts)?s.posts:[];s.posts.unshift({id:'copy-policy-ugc',name:'DEMO Studio',text:'DEMO is part of my own text <b>literal</b>',ava:'a1',city:'Tiranë',when:'Tani',likes:0,comments:0,share:0});localStorage.setItem(k,JSON.stringify(s))});
 await page.reload();await page.evaluate(l=>window.IllyrianI18n.changeLanguage(l),lang);
 const raw=await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'));
 const post=page.locator('#screen .post').filter({hasText:'DEMO is part of my own text'});
 await expect(post.locator('.post-copy')).toHaveText('DEMO is part of my own text <b>literal</b>');
 await expect(post.locator('.post-name')).toContainText('DEMO Studio');
 await expect(page.locator('#screen .demo-tag')).toHaveCount(0);
 const bad=await page.evaluate(()=>Object.entries(window.ILLYRIAN_LOCALES[window.IllyrianI18n.language]).flatMap(([ns,values])=>Object.keys(values).filter(k=>/\bdemo(?:s|je)?\b/i.test(window.IllyrianI18n.t(ns+':'+k))).map(k=>ns+':'+k)));
 expect(bad).toEqual([]);
 const pin=await page.evaluate(()=>window.IllyrianI18n.t('privacy:pinAria',{name:'DEMO café',city:'DEMO City',interpolation:{escapeValue:false}}));
 expect(pin).toContain('DEMO café');expect(pin).toContain('DEMO City');
 await page.locator('[data-ilshop-open]').first().click();
 await expect(page.locator('#illyrian-shop-layer header')).not.toContainText(/\bdemo\b/i);
 await page.locator('[data-isp-open]').click();
 await expect(page.locator('#isp-root header')).not.toContainText(/\bdemo\b/i);
 await page.locator('#isp-root header [data-isp="close"]').click();await page.keyboard.press('Escape');
 await page.locator('#navbar [data-act="tab"][data-val="profile"]').click();
 await page.locator('#screen [data-act="modal"][data-val="settings"]').click();
 await page.locator('#layer [data-act="v6-settings-section"][data-val="about"]').click();
 await expect(page.locator('#phone [data-demo-disclosure]')).toHaveCount(1);
 await expect(page.locator('[data-demo-disclosure]')).toHaveText('ILLYRIAN · DEMO v1.7');
 expect(await page.evaluate(()=>localStorage.getItem('illyrian_demo_v09_state'))).toBe(raw);
});
