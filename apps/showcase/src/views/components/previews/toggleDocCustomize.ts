import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  inputSizeRows,
  propLabelRows,
  showcaseToggleCheckboxModeLabels,
  showcaseToggleDecideModeLabels,
  showcaseToggleRadioModeLabels,
  showcaseToggleSwitchModeLabels,
} from '@/data/showcasePropLabels';

export const checkboxImportCode = `import { EgCheckbox } from '@eds/desktop-components';`;
export const radioImportCode = `import { EgRadio } from '@eds/desktop-components';`;
export const decideImportCode = `import { EgDecide } from '@eds/desktop-components';`;
export const switchImportCode = `import { EgSwitch } from '@eds/desktop-components';`;

export const checkboxPropRows: DocPropRow[] = [
  { name: 'modelValue', type: 'boolean', defaultValue: 'false', description: showcaseText('SelectedStatus。', '选中状态。') },
  { name: 'indeterminate', type: 'boolean', defaultValue: 'false', description: showcaseText('Half-select status.', '半选状态。') },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Disable interaction; unselected/half-selected/checked for UnChecked Disable or Checked Disable swatches.', '禁用交互；未选/半选/选中对应 UnChecked Disable 或 Checked Disable 色板。'),
  },
];

export const radioPropRows: DocPropRow[] = [
  { name: 'modelValue', type: 'boolean', defaultValue: 'false', description: showcaseText('SelectedStatus。', '选中状态。') },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: showcaseText('Disabled（Figma only UnChecked Disable）。', '禁用（Figma 仅 UnChecked Disable）。') },
  { name: 'name', type: 'string', defaultValue: 'undefined', description: showcaseText('Radio group name.', 'Radio 组 name。') },
  { name: 'value', type: 'string', defaultValue: "'default'", description: showcaseText('Option value.', '选项 value。') },
];

export const decidePropRows: DocPropRow[] = [
  { name: 'modelValue', type: 'boolean', defaultValue: 'false', description: showcaseText('Whether or not it has been decided.', '是否已决定。') },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: showcaseText('Disabled（Figma only UnDecided Disable）。', '禁用（Figma 仅 UnDecided Disable）。') },
];

export const switchPropRows: DocPropRow[] = [
  { name: 'modelValue', type: 'boolean', defaultValue: 'false', description: showcaseText('Switch state', '开关状态。') },
  { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: showcaseText('Size。', '尺寸。') },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: showcaseText('Disabled。', '禁用。') },
];

/** 可交互 Preview + 固定 Figma 态（互斥） */
export const checkboxCustomizeDefaults = {
  mode: 'checkbox',
  checked: true,
};

export const checkboxCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'mode',
    label: showcaseText('Mode', '模式'),
    options: propLabelRows(
      ['checkbox', 'unchecked-disable', 'checked-disable', 'indeterminate'] as const,
      showcaseToggleCheckboxModeLabels,
    ).map((row) => ({ value: row.key, label: row.label })),
  },
];

export const radioCustomizeDefaults = {
  mode: 'radio',
  checked: true,
};

export const radioCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'mode',
    label: showcaseText('Mode', '模式'),
    options: propLabelRows(['radio', 'disable'] as const, showcaseToggleRadioModeLabels).map((row) => ({
      value: row.key,
      label: row.label,
    })),
  },
];

export const decideCustomizeDefaults = {
  mode: 'decide',
  decided: false,
};

export const decideCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'mode',
    label: showcaseText('Mode', '模式'),
    options: propLabelRows(['decide', 'disable'] as const, showcaseToggleDecideModeLabels).map((row) => ({
      value: row.key,
      label: row.label,
    })),
  },
];

export const switchCustomizeDefaults = { mode: 'switch', on: true, size: 'md' };

export const switchCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'mode',
    label: showcaseText('Mode', '模式'),
    options: propLabelRows(['switch', 'disable'] as const, showcaseToggleSwitchModeLabels).map((row) => ({
      value: row.key,
      label: row.label,
    })),
  },
  {
    kind: 'select',
    key: 'size',
    label: showcaseText('Size', '尺寸'),
    options: inputSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
];

export function isCheckboxInteractiveMode(mode: unknown): boolean {
  return String(mode) === 'checkbox';
}

export function isRadioInteractiveMode(mode: unknown): boolean {
  return String(mode) === 'radio';
}

export function isDecideInteractiveMode(mode: unknown): boolean {
  return String(mode) === 'decide';
}

export function isSwitchInteractiveMode(mode: unknown): boolean {
  return String(mode) === 'switch';
}

export function mapCheckboxFixedPreviewProps(mode: unknown) {
  switch (String(mode)) {
    case 'unchecked-disable':
      return { modelValue: false, indeterminate: false, disabled: true, interactive: false };
    case 'checked-disable':
      return { modelValue: true, indeterminate: false, disabled: true, interactive: false };
    case 'indeterminate':
      return { modelValue: false, indeterminate: true, disabled: false, interactive: false };
    default:
      return null;
  }
}

export function buildCheckboxUsageSnippet(state: Record<string, unknown>): string {
  const fixed = mapCheckboxFixedPreviewProps(state.mode);
  if (fixed) {
    return buildVueSelfClosingSnippet(
      'EgCheckbox',
      { indeterminate: fixed.indeterminate, disabled: fixed.disabled },
      { defaults: { indeterminate: false, disabled: false } },
    ).replace('/>', ` :model-value="${fixed.modelValue}" />`);
  }
  return buildVueSelfClosingSnippet('EgCheckbox', {}, { defaults: {} }).replace(
    '/>',
    ' v-model="checked" />',
  );
}

export function buildSwitchUsageSnippet(state: Record<string, unknown>): string {
  const disabled = String(state.mode) === 'disable';
  return buildVueSelfClosingSnippet(
    'EgSwitch',
    {
      size: state.size,
      disabled,
    },
    { defaults: { size: 'md', disabled: false } },
  ).replace('/>', disabled ? ' :model-value="false" />' : ' v-model="on" />');
}
