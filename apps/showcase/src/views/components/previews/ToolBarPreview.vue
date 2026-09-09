<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgIcon, EgIconProButton, EgToolBar } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import CustomizePanel from '@/views/shared/componentDoc/CustomizePanel.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  readIconButtonProZoneItem,
  iconButtonProNestedRowColumns,
  type IconButtonProZoneKeyPrefix,
} from './buttonDocCustomize';
import {
  ORGANISM_IMPORT,
  toolBarCustomizeControls,
  toolBarCustomizeDefaults,
  toolBarFunctionalCustomizeControls,
  toolBarPropRows,
  toolBarSectionCustomizeControls,
  toolBarSlotRows,
} from './organismTemplateDocData';

const customize = reactive({ ...toolBarCustomizeDefaults });

function parseZoneCount(value: unknown, fallback = 1): number {
  const count = Number(value);
  if (!Number.isFinite(count)) return fallback;
  return Math.min(10, Math.max(1, Math.round(count)));
}

function trackZoneCustomize(prefix: IconButtonProZoneKeyPrefix, count: number) {
  void customize[`${prefix}Count` as keyof typeof customize];
  for (let index = 1; index <= count; index += 1) {
    void customize[`${prefix}Label${index}` as keyof typeof customize];
    void customize[`${prefix}Icon${index}` as keyof typeof customize];
    void customize[`${prefix}ShowBadge${index}` as keyof typeof customize];
    void customize[`${prefix}Badge${index}` as keyof typeof customize];
    void customize[`${prefix}ShowReddot${index}` as keyof typeof customize];
    void customize[`${prefix}Disabled${index}` as keyof typeof customize];
  }
}

const functionalCount = computed(() => parseZoneCount(customize.functionalCount));

const sectionCount = computed(() => parseZoneCount(customize.sectionCount));

const functionalItems = computed(() => {
  trackZoneCustomize('functional', functionalCount.value);
  return Array.from({ length: functionalCount.value }, (_, index) => ({
    order: index + 1,
    ...readIconButtonProZoneItem(customize, 'functional', index + 1),
  }));
});

const sectionItems = computed(() => {
  trackZoneCustomize('section', sectionCount.value);
  return Array.from({ length: sectionCount.value }, (_, index) => ({
    order: index + 1,
    ...readIconButtonProZoneItem(customize, 'section', index + 1),
  }));
});
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="ToolBar"
      :show-doc-title="false"
      component-tag="EgToolBar"
      :import-code="ORGANISM_IMPORT"
      :customize-controls="toolBarCustomizeControls"
      :customize-defaults="toolBarCustomizeDefaults"
      :prop-rows="toolBarPropRows"
      :slot-rows="toolBarSlotRows"
      props-section-id="tool-bar-props"
    >
      <template #preview>
        <EgToolBar
          class="desktopTokens"
          :title="String(customize.title)"
          :show-back="Boolean(customize.showBack)"
          :show-operation="Boolean(customize.showOperation)"
          :show-divider="Boolean(customize.showDivider)"
          :show-section="Boolean(customize.showSection)"
        >
          <template #functional>
            <template v-if="customize.showSection">
              <EgIconProButton
                v-for="item in functionalItems"
                :key="`functional-${item.order}-${item.icon}-${item.label}-${item.badge}`"
                :label="item.label"
                :badge="item.badge"
                :show-badge="item.showBadge"
                :show-reddot="item.showReddot"
                :disabled="item.disabled"
              >
                <EgIcon :name="item.icon" size="sm" />
              </EgIconProButton>
            </template>
            <template v-else>
              <EgIconProButton
                v-for="item in sectionItems"
                :key="`section-${item.order}-${item.icon}-${item.label}-${item.badge}`"
                :label="item.label"
                :badge="item.badge"
                :show-badge="item.showBadge"
                :show-reddot="item.showReddot"
                :disabled="item.disabled"
              >
                <EgIcon :name="item.icon" size="sm" />
              </EgIconProButton>
            </template>
          </template>
          <template v-if="customize.showSection" #section>
            <EgIconProButton
              v-for="item in sectionItems"
              :key="`section-split-${item.order}-${item.icon}-${item.label}-${item.badge}`"
              :label="item.label"
              :badge="item.badge"
              :show-badge="item.showBadge"
              :show-reddot="item.showReddot"
              :disabled="item.disabled"
            >
              <EgIcon :name="item.icon" size="sm" />
            </EgIconProButton>
          </template>
        </EgToolBar>
      </template>

      <template #customize-extra>
        <div :class="docStyles.customizeExtraStack">
          <CustomizePanel
            v-if="customize.showOperation && !customize.showSection"
            v-model="customize"
            nested
            embedded
            sequential
            :row-columns="iconButtonProNestedRowColumns"
            title="EgIconProButton"
            :controls="toolBarSectionCustomizeControls"
          />
          <template v-else-if="customize.showOperation && customize.showSection">
            <CustomizePanel
              v-model="customize"
              nested
              embedded
              sequential
              :row-columns="iconButtonProNestedRowColumns"
              title="EgIconProButton"
              :controls="toolBarFunctionalCustomizeControls"
            />
            <CustomizePanel
              v-model="customize"
              nested
              embedded
              sequential
              :row-columns="iconButtonProNestedRowColumns"
              title="EgIconProButton"
              :controls="toolBarSectionCustomizeControls"
            />
          </template>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
