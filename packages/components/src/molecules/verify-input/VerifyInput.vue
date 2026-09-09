<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { EgLinkButton } from '../link';
import styles from './VerifyInput.module.css';

export type VerifyInputWidthMode = 'fixed' | 'full';
export type VerifyInputState = 'idle' | 'verifying' | 'error';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    codeLength?: number;
    widthMode?: VerifyInputWidthMode;
    disabled?: boolean;
    readonly?: boolean;
    state?: VerifyInputState;
    pasteLabel?: string;
    showPaste?: boolean;
    /** 挂载后聚焦隐藏输入框，便于直接键入验证码。 */
    autofocus?: boolean;
  }>(),
  {
    modelValue: '',
    codeLength: 6,
    widthMode: 'fixed',
    disabled: false,
    readonly: false,
    state: 'idle',
    pasteLabel: '粘贴',
    showPaste: true,
    autofocus: true,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  complete: [code: string];
  paste: [];
}>();

const codeInputRef = ref<HTMLInputElement | null>(null);
const shakeActive = ref(false);
let shakeTimer: ReturnType<typeof setTimeout> | undefined;

const digits = computed(() => {
  const chars = props.modelValue.replace(/\D/g, '').slice(0, props.codeLength).split('');
  return Array.from({ length: props.codeLength }, (_, index) => chars[index] ?? '');
});

const activeIndex = computed(() =>
  Math.min(props.modelValue.replace(/\D/g, '').length, props.codeLength - 1),
);

function clearShakeTimer() {
  if (shakeTimer !== undefined) {
    clearTimeout(shakeTimer);
    shakeTimer = undefined;
  }
}

function triggerShake() {
  clearShakeTimer();
  shakeActive.value = false;
  void nextTick(() => {
    shakeActive.value = true;
    shakeTimer = setTimeout(() => {
      shakeActive.value = false;
      shakeTimer = undefined;
    }, 500);
  });
}

function focusInput() {
  if (props.disabled || props.readonly) {
    return;
  }
  codeInputRef.value?.focus({ preventScroll: true });
}

function scheduleAutofocus() {
  if (!props.autofocus || props.disabled || props.readonly) {
    return;
  }

  void nextTick(() => {
    focusInput();
    requestAnimationFrame(() => {
      focusInput();
      window.setTimeout(() => focusInput(), 0);
      window.setTimeout(() => focusInput(), 50);
    });
  });
}

function shouldCaptureKeydown(): boolean {
  if (props.disabled || props.readonly || !props.autofocus) {
    return false;
  }

  const activeElement = document.activeElement;
  if (activeElement === codeInputRef.value) {
    return false;
  }

  if (
    activeElement instanceof HTMLInputElement
    || activeElement instanceof HTMLTextAreaElement
    || (activeElement instanceof HTMLElement && activeElement.isContentEditable)
  ) {
    return false;
  }

  return codeInputRef.value != null;
}

function onWindowKeydown(event: KeyboardEvent) {
  if (!shouldCaptureKeydown()) {
    return;
  }

  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    updateCode(props.modelValue + event.key);
    focusInput();
    return;
  }

  if (event.key === 'Backspace') {
    event.preventDefault();
    updateCode(props.modelValue.slice(0, -1));
    focusInput();
  }
}

function sanitizeCode(value: string): string {
  return value.replace(/\D/g, '').slice(0, props.codeLength);
}

function updateCode(nextValue: string) {
  const sanitized = sanitizeCode(nextValue);
  if (sanitized === props.modelValue) {
    return;
  }

  emit('update:modelValue', sanitized);

  if (sanitized.length === props.codeLength) {
    emit('complete', sanitized);
  }
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  updateCode(target.value);
  target.value = props.modelValue;
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Backspace' && props.modelValue.length === 0) {
    event.preventDefault();
  }
}

async function onPasteClick() {
  if (props.disabled || props.readonly) {
    return;
  }

  emit('paste');

  if (typeof navigator === 'undefined' || !navigator.clipboard?.readText) {
    focusInput();
    return;
  }

  try {
    const text = await navigator.clipboard.readText();
    updateCode(text);
  } catch {
    focusInput();
  }
}

watch(
  () => props.state,
  (value, oldValue) => {
    if (value === 'error' && oldValue !== 'error') {
      triggerShake();
    }
    if (value === 'idle') {
      shakeActive.value = false;
      clearShakeTimer();
    }
  },
);

watch(
  () => props.codeLength,
  () => {
    updateCode(props.modelValue);
  },
);

watch(
  () => props.autofocus,
  (value) => {
    if (value) {
      scheduleAutofocus();
    }
  },
);

watch(
  () => [props.disabled, props.readonly] as const,
  () => {
    if (props.autofocus) {
      scheduleAutofocus();
    }
  },
);

onMounted(() => {
  scheduleAutofocus();
  document.addEventListener('keydown', onWindowKeydown, true);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onWindowKeydown, true);
  clearShakeTimer();
});

defineExpose({
  focus: focusInput,
});
</script>

<template>
  <div
    class="eds-verify-input"
    :class="[
      styles.root,
      widthMode === 'full' ? styles.widthFull : styles.widthFixed,
    ]"
    :data-verify-input-state="state"
  >
    <div
      :class="[
        styles.codeRow,
        state === 'error' && styles.codeRowError,
        shakeActive && styles.codeRowShake,
      ]"
      tabindex="-1"
      @click="focusInput"
      @focus="focusInput"
    >
      <input
        ref="codeInputRef"
        :class="styles.codeInput"
        type="text"
        inputmode="numeric"
        autocomplete="one-time-code"
        :maxlength="codeLength"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        aria-label="验证码"
        @input="onInput"
        @keydown="onKeydown"
      />

      <div
        v-for="(digit, index) in digits"
        :key="index"
        :class="[
          styles.codeCell,
          'eds-verify-input-cell',
          index === activeIndex
            && modelValue.length < codeLength
            && !disabled
            && !readonly
            && styles.codeCellActive,
        ]"
      >
        <span v-if="digit">{{ digit }}</span>
        <span
          v-else-if="
            index === activeIndex
              && modelValue.length < codeLength
              && !disabled
              && !readonly
          "
          :class="styles.caret"
          aria-hidden="true"
        />
      </div>
    </div>

    <div v-if="showPaste" :class="[styles.pasteAction, 'eds-verify-input-paste']">
      <EgLinkButton
        tone="brand"
        size="sm"
        href="#"
        :disabled="disabled"
        @click.prevent.stop="onPasteClick"
      >
        {{ pasteLabel }}
      </EgLinkButton>
    </div>
  </div>
</template>
