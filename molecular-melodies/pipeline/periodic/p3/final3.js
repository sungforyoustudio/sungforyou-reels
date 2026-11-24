// ===== Part 3 specific =====
const lerpC=(a,b,t)=>{const pa=[1,3,5].map(i=>parseInt(a.substr(i,2),16)),pb=[1,3,5].map(i=>parseInt(b.substr(i,2),16));return '#'+pa.map((v,i)=>Math.round(v+(pb[i]-v)*t).toString(16).padStart(2,'0')).join('');};
const WT=(i,k)=>CFG.lines[i].words[k][1];const LS=i=>CFG.lines[i].words[0][1];const LE=i=>{const w=CFG.lines[i].words;return w[w.length-1][2];};
const CC={mt:'#7DD3FC',md:'#F5C84B',nm:'#4ADE80'};const NEU='#5F8089',TEAL='#2DD4BF',PINK='#F472B6',GOLD='#F5C84B';
function cls(z){const f=fam(z);return f==='md'?'md':(f==='nm'||f==='hal'||f==='nob')?'nm':'mt';}
const ONS=[];CFG.lines.forEach(l=>l.words.forEach(w=>ONS.push(w[1])));ONS.sort((a,b)=>a-b);
function kick(tv){let lo=0,hi=ONS.length-1,r=-1;while(lo<=hi){const m=(lo+hi)>>1;if(ONS[m]<=tv){r=m;lo=m+1}else hi=m-1;}if(r<0)return 0;return clamp(1-(tv-ONS[r])/0.28);}
const EN={1:2.2,3:.98,4:1.57,5:2.04,6:2.55,7:3.04,8:3.44,9:3.98,11:.93,12:1.31,13:1.61,14:1.9,15:2.19,16:2.58,17:3.16,19:.82,20:1,21:1.36,22:1.54,23:1.63,24:1.66,25:1.55,26:1.83,27:1.88,28:1.91,29:1.9,30:1.65,31:1.81,32:2.01,33:2.18,34:2.55,35:2.96,36:3,37:.82,38:.95,39:1.22,40:1.33,41:1.6,42:2.16,43:1.9,44:2.2,45:2.28,46:2.2,47:1.93,48:1.69,49:1.78,50:1.96,51:2.05,52:2.1,53:2.66,54:2.6,55:.79,56:.89,71:1.27,72:1.3,73:1.5,74:2.36,75:1.9,76:2.2,77:2.2,78:2.28,79:2.54,80:2,81:1.62,82:2.33,83:2.02,84:2,85:2.2,87:.7,88:.9};
for(let z=57;z<=70;z++)EN[z]=1.15;for(let z=89;z<=102;z++)EN[z]=1.3;
function heatC(en){const t=clamp((en-0.7)/3.28);return t<.5?lerpC('#3B82F6','#FACC15',t*2):lerpC('#FACC15','#F43F5E',(t-.5)*2);}
const ROWS=[[10.88,17.2,[0]],[18.96,21.1,[1,2]],[21.12,23.3,[3,4]],[23.28,25.0,[5,6]],[25.1,27.4,[7.4,8.4]]];
const G1=[1,3,11,19,37,55,87],G17=[9,17,35,53,85,117];
function famCol(z){const f=fam(z);return f==='inner'?(z<=70?'#F0ABFC':'#FDBA74'):(COL[f]);}
function stateFor(z,tv){const r=pos(z)[0];const f=fam(z);
 if(tv<6.8)return[NEU,0.3,false];
 if(tv<27.4){for(const R of ROWS)if(tv>=R[0]&&tv<R[1]&&R[2].includes(r))return[TEAL,1,false];if(tv<10.88)return[NEU,0.5,false];return[NEU,0.25,false];}
 if(tv<33.6)return r===2?[TEAL,1,false]:[NEU,0.25,false];
 if(tv<56.5)return[famCol(z),0.6,false];
 if(tv<59.7)return[NEU,0.3,false];
 if(tv<68.2)return r===2?[TEAL,1,false]:[NEU,0.22,false];
 if(tv<77.6){const c=CC[cls(z)];return[c,tv<72.3?0.55:(MDS.includes(z)?1:0.5),tv>=72.3&&MDS.includes(z)];}
 if(tv<96.0)return[famCol(z),0.6,false];
 if(tv<108.4){const e=EN[z];if(e===undefined)return[NEU,0.3,false];return[heatC(e),tv<99.8?0.9:1,z===9&&tv>=103.8];}
 if(tv<125.2){const e=EN[z];return e===undefined?[NEU,0.25,false]:[heatC(e),0.4,false];}
 if(tv<132.88){return G1.includes(z)?[COL.alk,1,z===55&&tv>=128.7&&tv<131.4]:[NEU,0.22,false];}
 if(tv<137.76){return G17.includes(z)?[COL.hal,1,z===9&&tv>=134.4]:[NEU,0.22,false];}
 if(tv<142.0)return[famCol(z),0.7,false];
 if(tv<150.7)return[NEU,0.32,false];
 return[famCol(z),tv>=153?1:0.85,false];}
