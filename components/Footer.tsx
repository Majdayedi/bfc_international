
import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div>
            <h2 className="footer__title">
              Let's build <br />
              <span className="footer__accent">something</span> great.
            </h2>
            <a 
              href="mailto:work@bfc.com" 
              className="footer__email"
            >
              work@bfc.com
            </a>
          </div>
          
          <div className="footer__links">
            <div className="footer__links-grid">
              <div>
                <span className="footer__label">( SOCIAL )</span>
                <ul className="footer__list">
                  <li><a href="#" className="footer__link">LinkedIn</a></li>
                  <li><a href="#" className="footer__link">Instagram</a></li>
                  <li><a href="#" className="footer__link">X / Twitter</a></li>
                </ul>
              </div>
              <div>
                <span className="footer__label">( OFFICES )</span>
                <div className="footer__offices">
                  <p>Tunis, Tunisia<br />Les Berges du Lac 2</p>
                  <p>Dakar, Senegal<br />Plateau District</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; 2025 BFC GROUP</p>
          <div className="footer__bottom-links">
            <a href="#" className="footer__bottom-link">Privacy Policy</a>
            <a href="#" className="footer__bottom-link">Terms of Service</a>
          </div>
          <p>BORN IN AFRICA</p>
        </div>
      </div>
    </footer>
  );
};
