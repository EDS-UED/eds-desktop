import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import { cryptoNames, getProcessedCrypto } from '@eds/desktop-components';
import {
  buildVueOpeningTag,
  buildVueSelfClosingSnippet,
} from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  alignStartEndRows,
  buttonSizeRows,
  countSelectOptions,
  flotationBoxTypeRows,
  flotationTriggerStyleRows,
  heightModeRows,
  placementRows,
  propLabelRows,
  showcaseFlotationBoxTypeLabels,
  showcaseFlotationBoxKindLabels,
  showcaseFlotationComboBoxSceneLabels,
  showcaseFlotationBoxSelectionModeLabels,
  showcaseFlotationTriggerKindLabels,
  showcaseFormSubmissionTypeLabels,
  showcaseInputCustomizeFieldLabels,
  showcaseMessageTypeLabels,
  showcaseTagStatusLabels,
  widthModeTriggerFixedAdaptiveRows,
  tokenLabel,
} from '@/data/showcasePropLabels';
import { formSubmissionCustomizeDefaults, buildFormSubmissionExpandCustomizeControls } from './feedbackDocCustomize';
import { buildAnchoredContainerPanelControls } from './anchoredContainerDocCustomize';
import { buildFlotationBoxSceneAddressPanelControls } from './flotationBoxSceneAddressCustomize';

const flotationSymbolPositionInlineSelect = {
  key: 'symbolPosition',
  label: showcaseText('IconPosition', '图标位置'),
  options: [
    { value: 'leading', label: showcaseText('Kiri', '左') },
    { value: 'trailing', label: showcaseText('Right', '右') },
  ],
};

export const flotationImportCode = `import {
  EgFlotation,
  EgFlotationTrigger,
  EgFlotationMenu,
  EgFlotationMenuItem,
} from '@eds/desktop-components';`;

export const flotationTriggerImportCode = `import {
  EgComboInput,
  EgFlotationTrigger,
  EgFormSubmission,
} from '@eds/desktop-components';`;

export const flotationBoxImportCode = `import {
  EgFlotationMenu,
  EgFlotationMenuItem,
} from '@eds/desktop-components';`;

export const flotationItemImportCode = `import { EgFlotationMenuItem } from '@eds/desktop-components';`;

/* ── Overview：触发器 Trigger / Menu / Box ── */

export const flotationTagStatusOptions = propLabelRows(
  ['danger', 'warning', 'success', 'ready', 'invalid'] as const,
  showcaseTagStatusLabels,
).map((row) => ({ value: row.key, label: row.label }));

export const flotationMessageTypeOptions = propLabelRows(
  ['subtle', 'brand', 'danger'] as const,
  showcaseMessageTypeLabels,
).map((row) => ({ value: row.key, label: row.label }));

export const flotationItemCountOptions = countSelectOptions(20);

const flotationBoxTypeOptions = propLabelRows(
  ['text', 'symbol-text', 'image-text'] as const,
  showcaseFlotationBoxTypeLabels,
).map((row) => ({ value: row.key, label: row.label }));

export const flotationDefaultCryptoAsset = 'eds-aave-aave';

const flotationCryptoOptions = cryptoNames
  .filter((name) => Boolean(getProcessedCrypto(name)))
  .map((name) => ({ value: name, label: name }));

export function flotationBoxItemLeadingDefault(
  boxType: 'text' | 'symbol-text' | 'image-text',
): string {
  return boxType === 'image-text' ? flotationDefaultCryptoAsset : 'eds-add';
}

/** Per-row Box 字段 key（与 Box 页可调项对齐） */
export function flotationBoxItemKey(
  field:
    | 'Label'
    | 'BoxType'
    | 'Disabled'
    | 'Focused'
    | 'ShowCheckbox'
    | 'Checked'
    | 'ShowTag'
    | 'TagText'
    | 'TagStatus'
    | 'ShowReddot'
    | 'ShowCascader'
    | 'ShowMessage'
    | 'MessageText'
    | 'MessageType'
    | 'SymbolIcon',
  index: number,
): string {
  return `item${field}${index}`;
}

export function createFlotationBoxItemDefaults(): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let n = 1; n <= 20; n += 1) {
    out[flotationBoxItemKey('Label', n)] = `Label ${n}`;
    out[flotationBoxItemKey('Disabled', n)] = false;
    out[flotationBoxItemKey('Focused', n)] = false;
    out[flotationBoxItemKey('Checked', n)] = false;
    out[flotationBoxItemKey('ShowTag', n)] = false;
    out[flotationBoxItemKey('TagText', n)] = 'Tag';
    out[flotationBoxItemKey('TagStatus', n)] = 'danger';
    out[flotationBoxItemKey('ShowReddot', n)] = false;
    out[flotationBoxItemKey('ShowCascader', n)] = false;
    out[flotationBoxItemKey('ShowMessage', n)] = false;
    out[flotationBoxItemKey('MessageText', n)] = '0';
    out[flotationBoxItemKey('MessageType', n)] = 'subtle';
    out[flotationBoxItemKey('SymbolIcon', n)] = 'eds-add';
  }
  return out;
}

export function parseFlotationItemCount(state: Record<string, unknown>): number {
  const parsed = Number.parseInt(String(state.itemCount ?? '8'), 10);
  return Number.isFinite(parsed) ? Math.min(20, Math.max(1, parsed)) : 8;
}

export const flotationEditBoxNoneValue = '';

export function isFlotationBoxEditingRow(state: Record<string, unknown>): boolean {
  const raw = String(state.editBoxIndex ?? '').trim();
  if (raw === '' || raw === 'none') return false;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 1;
}

export function buildFlotationBoxEditRowSelectOptions(count: number) {
  return [
    { value: flotationEditBoxNoneValue, label: showcaseText('Select row to start editing', '选择行开始编辑') },
    ...Array.from({ length: count }, (_, index) => {
      const n = index + 1;
      return { value: String(n), label: `第 ${n} 行` };
    }),
  ];
}

export function parseFlotationEditBoxIndex(state: Record<string, unknown>): number {
  const count = parseFlotationItemCount(state);
  const raw = String(state.editBoxIndex ?? '').trim();
  if (raw === '' || raw === 'none') return 1;
  const parsed = Number.parseInt(raw, 10);
  const index = Number.isFinite(parsed) ? parsed : 1;
  return Math.min(count, Math.max(1, index));
}

export function parseFlotationBoxItemType(
  state: Record<string, unknown>,
): 'text' | 'symbol-text' | 'image-text' {
  const raw = String(state.boxItemType ?? 'text');
  if (raw === 'symbol-text' || raw === 'image-text') return raw;
  return 'text';
}

export type FlotationBoxSelectionMode = 'single' | 'multiple';

export function parseFlotationBoxSelectionMode(
  state: Record<string, unknown>,
): FlotationBoxSelectionMode {
  return String(state.boxSelectionMode ?? 'single') === 'multiple' ? 'multiple' : 'single';
}

export function enforceFlotationSingleSelection(state: Record<string, unknown>): void {
  if (parseFlotationBoxSelectionMode(state) !== 'single') return;
  const count = parseFlotationItemCount(state);
  let selected = 0;
  for (let n = 1; n <= count; n += 1) {
    if (Boolean(state[flotationBoxItemKey('Checked', n)])) selected = n;
  }
  if (selected === 0) return;
  for (let n = 1; n <= count; n += 1) {
    state[flotationBoxItemKey('Checked', n)] = n === selected;
  }
}

const flotationBoxSelectionModeOptions = propLabelRows(
  ['single', 'multiple'] as const,
  showcaseFlotationBoxSelectionModeLabels,
).map((row) => ({ value: row.key, label: row.label }));

