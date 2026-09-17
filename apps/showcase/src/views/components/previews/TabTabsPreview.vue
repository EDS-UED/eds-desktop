<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { EgTabs } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import styles from './InputPreview.module.css';
import {
  buildTabsUsageSnippet,
  resolveTabLabels,
  tabsCustomizeControls,
  tabsCustomizeDefaults,
  tabsImportCode,
  tabsPropRows,
} from './tabDocCustomize';

const customize = reactive({ ...tabsCustomizeDefaults });

const tabsIndex = ref(0);
const labels = computed(() => resolveTabLabels(customize.labels, customize.count));
const usageSnippet = computed(() => buildTabsUsageSnippet(customize));

watch(
  labels,
  (next) => {
    if (tabsIndex.value >= next.length) {
      tabsIndex.value = Math.max(0, next.length - 1);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Standard"
      :show-doc-title="false"
      component-tag="EgTabs"
      :import-code="tabsImportCode"
      :customize-controls="tabsCustomizeControls"
      :customize-defaults="tabsCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="tabsPropRows"
      props-section-id="tab-tabs-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgTabs
            v-model="tabsIndex"
            :labels="labels"
            :horizontal-gap="customize.horizontalGap as 'xl' | 'md' | 'sm' | 'xs'"
            :vertical-gap="customize.verticalGap as 'xl' | 'md' | 'sm' | 'xs'"
            :width-mode="customize.widthMode as 'adaptive' | 'fixed'"
            :width="
              customize.widthMode === 'fixed' &&
              Number.isFinite(Number.parseInt(String(customize.width), 10)) &&
              Number.parseInt(String(customize.width), 10) > 0
                ? Number.parseInt(String(customize.width), 10)
                : undefined
            "
            :scroll-fade="Boolean(customize.scrollFade)"
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
