import React, { useEffect, useRef, useState, useCallback } from 'react';
import './HistoryPage.css';
import bfcLogo    from '../src/assets/bfc.png';
import MGIBFCImg  from '../src/assets/MGI-BFC.png';
import guineeLogo from '../src/assets/bfc.png';
import senegalLogo from '../src/assets/bfc_senegal.png';
import bfcguinee from '../src/assets/BFC_GUINEE.jpeg';
import bfc from '../src/assets/bfc.jpg';
import congoLogo  from '../src/assets/bfc_congo.png';
import mauritaniaLogo from '../src/assets/bfc_mauritania.png';
import senegalimg from '../src/assets/history/senegal.png';
import guineeimg from '../src/assets/history/guinee.png';
import congoimg from '../src/assets/history/congo.png';
import tunisiaimg from '../src/assets/history/tunisia.png';
import tunisiaimg2 from '../src/assets/history/tunisia2.png';
import comingSoonImg from '../src/assets/history/coming-soon.png';

import { API_URL } from '../utils/constants';

interface HistoryEvent {
  id?: number;
  eventYear: number;
  title: string;
  description: string;
  backgroundColor?: string;
  countryFlag?: string;
  logoUrl?: string;
  photoUrl?: string;
}

/* ─── Data ──────────────────────────────────────────────────── */
interface Milestone {
  year: string;
  title: string;
  location: string;
  img: string;
  desc: string;
  logo: string;
  flag?: string | false;
  path?: string;
  email?: string;
  managerName?: string;
}