export function parseFlotationCrossAxisOffset(
  state: Record<string, unknown>,
): number | undefined {
  const raw = String(state.crossAxisOffset ?? '').trim();
  if (raw === '') return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseFlotationOffset(state: Record<string, unknown>): number | undefined {
  const raw = String(state.offset ?? '').trim();
  if (raw === '') return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseFlotationMaxHeight(
  state: Record<string, unknown>,
): number | undefined {
  const raw = String(state.maxHeight ?? '').trim();
  if (raw === '') return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseFlotationMenuWidth(
  state: Record<string, unknown>,
): number | undefined {
  const raw = String(state.width ?? '').trim();
  if (raw === '') return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseFlotationMenuMaxWidth(
  state: Record<string, unknown>,
): number | undefined {
  const raw = String(state.maxWidth ?? '').trim();
  if (raw === '') return undefined;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/** Box / Module Menu 标题浮层演示项（支付类文案，10 条）。 */
const flotationBoxPageDemoPaymentLabels = [
  'Aurora Merchant',
  'Borealis Acquire',
  'Cascade Disburse',
  'Delta Escrow',
  'Ember Exchange',
  'Flint Ledger',
  'Granite Invoice',
  'Harbor Transit',
  'Ivory Vault',
  'Jasper Capture',
] as const;

const flotationBoxPageDemoEnabledRows = new Set([1, 2, 3, 5, 7, 8, 9, 10]);
const flotationBoxPageDemoReddotRows = new Set([3, 4, 5, 7]);

function createFlotationBoxPageDemoItemDefaults(): Record<string, string | boolean> {
  const out = createFlotationBoxItemDefaults();
  const count = flotationBoxPageDemoPaymentLabels.length;

  for (let n = 1; n <= count; n += 1) {
    const enabled = flotationBoxPageDemoEnabledRows.has(n);
    out[flotationBoxItemKey('Label', n)] =
      flotationBoxPageDemoPaymentLabels[n - 1] ?? `Label ${n}`;
    out[flotationBoxItemKey('ShowTag', n)] = true;
    out[flotationBoxItemKey('TagText', n)] = enabled ? 'Enable' : 'Disabled';
    out[flotationBoxItemKey('TagStatus', n)] = enabled ? 'success' : 'danger';
    out[flotationBoxItemKey('ShowReddot', n)] = flotationBoxPageDemoReddotRows.has(n);
  }

  return out;
}

/** 临时演示 customize 快照；仅会话内手动合并，勿写入 page defaults。 */
export const flotationBoxPageDemoCustomizeState = {
  boxKind: 'standard-menu',
  boxItemType: 'text',
  boxSelectionMode: 'single',
  itemCount: '10',
  maxHeight: '540',
  widthMode: 'fixed',
  width: '240',
  maxWidth: '480',
  editBoxIndex: '',
  showAdd: true,
  addLabel: 'Add',
  ...createFlotationBoxPageDemoItemDefaults(),
} as const;

/** Module Menu 标题 EgFlotation Menu 演示快照（默认宽 288）。 */
export const moduleMenuTitleFlotationDemoState = {
  ...flotationBoxPageDemoCustomizeState,
  width: '288',
  addLabel: 'Create Project',
} as const;

export const flotationCustomizeDefaults = {
  triggerKind: 'standard-dropdown',
  placement: 'bottom',
  offset: '',
  crossAxisOffset: '',
  triggerLabel: 'Trigger',
  triggerStyle: 'subtle',
  triggerSize: 'md',
  disabled: false,
  showReddot: false,
  showSymbol: false,
  symbolIcon: 'eds-coin-btc',
  symbolPosition: 'leading',
  showTag: false,
  tagText: 'Tag',
  tagStatus: 'danger',
  showMessage: false,
  messageText: '0',
  messageType: 'brand',
  showAdd: true,
  addLabel: 'Add',
  widthMode: 'fixed',
  width: '280',
  align: 'start',
  heightMode: 'adaptive',
  height: '306',
  maxHeight: '',
  boxItemType: 'text',
  boxSelectionMode: 'single',
  itemCount: '8',
  editBoxIndex: '',
  boxKind: 'standard-menu',
  ...createFlotationBoxItemDefaults(),
};

/** 触发器 Trigger — 对齐 /components/flotation-trigger（纵览页 EgFlotation 状态键） */
/** 纵览页 EgFlotation — 标准下拉框（row0 水平；显示类 boolean 逐行垂直） */
export const flotationTriggerOverviewBodyControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'triggerStyle',
    label: showcaseText('Style', '样式'),
    row: 0,
    options: flotationTriggerStyleRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'triggerSize',
    label: showcaseText('Size', '尺寸'),
    row: 0,
    options: buttonSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'triggerLabel', label: showcaseText('Copy', '文案'), row: 0 },
  { kind: 'boolean', key: 'disabled', label: showcaseText('Disabled', '禁用'), row: 0 },
  { kind: 'boolean', key: 'showSymbol', label: showcaseText('ShowIcon', '显示图标'), row: 1, inlineSelect: flotationSymbolPositionInlineSelect },
  {
    kind: 'text',
    key: 'symbolIcon',
    label: showcaseText('Icon Name', '图标名'),
    row: 2,
    visibleWhen: (s) => Boolean(s.showSymbol),
  },
];

export const flotationTriggerOverviewDropdownControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'showTag', label: showcaseText('Show label.', '显示标签'), row: 3 },
  {
    kind: 'text',
    key: 'tagText',
    label: showcaseText('Tag copy.', '标签文案'),
    row: 4,
    visibleWhen: (s) => Boolean(s.showTag),
  },
  {
    kind: 'select',
    key: 'tagStatus',
    label: showcaseText('TagStatus', '标签状态'),
    row: 4,
    options: [...flotationTagStatusOptions],
    visibleWhen: (s) => Boolean(s.showTag),
  },
  { kind: 'boolean', key: 'showMessage', label: showcaseText('Display message...', '显示消息'), row: 5 },
  {
    kind: 'text',
    key: 'messageText',
    label: showcaseText('Message copy', '消息文案'),
    row: 6,
    visibleWhen: (s) => Boolean(s.showMessage),
  },
  {
    kind: 'select',
    key: 'messageType',
    label: showcaseText('Type of Message', '消息类型'),
    row: 6,
    options: [...flotationMessageTypeOptions],
    visibleWhen: (s) => Boolean(s.showMessage),
  },
];

/** 纵览页 EgFlotation — 模块菜单标题触发器 */
export const flotationTriggerOverviewModuleMenuControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'triggerLabel', label: showcaseText('Copy', '文案'), row: 0 },
  { kind: 'boolean', key: 'showReddot', label: showcaseText('Show red dots', '显示红点'), row: 0 },
  { kind: 'boolean', key: 'disabled', label: showcaseText('Disabled', '禁用'), row: 0 },
];

/** Menu — 宽/高；自定义宽度时可选对齐；主轴默认 spacing-025，offset 可定制；crossAxisOffset 可定制 */
export function buildFlotationMenuPanelControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  return buildAnchoredContainerPanelControls(state, {
    widthModeVariant: 'trigger-fixed-adaptive',
  });
}

/**
 * 当前编辑行的 Item 字段（原 Item 小类；与 boxItemType / boxSelectionMode 配合）
 */
