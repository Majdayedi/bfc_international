import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './OurProjectsPage.css';

/* ─── Logo assets ──────────────────────────────────────────────────── */
import logoADPME from '../src/assets/Logo references/ADPME benin.png';
import logoSONAPI from '../src/assets/Logo references/sonapi.png';
import logoOfficeRoyale from '../src/assets/Logo references/office royale.jpg';
import logoExpertiseFrance from '../src/assets/Logo references/EXPERTISE FRANCE.jpg';
import logoAPIP from '../src/assets/Logo references/APIP.png';
import logoAMRTP from '../src/assets/Logo references/amrtp logo.jpg';
import logoCILSS from '../src/assets/Logo references/CILSS.png';
import logoEuropeanBank from '../src/assets/Logo references/european bank.png';
import logoAMFUMOA from '../src/assets/Logo references/amf umoa.jpg';
import logoCAMPOST from '../src/assets/Logo references/Campost_logo (1).png';
import logoSOGUIPAH from '../src/assets/Logo references/Societe guenienne palmier huile.jpg';
import logoConnectInnov from '../src/assets/Logo references/connect innov.png';
import logoSelect from '../src/assets/Logo references/select.png';
import logoLaPosteBenin from '../src/assets/Logo references/la poste Public benin.png';
import logoMinNumerique from '../src/assets/Logo references/minsitere benin numerique et digitalisation.png';
import logoAMICommerciale from '../src/assets/Logo references/AMI Commerciale.png';
import logoWikiStartup from '../src/assets/Logo references/wiki startup.png';
import logoAZIZA from '../src/assets/Logo references/aziza.jpg';
import logoMunathara from '../src/assets/Logo references/Initiative Munathara.jpg';
import logoMinFinance from '../src/assets/Logo references/ministere finance benin.png';
import logoNGTech from '../src/assets/Logo references/NG technologies.jpg';
import logoOIT from '../src/assets/Logo references/OIT logo.png';
import logoSOTUGAR from '../src/assets/Logo references/Sotugar.png';
import logoKALYS from '../src/assets/Logo references/KALYS.png';
import logoUGFS from '../src/assets/Logo references/ugfs north africa logo.jpg';
import logoSOROUBAT from '../src/assets/Logo references/Soroubat-logo.png';
import logoTUNEPS from '../src/assets/Logo references/e-Procurement System TUNEPS.png';
import logoSOLIDAR from '../src/assets/Logo references/SOLIDAR TUN.jpg';
import logoNGOBeninAction from '../src/assets/Logo references/ong benin action.png';
import logoRoseBlanche from '../src/assets/Logo references/rose blanche.png';
import logoRedGO from '../src/assets/Logo references/redgo.png';
import logoVILAVI from '../src/assets/Logo references/VILAVI.png';
import logoDjibouti from '../src/assets/Logo references/Office de la Voirie de Djibouti.jpg';
import logoWorldBank from '../src/assets/Logo references/world bank.png';
import logoPDACG from '../src/assets/Logo references/LOGO-PDACG-removebg-preview.png';

/** Maps project ID → logo asset. Projects without a matching logo use imageUrl. */
const CLIENT_LOGOS: Record<number, string> = {
  1:  logoADPME,
  3:  logoSONAPI,
  4:  logoOfficeRoyale,
  5:  logoExpertiseFrance,
  6:  logoAPIP,
  7:  logoAMRTP,
  8:  logoWorldBank,
  9:  logoCILSS,
  10: logoEuropeanBank,
  11: logoAMFUMOA,
  12: logoCAMPOST,
  14: logoSOGUIPAH,
  15: logoConnectInnov,
  16: logoSelect,
  17: logoLaPosteBenin,
  18: logoMinNumerique,
  19: logoMinNumerique,
  20: logoAMICommerciale,
  22: logoWikiStartup,
  23: logoAZIZA,
  25: logoMunathara,
  26: logoMinFinance,
  27: logoNGTech,
  29: logoOIT,
  30: logoSOTUGAR,
  31: logoKALYS,
  32: logoUGFS,
  33: logoSOROUBAT,
  34: logoTUNEPS,
  36: logoSOLIDAR,
  39: logoSOLIDAR,
  40: logoNGOBeninAction,
  41: logoAMICommerciale,
  45: logoRoseBlanche,
  46: logoRedGO,
  47: logoVILAVI,
  48: logoRedGO,
  49: logoAZIZA,
  50: logoDjibouti,
  6:  logoPDACG,
};

