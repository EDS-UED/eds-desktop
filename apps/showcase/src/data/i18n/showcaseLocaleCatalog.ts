/** Showcase 文档站 — 全球 locale 目录（BCP 47 + fallback 链）。 */

export const SHOWCASE_REGION_GROUPS = [
  'global',
  'greater-china',
  'east-asia',
  'southeast-asia',
  'europe',
  'middle-east',
  'south-asia',
  'latin-america',
] as const;

export type ShowcaseRegionGroup = (typeof SHOWCASE_REGION_GROUPS)[number];

export const SHOWCASE_LOCALE_CATALOG = [
  { id: 'zh-CN', shortLabel: 'CN', nativeLabel: '简体中文', regionGroup: 'greater-china', direction: 'ltr', fallback: ['en-US'] },
  { id: 'en-US', shortLabel: 'EN', nativeLabel: 'English', regionGroup: 'global', direction: 'ltr', fallback: [] },
  { id: 'ar', shortLabel: 'AR', nativeLabel: 'العربية', regionGroup: 'middle-east', direction: 'rtl', fallback: ['en-US'] },
  { id: 'pl-PL', shortLabel: 'PL', nativeLabel: 'Polski', regionGroup: 'europe', direction: 'ltr', fallback: ['en-US'] },
  { id: 'de-DE', shortLabel: 'DE', nativeLabel: 'Deutsch', regionGroup: 'europe', direction: 'ltr', fallback: ['en-US'] },
  { id: 'ru-RU', shortLabel: 'RU', nativeLabel: 'Русский', regionGroup: 'europe', direction: 'ltr', fallback: ['en-US'] },
  { id: 'fr-FR', shortLabel: 'FR', nativeLabel: 'Français', regionGroup: 'europe', direction: 'ltr', fallback: ['en-US'] },
  { id: 'zh-TW', shortLabel: 'TW', nativeLabel: '繁體中文（台灣）', regionGroup: 'greater-china', direction: 'ltr', fallback: ['zh-CN', 'en-US'] },
  { id: 'zh-HK', shortLabel: 'HK', nativeLabel: '繁體中文（香港）', regionGroup: 'greater-china', direction: 'ltr', fallback: ['zh-CN', 'en-US'] },
  { id: 'ko-KR', shortLabel: 'KO', nativeLabel: '한국어', regionGroup: 'east-asia', direction: 'ltr', fallback: ['en-US'] },
  { id: 'pt-BR', shortLabel: 'BR', nativeLabel: 'Português (Brasil)', regionGroup: 'latin-america', direction: 'ltr', fallback: ['en-US'] },
  { id: 'ja-JP', shortLabel: 'JA', nativeLabel: '日本語', regionGroup: 'east-asia', direction: 'ltr', fallback: ['en-US'] },
  { id: 'tr-TR', shortLabel: 'TR', nativeLabel: 'Türkçe', regionGroup: 'middle-east', direction: 'ltr', fallback: ['en-US'] },
  { id: 'uk-UA', shortLabel: 'UA', nativeLabel: 'Українська', regionGroup: 'europe', direction: 'ltr', fallback: ['en-US'] },
  { id: 'es-419', shortLabel: 'LA', nativeLabel: 'Español (Latinoamérica)', regionGroup: 'latin-america', direction: 'ltr', fallback: ['es-ES', 'en-US'] },
  { id: 'es-ES', shortLabel: 'ES', nativeLabel: 'Español (España)', regionGroup: 'europe', direction: 'ltr', fallback: ['en-US'] },
  { id: 'it-IT', shortLabel: 'IT', nativeLabel: 'Italiano', regionGroup: 'europe', direction: 'ltr', fallback: ['en-US'] },
  { id: 'hi-IN', shortLabel: 'HI', nativeLabel: 'हिन्दी', regionGroup: 'south-asia', direction: 'ltr', fallback: ['en-US'] },
  { id: 'id-ID', shortLabel: 'ID', nativeLabel: 'Bahasa Indonesia', regionGroup: 'southeast-asia', direction: 'ltr', fallback: ['en-US'] },
  { id: 'ms-MY', shortLabel: 'MS', nativeLabel: 'Bahasa Melayu', regionGroup: 'southeast-asia', direction: 'ltr', fallback: ['en-US'] },
  { id: 'vi-VN', shortLabel: 'VI', nativeLabel: 'Tiếng Việt', regionGroup: 'southeast-asia', direction: 'ltr', fallback: ['en-US'] },
  { id: 'th-TH', shortLabel: 'TH', nativeLabel: 'ไทย', regionGroup: 'southeast-asia', direction: 'ltr', fallback: ['en-US'] },
  { id: 'nl-NL', shortLabel: 'NL', nativeLabel: 'Nederlands', regionGroup: 'europe', direction: 'ltr', fallback: ['en-US'] },
  { id: 'fa-IR', shortLabel: 'FA', nativeLabel: 'فارسی', regionGroup: 'middle-east', direction: 'rtl', fallback: ['en-US'] },
] as const;

