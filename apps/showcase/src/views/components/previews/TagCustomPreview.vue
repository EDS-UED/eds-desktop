<script setup lang="ts">
import { computed, reactive } from 'vue';
import { showcaseText } from '@/data/showcasePropLabels';
import { EgBusinessTag } from '@eds/desktop-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import styles from './InputPreview.module.css';
import TagPreviewGallery from './TagPreviewGallery.vue';
import type { TagCustomStyle } from '@eds/desktop-components';
import {
  buildTagCustomUsageSnippet,
  tagBusinessSceneImportCode,
  tagCustomCustomizeControls,
  tagCustomCustomizeDefaults,
  tagCustomGalleryOptions,
  tagCustomPropRows,
} from './tagDocCustomize';

const customize = reactive({
  ...tagCustomCustomizeDefaults,
  size: tagCustomCustomizeDefaults.size as 'lg' | 'md' | 'sm',
  customStyle: tagCustomCustomizeDefaults.customStyle as TagCustomStyle,
});

const usageSnippet = computed(() => buildTagCustomUsageSnippet(customize));

const galleryLabel = showcaseText('Vertical line color', '竖线色');

function selectCustomStyle(value: string) {
  customize.customStyle = value as TagCustomStyle;
}
</script>

<template>
  <div :class="styles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="customize"
      title="Palette"
      :show-doc-title="false"
      component-tag="EgBusinessTag"
      :import-code="tagBusinessSceneImportCode"
      :customize-controls="tagCustomCustomizeControls"
      :customize-defaults="tagCustomCustomizeDefaults"
      :usage-snippet-override="usageSnippet"
      :prop-rows="tagCustomPropRows"
      props-section-id="tag-scene-palette-props"
    >
      <template #preview>
        <TagPreviewGallery
          :options="tagCustomGalleryOptions"
          :selected="customize.customStyle"
          :gallery-label="galleryLabel"
          @select="selectCustomStyle"
        >
          <template #main>
            <EgBusinessTag :size="customize.size" :custom-style="customize.customStyle">
              {{ customize.label }}
            </EgBusinessTag>
          </template>
          <template #item="{ value }">
            <EgBusinessTag :size="customize.size" :custom-style="value">
              {{ customize.label }}
            </EgBusinessTag>
          </template>
        </TagPreviewGallery>
      </template>
    </ComponentDocLayout>
  </div>
</template>
