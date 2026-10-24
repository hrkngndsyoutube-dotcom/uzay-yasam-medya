import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {DunyaMalzeme} from './DunyaDoku';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {tohumlu} from '../gok';

// GERÇEK DÜNYA KÜRESİ ÜZERİNDE ROTA: İstanbul'dan bir noktaya büyük daire yayı (ölçek modeli anlatımları için)
const MAVI = '#38d9ff';
const TURUNCU = '#ffb347';

// enlem/boylam → küre üzerindeki nokta (three.js SphereGeometry UV eşlemesiyle uyumlu)
const nokta = (lat: number, lon: number, r = 1) => {
	const f = THREE.MathUtils.degToRad(lat);
	const l = THREE.MathUtils.degToRad(lon);
	return new THREE.Vector3(Math.cos(l) * Math.cos(f) * r, Math.sin(f) * r, -Math.sin(l) * Math.cos(f) * r);
};
// boylam/enlemi kameraya (+z) çeviren dönüş
const yuzAci = (lat: number, lon: number) => {
	const l = THREE.MathUtils.degToRad(lon);
	return {y: -Math.atan2(Math.cos(l), -Math.sin(l)), x: THREE.MathUtils.degToRad(lat)};
};

const Kamera: React.FC<{z: number}> = ({z}) => {
	const camera = useThree((st) => st.camera) as THREE.PerspectiveCamera;
	React.useLayoutEffect(() => {
		camera.position.set(0, 0, z);
		camera.fov = 40;
		camera.near = 0.05;
		camera.far = 500;
		camera.lookAt(0, 0, 0);
		camera.updateProjectionMatrix();
	}, [camera, z]);
	return null;
};

export type RotaProps = {
	sure: number;
	bas: [number, number];
	hedefYon: [number, number]; // yönü veren şehir
	oran: number; // hedefYon mesafesinin kaç katı uzağa gidilecek (1 = tam o şehir)
	basEtiket: [string, string];
	sonEtiket: [string, string];
	ortaEtiket: string;
	zSon?: number; // son kamera uzaklığı (geniş rotalar için büyüt)
};

