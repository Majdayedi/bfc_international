import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Hero.css';
import contact from '../src/assets/contact2.png';
import { API_URL } from '../utils/constants';

interface RepLink {
  label: string;
  to: string;
  flag: string;
}

const FALLBACK_REPRESENTATIVE_LINKS: RepLink[] = [
  { label: 'Congo', to: '/representatives/congo', flag: 'https://flagcdn.com/w320/cg.png' },
  { label: 'Senegal', to: '/representatives/senegal', flag: 'https://flagcdn.com/w320/sn.png' },
  { label: 'Tunisia', to: '/representatives/tunisia', flag: 'https://flagcdn.com/w320/tn.png' },
  { label: 'Guinea', to: '/representatives/guinea', flag: 'https://flagcdn.com/w320/gn.png' },
  { label: 'Mauritania', to: '/representatives/mauritania', flag: 'https://flagcdn.com/w320/mr.png' },
];

const HERO_VIDEO_SRC = '/videos/reanda_accord.mp4';

export const Hero: React.FC = () => {
  const [repLinks, setRepLinks] = useState<RepLink[]>(FALLBACK_REPRESENTATIVE_LINKS);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const videoPanelRef = useRef<HTMLDivElement | null>(null);
  const videoCaptionRef = useRef<HTMLDivElement | null>(null);

  // Fetch representatives dynamically from backend
  useEffect(() => {
    fetch(`${API_URL}/api/representatives`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted: RepLink[] = data.map((rep: any) => ({
            label: rep.slug || rep.title || rep.location,
            to: `/representatives/${rep.slug}`,
            flag: rep.flagIconUrl?.startsWith('http')
              ? rep.flagIconUrl
              : `${API_URL}${rep.flagIconUrl?.startsWith('/') ? '' : '/'}${rep.flagIconUrl || ''}`,
          }));
          setRepLinks(formatted);
        }
      })
      .catch((err) => console.error('Error fetching representatives for hero:', err));
  }, []);

  // Scroll animation: video panel floats up, hero content is pushed up.
  // Target progress comes from scroll; rendered progress eases toward it every
  // frame (lerp) so the panel glides instead of snapping — the "floating" feel.
  // The video plays on its own continuously; scroll only moves the panel.
  useEffect(() => {
    let rafId: number;
    let target = 0;
    let current = 0;
    let lastTime = performance.now();

    const readScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScroll = containerRef.current.clientHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const scrolled = Math.max(0, -rect.top);
      // One-scroll takeover: 200vh wrapper → one viewport of scrolling = full progress
      target = Math.min(1, scrolled / totalScroll);
    };

    const tick = (now: number) => {
      // Time-based lerp (~0.085 per 16ms) — frame-rate independent easing
      const dt = Math.min(64, now - lastTime) / 16.67;
      lastTime = now;
      current += (target - current) * (1 - Math.pow(1 - 0.085, dt));
      if (Math.abs(target - current) < 0.0004) current = target;

      const p = current;

      // 1. Video panel: starts at bottom, floats up to cover the hero
      if (videoPanelRef.current) {
        videoPanelRef.current.style.transform = `translateY(${(1 - p) * 100}%)`;
      }

      // 2. Hero content: pushed upward and fades out as video rises beneath it
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(-${p * 40}%)`;
        contentRef.current.style.opacity = `${Math.max(0, 1 - p * 1.5)}`;
      }

      // 3. Caption fades in once the panel has mostly taken over
      if (videoCaptionRef.current) {
        const captionIn = Math.min(1, Math.max(0, (p - 0.55) / 0.35));
        videoCaptionRef.current.style.opacity = `${captionIn}`;
        videoCaptionRef.current.style.transform = `translateY(${(1 - captionIn) * 28}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', readScroll, { passive: true });
    readScroll();
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', readScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-scroll-wrapper">
      <section id="home" className="hero">

        {/* Background image layer */}
        <div className="hero__bg">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=65&w=1400&auto=format&fit=crop"
            alt="Modern Architecture"
            className="hero__bg-image"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="hero__bg-overlay"></div>
        </div>

        {/* Hero content — pushed upward by the rising video panel */}
        <div ref={contentRef} className="hero__content">
          <div className="hero__intro">
            <span className="hero__eyebrow">SINCE 2010</span>
            <div className="hero__headline">
              <h1 className="hero__title">
                BFC<br />
                International <span className="hero__title-accent">&</span><br />
                Academy
              </h1>
              <nav className="hero__representatives" aria-label="Country representatives">
                <p className="hero__representatives-label">bfc group</p>
                <ul className="hero__representative-list">
                  {repLinks.map((country) => (
                    <li key={country.to}>
                      <Link
                        to={country.to}
                        className="hero__representative-link"
                        aria-label={country.label}
                        title={country.label}
                      >
                        <img
                          src={country.flag}
                          alt=""
                          className="hero__representative-flag"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="hero__representative-name">{country.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Floating consultation card */}
          <div className="hero__card">
            <div className="hero__card-image">
              <img src={contact} alt="Collaboration" className="hero__card-image-img" />
              <div className="hero__card-image-overlay"></div>
            </div>
            <a
              href="https://wa.me/21658422199"
              target="_blank"
              rel="noopener noreferrer"
              className="hero__card-footer"
            >
              <div>
                <p className="hero__card-meta">Talk to an expert</p>
                <p className="hero__card-title">Book a Free Consultation</p>
              </div>
              <span className="hero__card-link" aria-hidden="true">
                <ArrowRight size={20} />
              </span>
            </a>
          </div>
        </div>

        {/* Video panel — slides up from bottom covering the entire hero */}
        <div ref={videoPanelRef} className="hero__video-panel">
          {/* Shadow bar cast at the top leading edge of the rising panel */}
          <div className="hero__video-panel-shadow" />
          <video
            ref={videoRef}
            src={HERO_VIDEO_SRC}
            className="hero__video-panel-video"
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
          />
          {/* Minimal black veil so the type stays legible without flattening the footage */}
          <div className="hero__video-overlay" aria-hidden="true" />
          {/* Modern caption that fades in as the panel takes over */}
          <div ref={videoCaptionRef} className="hero__video-caption">
            <span className="hero__video-eyebrow">REANDA INTERNATIONAL</span>
            <h2 className="hero__video-title">
              Connected expertise.<br />
              <span className="hero__video-title-accent">Local insight.</span>
            </h2>
            <p className="hero__video-sub">
              One alliance of independent firms — audit, tax, advisory &amp; consulting  
              across 58+ countries.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
};
