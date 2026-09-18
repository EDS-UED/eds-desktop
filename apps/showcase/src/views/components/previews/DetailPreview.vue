<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import { showcaseText } from '@/data/showcasePropLabels';
import { EgDetail, EgPopup, EgTooltipPanel } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import { createDocCustomizeState } from '@/views/shared/componentDoc/customizeState';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import organismStyles from './OrganismPreview.module.css';
import PopupCustomSlotChromePreview from './PopupCustomSlotChromePreview.vue';
import {
  buildDetailSectionsFromCustomize,
  buildDetailSectionCustomizeControls,
  buildDetailTabsCustomizeControls,
  buildDetailUsageSnippet,
  detailCustomizeDefaults,
  detailEventRows,
  detailHeaderCustomizeControls,
  detailPropRows,
  detailSectionItemKey,
  detailSlotRows,
  detailToolbarCustomizeControls,
  findDetailItemByKey,
  parseDetailSectionEditItemIndex,
  parseDetailSectionItemCount,
  resetDetailSectionItemCustomizeFields,
  resolveDetailActiveTab,
  resolveDetailTabLabels,
} from './detailDocCustomize';

/** Figma Popup Detail 面板尺寸（与 EgPopup uses="detail" 一致） */
const DETAIL_PANEL_WIDTH = 880;
const DETAIL_PANEL_HEIGHT = 620;

const { locale } = useShowcaseLocale();
const { display } = useShowcaseDisplayText();

const headerPanelTitle = showcaseText('Header', '头部');
const contentArea1PanelTitle = showcaseText('Content area 1', '内容区 1');
const contentArea2PanelTitle = showcaseText('Content area 2', '内容区 2');

const resolvedHeaderPanelTitle = computed(() => {
  void locale.value;
  return display(headerPanelTitle);
});

const resolvedContentArea1PanelTitle = computed(() => {
  void locale.value;
  return display(contentArea1PanelTitle);
});

const resolvedContentArea2PanelTitle = computed(() => {
  void locale.value;
  return display(contentArea2PanelTitle);
});

const customize = createDocCustomizeState<typeof detailCustomizeDefaults>(detailCustomizeDefaults);

const detailSections = computed(() => buildDetailSectionsFromCustomize(customize));
const detailTabLabels = computed(() => resolveDetailTabLabels(customize));
const detailTabsCustomizeControls = computed(() => buildDetailTabsCustomizeControls(customize));
const detailSection1CustomizeControls = computed(() =>
  buildDetailSectionCustomizeControls(1, customize),
);
const detailSection2CustomizeControls = computed(() =>
  buildDetailSectionCustomizeControls(2, customize),
);
const detailActiveTab = computed({
  get: () => resolveDetailActiveTab(customize),
  set: (value: number) => {
    customize.activeTab = String(value);
  },
});

const detailToolbarPageKey = computed(
  () => (Boolean(customize.showTabs) ? `preview:tab-${detailActiveTab.value}` : undefined),
);

const detailShowToolbarNav = computed(
  () =>
    (Boolean(customize.showTabs) && !Boolean(customize.showToolbar))
    || (Boolean(customize.showToolbar) && Boolean(customize.showToolbarNav)),
);

const usageSnippet = computed(() => buildDetailUsageSnippet(customize));

watch(detailTabLabels, (labels) => {
  const maxIndex = Math.max(0, labels.length - 1);
  if (resolveDetailActiveTab(customize) > maxIndex) {
    customize.activeTab = String(maxIndex);
  }
});

watch(
  () => customize.section1ItemCount,
  () => {
    customize.section1EditItemIndex = String(parseDetailSectionEditItemIndex(customize, 1));
  },
);

watch(
  () => customize.section2ItemCount,
  () => {
    customize.section2EditItemIndex = String(parseDetailSectionEditItemIndex(customize, 2));
  },
);

function watchDetailSectionDataSources(sectionNum: 1 | 2) {
  watch(
    () => {
      const count = parseDetailSectionItemCount(customize, sectionNum);
      return Array.from({ length: count }, (_, index) =>
        String(
          customize[detailSectionItemKey(sectionNum, 'DataSource', index + 1)] ?? 'custom',
        ),
      );
    },
    (sources, previous) => {
      sources.forEach((source, index) => {
        const prev = previous?.[index];
        if (source === prev) return;
        const itemIndex = index + 1;
        resetDetailSectionItemCustomizeFields(customize, sectionNum, itemIndex);
        customize[detailSectionItemKey(sectionNum, 'DataSource', itemIndex)] = source;
      });
    },
  );
}

watchDetailSectionDataSources(1);
watchDetailSectionDataSources(2);

function parseToolbarIndex(value: unknown): number {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : 1;
}

function onToolbarPrev() {
  const current = parseToolbarIndex(customize.toolbarCurrent);
  if (current > 1) {
    customize.toolbarCurrent = String(current - 1);
    customize.headline = `Headline ${customize.toolbarCurrent}`;
  }
}

function onToolbarNext() {
  const current = parseToolbarIndex(customize.toolbarCurrent);
  const total = parseToolbarIndex(customize.toolbarTotal);
  if (current < total) {
    customize.toolbarCurrent = String(current + 1);
    customize.headline = `Headline ${customize.toolbarCurrent}`;
  }
}

