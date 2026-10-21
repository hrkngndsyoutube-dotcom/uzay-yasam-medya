import React from 'react';
import {Composition} from 'remotion';
import {EvdenArabaya, EvdenArabayaProps} from './videolar/EvdenArabaya';
import {MekanVitrini} from './videolar/MekanVitrini';
import {UzayShort, UzayShortProps, uzayMetadata} from './uzay/UzayShort';
import {GorselShort, GorselShortProps, gorselMetadata} from './uzay/gorsel/GorselShort';
import {CarouselSlaytGoster} from './uzay/carousel/Carousel';

// Buradaki her "Composition" bir videodur. Yeni video = yeni satır.
export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="EvdenArabaya"
			component={EvdenArabaya}
			durationInFrames={600}
			fps={30}
			width={1920}
			height={1080}
			defaultProps={{seslendirme: null} satisfies EvdenArabayaProps}
		/>
		<Composition id="MekanVitrini" component={MekanVitrini} durationInFrames={360} fps={30} width={1920} height={1080} />
		{/* Uzay&Yaşam Shorts: bolum = bolumler klasöründeki bölüm adı */}
		<Composition
			id="UzayShort"
			component={UzayShort}
			durationInFrames={1500}
			fps={30}
			width={1080}
			height={1920}
			defaultProps={{bolum: 'iki-gunes'} satisfies UzayShortProps}
			calculateMetadata={uzayMetadata}
		/>
		{/* Uzay&Yaşam görsel tabanlı Shorts (fotogerçekçi görseller + hareket) */}
		<Composition
			id="GorselShort"
			component={GorselShort}
			durationInFrames={1650}
			fps={30}
			width={1080}
			height={1920}
			defaultProps={{bolum: 'yakin-ay'} satisfies GorselShortProps}
			calculateMetadata={gorselMetadata}
		/>
		{/* Instagram kaydırmalı gönderi slaytı (her slayt ayrı görsel olarak alınır) */}
		<Composition
			id="Carousel"
			component={CarouselSlaytGoster}
			durationInFrames={1}
			fps={30}
			width={1080}
			height={1350}
			defaultProps={{set: 'gunes-sistemi-5-gercek', slayt: 0}}
		/>
	</>
);
