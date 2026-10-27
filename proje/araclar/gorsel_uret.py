"""OpenAI ile toplu görsel üretimi.
Kullanım: python3 araclar/gorsel_uret.py <bolum> prompts.json
prompts.json: [{"ad": "g01", "prompt": "...", "kalite": "medium"|"high"}, ...]
Çıktı: public/bolumler/<bolum>/<ad>.jpg (1024x1536)
"""
import base64, io, json, os, sys, concurrent.futures as cf
import requests
from PIL import Image

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STIL = os.environ.get('GORSEL_STIL') or ("Photorealistic cinematic space photography, vertical 9:16 composition, dramatic lighting, rich contrast, "
        "ultra detailed, film grain, no text, no letters, no logos, no watermark. ")

def uret(bolum, p):
    k = os.environ.get('OPENAI_API_KEY') or open(os.path.expanduser('~/.gizli/openai_key')).read().strip()
    for deneme in range(3):
        r = requests.post('https://api.openai.com/v1/images/generations',
                          headers={'Authorization': f'Bearer {k}'},
                          json={'model': 'gpt-image-1.5', 'size': '1024x1536', 'quality': p.get('kalite', 'medium'), 'n': 1,
                                'prompt': STIL + p['prompt']}, timeout=300)
        if r.ok:
            im = Image.open(io.BytesIO(base64.b64decode(r.json()['data'][0]['b64_json']))).convert('RGB')
            yol = os.path.join(KOK, 'public', 'bolumler', bolum, p['ad'] + '.jpg')
            im.save(yol, quality=93)
            return p['ad'], 'ok'
        hata = r.text[:200]
    return p['ad'], 'HATA ' + hata

if __name__ == '__main__':
    bolum, dosya = sys.argv[1], sys.argv[2]
    os.makedirs(os.path.join(KOK, 'public', 'bolumler', bolum), exist_ok=True)
    liste = json.load(open(dosya, encoding='utf-8'))
    with cf.ThreadPoolExecutor(5) as ex:
        for ad, durum in ex.map(lambda p: uret(bolum, p), liste):
            print(ad, durum)
