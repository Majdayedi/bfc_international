
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import reandaLogo from '../src/assets/reanda.png';
import { useT } from '../src/i18n';
import './Stats.css';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 140, suffix: '+' },
  { value: 58, suffix: '+' },
  { value: 5000, suffix: '+' },
  { value: 23, suffix: '' },
];

const LABEL_KEYS = ['stats.offices', 'stats.countries', 'stats.professionals', 'stats.globalRank'];

export const Stats: React.FC = () => {
  const t = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const translatedLabels = LABEL_KEYS.map((key) => t(key));

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      STATS.forEach((stat, i) => {
        const counter = { val: 0 };
        const el = document.getElementById(`counter-${i}`);
        if (el) {
          gsap.to(counter, {
            val: stat.value,
            duration: 2.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true
            },
            onUpdate: () => {
              el.innerHTML = Math.floor(counter.val).toLocaleString();
            }
          });
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="stats" ref={containerRef}>
      <div className="stats__container">
        <img src={reandaLogo} alt={t('stats.logoAlt')} className="stats__logo" />
        <h2 className="stats__title">{t('stats.networkTitle')}</h2>
        <div className="stats__grid">
          {STATS.map((stat, i) => (
            <div key={i} className="stats__item">
              <span className="stats__label">{translatedLabels[i]}</span>
              <div className="stats__value">
                <span className="stats__number" id={`counter-${i}`}>0</span>
                {stat.suffix && <span className="stats__suffix">{stat.suffix}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
