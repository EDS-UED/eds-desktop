<script setup lang="ts">
import { computed } from 'vue';
import { EgInput } from '../../molecules/input';
import type { EgFilterAmountMode, EgFilterFieldKind } from './types';
import {
  FILTER_NUMERIC_PLACEHOLDER,
  FILTER_NUMERIC_RANGE_MAX_PLACEHOLDER,
  FILTER_NUMERIC_RANGE_MIN_PLACEHOLDER,
  formatFilterNumericRangeValue,
  parseFilterNumericRangeValue,
} from './types';
import { useFilterTranslate } from './filterTranslate';
import styles from './FilterConditionNumericValue.module.css';

const t = useFilterTranslate();

const props = withDefaults(
  defineProps<{
    modelValue: string;
    fieldKind?: EgFilterFieldKind;
    placeholder?: string;
    disabled?: boolean;
    amountMode?: EgFilterAmountMode;
    unit?: string;
  }>(),
  {
    placeholder: FILTER_NUMERIC_PLACEHOLDER,
    disabled: false,
    amountMode: 'single',
    unit: 'BTC',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isRange = computed(() => props.amountMode === 'range');

const singleValue = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    emit('update:modelValue', value);
  },
});

const rangeMinValue = computed({
  get: () => parseFilterNumericRangeValue(props.modelValue).min,
  set: (min: string) => {
    const { max } = parseFilterNumericRangeValue(props.modelValue);
    emit('update:modelValue', formatFilterNumericRangeValue(min, max));
  },
});

const rangeMaxValue = computed({
  get: () => parseFilterNumericRangeValue(props.modelValue).max,
  set: (max: string) => {
    const { min } = parseFilterNumericRangeValue(props.modelValue);
    emit('update:modelValue', formatFilterNumericRangeValue(min, max));
  },
});
</script>

<template>
  <div :class="styles.root">
    <EgInput
      v-if="!isRange"
      :class="styles.input"
      v-model="singleValue"
      type="standard"
      size="sm"
      width-mode="full"
      :placeholder="t(placeholder)"
      :unit="unit"
      :disabled="disabled"
      :clearable="!disabled"
      inputmode="decimal"
    />

    <div v-else :class="styles.rangeRow">
      <EgInput
        :class="styles.rangeInput"
        v-model="rangeMinValue"
        type="standard"
        size="sm"
        width-mode="full"
        :placeholder="t(FILTER_NUMERIC_RANGE_MIN_PLACEHOLDER)"
        :unit="unit"
        :disabled="disabled"
        :clearable="false"
        inputmode="decimal"
      />
      <span :class="styles.rangeSep" aria-hidden="true">-</span>
      <EgInput
        :class="styles.rangeInput"
        v-model="rangeMaxValue"
        type="standard"
        size="sm"
        width-mode="full"
        :placeholder="t(FILTER_NUMERIC_RANGE_MAX_PLACEHOLDER)"
        :unit="unit"
        :disabled="disabled"
        :clearable="false"
        inputmode="decimal"
      />
    </div>
  </div>
</template>
