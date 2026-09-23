const fs = require('fs');

let content = fs.readFileSync('components/BfcAcademy.tsx', 'utf-8');

// Replace certData
content = content.replace(/const certData = \[\s*\{[\s\S]*?\}\s*\];/m, `const certData = [
  {
    id: "01",
    title: "Fundamentals of Risk Management",
    location: "London, UK",
    programs: "Foundational Tracks",
    accreditation: "Institute of Risk Management (IRM)",
    intake: "2026",
    description: "Official certificate training program from the Institute of Risk Management. Master risk assessment, treatment techniques, communication, and business continuity.",
    imageUrl: irm
  },
  {
    id: "02",
    title: "Certified Internal Control Specialist (CICS)",
    location: "Florida, USA",
    programs: "Certification Program",
    accreditation: "Internal Control Institute (ICI)",
    intake: "2026",
    description: "Official international certification training program by the Internal Control Institute. Develop expertise in internal control frameworks, governance, and audit.",
    imageUrl: ici
  }
];`);

// Replace groups, allCourses, etc. with courseCatalog
let coursesStr = `const courseCatalog = [
  {
    id: 1,
    title: "L'IA Générative pour l'audit et le contrôle interne",
    institution: "BFC Academy & E2B Training",
    country: "Tunisia / International",
    year: "2026",
    category: "Artificial Intelligence",
    topics: "Maitriser Google Notebook LM, Claude, Prompt Engineering, Automatisation de l'analyse de données, Diagnostic de la Maîtrise des Risques",
    imageUrl: ici, // placeholder, you can change if needed
    isAccredited: true,
    programs: "4-Day Certification Training",
    accreditation: "BFC Academy",
    intake: "2026",
    description: "Transformer les auditeurs en experts 'augmentés' intégrant l'IA générative dans tout le cycle d'audit. Automatiser l'analyse de données et la production documentaire.",
    certificationDescription: "Formation certifiante spécialisée. Outils couverts : Claude, ChatGPT, Copilot, NotebookLM. Formation animée par Nadia Yaich et Kais Khenine. Prix: 1900 HT TND.\\nThèmes: 1: Introduction à l'IA. 2: Panorama des Outils. 3: Prompt Engineering. 4: Analyse des risques et planification avec Claude Cowork. 5: Diagnostic des risques. 6: Vérification de la conformité."
  },
  {
    id: 2,
    title: "Innovation Workshop : Concevoir L'Innovation",
    institution: "BFC Group",
    country: "Tunisia / International",
    year: "2026",
    category: "Innovation",
    topics: "Aligner stratégie, horizons et exécution, Processus d'innovation, Outils d'innovation",
    imageUrl: GII,
    isAccredited: false,
    programs: "Atelier Interactif (6 Heures)",
    accreditation: "BFC Group",
    intake: "2026",
    description: "Atelier interactif et pratique pour initier et concevoir l'innovation et l'aligner avec le processus et besoin de l'entreprise.",
    certificationDescription: "Atelier interactif pour dirigeants, directeurs et managers. Diagnostic primaire et synthèse d'un registre d'innovation. L'atelier couvre les outils concrets pour structurer l'innovation. Prix : 2500 HT DT."
  }
];

  const categories = ['All', ...Array.from(new Set(courseCatalog.map((c) => c.category)))];

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [page, setPage] = useState<number>(1);
  const pageSize = 4;

  const filtered = filterCategory === 'All' ? courseCatalog : courseCatalog.filter((c) => c.category === filterCategory);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  
  if (page > totalPages && totalPages > 0) setPage(totalPages);
  
  const pageStart = (page - 1) * pageSize;
  const pageItems = filtered.slice(pageStart, pageStart + pageSize);

  const onSelectCategory = (cat: string) => {
    setFilterCategory(cat);
    setPage(1);
  };
`;

// we need to rip out everything from `const [filterCategory...` down to `const internationalCertificates = ...`
content = content.replace(/\s\/\/ Filtering & pagination state\s*const \[filterCategory[\s\S]*?const getAccreditedLogo = \(institution: string\) => \{[\s\S]*?return bfcLogo;\n\s*\};/m, "\n  // Replace by catalog\n  " + coursesStr);

// Now rip out the `getCertificationDescription`
content = content.replace(/\sconst getCertificationDescription = \([\s\S]*?\};\n/m, "");

// Now replace pageItems.map...
const mapReplacement = `              {pageItems.map((c, i) => {
                return (
                  <div key={c.id} className="course-card rectangular">
                    {c.isAccredited && (
                      <span className="accredited-badge">ACCREDITED</span>
                    )}
                    <div className="course-card__top-row">
                      <div className="course-card__image-container">
                        <img src={c.imageUrl || bfcLogo} alt={c.title} className="course-card__photo" />
                      </div>
                      <div className="course-card__title-block">
                        <h5 className="course-card__title">{c.title}</h5>
                        <div className="course-card__meta">{c.institution} • {c.country}</div>
                      </div>
                    </div>
                    <div className="course-card__desc">
                      {c.description}
                    </div>
                    <div className="info-strip" role="list">
                      <div className="info-item" role="listitem">
                        <span className="label">Programs</span>
                        <span className="value">{c.programs}</span>
                      </div>
                      <div className="info-item" role="listitem">
                        <span className="label">Accreditation</span>
                        <span className="value">{c.accreditation}</span>
                      </div>
                      <div className="info-item" role="listitem">
                        <span className="label">Intake</span>
                        <span className="value">{c.intake}</span>
                      </div>
                    </div>
                    <div className="course-card__actions">
                      <button className="btn-primary">Enroll Now</button>
                      <Link
                        to={\`/course/\${encodeURIComponent(c.title)}\`}
                        className="btn-outline"
                        state={{
                          course: {
                            title: c.title,
                            institution: c.institution,
                            programs: c.programs,
                            accreditation: c.accreditation,
                            intake: c.intake,
                            language: 'English/French',
                            imageUrl: c.imageUrl,
                            isAccredited: c.isAccredited,
                            certificationDescription: c.certificationDescription,
                            description: c.description,
                            intro: c.description,
                            topics: c.topics,
                          },
                        }}
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                );
              })}`;

content = content.replace(/\{pageItems\.map\(\(c, i\) => \{[\s\S]*?<\/Link>\n\s*<\/div>\n\s*<\/div>\n\s*\);\n\s*\}\)\}/m, mapReplacement);

// remove the references section
content = content.replace(/<section className="academy-references-section">[\s\S]*<\/section>/m, "");

fs.writeFileSync('components/BfcAcademy.tsx', content, 'utf-8');
