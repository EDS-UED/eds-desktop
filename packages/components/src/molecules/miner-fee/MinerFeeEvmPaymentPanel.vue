<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { EgDivider } from '../../atoms/divider';
import {
  SCROLL_CHROME_EDGE_EPSILON,
  useScrollChromeScrim,
} from '../../composables/useScrollChromeScrim';
import { EgComboPopupButton } from '../combo';
import { EgFormSubmission } from '../feedback';
import { EgColorfulTag } from '../tag';
import { EgRadio } from '../toggle';
import { useMinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeCustomDraft, MinerFeeCustomSaved } from './minerFeeCustomTypes';
import {
  type EvmMinerFeePaymentDemoQuote,
  type EvmMinerFeePaymentMethod,
  type EvmMinerFeePaymentSelection,
  resolveEvmPaymentDemoQuote,
} from './minerFeeEvmPayment';
import { fillMinerFeeUiTemplate } from './minerFeeTronDisplay';
import MinerFeeSpeedOptionsGroup, {
  type MinerFeeOptionId,
} from './MinerFeeSpeedOptionsGroup.vue';
import styles from './MinerFeePopoverPanel.module.css';

const props = withDefaults(
  defineProps<{
    paymentMethod: EvmMinerFeePaymentSelection;
    minerFee: MinerFeeOptionId | null;
    customFeeSaved: MinerFeeCustomSaved | null;
    symbol?: string;
    hideInlineConfirm?: boolean;
    confirmDisabled?: boolean;
    evmPaymentQuote?: EvmMinerFeePaymentDemoQuote;
    customViaAnchoredPopover?: boolean;
    customDraft?: MinerFeeCustomDraft;
    customPopoverBoundary?: string;
    transactionCount?: number;
    preferBatchTotalSummary?: boolean;
    measureOnly?: boolean;
  }>(),
  {
    symbol: 'ETH',
    hideInlineConfirm: false,
    confirmDisabled: false,
    customViaAnchoredPopover: false,
    customPopoverBoundary: '.eds-popup',
    transactionCount: 1,
    preferBatchTotalSummary: false,
    measureOnly: false,
  },
);

const emit = defineEmits<{
  'select-payment-method': [method: EvmMinerFeePaymentSelection];
  'select-miner-fee': [optionId: MinerFeeOptionId];
  'open-custom': [];
  'save-custom': [draft: MinerFeeCustomDraft];
  'custom-popover-open': [];
  'custom-popover-dismiss': [];
  confirm: [];
}>();

const ui = useMinerFeeTranslate();
const rootRef = ref<HTMLElement | null>(null);
const scrollRef = ref<HTMLElement | null>(null);
const { canScroll, topScrim, bottomScrim, update: updateScrollScrim } =
  useScrollChromeScrim(scrollRef);
const addressExpandShellRef = ref<HTMLElement | null>(null);
const addressExpandInnerRef = ref<HTMLElement | null>(null);
const addressExpandHeight = ref<number | null>(null);
const addressExpandReady = ref(false);

const addressExpandShellStyle = computed(() => {
  if (props.measureOnly || addressExpandHeight.value == null) {
    return undefined;
  }
  return { height: `${addressExpandHeight.value}px` };
});

function measureAddressExpandContentHeight() {
  const el = addressExpandInnerRef.value;
  if (!el) {
    return 0;
  }
  return el.scrollHeight;
}

function lockAddressPaymentExpandHeight() {
  if (props.measureOnly) {
    return 0;
  }
  const shell = addressExpandShellRef.value;
  if (!shell) {
    return 0;
  }
  const locked = shell.getBoundingClientRect().height;
  addressExpandHeight.value = locked;
  return locked;
}

async function finishAddressPaymentExpandHeight(_locked?: number) {
  if (props.measureOnly) {
    return;
  }
  await nextTick();
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
  const next = measureAddressExpandContentHeight();
  if (next > 0) {
    addressExpandHeight.value = next;
  }
  await nextTick();
  updateScrollScrim();
}

