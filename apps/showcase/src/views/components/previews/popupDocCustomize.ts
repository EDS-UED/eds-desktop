import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import { buttonToneRows, buttonVariantRows, directionLeftRightRows, showcaseButtonCustomizeFieldLabels } from '@/data/showcasePropLabels';

export const popupCustomBoxSizePresets = {
  lg: { width: 880, height: 620 },
  md: { width: 780, height: 560 },
  sm: { width: 656, height: 516 },
} as const;

export type PopupCustomBoxSizePreset = keyof typeof popupCustomBoxSizePresets | 'custom';

export const popupCustomBoxSizeDefaults = {
  customBoxSizePreset: 'md' as PopupCustomBoxSizePreset,
  boxWidth: '780',
  boxHeight: '560',
};

export const popupCustomBoxSizePresetControl: DocCustomizeControl = {
  kind: 'select',
  key: 'customBoxSizePreset',
  label: showcaseText('Size', '尺寸'),
  visibleWhen: (state) => state.uses === 'custom',
  options: [
    { value: 'lg', label: showcaseText('Large lg (880 × 620)', '大 lg (880×620)') },
    { value: 'md', label: showcaseText('Medium md (780 × 560)', '中 md (780×560)') },
    { value: 'sm', label: showcaseText('Small sm (656 × 516)', '小 sm (656×516)') },
    { value: 'custom', label: showcaseText('Custom', '自定义') },
  ],
};

export const popupCustomContentInsetPresets = {
  lg: 'var(--spacing-3)',
  md: 'var(--spacing-2)',
  sm: 'var(--spacing-1)',
  xs: 'var(--spacing-0)',
} as const;

export type PopupCustomContentInsetPreset = keyof typeof popupCustomContentInsetPresets;

export const popupCustomContentInsetDefaults = {
  customContentInsetPreset: 'lg' as PopupCustomContentInsetPreset,
};

export const popupCustomContentInsetPresetControl: DocCustomizeControl = {
  kind: 'select',
  key: 'customContentInsetPreset',
  label: showcaseText('margin', '边距'),
  visibleWhen: (state) => state.uses === 'custom',
  options: [
    { value: 'lg', label: showcaseText('Margins Lg · spacing-3', '边距 Lg · spacing-3') },
    { value: 'md', label: showcaseText('Margins Md · spacing-2', '边距 Md · spacing-2') },
    { value: 'sm', label: showcaseText('Margins Sm · spacing-1', '边距 Sm · spacing-1') },
    { value: 'xs', label: showcaseText('Margins Xs · spacing-0', '边距 Xs · spacing-0') },
  ],
};

export function resolvePopupCustomContentInsetPreset(
  state: Record<string, unknown>,
): PopupCustomContentInsetPreset {
  const preset = String(
    state.customContentInsetPreset ?? popupCustomContentInsetDefaults.customContentInsetPreset,
  );

  if (preset in popupCustomContentInsetPresets) {
    return preset as PopupCustomContentInsetPreset;
  }

  return popupCustomContentInsetDefaults.customContentInsetPreset;
}

export function resolvePopupCustomContentInsetPadding(state: Record<string, unknown>): string {
  return popupCustomContentInsetPresets[resolvePopupCustomContentInsetPreset(state)];
}

export function isPopupCustomBoxSizePresetCustom(state: Record<string, unknown>): boolean {
  return String(state.customBoxSizePreset ?? popupCustomBoxSizeDefaults.customBoxSizePreset) === 'custom';
}

export function resolvePopupCustomBoxSize(state: Record<string, unknown>): {
  width: number;
  height: number;
} {
  const preset = String(state.customBoxSizePreset ?? popupCustomBoxSizeDefaults.customBoxSizePreset);

  if (preset === 'custom') {
    const width = Number.parseInt(String(state.boxWidth ?? popupCustomBoxSizeDefaults.boxWidth), 10);
    const height = Number.parseInt(String(state.boxHeight ?? popupCustomBoxSizeDefaults.boxHeight), 10);
    return {
      width: Number.isFinite(width) ? width : 780,
      height: Number.isFinite(height) ? height : 560,
    };
  }

  const resolved = popupCustomBoxSizePresets[preset as keyof typeof popupCustomBoxSizePresets];
  if (resolved) {
    return { width: resolved.width, height: resolved.height };
  }

  return {
    width: popupCustomBoxSizePresets.md.width,
    height: popupCustomBoxSizePresets.md.height,
  };
}

