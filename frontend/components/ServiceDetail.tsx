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
    description: 'Ce que nous offrons à nos clients en matière de fiscalité et légal.',
    isGrid: false,
    isImageGrid: true,
    boxes: [
      {
        id: '01',
        title: 'Fiscalité des entreprises',
        items: ['Analyse approfondie de la fiscalité', 'Stratégie fiscale d\'entreprise', 'Déclarations fiscales'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '02',
        title: 'Fiscalité indirecte',
        items: ['Assistance en TVA et taxes locales', 'Conformité douanière', 'Optimisation des taxes indirectes'],
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '03',
        title: 'Fiscalité immobilière',
        items: ['Évaluation des actifs immobiliers', 'Structuration de l\'investissement', 'Taxes foncières'],
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '04',
        title: 'Fusions et acquisitions',
        items: ['Fiscalité du patrimoine', 'Due diligence fiscale', 'Intégration post-fusion'],
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '05',
        title: 'Structuration internationale',
        items: ['Couvrant la succursale ou la filiale', 'La résidence', 'Les prix de transfert'],
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '06',
        title: 'Impôt salarial',
        items: ['Gestion des paies', 'Conformité sociale', 'Expatriation et mobilité internationale'],
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '07',
        title: 'Processus d\'optimisation',
        items: ['Restructuration', 'Optimisation fiscales', 'Modélisation financière'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '08',
        title: 'Examens et conformité',
        items: ['Examens fiscaux', 'Diligence raisonnable', 'Revue de conformité'],
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '09',
        title: 'Assistance et litiges',
        items: ['Assistance dans les audits', 'Litiges fiscaux', 'Négociations avec les autorités'],
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  'audit': {
    title: 'Audit',
    subtitle: '',
    description: 'Ce que nous offrons à nos clients en matière d\'audit.',
    isGrid: false,
    isImageGrid: true,
    boxes: [
      {
        id: '01',
        title: 'Audit juridique',
        items: ['Audit juridique et contractuel'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '02',
        title: 'Vérification de projets',
        items: ['Vérification publique du projet', 'Vérification de l\'approvisionnement'],
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '03',
        title: 'Conformité et fraude',
        items: ['Vérification de la conformité', 'Vérification de la fraude'],
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '04',
        title: 'Comptes consolidés',
        items: ['Audit des comptes consolidés en IAS/IFRS'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '05',
        title: 'Systèmes d\'information',
        items: ['Vérification des systèmes d\'information'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '06',
        title: 'Stratégie financière',
        items: ['Vérification de la stratégie financière'],
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '07',
        title: 'Missions d\'examen',
        items: ['Procédures convenues', 'Examen limité'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '08',
        title: 'Audit interne',
        items: ['Services de vérification spéciale', 'Audit interne'],
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  'accounting-expertise': {
    title: 'Comptabilité et tenue de livres',
    subtitle: '',
    description: 'Ce que nous offrons à nos clients en comptabilité.',
    isGrid: false,
    isImageGrid: true,
    boxes: [
      {
        id: '01',
        title: 'Gestion des comptes',
        items: ['Gestion des comptes et supervision comptable'],
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '02',
        title: 'Déclarations fiscales',
        items: ['Préparation et contrôle des déclarations fiscales'],
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '03',
        title: 'Gestion de la paie',
        items: ['Gestion de la paie et préparation des déclarations sociales'],
        image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '04',
        title: 'Support Juridique',
        items: ['Rédaction des documents juridiques', 'Secrétariat juridique', 'Services juridiques généraux'],
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '05',
        title: 'Rapports financiers',
        items: ['Comptabilité et rapports financiers', 'Consolidation et rapports'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '06',
        title: 'Gestion de trésorerie',
        items: ['Finances générales', 'Gestion de la trésorerie', 'Rapprochements bancaires', 'Analyse des flux de trésorerie'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '07',
        title: 'Gestion budgétaire',
        items: ['Préparation des états financiers', 'Préparation du budget et rapports', 'Préparation des documents d\'audit'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: '08',
        title: 'Systèmes comptables',
        items: ['Mise en place comptabilité générale', 'Mise en place comptabilité analytique', 'Paramétrage des logiciels comptables'],
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  'consulting': {
    title: 'Services Consulting',
    subtitle: '',
    description: 'Nous vous accompagnons avec une expertise pointue à travers nos divisions stratégiques et technologiques.',
    isCleanCardGrid: true,
    categories: [
      {
        name: 'Consulting En Stratégie',
        boxes: [
          {
            id: '01',
            title: 'Management Organisationnel',
            items: ['Organisation et opérationnalisation', 'Gouvernance, risques, conformité', 'Audit et contrôle internes, Fraude'],
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '02',
            title: 'Stratégie d\'Innovation',
            items: ['Système de gestion de l\'innovation', 'Modèle d\'affaires d\'innovation', 'Carte du parcours client'],
            image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '03',
            title: 'Ecosystème Entrepreneurial',
            items: ['Développement des écosystèmes', 'Assistance technique', 'Coaching entrepreneurial'],
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '04',
            title: 'Stratégie Globale',
            items: ['Développement d\'une stratégie', 'Capital Humain HR', 'Modèle économique'],
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '05',
            title: 'Advisory Transaction',
            items: ['Etude d\'éligibilité & Rentabilité', 'Conception des projets', 'Négociations avec les fonds'],
            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '06',
            title: 'Stratégie Organisationnelle',
            items: ['Vision et positionnement', 'Culture and Change Management', 'Gestion de la performance'],
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '07',
            title: 'Mobilisation des Fonds',
            items: ['Restructuration financière', 'Modélisation financière', 'Cession & Due diligence'],
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '08',
            title: 'Etats & Gov',
            items: ['Etudes stratégiques', 'Conception de politique publique', 'Mapping des écosystèmes'],
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '09',
            title: 'Environnement d\'Investissement',
            items: ['Modélisation des écosystèmes', 'Etude de l\'environnement', 'Etudes de marché / sectorielles'],
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80'
          }
        ]
      },
      {
        name: 'Consulting En IT',
        boxes: [
          {
            id: '10',
            title: 'Technologies de l\'information',
            items: ['Stratégie et Gouvernance IT', 'Transformation digitale', 'Cybersécurité'],
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '11',
            title: 'Confiance Numérique',
            items: ['Modélisation d\'écosystème PKI', 'Implementation PKI', 'Conseil en Projets e-gov'],
            image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?auto=format&fit=crop&w=500&q=80'
          },
          {
            id: '12',
            title: 'Services IA',
            items: ['Conseil stratégique en IA', 'Gouvernance et développement avec IA', 'Cybersécurité et IA éthique'],
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=500&q=80'
          }
        ]
      }
    ]
  },
  'outsourcing': {
    title: 'Département outsourcing',
    subtitle: 'Simplifiez, Externalisez, Réussissez !',
    description: 'Grâce à notre département outsourcing, nous offrons des services de sous-traitance pour garantir l\'efficacité de votre activité avec la qualité escomptée, vous laissant ainsi de l\'espace pour la croissance de votre cabinet.',
    isGrid: false,
    stats: [
      { label: 'Références', sub: 'Nous offrons les services Outsourcing en France et au Canada' }
    ],
    boxes: [
      {
        id: '01',
        title: 'Equipe',
        items: ['Notre équipe est composée de professionnels chevronnés et dynamiques.']
      },
      {
        id: '02',
        title: 'Services',
        items: ['Tenue comptable', 'Mission de compilation']
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
        <h2>Service non trouvé</h2>
        <button className="sd-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Retour à l'accueil
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
                  <p className="sd-overlay-text">Plus de détails prochainement.</p>
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
                {data.boxes && (data.isCleanCardGrid ? renderCleanCardGrid(data.boxes) : data.isImageGrid ? renderImageGrid(data.boxes) : data.isGrid ? renderGrid(data.boxes) : renderList(data.boxes))}
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
