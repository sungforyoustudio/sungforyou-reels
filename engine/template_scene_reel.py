"""Scene reel v2: a new generated image every ~2-3s keyed to the lyrics, all text inside platform safe zones.
usage: template_scene_reel.py params.json   (dir must hold cfg.js; writes dir/reel.html, copies scenes + fonts)
params: dir, scenes_dir, scenes:[{t,img,emoji}], hook_a, hook_b, tag, bpm, guides(optional bool)
SAFE ZONES (1080x1920, strictest of IG/FB/TikTok): text box x 90..900, y 270..1250.
 top 270 (Meta 14%, TikTok 240) | bottom 670 (Meta 35%, TikTok 660) | right icon column 180 (TikTok, y>840) | left 90.
 IG grid crop is 3:4 centre (y 240..1680): hook/title content stays in it. Backgrounds may bleed full frame."""
import sys,json,os,shutil,re
P=json.load(open(sys.argv[1])); D=P['dir']; E=os.path.dirname(os.path.abspath(__file__))
os.makedirs(D+'/scenes',exist_ok=True); os.makedirs(D+'/fonts',exist_ok=True)
for s in P['scenes']: shutil.copy(P['scenes_dir']+'/'+s['img'],D+'/scenes/'+s['img'])
for f in os.listdir(E+'/fonts'): shutil.copy(E+'/fonts/'+f,D+'/fonts/'+f)
mic=open(E+'/mic.svg.html').read()
imgs=''.join(f'<img class="ph" id="p{i}" src="scenes/{s["img"]}">' for i,s in enumerate(P['scenes']))
stk=''.join(f'<div class="stk" id="k{i}">{s.get("emoji","")}</div>' for i,s in enumerate(P['scenes']))
html='''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:YT;src:url(fonts/yt.woff2)}
@font-face{font-family:M;src:url(fonts/m600.woff2);font-weight:600}
@font-face{font-family:M;src:url(fonts/m800.woff2);font-weight:800}
@font-face{font-family:M;src:url(fonts/m900.woff2);font-weight:900}
html,body{margin:0;background:#0B0820;overflow:hidden}
#st{position:relative;width:1080px;height:1920px;overflow:hidden;background:#0B0820;font-family:M}
.ph{position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;opacity:0;will-change:transform,opacity}
#shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,8,32,.7) 0%,rgba(11,8,32,.25) 16%,rgba(11,8,32,0) 32%,rgba(11,8,32,0) 46%,rgba(11,8,32,.55) 60%,rgba(11,8,32,.82) 72%,rgba(11,8,32,.5) 84%,rgba(11,8,32,.3) 100%)}
#fx{position:absolute;inset:0}
#flash{position:absolute;inset:0;background:#fff;opacity:0}
.neon{font-family:YT;color:#FFE3F1;text-shadow:0 0 12px #FF4FA3,0 0 30px #FF4FA3}
#hdr{position:absolute;left:90px;width:810px;top:282px;text-align:center;font-size:62px}
#hook{position:absolute;left:90px;width:810px;top:430px;text-align:center}
#hook .a{font-weight:900;font-size:50px;color:#fff;letter-spacing:1px;text-shadow:0 4px 14px rgba(0,0,0,.8)}
#hook .b{font-weight:900;font-size:84px;line-height:1.02;margin-top:10px;color:#fff;text-shadow:0 0 18px #FF4FA3,0 0 40px #FF4FA3,0 4px 12px rgba(0,0,0,.8)}
#tag{position:absolute;left:90px;width:810px;top:368px;text-align:center}
.pill{display:inline-block;font-weight:800;font-size:34px;color:#fff;background:#FF4FA3;border-radius:60px;padding:16px 38px;box-shadow:0 0 24px rgba(255,79,163,.8)}
.stk{position:absolute;width:170px;text-align:center;top:650px;font-size:150px;line-height:1;opacity:0;font-family:"Noto Color Emoji";filter:drop-shadow(0 8px 18px rgba(0,0,0,.5))}
#lyr{position:absolute;left:90px;width:810px;top:1068px;text-align:center;font-weight:900;line-height:1.12;color:#CFC9F2;text-shadow:0 3px 8px rgba(0,0,0,.9);transform-origin:50% 50%}
.w{color:#CFC9F2}.w.on{color:#fff;text-shadow:0 0 14px #FF4FA3,0 0 34px #FF4FA3,0 3px 8px rgba(0,0,0,.8)}
#end{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 38%,#2A1F5E 0%,#15103A 55%,#0B0820 100%);opacity:0}
#endin{position:absolute;left:90px;width:810px;top:560px;text-align:center}
#endin .t{font-size:112px;margin-top:10px}#endin .s{font-weight:600;font-size:38px;color:#D9D4F5;margin:10px 0 40px}#endin .l{font-weight:800;font-size:38px;color:#33E6FF;margin-top:30px}
#guide{position:absolute;inset:0;display:none}
#shade{z-index:10}#fx{z-index:11}.stk{z-index:12}#hdr,#hook,#tag,#lyr{z-index:13}#flash{z-index:14}#end{z-index:15}#guide{z-index:16}
</style></head><body><div id="st">'''+imgs+'''<div id="shade"></div><canvas id="fx" width="1080" height="1920"></canvas>'''+stk+'''
<div id="hdr" class="neon">Sung For You</div>
<div id="hook"><div class="a">@@HA@@</div><div class="b">@@HB@@</div></div>
<div id="tag"><span class="pill" id="tagp">@@TAG@@</span></div>
<div id="lyr"></div><div id="flash"></div>
<div id="end"><div id="endin">'''+mic+'''<div class="neon t">Sung For You</div><div class="s">Your story, turned into a song</div><div><span class="pill">Make one for YOUR friend</span></div><div class="l">Link in bio</div></div></div>
<div id="guide"><svg width="1080" height="1920"><g fill="rgba(255,0,0,.28)"><rect x="0" y="0" width="1080" height="270"/><rect x="0" y="1250" width="1080" height="670"/><rect x="900" y="840" width="180" height="410"/><rect x="0" y="270" width="90" height="980"/></g><rect x="90" y="270" width="810" height="980" fill="none" stroke="#0f0" stroke-width="4"/><rect x="0" y="240" width="1080" height="1440" fill="none" stroke="#ff0" stroke-width="3" stroke-dasharray="14 10"/></svg></div>
</div>
<script src="cfg.js"></script><script>
const BEAT=60/@@BPM@@,SC=@@SCENES@@,GUIDES=@@GUIDES@@,PULSE=@@PULSE@@,SPARK=@@SPARK@@,XF=@@XF@@,GENTLE=@@GENTLE@@,TOPL=@@TOPL@@;
const $=id=>document.getElementById(id),clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=p=>p<0?0:p>1?1:p*p*(3-2*p);
if(GUIDES)$('guide').style.display='block';
const LINES=CFG.lines.map((l,i)=>{const n=CFG.lines[i+1];const s=l.words[0][1],e=l.words[l.words.length-1][2];
 return {s:s-0.12,e:n?Math.min(n.words[0][1]-0.02,e+0.6):e+0.6,words:l.words,text:l.text}});
const endC=CFG.T-2.3+0.1;
const ST=SC.map((s,i)=>({a:s.t,b:i==SC.length-1?endC:SC[i+1].t}));
// motion presets [scale0,scale1,x0,x1,y0,y1]; neighbours always move differently
const MO=GENTLE?[[1.0,1.05,0,0,0,0],[1.06,1.0,0,0,0,0]]:[[1.06,1.22,0,0,0,-40],[1.24,1.07,0,0,-30,10],[1.2,1.2,-60,60,0,0],[1.2,1.2,60,-60,0,0],[1.08,1.24,40,-30,30,-20],[1.22,1.08,-40,30,-20,20]];
function hit(t){const B=CFG.beats;let lo=0,hi=B.length-1,k=-1;while(lo<=hi){const m=(lo+hi)>>1;if(B[m]<=t){k=m;lo=m+1}else hi=m-1}
 if(k<0)return 0;const ph=(t-B[k])/BEAT;return ph>1.5?0:Math.exp(-ph*4)}
function rnd(n){const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x)}
const fx=$('fx').getContext('2d');
function sparkles(t,H){fx.clearRect(0,0,1080,1920);
 for(let i=0;i<46;i++){const sp=0.25+rnd(i)*0.5,x=(rnd(i+9)*1080+Math.sin(t*0.6+i)*30)%1080,y=1920-((t*sp*140+rnd(i+3)*1920)%1920);
  const tw=0.5+0.5*Math.sin(t*3+i*2),r=2+rnd(i+5)*5+H*3;fx.globalAlpha=0.25+0.55*tw;fx.fillStyle=i%3?'#FFE3F1':'#FFD23F';
  fx.beginPath();fx.arc(x,y,r,0,7);fx.fill()}
 fx.globalAlpha=1}
let lastLine=-2;
function draw(t){
 const H=PULSE?hit(t):0,fo=1-clamp((t-(endC-0.15))/0.3);
 let cur=0;for(let i=0;i<ST.length;i++)if(t>=ST[i].a)cur=i;
 for(let i=0;i<ST.length;i++){const e=$('p'+i),S=ST[i];let op=0;
  if(i==cur)op=(i==0||XF<=0)?1:clamp((t-S.a)/XF);
  else if(i==cur-1&&t<ST[cur].a+XF)op=1;
  const m=MO[i%MO.length],k=clamp((t-S.a)/Math.max(0.5,S.b-S.a)),z=m[0]+(m[1]-m[0])*k+H*0.025;
  e.style.opacity=op*fo;e.style.zIndex=i==cur?2:1;
  e.style.transform=`translate(${m[2]+(m[3]-m[2])*k}px,${m[4]+(m[5]-m[4])*k}px) scale(${z})`}
 let f=0;for(const S of ST){const d=t-S.a;if(PULSE&&d>=0&&d<0.16&&S.a>0.1)f=Math.max(f,(1-d/0.16)*0.35)}$('flash').style.opacity=f*fo;
 if(SPARK){sparkles(t,H);$('fx').style.opacity=fo}
 for(let i=0;i<ST.length;i++){const k=$('k'+i),d=t-(ST[i].a+0.12),L=ST[i].b-ST[i].a;
  if(d<0||t>=ST[i].b){k.style.opacity=0;continue}
  const pop=d<0.3?(1+0.5*Math.sin(d/0.3*Math.PI))*ease(d/0.15):1,outp=clamp((L-0.12-d)/0.2);
  k.style.left=(i%2?680:240)+'px';k.style.opacity=clamp(outp)*fo;k.style.transform=`scale(${pop*(1+H*.05)}) rotate(${(i%2?-1:1)*(8-6*ease(d/0.4))}deg)`}
 $('hook').style.opacity=t<0.2?0:(t<3.4?1:1-clamp((t-3.4)/0.4));
 $('tag').style.opacity=clamp((t-3.7)/0.4)*fo;$('tagp').style.transform=`scale(${1+H*.04})`;
 $('hdr').style.opacity=fo;$('shade').style.opacity=fo;
 let idx=-1;for(let i=0;i<LINES.length;i++){if(t>=LINES[i].s&&t<LINES[i].e)idx=i}
 const ly=$('lyr');
 if(idx!==lastLine){lastLine=idx;const L=idx>=0?LINES[idx]:null;ly.style.fontSize=(L&&L.text.length>34)?'64px':'76px';
  ly.innerHTML=L?'<div>'+L.words.map(w=>`<span class="w">${w[0]}</span>`).join(' ')+'</div>':''}
 if(idx>=0){const L=LINES[idx];const ws=ly.querySelectorAll('.w');ws.forEach((w,i)=>{w.className='w'+(t>=L.words[i][1]-0.03?' on':'')});
  const age=t-L.s;ly.style.transform=`scale(${1+Math.max(0,.08-age*.4)})`;ly.style.opacity=clamp(age/0.1)*fo}else ly.style.opacity=0;
 ly.style.top=(TOPL.indexOf(idx)>=0)?'478px':'1068px';
 $('end').style.opacity=clamp((t-endC)/0.5);
}
draw(0);
</script></body></html>'''
html=html.replace('@@BPM@@',str(P['bpm'])).replace('@@SCENES@@',json.dumps(P['scenes'])).replace('@@GUIDES@@',str(P.get('guides',False)).lower()).replace('@@TOPL@@',json.dumps(P.get('top_lines',[]))).replace('@@PULSE@@',str(P.get('pulse',False)).lower()).replace('@@SPARK@@',str(P.get('sparkles',False)).lower()).replace('@@XF@@',str(P.get('xf',0))).replace('@@GENTLE@@',str(P.get('gentle',True)).lower())
for k,v in [('@@HA@@',P['hook_a']),('@@HB@@',P['hook_b']),('@@TAG@@',P['tag'])]: html=html.replace(k,v)
open(D+'/reel.html','w').write(html); print('ok')
