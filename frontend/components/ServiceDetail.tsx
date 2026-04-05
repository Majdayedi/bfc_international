import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, ArrowUpRight, ArrowRight } from 'lucide-react';
import './ServiceDetail.css';

interface ServiceBox {
  id: string;
  title: string;
  items: string[];
  image?: string;
}

interface ServiceCategory {
  name: string;
  boxes: ServiceBox[];
}

interface ServiceData {
  title: string;
  subtitle: string;
  description: string;
  isGrid?: boolean;
  isImageGrid?: boolean;
  isCleanCardGrid?: boolean;
  boxes?: ServiceBox[];
  categories?: ServiceCategory[];
  imageUrl?: string;
  stats?: { label: string; sub: string }[];
}

const servicesData: Record<string, ServiceData> = {
  'tax-legal': {
    title: 'Tax and Legal',
    subtitle: '',
    description: 'What we deliver to our clients in tax and legal advisory.',
    isGrid: false,
    isCleanCardGrid: true,
    boxes: [
      {
        id: '01',
        title: 'Corporate Tax',
        items: ['In-depth tax analysis', 'Corporate tax strategy', 'Tax returns and filings'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '02',
        title: 'Indirect Tax',
        items: ['VAT and local tax assistance', 'Customs compliance', 'Indirect tax optimization'],
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '03',
        title: 'Real Estate Tax',
        items: ['Real estate asset assessment', 'Investment structuring', 'Property tax management'],
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '04',
        title: 'Mergers and Acquisitions',
        items: ['Asset tax structuring', 'Tax due diligence', 'Post-merger integration support'],
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '05',
        title: 'International Structuring',
        items: ['Branch or subsidiary structuring', 'Tax residency advisory', 'Transfer pricing strategy'],
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '06',
        title: 'Payroll Tax',
        items: ['Payroll management', 'Social contribution compliance', 'Expatriation and global mobility'],
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '07',
        title: 'Optimization Processes',
        items: ['Restructuring support', 'Tax optimization', 'Financial modeling'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '08',
        title: 'Reviews and Compliance',
        items: ['Tax reviews', 'Due diligence', 'Compliance review'],
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '09',
        title: 'Assistance and Disputes',
        items: ['Audit assistance', 'Tax dispute management', 'Negotiations with authorities'],
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  'audit': {
    title: 'Audit',
    subtitle: '',
    description: 'What we deliver to our clients in audit and assurance.',
    isGrid: false,
    isCleanCardGrid: true,
    boxes: [
      {
        id: '01',
        title: 'Legal Audit',
        items: ['Legal and contractual audit'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '02',
        title: 'Project Verification',
        items: ['Public project verification', 'Procurement verification'],
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '03',
        title: 'Compliance and Fraud',
        items: ['Compliance verification', 'Fraud audit and investigation'],
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '04',
        title: 'Consolidated Accounts',
        items: ['Audit of consolidated accounts under IAS/IFRS'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '05',
        title: 'Information Systems',
        items: ['Information systems assurance and verification'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '06',
        title: 'Financial Strategy',
        items: ['Financial strategy review and verification'],
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '07',
        title: 'Review Engagements',
        items: ['Agreed-upon procedures', 'Limited review engagements'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '08',
        title: 'Internal Audit',
        items: ['Special assurance services', 'Internal audit services'],
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  'accounting-expertise': {
    title: 'Accounting and Bookkeeping',
    subtitle: '',
    description: 'What we deliver to our clients in accounting and finance operations.',
    isGrid: false,
    isCleanCardGrid: true,
    boxes: [
      {
        id: '01',
        title: 'Account Management',
        items: ['Account management and accounting supervision'],
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '02',
        title: 'Tax Filings',
        items: ['Preparation and review of tax filings'],
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '03',
        title: 'Payroll Management',
        items: ['Payroll processing and social declaration preparation'],
        image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '04',
        title: 'Legal Support',
        items: ['Drafting legal documents', 'Corporate legal secretariat', 'General legal support services'],
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '05',
        title: 'Financial Reporting',
        items: ['Accounting and financial reporting', 'Consolidation and reporting'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '06',
        title: 'Treasury Management',
        items: ['General finance support', 'Treasury management', 'Bank reconciliations', 'Cash flow analysis'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '07',
        title: 'Budget Management',
        items: ['Financial statement preparation', 'Budget preparation and reporting', 'Audit documentation preparation'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '08',
        title: 'Accounting Systems',
        items: ['General ledger setup', 'Cost accounting setup', 'Accounting software configuration'],
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  'consulting': {
    title: 'Consulting Services',
    subtitle: '',
    description: 'We support your growth through advanced expertise across strategic and technology-focused divisions.',
    isCleanCardGrid: true,
    categories: [
      {
        name: 'Strategy Consulting',
        boxes: [
          {
            id: '01',
            title: 'Organizational Management',
            items: ['Organization design and operating model execution', 'Governance, risk and compliance', 'Internal audit, internal control, and fraud risk'],
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '02',
            title: 'Innovation Strategy',
            items: ['Innovation management system', 'Innovation business model design', 'Customer journey mapping'],
            image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '03',
            title: 'Entrepreneurial Ecosystem',
            items: ['Ecosystem development', 'Technical assistance', 'Entrepreneurship coaching'],
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '04',
            title: 'Global Strategy',
            items: ['Strategy development', 'Human capital strategy', 'Business model design'],
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '05',
            title: 'Transaction Advisory',
            items: ['Eligibility and profitability studies', 'Project structuring and design', 'Negotiations with funding institutions'],
            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '06',
            title: 'Organizational Strategy',
            items: ['Vision and positioning', 'Culture and change management', 'Performance management'],
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '07',
            title: 'Fundraising Advisory',
            items: ['Financial restructuring', 'Financial modeling', 'Divestiture and due diligence'],
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '08',
            title: 'Public Sector and Government',
            items: ['Strategic studies', 'Public policy design', 'Ecosystem mapping'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '09',
            title: 'Investment Environment',
            items: ['Ecosystem modeling', 'Business environment assessment', 'Market and sector studies'],
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80'
          }
        ]
      },
      {
        name: 'IT Consulting',
        boxes: [
          {
            id: '10',
            title: 'Information Technology',
            items: ['IT strategy and governance', 'Digital transformation', 'Cybersecurity'],
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '11',
            title: 'Digital Trust',
            items: ['PKI ecosystem modeling', 'PKI implementation', 'e-Government project advisory'],
            image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '12',
            title: 'AI Services',
            items: ['AI strategy advisory', 'AI governance and development', 'Cybersecurity and ethical AI'],
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=500&q=80'
          }
        ]
      }
    ]
  },
  'outsourcing': {
    title: 'Outsourcing Department',
    subtitle: 'Simplify, Outsource, Succeed!',
    description: 'Through our outsourcing department, we provide high-quality operational support services so your teams can focus on strategic growth.',
    isGrid: false,
    isCleanCardGrid: true,
    stats: [
    ],
    boxes: [
      {
        id: '01',
        title: 'Our Team',
        items: ['Our team is made up of seasoned and agile professionals committed to reliable delivery.'],
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: '02',
        title: 'Services',
        items: ['Bookkeeping', 'Compilation engagements', 'Back-office accounting support']
      }
    ]
  }
};

export const ServiceDetail: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  if (!serviceId || !servicesData[serviceId]) {
    return (
      <div className="sd-page sd-not-found">
        <h2>Service not found</h2>
        <button className="sd-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to home
        </button>
      </div>
    );
  }

  const data = servicesData[serviceId];

  const renderCleanCardGrid = (boxes: ServiceBox[]) => (
    <div className="sd-clean-card-grid">
      {boxes.map((box) => (
        <div key={box.id} className="sd-clean-card">
          <div className="sd-clean-card-content">
            <h3 className="sd-clean-card-title">{box.title}</h3>
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
          <img src={box.image} alt={box.title} className="sd-card-img" />
          <div className="sd-card-dark-overlay"></div>
          <div className="sd-card-content-wrap">
            <div className="sd-card-title-wrap">
              <h3 className="sd-image-card-title">{box.title}</h3>
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
                  <p className="sd-overlay-text">More details coming soon.</p>
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
            <span className="sd-outsourcing-kicker">Outsourcing Unit</span>
            <h3>{teamBox?.title || 'Our Team'}</h3>
            {(teamBox?.items || []).map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </div>
        </article>

        <aside className="sd-outsourcing-services-panel">
          <h3>{servicesBox?.title || 'Services'}</h3>
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
            <h3 className="sd-card-title">{box.title}</h3>
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
            <h3 className="sd-list-title">{box.title}</h3>
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
            <span className="sd-eyebrow">(EXPLORE OUR EXPERTISE)</span>
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
                    <h4>{stat.label}</h4>
                    <p>{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.categories ? (
            <div className="sd-categories-container">
              {data.categories.map((category, index) => (
                <div key={index} className="sd-category-block">
                  <h2 className="sd-category-title">{category.name}</h2>
                    {data.isCleanCardGrid ? renderCleanCardGrid(category.boxes) : data.isImageGrid ? renderImageGrid(category.boxes) : data.isGrid ? renderGrid(category.boxes) : renderList(category.boxes)}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {data.boxes && (
                  serviceId === 'outsourcing'
                    ? renderOutsourcingLayout(data.boxes)
                    : data.isCleanCardGrid
                      ? renderCleanCardGrid(data.boxes)
                      : data.isImageGrid
                        ? renderImageGrid(data.boxes)
                        : data.isGrid
                          ? renderGrid(data.boxes)
                          : renderList(data.boxes)
                )}
              </>
            )}
          {/* Subscription Banner - Frosted Glass Style */}
          <div className="sd-subscribe-banner">
            <h2 className="sd-subscribe-text">Get the latest industry insights delivered to you</h2>
            <form className="sd-subscribe-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter Email" 
                className="sd-subscribe-input" 
                required 
              />
              <button type="submit" className="sd-subscribe-btn">
                SUBSCRIBE <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
