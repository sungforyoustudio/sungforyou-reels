"""usage: etc_make.py reeldir  -> writes reel.html (needs reeldir/cfg.js), copies fonts"""
import sys,os,shutil
D=os.path.abspath(sys.argv[1]);R='/home/claude/sungforyou-reels/engine';H=os.path.dirname(os.path.abspath(__file__))
os.makedirs(D+'/fonts',exist_ok=True)
for f in os.listdir(R+'/fonts'): shutil.copy(R+'/fonts/'+f,D+'/fonts/'+f)
mic=open(R+'/mic.svg.html').read(); js=open(H+'/etc_scene.js').read()
TR=''.join(f'<div class="tr" id="tr{i}" style="background:{c}">{n}</div>' for i,(k,n,c) in enumerate([('I','I','#4DA8FF'),('II','II','#FFB347'),('Q','Q','#E6F06B'),('III','III','#A66BFF'),('c','c','#FF8F5A'),('IV','IV','#34D6A5'),('V','ATP synthase','#FF6FB1')]))
html='''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:YT;src:url(fonts/yt.woff2)}
@font-face{font-family:M;src:url(fonts/m600.woff2);font-weight:600}
@font-face{font-family:M;src:url(fonts/m800.woff2);font-weight:800}
@font-face{font-family:M;src:url(fonts/m900.woff2);font-weight:900}
html,body{margin:0;background:#0B0820;overflow:hidden}
#st{position:relative;width:1080px;height:1920px;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#2A1F5E 0%,#15103A 55%,#0B0820 100%);font-family:M}
.neon{font-family:YT;color:#FFE3F1;text-shadow:0 0 12px #FF4FA3,0 0 30px #FF4FA3}
#hdr{position:absolute;left:90px;width:810px;top:270px;text-align:center;font-size:56px}
#trk{position:absolute;left:90px;width:810px;top:352px;display:flex;gap:8px;justify-content:center;align-items:center}
.tr{font-weight:900;font-size:25px;color:#13082f;border-radius:16px;min-width:50px;height:42px;line-height:42px;text-align:center;padding:0 12px;box-sizing:border-box;transition:none}
.tr:last-child{font-size:19px;padding:0 14px}
#panel{position:absolute;left:30px;top:410px;width:1020px;height:640px;border-radius:34px;overflow:hidden;box-shadow:0 0 0 4px rgba(255,79,163,.55),0 0 40px rgba(255,79,163,.35);background:#35185a}
#dg{display:block}
#hook{position:absolute;left:90px;width:810px;top:440px;text-align:center;z-index:6}
#hook .a{font-weight:900;font-size:46px;line-height:1.05;color:#fff;text-shadow:0 0 18px #FF4FA3,0 3px 12px rgba(0,0,0,.85)}
#hook .b{font-weight:800;font-size:30px;margin-top:10px;color:#FFD9EC;text-shadow:0 3px 10px rgba(0,0,0,.85)}
#fact{position:absolute;left:90px;width:810px;top:958px;box-sizing:border-box;padding:12px 22px;text-align:center;font-weight:800;font-size:25px;line-height:1.2;color:#fff;background:rgba(10,6,34,.82);border:2px solid rgba(255,79,163,.7);border-radius:26px;z-index:7}
#fact sub,#fact sup{font-size:.62em}#fact b{color:#FFC1DC}
#lyr{position:absolute;left:90px;width:810px;top:1080px;text-align:center;font-weight:900;line-height:1.12;color:#CFC9F2;text-shadow:0 3px 8px rgba(0,0,0,.9);z-index:8}
#lyr sub{font-size:.6em}
.w{color:#CFC9F2}.w.on{color:#fff;text-shadow:0 0 14px #FF4FA3,0 0 34px #FF4FA3,0 3px 8px rgba(0,0,0,.8)}
.pill{display:inline-block;font-weight:800;font-size:34px;color:#fff;background:#FF4FA3;border-radius:60px;padding:16px 38px;box-shadow:0 0 24px rgba(255,79,163,.8)}
#end{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 38%,#2A1F5E 0%,#15103A 55%,#0B0820 100%);opacity:0;z-index:20}
#endin{position:absolute;left:90px;width:810px;top:560px;text-align:center}
#endin .t{font-size:112px;margin-top:10px}#endin .s{font-weight:600;font-size:38px;color:#D9D4F5;margin:10px 0 40px}#endin .l{font-weight:800;font-size:38px;color:#33E6FF;margin-top:30px}
#guide{position:absolute;inset:0;display:none;z-index:30}
</style></head><body><div id="st">
<div id="hdr" class="neon">Sung For You</div>
<div id="trk">'''+TR+'''</div>
<div id="panel"><canvas id="dg" width="1020" height="640"></canvas></div>
<div id="hook"><div class="a">THE ELECTRON<br>TRANSPORT CHAIN</div><div class="b">how your cells make ATP</div></div>
<div id="fact"></div>
<div id="lyr"></div>
<div id="end"><div id="endin">'''+mic+'''<div class="neon t">Sung For You</div><div class="s">Your story, turned into a song</div><div><span class="pill">Make one for YOUR friend</span></div><div class="l">Link in bio</div></div></div>
<div id="guide"><svg width="1080" height="1920"><g fill="rgba(255,0,0,.28)"><rect x="0" y="0" width="1080" height="270"/><rect x="0" y="1250" width="1080" height="670"/><rect x="900" y="840" width="180" height="410"/><rect x="0" y="270" width="90" height="980"/></g><rect x="90" y="270" width="810" height="980" fill="none" stroke="#0f0" stroke-width="4"/></svg></div>
</div>
<script src="cfg.js"></script><script>
const GUIDES=@@GUIDES@@;if(GUIDES)document.getElementById('guide').style.display='block';
'''+js+'''
const LINES=CFG.lines.map((l,i)=>{const n=CFG.lines[i+1];const s=l.words[0][1],e=l.words[l.words.length-1][2];return {s:s-0.1,e:n?Math.min(n.words[0][1]-0.02,e+0.7):e+0.7,words:l.words,text:l.text}});
const endC=CFG.T-2.3+0.1;let lastLine=-2;
const _draw=draw;
draw=function(t){_draw(t);
 const fo=1-clamp((t-(endC-0.15))/0.3);
 let idx=-1;for(let i=0;i<LINES.length;i++){if(t>=LINES[i].s&&t<LINES[i].e)idx=i}
 const ly=$('lyr');
 if(idx!==lastLine){lastLine=idx;const L=idx>=0?LINES[idx]:null;ly.style.fontSize=(L&&L.text.length>30)?'58px':'68px';
  ly.innerHTML=L?'<div>'+L.words.map(w=>`<span class="w">${w[0]}</span>`).join(' ')+'</div>':''}
 if(idx>=0){const L=LINES[idx];ly.querySelectorAll('.w').forEach((w,i)=>{w.className='w'+(t>=L.words[i][1]-0.03?' on':'')});ly.style.opacity=clamp((t-L.s)/0.1)*fo}else ly.style.opacity=0;
 $('hdr').style.opacity=fo;$('panel').style.opacity=fo;$('trk').style.opacity=Math.min(+$('trk').style.opacity||0,1)*fo;$('fact').style.opacity=(+$('fact').style.opacity||0)*fo;
 $('end').style.opacity=clamp((t-endC)/0.5);
};
document.fonts.load('800 20px M');draw(0);
</script></body></html>'''
html=html.replace('@@GUIDES@@',str(len(sys.argv)>2 and sys.argv[2]=='guides').lower())
open(D+'/reel.html','w').write(html);print('ok',D)
