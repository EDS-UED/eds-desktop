<script setup lang="ts">
import { computed, ref } from 'vue';
import { EgComboPopupButton } from '../combo';
import { EgDivider } from '../../atoms/divider';
import { EgIcon } from '../../atoms/icons';
import { EgLinkButton } from '../link';
import { useMinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeCustomDraft, MinerFeeCustomSaved } from './minerFeeCustomTypes';
import MinerFeeCustomAnchoredPopover from './MinerFeeCustomAnchoredPopover.vue';
import MinerFeeBatchAppendix from './MinerFeeBatchAppendix.vue';
import { isMinerFeeBatchAppendixVisible } from './minerFeeBatchAppendixVisibility';
import { buildEvmMinerFeeBatchTotalDisplay } from './minerFeeBatchTotalDisplay';
import {
  formatMinerFeeOptionCryptoDisplay,
  formatMinerFeeOptionUsdDisplay,
} from './minerFeeEvmDisplay';
import {
  minerFeeSpeedCryptoRangeKey,
  minerFeeSpeedUsdRangeKey,
  resolveMinerFeeEvmShellVariant,
} from './minerFeeEvmShellVariant';
import styles from './MinerFeePopoverPanel.module.css';

const MINER_FEE_SPEED_IDS = ['fast', 'normal', 'slow'] as const;

const MINER_FEE_SPEED_META = {
  fast: { labelKey: 'Miner fee speed fast', dotTone: 'success' as const },
  normal: { labelKey: 'Miner fee speed normal', dotTone: 'warning' as const },
  slow: { labelKey: 'Miner fee speed slow', dotTone: 'danger' as const },
};

const MINER_FEE_CUSTOM_ID = 'custom' as const;

export type MinerFeeOptionId =
  | (typeof MINER_FEE_SPEED_IDS)[number]
  | typeof MINER_FEE_CUSTOM_ID;

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
  }>(),
  {
    symbol: 'ETH',
    hideInlineConfirm: false,
    customViaAnchoredPopover: false,
    customPopoverBoundary: '.eds-popup',
    transactionCount: 1,
    preferBatchTotalSummary: false,
  },
);

const emit = defineEmits<{
  'select-miner-fee': [optionId: MinerFeeOptionId];
  'open-custom': [];
  'save-custom': [draft: MinerFeeCustomDraft];
  'custom-popover-open': [];
  'custom-popover-dismiss': [];
  confirm: [];
}>();

const ui = useMinerFeeTranslate();

const rootRef = ref<HTMLElement | null>(null);
const customPopoverExpanded = ref(false);

const shellVariant = computed(() => resolveMinerFeeEvmShellVariant(props.symbol));

const speedOptions = computed(() =>
  MINER_FEE_SPEED_IDS.map((id) => ({
    id,
    labelKey: MINER_FEE_SPEED_META[id].labelKey,
    dotTone: MINER_FEE_SPEED_META[id].dotTone,
    cryptoRangeKey: minerFeeSpeedCryptoRangeKey(shellVariant.value, id),
    usdRangeKey: minerFeeSpeedUsdRangeKey(shellVariant.value, id),
  })),
);

const batchTotalDisplay = computed(() =>
  buildEvmMinerFeeBatchTotalDisplay(
    props.minerFee,
    props.customFeeSaved,
    ui,
    props.symbol,
    props.transactionCount,
  ),
);

const showBatchAppendix = computed(() =>
  isMinerFeeBatchAppendixVisible({
    symbol: props.symbol,
    profileKind: 'evm',
    transactionCount: props.transactionCount,
    batchTotalDisplay: batchTotalDisplay.value,
    preferBatchTotalSummary: props.preferBatchTotalSummary,
  }),
);

function dotToneClass(tone: 'success' | 'warning' | 'danger') {
  switch (tone) {
    case 'success':
      return styles.minerFeeDotSuccess;
    case 'warning':
      return styles.minerFeeDotWarning;
    case 'danger':
      return styles.minerFeeDotDanger;
  }
}

function openSavedCustom() {
  emit('select-miner-fee', MINER_FEE_CUSTOM_ID);
  emit('open-custom');
}

function openSavedCustomViaPopover(onClick: () => void) {
  onClick();
}

defineExpose({
  getMeasureEl: () => rootRef.value,
});
</script>

