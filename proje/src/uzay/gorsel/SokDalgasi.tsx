import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// GERÇEK ÖLÇEKLİ ŞOK DALGASI: NASA uydu görüntüsünde Taksim merkezli halka (yarıçap km cinsinden ölçekli)
// Görüntü 1280x1489; Taksim ≈ (750, 880) px; ölçek ≈ 30,4 px/km (Boğaz uzunluğundan kalibre).
const IMG_W = 1280;
const IMG_H = 1489;
const MERKEZ = {x: 750, y: 880};
const PX_KM = 30.4;

export const SokDalgasi: React.FC<{sure: number; yaricapKm: number; etiket?: string}> = ({sure, yaricapKm, etiket = 'TAKSİM'}) => {
	const f = useCurrentFrame();
	const {width: W, height: H} = useVideoConfig();
	const olcek = H / IMG_H; // görüntüyü yükseklikte sığdır
	const sol = W / 2 - MERKEZ.x * olcek;
	const zoom = interpolate(f, [0, sure], [1.12, 1.0], {extrapolateRight: 'clamp'});
	const cx = W / 2;
	const cy = MERKEZ.y * olcek;
	const p = interpolate(f, [sure * 0.12, sure * 0.75], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const r = p * yaricapKm * PX_KM * olcek;
	const flas = interpolate(f, [sure * 0.1, sure * 0.13, sure * 0.25], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const yaziOp = interpolate(f, [sure * 0.55, sure * 0.7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const kenar = (yazi: string, x: number, y: number, hiza: 'sol' | 'sag') => (
		<div style={{position: 'absolute', left: hiza === 'sol' ? 40 : undefined, right: hiza === 'sag' ? 40 : undefined, top: y, opacity: yaziOp, fontFamily: 'UzayKapak, Impact, sans-serif', fontSize: 52, color: '#ffd23f', textShadow: '0 4px 0 rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.9)'}}>
			{hiza === 'sol' ? `← ${yazi}` : `${yazi} →`}
		</div>
	);
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: `${cx}px ${cy}px`}}>
				<Img src={staticFile('doku/istanbul-uydu.jpg')} style={{position: 'absolute', left: sol, top: 0, width: IMG_W * olcek, height: IMG_H * olcek, filter: 'brightness(0.8) saturate(0.9)'}} />
				<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
					<defs>
						<radialGradient id="dolgu">
							<stop offset="0%" stopColor="#ff6a00" stopOpacity="0.45" />
							<stop offset="85%" stopColor="#ff3b00" stopOpacity="0.28" />
							<stop offset="100%" stopColor="#ffb347" stopOpacity="0.6" />
						</radialGradient>
					</defs>
					{r > 1 ? <circle cx={cx} cy={cy} r={r} fill="url(#dolgu)" stroke="#ffd27a" strokeWidth={6} /> : null}
					{r > 1 ? <circle cx={cx} cy={cy} r={r * 0.97} fill="none" stroke="#ffffff" strokeOpacity={0.35} strokeWidth={14} /> : null}
					<circle cx={cx} cy={cy} r={10} fill="#ffffff" />
				</svg>
				<div style={{position: 'absolute', left: cx, top: cy, transform: 'translate(-50%, -170%)', fontFamily: 'UzayKapak, Impact, sans-serif', fontSize: 58, color: '#fff', textShadow: '0 4px 0 rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.9)'}}>{etiket}</div>
			</div>
			<AbsoluteFill style={{background: '#fff3d6', opacity: flas * 0.85}} />
			{kenar('ARNAVUTKÖY', 0, H * 0.22, 'sol')}
			{kenar('KARTAL', 0, H * 0.86, 'sag')}
			<div style={{position: 'absolute', bottom: 120, width: '100%', textAlign: 'center', fontFamily: 'UzayYazi, sans-serif', fontSize: 24, color: 'rgba(255,255,255,0.6)'}}>Uydu görüntüsü: NASA · halka gerçek ölçekte ({yaricapKm} km)</div>
		</AbsoluteFill>
	);
};
