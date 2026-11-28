// ---- chorus: net reaction ----
const SIX=CFG.lines.filter(l=>/^Six CO2/.test(l.text));
function netView(tv,A,c0,c1){if(A<=0.01)return;ctx.save();ctx.globalAlpha=A;
 // c0 = chorus start (line 'Light and water in')
 const w=CFG.lines.filter(l=>l.words[0][1]>=c0-0.5&&l.words[0][1]<c0+9);
 const t=(li,wi)=>{const l=w[li];return l?l.words[wi][1]:9999;};
 const sungLight=t(0,0),sungWater=t(0,2),sungO2=t(0,4),sungCO2=t(1,0),sungSugar=t(1,3);
 const lit=(ts)=>tv>=ts?1:0;
 const pulse=0.5+0.5*Math.sin(tv*5);
 function node(x,y,lab,sub,col,ts){const on=lit(ts);const pop=on?1+0.12*clamp(1-(tv-ts)/0.4):1;ctx.save();ctx.translate(x,y);ctx.scale(pop,pop);ctx.globalAlpha*=on?1:0.38;ctx.fillStyle=on?col+'33':'rgba(6,20,26,.8)';ctx.strokeStyle=col;ctx.lineWidth=4;ctx.shadowColor=col;ctx.shadowBlur=on?24:0;rr(-120,-42,240,84,26);ctx.fill();ctx.stroke();ctx.shadowBlur=0;chem(lab,0,-4,34,on?WH:col);text(sub,0,28,18,800,col,'center',3);ctx.restore();}
 node(-195,-120,'Light','energy from the sun',GD,sungLight);node(-195,0,'H2O','water',BL,sungWater);node(-195,120,'CO2','carbon dioxide',GY,sungCO2);
 node(195,-60,'O2','oxygen',PK,sungO2);node(195,60,'C6H12O6','glucose, sugar',GR,sungSugar);
 // arrows
 ctx.save();ctx.strokeStyle=WH;ctx.fillStyle=WH;ctx.globalAlpha*=0.8;ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-50,0);ctx.lineTo(28,0);ctx.stroke();ctx.beginPath();ctx.moveTo(60,0);ctx.lineTo(30,-20);ctx.lineTo(30,20);ctx.closePath();ctx.fill();ctx.restore();
 // equation builds term by term
 const six=SIX.filter(l=>l.words[0][1]>=c0&&l.words[0][1]<c1)[0];
 if(six){const s0=six.words[0][1],hs=six.words[2][1];const nxt=CFG.lines[CFG.lines.indexOf(six)+1];
  const eq=[['6CO2',six.words[1][1]],['+',hs-0.15],['6H2O',six.words[3][1]],['→',nxt.words[0][1]],['C6H12O6',nxt.words[1][1]],['+',nxt.words[2][1]-0.15],['6O2',nxt.words[3][1]]];
  const sizes=eq.map(e=>e[0]);ctx.font='900 34px Montserrat';let total=0;const ws=eq.map(e=>{const wv=ctx.measureText(e[0].replace(/[0-9]/g,m=>'')).width+ (e[0].match(/[0-9]/g)||[]).length*8;return wv+22;});total=ws.reduce((a,b)=>a+b,0);let x=-total/2;
  eq.forEach((e,i)=>{const a=ph(tv,e[1]-0.05,e[1]+0.3);const col=e[0]==='6CO2'?GY:e[0]==='6H2O'?BL:e[0]==='C6H12O6'?GR:e[0]==='6O2'?PK:WH;if(e[0]==='\u2192'){ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=WH;ctx.fillStyle=WH;ctx.lineWidth=6;ctx.lineCap='round';const ax=x+ws[i]/2;ctx.beginPath();ctx.moveTo(ax-18,225);ctx.lineTo(ax+12,225);ctx.stroke();ctx.beginPath();ctx.moveTo(ax+22,225);ctx.lineTo(ax+6,214);ctx.lineTo(ax+6,236);ctx.closePath();ctx.fill();ctx.restore();}else chem(e[0],x+ws[i]/2,225,32,col,a);x+=ws[i];});
  const la=ph(tv,six.words[3][1],six.words[3][1]+0.4);ctx.save();ctx.globalAlpha*=la;text('light',0,180,22,800,GD,'center',4);ctx.restore();}
 if(tv>=133.2&&tv<146){const a=win(tv,133.4,146,0.5);ctx.save();ctx.globalAlpha*=a;chip(0,275,'A leaf makes sugar from air',GR,1,0,52,28);ctx.restore();}
 ctx.restore();}
