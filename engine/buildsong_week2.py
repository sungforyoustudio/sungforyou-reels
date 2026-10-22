import json,re,difflib,sys,os,subprocess
norm=lambda s:re.sub(r'[^a-z0-9]','',s.lower())
CFGS={
'free_trial':dict(lines=["You're not my boyfriend, you're a free trial that won't end","Full access to my weekends, but we're \"just friends\"","You've got a drawer at my place, you know my Netflix code","But I said \"he's cute\" once and you went quiet on the road"],he=21.7,
  photos=['free_trial_b.jpg','free_trial_a.jpg'],cuts=[2],bpm=96,hook_a='SEND THIS TO YOUR SITUATIONSHIP',hook_b='BASIC OR PREMIUM?',chip='Free Trial',tag='Send this to your situationship &#128128;'),
'group_chat_roll_call':dict(lines=["Who are you in the group chat? One, two, three, four?","Be honest, we all know you're at least a couple more","Number one's the Ghost, \"seen\" at noon, \"sorry!\" at four","Says \"omw\" from the couch with his shoes still by the door","Number two sends voice memos, four minutes, windy day"],he=22.4,
  photos=['group_a.jpg','group_b.jpg'],cuts=[2],bpm=104,hook_a='WHICH ONE ARE YOU?',hook_b='THE GROUP CHAT, RANKED',chip='Group Chat Roll Call',tag='Comment 1, 2, 3 or 4 &#128071;'),
'starting_monday':dict(lines=["Starting Monday, starting Monday","Tonight I'm eating like the world is ending","Starting Monday, starting Monday","Then it's Tuesday, and the plan is pending","Bought the shoes in January, still in the box","Bought the planner, color-coded, filled out the first two blocks","Downloaded Spanish, now the owl's got a grudge"],he=23.0,
  photos=['monday_b.jpg','monday_a.jpg'],cuts=[4],bpm=112,hook_a='WHAT ARE YOU STARTING MONDAY?',hook_b='COMMENT IT',chip='Starting Monday',tag='Send this to your Monday friend'),
'per_my_last_email':dict(lines=["Per my last email","The one in bold, the one with bullet points","Per my last email, please see attached","I said \"no worries\" but I'm worried, I'm worried a lot"],he=26.0,
  photos=['email_a.jpg','email_b.jpg'],cuts=[2],bpm=108,hook_a='YOUR COWORKER, EVERY DAY',hook_b='PER MY LAST EMAIL',chip='Per My Last Email',tag='Send this to your coworker &#128579;'),
'roommate_court':dict(lines=["The case is the sink","Exhibit A, a pan, since Tuesday, I think","The jury has seen it, the jury has smelled it","How do you plead? How do you plead?","The defense says \"I was going to wash it later\"","Later was a week ago, and later has a smell"],he=22.3,
  photos=['court_c.jpg','court_b.jpg','court_a.jpg'],cuts=[2,4],bpm=110,hook_a='ORDER IN THE COURT',hook_b='GUILTY OR NOT GUILTY?',chip='Roommate Court',tag='Send this to your roommate &#9878;'),
}
def build(n,start_hint):
    C=CFGS[n];D=f'/home/claude/reels/{n}';os.makedirs(D,exist_ok=True)
    asr=[w for w in json.load(open(f'm/w_{n}.json')) if w['s']>=start_hint-0.4 and w['s']<=C['he']+0.3]
    toks=[t for l in C['lines'] for t in l.split() if norm(t)]
    nt=[norm(t) for t in toks]
    # merge split words, alias common mishears
    m=[];i=0
    while i<len(asr):
        w=dict(asr[i]);nw=norm(w['w'])
        if i+1<len(asr) and (nw+norm(asr[i+1]['w'])) in nt: w['w']=w['w']+asr[i+1]['w'];i+=1
        elif nw in ('put','but','for') and i+1<len(asr) and norm(asr[i+1]['w'])=='my': w['w']='Per'
        elif nw=='bow': w['w']='bold'
        m.append(w);i+=1
    asr=m
    a=[norm(w['w']) for w in asr]
    sm=difflib.SequenceMatcher(None,nt,a,autojunk=False)
    st=[None]*len(toks)
    for i,j,sz in sm.get_matching_blocks():
        for k in range(sz): st[i+k]=asr[j+k]['s']
    # interpolate
    for i in range(len(st)):
        if st[i] is None:
            p=next((k for k in range(i-1,-1,-1) if st[k] is not None),None); q=next((k for k in range(i+1,len(st)) if st[k] is not None),None)
            if p is None: st[i]=(st[q]-0.25*(q-i)) if q is not None else 0
            elif q is None: st[i]=st[p]+0.3*(i-p)
            else: st[i]=st[p]+(st[q]-st[p])*(i-p)/(q-p)
    W=[]
    for i,t in enumerate(toks):
        e=st[i+1]-0.02 if i+1<len(st) and st[i+1]>st[i] else st[i]+0.5
        e=min(e,st[i]+1.2)
        W.append(dict(word=t,start_s=round(st[i],2),end_s=round(max(e,st[i]+0.12),2)))
    # fix non-monotonic
    for i in range(1,len(W)):
        if W[i]['start_s']<=W[i-1]['start_s']: W[i]['start_s']=round(W[i-1]['start_s']+0.1,2); W[i]['end_s']=round(W[i]['start_s']+0.3,2)
    hs=max(0,W[0]['start_s']-0.35)
    json.dump({'data':{'aligned_words':W}},open(f'{D}/timing.json','w'))
    spec=dict(segments=[[round(hs,2),C['he']]],xfade=0,bpm=C['bpm'],tail=2.3,lines=C['lines'],bubs=[],events={},offset=0.2)
    json.dump(spec,open(f'{D}/spec.json','w'))
    miss=sum(1 for k in range(len(toks)) if not any(True for _ in [0]) )
    print(n,'hook',round(hs,2),C['he'],'matched',sum(1 for i,j,sz in sm.get_matching_blocks() for _ in range(sz)),'/',len(toks))
    cmds=[f"python3 /home/claude/reels/common/make_cfg.py {D}/timing.json /home/claude/songs/{n}16.wav {D}/spec.json {D}/cfg.js",
          f"python3 /home/claude/reels/common/build_audio.py /home/claude/songs/{n}.mp3 {D}/spec.json {D}/cut.m4a 1.3"]
    for c in cmds: r=subprocess.run(c,shell=True,capture_output=True,text=True); print(r.stdout[-1500:],r.stderr[-300:])
    P=dict(dir=D,photos=C['photos'],cuts=C['cuts'],hook_a=C['hook_a'],hook_b=C['hook_b'],chip=C['chip'],tag=C['tag'],bpm=C['bpm'],top=[])
    json.dump(P,open(f'{D}/params.json','w'))
    print(subprocess.run(f"python3 /home/claude/reels/common/template_song_reel.py {D}/params.json",shell=True,capture_output=True,text=True).stdout)
if __name__=='__main__':
    build(sys.argv[1],float(sys.argv[2]))
