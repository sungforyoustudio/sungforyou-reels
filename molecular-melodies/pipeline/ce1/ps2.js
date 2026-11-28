// ---- light reactions membrane view ----
const SUN=[-292,-218],PS2=[-215,0],CHN=[-110,0],PS1=[-5,0],NADP=[62,-128],ATPS=[225,0];
function photon(to,t0,t1,tv){const k=lin(tv,t0,t1);if(k<=0||k>=1.02)return;ctx.save();for(let i=0;i<6;i++){const kk=k-i*0.045;if(kk<0||kk>1)continue;const x=L(SUN[0],to[0],kk)+Math.sin(kk*30)*5,y=L(SUN[1],to[1],kk)+Math.cos(kk*30)*5;ctx.globalAlpha=1-i*0.16;ctx.fillStyle=GD;ctx.shadowColor=GD;ctx.shadowBlur=14;ctx.beginPath();ctx.arc(x,y,9-i,0,7);ctx.fill();}ctx.restore();}
function complexBox(c,w,h,col,lab,glow,a=1){ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=col;ctx.shadowBlur=10+26*glow;ctx.fillStyle=col+'D0';ctx.strokeStyle=WH;ctx.lineWidth=3;rr(c[0]-w/2,c[1]-h/2,w,h,22);ctx.fill();ctx.stroke();ctx.shadowBlur=0;text(lab,c[0],c[1]+1,22,900,'#06141A');ctx.restore();}
function edot(x,y,a=1,r=8){ctx.save();ctx.globalAlpha*=a;ctx.fillStyle='#FFF7B0';ctx.shadowColor=GD;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.shadowBlur=0;text('e-',x,y+1,13,900,'#6B4F00');ctx.restore();}
function hplus(x,y,a=1,r=9){ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=OR;ctx.shadowColor=OR;ctx.shadowBlur=8;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.shadowBlur=0;text('+',x,y+1,15,900,'#3A1A00');ctx.restore();}
function o2(x,y,a=1,sc=1){ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(sc,sc);ctx.fillStyle=PK;ctx.shadowColor=PK;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(-11,0,12,0,7);ctx.arc(11,0,12,0,7);ctx.fill();ctx.shadowBlur=0;text('O2',0,40,20,900,PK,'center',4);ctx.restore();}
function water(x,y,a=1){ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=BL;ctx.shadowColor=BL;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(x,y,16,0,7);ctx.arc(x-17,y+11,10,0,7);ctx.arc(x+17,y+11,10,0,7);ctx.fill();ctx.shadowBlur=0;text('H2O',x,y+38,20,900,BL,'center',4);ctx.restore();}
function lumenH(tv){ // number of protons shown in lumen
 let n=0;n+=Math.round(4*ph(tv,18.2,19.4));n+=Math.round(6*ph(tv,29.4,31.9));const out=ph(tv,44.2,47.6);return Math.round(n*(1-out));}
