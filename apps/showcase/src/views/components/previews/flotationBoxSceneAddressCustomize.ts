import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import {
  countSelectOptions,
  propLabelRows,
  showcaseFlotationBoxSelectionModeLabels,
} from '@/data/showcasePropLabels';
import {
  parseFlotationEditBoxIndex,
  parseFlotationItemCount,
  parseFlotationMaxHeight,
  parseFlotationMenuMaxWidth,
  buildFlotationBoxEditRowSelectOptions,
  isFlotationBoxEditingRow,
} from './flotationDocCustomize';
import {
  SCENE_ADDRESS_DROPDOWN_ROWS,
  flotationSceneAddressDropdownItemCount,
} from './flotationBoxSceneAddressPreviewData';

export { flotationSceneAddressDropdownItemCount };

/** 场景化-下拉地址：独立 customize 键（不与标准/级联 Box 共用）。 */
export const sceneAddressStateKey = {
  itemCount: 'sceneItemCount',
  maxWidth: 'sceneMaxWidth',
  maxHeight: 'sceneMaxHeight',
  editBoxIndex: 'sceneEditBoxIndex',
  selectionMode: 'sceneSelectionMode',
} as const;

export function sceneAddressItemKey(
  field: 'Label' | 'Alias' | 'Disabled' | 'Focused' | 'Checked',
  index: number,
): string {
  return `sceneItem${field}${index}`;
}

const sceneItemCountOptions = countSelectOptions(20);

const sceneSelectionModeOptions = propLabelRows(
  ['single', 'multiple'] as const,
  showcaseFlotationBoxSelectionModeLabels,
).map((row) => ({ value: row.key, label: row.label }));

export function parseSceneAddressItemCount(state: Record<string, unknown>): number {
  const raw = state[sceneAddressStateKey.itemCount];
  if (raw == null || String(raw).trim() === '') {
    return flotationSceneAddressDropdownItemCount;
  }
  return parseFlotationItemCount({ itemCount: raw });
}

export function parseSceneAddressEditBoxIndex(state: Record<string, unknown>): number {
  return parseFlotationEditBoxIndex({
    editBoxIndex: state[sceneAddressStateKey.editBoxIndex],
    itemCount: String(parseSceneAddressItemCount(state)),
  });
}

export function isSceneAddressEditingRow(state: Record<string, unknown>): boolean {
  return isFlotationBoxEditingRow({
    editBoxIndex: state[sceneAddressStateKey.editBoxIndex],
  });
}

export function parseSceneAddressMaxHeight(state: Record<string, unknown>): number | undefined {
  return parseFlotationMaxHeight({ maxHeight: state[sceneAddressStateKey.maxHeight] });
}

export function parseSceneAddressMaxWidth(state: Record<string, unknown>): number | undefined {
  return parseFlotationMenuMaxWidth({ maxWidth: state[sceneAddressStateKey.maxWidth] });
}

export function parseSceneAddressSelectionMode(
  state: Record<string, unknown>,
): 'single' | 'multiple' {
  const raw = String(state[sceneAddressStateKey.selectionMode] ?? 'single');
  return raw === 'multiple' ? 'multiple' : 'single';
}

export function createFlotationBoxSceneAddressItemDefaults(): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};

  for (let n = 1; n <= 20; n += 1) {
    const row = SCENE_ADDRESS_DROPDOWN_ROWS[n - 1];
    if (row) {
      out[sceneAddressItemKey('Label', n)] = row.address;
      out[sceneAddressItemKey('Alias', n)] = row.alias ?? '';
      out[sceneAddressItemKey('Disabled', n)] = false;
      out[sceneAddressItemKey('Focused', n)] = false;
      out[sceneAddressItemKey('Checked', n)] = n === 1;
      continue;
    }

    out[sceneAddressItemKey('Label', n)] = `Label ${n}`;
    out[sceneAddressItemKey('Alias', n)] = '';
    out[sceneAddressItemKey('Disabled', n)] = false;
    out[sceneAddressItemKey('Focused', n)] = false;
    out[sceneAddressItemKey('Checked', n)] = false;
  }

  return out;
}

