import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import ici from '../src/assets/certif/ici.png';
import irm from '../src/assets/certif/IRM.png';
import bfcLogo from '../src/assets/bfc.png';
import './BfcAcademy.css';

const certData = [
  {
    id: "01",
    title: "Fundamentals of Risk Management (FoRM)",
    location: "London, UK",
    programs: "2-Day Certification + Final Exam",
    accreditation: "Institute of Risk Management (IRM)",
    intake: "2026",
    description: "Official certificate training program from IRM London covering risk concepts, risk assessment, treatment, business continuity, and risk culture embedding.",
    imageUrl: irm
  },
  {
    id: "02",
    title: "Certified Internal Control Specialist (CICS)",
    location: "Florida, USA",
    programs: "5-Day Certification + Final Exam",
    accreditation: "Internal Control Institute (ICI)",
    intake: "2026",
    description: "Official ICI certification focused on internal control design, COSO-based risk control, governance practices, and implementation of enterprise internal control systems.",
    imageUrl: ici
  }
];

interface CourseCatalogItem {
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

const courseCatalog: CourseCatalogItem[] = [
  {
    id: 1,
    title: 'Fundamentals of Risk Management (FoRM)',
    institution: 'Institute of Risk Management (IRM) - London',
    country: 'International',
    year: '2026',
    category: 'International Courses',
    topics: 'Risk concepts, assessment and treatment, risk appetite, risk transfer, business continuity, monitoring and review, risk policy.',
    imageUrl: irm,
    isAccredited: true,
    programs: '3 Days + Final Examination',
    accreditation: 'IRM Official Certificate Program',
    intake: '2026',
    description: 'Official certification training from the Institute of Risk Management of London focused on practical ERM implementation and business-aligned risk decision making.',
    certificationDescription: 'Participants: Risk Managers, Internal Controllers, Internal Auditors, Administrators, Executives, Senior Managers, Department Heads. Certificate delivered by IRM upon passing final exam.',
    brochureUrl: '/pdfs/irm-form.pdf',
    intro: `Official FoRM certification by IRM London. The IRM is the world's leading organization in risk management. It helps build excellence in risk management to enhance how organizations operate. The IRM provides globally recognized qualifications and training, publishes research and informed leadership, and sets professional standards that define the knowledge, skills, and behaviors today's risk professionals need to meet the demands of an increasingly complex and challenging business environment. This course builds a practical enterprise risk management mindset and equips participants to deploy risk frameworks that are aligned with business strategy and governance expectations.`,
    participants: 'Risk Managers, Internal Controllers, Internal Auditors, Administrators, Executives, Senior Managers, Department Heads.',
    duration: '3 days + final exam',
    location: 'International sessions',
    price: 'Contact BFC for latest FoRM cohort pricing',
    language: 'English',
    relatedTopics: ['Risk Management', 'ERM', 'Governance', 'Business Continuity'],
    learnPoints: [
      'Understand risk and risk management fundamentals in organizational contexts.',
      'Implement risk assessment, risk treatment, and risk register practices.',
      'Define risk appetite, tolerance, and risk transfer mechanisms.',
      'Embed risk culture, policy, monitoring, and review cycles.',
      'Prepare for IRM final certification assessment.'
    ],
    contentSections: [
      { title: 'Day 1 - Concepts and Foundations', lectures: 5, duration: '6h' },
      { title: 'Day 2 - Risk Process and Assessment Tools', lectures: 6, duration: '6h' },
      { title: 'Day 3 - Framework, Culture and Final Revision', lectures: 6, duration: '6h' }
    ],
    journeySteps: [
      { title: 'Journey 01 - Build Foundations', detail: 'Clarify risk principles, why risk management matters, and core ERM disciplines.' },
      { title: 'Journey 02 - Analyze and Prioritize Risks', detail: 'Apply assessment tools, risk profiling, consequence and probability matrices.' },
      { title: 'Journey 03 - Treat and Embed', detail: 'Design treatments, define appetite and tolerance, and integrate risk culture.' },
      { title: 'Journey 04 - Validate and Certify', detail: 'Consolidate knowledge and complete final FoRM exam preparation.' }
    ]
  },
  {
    id: 2,
    title: 'Certified Internal Control Specialist (CICS)',
    institution: 'Internal Control Institute (ICI) - USA',
    country: 'International',
    year: '2026',
    category: 'International Courses',
    topics: 'Control environment, COSO components, risk evaluation, governance practices, reporting, internal control implementation and project steering.',
    imageUrl: ici,
    isAccredited: true,
    programs: '5 Days + Final Examination',
    accreditation: 'ICI Official Certification',
    intake: '2026',
    description: 'Official international certifying program from ICI to design, implement, assess, and manage internal control systems with governance alignment.',
    certificationDescription: `Includes exam voucher, pre-assessment test, module tests, and training materials. The program is aimed at executives, directors, administrators, internal controllers, auditors, inspectors, GRC professionals, and risk managers.`,
    brochureUrl: '/pdfs/cics.pdf',
    intro: `Official CICS program from the Internal Control Institute (ICI). The course focuses on control architecture, governance effectiveness, application of the COSO framework, and operational internal control implementation.    The Internal Control Institute™ (ICI)—the only global organization dedicated exclusively to internal control and corporate governance—offers an official international certification program for designing, implementing, assessing, and managing internal control systems aligned with governance, providing specialized methodologies, guidelines, and comprehensive controls for organizations.`,
    participants: 'Executives, Directors, Administrators, Internal Controllers, Internal Auditors, Inspectors, GRC professionals, Risk Managers.',
    duration: '5 days + final exam',
    location: 'International cohorts',
    price: '3,200 EUR (excl. VAT) — includes exam voucher, pre-assessment, module tests, and support',
    language: 'English',
    relatedTopics: ['Internal Control', 'COSO', 'GRC', 'Internal Audit'],
    learnPoints: [
      'Design and structure enterprise internal control systems.',
      'Develop control environment and control ownership across teams.',
      'Evaluate control effectiveness and risk exposure using COSO components.',
      'Implement reporting, communication, and governance review practices.',
      'Lead internal control projects and change management programs.'
    ],
    contentSections: [
      { title: 'Day 1 - Intensive Internal Control Workshop', lectures: 2, duration: '6h' },
      { title: 'Day 2 - Control Environment and COSO Risk Components', lectures: 2, duration: '6h' },
      { title: 'Day 3 - Information, Communication and Risk Evaluation', lectures: 2, duration: '6h' },
      { title: 'Day 4 - Governance Practices and COSO Adequacy Review', lectures: 2, duration: '6h' },
      { title: 'Day 5 - Final Exam and Certification Validation', lectures: 1, duration: '3h' }
    ],
    journeySteps: [
      { title: 'Journey 01 - Control Fundamentals', detail: 'Set the internal control baseline and map current control maturity.' },
      { title: 'Journey 02 - Risk-Control Alignment', detail: 'Connect risks to controls through COSO-based structuring.' },
      { title: 'Journey 03 - Governance and Reporting', detail: 'Strengthen communication flows and governance oversight.' },
      { title: 'Journey 04 - Certification Completion', detail: 'Finalize assessment readiness and pass ICI certification exam.' }
    ]
  },
  {
    id: 3,
    title: 'Innovation Workshop: Concevoir l\'Innovation',
    institution: 'BFC Group',
    country: 'Tunisia',
    year: '2026',
    category: 'Our Courses',
    topics: 'Innovation definition, strategic alignment, innovation horizons, innovation process, innovation tools, prioritization of initiatives.',
    imageUrl: bfcLogo,
    isAccredited: false,
    programs: 'Interactive Workshop (6 Hours)',
    accreditation: 'BFC Group Workshop',
    intake: 'Tunis 2026',
    description: 'Interactive and practical workshop to align strategy, horizons, and execution of innovation for organizations and leadership teams.',
    certificationDescription: 'Expected outcomes: innovation-effort diagnosis, primary innovation register synthesis, and practical alignment between strategic goals and innovation types. ',
    brochureUrl: '/pdfs/innovation-workshop.pdf',
    intro: 'An executive-focused workshop that clarifies innovation concepts, aligns innovation initiatives with strategic priorities, and translates innovation ambition into actionable execution tracks.',
    participants: 'R&D team, Project/Product Managers, CEO, COO, Strategy/Development Director, Industrial/Plant Director, Production Manager, Quality/Certification Manager, Sales/Marketing Managers, Customer Relations Manager, Business Development Manager, Risk Manager.',
    duration: '6 hours',
    location: 'On-site at client premises',
    price: '2,500 DT HT',
    language: 'French',
    relatedTopics: ['Innovation Strategy', 'Execution', 'Transformation', 'R&D'],
    learnPoints: [
      'Distinguish innovation from creativity, invention, and incremental improvement.',
      'Align innovation efforts with strategic priorities and business goals.',
      'Use horizons and innovation types for portfolio prioritization.',
      'Apply practical innovation processes and tools.',
      'Produce a first innovation diagnostic and a starter innovation register.'
    ],
    contentSections: [
      { title: 'Session 1 - Innovation Definition and Strategic Objectives', lectures: 2, duration: '1h 30m' },
      { title: 'Session 2 - Innovation Horizons and Types', lectures: 2, duration: '1h 15m' },
      { title: 'Session 3 - Innovation Process and Practical Tools', lectures: 2, duration: '1h 30m' },
      { title: 'Session 4 - Diagnostic and Action Synthesis', lectures: 1, duration: '1h 45m' }
    ],
    journeySteps: [
      { title: 'Journey 01 - Clarify', detail: 'Build shared language and understanding of what innovation is and is not.' },
      { title: 'Journey 02 - Align', detail: 'Connect innovation initiatives to strategy, priorities, and operational needs.' },
      { title: 'Journey 03 - Structure', detail: 'Apply horizons, process, and tools to organize execution.' },
      { title: 'Journey 04 - Activate', detail: 'Deliver diagnostic output and a practical first innovation roadmap.' }
    ]
  },
  {
    id: 4,
    title: 'L\'IA Generative pour l\'Audit et le Controle Interne',
    institution: 'BFC Academy & E2B Training',
    country: 'Tunisia',
    year: '2026',
    category: 'Our Courses',
    topics: 'Prompt engineering, NotebookLM, Claude, Claude Cowork, risk analysis automation, compliance checks, security conflicts, dashboarding.',
    imageUrl: bfcLogo,
    isAccredited: false,
    programs: '4-Day Certifying Training + Final Test',
    accreditation: 'BFC Academy Certification',
    intake: 'Tunis 2026',
    description: 'Certifying training to transform auditors into AI-augmented experts across the full audit cycle, data analysis automation, and intelligent documentation workflows.',
    certificationDescription: 'Delivered by Nadia Yaich and Kais Khenine. Includes course support, coffee breaks, lunch, and AI tools used during training.',
    brochureUrl: '/pdfs/ai-audit.pdf',
    intro: 'A practical certifying program designed for auditors, control teams, and risk professionals to operationalize generative AI in audit planning, execution, documentation, and assurance outcomes.',
    participants: 'Administrators, Executives, Senior Managers, Department Heads, Risk Managers, Internal Controllers, Internal Auditors.',
    duration: '4 days + final test',
    location: 'Tunis',
    price: '1,900 TND HT per participant',
    language: 'French',
    relatedTopics: ['AI for Audit', 'Prompt Engineering', 'Risk Analytics', 'Compliance Automation'],
    learnPoints: [
      'Transform audit practices using AI-assisted analysis and documentation.',
      'Master prompt engineering for control, audit, and risk use cases.',
      'Use NotebookLM and Claude workflows for structured audit intelligence.',
      'Automate risk diagnostics and support compliance verification.',
      'Apply advanced methods for data reliability, interview augmentation, and dashboarding.'
    ],
    contentSections: [
      { title: 'Journee 1 - Foundations, Tools and Prompt Engineering', lectures: 4, duration: '1 day' },
      { title: 'Journee 2 - NotebookLM and Claude Architecture', lectures: 4, duration: '1 day' },
      { title: 'Journee 3 - Applied Risk and Compliance Automation', lectures: 4, duration: '1 day' },
      { title: 'Journee 4 - Strategy, Ethics, Testing and Final Validation', lectures: 4, duration: '1 day' }
    ],
    journeySteps: [
      { title: 'Journey 01 - Explore AI Foundations', detail: 'Understand tools and prompt techniques for audit contexts.' },
      { title: 'Journey 02 - Build AI Workspaces', detail: 'Structure projects with NotebookLM and Claude collaborative workflows.' },
      { title: 'Journey 03 - Automate Controls and Risk Checks', detail: 'Deploy AI for diagnostics, conformity checks, and anomaly identification.' },
      { title: 'Journey 04 - Operationalize with Governance', detail: 'Finalize practical implementation plan, ethics guardrails, and certification test.' }
    ]
  }
];

function CertificateCard({ item, index, total }: { item: typeof certData[0], index: number, total: number, key?: string | number }) {
  const container = useRef(null);
  const navigate = useNavigate();
  const linkedCourse = courseCatalog.find((course) => course.title === item.title);
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
                course: {
                  title: linkedCourse.title,
                  institution: linkedCourse.institution,
                  programs: linkedCourse.programs,
                  accreditation: linkedCourse.accreditation,
                  intake: linkedCourse.intake,
                  language: linkedCourse.language,
                  imageUrl: linkedCourse.imageUrl,
                  isAccredited: linkedCourse.isAccredited,
                  certificationDescription: linkedCourse.certificationDescription,
                  description: linkedCourse.description,
                  brochureUrl: linkedCourse.brochureUrl,
                  intro: linkedCourse.intro,
                  participants: linkedCourse.participants,
                  duration: linkedCourse.duration,
                  location: linkedCourse.location,
                  price: linkedCourse.price,
                  relatedTopics: linkedCourse.relatedTopics,
                  learnPoints: linkedCourse.learnPoints,
                  contentSections: linkedCourse.contentSections,
                  journeySteps: linkedCourse.journeySteps,
                },
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

export const BfcAcademy: React.FC = () => {
  const navigate = useNavigate();
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
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const pageSize = 4; // cards per page — show 2x2 on each page

  const categories = ['All', ...Array.from(new Set(courseCatalog.map((course) => course.category)))];

  // Filter and paginate
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
              {pageItems.map((c) => {
                return (
                  <div key={c.id} className="course-card rectangular">
                    {c.isAccredited && (
                      <span className="accredited-badge">ACCREDITED</span>
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
                          course: {
                            title: c.title,
                            institution: c.institution,
                            programs: c.programs,
                            accreditation: c.accreditation,
                            intake: c.intake,
                            language: c.language,
                            imageUrl: c.imageUrl,
                            isAccredited: c.isAccredited,
                            certificationDescription: c.certificationDescription,
                            description: c.description,
                            brochureUrl: c.brochureUrl,
                            intro: c.intro,
                            participants: c.participants,
                            duration: c.duration,
                            location: c.location,
                            price: c.price,
                            relatedTopics: c.relatedTopics,
                            learnPoints: c.learnPoints,
                            contentSections: c.contentSections,
                            journeySteps: c.journeySteps,
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
