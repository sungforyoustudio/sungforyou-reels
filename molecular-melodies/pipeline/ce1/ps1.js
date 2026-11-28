// ================= photosynthesis model =================
const lin=(tv,a,b)=>clamp((tv-a)/(b-a));const ph=(tv,a,b)=>ease((tv-a)/(b-a));
const win=(tv,a,b,f=0.4)=>ease((tv-a)/f)*ease((b-tv)/f);
const GR='#4ADE80',TL='#2DD4BF',BL='#7DD3FC',GD='#F5C84B',PK='#F472B6',WH='#EFFFFA',OR='#FB923C',GY='#A9C4CB';
const L=(a,b,k)=>a+(b-a)*k;
function qb(p0,c,p1,k){const m=1-k;return[m*m*p0[0]+2*m*k*c[0]+k*k*p1[0],m*m*p0[1]+2*m*k*c[1]+k*k*p1[1]];}
function chip(x,y,s,col,a=1,w=0,h=40,fs=22,fill){ctx.save();ctx.globalAlpha*=a;ctx.font=`800 ${fs}px Montserrat`;const ww=w||ctx.measureText(s).width+30;ctx.fillStyle=fill||'rgba(6,20,26,.85)';rr(x-ww/2,y-h/2,ww,h,h/2);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=3;ctx.shadowColor=col;ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;text(s,x,y+1,fs,800,col);ctx.restore();}
function cdots(x,y,n,col,a=1,lab){ctx.save();ctx.globalAlpha*=a;const w=n*24+20;ctx.fillStyle='rgba(6,20,26,.85)';rr(x-w/2,y-20,w,40,20);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=3;ctx.shadowColor=col;ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle=col;for(let i=0;i<n;i++){ctx.beginPath();ctx.arc(x-(n-1)*12+i*24,y,8,0,7);ctx.fill();}if(lab)text(lab,x,y+36,20,800,col,'center',4);ctx.restore();}
function chem(s,x,y,size,col,a=1){ctx.save();ctx.globalAlpha*=a;ctx.textBaseline='middle';ctx.textAlign='left';const parts=[];for(let i=0;i<s.length;i++){const c=s[i];const sub=/[0-9]/.test(c)&&i>0&&/[A-Za-z]/.test(s[i-1]);parts.push([c,sub]);}
 const wd=p=>{ctx.font=`900 ${p[1]?size*0.62:size}px Montserrat`;return ctx.measureText(p[0]).width;};let tw=0;parts.forEach(p=>tw+=wd(p));let cx=x-tw/2;
 parts.forEach(p=>{ctx.font=`900 ${p[1]?size*0.62:size}px Montserrat`;ctx.lineWidth=7;ctx.strokeStyle='rgba(2,10,14,.9)';ctx.lineJoin='round';const yy=y+(p[1]?size*0.2:0);ctx.strokeText(p[0],cx,yy);ctx.fillStyle=col;ctx.fillText(p[0],cx,yy);cx+=wd(p);});ctx.restore();}
function sun(x,y,a=1){ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.fillStyle=GD;ctx.shadowColor=GD;ctx.shadowBlur=30;ctx.beginPath();ctx.arc(0,0,24,0,7);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=GD;ctx.lineWidth=5;ctx.lineCap='round';for(let i=0;i<10;i++){const g=i/10*Math.PI*2+0.3;ctx.beginPath();ctx.moveTo(Math.cos(g)*34,Math.sin(g)*34);ctx.lineTo(Math.cos(g)*48,Math.sin(g)*48);ctx.stroke();}ctx.restore();}
// ---- chloroplast cutaway ----
function chloroplast(tv,A){if(A<=0.01)return;ctx.save();ctx.globalAlpha=A;
 ctx.save();ctx.fillStyle='rgba(74,222,128,.12)';ctx.strokeStyle=GR;ctx.lineWidth=8;ctx.shadowColor=GR;ctx.shadowBlur=22;ctx.beginPath();ctx.ellipse(0,0,310,200,0,0,7);ctx.fill();ctx.stroke();ctx.restore();
 const gr=[[-165,-25],[20,45],[165,-35],[-35,-100]];
 const hl=win(tv,8.2,10.2,0.3);
 gr.forEach(([gx,gy],k)=>{for(let i=0;i<4;i++){const y=gy+i*24-36;ctx.save();ctx.fillStyle=`rgba(45,212,191,${0.35+0.4*hl})`;ctx.strokeStyle=TL;ctx.lineWidth=4;ctx.shadowColor=TL;ctx.shadowBlur=8+16*hl;rr(gx-62,y-9,124,18,9);ctx.fill();ctx.stroke();ctx.restore();}});
 // connecting lamellae
 ctx.save();ctx.strokeStyle='rgba(45,212,191,.5)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-105,10);ctx.lineTo(-40,45);ctx.moveTo(80,45);ctx.lineTo(125,-15);ctx.moveTo(-120,-55);ctx.lineTo(-90,-90);ctx.stroke();ctx.restore();
 callout('chloroplast',-215,-262,-250,-118,GR,tv,4.2,6.4);
 callout('thylakoid',215,-262,176,-62,TL,tv,8.2,10.2);
 callout('stroma',235,212,100,120,GD,tv,10.3,12.0);
 if(tv>=5.9&&tv<12.2){const a=ph(tv,5.9,6.4)*lin(12.2-tv+0.001,0,0.3);ctx.save();ctx.globalAlpha*=a;chip(0,232,'1  Light reactions: thylakoid',TL,1,0,44,24);ctx.restore();}
 if(tv>=7.9&&tv<12.2){const a=ph(tv,7.9,8.4)*lin(12.2-tv+0.001,0,0.3);ctx.save();ctx.globalAlpha*=a;chip(0,274,'2  Calvin cycle: stroma',GD,1,0,44,24);ctx.restore();}
 ctx.restore();}
