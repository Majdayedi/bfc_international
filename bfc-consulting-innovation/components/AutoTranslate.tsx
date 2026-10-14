import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../utils/constants';
import { readCachedTranslation } from '../src/dynamicTranslation';

/**
 * Catch-all DOM translator. Runs when the UI language is anything other than
 * English: it walks the page, batches every visible English text node through
 * the backend /api/translate endpoint, and patches them in place. A
 * MutationObserver re-runs it on navigation and re-renders, so the chosen
 * language applies on EVERY page — including content fetched from the API and
 * pages that were never individually wired.
 *
 * Speed comes from the localStorage cache (via readCachedTranslation): a once
 * translated string never re-fetches. Wired components that translate via
 * useTranslatedTexts remain as-is; this component is the safety net for
 * everything else.
 */

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'NOSCRIPT', 'svg', 'text']);

/** Purely numeric/punctuation strings are not worth a translation call. */
const looksLikeData = (text: string) =>
  /^[\d\s+\-.,:;%#/()®©™°]+\)?$/.test(text) || text.length < 2;

/** Short language codewords (EN, FR, AR, ES) must never be translated —
 *  a translation API will happily turn "FR" into "BELGIQUE". */
const LANGUAGE_CODES = new Set(['EN', 'FR', 'AR', 'ES', 'DE', 'IT', 'PT', 'NL']);
const isLanguageCode = (text: string) => LANGUAGE_CODES.has(text.toUpperCase());

/** node → the trimmed value we last patched in (WeakMap survives GC). */
const patched = new WeakMap<Text, string>();

function acceptNode(node: Node): number {
  if (!(node instanceof Text)) return NodeFilter.FILTER_REJECT;
  const parent = node.parentElement;
  if (!parent) return NodeFilter.FILTER_REJECT;
  if (SKIP_TAGS.has(parent.tagName.toLowerCase())) return NodeFilter.FILTER_REJECT;
  if (parent.closest('[data-no-translate]')) return NodeFilter.FILTER_REJECT;
  const value = node.nodeValue;
  if (!value || !value.trim()) return NodeFilter.FILTER_REJECT;
  if (looksLikeData(value.trim()) || isLanguageCode(value.trim())) {
    return NodeFilter.FILTER_REJECT;
  }
  // Already patched and unchanged since — nothing to do.
  const lastPatched = patched.get(node);
  if (lastPatched !== undefined && lastPatched === value.trim()) {
    return NodeFilter.FILTER_REJECT;
  }
  return NodeFilter.FILTER_ACCEPT;
}

function collectTextNodes(root: HTMLElement): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode,
  });
  const nodes: Text[] = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

const AutoTranslate: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.split('-')[0] || 'en';

  useEffect(() => {
    if (lang === 'en') return; // English is the source language
    let timer: number | undefined;
    let running = false;

    const flush = async () => {
      if (running) return; // a previous batch is still in flight
      running = true;
      try {
        const nodes = collectTextNodes(document.body);
        if (nodes.length === 0) return;

        // Deduplicate identical strings; remember indices to patch back.
        const byString = new Map<string, number[]>();
        nodes.forEach((node, index) => {
          const value = node.nodeValue!.trim();
          const indices = byString.get(value);
          if (indices) {
            indices.push(index);
          } else {
            byString.set(value, [index]);
          }
        });
        const strings = Array.from(byString.keys());

        // 1. Serve everything already in the localStorage cache immediately.
        const translations = new Map<string, string>();
        const pending: string[] = [];
        strings.forEach((text) => {
          const cached = readCachedTranslation(lang, text);
          if (cached) {
            translations.set(text, cached);
          } else {
            pending.push(text);
          }
        });

        // 2. Fetch the rest in safe batch sizes (backend max = 150 texts).
        const BATCH = 100;
        for (let i = 0; i < pending.length; i += BATCH) {
          const slice = pending.slice(i, i + BATCH);
          try {
            const response = await fetch(`${API_URL}/api/translate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ texts: slice, to: lang, from: 'en' }),
            });
            if (!response.ok) {
              console.error('[BFC] AutoTranslate batch failed: HTTP', response.status);
              continue;
            }
            const data = (await response.json()) as {
              translations: string[];
              configured: boolean;
            };
            if (!data.configured) {
              console.warn(
                '[BFC] Translation backend not configured — texts stay untranslated until it is.'
              );
              continue;
            }
            data.translations?.forEach((translated, j) => {
              if (translated && translated.trim()) {
                translations.set(slice[j], translated);
              }
            });
          } catch (error) {
            console.error('[BFC] AutoTranslate fetch failed:', error);
          }
        }

        // 3. Patch the DOM where the node still shows the expected text.
        nodes.forEach((node, index) => {
          const original = node.nodeValue!;
          const key = original.trim();
          const translated = translations.get(key);
          if (!translated || translated === key) return;
          try {
            node.nodeValue = original.replace(key, translated);
            patched.set(node, translated);
          } catch {
            // node detached mid-flight — ignore
          }
        });
      } finally {
        running = false;
      }
    };

    const schedule = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = undefined;
        void flush();
      }, 350);
    };

    schedule(); // initial sweep for the current page
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [lang]);

  return null;
};

export default AutoTranslate;
