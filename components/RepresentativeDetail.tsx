import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RepresentativeDetail.css';
import { PROJECTS, type Project } from './OurProjectsPage';

import bfcCongo from '../src/assets/bfc_congo.png';
import bfcSenegal from '../src/assets/bfc_senegal.png';
import bfcGuinee from '../src/assets/bfc.png';
import bfcMauritania from '../src/assets/bfc_mauritania.png';
import bfcTunisia from '../src/assets/MGI-BFC.png';
import reandaLogo from '../src/assets/reanda.png';
import mgiBfcLogo from '../src/assets/MGI-BFC.png';
import akremimg from '../src/assets/team/akrem.jpeg';
import chaimaimg from '../src/assets/team/chaima.jpeg';
import zeinebImg from '../src/assets/team/zeineb.jpeg';
import inesimg from '../src/assets/team/ines.jpeg';
import tasnimImg from '../src/assets/team/tasnim.jpeg';
import maherimg from '../src/assets/team/maher.jpeg';
import medamine from '../src/assets/team/medamine.jpeg';
import nadia from '../src/assets/team/nadia.jpeg';
import congo from '../src/assets/representatives/congo.png';
import senegal from '../src/assets/representatives/senegal.png';
import guinee from '../src/assets/representatives/guinee.png';
import tunisia from '../src/assets/representatives/tunisia.png';
import mauritania from '../src/assets/representatives/mauritania.png';


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
  projectCountries: string[];
  fallbackCountries?: string[];
}

const representativeData: Record<string, RepresentativeData> = {
  'congo': {
    title: 'BFC Congo',
    subtitle: 'Your partner in Central Africa',
    description: 'BFC Congo supports you through tailored solutions combining regional nuances with international standard consulting. We help businesses navigate the dynamic economy of the Congo Basin.',
    image: bfcCongo,
    location: 'Brazzaville, Republic of Congo',
    manager: {
      name: 'Nadia Yaich',
      email: 'nadia.yaich@bfc.com.tn',
      phone: '+216-58-422-199',
      photo: nadia
    },
    globeMarker: { top: '52%', left: '53%' },
    globeView: { rotateY: '148deg', mapX: '58%' },
    flagIcon: 'https://flagcdn.com/w80/cg.png',
    projectCountries: ['Republic of Congo', 'Congo', 'Congo rdc'],
    fallbackCountries: ['Cameroon', 'Ivory Coast']
  },
  'senegal': {
    title: 'BFC Senegal',
    subtitle: 'Influence in West Africa',
    description: 'Located in the heart of West Africa, BFC Senegal is dedicated to business transformation and institutional capacity building through innovative strategies.',
    image: bfcSenegal,
    location: 'Dakar, Senegal',
    manager: {
      name: 'Ines Yaich',
      email: 'ines.yaich@bfc.com.tn',
      phone: 'Phone not provided',
      photo: inesimg
    },
    globeMarker: { top: '43%', left: '46%' },
    globeView: { rotateY: '140deg', mapX: '55%' },
    flagIcon: 'https://flagcdn.com/w80/sn.png',
    projectCountries: ['Senegal'],
    fallbackCountries: ['Benin', 'Guinea', 'Niger', 'Mali', 'Ivory Coast']
  },
  'tunisia': {
    title: 'BFC Tunisia',
    subtitle: 'The bridge between Africa and Europe',
    description: 'BFC Tunisia operates as a strategic hub offering high-level consulting by leveraging exceptional human capital and mastery of North African markets.',
    image: bfcTunisia,
    location: 'Tunis, Tunisia',
    manager: {
     name: 'Nadia Yaich',
      email: 'nadia.yaich@bfc.com.tn',
      phone: '+216-58-422-199',
      photo: nadia
        },
    globeMarker: { top: '32%', left: '40%' },
    globeView: { rotateY: '165deg', mapX: '63%' },
    flagIcon: 'https://flagcdn.com/w80/tn.png',
    projectCountries: ['Tunisia']
  },
  'guinea': {
    title: 'BFC Guinea',
    subtitle: 'Expertise driving growth',
    description: 'Our firm is committed to providing pragmatic solutions and tailored support to businesses and institutions in Guinea for sustainable growth.',
    image: bfcGuinee,
    location: 'Conakry, Guinea',
    manager: {
      name: 'Mohamed Amine Sahli',
      email: 'mohamedamine.sahli@bfc.com.tn',
      phone: '+216 98 747 836 / +224 623 27 30 73',
      photo: medamine
    },
    globeMarker: { top: '46%', left: '47%' },
    globeView: { rotateY: '145deg', mapX: '56%' },
    flagIcon: 'https://flagcdn.com/w80/gn.png',
    projectCountries: ['Guinea']
  },
  'mauritania': {
    title: 'BFC Mauritania',
    subtitle: 'Strategic support and development',
    description: 'BFC continues its expansion with a strengthened presence, developing new local partnerships to address your economic and structural challenges.',
    image: bfcMauritania,
    location: 'Nouakchott, Mauritania',
    manager: {
      name: 'Tasnim Zouaoui',
      email: 'tasnim.zouaoui@bfc.com.tn',
      phone: '+216-98-194-202',
      photo: tasnimImg
    },
    globeMarker: { top: '42%', left: '46%' },
    globeView: { rotateY: '142deg', mapX: '54%' },
    flagIcon: 'https://flagcdn.com/w80/mr.png',
    projectCountries: ['Mauritania']
  }
};

