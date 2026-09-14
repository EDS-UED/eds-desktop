<script setup lang="ts">
import EgAnchoredPopover from '../../molecules/popovers/AnchoredPopover.vue';
import type { PopoverWidthMode } from '../../molecules/popovers';
import type { TooltipPlacement } from '../../molecules/tooltip';
import BatchBarActionItem from './BatchBarActionItem.vue';

const props = withDefaults(
  defineProps<{
    label: string;
    disabled?: boolean;
    loading?: boolean;
    danger?: boolean;
    placement?: TooltipPlacement;
    /** Popover 挂载容器；默认 .app-preview，避免与 BatchBar 层级冲突。 */
    teleportTo?: string | HTMLElement;
    /** 打开 Popover 前执行（如远端校验）；失败则不打开 Popover。 */
    onBeforeOpen?: () => void | Promise<void>;
    /** Popover 面板宽度模式；批处理 Remark 等引导场景用 fixed + 256。 */
    popoverWidthMode?: PopoverWidthMode;
    /** widthMode=fixed 时面板区宽度（px）。 */
    popoverWidth?: number;
    /** placement=top 时 Popover 顶部工具条。 */
    popoverTopTool?: boolean;
    popoverTopToolTitle?: string;
    popoverTopToolClosable?: boolean;
  }>(),
  {
    placement: 'top',
    disabled: false,
    loading: false,
    danger: false,
    teleportTo: '.app-preview',
  },
);

const emit = defineEmits<{
  confirm: [];
  dismiss: [];
}>();

function onConfirm(close: () => void) {
  emit('confirm');
  close();
}
</script>

<template>
  <EgAnchoredPopover
    :placement="placement"
    :disabled="disabled"
    :loading="loading"
    :teleport-to="teleportTo"
    boundary-selector=".eds-data-list"
    :on-before-open="onBeforeOpen"
    :width-mode="popoverWidthMode"
    :width="popoverWidth"
    :top-tool="popoverTopTool"
    :top-tool-title="popoverTopToolTitle"
    :top-tool-closable="popoverTopToolClosable"
    @dismiss="emit('dismiss')"
  >
    <template #trigger="{ active, loading: triggerLoading, onClick }">
      <BatchBarActionItem
        type="text"
        :label="label"
        :loading="triggerLoading"
        :danger="danger"
        :disabled="disabled"
        :active="active && !triggerLoading"
        @click.stop="onClick"
      />
    </template>
    <template #default="{ close }">
      <slot :confirm="() => onConfirm(close)" :close="close" />
    </template>
  </EgAnchoredPopover>
</template>
