import sys,json,subprocess,re;sys.path.insert(0,'/home/claude/sungforyou-reels/engine')
exec(open('build3.py').read().split("for n,s in")[0])
T={'job_back':([58.96,61.36,63.36,65.92,68.48,73.12,76.48,79.6,81.6,83.92,85.28],[61.0,63.1,65.5,68.2,71.4,76.2,79.0,81.4,83.7,85.0,87.2]),
'crashout':([14.8,18.16,21.2,24.32,27.84,31.04,34.8],[17.6,20.9,23.8,27.0,30.5,33.7,38.0]),
'delulu':([21.36,25.76,29.28,33.3,36.96,40.16,45.76],[25.2,27.9,32.2,35.8,39.9,45.2,47.6]),
'skibidi':([19.92,24.32,29.44,34.24,39.12,44.0],[23.3,28.0,33.2,37.9,43.5,47.2]),
'potatoes':([15.36,19.76,23.44,27.92,32.32,36.88,40.88],[19.2,22.5,26.7,31.2,35.6,39.7,44.0])}
B.CFGS['job_back']['lines'].append("Can I have my job back?")
for n,(ss,ee) in T.items():
    C=B.CFGS[n];D=f'/home/claude/reels/{n}';W=[]
    assert len(ss)==len(C['lines']),n
    for l,s,e in zip(C['lines'],ss,ee):
        ws=[w for w in l.split() if re.sub(r'[^a-zA-Z0-9]','',w)];d=(e-s)/len(ws)
        for i,w in enumerate(ws): W.append(dict(word=w,start_s=round(s+i*d,2),end_s=round(s+(i+1)*d-0.02,2)))
    json.dump({'data':{'aligned_words':W}},open(f'{D}/timing.json','w'))
    hs=round(ss[0]-0.35,2)
    json.dump(dict(segments=[[hs,C['he']]],xfade=0,bpm=C['bpm'],tail=2.3,lines=C['lines'],bubs=[],events={},offset=0.2),open(f'{D}/spec.json','w'))
    for c in [f"python3 /home/claude/reels/common/make_cfg.py {D}/timing.json /home/claude/songs/{n}16.wav {D}/spec.json {D}/cfg.js",f"python3 /home/claude/reels/common/build_audio.py /home/claude/songs/{n}.mp3 {D}/spec.json {D}/cut.m4a 1.3"]:
        r=subprocess.run(c,shell=True,capture_output=True,text=True);print(n,r.stdout[-330:],r.stderr[-200:])
    json.dump(dict(dir=D,photos=C['photos'],cuts=C['cuts'],hook_a=C['hook_a'],hook_b=C['hook_b'],chip=C['chip'],tag=C['tag'],bpm=C['bpm'],top=[]),open(f'{D}/params.json','w'))
    print(subprocess.run(f"python3 /home/claude/reels/common/template_song_reel.py {D}/params.json",shell=True,capture_output=True,text=True).stdout[-60:])
