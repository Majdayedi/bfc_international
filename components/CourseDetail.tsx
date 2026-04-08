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
import './CourseDetail.css';

function getDefaultCertificationDescription(courseTitle: string, institution: string) {
  if (/institute of risk management|irm/i.test(institution)) {
    return 'Accredited by IRM, this certification develops practical risk management capability across governance, enterprise risk frameworks, treatment plans, and reporting.';
  }
  if (/internal control institute|ici/i.test(institution)) {
    return 'Accredited by ICI, this certification strengthens internal control architecture, control testing, COSO application, and governance effectiveness.';
  }
  return `This certification path in ${courseTitle} focuses on practical skills, applied frameworks, and operational implementation for immediate professional impact.`;
}

const CourseDetail: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stateCourse = (location.state as any)?.course;
  const title = stateCourse?.title || (params.title ? decodeURIComponent(params.title) : 'Internal Control Fundamentals');
  const institution = stateCourse?.institution || 'Internal Control Institute (ICI)';
  const description =
    stateCourse?.description ||
    'This professional certification develops key capabilities in governance, risk management, and internal control through an operational and implementation-focused approach.';
  const programs = stateCourse?.programs || '8 modules';
  const accreditation = stateCourse?.accreditation || 'ICI / BFC';
  const intake = stateCourse?.intake || 'Last updated: 02/2026';
  const language = stateCourse?.language || 'English';
  const certificationDescription =
    stateCourse?.certificationDescription || getDefaultCertificationDescription(title, institution);

  const previewLogo = stateCourse?.imageUrl
    || (/risk management|irm/i.test(institution) ? irm : /internal control|ici/i.test(institution) ? ici : bfcLogo);

  const introText = stateCourse?.intro || 
    'Welcome to this advanced certification program. Designed by industry experts, this course combines structured theory, real-world case studies, and applied workshops so you can build immediately usable professional skills.';

  const learnPoints = stateCourse?.learnPoints || [
    'Design and strengthen internal control architecture across key business processes.',
    'Implement performance and compliance monitoring mechanisms.',
    'Assess, map, and treat operational and financial risks.',
    'Improve information flows and internal reporting quality.',
    'Lead governance and control transformation in changing environments.',
  ];

  const relatedTopics = stateCourse?.relatedTopics || ['Governance', 'Risk Management', 'Internal Audit', 'Compliance'];

  const participants = stateCourse?.participants || 'Executives, Managers, Controllers, Auditors, and Governance professionals.';
  const duration = stateCourse?.duration || programs;
  const locationInfo = stateCourse?.location || 'International';
  const price = stateCourse?.price || 'Contact BFC for pricing details';

  const includes = [
    { icon: BadgeCheck, text: 'Official certification branding and resources' },
    { icon: FileText, text: 'Practice tests and assignments' },
  
    { icon: Trophy, text: 'Certificate of completion' },
  ];

  const contentSections = stateCourse?.contentSections || [
    { title: 'Day 01 - Internal Control Foundations', lectures: 2, duration: '55m' },
    { title: 'Day 02 - Control Environment and Risk Drivers', lectures: 2, duration: '1h 05m' },
    { title: 'Day 03 - Risk Assessment and Monitoring', lectures: 2, duration: '48m' },
    { title: 'Day 04 - Governance Review and Final Assessment', lectures: 2, duration: '52m' },
  ];

  const suggestedCourses = [
    { id: 1, title: 'Risk Management Advanced', rating: 4.8, students: 1204, price: '.99', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80' },
    { id: 2, title: 'Corporate Governance & Compliance', rating: 4.9, students: 890, price: '.99', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80' },
    { id: 3, title: 'Financial Audit Masterclass', rating: 4.7, students: 2310, price: '.99', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80' },
  ];

  const journeySteps = stateCourse?.journeySteps || [
    { title: 'Journey 01 - Foundations', detail: 'Core principles, governance baseline, and control mindset.' },
    { title: 'Journey 02 - Risk Mapping', detail: 'Identify, classify, and prioritize enterprise risks.' },
    { title: 'Journey 03 - Operating Controls', detail: 'Design actionable controls and monitoring loops.' },
    { title: 'Journey 04 - Validation & QCM', detail: 'Final recap, validation exercises, and certification prep.' },
  ];

  const [previewHeight, setPreviewHeight] = useState(190);
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(0);

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
             
            </div>
            <h1 className="ud-title">{title}</h1>
            <p className="ud-subtitle">{description}</p>
            <p className="ud-author">Created by <strong>BFC International Academy</strong></p>
            <div className="ud-meta-line">
              <span><Globe size={16} /> {language}</span>
              <span><BadgeCheck size={16} /> {accreditation}</span>
              <span><UsersRound size={16} /> {institution}</span>
            </div>
          </div>

          <aside className="ud-card-wrap">
            <article className="ud-card">
              <div className="ud-preview" style={{ height: `${previewHeight}px` }}>
                <img src={previewLogo} alt={`${institution} logo`} className="ud-preview-img" />
               
              </div>
              <div className="ud-card-body">
                <button type="button" className="ud-btn ud-btn-primary">Enroll now</button>
                <button type="button" className="ud-btn ud-btn-outline">
                  <FileText size={18} /> Get Brochure
                </button>
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

            <section className="ud-box ud-certification-box">
              <h2>Certification description</h2>
              <p>{certificationDescription}</p>
            </section>

            <section className="ud-box">
              <h2>Course facts</h2>
              <p><strong>Participants:</strong> {participants}</p>
              <p><strong>Duration:</strong> {duration}</p>
              <p><strong>Location:</strong> {locationInfo}</p>
              <p><strong>Price:</strong> {price}</p>
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


            <section className="ud-box ud-content-list">
              <div className="ud-content-head">
                <h3>Course content</h3>
                <p>{contentSections.length} sections • {programs}</p>
              </div>
              {contentSections.map((section, index) => {
                const isActive = activeJourneyIndex === index;
                const rowJourney = journeySteps[index];

                return (
                  <div key={section.title} className="ud-content-row-wrap">
                    <button
                      type="button"
                      className={`ud-content-row${isActive ? ' is-active' : ''}`}
                      onClick={() => setActiveJourneyIndex(index)}
                      aria-pressed={isActive}
                      aria-expanded={isActive}
                    >
                      <span className="ud-content-row-left">
                        <ChevronDown size={16} /> {section.title}
                      </span>
                      <span className="ud-content-row-right">
                        {section.lectures} lectures • {section.duration}
                      </span>
                    </button>

                    {isActive && rowJourney && (
                      <div key={activeJourneyIndex} className="ud-content-row-panel">
                        <p><strong>{rowJourney.title}</strong></p>
                        <p>{rowJourney.detail}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
            
            <section className="ud-box ud-topics">
              <h3>Explore related topics</h3>
              <div className="ud-topic-list">
                {relatedTopics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
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

