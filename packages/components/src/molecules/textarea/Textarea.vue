<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { EgLinkButton } from '../link';
import styles from './Textarea.module.css';

export type TextareaWidthMode = 'fixed' | 'full';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    widthMode?: TextareaWidthMode;
    /** Paste 链接文案；中文场景传「粘贴」。 */
    pasteLabel?: string;
    /** Clear 链接文案；中文场景传「清空」。 */
    clearLabel?: string;
  }>(),
  {
    modelValue: '',
    placeholder: '请输入',
    disabled: false,
    readonly: false,
    widthMode: 'fixed',
    pasteLabel: 'Paste',
    clearLabel: 'Clear',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  paste: [];
  clear: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const clearDisabled = computed(
  () => props.disabled || props.readonly || props.modelValue.length === 0,
);

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value);
}

function onFocus(event: FocusEvent) {
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  emit('blur', event);
}

function onFieldClick(event: MouseEvent) {
  if (props.disabled || props.readonly) {
    return;
  }

  const target = event.target as HTMLElement;
  if (target.closest('a, button')) {
    return;
  }

  textareaRef.value?.focus();
}

async function onPasteClick(event: MouseEvent) {
  event.preventDefault();
  if (props.disabled || props.readonly) {
    return;
  }

  emit('paste');

  try {
    const text = await navigator.clipboard.readText();
    const el = textareaRef.value;

    if (!text) {
      el?.focus();
      return;
    }

    if (!el) {
      emit('update:modelValue', text);
      return;
    }

    const start = el.selectionStart ?? props.modelValue.length;
    const end = el.selectionEnd ?? props.modelValue.length;
    const nextValue = props.modelValue.slice(0, start) + text + props.modelValue.slice(end);
    emit('update:modelValue', nextValue);

    await nextTick();
    const cursor = start + text.length;
    el.setSelectionRange(cursor, cursor);
    el.focus();
  } catch {
    textareaRef.value?.focus();
  }
}

function onClearClick(event: MouseEvent) {
  event.preventDefault();
  if (clearDisabled.value) {
    return;
  }

  emit('update:modelValue', '');
  emit('clear');
  textareaRef.value?.focus();
}
</script>

<template>
  <div
    :class="[
      styles.root,
      widthMode === 'full' ? styles.widthFull : styles.widthFixed,
    ]"
  >
    <div
      :class="[styles.field, disabled && styles.fieldDisabled]"
      @click="onFieldClick"
    >
      <textarea
        ref="textareaRef"
        class="eds-textarea-control"
        :class="styles.control"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        spellcheck="false"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />

      <div :class="styles.actions">
        <span :class="styles.actionGap">
          <EgLinkButton
            tone="brand"
            size="sm"
            href="#"
            :disabled="disabled"
            @click="onPasteClick"
          >
            {{ pasteLabel }}
          </EgLinkButton>
          <EgLinkButton
            tone="brand"
            size="sm"
            href="#"
            :disabled="clearDisabled"
            @click="onClearClick"
          >
            {{ clearLabel }}
          </EgLinkButton>
        </span>
      </div>
    </div>
  </div>
</template>
