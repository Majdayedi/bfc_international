import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RepresentativeDetail.css';
import { PROJECTS, getClientLogo, type Project } from './OurProjectsPage';
import { useLanguage, localizedField } from '../src/i18n';
import { COUNTRIES_WITH_FLAGS } from '../utils/countriesWithFlags';

import congo from '../src/assets/representatives/congo.png';
import senegal from '../src/assets/representatives/senegal.png';
import guinee from '../src/assets/representatives/guinee.png';
import tunisia from '../src/assets/representatives/tunisia.png';
import mauritania from '../src/assets/representatives/mauritania.png';
import { API_URL } from '../utils/constants';

// Returns the CDN flag URL for a given country name
const getCountryFlagCdnUrl = (countryName: string | null | undefined): string => {
  if (!countryName) return '';
  const found = COUNTRIES_WITH_FLAGS.find(
    c => c.name.toLowerCase() === countryName.toLowerCase() ||
         c.code.toLowerCase() === countryName.toLowerCase()
  );
  return found ? found.flag : '';
};

// Returns the resolved flag URL: uploaded URL takes priority, then CDN lookup by countryName
const resolveManagerFlagUrl = (countryFlagUrl: string | null | undefined, countryName: string | null | undefined): string => {
  if (countryFlagUrl) return countryFlagUrl;
  return getCountryFlagCdnUrl(countryName);
};

// Returns extra flag image URL: stored url takes priority, then CDN lookup by name
const resolveExtraFlagUrl = (url: string | null | undefined, name: string | null | undefined): string => {
  if (url) return url;
  return getCountryFlagCdnUrl(name);
};



interface RepresentativeData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  location: string;
  manager?: any;
  globeMarkerTop: string;
  globeMarkerLeft: string;
  globeViewRotateY: string;
  globeViewMapX: string;
  flagIconUrl: string;
  imageUrl: string;
  projectCountries: string[];
  fallbackCountries?: string[];
};

