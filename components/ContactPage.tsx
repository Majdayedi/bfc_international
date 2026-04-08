import React, { useEffect, useRef, useState } from 'react';
import contactHero from '../src/assets/contact1.png';
import './ContactPage.css';

interface SelectOption {
  value: string;
  label: string;
}

export const ContactPage: React.FC = () => {
  const representativeOptions: SelectOption[] = [
    { value: 'senegal', label: 'Senegal' },
    { value: 'congo', label: 'Congo' },
    { value: 'guinee', label: 'Guinee' },
    { value: 'mauritanie', label: 'Mauritanie' },
    { value: 'tunisie', label: 'Tunisie' },
  ];

  const serviceOptions: SelectOption[] = [
    { value: 'faisabilite', label: 'Feasibility Study' },
    { value: 'reforme', label: 'Preparation of Reform Reports' },
    { value: 'politiques', label: 'Design, Study and Implementation of Public Policies' },
    { value: 'strategie', label: 'Strategic Studies' },
    { value: 'cyber', label: 'Cybersecurity' },
    { value: 'transformation', label: 'Digital Transformation' },
    { value: 'gouvernance', label: 'IT Strategy and Governance' },
    { value: 'pki', label: 'Public Key Infrastructure (PKI)' },
    { value: 'organisation', label: 'Organization and Operationalization of Structures' },
    { value: 'audit', label: 'Audit and Internal Control' },
  ];

  const [representativeValue, setRepresentativeValue] = useState('');
  const [serviceValue, setServiceValue] = useState('');
  const [isRepresentativeOpen, setIsRepresentativeOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const representativeRef = useRef<HTMLDivElement | null>(null);
  const serviceRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (representativeRef.current && !representativeRef.current.contains(target)) {
        setIsRepresentativeOpen(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(target)) {
        setIsServiceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <main className="contact-page">
      <section className="contact-hero-banner" aria-label="Contact hero">
        <img src={contactHero} alt="BFC International & Academy" className="contact-hero-banner__image" />
        <div className="contact-hero-banner__content">
          <div className="contact-hero-banner__intro">
            <p className="contact-hero-banner__eyebrow">BFC International & Academy</p>
            <h1 className="contact-hero-banner__title">
              Contact<br></br>
              <span>us</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="contact-main" id="contact-us">
        <div className="contact-form">
          <div className="contact-section__header">
            <p className="contact-section__eyebrow">Contact us</p>
            <h2 className="contact-section__title">Describe your need</h2>
            <p className="contact-section__lead">
              Share the context, sector, and urgency. We will get back to you with the next steps and a support proposal.
            </p>
          </div>
          <form className="contact-form__form" onSubmit={handleSubmit}>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="name">Full Name</label>
                <input id="name" name="name" type="text" placeholder="Your name" required />
              </div>
              <div className="contact-form__field">
                <label htmlFor="email">Professional Email</label>
                <input id="email" name="email" type="email" placeholder="name@company.com" required />
              </div>
            </div>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" placeholder="Organization" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="phone">Phone Number</label>
                <div className="contact-phone-input">
                    <select name="phonePrefix" id="phonePrefix" className="contact-phone-prefix" defaultValue="+216">
                      <option value="+216">+216 (TN)</option>
                      <option value="+221">+221 (SN)</option>
                      <option value="+242">+242 (CG)</option>
                      <option value="+224">+224 (GN)</option>
                      <option value="+222">+222 (MR)</option>
                      <option value="+33">+33 (FR)</option>
                      <option value="+1">+1 (US/CA)</option>
                    </select>
                    <input id="phone" name="phone" type="tel" placeholder="12 345 678" required />
                  </div>
                </div>
              </div>
              <div className="contact-form__row">
                <div className="contact-form__field">
                <label htmlFor="representative">Representative to contact</label>
                <div
                  className={`contact-select ${isRepresentativeOpen ? 'contact-select--open' : ''}`}
                  ref={representativeRef}
                >
                  <button
                    type="button"
                    className="contact-select__trigger"
                    aria-haspopup="listbox"
                    aria-expanded={isRepresentativeOpen}
                    onClick={() =>
                      setIsRepresentativeOpen((prev) => {
                        const next = !prev;
                        if (next) {
                          setIsServiceOpen(false);
                        }
                        return next;
                      })
                    }
                  >
                    <span
                      className={
                        representativeValue ? 'contact-select__value' : 'contact-select__placeholder'
                      }
                    >
                      {representativeValue
                        ? representativeOptions.find((option) => option.value === representativeValue)?.label
                        : 'Select a country'}
                    </span>
                    <span className="contact-select__chevron" aria-hidden="true" />
                  </button>
                  <div className="contact-select__options" role="listbox">
                    {representativeOptions.map((option, index) => (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={representativeValue === option.value}
                        className="contact-select__option"
                        style={{ ['--i' as string]: index } as React.CSSProperties}
                        onClick={() => {
                          setRepresentativeValue(option.value);
                          setIsRepresentativeOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <select
                    id="representative"
                    name="representative"
                    className="contact-select__native"
                    value={representativeValue}
                    onChange={(event) => setRepresentativeValue(event.target.value)}
                    required
                  >
                    <option value="">Select a country</option>
                    {representativeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="contact-form__row contact-form__row--single">
              <div className="contact-form__field contact-form__field--wide">
                <label htmlFor="service">Service Required</label>
                <div
                  className={`contact-select contact-select--wide ${
                    isServiceOpen ? 'contact-select--open' : ''
                  }`}
                  ref={serviceRef}
                >
                  <button
                    type="button"
                    className="contact-select__trigger"
                    aria-haspopup="listbox"
                    aria-expanded={isServiceOpen}
                    onClick={() =>
                      setIsServiceOpen((prev) => {
                        const next = !prev;
                        if (next) {
                          setIsRepresentativeOpen(false);
                        }
                        return next;
                      })
                    }
                  >
                    <span className={serviceValue ? 'contact-select__value' : 'contact-select__placeholder'}>
                      {serviceValue
                        ? serviceOptions.find((option) => option.value === serviceValue)?.label
                        : 'Select a service'}
                    </span>
                    <span className="contact-select__chevron" aria-hidden="true" />
                  </button>
                  <div className="contact-select__options" role="listbox">
                    {serviceOptions.map((option, index) => (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={serviceValue === option.value}
                        className="contact-select__option"
                        style={{ ['--i' as string]: index } as React.CSSProperties}
                        onClick={() => {
                          setServiceValue(option.value);
                          setIsServiceOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <select
                    id="service"
                    name="service"
                    className="contact-select__native"
                    value={serviceValue}
                    onChange={(event) => setServiceValue(event.target.value)}
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="contact-form__field">
              <label htmlFor="message">Project Summary</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Describe the need, expected targets, and deadlines."
                required
              />
            </div>
            <div className="contact-form__actions">
              <button type="submit" className="contact-form__button">
                Send Request
              </button>
              <p className="contact-form__note">Your information remains confidential.</p>
            </div>
          </form>
        </div>

        <div className="contact-map">
          <div className="contact-map__header">
            <h3>Headquarters</h3>
            <p>Main address in Tunis, Centre Urbain Nord.</p>
          </div>
          <div className="contact-map__frame">
            <iframe
              title="BFC International & Academy map"
              src="https://www.google.com/maps?q=Tunis%2C%20Centre%20Urbain%20Nord%20TN&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="contact-map__details">
            <div>
              <span className="contact-map__label">Address</span>
              <span className="contact-map__value">Tunis, Centre Urbain Nord TN</span>
            </div>
            <div>
              <span className="contact-map__label">Phone</span>
              <span className="contact-map__value">+216 36 214 357</span>
            </div>
            <div>
              <span className="contact-map__label">Website</span>
              <span className="contact-map__value">
                <a href="https://internationalbfc.com/" target="_blank" rel="noreferrer">
                  internationalbfc.com
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

     
    </main>
  );
};
