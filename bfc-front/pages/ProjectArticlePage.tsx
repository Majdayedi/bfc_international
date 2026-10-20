import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PROJECTS, Project, getClientLogo } from './OurProjectsPage';
import { API_URL } from '../utils/constants';
import { DetailBlock } from './ArticleBuilder';
import { useLanguage, localizedField, localizedVariant } from '../src/i18n';
import './ProjectArticlePage.css';

export function toBullets(description: string) {
  const semicolonItems = description
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean);

  if (semicolonItems.length) {
    return semicolonItems.slice(0, 7);
  }

  return description
    .split('.')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 7);
}

export function computeStrategicImpact(project: Project) {
  const c = project.category.toLowerCase();

  if (c.includes('digital trust')) {
    return `The mission consolidates digital trust foundations in ${project.country}, enabling secure transactions, stronger compliance, and scalable digital public or private services.`;
  }

  if (c.includes('ict') || c.includes('digital')) {
    return `The engagement accelerates digital modernization for ${project.client} through better systems, more reliable data, and higher operational responsiveness.`;
  }

  if (c.includes('strategy')) {
    return `The assignment aligns long-term vision with an executable roadmap, helping ${project.client} translate strategic priorities into measurable transformation outcomes.`;
  }

  if (c.includes('governance') || c.includes('organizational')) {
    return `The intervention improves governance clarity, operating discipline, and accountability, creating a stronger institutional base for sustained delivery.`;
  }

  if (c.includes('risk') || c.includes('audit')) {
    return `The mission strengthens control maturity and risk visibility, reducing exposure while improving decision quality and resilience.`;
  }

  if (c.includes('training')) {
    return `The project builds practical capabilities for stakeholders and teams, ensuring continuity and ownership beyond the initial delivery phase.`;
  }

  return `The mission delivers concrete modernization outcomes by combining strategy, execution support, and institutional capability development.`;
}

export function computeFocusAreas(project: Project) {
  const category = project.category.toLowerCase();

  if (category.includes('strategy')) {
    return ['Strategic diagnosis', 'Roadmap design', 'Stakeholder alignment'];
  }
  if (category.includes('digital trust')) {
    return ['Regulatory alignment', 'Trust framework design', 'Operational deployment'];
  }
  if (category.includes('ict') || category.includes('digital')) {
    return ['Process digitalization', 'Systems design', 'Change enablement'];
  }
  if (category.includes('governance') || category.includes('organizational')) {
    return ['Governance structuring', 'Role clarification', 'Performance steering'];
  }
  if (category.includes('risk') || category.includes('audit')) {
    return ['Risk identification', 'Control architecture', 'Audit enablement'];
  }

  return ['Assessment', 'Implementation support', 'Capacity building'];
}

/* Translation-key tables mirroring computeStrategicImpact / computeFocusAreas
   above (those stay English — they feed the ProjectBuilder preview). Values
   live in src/locales/{en,fr,ar}.json and are translated via t() at render. */
const STRATEGIC_IMPACT_KEYS: { match: string[]; key: string }[] = [
  { match: ['digital trust'], key: 'projectArticle.impactDigitalTrust' },
  { match: ['ict', 'digital'], key: 'projectArticle.impactDigital' },
  { match: ['strategy'], key: 'projectArticle.impactStrategy' },
  { match: ['governance', 'organizational'], key: 'projectArticle.impactGovernance' },
  { match: ['risk', 'audit'], key: 'projectArticle.impactRisk' },
  { match: ['training'], key: 'projectArticle.impactTraining' },
];

const strategicImpactKey = (category: string): string => {
  const c = category.toLowerCase();
  const found = STRATEGIC_IMPACT_KEYS.find((e) => e.match.some((m) => c.includes(m)));
  return found ? found.key : 'projectArticle.impactDefault';
};

const FOCUS_AREA_KEYS: { match: string[]; keys: string[] }[] = [
  {
    match: ['strategy'],
    keys: [
      'projectArticle.focusStrategicDiagnosis',
      'projectArticle.focusRoadmapDesign',
      'projectArticle.focusStakeholderAlignment',
    ],
  },
  {
    match: ['digital trust'],
    keys: [
      'projectArticle.focusRegulatoryAlignment',
      'projectArticle.focusTrustFramework',
      'projectArticle.focusOperationalDeployment',
    ],
  },
  {
    match: ['ict', 'digital'],
    keys: [
      'projectArticle.focusProcessDigitalization',
      'projectArticle.focusSystemsDesign',
      'projectArticle.focusChangeEnablement',
    ],
  },
  {
    match: ['governance', 'organizational'],
    keys: [
      'projectArticle.focusGovernanceStructuring',
      'projectArticle.focusRoleClarification',
      'projectArticle.focusPerformanceSteering',
    ],
  },
  {
    match: ['risk', 'audit'],
    keys: [
      'projectArticle.focusRiskIdentification',
      'projectArticle.focusControlArchitecture',
      'projectArticle.focusAuditEnablement',
    ],
  },
];