export function buildFlotationItemRowControls(editIndex: number): DocCustomizeControl[] {
  const showTagKey = flotationBoxItemKey('ShowTag', editIndex);
  const showMessageKey = flotationBoxItemKey('ShowMessage', editIndex);

  return [
    {
      kind: 'text',
      key: flotationBoxItemKey('Label', editIndex),
      label: showcaseText('Copy', '文案'),
      row: 1,
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('Disabled', editIndex),
      label: showcaseText('Disabled', '禁用'),
      row: 2,
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('Checked', editIndex),
      label: showcaseText('Selected', '选中'),
      row: 3,
    },
    {
      kind: 'boolean',
      key: showTagKey,
      label: showcaseText('Show label.', '显示标签'),
      row: 4,
    },
    {
      kind: 'text',
      key: flotationBoxItemKey('TagText', editIndex),
      label: showcaseText('Tag copy.', '标签文案'),
      row: 4,
      visibleWhen: (s) => Boolean(s[showTagKey]),
    },
    {
      kind: 'select',
      key: flotationBoxItemKey('TagStatus', editIndex),
      label: showcaseText('TagStatus', '标签状态'),
      options: [...flotationTagStatusOptions],
      row: 4,
      visibleWhen: (s) => Boolean(s[showTagKey]),
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('ShowReddot', editIndex),
      label: showcaseText('red dot', '红点'),
      row: 5,
      exclusiveKey: showMessageKey,
    },
    {
      kind: 'boolean',
      key: flotationBoxItemKey('ShowCascader', editIndex),
      label: showcaseText('Cascading Arrows', '级联箭头'),
      row: 5,
    },
    {
      kind: 'boolean',
      key: showMessageKey,
      label: showcaseText('Display message...', '显示消息'),
      row: 6,
      exclusiveKey: flotationBoxItemKey('ShowReddot', editIndex),
    },
    {
      kind: 'text',
      key: flotationBoxItemKey('MessageText', editIndex),
      label: showcaseText('Message copy', '消息文案'),
      row: 6,
      visibleWhen: (s) => Boolean(s[showMessageKey]),
    },
    {
      kind: 'select',
      key: flotationBoxItemKey('MessageType', editIndex),
      label: showcaseText('Type of Message', '消息类型'),
      row: 6,
      options: [...flotationMessageTypeOptions],
      visibleWhen: (s) => Boolean(s[showMessageKey]),
    },
    {
      kind: 'text',
      key: flotationBoxItemKey('SymbolIcon', editIndex),
      label: showcaseText('Icon Name', '图标名'),
      row: 7,
      visibleWhen: (s) => parseFlotationBoxItemType(s) === 'symbol-text',
    },
    {
      kind: 'select',
      key: flotationBoxItemKey('SymbolIcon', editIndex),
      label: showcaseText('Images', '图片'),
      row: 7,
      options: flotationCryptoOptions,
      visibleWhen: (s) => parseFlotationBoxItemType(s) === 'image-text',
    },
  ];
}

/**
 * Box — row0：行数 + 选择模式 + 类型 + Add + 编辑行（水平）；row1+：当前行 Item 字段
 */
export function buildFlotationBoxPanelControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const count = parseFlotationItemCount(state);
  const editing = isFlotationBoxEditingRow(state);
  const editIndex = parseFlotationEditBoxIndex(state);

  const controls: DocCustomizeControl[] = [
    {
      kind: 'select',
      key: 'itemCount',
      label: showcaseText('# of Lines', '行数'),
      options: flotationItemCountOptions,
      row: 0,
    },
    {
      kind: 'text',
      key: 'maxHeight',
      label: showcaseText('maxHeight', '最大高度'),
      placeholder: 'px',
      row: 0,
    },
    {
      kind: 'select',
      key: 'boxSelectionMode',
      label: showcaseText('Select mode', '选择模式'),
      options: flotationBoxSelectionModeOptions,
      row: 0,
    },
    {
      kind: 'select',
      key: 'boxItemType',
      label: showcaseText('Type', '类型'),
      options: flotationBoxTypeOptions,
      row: 0,
    },
    { kind: 'boolean', key: 'showAdd', label: showcaseText('Show Add', '显示 Add'), row: 0 },
    {
      kind: 'text',
      key: 'addLabel',
      label: showcaseText('Add copy.', 'Add 文案'),
      row: 0,
      visibleWhen: (s) => Boolean(s.showAdd),
    },
    {
      kind: 'select',
      key: 'editBoxIndex',
      label: showcaseText('Edit row', '编辑行'),
      options: buildFlotationBoxEditRowSelectOptions(count),
      row: 1,
    },
  ];

  if (editing) {
    controls.push(
      ...buildFlotationItemRowControls(editIndex).map((control) => ({
        ...control,
        row: (control.row ?? 1) + 1,
      })),
    );
  }

  return controls;
}

export function buildFlotationUsageSnippet(state: Record<string, unknown>): string {
  const widthMode = String(state.widthMode ?? 'fixed');
  const heightMode = String(state.heightMode ?? 'adaptive');
  const props: Record<string, unknown> = {
    placement: state.placement,
    align: state.align,
    triggerLabel: state.triggerLabel,
    triggerStyle: state.triggerStyle,
    triggerSize: state.triggerSize,
    disabled: state.disabled,
    showSymbol: state.showSymbol,
    symbolIcon: state.symbolIcon,
    symbolPosition: state.symbolPosition ?? 'leading',
    showTag: state.showTag,
    tagText: state.tagText,
    tagStatus: state.tagStatus,
    showMessage: state.showMessage,
    messageText: state.messageText,
    messageType: state.messageType,
    showAdd: state.showAdd,
    addLabel: state.addLabel,
    widthMode,
    heightMode,
  };

  if (widthMode === 'fixed') {
    props.width = Number.parseInt(String(state.width ?? ''), 10) || 280;
  }
  if (heightMode === 'fixed') {
    props.height = Number.parseInt(String(state.height ?? ''), 10) || 306;
  } else {
    const maxHeight = parseFlotationMaxHeight(state);
    if (maxHeight != null) props.maxHeight = maxHeight;
  }

  const crossAxisOffset = parseFlotationCrossAxisOffset(state);
  if (crossAxisOffset != null) {
    props.crossAxisOffset = crossAxisOffset;
  }

  const offset = parseFlotationOffset(state);
  if (offset != null) {
    props.offset = offset;
  }

  if (isFlotationTriggerModuleMenuKind(state)) {
    for (const key of [
      'triggerLabel',
      'triggerStyle',
      'triggerSize',
      'showSymbol',
      'symbolIcon',
      'symbolPosition',
      'showTag',
      'tagText',
      'tagStatus',
      'showMessage',
      'messageText',
      'messageType',
      'width',
    ] as const) {
      delete props[key];
    }
    props.widthMode = 'trigger';
  }

  const openTag = buildVueOpeningTag('EgFlotation', props, {
    defaults: {
      placement: flotationCustomizeDefaults.placement,
      align: flotationCustomizeDefaults.align,
      triggerLabel: flotationCustomizeDefaults.triggerLabel,
      triggerStyle: flotationCustomizeDefaults.triggerStyle,
      triggerSize: flotationCustomizeDefaults.triggerSize,
      disabled: flotationCustomizeDefaults.disabled,
      showSymbol: flotationCustomizeDefaults.showSymbol,
      symbolIcon: flotationCustomizeDefaults.symbolIcon,
      symbolPosition: flotationCustomizeDefaults.symbolPosition,
      showTag: flotationCustomizeDefaults.showTag,
      tagText: flotationCustomizeDefaults.tagText,
      tagStatus: flotationCustomizeDefaults.tagStatus,
      showMessage: flotationCustomizeDefaults.showMessage,
      messageType: flotationCustomizeDefaults.messageType,
      showAdd: flotationCustomizeDefaults.showAdd,
      widthMode: flotationCustomizeDefaults.widthMode,
      width: Number.parseInt(flotationCustomizeDefaults.width, 10),
      heightMode: flotationCustomizeDefaults.heightMode,
      height: Number.parseInt(flotationCustomizeDefaults.height, 10),
    },
    omitKeys: [
      'boxKind',
      'itemCount',
      'editBoxIndex',
      ...(isFlotationTriggerModuleMenuKind(state)
        ? [
            'triggerLabel',
            'triggerStyle',
            'triggerSize',
            'showSymbol',
            'symbolIcon',
            'symbolPosition',
            'showTag',
            'tagText',
            'tagStatus',
            'showMessage',
            'messageText',
            'messageType',
          ]
        : []),
    ],
  });

  if (isFlotationTriggerModuleMenuKind(state)) {
    return [openTag, buildFlotationComboTriggerSlotSnippet(state), '</EgFlotation>'].join('\n');
  }

  return `${openTag}\n  <!-- #trigger / #content 可替换预置 EgFlotationTrigger / EgFlotationMenu -->\n</EgFlotation>`;
}

