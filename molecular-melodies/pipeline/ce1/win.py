import sys,subprocess,json
off,dur,rate=float(sys.argv[1]),float(sys.argv[2]),float(sys.argv[3])
subprocess.run(['ffmpeg','-y','-loglevel','error','-ss',str(off),'-t',str(dur),'-i','song.mp3','-af',f'atempo={rate}','-ar','16000','-ac','1','/tmp/w.wav'],check=True)
out=subprocess.run(['python3','/home/claude/sungforyou-reels/engine/pk.py','/tmp/w.wav','/tmp/w.json'],capture_output=True,text=True).stdout
w=json.load(open('/tmp/w.json'))
print(' '.join(f"{a}@{off+t*rate:.2f}" for a,t in w))
