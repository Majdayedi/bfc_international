import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HorizontalScroll.css';

// Importing your specific assets


import mauritaniaRep from '/src/assets/representatives/mauritania.png';
import tunisiaRep from '/src/assets/representatives/tunisia.png';
import guineeRep from '/src/assets/representatives/guinee.png';
import senegalRep from '/src/assets/representatives/senegal.png';

gsap.registerPlugin(ScrollTrigger);

const ARTICLES = [
  {
    id: '01',
    category: 'Strategy',
    title: 'Digital Transformation in Africa and MENA: Why Strategy, Not Technology, Determines Outcomes',
    slug: 'digitalization-strategy',
    image: tunisiaRep,
    flag: 'https://flagcdn.com/tn.svg',
    metaTitle: 'Digital Transformation in Africa and MENA | BFC Consulting',
    description: 'Strategy, governance, and trust infrastructure are the real drivers of successful digital transformation—not technology alone.',
    metaDescription: 'Learn why successful digital transformation in Africa depends on strategy, governance, and trust infrastructure—not just technology.',
    tags: ['Digital Transformation', 'Government Strategy', 'Digital Economy', 'Public Sector', 'Africa Innovation', 'Policy & Governance'],
  },
  {
    id: '02',
    category: 'Policy',
    title: 'SME Formalization and Digitalization in Africa: A Strategic Lever for Growth, Tax Revenue, and Financial Inclusion',
    slug: 'sme-formalization',
    image: senegalRep,
    flag: 'https://flagcdn.com/sn.svg',
    metaTitle: 'SME Formalization and Digitalization in Africa | BFC Consulting',
    description: 'How digitalization helps SMEs formalize, access financing, and drive economic growth across Africa and MENA.',
    metaDescription: 'Discover how digitalization enables SME formalization, financial inclusion, and economic growth across Africa and MENA.',
    tags: ['SMEs', 'Financial Inclusion', 'Digital Economy', 'Entrepreneurship', 'Africa Growth', 'Informal Economy'],
  },
  {
    id: '03',
    category: 'Tech',
    title: 'Why Timing Matters: The Cost of Delaying PKI Implementation In Africa',
    slug: 'pki-timing-matters',
    image: guineeRep,
    flag: 'https://flagcdn.com/gn.svg',
    metaTitle: 'Why Timing Matters: The Cost of Delaying PKI in Africa | BFC Consulting',
    description: "Delaying PKI adoption raises costs and complexity. Find out why acting early is essential to securing Africa's digital future.",
    metaDescription: 'Delaying PKI implementation increases costs, complexity, and risks in national digital strategies. Learn why trust infrastructure is critical for digital economies in Africa and MENA.',
    tags: ['Digital Strategy', 'PKI', 'Government Transformation', 'Interoperability', 'Public Sector Innovation', 'Africa Governance'],
  },
  {
    id: '04',
    category: 'Tech',
    title: 'Public Key Infrastructure (PKI) in Africa: The Strategic Backbone of Digital Trust, Sovereignty, and Scalable Services',
    slug: 'pki-strategic-backbone',
    image: mauritaniaRep,
    flag: 'https://flagcdn.com/cg.svg',
    metaTitle: 'PKI in Africa: The Backbone of Digital Trust and Sovereignty | BFC Consulting',
    description: 'A deep dive into how PKI forms the backbone of digital trust, sovereignty, and scalable e-government services across Africa.',
    metaDescription: 'Explore how Public Key Infrastructure (PKI) enables secure digital identity, trusted transactions, and scalable e-government systems across Africa and MENA.',
    tags: ['PKI', 'Digital Trust', 'Cybersecurity', 'E-Government', 'Digital Identity', 'Africa Digital Transformation'],
  }
];

export const HorizontalScroll: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      const pin = gsap.fromTo(sectionRef.current,
        { translateX: 0 },
        {
          translateX: "-70vw",
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "2000 top",
            scrub: 0.1,
            pin: true,
          },
        }
      );
      return () => pin.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="hscroll" ref={triggerRef}>
      <div className="hscroll__header">
        <div className="hscroll__header-inner">
          <h2 className="hscroll__title">Top <span className="hscroll__title-accent">Articles</span></h2>
        </div>
      </div>

      <div ref={sectionRef} className="hscroll__track">
        {ARTICLES.map((article) => (
          <div key={article.id} className="hscroll__card">
            <div className="hscroll__card-media">
              <img src={article.image} alt={article.title} className="hscroll__card-image" />
              <div className="hscroll__card-topline">
                <span className="hscroll__category">{article.category}</span>
                <img src={article.flag} className="hscroll__flag" alt="flag" style={{width: '44px'}} />
              </div>
            </div>
            <div className="hscroll__card-body">
              <h3 className="hscroll__card-title">{article.title}</h3>
              <p className="hscroll__card-desc">{article.description}</p>
            </div>
            <div className="hscroll__card-footer">
              <Link to={`/articles/${article.slug}`} className="hscroll__card-link">
                Read Story <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};