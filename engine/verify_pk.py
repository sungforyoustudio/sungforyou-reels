"""Independent gate using Parakeet on the FINAL CUT audio. usage: verify_pk.py cfg.js cut.m4a delay tol
Each line's first word is re-heard in the cut audio (Parakeet word times) and compared with when the video shows it (minus the known audible-delay)."""
import sys,json,re,difflib,subprocess,sherpa_onnx,soundfile as sf
cfg=json.loads(open(sys.argv[1]).read()[len('const CFG='):-1]); delay=float(sys.argv[3]); tol=float(sys.argv[4])
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',sys.argv[2],'-ar','16000','-ac','1','/tmp/_vp.wav'],check=True)
d='/home/claude/models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8/'
r=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=d+'encoder.int8.onnx',decoder=d+'decoder.int8.onnx',joiner=d+'joiner.int8.onnx',tokens=d+'tokens.txt',num_threads=2,model_type='nemo_transducer')
x,sr=sf.read('/tmp/_vp.wav',dtype='float32'); s=r.create_stream(); s.accept_waveform(sr,x); r.decode_stream(s); res=s.result
W=[];cur=None
for tk,tm in zip(res.tokens,res.timestamps):
    if tk.startswith(' ') or tk.startswith('▁') or cur is None:
        if cur: W.append(cur)
        cur=dict(w=tk.lstrip('▁ '),s=tm)
    else: cur['w']+=tk
if cur: W.append(cur)
norm=lambda t:re.sub(r'[^a-z0-9]','',t.lower())
a=[norm(w['w']) for w in W]
toks=[norm(t) for L in cfg['lines'] for t in L['text'].split() if norm(t)]
sm=difflib.SequenceMatcher(None,toks,a,autojunk=False); mp={}
for i,j,sz in sm.get_matching_blocks():
    for k in range(sz): mp[i+k]=W[j+k]['s']
bad=0;idx=0
for L in cfg['lines']:
    ws=[w for w in L['words'] if norm(w[0])]; n=len(ws); diffs=[]
    for m,w in enumerate(ws):
        k=idx+m
        if k in mp: diffs.append(mp[k]+delay-w[1])
    idx+=n
    if not diffs: print('BAD no match',L['text']); bad+=1; continue
    diffs.sort(); med=diffs[len(diffs)//2]; ok=abs(med)<=tol and len(diffs)>=2
    bad+=(not ok); print(f"{'OK ' if ok else 'BAD'} line start {L['words'][0][1]:6.2f} median diff {med:+.2f} over {len(diffs)}/{n} words  {L['text']}")
sys.exit(1 if bad else 0)
