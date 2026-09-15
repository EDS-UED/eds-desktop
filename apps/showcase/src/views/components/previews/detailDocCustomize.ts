import {
  buildDetailAddressApplyItemRow,
  createDetailApplyItemRow,
  createDefaultDetailSections,
  cryptoNames,
  detailApplyItemVariants,
  getProcessedCrypto,
  isDetailApplyItemVariantId,
  type DetailAddressLayout,
  type DetailApplyItemVariantId,
  type DetailSectionData,
} from '@eds/desktop-components';
import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import {
  buttonToneRows,
  countSelectOptions,
  directionLeftRightRows,
  showcaseButtonCustomizeFieldLabels,
} from '@/data/showcasePropLabels';
import { tagStatusStyleOptions } from './tagDocCustomize';
import { resolveTabLabels, tabsCustomizeDefaults, tabsSpacingSizeOptions } from './tabDocCustomize';
import {
  detailApplyItemDataSourceOptions,
} from './detailApplyItemPresets';

export const detailFigmaNode = '2170:2963';

const DETAIL_SECTION_MAX_ITEMS = 50;

export function detailSectionEditItemIndexKey(sectionNum: 1 | 2): string {
  return `section${sectionNum}EditItemIndex`;
}

export function detailSectionShowTitleIconKey(sectionNum: 1 | 2): string {
  return `section${sectionNum}ShowTitleIcon`;
}

export function detailSectionItemKey(
  sectionNum: 1 | 2,
  field:
    | 'TitleIcon'
    | 'Title'
    | 'Value'
    | 'DataSource'
    | 'ShowValueSymbol'
    | 'ValueSymbolKind'
    | 'ValueSymbolCrypto'
    | 'ValueSymbolAvatarName'
    | 'ShowValueLink'
    | 'ValueLinkLabel'
    | 'ShowValueCopy'
    | 'ShowValueAddressBook'
    | 'ShowValueAmlSearch'
    | 'ShowValueBrowser'
    | 'AddressLayout',
  itemIndex: number,
): string {
  return `section${sectionNum}Item${itemIndex}${field}`;
}

const detailCryptoOptions = cryptoNames
  .filter((name) => Boolean(getProcessedCrypto(name)))
  .map((name) => ({ value: name, label: name }));

const detailValueSymbolKindOptions = [
  { value: 'crypto', label: showcaseText('<g id="Bold">Currency Type<g id="Bold">:</g></g>', '币种') },
  { value: 'avatar', label: showcaseText('Portrait', '头像') },
];

export function createDetailSectionItemDefaults(
  sectionNum: 1 | 2,
): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};

  for (let itemIndex = 1; itemIndex <= DETAIL_SECTION_MAX_ITEMS; itemIndex += 1) {
    out[detailSectionItemKey(sectionNum, 'TitleIcon', itemIndex)] = 'eds-add';
    out[detailSectionItemKey(sectionNum, 'Title', itemIndex)] = 'Title';
    out[detailSectionItemKey(sectionNum, 'Value', itemIndex)] = 'Value';
    out[detailSectionItemKey(sectionNum, 'DataSource', itemIndex)] = 'custom';
    out[detailSectionItemKey(sectionNum, 'ShowValueSymbol', itemIndex)] = false;
    out[detailSectionItemKey(sectionNum, 'ValueSymbolKind', itemIndex)] = 'crypto';
    out[detailSectionItemKey(sectionNum, 'ValueSymbolCrypto', itemIndex)] = 'eds-btc-bitcoin';
    out[detailSectionItemKey(sectionNum, 'ValueSymbolAvatarName', itemIndex)] = 'Alex Chen';
    out[detailSectionItemKey(sectionNum, 'ShowValueLink', itemIndex)] = false;
    out[detailSectionItemKey(sectionNum, 'ValueLinkLabel', itemIndex)] = 'Edit';
    out[detailSectionItemKey(sectionNum, 'ShowValueCopy', itemIndex)] = false;
    out[detailSectionItemKey(sectionNum, 'ShowValueAddressBook', itemIndex)] = false;
    out[detailSectionItemKey(sectionNum, 'ShowValueAmlSearch', itemIndex)] = false;
    out[detailSectionItemKey(sectionNum, 'ShowValueBrowser', itemIndex)] = false;
    out[detailSectionItemKey(sectionNum, 'AddressLayout', itemIndex)] = 'single';
  }

  return out;
}

/** 内容区 1 默认展示全部 Apply_Item 变体（每行锁定 preset，仅可切换数据来源）。 */
export function createDetailApplyItemShowcaseSectionDefaults(
  sectionNum: 1 | 2,
): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};

  detailApplyItemVariants.forEach((preset, index) => {
    const itemIndex = index + 1;
    if (itemIndex > DETAIL_SECTION_MAX_ITEMS) return;
    out[detailSectionItemKey(sectionNum, 'DataSource', itemIndex)] = preset.id;
    if (isDetailAddressPresetDataSource(preset.id)) {
      out[detailSectionItemKey(sectionNum, 'AddressLayout', itemIndex)] = 'multi-collapsed';
    }
  });

  return out;
}

