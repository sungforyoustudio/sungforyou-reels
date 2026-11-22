// ===== ETC diagram engine: pure function of time t. Canvas 1020x640 panel; world units: membrane at y=0, IMS up (y<0), matrix down (y>0) =====
const PW=1020,PH=640,SCX=510,SCY=300;
const $=id=>document.getElementById(id),clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),lerp=(a,b,k)=>a+(b-a)*k;
const ease=p=>{p=clamp(p);return p*p*(3-2*p)};
const hash=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const cv=$('dg'),g=cv.getContext('2d');
const CUE=Object.assign({},CFG.cues); if(CUE.L26===undefined)CUE.L26=CUE.L27;
const cu=id=>CUE[id];
const COL={I:'#4DA8FF',II:'#FFB347',III:'#A66BFF',IV:'#34D6A5',V:'#FF6FB1',Q:'#E6F06B',c:'#FF8F5A',e:'#FFE14D',H:'#FF3D6E',NADH:'#5EE6FF',FADH:'#FFC15E',O:'#FF4B4B'};
const X={I:260,II:560,III:860,IV:1150,V:1500};   // complex centres (world x)
const QX0=432,QX1=770,CY_=-100;                // Q pool range, cyt c lane y
// ---------- timeline derived from cues ----------
const P=5.0, tA=cu('L03')+0.3, tB=cu('L05')+0.3, tEndB=cu('L10');
const tPumpI=cu('L04')-0.2, tPumpOut=cu('L12')-0.3, tChorus=cu('L10'), tV0=cu('L16'), tVflow=cu('L25')-0.5, tATP=cu('L29')-0.5;
// O2 cycle origin: first even pair arrival after chorus start
let nO=Math.max(0,Math.ceil((tChorus-(tA+5.0-1.4))/P)); if(nO%2)nO++; const tO=tA+5.0+nO*P-1.4;
// ---------- camera ----------
const CAMK=[[ 'L02',930,35,0.52],['L03',250,70,0.98],['L05',560,70,1.12],['L07',640,-5,0.92],['L09',860,-10,0.92],['L10',870,45,0.64],['L17',860,-15,1.05],['L19',1000,-40,0.92],['L21',1150,25,1.06],['L24',1150,60,0.92],['L25',1320,20,0.7],['L27',1500,55,0.98],['L31',870,45,0.64],['L33',870,45,0.64],['L40',870,45,0.64]].filter(k=>cu(k[0])!==undefined).map(k=>({t:cu(k[0]),x:k[1],y:k[2],z:k[3]})).sort((a,b)=>a.t-b.t);
function cam(t){let i=-1;for(let k=0;k<CAMK.length;k++)if(CAMK[k].t<=t)i=k;
 if(i<0)return CAMK[0];const c=CAMK[i],p=i>0?CAMK[i-1]:c,k=ease((t-c.t)/1.1);
 return {x:lerp(p.x,c.x,k),y:lerp(p.y,c.y,k),z:Math.exp(lerp(Math.log(p.z),Math.log(c.z),k))}}
let CAM={x:870,y:45,z:.64};
const sx=wx=>(wx-CAM.x)*CAM.z+SCX, sy=wy=>(wy-CAM.y)*CAM.z+SCY;
// ---------- text helpers (supports ^{..} superscript, _{..} subscript) ----------
function rich(s,x,y,size,color,align,weight){weight=weight||800;g.font=weight+' '+size+'px M';g.fillStyle=color;g.textBaseline='middle';
 const parts=[];let re=/(\^\{[^}]*\}|_\{[^}]*\})/g,last=0,m;while(m=re.exec(s)){if(m.index>last)parts.push([s.slice(last,m.index),0]);parts.push([m[0].slice(2,-1),m[0][0]=='^'?1:2]);last=re.lastIndex}if(last<s.length)parts.push([s.slice(last),0]);
 let w=0;const ws=parts.map(p=>{g.font=weight+' '+(p[1]?size*.65:size)+'px M';const v=g.measureText(p[0]).width;w+=v;return v});
 let cx=align=='center'?x-w/2:align=='right'?x-w:x;
 parts.forEach((p,i)=>{g.font=weight+' '+(p[1]?size*.65:size)+'px M';g.textAlign='left';g.fillStyle=color;g.fillText(p[0],cx,y+(p[1]==1?-size*.32:p[1]==2?size*.28:0));cx+=ws[i]})
 return w}
