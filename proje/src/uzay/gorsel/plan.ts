// GÖRSEL TABANLI SHORT PLANI
// Her bölüm: hangi görsel hangi saniyede başlar, nasıl hareket eder, hangi kart çıkar.

export type Hareket = 'yaklas' | 'uzaklas' | 'yukari' | 'asagi' | 'sola' | 'saga';
export type Efekt = 'sarsinti' | 'kor' | 'toz' | 'aydinlan' | 'karar';

export type Cekim = {
	gorsel: string; // public/bolumler/<id>/ klasöründeki dosya
	bas: number; // saniye
	hareket: Hareket;
	efekt?: Efekt[];
	odak?: [number, number]; // yakınlaşma merkezi (0-1, 0-1)
};

export type Kart = {bas: number; son: number; baslik: string; alt?: string; renk?: string; ust?: string};

export type GorselPlan = {
	acilis: {ust: string; vurgu: string; alt: string; etiket: string; ustBoyut?: number; vurguBoyut?: number};
	acilisSure?: number; // hook yazısının ekranda kalma süresi (sn)
	altyaziBaslangic?: number; // altyazı bu saniyeden sonra başlar (kapakta yüzü kapatmasın)
	darbeSesi?: string; // ilk saniyedeki vurucu ses efekti
	cekimler: Cekim[];
	kartlar: Kart[];
	kapanisBas: number; // abone ekranının başladığı saniye
	muzik?: string;
};

