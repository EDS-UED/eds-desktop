<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  EgContainer,
  EgIcon,
  EgLayout,
  EgModuleMenu,
  EgModuleMenuGroup,
  EgModuleMenuItem,
  EgPaginer,
  EgPaginationGroupButton,
  EgSkid,
  EgToolBar,
} from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import ContainerBoxPreviewShell from './ContainerBoxPreviewShell.vue';
import DataListPreviewNest from './DataListPreviewNest.vue';
import NavBarPreviewNest from './NavBarPreviewNest.vue';
import previewStyles from './LayoutPreview.module.css';
import {
  DATA_LIST_FIGMA_PAGINER,
  DATA_LIST_FIGMA_TOOLBAR,
} from './dataListPagePreviewData';
import {
  buildModuleMenuPreviewGroups,
  resolveModuleMenuPreviewTitle,
} from './moduleMenuPreviewGroups';
import {
  ORGANISM_IMPORT,
  buildLayoutUsageSnippet,
  layoutCustomizeControls,
  layoutCustomizeDefaults,
  layoutPropRowsForType,
  layoutSlotRowsForType,
  moduleMenuCustomizeDefaults,
} from './organismTemplateDocData';

type LayoutShellType = 'empty' | 'free';

type FreeLayoutToggleSnapshot = {
  showNavBar: boolean;
  showModuleMenu: boolean;
  showToolbar: boolean;
  showPaginer: boolean;
  showDataList: boolean;
  showSkid: boolean;
};

const freeLayoutToggleSnapshot = reactive<FreeLayoutToggleSnapshot>({
  showNavBar: layoutCustomizeDefaults.showNavBar,
  showModuleMenu: layoutCustomizeDefaults.showModuleMenu,
  showToolbar: layoutCustomizeDefaults.showToolbar,
  showPaginer: layoutCustomizeDefaults.showPaginer,
  showDataList: layoutCustomizeDefaults.showDataList,
  showSkid: layoutCustomizeDefaults.showSkid,
});

function readFreeLayoutToggleSnapshot(customize: Record<string, unknown>): FreeLayoutToggleSnapshot {
  return {
    showNavBar: Boolean(customize.showNavBar),
    showModuleMenu: Boolean(customize.showModuleMenu),
    showToolbar: Boolean(customize.showToolbar),
    showPaginer: Boolean(customize.showPaginer),
    showDataList: Boolean(customize.showDataList),
    showSkid: Boolean(customize.showSkid),
  };
}

function clearStandaloneMainConflicts(customize: Record<string, unknown>) {
  customize.showToolbar = false;
  customize.showPaginer = false;
}

function clearDataListConflict(customize: Record<string, unknown>) {
  customize.showDataList = false;
}

const customize = reactive({
  type: layoutCustomizeDefaults.type as LayoutShellType,
  pageBg: layoutCustomizeDefaults.pageBg as 'none' | 'right' | 'center',
  ...freeLayoutToggleSnapshot,
});

watch(
  () => customize.type,
  (nextType, previousType) => {
    if (previousType === 'free') {
      Object.assign(freeLayoutToggleSnapshot, readFreeLayoutToggleSnapshot(customize));
    }

    if (nextType === 'free') {
      Object.assign(customize, freeLayoutToggleSnapshot);
    }
  },
);

watch(
  () => customize.showDataList,
  (enabled) => {
    if (!enabled || customize.type === 'empty') return;
    clearStandaloneMainConflicts(customize);
  },
);

watch(
  () => customize.showToolbar,
  (enabled) => {
    if (!enabled || customize.type === 'empty') return;
    clearDataListConflict(customize);
  },
);

watch(
  () => customize.showPaginer,
  (enabled) => {
    if (!enabled || customize.type === 'empty') return;
    clearDataListConflict(customize);
  },
);

const isEmptyLayout = computed(() => customize.type === 'empty');
const isFreeLayout = computed(() => customize.type === 'free');
const showStandaloneToolbarPaginer = computed(() => !customize.showDataList);
/** Skid 面板开合（与定制区 showSkid 解耦，保留 slot 以播放关闭推动动效）。 */
const skidOpen = ref(Boolean(customize.showSkid));

watch(
  () => customize.showSkid,
  (enabled) => {
    skidOpen.value = Boolean(enabled);
  },
  { immediate: true },
);

const moduleMenuPreviewGroups = computed(() =>
  buildModuleMenuPreviewGroups(moduleMenuCustomizeDefaults),
);

const moduleMenuPreviewTitle = computed(() =>
  resolveModuleMenuPreviewTitle(moduleMenuCustomizeDefaults),
);

