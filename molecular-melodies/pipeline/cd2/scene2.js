function bar(x,y,len,col,tip,tipcol){ctx.save();ctx.lineWidth=7;ctx.lineCap='round';ctx.strokeStyle=col;ctx.beginPath();ctx.moveTo(x,y-len);ctx.lineTo(x,y+len);ctx.stroke();if(tip){ctx.strokeStyle=tipcol;ctx.beginPath();ctx.moveTo(x,y-len);ctx.lineTo(x,y-len*0.35);ctx.stroke();}ctx.restore();}
function minicell(x,y,r,items,a=1,col=TL){ctx.save();ctx.globalAlpha*=a;ctx.fillStyle='rgba(45,212,191,.14)';ctx.strokeStyle=col;ctx.lineWidth=5;ctx.shadowColor=col;ctx.shadowBlur=14;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
 items.forEach((it,k)=>{const n=items.length;const bx=x+(k-(n-1)/2)*r*0.5;bar(bx,y,r*it[0],it[1],it[2],it[3]);});ctx.restore();}
// final four cells (each different): [length,color,tip,tipcolor]
const F4=[[[0.38,BL],[0.28,PK,1,BL]],[[0.38,BL,1,PK],[0.28,PK]],[[0.38,PK,1,BL],[0.28,BL]],[[0.38,PK],[0.28,BL,1,PK]]];
function drawArrow(x0,x1,y,col,a){ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1-12,y);ctx.stroke();ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x1-22,y-15);ctx.lineTo(x1-22,y+15);ctx.closePath();ctx.fill();ctx.restore();}
// chorus recap diagram: 1 cell (2n) -> round 1 -> 2 cells (n) -> round 2 -> 4 cells (n)
const CHO=CFG.lines.filter(l=>/^P, M, A, T/.test(l.text));
function diagram(tv,A){if(A<=0.01)return;ctx.save();ctx.globalAlpha=A;ctx.translate(0,10);ctx.scale(1.2,1.2);
 let r1=0.35,r2=0.35;for(const l of CHO){const w=l.words,s1=w[0][1],e1=w[3][1]+0.35,s2=w[5][1],e2=w[8][1]+0.5;if(tv>=s1-0.1&&tv<s2-0.05)r1=1;if(tv>=s2-0.05&&tv<e2)r2=1;}
 minicell(-255,0,86,[[0.42,BL,0],[0.42,PK,0],[0.3,BL],[0.3,PK]].slice(0,4).map((q,k)=>q),1);
 text('1 cell',-255,128,30,900,WH,'center',5);text('2n = 46',-255,164,24,800,GD,'center',4);
 drawArrow(-150,-62,0,r1>0.9?GR:'#1B4750',1);text('ROUND 1',-112,-24,22,900,r1>0.9?GR:'#7DD3FC','center',4);
 minicell(0,-72,56,[[0.4,BL],[0.28,PK]],1);minicell(0,72,56,[[0.4,PK],[0.28,BL]],1);
 text('2 cells',0,168,30,900,WH,'center',5);text('n = 23',0,204,24,800,GD,'center',4);
 drawArrow(76,168,0,r2>0.9?GD:'#1B4750',1);text('ROUND 2',124,-24,22,900,r2>0.9?GD:'#7DD3FC','center',4);
 [[222,-48],[300,-48],[222,48],[300,48]].forEach((p,k)=>minicell(p[0],p[1],36,F4[k].map(q=>q),1));
 text('4 cells',262,128,30,900,WH,'center',5);text('all different',262,164,24,800,GD,'center',4);
 ctx.restore();}
