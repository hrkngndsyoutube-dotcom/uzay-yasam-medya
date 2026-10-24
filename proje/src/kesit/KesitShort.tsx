import React from 'react';
import {AbsoluteFill, Easing, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FontYukle} from '../uzay/Altyazi';

// UZUN VİDEODAN DİKEY SHORT KESİTİ (1080x1920)
// Yatay videoyu dikey kadraja kırpar, yavaşça kaydırır; üstte kanca başlık, sonda "tam bölüm" çağrısı.

export type KesitProps = {
	video: string; // public/ içindeki kesit
	ust: string;
	vurgu: string;
	sonCagri: string;
	odakX?: number; // 0-1 arası yatay kadraj merkezi
	marka?: string;
	baslangic?: number; // kaynakta başlangıç (saniye)
	tamKadrajSn?: number; // bu saniyeden sonra yatay görüntü tam gösterilir (başlık kartları kesilmesin)
};

export const KesitShort: React.FC<KesitProps> = ({video, ust, vurgu, sonCagri, odakX = 0.5, marka = 'TARİHİN SIFIR NOKTASI', baslangic = 0, tamKadrajSn}) => {
	const f = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	// kaynağı 1920 yüksekliğe ölçekle (3413 genişlik), 1080'lik pencereyi yavaşça kaydır
	const genislik = 1920 * (16 / 9);
	const merkez = interpolate(f, [0, durationInFrames], [odakX - 0.04, odakX + 0.04]);
	const sol = Math.min(0, Math.max(1080 - genislik, 540 - merkez * genislik));
	const olcek = interpolate(f, [0, durationInFrames], [1.0, 1.06]);
	const baslikCikis = interpolate(f, [fps * 6, fps * 7], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const sonBas = durationInFrames - fps * 5;
	const s = spring({frame: f - sonBas, fps, config: {damping: 12}});
	const nabiz = 1 + 0.04 * Math.sin(f / 4);
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<FontYukle />
			{(() => {
				const tamBas = tamKadrajSn !== undefined ? Math.round(tamKadrajSn * fps) : Infinity;
				const tam = interpolate(f, [tamBas, tamBas + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				const kaynak = staticFile(video);
				const bas = Math.round(baslangic * fps);
				return (
					<>
						<div style={{position: 'absolute', left: sol, top: 0, width: genislik, height: 1920, transform: `scale(${olcek})`, transformOrigin: `${540 - sol}px 960px`, opacity: 1 - tam}}>
							<OffthreadVideo src={kaynak} startFrom={bas} style={{width: '100%', height: '100%'}} />
						</div>
						{tam > 0 ? (
							<div style={{position: 'absolute', left: -324, top: 960 - 486, width: 1728, height: 972, opacity: tam}}>
								<OffthreadVideo src={kaynak} startFrom={bas} muted style={{width: '100%', height: '100%'}} />
							</div>
						) : null}
					</>
				);
			})()}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.6) 100%)'}} />

			{/* kanca başlık: ilk kareden görünür (otomatik kapak başlıklı olsun) */}
			<div style={{position: 'absolute', top: 150, left: 40, right: 40, textAlign: 'center', opacity: baslikCikis}}>
				<div style={{fontFamily: 'UzayYazi, sans-serif', color: '#fff', letterSpacing: 8, fontSize: 30, opacity: 0.85, marginBottom: 14}}>{marka}</div>
				<div
					style={{
						fontFamily: 'UzayKapak, Impact, sans-serif',
						fontSize: 120,
						lineHeight: 1.0,
						paddingTop: 20,
						marginTop: -20,
						background: 'linear-gradient(180deg, #ffffff 0%, #f1e6d6 50%, #c9b49a 100%)',
						WebkitBackgroundClip: 'text',
						color: 'transparent',
						filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.85)) drop-shadow(0 14px 28px rgba(0,0,0,0.8))',
					}}
				>
					{ust}
				</div>
				<div
					style={{
						fontFamily: 'UzayKapak, Impact, sans-serif',
						fontSize: 132,
						lineHeight: 1.02,
						paddingTop: 16,
						marginTop: -16,
						color: '#ff8a1f',
						textShadow: '0 0 28px rgba(255,120,20,0.75), 0 6px 0 rgba(0,0,0,0.85), 0 14px 30px rgba(0,0,0,0.8)',
					}}
				>
					{vurgu}
				</div>
			</div>

			{/* son çağrı */}
			{f >= sonBas ? (
				<div style={{position: 'absolute', bottom: 330, left: 0, right: 0, textAlign: 'center', opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.7, 1]) * nabiz})`}}>
					<span
						style={{
							display: 'inline-block',
							fontFamily: 'UzayKapak, Impact, sans-serif',
							fontSize: 72,
							color: '#fff',
							background: 'linear-gradient(180deg, #ff7a1a, #d4420b)',
							padding: '22px 54px',
							borderRadius: 60,
							boxShadow: '0 12px 50px rgba(255,100,20,0.6)',
						}}
					>
						{sonCagri}
					</span>
				</div>
			) : null}
			<AbsoluteFill style={{opacity: interpolate(f, [durationInFrames - 8, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', easing: Easing.in(Easing.quad)}), background: '#000'}} />
		</AbsoluteFill>
	);
};
