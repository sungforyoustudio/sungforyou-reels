"""usage: est_offset.py timing.json audio.wav  -> best global shift (s) to ADD to Suno word starts so they land on audio onsets"""
import json,sys,numpy as np,librosa
raw=json.load(open(sys.argv[1])); j=json.loads(raw['result']) if 'result' in raw else raw
W=[w for w in j['data']['aligned_words'] if w['end_s']-w['start_s']<1.0]
y,sr=librosa.load(sys.argv[2],sr=16000)
env=librosa.onset.onset_strength(y=y,sr=sr,hop_length=160,aggregate=np.median)  # 100 fps
st=np.array([w['start_s'] for w in W])
res=[]
for off in np.arange(-1.0,2.51,0.02):
    idx=np.round((st+off)*100).astype(int); idx=idx[(idx>0)&(idx<len(env)-1)]
    sc=np.mean([env[max(0,i-2):i+3].max() for i in idx]); res.append((sc,off))
res.sort(reverse=True); print([f"{o:.2f}:{s:.2f}" for s,o in res[:6]])
base=[s for s,o in res]; print('mean',np.mean(base))
