import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FontYukle} from '../Altyazi';

// INSTAGRAM KAYDIRMALI GÖNDERİ (1080x1350) — Uzay&Yaşam kapak stili
export type CarouselSlayt = {
	tur: 'kapak' | 'bilgi' | 'son';
	arka: string; // public/ içindeki görsel
	sigdir?: boolean; // true: gezegen fotoğrafı ortada tam görünür (siyah zemin)
	kaynak?: string;
	no?: string;
	ust?: string;
	vurgu?: string;
	metin?: string;
	rakam?: string; // büyük vurgu rakamı (ör. 243 GÜN)
};

export type CarouselSet = {id: string; slaytlar: CarouselSlayt[]};

export const CAROUSELLER: Record<string, CarouselSet> = {
	'gunes-sistemi-5-gercek': {
		id: 'gunes-sistemi-5-gercek',
		slaytlar: [
			{tur: 'kapak', arka: 'carousel/nasa/kapak.jpg', ust: "GÜNEŞ SİSTEMİ'NİN", vurgu: '5 TUHAF GERÇEĞİ', metin: '4. madde aklını karıştıracak →'},
			{tur: 'bilgi', arka: 'carousel/nasa/venus.jpg', sigdir: true, no: '01', ust: "VENÜS'TE BİR GÜN", vurgu: 'BİR YILDAN UZUN', rakam: '243 > 225', metin: "Venüs kendi etrafında 243 Dünya gününde döner, Güneş'in etrafını ise 225 günde dolaşır."},
			{tur: 'bilgi', arka: 'carousel/nasa/saturn.jpg', sigdir: true, no: '02', ust: 'SATÜRN', vurgu: 'SUDA YÜZERDİ', rakam: '0,69 g/cm³', metin: 'Ortalama yoğunluğu sudan düşük. Onu alacak kadar büyük bir okyanus olsaydı batmazdı.'},
			{tur: 'bilgi', arka: 'carousel/nasa/jupiter.jpg', sigdir: true, no: '03', ust: "JÜPİTER'DEKİ FIRTINA", vurgu: "DÜNYA'DAN BÜYÜK", rakam: '190+ YIL', metin: 'Büyük Kırmızı Leke en az 1830’dan beri gözleniyor. Küçülmesine rağmen hâlâ Dünya’dan daha geniş.'},
			{tur: 'bilgi', arka: 'carousel/nasa/uranus.jpg', sigdir: true, no: '04', ust: 'URANÜS', vurgu: 'YAN YATMIŞ DÖNÜYOR', rakam: '42 YIL GÜNDÜZ', metin: 'Ekseni yaklaşık 98° eğik. Bu yüzden kutupları 42 yıl gündüz, 42 yıl gece yaşar.'},
			{tur: 'bilgi', arka: 'carousel/nasa/gunes.jpg', sigdir: true, no: '05', ust: "GÜNEŞ'İ HEP", vurgu: 'GEÇMİŞTE GÖRÜRSÜN', rakam: '8 DK 20 SN', metin: "Güneş ışığı Dünya'ya yaklaşık 8 dakika 20 saniyede ulaşır. Gördüğün Güneş, 8 dakika öncesinin Güneş'i."},
			{tur: 'son', arka: 'carousel/nasa/galaksi.jpg', ust: 'HANGİSİ SENİ', vurgu: 'ŞAŞIRTTI?', metin: 'Yorumlara numarasını yaz 👇'},
		],
	},
};

const gumus: React.CSSProperties = {
	fontFamily: 'UzayKapak, Impact, sans-serif',
	background: 'linear-gradient(180deg, #ffffff 0%, #e9eef4 45%, #aeb9c6 100%)',
	WebkitBackgroundClip: 'text',
	color: 'transparent',
	filter: 'drop-shadow(0 5px 0 rgba(0,0,0,0.85)) drop-shadow(0 12px 26px rgba(0,0,0,0.8))',
	lineHeight: 1.0,
	paddingTop: 18,
	marginTop: -18,
};
const camgobegi: React.CSSProperties = {
	fontFamily: 'UzayKapak, Impact, sans-serif',
	color: '#38d9ff',
	textShadow: '0 0 26px rgba(56,217,255,0.7), 0 5px 0 rgba(0,0,0,0.85), 0 12px 28px rgba(0,0,0,0.8)',
	lineHeight: 1.02,
	paddingTop: 14,
	marginTop: -14,
};

