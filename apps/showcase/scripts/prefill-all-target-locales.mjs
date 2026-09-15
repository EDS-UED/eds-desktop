#!/usr/bin/env node
/** 按区域顺序预填全部 22 个 target locale（es-ES 先于 es-419）。 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prefill = path.join(__dirname, 'prefill-showcase-i18n.mjs');

const ORDER = [
  'zh-TW', 'zh-HK',
  'es-ES', 'es-419',
  'ja-JP', 'ko-KR', 'de-DE', 'fr-FR', 'it-IT', 'nl-NL', 'pl-PL', 'ru-RU', 'uk-UA',
  'pt-BR', 'ar', 'tr-TR', 'hi-IN', 'id-ID', 'vi-VN', 'th-TH',
  'fa-IR', 'ms-MY', // DeepL 不支持，放最后（Google / MyMemory）
];

const delay = Number(process.env.I18N_DELAY ?? 200);
const provider = process.env.I18N_PROVIDER ?? 'auto';
const batch = Number(process.env.I18N_BATCH ?? 50);
/** 默认增量（只补缺失/stale）；全量重翻设 I18N_FORCE=1 */
const force = process.env.I18N_FORCE === '1';

function runLocale(locale) {
  return new Promise((resolve, reject) => {
    const mode = locale === 'zh-TW' || locale === 'zh-HK' ? 'hant' : 'machine';
    const args = [
      prefill,
      '--locale', locale,
      ...(force ? ['--force'] : []),
      ...(mode === 'hant'
        ? ['--mode', 'hant']
        : [
          '--provider', provider,
          '--delay', String(delay),
          '--batch', String(batch),
        ]),
    ];
    console.log(`\n>>> ${locale} (${mode})`);
    const child = spawn(process.execPath, args, { stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${locale} failed`))));
  });
}

async function main() {
  const only = process.argv.slice(2);
  const locales = only.length ? ORDER.filter((l) => only.includes(l)) : ORDER;
  for (const locale of locales) {
    await runLocale(locale);
  }
  console.log('\nAll target locales prefilled.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
