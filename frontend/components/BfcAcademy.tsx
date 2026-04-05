import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, ArrowUpRight, Star, Clock } from "lucide-react";
import { Link } from 'react-router-dom';
import ici from '../src/assets/certif/ici.png';
import irm from '../src/assets/certif/irm.png';
import GII from '../src/assets/certif/global_innovation_insititute.png';
import bfcLogo from '../src/assets/bfc.png';
import './BfcAcademy.css';

const certData = [
  {
    id: "01",
    title: "Institute of Risk Management",
    location: "London, UK",
    programs: "5+ Tracks",
    accreditation: "Global",
    intake: "Sept 2025",
    description: "The world's leading professional body for enterprise risk management. We provide qualifications, training, and resources to help you manage risk effectively.",
    imageUrl: irm
  },
  {
    id: "02",
    title: "Internal Control Institute",
    location: "Florida, USA",
    programs: "3+ Tracks",
    accreditation: "International",
    intake: "Oct 2025",
    description: "Focused on the design, implementation, and assessment of internal control systems. Our certifications are recognized by major regulatory bodies worldwide.",
    imageUrl: ici
  },
  {
    id: "03",
    title: "Information Systems Audit",
    location: "Global Reach",
    programs: "8+ Tracks",
    accreditation: "Industry Standard",
    intake: "Rolling",
    description: "Advanced certification for IT professionals specializing in audit, control, and security. Master the complexities of modern information systems.",
    imageUrl: GII
  }
];

interface TrainingReference {
  id: number;
  institution: string;
  country: string;
  year: string;
  course: string;
  mission?: string;
  location?: string;
  topics?: string;
}

const trainingReferences: TrainingReference[] = [
  {
    id: 1,
    institution: 'Internal Control Institute (ICI - USA)',
    country: 'Tunisia / Sub-Saharan Africa',
    year: 'From 2020',
    mission: 'Animation of certifying training in Internal Control.',
    course: 'Certified Internal Control Specialist (CICS).',
    location: 'Tunisia and Sub-Saharan Africa.',
  },
  {
    id: 2,
    institution: 'Institute of Risk Management (IRM - London)',
    country: 'Tunisia / Sub-Saharan Africa',
    year: 'From 2018',
    mission: 'Animation of certifying training in Risk Management.',
    course: 'Fundamentals of Risk Management.',
    location: 'Tunisia and Sub-Saharan Africa.',
  },
  {
    id: 3,
    institution: 'ARPT',
    country: 'Guinea',
    year: '2024',
    course: 'CICS - Intensive Workshop on Internal Control.',
    topics:
      'Evaluating control effectiveness; risk measurement; Sarbanes-Oxley impact; COSO framework application.',
  },
  {
    id: 4,
    institution: 'SONAPI',
    country: 'Guinea',
    year: '2024',
    course: 'CICS - Certification Program.',
    topics: 'Internal control intensive workshop; risk evaluation; corporate governance practices.',
  },
  {
    id: 5,
    institution: 'CCIN',
    country: 'Niger',
    year: '2024',
    course: 'CICS - Certification Program.',
    topics: 'Internal control effectiveness; COSO framework; governance review.',
  },
  {
    id: 6,
    institution: 'Business Advice & Assurance B2A',
    country: 'Tunisia',
    year: '2024',
    course: 'CICS - Certification Program.',
  },
  {
    id: 7,
    institution: 'INPS',
    country: 'Mali',
    year: '2024',
    course: 'CICS - Certification Program.',
  },
  {
    id: 8,
    institution: 'Islamic Bank of Niger',
    country: 'Niger',
    year: '2024',
    course: 'Fundamentals of Risk Management (COSO, IRM, ISO 31000).',
    topics: 'Risk mapping; treatment; continuity plans; risk reporting.',
  },
  {
    id: 9,
    institution: 'Ooredoo',
    country: 'Tunisia',
    year: '2023',
    course: 'How to conduct a Risk Assessment.',
  },
  {
    id: 10,
    institution: 'Poulina Group Holding',
    country: 'Tunisia',
    year: '2023',
    course: 'Fundamentals of Risk Management (COSO, IRM, ISO 31000).',
  },
  {
    id: 11,
    institution: 'Societe Coin Bleu',
    country: 'Tunisia',
    year: '2023',
    course: 'Fundamentals of Risk Management.',
  },
  {
    id: 12,
    institution: 'INPS',
    country: 'Mali',
    year: '2023',
    course: 'Fundamentals of Risk Management.',
  },
  {
    id: 13,
    institution: 'Banque Malienne de Solidarite (BMS)',
    country: 'Mali',
    year: '2023',
    course: 'Fundamentals of Risk Management.',
  },
  {
    id: 14,
    institution: 'WaterAid',
    country: 'Mali',
    year: '2023',
    course: 'Fundamentals of Risk Management (NGO sector).',
  },
  {
    id: 15,
    institution: 'Energie du Mali - SA',
    country: 'Mali',
    year: '2023',
    course: 'Fundamentals of Risk Management.',
  },
  {
    id: 16,
    institution: 'GRC Conseil',
    country: 'Mali',
    year: '2023',
    course: 'Fundamentals of Risk Management.',
  },
  {
    id: 17,
    institution: 'Banque Atlantique',
    country: 'Ivory Coast',
    year: '2022',
    course: 'CICS certification for administrators and managers.',
  },
  {
    id: 18,
    institution: 'OMA Group',
    country: 'Senegal',
    year: '2022',
    course: 'Fundamentals of Risk Management.',
  },
  {
    id: 19,
    institution: 'BHS',
    country: 'Senegal',
    year: '2022',
    course: 'Fundamentals of Risk Management.',
  },
  {
    id: 20,
    institution: 'Vista Banque',
    country: 'Guinea',
    year: '2022',
    course: 'Fundamentals of Risk Management.',
  },
  {
    id: 21,
    institution: 'ACS-Burkina SA',
    country: 'Burkina Faso',
    year: '2022',
    course: 'Fundamentals of Risk Management.',
  },
  {
    id: 22,
    institution: 'Central Bank of the Republic of Guinea (BCRG)',
    country: 'Guinea',
    year: '2021',
    course: 'Fundamentals of Risk Management (COSO/ISO 31000).',
    topics: 'Risk concepts; mapping; treatment; continuity; reporting.',
  },
  {
    id: 23,
    institution: 'BSIC',
    country: 'Senegal',
    year: '2021',
    course: 'Fundamentals of Risk Management.',
  },
  {
    id: 24,
    institution: 'CIAGE',
    country: 'Ivory Coast',
    year: '2021',
    course: 'Fundamentals of Risk Management.',
  },
];

