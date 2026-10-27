import React from 'react';
import {
	AbsoluteFill,
	Audio,
	CalculateMetadataFunction,
	Easing,
	Img,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Altyazi, FontYukle} from '../Altyazi';
import {BOLUMLER} from '../bolumler';
import {tohumlu} from '../gok';
import {Cekim, GorselPlan, Kart, PLANLAR} from './plan';
import {Apophis3D} from './Apophis3D';
import {Rota3D} from './Rota3D';
import {SokDalgasi} from './SokDalgasi';

// GÖRSEL TABANLI UZAY SHORT'U (1080x1920)
// Fotogerçekçi görseller + sinematik hareket + poster başlık + kartlar + altyazı + müzik

export type GorselShortProps = {bolum: string; plan?: string; sonKapak?: string}; // sonKapak: YouTube için videonun sonuna eklenen kapak karesi // plan: A/B varyant anahtarı
const FPS = 30;
const GECIS = 9; // görseller arası geçiş (kare)
const SON_KAPAK = 15; // YouTube kare seçicisi için sondaki kapak (0,5 sn)

export const gorselMetadata: CalculateMetadataFunction<GorselShortProps> = ({props}) => ({
	durationInFrames: Math.ceil(BOLUMLER[props.bolum].toplam * FPS) + (props.sonKapak ? SON_KAPAK : 0),
	fps: FPS,
	width: 1080,
	height: 1920,
});

// ---------- Parçacıklar (toz / kor) ----------
const Parcaciklar: React.FC<{tur: 'toz' | 'kor'}> = ({tur}) => {
	const f = useCurrentFrame();
	const ps = React.useMemo(() => {
		const r = tohumlu(tur === 'toz' ? 11 : 23);
		return Array.from({length: tur === 'toz' ? 55 : 70}).map(() => ({
			x: r() * 1080,
			y: r() * 1920,
			s: tur === 'toz' ? 1.5 + r() * 3 : 2 + r() * 4,
			h: tur === 'toz' ? 0.15 + r() * 0.5 : 1.2 + r() * 2.5,
			faz: r() * 6.28,
			sal: 10 + r() * 30,
		}));
	}, [tur]);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{ps.map((p, i) => {
				const y = (((p.y - f * p.h) % 1920) + 1920) % 1920;
				const x = p.x + Math.sin(f / 40 + p.faz) * p.sal;
				const op = tur === 'toz' ? 0.35 + 0.35 * Math.sin(f / 12 + p.faz) : 0.5 + 0.5 * Math.sin(f / 6 + p.faz);
				const renk = tur === 'toz' ? '#fff6e0' : '#ff8a2b';
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: p.s,
							height: p.s,
							borderRadius: '50%',
							background: renk,
							opacity: Math.max(0, op),
							boxShadow: `0 0 ${p.s * 3}px ${renk}`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

// ---------- Tek çekim: görsel + hareket + efekt ----------
const CekimGoster: React.FC<{c: Cekim; sure: number; ilk: boolean}> = ({c, sure, ilk}) => {
	const f = useCurrentFrame();
	const p = interpolate(f, [0, sure], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin)});
	const giris = ilk ? 1 : interpolate(f, [0, GECIS], [0, 1], {extrapolateRight: 'clamp'});
	let olcek = 1.14;
	let tx = 0;
	let ty = 0;
	switch (c.hareket) {
		case 'yaklas':
			olcek = interpolate(p, [0, 1], [1.06, 1.26]);
			break;
		case 'uzaklas':
			olcek = interpolate(p, [0, 1], [1.26, 1.06]);
			break;
		case 'yukari':
			ty = interpolate(p, [0, 1], [-6.5, 6.5]);
			olcek = 1.16;
			break;
		case 'asagi':
			ty = interpolate(p, [0, 1], [6.5, -6.5]);
			olcek = 1.16;
			break;
		case 'sola':
			tx = interpolate(p, [0, 1], [5.5, -5.5]);
			olcek = 1.15;
			break;
		case 'saga':
			tx = interpolate(p, [0, 1], [-5.5, 5.5]);
			olcek = 1.15;
			break;
	}
	// geçişte hafif "itme" hissi
	olcek *= ilk ? 1 : interpolate(f, [0, GECIS + 4], [1.05, 1], {extrapolateRight: 'clamp'});
	let sx = 0;
	let sy = 0;
	if (c.efekt?.includes('sarsinti')) {
		const g = interpolate(f, [0, sure * 0.6, sure], [9, 5, 3]);
		sx = Math.sin(f * 1.9) * g + Math.sin(f * 4.3) * g * 0.4;
		sy = Math.cos(f * 2.3) * g * 0.8;
	}
	let parlaklik = 1;
	if (c.efekt?.includes('aydinlan')) parlaklik = interpolate(p, [0, 0.55, 0.8, 1], [0.8, 0.85, 1.28, 1.22]);
	if (c.efekt?.includes('karar')) parlaklik = 0.42;
	const [ox, oy] = c.odak ?? [0.5, 0.5];
	return (
		<AbsoluteFill style={{opacity: giris, overflow: 'hidden'}}>
			<Img
				src={staticFile(c.gorsel)}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transformOrigin: `${ox * 100}% ${oy * 100}%`,
					transform: `translate(${tx}%, ${ty}%) translate(${sx}px, ${sy}px) scale(${olcek})`,
					filter: `brightness(${parlaklik}) contrast(1.06) saturate(1.08)`,
				}}
			/>
			{c.efekt?.includes('toz') ? <Parcaciklar tur="toz" /> : null}
			{c.efekt?.includes('kor') ? <Parcaciklar tur="kor" /> : null}
		</AbsoluteFill>
	);
};

