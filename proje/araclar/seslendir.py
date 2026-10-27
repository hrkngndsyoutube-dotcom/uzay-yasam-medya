"""SESLENDİRME ARACI
Kullanım:  python3 araclar/seslendir.py iki-gunes
           python3 araclar/seslendir.py iki-gunes --tahmini   (ses üretmeden, tahmini zamanlarla)

bolumler/<id>/metin.json  →  public/bolumler/<id>/ses.mp3  +  src/uzay/bolumler/<id>.json
Zaman dosyası: her kelimenin ve her sahnenin başlangıç/bitiş saniyesi (altyazı ve sahne geçişleri için).
ElevenLabs anahtarı ~/.gizli/elevenlabs_key dosyasından (veya ELEVENLABS_API_KEY ortam değişkeninden) okunur.
"""
import base64, json, os, re, sys

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def anahtar():
    if os.environ.get('ELEVENLABS_API_KEY'):
        return os.environ['ELEVENLABS_API_KEY']
    return open(os.path.expanduser('~/.gizli/elevenlabs_key')).read().strip()


def main():
    bid = sys.argv[1]
    tahmini = '--tahmini' in sys.argv
    m = json.load(open(os.path.join(KOK, 'bolumler', bid, 'metin.json'), encoding='utf-8'))

    # tam metin + her sahnenin karakter aralığı
    parcalar, araliklar, pos = [], [], 0
    for s in m['sahneler']:
        t = s['metin'].strip()
        araliklar.append((s['sahne'], pos, pos + len(t)))
        parcalar.append(t)
        pos += len(t) + 1
    metin = ' '.join(parcalar)

    if tahmini:
        bas = [i * 0.062 for i in range(len(metin))]
        son = [b + 0.062 for b in bas]
        ses_var = False
    else:
        import requests
        v = m['ses']
        r = requests.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{v['voice_id']}/with-timestamps",
            headers={'xi-api-key': anahtar(), 'Content-Type': 'application/json'},
            json={
                'text': metin,
                'model_id': v.get('model', 'eleven_multilingual_v2'),
                'language_code': 'tr',
                'voice_settings': v.get('ayar', {'stability': 0.45, 'similarity_boost': 0.8, 'style': 0.25, 'use_speaker_boost': True}),
                **({'seed': v['seed']} if 'seed' in v else {}),
            },
            params={'output_format': 'mp3_44100_128'},
            timeout=180,
        )
        if not r.ok:
            sys.exit(f'ElevenLabs hatası {r.status_code}: {r.text[:300]}')
        d = r.json()
        klasor = os.path.join(KOK, 'public', 'bolumler', bid)
        os.makedirs(klasor, exist_ok=True)
        open(os.path.join(klasor, 'ses.mp3'), 'wb').write(base64.b64decode(d['audio_base64']))
        a = d.get('normalized_alignment') or d['alignment']
        if ''.join(a['characters']) != metin:
            a = d['alignment']
        bas, son = a['character_start_times_seconds'], a['character_end_times_seconds']
        ses_var = True

    # kelimeler
    kelimeler = []
    for mt in re.finditer(r'\S+', metin):
        i, j = mt.start(), mt.end() - 1
        if i < len(bas) and j < len(son):
            kelimeler.append({'k': mt.group(), 'bas': round(bas[i], 3), 'son': round(son[j], 3), 'i': i})

    # altyazı düzeltmeleri (ör. "on altı b" → "16b")
    for eski, yeni in m.get('altyaziDuzelt', []):
        parca = eski.split()
        n = len(parca)
        k = 0
        while k <= len(kelimeler) - n:
            grup = [re.sub(r'[^\wçğıöşü]', '', w['k'].lower()) for w in kelimeler[k:k + n]]
            if grup == parca:
                noktalama = re.sub(r'[\wçğıöşüÇĞİÖŞÜ]', '', kelimeler[k + n - 1]['k'])
                kelimeler[k:k + n] = [{'k': yeni + noktalama, 'bas': kelimeler[k]['bas'], 'son': kelimeler[k + n - 1]['son'], 'i': kelimeler[k]['i']}]
            k += 1

    sahneler = []
    for ad, a0, a1 in araliklar:
        ws = [w for w in kelimeler if a0 <= w['i'] < a1]
        sahneler.append({'sahne': ad, 'bas': ws[0]['bas'], 'son': ws[-1]['son']})

    cikti = {
        'id': bid,
        'baslik': m['baslik'],
        'ses': f'bolumler/{bid}/ses.mp3' if ses_var else None,
        'toplam': round(kelimeler[-1]['son'] + 1.2, 2),
        'sahneler': sahneler,
        'kelimeler': [{'k': w['k'], 'bas': w['bas'], 'son': w['son']} for w in kelimeler],
    }
    yol = os.path.join(KOK, 'src', 'uzay', 'bolumler', f'{bid}.json')
    os.makedirs(os.path.dirname(yol), exist_ok=True)
    json.dump(cikti, open(yol, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"Tamam: {len(kelimeler)} kelime, {cikti['toplam']} sn, ses={'var' if ses_var else 'yok'}")
    for s in sahneler:
        print(f"  {s['sahne']:10s} {s['bas']:6.2f} → {s['son']:6.2f}")


if __name__ == '__main__':
    main()
