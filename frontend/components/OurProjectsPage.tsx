import React, { useEffect, useRef, useState, useCallback } from 'react';
import './OurProjectsPage.css';

/* ─── Types & Data ─────────────────────────────────────────────────── */
interface Project {
  id: number;
  title: string;
  category: string;
  country: string;
  flag: string;
  year: string;
  description: string;
  accent: string;
  imageUrl: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Digital Transformation of Public Finance Systems',
    category: 'Advisory',
    country: 'Democratic Republic of Congo',
    flag: 'https://flagcdn.com/w40/cd.png',
    year: '2023',
    description:
      'End-to-end advisory mandate to modernise budget-execution workflows and implement IFMIS across three ministries.',
    accent: '#30aeb7',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Pan-African SME Capacity Building Programme',
    category: 'Academy',
    country: 'Senegal',
    flag: 'https://flagcdn.com/w40/sn.png',
    year: '2024',
    description:
      'Designed and delivered a 12-month blended-learning curriculum for 340 SME leaders across Francophone West Africa.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Statutory Audit — Telecoms Joint Venture',
    category: 'Audit',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2023',
    description:
      'Independent audit of a joint-venture entity at the intersection of two major regional telecoms operators.',
    accent: '#e05b3e',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Transfer Pricing Documentation & Defence',
    category: 'Tax & Legal',
    country: 'Guinea',
    flag: 'https://flagcdn.com/w40/gn.png',
    year: '2022',
    description:
      'Prepared master-file / local-file documentation and represented the client before the national tax authority.',
    accent: '#f59e0b',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Full-Scope Payroll & HR Outsourcing',
    category: 'Outsourcing',
    country: 'Mauritania',
    flag: 'https://flagcdn.com/w40/mr.png',
    year: '2024',
    description:
      'Ongoing payroll management, regulatory compliance and HR administration for a multinational retail group.',
    accent: '#7c3aed',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'IFRS Transition & Financial Reporting',
    category: 'Advisory',
    country: 'Kenya',
    flag: 'https://flagcdn.com/w40/ke.png',
    year: '2022',
    description:
      'Guided a listed manufacturing company through the full IFRS adoption journey, including training of finance staff.',
    accent: '#16a34a',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 7,
    title: 'Anti-Money Laundering Compliance Review',
    category: 'Audit',
    country: 'Ghana',
    flag: 'https://flagcdn.com/w40/gh.png',
    year: '2023',
    description:
      'Independent AML/CFT compliance review for a regional bank against FATF recommendations and local regulation.',
    accent: '#0891b2',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 8,
    title: 'Reanda International Certification Programme',
    category: 'Academy',
    country: 'Nigeria',
    flag: 'https://flagcdn.com/w40/ng.png',
    year: '2024',
    description:
      'Launched the first West-African cohort of the Reanda-accredited Audit & Assurance certification, training 80 professionals.',
    accent: '#be123c',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop',
  },
];

/* ─── Scroll Helpers ───────────────────────────────────────────────── */
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
}

const VH_PER_ITEM = 150;
const SMOOTH_FACTOR = 0.04;
const INTRO_VH = 120;
const CTA_AFTER = 8;
const CTA_VH = 120;

const CATEGORIES = ['All', ...Array.from(new Set(PROJECTS.map((p) => p.category)))];
const COUNTRIES = ['All', ...Array.from(new Set(PROJECTS.map((p) => p.country)))];

