#!/usr/bin/env node
/**
 * 用 MyMemory zh→en 重译低质量 cache 条目（含 [doc] 前缀），增量写入 cache。
 * pnpm i18n:retranslate [--delay 2000] [--limit 100]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const i18nRoot = path.join(__dirname, '../src/data/i18n');
const cachePath = path.join(i18nRoot, 'locales/_meta/authoring-en-cache.json');
const auditPath = path.join(i18nRoot, 'locales/_meta/zh-strings-audit.json');

function hasCjk(t) {
  return /[\u4e00-\u9fff]/.test(t);
}

function isLowQuality(en, zh) {
  if (!en?.trim()) return true;
  if (en === zh) return true;
  if (en.startsWith('[doc]')) return true;
  return hasCjk(en);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateZhToEn(text, attempt = 0) {
  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text.slice(0, 480));
  url.searchParams.set('langpair', 'zh-CN|en');
  url.searchParams.set('de', 'danbaby@local.dev');
  const res = await fetch(url);
  if (res.status === 429 && attempt < 8) {
    await sleep(3000 * (attempt + 1));
    return translateZhToEn(text, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const translated = json?.responseData?.translatedText?.trim();
  if (!translated || hasCjk(translated)) throw new Error('bad translation');
  return translated;
}

function parseArgs() {
  const args = { delay: 2000, limit: Infinity };
  for (let i = 2; i < process.argv.length; i += 1) {
    if (process.argv[i] === '--delay') args.delay = Number(process.argv[++i]);
    else if (process.argv[i] === '--limit') args.limit = Number(process.argv[++i]);
  }
  return args;
}

async function main() {
  const args = parseArgs();
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  const todo = audit.strings
    .map(({ zh }) => zh)
    .filter((zh) => isLowQuality(cache[zh], zh));

  console.log(`Retranslate queue: ${todo.length} (limit ${args.limit})`);
  let done = 0;
  for (const zh of todo) {
    if (done >= args.limit) break;
    try {
      const en = await translateZhToEn(zh);
      cache[zh] = en;
      fs.writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
      done += 1;
      if (done % 10 === 0) console.log(`  ${done}/${Math.min(todo.length, args.limit)}`);
    } catch (e) {
      console.warn(`skip: ${zh.slice(0, 36)}… (${e.message})`);
    }
    await sleep(args.delay);
  }
  console.log(`Done: ${done} translated`);
}

await main();
