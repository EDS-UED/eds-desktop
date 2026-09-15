import type { DocCustomizeControl } from '@/views/shared/componentDoc/types';
import { showcaseText } from '@/data/showcasePropLabels';
import { countSelectOptions } from '@/data/showcasePropLabels';
import {
  addressMatchesFamily,
  resolveAddressFamily,
  resolveSampleAddressForSymbol,
  sideAddressPoolIndex,
} from './listFieldCryptoSampleAddresses';
import {
  buildCurrencyTagPanelControls,
  buildCurrencyTagPanelsForAddress,
} from './listFieldCurrencyTagCustomize';
import {
  MAX_CURRENCY_ADDRESS_COUNT,
  MAX_CURRENCY_SIDE_ADDRESSES,
  currencyAddressTagsEnabledKey,
  parseCurrencyAddressCount,
} from './listFieldCurrencyShared';

const currencyAddressCountOptions = countSelectOptions(MAX_CURRENCY_ADDRESS_COUNT);

export function currencySideVisibleKey(prefix: 'from' | 'to'): string {
  return `${prefix}SideVisible`;
}

export function resolveCurrencySideVisible(
  prefix: 'from' | 'to',
  state: Record<string, unknown>,
): boolean {
  return state[currencySideVisibleKey(prefix)] !== false;
}

export function appendCurrencySideVisibilityProps(
  props: Record<string, unknown>,
  state: Record<string, unknown>,
): void {
  if (!resolveCurrencySideVisible('from', state)) {
    props['show-from'] = false;
  }
  if (!resolveCurrencySideVisible('to', state)) {
    props['show-to'] = false;
  }
}

function sidePanelVisible(prefix: 'from' | 'to') {
  return (state: Record<string, unknown>) => resolveCurrencySideVisible(prefix, state);
}

function resolveDefaultSideAddress(
  symbol: string,
  prefix: 'from' | 'to',
  itemIndex: number,
): string {
  return resolveSampleAddressForSymbol(symbol, sideAddressPoolIndex(prefix, itemIndex));
}

function sideAddressItemVisible(prefix: 'from' | 'to', index: number) {
  return (state: Record<string, unknown>) => {
    if (!resolveCurrencySideVisible(prefix, state)) return false;
    const count = parseCurrencyAddressCount(state[`${prefix}AddressCount`]);
    return index <= count;
  };
}

function addressTagsEnabledWhen(
  prefix: 'from' | 'to',
  addressIndex: number,
): (state: Record<string, unknown>) => boolean {
  return (state) => {
    if (!sideAddressItemVisible(prefix, addressIndex)(state)) return false;
    return state[currencyAddressTagsEnabledKey(prefix, addressIndex)] === true;
  };
}

function appendTagControlsForAddress(
  controls: DocCustomizeControl[],
  prefix: 'from' | 'to',
  addressIndex: number,
  state: Record<string, unknown>,
  startRow: number,
): number {
  let row = startRow;
  const tagsVisibleWhen = addressTagsEnabledWhen(prefix, addressIndex);

  for (const tagPanel of buildCurrencyTagPanelsForAddress(prefix, addressIndex)) {
    const tagControls = buildCurrencyTagPanelControls(tagPanel, state);

    controls.push({
      kind: 'heading',
      key: `${prefix}-address-${addressIndex}-${tagPanel.slot}-heading`,
      label: tagPanel.title,
      row,
      visibleWhen: tagsVisibleWhen,
    });

    for (const control of tagControls) {
      controls.push({
        ...control,
        row,
        visibleWhen: (customize) => {
          if (!tagsVisibleWhen(customize)) return false;
          return control.visibleWhen ? control.visibleWhen(customize) : true;
        },
      });
    }

    row += 1;
  }

  return row;
}

export function buildCurrencyAddressTagOnlyControls(
  prefix: 'from' | 'to',
  addressIndex: number,
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const controls: DocCustomizeControl[] = [
    {
      kind: 'boolean',
      key: currencyAddressTagsEnabledKey(prefix, addressIndex),
      label: showcaseText('Tag', '标签'),
      row: 0,
    },
  ];

  appendTagControlsForAddress(controls, prefix, addressIndex, state, 1);
  return controls;
}

