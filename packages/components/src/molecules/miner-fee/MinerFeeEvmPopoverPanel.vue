<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { EgMotionLayoutContent } from '../../atoms/motion-layout-content';
import { useMotionLayoutDeformPageSwitch, type MotionLayoutDeformPageSpec } from '../../atoms/motion-layout-deform';
import { useMinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeConfirmPayload } from './minerFeeTypes';
import { buildEvmMinerFeeDisplay } from './minerFeeEvmDisplay';
import MinerFeeCustomPanel from './MinerFeeCustomPanel.vue';
import MinerFeeEvmPaymentPanel from './MinerFeeEvmPaymentPanel.vue';
import MinerFeeListPanel, { type MinerFeeOptionId } from './MinerFeeListPanel.vue';
import {
  buildEvmSponsoredMinerFeeDisplay,
  type EvmMinerFeePaymentDemoQuote,
  type EvmMinerFeePaymentSelection,
} from './minerFeeEvmPayment';
import {
  buildMinerFeeCustomPreview,
  defaultMinerFeeCustomDraft,
  type MinerFeeCustomDraft,
  type MinerFeeCustomMode,
  type MinerFeeCustomSaved,
} from './minerFeeCustomTypes';
import { resolveMinerFeeEvmShellVariant } from './minerFeeEvmShellVariant';
import styles from './MinerFeePopoverPanel.module.css';

const MINER_FEE_CUSTOM_ID = 'custom' as const;

type MinerFeeScreen = 'payment' | 'list' | 'custom';

const props = withDefaults(
  defineProps<{
    symbol?: string;
    hideInlineConfirm?: boolean;
    /** 多笔：>1 时在内容与底部确定之间展示预计总矿工费。 */
    transactionCount?: number;
    preferBatchTotalSummary?: boolean;
    evmPaymentQuote?: EvmMinerFeePaymentDemoQuote;
    /** false：无矿工费代付权限，直接进入 EVM 档位列表（旧交互）。 */
    evmSponsoredPaymentEnabled?: boolean;
  }>(),
  {
    symbol: 'ETH',
    hideInlineConfirm: false,
    transactionCount: 1,
    preferBatchTotalSummary: false,
    evmSponsoredPaymentEnabled: true,
  },
);

const emit = defineEmits<{
  'miner-fee-screen-change': [screen: MinerFeeScreen];
  confirm: [selection: MinerFeeConfirmPayload];
}>();

const ui = useMinerFeeTranslate();

const DEFAULT_MINER_FEE_SPEED: MinerFeeOptionId = 'normal';

const listPanelRef = ref<InstanceType<typeof MinerFeeListPanel> | null>(null);
const listMeasurePanelRef = ref<InstanceType<typeof MinerFeeListPanel> | null>(null);
const customMeasurePanelRef = ref<InstanceType<typeof MinerFeeCustomPanel> | null>(null);
const customPanelRef = ref<InstanceType<typeof MinerFeeCustomPanel> | null>(null);
const paymentPanelRef = ref<InstanceType<typeof MinerFeeEvmPaymentPanel> | null>(null);
const paymentMeasurePanelRef = ref<InstanceType<typeof MinerFeeEvmPaymentPanel> | null>(null);
const paymentAddressMeasurePanelRef = ref<InstanceType<typeof MinerFeeEvmPaymentPanel> | null>(
  null,
);
const paymentNoneMeasurePanelRef = ref<InstanceType<typeof MinerFeeEvmPaymentPanel> | null>(null);
const shellVariant = computed(() => resolveMinerFeeEvmShellVariant(props.symbol));
const useEvmPaymentFlow = computed(() => shellVariant.value === 'eth');
const useEvmPaymentStep = computed(
  () => useEvmPaymentFlow.value && props.evmSponsoredPaymentEnabled,
);

const minerFee = ref<MinerFeeOptionId | null>(DEFAULT_MINER_FEE_SPEED);
const evmPaymentMethod = ref<EvmMinerFeePaymentSelection>('sponsored');
const minerFeeBeforeCustomPopover = ref<MinerFeeOptionId | null>(null);
const customFeeDraft = ref<MinerFeeCustomDraft>(
  defaultMinerFeeCustomDraft(shellVariant.value),
);
const customFeeSaved = ref<MinerFeeCustomSaved | null>(null);