async function scrollContentToBottom() {
  if (props.measureOnly) {
    return;
  }
  await nextTick();
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
  const region = scrollRef.value;
  if (!region) {
    return;
  }
  const maxScrollTop = Math.max(0, region.scrollHeight - region.clientHeight);
  region.scrollTop = maxScrollTop;
  updateScrollScrim();
  if (
    maxScrollTop > 0
    && region.scrollTop + region.clientHeight
      < region.scrollHeight - SCROLL_CHROME_EDGE_EPSILON
  ) {
    region.scrollTop = region.scrollHeight;
    updateScrollScrim();
  }
}

async function initAddressExpandLayout() {
  if (props.measureOnly) {
    return;
  }
  await nextTick();
  const h = measureAddressExpandContentHeight();
  if (h > 0) {
    addressExpandHeight.value = h;
  }
  await nextTick();
  addressExpandReady.value = true;
  updateScrollScrim();
}

onMounted(() => {
  void initAddressExpandLayout();
});

watch(
  () => [props.minerFee, props.customFeeSaved, props.transactionCount] as const,
  async () => {
    if (props.measureOnly || props.paymentMethod !== 'address') {
      return;
    }
    await finishAddressPaymentExpandHeight();
  },
);

const demoQuote = computed(
  () => props.evmPaymentQuote ?? resolveEvmPaymentDemoQuote(ui, props.symbol),
);

const sponsoredDescription = computed(() =>
  ui('Miner fee evm payment sponsored description'),
);

const sponsoredEstimateLine = computed(() =>
  fillMinerFeeUiTemplate(ui('Miner fee evm payment estimate line'), {
    estimate: demoQuote.value.estimateLine,
  }),
);

const showSponsoredBalanceInsufficient = computed(
  () => demoQuote.value.sponsoredGasBalanceInsufficient,
);

function toggleMethod(method: EvmMinerFeePaymentMethod) {
  emit('select-payment-method', props.paymentMethod === method ? null : method);
}

