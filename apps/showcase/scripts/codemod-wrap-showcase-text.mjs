#!/usr/bin/env node
/**
 * 将 doc 源文件中的裸中文 description/label/title 等字段包裹为 showcaseText(en, zh)。
 * 支持单行、多行 description，以及 sceneProp 第 4 参数。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { translateShowcaseDocZh } from './local-zh-to-en-doc.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(__dirname, '../src');

const TARGET_GLOBS = [
  'views/components/previews',
  'views/scenes/previews',
  'data/animations',
  'presets/module-menu',
  'presets/nav',
];

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

function hasCjk(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function escapeForTsSingleQuote(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function unescapeString(raw) {
  return raw.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n');
}

function wrapShowcaseText(zh) {
  const en = translateShowcaseDocZh(zh);
  if (!en || hasCjk(en)) return null;
  return `showcaseText('${escapeForTsSingleQuote(en)}', '${escapeForTsSingleQuote(zh)}')`;
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.ts$/.test(entry.name)) files.push(full);
  }
  return files;
}

function ensureImport(content) {
  if (/import\s*\{[^}]*showcaseText/.test(content)) return content;
  const importLine = "import { showcaseText } from '@/data/showcasePropLabels';\n";
  const vueImportMatch = content.match(/^import .+;\n/m);
  if (vueImportMatch) {
    const idx = content.indexOf(vueImportMatch[0]) + vueImportMatch[0].length;
    return content.slice(0, idx) + importLine + content.slice(idx);
  }
  return importLine + content;
}

function transformLine(line) {
  if (CODE_FIELD_RE.test(line)) return line;
  if (line.includes('showcaseText(')) return line;

  for (const key of FIELD_KEYS) {
    const re = new RegExp(`(\\b${key}:\\s*)'((?:\\\\'|[^'])*)'`, 'g');
    line = line.replace(re, (full, prefix, raw) => {
      const zh = unescapeString(raw);
      if (!hasCjk(zh)) return full;
      const wrapped = wrapShowcaseText(zh);
      if (!wrapped) return full;
      return `${prefix}${wrapped}`;
    });
  }
  return line;
}

function transformMultilineFields(content) {
  for (const key of FIELD_KEYS) {
    const re = new RegExp(
      `(\\b${key}:\\s*\\n\\s*)'((?:\\\\'|[^'])*)'`,
      'g',
    );
    content = content.replace(re, (full, prefix, raw) => {
      const zh = unescapeString(raw);
      if (!hasCjk(zh)) return full;
      const wrapped = wrapShowcaseText(zh);
      if (!wrapped) return full;
      return `${prefix}${wrapped}`;
    });
  }
  return content;
}

function transformSingleLineSceneProp(content) {
  return content.replace(/^(\s*)sceneProp\((.+)\),?\s*$/gm, (full, indent, args) => {
    if (full.includes('showcaseText(')) return full;
    const matches = [...args.matchAll(/'((?:\\'|[^'])*)'/g)];
    if (!matches.length) return full;
    const last = matches[matches.length - 1];
    const zh = unescapeString(last[1]);
    if (!hasCjk(zh)) return full;
    const wrapped = wrapShowcaseText(zh);
    if (!wrapped) return full;
    const newArgs = `${args.slice(0, last.index)}${wrapped}${args.slice(last.index + last[0].length)}`;
    return `${indent}sceneProp(${newArgs}),`;
  });
}

function transformMultilineSceneProp(content) {
  return content.replace(/sceneProp\(\s*\n([\s\S]*?)\n\s*\),/g, (full, inner) => {
    if (full.includes('showcaseText(')) return full;
    const lines = inner.split('\n');
    let lastIdx = lines.length - 1;
    while (lastIdx >= 0 && !lines[lastIdx].trim()) lastIdx -= 1;
    if (lastIdx < 0) return full;
    const lastLine = lines[lastIdx].trim();
    const match = lastLine.match(/^'((?:\\'|[^'])*)'\s*,?\s*$/);
    if (!match) return full;
    const zh = unescapeString(match[1]);
    if (!hasCjk(zh)) return full;
    const wrapped = wrapShowcaseText(zh);
    if (!wrapped) return full;
    const indent = lines[lastIdx].match(/^\s*/)?.[0] ?? '      ';
    lines[lastIdx] = `${indent}${wrapped},`;
    return `sceneProp(\n${lines.join('\n')}\n    ),`;
  });
}

function transformFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const before = content;

  const lines = content.split('\n');
  content = lines.map((line) => transformLine(line)).join('\n');
  content = transformMultilineFields(content);
  content = transformSingleLineSceneProp(content);
  content = transformMultilineSceneProp(content);

  if (content === before) return false;
  content = ensureImport(content);
  fs.writeFileSync(filePath, content);
  return true;
}

function main() {
  const files = [];
  for (const rel of TARGET_GLOBS) {
    walk(path.join(srcRoot, rel), files);
  }
  let count = 0;
  for (const file of files) {
    if (transformFile(file)) {
      count += 1;
      console.log('updated', path.relative(srcRoot, file));
    }
  }
  console.log(`Codemod complete: ${count} files`);
}

main();
