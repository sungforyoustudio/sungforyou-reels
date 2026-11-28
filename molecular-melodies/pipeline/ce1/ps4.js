// ---- Calvin cycle ----
const CA=[0,-125],CB=[125,85],CC=[-125,85];
function arrowArc(p0,c,p1,col,a){ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=6;ctx.setLineDash([10,9]);ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.quadraticCurveTo(c[0],c[1],p1[0],p1[1]);ctx.stroke();ctx.setLineDash([]);const e=qb(p0,c,p1,0.97),f=qb(p0,c,p1,1);const g=Math.atan2(f[1]-e[1],f[0]-e[0]);ctx.translate(f[0],f[1]);ctx.rotate(g);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-20,-13);ctx.lineTo(-20,13);ctx.closePath();ctx.fill();ctx.restore();}
function flash(x,y,t0,tv){const d=tv-t0;if(d<0||d>0.5)return;ctx.save();ctx.globalAlpha=1-d/0.5;ctx.strokeStyle=GD;ctx.lineWidth=6;ctx.beginPath();ctx.arc(x,y,20+60*(d/0.5),0,7);ctx.stroke();ctx.restore();}
function calvin(tv,A){if(A<=0.01)return;ctx.save();ctx.globalAlpha=A;
 const ring=ph(tv,76.6,78.2);ctx.save();ctx.globalAlpha*=ring;
 arrowArc(CA,[185,-60],[CB[0]-6,CB[1]-24],'#2B7C86',1);arrowArc(CB,[0,185],[CC[0]+6,CC[1]],'#2B7C86',1);arrowArc(CC,[-185,-60],[CA[0]-24,CA[1]+14],'#2B7C86',1);
 text('STROMA',-250,-200,22,900,GR,'left',4);
 const hlA=win(tv,80.16,84.0,0.3)+win(tv,84.8,96.5,0.3),hlB=win(tv,96.2,104.2,0.3),hlC=win(tv,104.2,108.6,0.3);
 const stn=(p,lab,sub,col,hl,dx,dy)=>{ctx.save();ctx.shadowColor=col;ctx.shadowBlur=6+26*clamp(hl);ctx.fillStyle='rgba(6,20,26,.9)';ctx.strokeStyle=col;ctx.lineWidth=4;ctx.beginPath();ctx.arc(p[0],p[1],34,0,7);ctx.fill();ctx.stroke();ctx.restore();text(lab,p[0]+dx,p[1]+dy,22,900,col,'center',4);if(sub)text(sub,p[0]+dx,p[1]+dy+24,16,800,WH,'center',3);};
 stn(CA,'FIXATION','Step 1',GD,hlA,0,-66);stn(CB,'REDUCTION','Step 2',PK,hlB,70,10);stn(CC,'REGENERATION','Step 3',BL,hlC,-70,10);
 ctx.restore();
 // RuBisCO label
 if(tv>=84.88&&tv<92.4){const a=win(tv,84.88,92.4,0.3);ctx.save();ctx.globalAlpha*=a;chip(CA[0],CA[1],'RuBisCO',GD,1,150,46,24,'rgba(245,200,75,.18)');ctx.restore();}
 // CO2 enters
 if(tv>=84.2&&tv<91.6){const k=ph(tv,84.9,87.2);const x=L(-262,CA[0]-70,k),y=L(-195,CA[1]+4,k);ctx.save();ctx.globalAlpha*=ph(tv,84.2,84.8)*(1-ph(tv,91.0,91.6));cdots(x,y,1,GY,1,'CO2');ctx.restore();}
 // RuBP chip, sits at C then moves to A
 if(tv>=82.0&&tv<91.8){const k=tv<88.3?0:ph(tv,88.4,91.2);const p=qb(CC,[-185,-60],[CA[0]+70,CA[1]+4],k);ctx.save();ctx.globalAlpha*=ph(tv,82.0,82.8)*(1-ph(tv,91.2,91.8));cdots(p[0],p[1]+(k===0?58:0),5,GD,1,'RuBP, 5 carbons');ctx.restore();}
 flash(CA[0],CA[1],91.6,tv);
 // 3-PGA to B, then reduce to G3P, then regenerate
 if(tv>=92.0&&tv<107.5){
  const toB=ph(tv,92.4,95.8);const red=tv>=101.8;const toC=ph(tv,104.6,107.0);
  for(let i=0;i<2;i++){let p;if(tv<104.6)p=qb(CA,[185,-60],[CB[0]-14+i*30*0+ (i?34:-34)*0,CB[1]-16+(i?38:-4)],clamp(toB-i*0.1));else p=qb(CB,[0,185],[CC[0]+(i?28:-28),CC[1]+(i?14:-14)],toC);
   const col=red?GR:BL;const a=ph(tv,92.0+i*0.3,92.6+i*0.3)*(1-ph(tv,107.0,107.6));
   if(a>0.01){ctx.save();ctx.globalAlpha*=a;cdots(p[0],p[1],3,col,1);ctx.restore();}}
  if(tv>=94.0&&tv<100.5){ctx.save();ctx.globalAlpha*=win(tv,94.0,100.5,0.3);text('3-PGA',CB[0]+105,CB[1]-84,22,900,BL,'center',4);text('3 carbons each',CB[0]+105,CB[1]-60,17,800,WH,'center',3);ctx.restore();}
  if(tv>=102.2&&tv<104.4){ctx.save();ctx.globalAlpha*=win(tv,102.2,104.4,0.25);text('G3P',CB[0]+90,CB[1]-52,22,900,GR,'center',4);ctx.restore();}
  flash(CB[0],CB[1],101.8,tv);}
 // ATP + NADPH arrive at B
 if(tv>=100.4&&tv<102.6){const k=ph(tv,100.5,101.9);const a=(1-ph(tv,101.9,102.5));ctx.save();ctx.globalAlpha*=a*ph(tv,100.4,100.8);chip(L(300,CB[0]+8,k),L(-20,CB[1]-70,k),'NADPH',PK,1,118,40,22);chip(L(300,CB[0]+8,k),L(40,CB[1]-26,k),'ATP',GD,1,86,40,22);ctx.restore();}
 // ATP to C
 if(tv>=105.2&&tv<107.4){const k=ph(tv,105.3,106.7);ctx.save();ctx.globalAlpha*=ph(tv,105.2,105.6)*(1-ph(tv,106.8,107.4));chip(L(-300,CC[0]-30,k),L(200,CC[1]+52,k),'ATP',GD,1,86,40,22);ctx.restore();}
 flash(CC[0],CC[1],107.2,tv);
 if(tv>=107.2&&tv<112.8){ctx.save();ctx.globalAlpha*=ph(tv,107.2,107.8)*(1-ph(tv,112.2,112.8));cdots(CC[0],CC[1]+58,5,GD,1,'RuBP again');ctx.restore();}
 // bridge: three turns, one G3P out
 if(tv>=108.8&&tv<117.6){ctx.save();ctx.globalAlpha*=win(tv,108.8,117.6,0.3);
  [108.9,110.1,110.9].forEach((t,i)=>{const a=ph(tv,t,t+0.35);ctx.save();ctx.globalAlpha*=a;cdots(-110+i*110,-250,1,GY,1);ctx.restore();});
  text('3 turns',-190,-204,26,900,WH,'center',5);ctx.restore();
  ctx.save();ctx.globalAlpha*=ph(tv,109.2,109.8)*(1-ph(tv,112.2,112.6));pill('3 turns = 3 CO2 in',0,LAND?262:222,GD,1,28);ctx.restore();}
 if(tv>=112.6&&tv<117.4){const k=ph(tv,112.9,115.4);const p=[L(CB[0]+40,330,k),L(CB[1],40,k)];ctx.save();ctx.globalAlpha*=win(tv,112.6,117.4,0.3);cdots(p[0],p[1],3,GR,1,'G3P');pill('1 G3P out = sugar for you',0,LAND?262:222,GR,1,28);ctx.restore();}
 if(tv>=80&&tv<117.4){ctx.save();ctx.globalAlpha*=win(tv,80,117.4,0.5)*0.85;text('simplified: one turn shown',0,LAND?300:246,20,800,WH,'center',4);ctx.restore();}
 ctx.restore();}
