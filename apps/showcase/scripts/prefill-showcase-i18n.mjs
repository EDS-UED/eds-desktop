#!/usr/bin/env node
/**
 * 机器预填 Showcase locale bundle（en-US / zh-CN 真源 → 其它 22 locale）
 *
 * Provider 组合（--provider auto，默认）：
 *   zh-TW / zh-HK → hant 规则
 *   DeepL 支持的 locale → DeepL 优先（DEEPL_API_KEY）
 *   DeepL 失败或不支持 → Google（GOOGLE_TRANSLATE_API_KEY）
 *   无付费 key → MyMemory fallback
 *
 * Env:
 *   GOOGLE_TRANSLATE_API_KEY — Google Cloud Translation API key
 *   DEEPL_API_KEY — DeepL API key（:fx 结尾走 free endpoint）
 *   DEEPL_API_URL — 可选，覆盖 DeepL base URL
 *
 * 运行：
 *   pnpm i18n:prefill [--locale ja-JP] [--provider auto|google|deepl|mymemory] [--batch 50] [--force]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  applyRegionalAdaptation,
  toZhHantHK,
  toZhHantTW,
} from './showcase-locale-regional.mjs';
import {
  cacheKeyForProvider,
  describeProviderPlan,
  hasDeepLCredentials,
  hasGoogleCredentials,
  deeplCoversLocale,
  readCachedTranslation,
  resolveMachineProvider,
  translateBatchWithFallback,
} from './showcase-translation-providers.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, '..');
const i18nRoot = path.join(showcaseRoot, 'src/data/i18n');
const metaDir = path.join(i18nRoot, 'locales/_meta');
const sourcesPath = path.join(metaDir, 'sources.json');
const reviewPath = path.join(metaDir, 'review.json');
const cachePath = path.join(metaDir, 'translation-cache.json');

const SOURCE_LOCALES = new Set(['zh-CN', 'en-US']);

const TARGET_LOCALES = [
  'ar', 'pl-PL', 'de-DE', 'ru-RU', 'fr-FR', 'zh-TW', 'zh-HK', 'ko-KR', 'pt-BR', 'ja-JP',
  'tr-TR', 'uk-UA', 'es-419', 'es-ES', 'it-IT', 'hi-IN', 'id-ID', 'ms-MY', 'vi-VN', 'th-TH',
  'nl-NL', 'fa-IR',
];

function parseArgs(argv) {
  const args = {
    locales: TARGET_LOCALES,
    delay: 200,
    batch: 50,
    dryRun: false,
    force: false,
    mode: 'machine',
    provider: 'auto',
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--locale') args.locales = [argv[++i]];
    else if (arg === '--delay') args.delay = Number(argv[++i]);
    else if (arg === '--batch') args.batch = Number(argv[++i]);
    else if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--force') args.force = true;
    else if (arg === '--mode') args.mode = argv[++i];
    else if (arg === '--provider') args.provider = argv[++i];
  }
  return args;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function isStaleDraft(bundleValue, entry) {
  if (!bundleValue) return true;
  return bundleValue === entry['en-US'] || bundleValue === entry['zh-CN'];
}

function translateHant(sourceText, locale) {
  return locale === 'zh-HK' ? toZhHantHK(sourceText) : toZhHantTW(sourceText);
}

function formatEntryValue(entry, semantic) {
  if (entry.token) return `${semantic} ${entry.token}`;
  return semantic;
}

function reviewSourceForMode(mode, locale, provider) {
  if (mode === 'hant') return locale === 'zh-HK' ? 'hant-hk' : 'hant-tw';
  if (mode === 'copy') return 'author';
  return provider;
}

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function translateHantEntry(sourceText, locale, cache) {
  const legacyKey = `${locale}::${sourceText}`;
  const hit = cache[legacyKey];
  if (hit) return { text: hit, fromCache: true };

  const hant = translateHant(sourceText, locale);
  cache[legacyKey] = hant;
  return { text: hant, fromCache: false };
}

async function fillMachineLocale({
  args,
  locale,
  sources,
  bundle,
  bundlePath,
  review,
  cache,
  now,
  esEsBundle,
}) {
  const provider = resolveMachineProvider(locale, args.provider);
  const batchSize = provider === 'mymemory' || provider === 'google-gtx'
    ? 1
    : Math.max(1, args.batch);
  let translatedCount = 0;
  let skippedCount = 0;
  let fallbackCount = 0;

  /** @type {{ entry: object, sourceText: string, esEsBase?: string }[]} */
  const pending = [];

  for (const entry of sources.entries) {
    const existingReview = review[entry.key]?.[locale];
    const existingValue = bundle[entry.key];

    if (!args.force && existingReview?.status === 'approved' && existingValue) {
      skippedCount += 1;
      continue;
    }
    if (!args.force && existingValue && !isStaleDraft(existingValue, entry)) {
      skippedCount += 1;
      continue;
    }

    const sourceText = entry['en-US'];
    const cached = readCachedTranslation(cache, locale, sourceText, provider);
    if (cached) {
      const esEsBase =
        locale === 'es-419' && esEsBundle[entry.key]
          ? esEsBundle[entry.key].replace(/\s+\S+$/, (m) => m).trim()
          : undefined;
      const semantic = applyRegionalAdaptation(locale, cached, { esEsBase });
      bundle[entry.key] = formatEntryValue(entry, semantic);
      review[entry.key] ??= {};
      if (review[entry.key][locale]?.status !== 'approved') {
        review[entry.key][locale] = {
          status: 'translated',
          prefilledAt: now,
          source: provider,
        };
      }
      translatedCount += 1;
      continue;
    }

    pending.push({
      entry,
      sourceText,
      esEsBase:
        locale === 'es-419' && esEsBundle[entry.key]
          ? esEsBundle[entry.key].replace(/\s+\S+$/, (m) => m).trim()
          : undefined,
    });
  }

  if (args.dryRun) {
    return {
      translatedCount: pending.length,
      skippedCount,
      fallbackCount: 0,
      provider,
    };
  }

  async function applyBatchResult(batch, result) {
    const usedProvider = result.provider;
    for (let index = 0; index < batch.length; index += 1) {
      const item = batch[index];
      let semantic = result.texts[index] || item.sourceText;
      semantic = applyRegionalAdaptation(locale, semantic, { esEsBase: item.esEsBase });
      cache[cacheKeyForProvider(locale, item.sourceText, usedProvider)] = semantic;
      bundle[item.entry.key] = formatEntryValue(item.entry, semantic);
      review[item.entry.key] ??= {};
      if (review[item.entry.key][locale]?.status !== 'approved') {
        review[item.entry.key][locale] = {
          status: 'translated',
          prefilledAt: now,
          source: usedProvider,
        };
      }
      translatedCount += 1;
    }
    if (!args.dryRun) {
      writeJson(cachePath, cache);
      writeJson(bundlePath, bundle);
      writeJson(reviewPath, review);
    }
  }

  for (const batch of chunkArray(pending, batchSize)) {
    const rawTexts = batch.map((item) => item.sourceText);
    let result;
    try {
      result = await translateBatchWithFallback(rawTexts, locale, args.provider);
    } catch (error) {
      if (String(error.message).includes('429')) {
        console.warn(`  rate limited — cooling down 90s (${batch[0]?.entry.key})`);
        await sleep(90_000);
        try {
          result = await translateBatchWithFallback(rawTexts, locale, args.provider);
        } catch (retryError) {
          error = retryError;
        }
      }
      if (!result) {
        for (const item of batch) {
          console.warn(`  fallback ${item.entry.key}: ${error.message}`);
          bundle[item.entry.key] = formatEntryValue(item.entry, item.sourceText);
          review[item.entry.key] ??= {};
          if (review[item.entry.key][locale]?.status !== 'approved') {
            review[item.entry.key][locale] = {
              status: 'translated',
              prefilledAt: now,
              source: 'fallback-en',
            };
          }
          fallbackCount += 1;
          translatedCount += 1;
        }
        if (!args.dryRun) {
          writeJson(bundlePath, bundle);
          writeJson(reviewPath, review);
        }
        continue;
      }
    }

    await applyBatchResult(batch, result);
    if (args.delay > 0) await sleep(args.delay);
  }

  return { translatedCount, skippedCount, fallbackCount, provider };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sources = readJson(sourcesPath, null);
  if (!sources?.entries?.length) {
    console.error('Missing sources.json — run pnpm i18n:extract first');
    process.exit(1);
  }

  const machineLocales = args.locales.filter(
    (locale) => !SOURCE_LOCALES.has(locale) && locale !== 'zh-TW' && locale !== 'zh-HK',
  );
  const plan = describeProviderPlan(machineLocales, args.provider);

  console.log(
    `Providers: google=${hasGoogleCredentials() ? 'yes' : 'no'}, `
      + `deepl=${hasDeepLCredentials() ? 'yes' : 'no'}, preference=${args.provider}`,
  );
  if (plan.size) {
    const deeplFirst = machineLocales.filter((locale) => deeplCoversLocale(locale));
    const googleOnly = machineLocales.filter((locale) => !deeplCoversLocale(locale));
    if (deeplFirst.length && hasDeepLCredentials()) {
      console.log(`  DeepL first → ${deeplFirst.join(', ')} (fail → Google)`);
    }
    if (googleOnly.length && hasGoogleCredentials()) {
      console.log(`  Google only → ${googleOnly.join(', ')}`);
    }
    if (!hasDeepLCredentials() && !hasGoogleCredentials()) {
      console.warn(`  MyMemory fallback for all machine locales (set DEEPL / GOOGLE keys)`);
    }
  }

  const review = readJson(reviewPath, {});
  const cache = readJson(cachePath, {});
  const now = new Date().toISOString();

  for (const locale of args.locales) {
    if (SOURCE_LOCALES.has(locale)) continue;

    const mode =
      args.mode === 'hant'
        ? 'hant'
        : args.mode === 'copy'
          ? 'copy'
          : locale === 'zh-TW' || locale === 'zh-HK'
            ? 'hant'
            : 'machine';

    if (mode === 'hant' && locale !== 'zh-TW' && locale !== 'zh-HK') continue;
    if (mode === 'copy' && (locale === 'zh-TW' || locale === 'zh-HK')) continue;

    const bundlePath = path.join(i18nRoot, 'locales', locale, 'showcase.json');
    const bundle = args.force ? {} : readJson(bundlePath, {});
    const esEsBundle = locale === 'es-419'
      ? readJson(path.join(i18nRoot, 'locales/es-ES/showcase.json'), {})
      : {};

    console.log(`\n[${locale}] mode=${mode} ${sources.entries.length} entries…`);

    let translatedCount = 0;
    let skippedCount = 0;
    let provider = args.provider;

    if (mode === 'machine') {
      const result = await fillMachineLocale({
        args,
        locale,
        sources,
        bundle,
        bundlePath,
        review,
        cache,
        now,
        esEsBundle,
      });
      translatedCount = result.translatedCount;
      skippedCount = result.skippedCount;
      provider = result.provider;
      if (result.fallbackCount) {
        console.warn(`  ${result.fallbackCount} entries fell back to en-US`);
      }
      console.log(`  provider=${provider}, batch=${args.batch}, delay=${args.delay}ms`);
    } else {
      for (const entry of sources.entries) {
        const existingReview = review[entry.key]?.[locale];
        const existingValue = bundle[entry.key];

        if (!args.force && existingReview?.status === 'approved' && existingValue) {
          skippedCount += 1;
          continue;
        }
        if (!args.force && existingValue && !isStaleDraft(existingValue, entry)) {
          skippedCount += 1;
          continue;
        }

        const sourceText = mode === 'hant' ? entry['zh-CN'] : entry['en-US'];
        let semantic = sourceText;

        if (mode === 'hant') {
          const result = await translateHantEntry(sourceText, locale, cache);
          semantic = result.text;
        }

        bundle[entry.key] = formatEntryValue(entry, semantic);
        review[entry.key] ??= {};
        if (review[entry.key][locale]?.status !== 'approved') {
          review[entry.key][locale] = {
            status: mode === 'copy' ? 'draft' : 'translated',
            prefilledAt: now,
            source: reviewSourceForMode(mode, locale, provider),
          };
        }
        translatedCount += 1;
      }

      if (!args.dryRun && mode === 'hant') writeJson(cachePath, cache);
    }

    if (!args.dryRun) {
      writeJson(bundlePath, bundle);
      writeJson(reviewPath, review);
    }

    console.log(`[${locale}] done — filled ${translatedCount}, skipped ${skippedCount}`);
  }

  if (!args.dryRun) {
    writeJson(cachePath, cache);
    writeJson(reviewPath, review);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
