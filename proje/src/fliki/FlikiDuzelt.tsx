import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FontYukle} from '../uzay/Altyazi';
import {KAPAK_RENK} from '../uzay/gorsel/GorselShort';

// FLİKİ VİDEOSU DÜZELTME: güçlü kanca açılışı, kötü sahne değişimi, tempo için zoom/punch-in
const FPS = 30;
const KESIM = [0, 5.1, 13.3, 18.3, 24.8, 28.7, 32.63, 37.93, 45.93, 53.77, 61.31];

const KaynakZoom: React.FC = () => {
	const f = useCurrentFrame();
	const t = f / FPS;
	let i = 0;
	while (i < KESIM.length - 2 && t >= KESIM[i + 1]) i++;
	const a = KESIM[i];
	const b = KESIM[i + 1];
	const p = (t - a) / (b - a);
	const yon = i % 2 === 0 ? 1 : -1;
	let s = yon > 0 ? 1.02 + 0.07 * p : 1.09 - 0.07 * p;
	if (b - a > 5 && p > 0.5) s *= 1.12; // uzun sahnede ortada kesme hissi
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<OffthreadVideo src={staticFile('fliki/kaynak.mp4')} style={{width: '100%', height: '100%', transform: `scale(${s})`, transformOrigin: '50% 45%'}} />
		</AbsoluteFill>
	);
};

const Resim: React.FC<{src: string; sure: number; sarsinti?: boolean; yaklas?: boolean}> = ({src, sure, sarsinti, yaklas = true}) => {
	const f = useCurrentFrame();
	const p = interpolate(f, [0, sure], [0, 1], {extrapolateRight: 'clamp'});
	const s = yaklas ? 1.05 + 0.15 * p : 1.2 - 0.15 * p;
	const g = sarsinti ? interpolate(f, [0, sure], [10, 3]) : 0;
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
			<Img
				src={staticFile(src)}
				style={{width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${Math.sin(f * 1.9) * g}px, ${Math.cos(f * 2.3) * g * 0.8}px) scale(${s})`}}
			/>
		</AbsoluteFill>
	);
};

const Kanca: React.FC = () => {
	const f = useCurrentFrame();
	const otur = interpolate(f, [0, 10], [1.08, 1], {extrapolateRight: 'clamp'});
	const anton: React.CSSProperties = {fontFamily: 'UzayKapak, Impact, sans-serif', lineHeight: 1.0, paddingTop: 20, marginTop: -20, textAlign: 'center'};
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 30% at 50% 44%, rgba(0,0,0,0.65), rgba(0,0,0,0) 100%)'}} />
			<div style={{position: 'absolute', top: '44%', left: 60, right: 60, transform: `translateY(-50%) scale(${otur})`}}>
				<div style={{...anton, fontSize: 132, background: KAPAK_RENK.gumus, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.9)) drop-shadow(0 14px 28px rgba(0,0,0,0.85))'}}>
					COVID'İ AĞIR GEÇİRDİYSEN
				</div>
				<div style={{...anton, fontSize: 104, color: KAPAK_RENK.vurgu, marginTop: 6, textShadow: '0 6px 0 rgba(0,0,0,0.9), 0 14px 30px rgba(0,0,0,0.9)'}}>SEBEBİ 50 BİN YIL ÖNCE</div>
			</div>
		</AbsoluteFill>
	);
};

const Alt: React.FC<{metin: string}> = ({metin}) => (
	<div style={{position: 'absolute', top: 1150, left: 60, right: 60, textAlign: 'center', fontFamily: 'UzayYazi, sans-serif', fontSize: 54, color: '#fff', textShadow: '0 3px 10px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.9)'}}>{metin}</div>
);

const sn = (x: number) => Math.round(x * FPS);

export const FlikiDuzelt: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		<FontYukle />
		<KaynakZoom />
		{/* açılış: kanca */}
		<Sequence durationInFrames={sn(2.6)}>
			<Resim src="fliki/h1.jpg" sure={sn(2.6)} sarsinti />
		</Sequence>
		<Sequence from={sn(2.6)} durationInFrames={sn(5.1) - sn(2.6)}>
			<Resim src="fliki/h2.jpg" sure={sn(2.5)} />
		</Sequence>
		<Sequence durationInFrames={sn(5.1)}>
			<Kanca />
		</Sequence>
		{/* müze fotoğrafı yerine */}
		<Sequence from={sn(24.8)} durationInFrames={sn(26.6) - sn(24.8)}>
			<Resim src="fliki/m1.jpg" sure={sn(1.8)} />
		</Sequence>
		<Sequence from={sn(26.6)} durationInFrames={sn(28.7) - sn(26.6)}>
			<Resim src="fliki/m2.jpg" sure={sn(2.1)} yaklas={false} />
		</Sequence>
		<Sequence from={sn(25.5)} durationInFrames={sn(26.25) - sn(25.5)}>
			<Alt metin="Daha kısa," />
		</Sequence>
		<Sequence from={sn(26.25)} durationInFrames={sn(28.0) - sn(26.25)}>
			<Alt metin="daha geniş omuzlu," />
		</Sequence>
		<Sequence from={sn(28.0)} durationInFrames={sn(28.7) - sn(28.0)}>
			<Alt metin="beyni bizimkinden" />
		</Sequence>
	</AbsoluteFill>
);
