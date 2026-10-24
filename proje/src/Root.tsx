import {Kapak} from './uzay/Kapak';
import {AmbiyansDongu} from './slowaura/AmbiyansDongu';
import {SiginakSahne} from './slowaura/SiginakSahne';
import {FlikiDuzelt} from './fliki/FlikiDuzelt';
import React from 'react';
import {Composition} from 'remotion';
import {EvdenArabaya, EvdenArabayaProps} from './videolar/EvdenArabaya';
import {MekanVitrini} from './videolar/MekanVitrini';
import {UzayShort, UzayShortProps, uzayMetadata} from './uzay/UzayShort';
import {GorselShort, GorselShortProps, gorselMetadata} from './uzay/gorsel/GorselShort';
import {CarouselSlaytGoster} from './uzay/carousel/Carousel';
import {KesitShort} from './kesit/KesitShort';

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
		{/* Uzun videodan dikey Short kesiti */}
		<Composition
			id="KesitShort"
			component={KesitShort}
			durationInFrames={1386}
			fps={30}
			width={1080}
			height={1920}
			defaultProps={{video: 'kesit/ates-acilis.mp4', ust: 'ATEŞİ BULMASAYDIK', vurgu: 'BUGÜN BURADA OLMAZDIN', sonCagri: 'TAM BÖLÜM KANALDA 🔥', odakX: 0.5, baslangic: 0.9, tamKadrajSn: 42.4}}
		/>
		{/* Ayrı kapak görseli (video içine gömülmez) */}
			<Composition id="Kapak" component={Kapak} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{arka: 'bolumler/gunes-milyon/kapak-a.jpg', satirlar: [{t: 'KAPAK'}]}} />
			<Composition id="FlikiDuzelt" component={FlikiDuzelt} durationInFrames={1839} fps={30} width={1080} height={1920} />
			<Composition id="AmbiyansDongu" component={AmbiyansDongu} durationInFrames={480} fps={24} width={1920} height={1080} defaultProps={{arka: 'slowaura/kulube-yagmur.jpg', yagmur: true}} />
			<Composition id="SiginakSahne" component={SiginakSahne} durationInFrames={720} fps={24} width={1920} height={1080} defaultProps={{arka: 'slowaura/o2.jpg', ses: 'slowaura/karadeniz/ornek30.wav', pencere: {x: 0.495, y: 0.117, w: 0.25, h: 0.328}, ates: {x: 0.355, y: 0.64, r: 0.22}, lambalar: [{x: 0.927, y: 0.31, r: 0.08}, {x: 0.646, y: 0.81, r: 0.1}], buhar: {x: 0.278, y: 0.33}, simsekler: [1.9, 18.5], atesKutu: {x: 0.296, y: 0.568, w: 0.118, h: 0.148}, atesVideo: 'slowaura/alev_dongu.mp4'}} />
			<Composition id="SiginakGecis" component={SiginakSahne} durationInFrames={1344} fps={24} width={1920} height={1080} defaultProps={{arka: 'slowaura/o2.jpg', pencere: {x: 0.495, y: 0.117, w: 0.25, h: 0.328}, ates: {x: 0.355, y: 0.64, r: 0.22}}} />
		</>
);
