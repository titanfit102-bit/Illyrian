/* ILLYRIAN v1.7 Phase 6 — trust explanation, moderation and appeal flows; roles are demo-only. */
(function illyrianPhaseSix(){
 'use strict';
 const KEY='illyrian_demo_v17_governance',SHOP='illyrian_demo_v17_shop_plus',PLANS='illyrian_demo_v17_plans';
 const clean=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const load=key=>{try{const x=JSON.parse(localStorage.getItem(key)||'null');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch{return {}}};
 const array=(x,limit)=>Array.isArray(x)?x.filter(v=>v&&typeof v==='object'&&!Array.isArray(v)).slice(0,limit):[];
 const TEAM_USERS={owner:'Arta Demo',admin:'Beni Demo',support:'Drita Demo',catalog:'Ilir Demo',guest:'Elira Demo'};
 const TEAM_ROLES=['owner','admin','catalog','support','viewer'];
 const knownTeamUser=id=>typeof id==='string'&&Object.hasOwn(TEAM_USERS,id);
 function normalTeams(input){
  const text=(v,n)=>typeof v==='string'?v.slice(0,n):'';
  return array(input,30).filter(t=>['shop','shopPlus'].includes(t.source)&&typeof t.store==='string'&&t.store.length>0&&t.store.length<=100).map(t=>({source:t.source,store:t.store,
   members:array(t.members,10).filter(m=>knownTeamUser(m.userId)&&TEAM_ROLES.includes(m.role)&&['pending','active','revoked'].includes(m.status)).filter((m,i,a)=>a.findIndex(x=>x.userId===m.userId)===i).map(m=>({userId:m.userId,role:m.role,status:m.status,public:m.public===true})),
   threads:array(t.threads,20).filter(x=>typeof x.id==='string'&&x.id.length>0&&x.id.length<=80).filter((x,i,a)=>a.findIndex(v=>v.id===x.id)===i).map(x=>({id:x.id,subject:text(x.subject,100),customer:text(x.customer,80),status:['open','awaiting_customer'].includes(x.status)?x.status:'awaiting_customer',assignedTo:knownTeamUser(x.assignedTo)?x.assignedTo:'',messages:array(x.messages,40).filter(m=>typeof m.id==='string'&&typeof m.text==='string'&&['business','customer'].includes(m.sender)).map(m=>({id:text(m.id,80),text:text(m.text,500),sender:m.sender,actorId:knownTeamUser(m.actorId)?m.actorId:'',at:text(m.at,30)}))}))
  })).filter((t,i,a)=>a.findIndex(x=>x.source===t.source&&x.store===t.store)===i);
 }
 const prev=load(KEY);
 const cases=array(prev.cases,30).filter(x=>typeof x.id==='string'&&typeof x.reason==='string');
 const appeals=array(prev.appeals,30).filter(x=>typeof x.id==='string'&&typeof x.caseId==='string');
 const audits=array(prev.audits,60).filter(x=>typeof x.action==='string');
 const drafts=array(prev.drafts,25).filter(x=>typeof x.id==='string'&&typeof x.kind==='string');
 const state={open:false,tab:'trust',role:'visitor',notice:'',selected:'',cases,appeals,audits,drafts,
   applicant:'Në shqyrtim',storeOffer:'Draft',shopTab:'trust',businessTeams:normalTeams(prev.businessTeams)};
 const bounded=(str,limit=160)=>String(str??'').trim().slice(0,limit);
 const unique=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36);
 const feedback=(key,fallback)=>window.IllyrianI18n?.t('governance:'+key)||fallback;
 const persisted=()=>({cases:state.cases,appeals:state.appeals,audits:state.audits,drafts:state.drafts,...(state.businessTeams.length?{businessTeams:state.businessTeams}:{})});
 let lastSaved=JSON.stringify(persisted()),expectedRaw=(()=>{try{return localStorage.getItem(KEY)}catch{return null}})();
 const save=()=>{try{const next=JSON.stringify(persisted());if(localStorage.getItem(KEY)!==expectedRaw){bizConflict=true;throw new Error('stale')}localStorage.setItem(KEY,next);expectedRaw=next;lastSaved=next;return true}catch{
  Object.assign(state,JSON.parse(lastSaved));state.businessTeams=normalTeams(JSON.parse(lastSaved).businessTeams);state.notice=bizConflict?teamText('conflict'):feedback('storageFull','Kufiri i të dhënave lokale u arrit.');return false}};
 const stamp=()=>new Date().toISOString().slice(0,16).replace('T',' ');
 const log=(action,id)=>{state.audits.unshift({action:bounded(action,65),id:bounded(id,35),at:stamp()});state.audits=state.audits.slice(0,60)};
 const b=(act,t,extra='')=>'<button type="button" data-ig6="'+clean(act)+'" '+extra+'>'+clean(t)+'</button>';
 const notice=()=>state.notice?'<p class="ig6-note" role="status">'+clean(state.notice)+'</p>':'';
 const sampleCases=[
  {id:'sample-1',target:'Listim ilustrues për makinë',reason:'Çmim i dyshimtë',detail:'Raport demonstrues: kërkohet dokumentacion.',status:'pending',source:'shembull'},
  {id:'sample-2',target:'Ofertë ilustrative dyqani',reason:'Fotografi e pasaktë',detail:'Shembull për procesin e apelimit.',status:'restricted',source:'shembull'}
 ];
 const fromShop=()=>{
  const s=load(SHOP);return array(s.flags,40).map((f,i)=>({
   id:'shop-'+i+'-'+bounded(f.target,18),target:bounded(f.target,80),reason:bounded(f.reason,80),
   detail:bounded(f.detail,180),status:'pending',source:'Shop Plus'
  }));
 };
 const allCases=()=>[...sampleCases,...fromShop(),...state.cases].map(c=>{
  const saved=state.cases.find(v=>v.id===c.id);
  return {...c,...(saved?{status:saved.status||c.status,reasonNote:saved.reasonNote||'',reviewedAt:saved.reviewedAt||''}:{})};
 }).filter((c,i,arr)=>arr.findIndex(x=>x.id===c.id)===i).slice(0,80);
 const explanation=(key)=>({
  declared:{label:'Të dhëna të deklaruara',text:'Shitësi ose organizatori ka shkruar këto të dhëna; platforma nuk ka kryer kontrolle të identitetit apo stokut.'},
  sample:{label:'Rrjedhë demonstrative',text:'Ky është një shembull i prodhuar për dizajn, jo provë për një person ose biznes real.'},
  pending:{label:'Në pritje të shqyrtimit',text:'Një raportim ose kërkesë kontrolli është regjistruar vetëm në këtë shfletues; askush nuk po shqyrton automatikisht.'}
 })[key];
 const trust=()=>{
  const cards=['declared','sample','pending'].map(key=>{const x=explanation(key);return '<article class="ig6-card"><h4>'+clean(x.label)+'</h4><p>'+clean(x.text)+'</p>'+b('explain:'+key,'Pse e shoh këtë?')+'</article>'}).join('');
  return '<h3>Besimi me shpjegim — IN9-06</h3>'+
   '<p>Transparenca duhet të tregojë <b>çfarë dimë, çfarë nuk dimë dhe kush e ka kontrolluar</b>. Nuk japim simbole “i verifikuar” pa proces të vërtetë.</p>'+
   '<div class="ig6-warning"><strong>Asnjë shitës, biznes apo pjesëmarrës real nuk është verifikuar në këtë demo.</strong></div>'+
   cards+'<p class="ig6-muted">Për produktin real nevojiten nivele të qarta verifikimi, burime provash, skadim verifikimi dhe mekanizëm apelimi.</p>';
 };
 const reportForm=()=>'<h4>Raporto përmbajtje (demo)</h4><form id="ig6-report" class="ig6-form">'+
  '<label>Çfarë po raporton?<input name="target" maxlength="80" minlength="4" required placeholder="P.sh. ofertë e pasaktë"></label>'+
  '<label>Arsyeja<select name="reason"><option value="Informacion i pasaktë">Informacion i pasaktë</option><option value="Mashtrim i dyshuar">Mashtrim i dyshuar</option><option value="Spam">Spam</option><option value="Shkelje privatësie">Shkelje privatësie</option><option value="Përmbajtje e papërshtatshme">Përmbajtje e papërshtatshme</option></select></label>'+
  '<label>Shpjegim<textarea name="detail" maxlength="240" rows="2" placeholder="Çfarë ndodhi?"></textarea></label>'+
  '<button type="submit">Ruaj raportimin lokal</button></form>';
 const statusLabels={pending:'Në pritje',restricted:'Kufizuar (demo)',dismissed:'Mbyllur pa masë',more:'Duhet sqarim',reinstated:'Kufizimi u hoq'};
 const knownStatus=s=>Object.prototype.hasOwnProperty.call(statusLabels,s);
 const statusName=s=>knownStatus(s)?statusLabels[s]:(typeof s==='string'&&s?s:statusLabels.pending);
 const statusMarkup=s=>'<span'+(!knownStatus(s)&&typeof s==='string'&&s?' data-user-content':'')+'>'+clean(statusName(s))+'</span>';
 const caseCards=()=>{
  const role=state.role==='moderator';
  return allCases().map(c=>'<article class="ig6-card"><h4 data-user-content>'+clean(c.target)+'</h4>'+
   '<p>'+clean(c.reason)+' · '+clean(c.source||'Raport demonstrues')+'</p>'+
   (c.detail?'<p data-user-content>'+clean(c.detail)+'</p>':'')+
   '<p><b>Status:</b> '+statusMarkup(c.status)+'</p>'+
   (c.reasonNote?'<p><b>Arsye vendimi:</b> <span data-user-content>'+clean(c.reasonNote)+'</span></p>':'')+
   (role?b('review:'+c.id,'Shqyrto si moderator'):b('appeal:'+c.id,'Apelo / kundërshto vendimin'))+'</article>').join('');
 };
 const reports=()=>{
  return '<h3>Raportime, vendime dhe apelime</h3><p>Çdo vendim duhet të ketë arsye. Veprimet e moderatorit të këtij paneli nuk fshehin përmbajtje reale dhe nuk prekin server.</p>'+
   '<div class="ig6-roles">'+b('role:visitor','Si përdorues',state.role==='visitor'?'class="chosen"':'')+
    b('role:moderator','Si moderator demo',state.role==='moderator'?'class="chosen"':'')+'</div>'+
   reportForm()+'<h4>Rastet e regjistruara</h4>'+caseCards()+
   '<p class="ig6-muted">Raportimet nga Shop Plus lexohen si shembuj. Një vendim këtu ruhet vetëm në panelin demonstrues dhe nuk fshin listimin origjinal.</p>';
 };
 const review=()=>{
  const c=allCases().find(x=>x.id===state.selected);
  if(!c)return b('tab:reports','Kthehu')+'<p>Raportimi nuk u gjet.</p>';
  const mod=state.role==='moderator';
  return b('tab:reports','← Te raportimet')+'<h3>'+clean(c.target)+'</h3>'+
    '<p><b>Arsyeja:</b> '+clean(c.reason)+'</p><p><b>Statusi:</b> '+statusMarkup(c.status)+'</p>'+
    '<p>'+clean(c.detail||'Nuk ka shpjegim shtesë.')+'</p>'+
   (mod?'<form id="ig6-decision" class="ig6-form"><label>Vendimi<select name="decision">'+
      '<option value="more">Kërko sqarim</option><option value="restricted">Kufizo në demo</option>'+
      '<option value="dismissed">Mbylle pa masë</option><option value="reinstated">Hiq kufizimin</option></select></label>'+
      '<label>Arsye e shkruar (e detyrueshme)<textarea name="note" required minlength="10" maxlength="240" rows="3"></textarea></label>'+
      '<button type="submit">Regjistro vendimin</button></form>':
      '<form id="ig6-appeal" class="ig6-form"><label>Arsyeja e apelimit<textarea name="text" required minlength="10" maxlength="240" rows="3"></textarea></label>'+
      '<button type="submit">Regjistro apelimin (demo)</button></form>');
 };
 const appealPanel=()=>{
  const mod=state.role==='moderator';
  return '<h3>Apelimet</h3><p>Apelimi krijon një rrjedhë të veçantë shqyrtimi. Çdo vendim mbetet demonstrues.</p>'+
   '<div class="ig6-roles">'+b('role:visitor','Si përdorues',!mod?'class="chosen"':'')+
    b('role:moderator','Si moderator demo',mod?'class="chosen"':'')+'</div>'+
   (state.appeals.length?state.appeals.slice().reverse().map(x=>'<article class="ig6-card"><h4>Apelimi '+clean(x.id.slice(-6))+'</h4>'+
     '<p>'+clean(x.text)+'</p><p>Rasti: '+clean(x.caseId)+' · '+clean(x.status||'pending')+'</p>'+
     (x.response?'<p><b>Arsye e përgjigjes:</b> '+clean(x.response)+'</p>':'')+
     (mod&&x.status==='pending'?b('appeal-review:'+x.id,'Shqyrto apelimin'):'')+'</article>').join(''):'<p class="ig6-muted">Ende nuk ka apelime.</p>');
 };
 const appealReview=()=>{
  const x=state.appeals.find(a=>a.id===state.selected);
  if(!x)return b('tab:appeals','Kthehu')+'<p>Apelimi nuk u gjet.</p>';
  return b('tab:appeals','← Kthehu')+'<h3>Shqyrtimi i apelimit</h3><p>'+clean(x.text)+'</p>'+
   '<form id="ig6-appeal-review" class="ig6-form"><label>Vendimi<select name="decision"><option value="accepted">Prano apelimin</option><option value="rejected">Refuzo apelimin</option></select></label>'+
   '<label>Arsye e shkruar<textarea name="note" minlength="10" maxlength="240" required rows="3"></textarea></label>'+
   '<button type="submit">Regjistro përgjigjen</button></form>';
 };
 // Business workspace extends this administration panel; it never reads personal Messages.
 const teamText=k=>window.IllyrianI18n?.t('businessTeam:'+k)||k;
 const teamLabel=k=>clean(teamText(k));
 const businessKey=(source,store)=>source+'|'+encodeURIComponent(store);
 const businessOptions=()=>Object.entries(window.IllyrianShopTargets||{}).filter(([source])=>['shop','shopPlus'].includes(source)).flatMap(([source,adapter])=>{
  const names=[...new Set(adapter.listings().map(p=>p.store).filter(s=>typeof s==='string'&&s&&s.length<=100))];
  return names.map(store=>({source,store,key:businessKey(source,store)}));
 });
 let bizKey='',bizActor='owner',bizThread='t1',bizConflict=false;
 const bizDrafts=new Map();
 const businessScope=()=>bizKey?businessOptions().find(s=>s.key===bizKey):businessOptions()[0];
 const defaultTeam=scope=>({source:scope.source,store:scope.store,members:[
  {userId:'owner',role:'owner',status:'active',public:false},{userId:'admin',role:'admin',status:'active',public:false},
  {userId:'support',role:'support',status:'active',public:false},{userId:'catalog',role:'catalog',status:'active',public:false}
 ],threads:['t1','t2'].map((id,i)=>({id,customer:'Klient Demo '+(i+1),subject:i?'Orari i dyqanit':'Kafe espresso 250 g',status:'open',assignedTo:'',messages:[{id:id+'-customer',sender:'customer',text:i?'Cili është orari?':'A është ende oferta e disponueshme?',at:'2026-10-26',actorId:''}]}))});
 const currentTeam=()=>{const s=businessScope();return s&&(state.businessTeams.find(t=>t.source===s.source&&t.store===s.store)||defaultTeam(s))};
 const activeMember=(team,id)=>team?.members.find(m=>m.userId===id&&m.status==='active');
 const capabilities={owner:['catalog','products','prices','orders','ordersRead','messages','staff','audit'],admin:['catalog','products','prices','orders','ordersRead','messages','audit'],catalog:['catalog','products','prices'],support:['catalog','ordersRead','messages'],viewer:['catalog']};
 const allowed=(team,cap,id=bizActor)=>!!capabilities[activeMember(team,id)?.role]?.includes(cap);
 const businessActive=()=>state.open&&state.tab==='work'&&state.role==='business';
 const draftKey=kind=>bizKey+'|'+bizActor+'|'+(kind==='reply'?bizThread:kind);
 const teamButton=(action,label)=>b(action,teamText(label),'data-i18n-direct');
 const showBizNotice=text=>{
  let note=root?.querySelector('[data-biz-notice]');if(!note&&root){note=document.createElement('p');note.dataset.bizNotice='';note.dataset.i18nDirect='';note.setAttribute('role','status');root.querySelector('#ig6-business')?.prepend(note)}
  if(note)note.textContent=text;
 };
 const rememberBusiness=()=>root?.querySelectorAll('[data-biz-draft]').forEach(form=>bizDrafts.set(form.dataset.bizDraft,[...form.elements].filter(e=>e.name).map(e=>({name:e.name,value:e.value,checked:e.checked}))));
 const restoreBusiness=()=>root?.querySelectorAll('[data-biz-draft]').forEach(form=>{for(const f of bizDrafts.get(form.dataset.bizDraft)||[]){const e=form.elements.namedItem(f.name);if(e){e.value=f.value;if(e.type==='checkbox')e.checked=f.checked}}});
 const teamLog=(action,target)=>{const s=businessScope();state.audits.unshift({action,id:bounded(target,80),at:stamp(),actorId:bizActor,businessSource:s.source,businessStore:s.store});state.audits=state.audits.slice(0,60)};
 function commitTeam(form,mutate){
  try{if(bizConflict||localStorage.getItem(KEY)!==expectedRaw){bizConflict=true;render();return false}}catch{showBizNotice(teamText('storageFailed'));return false}
  const s=businessScope();if(!s){render();return false}
  const before=state.businessTeams;state.businessTeams=JSON.parse(JSON.stringify(before));
  let team=state.businessTeams.find(t=>t.source===s.source&&t.store===s.store);
  if(!team){if(state.businessTeams.length>=30){state.businessTeams=before;showBizNotice(teamText('invalid'));return false}team=defaultTeam(s);state.businessTeams.push(team)}
  if(!mutate(team)){state.businessTeams=before;showBizNotice(teamText('invalid'));return false}
  if(!save()){showBizNotice(teamText('storageFailed'));return false}
  if(form?.dataset.bizDraft)bizDrafts.delete(form.dataset.bizDraft);
  refreshPublicStaff();state.notice=teamText('saved');render();return true;
 }
 function businessWorkspace(){
  const options=businessOptions();if(!options.length)return '';
  const s=businessScope();if(!s)return '<section id="ig6-business" data-i18n-direct><p data-biz-denied>'+teamLabel('businessMissing')+'</p></section>';bizKey=s.key;const team=currentTeam(),member=activeMember(team,bizActor),pending=team.members.find(m=>m.userId===bizActor&&m.status==='pending');
  const select=(id,label,values,value)=>'<label for="'+id+'">'+teamLabel(label)+'</label><select id="'+id+'">'+values.map(([id,name])=>'<option value="'+clean(id)+'" '+(id===value?'selected':'')+'>'+clean(name)+'</option>').join('')+'</select>';
  let html='<section id="ig6-business" data-i18n-direct><h3>'+teamLabel('title')+'</h3><p class="ig6-warning">'+teamLabel('demo')+'</p>'+select('ig6-business-shop','shop',options.map(o=>[o.key,o.store+' · '+(o.source==='shop'?'Shop':'Shop Plus')]),s.key)+select('ig6-business-actor','account',Object.entries(TEAM_USERS),bizActor);
  if(bizConflict)return html+'<p data-biz-conflict role="alert">'+teamLabel('conflict')+'</p></section>';
  if(!member)return html+'<p data-biz-denied>'+teamLabel(pending?'pending':'denied')+'</p>'+(pending?teamButton('biz-accept','accept'):'')+'</section>';
  html+='<p>'+teamLabel('permissions')+' · '+teamLabel(member.role)+'</p><ul class="ig6-permissions">'+['products','prices','orders','ordersRead','messages','staff','audit'].map(cap=>'<li data-biz-permission="'+cap+'" data-allowed="'+allowed(team,cap)+'">'+teamLabel(cap)+' '+(allowed(team,cap)?'✓':'—')+'</li>').join('')+'</ul>';
  html+='<form id="ig6-team-public" class="ig6-form" data-biz-draft="'+clean(draftKey('public'))+'"><label class="ig6-team-check"><input name="public" type="checkbox" '+(member.public?'checked':'')+'>'+teamLabel('publicChoice')+'</label><small>'+teamLabel('publicHint')+'</small><button type="submit">'+teamLabel('savePreference')+'</button></form>';
  if(allowed(team,'staff')){
   html+='<h4>'+teamLabel('staff')+'</h4><form id="ig6-team-invite" class="ig6-form" data-biz-draft="'+clean(draftKey('invite'))+'"><label>'+teamLabel('person')+'<select name="user">'+Object.entries(TEAM_USERS).filter(([id])=>!team.members.some(m=>m.userId===id&&['active','pending'].includes(m.status))).map(([id,name])=>'<option value="'+id+'">'+clean(name)+'</option>').join('')+'</select></label><label>'+teamLabel('role')+'<select name="role">'+TEAM_ROLES.filter(r=>r!=='owner').map(r=>'<option value="'+r+'">'+teamLabel(r)+'</option>').join('')+'</select></label><button type="submit">'+teamLabel('invite')+'</button></form>';
   html+=team.members.map(m=>'<article class="ig6-card"><b>'+clean(TEAM_USERS[m.userId])+'</b><p>'+teamLabel(m.role)+' · '+teamLabel(m.status)+'</p>'+(m.userId!=='owner'&&m.status!=='revoked'?'<form id="ig6-team-role-'+m.userId+'" class="ig6-form" data-member="'+m.userId+'" data-biz-draft="'+clean(draftKey('role-'+m.userId))+'"><label>'+teamLabel('role')+'<select name="role">'+TEAM_ROLES.filter(r=>r!=='owner').map(r=>'<option value="'+r+'" '+(r===m.role?'selected':'')+'>'+teamLabel(r)+'</option>').join('')+'</select></label><button>'+teamLabel('changeRole')+'</button></form>'+teamButton('biz-revoke:'+m.userId,'revoke'):'')+'</article>').join('');
  }
  if(allowed(team,'messages')){
   const thread=team.threads.find(t=>t.id===bizThread)||team.threads[0];if(thread)bizThread=thread.id;
   html+='<h4>'+teamLabel('inbox')+'</h4><p>'+teamLabel('localNotifications')+': '+team.threads.filter(t=>t.status==='open'&&(!t.assignedTo||t.assignedTo===bizActor||allowed(team,'staff'))).length+'</p><p>'+teamLabel('fictionalInbox')+'</p><nav data-biz-threads>'+team.threads.map(t=>teamButton('biz-thread:'+t.id,t.id===bizThread?'selectedThread':'otherThread')+'<span data-user-content>'+clean(t.subject)+'</span>').join('')+'</nav>';
   if(thread){
    const canAssign=['owner','admin'].includes(member.role),own=thread.assignedTo===bizActor;
    html+='<article class="ig6-card"><h4 data-user-content>'+clean(thread.subject)+'</h4><p>'+teamLabel('assigned')+': '+clean(TEAM_USERS[thread.assignedTo]||teamText('unassigned'))+' · '+teamLabel(thread.status)+'</p>';
    if(canAssign||!thread.assignedTo||own)html+='<form id="ig6-team-assignment" class="ig6-form" data-biz-draft="'+clean(draftKey('assignment-'+bizThread))+'"><label>'+teamLabel('assign')+'<select name="assignee">'+(canAssign?'<option value="">'+teamLabel('unassigned')+'</option>':'')+team.members.filter(m=>allowed(team,'messages',m.userId)&&(canAssign||m.userId===bizActor)).map(m=>'<option value="'+m.userId+'" '+(m.userId===thread.assignedTo?'selected':'')+'>'+clean(TEAM_USERS[m.userId])+'</option>').join('')+'</select></label><button>'+teamLabel('assign')+'</button></form>';
    html+='<div data-biz-customer-preview><h4>'+teamLabel('customerPreview')+'</h4>'+thread.messages.map(m=>'<p><b data-user-content>'+clean(m.sender==='business'?team.store:thread.customer)+'</b>: <span data-user-content>'+clean(m.text)+'</span></p>').join('')+'</div><form id="ig6-team-reply" class="ig6-form" data-biz-draft="'+clean(draftKey('reply'))+'"><label>'+teamLabel('replyAsShop')+'<textarea name="body" maxlength="500" required '+(!own||thread.status!=='open'?'disabled':'')+'></textarea></label><button '+(!own||thread.status!=='open'?'disabled':'')+'>'+teamLabel('send')+'</button></form><p>'+teamLabel('assignmentHint')+'</p></article>';
   }
  }
  if(allowed(team,'audit'))html+='<section data-biz-audit><h4>'+teamLabel('internalAudit')+'</h4><p>'+teamLabel('auditHint')+'</p>'+state.audits.filter(a=>a.businessSource===s.source&&a.businessStore===s.store).map(a=>'<p><b>'+clean(knownTeamUser(a.actorId)?TEAM_USERS[a.actorId]:teamText('unknown'))+'</b> · '+teamLabel(a.action)+' · '+clean(typeof a.id==='string'?a.id.slice(0,80):'')+' · '+clean(typeof a.at==='string'?a.at.slice(0,30):'')+'</p>').join('')+'</section>';
  return html+'</section>';
 }
 function refreshPublicStaff(){document.querySelectorAll('[data-business-staff]').forEach(el=>{el.outerHTML=window.IllyrianBusinessPresentation.staff(el.dataset.source,el.dataset.store)})}
 function businessSubmit(form){
  const d=new FormData(form),v=k=>String(d.get(k)||'').trim();
  return commitTeam(form,team=>{
   const actor=activeMember(team,bizActor);if(!actor)return false;
   if(form.id==='ig6-team-public'){actor.public=d.get('public')==='on';teamLog('publicChanged',bizActor);return true}
   if(form.id==='ig6-team-invite'){
    const id=v('user'),role=v('role');if(!allowed(team,'staff')||!knownTeamUser(id)||id==='owner'||!TEAM_ROLES.includes(role)||role==='owner'||team.members.some(m=>m.userId===id&&m.status!=='revoked'))return false;
    team.members=team.members.filter(m=>m.userId!==id);team.members.push({userId:id,role,status:'pending',public:false});teamLog('invited',id);return true;
   }
   if(form.id.startsWith('ig6-team-role-')){
    const member=team.members.find(m=>m.userId===form.dataset.member),role=v('role');if(!allowed(team,'staff')||!member||member.userId==='owner'||member.status==='revoked'||!TEAM_ROLES.includes(role)||role==='owner')return false;
    member.role=role;team.threads.forEach(t=>{if(t.assignedTo===member.userId&&!allowed(team,'messages',member.userId))t.assignedTo=''});teamLog('roleChanged',member.userId);return true;
   }
   const thread=team.threads.find(t=>t.id===bizThread);if(!thread||!allowed(team,'messages'))return false;
   if(form.id==='ig6-team-assignment'){
    const id=v('assignee'),admin=['owner','admin'].includes(actor.role);
    if(id&&!allowed(team,'messages',id)||!admin&&(id!==bizActor||thread.assignedTo&&thread.assignedTo!==bizActor))return false;
    thread.assignedTo=id;teamLog('assignedAction',thread.id);return true;
   }
   if(form.id==='ig6-team-reply'){
    const body=v('body');if(thread.assignedTo!==bizActor||thread.status!=='open'||!body||body.length>500||thread.messages.length>=40)return false;
    thread.messages.push({id:'bm'+unique(),sender:'business',actorId:bizActor,text:body,at:stamp()});thread.status='awaiting_customer';teamLog('replied',thread.id);return true;
   }
   return false;
  });
 }
 function businessAction(action){
  if(action.startsWith('biz-thread:')){const id=action.slice(11);if(currentTeam()?.threads.some(t=>t.id===id))bizThread=id;render();return}
  if(action==='biz-accept')return commitTeam(null,team=>{const m=team.members.find(m=>m.userId===bizActor&&m.status==='pending');if(!m)return false;m.status='active';teamLog('accepted',bizActor);return true});
  if(action.startsWith('biz-revoke:'))return commitTeam(null,team=>{const id=action.slice(11),m=team.members.find(m=>m.userId===id);if(!allowed(team,'staff')||!m||id==='owner'||m.status==='revoked')return false;m.status='revoked';m.public=false;team.threads.forEach(t=>{if(t.assignedTo===id)t.assignedTo=''});teamLog('revoked',id);return true});
 }
 window.IllyrianBusinessPresentation=Object.freeze({
  controls:(source,store)=>'<div data-i18n-direct><button type="button" data-business-manage data-source="'+clean(source)+'" data-store="'+clean(store)+'">'+teamLabel('manage')+'</button></div>',
  staff:(source,store)=>{const team=normalTeams(load(KEY).businessTeams).find(t=>t.source===source&&t.store===store);return '<section data-business-staff data-source="'+clean(source)+'" data-store="'+clean(store)+'" data-i18n-direct><h4>'+teamLabel('publicStaff')+'</h4>'+((team?.members.filter(m=>m.status==='active'&&m.public).map(m=>'<p data-user-content>'+clean(TEAM_USERS[m.userId])+' · '+teamLabel(m.role)+'</p>').join(''))||'<p>'+teamLabel('noPublicStaff')+'</p>')+'</section>'}
 });

 const workPanels=()=>{
   const shops=load(SHOP),prods=array(shops.items,30),requests=array(shops.needs,25);
   const plans=load(PLANS),activities=array(plans.events,30),rqs=array(plans.requests,90);
   return '<h3>Panelet e punës</h3><p>Zgjidh një rol për të kuptuar detyrat e tij. Ndryshimi i rolit është vetëm simulim UI, jo hyrje si përdorues tjetër.</p>'+
    '<div class="ig6-roles">'+[['business','Biznes'],['seller','Shitës'],['employer','Punëdhënës'],['organizer','Organizator']].map(([k,v])=>b('work:'+k,v,state.role===k?'class="chosen"':'')).join('')+'</div>'+
    (state.role==='business'?'<article class="ig6-card"><h4>Paneli i biznesit</h4><p>Profil biznesi, katalog, orare dhe oferta janë koncepte që kërkojnë të dhëna reale në të ardhmen.</p>'+
       draftForm('business','Ofertë biznesi')+'</article>'+businessWorkspace():
    state.role==='seller'?'<article class="ig6-card"><h4>Paneli i shitësit</h4>'+
       '<p>Listime të tuat në Shop Plus: '+prods.filter(p=>p.owned).length+'</p>'+
       '<p>Kërkesa “Kërkoj…” në këtë pajisje: '+requests.filter(x=>Date.parse(x.expires)>Date.now()).length+'</p>'+
       '<p>Inventari nuk është i sinkronizuar me Shop bazë.</p>'+b('tab:trust','Shiko kriteret e besimit')+'</article>':
    state.role==='employer'?'<article class="ig6-card"><h4>Panel punëdhënësi</h4><p>Postimet e punës janë vetëm drafte lokale; aplikimet e kandidatëve nuk janë reale.</p>'+
       draftForm('employer','Pozicion pune')+
       '<p><b>Kandidat shembull:</b> Aplikim demonstrues — '+clean(state.applicant)+'</p>'+
       b('applicant:shortlisted','Kalimi në shortlist (demo)')+b('applicant:declined','Refuzo kandidatin (demo)')+'</article>':
    '<article class="ig6-card"><h4>Paneli i organizatorit</h4>'+
       '<p>Aktivitete të regjistruara në këtë pajisje: '+activities.length+'</p>'+
       '<p>Kërkesa pjesëmarrjeje të regjistruara: '+rqs.length+'</p>'+
       '<p>Pranimi dhe publikimi vazhdojnë vetëm nga paneli ekzistues “Planet”.</p>'+
       b('tab:trust','Shiko besueshmërinë')+'</article>')+
     (state.drafts.length?'<h4>Draftet e mia lokale</h4>'+state.drafts.slice().reverse().map(x=>
       '<article class="ig6-card"><b data-user-content>'+clean(x.title)+'</b><p>'+clean(x.kind)+' · '+clean(x.created)+'</p>'+
       '<p data-user-content>'+clean(x.note)+'</p>'+b('delete-draft:'+x.id,'Fshi draftin')+'</article>').join(''):'');
 };
 function draftForm(kind,placeholder){
  return '<form id="ig6-draft" class="ig6-form"><input name="kind" type="hidden" value="'+kind+'">'+
   '<label>Titulli<input name="title" maxlength="90" minlength="5" required placeholder="'+clean(placeholder)+'"></label>'+
   '<label>Shënime<textarea name="note" maxlength="240" rows="2" placeholder="Përshkrim ilustrues"></textarea></label>'+
   '<button type="submit">Ruaj draftin (vetëm lokalisht)</button></form>';
 }
 const audit=()=>'<h3>Historia e vendimeve të simulimit</h3>'+
   '<p>Një histori e dukshme për arsyetimin e vendimeve. Nuk është regjistër i pandryshueshëm sigurie.</p>'+
   (state.audits.length?state.audits.filter(a=>!a.businessSource).map(a=>'<article class="ig6-card"><b>'+clean(a.action)+'</b><p>'+clean(a.id)+' · '+clean(a.at)+'</p></article>').join(''):
    '<p class="ig6-muted">Ende nuk ka vendime ose veprime të regjistruara.</p>');
 let root=null,opener=null,restore=[];
 const tabs=()=>'<nav class="ig6-tabs">'+[['trust','Besimi'],['reports','Raportime'],['appeals','Apelime'],['work','Panele pune'],['audit','Historiku']].map(([key,label])=>b('tab:'+key,label,state.tab===key?'aria-current="page"':'')).join('')+'</nav>';
 const view=()=>state.tab==='trust'?trust():state.tab==='reports'?reports():state.tab==='review'?review():
  state.tab==='appeals'?appealPanel():state.tab==='appeal-review'?appealReview():state.tab==='work'?workPanels():audit();
 const render=()=>{
  if(!root||!state.open)return;
  root.hidden=false;
  const before=document.activeElement,act=before?.dataset?.ig6,focusId=before?.id,focusName=before?.name,formId=before?.form?.id;
  root.innerHTML='<div class="ig6-shade" data-ig6="close"></div><section class="ig6-panel" role="dialog" aria-modal="true" aria-label="'+clean(feedback('title','Besimi dhe menaxhimi'))+'">'+
   '<header><div><small>ILLYRIAN · DEMO v1.7</small><h2>Besimi dhe menaxhimi</h2></div>'+b('close','✕ Mbyll')+'</header>'+
   '<p class="ig6-warning">Asnjë rol nuk është i verifikuar; kjo faqe nuk kryen moderim, pagesa ose vendime reale.</p>'+tabs()+
   notice()+view()+'<footer>Vetëm demonstrim në pajisje. Për prodhim kërkohen audit, autorizime dhe proces apelimi i sigurt.</footer></section>';
  restoreBusiness();
  const field=focusId?root.querySelector('#'+CSS.escape(focusId)):formId&&focusName?root.querySelector('#'+CSS.escape(formId))?.elements.namedItem(focusName):null;
  const next=act?[...root.querySelectorAll('[data-ig6]')].find(x=>x.dataset.ig6===act):null;
  (field||next||root.querySelector('.ig6-panel header button'))?.focus({preventScroll:true});
 };
 const open=()=>{
  if(state.open)return;
  const phone=document.querySelector('#phone');
  if(!phone)return;
  state.open=true;state.tab='trust';state.role='visitor';state.notice='';opener=document.activeElement;
  root=document.createElement('div');root.id='ig6-root';phone.appendChild(root);
  restore=['#screen','#navbar','.head','#illyrian-shop-layer','#isp-root','#ilp-root','#il4-root'].map(x=>phone.querySelector(':scope > '+x)).filter(x=>x&&x!==root).map(el=>({el,prior:el.inert}));
  restore.forEach(({el})=>el.inert=true);
  render();
 };
 const close=()=>{
  state.open=false;root?.remove();root=null;restore.forEach(({el,prior})=>{if(el.isConnected)el.inert=prior});restore=[];
  if(opener?.isConnected)opener.focus();
 };
 // Failed writes must not destroy unsent report fields or keyboard focus.
 const message=t=>{
  state.notice=t;
  if(save()){render();return true}
  let el=root?.querySelector('.ig6-note[role="status"]');
  if(!el&&root){
   el=document.createElement('p');el.className='ig6-note';el.setAttribute('role','status');
   root.querySelector('.ig6-panel .ig6-tabs')?.after(el);
  }
  if(el)el.textContent=state.notice;
  return false;
 };
 const act=k=>{
  if(k==='close')return close();
  if(k.startsWith('biz-')&&businessActive())return businessAction(k);
  if(k.startsWith('tab:')){state.tab=k.slice(4);state.notice='';if(state.tab==='work')state.role='business';render();return}
  if(k.startsWith('role:')){state.role=k.slice(5);state.notice='';render();return}
  if(k.startsWith('work:')){state.role=k.slice(5);state.notice='';render();return}
  if(k.startsWith('explain:')){const x=explanation(k.slice(8));if(x)state.notice=x.text;render();return}
  if(k.startsWith('review:')&&state.role==='moderator'){state.selected=k.slice(7);state.tab='review';render();return}
  if(k.startsWith('appeal:')&&state.role==='visitor'){state.selected=k.slice(7);state.tab='review';render();return}
  if(k.startsWith('appeal-review:')&&state.role==='moderator'){state.selected=k.slice(14);state.tab='appeal-review';render();return}
  if(k.startsWith('delete-draft:')){
   const id=k.slice(13);state.drafts=state.drafts.filter(x=>x.id!==id);log('Drafti u fshi',id);message(feedback('draftRemoved','Drafti u fshi lokalisht.'));return;
  }
  if(k.startsWith('applicant:')&&state.role==='employer'){
    const val=k.slice(10);if(!['shortlisted','declined'].includes(val))return;
    state.applicant=val==='shortlisted'?'Në listën e shkurtër (demo)':'I refuzuar (demo)';
    log('Gjendja e kandidatit demonstrues',val);message(feedback('applicantUpdated','Statusi i kandidatit u ndryshua vetëm në këtë panel.'));return;
  }
 };
 function onSubmit(form){
  if(form.id.startsWith('ig6-team-')&&businessActive())return businessSubmit(form);
  const d=new FormData(form),v=k=>bounded(d.get(k),240);
  if(form.id==='ig6-report'){
   const target=v('target').slice(0,80),reason=v('reason'),detail=v('detail');
   const allowed=['Informacion i pasaktë','Mashtrim i dyshuar','Spam','Shkelje privatësie','Përmbajtje e papërshtatshme'];
   if(target.length<4||!allowed.includes(reason)||state.cases.length>=30){state.notice=feedback('reportInvalid','Kontrollo formularin ose kufirin e raporteve.');render();return}
   const id='r'+unique();state.cases.push({id,target,reason,detail,status:'pending',source:'Raport lokal'});log('Raportim i krijuar',id);
   message(feedback('reportSaved','Raportimi u ruajt. Nuk iu dërgua askujt.'));return;
  }
  if(form.id==='ig6-decision'){
   if(state.role!=='moderator')return;
   const decision=v('decision'),note=v('note'),c=allCases().find(x=>x.id===state.selected);
   if(!c||!['restricted','dismissed','more','reinstated'].includes(decision)||note.length<10){state.notice=feedback('decisionInvalid','Vendimi kërkon status dhe shpjegim prej të paktën 10 shkronjash.');render();return}
   const entry=state.cases.find(x=>x.id===c.id);
   if(entry){entry.status=decision;entry.reasonNote=note;entry.reviewedAt=stamp();}
   else {state.cases.push({...c,status:decision,reasonNote:note,reviewedAt:stamp()})}
   log('Vendim i moderatorit demo: '+decision,c.id);state.tab='reports';message(feedback('decisionSaved','Vendimi demonstrues u regjistrua me arsye.'));return;
  }
  if(form.id==='ig6-appeal'){
   if(state.role!=='visitor')return;
   const c=allCases().find(x=>x.id===state.selected),t=v('text');
   if(!c||t.length<10||state.appeals.length>=30){state.notice=feedback('appealInvalid','Apelimi kërkon shpjegim të paktën 10 shkronja.');render();return}
   if(state.appeals.some(x=>x.caseId===c.id&&x.status==='pending')){state.notice=feedback('appealPending','Ekziston një apelim në pritje për këtë rast.');render();return}
   const id='a'+unique();state.appeals.push({id,caseId:c.id,text:t,status:'pending',created:stamp()});log('Apelim i krijuar',c.id);
   state.tab='appeals';message(feedback('appealSaved','Apelimi u ruajt vetëm në demo.'));return;
  }
  if(form.id==='ig6-appeal-review'){
   if(state.role!=='moderator')return;
   const a=state.appeals.find(x=>x.id===state.selected),decision=v('decision'),note=v('note');
   if(!a||a.status!=='pending'||!['accepted','rejected'].includes(decision)||note.length<10){state.notice=feedback('responseInvalid','Përgjigjja kërkon vendim dhe arsye të qartë.');render();return}
   a.status=decision;a.response=note;a.reviewedAt=stamp();
   if(decision==='accepted'){
    const c=state.cases.find(x=>x.id===a.caseId);
    if(c){c.status='reinstated';c.reasonNote=note;c.reviewedAt=stamp();}
   }
   log('Vendim apelimi demo: '+decision,a.id);state.tab='appeals';message(feedback('responseSaved','Përgjigjja e apelimit u regjistrua.'));return;
  }
  if(form.id==='ig6-draft'){
   const kind=v('kind'),title=v('title'),note=v('note');
   if(!['business','employer'].includes(kind)||title.length<5||state.drafts.length>=25){state.notice=feedback('draftInvalid','Drafti kërkon titull të paktën 5 shkronja.');render();return}
   const id='d'+unique();state.drafts.push({id,kind,title:title.slice(0,90),note,created:stamp()});
   log('Draft pune: '+kind,id);message(feedback('draftSaved','Drafti u ruajt vetëm në pajisje. Nuk është publikuar.'));return;
  }
 }
 function sync(){
  const screen=document.querySelector('#screen');if(!screen)return;
  // Stable route, not a heading that changes with the interface language.
  const active=document.querySelector('#navbar [data-act="tab"].active')?.dataset.val;
  const isEligible=active==='explore'||active==='profile';
  const entry=screen.querySelector('#ig6-entry');
  if(!isEligible){entry?.remove();return}
  if(entry)return;
  const item=document.createElement('div');item.id='ig6-entry';
  item.innerHTML='<div><b>Besimi dhe menaxhimi</b><p>Raportime · Apelime · Biznese · Punë</p></div>'+b('open','Hap panelin →');
  const first=screen.querySelector('.section-header')||screen.querySelector('.profile-banner')||screen.firstElementChild;
  first?.parentNode?.insertBefore(item,first.nextSibling);
 }
 window.IllyrianGovernance=Object.freeze({openBusiness:(source,store)=>{const scope=businessOptions().find(s=>s.source===source&&s.store===store);if(!scope)return false;open();bizKey=scope.key;bizActor='owner';bizThread='t1';state.tab='work';state.role='business';render();return true;}});
 function init(){
  const phone=document.querySelector('#phone'),screen=document.querySelector('#screen');
  if(!phone||!screen)return;
  document.addEventListener('click',e=>{
   const manage=e.target.closest('[data-business-manage]');if(manage){e.preventDefault();window.IllyrianGovernance.openBusiness(manage.dataset.source,manage.dataset.store);return}
   const entry=e.target.closest('#ig6-entry [data-ig6="open"]');
   if(entry){e.preventDefault();open()}
  },true);
  phone.addEventListener('click',e=>{
   if(!state.open||!root)return;
   const button=e.target.closest('[data-ig6]');
   if(button&&root.contains(button)){e.preventDefault();act(button.dataset.ig6)}
  });
  phone.addEventListener('submit',e=>{if(state.open&&root?.contains(e.target)){e.preventDefault();onSubmit(e.target)}});
  phone.addEventListener('input',()=>{if(businessActive())rememberBusiness()});
  phone.addEventListener('change',e=>{if(!businessActive())return;rememberBusiness();if(e.target.id==='ig6-business-shop'){bizKey=e.target.value;bizThread='t1';state.notice='';render()}else if(e.target.id==='ig6-business-actor'){bizActor=knownTeamUser(e.target.value)?e.target.value:'guest';state.notice='';render()}});
  window.addEventListener('storage',e=>{if((e.key===KEY||e.key===null)&&e.storageArea===localStorage&&localStorage.getItem(KEY)!==expectedRaw){bizConflict=true;refreshPublicStaff();if(businessActive())render()}});
  document.addEventListener('keydown',e=>{
   if(!state.open||!root)return;
   if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return}
   if(e.key!=='Tab')return;
   const list=[...root.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled])')].filter(x=>x.getClientRects().length>0);
   if(!list.length)return;
   if(e.shiftKey&&(document.activeElement===list[0]||!root.contains(document.activeElement))){e.preventDefault();list.at(-1).focus()}
   else if(!e.shiftKey&&(document.activeElement===list.at(-1)||!root.contains(document.activeElement))){e.preventDefault();list[0].focus()}
  },true);
  document.addEventListener('focusin',e=>{if(state.open&&root&&!root.contains(e.target))root.querySelector('.ig6-panel header button')?.focus()},true);
  window.addEventListener('illyrian:language-changed',()=>{
   if(businessActive()){rememberBusiness();render()}
   if(state.open)root?.querySelector('.ig6-panel')?.setAttribute('aria-label',feedback('title','Besimi dhe menaxhimi'));
  });
  new MutationObserver(()=>{if(!state.open)queueMicrotask(sync)}).observe(screen,{childList:true,subtree:false});
  queueMicrotask(sync);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();
