import React from 'react';
import {AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {AcilisBasligi, Altyazi, FontYukle, Kelime} from './Altyazi';
import {SAHNELER} from './sahneler';
import {BOLUMLER} from './bolumler';

// UZAY&YAŞAM SHORT ŞABLONU (1080x1920)
// Seslendirme aracı her bölüm için zaman dosyası üretir; video ona göre kendini kurar.

export type UzayShortProps = {bolum: string};

const FPS = 30;

export const uzayMetadata: CalculateMetadataFunction<UzayShortProps> = ({props}) => {
	const b = BOLUMLER[props.bolum];
	return {durationInFrames: Math.ceil(b.toplam * FPS), fps: FPS, width: 1080, height: 1920};
};

const Flas: React.FC = () => {
	const f = useCurrentFrame();
	const op = interpolate(f, [0, 7], [0.85, 0], {extrapolateRight: 'clamp'});
	return <AbsoluteFill style={{background: '#fff', opacity: op}} />;
};

export const UzayShort: React.FC<UzayShortProps> = ({bolum}) => {
	const b = BOLUMLER[bolum];
	const toplamKare = Math.ceil(b.toplam * FPS);
	const baslar = b.sahneler.map((s, i) => (i === 0 ? 0 : Math.round((s.bas - 0.08) * FPS)));
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<FontYukle />
			{b.sahneler.map((s, i) => {
				const Sahne = SAHNELER[s.sahne];
				const bas = baslar[i];
				const sure = (i < baslar.length - 1 ? baslar[i + 1] : toplamKare) - bas;
				const kelimeler: Kelime[] = b.kelimeler.filter((w) => w.bas >= s.bas - 0.01 && w.bas <= s.son + 0.01);
				const kelime = (kok: string) => {
					const w = kelimeler.find((x) => x.k.toLocaleLowerCase('tr-TR').startsWith(kok.toLocaleLowerCase('tr-TR')));
					return w ? Math.round(w.bas * FPS) - bas : Math.round(sure / 2);
				};
				return (
					<Sequence key={s.sahne + i} from={bas} durationInFrames={sure}>
						{Sahne ? <Sahne sure={sure} kelime={kelime} /> : <AbsoluteFill style={{background: '#222'}} />}
						{i > 0 ? <Flas /> : null}
					</Sequence>
				);
			})}
			<Sequence durationInFrames={Math.round(3.4 * FPS)}>
				<AcilisBasligi metin={b.baslik} sure={Math.round(3.4 * FPS)} />
			</Sequence>
			<Altyazi kelimeler={b.kelimeler} />
			{b.ses ? <Audio src={staticFile(b.ses)} /> : null}
		</AbsoluteFill>
	);
};
