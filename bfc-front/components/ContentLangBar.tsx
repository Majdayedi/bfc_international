import React from 'react';
import './ContentLangBar.css';

export type ContentLang = 'en' | 'fr' | 'ar';

export const CONTENT_LANG_NAMES: Record<ContentLang, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
};

interface Props {
  value: ContentLang;
  onChange: (lang: ContentLang) => void;
  /** Languages that already hold a translation (drives the "+" hint). */
  has?: Partial<Record<ContentLang, boolean>>;
  label?: string;
}

/**
 * One EN / FR / AR switch for a content form: the form edits the selected
 * language version, and each language keeps its own text + lists. Mirrors the
 * switch used by the article and project builders.
 */
export const ContentLangBar: React.FC<Props> = ({ value, onChange, has, label = 'Content' }) => (
  <div className="clb" role="group" aria-label="Content language">
    <span className="clb__label">{label}</span>
    {(['en', 'fr', 'ar'] as ContentLang[]).map((code) => {
      const isAdded = code === 'en' || has?.[code] !== false;
      const title = code === 'en'
        ? 'Edit the English content'
        : isAdded
          ? `Edit the ${code === 'fr' ? 'French' : 'Arabic'} version`
          : `Add ${code === 'fr' ? 'a French' : 'an Arabic'} version`;
      return (
        <button
          key={code}
          type="button"
          className={`clb__btn${value === code ? ' clb__btn--active' : ''}${!isAdded ? ' clb__btn--add' : ''}`}
          onClick={() => onChange(code)}
          title={title}
          aria-pressed={value === code}
        >
          {!isAdded && <span className="clb__plus" aria-hidden="true">+</span>}
          {code.toUpperCase()}
          <span className="clb__name">{CONTENT_LANG_NAMES[code]}</span>
        </button>
      );
    })}
  </div>
);

/** True when a language variant holds any non-blank text. */
export const hasVariantText = (...values: (string | null | undefined)[]): boolean =>
  values.some((v) => v != null && String(v).trim() !== '');
