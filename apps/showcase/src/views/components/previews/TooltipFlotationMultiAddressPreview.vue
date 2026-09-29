<script setup lang="ts">
import { EgAddressOvfTooltip } from '@eds/desktop-components';
import {
  tooltipFlotationMultiAddressFromTags,
  tooltipFlotationMultiAddressPrimary,
  tooltipFlotationMultiAddressSecondary,
  tooltipFlotationMultiAddressToTags,
} from './tooltipFlotationMultiAddressPreviewData';
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
  <div :class="styles.multiAddressHost">
    <EgAddressOvfTooltip
      :from-text="tooltipFlotationMultiAddressPrimary"
      :to-text="tooltipFlotationMultiAddressSecondary"
      :from-tags="tooltipFlotationMultiAddressFromTags"
      :to-tags="tooltipFlotationMultiAddressToTags"
      :address-tooltip-trigger="tooltipTrigger"
    />
  </div>
</template>