export const flotationPropRows: DocPropRow[] = [
  {
    name: 'trigger',
    type: "'click' | 'hover' | 'focus'",
    defaultValue: "'click'",
    description: showcaseText('Transparent EgTooltip. Click dropdown; hover/focus for address, hash, and other Tooltip scenarios.', '透传 EgTooltip。click 下拉；hover/focus 用于地址、哈希等 Tooltip 场景。'),
  },
  {
    name: 'openDelay / closeDelay',
    type: 'number',
    defaultValue: '0 / 0',
    description: showcaseText('on/Off Delay (ms) when hover/focus.', 'hover/focus 时打开/关闭延迟（ms）。'),
  },
  {
    name: 'placement / disabled',
    type: 'TooltipPlacement / boolean',
    defaultValue: "'bottom' / false",
    description: showcaseText('Transparent EgTooltip.', '透传 EgTooltip。'),
  },
  {
    name: 'offset',
    type: 'number',
    defaultValue: '--spacing-025 (1px)',
    description: showcaseText('Spindle-to-trigger spacing (px); read when not passing - spacing-025.', '主轴与触发器间距（px）；未传时读 --spacing-025。'),
  },
  {
    name: 'crossAxisOffset',
    type: 'number',
    defaultValue: '-spacing-2 (-8px)',
    description: showcaseText('Cross axis offset (px); default -spacing-2 when not transmitted.', '交叉轴偏移（px）；未传时默认 -spacing-2。'),
  },
  {
    name: 'triggerLabel / triggerStyle / triggerSize / showSymbol / symbolIcon / symbolPosition / showTag / showMessage',
    type: '…',
    defaultValue: 'Trigger / subtle / lg / false / eds-coin-btc / leading…',
    description:
      showcaseText('[doc] None #trigger when EgFlotationTrigger Preset（「Trigger Trigger」）。showSymbol + symbolIcon + symbolPosition（leading | trailing） #symbol /。', '无 #trigger 时的 EgFlotationTrigger 预置（见「触发器 Trigger」定制）。showSymbol + symbolIcon + symbolPosition（leading | trailing）控制 #symbol 左/右。'),
  },
  {
    name: 'widthMode / width / align / heightMode / height / maxHeight',
    type: 'trigger|fixed|adaptive / number / start|end / …',
    defaultValue: 'fixed / 280 / start / adaptive / 306 / —',
    description:
      showcaseText('[doc] trigger：=Trigger+2×spacing-2， spacing-2。fixed/adaptive：CustomorAdaptive；align=start when -spacing-2，align=end when +spacing-2。heightMode=adaptive whencan maxHeight（px，can）。GapDefault spacing-025，can offset 。', 'trigger：宽=触发器+2×spacing-2，左右各扩 spacing-2。fixed/adaptive：宽自定义或自适应；align=start 时交叉轴 -spacing-2，align=end 时 +spacing-2。heightMode=adaptive 时可传 maxHeight（px，可选）。主轴间距默认 spacing-025，可经 offset 覆盖。'),
  },
  {
    name: 'items / showAdd / addLabel',
    type: 'FlotationMenuItemPreset[] / boolean / string',
    defaultValue: 'Label 1–8 / true / Add',
    description:
      showcaseText('[doc] None #content when Box RowandBottom Add。Showcase「Box」PanelType、Add CopyEdit row Label/Tag ；ClickRowOffMenuand Trigger。', '无 #content 时的 Box 行与底部 Add。Showcase「Box」面板配置类型、Add 文案及按编辑行的 Label/Tag 等；点击行关闭菜单并回显 Trigger。'),
  },
];

export const flotationSlotRows: DocPropRow[] = [
  {
    name: 'trigger',
    type: '—',
    defaultValue: '—',
    description: showcaseText('Trigger slot. Default EgFlotationTrigger; fully customizable.', '触发器插槽。默认 EgFlotationTrigger；可完全自定义。'),
  },
  {
    name: 'content',
    type: '—',
    defaultValue: '—',
    description: showcaseText('Floating content slot. Default EgFlotationMenu (embedded EgTooltip); fully customizable.', '浮层内容插槽。默认 EgFlotationMenu（内嵌 EgTooltip）；可完全自定义。'),
  },
];

export function buildFlotationPresetItems(
  count: number,
  state?: Record<string, unknown>,
) {
  const safe = Math.min(20, Math.max(1, Math.floor(count)));
  return Array.from({ length: safe }, (_, index) => {
    const n = index + 1;
    const labelKey = flotationBoxItemKey('Label', n);
    const rawLabel = state?.[labelKey];
    const label =
      rawLabel != null && String(rawLabel).trim() !== ''
        ? String(rawLabel)
        : `Label ${n}`;

    const boxType = parseFlotationBoxItemType(state ?? {});
    const leadingDefault = flotationBoxItemLeadingDefault(boxType);
    const leadingRaw = state?.[flotationBoxItemKey('SymbolIcon', n)];
    const leadingAsset =
      leadingRaw != null && String(leadingRaw).trim() !== ''
        ? String(leadingRaw)
        : leadingDefault;

    const tagStatusRaw = String(state?.[flotationBoxItemKey('TagStatus', n)] ?? 'danger');
    const tagStatuses = ['danger', 'warning', 'success', 'ready', 'invalid'] as const;
    const tagStatus = (tagStatuses as readonly string[]).includes(tagStatusRaw)
      ? (tagStatusRaw as (typeof tagStatuses)[number])
      : 'danger';

    const selectionMode = parseFlotationBoxSelectionMode(state ?? {});
    const isSelected = Boolean(state?.[flotationBoxItemKey('Checked', n)]);
    const isMultiple = selectionMode === 'multiple';

    const showReddot = Boolean(state?.[flotationBoxItemKey('ShowReddot', n)]);
    const showMessage =
      Boolean(state?.[flotationBoxItemKey('ShowMessage', n)]) && !showReddot;

    return {
      label,
      boxType: boxType as 'text' | 'symbol-text' | 'image-text',
      disabled: Boolean(state?.[flotationBoxItemKey('Disabled', n)]),
      focused: isMultiple
        ? Boolean(state?.[flotationBoxItemKey('Focused', n)])
        : isSelected,
      showCheckbox: isMultiple,
      checked: isMultiple ? isSelected : false,
      showTag: Boolean(state?.[flotationBoxItemKey('ShowTag', n)]),
      tag: String(state?.[flotationBoxItemKey('TagText', n)] ?? 'Tag'),
      tagStatus,
      showReddot,
      showCascader: Boolean(state?.[flotationBoxItemKey('ShowCascader', n)]),
      showMessage,
      messageText: String(state?.[flotationBoxItemKey('MessageText', n)] ?? '0'),
      messageType: (['subtle', 'brand', 'danger'].includes(
        String(state?.[flotationBoxItemKey('MessageType', n)] ?? 'subtle'),
      )
        ? String(state?.[flotationBoxItemKey('MessageType', n)] ?? 'subtle')
        : 'subtle') as 'subtle' | 'brand' | 'danger',
      symbolIcon: leadingAsset,
    };
  });
}

/* ── Trigger 小类 ── */

export type FlotationTriggerKind = 'standard-dropdown' | 'module-menu';

export function isFlotationTriggerModuleMenuKind(state: Record<string, unknown>): boolean {
  return String(state.triggerKind ?? 'standard-dropdown') === 'module-menu';
}

type FlotationComboTriggerSlot = {
  expanded?: boolean;
  selectedItem?: {
    label?: string;
    showTag?: boolean;
    tag?: string;
    tagStatus?: string;
  } | null;
  /** EgFlotation #trigger 插槽：任一 Box Item 是否带红点。 */
  hasAnyItemReddot?: boolean;
};

/** EgFlotation #trigger 插槽：标准下拉框 / 模块菜单标题。 */
export function resolveFlotationComboTriggerProps(
  state: Record<string, unknown>,
  slot: FlotationComboTriggerSlot = {},
): Record<string, unknown> {
  const selectedItem = slot.selectedItem ?? null;

  if (isFlotationTriggerModuleMenuKind(state)) {
    return {
      moduleMenuTitle: true,
      triggerStyle: 'text',
      widthMode: 'trigger',
      label:
        selectedItem?.label ??
        String(
          state.triggerLabel ?? state.label ?? flotationTriggerModuleMenuDefaults.label,
        ),
      showReddot:
        slot.hasAnyItemReddot !== undefined
          ? Boolean(slot.hasAnyItemReddot)
          : Boolean(state.showReddot),
      disabled: Boolean(state.disabled),
      ...(slot.expanded !== undefined ? { expanded: slot.expanded } : {}),
    };
  }

  return {
    triggerStyle: state.triggerStyle ?? 'subtle',
    size: state.triggerSize ?? 'md',
    widthMode: 'adaptive',
    label: selectedItem?.label ?? String(state.triggerLabel ?? 'Trigger'),
    disabled: Boolean(state.disabled),
    showSymbol: Boolean(state.showSymbol),
    symbolIcon: String(state.symbolIcon ?? 'eds-coin-btc'),
    symbolPosition: state.symbolPosition === 'trailing' ? 'trailing' : 'leading',
    showTag: selectedItem ? Boolean(selectedItem.showTag) : Boolean(state.showTag),
    tagText: selectedItem?.tag ?? String(state.tagText ?? 'Tag'),
    tagStatus: selectedItem?.tagStatus ?? state.tagStatus ?? 'danger',
    showMessage: Boolean(state.showMessage),
    messageText: String(state.messageText ?? '0'),
    messageType: state.messageType ?? 'brand',
    ...(slot.expanded !== undefined ? { expanded: slot.expanded } : {}),
  };
}

