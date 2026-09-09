<script setup lang="ts">
import { EgComboPopupButton } from '../combo';
import { EgDivider } from '../../atoms/divider';
import { EgFormSubmission } from '../feedback';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../icon-button';
import { EgTag } from '../tag';
import { EgTooltip } from '../tooltip';
import {
  FLOTATION_OVERFLOW_CLOSE_DELAY,
  FLOTATION_OVERFLOW_OPEN_DELAY,
  TEXT_OVERFLOW_TOOLTIP_MAX_WIDTH,
  TEXT_OVERFLOW_TOOLTIP_TOKEN_SCOPE,
} from '../tooltip/textOverflowTooltipConstants';
import { computed } from 'vue';
import { useMinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeConfirmPayload } from './minerFeeTypes';
import {
  buildTronMinerFeeDisplay,
  fillMinerFeeUiTemplate,
  resolveTronMinerFeeQuote,
} from './minerFeeTronDisplay';
import MinerFeeBatchAppendix from './MinerFeeBatchAppendix.vue';
import { buildTronMinerFeeBatchTotalDisplay } from './minerFeeBatchTotalDisplay';
import styles from './MinerFeePopoverPanel.module.css';

const props = withDefaults(
  defineProps<{
    hideInlineConfirm?: boolean;
    /** 多笔：>1 时在内容与底部确定之间展示预计总矿工费。 */
    transactionCount?: number;
  }>(),
  {
    hideInlineConfirm: false,
    transactionCount: 1,
  },
);

const emit = defineEmits<{
  confirm: [selection: MinerFeeConfirmPayload];
}>();

const ui = useMinerFeeTranslate();

const feeQuote = computed(() => resolveTronMinerFeeQuote());

const requiredResourcesSummaryLine = computed(() =>
  fillMinerFeeUiTemplate(ui('Miner fee tron resources line'), {
    bandwidth: feeQuote.value.bandwidth,
    energy: feeQuote.value.energy,
  }),
);

const availableEnergyLine = computed(() =>
  fillMinerFeeUiTemplate(ui('Miner fee tron resources energy value'), {
    energy: feeQuote.value.availableEnergy,
  }),
);

const availableBandwidthLine = computed(() =>
  fillMinerFeeUiTemplate(ui('Miner fee tron resources bandwidth value'), {
    bandwidth: feeQuote.value.availableBandwidth,
  }),
);

const activationNote = computed(() =>
  fillMinerFeeUiTemplate(ui('Miner fee tron activation note'), {
    trx: feeQuote.value.activationExtraTrx,
  }),
);

const estimatedCostPrimary = computed(() =>
  fillMinerFeeUiTemplate(ui('Miner fee tron estimated cost primary'), {
    usd: feeQuote.value.estimatedUsd,
  }),
);

const estimatedCostOriginal = computed(() =>
  fillMinerFeeUiTemplate(ui('Miner fee tron estimated cost original'), {
    usd: feeQuote.value.estimatedUsdOriginal,
  }),
);

function onConfirm() {
  emit('confirm', {
    displayValue: buildTronMinerFeeDisplay(feeQuote.value),
  });
}

const batchTotalDisplay = computed(() =>
  buildTronMinerFeeBatchTotalDisplay(props.transactionCount),
);

defineExpose({
  attemptConfirm: onConfirm,
  confirmDisabled: computed(() => false),
});
</script>

