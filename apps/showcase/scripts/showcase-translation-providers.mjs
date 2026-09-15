/**
 * Showcase i18n 机器翻译 provider 组合（auto 默认）：
 * 1. DeepL — 凡支持的 locale 优先（需 DEEPL_API_KEY）
 * 2. Google Cloud Translation — DeepL 不支持或失败时降级
 * 3. Google GTX — 无 Cloud key 时的 unofficial fallback（translate.googleapis.com/client=gtx）
 * 4. MyMemory — 末位 fallback
 *
 * Env:
 *   DEEPL_API_KEY
 *   GOOGLE_TRANSLATE_API_KEY
 *   DEEPL_API_URL (optional, default auto free/pro)
 */

import { maskProtectedSegments, unmaskProtectedSegments } from './showcase-translation-glossary.mjs';

/** @typedef {'auto' | 'google' | 'deepl' | 'mymemory'} ProviderPreference */

/** @type {Record<string, string>} */
export const GOOGLE_TARGET_LANG = {
  ar: 'ar',
  'pl-PL': 'pl',
  'de-DE': 'de',
  'ru-RU': 'ru',
  'fr-FR': 'fr',
  'ko-KR': 'ko',
  'pt-BR': 'pt',
  'ja-JP': 'ja',
  'tr-TR': 'tr',
  'uk-UA': 'uk',
  'es-419': 'es',
  'es-ES': 'es',
  'it-IT': 'it',
  'hi-IN': 'hi',
  'id-ID': 'id',
  'ms-MY': 'ms',
  'vi-VN': 'vi',
  'th-TH': 'th',
  'nl-NL': 'nl',
  'fa-IR': 'fa',
};

/** DeepL 支持的 target locale（其余走 Google） */
/** @type {Record<string, string>} */
const DEEPL_TARGET_LANG = {
  ar: 'AR',
  'de-DE': 'DE',
  'fr-FR': 'FR',
  'es-ES': 'ES',
  'es-419': 'ES-419',
  'hi-IN': 'HI',
  'id-ID': 'ID',
  'it-IT': 'IT',
  'ja-JP': 'JA',
  'ko-KR': 'KO',
  'nl-NL': 'NL',
  'pl-PL': 'PL',
  'pt-BR': 'PT-BR',
  'ru-RU': 'RU',
  'th-TH': 'TH',
  'tr-TR': 'TR',
  'uk-UA': 'UK',
  'vi-VN': 'VI',
};

export const DEEPL_SUPPORTED_LOCALES = new Set(Object.keys(DEEPL_TARGET_LANG));

export function deeplCoversLocale(locale) {
  return DEEPL_SUPPORTED_LOCALES.has(locale);
}

/** @type {Record<string, string>} */
const MYMEMORY_LANG = { ...GOOGLE_TARGET_LANG };

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function hasGoogleCredentials() {
  return Boolean(process.env.GOOGLE_TRANSLATE_API_KEY?.trim());
}

export function hasDeepLCredentials() {
  return Boolean(process.env.DEEPL_API_KEY?.trim());
}

/**
 * @param {string} locale
 * @param {ProviderPreference} preference
 * @returns {'google' | 'deepl' | 'mymemory'}
 */
export function resolveMachineProvider(locale, preference = 'auto') {
  if (preference === 'google' && hasGoogleCredentials()) return 'google';
  if (preference === 'deepl' && hasDeepLCredentials() && deeplCoversLocale(locale)) return 'deepl';
  if (preference === 'mymemory') return 'mymemory';

  if (preference !== 'auto' && preference !== 'google' && preference !== 'deepl') {
    return 'mymemory';
  }

  // auto：DeepL 质量优先，仅 DeepL 不覆盖的 locale 才默认 Google
  if (deeplCoversLocale(locale) && hasDeepLCredentials()) return 'deepl';
  if (hasGoogleCredentials()) return 'google';
  return 'google-gtx';
}

