<script setup lang="ts">
import { computed } from 'vue';
import { EgCrypto, type CryptoName } from '../../atoms/crypto';
import CryptoItem from './CryptoItem.vue';
import styles from './CryptoCombo.module.css';

export type CryptoSymbolEntryBadge = 'none' | 'in' | 'out';

const props = withDefaults(
  defineProps<{
    name: CryptoName;
    label?: string;
    /** Figma subscript=Yes → 36×32 + entry badge */
    entryBadge?: CryptoSymbolEntryBadge;
    /** contentType=unaddress（仅币种）→ --icon-xl；其余保持 --avatar-md */
    iconSize?: 'md' | 'xl';
  }>(),
  {
    entryBadge: 'none',
    iconSize: 'md',
  },
);

const rootClass = computed(() => [
  styles.cryptoSymbol,
  props.iconSize === 'xl' && styles.cryptoSymbolXl,
  props.entryBadge !== 'none'
    ? styles.cryptoSymbolWithBadge
    : styles.cryptoSymbolPlain,
]);
</script>

<template>
  <span :class="rootClass">
    <EgCrypto :name="name" :label="label" fit :class="styles.cryptoSymbolIcon" />
    <CryptoItem
      v-if="entryBadge !== 'none'"
      :type="entryBadge === 'out' ? 'out' : 'in'"
      :class="styles.cryptoSymbolBadge"
    />
  </span>
</template>
