<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import {
  MOTION_LAYOUT_DEFORM_CONTENT,
  MOTION_LAYOUT_DEFORM_CONTENT_ENTERING,
  MOTION_LAYOUT_DEFORM_CONTENT_EXITING,
  useMotionLayoutDeformPageSwitch,
  type MotionLayoutDeformPageSpec,
} from '../../atoms/motion-layout-deform';
import { useMinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeConfirmPayload } from './minerFeeTypes';
import { buildEvmMinerFeeDisplay } from './minerFeeEvmDisplay';
import MinerFeeCustomPanel from './MinerFeeCustomPanel.vue';
import MinerFeeListPanel, { type MinerFeeOptionId } from './MinerFeeListPanel.vue';
import {
  buildMinerFeeCustomPreview,
  defaultMinerFeeCustomDraft,
  type MinerFeeCustomDraft,
  type MinerFeeCustomSaved,
} from './minerFeeCustomTypes';
import { resolveMinerFeeEvmShellVariant } from './minerFeeEvmShellVariant';
import styles from './MinerFeePopoverPanel.module.css';

const MINER_FEE_CUSTOM_ID = 'custom' as const;

type MinerFeeScreen = 'list' | 'custom';

const props = withDefaults(
  defineProps<{
    symbol?: string;
    hideInlineConfirm?: boolean;
    /** 多笔：>1 时在内容与底部确定之间展示预计总矿工费。 */
    transactionCount?: number;
    preferBatchTotalSummary?: boolean;
  }>(),
  {
    symbol: 'ETH',
    hideInlineConfirm: false,
    transactionCount: 1,
    preferBatchTotalSummary: false,
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
const shellVariant = computed(() => resolveMinerFeeEvmShellVariant(props.symbol));

const minerFee = ref<MinerFeeOptionId | null>(DEFAULT_MINER_FEE_SPEED);
const minerFeeBeforeCustomPopover = ref<MinerFeeOptionId | null>(null);
const customFeeDraft = ref<MinerFeeCustomDraft>(
  defaultMinerFeeCustomDraft(shellVariant.value),
);
const customFeeSaved = ref<MinerFeeCustomSaved | null>(null);

const customMeasureDraft = computed<MinerFeeCustomDraft>(() => ({
  ...customFeeDraft.value,
  mode: 'advanced',
}));

const pageSpecs = reactive<Record<MinerFeeScreen, MotionLayoutDeformPageSpec>>({
  list: { shellHeight: 320 },
  custom: { shellHeight: 360 },
});

const {
  activePage,
  shellHeight,
  contentExiting,
  contentEntering,
  switchTo,
  whenIdle,
} = useMotionLayoutDeformPageSwitch<MinerFeeScreen>(pageSpecs, 'list');

const minerFeeConfirmDisabled = computed(() => minerFee.value === null);
const isMinerFeeCustomPage = computed(() => activePage.value === 'custom');
/** 首次测量完成前禁用 shell height transition，避免 Popover 打开时从占位高度弹跳。 */
const shellMeasureReady = ref(false);
const deformShellStyle = computed(() => {
  if (props.hideInlineConfirm && activePage.value === 'list') {
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

function getCustomMeasureEl() {
  return customMeasurePanelRef.value?.getMeasureEl() ?? null;
}

function measurePage(screen: MinerFeeScreen) {
  const el = screen === 'list' ? getListMeasureEl() : getCustomMeasureEl();
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

onMounted(async () => {
  await ensurePageHeight('list');
  await ensurePageHeight('custom');
  shellHeight.value = pageSpecs.list.shellHeight;
  await nextTick();
  shellMeasureReady.value = true;
});

watch(customFeeSaved, async () => {
  await nextTick();
  measurePage('list');
  if (activePage.value !== 'list' || contentExiting.value || contentEntering.value) {
    return;
  }
  shellHeight.value = pageSpecs.list.shellHeight;
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

  if (screen === 'list') {
    measurePage('list');
    shellHeight.value = pageSpecs.list.shellHeight;
  }
}

function openCustomMinerFee() {
  void setMinerFeeScreen('custom');
}

function goToMinerFeeList() {
  setMinerFeeScreen('list');
}

async function onCustomSave(draft: MinerFeeCustomDraft) {
  customFeeDraft.value = { ...draft };
  customFeeSaved.value = buildMinerFeeCustomPreview(draft, shellVariant.value);
  minerFee.value = MINER_FEE_CUSTOM_ID;
  minerFeeBeforeCustomPopover.value = null;
  await nextTick();
  measurePage('list');
  if (!props.hideInlineConfirm) {
    await setMinerFeeScreen('list');
  }
}

function resetMinerFeeFlow() {
  activePage.value = 'list';
  contentExiting.value = false;
  contentEntering.value = false;
  minerFee.value = DEFAULT_MINER_FEE_SPEED;
  minerFeeBeforeCustomPopover.value = null;
  customFeeDraft.value = defaultMinerFeeCustomDraft(shellVariant.value);
  customFeeSaved.value = null;
  shellHeight.value = pageSpecs.list.shellHeight;
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

function attemptSaveCustom() {
  customPanelRef.value?.save();
}

defineExpose({
  resetMinerFeeFlow,
  attemptConfirm: onListConfirm,
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
      <MinerFeeListPanel
        ref="listPanelRef"
        :symbol="symbol"
        :miner-fee="minerFee"
        :custom-fee-saved="customFeeSaved"
        :confirm-disabled="minerFeeConfirmDisabled"
        hide-inline-confirm
        custom-via-anchored-popover
        :custom-draft="customFeeDraft"
        custom-popover-boundary=".eds-popup"
        :transaction-count="transactionCount"
        :prefer-batch-total-summary="preferBatchTotalSummary"
        @select-miner-fee="selectMinerFee"
        @custom-popover-open="onCustomPopoverOpen"
        @custom-popover-dismiss="onCustomPopoverDismiss"
        @save-custom="onCustomSave"
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
      <div
        :class="[
          MOTION_LAYOUT_DEFORM_CONTENT,
          contentExiting && MOTION_LAYOUT_DEFORM_CONTENT_EXITING,
          contentEntering && MOTION_LAYOUT_DEFORM_CONTENT_ENTERING,
        ]"
      >
        <MinerFeeCustomPanel
          v-if="isMinerFeeCustomPage"
          ref="customPanelRef"
          :draft="customFeeDraft"
          :symbol="symbol"
          @back="goToMinerFeeList"
          @cancel="goToMinerFeeList"
          @save="onCustomSave"
        />

        <MinerFeeListPanel
          v-else
          ref="listPanelRef"
          :symbol="symbol"
          :miner-fee="minerFee"
          :custom-fee-saved="customFeeSaved"
          :confirm-disabled="minerFeeConfirmDisabled"
          :transaction-count="transactionCount"
          :prefer-batch-total-summary="preferBatchTotalSummary"
          @select-miner-fee="selectMinerFee"
          @open-custom="openCustomMinerFee"
          @confirm="onListConfirm"
        />
      </div>
    </div>
  </div>
</template>
