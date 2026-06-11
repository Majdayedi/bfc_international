import React, { useRef, useEffect } from 'react';
import iciLogo from '../src/assets/certif/ici.png';
import irmLogo from '../src/assets/certif/IRM.png';
import bfcLogo from '../src/assets/bfc.png';
import reandaLogo from '../src/assets/reanda.png';
import gini from '../src/assets/certif/global_innovation_insititute.png';
import TABC from '../src/assets/certif/TABC.png';

import './Certifications.css';

const PARTNERS = [
  { id: 'reanda', name: 'Reanda international network', logo: reandaLogo },
  { id: 'ici', name: 'Internal Control Institute', logo: iciLogo },
  { id: 'irm', name: 'Institute of Risk Management', logo: irmLogo },
  { id: 'gini', name: 'GINI', logo: gini },
  { id: 'tabc', name: 'Tunisia africa business council', logo: TABC },
];

export const Certifications: React.FC = () => {
  const logosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logosRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = el.querySelectorAll('.certif__logo-item');
            items.forEach((item, i) => {
              (item as HTMLElement).style.transitionDelay = `${i * 0.1}s`;
              item.classList.add('certif__logo-item--visible');
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="certif">
      <div className="certif__container">
        <div className="certif__header">
          <span className="certif__eyebrow">
            ( ACCREDITED PARTNERSHIPS )
          </span>
          <h2 className="certif__title">
            Our <span className="certif__title-accent">Partners</span>
          </h2>
          <p className="certif__subtitle">
            BFC&apos;s business and training partners around the world.
          </p>
        </div>

        {/* Partner logos row */}
        <div className="certif__logos" ref={logosRef}>
          {PARTNERS.map((partner) => (
            <div key={partner.id} className="certif__logo-item">
              <div className="certif__logo-window">
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} className="certif__logo-img" />
                ) : (
                  <span className="certif__logo-placeholder">{partner.id.toUpperCase()}</span>
                )}
              </div>
              <span className="certif__logo-name">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