export function resetDetailSectionItemCustomizeFields(
  target: Record<string, unknown>,
  sectionNum: 1 | 2,
  itemIndex: number,
): void {
  const defaults = createDetailSectionItemDefaults(sectionNum);
  const marker = `Item${itemIndex}`;

  for (const [key, value] of Object.entries(defaults)) {
    if (!key.includes(marker) || key.includes(`${marker}DataSource`)) continue;
    target[key] = value;
  }
}

export function isDetailAddressPresetDataSource(dataSource: string): dataSource is 'sender' | 'receiver' {
  return dataSource === 'sender' || dataSource === 'receiver';
}

function parseDetailAddressLayout(
  state: Record<string, unknown>,
  sectionNum: 1 | 2,
  itemIndex: number,
): DetailAddressLayout {
  const raw = String(
    state[detailSectionItemKey(sectionNum, 'AddressLayout', itemIndex)] ?? 'single',
  );
  if (
    raw === 'multi-collapsed'
    || raw === 'multi-expanded'
    || raw === 'multi-orders'
  ) {
    return raw;
  }
  return 'single';
}

const detailAddressLayoutOptions = [
  { value: 'single', label: showcaseText('Single address', '单地址') },
  { value: 'multi-collapsed', label: showcaseText('Multi-address default', '多地址默认') },
  { value: 'multi-orders', label: showcaseText('Count', '数量') },
  { value: 'multi-expanded', label: showcaseText('Multi-address expansion', '多地址展开') },
] as const;

export function isDetailItemPresetDataSource(
  state: Record<string, unknown>,
  sectionNum: 1 | 2,
  itemIndex: number,
): boolean {
  const dataSource = String(
    state[detailSectionItemKey(sectionNum, 'DataSource', itemIndex)] ?? 'custom',
  );
  return dataSource !== 'custom' && isDetailApplyItemVariantId(dataSource);
}

export const detailCustomizeDefaults = {
  eyebrow: 'Title',
  headline: 'Headline',
  statusTag: 'Tag',
  statusTagSize: 'lg',
  statusTagStatus: 'danger',
  showEyebrow: true,
  showStatusTag: true,
  showTabs: true,
  tabCount: tabsCustomizeDefaults.count,
  tabLabels: tabsCustomizeDefaults.labels,
  tabHorizontalGap: tabsCustomizeDefaults.horizontalGap,
  tabVerticalGap: tabsCustomizeDefaults.verticalGap,
  activeTab: '0',
  section1ShowTitle: true,
  section1Title: 'Section',
  section1ItemCount: String(detailApplyItemVariants.length),
  section1ShowTitleIcon: true,
  section1ShowCollapse: false,
  section1CollapseLabel: 'Connect to EDS',
  section2Enabled: true,
  section2ShowTitle: false,
  section2Title: 'Section',
  section2ItemCount: '3',
  section2ShowTitleIcon: true,
  section2ShowCollapse: false,
  section2CollapseLabel: 'Connect to EDS',
  section1EditItemIndex: '1',
  section2EditItemIndex: '1',
  showToolbar: true,
  showToolbarNav: false,
  showToolbarNote: true,
  toolbarDividerPinned: true,
  toolbarCurrent: '12',
  toolbarTotal: '1000',
  toolbarTone: 'decor',
  toolbarDirection: 'right',
  toolbarConfirmLabel: 'Confirm',
  toolbarCancelLabel: 'Cancel',
  ...createDetailSectionItemDefaults(1),
  ...createDetailApplyItemShowcaseSectionDefaults(1),
  ...createDetailSectionItemDefaults(2),
};

export const detailHeaderCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'showEyebrow', label: showcaseText('Show header', '显示眉题'), row: 0 },
  {
    kind: 'text',
    key: 'eyebrow',
    label: showcaseText('Headline', '眉题'),
    row: 0,
    visibleWhen: (state) => Boolean(state.showEyebrow),
  },
  { kind: 'boolean', key: 'showTabs', label: 'Headline Tab', row: 0 },
  { kind: 'text', key: 'headline', label: 'Headline', row: 0 },
  { kind: 'boolean', key: 'showStatusTag', label: showcaseText('Show Status Tag', '显示 Status Tag'), row: 0 },
  {
    kind: 'text',
    key: 'statusTag',
    label: showcaseText('Status Tag copy.', 'Status Tag 文案'),
    row: 1,
    visibleWhen: (state) => Boolean(state.showStatusTag),
  },
  {
    kind: 'select',
    key: 'statusTagStatus',
    label: showcaseText('Status Tag Status', 'Status Tag 状态'),
    row: 1,
    visibleWhen: (state) => Boolean(state.showStatusTag),
    options: tagStatusStyleOptions,
  },
];

const detailTabCountOptions = countSelectOptions(10, 2);