export function buildFlotationComboTriggerSlotSnippet(
  state: Record<string, unknown>,
  indent = '  ',
): string {
  const triggerSlotBindings = isFlotationTriggerModuleMenuKind(state)
    ? '{ expanded, selectedItem, hasAnyItemReddot }'
    : '{ expanded, selectedItem }';
  const triggerSlotIndent = `${indent}  `;

  if (isFlotationTriggerModuleMenuKind(state)) {
    const labelDefault = String(
      state.triggerLabel ?? state.label ?? flotationTriggerModuleMenuDefaults.label,
    )
      .trim()
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"');

    return [
      `${indent}<template #trigger="${triggerSlotBindings}">`,
      `${triggerSlotIndent}<EgFlotationTrigger`,
      `${triggerSlotIndent}  module-menu-title`,
      `${triggerSlotIndent}  trigger-style="text"`,
      `${triggerSlotIndent}  width-mode="trigger"`,
      `${triggerSlotIndent}  :label="selectedItem?.label ?? '${labelDefault}'"`,
      `${triggerSlotIndent}  :show-reddot="hasAnyItemReddot"`,
      `${triggerSlotIndent}  :expanded="expanded"`,
      `${triggerSlotIndent}/>`,
      `${indent}</template>`,
    ].join('\n');
  }

  const triggerInner = buildVueSelfClosingSnippet(
    'EgFlotationTrigger',
    resolveFlotationComboTriggerProps(state),
    {
      defaults: {
        triggerStyle: flotationCustomizeDefaults.triggerStyle,
        size: flotationCustomizeDefaults.triggerSize,
        label: flotationCustomizeDefaults.triggerLabel,
      },
      omitKeys: ['expanded'],
    },
  );
  const triggerWithExpanded =
    triggerInner === '<EgFlotationTrigger />'
      ? `${triggerSlotIndent}<EgFlotationTrigger :expanded="expanded" />`
      : triggerInner
          .replace(/^<EgFlotationTrigger/, `${triggerSlotIndent}<EgFlotationTrigger`)
          .replace(/\n\/>$/, '\n      :expanded="expanded"\n    />');

  return [
    `${indent}<template #trigger="${triggerSlotBindings}">`,
    triggerWithExpanded,
    `${indent}</template>`,
  ].join('\n');
}

/** 为 Combo 合并 triggerKind（标准下拉框 / 模块菜单等预置触发器）。 */
export function withFlotationComboTriggerKind(
  state: Record<string, unknown>,
  triggerKind: FlotationTriggerKind,
): Record<string, unknown> {
  return { ...state, triggerKind };
}

export type FlotationComboEgFlotationProps = {
  placement: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'end' | 'center';
  widthMode: 'trigger' | 'fixed' | 'adaptive';
  width?: number;
  heightMode: 'adaptive' | 'fixed';
  height?: number;
  maxHeight?: number;
  closeOnScroll: boolean;
  showAdd: boolean;
  addLabel: string;
  offset?: number;
  crossAxisOffset?: number;
};

/**
 * Menu 层：从 customize 记录解析 EgFlotation props（不含 items / #trigger）。
 * 各嵌套场景传入不同的 menuState（Menu 配置 + Box 行数据源）。
 */
export function resolveFlotationComboEgFlotationProps(
  menuState: Record<string, unknown>,
  options: {
    closeOnScroll?: boolean;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'end' | 'center';
  } = {},
): FlotationComboEgFlotationProps {
  const widthMode = String(menuState.widthMode ?? 'fixed') as FlotationComboEgFlotationProps['widthMode'];
  const heightMode = String(menuState.heightMode ?? 'adaptive') as 'adaptive' | 'fixed';
  const props: FlotationComboEgFlotationProps = {
    placement: options.placement ?? 'bottom',
    widthMode,
    heightMode,
    closeOnScroll: options.closeOnScroll ?? false,
    showAdd: Boolean(menuState.showAdd),
    addLabel: String(menuState.addLabel ?? 'Add'),
  };

  if (options.align != null) {
    props.align = options.align;
  }
  if (widthMode === 'fixed') {
    const width = parseFlotationMenuWidth(menuState);
    if (width != null) props.width = width;
  }
  if (heightMode === 'fixed') {
    const height = Number.parseInt(String(menuState.height ?? ''), 10);
    if (Number.isFinite(height) && height > 0) props.height = height;
  } else {
    const maxHeight = parseFlotationMaxHeight(menuState);
    if (maxHeight != null) props.maxHeight = maxHeight;
  }
  const crossAxisOffset = parseFlotationCrossAxisOffset(menuState);
  if (crossAxisOffset != null) props.crossAxisOffset = crossAxisOffset;
  const offset = parseFlotationOffset(menuState);
  if (offset != null) props.offset = offset;

  return props;
}

/**
 * 嵌套 EgFlotation Combo 用法片段：EgFlotation + #trigger 插槽 + items。
 * triggerState 须含 triggerKind；menuState 仅驱动 Menu/Box 配置与 items 数据源。
 */
export function buildFlotationComboNestedSnippet(
  triggerState: Record<string, unknown>,
  menuState: Record<string, unknown>,
  options: {
    indent?: string;
    itemsExpression?: string;
    wrapTemplate?: 'title' | 'none';
    closeOnScroll?: boolean;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'end' | 'center';
  } = {},
): string {
  const indent = options.indent ?? '';
  const itemsExpression = options.itemsExpression ?? 'titleMenuItems';
  const egProps = resolveFlotationComboEgFlotationProps(menuState, {
    closeOnScroll: options.closeOnScroll ?? true,
    placement: options.placement ?? 'bottom',
    align: options.align ?? 'start',
  });

  const openTagBase = buildVueOpeningTag('EgFlotation', egProps, {
    defaults: {
      placement: 'bottom',
      align: 'start',
      widthMode: 'fixed',
      heightMode: 'adaptive',
      closeOnScroll: true,
      showAdd: true,
      addLabel: 'Add',
    },
  });
  const openTag = openTagBase.endsWith('>')
    ? `${openTagBase.slice(0, -1)}\n  :items="${itemsExpression}">`
    : openTagBase;

  const flotationBody = [
    `${indent}  ${openTag}`,
    buildFlotationComboTriggerSlotSnippet(triggerState, `${indent}  `),
    `${indent}  </EgFlotation>`,
  ].join('\n');

  if (options.wrapTemplate === 'title') {
    return [`${indent}<template #title>`, flotationBody, `${indent}</template>`].join('\n');
  }

  return [
    `${indent}${openTag}`,
    buildFlotationComboTriggerSlotSnippet(triggerState, `${indent}  `),
    `${indent}</EgFlotation>`,
  ].join('\n');
}

export const flotationTriggerKindOptions = propLabelRows(
  ['standard-dropdown', 'module-menu'] as const,
  showcaseFlotationTriggerKindLabels,
).map((row) => ({ value: row.key, label: row.label }));

export const flotationTriggerModuleMenuDefaults = {
  label: 'Doris Studio',
  showReddot: true,
  disabled: false,
  expanded: false,
} as const;

export const flotationTriggerCustomizeDefaults = {
  triggerKind: 'standard-dropdown' as FlotationTriggerKind,
  showFieldLabel: false,
  fieldLabel: 'Label',
  feedback: false,
  ...formSubmissionCustomizeDefaults,
  triggerStyle: 'subtle',
  size: 'md',
  widthMode: 'adaptive',
  width: '280',
  label: 'Trigger',
  disabled: false,
  showReddot: false,
  expanded: false,
  showSymbol: false,
  symbolIcon: 'eds-coin-btc',
  symbolPosition: 'leading',
  showTag: false,
  tagText: 'Tag',
  tagStatus: 'danger',
  showMessage: false,
  messageText: '0',
  messageType: 'brand',
} as const;

