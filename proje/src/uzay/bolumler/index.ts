// Uzay&Yaşam bölümleri: seslendirme aracının ürettiği zaman dosyaları
import ikiGunes from './iki-gunes.json';
import yakinAy from './yakin-ay.json';

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
};