// bridge: why are they different
function bridge(tv,A){if(A<=0.01)return;ctx.save();ctx.globalAlpha=A;
 // 88.4-93.2 two ways
 if(tv<93.4){const a=win(tv,88.5,93.2);ctx.save();ctx.globalAlpha*=a;text('?',0,-70,190,900,GD,'center',9);
  const b1=ph(tv,90.9,91.4),b2=ph(tv,91.9,92.4);ctx.save();ctx.globalAlpha*=b1;pill('1   Crossing over',0,120,PK,1,34);ctx.restore();ctx.save();ctx.globalAlpha*=b2;pill('2   Independent assortment',0,200,GD,1,34);ctx.restore();ctx.restore();}
 // 93.2-95.7 crossing over close up
 if(tv>=93.2&&tv<95.9){const a=win(tv,93.2,95.9);ctx.save();ctx.globalAlpha*=a;const k=ph(tv,94.0,95.2);ctx.translate(0,10);
  xchrom(0,-62,0,0,1,k,2.3);xchrom(1,62,0,0,1,k,2.3);
  ctx.restore();text('swap pieces',0,-236,40,900,GD,'center',6);ctx.restore();}
 // 95.76-99.3 independent assortment: two random line-ups
 if(tv>=95.7&&tv<99.4){const a=win(tv,95.7,99.4);ctx.save();ctx.globalAlpha*=a;
  const arr=[[[BL,PK],[BL,PK]],[[BL,PK],[PK,BL]]];
  [-1,1].forEach((s,q)=>{const cx=s*160;ctx.save();ctx.strokeStyle='rgba(245,200,75,.8)';ctx.lineWidth=3;ctx.setLineDash([10,9]);ctx.beginPath();ctx.moveTo(cx,-170);ctx.lineTo(cx,170);ctx.stroke();ctx.setLineDash([]);ctx.restore();
   [0,1].forEach(p=>{const y=p?85:-85,L=p?32:48;arr[q][p].forEach((c,m)=>{const ii=(p?2:0)+(c===BL?0:1);xchrom(ii,cx+(m?24:-24),y,0,1,0,0.95);});});
   text('Way '+(q+1),cx,-215,34,900,WH,'center',6);});
  const pa=ph(tv,97.0,97.5);ctx.save();ctx.globalAlpha*=pa;pill('random each time',0,215,GD,1,30);ctx.restore();ctx.restore();}
 // 99.4-104.4 counter
 if(tv>=99.4&&tv<104.6){const a=win(tv,99.4,104.6);ctx.save();ctx.globalAlpha*=a;
  text('23 pairs',0,-150,80,900,WH,'center',8);
  const k=lin(tv,100.4,103.3);const v=Math.round(Math.pow(2,2+21*k*k*(3-2*k)));const big=tv>=103.3;
  ctx.save();if(big){const f=1+0.06*Math.sin((tv-103.3)*10);ctx.scale(f,f);}
  text(v.toLocaleString('en-US'),0,-20,big?118:104,900,big?GD:GR,'center',9);ctx.restore();
  text('ways to line up the pairs',0,70,34,800,WH,'center',5);
  const pa=ph(tv,103.3,103.8);ctx.save();ctx.globalAlpha*=pa;pill('2 to the 23rd power',0,150,GD,1,30);ctx.restore();ctx.restore();}
 // 105.6-111.6 four different cells
 if(tv>=105.5){const a=win(tv,105.5,111.7);ctx.save();ctx.globalAlpha*=a;
  F4.forEach((it,k)=>{const x=(k%2?1:-1)*120,y=(k<2?-1:1)*118;const pa=ph(tv,105.7+k*0.35,106.2+k*0.35);minicell(x,y,92,it,pa);});
  const pa=ph(tv,108.3,108.8);ctx.save();ctx.globalAlpha*=pa;pill('variety',0,285,GD,1,34);ctx.restore();ctx.restore();}
 ctx.restore();}
