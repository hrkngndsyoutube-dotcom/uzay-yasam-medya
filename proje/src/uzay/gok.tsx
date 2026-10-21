import React, {useMemo} from 'react';
import * as THREE from 'three';

// GÖK CİSİMLERİ KÜTÜPHANESİ: yıldız, gezegen, Dünya, yıldız alanı, yörünge çizgisi
type V3 = [number, number, number];

// Her karede aynı sonucu veren rastgele sayı (render tutarlı olsun diye)
export const tohumlu = (tohum: number) => {
	let a = tohum >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

const dokuOnbellek = new Map<string, THREE.Texture>();
const doku = (anahtar: string, ciz: (c: CanvasRenderingContext2D, w: number, h: number) => void, w = 512, h = 256) => {
	if (!dokuOnbellek.has(anahtar)) {
		const cv = document.createElement('canvas');
		cv.width = w;
		cv.height = h;
		ciz(cv.getContext('2d')!, w, h);
		const t = new THREE.CanvasTexture(cv);
		t.colorSpace = THREE.SRGBColorSpace;
		dokuOnbellek.set(anahtar, t);
	}
	return dokuOnbellek.get(anahtar)!;
};

const parlamaDokusu = () =>
	doku(
		'parlama',
		(c, w, h) => {
			const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
			g.addColorStop(0, 'rgba(255,255,255,1)');
			g.addColorStop(0.18, 'rgba(255,255,255,0.75)');
			g.addColorStop(0.45, 'rgba(255,255,255,0.18)');
			g.addColorStop(1, 'rgba(255,255,255,0)');
			c.fillStyle = g;
			c.fillRect(0, 0, w, h);
		},
		256,
		256,
	);

// Parlayan yıldız / güneş
export const Yildiz: React.FC<{konum: V3; r: number; renk: string; parlama?: number; isik?: number}> = ({
	konum,
	r,
	renk,
	parlama = 5,
	isik = 0,
}) => (
	<group position={konum}>
		<mesh>
			<sphereGeometry args={[r, 48, 48]} />
			<meshBasicMaterial color={renk} toneMapped={false} />
		</mesh>
		<sprite scale={[r * parlama, r * parlama, 1]}>
			<spriteMaterial map={parlamaDokusu()} color={renk} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
		</sprite>
		{isik > 0 ? <pointLight intensity={isik} distance={0} decay={0} color={renk} /> : null}
	</group>
);

const dunyaDokusu = () =>
	doku('dunya', (c, w, h) => {
		c.fillStyle = '#1f5fae';
		c.fillRect(0, 0, w, h);
		const r = tohumlu(7);
		for (let i = 0; i < 26; i++) {
			const x = r() * w;
			const y = h * 0.18 + r() * h * 0.64;
			for (let j = 0; j < 14; j++) {
				c.fillStyle = j % 3 === 0 ? '#c9b27a' : '#3f9a4a';
				c.beginPath();
				c.ellipse(x + (r() - 0.5) * 60, y + (r() - 0.5) * 30, 8 + r() * 26, 6 + r() * 16, r() * 3, 0, Math.PI * 2);
				c.fill();
			}
		}
		c.fillStyle = '#f2f6fa';
		c.fillRect(0, 0, w, h * 0.07);
		c.fillRect(0, h * 0.93, w, h * 0.07);
		c.fillStyle = 'rgba(255,255,255,0.55)';
		for (let i = 0; i < 40; i++) {
			c.beginPath();
			c.ellipse(r() * w, r() * h, 20 + r() * 40, 3 + r() * 5, 0, 0, Math.PI * 2);
			c.fill();
		}
	});

// Dünya: isinma 0 → normal, 1 → kızgın/kızıl
export const Dunya: React.FC<{konum: V3; r: number; donus: number; isinma?: number}> = ({konum, r, donus, isinma = 0}) => (
	<group position={konum}>
		<mesh rotation={[0.41, donus, 0]}>
			<sphereGeometry args={[r, 64, 64]} />
			<meshStandardMaterial map={dunyaDokusu()} roughness={0.85} emissive="#ff3b00" emissiveIntensity={isinma * 0.9} />
		</mesh>
		<mesh scale={1.06}>
			<sphereGeometry args={[r, 48, 48]} />
			<meshBasicMaterial
				color={new THREE.Color('#7cc4ff').lerp(new THREE.Color('#ff6a2b'), isinma)}
				transparent
				opacity={0.22}
				side={THREE.BackSide}
				depthWrite={false}
			/>
		</mesh>
	</group>
);

const gazDevDokusu = (renkler: string[], anahtar: string) =>
	doku(anahtar, (c, w, h) => {
		const r = tohumlu(anahtar.length * 31);
		let y = 0;
		while (y < h) {
			const k = 4 + r() * 18;
			c.fillStyle = renkler[Math.floor(r() * renkler.length)];
			c.fillRect(0, y, w, k + 1);
			y += k;
		}
	});

export const GazDevi: React.FC<{konum: V3; r: number; donus: number; renkler?: string[]}> = ({
	konum,
	r,
	donus,
	renkler = ['#d9b98c', '#c79d6b', '#e8d3b0', '#b4835a', '#efe2c8'],
}) => (
	<mesh position={konum} rotation={[0.15, donus, 0.1]}>
		<sphereGeometry args={[r, 64, 64]} />
		<meshStandardMaterial map={gazDevDokusu(renkler, renkler.join(''))} roughness={0.9} />
	</mesh>
);

// Uzak yıldızlar
export const YildizAlani: React.FC<{adet?: number; yaricap?: number; parlaklik?: number}> = ({adet = 1800, yaricap = 120, parlaklik = 1}) => {
	const geo = useMemo(() => {
		const r = tohumlu(99);
		const p = new Float32Array(adet * 3);
		for (let i = 0; i < adet; i++) {
			const u = r() * 2 - 1;
			const t = r() * Math.PI * 2;
			const s = Math.sqrt(1 - u * u);
			const d = yaricap * (0.7 + r() * 0.3);
			p[i * 3] = s * Math.cos(t) * d;
			p[i * 3 + 1] = u * d;
			p[i * 3 + 2] = s * Math.sin(t) * d;
		}
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.BufferAttribute(p, 3));
		return g;
	}, [adet, yaricap]);
	return (
		<points geometry={geo}>
			<pointsMaterial color="#ffffff" size={0.45} sizeAttenuation transparent opacity={parlaklik} depthWrite={false} toneMapped={false} />
		</points>
	);
};

// Yörünge çizgisi (yatay halka)
export const Yorunge: React.FC<{r: number; renk?: string; opaklik?: number; merkez?: V3}> = ({r, renk = '#9ec9ff', opaklik = 0.35, merkez = [0, 0, 0]}) => {
	const geo = useMemo(() => {
		const pts: THREE.Vector3[] = [];
		for (let i = 0; i <= 160; i++) {
			const a = (i / 160) * Math.PI * 2;
			pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
		}
		return new THREE.BufferGeometry().setFromPoints(pts);
	}, [r]);
	return (
		<lineLoop geometry={geo} position={merkez}>
			<lineBasicMaterial color={renk} transparent opacity={opaklik} />
		</lineLoop>
	);
};