export function describeProviderPlan(locales, preference = 'auto') {
  const plan = new Map();
  for (const locale of locales) {
    if (locale === 'zh-TW' || locale === 'zh-HK') continue;
    const provider = resolveMachineProvider(locale, preference);
    plan.set(locale, provider);
  }
  return plan;
}

function deeplApiBase() {
  if (process.env.DEEPL_API_URL) return process.env.DEEPL_API_URL.replace(/\/$/, '');
  const key = process.env.DEEPL_API_KEY ?? '';
  return key.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com';
}

/**
 * @param {string[]} texts
 * @param {string} locale
 * @param {number} attempt
 */
async function translateGoogleBatch(texts, locale, attempt = 0) {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!key) throw new Error('Missing GOOGLE_TRANSLATE_API_KEY');

  const target = GOOGLE_TARGET_LANG[locale];
  if (!target) throw new Error(`No Google target for ${locale}`);

  const url = new URL('https://translation.googleapis.com/language/translate/v2');
  url.searchParams.set('key', key);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: texts,
      source: 'en',
      target,
      format: 'text',
    }),
  });

  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    await sleep(1500 * (attempt + 1));
    return translateGoogleBatch(texts, locale, attempt + 1);
  }
  if (!res.ok) throw new Error(`Google HTTP ${res.status}`);

  const json = await res.json();
  const translations = json?.data?.translations;
  if (!Array.isArray(translations) || translations.length !== texts.length) {
    throw new Error('Google batch size mismatch');
  }

  return translations.map((item) => item?.translatedText?.trim() ?? '');
}

/**
 * @param {string[]} texts
 * @param {string} locale
 * @param {number} attempt
 */