// ---- stage indicator ----
const STG=[['1','Light reactions','#4ADE80'],['2','Calvin cycle','#F5C84B'],['=','Net reaction','#7DD3FC']];
function stageNow(tv){if(tv>=12.4&&tv<60.9)return 0;if(tv>=76.5&&tv<117.0)return 1;if((tv>=60.9&&tv<76.5)||tv>=117.0)return 2;return -1;}
function tracker(tv){const act=stageNow(tv);
 for(let i=0;i<3;i++){const on=i===act;const col=STG[i][2];const x=LAND?1600:W/2+(i-1)*300,y=LAND?290+i*130:300;
  ctx.save();ctx.translate(x,y);const sc=on?1.1:1;ctx.scale(sc,sc);ctx.globalAlpha=on?1:0.38;if(on){ctx.shadowColor=col;ctx.shadowBlur=26;}
  ctx.fillStyle=on?col:'#1B4750';ctx.beginPath();ctx.arc(0,0,42,0,7);ctx.fill();ctx.shadowBlur=0;text(STG[i][0],0,3,46,900,on?'#06141A':'#7DD3FC');ctx.restore();
  ctx.save();ctx.globalAlpha=on?1:0.45;if(LAND)text(STG[i][1],x+64,y+2,28,800,on?col:'#7DD3FC','left',4);else text(STG[i][1],x,y+66,21,800,on?col:'#7DD3FC','center',4);ctx.restore();}}
