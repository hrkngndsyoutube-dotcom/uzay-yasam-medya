"""Gerçekçi bulutsu + yıldız alanı arka planı üretir (1080x1350).
Kullanım: python3 araclar/bulutsu.py cikti.jpg tohum renk1 renk2
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

W, H = 1080, 1350

def gurultu(rng, olcekler=(4, 8, 16, 32, 64, 128), agirlik=0.55):
    toplam = np.zeros((H, W))
    a = 1.0
    for o in olcekler:
        k = rng.random((max(2, H * o // W), o))
        im = Image.fromarray((k * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
        toplam += np.asarray(im, float) / 255 * a
        a *= agirlik
    toplam -= toplam.min(); toplam /= toplam.max()
    return toplam

def hex2(h):
    h = h.lstrip('#'); return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], float) / 255

yol, tohum, r1, r2 = sys.argv[1], int(sys.argv[2]), hex2(sys.argv[3]), hex2(sys.argv[4])
rng = np.random.default_rng(tohum)
n1 = gurultu(rng); n2 = gurultu(rng); n3 = gurultu(rng, (16, 32, 64, 128, 256), 0.6)
# bulut maskesi: diyagonal bant + gürültü
yy, xx = np.mgrid[0:H, 0:W] / np.array([H, W])[:, None, None]
aci = rng.random() * 2 - 1
bant = np.exp(-((yy - 0.5 - aci * (xx - 0.5)) ** 2) / 0.06)
m1 = np.clip((n1 * 1.4 - 0.45) * bant * 1.6, 0, 1) ** 1.6
m2 = np.clip((n2 * 1.4 - 0.55) * bant * 1.8, 0, 1) ** 1.8
toz = np.clip((n3 - 0.55) * 3, 0, 1) * bant  # koyu toz şeritleri
img = np.zeros((H, W, 3))
img += m1[..., None] * r1 * 1.1
img += m2[..., None] * r2 * 1.0
img += (m1 * m2)[..., None] * np.array([1, 0.95, 0.9]) * 0.9
img *= (1 - 0.75 * toz)[..., None]
img = np.asarray(Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2)), float) / 255
# yıldızlar
for adet, boy, parl in ((5000, 0, 0.55), (600, 1, 0.85), (60, 2, 1.0)):
    ys = rng.integers(0, H, adet); xs = rng.integers(0, W, adet)
    for y, x in zip(ys, xs):
        c = parl * (0.5 + 0.5 * rng.random())
        renk = np.array([1, 1, 1]) * c if rng.random() > 0.3 else np.array([0.75, 0.85, 1]) * c
        img[max(0, y - boy):y + boy + 1, max(0, x - boy):x + boy + 1] = np.maximum(img[max(0, y - boy):y + boy + 1, max(0, x - boy):x + boy + 1], renk)
# parlak yıldızlara hale
parlak = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8))
hale = np.asarray(parlak.filter(ImageFilter.GaussianBlur(6)), float) / 255
img = np.clip(img + hale * 0.6, 0, 1)
# vinyet
v = 1 - 0.55 * (((xx - 0.5) ** 2 + (yy - 0.5) ** 2) * 2.2)
img *= np.clip(v, 0.25, 1)[..., None]
Image.fromarray((img * 255).astype(np.uint8)).save(yol, quality=94)
print('ok', yol)
