import {
  inputHeroPreviewLabel,
  inputSizeRows,
  inputTypeRows,
  showcaseInputTypeLabels,
} from '@/data/showcasePropLabels';

export type InputDemoSection = {
  id: string;
  title: string;
  previewLabel?: string;
  code: string;
};

export const inputImportCode = `import {
  EgInput,
  EgTextarea,
  EgSearchInput,
  EgComboInput,
  EgComboTextarea,
} from '@eds/desktop-components';`;

export const inputHeroCode = '<EgInput v-model="value" placeholder="请输入" width-mode="full" />';

export const inputPreviewLabel = inputHeroPreviewLabel;

export const inputSizes = inputSizeRows;

export const inputTypes = inputTypeRows;

export const inputDemoSections: InputDemoSection[] = [
  {
    id: 'input-standard',
    title: '类型',
    code: `<EgInput v-model="value" placeholder="请输入" width-mode="full" />
<EgInput v-model="value" type="amount" width-mode="full" unit="ETH" />`,
  },
  {
    id: 'input-amount-sizes',
    title: '尺寸',
    code: `<EgInput v-model="value" size="sm" placeholder="请输入" width-mode="full" />
<EgInput v-model="value" size="md" placeholder="请输入" width-mode="full" />
<EgInput v-model="value" size="lg" placeholder="请输入" width-mode="full" />`,
  },
  {
    id: 'input-unit',
    title: '单位',
    previewLabel: '单位 unit',
    code: '<EgInput v-model="value" placeholder="请输入" unit="Unit" width-mode="full" />',
  },
  {
    id: 'input-clear',
    title: '清空',
    previewLabel: '可清空 clearable',
    code: '<EgInput v-model="value" placeholder="请输入" width-mode="full" />',
  },
  {
    id: 'input-clear-unit',
    title: '带单位的清空',
    previewLabel: '单位 unit',
    code: '<EgInput v-model="value" placeholder="请输入" unit="Unit" width-mode="full" />',
  },
  {
    id: 'input-amount',
    title: '金额',
    previewLabel: showcaseInputTypeLabels.amount,
    code: '<EgInput v-model="value" type="amount" width-mode="full" unit="ETH" />',
  },
  {
    id: 'input-amount-max',
    title: 'Max（suffix 预置）',
    previewLabel: 'Max showMax',
    code: '<EgInput v-model="value" type="amount" width-mode="full" unit="ETH" show-max max-label="最大限度" />',
  },
  {
    id: 'input-disabled',
    title: '禁用',
    code: `<EgInput model-value="请输入" placeholder="请输入" width-mode="full" disabled />
<EgInput model-value="" type="amount" width-mode="full" unit="ETH" disabled />`,
  },
];

export const inputDisabledPreviews = [
  { label: showcaseInputTypeLabels.standard },
  { label: showcaseInputTypeLabels.amount },
] as const;

export type InputPropRow = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};

export const inputPropRows: InputPropRow[] = [
  { name: 'modelValue', type: 'string', defaultValue: "''", description: '受控输入值。' },
  { name: 'type', type: "'standard' | 'amount'", defaultValue: "'standard'", description: '共用外壳下的类型；amount 默认 decimal 与金额占位。与宽度无关。' },
  { name: 'widthMode', type: "'fixed' | 'full'", defaultValue: "'fixed'", description: '宽度仅两种：fixed 固定宽度（由使用方指定具体宽度）；full 占据父容器宽度的 100%。' },
  { name: 'size', type: "'lg' | 'md' | 'sm'", defaultValue: "'md'", description: '三档尺寸，同时作用于左右插槽与交互外壳。' },
  { name: 'placeholder', type: 'string', defaultValue: "'请输入'", description: 'prefix 默认 input 的占位文案。' },
  { name: 'amountPlaceholder', type: 'string', defaultValue: "'0'", description: 'type=amount 时的数值占位；有 unit 时空态显示为「0 ETH」这类组合占位。' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用。' },
  { name: 'readonly', type: 'boolean', defaultValue: 'false', description: '是否只读。' },
  { name: 'unit', type: 'string', defaultValue: '-', description: '单位。amount 时贴在数值后并随光标移动；standard 时作为 suffix 右侧预置。' },
  { name: 'clearable', type: 'boolean', defaultValue: 'true', description: '常用 suffix 预置：聚焦且有值时显示清空。' },
  { name: 'showMax', type: 'boolean', defaultValue: 'false', description: '常用 suffix 预置：开启后显示 Max；默认关闭，与 type 无关。' },
  { name: 'maxLabel', type: 'string', defaultValue: "'Max'", description: 'Max 预置按钮文案。' },
  { name: 'inputmode', type: "'text' | 'decimal' | 'numeric'", defaultValue: '-', description: '覆盖原生 inputmode。' },
];

export const inputEventRows: InputPropRow[] = [
  { name: 'update:modelValue', type: '(value: string) => void', defaultValue: '-', description: '值变化时触发。' },
  { name: 'clear', type: '() => void', defaultValue: '-', description: '点击清空时触发。' },
  { name: 'max', type: '() => void', defaultValue: '-', description: '点击 Max 时触发。' },
  { name: 'focus', type: '(event: FocusEvent) => void', defaultValue: '-', description: '获得焦点时触发。' },
  { name: 'blur', type: '(event: FocusEvent) => void', defaultValue: '-', description: '失去焦点时触发。' },
];

export const inputSlotRows: InputPropRow[] = [
  {
    name: 'prefix',
    type: 'slot',
    defaultValue: '原生 input（placeholder「请输入」）',
    description: '左侧输入区，可任意自定义。不传时用默认 input；传入则整块替换。',
  },
  {
    name: 'suffix',
    type: 'slot',
    defaultValue: '空（可按 props 组合预置）',
    description: '右侧变体区，可任意自定义。常用预置：清空、单位、Max（需对应 props）；传入 slot 则整块替换。',
  },
];

export const inputDemoSectionById = Object.fromEntries(
  inputDemoSections.map((section) => [section.id, section]),
) as Record<string, InputDemoSection>;
