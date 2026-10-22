/* ILLYRIAN v1.7 Phase 4 — private profiles, private groups, schematic place discovery, plan statuses. */
(function installIllyrianPrivacyMap(){
 'use strict';
 const KEY='illyrian_demo_v17_privacy_map',PLANS='illyrian_demo_v17_plans',SHOP='illyrian_demo_v17_shop';
 const cities=['Të gjitha','Tiranë','Durrës','Shkodër','Vlorë','Prishtinë','Milano','Romë','Elbasan'];
 const people=[
  {id:'arta',name:'Arta K.',city:'Milano',audience:'public',about:'Interesohet për gjuhë dhe komunitete.'},
  {id:'leon',name:'Leon M.',city:'Tiranë',audience:'private',about:'Përshkrim privat që nuk duhet shfaqur pa miratim.'},
  {id:'besa',name:'Besa H.',city:'Romë',audience:'private',about:'Informacion privat i profilit.'}
 ];
 const groups=[
  {id:'albania-milan',name:'Shqiptarët në Milano',city:'Milano',privacy:'private',members:18,about:'Takime, udhëzime dhe ndihmë mes anëtarëve të pranuar.'},
  {id:'tirana-makers',name:'Krijuesit e Tiranës',city:'Tiranë',privacy:'public',members:34,about:'Punëtori dhe bashkëpunim me rregulla të qarta.'}
 ];
 const mapSeeds=[
  {id:'m1',kind:'activity',name:'Takim i komunitetit',city:'Tiranë',detail:'Aktivitet demonstrues publik'},
  {id:'m2',kind:'business',name:'Market Arbër',city:'Tiranë',detail:'Produkte ushqimore · dyqan demonstrues'},
  {id:'m3',kind:'business',name:'Urban Steps',city:'Tiranë',detail:'Atlete · dyqan demonstrues'},
  {id:'m4',kind:'activity',name:'Praktikë shqip–italisht',city:'Milano',detail:'Aktivitet demonstrues publik'},
  {id:'m5',kind:'business',name:'Auto Durrësi',city:'Durrës',detail:'Automjete · ofrues demonstrues'},
  {id:'m6',kind:'activity',name:'Punëtori portofoli',city:'Shkodër',detail:'Aktivitet demonstrues publik'},
  {id:'m7',kind:'business',name:'Phone Lab',city:'Prishtinë',detail:'Riparime · dyqan demonstrues'},
  {id:'m8',kind:'activity',name:'Takim shqiptarësh',city:'Romë',detail:'Aktivitet demonstrues publik'}
 ];
 const escaped=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const stored=(key)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}};
 const initial=stored(KEY);
 const normalizeStatus=x=>['none','pending','accepted','declined','blocked'].includes(x)?x:'none';
 const safeObject=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
 const cleanRequest=o=>Object.fromEntries(Object.entries(safeObject(o)).filter(([k])=>people.concat(groups).some(x=>x.id===k)).map(([k,v])=>[k,normalizeStatus(v)]));
 const state={
  follow:cleanRequest(initial.follow),
  membership:cleanRequest(initial.membership),
  notice:'',open:false,tab:'profiles',selected:'leon',role:'visitor',
  city:'Të gjitha',mapKind:'all',search:'',selectedPin:'m1',showUnlisted:false
 };
 let root=null,opener=null,inertSnapshot=[];
 const b=(act,label,extra='')=>'<button type="button" data-il4="'+escaped(act)+'" '+extra+'>'+escaped(label)+'</button>';
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({follow:state.follow,membership:state.membership}));return true}catch{state.notice='Ndryshimi nuk u ruajt; hapësira lokale është plot.';return false}};
 const statusLabel=x=>({none:'Pa kërkesë',pending:'Në pritje',accepted:'I pranuar',declined:'Refuzuar',blocked:'I bllokuar'})[x||'none'];
 const note=()=>state.notice?'<p class="il4-notice" role="status">'+escaped(state.notice)+'</p>':'';
 const header=()=>'<header class="il4-head"><div><small>ILLYRIAN · SIGURI & ZBULIM</small><h2>Privatësia dhe harta</h2></div>'+b('close','✕ Mbyll')+'</header><p class="il4-warning">Prototip me identitete dhe vende të sajuara. Rolet dhe lejet janë vetëm simulim lokal; nuk ofrojnë siguri reale.</p>';
 const tabRow=()=>'<nav class="il4-tabs" aria-label="Fushat e Fazës 4">'+[
  ['profiles','Profilet'],['groups','Komunitetet'],['map','Harta'],['states','Gjendjet e planeve']
 ].map(([id,t])=>b('tab:'+id,t,id===state.tab?'aria-current="page"':'')).join('')+'</nav>';
 const currentProfile=()=>people.find(p=>p.id===state.selected)||people[0];
 const profiles=()=>{
  const p=currentProfile(),s=state.follow[p.id]||'none',owner=state.role==='owner',publicView=p.audience==='public'||s==='accepted';
  return '<h3>Profile private dhe ndjekje</h3><p>Provo rolin e vizitorit dhe të pronarit të profilit. Një kërkesë private nuk jep akses derisa të pranohet.</p>'+
  '<div class="il4-role">'+b('role:visitor','Shiko si vizitor',!owner?'class="chosen"':'')+b('role:owner','Simulo pronarin',owner?'class="chosen"':'')+'</div>'+
  '<div class="il4-tabs il4-people">'+people.map(x=>b('profile:'+x.id,x.name,x.id===p.id?'aria-current="page"':'')).join('')+'</div>'+
  '<article class="il4-card"><h4>'+escaped(p.name)+'</h4><p>'+escaped(p.city)+' · '+(p.audience==='private'?'Profil privat':'Profil publik')+'</p>'+
  '<p><strong>Gjendja:</strong> '+escaped(statusLabel(s))+'</p>'+
  (publicView||owner?'<p>'+escaped(p.about)+'</p>':'<p class="il4-muted">Përshkrimi dhe përmbajtja e këtij profili janë të fshehura.</p>')+
  (owner?'<p><b>Panel pronari — simulim</b></p>'+
   (s==='pending'?b('follow-approve','Prano kërkesën')+b('follow-deny','Refuzo'):'<p>Asnjë kërkesë aktive për t’u shqyrtuar.</p>'):
   s==='none'||s==='declined'?b('follow-request',p.audience==='private'?'Kërko të ndjekësh':'Ndiq'):s==='pending'?b('follow-withdraw','Tërhiq kërkesën'):s==='accepted'?b('follow-withdraw','Ndalo ndjekjen'):'<p>Kontakti është i bllokuar në këtë simulim.</p>')+
  (!owner?(s==='blocked'?b('unblock','Zhblloko'):b('block','Blloko kontaktin')):'')+'</article>'+
  '<p class="il4-muted">Kërkesat dhe bllokimet ruhen vetëm në këtë shfletues. Asnjë përdorues real nuk njoftohet.</p>';
 };
 const currentGroup=()=>groups.find(g=>g.id===state.selected)||groups[0];
 const groupPage=()=>{
  const g=currentGroup(),s=state.membership[g.id]||'none',owner=state.role==='owner',visible=g.privacy==='public'||s==='accepted'||owner;
  return '<h3>Komunitete me rregulla dhe role</h3><p>Në një komunitet privat vetëm anëtarët e pranuar shohin përmbajtjen. Ky është një shembull i kontrolleve të aksesit, jo siguri serveri.</p>'+
  '<div class="il4-role">'+b('role:visitor','Si kërkues',!owner?'class="chosen"':'')+b('role:owner','Si moderator demo',owner?'class="chosen"':'')+'</div>'+
  '<div class="il4-tabs il4-people">'+groups.map(g=>b('group:'+g.id,g.name,g.id===state.selected?'aria-current="page"':'')).join('')+'</div>'+
  '<article class="il4-card"><h4>'+escaped(g.name)+'</h4><p>'+escaped(g.city)+' · '+(g.privacy==='private'?'Komunitet privat':'Komunitet publik')+' · '+g.members+' anëtarë shembull</p>'+
  '<p><strong>Status:</strong> '+escaped(statusLabel(s))+'</p>'+
  (visible?'<p>'+escaped(g.about)+'</p><p class="il4-muted">Rregulla: respekto privatësinë, mos shpërnda të dhëna kontakti pa pëlqim.</p>':
   '<p class="il4-muted">Postimet dhe lista e anëtarëve janë të fshehura deri në pranim.</p>')+
  (owner?(s==='pending'?b('group-approve','Prano anëtarin')+b('group-deny','Refuzo kërkesën'):
   '<p>Paneli i moderatorit: nuk ka kërkesë aktive.</p>'):
   s==='none'||s==='declined'?b('group-request',g.privacy==='public'?'Bashkohu':'Kërko anëtarësim'):
   s==='pending'?b('group-withdraw','Tërhiq kërkesën'):s==='accepted'?b('group-withdraw','Largohu nga komuniteti'):'')+'</article>';
 };
 const upcoming=()=>{const x=stored(PLANS),arr=Array.isArray(x.events)?x.events:[];return arr.filter(v=>v&&typeof v.title==='string'&&v.privacy==='public'&&!v.cancelled&&Date.parse(String(v.date)+'T'+String(v.time))>Date.now()).slice(0,12)};
 const shopItems=()=>{const data=stored(SHOP),arr=Array.isArray(data.listings)?data.listings:[];return arr.filter(v=>v&&typeof v.store==='string'&&typeof v.city==='string'&&v.city.length<70).slice(0,12)};
 const pins=()=>{
  const live=upcoming().map((e,i)=>({id:'plan-'+i,kind:'activity',name:e.title,city:e.city,detail:'Aktivitet publik në demo',source:'created'}));
  const stores=shopItems().map((e,i)=>({id:'shop-'+i,kind:'business',name:e.store,city:e.city,detail:e.name||'Listim lokal',source:'created'}));
  const all=[...mapSeeds,...live,...stores].filter(v=>cities.includes(v.city));
  const query=state.search.trim().toLocaleLowerCase('sq');
  return all.filter(p=>(state.city==='Të gjitha'||p.city===state.city)&&(state.mapKind==='all'||p.kind===state.mapKind)&&(!query||[p.name,p.city,p.detail].join(' ').toLocaleLowerCase('sq').includes(query)));
 };
 const pin=(p,i,sel)=>'<button type="button" class="il4-pin '+(sel?'selected':'')+'" data-il4="pin:'+escaped(p.id)+'" style="left:'+((21+(i*37)%63))+'%;top:'+((18+(i*23)%62))+'%" aria-label="'+escaped('Shfaq '+p.name+' në '+p.city)+'">'+(p.kind==='business'?'▣':'●')+'</button>';
 const mapPage=()=>{
  const list=pins(),selected=list.find(p=>p.id===state.selectedPin)||list[0];
  return '<h3>Zbulo aktivitetet dhe bizneset sipas qytetit</h3><p class="il4-muted"><b>Hartë skematike — JO hartë gjeografike.</b> Pozicionet e pikave janë ilustrative; nuk tregojnë koordinata, rrugë apo distanca reale.</p>'+
  '<form id="il4-mapform"><label>Qyteti<select name="city">'+cities.map(c=>'<option '+(c===state.city?'selected ':'')+'value="'+escaped(c)+'">'+escaped(c)+'</option>').join('')+'</select></label>'+
  '<label>Lloji<select name="kind">'+[['all','Të gjitha'],['activity','Aktivitete'],['business','Biznese']].map(([k,v])=>'<option '+(k===state.mapKind?'selected ':'')+'value="'+k+'">'+v+'</option>').join('')+'</select></label>'+
  '<label>Kërko<input name="q" maxlength="60" value="'+escaped(state.search)+'" placeholder="P.sh. kafe, futboll, dyqan"></label>'+
  '<button type="submit">Filtro</button></form>'+
  '<div class="il4-map" aria-label="Skemë orientuese e rezultateve"><div class="il4-grid-lines"></div>'+
  '<div class="il4-map-label">ILLYRIAN · DEMO · '+escaped(state.city)+'</div>'+
  list.slice(0,16).map((p,i)=>pin(p,i,selected?.id===p.id)).join('')+
  (list.length?'':'<p class="il4-no-pins">Nuk u gjetën shembuj për filtrat.</p>')+'</div>'+
  (selected?'<article class="il4-card"><h4>'+escaped(selected.name)+'</h4><p>'+escaped(selected.city)+' · '+(selected.kind==='business'?'Biznes':'Aktivitet')+'</p><p>'+escaped(selected.detail)+'</p></article>':'')+
  '<div class="il4-results">'+list.slice(0,20).map(p=>b('pin:'+p.id,p.name+' — '+p.city)).join('')+'</div>'+
  '<p class="il4-muted">Për hartë reale në aplikacionin profesional do të duhen burime të verifikuara vendesh, leje dhe rregulla privatësie.</p>';
 };
 const sampleStatuses=[
  {id:'public',title:'Kafe me komunitetin',state:'available',public:true,note:'Aktivitet publik me vende të lira.'},
  {id:'full',title:'Futboll në Durrës',state:'full',public:true,note:'Vendet janë plot. Mund të shfaqet kërkesa për listë pritjeje.'},
  {id:'canceled',title:'Vizitë muzeu',state:'canceled',public:true,note:'Organizatori e ka anuluar. Kërkesat e reja nuk lejohen.'},
  {id:'expired',title:'Takimi i javës së kaluar',state:'expired',public:true,note:'Data kaloi. Nuk është më e mundur të regjistrohesh.'},
  {id:'private',title:'',state:'private',public:false,note:'Përmbajtja private nuk zbulohet pa leje.'},
  {id:'removed',title:'',state:'removed',public:false,note:'Përmbajtja nuk është më e aksesueshme.'}
 ];
 const getPlanStatuses=()=>{
  const x=stored(PLANS),events=Array.isArray(x.events)?x.events:[];
  const req=Array.isArray(x.requests)?x.requests:[];
  return [...sampleStatuses,...events.filter(e=>e&&typeof e==='object').slice(0,24).map(e=>{
   let stateCode=e.privacy==='private'?'private':e.cancelled?'canceled':Date.parse(String(e.date)+'T'+String(e.time))<=Date.now()?'expired':
   req.filter(r=>r?.eventId===e.id&&r.status==='accepted').length>=Number(e.capacity||1)?'full':'available';
   return {id:'existing-'+String(e.id).slice(0,30),title:stateCode==='private'?'':String(e.title||'').slice(0,90),state:stateCode,public:stateCode!=='private',note:'Gjendje e llogaritur nga të dhënat lokale të panelit të organizatorit.'};
  })];
 };
 const stateLabel=s=>({available:'I hapur',full:'Plot',canceled:'Anuluar',expired:'I skaduar',private:'Privat',removed:'Nuk gjendet'})[s]||'I panjohur';
 const statuses=()=>'<h3>Gjendjet e aktiviteteve dhe kthimi i sigurt</h3><p>Kur hap një aktivitet nga Postimi/Story/Reel, gjendja duhet kontrolluar sërish. Klikimi nuk regjistron automatikisht pjesëmarrje.</p>'+
 getPlanStatuses().map(p=>'<article class="il4-card"><div class="il4-cardtop"><strong>'+escaped(p.public?p.title:'Aktivitet privat ose i padisponueshëm')+'</strong><span>'+escaped(stateLabel(p.state))+'</span></div>'+
 '<p>'+escaped(p.note)+'</p>'+b('state:'+p.state,'Çfarë mund të bëj?')+'</article>').join('')+note()+
 '<p class="il4-muted">Shembujt e gjendjeve nuk janë rezervime, njoftime ose leje nga serveri.</p>';
 const render=()=>{
  if(!root)return;
  root.hidden=!state.open;
  if(!state.open)return;
  root.innerHTML='<div class="il4-shade" data-il4="close"></div><section class="il4-panel" role="dialog" aria-modal="true" aria-label="Privatësia, komunitetet dhe vendet">'+
  header()+tabRow()+note()+(state.tab==='profiles'?profiles():state.tab==='groups'?groupPage():state.tab==='map'?mapPage():statuses())+
  '<footer>Vetëm demonstrim lokal · Nuk ka përdorues, hartë, mesazhe apo kërkesa reale.</footer></section>';
  root.querySelector('.il4-head button')?.focus();
 };
 const open=which=>{if(!root||state.open)return;opener=document.activeElement;inertSnapshot=['#screen','#navbar','.head','.statusbar','.homebar','.island'].map(sel=>document.querySelector('#phone > '+sel)).filter(Boolean).map(el=>({el,was:el.inert}));inertSnapshot.forEach(({el})=>{el.inert=true});state.open=true;state.tab=['profiles','groups','map','states'].includes(which)?which:'profiles';state.notice='';state.role='visitor';state.selected=state.tab==='groups'?'albania-milan':'leon';render()};
 const close=()=>{state.open=false;root.hidden=true;inertSnapshot.forEach(({el,was})=>{if(el.isConnected)el.inert=was});inertSnapshot=[];if(opener?.isConnected)opener.focus()};
 const msg=v=>{state.notice=v;save();render()};
 function act(a){
  if(a==='close')return close();
  if(a.startsWith('tab:')){state.tab=a.slice(4);state.notice='';state.selected=state.tab==='groups'?'albania-milan':'leon';render();return}
  if(a.startsWith('role:')){state.role=a.slice(5);state.notice='';render();return}
  if(a.startsWith('profile:')){state.selected=a.slice(8);state.notice='';render();return}
  if(a.startsWith('group:')){state.selected=a.slice(6);state.notice='';render();return}
  if(a.startsWith('pin:')){state.selectedPin=a.slice(4);render();return}
  if(a.startsWith('state:')){
   const k=a.slice(6);
   const response={available:'Mund të kërkosh pjesëmarrje nga aktiviteti origjinal.',full:'Vendet janë plot. Organizatori mund të përdorë listën e pritjes.',canceled:'Aktiviteti është anuluar; nuk lejohet kërkesë e re.',expired:'Aktiviteti ka kaluar dhe nuk pranon kërkesa.',private:'Kërko autorizim; emri dhe përmbajtja private nuk ekspozohen.',removed:'Ky aktivitet nuk është më i disponueshëm.'};
   state.notice=response[k]||'Gjendje e panjohur.';render();return;
  }
  if(state.tab==='profiles'){
   const p=currentProfile(),s=state.follow[p.id]||'none';
   if(a==='follow-request'&&state.role==='visitor'&&(s==='none'||s==='declined')){
    state.follow[p.id]=p.audience==='private'?'pending':'accepted';return msg('Veprimi u ruajt në simulim.')}
   if(a==='follow-withdraw'&&state.role==='visitor'&&(s==='pending'||s==='accepted')){state.follow[p.id]='none';return msg('Ndjekja ose kërkesa u tërhoq.')}
   if(a==='follow-approve'&&state.role==='owner'&&s==='pending'){state.follow[p.id]='accepted';return msg('Kërkesa u pranua në simulim.')}
   if(a==='follow-deny'&&state.role==='owner'&&s==='pending'){state.follow[p.id]='declined';return msg('Kërkesa u refuzua.')}
   if(a==='block'&&state.role==='visitor'){state.follow[p.id]='blocked';return msg('Kontakti u bllokua në këtë simulim.')}
   if(a==='unblock'&&state.role==='visitor'&&s==='blocked'){state.follow[p.id]='none';return msg('Bllokimi u hoq.')}
  }
  if(state.tab==='groups'){
   const g=currentGroup(),s=state.membership[g.id]||'none';
   if(a==='group-request'&&state.role==='visitor'&&(s==='none'||s==='declined')){
    state.membership[g.id]=g.privacy==='private'?'pending':'accepted';return msg('Anëtarësia/kërkesa u ruajt në simulim.')}
   if(a==='group-withdraw'&&state.role==='visitor'&&(s==='pending'||s==='accepted')){state.membership[g.id]='none';return msg('Anëtarësia/kërkesa u tërhoq.')}
   if(a==='group-approve'&&state.role==='owner'&&s==='pending'){state.membership[g.id]='accepted';return msg('Anëtarësia u pranua.')}
   if(a==='group-deny'&&state.role==='owner'&&s==='pending'){state.membership[g.id]='declined';return msg('Kërkesa u refuzua.')}
  }
 }
 function sync(){
  const screen=document.querySelector('#screen');
  if(!screen)return;
  const heading=screen.querySelector('.section-header h2,h2')?.textContent||'';
  let type=/Zbulo/i.test(heading)?'map':/Planet|Plane që/i.test(heading)||!!screen.querySelector('.v10-event-tabs')?'states':/Profil/i.test(heading)||!!screen.querySelector('.profile-banner')?'profiles':null;
  const existing=screen.querySelector('#il4-entry');
  if(!type){existing?.remove();return}
  if(existing){existing.dataset.open=type;return}
  const node=document.createElement('div');
  node.id='il4-entry';
  node.dataset.open=type;
  node.innerHTML='<div><strong>Privatësia, komunitetet dhe vendet</strong><p>Profile private · Grupe · Hartë · Gjendja e planeve</p></div><button type="button" data-il4-entry="1">Eksploro →</button>';
  const anchor=screen.querySelector('.section-header')||screen.querySelector('.v10-event-tabs')||screen.firstElementChild;
  anchor?.parentNode?.insertBefore(node,anchor.nextSibling);
 }
 function init(){
  const phone=document.querySelector('#phone'),screen=document.querySelector('#screen');
  if(!phone||!screen)return;
  root=document.createElement('div');root.id='il4-root';root.hidden=true;phone.appendChild(root);
  document.addEventListener('click',e=>{
   const item=e.target.closest('[data-il4-entry]');
   if(item){e.preventDefault();open(item.closest('#il4-entry')?.dataset.open||'profiles');}
  },true);
  root.addEventListener('click',e=>{
   const btn=e.target.closest('[data-il4]');if(!btn)return;
   e.preventDefault();act(btn.dataset.il4);
  });
  root.addEventListener('submit',e=>{
   if(e.target.id!=='il4-mapform')return;
   e.preventDefault();const data=new FormData(e.target),city=String(data.get('city')),kind=String(data.get('kind'));
   if(!cities.includes(city)||!['all','activity','business'].includes(kind)){state.notice='Filtër i pavlefshëm.';render();return}
   state.city=city;state.mapKind=kind;state.search=String(data.get('q')||'').slice(0,60);state.selectedPin='';render();
  });
  document.addEventListener('focusin',e=>{
   if(state.open&&!root.contains(e.target))root.querySelector('.il4-head button')?.focus();
  },true);
  document.addEventListener('keydown',e=>{
   if(!state.open)return;
   if(e.key==='Escape'){e.preventDefault();close();return}
   if(e.key!=='Tab')return;
   const buttons=[...root.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled])')].filter(el=>el.getClientRects().length>0);
   if(!buttons.length)return;
   const focused=document.activeElement;
   if(e.shiftKey&&(focused===buttons[0]||!root.contains(focused))){e.preventDefault();buttons[buttons.length-1].focus();}
   else if(!e.shiftKey&&(focused===buttons[buttons.length-1]||!root.contains(focused))){e.preventDefault();buttons[0].focus();}
  },true);
  new MutationObserver(()=>{if(!state.open)queueMicrotask(sync)}).observe(screen,{childList:true,subtree:false});
  queueMicrotask(sync);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();
