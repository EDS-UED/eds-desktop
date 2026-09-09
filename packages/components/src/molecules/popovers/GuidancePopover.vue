<script setup lang="ts">
import { ref, useSlots } from 'vue';
import type { TooltipAlign, TooltipPlacement } from '../tooltip';
import EgAnchoredPopover from './AnchoredPopover.vue';
import GuidancePopoverPanel from './GuidancePopoverPanel.vue';
import { POPOVER_PRESET_WIDTH_GUIDE } from './popoverShape';
import type { PopoverHeightMode, PopoverWidthMode } from './Popover.vue';
import styles from './GuidancePopover.module.css';

const slots = useSlots();

const props = withDefaults(
  defineProps<{
    body?: string;
    actionLabel?: string;
    title?: string;
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
    disabled?: boolean;
  }>(),
  {
    body: '引导说明文案',
    actionLabel: '知道了',
    title: 'Title',
    placement: 'top',
    align: 'center',
    boundarySelector: '.eds-popup',
    teleportTo: '.app-preview',
    widthMode: 'fixed',
    width: POPOVER_PRESET_WIDTH_GUIDE,
    heightMode: 'adaptive',
    topToolClosable: false,
    disabled: false,
  },
);

const emit = defineEmits<{
  action: [];
  dismiss: [];
  open: [];
}>();

const anchorRef = ref<{ close: () => void; open: () => void } | null>(null);

function onAction(close: () => void) {
  emit('action');
  close();
}

defineExpose({
  close: () => anchorRef.value?.close(),
  open: () => anchorRef.value?.open(),
});
</script>

<template>
  <div :class="styles.host">
    <EgAnchoredPopover
      ref="anchorRef"
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
      :top-tool="placement === 'top'"
      :top-tool-title="title"
      :top-tool-closable="topToolClosable"
      :disabled="disabled"
      :on-before-open="onBeforeOpen"
      @open="emit('open')"
      @dismiss="emit('dismiss')"
    >
      <template #trigger="triggerSlot">
        <slot name="trigger" v-bind="triggerSlot" />
      </template>
      <template #default="{ close }">
        <GuidancePopoverPanel
          :body="body"
          :action-label="actionLabel"
          @action="onAction(close)"
        >
          <template v-if="slots.body" #body>
            <slot name="body" />
          </template>
        </GuidancePopoverPanel>
      </template>
    </EgAnchoredPopover>
  </div>
</template>
