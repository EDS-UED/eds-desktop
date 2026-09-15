import type { InputPropRow } from './inputPreviewData';
import { showcaseText } from '@/data/showcasePropLabels';

export const textareaHeroCode = `<EgTextarea v-model="value" placeholder="请输入" width-mode="full" />`;

export const textareaPropRows: InputPropRow[] = [
  { name: 'modelValue', type: 'string', defaultValue: "''", description: showcaseText('Controlled text.', '受控文本。') },
  { name: 'placeholder', type: 'string', defaultValue: "'请输入'", description: showcaseText('Placeholder copy。.', '占位文案。') },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: showcaseText('Whether Disabled.', '是否禁用。') },
  { name: 'readonly', type: 'boolean', defaultValue: 'false', description: showcaseText('Whether Read-only.', '是否只读。') },
  { name: 'widthMode', type: "'fixed' | 'full'", defaultValue: "'fixed'", description: showcaseText('Thickness Mode', '宽度模式。') },
  { name: 'pasteLabel', type: 'string', defaultValue: "'Paste'", description: showcaseText('Paste link copy; Chinese text "paste".', 'Paste 链接文案；中文传「粘贴」。') },
  { name: 'clearLabel', type: 'string', defaultValue: "'Clear'", description: showcaseText('Clear link copy; "Clear" in Chinese.', 'Clear 链接文案；中文传「清空」。') },
];

export const textareaEventRows: InputPropRow[] = [
  { name: 'update:modelValue', type: '(value: string) => void', defaultValue: '-', description: showcaseText('Emitted when the value changes。.', '值变化时触发。') },
  { name: 'paste', type: '() => void', defaultValue: '-', description: showcaseText('Emitted when Click Paste.', '点击 Paste 时触发。') },
  { name: 'clear', type: '() => void', defaultValue: '-', description: showcaseText('Emitted when Click Clear.', '点击 Clear 时触发。') },
];

export const textareaSlotRows: InputPropRow[] = [
  {
    name: showcaseText('(No public slots)', '(无公开插槽)'),
    type: '—',
    defaultValue: '—',
    description: showcaseText('EgTextarea has no public slots; Paste/Clear is configured with props and events.', 'EgTextarea 无公开插槽；Paste / Clear 通过 props 与事件配置。'),
  },
];

export const searchHeroCode = `<EgSearchInput v-model="query" placeholder="Search" width-mode="full" />`;

export const searchPropRows: InputPropRow[] = [
  { name: 'modelValue', type: 'string', defaultValue: "''", description: showcaseText('Keywords Search', '搜索关键词。') },
  { name: 'placeholder', type: 'string', defaultValue: "'Search'", description: showcaseText('Placeholder copy。.', '占位文案。') },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: showcaseText('Whether Disabled.', '是否禁用。') },
  { name: 'readonly', type: 'boolean', defaultValue: 'false', description: showcaseText('Whether Read-only.', '是否只读。') },
  { name: 'widthMode', type: "'fixed' | 'full'", defaultValue: "'fixed'", description: showcaseText('Thickness Mode', '宽度模式。') },
];

export const searchEventRows: InputPropRow[] = [
  { name: 'update:modelValue', type: '(value: string) => void', defaultValue: '-', description: showcaseText('Emitted when the value changes。.', '值变化时触发。') },
  { name: 'clear', type: '() => void', defaultValue: '-', description: showcaseText('Emitted when ClickClear.', '点击清空时触发。') },
];

export const verifyInputHeroCode = `<EgVerifyInput v-model="code" width-mode="full" />`;

export const verifyInputPropRows: InputPropRow[] = [
  { name: 'modelValue', type: 'string', defaultValue: "''", description: showcaseText('Captcha string (numbers only).', '验证码字符串（仅数字）。') },
  { name: 'codeLength', type: 'number', defaultValue: '6', description: showcaseText('The number of digits in the verification code.', '验证码位数。') },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: showcaseText('Whether Disabled.', '是否禁用。') },
  { name: 'readonly', type: 'boolean', defaultValue: 'false', description: showcaseText('Whether Read-only.', '是否只读。') },
  { name: 'widthMode', type: "'fixed' | 'full'", defaultValue: "'fixed'", description: showcaseText('Thickness Mode', '宽度模式。') },
  { name: 'state', type: "'idle' | 'verifying' | 'error'", defaultValue: "'idle'", description: showcaseText('idle default font color; verifying secondary font color; error dangerous background + flick.', 'idle 默认字色；verifying 次要字色；error 危险背景 + 轻晃。') },
  { name: 'pasteLabel', type: 'string', defaultValue: "'粘贴'", description: showcaseText('Paste the link copy.', '粘贴链接文案。') },
  { name: 'showPaste', type: 'boolean', defaultValue: 'true', description: showcaseText('Whether to show the paste action.', '是否展示粘贴操作。') },
];

