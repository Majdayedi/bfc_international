import React from 'react';
import { Link } from 'react-router-dom';
import './ShowMoreArticles.css';

export const ShowMoreArticles: React.FC = () => {
  return (
    <section className="show-more">
      <div className="show-more__container">
        <div className="show-more__content">
          <p className="show-more__eyebrow">Show More</p>
          <h3 className="show-more__title">
            Want more articles and insights?
          </h3>
          <p className="show-more__text">
            Discover more stories, research, and case studies.
          </p>
          <Link to="/articles" className="show-more__button">
            Show all articles
          </Link>
        </div>
      </div>
    </section>
  );
};
