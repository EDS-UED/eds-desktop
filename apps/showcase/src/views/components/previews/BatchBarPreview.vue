<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import { showcaseText } from '@/data/showcasePropLabels';
import { EgBatchBar } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  ORGANISM_IMPORT,
  batchBarCustomizeControls,
  batchBarCustomizeDefaults,
  batchBarEventRows,
  batchBarPropRows,
  batchBarSlotRows,
  buildBatchBarLabelCustomizeControls,
  buildBatchBarLabelDanger,
  buildBatchBarLabels,
  parseBatchBarLabelCount,
} from './organismTemplateDocData';

const customize = reactive({ ...batchBarCustomizeDefaults });

const { locale } = useShowcaseLocale();
const { display } = useShowcaseDisplayText();

const labelItemPanelTitle = showcaseText('Label item', 'Label 项');

const resolvedLabelItemPanelTitle = computed(() => {
  void locale.value;
  return display(labelItemPanelTitle);
});

const labelPanelControls = computed(() => buildBatchBarLabelCustomizeControls(customize));

const previewLabels = computed(() => buildBatchBarLabels(customize));
const previewLabelDanger = computed(() => {
  const count = parseBatchBarLabelCount(customize);
  void customize.labelCount;
  for (let index = 1; index <= count; index += 1) {
    void customize[`label${index}Danger` as keyof typeof customize];
  }
  return buildBatchBarLabelDanger(customize);
});

const loadingLabelIndex = ref<number | null>(null);
let loadingResetTimer: ReturnType<typeof setTimeout> | undefined;

function onLabelClick(_label: string, index: number) {
  if (loadingResetTimer) {
    clearTimeout(loadingResetTimer);
  }
  loadingLabelIndex.value = index;
  loadingResetTimer = setTimeout(() => {
    loadingLabelIndex.value = null;
    loadingResetTimer = undefined;
  }, 2000);
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="BatchBar"
      compact-preview
      effect-panel-preview
      :show-doc-title="false"
      component-tag="EgBatchBar"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="batchBarCustomizeControls"
      :customize-defaults="batchBarCustomizeDefaults"
      :prop-rows="batchBarPropRows"
      :event-rows="batchBarEventRows"
      :slot-rows="batchBarSlotRows"
      props-section-id="batch-bar-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewEffectPanelHost">
          <EgBatchBar
            :selected-count="customize.selectedCount"
            :count-suffix="String(customize.countSuffix)"
            :labels="previewLabels"
            :label-danger="previewLabelDanger"
            :more-label="String(customize.moreLabel)"
            :loading-label-index="loadingLabelIndex"
            @label-click="onLabelClick"
          />
        </div>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="customize"
            nested
            embedded
            sequential
            :title="resolvedLabelItemPanelTitle"
            :controls="labelPanelControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
