import type { DetailAddressLayout, DetailItemData, DetailItemValueEntry } from './detailTypes';

/** Figma Apply_Item@Cregis — node 2267:11092 */
export const DETAIL_APPLY_ITEM_FIGMA_NODE = '2267:11092';

export type DetailApplyItemVariantId =
  | 'crypto'
  | 'initiated-by'
  | 'status'
  | 'sender'
  | 'receiver'
  | 'time'
  | 'brand-number'
  | 'tripartite-number'
  | 'remark'
  | 'memo'
  | 'txid'
  | 'text'
  | 'fee'
  | 'amount'
  | 'type'
  | 'reason'
  | 'ip';

export type DetailApplyItemVariant = {
  id: DetailApplyItemVariantId;
  label: string;
  item: Omit<DetailItemData, 'key'>;
};

/**
 * Apply_Item 变体行 — 业务仅可覆盖的字段（展示文案 / 接口值）。
 * 挂件（符号、Tag 族、Link、Copy、地址簿、AML、浏览器等）由变体锁死，禁止 override。
 */
export type DetailApplyItemRowOverrides = Partial<
  Pick<
    DetailItemData,
    | 'key'
    | 'title'
    | 'value'
    | 'tag'
    | 'valueSymbolCrypto'
    | 'valueIcon'
    | 'valueSymbolAvatarName'
    | 'addressLayout'
    | 'valueEntries'
    | 'addressCount'
    | 'addressViewMoreLabel'
  >
>;

const APPLY_ITEM_ROW_OVERRIDE_KEYS: (keyof DetailApplyItemRowOverrides)[] = [
  'key',
  'title',
  'value',
  'tag',
  'valueSymbolCrypto',
  'valueIcon',
  'valueSymbolAvatarName',
  'addressLayout',
  'valueEntries',
  'addressCount',
  'addressViewMoreLabel',
];

/** Showcase / 文档 — Sender·Receiver 多地址演示数据（Figma 2267:11822 / 2267:11830） */
export const detailAddressDemoEntries: Record<
  'sender' | 'receiver',
  Array<Pick<DetailItemValueEntry, 'value' | 'tag'>>
> = {
  sender: [
    { tag: 'Mr. Wang', value: '3MqUP6G1daVS5YTD8fz3QgwjZortWwxXFd' },
    { tag: 'Pool A', value: 'bc1qsmu69g72d7rdzwv7y7va0rd7cunen7tcer3tn8' },
    { tag: 'Cold Wallet', value: '0x55e8f6900963c095ff6dd6538749d31c38a7204' },
  ],
  receiver: [
    { tag: 'EverGreen', value: 'bc1qsmu69g72d7rdzwv7y7va0rd7cunen7tcer3tn8' },
    { tag: 'Treasury', value: '3MqUP6G1daVS5YTD8fz3QgwjZortWwxXFd' },
    { tag: 'Ops', value: 'TLa2f6VPqDgRE67v1736s7bJ8nyEwRS9WB' },
  ],
};

export function buildDetailAddressApplyItemRow(
  variantId: 'sender' | 'receiver',
  layout: DetailAddressLayout,
  overrides: DetailApplyItemRowOverrides = {},
): DetailItemData {
  const entries = detailAddressDemoEntries[variantId];
  const primary = entries[0]!;

  const base = createDetailApplyItemRow(variantId, {
    ...overrides,
    value: overrides.value ?? primary.value,
    tag: overrides.tag ?? primary.tag,
  });

  if (layout === 'single') {
    return base;
  }

  const valueEntries: DetailItemValueEntry[] = entries.map((entry, index) => ({
    value: entry.value,
    tag: entry.tag,
    tagBeforeValue: true,
    tagFamily: base.tagFamily,
    tagSystemType: base.tagSystemType,
    dashed: layout === 'multi-expanded' && index < entries.length - 1,
  }));

  return {
    ...base,
    addressLayout: layout,
    addressCount: overrides.addressCount ?? (
      layout === 'multi-collapsed' || layout === 'multi-orders'
        ? 16
        : entries.length
    ),
    addressViewMoreLabel: layout === 'multi-collapsed'
      ? (overrides.addressViewMoreLabel ?? 'Expand')
      : layout === 'multi-orders'
        ? (overrides.addressViewMoreLabel ?? '{count} Orders')
        : overrides.addressViewMoreLabel,
    valueEntries,
    value: valueEntries[0]!.value,
    tag: valueEntries[0]!.tag,
  };
}

