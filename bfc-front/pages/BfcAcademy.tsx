import React, { useEffect, useState, useRef } from 'react';
import { Star } from 'lucide-react';
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import bfcLogo from '../src/assets/bfc.png';
import { useT, useLanguage, localizedField } from '../src/i18n';
import './BfcAcademy.css';

const getUploadUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) return `${API_URL}${url}`;
  return url;
};

const FALLBACK_LOGO = bfcLogo;

// ── Types ──
interface CertItem {
  id: string;
  title: string;
  location: string;
  programs: string;
  accreditation: string;
  intake: string;
  description: string;
  imageUrl: string;
}

interface CourseItem {
  id: number;
  title: string;
  institution: string;
  country: string;
  year: string;
  category: string;
  topics: string;
  imageUrl: string;
  isAccredited: boolean;
  programs: string;
  accreditation: string;
  intake: string;
  description: string;
  certificationDescription: string;
  brochureUrl: string;
  intro: string;
  participants: string;
  duration: string;
  location: string;
  price: string;
  language: string;
  relatedTopics: string[];
  learnPoints: string[];
  contentSections: { title: string; lectures: number; duration: string }[];
  journeySteps: { title: string; detail: string }[];
}

interface ApiCourse {
  id: number;
  title: string;
  institution: string;
  country: string;
  year: string;
  category: string;
  topics: string;
  logo: string | null;
  isAccredited: boolean;
  programs: string;
  accreditation: string;
  intake: string;
  description: string;
  certificationDescription: string;
  brochureUrl: string;
  intro: string;
  participants: string;
  duration: string;
  location: string;
  price: string;
  language: string;
  learnPoints: string[];
  journeySteps: { title: string; detail: string }[];
}

/** Parses a JSON list column (titleFr/titleAr style) with a safe fallback. */
function localizedJsonList<T>(item: any, field: string, lang: string, fallback: T[]): T[] {
  const suffix = lang === 'fr' ? 'Fr' : lang === 'ar' ? 'Ar' : '';
  const raw = suffix ? item?.[field + suffix] : null;
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as T[];
    } catch { /* fall through to the base list */ }
  }
  if (suffix) return fallback;
  return Array.isArray(item?.[field]) ? item[field] : fallback;
}

function mapApiCourseToCourseItem(c: ApiCourse, lang: string): CourseItem {
  const baseLearnPoints: string[] = c.learnPoints || [];
  const baseJourneySteps: { title: string; detail: string }[] = c.journeySteps || [];
  return {
    id: c.id,
    title: localizedField(c as any, 'title', lang),
    institution: localizedField(c as any, 'institution', lang),
    country: c.country || '',
    year: c.year || '',
    category: c.category || '',
    topics: c.topics || '',
    imageUrl: getUploadUrl(c.logo) || FALLBACK_LOGO,
    isAccredited: c.isAccredited ?? false,
    programs: localizedField(c as any, 'programs', lang),
    accreditation: localizedField(c as any, 'accreditation', lang),
    intake: c.intake || '',
    description: localizedField(c as any, 'description', lang),
    certificationDescription: localizedField(c as any, 'certificationDescription', lang),
    brochureUrl: c.brochureUrl || '',
    intro: localizedField(c as any, 'intro', lang),
    participants: localizedField(c as any, 'participants', lang),
    duration: localizedField(c as any, 'duration', lang),
    location: localizedField(c as any, 'location', lang),
    price: (c as any).price || '',
    language: c.language || '',
    relatedTopics: (c.topics || '').split(',').map(t => t.trim()).filter(Boolean),
    learnPoints: localizedJsonList<string>(c, 'learnPoints', lang, baseLearnPoints),
    contentSections: (c as any).contentSections || [],
    journeySteps: localizedJsonList<{ title: string; detail: string }>(c, 'journeySteps', lang, baseJourneySteps),
  };
}

function mapApiCourseToCertItem(c: ApiCourse, lang: string): CertItem {
  return {
    id: String(c.id),
    title: localizedField(c as any, 'title', lang),
    location: localizedField(c as any, 'location', lang),
    programs: localizedField(c as any, 'programs', lang),
    accreditation: localizedField(c as any, 'accreditation', lang),
    intake: c.intake || '',
    description: localizedField(c as any, 'description', lang),
    imageUrl: getUploadUrl(c.logo) || FALLBACK_LOGO,
  };
}