export const PLANLAR: Record<string, GorselPlan> = {
	'yakin-ay': {
		acilis: {etiket: 'YA OLSAYDI?', ust: "AY, DÜNYA'YA", vurgu: 'İKİ KAT YAKIN', alt: 'OLSAYDI?'},
		cekimler: [
			{gorsel: 'g01.jpg', bas: 0, hareket: 'yukari', efekt: ['toz'], odak: [0.45, 0.4]},
			{gorsel: 'g02.jpg', bas: 4.9, hareket: 'yaklas', efekt: ['toz'], odak: [0.5, 0.35]},
			{gorsel: 'g03.jpg', bas: 11.1, hareket: 'yaklas', efekt: ['sarsinti'], odak: [0.45, 0.55]},
			{gorsel: 'g05.jpg', bas: 16.6, hareket: 'sola', odak: [0.5, 0.6]},
			{gorsel: 'g04.jpg', bas: 22.2, hareket: 'uzaklas', efekt: ['sarsinti'], odak: [0.5, 0.6]},
			{gorsel: 'g06.jpg', bas: 24.8, hareket: 'asagi', efekt: ['aydinlan', 'toz'], odak: [0.6, 0.3]},
			{gorsel: 'g07.jpg', bas: 30.2, hareket: 'yaklas', efekt: ['toz'], odak: [0.5, 0.3]},
			{gorsel: 'g08.jpg', bas: 34.8, hareket: 'saga', odak: [0.5, 0.45]},
			{gorsel: 'g09.jpg', bas: 39.8, hareket: 'yaklas', efekt: ['kor'], odak: [0.55, 0.35]},
			{gorsel: 'g10.jpg', bas: 44.2, hareket: 'uzaklas', efekt: ['toz'], odak: [0.7, 0.2]},
			{gorsel: 'g01.jpg', bas: 50.0, hareket: 'yaklas', efekt: ['karar', 'toz'], odak: [0.45, 0.33]},
		],
		kartlar: [
			{bas: 20.3, son: 24.6, baslik: '8× GELGİT', alt: 'Ay iki kat yakın → gelgit kuvveti 8 kat', renk: '#4fc3ff'},
			{bas: 28.2, son: 30.1, baslik: '4× DAHA PARLAK', alt: 'dolunay ışığı', renk: '#ffd23f'},
			{bas: 33.4, son: 39.6, baslik: 'DAHA SIK', alt: 've daha uzun tam güneş tutulmaları', renk: '#ff8a3d'},
			{bas: 44.3, son: 49.9, baslik: '384.400 km', alt: "bugün Ay'ın ortalama uzaklığı", renk: '#ffffff'},
			{bas: 46.5, son: 49.9, baslik: '+3,8 cm / YIL', alt: 'Ay her yıl uzaklaşıyor', renk: '#7cf0a8', ust: '27%'},
		],
		kapanisBas: 50.0,
		muzik: 'muzik/uzay-ambient.wav',
	},
	'mars-skafandrasiz': {
		acilis: {etiket: '', ust: "MARS'TA KASKINI ÇIKARIRSAN", vurgu: '15 SANİYEN VAR', alt: '', ustBoyut: 112, vurguBoyut: 168},
		acilisSure: 5.6,
		altyaziBaslangic: 1.6,
		darbeSesi: 'muzik/darbe.wav',
		cekimler: [
			{gorsel: 'kapak2.jpg', bas: 0, hareket: 'yaklas', efekt: ['sarsinti', 'toz'], odak: [0.5, 0.55]},
			{gorsel: 'g02.jpg', bas: 1.7, hareket: 'yaklas', efekt: ['toz'], odak: [0.5, 0.45]},
			{gorsel: 'kapak1.jpg', bas: 3.4, hareket: 'yaklas', efekt: ['sarsinti'], odak: [0.45, 0.4]},
			{gorsel: 'g09.jpg', bas: 5.8, hareket: 'yaklas', efekt: ['karar'], odak: [0.6, 0.5]},
			{gorsel: 'kapak3.jpg', bas: 8.3, hareket: 'yukari', efekt: ['toz'], odak: [0.5, 0.3]},
			{gorsel: 'g04.jpg', bas: 12.5, hareket: 'saga', odak: [0.5, 0.5]},
			{gorsel: 'g03.jpg', bas: 17.1, hareket: 'yaklas', efekt: ['sarsinti'], odak: [0.55, 0.5]},
			{gorsel: 'g05.jpg', bas: 19.4, hareket: 'yaklas', odak: [0.35, 0.35]},
			{gorsel: 'g06.jpg', bas: 25.4, hareket: 'sola', efekt: ['toz'], odak: [0.5, 0.5]},
			{gorsel: 'g07.jpg', bas: 30.4, hareket: 'uzaklas', odak: [0.5, 0.5]},
			{gorsel: 'g08.jpg', bas: 33.6, hareket: 'asagi', efekt: ['toz'], odak: [0.5, 0.5]},
			{gorsel: 'g09.jpg', bas: 39.5, hareket: 'yaklas', efekt: ['aydinlan'], odak: [0.6, 0.5]},
			{gorsel: 'g10.jpg', bas: 45.6, hareket: 'yaklas', efekt: ['karar', 'toz'], odak: [0.5, 0.45]},
		],
		kartlar: [
			{bas: 13.6, son: 18.9, baslik: '%0,6', alt: "Mars'ta basınç, Dünya'nınkinin binde altısı", renk: '#38d9ff'},
			{bas: 22.0, son: 25.2, baslik: '37°C’DE KAYNAR', alt: 'bu basınçta su, vücut sıcaklığında kaynar', renk: '#ff8a3d'},
			{bas: 26.6, son: 30.3, baslik: '%95 CO₂', alt: 'Mars atmosferi', renk: '#ffd23f'},
			{bas: 30.5, son: 33.5, baslik: '15 SANİYE', alt: 've bilinç kaybı', renk: '#ff4d4d'},
			{bas: 33.7, son: 39.4, baslik: '−60°C', alt: "Mars'ın ortalama sıcaklığı", renk: '#9fd3ff'},
			{bas: 40.9, son: 45.5, baslik: '~90 SANİYE', alt: 'kurtarılma penceresi', renk: '#7cf0a8'},
		],
		kapanisBas: 45.6,
		muzik: 'muzik/uzay-ambient.wav',
	},
};

