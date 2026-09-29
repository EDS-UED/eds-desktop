import { FILTER_SELECT_PLACEHOLDER } from '@eds/desktop-components';
import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText, triggerRows, widthModeTriggerFixedAdaptiveRows } from '@/data/showcasePropLabels';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';

export type TooltipFilterPickerScenarioValue =
  | 'crypto-picker'
  | 'member-picker'
  | 'date-picker'
  | 'status-picker';

export type TooltipFilterPickerDateTypeValue = 'date' | 'range';

export const tooltipFilterPickerSceneSections = [
  { id: 'tooltip-scene-crypto-picker', label: showcaseText('Currency picker', '币种选择'), scenario: 'crypto-picker' },
  { id: 'tooltip-scene-member-picker', label: showcaseText('Member picker', '成员选择'), scenario: 'member-picker' },
  { id: 'tooltip-scene-date-picker', label: showcaseText('Date picker', '日期选择'), scenario: 'date-picker' },
  { id: 'tooltip-scene-status-picker', label: showcaseText('Status picker', '状态选择'), scenario: 'status-picker' },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  scenario: TooltipFilterPickerScenarioValue;
}>;

export type TooltipFilterPickerSceneSection = (typeof tooltipFilterPickerSceneSections)[number];

const selectionModeOptions = [
  { value: 'single', label: showcaseText('Single', '单选') },
  { value: 'multi', label: showcaseText('Multi', '多选') },
];

const datePickerTypeOptions = [
  { value: 'date', label: showcaseText('Date', '日期') },
  { value: 'range', label: showcaseText('Date range', '时间段') },
];

export const tooltipFilterPickerCustomizeDefaults = {
  selectionMode: 'single',
  datePickerType: 'date',
  trigger: 'click',
  triggerWidthMode: 'trigger',
  triggerWidth: '240',
  disabled: false,
  placeholder: FILTER_SELECT_PLACEHOLDER,
} as const;

export function isTooltipFilterPickerSceneSlug(pageSlug: string): boolean {
  return tooltipFilterPickerSceneSections.some((section) => section.id === pageSlug);
}

export function findTooltipFilterPickerSceneSection(
  pageSlug: string,
): TooltipFilterPickerSceneSection | undefined {
  return tooltipFilterPickerSceneSections.find((section) => section.id === pageSlug);
}

export function tooltipFilterPickerSceneSupportsSelectionMode(
  scenario: TooltipFilterPickerScenarioValue,
): boolean {
  return scenario === 'crypto-picker' || scenario === 'member-picker' || scenario === 'status-picker';
}

export const tooltipFilterPickerSceneCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'selectionMode',
    label: showcaseText('Selection mode', '选择模式'),
    options: selectionModeOptions,
    visibleWhen: (state) =>
      tooltipFilterPickerSceneSupportsSelectionMode(
        String(state.scenario ?? '') as TooltipFilterPickerScenarioValue,
      ),
  },
  {
    kind: 'select',
    key: 'datePickerType',
    label: showcaseText('Type', '类型'),
    options: datePickerTypeOptions,
    visibleWhen: (state) => String(state.scenario ?? '') === 'date-picker',
  },
  {
    kind: 'select',
    key: 'trigger',
    label: showcaseText('Interaction', '交互方式'),
    options: triggerRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'triggerWidthMode',
    label: showcaseText('Width', '宽度'),
    options: widthModeTriggerFixedAdaptiveRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'text',
    key: 'triggerWidth',
    label: showcaseText('Width value', '宽度值'),
    visibleWhen: (state) => String(state.triggerWidthMode ?? 'trigger') === 'fixed',
  },
  {
    kind: 'boolean',
    key: 'disabled',
    label: showcaseText('Disabled', '禁用'),
  },
  {
    kind: 'text',
    key: 'placeholder',
    label: showcaseText('Placeholder', '占位文案'),
  },
];

function resolveComponentTag(scenario: TooltipFilterPickerScenarioValue): string {
  switch (scenario) {
    case 'crypto-picker':
      return 'EgCryptoTooltip';
    case 'member-picker':
      return 'EgMemberTooltip';
    case 'date-picker':
      return 'EgDatePickerTooltip';
    case 'status-picker':
      return 'EgStatusTooltip';
    default:
      return 'EgTooltip';
  }
}

export function buildTooltipFilterPickerUsageSnippet(
  scenario: TooltipFilterPickerScenarioValue,
  state: Record<string, unknown>,
): string {
  const tag = resolveComponentTag(scenario);
  const props: Record<string, unknown> = {
    modelValue: '',
    placeholder: String(state.placeholder ?? tooltipFilterPickerCustomizeDefaults.placeholder),
    disabled: Boolean(state.disabled),
    trigger: String(state.trigger ?? tooltipFilterPickerCustomizeDefaults.trigger),
    triggerWidthMode: String(state.triggerWidthMode ?? tooltipFilterPickerCustomizeDefaults.triggerWidthMode),
  };

  if (String(state.triggerWidthMode ?? 'trigger') === 'fixed') {
    const width = Number(state.triggerWidth);
    if (Number.isFinite(width) && width > 0) {
      props.triggerWidth = width;
    }
  }

  if (tooltipFilterPickerSceneSupportsSelectionMode(scenario)) {
    props.selectionMode = String(state.selectionMode ?? 'single');
  }

  if (scenario === 'date-picker') {
    props.mode = String(state.datePickerType ?? 'date');
  }

  return buildVueSelfClosingSnippet(tag, props, {
    defaults: tooltipFilterPickerCustomizeDefaults,
    omitKeys: ['scenario', 'datePickerType'],
  });
}

export const tooltipFilterPickerPropRows: DocPropRow[] = [
  {
    name: 'modelValue',
    type: 'string',
    defaultValue: "''",
    description: showcaseText('Selected value; multi-select uses comma-separated ids.', '选中值；多选为逗号分隔 id。'),
  },
  {
    name: 'placeholder',
    type: 'string',
    defaultValue: `'${FILTER_SELECT_PLACEHOLDER}'`,
    description: showcaseText('Trigger placeholder when empty.', '未选中时触发器占位文案。'),
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Disables opening the picker.', '禁用打开选择器。'),
  },
  {
    name: 'selectionMode',
    type: "'single' | 'multi'",
    defaultValue: "'single'",
    description: showcaseText('Currency / member / status pickers only.', '仅币种 / 成员 / 状态选择器。'),
  },
  {
    name: 'mode',
    type: "'date' | 'range'",
    defaultValue: "'date'",
    description: showcaseText('EgDatePickerTooltip only: single date or date range.', 'EgDatePickerTooltip 专用：单日或时间段。'),
  },
  {
    name: 'trigger',
    type: "'click' | 'hover'",
    defaultValue: "'click'",
    description: showcaseText('How the picker opens.', '选择器打开方式。'),
  },
  {
    name: 'triggerWidthMode',
    type: "'trigger' | 'adaptive' | 'fixed'",
    defaultValue: "'adaptive'",
    description: showcaseText('Trigger width mode forwarded to EgFlotationTrigger.', '转发至 EgFlotationTrigger 的触发器宽度模式。'),
  },
  {
    name: 'triggerWidth',
    type: 'number',
    defaultValue: 'undefined',
    description: showcaseText('Fixed trigger width (px) when triggerWidthMode=fixed.', 'triggerWidthMode=fixed 时的触发器宽度（px）。'),
  },
];
