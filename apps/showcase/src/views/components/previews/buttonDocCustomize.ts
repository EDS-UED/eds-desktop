import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import {
  buildVueDefaultSlotSnippet,
  buildVueSelfClosingSnippet,
} from '@/views/shared/componentDoc/buildUsageSnippet';
import {
  buttonSizeRows,
  buttonToneRows,
  buttonVariantRows,
  iconShapeRows,
  linkSizeRows,
  linkToneRows,
  paginationKindRows,
  paginationToneRows,
  showcaseButtonCustomizeFieldLabels,
  showcaseComboActionKindLabels,
  showcaseComboPopupCountLabels,
  showcaseInputCustomizeFieldLabels,
  showcaseWidthModeLabels,
  directionLeftRightRows,
  propLabelRows,
  showcaseMessageTypeLabels,
} from '@/data/showcasePropLabels';
import {
  showcaseArrowIconSnippet,
  showcaseBorderArrowIconSnippet,
  showcaseChevronIconSnippet,
  showcaseDefaultIconName,
  showcaseEgIconSnippet,
} from '@/views/shared/showcaseIcons';
import { iconButtonEventRows } from './iconButtonDocPreview';
import { readBorderArrowDocEvent, type BorderArrowDocEvent } from './borderArrowDocPreview';
import { normalizeFixedWidth } from './inputPreviewWidth';

export const buttonTextImportCode = `import { EgButton, EgIcon } from '@eds/desktop-components';`;

export const iconButtonImportCode = `import { EgIcon, EgIconButton } from '@eds/desktop-components';`;

export const iconButtonProImportCode = `import { EgIcon, EgIconProButton } from '@eds/desktop-components';`;

export const linkImportCode = `import { EgLinkButton } from '@eds/desktop-components';`;

export const paginationImportCode = `import { EgIcon, EgPaginationGroupButton } from '@eds/desktop-components';`;

export const comboActionImportCode = `import {
  EgComboButton,
  EgComboPopupButton,
  EgComboFloatButton,
  EgComboPageButton,
} from '@eds/desktop-components';`;

export const comboActionSkidImportCode = `import { EgComboButton } from '@eds/desktop-components';`;

export const comboActionPopupImportCode = `import { EgComboPopupButton } from '@eds/desktop-components';`;

export const comboActionFlotationImportCode = `import { EgComboFloatButton } from '@eds/desktop-components';`;

export const comboActionPageImportCode = `import { EgComboPageButton } from '@eds/desktop-components';`;

const buttonIconPositionInlineSelect = {
  key: 'iconPosition',
  label: '图标位置',
  options: [
    { value: 'leading', label: '左' },
    { value: 'trailing', label: '右' },
  ],
};

export const buttonCustomizeDefaults = {
  tone: 'brand',
  variant: 'solid',
  size: 'lg',
  widthMode: 'adaptive',
  fixedWidth: '319',
  disabled: false,
  loading: false,
  label: 'Button',
  showIcon: false,
  iconPosition: 'leading',
  iconName: showcaseDefaultIconName,
} as const;

export const buttonCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: buttonToneRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'variant',
    label: showcaseButtonCustomizeFieldLabels.variant,
    options: buttonVariantRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'size',
    label: showcaseButtonCustomizeFieldLabels.size,
    options: buttonSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'widthMode',
    label: showcaseInputCustomizeFieldLabels.widthMode,
    options: [
      { value: 'adaptive', label: showcaseWidthModeLabels.adaptive },
      { value: 'fixed', label: showcaseWidthModeLabels.fixed },
      { value: 'full', label: showcaseWidthModeLabels.full },
    ],
  },
  {
    kind: 'text',
    key: 'fixedWidth',
    label: showcaseInputCustomizeFieldLabels.fixedWidth,
    placeholder: '319 或 319px',
    visibleWhen: (s) => s.widthMode === 'fixed',
  },
  { kind: 'text', key: 'label', label: showcaseButtonCustomizeFieldLabels.label },
  {
    kind: 'boolean',
    key: 'showIcon',
    label: showcaseButtonCustomizeFieldLabels.showIcon,
    inlineSelect: buttonIconPositionInlineSelect,
  },
  {
    kind: 'text',
    key: 'iconName',
    label: showcaseButtonCustomizeFieldLabels.iconName,
    visibleWhen: (state) => Boolean(state.showIcon),
  },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled },
  { kind: 'boolean', key: 'loading', label: showcaseButtonCustomizeFieldLabels.loading },
];

