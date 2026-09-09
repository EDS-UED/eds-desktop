export type ComboDemoSection = {
  id: string;
  title: string;
  description: string;
  code: string;
  previewRows: Array<{ label: string }>;
};

export type ComboPropRow = {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
};

export const comboImportCode = `import {
  EgComboButton,
  EgComboPopupButton,
  EgComboFloatButton,
  EgComboPageButton,
} from '@eds/desktop-components';`;

export const comboHeroCode = `<EgComboButton tone="brand" confirm-label="Confirm" />`;

export const comboPreviewLabel = 'Combo/Action-Skid';

export const comboPropRows: ComboPropRow[] = [
  {
    name: 'tone',
    type: "'brand' | 'decor' | 'danger'",
    defaultValue: "'brand'",
    description: '主操作按钮色调。Skid 支持 danger；Popup / Flotation / Page 为 brand / decor。',
  },
  {
    name: 'divider',
    type: 'boolean',
    defaultValue: 'false',
    description: '是否显示容器顶部分隔线。用于 Skid、Flotation、Page 场景。',
  },
  {
    name: 'count',
    type: '1 | 2',
    defaultValue: '2',
    description: 'Popup Window 场景下的按钮数量：1 仅 Confirm；2 为 Confirm + Cancel。',
  },
  {
    name: 'clear',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Flotation 场景是否显示 Clear 操作。',
  },
  {
    name: 'direction',
    type: "'left' | 'right'",
    defaultValue: "'right'",
    description: 'Page 场景主操作对齐方向。',
  },
  {
    name: 'confirmLabel',
    type: 'string',
    defaultValue: "'Confirm'",
    description: '主操作按钮文案。',
  },
  {
    name: 'cancelLabel',
    type: 'string',
    defaultValue: "'Cancel'",
    description: '次操作按钮文案；Popup count=2 或 Flotation clear 时使用。',
  },
];

export const comboEventRows: ComboPropRow[] = [
  {
    name: 'confirm',
    type: '() => void',
    defaultValue: '-',
    description: '点击 Confirm 时触发。',
  },
  {
    name: 'cancel',
    type: '() => void',
    defaultValue: '-',
    description: '点击 Cancel 时触发。',
  },
  {
    name: 'clear',
    type: '() => void',
    defaultValue: '-',
    description: 'Flotation 场景点击 Clear 时触发。',
  },
];

export const comboSlotRows: ComboPropRow[] = [
  {
    name: 'default',
    type: 'slot',
    defaultValue: '-',
    description: '预留扩展位；默认由 Confirm / Cancel / Clear 按钮组合填充。',
  },
];

export const comboDemoSections: ComboDemoSection[] = [
  {
    id: 'button-combo-action-skid',
    title: 'Combo/Action-Skid',
    description: 'Skid 模板底部的单按钮操作区；支持 Brand / Decor / Danger 与可选顶部分隔线。',
    previewRows: [
      { label: 'Brand' },
      { label: 'Decor' },
      { label: 'Danger' },
      { label: 'Brand + Divider' },
    ],
    code: `<EgComboButton tone="brand" confirm-label="Confirm" />
<EgComboButton tone="decor" confirm-label="Confirm" />
<EgComboButton tone="danger" confirm-label="Confirm" />
<EgComboButton tone="brand" confirm-label="Confirm" divider />`,
  },
  {
    id: 'button-combo-action-popup-window',
    title: 'Combo/Action-Popup Window',
    description: 'Popup 弹窗底部操作区；Number=1 仅主按钮，Number=2 为主按钮 + 文本 Cancel。',
    previewRows: [
      { label: 'Brand · 2 buttons' },
      { label: 'Decor · 2 buttons' },
      { label: 'Brand · 1 button' },
      { label: 'Decor · 1 button' },
    ],
    code: `<EgComboPopupButton tone="brand" :count="2" />
<EgComboPopupButton tone="decor" :count="2" />
<EgComboPopupButton tone="brand" :count="1" />
<EgComboPopupButton tone="decor" :count="1" />`,
  },
  {
    id: 'button-combo-action-flotation',
    title: 'Combo/Action-Flotation',
    description: 'Flotation 浮动面板操作区；可组合 Clear、Divider 与 Brand / Decor 主操作。',
    previewRows: [
      { label: 'Brand' },
      { label: 'Decor + Clear' },
      { label: 'Brand + Divider' },
      { label: 'Decor + Clear + Divider' },
    ],
    code: `<EgComboFloatButton tone="brand" />
<EgComboFloatButton tone="decor" clear />
<EgComboFloatButton tone="brand" divider />
<EgComboFloatButton tone="decor" clear divider />`,
  },
  {
    id: 'button-combo-action-page',
    title: 'Combo/Action-Page',
    description: 'Page 页面级操作区；支持左右对齐与可选分隔线。',
    previewRows: [
      { label: 'Brand · Right' },
      { label: 'Decor · Left' },
      { label: 'Brand · Right + Divider' },
      { label: 'Decor · Left + Divider' },
    ],
    code: `<EgComboPageButton tone="brand" direction="right" />
<EgComboPageButton tone="decor" direction="left" />
<EgComboPageButton tone="brand" direction="right" divider />
<EgComboPageButton tone="decor" direction="left" divider />`,
  },
  {
    id: 'button-combo-skid',
    title: 'Combo/Skid',
    description: 'Skid 场景非 Action 变体；结构与 Action-Skid 相同，用于非强调操作流。',
    previewRows: [
      { label: 'Brand' },
      { label: 'Decor' },
      { label: 'Danger' },
    ],
    code: `<EgComboSkid tone="brand" confirm-label="Confirm" />
<EgComboSkid tone="decor" confirm-label="Confirm" />
<EgComboSkid tone="danger" confirm-label="Confirm" />`,
  },
  {
    id: 'button-combo-popup-window',
    title: 'Combo/Popup Window',
    description: 'Popup 场景非 Action 变体。',
    previewRows: [
      { label: 'Brand · 2 buttons' },
      { label: 'Decor · 1 button' },
    ],
    code: `<EgComboPopupWindow tone="brand" :count="2" />
<EgComboPopupWindow tone="decor" :count="1" />`,
  },
  {
    id: 'button-combo-flotation',
    title: 'Combo/Flotation',
    description: 'Flotation 场景非 Action 变体。',
    previewRows: [
      { label: 'Brand' },
      { label: 'Decor + Clear' },
    ],
    code: `<EgComboFlotation tone="brand" />
<EgComboFlotation tone="decor" clear />`,
  },
  {
    id: 'button-combo-page',
    title: 'Combo/Page',
    description: 'Page 场景非 Action 变体。',
    previewRows: [
      { label: 'Brand · Right' },
      { label: 'Decor · Left' },
    ],
    code: `<EgComboPage tone="brand" direction="right" />
<EgComboPage tone="decor" direction="left" />`,
  },
];

export const comboDemoSectionById = Object.fromEntries(
  comboDemoSections.map((section) => [section.id, section]),
) as Record<string, ComboDemoSection>;