const MDS=[5,14,32,33,51,52];
function arrow(x0,y0,x1,y1,col,w=7,a=1){const ang=Math.atan2(y1-y0,x1-x0);ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.shadowColor=col;ctx.shadowBlur=16;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-22*Math.cos(ang-0.45),y1-22*Math.sin(ang-0.45));ctx.lineTo(x1-22*Math.cos(ang+0.45),y1-22*Math.sin(ang+0.45));ctx.closePath();ctx.fill();ctx.restore();}
function tblArrows(tv){let a=0,b=0;
 if(tv>=27.6&&tv<33.6){a=ease((tv-27.8)/1.2);}
 if((tv>=33.68&&tv<56)||(tv>=82-4&&tv<96)||(tv>=150.7)){a=1;b=1;}
 if(tv>=59.8&&tv<68.2){a=ease((tv-60)/1.5);}
 if(tv>=108.4&&tv<125.2){a=ease((tv-111.9)/1.0);b=ease((tv-113.9)/1.0);}
 if(tv>=142&&tv<150.7){a=1;b=1;}
 if(tv>=125.2&&tv<132.88){b=ease((tv-125.4)/1.2);}
 if(tv>=132.88&&tv<137.76){b=ease((tv-133)/1.2);}
 const yr=Y0+2*CH+CH/2;
 if(a>0)arrow(X0+1.9*CW,yr,X0+(1.9+9.6*a)*CW,yr,'#F5C84B',8,Math.min(1,a*1.5));
 if(b>0){const xc=(tv>=132.88&&tv<137.76)?X0+16*CW+CW/2:X0+CW/2;const ya=Y0+0.2*CH,yb=Y0+(0.2+5.8*b)*CH;ctx.save();ctx.globalAlpha=0.9;arrow(xc,ya,xc,yb,'#FFFFFF',7,Math.min(1,b*1.5));ctx.restore();}}