/** Popup uses=custom 默认插槽 — 仅系统 chrome，与 Detail 文档页 customize 键独立。 */
export const popupCustomChromeDefaults = {
  customShowSystemBarClose: true,
  customShowToolbar: true,
  customShowToolbarButtons: true,
  customShowToolbarCancel: true,
  customShowScrollBody: false,
  customDemoToolbarSlot: false,
  customToolbarTone: 'decor',
  customToolbarVariant: 'solid',
  customToolbarCancelTone: 'decor',
  customToolbarCancelVariant: 'text',
  customToolbarConfirmLabel: 'Confirm',
  customToolbarCancelLabel: 'Cancel',
  customToolbarDirection: 'right',
  customToolbarDividerPinned: false,
} as const;

function isPopupCustomToolbarOn(state: Record<string, unknown>): boolean {
  return Boolean(state.customShowToolbar ?? popupCustomChromeDefaults.customShowToolbar);
}

function isPopupCustomToolbarButtonsOn(state: Record<string, unknown>): boolean {
  return (
    isPopupCustomToolbarOn(state)
    && Boolean(state.customShowToolbarButtons ?? popupCustomChromeDefaults.customShowToolbarButtons)
  );
}

export const popupCustomChromeSlotRows: DocPropRow[] = [
  {
    name: 'default',
    type: 'slot',
    defaultValue: '-',
    description: showcaseText('The business content of the scrolling area; the margins are controlled by the Popup Box content area inset (Xs is 0, the business supports itself). Showcase uses placeholder blocks to demonstrate overflow and top fading when not passing.', '滚动区业务内容；边距由 Popup Box 内容区 inset 控制（Xs 为 0，业务自行撑开）。未传时 Showcase 用占位块演示溢出与顶部渐隐。'),
  },
  {
    name: 'toolbar',
    type: 'slot',
    defaultValue: '-',
    description: showcaseText('Toolbar attachment area (e.g., left-hand side description, filters); can exist with built-in Cancel/Confirm.', '工具栏附加区（如左侧说明、筛选）；与内置 Cancel / Confirm 可同时存在。'),
  },
];

export const popupCustomSystemBarCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'customShowSystemBarClose', label: showcaseText('ShowOffButton', '显示关闭按钮') },
];

export const popupCustomContentCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'boolean',
    key: 'customShowScrollBody',
    label: showcaseText('default Slot', 'default 插槽'),
  },
];

