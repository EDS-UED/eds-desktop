<script setup lang="ts">
import { ref } from 'vue';
import type { TooltipAlign, TooltipPlacement } from '../tooltip';
import EgAnchoredPopover from './AnchoredPopover.vue';
import RemarkPopoverPanel from './RemarkPopoverPanel.vue';
import { POPOVER_PRESET_WIDTH_BASE } from './popoverShape';
import type { PopoverHeightMode, PopoverWidthMode } from './Popover.vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    title?: string;
    maxLength?: number;
    label?: string;
    placeholder?: string;
    feedbackText?: string;
    confirmLabel?: string;
    hideConfirm?: boolean;
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
    modelValue: '',
    title: 'Remark',
    label: 'Remark',
    placeholder: 'Please enter',
    feedbackText: 'Optional, Max. 256 characters',
    confirmLabel: 'Confirm',
    hideConfirm: false,
    placement: 'top',
    align: 'center',
    boundarySelector: '.eds-data-list',
    teleportTo: '.app-preview',
    widthMode: 'fixed',
    width: POPOVER_PRESET_WIDTH_BASE,
    topToolClosable: true,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  confirm: [];
  dismiss: [];
}>();

const panelRef = ref<InstanceType<typeof RemarkPopoverPanel> | null>(null);

function onDismiss() {
  panelRef.value?.resetRemark();
  emit('update:modelValue', '');
  emit('dismiss');
}

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
    top-tool
    :top-tool-title="title"
    :top-tool-closable="topToolClosable"
    :on-before-open="onBeforeOpen"
    @dismiss="onDismiss"
  >
    <template #trigger="triggerSlot">
      <slot name="trigger" v-bind="triggerSlot" />
    </template>
    <template #default="{ close }">
      <RemarkPopoverPanel
        ref="panelRef"
        :model-value="modelValue"
        :max-length="maxLength"
        :label="label"
        :placeholder="placeholder"
        :feedback-text="feedbackText"
        :confirm-label="confirmLabel"
        :hide-confirm="hideConfirm"
        hide-label
        @update:model-value="emit('update:modelValue', $event)"
        @confirm="onConfirm(close)"
      />
    </template>
  </EgAnchoredPopover>
</template>