/** 自定义页 tab（高级/正常）字段数不同，预测量须跟随当前 tab。 */
const customLiveMode = ref<MinerFeeCustomMode>(customFeeDraft.value.mode);

const customMeasureDraft = computed<MinerFeeCustomDraft>(() => ({
  ...customFeeDraft.value,
  mode: customLiveMode.value,
}));

const pageSpecs = reactive<Record<MinerFeeScreen, MotionLayoutDeformPageSpec>>({
  payment: { shellHeight: 360 },
  list: { shellHeight: 320 },
  custom: { shellHeight: 360 },
});

const initialMinerFeeScreen = (): MinerFeeScreen =>
  useEvmPaymentStep.value ? 'payment' : 'list';

const {
  activePage,
  shellHeight,
  contentExiting,
  contentEntering,
  switchTo,
  whenIdle,
} = useMotionLayoutDeformPageSwitch<MinerFeeScreen>(pageSpecs, initialMinerFeeScreen());

const minerFeeConfirmDisabled = computed(() => {
  if (useEvmPaymentStep.value && activePage.value === 'payment') {
    if (evmPaymentMethod.value === null) {
      return true;
    }
    if (evmPaymentMethod.value === 'address') {
      return minerFee.value === null;
    }
    return false;
  }
  return minerFee.value === null;
});
const isMinerFeeCustomPage = computed(() => activePage.value === 'custom');
const isMinerFeePaymentPage = computed(() => activePage.value === 'payment');
/** 首次测量完成前禁用 shell height transition，避免 Popover 打开时从占位高度弹跳。 */
const shellMeasureReady = ref(false);
/** 始终写像素 height 才能 morph；maxHeight 下由 flex shrink 收顶，中间区滚动。 */
const deformShellStyle = computed(() => {
  if (
    props.hideInlineConfirm
    && (activePage.value === 'list' || activePage.value === 'payment')
  ) {
    return undefined;
  }
  return { height: `${shellHeight.value}px` };
});

function getListMeasureEl() {
  if (props.hideInlineConfirm) {
    return listPanelRef.value?.getMeasureEl() ?? listMeasurePanelRef.value?.getMeasureEl() ?? null;
  }
  return (
    listPanelRef.value?.getMeasureEl()
    ?? listMeasurePanelRef.value?.getMeasureEl()
    ?? null
  );
}

function getPaymentMeasureEl() {
  /** 离屏预测量壳按 paymentMethod 常驻展开态，避免 live 面板在地址 morph 中途量偏小。 */
  if (evmPaymentMethod.value === 'address') {
    return (
      paymentAddressMeasurePanelRef.value?.getMeasureEl()
      ?? paymentPanelRef.value?.getMeasureEl()
      ?? null
    );
  }
  if (evmPaymentMethod.value === 'sponsored') {
    return (
      paymentMeasurePanelRef.value?.getMeasureEl()
      ?? paymentPanelRef.value?.getMeasureEl()
      ?? null
    );
  }
  if (evmPaymentMethod.value === null) {
    return (
      paymentNoneMeasurePanelRef.value?.getMeasureEl()
      ?? paymentPanelRef.value?.getMeasureEl()
      ?? null
    );
  }
  return paymentPanelRef.value?.getMeasureEl() ?? null;
}

function getCustomMeasureEl() {
  return customMeasurePanelRef.value?.getMeasureEl() ?? null;
}

function measurePage(screen: MinerFeeScreen) {
  const el =
    screen === 'payment'
      ? getPaymentMeasureEl()
      : screen === 'list'
        ? getListMeasureEl()
        : getCustomMeasureEl();
  if (!el) return;
  const height = el.scrollHeight;
  if (height > 0) {
    pageSpecs[screen].shellHeight = height;
  }
}

async function ensurePageHeight(screen: MinerFeeScreen) {
  await nextTick();
  measurePage(screen);
}

async function syncPaymentPageShellHeight() {
  if (activePage.value !== 'payment') {
    return;
  }
  await nextTick();
  measurePage('payment');
  if (props.hideInlineConfirm || contentExiting.value || contentEntering.value) {
    return;
  }
  shellHeight.value = pageSpecs.payment.shellHeight;
}

onMounted(async () => {
  if (useEvmPaymentStep.value) {
    await ensurePageHeight('payment');
  }
  await ensurePageHeight('list');
  await ensurePageHeight('custom');
  shellHeight.value = pageSpecs[initialMinerFeeScreen()].shellHeight;
  await nextTick();
  shellMeasureReady.value = true;
});

