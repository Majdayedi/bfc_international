
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import './HorizontalScroll.css';
import contactImage from '../src/assets/contact.jpg';
import consultationImage from '../src/assets/contact1.jpg';
import teamImage from '../src/assets/contact2.png';
import careersImage from '../src/assets/job.jpg';
import aboutImage from '../src/assets/about_us1.png';
import congoFlag from '../src/assets/flags/congo.svg';
import senegalFlag from '../src/assets/flags/senegal.svg';
import tunisiaFlag from '../src/assets/flags/tunisia.svg';
import guineeFlag from '../src/assets/flags/guinea.svg';
import mauritaniaFlag from '../src/assets/flags/mauritania.svg';

gsap.registerPlugin(ScrollTrigger);

const ARTICLES = [
  {
    id: '01',
    category: 'Strategy',
    title: 'The Future of AI in African Fintech',
    desc: 'Exploring how large language models are reshaping the landscape of emerging market banking.',
    total: '05',
    image: contactImage,
    imageAlt: 'Business discussion around digital finance strategy',
    flag: tunisiaFlag,
    flagAlt: 'Tunisia flag',
    region: 'Tunisia',
  },
  {
    id: '02',
    category: 'Innovation',
    title: 'Scaling Digital Public Goods',
    desc: 'How decentralized identities can transform government transparency and service delivery.',
    total: '05',
    image: consultationImage,
    imageAlt: 'Consultants collaborating around a table',
    flag: senegalFlag,
    flagAlt: 'Senegal flag',
    region: 'Senegal',
  },
  {
    id: '03',
    category: 'Culture',
    title: 'The Decentralized Workforce',
    desc: 'Building high-performance remote cultures across multiple timezones and jurisdictions.',
    total: '05',
    image: teamImage,
    imageAlt: 'Teamwork and collaboration in a modern workplace',
    flag: guineeFlag,
    flagAlt: 'Guinea flag',
    region: 'Guinea',
  },
  {
    id: '04',
    category: 'Tech',
    title: 'Green Infrastructure Solutions',
    desc: 'Implementing sustainable server architecture in developing tech ecosystems.',
    total: '05',
    image: careersImage,
    imageAlt: 'Modern professional in a technology-focused environment',
    flag: congoFlag,
    flagAlt: 'Congo flag',
    region: 'Congo',
  },
  {
    id: '05',
    category: 'Insights',
    title: 'Visual Trust & Modern Design',
    desc: 'How aesthetics and micro-interactions influence high-stakes financial user behavior.',
    total: '05',
    image: aboutImage,
    imageAlt: 'Presentation and strategy session in a branded environment',
    flag: mauritaniaFlag,
    flagAlt: 'Mauritania flag',
    region: 'Mauritania',
  }
];

export const HorizontalScroll: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const pin = gsap.fromTo(
        sectionRef.current,
        { translateX: 0 },
        {
          translateX: "-90vw",
          ease: "none",
          duration: 4,
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "3200 top",
            scrub: 0.1,
            pin: true,
            invalidateOnRefresh: true,
          },
        }
      );

      return () => {
        pin.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section className="hscroll">
      <div ref={triggerRef}>
        <div className="hscroll__header">
          <div className="hscroll__header-inner">
            <div className="hscroll__title-wrap">
              <h2 className="hscroll__title">Top <br /><span className="hscroll__title-accent">articles</span></h2>
            </div>
            <div className="hscroll__subtitle">
              <p className="hscroll__subtitle-text">
                Thought leadership at the <br /> intersection of design and data.
              </p>
            </div>
          </div>
        </div>

        <div ref={sectionRef} className="hscroll__track">
          {ARTICLES.map((article) => (
            <div 
              key={article.id} 
              className="hscroll__card"
            >
              <div className="hscroll__card-media">
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  className="hscroll__card-image"
                  loading="lazy"
                />
                <div className="hscroll__card-overlay"></div>
                <div className="hscroll__card-topline">
                  <span className="hscroll__category">
                    {article.category}
                  </span>
                  <span className="hscroll__flag-badge hscroll__flag-badge--media">
                    <img src={article.flag} alt={article.flagAlt} className="hscroll__flag" loading="lazy" />
                  </span>
                </div>
              </div>

              <div className="hscroll__card-body">
                <h3 className="hscroll__card-title">
                  {article.title}
                </h3>
                <p className="hscroll__card-desc">
                  {article.desc}
                </p>
              </div>
              <div className="hscroll__card-footer">
                <a href="#" className="hscroll__card-link">
                  Read Story <ArrowRight size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
