import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PROJECTS, Project } from './OurProjectsPage';
import './ProjectArticlePage.css';

function toBullets(description: string) {
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

function computeStrategicImpact(project: Project) {
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

function computeFocusAreas(project: Project) {
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);

  const project = useMemo(() => {
    const id = Number(projectId);
    if (Number.isNaN(id)) return null;
    return PROJECTS.find((p) => p.id === id) ?? null;
  }, [projectId]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setScrollProgress(progress);
      const heroDistance = Math.max(window.innerHeight * 0.65, 1);
      setHeroProgress(Math.min(scrollTop / heroDistance, 1));
    };

    const handleScroll = () => {
      window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
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
  }, [projectId]);

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

  return (
    <article className="project-article" style={{ ['--hero-progress' as any]: heroProgress }}>
      <div className="project-article__progress">
        <span style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      <header className="project-article__hero">
        <div className="project-article__hero-media">
          <img src={project.imageUrl} alt={project.title} />
        </div>

        <div className="project-article__hero-panel">
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

          <div className="project-article__meta">
            <span>{project.year}</span>
            <span>{project.country}</span>
            <span>{project.category}</span>
            <span>{project.client}</span>
          </div>

          <div className="project-article__hero-stats">
            <div>
              <p className="project-article__stat-value">{project.country}</p>
              <p className="project-article__stat-label">Intervention region</p>
            </div>
            <div>
              <p className="project-article__stat-value">{project.year}</p>
              <p className="project-article__stat-label">Mission period</p>
            </div>
            <div>
              <p className="project-article__stat-value">{project.category}</p>
              <p className="project-article__stat-label">Project domain</p>
            </div>
          </div>
        </div>
      </header>

      <section className="project-article__body">
        <div className="project-article__content">
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
            <p className="project-article__card-copy"><strong>Client:</strong> {project.client}</p>
            <p className="project-article__card-copy"><strong>Country:</strong> {project.country}</p>
            <p className="project-article__card-copy"><strong>Period:</strong> {project.year}</p>
            <p className="project-article__card-copy"><strong>Domain:</strong> {project.category}</p>
          </div>
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