/* Background colour for each milestone — parsed from hex */
const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return [r, g, b] as const;
};

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
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>([]);
  const [phase, setPhase]     = useState<Phase>(0);
  const [dotCount, setDotCount] = useState(0);

  const barRef      = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  /* ── Wheel refs (smooth scroll-driven, no React re-renders on scroll) ── */
  const [activeMsIdx, setActiveMsIdx] = useState(0);
  const activeMsIdxRef  = useRef(0);
  const [wheelHidden, setWheelHidden] = useState(false);
  const wheelHiddenRef  = useRef(false);
  const [barHidden, setBarHidden] = useState(false);
  const barHiddenRef   = useRef(false);
  const wheelItemRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const wheelTargetRef  = useRef(0);   // target rotation degrees
  const wheelRotRef     = useRef(0);   // current lerped rotation
  
  const getUploadUrl = (url: string | undefined) => {
    if (!url) return '';
    return url.startsWith('http') || url.startsWith('/') ? url : `${API_URL}${url}`;
  };

  const fetchHistoryEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/history-events`);
      if (res.ok) {
        const data = await res.json();
        setHistoryEvents(data);
        setTimeout(() => setPhase(1), 600);
      }
    } catch (err) {
      console.error('Failed to fetch history events:', err);
    }
  };

  const parseDescription = (rawDesc: string) => {
    let desc = rawDesc || '';
    let path = '';
    let email = '';
    let managerName = '';
    
    if (desc && desc.includes('::link=')) {
      const parts = desc.split('::link=');
      desc = parts[0];
      let remainder = parts[1] || '';
      
      if (remainder.includes('::email=')) {
        const subParts = remainder.split('::email=');
        path = subParts[0];
        remainder = subParts[1] || '';
        
        if (remainder.includes('::managerName=')) {
          const mParts = remainder.split('::managerName=');
          email = mParts[0];
          managerName = mParts[1];
        } else {
          email = remainder;
        }
      } else {
        path = remainder;
      }
    }
    return { desc, path, email, managerName };
  };

  const MS: Milestone[] = historyEvents.map(e => {
    const { desc, path, email, managerName } = parseDescription(e.description);
    return {
      year: String(e.eventYear),
      title: e.title,
      location: '', // Can be extended later if needed
      img: getUploadUrl(e.photoUrl),
      desc: desc,
      logo: getUploadUrl(e.logoUrl),
      flag: e.countryFlag || false,
      path: path,
      email: email,
      managerName: managerName
    };
  });

  const STATIC_EN_COURS: Milestone = {
    year: '2025',
    title: 'En cours...',
    location: '',
    img: comingSoonImg,
    desc: 'BFC Mauritania is currently being established to provide ongoing local presence and tailored consulting services in Mauritania.',
    logo: mauritaniaLogo,
    flag: 'https://flagcdn.com/w80/mr.png',
    path: '',
    email: '',
    managerName: ''
  };

  MS.push(STATIC_EN_COURS);

  const MS_COLORS = historyEvents.map(e => 
    e.backgroundColor ? hexToRgb(e.backgroundColor) : [255, 255, 255] as const
  );
  MS_COLORS.push(hexToRgb('#e4ecfc'));

  const WHEEL_R         = 240;         // radius (px) — matches CSS
  const DEGS_PER        = MS.length > 0 ? 360 / MS.length : 360;

  /* ── Intro sequence ── */
  useEffect(() => {
    fetchHistoryEvents();
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
      if (MS.length === 0) return;
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
        if (page && MS_COLORS.length > 0) {
          const lo = Math.max(0, Math.floor(fracIdx));
          const hi = Math.min(MS_COLORS.length - 1, lo + 1);
          const t  = fracIdx - lo;
          const r = Math.round(MS_COLORS[lo][0] + (MS_COLORS[hi][0] - MS_COLORS[lo][0]) * t);
          const g = Math.round(MS_COLORS[lo][1] + (MS_COLORS[hi][1] - MS_COLORS[lo][1]) * t);
          const b = Math.round(MS_COLORS[lo][2] + (MS_COLORS[hi][2] - MS_COLORS[lo][2]) * t);
          page.style.backgroundColor = `rgb(${r},${g},${b})`;
        }

        // Hide wheel and bar when the footer enters the viewport
        const footer = document.querySelector('footer') as HTMLElement | null;
        const scrolledToBottom = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
        if (scrolledToBottom !== wheelHiddenRef.current) {
          wheelHiddenRef.current = scrolledToBottom;
          setWheelHidden(scrolledToBottom);
        }
        if (scrolledToBottom !== barHiddenRef.current) {
          barHiddenRef.current = scrolledToBottom;
          setBarHidden(scrolledToBottom);
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
          phase >= 2 ? 'hi-bar--compact' : '',
          barHidden   ? 'hi-bar--hidden'  : '',
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
      <div className={`hi-wheel ${phase >= 3 ? 'hi-wheel--on' : ''} ${wheelHidden ? 'hi-wheel--hidden' : ''}`}>
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
          <span className="hi-wheel__label-year">{MS[activeMsIdx]?.year}</span>
          <span className="hi-wheel__label-title">{MS[activeMsIdx]?.title}</span>
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
              BFC Group - Excellence & Integrity
          </span>

            <h1 className="hi-hero-alt__title animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Building <br />
            <span className="hi-hero-alt__title-em">the future</span> <br />
            of the region
          </h1>

            <p className="hi-hero-alt__subtitle animate-fade-in" style={{ animationDelay: '0.6s' }}>
              From Tunis to the Congo Basin, BFC has been building a network of excellence
              to serve regional development since 2010.
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
              <h2 className="hi-ms__title">
                {m.title}
                {m.flag && (
                  <img
                    src={m.flag}
                    alt={`${m.title} flag`}
                    className="hi-ms__flag"
                  />
                )}
              </h2>
              <div className="hi-divider" />
              <p className="hi-ms__desc">{m.desc}</p>
              <div className="hi-ms__actions">
                <button 
                  className="hi-ms__cta" 
                  type="button"
                  onClick={() => m.path ? window.location.href = m.path : null}
                >
                  See More
                </button>
                {m.email && (
                  <a
                    className="hi-ms__contact-cta"
                    href={`mailto:${m.email}`}
                  >
                    Contact Country Manager {m.managerName ? `(${m.managerName})` : ''}
                  </a>
                )}
              </div>
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
        

      </main>
    </>
  );
};