function rr(x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function chip(text,x,y,size,bg,fg,alpha){const w=rich(text,-9999,-9999,size,fg,'left')+size*1.1;g.save();g.globalAlpha=alpha===undefined?1:alpha;g.fillStyle=bg;rr(x-w/2,y-size*.85,w,size*1.7,size*.85);g.fill();rich(text,x,y+1,size,fg,'center');g.restore()}
// ---------- world drawing primitives (positions in world units, drawn through camera) ----------
function ball(wx,wy,r,fill,label,lsz,alpha,glow){const x=sx(wx),y=sy(wy),R=r*CAM.z;g.save();g.globalAlpha=alpha===undefined?1:alpha;
 if(glow){g.shadowColor=fill;g.shadowBlur=glow}
 const gr=g.createRadialGradient(x-R*.3,y-R*.35,R*.1,x,y,R);gr.addColorStop(0,'#fff');gr.addColorStop(.25,fill);gr.addColorStop(1,fill);
 g.fillStyle=fill;g.beginPath();g.arc(x,y,R,0,7);g.fill();g.shadowBlur=0;g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.arc(x-R*.3,y-R*.35,R*.35,0,7);g.fill();
 g.lineWidth=Math.max(1,1.2*CAM.z);g.strokeStyle='rgba(0,0,0,.45)';g.beginPath();g.arc(x,y,R,0,7);g.stroke();
 if(label)rich(label,x,y+1,Math.max(9,(lsz||14)*CAM.z),'#1a1030','center');g.restore()}
const eBall=(wx,wy,a,glow)=>ball(wx,wy,11,COL.e,'e^{-}',15,a,glow===undefined?14:glow);
const hBall=(wx,wy,a)=>ball(wx,wy,9.5,COL.H,'H^{+}',13,a,0);
function path(pts,k){ // pts [[x,y],...] -> point at fraction k (piecewise linear)
 const L=[];let tot=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(d);tot+=d}
 let d=clamp(k)*tot;for(let i=0;i<L.length;i++){if(d<=L[i]||i==L.length-1){const f=L[i]?d/L[i]:0;return [lerp(pts[i][0],pts[i+1][0],f),lerp(pts[i][1],pts[i+1][1],f)]}d-=L[i]}}
function eyes(wx,wy,lx,ly,t,sc){sc=sc||1;const bl=(Math.sin(t*1.7+wx)>0.985)?0.15:1;
 for(const dx of [-17,17]){const x=sx(wx+dx*sc),y=sy(wy),R=11*sc*CAM.z;g.fillStyle='#fff';g.beginPath();g.ellipse(x,y,R,R*bl,0,0,7);g.fill();
  g.fillStyle='#1a1030';g.beginPath();g.ellipse(x+lx*R*.35,y+ly*R*.35,R*.5,R*.5*bl,0,0,7);g.fill()}
 // smile
 g.strokeStyle='rgba(26,16,48,.8)';g.lineWidth=3*CAM.z*sc;g.lineCap='round';g.beginPath();g.arc(sx(wx),sy(wy+8*sc),11*sc*CAM.z,0.2,Math.PI-0.2);g.stroke()}
function body(parts,col,glowA,t){ // parts: [[x,y,w,h,r],...] world rects (rounded); draws union with gradient
 g.save();if(glowA>0){g.shadowColor=col;g.shadowBlur=34*glowA}
 for(const p of parts){const x=sx(p[0]),y=sy(p[1]),w=p[2]*CAM.z,h=p[3]*CAM.z,r=p[4]*CAM.z;const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,col);gr.addColorStop(1,shade(col,-.28));
  rr(x,y,w,h,r);g.fillStyle=gr;g.fill()}
 g.shadowBlur=0;for(const p of parts){rr(sx(p[0]),sy(p[1]),p[2]*CAM.z,p[3]*CAM.z,p[4]*CAM.z);g.lineWidth=3.2*CAM.z;g.strokeStyle='rgba(15,8,40,.55)';g.stroke()}
 // re-fill union interior to hide inner outlines
 for(const p of parts){const x=sx(p[0])+2,y=sy(p[1])+2,w=p[2]*CAM.z-4,h=p[3]*CAM.z-4,r=Math.max(2,p[4]*CAM.z-2);const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,col);gr.addColorStop(1,shade(col,-.28));rr(x,y,w,h,r);g.fillStyle=gr;g.fill()}
 g.restore()}
function shade(hex,k){const n=parseInt(hex.slice(1),16);let r=n>>16,gg=(n>>8)&255,b=n&255;const f=v=>Math.round(clamp(k<0?v*(1+k):v+(255-v)*k,0,255));return `rgb(${f(r)},${f(gg)},${f(b)})`}
function label(text,wx,wy,size,alpha,col){const x=sx(wx),y=sy(wy);chip(text,x,y,size,'rgba(10,6,34,.72)',col||'#fff',alpha)}
// ---------- phase helpers ----------
const lane=(t0,t)=>{const u=t-t0;return u<0?null:{n:Math.floor(u/P),p:u%P}};
function pulses(t0,off,count,gap,t,tmin){const out=[];if(t<t0)return out;const n=Math.floor((t-t0)/P);
 for(let k=Math.max(0,n-9);k<=n;k++)for(let j=0;j<count;j++){const te=t0+k*P+off+j*gap;if(te>=tmin&&te<=t)out.push([k*10+j,te])}return out}
// ---------- the membrane ----------
function drawZones(t){
 const top=sy(-30),bot=sy(30);
 let gr=g.createLinearGradient(0,0,0,top);gr.addColorStop(0,'#46206b');gr.addColorStop(1,'#35185a');g.fillStyle=gr;g.fillRect(0,0,PW,top);
 gr=g.createLinearGradient(0,bot,0,PH);gr.addColorStop(0,'#103a5e');gr.addColorStop(1,'#0a2744');g.fillStyle=gr;g.fillRect(0,bot,PW,PH-bot);
 g.fillStyle='#2b1a4e';g.fillRect(0,top,PW,bot-top)}
