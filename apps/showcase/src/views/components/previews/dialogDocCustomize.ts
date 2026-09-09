import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import {
  dialogComposeFlotationToolbarControls,
  dialogPopupWindowControls,
  dialogStandardFlotationToolbarControls,
} from './buttonDocCustomize';

export {
  dialogComposeFlotationToolbarControls,
  dialogPopupWindowControls,
  dialogStandardFlotationToolbarControls,
} from './buttonDocCustomize';

export const DIALOG_TYPES = ['symbol', 'standard', 'compose'] as const;
export type DialogCustomizeType = (typeof DIALOG_TYPES)[number];

export const dialogFigmaNode = '2769:8357';

export type DialogSymbolBackground = 'default' | 'danger' | 'success';

const COMPOSE_BODY_TEXT =
  'Compose content\n\nScroll to preview frosted toolbar blur.';

const dialogNeutralCustomizeState = {
  type: 'symbol' as DialogCustomizeType,
  title: 'Title',
  showSecondaryText: true,
  secondaryText: 'This is a description',
  symbolIcon: 'eds-warning-lonely',
  symbolBackground: 'default' as 'default' | 'danger' | 'success',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  actionCount: '2',
  showClear: false,
  clearLabel: 'Clear',
  toolbarTone: 'decor',
  toolbarVariant: 'solid',
  toolbarDividerPinned: false,
  composeText: COMPOSE_BODY_TEXT,
};

export function buildDialogCustomizeDefaults(
  type: DialogCustomizeType,
): typeof dialogNeutralCustomizeState {
  return {
    ...dialogNeutralCustomizeState,
    type,
    toolbarDividerPinned: type === 'compose',
  };
}

export const dialogCustomizeDefaults = buildDialogCustomizeDefaults('symbol');

export function applyDialogTypeLayout(
  state: Record<string, unknown>,
  type: DialogCustomizeType,
): void {
  state.type = type;
  state.showClear = false;

  if (type === 'compose') {
    state.toolbarDividerPinned = true;
    return;
  }

  if (type === 'standard') {
    state.toolbarDividerPinned = false;
  }
}

export function buildDialogCustomizeControls(
  type: DialogCustomizeType,
): DocCustomizeControl[] {
  const controls: DocCustomizeControl[] = [
    { kind: 'text', key: 'title', label: '标题', row: 0 },
  ];

  if (type === 'symbol') {
    controls.push(
      { kind: 'boolean', key: 'showSecondaryText', label: '显示副文案' },
      {
        kind: 'text',
        key: 'secondaryText',
        label: '副文案',
        visibleWhen: (s) => s.showSecondaryText !== false,
      },
      {
        kind: 'text',
        key: 'symbolIcon',
        label: '符号',
        placeholder: 'eds-warning-lonely',
      },
      {
        kind: 'select',
        key: 'symbolBackground',
        label: '背景色',
        options: [
          { value: 'default', label: '默认' },
          { value: 'danger', label: '危险' },
          { value: 'success', label: '成功' },
        ],
      },
    );
  } else if (type === 'standard') {
    controls.push(
      { kind: 'boolean', key: 'showSecondaryText', label: '显示正文', row: 0 },
      {
        kind: 'text',
        key: 'secondaryText',
        label: '正文',
        row: 0,
        visibleWhen: (s) => s.showSecondaryText !== false,
      },
    );
  } else {
    controls.push(
      { kind: 'boolean', key: 'showSecondaryText', label: '显示 Bar' },
      {
        kind: 'text',
        key: 'secondaryText',
        label: 'Bar',
        visibleWhen: (s) => s.showSecondaryText !== false,
      },
      { kind: 'text', key: 'composeText', label: 'Compose 内容' },
    );
  }

  return controls;
}

/** Symbol 场景默认控件（`buildDialogCustomizeControls('symbol')`）。 */
export const dialogCustomizeControls = buildDialogCustomizeControls('symbol');

export function buildDialogSymbolStyle(
  symbolBackground: DialogSymbolBackground | string,
): Record<string, string> | undefined {
  if (symbolBackground === 'danger') {
    return {
      '--eds-dialog-symbol-bg': 'var(--status-danger)',
      '--eds-dialog-symbol-color': 'var(--stroke-same-white-primary)',
    };
  }

  if (symbolBackground === 'success') {
    return {
      '--eds-dialog-symbol-bg': 'var(--status-success)',
      '--eds-dialog-symbol-color': 'var(--stroke-same-white-primary)',
    };
  }

  return undefined;
}