export const verifyInputEventRows: InputPropRow[] = [
  { name: 'update:modelValue', type: '(value: string) => void', defaultValue: '-', description: showcaseText('Emitted when the value changes。.', '值变化时触发。') },
  { name: 'complete', type: '(code: string) => void', defaultValue: '-', description: showcaseText('Fires when codeLength is full.', '输满 codeLength 时触发。') },
  { name: 'paste', type: '() => void', defaultValue: '-', description: showcaseText('Emitted when ClickPaste.', '点击粘贴时触发。') },
];

export const comboInputItemFigmaNode = '2404:5584';
export const comboTextareaItemFigmaNode = '2404:5602';

export const comboInputItemPropRows: InputPropRow[] = [
  { name: 'label', type: 'string', defaultValue: "'Label'", description: showcaseText('Field title (Body Small primary). Figma 2404: 5584.', '字段标题（Body Small primary）。Figma 2404:5584。') },
  {
    name: 'feedback',
    type: 'boolean',
    defaultValue: 'true',
    description:
      showcaseText('[doc] otherwisein Feedback 。false： gap `--spacing-1`（Label ↔ ）。true： gap `--spacing-1-5`（Body ↔ Feedback），Body gap `--spacing-1`。', '是否在控件下方展示 Feedback 区。false：根 gap `--spacing-1`（Label ↔ 控件）。true：根 gap `--spacing-1-5`（Body ↔ Feedback），Body 内 gap `--spacing-1`。'),
  },
];

export const comboTextareaItemPropRows: InputPropRow[] = [
  { name: 'modelValue', type: 'string', defaultValue: "''", description: showcaseText('Controlled text; default slot with built-in EgTextarea binding.', '受控文本；默认 slot 内置 EgTextarea 绑定。') },
  { name: 'label', type: 'string', defaultValue: "'Label'", description: showcaseText('Field title. Figma 2404: 5602.', '字段标题。Figma 2404:5602。') },
  {
    name: 'feedback',
    type: 'boolean',
    defaultValue: 'true',
    description: showcaseText('Whether to display the Feedback area; the spacing rule is the same as Combo/Input Item (2404: 5584).', '是否展示 Feedback 区；间距规则同 Combo/Input Item（2404:5584）。'),
  },
  { name: 'placeholder', type: 'string', defaultValue: "'请输入'", description: showcaseText('Placeholder copy with built-in EgTextarea when default slot is not uploaded.', '未传 default slot 时内置 EgTextarea 的占位文案。') },
];

export const comboInputItemSlotRows: InputPropRow[] = [
  { name: 'default', type: 'slot', defaultValue: '-', description: showcaseText('Control area (e.g. EgInput).', '控件区（如 EgInput）。') },
  {
    name: 'feedback',
    type: 'slot',
    defaultValue: showcaseText('Auxiliary caption copy.', '辅助说明文案。'),
    description: showcaseText('below content when feedback = true; EgFormSubmission can be nested.', 'feedback=true 时的下方内容；可嵌套 EgFormSubmission。'),
  },
];

export const comboTextareaItemSlotRows: InputPropRow[] = [
  { name: 'default', type: 'slot', defaultValue: 'EgTextarea', description: showcaseText('Control area; renders EgTextarea width-mode = full by default.', '控件区；默认渲染 EgTextarea width-mode=full。') },
  {
    name: 'feedback',
    type: 'slot',
    defaultValue: showcaseText('Auxiliary caption copy.', '辅助说明文案。'),
    description: showcaseText('below content when feedback = true; EgFormSubmission can be nested.', 'feedback=true 时的下方内容；可嵌套 EgFormSubmission。'),
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