/* ─── Component ────────────────────────────────────────────────────── */
export const OurProjectsPage: React.FC = () => {
  /* ── Project slides state & refs ────────────────────────────────── */
  const totalItems = PROJECTS.length;
  const scrollHeight = totalItems * VH_PER_ITEM + INTRO_VH + CTA_VH;

  const driverRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const wheelSectionRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const wheelItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressFillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const smoothProgressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  /* ── Filter / search state ─────────────────────── */
  const [filterMode, setFilterMode] = useState<'category' | 'country'>('category');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = filterMode === 'category' ? CATEGORIES : COUNTRIES;

  const filteredProjects = PROJECTS.filter((p) => {
    const field = filterMode === 'category' ? p.category : p.country;
    const matchesFilter = activeFilter === 'All' || field === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const getRawProgress = useCallback(() => {
    const el = driverRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const totalScroll = el.offsetHeight - window.innerHeight;
    if (totalScroll <= 0) return 0;
    const scrolled = -rect.top;
    return clamp(scrolled / totalScroll, 0, 1);
  }, []);

  const setContent = useCallback((index: number) => {
    if (index === activeIndexRef.current || isTransitioningRef.current) return;
    const contentEl = contentRef.current;
    if (!contentEl) return;

    if (activeIndexRef.current === -1) {
      activeIndexRef.current = index;
      setActiveIndex(index);
      contentEl.classList.remove('pw-content-inner--exiting');
      contentEl.style.animation = 'none';
      void contentEl.offsetHeight;
      contentEl.style.animation = '';
      return;
    }

    isTransitioningRef.current = true;
    contentEl.classList.add('pw-content-inner--exiting');

    setTimeout(() => {
      activeIndexRef.current = index;
      setActiveIndex(index);
      contentEl.classList.remove('pw-content-inner--exiting');
      contentEl.style.animation = 'none';
      void contentEl.offsetHeight;
      contentEl.style.animation = '';
      isTransitioningRef.current = false;
    }, 420);
  }, []);

  useEffect(() => {
    function tick() {
      const raw = getRawProgress();
      smoothProgressRef.current += (raw - smoothProgressRef.current) * SMOOTH_FACTOR;
      const sp = smoothProgressRef.current;

      /* ── Intro phase ──────────────────────────── */
      const introFraction = INTRO_VH / (totalItems * VH_PER_ITEM + INTRO_VH + CTA_VH);
      const introEl = introRef.current;
      if (introEl) {
        const introProgress = clamp(sp / introFraction, 0, 1);
        const introOpacity = 1 - introProgress * introProgress;
        const introY = -60 * introProgress;
        const introBlur = 8 * introProgress;
        introEl.style.opacity = String(introOpacity);
        introEl.style.transform = `translateY(${introY}px)`;
        introEl.style.filter = `blur(${introBlur}px)`;
      }

      /* ── CTA + Project visibility ───────────────── */
      const pp = clamp((sp - introFraction) / (1 - introFraction), 0, 1);

      const postIntroVH = totalItems * VH_PER_ITEM + CTA_VH;
      const ctaStartPp = (CTA_AFTER * VH_PER_ITEM) / postIntroVH;
      const ctaEndPp   = (CTA_AFTER * VH_PER_ITEM + CTA_VH) / postIntroVH;
      const ctaFade = 0.03;

      /* CTA overlay */
      const ctaEl = ctaRef.current;
      if (ctaEl) {
        let ctaOp: number;
        if (pp < ctaStartPp - ctaFade) ctaOp = 0;
        else if (pp < ctaStartPp) ctaOp = (pp - (ctaStartPp - ctaFade)) / ctaFade;
        else if (pp <= ctaEndPp) ctaOp = 1;
        else if (pp < ctaEndPp + ctaFade) ctaOp = 1 - (pp - ctaEndPp) / ctaFade;
        else ctaOp = 0;
        ctaEl.style.opacity = String(ctaOp);
      }

      /* Hide project sections during intro AND during CTA */
      const introFade = clamp((sp - introFraction * 0.6) / (introFraction * 0.4), 0, 1);
      let ctaHide = 1;
      if (pp >= ctaStartPp - ctaFade && pp <= ctaEndPp + ctaFade) {
        if (pp < ctaStartPp) ctaHide = 1 - (pp - (ctaStartPp - ctaFade)) / ctaFade;
        else if (pp <= ctaEndPp) ctaHide = 0;
        else ctaHide = (pp - ctaEndPp) / ctaFade;
      }
      const sectionsOpacity = String(introFade * ctaHide);
      if (contentSectionRef.current) contentSectionRef.current.style.opacity = sectionsOpacity;
      if (wheelSectionRef.current) wheelSectionRef.current.style.opacity = sectionsOpacity;
      if (progressBarRef.current) progressBarRef.current.style.opacity = sectionsOpacity;

      /* ── Remap pp → prj (strips CTA gap) ────────── */
      const pauseTarget = Math.min((CTA_AFTER - 0.5) / (totalItems - 1), 1);
      let prj: number;
      if (pp <= ctaStartPp) {
        prj = (pp / ctaStartPp) * pauseTarget;
      } else if (pp <= ctaEndPp) {
        prj = pauseTarget;
      } else {
        prj = pauseTarget + ((pp - ctaEndPp) / (1 - ctaEndPp)) * (1 - pauseTarget);
      }

      const newIdx = clamp(Math.round(prj * (totalItems - 1)), 0, totalItems - 1);
      setContent(newIdx);

      for (let i = 0; i < totalItems; i++) {
        const segStart = i / totalItems;
        const segEnd = (i + 1) / totalItems;
        const fill = mapRange(prj, segStart, segEnd, 0, 1);
        const el = progressFillRefs.current[i];
        if (el) el.style.transform = `scaleY(${fill})`;
      }

      for (let i = 0; i < totalItems; i++) {
        const target = i / (totalItems - 1);
        const ease = (t: number) => t * t * (3 - 2 * t);

        let yVal: number;
        if (prj <= target - 0.6) yVal = 800;
        else if (prj >= target + 0.6) yVal = -800;
        else { const t = ease((prj - (target - 0.6)) / 1.2); yVal = 800 - 1600 * t; }

        let scaleVal: number;
        if (prj <= target - 0.4) scaleVal = 0.6;
        else if (prj >= target + 0.4) scaleVal = 0.6;
        else if (prj <= target) { const t = ease((prj - (target - 0.4)) / 0.4); scaleVal = 0.6 + 0.6 * t; }
        else { const t = ease((prj - target) / 0.4); scaleVal = 1.2 - 0.6 * t; }

        let opacityVal: number;
        if (prj <= target - 0.12) opacityVal = 0;
        else if (prj >= target + 0.12) opacityVal = 0;
        else if (prj <= target) { const t = ease((prj - (target - 0.12)) / 0.12); opacityVal = t; }
        else { const t = ease((prj - target) / 0.12); opacityVal = 1 - t; }

        let blurVal: number;
        if (prj <= target - 0.4) blurVal = 12;
        else if (prj >= target + 0.4) blurVal = 12;
        else if (prj <= target) { const t = ease((prj - (target - 0.4)) / 0.4); blurVal = 12 * (1 - t); }
        else { const t = ease((prj - target) / 0.4); blurVal = 12 * t; }

        let glowVal: number;
        if (prj <= target - 0.2) glowVal = 0;
        else if (prj >= target + 0.2) glowVal = 0;
        else if (prj <= target) { const t = ease((prj - (target - 0.2)) / 0.2); glowVal = 0.25 * t; }
        else { const t = ease((prj - target) / 0.2); glowVal = 0.25 * (1 - t); }

        const itemEl = wheelItemRefs.current[i];
        if (itemEl) {
          itemEl.style.transform = `translateY(${yVal}px) scale(${scaleVal})`;
          itemEl.style.opacity = String(opacityVal);
          itemEl.style.filter = `blur(${blurVal}px)`;
        }
        const glowEl = glowRefs.current[i];
        if (glowEl) glowEl.style.opacity = String(glowVal);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [getRawProgress, setContent, totalItems]);

  /* ── Intersection Observer for project cards grid ────────────── */
  useEffect(() => {
    const el = cardsGridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('pw-cards-grid--visible');
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: '200px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const project = PROJECTS[activeIndex];
  const titleWords = project.title.split(' ');
  const midpoint = Math.ceil(titleWords.length / 2);
  const titleLine1 = titleWords.slice(0, midpoint).join(' ');
  const titleLine2 = titleWords.slice(midpoint).join(' ');

  return (
    <main className="projects-page">

      {/* ── Project Slides ────────────────────────────────────────── */}
      <div ref={driverRef} className="pw-scroll-driver" style={{ height: `${scrollHeight}vh` }}>
        <div className="pw-sticky">

          {/* Intro title overlay */}
          <div className="pw-intro" ref={introRef}>
            <h1 className="pw-intro__title">
              Our Top<br />
              <span className="pw-intro__title-stroke">References</span>
            </h1>
            <div className="pw-intro__line" />
            <p className="pw-intro__sub">Over 50 projects worldwide.</p>
          </div>

          {/* CTA interstitial overlay */}
          <div className="pw-cta" ref={ctaRef} style={{ opacity: 0 }}>
            <h2 className="pw-cta__title">
              Interested<br />
              <span className="pw-cta__title-stroke">for more?</span>
            </h2>
            <div className="pw-cta__line" />
            <div className="pw-cta__scroll-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="m18 13-6 6-6-6" />
              </svg>
              <span>Scroll down</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pw-progress-bar" ref={progressBarRef}>
            {PROJECTS.map((_, i) => (
              <div key={i} className="pw-progress-segment">
                <div
                  className="pw-progress-fill"
                  ref={(el) => { progressFillRefs.current[i] = el; }}
                />
              </div>
            ))}
          </div>

          {/* Content (left) */}
          <div className="pw-content-section" ref={contentSectionRef}>
            <div className="pw-content-inner" ref={contentRef}>
              

              

              <h2 className="pw-project-title">
                {titleLine1} <div className="pw-category-badge" style={{ '--badge-accent': project.accent } as React.CSSProperties}>
                {project.category}
              </div>
                <br />
                <span className="pw-text-stroke">{titleLine2}</span>
              </h2>

              <p className="pw-project-desc">{project.description}</p>

              <div className="pw-project-meta">
                <img
                  src={project.flag}
                  alt={project.country}
                  className="pw-project-flag"
                />
                <span className="pw-project-country">{project.country}</span>
                <span className="pw-project-year">{project.year}</span>
              </div>

              <button className="pw-discover-btn">
                <span>View Details</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {/* Images (right) */}
          <div className="pw-wheel-section" ref={wheelSectionRef}>
            <div className="pw-wheel-container">
              {PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  className="pw-wheel-item"
                  ref={(el) => { wheelItemRefs.current[i] = el; }}
                >
                  <div className="pw-wheel-item-inner">
                    <div
                      className="pw-wheel-glow"
                      style={{ background: p.accent }}
                      ref={(el) => { glowRefs.current[i] = el; }}
                    />
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pw-scroll-hint">
              <span>Scroll</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="m18 13-6 6-6-6" />
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* ── Project Cards Grid ─────────────────────────────────── */}
      <section className="pw-cards-section">
        <div className="pw-cards-content">
          <span className="pw-cards__eyebrow">Full Portfolio</span>
          <h2 className="pw-cards__title">All <span className="pw-cards__title-stroke">Projects</span></h2>

          {/* Search bar */}
          <div className="pw-search-bar">
            <svg className="pw-search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="pw-search-bar__input"
              placeholder="Search projects by name, country, or category…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="pw-search-bar__clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
                ×
              </button>
            )}
          </div>

          {/* Filter mode toggle + pills */}
          <div className="pw-filter-row">
            <div className="pw-filter-mode">
              <button
                className={`pw-filter-mode__btn${filterMode === 'category' ? ' pw-filter-mode__btn--active' : ''}`}
                onClick={() => { setFilterMode('category'); setActiveFilter('All'); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                Category
              </button>
              <button
                className={`pw-filter-mode__btn${filterMode === 'country' ? ' pw-filter-mode__btn--active' : ''}`}
                onClick={() => { setFilterMode('country'); setActiveFilter('All'); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Country
              </button>
            </div>
          </div>

          {/* Filter pills */}
          <div className="pw-filter-bar">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                className={`pw-filter-btn${activeFilter === opt ? ' pw-filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="pw-cards-grid" ref={cardsGridRef}>
            {filteredProjects.length === 0 && (
              <p className="pw-cards-empty">No projects match your search.</p>
            )}
            {filteredProjects.map((p, i) => (
              <div
                key={p.id}
                className="pw-card"
                style={{
                  '--card-accent': p.accent,
                  '--card-delay': `${i * 100}ms`,
                } as React.CSSProperties}
              >
                <div className="pw-card__img-wrap">
                  <img src={p.imageUrl} alt={p.title} loading="lazy" />
                  <span className="pw-card__cat" style={{ background: p.accent }}>
                    {p.category}
                  </span>
                </div>
                <div className="pw-card__body">
                  <div className="pw-card__location">
                    <img src={p.flag} alt={p.country} className="pw-card__flag" />
                    <span>{p.country}</span>
                    <span className="pw-card__year">{p.year}</span>
                  </div>
                  <h3 className="pw-card__title">{p.title}</h3>
                  <p className="pw-card__desc">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};
