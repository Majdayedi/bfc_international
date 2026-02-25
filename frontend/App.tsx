
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Philosophy } from './components/Philosophy';
import { HorizontalScroll } from './components/HorizontalScroll';
import { ShowMoreArticles } from './components/ShowMoreArticles';
import { Stats } from './components/Stats';
import { Expertise } from './components/Expertise';
import { Footer } from './components/Footer';
import { Menu } from './components/Menu';
import { ArticlesPage } from './components/ArticlesPage';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { ContactPage } from './components/ContactPage';
import { AboutUsPage } from './components/AboutUsPage.tsx';
import { OurProjectsPage } from './components/OurProjectsPage.tsx';
import { HistoryPage } from './components/HistoryPage.tsx';
import './App.css';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let timeoutId: number | undefined;

    if (location.hash) {
      timeoutId = window.setTimeout(() => {
        const target = document.getElementById(location.hash.replace('#', ''));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    } else if (location.pathname === '/') {
      timeoutId = window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 120);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [location]);

  const toggleMenu = (show: boolean) => {
    console.log('toggleMenu called with:', show);
    setIsMenuOpen(show);
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <div className={`app ${isMenuOpen ? 'menu-open' : ''}`}>
      <Navbar onOpenMenu={() => toggleMenu(true)} />
      
      <Routes>
        <Route
          path="/"
          element={
            <>
              <main>
                <Hero />
                <Marquee />
                <Philosophy />
                <HorizontalScroll />
                <ShowMoreArticles />
                <Stats />
                <Expertise />
              </main>
              <Footer />
            </>
          }
        />
        <Route path="/who-we-are/our-articles" element={<ArticlesPage />} />
        <Route path="/articles/ai-fintech" element={<ArticleDetailPage />} />
        <Route
          path="/who-we-are/about-us"
          element={
            <>
              <AboutUsPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/who-we-are/our-projects"
          element={
            <>
              <OurProjectsPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/who-we-are/history"
          element={
            <>
              <HistoryPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <ContactPage />
              <Footer />
            </>
          }
        />
      </Routes>
      
      <Menu isOpen={isMenuOpen} onClose={() => toggleMenu(false)} />
    </div>
  );
};

export default App;