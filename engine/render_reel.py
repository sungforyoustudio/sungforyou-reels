"""usage: python3 render_reel.py reeldir audio.m4a out.mp4   (reeldir has reel.html + cfg.js + fonts link)"""
import sys,re,subprocess,os
from playwright.sync_api import sync_playwright
d=os.path.abspath(sys.argv[1]); audio=sys.argv[2]; out=sys.argv[3]
T=float(re.search(r'"T":\s*([0-9.]+)',open(d+'/cfg.js').read()).group(1)); FPS=30
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1080,"height":1920})
    pg.goto("file://"+d+"/reel.html"); pg.wait_for_timeout(800)
    ff=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","image2pipe","-framerate",str(FPS),"-i","-","-i",audio,"-c:v","libx264","-pix_fmt","yuv420p","-crf","19","-preset","medium","-c:a","copy","-shortest",out],stdin=subprocess.PIPE)
    n=int(T*FPS)
    for i in range(n):
        pg.evaluate(f"draw({i/FPS})"); ff.stdin.write(pg.screenshot(type="jpeg",quality=92))
        if i%100==0: print(i,n,flush=True)
    ff.stdin.close(); ff.wait(); b.close(); print("rendered",flush=True)