function selectProjectsForRepresentative(data: RepresentativeData): {
  projects: Project[];
  usesRegionalFallback: boolean;
} {
  const directProjects = PROJECTS.filter((project) => data.projectCountries.includes(project.country));
  if (directProjects.length > 0) {
    return {
      projects: directProjects.slice(0, 4),
      usesRegionalFallback: false,
    };
  }

  if (data.fallbackCountries && data.fallbackCountries.length > 0) {
    const fallbackProjects = PROJECTS.filter((project) => data.fallbackCountries?.includes(project.country));
    return {
      projects: fallbackProjects.slice(0, 4),
      usesRegionalFallback: fallbackProjects.length > 0,
    };
  }

  return {
    projects: [],
    usesRegionalFallback: false,
  };
}

export const RepresentativeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isGlobeAnimating, setIsGlobeAnimating] = useState(false);
  const globeAnimStartedRef = useRef(false);

  const representativeMotivationPhotos: Record<string, string> = {
    congo,
    senegal,
    guinea: guinee,
    tunisia,
    mauritania,
  };
  
  const repId = id?.toLowerCase() || '';
  const data = representativeData[repId];
  const { projects: representativeProjects, usesRegionalFallback } = useMemo(
    () => (data ? selectProjectsForRepresentative(data) : { projects: [], usesRegionalFallback: false }),
    [data],
  );

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

        {/* Representative Projects Section - 2x2 Grid */}
        <div className="rd-rep-projects-section rd-reveal">
          <div className="rd-rep-projects-header">
            <span className="rd-projects-eyebrow">OUR TRACK RECORD</span>
            <h2 className="rd-projects-title">
              {usesRegionalFallback
                ? 'Key Regional References'
                : `Key Projects in ${data.location.split(',')[0]}`}
            </h2>
          </div>

          {representativeProjects.length > 0 ? (
            <div className="rd-rep-projects-grid">
              {representativeProjects.map((project) => (
                <div className="rd-rep-project-card sharp-card" key={project.id}>
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
          ) : (
            <div className="rd-rep-projects-empty sharp-card">
              No published references are available yet for this representative office.
            </div>
          )}
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

        <div className="rd-congo-motivation rd-reveal sharp-card">
          <div className="rd-congo-motivation__content">
            <p className="rd-congo-motivation__text">
              Connect with our {data.title.replace('BFC ', '')} team. Let&apos;s make something great together!
            </p>
          </div>
          <div className="rd-congo-motivation__photo-wrap">
            <img
              src={representativeMotivationPhotos[repId] ?? data.image}
              alt={`${data.title} team`}
              className="rd-congo-motivation__photo"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default RepresentativeDetail;
