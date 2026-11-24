function pMix(tv,t0){const L=[[6,'C'],[14,'Si'],[50,'Sn']];L.forEach((e,i)=>{const k=ease((tv-t0-i*0.9)/0.4);if(k<=0)return;const x=540+(i-1)*230;const c=cls(e[0]);ctx.save();ctx.globalAlpha=k;ctx.translate(x,985);ctx.scale(0.7+0.3*k,0.7+0.3*k);ctx.shadowColor=CC[c];ctx.shadowBlur=22;ctx.fillStyle=CC[c];rr(-70,-70,140,140,20);ctx.fill();ctx.shadowBlur=0;text(e[1],0,-6,66,900,'#06141A');text(CNAME[c],0,48,22,800,'#06141A');ctx.restore();});cap('same column, three different types',CC.md);}
function pCard2(z,name,icon,capt,iconT){return (tv,t0)=>pCard(tv,t0,0,z,name,icon,capt,iconT);}
const crys=(x,y,a)=>iCan; // placeholder
const PAN=[
 [6.4,10.7,(tv,t0)=>pTitle(tv)],
 [10.7,15.2,pCols],[15.2,19.5,pMix],[19.5,30.0,(tv)=>pOuter(tv)],
 [30.0,LE(11)+0.3,(tv)=>pChorus(tv,8)],[LS(12)-0.2,45.2,(tv)=>pChorus(tv,8)],
 [45.2,49.0,(tv,t0)=>pLegend(tv,t0,'metals, metalloids, nonmetals')],
 [49.0,53.4,(tv,t0)=>pCard(tv,t0,0,5,'Boron',(x,y,a)=>iCrystal(x,y,a),'metalloid: brittle and hard',LS(14))],
 [53.4,56.35,(tv,t0)=>pCard(tv,t0,0,13,'Aluminum',(x,y,a)=>iCan(x,y,a),'metal: light and strong')],
 [56.35,58.55,(tv,t0)=>pCard(tv,t0,0,31,'Gallium',(x,y,a)=>iPalm(x,y,tv,56.5,a),'gallium melts in your palm')],
 [58.55,63.0,(tv,t0)=>pCard(tv,t0,0,6,'Carbon',(x,y,a)=>iHex(x,y,tv,a),'nonmetal: the backbone of life',LS(18))],
 [63.0,67.6,(tv,t0)=>pCard(tv,t0,0,14,'Silicon',(x,y,a)=>iChip(x,y,tv,a,tv>=LS(20)),'chips and sand: a metalloid',LS(19))],
 [67.6,70.4,(tv)=>{const k=ease((tv-LS(21))/0.4);tileBig(330,990,50,0.7+0.3*k,k,'Tin');tileBig(540,990,82,0.7+0.3*clamp((tv-LS(21)-0.8)/0.4),clamp((tv-LS(21)-0.8)/0.4),'Lead');iIngots(760,990,ease((tv-LS(21)-0.2)/0.4));cap('tin and lead are metals',CC.mt);}],
 [70.4,73.2,pMix],
 [73.2,LE(26)+0.3,(tv)=>pChorus(tv,23)],[LS(27)-0.2,88.3,(tv)=>pChorus(tv,23)],
 [88.3,92.0,pNext],
 [92.0,94.6,(tv,t0)=>pCard(tv,t0,0,7,'Nitrogen',null,'group 15')],
 [94.6,97.0,(tv,t0)=>{iPie(540,985,100,tv,t0,false,ease((tv-t0)/0.3));text('78%',540-5,985,44,900,'#06141A');ctx.save();ctx.globalAlpha=ease((tv-t0-0.5)/0.3);text('nitrogen: most of the air',540,1130,30,800,CC.mt,'center',4);ctx.restore();}],
 [97.0,99.2,(tv,t0)=>pCard(tv,t0,0,15,'Phosphorus',(x,y,a)=>iDna(x+10,y,tv,a),'phosphorus: in your DNA')],
 [99.2,101.9,(tv,t0)=>{[[7,'N',0],[15,'P',1],[33,'As',2]].forEach(([z,s,i])=>{const k=i<2?1:ease((tv-t0-0.6)/0.6);const y=900+i*95+(i===2?(1-k)*40:0);ctx.save();ctx.globalAlpha=i<2?0.8:k;ctx.fillStyle=CC[cls(z)];rr(540-85,y-38,170,76,16);ctx.fill();text(s,540,y+2,44,900,'#06141A');ctx.restore();});cap('arsenic hides underneath',CC.md,1195,26);}],
 [101.9,104.0,(tv,t0)=>pCard(tv,t0,0,8,'Oxygen',null,'group 16')],
 [104.0,106.65,(tv,t0)=>{iPie(540,985,100,tv,t0-1,true,1);text('21%',540+55,985+10,34,900,'#06141A');cap('a fifth of the air: we need it to live',CC.nm,1140,26);}],
 [106.65,108.9,(tv,t0)=>{const k=ease((tv-t0)/0.4);tileBig(540-130,990,16,0.9*(0.7+0.3*k),k,'Sulfur');tileBig(540+130,990,34,0.9*(0.7+0.3*clamp((tv-t0-0.7)/0.4)),clamp((tv-t0-0.7)/0.4),'Selenium');cap('sulfur and selenium follow',CC.nm);}],
 [108.9,111.35,(tv,t0)=>pOxy(tv,t0,0)],
 [111.35,114.2,(tv,t0)=>pOxy(tv,t0-3,1)],
 [114.2,119.0,(tv)=>pStairs(tv)],[119.0,121.1,(tv,t0)=>pSide(tv,t0,true)],[121.1,123.5,(tv,t0)=>pSide(tv,t0,false)],[123.5,128.1,pSemi],[128.1,135.5,pBoth],
 [135.5,137.4,pFloat],[137.4,139.7,(tv,t0)=>pFloat(tv,t0-1)],[139.7,142.1,pCount],[142.1,144.3,pUses],[144.3,146.9,pRadio],[146.9,149.0,pUranium],[149.0,154.8,pWhole],
 [154.8,LE(56)+0.3,(tv)=>pChorus(tv,53)],[LS(57)-0.2,169.6,(tv)=>pChorus(tv,53)],
 [169.6,999,(tv,t0)=>pLegend(tv,t0,'a column can hold all three')]
];
// ---- lyric (word pops) ----
function lyric(tv){let L=null;for(let i=0;i<CFG.lines.length;i++){const l=CFG.lines[i];const s=l.words[0][1]-0.3;let e=l.words[l.words.length-1][2]+0.5;const n=CFG.lines[i+1];if(n)e=Math.min(e,n.words[0][1]-0.05);if(tv>=s&&tv<e){L=l;break;}}
 if(!L)return;const ws=L.words;const full=ws.map(w=>w[0]).join(' ');let rows=[ws];if(full.length>(LAND?44:24)){let best=1,bd=1e9;for(let i=1;i<ws.length;i++){const a=ws.slice(0,i).map(w=>w[0]).join(' ').length,b=full.length-a;const d=Math.abs(a-b);if(d<bd){bd=d;best=i;}}rows=[ws.slice(0,best),ws.slice(best)];}
 const fade=ease((tv-(ws[0][1]-0.3))/0.2);ctx.save();ctx.globalAlpha=fade;ctx.font=`900 ${LAND?72:62}px Montserrat`;rows.forEach((r,ri)=>{const total=r.map(w=>ctx.measureText(w[0]+' ').width).reduce((a,b)=>a+b,0);let x=W/2-total/2;const y=(LAND?930:1290)+ri*80-(rows.length-1)*40;
  r.forEach(w=>{const wd=ctx.measureText(w[0]+' ').width;const on=tv>=w[1];const pop=on?1+0.08*clamp(1-(tv-w[1])/0.2):1;const cx=x+ctx.measureText(w[0]).width/2;ctx.save();ctx.translate(cx,y);ctx.scale(pop,pop);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=9;ctx.strokeStyle='rgba(2,10,14,.92)';ctx.lineJoin='round';ctx.strokeText(w[0],-ctx.measureText(' ').width/2*0,0);ctx.fillStyle=on?'#4ADE80':'#FFFFFF';ctx.fillText(w[0],0,0);ctx.restore();x+=wd;});});ctx.restore();}
