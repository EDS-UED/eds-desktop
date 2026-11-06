import { getShowcaseI18nRegistry } from '@/data/i18n/showcaseI18nRegistry';
import type { BillTranslate } from '@eds/desktop-components';

function isChineseShowcaseLocale(locale: string): boolean {
  return locale === 'zh-CN' || locale.startsWith('zh-');
}

const SHOWCASE_BILL_UI_TEXT: Record<string, string> = {
  'Bill export title': '导出',
  'Bill export preset last 3 months': '近三个月',
  'Bill export preset last 6 months': '近半年',
  'Bill export preset last 12 months': '近一年',
  'Bill export date placeholder': '请选择',
  'Bill export date range to': '至',
  'Bill export within one year hint': '仅支持导出一年内的数据',
  'Bill export action': '导出',
  'Bill export history title': '导出历史',
  'Bill export status preparing': '准备中...',
  'Bill export download': '下载',
};

export function resolveShowcaseBillUiText(key: string): string {
  const locale = getShowcaseI18nRegistry().locale;
  const zh = SHOWCASE_BILL_UI_TEXT[key];
  if (!zh) return key;
  return isChineseShowcaseLocale(locale) ? zh : key;
}

export const showcaseBillUi: BillTranslate = (key) => resolveShowcaseBillUiText(key);

/** Showcase 默认时间段（与设计稿 2027-06-23 对齐）。 */
export const SHOWCASE_BILL_DEFAULT_RANGE = '2027-06-23,2027-06-23';
