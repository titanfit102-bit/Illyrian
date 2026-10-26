/* ILLYRIAN Shop v1.7 - browser-only conceptual prototype; no real orders/payments. */
(()=>{'use strict';
 const KEY='illyrian_demo_v17_shop';
 const CATEGORIES=['Të gjitha','Produkte','Makina','Prona','Banesa me qira','Shërbime','Punë'];
 const CITIES=['Të gjitha','Tiranë','Durrës','Shkodër','Vlorë','Elbasan','Prishtinë'];
 const SEED=[
  {id:'p1',kind:'Produkte',name:'Kafe espresso 250 g',store:'Market Arbër',city:'Tiranë',price:5.5,unit:'copë',emoji:'☕',description:'Kafe e bluar për espresso. Produkt shembull.'},
  {id:'p2',kind:'Produkte',name:'Kafe espresso 250 g',store:'Shije Shqiptare',city:'Tiranë',price:5.2,unit:'copë',emoji:'☕',description:'Kafe espresso në paketim 250 g, ofertë demonstrative.'},
  {id:'p3',kind:'Produkte',name:'Kafe espresso 250 g',store:'Mini Market Bora',city:'Durrës',price:5.8,unit:'copë',emoji:'☕',description:'Kafe espresso për shtëpi dhe zyrë.'},
  {id:'p4',kind:'Produkte',name:'Atlete sportive',store:'Urban Steps',city:'Tiranë',price:48,unit:'palë',emoji:'👟',description:'Atlete për përdorim të përditshëm; madhësitë verifikohen me dyqanin.'},
  {id:'p5',kind:'Produkte',name:'Makineri kafeje espresso',store:'Elektro Albania',city:'Shkodër',price:129,unit:'copë',emoji:'🔌',description:'Pajisje shtëpiake demonstrative, pa garanci tregtare reale.'},
  {id:'p6',kind:'Produkte',name:'Mjaltë mali 500 g',store:'Bletaria Drini',city:'Tiranë',price:10,unit:'kavanoz',emoji:'🍯',description:'Listim ushqimor demonstrues.'},
  {id:'c1',kind:'Makina',name:'Volkswagen Golf 7 · 2017',store:'Auto Durrësi',city:'Durrës',price:9800,unit:'automjet',emoji:'🚗',description:'1.6 TDI · 142 000 km · shembull; dokumentacioni nuk është verifikuar.'},
  {id:'c2',kind:'Makina',name:'Toyota Yaris Hybrid · 2019',store:'Auto Tirana',city:'Tiranë',price:11600,unit:'automjet',emoji:'🚙',description:'Hybrid · 91 000 km · ofertë demonstrative.'},
  {id:'h1',kind:'Banesa me qira',name:'Apartament 2+1 me qira',store:'Banesa Tirana',city:'Tiranë',price:540,unit:'muaj',emoji:'🏠',description:'Zona Komuna e Parisit; shifrat dhe disponueshmëria janë shembuj.'},
  {id:'h2',kind:'Banesa me qira',name:'Garsoniere pranë detit',store:'Qira Durrës',city:'Durrës',price:290,unit:'muaj',emoji:'🏡',description:'Listim demonstrues; nuk është rezervim real.'},
  {id:'s1',kind:'Shërbime',name:'Pastrim banese',store:'Shërbime Elbasani',city:'Elbasan',price:45,unit:'shërbim',emoji:'🧹',description:'Kërko ofertë sipas sipërfaqes dhe kushteve.'},
  {id:'property1',kind:'Prona',name:'Apartament në shitje',store:'Prona Shembull',city:'Tiranë',price:95000,unit:'pronë',emoji:'🏘️',description:'Shitje prone demonstrative. Nuk kryhet rezervim ose pagesë.'},
  {id:'job1',kind:'Punë',name:'Kërkohet barist',store:'Kafe Demo',city:'Durrës',price:0,unit:'muaj',emoji:'💼',description:'Shpallje pune fiktive. Orari dhe paga diskutohen vetëm në simulim.'},
  {id:'s2',kind:'Shërbime',name:'Riparim celulari',store:'Phone Lab',city:'Prishtinë',price:20,unit:'nga',emoji:'📱',description:'Çmim orientues demonstrues; ofruesi konfirmon koston.'}
 ];
 function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return v&&typeof v==='object'&&!Array.isArray(v)?v:{}}catch{return {}}}
 const restored=read();
 const state={open:false,view:'browse',query:'',category:'Të gjitha',city:'Të gjitha',sort:'relevance',store:'',selected:null,discovery:'offers',business:'',
  listings:Array.isArray(restored.listings)?restored.listings.filter(v=>v&&typeof v==='object'&&typeof v.name==='string').slice(0,30):[],
  cart:restored.cart&&typeof restored.cart==='object'&&!Array.isArray(restored.cart)?restored.cart:{},
  orders:Array.isArray(restored.orders)?restored.orders.slice(0,20):[],
  requests:Array.isArray(restored.requests)?restored.requests.slice(0,30):[]};
 let opener=null, layer=null, toastTimer=null;
 const all=()=>[...state.listings,...SEED];
 const clean=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const shopMessage=(key,fallback)=>window.IllyrianI18n?.t('shop:'+key)||fallback;
 const money=n=>{const v=Number(n||0),locale=window.IllyrianI18n?.language||'it';return new Intl.NumberFormat(locale,{style:'currency',currency:'EUR',minimumFractionDigits:v%1?2:0,maximumFractionDigits:2}).format(v)};
 const categoryKey={'Të gjitha':'all','Produkte':'products','Makina':'cars','Prona':'properties','Banesa me qira':'rentals','Shërbime':'services','Punë':'jobs'};
 const categoryLabel=code=>Object.prototype.hasOwnProperty.call(categoryKey,code)?shopMessage(categoryKey[code],code):String(code??'');
 const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('sq');
 const searchText=p=>normalize([p.name,p.store,p.city,p.kind||p.type,p.description||p.details,...['sq','en','it'].map(l=>window.IllyrianI18n?.t('shop:'+categoryKey[p.kind||p.type],{lng:l})||'')].join(' '));
 // Presentation only: no catalog/state is copied between Shop and Shop Plus.
 const businessProfile=(name,rows)=>{
  const known=['Market Arbër','Phone Lab'].includes(name);
  const cities=[...new Set(rows.map(p=>typeof p.city==='string'?p.city:'').filter(Boolean))];
  const kinds=[...new Set(rows.map(p=>p.kind||p.type))];
  const stock=rows.filter(p=>p.type==='Produkte'&&Number.isFinite(p.quantity)&&p.quantity>0).length;
  return `<section class="ils-business-profile"><span data-i18n-direct>${clean(shopMessage('businessDemo','Profil biznesi · DEMO'))}</span><h2 data-user-content>${clean(name)}</h2><p data-i18n-direct>${clean(shopMessage('businessFictional','Të dhëna fiktive; identiteti nuk është verifikuar.'))}</p><dl><dt data-i18n-direct>${clean(shopMessage('city','Qyteti'))}</dt><dd data-user-content>${clean(cities.join(', '))}</dd><dt data-i18n-direct>${clean(shopMessage('businessHours','Orari'))}</dt><dd data-hours data-i18n-direct>${clean(shopMessage(known?'hoursExample':'hoursUnknown',known?'Hën–Sht 09:00–18:00 (shembull)':'Orari nuk është dhënë'))}</dd><dt data-i18n-direct>${clean(shopMessage('businessLocation','Vendndodhja opsionale'))}</dt><dd data-i18n-direct>${clean(shopMessage('locationPrivate','Adresa e saktë nuk është publikuar. GPS nuk kërkohet.'))}</dd></dl><p data-contact data-i18n-direct>${clean(shopMessage('contactDemo','Kontakt vetëm në simulim. Nuk dërgohet mesazh real.'))}</p><p data-i18n-direct>${kinds.map(x=>clean(categoryLabel(x))).join(' · ')}</p><p data-i18n-direct>${rows.length} ${clean(shopMessage('businessOffers','oferta demonstrative'))} · ${stock?stock+' '+clean(shopMessage('businessStock','oferta me stok demonstrues')):clean(shopMessage('availabilityUnknown','Disponueshmëria nuk është konfirmuar'))}</p></section>`;
 };
 window.IllyrianShopDiscovery=Object.freeze({searchText,businessProfile});
 const price=p=>p.kind==='Punë'?(Number(p.price)>0?money(p.price)+' '+clean(shopMessage('salaryBasis','/muaj · orientuese')):clean(shopMessage('salaryUnknown','Paga nuk është deklaruar'))):money(p.price)+(p.kind==='Banesa me qira'?'/muaj':p.unit==='nga'?' nga':'');
 const persistentData=()=>({listings:state.listings,cart:state.cart,orders:state.orders,requests:state.requests});
 const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(persistentData()));return true}catch{notify(shopMessage('storageFull','Nuk u ruajt: hapësira lokale është plot.'));return false}};
 // Keep the on-screen and stored Shop state consistent if persistence is denied (quota/private mode).
 const transact=change=>{const before=JSON.stringify(persistentData());change();if(persist())return true;Object.assign(state,JSON.parse(before));return false};
 const byId=id=>all().find(p=>p.id===id);
 const matches=(p)=>{
  const q=normalize(state.query).trim();
  const text=searchText(p);
  return (!q||q.split(/\s+/).every(word=>text.includes(word)))&&(state.category==='Të gjitha'||p.kind===state.category)&&(state.city==='Të gjitha'||p.city===state.city)&&(!state.store||p.store===state.store);
 };
 const storeName=p=>typeof p.store==='string'?p.store:'';
 const visible=()=>{const x=all().filter(matches);if(state.sort==='price-low')x.sort((a,b)=>a.price-b.price);if(state.sort==='price-high')x.sort((a,b)=>b.price-a.price);if(state.sort==='store')x.sort((a,b)=>storeName(a).localeCompare(storeName(b),'sq')||String(a.id??'').localeCompare(String(b.id??''),'sq'));return x};
 const shops=()=>[...new Set(visible().map(storeName).filter(Boolean))];
 const tile=p=>`<article class="ils-card"><div class="ils-illustration" aria-hidden="true">${clean(p.emoji||'📦')}</div><div class="ils-card-main"><span class="ils-kind">${clean(categoryLabel(p.kind))}</span><h3>${clean(p.name)}</h3><strong>${price(p)}</strong><p data-user-content>${clean(storeName(p)||'Dyqan i papërcaktuar')} · ${clean(p.city)}</p><button class="ils-btn ils-secondary" data-ils="detail" data-id="${clean(p.id)}">Shiko detajet</button></div></article>`;
 const header=(sub)=>`<header class="ils-top"><button data-ils="back" class="ils-back" aria-label="Kthehu te ILLYRIAN">←</button><div><strong>ILLYRIAN <span>Shop</span></strong><small>${clean(sub||'Gjej, krahaso dhe zbulo oferta')}</small></div><button data-ils="cart" class="ils-cart" aria-label="Hap shportën">🛒 <b>${cartCount()}</b></button></header>`;
 const cartCount=()=>Object.values(state.cart).reduce((a,b)=>a+Math.min(99,Math.max(0,Number(b)||0)),0);
 const cartItems=()=>Object.entries(state.cart).map(([id,qty])=>({p:byId(id),qty:Math.min(99,Math.max(0,Number(qty)||0))})).filter(x=>x.p&&x.p.kind==='Produkte'&&x.qty>0);
 const cartTotal=()=>cartItems().reduce((n,x)=>n+x.p.price*x.qty,0);
 const btn=(action,text,cls='ils-btn')=>`<button class="${cls}" data-ils="${action}">${text}</button>`;
 const status=()=>'<p class="ils-demo-note">DEMO · Listimet janë fiktive. Nuk kryhen pagesa, dërgesa ose kontakte reale.</p>';
 function browse(){
  const data=visible(),foundShops=shops();
  return `<section class="ils-splash"><span>MARKETPLACE SHQIPTAR · PROTOTIP</span><h2>Gjej produktin në disa dyqane.</h2><p>Produkte, biznese lokale, makina, banesa me qira dhe shërbime.</p></section>
   <label class="ils-search"><span aria-hidden="true">⌕</span><input id="ils-search" type="search" placeholder="Kërko produkt, dyqan, makinë, banesë…" value="${clean(state.query)}" autocomplete="off" aria-label="Kërko në ILLYRIAN Shop"></label>
   <div class="ils-category" role="group" aria-label="Kategoritë">${CATEGORIES.map(c=>`<button data-i18n-direct data-ils="category" data-value="${clean(c)}" class="${state.category===c?'selected':''}" aria-pressed="${state.category===c}">${clean(categoryLabel(c))}</button>`).join('')}</div>
   <div class="ils-filter"><label>Qyteti<select id="ils-city">${CITIES.map(c=>`<option value="${clean(c)}" ${state.city===c?'selected':''}>${clean(c)}</option>`).join('')}</select></label><label>Renditja<select id="ils-sort"><option value="relevance" ${state.sort==='relevance'?'selected':''}>Relevanca</option><option value="price-low" ${state.sort==='price-low'?'selected':''}>Çmimi: më i ulët</option><option value="price-high" ${state.sort==='price-high'?'selected':''}>Çmimi: më i lartë</option><option value="store" ${state.sort==='store'?'selected':''}>Emri i dyqanit</option></select></label></div>
   <nav class="ils-discovery" aria-label="${clean(shopMessage('discoveryViews','Pamjet e Shop'))}" data-i18n-direct><button data-ils="offers" aria-pressed="${state.discovery==='offers'}">${clean(shopMessage('offersView','Ofertat'))}</button><button data-ils="businesses" aria-pressed="${state.discovery==='businesses'}">${clean(shopMessage('businessesView','Bizneset'))}</button></nav>
   <div class="ils-actions">${btn('sell','+ Publiko listimin tënd')}${btn('my','Listimet e mia','ils-btn ils-secondary')}</div>
   ${state.store?`<div class="ils-selected-store">Dyqani: <strong>${clean(state.store)}</strong> <button data-ils="clear-store">Hiq filtrin ×</button></div>`:''}
   <div class="ils-section-head"><h3>${data.length} rezultate</h3><small>${foundShops.length} dyqane/ofrues</small></div>
   ${state.query&&foundShops.length?`<section class="ils-shops"><strong>Ku gjendet kërkimi yt?</strong><div>${foundShops.map(x=>`<button data-ils="store" data-value="${clean(x)}">${clean(x)}</button>`).join('')}</div></section>`:''}
   ${state.discovery==='businesses'?`<section id="ils-businesses">${foundShops.length?foundShops.map(x=>`<article class="ils-seller"><h3 data-user-content>${clean(x)}</h3><p data-user-content>${clean([...new Set(data.filter(p=>storeName(p)===x).map(p=>p.city))].join(', '))}</p><button data-ils="business" data-value="${clean(x)}" data-i18n-direct>${clean(shopMessage('viewBusiness','Shiko biznesin'))}</button></article>`).join(''):`<p data-i18n-direct>${clean(shopMessage('businessEmpty','Nuk u gjet biznes me këta filtra.'))}</p>`}</section>`:data.length?`<div class="ils-results">${data.map(tile).join('')}</div>`:'<div class="ils-empty">Nuk u gjet asnjë listim. Ndrysho filtrat ose provo një kërkim tjetër.</div>'}
   ${status()}`;
 }
 function detail(){const p=byId(state.selected);if(!p)return '<div class="ils-empty">Listimi nuk ekziston.</div>';
  return `<button class="ils-text-link" data-ils="browse">← Kthehu te rezultatet</button><div class="ils-product-cover" aria-hidden="true">${clean(p.emoji)}</div><span class="ils-kind">${clean(categoryLabel(p.kind))} · ${clean(p.city)}</span><h2 data-user-content>${clean(p.name)}</h2><h3 class="ils-price">${price(p)}</h3><p class="ils-description" data-user-content>${clean(p.description)}</p><div class="ils-seller"><small>Shitësi / dyqani</small><strong data-user-content>${clean(storeName(p)||'Dyqan i papërcaktuar')}</strong><button data-ils="store" data-value="${clean(storeName(p))}">Shiko listimet e këtij dyqani →</button><button data-ils="business" data-value="${clean(storeName(p))}" data-i18n-direct>${clean(shopMessage('viewBusiness','Shiko biznesin'))}</button></div>
   ${p.kind==='Produkte'?btn('add','+ Shto në shportë'):btn('contact','Kërko informacion (demo)')}
   ${p.owned?btn('edit','Ndrysho listimin','ils-btn ils-secondary')+btn('delete','Fshi listimin','ils-btn ils-secondary'):''}
   <div class="ils-info"><strong>Transaksion demonstrues</strong><p>Nuk ka pagesë reale, shpërndarje të dhënash apo verifikim shitësi. Kontakto vetëm brenda simulimit.</p></div>`;
 }
 function business(){const rows=all().filter(p=>storeName(p)===state.business);return `<button class="ils-text-link" data-ils="browse">← Kthehu te Shop</button>${businessProfile(state.business,rows)}<button class="ils-btn" data-ils="business-catalog" data-i18n-direct>${clean(shopMessage('businessCatalog','Shiko ofertat e biznesit'))}</button>${status()}`;}
 function syncKind(form){if(!form)return;const job=form.elements.kind.value==='Punë',input=form.elements.price;input.required=!job;input.min=job?'0':'0.5';const label=form.querySelector('[data-price-label]');if(label)label.textContent=shopMessage(job?'salaryOptional':'listingPrice',job?'Paga orientuese € (opsionale)':'Çmimi (€)');}
 function form(){const editing=state.view==='edit',p=editing?byId(state.selected):null;
 const option=(arr,value)=>arr.map(x=>`<option data-i18n-direct value="${clean(x)}" ${x===value?'selected':''}>${clean(CATEGORIES.includes(x)?categoryLabel(x):x)}</option>`).join('');
 return `<button class="ils-text-link" data-ils="browse">← Kthehu në Shop</button><h2>${editing?'Ndrysho listimin':'Publiko një listim'}</h2><p class="ils-description">Listimet ruhen vetëm në shfletuesin tënd. Nuk shfaqen te përdorues të tjerë.</p>
 <form id="ils-sell-form" class="ils-form">
 <label>Kategoria<select name="kind" required>${option(CATEGORIES.slice(1),p?.kind||'Produkte')}</select></label>
 <label>Emri i produktit / ofertës<input name="name" maxlength="90" required minlength="4" value="${clean(p?.name||'')}" placeholder="p.sh. Kafe espresso 250 g"></label>
 <label>Dyqani ose emri i shitësit<input name="store" maxlength="70" required minlength="2" value="${clean(p?.store||'')}" placeholder="p.sh. Dyqani im"></label>
 <label>Qyteti<select name="city">${option(CITIES.slice(1),p?.city||'Tiranë')}</select></label>
 <label><span data-price-label data-i18n-direct>Çmimi (€)</span><input name="price" type="number" required min="0.5" max="10000000" step="0.01" value="${p?.price||''}" placeholder="p.sh. 25"></label>
 <label>Përshkrimi<textarea name="description" maxlength="450" rows="4" placeholder="Karakteristikat, gjendja, kushtet…">${clean(p?.description||'')}</textarea></label>
 <button class="ils-btn" type="submit">${editing?'Ruaj ndryshimet':'Publiko vetëm në demo'}</button></form>${status()}`;
 }
 function my(){return `<button class="ils-text-link" data-ils="browse">← Kthehu te Shop</button><h2>Listimet e mia</h2><p class="ils-description">Krijohen, redaktohen dhe fshihen vetëm lokalisht në pajisjen tënde.</p><div class="ils-results">${state.listings.length?state.listings.map(tile).join(''):'<div class="ils-empty">Ende nuk ke publikuar listime.</div>'}</div>${btn('sell','+ Shto listim')}`;}
 function cart(){const rows=cartItems(),total=cartTotal(),fee=total*0.05;
  return `<button class="ils-text-link" data-ils="browse">← Kthehu te Shop</button><h2>Shporta ime</h2>
   <p class="ils-description">Shporta pranon vetëm produkte për demonstrim. Makina dhe qiratë kanë kërkesa kontakti të ndara.</p>
   ${rows.length?rows.map(({p,qty})=>`<div class="ils-cart-row"><span>${clean(p.emoji)}</span><div><strong>${clean(p.name)}</strong><small>${clean(p.store)} · ${money(p.price)} × ${qty}</small></div><button data-ils="remove-cart" data-id="${clean(p.id)}">Hiq</button></div>`).join(''):'<div class="ils-empty">Shporta është bosh.</div>'}
   ${rows.length?`<div class="ils-checkout"><div><span>Vlera totale</span><strong>${money(total)}</strong></div><p>Shembull ilustrues me komision platforme <b>5%</b>: ${money(fee)} për platformën dhe ${money(total-fee)} për shitësit, para kostove dhe taksave. <strong>Kjo normë nuk është miratuar si tarifë reale.</strong></p>${btn('checkout','Simulo porosinë')}</div>`:''}
  ${status()}`;
 }
 function confirmation(){return `<div class="ils-success"><span>✓</span><h2>Veprimi u regjistrua vetëm në demo</h2><p>Nuk është kryer pagesë, rezervim ose kontakt me shitësin.</p>${btn('browse','Vazhdo të kërkosh')}</div>`;}
 const page=()=>state.view==='browse'?browse():state.view==='detail'?detail():state.view==='business'?business():state.view==='sell'||state.view==='edit'?form():state.view==='my'?my():state.view==='cart'?cart():confirmation();
 function render(refocus){if(!layer||!state.open)return;const prev=document.activeElement;const id=prev?.id;const wasIn=prev&&layer.contains(prev);layer.innerHTML=header(state.view==='browse'?'Kërko nga të gjitha dyqanet':'Shfletim demonstrues')+`<section class="ils-body">${page()}</section>`;syncKind(layer.querySelector('#ils-sell-form'));if(refocus&&wasIn){const next=id?layer.querySelector('#'+id):null;(next||layer.querySelector('button,input,select,textarea'))?.focus({preventScroll:true})}}
 function notify(message){if(!layer)return;const old=layer.querySelector('.ils-toast');if(old)old.remove();const div=document.createElement('div');div.className='ils-toast';div.role='status';div.textContent=message;layer.appendChild(div);if(toastTimer)clearTimeout(toastTimer);toastTimer=setTimeout(()=>div.remove(),3500)}
 function show(){opener=document.activeElement;state.open=true;state.view='browse';state.store='';layer=document.createElement('section');layer.id='illyrian-shop-layer';layer.className='ils-overlay';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label','ILLYRIAN Shop');document.querySelector('#phone')?.appendChild(layer);for(const sel of ['#screen','#navbar','.head']){const el=document.querySelector('#phone > '+sel);if(el)el.inert=true}render();layer.querySelector('#ils-search')?.focus({preventScroll:true});}
 function close(){state.open=false;layer?.remove();layer=null;for(const sel of ['#screen','#navbar','.head']){const el=document.querySelector('#phone > '+sel);if(el)el.inert=false}if(opener?.isConnected)opener.focus({preventScroll:true});else document.querySelector('[data-ilshop-open],#navbar button')?.focus({preventScroll:true});window.dispatchEvent(new CustomEvent('illyrian:shop:closed',{detail:{source:'shop'}}));}
 function openFromEntry(event){event.preventDefault();event.stopPropagation();if(!state.open)show();}
 function inject(){const screen=document.getElementById('screen');if(!screen||state.open)return;
   if(screen.querySelector('[data-ilshop-open]'))return;
   const home=screen.querySelector('.stories,.v15-studio');const explore=screen.querySelector('#finder');
   if(!home&&!explore)return;
   const entry=document.createElement('div');entry.className='ils-entry';entry.innerHTML=`<div><span>ILLYRIAN SHOP · DEMO v1.7</span><strong>Gjej produkte, makina dhe banesa.</strong><small>Kërko dhe krahaso listime nga dyqane të ndryshme.</small></div><button type="button" data-ilshop-open="1">Hap Shop →</button>`;
   if(explore){const heading=screen.querySelector('.section-header');(heading||explore.parentElement).insertAdjacentElement('afterend',entry)}else{const composer=screen.querySelector(':scope > .stories + .compose');(composer||home).insertAdjacentElement('afterend',entry)}
 }
 const screen=document.getElementById('screen');if(!screen||!document.getElementById('phone'))return;
 new MutationObserver(()=>inject()).observe(screen,{childList:true,subtree:false});inject();
 document.addEventListener('click',event=>{const openerButton=event.target.closest?.('[data-ilshop-open]');if(openerButton){openFromEntry(event);return}
  if(!state.open||!layer||!layer.contains(event.target))return;
  const button=event.target.closest?.('[data-ils]');if(!button)return;
  event.preventDefault();event.stopPropagation();const action=button.dataset.ils,id=button.dataset.id;
  if(action==='back'){if(state.view==='browse')close();else{state.view='browse';state.store='';render()}return}
  if(action==='browse'){state.view='browse';state.store='';render();return}
  if(action==='offers'||action==='businesses'){state.discovery=action;render();return}
  if(action==='business'){state.business=button.dataset.value||'';state.view='business';render();return}
  if(action==='business-catalog'){state.store=state.business;state.discovery='offers';state.view='browse';render();return}
  if(action==='cart'){state.view='cart';render();return}
  if(action==='sell'){state.view='sell';state.selected=null;render();return}
  if(action==='my'){state.view='my';render();return}
  if(action==='category'){state.category=button.dataset.value||'Të gjitha';state.store='';render();return}
  if(action==='store'){state.store=button.dataset.value||'';state.view='browse';render();return}
  if(action==='clear-store'){state.store='';render();return}
  if(action==='detail'){state.selected=id;state.view='detail';render();return}
  if(action==='add'){const p=byId(state.selected);if(!p||p.kind!=='Produkte')return;if(!transact(()=>{state.cart[p.id]=Math.min(99,(Number(state.cart[p.id])||0)+1)}))return;render();notify(shopMessage('addedCartNotice','Produkti u shtua në shportën demonstrative.'));return}
  if(action==='remove-cart'){if(!transact(()=>{delete state.cart[id]}))return;render();return}
  if(action==='checkout'){if(!cartItems().length)return;if(!transact(()=>{state.orders.unshift({created:Date.now(),total:cartTotal(),lines:cartItems().length,status:'DEMO'});state.orders=state.orders.slice(0,20);state.cart={}}))return;state.view='confirmation';render();return}
  if(action==='contact'){const p=byId(state.selected);if(!p)return;if(!transact(()=>{state.requests.unshift({id:p.id,at:Date.now()});state.requests=state.requests.slice(0,30)}))return;state.view='confirmation';render();return}
  if(action==='edit'){const p=byId(state.selected);if(!p?.owned)return;state.view='edit';render();return}
  if(action==='delete'){const p=byId(state.selected);if(!p?.owned||!confirm(shopMessage('confirmDelete','Ta fshijmë këtë listim demonstrues?')))return;if(!transact(()=>{state.listings=state.listings.filter(x=>x.id!==p.id);delete state.cart[p.id]}))return;state.selected=null;state.view='my';render();return}
 },true);
 document.addEventListener('input',event=>{if(!state.open||event.target?.id!=='ils-search')return;const pos=event.target.selectionStart;const value=event.target.value;const scroll=layer.querySelector('.ils-body')?.scrollTop||0;state.query=value;render();const input=layer.querySelector('#ils-search');if(input){input.focus({preventScroll:true});try{input.setSelectionRange(pos,pos)}catch{}}if(layer.querySelector('.ils-body'))layer.querySelector('.ils-body').scrollTop=scroll;},true);
 document.addEventListener('change',event=>{if(!state.open)return;if(event.target?.matches?.('#ils-sell-form [name=kind]')){syncKind(event.target.form);return}if(event.target?.id==='ils-city'){state.city=event.target.value;render()}else if(event.target?.id==='ils-sort'){state.sort=event.target.value;render()}},true);
 document.addEventListener('submit',event=>{if(!state.open||event.target?.id!=='ils-sell-form')return;event.preventDefault();event.stopPropagation();const f=new FormData(event.target);const kind=String(f.get('kind')||'');const name=String(f.get('name')||'').trim();const store=String(f.get('store')||'').trim();const city=String(f.get('city')||'');const price=Number(f.get('price'));
  if(!CATEGORIES.slice(1).includes(kind)||name.length<4||store.length<2||!CITIES.slice(1).includes(city)||!Number.isFinite(price)||price<(kind==='Punë'?0:0.5)||price>1e7){notify(shopMessage('invalidListing','Kontrollo kategorinë, emrin, dyqanin, qytetin dhe çmimin.'));return}
  const data={kind,name:name.slice(0,90),store:store.slice(0,70),city,price:Math.round(price*100)/100,description:String(f.get('description')||'').slice(0,450),emoji:kind==='Makina'?'🚗':kind==='Banesa me qira'||kind==='Prona'?'🏠':kind==='Punë'?'💼':kind==='Shërbime'?'🛠️':'📦',owned:true,unit:kind==='Banesa me qira'?'muaj':'copë'};
  const current=state.view==='edit'?byId(state.selected):null;if(state.view==='edit'&&!current?.owned)return;
  if(!current&&state.listings.length>=30){notify(shopMessage('maxListings','Maksimumi 30 listime demonstrative.'));return}
  if(!current)data.id='user-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
  if(!transact(()=>{if(current)Object.assign(current,data);else state.listings.unshift(data)}))return;
  state.selected=data.id||state.selected;state.view='my';render();notify(shopMessage('listingSaved','Listimi u ruajt vetëm në këtë shfletues.'));
 },true);
 // Directly localized new controls also repaint without losing a draft or focus.
 window.addEventListener('illyrian:language-changed',()=>{
  if(!state.open||!layer)return;
  const form=layer.querySelector('#ils-sell-form'),fields=form?[...form.elements].filter(el=>el.name).map(el=>({name:el.name,value:el.value})):[];
  const active=document.activeElement,id=active?.id,name=active?.name,action=active?.dataset?.ils,value=active?.dataset?.value;
  render();const next=layer.querySelector('#ils-sell-form');
  if(next){fields.forEach(f=>{const el=next.elements.namedItem(f.name);if(el)el.value=f.value});syncKind(next)}
  const target=name?next?.elements.namedItem(name):id?layer.querySelector('#'+CSS.escape(id)):action?layer.querySelector('[data-ils="'+CSS.escape(action)+'"]'+(value?'[data-value="'+CSS.escape(value)+'"]':'')):null;
  if(active&&layer.contains(active))return;
  if(target)target.focus({preventScroll:true});
 });
 // Read-only social reference adapter; its data still belongs to this Shop.
 const linkRows=()=>{const data=read();return [...(Array.isArray(data.listings)?data.listings.filter(p=>p&&typeof p==='object'&&typeof p.name==='string'):[]),...SEED]};
 window.IllyrianShopTargets=window.IllyrianShopTargets||{};
 window.IllyrianShopTargets.shop={listings:linkRows,open:(type,id)=>{
  if(type==='listing'){const live=linkRows().find(p=>p.id===id);if(!live||JSON.stringify(live)!==JSON.stringify(byId(id)))return false}
  else if(type!=='business'||!all().some(p=>storeName(p)===id))return false;
  if(!state.open)show();
  if(type==='business'){state.business=id;state.view='business'}else{state.selected=id;state.view='detail'}
  render();layer.querySelector('[data-ils="back"]')?.focus({preventScroll:true});return true;
 }};
 document.addEventListener('keydown',event=>{if(!state.open||!layer)return;
  if(event.key==='Escape'){if(document.getElementById('isp-root'))return;event.stopImmediatePropagation();event.preventDefault();close();return}
  if(event.key!=='Tab')return;const focused=[...layer.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')].filter(x=>x.getClientRects().length);if(!focused.length)return;const first=focused[0],last=focused[focused.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 },true);
})();
