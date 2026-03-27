import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RepresentativeDetail.css';

import bfcCongo from '../src/assets/bfc_congo.png';
import bfcSenegal from '../src/assets/bfc_senegal.png';
import bfcGuinee from '../src/assets/bfc_guinée.png';
import bfcMauritania from '../src/assets/bfc_mauritania.png';
import bfcTunisia from '../src/assets/bfc.png';

interface RepresentativeData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const representativeData: Record<string, RepresentativeData> = {
  'congo': {
    title: 'BFC Congo',
    subtitle: 'Your partner in Central Africa',
    description: 'BFC Congo supports you through tailored solutions combining regional nuances with international standard consulting. We help businesses navigate the dynamic economy of the Congo Basin.',
    image: bfcCongo
  },
  'senegal': {
    title: 'BFC Senegal',
    subtitle: 'Influence in West Africa',
    description: 'Located in the heart of West Africa, BFC Senegal is dedicated to business transformation and institutional capacity building through innovative strategies.',
    image: bfcSenegal
  },
  'tunisia': {
    title: 'BFC Tunisia',
    subtitle: 'The bridge between Africa and Europe',
    description: 'BFC Tunisia operates as a strategic hub offering high-level consulting by leveraging exceptional human capital and mastery of North African markets.',
    image: bfcTunisia
  },
  'guinee': {
    title: 'BFC Guinea',
    subtitle: 'Expertise driving growth',
    description: 'Our firm is committed to providing pragmatic solutions and tailored support to businesses and institutions in Guinea for sustainable growth.',
    image: bfcGuinee
  },
  'mauritania': {
    title: 'BFC Mauritania',
    subtitle: 'Strategic support and development',
    description: 'BFC continues its expansion with a strengthened presence, developing new local partnerships to address your economic and structural challenges.',
    image: bfcMauritania
  }
};

export const RepresentativeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const repId = id?.toLowerCase() || '';
  const data = representativeData[repId];

  useEffect(() => {
    window.scrollTo(0, 0);

    const elements = document.querySelectorAll('.rd-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rd-visible');
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [id]);

  if (!data) {
    return (
      <div className="rd-page rd-not-found">
        <h2>Office not found</h2>
        <button className="rd-back-btn" onClick={() => navigate(-1)}>
          <span>&larr;</span> Back
        </button>
      </div>
    );
  }

  return (
    <div className="rd-page">
      <div className="rd-container">
        
        <div className="rd-split-layout">
          
          <div className="rd-text-section">
            
            
            <div className="rd-content">
              <span className="rd-eyebrow rd-reveal">Global Network</span>
              <h1 className="rd-title rd-reveal">{data.title}</h1>
              <div className="rd-divider rd-reveal"></div>
              <h2 className="rd-subtitle rd-reveal">{data.subtitle}</h2>
              <p className="rd-desc rd-reveal">{data.description}</p>
              
              <div className="rd-glass-card rd-reveal">
                <h3 className="rd-glass-title">Local Expertise, Global Vision</h3>
                <p>
                  Our offices are deeply integrated into the local economic fabric while upholding the world-class methodologies and standards that define the BFC brand.
                </p>
              </div>
            </div>
          </div>

          <div className="rd-image-section rd-reveal">
            <div className="rd-logo-wrapper">
              <img src={data.image} alt={data.title} className="rd-photo" />
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default RepresentativeDetail;
