
import React, { useState, useLayoutEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Philosophy } from './components/Philosophy';
import { HorizontalScroll } from './components/HorizontalScroll';
import { ShowMoreArticles } from './components/ShowMoreArticles';
import { Stats } from './components/Stats';
import { Certifications } from './components/Certifications';
import { Expertise } from './components/Expertise';
import { Footer } from './components/Footer';
import { Menu } from './components/Menu';
import { ErrorBoundary } from './components/ErrorBoundary';
import { FloatingContactIcon } from './components/FloatingContactIcon';
import './App.css';

const ArticlesPage = lazy(() => import('./pages/ArticlesPage').then((m) => ({ default: m.ArticlesPage })));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage').then((m) => ({ default: m.ArticleDetailPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage').then((m) => ({ default: m.AboutUsPage })));
const OurProjectsPage = lazy(() => import('./pages/OurProjectsPage').then((m) => ({ default: m.OurProjectsPage })));
const ProjectArticlePage = lazy(() => import('./pages/ProjectArticlePage').then((m) => ({ default: m.ProjectArticlePage })));
const HistoryPage = lazy(() => import('./pages/HistoryPage').then((m) => ({ default: m.HistoryPage })));
const BfcAcademy = lazy(() => import('./pages/BfcAcademy').then((m) => ({ default: m.BfcAcademy })));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail').then((m) => ({ default: m.ServiceDetail })));
const RepresentativeDetail = lazy(() => import('./pages/RepresentativeDetail').then((m) => ({ default: m.RepresentativeDetail })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const EnrollmentForm = lazy(() => import('./pages/EnrollmentForm'));
const ComplianceComposer = lazy(() => import('./pages/ComplianceComposer').then((m) => ({ default: m.ComplianceComposer })));
const ArticleBuilder = lazy(() => import('./pages/ArticleBuilder').then((m) => ({ default: m.ArticleBuilder })));
const ProjectBuilder = lazy(() => import('./pages/ProjectBuilder').then((m) => ({ default: m.ProjectBuilder })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.default })));

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

    // Bypass CSS scroll-behavior: smooth so the reset is always instant
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.search, location.hash]);

  useLayoutEffect(() => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
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
      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/compliance-composer') && !location.pathname.startsWith('/article-builder') && !location.pathname.startsWith('/project-builder') && (
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
                <Certifications />
                <Expertise />
              </main>
              <Footer />
            </>
          }
        />
        <Route path="/who-we-are/our-articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticleDetailPage />} />
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
        <Route path="/enroll" element={<ErrorBoundary><EnrollmentForm /></ErrorBoundary>} />
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
        <Route path="/login" element={<ErrorBoundary><LoginPage /></ErrorBoundary>} />
        <Route path="/admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
        <Route path="/compliance-composer" element={<ErrorBoundary><ComplianceComposer /></ErrorBoundary>} />
        <Route path="/article-builder" element={<ErrorBoundary><ArticleBuilder /></ErrorBoundary>} />
        <Route path="/project-builder" element={<ErrorBoundary><ProjectBuilder /></ErrorBoundary>} />
      </Routes>
      </Suspense>

      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/compliance-composer') && !location.pathname.startsWith('/article-builder') && !location.pathname.startsWith('/project-builder') && (
        <Menu isOpen={isMenuOpen} onClose={() => toggleMenu(false)} />
      )}

      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/compliance-composer') && !location.pathname.startsWith('/article-builder') && !location.pathname.startsWith('/project-builder') && <FloatingContactIcon />}
    </div>
  );
};

export default App;
