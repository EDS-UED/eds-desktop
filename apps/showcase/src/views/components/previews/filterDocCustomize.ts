import type {
  EgFilterAmountMode,
  EgFilterCondition,
  EgFilterField,
  EgFilterFieldKind,
  EgFilterFieldSelectionMode,
  TooltipAlign,
  TooltipPlacement,
} from '@eds/desktop-components';
import {
  FILTER_FIELD_KIND_PRESETS,
  FILTER_INPUT_PLACEHOLDER,
  FILTER_NUMERIC_PLACEHOLDER,
  createFilterCondition,
  defaultPlaceholderForFilterFieldKind,
  isNumericFilterFieldKind,
} from '@eds/desktop-components';
import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';

export const FILTER_FIELD_KIND_OPTIONS: Array<{ value: EgFilterFieldKind; label: string }> = [
  { value: 'currency', label: showcaseText('Currency', '币种') },
  { value: 'member', label: showcaseText('Member', '成员') },
  { value: 'amount', label: showcaseText('Amount', '金额') },
  { value: 'gas-fee', label: showcaseText('Gas fee', 'Gas Fee') },
  { value: 'time', label: showcaseText('Time', '时间') },
  { value: 'time-range', label: showcaseText('Time range', '时间范围') },
  { value: 'status', label: showcaseText('Status type', '状态类') },
  { value: 'input', label: showcaseText('Input type', '输入类') },
  { value: 'dropdown', label: showcaseText('Dropdown type', '下拉类') },
];

const FIELD_SELECTION_MODE_OPTIONS: Array<{ value: EgFilterFieldSelectionMode; label: string }> = [
  { value: 'single', label: showcaseText('Single', '单选') },
  { value: 'multi', label: showcaseText('Multi', '多选') },
];

const AMOUNT_MODE_OPTIONS: Array<{ value: EgFilterAmountMode; label: string }> = [
  { value: 'single', label: showcaseText('Single amount', '单个金额') },
  { value: 'range', label: showcaseText('Amount range', '金额区间') },
];

const placementOptions = [
  { value: 'bottom', label: showcaseText('Bottom', '下') },
  { value: 'top', label: showcaseText('Top', '上') },
];

const alignOptions = [
  { value: 'start', label: showcaseText('Start', '起始') },
  { value: 'center', label: showcaseText('Center', '居中') },
  { value: 'end', label: showcaseText('End', '末尾') },
];

export const FILTER_MAX_CONDITIONS_DEFAULT = 20;

const FILTER_MAX_CONDITIONS_OPTIONS = Array.from({ length: 20 }, (_, index) => {
  const value = String(index + 1);
  return { value, label: value };
});

export const filterCustomizeDefaults = {
  kind: 'input' as EgFilterFieldKind,
  selectionMode: 'single' as EgFilterFieldSelectionMode,
  amountMode: 'single' as EgFilterAmountMode,
  unit: 'BTC',
  fieldPlaceholder: FILTER_INPUT_PLACEHOLDER,
  fieldLabel: '输入类',
  title: '设置筛选条件',
  addLabel: '添加条件',
  placeholder: FILTER_INPUT_PLACEHOLDER,
  triggerLabel: '筛选',
  showTriggerBadge: true,
  disabled: false,
  placement: 'bottom',
  align: 'start',
  maxConditions: FILTER_MAX_CONDITIONS_DEFAULT,
  initialConditionCount: 0,
} as const;

export function fieldKindSupportsClassCustomization(kind: EgFilterFieldKind): boolean {
  return kind === 'input' || kind === 'status' || kind === 'dropdown';
}

