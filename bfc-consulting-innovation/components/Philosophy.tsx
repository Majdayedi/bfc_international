
import React from 'react';
import { useTranslatedTexts } from '../src/dynamicTranslation';
import './Philosophy.css';

export const Philosophy: React.FC = () => {
  const [eyebrow, titleLine1, titleAccent, titleLine2, titleLine3, lead, believeTitle, believeText, courageTitle, courageText] = useTranslatedTexts([
    '( OUR PHILOSOPHY )',
    'Leading',
    'Consulting',
    ' & Executive Training ',
    'in EMEA',
    'Our experts in Tunisia, Senegal, Guinea, Congo and Mauritania guide public and private structures to exceed their ambitions in strategy, governance, risk management and digital transformation.',
    'What we believe in',
    'BFC International & Academy believes that sustainable transformation requires strong governance, empowered leadership and resilient institutions.',
    'Courage to change',
    'We partner with governments, financial institutions and private organizations to design impactful solutions that strengthen performance, transparency and innovation.'
  ]);

  return (
    <section id="approche" className="philosophy">
      <div className="philosophy__container">
        <div className="philosophy__grid">
          <div>
            <span className="philosophy__eyebrow">{eyebrow}</span>
            <h2 className="philosophy__title">
              {titleLine1}<br />
              <span className="philosophy__accent">{titleAccent}</span>{titleLine2} <br />
              {titleLine3}
            </h2>
            <div className="philosophy__divider"></div>
          </div>
          
          <div className="philosophy__content">
            <p className="philosophy__lead">
              {lead}

            </p>
            
            <div className="philosophy__details">
              <div>
                <h4 className="philosophy__detail-title">{believeTitle}</h4>
                <p className="philosophy__detail-text">
                  {believeText}
                </p>
              </div>
              <div>
                <h4 className="philosophy__detail-title">{courageTitle}</h4>
                <p className="philosophy__detail-text">
                  {courageText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};