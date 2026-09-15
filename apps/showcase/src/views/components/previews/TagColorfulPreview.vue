<script setup lang="ts">
import { computed, reactive } from 'vue';
import { showcaseText } from '@/data/showcasePropLabels';
import { EgColorfulTag } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import styles from './InputPreview.module.css';
import TagPreviewGallery from './TagPreviewGallery.vue';
import type { TagColorfulStyle } from '@eds/desktop-components';
import {
  buildTagColorfulUsageSnippet,
  tagColorfulSceneImportCode,
  tagColorfulCustomizeControls,
  tagColorfulCustomizeDefaults,
  tagColorfulGalleryOptions,
  tagColorfulPropRows,
} from './tagDocCustomize';

const customize = reactive({
  ...tagColorfulCustomizeDefaults,
  size: tagColorfulCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  colorfulStyle: tagColorfulCustomizeDefaults.colorfulStyle as TagColorfulStyle,
});

const usageSnippet = computed(() => buildTagColorfulUsageSnippet(customize));

const galleryLabel = showcaseText('Style', '样式');

function selectColorfulStyle(value: string) {
  customize.colorfulStyle = value as TagColorfulStyle;
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Colorful"
      :show-doc-title="false"
      component-tag="EgColorfulTag"
      :import-code="tagColorfulSceneImportCode"
      :customize-controls="tagColorfulCustomizeControls"
      :customize-defaults="tagColorfulCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="tagColorfulPropRows"
      props-section-id="tag-scene-colorful-props"
    >
      <template #preview>
        <TagPreviewGallery
          :options="tagColorfulGalleryOptions"
          :selected="customize.colorfulStyle"
          :gallery-label="galleryLabel"
          @select="selectColorfulStyle"
        >
          <template #main>
            <EgColorfulTag :size="customize.size" :colorful-style="customize.colorfulStyle">
              {{ customize.label }}
            </EgColorfulTag>
          </template>
          <template #item="{ value }">
            <EgColorfulTag :size="customize.size" :colorful-style="value">
              {{ customize.label }}
            </EgColorfulTag>
          </template>
        </TagPreviewGallery>
      </template>
    </ComponentDocLayout>
  </div>
</template>
