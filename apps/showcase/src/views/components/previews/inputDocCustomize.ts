import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import { showcaseInputPlaceholderDemo } from '@/data/i18n/showcaseDemoText';
import {
  propLabelSelectOptions,
  showcaseInputCustomizeFieldLabels,
  showcaseInputSizeLabels,
  showcaseInputTypeLabels,
  showcaseWidthModeLabels,
} from '@/data/showcasePropLabels';
import {
  formSubmissionCustomizeDefaults,
  buildFormSubmissionExpandCustomizeControls,
} from './feedbackDocCustomize';
import {
  INPUT_DOC_EVENTS,
  inputInteractionLabels,
} from './inputDocPreview';

export const inputImportCode = `import { EgInput } from '@eds/desktop-components';`;

export const textareaImportCode = `import { EgTextarea } from '@eds/desktop-components';`;

export const searchImportCode = `import { EgSearchInput, EgVerifyInput } from '@eds/desktop-components';`;

export const comboImportCode = `import {
  EgComboInput,
  EgComboTextarea,
  EgInput,
} from '@eds/desktop-components';`;

export const inputCustomizeDefaults = {
  type: 'standard',
  interaction: 'full',
  size: 'md',
  widthMode: 'full',
  fixedWidth: '319',
  placeholder: showcaseInputPlaceholderDemo,
  disabled: false,
  readonly: false,
  unit: '',
  clearable: true,
  showMax: false,
  maxLabel: 'Max',
} as const;

export const inputCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'type',
    label: showcaseInputCustomizeFieldLabels.type,
    options: [
      { value: 'standard', label: showcaseInputTypeLabels.standard },
      { value: 'amount', label: showcaseInputTypeLabels.amount },
    ],
  },
  {
    kind: 'select',
    key: 'interaction',
    label: showcaseInputCustomizeFieldLabels.interaction,
    options: propLabelSelectOptions(INPUT_DOC_EVENTS, inputInteractionLabels),
  },
  {
    kind: 'select',
    key: 'size',
    label: showcaseInputCustomizeFieldLabels.size,
    options: [
      { value: 'lg', label: showcaseInputSizeLabels.lg },
      { value: 'md', label: showcaseInputSizeLabels.md },
      { value: 'sm', label: showcaseInputSizeLabels.sm },
    ],
  },
  {
    kind: 'select',
    key: 'widthMode',
    label: showcaseInputCustomizeFieldLabels.widthMode,
    options: [
      { value: 'adaptive', label: showcaseWidthModeLabels.adaptive },
      { value: 'fixed', label: showcaseWidthModeLabels.fixed },
      { value: 'full', label: showcaseWidthModeLabels.full },
    ],
  },
  {
    kind: 'text',
    key: 'fixedWidth',
    label: showcaseInputCustomizeFieldLabels.fixedWidth,
    placeholder: showcaseText('319 or 319px', '319 或 319px'),
    visibleWhen: (s) => s.widthMode === 'fixed',
  },
  { kind: 'text', key: 'placeholder', label: showcaseInputCustomizeFieldLabels.placeholder },
  { kind: 'text', key: 'unit', label: showcaseInputCustomizeFieldLabels.unit },
  {
    kind: 'boolean',
    key: 'disabled',
    label: showcaseInputCustomizeFieldLabels.disabled,
    visibleWhen: (s) => s.interaction === 'full',
  },
  {
    kind: 'boolean',
    key: 'readonly',
    label: showcaseInputCustomizeFieldLabels.readonly,
    visibleWhen: (s) => s.interaction === 'full',
  },
  { kind: 'boolean', key: 'clearable', label: showcaseInputCustomizeFieldLabels.clearable },
  {
    kind: 'boolean',
    key: 'showMax',
    label: showcaseInputCustomizeFieldLabels.showMax,
    visibleWhen: (s) => s.type === 'amount',
  },
  {
    kind: 'text',
    key: 'maxLabel',
    label: showcaseInputCustomizeFieldLabels.maxLabel,
    visibleWhen: (s) => s.type === 'amount' && s.showMax === true,
  },
];

export const textareaCustomizeDefaults = {
  placeholder: showcaseInputPlaceholderDemo,
  widthMode: 'full',
  fixedWidth: '319',
  disabled: false,
  readonly: false,
} as const;

export const textareaCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'widthMode',
    label: showcaseInputCustomizeFieldLabels.widthMode,
    options: [
      { value: 'fixed', label: showcaseWidthModeLabels.fixed },
      { value: 'full', label: showcaseWidthModeLabels.full },
    ],
  },
  {
    kind: 'text',
    key: 'fixedWidth',
    label: showcaseInputCustomizeFieldLabels.fixedWidth,
    placeholder: showcaseText('319 or 319px', '319 或 319px'),
    visibleWhen: (s) => s.widthMode === 'fixed',
  },
  { kind: 'text', key: 'placeholder', label: showcaseInputCustomizeFieldLabels.placeholder },
  { kind: 'boolean', key: 'disabled', label: showcaseInputCustomizeFieldLabels.disabled },
  { kind: 'boolean', key: 'readonly', label: showcaseInputCustomizeFieldLabels.readonly },
];