async function translateDeepLBatch(texts, locale, attempt = 0) {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error('Missing DEEPL_API_KEY');

  const target = DEEPL_TARGET_LANG[locale];
  if (!target) throw new Error(`DeepL does not cover ${locale}`);

  const body = new URLSearchParams();
  body.set('source_lang', 'EN');
  body.set('target_lang', target);
  for (const text of texts) {
    body.append('text', text);
  }

  const res = await fetch(`${deeplApiBase()}/v2/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `DeepL-Auth-Key ${key}`,
    },
    body,
  });

  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    await sleep(1500 * (attempt + 1));
    return translateDeepLBatch(texts, locale, attempt + 1);
  }
  if (!res.ok) throw new Error(`DeepL HTTP ${res.status}`);

  const json = await res.json();
  const translations = json?.translations;
  if (!Array.isArray(translations) || translations.length !== texts.length) {
    throw new Error('DeepL batch size mismatch');
  }

  return translations.map((item) => item?.text?.trim() ?? '');
}

/**
 * @param {string} text
 * @param {string} locale
 * @param {number} attempt
 */
/**
 * Unofficial Google Translate（无需 API key；DeepL 不支持 locale 的主选）
 * @param {string} text
 * @param {string} locale
 * @param {number} attempt
 */
const GOOGLE_GTX_CLIENTS = ['dict-chrome-ex', 'anim-ex', 'gtx'];

async function translateGoogleGtx(text, locale, attempt = 0) {
  const target = GOOGLE_TARGET_LANG[locale];
  if (!target) throw new Error(`No Google target for ${locale}`);

  const client = GOOGLE_GTX_CLIENTS[attempt % GOOGLE_GTX_CLIENTS.length];
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.searchParams.set('client', client);
  url.searchParams.set('sl', 'en');
  url.searchParams.set('tl', target);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', text);

  const res = await fetch(url);
  if ((res.status === 429 || res.status >= 500) && attempt < 12) {
    const waitMs = Math.min(30_000, 1_000 * 2 ** attempt);
    await sleep(waitMs);
    return translateGoogleGtx(text, locale, attempt + 1);
  }
  if (!res.ok) throw new Error(`Google GTX HTTP ${res.status} (${client})`);

  const json = await res.json();
  const translated = json?.[0]?.map((segment) => segment?.[0] ?? '').join('').trim();
  if (!translated) throw new Error('empty Google GTX translation');
  return translated;
}

/**
 * @param {string[]} texts
 * @param {string} locale
 */
async function translateGoogleGtxBatch(texts, locale) {
  const gtxDelay = Number(process.env.GTX_DELAY ?? 150);
  const translated = [];
  for (const text of texts) {
    translated.push(await translateGoogleGtx(text, locale));
    if (gtxDelay > 0) await sleep(gtxDelay);
  }
  return translated;
}

async function translateMyMemory(text, locale, attempt = 0) {
  const target = MYMEMORY_LANG[locale];
  if (!target) throw new Error(`No MyMemory lang for ${locale}`);

  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text.slice(0, 480));
  url.searchParams.set('langpair', `en|${target}`);
  url.searchParams.set('de', process.env.MYMEMORY_CONTACT ?? 'showcase@eds.local');

  const res = await fetch(url);
  if (res.status === 429 && attempt < 6) {
    await sleep(3000 * (attempt + 1));
    return translateMyMemory(text, locale, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  const translated = json?.responseData?.translatedText?.trim();
  if (!translated || translated === text) {
    throw new Error(json?.responseDetails || 'empty translation');
  }
  return translated;
}

/**
 * @param {'google' | 'deepl' | 'google-gtx' | 'mymemory'} provider
 * @param {string[]} texts
 * @param {string} locale
 */
async function translateBatchWithProvider(provider, texts, locale) {
  if (!texts.length) return [];

  const masks = texts.map((text) => maskProtectedSegments(text));
  const payload = masks.map((item) => item.masked);

  /** @type {string[]} */
  let translated;

  if (provider === 'google') {
    translated = await translateGoogleBatch(payload, locale);
  } else if (provider === 'deepl') {
    translated = await translateDeepLBatch(payload, locale);
  } else if (provider === 'google-gtx') {
    translated = await translateGoogleGtxBatch(payload, locale);
  } else {
    translated = [];
    for (const text of payload) {
      translated.push(await translateMyMemory(text, locale));
    }
  }

  return translated.map((text, index) => unmaskProtectedSegments(text, masks[index].tokens));
}

export async function translateBatch(provider, texts, locale) {
  return translateBatchWithProvider(provider, texts, locale);
}

/**
 * @param {string[]} texts
 * @param {string} locale
 * @param {ProviderPreference} preference
 * @returns {Promise<{ provider: string, texts: string[] }>}
 */
export async function translateBatchWithFallback(texts, locale, preference = 'auto') {
  /** @type {('deepl' | 'google' | 'google-gtx' | 'mymemory')[]} */
  const chain = [];

  if (preference === 'deepl') {
    if (deeplCoversLocale(locale) && hasDeepLCredentials()) chain.push('deepl');
  } else if (preference === 'google') {
    if (hasGoogleCredentials()) chain.push('google');
    else chain.push('google-gtx');
  } else if (preference === 'mymemory') {
    chain.push('mymemory');
  } else {
    if (deeplCoversLocale(locale) && hasDeepLCredentials()) chain.push('deepl');
    if (hasGoogleCredentials()) chain.push('google');
    chain.push('google-gtx');
    chain.push('mymemory');
  }

  const providers = [...new Set(chain)];
  let lastError;

  for (const provider of providers) {
    try {
      const translated = await translateBatchWithProvider(provider, texts, locale);
      return { provider, texts: translated };
    } catch (error) {
      lastError = error;
      if (providers.length > 1) {
        console.warn(`  ${provider} failed → next provider (${error.message})`);
      }
    }
  }

  throw lastError ?? new Error('No translation provider available');
}

export function cacheKeyForProvider(locale, text, provider) {
  if (provider === 'mymemory') return `${locale}::${text}`;
  return `${locale}:${provider}::${text}`;
}

export function readCachedTranslation(cache, locale, text, provider) {
  return (
    cache[cacheKeyForProvider(locale, text, provider)]
    ?? (provider !== 'mymemory' ? cache[`${locale}::${text}`] : undefined)
  );
}