/* ─── Types & Data ─────────────────────────────────────────────────── */
export interface Project {
  id: number;
  title: string;
  category: string;
  client: string;
  country: string;
  flag: string;
  year: string;
  description: string;
  accent: string;
  imageUrl: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Study on the formalization of MSMEs in the Republic of Benin',
    category: 'Global Strategy',
    client: 'ADPME',
    country: 'Benin',
    flag: 'https://flagcdn.com/w40/bj.png',
    year: '2025 - Ongoing',
    description:
      'Developing a national strategy to transition MSMEs from informal to formal sectors, with benchmarking, consultations, and operational recommendations.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Technical assistance for PKI legal framework and e-certification',
    category: 'Digital Trust',
    client: 'Ministry of Digital Transformation (MTNMA)',
    country: 'Mauritania',
    flag: 'https://flagcdn.com/w40/mr.png',
    year: '2025 - Ongoing',
    description:
      'Analysis of institutional and technical prerequisites, regulatory updates, digital signature use cases, and business plan for PKI exploitation.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Design and implementation of the Information System',
    category: 'ICT',
    client: 'SONAPI SA',
    country: 'Guinea',
    flag: 'https://flagcdn.com/w40/gn.png',
    year: '2025 - Ongoing',
    description:
      'Digitalization of internal operations including HR management, project optimization, real estate assets, archive dematerialization, and tender tracking.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Setup of a Risk Management Cell for the Saudi Government',
    category: 'Organizational Management',
    client: 'Royal Office',
    country: 'Saudi Arabia',
    flag: 'https://flagcdn.com/w40/sa.png',
    year: '2025 - Ongoing',
    description:
      'Support mission to establish a dedicated risk management structure and governance mechanisms at government level.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Strategic retreat for FNCT (Project Tanmia Baladia)',
    category: 'Strategy / Organizational Management',
    client: 'Expertise France',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2025',
    description:
      'Conceptualization and facilitation of a strategic retreat focused on governance models, service diversification, and strategic priorities.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Strategic plan for private investment and APIP business plan',
    category: 'Global Strategy',
    client: 'APIP (Project PDACG)',
    country: 'Guinea',
    flag: 'https://flagcdn.com/w40/gn.png',
    year: '2024 - Ongoing',
    description:
      'Entrepreneurship ecosystem analysis and roadmap of reforms and projects to improve private investment and APIP positioning over five years.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 7,
    title: 'Feasibility study for a digital addressing system',
    category: 'ICT / Feasibility Study',
    client: 'AMRTP',
    country: 'Mali',
    flag: 'https://flagcdn.com/w40/ml.png',
    year: '2025 - Ongoing',
    description:
      'Legal and technical diagnosis with benchmarking and implementation roadmap for a national digital addressing information system.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1573164574472-797cdf4a583a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 8,
    title: 'Strategic diagnosis and governance evaluation of Boutilimit hospital',
    category: 'Institutional Governance',
    client: 'Hamad Ben Khalifa Hospital',
    country: 'Mauritania',
    flag: 'https://flagcdn.com/w40/mr.png',
    year: '2024',
    description:
      'Roadmap development to improve governance efficiency with maturity assessment based on COSO principles.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 9,
    title: 'Modernization and operationalization of CILSS platforms',
    category: 'ICT / Institutional',
    client: 'AGRHYMET (World Bank Group)',
    country: 'Niger',
    flag: 'https://flagcdn.com/w40/ne.png',
    year: '2024',
    description:
      'Definition of implementation frameworks and resource mobilization for the regional climate center and related ECOWAS/CILSS structures.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 10,
    title: 'Mapping the SME and Startup ecosystem',
    category: 'Global Strategy',
    client: 'EBRD (BERD)',
    country: 'Ivory Coast',
    flag: 'https://flagcdn.com/w40/ci.png',
    year: '2024',
    description:
      'Market and stakeholder mapping mission for Tunisian SMEs in Ivory Coast, including DFI and agency landscape analysis.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 11,
    title: 'Revision of central regional financial market shareholding structures',
    category: 'Institutional Governance',
    client: 'CREPMF (AMF-UMOA)',
    country: 'Ivory Coast',
    flag: 'https://flagcdn.com/w40/ci.png',
    year: '2022-2024',
    description:
      'Evaluation of restructuring options and definition of governance-oriented models to achieve reform objectives.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 12,
    title: 'Transformation strategy for financial and postal services',
    category: 'Global Strategy',
    client: 'CAMPOST',
    country: 'Cameroon',
    flag: 'https://flagcdn.com/w40/cm.png',
    year: '2024',
    description:
      'Strategic diagnosis, trend benchmarking, and investment roadmap for a five-year transformation program.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 13,
    title: 'Implementation of an Anti-Corruption Management System (SMAC)',
    category: 'Institutional Governance',
    client: 'Municipality of Tunis',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2023',
    description:
      'ISO 37001 gap analysis, stakeholder risk assessment, governance design, and implementation of monitoring and alert tools.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 14,
    title: 'Development of management procedures manuals',
    category: 'Organizational Management',
    client: 'SOGUIPAH SA',
    country: 'Guinea',
    flag: 'https://flagcdn.com/w40/gn.png',
    year: '2023',
    description:
      'Organizational diagnosis and drafting of administrative, financial, and accounting procedures with role clarification and training.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 15,
    title: 'Go to Market strategy and startup internationalization',
    category: 'Global Strategy',
    client: 'Connect Innov',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2023',
    description:
      'Design of tailored market expansion strategies and operational action plans for startup international growth.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 16,
    title: 'Strategic and digital transformation program',
    category: 'Management',
    client: 'Select Hardware Company',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2023',
    description:
      'Maturity assessment, SWOT/PESTEL analysis, and organizational redesign including structures, roles, and HR management model.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 17,
    title: 'Strategic transformation and modernization of the post office',
    category: 'Global Strategy',
    client: 'La Poste du Benin (Ministry of Digital)',
    country: 'Benin',
    flag: 'https://flagcdn.com/w40/bj.png',
    year: '2022',
    description:
      'Benchmarking and strategy formulation for modernization, investment planning, and change management.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 18,
    title: 'Economic models for PKI exploitation',
    category: 'Digital Trust',
    client: 'ASSI',
    country: 'Benin',
    flag: 'https://flagcdn.com/w40/bj.png',
    year: '2021-2022',
    description:
      'Definition of stakeholder value propositions, market study, financial model, and communication roadmap for PKI deployment.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 19,
    title: 'Framework and inspection procedures for trust service providers',
    category: 'Digital Trust',
    client: 'Ministry of Digitalization',
    country: 'Benin',
    flag: 'https://flagcdn.com/w40/bj.png',
    year: '2022',
    description:
      'Institutional architecture design, digital code analysis, international benchmarking, and methodology notes for inspections.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1489533119213-66a5cd877091?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 20,
    title: 'Digitalization of business processes',
    category: 'ICT / TIC',
    client: 'AMI Commerciale',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2022',
    description:
      'Maturity and compliance assessment, IT risk mapping, and digital transformation planning with training and change management.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 21,
    title: 'National strategy for the conference economy',
    category: 'Global Strategy',
    client: 'ANEC',
    country: 'Niger',
    flag: 'https://flagcdn.com/w40/ne.png',
    year: '2021-2022',
    description:
      'Five-year plan for MICE development, destination positioning, job impact analysis, and operational marketing roadmap.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 22,
    title: 'Training on startup internationalization and economic intelligence',
    category: 'Training',
    client: 'Wiki Start Up',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2022',
    description:
      'Training mission focused on startup internationalization capabilities and economic intelligence, including Pitch Day jury support.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 23,
    title: 'Organizational review and strategic plan',
    category: 'Strategy / Governance',
    client: 'AZIZA',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2021',
    description:
      'Functional diagnosis and governance redesign with updated structures, job descriptions, and strategic framing.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 24,
    title: 'Organizational audit and review',
    category: 'Organizational Management',
    client: 'TTI & ELECSA',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2021',
    description:
      'Control environment assessment and restructuring scenarios with governance and role updates.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 25,
    title: 'Functional audit and procedures manual update',
    category: 'Organizational Management',
    client: 'Initiative Munathara',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2021',
    description:
      'Internal control diagnosis and risk identification leading to a revised and operational procedures manual.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 26,
    title: 'Rationalization of electronic signature services',
    category: 'Digital Trust',
    client: 'Ministry of Finance (Finance Computer Center)',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2021',
    description:
      'Maturity and compliance review of e-signature services, with organizational and risk analysis recommendations.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 27,
    title: 'Assistance in setting up a private PKI',
    category: 'Digital Trust',
    client: 'NG Technologies',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2021',
    description:
      'Technical and financial feasibility assessment and action plan for private PKI implementation.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 28,
    title: 'Integration of online e-signatures in business declarations',
    category: 'Digital Trust',
    client: 'National Business Registry (RNE)',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2021',
    description:
      'Integration project for secure electronic signatures within business declaration workflows.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 29,
    title: 'Support for PAJESS social entrepreneurship project',
    category: 'Training / Strategy',
    client: 'ILO (OIT)',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2021',
    description:
      'Review and support of 11 projects through business model evaluation and business plan reinforcement.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 30,
    title: 'Technical assistance for risk management and internal audit',
    category: 'Risk / Audit / Training',
    client: 'SOTUGAR (World Bank)',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2020-2021',
    description:
      'Creation of risk and audit units, governance documentation, and team training in risk assessment and audit planning.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 31,
    title: 'Business model design and startup support',
    category: 'Global Strategy',
    client: 'Various Startups (Kalys, Etakwin, Gofield)',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2018-2021',
    description:
      'Support on business plans, legal structuring, patent strategy, and Startup Label acquisition.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 32,
    title: 'M&A support (acquisitions and divestments)',
    category: 'Finance / Operations',
    client: 'UGFS North Africa',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2015-2021',
    description:
      'Strategic analysis and due diligence support for transactions, including structuring options and risk reporting.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 33,
    title: 'Organizational review and job description development',
    category: 'Organizational Management',
    client: 'SOROUBAT International',
    country: 'Ivory Coast',
    flag: 'https://flagcdn.com/w40/ci.png',
    year: '2020',
    description:
      'SWOT-based organizational review, role distribution, org chart updates, and change management planning.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 34,
    title: 'Dematerialization and OCDS module development',
    category: 'ICT',
    client: 'TUNEPS (E-Procurement)',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2020',
    description:
      'Digital maturity evaluation with IT risk and compliance assessment supporting e-procurement modernization.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 35,
    title: 'Dematerialization of asset declarations',
    category: 'ICT',
    client: 'INLUCC (Anti-Corruption Authority)',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2020',
    description:
      'Digital maturity and architecture assessment with technical specifications and change support.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 36,
    title: 'Strategic study for digital needs in local communities',
    category: 'Global Strategy',
    client: 'Solidar Tunisie',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2020',
    description:
      'Municipal digital diagnostics and design of project sheets with economic models for priority initiatives.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 37,
    title: 'Assistance for Electronic Document Management (GED)',
    category: 'ICT',
    client: 'Lumiere Logistique',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2020',
    description:
      'Governance and process diagnosis supporting strategic planning for GED deployment.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 38,
    title: 'Setup of an Internal Audit cell',
    category: 'Organizational Management',
    client: 'Slama Freres',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2020',
    description:
      'Design of audit organization, roles, KPIs, and internal audit charter.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 39,
    title: 'Legislative support and Think Tank animation',
    category: 'State / Government',
    client: 'Solidar Tunisie',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2020',
    description:
      'Legislative proposal support across finance acts, Startup Act, and business climate reform.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1523289333742-be1143f6b766?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 40,
    title: 'Organizational structure and strategic plan',
    category: 'Institutional Governance',
    client: 'NGO Benin Action',
    country: 'Benin',
    flag: 'https://flagcdn.com/w40/bj.png',
    year: '2018-2020',
    description:
      'Design of organization and HR allocation framework with strategic plan deployment support.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 41,
    title: 'Support for ERP implementation',
    category: 'ICT / TIC',
    client: 'AMI (Industrial Workshops)',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2019-2020',
    description:
      'Support from requirements to tendering and delivery governance during ERP rollout and organizational transformation.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 42,
    title: 'Strategic audit and development plan',
    category: 'Global Strategy',
    client: 'CML (Mining)',
    country: 'Ivory Coast',
    flag: 'https://flagcdn.com/w40/ci.png',
    year: '2019',
    description:
      'Environmental and competitive analysis with valuation insights and strategic objective framework for development.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 43,
    title: 'Internal control system maturity evaluation',
    category: 'Organizational Management',
    client: 'CSM-GIAS (Holland Group)',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2019',
    description:
      'Maturity-based review including competency diagnosis, governance note, and operational department audit.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1554224154-26032fced8bd?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 44,
    title: 'Risk mapping',
    category: 'Organizational Management',
    client: 'CML (Mining)',
    country: 'Ivory Coast',
    flag: 'https://flagcdn.com/w40/ci.png',
    year: '2019',
    description:
      'Managerial capacity building with risk identification, prioritization, and governance of risk ownership.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 45,
    title: 'Tender support for SI integrator (Sage solutions)',
    category: 'ICT',
    client: 'Rose Blanche Group',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2019',
    description:
      'Support in defining tender requirements and selection criteria for systems integration solutions.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 46,
    title: 'Support for Electronic Document Management (GED)',
    category: 'ICT',
    client: 'RedGO',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2019',
    description:
      'Participation in acceptance planning and impact analysis of GED implementation on operational workflows.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 47,
    title: 'Organizational audit',
    category: 'Organizational Management',
    client: 'VILAVI',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2018',
    description:
      'COSO-oriented audit of governance and performance management indicators.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 48,
    title: 'Operational audit and procedures manual',
    category: 'Organizational Management',
    client: 'RedGO (Henkel Distributor)',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2017-2018',
    description:
      'Governance and competency diagnosis translated into an updated operational procedures framework.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 49,
    title: 'Organizational audit of the Treasury department',
    category: 'Organizational Management',
    client: 'AZIZA',
    country: 'Tunisia',
    flag: 'https://flagcdn.com/w40/tn.png',
    year: '2015',
    description:
      'Department restructuring to improve efficiency with role formalization and procedures documentation.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 50,
    title: 'Accounting and financial procedures manual for 5 public establishments',
    category: 'Organizational Management',
    client: 'State of Djibouti',
    country: 'Djibouti',
    flag: 'https://flagcdn.com/w40/dj.png',
    year: '2010',
    description:
      'Operational and task-distribution audit supporting procedures manuals for multiple public entities.',
    accent: '#243c8a',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop',
  },
];