export const Rota3D: React.FC<RotaProps> = ({sure, bas, hedefYon, oran, basEtiket, sonEtiket, ortaEtiket, zSon = 4.3}) => {
	const f = useCurrentFrame();
	const {width, height} = useVideoConfig();

	const A = nokta(bas[0], bas[1]);
	const Byon = nokta(hedefYon[0], hedefYon[1]);
	const aci = A.angleTo(Byon) * oran;
	const eksen = new THREE.Vector3().crossVectors(A, Byon).normalize();
	const yayNokta = (t: number) => A.clone().applyAxisAngle(eksen, aci * t);
	const B = yayNokta(1);
	const orta = yayNokta(0.5);
	// orta noktanın enlem/boylamı (kamerayı ortalamak için)
	const ortaLat = THREE.MathUtils.radToDeg(Math.asin(orta.y));
	const ortaLon = THREE.MathUtils.radToDeg(Math.atan2(-orta.z, orta.x));

	const p1 = interpolate(f, [0, sure * 0.35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
	const ciz = interpolate(f, [sure * 0.22, sure * 0.55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
	const y0 = yuzAci(bas[0], bas[1]);
	const y1 = yuzAci(ortaLat, ortaLon);
	const rotY = interpolate(p1, [0, 1], [y0.y, y1.y]) + f * 0.0004;
	const rotX = interpolate(p1, [0, 1], [y0.x, y1.x]);
	const z = interpolate(p1, [0, 1], [2.1, zSon]);

	const yildizlar = React.useMemo(() => {
		const r = tohumlu(91);
		const p = new Float32Array(1800 * 3);
		for (let i = 0; i < 1800; i++) {
			const u = r() * 2 - 1;
			const a = r() * Math.PI * 2;
			const s = Math.sqrt(1 - u * u);
			p.set([Math.cos(a) * s * 120, u * 120, Math.sin(a) * s * 120], i * 3);
		}
		const g = new THREE.BufferGeometry();
		g.setAttribute('position', new THREE.BufferAttribute(p, 3));
		return g;
	}, []);

	const tup = React.useMemo(() => {
		const pts = Array.from({length: 80}).map((_, i) => {
			const t = (Math.max(ciz, 0.002) * i) / 79;
			return yayNokta(t).multiplyScalar(1 + 0.12 * Math.sin(Math.PI * t));
		});
		return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.007, 8, false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ciz]);
	const uc = yayNokta(ciz).multiplyScalar(1 + 0.12 * Math.sin(Math.PI * ciz));

	// dünya dönüşünü dışarıda da uygula (etiket izdüşümü için)
	const m = new THREE.Matrix4().makeRotationX(rotX).multiply(new THREE.Matrix4().makeRotationY(rotY));
	const cam = new THREE.PerspectiveCamera(40, width / height, 0.05, 500);
	cam.position.set(0, 0, z);
	cam.lookAt(0, 0, 0);
	cam.updateMatrixWorld();
	const ekran = (v: THREE.Vector3) => {
		const p = v.clone().applyMatrix4(m).project(cam);
		return {x: (p.x * 0.5 + 0.5) * width, y: (-p.y * 0.5 + 0.5) * height};
	};
	const aE = ekran(A);
	const bE = ekran(B);
	const oE = ekran(orta.clone().multiplyScalar(1.12));
	const sonOp = interpolate(ciz, [0.92, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const ortaOp = interpolate(ciz, [0.45, 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const etiket = (x: number, y: number, ust: string, alt: string, renk: string, op: number, kay = -50) => (
		<div style={{position: 'absolute', left: Math.min(Math.max(x, 190), width - 190), top: y, transform: `translate(${kay}%, -150%)`, opacity: op, textAlign: 'center', whiteSpace: 'nowrap'}}>
			<div style={{fontFamily: 'UzayKapak, Impact, sans-serif', fontSize: 56, color: renk, lineHeight: 1, textShadow: '0 4px 0 rgba(0,0,0,0.9), 0 0 18px rgba(0,0,0,0.9)'}}>{ust}</div>
			{alt ? <div style={{fontFamily: 'UzayYazi, sans-serif', fontSize: 30, color: '#e8eef5', marginTop: 4, textShadow: '0 2px 8px rgba(0,0,0,1)'}}>{alt}</div> : null}
		</div>
	);

	return (
		<AbsoluteFill style={{background: '#000'}}>
			<ThreeCanvas width={width} height={height}>
				<Kamera z={z} />
				<ambientLight intensity={0.5} />
				<directionalLight position={[3, 2, 5]} intensity={2.4} />
				<points geometry={yildizlar}>
					<pointsMaterial color="#ffffff" size={0.25} sizeAttenuation transparent opacity={0.8} />
				</points>
				<group rotation={[rotX, 0, 0]}>
					<group rotation={[0, rotY, 0]}>
						<mesh>
							<sphereGeometry args={[1, 128, 128]} />
							<DunyaMalzeme />
						</mesh>
						<mesh geometry={tup}>
							<meshBasicMaterial color={TURUNCU} />
						</mesh>
						<mesh position={A.toArray()}>
							<sphereGeometry args={[0.018, 16, 16]} />
							<meshBasicMaterial color="#ffd23f" />
						</mesh>
						<mesh position={A.toArray()}>
							<sphereGeometry args={[0.045, 16, 16]} />
							<meshBasicMaterial color="#ffb000" transparent opacity={0.35} blending={THREE.AdditiveBlending} />
						</mesh>
						<mesh position={uc.toArray()}>
							<sphereGeometry args={[0.016, 16, 16]} />
							<meshBasicMaterial color="#ffffff" />
						</mesh>
						<mesh position={B.toArray()}>
							<sphereGeometry args={[0.022, 16, 16]} />
							<meshBasicMaterial color={MAVI} transparent opacity={sonOp} />
						</mesh>
					</group>
				</group>
				<mesh>
					<sphereGeometry args={[1.03, 64, 64]} />
					<meshBasicMaterial color="#5fb8ff" transparent opacity={0.14} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
				</mesh>
			</ThreeCanvas>
			{etiket(aE.x, aE.y, basEtiket[0], basEtiket[1], '#ffd23f', 1)}
			{etiket(oE.x, oE.y, ortaEtiket, '', '#ffffff', ortaOp)}
			{etiket(bE.x, bE.y, sonEtiket[0], sonEtiket[1], MAVI, sonOp, -80)}
		</AbsoluteFill>
	);
};
