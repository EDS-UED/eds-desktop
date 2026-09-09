<script setup lang="ts">
import { EgTooltipOverflow } from '@eds/desktop-components';
import { tooltipFlotationTextOverflowSampleText } from './tooltipFlotationTextOverflowPreviewData';
import styles from './TooltipPreview.module.css';

withDefaults(
  defineProps<{
    tooltipTrigger?: 'hover' | 'focus';
  }>(),
  {
    tooltipTrigger: 'hover',
  },
);

const sampleText = tooltipFlotationTextOverflowSampleText;
</script>

<template>
  <div :class="styles.textOverflowHost">
    <EgTooltipOverflow
      :tooltip-text="sampleText"
      :trigger="tooltipTrigger"
      target-tone="primary"
      :panel-scope-class="styles.textOverflowTooltip"
      :typography-class="styles.textOverflowText"
      :host-class="styles.textOverflowTriggerWrap"
    >
      {{ sampleText }}
    </EgTooltipOverflow>
  </div>
</template>