export function buildDetailTabsCustomizeControls(
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const labels = resolveDetailTabLabels(state);

  return [
    {
      kind: 'select',
      key: 'tabCount',
      label: showcaseText('Count', '数量'),
      row: 0,
      options: detailTabCountOptions,
    },
    {
      kind: 'text',
      key: 'tabLabels',
      label: showcaseText('Tab', '标签名'),
      row: 0,
      placeholder: showcaseText('Separated by spaces, e.g. Overview Assets History', '用空格分隔，如 Overview Assets History'),
    },
    {
      kind: 'select',
      key: 'tabHorizontalGap',
      label: showcaseText('HorizontalGap', '水平间距'),
      row: 0,
      options: tabsSpacingSizeOptions.map((option) => ({ ...option })),
    },
    {
      kind: 'select',
      key: 'tabVerticalGap',
      label: showcaseText('VerticalGap', '垂直间距'),
      row: 0,
      options: tabsSpacingSizeOptions.map((option) => ({ ...option })),
    },
    {
      kind: 'select',
      key: 'activeTab',
      label: showcaseText('Selected Items', '选中项'),
      row: 0,
      options: labels.map((label, index) => ({
        value: String(index),
        label: `${index + 1} · ${label}`,
      })),
    },
  ];
}

export function resolveDetailTabLabels(state: Record<string, unknown>): string[] {
  return resolveTabLabels(state.tabLabels, state.tabCount);
}

export function resolveDetailActiveTab(state: Record<string, unknown>): number {
  const labels = resolveDetailTabLabels(state);
  const raw = Number.parseInt(String(state.activeTab ?? '0'), 10);
  if (!Number.isFinite(raw)) return 0;
  return Math.min(Math.max(0, raw), Math.max(0, labels.length - 1));
}

const detailItemCountOptions = Array.from({ length: 50 }, (_, index) => {
  const value = String(index + 1);
  return { value, label: value };
});

function isDetailSection2Active(state: Record<string, unknown>): boolean {
  return Boolean(state.section2Enabled);
}

export function parseDetailSectionItemCount(
  state: Record<string, unknown>,
  sectionNum: 1 | 2,
): number {
  const raw = Number(state[`section${sectionNum}ItemCount`] ?? 3);
  return Math.min(DETAIL_SECTION_MAX_ITEMS, Math.max(1, Number.isFinite(raw) ? raw : 3));
}

export function parseDetailSectionEditItemIndex(
  state: Record<string, unknown>,
  sectionNum: 1 | 2,
): number {
  const count = parseDetailSectionItemCount(state, sectionNum);
  const parsed = Number.parseInt(String(state[detailSectionEditItemIndexKey(sectionNum)] ?? '1'), 10);
  const index = Number.isFinite(parsed) ? parsed : 1;
  return Math.min(count, Math.max(1, index));
}

function isDetailItemCustomDataSource(
  state: Record<string, unknown>,
  sectionNum: 1 | 2,
  itemIndex: number,
): boolean {
  return !isDetailItemPresetDataSource(state, sectionNum, itemIndex);
}

