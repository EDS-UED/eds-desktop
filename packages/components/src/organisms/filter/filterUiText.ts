export type FilterLocale = 'zh-CN' | 'en' | 'zh-TW';

export type FilterTranslate = (text: string) => string;

const EN_MONTH_ABBR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** 简体中文为真源；en / zh-TW 由 createFilterTranslate 解析。 */
const FILTER_UI_TEXT: Record<string, Partial<Record<FilterLocale, string>>> = {
  日: { en: 'S', 'zh-TW': '日' },
  一: { en: 'M', 'zh-TW': '一' },
  二: { en: 'T', 'zh-TW': '二' },
  三: { en: 'W', 'zh-TW': '三' },
  四: { en: 'T', 'zh-TW': '四' },
  五: { en: 'F', 'zh-TW': '五' },
  六: { en: 'S', 'zh-TW': '六' },
  今天: { en: 'Today', 'zh-TW': '今天' },
  昨天: { en: 'Yesterday', 'zh-TW': '昨天' },
  '3日前': { en: '3 Days Ago', 'zh-TW': '3日前' },
  '1周前': { en: '1 Week Ago', 'zh-TW': '1週前' },
  重置: { en: 'Reset', 'zh-TW': '重置' },
  设置筛选条件: { en: 'Set Filter Conditions', 'zh-TW': '設定篩選條件' },
  添加条件: { en: 'Add Condition', 'zh-TW': '新增條件' },
  筛选: { en: 'Filter', 'zh-TW': '篩選' },
  请选择: { en: 'Please Select', 'zh-TW': '請選擇' },
  '开始 - 结束': {
    en: 'Start - End',
    'zh-TW': '開始 - 結束',
  },
  请输入: { en: 'Enter', 'zh-TW': '請輸入' },
  符合以下: { en: 'Match', 'zh-TW': '符合以下' },
  条件: { en: 'Conditions', 'zh-TW': '條件' },
  所有: { en: 'All', 'zh-TW': '所有' },
  任一: { en: 'Any', 'zh-TW': '任一' },
  等于: { en: 'Equal to', 'zh-TW': '等於' },
  不等于: { en: 'Not equal to', 'zh-TW': '不等於' },
  包含: { en: 'Contains', 'zh-TW': '包含' },
  不包含: { en: 'Does not contain', 'zh-TW': '不包含' },
  为空: { en: 'Is empty', 'zh-TW': '為空' },
  不为空: { en: 'Is not empty', 'zh-TW': '不為空' },
  大于: { en: 'Greater than', 'zh-TW': '大於' },
  小于: { en: 'Less than', 'zh-TW': '小於' },
  大于等于: { en: 'Greater than or equal to', 'zh-TW': '大於等於' },
  小于等于: { en: 'Less than or equal to', 'zh-TW': '小於等於' },
  大于或等于: { en: 'Greater than or equal to', 'zh-TW': '大於或等於' },
  小于或等于: { en: 'Less than or equal to', 'zh-TW': '小於或等於' },
  搜索: { en: 'Search', 'zh-TW': '搜尋' },
  暂无数据: { en: 'No data', 'zh-TW': '暫無資料' },
  等待类: { en: 'Waiting', 'zh-TW': '等待類' },
  进行中类: { en: 'In Progress', 'zh-TW': '進行中類' },
  错误警告类: { en: 'Error / Warning', 'zh-TW': '錯誤警告類' },
  成功完成类: { en: 'Success / Completed', 'zh-TW': '成功完成類' },
  取消失效类: { en: 'Canceled / Invalid', 'zh-TW': '取消失效類' },
  全部: { en: 'All', 'zh-TW': '全部' },
  取消: { en: 'Cancel', 'zh-TW': '取消' },
  确定: { en: 'Confirm', 'zh-TW': '確定' },
  最小: { en: 'Min', 'zh-TW': '最小' },
  最大: { en: 'Max', 'zh-TW': '最大' },
  金额: { en: 'Amount', 'zh-TW': '金額' },
  矿工费: { en: 'Gas Fee', 'zh-TW': '礦工費' },
  币种: { en: 'Currency', 'zh-TW': '幣種' },
  成员: { en: 'Member', 'zh-TW': '成員' },
  WaaS项目: { en: 'WaaS Project', 'zh-TW': 'WaaS項目' },
  时间: { en: 'Time', 'zh-TW': '時間' },
  时间范围: { en: 'Time Range', 'zh-TW': '時間範圍' },
  状态类: { en: 'Status Type', 'zh-TW': '狀態類' },
  输入类: { en: 'Input Type', 'zh-TW': '輸入類' },
  下拉类: { en: 'Dropdown Type', 'zh-TW': '下拉類' },
  多链: { en: 'Multi-chain', 'zh-TW': '多鏈' },
  至: { en: 'to', 'zh-TW': '至' },
};

export function normalizeFilterLocale(locale: string): FilterLocale {
  const normalized = locale.trim().toLowerCase();
  if (normalized.startsWith('zh-tw') || normalized.startsWith('zh-hk')) {
    return 'zh-TW';
  }
  if (normalized.startsWith('en')) {
    return 'en';
  }
  return 'zh-CN';
}

function resolveFilterPatternText(locale: FilterLocale, text: string): string | undefined {
  if (locale === 'zh-CN') return text;

  const monthDayYear = /^(\d{4})年(\d{1,2})月(\d{1,2})日$/.exec(text);
  if (monthDayYear) {
    const year = monthDayYear[1];
    const month = Number.parseInt(monthDayYear[2], 10);
    const day = Number.parseInt(monthDayYear[3], 10);
    if (locale === 'en') {
      return `${EN_MONTH_ABBR[month - 1] ?? monthDayYear[2]} ${day}, ${year}`;
    }
    return `${year}年${month}月${day}日`;
  }

  const monthYear = /^(\d{4})年(\d{1,2})月$/.exec(text);
  if (monthYear) {
    const year = monthYear[1];
    const month = Number.parseInt(monthYear[2], 10);
    if (locale === 'en') {
      return `${EN_MONTH_ABBR[month - 1] ?? monthYear[2]} ${year}`;
    }
    return `${year}年${month}月`;
  }

  const yearOnly = /^(\d{4})年$/.exec(text);
  if (yearOnly) {
    return locale === 'en' ? yearOnly[1] : text;
  }

  const monthOnly = /^(\d{1,2})月$/.exec(text);
  if (monthOnly) {
    const month = Number.parseInt(monthOnly[1], 10);
    if (locale === 'en') {
      return EN_MONTH_ABBR[month - 1] ?? monthOnly[0];
    }
    return text;
  }

  const dateRange = /^(\d{4}-\d{2}-\d{2})至(\d{4}-\d{2}-\d{2})$/.exec(text);
  if (dateRange) {
    if (locale === 'en') {
      return `${dateRange[1]} to ${dateRange[2]}`;
    }
    return text;
  }

  return undefined;
}

export function resolveFilterUiText(locale: FilterLocale, text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return text;

  if (locale === 'zh-CN') return trimmed;

  const pattern = resolveFilterPatternText(locale, trimmed);
  if (pattern) return pattern;

  const mapped = FILTER_UI_TEXT[trimmed]?.[locale];
  if (mapped) return mapped;

  return trimmed;
}

export function createFilterTranslate(locale: string): FilterTranslate {
  const resolvedLocale = normalizeFilterLocale(locale);
  return (text: string) => resolveFilterUiText(resolvedLocale, text);
}
