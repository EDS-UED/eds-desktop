<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgComboInput, EgFormSubmission, EgInput } from '@eds/desktop-components';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { showcaseInputPlaceholderDemo } from '@/data/i18n/showcaseDemoText';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import styles from './InputPreview.module.css';
import { comboInputItemPropRows, comboInputItemSlotRows } from './inputSubPreviewData';
import {
  comboImportCode,
  comboInputItemCustomizeDefaults,
  comboInputItemFormSubmissionCustomizeControls,
  comboInputItemNestedInputCustomizeControls,
  comboInputItemShellCustomizeControls,
  comboInputItemShellProps,
  comboNestedInputProps,
  inputCustomizeDefaults,
} from './inputDocCustomize';
import {
  buildFormSubmissionUsageSnippet,
  formSubmissionPropsFromCustomizeState,
} from './feedbackDocCustomize';
import {
  buildWidthModeUsageSnippet,
  previewFixedWidthStyle,
  resolveEgInputWidthMode,
  type ShowcaseInputWidthMode,
} from './inputPreviewWidth';

const { display } = useShowcaseDisplayText();
const comboInputValue = ref('');

const comboInputCustomize = reactive({
  ...comboInputItemCustomizeDefaults,
  type: comboInputItemCustomizeDefaults.type as 'standard' | 'amount',
  size: comboInputItemCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  widthMode: comboInputItemCustomizeDefaults.widthMode as ShowcaseInputWidthMode,
  submissionType: comboInputItemCustomizeDefaults.submissionType as 'notes' | 'danger' | 'success',
});

const comboInputPreviewStyle = computed(() =>
  previewFixedWidthStyle(comboInputCustomize.widthMode, comboInputCustomize.fixedWidth),
);

const comboInputPreviewHostClass = computed(() =>
  comboInputCustomize.widthMode === 'full'
    ? docStyles.previewInputHost
    : docStyles.subPreviewWidth,
);

const comboInputPreviewUnit = computed(() => {
  const unit = String(comboInputCustomize.unit ?? '');
  if (unit) return unit;
  return comboInputCustomize.type === 'amount' ? 'ETH' : undefined;
});

const formSubmissionPreviewProps = computed(() =>
  formSubmissionPropsFromCustomizeState(comboInputCustomize, 'submission'),
);

function onComboInputMax() {
  comboInputValue.value = '100';
}

const comboInputUsageSnippet = computed(() => {
  const shellDefaults = {
    label: comboInputItemCustomizeDefaults.label,
    feedback: comboInputItemCustomizeDefaults.feedback,
  };
  const openTag = buildVueSelfClosingSnippet(
    'EgComboInput',
    comboInputItemShellProps(comboInputCustomize),
    { defaults: shellDefaults },
  )
    .replace(/\s*\/>$/, '')
    .trim();

  const inner = buildWidthModeUsageSnippet(
    'EgInput',
    comboNestedInputProps(comboInputCustomize),
    { defaults: inputCustomizeDefaults, vModel: 'value' },
    buildVueSelfClosingSnippet,
  );

  const feedbackSlot = comboInputCustomize.feedback
    ? `\n  <template #feedback>\n    ${buildFormSubmissionUsageSnippet(comboInputCustomize, 'submission').replace(/^/gm, '    ').trim()}\n  </template>`
    : '';

  return `${openTag}>\n  ${inner}${feedbackSlot}\n</EgComboInput>`;
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="comboInputCustomize"
      title="Combo Input Item"
      doc-tier="scenes"
      component-tag="EgComboInput"
      :import-code="comboImportCode"
      :customize-controls="comboInputItemShellCustomizeControls"
      :customize-defaults="comboInputItemCustomizeDefaults"
      :prop-rows="comboInputItemPropRows"
      :slot-rows="comboInputItemSlotRows"
      :usage-snippet-override="comboInputUsageSnippet"
      props-section-id="input-combo-input-props"
      @reset-preview="comboInputValue = ''"
    >
      <template #preview>
        <div class="desktopTokens" :class="comboInputPreviewHostClass">
          <EgComboInput
            :label="String(comboInputCustomize.label)"
            :feedback="Boolean(comboInputCustomize.feedback)"
          >
            <EgInput
              v-if="!comboInputCustomize.disabled"
              v-model="comboInputValue"
              :style="comboInputPreviewStyle"
              :type="comboInputCustomize.type as 'standard' | 'amount'"
              :size="comboInputCustomize.size as 'lg' | 'md' | 'sm'"
              :width-mode="resolveEgInputWidthMode(comboInputCustomize.widthMode)"
              :placeholder="display(String(comboInputCustomize.placeholder))"
              :readonly="Boolean(comboInputCustomize.readonly)"
              :unit="comboInputPreviewUnit"
              :clearable="Boolean(comboInputCustomize.clearable)"
              :show-max="Boolean(comboInputCustomize.showMax)"
              :max-label="String(comboInputCustomize.maxLabel)"
              @max="onComboInputMax"
            />
            <EgInput
              v-else
              :model-value="display(showcaseInputPlaceholderDemo)"
              :style="comboInputPreviewStyle"
              :type="comboInputCustomize.type as 'standard' | 'amount'"
              :size="comboInputCustomize.size as 'lg' | 'md' | 'sm'"
              :width-mode="resolveEgInputWidthMode(comboInputCustomize.widthMode)"
              :placeholder="display(String(comboInputCustomize.placeholder))"
              disabled
              :readonly="Boolean(comboInputCustomize.readonly)"
              :unit="comboInputPreviewUnit"
              :clearable="Boolean(comboInputCustomize.clearable)"
              :show-max="Boolean(comboInputCustomize.showMax)"
              :max-label="String(comboInputCustomize.maxLabel)"
            />
            <template v-if="comboInputCustomize.feedback" #feedback>
              <EgFormSubmission v-bind="formSubmissionPreviewProps" />
            </template>
          </EgComboInput>
        </div>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="comboInputCustomize"
            title="EgInput"
            nested
            embedded
            :controls="comboInputItemNestedInputCustomizeControls"
          />
          <CustomizePanel
            v-if="comboInputCustomize.feedback"
            v-model="comboInputCustomize"
            title="EgFormSubmission"
            nested
            embedded
            :controls="comboInputItemFormSubmissionCustomizeControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
