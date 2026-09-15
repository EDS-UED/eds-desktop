import {
  DEFAULT_SHOWCASE_LOCALE,
  getShowcaseLocaleResolutionChain,
  normalizeShowcaseLocale,
  type ShowcaseLocale,
} from './showcaseLocaleCatalog';
import { getShowcaseLocaleBundleText } from './showcaseLocaleBundle';
import type { ShowcaseI18nPartialText, ShowcaseI18nText } from './types';
import { toZhHant } from './toZhHant';

export { DEFAULT_SHOWCASE_LOCALE };

export type ShowcaseChineseRegionalText = {
  'zh-HK'?: string;
  'zh-TW'?: string;
};

export function defineShowcaseI18nText(
  en: string,
  zhCN: string,
  regional?: ShowcaseChineseRegionalText,
): ShowcaseI18nText {
  const hant = toZhHant(zhCN);
  return {
    en,
    'en-US': en,
    'zh-CN': zhCN,
    'zh-HK': regional?.['zh-HK'] ?? hant,
    'zh-TW': regional?.['zh-TW'] ?? hant,
  };
}

export function defineComponentName(
  en: string,
  zhCN?: string,
  regional?: ShowcaseChineseRegionalText,
): ShowcaseI18nText {
  const simplified = zhCN ?? en;
  return defineShowcaseI18nText(
    en,
    simplified,
    regional ?? (zhCN ? undefined : { 'zh-HK': en, 'zh-TW': en }),
  );
}

export function mergeShowcaseI18nText(
  base: ShowcaseI18nText,
  patch?: ShowcaseI18nPartialText,
): ShowcaseI18nText {
  if (!patch) return base;
  return {
    ...base,
    ...patch,
    en: patch.en ?? base.en,
    'zh-CN': patch['zh-CN'] ?? base['zh-CN'],
  };
}

export function resolveShowcaseI18nText(
  text: ShowcaseI18nText | undefined,
  locale: ShowcaseLocale,
  fallback = '',
  bundleKey?: string,
): string {
  if (bundleKey) {
    for (const step of getShowcaseLocaleResolutionChain(locale)) {
      const bundled = getShowcaseLocaleBundleText(bundleKey, step);
      if (bundled) {
        return bundled;
      }
    }
  }

  if (!text) return fallback;

  for (const step of getShowcaseLocaleResolutionChain(locale)) {
    const value = text[step];
    if (value) {
      return value;
    }
  }

  return fallback;
}

export function isShowcaseLocale(value: string): value is ShowcaseLocale {
  return normalizeShowcaseLocale(value) != null;
}

export function coerceShowcaseLocale(value: string): ShowcaseLocale {
  return normalizeShowcaseLocale(value) ?? DEFAULT_SHOWCASE_LOCALE;
}
