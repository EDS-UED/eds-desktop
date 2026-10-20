<script setup lang="ts">
import { EgDivider } from '../../atoms/divider';
import { EgButton } from '../button';
import styles from './ComboAction.module.css';

import type { ButtonVariant } from '../button/Button.vue';

export type ComboActionSkidTone = 'brand' | 'decor' | 'danger';

withDefaults(
  defineProps<{
    tone?: ComboActionSkidTone;
    variant?: ButtonVariant;
    divider?: boolean;
    loading?: boolean;
    confirmLabel?: string;
  }>(),
  {
    tone: 'brand',
    variant: 'solid',
    divider: false,
    loading: false,
    confirmLabel: 'Confirm',
  },
);

const emit = defineEmits<{
  confirm: [];
}>();
</script>

<template>
  <div :class="styles.skidRoot">
    <EgDivider :hide="!divider" />
    <div :class="styles.skidActions">
      <EgButton
        :class="styles.fullWidth"
        :tone="tone"
        :variant="variant"
        size="md"
        :loading="loading"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </EgButton>
    </div>
  </div>
</template>
