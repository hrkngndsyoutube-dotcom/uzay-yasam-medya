import numpy as np, wave, random, json
SR=44100; SEG=28; NSEG=1029; T=SEG*NSEG; N=T*SR
random.seed(42)
def oku(p,norm='rms',trim=0.2):
    w=wave.open(p); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).reshape(-1,2).astype(np.float32)/32768
    if trim: a=a[int(trim*SR):-int(trim*SR)]
    if norm=='rms': a=a/(np.sqrt(np.mean(a**2))+1e-9); a=np.tanh(a/3)*3
    else: a=a/np.max(np.abs(a))
    return a
def karo(adlar,dk=10,xf=3,tohum=1):
    r=random.Random(tohum); L=int(dk*60*SR); X=int(xf*SR); kl=[oku(a+'.wav') for a in adlar]
    out=np.zeros((L+X,2),np.float32); pos=0; t=np.linspace(0,np.pi/2,X)[:,None]; fi,fo=np.sin(t),np.cos(t)
    while pos<L+X:
        c=r.choice(kl).copy()
        if pos>0: c[:X]*=fi; out[pos:pos+X]*=fo[:len(out[pos:pos+X])]
        e=min(len(c),L+X-pos); out[pos:pos+e]+=c[:e]; pos+=len(c)-X
    out[:X]=out[:X]*fi+out[L:L+X]*fo
    return out[:L]
print('karolar...')
K={'agir':karo(['yagmur','yagmur2'],tohum=1),'hafif':karo(['yagmur3','cam'],tohum=2),'soba':karo(['soba'],tohum=3),
   'kor':karo(['kor'],tohum=4),'cay':karo(['caydanlik'],tohum=5),'kus':karo(['kus1','kus2'],tohum=6)}
def egri(h,noktalar):  # (saat, değer) parçalı doğrusal
    xs=[p[0] for p in noktalar]; ys=[p[1] for p in noktalar]; return np.interp(h,xs,ys)
KAZ={'agir':[(0,0.10),(2,0.10),(3,0.07),(6,0.045),(7.8,0.0),(9,0)],
     'hafif':[(0,0.03),(5,0.06),(7.6,0.05),(8.0,0.01),(9,0.01)],
     'soba':[(0,0.06),(5,0.06),(6.5,0.03),(9,0.03)],
     'kor':[(0,0),(5,0),(6,0.04),(9,0.04)],
     'cay':[(0,0.015),(3,0.015),(4,0),(9,0)],
     'kus':[(0,0),(7.4,0),(7.8,0.06),(9,0.06)]}
# OLAYLAR
olay=[]  # (bas_sn, ses_dizisi)
def zarf(s,fi,fo):
    n=len(s); e=np.ones(n); a=max(1,int(fi*SR)); b=int(fo*SR); e[:a]=np.linspace(0,1,a); e[-b:]=np.linspace(1,0,b); return s*e[:,None]
ruz=[oku(f) for f in ['ruzgar.wav','ruzgar2.wav']]; ruz3=oku('ruzgar3.wav')
t=60
while t<T:
    h=t/3600
    if h<2: s=random.choice(ruz)*0.07; t_ara=random.uniform(120,240)
    elif h<5: s=random.choice(ruz)*0.05; t_ara=random.uniform(400,700)
    elif h<7: s=ruz3*0.035; t_ara=random.uniform(800,1100)
    else: break
    olay.append((t,zarf(s,4,5))); t+=t_ara
uzak=[oku(f,'peak',0) for f in ['gok_uzak.wav','gok_uzak2.wav','gok_uzak3.wav']]
t=200
while t<T:
    h=t/3600
    if h<2: t_ara=random.uniform(170,320); g=0.24
    elif h<4.5: t_ara=random.uniform(600,1000); g=0.18
    else: break
    olay.append((t,zarf(random.choice(uzak)*g,0.3,3))); t+=t_ara
# yakın/orta gök gürültüsü + şimşek segmentleri (ilk 2 saat)
def onset(s):
    env=np.convolve(np.abs(s[:,0]),np.ones(800)/800,'same'); return np.argmax(env>0.4*env.max())/SR
sert=oku('gok_sert.wav','peak',0); orta=oku('gok_orta.wav','peak',0); yakin=oku('gok_yakin.wav','peak',0)
flas=[]
seg=8
while seg*SEG<2*3600:
    h=seg*SEG/3600
    if h<0.7: s=random.choice([sert,yakin,orta]); g=0.42 if s is sert else 0.38
    else: s=random.choice([orta,yakin]); g=0.30
    bas=seg*SEG+10.7-onset(s)
    olay.append((bas,zarf(s*g,0.01,3))); flas.append(seg)
    seg+=random.randint(9,16) if h<0.7 else random.randint(18,30)
json.dump({'SEG':SEG,'NSEG':NSEG,'flas':flas},open('plan8.json','w'))
print('şimşek segmentleri',len(flas),flas[:10])
olay.sort(key=lambda x:x[0])
# YAZ (60 sn parçalar)
import subprocess
pr=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','s16le','-ar','44100','-ac','2','-i','-','-c:a','flac','sekiz_saat_ham.flac'],stdin=subprocess.PIPE)
P=60*SR
for i0 in range(0,N,P):
    i1=min(N,i0+P); n=i1-i0; idx=np.arange(i0,i1); h=idx/SR/3600
    buf=np.zeros((n,2),np.float32)
    for ad,k in K.items():
        g=egri(h,KAZ[ad]).astype(np.float32)
        buf+=k[idx%len(k)]*g[:,None]
    for (b,s) in olay:
        bs=int(b*SR); be=bs+len(s)
        if be<=i0 or bs>=i1: continue
        a=max(bs,i0); z=min(be,i1); buf[a-i0:z-i0]+=s[a-bs:z-bs]
    if i0==0: buf[:SR*3]*=np.linspace(0,1,SR*3)[:,None]
    if i1==N: buf[-SR*10:]*=np.linspace(1,0,SR*10)[:,None]
    buf=np.tanh(buf*0.8)  # yumuşak sınırlayıcı
    pr.stdin.write((buf*0.9*32767).astype(np.int16).tobytes())
pr.stdin.close(); pr.wait(); print('bitti', T/3600)
