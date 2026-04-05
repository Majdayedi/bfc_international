import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RepresentativeDetail.css';

import bfcCongo from '../src/assets/bfc_congo.png';
import bfcSenegal from '../src/assets/bfc_senegal.png';
import bfcGuinee from '../src/assets/bfc_guinée.png';
import bfcMauritania from '../src/assets/bfc_mauritania.png';
import bfcTunisia from '../src/assets/MGI-BFC.png';
import reandaLogo from '../src/assets/reanda.png';
import mgiBfcLogo from '../src/assets/MGI-BFC.png';

interface RepresentativeProject {
  title: string;
  category: string;
  year: string;
  description: string;
  imageUrl: string;
}

interface RepresentativeData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  location: string;
  manager: {
    name: string;
    email: string;
    phone: string;
    photo: string;
  };
  globeMarker: {
    top: string;
    left: string;
  };
  globeView: {
    rotateY: string;
    mapX: string;
  };
  flagIcon: string;
  projects: RepresentativeProject[];
}

const representativeData: Record<string, RepresentativeData> = {
  'congo': {
    title: 'BFC Congo',
    subtitle: 'Your partner in Central Africa',
    description: 'BFC Congo supports you through tailored solutions combining regional nuances with international standard consulting. We help businesses navigate the dynamic economy of the Congo Basin.',
    image: bfcCongo,
    location: 'Brazzaville, Republic of Congo',
    manager: {
      name: 'Jean-Paul Mabika',
      email: 'jp.mabika@bfc-groupe.com',
      phone: '+242 06 123 4567',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
    },
    globeMarker: { top: '52%', left: '53%' },
    globeView: { rotateY: '148deg', mapX: '58%' },
    flagIcon: 'https://flagcdn.com/w80/cg.png',
    projects: [
      {
        title: 'Public Finance Systems Upgrade',
        category: 'Advisory',
        year: '2023',
        description: 'End-to-end advisory mandate to modernise budget-execution workflows.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Central Bank Tax Review',
        category: 'Tax',
        year: '2022',
        description: 'Comprehensive tax compliance analysis for major financial institutions.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  'senegal': {
    title: 'BFC Senegal',
    subtitle: 'Influence in West Africa',
    description: 'Located in the heart of West Africa, BFC Senegal is dedicated to business transformation and institutional capacity building through innovative strategies.',
    image: bfcSenegal,
    location: 'Dakar, Senegal',
    manager: {
      name: 'Fatou Ndiaye',
      email: 'f.ndiaye@bfc-groupe.com',
      phone: '+221 77 123 45 67',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
    },
    globeMarker: { top: '43%', left: '46%' },
    globeView: { rotateY: '140deg', mapX: '55%' },
    flagIcon: 'https://flagcdn.com/w80/sn.png',
    projects: [
      {
        title: 'SME Capacity Building',
        category: 'Academy',
        year: '2024',
        description: 'Designed and delivered blended-learning for SME leaders.',
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Telecom Audit',
        category: 'Audit',
        year: '2023',
        description: 'Independent audit of a regional telecoms joint-venture.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  'tunisia': {
    title: 'BFC Tunisia',
    subtitle: 'The bridge between Africa and Europe',
    description: 'BFC Tunisia operates as a strategic hub offering high-level consulting by leveraging exceptional human capital and mastery of North African markets.',
    image: bfcTunisia,
    location: 'Tunis, Tunisia',
    manager: {
      name: 'Amine Ben Salah',
      email: 'a.bensalah@bfc-groupe.com',
      phone: '+216 20 123 456',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80'
    },
    globeMarker: { top: '32%', left: '40%' },
    globeView: { rotateY: '165deg', mapX: '63%' },
    flagIcon: 'https://flagcdn.com/w80/tn.png',
    projects: [
      {
        title: 'Statutory Audit - Telecoms JV',
        category: 'Audit',
        year: '2023',
        description: 'Independent audit of a joint-venture entity at the intersection of operators.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'IFRS Transition',
        category: 'Advisory',
        year: '2022',
        description: 'Guided a listed manufacturing company through the full IFRS adoption journey.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  'guinea': {
    title: 'BFC Guinea',
    subtitle: 'Expertise driving growth',
    description: 'Our firm is committed to providing pragmatic solutions and tailored support to businesses and institutions in Guinea for sustainable growth.',
    image: bfcGuinee,
    location: 'Conakry, Guinea',
    manager: {
      name: 'Ousmane Barry',
      email: 'o.barry@bfc-groupe.com',
      phone: '+224 620 12 34 56',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
    },
    globeMarker: { top: '46%', left: '47%' },
    globeView: { rotateY: '145deg', mapX: '56%' },
    flagIcon: 'https://flagcdn.com/w80/gn.png',
    projects: [
      {
        title: 'Transfer Pricing Defence',
        category: 'Tax & Legal',
        year: '2022',
        description: 'Prepared master-file documentation and represented before tax authorities.',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Anti-Money Laundering Review',
        category: 'Audit',
        year: '2023',
        description: 'Independent AML/CFT compliance review for a regional bank.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  'mauritania': {
    title: 'BFC Mauritania',
    subtitle: 'Strategic support and development',
    description: 'BFC continues its expansion with a strengthened presence, developing new local partnerships to address your economic and structural challenges.',
    image: bfcMauritania,
    location: 'Nouakchott, Mauritania',
    manager: {
      name: 'Sidi Ould Ahmed',
      email: 's.ahmed@bfc-groupe.com',
      phone: '+222 45 12 34 56',
      photo: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80'
    },
    globeMarker: { top: '42%', left: '46%' },
    globeView: { rotateY: '142deg', mapX: '54%' },
    flagIcon: 'https://flagcdn.com/w80/mr.png',
    projects: [
      {
        title: 'HR & Payroll Outsourcing',
        category: 'Outsourcing',
        year: '2024',
        description: 'Ongoing payroll management and HR administration for a retail group.',
        imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Certification Programme',
        category: 'Academy',
        year: '2024',
        description: 'Launched Reanda-accredited Audit & Assurance training cohort.',
        imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop'
      }
    ]
  }
};

export const RepresentativeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isGlobeAnimating, setIsGlobeAnimating] = useState(false);
  const globeAnimStartedRef = useRef(false);
  
  const repId = id?.toLowerCase() || '';
  const data = representativeData[repId];

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsGlobeAnimating(false);
    globeAnimStartedRef.current = false;

    const elements = document.querySelectorAll('.rd-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rd-visible');

          if (entry.target.classList.contains('rd-globe-section') && !globeAnimStartedRef.current) {
            globeAnimStartedRef.current = true;
            setIsGlobeAnimating(true);
          }
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [id]);

  if (!data) {
    return (
      <div className="rd-page rd-not-found">
        <h2 className="sharp-text">OFFICE NOT FOUND</h2>
        <button className="rd-back-btn sharp-btn" onClick={() => navigate(-1)}>
          <span>&larr;</span> BACK
        </button>
      </div>
    );
  }

  return (
    <div className="rd-page">
      <div className="rd-container">
        
        <div className="rd-split-layout">
          
          <div className="rd-text-section">
            
            
            <div className="rd-content">
              <span className="rd-eyebrow rd-reveal">GLOBAL NETWORK</span>
              <div className="rd-title-wrapper rd-reveal">
                <img src={data.flagIcon} alt="Flag" className="rd-title-flag" />
                <h1 className="rd-title">{data.title.toUpperCase()}</h1>
              </div>
              <div className="rd-divider rd-reveal"></div>
              <h2 className="rd-subtitle rd-reveal">{data.subtitle.toUpperCase()}</h2>
              <p className="rd-desc rd-reveal">{data.description}</p>
              
              <div className="rd-glass-card rd-reveal sharp-card">
                <h3 className="rd-glass-title">LOCAL EXPERTISE, GLOBAL VISION</h3>
                <p>
                  Our offices are deeply integrated into the local economic fabric while upholding the world-class methodologies and standards that define the BFC brand.
                </p>
              </div>
            </div>
          </div>

          <div className="rd-image-section rd-reveal">
            <div className="rd-logo-wrapper sharp-card">
              <img src={data.image} alt={data.title} className="rd-photo" />
            </div>
          </div>
          
        </div>

        {/* Enhanced Bottom Section: Manager Left, Globe Right */}
        <div className="rd-bottom-section rd-reveal">
          <div className="rd-manager-col sharp-card">
            <div className="rd-manager-photo-wrapper sharp-border">
              <img src={data.manager.photo} alt={data.manager.name} className="rd-manager-photo" />
            </div>
            <div className="rd-manager-details">
              <h4 className="rd-manager-name">{data.manager.name.toUpperCase()}</h4>
              <p className="rd-manager-role">COUNTRY MANAGER</p>
              <div className="rd-manager-contact">
                <a href={`mailto:${data.manager.email}`} className="rd-contact-link">
                  <span className="rd-icon">✉</span> {data.manager.email}
                </a>
                <a href={`tel:${data.manager.phone}`} className="rd-contact-link">
                  <span className="rd-icon">📞</span> {data.manager.phone}
                </a>
              </div>
            </div>
          </div>
          
          <div className="rd-globe-section rd-reveal">
            <div className="rd-reanda-globe-wrap">
              <div
                className={`rd-globe-container ${isGlobeAnimating ? 'rd-globe-animate' : ''}`}
                style={
                  {
                    '--rd-stop-rotate-y': data.globeView.rotateY,
                    '--rd-map-stop-x': data.globeView.mapX,
                  } as React.CSSProperties
                }
              >
                <div className="rd-globe-sphere-base"></div>

                

                <div className="rd-globe-3d-system">
                  <div className="rd-globe-grid">
                    <div className="rd-globe-line rd-v-line-1"></div>
                    <div className="rd-globe-line rd-v-line-2"></div>
                    <div className="rd-globe-line rd-v-line-3"></div>
                    <div className="rd-globe-line rd-v-line-4"></div>
                    <div className="rd-globe-line rd-h-line-1"></div>
                    <div className="rd-globe-line rd-h-line-2"></div>
                    <div className="rd-globe-line rd-h-line-3"></div>
                  </div>

                  <div className="rd-orbit-ring rd-ring-1">
                    <div className="rd-orbit-dot"></div>
                  </div>
                  <div className="rd-orbit-ring rd-ring-2">
                    <div className="rd-orbit-dot"></div>
                  </div>
                  <div className="rd-orbit-ring rd-ring-3">
                    <div className="rd-orbit-dot"></div>
                  </div>
                </div>

                <div
                  className="rd-city-marker"
                  style={{
                    top: data.globeMarker.top,
                    left: data.globeMarker.left,
                  }}
                >
                  <div className="rd-marker-label">{data.location.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Representative Projects Section - 2x2 Grid */}
        <div className="rd-rep-projects-section rd-reveal">
          <div className="rd-rep-projects-header">
            <span className="rd-projects-eyebrow">OUR TRACK RECORD</span>
            <h2 className="rd-projects-title">Key Projects in {data.location.split(',')[0]}</h2>
          </div>
          
          <div className="rd-rep-projects-grid">
            {data.projects.map((project, idx) => (
              <div className="rd-rep-project-card sharp-card" key={idx}>
                <div className="rd-rep-project-img-wrap">
                  <img src={project.imageUrl} alt={project.title} className="rd-rep-project-img" />
                  <span className="rd-rep-project-cat">{project.category}</span>
                </div>
                <div className="rd-rep-project-content">
                  <span className="rd-rep-project-year">{project.year}</span>
                  <h3 className="rd-rep-project-name">{project.title}</h3>
                  <p className="rd-rep-project-desc">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RepresentativeDetail;
