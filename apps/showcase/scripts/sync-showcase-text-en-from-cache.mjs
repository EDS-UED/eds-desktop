#!/usr/bin/env node
/** 将 cache 中的英文同步回源文件 showcaseText('en', 'zh') 的 en 侧 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(__dirname, '../src');
const cachePath = path.join(__dirname, '../src/data/i18n/locales/_meta/authoring-en-cache.json');

function escapeForTs(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function walk(d, files = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'locales') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (/\.ts$/.test(e.name)) files.push(p);
  }
  return files;
}

const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
let filesChanged = 0;
let replacements = 0;

for (const file of walk(srcRoot)) {
  if (file.endsWith('showcaseAuthoringRegistry.ts')) continue;
  let src = fs.readFileSync(file, 'utf8');
  const before = src;
  src = src.replace(
    /showcaseText\(\s*'((?:\\'|[^'])*)'\s*,\s*'((?:\\'|[^'])*)'\s*\)/g,
    (full, rawEn, rawZh) => {
      const en = rawEn.replace(/\\'/g, "'");
      const zh = rawZh.replace(/\\'/g, "'");
      const cached = cache[zh];
      if (!cached || cached === en || cached.startsWith('[doc]')) return full;
      replacements += 1;
      return `showcaseText('${escapeForTs(cached)}', '${escapeForTs(zh)}')`;
    },
  );
  if (src !== before) {
    fs.writeFileSync(file, src);
    filesChanged += 1;
  }
}

console.log(`Synced ${replacements} showcaseText en values in ${filesChanged} files`);
