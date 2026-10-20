import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, ChevronDown, Loader } from 'lucide-react';
import { API_URL } from '../utils/constants';
import { useT, useLanguage, localizedField } from '../src/i18n';
import './EnrollmentForm.css';

// Country picker: `value` stays the canonical English name (it is submitted to
// the API), while the visible label is translated at render time.
const COUNTRIES: { value: string; labelKey: string }[] = [
  { value: 'Tunisia', labelKey: 'enroll.country.tunisia' },
  { value: 'Algeria', labelKey: 'enroll.country.algeria' },
  { value: 'Morocco', labelKey: 'enroll.country.morocco' },
  { value: 'Libya', labelKey: 'enroll.country.libya' },
  { value: 'Egypt', labelKey: 'enroll.country.egypt' },
  { value: 'Mauritania', labelKey: 'enroll.country.mauritania' },
  { value: 'Senegal', labelKey: 'enroll.country.senegal' },
  { value: 'Mali', labelKey: 'enroll.country.mali' },
  { value: 'Ivory Coast', labelKey: 'enroll.country.ivoryCoast' },
  { value: 'Cameroon', labelKey: 'enroll.country.cameroon' },
  { value: 'Congo', labelKey: 'enroll.country.congo' },
  { value: 'Guinea', labelKey: 'enroll.country.guinea' },
  { value: 'France', labelKey: 'enroll.country.france' },
  { value: 'Belgium', labelKey: 'enroll.country.belgium' },
  { value: 'United Arab Emirates', labelKey: 'enroll.country.uae' },
  { value: 'Qatar', labelKey: 'enroll.country.qatar' },
  { value: 'Saudi Arabia', labelKey: 'enroll.country.saudiArabia' },
  { value: 'Other', labelKey: 'enroll.country.other' },
];

