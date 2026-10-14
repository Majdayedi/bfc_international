import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../src/i18n';
import './LangSwitcher.css';

/**
 * Floating language bubble pinned above the WhatsApp contact bubble at the
 * bottom-right of the screen. Shows the current language's short code on a
 * glass circle; clicking it makes the other language code pills pop up above
 * it. Selecting one calls i18n.changeLanguage (localStorage persistence and
 * Arabic RTL handling live in src/i18n.ts).
 */
export const LangSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const active = i18n.language?.split('-')[0] || 'en';
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === active) ??
    SUPPORTED_LANGUAGES[0];

  // Close when clicking anywhere outside the bubble stack.
  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  const pickLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    // data-no-translate: the auto-translator must never touch the language
    // bubble — otherwise it translates the EN/FR/AR/ES codewords themselves.
    <div className="lang-bubble" ref={rootRef} data-no-translate>
      {open && (
        <div className="lang-bubble__options" role="listbox" aria-label="Language">
          {SUPPORTED_LANGUAGES.filter((lang) => lang.code !== active).map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              className="lang-bubble__option"
              onClick={() => pickLanguage(lang.code)}
              title={lang.label}
            >
              <span>{lang.short}</span>
              <span className="lang-bubble__option-name">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className={`lang-bubble__trigger ${open ? 'lang-bubble__trigger--open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={`Language: ${current.label}`}
      >
        <span>{current.short}</span>
      </button>
    </div>
  );
};
