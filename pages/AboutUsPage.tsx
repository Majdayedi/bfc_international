import React, { useEffect, useRef, useState } from 'react';
import { Globe, Shield, Users, Award, Zap, FileDown, Mail, Phone } from 'lucide-react';
import './AboutUsPage.css';
import { API_URL } from '../utils/constants';
import { COUNTRIES_WITH_FLAGS } from '../utils/countriesWithFlags';

import aboutHero from '../src/assets/about_us1.png';
import bfcLogo from '../src/assets/bfc.png';
import reandaLogo from '../src/assets/reanda.png';
import nadiaImg from '../src/assets/nadia.png';
import jobImg from '../src/assets/job.jpg';
import contactImg from '../src/assets/contact.jpg';
import abderrahman from '../src/assets/abderrahman.png';

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

// Resolve backend upload URLs (relative paths like /uploads/...) to full URLs
const getUploadUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
  }
  return url;
};

// Look up a country's flagcdn URL by name or ISO code (matches backend countryName values)
const getFlagUrl = (name: string | undefined): string => {
  if (!name) return '';
  const cleanName = name.replace(/\s+flag$/i, '').trim();
  const c = COUNTRIES_WITH_FLAGS.find(cc =>
    cc.name.toLowerCase() === cleanName.toLowerCase() ||
    cc.code.toLowerCase() === cleanName.toLowerCase()
  );
  return c ? c.flag : '';
};

// Resolve a 2-letter ISO code for a country name/code (used as FlagImg fallback badge)
const getCountryCode = (name: string | undefined): string => {
  if (!name) return '';
  const cleanName = name.replace(/\s+flag$/i, '').trim();
  return COUNTRIES_WITH_FLAGS.find(cc =>
    cc.name.toLowerCase() === cleanName.toLowerCase() ||
    cc.code.toLowerCase() === cleanName.toLowerCase()
  )?.code || '';
};

// Flag image with graceful fallback: shows a country-code badge if the image URL fails to load
const FlagImg = ({ src, alt, title }: { src: string; alt?: string; title?: string }) => {
  const [err, setErr] = useState(false);
  const resolvedSrc = getUploadUrl(src);

  useEffect(() => {
    setErr(false);
  }, [src]);

  if (resolvedSrc && !err) {
    return (
      <img
        src={resolvedSrc}
        alt={alt || title || 'flag'}
        title={title || alt}
        onError={() => setErr(true)}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
      />
    );
  }

  const countryCode = getCountryCode(title || alt);
  return (
    <span className="flag-fallback" title={title || alt}>
      {countryCode ? countryCode.toUpperCase() : (alt || title || '?').charAt(0).toUpperCase()}
    </span>
  );
};

interface TeamBadgeFlag {
  name: string;
  url: string;
}

interface TeamMember {
  id?: number;
  name: string;
  role: string;
  roleType?: string;
  roleTypes?: string[];
  img: string;
  email?: string;
  phone?: string;
  cvUrl?: string | null;
  countryName?: string;
  countryFlagUrl?: string;
  showPrimaryFlag?: boolean | null;
  extraFlags?: TeamBadgeFlag[];
  displayOrder?: number;
}

// Primary country flag for a team member: prefer backend countryFlagUrl, else look up by name
const getPrimaryFlagUrl = (member: TeamMember): string => {
  return member.countryFlagUrl || getFlagUrl(member.countryName);
};

// Extra badge flag: prefer stored URL, else resolve by country name
const getFlagBadgeUrl = (flag: TeamBadgeFlag): string => {
  return flag.url || getFlagUrl(flag.name);
};

