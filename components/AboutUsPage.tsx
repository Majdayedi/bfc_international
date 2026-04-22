import React, { useEffect, useRef, useState } from 'react';
import { Globe, Target, Eye, Shield, Users, Award, Zap, Crosshair, FileDown, Mail, Phone } from 'lucide-react';
import './AboutUsPage.css';

import aboutHero from '../src/assets/about_us1.png';
import bfcLogo from '../src/assets/bfc.png';
import reandaLogo from '../src/assets/reanda.png';
import nadiaImg from '../src/assets/nadia.png';
import jobImg from '../src/assets/job.jpg';
import contactImg from '../src/assets/contact.jpg';
import akremimg from '../src/assets/team/akrem.jpeg';
import chaimaimg from '../src/assets/team/chaima.jpeg';
import zeinebImg from '../src/assets/team/zeineb.jpeg';
import inesimg from '../src/assets/team/ines.jpeg';
import tasnimImg from '../src/assets/team/tasnim.jpeg';
import maherimg from '../src/assets/team/maher.jpeg';
import medamine from '../src/assets/team/medamine.jpeg';
import nadia from '../src/assets/team/nadia.jpeg';

import abderrahman from '../src/assets/abderrahman.png';
import cvnadia from '../src/assets/cv/CV Nadia YAICH  Février 2026.pdf';
import cvakram from '../src/assets/cv/CV de Akrem Cherni (1).pdf';
import cvmaher from '../src/assets/cv/CV MAHER BEN AMARA  Avril 2026.pdf';
import cv_medamine from '../src/assets/cv/CV Mohamed Amine Sahli (2).pdf';
import cvtasnim from '../src/assets/cv/CV Tasnim Zouaoui .pdf';
import cvzaineb from '../src/assets/cv/CV ZEINEB SBOUI (2).pdf';




