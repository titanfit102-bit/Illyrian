/* ILLYRIAN v1.7 — organizer demo, isolated local-only module */
(function installIllyrianPlans() {
  'use strict';
  const KEY='illyrian_demo_v17_plans';
  const cities=['Tiranë','Durrës','Shkodër','Vlorë','Prishtinë','Elbasan','Milano','Romë','Berlin'];
  const kinds=['Sport','Miqësi dhe komunitet','Kulturë','Alumni','Bashkëpunim'];
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const after=n=>{const d=new Date();d.setDate(d.getDate()+n);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
  const seed=()=>[{id:'demo-football',title:'Futboll dhe njohje të reja',kind:'Sport',city:'Tiranë',place:'Fusha pranë Liqenit Artificial',date:after(8),time:'17:30',capacity:3,price:0,privacy:'public',conditions:'Për të rritur. Sillni veshje sportive.',cancelled:false}];
  const seedRequests=[{id:'arta',eventId:'demo-football',name:'Arta K.',status:'pending'},{id:'leon',eventId:'demo-football',name:'Leon M.',status:'pending'},{id:'besa',eventId:'demo-football',name:'Besa H.',status:'accepted'}];
  let stored={};try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(v&&typeof v==='object'&&!Array.isArray(v))stored=v}catch{}
  // Tolerate partial legacy records, not nulls or primitive stored entries.
  // Do not overwrite raw localStorage merely by loading this DEMO.
  const records=(arr,max,tail=false)=>Array.isArray(arr)?(tail?arr.slice(-max):arr.slice(0,max)).filter(v=>v&&typeof v==='object'&&!Array.isArray(v)):null;
  const eventsSafe=records(stored.events,24),requestsSafe=records(stored.requests,200);
  const state={
    events:eventsSafe?eventsSafe.filter(e=>typeof e.id==='string'&&e.id.length>0):seed(),
    requests:requestsSafe?requestsSafe.filter(x=>typeof x.id==='string'&&typeof x.eventId==='string'):seedRequests,
    messages:records(stored.messages,100,true)?.filter(x=>typeof x.eventId==='string')||[],
    attendance:Array.isArray(stored.attendance)?stored.attendance.slice(-100).filter(x=>typeof x==='string'):[],
    open:false,view:'list',role:'organizer',id:'demo-football',edit:null,notice:''
  };
  let root,trigger,draft=null,inertSnapshot=[];
  const event=id=>state.events.find(x=>x.id===id);
  const requests=id=>state.requests.filter(r=>r.eventId===id);
  const accepted=id=>requests(id).filter(r=>r.status==='accepted');
  const pending=id=>requests(id).filter(r=>r.status==='pending');
  const waiting=id=>requests(id).filter(r=>r.status==='waitlist');
  const free=e=>Math.max(0,e.capacity-accepted(e.id).length);
  const self=id=>requests(id).find(r=>r.name==='Profili im'&&['pending','accepted','waitlist'].includes(r.status));
  const closed=e=>e.cancelled||new Date(e.date+'T'+e.time).getTime()<Date.now();
  const feedback=(key,fallback)=>window.IllyrianI18n?.t('plans:'+key)||fallback;
  const ui=(key,fallback)=>escape(feedback(key,fallback));
  const typeKey=code=>({Sport:'kindSport','Miqësi dhe komunitet':'kindSocial',Kulturë:'kindCulture',Alumni:'kindAlumni',Bashkëpunim:'kindCollaboration'}[code]||null);
  const visibilityKey=code=>({public:'visibilityPublic',private:'visibilityPrivate'}[code]||null);
  const storedData=()=>({events:state.events,requests:state.requests,messages:state.messages,attendance:state.attendance});
  let lastSaved=JSON.stringify(storedData());
  const save=()=>{try{const value=JSON.stringify(storedData());localStorage.setItem(KEY,value);lastSaved=value;return true}catch{
    Object.assign(state,JSON.parse(lastSaved));state.notice=feedback('localStorageError','Nuk mund të ruhej ndryshimi në pajisje.');return false}};
  const button=(a,label,extra='')=>`<button type="button" data-ilp="${escape(a)}" ${extra}>${escape(label)}</button>`;
  const choose=(values,current,keyOf=()=>null)=>values.map(v=>`<option data-i18n-direct ${v===current?'selected':''} value="${escape(v)}">${keyOf(v)?ui(keyOf(v),v):escape(v)}</option>`).join('');
  const summary=e=>`<article class="ilp-card"><div class="ilp-muted">${escape(e.kind)} · ${escape(e.city)} · ${closed(e)?'I mbyllur':free(e)===0?'Plot':'Aktiv'}</div><h3 data-user-content>${escape(e.title)}</h3><p>${escape(e.date)} · ${escape(e.time)} · <span data-user-content>${escape(e.place)}</span></p><p>${accepted(e.id).length}/${e.capacity} të pranuar · ${pending(e.id).length} në pritje</p>${button('detail:'+e.id,'Hap aktivitetin →')}</article>`;
  const form=()=>{
    const e=state.edit?event(state.edit):null;
    const v=e||(draft||{title:'',kind:kinds[0],city:cities[0],place:'',date:after(7),time:'17:00',capacity:8,price:0,privacy:'public',conditions:''});
    return `<h3 data-i18n-direct>${e?ui('formEdit','Redakto aktivitetin'):ui('formCreate','Krijo aktivitetin')}</h3><form id="ilp-form" novalidate>
    <label data-i18n-direct>${ui('formName','Titulli')}<input name="title" required maxlength="90" value="${escape(v.title)}" placeholder="${ui('formNameHint','P.sh. Takim shqiptarësh')}"></label>
    <label data-i18n-direct>${ui('formKind','Lloji')}<select name="kind">${choose(kinds,v.kind,typeKey)}</select></label>
    <label data-i18n-direct>${ui('formCity','Qyteti')}<select name="city">${choose(cities,v.city)}</select></label>
    <label data-i18n-direct>${ui('formPlace','Vendi')}<input name="place" maxlength="100" required value="${escape(v.place)}" placeholder="${ui('formPlaceHint','Vend publik takimi')}"></label>
    <div class="ilp-grid"><label data-i18n-direct>${ui('formDate','Data')}<input type="date" name="date" min="${after(0)}" value="${escape(v.date)}" required></label><label data-i18n-direct>${ui('formTime','Ora')}<input type="time" name="time" required value="${escape(v.time)}"></label></div>
    <div class="ilp-grid"><label data-i18n-direct>${ui('formCapacity','Kapaciteti')}<input name="capacity" type="number" min="1" max="100" value="${Number(v.capacity)}"></label><label data-i18n-direct>${ui('formContribution','Kontributi €')}<input name="price" type="number" min="0" max="10000" step=".5" value="${Number(v.price)}"></label></div>
    <label data-i18n-direct>${ui('formPrivacy','Dukshmëria')}<select name="privacy">${choose(['public','private'],v.privacy,visibilityKey)}</select></label>
    <label data-i18n-direct>${ui('formConditions','Kushtet')}<textarea name="conditions" maxlength="240">${escape(v.conditions)}</textarea></label>
    <p class="ilp-muted" data-i18n-direct>${ui('formInfo','Aktiviteti është vetëm provë. Nuk publikohen vendndodhje personale apo kërkesa reale.')}</p>
    <p id="ilp-error" role="alert"></p><button type="submit" data-i18n-direct>${e?ui('formSave','Ruaj ndryshimet'):ui('formPublish','Publiko aktivitetin (demo)')}</button>${button('list',feedback('formBack','Kthehu'),'data-i18n-direct')}</form>`;
  };
  const detail=()=>{
    const e=event(state.id);if(!e)return button('list','Kthehu');
    const my=self(e.id),owner=state.role==='organizer',ended=closed(e);
    let html=`<div class="ilp-muted">${escape(e.kind)} · ${escape(e.city)} · ${ended?'I anuluar ose i kaluar':free(e)===0?'Vendet plot':'Aktiv'}</div>
    <h3 data-user-content>${escape(e.title)}</h3><p>${escape(e.date)} · ${escape(e.time)} · <span data-user-content>${escape(e.place)}</span></p>
    <p><b>${accepted(e.id).length}/${e.capacity}</b> vende · ${pending(e.id).length} kërkesa · ${waiting(e.id).length} në listë pritjeje</p>
    <p data-user-content>${escape(e.conditions||'Nuk ka kushte shtesë.')}</p><p class="ilp-muted">${e.privacy==='public'?'Publik':'Privat'} · ${Number(e.price)||0} € · Vetëm demonstrim</p>`;
    if(owner){
      if(!ended)html+=button('edit','Redakto')+button('cancel','Anulo aktivitetin');
      html+=`<h4>Menaxho kërkesat</h4>`;
      for(const r of requests(e.id)){
        html+=`<div class="ilp-request"><span>${escape(r.name)} — ${escape(r.status)}</span><div>`;
        if(!ended&&r.status==='pending')html+=button('accept:'+r.id,'Prano',free(e)===0?'disabled':'')+button('decline:'+r.id,'Refuzo');
        if(!ended&&r.status==='waitlist'&&free(e)>0)html+=button('promote:'+r.id,'Kalo në pritje');
        if(r.status==='accepted')html+=button('attendance:'+r.id,state.attendance.includes(r.id)?'✓ Erdhi':'Shëno ardhjen');
        html+='</div></div>';
      }
    }else{
      if(!ended)html+=my?button('withdraw','Tërhiq kërkesën'):button('join',free(e)?'Kërko të bashkohesh':'Hyr në listë pritjeje');
      html+=`<p class="ilp-muted">Statusi yt: ${my?escape(my.status):'Pa kërkesë'}.</p>`;
    }
    const mayChat=owner||my?.status==='accepted';
    if(mayChat){
      html+='<h4>Biseda e grupit — demo</h4><div class="ilp-chat">'+(state.messages.filter(m=>m.eventId===e.id).slice(-15).map(m=>'<p><b data-user-content>'+escape(m.name)+':</b> <span data-user-content>'+escape(m.text)+'</span></p>').join('')||'<p>Ende pa mesazhe.</p>')+'</div>';
      if(!ended)html+='<form id="ilp-chat-form"><input name="message" maxlength="280" placeholder="Shkruaj në grup..." aria-label="Mesazhi në grup" required><button type="submit">Dërgo</button></form>';
      else html+='<p class="ilp-muted">Biseda është vetëm për lexim.</p>';
    }else html+='<p class="ilp-muted">Biseda është e disponueshme vetëm pas pranimit.</p>';
    return html+button('list','Kthehu te aktivitetet');
  };
  const content=()=>state.view==='form'?form():state.view==='detail'?detail():
   `<p class="ilp-muted">Kalo midis organizatorit dhe pjesëmarrësit për të provuar të gjithë procesin. Nuk ka persona apo aktivitete reale.</p>
   ${state.role==='organizer'?button('new','+ Krijo aktivitet'):''}
   ${state.events.filter(e=>state.role==='organizer'||e.privacy==='public').map(summary).join('')}`;
  function render(){
    if(!root)return;
    root.hidden=!state.open;
    if(!state.open){sync();return}
    root.innerHTML=`<div class="ilp-shade" data-ilp="close"></div><div class="ilp-panel" role="dialog" aria-modal="true" aria-label="${ui('title','Aktivitetet dhe organizatori')}">
    <header><div><small>ILLYRIAN · PLANE</small><h2>Aktivitetet dhe organizatori</h2></div>${button('close','✕')}</header>
    <nav aria-label="${ui('role','Roli i demonstrimit')}">${button('role:organizer','Si organizator',state.role==='organizer'?'class="chosen"':'')}${button('role:participant','Si pjesëmarrës',state.role==='participant'?'class="chosen"':'')}</nav>
    ${state.notice?`<p class="ilp-notice" role="status">${escape(state.notice)}</p>`:''}
    ${content()}<p class="ilp-muted ilp-foot">PROTOTIP · Asnjë pjesëmarrje, pagesë ose mesazh real.</p></div>`;
    sync();
  }
  const open=(id)=>{if(state.open)return;trigger=document.activeElement;inertSnapshot=['#screen','#navbar','.head','.statusbar','.homebar','.island'].map(sel=>document.querySelector('#phone > '+sel)).filter(Boolean).map(el=>({el,was:el.inert}));inertSnapshot.forEach(({el})=>{el.inert=true});state.open=true;state.notice='';state.view=id?'detail':'list';if(id)state.id=id;render();root.querySelector('header button')?.focus()};
  const close=()=>{state.open=false;render();inertSnapshot.forEach(({el,was})=>{if(el.isConnected)el.inert=was});inertSnapshot=[];if(trigger?.isConnected)trigger.focus()};
  const notice=s=>{
    state.notice=s;
    if(save()){render();return}
    if(!root)return;
    let note=root.querySelector('.ilp-notice');
    if(!note){note=document.createElement('p');note.className='ilp-notice';note.setAttribute('role','status');root.querySelector('nav')?.insertAdjacentElement('afterend',note)}
    note.textContent=state.notice;
  };
  function click(a){
    const k=a.dataset.ilp||'',e=event(state.id),owner=state.role==='organizer';
    if(k==='close'){close();return}
    if(k==='list'){state.view='list';state.notice='';render();return}
    if(k.startsWith('role:')){state.role=k.slice(5);state.view='list';state.notice='';render();return}
    if(k==='new'&&owner){state.edit=null;draft=null;state.view='form';render();return}
    if(k.startsWith('detail:')){state.id=k.slice(7);state.view='detail';state.notice='';render();return}
    if(!e)return;
    if(k==='edit'&&owner&&!closed(e)){state.edit=e.id;draft=null;state.view='form';render();return}
    if(k==='cancel'&&owner&&!closed(e)){if(!window.confirm(feedback('cancelConfirm','Anulo aktivitetin demonstrues?')))return;e.cancelled=true;notice(feedback('cancelled','Aktiviteti u anulua.'));return}
    if(k==='join'&&!owner&&!closed(e)&&e.privacy==='public'&&!self(e.id)){
      if(state.requests.length>=200)return notice(feedback('requestLimit','Kufiri i provës u arrit.'));
      state.requests.push({id:'r'+Date.now().toString(36),eventId:e.id,name:'Profili im',status:free(e)>0?'pending':'waitlist'});
      notice(feedback('requestSavedNotice','Kërkesa u ruajt; organizatori duhet ta shqyrtojë.'));return;
    }
    if(k==='withdraw'&&!owner){
      const r=self(e.id);if(!r||closed(e))return;
      r.status='withdrawn';notice(feedback('withdrawnNotice','Pjesëmarrja u tërhoq.'));return;
    }
    if(!owner||closed(e))return;
    const [act,id]=k.split(':');const r=state.requests.find(x=>x.id===id&&x.eventId===e.id);
    if(!r)return;
    if(act==='accept'&&r.status==='pending'&&free(e)>0){r.status='accepted';notice(feedback('acceptedNotice','Kërkesa u pranua.'))}
    else if(act==='decline'&&r.status==='pending'){r.status='declined';notice(feedback('declinedNotice','Kërkesa u refuzua.'))}
    else if(act==='promote'&&r.status==='waitlist'&&free(e)>0){r.status='pending';notice(feedback('promotedNotice','Nga lista e pritjes në kërkesë normale; pranim jo automatik.'))}
    else if(act==='attendance'&&r.status==='accepted'){state.attendance=state.attendance.includes(id)?state.attendance.filter(x=>x!==id):[...state.attendance,id];notice(feedback('attendanceNotice','Evidencë demonstrative e përditësuar.'))}
  }
  function submit(form){
    if(form.id==='ilp-chat-form'){
      const e=event(state.id),r=self(e?.id),txt=String(new FormData(form).get('message')||'').trim().slice(0,280);
      if(!e||closed(e)||!txt||(state.role!=='organizer'&&r?.status!=='accepted'))return;
      state.messages.push({eventId:e.id,name:state.role==='organizer'?'Organizatori':'Profili im',text:txt});
      state.messages=state.messages.slice(-100);notice(feedback('messageSavedNotice','Mesazhi u ruajt vetëm në demo.'));return;
    }
    if(form.id!=='ilp-form'||state.role!=='organizer')return;
    const data=new FormData(form);
    const v={title:String(data.get('title')||'').trim().slice(0,90),kind:String(data.get('kind')),city:String(data.get('city')),place:String(data.get('place')||'').trim().slice(0,100),date:String(data.get('date')),time:String(data.get('time')),capacity:Number(data.get('capacity')),price:Number(data.get('price')),privacy:String(data.get('privacy')),conditions:String(data.get('conditions')||'').trim().slice(0,240)};
    const error=s=>{const el=root.querySelector('#ilp-error');if(el)el.textContent=s};
    if(v.title.length<5||v.place.length<3)return error(feedback('titlePlaceError','Titulli ose vendi janë tepër të shkurtër.'));
    if(!cities.includes(v.city)||!kinds.includes(v.kind)||!['public','private'].includes(v.privacy))return error(feedback('codesError','Qyteti, kategoria ose dukshmëria nuk njihen.'));
    if(!/^\d{4}-\d{2}-\d{2}$/.test(v.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time)||!Number.isFinite(Date.parse(v.date+'T'+v.time))||Date.parse(v.date+'T'+v.time)<=Date.now())return error(feedback('dateError','Zgjidh datë dhe orë në të ardhmen.'));
    if(!Number.isInteger(v.capacity)||v.capacity<1||v.capacity>100||!Number.isFinite(v.price)||v.price<0||v.price>10000)return error(feedback('capacityError','Kapaciteti 1–100 dhe kontributi 0–10000 €.'));
    let e=state.edit?event(state.edit):null;
    if(e){if(closed(e)||v.capacity<accepted(e.id).length)return error(feedback('belowAcceptedError','Kapaciteti nuk mbulon pjesëmarrësit e pranuar.'));Object.assign(e,v);}
    else{if(state.events.length>=24)return error(feedback('eventLimit','Kufiri i demonstrimit u arrit.'));e={id:'p'+Date.now().toString(36),...v,cancelled:false};state.events.unshift(e);}
    if(!save()){error(state.notice);return}
    state.id=e.id;state.edit=null;draft=null;state.view='detail';state.notice=feedback('eventSavedNotice','Aktiviteti u ruajt në demonstrim.');render();
  }
  function sync(){
    const screen=document.querySelector('#screen');if(!screen)return;
    const shown=!!screen.querySelector('.v10-event-tabs')||/Plane që na bashkojnë|Planet e mia/i.test(screen.querySelector('h2')?.textContent||'');
    if(!shown)return;
    if(!screen.querySelector('[data-ilp-entry]')){
      const wrap=document.createElement('div');wrap.className='ilp-entry';wrap.innerHTML='<strong>Krijo dhe menaxho aktivitete</strong><p>Plan, kërkesa, kapacitet dhe biseda në grup · demo</p><button type="button" data-ilp-entry="1">Hap panelin →</button>';
      const first=screen.querySelector('.v10-event-tabs')||screen.firstElementChild;first?.parentElement?.insertBefore(wrap,first);
    }
    let cards=screen.querySelector('#ilp-created-list');
    const visible=state.events.filter(e=>e.id!=='demo-football'&&e.privacy==='public');
    if(!visible.length){cards?.remove();return}
    if(!cards){cards=document.createElement('section');cards.id='ilp-created-list';screen.appendChild(cards)}
    const markup='<h3>Aktivitete të krijuara në demo</h3>'+visible.map(e=>`<article class="ilp-card"><strong data-user-content>${escape(e.title)}</strong><p>${escape(e.city)} · ${escape(e.date)}</p><button type="button" data-ilp-open="${escape(e.id)}">Hap planin →</button></article>`).join('');
    if(cards.innerHTML!==markup)cards.innerHTML=markup;
  }
  function onLocaleChange(){
    if(!root||!state.open)return;
    const active=document.activeElement;
    const action=active?.dataset?.ilp,field=active?.name;
    const currentForm=root.querySelector('#ilp-form');
    const currentChat=root.querySelector('#ilp-chat-form');
    const fields=currentForm?Array.from(currentForm.elements).filter(x=>x.name).map(x=>({name:x.name,value:x.value})):null;
    const validation=currentForm?.querySelector('#ilp-error')?.textContent||'';
    const chatText=currentChat?.elements.message?.value;
    render();
    const next=root.querySelector('#ilp-form');
    if(fields&&next){
      fields.forEach(x=>{const control=next.elements.namedItem(x.name);if(control)control.value=x.value});
      const error=next.querySelector('#ilp-error');if(error)error.textContent=validation;
    }
    const nextChat=root.querySelector('#ilp-chat-form');
    if(nextChat&&chatText!==undefined)nextChat.elements.message.value=chatText;
    // Rebuilding the active dialog can detach the focused control. Restore its
    // semantic target, falling back to the close button so focus never escapes.
    const fieldTarget=field&&(next?.elements.namedItem(field)||nextChat?.elements.namedItem(field));
    const actionTarget=action&&root.querySelector('[data-ilp="'+action+'"]');
    const focusTarget=fieldTarget||actionTarget||root.querySelector('.ilp-panel header button');
    focusTarget?.focus();
    // Other locale listeners and the legacy DOM translator may still update
    // the interface in this event turn. Recheck after their DOM work settles.
    queueMicrotask(()=>{
      if(!state.open||!root?.isConnected||root.hidden||root.contains(document.activeElement))return;
      const liveForm=root.querySelector('#ilp-form'),liveChat=root.querySelector('#ilp-chat-form');
      const liveField=field&&(liveForm?.elements.namedItem(field)||liveChat?.elements.namedItem(field));
      const liveAction=action&&root.querySelector('[data-ilp="'+action+'"]');
      (liveField||liveAction||root.querySelector('.ilp-panel header button'))?.focus();
    });
  }
  function init(){
    const phone=document.querySelector('#phone'),screen=document.querySelector('#screen');if(!phone||!screen)return;
    const style=document.createElement('style');style.textContent=`
      #phone .ilp-entry{margin:13px;padding:14px;border:1px solid #e50c3755;border-radius:15px;background:var(--card,#fff)}
      #phone .ilp-entry strong{font-size:13px;display:block}
      #phone .ilp-entry p,#phone .ilp-muted{font-size:11px;line-height:1.5;color:var(--muted,#706570)}
      #phone .ilp-entry button,#phone #ilp-root button,#phone #ilp-created-list button{min-height:44px;padding:10px;border:0;border-radius:10px;background:#e50c37;color:#fff;font-weight:700;font-size:11px;margin:4px;cursor:pointer}
      #phone #ilp-root[hidden]{display:none}
      #phone #ilp-root{position:absolute;inset:0;z-index:5000;color:var(--ink,#161016)}
      #phone .ilp-shade{position:absolute;inset:0;background:#100008cc}
      #phone .ilp-panel{position:absolute;inset:0;overflow:auto;background:var(--card,#fff);padding:32px 15px;box-sizing:border-box}
      #phone .ilp-panel header{display:flex;justify-content:space-between;align-items:start;gap:10px}
      #phone .ilp-panel h2{font-size:18px;margin:5px 0}
      #phone .ilp-panel h3{font-size:15px;margin:15px 0 8px}
      #phone .ilp-panel h4{font-size:13px;margin:16px 0 8px}
      #phone .ilp-panel p{font-size:12px;line-height:1.5}
      #phone .ilp-panel small{color:#e50c37;font-weight:800;font-size:10px}
      #phone .ilp-panel nav{display:flex;gap:5px;margin:16px 0}
      #phone .ilp-panel nav button{flex:1;background:var(--card2,#eee);color:var(--ink)}
      #phone .ilp-panel nav button.chosen{background:#e50c37;color:#fff}
      #phone .ilp-card{padding:13px;border:1px solid #b58b9b55;border-radius:13px;margin:10px 0}
      #phone .ilp-card h3{margin:6px 0}
      #phone .ilp-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      #phone #ilp-form label{display:block;font-size:11px;font-weight:800;margin:8px 0}
      #phone #ilp-form input,#phone #ilp-form select,#phone #ilp-form textarea,#phone #ilp-chat-form input{box-sizing:border-box;width:100%;border:1px solid #b58b9b88;border-radius:10px;background:var(--card,#fff);color:var(--ink);min-height:44px;padding:9px;font-size:13px}
      #phone #ilp-form textarea{min-height:75px}
      #phone .ilp-request{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #aaa3;padding:7px 0;gap:6px;font-size:11px}
      #phone .ilp-request div{display:flex;flex-wrap:wrap}
      #phone .ilp-notice{background:#e50c3720;border-radius:10px;padding:10px}
      #phone .ilp-chat{max-height:170px;overflow:auto;background:var(--card2,#eee);padding:8px;border-radius:10px}
      #phone .ilp-foot{border-top:1px solid #aaa4;padding-top:12px;margin-top:20px}
      #phone #ilp-created-list{padding:10px 13px}
    `;document.head.appendChild(style);
    root=document.createElement('div');root.id='ilp-root';root.hidden=true;phone.appendChild(root);
    root.addEventListener('click',e=>{const el=e.target.closest('[data-ilp]');if(!el)return;e.preventDefault();click(el)});
    root.addEventListener('submit',e=>{e.preventDefault();submit(e.target)});
    document.addEventListener('click',e=>{
      const el=e.target.closest('[data-ilp-entry],[data-ilp-open]');if(!el)return;
      e.preventDefault();open(el.dataset.ilpOpen||null)
    },true);
    document.addEventListener('keydown',e=>{
      if(!state.open)return;
      if(e.key==='Escape'){e.preventDefault();close();return}
      if(e.key!=='Tab')return;
      const items=[...root.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')].filter(x=>x.getClientRects().length);
      if(!items.length)return;
      if(e.shiftKey&&(document.activeElement===items[0]||!root.contains(document.activeElement))){e.preventDefault();items.at(-1).focus()}
      if(!e.shiftKey&&(document.activeElement===items.at(-1)||!root.contains(document.activeElement))){e.preventDefault();items[0].focus()}
    },true);
    window.addEventListener('illyrian:plans:draft',ev=>{
      const d=ev.detail||{};
      const title=String(d.title||'Takim komuniteti').slice(0,90);
      const kind=kinds.includes(d.kind)?d.kind:kinds[0];
      const city=cities.includes(d.city)?d.city:cities[0];
      draft={title,kind,city,place:'',date:'',time:'17:00',capacity:8,price:0,privacy:'public',conditions:String(d.conditions||'').slice(0,240)};
      state.edit=null;
      state.role='organizer';
      open();
      state.notice=feedback('draftNotice','Draft demonstrues. Konfirmo vendin, datën, orën, kapacitetin dhe kushtet përpara publikimit.');
      state.view='form';
      render();
    });
    window.addEventListener('illyrian:language-changed',onLocaleChange);
    const observer=new MutationObserver(()=>{if(!state.open)queueMicrotask(sync)});
    observer.observe(screen,{childList:true,subtree:false});
    queueMicrotask(sync);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