function CertificateCard({ item, index, total }: { item: typeof certData[0], index: number, total: number, key?: string | number }) {
  const container = useRef(null);
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
          Accredited
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
          <div>
            <span className="certificate-info-label">Intake</span>
            <span className="certificate-info-value">{item.intake}</span>
          </div>
        </div>

        <div className="certificate-actions">
          <button className="btn-primary">ENROLL NOW</button>
          <button className="btn-outline">LEARN MORE</button>
        </div>
      </motion.div>
    </div>
  );
}

export const BfcAcademy: React.FC = () => {
  const heroWrapperRef = useRef(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroWrapperRef,
    offset: ["start start", "end start"]
  });

  const heroWidth = useTransform(heroScrollProgress, [0, 0.8], ["100%", "94%"]);
  const heroPadding = useTransform(heroScrollProgress, [0, 0.8], ["0px", "40px"]);

  useEffect(() => {
    // Dynamically load Tailwind CDN (if not already present)
    if (!document.querySelector('script[data-tailwind-cdn]')) {
      const s = document.createElement('script');
      s.src = 'https://cdn.tailwindcss.com';
      s.setAttribute('data-tailwind-cdn', '1');
      s.async = true;
      document.head.appendChild(s);
    }

    // Dynamically load Lucide if not present
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
  const [filterCategory, setFilterCategory] = useState<string>('Fundamentals & Risk Management');
  const [page, setPage] = useState<number>(1);
  const pageSize = 4; // cards per page — show 2x2 on each page

  // Data groups (kept inline as before)
 const groups = [
  {
    title: 'Fundamentals & Risk Management',
    items: [
      'Fundamentals of Risk Management — Institute of Risk Management London',
      'Risk Essentials Masterclass — Institute of Risk Management London',
      'Senior Risk Masterclass — Institute of Risk Management London',
      'Financial and Banking Risk Management',
    ],
  },
  {
    title: 'Internal Control',
    items: [
      'Certified Internal Control Specialist — Internal Control Institute USA',
      'Certified Internal Control Professional — Internal Control Institute USA',
      'Positioning Internal Control in Today’s Business Challenges',
      'Implementing an Effective and Efficient Internal Control System',
    ],
  },
  {
    title: 'Information Technology',
    items: [
      'IT Risk Management',
      'IT Project Management',
      'Business Process Digitalization',
    ],
  },
  {
    title: 'Managerial Skills',
    items: [
      'Strategic Management',
      'Project Management',
      'Effective Team Communication',
      'Situational Leadership',
      'Operational Excellence',
    ],
  },
  {
    title: 'Innovation',
    items: [
      'Certified Innovation Professional — Global Innovation Institute USA & BFC',
    ],
  },
  {
    title: 'Investments',
    items: [
      'Understanding Financial Markets',
      'Building and Managing Investment Strategies',
    ],
  },
  {
    title: 'Audit',
    items: [
      'Introduction to Internal Audit',
      'Mastering the Internal Audit Framework: IPPF',
      'Corporate Governance and Business Ethics',
      'Auditing the Control Environment',
      'Internal Audit Function Management',
      'Fraud and Internal Control',
    ],
  },
];

  // flatten courses with category
  const allCourses = groups.flatMap((g) => g.items.map((it) => ({ title: it, category: g.title })));

  const categories = ['All', ...groups.map((g) => g.title)];

  // Filter and paginate
  const filtered = filterCategory === 'All' ? allCourses : allCourses.filter((c) => c.category === filterCategory);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if (page > totalPages) setPage(totalPages);
  const pageStart = (page - 1) * pageSize;
  const pageItems = filtered.slice(pageStart, pageStart + pageSize);

  // Top featured: 3 international certificates (Risk Management cluster)
  const internationalCertificates = (groups[0]?.items || []).slice(0, 3).map((it) => ({ title: it, category: groups[0].title }));

  const onSelectCategory = (cat: string) => {
    setFilterCategory(cat);
    setPage(1);
  };

  const getAccreditedLogo = (institution: string) => {
    if (/institute of risk management|irm/i.test(institution)) return irm;
    if (/internal control institute|ici/i.test(institution)) return ici;
    if (/global innovation institute|gii/i.test(institution)) return GII;
    return bfcLogo;
  };

  const getCertificationDescription = (courseTitle: string, institution: string, accredited: boolean) => {
    if (/institute of risk management|irm/i.test(institution)) {
      return 'Professionally aligned risk management pathway covering governance, risk framework implementation, and decision-oriented reporting practices.';
    }
    if (/internal control institute|ici/i.test(institution)) {
      return 'International internal control certification focused on COSO-aligned controls, governance maturity, and operational assurance.';
    }
    if (/global innovation institute|gii/i.test(institution)) {
      return 'Innovation-focused certification designed to structure innovation strategy, governance, and measurable transformation outcomes.';
    }
    if (accredited) {
      return `Accredited training track for ${courseTitle}, delivered with internationally recognized standards and practical case-based learning.`;
    }
    return `Professional development course in ${courseTitle}, designed for practical implementation and immediate operational impact.`;
  };

  // Keep original inline styles and markup intact — converted to JSX.
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
              BFC International Academy: <br />Acteur de Votre Succès
            </h1>
            <p className="hero-desc">
              Elevate your professional expertise with our world-class certification programs 
              and strategic consulting courses. Accredited by leading global institutions.
            </p>
            <button className="hero-btn">
              EXPLORE OUR COURSES
            </button>
          </motion.div>
        </div>
      </div>

     

      <section className="international-section">
        <div className="international-container">
          <div className="international-grid">
            
            {/* Left Column: Title & Description */}
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

            {/* Right Column: Stacking Cards (Less Wide) */}
            <div className="international-right">
              <div className="international-cards">
                {certData.map((cert, index) => (
                  <CertificateCard 
                    key={cert.id} 
                    item={cert} 
                    index={index} 
                    total={certData.length} 
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* Excellence & Innovation Section */}
     
      {/* Nos Formations Title Section */}
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
            {categories.filter((cat) => cat !== 'All').map((cat) => (
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
            ))}
          </aside>
          <main className="formations-list-main">
           
           

            <div className="list-wrapper no-scrollbar">
              <div className="formations-list-grid-inner">
              {pageItems.map((c, i) => {
                const [titleText, institutionRaw] = c.title.split(' — ').map((s) => s && s.trim());
                const institution = institutionRaw || c.category;
                const isAccredited = /Institute of Risk Management|Internal Control Institute|Global Innovation Institute/i.test(institution);
                const programs = isAccredited ? '5+ Tracks' : 'Standard';
                const accreditation = isAccredited ? 'Global' : 'BFC';
                const intake = isAccredited ? 'Sept 2025' : 'Rolling';
                const courseImage = isAccredited ? getAccreditedLogo(institution) : bfcLogo;
                const certificationDescription = getCertificationDescription(titleText, institution, isAccredited);

                return (
                  <div key={`${c.title}-${i}`} className="course-card rectangular">
                    {isAccredited && (
                      <span className="accredited-badge">ACCREDITED</span>
                    )}
                    <div className="course-card__top-row">
                      <div className="course-card__image-container">
                        <img src={courseImage} alt={titleText} className="course-card__photo" />
                      </div>
                      <div className="course-card__title-block">
                        <h5 className="course-card__title">{titleText}</h5>
                        <div className="course-card__meta">{institution}</div>
                      </div>
                    </div>
                    <div className="course-card__desc">
                      {/* Optionally add a short description here if available */}
                    </div>
                    <div className="info-strip" role="list">
                      <div className="info-item" role="listitem">
                        <span className="label">Programs</span>
                        <span className="value">{programs}</span>
                      </div>
                      <div className="info-item" role="listitem">
                        <span className="label">Accreditation</span>
                        <span className="value">{accreditation}</span>
                      </div>
                      <div className="info-item" role="listitem">
                        <span className="label">Intake</span>
                        <span className="value">{intake}</span>
                      </div>
                    </div>
                    <div className="course-card__actions">
                      <button className="btn-primary">Enroll Now</button>
                      <Link
                        to={`/course/${encodeURIComponent(titleText)}`}
                        className="btn-outline"
                        state={{
                          course: {
                            title: titleText,
                            institution,
                            programs,
                            accreditation,
                            intake,
                            language: 'English',
                            imageUrl: courseImage,
                            isAccredited,
                            certificationDescription,
                            description: `Master the core concepts and practical frameworks of ${titleText}.`,
                          },
                        }}
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>

            {/* Pagination controls */}
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
          </main>
        </div>
      </div>
      </section>

      <section className="academy-references-section">
        <div className="academy-references-container">
          <div className="academy-references-header">
            <p className="academy-references-eyebrow">BFC Academy</p>
            <h2 className="academy-references-title">
              Training <span>References</span>
            </h2>
            <p className="academy-references-subtitle">
              {trainingReferences.length} certified training references across Tunisia and Sub-Saharan Africa.
            </p>
          </div>

          <div className="academy-references-grid">
            {trainingReferences.map((ref) => (
              <article key={ref.id} className="academy-reference-card">
                <div className="academy-reference-top">
                  <span className="academy-reference-index">{String(ref.id).padStart(2, '0')}</span>
                  <span className="academy-reference-year">{ref.year}</span>
                </div>

                <h3 className="academy-reference-institution">{ref.institution}</h3>
                <p className="academy-reference-country">{ref.country}</p>

                {ref.mission && (
                  <p className="academy-reference-line">
                    <strong>Mission:</strong> {ref.mission}
                  </p>
                )}

                <p className="academy-reference-line">
                  <strong>Course:</strong> {ref.course}
                </p>

                {ref.location && (
                  <p className="academy-reference-line">
                    <strong>Location:</strong> {ref.location}
                  </p>
                )}

                {ref.topics && (
                  <p className="academy-reference-line academy-reference-line--topics">
                    <strong>Topics:</strong> {ref.topics}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default BfcAcademy;
