<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgIcon, EgPaginationGroupButton } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import {
  showcasePaginationButtonIconName,
  showcasePaginationSymbolIconName,
} from '@/views/shared/showcaseIcons';
import styles from './InputPreview.module.css';
import BorderArrowDocPreviewItem from './BorderArrowDocPreviewItem.vue';
import {
  buildPaginationUsageSnippet,
  paginationCustomizeControls,
  paginationCustomizeDefaults,
  paginationImportCode,
} from './buttonDocCustomize';
import { paginationPropRows, paginationSlotRows } from './buttonSubPreviewData';

const paginationCustomize = reactive({ ...paginationCustomizeDefaults });

const paginationUsageSnippet = computed(() => buildPaginationUsageSnippet(paginationCustomize));

const isBorderArrow = computed(() => String(paginationCustomize.kind) === 'borderArrow');
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="paginationCustomize"
      title="Scenes"
      :show-doc-title="false"
      component-tag="EgPaginationGroupButton"
      :import-code="paginationImportCode"
      :customize-controls="paginationCustomizeControls"
      :customize-defaults="paginationCustomizeDefaults"
      :usage-snippet-override="paginationUsageSnippet"
      :prop-rows="paginationPropRows"
      :slot-rows="paginationSlotRows"
      props-section-id="button-pagination-props"
    >
      <template #preview>
        <div class="desktopTokens" :class="docStyles.previewButtonHost">
          <BorderArrowDocPreviewItem
            v-if="isBorderArrow"
            :event="String(paginationCustomize.event)"
            :disabled="Boolean(paginationCustomize.disabled)"
          />
          <EgPaginationGroupButton
            v-else
            :kind="paginationCustomize.kind as 'number' | 'symbol' | 'button' | 'borderArrow'"
            :tone="paginationCustomize.tone as 'brand' | 'decor'"
            :label="String(paginationCustomize.label)"
            :disabled="Boolean(paginationCustomize.disabled)"
          >
            <EgIcon
              v-if="String(paginationCustomize.kind) === 'symbol'"
              :name="showcasePaginationSymbolIconName"
              fit
            />
            <EgIcon
              v-else-if="String(paginationCustomize.kind) === 'button'"
              :name="showcasePaginationButtonIconName"
              fit
            />
          </EgPaginationGroupButton>
        </div>
      </template>
    </ComponentDocLayout>
  </div>
</template>