export const searchCustomizeDefaults = {
  placeholder: 'Search',
  widthMode: 'full',
  fixedWidth: '319',
  disabled: false,
  readonly: false,
} as const;

export const searchCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'placeholder', label: showcaseInputCustomizeFieldLabels.placeholder },
  {
    kind: 'select',
    key: 'widthMode',
    label: showcaseInputCustomizeFieldLabels.widthMode,
    options: [
      { value: 'fixed', label: showcaseWidthModeLabels.fixed },
      { value: 'full', label: showcaseWidthModeLabels.full },
    ],
  },
  {
    kind: 'text',
    key: 'fixedWidth',
    label: showcaseInputCustomizeFieldLabels.fixedWidth,
    placeholder: showcaseText('319 or 319px', '319 或 319px'),
    visibleWhen: (s) => s.widthMode === 'fixed',
  },
  { kind: 'boolean', key: 'disabled', label: showcaseInputCustomizeFieldLabels.disabled },
  { kind: 'boolean', key: 'readonly', label: showcaseInputCustomizeFieldLabels.readonly },
];

export const verifyInputCustomizeDefaults = {
  widthMode: 'full',
  fixedWidth: '319',
  disabled: false,
  readonly: false,
} as const;

export const verifyInputCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'widthMode',
    label: showcaseInputCustomizeFieldLabels.widthMode,
    options: [
      { value: 'fixed', label: showcaseWidthModeLabels.fixed },
      { value: 'full', label: showcaseWidthModeLabels.full },
    ],
  },
  {
    kind: 'text',
    key: 'fixedWidth',
    label: showcaseInputCustomizeFieldLabels.fixedWidth,
    placeholder: showcaseText('319 or 319px', '319 或 319px'),
    visibleWhen: (s) => s.widthMode === 'fixed',
  },
  { kind: 'boolean', key: 'disabled', label: showcaseInputCustomizeFieldLabels.disabled },
  { kind: 'boolean', key: 'readonly', label: showcaseInputCustomizeFieldLabels.readonly },
];

export const comboInputItemCustomizeDefaults = {
  label: 'Label',
  feedback: true,
  submissionType: formSubmissionCustomizeDefaults.type,
  submissionText: formSubmissionCustomizeDefaults.text,
  submissionLinkLabel: formSubmissionCustomizeDefaults.linkLabel,
  submissionShowLink: formSubmissionCustomizeDefaults.showLink,
  ...inputCustomizeDefaults,
} as const;

const comboInputNestedControlKeys = [
  'type',
  'size',
  'widthMode',
  'fixedWidth',
  'placeholder',
  'unit',
  'disabled',
  'readonly',
  'clearable',
  'showMax',
  'maxLabel',
] as const;

function pickCustomizeControls(
  controls: DocCustomizeControl[],
  keys: readonly string[],
): DocCustomizeControl[] {
  const byKey = new Map(controls.map((control) => [control.key, control]));
  return keys
    .map((key) => byKey.get(key))
    .filter((control): control is DocCustomizeControl => control != null);
}

export const comboInputItemShellCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'label', label: showcaseInputCustomizeFieldLabels.label },
  { kind: 'boolean', key: 'feedback', label: showcaseInputCustomizeFieldLabels.feedback },
];

export const comboInputItemFormSubmissionCustomizeControls: DocCustomizeControl[] =
  buildFormSubmissionExpandCustomizeControls({
    visibleWhen: (s) => Boolean(s.feedback),
    keyPrefix: 'submission',
  });

export const comboInputItemNestedInputCustomizeControls: DocCustomizeControl[] =
  pickCustomizeControls(inputCustomizeControls, comboInputNestedControlKeys).map((control) => ({
    ...control,
    visibleWhen:
      control.key === 'disabled' || control.key === 'readonly'
        ? undefined
        : control.visibleWhen,
  }));

const comboInputItemShellKeys = [
  'label',
  'feedback',
  'submissionType',
  'submissionText',
  'submissionLinkLabel',
  'submissionShowLink',
] as const;

/** Props for EgComboInput from merged Combo customize state. */
export function comboInputItemShellProps(state: Record<string, unknown>): Record<string, unknown> {
  return {
    label: state.label,
    feedback: state.feedback,
  };
}

/** Props for nested EgInput from merged Combo customize state. */
export function comboNestedInputProps(state: Record<string, unknown>): Record<string, unknown> {
  const inputState = { ...state };
  for (const key of comboInputItemShellKeys) {
    delete inputState[key];
  }
  return inputState;
}

export const comboTextareaItemCustomizeDefaults = {
  label: 'Label',
  feedback: true,
  ...formSubmissionCustomizeDefaults,
  ...textareaCustomizeDefaults,
} as const;

export const comboTextareaItemShellCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'label', label: showcaseInputCustomizeFieldLabels.label },
  { kind: 'boolean', key: 'feedback', label: showcaseInputCustomizeFieldLabels.feedback },
];

export const comboTextareaItemFormSubmissionCustomizeControls: DocCustomizeControl[] =
  buildFormSubmissionExpandCustomizeControls({
    visibleWhen: (s) => Boolean(s.feedback),
  });

export const comboTextareaItemNestedTextareaCustomizeControls: DocCustomizeControl[] = [
  ...textareaCustomizeControls,
];
