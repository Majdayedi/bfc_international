
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Stats.css';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { label: 'Happy Clients', value: 250, suffix: '+' },
  { label: 'Countries', value: 35, suffix: '' },
  { label: 'Projects', value: 1200, suffix: '+' },
  { label: 'Team Members', value: 80, suffix: '+' },
];

export const Stats: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
        <div className="stats__grid">
          {STATS.map((stat, i) => (
            <div key={i} className="stats__item">
              <span className="stats__label">{stat.label}</span>
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
