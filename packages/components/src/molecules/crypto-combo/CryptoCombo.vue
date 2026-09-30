<script setup lang="ts">
import { computed } from 'vue';
import { EgTag } from '../tag';
import EgListFieldOverflowText from '../list-field/ListFieldOverflowText.vue';
import type { CryptoName } from '../../atoms/crypto';
import CryptoAddress from './CryptoAddress.vue';
import CryptoAddressSide from './CryptoAddressSide.vue';
import type { CryptoAddressSideTags } from './cryptoAddressTypes';
import CryptoSymbol, { type CryptoSymbolEntryBadge } from './CryptoSymbol.vue';
import styles from './CryptoCombo.module.css';

export type CryptoComboNetworkStyle = 'none' | 'tag' | 'suffix';
export type CryptoComboLayoutStyle = 'suffix' | 'unsuffix';
export type CryptoComboContentType = 'address' | 'unaddress';
export type CryptoComboEntryBadge = CryptoSymbolEntryBadge;

const props = withDefaults(
  defineProps<{
    cryptoName: CryptoName;
    symbol: string;
    showChain?: boolean;
    chainLabel?: string;
    networkStyle?: CryptoComboNetworkStyle;
    layoutStyle?: CryptoComboLayoutStyle;
    entryBadge?: CryptoComboEntryBadge;
    contentType?: CryptoComboContentType;
    addressMode?: 'double' | 'single';
    fromAddress?: string;
    fromAlias?: string;
    toAddress?: string;
    toAlias?: string;
    fromAddressCount?: number;
    toAddressCount?: number;
    fromAddresses?: string[];
    toAddresses?: string[];
    minWidth?: number;
    fromTags?: CryptoAddressSideTags;
    toTags?: CryptoAddressSideTags;
    fromTagsList?: CryptoAddressSideTags[];
    toTagsList?: CryptoAddressSideTags[];
    addressTooltipTrigger?: 'hover' | 'focus';
    showFrom?: boolean;
    showTo?: boolean;
  }>(),
  {
    showChain: true,
    chainLabel: 'Base',
    networkStyle: 'tag',
    layoutStyle: 'unsuffix',
    entryBadge: 'none',
    contentType: 'address',
    addressMode: 'double',
    fromAddress: '0x55e8...d31c38',
    toAddress: '0x8de1...e1fe01',
    fromAddressCount: 1,
    toAddressCount: 1,
    addressTooltipTrigger: 'hover',
    showFrom: true,
    showTo: true,
  },
);

const resolvedEntryBadge = computed((): CryptoComboEntryBadge => {
  if (props.entryBadge !== 'none') return props.entryBadge;
  return props.layoutStyle === 'suffix' ? 'in' : 'none';
});

const resolvedLayoutStyle = computed((): CryptoComboLayoutStyle =>
  resolvedEntryBadge.value !== 'none' ? 'suffix' : 'unsuffix',
);

const showNetworkTag = computed(
  () => props.showChain && props.networkStyle === 'tag',
);

const showNetworkSuffix = computed(
  () => props.showChain && props.networkStyle === 'suffix',
);

const bodyClass = computed(() => [
  styles.body,
  resolvedLayoutStyle.value === 'suffix' && props.contentType === 'address'
    ? styles.bodySized
    : styles.bodyFlex,
]);

const bodyStyle = computed(() => {
  const width = props.minWidth ?? 0;
  if (width <= 0) return undefined;
  if (resolvedLayoutStyle.value === 'suffix' && props.contentType === 'address') {
    return { width: `${width}px`, minWidth: `${width}px` };
  }
  return { minWidth: `${width}px` };
});
</script>

<template>
  <span :class="styles.root">
    <span :class="bodyClass" :style="bodyStyle">
      <span :class="styles.titleRow">
        <span :class="styles.titleSymbolGroup">
          <CryptoSymbol
            :name="cryptoName"
            :label="symbol"
            :entry-badge="resolvedEntryBadge"
            icon-size="md"
          />
          <span :class="styles.symbolTextWrap">
            <EgListFieldOverflowText
              :text="symbol"
              variant="primary"
              :tooltip-trigger="addressTooltipTrigger"
            />
          </span>
        </span>
        <span v-if="showNetworkTag" :class="styles.networkTag">
          <EgTag
            family="system"
            system-type="stroke-subtle"
            size="sm"
            truncate
          >
            {{ chainLabel }}
          </EgTag>
        </span>
        <span v-else-if="showNetworkSuffix" :class="styles.networkSuffix">
          -{{ chainLabel }}
        </span>
      </span>

      <CryptoAddress
        v-if="contentType === 'address' && addressMode === 'double'"
        :from-text="fromAddress"
        :from-alias="fromAlias"
        :to-text="toAddress"
        :to-alias="toAlias"
        :from-address-count="fromAddressCount"
        :to-address-count="toAddressCount"
        :from-addresses="fromAddresses"
        :to-addresses="toAddresses"
        :from-tags="fromTags"
        :to-tags="toTags"
        :from-tags-list="fromTagsList"
        :to-tags-list="toTagsList"
        :show-from="showFrom"
        :show-to="showTo"
        address-mode="double"
        :min-width="minWidth"
        :address-tooltip-trigger="addressTooltipTrigger"
      />

      <span
        v-else-if="contentType === 'address'"
        :class="[styles.cryptoAddress, styles.cryptoAddressSingle]"
      >
        <CryptoAddressSide
          :address="fromAddress"
          :alias="fromAlias"
          :address-count="fromAddressCount"
          :addresses="fromAddresses"
          :tags="fromTags"
          :address-tags="fromTagsList"
          address-mode="single"
          :min-width="minWidth"
          :tooltip-trigger="addressTooltipTrigger"
        />
      </span>
    </span>
  </span>
</template>
