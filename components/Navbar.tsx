
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';
import reandaLogo from '../src/assets/reanda.png';
import bfcLogo from '../src/assets/bfc.png';
import './Navbar.css';

interface NavbarProps {
  onOpenMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMenu }) => {
  return (
    <header className="navbar">
      <div className="navbar__logo">
        <Link to="/" className="navbar__logo-link">
          <span className="navbar__logo-box">
            <span className="navbar__logo-stack" aria-label="BFC and Reanda">
              <img src={reandaLogo} alt="Reanda" className="navbar__logo-img navbar__logo-img--a" />
              <img src={bfcLogo} alt="BFC" className="navbar__logo-img navbar__logo-img--b" />
            </span>
          </span>
        </Link>
        <div className="navbar__logo-menu" role="menu" aria-label="Featured partners">
          <div className="navbar__logo-menu-item" role="menuitem">
            <img src={bfcLogo} alt="BFC Groupe" className="navbar__logo-menu-img" />
            <span className="navbar__logo-menu-name">BFC Groupe</span>
          </div>
          <div className="navbar__logo-menu-item" role="menuitem">
            <img src={reandaLogo} alt="Reanda Global" className="navbar__logo-menu-img" />
            <span className="navbar__logo-menu-name">Reanda Global</span>
          </div>
          <div className="navbar__logo-menu-item" role="menuitem">
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=200&auto=format&fit=crop"
              alt="Studio Atlas"
              className="navbar__logo-menu-img"
            />
            <span className="navbar__logo-menu-name">Studio Atlas</span>
          </div>
        </div>
      </div>
      
      <button onClick={onOpenMenu} className="navbar__menu-button">
        <span className="navbar__menu-label">Menu</span>
        <MenuIcon size={16} />
      </button>
    </header>
  );
};
