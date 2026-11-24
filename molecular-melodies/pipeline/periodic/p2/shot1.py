import asyncio,sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for o,w,h,out in (('P',1080,1920,'p1_9x16.png'),('L',1920,1080,'p1_yt.png')):
            pg=await b.new_page(viewport={'width':w,'height':h})
            await pg.goto('file:///home/claude/pt/p2/cover/cover1.html?o='+o)
            await pg.wait_for_timeout(800)
            await pg.screenshot(path=out)
        await b.close()
asyncio.run(main())