function table3(tv){const cnt=clamp((tv-0.2)/2.7)*118+0.001;
 for(let z=1;z<=118;z++){const rev=clamp(cnt-z+1);if(rev<=0)continue;const[x,y]=cellXY(z);const[col0,al0,glow]=stateFor(z,tv);
  // smooth transitions: blend with previous state sampled 0.4s earlier
  const[colP,alP]=stateFor(z,tv-0.4);const k=0.55;const col=lerpC(colP,col0,k),al=lerp(alP,al0,k);
  const sc=(0.6+0.4*ease(rev))*(1+(al>0.95?0.02*kick(tv):0)+(glow?0.12:0));const cx=x+CW/2,cy=y+CH/2;ctx.save();ctx.globalAlpha=al*ease(rev);ctx.translate(cx,cy);ctx.scale(sc,sc);
  if(glow){ctx.shadowColor=col;ctx.shadowBlur=22;}ctx.fillStyle=col;rr(-CW/2+2,-CH/2+2,CW-4,CH-4,7);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle='#06141A';ctx.font=`800 ${Math.round(21*CW/51)}px Montserrat`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(SYM[z-1],0,1);ctx.restore();}
 const lab=ease((tv-1.8)/0.8);ctx.save();ctx.globalAlpha=lab;for(let r=0;r<7;r++){const big=ROWS.some(R=>tv>=R[0]&&tv<R[1]&&R[2].includes(r))||(tv>=27.6&&tv<33.6&&r===2)||(tv>=59.7&&tv<68.2&&r===2);text(String(r+1),X0-22,Y0+r*CH+CH/2,big?30:22,big?900:700,big?'#F5C84B':'#7DD3FC');}
 for(let c=0;c<18;c++)text(String(c+1),X0+c*CW+CW/2,Y0-20,20,700,'#7DD3FC');
 text('GROUPS',X0+9*CW,Y0-52,22,800,'#EFFFFA');ctx.save();ctx.translate(X0-52,Y0+3.5*CH);ctx.rotate(-Math.PI/2);text('PERIODS',0,0,22,800,'#EFFFFA');ctx.restore();ctx.restore();
 ctx.save();ctx.globalAlpha=lab;tblArrows(tv);ctx.restore();
 // period length counters on the right of each row
 if(tv>=18.96&&tv<27.4){const L=[[1,2,10.88],[2,8,18.96],[3,8,19.6],[4,18,21.12],[5,18,21.8],[6,32,23.28],[7,32,24.0]];ctx.save();L.forEach(([p,n,t0])=>{const a=ease((tv-t0)/0.3);if(a<=0)return;ctx.globalAlpha=a;text(String(n),X0+18*CW+30,Y0+(p-1)*CH+CH/2,28,900,'#F5C84B','left',4);});ctx.restore();}
}
// ---- panel helpers ----
function cap(s,col='#EFFFFA',y=1150,size=30){text(s,540,y,size,800,col,'center',4);}
function bigTile(x,y,sym,col,sc,a,sub){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.scale(sc,sc);ctx.shadowColor=col;ctx.shadowBlur=24;ctx.fillStyle=col;rr(-60,-60,120,120,20);ctx.fill();ctx.shadowBlur=0;text(sym,0,-4,64,900,'#06141A');if(sub)text(sub,0,38,22,800,'#06141A');ctx.restore();}
function pRows(tv,t0){const a=ease((tv-t0)/0.3);for(let i=0;i<7;i++){const k=ease((tv-t0-0.15*i)/0.3);if(k<=0)continue;ctx.save();ctx.globalAlpha=k;const w=300;const y=875+i*40;ctx.fillStyle=i%2?'#2DD4BF':'#4ADE80';rr(540-w/2,y-15,w,30,15);ctx.fill();text('Period '+(i+1),540,y+1,22,900,'#06141A');ctx.restore();}
 cap('7 rows = 7 periods','#EFFFFA',1190,28);}
function pShells(tv,t0){const n=Math.min(7,1+Math.floor((tv-t0)/0.5));const k=ease((tv-t0)/0.3);ctx.save();ctx.globalAlpha=k;atom(540,1000,'',n,1,'#4ADE80',1.0,true);ctx.restore();text('shells: '+n,540,1185,32,900,'#4ADE80','center',4);}
function pPeriod1(tv,t0){const k=ease((tv-t0)/0.4);bigTile(400,1010,'H','#4ADE80',0.8+0.2*k,k,'1');const k2=ease((tv-LS(3)+0.3)/0.4);bigTile(680,1010,'He','#C4A8FF',0.8+0.2*k2,k2,'2');cap('period 1: just 2 elements','#EFFFFA',1130,28);}
function pLens(tv,t0){const L=[[2,10.88],[8,18.96],[8,19.6],[18,21.12],[18,21.8],[32,23.28],[32,24.0]];L.forEach(([n,ts],i)=>{const k=ease((tv-ts)/0.4);if(k<=0)return;const y=885+i*38;ctx.save();ctx.globalAlpha=k;ctx.fillStyle=n>=32?'#F0ABFC':(n>=18?'#7DD3FC':'#4ADE80');const w=(n/32)*420*k;rr(260,y-13,Math.max(14,w),26,13);ctx.fill();text('P'+(i+1),235,y+1,20,800,'#EFFFFA','right');text(String(n),260+Math.max(14,w)+34,y+1,22,900,'#EFFFFA');ctx.restore();});
 if(tv>=25.1){const k=ease((tv-25.1)/0.4);ctx.save();ctx.globalAlpha=k;text('the long rows float below',540,1190,26,800,'#F0ABFC','center',4);ctx.restore();}}
