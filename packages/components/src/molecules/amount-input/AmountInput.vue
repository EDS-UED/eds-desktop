<script setup lang="ts">
import { EgInput, type InputWidthMode } from '../input';
import styles from './AmountInput.module.css';

/** Headline 金额输入；右侧 Max 预置。 */
withDefaults(
  defineProps<{
    modelValue?: string;
    widthMode?: InputWidthMode;
    amountPlaceholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    unit?: string;
    clearable?: boolean;
    showMax?: boolean;
    maxLabel?: string;
    overflowFeedback?: boolean;
  }>(),
  {
    modelValue: '',
    widthMode: 'fixed',
    amountPlaceholder: '0',
    disabled: false,
    readonly: false,
    unit: '',
    clearable: true,
    showMax: true,
    maxLabel: 'Max',
    overflowFeedback: true,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  clear: [];
  max: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();
</script>

<template>
  <div
    :class="[
      styles.root,
      widthMode === 'full' ? styles.widthFull : styles.widthFixed,
      disabled && styles.disabled,
    ]"
  >
    <EgInput
      :model-value="modelValue"
      type="amount"
      size="lg"
      :width-mode="widthMode"
      :amount-placeholder="amountPlaceholder"
      :disabled="disabled"
      :readonly="readonly"
      :unit="unit"
      :clearable="clearable"
      :show-max="showMax"
      :max-label="maxLabel"
      inputmode="decimal"
      :overflow-feedback="overflowFeedback"
      @update:model-value="emit('update:modelValue', $event)"
      @clear="emit('clear')"
      @max="emit('max')"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />
  </div>
</template>
