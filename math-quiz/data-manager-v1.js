/* Study warning only. */
'use strict';
(()=>{
 const KEY='study-math-warning-hidden-v1';
 const body=document.body;
 if(!body)return;
 const d=document.createElement('dialog');
 d.className='study-warning';
 d.id='study-warning';
 d.innerHTML=`<div class="study-warning-inner"><span class="study-warning-badge">이용 전 안내</span><h2>문제를 풀기 전에 확인해 주세요</h2><p>이 사이트의 문제는 학습 연습을 위해 자체 제작하고 자동으로 조합한 문항이 포함되어 있습니다. 검토 중인 내용도 있어 일부 문제, 보기, 해설, 도형 또는 수학 기호에 오류나 어색한 표현이 있을 수 있습니다.</p><p class="study-warning-note">이상하거나 맞지 않는 문항을 발견하면 그대로 외우지 말고, 교과서와 학교 선생님의 안내를 기준으로 다시 확인해 주세요.</p><div class="study-warning-actions"><button type="button" class="warning-never" data-warning-never>다시 보지 않기</button><button type="button" class="warning-close" data-warning-close>닫기</button></div></div>`;
 body.appendChild(d);
 d.querySelector('[data-warning-never]').addEventListener('click',()=>{try{localStorage.setItem(KEY,'1');}catch{}d.close();});
 d.querySelector('[data-warning-close]').addEventListener('click',()=>d.close());
 d.addEventListener('cancel',e=>{e.preventDefault();d.close();});
 let hidden=false;try{hidden=localStorage.getItem(KEY)==='1';}catch{}
 if(!hidden)requestAnimationFrame(()=>{if(!d.open)d.showModal();});
})();
