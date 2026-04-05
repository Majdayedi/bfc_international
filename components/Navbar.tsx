
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

const COUNTRY_LINKS = [
  { label: 'Congo', to: '/representatives/congo' },
  { label: 'Senegal', to: '/representatives/senegal' },
  { label: 'Tunisia', to: '/representatives/tunisia' },
  { label: 'Guinea', to: '/representatives/guinee' },
  { label: 'Mauritania', to: '/representatives/mauritania' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenMenu }) => {
  return (
    <header className="navbar">
      <button onClick={onOpenMenu} className="navbar__menu-button">
        <span className="navbar__menu-label">Menu</span>
        <MenuIcon size={16} />
      </button>

      

      <div className="navbar__logo">
        <Link to="/" className="navbar__logo-link">
          <span className="navbar__logo-box">
            <span className="navbar__logo-stack" aria-label="BFC and Reanda">
              <img src={reandaLogo} alt="Reanda" className="navbar__logo-img navbar__logo-img--a" />
              <img src={bfcLogo} alt="BFC" className="navbar__logo-img navbar__logo-img--b" />
            </span>
          </span>
        </Link>
        
      </div>
    </header>
  );
};
