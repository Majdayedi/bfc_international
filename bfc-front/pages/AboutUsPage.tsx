import React, { useEffect, useRef, useState } from 'react';
import { Globe, Shield, Users, Award, Zap, FileDown, Mail, Phone } from 'lucide-react';
import './AboutUsPage.css';
import { API_URL } from '../utils/constants';
import { COUNTRIES_WITH_FLAGS } from '../utils/countriesWithFlags';
import { useT, useLanguage, localizedField } from '../src/i18n';

import aboutHero from '../src/assets/about_us1.png';
import bfcLogo from '../src/assets/bfc.png';
import reandaLogo from '../src/assets/reanda.png';
import nadiaImg from '../src/assets/nadia.png';
import jobImg from '../src/assets/job.jpg';
import contactImg from '../src/assets/contact.jpg';
import abderrahman from '../src/assets/abderrahman.png';

// 3D Spinning Globe with Orbiting Data Lines
const SpinningGlobeBackdrop = () => {
  const t = useT();
  return (
    <div className="ap-globe-container">
      {/* 2D Fixed Base Planet with World Map Surface & Shadows - Doesn't flip in 3D */}
      <div className="ap-globe-sphere-base"></div>
      
      {/* Orbiting Logo */}
      <div className="ap-globe-logo-wrapper">
        <img src={reandaLogo} alt={t('about.reandaLogoAlt')} className="ap-globe-center-logo" />
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
  const t = useT();
  const [err, setErr] = useState(false);
  const resolvedSrc = getUploadUrl(src);

  useEffect(() => {
    setErr(false);
  }, [src]);

  if (resolvedSrc && !err) {
    return (
      <img
        src={resolvedSrc}
        alt={alt || title || t('about.flagFallbackAlt')}
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
  const t = useT();
  const { lang } = useLanguage();
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
          setTeamError(t('about.teamServerError', { status: res.status }));
        }
      } catch (err) {
        console.error('Failed to fetch team members:', err);
        setTeamError(t('about.teamErrorConnection'));
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
          <img src={aboutHero} alt={t('about.heroImgAlt')} className="ap-hero-img" />
          <div className="ap-hero-overlay"></div>
        </div>
        
        <div className="ap-hero-content">
          <div className="ap-scrolling-marquee-bg">{t('about.heroMarquee')}</div>
          <div className="ap-hero-text-box">
            <h1 className="ap-title rev-slide-up">  
              <span className="text-stroke">{t('about.heroTitleWord')}</span>{t('about.heroTitleLine')}<br/>
   {t('about.heroTitleLine2')}            </h1>
            <p className="ap-subtitle rev-slide-up" style={{transitionDelay: '0.2s'}}>
              {t('about.heroSubtitle')}
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
            <span className="ap-eyebrow">{t('about.groupEyebrow')}</span>
            <h2 className="ap-heading-xl">{t('about.groupTitleLine1')} <br/>{t('about.groupTitleLine2')}</h2>
            <div className="ap-styled-divider"></div>
             
            <div className="ap-floating-stats">
              <div className="ap-f-stat rev-scale">
       <strong>{result}</strong>
                <span>{t('about.yearsOfImpact')}</span>
              </div>
              <div className="ap-f-stat rev-scale" style={{transitionDelay: '0.1s'}}>
                <strong>5</strong>
                <span>{t('about.regionalHubs')}</span>
              </div>
            </div>
          </div>
          
          <div className="ap-scrolling-content">
            <div className="ap-glass-panel rev-slide-up">
              <img src={bfcLogo} alt={t('about.bfcLogoAlt')} className="ap-float-logo" />
              <p>
                {t('about.groupParagraph1')}
              </p>
              <p>
                {t('about.groupParagraph2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="ap-section">
        <div className="ap-container">
          <div className="ap-text-center rev-fade">
            <h2 className="ap-heading-lg">{t('about.missionVisionTitle')}</h2>
          </div>

          <div className="ap-mv-merged-grid">
            <div className="ap-mv-merged-card rev-slide-up">
              <div className="ap-mv-merged-media">
                <img src={jobImg} alt={t('about.missionImgAlt')} />
                <div className="ap-mv-merged-overlay">
                  <span className="ap-eyebrow">{t('about.missionEyebrow')}</span>
                  <h2 className="ap-mv-merged-title">{t('about.missionTitleLine1')}<br/>{t('about.missionTitleLine2')}</h2>
                </div>
              </div>
              <p className="ap-mv-merged-text">
                {t('about.missionText')}
              </p>
            </div>

            <div className="ap-mv-merged-card ap-mv-merged-card--vision rev-slide-up" style={{transitionDelay: '0.15s'}}>
              <div className="ap-mv-merged-media">
                <img src={contactImg} alt={t('about.visionImgAlt')} />
                <div className="ap-mv-merged-overlay">
                  <span className="ap-eyebrow">{t('about.visionEyebrow')}</span>
                  <h2 className="ap-mv-merged-title">{t('about.visionTitleLine1')}<br/>{t('about.visionTitleLine2')}</h2>
                </div>
              </div>
              <p className="ap-mv-merged-text">
                {t('about.visionText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="ap-section">
        <div className="ap-container">
          <div className="ap-text-center rev-fade">
            <span className="ap-eyebrow">{t('about.philosophyEyebrow')}</span>
            <h2 className="ap-heading-lg">{t('about.coreValuesTitle')}</h2>
          </div>
          
          <div className="ap-values-showcase">
            {[
              { icon: <Shield size={32}/>, title: t('about.valueIntegrity'), desc: t('about.valueIntegrityDesc') },
              { icon: <Award size={32}/>, title: t('about.valueExcellence'), desc: t('about.valueExcellenceDesc') },
              { icon: <Zap size={32}/>, title: t('about.valueInnovation'), desc: t('about.valueInnovationDesc') },
              { icon: <Users size={32}/>, title: t('about.valuePartnership'), desc: t('about.valuePartnershipDesc') }
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
              <span className="ap-eyebrow ap-teal-text">{t('about.globalFootprint')}</span>
              <h2 className="ap-net-title ap-text-white">Reanda<br/>International</h2>
              <div className="ap-styled-divider ap-divider-light"></div>
              <p className="ap-net-p">
                <strong>Reanda International</strong> {t('about.reandaParagraph')}
              </p>

              <div className="ap-net-stats">
                <div className="ap-n-stat">
                  <div className="ap-n-num">23rd</div>
                  <div className="ap-n-label"> {t('about.statAccountingNetwork')}</div>
                </div>
                <div className="ap-n-stat">
                  <div className="ap-n-num">60</div>
                  <div className="ap-n-label">{t('about.statCountries')}</div>
                </div>
                <div className="ap-n-stat">
                  <div className="ap-n-num">140+</div>
                  <div className="ap-n-label">{t('about.statOffices')}</div>
                </div>
                <div className="ap-n-stat">
                  <div className="ap-n-num">5000+</div>
                  <div className="ap-n-label">{t('about.statStaff')}</div>
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
            <span className="ap-eyebrow ap-teal-text">{t('about.executiveLeadership')}</span>
            <h2 className="ap-heading-lg">{t('about.mindsBehindBfc')}</h2>
          </div>
          
          <div className="ap-leadership-grid">
            <div className="ap-leader-card rev-fade">
              <div className="ap-leader-image">
                <img src={abderrahman} alt="abderrahman" />
              </div>
              <div className="ap-leader-info">
                <h3>Amin Abderrahman</h3>
                <p className="ap-leader-role"> {t('about.partnerRole')}</p>
                <p className="ap-leader-desc">{t('about.aminDesc')}</p>
                <div className="ap-leader-badges">
                </div>
                <div className="ap-leader-actions">
                  <div className="ap-team-contact-actions">
                    <button
                      type="button"
                      className={`ap-team-contact-toggle ${openContactKey === 'abderrahman-mail' ? 'is-open' : ''}`}
                      onClick={() => toggleContact('abderrahman-mail')}
                      title={t('about.showEmailAria', { name: 'abderrahman' })}
                      aria-label={t('about.showEmailAria', { name: 'abderrahman' })}
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
                <p className="ap-leader-role">{t('about.managingPartnerCeo')}</p>
                <p className="ap-leader-desc">{t('about.nadiaDesc')}</p>
                <div className="ap-leader-badges">
                  <span><Globe size={18} /> CFE® COBIT® ITIL® CICP®</span>
                </div>
                <div className="ap-leader-actions">
                  <div className="ap-team-contact-actions">
                    <button
                      type="button"
                      className={`ap-team-contact-toggle ${openContactKey === 'nadia-mail' ? 'is-open' : ''}`}
                      onClick={() => toggleContact('nadia-mail')}
                      title={t('about.showEmailAria', { name: 'Nadia Yaich' })}
                      aria-label={t('about.showEmailAria', { name: 'Nadia Yaich' })}
                    >
                      <Mail size={18} />
                      <span>nadia.yaich@bfc.com.tn</span>
                    </button>
                    <button
                      type="button"
                      className={`ap-team-contact-toggle ${openContactKey === 'nadia-phone' ? 'is-open' : ''}`}
                      onClick={() => toggleContact('nadia-phone')}
                      title={t('about.showPhoneAria', { name: 'Nadia Yaich' })}
                      aria-label={t('about.showPhoneAria', { name: 'Nadia Yaich' })}
                    >
                      <Phone size={18} />
                      <span>+216-58-422-199</span>
                    </button>
                  </div>
                  <button
                    className="ap-team-action-btn ap-team-download-btn"
                    title={t('about.downloadCvTitle')}
                    aria-label={t('about.downloadCvAria', { name: 'Nadia Yaich' })}
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
            <span className="ap-eyebrow">{t('about.ourTeamEyebrow')}</span>
            <h2 className="ap-heading-lg">{t('about.meetManagersTitle')}</h2>
          </div>
          <div className="ap-team-scroll-container">
            {teamLoading && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--ap-gray)' }}>
                <div className="ap-loading-spinner"></div>
                <p>{t('about.teamLoading')}</p>
              </div>
            )}
            {teamError && !teamLoading && (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#e74c3c' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{t('about.teamLoadErrorTitle')}</p>
                <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>{teamError}</p>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: '1rem', padding: '0.5rem 1.5rem',
                    background: 'var(--ap-navy)', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer'
                  }}
                >
                  {t('about.retry')}
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
                    {primaryFlagUrl && (
                      <span className="ap-team-flag" title={localizedField(member as any, 'countryName', lang)}>
                        <FlagImg src={primaryFlagUrl} alt={t('about.flagAlt', { country: localizedField(member as any, 'countryName', lang) || '' })} title={localizedField(member as any, 'countryName', lang)} />
                      </span>
                    )}
                    {extraFlags.map((flag, flagIdx) => (
                      <span className="ap-team-flag" key={`${flag.name}-${flagIdx}`} title={flag.name}>
                        <FlagImg src={getFlagBadgeUrl(flag)} alt={t('about.flagAlt', { country: flag.name })} title={flag.name} />
                      </span>
                    ))}
                    {extraFlags.length >= 1 && (
                      <span className="ap-team-globe" title={t('about.globalNetworkMember')} aria-label={t('about.globalNetworkMember')}>
                        <Globe size={14} />
                      </span>
                    )}
                  </div>
                  <img src={getUploadUrl(member.img)} alt={member.name} className="ap-team-card-img" />
                  <div className="ap-team-card-info">
                    <div className="ap-team-member-text">
                      <h4>{member.name}</h4>
                      <p className="ap-team-card-role">{localizedField(member as any, 'role', lang)}</p>
                    </div>
                    <div className="ap-team-action-row">
                      <div className="ap-team-contact-actions">
                        <button
                          type="button"
                          className={`ap-team-contact-toggle ${openContactKey === `${index}-mail` ? 'is-open' : ''}`}
                          onClick={() => toggleContact(`${index}-mail`)}
                          title={t('about.showEmailAria', { name: member.name })}
                          aria-label={t('about.showEmailAria', { name: member.name })}
                        >
                          <Mail size={18} />
                          <span>{member.email || ''}</span>
                        </button>
                        <button
                          type="button"
                          className={`ap-team-contact-toggle ${openContactKey === `${index}-phone` ? 'is-open' : ''}`}
                          onClick={() => toggleContact(`${index}-phone`)}
                          title={t('about.showPhoneAria', { name: member.name })}
                          aria-label={t('about.showPhoneAria', { name: member.name })}
                        >
                          <Phone size={18} />
                          <span>{member.phone || ''}</span>
                        </button>
                      </div>
                      {member.cvUrl && (
                        <button
                          className="ap-team-action-btn ap-team-download-btn"
                          title={t('about.downloadCvTitle')}
                          aria-label={t('about.downloadCvAria', { name: member.name })}
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
