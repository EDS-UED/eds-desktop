<script setup lang="ts">
import { computed } from 'vue';
import { EgCrypto } from '@eds/desktop-components';
import { resolveCryptoNameFromSymbol } from './listFieldCryptoResolve';
import styles from './listFieldScene.module.css';

const props = defineProps<{
  customize: Record<string, unknown>;
}>();

const showCryptoIcon = computed(() => props.customize.showCryptoIcon !== false);
const isSingleLine = computed(
  () => String(props.customize.lineLayout ?? 'single') === 'single',
);
const cryptoSymbol = computed(() => String(props.customize.cryptoSymbol ?? 'BTC'));
const cryptoName = computed(
  () => resolveCryptoNameFromSymbol(cryptoSymbol.value) ?? 'eds-btc-bitcoin',
);
</script>

<template>
  <span
    v-if="showCryptoIcon"
    :class="[
      styles.cryptoInlineIcon,
      isSingleLine ? styles.cryptoInlineIconXl : styles.cryptoInlineIconLg,
    ]"
  >
    <EgCrypto :name="cryptoName" fit :label="cryptoSymbol" />
  </span>
</template>