export function buildButtonUsageSnippet(state: Record<string, unknown>): string {
  const label = String(state.label ?? buttonCustomizeDefaults.label);
  const widthMode = state.widthMode;
  const omitKeys = ['label', 'showIcon', 'iconName', 'type', 'widthMode', 'fixedWidth'];
  const props = { ...state };
  delete props.widthMode;
  delete props.fixedWidth;

  if (widthMode === 'full') {
    props.style = 'width: 100%';
  } else if (widthMode === 'fixed') {
    const width = normalizeFixedWidth(String(state.fixedWidth ?? ''));
    if (width) {
      props.style = `width: ${width}`;
    }
  }

  let snippet: string;

  if (state.showIcon) {
    const iconName = String(state.iconName ?? buttonCustomizeDefaults.iconName);
    const open = buildVueSelfClosingSnippet('EgButton', props, {
      defaults: buttonCustomizeDefaults,
      omitKeys,
    })
      .replace(/\s*\/>$/, '')
      .trim();
    const iconBlock = `  <template #icon>\n    ${showcaseEgIconSnippet(iconName, { fit: true, size: 'md' }).replace(/\n/g, '\n    ')}\n  </template>`;
    snippet = `${open}>\n${iconBlock}\n  ${label}\n</EgButton>`;
  } else {
    snippet = buildVueDefaultSlotSnippet('EgButton', props, label, {
      defaults: buttonCustomizeDefaults,
      omitKeys,
    });
  }

  return snippet;
}

export const iconButtonCustomizeDefaults = {
  shape: 'rectangular',
  event: 'full' as 'full' | 'default' | 'hover' | 'active' | 'focus',
  motion: 'ease' as 'ease' | 'hover-enter-only' | 'asym' | 'none',
  size: 'lg',
  label: 'Add',
  symbol: showcaseDefaultIconName,
  disabled: false,
} as const;

export const iconButtonCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'shape',
    label: showcaseButtonCustomizeFieldLabels.shape,
    options: iconShapeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'event',
    label: showcaseButtonCustomizeFieldLabels.event,
    options: iconButtonEventRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'size',
    label: showcaseButtonCustomizeFieldLabels.size,
    options: buttonSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'motion',
    label: '动效',
    options: [
      { value: 'ease', label: 'is-paint（入+出）' },
      { value: 'hover-enter-only', label: 'is-enter-only（仅入场）' },
      { value: 'asym', label: 'is-enter-only（asym 别名）' },
      { value: 'none', label: 'none' },
    ],
  },
  { kind: 'text', key: 'symbol', label: showcaseButtonCustomizeFieldLabels.symbol },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled },
];

export function buildIconButtonUsageSnippet(state: Record<string, unknown>): string {
  const symbol = String(state.symbol ?? iconButtonCustomizeDefaults.symbol);
  const openTag = buildVueSelfClosingSnippet('EgIconButton', state, {
    defaults: iconButtonCustomizeDefaults,
    omitKeys: ['type', 'symbol', 'event'],
  })
    .replace(/\s*\/>$/, '')
    .trim();
  return `${openTag}>\n  <EgIcon name="${symbol}" fit />\n</EgIconButton>`;
}

export const iconButtonProCustomizeDefaults = {
  label: 'Label',
  symbol: showcaseDefaultIconName,
  badge: '0',
  showBadge: false,
  showReddot: false,
  messageType: 'brand',
  disabled: false,
} as const;

const iconButtonProMessageTypeOptions = propLabelRows(
  ['subtle', 'brand', 'danger'] as const,
  showcaseMessageTypeLabels,
).map((row) => ({ value: row.key, label: row.label }));

export const iconButtonProCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'label', label: showcaseButtonCustomizeFieldLabels.label, row: 1 },
  { kind: 'text', key: 'symbol', label: showcaseButtonCustomizeFieldLabels.symbol, row: 1 },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled, row: 1 },
  {
    kind: 'boolean',
    key: 'showReddot',
    label: showcaseButtonCustomizeFieldLabels.showReddot,
    row: 1,
    exclusiveKey: 'showBadge',
  },
  {
    kind: 'boolean',
    key: 'showBadge',
    label: showcaseButtonCustomizeFieldLabels.showBadge,
    row: 1,
    exclusiveKey: 'showReddot',
  },
  {
    kind: 'text',
    key: 'badge',
    label: showcaseButtonCustomizeFieldLabels.badge,
    row: 1,
    visibleWhen: (s) => Boolean(s.showBadge),
  },
  {
    kind: 'select',
    key: 'messageType',
    label: '消息类型',
    row: 1,
    options: iconButtonProMessageTypeOptions,
    visibleWhen: (s) => Boolean(s.showBadge),
  },
];

