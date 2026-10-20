
import React from 'react';
import { Target, Cpu, GraduationCap, Users } from 'lucide-react';
import { useT } from '../src/i18n';
import './Expertise.css';

const EXPERTISE = [
  {
    id: '01',
    titleKey: 'expertise.card1Title',
    descKey: 'expertise.card1Desc',
    icon: Target
  },
  {
    id: '02',
    titleKey: 'expertise.card2Title',
    descKey: 'expertise.card2Desc',
    icon: Cpu
  },
  {
    id: '03',
    titleKey: 'expertise.card3Title',
    descKey: 'expertise.card3Desc',
    icon: GraduationCap
  },
  {
    id: '04',
    titleKey: 'expertise.card4Title',
    descKey: 'expertise.card4Desc',
    icon: Users
  }
];

export const Expertise: React.FC = () => {
  const t = useT();

  return (
    <section id="expertise" className="expertise">
      <div className="expertise__container">
        <div className="expertise__header">
          <div className="expertise__title-wrap">
            <span className="expertise__eyebrow">
              {t('expertise.eyebrow')}
            </span>
            <h2 className="expertise__title">
              {t('expertise.title1')} <span className="expertise__title-muted">{t('expertise.title2')}</span>
            </h2>
          </div>
          <p className="expertise__subtitle">
            {t('expertise.subtitle')}
          </p>
        </div>

        <div className="expertise__grid">
          {EXPERTISE.map((item) => (
            <div key={item.id} className="expertise__card">
              <div className="expertise__card-header">
                <span className="expertise__card-id">
                  ({item.id})
                </span>
                <item.icon size={44} className="expertise__card-icon" />
              </div>

              <h3 className="expertise__card-title">
                {t(item.titleKey)}
              </h3>
              <p className="expertise__card-desc">
                {t(item.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
