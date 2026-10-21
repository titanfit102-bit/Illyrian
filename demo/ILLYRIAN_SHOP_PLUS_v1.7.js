/* ILLYRIAN Shop Plus v1.7 — Phase 5 independent demo: advanced catalog, filters, stock, requests, transparent commissions. */
(function installIllyrianShopPlus() {
 'use strict';
 const KEY='illyrian_demo_v17_shop_plus';
 const BASIC_KEY='illyrian_demo_v17_shop';
 const TYPES=['Të gjitha','Produkte','Makina','Banesa me qira','Shërbime'];
 const CITIES=['Të gjitha','Tiranë','Durrës','Shkodër','Vlorë','Elbasan','Prishtinë'];
 const SEED=[
  {id:'k1',type:'Produkte',name:'Kafe espresso 250 g',sku:'espresso-250g',store:'Market Arbër',city:'Tiranë',price:5.5,quantity:19,details:'Paketim 250 g, kafe e bluar, shembull.',promoted:false},
  {id:'k2',type:'Produkte',name:'Kafe espresso 250 g',sku:'espresso-250g',store:'Shije Shqiptare',city:'Tiranë',price:5.2,quantity:7,details:'Paketim 250 g, ofertë demonstrative.',promoted:true},
  {id:'k3',type:'Produkte',name:'Kafe espresso 250 g',sku:'espresso-250g',store:'Mini Market Bora',city:'Durrës',price:5.8,quantity:0,details:'Produkti demonstrues aktualisht pa stok.',promoted:false},
  {id:'k4',type:'Produkte',name:'Atlete sportive',sku:'atlete-standarde',store:'Urban Steps',city:'Tiranë',price:48,quantity:5,details:'Atlete përditshmërie; madhësitë konfirmohen te shitësi.',promoted:false},
  {id:'k5',type:'Produkte',name:'Mjaltë mali 500 g',sku:'mjalte-500g',store:'Bletaria Drini',city:'Tiranë',price:10,quantity:12,details:'Kavanoz 500 g, ilustrim.',promoted:false},
  {id:'v1',type:'Makina',name:'Volkswagen Golf 7',sku:'',store:'Auto Durrësi',city:'Durrës',price:9800,year:2017,mileage:142000,fuel:'Naftë',details:'1.6 TDI, të dhëna të sajuara.',promoted:false},
  {id:'v2',type:'Makina',name:'Toyota Yaris Hybrid',sku:'',store:'Auto Tirana',city:'Tiranë',price:11600,year:2019,mileage:91000,fuel:'Hibrid',details:'Automjet shembull, pa dokumentacion real.',promoted:true},
  {id:'v3',type:'Makina',name:'Fiat Panda',sku:'',store:'Auto Shkodra',city:'Shkodër',price:4200,year:2015,mileage:165000,fuel:'Benzinë',details:'Automjet demonstrativ.',promoted:false},
  {id:'h1',type:'Banesa me qira',name:'Apartament 2+1',sku:'',store:'Banesa Tirana',city:'Tiranë',price:540,area:82,rooms:'2+1',period:'muaj',details:'Komuna e Parisit, karakteristikat janë ilustrative.',promoted:false},
  {id:'h2',type:'Banesa me qira',name:'Garsoniere pranë detit',sku:'',store:'Qira Durrës',city:'Durrës',price:290,area:38,rooms:'Studio',period:'muaj',details:'Qira demonstrative, jo ofertë e vlefshme.',promoted:false},
  {id:'h3',type:'Banesa me qira',name:'Apartament familjar',sku:'',store:'Banesa Vlora',city:'Vlorë',price:440,area:70,rooms:'1+1',period:'muaj',details:'Vetëm shembull.',promoted:false},
  {id:'s1',type:'Shërbime',name:'Pastrim banese',sku:'',store:'Shërbime Elbasani',city:'Elbasan',price:45,details:'Çmimi orientues demonstrues.',promoted:false}
 ];
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const read=(key)=>{try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return{}}};
 const saved=read(KEY);
 const filterList=(arr,max)=>Array.isArray(arr)?arr.filter(x=>x&&typeof x==='object'&&!Array.isArray(x)).slice(0,max):[];
 const state={
  items:filterList(saved.items,30),needs:filterList(saved.needs,25),answers:filterList(saved.answers,50),
  flags:filterList(saved.flags,40),sampleOrders:filterList(saved.sampleOrders,20),
  tab:'catalog',open:false,query:'',type:'Të gjitha',city:'Të gjitha',min:'',max:'',stockOnly:false,
  yearMin:'',maxKm:'',areaMin:'',sort:'relevance',selected:'k1',shop:'',
  needIndex:null,editId:null,notice:''
 };
 let overlay=null,previous=null,inertBefore=[],trigger=null;
 const all=()=>[...state.items,...SEED];
 const numeric=(v,fallback=0)=>Number.isFinite(+v)?Number(v):fallback;
 const money=v=>numeric(v).toLocaleString('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({items:state.items,needs:state.needs,answers:state.answers,flags:state.flags,sampleOrders:state.sampleOrders}));return true}catch{state.notice='Nuk u ruajt në këtë pajisje. Provo të heqësh listime të vjetra.';return false}};
 const btn=(act,text,extra='')=>'<button type="button" data-isp="'+esc(act)+'" '+extra+'>'+esc(text)+'</button>';
 const pill=(value,active)=>'<button type="button" data-isp="type:'+esc(value)+'" aria-pressed="'+(active?'true':'false')+'" class="'+(active?'chosen':'')+'">'+esc(value)+'</button>';
 const period=p=>p.type==='Banesa me qira'?'/'+esc(p.period||'muaj'):'';
 const price=p=>money(p.price)+period(p);
 const safeItems=()=>{
  const min=state.min===''?null:numeric(state.min,NaN);
  const max=state.max===''?null:numeric(state.max,NaN);
  let arr=all().filter(p=>{
   const q=state.query.trim().toLocaleLowerCase('sq');
   const text=[p.name,p.store,p.city,p.type,p.details].join(' ').toLocaleLowerCase('sq');
   return (!q||q.split(/\s+/).every(x=>text.includes(x)))&&
    (state.type==='Të gjitha'||p.type===state.type)&&
    (state.city==='Të gjitha'||p.city===state.city)&&
    (!state.shop||p.store===state.shop)&&
    (min===null||p.price>=min)&&(max===null||p.price<=max)&&
    (!state.stockOnly||p.type!=='Produkte'||numeric(p.quantity)>0)&&
    (state.yearMin===''||p.type!=='Makina'||numeric(p.year)>=numeric(state.yearMin))&&
    (state.maxKm===''||p.type!=='Makina'||numeric(p.mileage)<=numeric(state.maxKm))&&
    (state.areaMin===''||p.type!=='Banesa me qira'||numeric(p.area)>=numeric(state.areaMin))
  });
  if(state.sort==='lowest')arr=arr.sort((a,b)=>a.price-b.price);
  if(state.sort==='highest')arr=arr.sort((a,b)=>b.price-a.price);
  if(state.sort==='name')arr=arr.sort((a,b)=>a.name.localeCompare(b.name,'sq'));
  return arr;
 };
 const productSets=()=>{
  const groups=new Map();
  for(const p of safeItems().filter(x=>x.type==='Produkte'&&x.sku)){
    if(!groups.has(p.sku))groups.set(p.sku,[]);
    groups.get(p.sku).push(p);
  }
  return [...groups.entries()].filter(([_,items])=>items.length>1).map(([sku,items])=>({sku,items:items.sort((a,b)=>a.price-b.price)}));
 };
 const chip=p=>(p.promoted?'<span class="isp-sponsored">PROMOVUAR · DEMO</span>':'');
 const card=p=>'<article class="isp-card"><div class="isp-typeline"><span>'+esc(p.type)+'</span>'+chip(p)+'</div><h4>'+esc(p.name)+'</h4>'+
  '<strong>'+price(p)+'</strong><p>'+esc(p.store)+' · '+esc(p.city)+'</p>'+
  (p.type==='Produkte'?'<p>Inventari: '+(numeric(p.quantity)>0?numeric(p.quantity)+' copë (demo)':'Pa stok (demo)')+'</p>':
   p.type==='Makina'?'<p>Viti '+esc(p.year||'–')+' · '+esc(p.mileage||'–')+' km · '+esc(p.fuel||'')+'</p>':
   p.type==='Banesa me qira'?'<p>'+esc(p.rooms||'–')+' · '+esc(p.area||'–')+' m² · '+esc(p.period||'muaj')+'</p>':'')+
  btn('item:'+p.id,'Detajet dhe shitësi')+
  '<button type="button" data-isp="store:'+esc(p.store)+'">Shiko dyqanin</button>'+
  (p.owned?btn('edit:'+p.id,'Redakto listimin'):'')+
  '</article>';
 const filters=()=>'<form id="isp-filters"><div class="isp-fields">'+
   '<label>Kërko<input name="q" maxlength="90" type="search" placeholder="Produkt, dyqan, makinë..." value="'+esc(state.query)+'"></label>'+
   '<label>Qyteti<select name="city">'+CITIES.map(x=>'<option '+(x===state.city?'selected ':'')+'value="'+esc(x)+'">'+esc(x)+'</option>').join('')+'</select></label>'+
   '<label>Çmim min. €<input name="min" inputmode="decimal" type="number" min="0" max="10000000" value="'+esc(state.min)+'"></label>'+
   '<label>Çmim max. €<input name="max" inputmode="decimal" type="number" min="0" max="10000000" value="'+esc(state.max)+'"></label>'+
   '<label>Renditja<select name="sort">'+[['relevance','Relevanca'],['lowest','Më i liri'],['highest','Më i shtrenjti'],['name','Emri']].map(([a,b])=>'<option '+(a===state.sort?'selected ':'')+'value="'+a+'">'+b+'</option>').join('')+'</select></label>'+
   '<label>Viti i makinës nga<input name="year" type="number" min="1950" max="2030" value="'+esc(state.yearMin)+'" placeholder="2017"></label>'+
   '<label>Maks. kilometra<input name="km" type="number" min="0" max="2000000" value="'+esc(state.maxKm)+'" placeholder="100000"></label>'+
   '<label>Min. m² për qira<input name="area" type="number" min="0" max="10000" value="'+esc(state.areaMin)+'" placeholder="50"></label>'+
   '</div><label class="isp-check"><input name="stock" type="checkbox" '+(state.stockOnly?'checked':'')+'> Vetëm produkte me stok</label>'+
   '<div class="isp-actions"><button type="submit">Apliko filtrat</button>'+btn('clear-filters','Pastro')+'</div></form>';
 const catalog=()=>{
  const result=safeItems(),sets=productSets();
  return '<div class="isp-hero"><b>ILLYRIAN SHOP · KËRKIM I AVANCUAR</b><h2>Gjej produktin, jo vetëm një reklamë.</h2><p>Krahaso dyqanet dhe shiko karakteristikat e ofertave. Çdo listim është demonstrues.</p></div>'+
   '<nav class="isp-kinds">'+TYPES.map(x=>pill(x,x===state.type)).join('')+'</nav>'+filters()+
   (state.shop?'<p class="isp-active">Dyqani: '+esc(state.shop)+' '+btn('clear-store','Hiq filtrin')+'</p>':'')+
   '<div class="isp-rowhead"><h3>'+result.length+' oferta</h3><span>'+new Set(result.map(x=>x.store)).size+' shitës/dyqane</span></div>'+
   (sets.length?'<section class="isp-compare"><h3>I njëjti produkt, disa dyqane</h3>'+sets.map(g=>
     '<article><b>'+esc(g.items[0].name)+'</b><p>Shembull me të njëjtin produkt/SKU. Çmimi nuk përfshin transport ose taksa.</p>'+
     g.items.map(i=>'<div class="isp-offer"><span>'+esc(i.store)+' · '+esc(i.city)+'</span><b>'+money(i.price)+'</b><small>'+(numeric(i.quantity)>0?'Në stok':'Pa stok')+'</small></div>').join('')+
     '</article>').join('')+'</section>':'')+
   (result.length?'<div class="isp-cards">'+result.map(card).join('')+'</div>':'<div class="isp-empty">Nuk u gjet asnjë ofertë. Ndrysho filtrat.</div>')+
   btn('create','+ Publiko ofertën tënde')+
   '<p class="isp-muted">Nuk kemi bërë verifikim të stokut, çmimeve, shitësve ose produkteve: të gjitha janë shembuj.</p>';
 };
 const itemView=()=>{
  const p=all().find(x=>x.id===state.selected);
  if(!p)return '<p>Listimi nuk ekziston.</p>'+btn('catalog','Kthehu');
  return btn('catalog','← Kthehu te rezultatet')+'<article class="isp-card isp-focus">'+chip(p)+'<h3>'+esc(p.name)+'</h3><strong>'+price(p)+'</strong>'+
   '<p>'+esc(p.details||'Oferta është demonstrative.')+'</p><p>'+esc(p.store)+' · '+esc(p.city)+'</p>'+
   (p.type==='Makina'?'<p>Viti: '+esc(p.year)+' · Kilometra: '+esc(p.mileage)+' · Karburanti: '+esc(p.fuel)+'</p>':
   p.type==='Banesa me qira'?'<p>Sipërfaqe: '+esc(p.area)+' m² · '+esc(p.rooms)+' · Qira për '+esc(p.period||'muaj')+'</p>':
   p.type==='Produkte'?'<p>Gjendja: '+(numeric(p.quantity)>0?'Në stok, '+numeric(p.quantity)+' copë':'Pa stok')+'</p>':'')+
   btn('store:'+p.store,'Katalogu i dyqanit')+
   btn('report:'+p.id,'Raporto listimin')+
   (p.owned?btn('edit:'+p.id,'Ndrysho listimin'):'')+
   '</article><p class="isp-muted">Asnjë pagesë ose kontakt real. Makina dhe banesa nuk rezervohen në këtë demo.</p>';
 };
 const storesView=()=>{
  const sellers=[...new Set(all().map(x=>x.store))].sort((a,b)=>a.localeCompare(b,'sq'));
  return '<h3>Dyqanet e vogla</h3><p>Çdo dyqan ka katalogun e ofertave të veta. Inventari këtu është vetëm provë.</p>'+
  sellers.map(x=>{
    const rows=all().filter(p=>p.store===x),cities=[...new Set(rows.map(p=>p.city))].join(', ');
    return '<article class="isp-card"><h4>'+esc(x)+'</h4><p>'+esc(cities)+' · '+rows.length+' listime demonstrative</p>'+
     '<p>'+rows.filter(p=>p.type==='Produkte'&&numeric(p.quantity)>0).length+' produkte në stok (shembull)</p>'+btn('store:'+x,'Hap katalogun')+'</article>'
  }).join('');
 };
 const storeView=()=>{
  const rows=all().filter(p=>p.store===state.shop);
  return btn('stores','← Të gjitha dyqanet')+'<h3>'+esc(state.shop)+'</h3><p>'+rows.length+' oferta demonstrative; identiteti tregtar nuk është verifikuar.</p>'+
    rows.map(card).join('')+
    '<p class="isp-muted">Ofertat e sponsorizuara janë të etiketuara. Nuk kemi vlerësim të besueshmërisë së shitësit.</p>';
 };
 const create=()=>{
  const editing=state.editId&&state.items.find(p=>p.id===state.editId);
  const p=editing||{type:'Produkte',name:'',store:'',city:'Tiranë',price:'',quantity:1,year:'',mileage:'',area:'',rooms:'',period:'muaj',details:''};
  return '<h3>'+(editing?'Redakto ofertën':'Publiko ofertë në demo')+'</h3><p>Produkte, makina, banesa dhe shërbime. Listimet ruhen vetëm në pajisjen tënde.</p>'+
  '<form id="isp-create" class="isp-fields">'+
  '<label>Kategoria<select name="type">'+TYPES.slice(1).map(x=>'<option value="'+esc(x)+'" '+(p.type===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></label>'+
  '<label>Emri<input name="name" minlength="4" maxlength="90" required value="'+esc(p.name)+'"></label>'+
  '<label>Dyqani / shitësi<input name="store" minlength="2" maxlength="70" required value="'+esc(p.store)+'"></label>'+
  '<label>Qyteti<select name="city">'+CITIES.slice(1).map(x=>'<option value="'+esc(x)+'" '+(p.city===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></label>'+
  '<label>Çmimi €<input name="price" type="number" min=".5" max="10000000" step=".01" value="'+esc(p.price)+'" required></label>'+
  '<label>Inventari produkt (copë)<input name="quantity" type="number" min="0" max="10000" value="'+esc(p.quantity??1)+'"></label>'+
  '<label>Viti i makinës<input name="year" type="number" min="1950" max="2030" value="'+esc(p.year||'')+'"></label>'+
  '<label>Kilometrat e makinës<input name="mileage" type="number" min="0" max="2000000" value="'+esc(p.mileage||'')+'"></label>'+
  '<label>Sipërfaqe banese (m²)<input name="area" type="number" min="1" max="10000" value="'+esc(p.area||'')+'"></label>'+
  '<label>Lloji i banesës<input name="rooms" maxlength="30" value="'+esc(p.rooms||'')+'" placeholder="2+1"></label>'+
  '<label>Periudha e qirasë<select name="period"><option value="muaj" '+(p.period==="javë"?'':'selected')+'>Për muaj</option><option value="javë" '+(p.period==="javë"?'selected':'')+'>Për javë</option></select></label>'+
  '<label class="isp-span">Përshkrimi<textarea name="details" maxlength="450" rows="3">'+esc(p.details||'')+'</textarea></label>'+
  '<div class="isp-span"><button type="submit">'+(editing?'Ruaj ndryshimet':'Publiko në demo')+'</button></div></form>'+
  '<p class="isp-muted">Nuk ruhet asnjë dokument identiteti, numër telefoni, pagesë ose adresë e saktë.</p>';
 };
 const board=()=>{
  const active=state.needs.filter(n=>Date.parse(n.expires)>Date.now()).slice().reverse();
  return '<h3>“Kërkoj…” — kërkesat e komunitetit</h3><p>Përdoruesi përshkruan çfarë kërkon; dyqanet përgjigjen vetëm në këtë simulim. Pa kontakt real.</p>'+
   '<form id="isp-need" class="isp-fields">'+
   '<label>Kërkoj<input name="title" minlength="5" maxlength="90" required placeholder="P.sh. biçikletë për qytet"></label>'+
   '<label>Lloji<select name="type">'+TYPES.slice(1).map(x=>'<option>'+esc(x)+'</option>').join('')+'</select></label>'+
   '<label>Qyteti<select name="city">'+CITIES.slice(1).map(x=>'<option>'+esc(x)+'</option>').join('')+'</select></label>'+
   '<label>Buxheti maksimal €<input name="budget" type="number" min="1" max="10000000" required></label>'+
   '<label>Afati<select name="days"><option value="7">7 ditë</option><option value="14">14 ditë</option><option value="30">30 ditë</option></select></label>'+
   '<label class="isp-span">Detajet<textarea name="details" rows="2" maxlength="240" placeholder="Karakteristikat e kërkuara"></textarea></label>'+
   '<div class="isp-span"><button type="submit">Publiko kërkesën në demo</button></div></form>'+
   (active.length?active.map(n=>'<article class="isp-card"><h4>'+esc(n.title)+'</h4><p>'+esc(n.type)+' · '+esc(n.city)+' · buxheti '+money(n.budget)+'</p>'+
    '<p>'+esc(n.details||'')+'</p><small>Skadon: '+esc(n.expires.slice(0,10))+'</small>'+
    btn('respond:'+n.id,'Përgjigju si dyqan (demo)')+(state.answers.filter(a=>a.needId===n.id).slice(-2).map(a=>'<p class="isp-reply">Përgjigje demo: '+esc(a.text)+'</p>').join(''))+
    (n.owned?btn('remove-need:'+n.id,'Fshi kërkesën'):'')+'</article>').join(''):'<p class="isp-empty">Ende pa kërkesa lokale. Publiko një shembull.</p>')+
   '<p class="isp-muted">Kërkesat nuk dërgohen te shitësit e vërtetë dhe skadojnë automatikisht.</p>';
 };
 const moderation=()=>{
  return '<h3>Raportime dhe etiketa të promovimit</h3><p>Përmbajtja e reklamuar duhet të shënohet; raportimet janë prova lokale.</p>'+
   '<div class="isp-hero"><b>TRANSPARENCË</b><p>“PROMOVUAR · DEMO” shënon listimet e sponsorizuara fiktive. Në produktin real do të kërkohet politikë reklamash, raportime, shqyrtim dhe apelim.</p></div>'+
   '<p>Raportime lokale: '+state.flags.length+'</p>'+
   (state.flags.length?state.flags.slice(-15).reverse().map(f=>'<article class="isp-card"><p><b>'+esc(f.target)+'</b> · '+esc(f.reason)+'</p><small>Në shqyrtim (simulim, jo moderator real)</small></article>').join(''):'<p class="isp-empty">Asnjë raportim demonstrues.</p>');
 };
 const checkout=()=>{
  const product=all().find(p=>p.type==='Produkte'&&numeric(p.quantity)>0);
  const v=product?.price||100,fee=+(v*.05).toFixed(2);
  return '<h3>Porosia, kthimi dhe komisioni — shembull</h3>'+
   '<article class="isp-card"><h4>Rrjedhë ilustruese</h4>'+
   '<p>Blerësi bën porosinë → shitësi konfirmon stokun → dërgesa → dorëzim → mundësi për ankesë/kthim.</p>'+
   '<p><b>Vlera shembull:</b> '+money(v)+'</p>'+
   '<p><b>Komision ilustrues 5%:</b> '+money(fee)+'</p>'+
   '<p><b>Te shitësi, përpara kostove/taksave:</b> '+money(v-fee)+'</p>'+
   btn('sample-order','Simulo porosinë (pa pagesë)')+
   '</article>'+
   (state.sampleOrders.slice(-5).reverse().map(o=>'<article class="isp-card"><p>Porosia demo '+esc(o.id)+' · '+esc(o.status)+'</p>'+
   btn('sample-cancel:'+o.id,'Anulo / kërko kthim')+
   '</article>').join(''))+
   '<p class="isp-muted">5% nuk është tarifë e miratuar. Nuk ka transaksione, faturë, dërgesë, identitet apo rimbursim real. Ligjet dhe kostot duhen verifikuar përpara lansimit.</p>';
 };
 const respond=()=>{
  const n=state.needs.find(x=>x.id===state.needIndex);
  if(!n)return '<p>Kërkesa nuk u gjet.</p>'+btn('needs','Kthehu');
  return '<h3>Përgjigje për: '+esc(n.title)+'</h3><p>Buxheti: '+money(n.budget)+' · '+esc(n.city)+'</p>'+
   '<form id="isp-answer"><label>Mesazhi demonstrues<textarea name="text" maxlength="180" minlength="5" required placeholder="P.sh. Dyqani ka një alternativë."></textarea></label><button type="submit">Ruaj përgjigjen në demo</button></form>'+
   '<p>Ky mesazh nuk u dërgohet blerësve ose dyqaneve reale.</p>';
 };
 const report=()=>{
  const x=all().find(p=>p.id===state.selected);
  return '<h3>Raporto listimin</h3><p>'+esc(x?.name||'Listimi demonstrues')+'</p>'+
  '<form id="isp-report"><label>Arsyeja<select name="reason"><option>Informacion i pasaktë</option><option>Mashtrim i dyshuar</option><option>Listim i dyfishuar</option><option>Përmbajtje e papërshtatshme</option></select></label>'+
  '<label>Përshkrim opsional<textarea name="detail" maxlength="180"></textarea></label>'+
  '<button type="submit">Ruaj raportimin (demo)</button></form>';
 };
 const page=()=>state.tab==='catalog'?catalog():state.tab==='stores'?(state.shop?storeView():storesView()):
  state.tab==='item'?itemView():state.tab==='create'?create():state.tab==='needs'?board():
  state.tab==='respond'?respond():state.tab==='report'?report():state.tab==='moderation'?moderation():checkout();
 const render=()=>{if(!overlay||!state.open)return;
  overlay.innerHTML='<div class="isp-shade" data-isp="close"></div><section class="isp-panel" role="dialog" aria-modal="true" aria-label="ILLYRIAN Shop i avancuar">'+
  '<header><div><small>ILLYRIAN · DEMO v1.7</small><h2>Shop i avancuar</h2></div>'+btn('close','✕ Mbyll')+'</header>'+
  '<nav class="isp-nav">'+[['catalog','Kërko'],['stores','Dyqanet'],['needs','Kërkoj…'],['checkout','Porositë'],['moderation','Raportime']].map(([a,b])=>btn('tab:'+a,b,state.tab===a?'aria-current="page"':'')).join('')+'</nav>'+
  (state.notice?'<p class="isp-notice" role="status">'+esc(state.notice)+'</p>':'')+
  page()+'<footer>Të dhëna fiktive · Nuk ka pagesa, rezervime, dërgesa ose kontakte reale.</footer></section>';
  overlay.querySelector('header button')?.focus();
 };
 const modalBackground=()=>{
  const phone=document.querySelector('#phone');if(!phone)return [];
  return ['#screen','#navbar','.head','#illyrian-shop-layer'].map(x=>phone.querySelector(':scope > '+x)).filter(Boolean);
 };
 const open=()=>{
  if(state.open)return;
  previous=document.activeElement;
  state.open=true;state.notice='';
  const phone=document.querySelector('#phone');if(!phone)return;
  overlay=document.createElement('div');overlay.id='isp-root';phone.appendChild(overlay);
  inertBefore=modalBackground().filter(el=>el!==overlay).map(el=>({el,was:el.inert}));
  inertBefore.forEach(({el})=>el.inert=true);
  state.tab='catalog';render();
 };
 const close=()=>{
  state.open=false;overlay?.remove();overlay=null;
  inertBefore.forEach(({el,was})=>{if(el.isConnected)el.inert=was});inertBefore=[];
  if(previous?.isConnected)previous.focus();
 };
 const message=m=>{state.notice=m;save();render()};
 const action=act=>{
  if(act==='close')return close();
  if(act.startsWith('tab:')){state.tab=act.slice(4);state.shop='';state.notice='';render();return}
  if(act.startsWith('type:')){state.type=act.slice(5);state.notice='';render();return}
  if(act==='clear-filters'){state.query='';state.type='Të gjitha';state.city='Të gjitha';state.min='';state.max='';state.stockOnly=false;state.yearMin='';state.maxKm='';state.areaMin='';state.sort='relevance';state.shop='';render();return}
  if(act==='catalog'){state.tab='catalog';state.shop='';state.notice='';render();return}
  if(act==='stores'){state.tab='stores';state.shop='';render();return}
  if(act==='needs'){state.tab='needs';render();return}
  if(act==='clear-store'){state.shop='';render();return}
  if(act.startsWith('store:')){state.shop=act.slice(6);state.tab='stores';render();return}
  if(act.startsWith('item:')){state.selected=act.slice(5);state.tab='item';render();return}
  if(act.startsWith('report:')){state.selected=act.slice(7);state.tab='report';render();return}
  if(act.startsWith('edit:')){const id=act.slice(5);if(!state.items.some(p=>p.id===id&&p.owned))return;state.editId=id;state.tab='create';render();return}
  if(act==='create'){state.editId=null;state.tab='create';render();return}
  if(act.startsWith('respond:')){state.needIndex=act.slice(8);state.tab='respond';render();return}
  if(act.startsWith('remove-need:')){const id=act.slice(12);state.needs=state.needs.filter(n=>n.id!==id||!n.owned);return message('Kërkesa u fshi lokalisht.')}
  if(act==='sample-order'){const i={id:'D'+Date.now().toString(36),status:'E krijuar në demo'};state.sampleOrders.push(i);state.sampleOrders=state.sampleOrders.slice(-20);return message('Porosia u regjistrua vetëm në simulim.')}
  if(act.startsWith('sample-cancel:')){const id=act.slice(14);const order=state.sampleOrders.find(o=>o.id===id);if(order)order.status='Kërkesë anulimi/kthimi (demo)';return message('Kërkesa e kthimit u regjistrua; nuk ka rimbursim real.')}
 };
 function submit(form){
  const d=new FormData(form),v=k=>String(d.get(k)||'').trim(),num=k=>d.get(k)===''?null:Number(d.get(k));
  if(form.id==='isp-filters'){
   const min=num('min'),max=num('max'),year=num('year'),km=num('km'),area=num('area');
   if([min,max,year,km,area].some(x=>x!==null&&(!Number.isFinite(x)||x<0))||(min!==null&&max!==null&&min>max)){
    state.notice='Kontrollo kufijtë e çmimit dhe filtrat numerikë.';render();return}
   if(!CITIES.includes(v('city'))||!['relevance','lowest','highest','name'].includes(v('sort')))return;
   state.query=v('q').slice(0,90);state.city=v('city');state.min=min===null?'':String(min);state.max=max===null?'':String(max);
   state.sort=v('sort');state.yearMin=year===null?'':String(year);state.maxKm=km===null?'':String(km);state.areaMin=area===null?'':String(area);
   state.stockOnly=d.get('stock')!==null;state.notice='';render();return;
  }
  if(form.id==='isp-create'){
   const kind=v('type'),name=v('name'),store=v('store'),city=v('city'),p=num('price'),q=num('quantity'),year=num('year'),km=num('mileage'),area=num('area');
   if(!TYPES.slice(1).includes(kind)||!CITIES.slice(1).includes(city)||name.length<4||name.length>90||store.length<2||store.length>70||p===null||!Number.isFinite(p)||p<.5||p>10000000){
    state.notice='Plotëso saktë emrin, dyqanin, qytetin dhe çmimin.';render();return}
   if(kind==='Produkte'&&(q===null||!Number.isInteger(q)||q<0||q>10000)){state.notice='Inventari duhet të jetë 0–10000 copë.';render();return}
   if(kind==='Makina'&&(year===null||!Number.isInteger(year)||year<1950||year>2030||km===null||!Number.isInteger(km)||km<0||km>2000000)){state.notice='Vendos vitin dhe kilometrat e makinës.';render();return}
   if(kind==='Banesa me qira'&&(area===null||!Number.isFinite(area)||area<1||area>10000)){state.notice='Vendos sipërfaqen e banesës.';render();return}
   const old=state.items.find(i=>i.id===state.editId&&i.owned);
   if(!old&&state.items.length>=30){state.notice='Kufiri i listimeve lokale u arrit.';render();return}
   const item={id:old?.id||'own'+Date.now().toString(36),owned:true,type:kind,name,store,city,price:p,details:v('details').slice(0,450),quantity:kind==='Produkte'?q:null,
    year:kind==='Makina'?year:null,mileage:kind==='Makina'?km:null,area:kind==='Banesa me qira'?area:null,rooms:v('rooms').slice(0,30),
    period:['muaj','javë'].includes(v('period'))?v('period'):'muaj',sku:'',promoted:false};
   if(old)Object.assign(old,item);else state.items.unshift(item);
   state.tab='item';state.selected=item.id;state.editId=null;message('Listimi u ruajt vetëm në pajisjen tënde.');return;
  }
  if(form.id==='isp-need'){
   const type=v('type'),city=v('city'),title=v('title'),budget=num('budget'),days=num('days');
   if(!TYPES.slice(1).includes(type)||!CITIES.slice(1).includes(city)||title.length<5||title.length>90||budget===null||!Number.isFinite(budget)||budget<1||budget>10000000||![7,14,30].includes(days)){
    state.notice='Kontrollo kërkesën, qytetin, buxhetin dhe afatin.';render();return}
   if(state.needs.length>=25){state.notice='Kufiri lokal i kërkesave u arrit.';render();return}
   state.needs.push({id:'n'+Date.now().toString(36),owned:true,type,city,title,budget,details:v('details').slice(0,240),expires:new Date(Date.now()+days*86400000).toISOString()});
   state.tab='needs';message('Kërkesa u regjistrua vetëm në këtë pajisje.');return;
  }
  if(form.id==='isp-answer'){
   const need=state.needs.find(n=>n.id===state.needIndex),txt=v('text').slice(0,180);
   if(!need||Date.parse(need.expires)<Date.now()||txt.length<5||state.answers.length>=50){state.notice='Kërkesa ose mesazhi nuk është i vlefshëm.';render();return}
   state.answers.push({needId:need.id,text:txt});state.tab='needs';message('Përgjigjja u ruajt vetëm në demo.');return;
  }
  if(form.id==='isp-report'){
   const allowed=['Informacion i pasaktë','Mashtrim i dyshuar','Listim i dyfishuar','Përmbajtje e papërshtatshme'],reason=v('reason');
   if(!allowed.includes(reason)||state.flags.length>=40)return;
   state.flags.push({target:all().find(p=>p.id===state.selected)?.name||'Listim',reason,detail:v('detail').slice(0,180)});
   state.tab='moderation';message('Raportimi është provë lokale; asnjë moderator nuk u njoftua.');return;
  }
 }
 function inject(){
  const el=document.querySelector('#illyrian-shop-layer');
  if(!el||state.open||el.querySelector('[data-isp-open]'))return;
  const actions=el.querySelector('.ils-actions')||el.querySelector('.ils-splash');
  if(!actions)return;
  const newBtn=document.createElement('button');
  newBtn.type='button';newBtn.className='ils-btn';newBtn.dataset.ispOpen='1';newBtn.textContent='Kërkim i avancuar · Katalogë · Kërkoj…';
  actions.appendChild(newBtn);
 }
 function init(){
  const phone=document.querySelector('#phone');if(!phone)return;
  document.addEventListener('click',e=>{const el=e.target.closest('[data-isp-open]');if(el){e.preventDefault();e.stopPropagation();open()}},true);
  document.addEventListener('keydown',e=>{
   if(!state.open)return;
   if(e.key==='Escape'){e.preventDefault();close();return}
   if(e.key!=='Tab'||!overlay)return;
   const list=[...overlay.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')].filter(x=>x.getClientRects().length>0);
   if(!list.length)return;
   if(e.shiftKey&&(document.activeElement===list[0]||!overlay.contains(document.activeElement))){e.preventDefault();list.at(-1).focus()}
   else if(!e.shiftKey&&(document.activeElement===list.at(-1)||!overlay.contains(document.activeElement))){e.preventDefault();list[0].focus()}
  },true);
  document.addEventListener('focusin',e=>{
   if(state.open&&!overlay?.contains(e.target))overlay.querySelector('header button')?.focus();
  },true);
  new MutationObserver(()=>{if(!state.open)queueMicrotask(inject)}).observe(phone,{subtree:true,childList:true});
  phone.addEventListener('click',e=>{
   if(!state.open)return;
   const b=e.target.closest('[data-isp]');if(b&&overlay?.contains(b)){e.preventDefault();action(b.dataset.isp)}
  });
  phone.addEventListener('submit',e=>{
   if(!state.open||!overlay?.contains(e.target))return;
   e.preventDefault();submit(e.target);
  });
  queueMicrotask(inject);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
