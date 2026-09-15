#!/usr/bin/env node
/**
 * 从 Showcase authoring 真源提取可翻译条目 → locales/_meta/sources.json
 * 运行：pnpm i18n:showcase:extract
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const showcaseRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(showcaseRoot, 'src');
const i18nRoot = path.join(srcRoot, 'data/i18n');
const outPath = path.join(i18nRoot, 'locales/_meta/sources.json');

function showcaseDisplayTextKey(en, zhCN, token) {
  const basis = token ? `${en}\0${zhCN}\0${token}` : `${en}\0${zhCN}`;
  let hash = 0;
  for (let i = 0; i < basis.length; i += 1) {
    hash = (hash * 31 + basis.charCodeAt(i)) >>> 0;
  }
  return `display.${hash.toString(16)}`;
}

function read(file) {
  return fs.readFileSync(path.join(i18nRoot, file), 'utf8');
}

function unescapeString(raw) {
  return raw.replace(/\\'/g, "'").replace(/\\n/g, '\n');
}

function isLowQualityDisplayEntry(en, zh) {
  if (!en?.trim() || en === zh) return true;
  return /[\u4e00-\u9fff]/.test(en);
}

function addEntry(map, entry) {
  if (!entry.key || !entry['en-US'] || !entry['zh-CN']) return;
  const existing = map.get(entry.key);
  if (existing) {
    if (isLowQualityDisplayEntry(existing['en-US'], existing['zh-CN']) && !isLowQualityDisplayEntry(entry['en-US'], entry['zh-CN'])) {
      map.set(entry.key, entry);
    }
    return;
  }
  map.set(entry.key, entry);
}

function walkTs(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'locales' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTs(full, files);
    else if (/\.ts$/.test(entry.name)) files.push(full);
  }
  return files;
}

function scanShowcaseTextFromFile(src, filePath, entries) {
  const isDocCommon = filePath.endsWith('showcaseDocCommonLabels.ts');
  const textRe = /showcaseText\(\s*'((?:\\'|[^'])*)'\s*,\s*'((?:\\'|[^'])*)'/g;
  let match;
  while ((match = textRe.exec(src))) {
    const en = unescapeString(match[1]);
    const zh = unescapeString(match[2]);
    if (isDocCommon && isLowQualityDisplayEntry(en, zh)) continue;
    addEntry(entries, {
      key: showcaseDisplayTextKey(en, zh),
      namespace: 'display',
      'en-US': en,
      'zh-CN': zh,
    });
  }

  const tokenRe = /tokenLabel\(\s*'((?:\\'|[^'])*)'\s*,\s*'((?:\\'|[^'])*)'\s*,\s*'((?:\\'|[^'])*)'/g;
  while ((match = tokenRe.exec(src))) {
    const en = unescapeString(match[1]);
    const zh = unescapeString(match[2]);
    const token = unescapeString(match[3]);
    addEntry(entries, {
      key: showcaseDisplayTextKey(en, zh, token),
      namespace: 'display',
      'en-US': en,
      'zh-CN': zh,
      token,
    });
  }
}

const entries = new Map();

/** registry overrides */
const overridesSrc = read('showcaseI18nOverrides.ts');
const overrideKeyRe = /'([^']+)':\s*(?:define(?:ShowcaseI18nText|ComponentName)\(|{)/g;
let match;
while ((match = overrideKeyRe.exec(overridesSrc))) {
  const key = match[1];
  const blockStart = overridesSrc.indexOf(match[0], match.index);
  const block = overridesSrc.slice(blockStart, blockStart + 800);
  const enMatch = block.match(/defineShowcaseI18nText\(\s*'((?:\\'|[^'])*)'\s*,\s*'((?:\\'|[^'])*)'/);
  const nameEnMatch =
    block.match(/name:\s*defineComponentName\(\s*'((?:\\'|[^'])*)'\s*,\s*'((?:\\'|[^'])*)'/)
    ?? block.match(/defineComponentName\(\s*'((?:\\'|[^'])*)'\s*,\s*'((?:\\'|[^'])*)'/);
  const descMatch = block.match(/description:\s*defineShowcaseI18nText\(\s*'((?:\\'|[^'])*)'\s*,\s*'((?:\\'|[^'])*)'/);

  if (enMatch) {
    addEntry(entries, {
      key,
      namespace: key.split(':')[0] ?? 'misc',
      'en-US': unescapeString(enMatch[1]),
      'zh-CN': unescapeString(enMatch[2]),
    });
  } else if (nameEnMatch) {
    addEntry(entries, {
      key,
      namespace: key.split(':')[0] ?? 'misc',
      'en-US': unescapeString(nameEnMatch[1]),
      'zh-CN': unescapeString(nameEnMatch[2]),
    });
  }

  if (descMatch) {
    addEntry(entries, {
      key: `${key}:description`,
      namespace: key.split(':')[0] ?? 'misc',
      'en-US': unescapeString(descMatch[1]),
      'zh-CN': unescapeString(descMatch[2]),
    });
  }
}

/** 全仓扫描 showcaseText / tokenLabel */
for (const file of walkTs(srcRoot)) {
  if (file.endsWith('showcaseAuthoringRegistry.ts')) continue;
  scanShowcaseTextFromFile(fs.readFileSync(file, 'utf8'), file, entries);
}

/** authoring-en-cache 补全 display 条目 */
const cachePath = path.join(i18nRoot, 'locales/_meta/authoring-en-cache.json');
if (fs.existsSync(cachePath)) {
  const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  for (const [zh, en] of Object.entries(cache)) {
    if (isLowQualityDisplayEntry(en, zh)) continue;
    addEntry(entries, {
      key: showcaseDisplayTextKey(en, zh),
      namespace: 'display',
      'en-US': en,
      'zh-CN': zh,
    });
  }
}

/** boot registry */
const registryPath = path.join(i18nRoot, 'showcaseAuthoringRegistry.ts');
if (fs.existsSync(registryPath)) {
  scanShowcaseTextFromFile(fs.readFileSync(registryPath, 'utf8'), registryPath, entries);
}

const payload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  entries: [...entries.values()].sort((a, b) => a.key.localeCompare(b.key)),
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${payload.entries.length} entries → ${outPath}`);
