import React, {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import {Easing, interpolate} from 'remotion';
import * as THREE from 'three';

export type V3 = [number, number, number];

// Anahtar kareler arasında yumuşak geçiş: [[kare, değer], ...]
export const anahtar = (frame: number, kareler: [number, number][], yumusak = true): number => {
	const girdi = kareler.map((k) => k[0]);
	const cikti = kareler.map((k) => k[1]);
	return interpolate(frame, girdi, cikti, {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: yumusak ? Easing.inOut(Easing.cubic) : undefined,
	});
};

export const anahtar3 = (frame: number, kareler: [number, V3][], yumusak = true): V3 => [
	anahtar(frame, kareler.map(([f, v]) => [f, v[0]]), yumusak),
	anahtar(frame, kareler.map(([f, v]) => [f, v[1]]), yumusak),
	anahtar(frame, kareler.map(([f, v]) => [f, v[2]]), yumusak),
];

// Yürüme yolu: noktalar arasında sabit hızla ilerler, adım fazını mesafeden hesaplar
// (böylece ayaklar yerde kaymaz)
export const ADIM = 0.62; // bir adımın dünya birimi uzunluğu
export const yol = (frame: number, bas: number, son: number, noktalar: V3[]) => {
	const parcalar: number[] = [];
	let toplam = 0;
	for (let i = 1; i < noktalar.length; i++) {
		const d = Math.hypot(
			noktalar[i][0] - noktalar[i - 1][0],
			noktalar[i][2] - noktalar[i - 1][2],
		);
		parcalar.push(d);
		toplam += d;
	}
	const t = interpolate(frame, [bas, son], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.35, 0, 0.65, 1),
	});
	let kalan = t * toplam;
	let konum: V3 = noktalar[0];
	let yon: 1 | -1 = noktalar[noktalar.length - 1][0] >= noktalar[0][0] ? 1 : -1;
	for (let i = 0; i < parcalar.length; i++) {
		const a = noktalar[i];
		const b = noktalar[i + 1];
		if (kalan <= parcalar[i] || i === parcalar.length - 1) {
			const k = parcalar[i] === 0 ? 1 : Math.min(1, kalan / parcalar[i]);
			konum = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
			if (Math.abs(b[0] - a[0]) > 0.05) yon = b[0] > a[0] ? 1 : -1;
			break;
		}
		kalan -= parcalar[i];
	}
	const mesafe = t * toplam;
	const yuruyor = frame > bas && frame < son;
	return {konum, yon, faz: (mesafe / ADIM) * Math.PI, yuruyor};
};

// KAMERA: her karede konumu ve baktığı noktayı ayarlar
export const Kamera: React.FC<{konum: V3; hedef: V3; aci?: number}> = ({konum, hedef, aci = 38}) => {
	const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
	useLayoutEffect(() => {
		camera.position.set(...konum);
		camera.fov = aci;
		camera.lookAt(new THREE.Vector3(...hedef));
		camera.updateProjectionMatrix();
	}, [camera, konum, hedef, aci]);
	return null;
};

// Standart gün ışığı
export const GunIsigi: React.FC<{guc?: number}> = ({guc = 1}) => (
	<>
		<hemisphereLight args={['#ffffff', '#c9b79c', 1.4 * guc]} />
		<directionalLight position={[6, 10, 8]} intensity={2.2 * guc} />
		<ambientLight intensity={0.35 * guc} />
	</>
);