function drawLipids(t){const step=15,x0=Math.floor((CAM.x-SCX/CAM.z)/step)*step-step,x1=CAM.x+SCX/CAM.z+step;
 g.lineWidth=Math.max(1.2,1.8*CAM.z);g.strokeStyle='rgba(205,150,70,.85)';g.fillStyle='#F6C177';
 for(let x=x0;x<=x1;x+=step){const wob=Math.sin(t*1.3+x*.2)*1.2;
  for(const s of [-1,1]){const hy=s*27+wob,ty=s*3;const xs=sx(x),ys=sy(hy);
   for(const dx of [-3.2,3.2]){g.beginPath();g.moveTo(sx(x+dx),sy(s*21+wob));g.lineTo(sx(x+dx+(dx>0?1.2:-1.2)),sy((s*21+ty)/2+wob));g.lineTo(sx(x+dx),sy(ty));g.stroke()}
   g.beginPath();g.arc(xs,ys,6.5*CAM.z,0,7);g.fill()}}}
// ---------- complexes ----------
let glowA={I:0,II:0,III:0,IV:0,V:0};
function look(wx,t){return [Math.cos(t*.8+wx)*.7,Math.sin(t*.6+wx)*.5+.2]}
function drawI(t){const x=X.I;body([[x-130,-62,260,124,44],[x-130,40,100,150,38]],COL.I,glowA.I,t);eyes(x+20,-14,...look(x,t),t);
 rich('I',sx(x+20),sy(32),Math.max(22,34*CAM.z),'rgba(255,255,255,.92)','center',900)}
function drawII(t){const x=X.II;body([[x-55,-55,110,110,34],[x-80,40,160,100,36]],COL.II,glowA.II,t);eyes(x,-10,...look(x,t),t);rich('II',sx(x),sy(88),Math.max(22,32*CAM.z),'rgba(255,255,255,.92)','center',900)}
function drawIII(t){const x=X.III;body([[x-120,-80,240,160,46],[x+20,-112,70,50,24]],COL.III,glowA.III,t);
 g.strokeStyle='rgba(20,8,50,.45)';g.lineWidth=3*CAM.z;g.beginPath();g.moveTo(sx(x),sy(-70));g.lineTo(sx(x),sy(70));g.stroke();
 eyes(x-55,-14,...look(x,t),t,.9);rich('III',sx(x+55),sy(36),Math.max(22,32*CAM.z),'rgba(255,255,255,.92)','center',900)}
function drawIV(t){const x=X.IV;body([[x-70,-85,140,170,44]],COL.IV,glowA.IV,t);eyes(x,-24,...look(x,t),t);rich('IV',sx(x),sy(40),Math.max(22,32*CAM.z),'rgba(255,255,255,.92)','center',900)}
// ATP synthase
function Rot(t){let r=0;const w1=1.6,w2=7;if(t>tV0)r+=w1*(Math.min(t,tVflow)-tV0);if(t>tVflow)r+=(w2)*(t-tVflow);return r}
function drawV(t){const x=X.V,R=Rot(t),act=t>tVflow?1:0;
 // stator arm (b2) and a-subunit
 body([[x+44,-62,64,124,26]],'#c95a94',glowA.V*.6,t);                      // a subunit with proton half-channels
 g.strokeStyle='#e58cbc';g.lineWidth=10*CAM.z;g.lineCap='round';g.beginPath();g.moveTo(sx(x+60),sy(40));g.lineTo(sx(x+78),sy(95));g.lineTo(sx(x+74),sy(150));g.stroke(); // b2 stator
 // c-ring rotor
 body([[x-46,-34,92,68,24]],COL.V,glowA.V,t);
 g.save();rr(sx(x-46),sy(-34),92*CAM.z,68*CAM.z,24*CAM.z);g.clip();g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=4*CAM.z;
 for(let i=-2;i<8;i++){const px=x-46+((i*17+R*22)%136+136)%136-20;g.beginPath();g.moveTo(sx(px),sy(-34));g.lineTo(sx(px),sy(34));g.stroke()}g.restore();
 // central stalk (gamma) rotating: twisted stripes
 g.save();g.lineCap='butt';const sx0=sx(x),sw=22*CAM.z;g.fillStyle='#ffd1e8';g.fillRect(sx0-sw/2,sy(30),sw,60*CAM.z);
 g.strokeStyle='#d24d91';g.lineWidth=4*CAM.z;for(let i=0;i<6;i++){const yy=30+i*11,ph=Math.sin(R+i*.9)*sw*.45;g.beginPath();g.moveTo(sx0-sw/2,sy(yy));g.lineTo(sx0+ph,sy(yy+6));g.lineTo(sx0+sw/2,sy(yy));g.stroke()}g.restore();
 // F1 head: 3 alpha/beta pairs
 const hx=x,hy=135,hr=82;body([[hx-hr,hy-62,hr*2,150,60]],'#6fb2ff',glowA.V*.5,t);
 const sites=[0,1,2];for(const s of sites){const ang=R+s*2.094,xo=Math.cos(ang)*46,act_=.5+.5*Math.sin(ang);const px=hx+xo,py=hy+8+Math.sin(ang)*6;
  g.save();g.fillStyle=s==0?'#ff9ccb':s==1?'#ffd36b':'#8be0ff';g.globalAlpha=.55+.4*act_;g.beginPath();g.ellipse(sx(px),sy(py),26*CAM.z,44*CAM.z,0,0,7);g.fill();g.restore()}
 rich('F_{1}',sx(hx),sy(hy+80),Math.max(16,22*CAM.z),'#08133a','center',900);rich('F_{0}',sx(x),sy(0),Math.max(16,22*CAM.z),'#4a0b2b','center',900)}
