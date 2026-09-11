/* Deterministically mix the unchanged v10 generator with the normalized BDM bank. */
'use strict';
(()=>{
 const originalMake=DailyMath.make;
 function make(date=DailyMath.dateKey(),offset=0){
  const original=originalMake(date,offset),bdm=BdmBank.make(date,offset);
  const virtual=Math.floor(Date.parse(date+'T00:00:00Z')/86400000)+offset;
  const mixed=original.map((question,index)=>{
   if((virtual+index)%2)return {...question,source:'v10'};
   const replacement=bdm[index];
   if(!replacement||replacement.id!==question.id)throw Error('BDM slot mismatch '+question.id);
   return replacement;
  });
  if(mixed.filter(q=>q.source==='bdm').length!==30||mixed.filter(q=>q.source==='v10').length!==30)throw Error('Invalid 50:50 daily mix');
  DailyMath.validate(mixed);
  return mixed;
 }
 DailyMath.make=make;
 DailyMath.VERSION='10.1';
})();


