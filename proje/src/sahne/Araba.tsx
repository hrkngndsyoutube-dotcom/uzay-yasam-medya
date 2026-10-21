import React from 'react';
import {Kutu} from './parcalar';
import {V3} from './araclar';

// ARABA: sağa (+x) bakar. Kapı kameraya bakan tarafta.
// kapiAcikligi: 0 kapalı → 1 açık, teker: tekerleklerin dönüş açısı
export const KOLTUK_YERI: V3 = [0.3, 0.75, 0.35]; // arabaya göre sürücünün kalça noktası

export const Araba: React.FC<{
	konum: V3;
	kapiAcikligi?: number;
	teker?: number;
	renk?: string;
	farlar?: boolean;
	sarsinti?: number;
	children?: React.ReactNode; // arabanın içindekiler (karakter) arabayla birlikte hareket eder
}> = ({konum, kapiAcikligi = 0, teker = 0, renk = '#d64545', farlar = false, sarsinti = 0, children}) => {
	const cam = (
		<meshStandardMaterial color="#9fd0ea" transparent opacity={0.32} roughness={0.1} depthWrite={false} />
	);
	return (
		<group position={konum}>
			<group position={[0, sarsinti, 0]}>
				{/* gövde */}
				<Kutu boyut={[4.3, 0.72, 1.8]} konum={[0, 0.68, 0]} renk={renk} />
				<Kutu boyut={[4.36, 0.16, 1.84]} konum={[0, 0.36, 0]} renk="#2c2f36" />
				{/* tavan ve direkler */}
				<Kutu boyut={[2.35, 0.08, 1.72]} konum={[-0.25, 1.86, 0]} renk={renk} />
				{[-1.38, 0.88].map((x) =>
					[-0.82, 0.82].map((z) => (
						<Kutu key={`${x}${z}`} boyut={[0.1, 0.82, 0.08]} konum={[x, 1.45, z]} renk={renk} />
					)),
				)}
				{/* camlar (şeffaf, içindeki karakter görünür) */}
				<mesh position={[-0.25, 1.45, 0]}>
					<boxGeometry args={[2.3, 0.8, 1.66]} />
					{cam}
				</mesh>
				{/* farlar ve stoplar */}
				<Kutu boyut={[0.06, 0.18, 0.4]} konum={[2.15, 0.78, 0.58]} renk="#fff6d5" parlak={farlar ? '#fff2b0' : undefined} />
				<Kutu boyut={[0.06, 0.18, 0.4]} konum={[2.15, 0.78, -0.58]} renk="#fff6d5" parlak={farlar ? '#fff2b0' : undefined} />
				<Kutu boyut={[0.06, 0.16, 0.36]} konum={[-2.15, 0.8, 0.6]} renk="#ff5a5a" parlak="#aa1111" />
				<Kutu boyut={[0.06, 0.16, 0.36]} konum={[-2.15, 0.8, -0.6]} renk="#ff5a5a" parlak="#aa1111" />

				{/* kapı açılınca görünen iç karanlık */}
				<mesh position={[0.37, 0.72, 0.903]}>
					<planeGeometry args={[1.25, 0.62]} />
					<meshBasicMaterial color="#2a1f22" transparent opacity={Math.min(1, kapiAcikligi * 4)} />
				</mesh>

				{children}

				{/* kapı: menteşe ön kenarda (x = 1.0) */}
				<group position={[1.0, 0, 0.92]} rotation={[0, kapiAcikligi * 1.05, 0]}>
					<Kutu boyut={[1.26, 0.72, 0.05]} konum={[-0.63, 0.68, 0]} renk={renk} />
					<Kutu boyut={[0.22, 0.05, 0.04]} konum={[-1.0, 0.86, 0.04]} renk="#2c2f36" />
					<mesh position={[-0.63, 1.43, 0]}>
						<boxGeometry args={[1.16, 0.72, 0.03]} />
						{cam}
					</mesh>
				</group>
			</group>

			{/* tekerlekler */}
			{[-1.35, 1.35].map((x) =>
				[-0.85, 0.85].map((z) => (
					<group key={`${x}${z}`} position={[x, 0.4, z]} rotation={[0, 0, -teker]}>
						<mesh rotation={[Math.PI / 2, 0, 0]}>
							<cylinderGeometry args={[0.4, 0.4, 0.28, 28]} />
							<meshStandardMaterial color="#1f2126" roughness={0.9} />
						</mesh>
						<mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.13 : -0.13]}>
							<cylinderGeometry args={[0.22, 0.22, 0.04, 20]} />
							<meshStandardMaterial color="#c9ccd3" metalness={0.5} roughness={0.4} />
						</mesh>
						<Kutu boyut={[0.4, 0.06, 0.05]} konum={[0, 0, z > 0 ? 0.16 : -0.16]} renk="#7d828c" />
					</group>
				)),
			)}
			{/* gölge */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
				<planeGeometry args={[4.6, 2.1]} />
				<meshBasicMaterial color="#000" transparent opacity={0.18} depthWrite={false} />
			</mesh>
		</group>
	);
};
