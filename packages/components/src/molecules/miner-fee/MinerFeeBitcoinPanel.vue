<script setup lang="ts">
import { ref } from 'vue';
import { provideMinerFeeTranslate, type MinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeConfirmPayload } from './minerFeeTypes';
import MinerFeeEvmPopoverPanel from './MinerFeeEvmPopoverPanel.vue';

const props = withDefaults(
  defineProps<{
    translate: MinerFeeTranslate;
    hideInlineConfirm?: boolean;
    /** 多笔：>1 时在内容与底部确定之间展示预计总矿工费。 */
    transactionCount?: number;
    preferBatchTotalSummary?: boolean;
  }>(),
  {
    hideInlineConfirm: false,
    transactionCount: 1,
    preferBatchTotalSummary: false,
  },
);

const emit = defineEmits<{
  'miner-fee-screen-change': [screen: 'list' | 'custom'];
  confirm: [selection: MinerFeeConfirmPayload];
}>();

const panelRef = ref<InstanceType<typeof MinerFeeEvmPopoverPanel> | null>(null);

provideMinerFeeTranslate(props.translate);

defineExpose({
  resetMinerFeeFlow: () => panelRef.value?.resetMinerFeeFlow(),
  attemptConfirm: () => panelRef.value?.attemptConfirm(),
  attemptCancelCustom: () => panelRef.value?.attemptCancelCustom(),
  attemptSaveCustom: () => panelRef.value?.attemptSaveCustom(),
  confirmDisabled: panelRef.value?.confirmDisabled,
  minerFeeScreen: panelRef.value?.minerFeeScreen,
});
</script>

<template>
  <MinerFeeEvmPopoverPanel
    ref="panelRef"
    symbol="BTC"
    :hide-inline-confirm="hideInlineConfirm"
    :transaction-count="transactionCount"
    :prefer-batch-total-summary="preferBatchTotalSummary"
    @miner-fee-screen-change="emit('miner-fee-screen-change', $event)"
    @confirm="emit('confirm', $event)"
  />
</template>
