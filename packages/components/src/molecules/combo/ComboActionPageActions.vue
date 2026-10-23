<script setup lang="ts">
import { EgButton } from '../button';
import type { ButtonVariant } from '../button/Button.vue';
defineProps<{
  tone: 'brand' | 'decor';
  variant: ButtonVariant;
  direction: 'left' | 'right';
  loading: boolean;
  confirmDisabled: boolean;
  confirmLabel: string;
  cancelLabel: string;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <template v-if="direction === 'left'">
    <EgButton
      :tone="tone"
      :variant="variant"
      size="md"
      :disabled="confirmDisabled"
      :loading="loading"
      @click="emit('confirm')"
    >
      {{ confirmLabel }}
    </EgButton>
    <EgButton tone="subtle" variant="text" size="md" @click="emit('cancel')">
      {{ cancelLabel }}
    </EgButton>
  </template>
  <template v-else>
    <EgButton tone="subtle" variant="text" size="md" @click="emit('cancel')">
      {{ cancelLabel }}
    </EgButton>
    <EgButton
      :tone="tone"
      :variant="variant"
      size="md"
      :disabled="confirmDisabled"
      :loading="loading"
      @click="emit('confirm')"
    >
      {{ confirmLabel }}
    </EgButton>
  </template>
</template>
