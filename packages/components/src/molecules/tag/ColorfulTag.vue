<script setup lang="ts">
import EgTag from './Tag.vue';
import type { TagColorfulStyle, TagSize } from './Tag.vue';

defineOptions({ inheritAttrs: false });

defineProps<{
  size?: TagSize;
  colorfulStyle?: TagColorfulStyle;
  truncate?: boolean;
}>();
</script>

<template>
  <EgTag v-bind="{ ...$attrs, ...$props, family: 'colorful' }">
    <slot />
  </EgTag>
</template>