function lightView(tv,A){if(A<=0.01)return;ctx.save();ctx.globalAlpha=A;
 const hl=(a,b)=>win(tv,a,b,0.25);
 // stroma + lumen labels and membrane
 ctx.save();ctx.fillStyle='rgba(74,222,128,.10)';ctx.fillRect(-330,-215,660,199);ctx.fillStyle='rgba(125,211,252,.10)';ctx.fillRect(-330,16,660,200);
 ctx.fillStyle='rgba(45,212,191,.55)';ctx.strokeStyle=TL;ctx.lineWidth=4;rr(-330,-16,660,32,16);ctx.fill();ctx.stroke();ctx.restore();
 text('STROMA',320,-195,22,900,GR,'right',4);text('LUMEN',-270,196,22,900,BL,'left',4);
 sun(SUN[0],SUN[1],ph(tv,12.2,12.8));
 // complexes
 const g2=Math.max(hl(12.4,15.4),hl(24,27.5)),g1=Math.max(hl(32,35.6),hl(36.2,39));
 complexBox(PS2,84,92,BL,'PSII',g2);complexBox(PS1,84,92,'#C4A8FF','PSI',g1);
 ctx.save();ctx.fillStyle=TL+'D0';ctx.strokeStyle=WH;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(CHN[0],CHN[1],40,34,0,0,7);ctx.fill();ctx.stroke();text('chain',CHN[0],CHN[1]+1,18,900,'#06141A');ctx.restore();
 // ATP synthase
 const spin=tv>=44.1&&tv<48?(tv-44.1)*9:0;
 ctx.save();ctx.shadowColor=GD;ctx.shadowBlur=10+18*hl(44.1,47.9);ctx.fillStyle=GD+'E0';ctx.strokeStyle=WH;ctx.lineWidth=3;rr(ATPS[0]-22,-20,44,40,10);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.arc(ATPS[0],-52,30,0,7);ctx.fill();ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#06141A';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(ATPS[0]-Math.cos(spin)*22,-52-Math.sin(spin)*22);ctx.lineTo(ATPS[0]+Math.cos(spin)*22,-52+Math.sin(spin)*22);ctx.stroke();ctx.restore();
 text('ATP synthase',ATPS[0],-100,20,900,GD,'center',4);
 // photons
 photon([PS2[0],PS2[1]-46],12.4,14.6,tv);photon([PS1[0],PS1[1]-46],32.2,34.6,tv);
 // water splitting 12.8..19.4
 if(tv>=12.8&&tv<19.6){const a=ph(tv,12.8,13.4)*(1-ph(tv,17.4,19.4));water(PS2[0],118,a);}
 if(tv>=16.2&&tv<19.6){const k=ph(tv,16.4,18.8);for(const s of[-1,1]){const x=L(PS2[0]+s*17,PS2[0]+s*34,k),y=L(129,70,k);hplus(x,y,1-0*k,8);}}
 if(tv>=16.8&&tv<19.8){const k=ph(tv,17.0,19.4);edot(L(PS2[0],PS2[0],k),L(60,20,k),1);}
 if(tv>=18.4&&tv<27){const k=lin(tv,18.8,23.6);const p=ph(tv,19.0,19.6);for(let i=0;i<3;i++){const kk=clamp(k-i*0.14);const a=ph(tv,18.8+i*0.5,19.6+i*0.5)*(1-ph(tv,22.2+i*0.3,23.6+i*0.3));if(a>0.01)o2(L(PS2[0],-305,kk)+Math.sin(kk*9+i)*8,L(100,250,kk),a,1);}}
 // lumen protons
 const hn=lumenH(tv);const flow=hl(44.1,47.9);
 for(let i=0;i<hn;i++){const bx=-150+(i%5)*52+Math.sin(tv*1.7+i*2)*8,by=58+Math.floor(i/5)*46+Math.cos(tv*1.3+i)*6;
  if(tv>=44.1&&tv<47.9){const k=ph(tv,44.2+i*0.12,47.6);const x=L(bx,ATPS[0],Math.min(1,k*1.8));const y=k<0.5?L(by,22,k/0.5):L(22,-92,(k-0.5)/0.5);hplus(x,y,1-lin(k,0.92,1),9);}
  else hplus(bx,by,1,9);}
 // electrons along the chain
 if(tv>=24&&tv<=40){let p=null;
  if(tv<28.1){const k=ph(tv,24.2,27.4);p=[PS2[0],L(-8,-64,k)];}
  else if(tv<32){const k=ph(tv,28.2,31.6);p=k<0.5?[L(PS2[0],CHN[0],k*2),L(-64,-24,k*2)]:[L(CHN[0],PS1[0],(k-0.5)*2),L(-24,-52,(k-0.5)*2)];}
  else if(tv<36.2){const k=ph(tv,32,35.4);p=[PS1[0],L(-52,-86,k)];}
  else{const k=ph(tv,36.3,39.2);p=qb([PS1[0],-86],[40,-130],[NADP[0]-34,NADP[1]],k);}
  if(p&&!(tv>=39.4))edot(p[0],p[1],1,9);}
 // pumped protons at the chain (28.2..31.9)
 if(tv>=28.4&&tv<32.6){for(let i=0;i<3;i++){const k=ph(tv,28.6+i*0.55,30.0+i*0.55);if(k>0&&k<1)hplus(CHN[0]-30+i*30,L(-60,58,k),Math.min(1,k*4),9);}}
 // NADP+ -> NADPH
 if(tv>=36.0){const on=tv>=40.0;const a=ph(tv,36.0,36.6)*(1-ph(tv,52.2,52.8));const pop=on?1+0.25*clamp(1-(tv-40)/0.4):1;ctx.save();ctx.translate(NADP[0],NADP[1]);ctx.scale(pop,pop);chip(0,0,on?'NADPH':'NADP+',on?PK:BL,a,on?120:110,46,26);ctx.restore();}
 // ATP
 if(tv>=44.1){const on=tv>=48.2;const pop=on?1+0.25*clamp(1-(tv-48.2)/0.4):1;ctx.save();ctx.translate(ATPS[0],-150);ctx.scale(pop,pop);const a=ph(tv,44.1,44.7)*(1-ph(tv,52.2,52.8));chip(0,0,on?'ATP':'ADP + Pi',on?GD:GY,a,on?96:150,44,24);ctx.restore();}
 // done: make them travel
 if(tv>=52.1){const k=ph(tv,52.2,54.0);const A2=1;ctx.save();ctx.globalAlpha*=win(tv,52.1,60.6,0.3);
  // overlay ATP + NADPH big chips toward Calvin
  chip(L(62,-80,k),L(-128,-175,k),'NADPH',PK,1,130,50,28);chip(L(225,80,k),L(-150,-175,k),'ATP',GD,1,100,50,28);ctx.restore();}
 ctx.restore();}
