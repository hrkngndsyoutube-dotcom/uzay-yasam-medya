import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {Karakter} from '../karakter/Karakter';
import {AYAKTA, gozKirp, oturmus} from '../karakter/pozlar';
import {Kamera, anahtar, anahtar3} from '../sahne/araclar';
import {Agac} from '../sahne/parcalar';
import {Dunya, GazDevi, Yildiz, YildizAlani, Yorunge, tohumlu} from './gok';
import {BilgiKarti} from './Altyazi';

type V3 = [number, number, number];

// Her sahneye verilen bilgiler
export type SahneProps = {
	sure: number; // sahnenin kare cinsinden uzunluğu
	kelime: (kok: string) => number; // o kelimenin söylendiği an (sahne içi kare)
};

const tam = {width: 1080, height: 1920};

// ---------- ORTAK: gezegen yüzeyi (tepeler, kayalar, ağaç) ----------
const Yuzey: React.FC<{zemin?: string; tepe?: string; isik?: number}> = ({zemin = '#7fae5a', tepe = '#5f8f47', isik = 1}) => {
	const kayalar = React.useMemo(() => {
		const r = tohumlu(5);
		return Array.from({length: 14}).map(() => ({
			x: (r() - 0.5) * 30,
			z: -3 - r() * 25,
			s: 0.2 + r() * 0.6,
		}));
	}, []);
	return (
		<>
			<hemisphereLight args={['#fff4e0', '#3a3020', 1.1 * isik]} />
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]}>
				<planeGeometry args={[200, 120]} />
				<meshStandardMaterial color={zemin} roughness={1} />
			</mesh>
			{[
				[-14, -30, 9],
				[6, -38, 12],
				[22, -26, 8],
				[-30, -45, 14],
				[34, -50, 16],
			].map(([x, z, r], i) => (
				<mesh key={i} position={[x, -r * 0.55, z]} scale={[1.4, 1, 1]}>
					<sphereGeometry args={[r, 18, 12]} />
					<meshStandardMaterial color={tepe} flatShading roughness={1} />
				</mesh>
			))}
			{kayalar.map((k, i) => (
				<mesh key={i} position={[k.x, k.s * 0.3, k.z]} scale={k.s}>
					<dodecahedronGeometry args={[0.8, 0]} />
					<meshStandardMaterial color="#8b8174" flatShading />
				</mesh>
			))}
		</>
	);
};

// İki güneşin bıraktığı iki gölge
const Golge: React.FC<{nesne: V3; gunes: V3; uzunluk: number; genislik?: number; opaklik?: number}> = ({
	nesne,
	gunes,
	uzunluk,
	genislik = 0.42,
	opaklik = 0.32,
}) => {
	const dx = nesne[0] - gunes[0];
	const dz = nesne[2] - gunes[2];
	const aci = Math.atan2(dx, dz);
	return (
		<group position={[nesne[0], 0.02, nesne[2]]} rotation={[0, aci, 0]}>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, uzunluk / 2]}>
				<planeGeometry args={[genislik, uzunluk]} />
				<meshBasicMaterial color="#1a1208" transparent opacity={opaklik} depthWrite={false} />
			</mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, uzunluk]}>
				<circleGeometry args={[genislik * 0.75, 24]} />
				<meshBasicMaterial color="#1a1208" transparent opacity={opaklik} depthWrite={false} />
			</mesh>
		</group>
	);
};

const Gokyuzu: React.FC<{ust: string; alt: string}> = ({ust, alt}) => (
	<AbsoluteFill style={{background: `linear-gradient(180deg, ${ust} 0%, ${alt} 62%)`}} />
);

