style=open('/home/claude/reels/common/base_style.css').read()
endblk=open('/home/claude/reels/common/base_end.html').read()
extra="""
.ph{position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover;opacity:0;will-change:transform}
#shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,8,32,.78) 0%,rgba(11,8,32,.15) 22%,rgba(11,8,32,0) 45%,rgba(11,8,32,.55) 68%,rgba(11,8,32,.92) 100%)}
#flash{position:absolute;inset:0;background:#fff;opacity:0}
#cap{position:absolute;left:70px;right:70px;top:1110px;text-align:center;font-weight:900;font-size:64px;line-height:1.12;opacity:0;color:#FFE3F1;text-shadow:0 0 14px #FF4FA3,0 0 34px #FF4FA3,0 3px 6px rgba(0,0,0,.8)}
#hook .b{font-size:84px !important}
#lyr{text-shadow:0 3px 8px rgba(0,0,0,.85)}
.w.on{text-shadow:0 0 14px #FF4FA3,0 0 34px #FF4FA3,0 3px 8px rgba(0,0,0,.8)}
.w{color:#CFC9F2}
"""
body="""
<img class="ph" id="p0" src="photos/door_cocker.jpg"><img class="ph" id="p1" src="photos/door_retriever.jpg"><img class="ph" id="p2" src="photos/sad_eyes.jpg"><img class="ph" id="p3" src="photos/shoe_chew1.jpg"><img class="ph" id="p4" src="photos/shoe_chew2.jpg">
<div id="shade"></div>
<div class="frame" id="frame"></div>
<svg id="svg" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"><g id="parts"></g></svg>
<div id="hdr" class="neon">Sung For You</div>
<div id="hook"><div class="a">TAG A DOG OWNER</div><div class="b">YOUR DOG WHEN YOU LEAVE FOR 4 MINUTES</div></div>
<div id="chip"><span>&#9835; Please Don't Go</span></div>
<div id="cap">(he is already looking at your shoe)</div>
<div id="lyr"></div>
<div id="flash"></div>
<div id="tag"><span class="pill" id="tagp">Send this to a dog owner &#128054;</span></div>
"""
script="""
<script src="cfg.js"></script>
<script>
const EV=CFG.ev, BEAT=60/100;
const LINES=CFG.lines.map((l,i)=>{const n=CFG.lines[i+1];const s=l.words[0][1],e=l.words[l.words.length-1][2];
 return {s:s-0.12,e:n?Math.min(n.words[0][1]-0.02,e+0.6):e+0.6,words:l.words,text:l.text}});
const $=id=>document.getElementById(id);
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>1-Math.pow(1-clamp(x),3);
// photo schedule: [id, start, end, zoom0, zoom1, panx0, panx1]
const SCH=[[0,0,7.83,1.04,1.16,-14,10],[1,7.83,14.87,1.05,1.17,12,-12],[2,14.87,24.7,1.04,1.22,0,0],[3,24.7,25.68,1.10,1.20,-20,10],[4,25.68,27.4,1.10,1.22,16,-14]];
function hit(t){const B=CFG.beats;let lo=0,hi=B.length-1,k=-1;while(lo<=hi){const m=(lo+hi)>>1;if(B[m]<=t){k=m;lo=m+1}else hi=m-1}
 if(k<0)return 0;const ph=(t-B[k])/BEAT;return ph>1.5?0:Math.exp(-ph*4)}
let lastLine=-2;
function draw(t){
 const H=hit(t), endC=EV.endsong+0.1;
 $('frame').style.boxShadow=`0 0 ${24+H*26}px #FF4FA3,0 0 ${64+H*36}px rgba(255,79,163,.6),inset 0 0 ${24+H*14}px #FF4FA3`;
 for(let i=0;i<5;i++){const e=$('p'+i);const S=SCH.find(x=>x[0]===i);const a=S[1],b=S[2];
  if(t<a-0.001||t>=b){e.style.opacity=0;continue}
  const k=(t-a)/(b-a);const z=S[3]+(S[4]-S[3])*k;e.style.opacity=1;
  e.style.transform=`translateX(${S[5]+(S[6]-S[5])*k}px) scale(${z})`}
 // flash on hard cuts
 let f=0;for(const c of [EV.okay,EV.okay2,EV.door2,EV.please]){const d=t-c;if(d>=0&&d<0.18)f=Math.max(f,(1-d/0.18)*(c===EV.okay?0.75:0.4))}
 $('flash').style.opacity=f;
 const hv=t<0.2?0:(t<3.6?1:1-clamp((t-3.6)/0.4));$('hook').style.opacity=hv;
 $('chip').style.opacity=clamp((t-3.7)/0.4)*(1-clamp((t-(endC-0.2))/0.3));
 // gap caption
 $('cap').style.opacity=clamp((t-(EV.gap+0.5))/0.4)*(1-clamp((t-(EV.okay-0.25))/0.2));
 // lyrics
 let idx=-1;for(let i=0;i<LINES.length;i++){if(t>=LINES[i].s&&t<LINES[i].e)idx=i}
 const ly=$('lyr');
 if(idx!==lastLine){lastLine=idx;const L=idx>=0?LINES[idx]:null;ly.style.fontSize=(L&&L.text.length>34)?'62px':'76px';
  ly.innerHTML=L?'<div>'+L.words.map(w=>`<span class="w">${w[0]}</span>`).join(' ')+'</div>':''}
 if(idx>=0){const L=LINES[idx];const ws=ly.querySelectorAll('.w');
  ws.forEach((w,i)=>{w.className='w'+(t>=L.words[i][1]-0.03?' on':'')});
  const age=t-L.s;ly.style.transform=`scale(${1+Math.max(0,.08-age*.4)})`;ly.style.opacity=clamp(age/0.1)}
 else ly.style.opacity=0;
 ly.style.top=(idx===1)?'430px':'1400px';
 const fo=1-clamp((t-(endC-0.2))/0.3);
 $('tag').style.opacity=clamp((t-4)/0.4)*fo;$('tagp').style.transform=`scale(${1+H*.04})`;
 $('foot').style.opacity=fo;$('hdr').style.opacity=fo;$('shade').style.opacity=fo;$('frame').style.opacity=fo;
 for(let i=0;i<5;i++){const e=$('p'+i);e.style.opacity=parseFloat(e.style.opacity)*fo}
 $('end').style.opacity=clamp((t-endC)/0.5);
}
</script>"""
open('/home/claude/reels/dog2/reel.html','w').write('<!doctype html><html><head><meta charset="utf-8"><style>'+style+extra+'</style></head><body>'+body+endblk+script+'</body></html>')
