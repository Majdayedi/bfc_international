
import React, { useEffect, useState } from 'react';
import { API_URL } from '../utils/constants';
import './Marquee.css';

const logoModules = import.meta.glob('../src/assets/Logo references/*.{png,jpg,jpeg,webp}', { eager: true });
const DEFAULT_LOGOS = Object.entries(logoModules).map(([path, mod]) => {
  const fileName = path.split('/').pop() || '';
  const name = fileName.split('.')[0];
  return {
    name,
    src: (mod as any).default
  };
});

export const Marquee: React.FC = () => {
  const [clients, setClients] = useState<any[]>(DEFAULT_LOGOS);

  useEffect(() => {
    fetch(`${API_URL}/api/clients`)
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item: any) => ({
            name: item.name || 'Client Logo',
            src: item.logoUrl
              ? item.logoUrl.startsWith('http') || item.logoUrl.startsWith('/src/')
                ? item.logoUrl
                : `${API_URL}${item.logoUrl}`
              : '',
          }));
          setClients(mapped);
        }
      })
      .catch(() => {
        // Fallback to default static logos
      });
  }, []);

  return (
    <section className="marquee">
      <div className="marquee__header">
        <span className="marquee__eyebrow">Global Clients</span>
      </div>
      
      <div className="marquee__track">
        <div className="marquee__row">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="marquee__group">
              {clients.map((client, j) => (
                <div key={j} className="marquee__item">
                  {client.src && (
                    <img src={client.src} alt={client.name || 'Client'} className="marquee__logo-image" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

