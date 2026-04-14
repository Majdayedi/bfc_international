import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ArticleDetailPage.css';
import mauritaniaRep from '/src/assets/representatives/mauritania.png';
import tunisiaRep from '/src/assets/representatives/tunisia.png';
import guineeRep from '/src/assets/representatives/guinee.png';
import senegalRep from '/src/assets/representatives/senegal.png';

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
    sections: [
      {
        h2: 'The Illusion of Progress: When Digitalization Becomes Fragmentation',
        p: [
          'Across the region, governments and institutions have invested heavily in:',
          '• Platforms',
          '• Portals',
          '• Digital tools',
          'Yet outcomes often include:',
          '• Low adoption',
          '• Redundant systems',
          '• Limited economic impact',
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
          '• Communicate',
          '• Share data securely',
          '• Avoid duplication',
          '4. Embedded Trust Infrastructure',
          'No digital system works without:',
          '• Identity',
          '• Authentication',
          '• Legal enforceability',
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
          '• Transparency',
          '• Predictability',
          '• Ease of doing business',
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
          '• Platforms exist',
          '• But usage remains low'
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
          'But only if: Strategy precedes technology'
        ]
      },
      {
        h2: 'BFC Perspective',
        p: [
          'From Experience, digital transformation programs fail when they are:',
          '• Vendor-driven',
          '• Technology-led',
          '• Poorly sequenced',
          'They succeed when they are:',
          '• Strategy-led',
          '• Institutionally anchored',
          '• Designed around real economic use cases',
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
          '• Register faster',
          '• Access services',
          '• Build a verifiable economic footprint',
          'This is foundational for:',
          '• Banking access',
          '• Public procurement eligibility'
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
          '• E-commerce',
          '• Public services',
          '• Cross-border transactions'
        ]
      },
      {
        h2: 'The Key Dilemma for Decision-Makers',
        p: [
          'Leaders face three critical questions:',
          '1. Where do we start? Not with tools—but with use cases that impact revenue and growth:',
          '• Business registration',
          '• Tax collection',
          '• Payments',
          '2. How do we ensure adoption? Adoption is driven by:',
          '• Incentives (not enforcement)',
          '• Simplicity',
          '• Interoperability',
          '3. How do we avoid fragmented systems? This is where most national programs fail. Digitalization must be:',
          '• Centralized in strategy',
          '• Decentralized in execution',
          '• Interoperable by design'
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
          '• Local realities',
          '• Institutional constraints',
          '• Measurable economic outcomes'
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
          'Across Africa and MENA, governments are accelerating digital transformation: E-government platforms, Digital tax systems, SME formalization programs, and Digital payment ecosystems',
          'PKI is often postponed in favor of:',
          '• Faster deployment of digital services',
          '• Pilot platforms',
          '• Sector-specific initiatives',
          'This creates short-term progress—but long-term structural inefficiencies.',
          'The Reality: Delay Increases Complexity and Cost',
          'The longer PKI is delayed, the more digital ecosystems evolve without a unified trust layer.',
          'This leads to:',
          '• Fragmented digital infrastructures across ministries and agencies',
          '• Duplicate identity systems (citizens and businesses registered multiple times, differently)',
          '• Incompatible platforms that cannot securely communicate',
          '• Increasing reliance on manual verification processes despite digital interfaces',
          'Over time, governments are forced to:',
          '• Rebuild systems',
          '• Integrate incompatible architectures',
          '• Reconcile inconsistent data',
          'This significantly increases:',
          '• Cost of implementation',
          '• Project timelines',
          '• Operational risk',
          'In practice, this is where many large-scale digital programs lose momentum.'
        ]
      },
      {
        h2: 'PKI as a Foundation for Formalization and Economic Inclusion',
        p: [
          'Beyond infrastructure, the strategic importance of PKI is directly tied to economic outcomes.',
          'Economic growth in emerging markets depends heavily on:',
          '• Business formalization',
          '• Financial inclusion',
          '• Efficient public service delivery',
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
          '• Reduce duplication',
          '• Accelerate service integration',
          '• Enable faster formalization',
          '• Build stronger citizen engagement',
          'Those that delay face:',
          '• Higher costs',
          '• Slower adoption',
          '• Increased system fragility'
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
          '• Strategic sequencing',
          '• Institutional coordination',
          '• Aligning infrastructure with real economic use cases',
          'PKI should not be approached as a standalone project. It must be positioned as: A foundational layer for state functionality, economic participation, and long-term scalability.'
        ]
      },
      {
        h2: 'Conclusion',
        p: [
          'Delaying PKI is not a neutral decision, It increases costs, fragments systems, and limits the impact of digital transformation efforts.',
          'Governments that prioritize trust infrastructure early, Accelerate formalization, Improve service delivery, Reduce costs and complexity, and Strengthen economic participation.'
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
          '• Clear liability frameworks',
          '• Data protection regulations',
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
          '• Secure digital filing',
          '• Reduced fraud',
          '• Faster processing',
          '2. Public Procurement',
          '• Transparent, auditable bidding',
          '• Reduced corruption risks',
          '3. Financial Services',
          '• KYC automation',
          '• Secure onboarding',
          '• Regulatory compliance',
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
          'Then scale PKI as: Demand increases, Legal frameworks mature'
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
          '• Institutional alignment',
          '• Governance clarity',
          '• Sequencing of investments',
          'PKI should not be sold as infrastructure. It should be positioned as: A national trust layer enabling economic activity, regulatory enforcement, and digital sovereignty.'
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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (data) document.title = data.h1;
  }, [data]);

  if (!data) return <div>Article not found. Please check the URL path.</div>;

  return (
    <article className="article-detail">
      <header className="article-detail__hero">
         <div className="article-detail__hero-media">
          <img
            src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=2400&auto=format&fit=crop"
            alt="Economic outlook and leadership"
          />
          
        </div>
        <div className="article-detail__hero-panel">
          <Link to="/articles" className="article-detail__back">← Back to Articles</Link>
          <h1 className="article-detail__title">{data.h1}</h1>
        </div>
      </header>

      <section className="article-detail__body">
        <div className="article-detail__content">
          {data.sections.map((s: any, i: number) => (
            <div key={i} className="article-detail__reveal is-visible">
              <h2 className="article-detail__h2">{s.h2}</h2>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
};