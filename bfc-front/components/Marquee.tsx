
import React, { useEffect, useState } from 'react';
import { API_URL } from '../utils/constants';
import { useT, useLanguage, localizedField } from '../src/i18n';
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
  const t = useT();
  const { lang } = useLanguage();
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
            name: localizedField(item, 'name', lang) || t('marquee.clientLogoFallback'),
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
  }, [lang]);

  return (
    <section className="marquee">
      <div className="marquee__header">
        <span className="marquee__eyebrow">{t('marquee.globalClients')}</span>
      </div>
      
      <div className="marquee__track">
        <div className="marquee__row">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="marquee__group">
              {clients.map((client, j) => (
                <div key={j} className="marquee__item">
                  {client.src && (
                    <img src={client.src} alt={client.name || t('marquee.clientFallback')} className="marquee__logo-image" />
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