// ---------- SAHNE 1: İki güneşli gökyüzü ----------
export const YuzeySahnesi: React.FC<SahneProps> = ({sure}) => {
	const f = useCurrentFrame();
	const gunesA: V3 = [-7, 13, -45];
	const gunesB: V3 = [9, 9, -42];
	const kamHedef = anahtar3(f, [
		[0, [1, 11, -44]],
		[75, [1, 11, -44]],
		[150, [0, 1.6, 0]],
		[sure, [0, 1.5, 0]],
	]);
	const kamKonum = anahtar3(f, [
		[0, [0, 1.2, 7]],
		[150, [0.4, 1.7, 5.2]],
		[sure, [0.9, 1.6, 4.2]],
	]);
	const bakis = anahtar(f, [[100, -0.45], [150, -0.35], [sure, -0.3]]);
	return (
		<AbsoluteFill>
			<Gokyuzu ust="#3d8fd6" alt="#ffe1a8" />
			<ThreeCanvas {...tam} camera={{fov: 50}}>
				<Kamera konum={kamKonum} hedef={kamHedef} aci={50} />
				<Yildiz konum={gunesA} r={2.4} renk="#fff3b8" parlama={7} />
				<Yildiz konum={gunesB} r={1.6} renk="#ffbe7a" parlama={7} />
				<directionalLight position={gunesA} intensity={1.6} color="#fff3d0" />
				<directionalLight position={gunesB} intensity={1.1} color="#ffb27a" />
				<Yuzey />
				<Golge nesne={[0, 0, 0]} gunes={gunesA} uzunluk={1.2} />
				<Golge nesne={[0, 0, 0]} gunes={gunesB} uzunluk={1.6} />
				<Karakter konum={[0, 0, 0]} poz={gozKirp({...AYAKTA, bas: bakis}, f)} yon={1} golge={false} />
			</ThreeCanvas>
		</AbsoluteFill>
	);
};

// ---------- SAHNE 2: Çift gölge ----------
export const GolgeSahnesi: React.FC<SahneProps> = ({sure}) => {
	const f = useCurrentFrame();
	const gunesA: V3 = [-30, 14, -20];
	const gunesB: V3 = [26, 10, -24];
	const buyu = anahtar(f, [[0, 0.2], [30, 1]]);
	const agacGolgeleri = anahtar(f, [[45, 0], [80, 1]]);
	const kol = Math.sin(f / 8) * 0.25;
	return (
		<AbsoluteFill>
			<Gokyuzu ust="#4b9be0" alt="#ffe7b8" />
			<ThreeCanvas {...tam} camera={{fov: 50}}>
				<Kamera
					konum={anahtar3(f, [[0, [0.6, 3.4, 6.2]], [sure, [1.4, 3.0, 7.0]]])}
					hedef={[1.0, 1.0, -1.0]}
					aci={50}
				/>
				<Yildiz konum={gunesA} r={2} renk="#fff3b8" />
				<Yildiz konum={gunesB} r={1.4} renk="#ffbe7a" />
				<directionalLight position={gunesA} intensity={1.6} />
				<directionalLight position={gunesB} intensity={1.1} color="#ffb27a" />
				<Yuzey />
				<Golge nesne={[0, 0, 0]} gunes={gunesA} uzunluk={2.2 * buyu} opaklik={0.38} />
				<Golge nesne={[0, 0, 0]} gunes={gunesB} uzunluk={2.6 * buyu} opaklik={0.3} />
				<Karakter
					konum={[0, 0, 0]}
					poz={gozKirp({...AYAKTA, bas: 0.15, onKol: [2.7 + kol, 0.5]}, f)}
					golge={false}
				/>
				<Agac konum={[2.6, 0, -1.6]} />
				<Golge nesne={[2.6, 0, -1.6]} gunes={gunesA} uzunluk={4.5 * agacGolgeleri} genislik={0.9} opaklik={0.34} />
				<Golge nesne={[2.6, 0, -1.6]} gunes={gunesB} uzunluk={5.2 * agacGolgeleri} genislik={0.9} opaklik={0.28} />
			</ThreeCanvas>
		</AbsoluteFill>
	);
};

