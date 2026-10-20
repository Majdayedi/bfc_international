
import React from 'react';
import { useT } from '../src/i18n';
import './Philosophy.css';

export const Philosophy: React.FC = () => {
  const t = useT();

  return (
    <section id="approche" className="philosophy">
      <div className="philosophy__container">
        <div className="philosophy__grid">
          <div>
            <span className="philosophy__eyebrow">{t('philosophy.eyebrow')}</span>
            <h2 className="philosophy__title">
              {t('philosophy.titleLine1')}<br />
              <span className="philosophy__accent">{t('philosophy.titleAccent')}</span>{t('philosophy.titleLine2')} <br />
              {t('philosophy.titleLine3')}
            </h2>
            <div className="philosophy__divider"></div>
          </div>
          
          <div className="philosophy__content">
            <p className="philosophy__lead">
              {t('philosophy.lead')}

            </p>
             
            <div className="philosophy__details">
              <div>
                <h4 className="philosophy__detail-title">{t('philosophy.believeTitle')}</h4>
                <p className="philosophy__detail-text">
                  {t('philosophy.believeText')}
                </p>
              </div>
              <div>
                <h4 className="philosophy__detail-title">{t('philosophy.courageTitle')}</h4>
                <p className="philosophy__detail-text">
                  {t('philosophy.courageText')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
