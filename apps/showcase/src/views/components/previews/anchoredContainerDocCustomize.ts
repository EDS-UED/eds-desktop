import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import {
  alignStartEndRows,
  heightModeRows,
  placementRows,
  showcaseFlotationCustomizeFieldLabels,
  widthModeAdaptiveFixedRows,
  widthModeTriggerFixedAdaptiveRows,
} from '@/data/showcasePropLabels';

const L = showcaseFlotationCustomizeFieldLabels;

export type AnchoredContainerWidthModeVariant = 'trigger-fixed-adaptive' | 'adaptive-fixed';

export type AnchoredContainerWidthModeOption = {
  key: string;
  label: string;
};

export type AnchoredContainerPanelOptions = {
  widthModeVariant?: AnchoredContainerWidthModeVariant;
  widthModeOptions?: AnchoredContainerWidthModeOption[];
  rowOffset?: number;
  includeAlign?: boolean;
  includeOffset?: boolean;
  alignVisibleWhen?: (state: Record<string, unknown>) => boolean;
};

function resolveWidthModeOptions(
  options: AnchoredContainerPanelOptions,
): AnchoredContainerWidthModeOption[] {
  if (options.widthModeOptions?.length) {
    return options.widthModeOptions;
  }
  const rows =
    options.widthModeVariant === 'trigger-fixed-adaptive'
      ? widthModeTriggerFixedAdaptiveRows
      : widthModeAdaptiveFixedRows;
  return rows.map((row) => ({ key: row.key, label: row.label }));
}

/** 锚定浮层容器几何：弹出方向 / 偏移 / 宽 / 高（与 Flotation Combo 主定制一致）。 */
export function buildAnchoredContainerPanelControls(
  state: Record<string, unknown>,
  options: AnchoredContainerPanelOptions = {},
): DocCustomizeControl[] {
  const {
    rowOffset = 0,
    includeAlign = true,
    includeOffset = true,
  } = options;

  const widthMode = String(state.widthMode ?? 'fixed');
  const showCustomAlign =
    options.alignVisibleWhen?.(state)
    ?? (includeAlign && (widthMode === 'fixed' || widthMode === 'adaptive'));
  const widthModeOptions = resolveWidthModeOptions(options);

  const r0 = rowOffset;
  const r1 = rowOffset + 1;
  const r2 = rowOffset + 2;

  const controls: DocCustomizeControl[] = [
    {
      kind: 'select',
      key: 'placement',
      label: L.placement,
      row: r0,
      options: placementRows.map((row) => ({ value: row.key, label: row.label })),
    },
    { kind: 'text', key: 'crossAxisOffset', label: L.crossAxisOffset, row: r0 },
  ];

  if (includeOffset) {
    controls.push({
      kind: 'text',
      key: 'offset',
      label: L.offset,
      placeholder: showcaseText('Default 1px.', '默认 1px'),
      row: r0,
    });
  }

  controls.push(
    {
      kind: 'select',
      key: 'widthMode',
      label: L.widthMode,
      row: r1,
      options: widthModeOptions.map((row) => ({ value: row.key, label: row.label })),
    },
    {
      kind: 'text',
      key: 'width',
      label: L.width,
      row: r1,
      visibleWhen: (s) => String(s.widthMode ?? 'fixed') === 'fixed',
    },
  );

  if (includeAlign) {
    controls.push({
      kind: 'select',
      key: 'align',
      label: L.align,
      row: r1,
      options: alignStartEndRows.map((row) => ({ value: row.key, label: row.label })),
      visibleWhen: () => showCustomAlign,
    });
  }

  controls.push(
    {
      kind: 'select',
      key: 'heightMode',
      label: L.heightMode,
      row: r2,
      options: heightModeRows.map((row) => ({ value: row.key, label: row.label })),
    },
    {
      kind: 'text',
      key: 'height',
      label: L.height,
      row: r2,
      visibleWhen: (s) => String(s.heightMode ?? 'adaptive') === 'fixed',
    },
    {
      kind: 'text',
      key: 'maxHeight',
      label: L.maxHeight,
      placeholder: showcaseText('Optional', '可选'),
      row: r2,
      visibleWhen: (s) => String(s.heightMode ?? 'adaptive') === 'adaptive',
    },
  );

  return controls;
}

export function parseAnchoredContainerOptionalInt(raw: unknown): number | undefined {
  const trimmed = String(raw ?? '').trim();
  if (trimmed === '') return undefined;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}