// ---------- SAHNE 3: İki kez gün batımı ----------
export const GunBatimiSahnesi: React.FC<SahneProps> = ({sure, kelime}) => {
	const f = useCurrentFrame();
	const ikinci = Math.max(kelime('ikincisi') - 20, sure * 0.55);
	const yA = anahtar(f, [[0, 6], [sure * 0.45, -2.5]]);
	const yB = anahtar(f, [[0, 8.5], [ikinci, 3], [sure, -2.5]]);
	const gunesA: V3 = [26, yA, -40];
	const gunesB: V3 = [36, yB, -46];
	const t = f / sure;
	const ust = interpolateColors(t, [0, 0.45, 1], ['#4a7cc2', '#3b3f8c', '#120f2e']);
	const alt = interpolateColors(t, [0, 0.45, 1], ['#ffb36b', '#ff6a4a', '#5a2a5e']);
	const isik = interpolate(t, [0, 1], [1, 0.25]);
	return (
		<AbsoluteFill>
			<Gokyuzu ust={ust} alt={alt} />
			<ThreeCanvas {...tam} camera={{fov: 50}}>
				<Kamera konum={[-3.2, 1.6, 4.5]} hedef={[6, 2.2, -14]} aci={50} />
				{t > 0.55 ? <YildizAlani parlaklik={interpolate(t, [0.55, 1], [0, 0.9])} /> : null}
				<Yildiz konum={gunesA} r={2.2} renk="#ffd27a" parlama={8} />
				<Yildiz konum={gunesB} r={1.6} renk="#ff8f5a" parlama={8} />
				<directionalLight position={[26, Math.max(yA, 0.5), -40]} intensity={1.4 * isik} color="#ffb070" />
				<Yuzey zemin="#6b8a4c" tepe="#3f5a36" isik={isik} />
				<mesh position={[-1.4, 0.25, 0]}>
					<dodecahedronGeometry args={[0.5, 0]} />
					<meshStandardMaterial color="#7a6f63" flatShading />
				</mesh>
				<Karakter konum={[-1.45, 0, 0.1]} poz={gozKirp({...oturmus(0.68), bas: -0.15}, f)} golge={false} />
			</ThreeCanvas>
		</AbsoluteFill>
	);
};

// ---------- SAHNE 4: Uzaydan bakış: iki yıldız + Dünya ----------
export const UzaySahnesi: React.FC<SahneProps> = ({sure, kelime}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ikiKat = kelime('katına');
	const okyanus = kelime('okyanuslar');
	const uzak = kelime('uzakta');
	const isinma = anahtar(f, [[ikiKat - 10, 0], [okyanus + 20, 1], [uzak - 25, 1], [uzak + 25, 0]]);
	const R = anahtar(f, [[0, 3.6], [uzak - 40, 3.6], [uzak + 20, 5.1]]);
	const ciftAci = (f / fps) * 1.6;
	const dunyaAci = ((f - uzak) / fps) * 0.32 + 1.75;
	const dunyaKonum: V3 = [Math.cos(dunyaAci) * R, 0, Math.sin(dunyaAci) * R];
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, #13183a 0%, #05060f 70%)'}}>
			<ThreeCanvas {...tam} camera={{fov: 50}}>
				<Kamera
					konum={anahtar3(f, [[0, [1.5, 0.5, 21]], [uzak - 40, [1, 0.3, 23]], [sure, [0, 0, 30]]])}
					hedef={[0, 0, 0]}
					aci={50}
				/>
				<YildizAlani />
				<ambientLight intensity={0.15} />
				{/* yörünge düzlemi dikey ekrana sığsın diye yan çevrildi */}
				<group rotation={[0, 0.6, Math.PI / 2]}>
				<Yildiz konum={[Math.cos(ciftAci) * 0.75, 0, Math.sin(ciftAci) * 0.75]} r={0.5} renk="#fff1b0" parlama={6} isik={2.2} />
				<Yildiz konum={[-Math.cos(ciftAci) * 0.75, 0, -Math.sin(ciftAci) * 0.75]} r={0.45} renk="#ffc27f" parlama={6} isik={1.6} />
				<Yorunge r={3.6} renk="#ff7a4a" opaklik={f > uzak - 40 ? 0.5 : 0.35} />
				{f > uzak - 40 ? <Yorunge r={5.1} renk="#7cc4ff" opaklik={anahtar(f, [[uzak - 40, 0], [uzak, 0.55]])} /> : null}
				<Dunya konum={dunyaKonum} r={0.85} donus={f * 0.03} isinma={isinma} />
				</group>
			</ThreeCanvas>
			<BilgiKarti giris={ikiKat} baslik="2× ENERJİ" alt="Dünya'ya gelen ısı ikiye katlanır" renk="#ff6a3d" ust="10%" />
			{f >= uzak - 5 ? <BilgiKarti giris={uzak - 5} baslik="%40 DAHA UZAK" alt="yaşanabilir kalmak için" renk="#7cc4ff" ust="27%" /> : null}
		</AbsoluteFill>
	);
};