function pProton(tv,t0){const A=[['Na',1,11],['Mg',2,12],['Al',3,13]];A.forEach(([s,o,p],i)=>{const k=ease((tv-t0-i*0.5)/0.4);if(k<=0)return;ctx.save();ctx.globalAlpha=k;atom(540+(i-1)*215,990,s,3,o,'#2DD4BF',0.75,i===2);text(p+' protons',540+(i-1)*215,1110,24,800,'#F5C84B','center',4);ctx.restore();});
 const k=ease((tv-LS(9))/0.4);ctx.save();ctx.globalAlpha=k;cap('same shell, stronger core','#F5C84B',1170,28);ctx.restore();}
function pTrends(tv,t0,b){const A=[['F',2,7,0.82],['O',2,6,0.72],['N',2,5,0.62]];const a1=ease((tv-LS(b))/0.4);ctx.save();ctx.globalAlpha=a1;A.forEach(([s,sh,o,sc],i)=>atom(340+i*180,930,s,sh,o,'#4ADE80',sc*0.78,false));arrow(250,1012,830,1012,'#F5C84B',6);ctx.restore();ctx.save();ctx.globalAlpha=a1;text('across: shrink',540,1050,28,900,'#F5C84B','center',4);ctx.restore();
 const a2=ease((tv-LS(b+1))/0.4);ctx.save();ctx.globalAlpha=a2;[['Li',2,1],['Na',3,1],['K',4,1]].forEach(([s,sh,o],i)=>atom(340+i*180,1120,s,sh,o,'#FF7A8A',0.5,false));ctx.restore();ctx.save();ctx.globalAlpha=a2;text('down: grow',540,1215,28,900,'#FF7A8A','center',4);ctx.restore();
 const a3=ease((tv-LS(b+2))/0.3);if(a3>0){ctx.save();ctx.globalAlpha=a3*(1-ease((tv-LS(b+3)-0.2)/0.3));const sc=1+0.05*Math.sin(tv*6);ctx.translate(540,985);ctx.scale(sc,sc);text('Left lets go, right holds on',0,0,34,900,'#EFFFFA','center',7);ctx.restore();}}
function pPeriod3(tv,t0){const A=[['Na',1,11,0.8],['Al',3,13,0.7],['P',5,15,0.6],['Cl',7,17,0.52]];A.forEach(([s,o,p,sc],i)=>{const k=ease((tv-t0-i*0.55)/0.4);if(k<=0)return;ctx.save();ctx.globalAlpha=k;atom(340+i*160,985,s,3,o,'#2DD4BF',sc,false);text(p+'+',340+i*160,1100,26,900,'#F5C84B','center',4);ctx.restore();});
 const a=ease((tv-LS(16))/0.4);if(a>0){ctx.save();ctx.globalAlpha=a;arrow(255,1160,820,1160,'#F5C84B',5);text('stronger pull: atom shrinks',540,1200,26,800,'#EFFFFA','center',4);ctx.restore();}}
