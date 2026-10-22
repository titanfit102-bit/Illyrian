/* ILLYRIAN v1.7 Phase 6 — trust explanation, moderation and appeal flows; roles are demo-only. */
(function illyrianPhaseSix(){
 'use strict';
 const KEY='illyrian_demo_v17_governance',SHOP='illyrian_demo_v17_shop_plus',PLANS='illyrian_demo_v17_plans';
 const clean=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const load=key=>{try{const x=JSON.parse(localStorage.getItem(key)||'null');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch{return {}}};
 const array=(x,limit)=>Array.isArray(x)?x.filter(v=>v&&typeof v==='object'&&!Array.isArray(v)).slice(0,limit):[];
 const prev=load(KEY);
 const cases=array(prev.cases,30).filter(x=>typeof x.id==='string'&&typeof x.reason==='string');
 const appeals=array(prev.appeals,30).filter(x=>typeof x.id==='string'&&typeof x.caseId==='string');
 const audits=array(prev.audits,60).filter(x=>typeof x.action==='string');
 const drafts=array(prev.drafts,25).filter(x=>typeof x.id==='string'&&typeof x.kind==='string');
 const state={open:false,tab:'trust',role:'visitor',notice:'',selected:'',cases,appeals,audits,drafts,
   applicant:'Në shqyrtim',storeOffer:'Draft',shopTab:'trust'};
 const bounded=(str,limit=160)=>String(str??'').trim().slice(0,limit);
 const unique=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36);
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({cases:state.cases,appeals:state.appeals,audits:state.audits,drafts:state.drafts}));return true}catch{state.notice='Kufiri i të dhënave lokale u arrit.';return false}};
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
 const statusName=s=>({pending:'Në pritje',restricted:'Kufizuar (demo)',dismissed:'Mbyllur pa masë',more:'Duhet sqarim',reinstated:'Kufizimi u hoq'})[s]||'Në pritje';
 const caseCards=()=>{
  const role=state.role==='moderator';
  return allCases().map(c=>'<article class="ig6-card"><h4>'+clean(c.target)+'</h4>'+
   '<p>'+clean(c.reason)+' · '+clean(c.source||'Raport demonstrues')+'</p>'+
   (c.detail?'<p>'+clean(c.detail)+'</p>':'')+
   '<p><b>Status:</b> '+clean(statusName(c.status))+'</p>'+
   (c.reasonNote?'<p><b>Arsye vendimi:</b> '+clean(c.reasonNote)+'</p>':'')+
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
    '<p><b>Arsyeja:</b> '+clean(c.reason)+'</p><p><b>Statusi:</b> '+clean(statusName(c.status))+'</p>'+
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
 const workPanels=()=>{
   const shops=load(SHOP),prods=array(shops.items,30),requests=array(shops.needs,25);
   const plans=load(PLANS),activities=array(plans.events,30),rqs=array(plans.requests,90);
   return '<h3>Panelet e punës</h3><p>Zgjidh një rol për të kuptuar detyrat e tij. Ndryshimi i rolit është vetëm simulim UI, jo hyrje si përdorues tjetër.</p>'+
    '<div class="ig6-roles">'+[['business','Biznes'],['seller','Shitës'],['employer','Punëdhënës'],['organizer','Organizator']].map(([k,v])=>b('work:'+k,v,state.role===k?'class="chosen"':'')).join('')+'</div>'+
    (state.role==='business'?'<article class="ig6-card"><h4>Paneli i biznesit</h4><p>Profil biznesi, katalog, orare dhe oferta janë koncepte që kërkojnë të dhëna reale në të ardhmen.</p>'+
       draftForm('business','Ofertë biznesi')+'</article>':
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
       '<article class="ig6-card"><b>'+clean(x.title)+'</b><p>'+clean(x.kind)+' · '+clean(x.created)+'</p>'+
       '<p>'+clean(x.note)+'</p>'+b('delete-draft:'+x.id,'Fshi draftin')+'</article>').join(''):'');
 };
 function draftForm(kind,placeholder){
  return '<form id="ig6-draft" class="ig6-form"><input name="kind" type="hidden" value="'+kind+'">'+
   '<label>Titulli<input name="title" maxlength="90" minlength="5" required placeholder="'+clean(placeholder)+'"></label>'+
   '<label>Shënime<textarea name="note" maxlength="240" rows="2" placeholder="Përshkrim ilustrues"></textarea></label>'+
   '<button type="submit">Ruaj draftin (vetëm lokalisht)</button></form>';
 }
 const audit=()=>'<h3>Historia e vendimeve të simulimit</h3>'+
   '<p>Një histori e dukshme për arsyetimin e vendimeve. Nuk është regjistër i pandryshueshëm sigurie.</p>'+
   (state.audits.length?state.audits.map(a=>'<article class="ig6-card"><b>'+clean(a.action)+'</b><p>'+clean(a.id)+' · '+clean(a.at)+'</p></article>').join(''):
    '<p class="ig6-muted">Ende nuk ka vendime ose veprime të regjistruara.</p>');
 let root=null,opener=null,restore=[];
 const tabs=()=>'<nav class="ig6-tabs">'+[['trust','Besimi'],['reports','Raportime'],['appeals','Apelime'],['work','Panele pune'],['audit','Historiku']].map(([key,label])=>b('tab:'+key,label,state.tab===key?'aria-current="page"':'')).join('')+'</nav>';
 const view=()=>state.tab==='trust'?trust():state.tab==='reports'?reports():state.tab==='review'?review():
  state.tab==='appeals'?appealPanel():state.tab==='appeal-review'?appealReview():state.tab==='work'?workPanels():audit();
 const render=()=>{
  if(!root||!state.open)return;
  root.hidden=false;
  const before=document.activeElement,act=before?.dataset?.ig6;
  root.innerHTML='<div class="ig6-shade" data-ig6="close"></div><section class="ig6-panel" role="dialog" aria-modal="true" aria-label="Besimi, raportimet dhe panelet e ILLYRIAN">'+
   '<header><div><small>ILLYRIAN · DEMO v1.7</small><h2>Besimi dhe menaxhimi</h2></div>'+b('close','✕ Mbyll')+'</header>'+
   '<p class="ig6-warning">Asnjë rol nuk është i verifikuar; kjo faqe nuk kryen moderim, pagesa ose vendime reale.</p>'+tabs()+
   notice()+view()+'<footer>Vetëm demonstrim në pajisje. Për prodhim kërkohen audit, autorizime dhe proces apelimi i sigurt.</footer></section>';
  const next=act?[...root.querySelectorAll('[data-ig6]')].find(x=>x.dataset.ig6===act):null;
  (next||root.querySelector('.ig6-panel header button'))?.focus();
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
 const message=t=>{state.notice=t;save();render()};
 const act=k=>{
  if(k==='close')return close();
  if(k.startsWith('tab:')){state.tab=k.slice(4);state.notice='';if(state.tab==='work')state.role='business';render();return}
  if(k.startsWith('role:')){state.role=k.slice(5);state.notice='';render();return}
  if(k.startsWith('work:')){state.role=k.slice(5);state.notice='';render();return}
  if(k.startsWith('explain:')){const x=explanation(k.slice(8));if(x)state.notice=x.text;render();return}
  if(k.startsWith('review:')&&state.role==='moderator'){state.selected=k.slice(7);state.tab='review';render();return}
  if(k.startsWith('appeal:')&&state.role==='visitor'){state.selected=k.slice(7);state.tab='review';render();return}
  if(k.startsWith('appeal-review:')&&state.role==='moderator'){state.selected=k.slice(14);state.tab='appeal-review';render();return}
  if(k.startsWith('delete-draft:')){
   const id=k.slice(13);state.drafts=state.drafts.filter(x=>x.id!==id);log('Drafti u fshi',id);message('Drafti u fshi lokalisht.');return;
  }
  if(k.startsWith('applicant:')&&state.role==='employer'){
    const val=k.slice(10);if(!['shortlisted','declined'].includes(val))return;
    state.applicant=val==='shortlisted'?'Në listën e shkurtër (demo)':'I refuzuar (demo)';
    log('Gjendja e kandidatit demonstrues',val);message('Statusi i kandidatit u ndryshua vetëm në këtë panel.');return;
  }
 };
 function onSubmit(form){
  const d=new FormData(form),v=k=>bounded(d.get(k),240);
  if(form.id==='ig6-report'){
   const target=v('target').slice(0,80),reason=v('reason'),detail=v('detail');
   const allowed=['Informacion i pasaktë','Mashtrim i dyshuar','Spam','Shkelje privatësie','Përmbajtje e papërshtatshme'];
   if(target.length<4||!allowed.includes(reason)||state.cases.length>=30){state.notice='Kontrollo formularin ose kufirin e raporteve.';render();return}
   const id='r'+unique();state.cases.push({id,target,reason,detail,status:'pending',source:'Raport lokal'});log('Raportim i krijuar',id);
   message('Raportimi u ruajt. Nuk iu dërgua askujt.');return;
  }
  if(form.id==='ig6-decision'){
   if(state.role!=='moderator')return;
   const decision=v('decision'),note=v('note'),c=allCases().find(x=>x.id===state.selected);
   if(!c||!['restricted','dismissed','more','reinstated'].includes(decision)||note.length<10){state.notice='Vendimi kërkon status dhe shpjegim prej të paktën 10 shkronjash.';render();return}
   const entry=state.cases.find(x=>x.id===c.id);
   if(entry){entry.status=decision;entry.reasonNote=note;entry.reviewedAt=stamp();}
   else {state.cases.push({...c,status:decision,reasonNote:note,reviewedAt:stamp()})}
   log('Vendim i moderatorit demo: '+decision,c.id);state.tab='reports';message('Vendimi demonstrues u regjistrua me arsye.');return;
  }
  if(form.id==='ig6-appeal'){
   if(state.role!=='visitor')return;
   const c=allCases().find(x=>x.id===state.selected),t=v('text');
   if(!c||t.length<10||state.appeals.length>=30){state.notice='Apelimi kërkon shpjegim të paktën 10 shkronja.';render();return}
   if(state.appeals.some(x=>x.caseId===c.id&&x.status==='pending')){state.notice='Ekziston një apelim në pritje për këtë rast.';render();return}
   const id='a'+unique();state.appeals.push({id,caseId:c.id,text:t,status:'pending',created:stamp()});log('Apelim i krijuar',c.id);
   state.tab='appeals';message('Apelimi u ruajt vetëm në demo.');return;
  }
  if(form.id==='ig6-appeal-review'){
   if(state.role!=='moderator')return;
   const a=state.appeals.find(x=>x.id===state.selected),decision=v('decision'),note=v('note');
   if(!a||a.status!=='pending'||!['accepted','rejected'].includes(decision)||note.length<10){state.notice='Përgjigjja kërkon vendim dhe arsye të qartë.';render();return}
   a.status=decision;a.response=note;a.reviewedAt=stamp();
   if(decision==='accepted'){
    const c=state.cases.find(x=>x.id===a.caseId);
    if(c){c.status='reinstated';c.reasonNote=note;c.reviewedAt=stamp();}
   }
   log('Vendim apelimi demo: '+decision,a.id);state.tab='appeals';message('Përgjigjja e apelimit u regjistrua.');return;
  }
  if(form.id==='ig6-draft'){
   const kind=v('kind'),title=v('title'),note=v('note');
   if(!['business','employer'].includes(kind)||title.length<5||state.drafts.length>=25){state.notice='Drafti kërkon titull të paktën 5 shkronja.';render();return}
   const id='d'+unique();state.drafts.push({id,kind,title:title.slice(0,90),note,created:stamp()});
   log('Draft pune: '+kind,id);message('Drafti u ruajt vetëm në pajisje. Nuk është publikuar.');return;
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
 function init(){
  const phone=document.querySelector('#phone'),screen=document.querySelector('#screen');
  if(!phone||!screen)return;
  document.addEventListener('click',e=>{
   const entry=e.target.closest('#ig6-entry [data-ig6="open"]');
   if(entry){e.preventDefault();open()}
  },true);
  phone.addEventListener('click',e=>{
   if(!state.open||!root)return;
   const button=e.target.closest('[data-ig6]');
   if(button&&root.contains(button)){e.preventDefault();act(button.dataset.ig6)}
  });
  phone.addEventListener('submit',e=>{if(state.open&&root?.contains(e.target)){e.preventDefault();onSubmit(e.target)}});
  document.addEventListener('keydown',e=>{
   if(!state.open||!root)return;
   if(e.key==='Escape'){e.preventDefault();close();return}
   if(e.key!=='Tab')return;
   const list=[...root.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled])')].filter(x=>x.getClientRects().length>0);
   if(!list.length)return;
   if(e.shiftKey&&(document.activeElement===list[0]||!root.contains(document.activeElement))){e.preventDefault();list.at(-1).focus()}
   else if(!e.shiftKey&&(document.activeElement===list.at(-1)||!root.contains(document.activeElement))){e.preventDefault();list[0].focus()}
  },true);
  document.addEventListener('focusin',e=>{if(state.open&&root&&!root.contains(e.target))root.querySelector('.ig6-panel header button')?.focus()},true);
  new MutationObserver(()=>{if(!state.open)queueMicrotask(sync)}).observe(screen,{childList:true,subtree:false});
  queueMicrotask(sync);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();