export function buildCurrencySideAddressControls(
  prefix: 'from' | 'to',
  state: Record<string, unknown>,
): DocCustomizeControl[] {
  const controls: DocCustomizeControl[] = [
    {
      kind: 'boolean',
      key: currencySideVisibleKey(prefix),
      label:
        prefix === 'from'
          ? showcaseText('Show sender', '显示发送方')
          : showcaseText('Show recipient', '显示接收方'),
      row: 0,
    },
    {
      kind: 'select',
      key: `${prefix}AddressCount`,
      label: showcaseText('Number of addresses', '地址数'),
      options: currencyAddressCountOptions,
      row: 0,
      visibleWhen: sidePanelVisible(prefix),
    },
  ];

  let row = 1;

  for (let itemIndex = 1; itemIndex <= MAX_CURRENCY_SIDE_ADDRESSES; itemIndex += 1) {
    const visibleWhen = sideAddressItemVisible(prefix, itemIndex);

    controls.push(
      {
        kind: 'text',
        key: `${prefix}Address${itemIndex}`,
        label:
          itemIndex === 1
            ? showcaseText('Address', '地址')
            : showcaseText(`Address ${itemIndex}`, `地址 ${itemIndex}`),
        row,
        visibleWhen,
      },
      {
        kind: 'text',
        key: `${prefix}Alias${itemIndex}`,
        label:
          itemIndex === 1
            ? showcaseText('Address alias', '地址别名')
            : showcaseText(`Address alias ${itemIndex}`, `地址别名 ${itemIndex}`),
        row,
        visibleWhen,
      },
      {
        kind: 'boolean',
        key: currencyAddressTagsEnabledKey(prefix, itemIndex),
        label: showcaseText('Tag', '标签'),
        row,
        visibleWhen,
      },
    );
    row += 1;
    row = appendTagControlsForAddress(controls, prefix, itemIndex, state, row);
  }

  return controls;
}

export function currencySideAddressDefaults(
  prefix: 'from' | 'to',
  symbol = 'ZEC',
): Record<string, string | boolean> {
  const defaults: Record<string, string | boolean> = {
    [currencySideVisibleKey(prefix)]: true,
    [`${prefix}AddressCount`]: '1',
  };

  for (let index = 1; index <= MAX_CURRENCY_SIDE_ADDRESSES; index += 1) {
    defaults[`${prefix}Address${index}`] =
      index === 1 ? resolveDefaultSideAddress(symbol, prefix, index) : '';
    defaults[`${prefix}Alias${index}`] = '';
    defaults[currencyAddressTagsEnabledKey(prefix, index)] = index === 1;
  }

  return defaults;
}

export function syncCurrencyAddressesForSymbol(
  state: Record<string, unknown>,
  symbol: string,
): void {
  const family = resolveAddressFamily(symbol);

  for (const prefix of ['from', 'to'] as const) {
    const count = parseCurrencyAddressCount(state[`${prefix}AddressCount`]);

    for (let index = 1; index <= Math.min(count, MAX_CURRENCY_SIDE_ADDRESSES); index += 1) {
      const key = `${prefix}Address${index}`;
      const current = String(state[key] ?? '').trim();
      if (!current || !addressMatchesFamily(current, family)) {
        state[key] = resolveDefaultSideAddress(symbol, prefix, index);
      }
    }
  }
}

export type CurrencySideAddressData = {
  address: string;
  alias: string;
  count: number;
  addresses: string[];
};

export function buildCurrencySideAddressData(
  prefix: 'from' | 'to',
  state: Record<string, unknown>,
): CurrencySideAddressData {
  const symbol = String(state.symbol ?? 'ZEC');
  const count = parseCurrencyAddressCount(state[`${prefix}AddressCount`]);
  const rawAddresses: string[] = [];
  const rawAliases: string[] = [];

  for (let index = 1; index <= count; index += 1) {
    if (index <= MAX_CURRENCY_SIDE_ADDRESSES) {
      const address = String(state[`${prefix}Address${index}`] ?? '').trim();
      rawAddresses.push(
        address || resolveDefaultSideAddress(symbol, prefix, index),
      );
      rawAliases.push(String(state[`${prefix}Alias${index}`] ?? '').trim());
      continue;
    }

    rawAddresses.push(resolveDefaultSideAddress(symbol, prefix, index));
    rawAliases.push('');
  }

  const address = rawAddresses[0] ?? resolveDefaultSideAddress(symbol, prefix, 1);
  const alias = rawAliases[0] ?? '';
  const addresses = rawAddresses.map((item, index) => {
    const itemAlias = rawAliases[index];
    return itemAlias ? `${itemAlias} ${item}` : item;
  });

  return { address, alias, count, addresses };
}

export {
  currencyAddressTagsEnabledKey,
  parseCurrencyAddressCount,
} from './listFieldCurrencyShared';