// ---------- SAHNE 5: Kepler-16b ----------
export const KeplerSahnesi: React.FC<SahneProps> = ({sure, kelime}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = (f / fps) * 1.3;
	const b = (f / fps) * 0.35 + 2.4;
	const kart = Math.max(0, kelime('kepler') - 10);
	return (
		<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #1a1430 0%, #040409 72%)'}}>
			<ThreeCanvas {...tam} camera={{fov: 50}}>
				<Kamera konum={anahtar3(f, [[0, [-2, 2.2, 9.5]], [sure, [1.5, 3.4, 7.5]]])} hedef={[0, 0, 0]} aci={50} />
				<YildizAlani />
				<ambientLight intensity={0.12} />
				<Yildiz konum={[Math.cos(a) * 0.55, 0, Math.sin(a) * 0.55]} r={0.55} renk="#ffb070" parlama={6} isik={2.4} />
				<Yildiz konum={[-Math.cos(a) * 1.4, 0, -Math.sin(a) * 1.4]} r={0.26} renk="#ff5a3c" parlama={6} isik={0.8} />
				<Yorunge r={3.3} opaklik={0.3} />
				<GazDevi konum={[Math.cos(b) * 3.3, 0, Math.sin(b) * 3.3]} r={0.48} donus={f * 0.02} />
			</ThreeCanvas>
			<BilgiKarti giris={kart} baslik="KEPLER-16b" alt="2011 · iki yıldızın etrafında 229 günde bir tur" renk="#ffd23f" ust="11%" />
		</AbsoluteFill>
	);
};

// ---------- SAHNE 6: Kapanış ----------
export const KapanisSahnesi: React.FC<SahneProps> = ({sure, kelime}) => {
	const f = useCurrentFrame();
	const abone = kelime('abone');
	const nabiz = 1 + 0.06 * Math.sin(f / 4);
	const s = anahtar(f, [[abone - 8, 0], [abone + 6, 1]]);
	return (
		<AbsoluteFill style={{background: '#04050c'}}>
			<ThreeCanvas {...tam} camera={{fov: 50}}>
				<Kamera konum={anahtar3(f, [[0, [0, 0.5, 7]], [sure, [0, 0.3, 5.6]]])} hedef={[0, 0.4, 0]} aci={50} />
				<YildizAlani />
				<ambientLight intensity={0.12} />
				<Yildiz konum={[-3, 2.6, -9]} r={0.9} renk="#fff1b0" parlama={7} isik={2.5} />
				<Yildiz konum={[3.4, 2.0, -10]} r={0.65} renk="#ffbe7a" parlama={7} isik={1.6} />
				<Dunya konum={[0, -0.2, 0]} r={1.25} donus={f * 0.012} />
			</ThreeCanvas>
			<div style={{position: 'absolute', top: '13%', width: '100%', textAlign: 'center', fontFamily: 'UzayBaslik, sans-serif', fontSize: 104, color: '#fff', textShadow: '0 0 30px #5aa8ff'}}>
				UZAY&YAŞAM
			</div>
			<div
				style={{
					position: 'absolute',
					top: '28%',
					width: '100%',
					textAlign: 'center',
					opacity: s,
					transform: `scale(${(0.6 + 0.4 * s) * nabiz})`,
				}}
			>
				<span
					style={{
						background: '#ff1e2d',
						color: '#fff',
						fontFamily: 'UzayBaslik, sans-serif',
						fontSize: 76,
						padding: '22px 60px',
						borderRadius: 60,
						boxShadow: '0 10px 40px rgba(255,30,45,0.55)',
					}}
				>
					ABONE OL
				</span>
			</div>
		</AbsoluteFill>
	);
};

export const SAHNELER: Record<string, React.FC<SahneProps>> = {
	yuzey: YuzeySahnesi,
	golge: GolgeSahnesi,
	gunbatimi: GunBatimiSahnesi,
	uzay: UzaySahnesi,
	kepler: KeplerSahnesi,
	kapanis: KapanisSahnesi,
};