// ---------- carriers ----------
function drawQ(wx,loaded,wy){const y=wy===undefined?-2:wy;g.save();const x=sx(wx),yy=sy(y);
 // isoprenoid tail
 g.strokeStyle='#c7d24a';g.lineWidth=4*CAM.z;g.lineCap='round';g.beginPath();g.moveTo(x-18*CAM.z,yy);for(let i=1;i<=6;i++)g.lineTo(x-(18+i*9)*CAM.z,yy+(i%2?-7:7)*CAM.z);g.stroke();
 g.shadowColor=COL.Q;g.shadowBlur=loaded?18:0;g.fillStyle=COL.Q;g.beginPath();g.ellipse(x,yy,26*CAM.z,19*CAM.z,0,0,7);g.fill();g.shadowBlur=0;g.lineWidth=2.5*CAM.z;g.strokeStyle='rgba(20,10,40,.55)';g.stroke();
 rich(loaded?'QH_{2}':'Q',x,yy+1,Math.max(11,(loaded?15:20)*CAM.z),'#2a2200','center',900);g.restore();
 if(loaded){eBall(wx-14,y-26,1,10);eBall(wx+14,y-26,1,10)}}
function drawCyt(wx,loaded){const x=sx(wx),y=sy(CY_);g.save();g.shadowColor=COL.c;g.shadowBlur=loaded?18:0;g.fillStyle=COL.c;g.beginPath();g.arc(x,y,21*CAM.z,0,7);g.fill();g.shadowBlur=0;g.lineWidth=2.5*CAM.z;g.strokeStyle='rgba(60,15,0,.6)';g.stroke();
 rich('c',x,y+1,Math.max(14,24*CAM.z),'#3b0f00','center',900);g.restore();if(loaded)eBall(wx,CY_-30,1,10)}
function card(text,wx,wy,col,a){const w=96,h=34;g.save();g.globalAlpha=a===undefined?1:a;const x=sx(wx-w/2),y=sy(wy-h/2);rr(x,y,w*CAM.z,h*CAM.z,16*CAM.z);g.fillStyle=col;g.fill();g.lineWidth=2.5*CAM.z;g.strokeStyle='rgba(10,8,40,.6)';g.stroke();rich(text,sx(wx),sy(wy)+1,Math.max(12,19*CAM.z),'#07122b','center',900);g.restore()}
// ---------- particles / lanes ----------
function protonRest(k,cx,spread,t){return [cx+(hash(k)*2-1)*spread+Math.sin(t*.7+k)*7,-(78+hash(k+7)*150)+Math.cos(t*.9+k*1.3)*6]}
function drawPumps(t){
 const defs=[['I',X.I+30,150,4,1.0,tPumpI],['III',X.III,170,4,3.7,tPumpOut],['IV',X.IV,110,1,0.0,tPumpOut]];
 for(const [nm,cx,spread,cnt,off,tmin] of defs){
  const t0=nm=='IV'?tA+5.0:tA;const gap=nm=='IV'?0.4:0.16;
  const pl=pulses(t0,off,nm=='IV'?2:cnt,gap,t,tmin);
  for(const [id,te] of pl){const k=id+(nm=='I'?0:nm=='III'?5000:9000),age=t-te,xo=(hash(k+3)*2-1)*40;
   const rest=protonRest(k,cx,spread,t);
   if(age<0.9){const e=ease(age/0.9);const sxw=cx+xo*(1-e)+(rest[0]-cx-xo)*e*.5;hBall(lerp(cx+xo,rest[0],e),lerp(nm=='I'?80:60,rest[1],e),1)}
   else hBall(rest[0],rest[1],1)}
  // "+n H+" popup
  if(pl.length){const [id,te]=pl[pl.length-1],age=t-te;const nShown=nm=='IV'?2:cnt;if(age<1.6&&nm!='IV'||nm=='IV'&&age<1.6)chipPop(nm,cx,age,nShown)}
 }}
function chipPop(nm,cx,age,n){const base=nm=='I'?-150:nm=='III'?-170:-170;if(CAM.z<.7)return;const a=clamp(age/0.2)*clamp((1.6-age)/0.4);label('+'+n+' H^{+}',cx,base-age*14,Math.max(20,24*CAM.z),a,'#ffd7e3')}
function qA(t){const u=((t-tA)%P+P)%P;let qx,loaded;
 if(u<1.8){qx=QX0;loaded=false}else if(u<2.0){qx=QX0;loaded=true}else if(u<3.4){qx=lerp(QX0,QX1,ease((u-2.0)/1.4));loaded=true}
 else if(u<3.6){qx=QX1;loaded=false}else{qx=lerp(QX1,QX0,ease((u-3.6)/1.4));loaded=false}return [qx,loaded]}
function qB(t){const u=(t-tB)%P;let qx,ld;if(u<1.8){qx=X.II+120;ld=false}else if(u<2.0){qx=X.II+120;ld=true}else if(u<3.4){qx=lerp(X.II+120,QX1,ease((u-2)/1.4));ld=true}else if(u<3.6){qx=QX1;ld=false}else{qx=lerp(QX1,X.II+120,ease((u-3.6)/1.4));ld=false}return [qx,ld]}
function drawQs(t){ if(t>=tB&&t<=tEndB+1.4){g.save();g.globalAlpha=1-clamp((t-tEndB)/1.2);const [x,l]=qB(t);drawQ(x,l,18);g.restore()}
 if(t>=tA&&t>=cu('L03')){const [x,l]=qA(t);drawQ(x,l)}}
