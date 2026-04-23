import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, ChevronDown } from 'lucide-react';
import './EnrollmentForm.css';

const ALL_COURSES = [
  'Fundamentals of Risk Management (FoRM)',
  'Certified Internal Control Specialist (CICS)',
  'Innovation Workshop: Designing Innovation',
  'Generative AI for Audit and Internal Control',
];

const COUNTRIES = [
  'Tunisia', 'Algeria', 'Morocco', 'Libya', 'Egypt', 'Mauritania', 'Senegal',
  'Mali', 'Ivory Coast', 'Cameroon', 'Congo', 'Guinea', 'France', 'Belgium',
  'United Arab Emirates', 'Qatar', 'Saudi Arabia', 'Other',
];

interface FormState {
  fullName: string;
  email: string;
  country: string;
  phone: string;
  jobTitle: string;
  organization: string;
  courses: string[];
  message: string;
}

const EMPTY: FormState = {
  fullName: '',
  email: '',
  country: '',
  phone: '',
  jobTitle: '',
  organization: '',
  courses: [],
  message: '',
};

const EnrollmentForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preselected: string | undefined = (location.state as any)?.courseTitle;

  const [form, setForm] = useState<FormState>({
    ...EMPTY,
    courses: preselected ? [preselected] : [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleCourse = (title: string) => {
    setForm((prev) => ({
      ...prev,
      courses: prev.courses.includes(title)
        ? prev.courses.filter((c) => c !== title)
        : [...prev.courses, title],
    }));
    setErrors((prev) => ({ ...prev, courses: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'A valid email address is required.';
    if (!form.country) next.country = 'Please select your country.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (!form.jobTitle.trim()) next.jobTitle = 'Job title is required.';
    if (!form.organization.trim()) next.organization = 'Organization / employer is required.';
    if (form.courses.length === 0) next.courses = 'Please select at least one course.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // In production: POST to an API endpoint here.
    setSubmitted(true);
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/standard-training');
  };

  if (submitted) {
    return (
      <div className="enroll-page">
        <div className="enroll-shell">
          <div className="enroll-success">
            <div className="enroll-success__icon">✓</div>
            <h2>Enrollment Request Received</h2>
            <p>
              Thank you, <strong>{form.fullName}</strong>. Our team will contact you at{' '}
              <strong>{form.email}</strong> to confirm your enrollment and share next steps.
            </p>
            <button type="button" className="enroll-btn enroll-btn--primary" onClick={() => navigate('/standard-training')}>
              Back to Academy
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enroll-page">
      <div className="enroll-hero">
        <div className="enroll-shell">
          <button type="button" className="enroll-back" onClick={handleBack}>
            <ChevronLeft size={16} /> Back
          </button>
          <h1 className="enroll-hero__title">Course Enrollment</h1>
          <p className="enroll-hero__sub">
            Fill in your details below and our team will reach out to confirm your place.
          </p>
        </div>
      </div>

      <div className="enroll-shell enroll-body">
        <form className="enroll-form" onSubmit={handleSubmit} noValidate>

          {/* ── Personal info ── */}
          <fieldset className="enroll-fieldset">
            <legend className="enroll-legend">Personal Information</legend>
            <div className="enroll-row enroll-row--2">
              <div className="enroll-group">
                <label htmlFor="ef-name" className="enroll-label">Full Name *</label>
                <input
                  id="ef-name"
                  type="text"
                  className={`enroll-input${errors.fullName ? ' is-error' : ''}`}
                  placeholder="e.g. Majd Ayedi"
                  value={form.fullName}
                  onChange={set('fullName')}
                  autoComplete="name"
                />
                {errors.fullName && <span className="enroll-error">{errors.fullName}</span>}
              </div>

              <div className="enroll-group">
                <label htmlFor="ef-email" className="enroll-label">Email Address *</label>
                <input
                  id="ef-email"
                  type="email"
                  className={`enroll-input${errors.email ? ' is-error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                />
                {errors.email && <span className="enroll-error">{errors.email}</span>}
              </div>
            </div>

            <div className="enroll-row enroll-row--2">
              <div className="enroll-group">
                <label htmlFor="ef-country" className="enroll-label">Country *</label>
                <div className="enroll-select-wrap">
                  <select
                    id="ef-country"
                    className={`enroll-select${errors.country ? ' is-error' : ''}`}
                    value={form.country}
                    onChange={set('country')}
                  >
                    <option value="" disabled>Select your country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="enroll-select-icon" />
                </div>
                {errors.country && <span className="enroll-error">{errors.country}</span>}
              </div>

              <div className="enroll-group">
                <label htmlFor="ef-phone" className="enroll-label">Phone Number *</label>
                <input
                  id="ef-phone"
                  type="tel"
                  className={`enroll-input${errors.phone ? ' is-error' : ''}`}
                  placeholder="+216 XX XXX XXX"
                  value={form.phone}
                  onChange={set('phone')}
                  autoComplete="tel"
                />
                {errors.phone && <span className="enroll-error">{errors.phone}</span>}
              </div>
            </div>
          </fieldset>

          {/* ── Professional info ── */}
          <fieldset className="enroll-fieldset">
            <legend className="enroll-legend">Professional Background</legend>
            <div className="enroll-row enroll-row--2">
              <div className="enroll-group">
                <label htmlFor="ef-job" className="enroll-label">Job Title / Role *</label>
                <input
                  id="ef-job"
                  type="text"
                  className={`enroll-input${errors.jobTitle ? ' is-error' : ''}`}
                  placeholder="e.g. Internal Auditor"
                  value={form.jobTitle}
                  onChange={set('jobTitle')}
                />
                {errors.jobTitle && <span className="enroll-error">{errors.jobTitle}</span>}
              </div>

              <div className="enroll-group">
                <label htmlFor="ef-org" className="enroll-label">Organization / Employer *</label>
                <input
                  id="ef-org"
                  type="text"
                  className={`enroll-input${errors.organization ? ' is-error' : ''}`}
                  placeholder="e.g. Ministry of Finance"
                  value={form.organization}
                  onChange={set('organization')}
                />
                {errors.organization && <span className="enroll-error">{errors.organization}</span>}
              </div>
            </div>
          </fieldset>

          {/* ── Course selection ── */}
          <fieldset className="enroll-fieldset">
            <legend className="enroll-legend">Course Selection *</legend>
            {errors.courses && <span className="enroll-error enroll-error--top">{errors.courses}</span>}
            <ul className="enroll-course-list">
              {ALL_COURSES.map((title) => {
                const checked = form.courses.includes(title);
                return (
                  <li key={title}>
                    <label className={`enroll-course-item${checked ? ' is-checked' : ''}`}>
                      <input
                        type="checkbox"
                        className="enroll-course-checkbox"
                        checked={checked}
                        onChange={() => toggleCourse(title)}
                      />
                      <span className="enroll-course-check-box" aria-hidden="true">
                        {checked && '✓'}
                      </span>
                      <span className="enroll-course-label">{title}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>

          {/* ── Optional message ── */}
          <fieldset className="enroll-fieldset">
            <legend className="enroll-legend">Additional Message <span className="enroll-optional">(optional)</span></legend>
            <div className="enroll-group">
              <textarea
                id="ef-msg"
                className="enroll-textarea"
                rows={4}
                placeholder="Any questions, special requirements, or notes for the BFC team…"
                value={form.message}
                onChange={set('message')}
              />
            </div>
          </fieldset>

          <div className="enroll-actions">
            <button type="submit" className="enroll-btn enroll-btn--primary">
              <Send size={17} /> Submit Enrollment
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;
