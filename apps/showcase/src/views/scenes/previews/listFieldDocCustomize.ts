import type { ListFieldSceneSlug } from '@/data/scenes';
import { showcaseText } from '@/data/showcasePropLabels';
import {
  chineseOption,
  countSelectOptions,
} from '@/data/showcasePropLabels';
import { buildVueOpeningTag, buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import type { DocCustomizeControl, DocPropRow } from '@/views/shared/componentDoc/types';
import {
  buildFormSubmissionUsageSnippet,
  formSubmissionCustomizeControls,
  formSubmissionCustomizeDefaults,
  formSubmissionPropRows,
} from '@/views/components/previews/feedbackDocCustomize';
import {
  buildTagStatusUsageSnippet,
  buildTagSystemUsageSnippet,
  tagImportCode,
  tagSystemSmCustomizeControls,
  tagSystemCustomizeDefaults,
  tagSystemPropRows,
  tagStatusCustomizeControls,
  tagStatusPropRows,
} from '@/views/components/previews/tagDocCustomize';
import { resolveCryptoBusinessNameFromSymbol } from './listFieldCryptoResolve';
import {
  appendCurrencySideVisibilityProps,
  buildCurrencySideAddressData,
  currencySideAddressDefaults,
} from './listFieldCurrencyAddressCustomize';
import { parseCurrencyAddressCount } from './listFieldCurrencyShared';
import {
  currencyTagCustomizeDefaults,
  currencyTagShowKey,
  buildCurrencySideTags,
} from './listFieldCurrencyTagCustomize';
import { formatGroupedNumber, hasAddressTags } from '@eds/desktop-components';
import {
  LIST_FIELD_MORE_ACTION_COUNT_MAX,
  SAMPLE_ADDRESS,
  SAMPLE_GENERAL_SECONDARY,
  SAMPLE_GENERAL_TITLE,
  SAMPLE_HASH,
  SAMPLE_HASH_SECONDARY,
  SAMPLE_ID,
  SAMPLE_ID_SECONDARY,
  buildListFieldMoreActions,
  listFieldActionCustomizeDefaults,
  parseListFieldMoreActionCount,
} from './listFieldsPreviewData';

const CRYPTO_COMBO_IMPORT = `import { EgCryptoCombo } from '@eds/desktop-components';`;

const LIST_FIELD_IMPORT = `import {
  EgTooltip,
  EgCrypto,
  EgCryptoCombo,
  EgIcon,
  EgListFieldAddressLine,
  EgListFieldHashLikeLine,
  EgListFieldOverflowText,
  EgTag,
  formatGroupedNumber,
} from '@eds/desktop-components';`;

const currencyComboOptions = [
  chineseOption('currency-only', '仅币种'),
  chineseOption('single-address', '单地址'),
  chineseOption('double-address', '双地址'),
];

const entryBadgeOptions = [
  chineseOption('none', '不显示'),
  chineseOption('in', '入'),
  chineseOption('out', '出'),
];

const addressTooltipTriggerOptions = [
  chineseOption('hover', '悬浮时'),
  chineseOption('focus', '聚焦时'),
];

const hashLineLayoutOptions = [
  chineseOption('single', '单行'),
  chineseOption('double', '双行'),
];

const timeLineLayoutOptions = [
  chineseOption('single', '单'),
  chineseOption('double', '双'),
];

function buildHashLikeCustomizeControls(
  valueLabel: string,
  samples: { value: string; secondaryValue: string },
  options?: {
    insertAfterCopy?: DocCustomizeControl[];
    afterCopy?: DocCustomizeControl[];
  },
): DocCustomizeControl[] {
  const controls: DocCustomizeControl[] = [
    {
      kind: 'select',
      key: 'lineLayout',
      label: showcaseText('Compose', '组合'),
      options: hashLineLayoutOptions,
      row: 0,
    },
    {
      kind: 'text',
      key: 'value',
      label: valueLabel,
      placeholder: samples.value,
      row: 0,
    },
    {
      kind: 'text',
      key: 'secondaryValue',
      label: showcaseText('Secondary Text secondaryValue', '副文本 secondaryValue'),
      placeholder: samples.secondaryValue,
      row: 0,
      visibleWhen: (state) => String(state.lineLayout ?? 'single') === 'double',
    },
    { kind: 'text', key: 'minWidth', label: showcaseText('Minimal width', '最小宽度'), row: 0 },
    { kind: 'boolean', key: 'copyOnRowHover', label: showcaseText('Copy', '复制'), row: 0 },
  ];

  if (options?.insertAfterCopy?.length) {
    controls.push(...options.insertAfterCopy);
  }

  controls.push({
    kind: 'select',
    key: 'tooltipTrigger',
    label: showcaseText('Tooltip Interaction', 'Tooltip 交互'),
    options: addressTooltipTriggerOptions,
    row: 0,
  });

  if (options?.afterCopy?.length) {
    controls.push(...options.afterCopy);
  }

  return controls;
}

function listFieldMinWidthControl(row = 0): DocCustomizeControl {
  return { kind: 'text', key: 'minWidth', label: showcaseText('Minimal width', '最小宽度'), row };
}

function withCustomizeRow(controls: DocCustomizeControl[], row: number): DocCustomizeControl[] {
  return controls.map((control) => ({ ...control, row }));
}

function generalStructureTagCustomizeControls(
  side: 'left' | 'right',
): DocCustomizeControl[] {
  const systemTypeKey = side === 'left' ? 'leftSystemType' : 'rightSystemType';
  const labelKey = side === 'left' ? 'leftLabel' : 'rightLabel';

  return tagSystemSmCustomizeControls.map((control) => ({
    ...control,
    key: control.key === 'systemType' ? systemTypeKey : labelKey,
  }));
}

const amountTagCustomizeControls: DocCustomizeControl[] = tagSystemSmCustomizeControls.map(
  (control) => ({
    ...control,
    key: control.key === 'systemType' ? 'amountTagSystemType' : 'amountTagLabel',
  }),
);

const addressRowTagCustomizeControls: DocCustomizeControl[] = tagSystemSmCustomizeControls.map(
  (control) => ({
    ...control,
    key: control.key === 'systemType' ? 'addressRowTagSystemType' : 'addressRowTagLabel',
  }),
);

const listFieldMinWidthProp = sceneProp(
      'minWidth',
      'number',
      '-',
      showcaseText('[doc] CellWidth（px）；asAdaptive。', '单元格最小宽度（px）；不传为自适应。'),
    );

const addressDisplayOptions = [
  chineseOption('single', '单地址'),
  chineseOption('double', '双地址'),
];

const amountTypeOptions = [
  chineseOption('fiat', '法币'),
  chineseOption('crypto', '加密货币'),
  chineseOption('conversion', '折合'),
  chineseOption('amount-address', '金额和地址'),
];

export type ListFieldCustomizePanel = {
  title: string;
  controls: DocCustomizeControl[];
  addressSide?: 'from' | 'to';
  addressTagOnly?: boolean;
  sequential?: boolean;
  rowColumns?: number;
  visibleWhen?: (state: Record<string, unknown>) => boolean;
};

export type ListFieldDocConfig = {
  componentTag: string;
  importCode: string;
  customizeDefaults: Record<string, unknown>;
  customizeControls: DocCustomizeControl[];
  customizePanels?: ListFieldCustomizePanel[];
  propRows: DocPropRow[];
  buildUsageSnippet: (state: Record<string, unknown>) => string;
  propsSectionId: string;
  compactPreview?: boolean;
  customizeSequential?: boolean;
  customizeRowColumns?: number;
};

function sceneProp(
  name: string,
  type: string,
  defaultValue: string,
  description: string,
): DocPropRow {
  return { name, type, defaultValue, description };
}

function buildCurrencyUsageSnippet(state: Record<string, unknown>): string {
  const symbol = String(state.symbol ?? 'ZEC');
  const cryptoSnippetName = resolveCryptoBusinessNameFromSymbol(symbol);
  const entryBadge = String(state.entryBadgeMode ?? 'none') as 'none' | 'in' | 'out';
  const addressTooltipTrigger = String(state.addressTooltipTrigger ?? 'hover') as 'hover' | 'focus';

  const props: Record<string, unknown> = {
    cryptoName: cryptoSnippetName,
    symbol,
    showChain: state.showNetwork !== false,
    chainLabel: String(state.networkLabel ?? 'Base'),
    networkStyle: 'tag',
    entryBadge,
    contentType: state.comboMode === 'currency-only' ? 'unaddress' : 'address',
  };

  if (state.comboMode !== 'currency-only') {
    props.addressTooltipTrigger = addressTooltipTrigger;
  }

  if (state.comboMode === 'single-address') {
    props.addressMode = 'single';
    const from = buildCurrencySideAddressData('from', state);
    props.fromAddress = from.address;
    props.fromAddressCount = from.count;
    props.fromAddresses = from.addresses;
    if (from.alias) {
      props.fromAlias = from.alias;
    }
  } else if (state.comboMode === 'double-address') {
    props.addressMode = 'double';
    const from = buildCurrencySideAddressData('from', state);
    const to = buildCurrencySideAddressData('to', state);
    props.fromAddress = from.address;
    props.toAddress = to.address;
    props.fromAddressCount = from.count;
    props.toAddressCount = to.count;
    props.fromAddresses = from.addresses;
    props.toAddresses = to.addresses;
    if (from.alias) {
      props.fromAlias = from.alias;
    }
    if (to.alias) {
      props.toAlias = to.alias;
    }
    appendCurrencySideVisibilityProps(props, state);
  }

  const minWidthRaw = String(state.minWidth ?? '').trim();
  const minWidth = minWidthRaw ? Number(minWidthRaw) : 0;
  if (minWidth > 0) {
    props.minWidth = minWidth;
  }

  return buildVueSelfClosingSnippet('EgCryptoCombo', props, {
    defaults: {
      cryptoName: 'zec-zcash',
      symbol: 'ZEC',
      showChain: true,
      chainLabel: 'Base',
      networkStyle: 'tag',
      entryBadge: 'none',
      contentType: 'address',
      addressMode: 'double',
    },
  });
}

function buildAddressCryptoProps(state: Record<string, unknown>): Record<string, unknown> {
  const from = buildCurrencySideAddressData('from', state);
  const to = buildCurrencySideAddressData('to', state);
  const props: Record<string, unknown> = {
    'address-mode': 'double',
    'from-text': from.address,
    'from-address-count': from.count,
    'from-addresses': from.addresses,
    'to-text': to.address,
    'to-address-count': to.count,
    'to-addresses': to.addresses,
    'address-tooltip-trigger': String(state.addressTooltipTrigger ?? 'hover'),
  };

  if (from.alias) {
    props['from-alias'] = from.alias;
  }

  if (to.alias) {
    props['to-alias'] = to.alias;
  }

  const minWidthRaw = String(state.minWidth ?? '').trim();
  const minWidth = minWidthRaw ? Number(minWidthRaw) : 0;
  if (minWidth > 0) {
    props['min-width'] = minWidth;
  }

  appendCurrencySideVisibilityProps(props, state);

  return props;
}

function addressSingleModeDefaults(): Record<string, unknown> {
  return {
    [currencyTagShowKey('from', 1, 'system')]: false,
    [currencyTagShowKey('from', 1, 'custom')]: true,
    showAddressRowTag: true,
    addressRowTagLabel: 'Tag',
    addressRowTagSystemType: 'gray',
    showAddressSecondaryText: true,
    addressSecondaryText: 'Wallet Name',
    showAddressMulti: false,
    addressMultiCount: '3',
  };
}

function buildAddressUsageSnippet(state: Record<string, unknown>): string {
  const mode = String(state.displayMode ?? 'single');
  const address = String(state.address ?? SAMPLE_ADDRESS);

  if (mode !== 'single') {
    return buildVueSelfClosingSnippet('EgCryptoAddress', buildAddressCryptoProps(state), {
      defaults: {
        'address-mode': 'single',
        'from-text': SAMPLE_ADDRESS,
        'from-address-count': 1,
      },
    });
  }

  const tags = buildCurrencySideTags('from', state);
  const tagProps = hasAddressTags(tags.system, tags.custom) ? { ':tags': 'addressTags' } : {};
  const rowTagProps: Record<string, unknown> = {};

  if (state.showAddressRowTag !== false) {
    rowTagProps['show-row-tag'] = true;
    rowTagProps['row-tag-label'] = String(state.addressRowTagLabel ?? 'Tag');
    rowTagProps['row-tag-system-type'] = String(state.addressRowTagSystemType ?? 'gray');
  }

  if (state.showAddressSecondaryText !== false) {
    const secondaryText = String(state.addressSecondaryText ?? '').trim();
    if (secondaryText) {
      rowTagProps['secondary-text'] = secondaryText;
    }
  }

  const lineProps: Record<string, unknown> = {
    text: address,
    'copy-on-row-hover': Boolean(state.copyOnRowHover ?? true),
    'tooltip-trigger': String(state.tooltipTrigger ?? 'hover'),
    ...tagProps,
    ...rowTagProps,
  };

  if (state.showAddressMulti === true) {
    const count = parseCurrencyAddressCount(state.addressMultiCount);
    lineProps['address-count'] = count;
    const from = buildCurrencySideAddressData('from', {
      ...state,
      fromAddressCount: String(count),
    });
    if (from.addresses.length > 0) {
      lineProps[':addresses'] = 'addressList';
    }
  }

  return [
    buildVueOpeningTag('EgListFieldAddressLine', lineProps),
    lineProps[':addresses'] ? '  <!-- addressList: string[] -->' : '',
    tagProps[':tags'] ? '  <!-- addressTags: CryptoAddressSideTags -->' : '',
    '</EgListFieldAddressLine>',
  ]
    .filter(Boolean)
    .join('\n');
}

function buildHashLikeUsageSnippet(
  tag: string,
  state: Record<string, unknown>,
  sample: string,
): string {
  const value = String(state.value ?? sample);
  const secondaryValue = String(
    state.secondaryValue ??
      (tag === 'EgListFieldGeneralStructure'
        ? SAMPLE_GENERAL_SECONDARY
        : tag === 'EgListFieldIdentifier'
          ? SAMPLE_HASH
          : SAMPLE_ID),
  );
  const lineLayout = String(state.lineLayout ?? 'single');
  const tooltipTrigger = String(state.tooltipTrigger ?? 'hover');
  const copyOnRowHover = Boolean(state.copyOnRowHover ?? false);

  const primaryLine = [
    buildVueOpeningTag('EgListFieldHashLikeLine', {
      text: value,
      variant: 'primary',
      'identifier-mode': tag === 'EgListFieldIdentifier',
      'copy-on-row-hover': copyOnRowHover,
      'tooltip-trigger': tooltipTrigger,
    }),
    '</EgListFieldHashLikeLine>',
  ].join('\n');

  if (lineLayout === 'double') {
    const secondaryLine = [
      buildVueOpeningTag('EgListFieldHashLikeLine', {
        text: secondaryValue,
        variant: 'secondary',
        'identifier-mode': tag === 'EgListFieldIdentifier',
        'copy-on-row-hover': copyOnRowHover,
        'tooltip-trigger': tooltipTrigger,
      }),
      '</EgListFieldHashLikeLine>',
    ].join('\n');

    return ['<span class="hash-like-combo">', primaryLine, secondaryLine, '</span>'].join('\n');
  }

  return primaryLine;
}

function buildAmountPrimaryRowSnippet(
  state: Record<string, unknown>,
  symbol: string,
  defaultCryptoValue: string,
): string {
  const cryptoSnippetName = resolveCryptoBusinessNameFromSymbol(symbol);
  const amountText = formatGroupedNumber(String(state.cryptoValue ?? defaultCryptoValue));
  const lines = ['<div class="list-field-amount-primary-row">'];

  if (state.showCryptoIcon !== false) {
    lines.push(
      `  <EgCrypto name="${cryptoSnippetName}" fit class="list-field-amount-crypto-icon" label="${symbol}" />`,
    );
  }

  lines.push(`  <span class="typography-body-medium tabular-nums">${amountText} ${symbol}</span>`);

  if (state.showAmountTag !== false) {
    const tagLabel = String(state.amountTagLabel ?? 'Tag');
    const tagSystemType = String(state.amountTagSystemType ?? 'stroke-subtle');
    lines.push(`  <EgTag size="sm" system-type="${tagSystemType}">${tagLabel}</EgTag>`);
  }

  lines.push('</div>');
  return lines.join('\n');
}

function buildAmountUsageSnippet(state: Record<string, unknown>): string {
  const amountType = String(state.amountType ?? 'conversion');
  const showCountdown =
    amountType !== 'fiat' && Boolean(state.showCountdown);

  if (amountType === 'fiat') {
    return `<span class="typography-body-medium">${String(state.fiatValue ?? '$10')}</span>`;
  }

  if (amountType === 'crypto') {
    const symbol = String(state.cryptoSymbol ?? 'BTC');
    const primary = buildAmountPrimaryRowSnippet(state, symbol, '66666.6666');
    if (!showCountdown) return primary;
    return ['<div class="list-field-amount">', primary, buildCountdownUsageSnippet(state), '</div>'].join(
      '\n',
    );
  }

  if (amountType === 'amount-address') {
    const symbol = String(state.cryptoSymbol ?? 'USDT');
    const primary = buildAmountPrimaryRowSnippet(state, symbol, '12,500.000001');
    const addressType = String(state.addressType ?? 'single');

    if (addressType === 'double') {
      const cryptoProps = buildAddressCryptoProps({ ...state, symbol });
      return [
        '<div class="list-field-amount">',
        primary,
        `  ${buildVueSelfClosingSnippet('EgCryptoAddress', cryptoProps, {
          defaults: { 'address-mode': 'double', 'address-tooltip-trigger': 'hover' },
        })}`,
        '</div>',
      ].join('\n');
    }

    const address = String(state.address ?? SAMPLE_ADDRESS);
    return [
      '<div class="list-field-amount">',
      primary,
      `  <span class="typography-footnote">${address}</span>`,
      '</div>',
    ].join('\n');
  }

  const symbol = String(state.cryptoSymbol ?? 'USDT');
  const primary = buildAmountPrimaryRowSnippet(state, symbol, '12,500.000001');
  const fiat = `<span class="typography-footnote">≈ ${String(state.fiatValue ?? '$12,500.01')}</span>`;

  if (!showCountdown) {
    return ['<div class="list-field-amount">', primary, fiat, '</div>'].join('\n');
  }

  return [
    '<div class="list-field-amount">',
    primary,
    '  <div class="list-field-amount-secondary-row">',
    `    ${fiat}`,
    '    <EgDivider type="page" direction="vertical" />',
    `    ${buildCountdownUsageSnippet(state)}`,
    '  </div>',
    '</div>',
  ].join('\n');
}

function buildTimeUsageSnippet(state: Record<string, unknown>): string {
  const lineLayout = String(state.lineLayout ?? 'single');
  const datetime = String(state.datetime ?? '2026-07-19 14:30:00');
  const lines = [
    lineLayout === 'double'
      ? `<span class="typography-body-small">${datetime}</span>`
      : `<span class="typography-body-medium">${datetime}</span>`,
  ];

  if (lineLayout === 'double') {
    lines.push(
      `<span class="typography-body-small">${String(state.secondaryDatetime ?? '2026-07-19 08:30:00')}</span>`,
    );
  }

  return lines.join('\n');
}

function buildStatusUsageSnippet(state: Record<string, unknown>): string {
  const tag = buildTagStatusUsageSnippet({
    ...state,
    family: 'status',
    size: state.size ?? 'lg',
  });

  if (!state.showFeedback) return tag;

  const feedback = buildFormSubmissionUsageSnippet(state);
  return ['<div class="list-field-status">', tag, feedback, '</div>'].join('\n');
}

const dismissFeedbackAlignOptions = [
  chineseOption('left', '左'),
  chineseOption('center', '中'),
  chineseOption('right', '右'),
];

const dismissFeedbackCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'dismissFeedbackAlign',
    label: showcaseText('Align', '对齐'),
    options: dismissFeedbackAlignOptions,
  },
  ...formSubmissionCustomizeControls,
];

