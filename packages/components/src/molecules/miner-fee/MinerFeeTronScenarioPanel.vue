<script setup lang="ts">
import { ref } from 'vue';
import { provideMinerFeeTranslate, type MinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeConfirmPayload } from './minerFeeTypes';
import type { TronMinerFeeQuote } from './minerFeeTronDisplay';
import MinerFeeTronPanel from './MinerFeeTronPanel.vue';

const props = withDefaults(
  defineProps<{
    translate: MinerFeeTranslate;
    hideInlineConfirm?: boolean;
    /** 多笔：>1 时在内容与底部确定之间展示预计总矿工费。 */
    transactionCount?: number;
    tronQuote?: TronMinerFeeQuote;
  }>(),
  {
    hideInlineConfirm: false,
    transactionCount: 1,
  },
);

const emit = defineEmits<{
  confirm: [selection: MinerFeeConfirmPayload];
}>();

const panelRef = ref<InstanceType<typeof MinerFeeTronPanel> | null>(null);

provideMinerFeeTranslate(props.translate);

defineExpose({
  attemptConfirm: () => panelRef.value?.attemptConfirm(),
  confirmDisabled: panelRef.value?.confirmDisabled,
});
</script>

<template>
  <MinerFeeTronPanel
    ref="panelRef"
    :hide-inline-confirm="hideInlineConfirm"
    :transaction-count="transactionCount"
    :tron-quote="tronQuote"
    @confirm="emit('confirm', $event)"
  />
</template>
