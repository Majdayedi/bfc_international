import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import './FloatingContactIcon.css';

const WHATSAPP_URL = 'https://wa.me/21658422199';

// Below this many pixels the bubble stays hidden, so it does not sit over the
// hero on first load. The gap also stops it flickering on tiny scroll nudges.
const SCROLL_THRESHOLD = 48;

export const FloatingContactIcon: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);

    // Run once for the current position: on a reload the browser can restore a
    // scroll offset without firing a scroll event, and the bubble should already
    // be showing on such a page.
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`fc-contact${visible ? ' fc-contact--visible' : ''}`}
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
    >
      <MessageCircle size={22} strokeWidth={2.1} />
      <span className="fc-contact__label">Contact</span>
    </a>
  );
};