const countdownTimeCustomizeControls: DocCustomizeControl[] = [
  { kind: 'text', key: 'countdownMinutes', label: showcaseText('Menit', '分钟'), placeholder: '30' },
  { kind: 'text', key: 'countdownSeconds', label: showcaseText('Detik', '秒'), placeholder: '00' },
];

const countdownCustomizeControls: DocCustomizeControl[] = [
  {
    kind: 'select',
    key: 'dismissFeedbackAlign',
    label: showcaseText('Align', '对齐'),
    options: dismissFeedbackAlignOptions,
    visibleWhen: (state) =>
      Boolean(state.showCountdown) && !Boolean(state.showDismissFeedback),
  },
  ...countdownTimeCustomizeControls,
];

function formatCountdownTime(state: Record<string, unknown>): string {
  const minutes = String(state.countdownMinutes ?? '30');
  const seconds = String(state.countdownSeconds ?? '0').padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function buildCountdownUsageSnippet(state: Record<string, unknown>): string {
  const time = formatCountdownTime(state);
  return [
    '<span class="list-field-general-structure-countdown">',
    `<span class="list-field-general-structure-countdown-time">${time}</span>`,
    '<span class="list-field-general-structure-countdown-suffix"> Until Expiry</span>',
    '</span>',
  ].join('');
}

function buildGeneralStructureCryptoSnippet(state: Record<string, unknown>): string {
  if (state.showCryptoIcon === false) return '';
  const symbol = String(state.cryptoSymbol ?? 'BTC');
  const cryptoSnippetName = resolveCryptoBusinessNameFromSymbol(symbol);
  return `<EgCrypto name="${cryptoSnippetName}" fit class="list-field-general-structure-crypto-icon" label="${symbol}" />`;
}

function buildGeneralStructureUsageSnippet(state: Record<string, unknown>): string {
  const hashLike = buildHashLikeUsageSnippet(
    'EgListFieldGeneralStructure',
    state,
    SAMPLE_GENERAL_TITLE,
  );
  const lineLayout = String(state.lineLayout ?? 'single');
  const showDismissFeedback =
    lineLayout === 'single' && Boolean(state.showDismissFeedback);
  const showCountdown = lineLayout === 'single' && Boolean(state.showCountdown);

  const cryptoSnippet = buildGeneralStructureCryptoSnippet(state);

  const parts: string[] = [];
  if (state.showLeftTag) {
    parts.push(
      buildTagSystemUsageSnippet({
        size: 'sm',
        systemType: state.leftSystemType ?? 'stroke-subtle',
        label: state.leftLabel ?? tagSystemCustomizeDefaults.label,
      }),
    );
  }
  const primaryParts = [cryptoSnippet, hashLike].filter(Boolean);
  parts.push(primaryParts.join('\n'));
  if (state.showRightTag) {
    parts.push(
      buildTagSystemUsageSnippet({
        size: 'sm',
        systemType: state.rightSystemType ?? 'stroke-subtle',
        label: state.rightLabel ?? tagSystemCustomizeDefaults.label,
      }),
    );
  }

  const align = String(state.dismissFeedbackAlign ?? 'left');
  const alignClass =
    align === 'center'
      ? 'list-field-general-structure--align-center'
      : align === 'right'
        ? 'list-field-general-structure--align-right'
        : 'list-field-general-structure--align-left';

  if (showDismissFeedback || showCountdown) {
    const stackLines: string[] = [];
    const body =
      parts.length > 1
        ? ['<div class="list-field-general-structure-title-row">', ...parts, '</div>'].join('\n')
        : parts[0] ?? hashLike;
    stackLines.push(body);
    if (showDismissFeedback) {
      stackLines.push(buildFormSubmissionUsageSnippet(state));
    }
    if (showCountdown) {
      stackLines.push(buildCountdownUsageSnippet(state));
    }
    return [
      `<div class="list-field-general-structure ${alignClass}">`,
      ...stackLines,
      '</div>',
    ].join('\n');
  }

  if (parts.length > 1) {
    return ['<div class="list-field-general-structure">', ...parts, '</div>'].join('\n');
  }

  return hashLike;
}

function buildMoreActionCustomizeControls(): DocCustomizeControl[] {
  const controls: DocCustomizeControl[] = [];

  for (let n = 1; n <= LIST_FIELD_MORE_ACTION_COUNT_MAX; n += 1) {
    controls.push(
      {
        kind: 'text',
        key: `moreAction${n}Label`,
        label: `更多 ${n} label`,
        row: n + 1,
        visibleWhen: (customize) => parseListFieldMoreActionCount(customize) >= n,
      },
      {
        kind: 'boolean',
        key: `moreAction${n}Danger`,
        label: `更多 ${n} danger`,
        row: n + 1,
        visibleWhen: (customize) => parseListFieldMoreActionCount(customize) >= n,
      },
    );
  }

  return controls;
}

function buildActionUsageSnippet(state: Record<string, unknown>): string {
  const primaryLabel = String(state.primaryLabel ?? 'Action');
  const moreActions = buildListFieldMoreActions(state);

  const lines = [
    '<EgDataList',
    '  :data="rows"',
    `  :primary-action="{ label: '${primaryLabel}' }"`,
  ];

  if (moreActions.length > 0) {
    lines.push(`  :more-actions="${JSON.stringify(moreActions)}"`);
  }

  lines.push('>', '  <EgDataListColumn prop="actions" label="Header" align="right" is-action />', '</EgDataList>');

  return lines.join('\n');
}

const currencyConfig: ListFieldDocConfig = {
  componentTag: 'EgCryptoCombo',
  importCode: CRYPTO_COMBO_IMPORT,
  propsSectionId: 'list-field-currency-props',
  compactPreview: true,
  customizeDefaults: {
    minWidth: '',
    symbol: 'ZEC',
    showNetwork: true,
    networkLabel: 'Base',
    entryBadgeMode: 'none',
    addressTooltipTrigger: 'hover',
    comboMode: 'double-address',
    ...currencySideAddressDefaults('from', 'ZEC'),
    ...currencySideAddressDefaults('to', 'ZEC'),
    ...currencyTagCustomizeDefaults(),
  },
  customizeControls: [
    { kind: 'text', key: 'minWidth', label: showcaseText('Minimal width', '最小宽度') },
    { kind: 'text', key: 'symbol', label: showcaseText('<g id="Bold">Currency Type<g id="Bold">:</g></g>', '币种') },
    { kind: 'boolean', key: 'showNetwork', label: showcaseText('networks', '网络') },
    {
      kind: 'text',
      key: 'networkLabel',
      label: showcaseText('Network Name', '网络名'),
      visibleWhen: (state) => state.showNetwork !== false,
    },
    {
      kind: 'select',
      key: 'comboMode',
      label: showcaseText('Compose', '组合'),
      options: currencyComboOptions,
    },
    {
      kind: 'select',
      key: 'entryBadgeMode',
      label: showcaseText('Incoming Corner Marker', '入向角标'),
      options: entryBadgeOptions,
    },
    {
      kind: 'select',
      key: 'addressTooltipTrigger',
      label: showcaseText('Tooltip Interaction', 'Tooltip 交互'),
      options: addressTooltipTriggerOptions,
      visibleWhen: (state) => state.comboMode !== 'currency-only',
    },
  ],
  customizePanels: [
    {
      title: showcaseText('Address', '地址'),
      sequential: true,
      rowColumns: 4,
      addressSide: 'from',
      visibleWhen: (state) => state.comboMode === 'single-address',
      controls: [],
    },
    {
      title: showcaseText('Sender', '发送方'),
      sequential: true,
      rowColumns: 4,
      addressSide: 'from',
      visibleWhen: (state) => state.comboMode === 'double-address',
      controls: [],
    },
    {
      title: showcaseText('To', '接收方'),
      sequential: true,
      rowColumns: 4,
      addressSide: 'to',
      visibleWhen: (state) => state.comboMode === 'double-address',
      controls: [],
    },
  ],
  propRows: [
    sceneProp(
      'minWidth',
      'number',
      '-',
      showcaseText(
        'Body min width (px); omit for auto. Single-address default 278.',
        'Body 最小宽度（px）；不传为自适应。单地址默认 278。',
      ),
    ),
    sceneProp(
      'cryptoName',
      'CryptoName',
      '-',
      showcaseText('EgCrypto icon (CryptoSymbol 32px).', 'EgCrypto 图标（CryptoSymbol 32px）。'),
    ),
    sceneProp(
      'symbol',
      'string',
      '-',
      showcaseText('Token symbol, Body Medium.', '代币符号 Body Medium。'),
    ),
    sceneProp(
      'showChain',
      'boolean',
      'true',
      showcaseText('Whether to show network Tag (Figma showChain).', '是否展示网络 Tag（Figma showChain）。'),
    ),
    sceneProp(
      'chainLabel',
      'string',
      '-',
      showcaseText('Network Tag copy (e.g. Base, Ethereum).', '网络 Tag 文案（如 Base、Ethereum）。'),
    ),
    sceneProp(
      'networkStyle',
      "'none' | 'tag' | 'suffix'",
      "'tag'",
      showcaseText(
        'tag → System stroke-subtle; suffix → symbol suffix.',
        'tag → System stroke-subtle；suffix → 符号后缀。',
      ),
    ),
    sceneProp(
      'entryBadge',
      "'none' | 'in' | 'out'",
      "'none'",
      showcaseText(
        'In/out corner badge; in → eds-arrow-entry, out → eds-arrow-outflow.',
        '入/出角标；in → eds-arrow-entry，out → eds-arrow-outflow。',
      ),
    ),
    sceneProp(
      'layoutStyle',
      "'suffix' | 'unsuffix'",
      "'unsuffix'",
      showcaseText(
        'When badge present: suffix (36px icon area); can be inferred from entryBadge.',
        '有角标时为 suffix（36px 图标区）；可由 entryBadge 推导。',
      ),
    ),
    sceneProp(
      'contentType',
      "'address' | 'unaddress'",
      "'address'",
      showcaseText('Whether to render the address sub-row.', '是否渲染地址子行。'),
    ),
    sceneProp(
      'addressMode',
      "'single' | 'double'",
      "'double'",
      showcaseText(
        'Single or dual address (includes System / Custom / 99+ Tag).',
        '单地址或双地址（含 System / Custom / 99+ Tag）。',
      ),
    ),
    sceneProp(
      'addressTooltipTrigger',
      "'hover' | 'focus'",
      "'hover'",
      showcaseText(
        'Address Tooltip interaction: hover expands on hover; focus (Tab) expands on focus.',
        '地址 Tooltip 交互：hover 悬浮展开；focus 聚焦（Tab）展开。',
      ),
    ),
    sceneProp(
      'fromAddress',
      'string',
      '-',
      showcaseText(
        'Sender first address; when fromAlias is set, alias replaces display.',
        '地址或发送方首条；有别名时由 fromAlias 替代展示。',
      ),
    ),
    sceneProp(
      'fromAlias',
      'string',
      '-',
      showcaseText('Address alias; mutually exclusive with address display.', '地址别名；与地址互斥展示。'),
    ),
    sceneProp(
      'fromAddressCount',
      'number',
      '1',
      showcaseText(
        'Sender address count (1–100); when >2 shows (N) and enables Tooltip.',
        '发送方地址数（1–100）；>2 时展示 (N) 并启用 Tooltip。',
      ),
    ),
    sceneProp(
      'fromAddresses',
      'string[]',
      '-',
      showcaseText('Full sender address list (Tooltip content).', '发送方完整地址列表（Tooltip 内容）。'),
    ),
    sceneProp(
      'toAddress',
      'string',
      '-',
      showcaseText(
        'Recipient first address; when toAlias is set, alias replaces display.',
        '接收方首条地址；有别名时由 toAlias 替代展示。',
      ),
    ),
    sceneProp(
      'toAlias',
      'string',
      '-',
      showcaseText('Recipient address alias; mutually exclusive with address display.', '接收方地址别名；与地址互斥展示。'),
    ),
    sceneProp(
      'toAddressCount',
      'number',
      '1',
      showcaseText(
        'Recipient address count (1–100); when >2 shows (N) and enables Tooltip.',
        '接收方地址数（1–100）；>2 时展示 (N) 并启用 Tooltip。',
      ),
    ),
    sceneProp(
      'toAddresses',
      'string[]',
      '-',
      showcaseText('Full recipient address list (Tooltip content).', '接收方完整地址列表（Tooltip 内容）。'),
    ),
  ],
  buildUsageSnippet: buildCurrencyUsageSnippet,
};

const addressConfig: ListFieldDocConfig = {
  componentTag: 'EgListFieldAddress',
  importCode: `import { EgCryptoAddress, EgListFieldAddressLine } from '@eds/desktop-components';`,
  propsSectionId: 'list-field-address-props',
  customizeDefaults: {
    displayMode: 'single',
    address: SAMPLE_ADDRESS,
    symbol: 'ZEC',
    minWidth: '',
    copyOnRowHover: true,
    tooltipTrigger: 'hover',
    addressTooltipTrigger: 'hover',
    ...currencySideAddressDefaults('from', 'ZEC'),
    ...currencySideAddressDefaults('to', 'ZEC'),
    ...currencyTagCustomizeDefaults(),
    ...addressSingleModeDefaults(),
  },
  customizeControls: [
    listFieldMinWidthControl(1),
    {
      kind: 'select',
      key: 'displayMode',
      label: showcaseText('Variant displayMode', '变体 displayMode'),
      options: addressDisplayOptions,
      row: 1,
    },
    {
      kind: 'text',
      key: 'address',
      label: showcaseText('Address address', '地址 address'),
      row: 2,
      visibleWhen: (state) => state.displayMode === 'single',
    },
    {
      kind: 'boolean',
      key: 'copyOnRowHover',
      label: showcaseText('Copy', '复制'),
      row: 2,
      visibleWhen: (state) => state.displayMode === 'single',
    },
    {
      kind: 'select',
      key: 'tooltipTrigger',
      label: showcaseText('Tooltip Interaction', 'Tooltip 交互'),
      options: addressTooltipTriggerOptions,
      row: 2,
      visibleWhen: (state) => state.displayMode === 'single',
    },
    {
      kind: 'boolean',
      key: 'showAddressRowTag',
      label: showcaseText('Show inline tags', '显示行内 Tag'),
      row: 2,
      visibleWhen: (state) => state.displayMode === 'single',
    },
    {
      kind: 'boolean',
      key: 'showAddressSecondaryText',
      label: showcaseText('Show secondary text', '显示副文本'),
      row: 2,
      visibleWhen: (state) => state.displayMode === 'single',
    },
    {
      kind: 'text',
      key: 'addressSecondaryText',
      label: showcaseText('Sub Text', '副文本'),
      row: 2,
      visibleWhen: (state) =>
        state.displayMode === 'single' && Boolean(state.showAddressSecondaryText),
    },
    {
      kind: 'boolean',
      key: 'showAddressMulti',
      label: showcaseText('Show multiple addresses', '显示多地址'),
      row: 2,
      visibleWhen: (state) => state.displayMode === 'single',
    },
    {
      kind: 'select',
      key: 'addressMultiCount',
      label: showcaseText('Number of addresses N', '地址数 N'),
      options: countSelectOptions(100, 2),
      row: 2,
      visibleWhen: (state) =>
        state.displayMode === 'single' && Boolean(state.showAddressMulti),
    },
    {
      kind: 'select',
      key: 'addressTooltipTrigger',
      label: showcaseText('Tooltip Interaction', 'Tooltip 交互'),
      options: addressTooltipTriggerOptions,
      row: 2,
      visibleWhen: (state) => state.displayMode === 'double',
    },
  ],
  customizePanels: [
    {
      title: 'EgTag',
      controls: addressRowTagCustomizeControls,
      visibleWhen: (state) =>
        state.displayMode === 'single' && Boolean(state.showAddressRowTag),
    },
    {
      title: showcaseText('Tag', '标签'),
      sequential: true,
      rowColumns: 4,
      addressSide: 'from',
      addressTagOnly: true,
      visibleWhen: (state) => state.displayMode === 'single',
      controls: [],
    },
    {
      title: showcaseText('Sender', '发送方'),
      sequential: true,
      rowColumns: 4,
      addressSide: 'from',
      visibleWhen: (state) => state.displayMode === 'double',
      controls: [],
    },
    {
      title: showcaseText('To', '接收方'),
      sequential: true,
      rowColumns: 4,
      addressSide: 'to',
      visibleWhen: (state) => state.displayMode === 'double',
      controls: [],
    },
  ],
  propRows: [
    sceneProp(
      'displayMode',
      "'single' | 'double'",
      "'single'",
      showcaseText('[doc] Address EgListFieldAddressLine（Row EgTag + AddressRow (N) + Wallet Name / CryptoAddressTags）；Address EgCryptoAddress + /。', '单地址用 EgListFieldAddressLine（行内 EgTag + 地址行 (N) + 下方 Wallet Name / CryptoAddressTags）；双地址用 EgCryptoAddress + 发送方/接收方定制。'),
    ),
    sceneProp('address', 'string', '-', showcaseText('[doc] AddressAddress；OverflowwhenEllipsis + Tooltip。', '单地址模式完整链上地址；溢出时中间省略 + Tooltip。')),
    sceneProp(
      'showAddressRowTag',
      'boolean',
      'true',
      showcaseText('[doc] Address：AddressRow EgTag（spacing-1，Fixed Sm）。', '单地址：地址行尾展示 EgTag（spacing-1，固定 Sm）。'),
    ),
    sceneProp(
      'addressRowTagLabel',
      'string',
      "'Tag'",
      showcaseText('[doc] Customize「EgTag」 — Row Tag Copy。', 'Customize「EgTag」嵌套 — 行内 Tag 文案。'),
    ),
    sceneProp(
      'addressRowTagSystemType',
      'TagSystemType',
      "'gray'",
      showcaseText('[doc] Customize「EgTag」 — Row Tag Type。', 'Customize「EgTag」嵌套 — 行内 Tag 类型。'),
    ),
    sceneProp(
      'showAddressSecondaryText',
      'boolean',
      'true',
      showcaseText('[doc] Address：Text + CryptoAddressTags Same asRow（Textin，spacing-1）。', '单地址：副文本 + CryptoAddressTags 同一行（副文本在前，spacing-1）。'),
    ),
    sceneProp(
      'addressSecondaryText',
      'string',
      "'Wallet Name'",
      showcaseText('[doc] AddressTextCopy（meta Row，Name）。', '单地址副文本文案（meta 行首位，如钱包名称）。'),
    ),
    sceneProp(
      'showAddressMulti',
      'boolean',
      'false',
      showcaseText('[doc] Address：AddressRowAddress (N)；and EgCryptoAddress ，N>2 whenShow。', '单地址：地址行尾展示多地址计数 (N)；与 EgCryptoAddress 一致，N>2 时显示。'),
    ),
    sceneProp(
      'addressMultiCount',
      'number',
      '3',
      showcaseText('[doc] showAddressMulti as true when Address N（≥2）。', 'showAddressMulti 为 true 时的地址数 N（≥2）。'),
    ),
    sceneProp(
      'addressCount',
      'number',
      '1',
      showcaseText('[doc] EgListFieldAddressLine：AddressRow (N) ；>2 when。', 'EgListFieldAddressLine：地址行内 (N) 计数；>2 时展示。'),
    ),
    sceneProp(
      'addresses',
      'string[]',
      '-',
      showcaseText('[doc] EgListFieldAddressLine：Address Menu RowAddressList。', 'EgListFieldAddressLine：多地址 Menu 各行完整地址列表。'),
    ),
    sceneProp(
      'tags',
      'CryptoAddressSideTags',
      '-',
      showcaseText('[doc] Address：AddressRow Tag（Custom / +N）；byTagPanel。', '单地址模式：地址行下方 Tag（Custom / +N）；由标签定制面板配置。'),
    ),
    sceneProp('fromAddress', 'string', '-', showcaseText('[doc] ；whenby fromAlias 。', '发送方首条；有别名时由 fromAlias 替代展示。')),
    sceneProp('fromAlias', 'string', '-', showcaseText('[doc] Address。', '发送方地址别名。')),
    sceneProp('fromAddressCount', 'number', '1', showcaseText('[doc] Address（1–100）；>2 when (N) and Tooltip。', '发送方地址数（1–100）；>2 时展示 (N) 并启用 Tooltip。')),
    sceneProp('fromAddresses', 'string[]', '-', showcaseText('[doc] AddressList（Tooltip ）。', '发送方完整地址列表（Tooltip 内容）。')),
    sceneProp('toAddress', 'string', '-', showcaseText('[doc] ；Addresswhen。', '接收方首条；双地址时展示。')),
    sceneProp('toAlias', 'string', '-', showcaseText('[doc] Address。', '接收方地址别名。')),
    sceneProp('toAddressCount', 'number', '1', showcaseText('[doc] Address（1–100）；Addresswhen。', '接收方地址数（1–100）；双地址时生效。')),
    sceneProp('toAddresses', 'string[]', '-', showcaseText('[doc] AddressList。', '接收方完整地址列表。')),
    listFieldMinWidthProp,
    sceneProp('copyOnRowHover', 'boolean', 'true', showcaseText('[doc] Address： Data List RowwhenShowCopy。', '单地址：悬浮 Data List 行时显示复制。')),
    sceneProp(
      'addressTooltipTrigger',
      "'hover' | 'focus'",
      "'hover'",
      showcaseText('[doc] Address：CryptoAddress Tooltip Interaction。', '非单地址：CryptoAddress Tooltip 交互。'),
    ),
  ],
  buildUsageSnippet: buildAddressUsageSnippet,
};

const transactionHashConfig: ListFieldDocConfig = {
  componentTag: 'EgListFieldTransactionHash',
  importCode: LIST_FIELD_IMPORT,
  propsSectionId: 'list-field-transaction-hash-props',
  compactPreview: true,
  customizeSequential: true,
  customizeRowColumns: 5,
  customizeDefaults: {
    value: SAMPLE_HASH,
    secondaryValue: SAMPLE_HASH_SECONDARY,
    lineLayout: 'single',
    minWidth: '',
    copyOnRowHover: false,
    tooltipTrigger: 'hover',
  },
  customizeControls: buildHashLikeCustomizeControls('哈希 value', {
    value: SAMPLE_HASH,
    secondaryValue: SAMPLE_HASH_SECONDARY,
  }),
  propRows: [
    sceneProp('value', 'string', '-', showcaseText('[doc] Text；Rowwhen，Rowwhenas Combo Title Row。', '主文本；单行时唯一展示值，双行时为 Combo Title 首行。')),
    sceneProp(
      'secondaryValue',
      'string',
      '-',
      showcaseText('[doc] Text；lineLayout=double whenas Footnote Row。', '副文本；lineLayout=double 时展示为 Footnote 次级行。'),
    ),
    sceneProp(
      'lineLayout',
      "'single' | 'double'",
      "'single'",
      showcaseText('[doc] Row：Body Medium Row；Row：Combo Title（Text + Text，spacing-05）。', '单行：Body Medium 一行；双行：Combo Title（主文本 + 副文本，spacing-05）。'),
    ),
    listFieldMinWidthProp,
    sceneProp(
      'copyOnRowHover',
      'boolean',
      'false',
      showcaseText('[doc] ColumnwhenShowCopyButton；Tooltip OverflowMenuCopycan，。', '数据列悬浮时显示复制按钮；Tooltip 溢出菜单内复制始终可用，互不冲突。'),
    ),
    sceneProp(
      'tooltipTrigger',
      "'hover' | 'focus'",
      "'hover'",
      showcaseText('[doc] Tooltip Interaction：hover Expanded；focus Focus（Tab）Expanded。', 'Tooltip 交互：hover 悬浮展开；focus 聚焦（Tab）展开。'),
    ),
    sceneProp('ellipsis', "'tail'", "'tail'", showcaseText('[doc] TextRowEllipsis（text-overflow: ellipsis）；Overflowwhen Tooltip。', '文本单行尾部省略（text-overflow: ellipsis）；溢出时启用 Tooltip。')),
    sceneProp('tooltipWhenTruncated', 'boolean', 'true', showcaseText('[doc] onlyTextOverflowEllipsiswhen Tooltip Interaction。', '仅文本溢出省略时启用 Tooltip 交互。')),
  ],
  buildUsageSnippet: (state) => buildHashLikeUsageSnippet('EgListFieldTransactionHash', state, SAMPLE_HASH),
};

const identifierConfig: ListFieldDocConfig = {
  componentTag: 'EgListFieldIdentifier',
  importCode: LIST_FIELD_IMPORT,
  propsSectionId: 'list-field-identifier-props',
  compactPreview: true,
  customizeSequential: true,
  customizeRowColumns: 5,
  customizeDefaults: {
    value: SAMPLE_ID,
    secondaryValue: SAMPLE_ID_SECONDARY,
    lineLayout: 'single',
    minWidth: '',
    copyOnRowHover: false,
    tooltipTrigger: 'hover',
  },
  customizeControls: buildHashLikeCustomizeControls('编号 value', {
    value: SAMPLE_ID,
    secondaryValue: SAMPLE_ID_SECONDARY,
  }),
  propRows: [
    sceneProp('value', 'string', '-', showcaseText('[doc] Text；Rowwhen，Rowwhenas Combo Title Row。', '主文本；单行时唯一展示值，双行时为 Combo Title 首行。')),
    sceneProp(
      'secondaryValue',
      'string',
      '-',
      showcaseText('[doc] Text；lineLayout=double whenas Footnote Row。', '副文本；lineLayout=double 时展示为 Footnote 次级行。'),
    ),
    sceneProp(
      'lineLayout',
      "'single' | 'double'",
      "'single'",
      showcaseText('[doc] Row：Body Medium Row；Row：Combo Title（Text + Text，spacing-05）。', '单行：Body Medium 一行；双行：Combo Title（主文本 + 副文本，spacing-05）。'),
    ),
    listFieldMinWidthProp,
    sceneProp(
      'copyOnRowHover',
      'boolean',
      'false',
      showcaseText('[doc] ColumnwhenShowCopyButton；Tooltip OverflowMenuCopycan，。', '数据列悬浮时显示复制按钮；Tooltip 溢出菜单内复制始终可用，互不冲突。'),
    ),
    sceneProp(
      'tooltipTrigger',
      "'hover' | 'focus'",
      "'hover'",
      showcaseText('[doc] Tooltip Interaction：hover Expanded；focus Focus（Tab）Expanded。', 'Tooltip 交互：hover 悬浮展开；focus 聚焦（Tab）展开。'),
    ),
    sceneProp('ellipsis', "'tail'", "'tail'", showcaseText('[doc] TextRowEllipsis（Same asTransaction）；Overflowwhen Tooltip。', '文本单行尾部省略（同交易哈希）；溢出时启用 Tooltip。')),
    sceneProp('tooltipWhenTruncated', 'boolean', 'true', showcaseText('[doc] onlyTextOverflowEllipsiswhen Tooltip Interaction。', '仅文本溢出省略时启用 Tooltip 交互。')),
  ],
  buildUsageSnippet: (state) => buildHashLikeUsageSnippet('EgListFieldIdentifier', state, SAMPLE_ID),
};

const generalStructureConfig: ListFieldDocConfig = {
  componentTag: 'EgListFieldGeneralStructure',
  importCode: LIST_FIELD_IMPORT,
  propsSectionId: 'list-field-general-structure-props',
  compactPreview: true,
  customizeSequential: true,
  customizeRowColumns: 5,
  customizeDefaults: {
    value: SAMPLE_GENERAL_TITLE,
    secondaryValue: SAMPLE_GENERAL_SECONDARY,
    lineLayout: 'single',
    minWidth: '',
    copyOnRowHover: false,
    tooltipTrigger: 'hover',
    showRightTag: false,
    showLeftTag: false,
    showDismissFeedback: false,
    showCountdown: false,
    countdownMinutes: '30',
    countdownSeconds: '0',
    dismissFeedbackAlign: 'left',
    type: formSubmissionCustomizeDefaults.type,
    text: formSubmissionCustomizeDefaults.text,
    linkLabel: formSubmissionCustomizeDefaults.linkLabel,
    showLink: formSubmissionCustomizeDefaults.showLink,
    rightSystemType: 'stroke-subtle',
    rightLabel: tagSystemCustomizeDefaults.label,
    leftSystemType: 'stroke-subtle',
    leftLabel: tagSystemCustomizeDefaults.label,
    cryptoSymbol: 'BTC',
    showCryptoIcon: true,
  },
  customizeControls: buildHashLikeCustomizeControls(
    '主文本 value',
    {
      value: SAMPLE_GENERAL_TITLE,
      secondaryValue: SAMPLE_GENERAL_SECONDARY,
    },
    {
      insertAfterCopy: [
        {
          kind: 'boolean',
          key: 'showDismissFeedback',
          label: showcaseText('Show feedback', '显示反馈'),
          row: 0,
          visibleWhen: (state) => String(state.lineLayout ?? 'single') === 'single',
        },
        {
          kind: 'boolean',
          key: 'showCountdown',
          label: showcaseText('Show countdown', '显示倒计时'),
          row: 0,
          visibleWhen: (state) => String(state.lineLayout ?? 'single') === 'single',
        },
      ],
      afterCopy: [
        { kind: 'boolean', key: 'showCryptoIcon', label: showcaseText('ShowIcon', '显示符号'), row: 1 },
        { kind: 'boolean', key: 'showRightTag', label: showcaseText('ShowTrailingTag', '显示右侧Tag'), row: 1 },
        { kind: 'boolean', key: 'showLeftTag', label: showcaseText('ShowLeadingTag', '显示左侧Tag'), row: 1 },
      ],
    },
  ),
  customizePanels: [
    {
      title: 'EgFormSubmission',
      controls: dismissFeedbackCustomizeControls,
      visibleWhen: (state) =>
        String(state.lineLayout ?? 'single') === 'single' && Boolean(state.showDismissFeedback),
    },
    {
      title: showcaseText('Countdown', '倒计时'),
      controls: countdownCustomizeControls,
      visibleWhen: (state) =>
        String(state.lineLayout ?? 'single') === 'single' && Boolean(state.showCountdown),
    },
    {
      title: 'EgTag',
      controls: generalStructureTagCustomizeControls('right'),
      visibleWhen: (state) => Boolean(state.showRightTag),
    },
    {
      title: 'EgTag',
      controls: generalStructureTagCustomizeControls('left'),
      visibleWhen: (state) => Boolean(state.showLeftTag),
    },
  ],
  propRows: [
    sceneProp('value', 'string', '-', showcaseText('[doc] Text；Rowwhen，Rowwhenas Combo Title Row。', '主文本；单行时唯一展示值，双行时为 Combo Title 首行。')),
    sceneProp(
      'showCryptoIcon',
      'boolean',
      'true',
      showcaseText('[doc] TextotherwiseIconIcon（EgCrypto，`--avatar-xs`）；IconbyBusiness。', '主文本前是否展示符号图标（EgCrypto，`--avatar-xs`）；符号由业务数据提供。'),
    ),
    sceneProp(
      'secondaryValue',
      'string',
      '-',
      showcaseText('[doc] Text；lineLayout=double whenas Footnote Row。', '副文本；lineLayout=double 时展示为 Footnote 次级行。'),
    ),
    sceneProp(
      'lineLayout',
      "'single' | 'double'",
      "'single'",
      showcaseText('[doc] Row：Body Medium Row；Row：Combo Title（Text + Text，spacing-05）。', '单行：Body Medium 一行；双行：Combo Title（主文本 + 副文本，spacing-05）。'),
    ),
    listFieldMinWidthProp,
    sceneProp(
      'copyOnRowHover',
      'boolean',
      'false',
      showcaseText('[doc] ColumnwhenShowCopyButton；Tooltip OverflowMenuCopycan，。', '数据列悬浮时显示复制按钮；Tooltip 溢出菜单内复制始终可用，互不冲突。'),
    ),
    sceneProp(
      'tooltipTrigger',
      "'hover' | 'focus'",
      "'hover'",
      showcaseText('[doc] Tooltip Interaction：hover Expanded；focus Focus（Tab）Expanded。', 'Tooltip 交互：hover 悬浮展开；focus 聚焦（Tab）展开。'),
    ),
    sceneProp('ellipsis', "'tail'", "'tail'", showcaseText('[doc] TextRowEllipsis（Same asTransaction）；Overflowwhen Tooltip。', '文本单行尾部省略（同交易哈希）；溢出时启用 Tooltip。')),
    sceneProp('tooltipWhenTruncated', 'boolean', 'true', showcaseText('[doc] onlyTextOverflowEllipsiswhen Tooltip Interaction。', '仅文本溢出省略时启用 Tooltip 交互。')),
    sceneProp(
      'showDismissFeedback',
      'boolean',
      'false',
      showcaseText('[doc] RowwheninText EgFormSubmission（spacing-05）。', '单行时勾选后在主文本下方展示 EgFormSubmission（spacing-05）。'),
    ),
    sceneProp(
      'showCountdown',
      'boolean',
      'false',
      showcaseText('[doc] RowwheninTextwhenCopy（spacing-05）。', '单行时勾选后在主文本下方展示倒计时文案（spacing-05）。'),
    ),
    sceneProp(
      'countdownMinutes',
      'string',
      "'30'",
      showcaseText('[doc] Customize「when」 — （danger ）。', 'Customize「倒计时」嵌套 — 分钟部分（danger 色）。'),
    ),
    sceneProp(
      'countdownSeconds',
      'string',
      "'0'",
      showcaseText('[doc] Customize「when」 — （danger ）。', 'Customize「倒计时」嵌套 — 秒部分（danger 色）。'),
    ),
    sceneProp(
      'dismissFeedbackAlign',
      "'left' | 'center' | 'right'",
      "'left'",
      showcaseText('[doc] Customize「EgFormSubmission」 — andTextVerticalColumnwhen Align。', 'Customize「EgFormSubmission」嵌套 — 与主文本垂直排列时的对齐方式。'),
    ),
    ...formSubmissionPropRows.map((row) => ({
      ...row,
      description: `Customize「EgFormSubmission」嵌套 — ${row.description}`,
    })),
    sceneProp('showRightTag', 'boolean', 'false', showcaseText('[doc] inTextTrailing EgTag（spacing-1，Fixed Sm）。', '勾选后在主文本右侧展示 EgTag（spacing-1，固定 Sm）。')),
    sceneProp('showLeftTag', 'boolean', 'false', showcaseText('[doc] inTextLeading EgTag（spacing-1，Fixed Sm）。', '勾选后在主文本左侧展示 EgTag（spacing-1，固定 Sm）。')),
    sceneProp('size', "'sm'", "'sm'", showcaseText('[doc] General Structure EgTag Fixed Sm，can。', 'General Structure 内嵌 EgTag 固定 Sm，不可配置。')),
    ...tagSystemPropRows
      .filter((row) => row.name !== 'size')
      .map((row) =>
        row.name === 'systemType'
          ? {
              ...row,
              name: 'rightSystemType / leftSystemType',
              defaultValue: "'stroke-subtle'",
              description: showcaseText('System type variant; left and right tags are configured independently, and stroke-subtle is the default.', 'System 类型变体；左右 Tag 独立配置，默认 stroke-subtle。'),
            }
          : row.name === 'label'
            ? {
                ...row,
                name: 'rightLabel / leftLabel',
                description: showcaseText('Left and right EgTag copy, independently configured.', '左右 EgTag 文案，独立配置。'),
              }
            : row,
      ),
    sceneProp('family', "'system'", "'system'", showcaseText('[doc] Customize「EgTag」 System Tag 。', 'Customize「EgTag」嵌套 System Tag 属性。')),
  ],
  buildUsageSnippet: buildGeneralStructureUsageSnippet,
};

const amountConfig: ListFieldDocConfig = {
  componentTag: 'EgListFieldAmount',
  importCode: `${LIST_FIELD_IMPORT}\nimport { EgCryptoAddress } from '@eds/desktop-components';\n// formatGroupedNumber for grouped digits`,
  propsSectionId: 'list-field-amount-props',
  compactPreview: true,
  customizeSequential: true,
  customizeRowColumns: 5,
  customizeDefaults: {
    amountType: 'conversion',
    fiatValue: '$12,500.01',
    cryptoValue: '12,500.000001',
    cryptoSymbol: 'USDT',
    addressType: 'single',
    address: SAMPLE_ADDRESS,
    addressTooltipTrigger: 'hover',
    ...currencySideAddressDefaults('from', 'USDT'),
    ...currencySideAddressDefaults('to', 'USDT'),
    showCryptoIcon: true,
    showAmountTag: true,
    amountTagSystemType: 'stroke-subtle',
    amountTagLabel: 'Tag',
    showCountdown: false,
    countdownMinutes: '30',
    countdownSeconds: '0',
    minWidth: '',
  },
  customizeControls: [
    {
      kind: 'select',
      key: 'amountType',
      label: showcaseText('Type amountType', '类型 amountType'),
      options: amountTypeOptions,
      row: 0,
    },
    listFieldMinWidthControl(0),
    {
      kind: 'select',
      key: 'addressType',
      label: showcaseText('Address type addressType', '地址类型 addressType'),
      options: addressDisplayOptions,
      row: 0,
      visibleWhen: (state) => state.amountType === 'amount-address',
    },
    {
      kind: 'text',
      key: 'fiatValue',
      label: showcaseText('Fiat currency fiatValue', '法币 fiatValue'),
      row: 1,
      visibleWhen: (state) =>
        state.amountType === 'fiat' || state.amountType === 'conversion',
    },
    {
      kind: 'text',
      key: 'address',
      label: showcaseText('Address address', '地址 address'),
      row: 1,
      visibleWhen: (state) =>
        state.amountType === 'amount-address' &&
        String(state.addressType ?? 'single') === 'single',
    },
    {
      kind: 'text',
      key: 'cryptoValue',
      label: showcaseText('Count cryptoValue', '数量 cryptoValue'),
      row: 1,
      visibleWhen: (state) => state.amountType !== 'fiat',
    },
    {
      kind: 'text',
      key: 'cryptoSymbol',
      label: showcaseText('Currency cryptoSymbol', '币种 cryptoSymbol'),
      row: 1,
      visibleWhen: (state) => state.amountType !== 'fiat',
    },
    {
      kind: 'boolean',
      key: 'showCryptoIcon',
      label: showcaseText('Show currency icon', '显示币种图标'),
      row: 1,
      visibleWhen: (state) => state.amountType !== 'fiat',
    },
    {
      kind: 'boolean',
      key: 'showAmountTag',
      label: showcaseText('Show Tag', '显示 Tag'),
      row: 1,
      visibleWhen: (state) => state.amountType !== 'fiat',
    },
    {
      kind: 'boolean',
      key: 'showCountdown',
      label: showcaseText('Show countdown', '显示倒计时'),
      row: 1,
      visibleWhen: (state) => state.amountType === 'conversion',
    },
  ],
  customizePanels: [
    {
      title: 'EgTag',
      controls: amountTagCustomizeControls,
      visibleWhen: (state) =>
        state.amountType !== 'fiat' && Boolean(state.showAmountTag),
    },
    {
      title: showcaseText('Countdown', '倒计时'),
      controls: countdownTimeCustomizeControls,
      visibleWhen: (state) =>
        state.amountType === 'conversion' && Boolean(state.showCountdown),
    },
  ],
  propRows: [
    sceneProp(
      'amountType',
      "'fiat' | 'crypto' | 'conversion' | 'amount-address'",
      "'crypto'",
      showcaseText(
        '[doc] 、、、orRow。',
        '法币、加密货币、折合、或主行金额 + 副行地址。',
      ),
    ),
    sceneProp('groupSeparator', 'boolean', 'true', showcaseText('[doc] 。', '千分位分隔符。')),
    sceneProp('fiatPrecision', 'number', '2', showcaseText('[doc] 。', '法币小数精度。')),
    sceneProp('conversionLine', 'string', '-', showcaseText('[doc] Row：`Count ≈ `。', '折合行：`数量 币种 ≈ 折合法币`。')),
    sceneProp(
      'addressType',
      "'single' | 'double'",
      "'single'",
      showcaseText(
        '[doc] amount-address: Row or /。',
        'amount-address 类型：副行单地址或双地址（发送方/接收方）。',
      ),
    ),
    sceneProp(
      'address',
      'string',
      '-',
      showcaseText('[doc] amount-address RowAddress。', 'amount-address 单地址：副行地址文案。'),
    ),
    sceneProp('cryptoSymbol', 'string', "'USDT'", showcaseText('[doc] / RowIcon； EgCrypto Icon。', '加密货币 / 折合主行币种符号；驱动 EgCrypto 图标。')),
    sceneProp('showCryptoIcon', 'boolean', 'true', showcaseText('[doc] Rowotherwise EgCrypto Icon（`--avatar-xs`）。', '主行是否展示 EgCrypto 图标（`--avatar-xs`）。')),
    sceneProp('showAmountTag', 'boolean', 'true', showcaseText('[doc] Rowotherwise EgTag（spacing-1，Fixed Sm）。', '主行是否展示 EgTag（spacing-1，固定 Sm）。')),
    sceneProp(
      'amountTagLabel',
      'string',
      "'Tag'",
      showcaseText('[doc] Customize「EgTag」 — Row Tag Copy。', 'Customize「EgTag」嵌套 — 主行 Tag 文案。'),
    ),
    sceneProp(
      'amountTagSystemType',
      'TagSystemType',
      "'stroke-subtle'",
      showcaseText('[doc] Customize「EgTag」 — Row Tag Type。', 'Customize「EgTag」嵌套 — 主行 Tag 类型。'),
    ),
    sceneProp(
      'showCountdown',
      'boolean',
      'false',
      showcaseText('[doc] inRow、Textwhen（spacing-1 + EgDivider type=page）。', '勾选后在折合行内、副文本后展示倒计时（spacing-1 + 竖向 EgDivider type=page）。'),
    ),
    sceneProp(
      'countdownMinutes',
      'string',
      "'30'",
      showcaseText('[doc] Customize「when」 — （danger ）。', 'Customize「倒计时」嵌套 — 分钟部分（danger 色）。'),
    ),
    sceneProp(
      'countdownSeconds',
      'string',
      "'0'",
      showcaseText('[doc] Customize「when」 — （danger ）。', 'Customize「倒计时」嵌套 — 秒部分（danger 色）。'),
    ),
    listFieldMinWidthProp,
  ],
  buildUsageSnippet: buildAmountUsageSnippet,
};

const timeConfig: ListFieldDocConfig = {
  componentTag: 'EgListFieldTime',
  importCode: LIST_FIELD_IMPORT,
  propsSectionId: 'list-field-time-props',
  customizeDefaults: {
    lineLayout: 'single',
    datetime: '2026-07-19 14:30:00',
    secondaryDatetime: '2026-07-19 08:30:00',
    utcOffset: '+08:00',
    showHeaderHint: true,
    minWidth: '',
  },
  customizeControls: [
    {
      kind: 'select',
      key: 'lineLayout',
      label: showcaseText('Type lineLayout', '类型 lineLayout'),
      options: timeLineLayoutOptions,
      row: 0,
    },
    listFieldMinWidthControl(0),
    { kind: 'text', key: 'datetime', label: showcaseText('Time datetime', '时间 datetime'), row: 0 },
    {
      kind: 'text',
      key: 'secondaryDatetime',
      label: showcaseText('Secondary Time secondaryDatetime', '副时间 secondaryDatetime'),
      row: 0,
      visibleWhen: (state) => String(state.lineLayout ?? 'single') === 'double',
    },
    { kind: 'text', key: 'utcOffset', label: showcaseText('Timezone utcOffset', '时区 utcOffset'), row: 1 },
    { kind: 'boolean', key: 'showHeaderHint', label: showcaseText('Header hint showHeaderHint', '表头提示 showHeaderHint'), row: 1 },
  ],
  propRows: [
    sceneProp(
      'lineLayout',
      "'single' | 'double'",
      "'single'",
      showcaseText('[doc] ：onlywhen；：when + when（Body Small Row，spacing-05）。', '单：仅主时间；双：主时间 + 副时间（Body Small 双行，spacing-05）。'),
    ),
    sceneProp('datetime', 'string', '-', showcaseText('[doc] when， YYYY-MM-DD HH:MM:SS。', '主时间，格式 YYYY-MM-DD HH:MM:SS。')),
    sceneProp(
      'secondaryDatetime',
      'string',
      '-',
      showcaseText('[doc] when；lineLayout=double whenasRow。', '副时间；lineLayout=double 时展示为第二行。'),
    ),
    sceneProp('utcOffset', 'string', '-', showcaseText('[doc] Column Transaction Time (UTC±…) 。', '列头 Transaction Time (UTC±…) 提示。')),
    sceneProp('showHeaderHint', 'boolean', 'false', showcaseText('[doc] otherwiseinColumn UTC Offset。', '是否在列头展示 UTC 偏移。')),
    listFieldMinWidthProp,
  ],
  buildUsageSnippet: buildTimeUsageSnippet,
};

const statusConfig: ListFieldDocConfig = {
  componentTag: 'EgListFieldStatus',
  importCode: tagImportCode,
  propsSectionId: 'list-field-status-props',
  compactPreview: true,
  customizeSequential: true,
  customizeRowColumns: 5,
  customizeDefaults: {
    minWidth: '',
    size: 'lg',
    family: 'status',
    status: 'success',
    label: 'Success',
    showFeedback: false,
    type: formSubmissionCustomizeDefaults.type,
    text: formSubmissionCustomizeDefaults.text,
    linkLabel: formSubmissionCustomizeDefaults.linkLabel,
    showLink: formSubmissionCustomizeDefaults.showLink,
  },
  customizeControls: [
    listFieldMinWidthControl(0),
    ...withCustomizeRow(tagStatusCustomizeControls, 0),
    { kind: 'boolean', key: 'showFeedback', label: showcaseText('Show feedback', '显示反馈'), row: 0 },
  ],
  customizePanels: [
    {
      title: 'EgFormSubmission',
      controls: formSubmissionCustomizeControls,
      visibleWhen: (state) => Boolean(state.showFeedback),
    },
  ],
  propRows: [
    ...tagStatusPropRows.map((row) =>
      row.name === 'size'
        ? { ...row, defaultValue: "'lg'", description: showcaseText('Data List cells use Lg.', 'Data List 单元格使用 Lg。') }
        : row,
    ),
    listFieldMinWidthProp,
    sceneProp('showFeedback', 'boolean', 'false', showcaseText('[doc] in Status Tag Form Submission（spacing-05）。', '勾选后在 Status Tag 下方展示 Form Submission（spacing-05）。')),
    sceneProp('family', "'status'", "'status'", showcaseText('[doc] List Field Cell Status Tag。', 'List Field 单元格使用 Status Tag。')),
    ...formSubmissionPropRows.map((row) => ({
      ...row,
      description: `Customize「EgFormSubmission」嵌套 — ${row.description}`,
    })),
  ],
  buildUsageSnippet: buildStatusUsageSnippet,
};

const actionConfig: ListFieldDocConfig = {
  componentTag: 'EgListFieldAction',
  importCode: `import { EgDataList, EgDataListColumn } from '@eds/desktop-components';`,
  propsSectionId: 'list-field-action-props',
  compactPreview: true,
  customizeDefaults: listFieldActionCustomizeDefaults(),
  customizeControls: [
    { kind: 'text', key: 'primaryLabel', label: showcaseText('Primary Button label', '主按钮 label'), row: 0 },
    {
      kind: 'select',
      key: 'moreActionCount',
      label: showcaseText('More operands', '更多操作数'),
      options: countSelectOptions(LIST_FIELD_MORE_ACTION_COUNT_MAX, 0),
      row: 0,
    },
    { kind: 'text', key: 'minWidth', label: showcaseText('Minimal width', '最小宽度'), row: 1 },
    ...buildMoreActionCustomizeControls(),
  ],
  propRows: [
    sceneProp('primaryAction', '{ label: string }', '-', showcaseText('[doc] Solid Button。', 'Solid 主操作按钮。')),
    sceneProp(
      'moreActions',
      'DataListRowAction[]',
      '[]',
      showcaseText('[doc] 0 ：onlyButton；1 ：Button + TextButton；2+ ：Button + More Menu。Panelcan 0～10 。', '0 个：仅主按钮；1 个：主按钮 + 文本次按钮；2+ 个：主按钮 + More 菜单。定制面板可选 0～10 个。'),
    ),
    sceneProp('minWidth', 'number', '-', showcaseText('[doc] PreviewWidth（px）；asAdaptive。', '预览区最小宽度（px）；不传为自适应。')),
    sceneProp('align', "'right'", "'right'", showcaseText('[doc] Action ColumnAlign。', 'Action 列右对齐。')),
    sceneProp('columnMinWidth', '180px', '180px', showcaseText('[doc] Action ColumnRecommendedWidth（Data List Column）。', 'Action 列推荐最小宽度（Data List 列宽）。')),
  ],
  buildUsageSnippet: buildActionUsageSnippet,
};

const listFieldDocConfigBySlug: Record<ListFieldSceneSlug, ListFieldDocConfig> = {
  'list-field-currency': currencyConfig,
  'list-field-address': addressConfig,
  'list-field-transaction-hash': transactionHashConfig,
  'list-field-identifier': identifierConfig,
  'list-field-general-structure': generalStructureConfig,
  'list-field-amount': amountConfig,
  'list-field-time': timeConfig,
  'list-field-status': statusConfig,
  'list-field-action': actionConfig,
};

export function getListFieldDocConfig(slug: ListFieldSceneSlug): ListFieldDocConfig {
  return listFieldDocConfigBySlug[slug];
}
