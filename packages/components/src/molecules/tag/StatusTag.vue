<script setup lang="ts">
import EgTag from './Tag.vue';
import type { TagSize, TagStatus } from './Tag.vue';

defineOptions({ inheritAttrs: false });

defineProps<{
  size?: TagSize;
  status?: TagStatus;
  truncate?: boolean;
}>();
</script>

<template>
  <EgTag v-bind="{ ...$attrs, ...$props, family: 'status' }">
    <slot />
  </EgTag>
</template>
