/* ILLYRIAN UI-only i18n; self-hosted i18next 25.7.0 (MIT).
 * Post, comment, message, seller and profile data are never translated here.
 */
(function(global){
'use strict';
const doc=global.document,key='illyrian_demo_ui_language_v1',base='en';
const locales=global.ILLYRIAN_LOCALES||{},supported=['sq','en','it'];
const rtl=['ar','he','fa','ur','ps'];
function normalize(l){const code=String(l||'').toLowerCase().split(/[-_]/)[0];return supported.includes(code)?code:null}
function detect(){
 let saved;try{saved=localStorage.getItem(key)}catch(_){}
 if(normalize(saved))return normalize(saved);
 for(const preferred of (navigator.languages||[navigator.language]).filter(Boolean)){
   const matched=normalize(preferred);if(matched)return matched;
 }
 return base;
}
let language=detect();
if(!global.i18next||!locales.en||!locales.sq||!locales.it)throw Error('ILLYRIAN: local i18next and sq/en/it required');
// Owner-approved UI copy policy: one disclosure in About, no repeated badges.
// Clean resource templates before interpolation; never rewrite user data/options.
function presentationCopy(value){
 if(typeof value!=='string'||!(/\bdemo(?:s|je|ja|n)?\b|\bdemonstr|\bdimostra[zt]/i.test(value)))return value;
 const tokens=[];
 let s=value.replace(/[\w.@/-]*demo[\w.@/-]*/gi,token=>(/[@/_-]/.test(token)||/\w\.\w/.test(token))?'COPYTOKEN'+(tokens.push(token)-1):token)
  .replace(/\bnga demoja(?: lokale)?\b/gi,'nga kjo pajisje')
  .replace(/\bDEMO\s*[·|—–]\s*/gi,'')
  .replace(/\bvetëm në këtë demo\b/gi,'vetëm në këtë pajisje')
  .replace(/\bnë këtë demo\b/gi,'në këtë pajisje')
  .replace(/\b(?:në demo|në demonstrim)\b/gi,'lokalisht')
  .replace(/\bkësaj demoje\b/gi,'këtij aplikacioni')
  .replace(/\bkjo demo\b/gi,'ky aplikacion')
  .replace(/\bkëtë demo\b/gi,'këtë aplikacion')
  .replace(/\bdemos\b/gi,'aplikacionit')
  .replace(/\bthis demo's\b/gi,"this app's")
  .replace(/\b(?:in the demo|in demo)\b/gi,'on this device')
  .replace(/\b(?:this demo|the demo)\b/gi,'this app')
  .replace(/\b(?:demo only|demonstration only)\b/gi,'Local only')
  .replace(/\bnella demo\b/gi,'in locale')
  .replace(/\bdella demo\b/gi,"dell’app")
  .replace(/\bsulla demo\b/gi,"sull’app")
  .replace(/\bquesta demo\b/gi,'questa app')
  .replace(/\bla demo\b/gi,'l’app')
  .replace(/\b(?:demo|demoje|demoja|demon|demonstrues(?:e)?|demonstrimi|demonstrative|demonstration|dimostrazion[ei]|dimostrativ[oaie])\b/gi,'')
  .replace(/\(\s*\)/g,'').replace(/[ \t]{2,}/g,' ')
  .replace(/\s+([,.;!?])/g,'$1').replace(/(?:\s*[·|—–]\s*)+$/g,'').replace(/\s*[·|—–]\s*([.,;!?])$/g,'$1')
  .replace(/^[\s·|—–:]+/g,'').trim();
 return s.replace(/COPYTOKEN(\d+)/g,(_,i)=>tokens[Number(i)]);
}
const presentationOverrides={
 sq:{'discover:disclaimer':'Kërkimi përmban vetëm profile dhe biznese shembull.','shopPlus:catalogIntro':'Krahaso dyqanet dhe shiko karakteristikat e ofertave.','shopPlus:itemDemoDescription':'Shiko të dhënat e ofertës.'},
 en:{'discover:disclaimer':'Search contains only sample profiles and businesses.','shopPlus:catalogIntro':'Compare shops and browse offer details.','shopPlus:itemDemoDescription':'View offer details.'},
 it:{'discover:disclaimer':'La ricerca contiene solo profili e attività di esempio.','shopPlus:catalogIntro':'Confronta i negozi e consulta le caratteristiche delle offerte.','shopPlus:itemDemoDescription':'Consulta i dettagli dell’offerta.'}
};
function presentationBundle(entries,ns,lang){
 return Object.fromEntries(Object.entries(entries).map(([k,v])=>[k,presentationOverrides[lang]?.[ns+':'+k]??(presentationCopy(v)||' ')]));
}
const resources={},namespaces=new Set();
Object.keys(locales).forEach(l=>{
 resources[l]={};Object.keys(locales[l]).forEach(ns=>{resources[l][ns]=presentationBundle(locales[l][ns],ns,l);namespaces.add(ns)});
});
const engine=global.i18next.createInstance();
engine.init({lng:language,fallbackLng:base,supportedLngs:supported,ns:[...namespaces],
 defaultNS:'common',resources,initImmediate:false,returnEmptyString:false,
 interpolation:{escapeValue:true}});
const phrases=new Map();
function reindex(){
 phrases.clear();
 // Dictionaries contain curated UI tokens, not user-provided strings.
 for(const lang of ['sq','en','it']){
  for(const [ns,items] of Object.entries(locales[lang]||{})){
    for(const [label,value] of Object.entries(items)){
      if(typeof value==='string'&&value&&!value.includes('{{')&&!phrases.has(value))
        phrases.set(value,ns+':'+label);
      const display=resources[lang]?.[ns]?.[label]??presentationCopy(value);
      if(typeof display==='string'&&display&&!display.includes('{{')&&!phrases.has(display))phrases.set(display,ns+':'+label);
    }
  }
 }
}
reindex();
const priorText=new WeakMap(),priorAttrs=new WeakMap();
const exclude='script,style,[data-demo-disclosure],textarea,[contenteditable],[data-user-content],[data-i18n-direct],.post-copy,.post-name,.post-photo,.v6-chat-bubble,.v6-message-bubble,.v6-comment-text,.ilp-chat-msg,.ilp-chat,.ils-product-title,.isp-listing-title,.bubble,.v6-bubble,.v4-inbox-content,.v6-inbox-item,.v16-comment-list,.v10-share-preview,.v5-preview-foot,.ils-card h3,.isp-card h3';
function replaced(s){
 const part=s.trim(),path=phrases.get(part);
 return path?s.replace(part,engine.t(path)):s;
}
function paintText(node){
 const parent=node.parentElement;
 if(!parent||!parent.closest('#phone')||parent.closest(exclude))return;
 if(!priorText.has(node))priorText.set(node,node.nodeValue);
 const v=replaced(priorText.get(node));if(node.nodeValue!==v)node.nodeValue=v;
}
function paintAttr(el,attr){
 if(!el.closest('#phone')||el.closest(exclude))return;
 const current=el.getAttribute(attr);if(current===null)return;
 let old=priorAttrs.get(el);if(!old){old={};priorAttrs.set(el,old)}
 if(!(attr in old))old[attr]=current;
 const value=replaced(old[attr]);if(current!==value)el.setAttribute(attr,value);
}
function paint(root){
 if(!root||![1,3,11].includes(root.nodeType))return;
 if(root.nodeType===3){paintText(root);return}
 const attrs=['placeholder','aria-label','title'];
 if(root.nodeType===1)attrs.forEach(a=>paintAttr(root,a));
 const walker=doc.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
 while(walker.nextNode()){
  const n=walker.currentNode;
  if(n.nodeType===3)paintText(n);else attrs.forEach(a=>paintAttr(n,a));
 }
}
function setDocument(){
 doc.documentElement.lang=language;doc.documentElement.dir=rtl.includes(language)?'rtl':'ltr';
 doc.documentElement.dataset.uiLanguage=language;
}
function settingsState(){
 doc.querySelectorAll('[data-illyrian-language]').forEach(node=>{
  const chosen=node.dataset.illyrianLanguage===language;
  node.setAttribute('aria-pressed',String(chosen));node.classList.toggle('chosen',chosen);
 });
}
function apply(){paint(doc.querySelector('#phone'));settingsState()}
function change(lang){
 const next=normalize(lang);if(!next)return false;
 language=next;engine.changeLanguage(next);
 try{localStorage.setItem(key,next)}catch(_){}
 setDocument();apply();
 global.dispatchEvent(new CustomEvent('illyrian:language-changed',{detail:{language:next}}));
 return true;
}
function addLanguage(code,bundles){
 const l=String(code||'').toLowerCase().split('-')[0];
 if(!/^[a-z]{2,3}$/.test(l)||!bundles)return false;
 locales[l]=bundles;resources[l]=bundles;
 for(const [ns,entries] of Object.entries(bundles))engine.addResourceBundle(l,ns,presentationBundle(entries,ns,l),true,true);
 if(!supported.includes(l))supported.push(l);
 return true;
}
global.IllyrianI18n={
 get language(){return language},get supportedLanguages(){return supported.slice()},
 storageKey:key,fallbackLanguage:base,changeLanguage:change,addLanguage,
 t:(path,options)=>engine.t(path,options||{}),translate:paint,
 number:(n,options)=>new Intl.NumberFormat(language,options||{}).format(n),
 currency:(n,code)=>new Intl.NumberFormat(language,{style:'currency',currency:code||'EUR'}).format(n),
 date:(n,options)=>new Intl.DateTimeFormat(language,options||{dateStyle:'medium'}).format(n),
 lookupKey:original=>phrases.get(original)||null
};
setDocument();
doc.addEventListener('click',event=>{
 const el=event.target.closest('[data-illyrian-language]');
 if(!el)return;
 event.preventDefault();event.stopPropagation();change(el.dataset.illyrianLanguage);
},true);
function observe(){
 const obs=new MutationObserver(changes=>{
  changes.forEach(c=>c.addedNodes.forEach(paint));settingsState();
 });
 obs.observe(doc.body,{childList:true,subtree:true});apply();
}
if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',observe,{once:true});
else observe();
})(window);
