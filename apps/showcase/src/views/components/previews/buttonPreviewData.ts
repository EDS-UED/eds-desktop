import type { DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';

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
    description: showcaseText('Button hue, corresponding to Figma Brand/Danger/Decor/Subtle/Same White.', '按钮色调，对应 Figma Brand / Danger / Decor / Subtle / Same White。'),
  },
  {
    name: 'variant',
    type: "'solid' | 'outline' | 'text'",
    defaultValue: "'solid'",
    description: showcaseText('Button style, corresponding to Figma Style. Compatible with the old name primary/secondary/ghost.', '按钮风格，对应 Figma Style。兼容旧名 primary / secondary / ghost。'),
  },
  {
    name: 'size',
    type: "'lg' | 'md' | 'sm' | 'xs'",
    defaultValue: "'lg'",
    description: showcaseText('Four dimensions, affecting both padding and font size.', '四档尺寸，同时影响 padding 与字号。'),
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Whether Disabled.', '是否禁用。'),
  },
  {
    name: 'loading',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Whether to show loading; automatically disabled when true.', '是否显示 loading；为 true 时自动禁用。'),
  },
  {
    name: 'iconPosition',
    type: "'leading' | 'trailing'",
    defaultValue: "'leading'",
    description: showcaseText('# icon Relative copy: leading on the left, trailing on the right.', '#icon 相对文案：leading 在左，trailing 在右。'),
  },
];

export const buttonSlotRows: ButtonPropRow[] = [
  {
    name: 'default',
    type: 'slot',
    defaultValue: "'Button'",
    description: showcaseText('Button copy.', '按钮文案。'),
  },
  {
    name: 'icon',
    type: 'slot',
    defaultValue: '-',
    description: showcaseText('Optional icon; with iconPosition to the left or right of the text, corresponding to Figma showSymbol.', '可选图标；配合 iconPosition 置于文案左或右，对应 Figma showSymbol。'),
  },
];
