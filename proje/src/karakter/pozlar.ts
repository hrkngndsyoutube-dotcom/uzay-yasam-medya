// POZ KÜTÜPHANESİ
// Bir poz = karakterin eklem açıları (radyan). 0 = uzuv dümdüz aşağı bakar.
// Pozitif açı = uzuv öne (karakterin baktığı yöne) doğru kalkar.

export type Poz = {
	kalca: number; // kalçanın yerden yüksekliği (karakter birimi)
	govde: number; // gövdenin öne eğilmesi
	bas: number; // başın öne eğilmesi
	onBacak: [number, number]; // [üst bacak, diz]
	arkaBacak: [number, number];
	onKol: [number, number]; // [üst kol, dirsek]
	arkaKol: [number, number];
	goz: number; // 1 = açık, 0 = kapalı (göz kırpma)
};

export const UST_BACAK = 0.46;
export const ALT_BACAK = 0.46;
const AYAK_PAYI = 0.04;

// Bacak açılarına göre kalçayı yere oturtur (ayak kaymasın diye)
export const zemineOturt = (p: Poz): Poz => {
	const dikey = ([u, a]: [number, number]) =>
		UST_BACAK * Math.cos(u) + ALT_BACAK * Math.cos(u + a);
	return {...p, kalca: Math.max(dikey(p.onBacak), dikey(p.arkaBacak)) + AYAK_PAYI};
};

export const AYAKTA: Poz = zemineOturt({
	kalca: 0.96,
	govde: 0,
	bas: 0,
	onBacak: [0.02, 0],
	arkaBacak: [-0.04, 0],
	onKol: [0.08, 0.12],
	arkaKol: [-0.08, 0.12],
	goz: 1,
});

// Oturma: kalça yüksekliği oturulan yere göre verilir
export const oturmus = (kalca: number): Poz => ({
	kalca,
	govde: -0.06,
	bas: 0.05,
	onBacak: [1.5, -1.45],
	arkaBacak: [1.45, -1.35],
	onKol: [0.55, 0.75],
	arkaKol: [0.45, 0.75],
	goz: 1,
});

// Yürüme döngüsü: faz ilerledikçe adım atar
export const yuruyus = (faz: number): Poz => {
	const bacak = (f: number): [number, number] => [
		0.42 * Math.sin(f),
		-(0.08 + 0.75 * Math.max(0, Math.cos(f))),
	];
	const kol = (f: number): [number, number] => [0.38 * Math.sin(f), 0.2 + 0.25 * Math.max(0, Math.sin(f))];
	return zemineOturt({
		kalca: 0,
		govde: 0.06,
		bas: 0,
		onBacak: bacak(faz),
		arkaBacak: bacak(faz + Math.PI),
		onKol: kol(faz + Math.PI),
		arkaKol: kol(faz),
		goz: 1,
	});
};

// Elini öne uzatma (bir şey almak, kapı açmak, düğmeye basmak)
export const uzanma = (temel: Poz, miktar: number, yukseklik = 0): Poz =>
	karistir(
		temel,
		{
			...temel,
			govde: temel.govde + 0.32,
			bas: 0.2,
			onKol: [1.15 + yukseklik, 0.25],
		},
		miktar,
	);

// Klavyede yazma (oturur pozda)
export const yazma = (temel: Poz, frame: number): Poz => ({
	...temel,
	govde: 0.12,
	bas: 0.15,
	onKol: [0.95 + 0.06 * Math.sin(frame * 0.9), 0.75],
	arkaKol: [0.9 + 0.06 * Math.sin(frame * 0.9 + 2), 0.75],
});

// İki poz arasında yumuşak geçiş (t: 0 → a, 1 → b)
export const karistir = (a: Poz, b: Poz, t: number): Poz => {
	const k = Math.min(1, Math.max(0, t));
	const l = (x: number, y: number) => x + (y - x) * k;
	const c = (x: [number, number], y: [number, number]): [number, number] => [l(x[0], y[0]), l(x[1], y[1])];
	return {
		kalca: l(a.kalca, b.kalca),
		govde: l(a.govde, b.govde),
		bas: l(a.bas, b.bas),
		onBacak: c(a.onBacak, b.onBacak),
		arkaBacak: c(a.arkaBacak, b.arkaBacak),
		onKol: c(a.onKol, b.onKol),
		arkaKol: c(a.arkaKol, b.arkaKol),
		goz: l(a.goz, b.goz),
	};
};

// Ara sıra göz kırpma
export const gozKirp = (p: Poz, frame: number, ofset = 0): Poz => {
	const f = (frame + ofset) % 110;
	return {...p, goz: f < 4 ? 0.1 : 1};
};
