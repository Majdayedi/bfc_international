import React from 'react';
import { Link } from 'react-router-dom';
import './ArticlesPage.css';

// Using consistent slugs for URL paths
export const ARTICLES_GRID = [
  {
    id: '01',
    category: 'Strategy',
    title: 'Digital Transformation in Africa and MENA: Why Strategy, Not Technology, Determines Outcomes',
    slug: 'digitalization-strategy',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800',
    metaDescription: 'Learn why successful digital transformation in Africa depends on strategy, governance, and trust infrastructure—not just technology.',
    tags: ['Digital Transformation', 'Government Strategy', 'Digital Economy', 'Public Sector', 'Africa Innovation', 'Policy & Governance'],
  },
  {
    id: '02',
    category: 'Innovation',
    title: 'SME Formalization and Digitalization in Africa: A Strategic Lever for Growth, Tax Revenue, and Financial Inclusion',
    slug: 'sme-formalization',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800',
    metaDescription: 'Discover how digitalization enables SME formalization, financial inclusion, and economic growth across Africa and MENA.',
    tags: ['SMEs', 'Financial Inclusion', 'Digital Economy', 'Entrepreneurship', 'Africa Growth', 'Informal Economy'],
  },
  {
    id: '03',
    category: 'Policy',
    title: 'Why Timing Matters: The Cost of Delaying PKI Implementation In Africa',
    slug: 'pki-timing-matters',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800',
    metaDescription: 'Delaying PKI implementation increases costs, complexity, and risks in national digital strategies. Learn why trust infrastructure is critical for digital economies in Africa and MENA.',
    tags: ['Digital Strategy', 'PKI', 'Government Transformation', 'Interoperability', 'Public Sector Innovation', 'Africa Governance'],
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
  },
];

export const ArticlesPage: React.FC = () => {
  return (
    <main className="articles">
      <div className="articles__container">
        <header className="articles__hero">
          <h1 className="articles__title">BFC Journal</h1>
        </header>

        <section className="articles__grid">
          {ARTICLES_GRID.map((article) => (
            <article key={article.id} className="article-card">
              <div className="article-card__image">
                <img src={article.image} alt={article.title} className="article-card__image-img" />
              </div>
              <div className="article-card__body">
                <h2 className="article-card__title">{article.title}</h2>
                {/* description removed */}
                <div className="article-card__tags">
                  {article.tags && article.tags.map((tag: string) => (
                    <span key={tag} className="article-card__tag">{tag}</span>
                  ))}
                </div>
                <Link to={`/articles/${article.slug}`} className="article-card__button">
                  Read Article
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};