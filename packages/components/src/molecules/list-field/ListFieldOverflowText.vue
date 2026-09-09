<script setup lang="ts">
import { computed } from 'vue';
import { EgTooltipOverflow } from '../tooltip';
import styles from './ListFieldOverflowText.module.css';

const props = withDefaults(
  defineProps<{
    text: string;
    /** 单元格展示文案；与 `text` 不同时视为语义截断，悬浮仍展示完整 `text`。 */
    displayText?: string;
    variant?: 'primary' | 'secondary';
    size?: 'medium' | 'small';
    tooltipTrigger?: 'hover' | 'focus';
    tabular?: boolean;
    boundarySelector?: string;
  }>(),
  {
    displayText: undefined,
    variant: 'primary',
    size: 'medium',
    tooltipTrigger: 'hover',
    tabular: false,
    boundarySelector: '.eds-data-list',
  },
);

const resolvedDisplay = computed(() => props.displayText?.trim() || props.text);
const semanticallyTruncated = computed(() => {
  const display = props.displayText?.trim();
  return Boolean(display && display !== props.text);
});

const targetTone = computed(() =>
  props.variant === 'secondary' ? 'secondary' : 'primary',
);

const textTypographyClass = computed((): string[] => [
  props.size === 'small'
    ? styles.textSmall
    : props.variant === 'primary'
      ? styles.textPrimary
      : styles.textSecondary,
  ...(props.tabular ? [styles.textTabular] : []),
]);

const tooltipPanelClass = computed(() => styles.tooltipPanel);
</script>

<template>
  <EgTooltipOverflow
    :tooltip-text="text"
    :trigger="tooltipTrigger"
    :target-tone="targetTone"
    :panel-scope-class="tooltipPanelClass"
    :typography-class="textTypographyClass"
    :measure-class="styles.text"
    :boundary-selector="boundarySelector"
    :semantic-truncated="semanticallyTruncated"
    host-flex
  >
    {{ resolvedDisplay }}
  </EgTooltipOverflow>
</template>
