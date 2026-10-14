import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'ar', label: 'العربية', short: 'AR' },
  { code: 'es', label: 'Español', short: 'ES' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const LANG_KEY = 'bfc-lang';

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

const storedLang =
  typeof window !== 'undefined'
    ? window.localStorage.getItem(LANG_KEY)
    : null;

const initialLng: LanguageCode =
  storedLang && SUPPORTED_LANGUAGES.some((l) => l.code === storedLang)
    ? (storedLang as LanguageCode)
    : 'en';

i18n.use(initReactI18next).init({
  // No static resource bundles: ALL translation (static UI text included) is
  // performed dynamically through the backend /api/translate endpoint — see
  // src/dynamicTranslation.ts. i18next is used purely as the language state
  // provider (current language subscription, changeLanguage, persistence).
  resources: {},
  lng: initialLng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Extend changeLanguage so RTL setup + localStorage persistence happen no
// matter where a switch is triggered from.
const originalChangeLanguage = i18n.changeLanguage.bind(i18n) as (lng?: string) => Promise<any>;
const changeLanguageWithSideEffects = async (lng?: string) => {
  const target = (lng || 'en') as LanguageCode;
  const valid = SUPPORTED_LANGUAGES.some((l) => l.code === target) ? target : 'en';
  window.localStorage.setItem(LANG_KEY, valid);
  applyDocumentDirection(valid);
  return originalChangeLanguage(valid);
};

// Replace the method while preserving the prototype descriptor
i18n.changeLanguage = changeLanguageWithSideEffects as typeof i18n.changeLanguage;

// Apply direction once at startup
applyDocumentDirection(initialLng);

export default i18n;
