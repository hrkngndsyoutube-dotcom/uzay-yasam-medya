import React from 'react';
import {interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export type Kelime = {k: string; bas: number; son: number};

export const FontYukle: React.FC = () => (
	<style>{`
@font-face { font-family: 'UzayBaslik'; src: url('${staticFile('fontlar/Inter-Black.otf')}') format('opentype'); font-weight: 900; }
@font-face { font-family: 'UzayYazi'; src: url('${staticFile('fontlar/Inter-ExtraBold.otf')}') format('opentype'); font-weight: 800; }
@font-face { font-family: 'UzayKapak'; src: url('${staticFile('fontlar/anton-latin-400-normal.woff2')}') format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: 'UzayKapak'; src: url('${staticFile('fontlar/anton-latin-ext-400-normal.woff2')}') format('woff2'); unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF; }
`}</style>
);

// Kelimeleri 1-3 kelimelik parçalara böler (noktalamada keser)
const parcala = (kelimeler: Kelime[]) => {
	const parcalar: Kelime[][] = [];
	let simdiki: Kelime[] = [];
	kelimeler.forEach((w) => {
		simdiki.push(w);
		const bitis = /[.,!?:…]$/.test(w.k);
		const uzun = simdiki.map((x) => x.k).join(' ').length > 16;
		if (bitis || simdiki.length >= 3 || uzun) {
			parcalar.push(simdiki);
			simdiki = [];
		}
	});
	if (simdiki.length) parcalar.push(simdiki);
	return parcalar;
};

// Sesle senkron, kelime kelime vurgulanan büyük altyazı
export const Altyazi: React.FC<{kelimeler: Kelime[]; ust?: string}> = ({kelimeler, ust = '70%'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const parcalar = React.useMemo(() => parcala(kelimeler), [kelimeler]);
	const idx = parcalar.findIndex((p, i) => t >= p[0].bas - 0.05 && (i === parcalar.length - 1 || t < parcalar[i + 1][0].bas - 0.05));
	if (idx < 0) return null;
	const p = parcalar[idx];
	if (t > p[p.length - 1].son + 0.6) return null;
	const baslangicKare = Math.round((p[0].bas - 0.05) * fps);
	const s = spring({frame: frame - baslangicKare, fps, config: {damping: 14, stiffness: 220}});
	return (
		<div
			style={{
				position: 'absolute',
				top: ust,
				left: 60,
				right: 60,
				textAlign: 'center',
				transform: `scale(${interpolate(s, [0, 1], [0.82, 1])})`,
				fontFamily: 'UzayBaslik, Arial Black, sans-serif',
				fontSize: 92,
				lineHeight: 1.12,
				letterSpacing: 1,
			}}
		>
			{p.map((w, i) => {
				const sonraki = i < p.length - 1 ? p[i + 1].bas : w.son + 0.4;
				const aktif = t >= w.bas - 0.03 && t < sonraki - 0.03;
				return (
					<span
						key={i}
						style={{
							color: aktif ? '#38d9ff' : '#ffffff',
							WebkitTextStroke: '6px #000',
							paintOrder: 'stroke fill',
							textShadow: '0 8px 22px rgba(0,0,0,0.65)',
							marginRight: 22,
							display: 'inline-block',
						}}
					>
						{w.k.toLocaleUpperCase('tr-TR')}
					</span>
				);
			})}
		</div>
	);
};

// Açılıştaki büyük soru başlığı
export const AcilisBasligi: React.FC<{metin: string; sure: number}> = ({metin, sure}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame, fps, config: {damping: 12}});
	const op = interpolate(frame, [sure - 10, sure], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute',
				top: '11%',
				left: 50,
				right: 50,
				textAlign: 'center',
				opacity: op,
				transform: `translateY(${interpolate(s, [0, 1], [-60, 0])}px)`,
			}}
		>
			<div
				style={{
					display: 'inline-block',
					background: '#ffd23f',
					color: '#111',
					fontFamily: 'UzayBaslik, Arial Black, sans-serif',
					fontSize: 74,
					lineHeight: 1.1,
					padding: '22px 34px',
					borderRadius: 22,
					boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
				}}
			>
				{metin.toLocaleUpperCase('tr-TR')}
			</div>
		</div>
	);
};

// Bilgi kartı (rakam, isim, tarih göstermek için)
export const BilgiKarti: React.FC<{baslik: string; alt?: string; renk?: string; ust?: string; giris: number}> = ({
	baslik,
	alt,
	renk = '#ffd23f',
	ust = '14%',
	giris,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < giris) return null;
	const s = spring({frame: frame - giris, fps, config: {damping: 13}});
	return (
		<div style={{position: 'absolute', top: ust, left: 0, right: 0, textAlign: 'center', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`}}>
			<div
				style={{
					display: 'inline-block',
					padding: '20px 40px',
					borderRadius: 26,
					background: 'rgba(8,12,28,0.78)',
					border: `5px solid ${renk}`,
					boxShadow: `0 0 40px ${renk}66`,
				}}
			>
				<div style={{fontFamily: 'UzayBaslik, sans-serif', fontSize: 96, color: renk, lineHeight: 1}}>{baslik}</div>
				{alt ? <div style={{fontFamily: 'UzayYazi, sans-serif', fontSize: 42, color: '#fff', marginTop: 10}}>{alt}</div> : null}
			</div>
		</div>
	);
};
