
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
              Leading<br />
              <span className="philosophy__accent">Consulting</span> & Executive Training  <br />
              in EMEA
            </h2>
            <div className="philosophy__divider"></div>
          </div>
          
          <div className="philosophy__content">
            <p className="philosophy__lead">
              Our experts in Tunisia, Senegal, Guinea, Congo and Mauritania guide public and private structures to exceed their ambitionsin
strategy, governance, risk management and digital transformation.
            </p>
            
            <div className="philosophy__details">
              <div>
                <h4 className="philosophy__detail-title">What we believe in  </h4>
                <p className="philosophy__detail-text">
BFC International & Academy believes that sustainable transformation requires strong governance,
empowered leadership and resilient institutions.               </p>
              </div>
              <div>
                <h4 className="philosophy__detail-title">Courage to change</h4>
                <p className="philosophy__detail-text">


We partner with governments, financial institutions and private organizations to design impactful
solutions that strengthen performance, transparency and innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};