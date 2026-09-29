<script setup lang="ts">
import { computed } from 'vue';
import { EgDivider } from '../../atoms/divider';
import { EgButton } from '../button';
import { EgLinkButton } from '../link';
import styles from './ComboAction.module.css';

import type { ButtonSize, ButtonVariant } from '../button/Button.vue';
import type { LinkSize } from '../link/Link.vue';

export type ComboActionFlotationTone = 'brand' | 'decor';

export type ComboActionFlotationBarPadding = 'default' | 'inset-5' | 'compact';

const props = withDefaults(
  defineProps<{
    tone?: ComboActionFlotationTone;
    variant?: ButtonVariant;
    divider?: boolean;
    clear?: boolean;
    clearLabel?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    count?: 1 | 2 | '1' | '2';
    direction?: 'left' | 'right';
    barPadding?: ComboActionFlotationBarPadding;
    buttonSize?: ButtonSize;
  }>(),
  {
    tone: 'brand',
    variant: 'solid',
    divider: false,
    clear: false,
    clearLabel: '清空',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    count: 2,
    direction: 'right',
    barPadding: 'default',
    buttonSize: 'md',
  },
);

const resolvedCount = computed(() => (Number(props.count) === 1 ? 1 : 2));

const clearLinkSize = computed<LinkSize>(() => {
  if (props.buttonSize === 'lg') {
    return 'lg';
  }

  if (props.buttonSize === 'sm' || props.buttonSize === 'xs') {
    return 'sm';
  }

  return 'md';
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
  clear: [];
}>();
</script>

<template>
  <div :class="styles.flotationRoot">
    <EgDivider
      :class="[
        styles.divider,
        styles.dividerAnimated,
        !divider && styles.dividerAnimatedHidden,
      ]"
      type="module"
      direction="horizontal"
      :hide="!divider"
    />
    <div
      :class="[
        styles.flotationBar,
        direction === 'left' && styles.flotationBarStart,
        !clear && direction === 'right' && styles.flotationBarEnd,
        barPadding === 'inset-5' && styles.flotationBarInset5,
        barPadding === 'compact' && styles.flotationBarCompact,
      ]"
    >
      <EgLinkButton
        v-if="clear"
        :class="barPadding === 'compact' && styles.flotationClear"
        tone="brand"
        :size="clearLinkSize"
        href="#"
        @click.prevent="emit('clear')"
      >
        {{ clearLabel }}
      </EgLinkButton>
      <div
        :class="[
          styles.flotationActions,
          direction === 'left' && styles.flotationActionsStart,
        ]"
      >
        <EgButton
          v-if="resolvedCount === 2"
          tone="subtle"
          variant="text"
          :size="buttonSize"
          @click.stop="emit('cancel')"
        >
          {{ cancelLabel }}
        </EgButton>
        <EgButton
          :tone="tone"
          :variant="variant"
          :size="buttonSize"
          @click.stop="emit('confirm')"
        >
          {{ confirmLabel }}
        </EgButton>
      </div>
    </div>
  </div>
</template>