// ── CertificateCard (sticky stacking animation) ──
function CertificateCard({ item, index, total, linkedCourse }: { 
  item: CertItem; 
  index: number; 
  total: number; 
  linkedCourse?: CourseItem | null;
  key?: string | number;
}) {
  const t = useT();
  const container = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - index) * 0.03]);

  return (
    <div ref={container} className="h-[70vh] flex items-start justify-center sticky top-32">
      <motion.div
        style={{ 
          scale,
          zIndex: index,
          top: `${index * 30}px` 
        }}
        className="certificate-card"
      >
        <span className="certificate-badge">
          <Star size={14} fill="#99cdb3" color="#99cdb3" />
        </span>
        
        <div className="certificate-header">
          <div className="certificate-icon">
            <img src={item.imageUrl} alt={item.title} className="certificate-photo" />
          </div>
          <div>
            <h3 className="certificate-title">
              {item.title}
            </h3>
            <p className="certificate-location">
              {item.location}
            </p>
          </div>
        </div>

        <p className="certificate-desc">
          {item.description}
        </p>

        <div className="certificate-info-grid">
          <div>
            <span className="certificate-info-label">{t('academy.programs')}</span>
            <span className="certificate-info-value">{item.programs}</span>
          </div>
          <div>
            <span className="certificate-info-label">{t('academy.accreditation')}</span>
            <span className="certificate-info-value">{item.accreditation}</span>
          </div>
        </div>

        <div className="certificate-actions">
          <button
            className="btn-primary"
            onClick={() => navigate('/enroll', { state: { courseTitle: item.title } })}
          >
            {t('academy.enrollNowCaps')}
          </button>
          {linkedCourse ? (
            <Link
              to={`/course/${encodeURIComponent(linkedCourse.title)}`}
              className="btn-outline"
              state={{
                from: '/standard-training',
                course: { ...linkedCourse },
              }}
            >
              {t('academy.learnMoreCaps')}
            </Link>
          ) : (
            <button className="btn-outline" disabled>{t('academy.learnMoreCaps')}</button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Component ──
export const BfcAcademy: React.FC = () => {
  const t = useT();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const heroWrapperRef = useRef(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end start"]
  });

  const heroWidth = useTransform(heroScrollProgress, [0, 0.8], ["100%", "94%"]);
  const heroPadding = useTransform(heroScrollProgress, [0, 0.8], ["0px", "40px"]);

  // ── Data state ──
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/courses/show`);
        if (!res.ok) throw new Error('Failed to load courses');
        const data: ApiCourse[] = await res.json();
        setCourses(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('academy.loadError');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Derived data
  const intlCourses = courses.filter(c => c.category === 'International Courses');
  const certData: CertItem[] = intlCourses.map(c => mapApiCourseToCertItem(c, lang));
  const courseCatalog: CourseItem[] = courses.map(c => mapApiCourseToCourseItem(c, lang));

  useEffect(() => {
    if (!document.querySelector('script[data-tailwind-cdn]')) {
      const s = document.createElement('script');
      s.src = 'https://cdn.tailwindcss.com';
      s.setAttribute('data-tailwind-cdn', '1');
      s.async = true;
      document.head.appendChild(s);
    }

    const loadLucide = () => {
      return new Promise<void>((resolve) => {
        if ((window as any).lucide) {
          resolve();
          return;
        }
        const l = document.createElement('script');
        l.src = 'https://unpkg.com/lucide@latest';
        l.async = true;
        l.onload = () => resolve();
        document.head.appendChild(l);
      });
    };

    let mounted = true;

    loadLucide().then(() => {
      if (!mounted) return;
      try { (window as any).lucide.createIcons(); } catch (e) { /* ignore */ }
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Filtering & pagination state
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const pageSize = 2; // 2x1 grid per page

  const categories = ['All', ...Array.from(new Set(courseCatalog.map((course) => course.category)))];

  const filtered =
    filterCategory === 'All'
      ? courseCatalog
      : courseCatalog.filter((course) => course.category === filterCategory);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if (page > totalPages) setPage(totalPages);
  const pageStart = (page - 1) * pageSize;
  const pageItems = filtered.slice(pageStart, pageStart + pageSize);

  const onSelectCategory = (cat: string) => {
    setFilterCategory(cat);
    setPage(1);
  };

  return (
    <div className="bfc-academy">
      <div className="hero-scroll-wrapper" ref={heroWrapperRef}>
        <div className="hero-sticky">
          <motion.div 
            id="hero-box" 
            className="hero-content"
            style={{
              width: heroWidth,
              paddingLeft: heroPadding, 
              paddingRight: heroPadding
            }}
          >
            <h1 className="hero-title">
              {t('academy.heroTitleLine1')}<br />{t('academy.heroTitleLine2')}
            </h1>
            <p className="hero-desc">
              {t('academy.heroDesc')}
            </p>
            <button className="hero-btn" onClick={() => document.getElementById('international-courses')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('academy.exploreCourses')}
            </button>
          </motion.div>
        </div>
      </div>

      <section id="international-courses" className="international-section">
        <div className="international-container">
          <div className="international-grid">
            <div className="international-left">
              <div className="intl-title-block">
                <h2 className="intl-title">
                  <span className="intl-title-main">{t('academy.internationalWord')}</span>
                  <span className="intl-title-stroke">{t('academy.certificationsWord')}</span>
                </h2>
                <p className="intl-title-desc">
                  {t('academy.intlDesc')}
                </p>
              </div>
            </div>

            <div className="international-right">
              {loading ? (
                <div className="intl-loading">{t('academy.loadingCertifications')}</div>
              ) : error ? (
                <div className="intl-error">{t(error)}</div>
              ) : certData.length === 0 ? (
                <div className="intl-empty">{t('academy.noCertifications')}</div>
              ) : (
                <div className="international-cards">
                  {certData.map((cert, index) => {
                    const linkedCourse = courseCatalog.find((course) => course.title === cert.title);
                    return (
                      <CertificateCard 
                        key={cert.id} 
                        item={cert} 
                        index={index} 
                        total={certData.length}
                        linkedCourse={linkedCourse}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="formations-title-section">
        <div className="formations-title-container">
          <h2 className="pw-intro__title">
            <span>{t('academy.ourCoursesLead')}</span>
            <span className="pw-intro__title-stroke">{t('academy.ourCoursesAccent')}</span>
          </h2>
          <div className="formations-title-strip">
            <div className="formations-title-line" />
            <p className="formations-title-label">
              {t('academy.catalogueLabel')}
            </p>
            <div className="formations-title-line" />
          </div>
        </div>
      </section>

      <section className="formations-list-section">
        <div className="formations-list-container">
          <div className="formations-list-grid">
          <aside className="filters-aside">
            {loading ? (
              <div className="category-item category-item--disabled">{t('academy.loading')}</div>
            ) : (
              categories.filter((cat) => cat !== 'All').map((cat) => (
                <div
                  key={cat}
                  className={`category-item${filterCategory === cat ? ' active' : ''}`}
                  onClick={() => onSelectCategory(cat)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onSelectCategory(cat)}
                  aria-pressed={filterCategory === cat}
                >
                  {cat}
                </div>
              ))
            )}
          </aside>
          <main className="formations-list-main">

            <div className="list-wrapper no-scrollbar">
              {loading ? (
                <div className="formations-loading">{t('academy.loadingCourses')}</div>
              ) : error ? (
                <div className="formations-error">{t(error)}</div>
              ) : pageItems.length === 0 ? (
                <div className="formations-empty">
                  {filterCategory !== 'All'
                    ? t('academy.noCoursesIn', { category: filterCategory })
                    : t('academy.noCourses')}
                </div>
              ) : (
                <div className="formations-list-grid-inner">
                {pageItems.map((c) => {
                  return (
                    <div key={c.id} className="course-card rectangular">
                      {c.isAccredited && (
                        <span className="accredited-badge">
                          <Star size={12} fill="#99cdb3" color="#99cdb3" />
                        </span>
                      )}
                      <div className="course-card__top-row">
                        <div className="course-card__image-container">
                          <img src={c.imageUrl} alt={c.title} className="course-card__photo" />
                        </div>
                        <div className="course-card__title-block">
                          <h5 className="course-card__title">{c.title}</h5>
                          <div className="course-card__meta">{c.institution} • {c.country}</div>
                        </div>
                      </div>
                      <div className="course-card__desc">
                        {c.description}
                      </div>
                      <div className="info-strip" role="list">
                        <div className="info-item" role="listitem">
                          <span className="label">{t('academy.programs')}</span>
                          <span className="value">{c.programs}</span>
                        </div>
                        <div className="info-item" role="listitem">
                          <span className="label">{t('academy.accreditation')}</span>
                          <span className="value">{c.accreditation}</span>
                        </div>
                      </div>
                      <div className="course-card__actions">
                        <button
                          className="btn-primary"
                          onClick={() => navigate('/enroll', { state: { courseTitle: c.title } })}
                        >
                          {t('academy.enrollNow')}
                        </button>
                        <Link
                          to={`/course/${encodeURIComponent(c.title)}`}
                          className="btn-outline"
                          state={{
                            from: '/standard-training',
                            course: { ...c },
                          }}
                        >
                          {t('academy.learnMore')}
                        </Link>
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>

            {!loading && !error && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  className="px-3 py-2 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  {t('academy.prev')}
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={`px-3 py-2 border rounded text-sm transition-colors ${page === idx + 1 ? 'bg-[#1a365d] border-[#1a365d] text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  className="px-3 py-2 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  {t('academy.next')}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      </section>

    </div>
  );
};

export default BfcAcademy;