function pGive(tv,t0){ctx.save();atom(330,990,'Na',3,1,'#7DD3FC',0.75,false);atom(750,990,'Cl',3,7,'#4ADE80',0.75,false);ctx.restore();text('metal',330,1100,26,900,'#7DD3FC','center',4);text('nonmetal',750,1100,26,900,'#4ADE80','center',4);
 const p=clamp((tv-LS(18)-0.2)/(LS(19)+1.2-LS(18)));if(p>0&&p<1.01){const x=lerp(380,700,ease(p)),y=990-90*Math.sin(Math.PI*clamp(p));ctx.save();ctx.fillStyle='#EFFFFA';ctx.shadowColor='#F5C84B';ctx.shadowBlur=20;ctx.beginPath();ctx.arc(x,y,11,0,7);ctx.fill();ctx.restore();}
 if(tv<LS(19))cap('metals give electrons away','#7DD3FC',1160,26);else if(tv<LS(20)-0.2)cap('nonmetals take them in','#4ADE80',1160,26);else{const k=ease((tv-LS(20))/0.4);ctx.save();ctx.globalAlpha=k;ctx.fillStyle=GOLD;ctx.shadowColor=GOLD;ctx.shadowBlur=18;rr(540-90,975,180,56,28);ctx.fill();ctx.shadowBlur=0;text('metalloids',540,1004,26,900,'#06141A');text('the staircase between them',540,1160,26,800,GOLD,'center',4);ctx.restore();}}
function pEN(tv,t0){const k=ease((tv-t0)/0.4);ctx.save();ctx.globalAlpha=k;atom(330,985,'Na',3,1,'#7DD3FC',0.7,false);atom(760,985,'F',2,7,'#F43F5E',0.9,tv>=LS(28));ctx.restore();
 const t=tv-LS(26);const dx=lerp(560,640,clamp((tv-LS(27))/3));ctx.save();ctx.globalAlpha=k;ctx.strokeStyle='rgba(239,255,250,.5)';ctx.lineWidth=5;ctx.setLineDash([12,10]);ctx.beginPath();ctx.moveTo(400,985);ctx.lineTo(690,985);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#EFFFFA';ctx.shadowColor=GOLD;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(dx,985,12,0,7);ctx.fill();ctx.restore();
 ctx.save();ctx.globalAlpha=k;text('0.93',330,1100,30,900,'#7DD3FC','center',4);text('3.98',760,1100,34,900,'#F43F5E','center',4);ctx.restore();
 cap(tv<LS(28)?'electronegativity: the pull on shared electrons':'fluorine pulls hardest','#EFFFFA',1170,24);}
function pIE(tv,t0){const P=[['Na',5.14],['Mg',7.65],['Al',5.99],['Si',8.15],['P',10.49],['S',10.36],['Cl',12.97],['Ar',15.76]];const G=[['Li',5.39],['Na',5.14],['K',4.34],['Rb',4.18],['Cs',3.89]];
 const showG=tv>=LS(31)+2.0;const arr=showG?G:P;const t1=showG?LS(31)+2.0:LS(30)+0.2;const n=arr.length;const bw=showG?70:56,gap=showG?30:14;const x0=540-(n*(bw+gap)-gap)/2;
 arr.forEach(([s,v],i)=>{const k=ease((tv-t1-i*0.12)/0.4);if(k<=0)return;const h=v/16*180*k;const x=x0+i*(bw+gap);ctx.save();ctx.fillStyle=showG?'#FF7A8A':'#F5C84B';rr(x,1130-h,bw,h,6);ctx.fill();text(s,x+bw/2,1150,22,900,'#EFFFFA');text(v.toFixed(1),x+bw/2,1130-h-14,20,800,'#EFFFFA');ctx.restore();});
 cap(showG?'down a group: it falls':'across a period: it rises','#EFFFFA',900,26);text('ionization energy (eV)',540,1190,20,700,'#9CC7D1');
 if(tv>=LS(32)){const k=ease((tv-LS(32))/0.4);ctx.save();ctx.globalAlpha=k*0.9;text('far from the core: easy to remove',540,935,22,800,'#FF7A8A','center',4);ctx.restore();}}
