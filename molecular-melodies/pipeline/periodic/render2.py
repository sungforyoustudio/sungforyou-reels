import sys,re,subprocess,os,time
from playwright.sync_api import sync_playwright
d=os.path.abspath(sys.argv[1]);audio=sys.argv[2];out=sys.argv[3];stills=sys.argv[4:]
T=float(re.search(r'"T":\s*([0-9.]+)',open(d+'/cfg.js').read()).group(1));FPS=30
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={"width":1920,"height":1080} if '"land": true' in open(d+"/cfg.js").read() else {"width":1080,"height":1920})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto("file://"+d+"/reel.html");pg.wait_for_timeout(1200)
    if stills and stills[0]=='stills':
        for t in stills[1:]:
            pg.evaluate(f"draw({t})");pg.screenshot(path=f"{d}/still_{t}.png")
        print('errs',errs);b.close();sys.exit()
    ff=subprocess.Popen(["ffmpeg","-y","-loglevel","error","-f","image2pipe","-framerate",str(FPS),"-i","-","-i",audio,"-c:v","libx264","-pix_fmt","yuv420p","-crf","19","-preset","veryfast","-c:a","aac","-b:a","192k","-shortest",out],stdin=subprocess.PIPE)
    n=int(T*FPS);t0=time.time()
    for i in range(n):
        pg.evaluate(f"draw({i/FPS})");ff.stdin.write(pg.screenshot(type="jpeg",quality=92))
        if i%300==0:print(i,n,round(time.time()-t0),flush=True)
    ff.stdin.close();ff.wait();print('rendered',errs,flush=True);b.close()
