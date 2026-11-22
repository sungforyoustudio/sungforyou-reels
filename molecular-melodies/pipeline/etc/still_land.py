"""usage: still.py reeldir out_prefix t1 t2 ...  -> PNG stills"""
import sys,os
from playwright.sync_api import sync_playwright
d=os.path.abspath(sys.argv[1]);pre=sys.argv[2]
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={"width":1920,"height":1080});pg.goto("file://"+d+"/reel.html");pg.wait_for_timeout(1200)
    for t in sys.argv[3:]:
        pg.evaluate(f"draw({t})");pg.wait_for_timeout(60);pg.screenshot(path=f"{pre}_{t}.png")
    b.close()
