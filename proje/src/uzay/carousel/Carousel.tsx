import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FontYukle} from '../Altyazi';

// INSTAGRAM KAYDIRMALI GÖNDERİ (1080x1350) — Uzay&Yaşam kapak stili
export type CarouselSlayt = {
	tur: 'kapak' | 'bilgi' | 'son';
	arka: string; // public/ içindeki görsel
	sigdir?: boolean; // true: gezegen fotoğrafı ortada tam görünür (siyah zemin)
	kaynak?: string; // görsel kaynağı (sağ altta)
	parlaklik?: number; // tam ekran arka plan parlaklığı
	odak?: string; // objectPosition, ör. '50% 30%'
	baslikUstte?: boolean; // kapak yazısı üstte (görselin öznesi ortada görünsün)
	no?: string;
	ust?: string;
	vurgu?: string;
	metin?: string;
	rakam?: string; // büyük vurgu rakamı (ör. 243 GÜN)
};

export type CarouselSet = {id: string; slaytlar: CarouselSlayt[]};

export const CAROUSELLER: Record<string, CarouselSet> = {
	'uzaydan-5-unlu-fotograf': {
		id: 'uzaydan-5-unlu-fotograf',
		slaytlar: [
			{tur: 'kapak', arka: 'carousel/unlu5/dogus.jpg', parlaklik: 1.0, odak: '50% 30%', baslikUstte: true, ust: 'UZAYDAN ÇEKİLMİŞ', vurgu: 'EN ÜNLÜ 5 FOTOĞRAF', metin: '3. fotoğraftaki nokta… sensin →', kaynak: 'NASA'},
			{tur: 'bilgi', arka: 'carousel/unlu5/dogus.jpg', parlaklik: 0.9, odak: '50% 60%', no: '01', ust: "DÜNYA'NIN", vurgu: 'DOĞUŞU', rakam: '24 ARALIK 1968', metin: "Apollo 8 astronotu Bill Anders, Ay'ın etrafında dönerken Dünya'nın ufuktan yükselişini çekti.", kaynak: 'NASA'},
			{tur: 'bilgi', arka: 'carousel/unlu5/bilye.jpg', parlaklik: 0.9, odak: '50% 45%', no: '02', ust: 'MAVİ', vurgu: 'BİLYE', rakam: '7 ARALIK 1972', metin: "Apollo 17 mürettebatı Ay'a giderken çekti. Tamamen aydınlık Dünya'nın en ünlü fotoğrafı.", kaynak: 'NASA'},
			{tur: 'bilgi', arka: 'carousel/unlu5/nokta.jpg', parlaklik: 1.0, odak: '60% 50%', no: '03', ust: 'SOLUK', vurgu: 'MAVİ NOKTA', rakam: '6 MİLYAR KM', metin: "Voyager 1, 1990'da arkasına dönüp çekti. Işık huzmesindeki o minik nokta Dünya: bir pikselden bile küçük. Sen de oradasın.", kaynak: 'NASA/JPL-Caltech'},
			{tur: 'bilgi', arka: 'carousel/unlu5/sutunlar.jpg', parlaklik: 0.85, odak: '50% 40%', no: '04', ust: 'YARATILIŞ', vurgu: 'SÜTUNLARI', rakam: '~6.500 IŞIK YILI', metin: "Kartal Bulutsusu'ndaki bu dev gaz sütunlarının içinde yeni yıldızlar doğuyor. Hubble çekti.", kaynak: 'NASA, ESA, Hubble'},
			{tur: 'bilgi', arka: 'carousel/unlu5/m87.jpg', parlaklik: 1.0, odak: '50% 45%', no: '05', ust: 'İLK KARA DELİK', vurgu: 'FOTOĞRAFI', rakam: '55 MİLYON IŞIK YILI', metin: '2019’da Olay Ufku Teleskobu, M87 galaksisinin merkezindeki dev kara deliğin gölgesini görüntüledi.', kaynak: 'EHT Collaboration'},
			{tur: 'son', arka: 'carousel/nasa/galaksi.jpg', ust: 'HANGİSİ SENİ', vurgu: 'EN ÇOK ETKİLEDİ?', metin: 'Numarasını yorumlara yaz 👇', kaynak: 'NASA'},
		],
	},
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
	'mars-5-gercek': {
		id: 'mars-5-gercek',
		slaytlar: [
			{tur: 'kapak', arka: 'carousel/mars/PIA00407.jpg', sigdir: true, kaynak: 'NASA/JPL', ust: "MARS'IN", vurgu: '5 ŞAŞIRTICI GERÇEĞİ', metin: '3. madde şu an yaşanıyor →'},
			{tur: 'bilgi', arka: 'carousel/mars/PIA00300.jpg', sigdir: true, kaynak: 'NASA/JPL', no: '01', ust: 'GÜNEŞ SİSTEMİNİN', vurgu: 'EN YÜKSEK DAĞI', rakam: '~22 KM', metin: "Olympus Mons, Everest'in yaklaşık 2,5 katı yüksekliğinde dev bir yanardağ."},
			{tur: 'bilgi', arka: 'carousel/mars/PIA00422.jpg', sigdir: true, kaynak: 'NASA/JPL/USGS', no: '02', ust: 'DEV BİR', vurgu: 'KANYON', rakam: '~4.000 KM', metin: 'Valles Marineris o kadar uzun ki Dünya’da olsaydı bütün ABD’yi boydan boya keserdi.'},
			{tur: 'bilgi', arka: 'carousel/mars/PIA10368.jpg', sigdir: true, kaynak: 'NASA/JPL/Univ. of Arizona', no: '03', ust: 'UYDUSU', vurgu: 'MARS’A DÜŞÜYOR', rakam: '~50 MİLYON YIL', metin: 'Phobos her yüzyılda yaklaşık 1,8 metre yaklaşıyor. Sonunda parçalanıp halka olabilir ya da yüzeye çarpabilir.'},
			{tur: 'bilgi', arka: 'carousel/mars/PIA00003.jpg', sigdir: true, kaynak: 'NASA/JPL', no: '04', ust: "MARS'TA BİR GÜN", vurgu: 'NEREDEYSE BİZİMKİ', rakam: '24 SA 39 DK', metin: "Mars'ın bir günü (sol) bizimkinden sadece yaklaşık 40 dakika uzun. Ama bir yılı 687 gün."},
			{tur: 'bilgi', arka: 'carousel/mars/PIA19808.jpg', sigdir: true, kaynak: 'NASA/JPL-Caltech/MSSS', no: '05', ust: "MARS'TA", vurgu: 'SADECE ROBOTLAR YAŞIYOR', rakam: '2012’DEN BERİ', metin: "Curiosity 14 yılı aşkın süredir Mars'ta. Bu fotoğrafı kendi kolundaki kamerayla çekti."},
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
				<Img src={staticFile(s.arka)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.odak ?? '50% 50%', filter: `brightness(${s.parlaklik ?? 0.6}) saturate(1.15)`}} />
			)}
			<div style={{position: 'absolute', bottom: 22, right: 30, fontFamily: 'UzayYazi, sans-serif', fontSize: 20, color: 'rgba(255,255,255,0.55)'}}>Görsel: {s.kaynak ?? 'NASA'}</div>
			<AbsoluteFill style={{background: s.sigdir ? 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.7) 85%)' : 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.7) 100%)'}} />
			{/* üst marka + sayfa */}
			<div style={{position: 'absolute', top: 54, left: 64, right: 64, display: 'flex', justifyContent: 'space-between', fontFamily: 'UzayYazi, sans-serif', fontSize: 30, letterSpacing: 8, color: 'rgba(255,255,255,0.85)'}}>
				<span>UZAY&amp;YAŞAM</span>
				<span>{slayt + 1}/{toplam}</span>
			</div>

			{s.tur === 'kapak' || s.tur === 'son' ? (
				<AbsoluteFill style={{justifyContent: s.baslikUstte ? 'flex-start' : 'center', alignItems: 'center', textAlign: 'center', padding: s.baslikUstte ? '150px 60px 0' : '0 60px'}}>
					<div style={{...gumus, fontSize: s.tur === 'kapak' ? 128 : 150}}>{s.ust}</div>
					<div style={{...camgobegi, fontSize: s.tur === 'kapak' ? 150 : 170}}>{s.vurgu}</div>
					{s.metin ? (
						<div
							style={{
								...(s.baslikUstte ? {position: 'absolute' as const, bottom: 120} : {marginTop: 50}),
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
