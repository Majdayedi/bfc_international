
import React from 'react';
import './Marquee.css';

const logoModules = import.meta.glob('../src/assets/Logo references/*.{png,jpg,jpeg,webp}', { eager: true });
const LOGOS = Object.entries(logoModules).map(([path, mod]) => {
  const fileName = path.split('/').pop() || '';
  const name = fileName.split('.')[0];
  return {
    name,
    src: (mod as any).default
  };
});

export const Marquee: React.FC = () => {
  // If there are too many logos, you can chunk or just show all of them.
  // Taking a subset or all of them depending on visual needs. Let's just show all in a loop.
  return (
    <section className="marquee">
      <div className="marquee__header">
        <span className="marquee__eyebrow">Global Partnerships</span>
      </div>
      
      <div className="marquee__track">
        <div className="marquee__row">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="marquee__group">
              {LOGOS.map((client, j) => (
                <div key={j} className="marquee__item">
                  <img src={client.src} alt={client.name} className="marquee__logo-image" />
                  <span className="marquee__name" style={{ display: 'none' }}>{client.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
