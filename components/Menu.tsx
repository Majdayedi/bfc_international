
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import bfcLogo from '../src/assets/bfc.png';
import './Menu.css';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SubPage {
  label: string;
  href: string;
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
      { label: 'History', href: '#history' },
      { label: 'Our Projects', href: '#our-projects' },
    ],
  },
  {
    label: 'Our Representatives',
    href: '#our-representatives',
    subPages: [
      { label: 'BFC Congo', href: '#bfc-congo' },
      { label: 'BFC Senegal', href: '#bfc-senegal' },
      { label: 'BFC Tunisia', href: '#bfc-tunisia' },
      { label: 'BFC Guinea', href: '#bfc-guinea' },
      { label: 'BFC Mauritania', href: '#bfc-mauritania' },
    ],
  },
  {
    label: 'Our Services',
    href: '#services',
    subPages: [
      { label: 'Tax and Legal', href: '#tax-legal' },
      { label: 'Consulting', href: '#consulting' },
      { label: 'Accounting Expertise', href: '#accounting-expertise' },
      { label: 'Audit', href: '#audit' },
      { label: 'Outsourcing', href: '#outsourcing' },
    ],
  },
  {
    label: 'BFC Academy',
    href: '#bfc-academy',
    subPages: [
      { label: 'International Certifications', href: '#international-certifications' },
      { label: 'Standard Training', href: '#standard-training' },
    ],
  },
  {
    label: 'Contact',
    href: '#contact',
    subPages: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Join Us', href: '/contact#join-us' },
    ],
  },
];

export const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setExpandedIndex(null);
      setHoveredIndex(null);
    }
  }, [isOpen]);

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
                  const subItemClassName = `menu__subitem ${
                    expandedIndex !== null ? 'menu__subitem--open' : 'menu__subitem--closed'
                  }`;

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

                  if (subPage.href.startsWith('/')) {
                    return (
                      <Link
                        key={subPage.label}
                        to={subPage.href}
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