export type IconButtonProZoneKeyPrefix =
  | 'functional'
  | 'section'
  | 'batch'
  | 'filter'
  | 'refresh'
  | 'export';

type IconButtonProZoneSeed = {
  label?: string;
  icon?: string;
  showBadge?: boolean;
  badge?: string;
  showReddot?: boolean;
  disabled?: boolean;
};

function iconButtonProZoneSeed(
  seed: IconButtonProZoneSeed = {},
): Required<IconButtonProZoneSeed> {
  return {
    label: seed.label ?? iconButtonProCustomizeDefaults.label,
    icon: seed.icon ?? iconButtonProCustomizeDefaults.symbol,
    showBadge: seed.showBadge ?? iconButtonProCustomizeDefaults.showBadge,
    badge: seed.badge ?? iconButtonProCustomizeDefaults.badge,
    showReddot: seed.showReddot ?? iconButtonProCustomizeDefaults.showReddot,
    disabled: seed.disabled ?? iconButtonProCustomizeDefaults.disabled,
  };
}

export function iconButtonProZoneItemDefaultsForRange(
  prefix: IconButtonProZoneKeyPrefix,
  maxIndex: number,
  seed: IconButtonProZoneSeed = {},
): Record<string, string | boolean> {
  const defaults = iconButtonProZoneSeed(seed);
  const entries: Record<string, string | boolean> = {};

  for (let index = 1; index <= maxIndex; index += 1) {
    entries[`${prefix}Label${index}`] = defaults.label;
    entries[`${prefix}Icon${index}`] = defaults.icon;
    entries[`${prefix}ShowBadge${index}`] = defaults.showBadge;
    entries[`${prefix}Badge${index}`] = defaults.badge;
    entries[`${prefix}ShowReddot${index}`] = defaults.showReddot;
    entries[`${prefix}Disabled${index}`] = defaults.disabled;
  }

  return entries;
}

export function iconButtonProSingleItemDefaults(
  prefix: IconButtonProZoneKeyPrefix,
  seed: IconButtonProZoneSeed = {},
): Record<string, string | boolean> {
  const defaults = iconButtonProZoneSeed(seed);
  return {
    [`${prefix}Label`]: defaults.label,
    [`${prefix}Icon`]: defaults.icon,
    [`${prefix}ShowBadge`]: defaults.showBadge,
    [`${prefix}Badge`]: defaults.badge,
    [`${prefix}ShowReddot`]: defaults.showReddot,
    [`${prefix}Disabled`]: defaults.disabled,
  };
}

export const iconButtonProNestedRowColumns = 6;

export function buildIconButtonProZoneItemControls(
  prefix: 'functional' | 'section',
  countKey: 'functionalCount' | 'sectionCount',
  countOptions: { value: string; label: string }[],
  maxIndex: number,
): DocCustomizeControl[] {
  function zoneItemVisible(state: Record<string, unknown>, itemIndex: number): boolean {
    const count = Number.parseInt(String(state[countKey] ?? '1'), 10);
    return Number.isFinite(count) && count >= itemIndex;
  }

  return [
    {
      kind: 'select',
      key: countKey,
      label: '数量',
      options: countOptions,
      row: 0,
    },
    ...Array.from({ length: maxIndex }, (_, index) => {
      const itemIndex = index + 1;
      const visibleWhen = (state: Record<string, unknown>) => zoneItemVisible(state, itemIndex);

      return [
        {
          kind: 'text' as const,
          key: `${prefix}Label${itemIndex}`,
          label: `顺序 ${itemIndex}`,
          row: itemIndex,
          visibleWhen,
        },
        {
          kind: 'text' as const,
          key: `${prefix}Icon${itemIndex}`,
          label: showcaseButtonCustomizeFieldLabels.iconName,
          placeholder: iconButtonProCustomizeDefaults.symbol,
          row: itemIndex,
          visibleWhen,
        },
        {
          kind: 'boolean' as const,
          key: `${prefix}Disabled${itemIndex}`,
          label: showcaseButtonCustomizeFieldLabels.disabled,
          row: itemIndex,
          visibleWhen,
        },
        {
          kind: 'boolean' as const,
          key: `${prefix}ShowReddot${itemIndex}`,
          label: showcaseButtonCustomizeFieldLabels.showReddot,
          row: itemIndex,
          visibleWhen,
          exclusiveKey: `${prefix}ShowBadge${itemIndex}`,
        },
        {
          kind: 'boolean' as const,
          key: `${prefix}ShowBadge${itemIndex}`,
          label: showcaseButtonCustomizeFieldLabels.showBadge,
          row: itemIndex,
          visibleWhen,
          exclusiveKey: `${prefix}ShowReddot${itemIndex}`,
        },
        {
          kind: 'text' as const,
          key: `${prefix}Badge${itemIndex}`,
          label: showcaseButtonCustomizeFieldLabels.badge,
          row: itemIndex,
          visibleWhen: (state: Record<string, unknown>) =>
            visibleWhen(state) && Boolean(state[`${prefix}ShowBadge${itemIndex}`]),
        },
      ];
    }).flat(),
  ];
}