// A/B: deneme Reels varyantları (aynı ses, farklı hook ve ilk kare)
PLANLAR['mars-skafandrasiz-b'] = {
	...PLANLAR['mars-skafandrasiz'],
	acilis: {etiket: '', ust: "MARS'TA", vurgu: 'TÜKÜRÜĞÜN KAYNAR', alt: '', ustBoyut: 150, vurguBoyut: 150},
	acilisSure: 3.3,
	altyaziBaslangic: 3.3,
	cekimler: [
		{gorsel: 'kapak1.jpg', bas: 0, hareket: 'yaklas', efekt: ['sarsinti', 'toz'], odak: [0.45, 0.4]},
		{gorsel: 'g02.jpg', bas: 1.7, hareket: 'yaklas', efekt: ['toz'], odak: [0.5, 0.45]},
		{gorsel: 'kapak2.jpg', bas: 3.4, hareket: 'yaklas', efekt: ['sarsinti'], odak: [0.5, 0.55]},
		...PLANLAR['mars-skafandrasiz'].cekimler.slice(3),
	],
};

// GÜNEŞ'İN İÇİNE 1,3 MİLYON DÜNYA — kapak ayrı görsel, videoda kapak yazısı yok (hook direkt başlar)
const gunesBos = {etiket: '', ust: '', vurgu: '', alt: ''};
PLANLAR['gunes-milyon'] = {
	acilis: gunesBos,
	acilisSure: 0,
	darbeSesi: 'muzik/darbe.wav',
	cekimler: [
		{gorsel: 'g01.jpg', bas: 0, hareket: 'yaklas', efekt: ['sarsinti', 'toz'], odak: [0.75, 0.7]},
		{gorsel: 'g04.jpg', bas: 2.9, hareket: 'yaklas', efekt: ['toz'], odak: [0.5, 0.4]},
		{gorsel: 'g08.jpg', bas: 4.3, hareket: 'uzaklas', efekt: ['sarsinti'], odak: [0.85, 0.55]},
		{gorsel: 'g02.jpg', bas: 6.9, hareket: 'yaklas', odak: [0.5, 0.48]},
		{gorsel: 'g03.jpg', bas: 13.1, hareket: 'uzaklas', efekt: ['toz'], odak: [0.5, 0.35]},
		{gorsel: 'kapak-a.jpg', bas: 18.8, hareket: 'yukari', odak: [0.5, 0.45]},
		{gorsel: 'g05.jpg', bas: 24.1, hareket: 'yaklas', efekt: ['aydinlan'], odak: [0.5, 0.45]},
		{gorsel: 'g04.jpg', bas: 29.4, hareket: 'sola', efekt: ['toz'], odak: [0.5, 0.5]},
		{gorsel: 'g06.jpg', bas: 32.5, hareket: 'uzaklas', odak: [0.5, 0.5]},
		{gorsel: 'g07.jpg', bas: 37.0, hareket: 'yaklas', odak: [0.27, 0.22]},
		{gorsel: 'g08.jpg', bas: 39.3, hareket: 'yaklas', efekt: ['sarsinti'], odak: [0.6, 0.5]},
		{gorsel: 'g09.jpg', bas: 43.7, hareket: 'yaklas', efekt: ['kor'], odak: [0.45, 0.8]},
		{gorsel: 'g10.jpg', bas: 46.5, hareket: 'yukari', efekt: ['karar', 'toz'], odak: [0.5, 0.3]},
	],
	kartlar: [
		{bas: 0.8, son: 2.9, baslik: '1.300.000', alt: 'Dünya, Güneş’in içine sığar', renk: '#38d9ff'},
		{bas: 10.0, son: 12.9, baslik: '109 DÜNYA', alt: 'Güneş’in çapı boyunca', renk: '#ffd23f'},
		{bas: 15.1, son: 18.7, baslik: '%99,8', alt: 'Güneş Sistemi’nin kütlesi Güneş’te', renk: '#ff8a3d'},
		{bas: 25.7, son: 29.3, baslik: '4 MİLYON TON', alt: 'her saniye enerjiye dönüşüyor', renk: '#ffffff'},
		{bas: 38.4, son: 43.6, baslik: 'BETELGEUSE', alt: 'çapı Güneş’in ~700 katı', renk: '#ff4d4d'},
	],
	kapanisBas: 49.1,
	muzik: 'muzik/uzay-ambient.wav',
};
PLANLAR['gunes-milyon-b'] = {
	...PLANLAR['gunes-milyon'],
	cekimler: [
		{gorsel: 'g09.jpg', bas: 0, hareket: 'yaklas', efekt: ['sarsinti', 'kor'], odak: [0.45, 0.8]},
		{gorsel: 'g08.jpg', bas: 2.3, hareket: 'uzaklas', efekt: ['toz'], odak: [0.85, 0.55]},
		{gorsel: 'g01.jpg', bas: 5.1, hareket: 'yaklas', efekt: ['sarsinti'], odak: [0.75, 0.7]},
		{gorsel: 'g02.jpg', bas: 7.3, hareket: 'yaklas', odak: [0.5, 0.48]},
		{gorsel: 'g03.jpg', bas: 13.1, hareket: 'uzaklas', efekt: ['toz'], odak: [0.5, 0.35]},
		{gorsel: 'kapak-a.jpg', bas: 19.6, hareket: 'yukari', odak: [0.5, 0.45]},
		{gorsel: 'g05.jpg', bas: 25.0, hareket: 'yaklas', efekt: ['aydinlan'], odak: [0.5, 0.45]},
		{gorsel: 'g04.jpg', bas: 30.3, hareket: 'sola', efekt: ['toz'], odak: [0.5, 0.5]},
		{gorsel: 'g06.jpg', bas: 33.6, hareket: 'uzaklas', odak: [0.5, 0.5]},
		{gorsel: 'g07.jpg', bas: 38.0, hareket: 'yaklas', odak: [0.27, 0.22]},
		{gorsel: 'g08.jpg', bas: 40.2, hareket: 'yaklas', efekt: ['sarsinti'], odak: [0.6, 0.5]},
		{gorsel: 'g09.jpg', bas: 44.5, hareket: 'yaklas', efekt: ['kor'], odak: [0.45, 0.8]},
		{gorsel: 'g10.jpg', bas: 47.5, hareket: 'yukari', efekt: ['karar', 'toz'], odak: [0.5, 0.3]},
	],
	kartlar: [
		{bas: 5.1, son: 7.2, baslik: 'NE KADAR BÜYÜK?', renk: '#38d9ff'},
		{bas: 10.1, son: 13.0, baslik: '109 DÜNYA', alt: 'Güneş’in çapı boyunca', renk: '#ffd23f'},
		{bas: 15.4, son: 19.5, baslik: '%99,8', alt: 'Güneş Sistemi’nin kütlesi Güneş’te', renk: '#ff8a3d'},
		{bas: 26.6, son: 30.2, baslik: '4 MİLYON TON', alt: 'her saniye enerjiye dönüşüyor', renk: '#ffffff'},
		{bas: 39.3, son: 44.4, baslik: 'BETELGEUSE', alt: 'çapı Güneş’in ~700 katı', renk: '#ff4d4d'},
	],
	kapanisBas: 50.2,
};

