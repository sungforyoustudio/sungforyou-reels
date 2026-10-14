"""usage: asr_probe.py audio.wav start lo hi step  -> transcript of [start, e] for e in lo..hi (shows when words complete, in mp3 time)"""
import sys,sherpa_onnx,soundfile as sf
d='/home/claude/sfy/sherpa-onnx-whisper-small.en/'
r=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d+'small.en-encoder.int8.onnx',decoder=d+'small.en-decoder.int8.onnx',tokens=d+'small.en-tokens.txt',num_threads=4,language='en',task='transcribe')
x,sr=sf.read(sys.argv[1],dtype='float32'); a=float(sys.argv[2]); lo,hi,st=map(float,sys.argv[3:6])
e=lo
while e<=hi+1e-6:
    s=r.create_stream(); s.accept_waveform(sr,x[int(a*sr):int(e*sr)]); r.decode_stream(s); print(f"{e:6.2f} {s.result.text.strip()}",flush=True); e+=st
