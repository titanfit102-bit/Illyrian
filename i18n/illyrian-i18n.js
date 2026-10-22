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
const resources={},namespaces=new Set();
Object.keys(locales).forEach(l=>{
 resources[l]={};Object.keys(locales[l]).forEach(ns=>{resources[l][ns]=locales[l][ns];namespaces.add(ns)});
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
    }
  }
 }
}
reindex();
const priorText=new WeakMap(),priorAttrs=new WeakMap();
const exclude='script,style,textarea,[contenteditable],[data-user-content],.post-copy,.post-name,.post-photo,.v6-chat-bubble,.v6-message-bubble,.v6-comment-text,.ilp-chat-msg,.ils-product-title,.isp-listing-title';
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
 for(const [ns,entries] of Object.entries(bundles))engine.addResourceBundle(l,ns,entries,true,true);
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
