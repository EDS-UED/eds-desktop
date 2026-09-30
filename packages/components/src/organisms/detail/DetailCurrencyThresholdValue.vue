<script setup lang="ts">
import { EgCrypto, type CryptoName } from '../../atoms/crypto';
import { EgDivider } from '../../atoms/divider';
import { EgTag } from '../../molecules/tag';
import styles from './DetailCurrencyThresholdValue.module.css';

defineProps<{
  cryptoName: CryptoName;
  symbol: string;
  networkLabel?: string;
  thresholdLabel: string;
}>();
</script>

<template>
  <div :class="styles.row">
    <span :class="styles.crypto">
      <EgCrypto
        :name="cryptoName"
        fit
      />
    </span>
    <span :class="styles.symbol">{{ symbol }}</span>
    <EgTag
      v-if="networkLabel"
      family="system"
      system-type="stroke-subtle"
      size="sm"
    >
      {{ networkLabel }}
    </EgTag>
    <EgDivider
      type="navigator"
      direction="vertical"
      :class="styles.divider"
    />
    <span :class="styles.threshold">{{ thresholdLabel }}</span>
  </div>
</template>