// ---------- Açılış posteri (kapak tarzı) ----------
// Renkler: beyaz-gümüş ana satır + parlak camgöbeği vurgu (kanalın kapak stili)
export const KAPAK_RENK = {gumus: 'linear-gradient(180deg, #ffffff 0%, #e9eef4 45%, #aeb9c6 100%)', vurgu: '#38d9ff'};

const Acilis: React.FC<{a: GorselPlan['acilis']; sure: number}> = ({a, sure}) => {
	const f = useCurrentFrame();
	// İlk kareden itibaren tam görünür (otomatik kapak başlıklı olsun), hafifçe oturur
	const otur = interpolate(f, [0, 18], [1.05, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const parilti = 0.75 + 0.25 * Math.sin(f / 5);
	const cikis = interpolate(f, [sure - 12, sure], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const gumus: React.CSSProperties = {
		fontFamily: 'UzayKapak, Impact, sans-serif',
		fontSize: 150,
		lineHeight: 1.0,
		paddingTop: 22,
		marginTop: -22,
		background: KAPAK_RENK.gumus,
		WebkitBackgroundClip: 'text',
		color: 'transparent',
		filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.85)) drop-shadow(0 14px 28px rgba(0,0,0,0.8))',
		textTransform: 'uppercase',
	};
	return (
		<AbsoluteFill style={{opacity: cikis}}>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 36%, rgba(0,0,0,0) 52%)'}} />
			<div style={{position: 'absolute', top: 95, left: 40, right: 40, textAlign: 'center', transform: `scale(${otur})`}}>
				<div style={{fontFamily: 'UzayYazi, sans-serif', color: '#fff', letterSpacing: 10, fontSize: 32, opacity: 0.85, marginBottom: 18}}>UZAY&amp;YAŞAM</div>
				<div style={{...gumus, fontSize: a.ustBoyut ?? 150}}>{a.ust}</div>
				<div
					style={{
						fontFamily: 'UzayKapak, Impact, sans-serif',
						fontSize: a.vurguBoyut ?? 132,
						lineHeight: 1.02,
						paddingTop: 16,
						marginTop: -16,
						color: KAPAK_RENK.vurgu,
						textTransform: 'uppercase',
						textShadow: `0 0 ${24 * parilti}px rgba(56,217,255,0.75), 0 6px 0 rgba(0,0,0,0.85), 0 14px 30px rgba(0,0,0,0.8)`,
					}}
				>
					{a.vurgu}
				</div>
				{a.alt ? <div style={{...gumus, fontSize: 132}}>{a.alt}</div> : null}
			</div>
		</AbsoluteFill>
	);
};

