<script setup lang="ts">
import { computed, toRef } from 'vue';
import {
  EgDivider,
  EgDataList,
  EgDataListCellOverflow,
  EgDataListColumn,
  EgIcon,
  EgIconProButton,
  EgLayout,
  EgPaginer,
  EgPaginationGroupButton,
  EgToolBar,
} from '@eds/desktop-components';
import {
  DATA_LIST_FIGMA_HEADER_HEIGHT,
  DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS,
} from './dataListPagePreviewData';
import DataListColumnCellPreview from './DataListColumnCellPreview.vue';
import DataListHeaderSortTrigger from './DataListHeaderSortTrigger.vue';
import previewStyles from './DataListPreview.module.css';
import { useDataListPagePreview } from './useDataListPagePreview';

const props = withDefaults(
  defineProps<{
    customize: Record<string, unknown>;
    nested?: boolean;
    /** 外层已提供 pageShell 时设为 false（如 Data List 文档页）。 */
    usePageShell?: boolean;
    pageHeightMode?: 'fixed' | 'adaptive';
    layoutSkidOpen?: boolean;
  }>(),
  {
    nested: false,
    usePageShell: true,
    pageHeightMode: 'fixed',
    layoutSkidOpen: false,
  },
);

const customizeRef = toRef(props, 'customize');
const layoutSkidOpenRef = toRef(props, 'layoutSkidOpen');

const selectMode = computed({
  get: () => Boolean(props.customize.selectMode),
  set: (value: boolean) => {
    props.customize.selectMode = value;
  },
});

const {
  DATA_LIST_FIGMA_TOOLBAR,
  DATA_LIST_FIGMA_PAGINER,
  batchButton,
  columnHeight,
  currentPage,
  dataListBatchActions,
  dataListMoreActions,
  firstPagination,
  goFirstPage,
  goLastPage,
  goNextPage,
  goPrevPage,
  isManyPageSelected,
  isManyPagination,
  lastPagination,
  manyPageItems,
  nextNavDisabled,
  nextPagination,
  onBatchAction,
  onBatchClick,
  onManyPageItemClick,
  onSettingsJump,
  onToolbarActionClick,
  paginatedDataList,
  pagePagination,
  prevNavDisabled,
  prevPagination,
  previewColumnSettings,
  settingsJumpValue,
  settingsLevelIndex,
  showBack,
  showBatch,
  showPaginerStatistics,
  showToolBarOperation,
  showToolBarSection,
  skidOpen,
  skidContentLocked,
  statisticsItems,
  toolbarActionButtons,
  totalRowCount,
} = useDataListPagePreview(customizeRef, layoutSkidOpenRef);

const shellClass = computed(() => {
  if (props.nested) {
    return [previewStyles.dataListNest];
  }

  if (!props.usePageShell) {
    return [previewStyles.pageShellFill];
  }

  return [
    previewStyles.pageShell,
    props.pageHeightMode === 'adaptive'
      ? previewStyles.pageShellAdaptive
      : previewStyles.pageShellFixed,
  ];
});
</script>

