<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgComboTextarea, EgFormSubmission } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import styles from './InputPreview.module.css';
import { comboTextareaItemPropRows, comboTextareaItemSlotRows } from './inputSubPreviewData';
import {
  comboImportCode,
  comboTextareaItemCustomizeDefaults,
  comboTextareaItemFormSubmissionCustomizeControls,
  comboTextareaItemNestedTextareaCustomizeControls,
  comboTextareaItemShellCustomizeControls,
} from './inputDocCustomize';
import {
  buildFormSubmissionUsageSnippet,
  formSubmissionPropsFromCustomizeState,
} from './feedbackDocCustomize';

const comboTextareaValue = ref('');
const comboTextareaCustomize = reactive({
  ...comboTextareaItemCustomizeDefaults,
  type: comboTextareaItemCustomizeDefaults.type as 'notes' | 'danger' | 'success',
});

const formSubmissionPreviewProps = computed(() =>
  formSubmissionPropsFromCustomizeState(comboTextareaCustomize),
);

const comboTextareaUsageSnippet = computed(() => {
  const openTag = buildVueSelfClosingSnippet('EgComboTextarea', comboTextareaCustomize, {
    defaults: comboTextareaItemCustomizeDefaults,
    vModel: 'value',
    omitKeys: ['type', 'text', 'linkLabel', 'showLink'],
  })
    .replace(/\s*\/>$/, '')
    .trim();

  if (!comboTextareaCustomize.feedback) {
    return `${openTag} />`;
  }

  const feedbackInner = buildFormSubmissionUsageSnippet(comboTextareaCustomize)
    .replace(/^/gm, '    ')
    .trim();

  return `${openTag}>\n  <template #feedback>\n    ${feedbackInner}\n  </template>\n</EgComboTextarea>`;
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="comboTextareaCustomize"
      title="Combo Textarea Item"
      doc-tier="scenes"
      component-tag="EgComboTextarea"
      :import-code="comboImportCode"
      :customize-controls="comboTextareaItemShellCustomizeControls"
      :customize-defaults="comboTextareaItemCustomizeDefaults"
      :prop-rows="comboTextareaItemPropRows"
      :slot-rows="comboTextareaItemSlotRows"
      :usage-snippet-override="comboTextareaUsageSnippet"
      props-section-id="input-combo-textarea-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgComboTextarea
            v-model="comboTextareaValue"
            :label="String(comboTextareaCustomize.label)"
            :feedback="Boolean(comboTextareaCustomize.feedback)"
            :placeholder="String(comboTextareaCustomize.placeholder)"
          >
            <template v-if="comboTextareaCustomize.feedback" #feedback>
              <EgFormSubmission v-bind="formSubmissionPreviewProps" />
            </template>
          </EgComboTextarea>
        </div>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="comboTextareaCustomize"
            title="EgTextarea"
            nested
            embedded
            :controls="comboTextareaItemNestedTextareaCustomizeControls"
          />
          <CustomizePanel
            v-if="comboTextareaCustomize.feedback"
            v-model="comboTextareaCustomize"
            title="EgFormSubmission"
            nested
            embedded
            :controls="comboTextareaItemFormSubmissionCustomizeControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
