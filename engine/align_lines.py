"""Measure true line start/end times in the MP3 with Whisper (Suno word timing is unreliable, uneven by 1-3 s).
usage: align_lines.py timing.json audio16k.wav spec.json out.json
Uses spec['lines'] (display lines, matched sequentially to Suno words as in make_cfg) and spec['segments'] to limit.
Method: start sweep (window start moves right, window end fixed; last start at which the first word is still heard = line start),
end sweep (window end grows; first end at which the last word is heard = line end). Words inside a line are spread using Suno's relative spacing."""
import sys,json,re,difflib,sherpa_onnx,soundfile as sf
d='/home/claude/sfy/sherpa-onnx-whisper-small.en/'
R=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d+'small.en-encoder.int8.onnx',decoder=d+'small.en-decoder.int8.onnx',tokens=d+'small.en-tokens.txt',num_threads=1,language='en',task='transcribe')
timing,wav,spec,out=sys.argv[1:5]
raw=json.load(open(timing)); W=(json.loads(raw['result']) if 'result' in raw else raw)['data']['aligned_words']
S=json.load(open(spec)); x,sr=sf.read(wav,dtype='float32')
norm=lambda s:re.sub(r'[^a-z0-9]','',s.lower())
nw=[norm(re.sub(r'\[[^\]]*\]','',w['word'])) for w in W]
def tr(a,b):
    s=R.create_stream(); s.accept_waveform(sr,x[int(max(0,a)*sr):int(b*sr)]); R.decode_stream(s); return [norm(t) for t in s.result.text.split() if norm(t)]
def same(a,b): return a==b or (min(len(a),len(b))>3 and difflib.SequenceMatcher(None,a,b).ratio()>=0.7)
def same2(w,f): return len(w)>=2 and same(w[0],f[0]) and same(w[1],f[1])
cur=0;res=[];dg=S.get('delta_guess')
only=S.get('only')
for li,text in enumerate(S['lines']):
    toks=[t for t in text.split() if norm(t)]
    found=None
    for k in range(cur,len(W)-len(toks)+1):
        if all(nw[k+m]==norm(toks[m]) for m in range(len(toks))): found=k;break
    if found is None: raise SystemExit('line not found: '+text)
    ws=W[found:found+len(toks)]; cur=found+len(toks)
    if only and not (only[0]<=li<=only[1]): continue
    s0=ws[0]['start_s']; e0=min(ws[-1]['end_s'],ws[-1]['start_s']+1.2)
    # priors from previous measured line keep order
    lo=s0-1.0; hi=s0+5.0
    if dg is not None: lo=s0+dg-0.9; hi=s0+dg+0.9
    if res: lo=max(lo,res[-1]['s']+0.3)
    first=[norm(t) for t in toks[:2]]; last=norm(toks[-1]); win_end=max(e0+4.0,s0+4.0)
    # start sweep: last t where first word is first heard
    best=None;t=lo
    while t<=hi:
        w=tr(t,t+3.2); 
        if same2(w,first): best=t
        elif best is not None and t-best>0.5: break
        t+=0.2
    if best is None: best=s0+1.0; print('WARN no start for',text)
    ts=best+0.08
    # end sweep
    e=ts+0.5;endt=None
    while e<ts+(e0-s0)+4.0:
        w=tr(ts-0.1,e)
        if len(w)>=max(2,len(toks)-1) and same(w[-1],last): endt=e;break
        e+=0.2
    if endt is None: endt=ts+(e0-s0)
    span=(e0-s0) or 1.0; sc=(endt-ts)/span
    words=[[tok,round(ts+(w['start_s']-s0)*sc,3),round(ts+(min(w['end_s'],w['start_s']+1.2)-s0)*sc,3)] for tok,w in zip(toks,ws)]
    words[-1][2]=round(endt,3)
    dg=ts-s0
    res.append(dict(text=text,s=round(ts,3),e=round(endt,3),suno_s=s0,words=words))
    print(f"suno {s0:7.2f} -> measured {ts:7.2f} (d={ts-s0:+.2f})  end {endt:7.2f}  {text}",flush=True)
json.dump(res,open(out,'w'))
