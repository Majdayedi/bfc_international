import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import { useLanguage, localizedField } from '../src/i18n';
import './ArticlesPage.css';

export const ArticlesPage: React.FC = () => {
  const { t, lang } = useLanguage();
  const [articles, setArticles] = useState<any[]>([]);
  const [filterMode, setFilterMode] = useState<'category' | 'country'>('category');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCountry, setActiveCountry] = useState('All');

  useEffect(() => {
    fetch(`${API_URL}/api/articles`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((a: any) => {
          let isDraft = false;
          let isTopArticle = false;
          try {
            const content = JSON.parse(a.contentJson || '{}');
            isDraft = content.isPublished === false;
            isTopArticle = content.isTopArticle === true;
          } catch { /* ignore */ }

          let tags: string[] = [];
          let flag = null;
          
          const slugFlags: Record<string, { alt: string; src: string }> = {
            'digitalization-strategy': { alt: 'tunisia', src: 'https://flagcdn.com/w80/tn.png' },
            'sme-formalization': { alt: 'senegal', src: 'https://flagcdn.com/w80/sn.png' },
            'pki-timing-matters': { alt: 'guinee', src: 'https://flagcdn.com/w80/gn.png' },
            'pki-strategic-backbone': { alt: 'mauritania', src: 'https://flagcdn.com/cg.svg' }
          };
          flag = slugFlags[a.slug] || null;

          const slugTags: Record<string, string[]> = {
            'digitalization-strategy': ['Digital Transformation', 'Government Strategy', 'Digital Economy', 'Public Sector', 'Africa Innovation', 'Policy & Governance'],
            'sme-formalization': ['SMEs', 'Financial Inclusion', 'Digital Economy', 'Entrepreneurship', 'Africa Growth', 'Informal Economy'],
            'pki-timing-matters': ['Digital Strategy', 'PKI', 'Government Transformation', 'Interoperability', 'Public Sector Innovation', 'Africa Governance'],
            'pki-strategic-backbone': ['PKI', 'Digital Trust', 'Cybersecurity', 'E-Government', 'Digital Identity', 'Africa Digital Transformation']
          };
          tags = slugTags[a.slug] || (a.category ? [a.category] : []);

          return {
            // Spread the raw row first so per-language DB fields (titleFr,
            // titleAr, summaryFr, …) survive and can be picked up by
            // localizedField() at render time.
            ...a,
            id: String(a.id),
            category: a.category || '',
            title: a.title,
            slug: a.slug,
            image: a.heroImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800',
            summary: a.summary || '',
            subtitle: a.subtitle || '',
            tags: tags,
            flag: flag,
            isDraft,
            isTopArticle
          };
        }).filter((a: any) => !a.isDraft);
        setArticles(mapped);
      })
      .catch((err) => console.error('Error fetching articles:', err));
  }, []);

  const ALL_CATEGORIES = useMemo(() => ['All', ...Array.from(new Set(articles.map((a) => a.category)))], [articles]);
  const ALL_COUNTRIES = useMemo(() => ['All', ...Array.from(new Set(articles.filter((a) => a.flag).map((a) => a.flag!.alt)))], [articles]);

  const filtered = articles.filter((a) => {
    if (filterMode === 'category') return activeCategory === 'All' || a.category === activeCategory;
    return activeCountry === 'All' || a.flag?.alt === activeCountry;
  });

  const countryLabel = (alt: string) => {
    const known: Record<string, string> = {
      guinee: t('articles.countryGuinea'),
      tunisia: t('articles.countryTunisia'),
      senegal: t('articles.countrySenegal'),
      mauritania: t('articles.countryMauritania'),
    };
    return known[alt] || (alt.charAt(0).toUpperCase() + alt.slice(1));
  };

  const categoryLabel = (cat: string) => {
    if (!cat) return t('articles.uncategorized');
    const match = articles.find((a) => a.category === cat);
    return localizedField(match, 'category', lang) || cat;
  };

  return (
    <section className="articles">
      <div className="articles__container">
        <header className="articles__hero">
          <div className="articles__hero-left">
            <p className="articles__eyebrow">{t('articles.eyebrow')}</p>
            <h1 className="articles__title">{t('articles.pageTitle')}</h1>
            <p className="articles__subtitle">
              {t('articles.subtitle')}
            </p>
          </div>
        </header>



        <div className="articles__filters">
          <div className="articles__filter-toggle">
            <button
              className={`articles__toggle-btn${filterMode === 'category' ? ' articles__toggle-btn--active' : ''}`}
              onClick={() => setFilterMode('category')}
            >
              {t('articles.byCategory')}
            </button>
            <button
              className={`articles__toggle-btn${filterMode === 'country' ? ' articles__toggle-btn--active' : ''}`}
              onClick={() => setFilterMode('country')}
            >
              {t('articles.byCountry')}
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
                  {cat === 'All' ? t('articles.all') : categoryLabel(cat)}
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
                  {c === 'All' ? t('articles.all') : countryLabel(c)}
                </button>
              ))}
            </div>
          )}
        </div>

        <section className="articles__grid">
          {filtered.length === 0 && (
            <p className="articles__empty">{t('articles.empty')}</p>
          )}
          {filtered.map((article) => (
            <article key={article.id} className="article-card">
              <div className="article-card__image">
                <img src={article.image} alt={localizedField(article, 'title', lang)} className="article-card__image-img" />
                <div className="article-card__image-overlay" />
                <div className="article-card__badges">
                  <span className="article-card__badge">{localizedField(article, 'category', lang) || t('articles.uncategorized')}</span>
                  {article.flag ? (
                    <span className="article-card__flag" aria-label={countryLabel(article.flag.alt)}>
                      <img src={article.flag.src} alt={countryLabel(article.flag.alt)} />
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="article-card__body">
                <div className="article-card__meta">
                  <span className="article-card__time">{localizedField(article, 'category', lang) || t('articles.uncategorized')}</span>
                  <span className="article-card__id">{article.id}</span>
                </div>
                <h3 className="article-card__title">{localizedField(article, 'title', lang)}</h3>
                <p className="article-card__desc">{localizedField(article, 'summary', lang) || localizedField(article, 'subtitle', lang)}</p>
                <Link to={`/articles/${article.slug}`} className="article-card__button">
                  {t('articles.read')}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="articles__cta">
          <div className="articles-cta">
            <div>
              <p className="articles-cta__eyebrow">{t('articles.stayUpdated')}</p>
              <h3 className="articles-cta__title">{t('articles.ctaTitle')}</h3>
              <p className="articles-cta__text">{t('articles.ctaText')}</p>
            </div>
            <div className="articles-cta__actions">
              <input className="articles-cta__input" placeholder={t('articles.emailPlaceholder')} />
              <button className="articles-cta__button">{t('articles.subscribe')}</button>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};