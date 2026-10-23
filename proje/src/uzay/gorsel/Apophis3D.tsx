import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {DunyaMalzeme} from './DunyaDoku';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {tohumlu} from '../gok';

// GERÇEK ÖLÇEKLİ 3D SAHNE: Dünya + Türksat (yer eşzamanlı) yörüngesi + Apophis'in geçişi
// Birim: Dünya yarıçapı (6371 km). GEO = 42.157 km merkezden = 6,62 R. Apophis yüzeyden 32.000 km = 6,02 R.
const GEO = (6371 + 35786) / 6371;
const APO = (6371 + 32000) / 6371;
const MAVI = '#38d9ff';

// Apophis yolu: en yakın nokta P, doğrultu D (P'ye dik)
const P = new THREE.Vector3(0.62, 0.35, -0.62).normalize().multiplyScalar(APO);
const D = new THREE.Vector3().crossVectors(P, new THREE.Vector3(0.15, 1, -0.1)).normalize();

const kameraDurum = (f: number, sure: number) => {
	const geri = interpolate(f, [0, sure * 0.32], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const don = interpolate(f, [0, sure], [0, 0.35]);
	const uzak = interpolate(geri, [0, 1], [3.4, 15]);
	const yuk = interpolate(geri, [0, 1], [0.9, 32]);
	return {
		konum: new THREE.Vector3(Math.sin(don) * uzak, yuk, Math.cos(don) * uzak),
		hedef: new THREE.Vector3(0, 0, interpolate(geri, [0, 1], [0, 4])),
	};
};

const apophisKonum = (f: number, sure: number) => {
	const t = interpolate(f, [sure * 0.42, sure * 0.81, sure], [-0.7, 0, 0.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return P.clone().add(D.clone().multiplyScalar(t * 18));
};

const Kamera: React.FC<{konum: THREE.Vector3; hedef: THREE.Vector3}> = ({konum, hedef}) => {
	const camera = useThree((st) => st.camera) as THREE.PerspectiveCamera;
	React.useLayoutEffect(() => {
		camera.position.copy(konum);
		camera.fov = 45;
		camera.near = 0.05;
		camera.far = 500;
		camera.lookAt(hedef);
		camera.updateProjectionMatrix();
	}, [camera, konum, hedef]);
	return null;
};

export const Apophis3D: React.FC<{sure: number}> = ({sure}) => {
	const f = useCurrentFrame();
	const {width, height} = useVideoConfig();

	const yildizlar = React.useMemo(() => {
		const r = tohumlu(77);
		const p = new Float32Array(2400 * 3);
		for (let i = 0; i < 2400; i++) {
			const u = r() * 2 - 1;
			const a = r() * Math.PI * 2;
			const s = Math.sqrt(1 - u * u);
			p.set([Math.cos(a) * s * 200, u * 200, Math.sin(a) * s * 200], i * 3);
		}
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.BufferAttribute(p, 3));
		return g;
	}, []);

	const kaya = React.useMemo(() => {
		const g = new THREE.IcosahedronGeometry(1, 3);
		const r = tohumlu(5);
		const pos = g.attributes.position as THREE.BufferAttribute;
		const v = new THREE.Vector3();
		for (let i = 0; i < pos.count; i++) {
			v.fromBufferAttribute(pos, i);
			v.x *= 1.7; // fıstık biçimi
			v.multiplyScalar(0.85 + r() * 0.25);
			pos.setXYZ(i, v.x, v.y, v.z);
		}
		g.computeVertexNormals();
		return g;
	}, []);

	const yolCizgi = React.useMemo(() => {
		const pts = [P.clone().add(D.clone().multiplyScalar(-30)), P.clone().add(D.clone().multiplyScalar(30))];
		const g = new THREE.BufferGeometry().setFromPoints(pts);
		return new THREE.Line(g, new THREE.LineBasicMaterial({color: '#ffb347', transparent: true, opacity: 0}));
	}, []);
	(yolCizgi.material as THREE.LineBasicMaterial).opacity = 0.5 * interpolate(f, [sure * 0.42, sure * 0.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const {konum, hedef} = kameraDurum(f, sure);
	const apo = apophisKonum(f, sure);
	const dunyaDon = -2.18 + f * 0.0012;
	const uyduAci = (i: number) => (i / 14) * Math.PI * 2 + dunyaDon * 0.2;
	const turksatAci = -1.45;
	const turksat = new THREE.Vector3(Math.sin(turksatAci) * GEO, 0, Math.cos(turksatAci) * GEO);

	// 2D etiketler için izdüşüm
	const cam = new THREE.PerspectiveCamera(45, width / height, 0.05, 500);
	cam.position.copy(konum);
	cam.lookAt(hedef);
	cam.updateMatrixWorld();
	const ekran = (v: THREE.Vector3) => {
		const p = v.clone().project(cam);
		return {x: (p.x * 0.5 + 0.5) * width, y: (-p.y * 0.5 + 0.5) * height};
	};
	const halkaOp = interpolate(f, [sure * 0.12, sure * 0.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const apoOp = interpolate(f, [sure * 0.42, sure * 0.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const tE = ekran(turksat);
	const aE = ekran(apo);
	const dE = ekran(new THREE.Vector3(0, 0, 0));
	const etiket = (x: number, y: number, ust: string, alt: string, renk: string, op: number, yon: 1 | -1 | 0 = -1) => (
		<div style={{position: 'absolute', left: x, top: y, transform: yon === 0 ? 'translate(-125%, -50%)' : `translate(-50%, ${yon < 0 ? '-140%' : '70%'})`, opacity: op, textAlign: 'center', whiteSpace: 'nowrap'}}>
			<div style={{fontFamily: 'UzayKapak, Impact, sans-serif', fontSize: 54, color: renk, lineHeight: 1, textShadow: '0 4px 0 rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.9)'}}>{ust}</div>
			<div style={{fontFamily: 'UzayYazi, sans-serif', fontSize: 30, color: '#e8eef5', marginTop: 4, textShadow: '0 2px 8px rgba(0,0,0,1)'}}>{alt}</div>
		</div>
	);

	return (
		<AbsoluteFill style={{background: '#000'}}>
			<ThreeCanvas width={width} height={height}>
				<Kamera konum={konum} hedef={hedef} />
				<ambientLight intensity={0.18} />
				<directionalLight position={[8, 14, 10]} intensity={2.8} />
				<points geometry={yildizlar}>
					<pointsMaterial color="#ffffff" size={0.35} sizeAttenuation transparent opacity={0.8} />
				</points>
				{/* Dünya */}
				<group rotation={[0.41, 0, 0]}>
					<mesh rotation={[0, dunyaDon, 0]}>
						<sphereGeometry args={[1, 96, 96]} />
						<DunyaMalzeme />
					</mesh>
				</group>
				<mesh>
					<sphereGeometry args={[1.035, 64, 64]} />
					<meshBasicMaterial color="#5fb8ff" transparent opacity={0.16} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
				</mesh>
				{/* GEO halkası + uydular */}
				<mesh rotation={[Math.PI / 2, 0, 0]}>
					<torusGeometry args={[GEO, 0.018, 8, 256]} />
					<meshBasicMaterial color={MAVI} transparent opacity={0.85 * halkaOp} />
				</mesh>
				{Array.from({length: 14}).map((_, i) => {
					const a = uyduAci(i);
					return (
						<mesh key={i} position={[Math.sin(a) * GEO, 0, Math.cos(a) * GEO]}>
							<sphereGeometry args={[0.07, 10, 10]} />
							<meshBasicMaterial color="#ffffff" transparent opacity={halkaOp * 0.8} />
						</mesh>
					);
				})}
				<mesh position={turksat.toArray()}>
					<sphereGeometry args={[0.13, 16, 16]} />
					<meshBasicMaterial color={MAVI} transparent opacity={halkaOp} />
				</mesh>
				{/* Apophis yolu + kaya (boyut abartılı) */}
				<primitive object={yolCizgi} />
				<mesh geometry={kaya} position={apo.toArray()} rotation={[f * 0.03, f * 0.05, 0]} scale={0.32}>
					<meshStandardMaterial color="#9c8f84" roughness={1} transparent opacity={apoOp} />
				</mesh>
				<mesh position={apo.toArray()}>
					<sphereGeometry args={[0.7, 16, 16]} />
					<meshBasicMaterial color="#ffb347" transparent opacity={0.3 * apoOp} blending={THREE.AdditiveBlending} />
				</mesh>
			</ThreeCanvas>
			{etiket(dE.x, dE.y, 'DÜNYA', '', '#ffffff', halkaOp, 1)}
			{etiket(tE.x, tE.y, 'TÜRKSAT', '36.000 km', MAVI, halkaOp)}
			{etiket(aE.x, aE.y, 'APOPHIS', '32.000 km', '#ffb347', apoOp, 0)}
			<div style={{position: 'absolute', bottom: 120, width: '100%', textAlign: 'center', fontFamily: 'UzayYazi, sans-serif', fontSize: 24, color: 'rgba(255,255,255,0.55)'}}>
				Mesafeler ölçekli · asteroit boyutu temsilîdir
			</div>
		</AbsoluteFill>
	);
};
