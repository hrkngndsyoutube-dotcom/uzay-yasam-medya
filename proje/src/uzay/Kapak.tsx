import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FontYukle} from './Altyazi';
import {KAPAK_RENK} from './gorsel/GorselShort';

// AYRI KAPAK GÖRSELİ (1080x1920). Yazı orta güvenli bölgede: profil ızgarası kırpınca da okunur.
export type KapakSatir = {t: string; renk?: 'gumus' | 'vurgu'; boyut?: number};
export type KapakProps = {arka: string; satirlar: KapakSatir[]; merkez?: number; ok?: boolean; parlaklik?: number};

export const Kapak: React.FC<KapakProps> = ({arka, satirlar, merkez = 50, ok, parlaklik = 0.95}) => (
	<AbsoluteFill style={{background: '#000'}}>
		<FontYukle />
		<Img src={staticFile(arka)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `brightness(${parlaklik}) contrast(1.1) saturate(0.8)`}} />
		<AbsoluteFill style={{background: `radial-gradient(ellipse 80% 22% at 50% ${merkez}%, rgba(0,0,0,0.75), rgba(0,0,0,0) 100%)`}} />
		<div style={{position: 'absolute', top: `${merkez}%`, left: 70, right: 70, transform: 'translateY(-50%)', textAlign: 'center'}}>
			{ok ? <div style={{fontFamily: 'UzayKapak, Impact, sans-serif', fontSize: 110, color: KAPAK_RENK.vurgu, lineHeight: 1, marginBottom: 6, textShadow: '0 6px 0 rgba(0,0,0,0.85)'}}>↑</div> : null}
			{satirlar.map((s, i) =>
				s.renk === 'vurgu' ? (
					<div key={i} style={{fontFamily: 'UzayKapak, Impact, sans-serif', fontSize: s.boyut ?? 180, lineHeight: 1.0, paddingTop: 20, marginTop: -20, color: KAPAK_RENK.vurgu, textShadow: '0 6px 0 rgba(0,0,0,0.9), 0 14px 30px rgba(0,0,0,0.9)'}}>
						{s.t}
					</div>
				) : (
					<div key={i} style={{fontFamily: 'UzayKapak, Impact, sans-serif', fontSize: s.boyut ?? 110, lineHeight: 1.0, paddingTop: 22, marginTop: -22, background: KAPAK_RENK.gumus, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 7px 0 rgba(0,0,0,0.9)) drop-shadow(0 16px 30px rgba(0,0,0,0.85))'}}>
						{s.t}
					</div>
				),
			)}
		</div>
	</AbsoluteFill>
);
