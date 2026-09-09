<script setup lang="ts">
import { computed, ref } from 'vue';
import { EgIcon } from '../../atoms/icons';
import { EgPaginationGroupButton } from '../../molecules/pagination-item';
import styles from './Paginer.module.css';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    submitLabel?: string;
  }>(),
  {
    modelValue: '',
    placeholder: 'Input',
    disabled: false,
    submitLabel: 'Jump to page',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  submit: [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const focused = ref(false);

const hasValue = computed(() => String(props.modelValue).trim().length > 0);
const showSubmit = computed(() => focused.value || hasValue.value);
const submitDisabled = computed(() => props.disabled || !hasValue.value);

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function onFocus(event: FocusEvent) {
  focused.value = true;
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  focused.value = false;
  emit('blur', event);
}

function onSubmit(event: MouseEvent) {
  event.preventDefault();
  if (submitDisabled.value) return;
  emit('submit', String(props.modelValue));
}
</script>

<template>
  <div
    class="eds-paginer-set-input"
    :class="[
      styles.setInput,
      focused && styles.setInputFocused,
      hasValue && !focused && styles.setInputDone,
      disabled && styles.setInputDisabled,
    ]"
  >
    <input
      :class="styles.setInputField"
      type="text"
      inputmode="numeric"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <div :class="styles.setInputSubmitSlot" :aria-hidden="!showSubmit">
      <EgPaginationGroupButton
        kind="button"
        tone="decor"
        :class="!showSubmit && styles.setInputSubmitHidden"
        :disabled="submitDisabled"
        :label="submitLabel"
        @mousedown.prevent
        @click="onSubmit"
      >
        <EgIcon name="eds-arrow-right" fit />
      </EgPaginationGroupButton>
    </div>
  </div>
</template>
