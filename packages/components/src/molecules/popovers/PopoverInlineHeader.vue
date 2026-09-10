<script setup lang="ts">
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../icon-button';
import styles from './PopoverInlineHeader.module.css';

withDefaults(
  defineProps<{
    title: string;
    closable?: boolean;
    closeLabel?: string;
  }>(),
  {
    closable: true,
    closeLabel: 'Close',
  },
);

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <div :class="styles.inlineHeader" data-eds-popover-inline-header>
    <p
      :class="[
        styles.inlineHeaderTitle,
        closable && styles.inlineHeaderTitleWithClose,
      ]"
    >
      {{ title }}
    </p>
    <div v-if="closable" :class="styles.inlineHeaderClose">
      <EgIconButton
        shape="square"
        size="sm"
        :label="closeLabel"
        motion="ease"
        @click="emit('close')"
      >
        <EgIcon name="eds-close-circle-fill" fit />
      </EgIconButton>
    </div>
  </div>
</template>
