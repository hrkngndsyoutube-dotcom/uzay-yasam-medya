import React from 'react';
import {GunIsigi} from '../sahne/araclar';
import {Agac, Bina, Kapi, Kutu, SokakLambasi} from '../sahne/parcalar';

// MEKÂN: SOKAK (ev önü, kaldırım, yol, arka planda şehir)
export const SOKAK = {
	evKapisi: [-5.55, 0, -2.93] as [number, number, number], // kapı menteşesi
	kapiOnu: [-5.0, 0, -2.6] as [number, number, number],
	kaldirim: 0.0, // kaldırımda yürüme hattı (z)
	yol: 3.3, // yolda, arabanın önünde yürüme hattı (z)
	arabaSeridi: 1.8, // park eden arabanın merkezi (z)
};

export const Sokak: React.FC<{kapiAcikligi?: number; children?: React.ReactNode}> = ({kapiAcikligi = 0, children}) => {
	return (
		<>
			<color attach="background" args={['#bfe2f6']} />
			<fog attach="fog" args={['#cfe8f7', 18, 60]} />
			<GunIsigi />

			{/* zemin: çimen, kaldırım, bordür, yol */}
			<Kutu boyut={[140, 0.1, 40]} konum={[0, -0.06, -20]} renk="#9cc98a" />
			<Kutu boyut={[140, 0.12, 3.8]} konum={[0, -0.04, -1.3]} renk="#d9d4cb" />
			{Array.from({length: 70}).map((_, i) => (
				<Kutu key={i} boyut={[0.03, 0.005, 3.8]} konum={[-70 + i * 2, 0.022, -1.3]} renk="#c2bcb2" />
			))}
			<Kutu boyut={[140, 0.18, 0.22]} konum={[0, 0.0, 0.6]} renk="#b8b2a8" />
			<Kutu boyut={[140, 0.08, 9]} konum={[0, -0.06, 5.2]} renk="#4b4f57" />
			{Array.from({length: 35}).map((_, i) => (
				<Kutu key={i} boyut={[1.6, 0.01, 0.14]} konum={[-70 + i * 4, -0.015, 5.6]} renk="#f2f2ea" />
			))}

			{/* kahramanın evi */}
			<group position={[-5, 0, -4.8]}>
				<Kutu boyut={[5.2, 3.2, 3.6]} konum={[0, 1.6, 0]} renk="#f3d9a4" />
				<mesh position={[0, 3.2 + 0.9, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 1, 1]}>
					<coneGeometry args={[3.9, 1.8, 4]} />
					<meshStandardMaterial color="#b4513c" flatShading />
				</mesh>
				{/* pencereler */}
				{[-1.7, 1.6].map((x) => (
					<group key={x} position={[x, 1.75, 1.81]}>
						<Kutu boyut={[1.1, 1.0, 0.06]} konum={[0, 0, 0]} renk="#ffffff" />
						<Kutu boyut={[0.95, 0.85, 0.05]} konum={[0, 0, 0.02]} renk="#a9d3ec" />
						<Kutu boyut={[0.05, 0.85, 0.07]} konum={[0, 0, 0.04]} renk="#ffffff" />
					</group>
				))}
				<Kutu boyut={[1.6, 0.12, 0.9]} konum={[-0.05, 0.06, 2.2]} renk="#c9c2b6" />
			</group>
			{/* açık kapının ardındaki karanlık ev içi */}
			<Kutu boyut={[1.1, 2.2, 0.01]} konum={[SOKAK.evKapisi[0] + 0.55, 1.1, -2.992]} renk="#2a2420" />
			<Kutu boyut={[1.34, 0.12, 0.12]} konum={[SOKAK.evKapisi[0] + 0.55, 2.26, -2.95]} renk="#ffffff" />
			<Kapi konum={SOKAK.evKapisi} aciklik={kapiAcikligi} renk="#3f6e8c" />

			{/* komşu binalar */}
			<Bina konum={[2.5, 0, -5.5]} boyut={[4.2, 5.6, 3]} renk="#e7b7a3" />
			<Bina konum={[8, 0, -5.2]} boyut={[5, 4.4, 3]} renk="#c8d6a5" />
			<Bina konum={[14, 0, -5.8]} boyut={[4.4, 7.2, 3]} renk="#a7c4dc" />
			<Bina konum={[20, 0, -5.4]} boyut={[5, 5, 3]} renk="#f0c987" />
			<Bina konum={[26, 0, -5.6]} boyut={[4.6, 6.4, 3]} renk="#d9a5b3" />
			<Bina konum={[-12, 0, -5.4]} boyut={[5, 5.2, 3]} renk="#cbb8e0" />

			{/* uzak şehir silueti (derinlik için) */}
			{Array.from({length: 18}).map((_, i) => (
				<Kutu
					key={i}
					boyut={[3, 6 + ((i * 37) % 9), 3]}
					konum={[-24 + i * 3.6, (6 + ((i * 37) % 9)) / 2, -22 - (i % 3) * 3]}
					renk={['#9fb4c7', '#b2c3d3', '#8ea6bc'][i % 3]}
				/>
			))}

			{/* ağaçlar ve lambalar */}
			{[-9, -1.2, 5.2, 11, 17, 23, 29].map((x, i) => (
				<Agac key={x} konum={[x, 0, -2.6]} olcek={0.9 + (i % 2) * 0.15} renk={i % 2 ? '#4f9a5c' : '#67ad6a'} />
			))}
			{[-7, 6, 18, 30].map((x) => (
				<SokakLambasi key={x} konum={[x, 0, 0.35]} />
			))}

			{children}
		</>
	);
};
