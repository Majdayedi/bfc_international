
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import bfcLogo from '../src/assets/bfc.png';
import ici from '../src/assets/certif/ici.png';
import irm from '../src/assets/certif/IRM.png';
import GII from '../src/assets/certif/global_innovation_insititute.png';
import './Menu.css';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubPage {
  label: string;
  href: string;
  subPages?: SubPage[];
  course?: {
    title: string;
    institution: string;
    programs: string;
    accreditation: string;
    intake: string;
    language: string;
    imageUrl: string;
    isAccredited: boolean;
    certificationDescription: string;
    description: string;
  };
}

interface MenuItem {
  label: string;
  href?: string;
  subPages?: SubPage[];
}

const MENU_ITEMS: MenuItem[] = [
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
    subPages: [
      { label: 'BFC Congo', href: '/representatives/congo' },
      { label: 'BFC Senegal', href: '/representatives/senegal' },
      { label: 'BFC Tunisia', href: '/representatives/tunisia' },
      { label: 'BFC Guinea', href: '/representatives/guinea' },
      { label: 'BFC Mauritania', href: '/representatives/mauritania' },
    ],
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
            href: '/course/Fundamentals%20of%20Risk%20Management',
            course: {
              title: 'Fundamentals of Risk Management',
              institution: 'Institute of Risk Management London',
              programs: '5+ Tracks',
              accreditation: 'Global',
              intake: 'Sept 2025',
              language: 'English',
              imageUrl: irm,
              isAccredited: true,
              certificationDescription:
                'Professionally aligned risk management pathway covering governance, enterprise risk frameworks, treatment plans, and decision-oriented reporting practices.',
              description:
                'Master the core principles and tools of modern enterprise risk management with an implementation-focused learning track.',
            },
          },
          {
            label: 'ICI - Certified Internal Control Specialist',
            href: '/course/Certified%20Internal%20Control%20Specialist',
            course: {
              title: 'Certified Internal Control Specialist',
              institution: 'Internal Control Institute USA',
              programs: '3+ Tracks',
              accreditation: 'International',
              intake: 'Oct 2025',
              language: 'English',
              imageUrl: ici,
              isAccredited: true,
              certificationDescription:
                'International internal control certification focused on COSO-aligned controls, governance maturity, and operational assurance.',
              description:
                'Build practical internal control capabilities for governance, risk mitigation, and operational performance management.',
            },
          },
          {
            label: 'GII - Certified Innovation Professional',
            href: '/course/Certified%20Innovation%20Professional',
            course: {
              title: 'Certified Innovation Professional',
              institution: 'Global Innovation Institute USA & BFC',
              programs: '8+ Tracks',
              accreditation: 'Industry Standard',
              intake: 'Rolling',
              language: 'English',
              imageUrl: GII,
              isAccredited: true,
              certificationDescription:
                'Innovation-focused certification designed to structure innovation strategy, governance, and measurable transformation outcomes.',
              description:
                'Learn to build innovation systems, prioritize opportunities, and manage execution from concept to measurable business value.',
            },
          },
        ],
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const location = useLocation();

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
      const currentIndex = MENU_ITEMS.findIndex(item => isItemActive(item));
      if (currentIndex !== -1 && MENU_ITEMS[currentIndex].subPages) {
        setExpandedIndex(currentIndex);
      }
    }
  }, [isOpen, location.pathname, location.hash]);

  return (
    <div className={`menu ${isOpen ? 'menu--open' : 'menu--closed'}`}>
      {/* Header */}
      <div className="menu__header">
        <div className={`menu__logo ${isOpen ? 'menu__logo--open' : 'menu__logo--closed'}`}>
          <Link to="/" className="menu__logo-link" onClick={onClose}>
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
            {MENU_ITEMS.map((item, i) => {
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
                    onClick={onClose}
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
                    onClick={onClose}
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
          {expandedIndex !== null && MENU_ITEMS[expandedIndex].subPages && (
            <div className="menu__right-inner">
              <div className="menu__right-content">
                <div 
                  className={`menu__right-title ${
                    expandedIndex !== null ? 'menu__right-title--open' : 'menu__right-title--closed'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                >
                  {MENU_ITEMS[expandedIndex].label}
                </div>
                {MENU_ITEMS[expandedIndex].subPages?.map((subPage, j) => {
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
                                onClick={onClose}
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
                                onClick={onClose}
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
                        onClick={onClose}
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
                        onClick={onClose}
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
            <a href="#" className="menu__footer-link">LinkedIn</a>
            <a href="#" className="menu__footer-link">Twitter</a>
            <a href="#" className="menu__footer-link">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  );
};
