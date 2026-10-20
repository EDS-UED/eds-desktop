<script setup lang="ts">
import { computed } from 'vue';
import { EgButton } from '../button';
import { EgDivider } from '../../atoms/divider';
import type { ButtonVariant } from '../button/Button.vue';
import styles from './ComboAction.module.css';

export type ComboActionPageTone = 'brand' | 'decor';

const props = withDefaults(
  defineProps<{
    tone?: ComboActionPageTone;
    variant?: ButtonVariant;
    divider?: boolean;
    direction?: 'left' | 'right';
    /** Page 场景按钮组左侧 28px 外边距。 */
    actionsLeadingInset?: boolean;
    loading?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
  }>(),
  {
    tone: 'brand',
    variant: 'solid',
    divider: false,
    direction: 'right',
    actionsLeadingInset: false,
    loading: false,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
  },
);

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const pageActionsRowClass = computed(() => [
  styles.pageActions,
  props.direction === 'left' ? styles.pageActionsLeft : styles.pageActionsRight,
]);

const pageActionsGroupClass = computed(() => [
  styles.pageActionsGroup,
  props.direction === 'right' && styles.pageActionsGroupAtRight,
  props.actionsLeadingInset &&
    props.direction === 'left' &&
    styles.pageActionsGroupLeadingInset,
]);
</script>

<template>
  <div
    v-if="divider"
    :class="[
      styles.pageRoot,
      direction === 'left' ? styles.pageRootAlignStart : styles.pageRootAlignEnd,
    ]"
  >
    <EgDivider
      :class="[styles.divider, styles.dividerAnimated]"
      type="module"
      direction="horizontal"
    />
    <div :class="pageActionsRowClass">
      <div :class="pageActionsGroupClass">
        <template v-if="direction === 'left'">
          <EgButton
            :tone="tone"
            :variant="variant"
            size="md"
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
            :loading="loading"
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </EgButton>
        </template>
      </div>
    </div>
  </div>
  <div v-else :class="pageActionsRowClass">
    <div :class="pageActionsGroupClass">
      <template v-if="direction === 'left'">
        <EgButton
          :tone="tone"
          :variant="variant"
          size="md"
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
          :loading="loading"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </EgButton>
      </template>
    </div>
  </div>
</template>
