/* Textbook-style geometry notation and polygon-name renderer. Keeps question data unchanged. */
'use strict';
(()=>{
 const app=document.getElementById('app');
 if(!app)return;
 const TOKEN=/(선분|반직선|직선)\s*([A-Z])\s*([A-Z])|각\s*([A-Z]{1,3})|∠\s*([A-Z]{1,3})|(^|[^A-Z])([A-Z]{2})(?![A-Z])/g;
 const skip=n=>{const p=n.parentElement;return !p||p.closest('svg,textarea,script,style,.geo-notation,.geo-angle');};
 function koreanNumber(n){
  n=Number(n);
  const ones=['','일','이','삼','사','오','육','칠','팔','구'];
  if(n<10)return ones[n]||String(n);
  if(n<20)return '십'+(n%10?ones[n%10]:'');
  if(n<100)return ones[Math.floor(n/10)]+'십'+(n%10?ones[n%10]:'');
  return String(n);
 }
 function normalizePolygons(text){
  return String(text)
   .replace(/정\s*(\d+)각형/g,(_,n)=>'정'+koreanNumber(n)+'각형')
   .replace(/볼록\s*(\d+)각형/g,(_,n)=>koreanNumber(n)+'각형')
   .replace(/(\d+)각형/g,(_,n)=>koreanNumber(n)+'각형')
   .replace(/볼록(?=[가-힣]+각형)/g,'');
 }
 function line(kind,name){
  const s=document.createElement('span');
  s.className='geo-notation '+(kind==='선분'?'geo-segment':kind==='반직선'?'geo-ray':'geo-line');
  s.setAttribute('role','img');
  s.setAttribute('aria-label',kind+' '+name);
  const l=document.createElement('span');
  l.className='geo-letters';
  l.textContent=name;
  s.appendChild(l);
  return s;
 }
 function angle(name){
  const s=document.createElement('span');
  s.className='geo-angle';
  s.setAttribute('role','img');
  s.setAttribute('aria-label','각 '+name);
  s.textContent='∠'+name;
  return s;
 }
 function decorate(node){
  if(!node||node.nodeType!==Node.TEXT_NODE||skip(node))return;
  const normalized=normalizePolygons(node.nodeValue);
  if(normalized!==node.nodeValue)node.nodeValue=normalized;
  const text=node.nodeValue;
  TOKEN.lastIndex=0;
  if(!TOKEN.test(text))return;
  TOKEN.lastIndex=0;
  const f=document.createDocumentFragment();
  let last=0,m;
  while((m=TOKEN.exec(text))){
   if(m.index>last)f.append(text.slice(last,m.index));
   if(m[1]){
    f.append(line(m[1],m[2]+m[3]));
   }else if(m[4]||m[5]){
    f.append(angle(m[4]||m[5]));
   }else{
    if(m[6])f.append(m[6]);
    f.append(line('선분',m[7]));
   }
   last=TOKEN.lastIndex;
  }
  if(last<text.length)f.append(text.slice(last));
  node.replaceWith(f);
 }
 function scan(root){
  if(!root)return;
  if(root.nodeType===Node.TEXT_NODE){decorate(root);return;}
  if(root.nodeType!==Node.ELEMENT_NODE)return;
  if(root.matches('svg,textarea,script,style,.geo-notation,.geo-angle'))return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(w.nextNode())nodes.push(w.currentNode);
  nodes.forEach(decorate);
 }
 scan(app);
 new MutationObserver(rs=>{for(const r of rs)for(const n of r.addedNodes)scan(n);}).observe(app,{childList:true,subtree:true});
})();
