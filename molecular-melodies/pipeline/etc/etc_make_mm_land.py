"""usage: etc_make.py reeldir  -> writes reel.html (needs reeldir/cfg.js), copies fonts"""
import sys,os,shutil
D=os.path.abspath(sys.argv[1]);R='/home/claude/sungforyou-reels/engine';H=os.path.dirname(os.path.abspath(__file__))
os.makedirs(D+'/fonts',exist_ok=True)
for f in os.listdir(R+'/fonts'): shutil.copy(R+'/fonts/'+f,D+'/fonts/'+f)
mic=open(R+'/mic.svg.html').read(); js=open(H+'/etc_scene_mm.js').read()
TR=''.join(f'<div class="tr" id="tr{i}" style="background:{c}">{n}</div>' for i,(k,n,c) in enumerate([('I','I','#4DA8FF'),('II','II','#FFB347'),('Q','Q','#E6F06B'),('III','III','#A66BFF'),('c','c','#FF8F5A'),('IV','IV','#34D6A5'),('V','ATP synthase','#FF6FB1')]))
html='''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:YT;src:url(fonts/yt.woff2)}
@font-face{font-family:M;src:url(fonts/m600.woff2);font-weight:600}
@font-face{font-family:M;src:url(fonts/m800.woff2);font-weight:800}
@font-face{font-family:M;src:url(fonts/m900.woff2);font-weight:900}
html,body{margin:0;background:#06141A;overflow:hidden}
#st{position:relative;width:1920px;height:1080px;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#0E3B44 0%,#0A242C 55%,#06141A 100%);font-family:M}
.neon{font-family:M;font-weight:900;color:#EFFFFA;text-shadow:0 0 14px rgba(45,212,191,.55)}
#hdr{position:absolute;left:1420px;width:470px;top:50px;text-align:center;font-size:68px}
#trk{position:absolute;left:1420px;width:470px;top:268px;display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-items:center}
.tr{font-weight:900;font-size:25px;color:#13082f;border-radius:16px;min-width:50px;height:42px;line-height:42px;text-align:center;padding:0 12px;box-sizing:border-box;transition:none}
.tr:last-child{font-size:19px;padding:0 14px}
#panel{position:absolute;left:30px;top:30px;width:1020px;height:640px;transform:scale(1.3);transform-origin:0 0;border-radius:34px;overflow:hidden;box-shadow:0 0 0 4px rgba(45,212,191,.55),0 0 40px rgba(45,212,191,.35);background:#0f4a5a}
#dg{display:block}
#hook{position:absolute;left:30px;width:1326px;top:48px;text-align:center;z-index:6}
#hook .a{font-weight:900;font-size:64px;line-height:1.05;color:#fff;text-shadow:0 0 18px #2DD4BF,0 3px 12px rgba(0,0,0,.85)}
#hook .b{font-weight:800;font-size:40px;margin-top:10px;color:#CFFAF0;text-shadow:0 3px 10px rgba(0,0,0,.85)}
#fact{position:absolute;left:1420px;width:470px;top:410px;box-sizing:border-box;padding:18px 24px;text-align:center;font-weight:800;font-size:31px;line-height:1.2;color:#fff;background:rgba(5,20,26,.85);border:2px solid rgba(45,212,191,.7);border-radius:26px;z-index:7}
#fact sub,#fact sup{font-size:.62em}#fact b{color:#A7F3D0}
#lyr{position:absolute;left:60px;width:1800px;top:918px;text-align:center;font-weight:900;line-height:1.12;color:#BFE9E4;text-shadow:0 3px 8px rgba(0,0,0,.9);z-index:8}
#lyr sub{font-size:.6em}
.w{color:#BFE9E4}.w.on{color:#fff;text-shadow:0 0 14px #2DD4BF,0 0 34px #2DD4BF,0 3px 8px rgba(0,0,0,.8)}
.pill{display:inline-block;font-weight:800;font-size:34px;color:#06141A;background:linear-gradient(90deg,#4ADE80,#2DD4BF);border-radius:60px;padding:16px 38px;box-shadow:0 0 24px rgba(45,212,191,.8)}
#end{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 38%,#0E3B44 0%,#0A242C 55%,#06141A 100%);opacity:0;z-index:20}
#endin{position:absolute;left:460px;width:1000px;top:130px;text-align:center}
#endin .t{margin-top:10px}#endin .s{font-weight:600;font-size:38px;color:#BFE9E4;margin:10px 0 40px}#endin .l{font-weight:800;font-size:38px;color:#33E6FF;margin-top:30px}
#guide{position:absolute;inset:0;display:none;z-index:30}
</style></head><body><div id="st">
<div id="hdr" class="neon" style="display:flex;flex-direction:column;align-items:center;gap:6px;line-height:1"><svg viewBox="0 0 200 200" width="110" height="110"><defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4ADE80"/><stop offset="1" stop-color="#2DD4BF"/></linearGradient><linearGradient id="ha" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#B9F7D4"/><stop offset="1" stop-color="#7DD3FC"/></linearGradient></defs><polygon points="100.00,12.00 176.21,56.00 176.21,144.00 100.00,188.00 23.79,144.00 23.79,56.00" fill="none" stroke="url(#ga)" stroke-width="11" stroke-linejoin="round"/><g fill="url(#ha)"><rect x="41" y="89.0" width="10" height="22" rx="5"/><rect x="59" y="80.0" width="10" height="40" rx="5"/><rect x="77" y="68.0" width="10" height="64" rx="5"/><rect x="95" y="54.0" width="10" height="92" rx="5"/><rect x="113" y="68.0" width="10" height="64" rx="5"/><rect x="131" y="80.0" width="10" height="40" rx="5"/><rect x="149" y="89.0" width="10" height="22" rx="5"/></g></svg><div style="font-size:44px;margin-top:4px">Molecular Melodies</div></div>
<div id="trk">'''+TR+'''</div>
<div id="panel"><canvas id="dg" width="1020" height="640"></canvas></div>
<div id="hook"><div class="a">THE ELECTRON<br>TRANSPORT CHAIN</div><div class="b">how your cells make ATP</div></div>
<div id="fact"></div>
<div id="lyr"></div>
<div id="end"><div id="endin"><svg viewBox="0 0 200 200" width="260" height="260"><defs><linearGradient id="gb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4ADE80"/><stop offset="1" stop-color="#2DD4BF"/></linearGradient><linearGradient id="hb" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#B9F7D4"/><stop offset="1" stop-color="#7DD3FC"/></linearGradient></defs><polygon points="100.00,12.00 176.21,56.00 176.21,144.00 100.00,188.00 23.79,144.00 23.79,56.00" fill="none" stroke="url(#gb)" stroke-width="11" stroke-linejoin="round"/><g fill="url(#hb)"><rect x="41" y="89.0" width="10" height="22" rx="5"/><rect x="59" y="80.0" width="10" height="40" rx="5"/><rect x="77" y="68.0" width="10" height="64" rx="5"/><rect x="95" y="54.0" width="10" height="92" rx="5"/><rect x="113" y="68.0" width="10" height="64" rx="5"/><rect x="131" y="80.0" width="10" height="40" rx="5"/><rect x="149" y="89.0" width="10" height="22" rx="5"/></g></svg><div class="neon t" style="font-size:84px">Molecular Melodies</div><div class="s">Science, set to music</div><div><span class="pill">Follow for more science songs</span></div><div class="l">@molecularmelodies</div></div></div>
<div id="guide"><svg width="1920" height="1080"><g fill="rgba(255,0,0,.28)"><rect x="0" y="0" width="1080" height="270"/><rect x="0" y="1250" width="1080" height="670"/><rect x="900" y="840" width="180" height="410"/><rect x="0" y="270" width="90" height="980"/></g><rect x="90" y="270" width="810" height="980" fill="none" stroke="#0f0" stroke-width="4"/></svg></div>
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
 if(idx!==lastLine){lastLine=idx;const L=idx>=0?LINES[idx]:null;ly.style.fontSize=(L&&L.text.length>34)?'66px':'78px';
  ly.innerHTML=L?'<div>'+L.words.map(w=>`<span class="w">${w[0]}</span>`).join(' ')+'</div>':''}
 if(idx>=0){const L=LINES[idx];ly.querySelectorAll('.w').forEach((w,i)=>{w.className='w'+(t>=L.words[i][1]-0.03?' on':'')});ly.style.opacity=clamp((t-L.s)/0.1)*fo}else ly.style.opacity=0;
 $('hdr').style.opacity=fo;$('panel').style.opacity=fo;$('trk').style.opacity=Math.min(+$('trk').style.opacity||0,1)*fo;$('fact').style.opacity=(+$('fact').style.opacity||0)*fo;
 $('end').style.opacity=clamp((t-endC)/0.5);
};
document.fonts.load('800 20px M');draw(0);
</script></body></html>'''
html=html.replace('@@GUIDES@@',str(len(sys.argv)>2 and sys.argv[2]=='guides').lower())
open(D+'/reel.html','w').write(html);print('ok',D)
