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
  filterScenePropRows,
  resolveFilterPreviewProps,
  resolveFilterSceneAnchorId,
  resolveFilterSceneComponentTag,
  resolveFilterSceneImportCode,
  type FilterScenario,
} from './filterDocCustomize';

const props = withDefaults(
  defineProps<{
    initialScenario?: FilterScenario;
    lockScenario?: boolean;
    pageTitle?: string;
  }>(),
  {
    lockScenario: false,
  },
);

const { locale } = useShowcaseLocale();

const customize = createDocCustomizeState<typeof filterCustomizeDefaults>(
  filterCustomizeDefaults,
  props.initialScenario ? { scenario: props.initialScenario } : undefined,
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
  () => customize.conditionType,
  () => {
    conditions.value = conditions.value.map((condition) => ({
      ...condition,
      operatorId: 'equals',
      value: '',
    }));
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
  () => [customize.scenario, customize.initialConditionCount, customize.maxConditions],
  () => {
    conditions.value = createInitialFilterConditions(customize);
  },
);

const filterProps = computed(() => resolveFilterPreviewProps(customize));
const usageSnippet = computed(() => buildFilterUsageSnippet(customize));

const importCode = computed(() =>
  props.lockScenario && props.initialScenario
    ? resolveFilterSceneImportCode(props.initialScenario)
    : filterImportCode,
);

const propsSectionId = computed(() =>
  props.initialScenario
    ? `${resolveFilterSceneAnchorId(props.initialScenario)}-props`
    : 'filter-props',
);

const propRows = computed(() =>
  props.lockScenario ? [...filterPropRows, ...filterScenePropRows] : filterPropRows,
);

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
      :title="pageTitle ?? 'Filter'"
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
