<script setup lang="ts">
import { EgCryptoAddress } from '../crypto-combo';
import type { CryptoAddressSideTags } from '../crypto-combo/cryptoAddressTypes';

withDefaults(
  defineProps<{
    fromText?: string;
    toText?: string;
    fromTags?: CryptoAddressSideTags;
    toTags?: CryptoAddressSideTags;
    addressTooltipTrigger?: 'hover' | 'focus';
    disabled?: boolean;
  }>(),
  {
    addressTooltipTrigger: 'hover',
    disabled: false,
  },
);
</script>

<template>
  <EgCryptoAddress
    address-mode="double"
    :from-text="fromText"
    :to-text="toText"
    :from-tags="fromTags"
    :to-tags="toTags"
    :address-tooltip-trigger="addressTooltipTrigger"
    :class="{ 'eds-disabled': disabled }"
  />
</template>
