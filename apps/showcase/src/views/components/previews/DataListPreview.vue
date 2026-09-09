<script setup lang="ts">
import { computed, reactive } from 'vue';
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

const customize = reactive({ ...dataListCustomizeDefaults });

const { showStatistics } = useDataListPagePreview(computed(() => customize));

const usageSnippet = computed(() => buildDataListPageUsageSnippet(customize));

const eventRows = [
  {
    name: 'update:select-mode',
    type: '(enabled: boolean) => void',
    defaultValue: '-',
    description: '多选模式开关；Batch Bar 关闭时同步为 false。',
  },
  { name: 'row-click', type: '(row) => void', defaultValue: '-', description: '非多选时点击行。' },
  {
    name: 'update:selected-list',
    type: '(rows) => void',
    defaultValue: '-',
    description: '多选列表变更（含 _index）。',
  },
  {
    name: 'selected-change',
    type: '(rows) => void',
    defaultValue: '-',
    description: '同 update:selected-list。',
  },
];
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
            title="列设置"
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
            title="数据统计"
            :controls="paginerStatisticsCustomizeControls"
          />
        </div>
      </template>

      <section id="data-list-column-props" :class="shared.section">
        <h2 :class="shared.sectionTitle">列 EgDataListColumn</h2>
        <PropsDocTables bare :show-title="false" :prop-rows="dataListColumnPropRows" />
      </section>
    </ComponentDocLayout>
  </div>
</template>
