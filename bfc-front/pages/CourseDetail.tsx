import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  BadgeCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  FileText,
  Globe,
  Star,
  Trophy,
  UsersRound,
} from 'lucide-react';
import ici from '../src/assets/certif/ici.png';
import irm from '../src/assets/certif/IRM.png';
import bfcLogo from '../src/assets/bfc.png';
import { useT, useLanguage, localizedField } from '../src/i18n';
import './CourseDetail.css';

const getUploadUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://localhost:8085${path}`;
};

/** Parses a JSON list column (learnPointsFr/Ar, journeyStepsFr/Ar). */
const localizedJsonList = <T,>(item: any, field: string, lang: string, fallback: T[]): T[] => {
  const suffix = lang === 'fr' ? 'Fr' : lang === 'ar' ? 'Ar' : '';
  const raw = suffix ? item?.[field + suffix] : null;
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as T[];
    } catch { /* fall through */ }
  }
  if (suffix) return fallback;
  return Array.isArray(item?.[field]) ? item[field] : fallback;
};

const CourseDetail: React.FC = () => {
  const t = useT();
  const { lang } = useLanguage();

  // Fallback copy used when the API provides no certification description.
  // (Module-level originally; moved inside so its strings can be translated.)
  const getDefaultCertificationDescription = (courseTitle: string, institution: string) => {
    if (/institute of risk management|irm/i.test(institution)) {
      return t('course.certDescIrm');
    }
    if (/internal control institute|ici/i.test(institution)) {
      return t('course.certDescIci');
    }
    return t('course.certDescPath', { courseTitle });
  };

  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stateCourse = (location.state as any)?.course;
  const fromPath = (location.state as any)?.from;
  const title = localizedField(stateCourse, 'title', lang)
    || (params.title ? decodeURIComponent(params.title) : t('course.defaultTitle'));
  const institution = localizedField(stateCourse, 'institution', lang) || 'Internal Control Institute (ICI)';
  const description =
    localizedField(stateCourse, 'description', lang) ||
    t('course.descriptionFallback');
  const programs = localizedField(stateCourse, 'programs', lang) || t('course.programsFallback');
  const accreditation = localizedField(stateCourse, 'accreditation', lang) || 'ICI / BFC';
  const intake = stateCourse?.intake || t('course.intakeFallback');
  const language = stateCourse?.language || t('course.languageFallback');
  const certificationDescription =
    localizedField(stateCourse, 'certificationDescription', lang) || getDefaultCertificationDescription(title, institution);
  const brochureUrl = stateCourse?.brochureUrl || '/pdfs/team-member-cv.pdf';

  const previewLogo = stateCourse?.logo ? getUploadUrl(stateCourse.logo) : (/risk management|irm/i.test(institution) ? irm : /internal control|ici/i.test(institution) ? ici : bfcLogo);

  const introText = localizedField(stateCourse, 'intro', lang) || 
    t('course.introFallback');

  const fallbackLearnPoints = [
    t('course.learnPoint1'),
    t('course.learnPoint2'),
    t('course.learnPoint3'),
    t('course.learnPoint4'),
    t('course.learnPoint5'),
  ];
  const learnPoints = localizedJsonList<string>(
    stateCourse,
    'learnPoints',
    lang,
    stateCourse?.learnPoints?.length ? stateCourse.learnPoints : fallbackLearnPoints
  );

  const participants = localizedField(stateCourse, 'participants', lang) || t('course.participantsFallback');
  const duration = localizedField(stateCourse, 'duration', lang) || programs;
  const locationInfo = localizedField(stateCourse, 'location', lang) || t('course.locationFallback');

  const includes = [
    { icon: BadgeCheck, text: t('course.includesBranding') },
    { icon: FileText, text: t('course.includesPractice') },
  
    { icon: Trophy, text: t('course.includesCertificate') },
  ];

  const suggestedCourses = [
    { id: 1, title: t('course.suggestedRiskTitle'), rating: 4.8, students: 1204, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80' },
    { id: 2, title: t('course.suggestedGovernanceTitle'), rating: 4.9, students: 890, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80' },
    { id: 3, title: t('course.suggestedAuditTitle'), rating: 4.7, students: 2310, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80' },
  ];

  const journeySteps = localizedJsonList<{ title: string; detail: string }>(
    stateCourse,
    'journeySteps',
    lang,
    stateCourse?.journeySteps?.length ? stateCourse.journeySteps : [
      { title: t('course.journey1Title'), detail: t('course.journey1Detail') },
      { title: t('course.journey2Title'), detail: t('course.journey2Detail') },
      { title: t('course.journey3Title'), detail: t('course.journey3Detail') },
      { title: t('course.journey4Title'), detail: t('course.journey4Detail') },
    ]
  );

  const [previewHeight, setPreviewHeight] = useState(190);
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(0);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/standard-training');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const next = Math.max(0, 190 - y);
      setPreviewHeight(next);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="ud-page">
      <section className="ud-hero">
        <div className="ud-shell ud-hero-grid">
          <div className="ud-left">
            
            <div className="ud-hero-topline">
              <div className="ud-badges">
                <button type="button" className="ud-back" onClick={handleBack}>
              <ChevronLeft size={16} /> {t('course.back')}
            </button>
                <span className="ud-pill">{t('course.bestseller')}</span>
              </div>
              <div className="ud-mobile-course-thumb" aria-hidden="true">
                <img src={previewLogo} alt="" className="ud-mobile-course-thumb-img" />
              </div>
            </div>
            <h1 className="ud-title">{title}</h1>
            <p className="ud-subtitle">{description}</p>
            <p className="ud-author">{t('course.createdBy')}{' '}<strong>{institution}</strong></p>
            <div className="ud-meta-line">
              <span><Globe size={16} /> {language}</span>
              <span><BadgeCheck size={16} /> {accreditation}</span>
              <span><UsersRound size={16} /> {institution}</span>
            </div>
          </div>

          <aside className="ud-card-wrap">
            <article className="ud-card">
              <div className="ud-preview" style={{ height: `${previewHeight}px` }}>
                <img src={previewLogo} alt={t('course.logoAlt', { institution })} className="ud-preview-img" />
               
              </div>
              <div className="ud-card-body">
                <button
                  type="button"
                  className="ud-btn ud-btn-primary"
                  onClick={() => navigate('/enroll', { state: { courseTitle: title } })}
                >
                  {t('course.enrollNow')}
                </button>
                <a
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ud-btn ud-btn-outline"
                >
                  <FileText size={18} /> {t('course.getBrochure')}
                </a>
                <h4>{t('course.includesTitle')}</h4>
                <ul className="ud-includes">
                  {includes.map((item) => (
                    <li key={item.text}>
                      <item.icon size={16} /> {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </aside>
        </div>
      </section>

      <main className="ud-content">
        <div className="ud-shell ud-content-grid">
          <div className="ud-main">
            <section className="ud-box ud-course-intro">
              <h2>{t('course.aboutTitle')}</h2>
              <p>{introText}</p>
            </section>

            <section className="ud-box ud-certification-box">
              <h2>{t('course.certificationTitle')}</h2>
              <p>{certificationDescription}</p>
            </section>

            <section className="ud-box">
              <h2>{t('course.factsTitle')}</h2>
              <p><strong>{t('course.participantsLabel')}</strong> {participants}</p>
              <p><strong>{t('course.durationLabel')}</strong> {duration}</p>
            </section>

            <section className="ud-box ud-learn-box">
              <h2>{t('course.whatYouLearn')}</h2>
              <ul className="ud-learn-grid">
                {learnPoints.map((point: string) => (
                  <li key={point}>
                    <div className="ud-learn-icon"><Check size={18} /></div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>


            <section className="ud-box ud-content-list">
              <div className="ud-content-head">
                <h3>{t('course.journey')}</h3>
                <p>{t('course.journeyDays', { count: journeySteps.length })} • {programs}</p>
              </div>
              {journeySteps.map((step: any, index: number) => {
                const isActive = activeJourneyIndex === index;
                return (
                  <div key={step.title} className="ud-content-row-wrap">
                    <button
                      type="button"
                      className={`ud-content-row${isActive ? ' is-active' : ''}`}
                      onClick={() => setActiveJourneyIndex(index)}
                      aria-pressed={isActive}
                      aria-expanded={isActive}
                    >
                      <span className="ud-content-row-left">
                        <ChevronDown size={16} /> {step.title}
                      </span>
                    </button>

                    {isActive && (
                      <div key={index} className="ud-content-row-panel">
                        <p>{step.detail}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
            
{/* Related topics hidden for now */}

            
          </div>

          <div className="ud-right-spacer" aria-hidden="true" />
        </div>
      </main>

      <div className="ud-mobile-actions" aria-label={t('course.actionsLabel')}>
        <button
          type="button"
          className="ud-btn ud-btn-primary"
          onClick={() => navigate('/enroll', { state: { courseTitle: title } })}
        >
          {t('course.enrollNow')}
        </button>
        <a
          href={brochureUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ud-btn ud-btn-outline"
        >
          <FileText size={18} /> {t('course.getBrochure')}
        </a>
      </div>
    </div>
  );
};

export default CourseDetail;