function drawLaneA(t){const L=lane(tA,t);if(!L)return;const n=L.n,p=L.p;
 // iterate over recent periods so overlapping tails show
 for(let k=Math.max(0,n-1);k<=n;k++){const u=t-(tA+k*P);if(u<0)continue;
  // NADH card
  if(u<2.0){const dock=[X.I-112,205],from=[X.I-210,300];let pp=ease(u/0.5),nad=u<0.8;
   const pos=u<0.8?[lerp(from[0],dock[0],pp),lerp(from[1],dock[1],pp)]:[lerp(dock[0],dock[0]-70,ease((u-0.8)/1.0)),lerp(dock[1],dock[1]+110,ease((u-0.8)/1.0))];
   card(nad?'NADH':'NAD^{+}',pos[0],pos[1],nad?COL.NADH:'#9fb6c9',u>1.5?clamp((2-u)/.5):1)}
  // e- pair inside I
  if(u>=0.8&&u<1.8){const q=(u-0.8)/1.0,P1=[[X.I-110,185],[X.I-96,110],[X.I-30,42],[X.I+50,10],[X.I+125,0]];const a=path(P1,ease(q)),b=path(P1,ease(clamp(q-0.1)));eBall(a[0],a[1],1);eBall(b[0],b[1],1)}
  // Q carries pair I -> III (waits at I site until picks up)
  }
 const u=((t-tA)%P+P)%P;
 // e- pair inside III
 if(u>=3.6&&u<4.3){const q=(u-3.6)/0.7,P3=[[X.III-70,0],[X.III-10,-10],[X.III+40,-70],[X.III+60,-100]];const a=path(P3,ease(q)),b=path(P3,ease(clamp(q-0.15)));eBall(a[0],a[1],1);eBall(b[0],b[1],1)}
 // cyt c trips: two shuttles
 for(const [off] of [[4.2],[4.65]]){const uc=((t-tA-off)%P+P)%P; if(t-tA-off<0)continue;
  let cx,ld=false;const dockA=X.III+62,dockB=X.IV-55;
  if(uc<0.1){cx=dockA;ld=true}else if(uc<0.9){cx=lerp(dockA,dockB,ease((uc-0.1)/0.8));ld=true}else if(uc<1.0){cx=dockB;ld=false}else{cx=lerp(dockB,dockA,ease(clamp((uc-1.0)/1.0)));ld=false}
  drawCyt(cx,ld);
  if(uc>=0.9&&uc<1.3){const q=(uc-0.9)/0.4,pp=path([[X.IV-55,-100],[X.IV-20,-60],[X.IV+10,10],[X.IV+30,60]],ease(q));eBall(pp[0],pp[1],1-clamp((q-.8)/.2))}}
}
function drawLaneB(t){if(t<tB||t>tEndB+1.4)return;const al=1-clamp((t-tEndB)/1.2);g.save();g.globalAlpha=al;
 const u=(t-tB)%P;
 // FADH2 card
 if(u<2.0){const dock=[X.II-48,190],from=[X.II-150,290];const fad=u<0.8,pp=ease(u/0.5);const pos=fad?[lerp(from[0],dock[0],pp),lerp(from[1],dock[1],pp)]:[lerp(dock[0],dock[0]-60,ease((u-.8)/1)),lerp(dock[1],dock[1]+100,ease((u-.8)/1))];
  card(fad?'FADH_{2}':'FAD',pos[0],pos[1],fad?COL.FADH:'#cfc29a',u>1.5?clamp((2-u)/.5):1)}
 if(u>=0.8&&u<1.8){const q=(u-.8)/1,PP=[[X.II-48,175],[X.II-20,100],[X.II+40,30],[X.II+110,2]];const a=path(PP,ease(q)),b=path(PP,ease(clamp(q-.1)));eBall(a[0],a[1],1);eBall(b[0],b[1],1)}
 g.restore()}