/** Showcase：触发器类型 */
export const flotationTriggerKindCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'triggerKind',
    label: showcaseText('Link ‘Trigger’', '触发器'),
    row: 0,
    options: flotationTriggerKindOptions,
  },
];

/** Combo 字段壳：标题 / 反馈区 */
export const flotationTriggerShellCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'boolean',
    key: 'showFieldLabel',
    label: showcaseInputCustomizeFieldLabels.label,
  },
  {
    kind: 'text',
    key: 'fieldLabel',
    label: showcaseText('Title copy.', '标题文案'),
    visibleWhen: (s) => Boolean(s.showFieldLabel),
  },
  {
    kind: 'boolean',
    key: 'feedback',
    label: showcaseInputCustomizeFieldLabels.feedback,
  },
];

export const flotationTriggerFormSubmissionCustomizeControls: DocCustomizeControl[] =
  buildFormSubmissionExpandCustomizeControls({
    visibleWhen: (s) => Boolean(s.feedback),
  });

/** 触发器本体：Style / Size / 宽度 / 文案 / Symbol */
export const flotationTriggerBodyCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'triggerStyle',
    label: showcaseText('Style', '样式'),
    row: 2,
    options: flotationTriggerStyleRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'size',
    label: showcaseText('Size', '尺寸'),
    row: 2,
    options: buttonSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'widthMode',
    label: showcaseText('Width', '宽度'),
    row: 2,
    options: widthModeTriggerFixedAdaptiveRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'text',
    key: 'width',
    label: showcaseText('Width value', '宽度值'),
    row: 2,
    visibleWhen: (s) => String(s.widthMode ?? 'adaptive') === 'fixed',
  },
  { kind: 'text', key: 'label', label: showcaseText('Copy', '文案'), row: 2 },
  { kind: 'boolean', key: 'disabled', label: showcaseText('Disabled', '禁用'), row: 3 },
  { kind: 'boolean', key: 'showSymbol', label: showcaseText('ShowIcon', '显示图标'), row: 4, inlineSelect: flotationSymbolPositionInlineSelect },
  {
    kind: 'text',
    key: 'symbolIcon',
    label: showcaseText('Icon Name', '图标名'),
    row: 5,
    visibleWhen: (s) => Boolean(s.showSymbol),
  },
];

/** 下拉选项 · 标准下拉框：Tag / Message / 展开箭头 */
export const flotationTriggerDropdownCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'showTag', label: showcaseText('Show label.', '显示标签'), row: 6 },
  {
    kind: 'text',
    key: 'tagText',
    label: showcaseText('Tag copy.', '标签文案'),
    row: 6,
    visibleWhen: (s) => Boolean(s.showTag),
  },
  {
    kind: 'select',
    key: 'tagStatus',
    label: showcaseText('TagStatus', '标签状态'),
    row: 6,
    options: [...flotationTagStatusOptions],
    visibleWhen: (s) => Boolean(s.showTag),
  },
  { kind: 'boolean', key: 'showMessage', label: showcaseText('Display message...', '显示消息'), row: 7 },
  {
    kind: 'text',
    key: 'messageText',
    label: showcaseText('Message copy', '消息文案'),
    row: 7,
    visibleWhen: (s) => Boolean(s.showMessage),
  },
  {
    kind: 'select',
    key: 'messageType',
    label: showcaseText('Type of Message', '消息类型'),
    row: 7,
    options: [...flotationMessageTypeOptions],
    visibleWhen: (s) => Boolean(s.showMessage),
  },
  { kind: 'boolean', key: 'expanded', label: showcaseText('Expand State', '展开态'), row: 8 },
];

export const flotationTriggerNestedBodyCustomizeControls: DocCustomizeControl[] = [
  ...flotationTriggerBodyCustomizeControls,
  ...flotationTriggerDropdownCustomizeControls,
];

/** 模块菜单 · Figma TriggerComboModuleTitle（2090:2655） */
export const flotationTriggerModuleMenuCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'label', label: showcaseText('Copy', '文案'), row: 0 },
  { kind: 'boolean', key: 'showReddot', label: showcaseText('Show red dots', '显示红点'), row: 0 },
  { kind: 'boolean', key: 'disabled', label: showcaseText('Disabled', '禁用'), row: 0 },
  { kind: 'boolean', key: 'expanded', label: showcaseText('Expand State', '展开态'), row: 0 },
];

function withCustomizeRow(
  controls: DocCustomizeControl[],
  row: number,
): DocCustomizeControl[] {
  return controls.map((control) => ({ ...control, row }));
}

/** `/components/flotation-trigger` — 基础定制（无触发器类型；侧栏切换场景）。 */
export function buildFlotationTriggerPageCustomizeControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  if (isFlotationTriggerModuleMenuKind(state)) {
    return withCustomizeRow(flotationTriggerModuleMenuCustomizeControls, 0);
  }

  const [
    triggerStyle,
    size,
    widthMode,
    width,
    label,
    disabled,
    showSymbol,
    symbolIcon,
  ] = flotationTriggerBodyCustomizeControls;

  const [
    showTag,
    tagText,
    tagStatus,
    showMessage,
    messageText,
    messageType,
    expanded,
  ] = flotationTriggerDropdownCustomizeControls;

  const [showFieldLabel, fieldLabel, feedback] = flotationTriggerShellCustomizeControls;

  return [
    { ...triggerStyle!, row: 0 },
    { ...size!, row: 0 },
    { ...widthMode!, row: 0 },
    { ...label!, row: 0 },
    { ...width!, row: 1 },
    { ...showFieldLabel!, row: 1 },
    { ...fieldLabel!, row: 1 },
    { ...disabled!, row: 2 },
    { ...showSymbol!, row: 2 },
    { ...showTag!, row: 2 },
    { ...showMessage!, row: 2 },
    { ...symbolIcon!, row: 3 },
    { ...tagText!, row: 3 },
    { ...tagStatus!, row: 3 },
    { ...messageText!, row: 3 },
    { ...messageType!, row: 3 },
    { ...expanded!, row: 4 },
    { ...feedback!, row: 5 },
  ];
}

export const flotationTriggerCustomizeControls: DocCustomizeControl[] = [
  ...flotationTriggerShellCustomizeControls,
  ...flotationTriggerNestedBodyCustomizeControls,
];

/** 纵览页 EgFlotation：触发器预置（标准下拉框） */
export const flotationTriggerOverviewControls: DocCustomizeControl[] = [
  ...flotationTriggerOverviewBodyControls,
  ...flotationTriggerOverviewDropdownControls,
];

const flotationTriggerShellKeys = [
  'showFieldLabel',
  'fieldLabel',
  'feedback',
  'type',
  'text',
  'linkLabel',
  'showLink',
] as const;

/** Props for EgComboInput from merged Trigger customize state. */
export function flotationTriggerShellProps(state: Record<string, unknown>): Record<string, unknown> {
  return {
    label: state.fieldLabel,
    feedback: state.feedback,
  };
}

export function usesFlotationTriggerComboShell(state: Record<string, unknown>): boolean {
  if (isFlotationTriggerModuleMenuKind(state)) return false;
  return Boolean(state.showFieldLabel) || Boolean(state.feedback);
}

