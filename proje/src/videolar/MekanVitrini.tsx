import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Karakter, VARSAYILAN_STIL} from '../karakter/Karakter';
import {AYAKTA, gozKirp, karistir, oturmus, yazma, yuruyus} from '../karakter/pozlar';
import {Kamera, anahtar, anahtar3, yol} from '../sahne/araclar';
import {Araba} from '../sahne/Araba';
import {EV_ICI, EvIci} from '../mekanlar/EvIci';
import {OFIS, Ofis} from '../mekanlar/Ofis';
import {SOKAK, Sokak} from '../mekanlar/Sokak';

// VİTRİN: hazır mekânları ve pozları tek videoda gösterir (4'er saniye)

const Etiket: React.FC<{metin: string}> = ({metin}) => {
	const f = useCurrentFrame();
	const op = anahtar(f, [[5, 0], [18, 1], [100, 1], [115, 0]]);
	return (
		<div
			style={{
				position: 'absolute',
				left: 70,
				bottom: 70,
				padding: '18px 34px',
				borderRadius: 18,
				background: 'rgba(255,255,255,0.88)',
				fontFamily: 'Arial, sans-serif',
				fontSize: 46,
				fontWeight: 700,
				color: '#1d1f27',
				opacity: op,
			}}
		>
			{metin}
		</div>
	);
};

const EvVitrin: React.FC = () => {
	const f = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const t = f / 120;
	const aci = -0.5 + t * 1.0;
	return (
		<AbsoluteFill>
			<ThreeCanvas width={width} height={height} camera={{fov: 38}}>
				<Kamera konum={[-2.6 + Math.sin(aci) * 6.5, 2.0, -1.5 + Math.cos(aci) * 6.5]} hedef={[-2.2, 1.0, -1.6]} />
				<EvIci>
					<Karakter konum={[-2.95, 0, EV_ICI.yuruyusHatti]} poz={gozKirp(oturmus(EV_ICI.koltukKalca), f)} />
				</EvIci>
			</ThreeCanvas>
			<Etiket metin="Mekân: Ev içi" />
		</AbsoluteFill>
	);
};

const OfisVitrin: React.FC = () => {
	const f = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const poz = gozKirp(yazma(oturmus(OFIS.sandalyeKalca), f), f, 20);
	const ikinci = yol(f, 0, 120, [[4.0, 0, -0.6], [-3.0, 0, -0.6]]);
	return (
		<AbsoluteFill>
			<ThreeCanvas width={width} height={height} camera={{fov: 38}}>
				<Kamera
					konum={anahtar3(f, [[0, [1.8, 1.7, 4.2]], [120, [-0.6, 2.0, 5.2]]])}
					hedef={[0.4, 1.0, -1.5]}
				/>
				<Ofis>
					<Karakter konum={[-0.12, 0, OFIS.yuruyusHatti]} poz={poz} />
					<Karakter
						konum={ikinci.konum}
						yon={ikinci.yon}
						poz={gozKirp(yuruyus(ikinci.faz), f, 55)}
						stil={{...VARSAYILAN_STIL, gomlek: '#e76f51', pantolon: '#3d405b'}}
					/>
				</Ofis>
			</ThreeCanvas>
			<Etiket metin="Mekân: Ofis" />
		</AbsoluteFill>
	);
};

const SokakVitrin: React.FC = () => {
	const f = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const y = yol(f, 0, 120, [[-6, 0, SOKAK.kaldirim], [1.5, 0, SOKAK.kaldirim]]);
	const karsilama = anahtar(f, [[95, 0], [110, 1]]);
	return (
		<AbsoluteFill>
			<ThreeCanvas width={width} height={height} camera={{fov: 38}}>
				<Kamera
					konum={[y.konum[0] + 0.5, 1.9 + f * 0.01, 8.5 + f * 0.015]}
					hedef={[y.konum[0] + 0.6, 1.2, 0]}
				/>
				<Sokak>
					<Araba konum={[4, 0, SOKAK.arabaSeridi]} renk="#3a7bd5" />
					<Karakter konum={y.konum} yon={y.yon} poz={gozKirp(karistir(yuruyus(y.faz), AYAKTA, karsilama), f)} />
				</Sokak>
			</ThreeCanvas>
			<Etiket metin="Mekân: Sokak" />
		</AbsoluteFill>
	);
};

export const MekanVitrini: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#000'}}>
		<Sequence durationInFrames={120}>
			<EvVitrin />
		</Sequence>
		<Sequence from={120} durationInFrames={120}>
			<OfisVitrin />
		</Sequence>
		<Sequence from={240} durationInFrames={120}>
			<SokakVitrin />
		</Sequence>
	</AbsoluteFill>
);
