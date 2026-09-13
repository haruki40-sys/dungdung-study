/* Render textbook-style mathematical notation for segments, rays, lines and angles. */
'use strict';
(()=>{
 const ROOT_SELECTOR='#app';
 const TARGET_SELECTOR='.qtext,.opt span,.feedback-slot,.wrongitem summary strong,.feedback';
 const LINE_RE=/(반직선|선분|직선)\s+([A-Z])\s*([A-Z])/g;
 const ANGLE_RE=/각\s*([A-Z])(?:\s*([A-Z]))?(?:\s*([A-Z]))?/g;
 function makeLine(kind,a,b){
  const span=document.createElement('span');
  span.className='geo-notation '+(kind==='선분'?'geo-segment':kind==='반직선'?'geo-ray':'geo-line');
  span.setAttribute('role','img');
  span.setAttribute('aria-label',`${kind} ${a}${b}`);
  const letters=document.createElement('span');
  letters.className='geo-letters';
  letters.textContent=a+b;
  span.appendChild(letters);
  return span;
 }
 function makeAngle(...letters){
  const name=letters.filter(Boolean).join('');
  const span=document.createElement('span');
  span.className='geo-angle';
  span.setAttribute('role','img');
  span.setAttribute('aria-label',`각 ${name}`);
  span.textContent='∠'+name;
  return span;
 }
 function replaceWithRegex(node,re,builder){
  const text=node.nodeValue;
  re.lastIndex=0;
  if(!re.test(text))return false;
  re.lastIndex=0;
  const frag=document.createDocumentFragment();
  let last=0,m;
  while((m=re.exec(text))){
   if(m.index>last)frag.append(text.slice(last,m.index));
   frag.append(builder(...m.slice(1)));
   last=re.lastIndex;
  }
  if(last<text.length)frag.append(text.slice(last));
  node.replaceWith(frag);
  return true;
 }
 function decorateTextNode(node){
  if(!node?.nodeValue)return;
  if(replaceWithRegex(node,LINE_RE,(kind,a,b)=>makeLine(kind,a,b)))return;
  replaceWithRegex(node,ANGLE_RE,(a,b,c)=>makeAngle(a,b,c));
 }
 function decorate(el){
  if(!el||el.closest?.('.geo-notation,.geo-angle'))return;
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement?.closest('.geo-notation,.geo-angle')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(decorateTextNode);
 }
 function scan(root=document){
  if(root.matches?.(TARGET_SELECTOR))decorate(root);
  root.querySelectorAll?.(TARGET_SELECTOR).forEach(decorate);
 }
 const app=document.querySelector(ROOT_SELECTOR);
 if(!app)return;
 scan(app);
 new MutationObserver(records=>{
  for(const r of records)for(const n of r.addedNodes){if(n.nodeType===Node.TEXT_NODE)decorate(n.parentElement);else if(n.nodeType===Node.ELEMENT_NODE)scan(n);}
 }).observe(app,{childList:true,subtree:true});
})();
