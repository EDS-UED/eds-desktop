export type FilterDateParts = {
  year: number;
  month: number;
  day: number;
};

export type FilterCalendarCell = FilterDateParts & {
  inMonth: boolean;
};

export type FilterTimeQuickPresetId = 'today' | 'yesterday' | '3-days-ago' | '1-week-ago';

export const FILTER_WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'] as const;

export const FILTER_TIME_QUICK_PRESETS: Array<{ id: FilterTimeQuickPresetId; label: string }> = [
  { id: 'today', label: '今天' },
  { id: 'yesterday', label: '昨天' },
  { id: '3-days-ago', label: '3日前' },
  { id: '1-week-ago', label: '1周前' },
];

export const FILTER_TIME_PICKER_WIDTH = 280;
export const FILTER_TIME_RANGE_PICKER_WIDTH = 560;
/** 日历年/月下拉：内容溢出时的最大高度（px）。 */
export const FILTER_CALENDAR_SELECT_MENU_MAX_HEIGHT = 410;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function isValidFilterDateParts(parts: FilterDateParts): boolean {
  const date = new Date(parts.year, parts.month - 1, parts.day);
  return (
    date.getFullYear() === parts.year
    && date.getMonth() === parts.month - 1
    && date.getDate() === parts.day
  );
}

export function toDateKey(parts: FilterDateParts): string {
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
}

export function fromDateKey(key: string): FilterDateParts | null {
  const trimmed = key.trim();
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!matched) return null;

  const parts: FilterDateParts = {
    year: Number.parseInt(matched[1], 10),
    month: Number.parseInt(matched[2], 10),
    day: Number.parseInt(matched[3], 10),
  };

  return isValidFilterDateParts(parts) ? parts : null;
}

export function formatFilterDateDisplay(parts: FilterDateParts): string {
  return `${parts.year}年${parts.month}月${parts.day}日`;
}

export function formatFilterMonthTitle(year: number, month: number): string {
  return `${year}年${month}月`;
}

export function parseFilterDateRangeValue(raw: string): {
  start: FilterDateParts | null;
  end: FilterDateParts | null;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { start: null, end: null };
  }

  const [startRaw = '', endRaw = ''] = trimmed.split(',', 2);
  return {
    start: fromDateKey(startRaw),
    end: fromDateKey(endRaw),
  };
}

export function formatFilterDateRangeValue(
  start: FilterDateParts | null,
  end: FilterDateParts | null,
): string {
  if (!start || !end) return '';
  return `${toDateKey(start)},${toDateKey(end)}`;
}

export function formatFilterDateRangeDisplay(
  start: FilterDateParts | null,
  end: FilterDateParts | null,
): string {
  if (!start || !end) return '';
  return `${toDateKey(start)}至${toDateKey(end)}`;
}

export function compareFilterDates(a: FilterDateParts, b: FilterDateParts): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function isSameFilterDate(a: FilterDateParts | null, b: FilterDateParts | null): boolean {
  if (!a || !b) return false;
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function isFilterDateInRange(
  date: FilterDateParts,
  start: FilterDateParts | null,
  end: FilterDateParts | null,
): boolean {
  if (!start || !end) return false;
  const value = compareFilterDates(date, start);
  const upper = compareFilterDates(date, end);
  return value >= 0 && upper <= 0;
}

export function normalizeFilterDateRange(
  start: FilterDateParts,
  end: FilterDateParts,
): { start: FilterDateParts; end: FilterDateParts } {
  return compareFilterDates(start, end) <= 0
    ? { start, end }
    : { start: end, end: start };
}

export function buildFilterYearOptions(anchorYear: number, span = 50): Array<{ id: string; label: string }> {
  const start = anchorYear - span;
  const end = anchorYear + span;
  const options: Array<{ id: string; label: string }> = [];

  for (let year = start; year <= end; year += 1) {
    options.push({ id: String(year), label: `${year}年` });
  }

  return options;
}

export function buildFilterMonthOptions(): Array<{ id: string; label: string }> {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    return { id: String(month), label: `${month}月` };
  });
}

export function buildCalendarCells(viewYear: number, viewMonth: number): FilterCalendarCell[] {
  const firstWeekday = new Date(viewYear, viewMonth - 1, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth - 1, 0).getDate();
  const cells: FilterCalendarCell[] = [];

  for (let index = firstWeekday - 1; index >= 0; index -= 1) {
    const day = daysInPrevMonth - index;
    const month = viewMonth === 1 ? 12 : viewMonth - 1;
    const year = viewMonth === 1 ? viewYear - 1 : viewYear;
    cells.push({ year, month, day, inMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ year: viewYear, month: viewMonth, day, inMonth: true });
  }

  let trailingDay = 1;
  while (cells.length % 7 !== 0) {
    const month = viewMonth === 12 ? 1 : viewMonth + 1;
    const year = viewMonth === 12 ? viewYear + 1 : viewYear;
    cells.push({ year, month, day: trailingDay, inMonth: false });
    trailingDay += 1;
  }

  return cells;
}

export function startOfTodayParts(): FilterDateParts {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

export function addDaysToFilterDate(parts: FilterDateParts, offset: number): FilterDateParts {
  const date = new Date(parts.year, parts.month - 1, parts.day);
  date.setDate(date.getDate() + offset);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

export function resolveFilterTimeQuickPresetRange(
  presetId: FilterTimeQuickPresetId,
): { start: FilterDateParts; end: FilterDateParts } {
  const today = startOfTodayParts();

  switch (presetId) {
    case 'today':
      return { start: today, end: today };
    case 'yesterday': {
      const yesterday = addDaysToFilterDate(today, -1);
      return { start: yesterday, end: yesterday };
    }
    case '3-days-ago':
      return { start: addDaysToFilterDate(today, -3), end: today };
    case '1-week-ago':
      return { start: addDaysToFilterDate(today, -7), end: today };
    default:
      return { start: today, end: today };
  }
}

export function shiftFilterMonth(
  year: number,
  month: number,
  offset: number,
): { year: number; month: number } {
  const date = new Date(year, month - 1 + offset, 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}