export const filterFieldCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'kind',
    label: showcaseText('Preset field', '预置字段'),
    options: FILTER_FIELD_KIND_OPTIONS,
    row: 0,
  },
  {
    kind: 'text',
    key: 'fieldLabel',
    label: showcaseText('Field label', '字段名称'),
    row: 0,
    visibleWhen: (state) => fieldKindSupportsClassCustomization(resolveFilterFieldKind(state)),
  },
  {
    kind: 'select',
    key: 'selectionMode',
    label: showcaseText('Selection mode', '选择模式'),
    options: FIELD_SELECTION_MODE_OPTIONS,
    row: 0,
    visibleWhen: (state) => fieldKindSupportsSelectionMode(resolveFilterFieldKind(state)),
  },
  {
    kind: 'select',
    key: 'amountMode',
    label: showcaseText('Amount mode', '金额模式'),
    options: AMOUNT_MODE_OPTIONS,
    row: 0,
    visibleWhen: (state) => isNumericFilterFieldKind(resolveFilterFieldKind(state)),
  },
  {
    kind: 'text',
    key: 'unit',
    label: showcaseText('Unit', '单位'),
    row: 0,
    visibleWhen: (state) => isNumericFilterFieldKind(resolveFilterFieldKind(state)),
  },
  {
    kind: 'text',
    key: 'fieldPlaceholder',
    label: showcaseText('Placeholder', '占位文案'),
    row: 0,
    visibleWhen: (state) => !isNumericFilterFieldKind(resolveFilterFieldKind(state)),
  },
];

export const filterCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'placement',
    label: showcaseText('Placement', '方向'),
    options: placementOptions,
    row: 1,
  },
  {
    kind: 'select',
    key: 'align',
    label: showcaseText('Align', '对齐'),
    options: alignOptions,
    row: 1,
  },
  {
    kind: 'select',
    key: 'maxConditions',
    label: showcaseText('Max conditions', '最大条件数'),
    options: FILTER_MAX_CONDITIONS_OPTIONS,
    row: 1,
  },
];

export function resolveFilterFieldKind(state: Record<string, unknown>): EgFilterFieldKind {
  return String(state.kind ?? filterCustomizeDefaults.kind) as EgFilterFieldKind;
}

function resolveFilterFieldSelectionMode(state: Record<string, unknown>): EgFilterFieldSelectionMode {
  return String(
    state.selectionMode ?? filterCustomizeDefaults.selectionMode,
  ) as EgFilterFieldSelectionMode;
}

function resolveFilterAmountMode(state: Record<string, unknown>): EgFilterAmountMode {
  return String(state.amountMode ?? filterCustomizeDefaults.amountMode) as EgFilterAmountMode;
}

function resolveFilterUnit(state: Record<string, unknown>, kind: EgFilterFieldKind): string {
  const fallback = kind === 'gas-fee'
    ? 'ETH'
    : filterCustomizeDefaults.unit;
  return String(state.unit ?? fallback).trim() || fallback;
}

export function fieldKindSupportsSelectionMode(kind: EgFilterFieldKind): boolean {
  if (isNumericFilterFieldKind(kind)) return false;
  return FILTER_FIELD_KIND_PRESETS.some(
    (field) => field.kind === kind && field.selectionMode !== undefined,
  );
}

export function buildDefaultFieldForKind(kind: EgFilterFieldKind): EgFilterField {
  const option = FILTER_FIELD_KIND_OPTIONS.find((item) => item.value === kind);
  const preset =
    FILTER_FIELD_KIND_PRESETS.find((field) => field.id === kind)
    ?? FILTER_FIELD_KIND_PRESETS.find((field) => field.kind === kind && field.selectionMode === 'single')
    ?? FILTER_FIELD_KIND_PRESETS.find((field) => field.kind === kind)
    ?? FILTER_FIELD_KIND_PRESETS.find((field) => field.id === 'input')!;

  return {
    id: kind,
    label: option?.label ?? preset.label,
    kind,
    selectionMode: preset.selectionMode,
    amountMode: preset.amountMode,
    unit: preset.unit,
    placeholder: preset.placeholder,
  };
}

export function syncFieldEditorFromKind(state: Record<string, unknown>, kind: EgFilterFieldKind): void {
  const field = buildDefaultFieldForKind(kind);
  state.kind = kind;
  state.selectionMode = field.selectionMode ?? filterCustomizeDefaults.selectionMode;
  state.amountMode = field.amountMode ?? filterCustomizeDefaults.amountMode;
  state.unit = field.unit ?? resolveFilterUnit(state, kind);
  state.fieldPlaceholder = isNumericFilterFieldKind(kind)
    ? FILTER_NUMERIC_PLACEHOLDER
    : field.placeholder ?? defaultPlaceholderForFilterFieldKind(kind);
  const presetLabel =
    FILTER_FIELD_KIND_PRESETS.find((item) => item.id === kind)?.label
    ?? FILTER_FIELD_KIND_PRESETS.find((item) => item.kind === kind)?.label
    ?? field.label;
  state.fieldLabel = presetLabel;
}

