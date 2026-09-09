<script setup lang="ts">
import { computed } from 'vue';
import { EgComboPopupButton } from '../combo';
import { EgDivider } from '../../atoms/divider';
import { EgFormSubmission } from '../feedback';
import { provideMinerFeeTranslate, type MinerFeeTranslate } from './minerFeeTranslate';
import type { MinerFeeConfirmPayload } from './minerFeeTypes';
import {
  minerFeeBatchStubMessageKey,
  minerFeeBatchStubStreamerMessageKey,
  parseMinerFeeBatchStubBlocks,
  resolveMinerFeeBatchStubKind,
  type MinerFeeBatchProfileKind,
} from './minerFeeBatchStub';
import styles from './MinerFeePopoverPanel.module.css';

const props = withDefaults(
  defineProps<{
    translate: MinerFeeTranslate;
    symbol: string;
    profileKind: MinerFeeBatchProfileKind;
    /** 多笔：>1 时展示批量矿工费说明（无费率配置）。 */
    transactionCount?: number;
    hideInlineConfirm?: boolean;
  }>(),
  {
    transactionCount: 1,
    hideInlineConfirm: false,
  },
);

const emit = defineEmits<{
  confirm: [selection: MinerFeeConfirmPayload];
}>();

provideMinerFeeTranslate(props.translate);

const stubKind = computed(() =>
  resolveMinerFeeBatchStubKind(
    props.symbol,
    props.profileKind,
    props.transactionCount,
  ),
);

const stubMessage = computed(() => {
  const kind = stubKind.value;
  return kind ? props.translate(minerFeeBatchStubMessageKey(kind)) : '';
});

const stubBlocks = computed(() =>
  parseMinerFeeBatchStubBlocks(stubKind.value, stubMessage.value),
);

function onConfirm() {
  emit('confirm', {
    displayValue: stubMessage.value,
  });
}

defineExpose({
  attemptConfirm: onConfirm,
  confirmDisabled: computed(() => false),
});
</script>

<template>
  <div
    :class="[
      styles.minerFeeListPage,
      hideInlineConfirm && styles.minerFeeListPagePopupToolbar,
    ]"
    data-miner-fee-batch-stub
  >
    <div :class="styles.minerFeeRoot" data-miner-fee-screen="list">
      <div
        v-if="stubKind === 'tron'"
        :class="styles.minerFeeStubTronLayout"
      >
        <div :class="styles.minerFeeStubMessageStack">
          <template
            v-for="(block, index) in stubBlocks"
            :key="index"
          >
            <p
              v-if="block.kind === 'lead' || block.kind === 'text'"
              :class="styles.minerFeeStubMessage"
            >
              {{ block.text }}
            </p>
            <div
              v-else
              :class="styles.minerFeeStubStepSection"
            >
              <p :class="styles.minerFeeStubStepTitle">
                {{ block.title }}
              </p>
              <p :class="styles.minerFeeStubStepBody">
                {{ block.body }}
              </p>
            </div>
          </template>
        </div>
        <EgDivider type="page" :class="styles.minerFeeTronInnerDivider" />
        <div :class="styles.minerFeeTronActivationFeedback">
          <EgFormSubmission
            type="notes"
            :text="translate(minerFeeBatchStubStreamerMessageKey())"
            :show-link="false"
          />
        </div>
      </div>
      <template v-else>
        <template
          v-for="(block, index) in stubBlocks"
          :key="index"
        >
          <p
            v-if="block.kind === 'lead' || block.kind === 'text'"
            :class="styles.minerFeeStubMessage"
          >
            {{ block.text }}
          </p>
          <div
            v-else
            :class="styles.minerFeeStubStepSection"
          >
            <p :class="styles.minerFeeStubStepTitle">
              {{ block.title }}
            </p>
            <p :class="styles.minerFeeStubStepBody">
              {{ block.body }}
            </p>
          </div>
        </template>
      </template>
    </div>

    <div v-if="!hideInlineConfirm" :class="styles.minerFeeFooter">
      <EgComboPopupButton
        tone="decor"
        :count="1"
        :confirm-label="translate('Confirm')"
        @confirm="onConfirm"
      />
    </div>
  </div>
</template>