defineExpose({
  getMeasureEl: () => rootRef.value,
  lockAddressPaymentExpandHeight,
  finishAddressPaymentExpandHeight,
  scrollContentToBottom,
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
    data-miner-fee-evm-payment
  >
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
      data-miner-fee-screen="payment"
      data-miner-fee-scroll-region
    >
      <section :class="[styles.minerFee, styles.minerFeeEvmPaymentSection]">
        <div :class="styles.minerFeeEvmPaymentModeBlock">
          <p :class="styles.minerFeeTronPaymentLabel">
            {{ ui('Miner fee payment mode label') }}
          </p>

          <div
            role="radiogroup"
            :class="styles.minerFeeEvmPaymentMethods"
            :aria-label="ui('Miner fee payment mode label')"
          >
            <div :class="styles.minerFeeEvmPaymentMethodSponsoredStack">
              <div
                role="radio"
                tabindex="0"
                data-no-corner-smoothing
                :aria-checked="paymentMethod === 'sponsored'"
                :class="[
                  styles.minerFeeEvmPaymentMethodOption,
                  paymentMethod === 'sponsored' && styles.minerFeeEvmPaymentMethodOptionSelected,
                ]"
                @click="toggleMethod('sponsored')"
                @keydown.enter.prevent="toggleMethod('sponsored')"
                @keydown.space.prevent="toggleMethod('sponsored')"
              >
                <EgRadio
                  :model-value="paymentMethod === 'sponsored'"
                  @click.stop="toggleMethod('sponsored')"
                />
                <div :class="styles.minerFeeEvmPaymentMethodOptionBody">
                  <div :class="styles.minerFeeTronPaymentHeader">
                    <span :class="styles.minerFeeEvmPaymentMethodTitle">
                      {{ ui('Miner fee evm payment sponsored title') }}
                    </span>
                    <span :class="styles.minerFeeTronPaymentTags">
                      <EgColorfulTag colorful-style="lime" size="sm">
                        {{ ui('Miner fee tron recommended') }}
                      </EgColorfulTag>
                    </span>
                  </div>
                  <span :class="styles.minerFeeEvmPaymentMethodDesc">
                    {{ sponsoredDescription }}
                  </span>
                  <span :class="styles.minerFeeTronEstimatedCost">
                    {{ sponsoredEstimateLine }}
                  </span>
                  <span
                    v-if="transactionCount > 1"
                    :class="styles.minerFeeBatchTotalCountLine"
                  >
                    <span :class="styles.minerFeeBatchTotalCountPrefix">
                      {{ ui('Miner fee batch total suffix') }}
                    </span>
                    <span :class="styles.minerFeeBatchTotalCount">{{ transactionCount }}</span>
                    <span :class="styles.minerFeeBatchTotalCountSuffix">
                      {{ ui('Miner fee batch transaction suffix') }}
                    </span>
                  </span>
                </div>
              </div>

              <div
                v-if="showSponsoredBalanceInsufficient"
                :class="[
                  styles.minerFeeTronPaymentBalanceFeedback,
                  styles.minerFeeEvmPaymentBalanceFeedback,
                ]"
              >
                <EgFormSubmission
                  type="danger"
                  :text="ui('Miner fee evm payment balance insufficient text')"
                  :link-label="ui('Miner fee evm payment balance recharge link')"
                />
              </div>
            </div>

            <div
              :class="[
                styles.minerFeeEvmPaymentMethodAddressStack,
                paymentMethod === 'address' && styles.minerFeeEvmPaymentMethodAddressGroup,
              ]"
            >
              <div
                ref="addressExpandShellRef"
                :class="styles.minerFeeEvmPaymentAddressExpandShell"
                :data-address-expand-ready="addressExpandReady || undefined"
                :style="addressExpandShellStyle"
              >
                <div ref="addressExpandInnerRef">
                  <template v-if="paymentMethod === 'address'">
                    <div :class="styles.minerFeeEvmPaymentAddressEmbedded">
                      <div
                        role="radio"
                        tabindex="0"
                        data-no-corner-smoothing
                        aria-checked="true"
                        :class="styles.minerFeeEvmPaymentAddressEmbeddedHeader"
                        @click="toggleMethod('address')"
                        @keydown.enter.prevent="toggleMethod('address')"
                        @keydown.space.prevent="toggleMethod('address')"
                      >
                        <EgRadio
                          :model-value="true"
                          @click.stop="toggleMethod('address')"
                        />
                        <div :class="styles.minerFeeEvmPaymentMethodOptionBody">
                          <span :class="styles.minerFeeEvmPaymentMethodTitle">
                            {{ ui('Miner fee evm payment address title') }}
                          </span>
                          <span :class="styles.minerFeeEvmPaymentMethodDesc">
                            {{ ui('Miner fee evm payment address description') }}
                          </span>
                        </div>
                      </div>
                      <div
                        :class="styles.minerFeeEvmPaymentAddressEmbeddedBody"
                        @click.stop
                        @mousedown.stop
                      >
                        <MinerFeeSpeedOptionsGroup
                          embed-in-payment-address
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
                      </div>
                    </div>
                  </template>
                  <div
                    v-else
                    role="radio"
                    tabindex="0"
                    data-no-corner-smoothing
                    :aria-checked="false"
                    :class="styles.minerFeeEvmPaymentMethodOption"
                    @click="toggleMethod('address')"
                    @keydown.enter.prevent="toggleMethod('address')"
                    @keydown.space.prevent="toggleMethod('address')"
                  >
                    <EgRadio
                      :model-value="false"
                      @click.stop="toggleMethod('address')"
                    />
                    <div :class="styles.minerFeeEvmPaymentMethodOptionBody">
                      <span :class="styles.minerFeeEvmPaymentMethodTitle">
                        {{ ui('Miner fee evm payment address title') }}
                      </span>
                      <span :class="styles.minerFeeEvmPaymentMethodDesc">
                        {{ ui('Miner fee evm payment address description') }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
