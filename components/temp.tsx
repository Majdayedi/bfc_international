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
    isImageGrid: true,
    categories: [
      {
        name: 'Consulting En Stratégie',
        boxes: [
          {
            id: '01',
            title: 'Management Organisationnel',
            items: ['Organisation et opérationnalisation', 'Gouvernance, risques, conformité', 'Audit et contrôle internes, Fraude'],
