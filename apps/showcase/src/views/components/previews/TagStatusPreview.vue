<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EgStatusTag } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import styles from './InputPreview.module.css';
import TagPreviewGallery from './TagPreviewGallery.vue';
import type { TagStatus } from '@eds/desktop-components';
import {
  buildTagStatusUsageSnippet,
  tagStatusSceneImportCode,
  tagStatusCustomizeControls,
  tagStatusCustomizeDefaults,
  tagStatusGalleryOptions,
  tagStatusPropRows,
} from './tagDocCustomize';

const customize = reactive({
  ...tagStatusCustomizeDefaults,
  size: tagStatusCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  status: tagStatusCustomizeDefaults.status as TagStatus,
});

const usageSnippet = computed(() => buildTagStatusUsageSnippet(customize));

function selectStatus(value: string) {
  customize.status = value as TagStatus;
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Status"
      :show-doc-title="false"
      component-tag="EgStatusTag"
      :import-code="tagStatusSceneImportCode"
      :customize-controls="tagStatusCustomizeControls"
      :customize-defaults="tagStatusCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="tagStatusPropRows"
      props-section-id="tag-scene-status-props"
    >
      <template #preview>
        <TagPreviewGallery
          :options="tagStatusGalleryOptions"
          :selected="customize.status"
          gallery-label="状态"
          @select="selectStatus"
        >
          <template #main>
            <EgStatusTag :size="customize.size" :status="customize.status">
              {{ customize.label }}
            </EgStatusTag>
          </template>
          <template #item="{ value }">
            <EgStatusTag :size="customize.size" :status="value">
              {{ customize.label }}
            </EgStatusTag>
          </template>
        </TagPreviewGallery>
      </template>
    </ComponentDocLayout>
  </div>
</template>
