/* Simple study-data reset control. */
'use strict';
(()=>{
 const KEYS=['math-v10','math-v9','math-v7','mathv8_answers','mathv8_wrongs'];
 const body=document.body;
 if(!body)return;
 const dialog=document.createElement('dialog');
 dialog.className='reset-dialog';
 dialog.innerHTML=`<div class="reset-dialog-inner"><span class="reset-dialog-badge">데이터 초기화</span><h2>저장된 학습 데이터를 삭제할까요?</h2><p>초기화하면 지금까지 저장된 문제 풀이 기록, 오답노트, 메모 등 이 브라우저에 저장된 학습 데이터가 모두 삭제됩니다.</p><p class="reset-dialog-warning">삭제한 데이터는 되돌릴 수 없습니다.</p><div class="reset-dialog-actions"><button type="button" class="reset-cancel" data-reset-cancel>취소</button><button type="button" class="reset-delete" data-reset-delete>삭제</button></div></div>`;
 body.appendChild(dialog);
 document.getElementById('reset-study-data')?.addEventListener('click',()=>{if(!dialog.open)dialog.showModal();});
 dialog.querySelector('[data-reset-cancel]').addEventListener('click',()=>dialog.close());
 dialog.querySelector('[data-reset-delete]').addEventListener('click',()=>{
  try{for(const key of KEYS)localStorage.removeItem(key);}catch{}
  dialog.close();
  location.hash='#/';
  location.reload();
 });
 dialog.addEventListener('cancel',e=>{e.preventDefault();dialog.close();});
})();