// mitosis vs meiosis
function compare(tv,A){if(A<=0.01)return;ctx.save();ctx.globalAlpha=A;ctx.translate(0,34);
 const L=ph(tv,112.2,112.8),R=ph(tv,115.3,115.9);
 ctx.save();ctx.globalAlpha*=L;text('MITOSIS',-175,-262,44,900,TL,'center',7);
 const par=[[0.42,BL],[0.42,PK],[0.3,BL],[0.3,PK]];
 minicell(-175,-150,62,[[0.42,BL],[0.3,PK]],1);
 drawArrow(-175,-175,0,TL,0);
 ctx.strokeStyle=TL;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(-175,-80);ctx.lineTo(-175,-40);ctx.stroke();
 const d1=ph(tv,113.4,114.0);ctx.save();ctx.globalAlpha*=d1;minicell(-262,40,62,[[0.42,BL],[0.3,PK]],1);minicell(-88,40,62,[[0.42,BL],[0.3,PK]],1);ctx.restore();
 text('2 identical cells',-175,150,28,900,WH,'center',5);text('2n, same as the start',-175,186,22,800,TL,'center',4);ctx.restore();
 ctx.save();ctx.globalAlpha*=R;text('MEIOSIS',175,-262,44,900,PK,'center',7);minicell(175,-150,62,[[0.42,BL],[0.3,PK]],1);
 ctx.strokeStyle=PK;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(175,-80);ctx.lineTo(175,-40);ctx.stroke();
 const d2=ph(tv,116.3,117.0);ctx.save();ctx.globalAlpha*=d2;[[-0.0,0]].length;F4.forEach((it,k)=>minicell(175+(k-1.5)*84,40,38,it,1,PK));ctx.restore();
 text('4 different cells',175,150,28,900,WH,'center',5);text('n, half the chromosomes',175,186,22,800,PK,'center',4);ctx.restore();
 const g=ph(tv,118.5,119.0)*(1-lin(tv,121.3,121.6));ctx.save();ctx.globalAlpha*=g;pill('for growth',-175,250,TL,1,28);ctx.restore();
 const s=ph(tv,119.9,120.4);ctx.save();ctx.globalAlpha*=s;pill('for sex cells',175,250,PK,1,28);ctx.restore();
 const e=ph(tv,121.8,122.4);ctx.save();ctx.globalAlpha*=e;pill('gametes: eggs and sperm',175,300,GD,1,26);ctx.restore();
 ctx.restore();}
