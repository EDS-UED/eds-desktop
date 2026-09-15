import { getShowcaseLocaleResolutionChain } from './showcaseLocaleCatalog';
import {
  DEFAULT_SHOWCASE_LOCALE,
  resolveShowcaseI18nText,
  type ShowcaseChineseRegionalText,
} from './showcaseI18nText';
import { getShowcaseLocaleBundleText } from './showcaseLocaleBundle';
import { showcaseDisplayTextKey } from './showcaseTextKey';
import type { ShowcaseI18nText, ShowcaseLocale } from './types';

export type ShowcaseDisplayTextCatalogEntry = {
  key: string;
  en: string;
  'zh-CN': string;
  token?: string;
};

type RegisteredLabel = ShowcaseI18nText & {
  token?: string;
  bundleKey: string;
};

const labelRegistry = new Map<string, RegisteredLabel>();
const displayTextCatalog = new Map<string, ShowcaseDisplayTextCatalogEntry>();

function entryEnglishQuality(en: string): number {
  if (!en.trim()) return 0;
  return /[\u4e00-\u9fff]/.test(en) ? 1 : 2;
}

function shouldReplaceLabelEntry(existing: RegisteredLabel, incoming: RegisteredLabel): boolean {
  const existingScore = entryEnglishQuality(existing.en);
  const incomingScore = entryEnglishQuality(incoming.en);
  if (incomingScore > existingScore) return true;
  if (incomingScore < existingScore) return false;
  return true;
}

function registerLabelKeys(entry: RegisteredLabel, ...keys: string[]) {
  for (const key of keys) {
    if (!key) continue;
    const existing = labelRegistry.get(key);
    if (existing && !shouldReplaceLabelEntry(existing, entry)) continue;
    labelRegistry.set(key, entry);
  }
}

function isChineseLocale(locale: ShowcaseLocale): boolean {
  return locale === 'zh-CN' || locale === 'zh-TW' || locale === 'zh-HK';
}

function resolveRegisteredSemantic(entry: RegisteredLabel, locale: ShowcaseLocale): string {
  const isAuthoringLocale = locale === 'zh-CN' || locale === 'en-US';
  if (!isAuthoringLocale) {
    for (const step of getShowcaseLocaleResolutionChain(locale)) {
      const bundled = getShowcaseLocaleBundleText(entry.bundleKey, step);
      if (bundled) {
        return bundled;
      }
    }
  }
  return resolveShowcaseI18nText(entry, locale);
}

function formatTokenLabel(entry: RegisteredLabel, locale: ShowcaseLocale): string {
  const semantic = resolveRegisteredSemantic(entry, locale);
  return entry.token ? `${semantic} ${entry.token}` : semantic;
}

function registerDisplayCatalog(entry: RegisteredLabel) {
  if (displayTextCatalog.has(entry.bundleKey)) return;
  displayTextCatalog.set(entry.bundleKey, {
    key: entry.bundleKey,
    en: entry.en,
    'zh-CN': entry['zh-CN'],
    token: entry.token,
  });
}

function parseTokenLabel(raw: string): { semantic: string; token: string } | null {
  const spaceIndex = raw.lastIndexOf(' ');
  if (spaceIndex <= 0) return null;
  const semantic = raw.slice(0, spaceIndex);
  const token = raw.slice(spaceIndex + 1);
  if (!semantic || !token) return null;
  return { semantic, token };
}

/** Authoring 真源：注册 en + zh-CN，默认返回 zh-CN 字面量供 catalog / customize 静态定义。 */
export function showcaseText(
  en: string,
  zhCN: string,
  regional?: ShowcaseChineseRegionalText,
): string {
  const bundleKey = showcaseDisplayTextKey(en, zhCN);
  const entry: RegisteredLabel = {
    en,
    'en-US': en,
    'zh-CN': zhCN,
    'zh-HK': regional?.['zh-HK'],
    'zh-TW': regional?.['zh-TW'],
    bundleKey,
  };
  registerLabelKeys(entry, zhCN, en);
  registerDisplayCatalog(entry);
  return zhCN;
}

