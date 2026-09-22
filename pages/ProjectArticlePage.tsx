import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PROJECTS, Project, getClientLogo } from './OurProjectsPage';
import { API_URL } from '../utils/constants';
import { DetailBlock } from './ArticleBuilder';
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

export const ProjectArticlePage: React.FC = () => {
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
        <p>Loading project details...</p>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="project-article-empty">
        <h1>Project not found</h1>
        <p>The requested project article does not exist.</p>
        <Link to="/who-we-are/our-projects">Back to projects</Link>
      </section>
    );
  }

  const bullets = toBullets(project.description);
  const focusAreas = computeFocusAreas(project);

  let customFont = 'Inter';
  let customColor = '#374151';
  let customSize = '1rem';
  try {
    const c = JSON.parse(project.contentJson || '{}');
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
          <img src={project.imageUrl} alt={project.title} />
        </div>

        <div className="project-article__hero-panel">
          {(project.clientImageUrl || getClientLogo(project.client)) && (
            <img
              src={project.clientImageUrl
                ? (project.clientImageUrl.startsWith('/uploads/')
                    ? `${API_URL}${project.clientImageUrl}`
                    : project.clientImageUrl)
                : getClientLogo(project.client)}
              alt={`${project.client} logo`}
              className="project-article__hero-logo"
            />
          )}
          <div className="project-article__hero-top">
            <Link to="/who-we-are/our-projects" className="project-article__back">
              Back to Projects
            </Link>
            <span className="project-article__eyebrow">Project Reference</span>
          </div>

          <h1 className="project-article__title">{project.title}</h1>

          <p className="project-article__subtitle">
            Detailed mission brief for {project.client}, focused on {project.category.toLowerCase()} outcomes in {project.country}.
          </p>


          <div className="project-article__hero-stats">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.25rem' }}>
                {project.flag && (
                  <img 
                    src={project.flag} 
                    alt={project.country} 
                    style={{ width: '20px', height: '14px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(0,0,0,0.1)' }} 
                  />
                )}
                <p className="project-article__stat-value" style={{ margin: 0 }}>{project.country}</p>
              </div>
              <p className="project-article__stat-label">Country</p>
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
                      periodText = `${fmt.format(s)} – Present`;
                      const e = new Date();
                      const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
                      if (months >= 0) monthsText = ` (${months} months)`;
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
              <p className="project-article__stat-label">Period</p>
            </div>
            <div>
              <p className="project-article__stat-value">{project.category}</p>
              <p className="project-article__stat-label">Category</p>
            </div>
          </div>
        </div>
      </header>

      <section className="project-article__body">
        <div className="project-article__content">
          {(() => {
            let parsedSections = null;
            try {
              const c = JSON.parse(project.contentJson || '{}');
              if (c.sections && c.sections.length > 0) parsedSections = c.sections;
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
                  This project was delivered as a strategic intervention to improve organizational performance,
                  implementation capability, and measurable impact for the client institution.
                </p>

                <div className="project-article__callout project-article__reveal">
                  <p className="project-article__callout-title">Executive summary</p>
                  <p>{project.description}</p>
                </div>

                <h2 id="context" className="project-article__reveal">Mission Context</h2>
                <p>
                  In {project.country}, {project.client} commissioned this mission to address priorities in {project.category.toLowerCase()}.
                  The engagement combined assessment, design, and implementation support to ensure practical and sustainable outcomes.
                </p>

                <h2 id="focus" className="project-article__reveal">Key Workstreams</h2>
                <div className="project-article__insights project-article__reveal">
                  <div>
                    <h3>Primary focus</h3>
                    <ul>
                      {focusAreas.map((focus) => (
                        <li key={focus}>{focus}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Executed activities</h3>
                    <ul>
                      {bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <h2 id="impact" className="project-article__reveal">Strategic Impact</h2>
                <blockquote className="project-article__reveal">{computeStrategicImpact(project)}</blockquote>

                <h2 id="delivery" className="project-article__reveal">Delivery Approach</h2>
                <ol className="project-article__roadmap project-article__reveal">
                  <li><strong>Diagnosis:</strong> baseline assessment of context, systems, and constraints.</li>
                  <li><strong>Design:</strong> co-construction of a realistic roadmap with stakeholders.</li>
                  <li><strong>Execution support:</strong> operational guidance, capacity transfer, and follow-up actions.</li>
                </ol>
              </>
            );
          })()}
        </div>

        <aside className="project-article__sidebar">
          <div className="project-article__card project-article__reveal">
            <p className="project-article__card-label">In this project article</p>
            <a href="#context" className="project-article__toc-link">Mission Context</a>
            <a href="#focus" className="project-article__toc-link">Key Workstreams</a>
            <a href="#impact" className="project-article__toc-link">Strategic Impact</a>
            <a href="#delivery" className="project-article__toc-link">Delivery Approach</a>
          </div>

          <div className="project-article__card project-article__reveal">
            <p className="project-article__card-label">Project facts</p>
            {project.clientImageUrl && (
              <div style={{ marginBottom: '0.6rem' }}>
                <img 
                  src={project.clientImageUrl.startsWith('/uploads/')
                    ? `${API_URL}${project.clientImageUrl}`
                    : project.clientImageUrl}
                  alt={project.client}
                  style={{ maxHeight: 40, maxWidth: '80%', objectFit: 'contain' }}
                />
              </div>
            )}
            <p className="project-article__card-copy"><strong>Client:</strong> {project.client}</p>
            <p className="project-article__card-copy"><strong>Country:</strong> {project.country}</p>
            <p className="project-article__card-copy"><strong>Period:</strong> {
              (() => {
                const sd = project.startDate?.trim();
                const ed = project.endDate?.trim();
                if (sd) return ed && ed !== sd ? `${sd} – ${ed}` : sd;
                return project.year || '—';
              })()
            }</p>
            <p className="project-article__card-copy"><strong>Domain:</strong> {project.category}</p>
          </div>

          {project.relatedArticles && project.relatedArticles.length > 0 && (
            <div className="project-article__card project-article__reveal">
              <p className="project-article__card-label">Related Articles</p>
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
                    <span style={{ marginRight: '6px' }}>↗</span> {article.title}
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
            <p className="project-article__cta-eyebrow">Continue exploring</p>
            <h3>Browse the full project portfolio</h3>
          </div>
          <Link to="/who-we-are/our-projects" className="project-article__cta-button">
            Back to projects
          </Link>
        </div>
      </section>

      <section className="project-article__contact">
        <div className="project-article__contact-inner">
          <p className="project-article__contact-eyebrow">Contact</p>
          <h3>Need a similar project delivered for your institution?</h3>
          <p>
            Our team can help you scope the mission, define priorities, and build an
            actionable roadmap tailored to your context.
          </p>
          <div className="project-article__contact-actions">
            <Link to="/contact" className="project-article__contact-button project-article__contact-button--primary">
              Contact us
            </Link>
            <Link to="/who-we-are/our-projects" className="project-article__contact-button project-article__contact-button--secondary">
              More projects
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
};