function overlays(tv){
 if(tv>=13.3&&tv<16.2){const A=win(tv,13.3,16.2,0.3);ctx.save();ctx.globalAlpha=A;pill('S phase: DNA copies once',0,305,GR,1,28);ctx.restore();}
 if(tv>=16.3&&tv<19.1){const A=win(tv,16.3,19.1,0.3);ctx.save();ctx.globalAlpha=A;pill('2 rounds of division',0,305,BL,1,28);ctx.restore();}
 if(tv>=19.2&&tv<22.4){const A=win(tv,19.2,22.4,0.3);ctx.save();ctx.globalAlpha=A;pill('diploid: 2n = 46',0,305,GD,1,28);text('model shows 2 of the 23 pairs',0,352,22,800,WH,'center',4);ctx.restore();}
 if(tv>=22.4&&tv<25.7){const A=win(tv,22.4,25.7,0.3);ctx.save();ctx.globalAlpha=A;pill('haploid: n = 23',0,305,GD,1,28);ctx.restore();}
 if(tv>=38.8&&tv<44.1){const A=win(tv,38.8,44.1,0.3);ctx.save();ctx.globalAlpha=A;pill('ROUND 1',0,305,GR,1,30);ctx.restore();}
 const c0=cpos(0,tv),c1=cpos(1,tv);
 callout('from mom',-215,300,c0[0],c0[1],BL,tv,44.4,46.9);
 callout('from dad',215,300,c1[0],c1[1],PK,tv,45.2,47.0);
 callout('homologous pair',0,300,-78,-55,WH,tv,47.8,50.2);
 callout('crossing over',0,300,-78,-86,GD,tv,50.7,53.3);
 if(tv>=50.6&&tv<52.2){const f=lin(tv,50.6,52.2);ctx.save();ctx.globalAlpha=(1-f)*0.9;ctx.strokeStyle=GD;ctx.lineWidth=6;for(const[fx,fy]of[[-78,-80],[78,28]]){ctx.beginPath();ctx.arc(fx,fy,14+40*f,0,7);ctx.stroke();}ctx.restore();}
 if(tv>=54.4&&tv<57.0){ctx.save();ctx.globalAlpha=win(tv,54.4,57.0,0.3);ctx.setLineDash([10,9]);ctx.strokeStyle=GD;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-235);ctx.lineTo(0,235);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
 if(tv>=60.2&&tv<62.7){const A=win(tv,60.2,62.7,0.3);ctx.save();ctx.globalAlpha=A;for(const s of[-1,1])text('n = 23',s*CXR,-272,38,900,GD,'center',6);ctx.restore();}
 if(tv>=62.7&&tv<65.6){const A=win(tv,62.7,65.6,0.3);ctx.save();ctx.globalAlpha=A;pill('ROUND 2: no copying',0,305,GR,1,30);ctx.restore();}
 if(tv>=66.5&&tv<69.0){ctx.save();ctx.globalAlpha=win(tv,66.7,69.0,0.3);ctx.setLineDash([10,9]);ctx.strokeStyle=GD;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-390,0);ctx.lineTo(390,0);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
 if(tv>=73.9&&tv<75.6){const A=win(tv,73.9,75.6,0.3);ctx.save();ctx.globalAlpha=A;pill('4 cells, each n = 23',0,305,GD,1,28);ctx.restore();}
 if(tv>=139.8){const A=ph(tv,139.8,140.5);ctx.save();ctx.globalAlpha=A;pill('4 cells, each n = 23',0,305,GD,1,28);ctx.restore();}
}
const TR=[['P','Prophase','#4ADE80'],['M','Metaphase','#F5C84B'],['A','Anaphase','#F472B6'],['T','Telophase','#C4A8FF']];
// chorus letter pops: group 1 = round I, group 2 = round II
const POPS=[];CFG.lines.forEach(l=>{if(/^P, M, A, T/.test(l.text)){for(let k=0;k<4;k++){POPS.push([k,l.words[k][1],1]);POPS.push([k,l.words[5+k][1],2]);}}});
const CHW=[[25.6,38.4],[75.0,88.4],[123.9,139.6]];
function inChorus(tv){return CHW.some(w=>tv>=w[0]&&tv<w[1]);}
function phaseIdx(tv){ // active phase 0..3 and round
 const R=[[40.9,53.4,0,1],[53.44,56.8,1,1],[56.8,59.5,2,1],[59.5,62.7,3,1],[65.6,66.6,0,2],[66.6,68.96,1,2],[68.96,71.84,2,2],[71.84,75.0,3,2]];
 for(const r of R)if(tv>=r[0]&&tv<r[1])return[r[2],r[3]];return[-1,0];}
function tracker(tv){const[act,rd]=phaseIdx(tv);const ch=inChorus(tv);let popRound=0;
 for(let i=0;i<4;i++){let pop=0,pr=0;for(const p of POPS){if(p[0]!==i)continue;const d=tv-p[1];if(d>=0&&d<0.35){const v=1-d/0.35;if(v>pop){pop=v;pr=p[2];}}}
  const on=!ch&&i===act;const lit=on||pop>0;const col=TR[i][2];const sfx=pop>0?(pr===2?' II':' I'):(on?(rd===2?' II':' I'):'');
  const x=LAND?1640:W/2+(i-1.5)*190,y=LAND?290+i*130:300;
  ctx.save();ctx.translate(x,y);const sc=1+0.28*pop+(on?0.08:0);ctx.scale(sc,sc);
  ctx.globalAlpha=lit?1:0.38;if(lit){ctx.shadowColor=col;ctx.shadowBlur=26;}
  ctx.fillStyle=lit?col:'#1B4750';ctx.beginPath();ctx.arc(0,0,42,0,7);ctx.fill();ctx.shadowBlur=0;
  text(TR[i][0],0,3,46,900,lit?'#06141A':'#7DD3FC');ctx.restore();
  ctx.save();ctx.globalAlpha=lit?1:0.45;const nm=TR[i][1]+(lit?sfx:'');if(LAND)text(nm,x+64,y+2,30,800,lit?col:'#7DD3FC','left',4);else text(nm,x,y+66,lit&&sfx?19:21,800,lit?col:'#7DD3FC','center',4);ctx.restore();}}