export const flotationBoxSceneAddressCustomizeDefaults = {
  [sceneAddressStateKey.itemCount]: String(flotationSceneAddressDropdownItemCount),
  [sceneAddressStateKey.maxWidth]: '480',
  [sceneAddressStateKey.maxHeight]: '306',
  [sceneAddressStateKey.editBoxIndex]: '',
  [sceneAddressStateKey.selectionMode]: 'single',
  ...createFlotationBoxSceneAddressItemDefaults(),
} as const;

/** 切换至「场景化-下拉地址」时合并到 customize state。 */
export function applyFlotationBoxSceneAddressPreset(state: Record<string, unknown>): void {
  Object.assign(state, flotationBoxSceneAddressCustomizeDefaults);
}

function buildSceneAddressItemRowControls(
  editIndex: number,
  showSelection: boolean,
): DocCustomizeControl[] {
  const controls: DocCustomizeControl[] = [
    {
      kind: 'text',
      key: sceneAddressItemKey('Label', editIndex),
      label: showcaseText('Address', '地址'),
      row: 1,
    },
    {
      kind: 'text',
      key: sceneAddressItemKey('Alias', editIndex),
      label: showcaseText('Alias', '别名'),
      placeholder: showcaseText('Optional', '可选'),
      row: 2,
    },
    {
      kind: 'boolean',
      key: sceneAddressItemKey('Disabled', editIndex),
      label: showcaseText('Disabled', '禁用'),
      row: 3,
    },
  ];

  if (showSelection) {
    controls.push({
      kind: 'boolean',
      key: sceneAddressItemKey('Checked', editIndex),
      label: showcaseText('Selected', '选中'),
      row: 4,
    });
  }

  return controls;
}

/** 场景化地址 — 独立 Customize 面板（不修改标准/级联 Box 控件）。 */
export function buildFlotationBoxSceneAddressPanelControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const count = parseSceneAddressItemCount(state);
  const editing = isSceneAddressEditingRow(state);
  const editIndex = parseSceneAddressEditBoxIndex(state);
  const isHover = String(state.boxKind ?? '') === 'scene-address-hover';

  const controls: DocCustomizeControl[] = [
    {
      kind: 'select',
      key: sceneAddressStateKey.itemCount,
      label: showcaseText('# of Lines', '行数'),
      options: sceneItemCountOptions,
      row: 0,
    },
    {
      kind: 'text',
      key: sceneAddressStateKey.maxWidth,
      label: showcaseText('Max. width (%)', '最大宽度'),
      placeholder: 'px',
      row: 0,
    },
    {
      kind: 'text',
      key: sceneAddressStateKey.maxHeight,
      label: showcaseText('maxHeight', '最大高度'),
      placeholder: 'px',
      row: 0,
    },
  ];

  if (!isHover) {
    controls.push({
      kind: 'select',
      key: sceneAddressStateKey.selectionMode,
      label: showcaseText('Select mode', '选择模式'),
      options: sceneSelectionModeOptions,
      row: 0,
    });
  }

  controls.push({
    kind: 'select',
    key: sceneAddressStateKey.editBoxIndex,
    label: showcaseText('Edit row', '编辑行'),
    options: buildFlotationBoxEditRowSelectOptions(count),
    row: 1,
  });

  if (editing) {
    controls.push(
      ...buildSceneAddressItemRowControls(editIndex, !isHover).map((control) => ({
        ...control,
        row: (control.row ?? 1) + 1,
      })),
    );
  }

  return controls;
}

export function enforceSceneAddressSingleSelection(state: Record<string, unknown>): void {
  if (parseSceneAddressSelectionMode(state) !== 'single') return;
  const count = parseSceneAddressItemCount(state);
  let selected = 0;
  for (let n = 1; n <= count; n += 1) {
    if (Boolean(state[sceneAddressItemKey('Checked', n)])) selected = n;
  }
  if (selected === 0) return;
  for (let n = 1; n <= count; n += 1) {
    state[sceneAddressItemKey('Checked', n)] = n === selected;
  }
}
