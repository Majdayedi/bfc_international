import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, ArrowUpRight, Star, Clock } from "lucide-react";
import { Link } from 'react-router-dom';
import amor from '../src/assets/amor.png';

import nadia from '/src/assets/nadia.png';
import './BfcAcademy.css';

const certData = [
  {
    id: "01",
    title: "Institute of Risk Management",
    location: "London, UK",
    programs: "5+ Tracks",
    accreditation: "Global",
    intake: "Sept 2025",
    description: "The world's leading professional body for enterprise risk management. We provide qualifications, training, and resources to help you manage risk effectively."
  },
  {
    id: "02",
    title: "Internal Control Institute",
    location: "Florida, USA",
    programs: "3+ Tracks",
    accreditation: "International",
    intake: "Oct 2025",
    description: "Focused on the design, implementation, and assessment of internal control systems. Our certifications are recognized by major regulatory bodies worldwide."
  },
  {
    id: "03",
    title: "Information Systems Audit",
    location: "Global Reach",
    programs: "8+ Tracks",
    accreditation: "Industry Standard",
    intake: "Rolling",
    description: "Advanced certification for IT professionals specializing in audit, control, and security. Master the complexities of modern information systems."
  }
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
            <ShieldCheck size={28} />
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
        'Fundamentals of Risk Management — Institute of Risk Management of London',
        'Risk Essentials Masterclass — Institute of Risk Management of London',
        'Senior Risk Masterclass — Institute of Risk Management of London',
        'Management des risques financiers et bancaires',
      ],
    },
    {
      title: 'Internal Control',
      items: [
        'Certified Internal Control Specialist — Internal Control Institute of USA',
        'Certified Internal Control Professional — Internal Control Institute of USA',
        'Positionner le contrôle interne face aux enjeux actuels des entreprises',
        'Mettre en œuvre un dispositif de contrôle interne efficace et performant',
      ],
    },
    {
      title: "Technologie de l'information",
      items: [
        'Gestion des risques informatiques',
        'Management des projets IT',
        'Digitalisation du process métier',
      ],
    },
    {
      title: 'Capacités managériales',
      items: [
        'Management stratégique',
        'Management des projets',
        "La communication efficace au sein de l'équipe",
        'Management circonstanciel',
        'Excellence opérationnelle',
      ],
    },
    {
      title: 'Innovation',
      items: [
        'Certified Innovation Professional — Global Innovation Institute USA & BFC',
      ],
    },
    {
      title: 'Investissements',
      items: [
        'Comprendre les marchés financiers',
        "Comment construire une politique d'investissement et gérer les investissements",
      ],
    },
    {
      title: 'Audit',
      items: [
        "S’initier à l’audit interne",
        'Maitriser le cadre de référence de l’audit interne : IPPF',
        'Gouvernance et éthique des affaires',
        "Auditer l'environnement de contrôle",
        "Management de la fonction d’audit interne",
        'La fraude et le contrôle',
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
            <span>NOS</span>
            <span className="pw-intro__title-stroke">FORMATIONS</span>
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
                const isAccredited = /Institute of Risk Management|Internal Control Institute/i.test(institution);
                const programs = isAccredited ? '5+ Tracks' : 'Standard';
                const accreditation = isAccredited ? 'Global' : 'BFC';
                const intake = isAccredited ? 'Sept 2025' : 'Rolling';

                return (
                  <div key={`${c.title}-${i}`} className="course-card rectangular">
                    {isAccredited && (
                      <span className="accredited-badge">ACCREDITED</span>
                    )}
                    <div className="course-card__top-row">
                      <div className="course-card__icon" aria-hidden>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L20 5V11C20 16 16 20 12 22C8 20 4 16 4 11V5L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

      
    </div>
  );
};

export default BfcAcademy;
