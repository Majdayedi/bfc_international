import React, { useEffect, useRef, useState, useCallback } from 'react';
import './HistoryPage.css';
import bfcLogo    from '../src/assets/bfc.png';
import africaImg  from '../src/assets/africa.png';
import guineeLogo from '../src/assets/bfc_guinée.png';
import senegalLogo from '../src/assets/bfc_senegal.png';
import congoLogo  from '../src/assets/bfc_congo.png';
import mauritaniaLogo from '../src/assets/bfc_mauritania.png';

/* ─── Data ──────────────────────────────────────────────────── */
interface Milestone {
  year: string;
  title: string;
  location: string;
  img: string;
  desc: string;
  logo: string;
}

/* Background colour for each milestone — interpolated as you scroll */
const MS_COLORS = [
  [248, 249, 255],  // 2010 MGI BFC        — barely-blue white
  [237, 244, 255],  // 2020 International  — soft periwinkle
  [236, 247, 240],  // 2022 Guinée         — mint veil
  [253, 246, 235],  // 2022 Sénégal        — warm sand
  [235, 240, 252],  // 2023 Congo          — slate blue
  [228, 236, 252],  // 2025 En cours…     — deep horizon
] as const;

const MS: Milestone[] = [
  {
    year: '2010',
    title: 'MGI BFC',
    location: 'Tunis, Tunisie',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
    desc: "MGI BFC est la structure mère. C'est un cabinet d'expertise comptable et d'audit, fondé en 2010 et basé à Tunis. MGI BFC est membre du réseau international MGI WORLDWIDE — l'un des 20 premiers réseaux internationaux de conseil et d'audit dans le monde.",
    logo: bfcLogo,
  },
  {
    year: '2020',
    title: 'BFC International & Academy',
    location: 'Afrique / France / Canada',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
    desc: "BFC International & Academy, fondé en 2020, est un cabinet de consulting et de formation. Partenaire de l'IRM et de l'ICI en Afrique, il offre également des services d'Outsourcing en France et au Canada.",
    logo: africaImg,
  },
  {
    year: '2022',
    title: 'BFC Guinée',
    location: 'Conakry, Guinée',
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
    desc: "Notre structure commence ses extensions avec la création de BFC Guinée en 2022. Cette entité est créée pour servir la sous-région et assurer la proximité de nos experts pour répondre aux besoins de nos clients.",
    logo: guineeLogo,
  },
  {
    year: '2022',
    title: 'BFC Sénégal',
    location: 'Dakar, Sénégal',
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop',
    desc: "BFC Sénégal vient renforcer davantage notre présence en Afrique de l'Ouest. Ce cabinet offre une gamme de services variée liée à l'IT, au management, à la formation et à l'organisation.",
    logo: senegalLogo,
  },
  {
    year: '2023',
    title: 'BFC Bassin du Congo',
    location: 'Afrique Centrale',
    img: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=1200&auto=format&fit=crop',
    desc: "BFC étend son empreinte au Bassin du Congo. Le cabinet intègre l'Afrique centrale en offrant des services de consulting et de formation de haut niveau.",
    logo: congoLogo,
  },
  {
    year: '2025',
    title: 'En cours…',
    location: 'Afrique',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    desc: "BFC poursuit son expansion stratégique sur le continent africain, développant de nouveaux partenariats locaux et internationaux au service du développement durable.",
    logo: mauritaniaLogo,
  },
];

/*
  Phases:
  0 – white overlay, blank
  1 – timeline building (dot by dot)
  2 – bar lifts to top (CSS transition fires)
  3 – overlay fades, content visible
  4 – done (overlay hidden, bar is sticky)
*/
type Phase = 0 | 1 | 2 | 3 | 4;

