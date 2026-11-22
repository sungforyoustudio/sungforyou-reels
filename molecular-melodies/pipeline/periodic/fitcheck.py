"""usage: fitcheck.py <dir> [step=0.5]. Draws frames and flags any bright pixels in the outer edge bands (clipped or off-canvas content)."""
import sys,re,os,io,numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright
d=os.path.abspath(sys.argv[1]);step=float(sys.argv[2]) if len(sys.argv)>2 else 0.5
cfg=open(d+'/cfg.js').read();T=float(re.search(r'"T":\s*([0-9.]+)',cfg).group(1));land='"land": true' in cfg
vp={"width":1920,"height":1080} if land else {"width":1080,"height":1920}
M=8;bad=[]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport=vp);pg.goto("file://"+d+"/reel.html");pg.wait_for_timeout(1200)
    t=0.0
    while t<T:
        pg.evaluate(f"draw({t})");a=np.asarray(Image.open(io.BytesIO(pg.screenshot())).convert('L')).astype(int)
        H,W=a.shape
        for name,band in (('left',a[:,:M]),('right',a[:,W-M:]),('top',a[:M,:]),('bottom',a[H-M:,:])):
            if band.max()>110: bad.append((round(t,1),name,int(band.max())))
        t+=step
    b.close()
print(d,'frames checked, problems:',len(bad));print(bad[:20])
