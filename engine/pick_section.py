"""usage: pick_section.py timing.json  -> lists Suno's lyric lines with section label and (approximate, Suno-time) start/end.
Pick the hook window from THIS list (by Suno time and section) BEFORE any audio work; only the chosen lines are ever measured with Whisper."""
import sys,json
raw=json.load(open(sys.argv[1])); d=(json.loads(raw['result']) if 'result' in raw else raw)['data']
for l in d['aligned_lyrics']: print(f"{l['start_s']:7.2f}-{l['end_s']:7.2f} [{l.get('section')}] {l['text']}")