function selectProjectsForRepresentative(data: RepresentativeData): {
  projects: Project[];
  usesRegionalFallback: boolean;
} {
  const projectCountries = data.projectCountries || [];
  const directProjects = PROJECTS.filter((project) => projectCountries.includes(project.country));
  if (directProjects.length > 0) {
    return {
      projects: directProjects.slice(0, 4),
      usesRegionalFallback: false,
    };
  }

  const fallbackCountries = data.fallbackCountries || [];
  if (fallbackCountries.length > 0) {
    const fallbackProjects = PROJECTS.filter((project) => fallbackCountries.includes(project.country));
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
  const { t, lang } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isGlobeAnimating, setIsGlobeAnimating] = useState(false);
  const globeAnimStartedRef = useRef(false);
  const [data, setData] = useState<RepresentativeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbProjects, setDbProjects] = useState<any[]>([]);

  const representativeMotivationPhotos: Record<string, string> = {
    congo,
    senegal,
    guinea: guinee,
    tunisia,
    mauritania,
  };
  
  const repId = id?.toLowerCase() || '';
  
  useEffect(() => {
    const fetchRep = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/representatives/${repId}`);
        if (res.ok) {
          const repData = await res.json();
          setData(repData);
        } else {
          setData(null);
        }
      } catch (e) {
        console.error(e);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects`);
        if (res.ok) {
          const projs = await res.json();
          setDbProjects(projs);
        }
      } catch (e) {
        console.error('Failed to fetch projects', e);
      }
    };

    fetchRep();
    fetchProjects();
  }, [repId]);

  const { projects: representativeProjects, usesRegionalFallback } = useMemo(() => {
    if (!data) return { projects: [], usesRegionalFallback: false };
    
    // First try to match by representativeSlug directly
    let matchedProjects = dbProjects.filter(p => p.representativeSlug === repId);
    if (matchedProjects.length > 0) return { projects: matchedProjects, usesRegionalFallback: false };

    // Fallback 1: match by projectCountries
    const projectCountries = data.projectCountries || [];
    matchedProjects = dbProjects.filter((project) => projectCountries.includes(project.country));
    if (matchedProjects.length > 0) {
      return {
        projects: matchedProjects.slice(0, 8),
        usesRegionalFallback: false,
      };
    }

    // Fallback 2: match by fallbackCountries
    const fallbackCountries = data.fallbackCountries || [];
    if (fallbackCountries.length > 0) {
      matchedProjects = dbProjects.filter((project) => fallbackCountries.includes(project.country));
      return {
        projects: matchedProjects.slice(0, 8),
        usesRegionalFallback: matchedProjects.length > 0,
      };
    }

    return { projects: [], usesRegionalFallback: false };
  }, [data, dbProjects, repId]);



  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    setIsGlobeAnimating(false);
    globeAnimStartedRef.current = false;
  }, [id]);

  useEffect(() => {
    if (!data) return;

    // Small delay to let React paint the DOM before observing
    const timeout = setTimeout(() => {
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
      }, { threshold: 0.05 });

      elements.forEach(el => observer.observe(el));

      // Safety fallback: force all rd-reveal elements visible after 1.2s
      // in case the IntersectionObserver doesn't fire (e.g. content already in viewport)
      const fallback = setTimeout(() => {
        document.querySelectorAll('.rd-reveal').forEach(el => el.classList.add('rd-visible'));
      }, 1200);

      return () => {
        observer.disconnect();
        clearTimeout(fallback);
      };
    }, 100);

    return () => clearTimeout(timeout);
  }, [data]);

  if (loading) {
    return (
      <div className="rd-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ color: '#204383', fontSize: '1.2rem', fontWeight: 600 }}>{t('rep.loading')}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rd-page rd-not-found">
        <h2>{t('rep.notFoundTitle')}</h2>
        <button className="rd-back-btn" onClick={() => navigate(-1)}>
          <span>&larr;</span> {t('rep.back')}
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
              <span className="rd-eyebrow rd-reveal">{t('rep.eyebrow')}</span>
              <div className="rd-title-wrapper rd-reveal">
                <img src={data.flagIconUrl} alt={t('rep.flagAlt')} className="rd-title-flag" />
                <h1 className="rd-title">{localizedField(data, 'title', lang).toUpperCase()}</h1>
                {/* Phones only: the office logo sits opposite the title instead of
                    dropping into its own stacked section below the text. Hidden
                    above 768px, where .rd-image-section renders the same image. */}
                {data.imageUrl && (
                  <img
                    src={data.imageUrl}
                    alt={t('rep.logoAlt', { title: localizedField(data, 'title', lang) })}
                    className="rd-title-logo"
                  />
                )}
              </div>
              <div className="rd-divider rd-reveal"></div>
              <h2 className="rd-subtitle rd-reveal">{localizedField(data, 'subtitle', lang).toUpperCase()}</h2>
              <p className="rd-desc rd-reveal">{localizedField(data, 'description', lang)}</p>
              
              <div className="rd-glass-card rd-reveal">
                <h3 className="rd-glass-title">{t('rep.glassTitle')}</h3>
                <p>
                  {t('rep.glassText')}
                </p>
              </div>
            </div>
          </div>

          <div className="rd-image-section rd-reveal">
            <div className="rd-logo-wrapper">
              <img src={data.imageUrl} alt={localizedField(data, 'title', lang)} className="rd-photo" />
            </div>
          </div>
          
        </div>

        {/* Representative Projects Section */}
        <div className="rd-rep-projects-section rd-reveal">
          <div className="rd-rep-projects-header">
            <span className="rd-projects-eyebrow">{t('rep.trackRecord')}</span>
            <h2 className="rd-projects-title">
              {usesRegionalFallback
                ? t('rep.keyRegionalReferences')
                : t('rep.keyProjectsIn', { city: data.location?.split(',')[0] || '' })}
            </h2>
          </div>

          {representativeProjects.length > 0 ? (
            <div className="rd-rep-projects-scroll">
              {representativeProjects.map((project) => {
                const logo = getClientLogo(project.client);
                return (
                  <div className="rd-rep-project-card" key={project.id}>
                    <div className="rd-rep-project-img-wrap">
                      <img src={project.imageUrl} alt={localizedField(project, 'title', lang)} className="rd-rep-project-img" />
                      <span className="rd-rep-project-cat">{localizedField(project, 'category', lang)}</span>
                      {logo && (
                        <div className="rd-ref-logo-badge">
                          <img src={logo} alt={localizedField(project, 'client', lang)} className="rd-ref-logo-img" />
                        </div>
                      )}
                    </div>
                    <div className="rd-rep-project-content" style={{ flex: 1 }}>
                      <span className="rd-rep-project-year">{project.year}</span>
                      <h3 className="rd-rep-project-name">{localizedField(project, 'title', lang)}</h3>
                      <p className="rd-rep-project-desc">{localizedField(project, 'description', lang)}</p>
                      <p className="rd-ref-client-name" style={{ marginBottom: '1.5rem' }}><strong>{t('rep.clientLabel')}</strong> {localizedField(project, 'client', lang)}</p>
                      <button
                        className="rd-back-btn"
                        style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '10px 18px', fontSize: '0.75rem', gap: '8px' }}
                        onClick={() => navigate(`/who-we-are/our-projects/${project.id}`)}
                      >
                        {t('rep.readArticle')} <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rd-rep-projects-empty">
              {t('rep.emptyState')}
            </div>
          )}
        </div>

        {/* Enhanced Bottom Section: Manager Left, Globe Right */}
        <div className="rd-bottom-section rd-reveal">
          <div className="rd-manager-col">
            {data.manager ? (
              <>
                <div className="rd-manager-photo-wrapper">
                  <img src={data.manager.img?.startsWith('http') ? data.manager.img : `${API_URL}${data.manager.img?.startsWith('/') ? '' : '/'}${data.manager.img || ''}`} alt={localizedField(data.manager, 'name', lang)} className="rd-manager-photo" />
                  <div className="rd-manager-flags-overlay">
                    {resolveManagerFlagUrl(data.manager.countryFlagUrl, data.manager.countryName) && (
                      <img
                        src={resolveManagerFlagUrl(data.manager.countryFlagUrl, data.manager.countryName)}
                        alt={localizedField(data.manager, 'countryName', lang) || t('rep.flagWord')}
                        title={localizedField(data.manager, 'countryName', lang)}
                        className="rd-manager-flag-img"
                      />
                    )}
                    {data.manager.extraFlags?.map((f: any, idx: number) => {
                      const flagSrc = resolveExtraFlagUrl(f.url, f.name);
                      return flagSrc ? (
                        <img key={idx} src={flagSrc} alt={localizedField(f, 'name', lang)} title={localizedField(f, 'name', lang)} className="rd-manager-flag-img" />
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="rd-manager-details">
                  <h4 className="rd-manager-name">{localizedField(data.manager, 'name', lang).toUpperCase()}</h4>
                  <p className="rd-manager-role">{localizedField(data.manager, 'role', lang).toUpperCase()}</p>
                  <div className="rd-manager-contact">
                    {data.manager.email && (
                      <a href={`mailto:${data.manager.email}`} className="rd-contact-link">
                        <span className="rd-icon">✉</span> {data.manager.email}
                      </a>
                    )}
                    {data.manager.phone && (
                      <a href={`tel:${data.manager.phone}`} className="rd-contact-link">
                        <span className="rd-icon">📞</span> {data.manager.phone}
                      </a>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="rd-manager-details" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('rep.noManager')}</p>
              </div>
            )}
          </div>

          <div className="rd-globe-section rd-reveal">
            <div className="rd-reanda-globe-wrap">
              <div
                className={`rd-globe-container ${isGlobeAnimating ? 'rd-globe-animate' : ''}`}
                style={
                  {
                    '--rd-stop-rotate-y': data.globeViewRotateY,
                    '--rd-map-stop-x': data.globeViewMapX,
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
                    top: data.globeMarkerTop,
                    left: data.globeMarkerLeft,
                  }}
                >
                  <div className="rd-marker-label">{localizedField(data, 'location', lang).toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rd-congo-motivation rd-reveal">
          <div className="rd-congo-motivation__content">
            <p className="rd-congo-motivation__text">
              {t('rep.motivation', { team: (localizedField(data, 'title', lang) || '').replace('BFC ', '') })}
            </p>
          </div>
          <div className="rd-congo-motivation__photo-wrap">
            <img
              src={representativeMotivationPhotos[repId] ?? data.imageUrl}
              alt={t('rep.motivationPhotoAlt', { title: localizedField(data, 'title', lang) })}
              className="rd-congo-motivation__photo"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default RepresentativeDetail;
