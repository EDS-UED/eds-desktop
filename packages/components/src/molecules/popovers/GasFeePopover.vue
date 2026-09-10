<script setup lang="ts">
import { computed, ref, type Component } from 'vue';
import type { TooltipAlign, TooltipPlacement } from '../tooltip';
import EgMinerFeeBitcoinPanel from '../miner-fee/MinerFeeBitcoinPanel.vue';
import EgMinerFeeEthereumPanel from '../miner-fee/MinerFeeEthereumPanel.vue';
import EgMinerFeeTonPanel from '../miner-fee/MinerFeeTonPanel.vue';
import EgMinerFeeTronPanel from '../miner-fee/MinerFeeTronScenarioPanel.vue';
import type { MinerFeeTranslate } from '../miner-fee/minerFeeTranslate';
import type { MinerFeeConfirmPayload } from '../miner-fee/minerFeeTypes';
import EgAnchoredPopover from './AnchoredPopover.vue';
import { POPOVER_PRESET_WIDTH_BASE } from './popoverShape';
import type { PopoverHeightMode, PopoverWidthMode } from './Popover.vue';

export type GasFeeNetwork = 'bitcoin' | 'ethereum' | 'ton' | 'tron';

const PANEL_BY_NETWORK: Record<GasFeeNetwork, Component> = {
  bitcoin: EgMinerFeeBitcoinPanel,
  ethereum: EgMinerFeeEthereumPanel,
  ton: EgMinerFeeTonPanel,
  tron: EgMinerFeeTronPanel,
};

const props = withDefaults(
  defineProps<{
    network?: GasFeeNetwork;
    translate: MinerFeeTranslate;
    symbol?: string;
    transactionCount?: number;
    preferBatchTotalSummary?: boolean;
    title?: string;
    placement?: TooltipPlacement;
    align?: TooltipAlign;
    boundarySelector?: string;
    teleportTo?: string | HTMLElement;
    onBeforeOpen?: () => void | Promise<void>;
    widthMode?: PopoverWidthMode;
    width?: number;
    maxWidth?: number;
    heightMode?: PopoverHeightMode;
    height?: number;
    maxHeight?: number;
    topToolClosable?: boolean;
  }>(),
  {
    network: 'ethereum',
    transactionCount: 1,
    preferBatchTotalSummary: false,
    title: 'Gas Fee',
    placement: 'top',
    align: 'center',
    boundarySelector: '.eds-popup',
    teleportTo: '.app-preview',
    widthMode: 'fixed',
    width: POPOVER_PRESET_WIDTH_BASE,
    heightMode: 'adaptive',
    topToolClosable: true,
  },
);

const emit = defineEmits<{
  confirm: [selection: MinerFeeConfirmPayload];
  dismiss: [];
}>();

const panelComponent = computed(() => PANEL_BY_NETWORK[props.network] ?? EgMinerFeeEthereumPanel);

const panelProps = computed(() => {
  const base = {
    translate: props.translate,
    transactionCount: props.transactionCount,
    preferBatchTotalSummary: props.preferBatchTotalSummary,
  };
  return props.symbol ? { ...base, symbol: props.symbol } : base;
});

const anchorRef = ref<{ close: () => void; open: () => void } | null>(null);

defineExpose({
  close: () => anchorRef.value?.close(),
  open: () => anchorRef.value?.open(),
});
</script>

<template>
  <EgAnchoredPopover
    ref="anchorRef"
    :boundary-selector="boundarySelector"
    :teleport-to="teleportTo"
    :placement="placement"
    :align="align"
    :width-mode="widthMode"
    :width="width"
    :max-width="maxWidth"
    :height-mode="heightMode"
    :height="height"
    :max-height="maxHeight"
    top-tool
    :top-tool-title="title"
    :top-tool-closable="topToolClosable"
    :on-before-open="onBeforeOpen"
    @dismiss="emit('dismiss')"
  >
    <template #trigger="triggerSlot">
      <slot name="trigger" v-bind="triggerSlot" />
    </template>
    <template #default>
      <component
        :is="panelComponent"
        v-bind="panelProps"
        @confirm="emit('confirm', $event)"
      />
    </template>
  </EgAnchoredPopover>
</template>
