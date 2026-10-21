# Animasyon Stüdyosu (Remotion 4 + React + Three.js)

Beyaz yuvarlak kafalı karakterlerle 2D/3D karışık animasyon videosu üreten sistem.

## Klasörler

| Klasör / dosya | Ne işe yarar |
|---|---|
| `src/karakter/Karakter.tsx` | Karakterin kendisi (kafa, gövde, kol, bacak, göz) |
| `src/karakter/pozlar.ts` | Poz kütüphanesi: ayakta, oturmuş, yürüyüş, uzanma, yazma, göz kırpma |
| `src/mekanlar/` | Hazır mekânlar: `EvIci`, `Sokak`, `Ofis` |
| `src/sahne/parcalar.tsx` | 3D eşyalar: ağaç, lamba, bina, kapı, koltuk, masa, bitki, anahtar |
| `src/sahne/Araba.tsx` | Kapısı açılan, tekerleri dönen araba |
| `src/sahne/araclar.tsx` | Kamera, yürüme yolu, zamanlama yardımcıları |
| `src/videolar/` | Videolar: `EvdenArabaya` (20 sn örnek), `MekanVitrini` (12 sn) |
| `src/Root.tsx` | Video listesi (süre, çözünürlük, fps) |
| `public/` | Ses ve görsel dosyaları buraya konur |

## Komutlar (kendi bilgisayarında, proje klasöründe)

```
npm install          # paketleri yükler (bir kere)
npm run studio       # tarayıcıda canlı önizleme açar
npm run render       # out/ornek.mp4 videosunu üretir
npm run kontrol      # kodda hata var mı bakar
```

## Seslendirme ekleme

1. ElevenLabs'ten MP3'ü indir, `public/seslendirme.mp3` olarak koy.
2. `src/Root.tsx` içinde `seslendirme: null` yerine `seslendirme: 'seslendirme.mp3'` yaz.

## Yeni video yapmak

`src/videolar/` içine yeni dosya; karakteri bir mekâna koy, poz ve yol ver,
kamerayı anahtar karelerle yönet, `Root.tsx`'e bir `Composition` satırı ekle.
