import React, { useRef, useEffect, useState } from 'react';
import iciLogo from '../src/assets/certif/ici.png';
import irmLogo from '../src/assets/certif/IRM.png';
import bfcLogo from '../src/assets/bfc.png';
import reandaLogo from '../src/assets/reanda.png';
import gini from '../src/assets/certif/global_innovation_insititute.png';
import TABC from '../src/assets/certif/TABC.png';
import { API_URL } from '../utils/constants';

import './Certifications.css';

const DEFAULT_PARTNERS = [
  { id: '1', name: 'Reanda international network', logo: reandaLogo },
  { id: '2', name: 'Internal Control Institute', logo: iciLogo },
  { id: '3', name: 'Institute of Risk Management', logo: irmLogo },
  { id: '4', name: 'GINI', logo: gini },
  { id: '5', name: 'Tunisia africa business council', logo: TABC },
];

export const Certifications: React.FC = () => {
  const logosRef = useRef<HTMLDivElement>(null);
  const [partners, setPartners] = useState<any[]>(DEFAULT_PARTNERS);

  useEffect(() => {
    fetch(`${API_URL}/api/partners`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            logo: item.logoUrl
              ? item.logoUrl.startsWith('http') || item.logoUrl.startsWith('/src/')
                ? item.logoUrl
                : `${API_URL}${item.logoUrl}`
              : '',
          }));
          setPartners(mapped);
        }
      })
      .catch(() => {
        // Keep default fallback partners
      });
  }, []);

  useEffect(() => {
    const el = logosRef.current;
    if (!el) return;

    const items = el.querySelectorAll('.certif__logo-item');
    items.forEach((item, i) => {
      (item as HTMLElement).style.transitionDelay = `${i * 0.1}s`;
      item.classList.add('certif__logo-item--visible');
    });
  }, [partners]);

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
          {partners.map((partner) => (
            <div key={partner.id} className="certif__logo-item">
              <div className="certif__logo-window">
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} className="certif__logo-img" />
                ) : (
                  <span className="certif__logo-placeholder">{partner.name ? partner.name.slice(0, 2).toUpperCase() : 'P'}</span>
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

