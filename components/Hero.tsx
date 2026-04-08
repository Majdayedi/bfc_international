
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Hero.css';
import contact from '../src/assets/contact2.png';

const REPRESENTATIVE_LINKS = [
  { label: 'Congo', to: '/representatives/congo' },
  { label: 'Senegal', to: '/representatives/senegal' },
  { label: 'Tunisia', to: '/representatives/tunisia' },
  { label: 'Guinea', to: '/representatives/guinee' },
  { label: 'Mauritania', to: '/representatives/mauritania' },
];

export const Hero: React.FC = () => {
  return (
    <section id="home" className="hero">
      <div className="hero__bg">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
          alt="Modern Architecture" 
          className="hero__bg-image"
        />
        <div className="hero__bg-overlay"></div>
      </div>

      <div className="hero__content">
        <div className="hero__intro">
          <span className="hero__eyebrow">
             SINCE 2010
          </span>
          <h1 className="hero__title">
            BFC<br />
            International <span className="hero__title-accent">&</span><br />
            Academy.
          </h1>
        </div>

        <nav className="hero__representatives" aria-label="Country representatives">
          {REPRESENTATIVE_LINKS.map((country, index) => (
            <React.Fragment key={country.to}>
              <Link to={country.to} className="hero__representative-link">
                {country.label}
              </Link>
              {index < REPRESENTATIVE_LINKS.length - 1 && <span className="hero__representative-sep">|</span>}
            </React.Fragment>
          ))}
        </nav>

        {/* Floating Detail Box */}
        <div className="hero__card">
          <div className="hero__card-image">
            <img 
              src={contact} 
              alt="Collaboration" 
              className="hero__card-image-img"
            />
            <div className="hero__card-image-overlay"></div>
          </div>
          <div className="hero__card-footer">
            <div>
              <p className="hero__card-meta">Talk to an expert </p>
              <p className="hero__card-title"> Book a Free Consultation</p>
            </div>
            <a href="#horizontal-section" className="hero__card-link">
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
