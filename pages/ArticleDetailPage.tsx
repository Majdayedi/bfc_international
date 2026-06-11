import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ArticleDetailPage.css';
import mauritaniaRep from '/src/assets/representatives/mauritania.png';
import tunisiaRep from '/src/assets/representatives/tunisia.png';
import guineeRep from '/src/assets/representatives/guinee.png';
import senegalRep from '/src/assets/representatives/senegal.png';

/* ─── Helpers ──────────────────────────────────────────────────────── */
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function RenderLines({ lines }: { lines: string[] }) {
  const nodes: React.ReactNode[] = [];
  let bullets: string[] = [];
  let k = 0;

  const flush = () => {
    if (!bullets.length) return;
    nodes.push(
      <ul key={k++}>
        {bullets.map((b, i) => <li key={i}>{b.replace(/^[•\-]\s*/, '')}</li>)}
      </ul>
    );
    bullets = [];
  };

  for (const line of lines) {
    if (!line.trim()) continue;
    const t = line.trim();
    if (t.startsWith('•') || t.startsWith('- ')) {
      bullets.push(t);
    } else {
      flush();
      if (t.startsWith('(Source:') || (t.startsWith('(') && t.endsWith(')'))) {
        nodes.push(<p key={k++} className="article-detail__source-note">{t}</p>);
      } else {
        nodes.push(<p key={k++}>{t}</p>);
      }
    }
  }
  flush();
  return <>{nodes}</>;
}

interface Reference {
  label: string;
  url: string;
  author: string;
  year: string;
}

