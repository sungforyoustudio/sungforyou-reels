"""usage: python3 prev_reel.py reeldir t1 t2 ... -> reeldir/p_TT.TT.png"""
import sys,os
from playwright.sync_api import sync_playwright
d=os.path.abspath(sys.argv[1]); ts=[float(x) for x in sys.argv[2:]]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={"width":1080,"height":1920}); errs=[]
    pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto("file://"+d+"/reel.html"); pg.wait_for_timeout(800)
    for t in ts: pg.evaluate(f"draw({t})"); pg.screenshot(path=f"{d}/p_{t:05.2f}.png")
    print("errors:",errs); b.close()
