
import React from 'react';
import { ArrowRight } from 'lucide-react';
import './Hero.css';

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
            (01) SINCE 2012
          </span>
          <h1 className="hero__title">
            Discover<br />
            Excellence <span className="hero__title-accent">in</span><br />
            Innovation.
          </h1>
        </div>

        {/* Floating Detail Box */}
        <div className="hero__card">
          <div className="hero__card-image">
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" 
              alt="Collaboration" 
              className="hero__card-image-img"
            />
            <div className="hero__card-image-overlay"></div>
          </div>
          <div className="hero__card-footer">
            <div>
              <p className="hero__card-meta">Featured Insights</p>
              <p className="hero__card-title">Fintech Strategy 2025</p>
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
