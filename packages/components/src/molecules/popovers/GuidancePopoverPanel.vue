<script setup lang="ts">
import { EgButton } from '../button';
import styles from './GuidancePopoverPanel.module.css';

withDefaults(
  defineProps<{
    body?: string;
    actionLabel?: string;
  }>(),
  {
    body: '引导说明文案',
    actionLabel: '知道了',
  },
);

const emit = defineEmits<{
  action: [];
}>();
</script>

<template>
  <div :class="styles.root" data-eds-guidance-popover>
    <slot name="body">
      <p :class="styles.body">
        {{ body }}
      </p>
    </slot>
    <EgButton
      :class="styles.action"
      tone="sameWhite"
      variant="solid"
      size="md"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </EgButton>
  </div>
</template>
