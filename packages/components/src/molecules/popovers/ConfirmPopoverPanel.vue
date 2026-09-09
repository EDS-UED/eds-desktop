<script setup lang="ts">
import { EgButton, type ButtonTone } from '../button';
import { EgIcon } from '../../atoms/icons';
import { EgIconButton } from '../icon-button';
import styles from './ConfirmPopoverPanel.module.css';

const props = withDefaults(
  defineProps<{
    message: string;
    confirmLabel?: string;
    confirmTone?: ButtonTone;
    /** placement=bottom 等无 Popover topTool 时在面板内展示标题栏。 */
    title?: string;
    showInlineHeader?: boolean;
    closeLabel?: string;
  }>(),
  {
    confirmLabel: 'Confirm',
    confirmTone: 'danger',
    showInlineHeader: false,
    closeLabel: 'Close',
  },
);

const emit = defineEmits<{
  confirm: [];
  close: [];
}>();
</script>

<template>
  <div :class="styles.root" data-eds-confirm-popover>
    <div v-if="showInlineHeader && title" :class="styles.inlineHeader">
      <p :class="styles.inlineHeaderTitle">
        {{ title }}
      </p>
      <div :class="styles.inlineHeaderClose">
        <EgIconButton
          shape="square"
          size="sm"
          :label="closeLabel"
          motion="ease"
          @click="emit('close')"
        >
          <EgIcon name="eds-close-circle-fill" fit />
        </EgIconButton>
      </div>
    </div>

    <p :class="styles.message">
      {{ message }}
    </p>

    <div :class="styles.actions">
      <EgButton
        :tone="confirmTone"
        variant="solid"
        size="md"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </EgButton>
    </div>
  </div>
</template>