watch(customFeeSaved, async () => {
  await nextTick();
  if (useEvmPaymentStep.value && activePage.value === 'payment') {
    await syncPaymentAddressExpandLayout();
    return;
  }
  measurePage('list');
  if (activePage.value !== 'list' || contentExiting.value || contentEntering.value) {
    return;
  }
  shellHeight.value = pageSpecs.list.shellHeight;
});

watch(minerFee, async () => {
  if (!useEvmPaymentStep.value || activePage.value !== 'payment') {
    return;
  }
  if (evmPaymentMethod.value !== 'address') {
    return;
  }
  await syncPaymentPageShellHeight();
});

watch(
  () => activePage.value,
  (screen) => {
    if (props.hideInlineConfirm && screen === 'custom') {
      return;
    }
    emit('miner-fee-screen-change', screen);
  },
);

function selectMinerFee(optionId: MinerFeeOptionId) {
  minerFee.value = optionId;
}

function onCustomPopoverOpen() {
  minerFeeBeforeCustomPopover.value = minerFee.value;
}

function onCustomPopoverDismiss() {
  if (minerFeeBeforeCustomPopover.value !== null) {
    minerFee.value = minerFeeBeforeCustomPopover.value;
    minerFeeBeforeCustomPopover.value = null;
  }
}

async function setMinerFeeScreen(screen: MinerFeeScreen) {
  if (
    screen === activePage.value
    && !contentExiting.value
    && !contentEntering.value
  ) {
    return;
  }

  if (props.hideInlineConfirm) {
    activePage.value = screen;
    return;
  }

  await ensurePageHeight(activePage.value);
  await ensurePageHeight(screen);
  switchTo(screen);
  await whenIdle();

  measurePage(screen);
  shellHeight.value = pageSpecs[screen].shellHeight;
}

async function onEvmPaymentMethodSelect(method: EvmMinerFeePaymentSelection) {
  const panel = paymentPanelRef.value;
  const lockExpand =
    activePage.value === 'payment'
    && !props.hideInlineConfirm
    && panel?.lockAddressPaymentExpandHeight;
  const lockedHeight = lockExpand ? panel.lockAddressPaymentExpandHeight() : undefined;

  evmPaymentMethod.value = method;
  if (activePage.value !== 'payment') {
    return;
  }

  await nextTick();
  if (panel?.finishAddressPaymentExpandHeight) {
    await panel.finishAddressPaymentExpandHeight(lockedHeight);
  }

  await syncPaymentPageShellHeight();
}

function onSponsoredPaymentConfirm() {
  emit('confirm', {
    displayValue: buildEvmSponsoredMinerFeeDisplay(ui, props.symbol),
  });
}

function onPaymentStepConfirm() {
  if (evmPaymentMethod.value === null) {
    return;
  }
  if (evmPaymentMethod.value === 'address') {
    onListConfirm();
    return;
  }
  onSponsoredPaymentConfirm();
}

function goToEvmPaymentScreen() {
  void setMinerFeeScreen('payment');
}

function openCustomMinerFee() {
  customLiveMode.value = customFeeDraft.value.mode;
  void setMinerFeeScreen('custom');
}

async function onCustomModeChange(mode: MinerFeeCustomMode) {
  customLiveMode.value = mode;
  await nextTick();
  measurePage('custom');
  if (activePage.value !== 'custom' || contentExiting.value || contentEntering.value) {
    return;
  }
  shellHeight.value = pageSpecs.custom.shellHeight;
}

function goToMinerFeeList() {
  if (useEvmPaymentStep.value) {
    evmPaymentMethod.value = 'address';
    void setMinerFeeScreen('payment');
    return;
  }
  setMinerFeeScreen('list');
}

async function syncPaymentAddressExpandLayout(options?: { scrollToBottom?: boolean }) {
  if (!useEvmPaymentStep.value || activePage.value !== 'payment') {
    return;
  }
  await nextTick();
  await paymentPanelRef.value?.finishAddressPaymentExpandHeight?.();
  if (options?.scrollToBottom) {
    await paymentPanelRef.value?.scrollContentToBottom?.();
  }
  await syncPaymentPageShellHeight();
}

