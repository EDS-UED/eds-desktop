<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  EgFilter,
  createFilterTranslate,
  type EgFilterCondition,
  type EgFilterFieldKind,
  type EgFilterLogicMode,
} from '@eds/desktop-components';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { createDocCustomizeState } from '@/views/shared/componentDoc/customizeState';
import styles from './InputPreview.module.css';
import {
  filterEventRows,
  filterImportCode,
  filterPropRows,
  filterSlotRows,
} from './filterPreviewData';
import {
  buildFilterUsageSnippet,
  createInitialFilterConditions,
  filterCustomizeControls,
  filterCustomizeDefaults,
  filterFieldCustomizeControls,
  syncFieldEditorFromKind,
  resolveFilterPreviewProps,
  resolveFilterSceneComponentTag,
} from './filterDocCustomize';

const { locale } = useShowcaseLocale();

const customize = createDocCustomizeState<typeof filterCustomizeDefaults>(
  filterCustomizeDefaults,
);

const filterTranslate = computed(() => createFilterTranslate(locale.value));

const conditions = ref<EgFilterCondition[]>(createInitialFilterConditions(customize));
const logicMode = ref<EgFilterLogicMode>('all');

watch(
  () => customize.kind,
  (kind) => {
    syncFieldEditorFromKind(customize, kind as EgFilterFieldKind);
  },
);

watch(
  () => customize.selectionMode,
  () => {
    conditions.value = conditions.value.map((condition) => ({
      ...condition,
      value: '',
    }));
  },
);

watch(
  () => [customize.initialConditionCount, customize.maxConditions],
  () => {
    conditions.value = createInitialFilterConditions(customize);
  },
);

const filterProps = computed(() => resolveFilterPreviewProps(customize));
const usageSnippet = computed(() => buildFilterUsageSnippet(customize));

const importCode = filterImportCode;
const propsSectionId = 'filter-props';
const propRows = filterPropRows;

const visibleCustomizeControls = filterCustomizeControls;

function onResetPreview() {
  conditions.value = createInitialFilterConditions(customize);
  logicMode.value = 'all';
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Filter"
      doc-tier="organism"
      compact-preview
      effect-panel-preview
      :show-doc-title="false"
      :component-tag="resolveFilterSceneComponentTag()"
      :import-code="importCode"
      :customize-controls="visibleCustomizeControls"
      :customize-defaults="filterCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="propRows"
      :event-rows="filterEventRows"
      :slot-rows="filterSlotRows"
      :props-section-id="propsSectionId"
      @reset-preview="onResetPreview"
    >
      <template #customize-after>
        <CustomizePanel
          v-model="customize"
          hide-title
          sequential
          :row-columns="3"
          :controls="filterFieldCustomizeControls"
        />
      </template>

      <template #preview>
        <div
          class="desktopTokens eds-filter-preview"
          :class="docStyles.previewEffectPanelHost"
        >
          <EgFilter
            v-model="conditions"
            v-model:logic-mode="logicMode"
            :translate="filterTranslate"
            v-bind="filterProps"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
