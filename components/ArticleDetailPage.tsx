import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ArticleDetailPage.css';

export const ArticleDetailPage: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setScrollProgress(progress);
      const heroDistance = Math.max(window.innerHeight * 0.65, 1);
      const heroScroll = Math.min(scrollTop / heroDistance, 1);
      setHeroProgress(heroScroll);
    };

    const handleScroll = () => {
      window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.article-detail__reveal')) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <article className="article-detail" style={{ ['--hero-progress' as any]: heroProgress }}>
      <div className="article-detail__progress">
        <span style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>
      <header className="article-detail__hero">
        <div className="article-detail__hero-media">
          <img
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=2400&auto=format&fit=crop"
            alt="Economic outlook and leadership"
          />
          
        </div>
        <div className="article-detail__hero-panel">
          <div className="article-detail__hero-top">
            <Link to="/articles" className="article-detail__back">
              Back to Articles
            </Link>
            <span className="article-detail__eyebrow">Research report</span>
          </div>
          <h1 className="article-detail__title">
            Europe’s Economic Strength: A Shared Mandate for Leaders and Citizens
          </h1>
          <p className="article-detail__subtitle">
            A new BFC survey signals rising concern about competitiveness—and outlines the near‑term actions that
            build confidence, productivity, and resilience.
          </p>
          <div className="article-detail__meta">
            <span>12 min read</span>
            <span>February 3, 2026</span>
            <span>By BFC Insights</span>
          </div>
          <div className="article-detail__hero-stats">
            <div>
              <p className="article-detail__stat-value">71%</p>
              <p className="article-detail__stat-label">Leaders cite competitiveness as a top-three risk</p>
            </div>
            <div>
              <p className="article-detail__stat-value">2.4x</p>
              <p className="article-detail__stat-label">Faster growth in regions investing in digital skills</p>
            </div>
            <div>
              <p className="article-detail__stat-value">$520B</p>
              <p className="article-detail__stat-label">Annual investment gap to reach global peers</p>
            </div>
          </div>
        </div>
      </header>

      <section className="article-detail__body">
        <div className="article-detail__content">
          <p className="article-detail__lead article-detail__reveal">
            Across the region, executives and citizens are converging on the same message: economic strength is the
            foundation of security, social cohesion, and innovation. The question is which actions land fastest.
          </p>

          <div className="article-detail__callout article-detail__reveal">
            <p className="article-detail__callout-title">Executive summary</p>
            <p>
              Confidence rises when public and private leaders align on investment priorities, address energy
              volatility, and accelerate productivity through digital enablement and skills.
            </p>
          </div>

          <h2 id="alignment" className="article-detail__reveal">
            1. The alignment signal
          </h2>
          <p>
            The strongest insight from the survey is not a single metric—it’s the convergence of perspectives.
            Leaders and citizens prioritize the same economic outcomes: higher productivity, resilient supply
            chains, and predictable energy costs.
          </p>

          <div className="article-detail__insights article-detail__reveal">
            <div>
              <h3>Shared priorities</h3>
              <ul>
                <li>Competitiveness and innovation capacity.</li>
                <li>Energy security and price stability.</li>
                <li>Workforce readiness for new industries.</li>
              </ul>
            </div>
            <div>
              <h3>Confidence builders</h3>
              <ul>
                <li>Visible infrastructure upgrades.</li>
                <li>Faster permitting and regulatory clarity.</li>
                <li>Public‑private investment pipelines.</li>
              </ul>
            </div>
          </div>

          <h2 id="productivity" className="article-detail__reveal">
            2. Closing the productivity gap
          </h2>
          <p>
            Productivity growth has lagged global peers. Leaders see three immediate levers: modernization of
            industrial assets, digitization of public services, and scaled adoption of AI‑assisted workflows.
          </p>

          <blockquote className="article-detail__reveal">
            “Competitiveness accelerates when policy, capital, and talent move together—not in sequence.”
          </blockquote>

          <h2 id="energy" className="article-detail__reveal">
            3. Energy and industrial resilience
          </h2>
          <p>
            Volatility in energy prices is a decisive factor in investment decisions. Companies are prioritizing
            diversified energy contracts, grid modernization, and localized supplier networks to reduce exposure.
          </p>

          <h2 id="talent" className="article-detail__reveal">
            4. Talent and technology at scale
          </h2>
          <p>
            Skills availability is the most cited constraint to growth. The fastest wins come from partnerships that
            combine vocational programs, reskilling incentives, and AI toolkits embedded in daily work.
          </p>

          <div className="article-detail__divider" />

          <div className="article-detail__slides article-detail__reveal">
            <div className="article-detail__slide">
              <p className="article-detail__slide-label">Focus area</p>
              <h3>Investment momentum</h3>
              <p>Targeted capital in grid modernization and digital infrastructure builds confidence quickly.</p>
            </div>
            <div className="article-detail__slide">
              <p className="article-detail__slide-label">Focus area</p>
              <h3>Industrial competitiveness</h3>
              <p>Reshoring critical capabilities lowers exposure to volatility and supply shocks.</p>
            </div>
            <div className="article-detail__slide">
              <p className="article-detail__slide-label">Focus area</p>
              <h3>Workforce readiness</h3>
              <p>Scaled training programs shorten time‑to‑productivity for new technologies.</p>
            </div>
          </div>

          <h2 id="roadmap" className="article-detail__reveal">
            Implementation roadmap
          </h2>
          <ol className="article-detail__roadmap article-detail__reveal">
            <li>
              <strong>First 100 days:</strong> Launch a competitiveness dashboard and fund pilot programs in digital
              infrastructure.
            </li>
            <li>
              <strong>6 months:</strong> Align energy contracts, incentives, and industrial policy around resilience.
            </li>
            <li>
              <strong>12 months:</strong> Scale workforce programs and AI enablement across priority sectors.
            </li>
          </ol>

          <div className="article-detail__author article-detail__reveal">
            <div className="article-detail__author-avatar">BI</div>
            <div>
              <p className="article-detail__author-name">BFC Insights</p>
              <p className="article-detail__author-role">Economic Competitiveness Practice</p>
            </div>
          </div>
        </div>

        <aside className="article-detail__sidebar">
          <div className="article-detail__card article-detail__reveal">
            <p className="article-detail__card-label">In this article</p>
            <a href="#alignment" className="article-detail__toc-link">
              The alignment signal
            </a>
            <a href="#productivity" className="article-detail__toc-link">
              Closing the productivity gap
            </a>
            <a href="#energy" className="article-detail__toc-link">
              Energy and industrial resilience
            </a>
            <a href="#talent" className="article-detail__toc-link">
              Talent and technology at scale
            </a>
            <a href="#roadmap" className="article-detail__toc-link">
              Implementation roadmap
            </a>
          </div>
          <div className="article-detail__card article-detail__reveal">
            <p className="article-detail__takeaways-label">Key takeaways</p>
            <ul>
              <li>Competitiveness is the top shared priority across leaders and citizens.</li>
              <li>Energy affordability and industrial resilience dominate risk perceptions.</li>
              <li>Digital infrastructure and skills are viewed as the fastest levers.</li>
            </ul>
          
          </div>
          <div className="article-detail__card article-detail__reveal">
            <p className="article-detail__card-label">Related</p>
            <Link to="/articles" className="article-detail__related-link">
              The Next Decade of Industrial Policy
            </Link>
            <Link to="/articles" className="article-detail__related-link">
              Rebuilding Energy Confidence
            </Link>
          </div>
        </aside>
      </section>

      <section className="article-detail__cta">
        <div className="article-detail__cta-inner">
          <div>
            <p className="article-detail__cta-eyebrow">Continue exploring</p>
            <h3>Read more from the BFC competitiveness series</h3>
          </div>
          <Link to="/articles" className="article-detail__cta-button">
            View all articles
          </Link>
        </div>
      </section>
    </article>
  );
};
