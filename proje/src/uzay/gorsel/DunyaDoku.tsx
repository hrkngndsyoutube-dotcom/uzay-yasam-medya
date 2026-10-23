import React from 'react';
import {useLoader} from '@react-three/fiber';
import {staticFile} from 'remotion';
import * as THREE from 'three';

// Dünya dokusu: ThreeCanvas içindeki Suspense + delayRender ile yüklenir (render sırasında siyah kare olmaz)
export const DunyaMalzeme: React.FC<{roughness?: number}> = ({roughness = 0.85}) => {
	const t = useLoader(THREE.TextureLoader, staticFile('doku/dunya.jpg'));
	t.colorSpace = THREE.SRGBColorSpace;
	t.anisotropy = 8;
	return <meshStandardMaterial map={t} roughness={roughness} metalness={0} />;
};
