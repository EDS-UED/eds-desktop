<script setup lang="ts">
import { EgComboPopupButton } from '../combo';
import { computed } from 'vue';
import { useMinerFeeTranslate } from './minerFeeTranslate';
import {
  buildTonLikeMinerFeeDisplay,
  resolveTonLikeMinerFeeQuote,
} from './minerFeeTonLikeDisplay';
import MinerFeeBatchAppendix from './MinerFeeBatchAppendix.vue';
import { buildTonLikeMinerFeeBatchTotalDisplay } from './minerFeeBatchTotalDisplay';
import type { MinerFeeConfirmPayload } from './minerFeeTypes';
import styles from './MinerFeePopoverPanel.module.css';

const props = withDefaults(
  defineProps<{
    symbol?: string;
    hideInlineConfirm?: boolean;
    /** 多笔：>1 时在内容与底部确定之间展示预计总矿工费。 */
    transactionCount?: number;
  }>(),
  {
    symbol: 'TON',
    hideInlineConfirm: false,
    transactionCount: 1,
  },
);

const emit = defineEmits<{
  confirm: [selection: MinerFeeConfirmPayload];
}>();

const ui = useMinerFeeTranslate();

const feeQuote = computed(() => resolveTonLikeMinerFeeQuote(props.symbol));

const primaryLine = computed(() => {
  const ticker = props.symbol.trim().toUpperCase() || '—';
  return `${feeQuote.value.cryptoAmount} ${ticker}`;
});

const usdApproxLine = computed(() => `≈ ${feeQuote.value.usdApprox}`);

const batchTotalDisplay = computed(() =>
  buildTonLikeMinerFeeBatchTotalDisplay(props.symbol, props.transactionCount),
);

function onConfirm() {
  emit('confirm', {
    displayValue: buildTonLikeMinerFeeDisplay(props.symbol, feeQuote.value),
  });
}

defineExpose({
  attemptConfirm: onConfirm,
  confirmDisabled: computed(() => false),
});
</script>

<template>
  <div :class="styles.minerFeeListPage" data-miner-fee-ton-like>
    <div :class="styles.minerFeeRoot" data-miner-fee-screen="list">
      <section :class="styles.minerFee">
        <div :class="styles.minerFeeFixedQuote">
          <p :class="styles.minerFeeFixedQuoteLabel">{{ primaryLine }}</p>
          <p :class="styles.minerFeeFixedQuoteUsd">{{ usdApproxLine }}</p>
        </div>

        <MinerFeeBatchAppendix
          :symbol="symbol"
          profile-kind="ton-xrp"
          :transaction-count="transactionCount"
          :batch-total-display="batchTotalDisplay"
        />
      </section>
    </div>

    <div v-if="!hideInlineConfirm" :class="styles.minerFeeFooter">
      <EgComboPopupButton
        tone="decor"
        :count="1"
        :confirm-label="ui('Confirm')"
        @confirm="onConfirm"
      />
    </div>
  </div>
</template>
