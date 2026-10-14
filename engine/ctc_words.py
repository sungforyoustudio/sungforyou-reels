"""usage: ctc_words.py audio.wav out.json [start end]  -> word-level times (mp3 time) from NeMo CTC conformer; saves [{w,s,e}]"""
import sys,json,sherpa_onnx,soundfile as sf,numpy as np
d='/home/claude/models/sherpa-onnx-nemo-ctc-en-conformer-medium/'
r=sherpa_onnx.OfflineRecognizer.from_nemo_ctc(model=d+'model.int8.onnx',tokens=d+'tokens.txt',num_threads=4)
x,sr=sf.read(sys.argv[1],dtype='float32')
a=float(sys.argv[3]) if len(sys.argv)>3 else 0; b=float(sys.argv[4]) if len(sys.argv)>4 else len(x)/sr
out=[];t=a;W=20.0;H=15.0
while t<b:
    s=r.create_stream(); s.accept_waveform(sr,x[int(t*sr):int(min(b,t+W)*sr)]); r.decode_stream(s); res=s.result
    toks=res.tokens; ts=res.timestamps
    # merge BPE tokens into words
    cur=None
    for tk,tm in zip(toks,ts):
        if tk.startswith('▁') or cur is None:
            if cur: out.append(cur)
            cur=dict(w=tk.lstrip('▁'),s=round(t+tm,2),e=round(t+tm,2))
        else: cur['w']+=tk; cur['e']=round(t+tm,2)
    if cur: out.append(cur)
    t+=H
json.dump(out,open(sys.argv[2],'w'))
print(' '.join(f"{o['w']}@{o['s']}" for o in out))
