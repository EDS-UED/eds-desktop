<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { useScrollChromeScrim } from '../../composables/useScrollChromeScrim';
import { EgComboPopupButton } from '../combo';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../icon-button';
import { useMinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeCustomDraft, MinerFeeCustomSaved } from './minerFeeCustomTypes';
import MinerFeeSpeedOptionsGroup, {
  type MinerFeeOptionId,
} from './MinerFeeSpeedOptionsGroup.vue';
import customStyles from './MinerFeeCustomPanel.module.css';
import styles from './MinerFeePopoverPanel.module.css';

export type { MinerFeeOptionId };

const props = withDefaults(
  defineProps<{
    minerFee: MinerFeeOptionId | null;
    customFeeSaved: MinerFeeCustomSaved | null;
    confirmDisabled: boolean;
    symbol?: string;
    measureOnly?: boolean;
    hideInlineConfirm?: boolean;
    customViaAnchoredPopover?: boolean;
    customDraft?: MinerFeeCustomDraft;
    customPopoverBoundary?: string;
    /** 多笔：>1 时在内容与底部确定之间展示预计总矿工费。 */
    transactionCount?: number;
    preferBatchTotalSummary?: boolean;
    /** EVM：从地址支付档位返回支付方式步（独立列表页，非内嵌地址卡片）。 */
    showPaymentBack?: boolean;
  }>(),
  {
    symbol: 'ETH',
    hideInlineConfirm: false,
    customViaAnchoredPopover: false,
    customPopoverBoundary: '.eds-popup',
    transactionCount: 1,
    preferBatchTotalSummary: false,
    showPaymentBack: false,
  },
);

const emit = defineEmits<{
  'select-miner-fee': [optionId: MinerFeeOptionId];
  'open-custom': [];
  'save-custom': [draft: MinerFeeCustomDraft];
  'custom-popover-open': [];
  'custom-popover-dismiss': [];
  confirm: [];
  'back-to-payment': [];
}>();

const ui = useMinerFeeTranslate();

const rootRef = ref<HTMLElement | null>(null);
const scrollRef = ref<HTMLElement | null>(null);
const { canScroll, topScrim, bottomScrim } = useScrollChromeScrim(scrollRef);
const topToolHost = ref<HTMLElement | null>(null);

function resolveTopToolHost() {
  const root = rootRef.value;
  if (!root) {
    topToolHost.value = null;
    return;
  }

  topToolHost.value =
    (root
      .closest('.eds-popover-content')
      ?.querySelector('[class*="topTool"]') as HTMLElement | null)
    ?? (root
      .closest('[data-batch-popup-top-tool-host]')
      ?.querySelector('[data-batch-popup-top-tool-slot]') as HTMLElement | null)
    ?? null;
}

onMounted(async () => {
  if (props.measureOnly || !props.showPaymentBack) {
    return;
  }
  await nextTick();
  resolveTopToolHost();
  if (!topToolHost.value) {
    requestAnimationFrame(resolveTopToolHost);
  }
});

onBeforeUnmount(() => {
  topToolHost.value = null;
});

defineExpose({
  getMeasureEl: () => rootRef.value,
});
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      styles.minerFeeListPage,
      styles.minerFeeListPageScrollChrome,
      hideInlineConfirm && styles.minerFeeListPagePopupToolbar,
    ]"
    :data-miner-fee-evm-payment-list="showPaymentBack && !measureOnly ? true : undefined"
  >
    <Teleport v-if="showPaymentBack && !measureOnly && topToolHost" :to="topToolHost">
      <div :class="customStyles.customTopTool">
        <EgIconButton
          shape="square"
          size="sm"
          :label="ui('Back')"
          @click="emit('back-to-payment')"
        >
          <EgIcon name="eds-arrow-left-mini-ios" fit />
        </EgIconButton>
        <span :class="customStyles.customTopToolTitle">
          {{ ui('Miner fee evm payment address title') }}
        </span>
      </div>
    </Teleport>

    <EgDivider
      v-if="canScroll && !measureOnly"
      type="module"
      direction="horizontal"
      :class="styles.minerFeeScrollTopDivider"
      :hide="!topScrim"
    />
    <div
      ref="scrollRef"
      :class="styles.minerFeeRoot"
      data-miner-fee-screen="list"
      data-miner-fee-scroll-region
    >
      <section :class="styles.minerFee">
        <MinerFeeSpeedOptionsGroup
          :miner-fee="minerFee"
          :custom-fee-saved="customFeeSaved"
          :symbol="symbol"
          :measure-only="measureOnly"
          :custom-via-anchored-popover="customViaAnchoredPopover"
          :custom-draft="customDraft"
          :custom-popover-boundary="customPopoverBoundary"
          :transaction-count="transactionCount"
          :prefer-batch-total-summary="preferBatchTotalSummary"
          @select-miner-fee="emit('select-miner-fee', $event)"
          @open-custom="emit('open-custom')"
          @save-custom="emit('save-custom', $event)"
          @custom-popover-open="emit('custom-popover-open')"
          @custom-popover-dismiss="emit('custom-popover-dismiss')"
        />
      </section>
    </div>

    <div v-if="!hideInlineConfirm" :class="styles.minerFeeFooter">
      <EgDivider
        v-if="canScroll && !measureOnly"
        type="module"
        direction="horizontal"
        :class="styles.minerFeeScrollBottomDivider"
        :hide="!bottomScrim"
      />
      <EgComboPopupButton
        tone="decor"
        :count="1"
        :confirm-label="ui('Confirm')"
        :confirm-disabled="confirmDisabled"
        @confirm="emit('confirm')"
      />
    </div>
  </div>
</template>
