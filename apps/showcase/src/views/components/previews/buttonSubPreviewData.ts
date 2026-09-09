import type { DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseDefaultIconName } from '@/views/shared/showcaseIcons';

export const iconButtonPropRows: DocPropRow[] = [
  {
    name: 'shape',
    type: "'rectangular' | 'square' | 'round'",
    defaultValue: "'rectangular'",
    description: '容器外形：矩形 rectangular、方形 square、圆形 round（Figma Type）。',
  },
  {
    name: 'size',
    type: "'lg' | 'md' | 'sm' | 'xs'",
    defaultValue: "'lg'",
    description: '四档尺寸。',
  },
  {
    name: 'label',
    type: 'string',
    defaultValue: '-',
    description: '无障碍标签（aria-label）。',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: '是否禁用。',
  },
  {
    name: 'motion',
    type: "'ease' | 'hover-enter-only' | 'asym' | 'none'",
    defaultValue: "'ease'",
    description:
      'Motion semantic：ease → `.motion-ease.is-paint`（入+出）；hover-enter-only / asym → `.motion-ease.is-enter-only`（仅 hover 入场，离场与 focus/active 无过渡）；none → `.motion-none`。',
  },
  {
    name: 'as',
    type: "'button' | 'span'",
    defaultValue: "'button'",
    description: '渲染标签；嵌套在 EgIconProButton 等控件内时用 span，避免 button 套 button。',
  },
];

export const iconButtonSlotRows: DocPropRow[] = [
  {
    name: 'symbol',
    type: 'slot',
    defaultValue: '-',
    description: 'Symbol 插槽；默认 slot 与之等价。推荐 <EgIcon name="eds-add" fit />。',
  },
  {
    name: 'default',
    type: 'slot',
    defaultValue: '-',
    description: 'Symbol 插槽别名（与 #symbol 等价）。',
  },
];

export const iconButtonProPropRows: DocPropRow[] = [
  {
    name: 'label',
    type: 'string',
    defaultValue: '-',
    description: '可见文案与 aria-label。',
  },
  {
    name: 'badge',
    type: 'string | number',
    defaultValue: '0',
    description: '角标数字或文案；渲染为 EgMessage。',
  },
  {
    name: 'messageType',
    type: "'subtle' | 'brand' | 'danger'",
    defaultValue: "'brand'",
    description: 'showBadge 时 EgMessage 的 type。',
  },
  {
    name: 'showBadge',
    type: 'boolean',
    defaultValue: 'false',
    description: '是否显示角标。',
  },
  {
    name: 'showReddot',
    type: 'boolean',
    defaultValue: 'false',
    description: '是否显示红点。',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: '是否禁用。',
  },
];

export const iconButtonProSlotRows: DocPropRow[] = [
  {
    name: 'default',
    type: 'slot',
    defaultValue: '-',
    description: `传给内部 EgIconButton（size=sm）的 Symbol，推荐 <EgIcon name="${showcaseDefaultIconName}" fit />。`,
  },
];

export const linkPropRows: DocPropRow[] = [
  {
    name: 'tone',
    type: "'brand' | 'theme'",
    defaultValue: "'brand'",
    description: '链接色调。',
  },
  {
    name: 'size',
    type: "'lg' | 'md' | 'sm'",
    defaultValue: "'lg'",
    description: '三档尺寸。',
  },
  {
    name: 'href',
    type: 'string',
    defaultValue: "'#'",
    description: '链接地址。',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: '是否禁用。',
  },
];

export const linkSlotRows: DocPropRow[] = [
  {
    name: 'default',
    type: 'slot',
    defaultValue: "'Connect to EDS'",
    description: '链接文案。',
  },
];

export const paginationPropRows: DocPropRow[] = [
  {
    name: 'kind',
    type: "'number' | 'symbol' | 'button' | 'borderArrow'",
    defaultValue: "'number'",
    description: '分页项类型：数字、符号、填充箭头或工具栏边框箭头。',
  },
  {
    name: 'tone',
    type: "'brand' | 'decor'",
    defaultValue: "'decor'",
    description: '色调。',
  },
  {
    name: 'label',
    type: 'string',
    defaultValue: "'0'",
    description: 'kind=number 时显示的数字文案。',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: '是否禁用。',
  },
];

export const paginationSlotRows: DocPropRow[] = [
  {
    name: 'default',
    type: 'slot',
    defaultValue: '-',
    description: 'kind 为 symbol / button / borderArrow 时的图标。',
  },
];
