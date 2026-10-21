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
	acilis: {ust: string; vurgu: string; alt: string; etiket: string};
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
};