async function onCustomSave(draft: MinerFeeCustomDraft) {
  customFeeDraft.value = { ...draft };
  customLiveMode.value = draft.mode;
  customFeeSaved.value = buildMinerFeeCustomPreview(draft, shellVariant.value);
  minerFee.value = MINER_FEE_CUSTOM_ID;
  minerFeeBeforeCustomPopover.value = null;
  evmPaymentMethod.value = 'address';
  await nextTick();
  const returnScreen = useEvmPaymentStep.value ? 'payment' : 'list';
  measurePage(returnScreen);
  if (!props.hideInlineConfirm) {
    await setMinerFeeScreen(returnScreen);
    await whenIdle();
    await syncPaymentAddressExpandLayout({ scrollToBottom: returnScreen === 'payment' });
  }
}

function resetMinerFeeFlow() {
  const initial = initialMinerFeeScreen();
  activePage.value = initial;
  contentExiting.value = false;
  contentEntering.value = false;
  evmPaymentMethod.value = 'sponsored';
  minerFee.value = DEFAULT_MINER_FEE_SPEED;
  minerFeeBeforeCustomPopover.value = null;
  customFeeDraft.value = defaultMinerFeeCustomDraft(shellVariant.value);
  customLiveMode.value = customFeeDraft.value.mode;
  customFeeSaved.value = null;
  shellHeight.value = pageSpecs[initial].shellHeight;
  shellMeasureReady.value = true;
}

function onListConfirm() {
  const displayValue = buildEvmMinerFeeDisplay(
    minerFee.value,
    customFeeSaved.value,
    ui,
    props.symbol,
  );
  if (!displayValue) {
    return;
  }
  emit('confirm', { displayValue });
}

function attemptCancelCustom() {
  goToMinerFeeList();
}

function attemptConfirm() {
  if (useEvmPaymentStep.value && activePage.value === 'payment') {
    onPaymentStepConfirm();
    return;
  }
  onListConfirm();
}

function attemptSaveCustom() {
  customPanelRef.value?.save();
}

defineExpose({
  resetMinerFeeFlow,
  attemptConfirm,
  attemptCancelCustom,
  attemptSaveCustom,
  confirmDisabled: minerFeeConfirmDisabled,
  minerFeeScreen: activePage,
});
</script>