export const CarouselSlaytGoster: React.FC<{set: string; slayt: number}> = ({set, slayt}) => {
	const s = CAROUSELLER[set].slaytlar[slayt];
	const toplam = CAROUSELLER[set].slaytlar.length;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<FontYukle />
			{s.sigdir ? (
				<Img
					src={staticFile(s.arka)}
					style={{
						position: 'absolute',
						left: -110,
						top: 120,
						width: 1300,
						height: 1100,
						objectFit: 'contain',
						filter: 'brightness(0.9) saturate(1.1)',
						WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)',
						maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)',
					}}
				/>
			) : (
				<Img src={staticFile(s.arka)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) saturate(1.15)'}} />
			)}
			<div style={{position: 'absolute', bottom: 22, right: 30, fontFamily: 'UzayYazi, sans-serif', fontSize: 20, color: 'rgba(255,255,255,0.55)'}}>Görsel: NASA</div>
			<AbsoluteFill style={{background: s.sigdir ? 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.7) 85%)' : 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.7) 100%)'}} />
			{/* üst marka + sayfa */}
			<div style={{position: 'absolute', top: 54, left: 64, right: 64, display: 'flex', justifyContent: 'space-between', fontFamily: 'UzayYazi, sans-serif', fontSize: 30, letterSpacing: 8, color: 'rgba(255,255,255,0.85)'}}>
				<span>UZAY&amp;YAŞAM</span>
				<span>{slayt + 1}/{toplam}</span>
			</div>

			{s.tur === 'kapak' || s.tur === 'son' ? (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 60px'}}>
					<div style={{...gumus, fontSize: s.tur === 'kapak' ? 128 : 150}}>{s.ust}</div>
					<div style={{...camgobegi, fontSize: s.tur === 'kapak' ? 150 : 170}}>{s.vurgu}</div>
					{s.metin ? (
						<div
							style={{
								marginTop: 50,
								fontFamily: 'UzayYazi, sans-serif',
								fontSize: 44,
								color: '#fff',
								background: 'rgba(5,8,20,0.6)',
								border: '3px solid rgba(56,217,255,0.8)',
								borderRadius: 60,
								padding: '18px 42px',
							}}
						>
							{s.metin}
						</div>
					) : null}
				</AbsoluteFill>
			) : (
				<AbsoluteFill style={{padding: '170px 70px 90px', display: 'flex', flexDirection: 'column'}}>
					<div style={{fontFamily: 'UzayKapak, Impact, sans-serif', fontSize: 120, color: 'rgba(56,217,255,0.9)', lineHeight: 1, textShadow: '0 0 30px rgba(56,217,255,0.5)'}}>
						{s.no}
					</div>
					<div style={{...gumus, fontSize: 110, marginTop: 10}}>{s.ust}</div>
					<div style={{...camgobegi, fontSize: 118}}>{s.vurgu}</div>
					<div style={{flex: 1}} />
					{s.rakam ? (
						<div style={{alignSelf: 'flex-start', fontFamily: 'UzayKapak, Impact, sans-serif', fontSize: 84, color: '#fff', background: 'rgba(56,217,255,0.18)', border: '4px solid #38d9ff', borderRadius: 22, padding: '10px 34px', marginBottom: 34}}>
							{s.rakam}
						</div>
					) : null}
					<div style={{fontFamily: 'UzayYazi, sans-serif', fontSize: 46, lineHeight: 1.35, color: '#fff', background: 'rgba(5,8,20,0.66)', borderRadius: 26, padding: '30px 36px', borderLeft: '8px solid #38d9ff'}}>
						{s.metin}
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};