// 3D Spinning Globe with Orbiting Data Lines
const SpinningGlobeBackdrop = () => {
  return (
    <div className="ap-globe-container">
      {/* 2D Fixed Base Planet with World Map Surface & Shadows - Doesn't flip in 3D */}
      <div className="ap-globe-sphere-base"></div>
      
      {/* Orbiting Logo */}
      <div className="ap-globe-logo-wrapper">
        <img src={reandaLogo} alt="Reanda Logo" className="ap-globe-center-logo" />
      </div>

      {/* 3D Rotating Elements */}
      <div className="ap-globe-3d-system">
        {/* Longitudinal grid lines */}
        <div className="ap-globe-grid">
          <div className="globe-line v-line-1"></div>
          <div className="globe-line v-line-2"></div>
          <div className="globe-line v-line-3"></div>
          <div className="globe-line v-line-4"></div>
          <div className="globe-line h-line-1"></div>
          <div className="globe-line h-line-2"></div>
          <div className="globe-line h-line-3"></div>
        </div>
        
        {/* Glowing Orbiting Rings */}
        <div className="ap-orbit-ring ring-1">
          <div className="orbit-dot"></div>
        </div>
        <div className="ap-orbit-ring ring-2">
          <div className="orbit-dot"></div>
        </div>
        <div className="ap-orbit-ring ring-3">
          <div className="orbit-dot"></div>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_TEAM_CV_URL = '/pdfs/team-member-cv.pdf';

interface TeamBadgeFlag {
  name: string;
  url: string;
}

interface TeamMember {
  name: string;
  role: string;
  img: string;
  email: string;
  phone: string;
  cvUrl: string;
  countryName: string;
  countryFlagUrl: string;
  showPrimaryFlag?: boolean;
  extraFlags?: TeamBadgeFlag[];
  showGlobe?: boolean;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Mohamed Amine Sahli',
    role: 'Associate & Country Manager Guinea',
    img: medamine,
    email: 'mohamedamine.sahli@bfc.com.tn',
    phone: '+216 98 747 836 / +224 623 27 30 73',
    cvUrl: cv_medamine,
    countryName: 'Guinea',
    countryFlagUrl: 'https://flagcdn.com/w80/gn.png',
  },
  {
    name: 'Maher Ben Amara',
    role: 'Consultant',
    img: maherimg,
    email: 'maher.benamara@bfc.com.tn',
    phone: '+216-99-536-528',
    cvUrl: cvmaher,
    countryName: 'Tunisia',
    countryFlagUrl: 'https://flagcdn.com/w80/tn.png',
    showPrimaryFlag: false,
    showGlobe: true,
  },
  {
    name: 'Akrem Cherni',
    role: 'Consultant',
    img: akremimg,
    email: 'akrem.cherni@bfc.com.tn',
    phone: '+216 98 194 201',
    cvUrl: cvakram,
    countryName: 'Tunisia',
    countryFlagUrl: 'https://flagcdn.com/w80/tn.png',
    showPrimaryFlag: false,
    showGlobe: true,
  },
  {
    name: 'Zeineb Sboui',
    role: 'Consultant',
    img: zeinebImg,
    email: 'zeineb.sboui@bfc.com.tn',
    phone: '+216-98-135-930',
    cvUrl: cvzaineb,
    countryName: 'Tunisia',
    countryFlagUrl: 'https://flagcdn.com/w80/tn.png',
    showPrimaryFlag: false,
    showGlobe: true,
  },
  {
    name: 'Chaima Gader',
    role: 'Auditing Accountant',
    img: chaimaimg,
    email: 'chaima.gader@bfc.com.tn',
    phone: '+216-98-747-842',
    cvUrl: DEFAULT_TEAM_CV_URL,
    countryName: 'Tunisia',
    countryFlagUrl: 'https://flagcdn.com/w80/tn.png',
  },
  {
    name: 'Ines Yaich',
    role: 'Country Manager BFC Senegal',
    img: inesimg,
    email: 'ines.yaich@bfc.com.tn',
    phone: 'Phone not provided',
    cvUrl: DEFAULT_TEAM_CV_URL,
    countryName: 'Senegal',
    countryFlagUrl: 'https://flagcdn.com/w80/sn.png',
  },
  {
    name: 'Nadia Yaich',
    role: 'CEO & Country Manager Congo',
    img: nadia,
    email: 'nadia.yaich@bfc.com.tn',
    phone: '+216-58-422-199',
    cvUrl: cvnadia,
    countryName: 'Republic of the Congo',
    countryFlagUrl: 'https://flagcdn.com/w80/cg.png',
    extraFlags: [{ name: 'Tunisia', url: 'https://flagcdn.com/w80/tn.png' }],
  },
  {
    name: 'Tasnim Zouaoui',
    role: 'Country Manager Mauritania & Mali',
    img: tasnimImg,
    email: 'tasnim.zouaoui@bfc.com.tn',
    phone: '+216-98-194-202',
    cvUrl: cvtasnim,
    countryName: 'Mauritania',
    countryFlagUrl: 'https://flagcdn.com/w80/mr.png',
    extraFlags: [{ name: 'Mali', url: 'https://flagcdn.com/w80/ml.png' }],
  },
];

export const AboutUsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [openContactKey, setOpenContactKey] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  const result = currentYear - 2010;

  const handlePdfDownload = (fileUrl: string, downloadName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', downloadName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleContact = (key: string) => {
    setOpenContactKey((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });
    
    document.querySelectorAll('.rev-fade, .rev-slide-up, .rev-scale').forEach(el => {
      observer.observe(el);
    });
    
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = "translateY(" + (scrolled * 0.35) + "px)";
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="about-pro-page">
      
      {/* 1. HERO */}
      <section className="ap-hero">
        <div className="ap-hero-parallax" ref={heroRef}>
          <img src={aboutHero} alt="BFC Team" className="ap-hero-img" />
          <div className="ap-hero-overlay"></div>
        </div>
        
        <div className="ap-hero-content">
          <div className="ap-scrolling-marquee-bg">STRATEGY • GROWTH • EXCELLENCE •</div>
          <div className="ap-hero-text-box">
            <h1 className="ap-title rev-slide-up">
              <span className="text-stroke">Shaping</span> The Future<br/>
              Of Africa &The Middle East.
            </h1>
            <p className="ap-subtitle rev-slide-up" style={{transitionDelay: '0.2s'}}>
Driving transformation through governance, innovation and capacity building.
            </p>
          </div>
          <div className="ap-scroll-indicator">
            <div className="mouse"></div>
          </div>
        </div>
      </section>

      {/* 2. BFC GROUP */}
      <section className="ap-section ap-gray-bg">
        <div className="ap-container ap-sticky-layout">
          <div className="ap-sticky-content rev-fade">
            <span className="ap-eyebrow">The BFC Group</span>
            <h2 className="ap-heading-xl">Integrated <br/>Excellence.</h2>
            <div className="ap-styled-divider"></div>
            
            <div className="ap-floating-stats">
              <div className="ap-f-stat rev-scale">
       <strong>{result}</strong>
                <span>Years of Impact</span>
              </div>
              <div className="ap-f-stat rev-scale" style={{transitionDelay: '0.1s'}}>
                <strong>5</strong>
                <span>Regional Hubs</span>
              </div>
            </div>
          </div>
          
          <div className="ap-scrolling-content">
            <div className="ap-glass-panel rev-slide-up">
              <img src={bfcLogo} alt="BFC Group" className="ap-float-logo" />
              <p>
BFC International & Academy is an international consulting and executive training firm specialized in
governance, risk management, strategy and digital transformation across Africa and the Middle East.
We support governments, development institutions, financial organizations and private sector leaders
in implementing high‑impact transformation programs.              </p>
              <p>
                Operating flawlessly at international standards while maintaining deep-rooted local intelligence, we act as the pivot point for sustainable resilience and expansive growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NOS VALEURS */}
      <section className="ap-section">
        <div className="ap-container">
          <div className="ap-text-center rev-fade">
            <span className="ap-eyebrow">Our Philosophy</span>
            <h2 className="ap-heading-lg">Core Values</h2>
          </div>
          
          <div className="ap-values-showcase">
            {[
              { icon: <Shield size={32}/>, title: 'Integrity', desc: 'Unyielding ethical rigor and transparency in every strategic move.' },
              { icon: <Award size={32}/>, title: 'Excellence', desc: 'An absolute commitment to precision, delivering unparalleled quality.' },
              { icon: <Zap size={32}/>, title: 'Innovation', desc: 'Developing adapted solutions to critical on-ground problems via innovative techniques and tools.' },
              { icon: <Users size={32}/>, title: 'Partnership ', desc: 'We partner with local actors and clients to create tangible and sustainable impact.' }
            ].map((val, idx) => (
              <div key={idx} className="ap-value-card rev-slide-up" style={{transitionDelay: "$" + (idx * 0.1) + "s"}}>
                <div className="ap-glow-border"></div>
                <div className="ap-v-content">
                  <div className="ap-v-icon">{val.icon}</div>
                  <h4>{val.title}</h4>
                  <p>{val.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EQUIPE DIRIGEANTE */}
      <section className="ap-section ap-gray-bg ap-overflow-hidden">
        <div className="ap-container">
          <div className="ap-text-center rev-slide-up">
            <span className="ap-eyebrow ap-teal-text">Executive Leadership</span>
            <h2 className="ap-heading-lg">The Minds Behind BFC</h2>
          </div>
          
          <div className="ap-leadership-grid">
            <div className="ap-leader-card rev-fade">
              <div className="ap-leader-image">
                <img src={abderrahman} alt="abderrahman" />
              </div>
              <div className="ap-leader-info">
                <h3>Amin Abdelrahman</h3>
                <p className="ap-leader-role"> Partner</p>
                <p className="ap-leader-desc">Chartered accountant and international consultant in financial and economic analysis.</p>
                <div className="ap-leader-badges">
                </div>
              </div>
            </div>

            <div className="ap-leader-card rev-fade" style={{transitionDelay: '0.2s'}}>
              <div className="ap-leader-image">
                <img src={nadiaImg} alt="Nadia" />
              </div>
              <div className="ap-leader-info">
                <h3>Nadia Yaich</h3>
                <p className="ap-leader-role">Managing Partner & CEO</p>
                <p className="ap-leader-desc">International expert – Trainer in
strategic and
organisational management, public policy.</p>
                <div className="ap-leader-badges">
                  <span><Globe size={18} /> CFE® COBIT® ITIL® CICP®</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ap-dec-circle c-left"></div>
        <div className="ap-dec-circle c-right"></div>
      </section>

      {/* TEAM MEMBERS SECTION */}
      <section className="ap-section">
        <div className="ap-container">
          <div className="ap-text-center rev-fade">
            <span className="ap-eyebrow">Our Experts</span>
            <h2 className="ap-heading-lg">Meet the Team</h2>
          </div>
          <div className="ap-team-scroll-container">
            <div className="ap-team-scroll">
              {TEAM_MEMBERS.map((member, index) => (
                <div className="ap-team-card" key={index}>
                  <div className="ap-team-badges">
                    {member.showPrimaryFlag !== false && (
                      <span className="ap-team-flag" title={member.countryName}>
                        <img src={member.countryFlagUrl} alt={member.countryName + ' flag'} />
                      </span>
                    )}
                    {member.extraFlags?.map((flag) => (
                      <span className="ap-team-flag" key={flag.url} title={flag.name}>
                        <img src={flag.url} alt={flag.name + ' flag'} />
                      </span>
                    ))}
                    {member.showGlobe && (
                      <span className="ap-team-globe" title="Global network member" aria-label="Global network member">
                        <Globe size={14} />
                      </span>
                    )}
                  </div>
                  <img src={member.img} alt={member.name} className="ap-team-card-img" />
                  <div className="ap-team-card-info">
                    <div className="ap-team-member-text">
                      <h4>{member.name}</h4>
                      <p className="ap-team-card-role">{member.role}</p>
                    </div>
                    <div className="ap-team-action-row">
                      <div className="ap-team-contact-actions">
                        <button
                          type="button"
                          className={`ap-team-contact-toggle ${openContactKey === `${index}-mail` ? 'is-open' : ''}`}
                          onClick={() => toggleContact(`${index}-mail`)}
                          title={`Show ${member.name} email`}
                          aria-label={`Show ${member.name} email`}
                        >
                          <Mail size={18} />
                          <span>{member.email}</span>
                        </button>
                        <button
                          type="button"
                          className={`ap-team-contact-toggle ${openContactKey === `${index}-phone` ? 'is-open' : ''}`}
                          onClick={() => toggleContact(`${index}-phone`)}
                          title={`Show ${member.name} phone`}
                          aria-label={`Show ${member.name} phone`}
                        >
                          <Phone size={18} />
                          <span>{member.phone}</span>
                        </button>
                      </div>
                      <button
                        className="ap-team-action-btn ap-team-download-btn"
                        title="Download CV"
                        aria-label={`Download ${member.name} CV`}
                        onClick={() => handlePdfDownload(member.cvUrl, `${member.name.toLowerCase().replace(/\s+/g, '-')}-cv.pdf`)}
                      >
                        <FileDown size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* 5. REANDA & NETWORK - 3D Globe Implementation */}
      <section className="ap-network-section">
        <div className="ap-network-bg">
          <div className="ap-net-overlay"></div>
          <SpinningGlobeBackdrop />
        </div>

        <div className="ap-container ap-network-front">
          <div className="ap-network-grid">
            
            <div className="ap-net-text rev-slide-up">
              <span className="ap-eyebrow ap-teal-text">Global Footprint</span>
              <h2 className="ap-heading-xl ap-text-white" style={{marginBottom: '1.5rem'}}>Reanda<br/>International</h2>
              <div className="ap-styled-divider ap-divider-light"></div>
              <p className="ap-net-p">
                <strong>Reanda International</strong> is a leading global network of accounting
                and consulting firms. With more than 5,000 professionals and 240 partners
                across 144 offices in 58 countries, we provide high-quality accounting,
                audit, tax, and consulting services tailored to our clients' international needs.
              </p>

              <div className="ap-net-stats">
                <div className="ap-n-stat">
                  <div className="ap-n-num">23rd</div>
                  <div className="ap-n-label"> Accounting Network</div>
                </div>
                <div className="ap-n-stat">
                  <div className="ap-n-num">60</div>
                  <div className="ap-n-label">Countries</div>
                </div>
                <div className="ap-n-stat">
                  <div className="ap-n-num">140+</div>
                  <div className="ap-n-label">Offices</div>
                </div>
                <div className="ap-n-stat">
                  <div className="ap-n-num">5000+</div>
                  <div className="ap-n-label">Staff</div>
                </div>
              </div>
            </div>

            <div className="ap-net-visuals rev-scale" style={{transitionDelay: '0.3s'}}></div>

          </div>
        </div>
      </section>

      {/* REANDA VIDEO SECTION */}
      <section className="ap-reanda-video-section ap-section">
        <div className="ap-container">
          <div className="ap-reanda-video-layout">
            <div className="ap-reanda-video-copy">
              <span className="ap-eyebrow">Reanda Network </span>
              <h2 className="ap-heading-lg">Signing Ceremony</h2>
            </div>

            <div className="ap-reanda-video-wrap">
              <video
                className="ap-reanda-video"
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={aboutHero}
              >
                <source src="/videos/reanda_accord.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MISSION SECTION */}
      <section className="ap-mission-section ap-section">
        <div className="ap-container">
          <div className="ap-mission-layout">
            <div className="ap-mv-image-wrapper rev-scale">
              <div className="ap-mv-image-backdrop teal-backdrop"></div>
              <img src={jobImg} className="ap-mv-image" alt="BFC Mission" />
              <div className="ap-mv-floating-badge">
                <Target size={20} />
                <span>Strategic Impact</span>
              </div>
            </div>
            <div className="ap-mission-content rev-slide-up">
              <div className="ap-mv-icon-wrapper">
                <Target className="ap-mv-icon" />
              </div>
              <span className="ap-eyebrow">Our Mission</span>
              <h2 className="ap-heading-xl ap-navy-text">Empowering<br/>Transformation.</h2>
              <div className="ap-styled-divider"></div>
              <p className="ap-mission-text">
Our mission is to support and guide businesses, governments, and organizations by offering tailored consulting services rooted in local expertise and focused on sustainable growth.       </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. VISION SECTION */}
      <section className="ap-vision-section ap-section ap-navy-bg ap-overflow-hidden">
        <div className="ap-vision-bg-glow"></div>
        <div className="ap-container relative-z">
          <div className="ap-vision-layout">
            <div className="ap-vision-content rev-slide-up">
              <div className="ap-mv-icon-wrapper teal-icon">
                <Eye className="ap-mv-icon" />
              </div>
              <span className="ap-eyebrow ap-teal-text">Our Vision</span>
              <h2 className="ap-heading-xl ap-text-white">Courage<br/>To Change.</h2>
              <div className="ap-styled-divider ap-divider-light"></div>
              <p className="ap-vision-text">
To become a leading consulting and executive training firm specialized in public sector transformation
and governance across emerging markets.
              </p>
            </div>
            <div className="ap-mv-image-wrapper rev-scale" style={{transitionDelay: '0.2s'}}>
              <div className="ap-mv-image-backdrop white-backdrop"></div>
              <img src={contactImg} className="ap-mv-image" alt="BFC Vision" />
              <div className="ap-mv-floating-badge dark-badge">
                <Eye size={20} />
                <span>Global Foresight</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
