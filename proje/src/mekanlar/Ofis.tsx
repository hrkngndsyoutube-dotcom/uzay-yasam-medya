import React from 'react';
import {GunIsigi} from '../sahne/araclar';
import {Bitki, Cerceve, Kutu, Masa, Silindir} from '../sahne/parcalar';

// MEKÂN: OFİS (çalışma masası, ofis sandalyesi, pencereden şehir)
export const OFIS = {
	yuruyusHatti: -1.5,
	sandalye: [-0.15, 0, -1.5] as [number, number, number],
	sandalyeKalca: 0.6 / 0.8,
	masa: [0.95, 0, -1.5] as [number, number, number],
};

export const OfisSandalyesi: React.FC<{konum: [number, number, number]}> = ({konum}) => (
	<group position={konum}>
		<Kutu boyut={[0.6, 0.1, 0.6]} konum={[0, 0.52, 0]} renk="#2f3542" />
		<Kutu boyut={[0.1, 0.75, 0.55]} konum={[-0.3, 0.95, 0]} renk="#2f3542" />
		<Silindir r={0.04} h={0.45} konum={[0, 0.26, 0]} renk="#7f8794" />
		{[0, 1, 2, 3, 4].map((i) => (
			<Kutu key={i} boyut={[0.36, 0.04, 0.05]} konum={[Math.cos(i * 1.26) * 0.16, 0.04, Math.sin(i * 1.26) * 0.16]} donus={[0, -i * 1.26, 0]} renk="#555c68" />
		))}
	</group>
);

export const Ofis: React.FC<{ekranRengi?: string; children?: React.ReactNode}> = ({ekranRengi = '#5ab0f0', children}) => (
	<>
		<color attach="background" args={['#e6ebf0']} />
		<GunIsigi guc={0.95} />
		<pointLight position={[0, 3.4, 0.5]} intensity={5} distance={12} color="#ffffff" />

		{/* zemin ve duvar */}
		<Kutu boyut={[16, 0.1, 10]} konum={[0, -0.05, 1.5]} renk="#8e9aaa" />
		<Kutu boyut={[16, 4.2, 0.2]} konum={[0, 2.1, -3.1]} renk="#f4f6f8" />
		<Kutu boyut={[16, 0.12, 0.05]} konum={[0, 0.06, -2.98]} renk="#d5dbe2" />

		{/* büyük pencere ve dışarıdaki şehir */}
		<group position={[-3.2, 2.15, -2.98]}>
			<Kutu boyut={[4.2, 2.3, 0.06]} konum={[0, 0, 0]} renk="#dfe6ee" />
			<Kutu boyut={[4.0, 2.1, 0.05]} konum={[0, 0, 0.02]} renk="#a8d4f2" parlak="#8cc5ee" />
			{[0.15, 0.6, 1.05, 1.5, 1.95, 2.4, 2.85, 3.3, 3.7].map((x, i) => (
				<Kutu key={x} boyut={[0.38, 0.5 + ((i * 7) % 5) * 0.25, 0.02]} konum={[-2 + x, -1.05 + (0.5 + ((i * 7) % 5) * 0.25) / 2, 0.05]} renk={i % 2 ? '#6f8fae' : '#86a3bf'} />
			))}
			<Kutu boyut={[0.06, 2.1, 0.08]} konum={[0, 0, 0.05]} renk="#dfe6ee" />
			<Kutu boyut={[0.06, 2.1, 0.08]} konum={[-1.3, 0, 0.05]} renk="#dfe6ee" />
			<Kutu boyut={[0.06, 2.1, 0.08]} konum={[1.3, 0, 0.05]} renk="#dfe6ee" />
		</group>

		{/* duvar saati ve pano */}
		<group position={[1.4, 2.7, -2.97]}>
			<Silindir r={0.32} h={0.06} konum={[0, 0, 0]} donus={[Math.PI / 2, 0, 0]} renk="#ffffff" />
			<Kutu boyut={[0.03, 0.22, 0.02]} konum={[0, 0.09, 0.05]} renk="#222" />
			<Kutu boyut={[0.16, 0.03, 0.02]} konum={[0.07, 0, 0.05]} renk="#222" />
		</group>
		<Cerceve konum={[3.3, 2.1, -2.97]} boyut={[1.4, 0.9]} ic="#fdf6e3" />
		{['#ffd166', '#06d6a0', '#ef476f', '#118ab2'].map((r, i) => (
			<Kutu key={r} boyut={[0.25, 0.25, 0.02]} konum={[2.85 + (i % 2) * 0.45 + (i > 1 ? 0.45 : 0), 2.2 - (i % 2) * 0.25, -2.92]} renk={r} />
		))}

		{/* çalışma masası */}
		<Masa konum={OFIS.masa} boyut={[1.5, 0.78, 0.8]} renk="#e8e2d6" />
		<group position={[1.35, 0.81, -1.6]} rotation={[0, 0.85, 0]}>
			<Kutu boyut={[0.06, 0.32, 0.06]} konum={[0, 0.16, 0]} renk="#444" />
			<Kutu boyut={[0.3, 0.03, 0.22]} konum={[0, 0.015, 0]} renk="#444" />
			<Kutu boyut={[0.05, 0.5, 0.85]} konum={[0, 0.5, 0]} renk="#2b2d33" />
			<Kutu boyut={[0.02, 0.44, 0.78]} konum={[-0.03, 0.5, 0]} renk={ekranRengi} parlak={ekranRengi} />
		</group>
		<Kutu boyut={[0.2, 0.03, 0.55]} konum={[0.6, 0.82, -1.5]} renk="#3a3d45" />
		<Silindir r={0.06} h={0.14} konum={[0.55, 0.88, -1.1]} renk="#ffffff" />

		<OfisSandalyesi konum={OFIS.sandalye} />

		{/* diğer masalar ve eşyalar */}
		<Masa konum={[4.6, 0, -2.0]} boyut={[1.5, 0.78, 0.8]} renk="#e8e2d6" />
		<Kutu boyut={[0.7, 0.45, 0.05]} konum={[4.6, 1.1, -2.2]} renk="#2b2d33" />
		<Bitki konum={[-5.6, 0, -2.4]} olcek={1.4} />
		<Bitki konum={[2.6, 0, -2.5]} olcek={1.0} />
		<group position={[-6.6, 0, -2.6]}>
			<Kutu boyut={[0.5, 1.1, 0.5]} konum={[0, 0.55, 0]} renk="#dfe6ee" />
			<Silindir r={0.17} h={0.5} konum={[0, 1.35, 0]} renk="#9fd3f5" />
		</group>

		{children}
	</>
);