function info(tv){
 if(tv<2.6)return['MEIOSIS',['2 rounds, 4 cells,','none the same'],GR];
 if(tv<7.2)return['MEIOSIS',['One cell makes','four different cells'],GR];
 if(tv<13)return['MEIOSIS',['Four new cells,','none the same'],GR];
 if(tv<16.3)return['S PHASE',['DNA copies one time'],GR];
 if(tv<19.1)return['TWO ROUNDS',['Round 1, then round 2'],BL];
 if(tv<22.4)return['START: DIPLOID',['2n = 46 in a human cell'],GD];
 if(tv<25.6)return['END: HAPLOID',['n = 23 in a human cell'],GD];
 if(tv<38.4)return['P, M, A, T',['Then P, M, A, T again'],GR];
 if(tv<40.9)return['ROUND 1',['Homologous pairs come apart'],GR];
 if(tv<44.2)return['PROPHASE I',['Matching pairs make a start'],'#4ADE80'];
 if(tv<47.1)return['PROPHASE I',['One chromosome from mom,','one from dad'],'#4ADE80'];
 if(tv<50.4)return['PROPHASE I',['Homologous pairs form a tetrad'],'#4ADE80'];
 if(tv<53.44)return['PROPHASE I',['Crossing over swaps pieces'],'#4ADE80'];
 if(tv<56.8)return['METAPHASE I',['Pairs line up in the middle'],'#F5C84B'];
 if(tv<59.5)return['ANAPHASE I',['Pairs split, sisters stay joined'],'#F472B6'];
 if(tv<62.7)return['TELOPHASE I',['Two haploid cells'],'#C4A8FF'];
 if(tv<65.6)return['ROUND 2',['No copying, straight through'],GR];
 if(tv<66.6)return['PROPHASE II',['Two cells, ready again'],'#4ADE80'];
 if(tv<68.96)return['METAPHASE II',['Sisters line up'],'#F5C84B'];
 if(tv<71.84)return['ANAPHASE II',['Sister chromatids split'],'#F472B6'];
 if(tv<75.0)return['TELOPHASE II',['Four haploid cells'],'#C4A8FF'];
 if(tv<88.4)return['P, M, A, T',['Then P, M, A, T again'],GR];
 if(tv<93.2)return['WHY DIFFERENT?',['Two ways'],GD];
 if(tv<95.7)return['CROSSING OVER',['Pieces get swapped'],PK];
 if(tv<99.4)return['ASSORTMENT',['Independent assortment','shuffles the pairs'],GD];
 if(tv<105.5)return['OVER 8 MILLION',['ways to shuffle 23 pairs'],GR];
 if(tv<112)return['NO TWO ALIKE',['That is how variety stays'],GD];
 if(tv<118.4)return['COMPARE',['Mitosis versus meiosis'],TL];
 if(tv<121.7)return['WHAT FOR?',['Mitosis: growth','Meiosis: sex cells'],GR];
 if(tv<123.9)return['GAMETES',['Eggs and sperm'],GD];
 if(tv<139.6)return['P, M, A, T',['Then P, M, A, T again'],GR];
 return['MEIOSIS',['2 rounds, 4 cells, none the same'],GR];}
function titleBlock(tv){const[t,sub,col]=info(tv);
 if(LAND){text(t,X0,360,tv<2.6?46:56,900,col,'left',8);sub.forEach((s,i)=>text(s,X0,425+i*44,32,800,WH,'left',5));}}
function titlePortrait(tv){const[t,sub,col]=info(tv);
 if(tv<2.6){text(t,W/2,415,54,900,col,'center',8);text('2 ROUNDS, 4 CELLS',W/2,478,62,900,GD,'center',8);text(sub[1],W/2,530,32,800,WH,'center',5);return;}
 text(t,W/2,442,64,900,col,'center',8);const s=sub.join(' ');text(s,W/2,494,s.length>34?27:30,800,WH,'center',5);}
