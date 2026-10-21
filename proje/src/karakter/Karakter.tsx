import React from 'react';
import * as THREE from 'three';
import {ALT_BACAK, Poz, UST_BACAK} from './pozlar';

// KARAKTER: beyaz yuvarlak kafalı, düz (2D) çizilmiş, 3D dünyada duran figür.
// Kağıttan kesilmiş gibi düzdür; kamera dönünce derinlikte doğru durur.

export type KarakterStili = {
	gomlek: string;
	pantolon: string;
	ten: string; // el/kol rengi
	kontur: string; // kafa çizgisi ve gözler
};

export const VARSAYILAN_STIL: KarakterStili = {
	gomlek: '#2a9d8f',
	pantolon: '#264653',
	ten: '#2f3640',
	kontur: '#1d1f27',
};

const geoOnbellek = new Map<string, THREE.BufferGeometry>();
const onbellek = (anahtar: string, yap: () => THREE.BufferGeometry) => {
	if (!geoOnbellek.has(anahtar)) geoOnbellek.set(anahtar, yap());
	return geoOnbellek.get(anahtar)!;
};

// Uçları yuvarlak çubuk (kol/bacak parçası), 0'dan aşağı doğru L uzunluğunda
const kapsul = (L: number, w: number) =>
	onbellek(`k${L}-${w}`, () => {
		const r = w / 2;
		const s = new THREE.Shape();
		s.moveTo(-r, 0);
		s.lineTo(-r, -L);
		s.absarc(0, -L, r, Math.PI, 2 * Math.PI, false);
		s.lineTo(r, 0);
		s.absarc(0, 0, r, 0, Math.PI, false);
		return new THREE.ShapeGeometry(s, 10);
	});

// Köşeleri yuvarlatılmış dikdörtgen (gövde, ayak)
const yuvarlakKutu = (w: number, h: number, r: number) =>
	onbellek(`y${w}-${h}-${r}`, () => {
		const s = new THREE.Shape();
		const x = -w / 2;
		s.moveTo(x + r, 0);
		s.lineTo(x + w - r, 0);
		s.quadraticCurveTo(x + w, 0, x + w, r);
		s.lineTo(x + w, h - r);
		s.quadraticCurveTo(x + w, h, x + w - r, h);
		s.lineTo(x + r, h);
		s.quadraticCurveTo(x, h, x, h - r);
		s.lineTo(x, r);
		s.quadraticCurveTo(x, 0, x + r, 0);
		return new THREE.ShapeGeometry(s, 8);
	});

const daire = (r: number) => onbellek(`d${r}`, () => new THREE.CircleGeometry(r, 48));

const Duz: React.FC<{geo: THREE.BufferGeometry; renk: string; z?: number; x?: number; y?: number; opaklik?: number}> = ({
	geo,
	renk,
	z = 0,
	x = 0,
	y = 0,
	opaklik,
}) => (
	<mesh geometry={geo} position={[x, y, z]}>
		<meshBasicMaterial
			color={renk}
			toneMapped={false}
			transparent={opaklik !== undefined}
			opacity={opaklik ?? 1}
		/>
	</mesh>
);

// Bir eklem: döner, ucuna bir sonraki parça takılır
const Uzuv: React.FC<{aci: number; L: number; w: number; renk: string; children?: React.ReactNode}> = ({
	aci,
	L,
	w,
	renk,
	children,
}) => (
	<group rotation={[0, 0, aci]}>
		<Duz geo={kapsul(L, w)} renk={renk} />
		<group position={[0, -L, 0.002]}>{children}</group>
	</group>
);

const Ayak: React.FC<{aci: number; renk: string}> = ({aci, renk}) => (
	<group rotation={[0, 0, -aci]}>
		<group position={[0.05, -0.04, 0.001]}>
			<Duz geo={yuvarlakKutu(0.24, 0.09, 0.04)} renk={renk} />
		</group>
	</group>
);

