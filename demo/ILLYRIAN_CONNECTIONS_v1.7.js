/* ILLYRIAN v1.7 Phase 3. Five differentiators, browser-only demonstration. */
(function illyrianPhaseThree(){
  'use strict';
  const KEY='illyrian_demo_v17_connections';
  const PLAN_KEY='illyrian_demo_v17_plans';
  const CITIES=['Tiranë','Durrës','Shkodër','Vlorë','Prishtinë','Elbasan','Milano','Romë','Berlin'];
  const TOPICS=[
    {id:'football',label:'Futboll pas pune',kind:'Sport',name:'Futboll me komunitetin',icon:'⚽',city:'Tiranë',slots:['Të shtunën 17:00','Të dielën 10:00','Të mërkurën 19:00'],count:3,goal:4},
    {id:'language',label:'Praktikë shqip–italisht',kind:'Bashkëpunim',name:'Praktikë gjuhësh dhe njohje',icon:'📚',city:'Milano',slots:['Të premten 18:00','Të shtunën 11:00','Të dielën 16:00'],count:4,goal:5},
    {id:'coffee',label:'Kafe dhe miqësi',kind:'Miqësi dhe komunitet',name:'Kafe për të njohur njerëz',icon:'☕',city:'Tiranë',slots:['Të shtunën 11:00','Të dielën 12:00','Të enjten 19:00'],count:5,goal:6},
    {id:'design',label:'Punëtori portofoli',kind:'Bashkëpunim',name:'Portofol krijues në grup',icon:'💡',city:'Durrës',slots:['Të shtunën 14:00','Të dielën 15:00','Të martën 18:00'],count:2,goal:4}
  ];
  const SAMPLE=[
    {id:'city-1',name:'Kafe dhe njohje të reja',city:'Tiranë',kind:'Miqësi dhe komunitet',host:'Besa H.',meet:'Te hyrja kryesore e Parkut Rinia',guide:'Një organizatore prezanton secilin dhe takimi fillon me biseda të shkurtra.',first:true},
    {id:'city-2',name:'Futboll për shqiptarët',city:'Durrës',kind:'Sport',host:'Leon M.',meet:'Para hyrjes së fushës',guide:'Takim 15 minuta para fillimit; luhet në ekipe të përziera.',first:true},
    {id:'city-3',name:'Praktikë shqip–italisht',city:'Milano',kind:'Bashkëpunim',host:'Arta K.',meet:'Te hyrja e bibliotekës së lagjes',guide:'Grupi ndahet në çifte dhe çdo 15 minuta ndërrohen partnerët.',first:true},
    {id:'city-4',name:'Të rinjtë shqiptarë në Romë',city:'Romë',kind:'Kulturë',host:'Dion M.',meet:'Te pika e informacionit të muzeut',guide:'Vizita zhvillohet me një person pritës të identifikuar.',first:true},
    {id:'city-5',name:'Punëtori portofoli',city:'Shkodër',kind:'Bashkëpunim',host:'Studio Arbër',meet:'Te recepsioni i hapësirës së punës',guide:'Pjesëmarrësit zgjedhin një problem dhe ndërtojnë një shembull.',first:true},
    {id:'city-6',name:'Takim shqiptarësh',city:'Prishtinë',kind:'Miqësi dhe komunitet',host:'Ekipi shembull',meet:'Në hyrje të sallës',guide:'Pritje me prezantim të organizatorëve.',first:true}
  ];
  const INITIAL={home:'Tiranë',origin:'Milano',choice:null,welcome:{},draftSource:null};
  const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=(key)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}};
  const raw=read(KEY);
  const state={
    home:CITIES.includes(raw.home)?raw.home:INITIAL.home,
    origin:CITIES.includes(raw.origin)?raw.origin:INITIAL.origin,
    choice:raw.choice&&typeof raw.choice==='object'?raw.choice:null,
    welcome:raw.welcome&&typeof raw.welcome==='object'&&!Array.isArray(raw.welcome)?raw.welcome:{},
    open:false,view:'overview',notice:'',selected:'city-1'
  };
  let root=null,opener=null,inertSnapshot=[];
  const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify({home:state.home,origin:state.origin,choice:state.choice,welcome:state.welcome}));return true}catch{state.notice='Hapësira lokale është plot; ndryshimi nuk u ruajt.';return false}};
  const eventData=()=>{const doc=read(PLAN_KEY),values=Array.isArray(doc.events)?doc.events:[];return values.filter(e=>e&&e.privacy==='public'&&!e.cancelled&&typeof e.title==='string'&&!Number.isNaN(Date.parse(e.date+'T'+e.time))&&Date.parse(e.date+'T'+e.time)>Date.now()).slice(0,24)};
  const button=(action,label)=>'<button type="button" data-ilc="'+h(action)+'">'+h(label)+'</button>';
  const cities=(current)=>CITIES.map(c=>'<option value="'+h(c)+'"'+(c===current?' selected':'')+'>'+h(c)+'</option>').join('');
  const header='<div class="ilc-title"><b>ILLYRIAN · LIDHJET REALE</b><h2>Nga interesi te takimi</h2><p>Katër rrugë për të gjetur njerëz dhe për të organizuar aktivitete.</p></div>';
  const notice=()=>state.notice?'<p class="ilc-note" role="status">'+h(state.notice)+'</p>':'';
  const overview=()=>header+notice()+
    '<div class="ilc-grid">'+[
      ['cities','🌍','Dy vendet e mia','Shiko përmbajtje nga dy qytete të zgjedhura.'],
      ['interest','💬','Nga interesi te plani','Interesi dhe intervalet para krijimit të një plani.'],
      ['welcome','🤝','Hera e parë','Kush të pret dhe ku e gjen grupin.'],
      ['repeat','🔁','Organizo sërish','Përgatit draftin pas një aktiviteti.'],
      ['together','🛠️','Bëjmë diçka bashkë','Punëtori dhe bashkëpunime me rezultat.']
    ].map(([id,ico,t,sub])=>'<button class="ilc-tile" data-ilc="view:'+id+'"><span>'+ico+'</span><strong>'+t+'</strong><small>'+sub+'</small></button>').join('')+
    '</div><p class="ilc-muted">Të gjitha të dhënat janë shembuj; asnjë mesazh, takim ose ftesë nuk i dërgohet një personi real.</p>';
  function citiesView(){
    const matched=[...SAMPLE,...eventData().map(e=>({id:e.id,name:e.title,city:e.city,kind:e.kind,host:'Organizatori i demos',meet:e.place,guide:e.conditions,first:true}))].filter(e=>e.city===state.home||e.city===state.origin);
    return '<h3>Dy vendet e mia</h3><p>Zgjidh manualisht qytetin ku jeton dhe qytetin me të cilin dëshiron të mbash lidhje. Kjo nuk tregon vendndodhjen reale.</p>'+
      '<form id="ilc-cities"><label>Qyteti ku jeton<select name="home">'+cities(state.home)+'</select></label>'+
      '<label>Qyteti i dytë / vendlindja<select name="origin">'+cities(state.origin)+'</select></label>'+
      '<button type="submit">Ruaj qytetet</button></form>'+notice()+
      '<h4>Mundësi nga dy zonat e tua</h4><div class="ilc-results">'+
      (matched.length?matched.map(e=>'<article><strong>'+h(e.name)+'</strong><p>'+h(e.city)+' · '+h(e.kind)+'</p>'+button('welcome:'+e.id,'Si do të më presin?')+'</article>').join(''):'<p>Nuk ka ende shembuj aktivitetesh në këto dy qytete.</p>')+
      '</div><p class="ilc-muted">Nuk përdorim GPS; qytetet e zgjedhura nuk publikohen te profilet e të tjerëve.</p>'+button('overview','Kthehu te zgjedhjet');
  }
  const interestView=()=>{
    const expired=state.choice?.expires&&new Date(state.choice.expires).getTime()<=Date.now();
    const current=!expired?state.choice:null;
    return '<h3>Nga interesi te plani</h3><p>Shëno një interes dhe një interval. Kur ka interes të mjaftueshëm demonstrues, mund t\'i përgatisësh organizatorit një draft — pa publikim automatik.</p>'+
      (expired?'<p class="ilc-note">Interesi i mëparshëm ka skaduar dhe nuk përdoret më.</p>':'')+
      (current?'<article class="ilc-chosen"><b>Zgjedhja jote aktive:</b> '+h(TOPICS.find(t=>t.id===current.topic)?.label||'')+
      ' · '+h(current.slot)+' · '+h(current.city)+'<p>Skadon: '+h(String(current.expires).slice(0,10))+'</p>'+
      button('clear-interest','Hiq interesin')+'</article>':'')+
      '<form id="ilc-interest"><label>Çfarë dëshiron? <select name="topic">'+TOPICS.map(t=>'<option value="'+h(t.id)+'"'+(current?.topic===t.id?' selected':'')+'>'+h(t.icon+' '+t.label)+'</option>').join('')+'</select></label>'+
      '<label>Qyteti<select name="city">'+cities(current?.city||state.home)+'</select></label>'+
      '<label>Koha e preferuar<select name="slot">'+
      (TOPICS.find(t=>t.id===current?.topic)||TOPICS[0]).slots.map(t=>'<option value="'+h(t)+'"'+(current?.slot===t?' selected':'')+'>'+h(t)+'</option>').join('')+
      '</select></label><label>Afati<select name="days"><option value="3">3 ditë</option><option value="7">7 ditë</option></select></label>'+
      '<button type="submit">Shpreh interesin (demo)</button></form>'+
      '<div id="ilc-matches">'+interestMatches()+'</div>'+notice()+
      '<p class="ilc-muted">Numrat e interesit janë shembuj fiktivë. Nuk ka rekomandime AI, njoftim te organizatorë realë ose konfirmim pjesëmarrjeje.</p>'+button('overview','Kthehu te zgjedhjet');
  };
  function interestMatches(){
    const current=state.choice;
    if(!current||Date.parse(current.expires)<Date.now())return '<p class="ilc-muted">Ruaj një interes për të parë nëse mund të krijohet një plan.</p>';
    const topic=TOPICS.find(t=>t.id===current.topic);
    if(!topic)return '';
    const sameCity=topic.city===current.city;
    const count=sameCity?topic.count+1:1;
    const ready=count>=topic.goal;
    return '<article class="ilc-match"><b>'+h(topic.icon+' '+topic.label)+'</b><p>'+h(current.city)+' · '+count+'/'+topic.goal+' interesime demonstrative</p>'+
      '<p>'+h(current.slot)+'</p>'+
      (ready?'<p>Ka mjaft interes fiktiv për të propozuar një aktivitet. <b>Nuk është rezervim.</b></p>'+
      button('draft-topic:'+topic.id,'Përgatit draftin e planit'): '<p>Interesi nuk mjafton ende. Nuk do të krijohet plan automatikisht.</p>')+
      '</article>';
  }
  const firstView=()=>{
    const list=[...SAMPLE,...eventData().map(e=>({id:e.id,name:e.title,city:e.city,kind:e.kind,host:'Organizatori demonstrues',meet:e.place,guide:e.conditions,first:true}))].slice(0,20);
    return '<h3>Hera e parë</h3><p>Informacion i qartë për personat që nuk njohin askënd në një aktivitet. Deklarimi që vjen për herë të parë është privat në këtë demo.</p>'+
      list.map(e=>'<article class="ilc-first"><strong>'+h(e.name)+'</strong><p>'+h(e.city)+' · '+h(e.kind)+'</p><p><b>Personi pritës:</b> '+h(e.host)+'</p>'+
      '<p><b>Ku takohemi:</b> '+h(e.meet)+'</p><p>'+h(e.guide)+'</p>'+
      '<label class="ilc-check"><input type="checkbox" data-ilc-first="'+h(e.id)+'"'+(state.welcome[e.id]?' checked':'')+'/> Dua udhëzim si pjesëmarrës i ri (ruhet vetëm në këtë pajisje)</label></article>').join('')+notice()+button('overview','Kthehu te zgjedhjet');
  };
  const repeatView=()=>{
    const values=read(PLAN_KEY),events=Array.isArray(values.events)?values.events.filter(e=>e&&!e.cancelled).slice(0,24):[];
    return '<h3>Organizo sërish</h3><p>Përdor një aktivitet të mëparshëm vetëm si pikënisje. Data, vendi, ora dhe kapaciteti duhen konfirmuar përpara publikimit; asnjë pjesëmarrës nuk ftohet automatikisht.</p>'+
      (events.length?events.map(e=>'<article class="ilc-repeat"><strong>'+h(e.title)+'</strong><p>'+h(e.city)+' · '+h(e.kind)+'</p>'+
      button('repeat:'+e.id,'Përgatit draftin')+'</article>').join(''):'<p>Krijo fillimisht një aktivitet në panelin e organizatorit.</p>')+
      notice()+button('overview','Kthehu te zgjedhjet');
  };
  const togetherView=()=>'<h3>Bëjmë diçka bashkë</h3><p>Takime që përfundojnë me një rezultat konkret, jo vetëm bisedë.</p>'+
    [
      {id:'language',title:'Praktikë e gjuhës',goal:'Dy persona praktikojnë italisht dhe shqip',kind:'Bashkëpunim',conditions:'Aktivitet vullnetar me grup të vogël. Për të rritur.'},
      {id:'design',title:'Punëtori portofoli',goal:'Krijojmë një shembull pune në grup',kind:'Bashkëpunim',conditions:'Mos përdor punë të papaguar komerciale.'},
      {id:'football',title:'Sport me ekipe të përziera',goal:'Organizojmë ndeshje miqësore',kind:'Sport',conditions:'Aktivitet sportiv vullnetar, pa garanci pjesëmarrjeje.'}
    ].map(x=>'<article class="ilc-together"><strong>'+h(x.title)+'</strong><p>'+h(x.goal)+'</p>'+
    button('together:'+x.id,'Krijo draft aktiviteti')+'</article>').join('')+
    '<p class="ilc-muted">Draftet kërkojnë konfirmim dhe publikim manual nga organizatori.</p>'+notice()+button('overview','Kthehu te zgjedhjet');
  function markup(){
    const body=state.view==='cities'?citiesView():state.view==='interest'?interestView():state.view==='welcome'?firstView():state.view==='repeat'?repeatView():state.view==='together'?togetherView():overview();
    return '<div class="ilc-shade" data-ilc="close"></div><section class="ilc-sheet" role="dialog" aria-modal="true" aria-label="Lidhjet dhe aktivitetet demonstrative">'+
      '<header><span>ILLYRIAN · DEMO v1.7</span>'+button('close','✕ Mbyll')+'</header>'+body+'</section>';
  }
  function render(){
    if(!root)return;
    root.hidden=!state.open;
    if(state.open){
      root.innerHTML=markup();
      root.querySelector('.ilc-sheet header button')?.focus();
    }
  }
  function open(view){
    if(!root||state.open)return;
    opener=document.activeElement;
    inertSnapshot=['#screen','#navbar','.head','.statusbar','.homebar','.island'].map(sel=>document.querySelector('#phone > '+sel)).filter(Boolean).map(el=>({el,was:el.inert}));
    inertSnapshot.forEach(({el})=>{el.inert=true});
    state.open=true;
    state.view=view||'overview';
    state.notice='';
    render();
  }
  function close(){
    state.open=false;
    root.hidden=true;
    inertSnapshot.forEach(({el,was})=>{if(el.isConnected)el.inert=was});inertSnapshot=[];
    if(opener?.isConnected)opener.focus();
  }
  function draft(data){
    state.notice='';
    close();
    const evt=new CustomEvent('illyrian:plans:draft',{detail:{title:String(data.title||'').slice(0,90),
      kind:String(data.kind||'Bashkëpunim'),city:String(data.city||state.home),
      conditions:String(data.conditions||'').slice(0,240),source:String(data.source||'connections')}});
    window.dispatchEvent(evt);
  }
  function handle(action){
    if(action==='close')return close();
    if(action==='overview')state.view='overview';
    else if(action.startsWith('view:'))state.view=action.slice(5);
    else if(action==='clear-interest'){state.choice=null;persist();state.view='interest';state.notice='Interesi dhe disponueshmëria u hoqën.';}
    else if(action.startsWith('welcome:')){state.view='welcome';}
    else if(action.startsWith('repeat:')){
      const id=action.slice(7);
      const e=eventData().find(e=>e.id===id)||((Array.isArray(read(PLAN_KEY).events)?read(PLAN_KEY).events:[]).find(e=>e.id===id&&!e.cancelled));
      if(e){draft({title:e.title,city:e.city,kind:e.kind,conditions:e.conditions,source:'repeat'});return}
    } else if(action.startsWith('draft-topic:')){
      const t=TOPICS.find(x=>x.id===action.slice(12));
      const c=state.choice;
      if(t&&c&&c.topic===t.id&&Date.parse(c.expires)>Date.now()&&c.city===t.city&&t.count+1>=t.goal){
        draft({title:t.name,city:c.city,kind:t.kind,conditions:'Interesi paraprak: '+c.slot+'. Duhet të konfirmohet orari dhe kushtet me pjesëmarrësit.',source:'interest'});return
      }
    } else if(action.startsWith('together:')){
      const t=TOPICS.find(x=>x.id===action.slice(9));
      if(t){draft({title:t.name,kind:t.kind,city:state.home,conditions:'Aktivitet demonstrues me rezultat të vogël konkret. Koha dhe vendi kërkojnë konfirmim.',source:'together'});return}
    }
    render();
  }
  function onSubmit(form){
    const data=new FormData(form);
    if(form.id==='ilc-cities'){
      const a=String(data.get('home')),b=String(data.get('origin'));
      if(!CITIES.includes(a)||!CITIES.includes(b)){state.notice='Qytetet nuk njihen.';render();return}
      if(a===b){state.notice='Zgjidh dy qytete të ndryshme për këtë shembull.';render();return}
      state.home=a;state.origin=b;state.notice='Dy qytetet u ruajtën në pajisje.';persist();render();return;
    }
    if(form.id==='ilc-interest'){
      const id=String(data.get('topic')),topic=TOPICS.find(t=>t.id===id);
      const city=String(data.get('city')),slot=String(data.get('slot')),days=Number(data.get('days'));
      if(!topic||!CITIES.includes(city)||!topic.slots.includes(slot)||![3,7].includes(days)){state.notice='Zgjedhje të pavlefshme.';render();return}
      const expires=new Date(Date.now()+days*86400000).toISOString();
      state.choice={topic:id,city,slot,expires};
      state.notice='Interesi u ruajt vetëm në pajisje, me skadim.';
      persist();render();
    }
  }
  function sync(){
    const screen=document.querySelector('#screen');
    if(!screen)return;
    const isPlans=!!screen.querySelector('.v10-event-tabs')||/Plane që na bashkojnë|Planet e mia/i.test(screen.querySelector('h2')?.textContent||'');
    const exists=screen.querySelector('#ilc-entry');
    if(!isPlans){exists?.remove();return}
    if(exists)return;
    const entry=document.createElement('div');
    entry.id='ilc-entry';
    entry.innerHTML='<div><b>Lidhjet që krijohen në jetën reale</b><p>Dy vendet e mia · Hera e parë · Nga interesi te plani · Organizo sërish</p></div><button type="button" data-ilc-entry="1">Zbulo mundësitë →</button>';
    const point=screen.querySelector('[data-ilp-entry]')?.closest('.ilp-entry')||screen.querySelector('.v10-event-tabs')||screen.firstElementChild;
    point?.parentNode?.insertBefore(entry,point.nextSibling);
  }
  function init(){
    const phone=document.querySelector('#phone'),screen=document.querySelector('#screen');
    if(!phone||!screen)return;
    root=document.createElement('div');
    root.id='ilc-root';
    root.hidden=true;
    phone.appendChild(root);
    const style=document.createElement('style');
    style.textContent=`
      #phone #ilc-entry{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:12px 14px;padding:13px;background:var(--card,#fff);border:1px solid #e50c3760;border-radius:15px}
      #phone #ilc-entry b{font-size:12px}
      #phone #ilc-entry p,#phone #ilc-root p{font-size:11px;line-height:1.5}
      #phone #ilc-entry button,#phone #ilc-root button{min-height:44px;padding:10px;border:0;border-radius:11px;background:#e50c37;color:#fff;font-size:11px;font-weight:750;cursor:pointer}
      #phone #ilc-root[hidden]{display:none}
      #phone #ilc-root{position:absolute;inset:0;z-index:5500}
      #phone .ilc-shade{position:absolute;inset:0;background:#0b050add}
      #phone .ilc-sheet{position:absolute;inset:0;overflow:auto;overscroll-behavior:contain;box-sizing:border-box;padding:24px 15px 32px;background:var(--card,#fff);color:var(--ink,#1b0c16)}
      #phone .ilc-sheet header{display:flex;align-items:center;justify-content:space-between;gap:9px;margin-bottom:10px}
      #phone .ilc-sheet header span{font-size:10px;font-weight:900;color:#e50c37}
      #phone .ilc-sheet h2{font-size:19px;margin:6px 0}
      #phone .ilc-sheet h3{font-size:17px;margin:12px 0}
      #phone .ilc-sheet h4{font-size:14px;margin:13px 0}
      #phone .ilc-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:16px 0}
      #phone .ilc-grid button{display:grid;gap:6px;padding:13px 10px;background:var(--card2,#f4edf1);color:var(--ink,#170911);text-align:left}
      #phone .ilc-grid button span{font-size:20px}
      #phone .ilc-grid button strong{font-size:12px}
      #phone .ilc-grid button small{font-size:10px;color:var(--muted,#706570);font-weight:400}
      #phone #ilc-root article{border:1px solid #a4849b55;border-radius:13px;padding:11px;margin:10px 0;background:var(--card2,#faf6f8)}
      #phone #ilc-root article strong{font-size:13px}
      #phone #ilc-root label{display:block;margin:12px 0;font-size:12px;font-weight:800}
      #phone #ilc-root input:not([type="checkbox"]),#phone #ilc-root select{width:100%;box-sizing:border-box;margin-top:6px;padding:11px;border:1px solid #ac829e88;border-radius:10px;min-height:44px;color:var(--ink,#1b0c16);background:var(--card,#fff);font-size:12px}
      #phone #ilc-root .ilc-check{display:flex;align-items:center;gap:7px;font-size:11px;line-height:1.4;font-weight:500}
      #phone #ilc-root .ilc-check input{width:20px;height:20px;flex:none}
      #phone #ilc-root .ilc-note{background:#e50c3720;padding:10px;border-radius:9px}
      #phone #ilc-root .ilc-muted{color:var(--muted,#706570);font-size:10px}
      #phone #ilc-root .ilc-results{margin:10px 0}
      @media(max-width:340px){#phone .ilc-grid{grid-template-columns:1fr}#phone #ilc-entry{flex-wrap:wrap}}
    `;
    document.head.appendChild(style);
    document.addEventListener('click',e=>{
      const item=e.target.closest('[data-ilc-entry]');
      if(item){e.preventDefault();open();return}
    },true);
    root.addEventListener('click',e=>{
      const item=e.target.closest('[data-ilc]');
      if(item){e.preventDefault();handle(item.dataset.ilc);}
    });
    root.addEventListener('change',e=>{
      if(e.target.name==='topic'){
        const topic=TOPICS.find(t=>t.id===e.target.value);
        const select=root.querySelector('#ilc-interest select[name="slot"]');
        if(select&&topic)select.innerHTML=topic.slots.map(t=>'<option value="'+h(t)+'">'+h(t)+'</option>').join('');
      }
    });
    root.addEventListener('change',e=>{
      const item=e.target.closest('[data-ilc-first]');
      if(!item)return;
      state.welcome[item.dataset.ilcFirst]=!!item.checked;
      persist();
      state.notice=item.checked?'Shënimi privat u ruajt në pajisje. Organizatori nuk u njoftua.':'Shënimi privat u hoq.';
      const status=root.querySelector('.ilc-note[role="status"]');
      if(status)status.textContent=state.notice;
    });
    root.addEventListener('submit',e=>{e.preventDefault();onSubmit(e.target)});
    document.addEventListener('keydown',e=>{
      if(!state.open)return;
      if(e.key==='Escape'){e.preventDefault();close();return}
      if(e.key!=='Tab')return;
      const items=[...root.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled])')].filter(x=>x.getClientRects().length);
      if(!items.length)return;
      if(e.shiftKey&&(document.activeElement===items[0]||!root.contains(document.activeElement))){e.preventDefault();items.at(-1).focus();}
      else if(!e.shiftKey&&(document.activeElement===items.at(-1)||!root.contains(document.activeElement))){e.preventDefault();items[0].focus();}
    },true);
    new MutationObserver(()=>{if(!state.open)queueMicrotask(sync)}).observe(screen,{childList:true,subtree:false});
    queueMicrotask(sync);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