// ---------- Zamanlı bilgi kartı ----------
const ZamanliKart: React.FC<{k: Kart}> = ({k}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const sure = Math.round((k.son - k.bas) * fps);
	const s = spring({frame: f, fps, config: {damping: 12}});
	const cikis = interpolate(f, [sure - 8, sure], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const renk = k.renk ?? '#ffd23f';
	return (
		<div style={{position: 'absolute', top: k.ust ?? '12%', left: 0, right: 0, textAlign: 'center', opacity: s * cikis, transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`}}>
			<div
				style={{
					display: 'inline-block',
					padding: '22px 44px',
					borderRadius: 24,
					background: 'rgba(5,8,20,0.72)',
					border: `4px solid ${renk}`,
					boxShadow: `0 0 50px ${renk}55`,
					backdropFilter: 'blur(6px)',
				}}
			>
				<div style={{fontFamily: 'UzayBaslik, sans-serif', fontSize: 92, color: renk, lineHeight: 1}}>{k.baslik}</div>
				{k.alt ? <div style={{fontFamily: 'UzayYazi, sans-serif', fontSize: 38, color: '#fff', marginTop: 10}}>{k.alt}</div> : null}
			</div>
		</div>
	);
};

// ---------- Kapanış ----------
const Kapanis: React.FC<{abone: number}> = ({abone}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: f, fps, config: {damping: 13}});
	const b = spring({frame: f - abone, fps, config: {damping: 8, stiffness: 200}});
	const nabiz = 1 + 0.05 * Math.sin(f / 4);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', top: '24%', width: '100%', textAlign: 'center', opacity: s}}>
				<div style={{fontFamily: 'UzayBaslik, sans-serif', fontSize: 120, color: '#fff', textShadow: '0 0 40px rgba(120,190,255,0.7)', letterSpacing: 2}}>
					UZAY&amp;YAŞAM
				</div>
				<div style={{fontFamily: 'UzayYazi, sans-serif', fontSize: 40, color: '#cfe6ff', letterSpacing: 6, marginTop: 6}}>EVRENİN SORULARI</div>
			</div>
			{f >= abone ? (
				<div style={{position: 'absolute', top: '40%', width: '100%', textAlign: 'center', transform: `scale(${b * nabiz})`}}>
					<span
						style={{
							background: '#e3262f',
							color: '#fff',
							fontFamily: 'UzayBaslik, sans-serif',
							fontSize: 80,
							padding: '24px 70px',
							borderRadius: 70,
							boxShadow: '0 12px 50px rgba(227,38,47,0.6)',
						}}
					>
						ABONE OL
					</span>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

// ---------- Ana video ----------
export const GorselShort: React.FC<GorselShortProps> = ({bolum, plan: planAdi, sonKapak}) => {
	const b = BOLUMLER[bolum];
	const plan = PLANLAR[planAdi ?? bolum];
	const toplam = Math.ceil(b.toplam * FPS);
	const kapanisKare = Math.round(plan.kapanisBas * FPS);
	const aboneKelime = b.kelimeler.find((w) => w.k.toLocaleLowerCase('tr-TR').startsWith('abone'));
	const klasor = `bolumler/${bolum}/`;
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<FontYukle />
			{plan.cekimler.map((c, i) => {
				const bas = Math.max(0, Math.round(c.bas * FPS) - (i === 0 ? 0 : GECIS));
				const son = i < plan.cekimler.length - 1 ? Math.round(plan.cekimler[i + 1].bas * FPS) : toplam;
				return (
					<Sequence key={i} from={bas} durationInFrames={son - bas}>
						{c.gorsel === '3d:apophis' ? (
							<Gecis3D sure={son - bas}>
								<Apophis3D sure={son - bas} />
							</Gecis3D>
						) : c.gorsel === '3d:sok-ist' ? (
							<Gecis3D sure={son - bas}>
								<SokDalgasi sure={son - bas} yaricapKm={26} />
							</Gecis3D>
						) : c.gorsel === '3d:tunguska' ? (
							<Gecis3D sure={son - bas}>
								<Rota3D
									sure={son - bas}
									bas={[60.886, 101.894]}
									hedefYon={[41.037, 28.985]}
									oran={1}
									basEtiket={['TUNGUSKA', 'Sibirya, 1908']}
									sonEtiket={['İSTANBUL', 'Taksim']}
									ortaEtiket="5.200 KM"
									zSon={4.6}
								/>
							</Gecis3D>
						) : c.gorsel === '3d:kuwae' ? (
							<Gecis3D sure={son - bas}>
								<Rota3D
									sure={son - bas}
									bas={[-16.83, 168.54]}
									hedefYon={[41.008, 28.98]}
									oran={1}
									basEtiket={['KUWAE', 'Pasifik, Vanuatu']}
									sonEtiket={['İSTANBUL', 'Mayıs 1453']}
									ortaEtiket="15.000 KM"
									zSon={6.2}
								/>
							</Gecis3D>
						) : c.gorsel === '3d:norvec' ? (
							<Gecis3D sure={son - bas}>
								<Rota3D
									sure={son - bas}
									bas={[69.294, 16.02]}
									hedefYon={[78.22, 15.65]}
									oran={1}
									basEtiket={['NORVEÇ', 'fırlatma']}
									sonEtiket={['SVALBARD', 'düştüğü yer']}
									ortaEtiket=""
									zSon={2.5}
								/>
							</Gecis3D>
						) : c.gorsel === '3d:proxima' ? (
							<Gecis3D sure={son - bas}>
								<Rota3D
									sure={son - bas}
									bas={[41.037, 28.985]}
									hedefYon={[47.92, 106.92]}
									oran={6346 / 5964}
									basEtiket={['GÜNEŞ = TOP', 'Taksim']}
									sonEtiket={['EN YAKIN YILDIZ', 'Proxima Centauri']}
									ortaEtiket="6.300 KM"
								/>
							</Gecis3D>
						) : (
							<CekimGoster c={{...c, gorsel: klasor + c.gorsel}} sure={son - bas} ilk={i === 0} />
						)}
					</Sequence>
				);
			})}
			{/* sinematik katmanlar: kenar karartma + alt gölge (altyazı okunurluğu) */}
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 85%)'}} />

			{plan.kartlar.map((k, i) => (
				<Sequence key={i} from={Math.round(k.bas * FPS)} durationInFrames={Math.round((k.son - k.bas) * FPS)}>
					<ZamanliKart k={k} />
				</Sequence>
			))}
			{(plan.acilisSure ?? 3.8) > 0 ? (
				<Sequence durationInFrames={Math.round((plan.acilisSure ?? 3.8) * FPS)}>
					<Acilis a={plan.acilis} sure={Math.round((plan.acilisSure ?? 3.8) * FPS)} />
				</Sequence>
			) : null}
			{plan.darbeSesi ? (
				<Sequence from={1}>
					<Audio src={staticFile(plan.darbeSesi)} volume={0.55} />
				</Sequence>
			) : null}
			<Sequence from={kapanisKare}>
				<Kapanis abone={aboneKelime ? Math.round(aboneKelime.bas * FPS) - kapanisKare : 90} />
			</Sequence>
			<Altyazi kelimeler={b.kelimeler.filter((w) => w.bas >= (plan.altyaziBaslangic ?? 0))} ust="66%" />
			{b.ses ? <Audio src={staticFile(b.ses)} /> : null}
			{plan.muzik ? (
				<Audio
					src={staticFile(plan.muzik)}
					volume={(f) => interpolate(f, [0, 30, toplam - 45, toplam], [0, 0.16, 0.16, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
				/>
			) : null}
			{sonKapak ? (
				<Sequence from={toplam}>
					<Img src={staticFile(sonKapak)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
				</Sequence>
			) : null}
		</AbsoluteFill>
	);
};

const Gecis3D: React.FC<{sure: number; children: React.ReactNode}> = ({children}) => {
	const f = useCurrentFrame();
	return <AbsoluteFill style={{opacity: interpolate(f, [0, GECIS], [0, 1], {extrapolateRight: 'clamp'})}}>{children}</AbsoluteFill>;
};