/** ENG · Apply_Item@Cregis（2267:11092）单行变体 — EDS 唯一真源 */
export const detailApplyItemVariants: DetailApplyItemVariant[] = [
  {
    id: 'crypto',
    label: 'Crypto · Token',
    item: {
      titleIcon: 'eds-coin-trading',
      title: 'Token',
      showValueSymbol: true,
      valueSymbolKind: 'crypto',
      valueSymbolCrypto: 'eds-btc-bitcoin',
      valueType: 'crypto',
      valueIcon: 'eds-btc-bitcoin',
      value: 'BTC',
      tag: 'Lightning',
      tagFamily: 'system',
      tagSystemType: 'stroke-subtle',
    },
  },
  {
    id: 'initiated-by',
    label: 'Initiated by',
    item: {
      titleIcon: 'eds-arrow-launch-circle',
      title: 'Initiated by',
      valueType: 'user',
      value: 'Ethan Davis',
    },
  },
  {
    id: 'status',
    label: 'Status',
    item: {
      titleIcon: 'eds-launch',
      title: 'Status',
      valueType: 'text',
      value: '',
      tag: 'Success',
      tagFamily: 'status',
      tagStatus: 'success',
      valueTagOnly: true,
    },
  },
  {
    id: 'sender',
    label: 'Sender',
    item: {
      titleIcon: 'eds-arrow-up',
      title: 'Sender',
      valueType: 'text',
      value: '3MqUP6G1daVS5YTD8fz3QgwjZortWwxXFd',
      tag: 'Mr. Wang',
      tagFamily: 'system',
      tagSystemType: 'solid-brand',
      tagBeforeValue: true,
      showValueCopy: true,
    },
  },
  {
    id: 'receiver',
    label: 'Receiver',
    item: {
      titleIcon: 'eds-arrow-down',
      title: 'Receiver',
      valueType: 'text',
      value: 'bc1qsmu69g72d7rdzwv7y7va0rd7cunen7tcer3tn8',
      tag: 'EverGreen',
      tagFamily: 'system',
      tagSystemType: 'solid-brand',
      tagBeforeValue: true,
      showValueCopy: true,
      showValueAddressBook: true,
      showValueAmlSearch: true,
    },
  },
  {
    id: 'time',
    label: 'Time',
    item: {
      titleIcon: 'eds-calendar',
      title: 'Time',
      valueType: 'text',
      value: '2031-12-23 10:23:00',
    },
  },
  {
    id: 'brand-number',
    label: 'Brand Number',
    item: {
      titleIcon: 'eds-brand-numbers',
      title: 'XX Number',
      valueType: 'text',
      value: 'Number_20311020_82420678',
      showValueCopy: true,
    },
  },
  {
    id: 'tripartite-number',
    label: 'Tripartite Number',
    item: {
      titleIcon: 'eds-list-bullet',
      title: 'Tripartite Number',
      valueType: 'text',
      value: 'Coinbase_order_800389028',
      showValueCopy: true,
    },
  },
  {
    id: 'remark',
    label: 'Remark',
    item: {
      titleIcon: 'eds-text-note',
      title: 'Remark',
      valueType: 'text',
      value: 'This is a text.',
      showValueLink: true,
      valueLinkLabel: 'Edit',
    },
  },
  {
    id: 'memo',
    label: 'Memo',
    item: {
      titleIcon: 'eds-text-journal',
      title: 'Memo',
      valueType: 'text',
      value: 'FJ859UF8F8',
      showValueCopy: true,
    },
  },
  {
    id: 'txid',
    label: 'TxID',
    item: {
      titleIcon: 'eds-sign-hashtag',
      title: 'TxID',
      valueType: 'text',
      value: '60bfe69ce24d82dd7795722130666a4cfa34f1308120cfffdcb2a70bf295ba39',
      showValueCopy: true,
      showValueBrowser: true,
    },
  },
  {
    id: 'text',
    label: 'Text',
    item: {
      titleIcon: 'eds-work-done',
      title: 'Text',
      valueType: 'text',
      value: 'This is a text.',
    },
  },
  {
    id: 'fee',
    label: 'Fee',
    item: {
      titleIcon: 'eds-usd-settlement',
      title: 'Fee',
      valueType: 'text',
      value: '0.02256 USDC',
    },
  },
  {
    id: 'amount',
    label: 'Amount',
    item: {
      titleIcon: 'eds-crypto-amount',
      title: 'Amount',
      valueType: 'text',
      value: '0.02256 USDC',
      tag: 'Bitcoin',
      tagFamily: 'system',
      tagSystemType: 'stroke-subtle',
    },
  },
  {
    id: 'type',
    label: 'Type',
    item: {
      titleIcon: 'eds-business-type',
      title: 'Type',
      valueType: 'text',
      value: 'This is a text.',
    },
  },
  {
    id: 'reason',
    label: 'Reason',
    item: {
      titleIcon: 'eds-aml-warning',
      title: 'Reason',
      valueType: 'text',
      value:
        'Others (eg. timeout, duplicate payment, incorrect payment currency, network delay, etc.)',
    },
  },
  {
    id: 'ip',
    label: 'IP',
    item: {
      titleIcon: 'eds-location-compass',
      title: 'IP',
      valueType: 'text',
      value: 'Washington, D.C. 192.168.1.230',
      showValueCopy: true,
    },
  },
];

export const detailApplyItemVariantIds = detailApplyItemVariants.map((variant) => variant.id);

export function isDetailApplyItemVariantId(value: string): value is DetailApplyItemVariantId {
  return detailApplyItemVariantIds.includes(value as DetailApplyItemVariantId);
}

export function getDetailApplyItemVariant(
  variantId: string,
): DetailApplyItemVariant | undefined {
  return detailApplyItemVariants.find((variant) => variant.id === variantId);
}

function pickApplyItemRowOverrides(
  overrides: DetailApplyItemRowOverrides,
): DetailApplyItemRowOverrides {
  const picked: DetailApplyItemRowOverrides = {};
  for (const key of APPLY_ITEM_ROW_OVERRIDE_KEYS) {
    const value = overrides[key];
    if (value !== undefined) {
      (picked as Record<string, unknown>)[key] = value;
    }
  }
  return picked;
}

/**
 * 由 Apply_Item 变体生成 Detail 行。挂件锁死在变体内；业务只传展示字段。
 *
 * @example
 * createDetailApplyItemRow('sender', { value: address, tag: walletName })
 * createDetailApplyItemRow('receiver', { key: 'receiver', value: bc1q... })
 */
export function createDetailApplyItemRow(
  variantId: DetailApplyItemVariantId,
  overrides: DetailApplyItemRowOverrides = {},
): DetailItemData {
  const variant = getDetailApplyItemVariant(variantId);
  if (!variant) {
    throw new Error(`Unknown Detail Apply_Item variant: ${variantId}`);
  }
  return {
    ...structuredClone(variant.item),
    ...pickApplyItemRowOverrides(overrides),
  };
}
