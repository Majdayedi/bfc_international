import React, { useEffect, useRef, useState } from 'react';
import contactHero from '../src/assets/contact.jpg';
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
    { value: 'faisabilite', label: 'Etude de faisabilite' },
    { value: 'reforme', label: 'Preparation de rapports de reforme' },
    { value: 'politiques', label: 'Design, etude et mise en oeuvre des politiques publiques' },
    { value: 'strategie', label: 'Etudes strategiques' },
    { value: 'cyber', label: 'Cybersecurite' },
    { value: 'transformation', label: 'Transformation digitale' },
    { value: 'gouvernance', label: 'Strategie et gouvernance IT' },
    { value: 'pki', label: 'Public key infrastructure (PKI)' },
    { value: 'organisation', label: 'Organisation et operationalisation des structures' },
    { value: 'audit', label: 'Audit et controle interne' },
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
            <p className="contact-section__eyebrow">Nous contacter</p>
            <h2 className="contact-section__title">Decrivez votre besoin</h2>
            <p className="contact-section__lead">
              Partagez le contexte, le secteur et l'urgence. Nous vous repondrons avec les prochaines
              etapes et une proposition d'accompagnement.
            </p>
          </div>
          <form className="contact-form__form" onSubmit={handleSubmit}>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="name">Nom complet</label>
                <input id="name" name="name" type="text" placeholder="Votre nom" required />
              </div>
              <div className="contact-form__field">
                <label htmlFor="email">Email professionnel</label>
                <input id="email" name="email" type="email" placeholder="nom@entreprise.com" required />
              </div>
            </div>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="company">Entreprise</label>
                <input id="company" name="company" type="text" placeholder="Organisation" />
              </div>
              <div className="contact-form__field">
                <label htmlFor="representative">Representant a contacter</label>
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
                        : 'Selectionnez un pays'}
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
                    <option value="">Selectionnez un pays</option>
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
                <label htmlFor="service">Service recherche</label>
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
                        : 'Selectionnez un service'}
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
                    <option value="">Selectionnez un service</option>
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
              <label htmlFor="message">Resume du projet</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Decrivez le besoin, les objectifs attendus et les delais."
                required
              />
            </div>
            <div className="contact-form__actions">
              <button type="submit" className="contact-form__button">
                Envoyer la demande
              </button>
              <p className="contact-form__note">Vos informations restent confidentielles.</p>
            </div>
          </form>
        </div>

        <div className="contact-map">
          <div className="contact-map__header">
            <h3>Siege social</h3>
            <p>Adresse principale a Tunis, Centre Urbain Nord.</p>
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
              <span className="contact-map__label">Adresse</span>
              <span className="contact-map__value">Tunis, Centre Urbain Nord TN</span>
            </div>
            <div>
              <span className="contact-map__label">Telephone</span>
              <span className="contact-map__value">+216 36 214 357</span>
            </div>
            <div>
              <span className="contact-map__label">Site web</span>
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
