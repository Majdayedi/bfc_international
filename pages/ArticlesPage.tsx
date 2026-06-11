import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ArticlesPage.css';

export const ARTICLES = [
  {
    id: '01',
    category: 'Strategy',
    title: 'Digital Transformation in Africa and MENA: Why Strategy, Not Technology, Determines Outcomes',
    slug: 'digitalization-strategy',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800',
    metaDescription: 'Learn why successful digital transformation in Africa depends on strategy, governance, and trust infrastructure—not just technology.',
    tags: ['Digital Transformation', 'Government Strategy', 'Digital Economy', 'Public Sector', 'Africa Innovation', 'Policy & Governance'],
    flag: {
      alt: 'tunisia',
      src: 'https://flagcdn.com/w80/tn.png',
    },
  },
  {
    id: '02',
    category: 'Policy',
    title: 'SME Formalization and Digitalization in Africa: A Strategic Lever for Growth, Tax Revenue, and Financial Inclusion',
    slug: 'sme-formalization',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800',
    metaDescription: 'Discover how digitalization enables SME formalization, financial inclusion, and economic growth across Africa and MENA.',
    tags: ['SMEs', 'Financial Inclusion', 'Digital Economy', 'Entrepreneurship', 'Africa Growth', 'Informal Economy'],
    flag: {
      alt: 'senegal',
      src: 'https://flagcdn.com/w80/sn.png',
    },
  },
  {
    id: '03',
    category: 'Tech',
    title: 'Why Timing Matters: The Cost of Delaying PKI Implementation In Africa',
    slug: 'pki-timing-matters',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800',
    metaDescription: 'Delaying PKI implementation increases costs, complexity, and risks in national digital strategies. Learn why trust infrastructure is critical for digital economies in Africa and MENA.',
    tags: ['Digital Strategy', 'PKI', 'Government Transformation', 'Interoperability', 'Public Sector Innovation', 'Africa Governance'],
     flag: {
      alt: 'guinee',
      src: 'https://flagcdn.com/w80/gn.png',
    },
  },
  {
    id: '04',
    category: 'Tech',
    title: 'Public Key Infrastructure (PKI) in Africa: The Strategic Backbone of Digital Trust, Sovereignty, and Scalable Services',
    slug: 'pki-strategic-backbone',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800',
    // description removed
    metaDescription: 'Explore how Public Key Infrastructure (PKI) enables secure digital identity, trusted transactions, and scalable e-government systems across Africa and MENA.',
    tags: ['PKI', 'Digital Trust', 'Cybersecurity', 'E-Government', 'Digital Identity', 'Africa Digital Transformation'],
    flag: {
      alt: 'mauritania',
      src:'https://flagcdn.com/cg.svg',
    },
  },
];


const COUNTRY_LABEL: Record<string, string> = { guinee: 'Guinea' };
const countryLabel = (alt: string) => COUNTRY_LABEL[alt] || (alt.charAt(0).toUpperCase() + alt.slice(1));
const ALL_CATEGORIES = ['All', ...Array.from(new Set(ARTICLES.map((a) => a.category)))];
const ALL_COUNTRIES = ['All', ...Array.from(new Set(ARTICLES.filter((a) => a.flag).map((a) => a.flag!.alt)))];

export const ArticlesPage: React.FC = () => {
  const [filterMode, setFilterMode] = useState<'category' | 'country'>('category');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCountry, setActiveCountry] = useState('All');

  const filtered = ARTICLES.filter((a) => {
    if (filterMode === 'category') return activeCategory === 'All' || a.category === activeCategory;
    return activeCountry === 'All' || a.flag?.alt === activeCountry;
  });

  return (
    <section className="articles">
      <div className="articles__container">
        <header className="articles__hero">
          <div className="articles__hero-left">
            <p className="articles__eyebrow">Articles</p>
            <h1 className="articles__title">BFC Journal</h1>
            <p className="articles__subtitle">
              Explore our latest research, insights, and case studies.
            </p>
          </div>
          
        </header>

       

        <div className="articles__filters">
          <div className="articles__filter-toggle">
            <button
              className={`articles__toggle-btn${filterMode === 'category' ? ' articles__toggle-btn--active' : ''}`}
              onClick={() => setFilterMode('category')}
            >
              By Category
            </button>
            <button
              className={`articles__toggle-btn${filterMode === 'country' ? ' articles__toggle-btn--active' : ''}`}
              onClick={() => setFilterMode('country')}
            >
              By Country
            </button>
          </div>

          {filterMode === 'category' && (
            <div className="articles__filter-row">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`articles__filter${activeCategory === cat ? ' articles__filter--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filterMode === 'country' && (
            <div className="articles__filter-row">
              {ALL_COUNTRIES.map((c) => (
                <button
                  key={c}
                  className={`articles__filter${activeCountry === c ? ' articles__filter--active' : ''}`}
                  onClick={() => setActiveCountry(c)}
                >
                  {c === 'All' ? 'All' : countryLabel(c)}
                </button>
              ))}
            </div>
          )}
        </div>

        <section className="articles__grid">
          {filtered.length === 0 && (
            <p className="articles__empty">No articles match the selected filters.</p>
          )}
          {filtered.map((article) => (
            <article key={article.id} className="article-card">
              <div className="article-card__image">
                <img src={article.image} alt={article.title} className="article-card__image-img" />
                <div className="article-card__image-overlay" />
                <div className="article-card__badges">
                  <span className="article-card__badge">{article.category}</span>
                  {article.flag ? (
                    <span className="article-card__flag" aria-label={article.flag.alt}>
                      <img src={article.flag.src} alt={article.flag.alt} />
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="article-card__body">
                <div className="article-card__meta">
                  <span className="article-card__time">{article.category}</span>
                  <span className="article-card__id">{article.id}</span>
                </div>
                <h3 className="article-card__title">{article.title}</h3>
                <p className="article-card__desc">{article.metaDescription}</p>
                <Link to={`/articles/${article.slug}`} className="article-card__button">
                  Read
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="articles__cta">
          <div className="articles-cta">
            <div>
              <p className="articles-cta__eyebrow">Stay updated</p>
              <h3 className="articles-cta__title">Get new articles in your inbox</h3>
              <p className="articles-cta__text">Monthly insights on strategy, innovation, and impact.</p>
            </div>
            <div className="articles-cta__actions">
              <input className="articles-cta__input" placeholder="Email address" />
              <button className="articles-cta__button">Subscribe</button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};