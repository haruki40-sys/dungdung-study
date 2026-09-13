/* Warning modal and password-gated local data controls. */
'use strict';
(()=>{
 const WARNING_KEY='study-math-warning-hidden-v1';
 const DATA_KEY='math-v10';
 const ADMIN_PASSWORD='gkrtmqqn';
 const body=document.body;
 if(!body)return;

 function makeWarning(){
  const d=document.createElement('dialog');
  d.className='study-warning';
  d.id='study-warning';
  d.innerHTML=`<div class="study-warning-inner"><span class="study-warning-badge">이용 전 안내</span><h2>문제를 풀기 전에 확인해 주세요</h2><p>이 사이트의 문제는 학습 연습을 위해 자체 제작하고 자동으로 조합한 문항이 포함되어 있습니다. 검토 중인 내용도 있어 일부 문제, 보기, 해설, 도형 또는 수학 기호에 오류나 어색한 표현이 있을 수 있습니다.</p><p class="study-warning-note">이상하거나 맞지 않는 문항을 발견하면 그대로 외우지 말고, 교과서와 학교 선생님의 안내를 기준으로 다시 확인해 주세요.</p><div class="study-warning-actions"><button type="button" class="warning-never" data-warning-never>다시 보지 않기</button><button type="button" class="warning-close" data-warning-close>닫기</button></div></div>`;
  body.appendChild(d);
  d.querySelector('[data-warning-never]').addEventListener('click',()=>{try{localStorage.setItem(WARNING_KEY,'1');}catch{}d.close();});
  d.querySelector('[data-warning-close]').addEventListener('click',()=>d.close());
  d.addEventListener('cancel',e=>{e.preventDefault();d.close();});
  let hidden=false;try{hidden=localStorage.getItem(WARNING_KEY)==='1';}catch{}
  if(!hidden)requestAnimationFrame(()=>{if(!d.open)d.showModal();});
 }

 function validState(x){return x&&typeof x==='object'&&!Array.isArray(x)&&x.version===10&&x.history&&typeof x.history==='object'&&x.wrongs&&typeof x.wrongs==='object'&&x.resolved&&typeof x.resolved==='object';}
 function loadFile(file,status){
  if(!file)return;
  const r=new FileReader();
  r.onload=()=>{
   try{
    const parsed=JSON.parse(String(r.result||''));
    const state=parsed?.data?.[DATA_KEY]||parsed?.[DATA_KEY]||parsed;
    if(!validState(state))throw Error('invalid');
    if(!confirm('불러온 데이터로 현재 학습 기록을 바꿀까요? 현재 기록은 덮어쓰게 됩니다.'))return;
    localStorage.setItem(DATA_KEY,JSON.stringify(state));
    location.reload();
   }catch{status.textContent='올바른 수학 학습 데이터 파일이 아닙니다.';}
  };
  r.onerror=()=>{status.textContent='파일을 읽지 못했습니다.';};
  r.readAsText(file,'utf-8');
 }
 function reset(){
  if(!confirm('현재 학습 기록과 오답노트를 모두 초기화할까요? 이 작업은 되돌릴 수 없습니다.'))return;
  try{localStorage.removeItem(DATA_KEY);}catch{}
  location.reload();
 }
 function makeAdmin(){
  const gate=document.createElement('dialog');
  gate.className='admin-gate';
  gate.innerHTML=`<form method="dialog" class="admin-gate-inner" data-admin-form><div class="admin-gate-title">관리자 확인</div><label class="admin-password-label">비밀번호<input type="password" autocomplete="current-password" data-admin-password></label><p class="admin-error" data-admin-error aria-live="polite"></p><div class="admin-gate-actions"><button type="button" data-admin-cancel>취소</button><button type="submit">확인</button></div></form>`;
  body.appendChild(gate);

  const panel=document.createElement('dialog');
  panel.className='admin-panel';
  panel.innerHTML=`<div class="admin-panel-inner"><div class="admin-panel-top"><strong>관리자 도구</strong><button type="button" data-admin-close aria-label="관리자 도구 닫기">닫기</button></div><p class="admin-panel-note">학습 데이터 관리 기능입니다.</p><div class="admin-panel-actions"><button type="button" data-admin-load>데이터 불러오기</button><button type="button" class="danger" data-admin-reset>현재 데이터 초기화</button></div><p class="admin-panel-status" data-admin-status role="status" aria-live="polite"></p><input type="file" accept="application/json,.json" data-admin-file hidden></div>`;
  body.appendChild(panel);

  const trigger=document.getElementById('admin-trigger');
  const input=gate.querySelector('[data-admin-password]');
  const error=gate.querySelector('[data-admin-error]');
  function openGate(){input.value='';error.textContent='';gate.showModal();requestAnimationFrame(()=>input.focus());}
  if(trigger){trigger.addEventListener('click',openGate);trigger.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openGate();}});}
  gate.querySelector('[data-admin-cancel]').addEventListener('click',()=>gate.close());
  gate.querySelector('[data-admin-form]').addEventListener('submit',e=>{e.preventDefault();if(input.value!==ADMIN_PASSWORD){error.textContent='비밀번호가 맞지 않습니다.';input.select();return;}gate.close();panel.showModal();});
  gate.addEventListener('cancel',e=>{e.preventDefault();gate.close();});

  const fileInput=panel.querySelector('[data-admin-file]');
  const status=panel.querySelector('[data-admin-status]');
  panel.querySelector('[data-admin-close]').addEventListener('click',()=>panel.close());
  panel.querySelector('[data-admin-load]').addEventListener('click',()=>{status.textContent='';fileInput.value='';fileInput.click();});
  fileInput.addEventListener('change',()=>loadFile(fileInput.files?.[0],status));
  panel.querySelector('[data-admin-reset]').addEventListener('click',reset);
  panel.addEventListener('cancel',e=>{e.preventDefault();panel.close();});
 }

 makeWarning();
 makeAdmin();
})();