export type KarakterProps = {
	konum: [number, number, number];
	poz: Poz;
	yon?: 1 | -1; // 1 = sağa bakar, -1 = sola bakar
	olcek?: number;
	stil?: KarakterStili;
	elindeki?: React.ReactNode; // eline verilen nesne (anahtar, bardak...)
	golge?: boolean;
	opaklik?: number;
};

export const Karakter: React.FC<KarakterProps> = ({
	konum,
	poz,
	yon = 1,
	olcek = 0.8,
	stil = VARSAYILAN_STIL,
	elindeki,
	golge = true,
}) => {
	const bacak = (aci: [number, number], z: number, renk: string) => (
		<group position={[0, 0, z]}>
			<Uzuv aci={aci[0]} L={UST_BACAK} w={0.15} renk={renk}>
				<Uzuv aci={aci[1]} L={ALT_BACAK} w={0.14} renk={renk}>
					<Ayak aci={aci[0] + aci[1]} renk={stil.kontur} />
				</Uzuv>
			</Uzuv>
		</group>
	);

	const kol = (aci: [number, number], z: number, renk: string, el?: React.ReactNode) => (
		<group position={[0.02, 0.5, z]}>
			<Uzuv aci={aci[0]} L={0.32} w={0.12} renk={renk}>
				<Uzuv aci={aci[1]} L={0.3} w={0.11} renk={stil.ten}>
					<Duz geo={daire(0.075)} renk={stil.ten} />
					{el ? <group rotation={[0, 0, -(aci[0] + aci[1] + poz.govde * -1)]}>{el}</group> : null}
				</Uzuv>
			</Uzuv>
		</group>
	);

	const gozY = 0.035;
	return (
		<group position={konum} scale={[yon * olcek, olcek, olcek]}>
			{golge ? (
				<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.02, 0.012, 0]} scale={[1, 0.35, 1]}>
					<circleGeometry args={[0.42, 32]} />
					<meshBasicMaterial color="#000000" transparent opacity={0.16} depthWrite={false} />
				</mesh>
			) : null}

			<group position={[0, poz.kalca, 0]}>
				{/* arka bacak gövdenin arkasında, ön bacak önünde */}
				{bacak(poz.arkaBacak, -0.04, shade(stil.pantolon, -0.18))}

				<group rotation={[0, 0, -poz.govde]}>
					{kol(poz.arkaKol, -0.06, shade(stil.gomlek, -0.2))}

					{/* gövde */}
					<Duz geo={yuvarlakKutu(0.38, 0.66, 0.14)} renk={stil.gomlek} y={-0.06} />

					{/* boyun + kafa */}
					<group position={[0.03, 0.88, 0.02]} rotation={[0, 0, -poz.bas]}>
						<Duz geo={daire(0.322)} renk={stil.kontur} z={-0.004} />
						<Duz geo={daire(0.3)} renk="#ffffff" />
						<mesh position={[0.11, gozY, 0.006]} scale={[1, 1.35 * poz.goz, 1]}>
							<circleGeometry args={[0.034, 20]} />
							<meshBasicMaterial color={stil.kontur} toneMapped={false} />
						</mesh>
						<mesh position={[0.21, gozY, 0.006]} scale={[1, 1.35 * poz.goz, 1]}>
							<circleGeometry args={[0.034, 20]} />
							<meshBasicMaterial color={stil.kontur} toneMapped={false} />
						</mesh>
					</group>

					{kol(poz.onKol, 0.07, stil.gomlek, elindeki)}
				</group>

				{bacak(poz.onBacak, 0.035, stil.pantolon)}
			</group>
		</group>
	);
};

// Rengi biraz koyulaştır/açar (arka uzuvlar için derinlik hissi)
function shade(hex: string, oran: number) {
	const c = new THREE.Color(hex);
	const hsl = {h: 0, s: 0, l: 0};
	c.getHSL(hsl);
	c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l * (1 + oran))));
	return '#' + c.getHexString();
}
