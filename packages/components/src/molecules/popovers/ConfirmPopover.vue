<script setup lang="ts">
import { computed } from 'vue';
import type { TooltipAlign, TooltipPlacement } from '../tooltip';
import EgAnchoredPopover from './AnchoredPopover.vue';
import ConfirmPopoverPanel from './ConfirmPopoverPanel.vue';
import { POPOVER_PRESET_WIDTH_CONFIRM } from './popoverShape';
import type { PopoverHeightMode, PopoverWidthMode } from './Popover.vue';
import type { ButtonTone } from '../button';

const props = withDefaults(
  defineProps<{
    title?: string;
    message: string;
    confirmLabel?: string;
    confirmTone?: ButtonTone;
    closeLabel?: string;
    placement?: TooltipPlacement;
    align?: TooltipAlign;
    boundarySelector?: string;
    teleportTo?: string | HTMLElement;
    onBeforeOpen?: () => void | Promise<void>;
    widthMode?: PopoverWidthMode;
    width?: number;
    maxWidth?: number;
    heightMode?: PopoverHeightMode;
    height?: number;
    maxHeight?: number;
    topToolClosable?: boolean;
  }>(),
  {
    confirmLabel: 'Confirm',
    confirmTone: 'danger',
    closeLabel: 'Close',
    placement: 'bottom',
    align: 'center',
    boundarySelector: '.eds-popup',
    teleportTo: '.app-preview',
    widthMode: 'fixed',
    width: POPOVER_PRESET_WIDTH_CONFIRM,
    heightMode: 'adaptive',
    topToolClosable: true,
  },
);

const emit = defineEmits<{
  confirm: [];
  dismiss: [];
}>();

const usesPopoverTopTool = computed(() => props.placement === 'top');

function onConfirm(close: () => void) {
  emit('confirm');
  close();
}
</script>

<template>
  <EgAnchoredPopover
    :boundary-selector="boundarySelector"
    :teleport-to="teleportTo"
    :placement="placement"
    :align="align"
    :width-mode="widthMode"
    :width="width"
    :max-width="maxWidth"
    :height-mode="heightMode"
    :height="height"
    :max-height="maxHeight"
    :top-tool="usesPopoverTopTool"
    :top-tool-title="title"
    :top-tool-closable="topToolClosable"
    :on-before-open="onBeforeOpen"
    @dismiss="emit('dismiss')"
  >
    <template #trigger="triggerSlot">
      <slot name="trigger" v-bind="triggerSlot" />
    </template>
    <template #default="{ close }">
      <ConfirmPopoverPanel
        :message="message"
        :confirm-label="confirmLabel"
        :confirm-tone="confirmTone"
        :title="title"
        :show-inline-header="!usesPopoverTopTool"
        :close-label="closeLabel"
        @confirm="onConfirm(close)"
        @close="close"
      />
    </template>
  </EgAnchoredPopover>
</template>
