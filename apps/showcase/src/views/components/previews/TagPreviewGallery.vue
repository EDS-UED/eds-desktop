<script lang="ts">
export type TagGalleryOption<Value extends string = string> = {
  value: Value;
  label: string;
};
</script>

<script setup lang="ts" generic="Value extends string = string">
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import galleryStyles from './TagPreviewGallery.module.css';

const props = withDefaults(
  defineProps<{
    options: readonly TagGalleryOption<Value>[];
    selected: Value;
    galleryLabel?: string;
    /** true：撑满 Tag 文档固定预览高（480px）；默认随内容增高。 */
    fillPreviewHeight?: boolean;
  }>(),
  {
    fillPreviewHeight: false,
  },
);

const emit = defineEmits<{
  select: [value: Value];
}>();
</script>

<template>
  <div
    class="desktopTokens"
    :class="[
      docStyles.previewInputHost,
      galleryStyles.host,
      !props.fillPreviewHeight && galleryStyles.hostNaturalHeight,
    ]"
  >
    <div :class="galleryStyles.main">
      <slot name="main" />
    </div>

    <div
      :class="galleryStyles.gallery"
      role="listbox"
      :aria-label="galleryLabel ?? '样式'"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="option"
        :aria-selected="selected === option.value"
        :class="[
          galleryStyles.galleryItem,
          selected === option.value && galleryStyles.galleryItemSelected,
        ]"
        @click="emit('select', option.value)"
      >
        <slot name="item" :value="option.value" />
        <span :class="galleryStyles.galleryLabel">{{ option.label }}</span>
      </button>
    </div>

    <div v-if="$slots.footer" :class="galleryStyles.footer">
      <slot name="footer" />
    </div>
  </div>
</template>
