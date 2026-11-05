/* Phase 2 local social references. No inventory, orders, network, billing or auth. */
(()=>{'use strict';
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const text=k=>window.IllyrianI18n?.t('commerce:'+k)||k;
 const adapters=()=>window.IllyrianShopTargets||{};
 const valid=r=>r&&['shop','shopPlus'].includes(r.source)&&['listing','business'].includes(r.type)&&typeof r.id==='string'&&r.id.length>0&&r.id.length<=100;
 const refs=x=>Array.isArray(x)?x.filter(valid).slice(0,2).map(r=>({source:r.source,type:r.type,id:r.id})):[];
 const value=r=>r.source+'|'+r.type+'|'+encodeURIComponent(r.id);
 const parse=s=>{try{const a=String(s).split('|'),r={source:a[0],type:a[1],id:decodeURIComponent(a[2]||'')};return a.length===3&&valid(r)?r:null}catch{return null}};
 function resolve(r){
  if(!valid(r))return {available:false,reason:'missing'};
  const rows=adapters()[r.source]?.listings()||[];
  if(r.type==='business')return rows.some(p=>typeof p.store==='string'&&p.store===r.id)?{available:true,label:r.id}:{available:false,reason:'missing'};
  const p=rows.find(p=>p.id===r.id);if(!p)return {available:false,reason:'missing'};
  const expiry=p.expires??p.expiresAt??p.expires_at;
  if(expiry!==undefined&&(!Number.isFinite(Date.parse(expiry))||Date.parse(expiry)<=Date.now()))return {available:false,label:p.name,reason:'expired'};
  if(p.available===false||p.status&&!['active','published','available'].includes(p.status))return {available:false,label:p.name,reason:'unavailable'};
  if((p.kind||p.type)==='Produkte'&&p.quantity!=null&&(!Number.isFinite(Number(p.quantity))||Number(p.quantity)<=0))return {available:false,label:p.name,reason:'stock'};
  return {available:true,label:p.name};
 }
 function choices(type){
  const out=[];
  for(const source of ['shop','shopPlus']){
   const seen=new Set();for(const p of adapters()[source]?.listings()||[]){
    if(type==='listing'&&!['Produkte','Shërbime'].includes(p.kind||p.type))continue;
    const id=type==='business'?p.store:p.id;
    if(typeof id!=='string'||!id||id.length>100||seen.has(id))continue;seen.add(id);
    out.push({source,type,id});
   }
  }return out;
 }
 function options(type,selected){
  const list=choices(type);if(selected&&!list.some(r=>value(r)===selected)){const old=parse(selected);if(old)list.push(old)}
  return '<option value="">'+esc(text('none'))+'</option>'+list.map(r=>{const v=value(r),p=resolve(r);return '<option value="'+esc(v)+'" '+(v===selected?'selected ':'')+(!p.available&&v!==selected?'disabled ':'')+'>'+esc((p.label||text('missing'))+' · '+(r.source==='shop'?'Shop':'Shop Plus')+(!p.available?' · '+text(p.reason):''))+'</option>'}).join('');
 }
 function fields(prefix,data={}){
  const items=refs(data.commerceRefs),get=t=>items.find(r=>r.type===t),id=t=>'ily-commerce-'+prefix+'-'+t;
  return '<fieldset class="ily-commerce-form" data-i18n-direct data-commerce-prefix="'+esc(prefix)+'"><legend>'+esc(text('tagHeading'))+'</legend>'+
   (prefix==='post'?'<label for="'+id('business')+'">'+esc(text('business'))+'</label><select id="'+id('business')+'">'+options('business',get('business')?value(get('business')):'')+'</select>':'')+
   '<label for="'+id('listing')+'">'+esc(text('listing'))+'</label><select id="'+id('listing')+'">'+options('listing',get('listing')?value(get('listing')):'')+'</select>'+
   '<label class="ily-commerce-check"><input id="'+id('sponsored')+'" type="checkbox" '+(data.commerceSponsored===true?'checked':'')+'> '+esc(text('markSponsored'))+'</label><small>'+esc(text('demoOnly'))+'</small></fieldset>';
 }
 function read(prefix){
  const base='ily-commerce-'+prefix+'-',values=['business','listing'].map(t=>document.getElementById(base+t)?.value||'');
  return {refs:values.map(parse).filter(Boolean),invalid:values.some(v=>v&&!parse(v)),sponsored:!!document.getElementById(base+'sponsored')?.checked};
 }
 function tagHTML(items){return refs(items).map(r=>{const p=resolve(r);return '<button type="button" data-i18n-direct data-ily-commerce-open="'+esc(value(r))+'" '+(!p.available?'disabled ':'')+'>'+esc((r.type==='business'?text('business')+': ':'')+(p.label||text('missing'))+(!p.available?' · '+text(p.reason):' →'))+'</button>'}).join('')}
 const disclosure=sponsored=>sponsored===true?'<span data-i18n-direct data-ily-commerce-sponsored>'+esc(text('sponsored'))+'</span><small data-i18n-direct data-ily-commerce-disclosure>'+esc(text('notVerified'))+'</small>':'';
 function render(items,sponsored){const list=refs(items);return list.length||sponsored===true?'<aside class="ily-commerce-links">'+disclosure(sponsored)+'<div data-i18n-direct data-ily-commerce-refs="'+esc(JSON.stringify(list))+'">'+tagHTML(list)+'</div></aside>':''}
 function promotion(query){
  const ref={source:'shopPlus',type:'listing',id:'k2'},p=resolve(ref),q=String(query||'').trim().toLocaleLowerCase('sq');
  if(!p.available||q&&!String(p.label+' Shije Shqiptare Tiranë').toLocaleLowerCase('sq').includes(q))return '';
  return '<section class="ily-commerce-promotion">'+render([ref],true)+'</section>';
 }
 const lastHTML=new WeakMap();
 function refresh(){
  document.querySelectorAll('[data-ily-commerce-refs]').forEach(el=>{let r=[];try{r=JSON.parse(el.dataset.ilyCommerceRefs)}catch{}const html=tagHTML(r);if(lastHTML.get(el)!==html){lastHTML.set(el,html);const expected=document.createElement('template');expected.innerHTML=html;if(el.innerHTML!==expected.innerHTML)el.innerHTML=html;}});
 }
 let origin=null;
 document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-ily-commerce-open]');if(!button||button.disabled)return;
  event.preventDefault();event.stopImmediatePropagation();const ref=parse(button.dataset.ilyCommerceOpen),p=resolve(ref);
  if(!p.available){refresh();return;}
  const restore=window.IllyrianCommerceCore?.suspend(button.dataset.ilyCommerceOpen);
  if(adapters()[ref.source]?.open(ref.type,ref.id)){origin={source:ref.source,restore};}
  else{restore?.();refresh();window.IllyrianCommerceCore?.notice();}
 },true);
 window.addEventListener('illyrian:shop:closed',event=>{if(origin?.source!==event.detail?.source)return;const saved=origin;origin=null;saved.restore?.();refresh()});
 window.addEventListener('storage',refresh);
 window.addEventListener('illyrian:language-changed',()=>{
  const active=document.activeElement?.id;
  document.querySelectorAll('.ily-commerce-form').forEach(form=>{const prefix=form.dataset.commercePrefix,d=read(prefix),html=fields(prefix,{commerceRefs:d.refs,commerceSponsored:d.sponsored});form.outerHTML=html;});
  document.querySelectorAll('[data-ily-commerce-sponsored]').forEach(el=>el.textContent=text('sponsored'));
  document.querySelectorAll('[data-ily-commerce-disclosure]').forEach(el=>el.textContent=text('notVerified'));
  refresh();if(active)document.getElementById(active)?.focus({preventScroll:true});
 });
 window.IllyrianCommerce=Object.freeze({fields,read,render,promotion,refs,validate:items=>refs(items).every(r=>resolve(r).available)});
 const phone=document.getElementById('phone');if(phone)new MutationObserver(refresh).observe(phone,{childList:true,subtree:true});
 window.dispatchEvent(new Event('illyrian:commerce:ready'));
})();
