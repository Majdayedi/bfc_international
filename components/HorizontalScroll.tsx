import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HorizontalScroll.css';
import { API_URL } from '../utils/constants';

gsap.registerPlugin(ScrollTrigger);

export const HorizontalScroll: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/articles/top`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((a: any) => {
          let flag = null;
          
          const slugFlags: Record<string, { alt: string; src: string }> = {
            'digitalization-strategy': { alt: 'tunisia', src: 'https://flagcdn.com/w80/tn.png' },
            'sme-formalization': { alt: 'senegal', src: 'https://flagcdn.com/w80/sn.png' },
            'pki-timing-matters': { alt: 'guinee', src: 'https://flagcdn.com/w80/gn.png' },
            'pki-strategic-backbone': { alt: 'mauritania', src: 'https://flagcdn.com/cg.svg' }
          };
          flag = slugFlags[a.slug] || null;

          return {
            id: String(a.id),
            category: a.category || 'Uncategorized',
            title: a.title,
            slug: a.slug,
            image: a.heroImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800',
            description: a.summary || a.subtitle || '',
            flag: flag ? flag.src : ''
          };
        });
        setArticles(mapped);
      })
      .catch(console.error);
  }, []);

  useLayoutEffect(() => {
    if (articles.length < 2) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 769px)", () => {
      const track = sectionRef.current;
      const section = triggerRef.current;
      if (!track || !section) return;

      // Measured on demand instead of once, so a resize (or any layout change
      // in the blocks above) keeps the travel distance and the scroll distance
      // in sync.
      const getDistance = () =>
        Math.max(track.scrollWidth - window.innerWidth + 100, 0); // +100 for some right padding

      if (getDistance() <= 0) return; // Do not pin if there is no horizontal overflow

      const pin = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => "+=" + getDistance(), // Scrolling distance exactly matches horizontal distance to avoid void
          scrub: 0.1,
          pin: true,
          // Engage the pin a frame early so it cannot "kick" when it starts.
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ScrollTrigger measures the section's position on Scroll only once. The
      // page keeps reflowing after that though: the Google Fonts swap in
      // (index.html uses display=swap) which changes the height of every block
      // above this one, and this section doesn't even mount until the articles
      // fetch resolves. A start offset that is stale by even a few pixels makes
      // the pin engage at the wrong scroll position, so the section snaps
      // upward the first time it is reached. Re-measure whenever the document
      // actually changes height.
      let frame = 0;
      let disposed = false;
      let lastHeight = document.body.offsetHeight;

      const refresh = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          if (disposed) return;
          ScrollTrigger.refresh();
          lastHeight = document.body.offsetHeight;
        });
      };

      const observer = new ResizeObserver(() => {
        // Ignore the height change caused by this pin's own spacer, otherwise
        // the observer and refresh() would keep re-triggering each other.
        if (document.body.offsetHeight === lastHeight) return;
        refresh();
      });
      observer.observe(document.body);
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh, { once: true });

      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("load", refresh);
        pin.kill();
      };
    });
    return () => mm.revert();
  }, [articles]);

  if (articles.length < 2) return null;

  return (
    <section className="hscroll" ref={triggerRef}>
      <div className="hscroll__header">
        <div className="hscroll__header-inner">
          <h2 className="hscroll__title">Top <span className="hscroll__title-accent">Articles</span></h2>
        </div>
      </div>

      <div ref={sectionRef} className="hscroll__track">
        {articles.map((article) => (
          <div key={article.id} className="hscroll__card">
            <div className="hscroll__card-media">
              <img src={article.image} alt={article.title} className="hscroll__card-image" />
              <div className="hscroll__card-topline">
                <span className="hscroll__category">{article.category}</span>
                {article.flag && <img src={article.flag} className="hscroll__flag" alt="flag" style={{width: '44px'}} />}
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