/* Optional, foreground-only location adapter. City reference points are fixtures,
 * not publication coordinates. No network client, storage or position watcher. */
(function(global){
 'use strict';
 const centers={Milano:[45.4642,9.19],'Romë':[41.9028,12.4964],'Tiranë':[41.3275,19.8187],'Prishtinë':[42.6629,21.1655],Berlin:[52.52,13.405]};
 const cities=Object.freeze(Object.keys(centers));
 let state={status:'manual',city:null},epoch=0,permission=null,permissionHandler=null,listener=()=>{};
 const emit=()=>listener({...state});
 function stopPermission(){
  if(permission&&permissionHandler){if(permission.removeEventListener)permission.removeEventListener('change',permissionHandler);else permission.onchange=null}
  permission=null;permissionHandler=null;
 }
 function reset(notify=false){epoch++;stopPermission();state={status:'manual',city:null};if(notify)emit()}
 function matchCity(latitude,longitude){
  const rad=n=>n*Math.PI/180;
  const distance=([lat,lon])=>{const a=Math.sin(rad(lat-latitude)/2)**2+Math.cos(rad(latitude))*Math.cos(rad(lat))*Math.sin(rad(lon-longitude)/2)**2;return 6371*2*Math.asin(Math.min(1,Math.sqrt(a)))};
  const closest=cities.map(city=>({city,km:distance(centers[city])})).sort((a,b)=>a.km-b.km)[0];
  // Bounded reference resolver only; outside fixture cities there are no GPS results.
  return closest.km<=50?closest.city:null;
 }
 function request(){
  if(state.status==='loading')return;
  reset();const ticket=epoch;
  const finish=(status,city=null)=>{if(ticket!==epoch)return;if(document.visibilityState==='hidden'){reset();return}state={status,city};if(status!=='ready')stopPermission();emit()};
  if(!global.isSecureContext||!global.navigator.geolocation?.getCurrentPosition){finish('unsupported');return}
  state={status:'loading',city:null};emit();
  try{
   global.navigator.geolocation.getCurrentPosition(position=>{
    if(ticket!==epoch)return;
    const c=position?.coords,lat=c?.latitude,lon=c?.longitude,accuracy=c?.accuracy;
    if(typeof lat!=='number'||typeof lon!=='number'||!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180){finish('unavailable');return}
    if(typeof accuracy==='number'&&(!Number.isFinite(accuracy)||accuracy<0||accuracy>50000)){finish('imprecise');return}
    finish('ready',matchCity(lat,lon));
   },error=>finish(error?.code===1?'denied':error?.code===3?'timeout':'unavailable'),{enableHighAccuracy:false,timeout:10000,maximumAge:0});
  }catch{finish('unavailable')}
  // Query observes revocation; it never requests permission or starts location reads.
  try{global.navigator.permissions?.query({name:'geolocation'}).then(result=>{
   if(ticket!==epoch||!['ready','loading'].includes(state.status))return;
   permission=result;permissionHandler=()=>{if(result.state==='denied'){epoch++;stopPermission();state={status:'denied',city:null};emit()}};
   if(result.addEventListener)result.addEventListener('change',permissionHandler);else result.onchange=permissionHandler;
   if(result.state==='denied')permissionHandler();
  }).catch(()=>{})}catch{}
 }
 global.IllyrianNearby=Object.freeze({cities,state:()=>({...state}),request,reset,subscribe:fn=>{listener=typeof fn==='function'?fn:()=>{}},matches:(city,manualCity)=>state.status==='loading'?false:state.status==='ready'?state.city!==null&&city===state.city:city===manualCity});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')reset();else emit()});
 global.addEventListener('pagehide',()=>reset());
 global.addEventListener('pageshow',event=>{if(event.persisted)emit()});
})(window);
