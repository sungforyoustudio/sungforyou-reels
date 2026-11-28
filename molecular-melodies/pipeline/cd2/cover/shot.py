import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for o,w,h,out in (('P',1080,1920,'MM_Meiosis_cover_9x16.png'),('L',1920,1080,'MM_Meiosis_cover_yt.png')):
            pg=await b.new_page(viewport={'width':w,'height':h})
            await pg.goto('file:///home/claude/pt/me/cover/cover.html?o='+o)
            await pg.wait_for_timeout(900)
            await pg.screenshot(path=out)
        await b.close()
asyncio.run(main())
