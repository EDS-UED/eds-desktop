import type { ShowcaseI18nRegistry } from '@/data/i18n/types';
import { parseSceneAddressSelectionMode, sceneAddressItemKey } from './flotationBoxSceneAddressCustomize';

export type SceneAddressFilterTab = {
  id: string;
  label: string;
  icon: string;
};

type SceneAddressDropdownRowDef = {
  id: string;
  address: string;
  alias?: string;
  trailingLabelKey?: string;
};

export type SceneAddressDropdownRow = {
  id: string;
  address: string;
  alias?: string;
  trailingLabel?: string;
  disabled?: boolean;
  focused?: boolean;
  checked?: boolean;
};

const SCENE_ADDRESS_FILTER_TAB_DEFS = [
  { id: 'address-book', labelKey: 'demo:scene-address-tab-address-book', icon: 'eds-address-books' },
  { id: 'internal', labelKey: 'demo:scene-address-tab-internal', icon: 'eds-team' },
  { id: 'recent', labelKey: 'demo:scene-address-tab-recent', icon: 'eds-clocks' },
] as const;

const SCENE_ADDRESS_FILTER_TAB_FALLBACKS: Record<(typeof SCENE_ADDRESS_FILTER_TAB_DEFS)[number]['id'], string> = {
  'address-book': '地址簿',
  internal: '内部地址',
  recent: '最近交易',
};

export function getSceneAddressFilterTabs(i18n: ShowcaseI18nRegistry): SceneAddressFilterTab[] {
  return SCENE_ADDRESS_FILTER_TAB_DEFS.map((tab) => ({
    id: tab.id,
    icon: tab.icon,
    label: i18n.name(tab.labelKey, SCENE_ADDRESS_FILTER_TAB_FALLBACKS[tab.id]),
  }));
}

/** 演示地址行（对齐 Figma 场景化-下拉地址）。 */
export const SCENE_ADDRESS_DROPDOWN_ROWS: SceneAddressDropdownRowDef[] = [
  {
    id: 'row-1',
    address: '0xc8c557506a5240dcec094e614c665ff9ca815b95',
    trailingLabelKey: 'demo:scene-address-internal-label',
  },
  {
    id: 'row-2',
    address: '0xcd531ae9efcce479654c4926dec5f6209531ca7b',
  },
  {
    id: 'row-3',
    address: '0x3362c6a98211c167856bcadaff166c8d078fd76d',
    alias: 'Coinbase.',
  },
  {
    id: 'row-4',
    address: '0xa9d1e8f6900963c095ff6dd6538749d31c38e1fe01',
    alias: 'Mr. Wang',
    trailingLabelKey: 'demo:scene-address-internal-label',
  },
  {
    id: 'row-5',
    address: '0x3362c6a98211c167856bcadaff166c8d078fd76d',
  },
  {
    id: 'row-6',
    address: '0xcd531ae9efcce479654c4926dec5f6209531ca7b',
  },
  {
    id: 'row-7',
    address: '0xc8c557506a5240dcec094e614c665ff9ca815b95',
  },
  {
    id: 'row-8',
    address: '0x3362c6a98211c167856bcadaff166c8d078fd76d',
  },
  {
    id: 'row-9',
    address: '0xcd531ae9efcce479654c4926dec5f6209531ca7b',
  },
];

export const flotationSceneAddressDropdownItemCount = SCENE_ADDRESS_DROPDOWN_ROWS.length;

export function getSceneAddressDropdownRows(
  count: number,
  state: Record<string, unknown>,
  i18n?: ShowcaseI18nRegistry,
): SceneAddressDropdownRow[] {
  const safe = Math.min(20, Math.max(1, Math.floor(count)));
  const selectionMode = parseSceneAddressSelectionMode(state);
  const isMultiple = selectionMode === 'multiple';

  return Array.from({ length: safe }, (_, index) => {
    const n = index + 1;
    const demoRow = SCENE_ADDRESS_DROPDOWN_ROWS[index];
    const labelOverride = state[sceneAddressItemKey('Label', n)];
    const address =
      labelOverride != null && String(labelOverride).trim() !== ''
        ? String(labelOverride)
        : (demoRow?.address ?? `Label ${n}`);
    const aliasOverride = state[sceneAddressItemKey('Alias', n)];
    const alias =
      aliasOverride != null
        ? String(aliasOverride).trim() || undefined
        : demoRow?.alias;
    const isSelected = Boolean(state[sceneAddressItemKey('Checked', n)]);

    return {
      id: demoRow?.id ?? `row-${n}`,
      address,
      alias,
      trailingLabel: demoRow?.trailingLabelKey
        ? i18n?.name(demoRow.trailingLabelKey, 'Internal address')
        : undefined,
      disabled: Boolean(state[sceneAddressItemKey('Disabled', n)]),
      focused: isMultiple
        ? Boolean(state[sceneAddressItemKey('Focused', n)])
        : isSelected,
      checked: isMultiple ? isSelected : false,
    };
  });
}
