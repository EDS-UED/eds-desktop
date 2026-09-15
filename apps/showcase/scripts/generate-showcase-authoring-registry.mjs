#!/usr/bin/env node
/**
 * 扫描 Showcase authoring 中的中文用户可见串 → 生成 showcaseAuthoringRegistry.ts
 * 运行：pnpm i18n:registry
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { translateShowcaseDocZh } from './local-zh-to-en-doc.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(showcaseRoot, 'src');
const i18nRoot = path.join(srcRoot, 'data/i18n');
const outPath = path.join(i18nRoot, 'showcaseAuthoringRegistry.ts');
const sourcesPath = path.join(i18nRoot, 'locales/_meta/sources.json');

const SKIP_DIRS = new Set(['locales', 'node_modules']);
const SKIP_FILES = new Set([
  'showcaseAuthoringRegistry.ts',
  'showcaseDocCommonLabels.ts',
  'toZhHant.ts',
  'showcaseLocaleCatalog.ts',
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
      continue;
    }
    if (!/\.(ts|vue)$/.test(entry.name) || SKIP_FILES.has(entry.name)) continue;
    files.push(full);
  }
  return files;
}

function unescapeString(raw) {
  return raw.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
}

function hasCjk(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function isLowQualityEnglish(en, zh) {
  if (!en?.trim()) return true;
  if (en === zh) return true;
  return hasCjk(en);
}

/** 从已有 authoring 提取 en↔zh 映射 */
function collectKnownPairs() {
  const pairs = new Map();

  function addPair(en, zh) {
    if (!zh || !en || isLowQualityEnglish(en, zh)) return;
    const existing = pairs.get(zh);
    if (!existing || isLowQualityEnglish(existing, zh)) {
      pairs.set(zh, en);
    }
  }

  const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
  for (const entry of sources.entries ?? []) {
    addPair(entry['en-US'], entry['zh-CN']);
  }

  for (const rel of [
    'data/showcasePropLabels.ts',
    'data/i18n/showcaseDemoText.ts',
    'data/i18n/showcaseI18nOverrides.ts',
    'data/i18n/showcaseDocCommonLabels.ts',
  ]) {
    const src = fs.readFileSync(path.join(srcRoot, rel), 'utf8');
    const textRe = /showcaseText\(\s*'((?:\\'|[^'])*)'\s*,\s*'((?:\\'|[^'])*)'/g;
    let match;
    while ((match = textRe.exec(src))) {
      addPair(unescapeString(match[1]), unescapeString(match[2]));
    }
    const defineRe =
      /define(?:ShowcaseI18nText|ComponentName)\(\s*'((?:\\'|[^'])*)'\s*,\s*'((?:\\'|[^'])*)'/g;
    while ((match = defineRe.exec(src))) {
      addPair(unescapeString(match[1]), unescapeString(match[2]));
    }
  }

  return pairs;
}

/** 代码片段字段 — 保留中文真源，不走 display 注册 */
const CODE_FIELD_RE = /\b(?:code|importCode|heroCode|usageCode|snippet):\s*[`'"]/;

const FIELD_KEYS = [
  'description',
  'label',
  'title',
  'previewLabel',
  'defaultValue',
  'placeholder',
  'message',
  'heading',
  'name',
];

const FIELD_PATTERNS = [
  ...FIELD_KEYS.map(
    (key) => new RegExp(`\\b${key}:\\s*'((?:\\\\'|[^'])*)'`, 'g'),
  ),
  ...FIELD_KEYS.map(
    (key) => new RegExp(`\\b${key}:\\s*\\n\\s*'((?:\\\\'|[^'])*)'`, 'g'),
  ),
  /\baria-label="((?:\\"|[^"])*)"/g,
  /placeholder="((?:\\"|[^"])*)"/g,
  /model-value="((?:\\"|[^"])*)"/g,
  /title="((?:\\"|[^"])*)"/g,
  /sceneProp\(\s*'(?:\\'|[^']*)'\s*,\s*'(?:\\'|[^']*)'\s*,\s*'(?:\\'|[^']*)'\s*,\s*'((?:\\'|[^'])*)'\s*\)/g,
];

function shouldSkipExtractedString(value) {
  if (!value || value.length > 240) return true;
  if (value.includes('\n')) return true;
  if (/^\[doc\]/i.test(value)) return true;
  if (/\$\{/.test(value)) return true;
  if (/^`/.test(value.trim())) return true;
  if (/<\/?[A-Za-z]/.test(value)) return true;
  return false;
}

function extractChineseStrings(filePath, content) {
  const found = new Set();
  const rel = path.relative(srcRoot, filePath);

  if (rel === 'data/components/catalog.ts') {
    return found;
  }

  if (/showcaseText\s*\(/.test(content)) {
    content = content.replace(
      /showcaseText\(\s*'(?:\\'|[^'])*'\s*,\s*'(?:\\'|[^'])*'\s*(?:,\s*\{[^}]*\})?\)/g,
      '',
    );
  }

  if (CODE_FIELD_RE.test(content)) {
    content = content.replace(/^.*\b(?:code|importCode|heroCode|usageCode|snippet):.*$/gm, '');
  }

  for (const re of FIELD_PATTERNS) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(content))) {
      const value = unescapeString(match[1]);
      if (!hasCjk(value) || shouldSkipExtractedString(value)) continue;
      found.add(value);
    }
  }

  // template text nodes: >中文<
  const textNodeRe = />([^<>{}\n]*[\u4e00-\u9fff][^<>{}\n]*)</g;
  let nodeMatch;
  while ((nodeMatch = textNodeRe.exec(content))) {
    const text = nodeMatch[1].trim();
    if (text && hasCjk(text) && text.length < 120) found.add(text);
  }

  return found;
}

function escapeForTsSingleQuote(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function inferEnglish(zh, knownPairs) {
  if (knownPairs.has(zh)) return knownPairs.get(zh);
  return null;
}

const cachePath = path.join(i18nRoot, 'locales/_meta/authoring-en-cache.json');

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateZhToEn(text, attempt = 0) {
  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text.slice(0, 450));
  url.searchParams.set('langpair', 'zh-CN|en');
  url.searchParams.set('de', 'danbaby@local.dev');

  const res = await fetch(url);
  if (res.status === 429 && attempt < 5) {
    await sleep(2500 * (attempt + 1));
    return translateZhToEn(text, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const translated = json?.responseData?.translatedText?.trim();
  if (!translated || hasCjk(translated)) {
    throw new Error(json?.responseDetails || 'empty translation');
  }
  return translated;
}

function parseArgs(argv) {
  const args = { translate: false, delay: 600 };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--translate') args.translate = true;
    else if (argv[i] === '--delay') args.delay = Number(argv[++i]);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const knownPairs = collectKnownPairs();
  const discovered = new Map();

  for (const file of walk(srcRoot)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const zh of extractChineseStrings(file, content)) {
      if (!discovered.has(zh)) {
        discovered.set(zh, inferEnglish(zh, knownPairs));
      }
    }
  }

  const auditCache = readJson(
    path.join(i18nRoot, 'locales/_meta/zh-strings-audit.json'),
    { strings: [] },
  );
  const enCache = readJson(cachePath, {});
  // 保留 audit 全量 cache，扫描只增量补充
  for (const { zh } of auditCache.strings ?? []) {
    if (!enCache[zh] || isLowQualityEnglish(enCache[zh], zh)) {
      const local = translateShowcaseDocZh(zh);
      if (local && !isLowQualityEnglish(local, zh)) enCache[zh] = local;
    }
  }
  const registered = [];
  const skipped = [];

  const sorted = [...discovered.entries()].sort((a, b) => a[0].localeCompare(b[0], 'zh-CN'));

  for (const [zh, knownEn] of sorted) {
    let en = knownEn && !isLowQualityEnglish(knownEn, zh) ? knownEn : enCache[zh];

    if ((!en || isLowQualityEnglish(en, zh)) && args.translate) {
      try {
        en = await translateZhToEn(zh);
        enCache[zh] = en;
        writeJson(cachePath, enCache);
        await sleep(args.delay);
      } catch (error) {
        console.warn(`translate skip: ${zh.slice(0, 40)}… (${error.message})`);
      }
    }

    if (!en || isLowQualityEnglish(en, zh)) {
      const local = translateShowcaseDocZh(zh);
      if (local && !isLowQualityEnglish(local, zh)) {
        en = local;
        enCache[zh] = local;
      }
    }

    if (en && !isLowQualityEnglish(en, zh)) {
      registered.push({ en, zh });
    } else {
      skipped.push(zh);
    }
  }

  const lines = [
    '/** Auto-generated by scripts/generate-showcase-authoring-registry.mjs — do not edit manually. */',
    "import { showcaseText } from './showcaseDisplayText';",
    '',
    `// Registered: ${registered.length}; skipped (no en): ${skipped.length}`,
    '',
  ];

  for (const { en, zh } of registered) {
    lines.push(`showcaseText('${escapeForTsSingleQuote(en)}', '${escapeForTsSingleQuote(zh)}');`);
  }

  writeJson(cachePath, enCache);

  // 启动时全量注册 cache（含 codemod 前扫描条目），避免 lazy import 漏注册
  const bootPairs = [];
  for (const [zh, en] of Object.entries(enCache).sort((a, b) => a[0].localeCompare(b[0], 'zh-CN'))) {
    if (shouldSkipExtractedString(zh) || shouldSkipExtractedString(en)) {
      delete enCache[zh];
      continue;
    }
    if (en && !isLowQualityEnglish(en, zh)) {
      bootPairs.push({ en, zh });
    }
  }

  const bootLines = [
    '/** Auto-generated by scripts/generate-showcase-authoring-registry.mjs — do not edit manually. */',
    "import { showcaseText } from './showcaseDisplayText';",
    '',
    `// Boot registry from authoring-en-cache.json: ${bootPairs.length} pairs`,
    '',
  ];
  for (const { en, zh } of bootPairs) {
    bootLines.push(`showcaseText('${escapeForTsSingleQuote(en)}', '${escapeForTsSingleQuote(zh)}');`);
  }
  fs.writeFileSync(outPath, `${bootLines.join('\n')}\n`);
  console.log(`Wrote boot ${bootPairs.length} pairs; scan ${registered.length}; skipped ${skipped.length} → ${outPath}`);
  if (skipped.length && !args.translate) {
    console.log('Re-run with --translate to machine-fill missing English via MyMemory.');
  }
}

await main();
