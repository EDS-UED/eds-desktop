import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import {
  type CryptoAddressSideTags,
  type CryptoAddressTagSlotConfig,
  type TagColorfulStyle,
  type TagCustomStyle,
  type TagSize,
} from '@eds/desktop-components';
import { countSelectOptions } from '@/data/showcasePropLabels';
import {
  tagColorfulCustomizeControls,
  tagColorfulCustomizeDefaults,
  tagCustomCustomizeControls,
  tagRiskCustomizeControls,
} from '@/views/components/previews/tagDocCustomize';
import {
  MAX_CURRENCY_SIDE_ADDRESSES,
  currencyAddressTagsEnabledKey,
  parseCurrencyAddressCount,
} from './listFieldCurrencyShared';

export type CurrencyTagPanelSlot = 'system' | 'custom';

export type CurrencyTagPanelConfig = {
  title: string;
  side: 'from' | 'to';
  addressIndex: number;
  slot: CurrencyTagPanelSlot;
  family: 'system' | 'colorful' | 'custom';
  rowColumns?: number;
};

const TAG_COUNT_MAX = 100;
const tagCountOptions = countSelectOptions(TAG_COUNT_MAX);

function capitalizeKey(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function slotLabel(slot: CurrencyTagPanelSlot): string {
  return slot === 'system' ? 'Risk' : 'Palette';
}

export function currencyTagShowKey(
  side: 'from' | 'to',
  addressIndex: number,
  slot: CurrencyTagPanelSlot,
): string {
  return `${side}Address${addressIndex}Show${capitalizeKey(slot)}Tag`;
}

export function currencyTagKeyPrefix(
  side: 'from' | 'to',
  addressIndex: number,
  slot: CurrencyTagPanelSlot,
): string {
  return `${side}Address${addressIndex}${capitalizeKey(slot)}Tag`;
}

export function currencyTagCountKey(
  side: 'from' | 'to',
  addressIndex: number,
  slot: CurrencyTagPanelSlot,
): string {
  return `${currencyTagKeyPrefix(side, addressIndex, slot)}Count`;
}

export function currencyTagEditIndexKey(
  side: 'from' | 'to',
  addressIndex: number,
  slot: CurrencyTagPanelSlot,
): string {
  return `${currencyTagKeyPrefix(side, addressIndex, slot)}EditIndex`;
}

export function currencyTagItemKey(
  side: 'from' | 'to',
  addressIndex: number,
  slot: CurrencyTagPanelSlot,
  field: 'Label' | 'SystemType' | 'ColorfulStyle' | 'CustomStyle',
  tagIndex: number,
): string {
  return `${currencyTagKeyPrefix(side, addressIndex, slot)}${field}${tagIndex}`;
}

export function parseCurrencyTagCount(
  state: Record<string, unknown>,
  side: 'from' | 'to',
  addressIndex: number,
  slot: CurrencyTagPanelSlot,
): number {
  const parsed = Number.parseInt(
    String(state[currencyTagCountKey(side, addressIndex, slot)] ?? '1'),
    10,
  );
  return Number.isFinite(parsed) ? Math.min(TAG_COUNT_MAX, Math.max(1, parsed)) : 1;
}

export function parseCurrencyTagEditIndex(
  state: Record<string, unknown>,
  side: 'from' | 'to',
  addressIndex: number,
  slot: CurrencyTagPanelSlot,
): number {
  const count = parseCurrencyTagCount(state, side, addressIndex, slot);
  const parsed = Number.parseInt(
    String(state[currencyTagEditIndexKey(side, addressIndex, slot)] ?? '1'),
    10,
  );
  const index = Number.isFinite(parsed) ? parsed : 1;
  return Math.min(count, Math.max(1, index));
}

function defaultTagItemValue(
  slot: CurrencyTagPanelSlot,
  tagIndex: number,
  field: 'Label' | 'SystemType' | 'ColorfulStyle' | 'CustomStyle',
): string {
  if (field === 'Label') {
    return tagIndex === 1 ? slotLabel(slot) : `Tag ${tagIndex}`;
  }
  if (field === 'SystemType') {
    return 'solid-red';
  }
  if (field === 'CustomStyle') {
    if (slot === 'system') {
      return 'aml-danger';
    }
    if (tagIndex === 1) return 'teal';
    if (tagIndex === 2) return 'cobalt';
    const extraCustomStyles = [
      'aurora',
      'vermilion',
      'orange',
      'amber',
      'lime',
      'mint',
      'clear-sky',
      'orchid',
      'rose',
      'peach',
    ] as const;
    return extraCustomStyles[(tagIndex - 3) % extraCustomStyles.length] ?? 'aurora';
  }
  return String(tagColorfulCustomizeDefaults.colorfulStyle);
}

function ensureCurrencyTagItemKeys(
  state: Record<string, unknown>,
  side: 'from' | 'to',
  addressIndex: number,
  slot: CurrencyTagPanelSlot,
  family: 'system' | 'colorful' | 'custom',
  count: number,
): void {
  const fields: Array<'Label' | 'SystemType' | 'ColorfulStyle' | 'CustomStyle'> =
    family === 'system'
      ? ['Label', 'SystemType']
      : family === 'colorful'
        ? ['Label', 'ColorfulStyle']
        : ['Label', 'CustomStyle'];

  for (let tagIndex = 1; tagIndex <= count; tagIndex += 1) {
    for (const field of fields) {
      const key = currencyTagItemKey(side, addressIndex, slot, field, tagIndex);
      if (state[key] == null || String(state[key]).trim() === '') {
        state[key] = defaultTagItemValue(slot, tagIndex, field);
      }
    }
  }
}

export function syncCurrencyTagCustomize(state: Record<string, unknown>): void {
  for (const side of ['from', 'to'] as const) {
    const addressCount = parseCurrencyAddressCount(state[`${side}AddressCount`]);

    for (let addr = 1; addr <= addressCount; addr += 1) {
      for (const panel of [
        { slot: 'system' as const, family: 'custom' as const },
        { slot: 'custom' as const, family: 'custom' as const },
      ]) {
        const count = parseCurrencyTagCount(state, side, addr, panel.slot);
        ensureCurrencyTagItemKeys(state, side, addr, panel.slot, panel.family, count);
        const editIndex = parseCurrencyTagEditIndex(state, side, addr, panel.slot);
        state[currencyTagEditIndexKey(side, addr, panel.slot)] = String(editIndex);
      }
    }
  }
}

function buildCurrencyTagItemControls(
  config: CurrencyTagPanelConfig,
  editIndex: number,
): DocCustomizeControl[] {
  const baseControls = (
    config.slot === 'system'
      ? tagRiskCustomizeControls
      : config.family === 'custom'
        ? tagCustomCustomizeControls
        : tagColorfulCustomizeControls
  ).filter((control) => control.key !== 'size');

  return baseControls.map((control) => {
    const field =
      control.key === 'label'
        ? 'Label'
        : control.key === 'systemType'
          ? 'SystemType'
          : control.key === 'customStyle'
            ? 'CustomStyle'
            : 'ColorfulStyle';

    return {
      ...control,
      key: currencyTagItemKey(
        config.side,
        config.addressIndex,
        config.slot,
        field,
        editIndex,
      ),
      row: 0,
      visibleWhen: (state: Record<string, unknown>) => {
        const showKey = currencyTagShowKey(config.side, config.addressIndex, config.slot);
        if (state[showKey] === false) return false;
        return control.visibleWhen ? control.visibleWhen(state) : true;
      },
    };
  });
}

export function buildCurrencyTagPanelControls(
  config: CurrencyTagPanelConfig,
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const showKey = currencyTagShowKey(config.side, config.addressIndex, config.slot);
  const count = parseCurrencyTagCount(state, config.side, config.addressIndex, config.slot);
  const editIndex = parseCurrencyTagEditIndex(
    state,
    config.side,
    config.addressIndex,
    config.slot,
  );

  return [
    { kind: 'boolean', key: showKey, label: showcaseText('Show', '显示'), row: 0 },
    {
      kind: 'select',
      key: currencyTagCountKey(config.side, config.addressIndex, config.slot),
      label: showcaseText('Numbers', '个数'),
      options: tagCountOptions,
      row: 0,
      visibleWhen: (customize) => customize[showKey] !== false,
    },
    {
      kind: 'select',
      key: currencyTagEditIndexKey(config.side, config.addressIndex, config.slot),
      label: showcaseText('Edit', '编辑'),
      options: Array.from({ length: count }, (_, index) => {
        const n = index + 1;
        return { value: String(n), label: `第 ${n} 个` };
      }),
      row: 0,
      visibleWhen: (customize) => customize[showKey] !== false,
    },
    ...buildCurrencyTagItemControls(config, editIndex),
  ];
}

function createCurrencyTagItemDefaults(
  side: 'from' | 'to',
  addressIndex: number,
  slot: CurrencyTagPanelSlot,
  family: 'system' | 'colorful' | 'custom',
  count: number,
  enabled: boolean,
): Record<string, unknown> {
  const entries: Record<string, unknown> = {
    [currencyTagShowKey(side, addressIndex, slot)]: enabled,
    [currencyTagCountKey(side, addressIndex, slot)]: String(count),
    [currencyTagEditIndexKey(side, addressIndex, slot)]: '1',
  };

  for (let tagIndex = 1; tagIndex <= count; tagIndex += 1) {
    entries[currencyTagItemKey(side, addressIndex, slot, 'Label', tagIndex)] =
      defaultTagItemValue(slot, tagIndex, 'Label');
    if (family === 'system') {
      entries[currencyTagItemKey(side, addressIndex, slot, 'SystemType', tagIndex)] =
        defaultTagItemValue(slot, tagIndex, 'SystemType');
    } else if (family === 'colorful') {
      entries[currencyTagItemKey(side, addressIndex, slot, 'ColorfulStyle', tagIndex)] =
        defaultTagItemValue(slot, tagIndex, 'ColorfulStyle');
    } else {
      entries[currencyTagItemKey(side, addressIndex, slot, 'CustomStyle', tagIndex)] =
        defaultTagItemValue(slot, tagIndex, 'CustomStyle');
    }
  }

  return entries;
}

export function currencyAddressTagDefaults(
  side: 'from' | 'to',
  addressIndex: number,
  enabled = false,
): Record<string, unknown> {
  if (side === 'from') {
    return {
      [currencyAddressTagsEnabledKey(side, addressIndex)]: enabled,
      ...createCurrencyTagItemDefaults(side, addressIndex, 'system', 'custom', 1, enabled),
      ...createCurrencyTagItemDefaults(side, addressIndex, 'custom', 'custom', 3, false),
    };
  }

  return {
    [currencyAddressTagsEnabledKey(side, addressIndex)]: enabled,
    ...createCurrencyTagItemDefaults(side, addressIndex, 'system', 'custom', 1, false),
    ...createCurrencyTagItemDefaults(side, addressIndex, 'custom', 'custom', 3, enabled),
  };
}

export function currencyTagCustomizeDefaults(): Record<string, unknown> {
  const entries: Record<string, unknown> = {};

  for (const side of ['from', 'to'] as const) {
    for (let addressIndex = 1; addressIndex <= MAX_CURRENCY_SIDE_ADDRESSES; addressIndex += 1) {
      Object.assign(
        entries,
        currencyAddressTagDefaults(side, addressIndex, addressIndex === 1),
      );
    }
  }

  return entries;
}

export function buildCurrencyTagPanelsForAddress(
  side: 'from' | 'to',
  addressIndex: number,
): CurrencyTagPanelConfig[] {
  return [
    {
      title: showcaseText('Risk tags · EgTag', '风险标签 · EgTag'),
      side,
      addressIndex,
      slot: 'system',
      family: 'custom',
    },
    {
      title: showcaseText('CustomTag · EgTag', '自定义标签 · EgTag'),
      side,
      addressIndex,
      slot: 'custom',
      family: 'custom',
    },
  ];
}

function buildTagSlotArray(
  side: 'from' | 'to',
  addressIndex: number,
  slot: CurrencyTagPanelSlot,
  family: 'system' | 'colorful' | 'custom',
  customize: Record<string, unknown>,
): CryptoAddressTagSlotConfig[] {
  const showKey = currencyTagShowKey(side, addressIndex, slot);
  if (customize[showKey] === false) return [];

  const count = parseCurrencyTagCount(customize, side, addressIndex, slot);

  return Array.from({ length: count }, (_, index) => {
    const tagIndex = index + 1;
    const tag: CryptoAddressTagSlotConfig = {
      show: true,
      size: 'sm' as TagSize,
      family,
      label: String(
        customize[currencyTagItemKey(side, addressIndex, slot, 'Label', tagIndex)] ??
          defaultTagItemValue(slot, tagIndex, 'Label'),
      ),
    };

    if (family === 'colorful') {
      tag.colorfulStyle = String(
        customize[currencyTagItemKey(side, addressIndex, slot, 'ColorfulStyle', tagIndex)] ??
          defaultTagItemValue(slot, tagIndex, 'ColorfulStyle'),
      ) as TagColorfulStyle;
    } else {
      tag.customStyle = String(
        customize[currencyTagItemKey(side, addressIndex, slot, 'CustomStyle', tagIndex)] ??
          defaultTagItemValue(slot, tagIndex, 'CustomStyle'),
      ) as TagCustomStyle;
    }

    return tag;
  });
}

export function buildCurrencyAddressTags(
  side: 'from' | 'to',
  addressIndex: number,
  customize: Record<string, unknown>,
): CryptoAddressSideTags {
  if (customize[currencyAddressTagsEnabledKey(side, addressIndex)] !== true) {
    return { system: [], custom: [] };
  }

  return {
    system: buildTagSlotArray(side, addressIndex, 'system', 'custom', customize),
    custom: buildTagSlotArray(side, addressIndex, 'custom', 'custom', customize),
  };
}

export function buildCurrencySideTagsList(
  side: 'from' | 'to',
  customize: Record<string, unknown>,
): CryptoAddressSideTags[] {
  const addressCount = parseCurrencyAddressCount(customize[`${side}AddressCount`]);
  return Array.from({ length: addressCount }, (_, index) =>
    buildCurrencyAddressTags(side, index + 1, customize),
  );
}

/** 首地址 Tag（兼容旧 API） */
export function buildCurrencySideTags(
  side: 'from' | 'to',
  customize: Record<string, unknown>,
): CryptoAddressSideTags {
  return buildCurrencyAddressTags(side, 1, customize);
}
