<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { EgSearchInput } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import { buildVueSelfClosingSnippet } from '@/views/shared/componentDoc/buildUsageSnippet';
import styles from './InputPreview.module.css';
import { searchEventRows, searchPropRows } from './inputSubPreviewData';
import {
  searchCustomizeControls,
  searchCustomizeDefaults,
  searchImportCode,
} from './inputDocCustomize';
import {
  buildWidthModeUsageSnippet,
  previewFixedWidthStyle,
} from './inputPreviewWidth';

const searchValue = ref('');
const searchCustomize = reactive({
  ...searchCustomizeDefaults,
  widthMode: searchCustomizeDefaults.widthMode as 'fixed' | 'full',
});

const searchPreviewStyle = computed(() =>
  previewFixedWidthStyle(searchCustomize.widthMode, searchCustomize.fixedWidth),
);

const searchUsageSnippet = computed(() =>
  buildWidthModeUsageSnippet(
    'EgSearchInput',
    searchCustomize,
    { defaults: searchCustomizeDefaults, vModel: 'value' },
    buildVueSelfClosingSnippet,
  ),
);
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="searchCustomize"
      title="Search"
      doc-tier="scenes"
      :show-doc-title="false"
      component-tag="EgSearchInput"
      :import-code="searchImportCode"
      :customize-controls="searchCustomizeControls"
      :customize-defaults="searchCustomizeDefaults"
      :usage-snippet-override="searchUsageSnippet"
      :prop-rows="searchPropRows"
      :event-rows="searchEventRows"
      props-section-id="input-search-props"
      @reset-preview="searchValue = ''"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewInputHost">
          <EgSearchInput
            v-if="!searchCustomize.disabled"
            v-model="searchValue"
            :style="searchPreviewStyle"
            :placeholder="String(searchCustomize.placeholder)"
            :width-mode="searchCustomize.widthMode as 'fixed' | 'full'"
            :readonly="Boolean(searchCustomize.readonly)"
          />
          <EgSearchInput
            v-else
            model-value=""
            :style="searchPreviewStyle"
            :placeholder="String(searchCustomize.placeholder)"
            :width-mode="searchCustomize.widthMode as 'fixed' | 'full'"
            disabled
          />
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
