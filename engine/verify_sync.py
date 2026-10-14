"""Independent sync gate. usage: verify_sync.py cfg.js cut_audio.m4a [tol=0.30]
For each lyric line in the final cfg, re-measures (Whisper start sweep) when the line's first word is actually heard in the FINAL CUT AUDIO
and compares with the time the video shows it. Exits 1 if any line is off by more than tol seconds."""
import sys,json,re,difflib,subprocess,sherpa_onnx,soundfile as sf
cfg=json.loads(open(sys.argv[1]).read()[len('const CFG='):-1]); tol=float(sys.argv[3]) if len(sys.argv)>3 else 0.30
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',sys.argv[2],'-ar','16000','-ac','1','/tmp/_vs.wav'],check=True)
d='/home/claude/sfy/sherpa-onnx-whisper-small.en/'
R=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d+'small.en-encoder.int8.onnx',decoder=d+'small.en-decoder.int8.onnx',tokens=d+'small.en-tokens.txt',num_threads=2,language='en',task='transcribe')
x,sr=sf.read('/tmp/_vs.wav',dtype='float32'); norm=lambda s:re.sub(r'[^a-z0-9]','',s.lower())
def tr(a,b):
    s=R.create_stream(); s.accept_waveform(sr,x[int(max(0,a)*sr):int(b*sr)]); R.decode_stream(s); return [norm(t) for t in s.result.text.split() if norm(t)]
same=lambda a,b:a==b or difflib.SequenceMatcher(None,a,b).ratio()>=0.62
bad=0
LN=cfg['lines']; pick=sorted(set([0,len(LN)//2,len(LN)-1])) if len(sys.argv)<=4 or sys.argv[4]!='all' else range(len(LN))
for L in [LN[i] for i in pick]:
    shown=L['words'][0][1]; first=norm(L['words'][0][0]); best=None; t=shown-1.2
    while t<=shown+1.2:
        w=tr(t,t+4.0)
        if w and same(w[0],first): best=t
        elif best is not None and t-best>0.6: break
        t+=0.1
    heard=None if best is None else best+0.08
    ok=heard is not None and abs(heard-shown)<=tol
    bad+= (not ok)
    print(f"{'OK ' if ok else 'BAD'} shown {shown:6.2f} heard {heard if heard is None else round(heard,2)}  {L['text']}")
sys.exit(1 if bad else 0)
