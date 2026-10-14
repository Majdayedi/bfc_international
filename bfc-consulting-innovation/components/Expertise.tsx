
import React from 'react';
import { Target, Cpu, GraduationCap, Users } from 'lucide-react';
import { useTranslatedTexts } from '../src/dynamicTranslation';
import './Expertise.css';

const EXPERTISE = [
  {
    id: '01',
    title: 'Strategy & Public Sector Transformation',
    desc: 'We support governments and institutions in strategic planning, institutional reform and policy implementation across Africa and the Middle East.',
    icon: Target
  },
  {
    id: '02',
    title: 'Digital Transformation & Innovation',
    desc: 'Digital strategy, AI governance, e‑government and innovation ecosystem development.',
    icon: Cpu
  },
  {
    id: '03',
    title: 'Certified Executive Training ',
    desc: 'Digital strategy, AI governance, e‑government and innovation ecosystem development.',
    icon: GraduationCap
  },
  {
    id: '04',
    title: 'Governance, Risk & Internal Audit',
    desc: 'Implementation of risk management frameworks, internal audit transformation and governance strengthening.',
    icon: Users
  }
];

export const Expertise: React.FC = () => {
  const [
    eyebrow,
    title1, title2,
    subtitle,
    t1, d1, t2, d2, t3, d3, t4, d4,
  ] = useTranslatedTexts([
    '( OUR CORE EXPERTISE )',
    'Pillars of',
    'Transformation',
    'Tailored solutions designed for a continent in constant evolution.',
    EXPERTISE[0].title, EXPERTISE[0].desc,
    EXPERTISE[1].title, EXPERTISE[1].desc,
    EXPERTISE[2].title, EXPERTISE[2].desc,
    EXPERTISE[3].title, EXPERTISE[3].desc,
  ]);
  const cardText = [
    t1, d1, t2, d2, t3, d3, t4, d4
  ];

  return (
    <section id="expertise" className="expertise">
      <div className="expertise__container">
        <div className="expertise__header">
          <div className="expertise__title-wrap">
            <span className="expertise__eyebrow">
              {eyebrow}
            </span>
            <h2 className="expertise__title">
              {title1} <span className="expertise__title-muted">{title2}</span>
            </h2>
          </div>
          <p className="expertise__subtitle">
            {subtitle}
          </p>
        </div>

        <div className="expertise__grid">
          {EXPERTISE.map((item, cardIndex) => (
            <div key={item.id} className="expertise__card">
              <div className="expertise__card-header">
                <span className="expertise__card-id">
                  ({item.id})
                </span>
                <item.icon size={44} className="expertise__card-icon" />
              </div>

              <h3 className="expertise__card-title">
                {cardText[cardIndex * 2]}
              </h3>
              <p className="expertise__card-desc">
                {cardText[cardIndex * 2 + 1]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
