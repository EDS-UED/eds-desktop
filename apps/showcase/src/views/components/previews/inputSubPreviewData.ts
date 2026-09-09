import type { InputPropRow } from './inputPreviewData';

export const textareaHeroCode = `<EgTextarea v-model="value" placeholder="请输入" width-mode="full" />`;

export const textareaPropRows: InputPropRow[] = [
  { name: 'modelValue', type: 'string', defaultValue: "''", description: '受控文本。' },
  { name: 'placeholder', type: 'string', defaultValue: "'请输入'", description: '占位文案。' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用。' },
  { name: 'readonly', type: 'boolean', defaultValue: 'false', description: '是否只读。' },
  { name: 'widthMode', type: "'fixed' | 'full'", defaultValue: "'fixed'", description: '宽度模式。' },
  { name: 'pasteLabel', type: 'string', defaultValue: "'Paste'", description: 'Paste 链接文案；中文传「粘贴」。' },
  { name: 'clearLabel', type: 'string', defaultValue: "'Clear'", description: 'Clear 链接文案；中文传「清空」。' },
];

export const textareaEventRows: InputPropRow[] = [
  { name: 'update:modelValue', type: '(value: string) => void', defaultValue: '-', description: '值变化时触发。' },
  { name: 'paste', type: '() => void', defaultValue: '-', description: '点击 Paste 时触发。' },
  { name: 'clear', type: '() => void', defaultValue: '-', description: '点击 Clear 时触发。' },
];

export const textareaSlotRows: InputPropRow[] = [
  {
    name: '(无公开插槽)',
    type: '—',
    defaultValue: '—',
    description: 'EgTextarea 无公开插槽；Paste / Clear 通过 props 与事件配置。',
  },
];

export const searchHeroCode = `<EgSearchInput v-model="query" placeholder="Search" width-mode="full" />`;

export const searchPropRows: InputPropRow[] = [
  { name: 'modelValue', type: 'string', defaultValue: "''", description: '搜索关键词。' },
  { name: 'placeholder', type: 'string', defaultValue: "'Search'", description: '占位文案。' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用。' },
  { name: 'readonly', type: 'boolean', defaultValue: 'false', description: '是否只读。' },
  { name: 'widthMode', type: "'fixed' | 'full'", defaultValue: "'fixed'", description: '宽度模式。' },
];

export const searchEventRows: InputPropRow[] = [
  { name: 'update:modelValue', type: '(value: string) => void', defaultValue: '-', description: '值变化时触发。' },
  { name: 'clear', type: '() => void', defaultValue: '-', description: '点击清空时触发。' },
];

export const verifyInputHeroCode = `<EgVerifyInput v-model="code" width-mode="full" />`;

export const verifyInputPropRows: InputPropRow[] = [
  { name: 'modelValue', type: 'string', defaultValue: "''", description: '验证码字符串（仅数字）。' },
  { name: 'codeLength', type: 'number', defaultValue: '6', description: '验证码位数。' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '是否禁用。' },
  { name: 'readonly', type: 'boolean', defaultValue: 'false', description: '是否只读。' },
  { name: 'widthMode', type: "'fixed' | 'full'", defaultValue: "'fixed'", description: '宽度模式。' },
  { name: 'state', type: "'idle' | 'verifying' | 'error'", defaultValue: "'idle'", description: 'idle 默认字色；verifying 次要字色；error 危险背景 + 轻晃。' },
  { name: 'pasteLabel', type: 'string', defaultValue: "'粘贴'", description: '粘贴链接文案。' },
  { name: 'showPaste', type: 'boolean', defaultValue: 'true', description: '是否展示粘贴操作。' },
];

export const verifyInputEventRows: InputPropRow[] = [
  { name: 'update:modelValue', type: '(value: string) => void', defaultValue: '-', description: '值变化时触发。' },
  { name: 'complete', type: '(code: string) => void', defaultValue: '-', description: '输满 codeLength 时触发。' },
  { name: 'paste', type: '() => void', defaultValue: '-', description: '点击粘贴时触发。' },
];

export const comboInputItemFigmaNode = '2404:5584';
export const comboTextareaItemFigmaNode = '2404:5602';

export const comboInputItemPropRows: InputPropRow[] = [
  { name: 'label', type: 'string', defaultValue: "'Label'", description: '字段标题（Body Small primary）。Figma 2404:5584。' },
  {
    name: 'feedback',
    type: 'boolean',
    defaultValue: 'true',
    description:
      '是否在控件下方展示 Feedback 区。false：根 gap `--spacing-1`（Label ↔ 控件）。true：根 gap `--spacing-1-5`（Body ↔ Feedback），Body 内 gap `--spacing-1`。',
  },
];

export const comboTextareaItemPropRows: InputPropRow[] = [
  { name: 'modelValue', type: 'string', defaultValue: "''", description: '受控文本；默认 slot 内置 EgTextarea 绑定。' },
  { name: 'label', type: 'string', defaultValue: "'Label'", description: '字段标题。Figma 2404:5602。' },
  {
    name: 'feedback',
    type: 'boolean',
    defaultValue: 'true',
    description: '是否展示 Feedback 区；间距规则同 Combo/Input Item（2404:5584）。',
  },
  { name: 'placeholder', type: 'string', defaultValue: "'请输入'", description: '未传 default slot 时内置 EgTextarea 的占位文案。' },
];

export const comboInputItemSlotRows: InputPropRow[] = [
  { name: 'default', type: 'slot', defaultValue: '-', description: '控件区（如 EgInput）。' },
  {
    name: 'feedback',
    type: 'slot',
    defaultValue: '辅助说明文案。',
    description: 'feedback=true 时的下方内容；可嵌套 EgFormSubmission。',
  },
];

export const comboTextareaItemSlotRows: InputPropRow[] = [
  { name: 'default', type: 'slot', defaultValue: 'EgTextarea', description: '控件区；默认渲染 EgTextarea width-mode=full。' },
  {
    name: 'feedback',
    type: 'slot',
    defaultValue: '辅助说明文案。',
    description: 'feedback=true 时的下方内容；可嵌套 EgFormSubmission。',
  },
];

export const comboInputItemHeroCode = `<EgComboInput label="Label">
  <EgInput v-model="value" placeholder="请输入" width-mode="full" />
</EgComboInput>`;

export const comboInputItemFeedbackCode = `<EgComboInput label="Label" feedback>
  <EgInput v-model="value" placeholder="请输入" width-mode="full" />
</EgComboInput>`;

export const comboTextareaItemHeroCode = `<EgComboTextarea v-model="value" label="Label" placeholder="请输入" />`;

export const comboTextareaItemFeedbackCode = `<EgComboTextarea v-model="value" label="Label" feedback placeholder="请输入" />`;

export const comboMenuCode = `<EgComboInput label="Label">
  <EgInput placeholder="请输入" width-mode="full" />
</EgComboInput>
<EgComboInput label="Label" feedback>
  <EgInput placeholder="请输入" width-mode="full" />
</EgComboInput>
<EgComboTextarea label="Label" />`;
