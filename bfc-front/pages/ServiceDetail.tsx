import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import { API_URL } from '../utils/constants';
import { useLanguage, localizedField, localizedVariant } from '../src/i18n';
import './ServiceDetail.css';

type ServiceBox = {
  id: string;
  title: string;
  items: string[];
  image?: string;
};

type ServiceCategory = {
  name: string;
  boxes: ServiceBox[];
};

type ServiceData = {
  title: string;
  subtitle: string;
  description: string;
  layoutType?: string;
  isGrid?: boolean;
  isImageGrid?: boolean;
  isCleanCardGrid?: boolean;
  boxes?: ServiceBox[];
  categories?: ServiceCategory[];
  imageUrl?: string;
  stats?: { label: string; sub: string }[];
};

export const ServiceDetail: React.FC = () => {
  const { t, lang } = useLanguage();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    if (!serviceId) return;

    setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/services/slug/${serviceId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Service not found');
        }
        return res.json();
      })
      .then((backendData) => {
        let content: any = {};
        try {
          // A translated version owns its whole page body (boxes, categories),
          // so French/Arabic never mix English cards into a translated page.
          const contentJson = localizedVariant(backendData, 'contentJson', lang) || backendData.contentJson;
          if (contentJson) {
            content = JSON.parse(contentJson);
          }
        } catch (e) {
          console.error("Error parsing contentJson", e);
        }

        const mapped: ServiceData = {
          title: localizedField(backendData, 'title', lang),
          subtitle: localizedField(backendData, 'subtitle', lang),
          description: localizedField(backendData, 'description', lang),
          layoutType: backendData.layoutType || '',
          isCleanCardGrid: backendData.layoutType === 'CLEAN_CARD_GRID',
          isImageGrid: backendData.layoutType === 'IMAGE_GRID',
          isGrid: backendData.layoutType === 'GRID',
          boxes: content.boxes,
          categories: content.categories,
          imageUrl: backendData.imageUrl || '',
          stats: content.stats
        };
        setData(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Failed to fetch service page');
        setLoading(false);
      });
  }, [serviceId, lang]);

  if (loading) {
    return (
      <div className="sd-page sd-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#fff' }}>
        <div style={{ fontSize: '1.2rem', fontFamily: 'inherit', letterSpacing: '0.05em' }}>{t('service.loading')}</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="sd-page sd-not-found">
        <h2>{t('service.notFound')}</h2>
        <button className="sd-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> {t('service.backToHome')}
        </button>
      </div>
    );
  }

  const renderCleanCardGrid = (boxes: ServiceBox[]) => (
    <div className="sd-clean-card-grid">
      {boxes.map((box) => (
        <div key={box.id} className="sd-clean-card">
          <div className="sd-clean-card-content">
            <h3 className="sd-clean-card-title">{localizedField(box, 'title', lang)}</h3>
            {box.items.length > 0 && (
              <ul className="sd-clean-card-list">
                {box.items.map((item, idx) => (
                  <li key={idx} className="sd-clean-card-list-item">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
        </div>
      ))}
    </div>
  );

  const renderImageGrid = (boxes: ServiceBox[]) => (
    <div className="sd-image-grid">
      {boxes.map((box) => (
        <div key={box.id} className="sd-image-card">
          <img src={box.image} alt={localizedField(box, 'title', lang)} className="sd-card-img" />
          <div className="sd-card-dark-overlay"></div>
          <div className="sd-card-content-wrap">
            <div className="sd-card-title-wrap">
              <h3 className="sd-image-card-title">{localizedField(box, 'title', lang)}</h3>
            </div>
            <div className="sd-card-hover-reveal">
              <div className="sd-hover-reveal-inner">
                {box.items.length > 0 ? (
                  <ul className="sd-overlay-list">
                    {box.items.map((item, idx) => (
                      <li key={idx}>
                        <ChevronRight className="sd-overlay-bullet" size={14} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="sd-overlay-text">{t('service.moreDetails')}</p>
                )}
              </div>
            </div>
          </div>
          <div className="sd-card-arrow">
            <ArrowUpRight size={20} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderOutsourcingLayout = (boxes: ServiceBox[]) => {
    const teamBox = boxes.find((box) => box.id === '01') ?? boxes[0];
    const servicesBox = boxes.find((box) => box.id === '02') ?? boxes[1];
    const teamImage = teamBox?.image || 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80';

    return (
      <div className="sd-outsourcing-layout">
        <article className="sd-outsourcing-team-card" style={{ backgroundImage: `url(${teamImage})` }}>
          <div className="sd-outsourcing-team-overlay" />
          <div className="sd-outsourcing-team-content">
            <span className="sd-outsourcing-kicker">{t('service.outsourcingUnit')}</span>
            <h3>{localizedField(teamBox, 'title', lang) || t('service.ourTeam')}</h3>
            {(teamBox?.items || []).map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </div>
        </article>

        <aside className="sd-outsourcing-services-panel">
          <h3>{localizedField(servicesBox, 'title', lang) || t('service.services')}</h3>
          <ul className="sd-outsourcing-services-list">
            {(servicesBox?.items || []).map((item, idx) => (
              <li key={idx}>
                <ChevronRight className="sd-outsourcing-service-icon" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    );
  };

  const renderGrid = (boxes: ServiceBox[]) => (
    <div className="sd-grid">
      {boxes.map((box) => (
        <div key={box.id} className="sd-grid-card">
          <div className="sd-card-header" style={{ borderBottom: box.items.length === 0 ? 'none' : '', paddingBottom: box.items.length === 0 ? '0' : '', marginBottom: box.items.length === 0 ? '0' : '' }}>
            <span className="sd-card-num">{box.id}</span>
            <h3 className="sd-card-title">{localizedField(box, 'title', lang)}</h3>
          </div>
          {box.items.length > 0 && (
            <ul className="sd-card-list">
              {box.items.map((item, idx) => (
                <li key={idx}>
                  <ChevronRight className="sd-icon-bullet" size={14} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );

  const renderList = (boxes: ServiceBox[]) => (
    <div className="sd-list-layout">
      {boxes.map((box) => (
        <div key={box.id} className="sd-list-block">
          <div className="sd-list-header">
            {box.id && <span className="sd-list-num">{box.id}</span>}
            <h3 className="sd-list-title">{localizedField(box, 'title', lang)}</h3>
          </div>
          <ul className="sd-list-items">
            {box.items.map((item, idx) => (
              <li key={idx}>
                <div className="sd-bullet"></div>
                <span className="sd-item-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="sd-page">
      {/* Hero Section */}
      <section className="sd-hero">
        <div className="sd-hero-container">
         
          <div className="sd-hero-content">
            <span className="sd-eyebrow">{t('service.eyebrow')}</span>
            <h1 className="sd-title">{data.title}</h1>
            <p className="sd-desc">{data.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="sd-body">
        <div className="sd-container">
          
          {data.stats && (
            <div className="sd-stats">
              {data.stats.map((stat, i) => (
                <div key={i} className="sd-stat-card">
                  <div className="sd-stat-icon">📈</div>
                  <div className="sd-stat-text">
                    <h4>{localizedField(stat, 'label', lang)}</h4>
                    <p>{localizedField(stat, 'sub', lang)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.categories && data.categories.length > 0 ? (
            <div className="sd-categories-container">
              {data.categories.map((category, index) => (
                <div key={index} className="sd-category-block">
                  <h2 className="sd-category-title">{localizedField(category, 'name', lang)}</h2>
                  {renderCleanCardGrid(category.boxes || [])}
                </div>
              ))}
            </div>
          ) : (
            <>
              {data.boxes && data.boxes.length > 0 && (
                (serviceId === 'outsourcing' || data.layoutType === 'OUTSOURCING')
                  ? renderOutsourcingLayout(data.boxes)
                  : renderCleanCardGrid(data.boxes)
              )}
            </>
          )}
          {/* Subscription Banner - Frosted Glass Style */}
          <div className="sd-subscribe-banner">
            <h2 className="sd-subscribe-text">{t('service.subscribeTitle')}</h2>
            <form className="sd-subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder={t('service.emailPlaceholder')} 
                className="sd-subscribe-input" 
                required 
              />
              <button type="submit" className="sd-subscribe-btn">
                {t('service.subscribe')} <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
