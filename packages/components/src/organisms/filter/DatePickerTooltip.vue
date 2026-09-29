<script setup lang="ts">
import type { FlotationTriggerWidthMode } from '../../molecules/flotation';
import type { TooltipTrigger } from '../../molecules/tooltip';
import FilterConditionTimeRangeValue from './FilterConditionTimeRangeValue.vue';
import FilterConditionTimeValue from './FilterConditionTimeValue.vue';

export type EgDatePickerTooltipMode = 'date' | 'range';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
    mode?: EgDatePickerTooltipMode;
    triggerWidthMode?: FlotationTriggerWidthMode;
    triggerWidth?: number;
    trigger?: TooltipTrigger;
    dropdownOpenId?: string;
  }>(),
  {
    disabled: false,
    mode: 'date',
    triggerWidthMode: 'adaptive',
    trigger: 'click',
  },
);

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <FilterConditionTimeRangeValue
    v-if="props.mode === 'range'"
    :model-value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :trigger-width-mode="triggerWidthMode"
    :trigger-width="triggerWidth"
    :trigger="trigger"
    :dropdown-open-id="dropdownOpenId"
    @update:model-value="$emit('update:modelValue', $event)"
  />
  <FilterConditionTimeValue
    v-else
    :model-value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :trigger-width-mode="triggerWidthMode"
    :trigger-width="triggerWidth"
    :trigger="trigger"
    :dropdown-open-id="dropdownOpenId"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
