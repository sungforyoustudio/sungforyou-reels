"""Disposable-camera / Y2K flash look: ghost blur, bloom, warm grade, vignette, grain. usage: flashlook.py in out [seed]"""
import sys,numpy as np
from PIL import Image,ImageFilter,ImageChops
def look(im,seed=0):
    rng=np.random.default_rng(seed);im=im.convert('RGB').resize((768,1344),Image.LANCZOS)
    a=np.asarray(im).astype(np.float32)/255
    gh=np.asarray(im.filter(ImageFilter.GaussianBlur(6))).astype(np.float32)/255
    sh=np.roll(gh,14,axis=1)*0.5+np.roll(gh,-14,axis=1)*0.5
    a=a*0.72+sh*0.28                                   # blurry ghosting
    lum=a.mean(2,keepdims=True);hi=np.clip((lum-0.62)/0.38,0,1)*a
    bl=np.asarray(Image.fromarray((hi*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(28))).astype(np.float32)/255
    a=np.clip(a+bl*0.55,0,1)                           # flash bloom
    a=np.clip((a-0.5)*1.12+0.53,0,1)*np.array([1.05,0.98,1.02])  # contrast + warm pink
    h,w=a.shape[:2];yy,xx=np.mgrid[0:h,0:w];d=np.sqrt(((xx-w/2)/(w/2))**2+((yy-h*0.45)/(h/2))**2)
    a=a*(1-0.42*np.clip(d-0.55,0,1)[...,None])          # vignette
    a=np.clip(a+rng.normal(0,0.035,a.shape[:2])[...,None],0,1)  # grain
    return Image.fromarray((np.clip(a,0,1)*255).astype(np.uint8))
if __name__=='__main__': look(Image.open(sys.argv[1]),int(sys.argv[2]) if len(sys.argv)>2 else 0).save(sys.argv[3],quality=92)
