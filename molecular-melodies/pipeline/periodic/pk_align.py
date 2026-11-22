"""usage: pk_align.py lyrics.txt pk.json pk_slow.json out.json [slow_rate=0.75]
Fuzzy monotonic alignment of ASR words (normal + slowed copy) to the lyric sheet. Output per-line word times + consistency check."""
import sys,json,re,difflib,statistics as st
lyr,pkf,slf,out=sys.argv[1:5];rate=float(sys.argv[5]) if len(sys.argv)>5 else 0.75
lines=[l.strip() for l in open(lyr) if l.strip()]
norm=lambda t:re.sub(r'[^a-z0-9]','',t.lower())
LW=[(li,w) for li,l in enumerate(lines) for w in l.split() if norm(w)]
def nw(asr):
    A=[(norm(w),t) for w,t in asr if norm(w)];n,m=len(LW),len(A)
    sim=lambda a,b:(1.0 if a==b else difflib.SequenceMatcher(None,a,b).ratio())
    G=-0.4;S=[[0.0]*(m+1) for _ in range(n+1)];P=[[0]*(m+1) for _ in range(n+1)]
    for i in range(1,n+1): S[i][0]=i*G;P[i][0]=1
    for j in range(1,m+1): S[0][j]=j*G;P[0][j]=2
    for i in range(1,n+1):
        for j in range(1,m+1):
            s=sim(norm(LW[i-1][1]),A[j-1][0]);d=S[i-1][j-1]+(s*2-0.9 if s>=0.55 else -1.0)
            u=S[i-1][j]+G;l=S[i][j-1]+G
            b=max(d,u,l);S[i][j]=b;P[i][j]=0 if b==d else (1 if b==u else 2)
    i,j=n,m;res=[None]*n
    while i>0 or j>0:
        if i>0 and j>0 and P[i][j]==0:
            if sim(norm(LW[i-1][1]),A[j-1][0])>=0.55: res[i-1]=A[j-1][1]
            i-=1;j-=1
        elif i>0 and (j==0 or P[i][j]==1): i-=1
        else: j-=1
    return res
P=nw(json.load(open(pkf)));Sl=nw(json.load(open(slf)));Sl=[None if t is None else t*rate for t in Sl]
T=[]
for p,s in zip(P,Sl): T.append(p if p is not None else s)
# interpolate remaining gaps
n=len(T)
for i in range(n):
    if T[i] is None:
        a=i-1
        while a>=0 and T[a] is None: a-=1
        b=i+1
        while b<n and T[b] is None: b+=1
        if a>=0 and b<n:
            span=b-a
            if (T[b]-T[a])/span>0.8: T[i]=max(T[b]-0.4*(b-i),T[a]+0.3)
            else: T[i]=T[a]+(T[b]-T[a])*(i-a)/span
        elif b<n: T[i]=T[b]-0.35*(b-i)
        else: T[i]=T[a]+0.35*(i-a)
res=[];idx=0;report=[]
for li,l in enumerate(lines):
    ws=[w for w in l.split() if norm(w)];k=len(ws);ts=T[idx:idx+k]
    both=[(P[idx+m],Sl[idx+m]) for m in range(k) if P[idx+m] is not None and Sl[idx+m] is not None]
    diffs=sorted(abs(a-b) for a,b in both);med=diffs[len(diffs)//2] if diffs else None
    nm=sum(1 for m in range(k) if P[idx+m] is not None)
    words=[]
    for m,w in enumerate(ws):
        s=ts[m];e=ts[m+1] if m+1<k else s+0.5
        words.append([w,round(s,2),round(min(e,s+1.2),2)])
    res.append(dict(line=li,text=l,s=words[0][1],e=words[-1][2],words=words,matched=nm,n=k,xcheck=None if med is None else round(med,2)))
    idx+=k
json.dump(res,open(out,'w'))
bad=0
for o in res:
    flag=''
    if o['matched']<max(2,o['n']//2): flag+=' FEWMATCH'
    if o['xcheck'] is not None and o['xcheck']>0.35: flag+=' XCHECK'
    if flag: bad+=1
    print(f"{o['line']:2d} {o['s']:6.2f}-{o['e']:6.2f} m{o['matched']}/{o['n']} x{o['xcheck']}{flag} {o['text'][:38]}")
print('flagged',bad)
