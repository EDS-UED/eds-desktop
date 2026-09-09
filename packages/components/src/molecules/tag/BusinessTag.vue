<script setup lang="ts">
import EgTag from './Tag.vue';
import type { TagCustomStyle, TagSize } from './Tag.vue';

defineOptions({ inheritAttrs: false });

defineProps<{
  size?: TagSize;
  customStyle?: TagCustomStyle;
  truncate?: boolean;
}>();
</script>

<template>
  <EgTag v-bind="{ ...$attrs, ...$props, family: 'custom' }">
    <slot />
  </EgTag>
</template>
