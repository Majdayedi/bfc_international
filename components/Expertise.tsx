
import React from 'react';
import { Target, Cpu, GraduationCap, Users } from 'lucide-react';
import './Expertise.css';

const EXPERTISE = [
  {
    id: '01',
    title: 'Process Modernization',
    desc: 'Guiding re-engineering efforts and implementing global quality standards across public and private sectors.',
    icon: Target
  },
  {
    id: '02',
    title: 'Digital Integration',
    desc: 'Deploying high-efficiency digital tools that optimize transparency and operational workflow.',
    icon: Cpu
  },
  {
    id: '03',
    title: 'BFC Academy',
    desc: 'Capacity building through specialized, certified training adapted to the African market landscape.',
    icon: GraduationCap
  },
  {
    id: '04',
    title: 'Strategic Advisory',
    desc: 'Providing long-term development visions and implementation support for sustainable organizational growth.',
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
