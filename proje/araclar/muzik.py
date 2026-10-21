"""SAKİN UZAY MÜZİĞİ ÜRETİCİ (telifsiz, tamamen kodla üretilir)
Kullanım: python3 araclar/muzik.py public/muzik/uzay-ambient.wav 70
Yavaş değişen akorlar + derin bas + yumuşak parıltı sesleri.
"""
import sys, wave
import numpy as np

SR = 44100


def akor_sesi(frekanslar, sure, tohum):
    t = np.arange(int(sure * SR)) / SR
    rng = np.random.default_rng(tohum)
    s = np.zeros_like(t)
    for f in frekanslar:
        for detune in (-0.6, 0.0, 0.7):  # hafif kayma = genişlik
            faz = rng.random() * 2 * np.pi
            s += np.sin(2 * np.pi * (f + detune) * t + faz) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t + faz))
    return s / (len(frekanslar) * 3)


def main():
    yol = sys.argv[1]
    sure = float(sys.argv[2]) if len(sys.argv) > 2 else 70
    # Re minör civarı yavaş akor dizisi (Hz)
    akorlar = [
        [73.42, 146.83, 220.0, 293.66, 349.23],
        [58.27, 116.54, 174.61, 233.08, 293.66],
        [65.41, 130.81, 196.0, 261.63, 329.63],
        [55.0, 110.0, 164.81, 220.0, 277.18],
    ]
    parca = 8.0
    n = int(sure * SR)
    cikti = np.zeros(n)
    i = 0
    bas = 0.0
    while bas < sure:
        a = akorlar[i % len(akorlar)]
        s = akor_sesi(a, parca + 3, i)
        L = len(s)
        zarf = np.ones(L)
        g = int(2.5 * SR)
        zarf[:g] = np.linspace(0, 1, g)
        zarf[-g:] = np.linspace(1, 0, g)
        s *= zarf
        b = int(bas * SR)
        e = min(n, b + L)
        cikti[b:e] += s[: e - b]
        bas += parca
        i += 1
    # parıltı (yüksek, seyrek çan sesleri)
    rng = np.random.default_rng(3)
    for k in range(int(sure / 2.2)):
        bas = rng.random() * (sure - 3)
        f = rng.choice([587.33, 698.46, 880.0, 1046.5, 1174.66])
        L = int(3 * SR)
        t = np.arange(L) / SR
        ton = np.sin(2 * np.pi * f * t) * np.exp(-t * 1.6) * 0.12
        b = int(bas * SR)
        cikti[b : b + L] += ton[: max(0, min(L, n - b))]
    # basit yankı
    for gecikme, kazanc in ((0.31, 0.35), (0.53, 0.25), (0.87, 0.15)):
        d = int(gecikme * SR)
        cikti[d:] += cikti[:-d] * kazanc
    cikti /= np.max(np.abs(cikti)) + 1e-9
    cikti *= 0.8
    f = int(2 * SR)
    cikti[:f] *= np.linspace(0, 1, f)
    cikti[-f * 2 :] *= np.linspace(1, 0, f * 2)
    stereo = np.stack([cikti, np.roll(cikti, 350)], axis=1)
    veri = (stereo * 32767).astype(np.int16)
    with wave.open(yol, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(veri.tobytes())
    print('Müzik hazır:', yol, sure, 'sn')


if __name__ == '__main__':
    main()
