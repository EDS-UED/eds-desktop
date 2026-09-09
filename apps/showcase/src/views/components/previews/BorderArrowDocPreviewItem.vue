<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { EgIcon, EgPaginationGroupButton } from '@eds/desktop-components';
import { showcasePaginationBorderArrowIconName } from '@/views/shared/showcaseIcons';
import {
  borderArrowEventHostClass,
  isBorderArrowInteractiveEvent,
  type BorderArrowDocEvent,
} from './borderArrowDocPreview';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    event?: BorderArrowDocEvent | string;
    disabled?: boolean;
  }>(),
  {
    event: 'full',
    disabled: false,
  },
);

const isInteractive = computed(() => isBorderArrowInteractiveEvent(props.event));

const hostClass = computed(() => borderArrowEventHostClass(props.event));

const attrs = useAttrs();
</script>

<template>
  <div :class="hostClass">
    <EgPaginationGroupButton
      v-bind="attrs"
      kind="borderArrow"
      :disabled="disabled"
      :interactive="isInteractive"
      :tabindex="isInteractive ? undefined : -1"
    >
      <slot>
        <EgIcon :name="showcasePaginationBorderArrowIconName" fit />
      </slot>
    </EgPaginationGroupButton>
  </div>
</template>