function pGroup1(tv,t0){const A=[['Li',2],['Na',3],['K',4],['Rb',5],['Cs',6]];A.forEach(([s,sh],i)=>{const k=ease((tv-t0-i*0.3)/0.4);if(k<=0)return;ctx.save();ctx.globalAlpha=k;atom(290+i*125,990,s,sh,1,'#FF7A8A',0.34,s==='Cs'&&tv>=LS(36));ctx.restore();});
 cap('down the group: more shells','#FF7A8A',1130,26);
 if(tv>=LS(36)){const p=clamp((tv-LS(36))/1.6);ctx.save();ctx.fillStyle='#EFFFFA';ctx.shadowColor=GOLD;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(540+60+p*210,990-30*p,10,0,7);ctx.fill();ctx.restore();text('cesium lets go with ease',540,1190,26,900,GOLD,'center',4);}}
function pHal(tv,t0){const A=[['F',2,4],['Cl',3,3],['Br',4,2],['I',5,1]];A.forEach(([s,sh,h],i)=>{const k=ease((tv-t0-i*0.35)/0.4);if(k<=0)return;ctx.save();ctx.globalAlpha=k;atom(310+i*155,935,s,sh,7,'#4ADE80',0.4,false);const bh=h*42*k;ctx.fillStyle='#4ADE80';rr(310+i*155-28,1160-bh,56,bh,6);ctx.fill();ctx.restore();});
 text('reactivity',540,1190,22,800,'#9CC7D1');arrow(260,1100,830,1100,'#EFFFFA',4,0.8);cap('halogens flip it: reactivity falls','#4ADE80',875,26);}
function pCombine(tv,t0){const k=ease((tv-t0)/0.4),k2=ease((tv-LS(41))/0.4);ctx.save();ctx.globalAlpha=k;ctx.fillStyle='#FF7A8A';rr(250,950,200,70,35);ctx.fill();text('family',350,986,30,900,'#06141A');ctx.restore();ctx.save();ctx.globalAlpha=k;text('+',540,986,50,900,'#EFFFFA');ctx.fillStyle=GOLD;rr(630,950,200,70,35);ctx.fill();text('trend',730,986,30,900,'#06141A');ctx.restore();ctx.save();ctx.globalAlpha=k2;text('= predict any element',540,1090,34,900,'#4ADE80','center',5);ctx.restore();}
function pTug(tv,t0){const k=ease((tv-t0)/0.4);const w=Math.sin(tv*5)*10*(tv<LS(45)?1:0.3);ctx.save();ctx.globalAlpha=k;ctx.strokeStyle='#EFFFFA';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(270,990);ctx.lineTo(810,990);ctx.stroke();ctx.fillStyle=GOLD;ctx.beginPath();ctx.arc(540+w,990,16,0,7);ctx.fill();
 for(let i=0;i<3;i++){ctx.fillStyle='#F43F5E';ctx.beginPath();ctx.arc(300+i*42,990,17,0,7);ctx.fill();text('+',300+i*42,991,22,900,'#06141A');ctx.fillStyle='#38BDF8';ctx.beginPath();ctx.arc(780-i*42,990,17,0,7);ctx.fill();text('e',780-i*42,991,20,900,'#06141A');}
 text('protons pulling',360,1060,24,900,'#F43F5E','center',4);text('shielding',730,1060,24,900,'#38BDF8','center',4);ctx.restore();
 if(tv>=LS(45)){const a=ease((tv-LS(45))/0.4);ctx.save();ctx.globalAlpha=a;text('the electrons keep score',540,1160,30,900,'#4ADE80','center',5);ctx.restore();}}
