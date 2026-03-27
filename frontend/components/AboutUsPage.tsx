import React, { useEffect, useRef } from 'react';
import { Globe, Target, Eye, Shield, Users, Award, Zap, Crosshair, FileDown } from 'lucide-react';
import './AboutUsPage.css';

import aboutHero from '../src/assets/about_us1.png';
import bfcLogo from '../src/assets/bfc.png';
import reandaLogo from '../src/assets/reanda.png';
import nadiaImg from '../src/assets/nadia.png';
import amorImg from '../src/assets/amor.png';
import jobImg from '../src/assets/job.jpg';
import contactImg from '../src/assets/contact.jpg';

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

export const AboutUsPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

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
              Of Global Business.
            </h1>
            <p className="ap-subtitle rev-slide-up" style={{transitionDelay: '0.2s'}}>
              BFC is a premier advisory, audit, and accounting network driving transformative success for institutions across the world.
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
                <strong>10+</strong>
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
                The BFC Group converges multi-disciplinary mastery to solve the most intricate challenges of modern business. We blend high-level strategic foresight with granular operational precision.
              </p>
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
              { icon: <Zap size={32}/>, title: 'Innovation', desc: 'Pioneering future-proof technologies and disruptive methodologies.' },
              { icon: <Users size={32}/>, title: 'Proximity', desc: 'Cultivating symbiotic, trust-based partnerships driven by empathy.' }
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
                <img src={nadiaImg} alt="Amor" />
              </div>
              <div className="ap-leader-info">
                <h3>Amin abderrahman</h3>
                <p className="ap-leader-role">Founding Partner & CEO</p>
                <p className="ap-leader-desc">With over two decades of transformative leadership, Amor drives the strategic vision and operational excellence behind BFC's continued market prominence.</p>
                <div className="ap-leader-badges">
                  <span><Crosshair size={18} /> Strategic Vision</span>
                </div>
              </div>
            </div>

            <div className="ap-leader-card rev-fade" style={{transitionDelay: '0.2s'}}>
              <div className="ap-leader-image">
                <img src={nadiaImg} alt="Nadia" />
              </div>
              <div className="ap-leader-info">
                <h3>Nadia</h3>
                <p className="ap-leader-role">Managing Director, International</p>
                <p className="ap-leader-desc">Pioneering our footprint across borders, Nadia bridges global synergy and local mastery, propelling our Reanda International partnership and global expansion initiatives.</p>
                <div className="ap-leader-badges">
                  <span><Globe size={18} /> Global Expansion</span>
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
              {[
                { name: 'Amor', role: 'Founding Partner & CEO', img: amorImg },
                { name: 'Nadia', role: 'Managing Director', img: nadiaImg },
                { name: 'Marcus', role: 'Senior Advisor', img: jobImg },
                { name: 'Elena', role: 'Client Relations Lead', img: contactImg },
                { name: 'James', role: 'Strategy Consultant', img: contactImg },
                { name: 'Sophia', role: 'Financial Analyst', img: jobImg },
                { name: 'David', role: 'Legal Expert', img: amorImg },
                { name: 'Isabella', role: 'Tax Associate', img: nadiaImg },
              ].map((member, index) => (
                <div className="ap-team-card" key={index}>
                  <img src={member.img} alt={member.name} className="ap-team-card-img" />
                  <div className="ap-team-card-info">
                    <div className="ap-team-card-header">
                      <div className="ap-team-member-text">
                        <h4>{member.name}</h4>
                        <p>{member.role}</p>
                      </div>
                      <button className="ap-team-cv-btn" title="Download CV">
                        <FileDown size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ap-text-center" style={{ marginTop: '4rem' }}>
            <button className="ap-cv-button">Join Our Team</button>
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
                BFC operates at the apex of global synergy as a proud member of <strong>Reanda International</strong>. 
                We fuse local mastery with unparalleled global reach, projecting our expertise across borders 
                through an elite matrix of independent firms.
              </p>

              <div className="ap-net-stats">
                <div className="ap-n-stat">
                  <div className="ap-n-num">50+</div>
                  <div className="ap-n-label">Countries</div>
                </div>
                <div className="ap-n-stat">
                  <div className="ap-n-num">250+</div>
                  <div className="ap-n-label">Global Offices</div>
                </div>
              </div>
            </div>

            <div className="ap-net-visuals rev-scale" style={{transitionDelay: '0.3s'}}></div>

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
              <span className="ap-eyebrow">Our Purpose</span>
              <h2 className="ap-heading-xl ap-navy-text">Empowering<br/>Transformation.</h2>
              <div className="ap-styled-divider"></div>
              <p className="ap-mission-text">
                Empowering clients via world-class methodologies and tailored agility to secure long-term paradigm shifts. We are committed to translating complex challenges into streamlined, actionable frameworks.
              </p>
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
              <span className="ap-eyebrow ap-teal-text">The Future</span>
              <h2 className="ap-heading-xl ap-text-white">Limitless<br/>Possibilities.</h2>
              <div className="ap-styled-divider ap-divider-light"></div>
              <p className="ap-vision-text">
                To command the forefront of the global advisory sector as the definitive partner for ambitious institutions. We envision a business landscape where integrity, innovation, and strategic foresight create limitless possibilities.
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