// ---------- oxygen at complex IV ----------
function drawO2(t){if(t<tO)return;const u=(t-tO)%(2*P);const x0=X.IV+10,y0=118;
 const arr=ease(u/1.2);const px=lerp(x0+170,x0,arr),py=lerp(y0+150,y0,arr);
 const nE=(u>=1.4?1:0)+(u>=1.8?1:0)+(u>=6.4?1:0)+(u>=6.8?1:0);
 if(u<7.6){ // O2 molecule (two O atoms, double bond) docked at IV
  const split=u>7.0;const sep=split?lerp(15,42,ease((u-7.0)/.5)):15;
  g.save();if(u<7.0){g.strokeStyle='#ffd0d0';g.lineWidth=5*CAM.z;for(const o of [-3,3]){g.beginPath();g.moveTo(sx(px-sep),sy(py+o));g.lineTo(sx(px+sep),sy(py+o));g.stroke()}}g.restore();
  ball(px-sep,py,15,COL.O,'O',14,1,10);ball(px+sep,py,15,COL.O,'O',14,1,10);
  if(u>1.0&&u<7.0)label('O_{2}',px,py+44,Math.max(20,24*CAM.z),1,'#ffd0d0');
  // electrons arriving counter
  if(u<7.0&&u>1.4)label(nE+'/4 e^{-}',px+105,py-4,Math.max(18,22*CAM.z),1,'#fff1a8');
  // 4 protons from matrix flying in at 5.8..6.6
  if(u>5.8&&u<7.0)for(let j=0;j<4;j++){const e=ease((u-5.8-j*.12)/.7);hBall(lerp(px-90+j*40,px+(j-1.5)*12,e),lerp(py+120,py+22,e),clamp(1-(e>.9?(e-.9)*10:0)))}
  if(split){const e=ease((u-7.2)/.4);for(const s of [-1,1])water(px+s*lerp(42,70,e),py+lerp(0,0,e),s);}
 }
 // released waters drift away
 if(u>=7.6||u<1.0){const v=u>=7.6?u-7.6:u+2*P-7.6;if(v<2.6){for(const s of [-1,1]){const e=ease(v/2.6);const wx=x0+s*70+s*e*60,wy=y0+e*150;water(wx,wy,s,1-clamp((v-1.6)/1.0))}}}
}
function water(wx,wy,s,a){const R=15,rH=10,ang=52.25*Math.PI/180;g.save();g.globalAlpha=a===undefined?1:a;
 const ox=sx(wx),oy=sy(wy);g.strokeStyle='#fff';g.lineWidth=4*CAM.z;for(const d of [-1,1]){g.beginPath();g.moveTo(ox,oy);g.lineTo(ox+Math.sin(ang)*d*30*CAM.z,oy+Math.cos(ang)*30*CAM.z);g.stroke()}
 g.restore();ball(wx,wy,R,COL.O,'O',13,a===undefined?1:a,0);for(const d of [-1,1])ball(wx+Math.sin(ang)*d*30,wy+Math.cos(ang)*30,rH,'#ffffff','H',11,a===undefined?1:a,0)}
// ---------- ATP synthase action ----------
function drawVflow(t){if(t<tVflow)return;const x=X.V;
 // protons falling through the a-subunit channel (right of c-ring) into matrix
 for(let k=0;k<14;k++){const per=1.5,te=tVflow+k*0.37;const uu=(t-te);if(uu<0)continue;const ph=(uu%per)/per;const kk=Math.floor(uu/per)*14+k;
  const sxw=x+78+(hash(kk)*2-1)*20;const path_=[[sxw-10,-160],[x+64,-62],[x+22,-4],[x+10,34],[x-30,110]];const pt=path(path_,ph);
  hBall(pt[0],pt[1],ph>.85?clamp((1-ph)/.15):1)}
 // ADP + Pi in, ATP out
 if(t>=tATP){const u=(t-tATP)%1.5,n=Math.floor((t-tATP)/1.5);const hx=x,hy=150;
  if(u<0.7){const e=ease(u/0.7);card('ADP',lerp(hx-220,hx-70,e),lerp(hy+110,hy+60,e),'#7fd4ff',1);card('P_{i}',lerp(hx-250,hx-100,e),lerp(hy+165,hy+100,e),'#ffe08a',1)}
  else if(u<0.9){const f=1-(u-.7)/.2;ball(hx,hy,60*(1.1-f*.1),'#ffffff','',10,f*.6,30)}
  if(u>=0.8){const e=ease((u-0.8)/0.7);card('ATP',lerp(hx+40,hx+190,e),lerp(hy+60,hy+175,e),'#9dff9a',1-clamp((e-.85)/.15))}}
}
// ---------- labels ----------
function drawLabels(t){const z=CAM.z;const small=z<.8,sz=small?21:25,a=1;
 const named=(id,nm,sub,wx,wy)=>{const x=sx(wx);if(x<20||x>PW-20)return;if(sy(wy)<78)return;if(CAM.z>.85&&Math.abs(x-SCX)>300)return;chip(nm,x,sy(wy),sz,'rgba(10,6,34,.75)','#fff',1);if(sub&&!small)rich(sub,x,sy(wy)+sz*1.45,sz*.7,'#e6dcff','center',700)};
 named('I','Complex I','NADH dehydrogenase',X.I+10,-155);
 named('II','Complex II','succinate dehydrogenase',X.II,-125);
 named('III','Complex III','cytochrome bc_{1}',X.III,-150);
 named('IV','Complex IV','cytochrome c oxidase',X.IV,-150);
 named('V','ATP synthase','Complex V',X.V,-175);
 if(t>cu('L07')-.5){const x=sx(480);chip('Coenzyme Q (ubiquinone)',x,sy(-215),small?18:22,'rgba(70,70,10,.9)','#f4ff9b',small?.0:clamp((t-cu('L07')+.5)/.5)*(t<cu('L10')?1:.0))}
 // zone labels (screen space)
 g.save();rich('INTERMEMBRANE SPACE',22,26,21,'rgba(255,225,245,.85)','left',800);rich('MATRIX',22,500,21,'rgba(190,230,255,.85)','left',800);
 if(t>cu('L13')){const k=clamp((t-cu('L13'))/1.0);g.globalAlpha=k;rich('lots of H^{+}  (acidic, positive)',22,52,18,'#ffb3c9','left',700);rich('few H^{+}',22,526,18,'#9fd0ff','left',700)}g.restore()}
