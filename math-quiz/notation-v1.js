/* Render textbook-style notation for segment, ray and line names. */
'use strict';
(()=>{
 const ROOT_SELECTOR='#app';
 const TARGET_SELECTOR='.qtext,.opt span,.feedback-slot,.wrongitem summary strong,.feedback';
 const RE=/(반직선|선분|직선)\s+([A-Z])\s*([A-Z])/g;
 function make(kind,a,b){
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
 function decorateTextNode(node){
  if(!node?.nodeValue||!RE.test(node.nodeValue))return;
  RE.lastIndex=0;
  const text=node.nodeValue,frag=document.createDocumentFragment();
  let last=0,m;
  while((m=RE.exec(text))){
   if(m.index>last)frag.append(text.slice(last,m.index));
   frag.append(m[1]+' ');
   frag.append(make(m[1],m[2],m[3]));
   last=RE.lastIndex;
  }
  if(last<text.length)frag.append(text.slice(last));
  node.replaceWith(frag);
 }
 function decorate(el){
  if(!el||el.closest?.('.geo-notation'))return;
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement?.closest('.geo-notation')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
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
