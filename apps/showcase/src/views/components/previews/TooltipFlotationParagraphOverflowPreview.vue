<script setup lang="ts">
import { EgParagraphOvfTooltip } from '@eds/desktop-components';
import { tooltipFlotationParagraphOverflowSampleText } from './tooltipFlotationParagraphOverflowPreviewData';
import styles from './TooltipPreview.module.css';

withDefaults(
  defineProps<{
    tooltipTrigger?: 'hover' | 'focus';
  }>(),
  {
    tooltipTrigger: 'hover',
  },
);
</script>

<template>
  <div :class="styles.paragraphOverflowScene">
    <EgParagraphOvfTooltip
      :text="tooltipFlotationParagraphOverflowSampleText"
      :trigger="tooltipTrigger"
    />
  </div>
</template>
