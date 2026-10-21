import React from 'react';
import {V3} from './araclar';

// TEKRAR KULLANILABİLİR 3D NESNELER
// Hepsi basit kutu/silindir şekillerinden yapılır, istenen yere konur.

export const Kutu: React.FC<{
	boyut: V3;
	konum: V3;
	renk: string;
	donus?: V3;
	parlak?: string; // kendi ışığını veren renk (ekran, lamba)
	opaklik?: number;
}> = ({boyut, konum, renk, donus = [0, 0, 0], parlak, opaklik}) => (
	<mesh position={konum} rotation={donus}>
		<boxGeometry args={boyut} />
		<meshStandardMaterial
			color={renk}
			roughness={0.85}
			emissive={parlak ?? '#000000'}
			emissiveIntensity={parlak ? 1 : 0}
			transparent={opaklik !== undefined}
			opacity={opaklik ?? 1}
		/>
	</mesh>
);

export const Silindir: React.FC<{
	r: number;
	h: number;
	konum: V3;
	renk: string;
	donus?: V3;
	r2?: number;
	parlak?: string;
}> = ({r, h, konum, renk, donus = [0, 0, 0], r2, parlak}) => (
	<mesh position={konum} rotation={donus}>
		<cylinderGeometry args={[r, r2 ?? r, h, 28]} />
		<meshStandardMaterial
			color={renk}
			roughness={0.8}
			emissive={parlak ?? '#000000'}
			emissiveIntensity={parlak ? 1 : 0}
		/>
	</mesh>
);

export const Agac: React.FC<{konum: V3; olcek?: number; renk?: string}> = ({konum, olcek = 1, renk = '#5a9e5f'}) => (
	<group position={konum} scale={olcek}>
		<Silindir r={0.12} r2={0.16} h={1.6} konum={[0, 0.8, 0]} renk="#7a5236" />
		<mesh position={[0, 2.2, 0]}>
			<icosahedronGeometry args={[0.95, 0]} />
			<meshStandardMaterial color={renk} flatShading roughness={0.9} />
		</mesh>
		<mesh position={[0.45, 1.8, 0.2]}>
			<icosahedronGeometry args={[0.6, 0]} />
			<meshStandardMaterial color={renk} flatShading roughness={0.9} />
		</mesh>
	</group>
);

export const SokakLambasi: React.FC<{konum: V3}> = ({konum}) => (
	<group position={konum}>
		<Silindir r={0.06} h={3.4} konum={[0, 1.7, 0]} renk="#3d4451" />
		<Kutu boyut={[0.7, 0.07, 0.07]} konum={[0.3, 3.38, 0]} renk="#3d4451" />
		<Kutu boyut={[0.3, 0.14, 0.24]} konum={[0.6, 3.3, 0]} renk="#fff3c4" parlak="#ffe9a3" />
	</group>
);

export const Bina: React.FC<{konum: V3; boyut: V3; renk: string; pencere?: string}> = ({
	konum,
	boyut,
	renk,
	pencere = '#a9d3ec',
}) => {
	const [w, h, d] = boyut;
	const satir = Math.max(1, Math.floor((h - 0.6) / 1.1));
	const sutun = Math.max(1, Math.floor(w / 1.1));
	const pencereler: React.ReactNode[] = [];
	for (let i = 0; i < satir; i++) {
		for (let j = 0; j < sutun; j++) {
			pencereler.push(
				<Kutu
					key={`${i}-${j}`}
					boyut={[0.5, 0.62, 0.04]}
					konum={[-w / 2 + (j + 0.5) * (w / sutun), 0.9 + i * 1.1, d / 2 + 0.02]}
					renk={pencere}
				/>,
			);
		}
	}
	return (
		<group position={konum}>
			<Kutu boyut={boyut} konum={[0, h / 2, 0]} renk={renk} />
			<Kutu boyut={[w + 0.12, 0.14, d + 0.12]} konum={[0, h + 0.07, 0]} renk="#8d8f98" />
			{pencereler}
		</group>
	);
};

// Kapı: menteşe sol kenarda, aciklik 0 (kapalı) → 1 (açık)
export const Kapi: React.FC<{konum: V3; aciklik: number; renk?: string; disari?: boolean}> = ({
	konum,
	aciklik,
	renk = '#8a5a3b',
	disari = false,
}) => (
	<group position={konum}>
		{/* kapının arkasındaki karanlık boşluk */}
		<Kutu boyut={[1.1, 2.2, 0.02]} konum={[0.55, 1.1, -0.12]} renk="#2a2420" />
		<group rotation={[0, (disari ? -1 : 1) * aciklik * 1.5, 0]}>
			<Kutu boyut={[1.1, 2.2, 0.08]} konum={[0.55, 1.1, 0]} renk={renk} />
			<Kutu boyut={[0.8, 0.7, 0.03]} konum={[0.55, 1.55, 0.05]} renk={renk} />
			<Kutu boyut={[0.8, 0.7, 0.03]} konum={[0.55, 0.65, 0.05]} renk={renk} />
			<mesh position={[0.92, 1.05, 0.08]}>
				<sphereGeometry args={[0.05, 16, 16]} />
				<meshStandardMaterial color="#e2c044" metalness={0.6} roughness={0.3} />
			</mesh>
		</group>
	</group>
);

