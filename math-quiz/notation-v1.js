/* Textbook-style math notation renderer. */
'use strict';
(()=>{
 const TARGET='.qtext,.opt span,.feedback-slot,.wrongitem summary strong,.feedback';
 const RE=/(반직선|선분|직선)\s*([A-Z])\s*([A-Z])|각\s*([A-Z])(?:\s*([A-Z]))?(?:\s*([A-Z]))?|\b([A-Z])([A-Z])(?=\s*(?:=|:|\+|−|-|×|÷|cm\b|의\s*길이))/g;
 function line(kind,a,b){const s=document.createElement('span');s.className='geo-notation '+(kind==='선분'?'geo-segment':kind==='반직선'?'geo-ray':'geo-line');s.setAttribute('aria-label',kind+' '+a+b);const t=document.createElement('span');t.className='geo-letters';t.textContent=a+b;s.appendChild(t);return s;}
 function angle(a,b,c){const n=[a,b,c].filter(Boolean).join('');const s=document.createElement('span');s.className='geo-angle';s.setAttribute('aria-label','각 '+n);s.textContent='∠'+n;return s;}
 function node(n){const text=n?.nodeValue;if(!text)return;RE.lastIndex=0;if(!RE.test(text))return;RE.lastIndex=0;const f=document.createDocumentFragment();let last=0,m;while((m=RE.exec(text))){if(m.index>last)f.append(text.slice(last,m.index));if(m[1])f.append(line(m[1],m[2],m[3]));else if(m[4])f.append(angle(m[4],m[5],m[6]));else f.append(line('선분',m[7],m[8]));last=RE.lastIndex;}if(last<text.length)f.append(text.slice(last));n.replaceWith(f);}
 function decorate(el){if(!el||el.closest?.('.geo-notation,.geo-angle'))return;const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement?.closest('.geo-notation,.geo-angle')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});const a=[];while(w.nextNode())a.push(w.currentNode);a.forEach(node);}
 function scan(root=document){if(root.matches?.(TARGET))decorate(root);root.querySelectorAll?.(TARGET).forEach(decorate);}
 const app=document.querySelector('#app');if(!app)return;scan(app);new MutationObserver(rs=>{for(const r of rs)for(const n of r.addedNodes){if(n.nodeType===3)node(n);else if(n.nodeType===1)scan(n);}}).observe(app,{childList:true,subtree:true});
})();