export const HistoryPage: React.FC = () => {
  const [phase, setPhase]     = useState<Phase>(0);
  const [dotCount, setDotCount] = useState(0);

  const barRef      = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  /* ── Wheel refs (smooth scroll-driven, no React re-renders on scroll) ── */
  const [activeMsIdx, setActiveMsIdx] = useState(0);
  const activeMsIdxRef  = useRef(0);
  const wheelItemRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const wheelTargetRef  = useRef(0);   // target rotation degrees
  const wheelRotRef     = useRef(0);   // current lerped rotation
  const WHEEL_R         = 240;         // radius (px) — matches CSS
  const DEGS_PER        = 360 / MS.length;

  /* ── Intro sequence ── */
  useEffect(() => {
    // small delay before starting
    const t0 = setTimeout(() => setPhase(1), 600);
    return () => clearTimeout(t0);
  }, []);

  useEffect(() => {
    if (phase !== 1) return;
    const iv = setInterval(() => {
      setDotCount(c => {
        const next = c + 1;
        if (next >= MS.length) {
          clearInterval(iv);
          // pause, then lift bar to top
          setTimeout(() => setPhase(2), 800);
          // start fading overlay
          setTimeout(() => setPhase(3), 1800);
          // hide overlay completely
          setTimeout(() => setPhase(4), 3000);
        }
        return next;
      });
    }, 600);
    return () => clearInterval(iv);
  }, [phase]);

  /* ── Wheel RAF — smooth lerp toward target rotation ── */
  useEffect(() => {
    if (phase < 3) return;
    let rafId: number;
    const tick = () => {
      wheelRotRef.current += (wheelTargetRef.current - wheelRotRef.current) * 0.07;
      wheelItemRefs.current.forEach((el, i) => {
        if (!el) return;
        const angleDeg = 180 + i * DEGS_PER + wheelRotRef.current;
        const rad = (angleDeg * Math.PI) / 180;
        // x negative = moves INTO the visible container area (left of disc centre)
        const x = WHEEL_R * Math.cos(rad);
        const y = WHEEL_R * Math.sin(rad);
        // brightness: item at 180° (leftmost) = most visible; fades toward 90°/270°
        const norm = ((angleDeg % 360) + 360) % 360;
        const dist = Math.min(Math.abs(norm - 180), 360 - Math.abs(norm - 180));
        const scale   = Math.max(0.45, 1 - (dist / 180) * 0.6);
        const opacity = Math.max(0,    1 - (dist / 95)  * 0.9);
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
        el.style.opacity   = `${Math.min(1, opacity)}`;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ── Scroll progress (phase 3+) ── */
  useEffect(() => {
    if (phase < 3) return;
    const page = document.querySelector('.hi-page') as HTMLElement | null;
    const onScroll = () => {
      /* compute milestone fraction first — used by both bar and wheel */
      const sections = sectionRefs.current.filter(Boolean) as HTMLElement[];
      let fracIdx = 0;
      if (sections.length > 0) {
        const viewCenter = window.scrollY + window.innerHeight * 0.5;
        const centers = sections.map(sec => {
          const r = sec.getBoundingClientRect();
          return window.scrollY + r.top + sec.offsetHeight / 2;
        });
        if (viewCenter <= centers[0]) {
          fracIdx = 0;
        } else if (viewCenter >= centers[centers.length - 1]) {
          fracIdx = centers.length - 1;
        } else {
          for (let j = 0; j < centers.length - 1; j++) {
            if (viewCenter >= centers[j] && viewCenter <= centers[j + 1]) {
              fracIdx = j + (viewCenter - centers[j]) / (centers[j + 1] - centers[j]);
              break;
            }
          }
        }
        wheelTargetRef.current = -fracIdx * DEGS_PER;
        const next = Math.round(fracIdx) % MS.length;
        if (next !== activeMsIdxRef.current) {
          activeMsIdxRef.current = next;
          setActiveMsIdx(next);
        }

        /* interpolate background colour */
        if (page) {
          const lo = Math.max(0, Math.floor(fracIdx));
          const hi = Math.min(MS_COLORS.length - 1, lo + 1);
          const t  = fracIdx - lo;
          const r = Math.round(MS_COLORS[lo][0] + (MS_COLORS[hi][0] - MS_COLORS[lo][0]) * t);
          const g = Math.round(MS_COLORS[lo][1] + (MS_COLORS[hi][1] - MS_COLORS[lo][1]) * t);
          const b = Math.round(MS_COLORS[lo][2] + (MS_COLORS[hi][2] - MS_COLORS[lo][2]) * t);
          page.style.backgroundColor = `rgb(${r},${g},${b})`;
        }
      }

      /* bar progress — width grows as you scroll */
      const bar = barRef.current;
      const pbar = progressRef.current;
      if (bar || pbar) {
        const pct = MS.length > 1
          ? Math.min(100, Math.max(0, (fracIdx / (MS.length - 1)) * 100))
          : 0;
        if (pbar) pbar.style.transform = `scaleX(${pct / 100})`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  /* ── Section reveals ── */
  useEffect(() => {
    if (phase < 3) return;
    const observers: IntersectionObserver[] = [];
    sectionRefs.current.forEach(el => {
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { el.classList.add('hi-ms--on'); o.disconnect(); } },
        { threshold: 0.10 },
      );
      o.observe(el);
      observers.push(o);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [phase]);

  const setRef = useCallback((el: HTMLElement | null, i: number) => {
    sectionRefs.current[i] = el;
  }, []);

  const N = MS.length;
  // fraction fill width for the growing line
  const lineFrac = dotCount > 0 ? (dotCount - 1) / (N - 1) : 0;
  const barGradient = MS_COLORS
    .map((rgb, i) => {
      const color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      const start = (i / N) * 100;
      const end = ((i + 1) / N) * 100;
      return `${color} ${start}%, ${color} ${end}%`;
    })
    .join(', ');

  // Latitude offsets for sphere logo placement
  const SPHERE_LATS = [0, 40, -40, 0, 32, -28];

  return (
    <>
      {/* ═══════════════════════════════════════════════
          SPHERE  — intro phases 1-2
          CSS 3D globe with logos orbiting as satellites.
          Collapses to the right and morphs into the wheel.
      ═══════════════════════════════════════════════ */}
      <div
        className={[
          'hi-sphere',
          phase >= 1 ? 'hi-sphere--on'   : '',
          phase >= 2 ? 'hi-sphere--exit' : '',
        ].join(' ')}
      >
        {/* Atmospheric glow */}
        <div className="hi-sphere__glow" />

        {/* Perspective / 3D scene */}
        <div className="hi-sphere__scene">
          <div className="hi-sphere__ball">

            {/* Translucent core orb */}
            <div className="hi-sphere__core" />

            {/* Wireframe latitude / meridian rings */}
            <div className="hi-sphere__ring hi-sphere__ring--eq" />
            <div className="hi-sphere__ring hi-sphere__ring--m1" />
            <div className="hi-sphere__ring hi-sphere__ring--m2" />

            {/* BFC entity logos orbiting the sphere */}
            {MS.map((m, i) => {
              const lon = i * (360 / MS.length);
              const lat = SPHERE_LATS[i] ?? 0;
              return (
                <div
                  key={i}
                  className={`hi-sphere__logo ${
                    dotCount > i ? 'hi-sphere__logo--on' : ''
                  }`}
                  style={{
                    transform: `rotateY(${lon}deg) rotateX(${-lat}deg) translateZ(155px)`,
                  }}
                >
                  <img src={m.logo} alt={m.title} draggable={false} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* ═══════════════════════════════════════════════
          UNIFIED TIMELINE BAR
          – starts fixed, centered on screen
          – moves to top when phase >= 2
      ═══════════════════════════════════════════════ */}
      <div
        ref={barRef}
        className={[
          'hi-bar',
          phase >= 1 ? 'hi-bar--show'    : '',
          phase >= 2 ? 'hi-bar--compact' : ''
        ].join(' ')}
      >
        <div className="hi-bar__inner">
          {/* Progress track (scroll-driven in phase 4) */}
          <div className="hi-bar__track">
            {/* Animated fill during intro */}
            <div
              className="hi-bar__fill-intro"
              style={{ transform: `scaleX(${lineFrac})` }}
            />
            {/* Scroll-driven progress (phase 4) */}
            <div
              className="hi-bar__progress"
              ref={progressRef}
              style={{ background: `linear-gradient(90deg, ${barGradient})` }}
            />
          </div>

          {/* Items: year + dot */}
          <div className="hi-bar__items">
            {MS.map((m, i) => (
              <div
                key={i}
                className={[
                  'hi-bar__item',
                  activeMsIdx >= i ? 'hi-bar__item--done'   : '',
                  activeMsIdx === i ? 'hi-bar__item--active' : '',
                ].join(' ')}
              >
                <div
                  className={`hi-bar__year ${dotCount > i ? 'hi-bar__year--on' : ''}`}
                >
                  {m.year}
                </div>
                <div
                  className={`hi-bar__dot ${dotCount > i ? 'hi-bar__dot--on' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          HALF-WHEEL — fixed on right side, scroll-driven
      ═══════════════════════════════════════════════ */}
      <div className={`hi-wheel ${phase >= 3 ? 'hi-wheel--on' : ''}`}>
        {/* Decorative arc */}
        <svg
          className="hi-wheel__arc"
          viewBox="0 0 480 480"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* full circle track */}
          <circle cx="240" cy="240" r="200" fill="none"
            stroke="rgba(32,67,131,0.10)" strokeWidth="1" />
          {/* active indicator dot at the leftmost point (180°) */}
          <circle cx="40" cy="240" r="5" fill="#99cdb3" />
        </svg>

        {/* Logo items orbiting the arc */}
        {MS.map((m, i) => (
          <div
            key={i}
            className={`hi-wheel__item ${activeMsIdx === i ? 'hi-wheel__item--active' : ''}`}
            ref={el => { wheelItemRefs.current[i] = el; }}
          >
            <img src={m.logo} alt={m.title} draggable={false} />
          </div>
        ))}

        {/* Label for the active item */}
        <div className="hi-wheel__label">
          <span className="hi-wheel__label-year">{MS[activeMsIdx].year}</span>
          <span className="hi-wheel__label-title">{MS[activeMsIdx].title}</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          WHITE OVERLAY  (fades out in phase 3)
      ═══════════════════════════════════════════════ */}
      <div
        className={[
          'hi-overlay',
          phase >= 3 ? 'hi-overlay--out' : '',
          phase >= 4 ? 'hi-overlay--gone' : '',
        ].join(' ')}
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════════
          PAGE CONTENT
      ═══════════════════════════════════════════════ */}
      <main className={`hi-page ${phase >= 3 ? 'hi-page--on' : ''}`}>

        {/* ── Hero ── */}
        <section className="hi-hero-alt">
          <div className="hi-hero-alt__inner">
          <div className="hi-hero-alt__line animate-scale-in delay-200" />

            <span className="hi-hero-alt__eyebrow animate-fade-in">
              BFC Group — Excellence & Intégrité
          </span>

            <h1 className="hi-hero-alt__title animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Bâtir <br />
            <span className="hi-hero-alt__title-em">l'avenir</span> <br />
            du continent
          </h1>

            <p className="hi-hero-alt__subtitle animate-fade-in" style={{ animationDelay: '0.6s' }}>
              De Tunis au Bassin du Congo, BFC tisse un réseau d'excellence au service du
              développement africain depuis 2010.
          </p>

          <div className="hi-hero-alt__scroll animate-float" style={{ animationDelay: '0.8s' }}>
            <div className="hi-hero-alt__scroll-line" />
            <span className="hi-hero-alt__scroll-text">Scroll to explore</span>
          </div>
          </div>

          <div className="hi-hero-alt__bg" aria-hidden="true">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Africa_%28orthographic_projection%29.svg/440px-Africa_%28orthographic_projection%29.svg.png"
            alt=""
          />
          </div>
        </section>



        {/* ── Milestone sections ── */}
        {MS.map((m, i) => (
          <section
            key={i}
            className={`hi-ms ${i % 2 !== 0 ? 'hi-ms--rev' : ''}`}
            ref={el => setRef(el, i)}
          >
            {/* Text */}
            <div className="hi-ms__text">
              <div className="hi-ms__meta">
                <span className="hi-ms__loc">{m.location}</span>
              </div>
              <div className="hi-ms__year-bg" aria-hidden="true">{m.year}</div>
              <h2 className="hi-ms__title">{m.title}</h2>
              <div className="hi-divider" />
              <p className="hi-ms__desc">{m.desc}</p>
              <button className="hi-ms__cta" type="button">
                See More
              </button>
            </div>

            {/* Image */}
            <div className="hi-ms__img-wrap">
              <div className="hi-ms__img">
                <img src={m.img} alt={m.title} />
              </div>
            </div>
          </section>
        ))}

        {/* ── Closing vision section ── */}
        <section className="hi-close">
          <div className="hi-close__inner">
            <span className="hi-eyebrow hi-eyebrow--light">Notre Vision</span>
            <h2 className="hi-close__h2">
              Vers <em>l'africanisation</em><br />intégrale
            </h2>
            <div className="hi-close__line" />
            <p className="hi-close__body">
              Nous bâtissons aujourd'hui les fondations d'une Afrique souveraine,
              où l'expertise locale et l'excellence internationale se rejoignent
              pour créer un avenir prospère et durable.
            </p>
            <a href="/contact" className="hi-close__cta">
              Nous Contacter
            </a>
          </div>
          <div className="hi-close__deco" aria-hidden="true">A</div>
        </section>

      </main>
    </>
  );
};