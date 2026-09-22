
import React, { useState, useEffect, useTransition } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import bfcLogo from '../src/assets/bfc.png';
import ici from '../src/assets/certif/ici.png';
import irm from '../src/assets/certif/IRM.png';
import { API_URL } from '../utils/constants';
import './Menu.css';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubPage {
  label: string;
  href: string;
  subPages?: SubPage[];
  course?: any;
}

interface MenuItem {
  label: string;
  href?: string;
  subPages?: SubPage[];
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    label: 'Who We Are',
    href: '#who-we-are',
    subPages: [
      { label: 'About Us', href: '/who-we-are/about-us' },
      { label: 'History', href: '/who-we-are/history' },
      { label: 'Our References', href: '/who-we-are/our-projects' },
      { label: 'Our Articles', href: '/who-we-are/our-articles' }
    ],
  },
  {
    label: 'Our Representatives',
    href: '#our-representatives',
    subPages: [], // will be fetched dynamically
  },
  {
    label: 'Our Services',
    href: '#services',
    subPages: [
      { label: 'Consulting', href: '/services/consulting' },
      { label: 'Tax and Legal', href: '/services/tax-legal' },
      { label: 'Accounting Expertise', href: '/services/accounting-expertise' },
      { label: 'Audit', href: '/services/audit' },
      { label: 'Outsourcing', href: '/services/outsourcing' },
    ],
  },
  {
    label: 'BFC Academy',
    href: '/standard-training',
    subPages: [
      {
        label: 'International Academy',
        href: '/standard-training',
        subPages: [
          {
            label: 'IRM - Fundamentals of Risk Management',
            href: '/course/Fundamentals%20of%20Risk%20Management%20(FoRM)',
            course: {
              id: 1,
              title: 'Fundamentals of Risk Management (FoRM)',
              institution: 'Institute of Risk Management (IRM) - London',
              country: 'International',
              year: '2026',
              category: 'International Courses',
              topics: 'Risk concepts, assessment and treatment, risk appetite, risk transfer, business continuity, monitoring and review, risk policy.',
              logo: irm,
              isAccredited: true,
              programs: '3 Days + Final Examination',
              accreditation: 'IRM Official Certificate Program',
              intake: '2026',
              description: 'Official certification training from the Institute of Risk Management of London focused on practical ERM implementation and business-aligned risk decision making.',
              certificationDescription: 'Participants: Risk Managers, Internal Controllers, Internal Auditors, Administrators, Executives, Senior Managers, Department Heads. Certificate delivered by IRM upon passing final exam.',
              brochureUrl: '/pdfs/irm-form.pdf',
              intro: `Official FoRM certification by IRM London. The IRM is the world's leading organization in risk management. It helps build excellence in risk management to enhance how organizations operate. The IRM provides globally recognized qualifications and training, publishes research and informed leadership, and sets professional standards that define the knowledge, skills, and behaviors today's risk professionals need to meet the demands of an increasingly complex and challenging business environment. This course builds a practical enterprise risk management mindset and equips participants to deploy risk frameworks that are aligned with business strategy and governance expectations.`,
              participants: 'Risk Managers, Internal Controllers, Internal Auditors, Administrators, Executives, Senior Managers, Department Heads.',
              duration: '3 days + final exam',
              location: 'International sessions',
              language: 'English',
              learnPoints: [
                'Understand risk and risk management fundamentals in organizational contexts.',
                'Implement risk assessment, risk treatment, and risk register practices.',
                'Define risk appetite, tolerance, and risk transfer mechanisms.',
                'Embed risk culture, policy, monitoring, and review cycles.',
                'Prepare for IRM final certification assessment.'
              ],
              journeySteps: [
                { title: 'Journey 01 - Build Foundations', detail: 'Clarify risk principles, why risk management matters, and core ERM disciplines.' },
                { title: 'Journey 02 - Analyze and Prioritize Risks', detail: 'Apply assessment tools, risk profiling, consequence and probability matrices.' },
                { title: 'Journey 03 - Treat and Embed', detail: 'Design treatments, define appetite and tolerance, and integrate risk culture.' },
                { title: 'Journey 04 - Validate and Certify', detail: 'Consolidate knowledge and complete final FoRM exam preparation.' }
              ]
            }
          },
          {
            label: 'ICI - Certified Internal Control Specialist (CICS)',
            href: '/course/Certified%20Internal%20Control%20Specialist%20(CICS)',
            course: {
              id: 2,
              title: 'Certified Internal Control Specialist (CICS)',
              institution: 'Internal Control Institute (ICI) - USA',
              country: 'International',
              year: '2026',
              category: 'International Courses',
              topics: 'Control environment, COSO components, risk evaluation, governance practices, reporting, internal control implementation and project steering.',
              logo: ici,
              isAccredited: true,
              programs: '5 Days + Final Examination',
              accreditation: 'ICI Official Certification',
              intake: '2026',
              description: 'Official international certifying program from ICI to design, implement, assess, and manage internal control systems with governance alignment.',
              certificationDescription: `Includes exam voucher, pre-assessment test, module tests, and training materials. The program is aimed at executives, directors, administrators, internal controllers, auditors, inspectors, GRC professionals, and risk managers.`,
              brochureUrl: '/pdfs/cics.pdf',
              intro: `Official CICS program from the Internal Control Institute (ICI). The course focuses on control architecture, governance effectiveness, application of the COSO framework, and operational internal control implementation.    The Internal Control Institute™ (ICI)—the only global organization dedicated exclusively to internal control and corporate governance—offers an official international certification program for designing, implementing, assessing, and managing internal control systems aligned with governance, providing specialized methodologies, guidelines, and comprehensive controls for organizations.`,
              participants: 'Executives, Directors, Administrators, Internal Controllers, Internal Auditors, Inspectors, GRC professionals, Risk Managers.',
              duration: '5 days + final exam',
              location: 'International cohorts',
              language: 'English',
              learnPoints: [
                'Design and structure enterprise internal control systems.',
                'Develop control environment and control ownership across teams.',
                'Evaluate control effectiveness and risk exposure using COSO components.',
                'Implement reporting, communication, and governance review practices.',
                'Lead internal control projects and change management programs.'
              ],
              journeySteps: [
                { title: 'Journey 01 - Control Fundamentals', detail: 'Set the internal control baseline and map current control maturity.' },
                { title: 'Journey 02 - Risk-Control Alignment', detail: 'Connect risks to controls through COSO-based structuring.' },
                { title: 'Journey 03 - Governance and Reporting', detail: 'Strengthen communication flows and governance oversight.' },
                { title: 'Journey 04 - Certification Completion', detail: 'Finalize assessment readiness and pass ICI certification exam.' }
              ]
            }
          }
        ]
      },
      { label: 'All Trainings', href: '/standard-training' },
    ],
  },
  {
    label: 'Contact US',
    href: '/contact',
   
  },
];

