<script setup lang="ts">
import { EgPaginationGroupButton } from '@eds/desktop-components';
import type { PaginerPaginationItemState } from './buttonDocCustomize';
import BorderArrowDocPreviewItem from './BorderArrowDocPreviewItem.vue';

const props = defineProps<{
  pagination: PaginerPaginationItemState;
  disabled?: boolean;
  selected?: boolean;
  label?: string;
  interactive?: boolean;
}>();
</script>

<template>
  <BorderArrowDocPreviewItem
    v-if="pagination.kind === 'borderArrow'"
    :event="pagination.event"
    :disabled="disabled"
  >
    <slot />
  </BorderArrowDocPreviewItem>
  <EgPaginationGroupButton
    v-else
    :kind="pagination.kind"
    :tone="pagination.tone"
    :disabled="disabled"
    :selected="selected"
    :label="label"
    :interactive="interactive"
  >
    <slot />
  </EgPaginationGroupButton>
</template>
