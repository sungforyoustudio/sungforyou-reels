import pathlib, sys
from playwright.sync_api import sync_playwright
W,H=1080,1350
FD=pathlib.Path('/home/claude/work/fonts').as_posix()
CSS=f"""
@font-face{{font-family:YT;src:url(file://{FD}/yt.woff2)}}
@font-face{{font-family:M;src:url(file://{FD}/m600.woff2);font-weight:600}}
@font-face{{font-family:M;src:url(file://{FD}/m800.woff2);font-weight:800}}
@font-face{{font-family:M;src:url(file://{FD}/m900.woff2);font-weight:900}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:{W}px;height:{H}px;overflow:hidden;font-family:M;color:#fff;position:relative;
 background:radial-gradient(ellipse at 50% 38%,#2A1F5E 0%,#15103A 50%,#0B0820 100%)}}
.frame{{position:absolute;inset:40px;border:5px solid #FFD6EA;border-radius:44px;box-shadow:0 0 14px #FF4FA3,0 0 36px rgba(255,79,163,.6),inset 0 0 14px #FF4FA3}}
.c{{position:absolute;left:90px;right:90px;text-align:center}}
.logo{{font-family:YT;font-size:92px;color:#FFE3F1;text-shadow:0 0 8px #FF4FA3,0 0 22px #FF4FA3,0 0 48px #FF4FA3;top:95px}}
.big{{font-weight:900;color:#FFE3F1;line-height:1.02;text-shadow:0 0 10px #FF4FA3,0 0 30px #FF4FA3,0 0 60px #C2187A}}
.cy{{font-weight:800;color:#C9F8FF;text-shadow:0 0 10px #33E6FF,0 0 26px #33E6FF;line-height:1.2}}
.wh{{font-weight:800;color:#fff;line-height:1.25}}
.pill{{display:inline-block;background:#FF4FA3;color:#fff;font-weight:900;border-radius:60px;padding:26px 60px;font-size:60px;box-shadow:0 0 24px #FF4FA3,0 0 60px rgba(255,79,163,.5)}}
.old{{color:#9A93B8;text-decoration:line-through;font-weight:900}}
.row{{display:flex;justify-content:center;align-items:baseline;gap:40px}}
.step{{display:flex;align-items:center;gap:34px;text-align:left;margin-bottom:34px}}
.n{{flex:none;width:96px;height:96px;border-radius:50%;background:#C9F8FF;color:#0B0820;font-weight:900;font-size:56px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px #33E6FF,0 0 50px rgba(51,230,255,.6)}}
"""
PRICE='<div class="row c" style="top:{t}px"><span class="old" style="font-size:70px">$29.97</span><span class="big" style="font-size:130px">$19.78</span></div>'
FOOT='<div class="c wh" style="bottom:92px;font-size:42px">Link in bio</div><div class="c cy" style="bottom:50px;font-size:30px;display:none">Etsy: SungForYouStudio</div>'
def foot(): return '<div class="c wh" style="bottom:120px;font-size:46px">Link in bio</div><div class="c cy" style="bottom:72px;font-size:32px">Etsy: SungForYouStudio</div>'
def base(inner): return f'<div class="frame"></div><div class="c logo">Sung For You</div>{inner}{foot()}'
P={}
P['sale_nov']=base(f"""
<div class="c big" style="top:250px;font-size:190px">34% OFF</div>
<div class="c cy" style="top:470px;font-size:42px">A custom song made just for them</div>
{PRICE.format(t=600)}
<div class="c cy" style="top:790px;font-size:34px">Birthdays · Roasts · Weddings · Anniversaries</div>
<div class="c" style="top:930px"><span class="pill">Ends Nov 30</span></div>""")
P['gift_idea']=base("""
<div class="c cy" style="top:270px;font-size:46px;letter-spacing:.05em">GIFT IDEA</div>
<div class="c big" style="top:350px;font-size:112px">For the person<br>who has<br>everything</div>
<div class="c wh" style="top:790px;font-size:50px">A song nobody else has,<br>made from your story.</div>
<div class="c" style="top:960px"><span class="pill" style="font-size:52px">Now $19.78 till Nov 30</span></div>""")
P['engage_hook']=base("""
<div class="c cy" style="top:280px;font-size:46px;letter-spacing:.05em">COMMENT BELOW</div>
<div class="c big" style="top:360px;font-size:104px">Drop a<br>situation.</div>
<div class="c big" style="top:620px;font-size:104px">We'll write<br>the hook.</div>
<div class="c wh" style="top:960px;font-size:46px">Your roommate. Your boss.<br>Your group chat. Go.</div>""")
P['friendsgiving']=base("""
<div class="c cy" style="top:280px;font-size:46px;letter-spacing:.05em">FRIENDSGIVING</div>
<div class="c big" style="top:360px;font-size:108px">Roast your<br>friends<br>with a song</div>
<div class="c wh" style="top:820px;font-size:48px">The one who is always late.<br>The one who never brings a dish.</div>
<div class="c" style="top:990px"><span class="pill" style="font-size:52px">Now $19.78 till Nov 30</span></div>""")
steps=[("1","Order and tell us their story"),("2","We send the lyrics first"),("3","Approve them, get your MP3")]
st=''.join(f'<div class="step"><div class="n">{a}</div><div class="wh" style="font-size:52px">{b}</div></div>' for a,b in steps)
P['how_it_works']=base(f"""
<div class="c cy" style="top:270px;font-size:46px;letter-spacing:.05em">HOW IT WORKS</div>
<div class="c big" style="top:340px;font-size:100px">Easy as 1, 2, 3</div>
<div class="c" style="top:560px;left:130px;right:60px">{st}</div>
<div class="c cy" style="top:1030px;font-size:36px">Finished songs arrive about 3 business days after you approve</div>""")
P['christmas']=base("""
<div class="c cy" style="top:270px;font-size:46px;letter-spacing:.05em">CHRISTMAS GIFT, SORTED</div>
<div class="c big" style="top:350px;font-size:110px">A song for<br>mom, dad, or<br>your person</div>
<div class="c wh" style="top:810px;font-size:48px">Lyrics from your story.<br>Their name, sung in it.</div>
<div class="c" style="top:990px"><span class="pill" style="font-size:52px">Now $19.78 till Nov 30</span></div>""")
P['finish_line']=base("""
<div class="c cy" style="top:280px;font-size:46px;letter-spacing:.05em">FINISH THE LINE</div>
<div class="c big" style="top:380px;font-size:80px">"You don't do ___,<br>but you do ___."</div>
<div class="c wh" style="top:760px;font-size:50px">Best answers become<br>a verse in our next song.</div>
<div class="c cy" style="top:960px;font-size:46px">Comment yours 👇</div>""")
P['thanks']=base("""
<div class="c cy" style="top:280px;font-size:46px;letter-spacing:.05em">HAPPY THANKSGIVING</div>
<div class="c big" style="top:360px;font-size:112px">Thankful for<br>everyone<br>who listens</div>
<div class="c wh" style="top:830px;font-size:48px">Say it with a song this season.</div>
<div class="c" style="top:960px"><span class="pill" style="font-size:52px">Now $19.78 till Nov 30</span></div>""")
P['blackfriday']=base(f"""
<div class="c cy" style="top:270px;font-size:46px;letter-spacing:.05em">BLACK FRIDAY</div>
<div class="c big" style="top:340px;font-size:116px">A gift they<br>can't return</div>
{PRICE.format(t=700)}
<div class="c wh" style="top:900px;font-size:40px">A custom song, made from your story</div>
<div class="c" style="top:1010px"><span class="pill" style="font-size:52px">Ends Nov 30</span></div>""")
P['weekend']=base(f"""
<div class="c cy" style="top:270px;font-size:46px;letter-spacing:.05em">2 DAYS LEFT</div>
<div class="c big" style="top:340px;font-size:132px">34% OFF</div>
{PRICE.format(t=560)}
<div class="c wh" style="top:790px;font-size:48px">Custom songs for birthdays,<br>roasts, and holiday gifts</div>
<div class="c" style="top:980px"><span class="pill" style="font-size:52px">Ends Nov 30</span></div>""")
P['lastday']=base(f"""
<div class="c cy" style="top:270px;font-size:46px;letter-spacing:.05em">LAST DAY</div>
<div class="c big" style="top:340px;font-size:132px">Sale ends<br>tonight</div>
{PRICE.format(t=700)}
<div class="c wh" style="top:900px;font-size:48px">34% off a custom song</div>
<div class="c" style="top:1010px"><span class="pill" style="font-size:52px">Ends Nov 30</span></div>""")
if __name__=='__main__':
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(viewport={'width':W,'height':H})
        for k,v in P.items():
            f=pathlib.Path(f'/home/claude/work/gfx/{k}.html'); f.write_text(f'<!doctype html><meta charset=utf-8><style>{CSS}</style><body>{v}</body>')
            pg.goto('file://'+f.as_posix()); pg.wait_for_timeout(400)
            pg.screenshot(path=f'/home/claude/work/gfx/{k}.png')
        b.close()
