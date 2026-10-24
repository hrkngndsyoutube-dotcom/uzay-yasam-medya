import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {tohumlu} from '../uzay/gok';

// SLOW AURA: kusursuz döngü (sonu başına bağlanır). Tüm hareketler döngü süresine tam bölünür.
export const AmbiyansDongu: React.FC<{arka: string; yagmur?: boolean}> = ({arka, yagmur = true}) => {
	const f = useCurrentFrame();
	const {durationInFrames: D, width: W, height: H} = useVideoConfig();
	const t = f / D; // 0..1
	const damla = React.useMemo(() => {
		const r = tohumlu(17);
		return Array.from({length: 150}).map(() => ({x: r() * W, y: r() * H, tur: 2 + Math.floor(r() * 3), u: 30 + r() * 50, op: 0.08 + r() * 0.16}));
	}, [W, H]);
	// pencere ışığı: döngüye tam oturan yavaş titreşim
	const isik = 1 + 0.035 * Math.sin(t * Math.PI * 2 * 6) + 0.02 * Math.sin(t * Math.PI * 2 * 17);
	const sis = Math.sin(t * Math.PI * 2) * 40;
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<Img src={staticFile(arka)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${isik})`}} />
			<AbsoluteFill style={{background: `radial-gradient(ellipse 60% 30% at ${50 + sis / 20}% 70%, rgba(180,200,230,0.06), rgba(0,0,0,0) 70%)`}} />
			{yagmur ? (
				<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
					{damla.map((d, i) => {
						const y = (d.y + t * H * d.tur) % H;
						const x = d.x - (t * d.tur * H) * 0.08;
						const xx = ((x % W) + W) % W;
						return <line key={i} x1={xx} y1={y} x2={xx - d.u * 0.08} y2={y + d.u} stroke="#cfd9e6" strokeOpacity={d.op} strokeWidth={1.2} />;
					})}
				</svg>
			) : null}
		</AbsoluteFill>
	);
};