const usageSnippet = computed(() => buildLayoutUsageSnippet(customize));

const docComponentTag = computed(() => (isEmptyLayout.value ? 'EgContainer' : 'EgLayout'));

const docPropRows = computed(() => layoutPropRowsForType(customize.type));

const docSlotRows = computed(() => layoutSlotRowsForType(customize.type));
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Layout"
      :show-doc-title="false"
      :component-tag="docComponentTag"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="layoutCustomizeControls"
      :customize-defaults="layoutCustomizeDefaults"
      :prop-rows="docPropRows"
      :slot-rows="docSlotRows"
      :usage-snippet-override="usageSnippet"
      props-section-id="layout-props"
    >
      <template #preview>
        <div
          class="desktopTokens"
          :class="[
            docStyles.previewEffectPanelHost,
            previewStyles.previewLayoutHost,
          ]"
        >
          <ContainerBoxPreviewShell>
            <EgContainer
              v-if="isEmptyLayout"
              :page-bg="customize.pageBg"
            />
            <EgContainer v-else-if="isFreeLayout" :class="previewStyles.layoutShell">
              <EgLayout
                type="free"
                :show-toolbar="showStandaloneToolbarPaginer && Boolean(customize.showToolbar)"
                :show-paginer="showStandaloneToolbarPaginer && Boolean(customize.showPaginer)"
                v-model:show-skid="skidOpen"
              >
                <template v-if="customize.showNavBar" #nav>
                  <NavBarPreviewNest />
                </template>

                <template v-if="customize.showModuleMenu" #moduleMenu>
                  <EgModuleMenu
                    :title="moduleMenuPreviewTitle"
                    :show-edge-divider="Boolean(moduleMenuCustomizeDefaults.showEdgeDivider)"
                  >
                    <EgModuleMenuGroup
                      v-for="group in moduleMenuPreviewGroups"
                      :key="group.key"
                      :title="group.title"
                    >
                      <template
                        v-for="(item, itemIndex) in group.items"
                        :key="`${group.key}-item-${itemIndex}`"
                      >
                        <EgModuleMenuItem
                          :tier="item.tier"
                          :label="item.label"
                          :message="item.accessory === 'message' ? item.messageText : undefined"
                          :show-reddot="item.accessory === 'reddot'"
                        >
                          <template #icon>
                            <EgIcon :name="item.icon" size="sm" />
                          </template>
                          <template v-if="item.tier === 2">
                            <EgModuleMenuItem
                              v-for="(subItem, subIndex) in item.subitems"
                              :key="`${group.key}-item-${itemIndex}-sub-${subIndex}`"
                              subitem
                              :label="subItem.label"
                            >
                              <template #icon>
                                <EgIcon :name="subItem.icon" size="sm" />
                              </template>
                            </EgModuleMenuItem>
                          </template>
                        </EgModuleMenuItem>
                      </template>
                    </EgModuleMenuGroup>
                  </EgModuleMenu>
                </template>

                <template v-if="showStandaloneToolbarPaginer && customize.showToolbar" #toolbar>
                  <EgToolBar
                    :title="DATA_LIST_FIGMA_TOOLBAR.title"
                    :show-back="DATA_LIST_FIGMA_TOOLBAR.showBack"
                    :show-operation="DATA_LIST_FIGMA_TOOLBAR.showOperation"
                    :show-section="DATA_LIST_FIGMA_TOOLBAR.showSection"
                    :show-divider="DATA_LIST_FIGMA_TOOLBAR.showDivider"
                  />
                </template>

                <DataListPreviewNest
                  v-if="customize.showDataList"
                  :layout-skid-open="skidOpen"
                />
                <div v-else :class="previewStyles.mainRegion">
                  <div :class="previewStyles.mainPlaceholder">主内容</div>
                </div>

                <template v-if="showStandaloneToolbarPaginer && customize.showPaginer" #paginer>
                  <EgPaginer
                    :data-volume-count="DATA_LIST_FIGMA_PAGINER.dataVolumeCount"
                    :data-volume-total="DATA_LIST_FIGMA_PAGINER.dataVolumeTotal"
                    :data-volume-results="DATA_LIST_FIGMA_PAGINER.dataVolumeResults"
                    :show-statistics="DATA_LIST_FIGMA_PAGINER.showStatistics"
                  >
                    <EgPaginationGroupButton label="1" selected />
                    <EgPaginationGroupButton label="2" />
                  </EgPaginer>
                </template>

                <template v-if="customize.showSkid" #skid>
                  <EgSkid />
                </template>
              </EgLayout>
            </EgContainer>
          </ContainerBoxPreviewShell>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
