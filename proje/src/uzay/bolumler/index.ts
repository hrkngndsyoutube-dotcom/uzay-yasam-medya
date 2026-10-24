// Uzay&Yaşam bölümleri: seslendirme aracının ürettiği zaman dosyaları
import ikiGunes from './iki-gunes.json';
import yakinAy from './yakin-ay.json';
import marsSkafandrasiz from './mars-skafandrasiz.json';
import gunesMilyon from './gunes-milyon.json';
import gunesMilyonB from './gunes-milyon-b.json';
import apophis from './apophis.json';
import apophisB from './apophis-b.json';
import futbolGunes from './futbol-gunes.json';
import futbolGunesB from './futbol-gunes-b.json';
import ay1453 from './ay-1453.json';
import ay1453B from './ay-1453-b.json';

export type BolumZaman = {
	id: string;
	baslik: string;
	ses: string | null;
	toplam: number;
	sahneler: {sahne: string; bas: number; son: number}[];
	kelimeler: {k: string; bas: number; son: number}[];
};

export const BOLUMLER: Record<string, BolumZaman> = {
	'iki-gunes': ikiGunes as BolumZaman,
	'yakin-ay': yakinAy as BolumZaman,
	'mars-skafandrasiz': marsSkafandrasiz as BolumZaman,
	'gunes-milyon': gunesMilyon as BolumZaman,
	'gunes-milyon-b': gunesMilyonB as BolumZaman,
	'apophis': apophis as BolumZaman,
	'apophis-b': apophisB as BolumZaman,
	'futbol-gunes': futbolGunes as BolumZaman,
	'futbol-gunes-b': futbolGunesB as BolumZaman,
	'ay-1453': ay1453 as BolumZaman,
	'ay-1453-b': ay1453B as BolumZaman,
};