export type ShowcaseLocaleId = (typeof SHOWCASE_LOCALE_CATALOG)[number]['id'];

export type ShowcaseLocaleMeta = {
  id: ShowcaseLocaleId;
  shortLabel: string;
  nativeLabel: string;
  regionGroup: ShowcaseRegionGroup;
  direction: 'ltr' | 'rtl';
  fallback: readonly ShowcaseLocaleId[];
};

/** 侧栏语言下拉 — 固定顺序（与 catalog 条目一致）。 */
export const SHOWCASE_LOCALE_ORDER = SHOWCASE_LOCALE_CATALOG.map((entry) => entry.id);

export const SHOWCASE_LOCALES = SHOWCASE_LOCALE_ORDER;

export type ShowcaseLocale = ShowcaseLocaleId;

export const DEFAULT_SHOWCASE_LOCALE: ShowcaseLocale = 'zh-CN';

export const SHOWCASE_GLOBAL_FALLBACK_LOCALE: ShowcaseLocale = 'en-US';

export const SHOWCASE_REGION_GROUP_LABELS: Record<ShowcaseRegionGroup, string> = {
  global: '全球基础',
  'greater-china': '大中华区',
  'east-asia': '东亚',
  'southeast-asia': '东南亚',
  europe: '欧洲',
  'middle-east': '中东',
  'south-asia': '南亚',
  'latin-america': '拉美',
};

export const SHOWCASE_REGION_GROUP_LABELS_EN: Record<ShowcaseRegionGroup, string> = {
  global: 'Global',
  'greater-china': 'Greater China',
  'east-asia': 'East Asia',
  'southeast-asia': 'Southeast Asia',
  europe: 'Europe',
  'middle-east': 'Middle East',
  'south-asia': 'South Asia',
  'latin-america': 'Latin America',
};

/** 华语 UI 下副标题（简体译名）。 */
const SHOWCASE_LOCALE_SECONDARY_ZH: Record<ShowcaseLocale, string> = {
  'zh-CN': '中文',
  'en-US': '英语',
  ar: '阿拉伯语',
  'pl-PL': '波兰语',
  'de-DE': '德语',
  'ru-RU': '俄语',
  'fr-FR': '法语',
  'zh-TW': '中文',
  'zh-HK': '中文',
  'ko-KR': '韩语',
  'pt-BR': '葡萄牙语（巴西）',
  'ja-JP': '日语',
  'tr-TR': '土耳其语',
  'uk-UA': '乌克兰语',
  'es-419': '西班牙语（拉丁美洲）',
  'es-ES': '西班牙语（西班牙）',
  'it-IT': '意大利语',
  'hi-IN': '印地语',
  'id-ID': '印尼语',
  'ms-MY': '马来语',
  'vi-VN': '越南语',
  'th-TH': '泰语',
  'nl-NL': '荷兰语',
  'fa-IR': '波斯语',
};

function resolveIntlUiTag(uiLocale: ShowcaseLocale): string {
  if (uiLocale === 'zh-HK' || uiLocale === 'zh-TW') {
    return 'zh-CN';
  }
  if (uiLocale.startsWith('en')) {
    return 'en';
  }
  if (uiLocale.startsWith('zh')) {
    return 'zh-CN';
  }
  return uiLocale;
}

function usesChineseUiLocale(uiLocale: ShowcaseLocale): boolean {
  return uiLocale === 'zh-CN' || uiLocale === 'zh-HK' || uiLocale === 'zh-TW';
}

export function getShowcaseRegionGroupLabel(
  regionGroup: ShowcaseRegionGroup,
  uiLocale: ShowcaseLocale,
): string {
  if (usesChineseUiLocale(uiLocale)) {
    return SHOWCASE_REGION_GROUP_LABELS[regionGroup];
  }
  return SHOWCASE_REGION_GROUP_LABELS_EN[regionGroup];
}