export const popupCustomToolbarCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'customShowToolbar', label: showcaseText('ShowToolbar', '显示工具栏'), row: 0 },
  {
    kind: 'boolean',
    key: 'customDemoToolbarSlot',
    label: showcaseText('toolbar Slot', 'toolbar 插槽'),
    row: 1,
    visibleWhen: isPopupCustomToolbarOn,
  },
  {
    kind: 'boolean',
    key: 'customToolbarDividerPinned',
    label: showcaseText('Dividers resident', '分割线常驻'),
    row: 2,
    visibleWhen: isPopupCustomToolbarOn,
  },
  {
    kind: 'boolean',
    key: 'customShowToolbarButtons',
    label: showcaseText('Show Action', '显示 Action'),
    row: 3,
    visibleWhen: isPopupCustomToolbarOn,
  },
  {
    kind: 'select',
    key: 'customToolbarTone',
    label: showcaseText('Primary button tone', '主按钮 tone'),
    row: 3,
    options: buttonToneRows
      .filter((row) => ['brand', 'decor', 'danger'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: isPopupCustomToolbarButtonsOn,
  },
  {
    kind: 'select',
    key: 'customToolbarVariant',
    label: showcaseText('Primary Button Style', '主按钮风格'),
    row: 3,
    options: buttonVariantRows.map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: isPopupCustomToolbarButtonsOn,
  },
  {
    kind: 'text',
    key: 'customToolbarConfirmLabel',
    label: showcaseButtonCustomizeFieldLabels.confirmLabel,
    row: 3,
    visibleWhen: isPopupCustomToolbarButtonsOn,
  },
  {
    kind: 'boolean',
    key: 'customShowToolbarCancel',
    label: showcaseText('Secondary Button (Cancel)', '次按钮（Cancel）'),
    row: 4,
    visibleWhen: isPopupCustomToolbarButtonsOn,
  },
  {
    kind: 'select',
    key: 'customToolbarCancelTone',
    label: showcaseText('Secondary button tone', '次按钮 tone'),
    row: 4,
    options: buttonToneRows
      .filter((row) => ['brand', 'decor', 'danger'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: (state) =>
      isPopupCustomToolbarButtonsOn(state) && Boolean(state.customShowToolbarCancel),
  },
  {
    kind: 'select',
    key: 'customToolbarCancelVariant',
    label: showcaseText('Secondary Button Style', '次按钮风格'),
    row: 4,
    options: buttonVariantRows.map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: (state) =>
      isPopupCustomToolbarButtonsOn(state) && Boolean(state.customShowToolbarCancel),
  },
  {
    kind: 'text',
    key: 'customToolbarCancelLabel',
    label: showcaseButtonCustomizeFieldLabels.cancelLabel,
    row: 4,
    visibleWhen: (state) =>
      isPopupCustomToolbarButtonsOn(state) && Boolean(state.customShowToolbarCancel),
  },
  {
    kind: 'select',
    key: 'customToolbarDirection',
    label: showcaseButtonCustomizeFieldLabels.direction,
    row: 5,
    options: directionLeftRightRows.map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: isPopupCustomToolbarButtonsOn,
  },
];

export function resolvePopupCustomSystemBarProps(state: Record<string, unknown>) {
  return {
    showSystemBarClose: Boolean(
      state.customShowSystemBarClose ?? popupCustomChromeDefaults.customShowSystemBarClose,
    ),
  };
}

export function resolvePopupCustomToolbarProps(state: Record<string, unknown>) {
  return {
    showToolbar: isPopupCustomToolbarOn(state),
    showToolbarButtons: isPopupCustomToolbarButtonsOn(state),
    showToolbarCancel: Boolean(
      state.customShowToolbarCancel ?? popupCustomChromeDefaults.customShowToolbarCancel,
    ),
    showScrollBody: Boolean(state.customShowScrollBody ?? popupCustomChromeDefaults.customShowScrollBody),
    toolbarTone: (state.customToolbarTone ?? popupCustomChromeDefaults.customToolbarTone) as
      | 'brand'
      | 'decor'
      | 'danger',
    toolbarVariant: (state.customToolbarVariant
      ?? popupCustomChromeDefaults.customToolbarVariant) as 'solid' | 'outline' | 'text',
    toolbarCancelTone: (state.customToolbarCancelTone
      ?? popupCustomChromeDefaults.customToolbarCancelTone) as 'brand' | 'decor' | 'danger',
    toolbarCancelVariant: (state.customToolbarCancelVariant
      ?? popupCustomChromeDefaults.customToolbarCancelVariant) as 'solid' | 'outline' | 'text',
    toolbarConfirmLabel: String(
      state.customToolbarConfirmLabel ?? popupCustomChromeDefaults.customToolbarConfirmLabel,
    ),
    toolbarCancelLabel: String(
      state.customToolbarCancelLabel ?? popupCustomChromeDefaults.customToolbarCancelLabel,
    ),
    toolbarDirection: (state.customToolbarDirection
      ?? popupCustomChromeDefaults.customToolbarDirection) as 'left' | 'right',
    toolbarDividerPinned: Boolean(
      state.customToolbarDividerPinned ?? popupCustomChromeDefaults.customToolbarDividerPinned,
    ),
    useToolbarSlot: Boolean(state.customDemoToolbarSlot),
  };
}
