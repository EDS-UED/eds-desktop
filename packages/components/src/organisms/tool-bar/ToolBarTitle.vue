<script setup lang="ts">
import { EgIconButton } from '../../molecules/icon-button';
import { EgIcon } from '../../atoms/icons';
import styles from './ToolBar.module.css';

withDefaults(
  defineProps<{
    title?: string;
    showBack?: boolean;
    backLabel?: string;
  }>(),
  {
    title: 'Title',
    showBack: false,
    backLabel: 'Back',
  },
);

const emit = defineEmits<{
  back: [];
}>();
</script>

<template>
  <div
    class="eds-tool-bar-title"
    :class="[styles.titleRow, showBack && styles.titleRowWithBack]"
  >
    <EgIconButton
      v-if="showBack"
      size="md"
      :label="backLabel"
      @click="emit('back')"
    >
      <EgIcon name="eds-arrow-left-ios" fit />
    </EgIconButton>
    <p :class="styles.titleText">
      <slot>{{ title }}</slot>
    </p>
  </div>
</template>
