<script lang="ts">
export type TagGalleryOption<Value extends string = string> = {
  value: Value;
  label: string;
};
</script>

<script setup lang="ts" generic="Value extends string = string">
import { computed } from 'vue';
import { useShowcaseDisplayText } from '@/composables/useShowcaseDisplayText';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import galleryStyles from './TagPreviewGallery.module.css';

const { locale } = useShowcaseLocale();
const { display, gallery } = useShowcaseDisplayText();

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

const resolvedGalleryLabel = computed(() => {
  void locale.value;
  return display(props.galleryLabel ?? '样式');
});

function optionLabel(label: string) {
  void locale.value;
  return gallery(label);
}
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
      :aria-label="resolvedGalleryLabel"
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
        <span :class="galleryStyles.galleryLabel">{{ optionLabel(option.label) }}</span>
      </button>
    </div>

    <div v-if="$slots.footer" :class="galleryStyles.footer">
      <slot name="footer" />
    </div>
  </div>
</template>
