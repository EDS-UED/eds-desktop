import { SHOWCASE_LOCALE_ORDER, type ShowcaseLocale } from './showcaseLocaleCatalog';
import type { ShowcaseI18nReviewStatus } from './showcaseLocaleReviewTypes';

type LocaleBundle = Record<string, string>;

const localeModules = import.meta.glob<{ default: LocaleBundle }>('./locales/*/showcase.json', {
  eager: true,
});

const bundles = new Map<ShowcaseLocale, LocaleBundle>();

for (const [path, module] of Object.entries(localeModules)) {
  const match = path.match(/\/locales\/([^/]+)\/showcase\.json$/);
  if (!match) continue;
  bundles.set(match[1] as ShowcaseLocale, module.default ?? module);
}

import reviewManifest from './locales/_meta/review.json';
import type { ShowcaseI18nReviewEntry } from './showcaseLocaleReviewTypes';

const reviewMeta = reviewManifest as Record<string, Partial<Record<string, ShowcaseI18nReviewEntry>>>;

export function getShowcaseLocaleBundle(locale: ShowcaseLocale): LocaleBundle | undefined {
  return bundles.get(locale);
}

export function getShowcaseLocaleBundleText(
  key: string,
  locale: ShowcaseLocale,
): string | undefined {
  const bundle = bundles.get(locale);
  const value = bundle?.[key];
  return value && value.trim() !== '' ? value : undefined;
}

export function getShowcaseLocaleReviewStatus(
  key: string,
  locale: ShowcaseLocale,
): ShowcaseI18nReviewEntry | undefined {
  return reviewMeta[key]?.[locale];
}

export function listShowcaseLocaleBundleLocales(): ShowcaseLocale[] {
  return SHOWCASE_LOCALE_ORDER.filter((locale) => bundles.has(locale));
}
