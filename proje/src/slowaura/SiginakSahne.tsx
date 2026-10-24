import React from 'react';
import {AbsoluteFill, Audio, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {tohumlu} from '../uzay/gok';

// SLOW AURA: iç mekân sığınak sahnesi — ateş titreşimi, pencerede yağmur, şimşek, buhar, lamba ışıkları
export type Bolge = {x: number; y: number; w: number; h: number}; // 0-1 oranları
export type SiginakProps = {
	arka: string;
	ses?: string;
	pencere: Bolge;
	ates: {x: number; y: number; r: number};
	lambalar?: {x: number; y: number; r: number}[];
	buhar?: {x: number; y: number};
	simsekler?: number[]; // saniye
	atesKutu?: Bolge; // hareketli alev bölgesi
	atesVideo?: string; // gerçek alev görüntüsü (döngü, 28 sn)
	karartBas?: number; // bu saniyeden sonra ekran yavaşça kararır
	dongu?: number; // tüm hareketlerin tam döngü süresi (sn) — segmentler kesintisiz birleşir
	karartma?: [number, number]; // kompozisyon boyunca karartma (başlangıç, bitiş) 0-1
};

const gurultu = (t: number, s: number) => Math.sin(t * 2.1 + s) * 0.5 + Math.sin(t * 5.3 + s * 2) * 0.3 + Math.sin(t * 11.7 + s * 3) * 0.2;

export const SiginakSahne: React.FC<SiginakProps> = ({arka, ses, pencere, ates, lambalar = [], buhar, simsekler = [], karartBas, atesKutu, atesVideo, dongu = 28, karartma}) => {
	const f = useCurrentFrame();
	const {fps, width: W, height: H} = useVideoConfig();
	const t = f / fps;
	const damla = React.useMemo(() => {
		const r = tohumlu(29);
		return Array.from({length: 70}).map(() => ({x: r(), y: r(), v: 0.6 + r() * 0.9, u: 0.03 + r() * 0.05, op: 0.15 + r() * 0.3}));
	}, []);
	const akan = React.useMemo(() => {
		const r = tohumlu(31);
		return Array.from({length: 18}).map(() => ({x: r(), y: r(), v: 0.03 + r() * 0.05, op: 0.25 + r() * 0.3}));
	}, []);
	// şimşek: iki hızlı çakma
	let simsek = 0;
	for (const s of simsekler) {
		const d = t - s;
		if (d >= 0 && d < 0.9) simsek = Math.max(simsek, d < 0.08 ? 1 : d < 0.18 ? 0.25 : d < 0.28 ? 0.8 : Math.max(0, 0.8 - (d - 0.28) * 1.4));
	}
	const fz = (t / dongu) * Math.PI * 2;
	const pg = (k: number) => 0.5 * Math.sin(7 * fz + k) + 0.3 * Math.sin(17 * fz + k * 2) + 0.2 * Math.sin(31 * fz + k * 3);
	const atesG = 0.85 + 0.15 * pg(1);
	const {durationInFrames: DF} = useVideoConfig();
	const kararma = karartma ? interpolate(f, [0, DF - 1], karartma) : karartBas !== undefined ? interpolate(t, [karartBas, karartBas + 60], [0, 0.82], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
	const P = {left: pencere.x * W, top: pencere.y * H, width: pencere.w * W, height: pencere.h * H};
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<Img src={staticFile(arka)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${0.97 + 0.03 * atesG})`}} />
			{/* gerçek alev görüntüsü soba camına yerleştirilir */}
			{atesKutu && atesVideo ? (() => {
				const K = {left: atesKutu.x * W, top: atesKutu.y * H, width: atesKutu.w * W, height: atesKutu.h * H};
				const maske = 'radial-gradient(ellipse 52% 55% at 50% 55%, #000 55%, transparent 100%)';
				return (
					<div style={{position: 'absolute', ...K, overflow: 'hidden', WebkitMaskImage: maske, maskImage: maske}}>
						<div style={{position: 'absolute', inset: 0, background: '#000', opacity: 0.55}} />
						<Loop durationInFrames={28 * fps}>
							<OffthreadVideo src={staticFile(atesVideo)} muted style={{position: 'absolute', width: '135%', height: '135%', left: '-17%', top: '-12%', objectFit: 'cover', mixBlendMode: 'screen', opacity: 0.95}} />
						</Loop>
					</div>
				);
			})() : null}
			{/* pencere: şimşek ışığı + yağmur */}
			<div style={{position: 'absolute', ...P, overflow: 'hidden'}}>
				<div style={{position: 'absolute', inset: 0, background: '#cfe2ff', opacity: simsek * 0.42, mixBlendMode: 'screen'}} />
				<svg width={P.width} height={P.height} style={{position: 'absolute', inset: 0}}>
					{damla.map((d, i) => {
						const y = ((d.y + (t * Math.round(d.v * dongu)) / dongu) % 1) * P.height;
						return <line key={i} x1={d.x * P.width} y1={y} x2={d.x * P.width - 3} y2={y + d.u * P.height} stroke="#dfe8f5" strokeOpacity={d.op} strokeWidth={1.4} />;
					})}
					{akan.map((d, i) => {
						const y = ((d.y + (t * Math.max(1, Math.round(d.v * dongu))) / dongu) % 1) * P.height;
						return <circle key={'a' + i} cx={d.x * P.width + Math.sin((t * 2 * Math.PI * 4) / dongu + i) * 2} cy={y} r={2.4} fill="#eef4ff" opacity={d.op} />;
					})}
				</svg>
			</div>
			{/* şimşek odaya da vurur (pencereden gelen soğuk ışık) */}
			<AbsoluteFill style={{background: `radial-gradient(ellipse 45% 55% at ${(pencere.x + pencere.w / 2) * 100}% ${(pencere.y + pencere.h / 2) * 100}%, rgba(190,215,255,${0.22 * simsek}), rgba(0,0,0,0) 70%)`}} />
			{/* ateş ışığı titreşimi */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle ${ates.r * W}px at ${ates.x * 100}% ${ates.y * 100}%, rgba(255,150,50,${0.22 * atesG}), rgba(255,120,30,${0.08 * atesG}) 45%, rgba(0,0,0,0) 100%)`,
					mixBlendMode: 'screen',
				}}
			/>
			{lambalar.map((l, i) => (
				<AbsoluteFill
					key={i}
					style={{
						background: `radial-gradient(circle ${l.r * W}px at ${l.x * 100}% ${l.y * 100}%, rgba(255,190,90,${0.12 * (0.9 + 0.1 * pg(i + 5))}), rgba(0,0,0,0) 100%)`,
						mixBlendMode: 'screen',
					}}
				/>
			))}
			{/* çaydanlık buharı */}
			{buhar ? (
				<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
					<defs>
						<filter id="bul">
							<feGaussianBlur stdDeviation="14" />
						</filter>
					</defs>
					{Array.from({length: 6}).map((_, i) => {
						const p = ((t * 0.25 + i / 6) % 1);
						const x = buhar.x * W + Math.sin(p * 6 + i) * 18 * p;
						const y = buhar.y * H - p * 170;
						return <circle key={i} cx={x} cy={y} r={14 + p * 30} fill="#ffffff" opacity={0.12 * Math.sin(p * Math.PI)} filter="url(#bul)" />;
					})}
				</svg>
			) : null}
			<AbsoluteFill style={{background: '#000', opacity: kararma}} />
			{kararma > 0.01 && simsek > 0 ? (
				<>
					<div style={{position: 'absolute', ...P, background: '#cfe2ff', opacity: simsek * 0.35 * kararma}} />
					<AbsoluteFill style={{background: `radial-gradient(ellipse 45% 55% at ${(pencere.x + pencere.w / 2) * 100}% ${(pencere.y + pencere.h / 2) * 100}%, rgba(190,215,255,${0.18 * simsek * kararma}), rgba(0,0,0,0) 70%)`}} />
				</>
			) : null}
			{ses ? <Audio src={staticFile(ses)} /> : null}
		</AbsoluteFill>
	);
};
