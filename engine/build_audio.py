"""usage: python3 build_audio.py song.mp3 spec.json out.m4a [fade_out_s]
Cuts spec['segments'] and joins them with acrossfade (spec['xfade']), fades in 0.05s, fades out at the end."""
import json,sys,subprocess
mp3,spec,out=sys.argv[1:4]; fo=float(sys.argv[4]) if len(sys.argv)>4 else 1.2
S=json.load(open(spec)); segs=S['segments']; xf=S.get('xfade',0.25)
T=sum(b-a for a,b in segs)-xf*(len(segs)-1); tail=S.get('tail',0)
fc=''.join(f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS[s{i}];" for i,(a,b) in enumerate(segs))
cur='[s0]'
for i in range(1,len(segs)):
    fc+=f"{cur}[s{i}]acrossfade=d={xf}:c1=tri:c2=tri[x{i}];"; cur=f'[x{i}]'
fc+=f"{cur}afade=t=in:d=0.05,afade=t=out:st={T-fo:.3f}:d={fo}"+(f",apad=pad_dur={tail}" if tail else "")+"[o]"
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',mp3,'-filter_complex',fc,'-map','[o]','-ar','44100','-ac','2','-c:a','aac','-b:a','192k',out],check=True)
print('audio T=%.2f'%T)