<template>
  <div :class="styles.minerFeeListPage" data-miner-fee-tron>
    <div :class="styles.minerFeeRoot" data-miner-fee-screen="list">
      <section :class="styles.minerFeeTronBody">
        <div :class="styles.minerFeeTronSection">
          <div :class="styles.minerFeeTronResourcesSummary">
            <div :class="styles.minerFeeTronSectionTitleRow">
              <p :class="styles.minerFeeTronSectionTitle">
                {{ ui('Miner fee tron resources title') }}
              </p>
              <EgTooltip
                :class="styles.minerFeeTronResourcesInfoTooltipRoot"
                panel-kind="flotation"
                trigger="hover"
                placement="bottom"
                align="end"
                boundary-selector=".eds-popover"
                close-on-scroll
                width-mode="adaptive"
                :max-width="TEXT_OVERFLOW_TOOLTIP_MAX_WIDTH"
                height-mode="adaptive"
                :scrollable="false"
                :token-scope-class="`${TEXT_OVERFLOW_TOOLTIP_TOKEN_SCOPE} ${styles.minerFeeTronResourcesInfoTooltipScope}`"
                :open-delay="FLOTATION_OVERFLOW_OPEN_DELAY"
                :close-delay="FLOTATION_OVERFLOW_CLOSE_DELAY"
              >
                <EgIconButton
                  shape="square"
                  size="xs"
                  data-eds-trigger-metrics
                  :class="styles.minerFeeTronResourcesInfoButton"
                  :label="ui('Miner fee tron resources info aria label')"
                  @click.stop
                >
                  <EgIcon
                    :class="styles.minerFeeTronResourcesInfoIconOutline"
                    name="eds-information"
                    fit
                  />
                  <EgIcon
                    :class="styles.minerFeeTronResourcesInfoIconFill"
                    name="eds-information-fill"
                    fit
                  />
                </EgIconButton>

                <template #content>
                  <div :class="styles.minerFeeTronResourcesInfoTooltip">
                    <p :class="styles.minerFeeTronResourcesInfoLead">
                      {{ ui('Miner fee tron resources info lead') }}
                    </p>

                    <div :class="styles.minerFeeTronResourcesInfoSection">
                      <p :class="styles.minerFeeTronResourcesInfoHeading">
                        {{ ui('Miner fee tron resources info bandwidth label') }}
                      </p>
                      <p :class="styles.minerFeeTronResourcesInfoBody">
                        {{ ui('Miner fee tron resources info bandwidth body') }}
                      </p>
                    </div>

                    <div :class="styles.minerFeeTronResourcesInfoSection">
                      <p :class="styles.minerFeeTronResourcesInfoHeading">
                        {{ ui('Miner fee tron resources info energy label') }}
                      </p>
                      <p :class="styles.minerFeeTronResourcesInfoBody">
                        {{ ui('Miner fee tron resources info energy body') }}
                      </p>
                      <p :class="styles.minerFeeTronResourcesInfoFootnote">
                        {{ ui('Miner fee tron resources info footnote') }}
                      </p>
                    </div>
                  </div>
                </template>
              </EgTooltip>
            </div>
            <p :class="styles.minerFeeTronResourcesSummaryBody">
              {{ requiredResourcesSummaryLine }}
            </p>
          </div>

          <div :class="styles.minerFeeTronResourcesSummary">
            <p :class="styles.minerFeeTronSectionTitle">
              {{ ui('Miner fee tron resources available title') }}
            </p>
            <div :class="styles.minerFeeTronResourcesSummaryValueRow">
              <span :class="styles.minerFeeTronResourcesSummaryBody">
                {{ availableEnergyLine }}
              </span>
              <EgDivider type="navigator" direction="vertical" />
              <span :class="styles.minerFeeTronResourcesSummaryBody">
                {{ availableBandwidthLine }}
              </span>
            </div>
          </div>
        </div>

        <div :class="styles.minerFeeTronActivationFeedback">
          <EgFormSubmission
            type="notes"
            :text="activationNote"
            :show-link="false"
          />
        </div>

        <EgDivider type="page" :class="styles.minerFeeTronInnerDivider" />

        <div :class="styles.minerFeeTronSection">
          <p :class="styles.minerFeeTronPaymentLabel">
            {{ ui('Miner fee tron payment mode') }}
          </p>

          <div :class="styles.minerFeeTronPaymentCard">
            <div :class="styles.minerFeeTronPaymentHeader">
              <span :class="styles.minerFeeTronPaymentModeName">
                {{ ui('Miner fee tron energy mode') }}
              </span>
              <span :class="styles.minerFeeTronPaymentTags">
                <EgTag family="colorful" colorful-style="coral" size="sm">
                  {{ ui('Miner fee tron save percent') }}
                </EgTag>
              </span>
            </div>

            <p :class="styles.minerFeeTronProviderNote">
              {{ ui('Miner fee tron provider note') }}
            </p>

            <p :class="styles.minerFeeTronEstimatedCost">
              {{ estimatedCostPrimary }}
              <span :class="styles.minerFeeTronEstimatedCostOriginal">
                {{ estimatedCostOriginal }}
              </span>
            </p>
          </div>

          <div :class="styles.minerFeeTronPaymentBalanceFeedback">
            <EgFormSubmission
              type="danger"
              :text="ui('Miner fee tron team balance insufficient text')"
              :link-label="ui('Miner fee tron team balance recharge link')"
            />
          </div>
        </div>
      </section>

      <MinerFeeBatchAppendix
        symbol="TRX"
        profile-kind="tron"
        :transaction-count="transactionCount"
        :batch-total-display="batchTotalDisplay"
      />
    </div>

    <div
      v-if="!hideInlineConfirm"
      :class="[styles.minerFeeFooter, styles.minerFeeFooterTron]"
    >
      <EgComboPopupButton
        tone="decor"
        :count="1"
        :confirm-label="ui('Confirm')"
        @confirm="onConfirm"
      />
    </div>
  </div>
</template>