export function buildFlotationTriggerInnerSnippet(state: Record<string, unknown>): string {
  if (isFlotationTriggerModuleMenuKind(state)) {
    return buildVueSelfClosingSnippet(
      'EgFlotationTrigger',
      {
        moduleMenuTitle: true,
        triggerStyle: 'text',
        widthMode: 'trigger',
        label: state.label,
        showReddot: state.showReddot,
        disabled: state.disabled,
        expanded: state.expanded,
      },
      {
        defaults: {
          moduleMenuTitle: true,
          triggerStyle: 'text',
          widthMode: 'trigger',
          ...flotationTriggerModuleMenuDefaults,
        },
        omitKeys: ['triggerKind', ...flotationTriggerShellKeys],
      },
    );
  }

  const widthMode = String(state.widthMode ?? 'adaptive');
  const props: Record<string, unknown> = { ...state };
  for (const key of flotationTriggerShellKeys) {
    delete props[key];
  }
  if (widthMode === 'fixed') {
    const parsed = Number.parseInt(String(state.width ?? ''), 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      props.width = parsed;
    }
  } else {
    delete props.width;
  }

  return buildVueSelfClosingSnippet('EgFlotationTrigger', props, {
    defaults: { ...flotationTriggerCustomizeDefaults },
    omitKeys:
      widthMode === 'fixed'
        ? ['triggerKind', ...flotationTriggerShellKeys]
        : ['width', 'triggerKind', ...flotationTriggerShellKeys],
  });
}

export function buildFlotationTriggerUsageSnippet(state: Record<string, unknown>): string {
  if (isFlotationTriggerModuleMenuKind(state)) {
    return buildFlotationTriggerInnerSnippet(state);
  }

  const inner = buildFlotationTriggerInnerSnippet(state);

  if (!usesFlotationTriggerComboShell(state)) {
    return inner;
  }

  const shellDefaults = {
    label: flotationTriggerCustomizeDefaults.fieldLabel,
    feedback: flotationTriggerCustomizeDefaults.feedback,
  };
  const openTag = buildVueSelfClosingSnippet(
    'EgComboInput',
    flotationTriggerShellProps(state),
    { defaults: shellDefaults },
  )
    .replace(/\s*\/>$/, '')
    .trim();

  const feedbackSlot = state.feedback
    ? `\n  <template #feedback>\n    <EgFormSubmission type="${String(state.type ?? 'notes')}" text="${String(state.text ?? '')}" />\n  </template>`
    : '';

  return `${openTag}>\n  ${inner}${feedbackSlot}\n</EgComboInput>`;
}

export const flotationTriggerPropRows: DocPropRow[] = [
  {
    name: 'triggerStyle',
    type: "'subtle' | 'outline' | 'text'",
    defaultValue: "'subtle'",
    description: showcaseText('Figma Style. Presets appearance; whole controls can be replaced by # trigger.', 'Figma Style。预置外观；整控件可由 #trigger 替换。'),
  },
  {
    name: 'size',
    type: "'lg' | 'md' | 'sm' | 'xs'",
    defaultValue: "'lg'",
    description: 'Figma Size。',
  },
  {
    name: 'widthMode / width',
    type: "'trigger' | 'adaptive' | 'fixed' / number",
    defaultValue: "'adaptive' / —",
    description:
      showcaseText('[doc] Trigger： hug；Adaptive：100% ；FixedWidth：widthMode=fixed when width（px）。', '等于触发器：内容 hug；自适应：100% 父宽；固定宽度：widthMode=fixed 时 width（px）。'),
  },
  {
    name: 'label / disabled / expanded',
    type: 'string / boolean / boolean',
    defaultValue: "'Trigger' / false / false",
    description: showcaseText('Copywriting, Disabled, Expand arrow direction. Expanded with --event-focus in the background; default restored when closed.', '文案、禁用、展开箭头方向。展开态（expanded）背景为 --event-focus；关闭后恢复默认。'),
  },
  {
    name: 'moduleMenuTitle / showReddot',
    type: 'boolean / boolean',
    defaultValue: 'false / false',
    description:
      showcaseText('[doc] Figma TriggerComboModuleTitle（2090:2655）。Module Menu Title text Trigger：Body Large Strong + spacing-1-5/spacing-2 Padding；can EgReddot。', 'Figma TriggerComboModuleTitle（2090:2655）。Module Menu 标题区 text 触发器：Body Large Strong + spacing-1-5/spacing-2 内边距；可选 EgReddot。'),
  },
  {
    name: 'showSymbol',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Show # symbol preset EgIcon (currency/avatar).', '展示 #symbol 预置 EgIcon（币种 / 头像）。'),
  },
  {
    name: 'symbolIcon',
    type: 'string',
    defaultValue: "'eds-coin-btc'",
    description: showcaseText('showSymbol as true when EgIcon Name。', 'showSymbol 为 true 时的 EgIcon 名称。'),
  },
  {
    name: 'symbolPosition',
    type: "'leading' | 'trailing'",
    defaultValue: "'leading'",
    description:
      showcaseText('[doc] showSymbol as true whenIconPosition：leading CopyLeading；trailing CopyTrailing（）。', 'showSymbol 为 true 时图标位置：leading 文案左侧；trailing 文案右侧（下拉箭头前）。'),
  },
  {
    name: 'showTag / tagText / tagStatus / showMessage / messageType',
    type: 'boolean / string / TagStatus / boolean / MessageType',
    defaultValue: 'false / Tag / danger / false / brand',
    description: 'EgTag Status sm（#tag）、Message（#message，type：subtle | brand | danger）。',
  },
];

export const flotationTriggerSlotRows: DocPropRow[] = [
  { name: 'default', type: '—', defaultValue: '—', description: showcaseText('Trigger copy.', '触发器文案。') },
  { name: 'symbol', type: '—', defaultValue: '—', description: showcaseText('Currency/avatar; symbolPosition controls left/right.', '币种 / 头像；symbolPosition 控制左/右。') },
  { name: 'tag', type: '—', defaultValue: '—', description: 'EgTag Status sm。' },
  { name: 'message', type: '—', defaultValue: '—', description: showcaseText('Trailing Message。', '右侧 Message。') },
  { name: 'reddot', type: '—', defaultValue: '—', description: showcaseText('EgReddot next to the Module Menu title.', 'Module Menu 标题旁 EgReddot。') },
  { name: 'arrow', type: '—', defaultValue: '—', description: showcaseText('Dropdown Arrow', '下拉箭头。') },
];

/* ── Box 小类 ── */

export type FlotationBoxKind =
  | 'standard-menu'
  | 'standard-cascade-menu'
  | 'scene-address-dropdown'
  | 'scene-address-hover';

export const flotationBoxSceneAddressKinds = [
  'scene-address-dropdown',
  'scene-address-hover',
] as const;

export type FlotationBoxSceneAddressKind = (typeof flotationBoxSceneAddressKinds)[number];

export function isFlotationBoxSceneAddressKind(state: Record<string, unknown>): boolean {
  const kind = String(state.boxKind ?? 'standard-menu');
  return (flotationBoxSceneAddressKinds as readonly string[]).includes(kind);
}

const flotationBoxKindOptions = propLabelRows(
  [
    'standard-menu',
    'standard-cascade-menu',
    'scene-address-dropdown',
    'scene-address-hover',
  ] as const,
  showcaseFlotationBoxKindLabels,
);

const flotationComboBoxSceneOptions = propLabelRows(
  [
    'standard-menu',
    'standard-cascade-menu',
    'scene-address-dropdown',
    'scene-address-hover',
  ] as const,
  showcaseFlotationComboBoxSceneLabels,
);

/** Combo 页 EgFlotationTrigger：场景单独一行 + 纵览触发器控件。 */
export function buildFlotationComboTriggerPanelControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const [triggerKindControl] = flotationTriggerKindCustomizeControls;
  const bodyControls = isFlotationTriggerModuleMenuKind(state)
    ? flotationTriggerOverviewModuleMenuControls
    : flotationTriggerOverviewControls;

  return [
    { ...triggerKindControl!, label: showcaseText('My scene', '场景'), row: 0 },
    ...bodyControls.map((control) => ({
      ...control,
      row: (control.row ?? 0) + 1,
    })),
  ];
}

/** Combo 页 EgFlotationMenu：场景 + 插槽页同款控件。 */
export function buildFlotationComboBoxPanelControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const panelControls = isFlotationBoxSceneAddressKind(state)
    ? buildFlotationBoxSceneAddressPanelControls(state)
    : buildFlotationBoxPanelControls(state);

  return [
    {
      kind: 'select',
      key: 'boxKind',
      label: showcaseText('My scene', '场景'),
      row: 0,
      options: flotationComboBoxSceneOptions.map((row) => ({
        value: row.key,
        label: row.label,
      })),
    },
    ...panelControls.map((control) => ({
      ...control,
      row: (control.row ?? 0) + 1,
    })),
  ];
}

