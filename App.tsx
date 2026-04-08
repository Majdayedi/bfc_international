
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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
import { ProjectArticlePage } from './components/ProjectArticlePage';
import { HistoryPage } from './components/HistoryPage.tsx';
import { BfcAcademy } from './components/BfcAcademy';
import CourseDetail from './components/CourseDetail';
import { ServiceDetail } from './components/ServiceDetail';
import { RepresentativeDetail } from './components/RepresentativeDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingContactIcon } from './components/FloatingContactIcon';
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
     setIsMenuOpen(show);
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <div className={`app ${isMenuOpen ? 'menu-open' : ''}`}>
      {!location.pathname.startsWith('/admin') && (
        <Navbar onOpenMenu={() => toggleMenu(true)} />
      )}

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
          path="/who-we-are/our-projects/:projectId"
          element={
            <>
              <ProjectArticlePage />
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
        <Route path="/bfc-academy" element={<Navigate to="/standard-training" replace />} />
        <Route path="/standard-training" element={<ErrorBoundary><BfcAcademy /></ErrorBoundary>} />
        <Route path="/course/:title" element={<ErrorBoundary><CourseDetail /></ErrorBoundary>} />
        <Route
          path="/services/:serviceId"
          element={
            <>
              <ErrorBoundary><ServiceDetail /></ErrorBoundary>
              <Footer />
            </>
          }
        />
        <Route
          path="/representatives/:id"
          element={
            <>
              <ErrorBoundary><RepresentativeDetail /></ErrorBoundary>
              <Footer />
            </>
          }
        />
        <Route path="/admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
      </Routes>

      {!location.pathname.startsWith('/admin') && (
        <Menu isOpen={isMenuOpen} onClose={() => toggleMenu(false)} />
      )}

      {!location.pathname.startsWith('/admin') && <FloatingContactIcon />}
    </div>
  );
};

export default App;