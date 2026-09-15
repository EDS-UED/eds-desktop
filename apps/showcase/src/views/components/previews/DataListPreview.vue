<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import { showcaseText } from '@/data/showcasePropLabels';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import PropsDocTables from '@/views/shared/componentDoc/PropsDocTables.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import shared from '@/views/shared/showcase.module.css';
import styles from './InputPreview.module.css';
import previewStyles from './DataListPreview.module.css';
import DataListPagePreview from './DataListPagePreview.vue';
import {
  buildDataListPageUsageSnippet,
} from './dataListPagePreviewData';
import {
  ORGANISM_IMPORT,
  dataListColumnPropRows,
  dataListColumnSettingControls,
  dataListCustomizeControls,
  dataListCustomizeDefaults,
  dataListPaginationCustomizeControls,
  dataListPropRows,
  dataListSlotRows,
  dataListToolbarCustomizeControls,
  paginerStatisticsCustomizeControls,
} from './organismTemplateDocData';
import {
  iconButtonProNestedRowColumns,
  paginerPaginationNestedRowColumns,
} from './buttonDocCustomize';
import { useDataListPagePreview } from './useDataListPagePreview';

const { locale } = useShowcaseLocale();
const { display } = useShowcaseDisplayText();

const customize = reactive({ ...dataListCustomizeDefaults });

const { showStatistics } = useDataListPagePreview(computed(() => customize));

const usageSnippet = computed(() => buildDataListPageUsageSnippet(customize));

const columnSettingsTitle = showcaseText('Column settings', '列设置');
const statisticsTitle = showcaseText('Statistics', '数据统计');
const columnSectionTitle = showcaseText('Columns · EgDataListColumn', '列 EgDataListColumn');

const eventRows = [
  {
    name: 'update:select-mode',
    type: '(enabled: boolean) => void',
    defaultValue: '-',
    description: showcaseText(
      'Multi-select toggle; syncs to false when Batch Bar closes.',
      '多选模式开关；Batch Bar 关闭时同步为 false。',
    ),
  },
  {
    name: 'row-click',
    type: '(row) => void',
    defaultValue: '-',
    description: showcaseText('Row click when not in multi-select mode.', '非多选时点击行。'),
  },
  {
    name: 'update:selected-list',
    type: '(rows) => void',
    defaultValue: '-',
    description: showcaseText(
      'Selected list change (includes _index).',
      '多选列表变更（含 _index）。',
    ),
  },
  {
    name: 'selected-change',
    type: '(rows) => void',
    defaultValue: '-',
    description: showcaseText(
      'Same as update:selected-list.',
      '同 update:selected-list。',
    ),
  },
];

const resolvedColumnSettingsTitle = computed(() => {
  void locale.value;
  return display(columnSettingsTitle);
});

const resolvedStatisticsTitle = computed(() => {
  void locale.value;
  return display(statisticsTitle);
});

const resolvedColumnSectionTitle = computed(() => {
  void locale.value;
  return display(columnSectionTitle);
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      anchor-id="data-list"
      title="DataList"
      :show-doc-title="false"
      component-tag="EgDataList"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="dataListCustomizeControls"
      :customize-defaults="dataListCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="dataListPropRows"
      :event-rows="eventRows"
      :slot-rows="dataListSlotRows"
      props-section-id="data-list-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.previewEffectPanelHost,
            previewStyles.previewOrganismDataListHost,
          ]"
        >
          <div
            :class="[
              previewStyles.pageShell,
              String(customize.pageHeightMode) === 'adaptive'
                ? previewStyles.pageShellAdaptive
                : previewStyles.pageShellFixed,
            ]"
          >
            <DataListPagePreview :customize="customize" :use-page-shell="false" />
          </div>
        </div>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="customize"
            nested
            embedded
            sequential
            :row-columns="iconButtonProNestedRowColumns"
            title="EgIconProButton"
            :controls="dataListToolbarCustomizeControls"
          />
          <CustomizePanel
            v-model="customize"
            nested
            embedded
            sequential
            :row-columns="3"
            :title="resolvedColumnSettingsTitle"
            :controls="dataListColumnSettingControls"
          />
          <CustomizePanel
            v-model="customize"
            nested
            embedded
            sequential
            :row-columns="paginerPaginationNestedRowColumns"
            title="EgPaginationGroupButton"
            :controls="dataListPaginationCustomizeControls"
          />
          <CustomizePanel
            v-if="showStatistics"
            v-model="customize"
            nested
            embedded
            sequential
            :title="resolvedStatisticsTitle"
            :controls="paginerStatisticsCustomizeControls"
          />
        </div>
      </template>

      <section id="data-list-column-props" :class="shared.section">
        <h2 :class="shared.sectionTitle">{{ resolvedColumnSectionTitle }}</h2>
        <PropsDocTables bare :show-title="false" :prop-rows="dataListColumnPropRows" />
      </section>
    </ComponentDocLayout>
  </div>
</template>