<template>
  <div :class="shellClass">
    <EgLayout type="empty" show-toolbar show-paginer>
      <template #toolbar>
        <EgToolBar
          :title="DATA_LIST_FIGMA_TOOLBAR.title"
          :show-back="showBack"
          :show-operation="showToolBarOperation"
          :show-divider="DATA_LIST_FIGMA_TOOLBAR.showDivider"
          :show-section="showToolBarSection"
        >
          <template v-if="showBatch" #functional>
            <EgIconProButton
              :label="batchButton.label"
              :badge="batchButton.badge"
              :show-badge="batchButton.showBadge"
              :show-reddot="batchButton.showReddot"
              :disabled="skidContentLocked || batchButton.disabled"
              @click="onBatchClick"
            >
              <EgIcon :name="batchButton.icon" size="sm" />
            </EgIconProButton>
          </template>
          <template v-if="showToolBarSection" #section>
            <EgIconProButton
              v-for="button in toolbarActionButtons"
              :key="button.key"
              :label="button.item.label"
              :badge="button.item.badge"
              :show-badge="button.item.showBadge"
              :show-reddot="button.item.showReddot"
              :disabled="skidContentLocked || button.item.disabled"
              @click="onToolbarActionClick(button.key)"
            >
              <EgIcon :name="button.item.icon" size="sm" />
            </EgIconProButton>
          </template>
          <template v-else #functional>
            <EgIconProButton
              v-for="button in toolbarActionButtons"
              :key="`functional-${button.key}`"
              :label="button.item.label"
              :badge="button.item.badge"
              :show-badge="button.item.showBadge"
              :show-reddot="button.item.showReddot"
              :disabled="skidContentLocked || button.item.disabled"
              @click="onToolbarActionClick(button.key)"
            >
              <EgIcon :name="button.item.icon" size="sm" />
            </EgIconProButton>
          </template>
        </EgToolBar>
      </template>

      <div :class="previewStyles.listRegion">
        <EgDataList
          v-model:select-mode="selectMode"
          :data-list="paginatedDataList"
          :header-height="DATA_LIST_FIGMA_HEADER_HEIGHT"
          :column-height="columnHeight"
          :loading="Boolean(customize.loading)"
          :initing="Boolean(customize.initing)"
          :skid-open="skidOpen"
          :batch-actions="[...dataListBatchActions]"
          :on-batch-action="onBatchAction"
          :primary-action="{ label: 'Action' }"
          :more-actions="[...dataListMoreActions]"
        >
          <EgDataListColumn
            prop="primary"
            :label="previewColumnSettings[0].label"
            :min-width="previewColumnSettings[0].minWidth"
            :align="previewColumnSettings[0].align"
            :sortable="false"
          >
            <template #header>
              <div :class="previewStyles.comboHeader">
                <div :class="previewStyles.comboHeaderSegment">
                  <div :class="previewStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="previewStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ previewColumnSettings[0].label }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    v-if="previewColumnSettings[0].sortable"
                    :label="previewColumnSettings[0].label"
                    :disabled="Boolean(customize.selectMode)"
                  />
                </div>
                <EgDivider type="navigator" direction="vertical" />
                <div :class="previewStyles.comboHeaderSegment">
                  <div :class="previewStyles.comboHeaderSegmentTextWrap">
                    <EgDataListCellOverflow
                      :content-class="previewStyles.comboHeaderSegmentText"
                      context="header"
                    >
                      {{ previewColumnSettings[0].secondaryLabel }}
                    </EgDataListCellOverflow>
                  </div>
                  <DataListHeaderSortTrigger
                    v-if="previewColumnSettings[0].secondarySortable"
                    :label="previewColumnSettings[0].secondaryLabel"
                    :disabled="Boolean(customize.selectMode)"
                  />
                </div>
              </div>
            </template>
            <template #default>
              <DataListColumnCellPreview
                :data-source="previewColumnSettings[0].dataSource"
                :column-min-width="previewColumnSettings[0].minWidth"
                variant="combo"
              />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="meta"
            :label="previewColumnSettings[1].label"
            :min-width="previewColumnSettings[1].minWidth"
            :align="previewColumnSettings[1].align"
            :sortable="previewColumnSettings[1].sortable"
          >
            <template #default>
              <DataListColumnCellPreview
                :data-source="previewColumnSettings[1].dataSource"
                :column-min-width="previewColumnSettings[1].minWidth"
              />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="meta2"
            :label="previewColumnSettings[2].label"
            :min-width="previewColumnSettings[2].minWidth"
            :align="previewColumnSettings[2].align"
            :sortable="previewColumnSettings[2].sortable"
          >
            <template #default>
              <DataListColumnCellPreview
                :data-source="previewColumnSettings[2].dataSource"
                :column-min-width="previewColumnSettings[2].minWidth"
              />
            </template>
          </EgDataListColumn>

          <EgDataListColumn
            prop="actions"
            :label="previewColumnSettings[3].label"
            :min-width="previewColumnSettings[3].minWidth"
            :align="previewColumnSettings[3].align"
            :sortable="previewColumnSettings[3].sortable"
            is-action
          />
        </EgDataList>
      </div>

      <template #paginer>
        <EgPaginer
          v-model:settings-level-index="settingsLevelIndex"
          v-model:settings-jump-value="settingsJumpValue"
          :show-statistics="showPaginerStatistics"
          :statistics-collapse="Boolean(customize.statisticsCollapse)"
          :statistics-items="statisticsItems"
          :data-volume-total="DATA_LIST_FIGMA_PAGINER.dataVolumeTotal"
          :data-volume-count="String(totalRowCount)"
          :data-volume-results="DATA_LIST_FIGMA_PAGINER.dataVolumeResults"
          :settings-level-labels="[...DATA_LIST_FIGMA_PAGE_SIZE_OPTIONS]"
          @settings-jump="onSettingsJump"
        >
          <EgPaginationGroupButton
            :kind="firstPagination.kind"
            :tone="firstPagination.tone"
            :disabled="prevNavDisabled || firstPagination.disabled"
            @click="goFirstPage"
          >
            <EgIcon name="eds-arrow-go-first" fit />
          </EgPaginationGroupButton>
          <EgPaginationGroupButton
            :kind="prevPagination.kind"
            :tone="prevPagination.tone"
            :disabled="prevNavDisabled || prevPagination.disabled"
            @click="goPrevPage"
          >
            <EgIcon name="eds-arrow-left-mini-ios" fit />
          </EgPaginationGroupButton>
          <template v-if="!isManyPagination">
            <EgPaginationGroupButton
              :kind="pagePagination.kind"
              :tone="pagePagination.tone"
              selected
              :disabled="pagePagination.disabled"
              :label="String(currentPage)"
            />
          </template>
          <template v-else>
            <EgPaginationGroupButton
              v-for="(item, index) in manyPageItems"
              :key="`${item.kind}-${item.label}-${index}`"
              :kind="pagePagination.kind"
              :tone="pagePagination.tone"
              :interactive="item.kind !== 'ellipsis'"
              :selected="isManyPageSelected(item, index)"
              :disabled="pagePagination.disabled"
              :label="item.label"
              @click="onManyPageItemClick(item)"
            />
          </template>
          <EgPaginationGroupButton
            :kind="nextPagination.kind"
            :tone="nextPagination.tone"
            :disabled="nextNavDisabled || nextPagination.disabled"
            @click="goNextPage"
          >
            <EgIcon name="eds-arrow-right-mini-ios" fit />
          </EgPaginationGroupButton>
          <EgPaginationGroupButton
            :kind="lastPagination.kind"
            :tone="lastPagination.tone"
            :disabled="nextNavDisabled || lastPagination.disabled"
            @click="goLastPage"
          >
            <EgIcon name="eds-arrow-go-last" fit />
          </EgPaginationGroupButton>
        </EgPaginer>
      </template>
    </EgLayout>
  </div>
</template>