function getShowcaseLanguageCode(localeId: ShowcaseLocale): string {
  try {
    return new Intl.Locale(localeId).language;
  } catch {
    return localeId.split('-')[0] ?? localeId;
  }
}

const showcaseLanguageCounts = SHOWCASE_LOCALE_CATALOG.reduce<Map<string, number>>((counts, entry) => {
  const language = getShowcaseLanguageCode(entry.id);
  counts.set(language, (counts.get(language) ?? 0) + 1);
  return counts;
}, new Map());

function shouldShowRegionInSecondaryLabel(localeId: ShowcaseLocale): boolean {
  const language = getShowcaseLanguageCode(localeId);
  return (showcaseLanguageCounts.get(language) ?? 0) > 1;
}

/** 下拉副标题：nativeLabel 为自称；华语 UI 走 manual 中文译名。 */
export function getShowcaseLocaleSecondaryLabel(
  localeId: ShowcaseLocale,
  uiLocale: ShowcaseLocale,
): string {
  if (usesChineseUiLocale(uiLocale)) {
    return SHOWCASE_LOCALE_SECONDARY_ZH[localeId];
  }

  try {
    const target = new Intl.Locale(localeId);
    const uiTag = resolveIntlUiTag(uiLocale);
    const languageNames = new Intl.DisplayNames([uiTag], { type: 'language' });
    const regionNames = new Intl.DisplayNames([uiTag], { type: 'region' });

    const language = languageNames.of(target.language);
    if (!language) {
      return localeId;
    }

    if (!shouldShowRegionInSecondaryLabel(localeId)) {
      return language;
    }

    if (localeId === 'es-419') {
      return `${language} (Latin America)`;
    }

    if (target.region) {
      const region = regionNames.of(target.region);
      if (region) {
        return `${language} (${region})`;
      }
    }

    return language;
  } catch {
    return localeId;
  }
}

const localeMetaById = new Map<string, ShowcaseLocaleMeta>(
  SHOWCASE_LOCALE_CATALOG.map((entry) => [entry.id, entry]),
);

export const SHOWCASE_LEGACY_LOCALE_ALIASES: Record<string, ShowcaseLocale> = {
  'zh-Hans': 'zh-CN',
  'zh-Hant': 'zh-HK',
  'zh-Hant-TW': 'zh-TW',
  en: 'en-US',
  'en-GB': 'en-US',
};

export function normalizeShowcaseLocale(value: string): ShowcaseLocale | undefined {
  const legacy = SHOWCASE_LEGACY_LOCALE_ALIASES[value];
  if (legacy) {
    return legacy;
  }
  if (localeMetaById.has(value)) {
    return value as ShowcaseLocale;
  }
  return undefined;
}

export function getShowcaseLocaleMeta(locale: ShowcaseLocale): ShowcaseLocaleMeta {
  const meta = localeMetaById.get(locale);
  if (!meta) {
    throw new Error(`Unknown showcase locale: ${locale}`);
  }
  return meta;
}

export function getShowcaseLocaleResolutionChain(locale: ShowcaseLocale): ShowcaseLocale[] {
  const meta = getShowcaseLocaleMeta(locale);
  const chain: ShowcaseLocale[] = [locale];
  for (const step of meta.fallback) {
    if (!chain.includes(step)) {
      chain.push(step);
    }
  }
  if (!chain.includes(SHOWCASE_GLOBAL_FALLBACK_LOCALE)) {
    chain.push(SHOWCASE_GLOBAL_FALLBACK_LOCALE);
  }
  return chain;
}

export function getShowcaseLocaleShortLabel(locale: ShowcaseLocale): string {
  return getShowcaseLocaleMeta(locale).shortLabel;
}

export function getShowcaseLocaleDirection(locale: ShowcaseLocale): 'ltr' | 'rtl' {
  return getShowcaseLocaleMeta(locale).direction;
}

export function groupShowcaseLocaleCatalog(): Array<{
  regionGroup: ShowcaseRegionGroup;
  label: string;
  locales: readonly ShowcaseLocaleMeta[];
}> {
  return SHOWCASE_REGION_GROUPS.map((regionGroup) => ({
    regionGroup,
    label: SHOWCASE_REGION_GROUP_LABELS[regionGroup],
    locales: SHOWCASE_LOCALE_CATALOG.filter((entry) => entry.regionGroup === regionGroup),
  })).filter((group) => group.locales.length > 0);
}
