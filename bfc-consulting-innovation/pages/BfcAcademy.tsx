import React, { useEffect, useState, useRef } from 'react';
import { Star } from 'lucide-react';
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import bfcLogo from '../src/assets/bfc.png';
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

function mapApiCourseToCourseItem(c: ApiCourse): CourseItem {
  return {
    id: c.id,
    title: c.title,
    institution: c.institution || '',
    country: c.country || '',
    year: c.year || '',
    category: c.category || '',
    topics: c.topics || '',
    imageUrl: getUploadUrl(c.logo) || FALLBACK_LOGO,
    isAccredited: c.isAccredited ?? false,
    programs: c.programs || '',
    accreditation: c.accreditation || '',
    intake: c.intake || '',
    description: c.description || '',
    certificationDescription: c.certificationDescription || '',
    brochureUrl: c.brochureUrl || '',
    intro: c.intro || '',
    participants: c.participants || '',
    duration: c.duration || '',
    location: c.location || '',
    price: (c as any).price || '',
    language: c.language || '',
    relatedTopics: (c.topics || '').split(',').map(t => t.trim()).filter(Boolean),
    learnPoints: c.learnPoints || [],
    contentSections: (c as any).contentSections || [],
    journeySteps: c.journeySteps || [],
  };
}

function mapApiCourseToCertItem(c: ApiCourse): CertItem {
  return {
    id: String(c.id),
    title: c.title,
    location: c.location || '',
    programs: c.programs || '',
    accreditation: c.accreditation || '',
    intake: c.intake || '',
    description: c.description || '',
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
            <span className="certificate-info-label">Programs</span>
            <span className="certificate-info-value">{item.programs}</span>
          </div>
          <div>
            <span className="certificate-info-label">Accreditation</span>
            <span className="certificate-info-value">{item.accreditation}</span>
          </div>
        </div>

        <div className="certificate-actions">
          <button
            className="btn-primary"
            onClick={() => navigate('/enroll', { state: { courseTitle: item.title } })}
          >
            ENROLL NOW
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
              LEARN MORE
            </Link>
          ) : (
            <button className="btn-outline" disabled>LEARN MORE</button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Component ──
export const BfcAcademy: React.FC = () => {
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
        setError('Unable to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Derived data
  const intlCourses = courses.filter(c => c.category === 'International Courses');
  const certData: CertItem[] = intlCourses.map(mapApiCourseToCertItem);
  const courseCatalog: CourseItem[] = courses.map(mapApiCourseToCourseItem);

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
              BFC International Academy: <br />Your Partner in Excellence
            </h1>
            <p className="hero-desc">
              Elevate your professional expertise with our world-class certification programs 
              and strategic consulting courses. Accredited by leading global institutions.
            </p>
            <button className="hero-btn" onClick={() => document.getElementById('international-courses')?.scrollIntoView({ behavior: 'smooth' })}>
              EXPLORE OUR COURSES
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
                  <span className="intl-title-main">INTERNATIONAL</span>
                  <span className="intl-title-stroke">CERTIFICATIONS</span>
                </h2>
                <p className="intl-title-desc">
                  Gain global recognition through our prestigious partnerships with world-leading institutions.
                </p>
              </div>
            </div>

            <div className="international-right">
              {loading ? (
                <div className="intl-loading">Loading certifications…</div>
              ) : error ? (
                <div className="intl-error">{error}</div>
              ) : certData.length === 0 ? (
                <div className="intl-empty">No international certifications available yet.</div>
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
            <span>our </span>
            <span className="pw-intro__title-stroke">courses</span>
          </h2>
          <div className="formations-title-strip">
            <div className="formations-title-line" />
            <p className="formations-title-label">
              BFC GROUP Catalogue 2026
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
              <div className="category-item category-item--disabled">Loading…</div>
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
                <div className="formations-loading">Loading courses…</div>
              ) : error ? (
                <div className="formations-error">{error}</div>
              ) : pageItems.length === 0 ? (
                <div className="formations-empty">
                  {filterCategory !== 'All'
                    ? `No courses found in "${filterCategory}".`
                    : 'No courses available yet.'}
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
                          <span className="label">Programs</span>
                          <span className="value">{c.programs}</span>
                        </div>
                        <div className="info-item" role="listitem">
                          <span className="label">Accreditation</span>
                          <span className="value">{c.accreditation}</span>
                        </div>
                      </div>
                      <div className="course-card__actions">
                        <button
                          className="btn-primary"
                          onClick={() => navigate('/enroll', { state: { courseTitle: c.title } })}
                        >
                          Enroll Now
                        </button>
                        <Link
                          to={`/course/${encodeURIComponent(c.title)}`}
                          className="btn-outline"
                          state={{
                            from: '/standard-training',
                            course: { ...c },
                          }}
                        >
                          Learn More
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
                  Prev
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
                  Next
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
