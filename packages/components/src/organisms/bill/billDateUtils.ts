import {
  formatFilterDateRangeValue,
  normalizeFilterDateRange,
  startOfTodayParts,
  type FilterDateParts,
} from '../filter/filterDateUtils';

export type BillExportQuickPresetId = 'last-3-months' | 'last-6-months' | 'last-12-months';

export const BILL_EXPORT_QUICK_PRESET_IDS: BillExportQuickPresetId[] = [
  'last-3-months',
  'last-6-months',
  'last-12-months',
];

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatBillIsoDate(parts: FilterDateParts): string {
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
}

function subtractMonths(parts: FilterDateParts, months: number): FilterDateParts {
  const date = new Date(parts.year, parts.month - 1 - months, parts.day);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

export function resolveBillExportQuickPresetRange(
  presetId: BillExportQuickPresetId,
): { start: FilterDateParts; end: FilterDateParts } {
  const end = startOfTodayParts();
  switch (presetId) {
    case 'last-3-months':
      return { start: subtractMonths(end, 3), end };
    case 'last-6-months':
      return { start: subtractMonths(end, 6), end };
    case 'last-12-months':
      return { start: subtractMonths(end, 12), end };
    default:
      return { start: end, end };
  }
}

export function formatBillExportQuickPresetValue(presetId: BillExportQuickPresetId): string {
  const { start, end } = resolveBillExportQuickPresetRange(presetId);
  const normalized = normalizeFilterDateRange(start, end);
  return formatFilterDateRangeValue(normalized.start, normalized.end);
}