// A planındaki zamanları, aynı gövdeyi kullanan B seslendirmesine sahne sahne kaydırır
import {BOLUMLER} from '../bolumler';
export const sahneKaydir = (a: GorselPlan, aId: string, bId: string, ilkSahne = 1): Pick<GorselPlan, 'cekimler' | 'kartlar' | 'kapanisBas'> => {
	const sa = BOLUMLER[aId].sahneler;
	const sb = BOLUMLER[bId].sahneler;
	const esle = (t: number) => {
		let i = sa.length - 1;
		while (i > 0 && sa[i].bas > t + 0.05) i--;
		return Math.max(0, +(t - sa[i].bas + sb[i].bas).toFixed(2));
	};
	const govdeBas = sa[ilkSahne].bas - 0.05;
	return {
		cekimler: a.cekimler.filter((c) => c.bas >= govdeBas).map((c) => ({...c, bas: esle(c.bas)})),
		kartlar: a.kartlar.filter((k) => k.bas >= govdeBas).map((k) => ({...k, bas: esle(k.bas), son: esle(k.son)})),
		kapanisBas: esle(a.kapanisBas),
	};
};

// APOPHIS — SEN + Türkiye ölçeği + gerçek ölçekli 3D sahne
PLANLAR['apophis'] = {
	acilis: {etiket: '', ust: '', vurgu: '', alt: ''},
	acilisSure: 0,
	darbeSesi: 'muzik/darbe.wav',
	cekimler: [
		{gorsel: 'g01.jpg', bas: 0, hareket: 'yaklas', efekt: ['sarsinti', 'toz'], odak: [0.5, 0.3]},
		{gorsel: 'kapak-a.jpg', bas: 2.9, hareket: 'yaklas', efekt: ['toz'], odak: [0.5, 0.35]},
		{gorsel: 'g05.jpg', bas: 5.4, hareket: 'yaklas', odak: [0.5, 0.45]},
		{gorsel: 'g09.jpg', bas: 8.1, hareket: 'yukari', efekt: ['toz'], odak: [0.5, 0.4]},
		{gorsel: 'g02.jpg', bas: 11.5, hareket: 'yaklas', efekt: ['sarsinti'], odak: [0.5, 0.45]},
		{gorsel: 'g03.jpg', bas: 12.6, hareket: 'sola', efekt: ['kor'], odak: [0.5, 0.5]},
		{gorsel: 'g04.jpg', bas: 15.4, hareket: 'yukari', odak: [0.5, 0.4]},
		{gorsel: 'g10.jpg', bas: 19.1, hareket: 'yaklas', efekt: ['sarsinti'], odak: [0.5, 0.5]},
		{gorsel: '3d:apophis', bas: 24.7, hareket: 'yaklas'},
		{gorsel: 'g06.jpg', bas: 36.1, hareket: 'yaklas', efekt: ['sarsinti', 'kor'], odak: [0.5, 0.4]},
		{gorsel: 'g07.jpg', bas: 38.4, hareket: 'uzaklas', efekt: ['sarsinti', 'kor'], odak: [0.5, 0.5]},
		{gorsel: 'g08.jpg', bas: 41.8, hareket: 'yukari', efekt: ['aydinlan'], odak: [0.5, 0.4]},
		{gorsel: 'g09.jpg', bas: 47.5, hareket: 'yaklas', efekt: ['toz'], odak: [0.5, 0.35]},
		{gorsel: 'g01.jpg', bas: 52.0, hareket: 'uzaklas', efekt: ['toz'], odak: [0.5, 0.3]},
		{gorsel: 'kapak-a.jpg', bas: 56.8, hareket: 'yaklas', efekt: ['karar', 'toz'], odak: [0.5, 0.35]},
	],
	kartlar: [
		{bas: 3.0, son: 5.3, baslik: '≈ ÇAMLICA KULESİ', alt: '~340 metrelik asteroit', renk: '#38d9ff'},
		{bas: 19.1, son: 23.9, baslik: '%2,7', alt: '2004’te hesaplanan çarpma ihtimali', renk: '#ff4d4d'},
		{bas: 38.6, son: 41.6, baslik: '160.000 HİROŞİMA', alt: 'çarpsaydı açığa çıkacak enerji', renk: '#ff8a3d'},
		{bas: 44.8, son: 47.3, baslik: '100+ YIL', alt: 'çarpma riski yok (NASA)', renk: '#7cf0a8'},
		{bas: 47.6, son: 51.8, baslik: '14 NİSAN 2029 · 00:46', alt: 'en yakın an, Türkiye saatiyle (yaklaşık)', renk: '#ffffff'},
	],
	kapanisBas: 56.8,
	muzik: 'muzik/uzay-ambient.wav',
};
const apophisB = sahneKaydir(PLANLAR['apophis'], 'apophis', 'apophis-b');
PLANLAR['apophis-b'] = {
	...PLANLAR['apophis'],
	cekimler: [
		{gorsel: 'g10.jpg', bas: 0, hareket: 'yaklas', efekt: ['sarsinti', 'toz'], odak: [0.5, 0.5]},
		{gorsel: 'g02.jpg', bas: 3.4, hareket: 'yaklas', efekt: ['sarsinti'], odak: [0.5, 0.45]},
		{gorsel: 'g05.jpg', bas: 6.0, hareket: 'yaklas', odak: [0.5, 0.45]},
		...apophisB.cekimler,
	],
	kartlar: [{bas: 3.4, son: 5.9, baslik: '%2,7', alt: 'bir zamanlar çarpma ihtimali', renk: '#ff4d4d'}, ...apophisB.kartlar],
	kapanisBas: apophisB.kapanisBas,
};