function buildDetailSectionItemRowControls(
  sectionNum: 1 | 2,
  state: Record<string, unknown>,
  editItemRow: number,
  customFieldsRow: number,
  symbolRow: number,
  actionsRow: number,
  visibleWhen: (state: Record<string, unknown>) => boolean,
): DocCustomizeControl[] {
  const count = parseDetailSectionItemCount(state, sectionNum);
  const editIndex = parseDetailSectionEditItemIndex(state, sectionNum);
  const editItemIndexKey = detailSectionEditItemIndexKey(sectionNum);
  const dataSourceKey = detailSectionItemKey(sectionNum, 'DataSource', editIndex);
  const isCustom = (state: Record<string, unknown>) =>
    visibleWhen(state) && isDetailItemCustomDataSource(state, sectionNum, editIndex);
  const sectionShowTitleIconKey = detailSectionShowTitleIconKey(sectionNum);
  const showSymbolKey = detailSectionItemKey(sectionNum, 'ShowValueSymbol', editIndex);
  const symbolKindKey = detailSectionItemKey(sectionNum, 'ValueSymbolKind', editIndex);
  const symbolVisible = (s: Record<string, unknown>) =>
    isCustom(s) && Boolean(s[showSymbolKey]);

  return [
    {
      kind: 'select',
      key: editItemIndexKey,
      label: showcaseText('Edit row', '编辑行'),
      row: editItemRow,
      visibleWhen,
      options: Array.from({ length: count }, (_, index) => {
        const rowNumber = index + 1;
        return { value: String(rowNumber), label: `第 ${rowNumber} 行` };
      }),
    },
    {
      kind: 'select',
      key: dataSourceKey,
      label: showcaseText('Sources of Data Used', '数据来源'),
      row: editItemRow,
      visibleWhen,
      options: detailApplyItemDataSourceOptions,
    },
    {
      kind: 'select',
      key: detailSectionItemKey(sectionNum, 'AddressLayout', editIndex),
      label: showcaseText('Address Morphology', '地址形态'),
      row: editItemRow,
      visibleWhen: (s) => {
        const source = String(
          s[detailSectionItemKey(sectionNum, 'DataSource', editIndex)] ?? 'custom',
        );
        return visibleWhen(s) && isDetailAddressPresetDataSource(source);
      },
      options: detailAddressLayoutOptions.map((option) => ({ ...option })),
    },
    {
      kind: 'text',
      key: detailSectionItemKey(sectionNum, 'TitleIcon', editIndex),
      label: showcaseText('Title Icon', 'Title 图标'),
      row: customFieldsRow,
      visibleWhen: (s) =>
        visibleWhen(s)
        && Boolean(s[sectionShowTitleIconKey])
        && isDetailItemCustomDataSource(s, sectionNum, editIndex),
    },
    {
      kind: 'text',
      key: detailSectionItemKey(sectionNum, 'Title', editIndex),
      label: showcaseText('Title copy.', 'Title 文案'),
      row: customFieldsRow,
      visibleWhen: isCustom,
    },
    {
      kind: 'text',
      key: detailSectionItemKey(sectionNum, 'Value', editIndex),
      label: showcaseText('Value copy.', 'Value 文案'),
      row: customFieldsRow,
      visibleWhen: isCustom,
    },
    {
      kind: 'boolean',
      key: showSymbolKey,
      label: showcaseText('ShowIcon', '显示符号'),
      row: symbolRow,
      visibleWhen: isCustom,
    },
    {
      kind: 'select',
      key: symbolKindKey,
      label: showcaseText('Icon type.', '符号类型'),
      row: symbolRow,
      visibleWhen: symbolVisible,
      options: detailValueSymbolKindOptions,
    },
    {
      kind: 'select',
      key: detailSectionItemKey(sectionNum, 'ValueSymbolCrypto', editIndex),
      label: showcaseText('<g id="Bold">Currency Type<g id="Bold">:</g></g>', '币种'),
      row: symbolRow,
      visibleWhen: (s) => symbolVisible(s) && String(s[symbolKindKey] ?? 'crypto') === 'crypto',
      options: detailCryptoOptions,
    },
    {
      kind: 'text',
      key: detailSectionItemKey(sectionNum, 'ValueSymbolAvatarName', editIndex),
      label: showcaseText('Avatar Name', '头像名称'),
      row: symbolRow,
      visibleWhen: (s) => symbolVisible(s) && String(s[symbolKindKey]) === 'avatar',
    },
    {
      kind: 'boolean',
      key: detailSectionItemKey(sectionNum, 'ShowValueLink', editIndex),
      label: showcaseText('Show Link', '显示 Link'),
      row: actionsRow,
      visibleWhen: isCustom,
    },
    {
      kind: 'text',
      key: detailSectionItemKey(sectionNum, 'ValueLinkLabel', editIndex),
      label: showcaseText('Link copy.', 'Link 文案'),
      row: actionsRow,
      visibleWhen: (s) =>
        isCustom(s) && Boolean(s[detailSectionItemKey(sectionNum, 'ShowValueLink', editIndex)]),
    },
    {
      kind: 'boolean',
      key: detailSectionItemKey(sectionNum, 'ShowValueCopy', editIndex),
      label: showcaseText('ShowCopy', '显示复制'),
      row: actionsRow,
      visibleWhen: isCustom,
    },
    {
      kind: 'boolean',
      key: detailSectionItemKey(sectionNum, 'ShowValueAddressBook', editIndex),
      label: showcaseText('Show add to address book', '显示添加到地址簿'),
      row: actionsRow,
      visibleWhen: isCustom,
    },
    {
      kind: 'boolean',
      key: detailSectionItemKey(sectionNum, 'ShowValueAmlSearch', editIndex),
      label: showcaseText('Show AML Query', '显示 AML 查询'),
      row: actionsRow,
      visibleWhen: isCustom,
    },
    {
      kind: 'boolean',
      key: detailSectionItemKey(sectionNum, 'ShowValueBrowser', editIndex),
      label: showcaseText('Show block explorer', '显示区块浏览器'),
      row: actionsRow,
      visibleWhen: isCustom,
    },
  ];
}

export function buildDetailSectionCustomizeControls(
  sectionNum: 1 | 2,
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const showTitleKey = `section${sectionNum}ShowTitle`;
  const titleKey = `section${sectionNum}Title`;
  const itemCountKey = `section${sectionNum}ItemCount`;
  const showCollapseKey = `section${sectionNum}ShowCollapse`;
  const collapseLabelKey = `section${sectionNum}CollapseLabel`;
  const sectionActive = (state: Record<string, unknown>) =>
    sectionNum === 1 || isDetailSection2Active(state);
  const titleRow = 0;
  const collapseRow = 1;
  const editItemRow = 2;
  const customFieldsRow = 3;
  const symbolRow = 4;
  const actionsRow = 5;

  const controls: DocCustomizeControl[] = [];

  if (sectionNum === 2) {
    controls.push({
      kind: 'boolean',
      key: 'section2Enabled',
      label: showcaseText('ShowContent area 2', '显示内容区 2'),
      row: titleRow,
    });
  }

  controls.push(
    {
      kind: 'boolean',
      key: showTitleKey,
      label: showcaseText('ShowTitle', '显示标题'),
      row: titleRow,
      visibleWhen: sectionActive,
    },
    {
      kind: 'text',
      key: titleKey,
      label: showcaseText('Title copy.', '标题文案'),
      row: titleRow,
      visibleWhen: (state) => sectionActive(state) && Boolean(state[showTitleKey]),
    },
    {
      kind: 'select',
      key: itemCountKey,
      label: showcaseText('# of Lines', '行数'),
      row: titleRow,
      visibleWhen: sectionActive,
      options: detailItemCountOptions,
    },
    {
      kind: 'boolean',
      key: detailSectionShowTitleIconKey(sectionNum),
      label: showcaseText('Show Title Icon', '显示 Title 图标'),
      row: titleRow,
      visibleWhen: sectionActive,
    },
    {
      kind: 'boolean',
      key: showCollapseKey,
      label: showcaseText('Collapse link', 'Collapse 链接'),
      row: collapseRow,
      visibleWhen: sectionActive,
    },
    {
      kind: 'text',
      key: collapseLabelKey,
      label: showcaseText('Collapse copy.', 'Collapse 文案'),
      row: collapseRow,
      visibleWhen: (state) => sectionActive(state) && Boolean(state[showCollapseKey]),
    },
    ...buildDetailSectionItemRowControls(
      sectionNum,
      state,
      editItemRow,
      customFieldsRow,
      symbolRow,
      actionsRow,
      sectionActive,
    ),
  );

  return controls;
}

