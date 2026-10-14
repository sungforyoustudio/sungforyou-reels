"""Build the sync config for a lyric reel from Suno's word-level timing.
usage: python3 make_cfg.py timing.json song.wav spec.json out_cfg.js
spec.json: {segments:[[src0,src1],...], xfade:0.25, lines:[text,...], bubs:[[src_t,side,text,y],...], events:{name: src_t}}
Lyric tokens are matched 1:1 (whitespace split) to Suno aligned_words, searched in order."""
import json,sys,re
import numpy as np, librosa
timing,wav,spec,out=sys.argv[1:5]
raw=json.load(open(timing)); j=json.loads(raw['result']) if 'result' in raw else raw; W=j['data']['aligned_words']
S=json.load(open(spec))
norm=lambda s:re.sub(r'[^a-z0-9]','',s.lower())
nw=[norm(re.sub(r'\[[^\]]*\]','',w['word'])) for w in W]
segs=S['segments']; xf=S.get('xfade',0.25)
# src->video time map
starts=[];acc=0.0
for i,(a,b) in enumerate(segs):
    starts.append(acc-(a)); acc+=(b-a)-(xf if i<len(segs)-1 else 0)
T=acc+S.get('tail',0)
OFF=S.get('offset',1.0)   # per-song constant: mp3_time = suno_time + OFF (measure it! mom=3.3, dog/fma=1.0)
def V0(t):
    # map source time to video time using the segment containing it (prefer later segment if in both)
    for i,(a,b) in enumerate(segs):
        if a-0.6<=t<=b+0.05: return t+starts[i]
    return None
def V(t):
    r=V0(t+OFF)
    return r
lines=[];cur=0
for text in S['lines']:
    toks=[t for t in text.split() if norm(t)]
    # find sequence
    found=None
    for k in range(cur,len(W)-len(toks)+1):
        if all(nw[k+m]==norm(toks[m]) for m in range(len(toks))): found=k;break
    if found is None: raise SystemExit('line not found: '+text)
    ws=[]
    for m,tok in enumerate(toks):
        w=W[found+m]; en=w['end_s']; en=(w['start_s']+1.2) if en-w['start_s']>2.0 else en; ws.append([tok,V(w['start_s']),V(en)])
    lines.append(dict(text=text,words=ws,src0=W[found]['start_s'],src1=W[found+len(toks)-1]['end_s']))
    cur=found+len(toks)
if S.get('measured'):   # audio-measured line timing (align_lines.py): mp3 time, no offset needed
    M=json.load(open(S['measured']))
    for L,m in zip(lines,M):
        assert L['text']==m['text'],'measured/lines mismatch'
        L['words']=[[w,V0(a),V0(b)] for w,a,b in m['words']]
ev={k:V(v) for k,v in S.get('events',{}).items()}
bubs=[[V(t),s,tx,y] for t,s,tx,y in S.get('bubs',[])]
# beats from audio
y,sr=librosa.load(wav,sr=16000)
_,beats=librosa.beat.beat_track(y=y,sr=sr,units='time',start_bpm=S.get('bpm',165))
vb=[V0(b) for b in beats]; vb=[round(b,3) for b in vb if b is not None]
cfg=dict(T=T,lines=lines,bubs=bubs,ev=ev,beats=vb)
open(out,'w').write('const CFG='+json.dumps(cfg)+';')
print('T=%.2f'%T,'lines',len(lines)); 
for l in lines: print(f"{l['words'][0][1]:6.2f}-{l['words'][-1][2]:6.2f}  {l['text']}")