<template>
  <div
    ref="rootRef"
    :class="[
      styles.minerFeeListPage,
      hideInlineConfirm && styles.minerFeeListPagePopupToolbar,
    ]"
  >
    <div :class="styles.minerFeeRoot" data-miner-fee-screen="list">
      <section :class="styles.minerFee">
        <div
          role="radiogroup"
          :class="[
            styles.minerFeeOptions,
            customPopoverExpanded && styles.minerFeeOptionsPopoverOpen,
          ]"
          :aria-label="ui('Gas fee')"
        >
          <div :class="styles.minerFeeSpeedGroup">
            <button
              v-for="option in speedOptions"
              :key="option.id"
              type="button"
              role="radio"
              :aria-checked="minerFee === option.id"
              :class="[
                styles.minerFeeOption,
                minerFee === option.id && styles.minerFeeOptionSelected,
              ]"
              @click="emit('select-miner-fee', option.id)"
            >
              <span :class="styles.minerFeeOptionHeader">
                <span
                  :class="[styles.minerFeeDot, dotToneClass(option.dotTone)]"
                  aria-hidden="true"
                />
                <span :class="styles.minerFeeOptionName">{{ ui(option.labelKey) }}</span>
              </span>
              <span :class="styles.minerFeeEthRange">{{
                formatMinerFeeOptionCryptoDisplay(ui(option.cryptoRangeKey))
              }}</span>
              <span :class="styles.minerFeeUsdRange">{{
                formatMinerFeeOptionUsdDisplay(ui(option.usdRangeKey))
              }}</span>
            </button>
          </div>

          <EgDivider type="page" :class="styles.minerFeePageInsetDivider" />

          <div :class="styles.minerFeeCustomGroup">
          <div
            v-if="customViaAnchoredPopover && !measureOnly"
            :class="styles.minerFeeCustomPopoverHost"
          >
            <MinerFeeCustomAnchoredPopover
              :draft="customDraft"
              :symbol="symbol"
              :boundary-selector="customPopoverBoundary"
              @open="customPopoverExpanded = true; emit('custom-popover-open')"
              @dismiss="customPopoverExpanded = false; emit('custom-popover-dismiss')"
              @save="(draft) => emit('save-custom', draft)"
            >
              <template #trigger="{ onClick, active }">
                <div
                  v-if="customFeeSaved"
                  role="radio"
                  :aria-checked="minerFee === MINER_FEE_CUSTOM_ID"
                  tabindex="0"
                  :class="[
                    styles.minerFeeOption,
                    styles.minerFeeSavedCustomOption,
                    minerFee === MINER_FEE_CUSTOM_ID && styles.minerFeeOptionSelected,
                    active && styles.minerFeeCustomOptionTriggerActive,
                  ]"
                  @click="openSavedCustomViaPopover(onClick)"
                  @keydown.enter.prevent="openSavedCustomViaPopover(onClick)"
                  @keydown.space.prevent="openSavedCustomViaPopover(onClick)"
                >
                  <span :class="styles.minerFeeSavedCustomMain">
                    <span :class="styles.minerFeeOptionHeader">
                      <span :class="styles.minerFeeOptionName">{{ ui('Custom') }}</span>
                    </span>
                    <span :class="styles.minerFeeEthRange">{{
                      formatMinerFeeOptionCryptoDisplay(customFeeSaved.cryptoRange)
                    }}</span>
                    <span :class="styles.minerFeeUsdRange">{{ customFeeSaved.usdRange }}</span>
                  </span>
                  <EgLinkButton
                    :class="styles.minerFeeSavedCustomEdit"
                    size="md"
                    href="#"
                    tabindex="-1"
                    aria-hidden="true"
                    @click.prevent.stop="openSavedCustomViaPopover(onClick)"
                  >
                    {{ ui('Edit') }}
                  </EgLinkButton>
                </div>
                <button
                  v-else
                  type="button"
                  role="radio"
                  :aria-checked="minerFee === MINER_FEE_CUSTOM_ID"
                  :class="[
                    styles.minerFeeCustomOption,
                    minerFee === MINER_FEE_CUSTOM_ID && styles.minerFeeOptionSelected,
                    active && styles.minerFeeCustomOptionTriggerActive,
                  ]"
                  @click.stop="onClick"
                >
                  <EgIcon name="eds-gear-fill" size="sm" />
                  <span :class="styles.minerFeeOptionName">{{ ui('Custom') }}</span>
                </button>
              </template>
            </MinerFeeCustomAnchoredPopover>
          </div>

          <template v-else>
          <div
            v-if="customFeeSaved"
            role="radio"
            :aria-checked="minerFee === MINER_FEE_CUSTOM_ID"
            tabindex="0"
            :class="[
              styles.minerFeeOption,
              styles.minerFeeSavedCustomOption,
              minerFee === MINER_FEE_CUSTOM_ID && styles.minerFeeOptionSelected,
            ]"
            @click="openSavedCustom"
            @keydown.enter.prevent="openSavedCustom"
            @keydown.space.prevent="openSavedCustom"
          >
            <span :class="styles.minerFeeSavedCustomMain">
              <span :class="styles.minerFeeOptionHeader">
                <span :class="styles.minerFeeOptionName">{{ ui('Custom') }}</span>
              </span>
              <span :class="styles.minerFeeEthRange">{{
                formatMinerFeeOptionCryptoDisplay(customFeeSaved.cryptoRange)
              }}</span>
              <span :class="styles.minerFeeUsdRange">{{ customFeeSaved.usdRange }}</span>
            </span>
            <EgLinkButton
              :class="styles.minerFeeSavedCustomEdit"
              size="md"
              href="#"
              tabindex="-1"
              aria-hidden="true"
              @click.prevent.stop="openSavedCustom"
            >
              {{ ui('Edit') }}
            </EgLinkButton>
          </div>
          <button
            v-else
            type="button"
            role="radio"
            :aria-checked="minerFee === MINER_FEE_CUSTOM_ID"
            :class="[
              styles.minerFeeCustomOption,
              minerFee === MINER_FEE_CUSTOM_ID && styles.minerFeeOptionSelected,
            ]"
            @click="emit('open-custom')"
          >
            <span
              v-if="measureOnly"
              :class="styles.minerFeeCustomOptionIconSpacer"
              aria-hidden="true"
            />
            <EgIcon v-else name="eds-gear-fill" size="sm" />
            <span :class="styles.minerFeeOptionName">{{ ui('Custom') }}</span>
          </button>
          </template>
          </div>

          <template v-if="showBatchAppendix">
            <EgDivider type="page" :class="styles.minerFeePageInsetDivider" />
            <MinerFeeBatchAppendix
              :symbol="symbol"
              profile-kind="evm"
              :transaction-count="transactionCount"
              :batch-total-display="batchTotalDisplay"
              :prefer-batch-total-summary="preferBatchTotalSummary"
              :show-leading-divider="false"
            />
          </template>
        </div>
      </section>
    </div>

    <div v-if="!hideInlineConfirm" :class="styles.minerFeeFooter">
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