function info(tv){
 if(tv<2.6)return['PHOTOSYNTHESIS',['How a leaf makes','sugar from air'],GR];
 if(tv<7.6)return['CHLOROPLAST',['Two stages to know'],GR];
 if(tv<12.4)return['TWO STAGES',['Thylakoid, then stroma'],TL];
 if(tv<16.2)return['PHOTOSYSTEM II',['Absorbs light from the sun'],GD];
 if(tv<20.0)return['WATER SPLITS',['Step one: H2O breaks apart'],BL];
 if(tv<24.0)return['OXYGEN OUT',['That is the air you breathe'],PK];
 if(tv<28.1)return['ELECTRONS',['Excited by light, they leave'],GD];
 if(tv<32.0)return['ELECTRON CHAIN',['Pumping protons through'],TL];
 if(tv<36.2)return['PHOTOSYSTEM I',['Light hits them anew'],'#C4A8FF'];
 if(tv<40.0)return['NADP+',['Picks up the electrons'],BL];
 if(tv<44.0)return['NADPH MADE',['Stored energy carrier'],PK];
 if(tv<48.2)return['ATP SYNTHASE',['Protons rush through'],GD];
 if(tv<52.1)return['ATP MADE',['Cell energy currency'],GD];
 if(tv<56.2)return['STAGE 1 DONE',['Light reactions finished'],GR];
 if(tv<60.9)return['ATP + NADPH',['Fuel for the next stage'],GD];
 if(tv<64.2)return['NET REACTION',['Light and water in, O2 out'],GR];
 if(tv<68.2)return['NET REACTION',['CO2 in, sugar out'],GR];
 if(tv<76.5)return['NET REACTION',['6 CO2 + 6 H2O makes sugar'],GR];
 if(tv<80.1)return['CALVIN CYCLE',['In the stroma, it spins'],GD];
 if(tv<84.8)return['FIXATION',['Step 1: carbon fixation'],GD];
 if(tv<88.2)return['RUBISCO',['Grabs a CO2'],GD];
 if(tv<92.2)return['RUBP',['Five carbons'],GD];
 if(tv<96.2)return['3-PGA',['Two of them, 3 carbons each'],BL];
 if(tv<100.4)return['REDUCTION',['Step 2: sugar in reach'],PK];
 if(tv<104.2)return['ATP + NADPH',['Turn 3-PGA into G3P'],PK];
 if(tv<108.8)return['REGENERATION',['Step 3: rebuild RuBP'],BL];
 if(tv<112.6)return['3 TURNS',['3 CO2 in'],GD];
 if(tv<117.0)return['1 G3P OUT',['That is sugar for you'],GR];
 if(tv<121)return['NET REACTION',['Light and water in, O2 out'],GR];
 if(tv<124.2)return['NET REACTION',['CO2 in, sugar out'],GR];
 if(tv<133)return['NET REACTION',['6 CO2 + 6 H2O makes sugar'],GR];
 return['PHOTOSYNTHESIS',['A leaf makes sugar from air'],GR];}
function titleBlock(tv){const[t,sub,col]=info(tv);if(LAND){text(t,X0,360,(tv<2.6||t.length>12)?46:56,900,col,'left',8);sub.forEach((s,i)=>text(s,X0,425+i*44,32,800,WH,'left',5));}}
function titlePortrait(tv){const[t,sub,col]=info(tv);
 if(tv<2.6){text(t,W/2,415,54,900,col,'center',8);text('SUGAR FROM AIR',W/2,478,62,900,GD,'center',8);text('How a leaf makes it',W/2,528,32,800,WH,'center',5);return;}
 text(t,W/2,442,t.length>13?56:64,900,col,'center',8);const s=sub.join(' ');text(s,W/2,494,s.length>34?27:30,800,WH,'center',5);}
