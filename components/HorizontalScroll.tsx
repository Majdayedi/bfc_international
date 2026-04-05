
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import './HorizontalScroll.css';

gsap.registerPlugin(ScrollTrigger);

const ARTICLES = [
  {
    id: '01',
    category: 'Strategy',
    title: 'The Future of AI in African Fintech',
    desc: 'Exploring how large language models are reshaping the landscape of emerging market banking.',
    total: '05'
  },
  {
    id: '02',
    category: 'Innovation',
    title: 'Scaling Digital Public Goods',
    desc: 'How decentralized identities can transform government transparency and service delivery.',
    total: '05'
  },
  {
    id: '03',
    category: 'Culture',
    title: 'The Decentralized Workforce',
    desc: 'Building high-performance remote cultures across multiple timezones and jurisdictions.',
    total: '05'
  },
  {
    id: '04',
    category: 'Tech',
    title: 'Green Infrastructure Solutions',
    desc: 'Implementing sustainable server architecture in developing tech ecosystems.',
    total: '05'
  },
  {
    id: '05',
    category: 'Insights',
    title: 'Visual Trust & Modern Design',
    desc: 'How aesthetics and micro-interactions influence high-stakes financial user behavior.',
    total: '05'
  }
];

export const HorizontalScroll: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
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
              <div>
                <span className="hscroll__category">
                  {article.category}
                </span>
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
                <span className="hscroll__card-count">{article.id} / {article.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
