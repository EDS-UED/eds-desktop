<script setup lang="ts">
import { ref } from 'vue';
import {
  EgBillTooltip,
  EgIcon,
  EgIconProButton,
  createBillTooltipDemoHistory,
} from '@eds/desktop-components';
import { showcaseText } from '@/data/showcasePropLabels';
import { showcaseBillUi } from './billTooltipShowcaseMock';

defineProps<{
  disabled: boolean;
  exportLoading: boolean;
  trigger: 'click' | 'hover';
}>();

const dateRange = defineModel<string>({ required: true });

const historyItems = createBillTooltipDemoHistory();
const exportPulse = ref(false);

const triggerLabel = showcaseText('Export', '导出');

function onExport() {
  exportPulse.value = true;
  window.setTimeout(() => {
    exportPulse.value = false;
  }, 1200);
}
</script>

<template>
  <EgBillTooltip
    v-model="dateRange"
    :history-items="historyItems"
    :translate="showcaseBillUi"
    :disabled="disabled"
    :export-loading="exportLoading || exportPulse"
    :trigger="trigger"
    placement="bottom"
    align="end"
    @export="onExport"
  >
    <template #trigger="{ expanded }">
      <EgIconProButton
        :label="triggerLabel"
        :active="expanded"
        :disabled="disabled"
        :aria-expanded="expanded"
      >
        <EgIcon name="eds-arrow-download" size="sm" />
      </EgIconProButton>
    </template>
  </EgBillTooltip>
</template>
