import { buildShowcaseComponentI18nIndex } from './buildShowcaseComponentI18n';
import {
  DEFAULT_SHOWCASE_LOCALE,
  resolveShowcaseI18nText,
} from './showcaseI18nText';
import type { ShowcaseI18nRegistry, ShowcaseI18nText, ShowcaseLocale } from './types';

export function createShowcaseI18nRegistry(
  initialLocale: ShowcaseLocale = DEFAULT_SHOWCASE_LOCALE,
): ShowcaseI18nRegistry {
  const index = buildShowcaseComponentI18nIndex();
  let locale = initialLocale;

  const registry: ShowcaseI18nRegistry = {
    get locale() {
      return locale;
    },
    setLocale(nextLocale) {
      locale = nextLocale;
    },
    t(text: ShowcaseI18nText) {
      return resolveShowcaseI18nText(text, locale);
    },
    tryName(key) {
      const entry = index.get(key);
      if (!entry) return undefined;
      return resolveShowcaseI18nText(entry.name, locale, '', key);
    },
    name(key, fallback = '') {
      return registry.tryName(key) ?? fallback;
    },
    description(key, fallback = '') {
      const entry = index.get(key);
      if (!entry?.description) return fallback;
      return resolveShowcaseI18nText(entry.description, locale, fallback, `${key}:description`);
    },
    entries() {
      return [...index.values()];
    },
    has(key) {
      return index.has(key);
    },
  };

  return registry;
}

let defaultRegistry: ShowcaseI18nRegistry | undefined;

export function getShowcaseI18nRegistry(): ShowcaseI18nRegistry {
  if (!defaultRegistry) {
    defaultRegistry = createShowcaseI18nRegistry();
  }
  return defaultRegistry;
}

export function setShowcaseI18nLocale(locale: ShowcaseLocale) {
  getShowcaseI18nRegistry().setLocale(locale);
}

export function showcaseI18nName(key: string, fallback = ''): string {
  return getShowcaseI18nRegistry().name(key, fallback);
}

export function showcaseI18nDescription(key: string, fallback = ''): string {
  return getShowcaseI18nRegistry().description(key, fallback);
}
