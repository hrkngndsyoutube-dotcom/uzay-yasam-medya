import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Karakter} from '../karakter/Karakter';
import {AYAKTA, gozKirp, karistir, oturmus, uzanma, yuruyus} from '../karakter/pozlar';
import {Kamera, anahtar, anahtar3, yol} from '../sahne/araclar';
import {Anahtar} from '../sahne/parcalar';
import {Araba} from '../sahne/Araba';
import {EV_ICI, EvIci} from '../mekanlar/EvIci';
import {SOKAK, Sokak} from '../mekanlar/Sokak';

// ÖRNEK VİDEO: Karakter koltuktan kalkar, anahtarı alır, evden çıkar,
// arabaya biner ve uzaklaşır. 20 saniye, 1920x1080, 30 kare/sn.

export type EvdenArabayaProps = {
	seslendirme: string | null; // public klasöründeki ses dosyası, örn. "seslendirme.mp3"
};

const SAHNE2 = 246; // sokak sahnesinin başladığı kare

// Yürürken ayakta duruşla yürüyüş arasında yumuşak geçiş
const yurumePozu = (f: number, bas: number, son: number, faz: number) => {
	const w = anahtar(f, [
		[bas, 0],
		[bas + 6, 1],
		[son - 6, 1],
		[son, 0],
	]);
	return karistir(AYAKTA, yuruyus(faz), w);
};

const EvSahnesi: React.FC = () => {
	const f = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const z = EV_ICI.yuruyusHatti;
	const oturma = oturmus(EV_ICI.koltukKalca);

	let konum: [number, number, number] = [-2.95, 0, z];
	let yon: 1 | -1 = 1;
	let poz = oturma;

	if (f < 45) {
		poz = {...oturma, bas: 0.05 + 0.05 * Math.sin(f / 9)};
	} else if (f < 72) {
		const t = anahtar(f, [[45, 0], [72, 1]]);
		poz = karistir(oturma, AYAKTA, t);
		konum = [-2.95 + 0.3 * t, 0, z];
	} else if (f < 168) {
		const y1 = yol(f, 72, 135, [[-2.65, 0, z], [-0.3, 0, z]]);
		konum = y1.konum;
		poz = yurumePozu(f, 72, 135, y1.faz);
		poz = uzanma(poz, anahtar(f, [[138, 0], [150, 1], [158, 1], [168, 0]]), -0.15);
	} else if (f < 205) {
		const y2 = yol(f, 168, 205, [[-0.3, 0, z], [2.85, 0, z]]);
		konum = y2.konum;
		poz = yurumePozu(f, 168, 205, y2.faz);
	} else if (f < 222) {
		konum = [2.85, 0, z];
		poz = uzanma(AYAKTA, anahtar(f, [[205, 0], [212, 1], [218, 1], [222, 0]]), 0.05);
	} else {
		const y3 = yol(f, 222, 250, [[2.85, 0, z], [3.5, 0, -3.6]]);
		konum = y3.konum;
		poz = yurumePozu(f, 222, 250, y3.faz);
	}
	poz = gozKirp(poz, f);

	const anahtarElde = f >= 151;
	const kapi = anahtar(f, [[208, 0], [228, 1]]);

	const kamKonum = anahtar3(f, [
		[0, [-2.4, 1.45, 3.0]],
		[70, [-2.1, 1.6, 4.2]],
		[140, [-0.4, 1.5, 3.5]],
		[180, [0.4, 1.65, 4.8]],
		[215, [2.4, 1.7, 4.6]],
		[250, [3.1, 1.6, 3.4]],
	]);
	const kamHedef = anahtar3(f, [
		[0, [-2.9, 1.05, -1.6]],
		[70, [-2.4, 1.1, -1.6]],
		[140, [-0.15, 1.05, -1.7]],
		[180, [0.6, 1.1, -1.8]],
		[215, [3.0, 1.2, -2.2]],
		[250, [3.5, 1.2, -3.0]],
	]);

	return (
		<ThreeCanvas width={width} height={height} camera={{fov: 38, near: 0.1, far: 200}}>
			<Kamera konum={kamKonum} hedef={kamHedef} />
			<EvIci kapiAcikligi={kapi}>
				{!anahtarElde ? (
					<group position={[EV_ICI.sehpa[0] - 0.3, EV_ICI.sehpaUstu, EV_ICI.sehpa[2] + 0.12]} rotation={[-Math.PI / 2, 0, 0.6]}>
						<Anahtar />
					</group>
				) : null}
				<Karakter
					konum={konum}
					poz={poz}
					yon={yon}
					elindeki={anahtarElde ? <Anahtar konum={[0.02, -0.08, 0.05]} /> : undefined}
				/>
			</EvIci>
		</ThreeCanvas>
	);
};

