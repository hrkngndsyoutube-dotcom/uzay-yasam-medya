import React from 'react';
import {GunIsigi} from '../sahne/araclar';
import {AyakliLamba, Bitki, Cerceve, Kapi, Koltuk, Kutu, Masa} from '../sahne/parcalar';

// MEKÂN: EV İÇİ (oturma odası)
// Önemli noktalar (karakterleri yerleştirmek için):
export const EV_ICI = {
	yuruyusHatti: -1.5, // karakterin yürüdüğü derinlik (z)
	koltuk: [-3, 0, -1.5] as [number, number, number],
	koltukKalca: 0.6 / 0.8, // oturunca kalça yüksekliği (karakter birimi)
	sehpa: [0.35, 0, -2.05] as [number, number, number],
	sehpaUstu: 0.86,
	kapi: [2.95, 0, -2.95] as [number, number, number],
};

export const EvIci: React.FC<{kapiAcikligi?: number; children?: React.ReactNode}> = ({kapiAcikligi = 0, children}) => {
	const duvar = '#f2e6d6';
	return (
		<>
			<color attach="background" args={['#efe3d2']} />
			<GunIsigi guc={0.9} />
			<pointLight position={[-1, 3.2, 1]} intensity={6} distance={12} color="#fff1dd" />

			{/* zemin: ahşap parke */}
			<Kutu boyut={[16, 0.1, 10]} konum={[0, -0.05, 1.5]} renk="#c79a6b" />
			{Array.from({length: 16}).map((_, i) => (
				<Kutu key={i} boyut={[0.02, 0.005, 10]} konum={[-7.5 + i, 0.002, 1.5]} renk="#b3875a" />
			))}
			<Kutu boyut={[3.4, 0.01, 1.8]} konum={[-1.2, 0.006, -1.3]} renk="#5f7fa6" />
			<Kutu boyut={[3.0, 0.012, 1.4]} konum={[-1.2, 0.008, -1.3]} renk="#7b9cc4" />

			{/* arka duvar (kapı boşluğu bırakılmış) */}
			<Kutu boyut={[9.95, 4, 0.2]} konum={[-2.025, 2, -3.1]} renk={duvar} />
			<Kutu boyut={[3.95, 4, 0.2]} konum={[6.025, 2, -3.1]} renk={duvar} />
			<Kutu boyut={[1.1, 1.8, 0.2]} konum={[3.5, 3.1, -3.1]} renk={duvar} />
			<Kutu boyut={[16, 0.14, 0.05]} konum={[0, 0.07, -2.98]} renk="#e3d2bc" />
			<Kutu boyut={[1.3, 0.12, 0.25]} konum={[3.5, 2.26, -3.0]} renk="#e3d2bc" />
			{/* kapının arkasındaki koridor */}
			<Kutu boyut={[2, 3, 0.1]} konum={[3.5, 1.5, -4.2]} renk="#3a322c" />

			<Kapi konum={EV_ICI.kapi} aciklik={kapiAcikligi} />

			{/* pencere */}
			<group position={[-1.2, 2.0, -2.98]}>
				<Kutu boyut={[1.9, 1.5, 0.06]} konum={[0, 0, 0]} renk="#ffffff" />
				<Kutu boyut={[1.7, 1.3, 0.05]} konum={[0, 0, 0.02]} renk="#bfe3f5" parlak="#9fd2ee" />
				<Kutu boyut={[0.06, 1.3, 0.07]} konum={[0, 0, 0.04]} renk="#ffffff" />
				<Kutu boyut={[1.7, 0.06, 0.07]} konum={[0, 0, 0.04]} renk="#ffffff" />
				<Kutu boyut={[2.1, 0.08, 0.18]} konum={[0, -0.78, 0.06]} renk="#ffffff" />
			</group>

			{/* duvar tabloları */}
			<Cerceve konum={[1.4, 2.1, -2.97]} boyut={[0.8, 0.6]} ic="#e9a03b" />
			<Cerceve konum={[-4.4, 2.3, -2.97]} boyut={[0.6, 0.8]} ic="#6aa36f" />

			{/* mobilyalar */}
			<Koltuk konum={EV_ICI.koltuk} />
			<AyakliLamba konum={[-4.0, 0, -2.4]} />
			<Masa konum={EV_ICI.sehpa} boyut={[1.1, 0.8, 0.5]} />
			<Kutu boyut={[0.3, 0.2, 0.2]} konum={[0.7, 0.93, -2.1]} renk="#5b6c8f" />
			<Bitki konum={[5.2, 0, -2.5]} olcek={1.3} />
			{/* kitaplık */}
			<group position={[-6, 0, -2.6]}>
				<Kutu boyut={[1.4, 2.4, 0.5]} konum={[0, 1.2, 0]} renk="#8c6a4f" />
				{[0.5, 1.2, 1.9].map((y, i) => (
					<group key={y}>
						<Kutu boyut={[1.25, 0.04, 0.44]} konum={[0, y - 0.25, 0.04]} renk="#6b4f39" />
						{[0, 1, 2, 3, 4].map((j) => (
							<Kutu
								key={j}
								boyut={[0.14, 0.4 - (j % 2) * 0.06, 0.3]}
								konum={[-0.45 + j * 0.2, y - 0.03 - (j % 2) * 0.03, 0.08]}
								renk={['#d64545', '#2a9d8f', '#e9c46a', '#457b9d', '#f4a261'][(j + i) % 5]}
							/>
						))}
					</group>
				))}
			</group>

			{children}
		</>
	);
};
