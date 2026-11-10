<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgAmountInput } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import styles from './InputPreview.module.css';
import { amountInputEventRows, amountInputPropRows } from './inputSubPreviewData';
import {
  amountInputCustomizeControls,
  amountInputCustomizeDefaults,
  amountInputImportCode,
} from './inputDocCustomize';
import {
  buildWidthModeUsageSnippet,
  previewFixedWidthStyle,
} from './inputPreviewWidth';

const amountValue = ref('');
const amountCustomize = reactive({
  ...amountInputCustomizeDefaults,
  widthMode: amountInputCustomizeDefaults.widthMode as 'fixed' | 'full',
});

const amountPreviewStyle = computed(() =>
  previewFixedWidthStyle(amountCustomize.widthMode, amountCustomize.fixedWidth),
);

const amountUsageSnippet = computed(() =>
  buildWidthModeUsageSnippet(
    'EgAmountInput',
    amountCustomize,
    { defaults: amountInputCustomizeDefaults, vModel: 'value' },
    buildVueSelfClosingSnippet,
  ),
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="amountCustomize"
      title="Amount Input"
      doc-tier="scenes"
      :show-doc-title="false"
      component-tag="EgAmountInput"
      :import-code="amountInputImportCode"
      :customize-controls="amountInputCustomizeControls"
      :customize-defaults="amountInputCustomizeDefaults"
      :usage-snippet-override="amountUsageSnippet"
      :prop-rows="amountInputPropRows"
      :event-rows="amountInputEventRows"
      props-section-id="input-amount-input-props"
      @reset-preview="amountValue = ''"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgAmountInput
            v-if="!amountCustomize.disabled"
            v-model="amountValue"
            :style="amountPreviewStyle"
            :amount-placeholder="String(amountCustomize.amountPlaceholder)"
            :unit="String(amountCustomize.unit)"
            :width-mode="amountCustomize.widthMode as 'fixed' | 'full'"
            :readonly="Boolean(amountCustomize.readonly)"
            :clearable="Boolean(amountCustomize.clearable)"
            :show-max="Boolean(amountCustomize.showMax)"
            :max-label="String(amountCustomize.maxLabel)"
          />
          <EgAmountInput
            v-else
            model-value=""
            :style="amountPreviewStyle"
            :amount-placeholder="String(amountCustomize.amountPlaceholder)"
            :unit="String(amountCustomize.unit)"
            :width-mode="amountCustomize.widthMode as 'fixed' | 'full'"
            :clearable="Boolean(amountCustomize.clearable)"
            :show-max="Boolean(amountCustomize.showMax)"
            :max-label="String(amountCustomize.maxLabel)"
            disabled
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
