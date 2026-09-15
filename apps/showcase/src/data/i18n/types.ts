import type { ShowcaseLocale, ShowcaseLocaleId } from './showcaseLocaleCatalog';

export type { ShowcaseLocale, ShowcaseLocaleId };
export {
  DEFAULT_SHOWCASE_LOCALE,
  SHOWCASE_GLOBAL_FALLBACK_LOCALE,
  SHOWCASE_LOCALES,
} from './showcaseLocaleCatalog';

/** authoring 真源：en（全球 fallback）+ zh-CN（华语基准）。 */
export type ShowcaseI18nCoreText = {
  en: string;
  'zh-CN': string;
};

export type ShowcaseI18nText = ShowcaseI18nCoreText & Partial<Record<ShowcaseLocale, string>>;

export type ShowcaseI18nNamespace =
  | 'components'
  | 'patterns'
  | 'scenes'
  | 'animations'
  | 'nav'
  | 'section'
  | 'group'
  | 'shell'
  | 'demo';

export type ShowcaseI18nKey = `${ShowcaseI18nNamespace}:${string}`;

export type ShowcaseI18nEntry = {
  key: ShowcaseI18nKey;
  name: ShowcaseI18nText;
  description?: ShowcaseI18nText;
};

export type ShowcaseI18nRegistry = {
  readonly locale: ShowcaseLocale;
  setLocale: (locale: ShowcaseLocale) => void;
  name: (key: ShowcaseI18nKey | string, fallback?: string) => string;
  description: (key: ShowcaseI18nKey | string, fallback?: string) => string;
  t: (text: ShowcaseI18nText) => string;
  tryName: (key: ShowcaseI18nKey | string) => string | undefined;
  entries: () => readonly ShowcaseI18nEntry[];
  has: (key: ShowcaseI18nKey | string) => boolean;
};

export type ShowcaseI18nPartialText = Partial<ShowcaseI18nText>;