export const iconButtonProSingleCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'label', label: showcaseButtonCustomizeFieldLabels.label, row: 1 },
  {
    kind: 'text',
    key: 'icon',
    label: showcaseButtonCustomizeFieldLabels.iconName,
    placeholder: iconButtonProCustomizeDefaults.symbol,
    row: 1,
  },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled, row: 1 },
  {
    kind: 'boolean',
    key: 'showReddot',
    label: showcaseButtonCustomizeFieldLabels.showReddot,
    row: 1,
    exclusiveKey: 'showBadge',
  },
  {
    kind: 'boolean',
    key: 'showBadge',
    label: showcaseButtonCustomizeFieldLabels.showBadge,
    row: 1,
    exclusiveKey: 'showReddot',
  },
  {
    kind: 'text',
    key: 'badge',
    label: showcaseButtonCustomizeFieldLabels.badge,
    row: 1,
    visibleWhen: (state) => Boolean(state.showBadge),
  },
];

function prefixCustomizeKey(prefix: string, key: string): string {
  return `${prefix}${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}

/**
 * 复用一组基础控件并按区位前缀重命名 key。
 *
 * `scopeState` 把带前缀的面板状态还原成基础控件 `visibleWhen` 期望的无前缀视图。
 */
function rekeyCustomizeControl(
  control: DocCustomizeControl,
  prefix: string,
  scopeState: (state: Record<string, unknown>) => Record<string, unknown>,
  row?: number,
): DocCustomizeControl {
  const { visibleWhen } = control;
  const shared = {
    key: prefixCustomizeKey(prefix, control.key),
    ...(row == null ? {} : { row }),
    ...(visibleWhen
      ? { visibleWhen: (state: Record<string, unknown>) => visibleWhen(scopeState(state)) }
      : {}),
  };

  if (control.kind === 'boolean') {
    return {
      ...control,
      ...shared,
      ...(control.exclusiveKey
        ? { exclusiveKey: prefixCustomizeKey(prefix, control.exclusiveKey) }
        : {}),
    };
  }

  return { ...control, ...shared };
}

export function buildIconButtonProSingleCustomizeControls(
  prefix: IconButtonProZoneKeyPrefix,
): DocCustomizeControl[] {
  return iconButtonProSingleCustomizeControls.map((control) =>
    rekeyCustomizeControl(control, prefix, (state) => ({
      showBadge: state[`${prefix}ShowBadge`],
    })),
  );
}

export type IconButtonProZoneItemState = {
  label: string;
  icon: string;
  showBadge: boolean;
  badge: string;
  showReddot: boolean;
  disabled: boolean;
};

export function readIconButtonProZoneItem(
  state: Record<string, unknown>,
  prefix: IconButtonProZoneKeyPrefix,
  index: number,
): IconButtonProZoneItemState {
  const labelKey = `${prefix}Label${index}` as const;
  const iconKey = `${prefix}Icon${index}` as const;
  const label = state[labelKey];
  const icon = state[iconKey];

  return {
    label: label != null && String(label).trim().length > 0
      ? String(label).trim()
      : iconButtonProCustomizeDefaults.label,
    icon: icon != null && String(icon).trim().length > 0
      ? String(icon).trim()
      : iconButtonProCustomizeDefaults.symbol,
    showBadge: Boolean(state[`${prefix}ShowBadge${index}`]),
    badge: String(state[`${prefix}Badge${index}`] ?? iconButtonProCustomizeDefaults.badge),
    showReddot: Boolean(state[`${prefix}ShowReddot${index}`]),
    disabled: Boolean(state[`${prefix}Disabled${index}`]),
  };
}

export function readIconButtonProSingleItem(
  state: Record<string, unknown>,
  prefix: IconButtonProZoneKeyPrefix,
): IconButtonProZoneItemState {
  const label = state[`${prefix}Label`];
  const icon = state[`${prefix}Icon`];

  return {
    label: label != null && String(label).trim().length > 0
      ? String(label).trim()
      : iconButtonProCustomizeDefaults.label,
    icon: icon != null && String(icon).trim().length > 0
      ? String(icon).trim()
      : iconButtonProCustomizeDefaults.symbol,
    showBadge: Boolean(state[`${prefix}ShowBadge`]),
    badge: String(state[`${prefix}Badge`] ?? iconButtonProCustomizeDefaults.badge),
    showReddot: Boolean(state[`${prefix}ShowReddot`]),
    disabled: Boolean(state[`${prefix}Disabled`]),
  };
}

export function buildIconButtonProUsageSnippet(state: Record<string, unknown>): string {
  const symbol = String(state.symbol ?? iconButtonProCustomizeDefaults.symbol);
  const openTag = buildVueSelfClosingSnippet('EgIconProButton', state, {
    defaults: iconButtonProCustomizeDefaults,
    omitKeys: ['type', 'symbol'],
  })
    .replace(/\s*\/>$/, '')
    .trim();
  return `${openTag}>\n  <EgIcon name="${symbol}" fit />\n</EgIconProButton>`;
}

export const linkCustomizeDefaults = {
  tone: 'brand',
  size: 'lg',
  href: '#',
  disabled: false,
  label: 'Connect to EDS',
} as const;

export const linkCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: linkToneRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'size',
    label: showcaseButtonCustomizeFieldLabels.size,
    options: linkSizeRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'label', label: showcaseButtonCustomizeFieldLabels.label },
  { kind: 'text', key: 'href', label: showcaseButtonCustomizeFieldLabels.href },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled },
];

export function buildLinkUsageSnippet(state: Record<string, unknown>): string {
  const label = String(state.label ?? linkCustomizeDefaults.label);
  return buildVueDefaultSlotSnippet('EgLinkButton', state, label, {
    defaults: linkCustomizeDefaults,
    omitKeys: ['label'],
  });
}

export const paginationCustomizeDefaults = {
  kind: 'button',
  event: 'full' as BorderArrowDocEvent,
  tone: 'brand',
  label: '0',
  disabled: false,
} as const;

export const paginationCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'kind',
    label: showcaseInputCustomizeFieldLabels.scenario,
    options: paginationKindRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'event',
    label: '交互',
    options: iconButtonEventRows.map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: (s) => s.kind === 'borderArrow',
  },
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: paginationToneRows.map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: (s) => s.kind !== 'borderArrow',
  },
  {
    kind: 'text',
    key: 'label',
    label: showcaseButtonCustomizeFieldLabels.label,
    visibleWhen: (s) => s.kind === 'number',
  },
  { kind: 'boolean', key: 'disabled', label: showcaseButtonCustomizeFieldLabels.disabled },
];

export function buildPaginationUsageSnippet(state: Record<string, unknown>): string {
  if (state.kind === 'number') {
    return buildVueSelfClosingSnippet('EgPaginationGroupButton', state, {
      defaults: paginationCustomizeDefaults,
      omitKeys: ['type', 'event'],
    });
  }

  const icon =
    state.kind === 'borderArrow'
      ? showcaseBorderArrowIconSnippet
      : state.kind === 'symbol'
        ? showcaseChevronIconSnippet
        : showcaseArrowIconSnippet;
  const iconLines = icon.replace(/\n/g, '\n  ');
  return buildVueDefaultSlotSnippet('EgPaginationGroupButton', state, iconLines, {
    defaults: paginationCustomizeDefaults,
    omitKeys: ['label', 'type', 'event'],
  });
}

export type PaginerPaginationSlotKey = 'first' | 'prev' | 'page' | 'next' | 'last';

export const PAGINER_PAGINATION_SLOT_KEYS: PaginerPaginationSlotKey[] = [
  'first',
  'prev',
  'page',
  'next',
  'last',
];

export const paginerPaginationButtonOptions = [
  { value: 'first', label: '首页' },
  { value: 'prev', label: '上一页' },
  { value: 'page', label: '页码' },
  { value: 'next', label: '下一页' },
  { value: 'last', label: '末页' },
];

type PaginerPaginationSeed = {
  kind?: 'number' | 'symbol' | 'button' | 'borderArrow';
  tone?: 'brand' | 'decor';
  label?: string;
  disabled?: boolean;
  event?: BorderArrowDocEvent;
};

function paginerPaginationItemSeed(
  seed: PaginerPaginationSeed = {},
): Required<PaginerPaginationSeed> {
  return {
    kind: seed.kind ?? 'symbol',
    tone: seed.tone ?? 'decor',
    label: seed.label ?? '1',
    disabled: seed.disabled ?? false,
    event: seed.event ?? 'full',
  };
}

export function paginerPaginationItemDefaults(
  prefix: PaginerPaginationSlotKey,
  seed: PaginerPaginationSeed = {},
): Record<string, string | boolean> {
  const defaults = paginerPaginationItemSeed(seed);
  return {
    [`${prefix}Kind`]: defaults.kind,
    [`${prefix}Tone`]: defaults.tone,
    [`${prefix}Label`]: defaults.label,
    [`${prefix}Disabled`]: defaults.disabled,
    [`${prefix}Event`]: defaults.event,
  };
}

export function paginerPaginationCustomizeDefaults(
  customizeKey = 'paginerPaginationKey',
): Record<string, string | boolean> {
  return {
    [customizeKey]: 'first',
    ...paginerPaginationItemDefaults('first', { kind: 'symbol' }),
    ...paginerPaginationItemDefaults('prev', { kind: 'symbol' }),
    ...paginerPaginationItemDefaults('page', { kind: 'number', label: '1' }),
    ...paginerPaginationItemDefaults('next', { kind: 'symbol' }),
    ...paginerPaginationItemDefaults('last', { kind: 'symbol' }),
  };
}

export function buildPaginerPaginationItemCustomizeControls(
  prefix: PaginerPaginationSlotKey,
): DocCustomizeControl[] {
  return paginationCustomizeControls.map((control) =>
    rekeyCustomizeControl(control, prefix, (state) => ({ kind: state[`${prefix}Kind`] }), 1),
  );
}

export function buildPaginerPaginationCustomizeControls(
  customizeKey = 'paginerPaginationKey',
): DocCustomizeControl[] {
  return [
    {
      kind: 'select',
      key: customizeKey,
      label: '按钮',
      options: paginerPaginationButtonOptions,
      row: 0,
    },
    ...PAGINER_PAGINATION_SLOT_KEYS.flatMap((prefix) =>
      buildPaginerPaginationItemCustomizeControls(prefix).map((control) => ({
        ...control,
        visibleWhen: (state: Record<string, unknown>) => {
          if (String(state[customizeKey] ?? 'first') !== prefix) return false;
          return control.visibleWhen ? control.visibleWhen(state) : true;
        },
      })),
    ),
  ];
}

export type PaginerPaginationItemState = {
  kind: 'number' | 'symbol' | 'button' | 'borderArrow';
  tone: 'brand' | 'decor';
  label: string;
  disabled: boolean;
  event: BorderArrowDocEvent;
};

export function readPaginerPaginationItem(
  state: Record<string, unknown>,
  prefix: PaginerPaginationSlotKey,
): PaginerPaginationItemState {
  const kind = String(state[`${prefix}Kind`] ?? 'symbol');
  const tone = String(state[`${prefix}Tone`] ?? 'decor');

  return {
    kind:
      kind === 'number' ||
      kind === 'button' ||
      kind === 'symbol' ||
      kind === 'borderArrow'
        ? kind
        : 'symbol',
    tone: tone === 'brand' || tone === 'decor' ? tone : 'decor',
    label: String(state[`${prefix}Label`] ?? '1'),
    disabled: Boolean(state[`${prefix}Disabled`]),
    event: readBorderArrowDocEvent(state[`${prefix}Event`]),
  };
}

export const paginerPaginationNestedRowColumns = 4;

export const comboActionSkidCustomizeDefaults = {
  tone: 'brand',
  variant: 'solid',
  divider: false,
  confirmLabel: 'Confirm',
} as const;

export const comboActionSkidCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: buttonToneRows
      .filter((row) => ['brand', 'decor', 'danger'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'variant',
    label: showcaseButtonCustomizeFieldLabels.variant,
    options: buttonVariantRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'confirmLabel', label: showcaseButtonCustomizeFieldLabels.confirmLabel },
  { kind: 'boolean', key: 'divider', label: showcaseButtonCustomizeFieldLabels.divider },
];

export function buildComboActionSkidUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgComboButton', state, {
    defaults: comboActionSkidCustomizeDefaults,
  });
}

export const comboActionPopupCustomizeDefaults = {
  tone: 'brand',
  variant: 'solid',
  count: 2,
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
} as const;

export const comboActionPopupCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'text',
    key: 'confirmLabel',
    label: showcaseButtonCustomizeFieldLabels.confirmLabel,
    row: 0,
  },
  {
    kind: 'text',
    key: 'cancelLabel',
    label: showcaseButtonCustomizeFieldLabels.cancelLabel,
    row: 0,
  },
  {
    kind: 'select',
    key: 'count',
    label: showcaseButtonCustomizeFieldLabels.count,
    row: 0,
    options: [
      { value: '2', label: showcaseComboPopupCountLabels['2'] },
      { value: '1', label: showcaseComboPopupCountLabels['1'] },
    ],
  },
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    row: 1,
    options: buttonToneRows
      .filter((row) => ['brand', 'decor'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'variant',
    label: showcaseButtonCustomizeFieldLabels.variant,
    row: 1,
    options: buttonVariantRows.map((row) => ({ value: row.key, label: row.label })),
  },
];

export function buildComboActionPopupUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgComboPopupButton', state, {
    defaults: comboActionPopupCustomizeDefaults,
  });
}

export const comboActionFlotationCustomizeDefaults = {
  tone: 'brand',
  variant: 'solid',
  divider: false,
  clear: false,
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
} as const;

export const comboActionFlotationCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'text',
    key: 'confirmLabel',
    label: showcaseButtonCustomizeFieldLabels.confirmLabel,
    row: 0,
  },
  {
    kind: 'text',
    key: 'cancelLabel',
    label: showcaseButtonCustomizeFieldLabels.cancelLabel,
    row: 0,
  },
  {
    kind: 'boolean',
    key: 'divider',
    label: showcaseButtonCustomizeFieldLabels.divider,
    row: 0,
  },
  {
    kind: 'boolean',
    key: 'clear',
    label: showcaseButtonCustomizeFieldLabels.clear,
    row: 0,
  },
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    row: 1,
    options: buttonToneRows
      .filter((row) => ['brand', 'decor'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'variant',
    label: showcaseButtonCustomizeFieldLabels.variant,
    row: 1,
    options: buttonVariantRows.map((row) => ({ value: row.key, label: row.label })),
  },
];

function remapCustomizeControls(
  controls: DocCustomizeControl[],
  keyMap: Record<string, string>,
  options?: { omitKeys?: string[] },
): DocCustomizeControl[] {
  const omit = new Set(options?.omitKeys ?? []);

  return controls
    .filter((control) => !omit.has(control.key))
    .map((control) => ({
      ...control,
      key: keyMap[control.key] ?? control.key,
    }));
}

/** Dialog · EgComboFloatButton 嵌套定制（与 comboActionFlotationCustomizeControls 字段/布局一致，映射 EgDialog state 键）。 */
export const dialogStandardFlotationToolbarControls = remapCustomizeControls(
  comboActionFlotationCustomizeControls,
  { tone: 'toolbarTone', variant: 'toolbarVariant', divider: 'toolbarDividerPinned' },
  { omitKeys: ['clear'] },
);

export const dialogComposeFlotationToolbarControls = remapCustomizeControls(
  comboActionFlotationCustomizeControls,
  {
    tone: 'toolbarTone',
    variant: 'toolbarVariant',
    divider: 'toolbarDividerPinned',
    clear: 'showClear',
  },
);

/** Dialog · EgComboPopupButton 嵌套定制（与 comboActionPopupCustomizeControls 一致，映射 EgDialog state 键）。 */
export const dialogPopupWindowControls = remapCustomizeControls(
  comboActionPopupCustomizeControls,
  { tone: 'toolbarTone', variant: 'toolbarVariant', count: 'actionCount' },
);

export function buildComboActionFlotationUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgComboFloatButton', state, {
    defaults: comboActionFlotationCustomizeDefaults,
  });
}

export const comboActionPageCustomizeDefaults = {
  tone: 'brand',
  variant: 'solid',
  divider: false,
  direction: 'right',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
} as const;

export const comboActionPageCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    options: buttonToneRows
      .filter((row) => ['brand', 'decor'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'variant',
    label: showcaseButtonCustomizeFieldLabels.variant,
    options: buttonVariantRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'direction',
    label: showcaseButtonCustomizeFieldLabels.direction,
    options: directionLeftRightRows.map((row) => ({ value: row.key, label: row.label })),
  },
  { kind: 'text', key: 'confirmLabel', label: showcaseButtonCustomizeFieldLabels.confirmLabel },
  { kind: 'text', key: 'cancelLabel', label: showcaseButtonCustomizeFieldLabels.cancelLabel },
  { kind: 'boolean', key: 'divider', label: showcaseButtonCustomizeFieldLabels.divider },
];

export function buildComboActionPageUsageSnippet(state: Record<string, unknown>): string {
  return buildVueSelfClosingSnippet('EgComboPageButton', state, {
    defaults: comboActionPageCustomizeDefaults,
  });
}

export const comboActionKindOptions = [
  { value: 'skid', label: showcaseComboActionKindLabels.skid },
  { value: 'popup-window', label: showcaseComboActionKindLabels['popup-window'] },
  { value: 'flotation', label: showcaseComboActionKindLabels.flotation },
  { value: 'page', label: showcaseComboActionKindLabels.page },
] as const;

export type ComboActionKindValue = (typeof comboActionKindOptions)[number]['value'];

export const comboActionCustomizeDefaults = {
  kind: 'skid' as ComboActionKindValue,
  tone: 'brand',
  variant: 'solid',
  divider: false,
  count: 2,
  clear: false,
  direction: 'right',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
} as const;

function comboActionKind(state: Record<string, unknown>): ComboActionKindValue {
  const value = String(state.kind ?? comboActionCustomizeDefaults.kind);
  return comboActionKindOptions.some((row) => row.value === value)
    ? (value as ComboActionKindValue)
    : comboActionCustomizeDefaults.kind;
}

const isComboActionKind = (state: Record<string, unknown>, kind: ComboActionKindValue) =>
  comboActionKind(state) === kind;

export const comboActionCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'kind',
    label: showcaseButtonCustomizeFieldLabels.kind,
    row: 0,
    options: comboActionKindOptions.map(({ value, label }) => ({ value, label })),
  },
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    row: 1,
    options: buttonToneRows
      .filter((row) => ['brand', 'decor', 'danger'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: (state) => isComboActionKind(state, 'skid'),
  },
  {
    kind: 'select',
    key: 'tone',
    label: showcaseButtonCustomizeFieldLabels.tone,
    row: 1,
    options: buttonToneRows
      .filter((row) => ['brand', 'decor'].includes(row.key))
      .map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: (state) => !isComboActionKind(state, 'skid'),
  },
  {
    kind: 'select',
    key: 'variant',
    label: showcaseButtonCustomizeFieldLabels.variant,
    row: 1,
    options: buttonVariantRows.map((row) => ({ value: row.key, label: row.label })),
  },
  {
    kind: 'select',
    key: 'direction',
    label: showcaseButtonCustomizeFieldLabels.direction,
    row: 1,
    options: directionLeftRightRows.map((row) => ({ value: row.key, label: row.label })),
    visibleWhen: (state) => isComboActionKind(state, 'page'),
  },
  {
    kind: 'select',
    key: 'count',
    label: showcaseButtonCustomizeFieldLabels.count,
    row: 1,
    options: [
      { value: '2', label: showcaseComboPopupCountLabels['2'] },
      { value: '1', label: showcaseComboPopupCountLabels['1'] },
    ],
    visibleWhen: (state) => isComboActionKind(state, 'popup-window'),
  },
  {
    kind: 'text',
    key: 'confirmLabel',
    label: showcaseButtonCustomizeFieldLabels.confirmLabel,
    row: 1,
  },
  {
    kind: 'text',
    key: 'cancelLabel',
    label: showcaseButtonCustomizeFieldLabels.cancelLabel,
    row: 1,
    visibleWhen: (state) => !isComboActionKind(state, 'skid'),
  },
  {
    kind: 'boolean',
    key: 'divider',
    label: showcaseButtonCustomizeFieldLabels.divider,
    row: 1,
    visibleWhen: (state) =>
      isComboActionKind(state, 'skid') ||
      isComboActionKind(state, 'flotation') ||
      isComboActionKind(state, 'page'),
  },
  {
    kind: 'boolean',
    key: 'clear',
    label: showcaseButtonCustomizeFieldLabels.clear,
    row: 1,
    visibleWhen: (state) => isComboActionKind(state, 'flotation'),
  },
];

export function resolveComboActionComponentTag(kind: ComboActionKindValue): string {
  switch (kind) {
    case 'popup-window':
      return 'EgComboPopupButton';
    case 'flotation':
      return 'EgComboFloatButton';
    case 'page':
      return 'EgComboPageButton';
    default:
      return 'EgComboButton';
  }
}

export function resolveComboActionImportCode(kind: ComboActionKindValue): string {
  switch (kind) {
    case 'popup-window':
      return comboActionPopupImportCode;
    case 'flotation':
      return comboActionFlotationImportCode;
    case 'page':
      return comboActionPageImportCode;
    default:
      return comboActionSkidImportCode;
  }
}

export function resolveComboActionTitle(kind: ComboActionKindValue): string {
  return comboActionKindOptions.find((row) => row.value === kind)?.label ?? 'Action-Skid';
}

export function buildComboActionUsageSnippet(state: Record<string, unknown>): string {
  const { kind: _kind, ...payload } = state;
  const kind = comboActionKind(state);

  switch (kind) {
    case 'popup-window':
      return buildComboActionPopupUsageSnippet(payload);
    case 'flotation':
      return buildComboActionFlotationUsageSnippet(payload);
    case 'page':
      return buildComboActionPageUsageSnippet(payload);
    default:
      return buildComboActionSkidUsageSnippet(payload);
  }
}