/** Showcase：盒子插槽类型 */
export const flotationBoxKindCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'boxKind',
    label: showcaseText('Box Slot', '盒子插槽'),
    options: flotationBoxKindOptions.map((row) => ({ value: row.key, label: row.label })),
  },
];

export function getFlotationBoxKindPanelTitle(boxKind: unknown): string {
  const key = String(boxKind ?? 'standard-menu');
  return (
    showcaseFlotationBoxKindLabels[key as keyof typeof showcaseFlotationBoxKindLabels] ??
    showcaseFlotationBoxKindLabels['standard-menu']
  );
}

/** Box 页：行数 / 编辑行 + 当前行 Item 字段（与纵览页「盒子 Box」一致） */
export function buildFlotationBoxKindPanelControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  return buildFlotationBoxPanelControls(state);
}

export const flotationBoxPageCustomizeDefaults = {
  boxKind: 'standard-menu',
  boxItemType: 'text',
  boxSelectionMode: 'single',
  itemCount: '8',
  maxHeight: '306',
  editBoxIndex: '',
  showAdd: true,
  addLabel: 'Add',
  ...createFlotationBoxItemDefaults(),
};

export function buildFlotationBoxUsageSnippet(state: Record<string, unknown>): string {
  const count = parseFlotationItemCount(state);
  const menuProps: Record<string, unknown> = {
    showAdd: state.showAdd,
    addLabel: state.addLabel,
  };
  const maxHeight = parseFlotationMaxHeight(state);
  if (maxHeight != null) {
    menuProps.heightMode = 'adaptive';
    menuProps.maxHeight = maxHeight;
  }
  const width = parseFlotationMenuWidth(state);
  const maxWidth = parseFlotationMenuMaxWidth(state);
  if (width != null) {
    menuProps.widthMode = 'fixed';
    menuProps.width = width;
  }
  if (maxWidth != null) {
    menuProps.maxWidth = maxWidth;
  }
  const openTag = buildVueOpeningTag('EgFlotationMenu', menuProps, {
    defaults: {
      showAdd: flotationBoxPageCustomizeDefaults.showAdd,
      addLabel: flotationBoxPageCustomizeDefaults.addLabel,
    },
    omitKeys: [
      'boxKind',
      'boxItemType',
      'boxSelectionMode',
      'itemCount',
      'editBoxIndex',
      'maxHeight',
      'widthMode',
      'width',
      'maxWidth',
    ],
  });
  return `${openTag}
  <!-- EgFlotationMenuItem × ${count}；行配置见定制 -->
</EgFlotationMenu>`;
}

export const flotationBoxMenuPropRows: DocPropRow[] = [
  {
    name: 'showAdd / addLabel / showDivider',
    type: 'boolean / string / boolean',
    defaultValue: 'true / Add / true',
    description: showcaseText('Bottom Add line with divider (Figma Menu).', '底部 Add 行与分隔线（Figma Menu）。'),
  },
  {
    name: 'widthMode / width / heightMode / height / maxHeight',
    type: 'TooltipWidthMode / number / …',
    defaultValue: 'fixed / — / adaptive / — / —',
    description: showcaseText('Transparent EgTooltip shell; # default is EgFlotationMenuItem list.', '透传 EgTooltip 外壳；#default 为 EgFlotationMenuItem 列表。'),
  },
];

export const flotationBoxMenuSlotRows: DocPropRow[] = [
  {
    name: 'default',
    type: '—',
    defaultValue: '—',
    description: showcaseText('EgFlotationMenuItem row; can be preset props or fully customized.', 'EgFlotationMenuItem 行；可用预置 props 或完全自定义。'),
  },
];

/* ── Item（已并入 Box 编辑行） ── */

export const flotationItemCustomizeDefaults = {
  boxType: 'text',
  label: showcaseText('Copy', '文案'),
  disabled: false,
  focused: false,
  showCheckbox: false,
  checked: false,
  showTag: true,
  tagText: 'Tag',
  tagStatus: 'danger',
  showReddot: false,
  showCascader: false,
  showMessage: false,
  messageText: '0',
  messageType: 'subtle',
  symbolIcon: 'eds-add',
};

export function buildFlotationItemUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgFlotationMenuItem', state, {
    defaults: { ...flotationItemCustomizeDefaults },
  });
}

export const flotationItemPropRows: DocPropRow[] = [
  {
    name: 'boxType',
    type: "'text' | 'symbol-text' | 'image-text'",
    defaultValue: "'text'",
    description: showcaseText('Figma Box Type. Preset layout; entire row can be replaced by Menu # default content.', 'Figma Box Type。预置布局；整行可由 Menu #default 内容替换。'),
  },
  {
    name: 'label / disabled / focused',
    type: 'string / boolean / boolean',
    defaultValue: "'Label' / false / false",
    description: showcaseText('Copywriting and interaction (hover CSS; focused → --event-focus-brand-weaken).', '文案与交互态（hover CSS；focused → --event-focus-brand-weaken）。'),
  },
  {
    name: 'showCheckbox / checked',
    type: 'boolean',
    defaultValue: 'false',
    description: showcaseText('Nested EgCheckbox.', '嵌套 EgCheckbox。'),
  },
  {
    name: 'showTag / tagText / tagStatus',
    type: 'boolean / string / TagStatus',
    defaultValue: 'true / Tag / danger',
    description: showcaseText('Nested EgTag family = status size = sm.', '嵌套 EgTag family=status size=sm。'),
  },
  {
    name: 'showReddot / showCascader / showMessage / messageType',
    type: 'boolean / … / MessageType',
    defaultValue: 'false / subtle',
    description: showcaseText('EgReddot, cascading arrows, EgMessage (type: subtle | brand | danger).', 'EgReddot、级联箭头、EgMessage（type：subtle | brand | danger）。'),
  },
];

export const flotationItemSlotRows: DocPropRow[] = [
  { name: 'default', type: '—', defaultValue: '—', description: showcaseText('Label copy.', 'Label 文案。') },
  { name: 'checkbox', type: '—', defaultValue: '—', description: showcaseText('Select the control on the left.', '左侧选择控件。') },
  { name: 'leading', type: '—', defaultValue: '—', description: 'Symbol / Image。' },
  { name: 'tag', type: '—', defaultValue: '—', description: showcaseText('Tag。', '标签。') },
  { name: 'message', type: '—', defaultValue: '—', description: showcaseText('Trailing Message。', '右侧 Message。') },
  {
    name: 'trailing',
    type: '—',
    defaultValue: '—',
    description: showcaseText('Entire block right area (overrides reddot/cascader/message).', '整块右侧区（覆盖 reddot/cascader/message）。'),
  },
];

/** Box 页 Props / Slots（Menu + Item 合并） */
export const flotationBoxDocPropRows: DocPropRow[] = [
  ...flotationBoxMenuPropRows,
  ...flotationItemPropRows,
];

export const flotationBoxDocSlotRows: DocPropRow[] = [
  ...flotationBoxMenuSlotRows,
  ...flotationItemSlotRows,
];

export function resolveFlotationTriggerSceneComponentTag(
  triggerKind: FlotationTriggerKind,
): string {
  return triggerKind === 'module-menu' ? 'EgModuleMenuTrigger' : 'EgFlotationTrigger';
}

export function resolveFlotationTriggerSceneImportCode(
  triggerKind: FlotationTriggerKind,
): string {
  const tag = resolveFlotationTriggerSceneComponentTag(triggerKind);
  return `import { ${tag} } from '@eds/desktop-components';`;
}

export function resolveFlotationBoxSceneComponentTag(boxKind: FlotationBoxKind): string {
  switch (boxKind) {
    case 'standard-cascade-menu':
      return 'EgCascadeMenu';
    case 'scene-address-dropdown':
      return 'EgAddressDropdownMenu';
    case 'scene-address-hover':
      return 'EgAddressHoverMenu';
    default:
      return 'EgFlotationMenu';
  }
}

export function resolveFlotationBoxSceneImportCode(boxKind: FlotationBoxKind): string {
  const tag = resolveFlotationBoxSceneComponentTag(boxKind);
  return `import { ${tag} } from '@eds/desktop-components';`;
}
