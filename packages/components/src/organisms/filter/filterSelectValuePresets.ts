export type FilterSelectValueOption = {
  id: string;
  label: string;
};

export const FILTER_SELECT_VALUE_PICKER_HEIGHT = 240;

/** Filter 下拉类演示选项。 */
export const FILTER_DROPDOWN_PRESETS: FilterSelectValueOption[] = [
  { id: 'dropdown-option-1', label: '选项一' },
  { id: 'dropdown-option-2', label: '选项二' },
  { id: 'dropdown-option-3', label: '选项三' },
  { id: 'dropdown-option-4', label: '选项四' },
];

export function resolveFilterSelectValueOption(
  options: readonly FilterSelectValueOption[],
  value: string,
): FilterSelectValueOption | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return options.find((option) => option.id === trimmed);
}
