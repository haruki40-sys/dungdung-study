/* Safe SVG renderer for BDM-only figure kinds; established v10 kinds still use DailyFigures. */
'use strict';
(()=>{
 const original=DailyFigures.generate;
 const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(q){
  const f=q.fig,ink='#24322d',accent='#a15c38',mark='#365f79',fill='#f5f0e8',s=[];
  const line=(a,b,c=ink,w=2,d='')=>s.push(`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}"${d?` stroke-dasharray="${d}"`:''}/>`);
  const text=(p,v,c=ink,z=16)=>s.push(`<text x="${p[0]}" y="${p[1]}" text-anchor="middle" dominant-baseline="central" font-size="${z}" fill="${c}" stroke="white" stroke-width="4" paint-order="stroke">${E(v)}</text>`);
  const dot=p=>s.push(`<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${ink}"/>`);
  const poly=(ps,c=ink)=>s.push(`<polygon points="${ps.map(p=>p.join(',')).join(' ')}" fill="${fill}" stroke="${c}" stroke-width="2"/>`);
  const ray=(o,a,r=155,c=ink)=>{const p=[o[0]+r*Math.cos(a*Math.PI/180),o[1]-r*Math.sin(a*Math.PI/180)];line(o,p,c);return p;};
  const arc=(o,a,b,r,label,c=accent)=>{const ps=Array.from({length:25},(_,i)=>{const x=(a+(b-a)*i/24)*Math.PI/180;return [o[0]+r*Math.cos(x),o[1]-r*Math.sin(x)];});s.push(`<polyline points="${ps.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${c}" stroke-width="2"/>`);if(label){const m=(a+b)/2*Math.PI/180;text([o[0]+(r+25)*Math.cos(m),o[1]-(r+25)*Math.sin(m)],label,c,15);}};
  switch(f.kind){
   case 'bdm-line-points':{const lo=Math.min(...f.positions),hi=Math.max(...f.positions),xs=f.positions.map(v=>70+(v-lo)/(hi-lo||1)*380);line([55,128],[465,128]);xs.forEach((x,i)=>{dot([x,128]);text([x,100-(i%2)*24],f.names[i]);});f.labels.forEach(([a,b,l],i)=>{const y=172+i*27;line([xs[a],y],[xs[b],y],i===f.labels.length-1?mark:accent,1.4);line([xs[a],y-5],[xs[a],y+5],accent,1.4);line([xs[b],y-5],[xs[b],y+5],accent,1.4);text([(xs[a]+xs[b])/2,y+15],l,i===f.labels.length-1?mark:accent,14);});break;}
   case 'bdm-nested-bisect':{const o=[180,220],angles=[0,f.angle/4,f.angle/2,f.angle];angles.forEach((a,i)=>{const p=ray(o,a,170,i===1?mark:ink);text([p[0]+8,p[1]-8],['A','D','C','B'][i]);});arc(o,f.angle/4,f.angle/2,58,'x°',mark);arc(o,0,f.angle,112,f.angle+'°');break;}
   case 'bdm-triple-angle':{const o=[260,215],sum=f.ratio.reduce((a,b)=>a+b,0),angles=[180];for(const x of f.ratio)angles.push(angles.at(-1)-180*x/sum);angles.forEach(a=>ray(o,a,176));for(let i=0;i<3;i++)arc(o,angles[i+1],angles[i],45+i*7,f.ratio[i]+'부분',i===2?mark:accent);break;}
   case 'bdm-plane-normal':{const plane=[[105,92],[375,92],[440,196],[170,196]];poly(plane);text([405,207],'α');const p=[270,144];dot(p);text([285,158],'P');line([150,174],[385,112],accent,2.5);text([146,188],'m',accent);line(p,[270,35],mark,3);text([285,43],'ℓ',mark);if(!f.skew){line([190,111],[351,180],ink,2);text([358,185],'n');}break;}
   case 'bdm-between-parallels':{line([55,55],[465,55]);line([55,220],[465,220]);text([482,55],'ℓ');text([482,220],'m');const p=[275,137];dot(p);line(p,[115,55],accent,2.5);line(p,[115,220],mark,2.5);text([162,79],f.angles[0]+'°',accent);text([162,197],f.angles[1]+'°',mark);text([292,137],'P');break;}
   case 'bdm-parallel-bisectors':{line([55,62],[465,62]);line([55,210],[465,210]);line([165,24],[355,248]);line([220,62],[352,145],accent,2.6);line([294,137],[220,210],mark,2.6);text([260,136],'90°',ink,18);break;}
   case 'bdm-parallels-adjacent':{line([55,72],[465,72]);line([55,206],[465,206]);line([190,25],[350,248]);text([241,47],f.labels[0],accent);text([315,48],f.labels[1],mark,22);arc([224,72],0,f.angle,28,'',accent);arc([224,72],f.angle,180,35,'?',mark);break;}
   case 'bdm-angle-copy':{const a=[145,200],b=[355,200];ray(a,0,115);ray(a,48,115);ray(b,0,115);ray(b,48,115,mark);arc(a,0,48,55,'');arc(b,0,48,55,'',mark);s.push(`<circle cx="145" cy="200" r="90" fill="none" stroke="${accent}" stroke-dasharray="6 6"/><circle cx="355" cy="200" r="90" fill="none" stroke="${mark}" stroke-dasharray="6 6"/>`);text([145,32],'주어진 각');text([355,32],'옮긴 각');break;}
   case 'bdm-circle-intersections':{const A=[150,145],B=[370,145],C1=[260,64],C2=[260,226];line(A,B);s.push(`<circle cx="150" cy="145" r="137" fill="none" stroke="${accent}" stroke-width="2"/><circle cx="370" cy="145" r="137" fill="none" stroke="${mark}" stroke-width="2"/>`);[A,B,C1,C2].forEach(dot);[['A',A],['B',B],['C',C1],["C'",C2]].forEach(([v,p])=>text([p[0],p[1]-17],v));break;}
   case 'bdm-kite':{const p=[[260,38],[385,138],[260,235],[135,138]];poly(p);line(p[0],p[2],mark,2.5);p.forEach((x,i)=>{dot(x);text([x[0]+(i===1?18:i===3?-18:0),x[1]+(i===0?-16:18)],f.names[i]);});text([190,82],'=',accent);text([330,82],'=',accent);text([190,194],'==',mark);text([330,194],'==',mark);break;}
   case 'bdm-common-side':{const A=[260,45],C=[260,230],B=[105,140],D=[415,140];poly([A,B,C]);poly([A,D,C]);line(A,C,mark,3);[A,B,C,D].forEach((x,i)=>{dot(x);text([x[0]+(i===1?-18:i===3?18:0),x[1]+(i===0?-16:i===2?18:0)],f.names[i]);});text([190,83],f.labels[0],accent,14);text([330,83],f.labels[1],mark,14);break;}
   case 'bdm-polygon-fan':{const ps=Array.from({length:f.n},(_,i)=>{const a=(90-360*i/f.n)*Math.PI/180;return [260+103*Math.cos(a),140-103*Math.sin(a)];});poly(ps);for(let i=2;i<f.n-1;i++)line(ps[0],ps[i],mark,1.8);ps.forEach(dot);break;}
   case 'bdm-three-exteriors':{const p=[[260,42],[95,220],[425,220]];poly(p);p.forEach((x,i)=>{dot(x);text([x[0]+(i===1?-40:i===2?40:0),x[1]+(i===0?-22:20)],f.angles[i]+'°',i===2?mark:accent);});line(p[1],[35,220]);line(p[2],[485,220]);line(p[0],[325,-28]);break;}
   default:{const svg=original(q);render.lastAudit=original.lastAudit||[];return svg;}
  }
  render.lastAudit=[];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 270" role="img" aria-label="${E(q.unit+' '+q.level)} 문제의 조건 도형" style="font-family:Cambria,'Times New Roman','Noto Sans KR',serif"><title>주어진 조건과 구할 값</title>${s.join('')}</svg>`;
 }
 DailyFigures.generate=render;
})();