function endCard(t){const tsong=CFG.T-CFG.END;const d=t-tsong;const k=ease(d/0.5);const cx=W/2;const pulse=1+0.05*Math.sin(d*6);
 const Y=LAND?{logo:60,ls:170,title:285,tag:350,btn:480,bh:110,sub:575,q:665,q2:728,nx:812,fs:[76,36,50,40,50,34,32]}:{logo:430,ls:220,title:715,tag:785,btn:930,bh:124,sub:1050,q:1135,q2:1195,nx:1265,fs:[66,36,46,40,40,34,32]};
 ctx.save();ctx.globalAlpha=k;
 if(logo.complete)ctx.drawImage(logo,cx-Y.ls/2,Y.logo,Y.ls,Y.ls);
 text('Molecular Melodies',cx,Y.title,Y.fs[0],900,WH);text('Science, set to music',cx,Y.tag,Y.fs[1],800,GR);
 ctx.save();ctx.translate(cx,Y.btn);ctx.scale(pulse,pulse);ctx.shadowColor=GR;ctx.shadowBlur=34;ctx.fillStyle=GR;rr(-330,-Y.bh/2,660,Y.bh,Y.bh/2);ctx.fill();ctx.shadowBlur=0;text('SUBSCRIBE + FOLLOW',0,4,Y.fs[2]*0.92,900,'#06141A');ctx.restore();
 const a2=ease((d-0.5)/0.4);ctx.globalAlpha=k*a2;text('for more scientific music',cx,Y.sub,Y.fs[3],800,WH,'center',5);
 const a3=ease((d-1.2)/0.4);ctx.globalAlpha=k*a3;text('What concept should we sing next?',cx,Y.q,Y.fs[4],900,GD,'center',6);text('Tell us in the comments',cx,Y.q2,Y.fs[5]-2,800,WH,'center',5);
 const a4=ease((d-2.2)/0.4);ctx.globalAlpha=k*a4;text('Next up: Photosynthesis',cx,Y.nx,Y.fs[6],800,BL,'center',5);
 const a5=ease((d-2.8)/0.4);ctx.globalAlpha=k*a5;
 if(LAND)text('Sources: OpenStax Biology 2e, Ch. 11.1  |  OpenStax Concepts of Biology, Ch. 7.2',cx,925,24,700,'#9FC9CF','center',4);
 else{text('Sources: OpenStax Biology 2e, Ch. 11.1',cx,1370,24,700,'#9FC9CF','center',4);text('OpenStax Concepts of Biology, Ch. 7.2',cx,1406,24,700,'#9FC9CF','center',4);}
 ctx.restore();}
function draw(t){ctx.clearRect(0,0,W,H);bg();const tsong=CFG.T-CFG.END;
 if(t>=tsong){hexes(t+CFG.S0);header(1);endCard(t);return;}
 const tv=t+CFG.S0;const fadeOut=clamp((tsong-t)/1.0);hexes(tv);ctx.save();ctx.globalAlpha=fadeOut;
 header();progress(tv,t);tracker(tv);
 if(LAND)titleBlock(tv);else titlePortrait(tv);
 const SC=LAND?0.85:1.0,CX=W/2,CY=LAND?570:800;
 ctx.save();ctx.translate(CX,CY);ctx.scale(SC,SC);
 let sa=1;for(const w of CHW)sa*=1-win(tv,w[0],w[1],0.5);sa*=1-win(tv,88.4,111.7,0.5)*1;sa*=1-win(tv,111.7,123.9,0.5);
 if(sa>0.01){ctx.save();ctx.globalAlpha=sa;drawCells(tv);drawSpindle(tv);drawChroms(tv);overlays(tv);
  for(const j of [61.7,73.9]){const d=tv-j;if(d>=0&&d<0.5){ctx.save();ctx.globalAlpha=1-d/0.5;ctx.strokeStyle=WH;ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,0,60+250*(d/0.5),0,7);ctx.stroke();ctx.restore();}}
  ctx.restore();}
 let da=0;for(const w of CHW)da=Math.max(da,win(tv,w[0],w[1],0.5));diagram(tv,da);
 bridge(tv,win(tv,88.4,111.7,0.5));compare(tv,win(tv,111.7,123.9,0.5));
 ctx.restore();
 lyric(tv);ctx.restore();}
window.draw=draw;
</script></body></html>