export const detailToolbarCustomizeControls: DocCustomizeControl[] = [
  { kind: 'boolean', key: 'showToolbar', label: showcaseText('ShowToolbar', '显示工具栏') },
  {
    kind: 'boolean',
    key: 'toolbarDividerPinned',
    label: showcaseText('Dividers resident', '分割线常驻'),
    visibleWhen: (state) => Boolean(state.showToolbar),
  },
  {
    kind: 'boolean',
    key: 'showToolbarNav',
    label: showcaseText('Flip Navigation', '翻页导航'),
    visibleWhen: (state) => Boolean(state.showToolbar),
  },
  {
    kind: 'boolean',
    key: 'showToolbarNote',
    label: showcaseText('Notes', '备注'),
    visibleWhen: (state) => Boolean(state.showToolbar),
  },
  {
    kind: 'text',
    key: 'toolbarCurrent',
    label: showcaseText('Current Sequence Number', '当前序号'),
    visibleWhen: (state) => Boolean(state.showToolbar && state.showToolbarNav),
  },
  {
    kind: 'text',
    key: 'toolbarTotal',
    label: showcaseText('Total', '总数'),
    visibleWhen: (state) => Boolean(state.showToolbar && state.showToolbarNav),
  },
  {
    kind: 'select',
    key: 'toolbarTone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: buttonToneRows
      .filter((row) => ['brand', 'decor'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: (state) => Boolean(state.showToolbar),
  },
  {
    kind: 'select',
    key: 'toolbarDirection',
    label: showcaseButtonCustomizeFieldLabels.direction,
    options: directionLeftRightRows.map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: (state) => Boolean(state.showToolbar && !state.showToolbarNav),
  },
  {
    kind: 'text',
    key: 'toolbarConfirmLabel',
    label: showcaseButtonCustomizeFieldLabels.confirmLabel,
    visibleWhen: (state) => Boolean(state.showToolbar),
  },
  {
    kind: 'text',
    key: 'toolbarCancelLabel',
    label: showcaseButtonCustomizeFieldLabels.cancelLabel,
    visibleWhen: (state) => Boolean(state.showToolbar),
  },
];

function applyDetailSectionTitleIconVisibility(
  item: DetailSectionData['items'][number],
  sectionNum: 1 | 2,
  state: Record<string, unknown>,
): DetailSectionData['items'][number] {
  const sectionShowsIcons =
    state[detailSectionShowTitleIconKey(sectionNum)] !== false;
  if (!sectionShowsIcons) {
    return { ...item, showTitleIcon: false };
  }
  if (item.showTitleIcon === false) {
    const { showTitleIcon: _hidden, ...rest } = item;
    return rest;
  }
  return item;
}

function resolveDetailItemFromCustomize(
  sectionNum: 1 | 2,
  itemIndex: number,
  state: Record<string, unknown>,
): DetailSectionData['items'][number] {
  const itemKey = `${sectionNum === 1 ? 'a' : 'b'}${itemIndex}`;
  const dataSource = String(
    state[detailSectionItemKey(sectionNum, 'DataSource', itemIndex)] ?? 'custom',
  );

  if (dataSource !== 'custom') {
    if (isDetailAddressPresetDataSource(dataSource)) {
      const layout = parseDetailAddressLayout(state, sectionNum, itemIndex);
      const presetItem = buildDetailAddressApplyItemRow(dataSource, layout, {
        key: itemKey,
        ...(layout === 'multi-collapsed' || layout === 'multi-orders'
          ? { addressCount: 16 }
          : {}),
      });
      return applyDetailSectionTitleIconVisibility(presetItem, sectionNum, state);
    }

    const presetItem = isDetailApplyItemVariantId(dataSource)
      ? createDetailApplyItemRow(dataSource, { key: itemKey })
      : undefined;
    if (presetItem) {
      /** Apply_Item 挂件锁死；仅 section 级 Title 图标开关可覆盖 titleIcon 显隐。 */
      return applyDetailSectionTitleIconVisibility(presetItem, sectionNum, state);
    }
  }

  const showValueSymbol = Boolean(
    state[detailSectionItemKey(sectionNum, 'ShowValueSymbol', itemIndex)],
  );
  const valueSymbolKind = String(
    state[detailSectionItemKey(sectionNum, 'ValueSymbolKind', itemIndex)] ?? 'crypto',
  ) as 'crypto' | 'avatar';

  const item: DetailSectionData['items'][number] = {
    key: itemKey,
    title: String(state[detailSectionItemKey(sectionNum, 'Title', itemIndex)] ?? 'Title'),
    titleIcon: String(
      state[detailSectionItemKey(sectionNum, 'TitleIcon', itemIndex)] ?? 'eds-add',
    ),
    value: String(state[detailSectionItemKey(sectionNum, 'Value', itemIndex)] ?? 'Value'),
    valueType: 'text',
    showValueSymbol,
    valueSymbolKind: valueSymbolKind === 'avatar' ? 'avatar' : 'crypto',
    valueSymbolCrypto: String(
      state[detailSectionItemKey(sectionNum, 'ValueSymbolCrypto', itemIndex)] ?? 'eds-btc-bitcoin',
    ),
    valueSymbolAvatarName: String(
      state[detailSectionItemKey(sectionNum, 'ValueSymbolAvatarName', itemIndex)] ?? 'Alex Chen',
    ),
    showValueLink: Boolean(state[detailSectionItemKey(sectionNum, 'ShowValueLink', itemIndex)]),
    valueLinkLabel: String(
      state[detailSectionItemKey(sectionNum, 'ValueLinkLabel', itemIndex)] ?? 'Edit',
    ),
    showValueCopy: Boolean(state[detailSectionItemKey(sectionNum, 'ShowValueCopy', itemIndex)]),
    showValueAddressBook: Boolean(
      state[detailSectionItemKey(sectionNum, 'ShowValueAddressBook', itemIndex)],
    ),
    showValueAmlSearch: Boolean(
      state[detailSectionItemKey(sectionNum, 'ShowValueAmlSearch', itemIndex)],
    ),
    showValueBrowser: Boolean(
      state[detailSectionItemKey(sectionNum, 'ShowValueBrowser', itemIndex)],
    ),
  };

  if (showValueSymbol) {
    if (valueSymbolKind === 'avatar') {
      item.valueType = 'user';
    } else {
      item.valueType = 'crypto';
      item.valueIcon = item.valueSymbolCrypto;
    }
  }

  return applyDetailSectionTitleIconVisibility(item, sectionNum, state);
}

function buildDetailSectionFromCustomize(
  sectionNum: 1 | 2,
  state: Record<string, unknown>,
): DetailSectionData {
  const showTitle = Boolean(state[`section${sectionNum}ShowTitle`]);
  const title = String(state[`section${sectionNum}Title`] ?? 'Section');
  const showCollapse = Boolean(state[`section${sectionNum}ShowCollapse`]);
  const collapseLabel = String(state[`section${sectionNum}CollapseLabel`] ?? 'Connect to EDS');
  const count = parseDetailSectionItemCount(state, sectionNum);

  return {
    key: sectionNum === 1 ? 'section-a' : 'section-b',
    title: showTitle ? title : undefined,
    showDivider: sectionNum === 1 && isDetailSection2Active(state),
    showCollapse,
    collapseLabel,
    items: Array.from({ length: count }, (_, index) =>
      resolveDetailItemFromCustomize(sectionNum, index + 1, state),
    ),
  };
}

export function buildDetailSectionsFromCustomize(
  state: Record<string, unknown>,
): DetailSectionData[] {
  const sections: DetailSectionData[] = [buildDetailSectionFromCustomize(1, state)];

  if (isDetailSection2Active(state)) {
    sections.push(buildDetailSectionFromCustomize(2, state));
  }

  return sections;
}

export function findDetailItemByKey(
  sections: DetailSectionData[],
  key: string,
): DetailSectionData['items'][number] | undefined {
  for (const section of sections) {
    const item = section.items.find((row) => (row.key ?? '') === key);
    if (item) {
      return item;
    }
  }
  return undefined;
}

export function buildDetailUsageSnippet(state: Record<string, unknown>): string {
  const lines = [
    '<EgDetail',
    `  eyebrow="${String(state.eyebrow ?? 'Title')}"`,
    `  headline="${String(state.headline ?? 'Headline')}"`,
    `  status-tag="${String(state.statusTag ?? 'Tag')}"`,
    `  status-tag-size="${String(state.statusTagSize ?? 'lg')}"`,
    `  status-tag-status="${String(state.statusTagStatus ?? 'danger')}"`,
    `  :show-eyebrow="${Boolean(state.showEyebrow)}"`,
    `  :show-status-tag="${Boolean(state.showStatusTag)}"`,
    `  :show-tabs="${Boolean(state.showTabs)}"`,
  ];

  if (state.showTabs) {
    const labels = resolveDetailTabLabels(state);
    lines.push(
      `  :tab-labels="[${labels.map((label) => `'${label.replace(/'/g, "\\'")}'`).join(', ')}]"`,
      `  v-model:active-tab="${resolveDetailActiveTab(state)}"`,
    );
    if (state.tabHorizontalGap !== 'xl') {
      lines.push(`  tab-horizontal-gap="${String(state.tabHorizontalGap)}"`);
    }
    if (state.tabVerticalGap !== 'xl') {
      lines.push(`  tab-vertical-gap="${String(state.tabVerticalGap)}"`);
    }
  }

  lines.push(
    `  :show-toolbar="${Boolean(state.showToolbar)}"`,
  );

  if (state.showToolbar && state.toolbarDividerPinned) {
    lines.push('  :toolbar-divider-pinned="true"');
  }

  if (state.showToolbar && state.showToolbarNav) {
    lines.push(
      `  :show-toolbar-nav="${Boolean(state.showToolbarNav)}"`,
      `  toolbar-current="${String(state.toolbarCurrent ?? '12')}"`,
      `  toolbar-total="${String(state.toolbarTotal ?? '1000')}"`,
    );
  } else if (state.showToolbar) {
    lines.push('  :show-toolbar-nav="false"');
  }

  if (state.showToolbar && state.showToolbarNote === false) {
    lines.push('  :show-toolbar-note="false"');
  }

  lines.push(
    '  @close="onClose"',
    '  @toolbar-prev="onToolbarPrev"',
    '  @toolbar-next="onToolbarNext"',
    '  @toolbar-confirm="onConfirm"',
    '  @toolbar-cancel="onCancel"',
    '/>',
  );

  return lines.join('\n');
}