export const dialogPropRows: DocPropRow[] = [
  {
    name: 'type',
    type: "'symbol' | 'compose' | 'standard'",
    defaultValue: "'symbol'",
    description:
      'Symbol：符号 + 居中文案 + PopupWindow；Compose：Title/Bar + 内容区 + Flotation 工具栏；Standard：Title + 正文 + Flotation 工具栏。',
  },
  {
    name: 'title',
    type: 'string',
    defaultValue: "'Title'",
    description: 'Symbol：Body Large Strong；Compose / Standard：Title 角色。',
  },
  {
    name: 'secondaryText',
    type: 'string',
    defaultValue: "'This is a description'",
    description: 'Symbol：Body Small 副文案；Standard：Body Medium 正文；Compose：Bar 角色。',
  },
  { name: 'showSecondaryText', type: 'boolean', defaultValue: 'true', description: '是否展示副文案。' },
  { name: 'confirmLabel', type: 'string', defaultValue: "'Confirm'", description: '主按钮文案。' },
  {
    name: 'cancelLabel',
    type: 'string',
    defaultValue: "'Cancel'",
    description: '次按钮文案（Compose / Standard · Flotation；Symbol · PopupWindow）。',
  },
  { name: 'actionCount', type: '1 | 2', defaultValue: '2', description: 'Symbol · EgComboPopupButton 按钮数。' },
  { name: 'showClear', type: 'boolean', defaultValue: 'false', description: 'Compose · 工具栏左侧 Clear。' },
  { name: 'clearLabel', type: 'string', defaultValue: "'Clear'", description: 'Compose · Clear 文案。' },
  { name: 'toolbarTone', type: "'brand' | 'decor'", defaultValue: "'decor'", description: '操作区按钮 Tone。' },
  {
    name: 'toolbarDividerPinned',
    type: 'boolean',
    defaultValue: 'compose → true；standard → false',
    description: 'Compose / Standard · 工具栏顶部分割线常驻；false 时仅在底部仍有内容被裁切时显示。',
  },
];

export const dialogSlotRows: DocPropRow[] = [
  {
    name: 'symbol',
    type: 'slot',
    defaultValue: 'EgIcon eds-warning-lonely',
    description: 'Symbol 类型 · 56px 圆形容器内符号；可用 CSS 变量 `--eds-dialog-symbol-bg` / `--eds-dialog-symbol-color` 覆盖。',
  },
  {
    name: 'default',
    type: 'slot',
    defaultValue: '—',
    description: 'Compose / Standard 类型 · 标题区下方的自定义内容区。',
  },
  {
    name: 'actions',
    type: 'slot',
    defaultValue: 'EgComboPopupButton / EgComboFloatButton',
    description: '操作区；默认按 type 渲染 PopupWindow 或 Flotation，可整体替换。',
  },
];

export const dialogEventRows: DocPropRow[] = [
  { name: 'confirm', type: '() => void', defaultValue: '—', description: '点击主按钮时触发。' },
  { name: 'cancel', type: '() => void', defaultValue: '—', description: '点击次按钮时触发。' },
  { name: 'clear', type: '() => void', defaultValue: '—', description: 'Compose · 点击 Clear 时触发。' },
];

export const dialogImportCode = `import { EgDialog, EgPopup } from '@eds/desktop-components';`;

export const DIALOG_SCENE_COMPONENT_TAG = {
  symbol: 'EgSymbolDialog',
  compose: 'EgBusinessDialog',
  standard: 'EgDialog',
} as const;

export type DialogSceneVariant = keyof typeof DIALOG_SCENE_COMPONENT_TAG;

export function resolveDialogSceneComponentTag(variant: DialogSceneVariant): string {
  return DIALOG_SCENE_COMPONENT_TAG[variant];
}

export function resolveDialogSceneImportCode(variant: DialogSceneVariant): string {
  const tag = resolveDialogSceneComponentTag(variant);
  return `import { ${tag}, EgPopup } from '@eds/desktop-components';`;
}
