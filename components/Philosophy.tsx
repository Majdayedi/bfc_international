
import React from 'react';
import './Philosophy.css';

export const Philosophy: React.FC = () => {
  return (
    <section id="approche" className="philosophy">
      <div className="philosophy__container">
        <div className="philosophy__grid">
          <div>
            <span className="philosophy__eyebrow">( OUR PHILOSOPHY )</span>
            <h2 className="philosophy__title">
              Adaptive <br />
              <span className="philosophy__accent">Impact</span> in every <br />
              Context.
            </h2>
            <div className="philosophy__divider"></div>
          </div>
          
          <div className="philosophy__content">
            <p className="philosophy__lead">
              Our experts in Tunisia, Senegal, Guinea, Congo and Mauritania guide public and private structures to exceed their ambitions.
            </p>
            
            <div className="philosophy__details">
              <div>
                <h4 className="philosophy__detail-title">Local Insight</h4>
                <p className="philosophy__detail-text">
                  We design systems that respect environmental specificities to ensure maximum implementation efficiency and local relevance.
                </p>
              </div>
              <div>
                <h4 className="philosophy__detail-title">Global Scale</h4>
                <p className="philosophy__detail-text">
                  Modernizing practices and achieving success through innovative, data-driven frameworks that scale across the African continent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
