
import React from 'react';
import { Target, Cpu, GraduationCap, Users } from 'lucide-react';
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
  return (
    <section id="expertise" className="expertise">
      <div className="expertise__container">
        <div className="expertise__header">
          <div className="expertise__title-wrap">
            <span className="expertise__eyebrow">
              ( OUR CORE EXPERTISE )
            </span>
            <h2 className="expertise__title">
              Pillars of <span className="expertise__title-muted">Transformation</span>
            </h2>
          </div>
          <p className="expertise__subtitle">
            Tailored solutions designed for a continent in constant evolution.
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
                {item.title}
              </h3>
              <p className="expertise__card-desc">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
