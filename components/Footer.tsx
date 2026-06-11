import React from 'react';
import { Mail, Phone } from 'lucide-react';
import './Footer.css';

interface Office {
  country: string;
  city: string;
  phone: string;
  flag: string;
}

const OFFICES: Office[] = [
  {
    country: 'Tunisia',
    city: 'Tunis',
    phone: '+216 58 422 199',
    flag: 'https://flagcdn.com/w80/tn.png',
  },
  {
    country: 'Guinea',
    city: 'Conakry',
    phone: '+224 623 27 30 73',
    flag: 'https://flagcdn.com/w80/gn.png',
  },
  {
    country: 'Senegal',
    city: 'Dakar',
    phone: '',
    flag: 'https://flagcdn.com/w80/sn.png',
  },
  {
    country: 'Congo',
    city: 'Kinshasa',
    phone: '',
    flag: 'https://flagcdn.com/w80/cg.png',
  },
  {
    country: 'Mauritania',
    city: 'Nouakchott',
    phone: '+216 98 194 202',
    flag: 'https://flagcdn.com/w80/mr.png',
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">

        {/* ── Top section: Title left, email right ── */}
        <div className="footer__top">
          <div className="footer__top-left">
            <h2 className="footer__title">
              Let's build <br />
              <span className="footer__accent">something</span> great.
            </h2>
          </div>

          <div className="footer__top-right">
            <span className="footer__label">( CONTACT )</span>
            <a
              href="mailto:international@BFC.com.tn"
              className="footer__email"
            >
              <Mail size={18} />
              <span>international@BFC.com.tn</span>
            </a>
            <div className="footer__social">
              <span className="footer__label">( SOCIAL )</span>
              <div className="footer__social-links">
                <a
                  href="https://tn.linkedin.com/company/bfc-international-academy"
                  className="footer__social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a
                  href="https://www.youtube.com/@BFCGROUPOFFICIAL"
                  className="footer__social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Countries section ── */}
        <div className="footer__countries">
          <span className="footer__label">( OUR OFFICES )</span>
          <div className="footer__countries-grid">
            {OFFICES.map((office) => (
              <div key={office.country} className="footer__country">
                <img
                  src={office.flag}
                  alt={`${office.country} flag`}
                  className="footer__flag"
                />
                <div className="footer__country-info">
                  <span className="footer__country-name">{office.country}</span>
                  <span className="footer__country-city">{office.city}</span>
                  {office.phone && (
                    <span className="footer__country-phone">
                      <Phone size={10} />
                      {office.phone}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} BFC GROUP</p>
          <div className="footer__bottom-links">
            <a href="#" className="footer__bottom-link">Privacy Policy</a>
            <a href="#" className="footer__bottom-link">Terms of Service</a>
          </div>
          <p className="footer__tagline">BORN IN AFRICA</p>
        </div>
      </div>
    </footer>
  );
};