const focusAreaKeys = (category: string): string[] => {
  const c = category.toLowerCase();
  const found = FOCUS_AREA_KEYS.find((e) => e.match.some((m) => c.includes(m)));
  return found
    ? found.keys
    : [
        'projectArticle.focusAssessment',
        'projectArticle.focusImplementationSupport',
        'projectArticle.focusCapacityBuilding',
      ];
};

export const ProjectArticlePage: React.FC = () => {
  const { t, lang } = useLanguage();
  const { projectId } = useParams();
  const progressRef = React.useRef<HTMLSpanElement>(null);
  const articleRef = React.useRef<HTMLElement>(null);

  const staticFallback = useMemo(() => {
    const id = Number(projectId);
    if (Number.isNaN(id)) return null;
    return PROJECTS.find((p) => p.id === id) ?? null;
  }, [projectId]);

  const [project, setProject] = useState<any>(() => staticFallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    fetch(`${API_URL}/api/projects/${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching project details:', err);
        setProject(staticFallback);
        setLoading(false);
      });
  }, [projectId, staticFallback]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      const heroDistance = Math.max(window.innerHeight * 0.65, 1);
      const hp = Math.min(scrollTop / heroDistance, 1);
      if (articleRef.current) articleRef.current.style.setProperty('--hero-progress', hp.toString());
    };

    const handleScroll = () => {
      window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!project) return;
    const elements = Array.from(document.querySelectorAll('.project-article__reveal')) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.14 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [project]);

  if (loading && !project) {
    return (
      <section className="project-article-empty">
        <p>{t('projectArticle.loading')}</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="project-article-empty">
        <h1>{t('projectArticle.notFoundTitle')}</h1>
        <p>{t('projectArticle.notFoundText')}</p>
        <Link to="/who-we-are/our-projects">{t('projectArticle.backToProjects')}</Link>
      </section>
    );
  }

  const bullets = toBullets(localizedField(project, 'description', lang));
  const focusAreas = focusAreaKeys(project.category).map((key) => t(key));

  let customFont = 'Inter';
  let customColor = '#374151';
  let customSize = '1rem';
  // What the visitor sees: the FR/AR body when that version exists, else EN.
  const localizedBody = localizedVariant(project, 'contentJson', lang);
  try {
    const c = JSON.parse(localizedBody || project.contentJson || '{}');
    customFont = c.fontFamily || customFont;
    customColor = c.textColor || customColor;
    customSize = c.fontSize || customSize;
  } catch (e) {}

  return (
    <article className="project-article" ref={articleRef} style={{ 
      ['--hero-progress' as any]: 0,
      ['--ab-font' as any]: customFont,
      ['--ab-color' as any]: customColor,
      ['--ab-size' as any]: customSize,
      fontFamily: 'var(--ab-font)',
      color: 'var(--ab-color)',
      fontSize: 'var(--ab-size)'
    }}>
      <div className="project-article__progress">
        <span ref={progressRef} style={{ transform: `scaleX(0)` }} />
      </div>

      <header className="project-article__hero">
        <div className="project-article__hero-media">
          <img src={project.imageUrl} alt={localizedField(project, 'title', lang)} />
        </div>

        <div className="project-article__hero-panel">
          {(project.clientImageUrl || getClientLogo(project.client)) && (
            <img
              src={project.clientImageUrl
                ? (project.clientImageUrl.startsWith('/uploads/')
                    ? `${API_URL}${project.clientImageUrl}`
                    : project.clientImageUrl)
                : getClientLogo(project.client)}
              alt={t('projectArticle.logoAlt', { client: localizedField(project, 'client', lang) })}
              className="project-article__hero-logo"
            />
          )}
          <div className="project-article__hero-top">
            <Link to="/who-we-are/our-projects" className="project-article__back">
              {t('projectArticle.backToProjects')}
            </Link>
            <span className="project-article__eyebrow">{t('projectArticle.eyebrow')}</span>
          </div>

          <h1 className="project-article__title">{localizedField(project, 'title', lang)}</h1>

          <p className="project-article__subtitle">
            {t('projectArticle.subtitle', {
              client: localizedField(project, 'client', lang),
              category: project.category.toLowerCase(),
              country: localizedField(project, 'country', lang),
            })}
          </p>


          <div className="project-article__hero-stats">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                {project.flag && (
                  <img 
                    src={project.flag} 
                    alt={localizedField(project, 'country', lang)} 
                    style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(0,0,0,0.1)' }} 
                  />
                )}
                <p className="project-article__stat-value" style={{ margin: 0 }}>{localizedField(project, 'country', lang)}</p>
              </div>
              <p className="project-article__stat-label">{t('projectArticle.country')}</p>
            </div>
            <div>
              {(() => {
                const sd = project.startDate?.trim();
                const ed = project.endDate?.trim();
                let periodText = project.year || '—';
                let monthsText = '';
                
                if (sd) {
                  const s = new Date(sd);
                  if (!isNaN(s.getTime())) {
                    const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' });
                    
                    if (ed === 'ongoing') {
                      periodText = `${fmt.format(s)} – ${t('projectArticle.present')}`;
                      const e = new Date();
                      const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
                      if (months >= 0) monthsText = ` ${t('projectArticle.months', { months })}`;
                    } else if (ed) {
                      const e = new Date(ed);
                      if (!isNaN(e.getTime())) {
                        periodText = `${fmt.format(s)} – ${fmt.format(e)}`;
                        const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
                        if (months >= 0) monthsText = ` (${months} months)`;
                      } else {
                        periodText = `${sd} – ${ed}`;
                      }
                    } else {
                      periodText = fmt.format(s);
                    }
                  } else {
                    periodText = ed ? `${sd} – ${ed}` : sd;
                  }
                }
                
                return (
                  <div>
                    <p className="project-article__stat-value" style={{ fontSize: monthsText ? '0.9rem' : undefined }}>{periodText}</p>
                    {monthsText && <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0, fontWeight: 600 }}>{monthsText.trim()}</p>}
                  </div>
                );
              })()}
              <p className="project-article__stat-label">{t('projectArticle.period')}</p>
            </div>
            <div>
              <p className="project-article__stat-value">{localizedField(project, 'category', lang)}</p>
              <p className="project-article__stat-label">{t('projectArticle.category')}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="project-article__body">
        <div className="project-article__content">
          {(() => {
            let parsedSections: any[] | null = null;
            try {
              // FR/AR version when written (it is authoritative, even with zero
              // sections), otherwise the English blob with its generic fallback.
              const c = JSON.parse((localizedBody || project.contentJson) || '{}');
              if (localizedBody) parsedSections = Array.isArray(c.sections) ? c.sections : [];
              else if (Array.isArray(c.sections) && c.sections.length > 0) parsedSections = c.sections;
            } catch { /* ignore */ }

            if (parsedSections) {
              return parsedSections.map((s: any, i: number) => {
                const heading = s.title || s.h2;
                return (
                  <div key={i} className="project-article__reveal">
                    {heading && <h2 id={heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}>{heading}</h2>}
                    {s.blocks && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {s.blocks.map((block: any, bi: number) => (
                        <DetailBlock key={block.id || bi} block={block} />
                      ))}
                    </div>
                  )}
                </div>
                );
              });
            }

            return (
              <>
                <p className="project-article__lead project-article__reveal">
                  {t('projectArticle.lead')}
                </p>

                <div className="project-article__callout project-article__reveal">
                  <p className="project-article__callout-title">{t('projectArticle.executiveSummary')}</p>
                  <p>{localizedField(project, 'description', lang)}</p>
                </div>

                <h2 id="context" className="project-article__reveal">{t('projectArticle.missionContext')}</h2>
                <p>
                  {t('projectArticle.contextText', {
                    country: localizedField(project, 'country', lang),
                    client: localizedField(project, 'client', lang),
                    category: project.category.toLowerCase(),
                  })}
                </p>

                <h2 id="focus" className="project-article__reveal">{t('projectArticle.keyWorkstreams')}</h2>
                <div className="project-article__insights project-article__reveal">
                  <div>
                    <h3>{t('projectArticle.primaryFocus')}</h3>
                    <ul>
                      {focusAreas.map((focus) => (
                        <li key={focus}>{focus}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>{t('projectArticle.executedActivities')}</h3>
                    <ul>
                      {bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <h2 id="impact" className="project-article__reveal">{t('projectArticle.strategicImpact')}</h2>
                <blockquote className="project-article__reveal">
                  {t(strategicImpactKey(project.category), {
                    client: localizedField(project, 'client', lang),
                    country: localizedField(project, 'country', lang),
                  })}
                </blockquote>

                <h2 id="delivery" className="project-article__reveal">{t('projectArticle.deliveryApproach')}</h2>
                <ol className="project-article__roadmap project-article__reveal">
                  <li><strong>{t('projectArticle.diagnosisLabel')}</strong> {t('projectArticle.diagnosisText')}</li>
                  <li><strong>{t('projectArticle.designLabel')}</strong> {t('projectArticle.designText')}</li>
                  <li><strong>{t('projectArticle.executionLabel')}</strong> {t('projectArticle.executionText')}</li>
                </ol>
              </>
            );
          })()}
        </div>

        <aside className="project-article__sidebar">
          <div className="project-article__card project-article__reveal">
            <p className="project-article__card-label">{t('projectArticle.inThisArticle')}</p>
            <a href="#context" className="project-article__toc-link">{t('projectArticle.missionContext')}</a>
            <a href="#focus" className="project-article__toc-link">{t('projectArticle.keyWorkstreams')}</a>
            <a href="#impact" className="project-article__toc-link">{t('projectArticle.strategicImpact')}</a>
            <a href="#delivery" className="project-article__toc-link">{t('projectArticle.deliveryApproach')}</a>
          </div>

          <div className="project-article__card project-article__reveal">
            <p className="project-article__card-label">{t('projectArticle.projectFacts')}</p>
            {project.clientImageUrl && (
              <div style={{ marginBottom: '0.6rem' }}>
                <img 
                  src={project.clientImageUrl.startsWith('/uploads/')
                    ? `${API_URL}${project.clientImageUrl}`
                    : project.clientImageUrl}
                  alt={localizedField(project, 'client', lang)}
                  style={{ maxHeight: 40, maxWidth: '80%', objectFit: 'contain' }}
                />
              </div>
            )}
            <p className="project-article__card-copy"><strong>{t('projectArticle.clientLabel')}</strong> {localizedField(project, 'client', lang)}</p>
            <p className="project-article__card-copy"><strong>{t('projectArticle.countryLabel')}</strong> {localizedField(project, 'country', lang)}</p>
            <p className="project-article__card-copy"><strong>{t('projectArticle.periodLabel')}</strong> {
              (() => {
                const sd = project.startDate?.trim();
                const ed = project.endDate?.trim();
                if (sd) return ed && ed !== sd ? `${sd} – ${ed}` : sd;
                return project.year || '—';
              })()
            }</p>
            <p className="project-article__card-copy"><strong>{t('projectArticle.domainLabel')}</strong> {localizedField(project, 'category', lang)}</p>
          </div>

          {project.relatedArticles && project.relatedArticles.length > 0 && (
            <div className="project-article__card project-article__reveal">
              <p className="project-article__card-label">{t('projectArticle.relatedArticles')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto', paddingRight: '4px' }}>
                {project.relatedArticles.map((article: any) => (
                  <Link
                    key={article.id}
                    to={`/articles/${article.slug}`}
                    className="project-article__toc-link"
                    style={{ 
                      color: '#1f4a96', 
                      margin: 0, 
                      fontSize: '0.88rem', 
                      lineHeight: '1.4', 
                      borderBottom: '1px solid rgba(31, 74, 150, 0.1)', 
                      paddingBottom: '0.5rem' 
                    }}
                  >
                    <span style={{ marginRight: '6px' }}>↗</span> {localizedField(article, 'title', lang)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>

      <section className="project-article__cta">
        <div className="project-article__cta-inner">
          <div>
            <p className="project-article__cta-eyebrow">{t('projectArticle.continueExploring')}</p>
            <h3>{t('projectArticle.browsePortfolio')}</h3>
          </div>
          <Link to="/who-we-are/our-projects" className="project-article__cta-button">
            {t('projectArticle.backToProjects')}
          </Link>
        </div>
      </section>

      <section className="project-article__contact">
        <div className="project-article__contact-inner">
          <p className="project-article__contact-eyebrow">{t('projectArticle.contact')}</p>
          <h3>{t('projectArticle.contactTitle')}</h3>
          <p>
            {t('projectArticle.contactText')}
          </p>
          <div className="project-article__contact-actions">
            <Link to="/contact" className="project-article__contact-button project-article__contact-button--primary">
              {t('projectArticle.contactUs')}
            </Link>
            <Link to="/who-we-are/our-projects" className="project-article__contact-button project-article__contact-button--secondary">
              {t('projectArticle.moreProjects')}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
};