// ---- background hexes, progress, hook ----
function hexes(tv){ctx.save();for(let i=0;i<16;i++){const sp=14+rnd(i+3)*26;const x=rnd(i)*W;const y=H+80-((tv*sp+rnd(i+9)*(H+200))%(H+200));const r=26+rnd(i+5)*70;ctx.strokeStyle=i%3===0?'rgba(245,200,75,.10)':'rgba(74,222,128,.10)';ctx.lineWidth=3;ctx.beginPath();for(let k=0;k<6;k++){const g=Math.PI/3*k+tv*0.1*(i%2?1:-1);ctx.lineTo(x+r*Math.cos(g),y+r*Math.sin(g));}ctx.closePath();ctx.stroke();}ctx.restore();}
function hook(tv){const k=ease((tv-6.5)/0.35);if(tv<6.4||tv>10.55)return;const o=1-ease((tv-10.2)/0.35);ctx.save();ctx.globalAlpha=k*o;const sc=1+0.06*Math.sin(tv*6);const y=(LAND?930:1290);ctx.translate(W/2,y);ctx.scale(sc,sc);text('Why do groups 13 to 16',0,-44,LAND?64:50,900,'#FFFFFF','center',9);text('break the rule?',0,32,LAND?72:60,900,'#F5C84B','center',9);ctx.restore();}
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
 const a4=ease((d-2.2)/0.4);ctx.globalAlpha=k*a4;text('Next up: Part 3, Across and Down',cx,Y.nx,Y.fs[6],800,'#7DD3FC','center',5);
 ctx.restore();}
function draw(t){ctx.clearRect(0,0,W,H);bg();const tsong=CFG.T-CFG.END;
 if(t>=tsong){hexes(t+CFG.S0);header(1);endCard(t);return;}
 const tv=t+CFG.S0;const fadeOut=clamp((tsong-t)/1.0);hexes(tv);ctx.save();ctx.globalAlpha=fadeOut;
 const kk=kick(tv);ctx.save();if(logo.complete){}ctx.restore();header();progress(tv,t);table2(tv);
 ctx.save();if(LAND){ctx.translate(1527,470);ctx.scale(0.98,0.98);ctx.translate(-540,-1030);}
 for(const p of PAN){if(tv>=p[0]&&tv<p[1]){ctx.save();ctx.globalAlpha=ease((tv-p[0])/0.25)*clamp((p[1]-tv)/0.15+0.0001,0,1)||0;p[2](tv,p[0]);ctx.restore();break;}}
 ctx.restore();hook(tv);lyric(tv);ctx.restore();}
window.draw=draw;
</script></body></html>
