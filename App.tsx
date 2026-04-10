
import React, { useState, useLayoutEffect, Suspense, lazy } from 'react';
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
import { ErrorBoundary } from './components/ErrorBoundary';
import { FloatingContactIcon } from './components/FloatingContactIcon';
import './App.css';

const ArticlesPage = lazy(() => import('./components/ArticlesPage').then((m) => ({ default: m.ArticlesPage })));
const ArticleDetailPage = lazy(() => import('./components/ArticleDetailPage').then((m) => ({ default: m.ArticleDetailPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then((m) => ({ default: m.ContactPage })));
const AboutUsPage = lazy(() => import('./components/AboutUsPage').then((m) => ({ default: m.AboutUsPage })));
const OurProjectsPage = lazy(() => import('./components/OurProjectsPage').then((m) => ({ default: m.OurProjectsPage })));
const ProjectArticlePage = lazy(() => import('./components/ProjectArticlePage').then((m) => ({ default: m.ProjectArticlePage })));
const HistoryPage = lazy(() => import('./components/HistoryPage').then((m) => ({ default: m.HistoryPage })));
const BfcAcademy = lazy(() => import('./components/BfcAcademy').then((m) => ({ default: m.BfcAcademy })));
const CourseDetail = lazy(() => import('./components/CourseDetail'));
const ServiceDetail = lazy(() => import('./components/ServiceDetail').then((m) => ({ default: m.ServiceDetail })));
const RepresentativeDetail = lazy(() => import('./components/RepresentativeDetail').then((m) => ({ default: m.RepresentativeDetail })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.replace('#', ''));
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

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

      <Suspense fallback={null}>
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
      </Suspense>

      {!location.pathname.startsWith('/admin') && (
        <Menu isOpen={isMenuOpen} onClose={() => toggleMenu(false)} />
      )}

      {!location.pathname.startsWith('/admin') && <FloatingContactIcon />}
    </div>
  );
};

export default App;