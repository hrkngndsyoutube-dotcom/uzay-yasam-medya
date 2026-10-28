import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {DunyaMalzeme} from './DunyaDoku';
import {tohumlu} from '../gok';

// 2012 GÜNEŞ FIRTINASI: Güneş, Dünya yörüngesi, plazma bulutu Dünya'nın 1 hafta önceki yerinden geçiyor.
// Yörünge açısı: 1 hafta ≈ 6,9°. Boyutlar temsilî (Dünya ve Güneş büyütülmüş).
const R = 6;
const MAVI = '#38d9ff';
const TURUNCU = '#ff8a3d';
const HAFTA = (7 / 365.25) * Math.PI * 2;

const Kamera: React.FC<{p: THREE.Vector3; h: THREE.Vector3}> = ({p, h}) => {
	const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
	React.useLayoutEffect(() => {
		camera.position.copy(p);
		camera.fov = 42;
		camera.near = 0.05;
		camera.far = 500;
		camera.lookAt(h);
		camera.updateProjectionMatrix();
	}, [camera, p, h]);
	return null;
};

export const Firtina3D: React.FC<{sure: number}> = ({sure}) => {
	const f = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const u = (a: number, b: number) => interpolate(f, [sure * a, sure * b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});

	const dunyaAci = Math.PI / 2 - 0.17; // Dünya'nın şimdiki yeri
	const hedefAci = dunyaAci + HAFTA * 2.2; // bulutun kestiği nokta (görünürlük için abartılı)
	const nokta = (a: number) => new THREE.Vector3(Math.cos(a) * R, 0, -Math.sin(a) * R);
	const dunya = nokta(dunyaAci);
	const hedef = nokta(hedefAci);

	const bulut = u(0.15, 0.7);
	const geri = u(0, 1);
	const kamP = new THREE.Vector3(0, interpolate(geri, [0, 1], [7, 19]), interpolate(geri, [0, 1], [6, 5]));
	const kamH = new THREE.Vector3(0, 0, interpolate(geri, [0, 1], [-0.2, -2.0]));

	const yildiz = React.useMemo(() => {
		const r = tohumlu(12);
		const p = new Float32Array(2000 * 3);
		for (let i = 0; i < 2000; i++) {
			const z = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - z * z);
			p.set([Math.cos(a) * s * 150, z * 150, Math.sin(a) * s * 150], i * 3);
		}
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.BufferAttribute(p, 3));
		return g;
	}, []);
	const yorunge = React.useMemo(() => {
		const pts = Array.from({length: 257}).map((_, i) => nokta((i / 256) * Math.PI * 2));
		return new THREE.BufferGeometry().setFromPoints(pts);
	}, []);

	// bulut: Güneş'ten hedefe uzanan genişleyen koni
	const yon = hedef.clone().normalize();
	const uzunluk = R * 1.25 * bulut;
	const merkez = yon.clone().multiplyScalar(uzunluk / 2 + 0.5);
	const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), yon);

	const cam = new THREE.PerspectiveCamera(42, width / height, 0.05, 500);
	cam.position.copy(kamP);
	cam.lookAt(kamH);
	cam.updateMatrixWorld();
	const ekran = (v: THREE.Vector3) => {
		const p = v.clone().project(cam);
		return {x: (p.x * 0.5 + 0.5) * width, y: (-p.y * 0.5 + 0.5) * height};
	};
	const dE = ekran(dunya), hE = ekran(hedef), gE = ekran(new THREE.Vector3());
	const etOp = u(0.55, 0.68);
	const etiket = (x: number, y: number, ust: string, alt: string, renk: string, op: number, dy = '-150%') => (
		<div style={{position: 'absolute', left: Math.min(Math.max(x, 200), width - 200), top: y, transform: `translate(-50%, ${dy})`, opacity: op, textAlign: 'center', whiteSpace: 'nowrap'}}>
			<div style={{fontFamily: 'UzayKapak, Impact, sans-serif', fontSize: 54, color: renk, lineHeight: 1, textShadow: '0 4px 0 rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.9)'}}>{ust}</div>
			{alt ? <div style={{fontFamily: 'UzayYazi, sans-serif', fontSize: 30, color: '#e8eef5', marginTop: 4, textShadow: '0 2px 8px #000'}}>{alt}</div> : null}
		</div>
	);

	return (
		<AbsoluteFill style={{background: '#000'}}>
			<ThreeCanvas width={width} height={height}>
				<Kamera p={kamP} h={kamH} />
				<ambientLight intensity={0.25} />
				<pointLight position={[0, 0, 0]} intensity={60} distance={0} decay={1} />
				<points geometry={yildiz}>
					<pointsMaterial color="#fff" size={0.3} sizeAttenuation transparent opacity={0.8} />
				</points>
				<mesh>
					<sphereGeometry args={[0.7, 48, 48]} />
					<meshBasicMaterial color="#ffd27a" />
				</mesh>
				<mesh>
					<sphereGeometry args={[1.05, 48, 48]} />
					<meshBasicMaterial color="#ff9a3d" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
				</mesh>
				<line>
					<primitive object={yorunge} attach="geometry" />
					<lineBasicMaterial color={MAVI} transparent opacity={0.6} />
				</line>
				<mesh position={dunya.toArray()} rotation={[0.4, f * 0.01, 0]}>
					<sphereGeometry args={[0.32, 48, 48]} />
					<DunyaMalzeme />
				</mesh>
				<mesh position={hedef.toArray()}>
					<sphereGeometry args={[0.32, 24, 24]} />
					<meshBasicMaterial color="#ffffff" transparent opacity={0.18 * etOp} wireframe />
				</mesh>
				{bulut > 0.01 ? (
					<mesh position={merkez.toArray()} quaternion={q}>
						<coneGeometry args={[1.1 * bulut + 0.15, uzunluk, 48, 1, true]} />
						<meshBasicMaterial color={TURUNCU} transparent opacity={0.32} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
					</mesh>
				) : null}
			</ThreeCanvas>
			{etiket(gE.x, gE.y, 'GÜNEŞ', '', '#ffd27a', u(0.05, 0.15) * (1 - u(0.45, 0.55)), '70%')}
			{etiket(dE.x + 120, dE.y, 'DÜNYA', 'o gün buradaydı', MAVI, etOp, '-50%')}
			{etiket(hE.x - 60, hE.y, '1 HAFTA ÖNCE', 'Dünya buradaydı', TURUNCU, etOp, '-170%')}
			<div style={{position: 'absolute', bottom: 120, width: '100%', textAlign: 'center', fontFamily: 'UzayYazi, sans-serif', fontSize: 24, color: 'rgba(255,255,255,0.55)'}}>Boyutlar ve açı temsilîdir</div>
		</AbsoluteFill>
	);
};