function pEnd(tv,t0){const k=ease((tv-t0)/0.4);ctx.save();ctx.globalAlpha=k;text('across and down',540,985,42,900,'#F5C84B','center',6);text('the trends are on',540,1045,34,900,'#EFFFFA','center',5);ctx.restore();}
const PAN=[
 [2.9,6.8,pRows],[6.88,10.8,pShells],[10.88,18.9,pPeriod1],[18.96,27.4,pLens],[27.5,33.6,pProton],
 [33.68,LE(13)+0.3,(tv,t0)=>pTrends(tv,t0,10)],
 [59.7,68.2,pPeriod3],[68.24,76.6,pGive],
 [78.16,LE(25)+0.3,(tv,t0)=>pTrends(tv,t0,22)],
 [96.0,108.4,pEN],[108.36,125.3,pIE],[125.3,132.9,pGroup1],[132.9,137.75,pHal],[137.76,141.8,pCombine],[142.0,150.6,pTug],
 [150.72,LE(50)+0.3,(tv,t0)=>pTrends(tv,t0,46)],[LE(50)+0.3,999,pEnd]];

function lyric(tv){let L=null;for(let i=0;i<CFG.lines.length;i++){const l=CFG.lines[i];const s=l.words[0][1]-0.3;let e=l.words[l.words.length-1][2]+0.5;const n=CFG.lines[i+1];if(n)e=Math.min(e,n.words[0][1]-0.05);if(tv>=s&&tv<e){L=l;break;}}
 if(!L)return;const ws=L.words;const full=ws.map(w=>w[0]).join(' ');let rows=[ws];if(full.length>(LAND?44:24)){let best=1,bd=1e9;for(let i=1;i<ws.length;i++){const a=ws.slice(0,i).map(w=>w[0]).join(' ').length,b=full.length-a;const d=Math.abs(a-b);if(d<bd){bd=d;best=i;}}rows=[ws.slice(0,best),ws.slice(best)];}
 const fade=ease((tv-(ws[0][1]-0.3))/0.2);ctx.save();ctx.globalAlpha=fade;ctx.font=`900 ${LAND?72:62}px Montserrat`;rows.forEach((r,ri)=>{const total=r.map(w=>ctx.measureText(w[0]+' ').width).reduce((a,b)=>a+b,0);let x=W/2-total/2;const y=(LAND?930:1290)+ri*80-(rows.length-1)*40;
  r.forEach(w=>{const wd=ctx.measureText(w[0]+' ').width;const on=tv>=w[1];const pop=on?1+0.08*clamp(1-(tv-w[1])/0.2):1;const cx=x+ctx.measureText(w[0]).width/2;ctx.save();ctx.translate(cx,y);ctx.scale(pop,pop);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=9;ctx.strokeStyle='rgba(2,10,14,.92)';ctx.lineJoin='round';ctx.strokeText(w[0],0,0);ctx.fillStyle=on?'#4ADE80':'#FFFFFF';ctx.fillText(w[0],0,0);ctx.restore();x+=wd;});});ctx.restore();}
function hexes(tv){ctx.save();for(let i=0;i<16;i++){const sp=14+rnd(i+3)*26;const x=rnd(i)*W;const y=H+80-((tv*sp+rnd(i+9)*(H+200))%(H+200));const r=26+rnd(i+5)*70;ctx.strokeStyle=i%3===0?'rgba(245,200,75,.10)':'rgba(74,222,128,.10)';ctx.lineWidth=3;ctx.beginPath();for(let k=0;k<6;k++){const g=Math.PI/3*k+tv*0.1*(i%2?1:-1);ctx.lineTo(x+r*Math.cos(g),y+r*Math.sin(g));}ctx.closePath();ctx.stroke();}ctx.restore();}
function hook(tv){if(tv>2.55)return;const k=ease((tv-0.1)/0.3),o=1-ease((tv-2.2)/0.3);ctx.save();ctx.globalAlpha=k*o;const sc=1+0.05*Math.sin(tv*6);const y=(LAND?930:1290);ctx.translate(W/2,y);ctx.scale(sc,sc);text('Why do atoms shrink across',0,-44,LAND?60:46,900,'#FFFFFF','center',9);text('but grow going down?',0,32,LAND?68:54,900,'#F5C84B','center',9);ctx.restore();}
function progress(tv,t){const p=clamp(t/(CFG.T-CFG.END));const x0=LAND?X0:81,w=LAND?18*CW:918,y=LAND?138:200;ctx.save();ctx.globalAlpha=0.55;ctx.fillStyle='rgba(239,255,250,.18)';rr(x0,y,w,6,3);ctx.fill();ctx.fillStyle='#4ADE80';rr(x0,y,Math.max(6,w*p),6,3);ctx.fill();ctx.restore();}