// GÜNEŞ FUTBOL TOPU OLSA — Türkiye ölçeği (Taksim) + 3D dünya küresi rotası
PLANLAR['futbol-gunes'] = {
	acilis: {etiket: '', ust: '', vurgu: '', alt: ''},
	acilisSure: 0,
	darbeSesi: 'muzik/darbe.wav',
	cekimler: [
		{gorsel: 'g01.jpg', bas: 0, hareket: 'yaklas', efekt: ['sarsinti', 'kor'], odak: [0.5, 0.65]},
		{gorsel: 'g08.jpg', bas: 3.9, hareket: 'yukari', efekt: ['toz'], odak: [0.5, 0.4]},
		{gorsel: 'g09.jpg', bas: 6.2, hareket: 'yaklas', odak: [0.5, 0.5]},
		{gorsel: 'g02.jpg', bas: 8.0, hareket: 'yaklas', odak: [0.5, 0.5]},
		{gorsel: 'g01.jpg', bas: 11.0, hareket: 'uzaklas', efekt: ['kor'], odak: [0.5, 0.6]},
		{gorsel: 'g03.jpg', bas: 14.0, hareket: 'yaklas', odak: [0.5, 0.5]},
		{gorsel: 'g04.jpg', bas: 18.6, hareket: 'yaklas', efekt: ['toz'], odak: [0.5, 0.5]},
		{gorsel: 'g05.jpg', bas: 23.0, hareket: 'yukari', odak: [0.5, 0.5]},
		{gorsel: 'g06.jpg', bas: 29.4, hareket: 'sola', efekt: ['toz'], odak: [0.5, 0.45]},
		{gorsel: 'g07.jpg', bas: 34.1, hareket: 'yaklas', odak: [0.5, 0.4]},
		{gorsel: '3d:proxima', bas: 37.2, hareket: 'yaklas'},
		{gorsel: 'g09.jpg', bas: 43.6, hareket: 'uzaklas', efekt: ['karar', 'toz'], odak: [0.5, 0.5]},
	],
	kartlar: [
		{bas: 0.6, son: 3.8, baslik: 'GÜNEŞ = FUTBOL TOPU', alt: '22 cm, Taksim Meydanı’nda', renk: '#ffd23f'},
		{bas: 9.0, son: 10.9, baslik: '2 MM', alt: 'Dünya: toplu iğne başı', renk: '#38d9ff'},
		{bas: 11.8, son: 13.9, baslik: '24 METRE', alt: 'Dünya’nın toptan uzaklığı', renk: '#ffffff'},
		{bas: 14.9, son: 17.9, baslik: '0,5 MM · 6 CM', alt: 'Ay ve Dünya’ya uzaklığı', renk: '#cfd8e3'},
		{bas: 20.1, son: 22.7, baslik: '2 CM · 120 M', alt: 'Jüpiter', renk: '#ff8a3d'},
		{bas: 24.7, son: 28.9, baslik: '700 METRE', alt: 'Neptün: Galatasaray Lisesi', renk: '#7cc4ff'},
		{bas: 32.5, son: 36.9, baslik: '~4 KM', alt: 'Voyager 1: Ortaköy', renk: '#7cf0a8'},
	],
	kapanisBas: 46.3,
	muzik: 'muzik/uzay-ambient.wav',
};
const futbolB = sahneKaydir(PLANLAR['futbol-gunes'], 'futbol-gunes', 'futbol-gunes-b');
PLANLAR['futbol-gunes-b'] = {
	...PLANLAR['futbol-gunes'],
	cekimler: [
		{gorsel: 'g07.jpg', bas: 0, hareket: 'yaklas', efekt: ['sarsinti', 'toz'], odak: [0.5, 0.4]},
		{gorsel: 'g06.jpg', bas: 2.9, hareket: 'sola', odak: [0.5, 0.45]},
		{gorsel: 'g01.jpg', bas: 5.2, hareket: 'yaklas', efekt: ['kor'], odak: [0.5, 0.65]},
		...futbolB.cekimler,
	],
	kartlar: [{bas: 0.3, son: 4.6, baslik: '~4 KM', alt: 'Voyager 1, Taksim’den Ortaköy’e', renk: '#7cf0a8'}, ...futbolB.kartlar],
	kapanisBas: 43.9,
};