function endCard(t){const tsong=CFG.T-CFG.END;const d=t-tsong;const k=ease(d/0.5);const cx=W/2;const pulse=1+0.05*Math.sin(d*6);
 const Y=LAND?{logo:60,ls:170,title:285,tag:350,btn:480,bh:110,sub:575,q:665,q2:728,nx:812,fs:[76,36,50,40,50,34,32]}:{logo:430,ls:220,title:715,tag:785,btn:930,bh:124,sub:1050,q:1135,q2:1195,nx:1265,fs:[66,36,46,40,40,34,32]};
 ctx.save();ctx.globalAlpha=k;
 if(logo.complete)ctx.drawImage(logo,cx-Y.ls/2,Y.logo,Y.ls,Y.ls);
 text('Molecular Melodies',cx,Y.title,Y.fs[0],900,WH);text('Science, set to music',cx,Y.tag,Y.fs[1],800,GR);
 ctx.save();ctx.translate(cx,Y.btn);ctx.scale(pulse,pulse);ctx.shadowColor=GR;ctx.shadowBlur=34;ctx.fillStyle=GR;rr(-330,-Y.bh/2,660,Y.bh,Y.bh/2);ctx.fill();ctx.shadowBlur=0;text('SUBSCRIBE + FOLLOW',0,4,Y.fs[2]*0.92,900,'#06141A');ctx.restore();
 const a2=ease((d-0.5)/0.4);ctx.globalAlpha=k*a2;text('for more scientific music',cx,Y.sub,Y.fs[3],800,WH,'center',5);
 const a3=ease((d-1.2)/0.4);ctx.globalAlpha=k*a3;text('What concept should we sing next?',cx,Y.q,Y.fs[4],900,GD,'center',6);text('Tell us in the comments',cx,Y.q2,Y.fs[5]-2,800,WH,'center',5);
 const a4=ease((d-2.2)/0.4);ctx.globalAlpha=k*a4;text('Next up: Cellular Respiration',cx,Y.nx,Y.fs[6],800,BL,'center',5);
 const a5=ease((d-2.8)/0.4);ctx.globalAlpha=k*a5;
 if(LAND)text('Sources: OpenStax Biology 2e, Ch. 8.2 and 8.3  |  OpenStax Concepts of Biology, Ch. 5',cx,925,24,700,'#9FC9CF','center',4);
 else{text('Sources: OpenStax Biology 2e, Ch. 8.2 and 8.3',cx,1370,24,700,'#9FC9CF','center',4);text('OpenStax Concepts of Biology, Ch. 5',cx,1406,24,700,'#9FC9CF','center',4);}
 ctx.restore();}
function draw(t){ctx.clearRect(0,0,W,H);bg();const tsong=CFG.T-CFG.END;
 if(t>=tsong){hexes(t+CFG.S0);header(1);endCard(t);return;}
 const tv=t+CFG.S0;const fadeOut=clamp((tsong-t)/1.0);hexes(tv);ctx.save();ctx.globalAlpha=fadeOut;
 header();progress(tv,t);tracker(tv);
 if(LAND)titleBlock(tv);else titlePortrait(tv);
 const SC=LAND?1.15:1.4,CX=W/2,CY=LAND?490:865;
 ctx.save();ctx.translate(CX,CY);ctx.scale(SC,SC);
 // scene alphas
 const chl=1-ph(tv,11.8,12.6);
 if(chl>0.01){ctx.save();const z=(LAND?1:0.86)*(1+0.35*ph(tv,11.8,12.8));ctx.scale(z,z);chloroplast(tv,chl);ctx.restore();}
 const lv=win(tv,12.2,60.9,0.5)*(tv<14?ph(tv,12.2,13):1);
 if(lv>0.01){ctx.save();const z=tv<13?0.75+0.25*ph(tv,12.2,13):1;ctx.scale(z,z);lightView(tv,lv);ctx.restore();}
 const nv=Math.max(win(tv,60.9,76.5,0.5),win(tv,117.0,146.0,0.5));if(nv>0.01)netView(tv,nv,tv<100?60.96:117.12,tv<100?76:146);
 calvin(tv,win(tv,76.5,117.2,0.5));
 ctx.restore();
 lyric(tv);ctx.restore();}
window.draw=draw;
</script></body></html>
