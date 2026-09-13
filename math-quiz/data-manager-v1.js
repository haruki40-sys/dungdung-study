/* Warning modal and local study-data backup controls. */
'use strict';
(()=>{
 const WARNING_KEY='study-math-warning-hidden-v1';
 const DATA_KEY='math-v10';
 const BACKUP_APP='dungdung-study-math';
 const body=document.body;
 if(!body)return;

 function makeWarning(){
  const d=document.createElement('dialog');
  d.className='study-warning';
  d.id='study-warning';
  d.innerHTML=`<div class="study-warning-inner"><span class="study-warning-badge">이용 전 안내</span><h2>문제를 풀기 전에 확인해 주세요</h2><p>이 사이트의 문제는 학습 연습을 위해 자체 제작하고 자동으로 조합한 문항이 포함되어 있습니다. 검토 중인 내용도 있어 일부 문제, 보기, 해설, 도형 또는 수학 기호에 오류나 어색한 표현이 있을 수 있습니다.</p><p class="study-warning-note">이상하거나 맞지 않는 문항을 발견하면 그대로 외우지 말고, 교과서와 학교 선생님의 안내를 기준으로 다시 확인해 주세요.</p><div class="study-warning-actions"><button type="button" class="warning-never" data-warning-never>다시 보지 않기</button><button type="button" class="warning-close" data-warning-close>닫기</button></div></div>`;
  body.appendChild(d);
  d.querySelector('[data-warning-never]').addEventListener('click',()=>{
   try{localStorage.setItem(WARNING_KEY,'1');}catch{}
   d.close();
  });
  d.querySelector('[data-warning-close]').addEventListener('click',()=>d.close());
  d.addEventListener('cancel',e=>{e.preventDefault();d.close();});
  let hidden=false;try{hidden=localStorage.getItem(WARNING_KEY)==='1';}catch{}
  if(!hidden)requestAnimationFrame(()=>{if(!d.open)d.showModal();});
 }

 function readCurrent(){
  try{
   const raw=localStorage.getItem(DATA_KEY);
   return raw?JSON.parse(raw):{version:10,history:{},wrongs:{},resolved:{},migrated:true};
  }catch{return null;}
 }
 function validState(x){
  return x&&typeof x==='object'&&!Array.isArray(x)&&x.version===10&&x.history&&typeof x.history==='object'&&x.wrongs&&typeof x.wrongs==='object'&&x.resolved&&typeof x.resolved==='object';
 }
 function status(msg){
  const el=document.querySelector('.data-status');
  if(!el)return;
  el.textContent=msg;
  clearTimeout(status.t);
  status.t=setTimeout(()=>{el.textContent='';},4000);
 }
 function saveFile(){
  const state=readCurrent();
  if(!validState(state)){status('저장할 학습 데이터를 읽지 못했습니다.');return;}
  const payload={app:BACKUP_APP,format:1,exportedAt:new Date().toISOString(),data:{[DATA_KEY]:state}};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  const day=new Date(Date.now()+9*3600000).toISOString().slice(0,10);
  a.href=URL.createObjectURL(blob);
  a.download=`dungdung-math-backup-${day}.json`;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  status('현재 학습 데이터를 파일로 저장했습니다.');
 }
 function loadFile(file){
  if(!file)return;
  const r=new FileReader();
  r.onload=()=>{
   try{
    const parsed=JSON.parse(String(r.result||''));
    const state=parsed?.app===BACKUP_APP?parsed?.data?.[DATA_KEY]:parsed?.[DATA_KEY]||parsed;
    if(!validState(state))throw Error('invalid');
    if(!confirm('불러온 데이터로 현재 학습 기록을 바꿀까요? 현재 기록은 덮어쓰게 됩니다.'))return;
    localStorage.setItem(DATA_KEY,JSON.stringify(state));
    location.reload();
   }catch{status('올바른 수학 학습 백업 파일이 아닙니다.');}
  };
  r.onerror=()=>status('파일을 읽지 못했습니다.');
  r.readAsText(file,'utf-8');
 }
 function reset(){
  if(!confirm('현재 학습 기록과 오답노트를 모두 초기화할까요? 이 작업은 되돌릴 수 없습니다.'))return;
  try{localStorage.removeItem(DATA_KEY);}catch{}
  location.reload();
 }
 function makeDock(){
  const dock=document.createElement('div');
  dock.className='data-dock';
  dock.innerHTML=`<div class="data-dock-inner"><span class="data-dock-label">학습 데이터</span><button type="button" data-save>저장하기</button><button type="button" data-load>불러오기</button><button type="button" class="danger" data-reset>현재 데이터 초기화</button><span class="data-status" role="status" aria-live="polite"></span><input class="data-file-input" type="file" accept="application/json,.json" data-file></div>`;
  body.appendChild(dock);
  const input=dock.querySelector('[data-file]');
  dock.querySelector('[data-save]').addEventListener('click',saveFile);
  dock.querySelector('[data-load]').addEventListener('click',()=>{input.value='';input.click();});
  input.addEventListener('change',()=>loadFile(input.files?.[0]));
  dock.querySelector('[data-reset]').addEventListener('click',reset);
 }

 makeWarning();
 makeDock();
})();
