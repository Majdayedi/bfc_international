import React from 'react';
import { Link } from 'react-router-dom';
import './ArticlesPage.css';

const CATEGORIES = ['All', 'Strategy', 'Innovation', 'Culture', 'Tech', 'Insights'];

const ARTICLES = [
  {
    id: '01',
    category: 'Strategy',
    title: 'The Future of AI in African Fintech',
    desc: 'How next‑gen models are reshaping banking and trust in emerging markets.',
    readTime: '6 min read',
    flag: {
      alt: 'Nigeria',
      src: 'https://flagcdn.com/w80/ng.png',
    },
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1800&auto=format&fit=crop',
    href: '/articles/ai-fintech',
  },
  {
    id: '02',
    category: 'Innovation',
    title: 'Scaling Digital Public Goods',
    desc: 'Decentralized identity and public infrastructure for inclusive services.',
    readTime: '8 min read',
    flag: {
      alt: 'Kenya',
      src: 'https://flagcdn.com/w80/ke.png',
    },
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1800&auto=format&fit=crop',
  },
  {
    id: '03',
    category: 'Culture',
    title: 'The Decentralized Workforce',
    desc: 'Building distributed cultures across regions and time zones.',
    readTime: '5 min read',
    flag: {
      alt: 'South Africa',
      src: 'https://flagcdn.com/w80/za.png',
    },
    image:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1800&auto=format&fit=crop',
  },
  {
    id: '04',
    category: 'Tech',
    title: 'Green Infrastructure Solutions',
    desc: 'Sustainable architecture for high‑growth technology ecosystems.',
    readTime: '7 min read',
    flag: {
      alt: 'Rwanda',
      src: 'https://flagcdn.com/w80/rw.png',
    },
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1800&auto=format&fit=crop',
  },
  {
    id: '05',
    category: 'Insights',
    title: 'Visual Trust & Modern Design',
    desc: 'How aesthetics and micro‑interactions change user behavior.',
    readTime: '4 min read',
    flag: {
      alt: 'Ghana',
      src: 'https://flagcdn.com/w80/gh.png',
    },
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1800&auto=format&fit=crop',
  },
  {
    id: '06',
    category: 'Strategy',
    title: 'Resilient Strategy for Public Systems',
    desc: 'Practical frameworks for modernization under constraints.',
    readTime: '9 min read',
    flag: {
      alt: 'Egypt',
      src: 'https://flagcdn.com/w80/eg.png',
    },
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1800&auto=format&fit=crop',
  },
];

const FEATURED = {
  category: 'Featured',
  title: 'Designing Trust at Scale',
  desc: 'A practical blueprint for leaders building trustworthy digital systems across Africa.',
  readTime: '10 min read',
};

export const ArticlesPage: React.FC = () => {
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

       

        <section className="articles__filters">
          {CATEGORIES.map((category) => (
            <button key={category} className="articles__filter">
              {category}
            </button>
          ))}
        </section>

        <section className="articles__grid">
          {ARTICLES.map((article) => (
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
                  <span className="article-card__time">{article.readTime}</span>
                  <span className="article-card__id">{article.id}</span>
                </div>
                <h3 className="article-card__title">{article.title}</h3>
                <p className="article-card__desc">{article.desc}</p>
                  {article.href ? (
                    <Link to={article.href} className="article-card__button">
                      Read
                    </Link>
                  ) : (
                    <button className="article-card__button">Read</button>
                  )}
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
