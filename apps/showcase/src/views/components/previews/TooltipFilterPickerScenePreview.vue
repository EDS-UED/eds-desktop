<script setup lang="ts">
import { computed } from 'vue';
import {
  EgCryptoTooltip,
  EgDatePickerTooltip,
  EgMemberTooltip,
  EgStatusTooltip,
  FILTER_SELECT_PLACEHOLDER,
  FILTER_TIME_RANGE_PLACEHOLDER,
  type EgFilterCascadePlacement,
  type EgFilterFieldSelectionMode,
  type FlotationTriggerWidthMode,
} from '@eds/desktop-components';
import type {
  TooltipFilterPickerDateTypeValue,
  TooltipFilterPickerScenarioValue,
} from './tooltipFilterPickerDocCustomize';

const props = defineProps<{
  scenario: TooltipFilterPickerScenarioValue;
  modelValue: string;
  placeholder: string;
  disabled: boolean;
  selectionMode: EgFilterFieldSelectionMode;
  datePickerType: TooltipFilterPickerDateTypeValue;
  triggerWidthMode: FlotationTriggerWidthMode;
  triggerWidth?: number;
  trigger: 'click' | 'hover';
  showTypeTabs: boolean;
  cascadePlacement: EgFilterCascadePlacement;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const effectivePlaceholder = computed(() => {
  if (
    props.scenario === 'date-picker'
    && props.datePickerType === 'range'
    && (!props.placeholder || props.placeholder === FILTER_SELECT_PLACEHOLDER)
  ) {
    return FILTER_TIME_RANGE_PLACEHOLDER;
  }
  return props.placeholder;
});

const pickerProps = computed(() => ({
  modelValue: props.modelValue,
  placeholder: effectivePlaceholder.value,
  disabled: props.disabled,
  trigger: props.trigger,
  triggerWidthMode: props.triggerWidthMode,
  triggerWidth: props.triggerWidth,
}));

const isCrypto = computed(() => props.scenario === 'crypto-picker');
const isMember = computed(() => props.scenario === 'member-picker');
const isStatus = computed(() => props.scenario === 'status-picker');
const isDate = computed(() => props.scenario === 'date-picker');
</script>

<template>
  <EgCryptoTooltip
    v-if="isCrypto"
    v-bind="pickerProps"
    :selection-mode="selectionMode"
    :cascade-placement="cascadePlacement"
    @update:model-value="emit('update:modelValue', $event)"
  />
  <EgMemberTooltip
    v-else-if="isMember"
    v-bind="pickerProps"
    :selection-mode="selectionMode"
    :show-type-tabs="showTypeTabs"
    @update:model-value="emit('update:modelValue', $event)"
  />
  <EgDatePickerTooltip
    v-else-if="isDate"
    v-bind="pickerProps"
    :mode="datePickerType"
    @update:model-value="emit('update:modelValue', $event)"
  />
  <EgStatusTooltip
    v-else-if="isStatus"
    v-bind="pickerProps"
    :selection-mode="selectionMode"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
