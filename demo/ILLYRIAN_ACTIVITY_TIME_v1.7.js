/* ILLYRIAN DEMO activity wall times. No GPS, persistence or recurrence scheduler. */
(function(global){
 'use strict';
 const ZONES={'Tiranë':'Europe/Tirane','Durrës':'Europe/Tirane','Shkodër':'Europe/Tirane','Vlorë':'Europe/Tirane','Elbasan':'Europe/Tirane','Prishtinë':'Europe/Belgrade','Milano':'Europe/Rome','Romë':'Europe/Rome','Berlin':'Europe/Berlin'};
 const cache=new Map(),formatters=new Map();
 const zone=e=>e?.timeZone||ZONES[e?.city]||null;
 function resolve(e){
  const tz=zone(e),date=String(e?.date||''),time=String(e?.time||'');
  if(!tz||!Object.values(ZONES).includes(tz)||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return null;
  const wall=date+'T'+time,guess=Date.parse(wall+':00Z');
  if(!Number.isFinite(guess)||new Date(guess).toISOString().slice(0,16)!==wall)return null;
  const key=tz+'|'+wall;if(cache.has(key))return cache.get(key);
  let result=null;
  try{
   let fmt=formatters.get(tz);if(!fmt){fmt=new Intl.DateTimeFormat('en-CA',{timeZone:tz,calendar:'gregory',numberingSystem:'latn',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});formatters.set(tz,fmt)}
   const parts=ms=>Object.fromEntries(fmt.formatToParts(new Date(ms)).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
   const stamp=ms=>{const p=parts(ms);return p.year+'-'+p.month+'-'+p.day+'T'+p.hour+':'+p.minute};
   const offsets=new Set();for(let h=-36;h<=36;h+=6){const ms=guess+h*3600000;offsets.add(Date.parse(stamp(ms)+':00Z')-ms)}
   const candidates=[...offsets].map(offset=>guess-offset).filter(ms=>stamp(ms)===wall);
   if(candidates.length===1)result=candidates[0];
  }catch{} // Unsupported timezone data is an invalid wall time, never device-local fallback.
  if(cache.size>=128)cache.clear();cache.set(key,result);return result;
 }
 global.IllyrianActivityTime=Object.freeze({zone,resolve});
})(window);