export const AboutUsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [openContactKey, setOpenContactKey] = useState<string | null>(null);
  const [teamMembersList, setTeamMembersList] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);
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
    // Fetch team members dynamically from the backend
    const fetchTeamMembers = async () => {
      setTeamLoading(true);
      setTeamError(null);
      try {
        const res = await fetch(`${API_URL}/api/team-members`);
        if (res.ok) {
          const data: TeamMember[] = await res.json();
          setTeamMembersList(data);
        } else {
          setTeamError(`Server responded with ${res.status}`);
        }
      } catch (err) {
        console.error('Failed to fetch team members:', err);
        setTeamError('Could not connect to the server. Make sure the backend is running.');
      } finally {
        setTeamLoading(false);
      }
    };
    fetchTeamMembers();

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });

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
      {/* NOTE: Sections 1–6 are static content. Section 7 (Meet The Managers) fetches from /api/team-members. */}

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
              <span className="text-stroke">SHAPING</span>THE FUTURE OF<br/>
   BUSINESS& INNOVATION            </h1>
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

      {/* 3. MISSION & VISION */}
      <section className="ap-section">
        <div className="ap-container">
          <div className="ap-text-center rev-fade">
            <h2 className="ap-heading-lg">Our Mission &amp; Vision</h2>
          </div>

          <div className="ap-mv-merged-grid">
            <div className="ap-mv-merged-card rev-slide-up">
              <div className="ap-mv-merged-media">
                <img src={jobImg} alt="BFC Mission" />
                <div className="ap-mv-merged-overlay">
                  <span className="ap-eyebrow">Our Mission</span>
                  <h2 className="ap-mv-merged-title">Empowering<br/>Transformation.</h2>
                </div>
              </div>
              <p className="ap-mv-merged-text">
                Our mission is to support and guide businesses, governments, and organizations by offering tailored consulting services rooted in local expertise and focused on sustainable growth.
              </p>
            </div>

            <div className="ap-mv-merged-card ap-mv-merged-card--vision rev-slide-up" style={{transitionDelay: '0.15s'}}>
              <div className="ap-mv-merged-media">
                <img src={contactImg} alt="BFC Vision" />
                <div className="ap-mv-merged-overlay">
                  <span className="ap-eyebrow">Our Vision</span>
                  <h2 className="ap-mv-merged-title">Courage<br/>To Change.</h2>
                </div>
              </div>
              <p className="ap-mv-merged-text">
                To become a leading consulting and executive training firm specialized in public sector transformation and governance across emerging markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
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

      {/* 5. REANDA & NETWORK */}
      <section className="ap-network-section">
        <div className="ap-network-bg">
          <div className="ap-net-overlay"></div>
          <SpinningGlobeBackdrop />
        </div>

        <div className="ap-container ap-network-front">
          <div className="ap-network-grid">
            <div className="ap-net-text rev-slide-up">
              <span className="ap-eyebrow ap-teal-text">Global Footprint</span>
              <h2 className="ap-net-title ap-text-white">Reanda<br/>International</h2>
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

      {/* 6. EXECUTIVE LEADERSHIP — static, does not use the team API */}
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
                <h3>Amin Abderrahman</h3>
                <p className="ap-leader-role"> Partner</p>
                <p className="ap-leader-desc">Chartered accountant and international consultant in financial and economic analysis.</p>
                <div className="ap-leader-badges">
                </div>
                <div className="ap-leader-actions">
                  <div className="ap-team-contact-actions">
                    <button
                      type="button"
                      className={`ap-team-contact-toggle ${openContactKey === 'abderrahman-mail' ? 'is-open' : ''}`}
                      onClick={() => toggleContact('abderrahman-mail')}
                      title="Show abderrahman email"
                      aria-label="Show abderrahman email"
                    >
                      <Mail size={18} />
                      <span>amine.abderrahmen@bfc.com.tn</span>
                    </button>
                  </div>
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
                <div className="ap-leader-actions">
                  <div className="ap-team-contact-actions">
                    <button
                      type="button"
                      className={`ap-team-contact-toggle ${openContactKey === 'nadia-mail' ? 'is-open' : ''}`}
                      onClick={() => toggleContact('nadia-mail')}
                      title="Show Nadia Yaich email"
                      aria-label="Show Nadia Yaich email"
                    >
                      <Mail size={18} />
                      <span>nadia.yaich@bfc.com.tn</span>
                    </button>
                    <button
                      type="button"
                      className={`ap-team-contact-toggle ${openContactKey === 'nadia-phone' ? 'is-open' : ''}`}
                      onClick={() => toggleContact('nadia-phone')}
                      title="Show Nadia Yaich phone"
                      aria-label="Show Nadia Yaich phone"
                    >
                      <Phone size={18} />
                      <span>+216-58-422-199</span>
                    </button>
                  </div>
                  <button
                    className="ap-team-action-btn ap-team-download-btn"
                    title="Download CV"
                    aria-label="Download Nadia Yaich CV"
                    onClick={() => handlePdfDownload(getUploadUrl('/uploads/cv/CV Nadia YAICH  Février 2026.pdf'), 'nadia-yaich-cv.pdf')}
                  >
                    <FileDown size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="ap-dec-circle c-left"></div>
        <div className="ap-dec-circle c-right"></div>
      </section>

      {/* 7. MEET THE MANAGERS */}
      <section className="ap-section">
        <div className="ap-container">
          <div className="ap-text-center rev-fade">
            <span className="ap-eyebrow">Our Team</span>
            <h2 className="ap-heading-lg">Meet The Managers</h2>
          </div>
          <div className="ap-team-scroll-container">
            {teamLoading && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ap-gray)' }}>
                <div className="ap-loading-spinner"></div>
                <p>Loading team members...</p>
              </div>
            )}
            {teamError && !teamLoading && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#e74c3c' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Could not load team</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>{teamError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: '1rem', padding: '0.5rem 1.5rem',
                    background: 'var(--ap-navy)', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer'
                  }}
                >
                  Retry
                </button>
              </div>
            )}
            {!teamLoading && !teamError && (
            <div className="ap-team-scroll">
              {teamMembersList.map((member, index) => {
                const primaryFlagUrl = getPrimaryFlagUrl(member);
                const extraFlags = (member.extraFlags || []).filter(f => f.name && f.name.trim() !== '');
                return (
                <div className="ap-team-card" key={index}>
                  <div className="ap-team-badges">
                    {member.showPrimaryFlag !== false && primaryFlagUrl && (
                      <span className="ap-team-flag" title={member.countryName}>
                        <FlagImg src={primaryFlagUrl} alt={member.countryName + ' flag'} title={member.countryName} />
                      </span>
                    )}
                    {extraFlags.map((flag, flagIdx) => (
                      <span className="ap-team-flag" key={`${flag.name}-${flagIdx}`} title={flag.name}>
                        <FlagImg src={getFlagBadgeUrl(flag)} alt={flag.name + ' flag'} title={flag.name} />
                      </span>
                    ))}
                    {extraFlags.length >= 1 && (
                      <span className="ap-team-globe" title="Global network member" aria-label="Global network member">
                        <Globe size={14} />
                      </span>
                    )}
                  </div>
                  <img src={getUploadUrl(member.img)} alt={member.name} className="ap-team-card-img" />
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
                          <span>{member.email || ''}</span>
                        </button>
                        <button
                          type="button"
                          className={`ap-team-contact-toggle ${openContactKey === `${index}-phone` ? 'is-open' : ''}`}
                          onClick={() => toggleContact(`${index}-phone`)}
                          title={`Show ${member.name} phone`}
                          aria-label={`Show ${member.name} phone`}
                        >
                          <Phone size={18} />
                          <span>{member.phone || ''}</span>
                        </button>
                      </div>
                      {member.cvUrl && (
                        <button
                          className="ap-team-action-btn ap-team-download-btn"
                          title="Download CV"
                          aria-label={`Download ${member.name} CV`}
                          onClick={() => handlePdfDownload(getUploadUrl(member.cvUrl as string), `${member.name.toLowerCase().replace(/\s+/g, '-')}-cv.pdf`)}
                        >
                          <FileDown size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )})}
            </div>
            )}
          </div>
          
        </div>
      </section>
    </div>
  );
};
