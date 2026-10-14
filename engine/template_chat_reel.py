style=open('/home/claude/reels/common/base_style.css').read()
endblk=open('/home/claude/reels/common/base_end.html').read()
extra="""
.phone{position:absolute;left:190px;top:485px;width:700px;height:895px;border-radius:70px;border:7px solid #FFD6EA;background:rgba(14,18,54,.92);box-shadow:0 0 28px #FF4FA3,0 0 70px rgba(255,79,163,.5),inset 0 0 26px rgba(255,79,163,.35);overflow:hidden}
.ph-head{position:absolute;left:0;right:0;top:0;height:130px;background:rgba(11,8,32,.95);border-bottom:3px solid rgba(255,214,234,.35);display:flex;align-items:center;padding:0 40px}
.av{width:78px;height:78px;border-radius:50%;background:#FF4FA3;display:flex;align-items:center;justify-content:center;font-size:42px;box-shadow:0 0 22px #FF4FA3}
.ph-name{margin-left:22px;font-weight:900;font-size:40px}.ph-sub{font-weight:700;font-size:27px;color:#C9F8FF}
.cb{position:absolute;max-width:610px;padding:18px 28px;border-radius:44px;font-weight:800;font-size:37px;line-height:1.15;opacity:0}
.cb.l{background:#2B2B5E;color:#fff;border:3px solid rgba(201,248,255,.5);border-bottom-left-radius:12px;box-shadow:0 0 20px rgba(51,230,255,.25)}
.cb.r{background:#FF4FA3;color:#fff;border-bottom-right-radius:12px;box-shadow:0 0 30px rgba(255,79,163,.7)}
.dots{position:absolute;padding:24px 34px;border-radius:44px;background:#2B2B5E;border:3px solid rgba(201,248,255,.5);opacity:0;border-bottom-left-radius:12px}
.dots i{display:inline-block;width:18px;height:18px;margin:0 6px;border-radius:50%;background:#C9F8FF}
#decode{position:absolute;left:55px;top:250px;width:580px;height:400px;border-radius:50px;background:rgba(11,8,32,.96);border:5px solid #FF4FA3;box-shadow:0 0 40px #FF4FA3,0 0 100px rgba(255,79,163,.5);display:flex;align-items:center;justify-content:center;text-align:center;opacity:0;flex-direction:column}
#decode .a{font-weight:900;font-size:54px;line-height:1.15;padding:0 30px}
#decode .b{font-weight:900;font-size:110px;line-height:1.05;color:#FFE3F1;text-shadow:0 0 18px #FF4FA3,0 0 50px #FF4FA3,0 0 110px #C2187A;position:absolute;opacity:0}
#decode .eq{position:absolute;top:-62px;font-weight:800;font-size:34px;color:#C9F8FF;text-shadow:0 0 12px #33E6FF;opacity:0;letter-spacing:.06em}
#rcpt{position:absolute;font-weight:700;font-size:26px;color:#C9F8FF;opacity:0}
.hr{position:absolute;color:#FF4FA3;text-shadow:0 0 14px #FF4FA3;font-weight:900}
"""
body="""
<div class="frame" id="frame"></div>
<svg id="svg" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"><g id="parts"></g></svg>
<div id="hdr" class="neon">Sung For You</div>
<div id="hook"><div class="a">POV: YOU FORGOT TO TEXT MOM</div><div class="b">THAT YOU GOT HOME</div></div>
<div id="chip"><span>&#9835; Text Me When You Get Home</span></div>
<div class="phone" id="phone">
 <div class="ph-head"><div class="av">&#10084;</div><div><div class="ph-name">Mom</div><div class="ph-sub" id="psub">online</div></div></div>
 <div id="chat"></div>
 <div id="decode"><div class="eq" id="eq">WHAT SHE REALLY MEANS</div><div class="a" id="da">Text me when you get home</div><div class="b" id="db">I love you &#10084;</div></div>
 <div id="rcpt">Delivered</div>
</div>
<div id="lyr"></div>
<div id="tag"><span class="pill" id="tagp">Send this to your mom &#129402;</span></div>
"""
script="""
<script src="cfg.js"></script>
<script>
const TOTAL=CFG.T, EV=CFG.ev, BEAT=60/72;
const LINES=CFG.lines.map((l,i)=>{const n=CFG.lines[i+1];const s=l.words[0][1],e=l.words[l.words.length-1][2];
 return {s:s-0.12,e:n?Math.min(n.words[0][1]-0.02,e+0.6):e+0.6,words:l.words,text:l.text}});
const BUBS=CFG.bubs;
const $=id=>document.getElementById(id);
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>1-Math.pow(1-clamp(x),3);
function rnd(i){const s=Math.sin(i*127.1+311.7)*43758.5453;return s-Math.floor(s)}
(function(){
 let p='';for(let i=0;i<30;i++){const c=i%2?'#FF4FA3':'#FFB3D9';p+=`<text id="pt${i}" font-size="${28+rnd(i)*40}" font-family="M" fill="${c}" opacity=".35">&#9829;</text>`}
 $('parts').innerHTML=p;
 let h='';BUBS.forEach((b,i)=>{const px=b[1]=='l'?'left:34px':'right:34px';
  h+=`<div class="dots" id="dt${i}" style="${px};top:${b[3]-485-10}px"><i></i><i></i><i></i></div><div class="cb ${b[1]}" id="cb${i}" style="${px};top:${b[3]-485}px">${b[2]}</div>`});
 $('chat').innerHTML=h;
})();
function hit(t){const B=CFG.beats;let lo=0,hi=B.length-1,k=-1;while(lo<=hi){const m=(lo+hi)>>1;if(B[m]<=t){k=m;lo=m+1}else hi=m-1}
 if(k<0)return 0;const ph=(t-B[k])/BEAT;return ph>1.5?0:Math.exp(-ph*4)}
let lastLine=-2;
function draw(t){
 const H=hit(t);
 for(let i=0;i<30;i++){const sp=22+rnd(i+2)*40;const y=(1960-((t*sp+rnd(i)*2000)%1960));const x=40+rnd(i+1)*1000+Math.sin(t*.7+i)*26;const e=$('pt'+i);e.setAttribute('x',x);e.setAttribute('y',y)}
 $('frame').style.boxShadow=`0 0 ${24+H*26}px #FF4FA3,0 0 ${64+H*36}px rgba(255,79,163,.6),inset 0 0 ${24+H*14}px #FF4FA3`;
 const hk=$('hook');const hv=t<0.25?0:(t<3.6?1:1-clamp((t-3.6)/0.4));hk.style.opacity=hv;hk.style.transform=`scale(${1+(1-hv)*.05})`;
 $('chip').style.opacity=clamp((t-3.7)/0.4);
 const ph=$('phone');ph.style.transform=`translateY(${Math.sin(t*1.1)*8}px)`;ph.style.opacity=clamp((t-0.1)/0.4);
 const dimk=clamp((t-(EV.b0-0.3))/0.5)*(1-clamp((t-(EV.back-0.2))/0.5)); // chat dims during decode
 const dimEnd=clamp((t-(EV.back-0.2))/0.5);
 BUBS.forEach((b,i)=>{const e=$('cb'+i),d=$('dt'+i);const x=t-b[0];const isReply=b[1]=='r';
  // typing dots 0.7s before each mom message
  const dx=t-(b[0]-0.7);d.style.opacity=(!isReply&&dx>0&&x<0)?clamp(dx/.15):0;
  if(!isReply)for(let k=0;k<3;k++)d.children[k].style.transform=`translateY(${Math.sin(t*9+k*1.2)*-7}px)`;
  if(x<0){e.style.opacity=0;return}
  const s=1+Math.max(0,.18-x*.9)*Math.cos(x*14)*0;const pop=x<.3?(1+Math.sin(x/.3*Math.PI)*.12):1;
  let a=clamp(x/0.12);
  if(!isReply)a*=(1-0.82*dimk);
  e.style.opacity=a;e.style.transform=`scale(${pop}) translateY(${(1-ease(x/0.3))*30}px)`});
 // decode card
 const dc=$('decode');const dv=clamp((t-EV.b0)/0.4)*(1-clamp((t-(EV.back-0.1))/0.4));dc.style.opacity=dv;
 dc.style.transform=`scale(${.92+.08*ease((t-EV.b0)/0.5)+H*.015})`;
 const sw=clamp((t-EV.iloveyou)/0.35);
 $('da').style.opacity=1-sw;$('da').style.transform=`scale(${1-sw*.2})`;
 $('db').style.opacity=sw;$('db').style.transform=`scale(${.7+.3*ease(sw)+H*.04})`;
 $('eq').style.opacity=clamp((t-(EV.iloveyou-0.3))/0.4);
 // hearts burst around card
 // reply receipt
 const rp=BUBS[BUBS.length-1];const rcx=t-rp[0];$('rcpt').style.opacity=0;
 $('psub').textContent=(t>=EV.back&&t<rp[0])?'typing...':(t>=rp[0]?'read':'online');
 // lyrics
 let idx=-1;for(let i=0;i<LINES.length;i++){if(t>=LINES[i].s&&t<LINES[i].e)idx=i}
 const ly=$('lyr');
 if(idx!==lastLine){lastLine=idx;const L=idx>=0?LINES[idx]:null;ly.style.fontSize=(L&&L.text.length>44)?'58px':((L&&L.text.length>30)?'66px':'76px');
  ly.innerHTML=L?'<div>'+L.words.map(w=>`<span class="w">${w[0]}</span>`).join(' ')+'</div>':''}
 if(idx>=0){const L=LINES[idx];const ws=ly.querySelectorAll('.w');
  ws.forEach((w,i)=>{w.className='w'+(t>=L.words[i][1]-0.03?' on':'')});
  const age=t-L.s;ly.style.transform=`scale(${1+Math.max(0,.08-age*.4)})`;ly.style.opacity=clamp(age/0.1)}
 else ly.style.opacity=0;
 const endC=EV.endsong+0.1;
 $('tag').style.opacity=clamp((t-4)/0.4)*(1-clamp((t-(endC-0.2))/0.3));$('tagp').style.transform=`scale(${1+H*.04})`;
 $('foot').style.opacity=1-clamp((t-(endC-0.2))/0.3);
 $('hdr').style.opacity=1-clamp((t-(endC-0.2))/0.3);
 $('phone').style.opacity=clamp((t-0.1)/0.4)*(1-clamp((t-(endC-0.2))/0.3));
 $('end').style.opacity=clamp((t-endC)/0.5);
}
</script>"""
open('/home/claude/reels/mom/reel.html','w').write('<!doctype html><html><head><meta charset="utf-8"><style>'+style+extra+'</style></head><body>'+body+endblk+script+'</body></html>')
