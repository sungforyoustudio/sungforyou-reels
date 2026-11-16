import sys,json,numpy as np,soundfile as sf,sherpa_onnx
M='/home/claude/models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8'
r=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=M+'/encoder.int8.onnx',decoder=M+'/decoder.int8.onnx',joiner=M+'/joiner.int8.onnx',tokens=M+'/tokens.txt',model_type='nemo_transducer',num_threads=4)
a,sr=sf.read(sys.argv[1],dtype='float32'); W,Hp=28,24; words=[]
t0=0
while t0<len(a)/sr:
    seg=a[int(t0*sr):int((t0+W)*sr)]
    s=r.create_stream(); s.accept_waveform(sr,seg); r.decode_stream(s)
    toks,ts=s.result.tokens,s.result.timestamps
    cur=None; ws=[]
    for tk,tm in zip(toks,ts):
        if tk.startswith(' ') or cur is None:
            if cur: ws.append(cur)
            cur=[tk.strip(),tm]
        else: cur[0]+=tk
    if cur: ws.append(cur)
    lo=t0+ (2 if t0>0 else 0); hi=t0+Hp+2
    for w,tm in ws:
        g=t0+tm
        if lo<=g<hi and w: words.append([w,round(g,2)])
    t0+=Hp
json.dump(words,open(sys.argv[2],'w'))
print(' '.join(f"{w}@{t}" for w,t in words))
