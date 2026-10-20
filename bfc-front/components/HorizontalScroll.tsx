import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HorizontalScroll.css';
import { API_URL } from '../utils/constants';
import { useT, useLanguage, localizedField } from '../src/i18n';

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
            category: a.category,
            title: a.title,
            titleFr: a.titleFr,
            titleAr: a.titleAr,
            slug: a.slug,
            image: a.heroImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800',
            // Per-language description variants keep the same source field as
            // the English base (summary preferred over subtitle).
            description: a.summary || a.subtitle || '',
            descriptionFr: (a.summary ? a.summaryFr : a.subtitleFr) || '',
            descriptionAr: (a.summary ? a.summaryAr : a.subtitleAr) || '',
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
          // Was "top 90px" — slightly later so the section sits further into
          // view before the pin engages and horizontal scroll begins.
          start: "top 50px",
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
    <Section articles={articles} sectionRef={sectionRef} triggerRef={triggerRef} />
  );
};

const Section: React.FC<{
  articles: any[];
  sectionRef: React.Ref<HTMLDivElement>;
  triggerRef: React.Ref<HTMLDivElement>;
}> = ({ articles, sectionRef, triggerRef }) => {
  // Static UI copy comes from the locale files; article titles and summaries
  // are database content, so they are localized through their per-language
  // fields (titleFr/titleAr, descriptionFr/descriptionAr).
  const t = useT();
  const { lang } = useLanguage();

  return (
    <section className="hscroll" ref={triggerRef}>
      <div className="hscroll__header">
        <div className="hscroll__header-inner">
          <h2 className="hscroll__title">{t('home.titleLine1')} <span className="hscroll__title-accent">{t('home.titleAccent')}</span></h2>
        </div>
      </div>

      <div ref={sectionRef} className="hscroll__track">
        {articles.map((article) => (
          <div key={article.id} className="hscroll__card">
            <div className="hscroll__card-media">
              <img src={article.image} alt={localizedField(article, 'title', lang)} className="hscroll__card-image" />
              <div className="hscroll__card-topline">
                <span className="hscroll__category">{article.category || t('home.uncategorized')}</span>
                {article.flag && <img src={article.flag} className="hscroll__flag" alt={t('home.flagAlt')} style={{width: '44px'}} />}
              </div>
            </div>
            <div className="hscroll__card-body">
              <h3 className="hscroll__card-title">{localizedField(article, 'title', lang)}</h3>
              <p className="hscroll__card-desc">{localizedField(article, 'description', lang)}</p>
            </div>
            <div className="hscroll__card-footer">
              <Link to={`/articles/${article.slug}`} className="hscroll__card-link">
                {t('home.readStory')} <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};