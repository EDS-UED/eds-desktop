<script setup lang="ts">
import { computed } from 'vue';
import { EgButton } from '../button';
import type { ButtonVariant } from '../button/Button.vue';
import styles from './ComboAction.module.css';

export type ComboActionPopupTone = 'brand' | 'decor';

const props = withDefaults(
  defineProps<{
    tone?: ComboActionPopupTone;
    variant?: ButtonVariant;
    count?: 1 | 2 | '1' | '2';
    confirmLabel?: string;
    cancelLabel?: string;
    confirmDisabled?: boolean;
  }>(),
  {
    tone: 'brand',
    variant: 'solid',
    count: 2,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    confirmDisabled: false,
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const resolvedCount = computed(() => (Number(props.count) === 1 ? 1 : 2));
</script>

<template>
  <div :class="styles.popupRoot">
    <EgButton
      :class="styles.popupAction"
      :tone="tone"
      :variant="variant"
      size="md"
      :disabled="confirmDisabled"
      @click="emit('confirm')"
    >
      {{ confirmLabel }}
    </EgButton>
    <EgButton
      v-if="resolvedCount === 2"
      :class="styles.popupAction"
      tone="subtle"
      variant="text"
      size="md"
      @click="emit('cancel')"
    >
      {{ cancelLabel }}
    </EgButton>
  </div>
</template>
