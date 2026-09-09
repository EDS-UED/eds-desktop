import type { DocPropRow } from '@/views/shared/componentDoc/types';

export type ButtonPropRow = DocPropRow;

export const buttonImportCode = `import {
  EgButton,
  EgIconButton,
  EgIconProButton,
  EgLinkButton,
  EgPaginationGroupButton,
  EgComboButton,
  EgComboPopupButton,
  EgComboFloatButton,
  EgComboPageButton,
} from '@eds/desktop-components';`;

export const buttonHeroCode = '<EgButton>Button</EgButton>';

export const buttonPreviewLabel = '大 Lg';

export const buttonPropRows: ButtonPropRow[] = [
  {
    name: 'tone',
    type: "'brand' | 'danger' | 'decor' | 'subtle' | 'sameWhite'",
    defaultValue: "'brand'",
    description: '按钮色调，对应 Figma Brand / Danger / Decor / Subtle / Same White。',
  },
  {
    name: 'variant',
    type: "'solid' | 'outline' | 'text'",
    defaultValue: "'solid'",
    description: '按钮风格，对应 Figma Style。兼容旧名 primary / secondary / ghost。',
  },
  {
    name: 'size',
    type: "'lg' | 'md' | 'sm' | 'xs'",
    defaultValue: "'lg'",
    description: '四档尺寸，同时影响 padding 与字号。',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: '是否禁用。',
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: '是否显示 loading；为 true 时自动禁用。',
  },
  {
    name: 'iconPosition',
    type: "'leading' | 'trailing'",
    defaultValue: "'leading'",
    description: '#icon 相对文案：leading 在左，trailing 在右。',
  },
];

export const buttonSlotRows: ButtonPropRow[] = [
  {
    name: 'default',
    type: 'slot',
    defaultValue: "'Button'",
    description: '按钮文案。',
  },
  {
    name: 'icon',
    type: 'slot',
    defaultValue: '-',
    description: '可选图标；配合 iconPosition 置于文案左或右，对应 Figma showSymbol。',
  },
];
