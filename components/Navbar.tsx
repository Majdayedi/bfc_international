
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';
import reandaLogo from '../src/assets/reanda.png';
import bfcLogo from '../src/assets/bfc.png';
import bfc_guinee from '../src/assets/bfc_guinée.png';
import bfc_mauritania from '../src/assets/bfc_mauritania.png';
import bfcsenegal from '../src/assets/bfc_senegal.png';
import bfc_congo from '../src/assets/bfc_congo.png';

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
            <img src={bfcsenegal} alt="BFC Groupe" className="navbar__logo-menu-img" />
            <span className="navbar__logo-menu-name">BFC Senegal</span>
          </div>
          <div className="navbar__logo-menu-item" role="menuitem">
            <img src={bfc_congo} alt="Reanda Global" className="navbar__logo-menu-img" />
            <span className="navbar__logo-menu-name">BFC Congo</span>
          </div>
          <div className="navbar__logo-menu-item" role="menuitem">
            <img src={bfc_guinee} alt="Reanda Global" className="navbar__logo-menu-img" />
            <span className="navbar__logo-menu-name">BFC Guinée</span>
          </div>
          <div className="navbar__logo-menu-item" role="menuitem">
            <img src={bfc_mauritania} alt="Reanda Global" className="navbar__logo-menu-img" />
            <span className="navbar__logo-menu-name">BFC Mauritania</span>
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
