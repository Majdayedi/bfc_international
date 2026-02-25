import React, { useEffect, useRef, useState } from 'react';
import aboutUsImage from '../src/assets/about_us1.png';
import nadiaImage from '../src/assets/nadia.png';
import africaImage from '../src/assets/africa.png';
import './AboutUsPage.css';

export const AboutUsPage: React.FC = () => {
  const heroRef = useRef<HTMLElement | null>(null);
  const testimonialRef = useRef<HTMLElement | null>(null);
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    testimonial: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (entry.target === heroRef.current) {
            setVisibleSections((prev) => ({ ...prev, hero: true }));
            observer.unobserve(entry.target);
          }

          if (entry.target === testimonialRef.current) {
            setVisibleSections((prev) => ({ ...prev, testimonial: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    if (testimonialRef.current) {
      observer.observe(testimonialRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="about-page">
      <section
        ref={heroRef}
        className={`about-hero about-anim ${visibleSections.hero ? 'is-visible' : ''}`}
        style={{ backgroundImage: `url(${aboutUsImage})` }}
      >
        <div className="about-hero__overlay" />
        <div className="about-hero__content">
          <p className="about-hero__eyebrow">(01) SINCE 2012</p>
          <h1 className="about-hero__title">
            Discover
            <br />
            Excellence <span className="about-hero__title-accent">in</span>
            <br />
            Innovation.
          </h1>
          <span className="about-hero__line" />
        </div>
      </section>

      <section
        ref={testimonialRef}
        className={`about-testimonial about-anim ${visibleSections.testimonial ? 'is-visible' : ''}`}
        style={{ backgroundImage: `url(${africaImage})` }}
      >
        <div className="about-testimonial__content">
          <p className="about-testimonial__quote-mark">“</p>
          <h2 className="about-testimonial__title">
            Nadia a transformé notre manière de piloter nos projets. Son accompagnement nous a donné
            une vision claire, une exécution solide et la confiance pour atteindre nos objectifs.
          </h2>
          <p className="about-testimonial__author">Nadia • BFC International & Academy</p>
        </div>

        <div className="about-testimonial__person-wrap" aria-hidden="true">
          <img src={nadiaImage} alt="" className="about-testimonial__person" />
        </div>
      </section>
    </main>
  );
};
