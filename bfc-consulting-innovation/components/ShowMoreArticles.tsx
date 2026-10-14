import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslatedTexts } from '../src/dynamicTranslation';
import './ShowMoreArticles.css';

export const ShowMoreArticles: React.FC = () => {
  const [eyebrow, title, text, button] = useTranslatedTexts([
    'Show More',
    'Want more articles and insights?',
    'Discover more stories, research, and case studies.',
    'Show all articles'
  ]);

  return (
    <section className="show-more">
      <div className="show-more__container">
        <div className="show-more__content">
          <p className="show-more__eyebrow">{eyebrow}</p>
          <h3 className="show-more__title">
            {title}
          </h3>
          <p className="show-more__text">
            {text}
          </p>
          <Link to="/who-we-are/our-articles" className="show-more__button">
            {button}
          </Link>
        </div>
      </div>
    </section>
  );
};