export const detailPropRows: DocPropRow[] = [
  { name: 'eyebrow', type: 'string', defaultValue: "'Title'", description: showcaseText('Headline Body Small Strong.', 'Headline 眉题（Body Small Strong）。') },
  { name: 'headline', type: 'string', defaultValue: "'Headline'", description: showcaseText('Headline main title.', 'Headline 主标题。') },
  { name: 'statusTag', type: 'string', defaultValue: "'Tag'", description: showcaseText('EgTag copy next to Headline.', 'Headline 旁 EgTag 文案。') },
  { name: 'statusTagSize', type: "'lg' | 'md' | 'sm'", defaultValue: "'lg'", description: showcaseText('Headline Status Tag Size（EgTag size）。', 'Headline Status Tag 尺寸（EgTag size）。') },
  { name: 'statusTagStatus', type: 'TagStatus', defaultValue: "'danger'", description: showcaseText('Headline Status Tag semantic color (EgTag status).', 'Headline Status Tag 语义色（EgTag status）。') },
  { name: 'showEyebrow', type: 'boolean', defaultValue: 'true', description: 'Figma Title=Yes/No。' },
  { name: 'showStatusTag', type: 'boolean', defaultValue: 'true', description: showcaseText('Whether the Status Tag is rendered.', '是否渲染 Status Tag。') },
  { name: 'showTabs', type: 'boolean', defaultValue: 'true', description: showcaseText('EgTabs + Page Divider under Headline.', 'Headline 下 EgTabs + Page Divider。') },
  { name: 'tabLabels', type: 'string[]', defaultValue: "['Tab', …]", description: showcaseText('Tabs Tag copy.', 'Tabs 标签文案。') },
  {
    name: 'tabHorizontalGap',
    type: "'xl' | 'md' | 'sm' | 'xs'",
    defaultValue: "'xl'",
    description: 'EgTabs horizontalGap：xl → gap var(--spacing-5)；md → spacing-4；sm → spacing-3；xs → spacing-2。',
  },
  {
    name: 'tabVerticalGap',
    type: "'xl' | 'md' | 'sm' | 'xs'",
    defaultValue: "'xl'",
    description: 'EgTabs verticalGap（padding-bottom + stroke-xl）：xl → spacing-2-5；md → spacing-2；sm → spacing-1-5；xs → spacing-1。',
  },
  { name: 'sections', type: 'DetailSectionData[]', defaultValue: 'createDefaultDetailSections()', description: showcaseText('Section/Item data for the content area.', '内容区 Section / Item 数据。') },
  { name: 'activeTab', type: 'number', defaultValue: '0', description: showcaseText('v-model: activeTab — Headline Tabs checks the index.', 'v-model:activeTab — Headline Tabs 选中索引。') },
  { name: 'showToolbar', type: 'boolean', defaultValue: 'true', description: showcaseText('Bottom toolbar (flip + Cancel/Confirm).', '底部工具栏（翻页 + Cancel / Confirm）。') },
  { name: 'toolbarDividerPinned', type: 'boolean', defaultValue: 'false', description: showcaseText('The top section of the toolbar is split-line resident; false shows only when there is still content at the bottom that has been cropped.', '工具栏顶部分割线常驻；false 时仅在底部仍有内容被裁切时显示。') },
  { name: 'showToolbarNav', type: 'boolean', defaultValue: 'true', description: showcaseText('The EgPaginationGroupButton borderArrow and sequence number counts in the middle of the toolbar.', '工具栏中部 EgPaginationGroupButton borderArrow 与序号计数。') },
  { name: 'showToolbarNote', type: 'boolean', defaultValue: 'true', description: showcaseText('ToolbarLeadingNotesButton（EgButton subtle outline）。', '工具栏左侧备注按钮（EgButton subtle outline）。') },
  { name: 'toolbarCurrent', type: 'string | number', defaultValue: '12', description: showcaseText('Current sequence number (in thousands format).', '当前序号（千分位格式化）。') },
  { name: 'toolbarTotal', type: 'string | number', defaultValue: '1000', description: showcaseText('Total number of bars (formatted in thousands).', '总条数（千分位格式化）。') },
  { name: 'toolbarPrevDisabled', type: 'boolean', defaultValue: 'false', description: showcaseText('The previous borderArrow is disabled.', '上一项 borderArrow 禁用。') },
  { name: 'toolbarNextDisabled', type: 'boolean', defaultValue: 'false', description: showcaseText('The next item borderArrow is disabled.', '下一项 borderArrow 禁用。') },
  { name: 'toolbarTone', type: "'brand' | 'decor'", defaultValue: "'decor'", description: showcaseText('Toolbar Confirm button tone; Cancel is the same by default and can be overridden with toolbarCancelTone.', '工具栏 Confirm 按钮 tone；Cancel 默认同此，可用 toolbarCancelTone 覆盖。') },
  { name: 'toolbarCancelTone', type: 'ButtonTone', defaultValue: 'toolbarTone', description: showcaseText('Cancel button tone (such as the danger button).', 'Cancel 按钮 tone（如 danger 危险文字按钮）。') },
  { name: 'toolbarDirection', type: "'left' | 'right'", defaultValue: "'right'", description: showcaseText('Cancel/Confirm alignment when there is no page turn navigation.', '无翻页导航时 Cancel / Confirm 对齐。') },
  { name: 'toolbarConfirmLabel', type: 'string', defaultValue: "'Confirm'", description: showcaseText('Confirm button copy.', '确认按钮文案。') },
  { name: 'toolbarCancelLabel', type: 'string', defaultValue: "'Cancel'", description: showcaseText('CancelButton copy.', '取消按钮文案。') },
  { name: 'addressLayout', type: "'single' | 'multi-collapsed' | 'multi-expanded' | 'multi-orders'", defaultValue: "'single'", description: showcaseText('Sender/Receiver address display form (Figma 2267: 11822/2267: 11830); multi-orders is the number of Orders chain.', 'Sender / Receiver 地址展示形态（Figma 2267:11822 / 2267:11830）；multi-orders 为数量 Orders 链。') },
  { name: 'valueEntries', type: 'DetailItemValueEntry[]', defaultValue: '-', description: showcaseText('Multi-address entry; works with addressCount/addressLayout.', '多地址条目；与 addressCount / addressLayout 配合。') },
  { name: 'addressCount', type: 'number', defaultValue: '-', description: showcaseText('Multi-address default state count.', '多地址默认态计数。') },
  { name: 'addressViewMoreLabel', type: 'string', defaultValue: '-', description: showcaseText('Multi-address default "See more" chain copy.', '多地址默认态「查看更多」链文案。') },
];

