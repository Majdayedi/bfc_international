import React from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../src/i18n';
import './ShowMoreArticles.css';

export const ShowMoreArticles: React.FC = () => {
  const t = useT();

  return (
    <section className="show-more">
      <div className="show-more__container">
        <div className="show-more__content">
          <p className="show-more__eyebrow">{t('showMore.eyebrow')}</p>
          <h3 className="show-more__title">
            {t('showMore.title')}
          </h3>
          <p className="show-more__text">
            {t('showMore.text')}
          </p>
          <Link to="/who-we-are/our-articles" className="show-more__button">
            {t('showMore.button')}
          </Link>
        </div>
      </div>
    </section>
  );
};
