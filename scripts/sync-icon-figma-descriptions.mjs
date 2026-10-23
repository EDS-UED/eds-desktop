#!/usr/bin/env node
/**
 * Sync icon Figma component descriptions → Showcase search index.
 *
 * Source: EverGreen Design System (Desktop) Icons page component 描述 fields.
 * Keywords in each description are split on the Chinese enumeration comma (、).
 *
 * Requires FIGMA_ACCESS_TOKEN (Personal Access Token with file read scope).
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=... node scripts/sync-icon-figma-descriptions.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

/** 可选：仓库根 `.env`（gitignore），便于本地 FIGMA_ACCESS_TOKEN。 */
function loadRepoDotEnv() {
  const dotEnvPath = join(repoRoot, '.env');
  if (!existsSync(dotEnvPath)) return;
  const text = readFileSync(dotEnvPath, 'utf-8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    if (key !== 'FIGMA_ACCESS_TOKEN' || process.env.FIGMA_ACCESS_TOKEN) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env.FIGMA_ACCESS_TOKEN = value;
  }
}

loadRepoDotEnv();

const figmaConfigPath = join(repoRoot, 'figma.config.json');
const outputPath = join(
  repoRoot,
  'apps/showcase/src/data/iconFigmaDescriptions.json',
);

const token = process.env.FIGMA_ACCESS_TOKEN?.trim();
if (!token) {
  console.error('✗ FIGMA_ACCESS_TOKEN is required');
  console.error('  Create a token at https://www.figma.com/developers/api#access-tokens');
  process.exit(1);
}

if (!existsSync(figmaConfigPath)) {
  console.error('✗ figma.config.json not found at repo root');
  process.exit(1);
}

const { fileKey, fileName } = JSON.parse(readFileSync(figmaConfigPath, 'utf-8'));

const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/components`, {
  headers: { 'X-Figma-Token': token },
});

if (!response.ok) {
  console.error(`✗ Figma API error ${response.status}: ${await response.text()}`);
  process.exit(1);
}

const payload = await response.json();
const components = Object.values(payload.meta?.components ?? {});

/** @type {Record<string, { description: string; keywords: string[] }>} */
const descriptions = {};

for (const component of components) {
  const rawName = String(component.name ?? '').trim();
  const description = String(component.description ?? '').trim();
  if (!rawName || !description) continue;
  if (!/^(eds|cds)-/.test(rawName)) continue;

  const normalizedName = rawName.replace(/\s+-fill$/, '-fill');
  const keywords = description
    .split('、')
    .map((part) => part.trim())
    .filter(Boolean);

  const existing = descriptions[normalizedName];
  if (existing) {
    const mergedKeywords = [...new Set([...existing.keywords, ...keywords])];
    descriptions[normalizedName] = { description, keywords: mergedKeywords };
  } else {
    descriptions[normalizedName] = { description, keywords };
  }
}

const sorted = Object.fromEntries(
  Object.keys(descriptions)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => [key, descriptions[key]]),
);

writeFileSync(outputPath, `${JSON.stringify(sorted, null, 2)}\n`, 'utf-8');

console.log(`EverGreen Design System (Desktop) — Icon description sync`);
console.log(`  File:  ${fileName}`);
console.log(`  Icons: ${Object.keys(sorted).length}`);
console.log(`  Wrote: ${outputPath}`);
