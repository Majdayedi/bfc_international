import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../utils/constants';

// v2: version-bumped so old caches are ignored — earlier builds could store
// un-translated English text as if it were a translation when the backend was
// not yet configured with Azure credentials, permanently masking translations.
const CACHE_KEY = 'bfc-dyn-translations-v2';

type CacheShape = Partial<Record<string, Record<string, string>>>;

const readCache = (): CacheShape => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
};

const writeCache = (lang: string, entries: Record<string, string>) => {
  try {
    const cache = readCache();
    cache[lang] = { ...(cache[lang] || {}), ...entries };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // localStorage full or unavailable — cache is best-effort only
  }
};

export const readCachedTranslation = (lang: string, text: string): string | undefined =>
  readCache()[lang]?.[text];

/**
 * Translates an array of dynamic (backend-served) strings into the current
 * i18next language using the /api/translate endpoint, with:
 *  - a localStorage cache so already-translated strings never re-fetch,
 *  - translated-only strings overriding the original once results arrive.
 *
 * English is the canonical source language, so when the UI language is
 * English (or unset) the input strings are returned untouched.
 *
 * Returns an array aligned 1:1 with the input array.
 */
export function useTranslatedTexts(texts: (string | undefined | null)[]): string[] {
  const { i18n } = useTranslation();
  const lang = i18n.language?.split('-')[0] || 'en';
  const isSourceLanguage = lang === 'en';

  const joinKey = texts.map((t) => (t ? '' + t.length + ':' + t : '\u0000')).join('|');
  const lastKeyRef = useRef('');
  const [ overrides, setOverrides ] = useState<Record<number, string>>({});

  useEffect(() => {
    if (isSourceLanguage) {
      lastKeyRef.current = joinKey;
      return;
    }

    const pendingInd: number[] = [];
    const pendingTexts: string[] = [];

    texts.forEach((text, i) => {
      if (!text || !text.trim()) {
        return;
      }
      const cached = readCachedTranslation(lang, text);
      if (cached && cached.trim()) {
        return; // translation already in localStorage — settled below
      }
      pendingTexts.push(text);
      pendingInd.push(i);
    });

    const settled: Record<number, string> = {};
    const initial: Record<string, string> = {};
    texts.forEach((text, i) => {
      if (!text) {
        return;
      }
      const cached = readCachedTranslation(lang, text);
      if (cached) {
        settled[i] = cached;
        initial[text] = cached;
      }
    });

    setOverrides(settled);

    if (pendingTexts.length === 0) {
      lastKeyRef.current = joinKey;
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: pendingTexts, to: lang, from: 'en' }),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data: { translations: string[]; configured: boolean } = await res.json();
        if (cancelled) return;

        // When the backend lacks Azure credentials it echoes the originals
        // back with configured:false. Accepting those would cache English
        // text as a "translation" and hide real ones later — so ignore the
        // whole response in that case (originals already on screen anyway).
        if (!data.configured) {
          console.warn(
            "[BFC] Translation backend is not configured. Start the Spring backend with AZURE_TRANSLATOR_KEY and AZURE_TRANSLATOR_REGION set to enable dynamic translations."
          );
          return;
        }

        const fresh: Record<string, string> = {};
        pendingInd.forEach((originalIndex, j) => {
          const translated = data.translations?.[j];
          if (translated && translated.trim()) {
            settled[originalIndex] = translated;
            fresh[pendingTexts[j]] = translated;
          }
        });
        if (Object.keys(settled).length > 0) {
          setOverrides({ ...settled });
        }
        if (Object.keys(fresh).length > 0) {
          writeCache(lang, fresh);
        }
      } catch (err) {
        console.error('Dynamic translation failed:', err);
        // Graceful: originals stay visible
      }
    })();

    lastKeyRef.current = joinKey;
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joinKey, lang]);

  return texts.map((text, i) =>
    text == null ? '' : (overrides[i] ?? text)
  );
}
