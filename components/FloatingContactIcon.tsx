import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import './FloatingContactIcon.css';

export const FloatingContactIcon: React.FC = () => {
  const location = useLocation();
  const isActive = location.pathname === '/contact';

  return (
    <Link
      to="/contact"
      className={`fc-contact ${isActive ? 'fc-contact--active' : ''}`}
      aria-label="Contact us"
      title="Contact us"
    >
      <MessageCircle size={22} strokeWidth={2.1} />
      <span className="fc-contact__label">Contact</span>
    </Link>
  );
};
