/* Shared leaderboard adapter for the school math quiz. No service secrets are stored in the browser. */
'use strict';
(()=>{
 const KEY='study-math-leaderboard-v1';
 const ENDPOINT='https://vrmidbqyhdbahyljiuom.supabase.co/functions/v1/math-leaderboard';
 const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}');}catch{return {};}};
 const normalizeName=s=>String(s||'').trim().replace(/\s+/g,' ');
 if(new URL(location.href).searchParams.get('ci')==='1'&&!read()?.activeName){
  try{localStorage.setItem(KEY,JSON.stringify({version:1,activeName:'__ci__',players:{'__ci__':{createdAt:Date.now(),events:{},imported:true}}}));}catch{}
 }
 function recordsFor(name){
  const db=read(),p=db?.players?.[name],events=Object.values(p?.events||{}),byDate=new Map();
  for(const e of events){if(!e?.date)continue;const x=byDate.get(e.date)||{date:e.date,solved:0,correct:0};x.solved++;if(e.correct)x.correct++;byDate.set(e.date,x);}
  return [...byDate.values()].sort((a,b)=>a.date.localeCompare(b.date)).slice(-40);
 }
 async function request(url,options={}){
  const r=await fetch(url,{cache:'no-store',...options});
  if(!r.ok)throw Error('Leaderboard HTTP '+r.status);
  return r.json();
 }
 async function syncAll(name){
  name=normalizeName(name);if(!name||name==='__ci__')return false;
  const records=recordsFor(name);if(!records.length)return true;
  await request(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,records})});
  return true;
 }
 async function fetchRows(mode,target){
  const date=mode==='daily'?target:String(target).slice(0,7)+'-01';
  const data=await request(ENDPOINT+'?period='+encodeURIComponent(mode)+'&date='+encodeURIComponent(date));
  return Array.isArray(data?.rows)?data.rows:[];
 }
 window.StudyLeaderboardRemote={
  fetch:fetchRows,
  submit:({name})=>syncAll(name),
  syncAll
 };
 let lastName='';
 function syncNamedLearner(){
  const name=normalizeName(read()?.activeName);
  if(!name||name===lastName)return;
  lastName=name;
  setTimeout(()=>syncAll(name).catch(e=>console.warn('Initial leaderboard sync failed',e)),250);
 }
 window.addEventListener('pageshow',syncNamedLearner);
 setInterval(syncNamedLearner,1000);
 syncNamedLearner();
})();