interface Course {
  id: number;
  title: string;
  institution: string;
  titleFr?: string | null;
  titleAr?: string | null;
  institutionFr?: string | null;
  institutionAr?: string | null;
}

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
  const t = useT();
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const preselected: string | undefined = (location.state as any)?.courseTitle;

  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    ...EMPTY,
    courses: preselected ? [preselected] : [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Fetch courses from backend API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const res = await fetch(`${API_URL}/api/courses/show`);
        if (!res.ok) throw new Error('Failed to load courses');
        const data: Course[] = await res.json();
        setCourses(data);
        setCoursesError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setCoursesError('enroll.coursesError');
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

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
    if (!form.fullName.trim()) next.fullName = 'enroll.errorFullName';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'enroll.errorEmail';
    if (!form.country) next.country = 'enroll.errorCountry';
    if (!form.phone.trim()) next.phone = 'enroll.errorPhone';
    if (!form.jobTitle.trim()) next.jobTitle = 'enroll.errorJobTitle';
    if (!form.organization.trim()) next.organization = 'enroll.errorOrganization';
    if (form.courses.length === 0) next.courses = 'enroll.errorCourses';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_URL}/api/enrollments/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          country: form.country,
          phone: form.phone,
          jobTitle: form.jobTitle,
          organization: form.organization,
          courses: form.courses,
          message: form.message,
        }),
      });

      if (!res.ok) throw new Error('enroll.submitFailed');

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting enrollment:', err);
      setSubmitError(
        err instanceof Error ? err.message : 'enroll.unexpectedError'
      );
    } finally {
      setSubmitting(false);
    }
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
            <h2>{t('enroll.successTitle')}</h2>
            <p>
              {t('enroll.successThanks')}{' '}
              <strong>{form.fullName}</strong>
              {t('enroll.successContact')}{' '}
              <strong>{form.email}</strong>{' '}
              {t('enroll.successNextSteps')}
            </p>
            <button type="button" className="enroll-btn enroll-btn--primary" onClick={() => navigate('/standard-training')}>
              {t('enroll.backToAcademy')}
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
            <ChevronLeft size={16} /> {t('enroll.back')}
          </button>
          <h1 className="enroll-hero__title">{t('enroll.title')}</h1>
          <p className="enroll-hero__sub">
            {t('enroll.subtitle')}
          </p>
        </div>
      </div>

      <div className="enroll-shell enroll-body">
        <form className="enroll-form" onSubmit={handleSubmit} noValidate>

          {/* ── Personal info ── */}
          <fieldset className="enroll-fieldset">
            <legend className="enroll-legend">{t('enroll.personalInfo')}</legend>
            <div className="enroll-row enroll-row--2">
              <div className="enroll-group">
                <label htmlFor="ef-name" className="enroll-label">{t('enroll.fullNameLabel')}</label>
                <input
                  id="ef-name"
                  type="text"
                  className={`enroll-input${errors.fullName ? ' is-error' : ''}`}
                  placeholder={t('enroll.fullNamePlaceholder')}
                  value={form.fullName}
                  onChange={set('fullName')}
                  autoComplete="name"
                />
                {errors.fullName && <span className="enroll-error">{t(errors.fullName)}</span>}
              </div>

              <div className="enroll-group">
                <label htmlFor="ef-email" className="enroll-label">{t('enroll.emailLabel')}</label>
                <input
                  id="ef-email"
                  type="email"
                  className={`enroll-input${errors.email ? ' is-error' : ''}`}
                  placeholder={t('enroll.emailPlaceholder')}
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                />
                {errors.email && <span className="enroll-error">{t(errors.email)}</span>}
              </div>
            </div>

            <div className="enroll-row enroll-row--2">
              <div className="enroll-group">
                <label htmlFor="ef-country" className="enroll-label">{t('enroll.countryLabel')}</label>
                <div className="enroll-select-wrap">
                  <select
                    id="ef-country"
                    className={`enroll-select${errors.country ? ' is-error' : ''}`}
                    value={form.country}
                    onChange={set('country')}
                  >
                    <option value="" disabled>{t('enroll.selectCountry')}</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>{t(c.labelKey)}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="enroll-select-icon" />
                </div>
                {errors.country && <span className="enroll-error">{t(errors.country)}</span>}
              </div>

              <div className="enroll-group">
                <label htmlFor="ef-phone" className="enroll-label">{t('enroll.phoneLabel')}</label>
                <input
                  id="ef-phone"
                  type="tel"
                  className={`enroll-input${errors.phone ? ' is-error' : ''}`}
                  placeholder={t('enroll.phonePlaceholder')}
                  value={form.phone}
                  onChange={set('phone')}
                  autoComplete="tel"
                />
                {errors.phone && <span className="enroll-error">{t(errors.phone)}</span>}
              </div>
            </div>
          </fieldset>

          {/* ── Professional info ── */}
          <fieldset className="enroll-fieldset">
            <legend className="enroll-legend">{t('enroll.professionalBackground')}</legend>
            <div className="enroll-row enroll-row--2">
              <div className="enroll-group">
                <label htmlFor="ef-job" className="enroll-label">{t('enroll.jobTitleLabel')}</label>
                <input
                  id="ef-job"
                  type="text"
                  className={`enroll-input${errors.jobTitle ? ' is-error' : ''}`}
                  placeholder={t('enroll.jobTitlePlaceholder')}
                  value={form.jobTitle}
                  onChange={set('jobTitle')}
                />
                {errors.jobTitle && <span className="enroll-error">{t(errors.jobTitle)}</span>}
              </div>

              <div className="enroll-group">
                <label htmlFor="ef-org" className="enroll-label">{t('enroll.orgLabel')}</label>
                <input
                  id="ef-org"
                  type="text"
                  className={`enroll-input${errors.organization ? ' is-error' : ''}`}
                  placeholder={t('enroll.orgPlaceholder')}
                  value={form.organization}
                  onChange={set('organization')}
                />
                {errors.organization && <span className="enroll-error">{t(errors.organization)}</span>}
              </div>
            </div>
          </fieldset>

          {/* ── Course selection ── */}
          <fieldset className="enroll-fieldset">
            <legend className="enroll-legend">{t('enroll.courseSelectionLabel')}</legend>
            {errors.courses && <span className="enroll-error enroll-error--top">{t(errors.courses)}</span>}

            {coursesLoading ? (
              <div className="enroll-loading-courses">
                <Loader size={20} className="enroll-spinner" />
                <span>{t('enroll.loadingCourses')}</span>
              </div>
            ) : coursesError ? (
              <div className="enroll-loading-courses enroll-error-message">
                <span>{t(coursesError)}</span>
              </div>
            ) : (
              <ul className="enroll-course-list">
                {courses.map((course) => {
                  const checked = form.courses.includes(course.title);
                  return (
                    <li key={course.id}>
                      <label className={`enroll-course-item${checked ? ' is-checked' : ''}`}>
                        <input
                          type="checkbox"
                          className="enroll-course-checkbox"
                          checked={checked}
                          onChange={() => toggleCourse(course.title)}
                        />
                        <span className="enroll-course-check-box" aria-hidden="true">
                          {checked && '✓'}
                        </span>
                        <span className="enroll-course-label">
                          {/* Display follows the site language; the stored value stays the English title. */}
                          {localizedField(course, 'title', lang)}
                          <span className="enroll-course-institution"> — {localizedField(course, 'institution', lang)}</span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </fieldset>

          {/* ── Optional message ── */}
          <fieldset className="enroll-fieldset">
            <legend className="enroll-legend">{t('enroll.messageLegend')} <span className="enroll-optional">{t('enroll.optional')}</span></legend>
            <div className="enroll-group">
              <textarea
                id="ef-msg"
                className="enroll-textarea"
                rows={4}
                placeholder={t('enroll.messagePlaceholder')}
                value={form.message}
                onChange={set('message')}
              />
            </div>
          </fieldset>

          {submitError && (
            <div className="enroll-submit-error">
              {t(submitError)}
            </div>
          )}

          <div className="enroll-actions">
            <button
              type="submit"
              className="enroll-btn enroll-btn--primary"
              disabled={submitting || coursesLoading}
            >
              {submitting ? (
                <>
                  <Loader size={17} className="enroll-spinner" />
                  {t('enroll.submitting')}
                </>
              ) : (
                <>
                  <Send size={17} /> {t('enroll.submit')}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;
