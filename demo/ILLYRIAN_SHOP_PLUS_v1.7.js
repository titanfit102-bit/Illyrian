/* ILLYRIAN Shop Plus v1.7 — Phase 5 independent demo: advanced catalog, filters, stock, requests, transparent commissions. */
(function installIllyrianShopPlus() {
 'use strict';
 const KEY='illyrian_demo_v17_shop_plus';
 const BASIC_KEY='illyrian_demo_v17_shop';
 const TYPES=['Të gjitha','Produkte','Makina','Prona','Banesa me qira','Shërbime','Punë'];
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
  {id:'property-plus',type:'Prona',name:'Ambient për shitje',store:'Hapësira Demo',city:'Prishtinë',price:78000,area:65,rooms:'1+1',details:'Pronë fiktive në shitje; pa rezervim ose pagesë.',promoted:false},
  {id:'job-plus',type:'Punë',name:'Kërkohet shitës në dyqan',store:'Tregti Demo',city:'Tiranë',price:0,details:'Kërkim punonjësi vetëm për demonstrim. Paga dhe kushtet nuk janë konfirmuar.',promoted:false},
  {id:'s1',type:'Shërbime',name:'Pastrim banese',sku:'',store:'Shërbime Elbasani',city:'Elbasan',price:45,details:'Çmimi orientues demonstrues.',promoted:false}
 ];
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // Preserve the initial persisted version for cross-tab optimistic checks.
 const initialRaw=(()=>{try{return localStorage.getItem(KEY)}catch{return null}})();
 const saved=(()=>{try{const v=JSON.parse(initialRaw||'null');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return{}}})();
 // Reject structurally incomplete demo listings in memory; never rewrite the user's raw storage on load.
 const validListing=x=>typeof x.id==='string'&&x.id.length>0&&TYPES.slice(1).includes(x.type)&&
  typeof x.name==='string'&&x.name.trim().length>0&&typeof x.store==='string'&&x.store.trim().length>0&&
  typeof x.city==='string'&&(typeof x.price==='number'||typeof x.price==='string'&&x.price.trim()!=='')&&
  Number.isFinite(Number(x.price))&&Number(x.price)>=0;
 const filterList=(arr,max,valid=()=>true)=>Array.isArray(arr)?arr.filter(x=>x&&typeof x==='object'&&!Array.isArray(x)&&valid(x)).slice(0,max):[];
 const state={
  items:filterList(saved.items,30,validListing),needs:filterList(saved.needs,25),answers:filterList(saved.answers,50),
  flags:filterList(saved.flags,40),sampleOrders:filterList(saved.sampleOrders,20),
  tab:'catalog',open:false,query:'',type:'Të gjitha',city:'Të gjitha',min:'',max:'',stockOnly:false,
  yearMin:'',maxKm:'',areaMin:'',sort:'relevance',selected:'k1',shop:'',
  needIndex:null,editId:null,notice:''
 };
 let overlay=null,previous=null,inertBefore=[],trigger=null;
 const all=()=>[...state.items,...SEED];
 const numeric=(v,fallback=0)=>Number.isFinite(+v)?Number(v):fallback;
 const money=v=>new Intl.NumberFormat(window.IllyrianI18n?.language||'it',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2}).format(numeric(v));
 const feedback=(key,fallback)=>window.IllyrianI18n?.t('shopPlus:'+key)||fallback;
 const ui=(key,fallback)=>esc(feedback(key,fallback));
 const typeLabel=code=>esc(window.IllyrianI18n?.t('shop:'+({'Të gjitha':'all','Produkte':'products','Makina':'cars','Prona':'properties','Punë':'jobs','Banesa me qira':'rentals','Shërbime':'services'}[code]))||code);
 const persisted=()=>({items:state.items,needs:state.needs,answers:state.answers,flags:state.flags,sampleOrders:state.sampleOrders});
 let lastSaved=JSON.stringify(persisted()),expectedRaw=initialRaw;
 const rejectStale=()=>{
  Object.assign(state,JSON.parse(lastSaved));
  state.notice=feedback('storageConflict','Shop Plus u ndryshua në një skedë tjetër. Kopjo tekstin e papërfunduar dhe rifresko faqen para ruajtjes.');
  return false;
 };
 const save=()=>{try{
   // This detects observed stale writes; localStorage lacks atomic CAS.
   // Truly simultaneous writes require server-side transactions in the real app.
   if(localStorage.getItem(KEY)!==expectedRaw)return rejectStale();
   const next=JSON.stringify(persisted());
   localStorage.setItem(KEY,next);expectedRaw=next;lastSaved=next;return true;
  }catch{
   Object.assign(state,JSON.parse(lastSaved));
   state.notice=feedback('storageFull','Nuk u ruajt në këtë pajisje. Provo të heqësh listime të vjetra.');
   return false;
  }};
 const btn=(act,text,extra='')=>'<button type="button" data-isp="'+esc(act)+'" '+extra+'>'+esc(text)+'</button>';
 const pill=(value,active)=>'<button type="button" data-i18n-direct data-isp="type:'+esc(value)+'" aria-pressed="'+(active?'true':'false')+'" class="'+(active?'chosen':'')+'">'+typeLabel(value)+'</button>';
 const periodLabel=code=>code==='javë'?ui('periodWeek','javë'):code==='muaj'||!code?ui('periodMonth','muaj'):esc(code);
 const fuelLabel=code=>({'Naftë':'fuelDiesel','Hibrid':'fuelHybrid','Benzinë':'fuelPetrol'}[code]?ui({'Naftë':'fuelDiesel','Hibrid':'fuelHybrid','Benzinë':'fuelPetrol'}[code],code):esc(code||''));
 const period=p=>p.type==='Banesa me qira'?'<span data-i18n-direct>/'+periodLabel(p.period)+'</span>':'';
 const property=type=>type==='Prona'||type==='Banesa me qira';
 const price=p=>p.type==='Punë'?(numeric(p.price)>0?money(p.price)+' '+esc(window.IllyrianI18n?.t('shop:salaryBasis')):esc(window.IllyrianI18n?.t('shop:salaryUnknown'))):money(p.price)+period(p);
 const safeItems=()=>{
  const min=state.min===''?null:numeric(state.min,NaN);
  const max=state.max===''?null:numeric(state.max,NaN);
  let arr=all().filter(p=>{
   const normalize=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('sq');
   const q=normalize(state.query.trim());
   const text=window.IllyrianShopDiscovery?.searchText(p)||normalize([p.name,p.store,p.city,p.type,p.details].join(' '));
   return (!q||q.split(/\s+/).every(x=>text.includes(x)))&&
    (state.type==='Të gjitha'||p.type===state.type)&&
    (state.city==='Të gjitha'||p.city===state.city)&&
    (!state.shop||p.store===state.shop)&&
    (min===null||p.price>=min)&&(max===null||p.price<=max)&&
    (state.type!=='Produkte'||!state.stockOnly||numeric(p.quantity)>0)&&
    (state.type!=='Makina'||state.yearMin===''||numeric(p.year)>=numeric(state.yearMin))&&
    (state.type!=='Makina'||state.maxKm===''||numeric(p.mileage)<=numeric(state.maxKm))&&
    (!property(state.type)||state.areaMin===''||numeric(p.area)>=numeric(state.areaMin))
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
 const chip=p=>(p.promoted?'<span class="isp-sponsored" data-i18n-direct>'+ui('promoted','PROMOVUAR · DEMO')+'</span>':'');
 const card=p=>'<article class="isp-card"><div class="isp-typeline"><span data-i18n-direct>'+typeLabel(p.type)+'</span>'+chip(p)+'</div><h4 data-user-content>'+esc(p.name)+'</h4>'+
  '<strong>'+price(p)+'</strong><p><span data-user-content>'+esc(p.store)+'</span> · '+esc(p.city)+'</p>'+
  (p.type==='Produkte'?'<p><span data-i18n-direct>'+ui('inventory','Inventari:')+'</span> '+(numeric(p.quantity)>0?numeric(p.quantity)+' <span data-i18n-direct>'+ui('units','copë (demo)')+'</span>':'<span data-i18n-direct>'+ui('outOfStockDemo','Pa stok (demo)')+'</span>')+'</p>':
   p.type==='Makina'?'<p><span data-i18n-direct>'+ui('yearShort','Viti')+'</span> '+esc(p.year||'–')+' · '+esc(p.mileage??'–')+' km · <span data-i18n-direct>'+fuelLabel(p.fuel)+'</span>'+'</p>':
   property(p.type)?'<p>'+esc(p.rooms||'–')+' · '+esc(p.area||'–')+' m²'+(p.type==='Banesa me qira'?' · <span data-i18n-direct>'+periodLabel(p.period)+'</span>':'')+'</p>':'')+
  btn('item:'+p.id,feedback('detailsSeller','Detajet dhe shitësi'),'data-i18n-direct')+
  '<button type="button" data-i18n-direct data-isp="store:'+esc(p.store)+'">'+ui('viewShop','Shiko dyqanin')+'</button>'+
  (p.owned?btn('edit:'+p.id,feedback('editListingAction','Redakto listimin'),'data-i18n-direct'):'')+
  '</article>';
 const filters=()=>'<form id="isp-filters"><div class="isp-fields">'+
   '<label data-i18n-direct>'+ui('search','Kërko')+'<input name="q" maxlength="90" type="search" placeholder="'+ui('searchPlaceholder','Produkt, dyqan, makinë...')+'" value="'+esc(state.query)+'"></label>'+
   '<label data-i18n-direct>'+esc(window.IllyrianI18n?.t('shop:city')||'Qyteti')+'<select name="city">'+CITIES.map(x=>'<option data-i18n-direct '+(x===state.city?'selected ':'')+'value="'+esc(x)+'">'+(x==='Të gjitha'?esc(window.IllyrianI18n?.t('shop:all')||x):esc(x))+'</option>').join('')+'</select></label>'+
   '<label data-i18n-direct>'+ui('priceMin','Çmim min. €')+'<input name="min" inputmode="decimal" type="number" min="0" max="10000000" value="'+esc(state.min)+'"></label>'+
   '<label data-i18n-direct>'+ui('priceMax','Çmim max. €')+'<input name="max" inputmode="decimal" type="number" min="0" max="10000000" value="'+esc(state.max)+'"></label>'+
   '<label data-i18n-direct>'+esc(window.IllyrianI18n?.t('shop:sortHeading')||'Renditja')+'<select name="sort">'+[['relevance',window.IllyrianI18n?.t('shop:relevance')||'Relevanca'],['lowest',feedback('cheapest','Më i liri')],['highest',feedback('mostExpensive','Më i shtrenjti')],['name',feedback('name','Emri')]].map(([a,b])=>'<option data-i18n-direct '+(a===state.sort?'selected ':'')+'value="'+a+'">'+esc(b)+'</option>').join('')+'</select></label>'+
   (state.type==='Makina'?'<label data-i18n-direct>'+ui('carYear','Viti i makinës nga')+'<input name="year" type="number" min="1950" max="2030" value="'+esc(state.yearMin)+'" placeholder="2017"></label>'+
   '<label data-i18n-direct>'+ui('maxKm','Maks. kilometra')+'<input name="km" type="number" min="0" max="2000000" value="'+esc(state.maxKm)+'" placeholder="100000"></label>':'')+
   (property(state.type)?'<label data-i18n-direct>'+esc(window.IllyrianI18n?.t('shop:areaMinimum')||'Sipërfaqe min. m²')+'<input name="area" type="number" min="0" max="10000" value="'+esc(state.areaMin)+'" placeholder="50"></label>':'')+
   '</div>'+(state.type==='Produkte'?'<label class="isp-check" data-i18n-direct><input name="stock" type="checkbox" '+(state.stockOnly?'checked':'')+'> '+ui('inStock','Vetëm produkte me stok')+'</label>':'')+
   '<div class="isp-actions"><button type="submit" data-i18n-direct>'+ui('applyFilters','Apliko filtrat')+'</button>'+btn('clear-filters',feedback('clear','Pastro'),'data-i18n-direct')+'</div></form>';
 const catalog=()=>{
  const result=safeItems(),sets=productSets();
  return '<div class="isp-hero"><b data-i18n-direct>'+ui('catalogTag','ILLYRIAN SHOP · KËRKIM I AVANCUAR')+'</b><h2 data-i18n-direct>'+ui('headline','Gjej produktin, jo vetëm një reklamë.')+'</h2><p data-i18n-direct>'+ui('catalogIntro','Krahaso dyqanet dhe shiko karakteristikat e ofertave. Çdo listim është demonstrues.')+'</p></div>'+
   '<nav class="isp-kinds">'+TYPES.map(x=>pill(x,x===state.type)).join('')+'</nav>'+filters()+
   (state.shop?'<p class="isp-active"><span data-i18n-direct>'+ui('storeFilter','Dyqani:')+'</span> <span data-user-content>'+esc(state.shop)+'</span> '+btn('clear-store',feedback('removeStoreFilter','Hiq filtrin'),'data-i18n-direct')+'</p>':'')+
   '<div class="isp-rowhead"><h3>'+result.length+' <span data-i18n-direct>'+ui('offersCount','oferta')+'</span></h3><span>'+new Set(result.map(x=>x.store)).size+' <span data-i18n-direct>'+ui('sellersCount','shitës/dyqane')+'</span></span></div>'+
   (sets.length?'<section class="isp-compare"><h3 data-i18n-direct>'+ui('sameProduct','I njëjti produkt, disa dyqane')+'</h3>'+sets.map(g=>
     '<article><b data-user-content>'+esc(g.items[0].name)+'</b><p data-i18n-direct>'+ui('sameSkuNote','Shembull me të njëjtin produkt/SKU. Çmimi nuk përfshin transport ose taksa.')+'</p>'+
     g.items.map(i=>'<div class="isp-offer"><span><span data-user-content>'+esc(i.store)+'</span> · '+esc(i.city)+'</span><b>'+money(i.price)+'</b><small data-i18n-direct>'+(numeric(i.quantity)>0?ui('stockAvailable','Në stok'):ui('outOfStock','Pa stok'))+'</small></div>').join('')+
     '</article>').join('')+'</section>':'')+
   (result.length?'<div class="isp-cards">'+result.map(card).join('')+'</div>':'<div class="isp-empty" data-i18n-direct>'+ui('emptyCatalog','Nuk u gjet asnjë ofertë. Ndrysho filtrat.')+'</div>')+
   btn('create',window.IllyrianI18n?.t('shop:publishOffer')||'+ Publiko ofertën tënde','data-i18n-direct')+
   '<p class="isp-muted" data-i18n-direct>'+ui('unverifiedCatalog','Nuk kemi bërë verifikim të stokut, çmimeve, shitësve ose produkteve: të gjitha janë shembuj.')+'</p>';
 };
 const itemView=()=>{
  const p=all().find(x=>x.id===state.selected);
  if(!p)return '<p data-i18n-direct>'+ui('itemMissing','Listimi nuk ekziston.')+'</p>'+btn('catalog',feedback('itemBack','Kthehu'),'data-i18n-direct');
  const detail=p.details?'<p data-user-content>'+esc(p.details)+'</p>':'<p data-i18n-direct>'+ui('itemDemoDescription','Oferta është demonstrative.')+'</p>';
  const attributes=p.type==='Makina'?
   '<p><span data-i18n-direct>'+ui('itemYear','Viti:')+'</span> '+esc(p.year||'–')+' · <span data-i18n-direct>'+ui('itemMileage','Kilometra:')+'</span> '+esc(p.mileage??'–')+' · <span data-i18n-direct>'+ui('itemFuel','Karburanti:')+'</span> <span data-i18n-direct>'+fuelLabel(p.fuel)+'</span></p>':
   property(p.type)?
   '<p><span data-i18n-direct>'+ui('itemArea','Sipërfaqe:')+'</span> '+esc(p.area||'–')+' m² · <span data-user-content>'+esc(p.rooms||'–')+'</span>'+(p.type==='Banesa me qira'?' · <span data-i18n-direct>'+ui('itemRentalFor','Qira për')+' '+periodLabel(p.period)+'</span>':'')+'</p>':
   p.type==='Produkte'?
   '<p><span data-i18n-direct>'+ui('itemStock','Gjendja:')+'</span> '+(numeric(p.quantity)>0?'<span data-i18n-direct>'+ui('itemAvailable','Në stok,')+'</span> '+numeric(p.quantity)+' <span data-i18n-direct>'+ui('itemUnit','copë')+'</span>':'<span data-i18n-direct>'+ui('itemEmptyStock','Pa stok')+'</span>')+'</p>':'';
  return btn('catalog',feedback('itemBackResults','← Kthehu te rezultatet'),'data-i18n-direct')+
   '<article class="isp-card isp-focus">'+chip(p)+'<h3 data-user-content>'+esc(p.name)+'</h3><strong>'+price(p)+'</strong>'+
   detail+'<p><span data-user-content>'+esc(p.store)+'</span> · '+esc(p.city)+'</p>'+attributes+
   btn('store:'+p.store,feedback('itemSellerCatalog','Katalogu i dyqanit'),'data-i18n-direct')+
   btn('report:'+p.id,feedback('itemReport','Raporto listimin'),'data-i18n-direct')+
   (p.owned?btn('edit:'+p.id,feedback('itemEdit','Ndrysho listimin'),'data-i18n-direct'):'')+
   '</article><p class="isp-muted" data-i18n-direct>'+ui('itemDisclaimer','Asnjë pagesë ose kontakt real. Makina dhe banesa nuk rezervohen në këtë demo.')+'</p>';
 };
 const storesView=()=>{
  const sellers=[...new Set(all().map(x=>x.store))].sort((a,b)=>a.localeCompare(b,'sq'));
  return '<h3 data-i18n-direct>'+ui('storesHeading','Dyqanet e vogla')+'</h3><p data-i18n-direct>'+ui('storesIntro','Çdo dyqan ka katalogun e ofertave të veta. Inventari këtu është vetëm provë.')+'</p>'+
  sellers.map(x=>{
    const rows=all().filter(p=>p.store===x),cities=[...new Set(rows.map(p=>p.city))].join(', ');
    return '<article class="isp-card"><h4 data-user-content>'+esc(x)+'</h4><p>'+esc(cities)+' · '+rows.length+' <span data-i18n-direct>'+ui('demoListings','listime demonstrative')+'</span></p>'+
     '<p>'+rows.filter(p=>p.type==='Produkte'&&numeric(p.quantity)>0).length+' <span data-i18n-direct>'+ui('storeStockExamples','produkte në stok (shembull)')+'</span></p>'+btn('store:'+x,feedback('openShopCatalog','Hap katalogun'),'data-i18n-direct')+'</article>'
  }).join('');
 };
 const storeView=()=>{
  const rows=all().filter(p=>p.store===state.shop);
  return btn('stores',feedback('allShops','← Të gjitha dyqanet'),'data-i18n-direct')+'<h3 data-user-content>'+esc(state.shop)+'</h3><p>'+rows.length+' <span data-i18n-direct>'+ui('demoOffers','oferta demonstrative; identiteti tregtar nuk është verifikuar.')+'</span></p>'+
    (window.IllyrianShopDiscovery?.businessProfile(state.shop,rows)||'')+rows.map(card).join('')+
    '<p class="isp-muted" data-i18n-direct>'+ui('sponsoredNote','Ofertat e sponsorizuara janë të etiketuara. Nuk kemi vlerësim të besueshmërisë së shitësit.')+'</p>';
 };
 // Keep fields mounted when hiding other categories, retaining unsent input.
 const categoryField=type=>' data-isp-category="'+esc(type)+'"';
 const syncCreateType=form=>{
  if(!form)return;
  const type=form.elements.namedItem('type')?.value;
  form.querySelectorAll('[data-isp-category]').forEach(label=>{
   const show=label.dataset.ispCategory===type||(type==='Prona'&&label.hasAttribute('data-isp-property'));
   label.querySelectorAll('input,select,textarea').forEach(el=>el.disabled=!show);
   label.hidden=!show;
   label.style.display=show?'':'none';
  });
  const salary=type==='Punë',price=form.elements.namedItem('price');
  if(price){price.required=!salary;price.min=salary?'0':'.5'}
  const label=form.querySelector('[data-job-price-label]');if(label)label.textContent=salary?(window.IllyrianI18n?.t('shop:salaryOptional')||'Paga orientuese € (opsionale)'):feedback('formPrice','Çmimi €');
 };
 const create=()=>{
  const editing=state.editId&&state.items.find(p=>p.id===state.editId);
  const p=editing||{type:'Produkte',name:'',store:'',city:'Tiranë',price:'',quantity:1,year:'',mileage:'',area:'',rooms:'',period:'muaj',details:''};
  return '<h3 data-i18n-direct>'+(editing?ui('formEditOffer','Redakto ofertën'):ui('formPublishOffer','Publiko ofertë në demo'))+'</h3><p data-i18n-direct>'+ui('formListingIntro','Produkte, makina, banesa dhe shërbime. Listimet ruhen vetëm në pajisjen tënde.')+'</p>'+
  '<form id="isp-create" class="isp-fields">'+
  '<label data-i18n-direct>'+ui('formCategory','Kategoria')+'<select name="type">'+TYPES.slice(1).map(x=>'<option data-i18n-direct value="'+esc(x)+'" '+(p.type===x?'selected':'')+'>'+typeLabel(x)+'</option>').join('')+'</select></label>'+
  '<label data-i18n-direct>'+ui('name','Emri')+'<input name="name" minlength="4" maxlength="90" required value="'+esc(p.name)+'"></label>'+
  '<label data-i18n-direct>'+ui('formSeller','Dyqani / shitësi')+'<input name="store" minlength="2" maxlength="70" required value="'+esc(p.store)+'"></label>'+
  '<label data-i18n-direct>'+esc(window.IllyrianI18n?.t('shop:city')||'Qyteti')+'<select name="city">'+CITIES.slice(1).map(x=>'<option value="'+esc(x)+'" '+(p.city===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></label>'+
  '<label data-i18n-direct><span data-job-price-label>'+ui('formPrice','Çmimi €')+'</span>'+'<input name="price" type="number" min=".5" max="10000000" step=".01" value="'+esc(p.price)+'" required></label>'+
  '<label'+categoryField('Produkte')+' data-i18n-direct>'+ui('formInventory','Inventari produkt (copë)')+'<input name="quantity" type="number" min="0" max="10000" value="'+esc(p.quantity??1)+'"></label>'+
  '<label'+categoryField('Makina')+' data-i18n-direct>'+ui('formCarYear','Viti i makinës')+'<input name="year" type="number" min="1950" max="2030" value="'+esc(p.year||'')+'"></label>'+
  '<label'+categoryField('Makina')+' data-i18n-direct>'+ui('formMileage','Kilometrat e makinës')+'<input name="mileage" type="number" min="0" max="2000000" value="'+esc(p.mileage??'')+'"></label>'+
  '<label data-isp-property'+categoryField('Banesa me qira')+' data-i18n-direct>'+ui('formPropertyArea','Sipërfaqe banese (m²)')+'<input name="area" type="number" min="1" max="10000" value="'+esc(p.area||'')+'"></label>'+
  '<label data-isp-property'+categoryField('Banesa me qira')+' data-i18n-direct>'+ui('formPropertyType','Lloji i banesës')+'<input name="rooms" maxlength="30" value="'+esc(p.rooms||'')+'" placeholder="2+1"></label>'+
  '<label'+categoryField('Banesa me qira')+' data-i18n-direct>'+ui('formPeriod','Periudha e qirasë')+'<select name="period"><option value="muaj" '+(p.period==="javë"?'':'selected')+'>'+ui('formPerMonth','Për muaj')+'</option><option value="javë" '+(p.period==="javë"?'selected':'')+'>'+ui('formPerWeek','Për javë')+'</option></select></label>'+
  '<label class="isp-span" data-i18n-direct>'+ui('formDescription','Përshkrimi')+'<textarea name="details" maxlength="450" rows="3">'+esc(p.details||'')+'</textarea></label>'+
  '<div class="isp-span"><button type="submit" data-i18n-direct>'+(editing?ui('formSaveChanges','Ruaj ndryshimet'):ui('formPublish','Publiko në demo'))+'</button></div></form>'+
  '<p class="isp-muted" data-i18n-direct>'+ui('formIdentityNote','Nuk ruhet asnjë dokument identiteti, numër telefoni, pagesë ose adresë e saktë.')+'</p>';
 };
 const board=()=>{
  const active=state.needs.filter(n=>Date.parse(n.expires)>Date.now()).slice().reverse();
  return '<h3 data-i18n-direct>'+ui('boardHeading','“Kërkoj…” — kërkesat e komunitetit')+'</h3><p data-i18n-direct>'+ui('boardIntro','Përdoruesi përshkruan çfarë kërkon; dyqanet përgjigjen vetëm në këtë simulim. Pa kontakt real.')+'</p>'+
   '<form id="isp-need" class="isp-fields">'+
   '<label data-i18n-direct>'+ui('formRequestTitle','Kërkoj')+'<input name="title" minlength="5" maxlength="90" required placeholder="'+ui('formRequestPlaceholder','P.sh. biçikletë për qytet')+'"></label>'+
   '<label data-i18n-direct>'+ui('formType','Lloji')+'<select name="type">'+TYPES.slice(1).map(x=>'<option data-i18n-direct value="'+esc(x)+'">'+typeLabel(x)+'</option>').join('')+'</select></label>'+
   '<label data-i18n-direct>'+esc(window.IllyrianI18n?.t('shop:city')||'Qyteti')+'<select name="city">'+CITIES.slice(1).map(x=>'<option value="'+esc(x)+'">'+esc(x)+'</option>').join('')+'</select></label>'+
   '<label data-i18n-direct>'+ui('formBudget','Buxheti maksimal €')+'<input name="budget" type="number" min="1" max="10000000" required></label>'+
   '<label data-i18n-direct>'+ui('formDeadline','Afati')+'<select name="days"><option value="7">'+ui('formSevenDays','7 ditë')+'</option><option value="14">'+ui('formFourteenDays','14 ditë')+'</option><option value="30">'+ui('formThirtyDays','30 ditë')+'</option></select></label>'+
   '<label class="isp-span" data-i18n-direct>'+ui('formRequestDetails','Detajet')+'<textarea name="details" rows="2" maxlength="240" placeholder="'+ui('formDetailPlaceholder','Karakteristikat e kërkuara')+'"></textarea></label>'+
   '<div class="isp-span"><button data-i18n-direct type="submit">'+ui('formPublishRequest','Publiko kërkesën në demo')+'</button></div></form>'+
   (active.length?active.map(n=>'<article class="isp-card"><h4 data-user-content>'+esc(n.title)+'</h4><p>'+'<span data-i18n-direct>'+typeLabel(n.type)+'</span> · '+esc(n.city)+' · <span data-i18n-direct>'+ui('boardBudget','buxheti')+'</span> '+money(n.budget)+'</p>'+
    '<p data-user-content>'+esc(n.details||'')+'</p><small><span data-i18n-direct>'+ui('boardExpires','Skadon:')+'</span> '+esc(new Intl.DateTimeFormat(window.IllyrianI18n?.language||'sq',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(n.expires)))+'</small>'+
    btn('respond:'+n.id,feedback('boardRespond','Përgjigju si dyqan (demo)'),'data-i18n-direct')+(state.answers.filter(a=>a.needId===n.id).slice(-2).map(a=>'<p class="isp-reply"><span data-i18n-direct>'+ui('boardReply','Përgjigje demo:')+'</span> <span data-user-content>'+esc(a.text)+'</span></p>').join(''))+
    (n.owned?btn('remove-need:'+n.id,feedback('boardRemove','Fshi kërkesën'),'data-i18n-direct'):'')+'</article>').join(''):'<p class="isp-empty" data-i18n-direct>'+ui('boardEmpty','Ende pa kërkesa lokale. Publiko një shembull.')+'</p>')+
   '<p class="isp-muted" data-i18n-direct>'+ui('boardDisclaimer','Kërkesat nuk dërgohen te shitësit e vërtetë dhe skadojnë automatikisht.')+'</p>';
 };
 const reasonLabel=code=>{const known={'Informacion i pasaktë':'formReasonInaccurate','Mashtrim i dyshuar':'formReasonFraud','Listim i dyfishuar':'formReasonDuplicate','Përmbajtje e papërshtatshme':'formReasonInappropriate'};return Object.prototype.hasOwnProperty.call(known,code)?ui(known[code],code):esc(code);};
 const moderation=()=>{
  return '<h3 data-i18n-direct>'+ui('modHeading','Raportime dhe etiketa të promovimit')+'</h3><p data-i18n-direct>'+ui('modIntro','Përmbajtja e reklamuar duhet të shënohet; raportimet janë prova lokale.')+'</p>'+
   '<div class="isp-hero"><b data-i18n-direct>'+ui('modTransparency','TRANSPARENCË')+'</b><p data-i18n-direct>'+ui('modDisclosure','“PROMOVUAR · DEMO” shënon listimet e sponsorizuara fiktive. Në produktin real do të kërkohet politikë reklamash, raportime, shqyrtim dhe apelim.')+'</p></div>'+
   '<p><span data-i18n-direct>'+ui('modReportCount','Raportime lokale:')+'</span> '+state.flags.length+'</p>'+
   (state.flags.length?state.flags.slice(-15).reverse().map(f=>'<article class="isp-card"><p><b data-user-content>'+esc(f.target)+'</b> · '+'<span data-i18n-direct>'+reasonLabel(f.reason)+'</span></p><small data-i18n-direct>'+ui('modPending','Në shqyrtim (simulim, jo moderator real)')+'</small></article>').join(''):'<p class="isp-empty" data-i18n-direct>'+ui('modEmpty','Asnjë raportim demonstrues.')+'</p>');
 };
 const checkout=()=>{
  const product=all().find(p=>p.type==='Produkte'&&numeric(p.quantity)>0);
  const v=product?.price||100,fee=+(v*.05).toFixed(2);
  return '<h3 data-i18n-direct>'+ui('checkoutHeading','Porosia, kthimi dhe komisioni — shembull')+'</h3>'+
   '<article class="isp-card"><h4 data-i18n-direct>'+ui('checkoutFlow','Rrjedhë ilustruese')+'</h4>'+
   '<p data-i18n-direct>'+ui('checkoutSteps','Blerësi bën porosinë → shitësi konfirmon stokun → dërgesa → dorëzim → mundësi për ankesë/kthim.')+'</p>'+
   '<p><b data-i18n-direct>'+ui('demoValue','Vlera shembull:')+'</b> '+money(v)+'</p>'+
   '<p><b data-i18n-direct>'+ui('demoFee','Komision ilustrues 5%:')+'</b> '+money(fee)+'</p>'+
   '<p><b data-i18n-direct>'+ui('sellerNet','Te shitësi, përpara kostove/taksave:')+'</b> '+money(v-fee)+'</p>'+
   btn('sample-order',feedback('simulateOrder','Simulo porosinë (pa pagesë)'),'data-i18n-direct')+
   '</article>'+
   (state.sampleOrders.slice(-5).reverse().map(o=>'<article class="isp-card"><p><span data-i18n-direct>'+ui('demoOrder','Porosia demo')+'</span> '+esc(o.id)+' · <span data-i18n-direct>'+(o.status==='E krijuar në demo'?ui('statusCreated',o.status):o.status==='Kërkesë anulimi/kthimi (demo)'?ui('statusReturn',o.status):esc(o.status))+'</span></p>'+
   btn('sample-cancel:'+o.id,feedback('cancelReturn','Anulo / kërko kthim'),'data-i18n-direct')+
   '</article>').join(''))+
   '<p class="isp-muted" data-i18n-direct>'+ui('checkoutWarning','5% nuk është tarifë e miratuar. Nuk ka transaksione, faturë, dërgesë, identitet apo rimbursim real. Ligjet dhe kostot duhen verifikuar përpara lansimit.')+'</p>';
 };
 const respond=()=>{
  const n=state.needs.find(x=>x.id===state.needIndex);
  if(!n)return '<p data-i18n-direct>'+ui('respondMissing','Kërkesa nuk u gjet.')+'</p>'+btn('needs',feedback('respondBack','Kthehu'),'data-i18n-direct');
  return '<h3><span data-i18n-direct>'+ui('respondHeading','Përgjigje për:')+'</span> <span data-user-content>'+esc(n.title)+'</span></h3><p><span data-i18n-direct>'+ui('respondBudget','Buxheti:')+'</span> '+money(n.budget)+' · '+esc(n.city)+'</p>'+
   '<form id="isp-answer"><label data-i18n-direct>'+ui('respondMessage','Mesazhi demonstrues')+'<textarea name="text" maxlength="180" minlength="5" required placeholder="'+ui('respondPlaceholder','P.sh. Dyqani ka një alternativë.')+'"></textarea></label><button data-i18n-direct type="submit">'+ui('respondSave','Ruaj përgjigjen në demo')+'</button></form>'+
   '<p data-i18n-direct>'+ui('respondDisclaimer','Ky mesazh nuk u dërgohet blerësve ose dyqaneve reale.')+'</p>';
 };
 const report=()=>{
  const x=all().find(p=>p.id===state.selected);
  return '<h3 data-i18n-direct>'+ui('formReportListing','Raporto listimin')+'</h3><p data-user-content>'+(x?.name?esc(x.name):ui('reportPlaceholder','Listimi demonstrues'))+'</p>'+
  '<form id="isp-report"><label data-i18n-direct>'+ui('formReason','Arsyeja')+'<select name="reason"><option data-i18n-direct value="Informacion i pasaktë">'+ui('formReasonInaccurate','Informacion i pasaktë')+'</option><option data-i18n-direct value="Mashtrim i dyshuar">'+ui('formReasonFraud','Mashtrim i dyshuar')+'</option><option data-i18n-direct value="Listim i dyfishuar">'+ui('formReasonDuplicate','Listim i dyfishuar')+'</option><option data-i18n-direct value="Përmbajtje e papërshtatshme">'+ui('formReasonInappropriate','Përmbajtje e papërshtatshme')+'</option></select></label>'+
  '<label data-i18n-direct>'+ui('formOptionalDescription','Përshkrim opsional')+'<textarea name="detail" maxlength="180"></textarea></label>'+
  '<button type="submit" data-i18n-direct>'+ui('formSaveReport','Ruaj raportimin (demo)')+'</button></form>';
 };
 const page=()=>state.tab==='catalog'?catalog():state.tab==='stores'?(state.shop?storeView():storesView()):
  state.tab==='item'?itemView():state.tab==='create'?create():state.tab==='needs'?board():
  state.tab==='respond'?respond():state.tab==='report'?report():state.tab==='moderation'?moderation():checkout();
 const render=()=>{if(!overlay||!state.open)return;
  overlay.innerHTML='<div class="isp-shade" data-isp="close"></div><section class="isp-panel" role="dialog" aria-modal="true" aria-label="'+ui('dialogLabel','ILLYRIAN Shop i avancuar')+'">'+
  '<header><div><small>ILLYRIAN · DEMO v1.7</small><h2 data-i18n-direct>'+ui('title','Shop i avancuar')+'</h2></div>'+btn('close',feedback('closeDialog','✕ Mbyll'),'data-i18n-direct')+'</header>'+
  '<nav class="isp-nav">'+[['catalog',feedback('search','Kërko')],['stores',feedback('stores','Dyqanet')],['needs',feedback('needs','Kërkoj…')],['checkout',feedback('orders','Porositë')],['moderation',feedback('reports','Raportime')]].map(([a,b])=>btn('tab:'+a,b,'data-i18n-direct '+(state.tab===a?'aria-current="page"':''))).join('')+'</nav>'+
  (state.notice?'<p class="isp-notice" role="status">'+esc(state.notice)+'</p>':'')+
  page()+'<footer data-i18n-direct>'+ui('footer','Të dhëna fiktive · Nuk ka pagesa, rezervime, dërgesa ose kontakte reale.')+'</footer></section>';
  syncCreateType(overlay.querySelector('#isp-create'));
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
  window.dispatchEvent(new CustomEvent('illyrian:shop:closed',{detail:{source:'shopPlus'}}));
 };
 // On failed storage writes, keep the existing form DOM (including unsaved fields) for retry.
 const showStorageError=()=>{
  if(!overlay)return;
  let note=overlay.querySelector('.isp-notice');
  if(!note){note=document.createElement('p');note.className='isp-notice';overlay.querySelector('.isp-nav')?.insertAdjacentElement('afterend',note)}
  note.setAttribute('role','status');note.textContent=state.notice;
 };
 // Keep draft fields mounted when a validation rule rejects a submission.
 const validationError=(form,key,fallback,field)=>{
  state.notice=feedback(key,fallback);
  showStorageError();
  const notice=overlay?.querySelector('.isp-notice');
  if(notice){notice.id='isp-validation-feedback';notice.setAttribute('role','alert')}
  // Link the failed control to its spoken error. Preserve other aria-describedby IDs.
  form.querySelectorAll('[aria-describedby~="isp-validation-feedback"]').forEach(el=>{
   el.removeAttribute('aria-invalid');
   const ids=(el.getAttribute('aria-describedby')||'').split(/\s+/).filter(x=>x&&x!=='isp-validation-feedback');
   if(ids.length)el.setAttribute('aria-describedby',ids.join(' '));else el.removeAttribute('aria-describedby');
  });
  const control=field?form.elements.namedItem(field):null;
  if(control?.focus){
   control.setAttribute('aria-invalid','true');
   const ids=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
   if(!ids.includes('isp-validation-feedback'))control.setAttribute('aria-describedby',[...ids,'isp-validation-feedback'].join(' '));
   control.focus();
  }
 };
 const message=(m,onSaved)=>{
  if(!save()){showStorageError();return false}
  onSaved?.();state.notice=m;render();return true
 };
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
  if(act.startsWith('remove-need:')){const id=act.slice(12);state.needs=state.needs.filter(n=>n.id!==id||!n.owned);return message(feedback('requestRemoved','Kërkesa u fshi lokalisht.'))}
  if(act==='sample-order'){const i={id:'D'+Date.now().toString(36),status:'E krijuar në demo'};state.sampleOrders.push(i);state.sampleOrders=state.sampleOrders.slice(-20);return message(feedback('orderSaved','Porosia u regjistrua vetëm në simulim.'))}
  if(act.startsWith('sample-cancel:')){const id=act.slice(14);const order=state.sampleOrders.find(o=>o.id===id);if(order)order.status='Kërkesë anulimi/kthimi (demo)';return message(feedback('returnSaved','Kërkesa e kthimit u regjistrua; nuk ka rimbursim real.'))}
 };
 function submit(form){
  const d=new FormData(form),v=k=>String(d.get(k)||'').trim(),num=k=>d.get(k)===null||d.get(k)===''?null:Number(d.get(k));
  if(form.id==='isp-filters'){
   const min=num('min'),max=num('max'),year=num('year'),km=num('km'),area=num('area');
   if([min,max,year,km,area].some(x=>x!==null&&(!Number.isFinite(x)||x<0))||(min!==null&&max!==null&&min>max)){
    validationError(form,'filtersInvalid','Kontrollo kufijtë e çmimit dhe filtrat numerikë.','min');return}
   if(!CITIES.includes(v('city'))||!['relevance','lowest','highest','name'].includes(v('sort')))return;
   state.query=v('q').slice(0,90);state.city=v('city');state.min=min===null?'':String(min);state.max=max===null?'':String(max);
   state.sort=v('sort');state.yearMin=year===null?'':String(year);state.maxKm=km===null?'':String(km);state.areaMin=area===null?'':String(area);
   state.stockOnly=d.get('stock')!==null;state.notice='';render();return;
  }
  if(form.id==='isp-create'){
   const kind=v('type'),name=v('name'),store=v('store'),city=v('city'),p=v('type')==='Punë'&&num('price')===null?0:num('price'),q=num('quantity'),year=num('year'),km=num('mileage'),area=num('area');
   if(!TYPES.slice(1).includes(kind)||!CITIES.slice(1).includes(city)||name.length<4||name.length>90||store.length<2||store.length>70||p===null||!Number.isFinite(p)||p<(kind==='Punë'?0:.5)||p>10000000){
    validationError(form,'listingInvalid','Plotëso saktë emrin, dyqanin, qytetin dhe çmimin.','name');return}
   if(kind==='Produkte'&&(q===null||!Number.isInteger(q)||q<0||q>10000)){validationError(form,'stockInvalid','Inventari duhet të jetë 0–10000 copë.','quantity');return}
   if(kind==='Makina'&&(year===null||!Number.isInteger(year)||year<1950||year>2030||km===null||!Number.isInteger(km)||km<0||km>2000000)){validationError(form,'vehicleInvalid','Vendos vitin dhe kilometrat e makinës.',(year===null||!Number.isInteger(year)||year<1950||year>2030)?'year':'mileage');return}
   if(property(kind)&&(area===null||!Number.isFinite(area)||area<1||area>10000)){validationError(form,'rentalInvalid','Vendos sipërfaqen e banesës.','area');return}
   const old=state.items.find(i=>i.id===state.editId&&i.owned);
   if(!old&&state.items.length>=30){validationError(form,'listingsLimit','Kufiri i listimeve lokale u arrit.');return}
   const item={id:old?.id||'own'+Date.now().toString(36),owned:true,type:kind,name,store,city,price:p,details:v('details').slice(0,450),quantity:kind==='Produkte'?q:null,
    year:kind==='Makina'?year:null,mileage:kind==='Makina'?km:null,area:property(kind)?area:null,rooms:property(kind)?v('rooms').slice(0,30):'',
    period:kind==='Banesa me qira'&&['muaj','javë'].includes(v('period'))?v('period'):'muaj',sku:'',promoted:false};
   if(old)Object.assign(old,item);else state.items.unshift(item);
   message(feedback('listingSaved','Listimi u ruajt vetëm në pajisjen tënde.'),()=>{state.tab='item';state.selected=item.id;state.editId=null});return;
  }
  if(form.id==='isp-need'){
   const type=v('type'),city=v('city'),title=v('title'),budget=num('budget'),days=num('days');
   if(!TYPES.slice(1).includes(type)||!CITIES.slice(1).includes(city)||title.length<5||title.length>90||budget===null||!Number.isFinite(budget)||budget<1||budget>10000000||![7,14,30].includes(days)){
    validationError(form,'requestInvalid','Kontrollo kërkesën, qytetin, buxhetin dhe afatin.','title');return}
   if(state.needs.length>=25){validationError(form,'requestsLimit','Kufiri lokal i kërkesave u arrit.');return}
   state.needs.push({id:'n'+Date.now().toString(36),owned:true,type,city,title,budget,details:v('details').slice(0,240),expires:new Date(Date.now()+days*86400000).toISOString()});
   message(feedback('requestSaved','Kërkesa u regjistrua vetëm në këtë pajisje.'),()=>{state.tab='needs'});return;
  }
  if(form.id==='isp-answer'){
   const need=state.needs.find(n=>n.id===state.needIndex),txt=v('text').slice(0,180);
   if(!need||Date.parse(need.expires)<Date.now()||txt.length<5||state.answers.length>=50){validationError(form,'answerInvalid','Kërkesa ose mesazhi nuk është i vlefshëm.','text');return}
   state.answers.push({needId:need.id,text:txt});message(feedback('answerSaved','Përgjigjja u ruajt vetëm në demo.'),()=>{state.tab='needs'});return;
  }
  if(form.id==='isp-report'){
   const allowed=['Informacion i pasaktë','Mashtrim i dyshuar','Listim i dyfishuar','Përmbajtje e papërshtatshme'],reason=v('reason');
   if(!allowed.includes(reason)||state.flags.length>=40){validationError(form,'reportInvalid','Arsyeja e raportimit nuk është e vlefshme ose u arrit kufiri.','reason');return;}
   state.flags.push({target:all().find(p=>p.id===state.selected)?.name||'Listim',reason,detail:v('detail').slice(0,180)});
   message(feedback('reportSaved','Raportimi është provë lokale; asnjë moderator nuk u njoftua.'),()=>{state.tab='moderation'});return;
  }
 }
 function inject(){
  const el=document.querySelector('#illyrian-shop-layer');
  if(!el)return;const existing=el.querySelector('[data-isp-open]');if(existing){const label=feedback('entryAdvanced','Kërkim i avancuar · Katalogë · Kërkoj…');if(existing.textContent!==label)existing.textContent=label;if(!existing.hasAttribute('data-i18n-direct'))existing.dataset.i18nDirect='1';return}if(state.open)return;
  const actions=el.querySelector('.ils-actions')||el.querySelector('.ils-splash');
  if(!actions)return;
  const newBtn=document.createElement('button');
  newBtn.type='button';newBtn.className='ils-btn';newBtn.dataset.ispOpen='1';newBtn.dataset.i18nDirect='1';newBtn.textContent=feedback('entryAdvanced','Kërkim i avancuar · Katalogë · Kërkoj…');
  actions.appendChild(newBtn);
 }
 function onLocaleChange(){
  inject();
  if(!state.open||!overlay)return;
  const form=overlay.querySelector('form');
  const fields=form?[...form.elements].filter(e=>e.name).map(e=>({name:e.name,value:e.value,checked:e.type==='checkbox'?e.checked:null})):null;
  const active=document.activeElement,focusedName=active?.name,action=active?.dataset?.isp;
  const invalidName=form?.querySelector('[aria-invalid="true"][aria-describedby~="isp-validation-feedback"]')?.name;
  const hadValidation=!!overlay.querySelector('#isp-validation-feedback[role="alert"]');
  render();
  const target=overlay.querySelector('form');
  if(hadValidation){
   const notice=overlay.querySelector('.isp-notice');
   if(notice){notice.id='isp-validation-feedback';notice.setAttribute('role','alert')}
   const invalid=invalidName?target?.elements.namedItem(invalidName):null;
   if(invalid){
    invalid.setAttribute('aria-invalid','true');
    invalid.setAttribute('aria-describedby','isp-validation-feedback');
   }
  }
  if(fields&&target){
   for(const item of fields){const el=target.elements.namedItem(item.name);if(!el)continue;el.value=item.value;if(item.checked!==null)el.checked=item.checked}
  }
  syncCreateType(target?.id==='isp-create'?target:null);
  if(focusedName&&target?.elements.namedItem(focusedName))target.elements.namedItem(focusedName).focus();
  else if(action)overlay.querySelector('[data-isp="'+CSS.escape(action)+'"]')?.focus();
 }
 // Source-qualified social targets reuse this catalog, including its stock state.
 const linkRows=()=>{try{const data=JSON.parse(localStorage.getItem(KEY)||'{}');return [...filterList(data?.items,30,validListing),...SEED]}catch{return SEED}};
 window.IllyrianShopTargets=window.IllyrianShopTargets||{};
 window.IllyrianShopTargets.shopPlus={listings:linkRows,open:(type,id)=>{
  if(type==='listing'){const live=linkRows().find(p=>p.id===id);if(!live||JSON.stringify(live)!==JSON.stringify(all().find(p=>p.id===id)))return false}
  else if(type!=='business'||!all().some(p=>p.store===id))return false;
  open();if(type==='business'){state.shop=id;state.tab='stores'}else{state.selected=id;state.tab='item'}render();return true;
 }};
 function init(){
  const phone=document.querySelector('#phone');if(!phone)return;
  document.addEventListener('click',e=>{const el=e.target.closest('[data-isp-open]');if(el){e.preventDefault();e.stopPropagation();open()}},true);
  window.addEventListener('illyrian:language-changed',onLocaleChange);
  // Warn immediately but never rerender and erase an unsent form.
  window.addEventListener('storage',e=>{
   if(e.storageArea!==localStorage||(e.key!==KEY&&e.key!==null))return;
   if(localStorage.getItem(KEY)===expectedRaw)return;
   state.notice=feedback('storageConflict','Shop Plus u ndryshua në një skedë tjetër. Kopjo tekstin e papërfunduar dhe rifresko faqen para ruajtjes.');
   if(state.open)showStorageError();
  });
  document.addEventListener('keydown',e=>{
   if(!state.open)return;
   if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return}
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
  phone.addEventListener('change',e=>{
   if(!state.open||!overlay?.contains(e.target))return;
   if(e.target.matches('#isp-create select[name="type"]'))syncCreateType(e.target.form);
  });
  phone.addEventListener('input',e=>{
   if(!state.open||!overlay?.contains(e.target))return;
   const control=e.target;
   const ids=(control.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean);
   if(!ids.includes('isp-validation-feedback'))return;
   control.removeAttribute('aria-invalid');
   const rest=ids.filter(id=>id!=='isp-validation-feedback');
   if(rest.length)control.setAttribute('aria-describedby',rest.join(' '));
   else control.removeAttribute('aria-describedby');
  });
  phone.addEventListener('submit',e=>{
   if(!state.open||!overlay?.contains(e.target))return;
   e.preventDefault();submit(e.target);
  });
  queueMicrotask(inject);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
