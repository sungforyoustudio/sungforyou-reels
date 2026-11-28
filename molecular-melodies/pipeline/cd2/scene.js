// ================= meiosis model =================
const lin=(tv,a,b)=>clamp((tv-a)/(b-a));const ph=(tv,a,b)=>ease((tv-a)/(b-a));
const win=(tv,a,b,f=0.4)=>ease((tv-a)/f)*ease((b-tv)/f);
const BL='#7DD3FC',PK='#F472B6',GD='#F5C84B',GR='#4ADE80',TL='#2DD4BF',WH='#EFFFFA';
// chromosomes: 0 long blue (mom), 1 long pink (dad), 2 short blue, 3 short pink
const CH=[{c:BL,L:48,o:PK,tk:1},{c:PK,L:48,o:BL,tk:0},{c:BL,L:32,o:PK,tk:1},{c:PK,L:32,o:BL,tk:0}];
const HOME=[[-70,-60,0.3],[60,-45,-0.4],[-55,55,0.7],[65,60,-0.2]];
const TET=[[-95,-55],[-61,-55],[61,62],[95,62]];
const PLT=[[-17,-92],[17,-92],[-14,92],[14,92]];
const SIDE=[-1,1,1,-1],YP1=[-70,-70,70,70];       // anaphase I sides (pair 2 assorts the other way)
const CXR=204.5;                                   // daughter cell centre
const aR1=tv=>300*(1+0.35*lin(tv,56.9,59.4)),bR1=tv=>250*(1-0.05*lin(tv,56.9,59.4));
function cellPath(a,b,p){ctx.beginPath();for(let k=0;k<=96;k++){const th=k/96*Math.PI*2;const x=a*Math.cos(th);let y=b*Math.sin(th)*(1-p*Math.exp(-Math.pow(x/(a*0.26),2)));k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();}
function cellPathV(a,b,p){ctx.beginPath();for(let k=0;k<=96;k++){const th=k/96*Math.PI*2;const y=b*Math.sin(th);let x=a*Math.cos(th)*(1-p*Math.exp(-Math.pow(y/(b*0.26),2)));k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();}
function cellStyle(){const gr=ctx.createRadialGradient(0,0,20,0,0,200);gr.addColorStop(0,'rgba(45,212,191,.20)');gr.addColorStop(1,'rgba(45,212,191,.07)');ctx.shadowColor=TL;ctx.shadowBlur=24;ctx.strokeStyle=TL;ctx.lineWidth=7;ctx.fillStyle=gr;}
function drawCells(tv){
 ctx.save();cellStyle();
 if(tv<61.7){const a=aR1(tv),b=bR1(tv),p=lin(tv,59.7,61.7);cellPath(a,b,p*0.985);ctx.fill();ctx.stroke();}
 else if(tv<73.9){const p=lin(tv,71.9,73.9)*0.985;for(const s of[-1,1]){ctx.save();ctx.translate(s*CXR,0);cellPathV(184.5,230,p);ctx.fill();ctx.stroke();ctx.restore();}}
 else{for(const s of[-1,1])for(const t of[-1,1]){ctx.save();ctx.translate(s*CXR,t*127);ctx.beginPath();ctx.ellipse(0,0,184.5,109,0,0,7);ctx.fill();ctx.stroke();ctx.restore();}}
 ctx.restore();
 const env=tv<41?1:1-lin(tv,41,43.3);
 if(env>0.01){ctx.save();ctx.globalAlpha=env;ctx.fillStyle='rgba(125,211,252,.10)';ctx.strokeStyle=BL;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(0,0,150,138,0,0,7);ctx.fill();ctx.stroke();ctx.restore();}}
function thread(x,y,ang,len,col,seed,a,w,off=0){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();for(let k=0;k<=26;k++){const t=k/26;const yy=(t-0.5)*len*2.1;const xx=Math.sin(t*13+seed)*13+Math.sin(t*5+seed*2)*9+off;k?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();ctx.restore();}
// X chromosome, crossover tip on one chromatid (top end) when cx>0
function xchrom(i,x,y,ang,a,cx,sc=1){const C=CH[i],L=C.L;ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(sc,sc);ctx.globalAlpha*=a;ctx.lineWidth=15;ctx.lineCap='round';
 for(let k=0;k<2;k++){const x0=k?13:-13,x1=k?-13:13;const tipOn=cx>0&&k===C.tk;
  ctx.strokeStyle=C.c;ctx.shadowColor=C.c;ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x0,-L);ctx.lineTo(x1,L);ctx.stroke();
  if(tipOn){ctx.save();ctx.globalAlpha*=cx;ctx.strokeStyle=C.o;ctx.shadowColor=C.o;ctx.beginPath();ctx.moveTo(x0,-L);ctx.lineTo(x0+(x1-x0)*0.36,-L+2*L*0.36);ctx.stroke();ctx.restore();}}
 ctx.shadowBlur=0;ctx.fillStyle=WH;ctx.beginPath();ctx.arc(0,0,8,0,7);ctx.fill();ctx.restore();}
// single chromatid rod, tip on outer end when tip true
function rod(i,x,y,dir,a,tip,L2){const C=CH[i],L=L2||C.L;ctx.save();ctx.translate(x,y);ctx.globalAlpha*=a;ctx.lineWidth=13;ctx.lineCap='round';ctx.shadowColor=C.c;ctx.shadowBlur=8;ctx.strokeStyle=C.c;const ld=14;
 ctx.beginPath();ctx.moveTo(0,-L);ctx.quadraticCurveTo(ld,0,0,L);ctx.stroke();
 if(tip){ctx.strokeStyle=C.o;ctx.shadowColor=C.o;ctx.beginPath();const e=dir<0?-L:L;ctx.moveTo(0,e);ctx.lineTo(ld*0.36*0.9,e-dir*L*0.72);ctx.stroke();}
 ctx.shadowBlur=0;ctx.fillStyle=WH;ctx.beginPath();ctx.arc(ld*0.55,0,6,0,7);ctx.fill();ctx.restore();}
function cpos(i,tv){ // chromosome centre + angle before round 2 split
 const H=HOME[i];let x,y,ang=0;
 if(tv<47.1){x=H[0];y=H[1];ang=H[2];}
 else if(tv<53.5){const k=ph(tv,47.1,48.6);x=lerp(H[0],TET[i][0],k);y=lerp(H[1],TET[i][1],k);ang=lerp(H[2],0,k);}
 else if(tv<56.9){const k=ph(tv,53.5,54.8);x=lerp(TET[i][0],PLT[i][0],k);y=lerp(TET[i][1],PLT[i][1],k);}
 else if(tv<61.7){const k=ph(tv,56.9,58.9);const gx=0.5*aR1(tv);x=lerp(PLT[i][0],SIDE[i]*gx,k);y=lerp(PLT[i][1],YP1[i],k);}
 else{x=SIDE[i]*CXR;y=YP1[i];
  // round 2: line up along the cell equator
  const k=ph(tv,66.6,67.9);const slot=(i===0||i===1)?-42:42;x=lerp(x,SIDE[i]*CXR+slot,k);y=lerp(y,0,k);}
 return[x,y,ang];}
function drawChroms(tv){
 const d=ph(tv,13.4,15.4),cond=ph(tv,41.2,43.8),cx=ph(tv,50.6,51.8);
 for(let i=0;i<4;i++){const C=CH[i];const[x,y,ang]=cpos(i,tv);
  if(tv<69.05){
   const th=1-cond;if(th>0.02){thread(x,y,ang,C.L,C.c,i*3.1,th,5,-4*d);if(d>0.02)thread(x,y,ang,C.L,C.c,i*3.1+0.7,th*d,5,5);}
   if(cond>0.02)xchrom(i,x,y,ang,cond,cx);
  } else {
   const mv=ph(tv,69.1,70.8);const xa=1-lin(tv,69.05,69.2);const yy=lerp(0,120,mv);
   if(xa>0.02)xchrom(i,x,y,0,xa,1);
   const ra=1-xa;if(ra>0.02){rod(i,x,-yy,-1,ra,C.tk===0,C.L*0.85);rod(i,x,yy,1,ra,C.tk===1,C.L*0.85);}
  }}}
function centro(tv){ // gold centrosomes
 const out=[];
 if(tv>=41.3&&tv<60.6){const e=ph(tv,42.0,44.3),s=ph(tv,41.3,41.8)*14;const pole=270+90*lin(tv,56.9,59.4);const fa=1-lin(tv,59.6,60.6);
  out.push([lerp(-s,-pole,e),lerp(-165,0,e),fa],[lerp(s,pole,e),lerp(-165,0,e),fa]);}
 if(tv>=65.2&&tv<72.4){const e=ph(tv,65.2,66.0);const fa=1-lin(tv,71.6,72.4);for(const s of[-1,1]){out.push([s*CXR,lerp(0,-205,e),fa],[s*CXR,lerp(0,205,e),fa]);}}
 return out;}
function drawSpindle(tv){
 ctx.save();ctx.strokeStyle=WH;ctx.lineWidth=2.5;
 // round 1
 if(tv>=44.3&&tv<60.6){const a=ph(tv,44.3,45.3)*(1-lin(tv,59.6,60.6))*0.5;const pole=270+90*lin(tv,56.9,59.4);ctx.globalAlpha=a;ctx.beginPath();
  for(let i=0;i<4;i++){const[x,y]=cpos(i,tv);const after=tv>=56.9;
   if(!after||SIDE[i]<0)ctx.moveTo(-pole,0),ctx.lineTo(after?x-12:x-11,y);
   if(!after||SIDE[i]>0)ctx.moveTo(pole,0),ctx.lineTo(after?x+12:x+11,y);}
  ctx.stroke();}
 // round 2
 if(tv>=65.6&&tv<72.0){const a=ph(tv,65.6,66.4)*(1-lin(tv,71.2,72.0))*0.5;ctx.globalAlpha=a;ctx.beginPath();
  for(let i=0;i<4;i++){const[x,y]=cpos(i,tv);const pc=SIDE[i]*CXR;
   if(tv<69.05){ctx.moveTo(pc,-205);ctx.lineTo(x,y-11);ctx.moveTo(pc,205);ctx.lineTo(x,y+11);}
   else{const yy=lerp(0,120,ph(tv,69.1,70.8));ctx.moveTo(pc,-205);ctx.lineTo(x,-yy-10);ctx.moveTo(pc,205);ctx.lineTo(x,yy+10);}}
  ctx.stroke();}
 ctx.restore();
 for(const[x,y,fa]of centro(tv)){ctx.save();ctx.globalAlpha=fa;ctx.fillStyle=GD;ctx.shadowColor=GD;ctx.shadowBlur=14;ctx.beginPath();ctx.arc(x,y,12,0,7);ctx.fill();ctx.restore();}}
