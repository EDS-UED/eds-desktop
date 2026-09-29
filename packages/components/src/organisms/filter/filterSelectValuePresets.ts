import { FILTER_DROPDOWN_MAX_HEIGHT } from './types';

export type FilterSelectValueOption = {
  id: string;
  label: string;
};

export const FILTER_SELECT_VALUE_PICKER_HEIGHT = FILTER_DROPDOWN_MAX_HEIGHT;

export const FILTER_DROPDOWN_PRESET_COUNT = 28;

const DROPDOWN_DEMO_LABEL_DIGITS = [
  '',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
] as const;

function formatDropdownDemoLabel(oneBasedIndex: number): string {
  if (oneBasedIndex <= 9) return `选项${DROPDOWN_DEMO_LABEL_DIGITS[oneBasedIndex]}`;
  if (oneBasedIndex === 10) return '选项十';
  if (oneBasedIndex < 20) return `选项十${DROPDOWN_DEMO_LABEL_DIGITS[oneBasedIndex - 10]}`;
  if (oneBasedIndex === 20) return '选项二十';
  return `选项二十${DROPDOWN_DEMO_LABEL_DIGITS[oneBasedIndex - 20]}`;
}

/** Filter 下拉类演示选项。 */
export const FILTER_DROPDOWN_PRESETS: FilterSelectValueOption[] = Array.from(
  { length: FILTER_DROPDOWN_PRESET_COUNT },
  (_, index) => ({
    id: `dropdown-option-${index + 1}`,
    label: formatDropdownDemoLabel(index + 1),
  }),
);

export function resolveFilterSelectValueOption(
  options: readonly FilterSelectValueOption[],
  value: string,
): FilterSelectValueOption | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return options.find((option) => option.id === trimmed);
}
