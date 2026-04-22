import React from 'react';
import { MessageCircle } from 'lucide-react';
import './FloatingContactIcon.css';

const WHATSAPP_URL = 'https://wa.me/21698770970';

export const FloatingContactIcon: React.FC = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fc-contact"
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
    >
      <MessageCircle size={22} strokeWidth={2.1} />
      <span className="fc-contact__label">Contact</span>
    </a>
  );
};
