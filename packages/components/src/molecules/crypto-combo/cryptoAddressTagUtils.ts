import type { CryptoAddressTagSlotConfig } from './cryptoAddressTypes';

export const CRYPTO_ADDRESS_INLINE_TAG_LIMIT = 1;

export function parseMoreTagHiddenCount(
  label: string | undefined,
  explicit?: number,
): number {
  if (explicit != null && Number.isFinite(explicit) && explicit > 0) {
    return Math.floor(explicit);
  }

  const match = String(label ?? '')
    .trim()
    .match(/^\+(\d+)$|^(\d+)\+$/);
  if (!match) return 0;
  return Math.floor(Number(match[1] ?? match[2]));
}

export function formatMoreTagLabel(hiddenCount: number): string {
  if (hiddenCount <= 0) return '+99';
  if (hiddenCount > 99) return '+99';
  return `+${hiddenCount}`;
}

export function normalizeTagList(
  tags?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
): CryptoAddressTagSlotConfig[] {
  if (!tags) return [];
  const list = Array.isArray(tags) ? tags : [tags];
  return list.filter((tag) => tag.show !== false);
}

/** 系统 Tag 优先，其后为自定义 Tag。 */
export function flattenAddressTags(
  system?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
  custom?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
): CryptoAddressTagSlotConfig[] {
  return [...normalizeTagList(system), ...normalizeTagList(custom)];
}

export function splitTagsForDisplay(
  system?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
  custom?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
  inlineLimit = CRYPTO_ADDRESS_INLINE_TAG_LIMIT,
): {
  inline: CryptoAddressTagSlotConfig[];
  hidden: CryptoAddressTagSlotConfig[];
} {
  const all = flattenAddressTags(system, custom);
  return {
    inline: all.slice(0, inlineLimit),
    hidden: all.slice(inlineLimit),
  };
}

export function hasAddressTags(
  system?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
  custom?: CryptoAddressTagSlotConfig | CryptoAddressTagSlotConfig[],
): boolean {
  return flattenAddressTags(system, custom).length > 0;
}
