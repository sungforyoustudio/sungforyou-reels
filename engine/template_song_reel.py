"""Generic photo + lyric reel. usage: template_song_reel.py params.json
params: dir, photos:[file,...], cuts:[line index where each photo after the first starts], hook_a, hook_b, chip, tag, bpm, flip_top:[line idx shown at top]"""
import sys,json,os,shutil
P=json.load(open(sys.argv[1])); D=P['dir']
style=open('/home/claude/reels/common/base_style.css').read()
endblk=open('/home/claude/reels/common/base_end.html').read()
os.makedirs(D+'/photos',exist_ok=True)
for f in P['photos']: shutil.copy('/home/claude/sungforyou-reels/stock/songs/'+f,D+'/photos/'+f)
if not os.path.exists(D+'/fonts'): os.symlink('/home/claude/reels/dog2/fonts',D+'/fonts')
imgs=''.join(f'<img class="ph" id="p{i}" src="photos/{f}">' for i,f in enumerate(P['photos']))
extra="""
.ph{position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover;opacity:0;will-change:transform}
#shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,8,32,.78) 0%,rgba(11,8,32,.15) 22%,rgba(11,8,32,0) 45%,rgba(11,8,32,.55) 68%,rgba(11,8,32,.92) 100%)}
#flash{position:absolute;inset:0;background:#fff;opacity:0}
#lyr{text-shadow:0 3px 8px rgba(0,0,0,.85)}
.w.on{text-shadow:0 0 14px #FF4FA3,0 0 34px #FF4FA3,0 3px 8px rgba(0,0,0,.8)}
.w{color:#CFC9F2}
"""
body=f"""
{imgs}
<div id="shade"></div>
<div class="frame" id="frame"></div>
<svg id="svg" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"><g id="parts"></g></svg>
<div id="hdr" class="neon">Sung For You</div>
<div id="hook"><div class="a">{P['hook_a']}</div><div class="b">{P['hook_b']}</div></div>
<div id="chip"><span>&#9835; {P['chip']}</span></div>
<div id="lyr"></div>
<div id="flash"></div>
<div id="tag"><span class="pill" id="tagp">{P['tag']}</span></div>
"""
script="""
<script src="cfg.js"></script>
<script>
const BEAT=60/@@BPM@@, N=@@N@@, CUTS=@@CUTS@@, TOPL=@@TOP@@;
const LINES=CFG.lines.map((l,i)=>{const n=CFG.lines[i+1];const s=l.words[0][1],e=l.words[l.words.length-1][2];
 return {s:s-0.12,e:n?Math.min(n.words[0][1]-0.02,e+0.6):e+0.6,words:l.words,text:l.text}});
const $=id=>document.getElementById(id);
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const endC=CFG.T-2.3+0.1;
const cutT=CUTS.map(i=>LINES[i].s);
const SCH=[];for(let i=0;i<N;i++){const a=i==0?0:cutT[i-1],b=i==N-1?endC:cutT[i];SCH.push([a,b,1.04+0.02*(i%2),1.16+0.03*(i%3),(i%2?12:-12),(i%2?-12:12)])}
function hit(t){const B=CFG.beats;let lo=0,hi=B.length-1,k=-1;while(lo<=hi){const m=(lo+hi)>>1;if(B[m]<=t){k=m;lo=m+1}else hi=m-1}
 if(k<0)return 0;const ph=(t-B[k])/BEAT;return ph>1.5?0:Math.exp(-ph*4)}
let lastLine=-2;
function draw(t){
 const H=hit(t);
 $('frame').style.boxShadow=`0 0 ${24+H*26}px #FF4FA3,0 0 ${64+H*36}px rgba(255,79,163,.6),inset 0 0 ${24+H*14}px #FF4FA3`;
 for(let i=0;i<N;i++){const e=$('p'+i),S=SCH[i];if(t<S[0]-0.001||t>=S[1]){e.style.opacity=0;continue}
  const k=(t-S[0])/(S[1]-S[0]);e.style.opacity=1;e.style.transform=`translateX(${S[4]+(S[5]-S[4])*k}px) scale(${S[2]+(S[3]-S[2])*k})`}
 let f=0;for(const c of cutT){const d=t-c;if(d>=0&&d<0.18)f=Math.max(f,(1-d/0.18)*0.4)}
 $('flash').style.opacity=f;
 const hv=t<0.2?0:(t<3.6?1:1-clamp((t-3.6)/0.4));$('hook').style.opacity=hv;
 $('chip').style.opacity=clamp((t-3.7)/0.4)*(1-clamp((t-(endC-0.2))/0.3));
 let idx=-1;for(let i=0;i<LINES.length;i++){if(t>=LINES[i].s&&t<LINES[i].e)idx=i}
 const ly=$('lyr');
 if(idx!==lastLine){lastLine=idx;const L=idx>=0?LINES[idx]:null;ly.style.fontSize=(L&&L.text.length>34)?'62px':'76px';
  ly.innerHTML=L?'<div>'+L.words.map(w=>`<span class="w">${w[0]}</span>`).join(' ')+'</div>':''}
 if(idx>=0){const L=LINES[idx];const ws=ly.querySelectorAll('.w');
  ws.forEach((w,i)=>{w.className='w'+(t>=L.words[i][1]-0.03?' on':'')});
  const age=t-L.s;ly.style.transform=`scale(${1+Math.max(0,.08-age*.4)})`;ly.style.opacity=clamp(age/0.1)}
 else ly.style.opacity=0;
 ly.style.top=(TOPL.indexOf(idx)>=0)?'430px':'1400px';
 const fo=1-clamp((t-(endC-0.2))/0.3);
 $('tag').style.opacity=clamp((t-4)/0.4)*fo;$('tagp').style.transform=`scale(${1+H*.04})`;
 $('foot').style.opacity=fo;$('hdr').style.opacity=fo;$('shade').style.opacity=fo;$('frame').style.opacity=fo;
 for(let i=0;i<N;i++){const e=$('p'+i);e.style.opacity=parseFloat(e.style.opacity)*fo}
 $('end').style.opacity=clamp((t-endC)/0.5);
}
</script>"""
script=script.replace("@@BPM@@",str(P["bpm"])).replace("@@N@@",str(len(P["photos"]))).replace("@@CUTS@@",json.dumps(P["cuts"])).replace("@@TOP@@",json.dumps(P.get("top",[])))
open(D+'/reel.html','w').write('<!doctype html><html><head><meta charset="utf-8"><style>'+style+extra+'</style></head><body>'+body+endblk+script+'</body></html>')
print('ok')