export const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const fetchMenuReps = async () => {
      try {
        const res = await fetch(`${API_URL}/api/representatives`);
        if (res.ok) {
          const reps = await res.json();
          const dynamicSubPages = reps.map((rep: any) => ({
            label: rep.title,
            href: `/representatives/${rep.slug}`,
          }));
          setMenuItems(prev => prev.map(item => 
            item.label === 'Our Representatives' 
              ? { ...item, subPages: dynamicSubPages.length > 0 ? dynamicSubPages : [] }
              : item
          ));
        }
      } catch (err) {
        console.error('Failed to fetch representatives for menu:', err);
      }
    };

    const fetchMenuServices = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        if (res.ok) {
          const services = await res.json();
          services.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
          const dynamicSubPages = services.map((service: any) => ({
            label: service.title,
            href: `/services/${service.slug}`,
          }));
          setMenuItems(prev => prev.map(item => 
            item.label === 'Our Services' 
              ? { ...item, subPages: dynamicSubPages.length > 0 ? dynamicSubPages : [] }
              : item
          ));
        }
      } catch (err) {
        console.error('Failed to fetch services for menu:', err);
      }
    };

    const fetchMenuCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses/show`);
        if (res.ok) {
          const courses = await res.json();
          const intlCourses = courses.filter((c: any) => c.category === 'International Courses');

          const getCourseLabel = (course: any) => {
            const titleLower = course.title.toLowerCase();
            const instLower = course.institution.toLowerCase();
            if (titleLower.includes('risk management') || instLower.includes('irm')) {
              return 'IRM - Fundamentals of Risk Management';
            }
            if (titleLower.includes('internal control') || instLower.includes('ici')) {
              return 'ICI - Certified Internal Control Specialist (CICS)';
            }
            return course.title;
          };

          const intlSubPages = intlCourses.map((c: any) => ({
            label: getCourseLabel(c),
            href: `/course/${encodeURIComponent(c.title)}`,
            course: c
          }));

          const academySubPages = [];
          if (intlSubPages.length > 0) {
            academySubPages.push({
              label: 'International Academy',
              href: '/standard-training',
              subPages: intlSubPages
            });
          }
          academySubPages.push({ label: 'All Trainings', href: '/standard-training' });

          setMenuItems(prev => prev.map(item => 
            item.label === 'BFC Academy' 
              ? { ...item, subPages: academySubPages }
              : item
          ));
        }
      } catch (err) {
        console.error('Failed to fetch courses for menu:', err);
      }
    };

    fetchMenuReps();
    fetchMenuServices();
    fetchMenuCourses();
  }, []);

  // Preload all lazy route components as soon as the menu opens so they are
  // ready by the time the user clicks — eliminates the lazy-load delay.
  useEffect(() => {
    if (isOpen) {
      import('../pages/AboutUsPage');
      import('../pages/ArticlesPage');
      import('../pages/ArticleDetailPage');
      import('../pages/ContactPage');
      import('../pages/OurProjectsPage');
      import('../pages/ProjectArticlePage');
      import('../pages/HistoryPage');
      import('../pages/BfcAcademy');
      import('../pages/CourseDetail');
      import('../pages/ServiceDetail');
      import('../pages/RepresentativeDetail');
      import('../pages/EnrollmentForm');
    }
  }, [isOpen]);

  // Navigate inside a React transition: React 19 keeps the current page frozen
  // (no Suspense fallback flash) until the new component is ready. The location
  // change only commits after the new page renders, so App.tsx's useLayoutEffect
  // closes the menu exactly when the new page is already visible behind it.
  const handleLinkClick = (
    e: React.MouseEvent,
    to: string | { pathname: string; hash: string },
    state?: unknown,
  ) => {
    e.preventDefault();
    const targetPath = typeof to === 'string' ? to : to.pathname;
    if (targetPath === location.pathname) {
      // Same page: just close the menu
      onClose();
      return;
    }
    startTransition(() => {
      navigate(to as string, state ? { state } : undefined);
    });
  };

  const isItemActive = (item: MenuItem) => {
    if (item.href === location.pathname || item.href === location.pathname + location.hash) return true;
    if (item.subPages) {
      return item.subPages.some(isSubPageActive);
    }
    return false;
  };

  const isSubPageActive = (subPage: SubPage) => {
    if (subPage.href === location.pathname || subPage.href === location.pathname + location.hash) {
      return true;
    }

    if (subPage.subPages) {
      return subPage.subPages.some(isSubPageActive);
    }

    return false;
  };

  useEffect(() => {
    if (!isOpen) {
      setExpandedIndex(null);
      setHoveredIndex(null);
    } else {
      // Auto-expand the menu item that matches the current page
      const currentIndex = menuItems.findIndex(item => isItemActive(item));
      if (currentIndex !== -1 && menuItems[currentIndex].subPages) {
        setExpandedIndex(currentIndex);
      }
    }
  }, [isOpen, menuItems]);

  return (
    <div className={`menu ${isOpen ? 'menu--open' : 'menu--closed'}`}>
      {/* Header */}
      <div className="menu__header">
        <div className={`menu__logo ${isOpen ? 'menu__logo--open' : 'menu__logo--closed'}`}>
          <Link to="/" className="menu__logo-link" onClick={(e) => handleLinkClick(e, '/')}>
            <span className="menu__logo-box">
              <img src={bfcLogo} alt="BFC" className="menu__logo-img" />
            </span>
          </Link>
        </div>
        <button
          onClick={onClose}
          className={`menu__close ${isOpen ? 'menu__close--open' : 'menu__close--closed'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <span className="menu__close-text">Close</span>
          <X size={24} className="menu__close-icon" />
        </button>
      </div>

      {/* Main Content */}
      <div className="menu__content">
        {/* Left Panel - Main Menu */}
        <div className={`menu__left ${expandedIndex !== null ? 'menu__left--expanded' : ''}`}>
          <div className={`menu__list ${expandedIndex === null ? 'menu__list--center' : 'menu__list--start'}`}>
            {menuItems.map((item, i) => {
              const itemClassName = `menu__item ${
                expandedIndex !== null ? 'menu__item--expanded' : 'menu__item--large'
              } ${
                expandedIndex === i ? 'menu__item--active' : ''
              } ${
                expandedIndex === null && hoveredIndex === i ? 'menu__item--hovered' : ''
              } ${
                isOpen ? 'menu__item--open' : 'menu__item--closed'
              } ${
                isItemActive(item) ? 'menu__item--current' : ''
              }`;

              if (item.subPages) {
                return (
                  <button
                    key={item.label}
                    onClick={(e) => {
                      e.preventDefault();
                      setExpandedIndex(expandedIndex === i ? null : i);
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={itemClassName}
                    style={{
                      transitionDelay: `${100 + i * 60}ms`,
                    }}
                  >
                    <span className="menu__item-row">
                      {item.label}
                      <ChevronRight
                        className={`menu__chevron ${
                          expandedIndex === i ? 'menu__chevron--rotated' : ''
                        } ${
                          expandedIndex === null && hoveredIndex === i ? 'menu__chevron--shift' : ''
                        }`}
                        size={expandedIndex !== null ? 24 : (window.innerWidth >= 768 ? 40 : 24)}
                      />
                    </span>
                  </button>
                );
              }

              if (item.href?.startsWith('/')) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={(e) => handleLinkClick(e, item.href!)}
                    onMouseEnter={() => expandedIndex === null && setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={itemClassName}
                    style={{
                      transitionDelay: `${100 + i * 60}ms`,
                    }}
                  >
                    <span className="menu__item-row">{item.label}</span>
                  </Link>
                );
              }

              if (item.href?.startsWith('#')) {
                return (
                  <Link
                    key={item.label}
                    to={{ pathname: '/', hash: item.href }}
                    onClick={(e) => handleLinkClick(e, { pathname: '/', hash: item.href! })}
                    onMouseEnter={() => expandedIndex === null && setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={itemClassName}
                    style={{
                      transitionDelay: `${100 + i * 60}ms`,
                    }}
                  >
                    <span className="menu__item-row">{item.label}</span>
                  </Link>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  onMouseEnter={() => expandedIndex === null && setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={itemClassName}
                  style={{
                    transitionDelay: `${100 + i * 60}ms`,
                  }}
                >
                  <span className="menu__item-row">{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Sub-Pages */}
        <div className={`menu__right ${expandedIndex !== null ? 'menu__right--open' : 'menu__right--closed'}`}>
          {expandedIndex !== null && menuItems[expandedIndex].subPages && (
            <div className="menu__right-inner">
              {/* Added mobile back button */}
              <button 
                className="menu__mobile-back" 
                onClick={() => setExpandedIndex(null)}
                aria-label="Back to main menu"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="menu__right-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <div 
                  className={`menu__right-title ${
                    expandedIndex !== null ? 'menu__right-title--open' : 'menu__right-title--closed'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  {menuItems[expandedIndex].label}
                </div>
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                  {menuItems[expandedIndex].subPages?.filter(sp => sp.label !== 'All Trainings').map((subPage, j) => {
                    const isActive = isSubPageActive(subPage);
                    const subItemClassName = `menu__subitem ${
                      expandedIndex !== null ? 'menu__subitem--open' : 'menu__subitem--closed'
                    } ${isActive ? 'menu__subitem--current' : ''}`;

                    const subItemStyle = {
                      transitionDelay: `${300 + j * 80}ms`,
                    };

                    const subItemContent = (
                      <span className="menu__subitem-row">
                        <ChevronRight
                          className="menu__subitem-icon"
                          size={window.innerWidth >= 768 ? 40 : 24}
                        />
                        {subPage.label}
                      </span>
                    );

                    if (subPage.subPages?.length) {
                      return (
                        <div key={subPage.label} className="menu__subgroup" style={subItemStyle}>
                          <div className="menu__subgroup-title">{subPage.label}</div>
                          {subPage.subPages.map((nestedPage, k) => {
                            const isNestedActive = isSubPageActive(nestedPage);
                            const nestedClassName = `menu__subitem menu__subitem--nested ${
                              expandedIndex !== null ? 'menu__subitem--open' : 'menu__subitem--closed'
                            } ${isNestedActive ? 'menu__subitem--current' : ''}`;

                            const nestedStyle = {
                              transitionDelay: `${340 + j * 80 + k * 60}ms`,
                            };

                            const nestedContent = (
                              <span className="menu__subitem-row">
                                <ChevronRight
                                  className="menu__subitem-icon"
                                  size={window.innerWidth >= 768 ? 24 : 18}
                                />
                                {nestedPage.label}
                              </span>
                            );

                            if (nestedPage.href.startsWith('/')) {
                              return (
                                <Link
                                  key={nestedPage.label}
                                  to={nestedPage.href}
                                  state={nestedPage.course ? { course: nestedPage.course } : undefined}
                                  onClick={(e) => handleLinkClick(e, nestedPage.href, nestedPage.course ? { course: nestedPage.course } : undefined)}
                                  className={nestedClassName}
                                  style={nestedStyle}
                                >
                                  {nestedContent}
                                </Link>
                              );
                            }

                            if (nestedPage.href.startsWith('#')) {
                              return (
                                <Link
                                  key={nestedPage.label}
                                  to={{ pathname: '/', hash: nestedPage.href }}
                                  onClick={(e) => handleLinkClick(e, { pathname: '/', hash: nestedPage.href })}
                                  className={nestedClassName}
                                  style={nestedStyle}
                                >
                                  {nestedContent}
                                </Link>
                              );
                            }

                            return (
                              <a
                                key={nestedPage.label}
                                href={nestedPage.href}
                                onClick={onClose}
                                className={nestedClassName}
                                style={nestedStyle}
                              >
                                {nestedContent}
                              </a>
                            );
                          })}
                        </div>
                      );
                    }

                    if (subPage.href.startsWith('/')) {
                      return (
                        <Link
                          key={subPage.label}
                          to={subPage.href}
                          state={subPage.course ? { course: subPage.course } : undefined}
                          onClick={(e) => handleLinkClick(e, subPage.href, subPage.course ? { course: subPage.course } : undefined)}
                          className={subItemClassName}
                          style={subItemStyle}
                        >
                          {subItemContent}
                        </Link>
                      );
                    }

                    if (subPage.href.startsWith('#')) {
                      return (
                        <Link
                          key={subPage.label}
                          to={{ pathname: '/', hash: subPage.href }}
                          onClick={(e) => handleLinkClick(e, { pathname: '/', hash: subPage.href })}
                          className={subItemClassName}
                          style={subItemStyle}
                        >
                          {subItemContent}
                        </Link>
                      );
                    }

                    return (
                      <a
                        key={subPage.label}
                        href={subPage.href}
                        onClick={onClose}
                        className={subItemClassName}
                        style={subItemStyle}
                      >
                        {subItemContent}
                      </a>
                    );
                  })}
                </div>
                {/* Fixed All Trainings at bottom */}
                {menuItems[expandedIndex].subPages?.filter(sp => sp.label === 'All Trainings').map((subPage, j) => {
                  const isActive = isSubPageActive(subPage);
                  const subItemClassName = `menu__subitem ${
                    expandedIndex !== null ? 'menu__subitem--open' : 'menu__subitem--closed'
                  } ${isActive ? 'menu__subitem--current' : ''}`;

                  const subItemContent = (
                    <span className="menu__subitem-row">
                      <ChevronRight
                        className="menu__subitem-icon"
                        size={window.innerWidth >= 768 ? 40 : 24}
                      />
                      {subPage.label}
                    </span>
                  );

                  if (subPage.href.startsWith('/')) {
                    return (
                      <Link
                        key={subPage.label}
                        to={subPage.href}
                        onClick={(e) => handleLinkClick(e, subPage.href)}
                        className={subItemClassName}
                        style={{ flexShrink: 0, transitionDelay: `${300 + (menuItems[expandedIndex].subPages!.length - 1) * 80}ms` }}
                      >
                        {subItemContent}
                      </Link>
                    );
                  }

                  return (
                    <a
                      key={subPage.label}
                      href={subPage.href}
                      onClick={onClose}
                      className={subItemClassName}
                      style={{ flexShrink: 0 }}
                    >
                      {subItemContent}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div 
        className={`menu__footer ${isOpen ? 'menu__footer--open' : 'menu__footer--closed'}`}
        style={{ transitionDelay: '500ms' }}
      >
        <div className="menu__footer-inner">
          <p>© 2026 BFC Consulting & Innovation</p>
          <div className="menu__footer-links">
            <a href="https://tn.linkedin.com/company/bfc-international-academy" className="menu__footer-link">LinkedIn</a>
            <a href="https://www.youtube.com/@BFCGROUPOFFICIAL" className="menu__footer-link">YouTube</a>
          </div>
        </div>
      </div>
    </div>
  );
};
