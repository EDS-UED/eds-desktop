#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(__dirname, '../src');

const CODE_FIELD_RE = /\b(?:code|importCode|heroCode|usageCode|snippet):\s*[`'"]/;

const FIELD_PATTERNS = [
  /\bdescription:\s*'((?:\\'|[^'])*)'/g,
  /\blabel:\s*'((?:\\'|[^'])*)'/g,
  /\btitle:\s*'((?:\\'|[^'])*)'/g,
  /\bpreviewLabel:\s*'((?:\\'|[^'])*)'/g,
  /\bdefaultValue:\s*'((?:\\'|[^'])*)'/g,
  /\bplaceholder:\s*'((?:\\'|[^'])*)'/g,
  /\bmessage:\s*'((?:\\'|[^'])*)'/g,
  /\bheading:\s*'((?:\\'|[^'])*)'/g,
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'locales') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|vue)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function unescapeString(raw) {
  return raw.replace(/\\'/g, "'");
}

function hasCjk(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

const found = new Map();

for (const file of walk(srcRoot)) {
  const rel = path.relative(srcRoot, file);
  if (rel === 'data/components/catalog.ts') continue;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /showcaseText\(\s*'(?:\\'|[^'])*'\s*,\s*'(?:\\'|[^'])*'\s*(?:,\s*\{[^}]*\})?\)/g,
    '',
  );

  for (const line of content.split('\n')) {
    if (CODE_FIELD_RE.test(line)) continue;
    for (const re of FIELD_PATTERNS) {
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(line))) {
        const value = unescapeString(match[1]);
        if (!hasCjk(value)) continue;
        const list = found.get(value) ?? [];
        if (!list.includes(rel)) list.push(rel);
        found.set(value, list);
      }
    }
  }

  const textNodeRe = />([^<>{}\n]*[\u4e00-\u9fff][^<>{}\n]*)</g;
  let nodeMatch;
  while ((nodeMatch = textNodeRe.exec(content))) {
    const text = nodeMatch[1].trim();
    if (text && hasCjk(text) && text.length < 120) {
      const list = found.get(text) ?? [];
      if (!list.includes(rel)) list.push(rel);
      found.set(text, list);
    }
  }
}

const out = path.join(__dirname, '../src/data/i18n/locales/_meta/zh-strings-audit.json');
const payload = {
  count: found.size,
  strings: [...found.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'zh-CN'))
    .map(([zh, files]) => ({ zh, files })),
};
fs.writeFileSync(out, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${payload.count} strings → ${out}`);