// ---------- mitochondrion intro ----------
function mitoPath(inner,tt){const cx=SCX,cy=SCY+95,rx=inner?335:372,ry=inner?150:182;g.beginPath();
 const N=480;for(let i=0;i<=N;i++){const a=i/N*Math.PI*2;let r=1;
  if(inner){const centers=[-2.5,-1.95,-1.3,-0.7,2.55,2.0,1.3,0.7];for(let j=0;j<centers.length;j++){const d=Math.atan2(Math.sin(a-centers[j]),Math.cos(a-centers[j]));r-=0.48*Math.exp(-Math.pow(d/0.05,2))}}
  const x=cx+Math.cos(a)*rx*r,y=cy+Math.sin(a)*ry*r;if(i==0)g.moveTo(x,y);else g.lineTo(x,y)}g.closePath()}
function drawMito(t,alpha,zk){g.save();g.globalAlpha=alpha;const s=1+zk*5.5,px=SCX+130,py=SCY-40;g.translate(px,py);g.scale(s,s);g.translate(-px,-py);
 g.fillStyle='#34165a';g.fillRect(-2000,-2000,5000,5000);
 mitoPath(false);g.fillStyle='#5b2f8f';g.fill();g.lineWidth=7;g.strokeStyle='#FFC773';g.stroke();
 mitoPath(true);g.fillStyle='#154a6b';g.fill();g.lineWidth=6;g.strokeStyle='#FF4FA3';g.shadowColor='#FF4FA3';g.shadowBlur=12+5*Math.sin(t*3);g.stroke();g.shadowBlur=0;g.restore();
 if(zk<0.25){g.save();g.globalAlpha=alpha*(1-zk*4);
  const ln=(x1,y1,x2,y2)=>{g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=2;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()};
  ln(126,330,160,372);chip('Outer membrane',112,306,20,'rgba(10,6,34,.85)','#FFC773',1);
  ln(900,330,862,372);chip('Intermembrane space',868,306,20,'rgba(10,6,34,.85)','#dcc8ff',1);
  ln(300,596,372,540);chip('Inner membrane (cristae)',300,610,20,'rgba(10,6,34,.85)','#FF8FC7',1);
  chip('Matrix',SCX,SCY+95,24,'rgba(10,6,34,.75)','#bfe6ff',1);
  g.restore()}}
// ---------- intro title card ----------
// ---------- fact chips (DOM) ----------
const FACTS=[['L01',''],['L02','Electrons pass down a chain of protein complexes in the <b>inner membrane</b>'],['L03','Complex I: NADH gives up its electrons<br>NADH → NAD<sup>+</sup> + 2 e<sup>−</sup>'],['L04','Complex I pumps <b>4 H<sup>+</sup></b> from the matrix to the intermembrane space'],['L05','Complex II (from the Krebs cycle): FADH<sub>2</sub> → FAD + 2 e<sup>−</sup>'],['L06','Complex II pumps <b>no</b> H<sup>+</sup>'],['L07','Coenzyme Q (ubiquinone) is a small mobile carrier inside the membrane'],['L08','Q takes 2 e<sup>−</sup> from Complex I or II'],['L09','…and delivers them to Complex III'],['L10','NADH → I → Q → III → c → IV → O<sub>2</sub>  (FADH<sub>2</sub> enters at II)'],['L12','Complexes I, III and IV pump H<sup>+</sup> out of the matrix'],['L13','An H<sup>+</sup> gradient builds across the inner membrane'],['L14','Oxygen is the final electron acceptor'],['L15','O<sub>2</sub> + e<sup>−</sup> + H<sup>+</sup> → H<sub>2</sub>O'],['L16','The gradient will power ATP synthase'],['L17','Complex III (cytochrome bc<sub>1</sub>) receives 2 e<sup>−</sup> from QH<sub>2</sub>'],['L18','Complex III pumps <b>4 H<sup>+</sup></b> per pair of electrons'],['L19','Cytochrome c carries just <b>one</b> electron at a time'],['L20','It shuttles them along the outer face of the membrane'],['L21','Complex IV: cytochrome c oxidase'],['L22','Complex IV pumps <b>2 H<sup>+</sup></b> per pair of electrons'],['L23','O<sub>2</sub> + 4 e<sup>−</sup> + 4 H<sup>+</sup> → 2 H<sub>2</sub>O'],['L24','This is why we breathe: O<sub>2</sub> accepts the electrons'],['L25','H<sup>+</sup> pile up in the intermembrane space'],['L26','The membrane blocks H<sup>+</sup>, except through ATP synthase'],['L27','H<sup>+</sup> flow back down their gradient through <b>ATP synthase</b>'],['L28','The flow spins the rotor like a turbine'],['L29','ADP + P<sub>i</sub> enter the F<sub>1</sub> head…'],['L30','…and leave as <b>ATP</b> (3 ATP per full turn)'],['L31','Chemiosmosis: a H<sup>+</sup> gradient drives ATP synthesis'],['L32','Proton gradient = stored energy'],['L33','Recap: electrons flow down the chain'],['L35','Complexes I, III, IV pump H<sup>+</sup>'],['L37','O<sub>2</sub> takes the last electrons → H<sub>2</sub>O'],['L39','ATP synthase makes the ATP'],['L40','Remember the order: 1 · 2 · Q · 3 · c · 4'],['L42','The electron transport chain']].filter(f=>cu(f[0])!==undefined).sort((a,b)=>cu(a[0])-cu(b[0]));
let lastFact=-2;
function factAt(t){let k=-1;for(let i=0;i<FACTS.length;i++)if(t>=cu(FACTS[i][0])-0.05)k=i;return k}
// ---------- tracker chips ----------
const TR=[['I','I',COL.I],['II','II',COL.II],['Q','Q',COL.Q],['III','III',COL.III],['c','c',COL.c],['IV','IV',COL.IV],['V','ATP synthase',COL.V]];
function trackerActive(t){ if(t<cu('L02'))return -1;
 if(t>=tVflow-0.5&&t<cu('L33')-0.2)return 6; if(t>=tChorus&&t<cu('L17'))return stageA(t);
 if(t>=cu('L40'))return -2; const u=t;
 if(t>=cu('L33'))return stageA(t);
 if(t>=cu('L17'))return stageA(t);
 if(t>=cu('L05')&&t<cu('L07'))return 1; if(t>=cu('L07')&&t<cu('L09'))return 2; if(t>=cu('L09')&&t<cu('L10'))return 3; return 0}
