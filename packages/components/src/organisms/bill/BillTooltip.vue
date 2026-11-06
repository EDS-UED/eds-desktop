<script setup lang="ts">
import { ref } from 'vue';
import { EgFlotation, EgFlotationMenu } from '../../molecules/flotation';
import type { TooltipAlign, TooltipPlacement, TooltipTrigger } from '../../molecules/tooltip';
import { provideBillTranslate, type BillTranslate } from './billTranslate';
import type { BillExportHistoryItem } from './billTooltipTypes';
import { BILL_TOOLTIP_PANEL_WIDTH } from './billTooltipTypes';
import BillTooltipPanel from './BillTooltipPanel.vue';
import styles from './BillTooltip.module.css';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    historyItems?: readonly BillExportHistoryItem[];
    disabled?: boolean;
    exportLoading?: boolean;
    trigger?: TooltipTrigger;
    placement?: TooltipPlacement;
    align?: TooltipAlign;
    translate?: BillTranslate;
    boundarySelector?: string;
  }>(),
  {
    historyItems: () => [],
    disabled: false,
    exportLoading: false,
    trigger: 'click',
    placement: 'bottom',
    align: 'end',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  export: [];
  'download-history': [id: string];
}>();

provideBillTranslate((key) => props.translate?.(key) ?? key);

const flotationRef = ref<{ close?: () => void } | null>(null);

defineExpose({
  close: () => flotationRef.value?.close?.(),
});
</script>

<template>
  <div :class="styles.root">
    <EgFlotation
      ref="flotationRef"
      :disabled="disabled"
      :trigger="trigger"
      :placement="placement"
      :align="align"
      width-mode="adaptive"
      :show-add="false"
      :show-menu-divider="false"
      :boundary-selector="boundarySelector"
      flip
    >
      <template #trigger="slotProps">
        <slot name="trigger" v-bind="slotProps" />
      </template>

      <template #content>
        <EgFlotationMenu
          :class="styles.menu"
          data-no-corner-smoothing
          panel-flush
          panel-radius="radius-md"
          width-mode="fixed"
          :width="BILL_TOOLTIP_PANEL_WIDTH"
          height-mode="adaptive"
          :scrollable="false"
          :show-add="false"
          :show-divider="false"
        >
          <BillTooltipPanel
            :model-value="modelValue"
            :history-items="historyItems"
            :disabled="disabled"
            :export-loading="exportLoading"
            @update:model-value="emit('update:modelValue', $event)"
            @export="emit('export')"
            @download-history="emit('download-history', $event)"
          />
        </EgFlotationMenu>
      </template>
    </EgFlotation>
  </div>
</template>