<template>
  <div :class="styles.minerFeeRootWrap">
    <div :class="styles.minerFeeMeasureHost" aria-hidden="true">
      <MinerFeeCustomPanel
        ref="customMeasurePanelRef"
        :draft="customMeasureDraft"
        :symbol="symbol"
        :hide-inline-footer="hideInlineConfirm"
        measure-only
      />
    </div>

    <div v-if="useEvmPaymentStep" :class="styles.minerFeeMeasureHost" aria-hidden="true">
      <MinerFeeEvmPaymentPanel
        ref="paymentMeasurePanelRef"
        payment-method="sponsored"
        :miner-fee="minerFee"
        :custom-fee-saved="customFeeSaved"
        :symbol="symbol"
        :evm-payment-quote="evmPaymentQuote"
        :transaction-count="transactionCount"
        :prefer-batch-total-summary="preferBatchTotalSummary"
        measure-only
        :hide-inline-confirm="hideInlineConfirm"
      />
      <MinerFeeEvmPaymentPanel
        ref="paymentAddressMeasurePanelRef"
        payment-method="address"
        :miner-fee="minerFee"
        :custom-fee-saved="customFeeSaved"
        :symbol="symbol"
        :evm-payment-quote="evmPaymentQuote"
        :transaction-count="transactionCount"
        :prefer-batch-total-summary="preferBatchTotalSummary"
        measure-only
        :hide-inline-confirm="hideInlineConfirm"
      />
      <MinerFeeEvmPaymentPanel
        ref="paymentNoneMeasurePanelRef"
        :payment-method="null"
        :miner-fee="minerFee"
        :custom-fee-saved="customFeeSaved"
        :symbol="symbol"
        :evm-payment-quote="evmPaymentQuote"
        :transaction-count="transactionCount"
        :prefer-batch-total-summary="preferBatchTotalSummary"
        measure-only
        :hide-inline-confirm="hideInlineConfirm"
      />
    </div>

    <div :class="styles.minerFeeMeasureHost" aria-hidden="true">
      <MinerFeeListPanel
        ref="listMeasurePanelRef"
        measure-only
        :symbol="symbol"
        :miner-fee="minerFee"
        :custom-fee-saved="customFeeSaved"
        :confirm-disabled="minerFeeConfirmDisabled"
        :hide-inline-confirm="hideInlineConfirm"
        :transaction-count="transactionCount"
        :prefer-batch-total-summary="preferBatchTotalSummary"
      />
    </div>

    <template v-if="hideInlineConfirm">
      <MinerFeeEvmPaymentPanel
        v-if="useEvmPaymentStep && isMinerFeePaymentPage"
        ref="paymentPanelRef"
        :payment-method="evmPaymentMethod"
        :miner-fee="minerFee"
        :custom-fee-saved="customFeeSaved"
        :symbol="symbol"
        :evm-payment-quote="evmPaymentQuote"
        :transaction-count="transactionCount"
        :prefer-batch-total-summary="preferBatchTotalSummary"
        custom-via-anchored-popover
        :custom-draft="customFeeDraft"
        custom-popover-boundary=".eds-popup"
        hide-inline-confirm
        @select-payment-method="onEvmPaymentMethodSelect"
        @select-miner-fee="selectMinerFee"
        @open-custom="openCustomMinerFee"
        @save-custom="onCustomSave"
        @custom-popover-open="onCustomPopoverOpen"
        @custom-popover-dismiss="onCustomPopoverDismiss"
        @confirm="onPaymentStepConfirm"
      />
      <MinerFeeListPanel
        v-else
        ref="listPanelRef"
        :symbol="symbol"
        :miner-fee="minerFee"
        :custom-fee-saved="customFeeSaved"
        :confirm-disabled="minerFeeConfirmDisabled"
        hide-inline-confirm
        custom-via-anchored-popover
        :custom-draft="customFeeDraft"
        custom-popover-boundary=".eds-popup"
        :show-payment-back="useEvmPaymentStep"
        :transaction-count="transactionCount"
        :prefer-batch-total-summary="preferBatchTotalSummary"
        @select-miner-fee="selectMinerFee"
        @custom-popover-open="onCustomPopoverOpen"
        @custom-popover-dismiss="onCustomPopoverDismiss"
        @save-custom="onCustomSave"
        @back-to-payment="goToEvmPaymentScreen"
        @confirm="onListConfirm"
      />
    </template>

    <div
      v-else
      class="motion-layout-deform"
      :class="styles.minerFeeDeformShell"
      data-miner-fee-popover
      :data-miner-fee-screen="activePage"
      :data-shell-ready="shellMeasureReady || undefined"
      :style="deformShellStyle"
    >
      <EgMotionLayoutContent
        :content-exiting="contentExiting"
        :content-entering="contentEntering"
      >
        <MinerFeeCustomPanel
          v-if="isMinerFeeCustomPage"
          ref="customPanelRef"
          :draft="customFeeDraft"
          :symbol="symbol"
          @back="goToMinerFeeList"
          @cancel="goToMinerFeeList"
          @save="onCustomSave"
          @mode-change="onCustomModeChange"
        />

        <MinerFeeEvmPaymentPanel
          v-else-if="useEvmPaymentStep && isMinerFeePaymentPage"
          ref="paymentPanelRef"
          :payment-method="evmPaymentMethod"
          :miner-fee="minerFee"
          :custom-fee-saved="customFeeSaved"
          :symbol="symbol"
          :evm-payment-quote="evmPaymentQuote"
          :transaction-count="transactionCount"
          :prefer-batch-total-summary="preferBatchTotalSummary"
          :confirm-disabled="minerFeeConfirmDisabled"
          @select-payment-method="onEvmPaymentMethodSelect"
          @select-miner-fee="selectMinerFee"
          @open-custom="openCustomMinerFee"
          @save-custom="onCustomSave"
          @confirm="onPaymentStepConfirm"
        />

        <MinerFeeListPanel
          v-else
          ref="listPanelRef"
          :symbol="symbol"
          :miner-fee="minerFee"
          :custom-fee-saved="customFeeSaved"
          :confirm-disabled="minerFeeConfirmDisabled"
          :show-payment-back="useEvmPaymentStep"
          :transaction-count="transactionCount"
          :prefer-batch-total-summary="preferBatchTotalSummary"
          @select-miner-fee="selectMinerFee"
          @open-custom="openCustomMinerFee"
          @back-to-payment="goToEvmPaymentScreen"
          @confirm="onListConfirm"
        />
      </EgMotionLayoutContent>
    </div>
  </div>
</template>