// ---- end card with call to action ----
function endCard(t){const tsong=CFG.T-CFG.END;const d=t-tsong;const k=ease(d/0.5);const cx=W/2;const pulse=1+0.05*Math.sin(d*6);
 const Y=LAND?{logo:60,ls:170,title:285,tag:350,btn:480,bh:110,sub:575,q:665,q2:728,nx:812,fs:[76,36,50,40,50,34,32]}:{logo:430,ls:220,title:715,tag:785,btn:930,bh:124,sub:1050,q:1135,q2:1195,nx:1265,fs:[66,36,46,40,40,34,32]};
 ctx.save();ctx.globalAlpha=k;
 if(logo.complete)ctx.drawImage(logo,cx-Y.ls/2,Y.logo,Y.ls,Y.ls);
 text('Molecular Melodies',cx,Y.title,Y.fs[0],900,'#EFFFFA');text('Science, set to music',cx,Y.tag,Y.fs[1],800,'#4ADE80');
 ctx.save();ctx.translate(cx,Y.btn);ctx.scale(pulse,pulse);ctx.shadowColor='#4ADE80';ctx.shadowBlur=34;ctx.fillStyle='#4ADE80';rr(-330,-Y.bh/2,660,Y.bh,Y.bh/2);ctx.fill();ctx.shadowBlur=0;text('SUBSCRIBE + FOLLOW',0,4,Y.fs[2]*0.92,900,'#06141A');ctx.restore();
 const a2=ease((d-0.5)/0.4);ctx.globalAlpha=k*a2;text('for more scientific music',cx,Y.sub,Y.fs[3],800,'#EFFFFA','center',5);
 const a3=ease((d-1.2)/0.4);ctx.globalAlpha=k*a3;text('What concept should we sing next?',cx,Y.q,Y.fs[4],900,'#F5C84B','center',6);text('Tell us in the comments',cx,Y.q2,Y.fs[5]-2,800,'#EFFFFA','center',5);
 const a4=ease((d-2.2)/0.4);ctx.globalAlpha=k*a4;text('Watch Parts 1 and 2 on the channel',cx,Y.nx,Y.fs[6],800,'#7DD3FC','center',5);
 ctx.restore();}
function draw(t){ctx.clearRect(0,0,W,H);bg();const tsong=CFG.T-CFG.END;
 if(t>=tsong){hexes(t+CFG.S0);header(1);endCard(t);return;}
 const tv=t+CFG.S0;const fadeOut=clamp((tsong-t)/1.0);hexes(tv);ctx.save();ctx.globalAlpha=fadeOut;
 const kk=kick(tv);ctx.save();if(logo.complete){}ctx.restore();header();progress(tv,t);table3(tv);
 ctx.save();if(LAND){ctx.translate(1527,470);ctx.scale(0.98,0.98);ctx.translate(-540,-1030);}
 for(const p of PAN){if(tv>=p[0]&&tv<p[1]){ctx.save();ctx.globalAlpha=ease((tv-p[0])/0.25)*clamp((p[1]-tv)/0.15+0.0001,0,1)||0;p[2](tv,p[0]);ctx.restore();break;}}
 ctx.restore();hook(tv);lyric(tv);ctx.restore();}
window.draw=draw;

