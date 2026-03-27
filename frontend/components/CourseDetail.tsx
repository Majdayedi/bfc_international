import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  Clock3,
  FileText,
  Globe,
  Infinity,
  Play,
  PlayCircle,
  Star,
  Trophy,
  Tv,
  UsersRound,
} from 'lucide-react';
import './CourseDetail.css';

const CourseDetail: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stateCourse = (location.state as any)?.course;
  const title = stateCourse?.title || (params.title ? decodeURIComponent(params.title) : 'Controle Interne');
  const institution = stateCourse?.institution || "L'INTERNAL CONTROL INSTITUTE (ICI)";
  const description =
    stateCourse?.description ||
    "Cette formation professionnalisante développe les compétences clés en gouvernance, maîtrise des risques et contrôle interne, avec une approche opérationnelle adaptée aux exigences actuelles des organisations.";
  const programs = stateCourse?.programs || '8 modules';
  const accreditation = stateCourse?.accreditation || 'ICI / BFC';
  const intake = stateCourse?.intake || 'Derniere mise a jour: 02/2026';

  const introText = stateCourse?.intro || 
    "Bienvenue dans cette formation de haut niveau. Conçue par des experts de l'industrie, cette formation vous plongera au cœur des meilleures pratiques professionnelles. À travers une combinaison de théorie, d'études de cas réels et d'ateliers pratiques, vous développerez les compétences essentielles pour exceller dans votre domaine et apporter une valeur ajoutée immédiate à votre organisation.";

  const learnPoints = [
    'Concevoir le dispositif de contrôle interne et de maîtrise des activités.',
    'Mettre en place des actions de pilotage de la performance et de la conformité.',
    "Evaluer, cartographier et traiter les risques opérationnels et financiers.",
    "Maitriser les systèmes d'information et les processus de reporting interne.",
    "Piloter la transformation du contrôle interne dans un environnement en changement.",
  ];

  const relatedTopics = ['Governance', 'Risk Management', 'Internal Audit', 'Compliance'];

  const includes = [
    { icon: PlayCircle, text: '2.5 hours on-demand video' },
    { icon: FileText, text: 'Practice tests and assignments' },
    { icon: Tv, text: 'Access on mobile and TV' },
    { icon: Infinity, text: 'Full lifetime access' },
    { icon: Trophy, text: 'Certificate of completion' },
  ];

  const contentSections = [
    { title: 'Journee 01 - Fondamentaux du controle interne', lectures: 2, duration: '55m' },
    { title: 'Journee 02 - Environnement de controle et risques', lectures: 2, duration: '1h 05m' },
    { title: 'Journee 03 - Evaluation et pilotage des risques', lectures: 2, duration: '48m' },
    { title: 'Journee 04 - Gouvernance, revue et recapitulatif QCM', lectures: 2, duration: '52m' },
  ];

  const suggestedCourses = [
    { id: 1, title: 'Risk Management Advanced', rating: 4.8, students: 1204, price: '.99', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80' },
    { id: 2, title: 'Corporate Governance & Compliance', rating: 4.9, students: 890, price: '.99', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80' },
    { id: 3, title: 'Financial Audit Masterclass', rating: 4.7, students: 2310, price: '.99', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80' },
  ];

  const journeySteps = [
    { title: 'Journey 01 - Foundations', detail: 'Core principles, governance baseline, and control mindset.' },
    { title: 'Journey 02 - Risk Mapping', detail: 'Identify, classify, and prioritize enterprise risks.' },
    { title: 'Journey 03 - Operating Controls', detail: 'Design actionable controls and monitoring loops.' },
    { title: 'Journey 04 - Validation & QCM', detail: 'Final recap, validation exercises, and certification prep.' },
  ];

  const [previewHeight, setPreviewHeight] = useState(190);

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
            <button type="button" className="ud-back" onClick={() => navigate(-1)}>
              <ChevronLeft size={16} /> Back
            </button>
            <div className="ud-badges">
              <span className="ud-pill">Bestseller</span>
              <span className="ud-rating"><Star size={14} fill="#fbbf24" stroke="#fbbf24" /> 4.7</span>
              <span>(525 ratings)</span>
              <span>2,109 students</span>
            </div>
            <h1 className="ud-title">{title}</h1>
            <p className="ud-subtitle">{description}</p>
            <p className="ud-author">Created by <strong>BFC International Academy</strong></p>
            <div className="ud-meta-line">
              <span><CalendarDays size={16} /> {intake}</span>
              <span><Globe size={16} /> English</span>
              <span><BadgeCheck size={16} /> {accreditation}</span>
              <span><UsersRound size={16} /> {institution}</span>
            </div>
          </div>

          <aside className="ud-card-wrap">
            <article className="ud-card">
              <div className="ud-preview" style={{ height: `${previewHeight}px` }}>
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Course Preview" className="ud-preview-img" />
                <div className="ud-preview-overlay"></div>
                <div className="ud-preview-play-icon">
                  <Play size={24} fill="currentColor" />
                </div>
              </div>
              <div className="ud-card-body">
                <div className="ud-price">.99</div>
                <button type="button" className="ud-btn ud-btn-primary">Enroll now</button>
                <button type="button" className="ud-btn ud-btn-outline">
                  <FileText size={18} /> Get Brochure
                </button>
                <p className="ud-guarantee">30-Day Money-Back Guarantee</p>
                <h4>This course includes:</h4>
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
              <h2>About this course</h2>
              <p>{introText}</p>
            </section>

            <section className="ud-box ud-learn-box">
              <h2>What you'll learn</h2>
              <ul className="ud-learn-grid">
                {learnPoints.map((point) => (
                  <li key={point}>
                    <div className="ud-learn-icon"><Check size={18} /></div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="ud-box ud-topics">
              <h3>Explore related topics</h3>
              <div className="ud-topic-list">
                {relatedTopics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
            </section>

            <section className="ud-box ud-content-list">
              <div className="ud-content-head">
                <h3>Course content</h3>
                <p>{contentSections.length} sections • {programs}</p>
              </div>
              {contentSections.map((section) => (
                <button key={section.title} type="button" className="ud-content-row">
                  <span className="ud-content-row-left">
                    <ChevronDown size={16} /> {section.title}
                  </span>
                  <span className="ud-content-row-right">
                    {section.lectures} lectures • {section.duration}
                  </span>
                </button>
              ))}
            </section>

            <section className="ud-suggestions">
              <h2>Top courses in related topics</h2>
              <div className="ud-suggestion-grid">
                {suggestedCourses.map(course => (
                  <div key={course.id} className="ud-suggestion-card">
                    <img src={course.image} alt={course.title} className="ud-suggestion-img" />
                    <div className="ud-suggestion-content">
                      <h4>{course.title}</h4>
                      <p className="ud-author">BFC International Academy</p>
                      <div className="ud-suggestion-rating">
                        <span className="ud-rating-number">{course.rating}</span>
                        <Star size={14} fill="#b45309" color="#b45309" />
                        <span className="ud-students">({course.students})</span>
                      </div>
                      <div className="ud-suggestion-price">{course.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          <div className="ud-right-spacer" aria-hidden="true" />
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;

