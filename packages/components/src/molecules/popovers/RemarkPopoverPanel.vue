<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { EgButton } from '../button';
import { EgComboTextarea } from '../combo';
import { EgFormSubmission } from '../feedback';
import styles from './RemarkPopoverPanel.module.css';
import { REMARK_POPOVER_MAX_LENGTH } from './popoverShape';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    maxLength?: number;
    label?: string;
    placeholder?: string;
    feedbackText?: string;
    /** true：隐藏 Combo 内 label（Popover topTool 已展示标题）。 */
    hideLabel?: boolean;
    /** true：不展示面板内确认按钮（由外层 Popup / BatchBar 承接）。 */
    hideConfirm?: boolean;
    confirmLabel?: string;
    /** 挂载后聚焦备注输入框。 */
    autofocus?: boolean;
    /** 挂载时清空 modelValue。 */
    resetOnMount?: boolean;
  }>(),
  {
    modelValue: '',
    maxLength: REMARK_POPOVER_MAX_LENGTH,
    label: 'Remark',
    placeholder: 'Please enter',
    feedbackText: 'Optional, Max. 256 characters',
    hideLabel: true,
    hideConfirm: false,
    confirmLabel: 'Confirm',
    autofocus: true,
    resetOnMount: true,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  confirm: [];
}>();

const remarkFieldRef = ref<HTMLElement | null>(null);

const remarkModel = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value.slice(0, props.maxLength)),
});

function getRemarkControlElement() {
  return remarkFieldRef.value?.querySelector('input, textarea') as
    | HTMLInputElement
    | HTMLTextAreaElement
    | null;
}

async function focusRemarkInput() {
  await nextTick();
  getRemarkControlElement()?.focus();

  window.requestAnimationFrame(() => {
    getRemarkControlElement()?.focus();
  });

  window.setTimeout(() => {
    getRemarkControlElement()?.focus();
  }, 120);
}

function resetRemark() {
  emit('update:modelValue', '');
}

onMounted(async () => {
  if (props.resetOnMount) {
    resetRemark();
  }
  if (props.autofocus) {
    await focusRemarkInput();
  }
});

function onConfirm() {
  emit('confirm');
}

defineExpose({
  focusRemarkInput,
  resetRemark,
});
</script>

<template>
  <div :class="styles.root" data-eds-remark-popover>
    <div
      ref="remarkFieldRef"
      :class="[
        styles.remarkField,
        hideLabel && styles.remarkFieldHideLabel,
      ]"
    >
      <EgComboTextarea
        v-model="remarkModel"
        feedback
        :label="label"
        :placeholder="placeholder"
      >
        <template #feedback>
          <EgFormSubmission
            type="notes"
            :text="feedbackText"
            :show-link="false"
          />
        </template>
      </EgComboTextarea>
    </div>

    <EgButton
      v-if="!hideConfirm"
      :class="styles.confirm"
      tone="decor"
      variant="solid"
      size="md"
      @click="onConfirm"
    >
      {{ confirmLabel }}
    </EgButton>
  </div>
</template>