export const detailEventRows: DocPropRow[] = [
  { name: 'close', type: '[]', defaultValue: '-', description: showcaseText('System strip off button; keyboard Esc (when not in focus).', '系统条关闭按钮；键盘 Esc（非输入焦点时）。') },
  { name: 'toolbarPrev', type: '[]', defaultValue: '-', description: showcaseText('The item borderArrow on the toolbar.', '工具栏上一项 borderArrow。') },
  { name: 'toolbarNext', type: '[]', defaultValue: '-', description: showcaseText('The borderArrow next to the toolbar.', '工具栏下一项 borderArrow。') },
  { name: 'toolbarNote', type: '[]', defaultValue: '-', description: showcaseText('ToolbarNotesButton。', '工具栏备注按钮。') },
  { name: 'toolbarConfirm', type: '[]', defaultValue: '-', description: showcaseText('Toolbar confirmation button.', '工具栏确认按钮。') },
  { name: 'toolbarCancel', type: '[]', defaultValue: '-', description: showcaseText('ToolbarCancelButton。', '工具栏取消按钮。') },
  { name: 'itemValueLinkClick', type: '[key: string]', defaultValue: '-', description: showcaseText('Item End of Line EgLinkButton (showValueLink/Multi-address Expand · Orders Chain) Click; payload is item.key or `${sectionIndex} - ${itemIndex}`.', 'Item 行尾 EgLinkButton（showValueLink / 多地址 Expand·Orders 链）点击；payload 为 item.key 或 `${sectionIndex}-${itemIndex}`。') },
];

export const detailSlotRows: DocPropRow[] = [
  {
    name: 'body',
    type: 'slot',
    defaultValue: '-',
    description: showcaseText('Scroll zone slots (Headline + Sections); EgDetail is placed in the EgPopup default slot.', '滚动区插槽（Headline + Sections）；EgDetail 置于 EgPopup 默认插槽内。'),
  },
  {
    name: 'append',
    type: 'slot',
    defaultValue: '-',
    description: showcaseText('The additional content after # body is still in the scrolling area.', '#body 之后的附加内容，仍在滚动区内。'),
  },
  { name: 'toolbar', type: 'slot', defaultValue: '-', description: showcaseText('Replaces the default bottom toolbar (page flip + action button).', '替换默认底部工具栏（翻页 + 操作按钮）。') },
  { name: 'toolbar-actions', type: 'slot', defaultValue: '-', description: showcaseText('Replace the default Cancel/Confirm button; keep the page turn navigation, sequence number, and scroll divider.', '替换默认 Cancel / Confirm 按钮；保留翻页导航、序号与滚动分割线。') },
];

/** 文档页默认 sections（与 Figma Popup Detail 2178:4299 一致） */
export const detailDemoSections = createDefaultDetailSections('Section');