const CONTENT: Record<string, any> = {
  'digitalization-strategy': {
    heroPhoto:mauritaniaRep,
    h1: 'Digital Transformation in Africa and MENA: Why Strategy, Not Technology, Determines Outcomes',
    metaTitle: 'Digital Transformation in Africa and MENA: Strategy, Not Technology, Drives Results | BFC',
    metaDescription: 'Learn why successful digital transformation in Africa depends on strategy, governance, and trust infrastructure—not just technology.',
    tags: [
      'Digital Transformation',
      'Government Strategy',
      'Digital Economy',
      'Public Sector',
      'Africa Innovation',
      'Policy & Governance',
    ],
    keywords: [
      'digital transformation Africa',
      'national digital strategy Africa',
      'digital economy MENA',
      'government digitalization strategy',
      'e-government Africa',
      'digital infrastructure strategy',
      'public sector transformation',
      'digital governance Africa',
      'economic impact digitalization',
    ],
    readTime: '8 min read',
    publishDate: 'March 15, 2025',
    takeaways: [
      'Technology alone does not drive digital transformation — strategy, sequencing, and institutional ownership are the decisive factors.',
      'Most national digital programs fail due to fragmentation, not lack of investment.',
      'Successful countries (Rwanda, Kenya, Morocco) combine digital identity, mobile payments, and e-services as a coordinated system.',
      'Use-case prioritization — focusing on revenue impact and leakage reduction — is more effective than broad digitalization mandates.',
      'PKI and trust infrastructure must be designed in from the start, not retrofitted after launch.',
    ],
    references: [
      { label: 'World Bank: Digital Development Overview', url: 'https://www.worldbank.org/en/topic/digitaldevelopment', author: 'World Bank', year: '2024' },
      { label: 'ITU: Measuring Digital Development 2023', url: 'https://www.itu.int/en/ITU-D/Statistics/Pages/publications/misr2023.aspx', author: 'International Telecommunication Union', year: '2023' },
      { label: 'African Union: Digital Transformation Strategy 2020–2030', url: 'https://au.int/en/documents/20200518/digital-transformation-strategy-africa-2020-2030', author: 'African Union', year: '2020' },
      { label: 'OECD: Digital Government Index', url: 'https://www.oecd.org/en/topics/digital-government.html', author: 'OECD', year: '2023' },
      { label: 'AfCFTA: Continental Free Trade Agreement Portal', url: 'https://au-afcfta.org/', author: 'African Union Commission', year: '2023' },
    ],
    relatedProjects: [
      { id: 2, title: 'Technical assistance for PKI legal framework and e-certification', country: 'Mauritania', flag: 'https://flagcdn.com/w40/mr.png' },
      { id: 7, title: 'Feasibility study for a digital addressing system', country: 'Mali', flag: 'https://flagcdn.com/w40/ml.png' },
    ],
    sections: [
      {
        h2: 'The Illusion of Progress: When Digitalization Becomes Fragmentation',
        p: [
          'Across the region, governments and institutions have invested heavily in:',
          '• Platforms — standalone portals deployed without a unified architecture',
          '• Portals — web interfaces built in isolation, with no shared data layer',
          '• Digital tools — sector-specific applications that cannot communicate with each other',
          'Yet outcomes often include:',
          '• Low adoption — citizens and businesses do not use the systems built for them',
          '• Redundant systems — the same function duplicated across ministries and agencies',
          '• Limited economic impact — investment does not translate into measurable economic change',
          'The issue is not lack of investment. It is the absence of strategic coherence.',
          '4. Market Adoption: SMEs, banks, citizens',
          'Most programs fail because they move one layer at a time.'
        ]
      },
      {
        h2: 'What Actually Drives Successful National Digital Transformation',
        p: [
          '1. Clear Use-Case Prioritization',
          'Not “digitize everything” but:',
          '• Where does digitalization increase revenue?',
          '• Where does it reduce leakage?',
          '• Where does it unlock growth?',
          '2. Institutional Ownership at the Highest Level',
          'Successful programs are:',
          '• Driven by executive leadership',
          '• Not isolated within ministries or IT departments',
          '3. Interoperability as a Design Principle',
          'Systems must:',
          '• Communicate — exchange data reliably across agencies and ministries',
          '• Share data securely — with encryption, access controls, and audit trails',
          '• Avoid duplication — one system of record, not ten conflicting registries',
          '4. Embedded Trust Infrastructure',
          'No digital system works without:',
          '• Identity — a verified, unique identifier for every citizen, business, and official',
          '• Authentication — proof that an identity is being used by its rightful owner',
          '• Legal enforceability — digital actions that carry the same weight as physical signatures',
          'This is where PKI becomes critical.'
        ]
      },
      {
        h2: 'The Economic Case (What Leaders Actually Care About)',
        p: [
          'Digital transformation impacts:',
          '1. Revenue Mobilization',
          '• Broader tax base',
          '• Reduced informality',
          '(World Bank estimates significant gains from digital tax systems)',
          '2. Cost Efficiency',
          '• Reduced administrative overhead',
          '• Faster service delivery',
          '3. Investment Attractiveness',
          '• Transparency — auditable processes and publicly accountable spending',
          '• Predictability — stable regulations and consistent enforcement that attract investors',
          '• Ease of doing business — streamlined administrative processes that reduce time and cost',
          '4. SME Growth',
          '• Access to finance',
          '• Market expansion',
          '• Integration into formal economy'
        ]
      },
      {
        h2: 'The Risk of “Digitizing Chaos”',
        p: [
          'If underlying systems are weak:',
          '• Digitalization accelerates inefficiency',
          '• Corruption becomes more scalable',
          '• Citizen trust declines',
          'This is already visible in multiple countries where:',
          '• Platforms exist — but operate as silos with no cross-agency interoperability',
          '• Usage remains low — adoption blocked by lack of trust and user complexity'
        ]
      },
      {
        h2: 'Africa’s Strategic Window (And Why It Matters Now)',
        p: [
          'Africa is in a unique position:',
          '• High mobile penetration',
          '• Rapid fintech growth',
          '• Continental integration via AfCFTA',
          'This allows for:',
          '• Leapfrogging legacy systems',
          '• Building digital economies from the ground up',
          'But only if — strategy precedes technology',
        ]
      },
      {
        h2: 'BFC Perspective',
        p: [
          'From Experience, digital transformation programs fail when they are:',
          '• Vendor-driven — technology choices dictated by suppliers, not national strategy',
          '• Technology-led — solutions deployed before problems are properly defined',
          '• Poorly sequenced — layers built without a coherent rollout order',
          'They succeed when they are:',
          '• Strategy-led — priority use cases and objectives defined before any procurement',
          '• Institutionally anchored — owned at the highest levels of government, not siloed in IT',
          '• Designed around real economic use cases — built where they generate measurable returns',
          'Digitalization is not about modernization. It is about competitiveness, sovereignty, and control over economic flows.',
          'Starting this process by thoroughly mapping social and economic actors, both private and public sides along with their needs, processes, and capabilities, and then moving to creating a strategic PKI strategy and rollout plan directed by SMART national and sectorial objectives, and adapting as we go via continuous monitoring and evaluation, market listening, and stakeholder communication…wins',
          'The countries that get this right will not just improve services. They will redefine their position in the global economy.'
        ]
      }
    ]
  },
  'sme-formalization': {
    heroPhoto: tunisiaRep,
    h1: 'SME Formalization and Digitalization in Africa: A Strategic Lever for Growth, Tax Revenue, and Financial Inclusion',
    metaTitle: 'SME Digitalization and Formalization in Africa: Unlocking Growth and Financial Inclusion | BFC',
    metaDescription: 'Discover how digitalization enables SME formalization, financial inclusion, and economic growth across Africa and MENA.',
    tags: [
      'SMEs',
      'Financial Inclusion',
      'Digital Economy',
      'Entrepreneurship',
      'Africa Growth',
      'Informal Economy',
    ],
    keywords: [
      'SME digitalization Africa',
      'SME formalization Africa',
      'digital transformation SMEs MENA',
      'financial inclusion SMEs Africa',
      'mobile payments Africa SMEs',
      'digital identity businesses Africa',
      'SME access to finance Africa',
      'informal economy Africa',
      'e-government services SMEs',
    ],
    readTime: '10 min read',
    publishDate: 'January 22, 2025',
    takeaways: [
      'SMEs represent over 90% of businesses in Africa and MENA, yet informality limits their contribution to national tax revenues.',
      'Informality is a system failure — complex registration, inaccessible finance, and opaque tax regimes — not a behavioral one.',
      'Digitalization creates the missing link: it reduces friction, builds financial identities, and gives SMEs tangible reasons to formalize.',
      'Success requires strategy-led design: centralized in vision, decentralized in execution, and interoperable by default.',
      'Countries like Rwanda, Kenya, and Morocco show that mobile payments + digital identity + e-government can unlock rapid formalization at scale.',
    ],
    references: [
      { label: 'World Bank: SME Finance', url: 'https://www.worldbank.org/en/topic/smefinance', author: 'World Bank', year: '2024' },
      { label: 'GSMA: State of the Industry Report on Mobile Money 2023', url: 'https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/programme/mobile-money/state-of-the-industry-report-on-mobile-money/', author: 'GSMA', year: '2023' },
      { label: 'IMF: Financial Inclusion', url: 'https://www.imf.org/en/Topics/financial-inclusion', author: 'International Monetary Fund', year: '2024' },
      { label: 'IFC: MSME Access to Finance', url: 'https://www.ifc.org/en/topic/msme-banking-access-to-finance', author: 'International Finance Corporation', year: '2023' },
      { label: 'AfCFTA: Continental Free Trade Agreement Portal', url: 'https://au-afcfta.org/', author: 'African Union Commission', year: '2023' },
    ],
    relatedProjects: [
      { id: 1, title: 'Study on the formalization of MSMEs in the Republic of Benin', country: 'Benin', flag: 'https://flagcdn.com/w40/bj.png' },
      { id: 10, title: 'Mapping the SME and Startup ecosystem', country: 'Ivory Coast', flag: 'https://flagcdn.com/w40/ci.png' },
    ],
    sections: [
      {
        h2: 'Why SME Formalization Has Become a Strategic Priority for Governments in Africa',
        p: [
          'Across Africa and MENA, SMEs represent:',
          '• Over 90% of businesses (World Bank)',
          '• Around 50–60% of employment',
          '• Yet contribute significantly less to tax revenues due to informality',
          'For ministers and policymakers, the dilemma is clear: How do you formalize without suffocating growth?',
          'Traditional approaches—compliance-heavy, enforcement-led—have consistently failed.',
          'The shift today is structural: Formalization is no longer a legal process. It is a digital transformation challenge.'
        ]
      },
      {
        h2: 'The Core Problem: Informality Is a System Failure, Not a Behavioral One',
        p: [
          'SMEs do not avoid formalization out of resistance. They operate informally because:',
          '• Registration processes are fragmented and slow',
          '• Financial systems are inaccessible',
          '• Tax regimes are complex and unpredictable',
          '• Trust in institutions is often low',
          'This creates a cycle: No formalization → No data → No financing → No growth'
        ]
      },
      {
        h2: 'Digitalization as the Missing Link Between Informality and Growth',
        p: [
          'Digital infrastructure allows governments to:',
          '• Reduce friction in business registration',
          '• Enable traceable transactions',
          '• Build financial identities for SMEs',
          '• Increase tax compliance without coercion',
          '• Most importantly: Create a true tangible added value of formalization from the SME’s perspective: scalable processes and access to new bigger markets and financing',
          'Countries that have made progress (e.g., Rwanda, Kenya, Morocco) have done so by:',
          '• Integrating digital identity',
          '• Enabling mobile and digital payments',
          '• Simplifying e-government services'
        ]
      },
      {
        h2: 'The 4 Strategic Pillars of SME Digitalization Programs',
        h3: '1. Digital Identity for Businesses',
        p: [
          'A unified digital identity allows SMEs to:',
          '• Register faster — digital onboarding in days, replacing months of paper-based queues',
          '• Access services — government platforms, procurement portals, and financial grants',
          '• Build a verifiable economic footprint — a traceable record enabling credit and contracts',
          'This is foundational for:',
          '• Banking access — open accounts and access credit without paper-heavy verification',
          '• Public procurement eligibility — qualify for government contracts and competitive tenders'
        ]
      },
      {
        h3: '2. Payment Infrastructure and Financial Inclusion',
        p: [
          'Mobile money and digital payments:',
          '• Reduce cash dependency',
          '• Create transaction histories',
          '• Enable credit scoring for previously invisible businesses',
          '(Source: GSMA Mobile Money Reports)'
        ]
      },
      {
        h3: '3. Simplified Taxation Through Digital Systems',
        p: [
          'Digital tax platforms:',
          '• Reduce administrative burden',
          '• Increase compliance rates',
          '• Improve revenue predictability',
          'Example: E-filing systems in multiple African countries have significantly increased tax base visibility (IMF, OECD).'
        ]
      },
      {
        h3: '4. Trust Infrastructure (PKI & Digital Signatures)',
        p: [
          'Without trust, digital systems fail. Public Key Infrastructure (PKI) enables:',
          '• Legally binding digital contracts',
          '• Secure authentication',
          '• Data integrity across systems',
          'This is essential for:',
          '• E-commerce — legally binding online transactions between businesses and consumers',
          '• Public services — secure, authenticated access to government platforms and entitlements',
          '• Cross-border transactions — authenticated trade flows within AfCFTA digital frameworks'
        ]
      },
      {
        h2: 'The Key Dilemma for Decision-Makers',
        p: [
          'Leaders face three critical questions:',
          '1. Where do we start? Not with tools—but with use cases that impact revenue and growth:',
          '• Business registration — simplified digital enrollment with a unique national identifier',
          '• Tax collection — automated digital filing and real-time revenue tracking',
          '• Payments — mobile and digital infrastructure as the backbone of economic formalization',
          '2. How do we ensure adoption? Adoption is driven by:',
          '• Incentives over enforcement — access to credit, contracts, and services as drivers of uptake',
          '• Simplicity — registration and compliance achievable in a few steps on a mobile device',
          '• Interoperability — one registration connects to tax, finance, and government platforms',
          '3. How do we avoid fragmented systems? This is where most national programs fail. Digitalization must be:',
          '• Centralized in strategy — a unified national vision with a single point of accountability',
          '• Decentralized in execution — agencies and regions adapt the model to local conditions',
          '• Interoperable by design — systems built to communicate from day one, not retrofitted later'
        ]
      },
      {
        h2: 'Risks of Poorly Designed Digitalization Strategies',
        p: [
          '• Digitizing inefficient processes',
          '• Vendor-driven (not strategy-driven) systems',
          '• Lack of regulatory alignment',
          '• Low adoption despite high investment',
          'This leads to: High cost, low impact transformation'
        ]
      },
      {
        h2: 'The Opportunity: A New Social Contract with SMEs',
        p: [
          'When done right, SME digitalization:',
          '• Expands the tax base',
          '• Unlocks access to finance',
          '• Drives job creation',
          '• Strengthens economic resilience',
          'This is not just economic reform. It is state modernization.'
        ]
      },
      {
        h2: 'BFC Perspective: From Digital Tools to Institutional Transformation',
        p: [
          'At BFC, we support governments and institutions across Africa and MENA in:',
          '• Designing national SME formalization strategies',
          '• Structuring digital ecosystems (identity, payments, trust)',
          '• Aligning regulation with technology',
          '• Ensuring adoption at scale',
          'Our approach is grounded in:',
          '• Local realities — regulatory environments, infrastructure gaps, and cultural context',
          '• Institutional constraints — governance capacity, budget cycles, and coordination challenges',
          '• Measurable economic outcomes — KPIs tied to revenue, adoption, and formalization rates'
        ]
      },
      {
        h2: 'Conclusion',
        p: [
          'SME formalization is not a compliance issue. It is a strategic growth lever. Countries that understand this are not just digitizing—they are restructuring their economies for competitiveness.'
        ]
      }
    ]
  },
  'pki-timing-matters': {
    heroPhoto: guineeRep,
    h1: 'Why Delaying Public Key Infrastructure (PKI) Is Costing Governments More Than They Realize',
    metaTitle: 'Why Governments Must Prioritize PKI Early in Digital Transformation | BFC',
    metaDescription: 'Delaying PKI implementation increases costs, complexity, and risks in national digital strategies. Learn why trust infrastructure is critical for digital economies in Africa and MENA.',
    tags: [
      'Digital Strategy',
      'PKI',
      'Government Transformation',
      'Interoperability',
      'Public Sector Innovation',
      'Africa Governance',
    ],
    keywords: [
      'PKI Africa',
      'public key infrastructure government',
      'digital trust infrastructure Africa',
      'PKI implementation strategy',
      'digital identity Africa',
      'e-government security',
      'SME formalization digital',
      'interoperability government systems',
    ],
    readTime: '9 min read',
    publishDate: 'February 10, 2025',
    takeaways: [
      'Delaying PKI is not a neutral decision — each month without it adds cost, complexity, and fragmentation to digital ecosystems.',
      'Governments that defer trust infrastructure end up rebuilding systems at higher cost when incompatibilities compound.',
      'Economic inclusion (SME formalization, financial access) fundamentally depends on reliable identity and legally enforceable digital interactions.',
      'Citizens and businesses only engage with digital services when they perceive tangible value — security, rights protection, and access to financing.',
      'Africa still has a window to design interoperable digital ecosystems from the ground up — that window is narrowing.',
    ],
    references: [
      { label: 'UNCITRAL: Model Law on Electronic Signatures', url: 'https://uncitral.un.org/en/texts/ecommerce/modellaw/electronic_signatures', author: 'UNCITRAL', year: '2001' },
      { label: 'World Bank: Digital Development Overview', url: 'https://www.worldbank.org/en/topic/digitaldevelopment', author: 'World Bank', year: '2024' },
      { label: 'ITU-T X.509: Public-key and attribute certificate frameworks', url: 'https://www.itu.int/rec/T-REC-X.509/en', author: 'ITU', year: '2019' },
      { label: 'GSMA: Digital Identity Programme', url: 'https://www.gsma.com/identity/', author: 'GSMA', year: '2023' },
      { label: 'NIST: Digital Identity Guidelines SP 800-63', url: 'https://pages.nist.gov/800-63-3/', author: 'NIST', year: '2020' },
    ],
    relatedProjects: [
      { id: 2, title: 'Technical assistance for PKI legal framework and e-certification', country: 'Mauritania', flag: 'https://flagcdn.com/w40/mr.png' },
      { id: 3, title: 'Design and implementation of the Information System', country: 'Guinea', flag: 'https://flagcdn.com/w40/gn.png' },
    ],
    sections: [
      {
        h2: 'Executive Summary',
        p: [
          'Governments across Africa and MENA are investing heavily in digitalization—tax platforms, e-government services, SME formalization programs, and digital payments.',
          'Most of these systems are being deployed without a unified trust infrastructure.',
          'This creates a predictable outcome:',
          '• Digital systems that do not communicate effectively',
          '• Duplicate identities for citizens and businesses',
          '• Rising costs due to system rework and integration failures',
          '• Low adoption driven by lack of trust and legal clarity',
          'The longer Public Key Infrastructure (PKI) is delayed:',
          '• The more complex and expensive digital ecosystems become',
          '• The harder it is to align institutions and data',
          '• The greater the risk of building fragmented, non-scalable systems',
          'At the same time, economic priorities—SME formalization, financial inclusion, and tax expansion—depend directly on:',
          '• Reliable identity',
          '• Secure transactions',
          '• Legal enforceability',
          'These are not standalone reforms. They require a trusted, interconnected system capable of identifying individuals and businesses, enabling service delivery, and securing economic interactions.',
          'PKI is not a technical upgrade. It is a prerequisite for coherent digital states and scalable economic growth.',
          'The decision is not whether to implement it. It is whether to absorb the cost now—or pay significantly more later.'
        ]
      },
      {
        h2: 'Why Timing Matters: The Cost of Delaying PKI Implementation',
        p: [
          'One of the most underestimated risks in national digital strategies is deferring the establishment of a trust infrastructure.',
          'Across Africa and MENA, governments are accelerating digital transformation:',
          '• E-government platforms',
          '• Digital tax systems',
          '• SME formalization programs',
          '• Digital payment ecosystems',,
          'PKI is often postponed in favor of:',
          '• Faster deployment of digital services',
          '• Pilot platforms — quick-launch tools that bypass the foundational trust layer',
          '• Sector-specific initiatives — isolated programs with no cross-system interoperability',
          'This creates short-term progress—but long-term structural inefficiencies.',
          'The Reality: Delay Increases Complexity and Cost',
          'The longer PKI is delayed, the more digital ecosystems evolve without a unified trust layer.',
          'This leads to:',
          '• Fragmented digital infrastructures across ministries and agencies',
          '• Duplicate identity systems (citizens and businesses registered multiple times, differently)',
          '• Incompatible platforms that cannot securely communicate',
          '• Increasing reliance on manual verification processes despite digital interfaces',
          'Over time, governments are forced to:',
          '• Rebuild systems — entire platforms redesigned as incompatibilities compound',
          '• Integrate incompatible architectures — costly middleware bridging systems never designed to connect',
          '• Reconcile inconsistent data — resolving duplicate identities, mismatched records, and conflicting registries',
          'This significantly increases:',
          '• Cost of implementation — exponentially higher when retrofitting trust into live systems',
          '• Project timelines — extended by months or years as integration complexity compounds',
          '• Operational risk — system failures, data breaches, and cascading service disruptions',
          'In practice, this is where many large-scale digital programs lose momentum.'
        ]
      },
      {
        h2: 'PKI as a Foundation for Formalization and Economic Inclusion',
        p: [
          'Beyond infrastructure, the strategic importance of PKI is directly tied to economic outcomes.',
          'Economic growth in emerging markets depends heavily on:',
          '• Business formalization — registering entities with legal identity and economic visibility',
          '• Financial inclusion — enabling SMEs and individuals to access banking, credit, and markets',
          '• Efficient public service delivery — reducing friction in government-to-citizen interactions',
          'None of these can scale without:',
          '• Reliable identification of individuals and businesses',
          '• Secure and traceable transactions',
          '• Legal enforceability of digital interactions',
          'PKI enables all three.'
        ]
      },
      {
        h2: 'Trust as an Economic Driver, Not a Soft Variable',
        p: [
          'A critical but often overlooked dimension:',
          'Economic participation depends on trust in the system.',
          'Citizens and businesses will only formalize, transact, and engage if they perceive:',
          '• The system is secure',
          '• Their data is protected',
          '• Their rights are enforceable',
          '• There is clear value in participation',
          'This value is tangible:',
          '• Access to healthcare and social protection systems',
          '• Inclusion in education and public services',
          '• Ability to access financing and scale businesses',
          '• Protection within a recognized legal framework',
          'It is only once that the people experience this tangible and structured added value, that they would start to actively engage and support government initiatives'
        ]
      },
      {
        h2: 'Why Digital Systems Cannot Be Built in Isolation',
        p: [
          'Digital transformation is often approached sector by sector:',
          '• Tax systems',
          '• Social programs',
          '• Business registries',
          '• Financial platforms',
          'In reality, these systems are deeply interconnected.',
          'Effective delivery requires a system that can:',
          '• Identify individuals and businesses reliably',
          '• Authenticate interactions securely',
          '• Connect data across institutions',
          '• Enable service delivery and revenue collection simultaneously',
          'This is not achievable through isolated platforms.',
          'It requires a secure, interoperable trust layer—which is precisely the role of PKI.'
        ]
      },
      {
        h2: 'The Strategic Implication for Decision-Makers',
        p: [
          'Delaying PKI does not delay complexity. It shifts it forward—and amplifies it.',
          'Governments that prioritize trust infrastructure early:',
          '• Reduce duplication — one trusted identity used consistently across all government services',
          '• Accelerate service integration — systems connect faster when a trust layer already exists',
          '• Enable faster formalization — businesses and citizens can register and transact digitally',
          '• Build stronger citizen engagement — trust in the system drives adoption and compliance',
          'Those that delay face:',
          '• Higher costs — system rework and retrofitting multiply the original investment',
          '• Slower adoption — citizens and businesses disengage from fragmented, unclear systems',
          '• Increased system fragility — single points of failure with no trusted fallback layer'
        ]
      },
      {
        h2: 'BFC Perspective, Africa’s Opportunity—and Risk',
        p: [
          'Many countries across Africa still have the opportunity to:',
          '• Design digital ecosystems from the ground up',
          '• Avoid legacy system constraints',
          '• Build interoperable systems from the start',
          'However, this window is narrowing.',
          'As more systems are deployed independently, alignment becomes harder and more expensive.',
          'In practice, the challenge is rarely technical. It lies in:',
          '• Strategic sequencing — prioritizing the trust layer before scaling dependent digital services',
          '• Institutional coordination — aligning ministries, regulators, and agencies on a shared roadmap',
          '• Aligning infrastructure with real economic use cases — building where it generates the most returns',
          'PKI should not be approached as a standalone project — it must be positioned as a foundational layer for state functionality, economic participation, and long-term scalability.',
        ]
      },
      {
        h2: 'Conclusion',
        p: [
          'Delaying PKI is not a neutral decision — it increases costs, fragments systems, and limits the impact of digital transformation efforts.',
          'Governments that prioritize trust infrastructure early:',
          '• Accelerate formalization',
          '• Improve service delivery',
          '• Reduce costs and complexity',
          '• Strengthen economic participation',
        ]
      }
    ]
  },
  'pki-strategic-backbone': {
    heroPhoto: senegalRep,
    h1: 'Public Key Infrastructure (PKI) in Africa: The Strategic Backbone of Digital Trust, Sovereignty, and Scalable Services',
    metaTitle: 'Public Key Infrastructure (PKI) in Africa: Building Digital Trust for Governments and Economies | BFC',
    metaDescription: 'Explore how Public Key Infrastructure (PKI) enables secure digital identity, trusted transactions, and scalable e-government systems across Africa and MENA.',
    tags: [
      'PKI',
      'Digital Trust',
      'Cybersecurity',
      'E-Government',
      'Digital Identity',
      'Africa Digital Transformation',
    ],
    keywords: [
      'PKI Africa',
      'public key infrastructure Africa',
      'digital trust infrastructure Africa',
      'PKI government implementation',
      'digital identity Africa',
      'e-signature law Africa',
      'cybersecurity government Africa',
      'digital trust framework MENA',
      'certificate authority Africa',
    ],
    readTime: '11 min read',
    publishDate: 'April 5, 2025',
    takeaways: [
      'PKI is not an IT project — it is a national trust infrastructure enabling verifiable identity, secure transactions, and digital sovereignty.',
      'Without a trust layer, digital services fail to scale: documents are unenforceable, identities are duplicated, and cross-border trade stalls.',
      "The EU's eIDAS framework demonstrates that legal, technical, and operational layers must be aligned — not sequenced separately.",
      "Africa's window to leapfrog legacy infrastructure is real, but requires deliberate strategy: sovereignty, interoperability, and use-case targeting must coexist.",
      'Failure patterns are consistent: PKI treated as IT procurement, no cross-ministry coordination, no integration with real economic use cases.',
    ],
    references: [
      { label: 'EU eIDAS Regulation: Electronic Identification and Trust Services', url: 'https://digital-strategy.ec.europa.eu/en/policies/eidas-regulation', author: 'European Commission', year: '2023' },
      { label: 'UNCITRAL: Model Law on Electronic Signatures', url: 'https://uncitral.un.org/en/texts/ecommerce/modellaw/electronic_signatures', author: 'UNCITRAL', year: '2001' },
      { label: 'World Bank: Digital Development Overview', url: 'https://www.worldbank.org/en/topic/digitaldevelopment', author: 'World Bank', year: '2024' },
      { label: 'AfCFTA: Continental Free Trade Agreement Portal', url: 'https://au-afcfta.org/', author: 'African Union Commission', year: '2023' },
      { label: 'GSMA: Digital Identity Programme', url: 'https://www.gsma.com/identity/', author: 'GSMA', year: '2023' },
    ],
    relatedProjects: [
      { id: 2, title: 'Technical assistance for PKI legal framework and e-certification', country: 'Mauritania', flag: 'https://flagcdn.com/w40/mr.png' },
      { id: 6, title: 'Strategic plan for private investment and APIP business plan', country: 'Guinea', flag: 'https://flagcdn.com/w40/gn.png' },
    ],
    sections: [
      {
        h2: 'Why PKI Has Moved from Technical Topic to Strategic Priority',
        p: [
          'Across Africa and MENA, governments are accelerating:',
          '• Digital identity programs',
          '• E-government platforms',
          '• Digital payments ecosystems',
          'Yet many of these initiatives stall at scale for one reason: Trust is not embedded in the infrastructure.',
          'PKI is often introduced late—treated as a compliance layer rather than a foundational design choice.',
          'This is a strategic mistake.',
          'Without a national trust infrastructure:',
          '• Digital services cannot scale securely',
          '• Cross-border recognition remains limited',
          '• Legal enforceability of digital transactions is weak'
        ]
      },
      {
        h2: 'What Decision-Makers Need to Understand (Beyond the Technical Definition)',
        p: [
          'PKI is not about certificates. It is about enabling three things at national level:',
          '1. Verifiable Identity',
          'Ensuring that:',
          '• A citizen is who they claim to be',
          '• A business is legally recognized',
          '• A public official can act digitally with authority',
          '2. Transaction Integrity',
          'Guaranteeing that:',
          '• Documents are not altered',
          '• Contracts are enforceable',
          '• Communications are secure',
          '3. Institutional Trust',
          '• Clear liability frameworks — defining who is accountable when digital interactions fail or are disputed',
          '• Data protection regulations — legal assurance that personal and business data is safeguarded',
          'Examples:',
          '• The EU’s eIDAS framework is often referenced because it aligns legal, technical, and operational layers',
          '• Several African countries have adopted e-signature laws, but implementation gaps remain significant',
          '(Source: World Bank Digital Development, UNCITRAL Model Law on Electronic Signatures)'
        ]
      },
      {
        h2: 'Where PKI Actually Creates Measurable Value',
        p: [
          '1. Tax and Public Finance',
          '• Secure digital filing — taxpayers authenticate directly, eliminating document forgery',
          '• Reduced fraud — cryptographic signatures make falsified declarations detectable',
          '• Faster processing — digital submissions remove manual review and paper-based bottlenecks',
          '2. Public Procurement',
          '• Transparent, auditable bidding',
          '• Reduced corruption risks',
          '3. Financial Services',
          '• KYC automation — verified digital identities replace manual document checks at scale',
          '• Secure onboarding — cryptographically authenticated enrollment, no physical presence required',
          '• Regulatory compliance — auditable digital trails satisfy AML and prudential requirements',
          '4. Cross-Border Trade',
          '• Digital certificates of origin',
          '• Alignment with AfCFTA ambitions'
        ]
      },
      {
        h2: 'The Most Common Failure Patterns',
        p: [
          'Let’s be direct—these are recurring across multiple countries:',
          '• PKI treated as an IT project, not a national program',
          '• Lack of coordination between: telecom regulators, central banks, justice ministries',
          '• Over-engineered systems with low adoption',
          '• No integration with real use cases (tax, identity, payments)',
          'Result: High investment, minimal impact'
        ]
      },
      {
        h2: 'Strategic Sequencing: Where to Start',
        p: [
          'Governments that succeed do not start with infrastructure alone. They start with high-impact use cases:',
          '1. Digital identity integration',
          '2. Tax and business registration',
          '3. Government-to-business transactions',
          'Then scale PKI as:',
          '• Demand increases — adoption grows as citizens and businesses engage with digital services',
          '• Legal frameworks mature — e-signature laws and data protection regulations take effect',
        ]
      },
      {
        h2: 'Sovereignty vs Interoperability: The African Context',
        p: [
          'A critical tension:',
          '• Full sovereignty → control, but isolation risk',
          '• Full interoperability → scale, but dependency risk',
          'With initiatives like the AfCFTA, the direction is clear: Future systems must be interoperable by design, not retrofitted later.'
        ]
      },
      {
        h2: 'BFC Perspective',
        p: [
          'In our work across Africa and MENA, the issue is rarely technical. It is:',
          '• Institutional alignment — ministries, regulators, and agencies working from a shared roadmap',
          '• Governance clarity — defined roles, responsibilities, and decision rights across all stakeholders',
          '• Sequencing of investments — building the trust layer before scaling dependent digital services',
          'PKI should not be sold as infrastructure — it should be positioned as a national trust layer enabling economic activity, regulatory enforcement, and digital sovereignty.',
        ]
      },
      {
        h2: 'Conclusion',
        p: [
          'PKI is not urgent because it is complex. It is urgent because everything else depends on it.',
          'Countries that delay its strategic integration will:',
          '• Struggle to scale digital services',
          '• Face increasing cybersecurity risks',
          '• Remain limited in cross-border digital trade'
        ]
      }
    ]
  }
};

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? CONTENT[slug] : null;
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (data) document.title = data.metaTitle || data.h1;
  }, [data]);

  useEffect(() => {
    const update = () => {
      const top = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(height > 0 ? Math.min(top / height, 1) : 0);
      const heroDistance = Math.max(window.innerHeight * 0.65, 1);
      setHeroProgress(Math.min(top / heroDistance, 1));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.article-detail__reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [data]);

  if (!data) return <div style={{ padding: '4rem', textAlign: 'center' }}>Article not found.</div>;

  const h2Sections = data.sections.filter((s: any) => s.h2);

  return (
    <article className="article-detail" style={{ ['--hero-progress' as any]: heroProgress }}>
      {/* ── Reading progress bar ─────────────────────────────── */}
      <div className="article-detail__progress">
        <span style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="article-detail__hero">
        <div className="article-detail__hero-media">
          <img src={data.heroPhoto} alt={data.h1} />
        </div>
        <div className="article-detail__hero-panel">
          <div className="article-detail__hero-top">
            <Link to="/who-we-are/our-articles" className="article-detail__back">← Back to Articles</Link>
            <span className="article-detail__eyebrow">Research Report</span>
          </div>
          <h1 className="article-detail__title">{data.h1}</h1>
          {data.metaDescription && (
            <p className="article-detail__subtitle">{data.metaDescription}</p>
          )}
          <div className="article-detail__meta">
            <span>{data.readTime || '8 min read'}</span>
            <span>{data.publishDate || '2025'}</span>
            <span>By BFC Insights</span>
          </div>
          {data.tags && (
            <div className="article-detail__tags">
              {data.tags.map((tag: string) => (
                <span key={tag} className="article-detail__tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────── */}
      <section className="article-detail__body">
        <div className="article-detail__content">

          {/* Key takeaways inline box */}
          

          {/* Sections */}
          {data.sections.map((s: any, i: number) => (
            <div key={i} className="article-detail__reveal">
              {s.h2 && <h2 id={slugify(s.h2)}>{s.h2}</h2>}
              {s.h3 && <h3>{s.h3}</h3>}
              {s.p && <RenderLines lines={s.p} />}
            </div>
          ))}

          <div className="article-detail__divider" />

          {/* References */}
          {data.references && (
            <div className="article-detail__references article-detail__reveal">
              <h2>References</h2>
              <ol>
                {(data.references as Reference[]).map((ref, i) => (
                  <li key={i} className="article-detail__reference-item">
                    <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.label}</a>
                    <span className="article-detail__ref-meta"> — {ref.author}, {ref.year}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Author */}
          <div className="article-detail__author article-detail__reveal">
            <div className="article-detail__author-avatar">BI</div>
            <div>
              <p className="article-detail__author-name">BFC Insights</p>
              <p className="article-detail__author-role">Strategy & Digital Transformation Practice</p>
            </div>
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────────── */}
        <aside className="article-detail__sidebar">
          {h2Sections.length > 0 && (
            <div className="article-detail__card article-detail__reveal">
              <p className="article-detail__card-label">In this article</p>
              {h2Sections.map((s: any, i: number) => (
                <a key={i} href={`#${slugify(s.h2)}`} className="article-detail__toc-link">
                  {s.h2}
                </a>
              ))}
            </div>
          )}
          {data.takeaways && (
            <div className="article-detail__card article-detail__reveal">
              <p className="article-detail__takeaways-label">Key takeaways</p>
              <ul className="article-detail__sidebar-takeaways">
                {data.takeaways.map((t: string, i: number) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="article-detail__card article-detail__reveal">
            <p className="article-detail__card-label">Related projects</p>
            {data.relatedProjects && data.relatedProjects.map((p: any) => (
              <Link
                key={p.id}
                to={`/who-we-are/our-projects/${p.id}`}
                className="article-detail__related-link"
              >
                <img src={p.flag} alt={p.country} className="article-detail__related-flag" />
                <span>{p.title}</span>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="article-detail__cta">
        <div className="article-detail__cta-inner">
          <div>
            <p className="article-detail__cta-eyebrow">Continue exploring</p>
            <h3>Read more from the BFC strategy series</h3>
          </div>
          <Link to="/who-we-are/our-articles" className="article-detail__cta-button">
            View all articles
          </Link>
        </div>
      </section>
    </article>
  );
};