/** 条件行字段下拉：9 种 kind，与定制字段区块同一套选项。 */
export function resolveFilterFields(state: Record<string, unknown>): EgFilterField[] {
  const editingKind = resolveFilterFieldKind(state);

  return FILTER_FIELD_KIND_OPTIONS.map(({ value }) => {
    const field = buildDefaultFieldForKind(value);
    if (value !== editingKind) return field;

    return {
      ...field,
      ...(fieldKindSupportsClassCustomization(value)
        ? {
            label: String(state.fieldLabel ?? field.label).trim() || field.label,
          }
        : {}),
      ...(fieldKindSupportsSelectionMode(value)
        ? { selectionMode: resolveFilterFieldSelectionMode(state) }
        : {}),
      ...(isNumericFilterFieldKind(value)
        ? {
            amountMode: resolveFilterAmountMode(state),
            unit: resolveFilterUnit(state, value),
            placeholder: FILTER_NUMERIC_PLACEHOLDER,
          }
        : {
            placeholder: String(
              state.fieldPlaceholder ?? field.placeholder ?? filterCustomizeDefaults.fieldPlaceholder,
            ),
          }),
    };
  });
}

export function createInitialFilterConditions(state: Record<string, unknown>): EgFilterCondition[] {
  const defaultFieldId = resolveFilterFieldKind(state);
  const max = Number.parseInt(
    String(state.maxConditions ?? FILTER_MAX_CONDITIONS_DEFAULT),
    10,
  ) || FILTER_MAX_CONDITIONS_DEFAULT;
  const count = Math.max(
    0,
    Math.min(
      Number.parseInt(String(state.initialConditionCount ?? '0'), 10) || 0,
      max,
    ),
  );
  return Array.from({ length: count }, () => createFilterCondition(defaultFieldId));
}

export function resolveFilterPreviewProps(state: Record<string, unknown>) {
  return {
    fields: resolveFilterFields(state),
    title: String(state.title ?? filterCustomizeDefaults.title),
    addLabel: String(state.addLabel ?? filterCustomizeDefaults.addLabel),
    placeholder: String(state.placeholder ?? filterCustomizeDefaults.placeholder),
    triggerLabel: String(state.triggerLabel ?? filterCustomizeDefaults.triggerLabel),
    showTriggerBadge: filterCustomizeDefaults.showTriggerBadge,
    disabled: filterCustomizeDefaults.disabled,
    placement: String(state.placement ?? filterCustomizeDefaults.placement) as TooltipPlacement,
    align: String(state.align ?? filterCustomizeDefaults.align) as TooltipAlign,
    maxConditions: Number.parseInt(
      String(state.maxConditions ?? FILTER_MAX_CONDITIONS_DEFAULT),
      10,
    ) || FILTER_MAX_CONDITIONS_DEFAULT,
    teleportTo: 'body',
  };
}

export function buildFilterUsageSnippet(state: Record<string, unknown>): string {
  const fields = resolveFilterFields(state);
  const payload: Record<string, unknown> = {
    fields,
    title: state.title,
    triggerLabel: state.triggerLabel,
    addLabel: state.addLabel,
    maxConditions: Number.parseInt(
      String(state.maxConditions ?? FILTER_MAX_CONDITIONS_DEFAULT),
      10,
    ) || FILTER_MAX_CONDITIONS_DEFAULT,
    placement: state.placement,
    align: state.align,
  };

  return buildVueSelfClosingSnippet('EgFilter', payload, {
    defaults: {
      title: filterCustomizeDefaults.title,
      triggerLabel: filterCustomizeDefaults.triggerLabel,
    },
    omitKeys: [
      'kind',
      'selectionMode',
      'amountMode',
      'unit',
      'fieldPlaceholder',
      'fieldLabel',
      'initialConditionCount',
    ],
    vModel: 'conditions',
  });
}

export function resolveFilterSceneComponentTag(): string {
  return 'EgFilter';
}
