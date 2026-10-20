import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

/**
 * Static translation system (replaces i18next + the runtime /api/translate
 * machine-translation machinery).
 *
 * - All UI text lives in src/locales/{en,fr,ar}.json as flat dotted keys.
 * - `useLanguage()` exposes the current language, a setter (persisted to
 *   localStorage + RTL document handling) and a `t(key)` translator that
 *   falls back to English, then to the key itself, so a missing translation
 *   never renders blank.
 * - Dynamic (database-served) content is localized through per-language
 *   fields on the content itself (e.g. titleFr / titleAr), not through t().
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'ar', label: 'العربية', short: 'AR' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const LANG_STORAGE_KEY = 'bfc-lang';

const RTL_LANGUAGES = ['ar'];

export const isRtl = (lng: string) => RTL_LANGUAGES.includes(lng);

/** Applies dir/lang attributes to <html> so Arabic renders right-to-left. */
export const applyDocumentDirection = (lng: string) => {
  const html = document.documentElement;
  const rtl = isRtl(lng);
  html.setAttribute('dir', rtl ? 'rtl' : 'ltr');
  html.setAttribute('lang', lng);
  html.classList.toggle('lang-rtl', rtl);
};

type Dictionary = Record<string, string>;

const DICTIONARIES: Record<LanguageCode, Dictionary> = {
  en: en as Dictionary,
  fr: fr as Dictionary,
  ar: ar as Dictionary,
};

const readInitialLanguage = (): LanguageCode => {
  const stored =
    typeof window !== 'undefined'
      ? window.localStorage.getItem(LANG_STORAGE_KEY)
      : null;
  return stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)
    ? (stored as LanguageCode)
    : 'en';
};

export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

const interpolate = (template: string, vars?: Record<string, string | number>) => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    vars[name] != null ? String(vars[name]) : match
  );
};

const makeTranslate = (lang: LanguageCode): TranslateFn => {
  const primary = DICTIONARIES[lang];
  const fallback = DICTIONARIES.en;
  return (key, vars) => {
    const template = primary[key] ?? fallback[key];
    if (template == null) {
      if (import.meta.env.DEV) {
        console.warn(`[BFC] Missing translation key: ${key}`);
      }
      return key;
    }
    return interpolate(template, vars);
  };
};

interface I18nContextValue {
  lang: LanguageCode;
  setLang: (code: string) => void;
  t: TranslateFn;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LanguageCode>(readInitialLanguage);

  useEffect(() => {
    applyDocumentDirection(lang);
  }, [lang]);

  const setLang = useCallback((code: string) => {
    const valid = SUPPORTED_LANGUAGES.some((l) => l.code === code)
      ? (code as LanguageCode)
      : 'en';
    window.localStorage.setItem(LANG_STORAGE_KEY, valid);
    setLangState(valid);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ lang, setLang, t: makeTranslate(lang) }),
    [lang, setLang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

/** Full language context: current code, setter, and the t() translator. */
export const useLanguage = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a <LanguageProvider>');
  }
  return ctx;
};

/** Convenience hook for components that only need t(). */
export const useT = (): TranslateFn => useLanguage().t;

/** Field-name suffix per language for localized database fields (titleFr/titleAr). */
const LOCALIZED_SUFFIX: Record<string, string> = { fr: 'Fr', ar: 'Ar' };

/**
 * Picks the per-language variant of a database-served field when one exists
 * (e.g. titleFr / titleAr written in the admin content forms), falling back
 * to the base (English) field. Use for any content that comes from the API
 * instead of the locale files.
 */
export const localizedField = (
  item: Record<string, any> | null | undefined,
  field: string,
  lang: string
): string => {
  if (!item) return '';
  const suffix = LOCALIZED_SUFFIX[lang];
  const localized = suffix ? item[field + suffix] : undefined;
  if (localized != null && String(localized).trim()) {
    return String(localized);
  }
  return item[field] != null ? String(item[field]) : '';
};

/**
 * Like localizedField, but returns ONLY the language-specific variant
 * (titleFr/titleAr...) and '' when none exists — so callers can layer it in
 * front of their own fallback chain without changing base-language behavior.
 */
export const localizedVariant = (
  item: Record<string, any> | null | undefined,
  field: string,
  lang: string
): string => {
  if (!item) return '';
  const suffix = LOCALIZED_SUFFIX[lang];
  const variant = suffix ? item[field + suffix] : undefined;
  return variant != null && String(variant).trim() ? String(variant) : '';
};

// Apply direction once at startup (before React mounts) so Arabic pages
// never flash left-to-right.
applyDocumentDirection(readInitialLanguage());