// Tekli koltuk: sağa bakacak şekilde yan duruyor (karakter yandan oturur)
export const Koltuk: React.FC<{konum: V3; renk?: string}> = ({konum, renk = '#c0634b'}) => (
	<group position={konum}>
		<Kutu boyut={[0.95, 0.3, 0.95]} konum={[0, 0.3, 0]} renk={renk} />
		<Kutu boyut={[0.85, 0.12, 0.85]} konum={[0.03, 0.5, 0]} renk="#d8775e" />
		<Kutu boyut={[0.22, 0.95, 0.95]} konum={[-0.42, 0.75, 0]} renk={renk} />
		<Kutu boyut={[0.95, 0.25, 0.14]} konum={[0, 0.6, -0.45]} renk={renk} />
		<Kutu boyut={[0.95, 0.25, 0.14]} konum={[0, 0.6, 0.45]} renk={renk} />
		{[-0.38, 0.38].map((x) =>
			[-0.38, 0.38].map((z) => (
				<Kutu key={`${x}${z}`} boyut={[0.07, 0.15, 0.07]} konum={[x, 0.075, z]} renk="#4a3426" />
			)),
		)}
	</group>
);

export const Masa: React.FC<{konum: V3; boyut?: V3; renk?: string}> = ({konum, boyut = [1.2, 0.8, 0.55], renk = '#b98b5e'}) => {
	const [w, h, d] = boyut;
	return (
		<group position={konum}>
			<Kutu boyut={[w, 0.06, d]} konum={[0, h, 0]} renk={renk} />
			{[-1, 1].map((sx) =>
				[-1, 1].map((sz) => (
					<Kutu
						key={`${sx}${sz}`}
						boyut={[0.06, h, 0.06]}
						konum={[sx * (w / 2 - 0.06), h / 2, sz * (d / 2 - 0.06)]}
						renk="#6b4c33"
					/>
				)),
			)}
		</group>
	);
};

export const AyakliLamba: React.FC<{konum: V3}> = ({konum}) => (
	<group position={konum}>
		<Silindir r={0.18} h={0.04} konum={[0, 0.02, 0]} renk="#333" />
		<Silindir r={0.025} h={1.5} konum={[0, 0.77, 0]} renk="#333" />
		<Silindir r={0.18} r2={0.3} h={0.38} konum={[0, 1.65, 0]} renk="#fbe8b5" parlak="#f5d27a" />
		<pointLight position={[0, 1.5, 0.3]} intensity={2.5} distance={4} color="#ffd89a" />
	</group>
);

export const Bitki: React.FC<{konum: V3; olcek?: number}> = ({konum, olcek = 1}) => (
	<group position={konum} scale={olcek}>
		<Silindir r={0.22} r2={0.17} h={0.45} konum={[0, 0.225, 0]} renk="#d98c5f" />
		{[0, 1, 2, 3, 4].map((i) => (
			<mesh key={i} position={[Math.cos(i * 1.3) * 0.12, 0.75 + (i % 2) * 0.15, Math.sin(i * 1.3) * 0.12]} rotation={[0.3 * Math.sin(i), i, 0.35 * Math.cos(i)]}>
				<coneGeometry args={[0.13, 0.75, 5]} />
				<meshStandardMaterial color={i % 2 ? '#3f8f4f' : '#56a865'} flatShading />
			</mesh>
		))}
	</group>
);

export const Cerceve: React.FC<{konum: V3; boyut: [number, number]; ic: string; parlak?: boolean}> = ({konum, boyut, ic, parlak}) => (
	<group position={konum}>
		<Kutu boyut={[boyut[0] + 0.14, boyut[1] + 0.14, 0.05]} konum={[0, 0, 0]} renk="#f5f1ea" />
		<Kutu boyut={[boyut[0], boyut[1], 0.04]} konum={[0, 0, 0.02]} renk={ic} parlak={parlak ? ic : undefined} />
	</group>
);

export const Anahtar: React.FC<{konum?: V3}> = ({konum = [0, 0, 0]}) => (
	<group position={konum}>
		<mesh rotation={[0, 0, 0]}>
			<torusGeometry args={[0.06, 0.018, 10, 24]} />
			<meshStandardMaterial color="#e2b93b" metalness={0.7} roughness={0.3} />
		</mesh>
		<Kutu boyut={[0.035, 0.16, 0.02]} konum={[0, -0.13, 0]} renk="#d4a62a" />
		<Kutu boyut={[0.05, 0.025, 0.02]} konum={[0.03, -0.18, 0]} renk="#d4a62a" />
	</group>
);
