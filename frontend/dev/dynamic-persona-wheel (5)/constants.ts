
import { Persona } from './types';

export const PERSONAS: Persona[] = [
  {
    id: 1,
    name: "Nadia YAICH",
    role: "CEO ET ASSOCIÉE BFC GROUPE",
    bio: "Experte internationale - Formatrice Management stratégique et organisationnel, Public policy, IT. CFE® COBIT® ITIL® CICP®.",
    quote: "L’impossible n’est pas africain. Nous voulons faire cela et cela doit être réalisé.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop", 
    color: "#243c8a"
  },
  {
    id: 2,
    name: "Amine ABDERAHMANE",
    role: "ASSOCIÉ BFC GROUPE",
    bio: "Expert-comptable et consultant international en analyse financière et économique.",
    quote: "Tout commence par la collaboration. Nous bâtissons des écosystèmes inclusifs.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
    color: "#30aeb7"
  }
];

export const COUNTRY_MANAGERS = [
  {
    name: "Mohamed Amine Sahli",
    role: "Business Dev Manager",
    region: "Guinée et Libye",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    email: "mohamedamine.sahli@bfc.com.tn"
  },
  {
    name: "Tasnim Zouaoui",
    role: "Représentante",
    region: "Mali et Mauritanie",
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop",
    email: "tasnim.zouaoui@bfc.com.tn"
  },
  {
    name: "Ines Yaich",
    role: "Country Manager",
    region: "Sénégal",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    email: "ines.yaich@bfc.com.tn"
  },
  {
    name: "Nadia Yaich",
    role: "Country Manager",
    region: "Bassin du Congo",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop",
    email: "nadia.yaich@bfc.com.tn"
  }
];

export const HISTORY = [
  { year: "2010", title: "MGI BFC", desc: "Structure mère, cabinet d’expertise comptable basé à Tunis." },
  { year: "2020", title: "BFC International", desc: "Fondation de BFC International & Academy, cabinet de consulting." },
  { year: "2022", title: "Expansion Afrique", desc: "Création de BFC Guinée et BFC Sénégal pour renforcer la présence." },
  { year: "2023", title: "Bassin du Congo", desc: "Intégration de l'Afrique centrale dans notre réseau." },
  { year: "2025", title: "Vers l'africanisation", desc: "Consolidation du leadership sur le continent." }
];

export const VALUES = [
  {
    title: "Responsabilité",
    desc: "Nous assumons la responsabilité avec détermination pour offrir des solutions fiables.",
    icon: "Shield"
  },
  {
    title: "Innovation",
    desc: "L'innovation est au cœur de notre mission pour répondre aux besoins changeants.",
    icon: "Zap"
  },
  {
    title: "Collaboration",
    desc: "Nous travaillons en étroite collaboration avec nos clients pour le succès commun.",
    icon: "Users"
  },
  {
    title: "Diversité",
    desc: "La diversité est notre atout. Nous embrassons les différentes perspectives.",
    icon: "Globe"
  }
];

export const STATS = [
  { label: "Clients satisfaits", value: "80" },
  { label: "Pays", value: "58" },
  { label: "Bureaux", value: "144" },
  { label: "Collaborateurs", value: "5000+" }
];
