
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './Hero.css';
import contact from '../src/assets/contact2.png';

// Rendered at 18px on desktop and 66px on phones, so the source is fetched at
// w320 — enough for a 3x display at the larger size.
const REPRESENTATIVE_LINKS = [
  { label: 'Congo', to: '/representatives/congo', flag: 'https://flagcdn.com/w320/cg.png' },
  { label: 'Senegal', to: '/representatives/senegal', flag: 'https://flagcdn.com/w320/sn.png' },
  { label: 'Tunisia', to: '/representatives/tunisia', flag: 'https://flagcdn.com/w320/tn.png' },
  { label: 'Guinea', to: '/representatives/guinea', flag: 'https://flagcdn.com/w320/gn.png' },
  { label: 'Mauritania', to: '/representatives/mauritania', flag: 'https://flagcdn.com/w320/mr.png' },
];

export const Hero: React.FC = () => {
  return (
    <section id="home" className="hero">
      <div className="hero__bg">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=65&w=1400&auto=format&fit=crop" 
          alt="Modern Architecture" 
          className="hero__bg-image"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero__bg-overlay"></div>
      </div>

      <div className="hero__content">
        <div className="hero__intro">
          <span className="hero__eyebrow">
             SINCE 2010
          </span>
          <div className="hero__headline">
            <h1 className="hero__title">
              BFC<br />
              International <span className="hero__title-accent">&</span><br />
              Academy.
            </h1>

            {/* Shares a row with the title so the flags can line up with it on
                phones; on desktop it leaves the flow and centres above the title. */}
            <nav className="hero__representatives" aria-label="Country representatives">
              <p className="hero__representatives-label">bfc group</p>
              <ul className="hero__representative-list">
                {REPRESENTATIVE_LINKS.map((country) => (
                  <li key={country.to}>
                    {/* The label is the only accessible name once the visible
                        text is hidden on phones, so it carries the country. */}
                    <Link
                      to={country.to}
                      className="hero__representative-link"
                      aria-label={country.label}
                      title={country.label}
                    >
                      <img
                        src={country.flag}
                        alt=""
                        className="hero__representative-flag"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="hero__representative-name">{country.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Floating Detail Box */}
        <div className="hero__card">
          {/* Desktop keeps the photo and the white card frame; the mobile block
              hides the image and turns the footer into a solid button. */}
          <div className="hero__card-image">
            <img
              src={contact}
              alt="Collaboration"
              className="hero__card-image-img"
            />
            <div className="hero__card-image-overlay"></div>
          </div>
          <a href="#horizontal-section" className="hero__card-footer">
            {/* Paragraphs, so the browser's default margins give the desktop
                card its original spacing. The mobile block clears them. */}
            <div>
              <p className="hero__card-meta">Talk to an expert </p>
              <p className="hero__card-title"> Book a Free Consultation</p>
            </div>
            <span className="hero__card-link" aria-hidden="true">
              <ArrowRight size={20} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