const TOKEN_SEMANTIC_EN: Record<string, string> = {
  disabled: 'Disabled',
  readonly: 'Readonly',
  '0': 'None',
};

/** §4.2 — 语义 + 英文 token；各 locale 输出对应语义 + token。 */
export function tokenLabel(enOrZh: string, zhCNOrToken: string, token?: string): string {
  if (token !== undefined) {
    const bundleKey = showcaseDisplayTextKey(enOrZh, zhCNOrToken, token);
    const entry: RegisteredLabel = {
      en: enOrZh,
      'en-US': enOrZh,
      'zh-CN': zhCNOrToken,
      token,
      bundleKey,
    };
    registerLabelKeys(entry, `${zhCNOrToken} ${token}`, `${enOrZh} ${token}`, zhCNOrToken, enOrZh);
    registerDisplayCatalog(entry);
    return `${zhCNOrToken} ${token}`;
  }

  const semantic = enOrZh;
  const valueToken = zhCNOrToken;
  const en = /[\u4e00-\u9fff]/.test(semantic)
    ? (TOKEN_SEMANTIC_EN[valueToken] ?? valueToken)
    : semantic;
  const zhCN = /[\u4e00-\u9fff]/.test(semantic) ? semantic : semantic;
  const bundleKey = showcaseDisplayTextKey(en, zhCN, valueToken);
  const entry: RegisteredLabel = {
    en,
    'en-US': en,
    'zh-CN': zhCN,
    token: valueToken,
    bundleKey,
  };
  registerLabelKeys(entry, `${zhCN} ${valueToken}`, `${en} ${valueToken}`, zhCN, en);
  registerDisplayCatalog(entry);
  return `${zhCN} ${valueToken}`;
}

export function registerShowcaseCountLabel(value: string, en: string, zhCN: string) {
  showcaseText(en, zhCN);
  const bundleKey = showcaseDisplayTextKey(en, zhCN);
  const entry: RegisteredLabel = { en, 'en-US': en, 'zh-CN': zhCN, bundleKey };
  registerLabelKeys(entry, `${value} 个`, `${value} items`, zhCN, en);
}

export function resolveShowcaseDisplayText(
  raw: string,
  locale: ShowcaseLocale = DEFAULT_SHOWCASE_LOCALE,
): string {
  if (!raw) return raw;

  const direct = labelRegistry.get(raw);
  if (direct) {
    return formatTokenLabel(direct, locale);
  }

  const parsed = parseTokenLabel(raw);
  if (parsed) {
    const semanticEntry =
      labelRegistry.get(parsed.semantic)
      ?? labelRegistry.get(`${parsed.semantic} ${parsed.token}`);
    if (semanticEntry) {
      return formatTokenLabel({ ...semanticEntry, token: parsed.token }, locale);
    }
  }

  if (isChineseLocale(locale)) {
    return raw;
  }

  return raw;
}

/** 预览下拉：中文 locale 取 token 前语义；其它 locale 同 resolveShowcaseDisplayText 后再截断。 */
export function resolveShowcaseGalleryLabel(
  raw: string,
  locale: ShowcaseLocale = DEFAULT_SHOWCASE_LOCALE,
): string {
  const resolved = resolveShowcaseDisplayText(raw, locale);
  const parsed = parseTokenLabel(resolved);
  if (parsed) return parsed.semantic;
  return resolved;
}

export function toShowcaseI18nText(raw: string): ShowcaseI18nText | undefined {
  return labelRegistry.get(raw);
}

export function getShowcaseDisplayTextCatalog(): ShowcaseDisplayTextCatalogEntry[] {
  return [...displayTextCatalog.values()].sort((a, b) => a.key.localeCompare(b.key));
}
