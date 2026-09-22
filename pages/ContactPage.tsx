import React, { useEffect, useRef, useState } from 'react';
import contactHero from '../src/assets/contact1.png';
import { API_URL } from '../utils/constants';
import { Loader, Send, ChevronLeft, CheckCircle } from 'lucide-react';
import './ContactPage.css';

interface SelectOption {
  value: string;
  label: string;
}

interface FormState {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  phonePrefix: string;
  service: string;
  message: string;
}

const EMPTY: FormState = {
  fullName: '',
  email: '',
  company: '',
  phone: '',
  phonePrefix: '+216',
  service: '',
  message: '',
};

export const ContactPage: React.FC = () => {
  const representativeOptions: SelectOption[] = [
    { value: 'senegal', label: 'Senegal' },
    { value: 'congo', label: 'Congo' },
    { value: 'guinee', label: 'Guinee' },
    { value: 'mauritanie', label: 'Mauritanie' },
    { value: 'tunisie', label: 'Tunisie' },
  ];

  const serviceOptions: SelectOption[] = [
    { value: 'Training', label: 'Training' },
    { value: 'Consulting', label: 'Consulting' },
    { value: 'Audit', label: 'Audit' },
    { value: 'Tax and Legal', label: 'Tax and Legal' },
    { value: 'Expertise', label: 'Expertise' },
    { value: 'Collaboration', label: 'Collaboration' },
    { value: 'Other', label: 'Other' },
  ];

  const [form, setForm] = useState<FormState>({ ...EMPTY });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [representativeValue, setRepresentativeValue] = useState('');
  const [serviceValue, setServiceValue] = useState('');
  const [isRepresentativeOpen, setIsRepresentativeOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const representativeRef = useRef<HTMLDivElement | null>(null);
  const serviceRef = useRef<HTMLDivElement | null>(null);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'A valid email address is required.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (!form.service) next.service = 'Please select a service.';
    if (!form.message.trim()) next.message = 'Message is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_URL}/api/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          company: form.company,
          phone: form.phone,
          phonePrefix: form.phonePrefix,
          service: form.service,
          message: form.message,
        }),
      });

      if (!res.ok) throw new Error('Failed to send your message. Please try again.');

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      setSubmitError(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
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

  // Sync serviceValue to form.service
  useEffect(() => {
    setForm((prev) => ({ ...prev, service: serviceValue }));
    setErrors((prev) => ({ ...prev, service: undefined }));
  }, [serviceValue]);

  if (submitted) {
    return (
      <main className="contact-page">
        <div className="contact-success">
          <div className="contact-success__card">
            <div className="contact-success__icon">
              <CheckCircle size={48} />
            </div>
            <h2>Message Sent Successfully</h2>
            <p>
              Thank you, <strong>{form.fullName}</strong>. Our team will review your request
              and get back to you at <strong>{form.email}</strong> as soon as possible.
            </p>
            <button
              type="button"
              className="contact-form__button"
              onClick={() => {
                setSubmitted(false);
                setForm({ ...EMPTY });
                setServiceValue('');
              }}
            >
              Send Another Message
            </button>
          </div>
        </div>
      </main>
    );
  }

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
          <form className="contact-form__form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.fullName}
                  onChange={set('fullName')}
                  className={errors.fullName ? 'is-error' : ''}
                  autoComplete="name"
                />
                {errors.fullName && <span className="contact-error-text">{errors.fullName}</span>}
              </div>
              <div className="contact-form__field">
                <label htmlFor="email">Professional Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={set('email')}
                  className={errors.email ? 'is-error' : ''}
                  autoComplete="email"
                />
                {errors.email && <span className="contact-error-text">{errors.email}</span>}
              </div>
            </div>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Organization"
                  value={form.company}
                  onChange={set('company')}
                />
              </div>
              <div className="contact-form__field">
                <label htmlFor="phone">Phone Number *</label>
                <div className="contact-phone-input">
                  <select
                    name="phonePrefix"
                    id="phonePrefix"
                    className="contact-phone-prefix"
                    value={form.phonePrefix}
                    onChange={set('phonePrefix')}
                  >
                    <option value="+216">+216 (TN)</option>
                    <option value="+221">+221 (SN)</option>
                    <option value="+242">+242 (CG)</option>
                    <option value="+224">+224 (GN)</option>
                    <option value="+222">+222 (MR)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+1">+1 (US/CA)</option>
                  </select>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="12 345 678"
                    value={form.phone}
                    onChange={set('phone')}
                    className={errors.phone ? 'is-error' : ''}
                    autoComplete="tel"
                  />
                </div>
                {errors.phone && <span className="contact-error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="contact-form__row contact-form__row--single">
              <div className="contact-form__field contact-form__field--wide">
                <label htmlFor="service">Service Required *</label>
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
                {errors.service && <span className="contact-error-text">{errors.service}</span>}
              </div>
            </div>
            <div className="contact-form__field">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Describe the need, expected targets, and deadlines."
                value={form.message}
                onChange={set('message')}
                className={errors.message ? 'is-error' : ''}
              />
              {errors.message && <span className="contact-error-text">{errors.message}</span>}
            </div>

            {submitError && (
              <div className="contact-submit-error">
                {submitError}
              </div>
            )}

            <div className="contact-form__actions">
              <button
                type="submit"
                className="contact-form__button"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader size={17} className="contact-spinner" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={17} /> Send Request
                  </>
                )}
              </button>
              <p className="contact-form__note">Your information remains confidential.</p>
            </div>
          </form>
        </div>

        <div className="contact-map">
          <div className="contact-map__header">
            <h3>Headquarter</h3>
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
              <span className="contact-map__label">Address HQ :</span>
              <span className="contact-map__value">Tunis, Centre Urbain Nord TN</span>
            </div>
            <div>
              <span className="contact-map__label">Phone :</span>
              <span className="contact-map__value">+216 36 214 357</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