function stageA(t){const u=((t-tA)%P+P)%P;return u<1.8?0:u<3.4?2:u<4.3?3:u<5.0?4:5}
// ---------- mnemonic overlay (outro) ----------
function drawMnemonic(t){const a=cu('L40');if(t<a||t>cu('L42')-0.2)return;const k=clamp((t-a)/.4);const items=['1','2','Q','3','c','4'];const cols=[COL.I,COL.II,COL.Q,COL.III,COL.c,COL.IV];
 const dur=(CFG.lines.find(l=>l.k=='L40').words.slice(-1)[0][2]-a);g.save();g.globalAlpha=k;
 g.fillStyle='rgba(10,6,34,.96)';rr(60,150,900,330,34);g.fill();g.lineWidth=3;g.strokeStyle='rgba(255,79,163,.7)';g.stroke();
 rich('ONE · TWO · Q · THREE · C · FOUR',SCX,196,26,'#fff','center',900);
 for(let i=0;i<6;i++){const lit=t>=a+0.15+i*(dur/6);const x=125+i*154,y=330;g.globalAlpha=k*(lit?1:.35);g.shadowColor=cols[i];g.shadowBlur=lit?22:0;
  g.fillStyle=cols[i];if(i==2||i==4){g.beginPath();g.arc(x+40,y,44,0,7);g.fill()}else{rr(x-4,y-44,88,88,22);g.fill()}g.shadowBlur=0;
  rich(items[i],x+40,y+2,48,'#13082f','center',900);if(i<5){g.fillStyle='#fff';rich('›',x+118,y,34,'#fff','center',900)}}
 rich('I and II both pass electrons to Q, then III → c → IV → O_{2}',SCX,420,20,'#e6dcff','center',700);rich('H^{+} flow back through ATP synthase to make ATP',SCX,452,20,'#ffc1dc','center',700);g.restore()}
// ---------- main draw ----------
function draw(t){
 CAM=cam(t);
 g.clearRect(0,0,PW,PH);
 const tz=cu('L02'),mitoA=t<tz+0.8?1:0,zk=ease((t-(tz-1.8))/2.2);
 // diagram under
 const dg=clamp((t-(tz-0.9))/1.2);
 if(dg>0){g.save();g.globalAlpha=dg;
  glowA={I:0,II:0,III:0,IV:0,V:0};const gl=(id,from,to)=>{if(t>=cu(from)&&t<cu(to))return 1;return 0};
  glowA.I=gl('I','L03','L05')*.8;glowA.II=gl('II','L05','L07')*.8;glowA.III=Math.max(gl('III','L09','L10'),gl('III','L17','L19'))*.8;glowA.IV=gl('IV','L21','L24')*.8;glowA.V=gl('V','L27','L31')*.8+(t>=cu('L16')&&t<cu('L17')?.5:0);
  drawZones(t);drawLipids(t);drawQs(t);drawI(t);drawII(t);drawIII(t);drawIV(t);drawV(t);
  if(t>=tPumpI-5)drawPumps(t);drawLaneB(t);if(t>=tA)drawLaneA(t);drawO2(t);drawVflow(t);drawLabels(t);
  if(cu('L40')!==undefined)drawMnemonic(t);
  g.restore()}
 if(mitoA>0&&t<tz+0.8){drawMito(t,1-clamp((t-(tz-0.9))/1.2),zk)}
 // title (intro)
 const ti=t<tz-1.0?1:clamp((tz-0.2-t)/0.8);
 // DOM overlays
 const fi=factAt(t);if(fi!==lastFact){lastFact=fi;$('fact').innerHTML=fi>=0?FACTS[fi][1]:''}
 let fo=1;const endC=CFG.T-2.3+0.1;$('fact').style.opacity=(fi>=0&&FACTS[fi][1]&&t>cu('L02')-0.5?1:0)*(t>endC-0.2?0:1);
 const ta=trackerActive(t);for(let i=0;i<TR.length;i++){const e=$('tr'+i);const on=ta===i||ta===-2;e.style.opacity=ta===-1?.35:(on?1:.38);e.style.transform=on?'scale(1.12)':'scale(1)';e.style.boxShadow=on?'0 0 18px '+TR[i][2]:'none'}
 $('hook').style.opacity=t<0.15?0:(t<tz-1.6?1:clamp((tz-0.9-t)/0.7));
 $('trk').style.opacity=t<tz-0.9?0:1;
}