const SokakSahnesi: React.FC = () => {
	const g = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const arabaZ = SOKAK.arabaSeridi;

	// arabanın hareketi: 240. kareden sonra hızlanarak gider
	const arabaX = 1.0 + interpolate(g, [236, 354], [0, 34], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.quad),
	});
	const arabaKapi = anahtar(g, [[132, 0], [156, 1], [192, 1], [214, 0]]);
	const evKapisi = anahtar(g, [[4, 0], [28, 1], [100, 1], [125, 0]]);
	const sarsinti = g > 218 && g < 250 ? 0.012 * Math.sin(g * 2.3) : 0;

	const ayakta = AYAKTA;
	const oturma = oturmus(0.94);
	let konum: [number, number, number] = [-5.0, 0, -3.0];
	let poz = ayakta;
	const yon: 1 | -1 = 1;
	let arabada = false;

	if (g < 122) {
		const y = yol(g, 26, 122, [
			[-5.0, 0, -3.0],
			[-4.7, 0, -2.2],
			[-2.6, 0, SOKAK.yol],
			[1.1, 0, SOKAK.yol],
		]);
		konum = y.konum;
		poz = yurumePozu(g, 26, 122, y.faz);
	} else if (g < 160) {
		konum = [1.1, 0, SOKAK.yol];
		poz = uzanma(ayakta, anahtar(g, [[124, 0], [134, 1], [148, 1], [158, 0]]), -0.2);
	} else {
		const t = anahtar(g, [[160, 0], [192, 1]]);
		const adim = Math.sin(t * Math.PI) * 0.35; // binerken ayağı kaldırır
		const ara = karistir(ayakta, oturma, t);
		poz = {...ara, onBacak: [ara.onBacak[0] + adim, ara.onBacak[1] - adim]};
		konum = [1.1 + (0.3 - 0.1) * t, 0, SOKAK.yol + (arabaZ + 0.35 - SOKAK.yol) * t];
		arabada = t >= 1;
	}
	poz = gozKirp(poz, g, 40);

	const karakter = (
		<Karakter konum={arabada ? [0.3, 0, 0.35] : konum} poz={poz} yon={yon} golge={!arabada} />
	);

	const kamKonum = anahtar3(g, [
		[0, [-4.4, 1.8, 4.4]],
		[60, [-3.4, 1.9, 7.6]],
		[120, [0.2, 1.75, 8.2]],
		[175, [1.4, 1.75, 7.2]],
		[232, [1.4, 1.9, 8.2]],
		[300, [7, 3.2, 13]],
		[354, [11, 5.6, 18]],
	]);
	const kamHedef = anahtar3(g, [
		[0, [-5.0, 1.3, -2.8]],
		[60, [-3.6, 1.1, 0]],
		[120, [0.9, 1.15, 2.6]],
		[175, [1.4, 1.2, 2.4]],
		[232, [1.8, 1.2, 2.2]],
		[300, [12, 1.0, 2]],
		[354, [26, 1.0, 2]],
	]);

	return (
		<ThreeCanvas width={width} height={height} camera={{fov: 38, near: 0.1, far: 200}}>
			<Kamera konum={kamKonum} hedef={kamHedef} />
			<Sokak kapiAcikligi={evKapisi}>
				<Araba konum={[arabaX, 0, arabaZ]} kapiAcikligi={arabaKapi} teker={(arabaX - 1) / 0.4} farlar={g > 218} sarsinti={sarsinti}>
					{arabada ? karakter : null}
				</Araba>
				{!arabada ? karakter : null}
			</Sokak>
		</ThreeCanvas>
	);
};

export const EvdenArabaya: React.FC<EvdenArabayaProps> = ({seslendirme}) => {
	const frame = useCurrentFrame();
	const karartma = anahtar(frame, [
		[0, 1],
		[10, 0],
		[230, 0],
		[243, 1],
		[249, 1],
		[262, 0],
		[585, 0],
		[600, 1],
	]);
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<Sequence durationInFrames={SAHNE2 + 4}>
				<EvSahnesi />
			</Sequence>
			<Sequence from={SAHNE2}>
				<SokakSahnesi />
			</Sequence>
			<AbsoluteFill style={{backgroundColor: '#000', opacity: karartma}} />
			{seslendirme ? <Audio src={staticFile(seslendirme)} /> : null}
		</AbsoluteFill>
	);
};