/* ─── Scroll Helpers ───────────────────────────────────────────────── */
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
}

const SLIDER_PROJECTS = PROJECTS.slice(0, 3); // Only show the first 3 on the slider

const VH_PER_ITEM = 150;
const SMOOTH_FACTOR = 0.1;
const INTRO_VH = 120;
const CTA_AFTER = SLIDER_PROJECTS.length; // triggers after the last slide
const CTA_VH = 120;

const CATEGORIES = ['All', ...Array.from(new Set(PROJECTS.map((p) => p.category)))];
const COUNTRIES = ['All', ...Array.from(new Set(PROJECTS.map((p) => p.country)))];

/* ─── Component ────────────────────────────────────────────────────── */
export const OurProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  /* ── Project slides state & refs ────────────────────────────────── */
  const totalItems = SLIDER_PROJECTS.length;
  const scrollHeight = totalItems * VH_PER_ITEM + INTRO_VH + CTA_VH;

  const driverRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const wheelSectionRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const wheelItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressFillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const smoothProgressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  /* ── Filter / search state ─────────────────────── */
  const [filterMode, setFilterMode] = useState<'category' | 'country'>('category');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = filterMode === 'category' ? CATEGORIES : COUNTRIES;

  const filteredProjects = PROJECTS.filter((p) => {
    const field = filterMode === 'category' ? p.category : p.country;
    const matchesFilter = activeFilter === 'All' || field === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const getRawProgress = useCallback(() => {
    const el = driverRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const totalScroll = el.offsetHeight - window.innerHeight;
    if (totalScroll <= 0) return 0;
    const scrolled = -rect.top;
    return clamp(scrolled / totalScroll, 0, 1);
  }, []);

  const setContent = useCallback((index: number) => {
    if (index === activeIndexRef.current || isTransitioningRef.current) return;
    const contentEl = contentRef.current;
    if (!contentEl) return;

    if (activeIndexRef.current === -1) {
      activeIndexRef.current = index;
      setActiveIndex(index);
      contentEl.classList.remove('pw-content-inner--exiting');
      contentEl.style.animation = 'none';
      void contentEl.offsetHeight;
      contentEl.style.animation = '';
      return;
    }

    isTransitioningRef.current = true;
    contentEl.classList.add('pw-content-inner--exiting');

    setTimeout(() => {
      activeIndexRef.current = index;
      setActiveIndex(index);
      contentEl.classList.remove('pw-content-inner--exiting');
      contentEl.style.animation = 'none';
      void contentEl.offsetHeight;
      contentEl.style.animation = '';
      isTransitioningRef.current = false;
    }, 200);
  }, []);

  useEffect(() => {
    function tick() {
      const raw = getRawProgress();
      smoothProgressRef.current += (raw - smoothProgressRef.current) * SMOOTH_FACTOR;
      const sp = smoothProgressRef.current;

      /* ── Intro phase ──────────────────────────── */
      const introFraction = INTRO_VH / (totalItems * VH_PER_ITEM + INTRO_VH + CTA_VH);
      const introEl = introRef.current;
      if (introEl) {
        const introProgress = clamp(sp / introFraction, 0, 1);
        const introOpacity = 1 - introProgress * introProgress;
        const introY = -60 * introProgress;
        const introBlur = 8 * introProgress;
        introEl.style.opacity = String(introOpacity);
        introEl.style.transform = `translateY(${introY}px)`;
        introEl.style.filter = `blur(${introBlur}px)`;
      }

      /* ── CTA + Project visibility ───────────────── */
      const pp = clamp((sp - introFraction) / (1 - introFraction), 0, 1);

      const postIntroVH = totalItems * VH_PER_ITEM + CTA_VH;
      const ctaStartPp = (CTA_AFTER * VH_PER_ITEM) / postIntroVH;
      const ctaEndPp   = (CTA_AFTER * VH_PER_ITEM + CTA_VH) / postIntroVH;
      const ctaFade = 0.03;

      /* CTA overlay */
      const ctaEl = ctaRef.current;
      if (ctaEl) {
        let ctaOp: number;
        if (pp < ctaStartPp - ctaFade) ctaOp = 0;
        else if (pp < ctaStartPp) ctaOp = (pp - (ctaStartPp - ctaFade)) / ctaFade;
        else if (pp <= ctaEndPp) ctaOp = 1;
        else if (pp < ctaEndPp + ctaFade) ctaOp = 1 - (pp - ctaEndPp) / ctaFade;
        else ctaOp = 0;
        ctaEl.style.opacity = String(ctaOp);
      }

      /* Hide project sections during intro AND during CTA */
      const introFade = clamp((sp - introFraction * 0.6) / (introFraction * 0.4), 0, 1);
      let ctaHide = 1;
      if (pp >= ctaStartPp - ctaFade && pp <= ctaEndPp + ctaFade) {
        if (pp < ctaStartPp) ctaHide = 1 - (pp - (ctaStartPp - ctaFade)) / ctaFade;
        else if (pp <= ctaEndPp) ctaHide = 0;
        else ctaHide = (pp - ctaEndPp) / ctaFade;
      }
      const sectionsOpacity = String(introFade * ctaHide);
      if (contentSectionRef.current) contentSectionRef.current.style.opacity = sectionsOpacity;
      if (wheelSectionRef.current) wheelSectionRef.current.style.opacity = sectionsOpacity;
      if (progressBarRef.current) progressBarRef.current.style.opacity = sectionsOpacity;

      /* ── Remap pp → prj (strips CTA gap) ────────── */
      const pauseTarget = Math.min((CTA_AFTER - 0.5) / (totalItems - 1), 1);
      let prj: number;
      if (pp <= ctaStartPp) {
        prj = (pp / ctaStartPp) * pauseTarget;
      } else if (pp <= ctaEndPp) {
        prj = pauseTarget;
      } else {
        prj = pauseTarget + ((pp - ctaEndPp) / (1 - ctaEndPp)) * (1 - pauseTarget);
      }

      const newIdx = clamp(Math.round(prj * (totalItems - 1)), 0, totalItems - 1);
      setContent(newIdx);

      for (let i = 0; i < totalItems; i++) {
        const segStart = i / totalItems;
        const segEnd = (i + 1) / totalItems;
        const fill = mapRange(prj, segStart, segEnd, 0, 1);
        const el = progressFillRefs.current[i];
        if (el) el.style.transform = `scaleY(${fill})`;
      }

      for (let i = 0; i < totalItems; i++) {
        const target = i / (totalItems - 1);
        const ease = (t: number) => t * t * (3 - 2 * t);

        let yVal: number;
        if (prj <= target - 0.6) yVal = 800;
        else if (prj >= target + 0.6) yVal = -800;
        else { const t = ease((prj - (target - 0.6)) / 1.2); yVal = 800 - 1600 * t; }

        let scaleVal: number;
        if (prj <= target - 0.4) scaleVal = 0.6;
        else if (prj >= target + 0.4) scaleVal = 0.6;
        else if (prj <= target) { const t = ease((prj - (target - 0.4)) / 0.4); scaleVal = 0.6 + 0.6 * t; }
        else { const t = ease((prj - target) / 0.4); scaleVal = 1.2 - 0.6 * t; }

        let opacityVal: number;
        if (prj <= target - 0.12) opacityVal = 0;
        else if (prj >= target + 0.12) opacityVal = 0;
        else if (prj <= target) { const t = ease((prj - (target - 0.12)) / 0.12); opacityVal = t; }
        else { const t = ease((prj - target) / 0.12); opacityVal = 1 - t; }

        let blurVal: number;
        if (prj <= target - 0.4) blurVal = 12;
        else if (prj >= target + 0.4) blurVal = 12;
        else if (prj <= target) { const t = ease((prj - (target - 0.4)) / 0.4); blurVal = 12 * (1 - t); }
        else { const t = ease((prj - target) / 0.4); blurVal = 12 * t; }

        let glowVal: number;
        if (prj <= target - 0.2) glowVal = 0;
        else if (prj >= target + 0.2) glowVal = 0;
        else if (prj <= target) { const t = ease((prj - (target - 0.2)) / 0.2); glowVal = 0.25 * t; }
        else { const t = ease((prj - target) / 0.2); glowVal = 0.25 * (1 - t); }

        const itemEl = wheelItemRefs.current[i];
        if (itemEl) {
          itemEl.style.transform = `translateY(${yVal}px) scale(${scaleVal})`;
          itemEl.style.opacity = String(opacityVal);
          itemEl.style.filter = `blur(${blurVal}px)`;
        }
        const glowEl = glowRefs.current[i];
        if (glowEl) glowEl.style.opacity = String(glowVal);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [getRawProgress, setContent, totalItems]);

  /* ── Intersection Observer for project cards grid ────────────── */
  useEffect(() => {
    const el = cardsGridRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('pw-cards-grid--visible');
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: '200px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const project = SLIDER_PROJECTS[activeIndex];
  const titleWords = project.title.split(' ');
  const midpoint = Math.ceil(titleWords.length / 2);
  const titleLine1 = titleWords.slice(0, midpoint).join(' ');
  const titleLine2 = titleWords.slice(midpoint).join(' ');

  const openProjectArticle = (target: Project) => {
    navigate(`/who-we-are/our-projects/${target.id}`);
  };

  return (
    <main className="projects-page">

      {/* ── Project Slides ────────────────────────────────────────── */}
      <div ref={driverRef} className="pw-scroll-driver" style={{ height: `${scrollHeight}vh` }}>
        <div className="pw-sticky">

          {/* Intro title overlay */}
          <div className="pw-intro" ref={introRef}>
            <h1 className="pw-intro__title1">
              Our Top<br />
              <span className="pw-intro__title-stroke1">References</span>
            </h1>
            <div className="pw-intro__line" />
            <p className="pw-intro__sub">Over 50 projects worldwide.</p>
          </div>

          {/* CTA interstitial overlay */}
          <div className="pw-cta" ref={ctaRef} style={{ opacity: 0 }}>
            <h2 className="pw-cta__title">
              Interested<br />
              <span className="pw-cta__title-stroke">in more?</span>
            </h2>
            <div className="pw-cta__line" />
            <div className="pw-cta__scroll-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="m18 13-6 6-6-6" />
              </svg>
              <span>Scroll down</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pw-progress-bar" ref={progressBarRef}>
            {SLIDER_PROJECTS.map((_, i) => (
              <div key={i} className="pw-progress-segment">
                <div
                  className="pw-progress-fill"
                  ref={(el) => { progressFillRefs.current[i] = el; }}
                />
              </div>
            ))}
          </div>

          {/* Content (left) */}
          <div className="pw-content-section" ref={contentSectionRef}>
            <div className="pw-content-inner" ref={contentRef}>
              

              

              <h2 className="pw-project-title">
                {titleLine1} <div className="pw-category-badge" style={{ '--badge-accent': project.accent } as React.CSSProperties}>
                {project.category}
              </div>
                <br />
                <span className="pw-text-stroke">{titleLine2}</span>
              </h2>

              <p className="pw-project-desc">{project.description}</p>

              <div className="pw-project-meta">
                <img
                  src={project.flag}
                  alt={project.country}
                  className="pw-project-flag"
                />
                <span className="pw-project-country">{project.country}</span>
                <span className="pw-project-year">{project.year}</span>
                <span className="pw-project-year">{project.client}</span>
              </div>

              <button
                className="pw-discover-btn"
                onClick={() => openProjectArticle(project)}
                type="button"
              >
                <span>View Details</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          {/* Images (right) */}
          <div className="pw-wheel-section" ref={wheelSectionRef}>
            <div className="pw-wheel-container">
              {SLIDER_PROJECTS.map((p, i) => {
                const logo = CLIENT_LOGOS[p.id];
                return (
                  <div
                    key={p.id}
                    className="pw-wheel-item"
                    ref={(el) => { wheelItemRefs.current[i] = el; }}
                  >
                    <div className={`pw-wheel-item-inner${logo ? ' pw-wheel-item-inner--logo' : ''}`}>
                      <div
                        className="pw-wheel-glow"
                        style={{ background: p.accent }}
                        ref={(el) => { glowRefs.current[i] = el; }}
                      />
                      <img
                        src={logo || p.imageUrl}
                        alt={p.client}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        className={logo ? 'pw-wheel-logo-img' : ''}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pw-scroll-hint">
              <span>Scroll</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="m18 13-6 6-6-6" />
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* ── Project Cards Grid ─────────────────────────────────── */}
      <section className="pw-cards-section">
        <div className="pw-cards-content">
          <span className="pw-cards__eyebrow">Full Portfolio</span>
          <h2 className="pw-cards__title">All <span className="pw-cards__title-stroke">Projects</span></h2>

          {/* Search bar */}
          <div className="pw-search-bar">
            <svg className="pw-search-bar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="pw-search-bar__input"
              placeholder="Search projects by name, country, or category…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="pw-search-bar__clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
                ×
              </button>
            )}
          </div>

          {/* Filter mode toggle + pills */}
          <div className="pw-filter-row">
            <div className="pw-filter-mode">
              <button
                className={`pw-filter-mode__btn${filterMode === 'category' ? ' pw-filter-mode__btn--active' : ''}`}
                onClick={() => { setFilterMode('category'); setActiveFilter('All'); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                Category
              </button>
              <button
                className={`pw-filter-mode__btn${filterMode === 'country' ? ' pw-filter-mode__btn--active' : ''}`}
                onClick={() => { setFilterMode('country'); setActiveFilter('All'); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Country
              </button>
            </div>
          </div>

          {/* Filter pills */}
          <div className="pw-filter-bar">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                className={`pw-filter-btn${activeFilter === opt ? ' pw-filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="pw-cards-grid" ref={cardsGridRef}>
            {filteredProjects.length === 0 && (
              <p className="pw-cards-empty">No projects match your search.</p>
            )}
            {filteredProjects.map((p, i) => (
              <div
                key={p.id}
                className="pw-card"
                style={{
                  '--card-accent': p.accent,
                  '--card-delay': `${i * 100}ms`,
                } as React.CSSProperties}
              >
                <div className={`pw-card__img-wrap${CLIENT_LOGOS[p.id] ? ' pw-card__img-wrap--logo' : ''}`}>
                  <img
                    src={CLIENT_LOGOS[p.id] || p.imageUrl}
                    alt={p.client}
                    loading="lazy"
                    className={CLIENT_LOGOS[p.id] ? 'pw-card__logo-img' : ''}
                  />
                  <span className="pw-card__cat" style={{ background: p.accent }}>
                    {p.category}
                  </span>
                </div>
                <div className="pw-card__body">
                  <div className="pw-card__location">
                    <img src={p.flag} alt={p.country} className="pw-card__flag" />
                    <span>{p.country}</span>
                    <span className="pw-card__year">{p.year}</span>
                  </div>
                  <h3 className="pw-card__title">{p.title}</h3>
                  <p className="pw-card__desc"><strong>Client:</strong> {p.client}</p>
                  <p className="pw-card__desc">{p.description}</p>
                  <button
                    className="pw-card__article-btn"
                    type="button"
                    onClick={() => openProjectArticle(p)}
                  >
                    Read Article
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};
