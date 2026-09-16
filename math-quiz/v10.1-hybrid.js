/* Deterministically mix the unchanged v10 generator with the normalized BDM bank. */
'use strict';
(()=>{
 const originalMake=DailyMath.make;
 const CLOCK_RE=/(시계|시침|분침|초침|몇\s*시|clock)/i;
 const isClock=q=>CLOCK_RE.test([q?.q,q?.e,q?.type].filter(Boolean).join(' '));
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
 function dailyFive(date=DailyMath.dateKey(),offset=0){
  const full=make(date,offset),virtual=Math.floor(Date.parse(date+'T00:00:00Z')/86400000)+offset;
  const levels=['초급','초급','중급','중급','상급'];
  const sources=virtual%2===0?['bdm','v10','bdm','v10','bdm']:['v10','bdm','v10','bdm','v10'];
  const usedUnits=new Set(),picked=[];
  for(let i=0;i<levels.length;i++){
   const score=q=>DailyMath.hash(date+'|'+offset+'|daily5|'+i+'|'+q.id+'|'+q.source);
   const base=q=>q.level===levels[i]&&q.source===sources[i]&&!isClock(q);
   let candidates=full.filter(q=>base(q)&&!usedUnits.has(q.unit));
   if(!candidates.length)candidates=full.filter(base);
   candidates.sort((a,b)=>{
    const figureDiff=Number(Boolean(b.fig))-Number(Boolean(a.fig));
    if(figureDiff)return figureDiff;
    return score(a)-score(b)||a.id.localeCompare(b.id);
   });
   const q=candidates[0];if(!q)throw Error('Unable to build daily five without clock questions');
   usedUnits.add(q.unit);picked.push(q);
  }
  if(picked.length!==5||new Set(picked.map(q=>q.uid)).size!==5)throw Error('Invalid daily five');
  const bdmCount=picked.filter(q=>q.source==='bdm').length;
  if(![2,3].includes(bdmCount))throw Error('Invalid daily source balance');
  return picked;
 }
 DailyMath.make=make;
 DailyMath.dailyFive=dailyFive;
 DailyMath.VERSION='10.1';
})();