const toolbarPrevDisabled = computed(() => parseToolbarIndex(customize.toolbarCurrent) <= 1);

const toolbarNextDisabled = computed(
  () => parseToolbarIndex(customize.toolbarCurrent) >= parseToolbarIndex(customize.toolbarTotal),
);

const ordersPopupOpen = ref(false);

function onItemValueLinkClick(key: string) {
  const item = findDetailItemByKey(detailSections.value, key);
  if (item?.addressLayout === 'multi-orders') {
    ordersPopupOpen.value = true;
  }
}

function closeOrdersPopup() {
  ordersPopupOpen.value = false;
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Detail"
      doc-tier="organism"
      :show-doc-title="false"
      component-tag="EgDetail"
      import-code="import { EgDetail } from '@eds/desktop-components';"
      :customize-controls="[]"
      :customize-defaults="detailCustomizeDefaults"
      :prop-rows="detailPropRows"
      :event-rows="detailEventRows"
      :slot-rows="detailSlotRows"
      :usage-snippet-override="usageSnippet"
      props-section-id="detail-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="organismStyles.previewOrganismPopupBoxHost">
          <EgTooltipPanel
            panel-kind="popup"
            panel-radius="radius-lg"
            width-mode="fixed"
            :width="DETAIL_PANEL_WIDTH"
            height-mode="fixed"
            :height="DETAIL_PANEL_HEIGHT"
            :max-width="DETAIL_PANEL_WIDTH"
            :max-height="DETAIL_PANEL_HEIGHT"
            :scrollable="false"
          >
            <EgDetail
              v-model:active-tab="detailActiveTab"
              :eyebrow="String(customize.eyebrow)"
              :headline="String(customize.headline)"
              :status-tag="String(customize.statusTag)"
              :status-tag-size="customize.statusTagSize as 'lg' | 'md' | 'sm'"
              :status-tag-status="customize.statusTagStatus as 'danger' | 'warning' | 'success' | 'ready' | 'invalid'"
              :show-eyebrow="Boolean(customize.showEyebrow)"
              :show-status-tag="Boolean(customize.showStatusTag)"
              :show-tabs="Boolean(customize.showTabs)"
              :tab-labels="detailTabLabels"
              :tab-horizontal-gap="customize.tabHorizontalGap as 'xl' | 'md' | 'sm' | 'xs'"
              :tab-vertical-gap="customize.tabVerticalGap as 'xl' | 'md' | 'sm' | 'xs'"
              :sections="detailSections"
              :show-toolbar="Boolean(customize.showToolbar)"
              :toolbar-divider-pinned="Boolean(customize.toolbarDividerPinned)"
              :show-toolbar-nav="detailShowToolbarNav"
              :toolbar-page-key="detailToolbarPageKey"
              :show-toolbar-note="Boolean(customize.showToolbarNote)"
              :toolbar-current="String(customize.toolbarCurrent)"
              :toolbar-total="String(customize.toolbarTotal)"
              :toolbar-prev-disabled="toolbarPrevDisabled"
              :toolbar-next-disabled="toolbarNextDisabled"
              :toolbar-tone="customize.toolbarTone as 'brand' | 'decor'"
              :toolbar-direction="customize.toolbarDirection as 'left' | 'right'"
              :toolbar-confirm-label="String(customize.toolbarConfirmLabel)"
              :toolbar-cancel-label="String(customize.toolbarCancelLabel)"
              @toolbar-prev="onToolbarPrev"
              @toolbar-next="onToolbarNext"
              @item-value-link-click="onItemValueLinkClick"
            />
          </EgTooltipPanel>

          <EgPopup
            v-model:open="ordersPopupOpen"
            uses="custom"
            :box-width="780"
            :box-height="560"
          >
            <PopupCustomSlotChromePreview
              toolbar-tone="decor"
              toolbar-confirm-label="Confirm"
              toolbar-cancel-label="Cancel"
              content-inset-preset="lg"
              @close="closeOrdersPopup"
              @toolbar-cancel="closeOrdersPopup"
              @toolbar-confirm="closeOrdersPopup"
            >
              <div :class="organismStyles.previewOrganismPopupBoxPlaceholder">
                Orders · 16 addresses
              </div>
            </PopupCustomSlotChromePreview>
          </EgPopup>
        </div>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-model="customize"
            :title="resolvedHeaderPanelTitle"
            nested
            embedded
            sequential
            :row-columns="4"
            :controls="detailHeaderCustomizeControls"
          />
          <CustomizePanel
            v-if="customize.showTabs"
            v-model="customize"
            title="EgTabs"
            nested
            embedded
            sequential
            :row-columns="5"
            :controls="detailTabsCustomizeControls"
          />
          <CustomizePanel
            v-model="customize"
            :title="resolvedContentArea1PanelTitle"
            nested
            embedded
            sequential
            :row-columns="6"
            :controls="detailSection1CustomizeControls"
          />
          <CustomizePanel
            v-model="customize"
            :title="resolvedContentArea2PanelTitle"
            nested
            embedded
            sequential
            :row-columns="6"
            :controls="detailSection2CustomizeControls"
          />
          <CustomizePanel
            v-model="customize"
            title="EgComboPageButton"
            nested
            embedded
            :controls="detailToolbarCustomizeControls"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
